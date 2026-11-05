# Implementation Plan - Doğal İnsan Sesleri & Aksan Seçici 🎙️ (Feature 3)

## Objective
Provide the user with an intuitive accent and voice selector allowing them to switch Chirmo's voice between **Amerikan (US)**, **İngiliz (UK / BBC)**, **Avustralya (AU)**, and **Chirmo Klasik Robot**. Settings will be persisted in storage and used across all `speak()` calls throughout the app.

## Proposed Changes
1. **Service (`src/renderer/src/services/learningStorage.ts`):**
   - Define `VoiceAccentId = 'us' | 'uk' | 'au' | 'robot'`.
   - Add interface `VoiceAccentConfig`:
     - `id: VoiceAccentId`
     - `label: string`
     - `flag: string`
     - `lang: string` ('en-US' | 'en-GB' | 'en-AU')
     - `pitch: number`
     - `rate: number`
     - `description: string`
     - `sampleText: string`
   - Store & retrieve current accent in `localStorage` (`chirmo_selected_accent`).
   - Enhance `LearningStorageService.speak(text: string, customAccentId?: VoiceAccentId, customRate?: number)` to find matching voices from `window.speechSynthesis.getVoices()` if available, applying language, pitch, and rate.

2. **Component (`src/renderer/src/components/learning/ChirmoAccentVoiceSelectorModal.tsx`):**
   - Modal with accent selector cards (US, UK, AU, Robot).
   - Speed slider (`0.75x`, `0.9x`, `1.0x`, `1.2x`).
   - Sample speech preview button for each voice.
   - Saves selection and updates global preference.

3. **Integration (`src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx`):**
   - Add quick badge shortcut `🎙️ Aksan: 🇺🇸 US` (or current selected flag/label) to the Hero banner.
   - Clicking opens the `ChirmoAccentVoiceSelectorModal`.

4. **Testing:**
   - Create `tests/chirmo-accent-voice-selector.test.ts` verifying storage, accent profiles, voice selection logic, and sample texts.

## Verification
- Run Vitest tests (`tests/chirmo-accent-voice-selector.test.ts` and entire suite).
- Run `npm run build` to ensure zero compilation or bundling issues.
