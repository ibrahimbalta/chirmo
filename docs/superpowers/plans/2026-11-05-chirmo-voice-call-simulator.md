# Chirmo Incoming Voice Call Simulator (Adım 1: "Chirmo Seni Arıyor!") Implementation Plan

Implement a realistic, interactive 2-minute phone call speaking simulator where Chirmo "calls" the user for a quick, low-stress, everyday English conversation.

## Proposed Components & Files

### 1. `src/renderer/src/components/learning/ChirmoVoiceCallSimulatorModal.tsx`
- **Incoming Call Screen**:
  - Full mobile/desktop realistic phone overlay.
  - Vibrating ring animation & caller ID: "Chirmo AI Öğretmeni 🤖", "İngilizce Konuşma Koçu".
  - Green [📞 Cevapla] and Red [❌ Reddet] buttons.
- **Active Call Screen**:
  - Live timer (00:01, 00:02...).
  - Audio waveform and phone speaker animations.
  - Chirmo's live speech dialogue (with Turkish translation subtitle support).
  - Web Speech microphone input (Hands-free audio speaking).
  - Quick answer pills + Turkish-to-English help.
  - Red [🔴 Görüşmeyi Sonlandır] button.
- **Post-Call Summary Screen**:
  - Duration, +35 XP reward, Streak streak fire 🔥, confidence score.

### 2. Integration into Home Stage (`ChirmoVirtualTutorStudio.tsx`)
- Add a prominent quick shortcut in the Hero Stage: "📞 2 Dk Sesli Arama".
- Allows user to test or trigger the call at any time.

### 3. Automated Tests (`tests/chirmo-voice-call-simulator.test.ts`)
- Tests modal state transitions (`ringing` -> `in-call` -> `ended` / `summary`).
- Tests speech recognition & TTS audio triggers.
- Tests streak and XP awards on completion.

## Verification
- Vitest run: `npx vitest run tests/chirmo-voice-call-simulator.test.ts`
- Full test suite: `npm test`
- Build check: `npm run build`
