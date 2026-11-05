# Implementation Plan - Sosyal Ligler & 1v1 Arkadaş Konuşma Düelloları 🏆 (Feature 6)

## Objective
Provide an exhilarating gamified speaking arena featuring weekly competitive leagues (Bronz, Gümüş, Altın, Elmas, Şampiyonlar) and 60-second 1v1 real-time speaking duels against learners/avatars with instant score benchmarking, ranking progression, and duel trophies.

## Architecture & Components
1. **Service (`src/renderer/src/services/speakingDuelService.ts`):**
   - League tiers: `Bronze`, `Silver`, `Gold`, `Diamond`, `Champions`.
   - Leaderboard generator with persistent user rank and simulated global learners.
   - 1v1 Duel Engine:
     - 3-round rapid prompts.
     - Simulated opponent profile and adaptive performance based on user level.
     - Evaluation comparing User vs Opponent based on fluency, speed, vocabulary, and duration.
     - XP & League Trophy rewards.

2. **Component (`src/renderer/src/components/learning/ChirmoSpeakingDuelModal.tsx`):**
   - Two top-level views:
     - **🏆 Haftalık Lig Sıralaması**: Current league badge, progress bar to promotion zone, leaderboard table, countdown timer.
     - **⚔️ 1v1 Hızlı Konuşma Düellosu**:
       - Opponent matchmaker ("Rakip aranıyor... Bulundu!").
       - 3 rapid rounds with countdown timers and audio prompts.
       - Speech recognition mic.
       - Live round score gauges (User vs Opponent).
       - Victory / Defeat screen with +60 XP and Duel Trophy.

3. **Integration (`src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx`):**
   - Add shortcut `🏆 1v1 Düello & Ligler` to Hero stage.
   - Connect XP rewards to `LearningStorageService`.

4. **Testing (`tests/speaking-duel.test.ts`):**
   - Unit tests verifying league tier calculation, leaderboard generation, duel rounds structure, and duel winner evaluation logic.
