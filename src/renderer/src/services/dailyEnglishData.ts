// Günlük İngilizce Veri Havuzu (Chirmo Entegre Pratik ve Rol Yapma Motoru)

export interface WordItem {
  category: string;
  en: string;
  tr: string;
}

export interface SentenceItem {
  en: string;
  tr: string;
}

export interface DialogueItem {
  id: string;
  title: string;
  category: string;
  lines: Array<{
    en: string;
    tr: string;
    speaker: 'A' | 'B';
  }>;
}

export interface PatternItem {
  id: string;
  title: string;
  desc: string;
  examples: Array<{
    en: string;
    tr: string;
  }>;
}

export interface GuideItem {
  id: string;
  title: string;
  desc: string;
  examples: Array<{
    en: string;
    tr: string;
  }>;
  tip?: string;
}

export interface SentencePuzzle {
  id: string;
  en: string;
  tr: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  desc: string;
  examples: Array<{
    en: string;
    tr: string;
  }>;
}

// ==================== 1. KELİME HAVUZU (120+ KELİME) ====================
export const DAILY_WORDS: WordItem[] = [
  { category: 'Temel', en: 'hello', tr: 'merhaba' },
  { category: 'Temel', en: 'thank you', tr: 'teşekkürler' },
  { category: 'Temel', en: 'please', tr: 'lütfen' },
  { category: 'Temel', en: 'sorry', tr: 'özür dilerim' },
  { category: 'Temel', en: 'yes', tr: 'evet' },
  { category: 'Temel', en: 'no', tr: 'hayır' },
  { category: 'Temel', en: 'excuse me', tr: 'pardon / affedersiniz' },
  { category: 'Temel', en: 'goodbye', tr: 'hoşça kal' },
  { category: 'Temel', en: 'good morning', tr: 'günaydın' },
  { category: 'Temel', en: 'good night', tr: 'iyi geceler' },
  { category: 'Temel', en: 'welcome', tr: 'hoş geldin' },
  { category: 'Temel', en: 'maybe', tr: 'belki' },

  { category: 'Yemek', en: 'water', tr: 'su' },
  { category: 'Yemek', en: 'bread', tr: 'ekmek' },
  { category: 'Yemek', en: 'coffee', tr: 'kahve' },
  { category: 'Yemek', en: 'breakfast', tr: 'kahvaltı' },
  { category: 'Yemek', en: 'bill', tr: 'hesap' },
  { category: 'Yemek', en: 'hungry', tr: 'aç' },
  { category: 'Yemek', en: 'delicious', tr: 'lezzetli' },
  { category: 'Yemek', en: 'menu', tr: 'menü' },
  { category: 'Yemek', en: 'tea', tr: 'çay' },
  { category: 'Yemek', en: 'milk', tr: 'süt' },
  { category: 'Yemek', en: 'fruit', tr: 'meyve' },
  { category: 'Yemek', en: 'chicken', tr: 'tavuk' },
  { category: 'Yemek', en: 'soup', tr: 'çorba' },
  { category: 'Yemek', en: 'rice', tr: 'pilav' },
  { category: 'Yemek', en: 'salad', tr: 'salata' },
  { category: 'Yemek', en: 'dessert', tr: 'tatlı' },

  { category: 'Şehir', en: 'street', tr: 'sokak' },
  { category: 'Şehir', en: 'ticket', tr: 'bilet' },
  { category: 'Şehir', en: 'station', tr: 'istasyon' },
  { category: 'Şehir', en: 'map', tr: 'harita' },
  { category: 'Şehir', en: 'left', tr: 'sol' },
  { category: 'Şehir', en: 'right', tr: 'sağ' },
  { category: 'Şehir', en: 'near', tr: 'yakın' },
  { category: 'Şehir', en: 'far', tr: 'uzak' },
  { category: 'Şehir', en: 'bank', tr: 'banka' },
  { category: 'Şehir', en: 'hospital', tr: 'hastane' },
  { category: 'Şehir', en: 'airport', tr: 'havalimanı' },
  { category: 'Şehir', en: 'shop', tr: 'dükkan' },

  { category: 'Fiiller', en: 'eat', tr: 'yemek' },
  { category: 'Fiiller', en: 'drink', tr: 'içmek' },
  { category: 'Fiiller', en: 'go', tr: 'gitmek' },
  { category: 'Fiiller', en: 'buy', tr: 'satın almak' },
  { category: 'Fiiller', en: 'need', tr: 'ihtiyaç duymak' },
  { category: 'Fiiller', en: 'want', tr: 'istemek' },
  { category: 'Fiiller', en: 'understand', tr: 'anlamak' },
  { category: 'Fiiller', en: 'wait', tr: 'beklemek' },
  { category: 'Fiiller', en: 'speak', tr: 'konuşmak' },
  { category: 'Fiiller', en: 'read', tr: 'okumak' },
  { category: 'Fiiller', en: 'write', tr: 'yazmak' },
  { category: 'Fiiller', en: 'sleep', tr: 'uyumak' },
  { category: 'Fiiller', en: 'work', tr: 'çalışmak' },
  { category: 'Fiiller', en: 'help', tr: 'yardım etmek' },
  { category: 'Fiiller', en: 'ask', tr: 'sormak' },
  { category: 'Fiiller', en: 'call', tr: 'aramak' },

  { category: 'Sıfatlar', en: 'big', tr: 'büyük' },
  { category: 'Sıfatlar', en: 'small', tr: 'küçük' },
  { category: 'Sıfatlar', en: 'hot', tr: 'sıcak' },
  { category: 'Sıfatlar', en: 'cold', tr: 'soğuk' },
  { category: 'Sıfatlar', en: 'cheap', tr: 'ucuz' },
  { category: 'Sıfatlar', en: 'expensive', tr: 'pahalı' },
  { category: 'Sıfatlar', en: 'happy', tr: 'mutlu' },
  { category: 'Sıfatlar', en: 'tired', tr: 'yorgun' },
  { category: 'Sıfatlar', en: 'easy', tr: 'kolay' },
  { category: 'Sıfatlar', en: 'difficult', tr: 'zor' },

  { category: 'Zaman', en: 'today', tr: 'bugün' },
  { category: 'Zaman', en: 'tomorrow', tr: 'yarın' },
  { category: 'Zaman', en: 'yesterday', tr: 'dün' },
  { category: 'Zaman', en: 'morning', tr: 'sabah' },
  { category: 'Zaman', en: 'evening', tr: 'akşam' },
  { category: 'Zaman', en: 'week', tr: 'hafta' },
  { category: 'Zaman', en: 'month', tr: 'ay' },
  { category: 'Zaman', en: 'year', tr: 'yıl' },
  { category: 'Zaman', en: 'now', tr: 'şimdi' },
  { category: 'Zaman', en: 'late', tr: 'geç' },

  { category: 'Aile', en: 'mother', tr: 'anne' },
  { category: 'Aile', en: 'father', tr: 'baba' },
  { category: 'Aile', en: 'sister', tr: 'kız kardeş' },
  { category: 'Aile', en: 'brother', tr: 'erkek kardeş' },
  { category: 'Aile', en: 'friend', tr: 'arkadaş' },
  { category: 'Aile', en: 'child', tr: 'çocuk' },
  { category: 'Aile', en: 'husband', tr: 'koca / eş' },
  { category: 'Aile', en: 'wife', tr: 'kadın eş' },

  { category: 'Sağlık', en: 'doctor', tr: 'doktor' },
  { category: 'Sağlık', en: 'medicine', tr: 'ilaç' },
  { category: 'Sağlık', en: 'pain', tr: 'ağrı' },
  { category: 'Sağlık', en: 'fever', tr: 'ateş' },
  { category: 'Sağlık', en: 'pharmacy', tr: 'eczane' },
  { category: 'Sağlık', en: 'headache', tr: 'baş ağrısı' },
  { category: 'Sağlık', en: 'cough', tr: 'öksürük' },
  { category: 'Sağlık', en: 'healthy', tr: 'sağlıklı' },
  { category: 'Sağlık', en: 'allergy', tr: 'alerji' },
  { category: 'Sağlık', en: 'appointment', tr: 'randevu' },

  { category: 'Seyahat', en: 'passport', tr: 'pasaport' },
  { category: 'Seyahat', en: 'luggage', tr: 'bagaj' },
  { category: 'Seyahat', en: 'hotel', tr: 'otel' },
  { category: 'Seyahat', en: 'reservation', tr: 'rezervasyon' },
  { category: 'Seyahat', en: 'flight', tr: 'uçuş' },
  { category: 'Seyahat', en: 'visa', tr: 'vize' },
  { category: 'Seyahat', en: 'tourist', tr: 'turist' },
  { category: 'Seyahat', en: 'gate', tr: 'kapı (havalimanı)' },

  { category: 'Alışveriş', en: 'price', tr: 'fiyat' },
  { category: 'Alışveriş', en: 'discount', tr: 'indirim' },
  { category: 'Alışveriş', en: 'cash', tr: 'nakit' },
  { category: 'Alışveriş', en: 'receipt', tr: 'fiş' },
  { category: 'Alışveriş', en: 'size', tr: 'beden' },
  { category: 'Alışveriş', en: 'change', tr: 'para üstü' },
  { category: 'Alışveriş', en: 'bag', tr: 'çanta / poşet' },
  { category: 'Alışveriş', en: 'sale', tr: 'kampanya / indirim' },

  { category: 'Teknoloji', en: 'wifi password', tr: 'wifi şifresi' },
  { category: 'Teknoloji', en: 'charger', tr: 'şarj aleti' },
  { category: 'Teknoloji', en: 'battery', tr: 'batarya / pil' },
  { category: 'Teknoloji', en: 'screen', tr: 'ekran' },
  { category: 'Teknoloji', en: 'connection', tr: 'bağlantı' },
  { category: 'Teknoloji', en: 'download', tr: 'indirmek' },

  { category: 'Hava', en: 'sunny', tr: 'güneşli' },
  { category: 'Hava', en: 'rainy', tr: 'yağmurlu' },
  { category: 'Hava', en: 'cold', tr: 'soğuk' },
  { category: 'Hava', en: 'warm', tr: 'ılık / sıcak' },
  { category: 'Hava', en: 'windy', tr: 'rüzgarlı' },
  { category: 'Hava', en: 'weather', tr: 'hava durumu' },

  { category: 'Zaman', en: 'today', tr: 'bugün' },
  { category: 'Zaman', en: 'tomorrow', tr: 'yarın' },
  { category: 'Zaman', en: 'yesterday', tr: 'dün' },
  { category: 'Zaman', en: 'morning', tr: 'sabah' },
  { category: 'Zaman', en: 'evening', tr: 'akşam' },
  { category: 'Zaman', en: 'weekend', tr: 'hafta sonu' },
  { category: 'Zaman', en: 'minute', tr: 'dakika' },
  { category: 'Zaman', en: 'hour', tr: 'saat' },

  { category: 'Duygular', en: 'happy', tr: 'mutlu' },
  { category: 'Duygular', en: 'tired', tr: 'yorgun' },
  { category: 'Duygular', en: 'excited', tr: 'heyecanlı' },
  { category: 'Duygular', en: 'busy', tr: 'meşgul' },
  { category: 'Duygular', en: 'ready', tr: 'hazır' },

  { category: 'Acil', en: 'emergency', tr: 'acil durum' },
  { category: 'Acil', en: 'police', tr: 'polis' },
  { category: 'Acil', en: 'ambulance', tr: 'ambulans' },
  { category: 'Acil', en: 'hospital', tr: 'hastane' },
  { category: 'Acil', en: 'safe', tr: 'güvenli' }
];

// ==================== 2. GÜNLÜK EN ÇOK KULLANILAN 38 CÜMLE ====================
export const EVERYDAY_SENTENCES: SentenceItem[] = [
  { en: 'How are you?', tr: 'Nasılsın?' },
  { en: 'Nice to meet you.', tr: 'Tanıştığımıza memnun oldum.' },
  { en: 'What’s your name?', tr: 'Adın ne?' },
  { en: 'I don’t understand.', tr: 'Anlamıyorum.' },
  { en: 'Could you speak slowly?', tr: 'Daha yavaş konuşabilir misiniz?' },
  { en: 'Where is the bathroom?', tr: 'Tuvalet nerede?' },
  { en: 'How much is this?', tr: 'Bu ne kadar?' },
  { en: 'I’d like a coffee, please.', tr: 'Bir kahve istiyorum, lütfen.' },
  { en: 'Can I have the bill?', tr: 'Hesabı alabilir miyim?' },
  { en: 'What time is it?', tr: 'Saat kaç?' },
  { en: 'I’m lost.', tr: 'Kayboldum.' },
  { en: 'Can you help me?', tr: 'Bana yardım edebilir misiniz?' },
  { en: 'I’m running late.', tr: 'Geç kalıyorum.' },
  { en: 'See you tomorrow.', tr: 'Yarın görüşürüz.' },
  { en: 'Good morning! How did you sleep?', tr: 'Günaydın! Nasıl uyudun?' },
  { en: 'I’m sorry, I didn’t catch that.', tr: 'Özür dilerim, tam anlayamadım.' },
  { en: 'Could you repeat that, please?', tr: 'Tekrar eder misiniz, lütfen?' },
  { en: 'How do you say this in English?', tr: 'Bunu İngilizce nasıl söylersin?' },
  { en: 'What does this word mean?', tr: 'Bu kelime ne demek?' },
  { en: 'I’m looking for a pharmacy.', tr: 'Bir eczane arıyorum.' },
  { en: 'Do you accept credit cards?', tr: 'Kredi kartı kabul ediyor musunuz?' },
  { en: 'Where can I buy a ticket?', tr: 'Nereden bilet alabilirim?' },
  { en: 'Is this seat taken?', tr: 'Bu yer dolu mu?' },
  { en: 'I’ll be right back.', tr: 'Hemen dönerim.' },
  { en: 'Let me think about it.', tr: 'Bir düşüneyim.' },
  { en: 'That sounds good to me.', tr: 'Bana uygun geliyor / Kulağa hoş geliyor.' },
  { en: 'I’m not feeling well.', tr: 'Kendimi iyi hissetmiyorum.' },
  { en: 'I have an appointment at three.', tr: 'Saat üçte randevum var.' },
  { en: 'What do you do for a living?', tr: 'Ne iş yapıyorsun?' },
  { en: 'I’m a student.', tr: 'Ben öğrenciyim.' },
  { en: 'Can I pay by card?', tr: 'Kartla ödeyebilir miyim?' },
  { en: 'It’s nice weather today.', tr: 'Bugün hava çok güzel.' },
  { en: 'Take care!', tr: 'Kendine iyi bak!' },
  { en: 'Have a good weekend!', tr: 'İyi hafta sonları!' },
  { en: 'Thank you for your help.', tr: 'Yardımın için teşekkürler.' },
  { en: 'Don’t worry about it.', tr: 'Boş ver, dert etme.' },
  { en: 'Sorry I’m late.', tr: 'Geciktiğim için özür dilerim.' },
  { en: 'Can I borrow a pen?', tr: 'Bir kalem ödünç alabilir miyim?' },
  { en: 'What is the wifi password here?', tr: 'Buradaki wifi şifresi nedir?' },
  { en: 'Could I have a glass of tap water?', tr: 'Bir bardak su alabilir miyim?' },
  { en: 'Where is the nearest subway station?', tr: 'En yakın metro istasyonu nerede?' },
  { en: 'How long does it take to get there?', tr: 'Oraya gitmek ne kadar sürer?' },
  { en: 'I’d like to try this on, please.', tr: 'Bunu üzerimde denemek istiyorum lütfen.' },
  { en: 'Do you have this in a larger size?', tr: 'Bunun bir beden büyüğü var mı?' },
  { en: 'Keep the change, thank you!', tr: 'Üstü kalsın, teşekkürler!' },
  { en: 'Could you take a photo of us, please?', tr: 'Fotoğrafımızı çekebilir misiniz lütfen?' },
  { en: 'I’m looking for my boarding gate.', tr: 'Uçağa biniş kapımı arıyorum.' },
  { en: 'What time does the store close?', tr: 'Mağaza saat kaçta kapanıyor?' },
  { en: 'Let’s keep in touch!', tr: 'İletişimde kalalım!' },
  { en: 'I will let you know tomorrow.', tr: 'Sana yarın haber vereceğim.' },
  { en: 'Could you write that down for me?', tr: 'Bunu benim için yazabilir misiniz?' },
  { en: 'Is service included in the bill?', tr: 'Servis ücrete dahil mi?' },
  { en: 'Have a safe flight!', tr: 'İyi uçuşlar!' }
];

// ==================== 3. 22 GERÇEK HAYAT DİYALOĞU & ROL YAPMA ====================
export const DAILY_DIALOGUES: DialogueItem[] = [
  {
    id: 'd-cafe',
    title: '☕ Kafede Sipariş',
    category: 'Yemek & İçecek',
    lines: [
      { en: 'Hi! What can I get you?', tr: 'Merhaba! Ne alabilirim?', speaker: 'A' },
      { en: 'A latte, please.', tr: 'Bir latte, lütfen.', speaker: 'B' },
      { en: 'For here or to go?', tr: 'Burada mı, paket mi?', speaker: 'A' },
      { en: 'To go, please.', tr: 'Paket, lütfen.', speaker: 'B' },
      { en: 'That’s four dollars.', tr: 'Dört dolar.', speaker: 'A' },
      { en: 'Here you are. Thank you!', tr: 'Buyurun. Teşekkürler!', speaker: 'B' }
    ]
  },
  {
    id: 'd-directions',
    title: '🧭 Yol Sorma',
    category: 'Şehir & Yol',
    lines: [
      { en: 'Excuse me, where is the station?', tr: 'Pardon, istasyon nerede?', speaker: 'A' },
      { en: 'Go straight and turn left.', tr: 'Düz gidin ve sola dönün.', speaker: 'B' },
      { en: 'Is it far?', tr: 'Uzak mı?', speaker: 'A' },
      { en: 'No, it’s five minutes on foot.', tr: 'Hayır, yürüyerek beş dakika.', speaker: 'B' },
      { en: 'Thanks a lot!', tr: 'Çok teşekkürler!', speaker: 'A' },
      { en: 'You’re welcome.', tr: 'Rica ederim.', speaker: 'B' }
    ]
  },
  {
    id: 'd-meeting',
    title: '👋 Yeni Biriyle Tanışma',
    category: 'Sosyal Hayat',
    lines: [
      { en: 'Hi, I’m Ali. Nice to meet you.', tr: 'Merhaba, ben Ali. Tanıştığımıza memnun oldum.', speaker: 'A' },
      { en: 'Nice to meet you too. I’m Emma.', tr: 'Ben de memnun oldum. Ben Emma.', speaker: 'B' },
      { en: 'Where are you from?', tr: 'Nerelisin?', speaker: 'A' },
      { en: 'I’m from Turkey. And you?', tr: 'Türkiye’denim. Sen?', speaker: 'B' },
      { en: 'I’m from London.', tr: 'Ben Londralıyım.', speaker: 'A' },
      { en: 'Great! See you around.', tr: 'Harika! Görüşürüz.', speaker: 'B' }
    ]
  },
  {
    id: 'd-restaurant',
    title: '🍽️ Restoranda Akşam Yemeği',
    category: 'Yemek & İçecek',
    lines: [
      { en: 'A table for two, please.', tr: 'İki kişilik masa, lütfen.', speaker: 'A' },
      { en: 'Right this way. Here’s the menu.', tr: 'Bu taraftan. Menü burada.', speaker: 'B' },
      { en: 'What do you recommend?', tr: 'Ne tavsiye edersiniz?', speaker: 'A' },
      { en: 'The grilled chicken is delicious.', tr: 'Izgara tavuk çok lezzetli.', speaker: 'B' },
      { en: 'I’ll have that, and a glass of water.', tr: 'Onu alayım, bir de bir bardak su.', speaker: 'A' },
      { en: 'Could we have the bill, please?', tr: 'Hesabı alabilir miyiz, lütfen?', speaker: 'B' }
    ]
  },
  {
    id: 'd-shopping',
    title: '🛒 Mağazada Alışveriş',
    category: 'Alışveriş',
    lines: [
      { en: 'Can I help you?', tr: 'Yardımcı olabilir miyim?', speaker: 'A' },
      { en: 'I’m looking for a jacket.', tr: 'Bir ceket arıyorum.', speaker: 'B' },
      { en: 'What size are you?', tr: 'Kaç beden giyiyorsunuz?', speaker: 'A' },
      { en: 'Medium. Can I try it on?', tr: 'Medium. Deneyebilir miyim?', speaker: 'B' },
      { en: 'Sure. The fitting room is over there.', tr: 'Tabii. Deneme kabini şurada.', speaker: 'A' },
      { en: 'I’ll take it. Do you accept cards?', tr: 'Alıyorum. Kart geçiyor mu?', speaker: 'B' }
    ]
  },
  {
    id: 'd-hotel',
    title: '🏨 Otelde Giriş (Check-in)',
    category: 'Seyahat & Otel',
    lines: [
      { en: 'Hello, I have a reservation.', tr: 'Merhaba, rezervasyonum var.', speaker: 'A' },
      { en: 'What’s the name, please?', tr: 'Adınız nedir, lütfen?', speaker: 'B' },
      { en: 'Ali Yılmaz. Two nights.', tr: 'Ali Yılmaz. İki gece.', speaker: 'A' },
      { en: 'Here is your key. Room 305.', tr: 'Anahtarınız burada. 305 numaralı oda.', speaker: 'B' },
      { en: 'What time is breakfast?', tr: 'Kahvaltı saat kaçta?', speaker: 'A' },
      { en: 'From seven to ten.', tr: 'Yediden ona kadar.', speaker: 'B' }
    ]
  },
  {
    id: 'd-taxi',
    title: '🚕 Takside Yolculuk',
    category: 'Ulaşım',
    lines: [
      { en: 'Where to?', tr: 'Nereye?', speaker: 'A' },
      { en: 'To the airport, please.', tr: 'Havalimanına, lütfen.', speaker: 'B' },
      { en: 'Sure. Do you have any luggage?', tr: 'Tabii. Bagajınız var mı?', speaker: 'A' },
      { en: 'Yes, two bags.', tr: 'Evet, iki çanta.', speaker: 'B' },
      { en: 'How long will it take?', tr: 'Ne kadar sürer?', speaker: 'A' },
      { en: 'About thirty minutes.', tr: 'Yaklaşık otuz dakika.', speaker: 'B' }
    ]
  },
  {
    id: 'd-airport',
    title: '✈️ Havalimanında Biniş',
    category: 'Seyahat',
    lines: [
      { en: 'Can I see your passport, please?', tr: 'Pasaportunuzu görebilir miyim?', speaker: 'A' },
      { en: 'Here you go.', tr: 'Buyurun.', speaker: 'B' },
      { en: 'Do you want a window or an aisle seat?', tr: 'Cam kenarı mı, koridor mu istersiniz?', speaker: 'A' },
      { en: 'A window seat, please.', tr: 'Cam kenarı, lütfen.', speaker: 'B' },
      { en: 'Your gate is B12. Boarding is at six.', tr: 'Kapınız B12. Biniş altıda.', speaker: 'A' },
      { en: 'Thank you. Have a nice day!', tr: 'Teşekkürler. İyi günler!', speaker: 'B' }
    ]
  },
  {
    id: 'd-doctor',
    title: '🩺 Doktorda Şikayet',
    category: 'Sağlık',
    lines: [
      { en: 'What seems to be the problem?', tr: 'Sorun nedir?', speaker: 'A' },
      { en: 'I have a headache and a sore throat.', tr: 'Başım ağrıyor ve boğazım şiş.', speaker: 'B' },
      { en: 'How long have you felt like this?', tr: 'Ne zamandır böyle hissediyorsunuz?', speaker: 'A' },
      { en: 'Since yesterday.', tr: 'Dünden beri.', speaker: 'B' },
      { en: 'Take this medicine twice a day.', tr: 'Bu ilacı günde iki kez için.', speaker: 'A' },
      { en: 'Thank you, doctor.', tr: 'Teşekkürler, doktor bey.', speaker: 'B' }
    ]
  },
  {
    id: 'd-phone',
    title: '📞 Telefonda Mesaj Bırakma',
    category: 'İletişim',
    lines: [
      { en: 'Hello, can I speak to Sarah?', tr: 'Merhaba, Sarah ile görüşebilir miyim?', speaker: 'A' },
      { en: 'She’s not here right now.', tr: 'Şu an burada değil.', speaker: 'B' },
      { en: 'Can I leave a message?', tr: 'Mesaj bırakabilir miyim?', speaker: 'A' },
      { en: 'Of course. Go ahead.', tr: 'Tabii. Buyurun.', speaker: 'B' },
      { en: 'Please ask her to call me back.', tr: 'Lütfen beni geri aramasını söyleyin.', speaker: 'A' },
      { en: 'I will. Goodbye!', tr: 'Söylerim. Hoşça kalın!', speaker: 'B' }
    ]
  },
  {
    id: 'd-work',
    title: '🏢 İş Yerinde Sohbet',
    category: 'İş & Kariyer',
    lines: [
      { en: 'Good morning! How was your weekend?', tr: 'Günaydın! Hafta sonun nasıldı?', speaker: 'A' },
      { en: 'It was great, thanks. And yours?', tr: 'Harikaydı, sağ ol. Seninki?', speaker: 'B' },
      { en: 'Pretty relaxing. Are you ready for the meeting?', tr: 'Oldukça dinlendirici. Toplantıya hazır mısın?', speaker: 'A' },
      { en: 'Almost. I need five more minutes.', tr: 'Neredeyse. Beş dakikaya daha ihtiyacım var.', speaker: 'B' },
      { en: 'No problem. I’ll wait for you.', tr: 'Sorun değil. Seni beklerim.', speaker: 'A' },
      { en: 'Thanks, I appreciate it.', tr: 'Sağ ol, minnettarım.', speaker: 'B' }
    ]
  },
  {
    id: 'd-bus',
    title: '🚌 Otobüs ve Toplu Taşıma',
    category: 'Ulaşım',
    lines: [
      { en: 'Does this bus go to the city center?', tr: 'Bu otobüs şehir merkezine gidiyor mu?', speaker: 'A' },
      { en: 'Yes, it does.', tr: 'Evet, gidiyor.', speaker: 'B' },
      { en: 'How much is a ticket?', tr: 'Bilet ne kadar?', speaker: 'A' },
      { en: 'Two dollars.', tr: 'İki dolar.', speaker: 'B' },
      { en: 'Which stop should I get off at?', tr: 'Hangi durakta inmeliyim?', speaker: 'A' },
      { en: 'The next one. I’ll tell you.', tr: 'Bir sonrakinde. Sana söylerim.', speaker: 'B' }
    ]
  }
];

// ==================== 4. 30 GÜNLÜK KALIP MOTORU (30 PATTERNS) ====================
export const DAILY_PATTERNS: PatternItem[] = [
  {
    id: 'p1',
    title: 'I’d like …',
    desc: '… istiyorum (nazik söyleme biçimi). Siparişte, otelde, her yerde işe yarar.',
    examples: [
      { en: 'I’d like a coffee, please.', tr: 'Bir kahve istiyorum, lütfen.' },
      { en: 'I’d like the bill, please.', tr: 'Hesabı istiyorum, lütfen.' },
      { en: 'I’d like to book a room.', tr: 'Bir oda ayırtmak istiyorum.' },
      { en: 'I’d like some water.', tr: 'Biraz su istiyorum.' }
    ]
  },
  {
    id: 'p2',
    title: 'Can I …?',
    desc: '… yapabilir miyim? İzin ya da rica istemenin en kolay yolu.',
    examples: [
      { en: 'Can I sit here?', tr: 'Buraya oturabilir miyim?' },
      { en: 'Can I try this on?', tr: 'Bunu deneyebilir miyim?' },
      { en: 'Can I pay by card?', tr: 'Kartla ödeyebilir miyim?' },
      { en: 'Can I have some water?', tr: 'Biraz su alabilir miyim?' }
    ]
  },
  {
    id: 'p3',
    title: 'Where is …?',
    desc: '… nerede? Yer sormak için.',
    examples: [
      { en: 'Where is the bathroom?', tr: 'Tuvalet nerede?' },
      { en: 'Where is the station?', tr: 'İstasyon nerede?' },
      { en: 'Where is my bag?', tr: 'Çantam nerede?' },
      { en: 'Where is the exit?', tr: 'Çıkış nerede?' }
    ]
  },
  {
    id: 'p4',
    title: 'How much is …?',
    desc: '… ne kadar? Fiyat sormak için.',
    examples: [
      { en: 'How much is this?', tr: 'Bu ne kadar?' },
      { en: 'How much is the ticket?', tr: 'Bilet ne kadar?' },
      { en: 'How much is a coffee?', tr: 'Bir kahve ne kadar?' },
      { en: 'How much is the room?', tr: 'Oda ne kadar?' }
    ]
  },
  {
    id: 'p5',
    title: 'I need …',
    desc: '… ihtiyacım var. Acil durumlarda ve ihtiyaçta.',
    examples: [
      { en: 'I need help.', tr: 'Yardıma ihtiyacım var.' },
      { en: 'I need a taxi.', tr: 'Taksiye ihtiyacım var.' },
      { en: 'I need more time.', tr: 'Biraz daha zamana ihtiyacım var.' },
      { en: 'I need a doctor.', tr: 'Doktora ihtiyacım var.' }
    ]
  },
  {
    id: 'p6',
    title: 'Could you …?',
    desc: '… yapar mısınız? Çok kibar bir rica.',
    examples: [
      { en: 'Could you help me?', tr: 'Bana yardım eder misiniz?' },
      { en: 'Could you repeat that?', tr: 'Tekrar eder misiniz?' },
      { en: 'Could you speak slowly?', tr: 'Yavaş konuşur musunuz?' },
      { en: 'Could you open the window?', tr: 'Pencereyi açar mısınız?' }
    ]
  },
  {
    id: 'p7',
    title: 'How do I get to …?',
    desc: '… nasıl giderim? Yol tarifi istemek için.',
    examples: [
      { en: 'How do I get to the station?', tr: 'İstasyona nasıl giderim?' },
      { en: 'How do I get to the airport?', tr: 'Havalimanına nasıl giderim?' },
      { en: 'How do I get to the city center?', tr: 'Şehir merkezine nasıl giderim?' },
      { en: 'How do I get to your house?', tr: 'Evinize nasıl gelirim?' }
    ]
  },
  {
    id: 'p8',
    title: 'I think …',
    desc: 'Bence … / sanırım …. Görüş belirtmek için.',
    examples: [
      { en: 'I think it’s good.', tr: 'Bence iyi.' },
      { en: 'I think you’re right.', tr: 'Bence haklısın.' },
      { en: 'I think I’m lost.', tr: 'Sanırım kayboldum.' },
      { en: 'I think it’s too expensive.', tr: 'Bence çok pahalı.' }
    ]
  }
];

// ==================== 5. CÜMLE KURMA OYUNU PUZZLE’LARI (24 PUZZLE) ====================
export const SENTENCE_PUZZLES: SentencePuzzle[] = [
  { id: 'pz1', en: 'I drink coffee every morning', tr: 'Her sabah kahve içerim' },
  { id: 'pz2', en: 'Where is the station', tr: 'İstasyon nerede' },
  { id: 'pz3', en: 'She doesn’t speak French', tr: 'O Fransızca konuşmaz' },
  { id: 'pz4', en: 'Can I have the bill', tr: 'Hesabı alabilir miyim' },
  { id: 'pz5', en: 'We are going to the beach', tr: 'Plaja gidiyoruz' },
  { id: 'pz6', en: 'I would like a glass of water', tr: 'Bir bardak su istiyorum' },
  { id: 'pz7', en: 'My name is Ali', tr: 'Benim adım Ali' },
  { id: 'pz8', en: 'I am from Turkey', tr: 'Ben Türkiyeliyim' },
  { id: 'pz9', en: 'Do you have a table for two', tr: 'İki kişilik masanız var mı' },
  { id: 'pz10', en: 'He works in a bank', tr: 'O bankada çalışıyor' },
  { id: 'pz11', en: 'Can you speak more slowly', tr: 'Biraz daha yavaş konuşabilir misin' },
  { id: 'pz12', en: 'I will call you tomorrow', tr: 'Seni yarın arayacağım' },
  { id: 'pz13', en: 'We went to the park yesterday', tr: 'Dün parka gittik' },
  { id: 'pz14', en: 'How much is this jacket', tr: 'Bu ceket ne kadar' },
  { id: 'pz15', en: 'Is there a pharmacy near here', tr: 'Yakınlarda eczane var mı' }
];

// ==================== 6. BASİT CÜMLE KURMANIN 7 ADIMI ====================
export const GRAMMAR_BLUEPRINTS: GrammarRule[] = [
  {
    id: 'g1',
    title: '1. Temel kalıp: Kim, Ne yapıyor, Neyi?',
    desc: 'İngilizcede sıra hep aynıdır: özne + fiil + nesne. Türkçede fiil sonda gelir, İngilizcede ortada.',
    examples: [
      { en: 'I drink coffee.', tr: 'Ben kahve içerim.' },
      { en: 'She buys bread.', tr: 'O ekmek alır.' },
      { en: 'We need a map.', tr: 'Bir haritaya ihtiyacımız var.' }
    ]
  },
  {
    id: 'g2',
    title: '2. “Olmak” fiili: am / is / are',
    desc: 'I → am, he/she/it → is, you/we/they → are. Sıfat ve durum/yer bildirirken kullanılır.',
    examples: [
      { en: 'I am hungry.', tr: 'Açım.' },
      { en: 'She is at home.', tr: 'O evde.' },
      { en: 'They are my friends.', tr: 'Onlar benim arkadaşlarım.' }
    ]
  },
  {
    id: 'g3',
    title: '3. Olumsuz yap: not ekle',
    desc: 'am/is/are fiillerinden sonra not koy. Diğer fiillerde don’t + fiil kullan (he/she/it için doesn’t).',
    examples: [
      { en: 'I’m not tired.', tr: 'Yorgun değilim.' },
      { en: 'I don’t understand.', tr: 'Anlamıyorum.' },
      { en: 'He doesn’t drink coffee.', tr: 'O kahve içmez.' }
    ]
  },
  {
    id: 'g4',
    title: '4. Soru yap: Yardımcıyı öne al',
    desc: 'am/is/are başa geçer. Diğer fiillerde Do / Does + özne + fiil kur.',
    examples: [
      { en: 'Are you ready?', tr: 'Hazır mısın?' },
      { en: 'Do you speak English?', tr: 'İngilizce konuşuyor musun?' },
      { en: 'Does she live here?', tr: 'O burada mı yaşıyor?' }
    ]
  },
  {
    id: 'g5',
    title: '5. Soru kelimeleri',
    desc: 'What (ne), Where (nerede), When (ne zaman), Who (kim), How (nasıl). Başa koy, arkasına soru kalıbı ekle.',
    examples: [
      { en: 'Where do you live?', tr: 'Nerede yaşıyorsun?' },
      { en: 'What time is it?', tr: 'Saat kaç?' },
      { en: 'How much is this?', tr: 'Bu ne kadar?' }
    ]
  },
  {
    id: 'g6',
    title: '6. Hazır kalıplar',
    desc: 'Bunları ezberle, boşluğu istediğin kelimeyle doldur: I’d like… (istiyorum), Can I…? (yapabilir miyim?), Could you…? (yapar mısınız?).',
    examples: [
      { en: 'I’d like a tea, please.', tr: 'Bir çay istiyorum, lütfen.' },
      { en: 'Can I sit here?', tr: 'Buraya oturabilir miyim?' },
      { en: 'Could you help me?', tr: 'Bana yardım eder misiniz?' }
    ]
  },
  {
    id: 'g7',
    title: '7. Geçmiş ve gelecek',
    desc: 'Geçmiş: fiile -ed ekle ya da özel halini kullan (go → went). Gelecek: will + fiil.',
    examples: [
      { en: 'I watched a movie yesterday.', tr: 'Dün film izledim.' },
      { en: 'I went to work.', tr: 'İşe gittim.' },
      { en: 'I will call you tomorrow.', tr: 'Seni yarın arayacağım.' }
    ]
  }
];

// ==================== ALMANCA GÜNLÜK VERİ HAVUZU (DEUTSCH) ====================
export const GERMAN_EVERYDAY_SENTENCES: SentenceItem[] = [
  { en: 'Wie geht es dir?', tr: 'Nasılsın?' },
  { en: 'Freut mich, dich kennenzulernen.', tr: 'Tanıştığımıza memnun oldum.' },
  { en: 'Wie heißt du?', tr: 'Adın ne?' },
  { en: 'Ich verstehe nicht.', tr: 'Anlamıyorum.' },
  { en: 'Könnten Sie bitte langsamer sprechen?', tr: 'Daha yavaş konuşabilir misiniz?' },
  { en: 'Wo ist die Toilette?', tr: 'Tuvalet nerede?' },
  { en: 'Wie viel kostet das?', tr: 'Bu ne kadar?' },
  { en: 'Ich hätte gerne einen Kaffee, bitte.', tr: 'Bir kahve istiyorum, lütfen.' },
  { en: 'Könnte ich bitte die Rechnung haben?', tr: 'Hesabı alabilir miyim?' },
  { en: 'Wie spät ist es?', tr: 'Saat kaç?' },
  { en: 'Ich habe mich verlaufen.', tr: 'Kayboldum.' },
  { en: 'Können Sie mir helfen?', tr: 'Bana yardım edebilir misiniz?' },
  { en: 'Bis morgen!', tr: 'Yarın görüşürüz.' },
  { en: 'Guten Morgen! Wie hast du geschlafen?', tr: 'Günaydın! Nasıl uyudun?' }
];

export const GERMAN_DIALOGUES: DialogueItem[] = [
  {
    id: 'de-cafe-order',
    title: 'Im Café (Kafede Sipariş)',
    category: 'Sipariş & Kafe',
    lines: [
      { speaker: 'A', en: 'Guten Tag! Was möchten Sie bestellen?', tr: 'İyi günler! Ne sipariş etmek istersiniz?' },
      { speaker: 'B', en: 'Guten Tag! Ich hätte gerne einen Cappuccino mit Hafermilch.', tr: 'İyi günler! Yulaf sütlü bir kapuçino rica ediyorum.' },
      { speaker: 'A', en: 'Sehr gerne. Möchten Sie auch ein Stück Kuchen dazu?', tr: 'Memnuniyetle. Yanında bir dilim pasta da ister misiniz?' },
      { speaker: 'B', en: 'Ja bitte, den Apfelstrudel.', tr: 'Evet lütfen, elmalı strudel olsun.' },
      { speaker: 'A', en: 'Kommt sofort! Zusammen oder getrennt?', tr: 'Hemen geliyor! Birlikte mi ayrı mı?' },
      { speaker: 'B', en: 'Ich zahle mit Karte, bitte.', tr: 'Kartla ödüyorum, lütfen.' }
    ]
  },
  {
    id: 'de-directions',
    title: 'Nach dem Weg fragen (Yol Tarifi)',
    category: 'Şehir & Yol',
    lines: [
      { speaker: 'A', en: 'Entschuldigung, wie komme ich zum Hauptbahnhof?', tr: 'Afedersiniz, merkez tren garına nasıl gidebilirim?' },
      { speaker: 'B', en: 'Gehen Sie geradeaus und dann die zweite Straße links.', tr: 'Düz gidin ve ardından ikinci sokaktan sola dönün.' },
      { speaker: 'A', en: 'Ist es weit von hier?', tr: 'Buradan uzak mı?' },
      { speaker: 'B', en: 'Nein, nur fünf Minuten zu Fuß.', tr: 'Hayır, yürüyerek sadece 5 dakika.' },
      { speaker: 'A', en: 'Vielen herzlichen Dank!', tr: 'Çok teşekkür ederim!' }
    ]
  }
];

export const GERMAN_SENTENCE_PUZZLES: SentencePuzzle[] = [
  { id: 'de-puz-1', en: 'Ich hätte gerne einen Kaffee', tr: 'Bir kahve rica ediyorum' },
  { id: 'de-puz-2', en: 'Wie geht es dir heute', tr: 'Bugün nasılsın' },
  { id: 'de-puz-3', en: 'Wo ist der Bahnhof bitte', tr: 'Tren garı nerede lütfen' },
  { id: 'de-puz-4', en: 'Ich lerne jeden Tag Deutsch', tr: 'Her gün Almanca öğreniyorum' }
];

export const DIALOGUES = DAILY_DIALOGUES;

export const DailyLanguageData = {
  getEverydaySentences(lang: 'en' | 'de' = 'en'): SentenceItem[] {
    return lang === 'de' ? GERMAN_EVERYDAY_SENTENCES : EVERYDAY_SENTENCES;
  },
  getDialogues(lang: 'en' | 'de' = 'en'): DialogueItem[] {
    return lang === 'de' ? GERMAN_DIALOGUES : DAILY_DIALOGUES;
  },
  getSentencePuzzles(lang: 'en' | 'de' = 'en'): SentencePuzzle[] {
    return lang === 'de' ? GERMAN_SENTENCE_PUZZLES : SENTENCE_PUZZLES;
  }
};
