import React, { useState } from 'react';
import {
  X,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Search,
  Check
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

interface PitfallItem {
  id: string;
  category: 'direct' | 'false_friends' | 'prepositions' | 'german_pitfalls';
  categoryLabel: string;
  lang: 'en' | 'de' | 'both';
  wrong: string;
  correct: string;
  meaningTr: string;
  whyWrong: string;
  teacherSecret: string;
}

const PITFALL_DATABASE: PitfallItem[] = [
  // 1. BİREBİR ÇEVİRİ VE DİL TUZAKLARI (DIRECT TRANSLATION ERRORS)
  {
    id: 'pit-1',
    category: 'direct',
    categoryLabel: '🚫 Birebir Çeviri Tuzağı',
    lang: 'en',
    wrong: 'I am agree with you.',
    correct: 'I agree with you.',
    meaningTr: 'Seninle aynı fikirdeyim / Sana katılıyorum.',
    whyWrong: 'Birebir çeviri yaparken "katılmak" eylemi "I am..." sanılıp "am" eklenir. İngilizcede "agree" sıfat değil, doğrudan bir fiildir. Başına "am/is/are" almaz.',
    teacherSecret: '50 Yıllık Hoca Püf Noktası: "I agree" de geç. "I am agree" dersen "Ben katılmağın kendisiyim" demiş gibi olursun.'
  },
  {
    id: 'pit-2',
    category: 'direct',
    categoryLabel: '🚫 Birebir Çeviri Tuzağı',
    lang: 'en',
    wrong: 'I am boring in this class.',
    correct: 'I am bored in this class.',
    meaningTr: 'Bu derste sıkıldım.',
    whyWrong: '"Boring" insanı veya şeyi tanımlar: "Ben sıkıcı bir insanım" anlamına gelir! Senin canın sıkıldıysa "-ed" ekiyle "I am bored" demelisin.',
    teacherSecret: 'Unutma: Sen "boring" değilsin, ders "boring" olduğu için sen "bored" oldun!'
  },
  {
    id: 'pit-3',
    category: 'direct',
    categoryLabel: '🚫 Birebir Çeviri Tuzağı',
    lang: 'en',
    wrong: 'Please close the light before sleeping.',
    correct: 'Please turn off the light before sleeping.',
    meaningTr: 'Lütfen uyumadan önce ışığı kapat.',
    whyWrong: 'Çoğu dilde kapı da ışık da aynı kelimeyle kapatılır. İngilizcede elektrikli cihazlar "turn off" ile kapatılır, "close" sadece kapı/pencere içindir.',
    teacherSecret: '"Close the light" dersen yabancı biri ışığı elinle büküp katlamaya çalışıyorsun zanneder! Elektrik varsa daima "turn off".'
  },
  {
    id: 'pit-4',
    category: 'direct',
    categoryLabel: '🚫 Birebir Çeviri Tuzağı',
    lang: 'en',
    wrong: 'Yesterday I went to home very late.',
    correct: 'Yesterday I went home very late.',
    meaningTr: 'Dün eve çok geç gittim.',
    whyWrong: 'Eve gitmek yönelme eki zihinde doğrudan "to" ile eşleştirilir. İngilizcede "home" kelimesi zarftır ve önüne "to" asla almaz.',
    teacherSecret: '"Go home", "come home", "arrive home". Arada "to" yok!'
  },
  {
    id: 'pit-5',
    category: 'direct',
    categoryLabel: '🚫 Birebir Çeviri Tuzağı',
    lang: 'en',
    wrong: 'I make breakfast every morning.',
    correct: 'I have breakfast every morning.',
    meaningTr: 'Her sabah kahvaltı yaparım.',
    whyWrong: 'Eğer mutfakta omlet pişirip masayı hazırlıyorsan "make breakfast" diyebilirsin; ama kahvaltı yapıp yiyorsan daima "have breakfast" kullanılır.',
    teacherSecret: 'Yemek yemek, kahve içmek eylemlerinde İngilizler "have" fiilini kullanır: "have lunch", "have a coffee".'
  },

  // 2. YALANCI ARKADAŞLAR (FALSE FRIENDS)
  {
    id: 'pit-6',
    category: 'false_friends',
    categoryLabel: '🎭 Yalancı Arkadaşlar (False Friends)',
    lang: 'en',
    wrong: 'Eventually it will rain today. (Evhamlı/Muhtemelen sanılır)',
    correct: 'Eventually they found the lost keys. (Nihayetinde / Sonunda)',
    meaningTr: 'Eninde sonunda kayıp anahtarları buldular.',
    whyWrong: '"Eventually" kelimesi ses benzerliğinden dolayı "muhtemelen/evhamlı" ile karıştırılmamalıdır! "Eninde sonunda, nihayetinde uzun çaba sonrası" demektir.',
    teacherSecret: '"Muhtemelen" demek için "Probably" kullan. "Eventually" sabırla beklenen sonucun gelmesidir.'
  },
  {
    id: 'pit-7',
    category: 'false_friends',
    categoryLabel: '🎭 Yalancı Arkadaşlar (False Friends)',
    lang: 'en',
    wrong: 'She is a very sympathetic person. (Sempatik sanılır)',
    correct: 'She is very friendly and likeable. / She was sympathetic to my problem.',
    meaningTr: 'O çok cana yakın ve sevimli biri.',
    whyWrong: 'İngilizcede "Sympathetic", cana yakın ve sevimli demek değildir! "Halden anlayan, başkasının acısına ortak olan/duyarlı" demektir. Sevimli için "Friendly" denir.',
    teacherSecret: 'Birine sempatik demek istiyorsan "She is charming / friendly" de. "Sympathetic" dersen ona dert anlatan terapist gibi anlaşılır.'
  },
  {
    id: 'pit-8',
    category: 'false_friends',
    categoryLabel: '🎭 Yalancı Arkadaşlar (False Friends)',
    lang: 'de',
    wrong: 'Ich will Arzt bekommen. (Become sanıp "Doktor olmak istiyorum" sanılır)',
    correct: 'Ich will Arzt werden. / Ich habe ein Geschenk bekommen.',
    meaningTr: 'Doktor olmak istiyorum. (Bekommen = Almak demektir!)',
    whyWrong: 'Almanca "bekommen" İngilizce "become" (olmak) değildir! Almancada bekommen = "teslim almak, hediye almak"tır. Olmak ise "werden"dir.',
    teacherSecret: 'Almanya\'da restoranda "Ich bekomme ein Bier" dersen "Bir bira alayım" demiş olursun. Asla "olmak" anlamında kullanma!'
  },
  {
    id: 'pit-9',
    category: 'false_friends',
    categoryLabel: '🎭 Yalancı Arkadaşlar (False Friends)',
    lang: 'de',
    wrong: 'Hier ist ein schönes Gift für dich! (İngilizce Hediye sanılır)',
    correct: 'Hier ist ein schönes Geschenk für dich!',
    meaningTr: 'İşte senin için güzel bir hediye! (Gift = ZEHİR demektir!)',
    whyWrong: 'DİKKAT! İngilizcedeki "Gift" (hediye), Almancada tam tersine "ZEHİR" demektir. Bir Alman\'a "Das ist ein Gift" dersen onu zehirlemek istediğini sanır!',
    teacherSecret: 'Almancada hediye daima "Geschenk"tir. Sakın Gift deme!'
  },

  // 3. EDAT & YAPI TUZAKLARI (PREPOSITIONS)
  {
    id: 'pit-10',
    category: 'prepositions',
    categoryLabel: '🧠 Edat & Kalıp Uyuşmazlıkları',
    lang: 'en',
    wrong: 'Please listen me carefully.',
    correct: 'Please listen to me carefully.',
    meaningTr: 'Lütfen beni dikkatlice dinle.',
    whyWrong: '"Beni dinle" derken edatsız kullanılırken, İngilizcede "listen" fiili bir nesne alırken YÜZDE YÜZ "to" edatı ile birleşir.',
    teacherSecret: '"Listen to me", "Listen to music", "Listen to the teacher". "To"suz dinlemek kulaksız dinlemektir!'
  },
  {
    id: 'pit-11',
    category: 'prepositions',
    categoryLabel: '🧠 Edat & Kalıp Uyuşmazlıkları',
    lang: 'en',
    wrong: 'She is married with a doctor.',
    correct: 'She is married to a doctor.',
    meaningTr: 'O bir doktor ile evli.',
    whyWrong: '"Biri ile evli" denildiğinde zihin hemen "with" kelimesine gider. İngilizcede birine bağlanmak "to" ile ifade edilir.',
    teacherSecret: '"Married with" dersen doktor yanında şahit gibi duruyor sanılır. Evlilik bağı daima "married to"dur.'
  },

  // 4. ALMANCA KRİTİK HATA RADARI (GERMAN PITFALLS)
  {
    id: 'pit-12',
    category: 'german_pitfalls',
    categoryLabel: '🇩🇪 Almanca Kritik Hata Radarı',
    lang: 'de',
    wrong: 'Ich bin warm. (Bana sıcak bastı demek isterken)',
    correct: 'Mir ist warm.',
    meaningTr: 'Bana sıcak bastı / Sıcak hissediyorum.',
    whyWrong: 'ÇOK KRİTİK: Almancada "Ich bin warm" dersen argo olarak "Ben eşcinselim" anlamına gelir! Hava sıcaktan bunaldıysan "BANA sıcak geldi" mantığıyla "Mir ist warm" demelisin.',
    teacherSecret: '50 Yıllık Almanca Püf Noktası: "Mir ist kalt" (Üşüdüm), "Mir ist warm" (Bana sıcak bastı), "Mir ist schlecht" (Midem bulanıyor). Daima "Mir ist..."!'
  },
  {
    id: 'pit-13',
    category: 'german_pitfalls',
    categoryLabel: '🇩🇪 Almanca Kritik Hata Radarı',
    lang: 'de',
    wrong: 'Weil ich habe keine Zeit. (Fiili ortada bırakmak)',
    correct: 'Weil ich keine Zeit habe.',
    meaningTr: 'Çünkü zamanım yok.',
    whyWrong: 'Almancada "weil", "dass", "obwohl" gibi yan cümle bağlaçları geldiğinde çekimli fiil bir mancınık gibi cümlenin EN SONUNA fırlar!',
    teacherSecret: '"Weil" gördüğün an fiili al, cümlenin en sonuna yapıştır. Almancanın temel omurgası bu sondaki fiildir.'
  },
  {
    id: 'pit-14',
    category: 'german_pitfalls',
    categoryLabel: '🇩🇪 Almanca Kritik Hata Radarı',
    lang: 'de',
    wrong: 'Ich habe in Berlin seit 3 Jahren gelebt. (Geçmiş zaman tuzağı)',
    correct: 'Ich lebe seit 3 Jahren in Berlin.',
    meaningTr: '3 yıldır Berlin\'de yaşıyorum.',
    whyWrong: 'Hala Berlin\'de yaşamaya devam ediyorsan "seit" ile geçmiş zaman değil, ŞİMDİKİ ZAMAN (Präsens) kullanılır.',
    teacherSecret: 'Eylem hala sürüyorsa: "Seit + Präsens". Geçmiş zamana gitme!'
  }
];

interface ChirmoTurkishPitfallsRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

export const ChirmoTurkishPitfallsRadarModal: React.FC<ChirmoTurkishPitfallsRadarModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  if (!isOpen) return null;

  const targetLang = TargetLanguageService.getTargetLanguage();

  const filteredItems = PITFALL_DATABASE.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesLang = item.lang === 'both' || item.lang === targetLang;
    const matchesSearch =
      searchQuery === '' ||
      item.wrong.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.correct.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaningTr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLang && matchesSearch;
  });

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const currentQuizItem = PITFALL_DATABASE[quizIndex % PITFALL_DATABASE.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/30 dark:border-amber-500/40 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Üst Başlık Barı */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-black shadow-md">
              <AlertTriangle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-wide">
                  En Sık Yapılan 100 Kritik Hata Radarı
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                  50 Yıllık Hoca Koruma Kalkanı
                </span>
              </div>
              <p className="text-[11px] text-amber-100 font-medium hidden sm:block">
                Birebir Çeviri Tuzakları • Yalancı Arkadaşlar (False Friends) • Kritik Dil Hataları
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setQuizMode(!quizMode);
                setSelectedQuizChoice(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                quizMode ? 'bg-white text-orange-700 shadow-md' : 'bg-black/25 text-white hover:bg-black/40'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{quizMode ? 'Listeye Dön' : '🎯 Hata Avcısı Testi'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Normal Liste Modu */}
        {!quizMode ? (
          <>
            {/* Kategori Filtresi & Arama */}
            <div className="p-3 sm:px-6 sm:py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Tüm Tuzaklar' },
                  { id: 'direct', label: '🚫 Birebir Çeviri' },
                  { id: 'false_friends', label: '🎭 Yalancı Arkadaşlar' },
                  { id: 'prepositions', label: '🧠 Edat Hataları' },
                  { id: 'german_pitfalls', label: '🇩🇪 Almanca Özel' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Arama Kutusu */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hata veya kelime ara..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Hata Kartları Izgarası */}
            <div className="p-3 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between space-y-3 group shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                        {item.categoryLabel}
                      </span>
                      <button
                        onClick={() => handleSpeak(item.correct)}
                        className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                        title="Doğru Cümleyi Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hatalı & Doğru Karşılaştırması */}
                    <div className="space-y-2">
                      {/* Yanlış */}
                      <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-2 text-xs">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-rose-700 dark:text-rose-400 line-through">
                            {item.wrong}
                          </span>
                          <span className="text-[10px] block text-rose-500/80 font-bold">❌ Birebir Çeviri Hatası</span>
                        </div>
                      </div>

                      {/* Doğru */}
                      <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-start space-x-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-emerald-800 dark:text-emerald-300 text-sm">
                            {item.correct}
                          </span>
                          <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-bold">
                            ✅ Yerlilerin Doğal Kullanımı
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Türkçe Anlamı */}
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      🎯 Gerçek Anlam: <span className="font-extrabold">{item.meaningTr}</span>
                    </div>

                    {/* Hoca Püf Noktası */}
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-[11px] space-y-1">
                      <div className="font-black text-amber-700 dark:text-amber-400 flex items-center space-x-1">
                        <span>🎓 Neden Yanlış?</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-snug">{item.whyWrong}</p>
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px] pt-1">
                        💡 {item.teacherSecret}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Hata Avcısı Test Modu */
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex flex-col justify-between max-w-2xl mx-auto w-full space-y-6">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-black">
                🎯 Soru {quizIndex + 1} / {PITFALL_DATABASE.length} • Puan: {quizScore} XP
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Hangisi Doğal ve Doğru İngilizce/Almanca Kullanımıdır?
              </h3>
              <p className="text-xs text-slate-500">
                Hedef Anlam: <span className="font-black text-slate-800 dark:text-white">"{currentQuizItem.meaningTr}"</span>
              </p>
            </div>

            {/* Seçenekler */}
            <div className="space-y-3">
              {[currentQuizItem.wrong, currentQuizItem.correct]
                .sort(() => (quizIndex % 2 === 0 ? 1 : -1))
                .map((choice, idx) => {
                  const isCorrect = choice === currentQuizItem.correct;
                  const isSelected = selectedQuizChoice === choice;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (selectedQuizChoice) return;
                        setSelectedQuizChoice(choice);
                        if (isCorrect) {
                          setQuizScore((prev) => prev + 25);
                          if (onRewardXP) onRewardXP(25);
                          handleSpeak(currentQuizItem.correct);
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all font-black text-sm sm:text-base flex items-center justify-between cursor-pointer ${
                        !selectedQuizChoice
                          ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                          : isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                          : isSelected
                          ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'opacity-40'
                      }`}
                    >
                      <span>{choice}</span>
                      {selectedQuizChoice && (
                        <span>{isCorrect ? '✅ DOĞRU!' : isSelected ? '❌ HATA' : ''}</span>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Açıklama ve Sonraki Butonu */}
            {selectedQuizChoice && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1.5 animate-fade-in">
                <div className="font-black">💡 50 Yıllık Hoca Püf Noktası:</div>
                <p>{currentQuizItem.whyWrong}</p>
                <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                  {currentQuizItem.teacherSecret}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedQuizChoice(null);
                setQuizIndex((prev) => (prev + 1) % PITFALL_DATABASE.length);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Sonraki Tuzak Sorusu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
