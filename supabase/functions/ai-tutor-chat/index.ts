// ============================================================================
// Supabase Edge Function: ai-tutor-chat
// ============================================================================
// Authenticated personalized university AI Tutor endpoint powered by Google Gemini.
// Enforces JWT verification, conversation ownership, server-side student academic
// context assembly, daily request quotas, bounded history, and strict output validation.
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  MAX_HISTORY_TURNS,
  buildCorsHeaders,
  buildTrustedSystemPrompt,
  isOriginPermitted,
  parseAndValidateModelResponse,
  validateTutorRequest,
} from "./tutor-core.ts";

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildConversationTitle(question: string, suggestedTitle: string | null): string {
  if (suggestedTitle && suggestedTitle.trim().length >= 3) {
    return suggestedTitle.trim().slice(0, 120);
  }
  const clean = question.replace(/\s+/g, " ").trim();
  if (!clean) return "New AI Tutor Chat";
  return clean.length > 56 ? `${clean.slice(0, 53)}...` : clean;
}

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const extraOrigins = Deno.env.get("ALLOWED_CORS_ORIGINS") || "";
  const corsHeaders = buildCorsHeaders(origin, extraOrigins);

  if (req.method === "OPTIONS") {
    if (!isOriginPermitted(origin, extraOrigins)) {
      return new Response("Forbidden origin", { status: 403 });
    }
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, corsHeaders);
  }

  if (!isOriginPermitted(origin, extraOrigins)) {
    return jsonResponse({ code: "ORIGIN_NOT_ALLOWED", error: "Origin not permitted." }, 403, corsHeaders);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
    const dailyLimit = Math.max(1, Number(Deno.env.get("AI_TUTOR_DAILY_LIMIT") || "30") || 30);
    const cooldownSeconds = Math.max(0, Number(Deno.env.get("AI_TUTOR_COOLDOWN_SECONDS") || "2") || 2);

    if (!supabaseUrl || !supabaseServiceKey) {
      return jsonResponse(
        { code: "SERVER_MISCONFIGURED", error: "AI Tutor backend environment is incomplete." },
        503,
        corsHeaders
      );
    }

    if (!geminiApiKey) {
      return jsonResponse(
        {
          code: "GEMINI_NOT_CONFIGURED",
          error: "AI Tutor is not enabled yet because GEMINI_API_KEY is missing on the server.",
        },
        503,
        corsHeaders
      );
    }

    // 1. Verify Supabase Auth JWT
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return jsonResponse(
        { code: "UNAUTHORIZED", error: "Authentication session missing. Please sign in again." },
        401,
        corsHeaders
      );
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data: authResult, error: authError } = await adminClient.auth.getUser(token);
    const user = authResult?.user;
    if (authError || !user) {
      return jsonResponse(
        { code: "INVALID_SESSION", error: "Your session expired. Please sign in again." },
        401,
        corsHeaders
      );
    }

    // 2. Parse & validate incoming payload (client context fields treated as untrusted)
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch (_) {
      return jsonResponse({ code: "INVALID_JSON", error: "Request body must be valid JSON." }, 400, corsHeaders);
    }

    const validated = validateTutorRequest(rawBody);
    if (!validated.ok || !validated.data) {
      return jsonResponse({ code: "VALIDATION_ERROR", error: validated.error || "Invalid input." }, 400, corsHeaders);
    }
    const payload = validated.data;

    // 3. Enforce per-student daily quota & anti-spam cooldown before calling Gemini
    const todayIso = new Date().toISOString().slice(0, 10);
    const { data: quotaRow, error: quotaReadErr } = await adminClient
      .from("ai_tutor_usage_quotas")
      .select("request_count, estimated_tokens, last_request_at")
      .eq("student_id", user.id)
      .eq("usage_date", todayIso)
      .maybeSingle();

    if (quotaReadErr) {
      return jsonResponse(
        { code: "DB_ERROR", error: "AI Tutor database schema is unavailable or not yet deployed." },
        503,
        corsHeaders
      );
    }

    const currentCount = Number(quotaRow?.request_count || 0);
    if (currentCount >= dailyLimit) {
      return jsonResponse(
        {
          code: "DAILY_QUOTA_EXCEEDED",
          error: `Daily AI Tutor limit (${dailyLimit} messages) reached. Your quota resets tomorrow.`,
          quota: { used: currentCount, limit: dailyLimit, remaining: 0 },
        },
        429,
        corsHeaders
      );
    }

    if (cooldownSeconds > 0 && quotaRow?.last_request_at) {
      const elapsedSec = (Date.now() - new Date(quotaRow.last_request_at).getTime()) / 1000;
      if (Number.isFinite(elapsedSec) && elapsedSec >= 0 && elapsedSec < cooldownSeconds) {
        return jsonResponse(
          {
            code: "RATE_LIMITED",
            error: "Please wait a couple seconds before sending another question.",
            retryAfterSeconds: Math.ceil(cooldownSeconds - elapsedSec),
          },
          429,
          corsHeaders
        );
      }
    }

    // 4. Resolve verified subject from Postgres catalog (ignore untrusted IDs)
    let resolvedSubject: { id: string; name: string; slug: string } | null = null;
    if (payload.subjectSlug) {
      const { data: subBySlug } = await adminClient
        .from("subjects")
        .select("id, name, slug")
        .eq("slug", payload.subjectSlug)
        .maybeSingle();
      if (subBySlug) resolvedSubject = subBySlug;
    } else if (payload.subjectId) {
      const { data: subById } = await adminClient
        .from("subjects")
        .select("id, name, slug")
        .eq("id", payload.subjectId)
        .maybeSingle();
      if (subById) resolvedSubject = subById;
    }

    // 5. Load or create owned conversation
    let conversation: Record<string, unknown> | null = null;
    if (payload.conversationId) {
      const { data: existingConv, error: convErr } = await adminClient
        .from("ai_tutor_conversations")
        .select("*")
        .eq("id", payload.conversationId)
        .maybeSingle();

      if (convErr || !existingConv) {
        return jsonResponse({ code: "CONVERSATION_NOT_FOUND", error: "Conversation not found." }, 404, corsHeaders);
      }
      if (existingConv.student_id !== user.id) {
        return jsonResponse({ code: "FORBIDDEN", error: "Unauthorized conversation access." }, 403, corsHeaders);
      }

      const nextSubjectId = resolvedSubject?.id ?? existingConv.subject_id;
      const nextSubjectSlug = resolvedSubject?.slug ?? payload.subjectSlug ?? existingConv.subject_slug;
      const { data: updatedConv } = await adminClient
        .from("ai_tutor_conversations")
        .update({
          subject_id: nextSubjectId,
          subject_slug: nextSubjectSlug,
          difficulty: payload.difficulty,
          teaching_mode: payload.teachingMode,
          preferred_language: payload.preferredLanguage,
        })
        .eq("id", existingConv.id)
        .eq("student_id", user.id)
        .select()
        .single();

      conversation = updatedConv || existingConv;
    } else {
      const { data: createdConv, error: createErr } = await adminClient
        .from("ai_tutor_conversations")
        .insert({
          student_id: user.id,
          title: buildConversationTitle(payload.message, null),
          subject_id: resolvedSubject?.id || null,
          subject_slug: resolvedSubject?.slug || payload.subjectSlug || null,
          difficulty: payload.difficulty,
          teaching_mode: payload.teachingMode,
          preferred_language: payload.preferredLanguage,
        })
        .select()
        .single();

      if (createErr || !createdConv) {
        return jsonResponse(
          { code: "DB_ERROR", error: "Could not create a new tutor conversation." },
          500,
          corsHeaders
        );
      }
      conversation = createdConv;
    }

    const conversationId = String(conversation.id);

    // 6. Persist student message (unless regenerating answer for existing latest student prompt)
    let activePromptText = payload.message;
    let studentMessageRow: Record<string, unknown> | null = null;

    if (payload.regenerateLast) {
      const { data: latestMessages } = await adminClient
        .from("ai_tutor_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(6);

      const lastStudent = (latestMessages || []).find((m) => m.role === "student");
      if (!lastStudent) {
        return jsonResponse(
          { code: "NOTHING_TO_REGENERATE", error: "No previous student question found to regenerate." },
          400,
          corsHeaders
        );
      }
      activePromptText = String(lastStudent.content || "");
      studentMessageRow = lastStudent;
    } else {
      const { data: savedStudentMsg, error: msgErr } = await adminClient
        .from("ai_tutor_messages")
        .insert({
          conversation_id: conversationId,
          role: "student",
          content: payload.message,
          metadata: {
            difficulty: payload.difficulty,
            teachingMode: payload.teachingMode,
            language: payload.preferredLanguage,
            subjectSlug: resolvedSubject?.slug || payload.subjectSlug || null,
          },
        })
        .select()
        .single();

      if (msgErr || !savedStudentMsg) {
        return jsonResponse(
          { code: "DB_ERROR", error: "Could not save your question." },
          500,
          corsHeaders
        );
      }
      studentMessageRow = savedStudentMsg;
    }

    // 7. Reconstruct trusted student academic context from Supabase DB
    const [profileRes, enrolledRes, tasksRes, quizRes] = await Promise.all([
      adminClient
        .from("profiles")
        .select("university, faculty, major")
        .eq("id", user.id)
        .maybeSingle(),
      adminClient
        .from("student_subjects")
        .select("subject:subjects(name)")
        .eq("student_id", user.id)
        .limit(12),
      adminClient
        .from("tasks")
        .select("title, deadline, subject:subjects(name)")
        .eq("student_id", user.id)
        .eq("completed", false)
        .order("deadline", { ascending: true })
        .limit(5),
      adminClient
        .from("quiz_attempts")
        .select("score, total_questions, subject:subjects(name)")
        .eq("student_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(5),
    ]);

    const enrolledSubjects = (enrolledRes.data || [])
      .map((row: any) => row?.subject?.name)
      .filter((name: unknown): name is string => typeof name === "string" && name.length > 0);

    const upcomingTasks = (tasksRes.data || []).map((t: any) => ({
      title: String(t.title || ""),
      subject: String(t.subject?.name || "General"),
      deadline: String(t.deadline || ""),
    }));

    const recentQuizSummary = (quizRes.data || []).map((q: any) => {
      const total = Number(q.total_questions || 0);
      const score = Number(q.score || 0);
      return {
        subject: String(q.subject?.name || "Quiz"),
        percentage: total > 0 ? Math.round((score / total) * 100) : 0,
      };
    });

    const activeSubjectName =
      resolvedSubject?.name ||
      payload.subjectName ||
      (typeof conversation.subject_slug === "string" ? conversation.subject_slug : "") ||
      "General University Study";

    const systemPrompt = buildTrustedSystemPrompt({
      major: profileRes.data?.major || "",
      faculty: profileRes.data?.faculty || "",
      university: profileRes.data?.university || "",
      enrolledSubjects,
      subjectName: activeSubjectName,
      difficulty: payload.difficulty,
      teachingMode: payload.teachingMode,
      preferredLanguage: payload.preferredLanguage,
      upcomingTasks,
      recentQuizSummary,
    });

    // 8. Load bounded chronological history from ai_tutor_messages
    const { data: historyRows } = await adminClient
      .from("ai_tutor_messages")
      .select("id, role, content, metadata, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(MAX_HISTORY_TURNS);

    const chronologicalHistory = (historyRows || []).reverse();
    const subjectSlugNow = resolvedSubject?.slug || payload.subjectSlug || null;
    const contents = chronologicalHistory
      .filter((row) => {
        // Keep history tightly scoped to current subject or untagged messages
        const msgSubject = (row.metadata as Record<string, unknown> | null)?.subjectSlug;
        return !subjectSlugNow || !msgSubject || msgSubject === subjectSlugNow;
      })
      .map((row) => ({
        role: row.role === "assistant" ? "model" : "user",
        parts: [{ text: String(row.content || "") }],
      }));

    if (contents.length === 0) {
      contents.push({ role: "user", parts: [{ text: activePromptText }] });
    }

    // 9. Call Google Gemini REST API server-side
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`;
    let geminiResponse: Response;
    try {
      geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1400,
            responseMimeType: "application/json",
          },
        }),
      });
    } catch (fetchErr: any) {
      const isTimeout = fetchErr?.name === "TimeoutError" || fetchErr?.name === "AbortError";
      return jsonResponse(
        {
          code: isTimeout ? "AI_TIMEOUT" : "AI_NETWORK_ERROR",
          error: isTimeout
            ? "AI Tutor took too long to respond. Your question is saved — click Retry."
            : "Could not reach the AI Tutor service. Please try again.",
          conversationId,
          studentMessage: studentMessageRow,
        },
        504,
        corsHeaders
      );
    }

    if (!geminiResponse.ok) {
      const isRate = geminiResponse.status === 429 || geminiResponse.status === 503;
      return jsonResponse(
        {
          code: isRate ? "AI_PROVIDER_BUSY" : "AI_PROVIDER_ERROR",
          error: isRate
            ? "AI Tutor is temporarily busy or free-tier quota was reached. Please wait a moment and retry."
            : "AI Tutor could not generate an answer right now. Please try again.",
          conversationId,
          studentMessage: studentMessageRow,
        },
        isRate ? 429 : 502,
        corsHeaders
      );
    }

    const geminiJson = await geminiResponse.json();
    const rawCandidate = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsedReply = parseAndValidateModelResponse(rawCandidate, activePromptText);

    if (!parsedReply.ok || !parsedReply.data) {
      return jsonResponse(
        {
          code: "INVALID_AI_RESPONSE",
          error: "AI Tutor returned an unreadable response. Please retry.",
          conversationId,
          studentMessage: studentMessageRow,
        },
        502,
        corsHeaders
      );
    }

    const totalTokens = Number(geminiJson?.usageMetadata?.totalTokenCount || 0) || 0;

    // 10. Save validated assistant response & update quota/title/learning session
    const assistantMetadata = {
      difficulty: payload.difficulty,
      teachingMode: payload.teachingMode,
      language: payload.preferredLanguage,
      subjectSlug: subjectSlugNow,
      subjectName: activeSubjectName,
      recommendedQuizTopic: parsedReply.data.recommendedQuizTopic,
      followUpPrompts: parsedReply.data.followUpPrompts,
      studyPlanTasks: parsedReply.data.studyPlanTasks,
      model: geminiModel,
    };

    const { data: savedAssistantMsg, error: assistantErr } = await adminClient
      .from("ai_tutor_messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: parsedReply.data.answer,
        metadata: assistantMetadata,
      })
      .select()
      .single();

    if (assistantErr || !savedAssistantMsg) {
      return jsonResponse(
        {
          code: "DB_ERROR",
          error: "Generated answer could not be saved to history. Please retry.",
          conversationId,
        },
        500,
        corsHeaders
      );
    }

    const nextCount = currentCount + 1;
    await adminClient.from("ai_tutor_usage_quotas").upsert(
      {
        student_id: user.id,
        usage_date: todayIso,
        request_count: nextCount,
        estimated_tokens: Number(quotaRow?.estimated_tokens || 0) + totalTokens,
        last_request_at: new Date().toISOString(),
      },
      { onConflict: "student_id,usage_date" }
    );

    if (conversation.title === "New AI Tutor Chat" && parsedReply.data.suggestedTitle) {
      const { data: retitled } = await adminClient
        .from("ai_tutor_conversations")
        .update({ title: buildConversationTitle(activePromptText, parsedReply.data.suggestedTitle) })
        .eq("id", conversationId)
        .eq("student_id", user.id)
        .select()
        .single();
      if (retitled) conversation = retitled;
    }

    // Record at most 1 tutor_session entry per conversation to avoid streak/metric inflation
    const { data: existingSession } = await adminClient
      .from("ai_tutor_learning_sessions")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("activity_type", "tutor_session")
      .limit(1);

    if (!existingSession || existingSession.length === 0) {
      await adminClient.from("ai_tutor_learning_sessions").insert({
        student_id: user.id,
        subject_id: resolvedSubject?.id || null,
        subject_slug: subjectSlugNow,
        conversation_id: conversationId,
        topic: (parsedReply.data.recommendedQuizTopic || buildConversationTitle(activePromptText, null)).slice(0, 255),
        difficulty: payload.difficulty,
        teaching_mode: payload.teachingMode,
        activity_type: "tutor_session",
      });
    }

    return jsonResponse(
      {
        conversation,
        studentMessage: studentMessageRow,
        assistantMessage: savedAssistantMsg,
        structured: {
          recommendedQuizTopic: parsedReply.data.recommendedQuizTopic,
          followUpPrompts: parsedReply.data.followUpPrompts,
          studyPlanTasks: parsedReply.data.studyPlanTasks,
        },
        quota: {
          used: nextCount,
          limit: dailyLimit,
          remaining: Math.max(0, dailyLimit - nextCount),
        },
      },
      200,
      corsHeaders
    );
  } catch (_) {
    return jsonResponse(
      { code: "INTERNAL_ERROR", error: "AI Tutor is temporarily unavailable. Please try again later." },
      500,
      corsHeaders
    );
  }
});
