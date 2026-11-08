/**
 * lifePhraseBankService.ts
 * CHIRMO — Günlük Yaşam Kelime & Kalıp Cümle Deposu
 * 
 * Türkiye'deki kullanıcıların "anlıyorum ama konuşamıyorum" sorununu çözen,
 * Türkçe düşünme / kelime kelime çevirme tuzağını kıran,
 * 12 hayati yaşam alanında hazır Lego kalıpları (Chunks) sunan konuşma motoru.
 */

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
  targetLang: 'en' | 'de';
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
    logicTip: 'Türkçedeki "şans dilemek" veya İngilizcedeki "fingers crossed", Almancada "Daumen drücken"dir.',
    difficulty: 'starter',
    tags: ['deyim', 'sans']
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
    targetLang?: 'en' | 'de';
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
  public static searchPhrases(query: string, targetLang?: 'en' | 'de'): LifePhraseItem[] {
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
