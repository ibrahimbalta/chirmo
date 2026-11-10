import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import {
  GERMAN_AGE_VOCABULARY,
  GERMAN_LISTENING_QUIZZES,
  GERMAN_PUZZLE_CHALLENGES,
  GERMAN_VOICE_CHALLENGES,
  GERMAN_TPR_SIMON_ACTIONS,
  GERMAN_STORYBOOK_SCENES,
  GERMAN_KIDS_SONGS,
  GERMAN_SAFARI_ANIMALS,
  GERMAN_MAGIC_COLORS,
  GERMAN_KIDS_CHAT_STEPS,
  GERMAN_FACTORY_OPTIONS,
  GERMAN_AGE_SPEAKING_CHALLENGES,
  GERMAN_PATTERN_OPTIONS
} from '../src/renderer/src/services/germanKidsData';

import {
  FRENCH_AGE_VOCABULARY,
  FRENCH_LISTENING_QUIZZES,
  FRENCH_PUZZLE_CHALLENGES,
  FRENCH_VOICE_CHALLENGES,
  FRENCH_TPR_SIMON_ACTIONS,
  FRENCH_STORYBOOK_SCENES,
  FRENCH_KIDS_SONGS,
  FRENCH_SAFARI_ANIMALS,
  FRENCH_MAGIC_COLORS,
  FRENCH_KIDS_CHAT_STEPS,
  FRENCH_FACTORY_OPTIONS,
  FRENCH_AGE_SPEAKING_CHALLENGES,
  FRENCH_PATTERN_OPTIONS
} from '../src/renderer/src/services/frenchKidsData';

describe('Chirmo Kids Multi-Language (English 🇬🇧, German 🇩🇪 & French 🇫🇷) Pedagogy', () => {
  const componentPath = path.resolve(__dirname, '../src/renderer/src/components/kids/ChirmoKidsDedicatedHub.tsx');
  const content = fs.readFileSync(componentPath, 'utf-8');

  it('imports and integrates German kids pedagogy datasets and TargetLanguageService', () => {
    expect(content).toContain('GERMAN_AGE_VOCABULARY');
    expect(content).toContain('GERMAN_LISTENING_QUIZZES');
    expect(content).toContain('GERMAN_PUZZLE_CHALLENGES');
    expect(content).toContain('GERMAN_VOICE_CHALLENGES');
    expect(content).toContain('GERMAN_TPR_SIMON_ACTIONS');
    expect(content).toContain('GERMAN_STORYBOOK_SCENES');
    expect(content).toContain('GERMAN_KIDS_SONGS');
    expect(content).toContain('GERMAN_SAFARI_ANIMALS');
    expect(content).toContain('GERMAN_MAGIC_COLORS');
    expect(content).toContain('GERMAN_KIDS_CHAT_STEPS');
    expect(content).toContain('GERMAN_FACTORY_OPTIONS');
    expect(content).toContain('GERMAN_AGE_SPEAKING_CHALLENGES');
    expect(content).toContain('GERMAN_PATTERN_OPTIONS');
    expect(content).toContain('TargetLanguageService');
  });

  it('provides kid-friendly direct language switcher buttons for English, German and French', () => {
    expect(content).toContain('handleSwitchLanguage');
    expect(content).toContain('🇬🇧');
    expect(content).toContain('🇩🇪');
    expect(content).toContain('🇫🇷');
    expect(content).toContain('Almanca');
    expect(content).toContain('Fransızca');
  });

  it('guarantees rich German vocabulary for all 4 age brackets without English leakage', () => {
    const age5to7 = GERMAN_AGE_VOCABULARY['5-7'];
    const age8to10 = GERMAN_AGE_VOCABULARY['8-10'];
    const age11to13 = GERMAN_AGE_VOCABULARY['11-13'];
    const age14to17 = GERMAN_AGE_VOCABULARY['14-17'];

    expect(age5to7.length).toBeGreaterThanOrEqual(15);
    expect(age8to10.length).toBeGreaterThanOrEqual(15);
    expect(age11to13.length).toBeGreaterThanOrEqual(10);
    expect(age14to17.length).toBeGreaterThanOrEqual(7);

    // Verify German key words
    const german5to7Words = age5to7.map(v => v.en);
    expect(german5to7Words).toContain('Katze');
    expect(german5to7Words).toContain('Hund');
    expect(german5to7Words).toContain('Apfel');
    expect(german5to7Words).toContain('Wasser');
    expect(german5to7Words).toContain('Großer Baum');
    expect(german5to7Words).toContain('Hase');

    // Make sure no English words leak into the German vocab
    expect(german5to7Words).not.toContain('Cat');
    expect(german5to7Words).not.toContain('Dog');
    expect(german5to7Words).not.toContain('Apple');
  });

  it('provides German detective listening quizzes, sentence puzzles, and TPR Simon Says ("Chirmo sagt!")', () => {
    // Detective Quizzes in German
    const deQuizzes = GERMAN_LISTENING_QUIZZES['5-7'];
    expect(deQuizzes.length).toBeGreaterThanOrEqual(4);
    expect(deQuizzes[0].options.some(o => o.label === 'Katze')).toBe(true);

    // Sentence Puzzles in German
    const dePuzzles = GERMAN_PUZZLE_CHALLENGES['5-7'];
    expect(dePuzzles.length).toBeGreaterThanOrEqual(3);
    expect(dePuzzles[0].targetEn).toContain('Wasser');

    // Simon Says in German ("Chirmo sagt!")
    const deSimon = GERMAN_TPR_SIMON_ACTIONS['5-7'];
    expect(deSimon.length).toBeGreaterThanOrEqual(4);
    expect(deSimon[0].listenAudio).toContain('Chirmo sagt: Berühre deine Nase!');
    expect(content).toContain('Chirmo sagt! (Simon Says)');
  });

  it('provides German interactive storybooks, pattern builders, 4-block sentence factory, and songs', () => {
    // Storybooks
    const deScenes = GERMAN_STORYBOOK_SCENES['5-7'];
    expect(deScenes.length).toBeGreaterThanOrEqual(2);
    expect(deScenes[0].nameEn).toBe('Der magische Picknickwald');

    // Pattern Builder
    const dePatterns = GERMAN_PATTERN_OPTIONS['5-7'];
    expect(dePatterns.prefixes).toContain('Ich möchte');
    expect(dePatterns.objects).toContain('Wasser');
    expect(dePatterns.suffixes).toContain('bitte');

    // Sentence Factory
    const deFactory = GERMAN_FACTORY_OPTIONS['5-7'];
    expect(deFactory.subjects).toContain('Mein freundlicher Hund');
    expect(deFactory.actions).toContain('spielt gerne mit');

    // German Kids Songs
    expect(GERMAN_KIDS_SONGS.length).toBeGreaterThanOrEqual(3);
    expect(GERMAN_KIDS_SONGS[0].title).toContain('Das deutsche ABC-Lied');

    // German Safari Animals and Magic Colors
    expect(GERMAN_SAFARI_ANIMALS.length).toBeGreaterThanOrEqual(6);
    expect(GERMAN_SAFARI_ANIMALS[0].nameEn).toBe('Der Löwe');
    expect(GERMAN_MAGIC_COLORS.length).toBeGreaterThanOrEqual(6);
    expect(GERMAN_MAGIC_COLORS[0].nameEn).toBe('Rot');

    // German Cartoon Chat
    const deChat = GERMAN_KIDS_CHAT_STEPS['5-7'];
    expect(deChat.length).toBeGreaterThanOrEqual(2);
    expect(deChat[0].chirmoEn).toContain('Hallo kleiner Superstar!');
  });
  it('guarantees rich French vocabulary for all 4 age brackets without English leakage', () => {
    const age5to7 = FRENCH_AGE_VOCABULARY['5-7'];
    const age8to10 = FRENCH_AGE_VOCABULARY['8-10'];
    const age11to13 = FRENCH_AGE_VOCABULARY['11-13'];
    const age14to17 = FRENCH_AGE_VOCABULARY['14-17'];

    expect(age5to7.length).toBeGreaterThanOrEqual(15);
    expect(age8to10.length).toBeGreaterThanOrEqual(15);
    expect(age11to13.length).toBeGreaterThanOrEqual(10);
    expect(age14to17.length).toBeGreaterThanOrEqual(7);

    // Verify French key words
    const french5to7Words = age5to7.map(v => v.en);
    expect(french5to7Words).toContain('Le Chat');
    expect(french5to7Words).toContain('Le Chien');
    expect(french5to7Words).toContain('La Pomme');
    expect(french5to7Words).toContain("L'Eau");
    expect(french5to7Words).toContain('Le Grand Arbre');
    expect(french5to7Words).toContain('Le Lapin');

    // Make sure no English words leak into French vocab
    expect(french5to7Words).not.toContain('Cat');
    expect(french5to7Words).not.toContain('Dog');
    expect(french5to7Words).not.toContain('Apple');
  });

  it('provides French detective listening quizzes, sentence puzzles, and TPR Simon Says ("Chirmo dit!")', () => {
    const frQuizzes = FRENCH_LISTENING_QUIZZES['5-7'];
    expect(frQuizzes.length).toBeGreaterThanOrEqual(4);
    expect(frQuizzes[0].options.some(o => o.label.includes('Le Chat'))).toBe(true);

    const frPuzzles = FRENCH_PUZZLE_CHALLENGES['5-7'];
    expect(frPuzzles.length).toBeGreaterThanOrEqual(3);
    expect(frPuzzles[0].targetEn).toContain("l'eau");

    const frSimon = FRENCH_TPR_SIMON_ACTIONS['5-7'];
    expect(frSimon.length).toBeGreaterThanOrEqual(4);
    expect(frSimon[0].listenAudio).toContain('Chirmo dit: Touche ton nez!');
    expect(content).toContain('Chirmo dit ! (Simon Says)');
  });

  it('provides French interactive storybooks, pattern builders, 4-block sentence factory, and songs', () => {
    const frScenes = FRENCH_STORYBOOK_SCENES['5-7'];
    expect(frScenes.length).toBeGreaterThanOrEqual(2);
    expect(frScenes[0].nameEn).toBe('La Forêt Magique du Pique-nique');

    const frPatterns = FRENCH_PATTERN_OPTIONS['5-7'];
    expect(frPatterns.prefixes).toContain('Je voudrais');
    expect(frPatterns.objects).toContain("de l'eau");
    expect(frPatterns.suffixes).toContain("s'il vous plaît");

    const frFactory = FRENCH_FACTORY_OPTIONS['5-7'];
    expect(frFactory.subjects).toContain('Mon chien amical');
    expect(frFactory.actions).toContain('joue volontiers avec');

    expect(FRENCH_KIDS_SONGS.length).toBeGreaterThanOrEqual(3);
    expect(FRENCH_KIDS_SONGS[0].title).toContain('Frère Jacques');

    expect(FRENCH_SAFARI_ANIMALS.length).toBeGreaterThanOrEqual(6);
    expect(FRENCH_SAFARI_ANIMALS[0].nameEn).toBe('Le Lion');
    expect(FRENCH_MAGIC_COLORS.length).toBeGreaterThanOrEqual(6);
    expect(FRENCH_MAGIC_COLORS[0].nameEn).toBe('Rouge');

    const frChat = FRENCH_KIDS_CHAT_STEPS['5-7'];
    expect(frChat.length).toBeGreaterThanOrEqual(2);
    expect(frChat[0].chirmoEn).toContain('Bonjour petite superstar!');
  });
});