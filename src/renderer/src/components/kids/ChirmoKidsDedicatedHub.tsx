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
    'games' | 'cards' | 'simon' | 'stories' | 'patterns' | 'animals' | 'colors' | 'chat' | 'stickers' | 'songs'
  >('games');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tümü');

  // TPR Simon Says (Chirmo Diyor ki!) State
  const [simonIndex, setSimonIndex] = useState<number>(0);
  const [simonCompletedActions, setSimonCompletedActions] = useState<string[]>([]);

  // Interactive Storybooks State
  const [activeStorySceneId, setActiveStorySceneId] = useState<string>('forest');
  const [selectedStoryItemId, setSelectedStoryItemId] = useState<string | null>(null);

  // 4-Block Sentence Factory 2.0 State
  const [factorySubject, setFactorySubject] = useState<string>('My friendly dog');
  const [factoryAction, setFactoryAction] = useState<string>('is playing with');
  const [factoryObject, setFactoryObject] = useState<string>('a colorful ball');
  const [factoryContext, setFactoryContext] = useState<string>('in the sunny park');

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

  // ==================== TPR ACTION LAB (CHIRMO DİYOR Kİ! / SIMON SAYS) ====================
  const TPR_SIMON_ACTIONS = [
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
  ];

  // ==================== İNTERAKTİF SESLİ HİKAYE SAHNELERİ ====================
  const STORYBOOK_SCENES = [
    {
      id: 'forest',
      name: 'Piknik Ormanı',
      nameEn: 'The Magical Picnic Forest',
      emoji: '🌳',
      bgGradient: 'from-emerald-500 via-green-600 to-teal-700',
      description: 'Güneşli ormanda sevimli hayvan dostlarımızla neşeli bir piknik günü!',
      hotspots: [
        {
          id: 'h1',
          nameEn: 'Cute Squirrel',
          nameTr: 'Sevimli Sincap',
          phraseEn: 'The cute squirrel is eating crunchy nuts under the tree.',
          phraseTr: 'Sevimli sincap ağacın altında çıtır fındıklar yiyor.',
          emoji: '🐿️'
        },
        {
          id: 'h2',
          nameEn: 'Picnic Basket',
          nameTr: 'Piknik Sepeti',
          phraseEn: 'Look at the picnic basket filled with sweet red apples and sandwiches!',
          phraseTr: 'Tatlı kırmızı elmalar ve sandviçlerle dolu piknik sepetine bak!',
          emoji: '🧺'
        },
        {
          id: 'h3',
          nameEn: 'Singing Bird',
          nameTr: 'Öten Kuş',
          phraseEn: 'The little blue bird sings a sweet morning melody.',
          phraseTr: 'Minik mavi kuş tatlı bir sabah melodisi söylüyor.',
          emoji: '🐦'
        },
        {
          id: 'h4',
          nameEn: 'Golden Butterfly',
          nameTr: 'Altın Kelebek',
          phraseEn: 'A magical golden butterfly dances over fragrant flowers.',
          phraseTr: 'Büyülü altın bir kelebek mis kokulu çiçeklerin üzerinde dans ediyor.',
          emoji: '🦋'
        }
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
        {
          id: 'h5',
          nameEn: 'Brave Astronaut',
          nameTr: 'Cesur Astronot',
          phraseEn: 'The brave astronaut floats weightlessly in the space station.',
          phraseTr: 'Cesur astronot uzay istasyonunda yerçekimsiz süzülüyor.',
          emoji: '👨‍🚀'
        },
        {
          id: 'h6',
          nameEn: 'Space Rocket',
          nameTr: 'Uzay Roketi',
          phraseEn: 'The shiny rocket blasts through the sparkling Milky Way!',
          phraseTr: 'Parlak roket ışıldayan Samanyolu galaksisinde hızla ilerliyor!',
          emoji: '🚀'
        },
        {
          id: 'h7',
          nameEn: 'Ringed Planet Saturn',
          nameTr: 'Halkalı Gezegen Satürn',
          phraseEn: 'Saturn has bright glowing rings made of ice and cosmic dust.',
          phraseTr: 'Satürn buz ve kozmik tozdan oluşan parlak ışıltılı halkalara sahiptir.',
          emoji: '🪐'
        },
        {
          id: 'h8',
          nameEn: 'Friendly Alien',
          nameTr: 'Dost Uzaylı',
          phraseEn: 'The friendly green alien waves and says "Welcome to our galaxy!"',
          phraseTr: 'Dost canlısı yeşil uzaylı el sallıyor ve "Galaksimize hoş geldin!" diyor.',
          emoji: '👽'
        }
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
        {
          id: 'h9',
          nameEn: 'Playful Dolphin',
          nameTr: 'Oyuncu Yunus',
          phraseEn: 'The joyful dolphin leaps gracefully above the turquoise waves!',
          phraseTr: 'Neşeli yunus turkuaz dalgaların üzerinde zarifçe sıçrıyor!',
          emoji: '🐬'
        },
        {
          id: 'h10',
          nameEn: 'Wise Sea Turtle',
          nameTr: 'Bilge Deniz Kaplumbağası',
          phraseEn: 'The wise sea turtle glides gently through the colorful coral reef.',
          phraseTr: 'Bilge deniz kaplumbağası renkli mercan kayalıklarının arasında sakince süzülüyor.',
          emoji: '🐢'
        },
        {
          id: 'h11',
          nameEn: 'Coral Reef',
          nameTr: 'Renkli Mercan Resifi',
          phraseEn: 'Vibrant coral formations provide cozy homes for tiny tropical fish.',
          phraseTr: 'Canlı mercan oluşumları minik tropik balıklar için sıcak yuvalar sunar.',
          emoji: '🪸'
        },
        {
          id: 'h12',
          nameEn: 'Shiny Pearl Shell',
          nameTr: 'Parlak İnci İstiridyesi',
          phraseEn: 'Inside the pearl shell lies a rare shimmering treasure of the sea.',
          phraseTr: 'İstiridyenin içinde denizin nadide, parıldayan bir hazinesi yatıyor.',
          emoji: '🦪'
        }
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
        {
          id: 'h13',
          nameEn: 'Gentle Brachiosaurus',
          nameTr: 'Sevimli Brakiyozor',
          phraseEn: 'The gentle long-necked dinosaur reaches green leaves on tall branches.',
          phraseTr: 'Sevimli uzun boyunlu dinozor yüksek dallardaki yeşil yapraklara uzanıyor.',
          emoji: '🦕'
        },
        {
          id: 'h14',
          nameEn: 'Mighty T-Rex',
          nameTr: 'Güçlü T-Rex',
          phraseEn: 'The mighty T-Rex lets out an energetic roar across the prehistoric jungle!',
          phraseTr: 'Güçlü T-Rex tarih öncesi ormanda enerjik bir kükreme bırakıyor!',
          emoji: '🦖'
        },
        {
          id: 'h15',
          nameEn: 'Flying Pterodactyl',
          nameTr: 'Uçan Terodaktil',
          phraseEn: 'The pterodactyl glides smoothly over misty volcanic peaks.',
          phraseTr: 'Terodaktil sisli volkanik tepelerin üzerinde pürüzsüzce süzülüyor.',
          emoji: '🦅'
        },
        {
          id: 'h16',
          nameEn: 'Dinosaur Egg',
          nameTr: 'Bebek Dinozor Yumurtası',
          phraseEn: 'Crack crack! Look, a cute baby dinosaur is hatching from the egg!',
          phraseTr: 'Çat çat! Bak, yumurtadan sevimli bir yavru dinozor çıkıyor!',
          emoji: '🥚'
        }
      ]
    }
  ];

  // 4-Block Sentence Factory Turkish Translation Lookup
  const FACTORY_TR_LOOKUP: Record<string, string> = {
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
    'with a happy smile': 'mutlu bir tebessümle'
  };

  const getFactoryFullTr = () => {
    const s = FACTORY_TR_LOOKUP[factorySubject] || factorySubject;
    const a = FACTORY_TR_LOOKUP[factoryAction] || factoryAction;
    const o = FACTORY_TR_LOOKUP[factoryObject] || factoryObject;
    const c = FACTORY_TR_LOOKUP[factoryContext] || factoryContext;
    return `${s}, ${c} ${o} ${a}`;
  };

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

        {/* ==================== TAB: 🏃‍♂️ CHIRMO DİYOR Kİ! (TPR ACTION LAB) ==================== */}
        {activeTab === 'simon' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>TPR (Total Physical Response) Eylem & Hareket Laboratuvarı</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Chirmo Diyor ki! (Simon Says) 🏃‍♂️
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Duyduğun eylemi tüm bedeninle uygula ve Chirmo ile birlikte yüksek sesle tekrar et!
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
                  Tamamlanan: {simonCompletedActions.length} / {TPR_SIMON_ACTIONS.length} Görev ⭐
                </span>
              </div>
            </div>

            {/* Görev Seçim Butonları */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {TPR_SIMON_ACTIONS.map((action, idx) => {
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
            {(() => {
              const currentAction = TPR_SIMON_ACTIONS[simonIndex % TPR_SIMON_ACTIONS.length];
              const isCompleted = simonCompletedActions.includes(currentAction.id);
              return (
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
                            setSimonCompletedActions((prev) => [...prev, currentAction.id]);
                            handleAwardStars(10, 'Chirmo Diyor ki Görevini Yaptın!');
                            handleSpeak(`Well done! You did it! ${currentAction.replyEn}`);
                          }
                          setSimonIndex((prev) => (prev + 1) % TPR_SIMON_ACTIONS.length);
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
              );
            })()}
          </div>
        )}

        {/* ==================== TAB: 📖 SİHİRLİ KONUŞAN HİKAYELER ==================== */}
        {activeTab === 'stories' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-300 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  <span>Görsel Bağlam Temelli Hikaye Dünyası</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Sihirli Konuşan Hikayeler (Interactive Storybooks) 📖
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Bir sahne seç, nesnelerin ve karakterlerin üzerine tıkla; canlı İngilizce hikayeyi dinle!
                </p>
              </div>
            </div>

            {/* Sahne Seçim Butonları */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STORYBOOK_SCENES.map((scene) => {
                const isSelected = activeStorySceneId === scene.id;
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
            {(() => {
              const currentScene = STORYBOOK_SCENES.find((s) => s.id === activeStorySceneId) || STORYBOOK_SCENES[0];
              const activeItem = currentScene.hotspots.find((h) => h.id === selectedStoryItemId) || currentScene.hotspots[0];

              return (
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
              );
            })()}
          </div>
        )}

        {/* ==================== TAB 3: 🧩 KALIP BİRLEŞTİRME ATÖLYESİ (KIDS PATTERN LEGO) ==================== */}
        {activeTab === 'patterns' && (
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-slate-800 shadow-lg space-y-8">
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

            {/* ==================== 4 BLOKLU CÜMLE FABRİKASI 2.0 ==================== */}
            <div className="pt-6 border-t-2 border-purple-200/60 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>🏭 Cümle Fabrikası 2.0 (Sentence Factory)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-black">
                      4 Bloklu Doğal Konuşma
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Özne, Eylem, Nesne ve Zaman/Yer bloklarını seçerek sınırsız sayıda İngilizce cümle üret!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const subjects = ['My friendly dog', 'The smart robot', 'The little rabbit', 'My best friend', 'A brave astronaut'];
                    const actions = ['is playing with', 'likes to eat', 'wants to explore', 'can see', 'is dancing with'];
                    const objects = ['a colorful ball', 'a sweet apple', 'a big rainbow', 'the space rocket', 'a delicious cookie'];
                    const contexts = ['in the sunny park', 'every single morning', 'under the big tree', 'in the cozy room', 'with a happy smile'];

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
                    {['My friendly dog', 'The smart robot', 'The little rabbit', 'My best friend', 'A brave astronaut'].map((item) => (
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
                    {['is playing with', 'likes to eat', 'wants to explore', 'can see', 'is dancing with'].map((item) => (
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
                    {['a colorful ball', 'a sweet apple', 'a big rainbow', 'the space rocket', 'a delicious cookie'].map((item) => (
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
                    {['in the sunny park', 'every single morning', 'under the big tree', 'in the cozy room', 'with a happy smile'].map((item) => (
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



      </div>
    </div>
  );
};

export default ChirmoKidsDedicatedHub;
