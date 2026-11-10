// Chirmo Fransızca Müfredat & Gerçek Yaşam Konuşma Senaryoları (Français)
// 30 Günde Sıfırdan Fransızca Konuşma & Doğal Refleks Metodu

import { RealLifeScenario, DayMission } from './curriculumData';

export const FRENCH_REAL_LIFE_SCENARIOS: RealLifeScenario[] = [
  {
    id: 'scenario-fr-coffee',
    category: 'Kafe & Fırın',
    title: 'Kahve & Kruvasan Siparişi (Au Café & Boulangerie)',
    badge: '☕ Café & Fırın',
    description: 'Paris\'te veya bir Fransız kafesinde en doğal ve kibar Fransızca kalıplarla sipariş verin.',
    keyChunks: [
      {
        en: 'Je voudrais un café au lait et un croissant, s\'il vous plaît.',
        tr: 'Bir sütlü kahve ve bir kruvasan rica ediyorum, lütfen.',
        phonetic: '/ʒə vu.dʁɛ œ̃ ka.fe o lɛ e œ̃ kʁwa.sɑ̃ sil vu plɛ/',
        example: 'Bonjour ! Je voudrais un café au lait et un croissant, s\'il vous plaît.',
        exampleTr: 'Merhaba! Bir sütlü kahve ve bir kruvasan rica ediyorum, lütfen.'
      },
      {
        en: 'Qu\'est-ce que vous me conseillez ?',
        tr: 'Neyi tavsiye edersiniz? / Ne önerirsiniz?',
        phonetic: '/kɛs kə vu mə kɔ̃.sɛ.je/',
        example: 'C\'est ma première fois ici, qu\'est-ce que vous me conseillez ?',
        exampleTr: 'Buraya ilk gelişim, ne önerirsiniz?'
      },
      {
        en: 'L\'addition, s\'il vous plaît.',
        tr: 'Hesabı alabilir miyim lütfen?',
        phonetic: '/la.di.sjɔ̃ sil vu plɛ/',
        example: 'Nous avons terminé. L\'addition, s\'il vous plaît.',
        exampleTr: 'Bitirdik. Hesabı alabilir miyiz lütfen.'
      },
      {
        en: 'Gardez la monnaie.',
        tr: 'Üstü kalsın.',
        phonetic: '/ɡaʁ.de la mɔ.nɛ/',
        example: 'Voici vingt euros, gardez la monnaie.',
        exampleTr: 'Buyrun yirmi avro, üstü kalsın.'
      }
    ],
    interactiveChallenge: {
      situation: 'Kafede garson masanıza geldi ve siparişinizi sordu.',
      situationTr: 'Kafedesiniz ve garson ne almak istediğinizi sordu.',
      aiQuestion: 'Bonjour ! Qu\'est-ce que je peux vous servir aujourd\'hui ? Un café peut-être ?',
      aiQuestionTr: 'Merhaba! Bugün size ne ikram edebilirim? Belki bir kahve?',
      suggestedAnswer: 'Bonjour ! Je voudrais un grand café et un croissant chaud, s\'il vous plaît.',
      suggestedAnswerTr: 'Merhaba! Sıcak bir kruvasan ve büyük bir kahve rica ediyorum, lütfen.',
      coachTip: 'Fransızcada sipariş verirken "Je veux" (istiyorum) kaba duyulabilir; daima kibarca "Je voudrais..." (rica ediyorum / isterdim) deyin.'
    }
  },
  {
    id: 'scenario-fr-travel',
    category: 'Ulaşım & Seyahat',
    title: 'Tren Garı & Bilet (À la Gare)',
    badge: '🚆 Tren & Seyahat',
    description: 'Fransa\'da tren garında peron bulma, bilet alma ve aktarma sorma pratiği.',
    keyChunks: [
      {
        en: 'De quel quai part le train pour Lyon ?',
        tr: 'Lyon treni hangi perondan kalkıyor?',
        phonetic: '/də kɛl kɛ paʁ lə tʁɛ̃ puʁ ljɔ̃/',
        example: 'Pardonnez-moi, de quel quai part le TGV pour Paris ?',
        exampleTr: 'Afedersiniz, Paris hızlı treni hangi perondan kalkıyor?'
      },
      {
        en: 'Est-ce que le train a du retard ?',
        tr: 'Trenin rötarı var mı?',
        phonetic: '/ɛs kə lə tʁɛ̃ a dy ʁə.taʁ/',
        example: 'Savez-vous si le train a du retard ?',
        exampleTr: 'Trenin rötarı olup olmadığını biliyor musunuz?'
      },
      {
        en: 'Est-ce qu\'il faut changer de train ?',
        tr: 'Aktarma yapmak gerekiyor mu?',
        phonetic: '/ɛs kil fo ʃɑ̃.ʒe də tʁɛ̃/',
        example: 'Est-ce un train direct ou faut-il changer à Marseille ?',
        exampleTr: 'Doğrudan bir tren mi yoksa Marsilya\'da aktarma yapmamız gerekir mi?'
      }
    ],
    interactiveChallenge: {
      situation: 'Garda danışma görevlisine treninizin saatini ve peronunu soruyorsunuz.',
      situationTr: 'Görevliye Paris treninizin peronunu soruyorsunuz.',
      aiQuestion: 'Bonjour ! Puis-je vous aider pour votre itinéraire ?',
      aiQuestionTr: 'Merhaba! Yolculuğunuz konusunda yardımcı olabilir miyim?',
      suggestedAnswer: 'Bonjour ! Oui, s\'il vous plaît, de quel quai part le train pour Paris ?',
      suggestedAnswerTr: 'Merhaba! Evet lütfen, Paris treni hangi perondan kalkıyor?',
      coachTip: 'Fransızca tren garlarında "quai" peron anlamına gelir. Panolarda quai harf veya numarasını arayın.'
    }
  },
  {
    id: 'scenario-fr-icebreaker',
    category: 'Tanışma & Sosyal',
    title: 'Yeni Biriyle Tanışma (Faire Connaissance)',
    badge: '🤝 Tanışma & Sohbet',
    description: 'Fransızca ilk teması kurma, nereli olduğunu söyleme ve mesleğinden bahsetme.',
    keyChunks: [
      {
        en: 'Enchanté de faire votre connaissance !',
        tr: 'Tanıştığımıza çok memnun oldum!',
        phonetic: '/ɑ̃.ʃɑ̃.te də fɛʁ vɔtʁ kɔ.nɛ.sɑ̃s/',
        example: 'Bonjour, je m\'appelle Selin. Enchantée de faire votre connaissance !',
        exampleTr: 'Merhaba, adım Selin. Tanıştığımıza çok memnun oldum!'
      },
      {
        en: 'D\'où venez-vous ?',
        tr: 'Nerelisiniz?',
        phonetic: '/du və.ne vu/',
        example: 'Je viens de Turquie, d\'Istanbul. Et vous ?',
        exampleTr: 'Ben Türkiye\'den, İstanbul\'dan geliyorum. Ya siz?'
      },
      {
        en: 'Qu\'est-ce que vous faites dans la vie ?',
        tr: 'Ne iş yapıyorsunuz / mesleğiniz nedir?',
        phonetic: '/kɛs kə vu fɛt dɑ̃ la vi/',
        example: 'Je suis développeur de logiciels. Et vous, qu\'est-ce que vous faites dans la vie ?',
        exampleTr: 'Yazılım geliştiriciyim. Siz ne iş yapıyorsunuz?'
      }
    ],
    interactiveChallenge: {
      situation: 'Bir networking etkinliğinde yanınızdaki kişiyle tanışıyorsunuz.',
      situationTr: 'Fransız bir profesyonelle tanışıp kendinizi tanıtacaksınız.',
      aiQuestion: 'Bonjour ! C\'est un plaisir d\'être ici. Comment vous vous appelez ?',
      aiQuestionTr: 'Merhaba! Burada olmak büyük bir zevk. İsminiz nedir?',
      suggestedAnswer: 'Bonjour ! Je m\'appelle Mehmet. Enchanté de vous rencontrer !',
      suggestedAnswerTr: 'Merhaba! Adım Mehmet. Sizinle tanıştığıma çok memnun oldum!',
      coachTip: 'Fransızca tanışmalarda "Enchanté" kelimesi samimi ve kusursuz bir etki bırakır.'
    }
  },
  {
    id: 'scenario-fr-pharmacy',
    category: 'Eczane & Sağlık',
    title: 'Eczanede İlaç İsteme (À la Pharmacie)',
    badge: '💊 Sağlık & Eczane',
    description: 'Fransa\'da eczanede şikayet anlatma, ağrı kesici ve pastil isteme.',
    keyChunks: [
      {
        en: 'J\'ai un mal de gorge et de la fièvre.',
        tr: 'Boğaz ağrım ve ateşim var.',
        phonetic: '/ʒe œ̃ mal də ɡɔʁʒ e də la fjɛvʁ/',
        example: 'Depuis hier, j\'ai un mal de gorge intense et un peu de fièvre.',
        exampleTr: 'Dünden beri şiddetli boğaz ağrım ve biraz ateşim var.'
      },
      {
        en: 'Avez-vous quelque chose contre le mal de tête ?',
        tr: 'Baş ağrısına karşı bir şeyiniz var mı?',
        phonetic: '/a.ve vu kɛl.kə ʃoz kɔ̃.tʁə lə mal də tɛt/',
        example: 'Bonjour, avez-vous quelque chose d\'efficace contre le mal de tête ?',
        exampleTr: 'Merhaba, baş ağrısına karşı etkili bir şeyiniz var mı?'
      },
      {
        en: 'Combien de fois par jour dois-je le prendre ?',
        tr: 'Bunu günde kaç kez almalıyım?',
        phonetic: '/kɔ̃.bjɛ̃ də fwa paʁ ʒuʁ dwa ʒə lə pʁɑ̃dʁ/',
        example: 'Merci. Combien de fois par jour dois-je prendre ces comprimés ?',
        exampleTr: 'Teşekkürler. Bu tabletleri günde kaç kez almalıyım?'
      }
    ],
    interactiveChallenge: {
      situation: 'Eczanede eczacı ne şikayetiniz olduğunu soruyor.',
      situationTr: 'Eczacı size nasıl yardımcı olabileceğini soruyor.',
      aiQuestion: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      aiQuestionTr: 'İyi günler! Bugün size nasıl yardımcı olabilirim?',
      suggestedAnswer: 'Bonjour ! J\'ai mal à la tête et à la gorge. Avez-vous des pastilles ?',
      suggestedAnswerTr: 'Merhaba! Başım ve boğazım ağrıyor. Pastiliniz var mı?',
      coachTip: 'Fransızcada ağrı belirtirken "J\'ai mal à..." kalıbı kullanılır: J\'ai mal à la tête (başım ağrıyor), au ventre (karnım ağrıyor).'
    }
  },
  {
    id: 'scenario-fr-work',
    category: 'İş & Toplantı',
    title: 'İş Görüşmesi & Randevu (Au Travail)',
    badge: '💼 İş & Kariyer',
    description: 'Fransızca iş e-postası, randevu saati ayarlama ve profesyonel görüşme.',
    keyChunks: [
      {
        en: 'Est-il possible de reporter notre rendez-vous ?',
        tr: 'Randevumuzu ertelememiz mümkün mü?',
        phonetic: '/ɛ.til pɔ.sibl də ʁə.pɔʁ.te nɔtʁ ʁɑ̃.de.vu/',
        example: 'Je suis désolé, est-il possible de reporter notre rendez-vous à jeudi ?',
        exampleTr: 'Kusura bakmayın, randevumuzu perşembeye ertelememiz mümkün mü?'
      },
      {
        en: 'Je vous tiens au courant.',
        tr: 'Sizi haberdar edeceğim / bilgilendireceğim.',
        phonetic: '/ʒə vu tjɛ̃ o ku.ʁɑ̃/',
        example: 'Dès que le dossier sera finalisé, je vous tiens au courant.',
        exampleTr: 'Dosya tamamlanır tamamlanmaz sizi haberdar edeceğim.'
      },
      {
        en: 'Je vous remercie pour votre collaboration.',
        tr: 'İş birliğiniz için size teşekkür ederim.',
        phonetic: '/ʒə vu ʁə.mɛʁ.si puʁ vɔtʁ kɔ.la.bɔ.ʁa.sjɔ̃/',
        example: 'Je vous remercie chaleureusement pour votre précieuse collaboration.',
        exampleTr: 'Değerli iş birliğiniz için size içtenlikle teşekkür ederim.'
      }
    ],
    interactiveChallenge: {
      situation: 'İş arkadaşınız yarınki toplantının saatini teyit ediyor.',
      situationTr: 'İş arkadaşınız saat hakkında konuşuyor.',
      aiQuestion: 'Bonjour ! Est-ce que la réunion de demain à 10 heures vous convient ?',
      aiQuestionTr: 'Merhaba! Yarın saat 10\'daki toplantı size uyar mı?',
      suggestedAnswer: 'Bonjour ! Oui, 10 heures me convient parfaitement. Merci !',
      suggestedAnswerTr: 'Merhaba! Evet, saat 10 bana mükemmel uyuyor. Teşekkürler!',
      coachTip: '"Ça me convient" (Bana uyar / uygundur) iş ortamında zaman planlamasında en yaygın ifadedir.'
    }
  }
];

export const FRENCH_DAY_MISSIONS: DayMission[] = [
  // ---------- 1. HAFTA: TEMEL TANIŞMA & İLK REFLEKSLER (1-7. GÜN) ----------
  {
    day: 1,
    week: 1,
    title: 'İlk Adım: Selamlaşma & İsim',
    theme: 'Tanışma Refleksi',
    speakingGoal: 'Bonjour, je m\'appelle Selin et je suis ravie !',
    speakingGoalTr: 'Merhaba, adım Selin ve çok memnunum!',
    aiPrompt: 'Bonjour ! Ravi de vous rencontrer. Comment vous vous appelez ?',
    aiPromptTr: 'Merhaba! Sizinle tanıştığıma sevindim. Adınız nedir?',
    suggestedAnswer: 'Bonjour ! Je m\'appelle Selin, enchanté de faire votre connaissance.',
    suggestedAnswerTr: 'Merhaba! Adım Selin, tanıştığımıza çok memnun oldum.',
    xpReward: 30,
    keyVocabulary: ['Bonjour (Merhaba)', 'Je m\'appelle (Adım)', 'Enchanté (Memnun oldum)'],
    nativeCoachTip: 'Fransızcada tanışırken "Enchanté" demek anında samimi ve saygın bir hava yaratır.'
  },
  {
    day: 2,
    week: 1,
    title: 'Nerelisin? Memleket & Şehir',
    theme: 'Köken Refleksi',
    speakingGoal: 'Je viens de Turquie, d\'Istanbul.',
    speakingGoalTr: 'Ben Türkiye\'den, İstanbul\'dan geliyorum.',
    aiPrompt: 'D\'où venez-vous et où habitez-vous actuellement ?',
    aiPromptTr: 'Nerelisiniz ve şu an nerede yaşıyorsunuz?',
    suggestedAnswer: 'Je viens de Turquie et j\'habite actuellement à Istanbul.',
    suggestedAnswerTr: 'Türkiye\'den geliyorum ve şu an İstanbul\'da yaşıyorum.',
    xpReward: 30,
    keyVocabulary: ['Je viens de (Geliyorum)', 'J\'habite à (Yaşıyorum)', 'La Turquie (Türkiye)'],
    nativeCoachTip: 'Ülke isimleri için "de/en", şehirler için "à" edatı kullanılır: en Turquie, à Paris.'
  },
  {
    day: 3,
    week: 1,
    title: 'Meslek & Günlük İş',
    theme: 'Kariyer Tanıtımı',
    speakingGoal: 'Je travaille dans le domaine de la technologie.',
    speakingGoalTr: 'Teknoloji alanında çalışıyorum.',
    aiPrompt: 'Qu\'est-ce que vous faites comme travail ?',
    aiPromptTr: 'Ne işle meşgulsünüz?',
    suggestedAnswer: 'Je travaille comme ingénieur et j\'aime beaucoup mon métier.',
    suggestedAnswerTr: 'Mühendis olarak çalışıyorum ve mesleğimi çok seviyorum.',
    xpReward: 30,
    keyVocabulary: ['Je travaille (Çalışıyorum)', 'Mon métier (Mesleğim)', 'Ingénieur (Mühendis)'],
    nativeCoachTip: '"Je travaille comme..." veya doğrudan "Je suis + meslek" (örn: Je suis professeur) kalıbını kullanın.'
  },
  {
    day: 4,
    week: 1,
    title: 'Kafede İlk Sipariş',
    theme: 'Sipariş Refleksi',
    speakingGoal: 'Je voudrais un café noir, s\'il vous plaît.',
    speakingGoalTr: 'Bir sade kahve rica ediyorum, lütfen.',
    aiPrompt: 'Bonjour ! Qu\'est-ce qui vous ferait plaisir aujourd\'hui ?',
    aiPromptTr: 'Merhaba! Bugün size ne ikram edelim / ne arzu edersiniz?',
    suggestedAnswer: 'Bonjour ! Un café noir et un verre d\'eau, s\'il vous plaît.',
    suggestedAnswerTr: 'Merhaba! Bir sade kahve ve bir bardak su rica ediyorum, lütfen.',
    xpReward: 35,
    keyVocabulary: ['Je voudrais (Rica ediyorum)', 'S\'il vous plaît (Lütfen)', 'Un café (Bir kahve)'],
    nativeCoachTip: '"S\'il vous plaît" Fransız kültüründe nezaketin vazgeçilmez altın anahtarıdır.'
  },
  {
    day: 5,
    week: 1,
    title: 'Saat & Zaman Sorma',
    theme: 'Zaman Yönetimi',
    speakingGoal: 'Quelle heure est-il, s\'il vous plaît ?',
    speakingGoalTr: 'Saat kaç acaba, lütfen?',
    aiPrompt: 'Excusez-moi, est-ce que vous avez l\'heure ?',
    aiPromptTr: 'Afedersiniz, saatiniz var mı / saat kaç?',
    suggestedAnswer: 'Oui, il est exactement quatorze heures trente.',
    suggestedAnswerTr: 'Evet, saat tam olarak on dört otuz.',
    xpReward: 35,
    keyVocabulary: ['Quelle heure est-il ? (Saat kaç?)', 'Il est... (Saat...)', 'Exactement (Tam olarak)'],
    nativeCoachTip: 'Fransa\'da resmi durumlarda ve ulaşımda 24 saatlik format yaygındır (örn: 14h30).'
  },
  {
    day: 6,
    week: 1,
    title: 'Hobiler & Sevdiğin Şeyler',
    theme: 'İlgi Alanları',
    speakingGoal: 'Pendant mon temps libre, j\'adore écouter de la musique.',
    speakingGoalTr: 'Boş zamanlarımda müzik dinlemeyi çok severim.',
    aiPrompt: 'Qu\'est-ce que vous aimez faire pendant votre temps libre ?',
    aiPromptTr: 'Boş zamanlarınızda ne yapmayı seversiniz?',
    suggestedAnswer: 'J\'adore lire des livres, voyager et écouter de la musique.',
    suggestedAnswerTr: 'Kitap okumayı, seyahat etmeyi ve müzik dinlemeyi çok severim.',
    xpReward: 40,
    keyVocabulary: ['J\'adore (Çok severim)', 'Voyager (Seyahat etmek)', 'Lire (Okumak)'],
    nativeCoachTip: '"J\'aime" (severim), "J\'adore" (bayılırım/çok severim) derecelendirmesini doğal konuşmada bolca kullanın.'
  },
  {
    day: 7,
    week: 1,
    title: '1. Hafta Kamp Özeti: Kendini Tam Anlat!',
    theme: 'Özgüven & Bütünleşme',
    speakingGoal: 'Je m\'appelle Mehmet, je suis turc et j\'apprends le français avec passion.',
    speakingGoalTr: 'Adım Mehmet, Türküm ve tutkuyla Fransızca öğreniyorum.',
    aiPrompt: 'Bravo pour cette première semaine ! Pouvez-vous vous présenter en trois phrases complètes ?',
    aiPromptTr: 'Bu ilk hafta için tebrikler! Kendinizi üç tam cümleyle tanıtabilir misiniz?',
    suggestedAnswer: 'Je m\'appelle Mehmet, je vis à Istanbul et je parle français chaque jour avec confiance !',
    suggestedAnswerTr: 'Adım Mehmet, İstanbul\'da yaşıyorum ve her gün özgüvenle Fransızca konuşuyorum!',
    xpReward: 60,
    keyVocabulary: ['Avec passion (Tutkuyla)', 'Chaque jour (Her gün)', 'Avec confiance (Özgüvenle)'],
    nativeCoachTip: 'Tebrikler! İlk haftayı tamamladınız. Artık Fransızca temel kimlik ve sipariş cümlelerini duraksamadan kurabiliyorsunuz.'
  },

  // ---------- 2. HAFTA: ŞEHİR HAYATI & PRATİK BECERİLER (8-14. GÜN) ----------
  {
    day: 8,
    week: 2,
    title: 'Yol & Yön Sorma',
    theme: 'Şehir Rehberi',
    speakingGoal: 'Pardon, où se trouve la station de métro la plus proche ?',
    speakingGoalTr: 'Afedersiniz, en yakın metro istasyonu nerede bulunuyor?',
    aiPrompt: 'Vous cherchez votre chemin dans Paris ? Que voulez-vous savoir ?',
    aiPromptTr: 'Paris\'te yolunuzu mu arıyorsunuz? Ne öğrenmek istersiniz?',
    suggestedAnswer: 'Excusez-moi, pour aller au musée du Louvre, c\'est par où ?',
    suggestedAnswerTr: 'Afedersiniz, Louvre Müzesi\'ne gitmek için hangi taraftan gitmeliyim?',
    xpReward: 40,
    keyVocabulary: ['Où se trouve ? (Nerede?)', 'Tout droit (Düz)', 'À gauche / À droite (Solda / Sağda)'],
    nativeCoachTip: '"C\'est par où ?" (Hangi taraftan?) Fransızların sokakta en sık sorduğu doğal yön kalıbıdır.'
  },
  {
    day: 9,
    week: 2,
    title: 'Alışveriş & Fiyat Sorma',
    theme: 'Alışveriş Refleksi',
    speakingGoal: 'Combien coûte cette écharpe, s\'il vous plaît ?',
    speakingGoalTr: 'Bu atkı ne kadar, lütfen?',
    aiPrompt: 'Bonjour ! Puis-je vous renseigner sur un article en vitrine ?',
    aiPromptTr: 'Merhaba! Vitrindeki bir ürün hakkında bilgi verebilir miyim?',
    suggestedAnswer: 'Bonjour ! Oui, combien coûte cette chemise en coton ?',
    suggestedAnswerTr: 'Merhaba! Evet, bu pamuklu gömleğin fiyatı ne kadar?',
    xpReward: 40,
    keyVocabulary: ['Combien coûte ? (Ne kadar?)', 'C\'est cher (Pahalı)', 'Je le prends (Bunu alıyorum)'],
    nativeCoachTip: '"C\'est combien ?" veya "Combien coûte... ?" her alışverişte kurtarıcıdır.'
  },
  {
    day: 10,
    week: 2,
    title: 'Restoranda Masa & Menü İsteme',
    theme: 'Restoran Kültürü',
    speakingGoal: 'Une table pour deux personnes, s\'il vous plaît.',
    speakingGoalTr: 'İki kişilik bir masa lütfen.',
    aiPrompt: 'Bienvenue au bistrot ! Vous avez une réservation ?',
    aiPromptTr: 'Bistroya hoş geldiniz! Rezervasyonunuz var mı?',
    suggestedAnswer: 'Non, nous n\'avons pas de réservation. Avez-vous une table libre ?',
    suggestedAnswerTr: 'Hayır, rezervasyonumuz yok. Boş bir masanız var mı?',
    xpReward: 45,
    keyVocabulary: ['Une table (Bir masa)', 'La carte / Le menu (Menü)', 'Le plat du jour (Günün yemeği)'],
    nativeCoachTip: 'Fransa\'da "Le plat du jour" (Günün yemeği) hem taze hem de ekonomiktir; mutlaka sorun!'
  },
  {
    day: 11,
    week: 2,
    title: 'Toplu Taşıma & Bilet Gişesi',
    theme: 'Ulaşım',
    speakingGoal: 'Je voudrais un ticket de métro aller-retour.',
    speakingGoalTr: 'Gidiş-dönüş bir metro bileti rica ediyorum.',
    aiPrompt: 'Bonjour ! Quel trajet souhaitez-vous effectuer ?',
    aiPromptTr: 'Merhaba! Hangi güzergaha gitmek istiyorsunuz?',
    suggestedAnswer: 'Bonjour ! Je voudrais deux tickets pour le centre-ville, s\'il vous plaît.',
    suggestedAnswerTr: 'Merhaba! Şehir merkezi için iki bilet rica ediyorum, lütfen.',
    xpReward: 45,
    keyVocabulary: ['Un ticket (Bilet)', 'Aller-retour (Gidiş-dönüş)', 'Le centre-ville (Şehir merkezi)'],
    nativeCoachTip: '"Aller simple" tek yön, "aller-retour" ise gidiş-dönüştür.'
  },
  {
    day: 12,
    week: 2,
    title: 'Telefon & Randevu Alma',
    theme: 'İletişim Refleksi',
    speakingGoal: 'Je vous appelle pour prendre un rendez-vous.',
    speakingGoalTr: 'Randevu almak için arıyorum.',
    aiPrompt: 'Cabinet médical, bonjour ! Que puis-je faire pour vous ?',
    aiPromptTr: 'Klinik, iyi günler! Sizin için ne yapabilirim?',
    suggestedAnswer: 'Bonjour ! Je voudrais fixer un rendez-vous pour vendredi matin.',
    suggestedAnswerTr: 'Merhaba! Cuma sabahı için bir randevu oluşturmak istiyorum.',
    xpReward: 45,
    keyVocabulary: ['Prendre rendez-vous (Randevu almak)', 'Fixer (Belirlemek)', 'Vendredi matin (Cuma sabahı)'],
    nativeCoachTip: 'Telefonda "Allô, bonjour" diyerek başlamak tipik Fransız telefon refleksidir.'
  },
  {
    day: 13,
    week: 2,
    title: 'Eczane & Sağlık Şikayeti',
    theme: 'Sağlık',
    speakingGoal: 'J\'ai un gros rhume et mal à la tête.',
    speakingGoalTr: 'Ağır bir nezlem ve baş ağrım var.',
    aiPrompt: 'Bonjour ! Vous semblez fatigué, qu\'est-ce qui ne va pas ?',
    aiPromptTr: 'Merhaba! Yorgun görünüyorsunuz, neyiniz var?',
    suggestedAnswer: 'J\'ai un rhume et de la fièvre. Que me recommandez-vous ?',
    suggestedAnswerTr: 'Nezlem ve ateşim var. Bana ne önerirsiniz?',
    xpReward: 45,
    keyVocabulary: ['Un rhume (Nezle)', 'La fièvre (Ateş)', 'Que recommandez-vous ? (Ne önerirsiniz?)'],
    nativeCoachTip: 'Fransa\'da eczaneler yeşil haç ışığıyla (croix verte) kolayca tanınır.'
  },
  {
    day: 14,
    week: 2,
    title: '2. Hafta Özeti: Paris\'te Bir Gün',
    theme: 'Hızlı Şehir Diyaloğu',
    speakingGoal: 'Aujourd\'hui, j\'ai pris le métro, visité la ville et commandé en français.',
    speakingGoalTr: 'Bugün metroya bindim, şehri gezdim ve Fransızca sipariş verdim.',
    aiPrompt: 'Racontez-moi votre journée idéale à Paris en utilisant au moins trois phrases !',
    aiPromptTr: 'Bana en az üç cümleyle Paris\'teki ideal gününüzü anlatın!',
    suggestedAnswer: 'Le matin, je prends un croissant au café, puis je visite un musée et je me promène au bord de la Seine.',
    suggestedAnswerTr: 'Sabah kafede bir kruvasan yerim, sonra müze gezerim ve Sen Nehri kıyısında yürürüm.',
    xpReward: 70,
    keyVocabulary: ['Se promener (Yürüyüş yapmak)', 'Au bord de (Kıyısında)', 'Idéale (İdeal)'],
    nativeCoachTip: 'İki haftayı geride bıraktınız! Fransızca günlük pratikleri doğal akışa dönüştürdünüz.'
  },

  // ---------- 3. HAFTA: SOSYAL İLETİŞİM & DÜŞÜNCE BELİRTME (15-21. GÜN) ----------
  {
    day: 15,
    week: 3,
    title: 'Hafta Sonu Planları Yapma',
    theme: 'Planlar & Gelecek',
    speakingGoal: 'Ce week-end, je vais me reposer et voir des amis.',
    speakingGoalTr: 'Bu hafta sonu dinleneceğim ve arkadaşlarımla görüşeceğim.',
    aiPrompt: 'Quels sont vos projets pour ce week-end ?',
    aiPromptTr: 'Bu hafta sonu için planlarınız neler?',
    suggestedAnswer: 'Ce samedi, je vais cuisiner et dimanche, je ferai une randonnée en nature.',
    suggestedAnswerTr: 'Bu cumartesi yemek yapacağım ve pazar günü doğada yürüyüşe çıkacağım.',
    xpReward: 50,
    keyVocabulary: ['Ce week-end (Bu hafta sonu)', 'Je vais (Yapacağım/Gideceğim)', 'Une randonnée (Doğa yürüyüşü)'],
    nativeCoachTip: 'Fransızcada yakın gelecek için "aller + mastar fiil" (futur proche) kalıbı en hızlı ve pratik yoldur.'
  },
  {
    day: 16,
    week: 3,
    title: 'Kişisel Fikir Belirtme',
    theme: 'Fikir Paylaşımı',
    speakingGoal: 'À mon avis, cette idée est vraiment excellente.',
    speakingGoalTr: 'Bana göre bu fikir gerçekten mükemmel.',
    aiPrompt: 'Que pensez-vous des nouvelles technologies dans l\'apprentissage ?',
    aiPromptTr: 'Öğrenmede yeni teknolojiler hakkında ne düşünüyorsunuz?',
    suggestedAnswer: 'À mon avis, c\'est très utile parce que cela nous fait gagner du temps.',
    suggestedAnswerTr: 'Bana göre çok faydalı çünkü bu bize zaman kazandırıyor.',
    xpReward: 50,
    keyVocabulary: ['À mon avis (Bana göre)', 'Je pense que (Düşünüyorum ki)', 'Utile (Faydalı)'],
    nativeCoachTip: '"À mon avis..." kalıbı her sohbette fikrinizi şık ve saygılı bir biçimde ortaya koyar.'
  },
  {
    day: 17,
    week: 3,
    title: 'Davet Etme & Kabul Etme',
    theme: 'Sosyal Yaşam',
    speakingGoal: 'Tu veux venir prendre un café avec moi cet après-midi ?',
    speakingGoalTr: 'Bu öğleden sonra benimle bir kahve içmeye gelmek ister misin?',
    aiPrompt: 'Ça vous dirait d\'aller au cinéma ce soir ?',
    aiPromptTr: 'Bu akşam sinemaya gitmeye ne dersiniz?',
    suggestedAnswer: 'Avec grand plaisir ! Quelle heure vous convient le mieux ?',
    suggestedAnswerTr: 'Büyük bir zevkle! Hangi saat size daha iyi uyar?',
    xpReward: 50,
    keyVocabulary: ['Ça vous dirait ? (İster misiniz / Ne dersiniz?)', 'Avec plaisir (Memnuniyetle)', 'Ce soir (Bu akşam)'],
    nativeCoachTip: '"Ça vous dirait de... ?" davet ederken kullanılan en sempatik Fransızca kalıptır.'
  },
  {
    day: 18,
    week: 3,
    title: 'Kibarca Reddetme & Mazeret',
    theme: 'Kibar İletişim',
    speakingGoal: 'Je suis vraiment désolé, j\'ai déjà un empêchement.',
    speakingGoalTr: 'Gerçekten çok üzgünüm, zaten başka bir planım/işim var.',
    aiPrompt: 'Vous êtes libre pour déjeuner ensemble demain midi ?',
    aiPromptTr: 'Yarın öğlen birlikte yemek için müsait misiniz?',
    suggestedAnswer: 'C\'est gentil mais je ne peux pas demain, une prochaine fois avec plaisir !',
    suggestedAnswerTr: 'Çok naziksiniz ama yarın gelemem, başka bir sefer zevkle!',
    xpReward: 50,
    keyVocabulary: ['Je suis désolé (Üzgünüm)', 'Un empêchement (Engel/Mazeret)', 'Une prochaine fois (Başka sefere)'],
    nativeCoachTip: '"C\'est gentil mais..." kalıbı karşı tarafı kırmadan kibarca geri çevirmenin en zarif yoludur.'
  },
  {
    day: 19,
    week: 3,
    title: 'Geçmiş Zaman: Dün Ne Yaptın?',
    theme: 'Geçmişi Anlatma',
    speakingGoal: 'Hier, j\'ai travaillé dur et j\'ai terminé mon projet.',
    speakingGoalTr: 'Dün çok çalıştım ve projemi tamamladım.',
    aiPrompt: 'Comment s\'est passée votre journée d\'hier ?',
    aiPromptTr: 'Dünkü gününüz nasıl geçti?',
    suggestedAnswer: 'Hier, j\'ai passé une excellente journée : j\'ai fait du sport et lu un bon livre.',
    suggestedAnswerTr: 'Dün harika bir gün geçirdim: spor yaptım ve güzel bir kitap okudum.',
    xpReward: 55,
    keyVocabulary: ['Hier (Dün)', 'J\'ai fait (Yaptım)', 'J\'ai passé (Geçirdim)'],
    nativeCoachTip: 'Passé composé zamanında "J\'ai + fiil" yapısı geçmiş deneyimleri akıcı anlatmanın temelidir.'
  },
  {
    day: 20,
    week: 3,
    title: 'Gelecek Hayalleri & Hedefler',
    theme: 'Vizyon & Hedef',
    speakingGoal: 'Dans le futur, j\'aimerais voyager partout en France.',
    speakingGoalTr: 'Gelecekte Fransa\'nın her yerini gezmek isterim.',
    aiPrompt: 'Quel est votre plus grand rêve pour les années à venir ?',
    aiPromptTr: 'Önümüzdeki yıllar için en büyük hayaliniz nedir?',
    suggestedAnswer: 'Mon rêve est de parler couramment français et de découvrir toute l\'Europe.',
    suggestedAnswerTr: 'Hayalim akıcı şekilde Fransızca konuşmak ve tüm Avrupa\'yı keşfetmek.',
    xpReward: 55,
    keyVocabulary: ['J\'aimerais (İsterim)', 'Dans le futur (Gelecekte)', 'Couramment (Akıcı şekilde)'],
    nativeCoachTip: '"J\'aimerais + mastar" geleceğe yönelik zarif dilekleri ifade eder.'
  },
  {
    day: 21,
    week: 3,
    title: '3. Hafta Özeti: Tartışma & Akıcılık',
    theme: 'Akıcı İfade',
    speakingGoal: 'Je peux exprimer mes idées et raconter mes souvenirs en français.',
    speakingGoalTr: 'Fikirlerimi ifade edebiliyor ve anılarımı Fransızca anlatabiliyorum.',
    aiPrompt: 'Félicitations pour ces 21 jours ! Partagez avec moi un souvenir mémorable.',
    aiPromptTr: 'Bu 21 gün için tebrikler! Benimle unutulmaz bir anınızı paylaşın.',
    suggestedAnswer: 'Mon premier voyage à l\'étranger a été inoubliable car j\'ai rencontré des personnes formidables.',
    suggestedAnswerTr: 'Yurtdışındaki ilk seyahatim unutulmazdı çünkü harika insanlarla tanıştım.',
    xpReward: 80,
    keyVocabulary: ['Inoubliable (Unutulmaz)', 'Formidable (Harika)', 'Partager (Paylaşmak)'],
    nativeCoachTip: '3 haftalık eşiği aştınız! Dil bariyeri kalktı, artık düşüncelerinizi doğrudan Fransızca kodluyorsunuz.'
  },

  // ---------- 4. HAFTA: PROFESYONEL & AKICI İFADE (22-30. GÜN) ----------
  {
    day: 22,
    week: 4,
    title: 'İş Mülakatı: Güçlü Yönlerin',
    theme: 'Profesyonel İletişim',
    speakingGoal: 'Je suis quelqu\'un de motivé et rigoureux dans mon travail.',
    speakingGoalTr: 'İşimde motive ve disiplinli biriyim.',
    aiPrompt: 'Pourquoi devrions-nous choisir votre profil pour ce poste ?',
    aiPromptTr: 'Bu pozisyon için neden sizin profilinizi seçmeliyiz?',
    suggestedAnswer: 'Grâce à mon expérience et mon sens du travail d\'équipe, je peux apporter des solutions concrètes.',
    suggestedAnswerTr: 'Deneyimim ve takım çalışması anlayışım sayesinde somut çözümler üretebilirim.',
    xpReward: 60,
    keyVocabulary: ['Rigoureux (Disiplinli/Titiz)', 'Le travail d\'équipe (Takım çalışması)', 'Concret (Somut)'],
    nativeCoachTip: 'Fransız iş mülakatlarında "rigoureux" (titiz/disiplinli) ve "autonome" (bağımsız) anahtar kelimelerdir.'
  },
  {
    day: 23,
    week: 4,
    title: 'Toplantıda Teklif Sunma',
    theme: 'İş Dünyası',
    speakingGoal: 'Je propose d\'adopter une stratégie plus collaborative.',
    speakingGoalTr: 'Daha işbirlikçi bir strateji benimsemeyi öneriyorum.',
    aiPrompt: 'Avez-vous une suggestion pour optimiser notre projet ?',
    aiPromptTr: 'Projemizi optimize etmek için bir öneriniz var mı?',
    suggestedAnswer: 'Je suggère d\'automatiser cette étape afin de gagner du temps chaque semaine.',
    suggestedAnswerTr: 'Her hafta zaman kazanmak amacıyla bu adımı otomatikleştirmeyi öneriyorum.',
    xpReward: 60,
    keyVocabulary: ['Je propose (Öneriyorum)', 'Afin de (Amacıyla / -mesi için)', 'Optimiser (Optimize etmek)'],
    nativeCoachTip: '"Afin de + mastar" iş Fransızcasında neden ve amaç belirtirken en saygın bağlaçtır.'
  },
  {
    day: 24,
    week: 4,
    title: 'Resmi E-posta & Yazışma Refleksi',
    theme: 'Yazışma',
    speakingGoal: 'Veuillez trouver ci-joint les documents nécessaires.',
    speakingGoalTr: 'Gerekli belgeleri ekte bulabilirsiniz.',
    aiPrompt: 'Comment concluez-vous un e-mail professionnel en français ?',
    aiPromptTr: 'Fransızca profesyonel bir e-postayı nasıl tamamlarsınız?',
    suggestedAnswer: 'Je reste à votre entière disposition et vous souhaite une excellente journée.',
    suggestedAnswerTr: 'Her zaman yardıma hazır olduğumu belirtir, mükemmel bir gün dilerim.',
    xpReward: 60,
    keyVocabulary: ['Ci-joint (Ekte)', 'À votre disposition (Hizmetinizde/Kullanımınıza hazır)', 'Bien cordialement (Saygılarımla)'],
    nativeCoachTip: '"Bien cordialement" profesyonel Fransızca e-postaların en popüler ve şık kapanışıdır.'
  },
  {
    day: 25,
    week: 4,
    title: 'Problem Çözme & Kibar Şikayet',
    theme: 'Problem Yönetimi',
    speakingGoal: 'Il semble y avoir une petite erreur dans ma commande.',
    speakingGoalTr: 'Siparişimde küçük bir hata var gibi görünüyor.',
    aiPrompt: 'Bonjour monsieur/madame, quel est le problème avec votre commande ?',
    aiPromptTr: 'İyi günler beyefendi/hanımefendi, siparişinizle ilgili problem nedir?',
    suggestedAnswer: 'Il manque un article dans le colis, pouvez-vous vérifier s\'il vous plaît ?',
    suggestedAnswerTr: 'Pakette bir ürün eksik, kontrol edebilir misiniz lütfen?',
    xpReward: 65,
    keyVocabulary: ['Il semble y avoir (Var gibi görünüyor)', 'Une erreur (Bir hata)', 'Vérifier (Kontrol etmek)'],
    nativeCoachTip: '"Il semble y avoir..." (Görünüşe göre... var) suçlayıcı olmadan problemi çözmenin en zarif yöntemidir.'
  },
  {
    day: 26,
    week: 4,
    title: 'İkna Etme & Argüman Savunma',
    theme: 'İkna Becerisi',
    speakingGoal: 'Les données montrent clairement que cette approche fonctionne.',
    speakingGoalTr: 'Veriler bu yaklaşımın işe yaradığını açıkça gösteriyor.',
    aiPrompt: 'Pourquoi pensez-vous que votre solution est la meilleure ?',
    aiPromptTr: 'Neden sizin çözümünüzün en iyisi olduğunu düşünüyorsunuz?',
    suggestedAnswer: 'Parce qu\'elle réduit les coûts tout en augmentant la satisfaction de nos clients.',
    suggestedAnswerTr: 'Çünkü müşteri memnuniyetimizi artırırken aynı zamanda maliyetleri düşürüyor.',
    xpReward: 65,
    keyVocabulary: ['Clairement (Açıkça)', 'Réduire les coûts (Maliyetleri düşürmek)', 'Augmenter (Artırmak)'],
    nativeCoachTip: '"Tout en + particip prés (örn: tout en augmentant)" eş zamanlı iki faydayı bağlarken Fransızca konuşmayı profesyonelleştirir.'
  },
  {
    day: 27,
    week: 4,
    title: 'Kültür & Sinema Sohbeti',
    theme: 'Kültür & Sanat',
    speakingGoal: 'Ce film français m\'a profondément touché par son authenticité.',
    speakingGoalTr: 'Bu Fransız filmi doğallığıyla beni derinden etkiledi.',
    aiPrompt: 'Avez-vous un film ou un artiste français préféré ?',
    aiPromptTr: 'En sevdiğiniz Fransız filmi ya da sanatçısı var mı?',
    suggestedAnswer: 'J\'adore le cinéma d\'auteur français pour la subtilité de ses émotions et ses dialogues.',
    suggestedAnswerTr: 'Duygularının ve diyaloglarının inceliği nedeniyle Fransız yazar sinemasına bayılırım.',
    xpReward: 70,
    keyVocabulary: ['Profondément (Derinden)', 'L\'authenticité (Doğallık/Orijinallik)', 'La subtilité (İncelik)'],
    nativeCoachTip: 'Fransız sohbetlerinde kültür ve sanat konuları insanları hızla yakınlaştıran en zengin başlıktır.'
  },
  {
    day: 28,
    week: 4,
    title: 'Detaylı Seyahat Hikayesi',
    theme: 'Anlatım Gücü',
    speakingGoal: 'Ce voyage m\'a permis de découvrir des paysages spectaculaires.',
    speakingGoalTr: 'Bu seyahat muhteşem manzaralar keşfetmemi sağladı.',
    aiPrompt: 'Racontez-moi une expérience de voyage marquante.',
    aiPromptTr: 'Bana etkileyici bir seyahat deneyiminizi anlatın.',
    suggestedAnswer: 'Quand j\'ai visité le sud de la France, la beauté des villages médiévaux m\'a fasciné.',
    suggestedAnswerTr: 'Güney Fransa\'yı ziyaret ettiğimde ortaçağ köylerinin güzelliği beni büyüledi.',
    xpReward: 70,
    keyVocabulary: ['Spectaculaire (Görkemli)', 'M\'a permis de (Bana ... sağladı)', 'Fasciner (Büyülemek)'],
    nativeCoachTip: '"Ça m\'a permis de..." (Bana imkan tanıdı / yapmamı sağladı) ileri seviye akıcılığın göstergesidir.'
  },
  {
    day: 29,
    week: 4,
    title: 'Doğaçlama & Spontane Konuşma',
    theme: 'Hızlı Düşünme',
    speakingGoal: 'Même face à l\'imprévu, je sais m\'adapter et communiquer calmement.',
    speakingGoalTr: 'Beklenmedik durumlarda bile uyum sağlamayı ve sakince iletişim kurmayı bilirim.',
    aiPrompt: 'Si vos plans changent soudainement, comment réagissez-vous ?',
    aiPromptTr: 'Planlarınız aniden değişirse nasıl tepki verirsiniz?',
    suggestedAnswer: 'Je garde mon calme, j\'analyse la situation et je trouve une alternative efficace.',
    suggestedAnswerTr: 'Sakinliğimi korurum, durumu analiz ederim ve etkili bir alternatif bulurum.',
    xpReward: 80,
    keyVocabulary: ['Garder son calme (Sakin kalmak)', 'S\'adapter (Uyum sağlamak)', 'Une alternative (Alternatif)'],
    nativeCoachTip: 'Son güne bir adım kaldı! Artık düşünmeden Fransızca tepki verebiliyorsunuz.'
  },
  {
    day: 30,
    week: 4,
    title: 'BÜYÜK FİNAL: 30 Günlük Fransızca Mezuniyeti!',
    theme: 'Doğal Refleks & Özgüven',
    speakingGoal: 'Je parle français sans aucune hésitation et avec une grande fierté !',
    speakingGoalTr: 'Hiçbir tereddüt duymadan ve büyük bir gururla Fransızca konuşuyorum!',
    aiPrompt: 'Félicitations pour ces 30 jours extraordinaires ! Qu\'avez-vous appris et comment vous sentez-vous ?',
    aiPromptTr: 'Bu olağanüstü 30 gün için tebrikler! Neler öğrendiniz ve kendinizi nasıl hissediyorsunuz?',
    suggestedAnswer: 'Après ces trente jours intensifs, je parle français avec aisance, je n\'ai plus peur de faire des erreurs et je suis fier de mon parcours !',
    suggestedAnswerTr: 'Bu otuz yoğun günün ardından rahatça iletişim kuruyorum, artık hata yapmaktan korkmuyorum ve yolculuğumla gurur duyuyorum!',
    xpReward: 150,
    keyVocabulary: ['Avec aisance (Rahatlıkla)', 'Fier de (Gururlu)', 'Mon parcours (Yolculuğum/Gelişimim)'],
    nativeCoachTip: '🏆 30 GÜNLÜK FRANSIZCA KAMPI TAMAMLANDI! Sıfırdan başladınız ve şimdi gerçek hayatta, iş görüşmesinde, seyahatte doğal refleksle konuşuyorsunuz. Tebrikler, siz artık bir Chirmo Fransızca Konuşmacısısınız!'
  }
];
