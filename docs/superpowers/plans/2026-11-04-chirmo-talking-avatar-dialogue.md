# Chirmo Talking Robot Avatar & Interactive Graduation Dialogue Implementation Plan

A virtual talking robot avatar for Chirmo with two-way voice speaking, real-time Gemini AI conversation, an intelligent voice co-pilot ("Takıldım / İpucu Ver"), and integration into the 30-Day Camp graduation and Home Hero Studio.

## Proposed Changes

### 1. `src/renderer/src/components/avatar/ChirmoTalkingRobotAvatar.tsx`
- **Purpose**: A responsive, 3D-feeling talking robot avatar for Chirmo.
- **States**:
  - `idle`: Robot smiles, subtle floating hover animation, breathing pulse.
  - `listening`: Blue/purple neon soundwave rings pulse around the robot, microphone waves animate.
  - `thinking`: Amber/purple glow, thinking gears/sparkles icon, subtle floating scale animation.
  - `speaking`: Dynamic audio wave bars animating at the bottom, glowing purple halo, talking mouth/expression reaction.
- **Features**:
  - Size variants (`sm`, `md`, `lg`, `xl`).
  - Interactive click / tap to trigger greeting sound.
  - Status indicator badge (e.g. "Chirmo Dinliyor...", "Chirmo Konuşuyor...").

### 2. `src/renderer/src/components/learning/ChirmoInteractiveGraduationDialogueModal.tsx`
- **Purpose**: Full-screen or modal studio for two-way live voice dialogue with Chirmo.
- **Features**:
  - Embeds `ChirmoTalkingRobotAvatar`.
  - Graduation/Milestone Celebration header (30. Gün Mezuniyet Konuşması & Serbest Pratik).
  - Web Speech API integration for live speech-to-text with auto-fallback.
  - Gemini AI Teacher integration (`GeminiAiTeacherService`) for smart contextual responses.
  - **Voice Co-pilot ("💡 Takıldım / İpucu Ver")**:
    - Chirmo audibly whispers a helpful sentence starter in English & Turkish.
    - 3 one-click suggestion pills on screen that auto-read aloud and fill for the user.
  - Audio TTS playback for Chirmo's speech with speech-synchronized avatar animations.
  - Live conversation history with translations.
  - End of session speaking scorecard & graduation achievement badge.

### 3. Integration in `ThirtyDayCampView.tsx`
- Add "🏆 Chirmo ile Canlı Mezuniyet Sohbeti" graduation banner when completing Day 30 (or any day completion option).
- Launch `ChirmoInteractiveGraduationDialogueModal` on click or automatically upon Day 30 completion.

### 4. Integration in `ChirmoVirtualTutorStudio.tsx` & `App.tsx`
- Provide access from Hero Banner or Studio quick actions to chat live with the talking robot avatar at any time.

### 5. Automated Tests: `tests/chirmo-talking-avatar-dialogue.test.ts`
- Verifies `ChirmoTalkingRobotAvatar` renders with all 4 states (`idle`, `listening`, `thinking`, `speaking`).
- Verifies `ChirmoInteractiveGraduationDialogueModal` exports correctly and includes voice co-pilot hint logic and milestone graduation.
- Verifies integration in `ThirtyDayCampView` and `ChirmoVirtualTutorStudio`.

## Verification Plan
1. Run `npx vitest run tests/chirmo-talking-avatar-dialogue.test.ts`
2. Run full test suite: `npm test` (all 28 test suites, 110+ tests pass)
3. Run `npm run build` to verify clean TypeScript and Vite bundling
