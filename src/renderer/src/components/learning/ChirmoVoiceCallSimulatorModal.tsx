import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Award,
  Flame,
  X,
  Languages,
  CheckCircle2,
  Clock,
  RotateCcw,
  Send
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { CampStorageService } from '../../services/curriculumData';
import { GeminiAiTeacherService } from '../../services/geminiAiTeacherService';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

export type CallScreenState = 'ringing' | 'in-call' | 'summary';

export interface ChirmoVoiceCallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
  topic?: string;
}

interface CallReplyOption {
  level: string;
  text: string;
  tr: string;
}

interface CallTurnStep {
  chirmoText: string;
  chirmoTr: string;
  replies: CallReplyOption[];
}

interface CallScenarioConfig {
  id: string;
  badge: string;
  title: string;
  callerTitle: string;
  turns: CallTurnStep[];
}

const CALL_SCENARIOS_BY_LANG: Record<SupportedLanguage, CallScenarioConfig[]> = {
  en: [
    {
      id: 'coffee',
      badge: '☕ Günlük Sohbet',
      title: '2 Dakikalık Kahve Molası Sohbeti',
      callerTitle: 'Chirmo AI • Günlük Konuşma Partnerin',
      turns: [
        {
          chirmoText: "Hey friend! It's Chirmo calling on my coffee break. How is your day going so far?",
          chirmoTr: 'Selam arkadaşım! Kahve molamda seni aradım. Günün şu ana kadar nasıl geçiyor?',
          replies: [
            {
              level: 'Kolay',
              text: 'My day is going great, thank you! How are you?',
              tr: 'Günüm harika geçiyor, teşekkürler! Sen nasılsın?'
            },
            {
              level: 'Doğal',
              text: 'Everything is going well today. I just took a short break to drink some coffee.',
              tr: 'Bugün her şey yolunda gidiyor. Kahve içmek için kısa bir mola verdim.'
            },
            {
              level: 'Akıcı',
              text: 'I have been quite busy with my daily tasks, but I am always happy to practice English with you!',
              tr: 'Günlük işlerimle oldukça meşguldüm ama seninle İngilizce pratik yapmaktan her zaman mutluyum!'
            }
          ]
        },
        {
          chirmoText: "I'm doing wonderful, thanks for asking! What is one nice thing you did or planned for today?",
          chirmoTr: 'Ben de harikayım, sorduğun için teşekkürler! Bugün yaptığın veya planladığın güzel bir şey var mı?',
          replies: [
            {
              level: 'Kolay',
              text: 'I went for a walk this morning and the weather was very nice.',
              tr: 'Bu sabah yürüyüşe çıktım ve hava çok güzeldi.'
            },
            {
              level: 'Doğal',
              text: 'I am planning to meet my friends this evening and watch a good movie.',
              tr: 'Bu akşam arkadaşlarımla buluşup güzel bir film izlemeyi planlıyorum.'
            },
            {
              level: 'Akıcı',
              text: 'I focused on improving my speaking skills today, and tonight I will cook my favorite dinner.',
              tr: 'Bugün konuşma becerilerimi geliştirmeye odaklandım, bu akşam da en sevdiğim yemeği yapacağım.'
            }
          ]
        },
        {
          chirmoText: 'That sounds like a fantastic plan! Before I head back, what would you like to drink or eat right now?',
          chirmoTr: 'Kulağa harika bir plan gibi geliyor! Kapatmadan önce, şu an ne içmek veya yemek isterdin?',
          replies: [
            {
              level: 'Kolay',
              text: 'I would like a hot cup of coffee with milk, please.',
              tr: 'Sütlü sıcak bir fincan kahve isterdim lütfen.'
            },
            {
              level: 'Doğal',
              text: 'A fresh cup of tea and a piece of chocolate cake would be perfect right now.',
              tr: 'Taze bir bardak çay ve bir dilim çikolatalı kek şu an mükemmel olurdu.'
            },
            {
              level: 'Akıcı',
              text: 'Honestly, an iced latte would give me great energy for the rest of the afternoon!',
              tr: 'Açıkçası soğuk bir latte öğleden sonranın geri kalanı için bana harika enerji verirdi!'
            }
          ]
        },
        {
          chirmoText: 'Awesome choice! You spoke so clearly on the phone today. Shall we talk again tomorrow at the same time?',
          chirmoTr: 'Harika seçim! Bugün telefonda çok net konuştun. Yarın aynı saatte tekrar konuşalım mı?',
          replies: [
            {
              level: 'Kolay',
              text: 'Yes, sure! See you tomorrow, have a nice day!',
              tr: 'Evet, elbette! Yarın görüşürüz, iyi günler!'
            },
            {
              level: 'Doğal',
              text: 'Definitely! Thank you for calling me, talk to you tomorrow.',
              tr: 'Kesinlikle! Beni aradığın için teşekkürler, yarın görüşmek üzere.'
            },
            {
              level: 'Akıcı',
              text: 'I would love that! Practicing on the phone really boosts my confidence. Bye for now!',
              tr: 'Çok sevinirim! Telefonda pratik yapmak özgüvenimi gerçekten artırıyor. Şimdilik hoşça kal!'
            }
          ]
        }
      ]
    },
    {
      id: 'interview',
      badge: '💼 İş & Mülakat',
      title: 'Hızlı Telefon Mülakatı (İK Ön Görüşme)',
      callerTitle: 'Chirmo HR • Uluslararası Kariyer Koçu',
      turns: [
        {
          chirmoText: 'Hello! Thank you for taking my call. Could you briefly introduce yourself and tell me what you do?',
          chirmoTr: 'Merhaba! Aramamı yanıtladığınız için teşekkürler. Kısaca kendinizi tanıtıp ne iş yaptığınızı anlatır mısınız?',
          replies: [
            {
              level: 'Kolay',
              text: 'Hello! I am a dedicated professional and I love learning new skills.',
              tr: 'Merhaba! İşine bağlı bir profesyonelim ve yeni beceriler öğrenmeyi seviyorum.'
            },
            {
              level: 'Doğal',
              text: 'Hi! I have experience in project management and I enjoy working with international teams.',
              tr: 'Merhaba! Proje yönetimi konusunda deneyimim var ve uluslararası ekiplerle çalışmaktan keyif alıyorum.'
            },
            {
              level: 'Akıcı',
              text: 'Pleasure speaking with you! I focus on solving problems efficiently and delivering high-quality results.',
              tr: 'Sizinle konuşmak büyük memnuniyet! Sorunları verimli çözmeye ve yüksek kaliteli sonuçlar üretmeye odaklanıyorum.'
            }
          ]
        },
        {
          chirmoText: 'Impressive background! What would you say is your biggest strength at work?',
          chirmoTr: 'Etkileyici bir geçmiş! İş hayatındaki en güçlü yönünüzün ne olduğunu söylersiniz?',
          replies: [
            {
              level: 'Kolay',
              text: 'My biggest strength is communication and teamwork.',
              tr: 'En güçlü yönüm iletişim ve takım çalışmasıdır.'
            },
            {
              level: 'Doğal',
              text: 'I stay calm under pressure and always find practical solutions on time.',
              tr: 'Baskı altında sakin kalırım ve her zaman zamanında pratik çözümler bulurum.'
            },
            {
              level: 'Akıcı',
              text: 'I adapt quickly to new technologies and communicate clearly with both clients and teammates.',
              tr: 'Yeni teknolojilere hızla uyum sağlarım ve hem müşterilerle hem ekip arkadaşlarımla net iletişim kurarım.'
            }
          ]
        },
        {
          chirmoText: 'That is exactly what teams look for! When would you be available for a follow-up video meeting?',
          chirmoTr: 'Ekiplerin aradığı tam olarak bu! İkinci bir görüntülü görüşme için ne zaman müsait olursunuz?',
          replies: [
            {
              level: 'Kolay',
              text: 'I am available tomorrow afternoon at two o’clock.',
              tr: 'Yarın öğleden sonra saat ikide müsaitim.'
            },
            {
              level: 'Doğal',
              text: 'Any time on Thursday or Friday morning works great for my schedule.',
              tr: 'Perşembe veya Cuma sabahı herhangi bir saat takvimim için çok uygun.'
            },
            {
              level: 'Akıcı',
              text: 'I am flexible this week; please send me a calendar invite and I will gladly join.',
              tr: 'Bu hafta programım esnek; bana takvim daveti gönderebilirsiniz, memnuniyetle katılırım.'
            }
          ]
        }
      ]
    },
    {
      id: 'travel',
      badge: '✈️ Otel & Seyahat',
      title: 'Otel Resepsiyonu & Rezervasyon Araması',
      callerTitle: 'Grand Hotel London • Resepsiyon Hattı',
      turns: [
        {
          chirmoText: 'Good afternoon, Grand Hotel reception speaking! How may I help you with your stay today?',
          chirmoTr: 'Tünaydın, Grand Hotel resepsiyonu! Bugün konaklamanız için size nasıl yardımcı olabilirim?',
          replies: [
            {
              level: 'Kolay',
              text: 'Hello, I would like to book a double room for two nights, please.',
              tr: 'Merhaba, iki gecelik çift kişilik bir oda ayırtmak istiyorum lütfen.'
            },
            {
              level: 'Doğal',
              text: 'Hi! I have a reservation for tonight and I wanted to ask if breakfast is included.',
              tr: 'Merhaba! Bu akşam için rezervasyonum var, kahvaltının dahil olup olmadığını sormak istedim.'
            },
            {
              level: 'Akıcı',
              text: 'Good afternoon! Could I request an early check-in and a quiet room with a city view?',
              tr: 'Tünaydın! Erken giriş ve şehir manzaralı sessiz bir oda rica edebilir miyim?'
            }
          ]
        },
        {
          chirmoText: 'Certainly! Breakfast is included from 7 AM to 10 AM, and we have prepared a lovely room for you. What time will you arrive?',
          chirmoTr: 'Elbette! Sabah 07:00-10:00 arası kahvaltı dahildir ve sizin için güzel bir oda hazırladık. Saat kaçta varacaksınız?',
          replies: [
            {
              level: 'Kolay',
              text: 'I will arrive at the hotel around four o’clock.',
              tr: 'Otele saat dört civarında varacağım.'
            },
            {
              level: 'Doğal',
              text: 'My flight lands at two, so I should be at the reception by three thirty.',
              tr: 'Uçağım saat ikide iniyor, bu yüzden üç buçuk gibi resepsiyonda olurum.'
            },
            {
              level: 'Akıcı',
              text: 'We are taking the airport train now and will check in within forty-five minutes. Thank you!',
              tr: 'Şu an havalimanı trenine biniyoruz, kırk beş dakika içinde giriş yapacağız. Teşekkürler!'
            }
          ]
        }
      ]
    }
  ],
  de: [
    {
      id: 'coffee',
      badge: '☕ Tägliches Gespräch',
      title: '2 Dakikalık Almanca Kahve Molası',
      callerTitle: 'Chirmo AI • Almanca Konuşma Partnerin',
      turns: [
        {
          chirmoText: 'Hallo mein Freund! Hier ist Chirmo in meiner Kaffeepause. Wie läuft dein Tag bis jetzt?',
          chirmoTr: 'Selam arkadaşım! Kahve molamda ben Chirmo. Günün şu ana kadar nasıl geçiyor?',
          replies: [
            {
              level: 'Kolay',
              text: 'Mein Tag läuft super, danke! Wie geht es dir?',
              tr: 'Günüm harika geçiyor, teşekkürler! Sen nasılsın?'
            },
            {
              level: 'Doğal',
              text: 'Alles läuft gut heute. Ich mache gerade eine kurze Pause und trinke Kaffee.',
              tr: 'Bugün her şey yolunda. Şu an kısa bir mola verdim ve kahve içiyorum.'
            },
            {
              level: 'Akıcı',
              text: 'Ich hatte heute viel zu tun, aber ich freue mich immer, mit dir Deutsch zu sprechen!',
              tr: 'Bugün yapacak çok işim vardı ama seninle Almanca konuşmaktan her zaman mutluluk duyuyorum!'
            }
          ]
        },
        {
          chirmoText: 'Mir geht es wunderbar, danke! Was hast du heute Schönes gemacht oder geplant?',
          chirmoTr: 'Ben de harikayım, teşekkürler! Bugün güzel ne yaptın veya ne planladın?',
          replies: [
            {
              level: 'Kolay',
              text: 'Ich war heute Morgen spazieren und das Wetter war sehr schön.',
              tr: 'Bu sabah yürüyüşe çıktım ve hava çok güzeldi.'
            },
            {
              level: 'Doğal',
              text: 'Ich treffe mich heute Abend mit Freunden und wir gehen zusammen essen.',
              tr: 'Bu akşam arkadaşlarımla buluşacağım ve birlikte yemeğe gideceğiz.'
            },
            {
              level: 'Akıcı',
              text: 'Ich habe heute fleißig Deutsch geübt und koche heute Abend mein Lieblingsessen.',
              tr: 'Bugün özenle Almanca çalıştım ve bu akşam en sevdiğim yemeği pişireceğim.'
            }
          ]
        },
        {
          chirmoText: 'Das klingt fantastisch! Du sprichst heute sehr klar am Telefon. Wollen wir morgen wieder telefonieren?',
          chirmoTr: 'Kulağa harika geliyor! Bugün telefonda çok net konuşuyorsun. Yarın tekrar telefonlaşalım mı?',
          replies: [
            {
              level: 'Kolay',
              text: 'Ja, gerne! Bis morgen und einen schönen Tag noch!',
              tr: 'Evet, memnuniyetle! Yarına kadar hoşça kal, iyi günler!'
            },
            {
              level: 'Doğal',
              text: 'Auf jeden Fall! Danke für deinen Anruf, wir hören uns morgen.',
              tr: 'Kesinlikle! Aradığın için teşekkürler, yarın görüşmek üzere.'
            },
            {
              level: 'Akıcı',
              text: 'Sehr gerne! Das Telefonieren gibt mir viel Selbstvertrauen. Tschüss bis morgen!',
              tr: 'Çok sevinirim! Telefonla konuşmak bana büyük özgüven veriyor. Yarına kadar hoşça kal!'
            }
          ]
        }
      ]
    },
    {
      id: 'interview',
      badge: '💼 Vorstellungsgespräch',
      title: 'Almanca İş & Mülakat Telefon Görüşmesi',
      callerTitle: 'Chirmo HR • Berlin Kariyer Koçu',
      turns: [
        {
          chirmoText: 'Guten Tag! Vielen Dank für das Gespräch. Können Sie sich bitte kurz vorstellen?',
          chirmoTr: 'İyi günler! Görüşme için teşekkürler. Lütfen kısaca kendinizi tanıtabilir misiniz?',
          replies: [
            {
              level: 'Kolay',
              text: 'Guten Tag! Ich arbeite sehr motiviert und lerne gerne neue Dinge.',
              tr: 'İyi günler! Çok motive çalışırım ve yeni şeyler öğrenmeyi severim.'
            },
            {
              level: 'Doğal',
              text: 'Hallo! Ich habe Berufserfahrung in meinem Bereich und arbeite sehr gerne im Team.',
              tr: 'Merhaba! Alanımda iş deneyimim var ve ekip içinde çalışmayı çok seviyorum.'
            },
            {
              level: 'Akıcı',
              text: 'Freut mich sehr! Ich arbeite lösungsorientiert, zuverlässig und spreche jeden Tag besser Deutsch.',
              tr: 'Çok memnun oldum! Çözüm odaklı, güvenilir çalışırım ve her gün daha iyi Almanca konuşuyorum.'
            }
          ]
        },
        {
          chirmoText: 'Sehr beeindruckend! Wann hätten Sie Zeit für ein zweites Gespräch per Video?',
          chirmoTr: 'Çok etkileyici! İkinci bir görüntülü görüşme için ne zaman vaktiniz olur?',
          replies: [
            {
              level: 'Kolay',
              text: 'Ich habe morgen Nachmittag um vierzehn Uhr Zeit.',
              tr: 'Yarın öğleden sonra saat 14:00’te vaktim var.'
            },
            {
              level: 'Doğal',
              text: 'Am Donnerstag oder Freitagvormittag passt es mir sehr gut.',
              tr: 'Perşembe veya Cuma sabahı bana çok uygun.'
            },
            {
              level: 'Akıcı',
              text: 'Ich bin diese Woche flexibel. Schicken Sie mir gerne eine Einladung per E-Mail!',
              tr: 'Bu hafta programım esnek. Bana e-posta ile davet gönderebilirsiniz!'
            }
          ]
        }
      ]
    }
  ],
  fr: [
    {
      id: 'fr-coffee',
      badge: '☕ Pause Café',
      title: 'Pause Café de 2 Minutes (Günlük Kahve Molası)',
      callerTitle: 'Chirmo AI • Ton Partenaire Quotidien',
      turns: [
        {
          chirmoText: "Salut mon ami ! C'est Chirmo pendant ma pause-café. Comment se passe ta journée jusqu'ici ?",
          chirmoTr: 'Selam arkadaşım! Kahve molamda aradım. Günün şu ana kadar nasıl geçiyor?',
          replies: [
            {
              level: 'Kolay',
              text: 'Ma journée se passe très bien, merci ! Et toi ?',
              tr: 'Günüm çok iyi geçiyor, teşekkürler! Ya sen?'
            },
            {
              level: 'Doğal',
              text: 'Tout va très bien aujourd\'hui. Je fais une petite pause pour boire un bon café.',
              tr: 'Bugün her şey yolunda. Güzel bir kahve içmek için kısa bir mola verdim.'
            },
            {
              level: 'Akıcı',
              text: 'J\'ai été bien occupé par mon travail, mais je suis toujours ravi de pratiquer mon français avec toi !',
              tr: 'İşimle meşguldüm ama seninle Fransızca pratik yapmaktan her zaman çok mutluyum!'
            }
          ]
        },
        {
          chirmoText: "Ça me fait très plaisir ! Qu'as-tu prévu de beau pour le reste de la journée ?",
          chirmoTr: 'Çok sevindim! Günün geri kalanı için planladığın güzel bir şey var mı?',
          replies: [
            {
              level: 'Kolay',
              text: 'Ce soir, je vais voir des amis et regarder un bon film.',
              tr: 'Bu akşam arkadaşlarımla buluşup güzel bir film izleyeceğim.'
            },
            {
              level: 'Doğal',
              text: 'Je vais faire une agréable promenade et cuisiner un bon plat chaud.',
              tr: 'Güzel bir yürüyüş yapıp sıcak bir yemek pişireceğim.'
            },
            {
              level: 'Akıcı',
              text: 'Je vais continuer mes cours sur Chirmo et préparer mes prochains projets avec confiance.',
              tr: 'Chirmo derslerime devam edeceğim ve gelecek projelerimi özgüvenle hazırlayacağım.'
            }
          ]
        },
        {
          chirmoText: "C'est un excellent programme ! Avant qu'on raccroche, que voudrais-tu boire ou manger là maintenant ?",
          chirmoTr: 'Harika bir program! Kapatmadan önce, şu an ne yemek veya içmek isterdin?',
          replies: [
            {
              level: 'Kolay',
              text: 'Je voudrais un grand café au lait et un croissant chaud, s\'il te plaît !',
              tr: 'Büyük bir sütlü kahve ve sıcak bir kruvasan isterdim lütfen!'
            },
            {
              level: 'Doğal',
              text: 'Un bon thé à la menthe et un biscuit au chocolat seraient absolument parfaits.',
              tr: 'Güzel bir naneli çay ve çikolatalı bisküvi şu an kesinlikle mükemmel olurdu.'
            },
            {
              level: 'Akıcı',
              text: 'Franchement, un expresso bien serré me donnerait une énergie incroyable pour toute la soirée !',
              tr: 'Açıkçası koyu bir espresso bana tüm akşam için inanılmaz bir enerji verirdi!'
            }
          ]
        }
      ]
    },
    {
      id: 'fr-interview',
      badge: '💼 Entretien Pro',
      title: 'Mini Entretien Téléphonique (İş Görüşmesi)',
      callerTitle: 'Chirmo AI • Recruteur Francophone',
      turns: [
        {
          chirmoText: "Bonjour ! Merci d'avoir postulé chez nous. Pouvez-vous me présenter vos principaux atouts professionnels ?",
          chirmoTr: 'İyi günler! Bize başvurduğunuz için teşekkürler. Temel profesyonel yetkinliklerinizi tanıtabilir misiniz?',
          replies: [
            {
              level: 'Kolay',
              text: 'Bonjour ! Je suis très motivé et j\'apprends rapidement les nouvelles méthodes.',
              tr: 'İyi günler! Çok motiveyim ve yeni yöntemleri hızla öğrenirim.'
            },
            {
              level: 'Doğal',
              text: 'Bonjour ! J\'ai une solide expérience dans mon domaine et j\'apprécie beaucoup le travail en équipe.',
              tr: 'İyi günler! Alanımda güçlü bir deneyimim var ve takım çalışmasını çok severim.'
            },
            {
              level: 'Akıcı',
              text: 'Ravi d\'échanger avec vous ! Je suis rigoureux, orienté résultats et je m\'exprime chaque jour avec plus d\'aisance en français.',
              tr: 'Sizinle görüşmekten memnunum! Disiplinli, sonuç odaklıyım ve her gün Fransızcada daha rahat iletişim kuruyorum.'
            }
          ]
        },
        {
          chirmoText: "Très convaincant ! Quand seriez-vous disponible pour un deuxième entretien plus approfondi ?",
          chirmoTr: 'Çok ikna edici! Daha kapsamlı ikinci bir görüşme için ne zaman müsait olursunuz?',
          replies: [
            {
              level: 'Kolay',
              text: 'Je suis disponible demain à quatorze heures.',
              tr: 'Yarın saat 14:00\'te müsaitim.'
            },
            {
              level: 'Doğal',
              text: 'Jeudi après-midi ou vendredi matin me conviendrait parfaitement.',
              tr: 'Perşembe öğleden sonra veya Cuma sabahı bana mükemmel uyar.'
            },
            {
              level: 'Akıcı',
              text: 'Mon emploi du temps est flexible cette semaine. N\'hésitez pas à m\'envoyer une invitation par e-mail !',
              tr: 'Bu hafta takvimim esnek. Bana e-posta ile davet göndermekten çekinmeyin!'
            }
          ]
        }
      ]
    }
  ]
};

interface CallLogItem {
  id: string;
  sender: 'chirmo' | 'user';
  text: string;
  tr?: string;
  score?: number;
}

export const ChirmoVoiceCallSimulatorModal: React.FC<ChirmoVoiceCallSimulatorModalProps> = ({
  isOpen,
  onClose,
  callerName = 'Chirmo AI Öğretmeni',
  topic = '2 Dakikalık Günlük Kahve Molası Sohbeti'
}) => {
  const targetLang = TargetLanguageService.getTargetLanguage();
  const scenarios = CALL_SCENARIOS_BY_LANG[targetLang] || CALL_SCENARIOS_BY_LANG.en;

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const [callState, setCallState] = useState<CallScreenState>('ringing');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [chirmoSpeech, setChirmoSpeech] = useState<string>(activeScenario.turns[0].chirmoText);
  const [chirmoSpeechTr, setChirmoSpeechTr] = useState<string>(activeScenario.turns[0].chirmoTr);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [isTranslatingInput, setIsTranslatingInput] = useState<boolean>(false);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(true);
  const [isChirmoSpeaking, setIsChirmoSpeaking] = useState<boolean>(false);
  const [callHistory, setCallHistory] = useState<CallLogItem[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const speakingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Web Audio API ile gerçekçi yumuşak telefon çalma sesi üretici
  const playRingtonePulse = () => {
    if (isMuted) return;
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.18); // E5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 600);
    } catch {
      // Ses izni yoksa sessiz devam et
    }
  };

  const cleanupAudioAndSpeech = () => {
    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = null;
    }
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setIsChirmoSpeaking(false);
  };

  // Chirmo seslendirme yardımcısı (sessize alma durumuna duyarlı)
  const speakChirmoLine = (text: string) => {
    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
    }
    setIsChirmoSpeaking(true);
    if (!isMuted) {
      LearningStorageService.speak(text);
    }
    const estimatedMs = Math.min(Math.max(text.length * 55, 2200), 5000);
    speakingTimerRef.current = setTimeout(() => {
      setIsChirmoSpeaking(false);
    }, estimatedMs);
  };

  // Zil Çalma & Sayaç Döngüsü
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && callState === 'in-call') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, callState]);

  // Çalma durumunda hafif zil sesi döngüsü
  useEffect(() => {
    if (isOpen && callState === 'ringing' && !isMuted) {
      playRingtonePulse();
      ringIntervalRef.current = setInterval(() => {
        playRingtonePulse();
      }, 2800);
    }
    return () => {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
        ringIntervalRef.current = null;
      }
    };
  }, [isOpen, callState, isMuted]);

  // Modal Açıldığında veya Senaryo Değiştiğinde Sıfırla
  useEffect(() => {
    if (isOpen) {
      const defaultScen = scenarios[0];
      setSelectedScenarioId(defaultScen.id);
      setCallState('ringing');
      setCallDuration(0);
      setTurnIndex(0);
      setTurnCount(0);
      setUserTranscript('');
      setCustomInput('');
      setLastScore(null);
      setChirmoSpeech(defaultScen.turns[0].chirmoText);
      setChirmoSpeechTr(defaultScen.turns[0].chirmoTr);
      setCallHistory([]);
    } else {
      cleanupAudioAndSpeech();
    }
    return () => cleanupAudioAndSpeech();
  }, [isOpen]);

  // Sohbet kaydırma
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [callHistory, chirmoSpeech]);

  const handleSelectScenario = (scen: CallScenarioConfig) => {
    setSelectedScenarioId(scen.id);
    setTurnIndex(0);
    setChirmoSpeech(scen.turns[0].chirmoText);
    setChirmoSpeechTr(scen.turns[0].chirmoTr);
  };

  // Aramayı Cevapla
  const handleAnswerCall = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    const firstTurn = activeScenario.turns[0];
    setTurnIndex(0);
    setChirmoSpeech(firstTurn.chirmoText);
    setChirmoSpeechTr(firstTurn.chirmoTr);
    setCallHistory([
      {
        id: `chirmo-0`,
        sender: 'chirmo',
        text: firstTurn.chirmoText,
        tr: firstTurn.chirmoTr
      }
    ]);
    setCallState('in-call');
    speakChirmoLine(firstTurn.chirmoText);
  };

  // Aramayı Sonlandır
  const handleEndCall = () => {
    cleanupAudioAndSpeech();
    setCallState('summary');
    CampStorageService.completeDayMission(1, 50);
    LearningStorageService.addXP(50, 'Canlı Telefon Görüşmesi');
  };

  // Web Speech API ile Kullanıcıyı Dinle (Doğrudan kullanıcı etkileşimiyle çalışır)
  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Tarayıcıda ses tanıma yoksa hazır ilk cevabı seçerek akışı kesintisiz sürdür
      const currentStep =
        activeScenario.turns[Math.min(turnIndex, activeScenario.turns.length - 1)];
      const fallbackReply = currentStep.replies[0].text;
      setUserTranscript(fallbackReply);
      processUserReply(fallbackReply);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsChirmoSpeaking(false);
      setIsListening(true);

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = targetLang === 'de' ? 'de-DE' : targetLang === 'fr' ? 'fr-FR' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        setIsListening(false);
        if (transcript && transcript.trim()) {
          setUserTranscript(transcript.trim());
          processUserReply(transcript.trim());
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Kullanıcı Cevabını İşle ve Chirmo'nun Sıradaki Yanıtına Geç
  const processUserReply = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const wordCount = trimmed.split(/\s+/).length;
    const computedScore = Math.min(99, Math.max(82, 80 + wordCount * 2));
    setLastScore(computedScore);
    setTurnCount((prev) => prev + 1);

    setCallHistory((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        score: computedScore
      }
    ]);

    const nextIdx = turnIndex + 1;

    // Senaryoda sıradaki adım varsa doğal senaryo akışıyla devam et
    if (nextIdx < activeScenario.turns.length) {
      const nextStep = activeScenario.turns[nextIdx];
      setTurnIndex(nextIdx);
      setChirmoSpeech(nextStep.chirmoText);
      setChirmoSpeechTr(nextStep.chirmoTr);
      setCallHistory((prev) => [
        ...prev,
        {
          id: `chirmo-${Date.now()}`,
          sender: 'chirmo',
          text: nextStep.chirmoText,
          tr: nextStep.chirmoTr
        }
      ]);
      speakChirmoLine(nextStep.chirmoText);
      return;
    }

    // Tüm adımlar tamamlandıysa veya serbest sohbet devam ediyorsa AI / Akıllı Kapanış üret
    setIsChirmoSpeaking(true);
    try {
      const apiKey = GeminiAiTeacherService.getApiKey();
      if (apiKey) {
        const result = await GeminiAiTeacherService.generateTutorResponse(
          trimmed,
          [],
          activeScenario.title
        );
        // Parantez içindeki Türkçe çeviriyi güvenli şekilde ayıkla
        const match = result.text.match(/\(([^)]+)\)/);
        const cleanTarget = result.text.replace(/\([^)]*\)/g, '').replace(/\*/g, '').trim();
        const cleanTr = match
          ? match[1].trim()
          : 'Harika ifade ettin! Telefonda çok doğal ve akıcı konuşuyorsun.';

        setChirmoSpeech(cleanTarget);
        setChirmoSpeechTr(cleanTr);
        setCallHistory((prev) => [
          ...prev,
          {
            id: `chirmo-${Date.now()}`,
            sender: 'chirmo',
            text: cleanTarget,
            tr: cleanTr
          }
        ]);
        speakChirmoLine(cleanTarget);
        return;
      }
    } catch {
      // Fallback'e geç
    }

    const closingTarget =
      targetLang === 'de'
        ? 'Ausgezeichnet gesprochen! Du hast alle Schritte dieses Telefonats gemeistert. Möchtest du noch etwas sagen oder das Gespräch abschließen?'
        : targetLang === 'fr'
          ? 'Magnifiquement parlé ! Tu as réussi toutes les étapes de cet appel téléphonique. Veux-tu ajouter quelque chose ou conclure l\'appel ?'
          : 'Wonderfully spoken! You mastered every step of this phone call. Would you like to say one more thing or complete the call now?';
    const closingTr =
      'Harika konuştun! Bu telefon görüşmesinin tüm adımlarını başarıyla tamamladın. Son bir şey söylemek veya aramayı bitirmek ister misin?';

    setChirmoSpeech(closingTarget);
    setChirmoSpeechTr(closingTr);
    setCallHistory((prev) => [
      ...prev,
      {
        id: `chirmo-${Date.now()}`,
        sender: 'chirmo',
        text: closingTarget,
        tr: closingTr
      }
    ]);
    speakChirmoLine(closingTarget);
  };

  // Türkçe veya Hedef Dilde Yazılan Mesajı Çevirip Gönder
  const handleSendCustomInput = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = customInput.trim();
    if (!raw || isTranslatingInput) return;

    setIsTranslatingInput(true);
    try {
      // Türkçe karakter veya Türkçe kelime içeriyorsa otomatik hedef dile çevir
      const hasTurkishChars = /[çğıöşüÇĞİÖŞÜ]/.test(raw);
      const commonTrWords = /\b(merhaba|iyiyim|günüm|kahve|evet|hayır|teşekkür|yarın|bugün|ben|istiyorum|müsaitim)\b/i.test(
        raw
      );
      let finalSentence = raw;
      if (hasTurkishChars || commonTrWords) {
        finalSentence = await GeminiAiTeacherService.translateTurkishThoughtToTargetLanguage(
          raw,
          chirmoSpeech,
          targetLang
        );
      }
      setCustomInput('');
      setUserTranscript(finalSentence);
      await processUserReply(finalSentence);
    } finally {
      setIsTranslatingInput(false);
    }
  };

  // Zaman Formatı (01:24)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentStep =
    activeScenario.turns[Math.min(turnIndex, activeScenario.turns.length - 1)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      {/* Telefon Ekran Çerçevesi */}
      <div className="w-full max-w-md h-[94vh] max-h-[760px] rounded-[36px] overflow-hidden shadow-2xl flex flex-col bg-slate-900 text-white border-4 border-slate-800 relative">
        {/* Sağ Üst Kapatma Butonu (Her durumda erişilebilir) */}
        <button
          type="button"
          onClick={() => {
            cleanupAudioAndSpeech();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ==================== 1. ÇALAN TELEFON DURUMU (RINGING) ==================== */}
        {callState === 'ringing' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-7 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-center">
            {/* Üst Bilgi */}
            <div className="pt-3 space-y-2 w-full">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gelen Sesli Arama 📞</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {callerName}
              </h2>
              <p className="text-xs font-semibold text-purple-200">
                {activeScenario.title || topic}
              </p>

              {/* Arama Konusu Seçici */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5">
                {scenarios.map((scen) => {
                  const isSelected = scen.id === activeScenario.id;
                  return (
                    <button
                      key={scen.id}
                      type="button"
                      onClick={() => handleSelectScenario(scen)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-white text-purple-950 border-white shadow-md scale-105'
                          : 'bg-white/10 text-purple-200 border-white/15 hover:bg-white/20'
                      }`}
                    >
                      {scen.badge}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Canlı 3D Chirmo Maskot Aurası */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center my-2">
              <span className="absolute inset-0 rounded-full border-4 border-emerald-400/50 animate-ping pointer-events-none" />
              <span className="absolute -inset-3 rounded-full border-2 border-purple-400/40 animate-pulse pointer-events-none" />
              <div className="relative w-34 h-34 sm:w-38 sm:h-38 rounded-full overflow-hidden bg-gradient-to-tr from-purple-600 to-indigo-500 p-3 shadow-2xl border-2 border-white/30 flex items-center justify-center">
                <img
                  src="./chirmo-character.png"
                  alt="Chirmo Calling"
                  className="w-full h-full object-contain filter drop-shadow-md"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />
              </div>
            </div>

            {/* İlk Cümle Önizlemesi */}
            <div className="w-full px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-300 mb-0.5">
                Açılış Sorusu Hazır:
              </div>
              <p className="text-xs font-bold text-white line-clamp-2">
                "{activeScenario.turns[0].chirmoText}"
              </p>
              <p className="text-[11px] text-purple-200 mt-0.5 line-clamp-1">
                🇹🇷 {activeScenario.turns[0].chirmoTr}
              </p>
            </div>

            {/* Cevapla / Reddet Butonları */}
            <div className="w-full pt-2 pb-2 flex items-center justify-around">
              {/* Reddet Butonu */}
              <div className="flex flex-col items-center space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    cleanupAudioAndSpeech();
                    onClose();
                  }}
                  className="w-15 h-15 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-90 cursor-pointer"
                  title="Reddet"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
                <span className="text-xs font-bold text-slate-300">Meşgul</span>
              </div>

              {/* Cevapla Butonu */}
              <div className="flex flex-col items-center space-y-1.5">
                <button
                  type="button"
                  onClick={handleAnswerCall}
                  className="w-18 h-18 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/50 transition-transform active:scale-95 hover:scale-105 cursor-pointer ring-4 ring-emerald-400/30"
                  title="Yanıtla ve Konuşmaya Başla"
                >
                  <Phone className="w-8 h-8" />
                </button>
                <span className="text-xs font-black text-emerald-400">Yanıtla</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. AKTİF SESLİ ARAMA DURUMU (IN-CALL) ==================== */}
        {callState === 'in-call' && (
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 overflow-hidden">
            {/* Üst Arama Başlığı & Süre */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 pr-10 shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-600 p-1 shrink-0 border border-white/20">
                  <img
                    src="./chirmo-character.png"
                    alt="Chirmo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    {activeScenario.callerTitle}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{formatTime(callDuration)}</span>
                    <span className="text-purple-300">
                      • Adım {Math.min(turnIndex + 1, activeScenario.turns.length)}/
                      {activeScenario.turns.length}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSubtitle(!showSubtitle)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
                  showSubtitle ? 'bg-amber-400 text-purple-950' : 'bg-white/10 text-white'
                }`}
                title="Türkçe Altyazı Aç / Kapat"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>TR</span>
              </button>
            </div>

            {/* Orta: Canlı Telefon Diyalog Akışı & Hazır Cevaplar */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin"
            >
              {/* Chirmo'nun Güncel Cümlesi */}
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isChirmoSpeaking ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                      }`}
                    />
                    <span>{isChirmoSpeaking ? 'Chirmo Konuşuyor...' : 'Chirmo Sordu:'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => speakChirmoLine(chirmoSpeech)}
                    className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Tekrar Dinle</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm font-black text-white leading-relaxed">
                  "{chirmoSpeech}"
                </div>
                {showSubtitle && chirmoSpeechTr && (
                  <div className="text-[11px] font-medium text-amber-200 border-t border-white/10 pt-1.5">
                    🇹🇷 {chirmoSpeechTr}
                  </div>
                )}
              </div>

              {/* Kullanıcının Son Söylediği Cümle & Skor Rozeti */}
              {userTranscript && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-left space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-black text-emerald-300 uppercase">
                    <span>🎙️ Senin Yanıtın</span>
                    {lastScore && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black">
                        %{lastScore} Akıcı
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">"{userTranscript}"</div>
                </div>
              )}

              {/* Hızlı Cevap Seçenekleri (Dokunarak veya Okuyarak Yanıtla) */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                    👇 Dokunarak veya Sesli Söyleyerek Yanıtla:
                  </span>
                  <span className="text-[10px] font-bold text-amber-300">
                    3 Seviye Hazır Cevap
                  </span>
                </div>
                {currentStep.replies.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUserTranscript(item.text);
                      processUserReply(item.text);
                    }}
                    className="w-full p-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-600/40 hover:border-amber-400/60 text-left transition-all cursor-pointer group active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-amber-300">
                        {item.level}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 group-hover:translate-x-0.5 transition-transform">
                        Gönder & Konuş →
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white leading-snug">
                      💬 "{item.text}"
                    </div>
                    {showSubtitle && (
                      <div className="text-[10px] text-slate-300 mt-0.5">🇹🇷 {item.tr}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Alt Kısım: Serbest Yazma / Türkçe Düşün Çevir + Telefon Kontrolleri */}
            <div className="pt-2 border-t border-white/10 space-y-2.5 shrink-0">
              {/* Yazarak veya Türkçe Düşünerek Cevaplama Çubuğu */}
              <form onSubmit={handleSendCustomInput} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={
                    targetLang === 'de'
                      ? 'Almanca veya Türkçe cevabını yaz...'
                      : targetLang === 'fr'
                        ? 'Fransızca veya Türkçe cevabını yaz...'
                        : 'İngilizce veya Türkçe cevabını yaz...'
                  }
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || isTranslatingInput}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTranslatingInput ? '...' : 'Söyle'}</span>
                </button>
              </form>

              {/* Telefon Kontrol Butonları */}
              <div className="flex items-center justify-around">
                {/* Mikrofonla Konuş Butonu */}
                <button
                  type="button"
                  onClick={() => {
                    if (isListening) {
                      if (recognitionRef.current) {
                        try {
                          recognitionRef.current.stop();
                        } catch {
                          // ignore
                        }
                      }
                      setIsListening(false);
                    } else {
                      startSpeechRecognition();
                    }
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isListening
                      ? 'bg-amber-400 text-purple-950 animate-pulse shadow-lg shadow-amber-400/40'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                  }`}
                  title={isListening ? 'Dinliyor...' : 'Mikrofonla Konuş'}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isListening ? 'Dinliyor...' : 'Bas Konuş'}</span>
                </button>

                {/* Aramayı Bitir Butonu */}
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="w-13 h-13 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-95 cursor-pointer"
                  title="Görüşmeyi Tamamla"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                {/* Hoparlör Sesi Aç/Kapa */}
                <button
                  type="button"
                  onClick={() => {
                    const nextMute = !isMuted;
                    setIsMuted(nextMute);
                    if (nextMute && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                    isMuted
                      ? 'bg-red-500/20 text-red-300 border-red-400/40'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                  title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. GÖRÜŞME SONU KARNESİ (SUMMARY) ==================== */}
        {callState === 'summary' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-7 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-center animate-fade-in">
            <div className="pt-4 space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-white">Görüşme Tamamlandı! 🎉</h2>
              <p className="text-xs text-purple-200">
                <strong>{activeScenario.title}</strong> telefon pratiğini başarıyla tamamladın.
              </p>
            </div>

            {/* İstatistik Rozetleri */}
            <div className="w-full grid grid-cols-3 gap-2.5 py-3">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">{formatTime(callDuration)}</div>
                <div className="text-[10px] text-slate-400">Görüşme Süresi</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-xs font-black text-amber-400">+50 XP</div>
                <div className="text-[10px] text-slate-400">Kazanılan Ödül</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-xs font-black text-emerald-400">
                  %{lastScore || 95}
                </div>
                <div className="text-[10px] text-slate-400">Konuşma Akıcılığı</div>
              </div>
            </div>

            {/* Görüşme Özeti */}
            <div className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tamamlanan Diyalog Turu</span>
                </span>
                <span>{Math.max(turnCount, 1)} Cümle</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Telefonda gerçek zamanlı soru-cevap refleksini çalıştırdın. Farklı bir senaryo ile tekrar arayabilir veya ana ekrana dönebilirsin.
              </p>
            </div>

            {/* Aksiyon Butonları */}
            <div className="w-full pb-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setCallState('ringing');
                  setCallDuration(0);
                  setTurnIndex(0);
                  setTurnCount(0);
                  setUserTranscript('');
                }}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Başka Konuda Tekrar Ara</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  cleanupAudioAndSpeech();
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
              >
                Harika, Ana Sayfaya Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChirmoVoiceCallSimulatorModal;
