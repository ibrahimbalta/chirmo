// Chirmo Kişiselleştirilmiş Öğrenme Planı Servisi
// Kullanıcının yaşına, seviyesine, hedef diline ve amaçlarına göre Chirmo içindeki en uygun alanları
// adım adım sıraya koyan ve "Hedeflerim" sekmesinde takip ettiren akıllı öğrenme motoru.

import { CEFRLevelSimple, UserProfileService } from './userProfileService';
import { TargetLanguageService, SupportedLanguage } from './targetLanguageService';
import { LearningStorageService } from './learningStorage';

export type AgeGroup = 'kids' | 'teens' | 'adults';
export type TargetFocus = 'daily' | 'cinema' | 'career' | 'games';

export interface PlanStep {
  id: string;
  order: number;
  title: string;
  description: string;
  whyForYou: string;
  targetTab: 'learn' | 'speak' | 'games' | 'kids' | 'search';
  subTab?: string;
  badge: string;
  timeEstimate: string;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  actionText: string;
}

export interface PersonalizedLearningRoadmap {
  id: string;
  createdAt: string;
  updatedAt: string;
  targetLang: SupportedLanguage;
  ageGroup: AgeGroup;
  ageNumber?: number;
  level: CEFRLevelSimple;
  levelTitle: string;
  targetFocus: TargetFocus;
  steps: PlanStep[];
  completedCount: number;
  totalXpReward: number;
  earnedXp: number;
  progressPercent: number;
}

const STORAGE_KEY = 'chirmo_personalized_learning_roadmap_v1';
const EVENT_NAME = 'chirmo_learning_plan_updated';

export const PersonalizedLearningPlanService = {
  getPlan(): PersonalizedLearningRoadmap {
    try {
      if (typeof localStorage === 'undefined') {
        return this.getDefaultPlan();
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return this.getDefaultPlan();
      }
      const parsed: PersonalizedLearningRoadmap = JSON.parse(raw);
      const activeLang = TargetLanguageService.getTargetLanguage();
      if (parsed.targetLang !== activeLang) {
        return this.getDefaultPlan();
      }
      // Auto-recalc counts
      return this.recalculateMetrics(parsed);
    } catch {
      return this.getDefaultPlan();
    }
  },

  getDefaultPlan(): PersonalizedLearningRoadmap {
    const profile = UserProfileService.getProfile();
    const lang = TargetLanguageService.getTargetLanguage();
    const level = profile.level || 'A1';

    return this.buildPlan({
      ageGroup: (profile as any).ageGroup || 'adults',
      ageNumber: (profile as any).age || 24,
      level,
      targetLang: lang,
      targetFocus: (profile as any).targetFocus || 'daily'
    });
  },

  generateAndSavePlan(params: {
    ageGroup: AgeGroup;
    ageNumber?: number;
    level: CEFRLevelSimple;
    targetLang: SupportedLanguage;
    targetFocus?: TargetFocus;
  }): PersonalizedLearningRoadmap {
    const newPlan = this.buildPlan(params);
    this.savePlan(newPlan);

    // Also sync user profile
    UserProfileService.saveProfile({
      level: params.level,
      ...(params.ageGroup ? { ageGroup: params.ageGroup } : {}),
      ...(params.ageNumber ? { age: params.ageNumber } : {}),
      ...(params.targetFocus ? { targetFocus: params.targetFocus } : {})
    } as any);

    return newPlan;
  },

  savePlan(plan: PersonalizedLearningRoadmap): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const calculated = this.recalculateMetrics(plan);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(calculated));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: calculated }));
      }
    } catch (e) {
      console.error('Failed to save learning plan', e);
    }
  },

  completeStep(stepId: string): {
    plan: PersonalizedLearningRoadmap;
    xpGained: number;
    isAllCompleted: boolean;
  } {
    const current = this.getPlan();
    let xpGained = 0;

    const nextSteps = current.steps.map((step) => {
      if (step.id === stepId && !step.completed) {
        xpGained = step.xpReward;
        return {
          ...step,
          completed: true,
          completedAt: new Date().toISOString()
        };
      }
      return step;
    });

    const updatedPlan: PersonalizedLearningRoadmap = {
      ...current,
      steps: nextSteps,
      updatedAt: new Date().toISOString()
    };

    if (xpGained > 0) {
      LearningStorageService.addXP(xpGained);
    }

    const calculated = this.recalculateMetrics(updatedPlan);
    this.savePlan(calculated);

    return {
      plan: calculated,
      xpGained,
      isAllCompleted: calculated.completedCount === calculated.steps.length
    };
  },

  resetStep(stepId: string): PersonalizedLearningRoadmap {
    const current = this.getPlan();
    const nextSteps = current.steps.map((step) => {
      if (step.id === stepId) {
        return {
          ...step,
          completed: false,
          completedAt: undefined
        };
      }
      return step;
    });

    const updatedPlan: PersonalizedLearningRoadmap = {
      ...current,
      steps: nextSteps,
      updatedAt: new Date().toISOString()
    };

    const calculated = this.recalculateMetrics(updatedPlan);
    this.savePlan(calculated);
    return calculated;
  },

  recalculateMetrics(plan: PersonalizedLearningRoadmap): PersonalizedLearningRoadmap {
    const completedCount = plan.steps.filter((s) => s.completed).length;
    const totalXpReward = plan.steps.reduce((acc, s) => acc + s.xpReward, 0);
    const earnedXp = plan.steps.filter((s) => s.completed).reduce((acc, s) => acc + s.xpReward, 0);
    const progressPercent =
      plan.steps.length > 0 ? Math.round((completedCount / plan.steps.length) * 100) : 0;

    return {
      ...plan,
      completedCount,
      totalXpReward,
      earnedXp,
      progressPercent
    };
  },

  subscribe(callback: (plan: PersonalizedLearningRoadmap) => void): () => void {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<PersonalizedLearningRoadmap>;
      callback(custom.detail || this.getPlan());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(EVENT_NAME, handler);
      return () => window.removeEventListener(EVENT_NAME, handler);
    }
    return () => {};
  },

  // Plan Oluşturma Algoritması: Yaş, Seviye ve Hedef Dile Göre Chirmo İstasyonlarını Sıralar
  buildPlan(params: {
    ageGroup: AgeGroup;
    ageNumber?: number;
    level: CEFRLevelSimple;
    targetLang: SupportedLanguage;
    targetFocus?: TargetFocus;
  }): PersonalizedLearningRoadmap {
    const { ageGroup, level, targetLang, targetFocus = 'daily' } = params;
    const isDe = targetLang === 'de';
    const isFr = targetLang === 'fr';

    let levelTitle = '';
    const steps: PlanStep[] = [];

    // ==================== DURUM 1: ÇOCUKLAR (5-11 YAŞ) ====================
    if (ageGroup === 'kids') {
      levelTitle = isDe ? '🧒 Chirmo Minik Almanca Kaşifi' : isFr ? '🧒 Chirmo Minik Fransızca Kaşifi' : '🧒 Chirmo Minik İngilizce Kaşifi';

      steps.push({
        id: 'step-kids-1',
        order: 1,
        title: isDe ? 'Chirmo ile Sesli Almanca Selamlaşma' : isFr ? 'Chirmo ile Sesli Fransızca Selamlaşma' : 'Chirmo ile Sesli İngilizce Selamlaşma',
        description: isDe
          ? 'Mikrofona "Hallo Chirmo!" de, sevimli robot arkadaşınla ilk Almanca sesli tanışmanı yap.'
          : isFr
          ? 'Mikrofona "Bonjour Chirmo!" de, sevimli robot arkadaşınla ilk Fransızca sesli tanışmanı yap.'
          : 'Mikrofona "Hello Chirmo!" de, sevimli robot arkadaşınla ilk sesli tanışmanı yap.',
        whyForYou: '5-11 yaş için en etkili başlangıç, konuşmaktan korkmadan robotla arkadaş olmaktır.',
        targetTab: 'kids',
        badge: 'Chirmo Kids Hub 🎈',
        timeEstimate: '3 Dk',
        xpReward: 30,
        completed: false,
        actionText: 'Kids Alanına Git 🎈'
      });

      steps.push({
        id: 'step-kids-2',
        order: 2,
        title: isDe ? 'Çizgi Film Replikleriyle Gölgeleme' : 'Çizgi Film Replikleriyle Gölgeleme (Shadowing)',
        description: isDe
          ? 'Kısa ve eğlenceli çizgi film karakterinin sesini dinle, hemen ardından neşeyle tekrarla.'
          : 'Kısa ve eğlenceli çizgi film karakterinin sesini dinle, hemen ardından neşeyle tekrarla.',
        whyForYou: 'Görsel çizgi karakterler sayesinde kelimeler çocukların zihnine zahmetsizce kazınır.',
        targetTab: 'kids',
        badge: 'Çizgi Sinema 🍿',
        timeEstimate: '5 Dk',
        xpReward: 35,
        completed: false,
        actionText: 'Çizgi Filmi Aç 🎬'
      });

      steps.push({
        id: 'step-kids-3',
        order: 3,
        title: 'Arcade: Hızlı Balon & Kelime Eşleştirme Oyunu',
        description: isDe
          ? 'Meyveler, hayvanlar ve renklerin Almancalarını balonları patlatarak yakala.'
          : isFr
          ? 'Meyveler, hayvanlar ve renklerin Fransızcalarını balonları patlatarak yakala.'
          : 'Meyveler, hayvanlar ve renkleri balonları patlatarak yakala, rekor kır.',
        whyForYou: 'Oyun oynarken çocuk beyni rekabet ve eğlenceyle kelimeleri kalıcı kaydeder.',
        targetTab: 'games',
        badge: 'Arcade Oyunları 🎮',
        timeEstimate: '5 Dk',
        xpReward: 40,
        completed: false,
        actionText: 'Oyunu Başlat 🎮'
      });

      steps.push({
        id: 'step-kids-4',
        order: 4,
        title: 'İnteraktif Resimli Hikaye Boşluk Doldurmaca',
        description: isDe
          ? 'Sevimli hayvanların macerasını dinle ve eksik cümleyi mikrofona seslendir.'
          : 'Sevimli hayvanların macerasını dinle ve eksik cümleyi mikrofona seslendir.',
        whyForYou: 'Hikaye bağlamında konuşmak çocukların özgüvenini tavana çıkarır.',
        targetTab: 'kids',
        badge: 'Resimli Masal 📖',
        timeEstimate: '5 Dk',
        xpReward: 35,
        completed: false,
        actionText: 'Masalı Dinle 📖'
      });

      steps.push({
        id: 'step-kids-5',
        order: 5,
        title: 'Sihirli Kelime Sandığına 3 Yıldız Ekle',
        description: isDe
          ? 'Bugün öğrendiğin en sevdiğin 3 Almanca kelimeyi sandığına kilitle.'
          : isFr
          ? 'Bugün öğrendiğin en sevdiğin 3 Fransızca kelimeyi sandığına kilitle.'
          : 'Bugün öğrendiğin en sevdiğin 3 kelimeyi sandığına kilitle ve sesini dinle.',
        whyForYou: 'Kendi kelime koleksiyonunu büyütmek bir başarı rozetidir.',
        targetTab: 'learn',
        subTab: 'vault',
        badge: 'Kelime Sandığı 💎',
        timeEstimate: '3 Dk',
        xpReward: 25,
        completed: false,
        actionText: 'Sandığı Aç 💎'
      });
    }

    // ==================== DURUM 2: GENÇLER (12-17 YAŞ) VEYA A1 SIFIRDAN BAŞLAYANLAR ====================
    else if (level === 'A1' || level === 'A2') {
      levelTitle = isDe
        ? level === 'A1'
          ? '🚀 A1 • Sıfırdan Almanca Konuşma Öncüsü'
          : '🚀 A2 • Temel Almanca Konuşkan Gezgin'
        : isFr
        ? level === 'A1'
          ? '🚀 A1 • Sıfırdan Fransızca Konuşma Öncüsü'
          : '🚀 A2 • Temel Fransızca Konuşkan Gezgin'
        : level === 'A1'
        ? '🚀 A1 • Sıfırdan İngilizce Konuşma Öncüsü'
        : '🚀 A2 • Temel İngilizce Konuşkan Gezgin';

      steps.push({
        id: 'step-a1-1',
        order: 1,
        title: isDe ? '30 Günlük Almanca Kampı - 1. Gün Görevi' : isFr ? '30 Günlük Fransızca Kampı - 1. Gün Görevi' : '30 Günlük Konuşma Kampı - 1. Gün Görevi',
        description: isDe
          ? 'Gramer formülü ezberlemeden 5 dakikada ilk doğal tanışma refleksini mikrofona seslendir.'
          : 'Gramer formülü ezberlemeden 5 dakikada ilk doğal tanışma refleksini mikrofona seslendir.',
        whyForYou: 'Sıfırdan başlayanların ilk ihtiyacı çekingenliği yıkıp sesli konuşma alışkanlığı kazanmaktır.',
        targetTab: 'learn',
        subTab: 'camp',
        badge: '30 Günlük Yol 🚀',
        timeEstimate: '5 Dk',
        xpReward: 35,
        completed: false,
        actionText: 'Kampa Başla 🚀'
      });

      steps.push({
        id: 'step-a1-2',
        order: 2,
        title: isDe
          ? 'Gerçek Yaşam Simülatörü: Kafede Kahve & Pasta Siparişi'
          : isFr
          ? 'Gerçek Yaşam Simülatörü: Paris’te Kruvasan & Kahve Siparişi'
          : 'Gerçek Yaşam Simülatörü: Kafede Kahve Siparişi',
        description: isDe
          ? 'Berlin’de bir kafedesin! "Einen Eiskaffee bitte" kalıbıyla sipariş ver, Chirmo’nun yanıtını dinle.'
          : isFr
          ? 'Paris’te bir kafedesin! "Un café et un croissant, s\'il vous plaît" de ve Chirmo ile canlı sipariş simülasyonu yap.'
          : 'Yerliler gibi "Can I get an iced latte to go, please?" de ve Chirmo ile canlı sipariş simülasyonu yap.',
        whyForYou: 'Gerçek hayatta en çok karşılaşacağın senaryoyla ilk günden pratik yapmak dili somutlaştırır.',
        targetTab: 'speak',
        badge: 'Rol Yapma Arenası 🎭',
        timeEstimate: '5 Dk',
        xpReward: 40,
        completed: false,
        actionText: 'Simülatöre Gir 🎭'
      });

      if (isDe) {
        steps.push({
          id: 'step-a1-de-gender',
          order: 3,
          title: 'Korkusuz der / die / das Hızlı Refleks Oyunu',
          description: 'Almancanın en korkulan artikellerini görsel mantık ve refleksle hızla ayırt etmeyi öğren.',
          whyForYou: 'der/die/das ezberlenmez, doğru ses ritmi ve görsel kodlamayla sezgisel kazanılır.',
          targetTab: 'learn',
          badge: 'Artikel Sihirbazı 🔵',
          timeEstimate: '4 Dk',
          xpReward: 30,
          completed: false,
          actionText: 'Oyunu Aç 🔵'
        });
      } else {
        steps.push({
          id: 'step-a1-3',
          order: 3,
          title: '3 Saniye Hızlı Konuşma Refleksi Antrenmanı',
          description: 'Türkçe düşünüp çeviri yapma tuzağını yık! 3 saniye içinde spontane tepki ver.',
          whyForYou: 'Akıcı konuşmanın sırrı gramer kuralları değil, beyinde hazır kalıpları refleks haline getirmektir.',
          targetTab: 'learn',
          badge: 'Refleks Motoru ⚡',
          timeEstimate: '4 Dk',
          xpReward: 30,
          completed: false,
          actionText: 'Refleksi Çalıştır ⚡'
        });
      }

      steps.push({
        id: 'step-a1-4',
        order: 4,
        title: 'Lego Kalıp Sihirbazı ile 3 Yeni Cümle Üret',
        description: isDe
          ? '3 parçayı Lego gibi birleştir: "Ich möchte..." + "gerne..." + "helfen".'
          : isFr
          ? '3 parçayı Lego gibi birleştir: "Je voudrais..." + "commander..." + "un café". Kendi cümleni kur.'
          : '3 renkli blok parçasını birleştir: "I would like to..." + "order..." + "dinner". Kendi cümleni kur.',
        whyForYou: 'Kelimeleri tek tek ezberlemek yerine Lego kalıplarıyla sonsuz yeni cümle türetirsin.',
        targetTab: 'learn',
        subTab: 'builder',
        badge: 'Cümle Laboratuvarı 🧱',
        timeEstimate: '5 Dk',
        xpReward: 35,
        completed: false,
        actionText: 'Cümle Kur 🧱'
      });

      steps.push({
        id: 'step-a1-5',
        order: 5,
        title: 'Film Sahnesinden 1 Cümlelik Shadowing (Gölgeleme)',
        description: isDe
          ? 'Almanca kısa film sahnesindeki repliği dinle, mikrofona seslendir ve telaffuz puanı al.'
          : isFr
          ? 'Fransızca kısa film sahnesindeki repliği dinle, mikrofona seslendir ve telaffuz puanı al.'
          : 'Steve Jobs veya Dead Poets sahnesinden 1 repliği dinle, mikrofona seslendir, telaffuz puanını gör.',
        whyForYou: 'Doğal telaffuz ve tonlama yerli konuşmacıları birebir taklit ederek (Shadowing) yerleşir.',
        targetTab: 'learn',
        subTab: 'video',
        badge: 'Sinema & Gölgeleme 🎬',
        timeEstimate: '6 Dk',
        xpReward: 40,
        completed: false,
        actionText: 'Filmi Aç 🎬'
      });
    }

    // ==================== DURUM 3: ORTA SEVİYE (B1) ====================
    else if (level === 'B1') {
      levelTitle = isDe
        ? '💬 B1 • Akıcı Almanca Diyalog Ustası'
        : isFr
        ? '💬 B1 • Akıcı Fransızca Diyalog Ustası'
        : '💬 B1 • Akıcı İngilizce Diyalog Ustası';

      steps.push({
        id: 'step-b1-1',
        order: 1,
        title: isDe
          ? 'Almanca YouTube & Film Shadowing: Doğal Ritim'
          : isFr
          ? 'Fransızca YouTube & Film Shadowing: Doğal Ritim'
          : 'YouTube & Film ile Konuşma: Steve Jobs veya Inception Shadowing',
        description: isDe
          ? 'Almanca belgesel veya film konuşmasını aç, çift altyazıyla dinle ve mikrofona seslendir.'
          : isFr
          ? 'Fransızca belgesel veya film konuşmasını aç, çift altyazıyla dinle ve mikrofona seslendir.'
          : 'Cümleleri yerli ritmiyle mikrofona seslendir, bağlantılı sesleri (connected speech) yakala.',
        whyForYou: 'B1 seviyesinin en büyük sıçraması kitap İngilizcesinden gerçek hayattaki film ritmine geçmektir.',
        targetTab: 'learn',
        subTab: 'video',
        badge: 'Sinema & Shadowing 🎬',
        timeEstimate: '7 Dk',
        xpReward: 45,
        completed: false,
        actionText: 'Videoya Başla 🎬'
      });

      steps.push({
        id: 'step-b1-2',
        order: 2,
        title: isDe
          ? 'Havalimanı, Otel & Şikayet Canlı Rol Yapma Simülatörü'
          : 'Havalimanı & Otel Rezervasyon Canlı Rol Yapma Simülatörü',
        description: isDe
          ? 'Otelde oda anahtarının çalışmadığını Almanca anlat ve resepsiyonistle canlı çözüm bul.'
          : isFr
          ? 'Paris\'te otel resepsiyonu veya tren garında Chirmo ile canlı konuşarak bilet ve oda çöz.'
          : 'Havalimanında kayıp bavulunu veya otelde oda değişimini Chirmo ile canlı konuşarak çöz.',
        whyForYou: 'Spontane kriz yönetimi ve seyahat diyalogları B1 konuşmacıyı özgüvenle doldurur.',
        targetTab: 'speak',
        badge: 'Simülatör Arenası 🎭',
        timeEstimate: '6 Dk',
        xpReward: 40,
        completed: false,
        actionText: 'Role Başla 🎭'
      });

      steps.push({
        id: 'step-b1-3',
        order: 3,
        title: '3x Hızlı Akıcılık & Konuşma Kas Egzersizi',
        description: isDe
          ? 'Konuşma hızlandırıcı ve hata doktoru ile duraksamadan cümle kur.'
          : 'Hata doktoru, yürüyüş döngüsü ve 3 saniye refleks ile takılmadan konuşma kasını güçlendir.',
        whyForYou: '"Aklıma kelime gelmiyor" duraksamalarını yok etmek için motor kas antrenmanı şarttır.',
        targetTab: 'learn',
        subTab: 'booster',
        badge: 'Akıcılık Laboratuvarı ⚡',
        timeEstimate: '5 Dk',
        xpReward: 35,
        completed: false,
        actionText: 'Akıcılığı Katla ⚡'
      });

      steps.push({
        id: 'step-b1-4',
        order: 4,
        title: 'İnteraktif Hikaye: Diyalog Boşluklarını Sesinle Tamamla',
        description: isDe
          ? 'Hikaye akışında karakterin söyleyeceği tepkiyi sen seslendir.'
          : 'Hikaye akışında karakterin vereceği samimi şaşırma veya onay tepkisini mikrofona seslendir.',
        whyForYou: 'Duygu ve tonlama içeren konuşma hafızada 4 kat daha kalıcıdır.',
        targetTab: 'learn',
        subTab: 'stories',
        badge: 'İnteraktif Hikaye 📖',
        timeEstimate: '6 Dk',
        xpReward: 40,
        completed: false,
        actionText: 'Hikayeyi Oyna 📖'
      });

      steps.push({
        id: 'step-b1-5',
        order: 5,
        title: 'Speaking Duel: Canlı Karşılaştırmalı Cümle Meydan Okuması',
        description: isDe
          ? 'Almanca günlük kalıpları doğru telaffuzla zamana karşı seslendir.'
          : isFr
          ? 'Fransızca günlük kalıpları doğru telaffuzla zamana karşı seslendir.'
          : 'Speaking Duel arenasında Chirmo botuna karşı konuş, doğru sesletimle puanları topla.',
        whyForYou: 'Eğlenceli düellolar konuşurken yaşanan performatif gerginliği tamamen yok eder.',
        targetTab: 'games',
        badge: 'Arcade Düellosu 🎮',
        timeEstimate: '5 Dk',
        xpReward: 40,
        completed: false,
        actionText: 'Düelloyu Başlat 🎮'
      });
    }

    // ==================== DURUM 4: İLERİ SEVİYE & KARİYER (B2 / C1) ====================
    else {
      levelTitle = isDe
        ? '🌟 B2/C1 • Profesyonel Almanca Mülakat & Akıcılık'
        : isFr
        ? '🌟 B2/C1 • Profesyonel Fransızca Mülakat & Akıcılık'
        : '🌟 B2/C1 • Profesyonel İngilizce Mülakat & Akıcılık';

      steps.push({
        id: 'step-b2-1',
        order: 1,
        title: isDe
          ? '🇩🇪 Almanya Vize & Kariyer Mülakat Simülasyonu'
          : isFr
          ? '🇫🇷 Fransa Vize & Kariyer Mülakat Simülasyonu'
          : '🇬🇧 Vize, İş ve Kariyer Mülakat Simülatörü',
        description: isDe
          ? 'Konsolosluk veya Alman şirket mülakatı sorularını Chirmo ile yapay zekaya karşı yanıtla.'
          : isFr
          ? 'Fransız konsolosluğu veya şirket mülakatı sorularını Chirmo ile yapay zekaya karşı yanıtla.'
          : 'Teknik mülakat ve vize sorularını Chirmo AI Teacher ile simüle et, profesyonel geri bildirim al.',
        whyForYou: 'İleri düzeyde en kritik hedef iş hayatında ve mülakatlarda profesyonel akıcılıktır.',
        targetTab: 'speak',
        badge: 'Kariyer Parkuru 💼',
        timeEstimate: '8 Dk',
        xpReward: 50,
        completed: false,
        actionText: 'Mülakata Başla 💼'
      });

      steps.push({
        id: 'step-b2-2',
        order: 2,
        title: 'TED Konuşmalarıyla C1 Seviye Felsefi & Teknik Shadowing',
        description: isDe
          ? 'Akademik ve felsefi konuşmaları hız ve tonlama kaybetmeden eş zamanlı seslendir.'
          : 'Steve Jobs veya Dead Poets üzerinden karmaşık cümle yapıları ve felsefi tonlama çalış.',
        whyForYou: 'C1 seviyesinde nüanslar, mecazlar ve ikna edici konuşma ritmi esastır.',
        targetTab: 'learn',
        subTab: 'video',
        badge: 'C1 Shadowing 🎬',
        timeEstimate: '8 Dk',
        xpReward: 45,
        completed: false,
        actionText: 'TED Konuşmasını Aç 🎬'
      });

      steps.push({
        id: 'step-b2-3',
        order: 3,
        title: 'Cümle Laboratuvarı: Karmaşık Bağlaç & Neden-Sonuç Kalıpları',
        description: isDe
          ? 'Almancanın "obwohl", "insofern", "um... zu" gibi profesyonel bağlaçlarıyla cümle üret.'
          : isFr
          ? 'Fransızcanın "bien que", "étant donné que", "afin de" gibi profesyonel bağlaçlarıyla cümle üret.'
          : '"Notwithstanding", "In light of", "Given that" kalıplarıyla kurumsal cümleler inşa et.',
        whyForYou: 'Düşünceleri profesyonelce birbirine bağlamak ileri düzey konuşmanın anahtarıdır.',
        targetTab: 'learn',
        subTab: 'builder',
        badge: 'İleri Kalıp Motoru 🧱',
        timeEstimate: '6 Dk',
        xpReward: 40,
        completed: false,
        actionText: 'Cümle Üret 🧱'
      });

      steps.push({
        id: 'step-b2-4',
        order: 4,
        title: 'Chirmo Canlı Yapay Zeka Öğretmeni ile Serbest Sohbet',
        description: isDe
          ? 'Almanya’da yaşam, teknoloji veya güncel haberler hakkında Chirmo ile sesli tartış.'
          : isFr
          ? 'Fransa’da yaşam, gastronomi, sanat veya kariyer hakkında Chirmo ile sesli tartış.'
          : 'Global trendler veya ilgi alanın hakkında Chirmo ile serbest, sınırsız sesli diyalog kur.',
        whyForYou: 'Kalıplardan bağımsız, spontane argüman geliştirme refleksini mükemmelleştirir.',
        targetTab: 'search',
        badge: 'Canlı AI Stüdyosu 🤖',
        timeEstimate: '10 Dk',
        xpReward: 50,
        completed: false,
        actionText: 'Sohbeti Başlat 🤖'
      });
    }

    const calculated = this.recalculateMetrics({
      id: 'plan-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetLang,
      ageGroup,
      ageNumber: params.ageNumber,
      level,
      levelTitle,
      targetFocus,
      steps,
      completedCount: 0,
      totalXpReward: 0,
      earnedXp: 0,
      progressPercent: 0
    });

    return calculated;
  }
};
