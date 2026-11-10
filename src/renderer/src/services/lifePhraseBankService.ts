/**
 * lifePhraseBankService.ts
 * CHIRMO — Günlük Yaşam Kelime & Kalıp Cümle Deposu
 * 
 * Türkiye'deki kullanıcıların "anlıyorum ama konuşamıyorum" sorununu çözen,
 * Türkçe düşünme / kelime kelime çevirme tuzağını kıran,
 * 12 hayati yaşam alanında hazır Lego kalıpları (Chunks) sunan konuşma motoru.
 */

import { SupportedLanguage } from './targetLanguageService';

export type LifeCategoryKey =
  | 'cafe_dining'
  | 'travel_transit'
  | 'shopping_bargain'
  | 'hotel_stay'
  | 'health_emergency'
  | 'social_making_friends'
  | 'work_professional'
  | 'feelings_reactions'
  | 'quick_fillers'
  | 'home_daily_routines'
  | 'bank_official'
  | 'slang_idioms';

export interface LifeCategory {
  id: LifeCategoryKey;
  title: string;
  emoji: string;
  badge: string;
  description: string;
}

export interface LifePhraseItem {
  id: string;
  category: LifeCategoryKey;
  targetLang: SupportedLanguage;
  phrase: string;
  tr: string;
  phonetic: string;
  logicTip: string;
  difficulty: 'starter' | 'daily' | 'fluent';
  tags: string[];
}

export const LIFE_CATEGORIES: LifeCategory[] = [
  {
    id: 'cafe_dining',
    title: 'Kafe & Restoran',
    emoji: '☕',
    badge: 'Yeme & İçme',
    description: 'Sipariş verme, hesap isteme, alerji bildirme ve yerli gibi masa isteme kalıpları.'
  },
  {
    id: 'travel_transit',
    title: 'Ulaşım & Taksi',
    emoji: '🚕',
    badge: 'Seyahat',
    description: 'Taksi çağırma, metro bileti alma, yön sorma ve havalimanı pasaport geçişleri.'
  },
  {
    id: 'shopping_bargain',
    title: 'Alışveriş & Mağaza',
    emoji: '🛍️',
    badge: 'Alışveriş',
    description: 'Fiyat sorma, beden arama, indirim isteme ve fiş/fatura sorma refleksleri.'
  },
  {
    id: 'hotel_stay',
    title: 'Otel & Konaklama',
    emoji: '🏨',
    badge: 'Konaklama',
    description: 'Check-in, oda kartı arızası, geç çıkış (late check-out) ve Wi-Fi şifresi isteme.'
  },
  {
    id: 'health_emergency',
    title: 'Sağlık & Eczane',
    emoji: '💊',
    badge: 'Acil & Sağlık',
    description: 'Eczaneden ilaç isteme, ağrı tarif etme, doktora derdini anlatma ve acil yardım.'
  },
  {
    id: 'social_making_friends',
    title: 'Tanışma & Sosyal Yaşam',
    emoji: '👋',
    badge: 'Arkadaşlık',
    description: 'Buzları eritme, sohbet başlatma, numara isteme, iltifat etme ve vedalaşma.'
  },
  {
    id: 'work_professional',
    title: 'İş & Günlük Meslek',
    emoji: '💼',
    badge: 'Kariyer',
    description: 'Toplantıda söz alma, e-posta açılış/kapanışları, fikir beyanı ve izin isteme.'
  },
  {
    id: 'feelings_reactions',
    title: 'Duygular & Tepkiler',
    emoji: '🎯',
    badge: 'Reaksiyon',
    description: 'Katılma, şaşırma, itiraz etme, teselli verme ve spontane tepki refleksleri.'
  },
  {
    id: 'quick_fillers',
    title: 'Konuşma Dolguları',
    emoji: '⚡',
    badge: 'Akıcılık Sırrı',
    description: 'Düşünürken sessiz kalmamak için yerlilerin kullandığı akıcılık bağlaçları.'
  },
  {
    id: 'home_daily_routines',
    title: 'Ev & Günlük Yaşam',
    emoji: '🏠',
    badge: 'Ev Hayatı',
    description: 'Market alışverişi, yemek yapma, ev işleri ve günlük aile diyalogları.'
  },
  {
    id: 'bank_official',
    title: 'Banka & Resmi Daire',
    emoji: '🏛️',
    badge: 'Resmi İşler',
    description: 'Para bozdurma, ATM kullanma, adres bildirimi ve resmi evrak sorma.'
  },
  {
    id: 'slang_idioms',
    title: 'Sokak Dili & Deyimler',
    emoji: '🔥',
    badge: 'Yerli Refleks',
    description: 'Ders kitaplarında yazmayan ama dizilerde ve sokakta sürekli duyulan kalıplar.'
  }
];

export const LIFE_PHRASE_BANK: LifePhraseItem[] = [
  // ==================== 1. KAFE & RESTORAN (İNGİLİZCE) ====================
  {
    id: 'en-cafe-1',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Can I get an iced latte with oat milk, please?',
    tr: 'Yulaf sütlü bir buzlu latte alabilir miyim lütfen?',
    phonetic: 'Ken ay get en ayst late vit oht milk, pliiz?',
    logicTip: 'Türkçe gibi "istiyorum" (I want) demek kaba gelebilir. Yerliler "Can I get..." (alabilir miyim) kalıbını otomatik kullanır.',
    difficulty: 'starter',
    tags: ['siparis', 'kahve', 'restoran']
  },
  {
    id: 'en-cafe-2',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Could we get the check, please? We’d like to split it.',
    tr: 'Hesabı alabilir miyiz lütfen? Ayrı ayrı ödemek istiyoruz.',
    phonetic: 'Kud vi get dı çek pliiz? Viid layk tu split it.',
    logicTip: '"Hesap" için İngilizler "bill", Amerikalılar "check" der. "Split it" hesabı bölüşmektir.',
    difficulty: 'daily',
    tags: ['hesap', 'restoran', 'odeme']
  },
  {
    id: 'en-cafe-3',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Table for two, please. Outside if possible.',
    tr: 'İki kişilik bir masa lütfen. Mümkünse dışarıda olsun.',
    phonetic: 'Teybıl for tuu pliiz. Autsayd if posıbıl.',
    logicTip: 'Uzun uzun "Biz iki kişiyiz masa istiyoruz" demeyin; yerliler sadece "Table for [kişi sayısı]" der.',
    difficulty: 'starter',
    tags: ['masa', 'giris', 'restoran']
  },
  {
    id: 'en-cafe-4',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Does this dish contain any nuts? I have a severe allergy.',
    tr: 'Bu yemekte fındık/fıstık var mı? Ciddi bir alerjim var.',
    phonetic: 'Daz dis diş kınteyn eni nats? Ay hev e sıviır alerci.',
    logicTip: 'Alerji bildiriminde "contain" (içermek) ve "severe allergy" (ciddi alerji) hayat kurtarır.',
    difficulty: 'daily',
    tags: ['alerji', 'saglik', 'yemek']
  },
  {
    id: 'en-cafe-5',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Could I get this to go, please?',
    tr: 'Bunu paket yaptırabilir miyim lütfen?',
    phonetic: 'Kud ay get dis tu goh pliiz?',
    logicTip: 'Paket yaptırmak için "package" denmez; her zaman "to go" veya "takeaway" denir.',
    difficulty: 'starter',
    tags: ['paket', 'siparis']
  },

  // ==================== 1. KAFE & RESTORAN (FRANSIZCA) ====================
  {
    id: 'fr-cafe-1',
    category: 'cafe_dining',
    targetLang: 'fr',
    phrase: 'Je voudrais un café au lait et un croissant, s\'il vous plaît.',
    tr: 'Sütlü bir kahve ve bir kruvasan rica ediyorum, lütfen.',
    phonetic: 'Jö vudre ö̃ kafe o le e ö̃ kruvasan, sil vu ple.',
    logicTip: 'Fransızcada "Je veux" (istiyorum) kabalık sayılabilir. Nezaket için her zaman "Je voudrais..." kullanılır.',
    difficulty: 'starter',
    tags: ['kahve', 'kruvasan', 'siparis', 'kafe']
  },
  {
    id: 'fr-cafe-2',
    category: 'cafe_dining',
    targetLang: 'fr',
    phrase: 'L\'addition, s\'il vous plaît ! Pouvons-nous payer séparément ?',
    tr: 'Hesap lütfen! Ayrı ayrı ödeyebilir miyiz?',
    phonetic: 'Ladisyon sil vu ple! Puvon nu peye separeman?',
    logicTip: 'Hesabı bölüşmek istediğinizde "payer séparément" kalıbı doğrudan anlaşılır.',
    difficulty: 'daily',
    tags: ['hesap', 'odeme', 'restoran']
  },
  {
    id: 'fr-cafe-3',
    category: 'cafe_dining',
    targetLang: 'fr',
    phrase: 'Gardez la monnaie, merci !',
    tr: 'Üstü kalsın, teşekkürler! (Bahşiş)',
    phonetic: 'Garde la mone, mersi!',
    logicTip: 'Para üstünü bahşiş olarak bırakırken söylenecek en doğal Fransız refleksidir.',
    difficulty: 'starter',
    tags: ['bahsis', 'odeme']
  },
  {
    id: 'fr-cafe-4',
    category: 'cafe_dining',
    targetLang: 'fr',
    phrase: 'Avez-vous une table pour deux personnes en terrasse ?',
    tr: 'Teras bölümünde iki kişilik boş bir masanız var mı?',
    phonetic: 'Ave vu ün tabl pur dö person an teras?',
    logicTip: 'Fransa kafelerinde "en terrasse" (açık terasta/dışarıda) oturmak en popüler tercihtir.',
    difficulty: 'starter',
    tags: ['masa', 'teras', 'restoran']
  },
  {
    id: 'fr-cafe-5',
    category: 'cafe_dining',
    targetLang: 'fr',
    phrase: 'Qu\'est-ce que vous me conseillez comme plat du jour ?',
    tr: 'Günün yemeği olarak ne tavsiye edersiniz?',
    phonetic: 'Kes kö vu mö konseye kom pla dü jur?',
    logicTip: 'Günün yemeği (plat du jour) hem lezzetli hem ekonomiktir; Fransız restoranlarında ilk sorulacak sorudur.',
    difficulty: 'daily',
    tags: ['tavsiye', 'menu', 'yemek']
  },

  // ==================== 2. ULAŞIM & SEYAHAT (FRANSIZCA) ====================
  {
    id: 'fr-travel-1',
    category: 'travel_transit',
    targetLang: 'fr',
    phrase: 'Pardon, de quel quai part le train pour Paris ?',
    tr: 'Afedersiniz, Paris treni hangi perondan kalkıyor?',
    phonetic: 'Pardon, dö kel ke par lö tren pur Pari?',
    logicTip: 'Fransa tren garlarında peron için "quai" kelimesi kullanılır.',
    difficulty: 'starter',
    tags: ['tren', 'gar', 'peron']
  },
  {
    id: 'fr-travel-2',
    category: 'travel_transit',
    targetLang: 'fr',
    phrase: 'Un ticket de métro aller-retour, s\'il vous plaît.',
    tr: 'Gidiş-dönüş bir metro bileti lütfen.',
    phonetic: 'Ö̃ tike dö metro ale-retur, sil vu ple.',
    logicTip: '"Aller simple" tek yön, "aller-retour" ise gidiş-dönüş biletidir.',
    difficulty: 'starter',
    tags: ['metro', 'bilet', 'ulasim']
  },
  {
    id: 'fr-travel-3',
    category: 'travel_transit',
    targetLang: 'fr',
    phrase: 'Pouvez-vous m\'emmener à l\'aéroport Charles de Gaulle ?',
    tr: 'Beni Charles de Gaulle Havalimanı\'na götürebilir misiniz?',
    phonetic: 'Puve vu manmene a laeropor Şarl dö Gol?',
    logicTip: 'Taksiye bindiğinizde "Pouvez-vous m\'emmener à..." en pratik ve zarif ifadedir.',
    difficulty: 'daily',
    tags: ['taksi', 'havalimani', 'seyahat']
  },

  // ==================== 3. ALIŞVERİŞ (FRANSIZCA) ====================
  {
    id: 'fr-shop-1',
    category: 'shopping_bargain',
    targetLang: 'fr',
    phrase: 'Combien coûte cette écharpe, s\'il vous plaît ?',
    tr: 'Bu atkı ne kadar, lütfen?',
    phonetic: 'Kombiyen kut set eşarp, sil vu ple?',
    logicTip: 'Fiyat sorarken en hızlı refleks: "Combien coûte... ?" veya sadece "C\'est combien ?".',
    difficulty: 'starter',
    tags: ['fiyat', 'alisveris']
  },
  {
    id: 'fr-shop-2',
    category: 'shopping_bargain',
    targetLang: 'fr',
    phrase: 'Puis-je l\'essayer ? Où sont les cabines d\'essayage ?',
    tr: 'Bunu deneyebilir miyim? Deneme kabinleri nerede?',
    phonetic: 'Püij lese-ye? U son le kabin dese-yaj?',
    logicTip: 'Giyim mağazalarında deneme kabini "cabine d\'essayage" olarak adlandırılır.',
    difficulty: 'daily',
    tags: ['kabin', 'deneme', 'magaza']
  },
  {
    id: 'fr-shop-3',
    category: 'shopping_bargain',
    targetLang: 'fr',
    phrase: 'Est-ce que vous acceptez les paiements par carte bancaire ?',
    tr: 'Kredi kartıyla ödeme kabul ediyor musunuz?',
    phonetic: 'Es kö vu zaksepte le peman par kart bankeer?',
    logicTip: 'Fransa\'da kartla ödeme için "carte bancaire" (veya kısaca CB) denir.',
    difficulty: 'starter',
    tags: ['kart', 'odeme']
  },

  // ==================== 4. İŞ & TOPLANTI (FRANSIZCA) ====================
  {
    id: 'fr-work-1',
    category: 'work_professional',
    targetLang: 'fr',
    phrase: 'Est-ce que la réunion de demain à 10 heures vous convient ?',
    tr: 'Yarın saat 10\'daki toplantı size uyar mı?',
    phonetic: 'Es kö la reünyon dö dömen a diiz ör vu konviyen?',
    logicTip: '"Ça vous convient ?" (Size uyar mı?) profesyonel Fransızcada en yaygın toplantı mutabakatıdır.',
    difficulty: 'daily',
    tags: ['toplanti', 'is', 'saat']
  },
  {
    id: 'fr-work-2',
    category: 'work_professional',
    targetLang: 'fr',
    phrase: 'Je vous tiens informé dès que le projet avance.',
    tr: 'Proje ilerledikçe sizi haberdar edeceğim.',
    phonetic: 'Jö vu tiyen enforme de kö lö proje avans.',
    logicTip: '"Je vous tiens informé(e)" Fransız kurumsal kültürünün en güven veren refleksidir.',
    difficulty: 'fluent',
    tags: ['bilgilendirme', 'kariyer', 'eposta']
  },
  {
    id: 'fr-work-3',
    category: 'work_professional',
    targetLang: 'fr',
    phrase: 'Veuillez trouver ci-joint les documents nécessaires.',
    tr: 'Gerekli belgeleri ekte bulabilirsiniz.',
    phonetic: 'Vöye truve si-juan le doküman neseseer.',
    logicTip: 'Fransızca resmi e-postalarda ek dosya bildirimi daima "ci-joint" ifadesiyle yapılır.',
    difficulty: 'daily',
    tags: ['eposta', 'ek', 'belge']
  },

  // ==================== 5. SOSYAL & TANIŞMA (FRANSIZCA) ====================
  {
    id: 'fr-social-1',
    category: 'social_making_friends',
    targetLang: 'fr',
    phrase: 'Enchanté de faire votre connaissance ! D\'où venez-vous ?',
    tr: 'Tanıştığımıza çok memnun oldum! Nerelisiniz?',
    phonetic: 'Anşante dö feer vötr konisans! Du vöne vu?',
    logicTip: '"Enchanté(e)" Fransız tanışmalarının vazgeçilmez temel taşıdır.',
    difficulty: 'starter',
    tags: ['tanisma', 'nerelisin', 'arkadas']
  },
  {
    id: 'fr-social-2',
    category: 'social_making_friends',
    targetLang: 'fr',
    phrase: 'Ça te dirait de prendre un verre ensemble ce soir ?',
    tr: 'Bu akşam birlikte bir şeyler içmeye ne dersin?',
    phonetic: 'Sa tö dire dö prandr ö̃ veer ansambl sö suar?',
    logicTip: '"Prendre un verre" (bir kadeh/bardak bir şeyler içmek) Fransa\'da arkadaş buluşmasının standart tabiridir.',
    difficulty: 'daily',
    tags: ['davet', 'arkadaslik', 'aksam']
  },

  // ==================== 1. KAFE & RESTORAN (ALMANCA) ====================
  {
    id: 'de-cafe-1',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Ich hätte gerne einen Cappuccino mit Hafermilch, bitte.',
    tr: 'Yulaf sütlü bir kapuçino rica edebilir miyim lütfen?',
    phonetic: 'İh hete gerne aynen Kapuçino mit Hafermilh, bite.',
    logicTip: 'Almancada "Ich will" (istiyorum) emrivakidir. Her zaman nezaket kalıbı olan "Ich hätte gerne..." kullanılır.',
    difficulty: 'starter',
    tags: ['kahve', 'siparis', 'kafe']
  },
  {
    id: 'de-cafe-2',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Die Rechnung, bitte! Zusammen oder getrennt?',
    tr: 'Hesap lütfen! Birlikte mi yoksa ayrı ayrı mı?',
    phonetic: 'Dii Rehnung bite! Tuzamen oder getrent?',
    logicTip: 'Almanya\'da garson hesabı getirdiğinde daima "Zusammen oder getrennt?" diye sorar. "Getrennt" (ayrı) en yaygın yanıttır.',
    difficulty: 'daily',
    tags: ['hesap', 'odeme']
  },
  {
    id: 'de-cafe-3',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Stimmt so, danke!',
    tr: 'Üstü kalsın, teşekkürler! (Bahşiş)',
    phonetic: 'Ştimt zo, danke!',
    logicTip: 'Bahşiş bırakırken para üstünü istemediğinizi söylemenin en doğal Alman refleksidir.',
    difficulty: 'starter',
    tags: ['bahsis', 'odeme']
  },
  {
    id: 'de-cafe-4',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Haben Sie einen Tisch für zwei Personen frei?',
    tr: 'İki kişilik boş bir masanız var mı?',
    phonetic: 'Haben zii aynen Tiş für zvay Perzonen fray?',
    logicTip: 'Restorana girince doğrudan sorulan en zarif karşılama kalıbıdır.',
    difficulty: 'starter',
    tags: ['masa', 'rezervasyon']
  },

  // ==================== 2. ULAŞIM & TAKSİ (İNGİLİZCE) ====================
  {
    id: 'en-travel-1',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'Could you drop me off at the corner, please?',
    tr: 'Beni şu köşede indirebilir misiniz lütfen?',
    phonetic: 'Kud yu drop mi of et dı kornır pliiz?',
    logicTip: 'Arabada birini indirmek fiili "drop off"tur. "Stop here" yerine çok daha doğaldır.',
    difficulty: 'daily',
    tags: ['taksi', 'ulasim']
  },
  {
    id: 'en-travel-2',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'How much will it cost to get to the airport?',
    tr: 'Havalimanına gitmek ne kadar tutar?',
    phonetic: 'Haw maç vil it kost tu get tu dı eyrport?',
    logicTip: 'Taksiye binmeden önce fiyatta sürpriz yaşamamak için sorulan standart refleks.',
    difficulty: 'starter',
    tags: ['taksi', 'havalimani', 'fiyat']
  },
  {
    id: 'en-travel-3',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'Excuse me, which platform does the train to central station leave from?',
    tr: 'Afedersiniz, merkez istasyona giden tren hangi perondan kalkıyor?',
    phonetic: 'Ekskyuz mi, viç pletform daz dı treyn tu sentrıl steyşın liiv from?',
    logicTip: 'Peron sormada "which platform" ve "leave from" ayrılmaz bir ikilidir.',
    difficulty: 'daily',
    tags: ['tren', 'metro', 'ulasim']
  },
  {
    id: 'en-travel-4',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'I’m in a bit of a rush, could we take the fastest route?',
    tr: 'Biraz acelem var, en hızlı güzergâhtan gidebilir miyiz?',
    phonetic: 'Aym in e bit ov e raş, kud vi teyk dı festıst ruut?',
    logicTip: '"Acelem var" demek için "I have hurry" denmez! "I’m in a rush" denir.',
    difficulty: 'fluent',
    tags: ['taksi', 'acele']
  },

  // ==================== 2. ULAŞIM & TAKSİ (ALMANCA) ====================
  {
    id: 'de-travel-1',
    category: 'travel_transit',
    targetLang: 'de',
    phrase: 'Könnten Sie mich bitte an der nächsten Ecke rauslassen?',
    tr: 'Beni lütfen bir sonraki köşede indirebilir misiniz?',
    phonetic: 'Köhnten zii mih bite an der nehsten Eke rauslasen?',
    logicTip: 'Almancada araçtan inmek için "rauslassen" (dışarı bırakmak/indirmek) kalıbı kullanılır.',
    difficulty: 'daily',
    tags: ['taksi', 'ulasim']
  },
  {
    id: 'de-travel-2',
    category: 'travel_transit',
    targetLang: 'de',
    phrase: 'Von welchem Gleis fährt der Zug nach Berlin ab?',
    tr: 'Berlin treni hangi perondan kalkıyor?',
    phonetic: 'Fon velhem Glays fehrt der Tsug nah Berlin ap?',
    logicTip: 'Almanya tren garlarında (DB) peron kelimesi "Gleis"tir. Tren kalkışı "abfahren" fiilidir.',
    difficulty: 'starter',
    tags: ['tren', 'gar', 'ulasim']
  },
  {
    id: 'de-travel-3',
    category: 'travel_transit',
    targetLang: 'de',
    phrase: 'Ich habe es sehr eilig, bitte den schnellsten Weg.',
    tr: 'Çok acelem var, lütfen en hızlı yoldan gidelim.',
    phonetic: 'İh habe es zer aylih, bite deyn şnelsten Veeg.',
    logicTip: 'Almancada "acelem var" kalıbı "Ich habe es eilig" olarak kalıplaşmıştır.',
    difficulty: 'daily',
    tags: ['taksi', 'acele']
  },

  // ==================== 3. ALIŞVERİŞ & MAĞAZA (İNGİLİZCE) ====================
  {
    id: 'en-shop-1',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Do you have this in a medium or large size?',
    tr: 'Bunun orta (M) veya büyük (L) bedeni var mı?',
    phonetic: 'Du yu hev dis in e midiyum or larc sayz?',
    logicTip: 'Beden sorarken "in a [beden] size" kalıbı kullanılır.',
    difficulty: 'starter',
    tags: ['alisveris', 'beden']
  },
  {
    id: 'en-shop-2',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Can I try this on? Where are the fitting rooms?',
    tr: 'Bunu üzerimde deneyebilir miyim? Giyinme kabinleri nerede?',
    phonetic: 'Ken ay tray dis on? Vehr ar dı fiting rumz?',
    logicTip: 'Kıyafet denemek "try on"dır. Kabin ise "fitting room" veya "changing room" olarak geçer.',
    difficulty: 'starter',
    tags: ['kabin', 'kiyafet']
  },
  {
    id: 'en-shop-3',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Is there any discount if I pay in cash?',
    tr: 'Nakit ödersem herhangi bir indirim olur mu?',
    phonetic: 'İz der eni diskaunt if ay pey in keş?',
    logicTip: 'Pazarlık yapmanın en kibar ve etkili yoludur. "In cash" nakit demektir.',
    difficulty: 'daily',
    tags: ['indirim', 'nakit', 'fiyat']
  },

  // ==================== 3. ALIŞVERİŞ & MAĞAZA (ALMANCA) ====================
  {
    id: 'de-shop-1',
    category: 'shopping_bargain',
    targetLang: 'de',
    phrase: 'Haben Sie das auch in einer Nummer kleiner oder größer?',
    tr: 'Bunun bir beden küçüğü ya da büyüğü var mı?',
    phonetic: 'Haben zii das auh in ayna Numa klayna oda gröhsa?',
    logicTip: 'Almancada kıyafet bedeni sorarken "eine Nummer kleiner/größer" tabiri kullanılır.',
    difficulty: 'daily',
    tags: ['alisveris', 'beden']
  },
  {
    id: 'de-shop-2',
    category: 'shopping_bargain',
    targetLang: 'de',
    phrase: 'Wo sind die Umkleidekabinen? Ich möchte das anprobieren.',
    tr: 'Giyinme kabinleri nerede? Bunu denemek istiyorum.',
    phonetic: 'Vo zint dii Umklaydekabiinen? İh möhte das anprobiiren.',
    logicTip: 'Kıyafet denemek "anprobieren" fiilidir.',
    difficulty: 'starter',
    tags: ['kabin', 'deneme']
  },

  // ==================== 4. SAĞLIK & ECZANE (İNGİLİZCE) ====================
  {
    id: 'en-health-1',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'I have a splitting headache and a sore throat.',
    tr: 'Şiddetli bir baş ağrım ve boğaz ağrım var.',
    phonetic: 'Ay hev e spliting hedeyk end e sor troht.',
    logicTip: 'Dayanılmaz baş ağrısı için "splitting headache" (başım çatlıyor) deyimi kullanılır.',
    difficulty: 'daily',
    tags: ['saglik', 'eczane', 'agri']
  },
  {
    id: 'en-health-2',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'Do I need a prescription for this medicine?',
    tr: 'Bu ilaç için reçeteye ihtiyacım var mı?',
    phonetic: 'Du ay niid e priskripşın for dis medisın?',
    logicTip: 'Yurtdışı eczanelerinde "prescription" (reçete) sormak en hayati konudur.',
    difficulty: 'daily',
    tags: ['eczane', 'recete', 'ilac']
  },
  {
    id: 'en-health-3',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'I feel dizzy and nauseous. I need a doctor.',
    tr: 'Başım dönüyor ve midem bulanıyor. Bir doktora ihtiyacım var.',
    phonetic: 'Ay fiil dizi end nozıyıs. Ay niid e daktır.',
    logicTip: '"Dizzy" (baş dönmesi) ve "nauseous" (mide bulantısı) acil tıbbi kelimelerdir.',
    difficulty: 'starter',
    tags: ['acil', 'doktor']
  },

  // ==================== 4. SAĞLIK & ECZANE (ALMANCA) ====================
  {
    id: 'de-health-1',
    category: 'health_emergency',
    targetLang: 'de',
    phrase: 'Ich brauche etwas gegen Halsschmerzen und Fieber.',
    tr: 'Boğaz ağrısı ve ateşe karşı bir şeye ihtiyacım var.',
    phonetic: 'İh brauhe etvas geygen Halşmertsen und Fiiba.',
    logicTip: 'Almanya eczanelerinde derdinizi söylerken "etwas gegen..." (…-e karşı bir ilaç) kalıbı kullanılır.',
    difficulty: 'starter',
    tags: ['eczane', 'ilac']
  },
  {
    id: 'de-health-2',
    category: 'health_emergency',
    targetLang: 'de',
    phrase: 'Ist dieses Medikament rezeptpflichtig?',
    tr: 'Bu ilaç reçeteye tabi mi (reçeteli mi)?',
    phonetic: 'İst diizes Medikament retsept-pflihtih?',
    logicTip: 'Almanya\'da reçeteli ilaçlar için standart terim "rezeptpflichtig"dir.',
    difficulty: 'daily',
    tags: ['eczane', 'recete']
  },

  // ==================== 5. OTEL & KONAKLAMA (İNGİLİZCE) ====================
  {
    id: 'en-hotel-1',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'I have a reservation under the name John Smith.',
    tr: 'John Smith adına yapılmış bir rezervasyonum var.',
    phonetic: 'Ay hev e rezırveyşın andır dı neym Can Smit.',
    logicTip: 'Rezervasyon söylerken "under the name..." (adı altında) denir.',
    difficulty: 'starter',
    tags: ['otel', 'checkin']
  },
  {
    id: 'en-hotel-2',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'Is it possible to request a late check-out tomorrow?',
    tr: 'Yarın için geç çıkış (late check-out) talep etmem mümkün mü?',
    phonetic: 'İz it posıbıl tu rikvest e leyt çek-aut tumorov?',
    logicTip: 'Uçağı akşam olanların otelde kalış süresini uzatmak için kullandığı en kibar kalıptır.',
    difficulty: 'daily',
    tags: ['otel', 'cikis']
  },
  {
    id: 'en-hotel-3',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'The air conditioning in room 304 isn’t working properly.',
    tr: '304 numaralı odadaki klima düzgün çalışmıyor.',
    phonetic: 'Dı eyr kındişining in ruum trii-oh-for izınt vorking prapırli.',
    logicTip: 'Arıza bildiriminde "isn’t working properly" (düzgün çalışmıyor) en zarif şikayet kalıbıdır.',
    difficulty: 'daily',
    tags: ['otel', 'ariza']
  },

  // ==================== 5. OTEL & KONAKLAMA (ALMANCA) ====================
  {
    id: 'de-hotel-1',
    category: 'hotel_stay',
    targetLang: 'de',
    phrase: 'Ich habe ein Zimmer auf den Namen Kaya reserviert.',
    tr: 'Kaya adına ayırtılmış bir odam var.',
    phonetic: 'İh habe ayn Tsima auf deyn Namen Kaya rezerviirt.',
    logicTip: 'Otelde isim belirtirken "auf den Namen..." kalıbı kullanılır.',
    difficulty: 'starter',
    tags: ['otel', 'rezervasyon']
  },
  {
    id: 'de-hotel-2',
    category: 'hotel_stay',
    targetLang: 'de',
    phrase: 'Könnte ich bitte das WLAN-Passwort haben?',
    tr: 'Wi-Fi şifresini alabilir miyim lütfen?',
    phonetic: 'Köhnte ih bite das V-Lan Pasvort haben?',
    logicTip: 'Almanca konuşulan ülkelerde Wi-Fi yerine her zaman "WLAN" (Ve-Lan) denir.',
    difficulty: 'starter',
    tags: ['wifi', 'otel']
  },

  // ==================== 6. TANIŞMA & SOSYAL YAŞAM (İNGİLİZCE) ====================
  {
    id: 'en-social-1',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'It was really great meeting you! We should definitely stay in touch.',
    tr: 'Seninle tanışmak gerçekten harikaydı! Kesinlikle iletişimde kalalım.',
    phonetic: 'İt vaz rıyli greyt miiting yu! Vi şud defınıtli stey in taç.',
    logicTip: 'Yeni biriyle ayrılırken "stay in touch" (iletişimde kalmak) en sıcak dostluk ifadesidir.',
    difficulty: 'daily',
    tags: ['tanisma', 'arkadaslik']
  },
  {
    id: 'en-social-2',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'What do you do for a living?',
    tr: 'Ne iş yapıyorsunuz? / Geçiminizi nasıl sağlıyorsunuz?',
    phonetic: 'Vat du yu du for e living?',
    logicTip: '"What is your job?" yerine anadili İngilizce olanlar neredeyse her zaman bu kalıbı sorar.',
    difficulty: 'starter',
    tags: ['meslek', 'sohbet']
  },
  {
    id: 'en-social-3',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'Are you from around here or just visiting?',
    tr: 'Buralı mısınız yoksa sadece ziyaretçi mi?',
    phonetic: 'Ar yu from ıraund hiir or cast viziting?',
    logicTip: 'Biriyle sohbet başlatmak için dünyanın en popüler buz kırıcı (ice-breaker) sorusudur.',
    difficulty: 'starter',
    tags: ['tanisma', 'sohbet']
  },

  // ==================== 6. TANIŞMA & SOSYAL YAŞAM (ALMANCA) ====================
  {
    id: 'de-social-1',
    category: 'social_making_friends',
    targetLang: 'de',
    phrase: 'Freut mich sehr, Sie kennenzulernen!',
    tr: 'Sizinle tanıştığıma çok memnun oldum!',
    phonetic: 'Froyt mih zer, Zii kenentsulernen!',
    logicTip: 'Almancada tanışma nezaketinin zirvesidir. Akıcı ve otomatik telaffuz edilmelidir.',
    difficulty: 'starter',
    tags: ['tanisma', 'nezaket']
  },
  {
    id: 'de-social-2',
    category: 'social_making_friends',
    targetLang: 'de',
    phrase: 'Was machst du beruflich?',
    tr: 'Mesleğin ne? Ne işle meşgulsün?',
    phonetic: 'Vas mahst du beruuflih?',
    logicTip: 'Almancada iş sormanın en doğal ve modern yolu "Was machst du beruflich?"dir.',
    difficulty: 'starter',
    tags: ['meslek', 'sohbet']
  },

  // ==================== 7. İŞ & OFİS YAŞAMI (İNGİLİZCE) ====================
  {
    id: 'en-work-1',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'Could you please loop me in on that email thread?',
    tr: 'Beni de lütfen o e-posta zincirine dahil eder misiniz?',
    phonetic: 'Kud yu pliiz luup mi in on det iymeyl tred?',
    logicTip: 'Global iş dünyasında "beni de ekleyin" demek için "loop me in" kalıbı kullanılır.',
    difficulty: 'fluent',
    tags: ['is', 'ofis', 'eposta']
  },
  {
    id: 'en-work-2',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'Let’s circle back to this point during our next meeting.',
    tr: 'Bu konuya bir sonraki toplantımızda tekrar dönelim.',
    phonetic: 'Lets sörkıl bek tu dis poynt dyuring aur nekst miiting.',
    logicTip: '"Konuya geri dönmek" için iş İngilizcesinde "circle back" ifadesi standarttır.',
    difficulty: 'fluent',
    tags: ['toplanti', 'is']
  },
  {
    id: 'en-work-3',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'I’d like to add something to what Sarah just said.',
    tr: 'Sarah’nın az önce söylediklerine bir şey eklemek istiyorum.',
    phonetic: 'Ayd layk tu ed samting tu vat Sera cast sed.',
    logicTip: 'Online Zoom/Teams toplantılarında kibarca söz almanın altın kalıbıdır.',
    difficulty: 'daily',
    tags: ['toplanti', 'sozalma']
  },

  // ==================== 7. İŞ & OFİS YAŞAMI (ALMANCA) ====================
  {
    id: 'de-work-1',
    category: 'work_professional',
    targetLang: 'de',
    phrase: 'Könnten Sie mich bitte in CC setzen?',
    tr: 'Beni de lütfen CC\'ye ekleyebilir misiniz?',
    phonetic: 'Köhnten zii mih bite in Tse-Tse zettsen?',
    logicTip: 'Almanya iş dünyasında e-postaya bilgi ekleme ricasının standart biçimidir.',
    difficulty: 'daily',
    tags: ['is', 'eposta']
  },
  {
    id: 'de-work-2',
    category: 'work_professional',
    targetLang: 'de',
    phrase: 'Ich stimme diesem Vorschlag voll und ganz zu.',
    tr: 'Bu öneriye sonuna kadar / tamamen katılıyorum.',
    phonetic: 'İh ştime diizem Forşlaag fol und gants tsu.',
    logicTip: 'Toplantıda güçlü ve profesyonel bir destek bildirmek için "voll und ganz zustimmen" kullanılır.',
    difficulty: 'daily',
    tags: ['is', 'toplanti']
  },

  // ==================== 8. DUYGULAR & TEPKİLER (İNGİLİZCE) ====================
  {
    id: 'en-feel-1',
    category: 'feelings_reactions',
    targetLang: 'en',
    phrase: 'You’ve got to be kidding me! That’s incredible!',
    tr: 'Şaka yapıyor olmalısın! Bu inanılmaz!',
    phonetic: 'Yuv gat tu bi kiding mi! Dets inkredıbıl!',
    logicTip: 'Şaşkınlık ve heyecan anında saniyesinde ağızdan çıkan doğal tepki refleksidir.',
    difficulty: 'starter',
    tags: ['tepki', 'saskinlik']
  },
  {
    id: 'en-feel-2',
    category: 'feelings_reactions',
    targetLang: 'en',
    phrase: 'I totally agree with you on that one.',
    tr: 'O konuda seninle tamamen aynı fikirdeyim.',
    phonetic: 'Ay totıli egrii vit yu on det van.',
    logicTip: 'Katılma refleksi: "I am agree" denmez! Her zaman "I agree" denir.',
    difficulty: 'starter',
    tags: ['katilma', 'fikir']
  },

  // ==================== 8. DUYGULAR & TEPKİLER (ALMANCA) ====================
  {
    id: 'de-feel-1',
    category: 'feelings_reactions',
    targetLang: 'de',
    phrase: 'Das ist ja Wahnsinn! Das kann ich kaum glauben!',
    tr: 'Bu tam bir çılgınlık! Buna neredeyse inanamıyorum!',
    phonetic: 'Das ist ya Vaanzin! Das kan ih kaum glauben!',
    logicTip: 'Almancada pozitif veya negatif büyük şaşkınlık anlarında "Wahnsinn!" haykırılır.',
    difficulty: 'daily',
    tags: ['tepki', 'saskinlik']
  },
  {
    id: 'de-feel-2',
    category: 'feelings_reactions',
    targetLang: 'de',
    phrase: 'Genau das habe ich auch gedacht!',
    tr: 'Tam olarak ben de öyle düşünmüştüm!',
    phonetic: 'Genau das habe ih auh gedaht!',
    logicTip: 'Bir Alman ile konuşurken en samimi hemfikir olma cümlesidir.',
    difficulty: 'starter',
    tags: ['katilma', 'samimiyet']
  },

  // ==================== 9. KONUŞMA DOLGULARI (İNGİLİZCE) ====================
  {
    id: 'en-filler-1',
    category: 'quick_fillers',
    targetLang: 'en',
    phrase: 'To be honest, I haven’t really thought about that yet.',
    tr: 'Dürüst olmak gerekirse, bunu henüz pek düşünmedim.',
    phonetic: 'Tu bi anıst, ay hevınt rıyli toot ebaut det yet.',
    logicTip: 'Düşünmek için zaman kazanırken yerlilerin en çok kullandığı giriş kalıbıdır.',
    difficulty: 'daily',
    tags: ['dolgu', 'akicilik']
  },
  {
    id: 'en-filler-2',
    category: 'quick_fillers',
    targetLang: 'en',
    phrase: 'As far as I know, the event starts at seven.',
    tr: 'Bildiğim kadarıyla etkinlik saat yedide başlıyor.',
    phonetic: 'Ez far ez ay noh, dı ivent starts et sevın.',
    logicTip: '"Bildiğim kadarıyla" demek konuşmaya anında akıcı bir yerli havası katar.',
    difficulty: 'starter',
    tags: ['dolgu', 'akicilik']
  },
  {
    id: 'en-filler-3',
    category: 'quick_fillers',
    targetLang: 'en',
    phrase: 'Anyway, long story short, we made it on time.',
    tr: 'Neyse, lafı uzatmayayım, zamanında yetiştik.',
    phonetic: 'Enivey, long stori şort, vi meyd it on taym.',
    logicTip: '"Long story short" (özetle/kısacası) konuşmayı toparlayan vazgeçilmez deyimdir.',
    difficulty: 'daily',
    tags: ['dolgu', 'baglac']
  },

  // ==================== 9. KONUŞMA DOLGULARI (ALMANCA) ====================
  {
    id: 'de-filler-1',
    category: 'quick_fillers',
    targetLang: 'de',
    phrase: 'Um ehrlich zu sein, weiß ich das im Moment nicht.',
    tr: 'Dürüst olmak gerekirse, şu anda bunu bilmiyorum.',
    phonetic: 'Um ehrlich tsu zayn, vays ih das im Moment niht.',
    logicTip: 'Almancada düşünürken "ııı" demek yerine kullanılan en profesyonel zaman kazanma kalıbı.',
    difficulty: 'daily',
    tags: ['dolgu', 'akicilik']
  },
  {
    id: 'de-filler-2',
    category: 'quick_fillers',
    targetLang: 'de',
    phrase: 'Na ja, wie man so schön sagt...',
    tr: 'Ne derler bilirsin, öyle dedikleri gibi...',
    phonetic: 'Na ya, vii man zo şöhn zaagt...',
    logicTip: 'Almanca günlük konuşmada "Na ja" kelimesi akıcılığın ve yerli tınısının kalbidir.',
    difficulty: 'starter',
    tags: ['dolgu', 'akicilik']
  },

  // ==================== 10. EV & GÜNLÜK RUTİNLER (İNGİLİZCE & ALMANCA) ====================
  {
    id: 'en-home-1',
    category: 'home_daily_routines',
    targetLang: 'en',
    phrase: 'Could you give me a hand with taking out the trash?',
    tr: 'Çöpü dışarı çıkarmama bir el atabilir misin?',
    phonetic: 'Kud yu giv mi e hend vit teyking aut dı treş?',
    logicTip: 'Yardım istemede "give me a hand" (el vermek/yardım etmek) samimi aile/ev arkadaşı kalıbıdır.',
    difficulty: 'starter',
    tags: ['ev', 'yardim']
  },
  {
    id: 'de-home-1',
    category: 'home_daily_routines',
    targetLang: 'de',
    phrase: 'Kannst du mir kurz beim Kochen helfen?',
    tr: 'Yemek yaparken bana kısaca yardım edebilir misin?',
    phonetic: 'Kanst du miir kurts baym Kohen helfen?',
    logicTip: 'Ev içinde "kurz" (kısaca) eklemek ricanızı çok daha sıcak ve sempatik kılar.',
    difficulty: 'starter',
    tags: ['ev', 'yemek']
  },

  // ==================== 11. BANKA & RESMİ DAİRE (İNGİLİZCE & ALMANCA) ====================
  {
    id: 'en-bank-1',
    category: 'bank_official',
    targetLang: 'en',
    phrase: 'I’d like to exchange some euros into dollars, what’s the current rate?',
    tr: 'Biraz Euro’yu Dolar’a çevirmek istiyorum, güncel kur nedir?',
    phonetic: 'Ayd layk tu eksçeync sam yuurohz intu dalırz, vats dı körınt reyt?',
    logicTip: 'Döviz bozdururken "exchange ... into" kalıbı kullanılır.',
    difficulty: 'daily',
    tags: ['banka', 'doviz']
  },
  {
    id: 'de-bank-1',
    category: 'bank_official',
    targetLang: 'de',
    phrase: 'Ich möchte gerne ein deutsches Girokonto eröffnen.',
    tr: 'Bir Alman vadesiz mevduat hesabı (Girokonto) açmak istiyorum.',
    phonetic: 'İh möhte gerne ayn doyçes Jirokonto eröffnen.',
    logicTip: 'Almanya\'da standart banka hesabına "Girokonto" denir. Hayatın olmazsa olmazıdır.',
    difficulty: 'daily',
    tags: ['banka', 'hesap']
  },

  // ==================== 12. SOKAK DİLİ & DEYİMLER (İNGİLİZCE & ALMANCA) ====================
  {
    id: 'en-slang-1',
    category: 'slang_idioms',
    targetLang: 'en',
    phrase: 'No worries at all, don’t sweat it!',
    tr: 'Hiç dert etme, kafana takma bile!',
    phonetic: 'Noh variiz et ol, dohnt svet it!',
    logicTip: '"Don’t sweat it" (terleme/kafana takma), günlük Amerikan sokak dilinde en çok duyulan teselli cümlesidir.',
    difficulty: 'starter',
    tags: ['sokak', 'deyim']
  },
  {
    id: 'en-slang-2',
    category: 'slang_idioms',
    targetLang: 'en',
    phrase: 'I’m feeling a bit under the weather today.',
    tr: 'Bugün kendimi biraz kırgın / hasta hissediyorum.',
    phonetic: 'Aym fiiling e bit andır dı vedır tudey.',
    logicTip: 'Hafif kırgınlık için "I’m sick" demek yerine yerliler "under the weather" der.',
    difficulty: 'daily',
    tags: ['deyim', 'hastalik']
  },
  {
    id: 'de-slang-1',
    category: 'slang_idioms',
    targetLang: 'de',
    phrase: 'Das ist mir völlig Wurst!',
    tr: 'Bana göre hava hoş! / Hiç umurumda değil!',
    phonetic: 'Das ist miir föllih Vurst!',
    logicTip: 'Alman sokak kültürünün en ünlü deyimidir ("Bana sosis gibi"). Umursamazlık veya fark etmezlik bildirir.',
    difficulty: 'starter',
    tags: ['sokak', 'deyim']
  },
  {
    id: 'de-slang-2',
    category: 'slang_idioms',
    targetLang: 'de',
    phrase: 'Ich drücke dir ganz fest die Daumen!',
    tr: 'Sana canı gönülden şans diliyorum! (Parmaklarımı sıkıyorum)',
    phonetic: 'İh drüke diir gants fest dii Daumen!',
    logicTip: 'Şans dilemek anlamında Almancada en sık kullanılan samimi deyim "Daumen drücken"dir.',
    difficulty: 'starter',
    tags: ['deyim', 'sans']
  },

  // ==================== GENİŞLETİLMİŞ KONUŞMA METİNLERİ (12 KATEGORİ • TÜM SEVİYELER • EN & DE) ====================

  // --- 1. KAFE & RESTORAN (EK METİNLER) ---
  {
    id: 'en-cafe-6',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Could we get a table for four by the window, if possible?',
    tr: 'Mümkünse pencere kenarında dört kişilik bir masa alabilir miyiz?',
    phonetic: 'Kud vi get e teybıl for foor bay dı vindou, if pasıbıl?',
    logicTip: '"By the window" pencere kenarında demektir. Sonuna "if possible" eklemek ricayı çok kibar yapar.',
    difficulty: 'daily',
    tags: ['restoran', 'masa', 'pencere']
  },
  {
    id: 'en-cafe-7',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'What would you recommend from the chef’s specials today?',
    tr: 'Bugün şefin özel spesiyallerinden ne önerirsiniz?',
    phonetic: 'Vat vud yu rekomend fram dı şefs speşılz tudey?',
    logicTip: 'Menüde kararsız kaldığında garsona sorabileceğin en doğal ve akıcı cümledir.',
    difficulty: 'fluent',
    tags: ['restoran', 'oneri', 'menu']
  },
  {
    id: 'en-cafe-8',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Could I have the dressing on the side, please?',
    tr: 'Salata sosunu yanında ayrı alabilir miyim lütfen?',
    phonetic: 'Kud ay hev dı dresing on dı sayd, pliiz?',
    logicTip: '"On the side" sos veya garnitürün yemeğin üzerine dökülmeden ayrı bir kapta gelmesini sağlar.',
    difficulty: 'fluent',
    tags: ['restoran', 'salata', 'sos']
  },
  {
    id: 'en-cafe-9',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Can I get this to go, please?',
    tr: 'Bunu paket (al-götür) olarak alabilir miyim lütfen?',
    phonetic: 'Ken ay get dis tu gou, pliiz?',
    logicTip: 'Kafede veya restoranda paket yaptırmak için "to go" veya "takeaway" kullanılır.',
    difficulty: 'starter',
    tags: ['kafe', 'paket', 'siparis']
  },
  {
    id: 'de-cafe-4',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Was können Sie uns heute besonders empfehlen?',
    tr: 'Bugün bize özellikle ne tavsiye edersiniz?',
    phonetic: 'Vas könen Zii uns hoyte bezonders empfeelen?',
    logicTip: '"Empfehlen" tavsiye etmek/önermek demektir. Restoranlarda çok sık kullanılır.',
    difficulty: 'fluent',
    tags: ['restoran', 'tavsiye', 'almanca']
  },
  {
    id: 'de-cafe-5',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Könnten Sie uns bitte noch etwas Brot und Wasser bringen?',
    tr: 'Bize lütfen biraz daha ekmek ve su getirebilir misiniz?',
    phonetic: 'Könten Zii uns bite noh etvas Broot unt Vaser bringen?',
    logicTip: '"Noch etwas..." (biraz daha...) masaya ek sipariş verirken çok pratiktir.',
    difficulty: 'daily',
    tags: ['restoran', 'su', 'ekmek']
  },
  {
    id: 'de-cafe-6',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Zum Mitnehmen, bitte!',
    tr: 'Paket olsun (götürmek için), lütfen!',
    phonetic: 'Tsum Mitneemen, bite!',
    logicTip: 'Kafede veya fırında "Burada mı yiyeceksiniz?" sorusuna verilen en kısa paket cevabıdır.',
    difficulty: 'starter',
    tags: ['kafe', 'paket', 'almanca']
  },

  // --- 2. ULAŞIM & TAKSİ (EK METİNLER) ---
  {
    id: 'en-travel-5',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'Excuse me, does this train stop at the central station?',
    tr: 'Affedersiniz, bu tren merkez istasyonda duruyor mu?',
    phonetic: 'Ekskyuuz mi, daz dis treyn stap et dı sentrıl steyşın?',
    logicTip: 'Yanlış trene veya otobüse binmemek için kapıda sorulacak en pratik sorudur.',
    difficulty: 'starter',
    tags: ['tren', 'istasyon', 'ulasim']
  },
  {
    id: 'en-travel-6',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'Could you drop me off right in front of the main entrance?',
    tr: 'Beni tam ana girişin önünde indirebilir misiniz?',
    phonetic: 'Kud yu drap mi of rayt in frant ov dı meyn entrıns?',
    logicTip: 'Takside "inmek/bırakmak" için "drop off" kalıbı kullanılır.',
    difficulty: 'daily',
    tags: ['taksi', 'inmek', 'ulasim']
  },
  {
    id: 'en-travel-7',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'My flight has been delayed, so I might miss my connecting flight.',
    tr: 'Uçuşum rötar yaptı, bu yüzden aktarma uçuşumu kaçırabilirim.',
    phonetic: 'May flayt hez biin dileyd, sou ay mayt mis may konekting flayt.',
    logicTip: '"Connecting flight" aktarma uçuşu demektir; havalimanında görevliden yardım isterken hayat kurtarır.',
    difficulty: 'fluent',
    tags: ['havalimani', 'ucus', 'aktarma']
  },
  {
    id: 'en-travel-8',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'Where can I rent a car or buy a weekly transit pass?',
    tr: 'Nereden araç kiralayabilir veya haftalık ulaşım kartı alabilirim?',
    phonetic: 'Ver ken ay rent e kar or bay e viikli trenzit pes?',
    logicTip: 'Turistik gezilerde toplu taşıma kartına "transit pass" denir.',
    difficulty: 'daily',
    tags: ['bilet', 'arac', 'ulasim']
  },
  {
    id: 'de-travel-4',
    category: 'travel_transit',
    targetLang: 'de',
    phrase: 'Muss ich bei dieser Verbindung irgendwo umsteigen?',
    tr: 'Bu seferde herhangi bir yerde aktarma yapmam gerekiyor mu?',
    phonetic: 'Mus ih bay diizer Ferbindung irgentvo umştaygen?',
    logicTip: '"Umsteigen" tren veya otobüs değiştirmek (aktarma yapmak) demektir.',
    difficulty: 'daily',
    tags: ['tren', 'aktarma', 'almanca']
  },
  {
    id: 'de-travel-5',
    category: 'travel_transit',
    targetLang: 'de',
    phrase: 'Können Sie mich bitte direkt vor dem Hotel absetzen?',
    tr: 'Beni lütfen doğrudan otelin önünde indirebilir misiniz?',
    phonetic: 'Könen Zii mih bite direkt foor dem Hotel abzetsen?',
    logicTip: 'Takside bir yerde indirilmek için "absetzen" veya "rauslassen" kullanılır.',
    difficulty: 'fluent',
    tags: ['taksi', 'otel', 'almanca']
  },

  // --- 3. ALIŞVERİŞ & MAĞAZA (EK METİNLER - B2+ DAHİL) ---
  {
    id: 'en-shop-4',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Do you have this jacket in a smaller size or a different color?',
    tr: 'Bu ceketin bir küçük bedeni veya farklı bir rengi var mı?',
    phonetic: 'Du yu hev dis cekıt in e smolır sayz or e difrınt kalır?',
    logicTip: 'Beden ve renk sorarken "in a smaller/larger size" kalıbı kullanılır.',
    difficulty: 'daily',
    tags: ['magaza', 'beden', 'renk']
  },
  {
    id: 'en-shop-5',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'What is your return policy if the item doesn’t fit properly?',
    tr: 'Ürün tam olmazsa iade politikanız nedir?',
    phonetic: 'Vat iz yor ritörn palısi if dı aytım dazınt fit prapırli?',
    logicTip: '"Return policy" iade kuralları demektir; alışveriş yapmadan önce sormak çok yaygındır.',
    difficulty: 'fluent',
    tags: ['iade', 'alisveris', 'degisim']
  },
  {
    id: 'en-shop-6',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'I’d like to get a refund or exchange this for another model, please.',
    tr: 'Para iadesi almak veya bunu başka bir modelle değiştirmek istiyorum lütfen.',
    phonetic: 'Ayd layk tu get e rifand or eksçeync dis for enadır madıl, pliiz.',
    logicTip: '"Refund" para iadesi, "exchange" ise ürün değişimi anlamına gelir.',
    difficulty: 'fluent',
    tags: ['iade', 'degisim', 'fatura']
  },
  {
    id: 'en-shop-7',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Could I get a tax-free form for this purchase, please?',
    tr: 'Bu alışveriş için vergi iadesi (Tax-Free) formu alabilir miyim lütfen?',
    phonetic: 'Kud ay get e teks-frii form for dis pörçıs, pliiz?',
    logicTip: 'Yurt dışı alışverişlerinde havalimanında vergi iadesi almak için kasada bu cümle söylenir.',
    difficulty: 'fluent',
    tags: ['vergi', 'taxfree', 'alisveris']
  },
  {
    id: 'en-shop-8',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Where are the fitting rooms, please?',
    tr: 'Deneme kabinleri nerede acaba?',
    phonetic: 'Ver ar dı fiting ruumz, pliiz?',
    logicTip: 'Giyim mağazalarında deneme kabinine "fitting room" veya "changing room" denir.',
    difficulty: 'starter',
    tags: ['kabin', 'kiyafet', 'magaza']
  },
  {
    id: 'de-shop-3',
    category: 'shopping_bargain',
    targetLang: 'de',
    phrase: 'Wo finde ich bitte die Umkleidekabinen?',
    tr: 'Deneme kabinlerini nerede bulabilirim lütfen?',
    phonetic: 'Vo finde ih bite dii Umklaydekabiinen?',
    logicTip: '"Umkleidekabine" soyunma/deneme kabini demektir.',
    difficulty: 'starter',
    tags: ['kabin', 'magaza', 'almanca']
  },
  {
    id: 'de-shop-4',
    category: 'shopping_bargain',
    targetLang: 'de',
    phrase: 'Kann ich diesen Artikel innerhalb von 14 Tagen umtauschen, falls er nicht passt?',
    tr: 'Eğer uymazsa bu ürünü 14 gün içinde değiştirebilir miyim?',
    phonetic: 'Kan ih diizen Artikel inerhalp fon firtsen Tagen umtauşen, fals er niht past?',
    logicTip: '"Umtauschen" ürünü değiştirmek, "zurückgeben" ise iade etmek demektir.',
    difficulty: 'fluent',
    tags: ['degisim', 'iade', 'almanca']
  },

  // --- 4. OTEL & KONAKLAMA (EK METİNLER) ---
  {
    id: 'en-hotel-4',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'Is breakfast included in the room rate, and what time is it served?',
    tr: 'Kahvaltı oda fiyatına dahil mi ve saat kaçta servis ediliyor?',
    phonetic: 'İz brekfıst inkluudıd in dı ruum reyt, end vat taym iz it sörvd?',
    logicTip: 'Otele giriş yaparken resepsiyona sorulan en temel sorulardan biridir.',
    difficulty: 'daily',
    tags: ['otel', 'kahvalti', 'resepsiyon']
  },
  {
    id: 'en-hotel-5',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'The air conditioning in my room isn’t working properly. Could someone take a look?',
    tr: 'Odamdaki klima düzgün çalışmıyor. Biri gelip bakabilir mi?',
    phonetic: 'Dı er kondişıning in may ruum izınt vörking prapırli. Kud samvan teyk e luk?',
    logicTip: 'Otelde bir arıza bildirmek için "isn’t working properly" kalıbı çok kibardır.',
    difficulty: 'fluent',
    tags: ['otel', 'ariza', 'oda']
  },
  {
    id: 'en-hotel-6',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'Could we leave our luggage at the front desk after check-out?',
    tr: 'Çıkış yaptıktan sonra bavullarımızı resepsiyona bırakabilir miyiz?',
    phonetic: 'Kud vi liiv aur lagıc et dı frant desk eftır çek-aut?',
    logicTip: 'Uçak saatine kadar bavulları otele emanet etmek için bu cümle kullanılır.',
    difficulty: 'fluent',
    tags: ['otel', 'bavul', 'emanet']
  },
  {
    id: 'de-hotel-3',
    category: 'hotel_stay',
    targetLang: 'de',
    phrase: 'Ist das Frühstück im Zimmerpreis inbegriffen?',
    tr: 'Kahvaltı oda fiyatına dahil mi?',
    phonetic: 'İst das Früüştük im Tsimerprays inbegrifen?',
    logicTip: '"Im Preis inbegriffen" fiyata dahil demektir.',
    difficulty: 'daily',
    tags: ['otel', 'kahvalti', 'almanca']
  },
  {
    id: 'de-hotel-4',
    category: 'hotel_stay',
    targetLang: 'de',
    phrase: 'Könnten wir unser Gepäck nach dem Check-out noch ein paar Stunden hier lassen?',
    tr: 'Çıkıştan sonra bavullarımızı birkaç saat daha burada bırakabilir miyiz?',
    phonetic: 'Könten vir unzer Gepek nah dem Çek-aut noh ayn paar Ştunden hiir lasen?',
    logicTip: '"Gepäck" bagaj/bavul demektir ve çoğul eki almaz.',
    difficulty: 'fluent',
    tags: ['otel', 'bavul', 'almanca']
  },

  // --- 5. SAĞLIK & ECZANE (EK METİNLER) ---
  {
    id: 'en-health-4',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'Do I need a prescription for this medicine, or can I buy it over the counter?',
    tr: 'Bu ilaç için reçete gerekiyor mu yoksa reçetesiz alabilir miyim?',
    phonetic: 'Du ay niid e priskripşın for dis medısın, or ken ay bay it ouvır dı kauntır?',
    logicTip: '"Over the counter" (OTC) reçetesiz satılan ilaçlar için kullanılan standart ifadedir.',
    difficulty: 'fluent',
    tags: ['eczane', 'recete', 'ilac']
  },
  {
    id: 'en-health-5',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'I’ve had a sore throat and a slight fever since yesterday evening.',
    tr: 'Dün akşamdan beri boğaz ağrım ve hafif ateşim var.',
    phonetic: 'Ayv hed e sor trout end e slayt fiivır sins yestırdey iivning.',
    logicTip: 'Doktora veya eczacıya şikayetinin ne zamandır sürdüğünü anlatırken kullanılır.',
    difficulty: 'daily',
    tags: ['doktor', 'ates', 'bogaz']
  },
  {
    id: 'en-health-6',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'How many times a day should I take these pills, before or after meals?',
    tr: 'Bu hapları günde kaç kez almalıyım, yemekten önce mi sonra mı?',
    phonetic: 'Hav meni taymz e dey şud ay teyk diiz pilz, bifor or eftır miilz?',
    logicTip: 'Eczaneden ilaç alırken kullanım dozunu sormak için idealdir.',
    difficulty: 'fluent',
    tags: ['ilac', 'kullanim', 'eczane']
  },
  {
    id: 'de-health-3',
    category: 'health_emergency',
    targetLang: 'de',
    phrase: 'Brauche ich dafür ein Rezept oder ist das rezeptfrei?',
    tr: 'Bunun için reçeteye ihtiyacım var mı yoksa reçetesiz mi?',
    phonetic: 'Brauhe ih dafür ayn Retsept oder ist das retseptfray?',
    logicTip: '"Rezeptfrei" reçetesiz satılan ilaçlar demektir.',
    difficulty: 'daily',
    tags: ['eczane', 'recete', 'almanca']
  },
  {
    id: 'de-health-4',
    category: 'health_emergency',
    targetLang: 'de',
    phrase: 'Wie oft am Tag muss ich diese Tabletten einnehmen?',
    tr: 'Bu tabletleri günde kaç kez almam gerekiyor?',
    phonetic: 'Vii oft am Tag mus ih diize Tableten aynneemen?',
    logicTip: 'İlaç içmek/almak için Almancada "einnehmen" fiili kullanılır.',
    difficulty: 'fluent',
    tags: ['ilac', 'eczane', 'almanca']
  },

  // --- 6. TANIŞMA & SOSYAL YAŞAM (EK METİNLER) ---
  {
    id: 'en-social-4',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'How long have you been living in this city?',
    tr: 'Ne zamandır bu şehirde yaşıyorsun?',
    phonetic: 'Hav long hev yu biin living in dis siti?',
    logicTip: 'Yeni tanıştığın biriyle sohbeti derinleştirmek için en doğal sorulardan biridir.',
    difficulty: 'daily',
    tags: ['tanisma', 'sohbet', 'sehir']
  },
  {
    id: 'en-social-5',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'It was great catching up with you! Let’s definitely do this again soon.',
    tr: 'Seninle sohbet edip hasret gidermek harikaydı! Yakında mutlaka tekrarlayalım.',
    phonetic: 'İt vaz greyt keçing ap vit yu! Lets definıtli du dis egeyn suun.',
    logicTip: '"Catch up" bir arkadaşıyla buluşup son gelişmeleri konuşmak demektir.',
    difficulty: 'fluent',
    tags: ['sohbet', 'veda', 'arkadas']
  },
  {
    id: 'en-social-6',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'Are you free this weekend to grab a cup of coffee?',
    tr: 'Bu hafta sonu bir kahve içmek için müsait misin?',
    phonetic: 'Ar yu frii dis viikend tu greb e kap ov kafi?',
    logicTip: '"Grab a coffee" hızlı ve samimi bir kahve buluşması teklifidir.',
    difficulty: 'daily',
    tags: ['davet', 'kahve', 'haftasonu']
  },
  {
    id: 'de-social-3',
    category: 'social_making_friends',
    targetLang: 'de',
    phrase: 'Hast du am Wochenende Lust, zusammen einen Kaffee trinken zu gehen?',
    tr: 'Hafta sonu birlikte bir kahve içmeye gitmeye ne dersin (isteğin var mı)?',
    phonetic: 'Hast du am Vohen-ende Lust, tsuzamen aynen Kafee trinken tsu geyen?',
    logicTip: '"Hast du Lust..." (Canın ister mi / Ne dersin) sosyal davetlerin en doğal kalıbıdır.',
    difficulty: 'daily',
    tags: ['davet', 'kahve', 'almanca']
  },
  {
    id: 'de-social-4',
    category: 'social_making_friends',
    targetLang: 'de',
    phrase: 'Es hat mich sehr gefreut, dich kennenzulernen. Lass uns in Kontakt bleiben!',
    tr: 'Seninle tanıştığıma çok memnun oldum. İletişimde kalalım!',
    phonetic: 'Es hat mih zeer gefroyt, dih kenentsulernen. Las uns in Kontakt blayben!',
    logicTip: '"In Kontakt bleiben" iletişimde/irtibatta kalmak demektir.',
    difficulty: 'fluent',
    tags: ['tanisma', 'iletisim', 'almanca']
  },

  // --- 7. İŞ & GÜNLÜK MESLEK (EK METİNLER) ---
  {
    id: 'en-work-4',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'Could we reschedule our meeting to tomorrow afternoon?',
    tr: 'Toplantımızı yarın öğleden sonraya erteleyebilir (yeniden planlayabilir) miyiz?',
    phonetic: 'Kud vi rii-skecul aur miiting tu tumarou eftırnuun?',
    logicTip: 'Toplantı saatini değiştirmek için "reschedule" kelimesi iş dünyasının anahtarıdır.',
    difficulty: 'daily',
    tags: ['toplanti', 'is', 'plan']
  },
  {
    id: 'en-work-5',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'Let me share my screen so we can go over the latest project figures.',
    tr: 'Son proje rakamlarının üzerinden geçebilmemiz için ekranımı paylaşayım.',
    phonetic: 'Let mi şer may skriin sou vi ken gou ouvır dı leytıst prucekt figürz.',
    logicTip: 'Online toplantılarda (Zoom/Teams) ekran paylaşırken söylenen en profesyonel cümledir.',
    difficulty: 'fluent',
    tags: ['toplanti', 'sunum', 'ekran']
  },
  {
    id: 'en-work-6',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'I’ll look into this issue right away and get back to you by the end of the day.',
    tr: 'Bu konuyu hemen inceleyip gün sonuna kadar size geri dönüş yapacağım.',
    phonetic: 'Ayl luk intu dis işuu rayt evey end get bek tu yu bay dı end ov dı dey.',
    logicTip: '"Look into" incelemek/araştırmak, "get back to you" ise geri dönüş yapmak demektir.',
    difficulty: 'fluent',
    tags: ['is', 'cozum', 'eposta']
  },
  {
    id: 'de-work-2',
    category: 'work_professional',
    targetLang: 'de',
    phrase: 'Könnten wir unseren Termin bitte auf morgen verschieben?',
    tr: 'Randevumuzu/toplantımızı lütfen yarına erteleyebilir miyiz?',
    phonetic: 'Könten vir unzeren Termin bite auf morgen ferşiiben?',
    logicTip: '"Einen Termin verschieben" randevuyu/toplantıyı başka bir zamana ertelemek demektir.',
    difficulty: 'daily',
    tags: ['toplanti', 'randevu', 'almanca']
  },
  {
    id: 'de-work-3',
    category: 'work_professional',
    targetLang: 'de',
    phrase: 'Ich kümmere mich sofort darum und gebe Ihnen bis heute Abend Bescheid.',
    tr: 'Bununla hemen ilgileniyorum ve bu akşama kadar size haber veriyorum.',
    phonetic: 'İh kümere mih zofort darum unt gebe İinen bis hoyte Abent Beşayd.',
    logicTip: '"Bescheid geben" bilgi/haber vermek demektir; iş hayatında her gün kullanılır.',
    difficulty: 'fluent',
    tags: ['is', 'haber', 'almanca']
  },

  // --- 8. DUYGULAR & TEPKİLER (EK METİNLER) ---
  {
    id: 'en-feel-3',
    category: 'feelings_reactions',
    targetLang: 'en',
    phrase: 'That makes total sense! I hadn’t thought of it that way before.',
    tr: 'Bu çok mantıklı! Daha önce hiç bu açıdan düşünmemiştim.',
    phonetic: 'Det meyks toutıl sens! Ay hedınt tot ov it det vey bifor.',
    logicTip: 'Karşı tarafın fikrini takdir etmek ve onaylamak için mükemmel bir kalıptır.',
    difficulty: 'fluent',
    tags: ['tepki', 'mantikli', 'onay']
  },
  {
    id: 'en-feel-4',
    category: 'feelings_reactions',
    targetLang: 'en',
    phrase: 'What a relief! I was really worried about how it would turn out.',
    tr: 'Ne büyük bir rahatlama (Oh be)! Nasıl sonuçlanacağı konusunda çok endişeliydim.',
    phonetic: 'Vat e riliif! Ay vaz riili vöriid ebaut hav it vud törn aut.',
    logicTip: '"What a relief!" derin bir oh çekip rahatladığını ifade eder.',
    difficulty: 'daily',
    tags: ['duygu', 'rahatlama', 'tepki']
  },
  {
    id: 'de-feel-2',
    category: 'feelings_reactions',
    targetLang: 'de',
    phrase: 'Das ergibt absolut Sinn! Da bin ich ganz deiner Meinung.',
    tr: 'Bu kesinlikle çok mantıklı! Bu konuda tamamen seninle aynı fikirdeyim.',
    phonetic: 'Das ergipt apzolut Zin! Da bin ih gants dayner Maynung.',
    logicTip: 'İngilizcedeki "makes sense" kalıbının doğru Almanca karşılığı "ergibt Sinn"dir.',
    difficulty: 'fluent',
    tags: ['fikir', 'onay', 'almanca']
  },
  {
    id: 'de-feel-3',
    category: 'feelings_reactions',
    targetLang: 'de',
    phrase: 'Gott sei Dank! Jetzt fällt mir echt ein Stein vom Herzen.',
    tr: 'Çok şükür! Şimdi gerçekten yüreğime su serpildi (kalbimden bir taş düştü).',
    phonetic: 'Got zay Dank! Yetst felt miir eht ayn Ştayn fom Hertsen.',
    logicTip: 'Büyük bir endişeden kurtulunca söylenen çok doğal bir ifadeyle rahatlama bildirir.',
    difficulty: 'daily',
    tags: ['duygu', 'rahatlama', 'almanca']
  },

  // --- 9. KONUŞMA DOLGULARI (EK METİNLER) ---
  {
    id: 'en-filler-3',
    category: 'quick_fillers',
    targetLang: 'en',
    phrase: 'That’s a really good question, let me think about it for a second.',
    tr: 'Bu gerçekten çok güzel bir soru, bir saniye üzerinde düşüneyim.',
    phonetic: 'Dets e riili gud kvesçın, let mi tink ebaut it for e sekınd.',
    logicTip: 'Mülakatta veya sohbette cevabı düşünürken sana 5 saniye kazandıran altın cümledir.',
    difficulty: 'daily',
    tags: ['dolgu', 'akicilik', 'mulakat']
  },
  {
    id: 'en-filler-4',
    category: 'quick_fillers',
    targetLang: 'en',
    phrase: 'At the end of the day, what really matters is consistency.',
    tr: 'Günün sonunda (sonuç olarak), asıl önemli olan şey istikrardır.',
    phonetic: 'Et dı end ov dı dey, vat riili medırz iz konsistınsi.',
    logicTip: '"At the end of the day" konuşmayı özetlerken yerlilerin en sevdiği bağlaçtır.',
    difficulty: 'fluent',
    tags: ['baglac', 'akicilik', 'ozet']
  },
  {
    id: 'de-filler-2',
    category: 'quick_fillers',
    targetLang: 'de',
    phrase: 'Ehrlich gesagt bin ich mir da noch nicht ganz sicher.',
    tr: 'Dürüst olmak gerekirse bu konuda henüz tam emin değilim.',
    phonetic: 'Eerlih gezagt bin ih miir da noh niht gants ziher.',
    logicTip: '"Ehrlich gesagt" (açıkçası / dürüst olmak gerekirse) cümleye başlarken harika bir dolgudur.',
    difficulty: 'daily',
    tags: ['dolgu', 'akicilik', 'almanca']
  },
  {
    id: 'de-filler-3',
    category: 'quick_fillers',
    targetLang: 'de',
    phrase: 'Im Großen und Ganzen bin ich mit dem Ergebnis sehr zufrieden.',
    tr: 'Genel hatlarıyla (bütünüyle) sonuçtan çok memnunum.',
    phonetic: 'İm Groosen unt Gantsen bin ih mit dem Ergebnis zeer tsufriiden.',
    logicTip: '"Im Großen und Ganzen" genel olarak değerlendirme yaparken çok şık durur.',
    difficulty: 'fluent',
    tags: ['baglac', 'akicilik', 'almanca']
  },

  // --- 10. EV & GÜNLÜK YAŞAM (EK METİNLER) ---
  {
    id: 'en-home-3',
    category: 'home_daily_routines',
    targetLang: 'en',
    phrase: 'I’m heading to the grocery store. Do we need anything for dinner?',
    tr: 'Markete gidiyorum. Akşam yemeği için bir şeye ihtiyacımız var mı?',
    phonetic: 'Aym heding tu dı grousri stor. Du vi niid eniting for dinır?',
    logicTip: '"I’m heading to..." bir yere doğru yola çıkarken "I am going to" yerine çok daha doğal kullanılır.',
    difficulty: 'daily',
    tags: ['ev', 'market', 'yemek']
  },
  {
    id: 'en-home-4',
    category: 'home_daily_routines',
    targetLang: 'en',
    phrase: 'The internet connection keeps dropping today. I’ll restart the router.',
    tr: 'Bugün internet bağlantısı sürekli kopuyor. Modemi yeniden başlatacağım.',
    phonetic: 'Dı intırnet konekşın kiips draping tudey. Ayl riistart dı rautır.',
    logicTip: 'Bağlantının kesilmesi için "keep dropping" ifadesi kullanılır.',
    difficulty: 'fluent',
    tags: ['ev', 'internet', 'gunluk']
  },
  {
    id: 'de-home-2',
    category: 'home_daily_routines',
    targetLang: 'de',
    phrase: 'Ich gehe kurz in den Supermarkt. Brauchen wir noch etwas für heute Abend?',
    tr: 'Hemen markete gidiyorum. Bu akşam için bir şeye ihtiyacımız var mı?',
    phonetic: 'İh geye kurts in den Zupermarkt. Brauhen vir noh etvas für hoyte Abent?',
    logicTip: 'Günlük ev yaşamında en sık kurulan pratik cümlelerden biridir.',
    difficulty: 'daily',
    tags: ['ev', 'market', 'almanca']
  },
  {
    id: 'de-home-3',
    category: 'home_daily_routines',
    targetLang: 'de',
    phrase: 'Könntest du bitte das Fenster schließen? Es zieht ein bisschen.',
    tr: 'Pencereyi kapatabilir misin lütfen? Biraz cereyan yapıyor.',
    phonetic: 'Köntest du bite das Fenster şliisen? Es tsiit ayn bishen.',
    logicTip: '"Es zieht!" (Cereyan yapıyor / Hava akımı var) Alman kültüründe çok sık duyulan bir ifadedir.',
    difficulty: 'fluent',
    tags: ['ev', 'pencere', 'almanca']
  },

  // --- 11. BANKA & RESMİ DAİRE (EK METİNLER) ---
  {
    id: 'en-bank-2',
    category: 'bank_official',
    targetLang: 'en',
    phrase: 'I’d like to open a checking account. What documents are required?',
    tr: 'Vadesiz bir banka hesabı açmak istiyorum. Hangi belgeler gerekiyor?',
    phonetic: 'Ayd layk tu oupın e çeking ekaunt. Vat dakyumınts ar rikvayrd?',
    logicTip: 'Günlük banka hesabına Amerika\'da "checking account", İngiltere\'de "current account" denir.',
    difficulty: 'fluent',
    tags: ['banka', 'hesap', 'evrak']
  },
  {
    id: 'en-bank-3',
    category: 'bank_official',
    targetLang: 'en',
    phrase: 'The ATM swallowed my card. Could you help me block it immediately?',
    tr: 'ATM kartımı yuttu. Hemen bloke etmeme yardımcı olabilir misiniz?',
    phonetic: 'Dı ey-tii-em svaloud may kard. Kud yu help mi blak it imiidiyıtli?',
    logicTip: 'Yurt dışında ATM kartı yuttuğunda banka görevlisine söylenecek acil cümledir.',
    difficulty: 'starter',
    tags: ['banka', 'atm', 'kart']
  },
  {
    id: 'de-bank-2',
    category: 'bank_official',
    targetLang: 'de',
    phrase: 'Ich habe einen Termin für die Anmeldung meines Wohnsitzes.',
    tr: 'İkametgah kaydım (Anmeldung) için bir randevum var.',
    phonetic: 'İh habe aynen Termin für dii Anmeldung maynes Voonzitses.',
    logicTip: 'Almanya\'ya taşınıldığında belediyede yapılan adres kaydına "Anmeldung" denir.',
    difficulty: 'fluent',
    tags: ['belediye', 'ikametgah', 'almanca']
  },
  {
    id: 'de-bank-3',
    category: 'bank_official',
    targetLang: 'de',
    phrase: 'Der Geldautomat hat meine Karte eingezogen. Können Sie mir bitte helfen?',
    tr: 'ATM kartımı yuttu (içine çekti). Bana lütfen yardımcı olabilir misiniz?',
    phonetic: 'Der Gelt-automat hat mayne Karte ayngetsogen. Könen Zii miir bite helfen?',
    logicTip: '"Geldautomat" ATM demektir, kartı yutması ise "die Karte einziehen" olarak ifade edilir.',
    difficulty: 'starter',
    tags: ['atm', 'banka', 'almanca']
  },

  // --- 12. SOKAK DİLİ & DEYİMLER (EK METİNLER) ---
  {
    id: 'en-slang-3',
    category: 'slang_idioms',
    targetLang: 'en',
    phrase: 'Let’s play it by ear and see how things go!',
    tr: 'Akışına bırakalım (doğaçlama hareket edelim), bakalım işler nasıl gidecek!',
    phonetic: 'Lets pley it bay iir end sii hav tingz gou!',
    logicTip: '"Play it by ear" önceden katı bir plan yapmadan duruma göre hareket etmek demektir.',
    difficulty: 'fluent',
    tags: ['deyim', 'sokak', 'akicilik']
  },
  {
    id: 'en-slang-4',
    category: 'slang_idioms',
    targetLang: 'en',
    phrase: 'Let’s call it a day and finish the rest tomorrow morning.',
    tr: 'Bugünlük bu kadar yeter diyelim (paydos edelim), kalanını yarın sabah bitiririz.',
    phonetic: 'Lets kol it e dey end finiş dı rest tumarou morning.',
    logicTip: '"Call it a day" işi veya çalışmayı o gün için sonlandırmak demektir.',
    difficulty: 'fluent',
    tags: ['deyim', 'paydos', 'is']
  },
  {
    id: 'de-slang-3',
    category: 'slang_idioms',
    targetLang: 'de',
    phrase: 'Mach dir keinen Kopf, das kriegen wir schon hin!',
    tr: 'Hiç kafana takma, biz bunun üstesinden geliriz (hallederiz)!',
    phonetic: 'Mah diir kaynen Kopf, das kriigen vir şoon hin!',
    logicTip: '"Das kriegen wir hin" (Bunu hallederiz) günlük hayatta en çok güven veren cümledir.',
    difficulty: 'daily',
    tags: ['deyim', 'teselli', 'almanca']
  },
  {
    id: 'de-slang-4',
    category: 'slang_idioms',
    targetLang: 'de',
    phrase: 'Lass uns für heute Feierabend machen!',
    tr: 'Bugünlük paydos edelim (işi bitirelim)!',
    phonetic: 'Las uns für hoyte Fayer-abent mahen!',
    logicTip: '"Feierabend" mesai bitimi ve dinlenme vakti için kullanılan çok sevilen bir kelimedir.',
    difficulty: 'fluent',
    tags: ['deyim', 'paydos', 'almanca']
  },

  // ==================== EK PAKET: HER KATEGORİ VE SEVİYE İÇİN ZENGİN KONUŞMA METİNLERİ ====================

  // Kafe & Restoran Ekler
  {
    id: 'en-cafe-10',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Does this dish contain any nuts or dairy products?',
    tr: 'Bu yemekte herhangi bir kuruyemiş veya süt ürünü var mı?',
    phonetic: 'Daz dis diş konteyn eni nats or deri pradakts?',
    logicTip: 'Gıda hassasiyeti veya alerji sorarken restoranlarda en sık kullanılan cümledir.',
    difficulty: 'daily',
    tags: ['restoran', 'alerji', 'yemek']
  },
  {
    id: 'en-cafe-11',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Everything was delicious, compliments to the chef!',
    tr: 'Her şey çok lezzetliydi, şefe selamlarımızı (tebriklerimizi) iletin!',
    phonetic: 'Evriting vaz dilişıs, kamplımınts tu dı şef!',
    logicTip: 'Yemekten çok memnun kalındığında garsona söylenen en zarif övgü cümlesidir.',
    difficulty: 'fluent',
    tags: ['restoran', 'tesekkur', 'sef']
  },
  {
    id: 'de-cafe-7',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Haben Sie auch vegetarische oder vegane Gerichte auf der Speisekarte?',
    tr: 'Menüde vejetaryen veya vegan yemekleriniz de var mı?',
    phonetic: 'Haben Zii auh vegetarişe oder vegane Gerihte auf der Şpayzekarte?',
    logicTip: '"Speisekarte" yemek menüsü, "Gerichte" ise yemekler/tabaklar demektir.',
    difficulty: 'daily',
    tags: ['restoran', 'menu', 'almanca']
  },

  // Ulaşım & Taksi Ekler
  {
    id: 'en-travel-9',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'Which platform does the express train to London leave from?',
    tr: 'Londra ekspres treni hangi perondan kalkıyor?',
    phonetic: 'Viç platform daz dı ekspres treyn tu Landın liiv fram?',
    logicTip: 'Tren garlarında peron sorarken "Which platform..." kalıbı kullanılır.',
    difficulty: 'daily',
    tags: ['tren', 'peron', 'ulasim']
  },
  {
    id: 'en-travel-10',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'Could you please help me put my suitcase in the trunk?',
    tr: 'Bavulumu bagaja koymama yardımcı olabilir misiniz lütfen?',
    phonetic: 'Kud yu pliiz help mi put may suutkeys in dı trank?',
    logicTip: 'Arabanın arka bagajına Amerika\'da "trunk", İngiltere\'de "boot" denir.',
    difficulty: 'starter',
    tags: ['taksi', 'bavul', 'bagaj']
  },
  {
    id: 'de-travel-6',
    category: 'travel_transit',
    targetLang: 'de',
    phrase: 'Auf welchem Gleis fährt der nächste Zug nach München ab?',
    tr: 'Münih\'e giden bir sonraki tren hangi perondan kalkıyor?',
    phonetic: 'Auf velhem Glays fert der nekste Tsug nah Münhen ap?',
    logicTip: '"Gleis" tren peronu/hattı, "abfahren" ise hareket etmek/kalkmak demektir.',
    difficulty: 'daily',
    tags: ['tren', 'peron', 'almanca']
  },

  // Alışveriş & Mağaza Ekler
  {
    id: 'en-shop-9',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'I’m just browsing for now, thank you! I’ll let you know if I need help.',
    tr: 'Şimdilik sadece bakınıyorum, teşekkürler! Yardıma ihtiyacım olursa size haber veririm.',
    phonetic: 'Aym cast brauzing for nav, tenk yu! Ayl let yu nou if ay niid help.',
    logicTip: 'Mağaza görevlisi "Yardımcı olabilir miyim?" dediğinde verilen en kibar ve doğal yanıttır.',
    difficulty: 'starter',
    tags: ['magaza', 'alisveris', 'cevap']
  },
  {
    id: 'en-shop-10',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Is there any warranty included with this electronic device?',
    tr: 'Bu elektronik cihazın garantisi var mı (dahil mi)?',
    phonetic: 'İz der eni vorınti inkluudıd vit dis elektronik divays?',
    logicTip: 'Elektronik veya saat alışverişinde garanti belgesi "warranty" olarak sorulur.',
    difficulty: 'fluent',
    tags: ['garanti', 'elektronik', 'alisveris']
  },
  {
    id: 'de-shop-5',
    category: 'shopping_bargain',
    targetLang: 'de',
    phrase: 'Ich schaue mich nur kurz um, vielen Dank!',
    tr: 'Sadece şöyle bir bakınıyorum, çok teşekkürler!',
    phonetic: 'İh şaue mih nuur kurts um, fiilen Dank!',
    logicTip: '"Sich umschauen" mağazada etrafa/ürünlere bakınmak demektir.',
    difficulty: 'starter',
    tags: ['magaza', 'alisveris', 'almanca']
  },
  {
    id: 'de-shop-6',
    category: 'shopping_bargain',
    targetLang: 'de',
    phrase: 'Haben Sie dieses Modell vielleicht eine Nummer größer?',
    tr: 'Bu modelin bir beden büyüğü sizde var mı acaba?',
    phonetic: 'Haben Zii diizes Model filayht ayne Numer grööser?',
    logicTip: 'Ayakkabı veya kıyafet denerken "eine Nummer größer/kleiner" (bir numara büyük/küçük) denir.',
    difficulty: 'daily',
    tags: ['beden', 'magaza', 'almanca']
  },

  // Otel & Konaklama Ekler
  {
    id: 'en-hotel-7',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'Could we get some extra towels and pillows sent to room 304?',
    tr: '304 numaralı odaya fazladan birkaç havlu ve yastık gönderebilir misiniz?',
    phonetic: 'Kud vi get sam ekstra tauılz end pilouz sent tu ruum tri-oh-for?',
    logicTip: 'Oda numarasını söylerken rakamlar tek tek (three-oh-four) okunur.',
    difficulty: 'starter',
    tags: ['otel', 'oda', 'havlu']
  },
  {
    id: 'de-hotel-5',
    category: 'hotel_stay',
    targetLang: 'de',
    phrase: 'Könnten wir bitte ein ruhiges Zimmer zum Innenhof bekommen?',
    tr: 'Lütfen iç avluya bakan sessiz bir oda alabilir miyiz?',
    phonetic: 'Könten vir bite ayn ruiges Tsimer tsum İnenhoof bekomen?',
    logicTip: 'Cadde gürültüsünden uzak oda istemek için "ruhiges Zimmer" (sessiz oda) kullanılır.',
    difficulty: 'fluent',
    tags: ['otel', 'oda', 'almanca']
  },

  // Sağlık & Eczane Ekler
  {
    id: 'en-health-7',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'I’m allergic to penicillin. Does this medication contain it?',
    tr: 'Penisiline alerjim var. Bu ilaçta penisilin bulunuyor mu?',
    phonetic: 'Aym elörcik tu penisilın. Daz dis medikeyşın konteyn it?',
    logicTip: 'İlaç alerjisini doktora veya eczacıya bildirmek hayati önem taşır.',
    difficulty: 'starter',
    tags: ['saglik', 'alerji', 'ilac']
  },
  {
    id: 'de-health-5',
    category: 'health_emergency',
    targetLang: 'de',
    phrase: 'Ich habe starke Kopfschmerzen. Haben Sie ein leichtes Schmerzmittel?',
    tr: 'Şiddetli baş ağrım var. Hafif bir ağrı kesiciniz var mı?',
    phonetic: 'İh habe ştarke Kopfşmertsen. Haben Zii ayn layhtes Şmertsmittel?',
    logicTip: '"Schmerzmittel" ağrı kesici, "Kopfschmerzen" baş ağrısı demektir.',
    difficulty: 'starter',
    tags: ['eczane', 'agri', 'almanca']
  },

  // Tanışma & Sosyal Yaşam Ekler
  {
    id: 'en-social-7',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'Do you mind if I join you at this table?',
    tr: 'Bu masada size katılmamın bir sakıncası var mı?',
    phonetic: 'Du yu maynd if ay coyn yu et dis teybıl?',
    logicTip: 'Sosyal ortamlarda veya kafede bir masaya oturmak için izin isterken çok kibardır.',
    difficulty: 'fluent',
    tags: ['sosyal', 'tanisma', 'masa']
  },
  {
    id: 'de-social-5',
    category: 'social_making_friends',
    targetLang: 'de',
    phrase: 'Darf ich mich kurz zu euch setzen?',
    tr: 'Yanınıza (masanıza) oturabilir miyim?',
    phonetic: 'Darf ih mih kurts tsu oyh zetsen?',
    logicTip: 'Arkadaşça bir ortamda masaya katılmak için kullanılan sıcak bir cümledir.',
    difficulty: 'daily',
    tags: ['sosyal', 'masa', 'almanca']
  },

  // İş & Günlük Meslek Ekler (Starter Dahil)
  {
    id: 'en-work-7',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'Sorry, you’re on mute! We can’t hear you right now.',
    tr: 'Pardon, mikrofonunuz sessizde! Şu anda sizi duyamıyoruz.',
    phonetic: 'Sori, yor on myuut! Vi kent hiir yu rayt nav.',
    logicTip: 'Online toplantılarda her gün duyulan en temel başlangıç cümlesidir.',
    difficulty: 'starter',
    tags: ['toplanti', 'mikrofon', 'is']
  },
  {
    id: 'en-work-8',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'Could you please send me the summary by email after the call?',
    tr: 'Görüşmeden sonra özeti bana e-posta ile gönderebilir misiniz lütfen?',
    phonetic: 'Kud yu pliiz send mi dı samıri bay iimeyl eftır dı kol?',
    logicTip: 'Görüşme sonunda konuşulanları yazılı istemek için kullanılır.',
    difficulty: 'starter',
    tags: ['eposta', 'toplanti', 'is']
  },
  {
    id: 'de-work-4',
    category: 'work_professional',
    targetLang: 'de',
    phrase: 'Können Sie mich gut hören und meinen Bildschirm sehen?',
    tr: 'Beni iyi duyabiliyor ve ekranımı görebiliyor musunuz?',
    phonetic: 'Könen Zii mih guut höören unt maynen Bildşirm zeyen?',
    logicTip: 'Online iş toplantısına başlarken ses ve ekran kontrolü için kullanılır.',
    difficulty: 'starter',
    tags: ['toplanti', 'ekran', 'almanca']
  },

  // Duygular & Tepkiler Ekler
  {
    id: 'en-feel-5',
    category: 'feelings_reactions',
    targetLang: 'en',
    phrase: 'I’m really looking forward to our trip next week!',
    tr: 'Gelecek haftaki seyahatimizi dört gözle bekliyorum!',
    phonetic: 'Aym riili luking forvırd tu aur trip nekst viik!',
    logicTip: '"Look forward to" heyecanla ve dört gözle beklemek demektir.',
    difficulty: 'daily',
    tags: ['heyecan', 'beklenti', 'duygu']
  },
  {
    id: 'de-feel-4',
    category: 'feelings_reactions',
    targetLang: 'de',
    phrase: 'Ich freue mich schon riesig auf unser nächstes Treffen!',
    tr: 'Bir sonraki buluşmamızı şimdiden dört gözle bekliyorum!',
    phonetic: 'İh froye mih şoon riizih auf unzer nekstes Trefen!',
    logicTip: '"Sich freuen auf" gelecekteki bir şeyi heyecanla beklemek demektir.',
    difficulty: 'fluent',
    tags: ['heyecan', 'bulusma', 'almanca']
  },

  // Konuşma Dolguları Ekler
  {
    id: 'en-filler-5',
    category: 'quick_fillers',
    targetLang: 'en',
    phrase: 'What I mean to say is that we should focus on quality first.',
    tr: 'Demek istediğim şu ki, önce kaliteye odaklanmalıyız.',
    phonetic: 'Vat ay miin tu sey iz det vi şud foukıs on kvalıti först.',
    logicTip: 'Sözünü daha net açıklamak ve toparlamak için kullanılan harika bir akıcılık köprüsüdür.',
    difficulty: 'fluent',
    tags: ['dolgu', 'aciklama', 'akicilik']
  },
  {
    id: 'de-filler-4',
    category: 'quick_fillers',
    targetLang: 'de',
    phrase: 'Was ich damit sagen möchte, ist eigentlich ganz einfach.',
    tr: 'Bununla söylemek istediğim şey aslında oldukça basit.',
    phonetic: 'Vas ih damit zagen möhte, ist aygentlih gants aynfah.',
    logicTip: 'Cümleyi toparlarken karşı tarafın dikkatini çekmek için kullanılır.',
    difficulty: 'fluent',
    tags: ['dolgu', 'akicilik', 'almanca']
  },

  // Ev & Günlük Yaşam Ekler
  {
    id: 'en-home-5',
    category: 'home_daily_routines',
    targetLang: 'en',
    phrase: 'I’ll load the dishwasher if you can wipe down the kitchen counter.',
    tr: 'Sen mutfak tezgahını silebilirsen ben de bulaşık makinesini doldururum.',
    phonetic: 'Ayl loud dı dişvaşır if yu ken vayp daun dı kiçın kauntır.',
    logicTip: 'Ev işlerini paylaşırken kullanılan çok doğal bir günlük yaşam cümlesidir.',
    difficulty: 'fluent',
    tags: ['ev', 'mutfak', 'gunluk']
  },
  {
    id: 'de-home-4',
    category: 'home_daily_routines',
    targetLang: 'de',
    phrase: 'Ich räume schnell die Spülmaschine aus und mache uns einen Tee.',
    tr: 'Hemen bulaşık makinesini boşaltıp bize bir çay demliyorum.',
    phonetic: 'İh royme şnel dii Şpüülmaşiine aus unt mahe uns aynen Tee.',
    logicTip: '"Spülmaschine ausräumen" bulaşık makinesini boşaltmak demektir.',
    difficulty: 'daily',
    tags: ['ev', 'mutfak', 'almanca']
  },

  // Banka & Resmi Daire Ekler
  {
    id: 'en-bank-4',
    category: 'bank_official',
    targetLang: 'en',
    phrase: 'Where do I need to sign on this application form?',
    tr: 'Bu başvuru formunda nereyi imzalamam gerekiyor?',
    phonetic: 'Ver du ay niid tu sayn on dis eplikeyşın form?',
    logicTip: 'Bankada, vize merkezinde veya belediyede evrak imzalarken sorulan temel sorudur.',
    difficulty: 'starter',
    tags: ['imza', 'form', 'resmi']
  },
  {
    id: 'en-bank-5',
    category: 'bank_official',
    targetLang: 'en',
    phrase: 'I’d like to transfer money to an international bank account using IBAN.',
    tr: 'IBAN kullanarak uluslararası bir banka hesabına para transfer etmek istiyorum.',
    phonetic: 'Ayd layk tu trensför mani tu en intırneşınıl benk ekaunt yuuzing ay-ben.',
    logicTip: 'Yurt dışı havale ve para transferi işlemlerinde kullanılır.',
    difficulty: 'fluent',
    tags: ['banka', 'transfer', 'iban']
  },
  {
    id: 'de-bank-4',
    category: 'bank_official',
    targetLang: 'de',
    phrase: 'Wo genau muss ich dieses Formular unterschreiben?',
    tr: 'Bu formu tam olarak nereye imzalamam gerekiyor?',
    phonetic: 'Vo genau mus ih diizes Formulaar unterşrayben?',
    logicTip: '"Unterschreiben" imza atmak demektir; resmi dairelerde çok sık duyulur.',
    difficulty: 'starter',
    tags: ['imza', 'resmi', 'almanca']
  },

  // ==================== 2. EK PAKET: GÜNLÜK HAYAT DERİNLEMESİNE KONUŞMA METİNLERİ ====================

  // 1. Kafe & Restoran
  {
    id: 'en-cafe-12',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Excuse me, I think there might be a small mistake on our bill.',
    tr: 'Affedersiniz, sanırım hesabımızda küçük bir yanlışlık olmuş.',
    phonetic: 'Ekskyuuz mi, ay tink der mayt bi e smol misteyk on aur bil.',
    logicTip: 'Hesapta bir hata olduğunda garsonu suçlamadan nazikçe uyarmak için kullanılır.',
    difficulty: 'fluent',
    tags: ['hesap', 'restoran', 'hata']
  },
  {
    id: 'en-cafe-13',
    category: 'cafe_dining',
    targetLang: 'en',
    phrase: 'Could I get a glass of tap water with no ice, please?',
    tr: 'Buzsuz bir bardak su (musluk/normal su) alabilir miyim lütfen?',
    phonetic: 'Kud ay get e gles ov tep votır vit nou ays, pliiz?',
    logicTip: 'Yurt dışında ücretsiz bardak su istemek için "tap water" denir.',
    difficulty: 'starter',
    tags: ['su', 'restoran', 'icecek']
  },
  {
    id: 'de-cafe-8',
    category: 'cafe_dining',
    targetLang: 'de',
    phrase: 'Entschuldigung, könnten wir bitte die Weinkarte und die Dessertkarte sehen?',
    tr: 'Affedersiniz, lütfen içecek ve tatlı menüsünü görebilir miyiz?',
    phonetic: 'Entşuldigung, könten vir bite dii Vaynkarte unt dii Desertkarte zeyen?',
    logicTip: 'Ana yemekten sonra tatlı menüsü istemek için "Dessertkarte" veya "Nachspeisenkarte" denir.',
    difficulty: 'fluent',
    tags: ['tatli', 'menu', 'almanca']
  },

  // 2. Ulaşım & Taksi
  {
    id: 'en-travel-11',
    category: 'travel_transit',
    targetLang: 'en',
    phrase: 'How often do the shuttle buses run to the airport terminal?',
    tr: 'Havalimanı terminaline servis otobüsleri ne sıklıkla kalkıyor?',
    phonetic: 'Hav ofın du dı şatıl basız ran tu dı erport törminıl?',
    logicTip: 'Otobüs veya metro sefer sıklığını sormak için "How often do ... run?" kalıbı kullanılır.',
    difficulty: 'fluent',
    tags: ['havalimani', 'servis', 'ulasim']
  },
  {
    id: 'de-travel-7',
    category: 'travel_transit',
    targetLang: 'de',
    phrase: 'Entschuldigung, ist dieser Sitzplatz noch frei?',
    tr: 'Affedersiniz, bu koltuk (oturma yeri) hala boş mu?',
    phonetic: 'Entşuldigung, ist diizer Zitsplats noh fray?',
    logicTip: 'Trende veya otobüste yan koltuğa oturmadan önce sorulan en kibar sorudur.',
    difficulty: 'starter',
    tags: ['tren', 'koltuk', 'almanca']
  },

  // 3. Alışveriş & Mağaza
  {
    id: 'en-shop-11',
    category: 'shopping_bargain',
    targetLang: 'en',
    phrase: 'Can I pay contactless with my phone or smart watch?',
    tr: 'Telefonumla veya akıllı saatimle temassız ödeyebilir miyim?',
    phonetic: 'Ken ay pey kantektlıs vit may foun or smart voç?',
    logicTip: '"Pay contactless" temassız ödeme yapmak demektir.',
    difficulty: 'daily',
    tags: ['odeme', 'temassiz', 'kasa']
  },
  {
    id: 'de-shop-7',
    category: 'shopping_bargain',
    targetLang: 'de',
    phrase: 'Könnten Sie das bitte als Geschenk einpacken?',
    tr: 'Bunu lütfen hediye paketi yapabilir misiniz?',
    phonetic: 'Könten Zii das bite als Geşenk aynpaken?',
    logicTip: '"Als Geschenk einpacken" hediye paketi yapmak demektir.',
    difficulty: 'daily',
    tags: ['hediye', 'magaza', 'almanca']
  },

  // 4. Otel & Konaklama
  {
    id: 'en-hotel-8',
    category: 'hotel_stay',
    targetLang: 'en',
    phrase: 'Could you please call a taxi for us for 6:00 AM tomorrow morning?',
    tr: 'Yarın sabah saat 06:00 için bize bir taksi çağırabilir misiniz lütfen?',
    phonetic: 'Kud yu pliiz kol e teksi for as for siks ey-em tumarou morning?',
    logicTip: 'Sabah erken uçuşlar için resepsiyondan akşamdan taksi ayırtırken kullanılır.',
    difficulty: 'daily',
    tags: ['otel', 'taksi', 'resepsiyon']
  },
  {
    id: 'de-hotel-6',
    category: 'hotel_stay',
    targetLang: 'de',
    phrase: 'Ich habe meinen Zimmerschlüssel im Zimmer vergessen. Können Sie mir öffnen?',
    tr: 'Oda anahtarımı odada unuttum. Kapıyı bana açabilir misiniz?',
    phonetic: 'İh habe maynen Tsimerşlüsel im Tsimer fergesen. Könen Zii miir öfnen?',
    logicTip: 'Oda kartını içeride unuttuğunda resepsiyona söylenecek kurtarıcı cümledir.',
    difficulty: 'daily',
    tags: ['otel', 'anahtar', 'almanca']
  },

  // 5. Sağlık & Eczane
  {
    id: 'en-health-8',
    category: 'health_emergency',
    targetLang: 'en',
    phrase: 'Could you give me a medical certificate for my travel insurance?',
    tr: 'Seyahat sigortam için bana bir sağlık raporu (doktor belgesi) verebilir misiniz?',
    phonetic: 'Kud yu giv mi e medikıl sörtifikıt for may trevıl inşurıns?',
    logicTip: 'Yurt dışında muayene ücreti iadesi almak için sigortaya "medical certificate" gerekir.',
    difficulty: 'fluent',
    tags: ['sigorta', 'rapor', 'doktor']
  },
  {
    id: 'de-health-6',
    category: 'health_emergency',
    targetLang: 'de',
    phrase: 'Ich brauche bitte eine Krankschreibung für meinen Arbeitgeber.',
    tr: 'İşverenim için lütfen bir iş göremezlik raporuna (istirahat raporuna) ihtiyacım var.',
    phonetic: 'İh brauhe bite ayne Krankşraybung für maynen Arbaytgeber.',
    logicTip: 'Almanya\'da çalışırken doktordan alınan hastalık raporuna "Krankschreibung" denir.',
    difficulty: 'fluent',
    tags: ['rapor', 'doktor', 'almanca']
  },

  // 6. Tanışma & Sosyal Yaşam
  {
    id: 'en-social-8',
    category: 'social_making_friends',
    targetLang: 'en',
    phrase: 'Are you on Instagram or LinkedIn? Let’s stay connected!',
    tr: 'Instagram veya LinkedIn kullanıyor musun? Bağlantıda kalalım!',
    phonetic: 'Ar yu on İnstagram or Linktin? Lets stey konektıd!',
    logicTip: 'Sosyal medya hesabı isterken "Are you on...?" kalıbı kullanılır.',
    difficulty: 'starter',
    tags: ['sosyalmedya', 'arkadas', 'tanisma']
  },
  {
    id: 'de-social-6',
    category: 'social_making_friends',
    targetLang: 'de',
    phrase: 'Wie lange wohnst du schon hier in der Gegend?',
    tr: 'Ne zamandır bu civarda (bu bölgede) yaşıyorsun?',
    phonetic: 'Vii lange voonst du şoon hiir in der Gegent?',
    logicTip: '"In der Gegend" bu civarda / bu mahallede demektir.',
    difficulty: 'daily',
    tags: ['mahalle', 'sohbet', 'almanca']
  },

  // 7. İş & Günlük Meslek
  {
    id: 'en-work-9',
    category: 'work_professional',
    targetLang: 'en',
    phrase: 'Thank you all for your time today. Have a productive week ahead!',
    tr: 'Bugün ayırdığınız zaman için hepinize teşekkür ederim. Verimli bir hafta dilerim!',
    phonetic: 'Tenk yu ol for yor taym tudey. Hev e prodaktiv viik ehed!',
    logicTip: 'Toplantıyı kapatırken söylenen en profesyonel ve pozitif veda cümlesidir.',
    difficulty: 'daily',
    tags: ['toplanti', 'kapanis', 'is']
  },
  {
    id: 'de-work-5',
    category: 'work_professional',
    targetLang: 'de',
    phrase: 'Vielen Dank für das konstruktive Gespräch. Ich wünsche Ihnen noch eine erfolgreiche Woche!',
    tr: 'Yapıcı görüşme için çok teşekkürler. Size başarılı bir hafta diliyorum!',
    phonetic: 'Fiilen Dank für das konstruktiive Geşpreeh. İh vünşe İinen noh ayne erfolgrayhe Vohe!',
    logicTip: 'İş görüşmesi veya toplantı sonunda bırakılacak en güçlü izlenim cümlesidir.',
    difficulty: 'fluent',
    tags: ['toplanti', 'is', 'almanca']
  },

  // 8. Duygular & Tepkiler
  {
    id: 'en-feel-6',
    category: 'feelings_reactions',
    targetLang: 'en',
    phrase: 'Don’t be too hard on yourself, everyone makes mistakes!',
    tr: 'Kendine çok yüklenme, herkes hata yapar!',
    phonetic: 'Dount bi tuu hard on yorself, evrivan meyks misteyks!',
    logicTip: 'Üzgün veya stresli bir arkadaşını teselli ederken kullanılan çok sıcak bir cümledir.',
    difficulty: 'fluent',
    tags: ['teselli', 'destek', 'duygu']
  },
  {
    id: 'de-feel-5',
    category: 'feelings_reactions',
    targetLang: 'de',
    phrase: 'Das tut mir wirklich sehr leid zu hören. Kann ich irgendetwas für dich tun?',
    tr: 'Bunu duyduğuma gerçekten çok üzüldüm. Senin için yapabileceğim bir şey var mı?',
    phonetic: 'Das tuut miir virklih zeer layt tsu höören. Kan ih irgent-etvas für dih tuun?',
    logicTip: 'Üzücü bir haber karşısında empati ve yardım teklif etmenin en doğal yoludur.',
    difficulty: 'fluent',
    tags: ['empati', 'yardim', 'almanca']
  },

  // 9. Konuşma Dolguları
  {
    id: 'en-filler-6',
    category: 'quick_fillers',
    targetLang: 'en',
    phrase: 'If I remember correctly, it happened last summer.',
    tr: 'Doğru hatırlıyorsam, bu olay geçen yaz olmuştu.',
    phonetic: 'İf ay rimembır korektli, it hepınd lest samır.',
    logicTip: 'Bir detayı anlatırken emin olmasan bile akıcılığı bozmadan cümleye girmeni sağlar.',
    difficulty: 'starter',
    tags: ['hatirlama', 'dolgu', 'akicilik']
  },
  {
    id: 'de-filler-5',
    category: 'quick_fillers',
    targetLang: 'de',
    phrase: 'Soweit ich weiß, hat sich daran nichts geändert.',
    tr: 'Bildiğim kadarıyla bu konuda hiçbir şey değişmedi.',
    phonetic: 'Zovayt ih vays, hat zih daran nihts ge-endert.',
    logicTip: '"Soweit ich weiß" (bildiğim kadarıyla) her seviyede konuşmaya doğallık katar.',
    difficulty: 'starter',
    tags: ['dolgu', 'bilgi', 'almanca']
  },

  // 10. Ev & Günlük Yaşam
  {
    id: 'en-home-6',
    category: 'home_daily_routines',
    targetLang: 'en',
    phrase: 'We’re completely out of milk and eggs. I’ll order some online.',
    tr: 'Sütümüz ve yumurtamız tamamen bitmiş. İnternetten biraz sipariş vereceğim.',
    phonetic: 'Viir kımpliitli aut ov milk end egz. Ayl ordır sam onlayn.',
    logicTip: 'Evde bir malzemenin bitmesi "be out of..." veya "run out of..." ile söylenir.',
    difficulty: 'daily',
    tags: ['mutfak', 'siparis', 'ev']
  },
  {
    id: 'de-home-5',
    category: 'home_daily_routines',
    targetLang: 'de',
    phrase: 'Der Paketbote hat geklingelt, könntest du bitte die Tür aufmachen?',
    tr: 'Kurye (paket görevlisi) zili çaldı, kapıyı açabilir misin lütfen?',
    phonetic: 'Der Paketbote hat geklingelt, köntest du bite dii Tüür aufmahen?',
    logicTip: 'Günlük ev hayatında kargo geldiğinde en sık kurulan cümledir.',
    difficulty: 'daily',
    tags: ['kargo', 'ev', 'almanca']
  },

  // 11. Banka & Resmi Daire
  {
    id: 'en-bank-6',
    category: 'bank_official',
    targetLang: 'en',
    phrase: 'Could I get a printed receipt for this transaction, please?',
    tr: 'Bu işlem için basılı bir dekont (makbuz) alabilir miyim lütfen?',
    phonetic: 'Kud ay get e printıd risiit for dis trenzekşın, pliiz?',
    logicTip: '"Receipt" kelimesindeki "p" harfi okunmaz ("risiit" diye okunur).',
    difficulty: 'daily',
    tags: ['dekont', 'banka', 'makbuz']
  },
  {
    id: 'de-bank-5',
    category: 'bank_official',
    targetLang: 'de',
    phrase: 'Könnten Sie mir bitte eine Quittung oder Bestätigung ausstellen?',
    tr: 'Bana lütfen bir makbuz veya onay belgesi düzenleyebilir misiniz?',
    phonetic: 'Könten Zii miir bite ayne Kvitung oder Beştetigung ausştelen?',
    logicTip: 'Resmi dairelerde ve bankalarda makbuz/belge istemek için kullanılır.',
    difficulty: 'fluent',
    tags: ['makbuz', 'resmi', 'almanca']
  },

  // 12. Sokak Dili & Deyimler
  {
    id: 'en-slang-5',
    category: 'slang_idioms',
    targetLang: 'en',
    phrase: 'Keep me posted on how your interview goes!',
    tr: 'Mülakatının nasıl geçtiği konusunda beni haberdar et (gelişmeleri bildir)!',
    phonetic: 'Kiip mi poustıd on hav yor intırvyuu gouz!',
    logicTip: '"Keep me posted" (beni haberdar et) günlük konuşmada çok samimi ve yaygındır.',
    difficulty: 'daily',
    tags: ['haberdar', 'deyim', 'sokak']
  },
  {
    id: 'de-slang-5',
    category: 'slang_idioms',
    targetLang: 'de',
    phrase: 'Halt mich bitte auf dem Laufenden!',
    tr: 'Beni gelişmelerden haberdar et lütfen!',
    phonetic: 'Halt mih bite auf dem Laufenden!',
    logicTip: 'İngilizcedeki "keep me posted" ifadesinin birebir doğal Almanca karşılığıdır.',
    difficulty: 'daily',
    tags: ['haberdar', 'deyim', 'almanca']
  }
];

const MASTERED_STORAGE_KEY = 'chirmo_life_phrase_mastered_v1';

export class LifePhraseBankService {
  /**
   * Tüm kategorileri döndürür
   */
  public static getCategories(): LifeCategory[] {
    return LIFE_CATEGORIES;
  }

  /**
   * Filtrelenmiş kalıpları döndürür
   */
  public static getPhrases(filter?: {
    category?: LifeCategoryKey;
    targetLang?: SupportedLanguage;
    difficulty?: 'starter' | 'daily' | 'fluent';
  }): LifePhraseItem[] {
    let result = [...LIFE_PHRASE_BANK];

    if (filter?.category) {
      result = result.filter((item) => item.category === filter.category);
    }

    if (filter?.targetLang) {
      result = result.filter((item) => item.targetLang === filter.targetLang);
    }

    if (filter?.difficulty) {
      result = result.filter((item) => item.difficulty === filter.difficulty);
    }

    return result;
  }

  /**
   * Arama motoru: Hedef dildeki ifade, Türkçe karşılık, fonetik veya etiketlerde arar
   */
  public static searchPhrases(query: string, targetLang?: SupportedLanguage): LifePhraseItem[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.getPhrases({ targetLang });
    }

    return LIFE_PHRASE_BANK.filter((item) => {
      if (targetLang && item.targetLang !== targetLang) {
        return false;
      }

      return (
        item.phrase.toLowerCase().includes(q) ||
        item.tr.toLowerCase().includes(q) ||
        item.phonetic.toLowerCase().includes(q) ||
        item.logicTip.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  /**
   * Kalıbın ustalaşılıp ustalaşılmadığını kontrol eder
   */
  public static isMastered(id: string): boolean {
    const set = this.getMasteredSet();
    return set.has(id);
  }

  /**
   * Ustalaşma durumunu değiştirir (Öğrenildi / Öğrenilmedi)
   */
  public static toggleMastered(id: string): boolean {
    const set = this.getMasteredSet();
    let isNowMastered = false;

    if (set.has(id)) {
      set.delete(id);
      isNowMastered = false;
    } else {
      set.add(id);
      isNowMastered = true;
    }

    this.saveMasteredSet(set);
    return isNowMastered;
  }

  /**
   * Toplam ustalaşılan kalıp sayısı
   */
  public static getMasteredCount(): number {
    return this.getMasteredSet().size;
  }

  private static getMasteredSet(): Set<string> {
    try {
      if (typeof localStorage === 'undefined') return new Set();
      const raw = localStorage.getItem(MASTERED_STORAGE_KEY);
      if (!raw) return new Set();
      const list = JSON.parse(raw);
      return new Set(Array.isArray(list) ? list : []);
    } catch {
      return new Set();
    }
  }

  private static saveMasteredSet(set: Set<string>): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(MASTERED_STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.warn('Could not save mastered phrases:', e);
    }
  }
}
