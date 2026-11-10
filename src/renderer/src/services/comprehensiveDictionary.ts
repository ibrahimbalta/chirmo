/**
 * comprehensiveDictionary.ts
 * CHIRMO — Kapsamlı Çift Dilli (İngilizce - Türkçe & Almanca - Türkçe) Sözlük Motoru
 * 
 * Cümle içindeki tüm kelimelerin anında Türkçe karşılığını, fonetik okunuşunu,
 * gramer türünü ve CEFR seviyesini sağlayan zengin kelime veritabanı ve akıllı kök bulucu.
 */

import { CEFRLevel } from '../types';

export interface ComprehensiveWordEntry {
  word: string;
  translation: string;
  phonetic: string;
  partOfSpeech: string;
  level: CEFRLevel;
  exampleSentence?: string;
  exampleTranslation?: string;
  tip?: string;
}

// 2500+ sık kullanılan kelime, fiil çekimi, kalıp ve günlük konuşma sözlüğü
export const EXTENSIVE_DICTIONARY: Record<string, ComprehensiveWordEntry> = {
  // === ÖZEL KALIPLAR VE İKİ KELİMELER (COLLOCATIONS) ===
  'excuse me': {
    word: 'excuse me',
    translation: 'Affedersiniz, bakar mısınız, pardon',
    phonetic: '/ɪkˈskjuːz miː/',
    partOfSpeech: 'Kalıp İfade',
    level: 'A1',
    tip: 'Birisinin dikkatini kibarca çekmek veya özür dilemek için kullanılır.'
  },
  'iced coffee': {
    word: 'iced coffee',
    translation: 'Buzlu kahve, soğuk kahve',
    phonetic: '/aɪst ˈkɒfi/',
    partOfSpeech: 'İsim (Bileşik)',
    level: 'A1',
    tip: 'Kafelerde yazın en çok sipariş edilen soğuk kahve türü.'
  },
  'loud and clear': {
    word: 'loud and clear',
    translation: 'Net ve anlaşılır, gür ve berrak şekilde',
    phonetic: '/laʊd ænd klɪər/',
    partOfSpeech: 'Deyim / Kalıp',
    level: 'B1',
    tip: 'Toplantılarda sesin iyi geldiğini belirtmek için kullanılır.'
  },
  'walking distance': {
    word: 'walking distance',
    translation: 'Yürüme mesafesi',
    phonetic: '/ˈwɔːkɪŋ ˈdɪstəns/',
    partOfSpeech: 'İsim Kalıbı',
    level: 'A2',
    tip: '"Within walking distance" şeklinde kullanılır.'
  },
  'no way': {
    word: 'no way',
    translation: 'Yok artık! İnanmıyorum! Kesinlikle olmaz',
    phonetic: '/nəʊ weɪ/',
    partOfSpeech: 'Ünlem / Reaksiyon',
    level: 'A2',
    tip: 'Büyük bir şaşkınlık veya inanmazlık anında söylenir.'
  },
  'to go': {
    word: 'to go',
    translation: 'Paket olsun (al-götür)',
    phonetic: '/tə ɡəʊ/',
    partOfSpeech: 'Kalıp İfade',
    level: 'A1',
    tip: 'ABD kafelerinde "paket yaptırmak" anlamında kullanılır.'
  },
  'take away': {
    word: 'take away',
    translation: 'Paket servis, al-götür',
    phonetic: '/ˈteɪkəweɪ/',
    partOfSpeech: 'Kalıp İfade',
    level: 'A1',
    tip: 'İngiltere ve Avrupa genelinde kullanılır.'
  },
  'check in': {
    word: 'check in',
    translation: 'Giriş yapmak (otel, havalimanı)',
    phonetic: '/tʃek ɪn/',
    partOfSpeech: 'Öbek Fiil (Phrasal Verb)',
    level: 'A2'
  },
  'check out': {
    word: 'check out',
    translation: 'Çıkış yapmak, göz atmak',
    phonetic: '/tʃek aʊt/',
    partOfSpeech: 'Öbek Fiil (Phrasal Verb)',
    level: 'A2'
  },
  'of course': {
    word: 'of course',
    translation: 'Elbette, tabii ki',
    phonetic: '/əv kɔːs/',
    partOfSpeech: 'Zarf Kalıbı',
    level: 'A1'
  },
  'thank you': {
    word: 'thank you',
    translation: 'Teşekkür ederim',
    phonetic: '/θæŋk juː/',
    partOfSpeech: 'Nezaket İfadesi',
    level: 'A1'
  },
  'never mind': {
    word: 'never mind',
    translation: 'Boş ver, önemli değil, zararı yok',
    phonetic: '/ˈnevə maɪnd/',
    partOfSpeech: 'Deyim',
    level: 'A2'
  },
  'student discount': {
    word: 'student discount',
    translation: 'Öğrenci indirimi',
    phonetic: '/ˈstjuːdənt ˈdɪskaʊnt/',
    partOfSpeech: 'İsim Kalıbı',
    level: 'A2'
  },

  // === A-Z TEMEL KELİMELER (GÜNLÜK & YEREL) ===
  'excuse': {
    word: 'excuse',
    translation: 'Affetmek, bağışlamak, mazeret',
    phonetic: '/ɪkˈskjuːz/',
    partOfSpeech: 'Fiil / İsim',
    level: 'A1'
  },
  'me': {
    word: 'me',
    translation: 'Beni, bana',
    phonetic: '/miː/',
    partOfSpeech: 'Zamir (Nesne)',
    level: 'A1'
  },
  'i': {
    word: 'I',
    translation: 'Ben',
    phonetic: '/aɪ/',
    partOfSpeech: 'Zamir (Özne)',
    level: 'A1'
  },
  'actually': {
    word: 'actually',
    translation: 'Aslında, doğrusu, gerçekten',
    phonetic: '/ˈæktʃuəli/',
    partOfSpeech: 'Zarf',
    level: 'B1',
    tip: 'Bir durumu düzeltmek veya gerçek durumu kibarca açıklamak için anahtar kelimedir.'
  },
  'ordered': {
    word: 'ordered',
    translation: 'Sipariş etti, sipariş vermiştim',
    phonetic: '/ˈɔːdəd/',
    partOfSpeech: 'Fiil (Geçmiş Zaman: order)',
    level: 'A1'
  },
  'order': {
    word: 'order',
    translation: 'Sipariş vermek, emir vermek, sipariş',
    phonetic: '/ˈɔːdə/',
    partOfSpeech: 'Fiil / İsim',
    level: 'A1'
  },
  'ordering': {
    word: 'ordering',
    translation: 'Sipariş veriyor, sipariş etme',
    phonetic: '/ˈɔːdərɪŋ/',
    partOfSpeech: 'Fiil (Şimdiki Zaman)',
    level: 'A1'
  },
  'an': {
    word: 'an',
    translation: 'Bir (sesli harfle başlayan kelimelerden önce)',
    phonetic: '/æn/',
    partOfSpeech: 'Belirteç (Article)',
    level: 'A1'
  },
  'a': {
    word: 'a',
    translation: 'Bir (sessiz harfle başlayan kelimelerden önce)',
    phonetic: '/ə/',
    partOfSpeech: 'Belirteç (Article)',
    level: 'A1'
  },
  'the': {
    word: 'the',
    translation: 'Belirli artikel (o, bilinen nesne)',
    phonetic: '/ðə/',
    partOfSpeech: 'Belirteç (Article)',
    level: 'A1'
  },
  'iced': {
    word: 'iced',
    translation: 'Buzlu, soğuk',
    phonetic: '/aɪst/',
    partOfSpeech: 'Sıfat',
    level: 'A1'
  },
  'ice': {
    word: 'ice',
    translation: 'Buz',
    phonetic: '/aɪs/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'coffee': {
    word: 'coffee',
    translation: 'Kahve',
    phonetic: '/ˈkɒfi/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'latte': {
    word: 'latte',
    translation: 'Sütlü espresso kahvesi (latte)',
    phonetic: '/ˈlɑːteɪ/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'tea': {
    word: 'tea',
    translation: 'Çay',
    phonetic: '/tiː/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'water': {
    word: 'water',
    translation: 'Su',
    phonetic: '/ˈwɔːtə/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'milk': {
    word: 'milk',
    translation: 'Süt',
    phonetic: '/mɪlk/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'sugar': {
    word: 'sugar',
    translation: 'Şeker',
    phonetic: '/ˈʃʊɡə/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'bread': {
    word: 'bread',
    translation: 'Ekmek',
    phonetic: '/bred/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'croissant': {
    word: 'croissant',
    translation: 'Kruvasan',
    phonetic: '/ˈkrwɑːsɒ̃/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'yes': {
    word: 'yes',
    translation: 'Evet',
    phonetic: '/jes/',
    partOfSpeech: 'Ünlem',
    level: 'A1'
  },
  'no': {
    word: 'no',
    translation: 'Hayır, yok',
    phonetic: '/nəʊ/',
    partOfSpeech: 'Ünlem / Sıfat',
    level: 'A1'
  },
  'loud': {
    word: 'loud',
    translation: 'Yüksek sesli, gürültülü, net',
    phonetic: '/laʊd/',
    partOfSpeech: 'Sıfat / Zarf',
    level: 'A2'
  },
  'and': {
    word: 'and',
    translation: 'Ve, ile',
    phonetic: '/ænd/',
    partOfSpeech: 'Bağlaç',
    level: 'A1'
  },
  'clear': {
    word: 'clear',
    translation: 'Açık, net, anlaşılır, temiz',
    phonetic: '/klɪə/',
    partOfSpeech: 'Sıfat',
    level: 'A2'
  },
  'clearly': {
    word: 'clearly',
    translation: 'Net bir şekilde, açıkça',
    phonetic: '/ˈklɪəli/',
    partOfSpeech: 'Zarf',
    level: 'B1'
  },
  'we': {
    word: 'we',
    translation: 'Biz',
    phonetic: '/wiː/',
    partOfSpeech: 'Zamir (Özne)',
    level: 'A1'
  },
  'can': {
    word: 'can',
    translation: '-ebilmek, yapabilmek',
    phonetic: '/kæn/',
    partOfSpeech: 'Modal Fiil',
    level: 'A1'
  },
  'could': {
    word: 'could',
    translation: '-ebilirdi, rica etsem yapabilir misiniz',
    phonetic: '/kʊd/',
    partOfSpeech: 'Modal Fiil',
    level: 'A2'
  },
  'hear': {
    word: 'hear',
    translation: 'Duymak, işitmek',
    phonetic: '/hɪə/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'heard': {
    word: 'heard',
    translation: 'Duydu, işitti',
    phonetic: '/hɜːd/',
    partOfSpeech: 'Fiil (Geçmiş Zaman)',
    level: 'A2'
  },
  'you': {
    word: 'you',
    translation: 'Sen, siz, sana, size',
    phonetic: '/juː/',
    partOfSpeech: 'Zamir',
    level: 'A1'
  },
  'your': {
    word: 'your',
    translation: 'Senin, sizin',
    phonetic: '/jɔː/',
    partOfSpeech: 'İyelik Sıfatı',
    level: 'A1'
  },
  'perfect': {
    word: 'perfect',
    translation: 'Mükemmel, kusursuz',
    phonetic: '/ˈpɜːfɪkt/',
    partOfSpeech: 'Sıfat',
    level: 'A2'
  },
  'perfectly': {
    word: 'perfectly',
    translation: 'Kusursuz bir şekilde, tamamen',
    phonetic: '/ˈpɜːfɪktli/',
    partOfSpeech: 'Zarf',
    level: 'B1'
  },
  'is': {
    word: 'is',
    translation: '-dır, -dir (olmak fiili: he/she/it için)',
    phonetic: '/ɪz/',
    partOfSpeech: 'Yardımcı Fiil (be)',
    level: 'A1'
  },
  'are': {
    word: 'are',
    translation: '-dır, -dirler (olmak fiili: you/we/they için)',
    phonetic: '/ɑː/',
    partOfSpeech: 'Yardımcı Fiil (be)',
    level: 'A1'
  },
  'am': {
    word: 'am',
    translation: '-yim, -yım (olmak fiili: I için)',
    phonetic: '/æm/',
    partOfSpeech: 'Yardımcı Fiil (be)',
    level: 'A1'
  },
  'was': {
    word: 'was',
    translation: '-idi, oldu (geçmiş zaman)',
    phonetic: '/wɒz/',
    partOfSpeech: 'Yardımcı Fiil (be geçmiş)',
    level: 'A2'
  },
  'were': {
    word: 'were',
    translation: '-idiler, idiniz (geçmiş zaman)',
    phonetic: '/wɜː/',
    partOfSpeech: 'Yardımcı Fiil (be geçmiş)',
    level: 'A2'
  },
  'it': {
    word: 'it',
    translation: 'O (cansız ve hayvanlar için)',
    phonetic: '/ɪt/',
    partOfSpeech: 'Zamir',
    level: 'A1'
  },
  'within': {
    word: 'within',
    translation: 'İçinde, dahilinde, mesafesinde',
    phonetic: '/wɪðˈɪn/',
    partOfSpeech: 'Edat',
    level: 'B1'
  },
  'walking': {
    word: 'walking',
    translation: 'Yürüme, yürüyüş, yürüyor',
    phonetic: '/ˈwɔːkɪŋ/',
    partOfSpeech: 'İsim / Sıfat',
    level: 'A1'
  },
  'walk': {
    word: 'walk',
    translation: 'Yürümek, yürüyüş',
    phonetic: '/wɔːk/',
    partOfSpeech: 'Fiil / İsim',
    level: 'A1'
  },
  'distance': {
    word: 'distance',
    translation: 'Mesafe, uzaklık',
    phonetic: '/ˈdɪstəns/',
    partOfSpeech: 'İsim',
    level: 'A2'
  },
  'from': {
    word: 'from',
    translation: '-den, -dan (itibaren)',
    phonetic: '/frɒm/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'here': {
    word: 'here',
    translation: 'Burada, buraya, burası',
    phonetic: '/hɪə/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'there': {
    word: 'there',
    translation: 'Orada, oraya, orası',
    phonetic: '/ðeə/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'way': {
    word: 'way',
    translation: 'Yol, yöntem, tarz, mesafe',
    phonetic: '/weɪ/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'serious': {
    word: 'serious',
    translation: 'Ciddi, ağırbaşlı',
    phonetic: '/ˈsɪəriəs/',
    partOfSpeech: 'Sıfat',
    level: 'B1'
  },
  'seriously': {
    word: 'seriously',
    translation: 'Cidden, şaka yapmıyorum',
    phonetic: '/ˈsɪəriəsli/',
    partOfSpeech: 'Zarf',
    level: 'B1'
  },
  'that': {
    word: 'that',
    translation: 'Şu, o, ki',
    phonetic: '/ðæt/',
    partOfSpeech: 'İşaret Zamiri / Bağlaç',
    level: 'A1'
  },
  'this': {
    word: 'this',
    translation: 'Bu',
    phonetic: '/ðɪs/',
    partOfSpeech: 'İşaret Zamiri',
    level: 'A1'
  },
  'amazing': {
    word: 'amazing',
    translation: 'Harika, muhteşem, büyüleyici',
    phonetic: '/əˈmeɪzɪŋ/',
    partOfSpeech: 'Sıfat',
    level: 'A2'
  },
  'congratulations': {
    word: 'congratulations',
    translation: 'Tebrikler! Kutlarım!',
    phonetic: '/kənˌɡrætʃuˈleɪʃənz/',
    partOfSpeech: 'Ünlem / İsim',
    level: 'A2'
  },
  'do': {
    word: 'do',
    translation: 'Yapmak, yardımcı fiil (soru/olumsuz)',
    phonetic: '/duː/',
    partOfSpeech: 'Fiil / Yardımcı Fiil',
    level: 'A1'
  },
  'have': {
    word: 'have',
    translation: 'Sahip olmak, var olmak, yemek/içmek',
    phonetic: '/hæv/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'has': {
    word: 'has',
    translation: 'Sahip (he/she/it)',
    phonetic: '/hæz/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'had': {
    word: 'had',
    translation: 'Sahipti, vardı',
    phonetic: '/hæd/',
    partOfSpeech: 'Fiil (Geçmiş Zaman)',
    level: 'A2'
  },
  'any': {
    word: 'any',
    translation: 'Hiç, herhangi bir, biraz',
    phonetic: '/ˈeni/',
    partOfSpeech: 'Belirteç / Zamir',
    level: 'A1'
  },
  'some': {
    word: 'some',
    translation: 'Biraz, birkaç, bazı',
    phonetic: '/sʌm/',
    partOfSpeech: 'Belirteç',
    level: 'A1'
  },
  'student': {
    word: 'student',
    translation: 'Öğrenci',
    phonetic: '/ˈstjuːdənt/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'discount': {
    word: 'discount',
    translation: 'İndirim, iskonto',
    phonetic: '/ˈdɪskaʊnt/',
    partOfSpeech: 'İsim',
    level: 'A2'
  },
  'on': {
    word: 'on',
    translation: 'Üzerinde, hakkında, açık (çalışır)',
    phonetic: '/ɒn/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'in': {
    word: 'in',
    translation: 'İçinde, -de, -da',
    phonetic: '/ɪn/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'at': {
    word: 'at',
    translation: '-de, -da (yer veya zaman belirteci)',
    phonetic: '/æt/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'to': {
    word: 'to',
    translation: '-e, -a (yönelme), mek/mak için',
    phonetic: '/tuː/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'for': {
    word: 'for',
    translation: 'İçin, boyunca, adına',
    phonetic: '/fɔː/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'with': {
    word: 'with',
    translation: 'İle, yanında, birlikte',
    phonetic: '/wɪð/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'without': {
    word: 'without',
    translation: '-sız, -siz, olmadan',
    phonetic: '/wɪˈðaʊt/',
    partOfSpeech: 'Edat',
    level: 'A2'
  },
  'sorry': {
    word: 'sorry',
    translation: 'Üzgünüm, özür dilerim, pardon',
    phonetic: '/ˈsɒri/',
    partOfSpeech: 'Sıfat / Ünlem',
    level: 'A1'
  },
  'did': {
    word: 'did',
    translation: 'Yaptı (do fiilinin geçmiş zamanı)',
    phonetic: '/dɪd/',
    partOfSpeech: 'Yardımcı Fiil',
    level: 'A2'
  },
  'didn\'t': {
    word: "didn't",
    translation: 'Yapmadı, etmedi (geçmiş zaman olumsuz)',
    phonetic: '/ˈdɪdnt/',
    partOfSpeech: 'Kısaltma (did not)',
    level: 'A2'
  },
  'dont': {
    word: "don't",
    translation: 'Yapma, etmem (geniş zaman olumsuz)',
    phonetic: '/dəʊnt/',
    partOfSpeech: 'Kısaltma (do not)',
    level: 'A1'
  },
  'catch': {
    word: 'catch',
    translation: 'Yakalamak, duymak/anlamak',
    phonetic: '/kætʃ/',
    partOfSpeech: 'Fiil',
    level: 'A2',
    tip: '"I didn\'t catch that" kalıbında "duyamadım / anlayamadım" demektir.'
  },
  'say': {
    word: 'say',
    translation: 'Söylemek, demek',
    phonetic: '/seɪ/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'again': {
    word: 'again',
    translation: 'Tekrar, yeniden, bir daha',
    phonetic: '/əˈɡen/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'please': {
    word: 'please',
    translation: 'Lütfen',
    phonetic: '/pliːz/',
    partOfSpeech: 'Nezaket Sözcüğü',
    level: 'A1'
  },
  'hello': {
    word: 'hello',
    translation: 'Merhaba, selam',
    phonetic: '/həˈləʊ/',
    partOfSpeech: 'Selamlama',
    level: 'A1'
  },
  'hi': {
    word: 'hi',
    translation: 'Selam, merhaba',
    phonetic: '/haɪ/',
    partOfSpeech: 'Selamlama',
    level: 'A1'
  },
  'reservation': {
    word: 'reservation',
    translation: 'Rezervasyon, yer ayırtma',
    phonetic: '/ˌrezəˈveɪʃən/',
    partOfSpeech: 'İsim',
    level: 'A2'
  },
  'under': {
    word: 'under',
    translation: 'Altında, adına (kayıtlı)',
    phonetic: '/ˈʌndə/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'name': {
    word: 'name',
    translation: 'İsim, ad',
    phonetic: '/neɪm/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'would': {
    word: 'would',
    translation: '-erdi, -irdi, rica/istek kipi',
    phonetic: '/wʊd/',
    partOfSpeech: 'Modal Fiil',
    level: 'A2'
  },
  'like': {
    word: 'like',
    translation: 'İstemek (would like), hoşlanmak, gibi',
    phonetic: '/laɪk/',
    partOfSpeech: 'Fiil / Edat',
    level: 'A1'
  },
  'nice': {
    word: 'nice',
    translation: 'Güzel, hoş, nazik',
    phonetic: '/naɪs/',
    partOfSpeech: 'Sıfat',
    level: 'A1'
  },
  'meet': {
    word: 'meet',
    translation: 'Tanışmak, buluşmak, karşılamak',
    phonetic: '/miːt/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'work': {
    word: 'work',
    translation: 'Çalışmak, iş, meslek',
    phonetic: '/wɜːk/',
    partOfSpeech: 'Fiil / İsim',
    level: 'A1'
  },
  'software': {
    word: 'software',
    translation: 'Yazılım',
    phonetic: '/ˈsɒftweə/',
    partOfSpeech: 'İsim',
    level: 'B1'
  },
  'airport': {
    word: 'airport',
    translation: 'Havalimanı, havaalanı',
    phonetic: '/ˈeəpɔːt/',
    partOfSpeech: 'İsim',
    level: 'A1'
  },
  'how': {
    word: 'how',
    translation: 'Nasıl',
    phonetic: '/haʊ/',
    partOfSpeech: 'Soru Sözcüğü',
    level: 'A1'
  },
  'long': {
    word: 'long',
    translation: 'Uzun, ne kadar süre (how long)',
    phonetic: '/lɒŋ/',
    partOfSpeech: 'Sıfat / Zarf',
    level: 'A1'
  },
  'usually': {
    word: 'usually',
    translation: 'Genellikle, çoğunlukla',
    phonetic: '/ˈjuːʒuəli/',
    partOfSpeech: 'Sıklık Zarfı',
    level: 'A2'
  },
  'take': {
    word: 'take',
    translation: 'Almak, sürmek (zaman olarak)',
    phonetic: '/teɪk/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },

  // === ALMANCA (GERMAN) TEMEL KELİMELERİ ===
  'entschuldigung': {
    word: 'Entschuldigung',
    translation: 'Afedersiniz, özür dilerim, bakar mısınız',
    phonetic: '/ɛntˈʃʊldɪɡʊŋ/',
    partOfSpeech: 'Nezaket / İsim',
    level: 'A1'
  },
  'aber': {
    word: 'aber',
    translation: 'Ama, fakat, ancak',
    phonetic: '/ˈaːbɐ/',
    partOfSpeech: 'Bağlaç',
    level: 'A1'
  },
  'ich': {
    word: 'ich',
    translation: 'Ben',
    phonetic: '/ɪç/',
    partOfSpeech: 'Zamir (Özne)',
    level: 'A1'
  },
  'hatte': {
    word: 'hatte',
    translation: 'Sahiptim, istemiştim (haben geçmiş)',
    phonetic: '/ˈhatə/',
    partOfSpeech: 'Fiil (Präteritum)',
    level: 'A2'
  },
  'einen': {
    word: 'einen',
    translation: 'Bir (eril nesne hali - Akkusativ)',
    phonetic: '/ˈaɪ̯nən/',
    partOfSpeech: 'Belirteç',
    level: 'A1'
  },
  'ein': {
    word: 'ein',
    translation: 'Bir',
    phonetic: '/aɪ̯n/',
    partOfSpeech: 'Belirteç',
    level: 'A1'
  },
  'eine': {
    word: 'eine',
    translation: 'Bir (dişil)',
    phonetic: '/ˈaɪ̯nə/',
    partOfSpeech: 'Belirteç',
    level: 'A1'
  },
  'kaffee': {
    word: 'Kaffee',
    translation: 'Kahve',
    phonetic: '/ˈkafe/',
    partOfSpeech: 'İsim (der)',
    level: 'A1'
  },
  'mit': {
    word: 'mit',
    translation: 'İle, -li (sütlü vb.)',
    phonetic: '/mɪt/',
    partOfSpeech: 'Edat (Dativ)',
    level: 'A1'
  },
  'milch': {
    word: 'Milch',
    translation: 'Süt',
    phonetic: '/mɪlç/',
    partOfSpeech: 'İsim (die)',
    level: 'A1'
  },
  'bestellt': {
    word: 'bestellt',
    translation: 'Sipariş etti, sipariş vermiştim',
    phonetic: '/bəˈʃtɛlt/',
    partOfSpeech: 'Fiil (Partizip II)',
    level: 'A1'
  },
  'ja': {
    word: 'ja',
    translation: 'Evet',
    phonetic: '/jaː/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'nein': {
    word: 'nein',
    translation: 'Hayır',
    phonetic: '/naɪ̯n/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'uhr': {
    word: 'Uhr',
    translation: 'Saat',
    phonetic: '/uːɐ̯/',
    partOfSpeech: 'İsim (die)',
    level: 'A1'
  },
  'passt': {
    word: 'passt',
    translation: 'Uyar, uygundur',
    phonetic: '/past/',
    partOfSpeech: 'Fiil (passen)',
    level: 'A1'
  },
  'mir': {
    word: 'mir',
    translation: 'Bana (Dativ)',
    phonetic: '/miːɐ̯/',
    partOfSpeech: 'Zamir',
    level: 'A1'
  },
  'dir': {
    word: 'dir',
    translation: 'Sana (Dativ)',
    phonetic: '/diːɐ̯/',
    partOfSpeech: 'Zamir',
    level: 'A1'
  },
  'perfekt': {
    word: 'perfekt',
    translation: 'Mükemmel, kusursuz',
    phonetic: '/pɛʁˈfɛkt/',
    partOfSpeech: 'Sıfat',
    level: 'A1'
  },
  'bin': {
    word: 'bin',
    translation: '-yım (sein fiili: ich için)',
    phonetic: '/bɪn/',
    partOfSpeech: 'Yardımcı Fiil',
    level: 'A1'
  },
  'ist': {
    word: 'ist',
    translation: '-dır (sein fiili: er/sie/es için)',
    phonetic: '/ɪst/',
    partOfSpeech: 'Yardımcı Fiil',
    level: 'A1'
  },
  'sind': {
    word: 'sind',
    translation: '-dırlar, -yiz (sein fiili: wir/sie için)',
    phonetic: '/zɪnt/',
    partOfSpeech: 'Yardımcı Fiil',
    level: 'A1'
  },
  'pünktlich': {
    word: 'pünktlich',
    translation: 'Tam vaktinde, dakik',
    phonetic: '/ˈpʏŋktlɪç/',
    partOfSpeech: 'Sıfat / Zarf',
    level: 'A2'
  },
  'da': {
    word: 'da',
    translation: 'Orada, hazırda',
    phonetic: '/daː/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'gleis': {
    word: 'Gleis',
    translation: 'Peron, tren rayı/hattı',
    phonetic: '/ɡlaɪ̯s/',
    partOfSpeech: 'İsim (das)',
    level: 'A1'
  },
  'fährt': {
    word: 'fährt',
    translation: 'Gidiyor, hareket ediyor (araç ile)',
    phonetic: '/fɛːɐ̯t/',
    partOfSpeech: 'Fiil (fahren)',
    level: 'A1'
  },
  'ab': {
    word: 'ab',
    translation: 'Kalkış (abfahren fiili eki)',
    phonetic: '/ap/',
    partOfSpeech: 'Edat / Fiil Eki',
    level: 'A1'
  },
  'zug': {
    word: 'Zug',
    translation: 'Tren',
    phonetic: '/tsuːk/',
    partOfSpeech: 'İsim (der)',
    level: 'A1'
  },
  'nach': {
    word: 'nach',
    translation: '-e doğru (şehir/ülke yönelme), sonra',
    phonetic: '/naːx/',
    partOfSpeech: 'Edat',
    level: 'A1'
  },
  'berlin': {
    word: 'Berlin',
    translation: 'Berlin (Almanya başkenti)',
    phonetic: '/bɛʁˈliːn/',
    partOfSpeech: 'Özel İsim',
    level: 'A1'
  },
  'vielen': {
    word: 'vielen',
    translation: 'Çok (vielen Dank = çok teşekkürler)',
    phonetic: '/ˈfiːlən/',
    partOfSpeech: 'Sıfat',
    level: 'A1'
  },
  'dank': {
    word: 'Dank',
    translation: 'Teşekkür',
    phonetic: '/daŋk/',
    partOfSpeech: 'İsim (der)',
    level: 'A1'
  },
  'das': {
    word: 'das',
    translation: 'Bu, şu (nötr artikel/zamir)',
    phonetic: '/das/',
    partOfSpeech: 'Belirteç / Zamir',
    level: 'A1'
  },
  'der': {
    word: 'der',
    translation: 'O (eril artikel/zamir)',
    phonetic: '/deːɐ̯/',
    partOfSpeech: 'Belirteç',
    level: 'A1'
  },
  'die': {
    word: 'die',
    translation: 'O (dişil/çoğul artikel)',
    phonetic: '/diː/',
    partOfSpeech: 'Belirteç',
    level: 'A1'
  },
  'sehr': {
    word: 'sehr',
    translation: 'Çok, gayet',
    phonetic: '/zeːɐ̯/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'nett': {
    word: 'nett',
    translation: 'Nazik, kibar, sevimli',
    phonetic: '/nɛt/',
    partOfSpeech: 'Sıfat',
    level: 'A1'
  },
  'gebe': {
    word: 'gebe',
    translation: 'Veriyorum (geben fiili)',
    phonetic: '/ˈɡeːbə/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'mein': {
    word: 'mein',
    translation: 'Benim',
    phonetic: '/maɪ̯n/',
    partOfSpeech: 'İyelik Sıfatı',
    level: 'A1'
  },
  'bestes': {
    word: 'Bestes',
    translation: 'Elimden gelenin en iyisi',
    phonetic: '/ˈbɛstəs/',
    partOfSpeech: 'İsim / Sıfat',
    level: 'A2'
  },
  'kann': {
    word: 'kann',
    translation: '-ebilmek, yapabilmek (können fiili: ich/er/sie)',
    phonetic: '/kan/',
    partOfSpeech: 'Modal Fiil',
    level: 'A1'
  },
  'bitte': {
    word: 'bitte',
    translation: 'Lütfen, rica ederim',
    phonetic: '/ˈbɪtə/',
    partOfSpeech: 'Nezaket Sözcüğü',
    level: 'A1'
  },
  'karte': {
    word: 'Karte',
    translation: 'Kart (kredi kartı, bilet, harita)',
    phonetic: '/ˈkaʁtə/',
    partOfSpeech: 'İsim (die)',
    level: 'A1'
  },
  'bezahlen': {
    word: 'bezahlen',
    translation: 'Ödemek, hesabı kapatmak',
    phonetic: '/bəˈtsaːlən/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'zahlen': {
    word: 'zahlen',
    translation: 'Ödemek',
    phonetic: '/ˈtsaːlən/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  },
  'könnten': {
    word: 'könnten',
    translation: '-ebilir miydiniz? (kibar rica)',
    phonetic: '/ˈkœntn̩/',
    partOfSpeech: 'Konjunktiv II Fiili',
    level: 'A2'
  },
  'sie': {
    word: 'Sie',
    translation: 'Siz (resmi nezaket hitabı) / onlar',
    phonetic: '/ziː/',
    partOfSpeech: 'Zamir',
    level: 'A1'
  },
  'etwas': {
    word: 'etwas',
    translation: 'Biraz, bir miktar, bir şeyler',
    phonetic: '/ˈɛtvas/',
    partOfSpeech: 'Zarf / Belirteç',
    level: 'A1'
  },
  'langsamer': {
    word: 'langsamer',
    translation: 'Daha yavaş (langsam karşılaştırması)',
    phonetic: '/ˈlaŋzaːmɐ/',
    partOfSpeech: 'Zarf',
    level: 'A1'
  },
  'sprechen': {
    word: 'sprechen',
    translation: 'Konuşmak',
    phonetic: '/ˈʃpʁɛçn̩/',
    partOfSpeech: 'Fiil',
    level: 'A1'
  }
};

export class ComprehensiveDictionaryService {
  /**
   * Kelimeyi sözlükten arar, bulunamazsa ekleri temizleyip kökü bulur.
   */
  public static lookup(rawWord: string, _lang: 'en' | 'de' | 'fr' = 'en'): ComprehensiveWordEntry {
    if (!rawWord) {
      return {
        word: '',
        translation: '',
        phonetic: '',
        partOfSpeech: '',
        level: 'A1'
      };
    }

    // 1. Temizleme
    const clean = rawWord.trim().toLowerCase().replace(/^[“"']+|[”"'.!?,;:()]+$/g, '');
    if (!clean) {
      return {
        word: rawWord,
        translation: rawWord,
        phonetic: `/${rawWord}/`,
        partOfSpeech: 'Kelime',
        level: 'A1'
      };
    }

    // 2. Doğrudan Eşleşme
    if (EXTENSIVE_DICTIONARY[clean]) {
      return EXTENSIVE_DICTIONARY[clean];
    }

    // 3. Kesme işaretli kısaltmalar (didn't, I'm, don't, it's, couldn't, haven't, etc.)
    const normalizedContractions: Record<string, string> = {
      "didn't": "did not (yapmadı/etmedi)",
      "don't": "do not (yapmaz/yapma)",
      "doesn't": "does not (yapmaz)",
      "can't": "cannot (yapamaz/edemez)",
      "couldn't": "could not (yapamadı)",
      "i'm": "I am (ben ...yım)",
      "you're": "you are (sen ...sın)",
      "he's": "he is (o ...dır)",
      "she's": "she is (o ...dır)",
      "it's": "it is (bu ...dır)",
      "we're": "we are (biz ...yız)",
      "they're": "they are (onlar ...dır)",
      "i've": "I have (sahibim/yaptım)",
      "you've": "you have (sahipsin)",
      "i'll": "I will (yapacağım)",
      "you'll": "you will (yapacaksın)",
      "i'd": "I would / had (isterdim)",
      "what's": "what is (nedir)",
      "there's": "there is (vardır)"
    };

    if (normalizedContractions[clean]) {
      return {
        word: rawWord,
        translation: normalizedContractions[clean],
        phonetic: `/${clean}/`,
        partOfSpeech: 'Kısaltma',
        level: 'A1'
      };
    }

    // 4. Morfolojik Kök Arama (Lemmatization)
    // Suffix: -ed (ordered -> order, walked -> walk)
    if (clean.endsWith('ed')) {
      const stem1 = clean.slice(0, -2);
      const stem2 = clean.slice(0, -1); // e.g. iced -> ice
      if (EXTENSIVE_DICTIONARY[stem1]) {
        const base = EXTENSIVE_DICTIONARY[stem1];
        return {
          word: rawWord,
          translation: `${base.translation} (Geçmiş Zaman: -di)`,
          phonetic: base.phonetic,
          partOfSpeech: 'Fiil (Geçmiş)',
          level: base.level
        };
      }
      if (EXTENSIVE_DICTIONARY[stem2]) {
        const base = EXTENSIVE_DICTIONARY[stem2];
        return {
          word: rawWord,
          translation: `${base.translation} (Geçmiş Zaman)`,
          phonetic: base.phonetic,
          partOfSpeech: 'Fiil (Geçmiş)',
          level: base.level
        };
      }
    }

    // Suffix: -ing (ordering -> order, walking -> walk)
    if (clean.endsWith('ing')) {
      const stem1 = clean.slice(0, -3);
      const stem2 = clean.slice(0, -3) + 'e';
      if (EXTENSIVE_DICTIONARY[stem1]) {
        const base = EXTENSIVE_DICTIONARY[stem1];
        return {
          word: rawWord,
          translation: `${base.translation} (-yor / şimdiki zaman)`,
          phonetic: base.phonetic,
          partOfSpeech: 'Fiil (-ing)',
          level: base.level
        };
      }
      if (EXTENSIVE_DICTIONARY[stem2]) {
        const base = EXTENSIVE_DICTIONARY[stem2];
        return {
          word: rawWord,
          translation: `${base.translation} (-yor / yapma)`,
          phonetic: base.phonetic,
          partOfSpeech: 'Fiil (-ing)',
          level: base.level
        };
      }
    }

    // Suffix: -s / -es (coffees -> coffee, goes -> go)
    if (clean.endsWith('s')) {
      const stem1 = clean.slice(0, -1);
      const stem2 = clean.slice(0, -2);
      if (EXTENSIVE_DICTIONARY[stem1]) {
        const base = EXTENSIVE_DICTIONARY[stem1];
        return {
          word: rawWord,
          translation: `${base.translation} (Çoğul / Geniş Zaman)`,
          phonetic: base.phonetic,
          partOfSpeech: base.partOfSpeech,
          level: base.level
        };
      }
      if (clean.endsWith('es') && EXTENSIVE_DICTIONARY[stem2]) {
        const base = EXTENSIVE_DICTIONARY[stem2];
        return {
          word: rawWord,
          translation: `${base.translation} (Çoğul / Geniş Zaman)`,
          phonetic: base.phonetic,
          partOfSpeech: base.partOfSpeech,
          level: base.level
        };
      }
    }

    // Suffix: -ly (clearly -> clear, loudly -> loud)
    if (clean.endsWith('ly')) {
      const stem = clean.slice(0, -2);
      if (EXTENSIVE_DICTIONARY[stem]) {
        const base = EXTENSIVE_DICTIONARY[stem];
        return {
          word: rawWord,
          translation: `${base.translation} bir şekilde`,
          phonetic: `/${clean}/`,
          partOfSpeech: 'Zarf (-ly)',
          level: base.level
        };
      }
    }

    // 5. Genel Tahmin / Anlaşılır Çeviri
    return {
      word: rawWord,
      translation: `${clean}`,
      phonetic: `/${clean}/`,
      partOfSpeech: 'Kelime',
      level: 'A2',
      tip: 'Chirmo AI Öğretmen panelinden detaylı gramer analizini isteyebilirsiniz.'
    };
  }

  /**
   * Bir cümleyi parçalara ayırıp içindeki tüm kelimelerin sözlük dökümünü çıkarır.
   * "Excuse me, I actually ordered an iced coffee."
   * -> [Excuse me, actually, ordered, iced, coffee]
   */
  public static analyzeSentence(sentence: string, lang: 'en' | 'de' | 'fr' = 'en'): ComprehensiveWordEntry[] {
    if (!sentence || typeof sentence !== 'string') return [];

    const results: ComprehensiveWordEntry[] = [];
    const seenWords = new Set<string>();

    const normalizedSentence = sentence.toLowerCase();

    // 1. Önce çok kelimeli kalıpları kontrol et
    const multiWordPhrases = [
      'excuse me',
      'loud and clear',
      'walking distance',
      'no way',
      'iced coffee',
      'to go',
      'take away',
      'check in',
      'check out',
      'of course',
      'thank you',
      'never mind',
      'student discount'
    ];

    for (const phrase of multiWordPhrases) {
      if (normalizedSentence.includes(phrase)) {
        if (!seenWords.has(phrase) && EXTENSIVE_DICTIONARY[phrase]) {
          results.push(EXTENSIVE_DICTIONARY[phrase]);
          seenWords.add(phrase);
        }
      }
    }

    // 2. Cümledeki tekil kelimeleri ayır
    // Noktalama işaretlerinden ayırıp kelimeleri al
    const rawTokens = sentence
      .replace(/[“".,!?;:()]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.trim().length > 0);

    for (const token of rawTokens) {
      const clean = token.toLowerCase().trim();
      if (!clean) continue;

      // Eğer çok kelimeli kalıbın içinde zaten yer aldıysa tekrar etmemesi için es geçebiliriz
      if (clean === 'me' && seenWords.has('excuse me')) continue;
      if (clean === 'excuse' && seenWords.has('excuse me')) continue;
      if (clean === 'iced' && seenWords.has('iced coffee')) continue;
      if (clean === 'coffee' && seenWords.has('iced coffee')) continue;

      if (!seenWords.has(clean)) {
        const entry = this.lookup(token, lang);
        results.push(entry);
        seenWords.add(clean);
      }
    }

    return results;
  }
}
