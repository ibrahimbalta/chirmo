/**
 * subscriptionService.ts
 * CHIRMO — 200 TL / Ay Abonelik ve Ticari Mimari Servisi
 * 
 * Türkiye ödeme altyapısı (Iyzico / Kredi Kartı / Havale / Google Play & App Store uyumluluğu)
 * Adil Kullanım Politikası (Fair Usage Policy), maliyet ve kârlılık şeffaflığı.
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthlyTr: number; // 200 TL
  currency: string;
  badge: string;
  isPopular?: boolean;
  features: string[];
  limits: {
    dailyAiSpeakingMinutes: number; // 30 dk/gün (aylık 900 dk)
    dailyGames: number | 'unlimited';
    simulationsAccess: 'all' | 'sample';
    sentenceBuilderAccess: 'all' | 'basic';
    parentProgressReport: boolean;
    spacedRepetitionCapacity: number | 'unlimited';
  };
}

export interface UserSubscriptionState {
  isPremium: boolean;
  planId: 'free' | 'premium_monthly';
  startedAt?: string;
  renewsAt?: string;
  cancelledAt?: string;
  paymentMethod?: 'credit_card' | 'iyzico_checkout' | 'bank_transfer' | 'apple_pay' | 'google_pay';
  monthlyFairUsage: {
    aiMinutesUsed: number;
    aiMinutesLimit: number; // 900 dk
    sentencesCreated: number;
    simulationsCompleted: number;
  };
}

export interface CostBreakdownItem {
  item: string;
  costPerUserTr: number;
  description: string;
}

const STORAGE_KEY = 'chirmo_user_subscription_v1';

export class SubscriptionService {
  public static readonly PLANS: Record<'free' | 'premium', SubscriptionPlan> = {
    free: {
      id: 'free',
      name: 'Chirmo Başlangıç (Ücretsiz)',
      priceMonthlyTr: 0,
      currency: 'TL',
      badge: 'Temel Deneyim',
      features: [
        'Seviye ve ihtiyaç analizi',
        'İlk 3 günün konuşma ve kalıp dersleri',
        'Günde 5 cümle kurma laboratuvarı hakkı',
        '1 adet örnek gerçek yaşam simülasyonu (Kafe)',
        'Temel kelime defteri (20 kelime)'
      ],
      limits: {
        dailyAiSpeakingMinutes: 3,
        dailyGames: 2,
        simulationsAccess: 'sample',
        sentenceBuilderAccess: 'basic',
        parentProgressReport: false,
        spacedRepetitionCapacity: 20
      }
    },
    premium: {
      id: 'premium_monthly',
      name: 'Chirmo Premium (Tam Erişim)',
      priceMonthlyTr: 200,
      currency: 'TL',
      badge: 'En Popüler • Taahhütsüz',
      isPopular: true,
      features: [
        '30 Günlük Tam Konuşma Kampı müfredatı',
        'Yapay Zekâ Konuşma Öğretmeni (Kişisel Geri Bildirim)',
        'Sınırsız Cümle Üretim Laboratuvarı & Permütasyonlar',
        '12+ Gerçek Hayat Simülasyonu (Havalimanı, İş, Otel, Kafe)',
        '15 Çeşit Arcade ve Eğitici Oyunun Tamamı',
        'Akıllı SM-2 Unutmama ve Aralıklı Tekrar Sistemi',
        'Chirmo Kids (5-17 yaş) ve Veli Haftalık WhatsApp/PDF Karnesi',
        'Reklamsız ve Güvenli Öğrenme Ortamı',
        '14 Gün Koşulsuz İade Güvencesi & İstediğin An İptal'
      ],
      limits: {
        dailyAiSpeakingMinutes: 30, // 30 dk/gün
        dailyGames: 'unlimited',
        simulationsAccess: 'all',
        sentenceBuilderAccess: 'all',
        parentProgressReport: true,
        spacedRepetitionCapacity: 'unlimited'
      }
    }
  };

  /**
   * 200 TL Aylık Ücretin Maliyet ve Kârlılık Hesabı:
   * 
   * Gelir: 200.00 TL / Kullanıcı / Ay
   * - %20 KDV (Dijital Hizmet): 33.33 TL
   * - Ödeme Geçidi Komisyonu (Iyzico / Banka ort. %3 + 1 TL): ~7.00 TL
   * - AI LLM Token Maliyeti (Kullanıcı başı ort. 45 diyalog seansı): ~18.50 TL
   * - Web Speech TTS & STT ve Ses Sentezi Sunucu Maliyeti: ~6.00 TL
   * - Bulut Sunucu & Veritabanı Maliyeti (Ölçeklenmiş): ~4.00 TL
   * ----------------------------------------------------
   * Toplam Maliyet: ~68.83 TL
   * NET FAALİYET KÂRI: ~131.17 TL (%65.5 Net Kâr Marjı)
   * 
   * Bu hesaplama 200 TL fiyatının hem Türk kullanıcısı için ulaşılabilir hem de işletme için yüksek kârlı ve sürdürülebilir olduğunu kanıtlar.
   */
  public static getCostBreakdown(): CostBreakdownItem[] {
    return [
      { item: 'KDV (%20) & Yasal Vergiler', costPerUserTr: 33.33, description: 'Türkiye yasal e-ticaret KDV kesintisi' },
      { item: 'Ödeme Altyapısı (Iyzico / 3D Secure)', costPerUserTr: 7.00, description: 'Kart işlem ve banka provizyon komisyonu' },
      { item: 'AI Diyalog & Dil Modeli Maliyeti', costPerUserTr: 18.50, description: 'Chirmo AI konuşma ve analiz tokenları' },
      { item: 'Ses & TTS Altyapısı', costPerUserTr: 6.00, description: 'Doğal telaffuz ve ses sentezi bant genişliği' },
      { item: 'Bulut & Veri Saklama', costPerUserTr: 4.00, description: 'SM-2 hafıza ve ilerleme güvenliği' },
      { item: 'NET İŞLETME KÂRI', costPerUserTr: 131.17, description: 'Platform geliştirme, öğretmen maaşları ve kâr' }
    ];
  }

  /**
   * Kullanıcının mevcut abonelik durumunu getirir
   */
  public static getSubscriptionState(): UserSubscriptionState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }

    return {
      isPremium: false,
      planId: 'free',
      monthlyFairUsage: {
        aiMinutesUsed: 0,
        aiMinutesLimit: 900,
        sentencesCreated: 0,
        simulationsCompleted: 0
      }
    };
  }

  /**
   * Premium Aboneliği Başlatır
   */
  public static activatePremium(paymentMethod: 'credit_card' | 'iyzico_checkout' | 'bank_transfer' = 'iyzico_checkout'): UserSubscriptionState {
    const now = new Date();
    const renewDate = new Date();
    renewDate.setDate(now.getDate() + 30);

    const newState: UserSubscriptionState = {
      isPremium: true,
      planId: 'premium_monthly',
      startedAt: now.toISOString(),
      renewsAt: renewDate.toISOString(),
      paymentMethod,
      monthlyFairUsage: {
        aiMinutesUsed: 0,
        aiMinutesLimit: 900,
        sentencesCreated: 0,
        simulationsCompleted: 0
      }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return newState;
  }

  /**
   * Aboneliği İptal Eder (Dönem sonuna kadar haklar korunur)
   */
  public static cancelSubscription(): UserSubscriptionState {
    const current = this.getSubscriptionState();
    const updated: UserSubscriptionState = {
      ...current,
      cancelledAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
}
