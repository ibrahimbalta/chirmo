import React, { useState } from 'react';
import {
  PrivacyAuthService,
  PRESET_SECURITY_QUESTIONS,
  SafeUserSession
} from '../../services/privacyAuthService';

interface ChirmoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: SafeUserSession) => void;
}

export const ChirmoAuthModal: React.FC<ChirmoAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Login Form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regQuestion, setRegQuestion] = useState(PRESET_SECURITY_QUESTIONS[0]);
  const [regAnswer, setRegAnswer] = useState('');

  // Forgot Password Form
  const [forgotUsername, setForgotUsername] = useState('');
  const [retrievedQuestion, setRetrievedQuestion] = useState<string | null>(null);
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (newTab: 'login' | 'register' | 'forgot') => {
    setTab(newTab);
    clearMessages();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const user = await PrivacyAuthService.login(loginUsername, loginPassword);
      setSuccessMessage(`Hoş geldiniz, ${user.username}! Oturum başarıyla açıldı.`);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (regPassword !== regPasswordConfirm) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      const user = await PrivacyAuthService.register(
        regUsername,
        regPassword,
        regQuestion,
        regAnswer
      );
      setSuccessMessage(`Tebrikler! @${user.username} hesabınız sıfır kişisel veri ile oluşturuldu.`);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotLookupQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    try {
      const question = PrivacyAuthService.getSecurityQuestion(forgotUsername);
      setRetrievedQuestion(question);
      setSuccessMessage('Güvenlik sorunuz bulundu! Lütfen cevabı ve yeni şifrenizi girin.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Kullanıcı bulunamadı.');
      setRetrievedQuestion(null);
    }
  };

  const handleForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await PrivacyAuthService.resetPasswordWithSecurityAnswer(
        forgotUsername,
        forgotAnswer,
        forgotNewPassword
      );
      setSuccessMessage('Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapılıyor...');
      const user = await PrivacyAuthService.login(forgotUsername, forgotNewPassword);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Şifre sıfırlanırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-all">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                <img
                  src="./chirmo-avatar.png"
                  alt="Chirmo Mascot"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    (e.currentTarget as any).src = './chirmo-icon.png';
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tight">
                Chirmo'ya Hoş Geldiniz 👋
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Konuşma garantili İngilizce & Almanca dünyasına adım atın
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons - Symmetrical & Clean */}
        <div className="px-4 sm:px-6 pt-4 pb-1 bg-white dark:bg-slate-900 shrink-0">
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl gap-1 text-xs font-bold border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`py-2.5 rounded-xl transition-all duration-200 text-center ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-black shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`py-2.5 rounded-xl transition-all duration-200 text-center ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-black shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kayıt Ol ✨
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('forgot')}
              className={`py-2.5 rounded-xl transition-all duration-200 text-center ${
                tab === 'forgot'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-black shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Şifremi Unuttum
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar text-xs space-y-4">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-semibold animate-fadeIn flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-semibold animate-fadeIn flex items-center gap-2">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Kullanıcı Adı:
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı yazın..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Şifre:</label>
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Şifrenizi yazın..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] mt-2 disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {loading ? 'Giriş Yapılıyor...' : 'Oturum Aç ➔'}
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-500 dark:text-slate-400">Henüz bir hesabınız yok mu? </span>
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Hemen Kayıt Olun
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER (ZERO-PII) */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-[11px] leading-relaxed">
                🛡️ <strong>Güvenli ve Pratik:</strong> Telefon veya e-posta gerekmez. Şifrenizi unutursanız hesabınızı güvenlik sorunuzla anında kurtarabilirsiniz.
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Kullanıcı Adı Seçin:
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Örn: ahmet_dev, ece99..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Şifre:</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="En az 4 karakter..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Şifre Tekrarı:</label>
                  <input
                    type="password"
                    required
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    placeholder="Şifreyi tekrar yazın..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Güvenlik Sorusu Seçin (Kurtarma İçin):
                </label>
                <select
                  value={regQuestion}
                  onChange={(e) => setRegQuestion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {PRESET_SECURITY_QUESTIONS.map((q, idx) => (
                    <option key={idx} value={q} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Güvenlik Sorunuzun Cevabı:
                </label>
                <input
                  type="text"
                  required
                  value={regAnswer}
                  onChange={(e) => setRegAnswer(e.target.value)}
                  placeholder="Örn: Pamuk, Mehmet Hoca vb..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  * Cevap büyük/küçük harf duyarsız olarak güvenle saklanır.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] mt-2 disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {loading ? 'Hesap Oluşturuluyor...' : 'Hesabımı Oluştur 🚀'}
              </button>

              <div className="text-center pt-1">
                <span className="text-slate-500 dark:text-slate-400">Zaten bir hesabınız var mı? </span>
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Giriş Yapın
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD (SECURITY QUESTION RECOVERY) */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 text-purple-800 dark:text-purple-200 text-[11px] leading-relaxed">
                🔑 <strong>Şifre Sıfırlama:</strong> Kaydolurken seçtiğiniz güvenlik sorusunu yanıtlayarak şifrenizi hemen yenileyebilirsiniz.
              </div>

              {!retrievedQuestion ? (
                <form onSubmit={handleForgotLookupQuestion} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Kullanıcı Adınız:
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      placeholder="Kayıtlı kullanıcı adınızı yazın..."
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition"
                  >
                    Güvenlik Sorumu Getir 🔍
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      Kayıtlı Güvenlik Sorunuz:
                    </span>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      "{retrievedQuestion}"
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Güvenlik Sorunuzun Cevabı:
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotAnswer}
                      onChange={(e) => setForgotAnswer(e.target.value)}
                      placeholder="Cevabınızı yazın..."
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Yeni Şifreniz:
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Yeni şifrenizi yazın (en az 4 karakter)..."
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    {loading ? 'Şifre Güncelleniyor...' : 'Şifremi Sıfırla ve Oturum Aç ➔'}
                  </button>
                </form>
              )}

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold transition"
                >
                  ← Giriş Ekranına Dön
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
