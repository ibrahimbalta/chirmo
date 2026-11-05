import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Zap,
  HelpCircle,
  RotateCcw,
  Star,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  SubscriptionService,
  SubscriptionPlan,
  UserSubscriptionState
} from '../../services/subscriptionService';

interface ChirmoSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed?: (state: UserSubscriptionState) => void;
}

export const ChirmoSubscriptionModal: React.FC<ChirmoSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribed
}) => {
  const [subState, setSubState] = useState<UserSubscriptionState>(() =>
    SubscriptionService.getSubscriptionState()
  );
  const [selectedMethod, setSelectedMethod] = useState<'credit_card' | 'iyzico_checkout' | 'bank_transfer'>('iyzico_checkout');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCostDetails, setShowCostDetails] = useState(false);

  if (!isOpen) return null;

  const premiumPlan: SubscriptionPlan = SubscriptionService.PLANS.premium;
  const freePlan: SubscriptionPlan = SubscriptionService.PLANS.free;
  const costBreakdown = SubscriptionService.getCostBreakdown();

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = SubscriptionService.activatePremium(selectedMethod);
      setSubState(updated);
      setIsProcessing(false);
      if (onSubscribed) onSubscribed(updated);
    }, 1200);
  };

  const handleCancel = () => {
    const updated = SubscriptionService.cancelSubscription();
    setSubState(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ==================== BAŞLIK ==================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chirmo Premium — Yıllık Tek Seferlik Ödeme</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              1 Yıllık Tam Erişim — 200 TL / Yıl
            </h2>
            <p className="text-xs text-indigo-100">
              Yılda sadece tek seferlik 200 TL ödeyerek 365 gün sınırsız öğren. Aylık tekrarlayan kesinti yok!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==================== İÇERİK ==================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100 text-xs">
          
          {/* Durum Bildirimi (Eğer zaten üye ise) */}
          {subState.isPremium && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-black text-sm">Chirmo Premium Aktif! 🎉</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Bitiş Tarihi: {new Date(subState.renewsAt || '').toLocaleDateString('tr-TR')} (1 Yıllık Tam Erişim)
                  </div>
                </div>
              </div>
              {!subState.cancelledAt ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold cursor-pointer"
                >
                  Aboneliği İptal Et
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 italic">Dönem sonunda yenilenmeyecek</span>
              )}
            </div>
          )}

          {/* İkili Plan Karşılaştırma Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Ücretsiz Plan */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">{freePlan.badge}</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{freePlan.name}</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    0 TL <span className="text-xs font-semibold text-slate-500">/ kalıcı ücretsiz</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  {freePlan.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center py-2 text-[11px] text-slate-400 font-bold border-t border-slate-200 dark:border-slate-700">
                Temel Tanışma Seviyesi
              </div>
            </div>

            {/* 200 TL Yıllık Tek Seferlik Premium Plan */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-slate-900 dark:to-slate-800 border-2 border-indigo-600 shadow-md space-y-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl">
                {premiumPlan.badge}
              </div>

              <div className="space-y-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Önerilen Fırsat</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{premiumPlan.name}</div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 flex items-baseline space-x-1.5">
                    <span>200 TL</span>
                    <span className="text-xs font-bold text-slate-500">/ yıl (Tek Sefer)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Yıllık Tek Seferlik Ödeme • Aylık kesinti veya taahhüt yok</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-indigo-100 dark:border-slate-700">
                  {premiumPlan.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-800 dark:text-slate-200 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Satın Alma Butonu */}
              <div className="space-y-2 pt-2 border-t border-indigo-100 dark:border-slate-700">
                {!subState.isPremium ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleSubscribe}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    {isProcessing ? (
                      <span>İşleniyor (3D Secure)...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Premium'a Geç — 200 TL (Yıllık Tek Sefer)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-center py-2 text-emerald-600 font-black">
                    ✓ Mevcut Planınız (1 Yıl Aktif)
                  </div>
                )}
                <div className="text-center text-[10px] text-slate-400">
                  🔒 256-bit SSL & 3D Secure ile Güvenli Tek Çekim Ödeme
                </div>
              </div>
            </div>

          </div>

          {/* ==================== GÜVENCELER & TÜRKİYE ÖDEME DETAYLARI ==================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>14 Gün Koşulsuz İade</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Memnun kalmazsanız ilk 14 gün içinde tek tıkla paranızı kesintisiz iade alın.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>Yıllık Tek Seferlik</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Yılda yalnızca bir defa 200 TL ödersiniz. Aylık tekrarlayan gizli kart çekimi yapılmaz.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Iyzico & Yerli Kartlar</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Troy, Bonus, Maximum, World dahil tüm banka ve kredi kartlarıyla anında ödeme.
              </p>
            </div>
          </div>

          {/* Şeffaf Maliyet & Kârlılık Dökümü (Kullanıcı İsterse Açar) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCostDetails(!showCostDetails)}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>{showCostDetails ? '▲ Şeffaf Maliyet Dökümünü Gizle' : '▼ 200 TL Nereye Gidiyor? Şeffaf Maliyet & Kârlılık Dökümü'}</span>
            </button>

            {showCostDetails && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-[11px]">
                <div className="font-black text-slate-800 dark:text-slate-200">
                  200 TL / Kullanıcı / Yıl (Tek Seferlik Ödeme) Finansal Dökümü:
                </div>
                <div className="space-y-1">
                  {costBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.item}: </span>
                        <span className="text-slate-500">{item.description}</span>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white shrink-0 ml-2">
                        {item.costPerUserTr.toFixed(2)} TL
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  * Adil Kullanım Politikası: Ayda 900 dakika (günlük 30 dakika) yapay zekâ konuşma seansı dahildir.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ChirmoSubscriptionModal;
