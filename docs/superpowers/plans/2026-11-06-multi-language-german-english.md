# Multi-Language (German & English) Platform-Wide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable seamless, platform-wide multi-language learning (English and German) where selecting German transforms all learning modules, AI speech recognition, voice synthesis, translations, and curriculum into authentic German study.

**Architecture:** 
- Central reactive `TargetLanguageService` managing active language (`'en' | 'de'`).
- Dual-language speech synthesis and Web Speech recognition (`en-US` vs `de-DE`).
- Dynamic Turkish-to-Target translation bridge (`tr -> en` vs `tr -> de`).
- Dedicated German curriculum, scenarios, and word databases.
- Platform-wide language switcher integrated in top header and mobile menus with immediate reactive UI updates.

**Tech Stack:** React 18, TypeScript, TailwindCSS, Web Speech API, Google Translate / Gemini API, Vitest.

---

### Task 1: Core Target Language Service & Speech Integration
**Files:**
- Create: `src/renderer/src/services/targetLanguageService.ts`
- Modify: `src/renderer/src/services/learningStorage.ts`
- Test: `tests/multi-language-german.test.ts`

- [ ] **Step 1: Write test for TargetLanguageService and speech language resolution**
- [ ] **Step 2: Implement TargetLanguageService with localStorage persistence & subscriber pattern**
- [ ] **Step 3: Update LearningStorageService to speak German when 'de' is selected**
- [ ] **Step 4: Verify test passes**

---

### Task 2: German Curriculum, Word Sets & Scenarios
**Files:**
- Create: `src/renderer/src/services/germanCurriculumData.ts`
- Modify: `src/renderer/src/services/curriculumData.ts`
- Test: `tests/multi-language-german.test.ts`

- [ ] **Step 1: Create authentic German conversation scenarios (Kaffee & Restaurant, Reisen, Alltag, Notfall, etc.)**
- [ ] **Step 2: Create 30-day German camp missions with German prompts, goals, and vocabulary**
- [ ] **Step 3: Provide unified getters `CurriculumService.getScenarios(lang)` and `CurriculumService.getDayMissions(lang)`**
- [ ] **Step 4: Verify curriculum tests pass**

---

### Task 3: Turkish Thought -> German/English Translation Engine
**Files:**
- Modify: `src/renderer/src/services/geminiAiTeacherService.ts`
- Test: `tests/multi-language-german.test.ts`

- [ ] **Step 1: Expand translation method to accept target language (`targetLang: 'en' | 'de'`)**
- [ ] **Step 2: Integrate German Google Translate endpoint (`sl=tr&tl=de`) and Gemini German conversational prompts**
- [ ] **Step 3: Add offline German phrase fallback templates**
- [ ] **Step 4: Verify translation tests pass**

---

### Task 4: Platform Header & Mobile Navigation Language Switcher
**Files:**
- Modify: `src/renderer/src/App.tsx`
- Modify: `src/renderer/src/components/home/HomeSearchHub.tsx`

- [ ] **Step 1: Add reactive `targetLanguage` state to `App.tsx`**
- [ ] **Step 2: Add cute, modern pill switcher (`🇬🇧 İngilizce` | `🇩🇪 Almanca`) to desktop header and mobile menu**
- [ ] **Step 3: Update module titles and welcome banners to reflect current study language**
- [ ] **Step 4: Verify UI updates reactively upon switching**

---

### Task 5: Module Adaptations for German
**Files:**
- Modify: `src/renderer/src/components/learning/ChirmoInteractiveGraduationDialogueModal.tsx`
- Modify: `src/renderer/src/components/learning/ChirmoVoiceCallSimulatorModal.tsx`
- Modify: `src/renderer/src/components/home/ChirmoAiTeacherSidebar.tsx`
- Modify: `src/renderer/src/components/learning/DailyEnglishStudio.tsx`
- Modify: `src/renderer/src/components/learning/EnglishGameArcade.tsx`
- Modify: `src/renderer/src/components/kids/ChirmoKidsDedicatedHub.tsx`

- [ ] **Step 1: Update Dialogue Modal (recognition `de-DE`, German starters, German translation)**
- [ ] **Step 2: Update Voice Call Simulator (German call scenarios, AI speech, recognition)**
- [ ] **Step 3: Update AI Teacher Sidebar (German featured words, German grammar hints, German translation)**
- [ ] **Step 4: Update Daily Studio, Games & Kids Hub with German word sets and camp data**

---

### Task 6: Full Verification, Build & Deployment
- [ ] **Step 1: Run all 42 test files and ensure 100% pass**
- [ ] **Step 2: Run `npm run build:renderer` to verify bundle build**
- [ ] **Step 3: Commit and push to GitHub `main`**
- [ ] **Step 4: Deploy to Firebase Hosting and provide live test link**
