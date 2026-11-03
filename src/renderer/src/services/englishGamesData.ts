// Chirmo English Game Arcade Data & Sound Engine
// Hem çocuklar hem de yetişkinler için oyunlaştırılmış İngilizce öğrenim veri seti ve ses motoru

export interface GameWordItem {
  id: string;
  en: string;
  tr: string;
  emoji: string;
  category: string;
  hint?: string;
}

export interface GameSentenceItem {
  id: string;
  en: string;
  tr: string;
  scrambledWords: string[];
  emoji: string;
  audience: 'kids' | 'adults';
}

export interface VoiceChallengeItem {
  id: string;
  en: string;
  tr: string;
  pronounceTip: string;
  emoji: string;
  audience: 'kids' | 'adults';
}

// 🎈 ÇOCUKLAR İÇİN KELİME HAVUZU (Renkli, Görsel Emojili, Temel)
export const KIDS_GAME_VOCAB: GameWordItem[] = [
  // Hayvanlar
  { id: 'k1', en: 'Cat', tr: 'Kedi', emoji: '🐱', category: 'Hayvanlar' },
  { id: 'k2', en: 'Dog', tr: 'Köpek', emoji: '🐶', category: 'Hayvanlar' },
  { id: 'k3', en: 'Lion', tr: 'Aslan', emoji: '🦁', category: 'Hayvanlar' },
  { id: 'k4', en: 'Monkey', tr: 'Maymun', emoji: '🐵', category: 'Hayvanlar' },
  { id: 'k5', en: 'Bird', tr: 'Kuş', emoji: '🐦', category: 'Hayvanlar' },
  { id: 'k6', en: 'Fish', tr: 'Balık', emoji: '🐟', category: 'Hayvanlar' },
  { id: 'k7', en: 'Rabbit', tr: 'Tavşan', emoji: '🐰', category: 'Hayvanlar' },
  { id: 'k8', en: 'Elephant', tr: 'Fil', emoji: '🐘', category: 'Hayvanlar' },

  // Renkler
  { id: 'k9', en: 'Red', tr: 'Kırmızı', emoji: '🔴', category: 'Renkler' },
  { id: 'k10', en: 'Blue', tr: 'Mavi', emoji: '🔵', category: 'Renkler' },
  { id: 'k11', en: 'Green', tr: 'Yeşil', emoji: '🟢', category: 'Renkler' },
  { id: 'k12', en: 'Yellow', tr: 'Sarı', emoji: '🟡', category: 'Renkler' },
  { id: 'k13', en: 'Orange', tr: 'Turuncu', emoji: '🟠', category: 'Renkler' },
  { id: 'k14', en: 'Purple', tr: 'Mor', emoji: '🟣', category: 'Renkler' },

  // Yiyecekler & İçecekler
  { id: 'k15', en: 'Apple', tr: 'Elma', emoji: '🍎', category: 'Yiyecekler' },
  { id: 'k16', en: 'Banana', tr: 'Muz', emoji: '🍌', category: 'Yiyecekler' },
  { id: 'k17', en: 'Ice cream', tr: 'Dondurma', emoji: '🍦', category: 'Yiyecekler' },
  { id: 'k18', en: 'Milk', tr: 'Süt', emoji: '🥛', category: 'Yiyecekler' },
  { id: 'k19', en: 'Pizza', tr: 'Pizza', emoji: '🍕', category: 'Yiyecekler' },
  { id: 'k20', en: 'Watermelon', tr: 'Karpuz', emoji: '🍉', category: 'Yiyecekler' },

  // Okul & Oyuncaklar
  { id: 'k21', en: 'Book', tr: 'Kitap', emoji: '📚', category: 'Okul & Oyun' },
  { id: 'k22', en: 'Pencil', tr: 'Kurşun Kalem', emoji: '✏️', category: 'Okul & Oyun' },
  { id: 'k23', en: 'Ball', tr: 'Top', emoji: '⚽', category: 'Okul & Oyun' },
  { id: 'k24', en: 'Bicycle', tr: 'Bisiklet', emoji: '🚲', category: 'Okul & Oyun' },
  { id: 'k25', en: 'Guitar', tr: 'Gitar', emoji: '🎸', category: 'Okul & Oyun' },
  { id: 'k26', en: 'Star', tr: 'Yıldız', emoji: '⭐', category: 'Doğa & Ev' },

  // Eylemler
  { id: 'k27', en: 'Run', tr: 'Koşmak', emoji: '🏃', category: 'Eylemler' },
  { id: 'k28', en: 'Jump', tr: 'Zıplamak', emoji: '🦘', category: 'Eylemler' },
  { id: 'k29', en: 'Sleep', tr: 'Uyumak', emoji: '😴', category: 'Eylemler' },
  { id: 'k30', en: 'Dance', tr: 'Dans etmek', emoji: '💃', category: 'Eylemler' }
];

// 🎯 YETİŞKİNLER İÇİN KELİME HAVUZU (Pratik Yaşam, Seyahat, İş, Kafe)
export const ADULT_GAME_VOCAB: GameWordItem[] = [
  // Seyahat & Ulaşım
  { id: 'a1', en: 'Passport', tr: 'Pasaport', emoji: '🛂', category: 'Seyahat' },
  { id: 'a2', en: 'Boarding pass', tr: 'Biniş kartı', emoji: '🎫', category: 'Seyahat' },
  { id: 'a3', en: 'Luggage', tr: 'Valiz / Bagaj', emoji: '🧳', category: 'Seyahat' },
  { id: 'a4', en: 'Flight', tr: 'Uçuş', emoji: '✈️', category: 'Seyahat' },
  { id: 'a5', en: 'Subway station', tr: 'Metro istasyonu', emoji: '🚇', category: 'Seyahat' },
  { id: 'a6', en: 'Reservation', tr: 'Rezervasyon', emoji: '🏨', category: 'Seyahat' },

  // Restoran & Kafe
  { id: 'a7', en: 'The bill', tr: 'Hesap / Adisyon', emoji: '🧾', category: 'Restoran' },
  { id: 'a8', en: 'Receipt', tr: 'Fiş / Makbuz', emoji: '📄', category: 'Restoran' },
  { id: 'a9', en: 'Menu', tr: 'Menü', emoji: '📋', category: 'Restoran' },
  { id: 'a10', en: 'Delicious', tr: 'Çok lezzetli', emoji: '😋', category: 'Restoran' },
  { id: 'a11', en: 'Tip', tr: 'Bahşiş', emoji: '💵', category: 'Restoran' },
  { id: 'a12', en: 'Water', tr: 'Su', emoji: '💧', category: 'Restoran' },

  // İş & Teknoloji
  { id: 'a13', en: 'Deadline', tr: 'Son teslim tarihi', emoji: '⏰', category: 'İş & Kariyer' },
  { id: 'a14', en: 'Meeting', tr: 'Toplantı', emoji: '💼', category: 'İş & Kariyer' },
  { id: 'a15', en: 'Agreement', tr: 'Anlaşma / Sözleşme', emoji: '🤝', category: 'İş & Kariyer' },
  { id: 'a16', en: 'Salary', tr: 'Maaş', emoji: '💰', category: 'İş & Kariyer' },
  { id: 'a17', en: 'Feedback', tr: 'Geri bildirim', emoji: '💬', category: 'İş & Kariyer' },
  { id: 'a18', en: 'Opportunity', tr: 'Fırsat', emoji: '🌟', category: 'İş & Kariyer' },

  // Günlük Yaşam & Refleksler
  { id: 'a19', en: 'Excuse me', tr: 'Afedersiniz / Baksanıza', emoji: '🙋', category: 'Günlük Refleks' },
  { id: 'a20', en: 'Take care', tr: 'Kendine iyi bak', emoji: '👋', category: 'Günlük Refleks' },
  { id: 'a21', en: 'Never mind', tr: 'Boşver / Önemli değil', emoji: '🤷', category: 'Günlük Refleks' },
  { id: 'a22', en: 'Of course', tr: 'Tabii ki / Elbette', emoji: '👌', category: 'Günlük Refleks' },
  { id: 'a23', en: 'Actually', tr: 'Aslında / Gerçekte', emoji: '💡', category: 'Günlük Refleks' },
  { id: 'a24', en: 'Look for', tr: 'Aramak (bir şeyi)', emoji: '🔍', category: 'Kalıplar' },
  { id: 'a25', en: 'Give up', tr: 'Pes etmek / Vazgeçmek', emoji: '🚫', category: 'Kalıplar' },
  { id: 'a26', en: 'Find out', tr: 'Öğrenmek / Keşfetmek', emoji: '🔎', category: 'Kalıplar' }
];

// 🚀 CÜMLE ROKETİ BULMACALARI
export const GAME_SENTENCE_PUZZLES: GameSentenceItem[] = [
  // Çocuklar İçin
  {
    id: 'sp_k1',
    en: 'The cat is sleeping',
    tr: 'Kedi uyuyor',
    scrambledWords: ['sleeping', 'The', 'cat', 'is'],
    emoji: '🐱',
    audience: 'kids'
  },
  {
    id: 'sp_k2',
    en: 'I love ice cream',
    tr: 'Dondurmayı çok severim',
    scrambledWords: ['cream', 'love', 'I', 'ice'],
    emoji: '🍦',
    audience: 'kids'
  },
  {
    id: 'sp_k3',
    en: 'This is a red ball',
    tr: 'Bu kırmızı bir toptur',
    scrambledWords: ['a', 'This', 'ball', 'is', 'red'],
    emoji: '⚽',
    audience: 'kids'
  },
  {
    id: 'sp_k4',
    en: 'Can you ride a bike',
    tr: 'Bisiklet sürebilir misin?',
    scrambledWords: ['ride', 'bike', 'Can', 'a', 'you'],
    emoji: '🚲',
    audience: 'kids'
  },
  {
    id: 'sp_k5',
    en: 'We are very happy today',
    tr: 'Biz bugün çok mutluyuz',
    scrambledWords: ['today', 'very', 'We', 'are', 'happy'],
    emoji: '🎉',
    audience: 'kids'
  },

  // Yetişkinler İçin
  {
    id: 'sp_a1',
    en: 'Could I have the bill please',
    tr: 'Hesabı alabilir miyim lütfen?',
    scrambledWords: ['bill', 'Could', 'the', 'I', 'have', 'please'],
    emoji: '🧾',
    audience: 'adults'
  },
  {
    id: 'sp_a2',
    en: 'Where is the nearest subway station',
    tr: 'En yakın metro istasyonu nerede?',
    scrambledWords: ['station', 'Where', 'nearest', 'is', 'subway', 'the'],
    emoji: '🚇',
    audience: 'adults'
  },
  {
    id: 'sp_a3',
    en: 'I would like to make a reservation',
    tr: 'Rezervasyon yaptırmak istiyorum',
    scrambledWords: ['to', 'like', 'a', 'would', 'I', 'make', 'reservation'],
    emoji: '🏨',
    audience: 'adults'
  },
  {
    id: 'sp_a4',
    en: 'How much does this cost',
    tr: 'Bunun fiyatı ne kadar?',
    scrambledWords: ['does', 'How', 'cost', 'much', 'this'],
    emoji: '🏷️',
    audience: 'adults'
  },
  {
    id: 'sp_a5',
    en: 'Nice meeting you have a nice day',
    tr: 'Tanıştığımıza memnun oldum, iyi günler dilerim',
    scrambledWords: ['a', 'Nice', 'day', 'you', 'meeting', 'nice', 'have'],
    emoji: '🤝',
    audience: 'adults'
  }
];

// 🎙️ SESLİ TELAFUZ VE KONUŞMA MEYDAN OKUMALARI
export const GAME_VOICE_CHALLENGES: VoiceChallengeItem[] = [
  // Çocuklar
  {
    id: 'vc_k1',
    en: 'Good morning my friend',
    tr: 'Günaydın arkadaşım!',
    pronounceTip: '"Gud morning may frend" gibi akıcı oku.',
    emoji: '☀️',
    audience: 'kids'
  },
  {
    id: 'vc_k2',
    en: 'I want an apple please',
    tr: 'Bir elma istiyorum lütfen.',
    pronounceTip: '"Ay want en epıl pliiz"',
    emoji: '🍎',
    audience: 'kids'
  },
  {
    id: 'vc_k3',
    en: 'Look at the cute puppy',
    tr: 'Şu sevimli yavru köpeğe bak!',
    pronounceTip: '"Luk et dı kyuut papi"',
    emoji: '🐶',
    audience: 'kids'
  },

  // Yetişkinler
  {
    id: 'vc_a1',
    en: 'Excuse me where can I find a taxi',
    tr: 'Afedersiniz, nereden taksi bulabilirim?',
    pronounceTip: '"Ekskyuuz mi, wer ken ay faynd e teksi?"',
    emoji: '🚕',
    audience: 'adults'
  },
  {
    id: 'vc_a2',
    en: 'Can you help me with this form',
    tr: 'Bu form konusunda bana yardımcı olabilir misiniz?',
    pronounceTip: '"Ken yu help mi wid dis form?"',
    emoji: '📋',
    audience: 'adults'
  },
  {
    id: 'vc_a3',
    en: 'I would like a large coffee with milk',
    tr: 'Sütlü büyük bir kahve rica ediyorum.',
    pronounceTip: '"Ay wud layk e larc kofi wid milk"',
    emoji: '☕',
    audience: 'adults'
  }
];

// ==================== WEB AUDIO API SENTETİZÖRÜ ====================
// Harici mp3 indirmeye gerek kalmadan tertemiz nostaljik oyun sesleri üretir!
class GameSoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Kart Çevirme Sesi
  public playCardFlip() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // AudioContext engellendiyse sessizce geç
    }
  }

  // Başarılı Eşleşme Sesi (Tatlı Zil)
  public playMatchSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.22);
      });
    } catch {
      // ignore
    }
  }

  // Doğru Cevap Bipi
  public playCorrect() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.0, now + 0.08); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.22);
    } catch {
      // ignore
    }
  }

  // Hatalı Cevap Tonu
  public playWrong() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.26);
    } catch {
      // ignore
    }
  }

  // Zafer Fanfarı / Bölüm Tamamlama
  public playFanfare() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.18, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.36);
      });
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new GameSoundEngine();

// ==================== OYUN SKOR & KAYIT SERVİSİ ====================
export interface ArcadeStats {
  totalScore: number;
  level: number;
  gamesPlayed: number;
  streak: number;
  badges: string[];
}

const STORAGE_KEY = 'chirmo_arcade_stats_v1';

export const GameStatsService = {
  getStats(): ArcadeStats {
    try {
      if (typeof localStorage === 'undefined') return { totalScore: 0, level: 1, gamesPlayed: 0, streak: 1, badges: ['🎮 Başlangıç Rozeti'] };
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { totalScore: 0, level: 1, gamesPlayed: 0, streak: 1, badges: ['🎮 Başlangıç Rozeti'] };
      return JSON.parse(raw);
    } catch {
      return { totalScore: 0, level: 1, gamesPlayed: 0, streak: 1, badges: ['🎮 Başlangıç Rozeti'] };
    }
  },

  addScore(points: number): ArcadeStats {
    const stats = this.getStats();
    stats.totalScore += points;
    stats.gamesPlayed += 1;

    // Her 150 puanda bir seviye atlama
    const newLevel = Math.max(1, Math.floor(stats.totalScore / 150) + 1);
    if (newLevel > stats.level) {
      stats.level = newLevel;
      soundEngine.playFanfare();
    }

    // Rozet kontrolleri
    if (stats.totalScore >= 300 && !stats.badges.includes('⭐ Yıldız Avcısı')) {
      stats.badges.push('⭐ Yıldız Avcısı');
    }
    if (stats.gamesPlayed >= 5 && !stats.badges.includes('⚡ Refleks Ustası')) {
      stats.badges.push('⚡ Refleks Ustası');
    }
    if (stats.totalScore >= 800 && !stats.badges.includes('🏆 İngilizce Şampiyonu')) {
      stats.badges.push('🏆 İngilizce Şampiyonu');
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      }
    } catch {
      // ignore
    }
    return stats;
  }
};
