import React, { useState, useEffect } from 'react';
import {
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
  const [activeTab, setActiveTab] = useState<
    'games' | 'cards' | 'patterns' | 'animals' | 'colors' | 'chat' | 'stickers' | 'songs' | 'parent'
  >('games');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tümü');

  // Kids Safari Animals State
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

  // Kids Magic Colors State
  const [activeColorId, setActiveColorId] = useState<string>('c-red');

  // Kids Cartoon Chat State
  const [chatStepIndex, setChatStepIndex] = useState<number>(0);
  const [childAnswerText, setChildAnswerText] = useState<string | null>(null);

  // Gamification State
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('chirmo_kids_stars');
    return saved ? parseInt(saved, 10) : 24;
  });
  const [streakDays, setStreakDays] = useState<number>(4);
  const [lastAwardMessage, setLastAwardMessage] = useState<string | null>(null);

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
  const [builderPrefix, setBuilderPrefix] = useState<string>('I want');
  const [builderObject, setBuilderObject] = useState<string>('water');
  const [builderSuffix, setBuilderSuffix] = useState<string>('please');

  // Songs & Karaoke State
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Parent Gate Security State
  const [parentUnlocked, setParentUnlocked] = useState<boolean>(false);
  const [parentPinInput, setParentPinInput] = useState<string>('');
  const [screenLimitMinutes, setScreenLimitMinutes] = useState<number>(15);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);

  // Persistent Stars
  useEffect(() => {
    localStorage.setItem('chirmo_kids_stars', stars.toString());
  }, [stars]);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleAwardStars = (amount: number, reason: string) => {
    setStars((prev) => prev + amount);
    AnalyticsService.logGamePlayed(amount * 10);
    setLastAwardMessage(`🎉 +${amount} Yıldız! ${reason}`);
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
      { id: 'v9', en: 'Teddy Bear', tr: 'Oyuncak Ayıcık', emoji: '🧸', category: 'Oyun', soundText: 'My cute teddy bear is very soft.', exampleTr: 'Sevimli oyuncak ayım çok yumuşak.', funFact: 'Çocuklar uyurken ayıcıklarına sarılmayı çok sever.' }
    ],
    '8-10': [
      { id: 'v10', en: 'Backpack', tr: 'Okul Çantası', emoji: '🎒', category: 'Okul', soundText: 'My heavy backpack is full of colorful books.', exampleTr: 'Ağır okul çantam renkli kitaplarla dolu.', funFact: 'Okul eşyalarımızı düzenli tutmak derslerimizde bize büyük kolaylık sağlar.' },
      { id: 'v11', en: 'Bicycle', tr: 'Bisiklet', emoji: '🚲', category: 'Spor', soundText: 'I can ride my blue bicycle in the park.', exampleTr: 'Parkta mavi bisikletimi sürebiliyorum.', funFact: 'Bisiklet sürmek hem bacak kaslarını hem dengeyi geliştirir.' },
      { id: 'v12', en: 'Space Rocket', tr: 'Uzay Roketi', emoji: '🚀', category: 'Bilim', soundText: 'Three, two, one! The space rocket blasts off!', exampleTr: 'Üç, iki, bir! Uzay roketi fırlatıldı!', funFact: 'Roketler saniyede 11 kilometre hızla uzaya çıkar.' },
      { id: 'v13', en: 'Pencil', tr: 'Kurşun Kalem', emoji: '✏️', category: 'Okul', soundText: 'Can I borrow your sharp pencil, please?', exampleTr: 'Açılmış kurşun kalemini ödünç alabilir miyim lütfen?', funFact: 'Bir kurşun kalemle yaklaşık 50.000 kelime yazılabilir.' },
      { id: 'v14', en: 'Guitar', tr: 'Gitar', emoji: '🎸', category: 'Müzik', soundText: 'She can play a cheerful melody on the guitar.', exampleTr: 'Gitarla neşeli bir melodi çalabiliyor.', funFact: 'Müzik dinlemek yabancı dil kulak aşinalığını 3 kat hızlandırır.' },
      { id: 'v15', en: 'Ice Cream', tr: 'Dondurma', emoji: '🍦', category: 'Yiyecekler', soundText: 'I want a big strawberry ice cream, please.', exampleTr: 'Büyük bir çilekli dondurma istiyorum lütfen.', funFact: 'Dondurma mutluluk hormonu salgılanmasına katkı sağlar.' },
      { id: 'v16', en: 'Dinosaur', tr: 'Dinozor', emoji: '🦖', category: 'Doğa', soundText: 'The giant dinosaur walked on earth long ago.', exampleTr: 'Dev dinozor çok uzun zaman önce dünyada yürüdü.', funFact: 'T-Rex dinozorunun bir dişi 30 santimetreye kadar uzardı!' }
    ],
    '11-13': [
      { id: 'v17', en: 'Laboratory', tr: 'Fen Laboratuvarı', emoji: '🔬', category: 'Okul', soundText: 'Excuse me, where is the science laboratory?', exampleTr: 'Affedersiniz, fen laboratuvarı nerede acaba?', funFact: 'LGS sınavında yön ve okul terimleri sıkça sorulur.' },
      { id: 'v18', en: 'Adventure', tr: 'Macera', emoji: '🗺️', category: 'Sosyal', soundText: 'We are ready for an exciting mountain adventure.', exampleTr: 'Heyecanlı bir dağ macerasına hazırız.', funFact: 'Macera dolu hikayeler okumak kelime hazinesini genişletir.' },
      { id: 'v19', en: 'Best Friend', tr: 'En İyi Arkadaş', emoji: '🤝', category: 'Sosyal', soundText: 'You can always trust your true best friend.', exampleTr: 'Gerçek en iyi arkadaşına her zaman güvenebilirsin.', funFact: 'Arkadaşlık diyaloğu 6. sınıf müfredatının kilit konusudur.' },
      { id: 'v20', en: 'Library', tr: 'Kütüphane', emoji: '📚', category: 'Okul', soundText: 'Please keep quiet while studying in the library.', exampleTr: 'Lütfen kütüphanede ders çalışırken sessiz olun.', funFact: 'Dünyanın en büyük kütüphanesinde 170 milyondan fazla eser vardır.' },
      { id: 'v21', en: 'Ticket', tr: 'Bilet', emoji: '🎟️', category: 'Günlük Yaşam', soundText: 'How much is one student ticket for the museum?', exampleTr: 'Müze için bir öğrenci bileti ne kadar?', funFact: 'Yurt dışı seyahatlerinde bilet sormak en temel gereksinimdir.' }
    ],
    '14-17': [
      { id: 'v22', en: 'Algorithm', tr: 'Algoritma & Kodlama', emoji: '💻', category: 'Teknoloji', soundText: 'I enjoy writing clean code and solving logic puzzles.', exampleTr: 'Temiz kod yazmaktan ve mantık bulmacaları çözmekten keyif alırım.', funFact: 'Yazılım dünyasının evrensel dili İngilizcedir.' },
      { id: 'v23', en: 'Perspective', tr: 'Bakış Açısı', emoji: '💡', category: 'Düşünce', soundText: 'In my opinion, we need a creative new perspective.', exampleTr: 'Bana göre, yaratıcı yeni bir bakış açısına ihtiyacımız var.', funFact: 'B1 ve B2 seviye konuşmalarda fikir belirtmek zorunludur.' },
      { id: 'v24', en: 'Soundtrack', tr: 'Müzik Listesi / Çalma Listesi', emoji: '🎧', category: 'Müzik', soundText: 'This indie track is the soundtrack of my summer.', exampleTr: 'Bu parça benim yaz tatilimin müzik temasıdır.', funFact: 'Şarkı sözlerini çevirmek dinleme sınavlarında başarıyı %40 artırır.' },
      { id: 'v25', en: 'Teamwork', tr: 'Takım Çalışması', emoji: '🏆', category: 'Gelecek', soundText: 'Effective teamwork leads to international success.', exampleTr: 'Etkili takım çalışması uluslararası başarıya götürür.', funFact: 'Küresel üniversite ve burs mülakatlarının 1 numaralı sorusudur.' }
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
      }
    ],
    '14-17': [
      {
        id: 'q7',
        questionAudio: 'Algorithm',
        promptTr: 'Dinle! Yazılım ve problem çözme mantığına ne denir?',
        options: [
          { id: 'o1', label: 'Algorithm', emoji: '💻', isCorrect: true },
          { id: 'o2', label: 'Soundtrack', emoji: '🎧', isCorrect: false },
          { id: 'o3', label: 'Perspective', emoji: '💡', isCorrect: false },
          { id: 'o4', label: 'Teamwork', emoji: '🏆', isCorrect: false }
        ],
        praise: 'Keskin zeka! Algorithm doğru eşleştirildi!'
      }
    ]
  };

  // ==================== OYUN 2: CÜMLE YAPBOZU (SENTENCE PUZZLE LEGO) ====================
  const PUZZLE_CHALLENGES: Record<AgeGroup, KidSentencePuzzleItem[]> = {
    '5-7': [
      { id: 'p1', targetEn: 'I want water please', targetTr: 'Su istiyorum lütfen', words: ['water', 'I', 'please', 'want'], emoji: '💧', hint: 'Önce "I" (Ben), sonra "want" (istiyorum)...' },
      { id: 'p2', targetEn: 'I like red apples', targetTr: 'Kırmızı elmaları severim', words: ['apples', 'like', 'red', 'I'], emoji: '🍎', hint: 'Önce kim sever? "I like"...' },
      { id: 'p3', targetEn: 'The cat is happy', targetTr: 'Kedi çok mutlu', words: ['happy', 'The', 'is', 'cat'], emoji: '🐱', hint: 'Kediyle başla: "The cat is happy"' }
    ],
    '8-10': [
      { id: 'p4', targetEn: 'Can I have milk please', targetTr: 'Süt alabilir miyim lütfen', words: ['have', 'milk', 'Can', 'please', 'I'], emoji: '🥛', hint: 'İzin isterken "Can I have..." kalıbını kullanırız.' },
      { id: 'p5', targetEn: 'I can ride my bicycle', targetTr: 'Bisikletimi sürebiliyorum', words: ['ride', 'bicycle', 'can', 'my', 'I'], emoji: '🚲', hint: 'Yetenek bildirirken: "I can ride..."' },
      { id: 'p6', targetEn: 'Where is my backpack', targetTr: 'Okul çantam nerede', words: ['my', 'is', 'Where', 'backpack'], emoji: '🎒', hint: 'Nerede sorusu "Where is..." ile başlar.' }
    ],
    '11-13': [
      { id: 'p7', targetEn: 'Excuse me where is the museum', targetTr: 'Affedersiniz müze nerede', words: ['where', 'Excuse', 'museum', 'the', 'me', 'is'], emoji: '🏛️', hint: 'Kibarca başla: "Excuse me, where is..."' },
      { id: 'p8', targetEn: 'How much is the student ticket', targetTr: 'Öğrenci bileti ne kadar', words: ['much', 'the', 'ticket', 'How', 'is', 'student'], emoji: '🎟️', hint: 'Fiyat sorarken "How much is..."' }
    ],
    '14-17': [
      { id: 'p9', targetEn: 'In my opinion teamwork is important', targetTr: 'Bana göre takım çalışması önemlidir', words: ['teamwork', 'opinion', 'important', 'In', 'is', 'my'], emoji: '🤝', hint: 'Kendi fikrini ifade ederken "In my opinion..."' }
    ]
  };

  // ==================== OYUN 3: SÜPER TELAFFUZ ARENASI (VOICE COACH) ====================
  const VOICE_CHALLENGES: Record<AgeGroup, { en: string; tr: string; tip: string; emoji: string }[]> = {
    '5-7': [
      { en: 'I want milk, please!', tr: 'Süt istiyorum lütfen!', tip: 'Sonundaki "please" kelimesini kibarca uzatarak söyle.', emoji: '🥛' },
      { en: 'Look at the happy dog!', tr: 'Mutlu köpeğe bak!', tip: '"Look" derken u harfini kısa söyle.', emoji: '🐶' }
    ],
    '8-10': [
      { en: 'Can I borrow your pencil?', tr: 'Kurşun kalemini ödünç alabilir miyim?', tip: '"Borrow" kelimesini baro-v gibi doğal telaffuz et.', emoji: '✏️' },
      { en: 'I love playing football with friends.', tr: 'Arkadaşlarımla futbol oynamayı çok severim.', tip: '"Friends" sonundaki s harfini hafifçe duyur.', emoji: '⚽' }
    ],
    '11-13': [
      { en: 'Where can I find the science book?', tr: 'Fen kitabını nerede bulabilirim?', tip: '"Science" derken s-a-y-ıns gibi akıcı bağla.', emoji: '🔬' }
    ],
    '14-17': [
      { en: 'I really enjoy learning languages with Chirmo.', tr: 'Chirmo ile dil öğrenmekten gerçekten keyif alıyorum.', tip: '"Really enjoy" ifadesini vurgulayarak konuş.', emoji: '🚀' }
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
  const KIDS_CHAT_STEPS = [
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
  ];

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
  const allCurrentVocab = AGE_VOCABULARY[selectedAge] || [];
  const uniqueCategories = ['Tümü', ...Array.from(new Set(allCurrentVocab.map((v) => v.category)))];
  const filteredVocab = categoryFilter === 'Tümü'
    ? allCurrentVocab
    : allCurrentVocab.filter((v) => v.category === categoryFilter);

  // Mini-Game 1 Handlers
  const currentQuizzes = LISTENING_QUIZZES[selectedAge] || LISTENING_QUIZZES['5-7'];
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
      handleSpeak('Try again friend! Bir kez daha dene!');
      setTimeout(() => {
        setQuizAnswerState('idle');
        setSelectedOptionId(null);
      }, 1500);
    }
  };

  // Mini-Game 2 Handlers
  const currentPuzzles = PUZZLE_CHALLENGES[selectedAge] || PUZZLE_CHALLENGES['5-7'];
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
        handleSpeak(`Awesome! ${activePuzzle.targetEn}`);
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
  const currentVoices = VOICE_CHALLENGES[selectedAge] || VOICE_CHALLENGES['5-7'];
  const activeVoice = currentVoices[voiceIndex % currentVoices.length];

  const handleSimulateVoiceRecording = () => {
    setVoiceStatus('listening');
    setTimeout(() => {
      setVoiceStatus('scored');
      setVoiceScore(96);
      handleAwardStars(20, 'Harika Telaffuz!');
      handleSpeak(`Very good pronunciation! ${activeVoice.en}`);
    }, 1800);
  };

  // Pattern Builder Live Sentence Construction
  const constructedKidsSentence = `${builderPrefix} ${builderObject} ${builderSuffix}`.trim();

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-amber-50/70 via-pink-50/40 to-purple-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-y-auto p-3 sm:p-6 pb-28 select-none">
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* ==================== 1. ŞENLİKLİ KAHRAMAN BAŞLIK & MASKOT BARI ==================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white shadow-xl p-5 sm:p-7 border border-white/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Sol: Maskot ve Başlık */}
            <div className="flex items-start sm:items-center space-x-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/25 backdrop-blur-md p-2 flex items-center justify-center text-4xl sm:text-5xl shadow-lg border border-white/30 animate-pulse">
                  🎈
                </div>
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs">
                  Chirmo Jr.
                </span>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Çocuklar İçin Yeni Nesil İngilizce Dünyası</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-xs">
                  Eğlen, Oyna ve İngilizce Konuş! 🌟
                </h1>
                <p className="text-xs sm:text-sm text-pink-100 font-medium max-w-xl">
                  Sıkıcı gramer ve kurallar yok! Tıpkı ana dilini öğrenir gibi: Duyarak, lego gibi birleştirerek ve oyunlarla konuşuyoruz.
                </p>
              </div>
            </div>

            {/* Sağ: Yıldızlar, Seri ve Geri Dön Butonu */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              {onBackToMain && (
                <button
                  type="button"
                  onClick={onBackToMain}
                  className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-black transition-all flex items-center space-x-1 cursor-pointer border border-white/25 shadow-xs"
                  title="Ana Arama & Stüdyoya Dön"
                >
                  <span>← Ana Stüdyo</span>
                </button>
              )}

              <div className="flex items-center space-x-2 bg-black/25 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-300">Günlük Seri</div>
                  <div className="text-sm font-black text-white">{streakDays} Gün 🔥</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-amber-400/90 text-slate-950 px-4 py-2 rounded-2xl shadow-lg border border-amber-300 font-black">
                <Star className="w-5 h-5 text-amber-900 fill-amber-900" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-amber-950/80">Yıldızlarım</div>
                  <div className="text-base font-black leading-none">{stars} ⭐</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tebrik Mesajı Bildirimi (Canlı Pop-up) */}
          {lastAwardMessage && (
            <div className="mt-3 py-2 px-4 rounded-xl bg-white/95 text-purple-900 font-black text-xs shadow-md animate-bounce flex items-center justify-between">
              <span>{lastAwardMessage}</span>
              <span className="text-[10px] opacity-75">Tebrikler Şampiyon!</span>
            </div>
          )}
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
                onClick={() => setSelectedAge(item.id)}
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

        {/* ==================== 3. AKTİVİTE VE ÖĞRENME SEKMELERİ ==================== */}
        <div className="flex flex-wrap items-center gap-2 border-b-2 border-pink-200/60 dark:border-slate-800 pb-2">
          {[
            { id: 'games', label: '🎮 Oyunlar & Quizz', icon: Gamepad2, color: 'text-amber-500' },
            { id: 'cards', label: '🃏 Görsel Kelimeler (30+)', icon: Smile, color: 'text-pink-500' },
            { id: 'patterns', label: '🧩 Cümle Legosu Atölyesi', icon: Puzzle, color: 'text-purple-500' },
            { id: 'animals', label: '🦁 Konuşan Hayvanlar', icon: Sparkles, color: 'text-emerald-500' },
            { id: 'colors', label: '🎨 Sihirli Boya & Konuş', icon: Zap, color: 'text-rose-500' },
            { id: 'chat', label: '💬 Çizgi Karakter Sohbeti', icon: MessageCircle, color: 'text-blue-500' },
            { id: 'stickers', label: '⭐ Çıkartma Albümü', icon: Award, color: 'text-amber-500' },
            { id: 'songs', label: '🎵 Şarkılar & Karaoke', icon: Music, color: 'text-rose-500' },
            { id: 'parent', label: '🛡️ Veli Güven & Gelişim Paneli', icon: ShieldCheck, color: 'text-indigo-500' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md scale-102'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== TAB 1: 🎮 OYUNLAR VE İNTERAKTİF TESTLER ==================== */}
        {activeTab === 'games' && (
          <div className="space-y-6">

            {/* OYUN 1: DUY VE RESMİ BUL (LISTENING DETECTIVE) */}
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

            {/* OYUN 2: CÜMLE YAPBOZU (SENTENCE PUZZLE LEGO) */}
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

            {/* OYUN 3: SÜPER TELAFFUZ ARENASI (VOICE COACH) */}
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

          </div>
        )}

        {/* ==================== TAB 2: 🃏 AKILLI GÖRSEL KELİME KARTLARI ==================== */}
        {activeTab === 'cards' && (
          <div className="space-y-4">
            {/* Kategori Filtresi */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
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

        {/* ==================== TAB 3: 🧩 KALIP BİRLEŞTİRME ATÖLYESİ (KIDS PATTERN LEGO) ==================== */}
        {activeTab === 'patterns' && (
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-slate-800 shadow-lg space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>🧩 Lego Gibi Cümle Kurma Atölyesi (Kids Pattern Builder)</span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-black">
                  Ezbersiz Mantık
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Türkçe ile İngilizce arasındaki farkı çöz: Cümleleri kalıp bloklarını yan yana getirerek oluşturuyoruz.
              </p>
            </div>

            {/* Blok Seçiciler */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Blok 1: İstek / Kalıp */}
              <div className="p-4 rounded-2xl bg-pink-50 dark:bg-slate-800 space-y-2 border border-pink-200">
                <span className="text-[11px] font-black text-pink-700 uppercase">1. Başlangıç Kalıbı</span>
                <div className="grid grid-cols-1 gap-1.5">
                  {['I want', 'Can I have', 'I like', 'Where is', 'I can'].map((pref) => (
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
                  {['water', 'an apple', 'a bicycle', 'milk', 'my backpack', 'to play'].map((obj) => (
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
                  {['please', 'today', 'now', 'together', 'with friends'].map((suf) => (
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
                ⚡ Canlı Oluşturulan İngilizce Cümlen:
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
          </div>
        )}

        {/* ==================== TAB: 🦁 KONUŞAN HAYVANAT BAHÇESİ ==================== */}
        {activeTab === 'animals' && (
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
                  Bir hayvana tıkla! Hem neşeli sesini duy hem de İngilizce kendini nasıl tanıttığını dinle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SAFARI_ANIMALS.map((animal) => {
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
                    "{SAFARI_ANIMALS.find((a) => a.id === selectedAnimalId)?.soundText}"
                  </div>
                  <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mt-1">
                    {SAFARI_ANIMALS.find((a) => a.id === selectedAnimalId)?.funTr}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: 🎨 SİHİRLİ BOYA & KONUŞ ==================== */}
        {activeTab === 'colors' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-full">
                🎨 Renkler & Nesneler
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Sihirli Boya & Konuş Laboratuvarı
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Rengi seç, sihirli fırçayla boya ve nesnenin İngilizce cümlesini tekrar et!
              </p>
            </div>

            {/* Renk Seçim Paleti */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {MAGIC_COLORS.map((col) => {
                const isActive = activeColorId === col.id;
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
            {(() => {
              const activeColor = MAGIC_COLORS.find((c) => c.id === activeColorId) || MAGIC_COLORS[0];
              return (
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
              );
            })()}
          </div>
        )}

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
              const currentStep = KIDS_CHAT_STEPS[chatStepIndex % KIDS_CHAT_STEPS.length];
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
                            setChatStepIndex((prev) => (prev + 1) % KIDS_CHAT_STEPS.length);
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
                      🎉 Chirmo: "Harika konuştun! Sıradaki soruya geçiyoruz..."
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
        {activeTab === 'songs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KIDS_SONGS.map((song) => {
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
        )}

        {/* ==================== TAB 5: 🛡️ VELİ GÜVEN & GELİŞİM PANELİ ==================== */}
        {activeTab === 'parent' && (
          <div className="space-y-6">
            {/* Ebeveyn Kilit Doğrulaması (Çocukların yanlışlıkla ayarları değiştirmesini önler) */}
            {!parentUnlocked ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-800 shadow-xl text-center space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                  🔒
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Ebeveyn Doğrulama Kapısı
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Güvenlik sorusu: Lütfen çocuğunuzun ayarları değiştirmemesi için aşağıdaki işlemi onaylayın:
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-base font-black text-indigo-700">
                  4 + 3 = ?
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={parentPinInput}
                    onChange={(e) => setParentPinInput(e.target.value)}
                    placeholder="Sonucu yazın (örn: 7)"
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold text-sm bg-white dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (parentPinInput.trim() === '7') {
                        setParentUnlocked(true);
                      } else {
                        alert('Hatalı yanıt! Lütfen işlemi tekrar kontrol edin.');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                  >
                    Kilidi Aç
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 4 Ana Güvenlik Sütunu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                    <div className="flex items-center space-x-2 text-emerald-600 font-black text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>%100 Güvenli & Reklamsız</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Dış bağlantı, reklam ya da tanımadığı kişilerle sohbet alanı kesinlikle bulunmaz.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                    <div className="flex items-center space-x-2 text-indigo-600 font-black text-xs">
                      <GraduationCap className="w-4 h-4" />
                      <span>Uluslararası Müfredat Uyumlu</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Uluslararası eğitim müfredatındaki yaşa uygun kelime listeleri ve pratik konuşma kalıplarıyla tam uyumludur.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                    <div className="flex items-center space-x-2 text-pink-600 font-black text-xs">
                      <Clock className="w-4 h-4" />
                      <span>15 Dk Ekran Koruma Limiti</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Çocuğu ekrana bağımlı yapmaz; 15 dakikalık odaklı mikro seansla konuşma refleksini geliştirir.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                    <div className="flex items-center space-x-2 text-purple-600 font-black text-xs">
                      <BookCheck className="w-4 h-4" />
                      <span>Haftalık Veli Raporu</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Çocuğunuzun o hafta öğrendiği 25 yeni kalıp ve telaffuz performansı veliye özetlenir.
                    </div>
                  </div>
                </div>

                {/* Ekran Süresi Sınırı Ayarlayıcısı */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Günlük Ekran ve Odak Süresi Sınırı:</span>
                  </h4>
                  <div className="flex items-center space-x-3">
                    {[10, 15, 20, 30].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setScreenLimitMinutes(mins)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          screenLimitMinutes === mins
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {mins} Dakika
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Öneri: Dil edinimi psikolojisinde 15 dakikalık günlük düzenli tekrar, haftada bir gün 2 saat çalışmaktan 4 kat daha kalıcıdır.
                  </p>
                </div>

                {/* Veli Karnesi / WhatsApp Paylaşım Önizlemesi */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-2 border-emerald-200 dark:border-slate-700 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase text-emerald-700">Canlı Veli Gelişim Özeti</div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        Öğrenci: Ali / Ayşe • Seviye: Cümle Kaşifi (Pre-A1)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowShareToast(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Raporu Al</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-lg font-black text-indigo-600">{stars} ⭐</div>
                      <div className="text-[10px] text-slate-500 font-bold">Kazanılan Yıldız</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-lg font-black text-emerald-600">32 Kelime</div>
                      <div className="text-[10px] text-slate-500 font-bold">Aktif Hafızada</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-lg font-black text-amber-600">%96</div>
                      <div className="text-[10px] text-slate-500 font-bold">Ortalama Telaffuz</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-lg font-black text-purple-600">{streakDays} Gün</div>
                      <div className="text-[10px] text-slate-500 font-bold">Kesintisiz Seri</div>
                    </div>
                  </div>

                  {showShareToast && (
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center animate-fade-in">
                      ✅ Haftalık karne özeti panoya kopyalandı! Veli WhatsApp grubunda gururla paylaşabilirsiniz.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ChirmoKidsDedicatedHub;
