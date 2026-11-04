import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Mic,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Flame,
  Award,
  Play,
  Check,
  ChevronRight,
  Smile,
  Compass,
  MessageSquare
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';

export interface DialogueExchange {
  id: string;
  speaker: 'npc' | 'user';
  speakerName: string;
  avatar: string;
  fullEn: string;
  fullTr: string;
  // Boşluk doldurma alanları
  blankTemplateEn?: string; // örn: "Excuse me, I am looking for [BLANK1]. Can you [BLANK2] me?"
  blanks?: {
    id: string;
    correctWord: string;
    options: string[];
  }[];
  explanationTr?: string;
}

export interface StoryAdventure {
  id: string;
  titleEn: string;
  titleTr: string;
  tag: string;
  level: string;
  emoji: string;
  bgGradient: string;
  synopsisTr: string;
  exchanges: DialogueExchange[];
}

export interface ChirmoStoryDialogueStudioProps {
  onBackToHome?: () => void;
}

export const ChirmoStoryDialogueStudio: React.FC<ChirmoStoryDialogueStudioProps> = ({
  onBackToHome
}) => {
  // ==================== ZENGİN HİKAYELER LİSTESİ ====================
  const STORIES: StoryAdventure[] = [
    {
      id: 'story-cafe',
      titleEn: 'The Mysterious Cafe in London',
      titleTr: 'Londra\'da Gizemli Kafe',
      tag: 'Gizem & Günlük Konuşma',
      level: 'A1 - A2 Başlangıç',
      emoji: '☕ 🕵️',
      bgGradient: 'from-amber-600 via-orange-600 to-rose-600',
      synopsisTr: 'Londra\'da yağmurlu bir akşam. Sıcak bir fincan kahve içmek ve haritadaki gizemli sokağı bulmak için kafeye giriyorsun.',
      exchanges: [
        {
          id: 'ex-1',
          speaker: 'npc',
          speakerName: 'Barista Oliver',
          avatar: '👨‍🍳',
          fullEn: 'Good evening! Welcome to Baker Street Cafe. How can I help you today?',
          fullTr: 'İyi akşamlar! Baker Street Kafe\'ye hoş geldiniz. Bugün size nasıl yardımcı olabilirim?',
          explanationTr: 'Kafelerde garsonlar her zaman bu nazik karşılama kalıbıyla söze başlar.'
        },
        {
          id: 'ex-2',
          speaker: 'user',
          speakerName: 'Sen (Kahraman)',
          avatar: '🧑',
          fullEn: 'Good evening! I want a cup of hot coffee, please.',
          fullTr: 'İyi akşamlar! Bir fincan sıcak kahve istiyorum lütfen.',
          blankTemplateEn: 'Good evening! I [BLANK1] a cup of hot coffee, [BLANK2].',
          blanks: [
            { id: 'b1', correctWord: 'want', options: ['want', 'am', 'like'] },
            { id: 'b2', correctWord: 'please', options: ['please', 'now', 'hello'] }
          ],
          explanationTr: '"I want..." kalıbı istek bildirmek için en temel yapıdır; cümlenin sonuna "please" eklemek ise İngiliz kültüründe vazgeçilmez nezakettir.'
        },
        {
          id: 'ex-3',
          speaker: 'npc',
          speakerName: 'Barista Oliver',
          avatar: '👨‍🍳',
          fullEn: 'Certainly! With milk or black? And would you like something to eat?',
          fullTr: 'Kesinlikle! Sütlü mü yoksa sade mi? Yanında yiyecek bir şey ister misiniz?',
          explanationTr: '"With milk or black?" sorusu kahve siparişlerinde en sık duyacağın sorudur.'
        },
        {
          id: 'ex-4',
          speaker: 'user',
          speakerName: 'Sen (Kahraman)',
          avatar: '🧑',
          fullEn: 'Black coffee, please. Also, where is the nearest museum?',
          fullTr: 'Sade kahve lütfen. Ayrıca, en yakın müze nerede?',
          blankTemplateEn: 'Black coffee, please. Also, [BLANK1] is the nearest museum?',
          blanks: [
            { id: 'b1', correctWord: 'where', options: ['where', 'what', 'who'] }
          ],
          explanationTr: 'Bir yerin konumunu sormak için her zaman "Where is...?" kalıbı kullanılır.'
        },
        {
          id: 'ex-5',
          speaker: 'npc',
          speakerName: 'Barista Oliver',
          avatar: '👨‍🍳',
          fullEn: 'The Sherlock Holmes Museum is just around the corner, two minutes on foot!',
          fullTr: 'Sherlock Holmes Müzesi hemen köşeyi dönünce, yürüyerek sadece iki dakika!',
          explanationTr: '"Just around the corner" İngilizcede "hemen köşede / çok yakın" anlamına gelen harika bir deyimdir.'
        },
        {
          id: 'ex-6',
          speaker: 'user',
          speakerName: 'Sen (Kahraman)',
          avatar: '🧑',
          fullEn: 'Thank you very much for your help! Have a wonderful evening!',
          fullTr: 'Yardımınız için çok teşekkür ederim! Harika bir akşam dilerim!',
          blankTemplateEn: 'Thank you very much [BLANK1] your help! Have a wonderful evening!',
          blanks: [
            { id: 'b1', correctWord: 'for', options: ['for', 'to', 'with'] }
          ],
          explanationTr: '"Thank you for your help" (Yardımın için teşekkürler) kalıbında her zaman "for" edatı kullanılır.'
        }
      ]
    },
    {
      id: 'story-airport',
      titleEn: 'Lost Luggage at Heathrow Airport',
      titleTr: 'Heathrow\'da Kayıp Valiz',
      tag: 'Seyahat & Macera',
      level: 'A2 Günlük Yaşam',
      emoji: '✈️ 🧳',
      bgGradient: 'from-blue-600 via-indigo-600 to-purple-600',
      synopsisTr: 'Uçaktan indin ancak bantta valizin görünmüyor! Kayıp eşya ofisindeki memurla görüşüp valizini bulmalısın.',
      exchanges: [
        {
          id: 'air-1',
          speaker: 'npc',
          speakerName: 'Officer Sarah',
          avatar: '👮‍♀️',
          fullEn: 'Hello! This is Heathrow Lost Baggage Office. Can I help you?',
          fullTr: 'Merhaba! Burası Heathrow Kayıp Bagaj Ofisi. Size yardımcı olabilir miyim?',
          explanationTr: 'Havalimanı görevlileri sorunları dinlemek için "Can I help you?" kalıbını kullanır.'
        },
        {
          id: 'air-2',
          speaker: 'user',
          speakerName: 'Sen (Yolcu)',
          avatar: '🧑',
          fullEn: 'Hello! I have a problem. I cannot find my luggage.',
          fullTr: 'Merhaba! Bir problemim var. Bagajımı bulamıyorum.',
          blankTemplateEn: 'Hello! I [BLANK1] a problem. I [BLANK2] find my luggage.',
          blanks: [
            { id: 'b1', correctWord: 'have', options: ['have', 'do', 'am'] },
            { id: 'b2', correctWord: 'cannot', options: ['cannot', 'not', 'no'] }
          ],
          explanationTr: 'Sorun bildirirken "I have a problem" ve yapamadığımız durumlarda "I cannot / can\'t" kalıbı kurtarıcındır.'
        },
        {
          id: 'air-3',
          speaker: 'npc',
          speakerName: 'Officer Sarah',
          avatar: '👮‍♀️',
          fullEn: 'Do not worry! What color is your suitcase, and do you have your flight ticket?',
          fullTr: 'Endişelenmeyin! Valiziniz ne renk ve uçuş biletiniz yanınızda mı?',
          explanationTr: '"What color is...?" (Ne renktir?) ve "Do you have...?" (Sahip misiniz?) soru kalıplarıdır.'
        },
        {
          id: 'air-4',
          speaker: 'user',
          speakerName: 'Sen (Yolcu)',
          avatar: '🧑',
          fullEn: 'It is a large blue suitcase. Yes, here is my ticket.',
          fullTr: 'Büyük mavi bir bavul. Evet, işte bilet burada.',
          blankTemplateEn: 'It [BLANK1] a large blue suitcase. Yes, here [BLANK2] my ticket.',
          blanks: [
            { id: 'b1', correctWord: 'is', options: ['is', 'are', 'have'] },
            { id: 'b2', correctWord: 'is', options: ['is', 'are', 'was'] }
          ],
          explanationTr: 'Tekil nesneleri tanımlarken "It is..." ve bir şeyi uzatırken "Here is..." kalıbı kullanılır.'
        },
        {
          id: 'air-5',
          speaker: 'npc',
          speakerName: 'Officer Sarah',
          avatar: '👮‍♀️',
          fullEn: 'Great news! Your bag is on its way from terminal 2. It will arrive in ten minutes!',
          fullTr: 'Harika haber! Çantanız 2. terminalden geliyor. On dakika içinde burada olacak!',
          explanationTr: 'Gelecek zaman için "It will arrive..." (Gelecek/varacak) kalıbı kullanılır.'
        }
      ]
    },
    {
      id: 'story-kids-dino',
      titleEn: 'Kids: The Friendly Little Dinosaur',
      titleTr: 'Çocuklar: Sevimli Dinozorun Orman Macerası',
      tag: 'Çocuk & Eğlence',
      level: 'Kids / Pre-A1',
      emoji: '🦖 🌳',
      bgGradient: 'from-emerald-600 via-teal-600 to-green-600',
      synopsisTr: 'Ormanda kaybolan sevimli minik dinozor Dobby ile tanışıyorsun! Onun karnı çok aç ve evini arıyor.',
      exchanges: [
        {
          id: 'kd-1',
          speaker: 'npc',
          speakerName: 'Dino Dobby',
          avatar: '🦖',
          fullEn: 'Hello friend! I am Dobby. I love bananas! Are you friendly?',
          fullTr: 'Merhaba arkadaşım! Ben Dobby. Muzları çok severim! Sen dost musun?',
          explanationTr: 'Çocuklar kendini tanıtırken "I am..." ve sevdiklerini anlatırken "I love..." der.'
        },
        {
          id: 'kd-2',
          speaker: 'user',
          speakerName: 'Sen (Kahraman Çocuk)',
          avatar: '🧒',
          fullEn: 'Yes! I am your friend. I like green dinosaurs!',
          fullTr: 'Evet! Ben senin arkadaşınım. Yeşil dinozorları severim!',
          blankTemplateEn: 'Yes! I [BLANK1] your friend. I [BLANK2] green dinosaurs!',
          blanks: [
            { id: 'b1', correctWord: 'am', options: ['am', 'have', 'is'] },
            { id: 'b2', correctWord: 'like', options: ['like', 'sleep', 'go'] }
          ],
          explanationTr: '"I am your friend" (Ben senin arkadaşınım) ve "I like..." (Severim) kalıbı.'
        },
        {
          id: 'kd-3',
          speaker: 'npc',
          speakerName: 'Dino Dobby',
          avatar: '🦖',
          fullEn: 'Yay! Can we play together in the playground?',
          fullTr: 'Yaşasın! Oyun parkında birlikte oynayabilir miyiz?',
          explanationTr: '"Can we...?" birlikte bir şey yapmayı teklif ederken kullanılır.'
        },
        {
          id: 'kd-4',
          speaker: 'user',
          speakerName: 'Sen (Kahraman Çocuk)',
          avatar: '🧒',
          fullEn: 'Yes, we can play with a bouncy ball!',
          fullTr: 'Evet, zıplayan topla oynayabiliriz!',
          blankTemplateEn: 'Yes, we [BLANK1] play with a bouncy ball!',
          blanks: [
            { id: 'b1', correctWord: 'can', options: ['can', 'no', 'are'] }
          ],
          explanationTr: '"We can..." (Yapabiliriz) yapabilirlik ve eğlence kalıbıdır.'
        }
      ]
    }
  ];

  // Aktif Hikaye ve Adım Durumu
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-cafe');
  const [exchangeIndex, setExchangeIndex] = useState<number>(0);
  const [userBlanks, setUserBlanks] = useState<Record<string, string>>({});
  const [isExchangeComplete, setIsExchangeComplete] = useState<boolean>(false);
  const [storyCompleted, setStoryCompleted] = useState<boolean>(false);
  const [storyStars, setStoryStars] = useState<number>(() => {
    const saved = localStorage.getItem('chirmo_story_stars');
    return saved ? parseInt(saved, 10) : 40;
  });

  const activeStory = STORIES.find((s) => s.id === selectedStoryId) || STORIES[0];
  const currentExchange = activeStory.exchanges[exchangeIndex];

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSelectBlankWord = (blankId: string, word: string) => {
    setUserBlanks((prev) => ({
      ...prev,
      [blankId]: word
    }));
  };

  const handleVerifyExchange = () => {
    if (!currentExchange.blanks) return;

    // Tüm boşluklar doğru mu kontrol et
    const allCorrect = currentExchange.blanks.every(
      (b) => userBlanks[b.id] === b.correctWord
    );

    if (allCorrect) {
      setIsExchangeComplete(true);
      const nextStars = storyStars + 10;
      setStoryStars(nextStars);
      localStorage.setItem('chirmo_story_stars', nextStars.toString());
      handleSpeak(`Awesome! ${currentExchange.fullEn}`);
    } else {
      handleSpeak('Almost there! Try again.');
      alert('Küçük bir hata var, doğru kelimeleri tekrar seçmeyi dene!');
    }
  };

  const handleNextExchange = () => {
    setUserBlanks({});
    setIsExchangeComplete(false);
    if (exchangeIndex + 1 < activeStory.exchanges.length) {
      setExchangeIndex(exchangeIndex + 1);
    } else {
      setStoryCompleted(true);
      const nextStars = storyStars + 25;
      setStoryStars(nextStars);
      localStorage.setItem('chirmo_story_stars', nextStars.toString());
      handleSpeak('Congratulations! You completed this story adventure!');
    }
  };

  const handleRestartStory = (storyId?: string) => {
    if (storyId) setSelectedStoryId(storyId);
    setExchangeIndex(0);
    setUserBlanks({});
    setIsExchangeComplete(false);
    setStoryCompleted(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto">
      {/* ÜST AFİŞ */}
      <div className={`bg-gradient-to-r ${activeStory.bgGradient} text-white p-5 sm:p-7 shadow-lg`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>İnteraktif Rol Yapma & Diyalog Tiyatrosu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center space-x-2">
              <span>{activeStory.titleTr}</span>
              <span className="text-xl">{activeStory.emoji}</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              {activeStory.synopsisTr}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-xs">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/80">Hikaye Yıldızları</div>
                <div className="text-base font-black">{storyStars} ⭐</div>
              </div>
            </div>

            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3.5 py-2.5 rounded-2xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
              >
                ← Ana Sayfa
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 space-y-6">
        {/* HİKAYE SEÇİCİ KARTLARI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STORIES.map((story) => {
            const isSelected = story.id === selectedStoryId;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => handleRestartStory(story.id)}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-400 scale-102'
                    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{story.emoji}</span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {story.level}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {story.titleTr}
                  </div>
                  <div className="text-[11px] text-slate-500 font-bold">
                    {story.titleEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ==================== HİKAYE TAMAMLANDI EKRANI ==================== */}
        {storyCompleted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-400 shadow-xl text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-4xl shadow-md animate-bounce">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tebrikler! Hikaye Başarıyla Tamamlandı!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              "{activeStory.titleTr}" macerasındaki tüm karşılıklı diyalogları tamamladın ve gerçek hayat İngilizcesini sesli konuştun!
            </p>
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-sm">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>+35 Ekstra Hikaye Yıldızı Kazandın! ⭐</span>
            </div>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleRestartStory()}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Bu Hikayeyi Tekrar Canlandır 🔄
              </button>
            </div>
          </div>
        ) : (
          /* ==================== AKTİF DİYALOG KARTI ==================== */
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* İlerleme Çubuğu */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                  Diyalog Adımı: {exchangeIndex + 1} / {activeStory.exchanges.length}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400">
                {currentExchange.speaker === 'npc' ? '🎙️ Karşı Taraf Konuşuyor' : '✍️ Sıra Sende: Boşluğu Doldur'}
              </div>
            </div>

            {/* DİYALOG SAHNESİ */}
            <div className="space-y-4">
              {/* Önceki diyalog geçmişi (bağlamı görmek için) */}
              {exchangeIndex > 0 && (
                <div className="space-y-2 opacity-60">
                  <div className="text-[11px] font-black uppercase text-slate-400">Önceki Konuşma:</div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                    "{activeStory.exchanges[exchangeIndex - 1].fullEn}" ({activeStory.exchanges[exchangeIndex - 1].fullTr})
                  </div>
                </div>
              )}

              {/* MEVCUT ADIM: NPC İSE */}
              {currentExchange.speaker === 'npc' && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-indigo-100 dark:border-slate-700 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xs">
                      {currentExchange.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-black text-indigo-600">{currentExchange.speakerName}</div>
                      <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        "{currentExchange.fullEn}"
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 font-medium">
                        {currentExchange.fullTr}
                      </div>
                    </div>
                  </div>

                  {currentExchange.explanationTr && (
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 text-xs text-indigo-950 dark:text-indigo-200 border border-indigo-100 dark:border-slate-700">
                      <span className="font-black">💡 Püf Noktası: </span>
                      {currentExchange.explanationTr}
                    </div>
                  )}

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSpeak(currentExchange.fullEn)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Sesli Dinle</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextExchange}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <span>Cevap Vermeye Geç →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MEVCUT ADIM: KULLANICI (BOŞLUK DOLDURMA) */}
              {currentExchange.speaker === 'user' && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 to-rose-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-200 dark:border-slate-700 space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-xs">
                      {currentExchange.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-700 dark:text-amber-400">
                        {currentExchange.speakerName} • Sıra Sende!
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Cümleyi tamamlayarak hikayeyi devam ettir:
                      </div>
                    </div>
                  </div>

                  {/* Boşluklu Cümle Görünümü */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 space-y-2">
                    <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                      {currentExchange.blanks && currentExchange.blankTemplateEn ? (
                        <span>
                          {currentExchange.blankTemplateEn.split(/\[BLANK\d+\]/).map((part, index, array) => {
                            const blankId = `b${index + 1}`;
                            const chosenWord = userBlanks[blankId];
                            return (
                              <React.Fragment key={index}>
                                {part}
                                {index < array.length - 1 && (
                                  <span
                                    className={`inline-block px-3 py-1 mx-1.5 rounded-xl border-2 text-sm font-black transition-all ${
                                      chosenWord
                                        ? isExchangeComplete
                                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                                          : 'bg-indigo-100 border-indigo-400 text-indigo-900'
                                        : 'bg-amber-100 border-dashed border-amber-400 text-amber-700 min-w-[70px] text-center'
                                    }`}
                                  >
                                    {chosenWord || '___?___'}
                                  </span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </span>
                      ) : (
                        <span>"{currentExchange.fullEn}"</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                      Türkçesi: "{currentExchange.fullTr}"
                    </div>
                  </div>

                  {/* Boşluklar İçin Seçenek Butonları */}
                  {currentExchange.blanks && !isExchangeComplete && (
                    <div className="space-y-3">
                      {currentExchange.blanks.map((b, bIdx) => (
                        <div key={b.id} className="space-y-1.5">
                          <span className="text-xs font-black text-slate-500">
                            Boşluk {bIdx + 1} için doğru kelimeyi seç:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {b.options.map((opt) => {
                              const isSelected = userBlanks[b.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleSelectBlankWord(b.id, opt)}
                                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Doğrulama & Devam Et Butonları */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {!isExchangeComplete ? (
                      <button
                        type="button"
                        onClick={handleVerifyExchange}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        <span>Cevabı Kontrol Et & Konuş 🎯</span>
                      </button>
                    ) : (
                      <div className="space-y-3 w-full animate-fade-in">
                        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-black flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Harika! Cümleyi kusursuz tamamladın. (+10 Hikaye Yıldızı)</span>
                        </div>

                        {currentExchange.explanationTr && (
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                            <span className="font-black text-indigo-600">Pedagojik Not: </span>
                            {currentExchange.explanationTr}
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => handleSpeak(currentExchange.fullEn)}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>Tam Cümleyi Dinle</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleNextExchange}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <span>Sonraki Diyaloğa Geç →</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChirmoStoryDialogueStudio;
