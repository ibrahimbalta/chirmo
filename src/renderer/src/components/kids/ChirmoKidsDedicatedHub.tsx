import React, { useState, useEffect } from 'react';
import {
  Crown,
  Bell,
  Sparkles,
  Volume2,
  Heart,
  Star,
  Trophy,
  ShieldCheck,
  Music,
  Smile,
  BookOpen,
  Gamepad2,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Award,
  Zap,
  Mic,
  Flame,
  Check,
  Clock,
  GraduationCap,
  Share2,
  Puzzle,
  Headphones,
  CheckCircle,
  XCircle,
  ChevronRight,
  MessageCircle,
  BookCheck,
  Search
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { AnalyticsService } from '../../services/analyticsService';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';
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
} from '../../services/germanKidsData';

export type AgeGroup = '5-7' | '8-10' | '11-13' | '14-17';

export interface KidVocabItem {
  id: string;
  en: string;
  tr: string;
  emoji: string;
  category: string;
  soundText: string;
  exampleTr: string;
  funFact: string;
}

export interface KidListeningQuizItem {
  id: string;
  questionAudio: string;
  promptTr: string;
  options: { id: string; label: string; emoji: string; isCorrect: boolean }[];
  praise: string;
}

export interface KidSentencePuzzleItem {
  id: string;
  targetEn: string;
  targetTr: string;
  words: string[];
  emoji: string;
  hint: string;
}

export interface KidSongItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  audioSample: string;
  lyrics: string[];
  grammarFocus: string;
}

export interface ChirmoKidsDedicatedHubProps {
  onBackToMain?: () => void;
}

export const ChirmoKidsDedicatedHub: React.FC<ChirmoKidsDedicatedHubProps> = ({ onBackToMain }) => {
  // Navigation & Age State
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('5-7');
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() => TargetLanguageService.getTargetLanguage());
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [isGearChestOpen, setIsGearChestOpen] = useState<boolean>(false);
  const [activeGearTab, setActiveGearTab] = useState<'sentence' | 'question' | 'request' | 'emotion' | 'connector'>('sentence');
  const [subGameTab, setSubGameTab] = useState<'memory' | 'detective' | 'puzzle' | 'voice'>('memory');
  const [activeTab, setActiveTab] = useState<
    'games' | 'cards' | 'simon' | 'stories' | 'patterns' | 'animals' | 'colors' | 'chat' | 'stickers' | 'songs'
  >('games');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tümü');

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => {
      setTargetLang(lang);
    });
  }, []);

  // TPR Simon Says (Chirmo Diyor ki!) State
  const [simonIndex, setSimonIndex] = useState<number>(0);
  const [simonCompletedActions, setSimonCompletedActions] = useState<string[]>([]);

  // Interactive Storybooks State
  const [activeStorySceneId, setActiveStorySceneId] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'de-forest' : 'forest'
  );
  const [selectedStoryItemId, setSelectedStoryItemId] = useState<string | null>(null);

  // 4-Block Sentence Factory 2.0 State
  const [factorySubject, setFactorySubject] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'Mein freundlicher Hund' : 'My friendly dog'
  );
  const [factoryAction, setFactoryAction] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'spielt gerne mit' : 'is playing with'
  );
  const [factoryObject, setFactoryObject] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'einem bunten Ball' : 'a colorful ball'
  );
  const [factoryContext, setFactoryContext] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'im sonnigen Park' : 'in the sunny park'
  );

  // Kids Safari Animals State
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

  // Kids Magic Colors State
  const [activeColorId, setActiveColorId] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'de-c-red' : 'c-red'
  );

  // Kids Cartoon Chat State
  const [chatStepIndex, setChatStepIndex] = useState<number>(0);
  const [childAnswerText, setChildAnswerText] = useState<string | null>(null);

  // Gamification State
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('chirmo_kids_stars');
    return saved ? parseInt(saved, 10) : 245;
  });
  const [streakDays, setStreakDays] = useState<number>(4);
  const [lastAwardMessage, setLastAwardMessage] = useState<string | null>(null);

  // Lingoria Fantastic RPG State
  const [lingoriaXp, setLingoriaXp] = useState<number>(() => {
    const saved = localStorage.getItem('lingoria_xp');
    return saved ? parseInt(saved, 10) : 1250;
  });
  const [completedQuests, setCompletedQuests] = useState<number>(() => {
    const saved = localStorage.getItem('lingoria_completed_quests');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [isQuestModalOpen, setIsQuestModalOpen] = useState<boolean>(false);
  const [questCollectedWords, setQuestCollectedWords] = useState<string[]>([]);
  const [isQuestFinished, setIsQuestFinished] = useState<boolean>(false);

  const playerLevel = Math.floor(lingoriaXp / 500) + 1;
  const currentLevelXp = lingoriaXp % 500;

  useEffect(() => {
    localStorage.setItem('lingoria_xp', lingoriaXp.toString());
  }, [lingoriaXp]);

  useEffect(() => {
    localStorage.setItem('lingoria_completed_quests', completedQuests.toString());
  }, [completedQuests]);

  // Mini-Game 1: Listening Detective State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizAnswerState, setQuizAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Mini-Game 2: Sentence Puzzle State
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [selectedPuzzleWords, setSelectedPuzzleWords] = useState<string[]>([]);
  const [puzzleSuccess, setPuzzleSuccess] = useState<boolean>(false);

  // Mini-Game 3: Voice Pronunciation Arena State
  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'scored'>('idle');
  const [voiceScore, setVoiceScore] = useState<number | null>(null);

  // Pattern Builder for Kids State
  const [builderPrefix, setBuilderPrefix] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'Ich möchte' : 'I want'
  );
  const [builderObject, setBuilderObject] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'Wasser' : 'water'
  );
  const [builderSuffix, setBuilderSuffix] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'bitte' : 'please'
  );

  // Songs & Karaoke State
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Mini-Game 0: Memory Flip Match State
  const [memoryCards, setMemoryCards] = useState<Array<{
    uid: string;
    pairId: string;
    word: string;
    tr: string;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
  }>>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [isMemoryWon, setIsMemoryWon] = useState(false);

  // Memory Game Çiftleri (4 Yaş Kademe x EN & DE)
  const MEMORY_PAIRS: Record<AgeGroup, Record<'en' | 'de', Array<{ id: string; word: string; tr: string; emoji: string }>>> = {
    '5-7': {
      en: [
        { id: 'm1', word: 'Red Apple', tr: 'Kırmızı Elma', emoji: '🍎' },
        { id: 'm2', word: 'Cute Cat', tr: 'Sevimli Kedi', emoji: '🐱' },
        { id: 'm3', word: 'Friendly Dog', tr: 'Dost Köpek', emoji: '🐶' },
        { id: 'm4', word: 'Warm Sun', tr: 'Sıcak Güneş', emoji: '☀️' },
        { id: 'm5', word: 'Brave Lion', tr: 'Cesur Aslan', emoji: '🦁' },
        { id: 'm6', word: 'Space Rocket', tr: 'Uzay Roketi', emoji: '🚀' }
      ],
      de: [
        { id: 'm1', word: 'Roter Apfel', tr: 'Kırmızı Elma', emoji: '🍎' },
        { id: 'm2', word: 'Süße Katze', tr: 'Sevimli Kedi', emoji: '🐱' },
        { id: 'm3', word: 'Treuer Hund', tr: 'Dost Köpek', emoji: '🐶' },
        { id: 'm4', word: 'Warme Sonne', tr: 'Sıcak Güneş', emoji: '☀️' },
        { id: 'm5', word: 'Mutiger Löwe', tr: 'Cesur Aslan', emoji: '🦁' },
        { id: 'm6', word: 'Weltraumrakete', tr: 'Uzay Roketi', emoji: '🚀' }
      ]
    },
    '8-10': {
      en: [
        { id: 'm7', word: 'Soccer Ball', tr: 'Futbol Topu', emoji: '⚽' },
        { id: 'm8', word: 'School Backpack', tr: 'Okul Çantası', emoji: '🎒' },
        { id: 'm9', word: 'Fast Bicycle', tr: 'Hızlı Bisiklet', emoji: '🚲' },
        { id: 'm10', word: 'Smart Robot', tr: 'Akıllı Robot', emoji: '🤖' },
        { id: 'm11', word: 'Tasty Sandwich', tr: 'Lezzetli Sandviç', emoji: '🥪' },
        { id: 'm12', word: 'Night Telescope', tr: 'Gece Teleskobu', emoji: '🔭' }
      ],
      de: [
        { id: 'm7', word: 'Fußball', tr: 'Futbol Topu', emoji: '⚽' },
        { id: 'm8', word: 'Schulrucksack', tr: 'Okul Çantası', emoji: '🎒' },
        { id: 'm9', word: 'Schnelles Fahrrad', tr: 'Hızlı Bisiklet', emoji: '🚲' },
        { id: 'm10', word: 'Kluger Roboter', tr: 'Akıllı Robot', emoji: '🤖' },
        { id: 'm11', word: 'Leckeres Sandwich', tr: 'Lezzetli Sandviç', emoji: '🥪' },
        { id: 'm12', word: 'Teleskop', tr: 'Teleskop', emoji: '🔭' }
      ]
    },
    '11-13': {
      en: [
        { id: 'm13', word: 'Science Lab', tr: 'Fen Laboratuvarı', emoji: '🔬' },
        { id: 'm14', word: 'Saturn Planet', tr: 'Satürn Gezegeni', emoji: '🪐' },
        { id: 'm15', word: 'Mobile Tech', tr: 'Mobil Teknoloji', emoji: '📱' },
        { id: 'm16', word: 'Golden Trophy', tr: 'Altın Kupa', emoji: '🏆' },
        { id: 'm17', word: 'Galaxy Stars', tr: 'Galaksi Yıldızları', emoji: '🌌' },
        { id: 'm18', word: 'Clean Energy', tr: 'Temiz Enerji', emoji: '⚡' }
      ],
      de: [
        { id: 'm13', word: 'Wissenschaftslabor', tr: 'Fen Laboratuvarı', emoji: '🔬' },
        { id: 'm14', word: 'Planet Saturn', tr: 'Satürn Gezegeni', emoji: '🪐' },
        { id: 'm15', word: 'Mobiltechnologie', tr: 'Mobil Teknoloji', emoji: '📱' },
        { id: 'm16', word: 'Goldener Pokal', tr: 'Altın Kupa', emoji: '🏆' },
        { id: 'm17', word: 'Galaxien', tr: 'Galaksiler', emoji: '🌌' },
        { id: 'm18', word: 'Saubere Energie', tr: 'Temiz Enerji', emoji: '⚡' }
      ]
    },
    '14-17': {
      en: [
        { id: 'm19', word: 'Artificial Intelligence', tr: 'Yapay Zeka', emoji: '🧠' },
        { id: 'm20', word: 'Coding Algorithm', tr: 'Kod Algoritması', emoji: '💻' },
        { id: 'm21', word: 'Creative Startup', tr: 'Girişimcilik', emoji: '💡' },
        { id: 'm22', word: 'Future Ambition', tr: 'Gelecek Hedefi', emoji: '🌟' },
        { id: 'm23', word: 'Audio Podcast', tr: 'Sesli Podcast', emoji: '🎧' },
        { id: 'm24', word: 'Global Teamwork', tr: 'Takım Çalışması', emoji: '🤝' }
      ],
      de: [
        { id: 'm19', word: 'Künstliche Intelligenz', tr: 'Yapay Zeka', emoji: '🧠' },
        { id: 'm20', word: 'Programmier-Code', tr: 'Yazılım Kodu', emoji: '💻' },
        { id: 'm21', word: 'Kreative Innovation', tr: 'Yaratıcı İnovasyon', emoji: '💡' },
        { id: 'm22', word: 'Große Ambition', tr: 'Büyük Hedef', emoji: '🌟' },
        { id: 'm23', word: 'Podcast Show', tr: 'Podcast', emoji: '🎧' },
        { id: 'm24', word: 'Starkes Teamwork', tr: 'Takım Çalışması', emoji: '🤝' }
      ]
    }
  };

  const initMemoryGame = () => {
    const langKey = targetLang === 'de' ? 'de' : 'en';
    const pairs = (MEMORY_PAIRS[selectedAge] && MEMORY_PAIRS[selectedAge][langKey]) || MEMORY_PAIRS['5-7'][langKey];
    const cards: Array<{
      uid: string;
      pairId: string;
      word: string;
      tr: string;
      emoji: string;
      isFlipped: boolean;
      isMatched: boolean;
    }> = [];

    pairs.slice(0, 6).forEach((item) => {
      cards.push({
        uid: `${item.id}-a`,
        pairId: item.id,
        word: item.word,
        tr: item.tr,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        uid: `${item.id}-b`,
        pairId: item.id,
        word: item.word,
        tr: item.tr,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false
      });
    });

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    setMemoryCards(cards);
    setFlippedUids([]);
    setMemoryMoves(0);
    setIsMemoryWon(false);
  };

  useEffect(() => {
    initMemoryGame();
  }, [selectedAge, targetLang]);

  const handleCardClick = (card: typeof memoryCards[0]) => {
    if (card.isFlipped || card.isMatched || flippedUids.length >= 2) return;

    handleSpeak(card.word);

    const newCards = memoryCards.map((c) => (c.uid === card.uid ? { ...c, isFlipped: true } : c));
    setMemoryCards(newCards);

    const newFlipped = [...flippedUids, card.uid];
    setFlippedUids(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((prev) => prev + 1);
      const firstCard = newCards.find((c) => c.uid === newFlipped[0]);
      const secondCard = newCards.find((c) => c.uid === newFlipped[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setMemoryCards((prev) => {
            const updated = prev.map((c) =>
              c.pairId === firstCard.pairId ? { ...c, isMatched: true, isFlipped: true } : c
            );
            if (updated.every((c) => c.isMatched)) {
              setIsMemoryWon(true);
              handleAwardStars(25, 'Hafıza Şampiyonu! Tüm Çiftleri Buldun!');
              handleSpeak(targetLang === 'de' ? 'Fantastisch! Du hast alle Karten gefunden!' : 'Awesome job! You found all the matching pairs!');
            }
            return updated;
          });
          setFlippedUids([]);
          handleAwardStars(10, 'Hafıza Eşleşmesi!');
        }, 500);
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (newFlipped.includes(c.uid) ? { ...c, isFlipped: false } : c))
          );
          setFlippedUids([]);
        }, 900);
      }
    }
  };


  // Persistent Stars
  useEffect(() => {
    localStorage.setItem('chirmo_kids_stars', stars.toString());
  }, [stars]);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleAwardStars = (amount: number, reason: string) => {
    const xpBonus = amount * 10;
    setStars((prev) => prev + amount);
    setLingoriaXp((prev) => prev + xpBonus);
    AnalyticsService.logGamePlayed(xpBonus);
    setLastAwardMessage(`🎉 +${amount} Yıldız & +${xpBonus} XP! ${reason}`);
    setTimeout(() => {
      setLastAwardMessage(null);
    }, 3200);
  };

  // ==================== ZENGİN YAŞ GRUBU VERİ HAVUZU ====================
  const AGE_VOCABULARY: Record<AgeGroup, KidVocabItem[]> = {
    '5-7': [
      { id: 'v1', en: 'Cat', tr: 'Kedi', emoji: '🐱', category: 'Hayvanlar', soundText: 'Look at the happy cat! The cat says meow.', exampleTr: 'Mutlu kediye bak! Kedi miyav diyor.', funFact: 'Kediler günde 14-16 saat tatlı tatlı uyurlar!' },
      { id: 'v2', en: 'Dog', tr: 'Köpek', emoji: '🐶', category: 'Hayvanlar', soundText: 'The friendly dog says woof woof!', exampleTr: 'Sevimli köpek hav hav diyor!', funFact: 'Köpekler insanların en sadık dostlarıdır.' },
      { id: 'v3', en: 'Apple', tr: 'Kırmızı Elma', emoji: '🍎', category: 'Yiyecekler', soundText: 'I like red sweet apples.', exampleTr: 'Kırmızı tatlı elmaları severim.', funFact: 'Elma yemek dişlerimizi ve zihnimizi güçlendirir.' },
      { id: 'v4', en: 'Sun', tr: 'Güneş', emoji: '☀️', category: 'Doğa', soundText: 'The warm sun shines bright today.', exampleTr: 'Sıcak güneş bugün pırıl pırıl parlıyor.', funFact: 'Güneş dünyaya ısı, ışık ve neşe verir.' },
      { id: 'v5', en: 'Lion', tr: 'Aslan', emoji: '🦁', category: 'Hayvanlar', soundText: 'The brave lion roars in the safari.', exampleTr: 'Cesur aslan safaride kükrüyor.', funFact: 'Aslanlar hayvanlar aleminin kralı olarak bilinir.' },
      { id: 'v6', en: 'Milk', tr: 'Süt', emoji: '🥛', category: 'Yiyecekler', soundText: 'Can I have cold fresh milk, please?', exampleTr: 'Soğuk taze süt alabilir miyim lütfen?', funFact: 'Süt kemiklerimizin büyümesine yardımcı olur.' },
      { id: 'v7', en: 'Rainbow', tr: 'Gökkuşağı', emoji: '🌈', category: 'Doğa', soundText: 'I can see seven colors in the rainbow.', exampleTr: 'Gökkuşağında yedi renk görebiliyorum.', funFact: 'Gökkuşağı yağmurdan hemen sonra güneş açtığında oluşur.' },
      { id: 'v8', en: 'Ball', tr: 'Top', emoji: '⚽', category: 'Oyun', soundText: 'Let us bounce the colorful ball together.', exampleTr: 'Renkli topu birlikte zıplatalım.', funFact: 'Futbol dünyada en çok oynanan takım oyunudur.' },
      { id: 'v9', en: 'Teddy Bear', tr: 'Oyuncak Ayıcık', emoji: '🧸', category: 'Oyun', soundText: 'My cute teddy bear is very soft.', exampleTr: 'Sevimli oyuncak ayım çok yumuşak.', funFact: 'Çocuklar uyurken ayıcıklarına sarılmayı çok sever.' },
      { id: 'v9b', en: 'Star', tr: 'Yıldız', emoji: '⭐', category: 'Doğa', soundText: 'Twinkle twinkle little star, how I wonder what you are!', exampleTr: 'Pırıl pırıl parıldayan küçük yıldız!', funFact: 'Geceleri gökyüzünde parlayan milyarlarca yıldız vardır.' },
      { id: 'v9c', en: 'Cookie', tr: 'Kurabiye', emoji: '🍪', category: 'Yiyecekler', soundText: 'Can I have a sweet chocolate cookie, please?', exampleTr: 'Çikolatalı tatlı bir kurabiye alabilir miyim lütfen?', funFact: 'Sıcak kurabiyeler sütle harika gider!' },
      { id: 'v9d', en: 'Train', tr: 'Tren', emoji: '🚂', category: 'Oyun', soundText: 'Choo choo! The little train rides on the track.', exampleTr: 'Çuf çuf! Küçük tren raylarda ilerliyor.', funFact: 'Hızlı trenler saatte 300 kilometre hızla gidebilir.' },
      { id: 'v9e', en: 'Banana', tr: 'Muz', emoji: '🍌', category: 'Yiyecekler', soundText: 'Monkeys love sweet yellow bananas.', exampleTr: 'Maymunlar tatlı sarı muzları çok sever.', funFact: 'Muz spor yaparken bize bol enerji verir!' },
      { id: 'v9f', en: 'Water', tr: 'Su', emoji: '💧', category: 'Yiyecekler', soundText: 'Can I have a glass of fresh water, please?', exampleTr: 'Bir bardak taze su alabilir miyim lütfen?', funFact: 'Vücudumuzun büyük bir kısmı sudan oluşur.' },
      { id: 'v9g', en: 'Big Tree', tr: 'Büyük Ağaç', emoji: '🌳', category: 'Doğa', soundText: 'Birds build cozy nests in the green big tree.', exampleTr: 'Kuşlar büyük yeşil ağaçta yuvalar yapar.', funFact: 'Ağaçlar havayı temizleyip bize oksijen üretir.' },
      { id: 'v9h', en: 'Red Flower', tr: 'Kırmızı Çiçek', emoji: '🌸', category: 'Doğa', soundText: 'Smell the lovely sweet red flower in the garden.', exampleTr: 'Bahçedeki güzel kokulu kırmızı çiçeği kokla.', funFact: 'Arılar çiçeklerden nektar toplayarak tatlı bal yapar.' },
      { id: 'v9i', en: 'Fast Car', tr: 'Hızlı Araba', emoji: '🚗', category: 'Oyun', soundText: 'Beep beep! The shiny fast car zooms by.', exampleTr: 'Düt düt! Parlak hızlı araba yanımdan geçti.', funFact: 'Elektrikli arabalar sessizce ve doğayı kirletmeden çalışır.' },
      { id: 'v9j', en: 'Airplane', tr: 'Uçak', emoji: '✈️', category: 'Oyun', soundText: 'The airplane flies high above the white clouds.', exampleTr: 'Uçak beyaz bulutların çok üzerinde uçar.', funFact: 'Uçaklar dünyayı sadece saatler içinde dolaşmamızı sağlar.' },
      { id: 'v9k', en: 'Yellow Duck', tr: 'Sarı Ördek', emoji: '🦆', category: 'Hayvanlar', soundText: 'Quack quack! The yellow duck swims happily.', exampleTr: 'Vak vak! Sarı ördek neşeyle yüzüyor.', funFact: 'Ördeklerin tüyleri suya girseler bile ıslanmaz!' },
      { id: 'v9l', en: 'Rabbit', tr: 'Tavşan', emoji: '🐰', category: 'Hayvanlar', soundText: 'The fluffy white rabbit hops across the grass.', exampleTr: 'Tüylü beyaz tavşan çimenlerde zıplıyor.', funFact: 'Tavşanların kulakları tehlikeleri çok uzaklardan bile duyar.' },
      { id: 'v9m', en: 'Happy Smile', tr: 'Mutlu Gülümseme', emoji: '😊', category: 'Duygular', soundText: 'Wear a bright happy smile every single day!', exampleTr: 'Her gün neşeli ve aydınlık bir tebessüm takın!', funFact: 'Gülümsemek beynimize mutluluk ve neşe sinyalleri gönderir.' },
      { id: 'v9n', en: 'Clapping Hands', tr: 'Alkışlayan Eller', emoji: '👏', category: 'Vücudumuz', soundText: 'Clap your hands if you are feeling cheerful!', exampleTr: 'Kendini neşeli hissediyorsan ellerini çırp!', funFact: 'Alkışlamak kalbimizin ritmini ve neşemizi canlandırır.' },
      { id: 'v9o', en: 'Cozy Bed', tr: 'Rahat Yatak', emoji: '🛏️', category: 'Evimiz', soundText: 'Time to rest in my warm cozy bed. Good night!', exampleTr: 'Sıcak ve rahat yatağımda dinlenme zamanı. İyi geceler!', funFact: 'İyi bir gece uykusu boyumuzun uzamasını sağlar.' },
      { id: 'v9p', en: 'Story Book', tr: 'Hikaye Kitabı', emoji: '📖', category: 'Okul', soundText: 'Let us open the magical colorful story book.', exampleTr: 'Büyülü renkli hikaye kitabını açalım.', funFact: 'Kitap okumak hayal dünyamızı ve zekamızı sınırsız büyütür.' }
    ],
    '8-10': [
      { id: 'v10', en: 'Backpack', tr: 'Okul Çantası', emoji: '🎒', category: 'Okul', soundText: 'My heavy backpack is full of colorful books.', exampleTr: 'Ağır okul çantam renkli kitaplarla dolu.', funFact: 'Okul eşyalarımızı düzenli tutmak derslerimizde bize büyük kolaylık sağlar.' },
      { id: 'v11', en: 'Bicycle', tr: 'Bisiklet', emoji: '🚲', category: 'Spor', soundText: 'I can ride my blue bicycle in the park.', exampleTr: 'Parkta mavi bisikletimi sürebiliyorum.', funFact: 'Bisiklet sürmek hem bacak kaslarını hem dengeyi geliştirir.' },
      { id: 'v12', en: 'Space Rocket', tr: 'Uzay Roketi', emoji: '🚀', category: 'Bilim', soundText: 'Three, two, one! The space rocket blasts off!', exampleTr: 'Üç, iki, bir! Uzay roketi fırlatıldı!', funFact: 'Roketler saniyede 11 kilometre hızla uzaya çıkar.' },
      { id: 'v13', en: 'Pencil', tr: 'Kurşun Kalem', emoji: '✏️', category: 'Okul', soundText: 'Can I borrow your sharp pencil, please?', exampleTr: 'Açılmış kurşun kalemini ödünç alabilir miyim lütfen?', funFact: 'Bir kurşun kalemle yaklaşık 50.000 kelime yazılabilir.' },
      { id: 'v14', en: 'Guitar', tr: 'Gitar', emoji: '🎸', category: 'Müzik', soundText: 'She can play a cheerful melody on the guitar.', exampleTr: 'Gitarla neşeli bir melodi çalabiliyor.', funFact: 'Müzik dinlemek yabancı dil kulak aşinalığını 3 kat hızlandırır.' },
      { id: 'v15', en: 'Ice Cream', tr: 'Dondurma', emoji: '🍦', category: 'Yiyecekler', soundText: 'I want a big strawberry ice cream, please.', exampleTr: 'Büyük bir çilekli dondurma istiyorum lütfen.', funFact: 'Dondurma mutluluk hormonu salgılanmasına katkı sağlar.' },
      { id: 'v16', en: 'Dinosaur', tr: 'Dinozor', emoji: '🦖', category: 'Doğa', soundText: 'The giant dinosaur walked on earth long ago.', exampleTr: 'Dev dinozor çok uzun zaman önce dünyada yürüdü.', funFact: 'T-Rex dinozorunun bir dişi 30 santimetreye kadar uzardı!' },
      { id: 'v16b', en: 'Skateboard', tr: 'Kaykay', emoji: '🛹', category: 'Spor', soundText: 'I like doing cool tricks on my skateboard in the park.', exampleTr: 'Parkta kaykayımla havalı hareketler yapmayı severim.', funFact: 'Kaykay olimpiyatlarda bir spor dalı haline gelmiştir.' },
      { id: 'v16c', en: 'Telescope', tr: 'Teleskop', emoji: '🔭', category: 'Bilim', soundText: 'Look through the telescope to see the craters on the moon!', exampleTr: 'Aydaki kraterleri görmek için teleskoptan bak!', funFact: 'Galileo 400 yıl önce ilk kez teleskopla gezegenleri incelemiştir.' },
      { id: 'v16d', en: 'Football & Goal', tr: 'Futbol & Gol', emoji: '⚽', category: 'Spor', soundText: 'Pass the ball and shoot! What a magnificent goal!', exampleTr: 'Topu pas ver ve şut çek! Ne muhteşem bir gol!', funFact: 'Takım sporları paylaşmayı ve liderliği öğretir.' },
      { id: 'v16e', en: 'Swimming Pool', tr: 'Yüzme Havuzu', emoji: '🏊', category: 'Spor', soundText: 'I love swimming in the cool blue pool on sunny weekends.', exampleTr: 'Güneşli hafta sonlarında serin mavi havuzda yüzmeyi severim.', funFact: 'Yüzme tüm vücut kaslarını aynı anda çalıştıran en iyi spordur.' },
      { id: 'v16f', en: 'Kind Doctor', tr: 'Şefkatli Doktor', emoji: '🩺', category: 'Meslekler', soundText: 'The kind doctor helps everyone stay strong and healthy.', exampleTr: 'Şefkatli doktor herkesin güçlü ve sağlıklı kalmasına yardım eder.', funFact: 'Steteskop kalbin atış sesini 10 kat netleştirerek duyar.' },
      { id: 'v16g', en: 'Smart Robot', tr: 'Akıllı Robot', emoji: '🤖', category: 'Bilim', soundText: 'Chirmo is an intelligent robot that teaches you English!', exampleTr: 'Chirmo sana İngilizce öğreten akıllı bir robottur!', funFact: 'Robotlar insanların karmaşık görevleri hızla yapmasına yardımcı olur.' },
      { id: 'v16h', en: 'Wall Clock', tr: 'Duvar Saati', emoji: '⏰', category: 'Zaman', soundText: 'Tick tock! The clock says it is time for school.', exampleTr: 'Tik tak! Saat okula gitme zamanı olduğunu söylüyor.', funFact: 'Günde 24 saat ve her saatte 60 dakika vardır.' },
      { id: 'v16i', en: 'Sunny & Rain', tr: 'Güneş ve Yağmur', emoji: '⛅', category: 'Doğa', soundText: 'The weather is partly sunny with a gentle refreshing rain.', exampleTr: 'Hava parçalı güneşli ve ferahlatıcı hafif bir yağmur var.', funFact: 'Havadaki su damlacıkları güneşle birleşince gökkuşağı yaratır.' },
      { id: 'v16j', en: 'Tasty Sandwich', tr: 'Lezzetli Sandviç', emoji: '🥪', category: 'Yiyecekler', soundText: 'I packed a tasty cheese and tomato sandwich for lunch.', exampleTr: 'Öğle yemeği için lezzetli peynirli ve domatesli sandviç hazırladım.', funFact: 'Sandviç adını 18. yüzyılda İngiltere Kontu Sandwich’ten almıştır.' },
      { id: 'v16k', en: 'Paintbrush', tr: 'Boya Fırçası', emoji: '🎨', category: 'Sanat', soundText: 'Dip the paintbrush in blue and paint the vast sky.', exampleTr: 'Boya fırçasını maviye batır ve uçsuz bucaksız gökyüzünü boya.', funFact: 'Resim yapmak çocukların yaratıcı zekasını ve odaklanmasını geliştirir.' }
    ],
    '11-13': [
      { id: 'v17', en: 'Laboratory', tr: 'Fen Laboratuvarı', emoji: '🔬', category: 'Okul', soundText: 'Excuse me, where is the science laboratory?', exampleTr: 'Affedersiniz, fen laboratuvarı nerede acaba?', funFact: 'LGS sınavında yön ve okul terimleri sıkça sorulur.' },
      { id: 'v18', en: 'Adventure', tr: 'Macera', emoji: '🗺️', category: 'Sosyal', soundText: 'We are ready for an exciting mountain adventure.', exampleTr: 'Heyecanlı bir dağ macerasına hazırız.', funFact: 'Macera dolu hikayeler okumak kelime hazinesini genişletir.' },
      { id: 'v19', en: 'Best Friend', tr: 'En İyi Arkadaş', emoji: '🤝', category: 'Sosyal', soundText: 'You can always trust your true best friend.', exampleTr: 'Gerçek en iyi arkadaşına her zaman güvenebilirsin.', funFact: 'Arkadaşlık diyaloğu 6. sınıf müfredatının kilit konusudur.' },
      { id: 'v20', en: 'Library', tr: 'Kütüphane', emoji: '📚', category: 'Okul', soundText: 'Please keep quiet while studying in the library.', exampleTr: 'Lütfen kütüphanede ders çalışırken sessiz olun.', funFact: 'Dünyanın en büyük kütüphanesinde 170 milyondan fazla eser vardır.' },
      { id: 'v21', en: 'Ticket', tr: 'Bilet', emoji: '🎟️', category: 'Günlük Yaşam', soundText: 'How much is one student ticket for the museum?', exampleTr: 'Müze için bir öğrenci bileti ne kadar?', funFact: 'Yurt dışı seyahatlerinde bilet sormak en temel gereksinimdir.' },
      { id: 'v21b', en: 'Planet', tr: 'Gezegen', emoji: '🪐', category: 'Bilim', soundText: 'Saturn is famous for its beautiful shiny rings.', exampleTr: 'Satürn güzel parlak halkalarıyla ünlüdür.', funFact: 'Güneş sistemimizde sekiz büyük gezegen bulunmaktadır.' },
      { id: 'v21c', en: 'Champion', tr: 'Şampiyon', emoji: '🥇', category: 'Sosyal', soundText: 'With hard work and daily practice, you become a champion!', exampleTr: 'Sıkı çalışma ve günlük pratikle bir şampiyon olursun!', funFact: 'Her gün 15 dakika İngilizce çalışan öğrenciler hızla dereceye girer.' },
      { id: 'v21d', en: 'Mobile Technology', tr: 'Mobil Teknoloji', emoji: '📱', category: 'Teknoloji', soundText: 'We use mobile technology to connect with global learning friends.', exampleTr: 'Küresel öğrenme arkadaşlarıyla bağlantı kurmak için mobil teknolojiyi kullanırız.', funFact: 'Bugünkü akıllı telefonlar Ay’a giden ilk roketten binlerce kat daha güçlüdür.' },
      { id: 'v21e', en: 'Milky Way Galaxy', tr: 'Samanyolu Galaksisi', emoji: '🌌', category: 'Bilim', soundText: 'Our home is located inside the magnificent Milky Way galaxy.', exampleTr: 'Evimiz muhteşem Samanyolu galaksisinin içinde yer almaktadır.', funFact: 'Samanyolu galaksisinde 100 milyardan fazla yıldız bulunur.' },
      { id: 'v21f', en: 'Navigation Compass', tr: 'Yön Pusulası', emoji: '🧭', category: 'Keşif', soundText: 'The magnetic needle of the compass always points north.', exampleTr: 'Pusulanın manyetik iğnesi her zaman kuzeyi gösterir.', funFact: 'Pusula denizcilerin açık denizlerde kaybolmasını önleyen en eski icattır.' },
      { id: 'v21g', en: 'Renewable Energy', tr: 'Yenilenebilir Temiz Enerji', emoji: '⚡', category: 'Doğa', soundText: 'Solar panels and wind turbines generate clean renewable energy.', exampleTr: 'Güneş panelleri ve rüzgar türbinleri temiz yenilenebilir enerji üretir.', funFact: 'Temiz enerji gezegenimizin iklim dengesini korumada en kritik güçtür.' }
    ],
    '14-17': [
      { id: 'v22', en: 'Algorithm', tr: 'Algoritma & Kodlama', emoji: '💻', category: 'Teknoloji', soundText: 'I enjoy writing clean code and solving logic puzzles.', exampleTr: 'Temiz kod yazmaktan ve mantık bulmacaları çözmekten keyif alırım.', funFact: 'Yazılım dünyasının evrensel dili İngilizcedir.' },
      { id: 'v23', en: 'Perspective', tr: 'Bakış Açısı', emoji: '💡', category: 'Düşünce', soundText: 'In my opinion, we need a creative new perspective.', exampleTr: 'Bana göre, yaratıcı yeni bir bakış açısına ihtiyacımız var.', funFact: 'B1 ve B2 seviye konuşmalarda fikir belirtmek zorunludur.' },
      { id: 'v24', en: 'Soundtrack', tr: 'Müzik Listesi / Çalma Listesi', emoji: '🎧', category: 'Müzik', soundText: 'This indie track is the soundtrack of my summer.', exampleTr: 'Bu parça benim yaz tatilimin müzik temasıdır.', funFact: 'Şarkı sözlerini çevirmek dinleme sınavlarında başarıyı %40 artırır.' },
      { id: 'v25', en: 'Teamwork', tr: 'Takım Çalışması', emoji: '🏆', category: 'Gelecek', soundText: 'Effective teamwork leads to international success.', exampleTr: 'Etkili takım çalışması uluslararası başarıya götürür.', funFact: 'Küresel üniversite ve burs mülakatlarının 1 numaralı sorusudur.' },
      { id: 'v25b', en: 'Innovation', tr: 'İnovasyon & Yenilik', emoji: '🚀', category: 'Teknoloji', soundText: 'True innovation solves real problems for human beings.', exampleTr: 'Gerçek inovasyon insanoğlunun gerçek sorunlarını çözer.', funFact: 'Yapay zeka çağında en çok aranan beceri yaratıcı problem çözmedir.' },
      { id: 'v25c', en: 'Artificial Intelligence', tr: 'Yapay Zekâ', emoji: '🧠', category: 'Teknoloji', soundText: 'Artificial intelligence transforms how we learn languages and communicate.', exampleTr: 'Yapay zekâ dilleri nasıl öğrendiğimizi ve iletişim kurduğumuzu dönüştürüyor.', funFact: 'Yapay zeka sistemleri milyonlarca veriyi saniyeler içinde analiz eder.' },
      { id: 'v25d', en: 'Inspiring Leadership', tr: 'İlham Veren Liderlik', emoji: '🌟', category: 'Gelecek', soundText: 'Empathetic leaders listen actively and inspire positive change.', exampleTr: 'Empatik liderler aktif şekilde dinler ve olumlu değişime ilham verir.', funFact: 'Küresel liderlerin en belirgin özelliği açık fikirli iletişim becerisidir.' },
      { id: 'v25e', en: 'Eco Sustainability', tr: 'Ekolojik Sürdürülebilirlik', emoji: '🌿', category: 'Doğa', soundText: 'Sustainable practices protect natural habitats for future generations.', exampleTr: 'Sürdürülebilir uygulamalar gelecek nesiller için doğal yaşam alanlarını korur.', funFact: 'Geri dönüşüm yapmak okyanuslardaki plastik atıkları dramatik biçimde azaltır.' }
    ]
  };

  // ==================== OYUN 1: DUY VE RESMİ BUL (LISTENING DETECTIVE) ====================
  const LISTENING_QUIZZES: Record<AgeGroup, KidListeningQuizItem[]> = {
    '5-7': [
      {
        id: 'q1',
        questionAudio: 'Cat',
        promptTr: 'Sesi dinle! Chirmo hangi sevimli dostumuzu söyledi?',
        options: [
          { id: 'o1', label: 'Cat', emoji: '🐱', isCorrect: true },
          { id: 'o2', label: 'Dog', emoji: '🐶', isCorrect: false },
          { id: 'o3', label: 'Lion', emoji: '🦁', isCorrect: false },
          { id: 'o4', label: 'Sun', emoji: '☀️', isCorrect: false }
        ],
        praise: 'Harikasın! Kediler miyav der ve Cat olarak söylenir!'
      },
      {
        id: 'q2',
        questionAudio: 'Apple',
        promptTr: 'Sesi dinle! Chirmo hangi lezzetli meyveyi söyledi?',
        options: [
          { id: 'o1', label: 'Milk', emoji: '🥛', isCorrect: false },
          { id: 'o2', label: 'Apple', emoji: '🍎', isCorrect: true },
          { id: 'o3', label: 'Sun', emoji: '☀️', isCorrect: false },
          { id: 'o4', label: 'Ball', emoji: '⚽', isCorrect: false }
        ],
        praise: 'Süpersin! Kırmızı elma Apple demektir!'
      },
      {
        id: 'q3',
        questionAudio: 'Rainbow',
        promptTr: 'Sesi dinle! Gökyüzündeki renkli güzellik hangisi?',
        options: [
          { id: 'o1', label: 'Ball', emoji: '⚽', isCorrect: false },
          { id: 'o2', label: 'Dog', emoji: '🐶', isCorrect: false },
          { id: 'o3', label: 'Rainbow', emoji: '🌈', isCorrect: true },
          { id: 'o4', label: 'Cat', emoji: '🐱', isCorrect: false }
        ],
        praise: 'Mükemmel kulak! Rainbow yedi renkli gökkuşağıdır!'
      },
      {
        id: 'q3b',
        questionAudio: 'Yellow Duck',
        promptTr: 'Sesi dinle! Gölette yüzen sevimli sarı dostumuz hangisi?',
        options: [
          { id: 'o1', label: 'Yellow Duck', emoji: '🦆', isCorrect: true },
          { id: 'o2', label: 'Rabbit', emoji: '🐰', isCorrect: false },
          { id: 'o3', label: 'Teddy Bear', emoji: '🧸', isCorrect: false },
          { id: 'o4', label: 'Train', emoji: '🚂', isCorrect: false }
        ],
        praise: 'Tebrikler! Yellow Duck sevimli sarı ördek demektir!'
      }
    ],
    '8-10': [
      {
        id: 'q4',
        questionAudio: 'Space Rocket',
        promptTr: 'Dinle bakalım! Uzaya fırlatılan dev araç hangisi?',
        options: [
          { id: 'o1', label: 'Bicycle', emoji: '🚲', isCorrect: false },
          { id: 'o2', label: 'Backpack', emoji: '🎒', isCorrect: false },
          { id: 'o3', label: 'Space Rocket', emoji: '🚀', isCorrect: true },
          { id: 'o4', label: 'Guitar', emoji: '🎸', isCorrect: false }
        ],
        praise: 'Roket gibi hızlısın! Space Rocket doğru cevap!'
      },
      {
        id: 'q5',
        questionAudio: 'Bicycle',
        promptTr: 'Dinle! Parkta bindiğimiz iki tekerlekli eğlence aracı hangisi?',
        options: [
          { id: 'o1', label: 'Bicycle', emoji: '🚲', isCorrect: true },
          { id: 'o2', label: 'Ice Cream', emoji: '🍦', isCorrect: false },
          { id: 'o3', label: 'Pencil', emoji: '✏️', isCorrect: false },
          { id: 'o4', label: 'Rocket', emoji: '🚀', isCorrect: false }
        ],
        praise: 'Tebrikler! Bicycle bisiklet demektir!'
      },
      {
        id: 'q5b',
        questionAudio: 'Smart Robot',
        promptTr: 'Dinle! Bize İngilizce öğreten akıllı yapay zeka dostumuz hangisi?',
        options: [
          { id: 'o1', label: 'Smart Robot', emoji: '🤖', isCorrect: true },
          { id: 'o2', label: 'Dinosaur', emoji: '🦖', isCorrect: false },
          { id: 'o3', label: 'Paintbrush', emoji: '🎨', isCorrect: false },
          { id: 'o4', label: 'Skateboard', emoji: '🛹', isCorrect: false }
        ],
        praise: 'Harikasın! Smart Robot zeki robotumuz Chirmo’dur!'
      },
      {
        id: 'q5c',
        questionAudio: 'Football & Goal',
        promptTr: 'Dinle! Sahada pas verip attığımız büyük sevinç nedir?',
        options: [
          { id: 'o1', label: 'Wall Clock', emoji: '⏰', isCorrect: false },
          { id: 'o2', label: 'Football & Goal', emoji: '⚽', isCorrect: true },
          { id: 'o3', label: 'Tasty Sandwich', emoji: '🥪', isCorrect: false },
          { id: 'o4', label: 'Telescope', emoji: '🔭', isCorrect: false }
        ],
        praise: 'Gooool! Football and Goal doğru telaffuz edildi!'
      }
    ],
    '11-13': [
      {
        id: 'q6',
        questionAudio: 'Science Laboratory',
        promptTr: 'Dinle! Deneylerin yapıldığı okul alanı hangisidir?',
        options: [
          { id: 'o1', label: 'Library', emoji: '📚', isCorrect: false },
          { id: 'o2', label: 'Science Laboratory', emoji: '🔬', isCorrect: true },
          { id: 'o3', label: 'Adventure', emoji: '🗺️', isCorrect: false },
          { id: 'o4', label: 'Ticket', emoji: '🎟️', isCorrect: false }
        ],
        praise: 'Bravo! Laboratory fen laboratuvarıdır!'
      },
      {
        id: 'q6b',
        questionAudio: 'Milky Way Galaxy',
        promptTr: 'Dinle! Milyarlarca yıldız ve gezegen barındıran gök adamız hangisidir?',
        options: [
          { id: 'o1', label: 'Navigation Compass', emoji: '🧭', isCorrect: false },
          { id: 'o2', label: 'Renewable Energy', emoji: '⚡', isCorrect: false },
          { id: 'o3', label: 'Milky Way Galaxy', emoji: '🌌', isCorrect: true },
          { id: 'o4', label: 'Champion', emoji: '🥇', isCorrect: false }
        ],
        praise: 'Harika bilim kulağı! Samanyolu galaksisi doğru bilindi!'
      },
      {
        id: 'q6c',
        questionAudio: 'Mobile Technology',
        promptTr: 'Dinle! Dünya ile anında iletişim kurmamızı sağlayan cihazlar bütünü nedir?',
        options: [
          { id: 'o1', label: 'Mobile Technology', emoji: '📱', isCorrect: true },
          { id: 'o2', label: 'Planet Saturn', emoji: '🪐', isCorrect: false },
          { id: 'o3', label: 'Mountain Trail', emoji: '⛰️', isCorrect: false },
          { id: 'o4', label: 'Best Friend', emoji: '🤝', isCorrect: false }
        ],
        praise: 'Mükemmel! Mobile Technology doğru tespit edildi!'
      }
    ],
    '14-17': [
      {
        id: 'q7',
        questionAudio: 'Algorithm',
        promptTr: 'Dinle! Yazılım ve mantıksal problem çözme adımlarına ne ad verilir?',
        options: [
          { id: 'o1', label: 'Algorithm', emoji: '💻', isCorrect: true },
          { id: 'o2', label: 'Soundtrack', emoji: '🎧', isCorrect: false },
          { id: 'o3', label: 'Perspective', emoji: '💡', isCorrect: false },
          { id: 'o4', label: 'Teamwork', emoji: '🏆', isCorrect: false }
        ],
        praise: 'Keskin zeka! Algorithm doğru eşleştirildi!'
      },
      {
        id: 'q7b',
        questionAudio: 'Artificial Intelligence',
        promptTr: 'Dinle! Dünyayı dönüştüren yapay zekâ teknolojisi hangisidir?',
        options: [
          { id: 'o1', label: 'Eco Sustainability', emoji: '🌿', isCorrect: false },
          { id: 'o2', label: 'Artificial Intelligence', emoji: '🧠', isCorrect: true },
          { id: 'o3', label: 'Inspiring Leadership', emoji: '🌟', isCorrect: false },
          { id: 'o4', label: 'Digital Music', emoji: '🎧', isCorrect: false }
        ],
        praise: 'Muazzam! Artificial Intelligence küresel geleceğin merkezidir!'
      },
      {
        id: 'q7c',
        questionAudio: 'Inspiring Leadership',
        promptTr: 'Dinle! Ekip üyelerini dinleyip değişime öncülük etme vasfı nedir?',
        options: [
          { id: 'o1', label: 'Algorithm Code', emoji: '💻', isCorrect: false },
          { id: 'o2', label: 'Inspiring Leadership', emoji: '🌟', isCorrect: true },
          { id: 'o3', label: 'Solar Turbine', emoji: '⚡', isCorrect: false },
          { id: 'o4', label: 'Urban Metro', emoji: '🚇', isCorrect: false }
        ],
        praise: 'Tebrikler! Inspiring Leadership liderlik becerisidir!'
      }
    ]
  };

  // ==================== OYUN 2: CÜMLE YAPBOZU (SENTENCE PUZZLE LEGO) ====================
  const PUZZLE_CHALLENGES: Record<AgeGroup, KidSentencePuzzleItem[]> = {
    '5-7': [
      { id: 'p1', targetEn: 'I want water please', targetTr: 'Su istiyorum lütfen', words: ['water', 'I', 'please', 'want'], emoji: '💧', hint: 'Önce "I" (Ben), sonra "want" (istiyorum)...' },
      { id: 'p2', targetEn: 'I like red apples', targetTr: 'Kırmızı elmaları severim', words: ['apples', 'like', 'red', 'I'], emoji: '🍎', hint: 'Önce kim sever? "I like"...' },
      { id: 'p3', targetEn: 'The cat is happy', targetTr: 'Kedi çok mutlu', words: ['happy', 'The', 'is', 'cat'], emoji: '🐱', hint: 'Kediyle başla: "The cat is happy"' },
      { id: 'p3b', targetEn: 'Look at the big tree', targetTr: 'Büyük ağaca bak', words: ['big', 'Look', 'tree', 'at', 'the'], emoji: '🌳', hint: 'Bakmak için "Look at..." ile başla' }
    ],
    '8-10': [
      { id: 'p4', targetEn: 'Can I have milk please', targetTr: 'Süt alabilir miyim lütfen', words: ['have', 'milk', 'Can', 'please', 'I'], emoji: '🥛', hint: 'İzin isterken "Can I have..." kalıbını kullanırız.' },
      { id: 'p5', targetEn: 'I can ride my bicycle', targetTr: 'Bisikletimi sürebiliyorum', words: ['ride', 'bicycle', 'can', 'my', 'I'], emoji: '🚲', hint: 'Yetenek bildirirken: "I can ride..."' },
      { id: 'p6', targetEn: 'Where is my backpack', targetTr: 'Okul çantam nerede', words: ['my', 'is', 'Where', 'backpack'], emoji: '🎒', hint: 'Nerede sorusu "Where is..." ile başlar.' },
      { id: 'p6b', targetEn: 'Let us play football together', targetTr: 'Birlikte futbol oynayalım', words: ['together', 'football', 'play', 'Let', 'us'], emoji: '⚽', hint: 'Teklif için "Let us..." ile başla.' }
    ],
    '11-13': [
      { id: 'p7', targetEn: 'Excuse me where is the museum', targetTr: 'Affedersiniz müze nerede', words: ['where', 'Excuse', 'museum', 'the', 'me', 'is'], emoji: '🏛️', hint: 'Kibarca başla: "Excuse me, where is..."' },
      { id: 'p8', targetEn: 'How much is the student ticket', targetTr: 'Öğrenci bileti ne kadar', words: ['much', 'the', 'ticket', 'How', 'is', 'student'], emoji: '🎟️', hint: 'Fiyat sorarken "How much is..."' },
      { id: 'p8b', targetEn: 'We are ready for an adventure', targetTr: 'Biz bir macera için hazırız', words: ['ready', 'adventure', 'We', 'for', 'are', 'an'], emoji: '🗺️', hint: 'Biz hazırız: "We are ready for..."' },
      { id: 'p8c', targetEn: 'Please keep quiet in the library', targetTr: 'Lütfen kütüphanede sessiz olun', words: ['quiet', 'in', 'Please', 'library', 'keep', 'the'], emoji: '📚', hint: 'Nezaket ricası: "Please keep quiet..."' }
    ],
    '14-17': [
      { id: 'p9', targetEn: 'In my opinion teamwork is important', targetTr: 'Bana göre takım çalışması önemlidir', words: ['teamwork', 'opinion', 'important', 'In', 'is', 'my'], emoji: '🤝', hint: 'Kendi fikrini ifade ederken "In my opinion..."' },
      { id: 'p9b', targetEn: 'Artificial intelligence transforms language learning', targetTr: 'Yapay zekâ dil öğrenimini dönüştürüyor', words: ['transforms', 'intelligence', 'Artificial', 'learning', 'language'], emoji: '🧠', hint: 'Özneyle başla: "Artificial intelligence..."' },
      { id: 'p9c', targetEn: 'Empathetic leaders listen actively to others', targetTr: 'Empatik liderler diğerlerini aktif dinler', words: ['actively', 'leaders', 'Empathetic', 'others', 'to', 'listen'], emoji: '🌟', hint: 'Özneyle başla: "Empathetic leaders..."' },
      { id: 'p9d', targetEn: 'Creative innovation solves real world problems', targetTr: 'Yaratıcı yenilik gerçek dünya sorunlarını çözer', words: ['solves', 'Creative', 'problems', 'innovation', 'real', 'world'], emoji: '💡', hint: 'Özne: "Creative innovation..."' }
    ]
  };

  // ==================== OYUN 3: SÜPER TELAFFUZ ARENASI (VOICE COACH) ====================
  const VOICE_CHALLENGES: Record<AgeGroup, { en: string; tr: string; tip: string; emoji: string }[]> = {
    '5-7': [
      { en: 'I want milk, please!', tr: 'Süt istiyorum lütfen!', tip: 'Sonundaki "please" kelimesini kibarca uzatarak söyle.', emoji: '🥛' },
      { en: 'Look at the happy dog!', tr: 'Mutlu köpeğe bak!', tip: '"Look" derken u harfini kısa söyle.', emoji: '🐶' },
      { en: 'Can I have an apple?', tr: 'Bir elma alabilir miyim?', tip: '"Can I" ifadesini birleşik akıcı söyle: Ken-ay.', emoji: '🍎' },
      { en: 'The sun is shining bright!', tr: 'Güneş pırıl pırıl parlıyor!', tip: '"Bright" derken sonundaki t harfine hafif vurgu yap.', emoji: '☀️' }
    ],
    '8-10': [
      { en: 'Can I borrow your pencil?', tr: 'Kurşun kalemini ödünç alabilir miyim?', tip: '"Borrow" kelimesini baro-v gibi doğal telaffuz et.', emoji: '✏️' },
      { en: 'I love playing football with friends.', tr: 'Arkadaşlarımla futbol oynamayı çok severim.', tip: '"Friends" sonundaki s harfini hafifçe duyur.', emoji: '⚽' },
      { en: 'My backpack is full of colorful books.', tr: 'Çantam renkli kitaplarla dolu.', tip: '"Backpack" kelimesinde iki k sesini net çıkar.', emoji: '🎒' },
      { en: 'Look through the telescope to see the moon!', tr: 'Aydaki kraterleri görmek için teleskoptan bak!', tip: '"Telescope" kelimesinde te-le-skop ritmini tuttur.', emoji: '🔭' }
    ],
    '11-13': [
      { en: 'Where can I find the science book?', tr: 'Fen kitabını nerede bulabilirim?', tip: '"Science" derken s-a-y-ıns gibi akıcı bağla.', emoji: '🔬' },
      { en: 'We are preparing an exciting space project.', tr: 'Heyecan verici bir uzay projesi hazırlıyoruz.', tip: '"Exciting" kelimesinde ik-say-ting ritmini koru.', emoji: '🚀' },
      { en: 'Could you please show me the way to the library?', tr: 'Kütüphaneye giden yolu bana gösterebilir misiniz?', tip: '"Could you" kalıbını kud-yu şeklinde yumuşak söyle.', emoji: '📚' },
      { en: 'Solar panels generate clean renewable energy.', tr: 'Güneş panelleri temiz yenilenebilir enerji üretir.', tip: '"Renewable" kelimesini ri-nu-vıbıl şeklinde telaffuz et.', emoji: '⚡' }
    ],
    '14-17': [
      { en: 'I really enjoy learning languages with Chirmo.', tr: 'Chirmo ile dil öğrenmekten gerçekten keyif alıyorum.', tip: '"Really enjoy" ifadesini vurgulayarak konuş.', emoji: '🚀' },
      { en: 'In my perspective, critical thinking drives innovation.', tr: 'Benim açımdan, eleştirel düşünce inovasyonu tetikler.', tip: '"Perspective" ve "Innovation" sözcüklerinde vurguyu heceye ver.', emoji: '💡' },
      { en: 'Artificial intelligence transforms modern communication.', tr: 'Yapay zekâ modern iletişimi kökten dönüştürüyor.', tip: '"Artificial" derken ar-ti-fi-şıl akıcılığını sağla.', emoji: '🧠' },
      { en: 'Effective leadership requires active listening and empathy.', tr: 'Etkili liderlik aktif dinleme ve empati gerektirir.', tip: '"Empathy" kelimesini em-pı-ti şeklinde sakin telaffuz et.', emoji: '🌟' }
    ]
  };

  // ==================== ÇOCUKLAR İÇİN ŞARKILAR & KARAOKE ====================
  const KIDS_SONGS: KidSongItem[] = [
    {
      id: 's1',
      title: 'ABC Phonics Song',
      category: 'Harfler ve Sesler',
      duration: '2:10 dk',
      audioSample: 'A is for Apple, B is for Ball, C is for Cat, D is for Dog. We love English!',
      lyrics: [
        'A is for Apple, a-a-apple! 🍎',
        'B is for Ball, b-b-ball! ⚽',
        'C is for Cat, c-c-cat! 🐱',
        'D is for Dog, d-d-dog! 🐶',
        'Now I know my ABC, next time won’t you sing with me? 🌟'
      ],
      grammarFocus: 'İngilizce harflerin doğal ses karşılıkları (Phonics).'
    },
    {
      id: 's2',
      title: 'Old MacDonald Had a Farm',
      category: 'Hayvanlar ve Sesler',
      duration: '2:45 dk',
      audioSample: 'Old MacDonald had a farm, E-I-E-I-O! And on that farm he had a cow, E-I-E-I-O!',
      lyrics: [
        'Old MacDonald had a farm, E-I-E-I-O! 🚜',
        'And on that farm he had a cow, E-I-E-I-O! 🐮',
        'With a moo moo here and a moo moo there! 🌾',
        'Here a moo, there a moo, everywhere a moo moo! 🐾'
      ],
      grammarFocus: 'Hayvan isimleri ve geçmiş zaman hikaye ritmi.'
    },
    {
      id: 's3',
      title: 'Colors Everywhere',
      category: 'Renkler ve Nezaket',
      duration: '1:50 dk',
      audioSample: 'Red and yellow, green and blue! Beautiful colors for me and you!',
      lyrics: [
        'Red, yellow, green and blue! 🌈',
        'I see bright colors, how about you? 🎨',
        'Purple flowers, orange sun! ☀️',
        'Learning colors is so much fun! 🎈'
      ],
      grammarFocus: 'Renk sıfatları ve soru sorma refleksi.'
    },
    {
      id: 's4',
      title: 'Five Little Monkeys Jumping on the Bed',
      category: 'Sayılar ve Eylemler',
      duration: '2:15 dk',
      audioSample: 'Five little monkeys jumping on the bed! One fell off and bumped his head!',
      lyrics: [
        'Five little monkeys jumping on the bed! 🐒',
        'One fell off and bumped his head! 🤕',
        'Mama called the doctor and the doctor said: 🩺',
        '"No more monkeys jumping on the bed!" 🛏️'
      ],
      grammarFocus: '1-5 arası sayılar ve olumsuz emir kalıbı ("No more...").'
    }
  ];

  // ==================== CHIRMO ANIMAL SAFARI (SESLİ HAYVANAT BAHÇESİ) ====================
  const SAFARI_ANIMALS = [
    {
      id: 'an-lion',
      nameEn: 'Lion',
      nameTr: 'Cesur Aslan',
      emoji: '🦁',
      soundText: 'Roar! I am the brave lion, the king of the jungle!',
      funTr: 'Aslanlar safaride kükrer ve çok güçlüdür.'
    },
    {
      id: 'an-elephant',
      nameEn: 'Elephant',
      nameTr: 'Sevimli Fil',
      emoji: '🐘',
      soundText: 'Trumpet! I am a big gentle elephant with large ears!',
      funTr: 'Filler hortumlarıyla su püskürtmeyi çok sever.'
    },
    {
      id: 'an-monkey',
      nameEn: 'Monkey',
      nameTr: 'Neşeli Maymun',
      emoji: '🐒',
      soundText: 'Ooh ooh aah aah! I love bananas and jumping on trees!',
      funTr: 'Maymunlar ağaçtan ağaca zıplar ve muz yer.'
    },
    {
      id: 'an-dolphin',
      nameEn: 'Dolphin',
      nameTr: 'Akıllı Yunus',
      emoji: '🐬',
      soundText: 'Splash! I swim fast and do backflips in the blue ocean!',
      funTr: 'Yunuslar denizde taklalar atan çok zeki dostlardır.'
    },
    {
      id: 'an-owl',
      nameEn: 'Owl',
      nameTr: 'Bilge Baykuş',
      emoji: '🦉',
      soundText: 'Hoot hoot! I read storybooks under the starry night sky!',
      funTr: 'Baykuşlar gece uyanır ve kocaman gözleriyle her şeyi görür.'
    },
    {
      id: 'an-frog',
      nameEn: 'Frog',
      nameTr: 'Zıpzıp Kurbağa',
      emoji: '🐸',
      soundText: 'Ribbit ribbit! I can jump high over the green water lily!',
      funTr: 'Kurbağalar nilüfer yapraklarının üzerinden yükseğe zıplar.'
    },
    {
      id: 'an-dog',
      nameEn: 'Dog',
      nameTr: 'Sadık Köpekçik',
      emoji: '🐶',
      soundText: 'Woof woof! I love playing fetch with a bouncy ball!',
      funTr: 'Köpekler topla oynamayı ve kuyruk sallamayı sever.'
    },
    {
      id: 'an-cat',
      nameEn: 'Cat',
      nameTr: 'Yumuşak Kedicik',
      emoji: '🐱',
      soundText: 'Meow meow! Purr... Let us drink warm milk and cuddle!',
      funTr: 'Kediler mırıldanarak süt içmeye bayılır.'
    }
  ];

  // ==================== MAGIC COLOR & SPEAK LABORATUVARI ====================
  const MAGIC_COLORS = [
    {
      id: 'c-red',
      nameEn: 'Red',
      nameTr: 'Kırmızı',
      bgClass: 'from-rose-500 to-red-600',
      textClass: 'text-rose-600',
      objectEn: 'Red Apple',
      objectTr: 'Kırmızı Elma',
      emoji: '🍎',
      sample: 'I like red sweet apples!'
    },
    {
      id: 'c-blue',
      nameEn: 'Blue',
      nameTr: 'Mavi',
      bgClass: 'from-blue-500 to-indigo-600',
      textClass: 'text-blue-600',
      objectEn: 'Blue Rocket',
      objectTr: 'Mavi Roket',
      emoji: '🚀',
      sample: 'The blue rocket flies into space!'
    },
    {
      id: 'c-yellow',
      nameEn: 'Yellow',
      nameTr: 'Sarı',
      bgClass: 'from-amber-400 to-yellow-500',
      textClass: 'text-amber-600',
      objectEn: 'Yellow Sun',
      objectTr: 'Sarı Güneş',
      emoji: '☀️',
      sample: 'The yellow sun shines bright!'
    },
    {
      id: 'c-green',
      nameEn: 'Green',
      nameTr: 'Yeşil',
      bgClass: 'from-emerald-500 to-green-600',
      textClass: 'text-emerald-600',
      objectEn: 'Green Frog',
      objectTr: 'Yeşil Kurbağa',
      emoji: '🐸',
      sample: 'The green frog jumps high!'
    },
    {
      id: 'c-purple',
      nameEn: 'Purple',
      nameTr: 'Mor',
      bgClass: 'from-purple-500 to-indigo-600',
      textClass: 'text-purple-600',
      objectEn: 'Purple Grapes',
      objectTr: 'Mor Üzümler',
      emoji: '🍇',
      sample: 'Sweet purple grapes are yummy!'
    },
    {
      id: 'c-orange',
      nameEn: 'Orange',
      nameTr: 'Turuncu',
      bgClass: 'from-orange-400 to-amber-500',
      textClass: 'text-orange-600',
      objectEn: 'Orange Tiger',
      objectTr: 'Turuncu Kaplan',
      emoji: '🐯',
      sample: 'The orange tiger runs fast!'
    }
  ];

  // ==================== KIDS CARTOON DIALOGUES ====================
  const KIDS_CHAT_STEPS: Record<AgeGroup, {
    id: string;
    chirmoEn: string;
    chirmoTr: string;
    options: { textEn: string; textTr: string; emoji: string; replyEn: string }[];
  }[]> = {
    '5-7': [
      {
        id: 'kc-1',
        chirmoEn: 'Hello little superstar! 🌟 What is your favorite animal?',
        chirmoTr: 'Merhaba minik süperstar! En sevdiğin hayvan hangisi?',
        options: [
          { textEn: 'I love cats!', textTr: 'Kedileri severim! 🐱', emoji: '🐱', replyEn: 'Meow! Cats are so fluffy and cute!' },
          { textEn: 'I love dogs!', textTr: 'Köpekleri severim! 🐶', emoji: '🐶', replyEn: 'Woof woof! Dogs are the best friends ever!' },
          { textEn: 'I love lions!', textTr: 'Aslanları severim! 🦁', emoji: '🦁', replyEn: 'Roar! You are as brave as a mighty lion!' }
        ]
      },
      {
        id: 'kc-2',
        chirmoEn: 'Yummy! What do you want to eat right now? 🍦',
        chirmoTr: 'Nefis! Canın şu an ne yemek istiyor?',
        options: [
          { textEn: 'I want chocolate ice cream!', textTr: 'Çikolatalı dondurma istiyorum! 🍦', emoji: '🍦', replyEn: 'Ice cream is delicious on sunny days!' },
          { textEn: 'I want warm pizza!', textTr: 'Sıcak pizza istiyorum! 🍕', emoji: '🍕', replyEn: 'Mmm! Warm cheese pizza is awesome!' },
          { textEn: 'I want a sweet red apple!', textTr: 'Tatlı kırmızı elma istiyorum! 🍎', emoji: '🍎', replyEn: 'Super healthy choice! Apples give you energy!' }
        ]
      },
      {
        id: 'kc-3',
        chirmoEn: 'High five! 🖐️ Can you sing and dance with me?',
        chirmoTr: 'Çak bir beşlik! Benimle şarkı söyleyip dans eder misin?',
        options: [
          { textEn: 'Yes! I can sing!', textTr: 'Evet! Şarkı söyleyebilirim! 🎶', emoji: '🎤', replyEn: 'Hooray! Let us sing ABC and have fun!' },
          { textEn: 'Yes! I can dance!', textTr: 'Evet! Dans edebilirim! 💃', emoji: '🕺', replyEn: 'Dance party time! Shake your hands!' }
        ]
      }
    ],
    '8-10': [
      {
        id: 'kc-8a',
        chirmoEn: 'Hello champion! 🎒 What is your favorite school subject?',
        chirmoTr: 'Merhaba şampiyon! Okulda en sevdiğin ders hangisi?',
        options: [
          { textEn: 'I love science experiments!', textTr: 'Fen deneylerini severim! 🔬', emoji: '🔬', replyEn: 'Science unlocks the secrets of nature and galaxies!' },
          { textEn: 'I enjoy drawing in art class!', textTr: 'Resim dersini çok severim! 🎨', emoji: '🎨', replyEn: 'Creativity is your superpower! Keep painting!' },
          { textEn: 'I love physical education and soccer!', textTr: 'Beden eğitimi ve futbolu severim! ⚽', emoji: '⚽', replyEn: 'Active sports make you strong and confident!' }
        ]
      },
      {
        id: 'kc-8b',
        chirmoEn: 'Awesome! What do you like to do on sunny weekends? 🚲',
        chirmoTr: 'Harika! Güneşli hafta sonlarında ne yapmayı seversin?',
        options: [
          { textEn: 'I ride my bicycle in the park!', textTr: 'Parkta bisiklet sürerim! 🚲', emoji: '🚲', replyEn: 'Cycling in the fresh air is so refreshing!' },
          { textEn: 'I play video games with friends!', textTr: 'Arkadaşlarımla oyun oynarım! 🎮', emoji: '🎮', replyEn: 'Team gaming builds quick reflexes!' },
          { textEn: 'I read exciting comic books!', textTr: 'Heyecanlı çizgi romanlar okurum! 📚', emoji: '📚', replyEn: 'Reading expands your vocabulary wonderfully!' }
        ]
      }
    ],
    '11-13': [
      {
        id: 'kc-11a',
        chirmoEn: 'Hey there explorer! 🚀 What are your favorite hobbies after school?',
        chirmoTr: 'Selam genç kaşif! Okul çıkışında en sevdiğin hobilerin neler?',
        options: [
          { textEn: 'I am passionate about coding and mobile apps!', textTr: 'Kodlama ve mobil uygulamalara tutkuluyum! 💻', emoji: '💻', replyEn: 'Fantastic! Coding is the modern universal language!' },
          { textEn: 'I love basketball and team athletics!', textTr: 'Basketbol ve takım sporlarını severim! 🏀', emoji: '🏀', replyEn: 'Team sports teach communication and perseverance!' },
          { textEn: 'I play guitar and listen to indie tracks!', textTr: 'Gitar çalar, müzik dinlerim! 🎸', emoji: '🎸', replyEn: 'Music is an amazing accelerator for natural fluency!' }
        ]
      },
      {
        id: 'kc-11b',
        chirmoEn: 'Which country would you love to travel to first? 🗺️',
        chirmoTr: 'İlk olarak hangi ülkeye seyahat etmek isterdin?',
        options: [
          { textEn: 'I want to visit the UK to practice English daily!', textTr: 'İngilizce pratik için İngiltere’ye gitmek isterim! 🇬🇧', emoji: '🇬🇧', replyEn: 'London calling! You will speak like a native explorer!' },
          { textEn: 'I want to explore Japan and robotics!', textTr: 'Japonya’yı ve robot teknolojilerini görmek isterim! 🇯🇵', emoji: '🇯🇵', replyEn: 'Futuristic trains, tech hubs, and incredible culture!' },
          { textEn: 'I dream of visiting the NASA space center!', textTr: 'NASA uzay merkezini ziyaret etmeyi hayal ediyorum! 🚀', emoji: '🚀', replyEn: 'Reach for the stars! The universe is waiting for you!' }
        ]
      }
    ],
    '14-17': [
      {
        id: 'kc-14a',
        chirmoEn: 'Greetings! 💼 What is your biggest ambition for the future?',
        chirmoTr: 'Selamlar! Geleceğe dair en büyük hedefin nedir?',
        options: [
          { textEn: 'I aim to become a software engineer & AI founder!', textTr: 'Yazılım mühendisi ve yapay zekâ kurucusu olmayı hedefliyorum! 💻', emoji: '💻', replyEn: 'Visionary ambition! Chirmo will help you code and speak globally!' },
          { textEn: 'I want to study international relations and debate!', textTr: 'Uluslararası ilişkiler ve münazara okumak istiyorum! 🌍', emoji: '🌍', replyEn: 'Global leadership starts with empathetic communication!' },
          { textEn: 'I plan to design creative digital media and games!', textTr: 'Yaratıcı dijital medya ve oyunlar tasarlamak istiyorum! 🎮', emoji: '🎨', replyEn: 'Interactive storytelling is transforming modern culture!' }
        ]
      },
      {
        id: 'kc-14b',
        chirmoEn: 'What is the secret to mastering spoken English naturally? 🗣️',
        chirmoTr: 'Sence İngilizceyi doğal ve akıcı konuşmanın sırrı nedir?',
        options: [
          { textEn: 'Consistent daily practice without fear of mistakes!', textTr: 'Hata yapmaktan korkmadan her gün düzenli pratik yapmak! 🌟', emoji: '🌟', replyEn: 'Precisely! Confidence grows with every spoken sentence!' },
          { textEn: 'Immersing in real discussions, debates, and podcasts!', textTr: 'Gerçek tartışmalara, münazaralara ve yayınlara dahil olmak! 🎙️', emoji: '🎙️', replyEn: 'Contextual immersion is scientifically the fastest path to B2 fluency!' }
        ]
      }
    ]
  };

  // ==================== KIDS STICKER ALBUM ====================
  const STICKER_COLLECTION = [
    { id: 'stk-1', title: 'Uzay Roketi', emoji: '🚀', reqStars: 10 },
    { id: 'stk-2', title: 'Mutlu Dinozor', emoji: '🦖', reqStars: 20 },
    { id: 'stk-3', title: 'Sihirli Unicorn', emoji: '🦄', reqStars: 30 },
    { id: 'stk-4', title: 'Süper Kahraman', emoji: '🦸', reqStars: 45 },
    { id: 'stk-5', title: 'Gökkuşağı Tacı', emoji: '👑', reqStars: 60 },
    { id: 'stk-6', title: 'Şampiyon Kupası', emoji: '🏆', reqStars: 80 }
  ];

  // ==================== KELİME KATEGORİ LİSTESİ ====================
  const allCurrentVocab = (targetLang === 'de' ? GERMAN_AGE_VOCABULARY[selectedAge] : AGE_VOCABULARY[selectedAge]) || [];
  const uniqueCategories = ['Tümü', ...Array.from(new Set(allCurrentVocab.map((v) => v.category)))];
  const filteredVocab = categoryFilter === 'Tümü'
    ? allCurrentVocab
    : allCurrentVocab.filter((v) => v.category === categoryFilter);

  // Mini-Game 1 Handlers
  const currentQuizzes = (targetLang === 'de' ? GERMAN_LISTENING_QUIZZES[selectedAge] : LISTENING_QUIZZES[selectedAge]) || (targetLang === 'de' ? GERMAN_LISTENING_QUIZZES['5-7'] : LISTENING_QUIZZES['5-7']);
  const activeQuiz = currentQuizzes[quizIndex % currentQuizzes.length];

  const handleSelectQuizOption = (optId: string, isCorrect: boolean) => {
    setSelectedOptionId(optId);
    if (isCorrect) {
      setQuizAnswerState('correct');
      handleAwardStars(10, 'Doğru Cevap!');
      handleSpeak(activeQuiz.praise);
      setTimeout(() => {
        setQuizAnswerState('idle');
        setSelectedOptionId(null);
        setQuizIndex((prev) => (prev + 1) % currentQuizzes.length);
      }, 2000);
    } else {
      setQuizAnswerState('wrong');
      handleSpeak(targetLang === 'de' ? 'Versuche es noch einmal! Bir kez daha dene!' : 'Try again friend! Bir kez daha dene!');
      setTimeout(() => {
        setQuizAnswerState('idle');
        setSelectedOptionId(null);
      }, 1500);
    }
  };

  // Mini-Game 2 Handlers
  const currentPuzzles = (targetLang === 'de' ? GERMAN_PUZZLE_CHALLENGES[selectedAge] : PUZZLE_CHALLENGES[selectedAge]) || (targetLang === 'de' ? GERMAN_PUZZLE_CHALLENGES['5-7'] : PUZZLE_CHALLENGES['5-7']);
  const activePuzzle = currentPuzzles[puzzleIndex % currentPuzzles.length];

  const handleTogglePuzzleWord = (word: string) => {
    if (selectedPuzzleWords.includes(word)) {
      setSelectedPuzzleWords(selectedPuzzleWords.filter((w) => w !== word));
    } else {
      const nextWords = [...selectedPuzzleWords, word];
      setSelectedPuzzleWords(nextWords);
      const builtSentence = nextWords.join(' ');
      if (builtSentence === activePuzzle.targetEn) {
        setPuzzleSuccess(true);
        handleAwardStars(15, 'Cümleyi Doğru Kurdun!');
        handleSpeak(targetLang === 'de' ? `Wunderbar! ${activePuzzle.targetEn}` : `Awesome! ${activePuzzle.targetEn}`);
        setTimeout(() => {
          setPuzzleSuccess(false);
          setSelectedPuzzleWords([]);
          setPuzzleIndex((prev) => (prev + 1) % currentPuzzles.length);
        }, 2200);
      }
    }
  };

  const handleResetPuzzle = () => {
    setSelectedPuzzleWords([]);
    setPuzzleSuccess(false);
  };

  // Mini-Game 3 Handlers (Pronunciation Coach)
  const currentVoices = (targetLang === 'de' ? GERMAN_VOICE_CHALLENGES[selectedAge] : VOICE_CHALLENGES[selectedAge]) || (targetLang === 'de' ? GERMAN_VOICE_CHALLENGES['5-7'] : VOICE_CHALLENGES['5-7']);
  const activeVoice = currentVoices[voiceIndex % currentVoices.length];

  const handleSimulateVoiceRecording = () => {
    setVoiceStatus('listening');
    setTimeout(() => {
      setVoiceStatus('scored');
      setVoiceScore(96);
      handleAwardStars(20, 'Harika Telaffuz!');
      handleSpeak(targetLang === 'de' ? `Sehr gute Aussprache! ${activeVoice.en}` : `Very good pronunciation! ${activeVoice.en}`);
    }, 1800);
  };

  // Pattern Builder Live Sentence Construction
  const constructedKidsSentence = `${builderPrefix} ${builderObject} ${builderSuffix}`.trim();

  // ==================== PATTERN BUILDER SEÇENEKLERİ (YAŞA GÖRE ÖZELLEŞTİRİLMİŞ) ====================
  const PATTERN_OPTIONS: Record<AgeGroup, {
    prefixes: string[];
    objects: string[];
    suffixes: string[];
  }> = {
    '5-7': {
      prefixes: ['I want', 'Can I have', 'I like', 'Where is', 'I can'],
      objects: ['water', 'an apple', 'a bicycle', 'milk', 'my backpack', 'to play'],
      suffixes: ['please', 'today', 'now', 'together', 'with friends']
    },
    '8-10': {
      prefixes: ['Do you want to', 'I would love to', 'Can we practice', 'Let us explore', 'Why do you like'],
      objects: ['football with the team', 'new science experiments', 'reading comic books', 'drawing colorful posters', 'solving math puzzles'],
      suffixes: ['after class', 'at the weekend', 'in the school yard', 'with our classmates', 'every single day']
    },
    '11-13': {
      prefixes: ['Could you explain how to', 'I am passionate about', 'In my opinion, we should', 'How long does it take to', 'I really enjoy'],
      objects: ['building robotic models', 'exploring distant galaxies', 'learning foreign languages', 'protecting endangered wildlife', 'developing web projects'],
      suffixes: ['with great dedication', 'around the world', 'in our free time', 'step by step', 'to prepare for exams']
    },
    '14-17': {
      prefixes: ['From my perspective,', 'It is imperative that we', 'I strongly advocate for', 'To be completely honest,', 'Research clearly demonstrates that'],
      objects: ['ethical artificial intelligence', 'cross-cultural communication', 'sustainable green technology', 'collaborative teamwork skills', 'independent critical thinking'],
      suffixes: ['in modern society', 'to solve global challenges', 'without further delay', 'for future generations', 'in professional environments']
    }
  };

  // ==================== 4 BLOKLU CÜMLE FABRİKASI SEÇENEKLERİ (YAŞA GÖRE ÖZELLEŞTİRİLMİŞ) ====================
  const FACTORY_OPTIONS: Record<AgeGroup, {
    subjects: string[];
    actions: string[];
    objects: string[];
    contexts: string[];
  }> = {
    '5-7': {
      subjects: ['My friendly dog', 'The smart robot', 'The little rabbit', 'My best friend', 'A brave astronaut'],
      actions: ['is playing with', 'likes to eat', 'wants to explore', 'can see', 'is dancing with'],
      objects: ['a colorful ball', 'a sweet apple', 'a big rainbow', 'the space rocket', 'a delicious cookie'],
      contexts: ['in the sunny park', 'every single morning', 'under the big tree', 'in the cozy room', 'with a happy smile']
    },
    '8-10': {
      subjects: ['Our school soccer team', 'The curious student', 'My creative art teacher', 'A talented musician', 'The young programmer'],
      actions: ['is practicing daily with', 'won a golden trophy for', 'loves to share ideas about', 'is designing a project with', 'scored an amazing goal in'],
      objects: ['the championship match', 'a brand new telescope', 'the school science fair', 'a cheerful song', 'the robotics tournament'],
      contexts: ['at the community sports center', 'during lunch break', 'with great enthusiasm', 'in front of the whole school', 'every Saturday afternoon']
    },
    '11-13': {
      subjects: ['The junior research club', 'Our international pen pal', 'The environmental team', 'A brilliant young inventor', 'My debate partner'],
      actions: ['is conducting research on', 'strongly recommends exploring', 'is organizing an event about', 'successfully developed a model for', 'is discussing solutions for'],
      objects: ['clean renewable energy systems', 'deep ocean conservation', 'interactive mobile apps', 'planetary navigation methods', 'modern library resources'],
      contexts: ['at the national science conference', 'through digital study platforms', 'with peer mentors', 'across multiple European cities', 'with inspiring confidence']
    },
    '14-17': {
      subjects: ['Youth tech leaders', 'Our high school debate team', 'Aspiring software engineers', 'Global climate activists', 'Innovative content creators'],
      actions: ['are actively collaborating on', 'deliver powerful presentations about', 'critically examine arguments regarding', 'design scalable solutions for', 'inspire international audiences with'],
      objects: ['ethical artificial intelligence', 'next-generation web architecture', 'global educational equity', 'sustainable urban ecosystems', 'cross-cultural fluency'],
      contexts: ['at international hackathons', 'in global summit discussions', 'to empower marginalized communities', 'through cutting-edge digital media', 'for long-term worldwide impact']
    }
  };

  // ==================== GÜNÜN SESLİ KONUŞMA MEYDAN OKUMALARI ====================
  const AGE_SPEAKING_CHALLENGES: Record<AgeGroup, {
    title: string;
    en: string;
    tr: string;
    tips: string;
    topic: string;
    level: string;
  }> = {
    '5-7': {
      title: 'İlk Cümlelerim & Sevimli İstekler',
      en: 'Hello Chirmo! I want a sweet red apple, please!',
      tr: 'Merhaba Chirmo! Tatlı kırmızı bir elma istiyorum lütfen!',
      tips: 'Kelimeleri tane tane ve gülümseyerek söyle: "sweet red apple".',
      topic: 'Nezaket & İstek',
      level: 'Pre-A1'
    },
    '8-10': {
      title: 'Okul Hayatı & Arkadaşça İş Birliği',
      en: 'Can I borrow your sharp pencil? We are preparing for the school science fair!',
      tr: 'Kurşun kalemini ödünç alabilir miyim? Okul fen fuarı için hazırlanıyoruz!',
      tips: '"Can I borrow" kalıbını ken-ay baro-v şeklinde birleşik ve akıcı bağla.',
      topic: 'İzin İsteme & Takım Çalışması',
      level: 'A1+'
    },
    '11-13': {
      title: 'Merak, Bilim & Fikir Belirtme',
      en: 'In my opinion, space exploration and renewable energy will shape our future!',
      tr: 'Bana göre uzay keşfi ve yenilenebilir enerji geleceğimizi şekillendirecek!',
      tips: '"In my opinion" girişini vurgulayarak kendine güvenen bir tonla konuş.',
      topic: 'Fikir Paylaşımı & Bilim',
      level: 'A2'
    },
    '14-17': {
      title: 'Küresel Münazara, Liderlik & İnovasyon',
      en: 'From my perspective, artificial intelligence and active collaboration empower us to solve global problems.',
      tr: 'Benim bakış açıma göre, yapay zekâ ve aktif iş birliği küresel sorunları çözmemizi güçlendiriyor.',
      tips: '"Perspective", "intelligence" ve "collaboration" sözcüklerine doğal vurgu ver.',
      topic: 'Akıcı Münazara & Liderlik',
      level: 'B1 / B2'
    }
  };

  // ==================== TPR ACTION LAB (CHIRMO DİYOR Kİ! / SIMON SAYS - YAŞA GÖRE ÖZEL) ====================
  const TPR_SIMON_ACTIONS: Record<AgeGroup, {
    id: string;
    title: string;
    commandTr: string;
    listenAudio: string;
    replyEn: string;
    replyTr: string;
    emoji: string;
    badge: string;
    hint: string;
  }[]> = {
    '5-7': [
      {
        id: 'simon-1',
        title: 'Touch your nose! 👃',
        commandTr: 'Burnuna dokun!',
        listenAudio: 'Simon says: Touch your nose!',
        replyEn: 'I am touching my nose!',
        replyTr: 'Burnuma dokunuyorum!',
        emoji: '👃',
        badge: 'Beden Farkındalığı',
        hint: 'İşaret parmağını burnuna değdir ve yüksek sesle söyle!'
      },
      {
        id: 'simon-2',
        title: 'Jump high like a bunny! 🐰',
        commandTr: 'Tavşan gibi yükseğe zıpla!',
        listenAudio: 'Simon says: Jump high like a bunny!',
        replyEn: 'I am jumping high like a little bunny!',
        replyTr: 'Küçük bir tavşan gibi yükseğe zıplıyorum!',
        emoji: '🐰',
        badge: 'Enerji & Hareket',
        hint: 'Ayağa fırla, iki kez havaya zıpla ve neşeyle tekrar et!'
      },
      {
        id: 'simon-3',
        title: 'Clap your hands three times! 👏',
        commandTr: 'Ellerini üç kez çırp!',
        listenAudio: 'Simon says: Clap your hands three times!',
        replyEn: 'One, two, three! Clap your hands!',
        replyTr: 'Bir, iki, üç! Ellerini çırp!',
        emoji: '👏',
        badge: 'Ritim & Koordinasyon',
        hint: 'Ellerini 1-2-3 diye neşeyle alkışla ve ritme katıl!'
      },
      {
        id: 'simon-4',
        title: 'Spin around and smile! 🌀',
        commandTr: 'Kendi etrafında dön ve gülümse!',
        listenAudio: 'Simon says: Spin around and smile!',
        replyEn: 'I am spinning around and wearing a big smile!',
        replyTr: 'Kendi etrafımda dönüyorum ve kocaman gülümsüyorum!',
        emoji: '😊',
        badge: 'Denge & Neşe',
        hint: 'Kendi etrafında yavaşça bir tur dön ve Chirmo\'ya gülümse!'
      },
      {
        id: 'simon-5',
        title: 'Fly like a superhero! 🦸‍♂️',
        commandTr: 'Süper kahraman gibi uç!',
        listenAudio: 'Simon says: Fly like a superhero in the sky!',
        replyEn: 'Whoosh! I am flying high like a superhero!',
        replyTr: 'Vuuuuş! Süper kahraman gibi gökyüzünde uçuyorum!',
        emoji: '🦸‍♂️',
        badge: 'Hayal Gücü',
        hint: 'Kollarını gökyüzüne doğru aç ve rüzgar gibi süzül!'
      },
      {
        id: 'simon-6',
        title: 'Roar like a baby lion! 🦁',
        commandTr: 'Yavru aslan gibi kükre!',
        listenAudio: 'Simon says: Roar like a brave baby lion!',
        replyEn: 'Roar! I am a brave little lion!',
        replyTr: 'Kükre! Ben cesur küçük bir aslanım!',
        emoji: '🦁',
        badge: 'Ses & Cesaret',
        hint: 'Patilerini göster ve neşeyle "Roar" diye ses ver!'
      }
    ],
    '8-10': [
      {
        id: 'simon-8a',
        title: 'Put on your backpack and say: Ready for school! 🎒',
        commandTr: 'Okul çantanı tak ve: Okula hazırım de!',
        listenAudio: 'Simon says: Put on your backpack and say: I am ready for school!',
        replyEn: 'I am ready for an awesome school day!',
        replyTr: 'Harika bir okul günü için hazırım!',
        emoji: '🎒',
        badge: 'Okul Heyecanı',
        hint: 'Omuzlarını dikleştir, çantanı taktığını hayal et ve söyle!'
      },
      {
        id: 'simon-8b',
        title: 'Kick the soccer ball and shout: Goal! ⚽',
        commandTr: 'Topa şut çek ve Gol diye haykır!',
        listenAudio: 'Simon says: Kick the soccer ball and shout: Goal!',
        replyEn: 'Goal! What a magnificent shot!',
        replyTr: 'Gol! Ne muhteşem bir şut!',
        emoji: '⚽',
        badge: 'Takım Ruhu',
        hint: 'Ayağını ileri doğru savurarak sevinçle zıpla!'
      },
      {
        id: 'simon-8c',
        title: 'Pretend to ride a bicycle and ring the bell: Ding ding! 🚲',
        commandTr: 'Bisiklet sürdüğünü canlandır ve zili çal!',
        listenAudio: 'Simon says: Ride your bicycle and ring the bell!',
        replyEn: 'Ding ding! Watch out, bicycle coming through!',
        replyTr: 'Çin çin! Dikkat edin, bisiklet geliyor!',
        emoji: '🚲',
        badge: 'Denge & Eğlence',
        hint: 'Kollarını gidon tutar gibi tut ve neşeyle söyle!'
      },
      {
        id: 'simon-8d',
        title: 'High five your partner and say: Great teamwork! ✋',
        commandTr: 'Elini uzatıp: Harika takım çalışması de!',
        listenAudio: 'Simon says: High five and say: Great teamwork!',
        replyEn: 'High five! We make an unbeatable team!',
        replyTr: 'Çak bir beşlik! Biz yenilmez bir takımız!',
        emoji: '✋',
        badge: 'Arkadaşlık',
        hint: 'Avucunu havaya kaldır ve gülümseyerek söyle!'
      }
    ],
    '11-13': [
      {
        id: 'simon-11a',
        title: 'Stand up tall and present: Welcome to our science fair! 🔬',
        commandTr: 'Ayağa kalk ve sunum yap: Bilim fuarımıza hoş geldiniz!',
        listenAudio: 'Simon says: Stand up tall and present: Welcome to our science fair!',
        replyEn: 'Welcome everyone! Today I present our clean energy project!',
        replyTr: 'Herkese hoş geldiniz! Bugün temiz enerji projemizi sunuyorum!',
        emoji: '🔬',
        badge: 'Genç Bilim İnsanı',
        hint: 'Özgüvenle ayağa kalk ve topluluğa hitap eder gibi konuş!'
      },
      {
        id: 'simon-11b',
        title: 'Hold the podcast mic and introduce yourself! 🎙️',
        commandTr: 'Mikrofonu eline al ve kendini dünyaya tanıt!',
        listenAudio: 'Simon says: Hold the mic and introduce yourself with energy!',
        replyEn: 'Hello world! Welcome to the Chirmo Global Youth Radio!',
        replyTr: 'Merhaba dünya! Chirmo Küresel Gençlik Radyosuna hoş geldiniz!',
        emoji: '🎙️',
        badge: 'Medya & İletişim',
        hint: 'Elini mikrofon gibi tutarak enerjik bir radyo spikeri ol!'
      },
      {
        id: 'simon-11c',
        title: 'Check your navigation compass: Head towards your dreams! 🧭',
        commandTr: 'Pusulana bak ve yönünü hedeflerine çevir!',
        listenAudio: 'Simon says: Check your compass and declare your ambition!',
        replyEn: 'The compass points north; we are heading towards success!',
        replyTr: 'Pusula kuzeyi gösteriyor; başarıya doğru ilerliyoruz!',
        emoji: '🧭',
        badge: 'Keşif & Vizyon',
        hint: 'Pusulayı inceliyormuş gibi yap ve kararlılıkla söyle!'
      }
    ],
    '14-17': [
      {
        id: 'simon-14a',
        title: 'Take a confident speaker stance: In my perspective... 💡',
        commandTr: 'Lider duruşuna geç ve fikrini açıkla!',
        listenAudio: 'Simon says: Take a speaker stance and share your perspective!',
        replyEn: 'In my perspective, critical thinking and creativity drive real innovation!',
        replyTr: 'Benim açımdan, eleştirel düşünce ve yaratıcılık gerçek inovasyonu tetikler!',
        emoji: '💡',
        badge: 'Münazara & Retorik',
        hint: 'Göz temasını koruyarak sakin, net ve kararlı bir ses tonuyla söyle!'
      },
      {
        id: 'simon-14b',
        title: 'Pitch your innovative tech idea in 15 seconds! 🚀',
        commandTr: 'Yenilikçi teknoloji fikrini 15 saniyede sun!',
        listenAudio: 'Simon says: Pitch your innovative startup idea with conviction!',
        replyEn: 'Our software empowers teenagers worldwide to master languages fluently!',
        replyTr: 'Yazılımımız dünya çapındaki gençlerin akıcı yabancı dil konuşmasını sağlıyor!',
        emoji: '🚀',
        badge: 'Girişimcilik',
        hint: 'Enerjini yüksek tut ve vizyonunu tek bir güçlü cümleyle aktar!'
      },
      {
        id: 'simon-14c',
        title: 'Deliver a TED-style closing quote to inspire the audience! 🌟',
        commandTr: 'Kitleye ilham veren TED tarzı bir kapanış yap!',
        listenAudio: 'Simon says: Deliver an inspiring TED-style closing message!',
        replyEn: 'Small consistent daily actions create extraordinary global impact!',
        replyTr: 'Her gün atılan küçük tutarlı adımlar olağanüstü küresel etki yaratır!',
        emoji: '🌟',
        badge: 'İlham Veren Liderlik',
        hint: 'Derin bir nefes al ve kelimelerin gücünü hissederek seslendir!'
      }
    ]
  };

  // ==================== İNTERAKTİF SESLİ HİKAYE SAHNELERİ (YAŞA GÖRE ÖZEL) ====================
  const STORYBOOK_SCENES: Record<AgeGroup, {
    id: string;
    name: string;
    nameEn: string;
    emoji: string;
    bgGradient: string;
    description: string;
    hotspots: {
      id: string;
      nameEn: string;
      nameTr: string;
      phraseEn: string;
      phraseTr: string;
      emoji: string;
    }[];
  }[]> = {
    '5-7': [
      {
        id: 'forest',
        name: 'Piknik Ormanı',
        nameEn: 'The Magical Picnic Forest',
        emoji: '🌳',
        bgGradient: 'from-emerald-500 via-green-600 to-teal-700',
        description: 'Güneşli ormanda sevimli hayvan dostlarımızla neşeli bir piknik günü!',
        hotspots: [
          { id: 'h1', nameEn: 'Cute Squirrel', nameTr: 'Sevimli Sincap', phraseEn: 'The cute squirrel is eating crunchy nuts under the tree.', phraseTr: 'Sevimli sincap ağacın altında çıtır fındıklar yiyor.', emoji: '🐿️' },
          { id: 'h2', nameEn: 'Picnic Basket', nameTr: 'Piknik Sepeti', phraseEn: 'Look at the picnic basket filled with sweet red apples and sandwiches!', phraseTr: 'Tatlı kırmızı elmalar ve sandviçlerle dolu piknik sepetine bak!', emoji: '🧺' },
          { id: 'h3', nameEn: 'Singing Bird', nameTr: 'Öten Kuş', phraseEn: 'The little blue bird sings a sweet morning melody.', phraseTr: 'Minik mavi kuş tatlı bir sabah melodisi söylüyor.', emoji: '🐦' },
          { id: 'h4', nameEn: 'Golden Butterfly', nameTr: 'Altın Kelebek', phraseEn: 'A magical golden butterfly dances over fragrant flowers.', phraseTr: 'Büyülü altın bir kelebek mis kokulu çiçeklerin üzerinde dans ediyor.', emoji: '🦋' }
        ]
      },
      {
        id: 'space',
        name: 'Uzay İstasyonu',
        nameEn: 'The Space Station Quest',
        emoji: '🚀',
        bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
        description: 'Yıldızlar ve gezegenler arasında unutulmaz bir uzay görevi!',
        hotspots: [
          { id: 'h5', nameEn: 'Brave Astronaut', nameTr: 'Cesur Astronot', phraseEn: 'The brave astronaut floats weightlessly in the space station.', phraseTr: 'Cesur astronot uzay istasyonunda yerçekimsiz süzülüyor.', emoji: '👨‍🚀' },
          { id: 'h6', nameEn: 'Space Rocket', nameTr: 'Uzay Roketi', phraseEn: 'The shiny rocket blasts through the sparkling Milky Way!', phraseTr: 'Parlak roket ışıldayan Samanyolu galaksisinde hızla ilerliyor!', emoji: '🚀' },
          { id: 'h7', nameEn: 'Ringed Planet Saturn', nameTr: 'Halkalı Gezegen Satürn', phraseEn: 'Saturn has bright glowing rings made of ice and cosmic dust.', phraseTr: 'Satürn buz ve kozmik tozdan oluşan parlak ışıltılı halkalara sahiptir.', emoji: '🪐' },
          { id: 'h8', nameEn: 'Friendly Alien', nameTr: 'Dost Uzaylı', phraseEn: 'The friendly green alien waves and says "Welcome to our galaxy!"', phraseTr: 'Dost canlısı yeşil uzaylı el sallıyor ve "Galaksimize hoş geldin!" diyor.', emoji: '👽' }
        ]
      },
      {
        id: 'ocean',
        name: 'Mavi Okyanus Krallığı',
        nameEn: 'The Blue Ocean Kingdom',
        emoji: '🐬',
        bgGradient: 'from-cyan-600 via-blue-700 to-indigo-800',
        description: 'Derin mavi sularda mercan kayalıkları ve sevimli deniz canlıları!',
        hotspots: [
          { id: 'h9', nameEn: 'Playful Dolphin', nameTr: 'Oyuncu Yunus', phraseEn: 'The joyful dolphin leaps gracefully above the turquoise waves!', phraseTr: 'Neşeli yunus turkuaz dalgaların üzerinde zarifçe sıçrıyor!', emoji: '🐬' },
          { id: 'h10', nameEn: 'Wise Sea Turtle', nameTr: 'Bilge Deniz Kaplumbağası', phraseEn: 'The wise sea turtle glides gently through the colorful coral reef.', phraseTr: 'Bilge deniz kaplumbağası renkli mercan kayalıklarının arasında sakince süzülüyor.', emoji: '🐢' },
          { id: 'h11', nameEn: 'Coral Reef', nameTr: 'Renkli Mercan Resifi', phraseEn: 'Vibrant coral formations provide cozy homes for tiny tropical fish.', phraseTr: 'Canlı mercan oluşumları minik tropik balıklar için sıcak yuvalar sunar.', emoji: '🪸' },
          { id: 'h12', nameEn: 'Shiny Pearl Shell', nameTr: 'Parlak İnci İstiridyesi', phraseEn: 'Inside the pearl shell lies a rare shimmering treasure of the sea.', phraseTr: 'İstiridyenin içinde denizin nadide, parıldayan bir hazinesi yatıyor.', emoji: '🦪' }
        ]
      },
      {
        id: 'dino',
        name: 'Dinozor Safari Parkı',
        nameEn: 'Dinosaur Safari Adventure',
        emoji: '🦖',
        bgGradient: 'from-amber-600 via-orange-600 to-rose-700',
        description: 'Milyonlarca yıl öncesine zamanda yolculuk ve dev dostlarımız!',
        hotspots: [
          { id: 'h13', nameEn: 'Gentle Brachiosaurus', nameTr: 'Sevimli Brakiyozor', phraseEn: 'The gentle long-necked dinosaur reaches green leaves on tall branches.', phraseTr: 'Sevimli uzun boyunlu dinozor yüksek dallardaki yeşil yapraklara uzanıyor.', emoji: '🦕' },
          { id: 'h14', nameEn: 'Mighty T-Rex', nameTr: 'Güçlü T-Rex', phraseEn: 'The mighty T-Rex lets out an energetic roar across the prehistoric jungle!', phraseTr: 'Güçlü T-Rex tarih öncesi ormanda enerjik bir kükreme bırakıyor!', emoji: '🦖' },
          { id: 'h15', nameEn: 'Flying Pterodactyl', nameTr: 'Uçan Terodaktil', phraseEn: 'The pterodactyl glides smoothly over misty volcanic peaks.', phraseTr: 'Terodaktil sisli volkanik tepelerin üzerinde pürüzsüzce süzülüyor.', emoji: '🦅' },
          { id: 'h16', nameEn: 'Dinosaur Egg', nameTr: 'Bebek Dinozor Yumurtası', phraseEn: 'Crack crack! Look, a cute baby dinosaur is hatching from the egg!', phraseTr: 'Çat çat! Bak, yumurtadan sevimli bir yavru dinozor çıkıyor!', emoji: '🥚' }
        ]
      }
    ],
    '8-10': [
      {
        id: 'school_lab',
        name: 'Akıllı Bilim Laboratuvarı',
        nameEn: 'The Smart Science Lab',
        emoji: '🔬',
        bgGradient: 'from-blue-600 via-indigo-600 to-purple-700',
        description: 'Okul fen laboratuvarında heyecan dolu deneyler ve keşifler!',
        hotspots: [
          { id: 'sl1', nameEn: 'Color Microscope', nameTr: 'Renkli Mikroskop', phraseEn: 'Look through the microscope to observe tiny plant cells up close!', phraseTr: 'Minik bitki hücrelerini yakından incelemek için mikroskoptan bak!', emoji: '🔬' },
          { id: 'sl2', nameEn: 'Glowing Flask', nameTr: 'Parlayan Deney Tüpü', phraseEn: 'The blue liquid creates friendly bubbles when mixed safely.', phraseTr: 'Mavi sıvı güvenle karıştırıldığında neşeli baloncuklar çıkarıyor.', emoji: '🧪' },
          { id: 'sl3', nameEn: 'Smart Robot Chirmo', nameTr: 'Akıllı Robot Chirmo', phraseEn: 'Chirmo calculates math equations at lightning speed!', phraseTr: 'Chirmo matematik denklemlerini şimşek hızında hesaplıyor!', emoji: '🤖' },
          { id: 'sl4', nameEn: 'Science Trophy', nameTr: 'Bilim Kupası', phraseEn: 'Our classroom won the golden science fair trophy!', phraseTr: 'Sınıfımız fen fuarı altın kupasını kazandı!', emoji: '🏆' }
        ]
      },
      {
        id: 'sports_arena',
        name: 'Şampiyonlar Sahası',
        nameEn: 'Champions Sports Arena',
        emoji: '⚽',
        bgGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
        description: 'Arkadaşlarla futbol, basketbol ve açık hava takım oyunları!',
        hotspots: [
          { id: 'sa1', nameEn: 'Football Goal', nameTr: 'Futbol Kalesi', phraseEn: 'He shoots from the penalty box and scores right into the top corner!', phraseTr: 'Ceza sahasından şutunu çekiyor ve tam 90’a gol atıyor!', emoji: '🥅' },
          { id: 'sa2', nameEn: 'Skateboard Trick', nameTr: 'Kaykay Hareketi', phraseEn: 'She performs a smooth jump with her colorful skateboard.', phraseTr: 'Renkli kaykayıyla pürüzsüz bir zıplama hareketi yapıyor.', emoji: '🛹' },
          { id: 'sa3', nameEn: 'Team Captain', nameTr: 'Takım Kaptanı', phraseEn: 'The captain encourages everyone: "Pass the ball and believe in yourself!"', phraseTr: 'Kaptan herkesi cesaretlendiriyor: "Topu pas ver ve kendine güven!"', emoji: '🧢' },
          { id: 'sa4', nameEn: 'Hydration Water', nameTr: 'Sporcu Suyu', phraseEn: 'Drink plenty of fresh water to keep your body energetic and active.', phraseTr: 'Vücudunu enerjik ve aktif tutmak için bol bol taze su iç.', emoji: '💧' }
        ]
      }
    ],
    '11-13': [
      {
        id: 'airport_travel',
        name: 'Uluslararası Havalimanı & Seyahat',
        nameEn: 'International Airport & Travel',
        emoji: '✈️',
        bgGradient: 'from-sky-600 via-blue-700 to-indigo-800',
        description: 'Yurt dışı gezileri, bilet sorma, yön bulma ve küresel diyaloglar!',
        hotspots: [
          { id: 'ap1', nameEn: 'Boarding Gate', nameTr: 'Uçuş Kapısı', phraseEn: 'Flight 702 to London is now boarding at Gate 14.', phraseTr: 'Londra’ya giden 702 sefer sayılı uçuş Kapı 14’ten yolcu alıyor.', emoji: '🚪' },
          { id: 'ap2', nameEn: 'Passport & Ticket', nameTr: 'Pasaport ve Bilet', phraseEn: 'Could you please present your student passport and boarding pass?', phraseTr: 'Öğrenci pasaportunuzu ve biniş kartınızı gösterebilir misiniz lütfen?', emoji: '🛂' },
          { id: 'ap3', nameEn: 'Information Desk', nameTr: 'Danışma Masası', phraseEn: 'Excuse me, where can I exchange currency and find the airport express?', phraseTr: 'Affedersiniz, nerede döviz bozdurabilir ve havalimanı metrosunu bulabilirim?', emoji: 'ℹ️' },
          { id: 'ap4', nameEn: 'Travel Backpack', nameTr: 'Seyahat Sırt Çantası', phraseEn: 'I always pack my English phrasebook, laptop, and cozy headphones.', phraseTr: 'Çantama her zaman İngilizce konuşma kılavuzumu, bilgisayarımı ve kulaklığımı koyarım.', emoji: '🎒' }
        ]
      },
      {
        id: 'smart_city',
        name: 'Geleceğin Akıllı Şehri',
        nameEn: 'Smart City of the Future',
        emoji: '🏙️',
        bgGradient: 'from-indigo-700 via-purple-800 to-slate-900',
        description: 'Yenilenebilir enerji, otonom araçlar ve yeşil teknolojiler!',
        hotspots: [
          { id: 'sc1', nameEn: 'Solar Skyscraper', nameTr: 'Güneş Enerjili Gökdelen', phraseEn: 'Modern solar glass panels generate clean electricity for the entire district.', phraseTr: 'Modern güneş enerjili cam paneller tüm bölge için temiz elektrik üretiyor.', emoji: '🏢' },
          { id: 'sc2', nameEn: 'Electric Metro', nameTr: 'Hızlı Elektrikli Metro', phraseEn: 'Autonomous magnetic trains carry passengers quietly across the metropolitan area.', phraseTr: 'Sürücüsüz manyetik trenler yolcuları metropol boyunca sessizce taşıyor.', emoji: '🚇' },
          { id: 'sc3', nameEn: 'Urban Garden', nameTr: 'Dikey Şehir Bahçesi', phraseEn: 'Vertical rooftop gardens reduce carbon footprints and produce organic vegetables.', phraseTr: 'Dikey çatı bahçeleri karbon ayak izini azaltır ve organik sebzeler üretir.', emoji: '🌿' },
          { id: 'sc4', nameEn: 'AI Weather Drone', nameTr: 'Hava Durumu Dronu', phraseEn: 'Smart drones monitor air quality and provide real-time climate data.', phraseTr: 'Akıllı dronlar hava kalitesini izler ve gerçek zamanlı iklim verileri sunar.', emoji: '🛸' }
        ]
      }
    ],
    '14-17': [
      {
        id: 'startup_hub',
        name: 'Silikon Vadisi Startup Kampüsü',
        nameEn: 'Silicon Valley Tech Hub',
        emoji: '💡',
        bgGradient: 'from-purple-800 via-violet-900 to-slate-950',
        description: 'Girişimcilik, yazılım projeleri, yatırımcı sunumu ve teknoloji kültürü!',
        hotspots: [
          { id: 'sh1', nameEn: 'Pitch Stage', nameTr: 'Sunum Sahnesi', phraseEn: 'The young founder presents her AI startup to international venture capitalists.', phraseTr: 'Genç kurucu yapay zekâ girişimini uluslararası risk sermayedarlarına sunuyor.', emoji: '🎤' },
          { id: 'sh2', nameEn: 'Open Workspace', nameTr: 'Açık Ofis & İş Birliği', phraseEn: 'Agile teams collaborate across time zones to ship production-ready code.', phraseTr: 'Çevik ekipler canlıya hazır kod çıkarmak için farklı saat dilimlerinde iş birliği yapıyor.', emoji: '💻' },
          { id: 'sh3', nameEn: 'Design Thinking Wall', nameTr: 'Tasarım Odaklı Düşünce Panosu', phraseEn: 'Sticky notes outline user research, feature roadmaps, and UI prototypes.', phraseTr: 'Not kağıtları kullanıcı araştırmalarını, özellik yol haritalarını ve arayüz prototiplerini listeliyor.', emoji: '📋' },
          { id: 'sh4', nameEn: 'Global Network', nameTr: 'Küresel İletişim Ağı', phraseEn: 'Connecting with mentors worldwide accelerates career growth and builds resilience.', phraseTr: 'Dünya çapındaki mentorlarla bağlantı kurmak kariyer gelişimini hızlandırır ve dayanıklılık kazandırır.', emoji: '🌐' }
        ]
      },
      {
        id: 'global_summit',
        name: 'Gençlik Münazara Zirvesi',
        nameEn: 'Global Youth Summit & Debate',
        emoji: '🎙️',
        bgGradient: 'from-cyan-800 via-blue-900 to-indigo-950',
        description: 'Uluslararası münazara, küresel iklim politikaları ve liderlik konuşmaları!',
        hotspots: [
          { id: 'gs1', nameEn: 'Delegate Podium', nameTr: 'Delege Kürsüsü', phraseEn: 'The student delegate delivers a persuasive opening argument on digital ethics.', phraseTr: 'Öğrenci delege dijital etik üzerine ikna edici bir açılış konuşması yapıyor.', emoji: '🏛️' },
          { id: 'gs2', nameEn: 'Consensus Resolution', nameTr: 'Ortak Karar Metni', phraseEn: 'Delegates negotiate amendments to finalize a comprehensive climate action treaty.', phraseTr: 'Delegeler kapsamlı bir iklim eylem antlaşmasını tamamlamak için önergeleri müzakere ediyor.', emoji: '📜' },
          { id: 'gs3', nameEn: 'Active Listening Table', nameTr: 'Aktif Dinleme Masası', phraseEn: 'Empathetic leaders listen attentively to opposing viewpoints before replying.', phraseTr: 'Empatik liderler yanıt vermeden önce karşıt görüşleri dikkatle dinler.', emoji: '🤝' },
          { id: 'gs4', nameEn: 'Live Broadcast', nameTr: 'Canlı Küresel Yayın', phraseEn: 'The closing debate is streamed live to millions of students worldwide.', phraseTr: 'Kapanış münazarası dünya çapında milyonlarca öğrenciye canlı yayınlanıyor.', emoji: '📡' }
        ]
      }
    ]
  };

  // 4-Block Sentence Factory Turkish Translation Lookup (Tüm Yaş Grupları)
  const FACTORY_TR_LOOKUP: Record<string, string> = {
    // 5-7
    'My friendly dog': 'Benim sevimli köpeğim',
    'The smart robot': 'Akıllı robot',
    'The little rabbit': 'Küçük tavşan',
    'My best friend': 'Benim en iyi arkadaşım',
    'A brave astronaut': 'Cesur bir astronot',
    'is playing with': 'ile oynuyor',
    'likes to eat': 'yemeyi çok sever',
    'wants to explore': 'keşfetmek istiyor',
    'can see': 'görebiliyor',
    'is dancing with': 'ile dans ediyor',
    'a colorful ball': 'renkli bir top',
    'a sweet apple': 'tatlı bir elma',
    'a big rainbow': 'büyük bir gökkuşağı',
    'the space rocket': 'uzay roketi',
    'a delicious cookie': 'lezzetli bir kurabiye',
    'in the sunny park': 'güneşli parkta',
    'every single morning': 'her sabah',
    'under the big tree': 'büyük ağacın altında',
    'in the cozy room': 'rahat odasında',
    'with a happy smile': 'mutlu bir tebessümle',

    // 8-10
    'Our school soccer team': 'Okul futbol takımımız',
    'The curious student': 'Meraklı öğrenci',
    'My creative art teacher': 'Yaratıcı resim öğretmenim',
    'A talented musician': 'Yetenekli bir müzisyen',
    'The young programmer': 'Genç yazılımcı',
    'is practicing daily with': 'ile her gün pratik yapıyor',
    'won a golden trophy for': 'için altın kupa kazandı',
    'loves to share ideas about': 'hakkında fikir paylaşmayı çok seviyor',
    'is designing a project with': 'ile bir proje tasarlıyor',
    'scored an amazing goal in': 'içinde inanılmaz bir gol attı',
    'the championship match': 'şampiyonluk maçı',
    'a brand new telescope': 'yepyeni bir teleskop',
    'the school science fair': 'okul bilim fuarı',
    'a cheerful song': 'neşeli bir şarkı',
    'the robotics tournament': 'robotik turnuvası',
    'at the community sports center': 'spor merkezinde',
    'during lunch break': 'öğle arasında',
    'with great enthusiasm': 'büyük bir coşkuyla',
    'in front of the whole school': 'bütün okulun önünde',
    'every Saturday afternoon': 'her cumartesi öğleden sonra',

    // 11-13
    'The junior research club': 'Genç araştırma kulübü',
    'Our international pen pal': 'Uluslararası mektup arkadaşımız',
    'The environmental team': 'Çevre koruma ekibi',
    'A brilliant young inventor': 'Dahi bir genç mucit',
    'My debate partner': 'Münazara partnerim',
    'is conducting research on': 'üzerine araştırma yürütüyor',
    'strongly recommends exploring': 'keşfetmeyi güçlü şekilde tavsiye ediyor',
    'is organizing an event about': 'hakkında bir etkinlik düzenliyor',
    'successfully developed a model for': 'için başarıyla bir model geliştirdi',
    'is discussing solutions for': 'için çözümleri tartışıyor',
    'clean renewable energy systems': 'temiz yenilenebilir enerji sistemleri',
    'deep ocean conservation': 'derin okyanus koruma çalışmaları',
    'interactive mobile apps': 'etkileşimli mobil uygulamalar',
    'planetary navigation methods': 'gezegenler arası yön bulma yöntemleri',
    'modern library resources': 'modern kütüphane kaynakları',
    'at the national science conference': 'ulusal bilim konferansında',
    'through digital study platforms': 'dijital çalışma platformları aracılığıyla',
    'with peer mentors': 'akran mentorlarıyla birlikte',
    'across multiple European cities': 'farklı Avrupa şehirlerinde',
    'with inspiring confidence': 'ilham veren bir özgüvenle',

    // 14-17
    'Youth tech leaders': 'Genç teknoloji liderleri',
    'Our high school debate team': 'Lise münazara takımımız',
    'Aspiring software engineers': 'Geleceğin yazılım mühendisleri',
    'Global climate activists': 'Küresel iklim aktivistleri',
    'Innovative content creators': 'Yenilikçi içerik üreticileri',
    'are actively collaborating on': 'üzerinde aktif olarak iş birliği yapıyor',
    'deliver powerful presentations about': 'hakkında güçlü sunumlar gerçekleştiriyor',
    'critically examine arguments regarding': 'ile ilgili argümanları eleştirel biçimde inceliyor',
    'design scalable solutions for': 'için ölçeklenebilir çözümler tasarlıyor',
    'inspire international audiences with': 'ile uluslararası dinleyicilere ilham veriyor',
    'ethical artificial intelligence': 'etik yapay zekâ uygulamaları',
    'next-generation web architecture': 'yeni nesil web mimarileri',
    'global educational equity': 'küresel eğitimde fırsat eşitliği',
    'sustainable urban ecosystems': 'sürdürülebilir şehir ekosistemleri',
    'cross-cultural fluency': 'kültürlerarası akıcı iletişim',
    'at international hackathons': 'uluslararası yazılım maratonlarında',
    'in global summit discussions': 'küresel zirve tartışmalarında',
    'to empower marginalized communities': 'toplulukları güçlendirmek amacıyla',
    'through cutting-edge digital media': 'en ileri dijital medya kanallarıyla',
    'for long-term worldwide impact': 'uzun vadeli küresel etki için',

    // Almanca 5-7
    'Mein freundlicher Hund': 'Benim sevimli köpeğim',
    'Der smarte Roboter': 'Akıllı robot',
    'Der kleine Hase': 'Küçük tavşan',
    'Mein bester Freund': 'Benim en iyi arkadaşım',
    'Ein mutiger Astronaut': 'Cesur bir astronot',
    'spielt gerne mit': 'ile oynamayı çok sever',
    'isst am liebsten': 'en çok yemeyi sever',
    'möchte entdecken': 'keşfetmek istiyor',
    'sieht fröhlich': 'neşeyle görüyor',
    'tanzt lustig mit': 'ile komik dans ediyor',
    'einem bunten Ball': 'renkli bir topla',
    'einem süßen Apfel': 'tatlı bir elmayla',
    'einem großen Regenbogen': 'büyük bir gökkuşağıyla',
    'einer schnellen Rakete': 'hızlı bir roketle',
    'einem leckeren Keks': 'lezzetli bir kurabiyeyle',
    'im sonnigen Park': 'güneşli parkta',
    'jeden schönen Morgen': 'her güzel sabah',
    'unter dem großen Baum': 'büyük ağacın altında',
    'im gemütlichen Zimmer': 'rahat odasında',
    'mit einem breiten Lächeln': 'kocaman bir gülümsemeyle',

    // Almanca 8-10
    'Unser Schul-Fußballteam': 'Okul futbol takımımız',
    'Die neugierige Schülerin': 'Meraklı öğrenci',
    'Mein kreativer Kunstlehrer': 'Yaratıcı resim öğretmenim',
    'Ein talentierter Musiker': 'Yetenekli bir müzisyen',
    'Der junge Programmierer': 'Genç programcı',
    'trainiert täglich für': 'için her gün antrenman yapıyor',
    'gewann eine goldene Trophäe für': 'için altın kupa kazandı',
    'teilt tolle Ideen über': 'hakkında harika fikirler paylaşıyor',
    'entwickelt ein Projekt mit': 'ile proje geliştiriyor',
    'erzielte ein fantastisches Tor in': 'içinde muhteşem bir gol attı',
    'das Meisterschaftsspiel': 'şampiyonluk maçı',
    'ein brandneues Teleskop': 'yepyeni bir teleskop',
    'die Schul-Wissenschaftsmesse': 'okul fen fuarı',
    'ein fröhliches Lied': 'neşeli bir şarkı',
    'das Robotik-Turnier': 'robotik turnuvası',
    'im Sportzentrum der Stadt': 'şehrin spor merkezinde',
    'während der Mittagspause': 'öğle arası boyunca',
    'mit großer Begeisterung': 'büyük bir heyecanla',
    'vor der gesamten Schule': 'tüm okulun önünde',
    'jeden Samstagnachmittag': 'her cumartesi öğleden sonra',

    // Almanca 11-13
    'Der Nachwuchs-Forscherclub': 'Genç araştırmacılar kulübü',
    'Unser internationaler Brieffreund': 'Uluslararası mektup arkadaşımız',
    'Das Umwelt-Team': 'Çevre takımı',
    'Eine geniale junge Erfinderin': 'Dahi genç bir mucit',
    'Mein Debattierpartner': 'Münazara partnerim',
    'forscht intensiv über': 'üzerine yoğun araştırmalar yapıyor',
    'empfiehlt das Entdecken von': 'keşfedilmesini tavsiye ediyor',
    'organisiert ein Event über': 'hakkında bir etkinlik düzenliyor',
    'entwickelte ein Modell für': 'için bir model geliştirdi',
    'diskutiert Lösungen für': 'için çözümleri tartışıyor',
    'saubere erneuerbare Energie': 'temiz yenilenebilir enerji',
    'den Schutz der Ozeane': 'okyanusların korunması',
    'interaktive Lern-Apps': 'interaktif öğrenme uygulamaları',
    'planetare Navigationsmethoden': 'gezegenler arası navigasyon yöntemleri',
    'moderne Bibliotheksressourcen': 'modern kütüphane kaynakları',
    'auf der Wissenschaftskonferenz': 'bilim konferansında',
    'über digitale Lernplattformen': 'dijital öğrenme platformları üzerinden',
    'mit engagierten Mentoren': 'özverili mentorlarla',
    'in verschiedenen europäischen Städten': 'çeşitli Avrupa şehirlerinde',
    'mit inspirierender Zuversicht': 'ilham verici bir özgüvenle',

    // Almanca 14-17
    'Junge Technologie-Pioniere': 'Genç teknoloji öncüleri',
    'Unser Schul-Debattierteam': 'Okul münazara takımımız',
    'Zukünftige Software-Entwickler': 'Geleceğin yazılım geliştiricileri',
    'Globale Klima-Aktivisten': 'Küresel iklim aktivistleri',
    'Innovative Content-Schöpfer': 'Yenilikçi içerik üreticileri',
    'arbeiten aktiv an': 'üzerinde aktif olarak çalışıyor',
    'präsentieren wirkungsvoll über': 'hakkında etkili sunumlar yapıyor',
    'analysieren kritisch Argumente für': 'argümanlarını eleştirel biçimde inceliyor',
    'entwerfen skalierbare Lösungen für': 'için ölçeklenebilir çözümler tasarlıyor',
    'begeistern internationales Publikum mit': 'ile uluslararası dinleyicileri büyülüyor',
    'ethische künstliche Intelligenz': 'etik yapay zeka',
    'zukunftsweisende Web-Architektur': 'gelecek nesil web mimarisi',
    'weltweite Bildungsgerechtigkeit': 'küresel eğitim adaleti',
    'nachhaltige Stadtökosysteme': 'sürdürülebilir kentsel ekosistemler',
    'interkulturelle Sprachgewandtheit': 'kültürlerarası akıcı iletişim',
    'bei internationalen Hackathons': 'uluslararası hackathonlarda',
    'in weltweiten Gipfeltreffen': 'dünya çapındaki zirve toplantılarında',
    'zur Stärkung von Gemeinschaften': 'toplulukları güçlendirmek amacıyla',
    'durch moderne digitale Medien': 'modern dijital medya aracılığıyla',
    'mit langfristiger globaler Wirkung': 'uzun vadeli küresel etkiyle'
  };

  const getFactoryFullTr = () => {
    const s = FACTORY_TR_LOOKUP[factorySubject] || factorySubject;
    const a = FACTORY_TR_LOOKUP[factoryAction] || factoryAction;
    const o = FACTORY_TR_LOOKUP[factoryObject] || factoryObject;
    const c = FACTORY_TR_LOOKUP[factoryContext] || factoryContext;
    return `${s}, ${c} ${o} ${a}`;
  };

  // ==================== YAŞ KADEMESİ DEĞİŞTİRME & SENKRONİZASYON ====================
  const handleSelectAge = (newAge: AgeGroup) => {
    setSelectedAge(newAge);
    setCategoryFilter('Tümü');
    setQuizIndex(0);
    setQuizAnswerState('idle');
    setSelectedOptionId(null);
    setPuzzleIndex(0);
    setSelectedPuzzleWords([]);
    setPuzzleSuccess(false);
    setVoiceIndex(0);
    setVoiceStatus('idle');
    setVoiceScore(null);
    setSimonIndex(0);
    setSelectedStoryItemId(null);
    setChatStepIndex(0);
    setChildAnswerText(null);

    // Cümle Legosu varsayılanlarını yeni yaşa uyarla
    const patternOpts = (targetLang === 'de' ? GERMAN_PATTERN_OPTIONS[newAge] : PATTERN_OPTIONS[newAge]) || (targetLang === 'de' ? GERMAN_PATTERN_OPTIONS['5-7'] : PATTERN_OPTIONS['5-7']);
    setBuilderPrefix(patternOpts.prefixes[0]);
    setBuilderObject(patternOpts.objects[0]);
    setBuilderSuffix(patternOpts.suffixes[0]);

    // Cümle Fabrikası varsayılanlarını yeni yaşa uyarla
    const factoryOpts = (targetLang === 'de' ? GERMAN_FACTORY_OPTIONS[newAge] : FACTORY_OPTIONS[newAge]) || (targetLang === 'de' ? GERMAN_FACTORY_OPTIONS['5-7'] : FACTORY_OPTIONS['5-7']);
    setFactorySubject(factoryOpts.subjects[0]);
    setFactoryAction(factoryOpts.actions[0]);
    setFactoryObject(factoryOpts.objects[0]);
    setFactoryContext(factoryOpts.contexts[0]);

    // Hikaye sahnesi varsayılanını yeni yaşa uyarla
    const scenes = (targetLang === 'de' ? GERMAN_STORYBOOK_SCENES[newAge] : STORYBOOK_SCENES[newAge]) || (targetLang === 'de' ? GERMAN_STORYBOOK_SCENES['5-7'] : STORYBOOK_SCENES['5-7']);
    if (scenes && scenes.length > 0) {
      setActiveStorySceneId(scenes[0].id);
    }
  };

  // ==================== DİL DEĞİŞTİRME (İNGİLİZCE / ALMANCA) ====================
  const handleSwitchLanguage = (lang: SupportedLanguage) => {
    TargetLanguageService.setTargetLanguage(lang);
    setTargetLang(lang);
    setCategoryFilter('Tümü');
    setQuizIndex(0);
    setQuizAnswerState('idle');
    setSelectedOptionId(null);
    setPuzzleIndex(0);
    setSelectedPuzzleWords([]);
    setPuzzleSuccess(false);
    setVoiceIndex(0);
    setVoiceStatus('idle');
    setVoiceScore(null);
    setSimonIndex(0);
    setSelectedStoryItemId(null);
    setChatStepIndex(0);
    setChildAnswerText(null);

    const patternOpts = (lang === 'de' ? GERMAN_PATTERN_OPTIONS[selectedAge] : PATTERN_OPTIONS[selectedAge]) || (lang === 'de' ? GERMAN_PATTERN_OPTIONS['5-7'] : PATTERN_OPTIONS['5-7']);
    setBuilderPrefix(patternOpts.prefixes[0]);
    setBuilderObject(patternOpts.objects[0]);
    setBuilderSuffix(patternOpts.suffixes[0]);

    const factoryOpts = (lang === 'de' ? GERMAN_FACTORY_OPTIONS[selectedAge] : FACTORY_OPTIONS[selectedAge]) || (lang === 'de' ? GERMAN_FACTORY_OPTIONS['5-7'] : FACTORY_OPTIONS['5-7']);
    setFactorySubject(factoryOpts.subjects[0]);
    setFactoryAction(factoryOpts.actions[0]);
    setFactoryObject(factoryOpts.objects[0]);
    setFactoryContext(factoryOpts.contexts[0]);

    const scenes = (lang === 'de' ? GERMAN_STORYBOOK_SCENES[selectedAge] : STORYBOOK_SCENES[selectedAge]) || (lang === 'de' ? GERMAN_STORYBOOK_SCENES['5-7'] : STORYBOOK_SCENES['5-7']);
    if (scenes && scenes.length > 0) {
      setActiveStorySceneId(scenes[0].id);
    }

    setActiveColorId(lang === 'de' ? 'de-c-red' : 'c-red');
    setSelectedAnimalId(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#1a103c] via-[#241442] to-[#120b2e] dark:from-[#0d0722] dark:via-[#160c33] dark:to-[#080417] text-white overflow-y-auto p-2 sm:p-4 pb-28 select-none">
      <div className="max-w-7xl mx-auto w-full space-y-5">

        {/* ==================== 1. LINGORIA TOP NAVIGATION & BRAND BAR ==================== */}
        <header className="rounded-3xl bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Sol: Lingoria by Chirmo Kids Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('games')}>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-[#241442] rounded-[14px] flex items-center justify-center text-2xl">
                  👑
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300 bg-clip-text text-transparent drop-shadow-md">
                  Lingoria
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/30">
                  RPG
                </span>
              </div>
              <div className="text-[11px] font-black text-pink-200/90 tracking-wide flex items-center space-x-1">
                <span>by Chirmo Kids</span>
                <span className="text-amber-300">★</span>
                <span className="text-white/60 font-medium">Fantastik Dil Dünyası</span>
              </div>
            </div>
          </div>

          {/* Orta: Fantastik Navigasyon Butonları - Mobilde Yatay Akıcı Kaydırma */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-black/30 p-1 rounded-2xl border border-white/10 shrink-0 max-w-full">
            {[
              { id: 'home', label: 'Ana Sayfa', icon: '🏠', isHome: true },
              { id: 'games', label: 'Oyunlar', icon: '🎮', tab: 'games' },
              { id: 'stories', label: 'Hikâyeler', icon: '📖', tab: 'stories' },
              { id: 'cards', label: 'Kelime Dünyası', icon: '⭐', tab: 'cards' },
              { id: 'songs', label: 'Şarkılar', icon: '🎵', tab: 'songs' },
              { id: 'stickers', label: 'Başarılar', icon: '🏆', tab: 'stickers' }
            ].map((navItem, idx) => {
              const isActive = navItem.isHome ? activeLevelId === null : activeLevelId === navItem.tab;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (navItem.isHome) {
                      setActiveLevelId(null);
                    } else {
                      setActiveLevelId(navItem.tab as any);
                      setActiveTab(navItem.tab as any);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{navItem.icon}</span>
                  <span className="hidden md:inline">{navItem.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sağ: Oyuncu Profili & Dil & Geri Butonu */}
          <div className="flex items-center space-x-2.5">
            {/* Dil Seçimi (🇬🇧 İngilizce / 🇩🇪 Almanca) */}
            <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/15">
              <button
                type="button"
                onClick={() => handleSwitchLanguage('en')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center space-x-1 cursor-pointer ${
                  targetLang === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">İngilizce</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLanguage('de')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center space-x-1 cursor-pointer ${
                  targetLang === 'de'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🇩🇪</span>
                <span className="hidden sm:inline">Almanca</span>
              </button>
            </div>

            {/* Profil Avatarı & Seviye */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-400/30 px-3 py-1.5 rounded-2xl shadow-inner">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-[#1e113a] flex items-center justify-center text-sm">
                  🧑‍🚀
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] uppercase font-black text-amber-300 leading-none">Maceracı</div>
                <div className="text-xs font-black text-white leading-tight">Seviye {playerLevel}</div>
              </div>
            </div>

            {/* Yıldızlar & XP Göstergeleri */}
            <div className="flex items-center space-x-1.5 bg-amber-400/90 text-slate-950 px-3 py-1.5 rounded-2xl shadow-md font-black text-xs">
              <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
              <span>{stars}</span>
            </div>

            <div className="hidden md:flex items-center space-x-1.5 bg-purple-500/80 text-white px-3 py-1.5 rounded-2xl shadow-md font-black text-xs border border-purple-300/30">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>{lingoriaXp} XP</span>
            </div>

            {onBackToMain && (
              <button
                type="button"
                onClick={onBackToMain}
                className="px-3 py-1.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
                title="Ana Arama & Stüdyoya Dön"
              >
                ← Stüdyo
              </button>
            )}
          </div>
        </header>

        {/* ==================== 2. FANTASTİK ADA DÜNYASI VE KEŞİF HARİTASI (WORLD MAP) ==================== */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500/40 min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-4 sm:p-6 bg-cover bg-center" style={{ backgroundImage: "url('/lingoria-world-map.jpg')" }}>
          {/* Karanlık/Renk Filtresi overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#160c33]/90 via-transparent to-[#100726]/40 pointer-events-none" />

          {/* Harita Üst Barı: Karakter Baloncuğu & Günün Görevi */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Sol: Lingo & Zippy Karakter Rehberi Konuşma Baloncuğu */}
            <div className="flex items-start space-x-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border-2 border-purple-300 dark:border-purple-800 max-w-md animate-fade-in">
              <div className="text-3xl sm:text-4xl shrink-0 animate-bounce">
                🦊
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                    Lingo & Zippy Rehberiniz
                  </span>
                  <span className="text-amber-400">✨</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                  "Merhaba Maceracı! Haydi, Lingoria'da yeni bir görev başlatalım!"
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSpeak(targetLang === 'de' ? 'Hallo kleiner Entdecker! Willkommen in Lingoria!' : 'Hello brave adventurer! Welcome to Lingoria!')}
                    className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold flex items-center space-x-1 hover:bg-purple-200 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Selamı Dinle</span>
                  </button>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {targetLang === 'de' ? '🇩🇪 Almanca Macera' : '🇬🇧 İngilizce Macera'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sağ Üst: Günün Görevi Yüzen Kutusu */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white p-4 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-amber-500/50 max-w-xs w-full space-y-2">
              <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-2">
                <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 text-xs font-black">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Günün Görevi</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  +50 XP ⭐
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="text-3xl shrink-0">🎁</div>
                <div>
                  <div className="text-xs font-black text-slate-800 dark:text-white">
                    {targetLang === 'de' ? 'Ormandaki 5 kayıp kelimeyi bul!' : 'Ormandaki 5 kayıp kelimeyi bul!'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Doğru kartları seç, sesleri dinle ve ödülü kap!
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuestCollectedWords([]);
                  setIsQuestFinished(false);
                  setIsQuestModalOpen(true);
                }}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
              >
                <span>Göreve Başla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Harita Alt Barı: 8 Fantastik Bölge Keşif Butonları */}
          <div className="relative z-10 pt-8 sm:pt-16 pb-2">
            <div className="text-center mb-3">
              <span className="px-4 py-1 rounded-full bg-black/60 text-amber-300 text-xs font-black backdrop-blur-md border border-amber-400/40 shadow-lg">
                🗺️ Keşfetmek İstediğin Lingoria Bölgesini Seç:
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {[
                { level: 1, id: 'forest', name: 'Kelime Ormanı', tab: 'cards', icon: '🍃', desc: 'Kelime Avı' },
                { level: 2, id: 'village', name: 'Konuşma Köyü', tab: 'chat', icon: '💬', desc: 'Diyalog' },
                { level: 3, id: 'castle', name: 'Gramer Kalesi', tab: 'patterns', icon: '🏰', desc: 'Cümle Legosu' },
                { level: 4, id: 'valley', name: 'Hikâye Vadisi', tab: 'stories', icon: '⭐', tabTarget: 'stories', desc: 'Masallar' },
                { level: 5, id: 'animals', name: 'Hayvanlar Adası', tab: 'animals', icon: '🐾', desc: 'Safari' },
                { level: 6, id: 'colors', name: 'Renkler Şehri', tab: 'colors', icon: '🎨', desc: 'Boya & Konuş' },
                { level: 7, id: 'time', name: 'Zaman Kulesi', tab: 'simon', icon: '⏰', desc: 'Saat & Simon' },
                { level: 8, id: 'port', name: 'Macera Limanı', tab: 'games', icon: '⚓', desc: 'Quizz & Arenalar' }
              ].map((region) => {
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => {
                      setActiveLevelId(region.tab as any);
                      setActiveTab(region.tab as any);
                      handleAwardStars(5, `${region.name} Seviyesine Giriş Yaptın!`);
                    }}
                    className="p-2 sm:p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 hover:bg-white text-slate-900 dark:text-white backdrop-blur-md border-2 border-purple-300 dark:border-purple-600 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-center space-y-1 cursor-pointer group"
                  >
                    <span className="text-xl sm:text-2xl group-hover:scale-115 transition-transform">{region.icon}</span>
                    <span className="text-[11px] font-black leading-tight line-clamp-1">{region.name}</span>
                    <span className="text-[9px] font-extrabold text-amber-500 line-clamp-1">
                      Seviye {region.level} ▶
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== 3. GÜNÜN KELİMESİ, POPÜLER OYUNLAR VE İLERLEME VİTRİNİ ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Sol: 👑 Bugünün Kelimesi */}
          <div className="md:col-span-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-4 shadow-xl border-2 border-purple-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-black text-amber-500">
                <span>👑</span>
                <span>Bugünün Kelimesi</span>
              </div>
              <span className="text-[10px] font-extrabold text-pink-500 bg-pink-100 dark:bg-pink-950 px-2 py-0.5 rounded-full">
                {targetLang === 'de' ? 'Almanca' : 'İngilizce'}
              </span>
            </div>

            <div className="flex items-center space-x-3.5 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-4xl shadow-md shrink-0">
                🍎
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <span>{targetLang === 'de' ? 'Der Apfel' : 'Apple'}</span>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  {targetLang === 'de' ? '/ˈapfl̩/' : '/ˈæpəl/'}
                </div>
                <div className="text-xs font-black text-purple-600 dark:text-purple-400">
                  Elma
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSpeak(targetLang === 'de' ? 'Der Apfel ist rot und lecker' : 'The apple is red and sweet')}
              className="w-full py-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Chirmo ile Dinle & Tekrar Et</span>
            </button>
          </div>

          {/* Orta: 🎮 Popüler Oyunlar */}
          <div className="md:col-span-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-4 shadow-xl border-2 border-purple-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-black text-purple-600 dark:text-purple-400">
                <Gamepad2 className="w-4 h-4" />
                <span>Popüler Oyunlar</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('games')}
                className="text-[11px] font-black text-pink-600 hover:text-pink-700 cursor-pointer flex items-center space-x-0.5"
              >
                <span>Tümünü Gör</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { title: 'Kelime Avı', emoji: '🃏', color: 'from-amber-400 to-orange-500', tab: 'games', sub: 'memory' },
                { title: 'Kayıp Kelimeler', emoji: '🧩', color: 'from-blue-400 to-indigo-500', tab: 'games', sub: 'detective' },
                { title: 'Karakterlerle Konuş', emoji: '🐱', color: 'from-pink-400 to-rose-500', tab: 'chat', sub: 'chat' },
                { title: 'Büyülü Cümleler', emoji: '📖', color: 'from-purple-400 to-indigo-600', tab: 'patterns', sub: 'patterns' }
              ].map((game, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-between text-center space-y-1.5 hover:border-purple-400 transition-all shadow-xs"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center text-xl shadow-xs`}>
                    {game.emoji}
                  </div>
                  <div className="text-[11px] font-black text-slate-800 dark:text-white line-clamp-1">
                    {game.title}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLevelId(game.tab as any);
                      setActiveTab(game.tab as any);
                      if (game.tab === 'games') {
                        setSubGameTab(game.sub as any);
                      }
                    }}
                    className="w-full py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-black text-[10px] cursor-pointer transition-transform active:scale-95"
                  >
                    Oyna ▶
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: 📊 İlerlemen & Seviye */}
          <div className="md:col-span-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-4 shadow-xl border-2 border-purple-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400">
                <Trophy className="w-4 h-4" />
                <span>İlerlemen</span>
              </div>
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                S{playerLevel}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-600 dark:text-slate-400">XP Barı:</span>
                <span className="text-purple-600 font-extrabold">{currentLevelXp} / 500 XP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, (currentLevelXp / 500) * 100))}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{completedQuests} / 8 Görev Tamamlandı</span>
            </div>

            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 text-purple-900 dark:text-pink-200 text-center font-black text-xs flex items-center justify-center space-x-1">
              <span>👑</span>
              <span>Harika gidiyorsun!</span>
              <span>✨</span>
            </div>
          </div>
        </div>

        {/* Tebrik Mesajı Bildirimi (Canlı Pop-up) */}
        {lastAwardMessage && (
          <div className="py-2 px-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-purple-900 dark:text-purple-200 font-black text-xs shadow-xl border-2 border-purple-400 animate-bounce flex items-center justify-between">
            <span>{lastAwardMessage}</span>
            <span className="text-[10px] opacity-75">Tebrikler Maceracı Şampiyon!</span>
          </div>
        )}

        {/* ==================== GÜNÜN GÖREVİ İNTERAKTİF MODAL ==================== */}
        {isQuestModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-amber-400 space-y-4 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-3xl">🌲</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-purple-700 dark:text-purple-300">
                      Ormandaki 5 Kayıp Kelimeyi Bul!
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kelimelere tıkla, sesini dinle ve Lingoria ormanını aydınlat!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuestModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              {/* 5 Kelime Kartı */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'qw1', en: 'Apple', de: 'Der Apfel', tr: 'Elma', emoji: '🍎' },
                  { id: 'qw2', en: 'Tree', de: 'Der Baum', tr: 'Ağaç', emoji: '🌳' },
                  { id: 'qw3', en: 'Bird', de: 'Der Vogel', tr: 'Kuş', emoji: '🐦' },
                  { id: 'qw4', en: 'Flower', de: 'Die Blume', tr: 'Çiçek', emoji: '🌸' },
                  { id: 'qw5', en: 'Butterfly', de: 'Der Schmetterling', tr: 'Kelebek', emoji: '🦋' }
                ].map((item) => {
                  const isCollected = questCollectedWords.includes(item.id);
                  const wordText = targetLang === 'de' ? item.de : item.en;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleSpeak(wordText);
                        if (!isCollected) {
                          const updated = [...questCollectedWords, item.id];
                          setQuestCollectedWords(updated);
                          if (updated.length === 5) {
                            setIsQuestFinished(true);
                            handleAwardStars(20, 'Günün Görevi Tamamlandı! Ormanın 5 Kayıp Kelimesi Bulundu!');
                            setLingoriaXp((prev) => prev + 50);
                            setCompletedQuests((prev) => Math.min(8, prev + 1));
                            handleSpeak(targetLang === 'de' ? 'Fantastisch! Du hast alle Wörter gefunden!' : 'Awesome! You found all five words!');
                          }
                        }
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer ${
                        isCollected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 scale-102 ring-2 ring-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:scale-105'
                      }`}
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-xs font-black">{wordText}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{item.tr}</span>
                      {isCollected && (
                        <span className="text-[10px] text-emerald-600 font-black">✓ Bulundu</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {isQuestFinished ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-1.5 animate-bounce">
                  <div className="text-lg font-black">🎉 Görevi Başarıyla Tamamladın! 🎉</div>
                  <div className="text-xs font-bold">
                    Tebrikler! +50 XP & +20 Yıldız kazandın. Orman aydınlandı!
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuestModalOpen(false)}
                    className="mt-2 px-5 py-1.5 rounded-xl bg-white text-emerald-800 font-black text-xs cursor-pointer shadow-md"
                  >
                    Tamamdır! 🚀
                  </button>
                </div>
              ) : (
                <div className="text-center text-xs text-slate-500 font-bold">
                  Toplanan Kelimeler: {questCollectedWords.length} / 5
                </div>
              )}
            </div>
          </div>
        )}

        
        
        {/* ==================== BÜYÜLÜ TEÇHİZAT SANDIĞI İNTERAKTİF MODAL ==================== */}
        {isGearChestOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
            <div className="max-w-3xl w-full bg-[#1e133d] border-2 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-5 my-auto max-h-[90vh] overflow-y-auto">
              {/* Modal Başlık */}
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl shadow-lg shrink-0">
                    🎁
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-amber-300 flex items-center space-x-2">
                      <span>Maceracının Büyülü Teçhizat Sandığı</span>
                      <span className="text-[10px] bg-purple-500/40 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full font-extrabold">
                        5 Temel Kalıp
                      </span>
                    </h3>
                    <p className="text-xs text-pink-200/80">
                      Bir insan dilde hangi kalıpları kullanır? Teçhizatlarını incele, örnekleri dinle ve oyunda ustalaş!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGearChestOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer font-black text-sm"
                >
                  ✕
                </button>
              </div>

              {/* 5 Teçhizat Sekmesi */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'sentence', icon: '🗡️', name: 'Cümle Kılıcı', sub: 'Nasıl Cümle Kurulur?' },
                  { id: 'question', icon: '❓', name: 'Soru Asası', sub: 'Nasıl Soru Sorulur?' },
                  { id: 'request', icon: '🛡️', name: 'İstek Kalkanı', sub: 'İstek & Rica Kalıbı' },
                  { id: 'emotion', icon: '🧪', name: 'Duygu İksiri', sub: 'Duygu & Fikir Belirtme' },
                  { id: 'connector', icon: '🧭', name: 'Zaman Pusulası', sub: 'Bağlaçlar & Cümle Köprüsü' }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGearTab(g.id as any)}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      activeGearTab === g.id
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-300 text-slate-950 font-black border-amber-300 shadow-lg scale-102'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <span className="text-xs font-black line-clamp-1">{g.name}</span>
                    <span className="text-[9px] opacity-80 line-clamp-1">{g.sub}</span>
                  </button>
                ))}
              </div>

              {/* Seçili Teçhizatın Detay Kartı */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-purple-400/30 space-y-4">
                {activeGearTab === 'sentence' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center space-x-2 text-amber-300 font-black text-sm sm:text-base">
                      <span>🗡️ Cümle Kılıcı: Cümle Nasıl Kurulur? (Mental Lego)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      💡 <strong>Sihirli Mantık:</strong> Yabancı dilde cümleler lego parçaları gibidir. Cümlenin omurgası her zaman: <span className="text-amber-300 font-bold">ÖZNE (Kim?) + EYLEM (Ne Yapıyor?) + NESNE (Neyi?)</span> sırasıyla kurulur.
                    </p>

                    <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-1">
                      <div className="text-[10px] uppercase font-black text-purple-300">Evrensel Cümle Formülü</div>
                      <div className="text-sm font-black text-white">
                        [Özne / Kim?] + [Fiil / Eylem] + [Nesne / Neyi?]
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-black text-amber-300 uppercase">Canlı Örnekler & Telaffuz:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Ich spiele Fußball.' : 'I play football.'}</div>
                            <div className="text-[11px] text-pink-200">Ben futbol oynarım.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Ich spiele Fußball.' : 'I play football.')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Wir trinken frisches Wasser.' : 'We drink fresh water.'}</div>
                            <div className="text-[11px] text-pink-200">Biz taze su içeriz.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Wir trinken frisches Wasser.' : 'We drink fresh water.')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeGearTab === 'question' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center space-x-2 text-amber-300 font-black text-sm sm:text-base">
                      <span>❓ Soru Asası: Soru Nasıl Sorulur?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      💡 <strong>Sihirli Mantık:</strong> Soru sormak bir asa sallamak gibidir! Yardımcı kelimeyi (<span className="text-amber-300 font-bold">Do / Can / Is / Wo / Magst du</span>) cümlenin en başına taşırsın.
                    </p>

                    <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-1">
                      <div className="text-[10px] uppercase font-black text-purple-300">Evrensel Soru Formülü</div>
                      <div className="text-sm font-black text-white">
                        [Yardımcı Soru Kelimesi] + [Özne] + [Fiil / Nesne] ?
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-black text-amber-300 uppercase">Canlı Soru Kalıpları:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Magst du Äpfel?' : 'Do you like apples?'}</div>
                            <div className="text-[11px] text-pink-200">Elma sever misin?</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Magst du Äpfel?' : 'Do you like apples?')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Kannst du mir helfen?' : 'Can you help me?'}</div>
                            <div className="text-[11px] text-pink-200">Bana yardım edebilir misin?</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Kannst du mir helfen?' : 'Can you help me?')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeGearTab === 'request' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center space-x-2 text-amber-300 font-black text-sm sm:text-base">
                      <span>🛡️ İstek & Nezaket Kalkanı: İstek ve Rica Nasıl Yapılır?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      💡 <strong>Sihirli Mantık:</strong> Bir şey isterken emir verilmez; nezaket zırhı kuşanılır! Her zaman <span className="text-amber-300 font-bold">"Can I have..."</span> (Alabilir miyim?) veya <span className="text-amber-300 font-bold">"I would like... please"</span> (İsterim lütfen) kalıpları kullanılır.
                    </p>

                    <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-1">
                      <div className="text-[10px] uppercase font-black text-purple-300">Nezaket ve İstek Formülü</div>
                      <div className="text-sm font-black text-white">
                        Can I have + [nesne] + please? / I want + [nesne] + please
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-black text-amber-300 uppercase">Canlı İstek Kalıpları:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Kann ich bitte Wasser haben?' : 'Can I have some water, please?'}</div>
                            <div className="text-[11px] text-pink-200">Biraz su alabilir miyim lütfen?</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Kann ich bitte Wasser haben?' : 'Can I have some water, please?')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Ich möchte spielen, bitte.' : 'I want to play, please.'}</div>
                            <div className="text-[11px] text-pink-200">Oynamak istiyorum lütfen.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Ich möchte spielen, bitte.' : 'I want to play, please.')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeGearTab === 'emotion' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center space-x-2 text-amber-300 font-black text-sm sm:text-base">
                      <span>🧪 Duygu & Fikir İksiri: Duygu ve Fikir Nasıl Belirtilir?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      💡 <strong>Sihirli Mantık:</strong> Sevdiğin şeyleri ve hissettiklerini anlatmak yeni arkadaşlar edinmeni sağlar! Kalıp: <span className="text-amber-300 font-bold">"I like / I love / I feel..."</span>
                    </p>

                    <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-1">
                      <div className="text-[10px] uppercase font-black text-purple-300">Duygu & Fikir Formülü</div>
                      <div className="text-sm font-black text-white">
                        I feel + [Duygu] / I love + [Nesne]
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-black text-amber-300 uppercase">Canlı Duygu Kalıpları:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Ich liebe dieses Spiel!' : 'I love this game!'}</div>
                            <div className="text-[11px] text-pink-200">Bu oyunu çok seviyorum!</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Ich liebe dieses Spiel!' : 'I love this game!')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Ich bin heute sehr glücklich.' : 'I feel very happy today.'}</div>
                            <div className="text-[11px] text-pink-200">Bugün kendimi çok mutlu hissediyorum.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Ich bin heute sehr glücklich.' : 'I feel very happy today.')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeGearTab === 'connector' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center space-x-2 text-amber-300 font-black text-sm sm:text-base">
                      <span>🧭 Zaman & Bağlaç Pusulası: Cümleler Nasıl Bağlanır?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      💡 <strong>Sihirli Mantık:</strong> Cümleleri birbirine bağlayan köprüler dili akıcı yapar: <span className="text-amber-300 font-bold">and (ve), but (ama), because (çünkü), today (bugün)</span>.
                    </p>

                    <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-1">
                      <div className="text-[10px] uppercase font-black text-purple-300">Köprü Bağlaç Formülü</div>
                      <div className="text-sm font-black text-white">
                        [Cümle 1] + [and / but / because] + [Cümle 2]
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-black text-amber-300 uppercase">Canlı Bağlaç Kalıpları:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Ich mag Bücher, weil sie spannend sind.' : 'I like books because they are fun.'}</div>
                            <div className="text-[11px] text-pink-200">Kitapları seviyorum çünkü eğlenceliler.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Ich mag Bücher, weil sie spannend sind.' : 'I like books because they are fun.')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{targetLang === 'de' ? 'Ich bin müde, aber glücklich.' : 'I am tired, but I am happy.'}</div>
                            <div className="text-[11px] text-pink-200">Yorgunum ama mutluyum.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(targetLang === 'de' ? 'Ich bin müde, aber glücklich.' : 'I am tired, but I am happy.')}
                            className="p-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-amber-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Teçhizatı Kuşan ve Ödülü Al Butonu */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-purple-500/30">
                <div className="text-xs text-amber-300 font-bold flex items-center space-x-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Teçhizatları İnceleme Ödülü: +50 XP & +20 Yıldız ⭐</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsGearChestOpen(false);
                    handleAwardStars(20, 'Teçhizat Sandığını Açtın ve 5 Temel Kalıbı Kuşandın!');
                    setLingoriaXp((prev) => prev + 50);
                    handleSpeak(targetLang === 'de' ? 'Ausgezeichnet! Du bist bereit für das Abenteuer!' : 'Awesome! You are now fully equipped for Lingoria!');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span>⚔️ Teçhizatlarımı Kuşandım, Seviyelere Başla!</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. HARİTA VEYA LEVEL OYNAMA ALANI KONSOLU ==================== */}
        {activeLevelId === null ? (
          <>
            
        
        {/* ==================== MACERACININ BÜYÜLÜ TEÇHİZAT SANDIĞI (LİNGUİSTİC GEAR CHEST) ==================== */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-pink-500/20 border-2 border-amber-400/60 p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0 animate-pulse border-2 border-white/50">
              🎁
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                  Ön Hazırlık & Teçhizat
                </span>
                <span className="text-xs font-bold text-amber-300">5 Efsanevi Konuşma Kalıbı</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Maceracının Büyülü Teçhizat Sandığı ⚔️
              </h3>
              <p className="text-xs text-pink-100 max-w-xl">
                Bölümlere başlamadan önce teçhizatlarını kuşan: Cümle nasıl kurulur? Soru nasıl sorulur? İstek ve ricada hangi kalıplar kullanılır?
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setIsGearChestOpen(true);
                handleSpeak(targetLang === 'de' ? 'Öffne deine Zauberkiste und lerne die Sprachmuster!' : 'Open your magic gear chest and master the speaking patterns!');
              }}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span>Sandığı Aç & Kalıpları Öğren</span>
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
            </button>
          </div>
        </div>

        {/* ==================== LINGORIA 8 OYUN SEVİYESİ / LEVEL SEÇİM YOLU ==================== */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
            <h2 className="text-base sm:text-lg font-black text-amber-300 flex items-center space-x-2">
              <span>🗺️ Lingoria Görev ve Seviye Yolu (8 Bölüm)</span>
              <span className="text-[10px] bg-purple-500/40 text-purple-200 border border-purple-400/30 px-2.5 py-0.5 rounded-full font-extrabold">
                Level 1 - 8
              </span>
            </h2>
            <p className="text-xs text-pink-200/80 font-medium">
              Herhangi bir bölüme tıkla, doğrudan o seviyenin oyun alanına gir!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { level: 1, tab: 'cards', name: 'Kelime Ormanı', icon: '🍃', desc: 'Görsel Kelime Kartları & Kelime Avı', stars: '⭐⭐⭐', color: 'from-emerald-500 to-green-600' },
              { level: 2, tab: 'chat', name: 'Konuşma Köyü', icon: '💬', desc: 'Çizgi Karakter Sohbeti & Canlı Diyalog', stars: '⭐⭐⭐', color: 'from-blue-500 to-indigo-600' },
              { level: 3, tab: 'patterns', name: 'Gramer Kalesi', icon: '🏰', desc: 'Büyülü Cümle Legosu & Fabrikası', stars: '⭐⭐⭐', color: 'from-purple-500 to-indigo-600' },
              { level: 4, tab: 'stories', name: 'Hikâye Vadisi', icon: '⭐', desc: 'Sihirli Konuşan Masal Kitapları', stars: '⭐⭐⭐', color: 'from-amber-500 to-orange-600' },
              { level: 5, tab: 'animals', name: 'Hayvanlar Adası', icon: '🐾', desc: 'Safari Hayvanları ve Sesleri', stars: '⭐⭐⭐', color: 'from-teal-500 to-emerald-600' },
              { level: 6, tab: 'colors', name: 'Renkler Şehri', icon: '🎨', desc: 'Sihirli Boya, Şekiller & Konuş', stars: '⭐⭐⭐', color: 'from-pink-500 to-rose-600' },
              { level: 7, tab: 'simon', name: 'Zaman Kulesi', icon: '⏰', desc: 'Chirmo Diyor ki! (TPR Simon Says)', stars: '⭐⭐⭐', color: 'from-violet-500 to-purple-600' },
              { level: 8, tab: 'games', name: 'Macera Limanı', icon: '⚓', desc: 'Hafıza Kartları, Dedektif & Arenalar', stars: '⭐⭐⭐', color: 'from-sky-500 to-blue-600' }
            ].map((lvl) => (
              <div
                key={lvl.level}
                className="rounded-3xl p-4 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-2 border-purple-300 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-3 hover:border-amber-400 transition-all hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center text-xl shadow-md">
                    {lvl.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-amber-500">Seviye {lvl.level}</span>
                    <span className="text-[10px] text-amber-400 font-bold">{lvl.stars}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{lvl.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">{lvl.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLevelId(lvl.tab);
                    setActiveTab(lvl.tab as any);
                    handleAwardStars(5, `${lvl.name} Bölümüne Giriş Yaptın!`);
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
                >
                  <span>Bölüme Başla</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>

            {/* ==================== 2. YAŞ GRUBU KADEMELERİ (4 ÇOCUK DÜNYASI) ==================== */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-3xl border-2 border-pink-100 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-black text-slate-500 uppercase px-3 py-1 flex items-center justify-between">
            <span>🎯 Çocuğunuzun Yaş Kademesini Seçin:</span>
            <span className="text-pink-600 font-bold">Uluslararası CEFR Standartları (Pre-A1 / B1) ile Uyumlu</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
            {[
              {
                id: '5-7' as AgeGroup,
                title: '5 - 7 Yaş',
                sub: 'Okul Öncesi & 1. Sınıf',
                emoji: '🧸',
                tag: 'Sıfır Gramer, Bol Ses'
              },
              {
                id: '8-10' as AgeGroup,
                title: '8 - 10 Yaş',
                sub: 'İlkokul Kademesi',
                emoji: '🎨',
                tag: 'Kalıp Birleştirme & Nezaket'
              },
              {
                id: '11-13' as AgeGroup,
                title: '11 - 13 Yaş',
                sub: 'Ortaokul / LGS Temeli',
                emoji: '📚',
                tag: 'Soru Sorma & Özgüven'
              },
              {
                id: '14-17' as AgeGroup,
                title: '14 - 17 Yaş',
                sub: 'Gençler & Lise',
                emoji: '🎧',
                tag: 'Trendler, Gaming & Akıcılık'
              }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectAge(item.id)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 relative overflow-hidden ${
                  selectedAge === item.id
                    ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white font-black shadow-lg scale-102 ring-2 ring-pink-400'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-pink-50/60 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    selectedAge === item.id ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-slate-700 text-pink-700 dark:text-pink-300'
                  }`}>
                    {item.title}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black truncate">{item.sub}</div>
                  <div className={`text-[10px] truncate ${selectedAge === item.id ? 'text-pink-100' : 'text-slate-500'}`}>
                    {item.tag}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== GÜNÜN SESLİ KONUŞMA MEYDAN OKUMASI (DAILY SPEAKING CHALLENGE) ==================== */}
        {(() => {
          const dailyChallenge = (targetLang === 'de' ? GERMAN_AGE_SPEAKING_CHALLENGES[selectedAge] : AGE_SPEAKING_CHALLENGES[selectedAge]) || (targetLang === 'de' ? GERMAN_AGE_SPEAKING_CHALLENGES['5-7'] : AGE_SPEAKING_CHALLENGES['5-7']);
          return (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 text-white shadow-xl border border-white/20 relative overflow-hidden space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    🎙️
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                      Günün Sesli Konuşma Meydan Okuması • {dailyChallenge.level}
                    </div>
                    <div className="text-sm sm:text-base font-black text-white">
                      {dailyChallenge.title} ({dailyChallenge.topic})
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold text-pink-100 self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{targetLang === 'de' ? 'Almanca Konuşma Odaklı Özel İçerik' : 'İngilizce Konuşma Odaklı Özel İçerik'}</span>
                </div>
              </div>

              <div className="bg-black/25 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md border border-white/15 space-y-1.5">
                <div className="text-base sm:text-xl font-black text-white tracking-wide">
                  "{dailyChallenge.en}"
                </div>
                <div className="text-xs sm:text-sm font-semibold text-pink-200">
                  Türkçesi: {dailyChallenge.tr}
                </div>
                <div className="text-[11px] text-amber-200/90 italic pt-1">
                  💡 Telaffuz İpucu: {dailyChallenge.tips}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleSpeak(dailyChallenge.en)}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-amber-100 font-black text-xs transition-all shadow-md flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>Chirmo ile Dinle 🔊</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSpeak(dailyChallenge.en);
                    handleAwardStars(15, `${selectedAge} Yaş Konuşma Görevini Seslendirdin!`);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Mic className="w-4 h-4 text-slate-950" />
                  <span>Ben de Söyledim! (+15 Yıldız ⭐)</span>
                </button>
              </div>
            </div>
          );
        })()}

        
          </>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Level Arena Üst Barı - Mobilde Kompakt & Düzenli */}
            <div className="rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-3 sm:p-4 shadow-xl border-2 border-amber-400 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLevelId(null)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-md hover:scale-105 cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <span>← 🏠 Haritaya Dön</span>
                </button>

                {/* Mobilde Hızlı Seviye Atlama */}
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['cards', 'chat', 'patterns', 'stories', 'animals', 'colors', 'simon', 'games'];
                    const currIdx = tabs.indexOf(activeLevelId);
                    const nextIdx = (currIdx + 1) % tabs.length;
                    setActiveLevelId(tabs[nextIdx]);
                    setActiveTab(tabs[nextIdx] as any);
                  }}
                  className="sm:hidden px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs cursor-pointer transition-all shrink-0"
                >
                  Sonraki ➔
                </button>
              </div>

              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-xl sm:text-2xl shrink-0">
                  {activeLevelId === 'cards' && '🍃'}
                  {activeLevelId === 'chat' && '💬'}
                  {activeLevelId === 'patterns' && '🏰'}
                  {activeLevelId === 'stories' && '⭐'}
                  {activeLevelId === 'animals' && '🐾'}
                  {activeLevelId === 'colors' && '🎨'}
                  {activeLevelId === 'simon' && '⏰'}
                  {activeLevelId === 'games' && '⚓'}
                  {activeLevelId === 'songs' && '🎵'}
                  {activeLevelId === 'stickers' && '🏆'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-black uppercase text-amber-500">Aktif Oyun Seviyesi</div>
                  <div className="text-xs sm:text-base font-black text-slate-900 dark:text-white truncate">
                    {activeLevelId === 'cards' && 'Seviye 1: Kelime Ormanı (Kelime Avı)'}
                    {activeLevelId === 'chat' && 'Seviye 2: Konuşma Köyü (Diyalog & Chat)'}
                    {activeLevelId === 'patterns' && 'Seviye 3: Gramer Kalesi (Cümle Legosu & Fabrikası)'}
                    {activeLevelId === 'stories' && 'Seviye 4: Hikâye Vadisi (Sihirli Hikayeler)'}
                    {activeLevelId === 'animals' && 'Seviye 5: Hayvanlar Adası (Safari Sesleri)'}
                    {activeLevelId === 'colors' && 'Seviye 6: Renkler Şehri (Sihirli Boya)'}
                    {activeLevelId === 'simon' && 'Seviye 7: Zaman Kulesi (Chirmo Diyor ki!)'}
                    {activeLevelId === 'games' && 'Seviye 8: Macera Limanı (Oyun Arenası)'}
                    {activeLevelId === 'songs' && 'Bonus: Müzik Adası (Şarkılar & Karaoke)'}
                    {activeLevelId === 'stickers' && 'Başarılar: Çıkartma Albümü'}
                  </div>
                </div>
              </div>

              {/* Masaüstünde Hızlı Seviye Atlama */}
              <div className="hidden sm:flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['cards', 'chat', 'patterns', 'stories', 'animals', 'colors', 'simon', 'games'];
                    const currIdx = tabs.indexOf(activeLevelId);
                    const nextIdx = (currIdx + 1) % tabs.length;
                    setActiveLevelId(tabs[nextIdx]);
                    setActiveTab(tabs[nextIdx] as any);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs cursor-pointer transition-all"
                >
                  Sonraki Seviye ➔
                </button>
              </div>
            </div>

            {/* ==================== 3. AKTİVİTE VE ÖĞRENME SEKMELERİ (MOBİLDE KAYDIRILABİLİR YATAY ÇUBUK) ==================== */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 sm:flex-wrap border-b-2 border-pink-200/60 dark:border-slate-800 pb-2.5">
              {[
                { id: 'games', label: '🎮 Oyunlar & Quizz', icon: Gamepad2, color: 'text-amber-500' },
                { id: 'cards', label: '🃏 Görsel Kelimeler (30+)', icon: Smile, color: 'text-pink-500' },
                { id: 'simon', label: '🏃‍♂️ Chirmo Diyor ki! (TPR)', icon: Zap, color: 'text-amber-500' },
                { id: 'stories', label: '📖 Sihirli Konuşan Hikayeler', icon: BookOpen, color: 'text-purple-500' },
                { id: 'patterns', label: '🧩 Cümle Legosu & Fabrikası', icon: Puzzle, color: 'text-purple-500' },
                { id: 'animals', label: '🦁 Konuşan Hayvanlar', icon: Sparkles, color: 'text-emerald-500' },
                { id: 'colors', label: '🎨 Sihirli Boya & Konuş', icon: Zap, color: 'text-rose-500' },
                { id: 'chat', label: '💬 Çizgi Karakter Sohbeti', icon: MessageCircle, color: 'text-blue-500' },
                { id: 'stickers', label: '⭐ Çıkartma Albümü', icon: Award, color: 'text-amber-500' },
                { id: 'songs', label: '🎵 Şarkılar & Karaoke', icon: Music, color: 'text-rose-500' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center space-x-1.5 sm:space-x-2 shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md scale-102 ring-1 ring-white/30'
                        : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : tab.color}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

        {/* ==================== TAB 1: 🎮 OYUNLAR VE İNTERAKTİF TESTLER ==================== */}
        {activeTab === 'games' && (
          <div className="space-y-4">
            {/* Tekil Oyun Seçici Sekmeler (Oyun konsolu gibi tek ekran) */}
            <div className="flex items-center flex-wrap gap-2 p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-black text-slate-400 pl-2">🎮 Oyun Arenası:</span>
              {[
                { id: 'memory', label: '🃏 Hafıza Kartları' },
                { id: 'detective', label: '🔍 Dedektif Chirmo' },
                { id: 'puzzle', label: '🧩 Cümle Yapbozu' },
                { id: 'voice', label: '🎤 Süper Telaffuz Arenası' }
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSubGameTab(g.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    subGameTab === g.id
                      ? 'bg-purple-600 text-white shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* OYUN 1: 🃏 HAFIZA KARTLARI (MEMORY FLIP MATCH) */}
            {subGameTab === 'memory' && (
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xl shadow-xs">
                    🃏
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>Hafıza Kartları: Çiftleri Bul ve Konuş!</span>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full font-black">
                        +25 Yıldız ⭐
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Kartları aç, eşini bul ve Chirmo ile sesli tekrar et! Hamle: <span className="font-bold text-indigo-600">{memoryMoves}</span> • Bulunan: <span className="font-bold text-emerald-600">{memoryCards.filter(c => c.isMatched).length / 2} / 6</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={initMemoryGame}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center space-x-1 cursor-pointer self-start sm:self-auto transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yeniden Başlat</span>
                </button>
              </div>

              {/* Kazandın Kutlaması */}
              {isMemoryWon && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-2 shadow-lg animate-bounce">
                  <div className="text-2xl font-black">🎉 Harika İş Çıkardın! 🎉</div>
                  <div className="text-xs font-bold">
                    Tüm {targetLang === 'de' ? 'Almanca' : 'İngilizce'} kart çiftlerini buldun ve telaffuz ettin! +25 Yıldız kazandın.
                  </div>
                  <button
                    type="button"
                    onClick={initMemoryGame}
                    className="px-4 py-1.5 rounded-xl bg-white text-emerald-800 font-black text-xs shadow-md hover:scale-105 cursor-pointer transition-all"
                  >
                    Yeni Tur Başlat 🔄
                  </button>
                </div>
              )}

              {/* Kart Izgarası (12 Kart = 6 Çift) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
                {memoryCards.map((card) => {
                  const isRevealed = card.isFlipped || card.isMatched;
                  return (
                    <button
                      key={card.uid}
                      type="button"
                      onClick={() => handleCardClick(card)}
                      disabled={card.isMatched}
                      className={`relative min-h-[105px] sm:min-h-[120px] rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer text-center select-none ${
                        card.isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-emerald-800 dark:text-emerald-200 scale-95 opacity-90'
                          : isRevealed
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-indigo-950/60 border-2 border-indigo-400 shadow-md scale-102 ring-2 ring-indigo-300'
                          : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white border-2 border-indigo-300/40 shadow-sm hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isRevealed ? (
                        <div className="flex flex-col items-center justify-center space-y-1 animate-fade-in w-full">
                          <span className="text-3xl sm:text-4xl filter drop-shadow-xs">{card.emoji}</span>
                          <span className="text-xs sm:text-sm font-black leading-tight text-slate-900 dark:text-white line-clamp-1">
                            {card.word}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">
                            {card.tr}
                          </span>
                          <Volume2 className="w-3 h-3 text-indigo-500 mt-0.5" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-2xl sm:text-3xl opacity-80 group-hover:scale-110 transition-transform">🎈</span>
                          <span className="text-[11px] font-black uppercase tracking-wider text-white/90">Chirmo</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            )}

            {/* OYUN 2: DUY VE RESMİ BUL (LISTENING DETECTIVE) */}
            {subGameTab === 'detective' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-xl">
                    🔍
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>Dedektif Chirmo: Sesi Duy ve Doğru Resmi Seç!</span>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-black">
                        +10 Yıldız ⭐
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Kulaklarınızı açın! Chirmo'nun telaffuz ettiği kelimeyi doğru resimle eşleştirin.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeak(activeQuiz.questionAudio)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95 self-start sm:self-auto"
                >
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span>🔊 Sesi Tekrar Dinle</span>
                </button>
              </div>

              <div className="text-center py-2">
                <span className="text-sm sm:text-base font-bold text-purple-700 dark:text-purple-300">
                  {activeQuiz.promptTr}
                </span>
              </div>

              {/* 4 Seçenekli Resim Izgarası */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeQuiz.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectQuizOption(opt.id, opt.isCorrect)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 text-center group hover:scale-105 ${
                        isSelected && quizAnswerState === 'correct'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-4 ring-emerald-300'
                          : isSelected && quizAnswerState === 'wrong'
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300 animate-shake'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl group-hover:scale-115 transition-transform">
                        {opt.emoji}
                      </span>
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {quizAnswerState === 'correct' && (
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-black text-center animate-fade-in flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{activeQuiz.praise}</span>
                </div>
              )}
            </div>

            )}

            {/* OYUN 2: CÜMLE YAPBOZU (SENTENCE PUZZLE LEGO) */}
            {subGameTab === 'puzzle' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-xl">
                    🧩
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>Cümle Yapbozu: Kelimeleri Sıraya Diz!</span>
                      <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full font-black">
                        +15 Yıldız ⭐
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Kelimeleri ezberleme! Parçaları tıklayarak cümlenin mantığını adım adım inşa et.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetPuzzle}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              </div>

              {/* Hedef Türkçe Anlam ve İpucu */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">Hedef Cümle (Türkçe)</div>
                  <div className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>{activePuzzle.emoji}</span>
                    <span>"{activePuzzle.targetTr}"</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 hidden sm:block italic">
                  💡 İpucu: {activePuzzle.hint}
                </div>
              </div>

              {/* Çocuğun Oluşturduğu Cümle Çizgisi */}
              <div className="min-h-14 p-3 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/30 flex items-center justify-center flex-wrap gap-2">
                {selectedPuzzleWords.length === 0 ? (
                  <span className="text-xs text-slate-400 font-bold">
                    Aşağıdaki kelimelere sırayla tıklayarak cümleni oluştur...
                  </span>
                ) : (
                  selectedPuzzleWords.map((word, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTogglePuzzleWord(word)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-black text-xs shadow-sm flex items-center space-x-1 cursor-pointer hover:bg-purple-700 active:scale-95"
                    >
                      <span>{word}</span>
                      <span className="text-[10px] opacity-75">✕</span>
                    </button>
                  ))
                )}
              </div>

              {/* Kullanılabilir Kelime Havuzu */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
                {activePuzzle.words.map((word, idx) => {
                  const isUsed = selectedPuzzleWords.includes(word);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handleTogglePuzzleWord(word)}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer ${
                        isUsed
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50 cursor-not-allowed scale-95'
                          : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-slate-700 hover:border-purple-500 hover:scale-105'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {puzzleSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-black text-center animate-bounce flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Harika! Cümleyi kusursuz tamamladın: "{activePuzzle.targetEn}"</span>
                </div>
              )}
            </div>

            )}

            {/* OYUN 3: SÜPER TELAFFUZ ARENASI (VOICE COACH) */}
            {subGameTab === 'voice' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center text-xl">
                    🎤
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>Süper Telaffuz Arenası: Chirmo ile Birlikte Söyle!</span>
                      <span className="text-[10px] bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-0.5 rounded-full font-black">
                        +20 Yıldız ⭐
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Mikrofona konuşmaktan çekinme! Chirmo asla kınamaz, her denemede seni alkışlar.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeak(activeVoice.en)}
                  className="px-3.5 py-2 rounded-2xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-black text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Örnek Telaffuzu Dinle</span>
                </button>
              </div>

              <div className="text-center py-4 space-y-2">
                <span className="text-5xl">{activeVoice.emoji}</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  "{activeVoice.en}"
                </div>
                <div className="text-sm font-bold text-pink-600">
                  {activeVoice.tr}
                </div>
                <div className="text-xs text-slate-500 max-w-md mx-auto">
                  💡 Telaffuz İpucu: {activeVoice.tip}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulateVoiceRecording}
                  disabled={voiceStatus === 'listening'}
                  className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                    voiceStatus === 'listening'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white hover:scale-105'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>
                    {voiceStatus === 'listening' ? 'Chirmo Seni Dinliyor... 🎧' : 'Mikrofona Söyle & Puan Al 🎤'}
                  </span>
                </button>
              </div>

              {voiceStatus === 'scored' && voiceScore && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-center space-y-1 animate-fade-in">
                  <div className="text-2xl font-black text-emerald-600">
                    🏆 Telaffuz Başarın: %{voiceScore}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Aferin sana! Telaffuzun son derece net ve anlaşılır. Chirmo seninle gurur duyuyor!
                  </div>
                </div>
              )}
            </div>
            )}

          </div>
        )}

        {/* ==================== TAB 2: 🃏 AKILLI GÖRSEL KELİME KARTLARI ==================== */}
        {activeTab === 'cards' && (
          <div className="space-y-4">
            {/* Kategori Filtresi */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
              <span className="text-xs font-black text-slate-400 shrink-0">Kategori:</span>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-pink-600 text-white font-black shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Zengin Kart Izgarası */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocab.map((card) => (
                <div
                  key={card.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-3 group hover:scale-[1.02] relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl group-hover:scale-125 transition-transform">{card.emoji}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
                        {card.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          handleSpeak(card.en);
                          handleAwardStars(2, 'Kelime Dinlendi');
                        }}
                        className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                        title="Kelimeyi Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      {card.en}
                    </div>
                    <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mt-0.5">
                      {card.tr}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    <span className="font-bold text-amber-700 dark:text-amber-400">💡 Biliyor musun?</span> {card.funFact}
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-800 text-[11px]">
                    <div className="font-bold text-purple-700 dark:text-purple-300">"{card.soundText}"</div>
                    <div className="text-slate-500 text-[10px]">{card.exampleTr}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleSpeak(card.soundText);
                      handleAwardStars(3, 'Cümle Tekrarı Yapıldı');
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Cümleyi Dinle & Tekrar Et! 🎤</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: 🏃‍♂️ CHIRMO DİYOR Kİ! (TPR ACTION LAB) ==================== */}
        {activeTab === 'simon' && (() => {
          const simonActions = (targetLang === 'de' ? GERMAN_TPR_SIMON_ACTIONS[selectedAge] : TPR_SIMON_ACTIONS[selectedAge]) || (targetLang === 'de' ? GERMAN_TPR_SIMON_ACTIONS['5-7'] : TPR_SIMON_ACTIONS['5-7']);
          const currentAction = simonActions[simonIndex % simonActions.length];
          const isCompleted = simonCompletedActions.includes(currentAction.id);

          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>TPR Eylem & Konuşma Laboratuvarı • {selectedAge} Yaş</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {targetLang === 'de' ? 'Chirmo sagt! (Simon Says) 🏃‍♂️' : 'Chirmo Diyor ki! (Simon Says) 🏃‍♂️'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Duyduğun eylemi tüm bedeninle canlandır ve Chirmo ile birlikte yüksek sesle {targetLang === 'de' ? 'Almanca' : 'İngilizce'} konuş!
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
                    Tamamlanan: {simonCompletedActions.length} / {simonActions.length} Görev ⭐
                  </span>
                </div>
              </div>

              {/* Görev Seçim Butonları */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {simonActions.map((action, idx) => {
                  const isSelected = simonIndex === idx;
                  const isDone = simonCompletedActions.includes(action.id);
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => setSimonIndex(idx)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md scale-102 font-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
                      }`}
                    >
                      <span>{action.emoji}</span>
                      <span>{idx + 1}. Görev</span>
                      {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-1" />}
                    </button>
                  );
                })}
              </div>

              {/* Aktif Simon Says Kartı */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 text-white shadow-xl relative overflow-hidden space-y-6">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-200">
                      <span>{currentAction.badge}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-5xl sm:text-6xl drop-shadow-md">{currentAction.emoji}</span>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
                          {currentAction.title}
                        </div>
                        <div className="text-sm sm:text-base font-bold text-amber-100">
                          Türkçesi: {currentAction.commandTr}
                        </div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-sm text-xs sm:text-sm text-amber-50 border border-white/20">
                      👉 <strong>Nasıl Yapılır:</strong> {currentAction.hint}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-64">
                    <button
                      type="button"
                      onClick={() => handleSpeak(currentAction.listenAudio)}
                      className="w-full py-3 px-4 rounded-2xl bg-white text-slate-900 hover:bg-amber-100 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span>Chirmo'nun Sesini Dinle 🔊</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSpeak(currentAction.replyEn)}
                      className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <Smile className="w-4 h-4 text-slate-950" />
                      <span>Sen Söyle: "{currentAction.replyEn}"</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isCompleted) {
                          setsimonCompletedActions((prev) => [...prev, currentAction.id]);
                          handleAwardStars(10, 'Chirmo Diyor ki Görevini Yaptın!');
                          handleSpeak(targetLang === 'de' ? `Gut gemacht! Fantastisch! ${currentAction.replyEn}` : `Well done! You did it! ${currentAction.replyEn}`);
                        }
                        setSimonIndex((prev) => (prev + 1) % simonActions.length);
                      }}
                      className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>{isCompleted ? 'Tekrar Tamamla & Sıradakine Geç (+10 Yıldız ⭐)' : 'Görevi Yaptım! (+10 Yıldız ⭐)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================== TAB: 📖 SİHİRLİ KONUŞAN HİKAYELER ==================== */}
        {activeTab === 'stories' && (() => {
          const currentScenes = (targetLang === 'de' ? GERMAN_STORYBOOK_SCENES[selectedAge] : STORYBOOK_SCENES[selectedAge]) || (targetLang === 'de' ? GERMAN_STORYBOOK_SCENES['5-7'] : STORYBOOK_SCENES['5-7']);
          const currentScene = currentScenes.find((s) => s.id === activeStorySceneId) || currentScenes[0];
          const activeItem = currentScene.hotspots.find((h) => h.id === selectedStoryItemId) || currentScene.hotspots[0];

          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-300 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase">
                    <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                    <span>Görsel Bağlam Temelli Hikaye Dünyası • {selectedAge} Yaş</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Sihirli Konuşan Hikayeler (Interactive Storybooks) 📖
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Bir sahne seç, nesnelerin ve karakterlerin üzerine tıkla; canlı {targetLang === 'de' ? 'Almanca' : 'İngilizce'} hikayeyi dinle!
                  </p>
                </div>
              </div>

              {/* Sahne Seçim Butonları */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentScenes.map((scene) => {
                  const isSelected = (currentScene && currentScene.id === scene.id) || activeStorySceneId === scene.id;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => {
                        setActiveStorySceneId(scene.id);
                        setSelectedStoryItemId(null);
                      }}
                      className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black shadow-lg border-purple-400 scale-102'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-2xl mb-1">{scene.emoji}</div>
                      <div className="text-xs font-black truncate">{scene.name}</div>
                      <div className="text-[10px] opacity-80 truncate">{scene.nameEn}</div>
                    </button>
                  );
                })}
              </div>

              {/* Seçili Sahne ve Sıcak Noktalar */}
              <div className="space-y-4">
                <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r ${currentScene.bgGradient} text-white shadow-xl relative overflow-hidden`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl">{currentScene.emoji}</span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white">{currentScene.name}</h3>
                        <div className="text-xs text-purple-100">{currentScene.nameEn} - {currentScene.description}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-black bg-white/20 px-3 py-1 rounded-full self-start">
                      Tıkla & Konuştur
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentScene.hotspots.map((item) => {
                      const isHotspotActive = activeItem.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedStoryItemId(item.id);
                            handleSpeak(`${item.nameEn}! ${item.phraseEn}`);
                            handleAwardStars(5, `Hikaye Keşfi: ${item.nameEn}`);
                          }}
                          className={`p-4 rounded-2xl transition-all cursor-pointer flex flex-col items-center text-center space-y-2 backdrop-blur-md border ${
                            isHotspotActive
                              ? 'bg-white text-slate-900 shadow-xl ring-4 ring-amber-300 scale-105'
                              : 'bg-black/25 hover:bg-black/40 text-white border-white/20'
                          }`}
                        >
                          <span className="text-4xl drop-shadow-md">{item.emoji}</span>
                          <div>
                            <div className={`text-xs font-black ${isHotspotActive ? 'text-purple-900' : 'text-white'}`}>
                              {item.nameEn}
                            </div>
                            <div className={`text-[10px] ${isHotspotActive ? 'text-slate-600' : 'text-white/80'}`}>
                              {item.nameTr}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seçili Nesnenin Konuşan Hikaye Kartı */}
                <div className="p-5 rounded-2xl bg-purple-50 dark:bg-slate-800/80 border-2 border-purple-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{activeItem.emoji}</span>
                    <div>
                      <div className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">
                        {activeItem.nameEn} ({activeItem.nameTr})
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        "{activeItem.phraseEn}"
                      </div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Türkçesi: {activeItem.phraseTr}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeak(activeItem.phraseEn)}
                    className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                    <span>Hikaye Cümlesini Dinle 🔊</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================== TAB 3: 🧩 KALIP BİRLEŞTİRME ATÖLYESİ (KIDS PATTERN LEGO) ==================== */}
        {activeTab === 'patterns' && (() => {
          const currentPatternOpts = (targetLang === 'de' ? GERMAN_PATTERN_OPTIONS[selectedAge] : PATTERN_OPTIONS[selectedAge]) || (targetLang === 'de' ? GERMAN_PATTERN_OPTIONS['5-7'] : PATTERN_OPTIONS['5-7']);
          const currentFactoryOpts = (targetLang === 'de' ? GERMAN_FACTORY_OPTIONS[selectedAge] : FACTORY_OPTIONS[selectedAge]) || (targetLang === 'de' ? GERMAN_FACTORY_OPTIONS['5-7'] : FACTORY_OPTIONS['5-7']);

          return (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-slate-800 shadow-lg space-y-8">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>🧩 Lego Gibi Cümle Kurma Atölyesi (Kids Pattern Builder)</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-black">
                    {selectedAge} Yaş Kademesi
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Türkçe ile {targetLang === 'de' ? 'Almanca' : 'İngilizce'} arasındaki farkı çöz: Cümleleri kalıp bloklarını yan yana getirerek oluşturuyoruz.
                </p>
              </div>

              {/* Blok Seçiciler */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Blok 1: İstek / Kalıp */}
                <div className="p-4 rounded-2xl bg-pink-50 dark:bg-slate-800 space-y-2 border border-pink-200">
                  <span className="text-[11px] font-black text-pink-700 uppercase">1. Başlangıç Kalıbı</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {currentPatternOpts.prefixes.map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setBuilderPrefix(pref)}
                        className={`p-2 rounded-xl text-xs font-black text-left transition-all cursor-pointer ${
                          builderPrefix === pref
                            ? 'bg-pink-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-pink-100'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blok 2: Nesne / Eylem */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-slate-800 space-y-2 border border-purple-200">
                  <span className="text-[11px] font-black text-purple-700 uppercase">2. Nesne ya da Eylem</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {currentPatternOpts.objects.map((obj) => (
                      <button
                        key={obj}
                        type="button"
                        onClick={() => setBuilderObject(obj)}
                        className={`p-2 rounded-xl text-xs font-black text-left transition-all cursor-pointer ${
                          builderObject === obj
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-100'
                        }`}
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blok 3: Nezaket & Tamamlayıcı */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 space-y-2 border border-amber-200">
                  <span className="text-[11px] font-black text-amber-700 uppercase">3. Nezaket & Ek</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {currentPatternOpts.suffixes.map((suf) => (
                      <button
                        key={suf}
                        type="button"
                        onClick={() => setBuilderSuffix(suf)}
                        className={`p-2 rounded-xl text-xs font-black text-left transition-all cursor-pointer ${
                          builderSuffix === suf
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
                        }`}
                      >
                        {suf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Canlı Üretilen Cümle Vitrini */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-lg space-y-3">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  ⚡ Canlı Oluşturulan {targetLang === 'de' ? 'Almanca' : 'İngilizce'} Cümlen:
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  "{constructedKidsSentence}."
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSpeak(constructedKidsSentence);
                      handleAwardStars(5, 'Yeni Bir Cümle Ürettin!');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-slate-950" />
                    <span>🔊 Chirmo ile Dinle & Tekrar Et (+5 Yıldız)</span>
                  </button>
                </div>
              </div>

              {/* ==================== 4 BLOKLU CÜMLE FABRİKASI 2.0 ==================== */}
              <div className="pt-6 border-t-2 border-purple-200/60 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>🏭 Cümle Fabrikası 2.0 (Sentence Factory)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-black">
                        4 Bloklu Doğal Konuşma • {selectedAge} Yaş
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Özne, Eylem, Nesne ve Zaman/Yer bloklarını seçerek sınırsız sayıda {targetLang === 'de' ? 'Almanca' : 'İngilizce'} cümle üret!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const subjects = currentFactoryOpts.subjects;
                      const actions = currentFactoryOpts.actions;
                      const objects = currentFactoryOpts.objects;
                      const contexts = currentFactoryOpts.contexts;

                      setFactorySubject(subjects[Math.floor(Math.random() * subjects.length)]);
                      setFactoryAction(actions[Math.floor(Math.random() * actions.length)]);
                      setFactoryObject(objects[Math.floor(Math.random() * objects.length)]);
                      setFactoryContext(contexts[Math.floor(Math.random() * contexts.length)]);
                      handleAwardStars(5, 'Rastgele Cümle Keşfettin!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>🎲 Rastgele Cümle Üret</span>
                  </button>
                </div>

                {/* 4 Kolon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Kolon 1: Özne */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/50 space-y-2">
                    <span className="text-[11px] font-black text-blue-700 dark:text-blue-300 uppercase flex items-center space-x-1">
                      <span>1. Özne (Kim?)</span>
                    </span>
                    <div className="space-y-1.5">
                      {currentFactoryOpts.subjects.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setFactorySubject(item)}
                          className={`w-full p-2 rounded-xl text-xs font-black text-left transition-all cursor-pointer ${
                            factorySubject === item
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100'
                          }`}
                        >
                          <div>{item}</div>
                          <div className={`text-[10px] font-medium ${factorySubject === item ? 'text-blue-100' : 'text-slate-400'}`}>
                            {FACTORY_TR_LOOKUP[item] || ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kolon 2: Eylem */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                    <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 uppercase flex items-center space-x-1">
                      <span>2. Eylem (Ne Yapıyor?)</span>
                    </span>
                    <div className="space-y-1.5">
                      {currentFactoryOpts.actions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setFactoryAction(item)}
                          className={`w-full p-2 rounded-xl text-xs font-black text-left transition-all cursor-pointer ${
                            factoryAction === item
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100'
                          }`}
                        >
                          <div>{item}</div>
                          <div className={`text-[10px] font-medium ${factoryAction === item ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {FACTORY_TR_LOOKUP[item] || ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kolon 3: Nesne */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900/50 space-y-2">
                    <span className="text-[11px] font-black text-amber-700 dark:text-amber-300 uppercase flex items-center space-x-1">
                      <span>3. Nesne (Neyi?)</span>
                    </span>
                    <div className="space-y-1.5">
                      {currentFactoryOpts.objects.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setFactoryObject(item)}
                          className={`w-full p-2 rounded-xl text-xs font-black text-left transition-all cursor-pointer ${
                            factoryObject === item
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
                          }`}
                        >
                          <div>{item}</div>
                          <div className={`text-[10px] font-medium ${factoryObject === item ? 'text-slate-900' : 'text-slate-400'}`}>
                            {FACTORY_TR_LOOKUP[item] || ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kolon 4: Zaman & Yer */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-slate-800/80 border border-rose-200 dark:border-rose-900/50 space-y-2">
                    <span className="text-[11px] font-black text-rose-700 dark:text-rose-300 uppercase flex items-center space-x-1">
                      <span>4. Zaman & Yer</span>
                    </span>
                    <div className="space-y-1.5">
                      {currentFactoryOpts.contexts.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setFactoryContext(item)}
                          className={`w-full p-2 rounded-xl text-xs font-black text-left transition-all cursor-pointer ${
                            factoryContext === item
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-100'
                          }`}
                        >
                          <div>{item}</div>
                          <div className={`text-[10px] font-medium ${factoryContext === item ? 'text-rose-100' : 'text-slate-400'}`}>
                            {FACTORY_TR_LOOKUP[item] || ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fabrika Çıktısı */}
                {(() => {
                  const fullSentenceEn = `${factorySubject} ${factoryAction} ${factoryObject} ${factoryContext}`;
                  const fullSentenceTr = getFactoryFullTr();
                  return (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-950 text-white shadow-xl space-y-3 border border-emerald-700/40">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                          🏭 Cümle Fabrikası Çıktısı:
                        </span>
                        <span className="text-[11px] font-black text-emerald-200 bg-emerald-800/50 px-2.5 py-0.5 rounded-full">
                          Gramatikal Olarak Kusursuz
                        </span>
                      </div>

                      <div className="text-xl sm:text-2xl font-black text-white">
                        "{fullSentenceEn}."
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-emerald-200">
                        Türkçesi: {fullSentenceTr}.
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleSpeak(fullSentenceEn);
                            handleAwardStars(10, 'Cümle Fabrikasından Yeni Cümle Ürettin!');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95"
                        >
                          <Volume2 className="w-4 h-4 text-slate-950" />
                          <span>🔊 Chirmo ile Dinle & Telaffuz Et (+10 Yıldız ⭐)</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}

        {/* ==================== TAB: 🦁 KONUŞAN HAYVANAT BAHÇESİ ==================== */}
        {activeTab === 'animals' && (() => {
          const currentAnimals = targetLang === 'de' ? GERMAN_SAFARI_ANIMALS : SAFARI_ANIMALS;
          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                    🦁 İnteraktif Safarimiz
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Chirmo'nun Konuşan Hayvanat Bahçesi
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Bir hayvana tıkla! Hem neşeli sesini duy hem de {targetLang === 'de' ? 'Almanca' : 'İngilizce'} kendini nasıl tanıttığını dinle.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentAnimals.map((animal) => {
                  const isSelected = selectedAnimalId === animal.id;
                  return (
                    <button
                      key={animal.id}
                      type="button"
                      onClick={() => {
                        setSelectedAnimalId(animal.id);
                        handleSpeak(animal.soundText);
                        handleAwardStars(5, `${animal.nameEn} sesini dinledin!`);
                      }}
                      className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 text-center group hover:scale-105 active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-4 ring-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <span className="text-5xl group-hover:scale-120 transition-transform">
                        {animal.emoji}
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {animal.nameEn}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {animal.nameTr}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedAnimalId && (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 flex items-start space-x-3 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 animate-fade-in">
                  <span className="text-3xl">🗣️</span>
                  <div>
                    <div className="font-black text-base">
                      "{currentAnimals.find((a) => a.id === selectedAnimalId)?.soundText}"
                    </div>
                    <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mt-1">
                      {currentAnimals.find((a) => a.id === selectedAnimalId)?.funTr}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ==================== TAB: 🎨 SİHİRLİ BOYA & KONUŞ ==================== */}
        {activeTab === 'colors' && (() => {
          const currentColors = targetLang === 'de' ? GERMAN_MAGIC_COLORS : MAGIC_COLORS;
          const activeColor = currentColors.find((c) => c.id === activeColorId) || currentColors[0];

          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-[11px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-full">
                  🎨 Renkler & Nesneler
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Sihirli Boya & Konuş Laboratuvarı
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Rengi seç, sihirli fırçayla boya ve nesnenin {targetLang === 'de' ? 'Almanca' : 'İngilizce'} cümlesini tekrar et!
                </p>
              </div>

              {/* Renk Seçim Paleti */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {currentColors.map((col) => {
                  const isActive = activeColor.id === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        setActiveColorId(col.id);
                        handleSpeak(col.sample);
                        handleAwardStars(5, `${col.nameEn} rengini boyadın!`);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                        isActive ? 'border-slate-900 scale-105 shadow-md ring-2 ring-rose-400' : 'border-transparent'
                      } bg-gradient-to-tr ${col.bgClass} text-white font-black`}
                    >
                      <span className="text-2xl">{col.emoji}</span>
                      <span className="text-xs">{col.nameEn}</span>
                      <span className="text-[10px] opacity-80">{col.nameTr}</span>
                    </button>
                  );
                })}
              </div>

              {/* Renk Vitrini */}
              <div className={`p-6 rounded-3xl bg-gradient-to-tr ${activeColor.bgClass} text-white shadow-lg text-center space-y-3 animate-fade-in`}>
                <div className="text-6xl animate-bounce">{activeColor.emoji}</div>
                <div className="text-2xl sm:text-3xl font-black">
                  "{activeColor.sample}"
                </div>
                <div className="text-sm font-bold text-white/90">
                  {activeColor.objectTr} • {activeColor.nameTr}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(activeColor.sample)}
                    className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md cursor-pointer hover:bg-slate-100"
                  >
                    🔊 Chirmo ile Dinle & Tekrar Et
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================== TAB: 💬 ÇİZGİ KARAKTER CHIRMO SOHBETİ ==================== */}
        {activeTab === 'chat' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                💬 Canlı Çizgi Karakter Diyaloğu
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Chirmo ile Eğlenceli Sohbet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Chirmo sana basit bir soru soruyor! Aşağıdaki renkli butonlardan dilediğini seç ve seslendir.
              </p>
            </div>

            {(() => {
              const currentChatList = (targetLang === 'de' ? GERMAN_KIDS_CHAT_STEPS[selectedAge] : KIDS_CHAT_STEPS[selectedAge]) || (targetLang === 'de' ? GERMAN_KIDS_CHAT_STEPS['5-7'] : KIDS_CHAT_STEPS['5-7']);
              const currentStep = currentChatList[chatStepIndex % currentChatList.length];
              return (
                <div className="space-y-6">
                  {/* Chirmo Soru Balonu */}
                  <div className="flex items-start space-x-3 p-5 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-3xl shadow-sm shrink-0">
                      🤖
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-black text-blue-600 uppercase">Chirmo Soruyor:</div>
                      <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        "{currentStep.chirmoEn}"
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {currentStep.chirmoTr}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(currentStep.chirmoEn)}
                        className="text-xs font-bold text-blue-600 flex items-center space-x-1 pt-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Soruyu Dinle</span>
                      </button>
                    </div>
                  </div>

                  {/* Çocuk Seçenek Butonları */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentStep.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setChildAnswerText(opt.textEn);
                          handleSpeak(opt.replyEn);
                          handleAwardStars(10, 'Chirmo ile konuştun!');
                          setTimeout(() => {
                            setChatStepIndex((prev) => (prev + 1) % currentChatList.length);
                            setChildAnswerText(null);
                          }, 3000);
                        }}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1 shadow-sm hover:scale-102"
                      >
                        <span className="text-3xl">{opt.emoji}</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {opt.textEn}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {opt.textTr}
                        </span>
                      </button>
                    ))}
                  </div>

                  {childAnswerText && (
                    <div className="p-3 rounded-2xl bg-blue-100 text-blue-900 text-xs font-black text-center animate-bounce">
                      {targetLang === 'de' ? '🎉 Chirmo: "Wunderbar gesprochen! Wir gehen zur nächsten Frage..."' : '🎉 Chirmo: "Harika konuştun! Sıradaki soruya geçiyoruz..."'}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== TAB: ⭐ SÜPER ÇIKARTMA ALBÜMÜ ==================== */}
        {activeTab === 'stickers' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                  ⭐ Başarı & Koleksiyon
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Süper Çıkartma Albümüm
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Her pratik yaptığında yıldız kazanırsın! Yıldızların arttıkça yeni sevimli çıkartmaların kilidi açılır.
                </p>
              </div>

              <div className="bg-amber-400 text-slate-950 px-4 py-2 rounded-2xl font-black text-sm flex items-center space-x-2 shadow-sm self-start sm:self-auto">
                <Star className="w-4 h-4 fill-slate-950" />
                <span>Toplam Yıldızım: {stars} ⭐</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {STICKER_COLLECTION.map((stk) => {
                const isUnlocked = stars >= stk.reqStars;
                return (
                  <div
                    key={stk.id}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center space-y-2 text-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-md scale-102'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <span className="text-4xl">{isUnlocked ? stk.emoji : '🔒'}</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {stk.title}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isUnlocked ? 'Açıldı! ✨' : `${stk.reqStars} ⭐ Gerekli`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: 🎵 ŞARKILAR, MASALLAR & KARAOKE ==================== */}
        {activeTab === 'songs' && (() => {
          const currentSongs = targetLang === 'de' ? GERMAN_KIDS_SONGS : KIDS_SONGS;
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentSongs.map((song) => {
                const isPlaying = playingSongId === song.id;
                return (
                  <div
                    key={song.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                          {song.category} • {song.duration}
                        </span>
                        <Music className="w-4 h-4 text-pink-500" />
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {song.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        🎯 Öğretilen Beceri: {song.grammarFocus}
                      </p>
                    </div>

                    {/* Karaoke Sözleri */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 space-y-1 font-medium text-xs text-slate-700 dark:text-slate-300 border border-amber-100">
                      {song.lyrics.map((line, i) => (
                        <div key={i} className="leading-relaxed">
                          {line}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPlayingSongId(song.id);
                        handleSpeak(song.audioSample);
                        handleAwardStars(5, 'Şarkı Söylendi!');
                      }}
                      className={`w-full py-2.5 rounded-xl font-black text-xs shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        isPlaying
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Şarkıyı Dinle & Eşlik Et (+5 ⭐)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })()}



          </div>
        )}

      </div>
    </div>
  );
};

export default ChirmoKidsDedicatedHub;
