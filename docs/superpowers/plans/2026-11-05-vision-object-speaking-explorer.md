# Implementation Plan - "Etrafını Göster, İngilizce Konuş" 📸 (Vision / Object Recognition Speaking Explorer)

## Objective
Enable users to point their camera at their surroundings, upload a photo, or choose a real-world object/scene, and have Chirmo instantly identify it in English, give phonetic pronunciation, teach 3 contextual CEFR sentences, and conduct an interactive conversational speaking challenge with live mic feedback.

## Architecture & Components
1. **Model / Data (`src/renderer/src/services/visionExplorerService.ts`):**
   - Scene & Object database with preset real-world items (Coffee Mug, Laptop/Desk, Backpack/Luggage, Headphones, Window/Weather, Book/Notes, Water Bottle, Bicycle, etc.).
   - Helper function `detectSceneFromInput(type: string, metadata?: any): DetectedObjectResult`.
   - Result structure:
     - `objectName: string`
     - `turkishName: string`
     - `phonetic: string`
     - `cefrLevel: CEFRLevel`
     - `vocabularyKeywords: string[]`
     - `contextualSentences: Array<{ en: string, tr: string, level: string }>`
     - `chirmoQuestion: string`
     - `chirmoQuestionTr: string`
     - `suggestedAnswers: string[]`

2. **Component (`src/renderer/src/components/learning/ChirmoVisionExplorerModal.tsx`):**
   - Modal with camera view (HTML5 `video` element with webcam streaming if available).
   - "Kamerayı Aç / Fotoğraf Çek" button.
   - Fallback / Alternative: File upload + 6 Real-World Preset chips ("Kahve Fincanı", "Çalışma Masası", "Sırt Çantası", "Kulaklık", "Pencere Manzarası", "Su Matarası").
   - Instant visual breakdown & audio pronunciation of the detected object.
   - Interactive Chirmo Speaking Challenge:
     - Chirmo asks a conversational question about the object.
     - User presses mic to reply in English (Web Speech Recognition).
     - Turkish Answer Bridge helps them formulate their reply if stuck.
     - Evaluates response and awards +25 XP!

3. **Integration (`src/renderer/src/components/home/ChirmoVirtualTutorStudio.tsx`):**
   - Add shortcut badge `📸 Etrafını Göster (Kamera)` in the Hero shortcuts bar.
   - Wire up modal trigger and XP reward.

4. **Testing (`tests/vision-explorer.test.ts`):**
   - Unit tests for `detectSceneFromInput`, object dictionary, CEFR grading, and prompt generation.
