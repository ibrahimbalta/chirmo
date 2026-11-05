# Implementation Plan - Mesleki & Sektörel Konuşma Paketleri 💼 (Feature 5)

## Objective
Provide specialized, industry-focused English speaking scenarios for IT/Tech, Global Job Interviews, Visa/Travel, and Business/Hospitality. Chirmo roleplays as an interviewer, tech lead, or visa officer, providing instant professional feedback and jargon tips.

## Architecture & Components
1. **Service (`src/renderer/src/services/careerTrackService.ts`):**
   - 4 industry tracks: `tech`, `interview`, `visa`, `business`.
   - Each track includes:
     - `id, title, turkishTitle, icon, description, roleplayCharacter`
     - `powerJargon: Array<{ term: string, tr: string, example: string }>`
     - `scenarios: Array<{ id, title, prompt, promptTr, targetKeywords, suggestedReplies, evaluationCriteria }>`
   - Helper methods:
     - `getTracks(): CareerTrack[]`
     - `getTrackById(id: string): CareerTrack | undefined`
     - `evaluateCareerSpeech(scenario, speechText): CareerEvaluationResult`

2. **Component (`src/renderer/src/components/learning/ChirmoCareerTrackModal.tsx`):**
   - Modal with industry tabs (IT/Tech, Job Interview, Visa & Travel, Business/Sales).
   - Scenario selector within selected track.
   - Active Roleplay Stage:
     - Roleplay Partner badge (e.g. "Sarah Chen - Senior Engineering Manager (Google)").
     - Chirmo's prompt spoken aloud.
     - Jargon cheat sheet pill drawer.
     - Voice mic recording + transcription.
     - Professional feedback with Tone Score, Vocabulary Match, and +40 XP reward.

3. **Integration (`src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx`):**
   - Add shortcut `💼 Mesleki Paketler` to Hero stage.
   - Trigger modal and connect XP reward.

4. **Testing (`tests/career-track.test.ts`):**
   - Unit tests for track loading, jargon retrieval, scenario lookup, and speech evaluation.
