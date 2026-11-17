// ============================================================================
// Supabase Edge Function: generate-ai-quiz
// ============================================================================
// Securely generates topic-specific academic quiz questions using Google Gemini API.
// Validates student JWT, enforces difficulty & subject rigor, deduplicates against
// recent question fingerprints, validates schema, and stores in PostgreSQL.
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  subjectId: string;
  subjectName: string;
  topic: string;
  difficulty?: "easy" | "medium" | "hard";
  questionCount?: number;
  university?: string;
  major?: string;
  recentFingerprints?: string[];
}

interface RawQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

function normalizeFingerprint(text: string): string {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function difficultyGuidance(diff: "easy" | "medium" | "hard"): string {
  if (diff === "easy") {
    return "EASY: Focus on foundational definitions, basic concepts, and direct recognition/identification.";
  }
  if (diff === "hard") {
    return "HARD: Focus on multi-step problem solving, scenario analysis, complex calculations, trade-offs, and edge cases. Do not make questions hard merely by using longer vocabulary.";
  }
  return "MEDIUM: Focus on applying concepts to concrete examples, straightforward calculations, or comparing mechanisms.";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired student session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: RequestBody = await req.json();
    const {
      subjectId,
      subjectName,
      topic,
      difficulty = "medium",
      questionCount = 5,
      university = "",
      major = "",
      recentFingerprints = [],
    } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Valid topic of at least 2 characters is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const count = Math.min(Math.max(Number(questionCount) || 5, 1), 20);
    const validDifficulty = (["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium") as
      | "easy"
      | "medium"
      | "hard";

    const recentSet = new Set(
      (Array.isArray(recentFingerprints) ? recentFingerprints : [])
        .slice(0, 40)
        .map((fp) => normalizeFingerprint(String(fp)))
        .filter(Boolean)
    );

    const contextLine = major
      ? `Student Major: ${major}${university ? ` (${university})` : ""}`
      : university
      ? `Institution Context: ${university}`
      : "";

    const avoidNote =
      recentSet.size > 0
        ? `\nAvoid repeating or paraphrasing any of these recent question concepts:\n- ${Array.from(recentSet).slice(0, 15).join("\n- ")}`
        : "";

    const prompt = `You are a university professor creating an academic multiple-choice quiz.
Subject: ${subjectName || "Computer Science / Engineering"}
Topic: ${topic.trim()}
${contextLine}
Difficulty: ${validDifficulty.toUpperCase()}
${difficultyGuidance(validDifficulty)}
Total Questions: ${count}

Instructions:
1. Every question MUST be strictly grounded in ${subjectName || "the selected subject"} and the topic "${topic.trim()}". Never use generic software/system-design templates for unrelated subjects.
2. Each question must test a distinct concept or reasoning skill—no duplicate or near-duplicate questions in the batch.
3. Each question must have exactly 4 plausible, distinct answer options.
4. Mark the 0-based index of the single unambiguously correct answer (0, 1, 2, or 3).
5. Provide a clear pedagogical explanation (1-3 sentences) explaining why that answer is correct.
6. Return ONLY a valid JSON array without markdown formatting, code fences, or backticks.${avoidNote}

Expected JSON format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Explanation why Option A is correct."
  }
]`;

    let generatedQuestions: RawQuestion[] = [];

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not configured on server.");
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${geminiApiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    generatedQuestions = JSON.parse(rawText);

    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      throw new Error("AI returned an empty or invalid question array.");
    }

    const validatedQuestions: RawQuestion[] = [];
    const seenQuestions = new Set<string>(recentSet);

    for (const q of generatedQuestions) {
      if (!q.question || typeof q.question !== "string") continue;
      if (!Array.isArray(q.options) || q.options.length !== 4) continue;
      if (typeof q.correct_answer !== "number" || q.correct_answer < 0 || q.correct_answer > 3) continue;

      const distinctOpts = new Set(q.options.map((opt) => String(opt).trim().toLowerCase()).filter(Boolean));
      if (distinctOpts.size < 4) continue;

      const fp = normalizeFingerprint(q.question);
      if (!fp || seenQuestions.has(fp)) continue;
      seenQuestions.add(fp);

      validatedQuestions.push({
        question: q.question.trim(),
        options: q.options.map((opt) => String(opt).trim()),
        correct_answer: q.correct_answer,
        explanation: q.explanation ? String(q.explanation).trim() : "Correct answer based on standard academic principles.",
      });
    }

    if (validatedQuestions.length === 0) {
      throw new Error("Failed to validate any AI-generated questions.");
    }

    const { data: quizRecord, error: quizError } = await supabaseClient
      .from("ai_quizzes")
      .insert({
        subject_id: subjectId,
        topic: topic.trim(),
        difficulty: validDifficulty,
        question_count: validatedQuestions.length,
        created_by: user.id,
        status: "completed",
      })
      .select()
      .single();

    if (quizError || !quizRecord) {
      throw new Error(`Database error creating AI quiz record: ${quizError?.message}`);
    }

    const questionsToInsert = validatedQuestions.map((q, idx) => ({
      ai_quiz_id: quizRecord.id,
      question_text: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      question_order: idx + 1,
    }));

    const { error: insertQuestionsError } = await supabaseClient
      .from("ai_quiz_questions")
      .insert(questionsToInsert);

    if (insertQuestionsError) {
      throw new Error(`Database error saving questions: ${insertQuestionsError.message}`);
    }

    return new Response(
      JSON.stringify({
        quizId: quizRecord.id,
        topic: quizRecord.topic,
        difficulty: quizRecord.difficulty,
        questionCount: validatedQuestions.length,
        questions: validatedQuestions,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to generate AI quiz" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
