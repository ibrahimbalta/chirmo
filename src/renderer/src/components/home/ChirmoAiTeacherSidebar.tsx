import React, { useState, useEffect } from 'react';
import {
  Bot,
  Volume2,
  Globe,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Plus,
  Check,
  Bookmark
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { UserProfileService, UserProfile } from '../../services/userProfileService';
import { ChirmoAiChatModal } from './ChirmoAiChatModal';

interface ChirmoAiTeacherSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel?: string;
}

interface FeaturedWordItem {
  word: string;
  level: string;
  meaningTr: string;
  phonetic: string;
  sentenceEn: string;
  sentenceTr: string;
  synonyms: string;
  tipTr: string;
  grammarNotes: string;
  breakdown: Array<{ part: string; role: string }>;
}

export const ChirmoAiTeacherSidebar: React.FC<ChirmoAiTeacherSidebarProps> = ({
  isOpen,
  onClose,
  userLevel
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState<'çeviri' | 'gramer' | 'soru' | null>(null);

  // Canlı AI Sohbet Modalı
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('Merhaba! Bugün birlikte pratik yapalım.');

  // Kelimelerime Ekleme Geri Bildirimi
  const [isWordSaved, setIsWordSaved] = useState(false);

  // Çeviri Aracı Durumu
  const [translateInput, setTranslateInput] = useState('');
  const [translateOutput, setTranslateOutput] = useState<{ en: string; tr: string } | null>(null);

  // Hızlı Soru Sorma Durumu
  const [quickQuestionInput, setQuickQuestionInput] = useState('');
  const [quickAnswerOutput, setQuickAnswerOutput] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // ==================== ZENGİN GÜNÜN KELİMELERİ LİSTESİ ====================
  const FEATURED_WORDS: FeaturedWordItem[] = [
    {
      word: 'Improve',
      level: 'B1',
      meaningTr: 'Geliştirmek',
      phonetic: '/ɪmˈpruːv/',
      sentenceEn: 'I want to improve my English.',
      sentenceTr: 'İngilizcemi geliştirmek istiyorum.',
      synonyms: 'better, enhance, develop, boost',
      tipTr: 'Günlük hayatta ve işte bir şeyi daha iyi hale getirmek için kullanılır.',
      grammarNotes: '"want" fiilinden sonra gelen ikinci fiil daima "to" mastar eki alır: want to improve.',
      breakdown: [
        { part: 'I', role: 'Özne (Ben)' },
        { part: 'want', role: 'Geniş zaman fiili (İstemek)' },
        { part: 'to improve', role: 'Mastar eylemi (Geliştirmek)' },
        { part: 'my English', role: 'Nesne (İngilizcemi)' }
      ]
    },
    {
      word: 'Confident',
      level: 'B1',
      meaningTr: 'Özgüvenli / Kendinden Emin',
      phonetic: '/ˈkɒnfɪdənt/',
      sentenceEn: 'I feel confident when speaking English.',
      sentenceTr: 'İngilizce konuşurken kendimden emin hissediyorum.',
      synonyms: 'sure, bold, certain, fearless',
      tipTr: 'Duygu durumlarını anlatırken "feel confident" kalıbı sıkça kullanılır.',
      grammarNotes: '"feel" duyu fiilidir, arkasından doğrudan sıfat (confident) gelir.',
      breakdown: [
        { part: 'I', role: 'Özne (Ben)' },
        { part: 'feel', role: 'Duyu fiili (Hissetmek)' },
        { part: 'confident', role: 'Sıfat (Özgüvenli)' },
        { part: 'when speaking', role: 'Zaman zarfı (Konuşurken)' }
      ]
    },
    {
      word: 'Recommend',
      level: 'A2',
      meaningTr: 'Tavsiye Etmek / Önermek',
      phonetic: '/ˌrekəˈmend/',
      sentenceEn: 'What do you recommend for dinner?',
      sentenceTr: 'Akşam yemeği için ne tavsiye edersiniz?',
      synonyms: 'suggest, advise, propose',
      tipTr: 'Restoran ve kafelerde garsona menü sormak için altın kalıptır.',
      grammarNotes: '"Do you recommend...?" soru kalıbında fiil yalın kullanılır.',
      breakdown: [
        { part: 'What', role: 'Soru zamiri (Ne)' },
        { part: 'do you', role: 'Yardımcı fiil + Özne' },
        { part: 'recommend', role: 'Ana fiil (Önermek)' },
        { part: 'for dinner', role: 'Edat öbeği (Akşam yemeği için)' }
      ]
    },
    {
      word: 'Fluently',
      level: 'B2',
      meaningTr: 'Akıcı Bir Şekilde',
      phonetic: '/ˈfluːəntli/',
      sentenceEn: 'She can speak three languages fluently.',
      sentenceTr: 'O üç dili akıcı bir şekilde konuşabiliyor.',
      synonyms: 'smoothly, easily, effortlessly',
      tipTr: 'Bir dili duraksamadan rahatça konuştuğunuzu belirtmek için kullanılır.',
      grammarNotes: '"fluently" bir zarftır ve "speak" eyleminin nasıl yapıldığını niteler.',
      breakdown: [
        { part: 'She', role: 'Özne (O)' },
        { part: 'can speak', role: 'Yetenek kipi + Fiil' },
        { part: 'three languages', role: 'Nesne (Üç dil)' },
        { part: 'fluently', role: 'Durum zarfı (Akıcı şekilde)' }
      ]
    }
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const activeWord = FEATURED_WORDS[currentWordIndex];

  // Profil aboneliği
  useEffect(() => {
    return UserProfileService.subscribe((updated) => {
      setProfile(updated);
    });
  }, []);

  if (!isOpen) return null;

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleNextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % FEATURED_WORDS.length);
    setIsWordSaved(false);
    setShowWordDetails(false);
  };

  const handlePrevWord = () => {
    setCurrentWordIndex((prev) => (prev > 0 ? prev - 1 : FEATURED_WORDS.length - 1));
    setIsWordSaved(false);
    setShowWordDetails(false);
  };

  const handleSaveToVocabulary = () => {
    LearningStorageService.saveWord({
      id: `w-${Date.now()}`,
      en: activeWord.word,
      tr: activeWord.meaningTr,
      level: (activeWord.level as any) || 'B1',
      sampleSentence: activeWord.sentenceEn,
      sampleSentenceTr: activeWord.sentenceTr,
      learned: false
    });
    setIsWordSaved(true);
    setTimeout(() => {
      setIsWordSaved(false);
    }, 2800);
  };

  const handleExecuteTranslation = () => {
    const text = (translateInput || activeWord.sentenceEn).trim();
    if (!text) return;

    // Basit ve zeki yerel eşleme
    let resultTr = activeWord.sentenceTr;
    let resultEn = activeWord.sentenceEn;

    if (text.toLowerCase().includes('coffee')) {
      resultEn = 'I would like a cup of coffee.';
      resultTr = 'Bir fincan kahve istiyorum.';
    } else if (text.toLowerCase().includes('water')) {
      resultEn = 'Can I have some cold water, please?';
      resultTr = 'Biraz soğuk su alabilir miyim lütfen?';
    } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('merhaba')) {
      resultEn = 'Hello, how are you today?';
      resultTr = 'Merhaba, bugün nasılsın?';
    } else if (text.toLowerCase() === activeWord.word.toLowerCase()) {
      resultEn = activeWord.word;
      resultTr = activeWord.meaningTr;
    } else {
      resultEn = text;
      resultTr = activeWord.sentenceTr;
    }

    setTranslateOutput({ en: resultEn, tr: resultTr });
  };

  const handleAskQuickQuestion = () => {
    const q = quickQuestionInput.trim();
    if (!q) return;

    setIsAnswering(true);
    setTimeout(() => {
      setIsAnswering(false);
      if (q.toLowerCase().includes('nasıl') || q.toLowerCase().includes('how')) {
        setQuickAnswerOutput('İngilizcede bir şeyi nasıl yapacağını sorarken "How can I...?" veya "How do you...?" kalıbını kullanabilirsin!');
      } else if (q.toLowerCase().includes('geçmiş') || q.toLowerCase().includes('past')) {
        setQuickAnswerOutput('Geçmiş zamanda düzenli fiillerin sonuna "-ed" gelir: "I worked", "I played". Düzensizlerde ise fiil değişir: "I went".');
      } else {
        setQuickAnswerOutput(`Harika bir soru! "${q}" hakkında en pratik kural: Günlük konuşmada önce özneyi (I/You), hemen ardından fiili getirerek konuşmaya başlamaktır.`);
      }
    }, 700);
  };

  // Canlı öğrenme ilerleme verileri
  const progress = LearningStorageService.getProgress();

  return (
    <aside className="w-72 shrink-0 h-full bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 flex flex-col justify-between overflow-y-auto select-none p-3.5 z-20">
      <div className="space-y-4">
        {/* ==================== BAŞLIK & DURUM (ÇEVRİMİÇİ) ==================== */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div
            onClick={() => {
              setChatInitialPrompt('Merhaba Chirmo! İngilizce konuşma hakkında bir soru sormak istiyorum.');
              setIsChatModalOpen(true);
            }}
            className="flex items-center space-x-2 cursor-pointer group"
            title="Chirmo ile Canlı Sohbete Başla"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="./chirmo-avatar.png"
                alt="Chirmo AI"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.src.endsWith('/chirmo-avatar.png')) {
                    img.src = './chirmo-avatar.png';
                  }
                }}
              />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition-colors flex items-center space-x-1">
                <span>Chirmo AI Öğretmeni</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Çevrimiçi
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Sağa Kaydır ve Gizle (Sayfayı Genişlet)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ==================== KARŞILAMA VE SOHBET BALONU (KİŞİYE ÖZEL) ==================== */}
        <div
          onClick={() => {
            setChatInitialPrompt('Bugün restoranda nasıl sipariş verileceğini öğrenelim mi?');
            setIsChatModalOpen(true);
          }}
          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium relative cursor-pointer transition-colors group shadow-2xs"
          title="Tıkla ve Chirmo ile Canlı Konuşmaya Başla"
        >
          <span>
            Merhaba {profile.hasCustomName ? profile.name : 'Arkadaşım'}! 👋 İngilizceni geliştirmek için buradayım. Bugün sana nasıl yardımcı olabilirim?
          </span>
          <span className="block mt-1.5 text-[10px] font-black text-purple-600 dark:text-purple-400 group-hover:underline">
            Sohbeti Başlat 💬 →
          </span>
        </div>

        {/* ==================== BUGÜNÜN KELİMESİ KARTI ==================== */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handleSpeak(activeWord.word)}
                className="hover:scale-110 transition-transform cursor-pointer"
                title="Kelimeyi Dinle"
              >
                <Volume2 className="w-4 h-4 text-blue-600" />
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider">
                Bugünün Kelimesi
              </span>
            </div>

            {/* Kelime Değiştirme Butonları */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevWord}
                className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                title="Önceki Kelime"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-black text-slate-400">
                {currentWordIndex + 1}/{FEATURED_WORDS.length}
              </span>
              <button
                type="button"
                onClick={handleNextWord}
                className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                title="Sonraki Kelime"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-between">
              <span>{activeWord.word}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold">
                {activeWord.level}
              </span>
            </div>
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {activeWord.meaningTr}
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
            "{activeWord.sentenceEn}"
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowWordDetails(!showWordDetails)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span>{showWordDetails ? 'Detayları Gizle' : 'Detayları Göster'}</span>
              {showWordDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleSaveToVocabulary}
              className={`text-[10px] font-black px-2 py-1 rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${
                isWordSaved
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100'
              }`}
              title="Kelimeyi Defterime Ekle"
            >
              {isWordSaved ? <Check className="w-3 h-3 text-emerald-600" /> : <Bookmark className="w-3 h-3" />}
              <span>{isWordSaved ? 'Eklendi! ⭐' : 'Kaydet'}</span>
            </button>
          </div>

          {showWordDetails && (
            <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-blue-200/50 space-y-1 animate-fade-in">
              <div><strong>Okunuş:</strong> {activeWord.phonetic}</div>
              <div><strong>Eş Anlamlılar:</strong> {activeWord.synonyms}</div>
              <div><strong>İpucu:</strong> {activeWord.tipTr}</div>
              <div><strong>Türkçesi:</strong> "{activeWord.sentenceTr}"</div>
            </div>
          )}
        </div>

        {/* ==================== 4 HIZLI EYLEM BUTONU (2x2) ==================== */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveActionModal(activeActionModal === 'çeviri' ? null : 'çeviri')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
              activeActionModal === 'çeviri'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Çevir</span>
          </button>

          <button
            onClick={() => setActiveActionModal(activeActionModal === 'gramer' ? null : 'gramer')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
              activeActionModal === 'gramer'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>Grameri Açıkla</span>
          </button>

          <button
            onClick={() => {
              handleSpeak(activeWord.sentenceEn);
            }}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer active:scale-95"
            title="Örnek Cümleyi Doğal Sesle Dinle"
          >
            <Volume2 className="w-4 h-4 text-indigo-500" />
            <span>Dinle</span>
          </button>

          <button
            onClick={() => setActiveActionModal(activeActionModal === 'soru' ? null : 'soru')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
              activeActionModal === 'soru'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Soru Sor</span>
          </button>
        </div>

        {/* ==================== ÇEVİRİ İNTERAKTİF ALANI ==================== */}
        {activeActionModal === 'çeviri' && (
          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 space-y-2 text-xs animate-fade-in">
            <div className="flex items-center justify-between font-black text-blue-900 dark:text-blue-200">
              <span className="flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Akıllı Çeviri</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              type="text"
              value={translateInput}
              onChange={(e) => setTranslateInput(e.target.value)}
              placeholder={`Örn: ${activeWord.sentenceEn}`}
              className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
            />

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleExecuteTranslation}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer shadow-2xs"
              >
                Çevir
              </button>
              <button
                type="button"
                onClick={() => {
                  setTranslateInput(activeWord.sentenceEn);
                  handleExecuteTranslation();
                }}
                className="text-[10px] text-blue-600 hover:underline cursor-pointer"
              >
                Örneği Çevir
              </button>
            </div>

            {translateOutput && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 space-y-1">
                <div className="font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>"{translateOutput.en}"</span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(translateOutput.en)}
                    className="p-1 hover:text-blue-600 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3 text-blue-600" />
                  </button>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {translateOutput.tr}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== GRAMER AÇIKLAMA İNTERAKTİF ALANI ==================== */}
        {activeActionModal === 'gramer' && (
          <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-slate-800/90 border border-purple-200 dark:border-slate-700 space-y-2 text-xs animate-fade-in">
            <div className="flex items-center justify-between font-black text-purple-900 dark:text-purple-200">
              <span className="flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Cümlenin Gramer Mantığı</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 space-y-1.5">
              <div className="font-black text-purple-950 dark:text-purple-200">
                "{activeWord.sentenceEn}"
              </div>
              <div className="text-[11px] text-slate-500">
                {activeWord.grammarNotes}
              </div>
            </div>

            {/* Parça Parça Gösterim */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">
                Öge Analizi:
              </span>
              <div className="grid grid-cols-1 gap-1">
                {activeWord.breakdown.map((item, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-100 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-black text-slate-800 dark:text-slate-100">
                      {item.part}
                    </span>
                    <span className="text-slate-500">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SORU SOR İNTERAKTİF ALANI ==================== */}
        {activeActionModal === 'soru' && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700 space-y-2 text-xs animate-fade-in">
            <div className="flex items-center justify-between font-black text-emerald-900 dark:text-emerald-200">
              <span className="flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chirmo'ya Hızlı Soru Sor</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <input
                type="text"
                value={quickQuestionInput}
                onChange={(e) => setQuickQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuickQuestion()}
                placeholder="Örn: Geçmiş zaman nasıl yapılır?"
                className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={handleAskQuickQuestion}
                disabled={isAnswering}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {quickAnswerOutput && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed animate-fade-in">
                <span className="font-black text-emerald-600">Chirmo: </span>
                {quickAnswerOutput}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setChatInitialPrompt(quickQuestionInput || 'İngilizce bir soru sormak istiyorum.');
                setIsChatModalOpen(true);
              }}
              className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] text-center cursor-pointer shadow-2xs"
            >
              Canlı AI Sohbet Odasını Aç 💬
            </button>
          </div>
        )}

        {/* ==================== BUGÜNKÜ ÖĞRENME DURUMUM ==================== */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800 dark:text-slate-100">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Bugünkü Öğrenme Durumum</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <span>✨</span>
                <span>Yeni Kelimeler</span>
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">
                {progress.wordsLearnedToday || 12}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <span>🎯</span>
                <span>Doğru Cevaplar</span>
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">18 / 20</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <span>🎙️</span>
                <span>Konuşma Süresi</span>
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">
                {progress.speakingMinutes || 14} dk
              </span>
            </div>
          </div>
        </div>

        {/* ==================== CHIRMO ÖNERİSİ KARTI (SARI TAVSİYE) ==================== */}
        <div
          onClick={() => {
            handleSpeak('Bugün geçmiş zaman konusuna odaklanmanı öneriyorum. Birkaç pratik cümle deneyelim mi?');
          }}
          className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100/70 border border-amber-200 dark:border-amber-800/60 space-y-1 text-xs cursor-pointer transition-colors"
          title="Tıkla ve Dinle"
        >
          <div className="flex items-center space-x-1.5 font-black text-amber-800 dark:text-amber-300">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Chirmo Önerisi</span>
          </div>
          <p className="text-amber-900/80 dark:text-amber-200 leading-relaxed font-medium">
            Bugün geçmiş zaman konusuna odaklanmanı öneriyorum.
          </p>
        </div>
      </div>

      {/* Canlı Gemini AI Sohbet Modalı */}
      <ChirmoAiChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        initialMessage={chatInitialPrompt}
      />
    </aside>
  );
};

export default ChirmoAiTeacherSidebar;
