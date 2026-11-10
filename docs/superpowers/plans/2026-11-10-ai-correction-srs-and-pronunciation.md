# Gerçek AI Anlık Düzeltme, Hata Defteri & Aralıklı Tekrar (SRS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kullanıcıların yabancı dil öğrenme ve konuşma sorununu kökünden çözmek için:
1) Yapay zekâ ile anlık cümle/gramer analizi ve yerli gibi konuşma önerileri ("Native Speaker Phrasing"),
2) Otomatik Akıllı Hata Defteri (Personal Error Vault),
3) Bilimsel SuperMemo SM-2 Aralıklı Tekrar Sistemi (Spaced Repetition Review Queue),
4) Gelişmiş hece düzeyinde telaffuz puanlama motorunu Chirmo'ya entegre etmek.

**Architecture:**
- `AiCorrectionService`: Kullanıcının hedef dilde (İngilizce, Almanca, Fransızca) kurduğu cümleleri Gemini API ve yerel pedagojik kural motoruyla anlık analiz eder, hataları kategorize eder ve `localStorage` hata kasasına kaydeder.
- `ChirmoErrorVaultModal`: Kullanıcının yaptığı tüm hataları Türkçesi, doğru hali ve sesletimiyle listeleyen, alıştırma yaptırıp temizleten arayüz.
- `SpacedRepetitionService`: SuperMemo SM-2 algoritmasıyla kelimeleri, kalıpları ve hataları 1, 3, 7, 14, 30 günlük aralıklı tekrar sırasına koyar ve günlük tekrar kuyruğunu (`ReviewQueue`) yönetir.
- `ChirmoDailySrsReviewModal`: Kullanıcının her gün 3-5 dakikada unutulmak üzere olan bilgileri kalıcı hafızaya aktardığı interaktif kart oturumu.

**Tech Stack:** TypeScript, React, Vite, Tailwind CSS, Lucide Icons, Web Speech API, Google Gemini API, Vitest.

---

### Task 1: AI Grammar & Expression Correction Engine + Error Vault Service & Unit Tests

**Files:**
- Create: `src/renderer/src/services/aiCorrectionService.ts`
- Create: `tests/ai-correction.test.ts`
- Modify: `src/renderer/src/services/geminiAiTeacherService.ts`

**Interfaces:**
```ts
export type ErrorCategory = 'grammar' | 'vocabulary' | 'word_order' | 'preposition' | 'article' | 'spelling' | 'fluency';

export interface SentenceCorrectionAnalysis {
  originalText: string;
  isPerfect: boolean;
  correctedText: string;
  nativeAlternative: string;
  explanationTr: string;
  errorCategory?: ErrorCategory;
  detectedMistakeWord?: string;
  targetLang: 'en' | 'de' | 'fr';
  analyzedAt: string;
}

export interface UserMistakeRecord extends SentenceCorrectionAnalysis {
  id: string;
  reviewCount: number;
  mastered: boolean;
  lastReviewedAt?: string;
}
```

- [ ] **Step 1: Write failing unit test for `AiCorrectionService`**
Create `tests/ai-correction.test.ts` with tests for:
  - Analyzing an incorrect English sentence ("I am agree with you") -> detects error, provides "I agree with you", category 'grammar'.
  - Analyzing an incorrect German sentence ("Ich will Arzt bekommen") -> detects error, provides "Ich will Arzt werden", category 'vocabulary'.
  - Analyzing a correct sentence ("I would like a coffee, please.") -> marked as `isPerfect: true`.
  - Saving and retrieving mistakes from Error Vault (`saveMistake`, `getUnresolvedMistakes`, `markMistakeAsMastered`).

- [ ] **Step 2: Run test to confirm failure**
Run `npx vitest run tests/ai-correction.test.ts`

- [ ] **Step 3: Implement `AiCorrectionService`**
In `src/renderer/src/services/aiCorrectionService.ts`:
  - Built-in pedagogical rules for common Turkish-speaker pitfalls in EN, DE, FR.
  - Gemini API integration with structured JSON output when API key is configured.
  - LocalStorage management for `chirmo_error_vault_v1`.

- [ ] **Step 4: Run test and ensure 100% pass**
Run `npx vitest run tests/ai-correction.test.ts`

---

### Task 2: AI Correction UI in Chat & Interactive Error Vault Modal

**Files:**
- Modify: `src/renderer/src/components/home/ChirmoAiChatModal.tsx`
- Create: `src/renderer/src/components/learning/ChirmoErrorVaultModal.tsx`
- Modify: `src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx`

**Deliverables:**
- [ ] **Step 1: Update `ChirmoAiChatModal.tsx` to display real-time AI correction cards under user messages**
  - When user sends a message, asynchronously trigger `AiCorrectionService.analyzeSentence(text, targetLang)`.
  - If error found, render a sleek collapsible badge: "💡 Chirmo Düzeltmesi: [Doğru Hali] • Hata Defterine Eklendi".
  - If perfect: render "🌟 Kusursuz İfade!".
- [ ] **Step 2: Create `ChirmoErrorVaultModal.tsx`**
  - Displays user's mistake history grouped by category.
  - Listen button for pronunciation.
  - "Tekrar Et & Doğrula" mini-drill with text/speech check.
  - "Öğrendim (+20 XP)" button that marks the mistake as mastered.
- [ ] **Step 3: Add "Hata Defteri" shortcut button to `ChirmoVirtualTutorStudio.tsx`**
  - Displays count of active mistakes to review.

---

### Task 3: Scientific Spaced Repetition (SRS - SuperMemo SM-2) Engine & Unit Tests

**Files:**
- Create: `src/renderer/src/services/spacedRepetitionService.ts`
- Create: `tests/spaced-repetition-sm2.test.ts`
- Modify: `src/renderer/src/services/learningStorage.ts`

**Interfaces:**
```ts
export type SrsRating = 1 | 2 | 3 | 4 | 5; // 1: Forgot, 3: Hard, 4: Good, 5: Easy

export interface SrsItem {
  id: string;
  sourceType: 'vocabulary' | 'mistake' | 'chunk';
  frontText: string;
  frontSubText?: string;
  backText: string;
  backExplanationTr: string;
  audioText: string;
  targetLang: 'en' | 'de' | 'fr';
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  timesReviewed: number;
}
```

- [ ] **Step 1: Write failing unit test for `SpacedRepetitionService`**
Create `tests/spaced-repetition-sm2.test.ts`:
  - Calculate SM-2 intervals: Rating 5 increases easeFactor and interval (e.g. 1 -> 6 -> 15 days).
  - Rating 1 resets repetition and sets interval to 1 day.
  - `getTodayReviewQueue` returns only items due on or before today.
  - Automatically imports saved words and unresolved errors into SRS items.

- [ ] **Step 2: Run test to confirm failure**
Run `npx vitest run tests/spaced-repetition-sm2.test.ts`

- [ ] **Step 3: Implement `SpacedRepetitionService`**
In `src/renderer/src/services/spacedRepetitionService.ts`:
  - Standard SuperMemo SM-2 formula: `EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))`.
  - LocalStorage persistence in `chirmo_srs_deck_v1`.
  - Aggregator that syncs vocabulary from `LearningStorageService` and mistakes from `AiCorrectionService`.

- [ ] **Step 4: Run test and ensure 100% pass**
Run `npx vitest run tests/spaced-repetition-sm2.test.ts`

---

### Task 4: Interactive Daily Review UI (SRS Flashcard Session Modal & Hub Badge)

**Files:**
- Create: `src/renderer/src/components/learning/ChirmoDailySrsReviewModal.tsx`
- Modify: `src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx`
- Modify: `src/renderer/src/components/home/SimpleSearchHome.tsx`

**Deliverables:**
- [ ] **Step 1: Create `ChirmoDailySrsReviewModal.tsx`**
  - Displays flashcard with 3D flip animation.
  - Front: Target word/sentence or situation prompt in Turkish/target language with audio button.
  - Flip Card: Reveals correct phrasing, grammar explanation, and native tip.
  - 4 Rating Buttons: "Unuttum (1)", "Zor (3)", "İyi (4)", "Çok Kolay (5)".
  - Progress bar (`Kart X / Total`).
  - Session complete screen with XP reward (+10 XP per card).
- [ ] **Step 2: Add "Günün Aralıklı Tekrarları" CTA Pill to `ChirmoVirtualTutorStudio.tsx`**
  - Shows dynamic counter: e.g. "Bugün 5 Kart Tekrar Bekliyor 🧠".
  - Opens `ChirmoDailySrsReviewModal`.

---

### Task 5: Syllable & Phoneme Accuracy Refinement in Telaffuz Doktoru

**Files:**
- Modify: `src/renderer/src/components/learning/ChirmoPronunciationDoctor.tsx`
- Modify: `src/renderer/src/services/learningStorage.ts`

**Deliverables:**
- [ ] **Step 1: Refine evaluation metrics**
  - Calculate 3 separate metrics: Accuracy (Doğruluk), Fluency (Akıcılık / tempo), Completeness (Eksiksiz tamamlama).
  - Add specific phoneme guidance for English, German, and French sounds.

---

### Task 6: Full Verification, Clean Build, Firebase Deploy & Git Push

- [ ] **Step 1: Run complete test suite (`npm test`)**
Ensure all existing 48 test suites + 2 new suites pass cleanly.
- [ ] **Step 2: Build project (`npm run build`)**
Verify Vite and Esbuild produce zero errors and clean output.
- [ ] **Step 3: Deploy to Firebase Hosting (`chirmo.com`)**
Execute `npx firebase-tools deploy --only hosting`.
- [ ] **Step 4: Commit and push to GitHub `origin main`**
Stage all files, create semantic commit, and push.
