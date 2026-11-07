// Chirmo Kids Almanca (Deutsch) Özel Pedagojik Veri Havuzu
// 5-17 Yaş Çocuklar ve Gençler İçin Oyunlaştırılmış Almanca Öğrenme Deneyimi

import { KidVocabItem, KidListeningQuizItem, KidSentencePuzzleItem, KidSongItem } from '../components/kids/ChirmoKidsDedicatedHub';
import { AgeGroup } from '../components/kids/ChirmoKidsDedicatedHub';

export const GERMAN_AGE_VOCABULARY: Record<AgeGroup, KidVocabItem[]> = {
  '5-7': [
    { id: 'de-v1', en: 'Katze', tr: 'Kedi', emoji: '🐱', category: 'Tiere (Hayvanlar)', soundText: 'Schau mal, die glückliche Katze! Die Katze macht Miau.', exampleTr: 'Mutlu kediye bak! Kedi miyav diyor.', funFact: 'Kediler günde 14-16 saat uyurlar ve çok sevimlidirler!' },
    { id: 'de-v2', en: 'Hund', tr: 'Köpek', emoji: '🐶', category: 'Tiere (Hayvanlar)', soundText: 'Der freundliche Hund macht Wau Wau!', exampleTr: 'Sevimli köpek hav hav diyor!', funFact: 'Köpekler insanların en sadık dostlarıdır.' },
    { id: 'de-v3', en: 'Apfel', tr: 'Kırmızı Elma', emoji: '🍎', category: 'Essen (Yiyecekler)', soundText: 'Ich esse gerne rote süße Äpfel.', exampleTr: 'Kırmızı tatlı elmaları severim.', funFact: 'Elma yemek dişlerimizi ve hafızamızı güçlendirir.' },
    { id: 'de-v4', en: 'Sonne', tr: 'Güneş', emoji: '☀️', category: 'Natur (Doğa)', soundText: 'Die warme Sonne scheint heute wunderschön.', exampleTr: 'Sıcak güneş bugün pırıl pırıl parlıyor.', funFact: 'Güneş dünyaya ısı, ışık ve yaşam neşesi verir.' },
    { id: 'de-v5', en: 'Löwe', tr: 'Aslan', emoji: '🦁', category: 'Tiere (Hayvanlar)', soundText: 'Der mutige Löwe brüllt in der Safari.', exampleTr: 'Cesur aslan safaride kükrüyor.', funFact: 'Aslanlar hayvanlar aleminin kralı olarak bilinir.' },
    { id: 'de-v6', en: 'Milch', tr: 'Süt', emoji: '🥛', category: 'Essen (Yiyecekler)', soundText: 'Kann ich bitte ein Glas frische Milch haben?', exampleTr: 'Bir bardak taze süt alabilir miyim lütfen?', funFact: 'Süt kemiklerimizin büyümesine yardımcı olur.' },
    { id: 'de-v7', en: 'Regenbogen', tr: 'Gökkuşağı', emoji: '🌈', category: 'Natur (Doğa)', soundText: 'Ich sehe sieben bunte Farben im Regenbogen.', exampleTr: 'Gökkuşağında yedi renk görebiliyorum.', funFact: 'Gökkuşağı yağmurdan hemen sonra güneş açtığında oluşur.' },
    { id: 'de-v8', en: 'Ball', tr: 'Top', emoji: '⚽', category: 'Spiele (Oyun)', soundText: 'Lass uns den bunten Ball zusammen kicken!', exampleTr: 'Renkli topu birlikte zıplatalım ve oynayalım.', funFact: 'Futbol dünyada en çok sevilen takım oyunudur.' },
    { id: 'de-v9', en: 'Teddybär', tr: 'Oyuncak Ayıcık', emoji: '🧸', category: 'Spiele (Oyun)', soundText: 'Mein kleiner Teddybär ist kuschelig weich.', exampleTr: 'Sevimli oyuncak ayım çok yumuşak.', funFact: 'Çocuklar uyurken ayıcıklarına sarılmayı çok sever.' },
    { id: 'de-v9b', en: 'Stern', tr: 'Yıldız', emoji: '⭐', category: 'Natur (Doğa)', soundText: 'Funkle funkle kleiner Stern am blauen Himmel!', exampleTr: 'Pırıl pırıl parıldayan küçük yıldız!', funFact: 'Geceleri gökyüzünde parlayan milyarlarca yıldız vardır.' },
    { id: 'de-v9c', en: 'Keks', tr: 'Kurabiye', emoji: '🍪', category: 'Essen (Yiyecekler)', soundText: 'Kann ich bitte einen leckeren Schokoladenkeks haben?', exampleTr: 'Çikolatalı lezzetli bir kurabiye alabilir miyim lütfen?', funFact: 'Sıcak kurabiyeler sütle harika gider!' },
    { id: 'de-v9d', en: 'Zug', tr: 'Tren', emoji: '🚂', category: 'Spiele (Oyun)', soundText: 'Tschu tschu! Der kleine Zug fährt auf den Schienen.', exampleTr: 'Çuf çuf! Küçük tren raylarda ilerliyor.', funFact: 'Almanya’daki hızlı trenler (ICE) saatte 300 kilometre hızla gidebilir.' },
    { id: 'de-v9e', en: 'Banane', tr: 'Muz', emoji: '🍌', category: 'Essen (Yiyecekler)', soundText: 'Affen lieben süße gelbe Bananen!', exampleTr: 'Maymunlar tatlı sarı muzları çok sever.', funFact: 'Muz spor yaparken bize bol enerji verir!' },
    { id: 'de-v9f', en: 'Wasser', tr: 'Su', emoji: '💧', category: 'Essen (Yiyecekler)', soundText: 'Kann ich bitte ein Glas kaltes Wasser haben?', exampleTr: 'Bir bardak soğuk su alabilir miyim lütfen?', funFact: 'Vücudumuzun büyük bir kısmı sudan oluşur.' },
    { id: 'de-v9g', en: 'Großer Baum', tr: 'Büyük Ağaç', emoji: '🌳', category: 'Natur (Doğa)', soundText: 'Vögel bauen gemütliche Nester im großen grünen Baum.', exampleTr: 'Kuşlar büyük yeşil ağaçta yuvalar yapar.', funFact: 'Ağaçlar havayı temizleyip bize oksijen üretir.' },
    { id: 'de-v9h', en: 'Rote Blume', tr: 'Kırmızı Çiçek', emoji: '🌸', category: 'Natur (Doğa)', soundText: 'Riech an der schönen roten Blume im Garten!', exampleTr: 'Bahçedeki güzel kokulu kırmızı çiçeği kokla.', funFact: 'Arılar çiçeklerden nektar toplayarak tatlı bal yapar.' },
    { id: 'de-v9i', en: 'Schnelles Auto', tr: 'Hızlı Araba', emoji: '🚗', category: 'Spiele (Oyun)', soundText: 'Tut tut! Das glänzende schnelle Auto fährt vorbei.', exampleTr: 'Düt düt! Parlak hızlı araba yanımdan geçti.', funFact: 'Almanya dünyaca ünlü arabalarıyla tanınır.' },
    { id: 'de-v9j', en: 'Flugzeug', tr: 'Uçak', emoji: '✈️', category: 'Spiele (Oyun)', soundText: 'Das weiße Flugzeug fliegt hoch über den Wolken.', exampleTr: 'Uçak beyaz bulutların çok üzerinde uçar.', funFact: 'Uçaklar dünyayı sadece saatler içinde dolaşmamızı sağlar.' },
    { id: 'de-v9k', en: 'Gelbe Ente', tr: 'Sarı Ördek', emoji: '🦆', category: 'Tiere (Hayvanlar)', soundText: 'Quak quak! Die kleine gelbe Ente schwimmt fröhlich.', exampleTr: 'Vak vak! Sarı ördek neşeyle yüzüyor.', funFact: 'Ördeklerin tüyleri suya girseler bile ıslanmaz!' },
    { id: 'de-v9l', en: 'Hase', tr: 'Tavşan', emoji: '🐰', category: 'Tiere (Hayvanlar)', soundText: 'Der weiße flauschige Hase hüpft über die Wiese.', exampleTr: 'Tüylü beyaz tavşan çimenlerde zıplıyor.', funFact: 'Tavşanların kulakları sesleri çok uzaklardan bile duyar.' },
    { id: 'de-v9m', en: 'Lächeln', tr: 'Mutlu Gülümseme', emoji: '😊', category: 'Gefühle (Duygular)', soundText: 'Schenke der Welt jeden Tag ein strahlendes Lächeln!', exampleTr: 'Her gün neşeli ve aydınlık bir tebessüm takın!', funFact: 'Gülümsemek beynimize mutluluk ve neşe sinyalleri gönderir.' },
    { id: 'de-v9n', en: 'Hände klatschen', tr: 'Alkışlayan Eller', emoji: '👏', category: 'Körper (Vücudumuz)', soundText: 'Klatsche in die Hände, wenn du fröhlich bist!', exampleTr: 'Kendini neşeli hissediyorsan ellerini çırp!', funFact: 'Alkışlamak kalbimizin ritmini ve neşemizi canlandırır.' },
    { id: 'de-v9o', en: 'Gemütliches Bett', tr: 'Rahat Yatak', emoji: '🛏️', category: 'Zuhause (Evimiz)', soundText: 'Zeit zum Ausruhen in meinem warmen Bett. Gute Nacht!', exampleTr: 'Sıcak ve rahat yatağımda dinlenme zamanı. İyi geceler!', funFact: 'İyi bir gece uykusu boyumuzun uzamasını sağlar.' },
    { id: 'de-v9p', en: 'Bilderbuch', tr: 'Hikaye Kitabı', emoji: '📖', category: 'Schule (Okul)', soundText: 'Lass uns das bunte Zauber-Bilderbuch öffnen!', exampleTr: 'Büyülü renkli hikaye kitabını açalım.', funFact: 'Kitap okumak hayal dünyamızı ve zekamızı sınırsız büyütür.' }
  ],

  '8-10': [
    { id: 'de-v10', en: 'Rucksack', tr: 'Okul Çantası', emoji: '🎒', category: 'Schule (Okul)', soundText: 'Mein bunter Rucksack ist voll mit Schulbüchern.', exampleTr: 'Ağır okul çantam renkli kitaplarla dolu.', funFact: 'Okul eşyalarımızı düzenli tutmak derslerimizde bize büyük kolaylık sağlar.' },
    { id: 'de-v11', en: 'Fahrrad', tr: 'Bisiklet', emoji: '🚲', category: 'Sport', soundText: 'Ich fahre gerne mit meinem blauen Fahrrad im Park.', exampleTr: 'Parkta mavi bisikletimi sürebiliyorum.', funFact: 'Bisiklet sürmek hem bacak kaslarını hem dengeyi geliştirir.' },
    { id: 'de-v12', en: 'Weltraumrakete', tr: 'Uzay Roketi', emoji: '🚀', category: 'Wissenschaft (Bilim)', soundText: 'Drei, zwei, eins! Die Rakete startet ins Weltall!', exampleTr: 'Üç, iki, bir! Uzay roketi fırlatıldı!', funFact: 'Roketler saniyede 11 kilometre hızla uzaya çıkar.' },
    { id: 'de-v13', en: 'Bleistift', tr: 'Kurşun Kalem', emoji: '✏️', category: 'Schule (Okul)', soundText: 'Kann ich mir bitte deinen spitzen Bleistift leihen?', exampleTr: 'Açılmış kurşun kalemini ödünç alabilir miyim lütfen?', funFact: 'Bir kurşun kalemle yaklaşık 50.000 kelime yazılabilir.' },
    { id: 'de-v14', en: 'Gitarre', tr: 'Gitar', emoji: '🎸', category: 'Musik', soundText: 'Sie spielt eine fröhliche Melodie auf der Gitarre.', exampleTr: 'Gitarla neşeli bir melodi çalabiliyor.', funFact: 'Müzik dinlemek yabancı dil kulak aşinalığını 3 kat hızlandırır.' },
    { id: 'de-v15', en: 'Eis', tr: 'Dondurma', emoji: '🍦', category: 'Essen (Yiyecekler)', soundText: 'Ich möchte bitte ein großes Erdbeereis haben.', exampleTr: 'Büyük bir çilekli dondurma istiyorum lütfen.', funFact: 'Dondurma mutluluk hormonu salgılanmasına katkı sağlar.' },
    { id: 'de-v16', en: 'Dinosaurier', tr: 'Dinozor', emoji: '🦖', category: 'Natur (Doğa)', soundText: 'Der riesige Dinosaurier lebte vor langer Zeit.', exampleTr: 'Dev dinozor çok uzun zaman önce dünyada yürüdü.', funFact: 'T-Rex dinozorunun bir dişi 30 santimetreye kadar uzardı!' },
    { id: 'de-v16b', en: 'Skateboard', tr: 'Kaykay', emoji: '🛹', category: 'Sport', soundText: 'Ich mache coole Tricks mit dem Skateboard im Skatepark.', exampleTr: 'Parkta kaykayımla havalı hareketler yapmayı severim.', funFact: 'Kaykay olimpiyatlarda bir spor dalı haline gelmiştir.' },
    { id: 'de-v16c', en: 'Teleskop', tr: 'Teleskop', emoji: '🔭', category: 'Wissenschaft (Bilim)', soundText: 'Schau durch das Teleskop, um die Mondkrater zu sehen!', exampleTr: 'Aydaki kraterleri görmek için teleskoptan bak!', funFact: 'Galileo 400 yıl önce ilk kez teleskopla gezegenleri incelemiştir.' },
    { id: 'de-v16d', en: 'Fußball & Tor', tr: 'Futbol & Gol', emoji: '⚽', category: 'Sport', soundText: 'Pass den Ball und schieß! Was für ein fantastisches Tor!', exampleTr: 'Topu pas ver ve şut çek! Ne muhteşem bir gol!', funFact: 'Takım sporları paylaşmayı ve liderliği öğretir.' },
    { id: 'de-v16e', en: 'Schwimmbad', tr: 'Yüzme Havuzu', emoji: '🏊', category: 'Sport', soundText: 'Ich liebe es, im kühlen blauen Schwimmbad zu tauchen.', exampleTr: 'Güneşli hafta sonlarında serin mavi havuzda yüzmeyi severim.', funFact: 'Yüzme tüm vücut kaslarını aynı anda çalıştıran en iyi spordur.' },
    { id: 'de-v16f', en: 'Hilfsbereiter Arzt', tr: 'Şefkatli Doktor', emoji: '🩺', category: 'Berufe (Meslekler)', soundText: 'Der freundliche Arzt hilft allen Kindern, gesund zu bleiben.', exampleTr: 'Şefkatli doktor herkesin güçlü ve sağlıklı kalmasına yardım eder.', funFact: 'Steteskop kalbin atış sesini 10 kat netleştirerek duyar.' },
    { id: 'de-v16g', en: 'Smarter Roboter', tr: 'Akıllı Robot', emoji: '🤖', category: 'Wissenschaft (Bilim)', soundText: 'Chirmo ist ein intelligenter Roboter, der dir Deutsch beibringt!', exampleTr: 'Chirmo sana Almanca öğreten akıllı bir robottur!', funFact: 'Robotlar insanların karmaşık görevleri hızla yapmasına yardımcı olur.' },
    { id: 'de-v16h', en: 'Wanduhr', tr: 'Duvar Saati', emoji: '⏰', category: 'Zeit (Zaman)', soundText: 'Tick tack! Die Uhr zeigt, dass es Zeit für die Schule ist.', exampleTr: 'Tik tak! Saat okula gitme zamanı olduğunu söylüyor.', funFact: 'Günde 24 saat ve her saatte 60 dakika vardır.' },
    { id: 'de-v16i', en: 'Sonne & Regen', tr: 'Güneş ve Yağmur', emoji: '⛅', category: 'Natur (Doğa)', soundText: 'Das Wetter ist sonnig mit einem sanften Sommerregen.', exampleTr: 'Hava parçalı güneşli ve ferahlatıcı hafif bir yağmur var.', funFact: 'Havadaki su damlacıkları güneşle birleşince gökkuşağı yaratır.' },
    { id: 'de-v16j', en: 'Leckeres Sandwich', tr: 'Lezzetli Sandviç', emoji: '🥪', category: 'Essen (Yiyecekler)', soundText: 'Ich habe ein leckeres Käsesandwich für die Schulpause gepackt.', exampleTr: 'Öğle yemeği için lezzetli peynirli ve domatesli sandviç hazırladım.', funFact: 'Sandviç sağlıklı tahıllarla hazırlandığında harika bir ara öğündür.' },
    { id: 'de-v16k', en: 'Pinsel', tr: 'Boya Fırçası', emoji: '🎨', category: 'Kunst (Sanat)', soundText: 'Tauche den Pinsel in blaue Farbe und male den weiten Himmel!', exampleTr: 'Boya fırçasını maviye batır ve uçsuz bucaksız gökyüzünü boya.', funFact: 'Resim yapmak çocukların yaratıcı zekasını ve odaklanmasını geliştirir.' }
  ],

  '11-13': [
    { id: 'de-v17', en: 'Wissenschaftslabor', tr: 'Fen Laboratuvarı', emoji: '🔬', category: 'Schule (Okul)', soundText: 'Entschuldigung, wo befindet sich das moderne Schullabor?', exampleTr: 'Affedersiniz, fen laboratuvarı nerede acaba?', funFact: 'Okulda deneyler yapmak teorik bilgiyi kalıcı hale getirir.' },
    { id: 'de-v18', en: 'Abenteuer', tr: 'Macera', emoji: '🗺️', category: 'Soziales (Sosyal)', soundText: 'Wir sind bereit für ein spannendes Wanderabenteuer in den Bergen.', exampleTr: 'Heyecanlı bir dağ macerasına hazırız.', funFact: 'Macera dolu hikayeler okumak kelime hazinesini genişletir.' },
    { id: 'de-v19', en: 'Bester Freund', tr: 'En İyi Arkadaş', emoji: '🤝', category: 'Soziales (Sosyal)', soundText: 'Auf einen echten besten Freund kann man sich immer verlassen.', exampleTr: 'Gerçek en iyi arkadaşına her zaman güvenebilirsin.', funFact: 'Arkadaşlık diyaloğu dil öğreniminin temel taşlarındandır.' },
    { id: 'de-v20', en: 'Bibliothek', tr: 'Kütüphane', emoji: '📚', category: 'Schule (Okul)', soundText: 'Bitte sei leise, wenn du in der Schulbibliothek lernst.', exampleTr: 'Lütfen kütüphanede ders çalışırken sessiz olun.', funFact: 'Kütüphaneler dünyadaki tüm bilgi hazinelerini barındırır.' },
    { id: 'de-v21', en: 'Eintrittskarte', tr: 'Bilet', emoji: '🎟️', category: 'Alltag (Günlük)', soundText: 'Wie viel kostet eine Schülerkarte für das Naturkundemuseum?', exampleTr: 'Müze için bir öğrenci bileti ne kadar?', funFact: 'Yurt dışı seyahatlerinde bilet sormak en temel gereksinimdir.' },
    { id: 'de-v21b', en: 'Planet Saturn', tr: 'Gezegen Satürn', emoji: '🪐', category: 'Wissenschaft (Bilim)', soundText: 'Saturn ist berühmt für seine wunderschönen leuchtenden Ringe.', exampleTr: 'Satürn güzel parlak halkalarıyla ünlüdür.', funFact: 'Güneş sistemimizde sekiz büyük gezegen bulunmaktadır.' },
    { id: 'de-v21c', en: 'Champion', tr: 'Şampiyon', emoji: '🥇', category: 'Soziales (Sosyal)', soundText: 'Mit täglicher Übung und Begeisterung wirst du ein echter Champion!', exampleTr: 'Sıkı çalışma ve günlük pratikle bir şampiyon olursun!', funFact: 'Her gün 15 dakika Almanca çalışan öğrenciler hızla dereceye girer.' },
    { id: 'de-v21d', en: 'Mobile Technologie', tr: 'Mobil Teknoloji', emoji: '📱', category: 'Technologie', soundText: 'Wir nutzen mobile Apps, um neue Fremdsprachen interaktiv zu lernen.', exampleTr: 'Küresel öğrenme arkadaşlarıyla bağlantı kurmak için mobil teknolojiyi kullanırız.', funFact: 'Bugünkü akıllı telefonlar Ay’a giden ilk roketten binlerce kat daha güçlüdür.' },
    { id: 'de-v21e', en: 'Milchstraße', tr: 'Samanyolu Galaksisi', emoji: '🌌', category: 'Wissenschaft (Bilim)', soundText: 'Unsere Heimat befindet sich in der riesigen Milchstraße.', exampleTr: 'Evimiz muhteşem Samanyolu galaksisinin içinde yer almaktadır.', funFact: 'Samanyolu galaksisinde 100 milyardan fazla yıldız bulunur.' },
    { id: 'de-v21f', en: 'Kompass', tr: 'Yön Pusulası', emoji: '🧭', category: 'Entdeckung', soundText: 'Die Nadel des Kompasses zeigt immer zuverlässig nach Norden.', exampleTr: 'Pusulanın manyetik iğnesi her zaman kuzeyi gösterir.', funFact: 'Pusula denizcilerin açık denizlerde kaybolmasını önleyen en eski icattır.' },
    { id: 'de-v21g', en: 'Erneuerbare Energie', tr: 'Yenilenebilir Temiz Enerji', emoji: '⚡', category: 'Natur (Doğa)', soundText: 'Solarzellen und Windräder erzeugen saubere umweltfreundliche Energie.', exampleTr: 'Güneş panelleri ve rüzgar türbinleri temiz yenilenebilir enerji üretir.', funFact: 'Almanya yenilenebilir enerji teknolojilerinde öncü ülkelerdendir.' }
  ],

  '14-17': [
    { id: 'de-v22', en: 'Algorithmus', tr: 'Algoritma & Kodlama', emoji: '💻', category: 'Technologie', soundText: 'Ich programmiere gerne clevere Algorithmen und löse knifflige Rätsel.', exampleTr: 'Temiz kod yazmaktan ve mantık bulmacaları çözmekten keyif alırım.', funFact: 'Yazılım ve mühendislikte Almanca en değerli teknik dillerdendir.' },
    { id: 'de-v23', en: 'Perspektive', tr: 'Bakış Açısı', emoji: '💡', category: 'Denken (Düşünce)', soundText: 'Meiner Meinung nach brauchen wir eine innovative neue Perspektive.', exampleTr: 'Bana göre, yaratıcı yeni bir bakış açısına ihtiyacımız var.', funFact: 'Almancada fikir belirtirken "Meiner Meinung nach" kalıbı kullanılır.' },
    { id: 'de-v24', en: 'Playlist', tr: 'Müzik Listesi', emoji: '🎧', category: 'Musik', soundText: 'Dieser dynamische Track ist der perfekte Soundtrack für meinen Sommer.', exampleTr: 'Bu parça benim yaz tatilimin müzik temasıdır.', funFact: 'Müzikle dil öğrenmek kelime ezberini %40 kolaylaştırır.' },
    { id: 'de-v25', en: 'Teamarbeit', tr: 'Takım Çalışması', emoji: '🏆', category: 'Zukunft (Gelecek)', soundText: 'Effiziente Teamarbeit führt zu internationalem Erfolg.', exampleTr: 'Etkili takım çalışması uluslararası başarıya götürür.', funFact: 'Alman çalışma kültürünün kalbinde disiplinli takım çalışması vardır.' },
    { id: 'de-v25b', en: 'Innovation', tr: 'İnovasyon & Yenilik', emoji: '🚀', category: 'Technologie', soundText: 'Echte Innovation löst reale Probleme für Menschen weltweit.', exampleTr: 'Gerçek inovasyon insanoğlunun gerçek sorunlarını çözer.', funFact: 'Yapay zeka çağında en çok aranan beceri yaratıcı problem çözmedir.' },
    { id: 'de-v25c', en: 'Künstliche Intelligenz', tr: 'Yapay Zekâ', emoji: '🧠', category: 'Technologie', soundText: 'Künstliche Intelligenz verändert, wie wir Sprachen lernen und kommunizieren.', exampleTr: 'Yapay zekâ dilleri nasıl öğrendiğimizi ve iletişim kurduğumuzu dönüştürüyor.', funFact: 'Almanya yapay zeka ve endüstri 4.0 araştırmalarında liderdir.' },
    { id: 'de-v25d', en: 'Inspirierende Führung', tr: 'İlham Veren Liderlik', emoji: '🌟', category: 'Zukunft (Gelecek)', soundText: 'Empathische Führungskräfte hören aktiv zu und inspirieren Veränderung.', exampleTr: 'Empatik liderler aktif şekilde dinler ve olumlu değişime ilham verir.', funFact: 'Küresel liderlerin en belirgin özelliği açık fikirli iletişim becerisidir.' },
    { id: 'de-v25e', en: 'Nachhaltigkeit', tr: 'Ekolojik Sürdürülebilirlik', emoji: '🌿', category: 'Natur (Doğa)', soundText: 'Nachhaltige Praktiken schützen unseren Planeten für zukünftige Generationen.', exampleTr: 'Sürdürülebilir uygulamalar gelecek nesiller için doğal yaşam alanlarını korur.', funFact: 'Geri dönüşüm yapmak okyanuslardaki plastik atıkları dramatik biçimde azaltır.' }
  ]
};

// ==================== ALMANCA OYUN 1: DUY VE RESMİ BUL (DEDEKTİF OYUNU) ====================
export const GERMAN_LISTENING_QUIZZES: Record<AgeGroup, KidListeningQuizItem[]> = {
  '5-7': [
    {
      id: 'de-q1',
      questionAudio: 'Katze',
      promptTr: 'Sesi dinle! Chirmo hangi sevimli dostumuzu söyledi?',
      options: [
        { id: 'de-o1', label: 'Katze', emoji: '🐱', isCorrect: true },
        { id: 'de-o2', label: 'Hund', emoji: '🐶', isCorrect: false },
        { id: 'de-o3', label: 'Löwe', emoji: '🦁', isCorrect: false },
        { id: 'de-o4', label: 'Sonne', emoji: '☀️', isCorrect: false }
      ],
      praise: 'Wunderbar! Die Katze macht Miau!'
    },
    {
      id: 'de-q2',
      questionAudio: 'Apfel',
      promptTr: 'Sesi dinle! Chirmo hangi lezzetli meyveyi söyledi?',
      options: [
        { id: 'de-o1', label: 'Milch', emoji: '🥛', isCorrect: false },
        { id: 'de-o2', label: 'Apfel', emoji: '🍎', isCorrect: true },
        { id: 'de-o3', label: 'Sonne', emoji: '☀️', isCorrect: false },
        { id: 'de-o4', label: 'Ball', emoji: '⚽', isCorrect: false }
      ],
      praise: 'Fantastisch! Der rote Apfel schmeckt süß!'
    },
    {
      id: 'de-q3',
      questionAudio: 'Regenbogen',
      promptTr: 'Sesi dinle! Gökyüzündeki renkli güzellik hangisi?',
      options: [
        { id: 'de-o1', label: 'Ball', emoji: '⚽', isCorrect: false },
        { id: 'de-o2', label: 'Hund', emoji: '🐶', isCorrect: false },
        { id: 'de-o3', label: 'Regenbogen', emoji: '🌈', isCorrect: true },
        { id: 'de-o4', label: 'Katze', emoji: '🐱', isCorrect: false }
      ],
      praise: 'Ausgezeichnetes Gehör! Der bunte Regenbogen!'
    },
    {
      id: 'de-q3b',
      questionAudio: 'Gelbe Ente',
      promptTr: 'Sesi dinle! Gölette yüzen sevimli sarı dostumuz hangisi?',
      options: [
        { id: 'de-o1', label: 'Gelbe Ente', emoji: '🦆', isCorrect: true },
        { id: 'de-o2', label: 'Hase', emoji: '🐰', isCorrect: false },
        { id: 'de-o3', label: 'Teddybär', emoji: '🧸', isCorrect: false },
        { id: 'de-o4', label: 'Zug', emoji: '🚂', isCorrect: false }
      ],
      praise: 'Glückwunsch! Die gelbe Ente schwimmt fröhlich!'
    }
  ],
  '8-10': [
    {
      id: 'de-q4',
      questionAudio: 'Weltraumrakete',
      promptTr: 'Dinle bakalım! Uzaya fırlatılan dev araç hangisi?',
      options: [
        { id: 'de-o1', label: 'Fahrrad', emoji: '🚲', isCorrect: false },
        { id: 'de-o2', label: 'Rucksack', emoji: '🎒', isCorrect: false },
        { id: 'de-o3', label: 'Weltraumrakete', emoji: '🚀', isCorrect: true },
        { id: 'de-o4', label: 'Gitarre', emoji: '🎸', isCorrect: false }
      ],
      praise: 'Super schnell wie eine Rakete! Weltraumrakete ist richtig!'
    },
    {
      id: 'de-q5',
      questionAudio: 'Fahrrad',
      promptTr: 'Dinle! Parkta bindiğimiz iki tekerlekli eğlence aracı hangisi?',
      options: [
        { id: 'de-o1', label: 'Fahrrad', emoji: '🚲', isCorrect: true },
        { id: 'de-o2', label: 'Eis', emoji: '🍦', isCorrect: false },
        { id: 'de-o3', label: 'Bleistift', emoji: '✏️', isCorrect: false },
        { id: 'de-o4', label: 'Rakete', emoji: '🚀', isCorrect: false }
      ],
      praise: 'Sehr gut! Fahrrad fahren macht riesigen Spaß!'
    },
    {
      id: 'de-q5b',
      questionAudio: 'Smarter Roboter',
      promptTr: 'Dinle! Bize Almanca öğreten akıllı yapay zeka dostumuz hangisi?',
      options: [
        { id: 'de-o1', label: 'Smarter Roboter', emoji: '🤖', isCorrect: true },
        { id: 'de-o2', label: 'Dinosaurier', emoji: '🦖', isCorrect: false },
        { id: 'de-o3', label: 'Pinsel', emoji: '🎨', isCorrect: false },
        { id: 'de-o4', label: 'Skateboard', emoji: '🛹', isCorrect: false }
      ],
      praise: 'Genau richtig! Der smarte Roboter Chirmo hilft dir!'
    },
    {
      id: 'de-q5c',
      questionAudio: 'Fußball & Tor',
      promptTr: 'Dinle! Sahada pas verip attığımız büyük sevinç nedir?',
      options: [
        { id: 'de-o1', label: 'Wanduhr', emoji: '⏰', isCorrect: false },
        { id: 'de-o2', label: 'Fußball & Tor', emoji: '⚽', isCorrect: true },
        { id: 'de-o3', label: 'Leckeres Sandwich', emoji: '🥪', isCorrect: false },
        { id: 'de-o4', label: 'Teleskop', emoji: '🔭', isCorrect: false }
      ],
      praise: 'Toooor! Fußball und Tor perfekt erkannt!'
    }
  ],
  '11-13': [
    {
      id: 'de-q6',
      questionAudio: 'Wissenschaftslabor',
      promptTr: 'Dinle! Deneylerin yapıldığı okul alanı hangisidir?',
      options: [
        { id: 'de-o1', label: 'Bibliothek', emoji: '📚', isCorrect: false },
        { id: 'de-o2', label: 'Wissenschaftslabor', emoji: '🔬', isCorrect: true },
        { id: 'de-o3', label: 'Abenteuer', emoji: '🗺️', isCorrect: false },
        { id: 'de-o4', label: 'Eintrittskarte', emoji: '🎟️', isCorrect: false }
      ],
      praise: 'Bravo! Wissenschaftslabor ist der Forschungsort!'
    },
    {
      id: 'de-q6b',
      questionAudio: 'Milchstraße',
      promptTr: 'Dinle! Milyarlarca yıldız ve gezegen barındıran gök adamız hangisidir?',
      options: [
        { id: 'de-o1', label: 'Kompass', emoji: '🧭', isCorrect: false },
        { id: 'de-o2', label: 'Erneuerbare Energie', emoji: '⚡', isCorrect: false },
        { id: 'de-o3', label: 'Milchstraße', emoji: '🌌', isCorrect: true },
        { id: 'de-o4', label: 'Champion', emoji: '🥇', isCorrect: false }
      ],
      praise: 'Tolle astronomische Kenntnisse! Die Milchstraße!'
    },
    {
      id: 'de-q6c',
      questionAudio: 'Mobile Technologie',
      promptTr: 'Dinle! Dünya ile anında iletişim kurmamızı sağlayan cihazlar bütünü nedir?',
      options: [
        { id: 'de-o1', label: 'Mobile Technologie', emoji: '📱', isCorrect: true },
        { id: 'de-o2', label: 'Planet Saturn', emoji: '🪐', isCorrect: false },
        { id: 'de-o3', label: 'Bergpfad', emoji: '⛰️', isCorrect: false },
        { id: 'de-o4', label: 'Bester Freund', emoji: '🤝', isCorrect: false }
      ],
      praise: 'Perfekt! Mobile Technologie verbindet uns weltweit!'
    }
  ],
  '14-17': [
    {
      id: 'de-q7',
      questionAudio: 'Algorithmus',
      promptTr: 'Dinle! Yazılım ve mantıksal problem çözme adımlarına ne ad verilir?',
      options: [
        { id: 'de-o1', label: 'Algorithmus', emoji: '💻', isCorrect: true },
        { id: 'de-o2', label: 'Playlist', emoji: '🎧', isCorrect: false },
        { id: 'de-o3', label: 'Perspektive', emoji: '💡', isCorrect: false },
        { id: 'de-o4', label: 'Teamarbeit', emoji: '🏆', isCorrect: false }
      ],
      praise: 'Messerscharfer Verstand! Algorithmus ist die Basis!'
    },
    {
      id: 'de-q7b',
      questionAudio: 'Künstliche Intelligenz',
      promptTr: 'Dinle! Dünyayı dönüştüren yapay zekâ teknolojisi hangisidir?',
      options: [
        { id: 'de-o1', label: 'Nachhaltigkeit', emoji: '🌿', isCorrect: false },
        { id: 'de-o2', label: 'Künstliche Intelligenz', emoji: '🧠', isCorrect: true },
        { id: 'de-o3', label: 'Inspirierende Führung', emoji: '🌟', isCorrect: false },
        { id: 'de-o4', label: 'Digitale Musik', emoji: '🎧', isCorrect: false }
      ],
      praise: 'Enorm wichtig! Künstliche Intelligenz gestaltet unsere Zukunft!'
    },
    {
      id: 'de-q7c',
      questionAudio: 'Inspirierende Führung',
      promptTr: 'Dinle! Ekip üyelerini dinleyip değişime öncülük etme vasfı nedir?',
      options: [
        { id: 'de-o1', label: 'Programmcode', emoji: '💻', isCorrect: false },
        { id: 'de-o2', label: 'Inspirierende Führung', emoji: '🌟', isCorrect: true },
        { id: 'de-o3', label: 'Windkraftwerk', emoji: '⚡', isCorrect: false },
        { id: 'de-o4', label: 'U-Bahn', emoji: '🚇', isCorrect: false }
      ],
      praise: 'Hervorragend! Inspirierende Führung bewegt Menschen!'
    }
  ]
};

// ==================== ALMANCA OYUN 2: CÜMLE YAPBOZU (SENTENCE PUZZLE) ====================
export const GERMAN_PUZZLE_CHALLENGES: Record<AgeGroup, KidSentencePuzzleItem[]> = {
  '5-7': [
    { id: 'de-p1', targetEn: 'Ich möchte bitte Wasser', targetTr: 'Su istiyorum lütfen', words: ['Wasser', 'Ich', 'bitte', 'möchte'], emoji: '💧', hint: 'Önce "Ich" (Ben), sonra "möchte" (istiyorum)...' },
    { id: 'de-p2', targetEn: 'Ich mag rote Äpfel', targetTr: 'Kırmızı elmaları severim', words: ['Äpfel', 'mag', 'rote', 'Ich'], emoji: '🍎', hint: 'Önce kim sever? "Ich mag"...' },
    { id: 'de-p3', targetEn: 'Die Katze ist glücklich', targetTr: 'Kedi çok mutlu', words: ['glücklich', 'Die', 'ist', 'Katze'], emoji: '🐱', hint: 'Kediyle başla: "Die Katze ist glücklich"' },
    { id: 'de-p3b', targetEn: 'Schau den großen Baum', targetTr: 'Büyük ağaca bak', words: ['Baum', 'Schau', 'großen', 'den'], emoji: '🌳', hint: 'Bakmak için "Schau den..." ile başla' }
  ],
  '8-10': [
    { id: 'de-p4', targetEn: 'Kann ich bitte Milch haben', targetTr: 'Süt alabilir miyim lütfen', words: ['haben', 'Milch', 'Kann', 'bitte', 'ich'], emoji: '🥛', hint: 'İzin isterken "Kann ich bitte..." kalıbını kullanırız.' },
    { id: 'de-p5', targetEn: 'Ich kann mein Fahrrad fahren', targetTr: 'Bisikletimi sürebiliyorum', words: ['fahren', 'Fahrrad', 'kann', 'mein', 'Ich'], emoji: '🚲', hint: 'Yetenek bildirirken: "Ich kann mein Fahrrad..."' },
    { id: 'de-p6', targetEn: 'Wo ist mein Rucksack', targetTr: 'Okul çantam nerede', words: ['mein', 'ist', 'Wo', 'Rucksack'], emoji: '🎒', hint: 'Nerede sorusu "Wo ist..." ile başlar.' },
    { id: 'de-p6b', targetEn: 'Lasst uns zusammen Fußball spielen', targetTr: 'Birlikte futbol oynayalım', words: ['spielen', 'Fußball', 'zusammen', 'Lasst', 'uns'], emoji: '⚽', hint: 'Teklif için "Lasst uns..." ile başla.' }
  ],
  '11-13': [
    { id: 'de-p7', targetEn: 'Entschuldigung wo ist das Museum', targetTr: 'Affedersiniz müze nerede', words: ['wo', 'Entschuldigung', 'Museum', 'das', 'ist'], emoji: '🏛️', hint: 'Kibarca başla: "Entschuldigung, wo ist..."' },
    { id: 'de-p8', targetEn: 'Wie viel kostet die Schülerkarte', targetTr: 'Öğrenci bileti ne kadar', words: ['kostet', 'die', 'Schülerkarte', 'Wie', 'viel'], emoji: '🎟️', hint: 'Fiyat sorarken "Wie viel kostet..."' },
    { id: 'de-p8b', targetEn: 'Wir sind bereit für ein Abenteuer', targetTr: 'Biz bir macera için hazırız', words: ['bereit', 'Abenteuer', 'Wir', 'für', 'sind', 'ein'], emoji: '🗺️', hint: 'Biz hazırız: "Wir sind bereit für..."' },
    { id: 'de-p8c', targetEn: 'Bitte seid leise in der Bibliothek', targetTr: 'Lütfen kütüphanede sessiz olun', words: ['leise', 'in', 'Bitte', 'Bibliothek', 'der', 'seid'], emoji: '📚', hint: 'Nezaket ricası: "Bitte seid leise..."' }
  ],
  '14-17': [
    { id: 'de-p9', targetEn: 'Meiner Meinung nach ist Teamarbeit wichtig', targetTr: 'Bana göre takım çalışması önemlidir', words: ['Teamarbeit', 'Meinung', 'wichtig', 'Meiner', 'ist', 'nach'], emoji: '🤝', hint: 'Fikir belirtirken "Meiner Meinung nach..."' },
    { id: 'de-p9b', targetEn: 'Künstliche Intelligenz verändert das Sprachenlernen', targetTr: 'Yapay zekâ dil öğrenimini dönüştürüyor', words: ['verändert', 'Intelligenz', 'Künstliche', 'Sprachenlernen', 'das'], emoji: '🧠', hint: 'Özneyle başla: "Künstliche Intelligenz..."' },
    { id: 'de-p9c', targetEn: 'Empathische Führungskräfte hören anderen aktiv zu', targetTr: 'Empatik liderler diğerlerini aktif dinler', words: ['zu', 'Führungskräfte', 'Empathische', 'anderen', 'aktiv', 'hören'], emoji: '🌟', hint: 'Özneyle başla: "Empathische Führungskräfte..."' },
    { id: 'de-p9d', targetEn: 'Kreative Innovation löst reale Probleme', targetTr: 'Yaratıcı yenilik gerçek sorunları çözer', words: ['löst', 'Kreative', 'Probleme', 'Innovation', 'reale'], emoji: '💡', hint: 'Özne: "Kreative Innovation..."' }
  ]
};

// ==================== ALMANCA OYUN 3: SÜPER TELAFFUZ ARENASI (VOICE COACH) ====================
export const GERMAN_VOICE_CHALLENGES: Record<AgeGroup, { en: string; tr: string; tip: string; emoji: string }[]> = {
  '5-7': [
    { en: 'Ich möchte bitte Milch!', tr: 'Süt istiyorum lütfen!', tip: '"bitte" derken sonundaki e sesini yumuşakça duyur.', emoji: '🥛' },
    { en: 'Schau den glücklichen Hund an!', tr: 'Mutlu köpeğe bak!', tip: '"Schau" derken şav şeklinde doğal söyle.', emoji: '🐶' },
    { en: 'Kann ich einen Apfel haben?', tr: 'Bir elma alabilir miyim?', tip: '"Kann ich" kalıbını akıcı şekilde bağla.', emoji: '🍎' },
    { en: 'Die Sonne scheint wunderschön!', tr: 'Güneş pırıl pırıl parlıyor!', tip: '"scheint" derken şaynt sesini net çıkar.', emoji: '☀️' }
  ],
  '8-10': [
    { en: 'Kann ich mir deinen Bleistift leihen?', tr: 'Kurşun kalemini ödünç alabilir miyim?', tip: '"leihen" sözcüğündeki h sesini nefesli telaffuz et.', emoji: '✏️' },
    { en: 'Ich spiele gerne Fußball mit Freunden.', tr: 'Arkadaşlarımla futbol oynamayı çok severim.', tip: '"Freunden" sonundaki n sesini netleştir.', emoji: '⚽' },
    { en: 'Mein Rucksack ist voller bunter Bücher.', tr: 'Çantam renkli kitaplarla dolu.', tip: '"Rucksack" kelimesinde u sesini kısa tut.', emoji: '🎒' },
    { en: 'Schau durch das Teleskop in die Sterne!', tr: 'Teleskoptan yıldızlara bak!', tip: '"Teleskop" kelimesinde te-le-skop ritmini koru.', emoji: '🔭' }
  ],
  '11-13': [
    { en: 'Wo finde ich das Buch über Wissenschaft?', tr: 'Fen kitabını nerede bulabilirim?', tip: '"Wissenschaft" sözcüğünü vi-sın-şaft olarak söyle.', emoji: '🔬' },
    { en: 'Wir bereiten ein spannendes Weltraumprojekt vor.', tr: 'Heyecan verici bir uzay projesi hazırlıyoruz.', tip: '"vorbereiten" ayrılabilir fiiline dikkat et.', emoji: '🚀' },
    { en: 'Könnten Sie mir bitte den Weg zur Bibliothek zeigen?', tr: 'Kütüphaneye giden yolu bana gösterebilir misiniz?', tip: '"Könnten Sie" kalıbını son derece kibar bir tonda söyle.', emoji: '📚' },
    { en: 'Solarzellen erzeugen saubere erneuerbare Energie.', tr: 'Güneş panelleri temiz yenilenebilir enerji üretir.', tip: '"erneuerbare" kelimesini er-noy-er-ba-re şeklinde telaffuz et.', emoji: '⚡' }
  ],
  '14-17': [
    { en: 'Ich lerne wirklich gerne Deutsch mit Chirmo.', tr: 'Chirmo ile Almanca öğrenmekten gerçekten keyif alıyorum.', tip: '"wirklich gerne" vurgusunu içtenlikle hissettir.', emoji: '🚀' },
    { en: 'Meiner Ansicht nach fördert kritisches Denken echte Innovation.', tr: 'Benim açımdan, eleştirel düşünce inovasyonu tetikler.', tip: '"Ansicht" ve "Innovation" sözcüklerinde vurguyu heceye ver.', emoji: '💡' },
    { en: 'Künstliche Intelligenz verändert die moderne Kommunikation.', tr: 'Yapay zekâ modern iletişimi kökten dönüştürüyor.', tip: '"Kommunikation" derken ko-mu-ni-ka-tsyon akıcılığını sağla.', emoji: '🧠' },
    { en: 'Erfolgreiche Führung erfordert aktives Zuhören und Empathie.', tr: 'Etkili liderlik aktif dinleme ve empati gerektirir.', tip: '"Empathie" kelimesini em-pa-ti şeklinde sakin telaffuz et.', emoji: '🌟' }
  ]
};

// ==================== ALMANCA SIMON SAYS (CHIRMO SAGT! / CHIRMO DİYOR Kİ!) ====================
export const GERMAN_TPR_SIMON_ACTIONS: Record<AgeGroup, {
  id: string;
  title: string;
  commandTr: string;
  listenAudio: string;
  replyEn: string;
  replyTr: string;
  emoji: string;
  badge: string;
  hint: string;
}[]> = {
  '5-7': [
    {
      id: 'de-simon-1',
      title: 'Berühre deine Nase! 👃',
      commandTr: 'Burnuna dokun!',
      listenAudio: 'Chirmo sagt: Berühre deine Nase!',
      replyEn: 'Ich berühre meine Nase!',
      replyTr: 'Burnuma dokunuyorum!',
      emoji: '👃',
      badge: 'Körperbewusstsein',
      hint: 'İşaret parmağını burnuna değdir ve yüksek sesle Almanca söyle!'
    },
    {
      id: 'de-simon-2',
      title: 'Spring hoch wie ein Hase! 🐰',
      commandTr: 'Tavşan gibi yükseğe zıpla!',
      listenAudio: 'Chirmo sagt: Spring hoch wie ein kleiner Hase!',
      replyEn: 'Ich springe hoch wie ein kleiner Hase!',
      replyTr: 'Küçük bir tavşan gibi yükseğe zıplıyorum!',
      emoji: '🐰',
      badge: 'Energie & Bewegung',
      hint: 'Ayağa fırla, iki kez havaya zıpla ve neşeyle Almanca tekrar et!'
    },
    {
      id: 'de-simon-3',
      title: 'Klatsche dreimal in die Hände! 👏',
      commandTr: 'Ellerini üç kez çırp!',
      listenAudio: 'Chirmo sagt: Klatsche dreimal in die Hände!',
      replyEn: 'Eins, zwei, drei! In die Hände klatschen!',
      replyTr: 'Bir, iki, üç! Ellerini çırp!',
      emoji: '👏',
      badge: 'Rhythmus',
      hint: 'Ellerini Eins-Zwei-Drei diye neşeyle alkışla ve ritme katıl!'
    },
    {
      id: 'de-simon-4',
      title: 'Dreh dich um und lächle! 🌀',
      commandTr: 'Kendi etrafında dön ve gülümse!',
      listenAudio: 'Chirmo sagt: Dreh dich um und lächle fröhlich!',
      replyEn: 'Ich drehe mich um und strahle!',
      replyTr: 'Kendi etrafımda dönüyorum ve kocaman gülümsüyorum!',
      emoji: '😊',
      badge: 'Gleichgewicht',
      hint: 'Kendi etrafında yavaşça bir tur dön ve Chirmo\'ya gülümse!'
    },
    {
      id: 'de-simon-5',
      title: 'Fliege wie ein Superheld! 🦸‍♂️',
      commandTr: 'Süper kahraman gibi uç!',
      listenAudio: 'Chirmo sagt: Fliege wie ein mutiger Superheld!',
      replyEn: 'Wusch! Ich fliege hoch wie ein Superheld!',
      replyTr: 'Vuuuuş! Süper kahraman gibi gökyüzünde uçuyorum!',
      emoji: '🦸‍♂️',
      badge: 'Fantasie',
      hint: 'Kollarını gökyüzüne doğru aç ve rüzgar gibi süzül!'
    },
    {
      id: 'de-simon-6',
      title: 'Brülle wie ein kleiner Löwe! 🦁',
      commandTr: 'Yavru aslan gibi kükre!',
      listenAudio: 'Chirmo sagt: Brülle wie ein mutiger kleiner Löwe!',
      replyEn: 'Roar! Ich bin ein mutiger kleiner Löwe!',
      replyTr: 'Kükre! Ben cesur küçük bir aslanım!',
      emoji: '🦁',
      badge: 'Mut & Stimme',
      hint: 'Patilerini göster ve neşeyle "Roar" diye ses ver!'
    }
  ],
  '8-10': [
    {
      id: 'de-simon-8a',
      title: 'Setz deinen Rucksack auf: Bereit für die Schule! 🎒',
      commandTr: 'Okul çantanı tak ve: Okula hazırım de!',
      listenAudio: 'Chirmo sagt: Setz deinen Rucksack auf und sage: Ich bin bereit für die Schule!',
      replyEn: 'Ich bin bereit für einen tollen Schultag!',
      replyTr: 'Harika bir okul günü için hazırım!',
      emoji: '🎒',
      badge: 'Schulbegeisterung',
      hint: 'Omuzlarını dikleştir, çantanı taktığını hayal et ve söyle!'
    },
    {
      id: 'de-simon-8b',
      title: 'Schieß den Fußball und rufe: Toooor! ⚽',
      commandTr: 'Topa şut çek ve Gol diye haykır!',
      listenAudio: 'Chirmo sagt: Schieß den Fußball und rufe: Toooor!',
      replyEn: 'Toooor! Was für ein fantastischer Schuss!',
      replyTr: 'Gol! Ne muhteşem bir şut!',
      emoji: '⚽',
      badge: 'Teamgeist',
      hint: 'Ayağını ileri doğru savurarak sevinçle zıpla!'
    },
    {
      id: 'de-simon-8c',
      title: 'Fahr symbolisch Fahrrad und klingle: Kling kling! 🚲',
      commandTr: 'Bisiklet sürdüğünü canlandır ve zili çal!',
      listenAudio: 'Chirmo sagt: Fahr Fahrrad und läute die Klingel!',
      replyEn: 'Kling kling! Achtung, das Fahrrad kommt!',
      replyTr: 'Çin çin! Dikkat edin, bisiklet geliyor!',
      emoji: '🚲',
      badge: 'Balance & Spaß',
      hint: 'Kollarını gidon tutar gibi tut ve neşeyle söyle!'
    },
    {
      id: 'de-simon-8d',
      title: 'Gib High-Five und sage: Tolle Teamarbeit! ✋',
      commandTr: 'Elini uzatıp: Harika takım çalışması de!',
      listenAudio: 'Chirmo sagt: Gib High-Five und sage: Tolle Teamarbeit!',
      replyEn: 'High-Five! Wir sind ein starkes Team!',
      replyTr: 'Çak bir beşlik! Biz yenilmez bir takımız!',
      emoji: '✋',
      badge: 'Freundschaft',
      hint: 'Avucunu havaya kaldır ve gülümseyerek söyle!'
    }
  ],
  '11-13': [
    {
      id: 'de-simon-11a',
      title: 'Präsentiere: Willkommen zu unserer Wissenschaftsmesse! 🔬',
      commandTr: 'Ayağa kalk ve sunum yap: Bilim fuarımıza hoş geldiniz!',
      listenAudio: 'Chirmo sagt: Stehe auf und präsentiere: Willkommen zu unserer Wissenschaftsmesse!',
      replyEn: 'Willkommen alle zusammen! Heute präsentiere ich unser Energieprojekt!',
      replyTr: 'Herkese hoş geldiniz! Bugün temiz enerji projemizi sunuyorum!',
      emoji: '🔬',
      badge: 'Nachwuchsforscher',
      hint: 'Özgüvenle ayağa kalk ve topluluğa hitap eder gibi konuş!'
    },
    {
      id: 'de-simon-11b',
      title: 'Halte das Mikrofon und stelle dich vor! 🎙️',
      commandTr: 'Mikrofonu eline al ve kendini dünyaya tanıt!',
      listenAudio: 'Chirmo sagt: Nimm das Mikrofon und stelle dich mit Energie vor!',
      replyEn: 'Hallo Welt! Willkommen beim Chirmo Globalen Jugendradio!',
      replyTr: 'Merhaba dünya! Chirmo Küresel Gençlik Radyosuna hoş geldiniz!',
      emoji: '🎙️',
      badge: 'Medien & Sprache',
      hint: 'Elini mikrofon gibi tutarak enerjik bir radyo spikeri ol!'
    },
    {
      id: 'de-simon-11c',
      title: 'Prüfe deinen Kompass: Volle Kraft voraus! 🧭',
      commandTr: 'Pusulana bak ve yönünü hedeflerine çevir!',
      listenAudio: 'Chirmo sagt: Prüfe den Kompass und verkünde dein Ziel!',
      replyEn: 'Der Kompass zeigt nach Norden; wir steuern auf Erfolg zu!',
      replyTr: 'Pusula kuzeyi gösteriyor; başarıya doğru ilerliyoruz!',
      emoji: '🧭',
      badge: 'Entdeckergeist',
      hint: 'Pusulayı inceliyormuş gibi yap ve kararlılıkla söyle!'
    }
  ],
  '14-17': [
    {
      id: 'de-simon-14a',
      title: 'Nimm eine selbstbewusste Haltung ein: Meiner Ansicht nach... 💡',
      commandTr: 'Lider duruşuna geç ve fikrini açıkla!',
      listenAudio: 'Chirmo sagt: Nimm eine Rednerhaltung ein und teile deine Perspektive!',
      replyEn: 'Meiner Ansicht nach treiben kritisches Denken und Kreativität echte Innovation an!',
      replyTr: 'Benim açımdan, eleştirel düşünce ve yaratıcılık gerçek inovasyonu tetikler!',
      emoji: '💡',
      badge: 'Debatte & Rhetorik',
      hint: 'Göz temasını koruyarak sakin, net ve kararlı bir ses tonuyla söyle!'
    },
    {
      id: 'de-simon-14b',
      title: 'Präsentiere deine Tech-Idee in 15 Sekunden! 🚀',
      commandTr: 'Yenilikçi teknoloji fikrini 15 saniyede sun!',
      listenAudio: 'Chirmo sagt: Präsentiere deine innovative Startup-Idee mit Überzeugung!',
      replyEn: 'Unsere Software ermöglicht Jugendlichen weltweit, Sprachen fließend zu meistern!',
      replyTr: 'Yazılımımız dünya çapındaki gençlerin akıcı yabancı dil konuşmasını sağlıyor!',
      emoji: '🚀',
      badge: 'Unternehmertum',
      hint: 'Enerjini yüksek tut ve vizyonunu tek bir güçlü cümleyle aktar!'
    },
    {
      id: 'de-simon-14c',
      title: 'Beende deine Rede mit einem inspirierenden Fazit! 🌟',
      commandTr: 'Kitleye ilham veren TED tarzı bir kapanış yap!',
      listenAudio: 'Chirmo sagt: Beende deinen Vortrag mit einer motivierenden Botschaft!',
      replyEn: 'Kleine beständige Schritte schaffen außergewöhnliche weltweite Wirkung!',
      replyTr: 'Her gün atılan küçük tutarlı adımlar olağanüstü küresel etki yaratır!',
      emoji: '🌟',
      badge: 'Inspirierende Führung',
      hint: 'Derin bir nefes al ve kelimelerin gücünü hissederek seslendir!'
    }
  ]
};

// ==================== ALMANCA İNTERAKTİF SESLİ HİKAYELER ====================
export const GERMAN_STORYBOOK_SCENES: Record<AgeGroup, {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  bgGradient: string;
  description: string;
  hotspots: {
    id: string;
    nameEn: string;
    nameTr: string;
    phraseEn: string;
    phraseTr: string;
    emoji: string;
  }[];
}[]> = {
  '5-7': [
    {
      id: 'de-forest',
      name: 'Der magische Picknickwald',
      nameEn: 'Der magische Picknickwald',
      emoji: '🌳',
      bgGradient: 'from-emerald-500 via-green-600 to-teal-700',
      description: 'Ein sonniger Tag im bunten Wald mit unseren lieben Tierfreunden!',
      hotspots: [
        { id: 'de-h1', nameEn: 'Süßes Eichhörnchen', nameTr: 'Sevimli Sincap', phraseEn: 'Das süße Eichhörnchen knabbert knackige Nüsse unter dem Baum.', phraseTr: 'Sevimli sincap ağacın altında çıtır fındıklar yiyor.', emoji: '🐿️' },
        { id: 'de-h2', nameEn: 'Picknickkorb', nameTr: 'Piknik Sepeti', phraseEn: 'Schau den Picknickkorb voller roter Äpfel und leckerer Sandwiches an!', phraseTr: 'Tatlı kırmızı elmalar ve sandviçlerle dolu piknik sepetine bak!', emoji: '🧺' },
        { id: 'de-h3', nameEn: 'Singender Vogel', nameTr: 'Öten Kuş', phraseEn: 'Der kleine blaue Vogel singt eine zauberhafte Morgenmelodie.', phraseTr: 'Minik mavi kuş tatlı bir sabah melodisi söylüyor.', emoji: '🐦' },
        { id: 'de-h4', nameEn: 'Goldener Schmetterling', nameTr: 'Altın Kelebek', phraseEn: 'Ein magischer Schmetterling tanzt über den duftenden Blumen.', phraseTr: 'Büyülü altın bir kelebek mis kokulu çiçeklerin üzerinde dans ediyor.', emoji: '🦋' }
      ]
    },
    {
      id: 'de-space',
      name: 'Die Raumstation-Mission',
      nameEn: 'Die Raumstation-Mission',
      emoji: '🚀',
      bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
      description: 'Eine unvergessliche Weltraummission zwischen funkelnden Sternen!',
      hotspots: [
        { id: 'de-h5', nameEn: 'Mutiger Astronaut', nameTr: 'Cesur Astronot', phraseEn: 'Der mutige Astronaut schwebt schwerelos in der Raumstation.', phraseTr: 'Cesur astronot uzay istasyonunda yerçekimsiz süzülüyor.', emoji: '👨‍🚀' },
        { id: 'de-h6', nameEn: 'Weltraumrakete', nameTr: 'Uzay Roketi', phraseEn: 'Die glänzende Rakete fliegt durch die strahlende Milchstraße!', phraseTr: 'Parlak roket ışıldayan Samanyolu galaksisinde hızla ilerliyor!', emoji: '🚀' },
        { id: 'de-h7', nameEn: 'Ringplanet Saturn', nameTr: 'Halkalı Gezegen Satürn', phraseEn: 'Saturn hat leuchtende Ringe aus Eis und kosmischem Staub.', phraseTr: 'Satürn buz ve kozmik tozdan oluşan parlak ışıltılı halkalara sahiptir.', emoji: '🪐' },
        { id: 'de-h8', nameEn: 'Freundlicher Außerirdischer', nameTr: 'Dost Uzaylı', phraseEn: 'Der freundliche grüne Außerirdische winkt: Willkommen in unserer Galaxie!', phraseTr: 'Dost canlısı yeşil uzaylı el sallıyor ve "Galaksimize hoş geldin!" diyor.', emoji: '👽' }
      ]
    },
    {
      id: 'de-ocean',
      name: 'Das blaue Ozeanreich',
      nameEn: 'Das blaue Ozeanreich',
      emoji: '🐬',
      bgGradient: 'from-cyan-600 via-blue-700 to-indigo-800',
      description: 'Korallenriffe und faszinierende Meeresbewohner im tiefen Wasser!',
      hotspots: [
        { id: 'de-h9', nameEn: 'Verspielter Delphin', nameTr: 'Oyuncu Yunus', phraseEn: 'Der fröhliche Delphin springt elegant über die türkisfarbenen Wellen!', phraseTr: 'Neşeli yunus turkuaz dalgaların üzerinde zarifçe sıçrıyor!', emoji: '🐬' },
        { id: 'de-h10', nameEn: 'Weise Meeresschildkröte', nameTr: 'Bilge Deniz Kaplumbağası', phraseEn: 'Die weise Meeresschildkröte gleitet sanft durch das bunte Korallenriff.', phraseTr: 'Bilge deniz kaplumbağası renkli mercan kayalıklarının arasında sakince süzülüyor.', emoji: '🐢' },
        { id: 'de-h11', nameEn: 'Buntes Korallenriff', nameTr: 'Renkli Mercan Resifi', phraseEn: 'Lebendige Korallen bieten sichere Heimat für viele tropische Fische.', phraseTr: 'Canlı mercan oluşumları minik tropik balıklar için sıcak yuvalar sunar.', emoji: '🪸' },
        { id: 'de-h12', nameEn: 'Glänzende Perlenmuschel', nameTr: 'Parlak İnci İstiridyesi', phraseEn: 'In der Muschel verbirgt sich ein seltener funkelnder Meeresschatz.', phraseTr: 'İstiridyenin içinde denizin nadide, parıldayan bir hazinesi yatıyor.', emoji: '🦪' }
      ]
    },
    {
      id: 'de-dino',
      name: 'Dinosaurier-Safari Abenteuer',
      nameEn: 'Dinosaurier-Safari Abenteuer',
      emoji: '🦖',
      bgGradient: 'from-amber-600 via-orange-600 to-rose-700',
      description: 'Zeitreise vor Millionen von Jahren zu den faszinierenden Urzeitriesen!',
      hotspots: [
        { id: 'de-h13', nameEn: 'Sanfter Brachiosaurus', nameTr: 'Sevimli Brakiyozor', phraseEn: 'Der sanfte Langhalsdinosaurier pflückt grüne Blätter von hohen Ästen.', phraseTr: 'Sevimli uzun boyunlu dinozor yüksek dallardaki yeşil yapraklara uzanıyor.', emoji: '🦕' },
        { id: 'de-h14', nameEn: 'Mächtiger T-Rex', nameTr: 'Güçlü T-Rex', phraseEn: 'Der gewaltige T-Rex stößt ein energetisches Brüllen durch den Urwald aus!', phraseTr: 'Güçlü T-Rex tarih öncesi ormanda enerjik bir kükreme bırakıyor!', emoji: '🦖' },
        { id: 'de-h15', nameEn: 'Fliegender Pterodaktylus', nameTr: 'Uçan Terodaktil', phraseEn: 'Der Pterodaktylus gleitet geschmeidig über rauchende Vulkangipfel.', phraseTr: 'Terodaktil sisli volkanik tepelerin üzerinde pürüzsüzce süzülüyor.', emoji: '🦅' },
        { id: 'de-h16', nameEn: 'Dinosaurier-Ei', nameTr: 'Bebek Dinozor Yumurtası', phraseEn: 'Knack knack! Schau, ein niedliches Dino-Baby schlüpft aus dem Ei!', phraseTr: 'Çat çat! Bak, yumurtadan sevimli bir yavru dinozor çıkıyor!', emoji: '🥚' }
      ]
    }
  ],
  '8-10': [
    {
      id: 'de-school_lab',
      name: 'Das smarte Schullabor',
      nameEn: 'Das smarte Schullabor',
      emoji: '🔬',
      bgGradient: 'from-blue-600 via-indigo-600 to-purple-700',
      description: 'Spannende Entdeckungen und wissenschaftliche Experimente im Labor!',
      hotspots: [
        { id: 'de-h17', nameEn: 'Präzisions-Mikroskop', nameTr: 'Hassas Mikroskop', phraseEn: 'Mit dem Mikroskop untersuchen wir winzige Pflanzenzellen im Detail.', phraseTr: 'Mikroskopla minik bitki hücrelerini inceliyoruz.', emoji: '🔬' },
        { id: 'de-h18', nameEn: 'Programmierbarer Roboter', nameTr: 'Programlanabilir Robot', phraseEn: 'Unser Schulroboter folgt präzisen Schleifen und Codes.', phraseTr: 'Okul robotumuz algoritmaları takip ediyor.', emoji: '🤖' },
        { id: 'de-h19', nameEn: 'Reagenzglas & Farbe', nameTr: 'Deney Tüpü', phraseEn: 'Zwei sichere Flüssigkeiten mischen sich zu einer leuchtend blauen Farbe!', phraseTr: 'İki sıvı karışarak parlak maviye dönüştü!', emoji: '🧪' },
        { id: 'de-h20', nameEn: 'Forscher-Tagebuch', nameTr: 'Araştırmacı Defteri', phraseEn: 'Dokumentiere deine wissenschaftlichen Beobachtungen sorgfältig!', phraseTr: 'Bilimsel gözlemlerini defterine not et!', emoji: '📓' }
      ]
    }
  ],
  '11-13': [
    {
      id: 'de-airport',
      name: 'Internationaler Flughafen & Reisen',
      nameEn: 'Internationaler Flughafen & Reisen',
      emoji: '✈️',
      bgGradient: 'from-sky-700 via-indigo-700 to-blue-900',
      description: 'Globale Abenteuer, Reisepasskontrollen und Flüge in die Welt!',
      hotspots: [
        { id: 'de-h21', nameEn: 'Flugsteig & Boarding', nameTr: 'Uçuş Kapısı', phraseEn: 'Flugsteig B12 ruft zum Einsteigen für den internationalen Flug auf.', phraseTr: 'B12 kapısı uluslararası uçuş için çağrı yapıyor.', emoji: '🛫' },
        { id: 'de-h22', nameEn: 'Biometrischer Reisepass', nameTr: 'Biyometrik Pasaport', phraseEn: 'Ein Reisepass öffnet Türen zu neuen Kulturen und globalen Freundschaften.', phraseTr: 'Pasaport yeni kültürlerin kapısını aralar.', emoji: '🛂' },
        { id: 'de-h23', nameEn: 'Anzeigetafel', nameTr: 'Uçuş Panosu', phraseEn: 'Die Anzeigetafel informiert über Flüge nach Berlin, London und Tokio.', phraseTr: 'Uçuş panosu dünya şehirlerini gösteriyor.', emoji: 'ℹ️' },
        { id: 'de-h24', nameEn: 'Reisekoffer', nameTr: 'Seyahat Bavulu', phraseEn: 'Gut gepacktes Gepäck für eine bildende Kulturreise durch Europa.', phraseTr: 'Avrupa gezisi için düzenli hazırlanmış bavul.', emoji: '🧳' }
      ]
    }
  ],
  '14-17': [
    {
      id: 'de-silicon',
      name: 'Silicon Valley Tech Hub',
      nameEn: 'Silicon Valley Tech Hub',
      emoji: '💡',
      bgGradient: 'from-slate-800 via-indigo-900 to-slate-950',
      description: 'Startups, künstliche Intelligenz und zukunftsweisende Technologien!',
      hotspots: [
        { id: 'de-h25', nameEn: 'KI-Rechenzentrum', nameTr: 'Yapay Zeka Sunucusu', phraseEn: 'Moderne Cloud-Server trainieren generative Sprachmodelle effizient.', phraseTr: 'Bulut sunucuları dil modellerini eğitiyor.', emoji: '🖥️' },
        { id: 'de-h26', nameEn: 'Whiteboard-Brainstorming', nameTr: 'Beyin Fırtınası Tahtası', phraseEn: 'Ingenieure skizzieren modulare Architekturen für globale Plattformen.', phraseTr: 'Mühendisler mimari çözümler tasarlıyor.', emoji: '📊' },
        { id: 'de-h27', nameEn: 'Konferenz-Podium', nameTr: 'Konferans Kürsüsü', phraseEn: 'Jugendliche Tech-Leader präsentieren ethische Lösungen für die Welt.', phraseTr: 'Genç liderler küresel çözümler sunuyor.', emoji: '🎙️' },
        { id: 'de-h28', nameEn: 'Virtuelle Realität', nameTr: 'Sanal Gerçeklik Gözlüğü', phraseEn: 'Immersive Technologien revolutionieren das interaktive Lernen von Sprachen.', phraseTr: 'Sanal gerçeklik yabancı dil eğitimini dönüştürüyor.', emoji: '🥽' }
      ]
    }
  ]
};

// ==================== ALMANCA ÇOCUK ŞARKILARI ====================
export const GERMAN_KIDS_SONGS: KidSongItem[] = [
  {
    id: 'de-s1',
    title: 'Das deutsche ABC-Lied',
    category: 'Buchstaben & Laute',
    duration: '2:05 Min',
    audioSample: 'A, B, C, D, E, F, G... Sing mit mir das ABC! H, I, J, K, L, M, N, O, P!',
    lyrics: [
      'A, B, C, D, E, F, G! 🍎',
      'H, I, J, K, L, M, N, O, P! 🌟',
      'Q, R, S, und T, U, V! 🎈',
      'W, X, Ypsilon und Z! 🚂',
      'Juchhe! Nun kann ich das ABC! 🎶'
    ],
    grammarFocus: 'Almanca alfabe harflerinin doğru artikülasyonu.'
  },
  {
    id: 'de-s2',
    title: 'Guten Morgen, lieber Tag!',
    category: 'Begrüßung & Freude',
    duration: '2:15 Min',
    audioSample: 'Guten Morgen, lieber Tag! Guten Morgen Sonnenschein! Heute wird ein schöner Tag!',
    lyrics: [
      'Guten Morgen, lieber Tag! ☀️',
      'Guten Morgen Sonnenschein! 🌸',
      'Wir singen und wir tanzen! 💃',
      'Komm mach mit und stimme ein! 🎵'
    ],
    grammarFocus: 'Almanca temel selamlama ve nezaket ifadeleri.'
  },
  {
    id: 'de-s3',
    title: 'Die Farben des Regenbogens',
    category: 'Farben & Natur',
    duration: '1:55 Min',
    audioSample: 'Rot und Gelb und Grün und Blau! Schau den Regenbogen genau!',
    lyrics: [
      'Rot und Gelb und Grün und Blau! 🌈',
      'Schau den Regenbogen ganz genau! 🎨',
      'Lila, Orange und schönes Rosa! 🌸',
      'Farben lernen macht so viel Spaß! 🎈'
    ],
    grammarFocus: 'Almanca renk sıfatları.'
  }
];

// ==================== ALMANCA HAYVANAT BAHÇESİ (SAFARI) ====================
export const GERMAN_SAFARI_ANIMALS = [
  {
    id: 'de-an-lion',
    nameEn: 'Der Löwe',
    nameTr: 'Cesur Aslan',
    emoji: '🦁',
    soundText: 'Roar! Ich bin der mutige Löwe, der König der Savanne!',
    funTr: 'Aslanlar safaride kükrer ve çok güçlüdür.'
  },
  {
    id: 'de-an-elephant',
    nameEn: 'Der Elefant',
    nameTr: 'Sevimli Fil',
    emoji: '🐘',
    soundText: 'Töröö! Ich bin ein riesiger freundlicher Elefant mit großen Ohren!',
    funTr: 'Filler hortumlarıyla su püskürtmeyi çok sever.'
  },
  {
    id: 'de-an-monkey',
    nameEn: 'Der Affe',
    nameTr: 'Neşeli Maymun',
    emoji: '🐒',
    soundText: 'Uh uh ah ah! Ich liebe gelbe Bananen und springe von Baum zu Baum!',
    funTr: 'Maymunlar ağaçtan ağaca zıplar ve muz yer.'
  },
  {
    id: 'de-an-dolphin',
    nameEn: 'Der Delphin',
    nameTr: 'Akıllı Yunus',
    emoji: '🐬',
    soundText: 'Platsch! Ich schwimme blitzschnell im blauen Ozean!',
    funTr: 'Yunuslar denizde taklalar atan çok zeki dostlardır.'
  },
  {
    id: 'de-an-owl',
    nameEn: 'Die Eule',
    nameTr: 'Bilge Baykuş',
    emoji: '🦉',
    soundText: 'Uhu uhu! Ich lese schlaue Bücher unter dem funkelnden Sternenhimmel!',
    funTr: 'Baykuşlar gece uyanır ve kocaman gözleriyle her şeyi görür.'
  },
  {
    id: 'de-an-frog',
    nameEn: 'Der Frosch',
    nameTr: 'Zıpzıp Kurbağa',
    emoji: '🐸',
    soundText: 'Quaak quaak! Ich hüpfe hoch über grüne Seerosenblätter!',
    funTr: 'Kurbağalar nilüfer yapraklarının üzerinden yükseğe zıplar.'
  },
  {
    id: 'de-an-dog',
    nameEn: 'Der Hund',
    nameTr: 'Sadık Köpekçik',
    emoji: '🐶',
    soundText: 'Wau wau! Ich liebe es, dem bunten Ball hinterherzulaufen!',
    funTr: 'Köpekler topla oynamayı ve kuyruk sallamayı sever.'
  },
  {
    id: 'de-an-cat',
    nameEn: 'Die Katze',
    nameTr: 'Yumuşak Kedicik',
    emoji: '🐱',
    soundText: 'Miau miau! Schnurr... Lass uns frische Milch trinken und kuscheln!',
    funTr: 'Kediler mırıldanarak süt içmeye bayılır.'
  }
];

// ==================== ALMANCA SİHİRLİ RENKLER ====================
export const GERMAN_MAGIC_COLORS = [
  {
    id: 'de-c-red',
    nameEn: 'Rot',
    nameTr: 'Kırmızı',
    bgClass: 'from-rose-500 to-red-600',
    textClass: 'text-rose-600',
    objectEn: 'Roter Apfel',
    objectTr: 'Kırmızı Elma',
    emoji: '🍎',
    sample: 'Ich mag rote süße Äpfel!'
  },
  {
    id: 'de-c-blue',
    nameEn: 'Blau',
    nameTr: 'Mavi',
    bgClass: 'from-blue-500 to-indigo-600',
    textClass: 'text-blue-600',
    objectEn: 'Blaue Rakete',
    objectTr: 'Mavi Roket',
    emoji: '🚀',
    sample: 'Die blaue Rakete fliegt ins Weltall!'
  },
  {
    id: 'de-c-yellow',
    nameEn: 'Gelb',
    nameTr: 'Sarı',
    bgClass: 'from-amber-400 to-yellow-500',
    textClass: 'text-amber-600',
    objectEn: 'Gelbe Sonne',
    objectTr: 'Sarı Güneş',
    emoji: '☀️',
    sample: 'Die gelbe Sonne scheint warm!'
  },
  {
    id: 'de-c-green',
    nameEn: 'Grün',
    nameTr: 'Yeşil',
    bgClass: 'from-emerald-500 to-green-600',
    textClass: 'text-emerald-600',
    objectEn: 'Grüner Frosch',
    objectTr: 'Yeşil Kurbağa',
    emoji: '🐸',
    sample: 'Der grüne Frosch springt hoch!'
  },
  {
    id: 'de-c-purple',
    nameEn: 'Lila',
    nameTr: 'Mor',
    bgClass: 'from-purple-500 to-indigo-600',
    textClass: 'text-purple-600',
    objectEn: 'Lila Trauben',
    objectTr: 'Mor Üzümler',
    emoji: '🍇',
    sample: 'Süße lila Trauben sind köstlich!'
  },
  {
    id: 'de-c-orange',
    nameEn: 'Orange',
    nameTr: 'Turuncu',
    bgClass: 'from-orange-400 to-amber-500',
    textClass: 'text-orange-600',
    objectEn: 'Orangener Tiger',
    objectTr: 'Turuncu Kaplan',
    emoji: '🐯',
    sample: 'Der orange Tiger rennt schnell!'
  }
];

// ==================== ALMANCA ÇOCUK SOHBETİ (CARTOON CHAT) ====================
export const GERMAN_KIDS_CHAT_STEPS: Record<AgeGroup, {
  id: string;
  chirmoEn: string;
  chirmoTr: string;
  options: { textEn: string; textTr: string; emoji: string; replyEn: string }[];
}[]> = {
  '5-7': [
    {
      id: 'de-kc-1',
      chirmoEn: 'Hallo kleiner Superstar! 🌟 Was ist dein Lieblingstier?',
      chirmoTr: 'Merhaba minik süperstar! En sevdiğin hayvan hangisi?',
      options: [
        { textEn: 'Ich liebe Katzen!', textTr: 'Kedileri severim! 🐱', emoji: '🐱', replyEn: 'Miau! Katzen sind so flauschig und süß!' },
        { textEn: 'Ich liebe Hunde!', textTr: 'Köpekleri severim! 🐶', emoji: '🐶', replyEn: 'Wau wau! Hunde sind die treuesten Freunde!' },
        { textEn: 'Ich liebe Löwen!', textTr: 'Aslanları severim! 🦁', emoji: '🦁', replyEn: 'Roar! Du bist so mutig wie ein großer Löwe!' }
      ]
    },
    {
      id: 'de-kc-2',
      chirmoEn: 'Lecker! Was möchtest du jetzt gerne essen? 🍦',
      chirmoTr: 'Nefis! Canın şu an ne yemek istiyor?',
      options: [
        { textEn: 'Ich möchte Schokoladeneis!', textTr: 'Çikolatalı dondurma istiyorum! 🍦', emoji: '🍦', replyEn: 'Eis schmeckt an sonnigen Tagen fantastisch!' },
        { textEn: 'Ich möchte warme Pizza!', textTr: 'Sıcak pizza istiyorum! 🍕', emoji: '🍕', replyEn: 'Mmh! Warme Pizza ist absolut köstlich!' },
        { textEn: 'Ich möchte einen süßen Apfel!', textTr: 'Tatlı kırmızı elma istiyorum! 🍎', emoji: '🍎', replyEn: 'Super gesund! Äpfel geben dir jede Menge Energie!' }
      ]
    }
  ],
  '8-10': [
    {
      id: 'de-kc-8a',
      chirmoEn: 'Hi Champion! 🎒 Was ist dein Lieblingsfach in der Schule?',
      chirmoTr: 'Selam Şampiyon! Okulda en sevdiğin ders hangisi?',
      options: [
        { textEn: 'Ich liebe Sport und Fußball!', textTr: 'Beden eğitimi ve futbolu severim! ⚽', emoji: '⚽', replyEn: 'Sport hält fit, stark und voller Energie!' },
        { textEn: 'Ich liebe Wissenschaft und Experimente!', textTr: 'Fen ve deneyleri severim! 🔬', emoji: '🔬', replyEn: 'Wunderbar! Wissenschaftler entdecken die Zukunft!' },
        { textEn: 'Ich liebe Kunst und Musik!', textTr: 'Resim ve müziği severim! 🎨', emoji: '🎨', replyEn: 'Kreativität macht die Welt viel bunter!' }
      ]
    }
  ],
  '11-13': [
    {
      id: 'de-kc-11a',
      chirmoEn: 'Guten Tag! 🎧 Was sind deine liebsten Hobbys nach der Schule?',
      chirmoTr: 'İyi günler! Okuldan sonra en sevdiğin hobilerin nelerdir?',
      options: [
        { textEn: 'Ich programmiere Spiele und baue Roboter!', textTr: 'Kodlama ve robotik projelere tutkuluyum! 💻', emoji: '💻', replyEn: 'Fantastisch! Programmieren ist die Zukunft!' },
        { textEn: 'Ich spiele Basketball mit meinem Team!', textTr: 'Takımımla basketbol oynarım! 🏀', emoji: '🏀', replyEn: 'Toller Teamsport! Zusammen seid ihr unschlagbar!' }
      ]
    }
  ],
  '14-17': [
    {
      id: 'de-kc-14a',
      chirmoEn: 'Hallo! 💼 Was ist deine größte Zukunftsvision?',
      chirmoTr: 'Selamlar! Geleceğe dair en büyük hedefin nedir?',
      options: [
        { textEn: 'Ich möchte Software-Ingenieur für KI werden!', textTr: 'Yazılım ve yapay zeka mühendisi olmak istiyorum! 💻', emoji: '💻', replyEn: 'Visionäres Ziel! Chirmo hilft dir, global zu sprechen!' },
        { textEn: 'Ich möchte internationale Beziehungen studieren!', textTr: 'Uluslararası ilişkiler okumak istiyorum! 🌍', emoji: '🌍', replyEn: 'Globale Führung beginnt mit empathischer Kommunikation!' }
      ]
    }
  ]
};

// ==================== ALMANCA 4 BLOKLU CÜMLE FABRİKASI ====================
export const GERMAN_FACTORY_OPTIONS: Record<AgeGroup, {
  subjects: string[];
  actions: string[];
  objects: string[];
  contexts: string[];
}> = {
  '5-7': {
    subjects: ['Mein freundlicher Hund', 'Der smarte Roboter', 'Der kleine Hase', 'Mein bester Freund', 'Ein mutiger Astronaut'],
    actions: ['spielt gerne mit', 'isst am liebsten', 'möchte entdecken', 'sieht fröhlich', 'tanzt lustig mit'],
    objects: ['einem bunten Ball', 'einem süßen Apfel', 'einem großen Regenbogen', 'einer schnellen Rakete', 'einem leckeren Keks'],
    contexts: ['im sonnigen Park', 'jeden schönen Morgen', 'unter dem großen Baum', 'im gemütlichen Zimmer', 'mit einem breiten Lächeln']
  },
  '8-10': {
    subjects: ['Unser Schul-Fußballteam', 'Die neugierige Schülerin', 'Mein kreativer Kunstlehrer', 'Ein talentierter Musiker', 'Der junge Programmierer'],
    actions: ['trainiert täglich für', 'gewann eine goldene Trophäe für', 'teilt tolle Ideen über', 'entwickelt ein Projekt mit', 'erzielte ein fantastisches Tor in'],
    objects: ['das Meisterschaftsspiel', 'ein brandneues Teleskop', 'die Schul-Wissenschaftsmesse', 'ein fröhliches Lied', 'das Robotik-Turnier'],
    contexts: ['im Sportzentrum der Stadt', 'während der Mittagspause', 'mit großer Begeisterung', 'vor der gesamten Schule', 'jeden Samstagnachmittag']
  },
  '11-13': {
    subjects: ['Der Nachwuchs-Forscherclub', 'Unser internationaler Brieffreund', 'Das Umwelt-Team', 'Eine geniale junge Erfinderin', 'Mein Debattierpartner'],
    actions: ['forscht intensiv über', 'empfiehlt das Entdecken von', 'organisiert ein Event über', 'entwickelte ein Modell für', 'diskutiert Lösungen für'],
    objects: ['saubere erneuerbare Energie', 'den Schutz der Ozeane', 'interaktive Lern-Apps', 'planetare Navigationsmethoden', 'moderne Bibliotheksressourcen'],
    contexts: ['auf der Wissenschaftskonferenz', 'über digitale Lernplattformen', 'mit engagierten Mentoren', 'in verschiedenen europäischen Städten', 'mit inspirierender Zuversicht']
  },
  '14-17': {
    subjects: ['Junge Technologie-Pioniere', 'Unser Schul-Debattierteam', 'Zukünftige Software-Entwickler', 'Globale Klima-Aktivisten', 'Innovative Content-Schöpfer'],
    actions: ['arbeiten aktiv an', 'präsentieren wirkungsvoll über', 'analysieren kritisch Argumente für', 'entwerfen skalierbare Lösungen für', 'begeistern internationales Publikum mit'],
    objects: ['ethische künstliche Intelligenz', 'zukunftsweisende Web-Architektur', 'weltweite Bildungsgerechtigkeit', 'nachhaltige Stadtökosysteme', 'interkulturelle Sprachgewandtheit'],
    contexts: ['bei internationalen Hackathons', 'in weltweiten Gipfeltreffen', 'zur Stärkung von Gemeinschaften', 'durch moderne digitale Medien', 'mit langfristiger globaler Wirkung']
  }
};

// ==================== ALMANCA GÜNÜN SESLİ KONUŞMA MEYDAN OKUMALARI ====================
export const GERMAN_AGE_SPEAKING_CHALLENGES: Record<AgeGroup, {
  title: string;
  en: string;
  tr: string;
  tips: string;
  topic: string;
  level: string;
}> = {
  '5-7': {
    title: 'Erste Sätze & Nette Wünsche (İlk Cümlelerim & Sevimli İstekler)',
    en: 'Hallo Chirmo! Ich möchte bitte einen süßen roten Apfel!',
    tr: 'Merhaba Chirmo! Tatlı kırmızı bir elma istiyorum lütfen!',
    tips: 'Kelimeleri tane tane ve gülümseyerek söyle: "süßen roten Apfel".',
    topic: 'Nezaket & İstek',
    level: 'Pre-A1'
  },
  '8-10': {
    title: 'Schulleben & Teamarbeit (Okul Hayatı & Arkadaşça İş Birliği)',
    en: 'Kann ich mir deinen spitzen Bleistift leihen? Wir bereiten die Wissenschaftsmesse vor!',
    tr: 'Kurşun kalemini ödünç alabilir miyim? Okul fen fuarı için hazırlanıyoruz!',
    tips: '"Kann ich mir leihen" kalıbını akıcı ve melodik bağla.',
    topic: 'İzin İsteme & Takım Çalışması',
    level: 'A1+'
  },
  '11-13': {
    title: 'Neugier, Wissenschaft & Eigene Meinung (Merak, Bilim & Fikir Belirtme)',
    en: 'Meiner Meinung nach werden Weltraumforschung und erneuerbare Energien unsere Zukunft gestalten!',
    tr: 'Bana göre uzay keşfi ve yenilenebilir enerji geleceğimizi şekillendirecek!',
    tips: '"Meiner Meinung nach" kalıbını kendine güvenen net bir tonla telaffuz et.',
    topic: 'Fikir Paylaşımı & Bilim',
    level: 'A2'
  },
  '14-17': {
    title: 'Globale Debatte & Innovation (Küresel Münazara & İnovasyon)',
    en: 'Aus meiner Sicht ermöglichen uns künstliche Intelligenz und aktive Zusammenarbeit, globale Herausforderungen zu meistern.',
    tr: 'Benim bakış açıma göre, yapay zekâ ve aktif iş birliği küresel sorunları çözmemizi güçlendiriyor.',
    tips: '"Aus meiner Sicht" ve "Herausforderungen" sözcüklerine doğal vurgu ver.',
    topic: 'Akıcı Münazara & Liderlik',
    level: 'B1 / B2'
  }
};

// ==================== ALMANCA PATTERN BUILDER SEÇENEKLERİ ====================
export const GERMAN_PATTERN_OPTIONS: Record<AgeGroup, {
  prefixes: string[];
  objects: string[];
  suffixes: string[];
}> = {
  '5-7': {
    prefixes: ['Ich möchte', 'Kann ich bitte', 'Ich mag', 'Wo ist', 'Ich kann'],
    objects: ['Wasser', 'einen Apfel', 'ein Fahrrad', 'Milch', 'meinen Rucksack', 'spielen'],
    suffixes: ['bitte', 'heute', 'jetzt', 'zusammen', 'mit Freunden']
  },
  '8-10': {
    prefixes: ['Möchtest du', 'Ich würde gerne', 'Können wir üben', 'Lass uns entdecken', 'Warum magst du'],
    objects: ['Fußball mit dem Team', 'neue Experimente', 'Comics lesen', 'bunte Plakate malen', 'Mathe-Rätsel lösen'],
    suffixes: ['nach der Schule', 'am Wochenende', 'mit viel Freude', 'jeden Tag', 'zusammen im Park']
  },
  '11-13': {
    prefixes: ['Wir planen', 'Es ist wichtig zu', 'Hast du Lust auf', 'Ich interessiere mich für', 'Gemeinsam können wir'],
    objects: ['saubere Energieformen', 'die Geheimnisse der Planeten', 'neue mobile Apps', 'interessante Bücher', 'internationale Projekte'],
    suffixes: ['im Wissenschaftskurs', 'in unserer Zukunft', 'mit unserem Forscherteam', 'Schritt für Schritt', 'mit großer Neugier']
  },
  '14-17': {
    prefixes: ['Aus meiner Perspektive sollten wir', 'Es ist essenziell zu', 'Ich plädiere für', 'Lass uns analysieren, wie', 'Wir tragen Verantwortung für'],
    objects: ['ethische künstliche Intelligenz', 'innovative digitale Plattformen', 'nachhaltige Stadtentwicklung', 'globale Bildungsgerechtigkeit', 'kreative Lösungsansätze'],
    suffixes: ['in internationalen Konferenzen', 'für eine bessere Gesellschaft', 'auf wissenschaftlicher Basis', 'mit globaler Tragweite', 'durch aktive Zusammenarbeit']
  }
};


