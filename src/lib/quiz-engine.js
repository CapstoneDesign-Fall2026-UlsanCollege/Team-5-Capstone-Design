/**
 * Quiz Engine — Pure Selection, Filtering, Fingerprinting & Repetition Prevention
 *
 * Zero DOM or network dependencies. Shared by curated quiz service, AI quiz fallback,
 * and unit tests so subject isolation, difficulty filtering, and per-student
 * repetition prevention behave identically everywhere.
 */

export const VALID_DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

export function normalizeDifficulty(value) {
  const clean = String(value || 'all').trim().toLowerCase();
  return VALID_DIFFICULTIES.includes(clean) ? clean : 'all';
}

export function normalizeQuestionText(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function questionFingerprint(q) {
  if (!q || typeof q !== 'object') return '';
  return normalizeQuestionText(q.question ?? q.q ?? '');
}

export function isValidQuizItem(q) {
  if (!q || typeof q !== 'object') return false;
  const text = String(q.question ?? q.q ?? '').trim();
  if (text.length < 5) return false;
  const opts = Array.isArray(q.options) ? q.options : [];
  if (opts.length !== 4) return false;
  const distinct = new Set(opts.map((o) => String(o).trim().toLowerCase()).filter(Boolean));
  if (distinct.size < 4) return false;
  const ans = q.correct_answer ?? q.answer;
  if (typeof ans !== 'number' || !Number.isInteger(ans) || ans < 0 || ans > 3) return false;
  return true;
}

export function shuffleArray(items, rng = Math.random) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function matchesSubject(item, subjectId, subjectSlug) {
  if (item.subject_id && subjectId && String(item.subject_id) !== String(subjectId)) {
    // Allow slug match only if item.subject_id is actually a slug matching subjectSlug
    if (!subjectSlug || String(item.subject_id) !== String(subjectSlug)) {
      return false;
    }
  }
  if (item.subject_slug && subjectSlug && String(item.subject_slug) !== String(subjectSlug)) {
    return false;
  }
  return true;
}

/**
 * Filter a raw question pool by subject, validity, intra-pool uniqueness, and difficulty.
 * Never upgrades or downgrades difficulty: requesting 'hard' returns ONLY 'hard' questions.
 */
export function filterQuestionsForQuiz(pool, { subjectId = null, subjectSlug = null, difficulty = 'all' } = {}) {
  const targetDiff = normalizeDifficulty(difficulty);
  const seenIds = new Set();
  const seenFingerprints = new Set();
  const filtered = [];

  for (const raw of Array.isArray(pool) ? pool : []) {
    if (!isValidQuizItem(raw)) continue;
    if (!matchesSubject(raw, subjectId, subjectSlug)) continue;

    const itemDiff = raw.difficulty ? normalizeDifficulty(raw.difficulty) : null;
    if (targetDiff !== 'all' && itemDiff !== targetDiff) continue;

    const fp = questionFingerprint(raw);
    if (!fp || seenFingerprints.has(fp)) continue;
    if (raw.id && seenIds.has(String(raw.id))) continue;

    if (raw.id) seenIds.add(String(raw.id));
    seenFingerprints.add(fp);

    filtered.push({
      ...raw,
      question: String(raw.question ?? raw.q).trim(),
      correct_answer: raw.correct_answer ?? raw.answer,
      difficulty: itemDiff,
      fingerprint: raw.fingerprint || fp,
    });
  }

  return filtered;
}

/**
 * Select up to `limit` questions for a student, prioritizing unseen questions first.
 */
export function selectQuizQuestions(
  pool,
  {
    subjectId = null,
    subjectSlug = null,
    subjectName = 'this subject',
    difficulty = 'all',
    limit = 15,
    seenIds = [],
    seenFingerprints = [],
    allowReuse = true,
    rng = Math.random,
  } = {}
) {
  const targetDiff = normalizeDifficulty(difficulty);
  const targetCount = Math.max(1, Number(limit) || 15);
  const eligible = filterQuestionsForQuiz(pool, { subjectId, subjectSlug, difficulty: targetDiff });
  const totalEligible = eligible.length;
  const diffLabel = targetDiff === 'all' ? '' : `${targetDiff.charAt(0).toUpperCase() + targetDiff.slice(1)} `;

  if (totalEligible === 0) {
    return {
      questions: [],
      totalEligible: 0,
      unseenCount: 0,
      reusedCount: 0,
      poolExhausted: false,
      shortageMessage:
        targetDiff === 'all'
          ? `No curated questions are available for ${subjectName} yet.`
          : `No ${diffLabel.trim()} questions are classified for ${subjectName} yet. Try "All Difficulties" or the AI Quiz Generator.`,
    };
  }

  const seenIdSet = new Set(Array.from(seenIds || [], (v) => String(v)));
  const seenFpSet = new Set(Array.from(seenFingerprints || [], (v) => normalizeQuestionText(v)).filter(Boolean));

  const unseen = [];
  const previouslySeen = [];

  for (const item of eligible) {
    const idHit = item.id && seenIdSet.has(String(item.id));
    const fpHit = item.fingerprint && seenFpSet.has(item.fingerprint);
    if (idHit || fpHit) {
      previouslySeen.push(item);
    } else {
      unseen.push(item);
    }
  }

  const shuffledUnseen = shuffleArray(unseen, rng);
  const shuffledSeen = shuffleArray(previouslySeen, rng);

  let selected = [];
  let reusedCount = 0;

  if (shuffledUnseen.length >= targetCount) {
    selected = shuffledUnseen.slice(0, targetCount);
  } else if (allowReuse) {
    selected = [...shuffledUnseen];
    const needed = targetCount - selected.length;
    const filler = shuffledSeen.slice(0, needed);
    reusedCount = filler.length;
    selected.push(...filler);
  } else {
    selected = shuffledUnseen;
  }

  const poolExhausted = shuffledUnseen.length === 0;
  let shortageMessage = null;

  if (totalEligible < targetCount) {
    shortageMessage =
      shuffledUnseen.length === totalEligible
        ? `Only ${totalEligible} ${diffLabel}${subjectName} question${totalEligible === 1 ? '' : 's'} available.`
        : `Only ${totalEligible} ${diffLabel}${subjectName} question${totalEligible === 1 ? '' : 's'} available (${shuffledUnseen.length} new, ${reusedCount} review).`;
  } else if (poolExhausted) {
    shortageMessage = `You have already practiced all ${totalEligible} ${diffLabel}${subjectName} questions. Reshuffling for review.`;
  } else if (reusedCount > 0) {
    shortageMessage = `Only ${shuffledUnseen.length} new ${diffLabel}${subjectName} question${shuffledUnseen.length === 1 ? '' : 's'} remained; included ${reusedCount} previously answered question${reusedCount === 1 ? '' : 's'}.`;
  }

  return {
    questions: selected,
    totalEligible,
    unseenCount: shuffledUnseen.length,
    reusedCount,
    poolExhausted,
    shortageMessage,
  };
}
