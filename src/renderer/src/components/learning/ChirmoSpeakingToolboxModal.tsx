import React, { useState } from 'react';
import { Volume2, X, Sparkles, Check, ChevronRight } from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService } from '../../services/targetLanguageService';

interface ChirmoSpeakingToolboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

type ToolboxTabId = 'sentence' | 'question' | 'request' | 'emotion' | 'connector';

interface ToolboxGear {
  id: ToolboxTabId;
  icon: string;
  name: string;
  subtitle: string;
  formula: string;
  description: string;
  tips: string;
  examples: {
    en: string;
    de: string;
    fr?: string;
    tr: string;
  }[];
}

export const ChirmoSpeakingToolboxModal: React.FC<ChirmoSpeakingToolboxModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [activeTab, setActiveTab] = useState<ToolboxTabId>('sentence');
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [practicedItems, setPracticedItems] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const targetLang = TargetLanguageService.getTargetLanguage();

  const gears: ToolboxGear[] = [
    {
      id: 'sentence',
      icon: '🗡️',
      name: 'Cümle Kılıcı',
      subtitle: 'Nasıl Cümle Kurulur?',
      formula: '[Özne / Kim?] + [Fiil / Eylem] + [Nesne / Neyi?]',
      description:
        'Yabancı dilde cümleler lego parçaları gibidir. Cümlenin omurgası her zaman bu değişmez 3 adımda ilerler. Önce cümlenin kahramanını, ardından yaptığı işi, en son nesneyi söyle.',
      tips: '💡 Cümleye asla fiil ile başlanmaz (emir cümleleri hariç). Daima "Kim?" sorusuyla başla.',
      examples: [
        {
          en: 'I play football every weekend.',
          de: 'Ich spiele jedes Wochenende Fußball.',
          fr: 'Je joue au football chaque week-end.',
          tr: 'Her hafta sonu futbol oynarım.'
        },
        {
          en: 'We drink fresh water every morning.',
          de: 'Wir trinken jeden Morgen frisches Wasser.',
          fr: 'Nous buvons de l\'eau fraîche chaque matin.',
          tr: 'Her sabah taze su içeriz.'
        },
        {
          en: 'She reads a great book in the library.',
          de: 'Sie liest ein tolles Buch in der Bibliothek.',
          fr: 'Elle lit un excellent livre à la bibliothèque.',
          tr: 'Kütüphanede harika bir kitap okuyor.'
        },
        {
          en: 'They watch the sunset together.',
          de: 'Sie schauen den Sonnenuntergang zusammen.',
          fr: 'Ils regardent le coucher de soleil ensemble.',
          tr: 'Birlikte gün batımını izliyorlar.'
        }
      ]
    },
    {
      id: 'question',
      icon: '❓',
      name: 'Soru Asası',
      subtitle: 'Nasıl Soru Sorulur?',
      formula: '[Soru Kelimesi / Wh-] + [Yardımcı Fiil / Do-Can] + [Özne] + [Fiil]?',
      description:
        'Soru sorarken yardımcı fiil (Do/Does/Did/Can/Will) öznenin hemen önüne geçer. Karşı tarafla iletişimi başlatan ve sohbeti devam ettiren en güçlü teçhizattır.',
      tips: '💡 "Evet/Hayır" sorularında yardımcı fiille başla ("Do you...?"). Detay istiyorsan Wh- kelimesini en başa koy ("Where do you...?").',
      examples: [
        {
          en: 'Do you like listening to music?',
          de: 'Hörst du gerne Musik?',
          fr: 'Aimes-tu écouter de la musique ?',
          tr: 'Müzik dinlemeyi sever misin?'
        },
        {
          en: 'Where are you going right now?',
          de: 'Wohin gehst du gerade?',
          fr: 'Où vas-tu en ce moment ?',
          tr: 'Şu an nereye gidiyorsun?'
        },
        {
          en: 'Can you help me with this task, please?',
          de: 'Kannst du mir bitte bei dieser Aufgabe helfen?',
          fr: 'Pouvez-vous m\'aider avec cette tâche, s\'il vous plaît ?',
          tr: 'Bu görevde bana yardım edebilir misin lütfen?'
        },
        {
          en: 'What is your favorite dish?',
          de: 'Was ist dein Lieblingsgericht?',
          fr: 'Quel est votre plat préféré ?',
          tr: 'En sevdiğin yemek nedir?'
        }
      ]
    },
    {
      id: 'request',
      icon: '🛡️',
      name: 'İstek Kalkanı',
      subtitle: 'İstek & Rica Kalıbı',
      formula: 'I would like to + [Fiil]  /  Can I have + [Nesne], please?',
      description:
        'Yurt dışında restoranda, kafede, otelde veya sokakta hayat kurtaran en nazik konuşma kalkanıdır. Asla kaba duran "I want" kalıbını kullanma; onun yerine "I would like" kalıbını kuşan.',
      tips: '💡 Cümlenin sonuna ekleyeceğin "please" kelimesi kapıları açar. "I would like a coffee, please."',
      examples: [
        {
          en: 'Can I have some water, please?',
          de: 'Kann ich bitte etwas Wasser haben?',
          fr: 'Pourrais-je avoir un peu d\'eau, s\'il vous plaît ?',
          tr: 'Biraz su alabilir miyim lütfen?'
        },
        {
          en: 'I would like to order a warm cappuccino.',
          de: 'Ich möchte einen warmen Cappuccino bestellen.',
          fr: 'Je voudrais commander un cappuccino chaud.',
          tr: 'Sıcak bir kapuçino sipariş etmek istiyorum.'
        },
        {
          en: 'Could you repeat that more slowly, please?',
          de: 'Könnten Sie das bitte langsamer wiederholen?',
          fr: 'Pourriez-vous répéter plus lentement, s\'il vous plaît ?',
          tr: 'Bunu lütfen biraz daha yavaş tekrar edebilir misiniz?'
        },
        {
          en: 'May I ask a quick question?',
          de: 'Darf ich eine kurze Frage stellen?',
          fr: 'Puis-je poser une petite question ?',
          tr: 'Kısa bir soru sorabilir miyim?'
        }
      ]
    },
    {
      id: 'emotion',
      icon: '🧪',
      name: 'Duygu İksiri',
      subtitle: 'Duygu & Fikir Belirtme',
      formula: 'I feel + [Duygu]  /  I think that + [Fikir]  /  I love + [Nesne]',
      description:
        'Diyaloğu robotik olmaktan çıkarıp sıcak bir sohbete dönüştüren iksirdir. Ne hissettiğini, ne düşündüğünü veya neyi sevip sevmediğini bu kalıpla açıkla.',
      tips: '💡 Kendi fikrini belirtirken "In my opinion" veya "I feel that..." ile başlamak seni doğal bir hatip yapar.',
      examples: [
        {
          en: 'I feel very energetic and confident today.',
          de: 'Ich fühle mich heute sehr energiegeladen und selbstbewusst.',
          fr: 'Je me sens très énergique et confiant aujourd\'hui.',
          tr: 'Bugün kendimi çok enerjik ve özgüvenli hissediyorum.'
        },
        {
          en: 'I think this is a fantastic adventure.',
          de: 'Ich denke, das ist ein fantastisches Abenteuer.',
          fr: 'Je pense que c\'est une aventure fantastique.',
          tr: 'Bence bu şahane bir macera.'
        },
        {
          en: 'I really love practicing speaking with Chirmo.',
          de: 'Ich liebe es wirklich, mit Chirmo Sprechen zu üben.',
          fr: 'J\'adore vraiment pratiquer l\'expression orale avec Chirmo.',
          tr: 'Chirmo ile konuşma pratiği yapmayı gerçekten çok seviyorum.'
        },
        {
          en: 'I believe we can master this language quickly.',
          de: 'Ich glaube, wir können diese Sprache schnell meistern.',
          fr: 'Je suis convaincu que nous pouvons maîtriser cette langue rapidement.',
          tr: 'Bu dilde çok hızlı ustalaşabileceğimize inanıyorum.'
        }
      ]
    },
    {
      id: 'connector',
      icon: '🧭',
      name: 'Zaman Pusulası',
      subtitle: 'Bağlaçlar & Cümle Köprüsü',
      formula: '[Cümle 1] + [Because / But / So / When / Although] + [Cümle 2]',
      description:
        'Kısa ve kopuk cümleleri birbirine bağlayıp akıcı bir konuşmaya dönüştüren sihirli köprüdür. A2 seviyesinden B2-C1 akıcılığına geçmenin sırrı bağlaçları refleks haline getirmektir.',
      tips: '💡 Sebep belirtmek için "because", zıtlık için "but", sonuç için "so", zaman için "when" kullan.',
      examples: [
        {
          en: 'I learn languages because I love discovering new cultures.',
          de: 'Ich lerne Sprachen, weil ich es liebe, neue Kulturen zu entdecken.',
          fr: 'J\'apprends des langues parce que j\'adore découvrir de nouvelles cultures.',
          tr: 'Yeni kültürler keşfetmeyi sevdiğim için dil öğreniyorum.'
        },
        {
          en: 'I am a bit tired, but I want to keep practicing.',
          de: 'Ich bin ein bisschen müde, aber ich möchte weiter üben.',
          fr: 'Je suis un peu fatigué, mais je veux continuer à pratiquer.',
          tr: 'Biraz yorgunum ama pratik yapmaya devam etmek istiyorum.'
        },
        {
          en: 'It was raining outside, so we decided to stay indoors.',
          de: 'Draußen regnete es, also beschlossen wir, drinnen zu bleiben.',
          fr: 'Il pleuvait dehors, alors nous avons décidé de rester à l\'intérieur.',
          tr: 'Dışarıda yağmur yağıyordu, bu yüzden içeride kalmaya karar verdik.'
        },
        {
          en: 'Call me immediately when you arrive at the airport.',
          de: 'Ruf mich sofort an, wenn du am Flughafen ankommst.',
          fr: 'Appelle-moi dès que tu arrives à l\'aéroport.',
          tr: 'Havalimanına vardığında beni hemen ara.'
        }
      ]
    }
  ];

  const currentGear = gears.find((g) => g.id === activeTab) || gears[0];

  const handleSpeakExample = (text: string) => {
    setPlayingText(text);
    LearningStorageService.speak(text);

    // Mark as practiced
    const nextPracticed = new Set(practicedItems);
    nextPracticed.add(text);
    setPracticedItems(nextPracticed);

    if (onRewardXP && nextPracticed.size % 3 === 0) {
      onRewardXP(15);
    }

    setTimeout(() => {
      setPlayingText(null);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-white dark:bg-[#11162b] border-2 border-amber-400/80 dark:border-amber-400/60 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-900 dark:text-white space-y-4 sm:space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* MODAL ÜST BAŞLIK */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0 border-2 border-white/60 dark:border-slate-800">
              🧰
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                  Ön Hazırlık & Teçhizat
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-amber-600 dark:text-amber-300">
                  5 Temel Konuşma Kalıbı
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate mt-0.5">
                <span>Konuşmacının Büyülü Alet Çantası & Teçhizat Sandığı</span>
                <span className="text-amber-500">⚔️</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                İstasyonlara başlamadan önce temel cümle iskeletlerini incele, sesli dinle ve kuşan!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white flex items-center justify-center cursor-pointer font-black text-sm shrink-0 transition-colors ml-2"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5 TEÇHİZAT SEKMESİ (BUTONLAR) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {gears.map((g) => {
            const isActive = activeTab === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveTab(g.id)}
                className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-300 text-slate-950 font-black border-amber-300 shadow-md scale-[1.02]'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">{g.icon}</span>
                <span className="text-xs font-black line-clamp-1">{g.name}</span>
                <span className={`text-[9px] line-clamp-1 ${isActive ? 'text-slate-900/80 font-bold' : 'opacity-70'}`}>
                  {g.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEÇİLİ TEÇHİZATIN DETAY KARTI */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-purple-400/30 space-y-4">
          {/* Başlık & Açıklama */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-300 font-black text-sm sm:text-base">
              <span>{currentGear.icon}</span>
              <span>{currentGear.name}: {currentGear.subtitle}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentGear.description}
            </p>
          </div>

          {/* Formül Kutusu */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-amber-100 via-orange-50 to-amber-50 dark:from-purple-950/70 dark:via-indigo-950/60 dark:to-purple-950/70 border border-amber-300/80 dark:border-purple-500/40 space-y-1">
            <div className="text-[10px] uppercase font-black tracking-wider text-amber-800 dark:text-purple-300">
              ⚡ Evrensel Konuşma Formülü
            </div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
              {currentGear.formula}
            </div>
          </div>

          {/* İpucu */}
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed">
            {currentGear.tips}
          </div>

          {/* Örnek Cümleler & Sesli Telaffuz */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Canlı Örnekler & Telaffuz ({targetLang === 'de' ? 'Almanca' : targetLang === 'fr' ? 'Fransızca' : 'İngilizce'})</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {practicedItems.size} dinlendi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentGear.examples.map((ex, idx) => {
                const targetText =
                  targetLang === 'de'
                    ? ex.de
                    : targetLang === 'fr'
                      ? (ex.fr || ex.en)
                      : ex.en;
                const isPlaying = playingText === targetText;
                const isDone = practicedItems.has(targetText);

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isPlaying
                        ? 'bg-amber-100/70 dark:bg-amber-500/20 border-amber-400 dark:border-amber-400 shadow-sm'
                        : 'bg-white dark:bg-black/30 border-slate-200/80 dark:border-white/10 hover:border-amber-300 dark:hover:border-white/25'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="font-black text-slate-900 dark:text-white text-xs sm:text-[13px] flex items-center gap-1.5">
                        {isDone && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        <span className="truncate">{targetText}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-pink-200/80 truncate">
                        {ex.tr}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeakExample(targetText)}
                      className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                        isPlaying
                          ? 'bg-amber-400 text-slate-950 scale-110 shadow-md animate-bounce'
                          : 'bg-amber-50 dark:bg-purple-500/20 text-amber-600 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-purple-500/40'
                      }`}
                      title="Sesli Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MODAL ALT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Kalıpları dinleyip zihninde tekrarla, istasyonlarda rahatça konuş!</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <span>Teçhizatımı Kuşandım, Başlayalım</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
