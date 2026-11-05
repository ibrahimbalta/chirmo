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
  onOpenAdmin?: () => void;
}

export const ChirmoAuthModal: React.FC<ChirmoAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenAdmin
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-5 border-b border-gray-800 bg-gray-900/60 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-2xl shadow-inner">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Chirmo SaaS Kimlik Merkezi</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sıfır Kişisel Veri
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                E-posta veya telefon gerekmez. Tamamen anonim ve güvenli.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 p-2 bg-gray-950/80 border-b border-gray-800 shrink-0 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`py-2 rounded-xl transition ${
              tab === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`py-2 rounded-xl transition ${
              tab === 'register'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Kayıt Ol ✨
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('forgot')}
            className={`py-2 rounded-xl transition ${
              tab === 'forgot'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Şifre Sıfırla
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar text-xs space-y-4">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 animate-fadeIn font-medium">
              ⚠️ {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 animate-fadeIn font-medium">
              ✓ {successMessage}
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">
                  Kullanıcı Adı:
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı yazın..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-300 font-bold">Şifre:</label>
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot')}
                    className="text-[11px] text-cyan-400 hover:underline"
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
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-black font-black rounded-xl shadow-lg shadow-cyan-500/20 transition mt-2 disabled:opacity-50"
              >
                {loading ? 'Giriş Yapılıyor...' : 'Oturum Aç ➔'}
              </button>

              <div className="text-center pt-2">
                <span className="text-gray-400">Henüz bir hesabınız yok mu? </span>
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Hemen Kayıt Olun
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER (ZERO-PII) */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-[11px] leading-relaxed">
                🛡️ <strong>Gizlilik Garantisi:</strong> E-posta adresinizi veya telefon numaranızı asla istemiyoruz. Şifrenizi unutursanız hesabınızı yalnızca seçeceğiniz güvenlik sorusuyla kurtarabilirsiniz.
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Kullanıcı Adı Seçin:
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Örn: ahmet_dev, ece99..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Şifre:</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="En az 4 karakter..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Şifre Tekrarı:</label>
                  <input
                    type="password"
                    required
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    placeholder="Şifreyi tekrar yazın..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Güvenlik Sorusu Seçin (Şifre Kurtarma İçin):
                </label>
                <select
                  value={regQuestion}
                  onChange={(e) => setRegQuestion(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  {PRESET_SECURITY_QUESTIONS.map((q, idx) => (
                    <option key={idx} value={q} className="bg-gray-900">
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Güvenlik Sorunuzun Cevabı:
                </label>
                <input
                  type="text"
                  required
                  value={regAnswer}
                  onChange={(e) => setRegAnswer(e.target.value)}
                  placeholder="Örn: Mehmet Hoca, Pamuk, Ali vb..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  * Cevap büyük/küçük harf duyarsız olarak güvenle saklanır.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-black rounded-xl shadow-lg shadow-emerald-500/20 transition mt-2 disabled:opacity-50"
              >
                {loading ? 'Hesap Oluşturuluyor...' : 'Hesabımı Güvenle Oluştur 🚀'}
              </button>

              <div className="text-center pt-1">
                <span className="text-gray-400">Zaten bir hesabınız var mı? </span>
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Giriş Yapın
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD (SECURITY QUESTION RECOVERY) */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-[11px] leading-relaxed">
                🔑 <strong>Şifre Sıfırlama:</strong> E-posta doğrulaması gerekmez. Kaydolurken seçtiğiniz güvenlik sorusunu doğru yanıtlayarak anında yeni şifrenizi belirleyebilirsiniz.
              </div>

              {!retrievedQuestion ? (
                <form onSubmit={handleForgotLookupQuestion} className="space-y-3">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">
                      Kullanıcı Adınız:
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      placeholder="Kayıtlı kullanıcı adınızı yazın..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl border border-gray-700 transition"
                  >
                    Güvenlik Sorumu Getir 🔍
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-gray-950 border border-cyan-500/40">
                    <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider block mb-1">
                      Kayıtlı Güvenlik Sorunuz:
                    </span>
                    <p className="text-sm font-bold text-white">
                      "{retrievedQuestion}"
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">
                      Güvenlik Sorunuzun Cevabı:
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotAnswer}
                      onChange={(e) => setForgotAnswer(e.target.value)}
                      placeholder="Cevabınızı yazın..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">
                      Yeni Şifreniz:
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Yeni şifrenizi yazın (en az 4 karakter)..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black font-black rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                  >
                    {loading ? 'Şifre Güncelleniyor...' : 'Şifremi Sıfırla ve Oturum Aç ➔'}
                  </button>
                </form>
              )}

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-gray-400 hover:text-white transition"
                >
                  ← Giriş Ekranına Dön
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alt Bilgi & Admin Girişi Linki */}
        {onOpenAdmin && (
          <div className="px-6 py-2.5 bg-gray-950 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
            <span>Chirmo Güvenli Sistem</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-amber-500 hover:text-amber-400 hover:underline font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>🔒</span>
              <span>Admin Girişi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
