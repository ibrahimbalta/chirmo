# Robot-Centric Home Stage Redesign Implementation Plan

Transform the cluttered 3-panel home page into a focused, modern, and delightful "Talking Robot Speaking Partner" experience centered around Chirmo.

## User Problem
The current desktop home page has visual and cognitive overload:
- 3 simultaneous columns (Left Sidebar + Center Studio + Right AI Sidebar).
- Duplicated menus (both top navigation bar and left sidebar have identical destinations).
- Hero banner contains competing call-to-actions, multiple badges, and redundant text labels.
- Legacy text ("AI Browser & Workspace") confuses language learners.
- Inconsistent data (3 days streak in top bar vs 12 days streak in KPI card).

## Proposed Architecture & Design

### 1. Centralized "Talking Robot Speaking Partner" Stage (`ChirmoVirtualTutorStudio.tsx`)
- **Stage Layout**: Spacious, balanced, visually captivating hero card with soft purple/indigo ambient glow.
- **Centerpiece Mascot**: Chirmo 3D Robot in interactive pose with dynamic speaking/idle pulse.
- **Clear Daily Invitation**:
  - Heading: "Merhaba! 👋 Bugünün Konuşma Pratiğine Hazır mısın?"
  - Daily Scenario pill: "☕ Günün Konusu: Kafede Sipariş Verme (5 Dk)"
  - English & Turkish prompt:
    - 🇬🇧 *"Let's practice ordering coffee and food in English today!"*
    - 🇹🇷 *"Bugün İngilizce kahve ve yemek siparişi vermeyi birlikte konuşalım!"*
- **Primary Hero Action**:
  - One large, shining, pulsing CTA button: **[ 🎙️ Chirmo ile Canlı Konuşmaya Başla ]**
  - Secondary button: **[ ▶ Günün Dersini Başlat ]**
- **3 Quick Shortcut Pills**:
  - 🎭 *Hikaye & Rol Yapma*
  - ⚡ *3x Hızlı Konuşma Hızlandırıcısı*
  - 🎮 *Kelime & Refleks Oyunu*

### 2. Streamlined Dashboard & Visual Hierarchy
- **Consistent Progress Metrics**:
  - Streak (12 Gün 🔥), Kelime (182 +12), Konuşma Süresi (28 dk), Seviye/Özgüven (%94).
- **Clean Quick-Action Cards**:
  - Distinct cards for 3x Fluency Booster and Story Dialogue Studio without crowding.
- **Preserved Accessibility & Unit Test Tokens**:
  - Maintain all test expectations (`chirmoState`, `handleStartSpeaking`, `30 Günde Kendini İfade Etme Kampı`, etc.).

### 3. Sidebar Decluttering & Branding
- In `LearningCenterSidebar.tsx`, update subtitle from "AI Browser & Workspace" to "AI İngilizce Konuşma Robotu".
- In `App.tsx`, start the right AI tutor sidebar closed by default on initial load (`isTutorOpen = false`), so the central robot stage has maximum width and breathing room, while preserving the toggle accordion button for users who want to pop it open anytime.

## Tasks & Testing Plan
1. **Failing Test**: Write `tests/robot-centric-home-redesign.test.ts` to assert the new robot-centric daily prompt, primary CTA, and branding.
2. **Implementation**:
   - Update `LearningCenterSidebar.tsx` subtitle to "AI İngilizce Konuşma Robotu".
   - Update `App.tsx` default `isTutorOpen` to `false` for spacious desktop canvas.
   - Redesign Hero section in `ChirmoVirtualTutorStudio.tsx` to center around the Chirmo talking partner.
3. **Verification**:
   - Run Vitest for new test: `npx vitest run tests/robot-centric-home-redesign.test.ts`.
   - Run all 29 test suites (`npm test`).
   - Run `npm run build` for production verification.
