# Pronunciation Doctor & Syllable Heatmap (Adım 2) Implementation Plan

Build the Phonetic Syllable & Pronunciation Heatmap component (`ChirmoPronunciationDoctor.tsx`) that analyzes spoken sentences word-by-word, highlights pronunciation errors in color codes (Green / Yellow / Red), and provides slow-motion audio breakdown with mouth/tongue phonetic tips.

## Components & Features
1. `src/renderer/src/components/learning/ChirmoPronunciationDoctor.tsx`:
   - Interactive sentence evaluator with word-by-word and syllable-by-syllable accuracy scoring.
   - Color-coded tokens:
     - 🟢 Green: Fluent & accurate.
     - 🟡 Yellow: Understandable, minor stress or rhythm flaw.
     - 🔴 Red: Phonetic error.
   - Interactive Word Inspector:
     - Click any word to hear slow-motion audio (`rate: 0.6`).
     - Phonetic tip (e.g. "th" tongue placement, "r" vs "l", vowel length).
     - Isolated word retry microphone button.
2. Integration into `ChirmoVirtualTutorStudio.tsx`:
   - Quick launch card or interactive modal for testing any sentence.
3. Automated Tests (`tests/pronunciation-doctor.test.ts`):
   - Unit test for word breakdown, scoring logic, and slow-motion audio triggers.
