/**
 * subscriptionService.ts
 * CHIRMO — 200 TL / Yıl (Yıllık Tek Seferlik Ödeme) Abonelik ve Ticari Mimari Servisi
 * 
 * Türkiye ödeme altyapısı (Iyzico / Kredi Kartı / Havale / Google Play & App Store uyumluluğu)
 * Yıllık tek seferlik ödeme modeli: Kullanıcı yılda sadece 1 kez 200 TL öder, aylık tekrarlayan kesinti olmaz.
 * Adil Kullanım Politikası (Fair Usage Policy), maliyet ve kârlılık şeffaflığı.
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceYearlyTr: number; // 200 TL / Yıl (Yıllık Tek Sefer)
  priceMonthlyTr: number; // Geriye dönük uyumluluk (200)
  billingPeriod: string; // 'Yıllık (Tek Sefer)'
  currency: string;
  badge: string;
  isPopular?: boolean;
  features: string[];
  limits: {
    dailyAiSpeakingMinutes: number; // 30 dk/gün
    dailyGames: number | 'unlimited';
    simulationsAccess: 'all' | 'sample';
    sentenceBuilderAccess: 'all' | 'basic';
    parentProgressReport: boolean;
    spacedRepetitionCapacity: number | 'unlimited';
  };
}

export interface UserSubscriptionState {
  isPremium: boolean;
  planId: 'free' | 'premium_yearly' | 'premium_monthly';
  billingType?: 'yearly_one_time';
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
      priceYearlyTr: 0,
      priceMonthlyTr: 0,
      billingPeriod: 'Kalıcı Ücretsiz',
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
      id: 'premium_yearly',
      name: 'Chirmo Premium (1 Yıllık Tam Erişim)',
      priceYearlyTr: 200,
      priceMonthlyTr: 200,
      billingPeriod: 'Yıllık (Tek Seferlik Ödeme)',
      currency: 'TL',
      badge: 'En Popüler • Yıllık Tek Sefer',
      isPopular: true,
      features: [
        '365 Gün Boyunca Tüm Müfredata Sınırsız Erişim',
        'Aylık Sürpriz Yenileme Yok — Tek Seferlik 200 TL',
        'Yapay Zekâ Konuşma Öğretmeni (Kişisel Geri Bildirim)',
        'Sınırsız Cümle Üretim Laboratuvarı & Permütasyonlar',
        '12+ Gerçek Hayat Simülasyonu (Havalimanı, İş, Otel, Kafe)',
        '15 Çeşit Arcade ve Eğitici Oyunun Tamamı',
        'Akıllı SM-2 Unutmama ve Aralıklı Tekrar Sistemi',
        'Chirmo Kids (5-17 yaş) ve Veli Haftalık WhatsApp/PDF Karnesi',
        'Reklamsız ve Güvenli Öğrenme Ortamı',
        '14 Gün Koşulsuz İade Güvencesi'
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
   * 200 TL Yıllık Tek Seferlik Ücretin Maliyet ve Kârlılık Hesabı:
   * 
   * Gelir: 200.00 TL / Kullanıcı / Yıl (Tek Sefer)
   * - %20 KDV (Dijital Hizmet): 33.33 TL
   * - Ödeme Geçidi Komisyonu (Iyzico / Banka tek çekim %2.9 + 1 TL): ~6.80 TL
   * - AI LLM Token & Ses Altyapı Maliyeti: ~25.00 TL
   * - Bulut Sunucu & Veritabanı Maliyeti: ~5.00 TL
   * ----------------------------------------------------
   * Toplam Maliyet: ~70.13 TL
   * NET FAALİYET KÂRI: ~129.87 TL (%65 Net Kâr Marjı)
   */
  public static getCostBreakdown(): CostBreakdownItem[] {
    return [
      { item: 'KDV (%20) & Yasal Vergiler', costPerUserTr: 33.33, description: 'Türkiye yasal e-ticaret KDV kesintisi' },
      { item: 'Ödeme Altyapısı (Iyzico / 3D Secure)', costPerUserTr: 6.80, description: 'Tek çekim kart işlem ve banka provizyon komisyonu' },
      { item: 'AI Diyalog & Dil Modeli Maliyeti', costPerUserTr: 25.00, description: 'Chirmo AI konuşma ve analiz tokenları' },
      { item: 'Ses & TTS Altyapısı', costPerUserTr: 6.00, description: 'Doğal telaffuz ve ses sentezi bant genişliği' },
      { item: 'Bulut & Veri Saklama', costPerUserTr: 5.00, description: '1 yıllık SM-2 hafıza ve ilerleme güvenliği' },
      { item: 'NET İŞLETME KÂRI', costPerUserTr: 123.87, description: 'Platform geliştirme, öğretmen maaşları ve net kâr' }
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
   * Premium Aboneliği Başlatır (1 Yıl Boyunca Geçerli Tek Seferlik Ödeme)
   */
  public static activatePremium(paymentMethod: 'credit_card' | 'iyzico_checkout' | 'bank_transfer' = 'iyzico_checkout'): UserSubscriptionState {
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(now.getFullYear() + 1); // 1 Yıl sonra biter (Aylık otomatik yenileme yok)

    const newState: UserSubscriptionState = {
      isPremium: true,
      planId: 'premium_yearly',
      billingType: 'yearly_one_time',
      startedAt: now.toISOString(),
      renewsAt: expiryDate.toISOString(),
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
