import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Heart,
  Star,
  Trophy,
  ShieldCheck,
  Music,
  Smile,
  BookOpen,
  Gamepad2,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { AnalyticsService } from '../../services/analyticsService';

type AgeGroup = '5-7' | '8-10' | '11-13' | '14-17';

interface KidCard {
  id: string;
  en: string;
  tr: string;
  emoji: string;
  soundText: string;
  funFact: string;
}

export interface ChirmoKidsDedicatedHubProps {
  onBackToMain?: () => void;
}

export const ChirmoKidsDedicatedHub: React.FC<ChirmoKidsDedicatedHubProps> = ({ onBackToMain }) => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('5-7');
  const [activeTab, setActiveTab] = useState<'cards' | 'songs' | 'parent'>('cards');
  const [stars, setStars] = useState(12);
  const [parentUnlocked, setParentUnlocked] = useState(false);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleRewardStar = () => {
    setStars((prev) => prev + 1);
    AnalyticsService.logGamePlayed(20);
  };

  // Yaş gruplarına özel eğlenceli kelime ve görsel havuzu
  const ageContent: Record<AgeGroup, KidCard[]> = {
    '5-7': [
      { id: 'k1', en: 'Cat', tr: 'Kedi', emoji: '🐱', soundText: 'Cat says meow!', funFact: 'Kediler günde 16 saat uyur!' },
      { id: 'k2', en: 'Dog', tr: 'Köpek', emoji: '🐶', soundText: 'Dog says woof woof!', funFact: 'Köpekler harika dostlardır!' },
      { id: 'k3', en: 'Lion', tr: 'Aslan', emoji: '🦁', soundText: 'Lion roars loud!', funFact: 'Ormanların kralı!' },
      { id: 'k4', en: 'Apple', tr: 'Kırmızı Elma', emoji: '🍎', soundText: 'Crispy red apple', funFact: 'Günde bir elma enerji verir!' },
      { id: 'k5', en: 'Sun', tr: 'Güneş', emoji: '☀️', soundText: 'Bright sunny day', funFact: 'Güneş bize ışık ve neşe saçar!' },
      { id: 'k6', en: 'Ice cream', tr: 'Dondurma', emoji: '🍦', soundText: 'Sweet cold ice cream', funFact: 'En lezzetli yaz tatlısı!' }
    ],
    '8-10': [
      { id: 'k7', en: 'Bicycle', tr: 'Bisiklet', emoji: '🚲', soundText: 'I can ride my bicycle', funFact: 'Tekerlekler döner, rüzgar eser!' },
      { id: 'k8', en: 'Space Rocket', tr: 'Uzay Roketi', emoji: '🚀', soundText: '3, 2, 1, blast off to space!', funFact: 'Yıldızlara seyahat!' },
      { id: 'k9', en: 'Guitar', tr: 'Gitar', emoji: '🎸', soundText: 'Play a happy song on guitar', funFact: 'Müzik zihnimizi açar!' },
      { id: 'k10', en: 'Rainbow', tr: 'Gökkuşağı', emoji: '🌈', soundText: 'Seven beautiful colors in rainbow', funFact: 'Yağmurdan sonra güneşte çıkar!' }
    ],
    '11-13': [
      { id: 'k11', en: 'Adventure', tr: 'Macera', emoji: '🗺️', soundText: 'We are going on a big adventure', funFact: 'Yeni yerler keşfetmek çok heyecanlı!' },
      { id: 'k12', en: 'Best friend', tr: 'En yakın arkadaş', emoji: '👫', soundText: 'You are my best friend forever', funFact: 'Arkadaşlık her şeyden değerlidir.' },
      { id: 'k13', en: 'Science project', tr: 'Fen deneyi / projesi', emoji: '🔬', soundText: 'Let\'s do a fun science experiment', funFact: 'Bilim dünyayı anlamamızı sağlar!' }
    ],
    '14-17': [
      { id: 'k14', en: 'Social vibe', tr: 'Sosyal enerji / ortam', emoji: '✨', soundText: 'I love this good positive vibe', funFact: 'Gençler arasında sık kullanılan popüler bir ifade.' },
      { id: 'k15', en: 'Soundtrack', tr: 'Müzik listesi / Film müziği', emoji: '🎧', soundText: 'This is the soundtrack of my life', funFact: 'Müzik İngilizceyi doğal edindirir.' },
      { id: 'k16', en: 'Teamwork', tr: 'Takım çalışması', emoji: '🏆', soundText: 'Great teamwork brings success', funFact: 'Geleceğin en önemli yetkinliği.' }
    ]
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-amber-50/60 via-purple-50/40 to-pink-50/60 dark:from-slate-950 dark:to-slate-900 overflow-y-auto p-4 sm:p-6 pb-28 select-none">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* ==================== ÇOCUKLAR İÇİN ŞENLİKLİ RENKLİ BAŞLIK ==================== */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider">
              <span>🎈 Chirmo Kids Eğlence Kulübü</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Eğlen, Oyna ve İngilizce Konuş! 🌟
            </h1>
            <p className="text-xs sm:text-sm text-amber-100">
              Sıkıcı dersler yok! Resimlerle, şarkılarla ve Chirmo ile dil öğrenmek çocuk oyuncağı.
            </p>
          </div>

          {/* Kazanılan Yıldızlar & Geri Dönüş */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-black transition-all flex items-center space-x-1 cursor-pointer border border-white/20 shadow-xs"
                title="Ana Ekrana Dön"
              >
                <span>← Ana Stüdyo</span>
              </button>
            )}
            <div className="flex items-center space-x-2 bg-black/20 p-2.5 px-4 rounded-2xl backdrop-blur-xs border border-white/20">
              <Star className="w-6 h-6 text-amber-300 fill-amber-300 animate-bounce" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-200">Yıldızlarım</div>
                <div className="text-lg font-black text-white">{stars} Yıldız</div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== YAŞ GRUBU SEÇİMİ (4 YAŞ KADEMESİ) ==================== */}
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-around gap-1">
          {[
            { id: '5-7' as AgeGroup, title: '5-7 Yaş', emoji: '🧸', sub: 'Ses & Oyun' },
            { id: '8-10' as AgeGroup, title: '8-10 Yaş', emoji: '🎨', sub: 'Kelime & Resim' },
            { id: '11-13' as AgeGroup, title: '11-13 Yaş', emoji: '📚', sub: 'Diyalog & Okul' },
            { id: '14-17' as AgeGroup, title: '14-17 Yaş', emoji: '🎧', sub: 'Gençler & Sosyal' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedAge(item.id)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                selectedAge === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black shadow-md scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
              }`}
            >
              <div className="text-base sm:text-lg">{item.emoji}</div>
              <div className="text-xs sm:text-sm font-black">{item.title}</div>
              <div className="text-[10px] opacity-80 hidden sm:block">{item.sub}</div>
            </button>
          ))}
        </div>

        {/* ==================== İÇERİK SEKMELERİ (GÖRSEL KARTLAR / ŞARKILAR / VELİ ALANI) ==================== */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'cards'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>Görsel Kelimeler & Sesler</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('songs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'songs'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Şarkılar & Masallar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('parent')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'parent'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Veli Bilgi Alanı</span>
          </button>
        </div>

        {/* TAB 1: GÖRSEL KELİME KARTLARI */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ageContent[selectedAge].map((card) => (
              <div
                key={card.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-3 group hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl group-hover:scale-125 transition-transform">{card.emoji}</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleSpeak(card.en);
                      handleRewardStar();
                    }}
                    className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                    title="Sesli Dinle"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {card.en}
                  </div>
                  <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mt-0.5">
                    {card.tr}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  🌟 {card.funFact}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSpeak(card.soundText);
                    handleRewardStar();
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>Cümleyi Dinle & Tekrar Et! 🎤</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ŞARKILAR VE MASALLAR */}
        {activeTab === 'songs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'ABC & Phonics Song',
                desc: 'Harflerin ve seslerin eğlenceli şarkısı.',
                duration: '2 dk',
                lyrics: 'A is for Apple, B is for Ball, C is for Cat...',
                badge: 'Harfler'
              },
              {
                title: 'Colors Everywhere',
                desc: 'Kırmızı, mavi, sarı ve yeşili şarkıyla söyle.',
                duration: '3 dk',
                lyrics: 'Red, yellow, green and blue! I see colors, how about you?',
                badge: 'Renkler'
              },
              {
                title: 'Old MacDonald Had a Farm',
                desc: 'Hayvan seslerini tanı ve İngilizce tekrar et.',
                duration: '3 dk',
                lyrics: 'And on that farm he had a cow, E-I-E-I-O!',
                badge: 'Hayvanlar'
              },
              {
                title: 'Five Little Monkeys',
                desc: 'Sayıları ve zıplamayı öğreten klasik çocuk şarkısı.',
                duration: '2 dk',
                lyrics: 'Five little monkeys jumping on the bed...',
                badge: 'Sayılar'
              }
            ].map((song, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black uppercase">
                    {song.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{song.duration}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    {song.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{song.desc}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs italic text-indigo-700 dark:text-indigo-300">
                  "{song.lyrics}"
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSpeak(song.lyrics);
                    handleRewardStar();
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Music className="w-4 h-4" />
                  <span>Şarkıyı Dinle (+1 Yıldız)</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: VELİ VE EBEVEYN BİLGİ ALANI */}
        {activeTab === 'parent' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Chirmo Kids Ebeveyn Güvenlik & Gelişim Raporu
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  Güvenlik Durumu
                </div>
                <div className="text-sm font-black text-emerald-950 dark:text-emerald-100 mt-1">
                  🛡️ %100 Güvenli & Reklamsız
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Harici link veya uygunsuz içerik barındırmaz.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                  Toplam Yıldız
                </div>
                <div className="text-sm font-black text-amber-950 dark:text-amber-100 mt-1">
                  ⭐ {stars} Yıldız Kazanıldı
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Tamamlanan oyun ve sesli telaffuzlarla kazanıldı.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">
                  Pedagojik Öneri
                </div>
                <div className="text-sm font-black text-purple-950 dark:text-purple-100 mt-1">
                  Günde 10-15 Dakika
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Aşırı ekran süresi yerine kısa ve eğlenceli seanslar önerilir.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              💡 <strong>Ebeveyn Notu:</strong> Çocuklar hata yaptıklarında düzeltmek yerine doğru telaffuzu Chirmo ile birlikte seslendirin. İngilizceyi bir sınav dersi değil, eğlenceli bir hayat becerisi olarak görmeleri en önemli başarı anahtarıdır.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
