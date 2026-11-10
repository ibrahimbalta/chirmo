// Chirmo Kids Fransızca (Français) Özel Pedagojik Veri Havuzu
// 5-17 Yaş Çocuklar ve Gençler İçin Oyunlaştırılmış Fransızca Öğrenme Deneyimi

import { KidVocabItem, KidListeningQuizItem, KidSentencePuzzleItem, KidSongItem } from '../components/kids/ChirmoKidsDedicatedHub';
import { AgeGroup } from '../components/kids/ChirmoKidsDedicatedHub';

export const FRENCH_AGE_VOCABULARY: Record<AgeGroup, KidVocabItem[]> = {
  '5-7': [
    { id: 'fr-v1', en: 'Le Chat', tr: 'Kedi', emoji: '🐱', category: 'Animaux (Hayvanlar)', soundText: 'Regarde le joli chat! Le chat fait miaou.', exampleTr: 'Sevimli kediye bak! Kedi miyav diyor.', funFact: 'Kediler günde 14-16 saat uyurlar ve çok sevimlidirler!' },
    { id: 'fr-v2', en: 'Le Chien', tr: 'Köpek', emoji: '🐶', category: 'Animaux (Hayvanlar)', soundText: 'Le chien fidèle fait ouaf ouaf!', exampleTr: 'Sadık köpek hav hav diyor!', funFact: 'Köpekler insanların en sadık dostlarıdır.' },
    { id: 'fr-v3', en: 'La Pomme', tr: 'Kırmızı Elma', emoji: '🍎', category: 'Nourriture (Yiyecekler)', soundText: "J'aime manger des pommes rouges et douces.", exampleTr: 'Kırmızı tatlı elmaları yemeyi severim.', funFact: 'Elma yemek dişlerimizi ve hafızamızı güçlendirir.' },
    { id: 'fr-v4', en: 'Le Soleil', tr: 'Güneş', emoji: '☀️', category: 'Nature (Doğa)', soundText: 'Le soleil brille chaudement aujourd\'hui.', exampleTr: 'Sıcak güneş bugün pırıl pırıl parlıyor.', funFact: 'Güneş dünyaya ısı, ışık ve yaşam neşesi verir.' },
    { id: 'fr-v5', en: 'Le Lion', tr: 'Aslan', emoji: '🦁', category: 'Animaux (Hayvanlar)', soundText: 'Le lion courageux rugit dans la savane.', exampleTr: 'Cesur aslan safaride kükrüyor.', funFact: 'Aslanlar hayvanlar aleminin kralı olarak bilinir.' },
    { id: 'fr-v6', en: 'Le Lait', tr: 'Süt', emoji: '🥛', category: 'Nourriture (Yiyecekler)', soundText: 'Puis-je avoir un verre de lait frais, s\'il vous plaît?', exampleTr: 'Bir bardak taze süt alabilir miyim lütfen?', funFact: 'Süt kemiklerimizin büyümesine yardımcı olur.' },
    { id: 'fr-v7', en: "L'Arc-en-ciel", tr: 'Gökkuşağı', emoji: '🌈', category: 'Nature (Doğa)', soundText: "Je vois sept belles couleurs dans l'arc-en-ciel.", exampleTr: 'Gökkuşağında yedi güzel renk görebiliyorum.', funFact: 'Gökkuşağı yağmurdan hemen sonra güneş açtığında oluşur.' },
    { id: 'fr-v8', en: 'Le Ballon', tr: 'Top', emoji: '⚽', category: 'Jeux (Oyun)', soundText: 'Jouons ensemble avec le ballon de foot!', exampleTr: 'Futbol topuyla birlikte oynayalım!', funFact: 'Futbol dünyada en çok sevilen takım oyunudur.' },
    { id: 'fr-v9', en: "L'Ourson", tr: 'Oyuncak Ayıcık', emoji: '🧸', category: 'Jeux (Oyun)', soundText: 'Mon petit ourson est très doux et câlin.', exampleTr: 'Benim küçük ayıcığım çok yumuşak ve sevimli.', funFact: 'Çocuklar uyurken ayıcıklarına sarılmayı çok sever.' },
    { id: 'fr-v9b', en: "L'Étoile", tr: 'Yıldız', emoji: '⭐', category: 'Nature (Doğa)', soundText: 'Brille, brille, petite étoile dans le ciel bleu!', exampleTr: 'Mavi gökyüzünde parla küçük yıldız!', funFact: 'Geceleri gökyüzünde parlayan milyarlarca yıldız vardır.' },
    { id: 'fr-v9c', en: 'Le Biscuit', tr: 'Kurabiye', emoji: '🍪', category: 'Nourriture (Yiyecekler)', soundText: 'Puis-je avoir un délicieux biscuit au chocolat?', exampleTr: 'Çikolatalı lezzetli bir kurabiye alabilir miyim lütfen?', funFact: 'Sıcak kurabiyeler sütle harika gider!' },
    { id: 'fr-v9d', en: 'Le Train', tr: 'Tren', emoji: '🚂', category: 'Jeux (Oyun)', soundText: 'Tchou tchou! Le petit train roule sur les rails.', exampleTr: 'Çuf çuf! Küçük tren raylarda ilerliyor.', funFact: "Fransa'daki hızlı trenler (TGV) saatte 320 kilometre hızla gidebilir." },
    { id: 'fr-v9e', en: 'La Banane', tr: 'Muz', emoji: '🍌', category: 'Nourriture (Yiyecekler)', soundText: 'Les singes adorent les bananes jaunes et douces!', exampleTr: 'Maymunlar tatlı sarı muzları çok sever.', funFact: 'Muz spor yaparken bize bol enerji verir!' },
    { id: 'fr-v9f', en: "L'Eau", tr: 'Su', emoji: '💧', category: 'Nourriture (Yiyecekler)', soundText: "Puis-je avoir un verre d'eau fraîche, s'il vous plaît?", exampleTr: 'Bir bardak soğuk su alabilir miyim lütfen?', funFact: 'Vücudumuzun büyük bir kısmı sudan oluşur.' },
    { id: 'fr-v9g', en: "Le Grand Arbre", tr: 'Büyük Ağaç', emoji: '🌳', category: 'Nature (Doğa)', soundText: 'Les oiseaux chantent dans le grand arbre vert.', exampleTr: 'Kuşlar büyük yeşil ağaçta şarkı söyler.', funFact: 'Ağaçlar havayı temizleyip bize oksijen üretir.' },
    { id: 'fr-v9h', en: 'La Fleur Rouge', tr: 'Kırmızı Çiçek', emoji: '🌸', category: 'Nature (Doğa)', soundText: 'Sens la jolie fleur rouge dans le jardin!', exampleTr: 'Bahçedeki güzel kokulu kırmızı çiçeği kokla.', funFact: 'Arılar çiçeklerden nektar toplayarak tatlı bal yapar.' },
    { id: 'fr-v9i', en: 'La Voiture Rapide', tr: 'Hızlı Araba', emoji: '🚗', category: 'Jeux (Oyun)', soundText: 'Tut tut! La belle voiture rapide passe à toute vitesse.', exampleTr: 'Düt düt! Parlak hızlı araba yanımdan geçti.', funFact: "Fransa otomobil yarışları ve zarif tasarımlarıyla ünlüdür." },
    { id: 'fr-v9j', en: "L'Avion", tr: 'Uçak', emoji: '✈️', category: 'Jeux (Oyun)', soundText: "L'avion blanc vole haut au-dessus des nuages.", exampleTr: 'Uçak beyaz bulutların çok üzerinde uçar.', funFact: 'Uçaklar dünyayı sadece saatler içinde dolaşmamızı sağlar.' },
    { id: 'fr-v9k', en: 'Le Canard Jaune', tr: 'Sarı Ördek', emoji: '🦆', category: 'Animaux (Hayvanlar)', soundText: 'Coin coin! Le petit canard jaune nage joyeusement.', exampleTr: 'Vak vak! Sarı ördek neşeyle yüzüyor.', funFact: 'Ördeklerin tüyleri suya girseler bile ıslanmaz!' },
    { id: 'fr-v9l', en: 'Le Lapin', tr: 'Tavşan', emoji: '🐰', category: 'Animaux (Hayvanlar)', soundText: 'Le lapin blanc saute dans l\'herbe verte.', exampleTr: 'Tüylü beyaz tavşan çimenlerde zıplıyor.', funFact: 'Tavşanların kulakları sesleri çok uzaklardan bile duyar.' },
    { id: 'fr-v9m', en: 'Le Sourire', tr: 'Mutlu Gülümseme', emoji: '😊', category: 'Émotions (Duygular)', soundText: 'Offre au monde un grand et beau sourire chaque jour!', exampleTr: 'Her gün neşeli ve aydınlık bir tebessüm takın!', funFact: 'Gülümsemek beynimize mutluluk ve neşe sinyalleri gönderir.' },
    { id: 'fr-v9n', en: 'Taper des mains', tr: 'Alkışlayan Eller', emoji: '👏', category: 'Corps (Vücudumuz)', soundText: 'Tape des mains si tu es joyeux et heureux!', exampleTr: 'Kendini neşeli hissediyorsan ellerini çırp!', funFact: 'Alkışlamak kalbimizin ritmini ve neşemizi canlandırır.' },
    { id: 'fr-v9o', en: 'Le Lit Douillet', tr: 'Rahat Yatak', emoji: '🛏️', category: 'Maison (Evimiz)', soundText: 'Il est temps de se reposer dans mon lit douillet. Bonne nuit!', exampleTr: 'Sıcak ve rahat yatağımda dinlenme zamanı. İyi geceler!', funFact: 'İyi bir gece uykusu boyumuzun uzamasını sağlar.' },
    { id: 'fr-v9p', en: 'Le Livre Illustré', tr: 'Hikaye Kitabı', emoji: '📖', category: 'École (Okul)', soundText: 'Ouvrons ce livre d\'images magique et coloré!', exampleTr: 'Büyülü renkli hikaye kitabını açalım.', funFact: 'Kitap okumak hayal dünyamızı ve zekamızı sınırsız büyütür.' }
  ],

  '8-10': [
    { id: 'fr-v10', en: 'Le Sac à dos', tr: 'Okul Çantası', emoji: '🎒', category: 'École (Okul)', soundText: 'Mon sac à dos est plein de livres scolaires colorés.', exampleTr: 'Ağır okul çantam renkli kitaplarla dolu.', funFact: 'Okul eşyalarımızı düzenli tutmak derslerimizde bize büyük kolaylık sağlar.' },
    { id: 'fr-v11', en: 'Le Vélo', tr: 'Bisiklet', emoji: '🚲', category: 'Sport', soundText: "J'adore faire du vélo bleu dans le grand parc.", exampleTr: 'Parkta mavi bisikletimi sürebiliyorum.', funFact: 'Bisiklet sürmek hem bacak kaslarını hem dengeyi geliştirir.' },
    { id: 'fr-v12', en: 'La Fusée Spatiale', tr: 'Uzay Roketi', emoji: '🚀', category: 'Science (Bilim)', soundText: 'Trois, deux, un! La fusée décolle vers les étoiles!', exampleTr: 'Üç, iki, bir! Uzay roketi fırlatıldı!', funFact: 'Roketler saniyede 11 kilometre hızla uzaya çıkar.' },
    { id: 'fr-v13', en: 'Le Crayon', tr: 'Kurşun Kalem', emoji: '✏️', category: 'École (Okul)', soundText: 'Puis-je emprunter ton crayon bien taillé, s\'il te plaît?', exampleTr: 'Açılmış kurşun kalemini ödünç alabilir miyim lütfen?', funFact: 'Bir kurşun kalemle yaklaşık 50.000 kelime yazılabilir.' },
    { id: 'fr-v14', en: 'La Guitare', tr: 'Gitar', emoji: '🎸', category: 'Musique', soundText: 'Elle joue une jolie mélodie joyeuse à la guitare.', exampleTr: 'Gitarla neşeli bir melodi çalabiliyor.', funFact: 'Müzik dinlemek yabancı dil kulak aşinalığını 3 kat hızlandırır.' },
    { id: 'fr-v15', en: 'La Glace', tr: 'Dondurma', emoji: '🍦', category: 'Nourriture (Yiyecekler)', soundText: 'Je voudrais une délicieuse glace à la fraise, s\'il vous plaît.', exampleTr: 'Büyük bir çilekli dondurma istiyorum lütfen.', funFact: 'Dondurma mutluluk hormonu salgılanmasına katkı sağlar.' },
    { id: 'fr-v16', en: 'Le Dinosaure', tr: 'Dinozor', emoji: '🦖', category: 'Nature (Doğa)', soundText: 'Le gigantesque dinosaure vivait il y a très longtemps.', exampleTr: 'Dev dinozor çok uzun zaman önce dünyada yürüdü.', funFact: 'T-Rex dinozorunun bir dişi 30 santimetreye kadar uzardı!' },
    { id: 'fr-v16b', en: 'Le Skateboard', tr: 'Kaykay', emoji: '🛹', category: 'Sport', soundText: 'Je fais des figures amusantes au skatepark avec mes amis.', exampleTr: 'Parkta kaykayımla havalı hareketler yapmayı severim.', funFact: 'Kaykay olimpiyatlarda bir spor dalı haline gelmiştir.' },
    { id: 'fr-v16c', en: 'Le Télescope', tr: 'Teleskop', emoji: '🔭', category: 'Science (Bilim)', soundText: 'Regarde dans le télescope pour admirer les cratères de la Lune!', exampleTr: 'Aydaki kraterleri görmek için teleskoptan bak!', funFact: 'Galileo 400 yıl önce ilk kez teleskopla gezegenleri incelemiştir.' },
    { id: 'fr-v16d', en: 'Le Ballon de Foot', tr: 'Futbol & Gol', emoji: '⚽', category: 'Sport', soundText: 'Passe le ballon et tire! Quel but magnifique et spectaculaire!', exampleTr: 'Topu pas ver ve şut çek! Ne muhteşem bir gol!', funFact: 'Takım sporları paylaşmayı ve liderliği öğretir.' },
    { id: 'fr-v16e', en: 'La Piscine', tr: 'Yüzme Havuzu', emoji: '🏊', category: 'Sport', soundText: "J'aime plonger dans la piscine bleue et fraîche.", exampleTr: 'Güneşli hafta sonlarında serin mavi havuzda yüzmeyi severim.', funFact: 'Yüzme tüm vücut kaslarını aynı anda çalıştıran en iyi spordur.' },
    { id: 'fr-v16f', en: 'Le Médecin Bienveillant', tr: 'Şefkatli Doktor', emoji: '🩺', category: 'Métiers (Meslekler)', soundText: 'Le médecin gentil aide tous les enfants à rester en pleine forme.', exampleTr: 'Şefkatli doktor herkesin güçlü ve sağlıklı kalmasına yardım eder.', funFact: 'Steteskop kalbin atış sesini 10 kat netleştirerek duyar.' },
    { id: 'fr-v16g', en: 'Le Robot Intelligent', tr: 'Akıllı Robot', emoji: '🤖', category: 'Science (Bilim)', soundText: 'Chirmo est un robot intelligent qui t\'apprend le français avec joie!', exampleTr: 'Chirmo sana Fransızca öğreten akıllı bir robottur!', funFact: 'Robotlar insanların karmaşık görevleri hızla yapmasına yardımcı olur.' },
    { id: 'fr-v16h', en: "L'Horloge", tr: 'Duvar Saati', emoji: '⏰', category: 'Temps (Zaman)', soundText: "Tic tac! L'horloge indique qu'il est l'heure d'aller à l'école.", exampleTr: 'Tik tak! Saat okula gitme zamanı olduğunu söylüyor.', funFact: 'Günde 24 saat ve her saatte 60 dakika vardır.' },
    { id: 'fr-v16i', en: 'Soleil et Pluie', tr: 'Güneş ve Yağmur', emoji: '⛅', category: 'Nature (Doğa)', soundText: 'Il fait soleil avec une petite pluie d\'été très rafraîchissante.', exampleTr: 'Hava parçalı güneşli ve ferahlatıcı hafif bir yağmur var.', funFact: 'Havadaki su damlacıkları güneşle birleşince gökkuşağı yaratır.' }
  ],

  '11-13': [
    { id: 'fr-v17', en: 'Le Laboratoire', tr: 'Bilim Laboratuvarı', emoji: '🔬', category: 'Science (Bilim)', soundText: 'Nous faisons une expérience fascinante dans le laboratoire scolaire.', exampleTr: 'Okul fen laboratuvarında büyüleyici bir deney yapıyoruz.', funFact: 'Mikroskop gözle görülemeyen mikro canlıları bin kat büyütür.' },
    { id: 'fr-v18', en: 'La Planète Saturne', tr: 'Satürn Gezegeni', emoji: '🪐', category: 'Astronomie', soundText: 'Saturne possède de magnifiques anneaux dorés dans l\'espace.', exampleTr: 'Satürn uzayda büyüleyici altın halkalara sahiptir.', funFact: 'Satürn halkaları milyarlarca buz ve kaya parçasından oluşur.' },
    { id: 'fr-v19', en: 'La Technologie Mobile', tr: 'Mobil Teknoloji', emoji: '📱', category: 'Technologie', soundText: 'La technologie moderne nous permet de communiquer partout dans le monde.', exampleTr: 'Modern teknoloji dünyanın her yeriyle iletişim kurmamızı sağlar.', funFact: 'İlk akıllı telefonlar 2000\'li yılların başında hayatımıza girdi.' },
    { id: 'fr-v20', en: 'Le Trophée Doré', tr: 'Altın Kupa', emoji: '🏆', category: 'Succès (Başarı)', soundText: 'Notre équipe a remporté le grand trophée d\'or du tournoi!', exampleTr: 'Takımımız turnuvanın büyük altın kupasını kazandı!', funFact: 'Kupalar azim ve disiplinli çalışmanın somut ödülleridir.' },
    { id: 'fr-v21', en: 'Les Étoiles de la Galaxie', tr: 'Galaksi Yıldızları', emoji: '🌌', category: 'Astronomie', soundText: 'La Voie lactée contient des centaines de milliards d\'étoiles lumineuses.', exampleTr: 'Samanyolu yüz milyarlarca parlak yıldız içerir.', funFact: 'Işığın bir galaksiden diğerine geçmesi binlerce yıl sürer.' },
    { id: 'fr-v22', en: "L'Énergie Renouvelable", tr: 'Temiz Enerji', emoji: '⚡', category: 'Environnement', soundText: "L'énergie solaire et l'énergie éolienne protègent notre belle planète.", exampleTr: 'Güneş ve rüzgar enerjisi güzel gezegenimizi korur.', funFact: 'Güneş enerjisi tükenmez ve sıfır karbon üretir.' }
  ],

  '14-17': [
    { id: 'fr-v23', en: "L'Intelligence Artificielle", tr: 'Yapay Zeka', emoji: '🧠', category: 'Technologie', soundText: "L'intelligence artificielle transforme l'avenir de l'éducation et de la science.", exampleTr: 'Yapay zeka eğitim ve bilimin geleceğini dönüştürüyor.', funFact: 'Yapay zeka modelleri milyonlarca veriyi saniyeler içinde analiz eder.' },
    { id: 'fr-v24', en: 'Algorithme de Programmation', tr: 'Kodlama Algoritması', emoji: '💻', category: 'Informatique', soundText: 'Un algorithme efficace résout des problèmes complexes avec précision.', exampleTr: 'Etkili bir algoritma karmaşık problemleri hassasiyetle çözer.', funFact: 'Dünyadaki her yazılım arkasında algoritmalar barındırır.' },
    { id: 'fr-v25', en: 'Innovation Créative', tr: 'Yaratıcı Girişim', emoji: '💡', category: 'Innovation', soundText: 'Une idée innovante peut apporter un changement positif dans la société.', exampleTr: 'Yenilikçi bir fikir toplumda olumlu bir değişim yaratabilir.', funFact: 'En büyük buluşlar merak ve problem çözme tutkusuyla doğmuştur.' },
    { id: 'fr-v26', en: 'Grande Ambition', tr: 'Gelecek Hedefi', emoji: '🌟', category: 'Avenir (Gelecek)', soundText: 'Fixe-toi de grands objectifs et travaille avec passion chaque jour.', exampleTr: 'Kendine büyük hedefler koy ve her gün tutkuyla çalış.', funFact: 'Hedeflerini yazıya döken insanların başarma oranı %42 daha fazladır.' },
    { id: 'fr-v27', en: 'Émission Podcast', tr: 'Sesli Podcast', emoji: '🎧', category: 'Média', soundText: "J'écoute un podcast scientifique passionnant pour enrichir mon français.", exampleTr: 'Fransızcamı geliştirmek için büyüleyici bir bilim podcasti dinliyorum.', funFact: 'Yabancı dilde ses dinlemek telaffuz kaslarını hızla eğitir.' },
    { id: 'fr-v28', en: "Travail d'Équipe", tr: 'Takım Çalışması', emoji: '🤝', category: 'Leadership', soundText: 'La collaboration internationale crée des projets d\'une valeur inestimable.', exampleTr: 'Uluslararası iş birliği paha biçilmez değerde projeler yaratır.', funFact: 'En büyük teknoloji ve uzay projeleri binlerce uzmanın takım çalışmasıdır.' }
  ]
};

export const FRENCH_LISTENING_QUIZZES: Record<AgeGroup, KidListeningQuizItem[]> = {
  '5-7': [
    {
      id: 'fr-lq1',
      questionAudio: "Où est le chat mignon qui fait miaou?",
      promptTr: 'Miyavlayan sevimli kedi nerede?',
      options: [
        { id: 'opt1', label: 'Le Chat 🐱', emoji: '🐱', isCorrect: true },
        { id: 'opt2', label: 'Le Chien 🐶', emoji: '🐶', isCorrect: false },
        { id: 'opt3', label: 'Le Lion 🦁', emoji: '🦁', isCorrect: false }
      ],
      praise: "Bravo! Tu as reconnu le petit chat!"
    },
    {
      id: 'fr-lq2',
      questionAudio: "Quelle est la pomme rouge et sucrée?",
      promptTr: 'Kırmızı ve tatlı elma hangisi?',
      options: [
        { id: 'opt1', label: 'La Banane 🍌', emoji: '🍌', isCorrect: false },
        { id: 'opt2', label: 'La Pomme 🍎', emoji: '🍎', isCorrect: true },
        { id: 'opt3', label: 'Le Biscuit 🍪', emoji: '🍪', isCorrect: false }
      ],
      praise: "Magnifique! C'est la pomme rouge!"
    }
  ],
  '8-10': [
    {
      id: 'fr-lq3',
      questionAudio: "Quel objet utilise-t-on pour regarder les étoiles et la Lune?",
      promptTr: 'Yıldızları ve Ay’ı izlemek için hangi aleti kullanırız?',
      options: [
        { id: 'opt1', label: 'Le Télescope 🔭', emoji: '🔭', isCorrect: true },
        { id: 'opt2', label: 'La Guitare 🎸', emoji: '🎸', isCorrect: false },
        { id: 'opt3', label: 'Le Skateboard 🛹', emoji: '🛹', isCorrect: false }
      ],
      praise: "Excellent choix! Le télescope explore le ciel!"
    }
  ],
  '11-13': [
    {
      id: 'fr-lq4',
      questionAudio: "Quelle énergie propre utilise la force de la lumière du soleil?",
      promptTr: 'Güneş ışığının gücünü kullanan temiz enerji hangisidir?',
      options: [
        { id: 'opt1', label: "L'Énergie Solaire ⚡", emoji: '⚡', isCorrect: true },
        { id: 'opt2', label: "L'Essence 🛢️", emoji: '🛢️', isCorrect: false },
        { id: 'opt3', label: 'Le Charbon ⛏️', emoji: '⛏️', isCorrect: false }
      ],
      praise: "Très bien pensé! L'énergie solaire est propre et durable!"
    }
  ],
  '14-17': [
    {
      id: 'fr-lq5',
      questionAudio: "Quelle technologie moderne permet aux ordinateurs d'apprendre et de raisonner?",
      promptTr: 'Bilgisayarların öğrenmesini ve akıl yürütmesini sağlayan teknoloji hangisidir?',
      options: [
        { id: 'opt1', label: "L'Intelligence Artificielle 🧠", emoji: '🧠', isCorrect: true },
        { id: 'opt2', label: "L'Imprimante Papier 🖨️", emoji: '🖨️', isCorrect: false },
        { id: 'opt3', label: 'Le Câble Électrique 🔌', emoji: '🔌', isCorrect: false }
      ],
      praise: "Impressionnant! L'intelligence artificielle façonne le monde de demain!"
    }
  ]
};

export const FRENCH_PUZZLE_CHALLENGES: Record<AgeGroup, KidSentencePuzzleItem[]> = {
  '5-7': [
    {
      id: 'fr-pz1',
      targetEn: 'Je veux de l\'eau, s\'il vous plaît.',
      targetTr: 'Su istiyorum lütfen.',
      words: ['Je', 'veux', 'de l\'eau,', 's\'il', 'vous', 'plaît.'],
      hint: 'Fransızca kibarca bir şey isterken "s\'il vous plaît" deriz.'
    }
  ],
  '8-10': [
    {
      id: 'fr-pz2',
      targetEn: 'Je joue au football avec mes amis.',
      targetTr: 'Arkadaşlarımla futbol oynuyorum.',
      words: ['Je', 'joue', 'au', 'football', 'avec', 'mes', 'amis.'],
      hint: '"au football" kalıbına dikkat et.'
    }
  ],
  '11-13': [
    {
      id: 'fr-pz3',
      targetEn: 'La science nous aide à comprendre l\'univers.',
      targetTr: 'Bilim evreni anlamamıza yardım eder.',
      words: ['La', 'science', 'nous', 'aide', 'à', 'comprendre', 'l\'univers.'],
      hint: '"aide à comprendre" kalıbı.'
    }
  ],
  '14-17': [
    {
      id: 'fr-pz4',
      targetEn: 'La collaboration internationale résout de grands défis.',
      targetTr: 'Uluslararası iş birliği büyük zorlukları çözer.',
      words: ['La', 'collaboration', 'internationale', 'résout', 'de', 'grands', 'défis.'],
      hint: 'Akıcı bir fikir cümlesi.'
    }
  ]
};

export const FRENCH_VOICE_CHALLENGES: Record<AgeGroup, { en: string; tr: string; tip: string; emoji: string }[]> = {
  '5-7': [
    { en: 'Bonjour Chirmo! Comment vas-tu?', tr: 'Merhaba Chirmo! Nasılsın?', tip: 'Nazal "on" sesini burnundan ve yumuşak çıkar.', emoji: '🤖' },
    { en: 'Une pomme rouge, s\'il vous plaît!', tr: 'Kırmızı bir elma lütfen!', tip: '"s\'il vous plaît" ifadesini melodik bağla.', emoji: '🍎' }
  ],
  '8-10': [
    { en: 'Puis-je emprunter ton vélo bleu?', tr: 'Mavi bisikletini ödünç alabilir miyim?', tip: '"Puis-je" kalıbı kibarca izin istemektir.', emoji: '🚲' }
  ],
  '11-13': [
    { en: 'À mon avis, l\'exploration spatiale est formidable!', tr: 'Bana göre uzay keşfi harika bir şey!', tip: '"À mon avis" fikrini belirtirken doğal tonlama yap.', emoji: '🚀' }
  ],
  '14-17': [
    { en: 'L\'innovation technologique transforme positivement notre société.', tr: 'Teknolojik inovasyon toplumumuzu olumlu yönde dönüştürüyor.', tip: '"société" ve "technologique" sözcüklerini net artiküle et.', emoji: '💡' }
  ]
};

export const FRENCH_TPR_SIMON_ACTIONS: Record<AgeGroup, {
  id: string;
  listenAudio: string;
  actionTr: string;
  replyEn: string;
  emoji: string;
}[]> = {
  '5-7': [
    { id: 'fr-tpr1', listenAudio: 'Chirmo dit: Tape des mains!', actionTr: 'Ellerini üç kez kuvvetlice çırp! 👏', replyEn: 'Bravo! Tu as bien tapé des mains!', emoji: '👏' },
    { id: 'fr-tpr2', listenAudio: 'Chirmo dit: Saute comme un lapin!', actionTr: 'Tavşan gibi iki kez yukarı zıpla! 🐰', replyEn: 'Super saut! Tu as sauté comme un vrai lapin!', emoji: '🐰' },
    { id: 'fr-tpr3', listenAudio: 'Chirmo dit: Fais un grand sourire!', actionTr: 'Kocaman ve aydınlık gülümse! 😊', replyEn: 'Quel sourire magnifique!', emoji: '😊' }
  ],
  '8-10': [
    { id: 'fr-tpr4', listenAudio: 'Chirmo dit: Marque un but au football!', actionTr: 'Görünmez bir topa şut çek ve gol sevinci yaşa! ⚽', replyEn: 'But sensationnel! Bravo champion!', emoji: '⚽' },
    { id: 'fr-tpr5', listenAudio: 'Chirmo dit: Regarde à travers le télescope!', actionTr: 'Ellerini dürbün yapıp gökyüzüne bak! 🔭', replyEn: 'Tu vois toutes les étoiles lointaines!', emoji: '🔭' }
  ],
  '11-13': [
    { id: 'fr-tpr6', listenAudio: 'Chirmo dit: Démarre le moteur de la fusée!', actionTr: '3-2-1 geri sayım yap ve kollarını roket gibi yukarı kaldır! 🚀', replyEn: 'Décollage réussi vers les confins de l\'espace!', emoji: '🚀' }
  ],
  '14-17': [
    { id: 'fr-tpr7', listenAudio: 'Chirmo dit: Présente ton projet avec assurance!', actionTr: 'Dik dur, göz teması kur ve güvenle konuş! 🎤', replyEn: 'Présentation captivante et persuasive!', emoji: '🎤' }
  ]
};

export const FRENCH_STORYBOOK_SCENES: Record<AgeGroup, {
  id: string;
  title: string;
  theme: string;
  bgGradient: string;
  items: { id: string; nameEn: string; nameTr: string; phraseEn: string; phraseTr: string; emoji: string }[];
}[]> = {
  '5-7': [
    {
      id: 'fr-forest',
      title: 'La Forêt Enchantée de Lingoria',
      theme: 'Doğa & Sevimli Hayvanlar',
      bgGradient: 'from-emerald-500/20 to-teal-500/30',
      items: [
        { id: 'it1', nameEn: 'Le Petit Oiseau', nameTr: 'Küçük Kuş', phraseEn: 'Le petit oiseau chante gaiement.', phraseTr: 'Küçük kuş neşeyle şarkı söyler.', emoji: '🐦' },
        { id: 'it2', nameEn: 'Le Grand Chêne', nameTr: 'Büyük Meşe Ağacı', phraseEn: 'Le grand chêne offre une ombre douce.', phraseTr: 'Büyük meşe tatlı bir gölge sunar.', emoji: '🌳' },
        { id: 'it3', nameEn: 'Le Champignon Rouge', nameTr: 'Kırmızı Mantar', phraseEn: 'Un joli champignon rouge pousse sous les feuilles.', phraseTr: 'Yaprakların altında sevimli kırmızı bir mantar büyür.', emoji: '🍄' }
      ]
    }
  ],
  '8-10': [
    {
      id: 'fr-space',
      title: 'Voyage dans la Station Spatiale',
      theme: 'Uzay & Bilim',
      bgGradient: 'from-indigo-600/20 to-purple-600/30',
      items: [
        { id: 'it4', nameEn: 'La Navette Spatiale', nameTr: 'Uzay Mekiği', phraseEn: 'La navette spatiale orbite autour de la Terre.', phraseTr: 'Uzay mekiği Dünya çevresinde yörüngede döner.', emoji: '🚀' },
        { id: 'it5', nameEn: 'Le Casque Astronaute', nameTr: 'Astronot Kaskı', phraseEn: "L'astronaute admire la beauté de la Terre bleue.", phraseTr: 'Astronot mavi Dünya’nın güzelliğini hayranlıkla izler.', emoji: '👨‍🚀' }
      ]
    }
  ],
  '11-13': [
    {
      id: 'fr-ocean',
      title: 'Les Mystères de l\'Océan Bleu',
      theme: 'Denizler & Çevre',
      bgGradient: 'from-cyan-600/20 to-blue-700/30',
      items: [
        { id: 'it6', nameEn: 'Le Grand Dauphin', nameTr: 'Yunus', phraseEn: 'Les dauphins nagent ensemble avec grâce.', phraseTr: 'Yunuslar zarafetle birlikte yüzer.', emoji: '🐬' },
        { id: 'it7', nameEn: 'Le Récif de Corail', nameTr: 'Mercan Resifi', phraseEn: 'Les récifs de corail abritent des milliers d\'espèces.', phraseTr: 'Mercan resifleri binlerce türe ev sahipliği yapar.', emoji: '🪸' }
      ]
    }
  ],
  '14-17': [
    {
      id: 'fr-future',
      title: 'La Cité Écologique du Futur',
      theme: 'Gelecek & İnovasyon',
      bgGradient: 'from-violet-600/20 to-fuchsia-600/30',
      items: [
        { id: 'it8', nameEn: 'Le Hub d\'Innovation', nameTr: 'İnovasyon Merkezi', phraseEn: 'Le hub réunit des esprits brillants du monde entier.', phraseTr: 'Merkez dünyanın dört bir yanından parlak zihinleri bir araya getirir.', emoji: '🏛️' },
        { id: 'it9', nameEn: "L'Arbre Solaire", nameTr: 'Güneş Ağacı', phraseEn: "L'arbre solaire génère de l'énergie propre pour toute la ville.", phraseTr: 'Güneş ağacı tüm şehir için temiz enerji üretir.', emoji: '⚡' }
      ]
    }
  ]
};

export const FRENCH_KIDS_SONGS: KidSongItem[] = [
  {
    id: 'fr-s1',
    title: 'Frère Jacques (Dormez-vous ?)',
    category: 'Mélodie Traditionnelle',
    duration: '1:50 Min',
    audioSample: 'Frère Jacques, Frère Jacques, dormez-vous? Sonnez les matines! Ding dang dong!',
    lyrics: [
      'Frère Jacques, Frère Jacques! 🔔',
      'Dormez-vous? Dormez-vous? 😴',
      'Sonnez les matines! Sonnez les matines! ⏰',
      'Ding, dang, dong! Ding, dang, dong! 🎶'
    ],
    grammarFocus: 'Fransızca soru kalıpları ve günlük ses uyumu.'
  },
  {
    id: 'fr-s2',
    title: 'Une Souris Verte',
    category: 'Comptine Amusante',
    duration: '2:10 Min',
    audioSample: 'Une souris verte qui courait dans l\'herbe, je l\'attrape par la queue!',
    lyrics: [
      'Une souris verte! 🐭',
      'Qui courait dans l\'herbe! 🌿',
      'Je l\'attrape par la queue! 🎈',
      'Je la montre à ces messieurs! 🎩'
    ],
    grammarFocus: 'Fransızca sıfat uyumu (souris verte) ve geçmiş ritmi.'
  },
  {
    id: 'fr-s3',
    title: "Sur le Pont d'Avignon",
    category: 'Danse & Fête',
    duration: '2:00 Min',
    audioSample: "Sur le pont d'Avignon, on y danse, on y danse! Sur le pont d'Avignon, on y danse tous en rond!",
    lyrics: [
      "Sur le pont d'Avignon! 🌉",
      "On y danse, on y danse! 💃",
      "Sur le pont d'Avignon! 🎶",
      "On y danse tous en rond! 🎈"
    ],
    grammarFocus: "Fransızca 'on y danse' kalıbı ve neşeli eylemler."
  }
];

export const FRENCH_SAFARI_ANIMALS = [
  {
    id: 'fr-an-lion',
    nameEn: 'Le Lion',
    nameTr: 'Cesur Aslan',
    emoji: '🦁',
    soundText: 'Roar! Je suis le lion courageux, roi de la savane!',
    funTr: 'Aslanlar safaride kükrer ve çok güçlüdür.'
  },
  {
    id: 'fr-an-elephant',
    nameEn: "L'Éléphant",
    nameTr: 'Sevimli Fil',
    emoji: '🐘',
    soundText: "Barr! Je suis un éléphant géant avec de grandes oreilles!",
    funTr: 'Filler hortumlarıyla su püskürtmeyi çok sever.'
  },
  {
    id: 'fr-an-monkey',
    nameEn: 'Le Singe',
    nameTr: 'Neşeli Maymun',
    emoji: '🐒',
    soundText: "Ouh ouh ah ah! J'adore les bananes jaunes et sauter d'arbre en arbre!",
    funTr: 'Maymunlar ağaçtan ağaca zıplar ve muz yer.'
  },
  {
    id: 'fr-an-dolphin',
    nameEn: 'Le Dauphin',
    nameTr: 'Akıllı Yunus',
    emoji: '🐬',
    soundText: "Plouf! Je nage à toute vitesse dans le bel océan bleu!",
    funTr: 'Yunuslar denizde taklalar atan çok zeki dostlardır.'
  }
];

export const FRENCH_MAGIC_COLORS = [
  {
    id: 'fr-c-red',
    nameEn: 'Rouge',
    nameTr: 'Kırmızı',
    bgClass: 'from-rose-500 to-red-600',
    textClass: 'text-rose-600',
    objectEn: 'La Pomme Rouge',
    objectTr: 'Kırmızı Elma',
    emoji: '🍎',
    sample: "J'adore les pommes rouges et sucrées!"
  },
  {
    id: 'fr-c-blue',
    nameEn: 'Bleu',
    nameTr: 'Mavi',
    bgClass: 'from-blue-500 to-indigo-600',
    textClass: 'text-blue-600',
    objectEn: 'La Fusée Bleue',
    objectTr: 'Mavi Roket',
    emoji: '🚀',
    sample: 'La fusée bleue décolle vers le ciel étoilé!'
  },
  {
    id: 'fr-c-yellow',
    nameEn: 'Jaune',
    nameTr: 'Sarı',
    bgClass: 'from-amber-400 to-yellow-500',
    textClass: 'text-amber-600',
    objectEn: 'Le Soleil Jaune',
    objectTr: 'Sarı Güneş',
    emoji: '☀️',
    sample: 'Le soleil jaune brille avec douceur!'
  },
  {
    id: 'fr-c-green',
    nameEn: 'Vert',
    nameTr: 'Yeşil',
    bgClass: 'from-emerald-500 to-green-600',
    textClass: 'text-emerald-600',
    objectEn: 'La Grenouille Verte',
    objectTr: 'Yeşil Kurbağa',
    emoji: '🐸',
    sample: 'La grenouille verte saute très haut!'
  },
  {
    id: 'fr-c-purple',
    nameEn: 'Violet',
    nameTr: 'Mor',
    bgClass: 'from-purple-500 to-indigo-600',
    textClass: 'text-purple-600',
    objectEn: 'Le Raisin Violet',
    objectTr: 'Mor Üzümler',
    emoji: '🍇',
    sample: 'Les raisins violets sont délicieux et sucrés!'
  },
  {
    id: 'fr-c-orange',
    nameEn: 'Orange',
    nameTr: 'Turuncu',
    bgClass: 'from-orange-400 to-amber-500',
    textClass: 'text-orange-600',
    objectEn: 'Le Tigre Orange',
    objectTr: 'Turuncu Kaplan',
    emoji: '🐯',
    sample: 'Le tigre orange court avec agilité!'
  }
];

export const FRENCH_KIDS_CHAT_STEPS: Record<AgeGroup, {
  id: string;
  chirmoEn: string;
  chirmoTr: string;
  options: { textEn: string; textTr: string; emoji: string; replyEn: string }[];
}[]> = {
  '5-7': [
    {
      id: 'fr-kc-1',
      chirmoEn: 'Bonjour petite superstar! 🌟 Quel est ton animal préféré?',
      chirmoTr: 'Merhaba minik süperstar! En sevdiğin hayvan hangisi?',
      options: [
        { textEn: "J'adore les chats!", textTr: 'Kedileri severim! 🐱', emoji: '🐱', replyEn: 'Miaou! Les chats sont si doux et affectueux!' },
        { textEn: "J'adore les chiens!", textTr: 'Köpekleri severim! 🐶', emoji: '🐶', replyEn: 'Ouaf ouaf! Les chiens sont les amis les plus fidèles!' },
        { textEn: "J'adore les lions!", textTr: 'Aslanları severim! 🦁', emoji: '🦁', replyEn: 'Roar! Tu es aussi courageux qu\'un grand lion!' }
      ]
    },
    {
      id: 'fr-kc-2',
      chirmoEn: 'Miam! Qu\'aimerais-tu manger maintenant? 🍦',
      chirmoTr: 'Nefis! Canın şu an ne yemek istiyor?',
      options: [
        { textEn: 'Je voudrais une glace au chocolat!', textTr: 'Çikolatalı dondurma istiyorum! 🍦', emoji: '🍦', replyEn: 'La glace est un pur délice par une belle journée!' },
        { textEn: 'Je voudrais une pizza chaude!', textTr: 'Sıcak pizza istiyorum! 🍕', emoji: '🍕', replyEn: 'Mmh! Une bonne pizza chaude, c\'est délicieux!' },
        { textEn: 'Je voudrais une pomme sucrée!', textTr: 'Tatlı kırmızı elma istiyorum! 🍎', emoji: '🍎', replyEn: 'Excellent pour la santé! Les fruits donnent une énergie formidable!' }
      ]
    }
  ],
  '8-10': [
    {
      id: 'fr-kc-3',
      chirmoEn: 'Salut champion! Quel est ton loisir préféré après l\'école?',
      chirmoTr: 'Selam şampiyon! Okuldan sonra en sevdiğin aktivite nedir?',
      options: [
        { textEn: 'Jouer au football avec mes amis!', textTr: 'Arkadaşlarımla futbol oynamak! ⚽', emoji: '⚽', replyEn: 'Le sport collectif développe la forme et l\'esprit d\'équipe!' },
        { textEn: 'Lire des livres d\'aventure passionnants!', textTr: 'Macera kitapları okumak! 📚', emoji: '📚', replyEn: 'Les histoires captivantes ouvrent les portes de l\'imagination!' }
      ]
    }
  ],
  '11-13': [
    {
      id: 'fr-kc-4',
      chirmoEn: 'Bonjour! Si tu pouvais voyager n\'importe où, où irais-tu?',
      chirmoTr: 'Merhaba! İstediğin yere seyahat edebilseydin nereye giderdin?',
      options: [
        { textEn: 'Visiter Paris et monter au sommet de la Tour Eiffel!', textTr: "Paris'e gidip Eyfel Kulesi'ne çıkmak! 🗼", emoji: '🗼', replyEn: 'Paris est une ville magique d\'art, de culture et d\'histoire!' },
        { textEn: 'Explorer les profondeurs de l\'espace!', textTr: 'Uzayın derinliklerini keşfetmek! 🪐', emoji: '🪐', replyEn: 'Les mystères de l\'univers attendent les futurs scientifiques!' }
      ]
    }
  ],
  '14-17': [
    {
      id: 'fr-kc-5',
      chirmoEn: 'Bonjour! Quel domaine technologique te passionne le plus pour l\'avenir?',
      chirmoTr: 'Merhaba! Gelecek için en çok hangi teknoloji alanı ilgini çekiyor?',
      options: [
        { textEn: "L'intelligence artificielle et la science des données!", textTr: 'Yapay zeka ve veri bilimi! 🤖', emoji: '🤖', replyEn: "C'est un domaine révolutionnaire qui redéfinit chaque secteur!" },
        { textEn: "Les énergies renouvelables et l'écologie durable!", textTr: 'Yenilenebilir enerji ve sürdürülebilirlik! 🌿', emoji: '🌿', replyEn: "Bâtir un monde vert et durable est le défi majeur de notre siècle!" }
      ]
    }
  ]
};

export const FRENCH_FACTORY_OPTIONS: Record<AgeGroup, {
  subjects: string[];
  actions: string[];
  objects: string[];
  contexts: string[];
}> = {
  '5-7': {
    subjects: ['Mon chien amical', 'Le robot intelligent', 'Le petit lapin', 'Mon meilleur ami', 'Un astronaute courageux'],
    actions: ['joue volontiers avec', 'adore manger', 'souhaite découvrir', 'regarde joyeusement', 'danse en rythme avec'],
    objects: ['un ballon coloré', 'une pomme sucrée', 'un magnifique arc-en-ciel', 'une fusée rapide', 'un délicieux biscuit'],
    contexts: ['dans le parc ensoleillé', 'chaque beau matin', 'sous le grand arbre vert', 'dans la chambre douillette', 'avec un large sourire']
  },
  '8-10': {
    subjects: ["L'équipe de football de l'école", 'La jeune étudiante curieuse', 'Mon professeur créatif', 'Un musicien plein de talent', 'Le jeune programmeur'],
    actions: ["s'entraîne chaque jour pour", 'a remporté un trophée d\'or pour', 'partage des idées brillantes sur', 'développe un beau projet avec', 'a marqué un but spectaculaire dans'],
    objects: ['le grand match de finale', 'un nouveau télescope astronomique', 'le salon des sciences scolaires', 'une chanson entraînante', 'le tournoi de robotique'],
    contexts: ['au centre sportif municipal', 'pendant la récréation', 'avec un grand enthousiasme', 'devant toute l\'école', 'chaque samedi après-midi']
  },
  '11-13': {
    subjects: ['Le club des jeunes chercheurs', 'Notre correspondant international', "L'équipe environnementale", 'Une jeune inventrice géniale', 'Mon partenaire de débat'],
    actions: ['mène des recherches sur', 'encourage l\'exploration de', 'organise un événement sur', 'a conçu un modèle pour', 'propose des solutions pour'],
    objects: ["l'énergie propre et durable", "la protection des océans", "les applications éducatives interactives", "les systèmes de navigation spatiale", "les ressources documentaires modernes"],
    contexts: ['à la conférence scientifique', 'sur les plateformes numériques', 'avec des mentors passionnés', 'dans plusieurs capitales européennes', 'avec une grande détermination']
  },
  '14-17': {
    subjects: ['De jeunes pionniers en technologie', "L'équipe de débat du lycée", 'Les futurs concepteurs de logiciels', 'Les défenseurs du climat', 'Des créateurs de contenu inspirants'],
    actions: ['s\'investissent activement dans', 'présentent avec clarté', 'analysent avec rigueur', 'conçoivent des solutions pour', 'captivent le public international avec'],
    objects: ["l'éthique de l'intelligence artificielle", "l'architecture web de demain", "l'égalité éducative mondiale", "les écosystèmes urbains durables", "l'éloquence linguistique interculturelle"],
    contexts: ['lors de hackathons mondiaux', 'au cours de sommets internationaux', 'pour valoriser les communautés locales', 'par le biais de médias numériques', 'avec un impact durable et mesurable']
  }
};

export const FRENCH_AGE_SPEAKING_CHALLENGES: Record<AgeGroup, {
  title: string;
  en: string;
  tr: string;
  tips: string;
  topic: string;
  level: string;
}> = {
  '5-7': {
    title: 'Premières Phrases & Souhaits Gentils (İlk Cümlelerim & Sevimli İstekler)',
    en: 'Bonjour Chirmo! Je voudrais une pomme rouge, s\'il vous plaît!',
    tr: 'Merhaba Chirmo! Kırmızı bir elma istiyorum lütfen!',
    tips: 'Kelimeleri tane tane ve gülümseyerek söyle: "pomme rouge, s\'il vous plaît".',
    topic: 'Nezaket & İstek',
    level: 'Pre-A1'
  },
  '8-10': {
    title: 'Vie Scolaire & Esprit d\'Équipe (Okul Hayatı & Arkadaşça İş Birliği)',
    en: 'Puis-je emprunter ton crayon? Nous préparons l\'exposition de sciences!',
    tr: 'Kurşun kalemini ödünç alabilir miyim? Okul fen sergisi için hazırlanıyoruz!',
    tips: '"Puis-je emprunter" kalıbını akıcı ve melodik bağla.',
    topic: 'İzin İsteme & Takım Çalışması',
    level: 'A1+'
  },
  '11-13': {
    title: 'Curiosité, Science & Opinion Personnelle (Merak, Bilim & Fikir Belirtme)',
    en: 'À mon avis, l\'exploration spatiale et les énergies renouvelables façonneront notre avenir!',
    tr: 'Bana göre uzay keşfi ve yenilenebilir enerji geleceğimizi şekillendirecek!',
    tips: '"À mon avis" kalıbını kendine güvenen net bir tonla telaffuz et.',
    topic: 'Fikir Paylaşımı & Bilim',
    level: 'A2'
  },
  '14-17': {
    title: 'Débat International & Innovation (Küresel Münazara & İnovasyon)',
    en: 'Selon moi, l\'intelligence artificielle et la coopération internationale permettent de surmonter les défis mondiaux.',
    tr: 'Benim bakış açıma göre, yapay zekâ ve uluslararası iş birliği küresel sorunları çözmemizi güçlendiriyor.',
    tips: '"Selon moi" ve "coopération internationale" sözcüklerine doğal vurgu ver.',
    topic: 'Akıcı Münazara & Liderlik',
    level: 'B1 / B2'
  }
};

export const FRENCH_PATTERN_OPTIONS: Record<AgeGroup, {
  prefixes: string[];
  objects: string[];
  suffixes: string[];
}> = {
  '5-7': {
    prefixes: ['Je voudrais', 'Puis-je avoir', "J'aime", 'Où est', 'Je peux'],
    objects: ["de l'eau", 'une pomme', 'un vélo', 'du lait', 'mon sac à dos', 'jouer'],
    suffixes: ["s'il vous plaît", "aujourd'hui", 'maintenant', 'ensemble', 'avec mes amis']
  },
  '8-10': {
    prefixes: ['Veux-tu', "J'aimerais bien", 'Pouvons-nous pratiquer', 'Découvrons ensemble', 'Pourquoi aimes-tu'],
    objects: ['le football avec l\'équipe', 'de nouvelles expériences', 'lire des bandes dessinées', 'peindre de belles affiches', 'résoudre des énigmes'],
    suffixes: ['après les cours', 'ce week-end', 'avec grand plaisir', 'chaque jour', 'ensemble au parc']
  },
  '11-13': {
    prefixes: ['Nous planifions', 'Il est important de', 'As-tu envie de', "Je m'intéresse à", 'Ensemble nous pouvons'],
    objects: ["l'énergie propre", "les mystères des planètes", "de nouvelles applications mobiles", "des livres captivants", "des projets internationaux"],
    suffixes: ['en cours de sciences', 'dans notre futur', 'avec notre groupe de recherche', 'étape par étape', 'avec une grande curiosité']
  },
  '14-17': {
    prefixes: ['De mon point de vue, nous devrions', 'Il est essentiel de', 'Je préconise de', 'Analysons comment', 'Nous avons la responsabilité de'],
    objects: ["l'éthique de l'intelligence artificielle", "les plateformes numériques innovantes", "le développement urbain durable", "l'égalité éducative mondiale", "des solutions créatives"],
    suffixes: ['dans les conférences internationales', 'pour une société plus juste', 'sur une base scientifique rigoureuse', 'avec une portée planétaire', 'grâce à une coopération active']
  }
};
