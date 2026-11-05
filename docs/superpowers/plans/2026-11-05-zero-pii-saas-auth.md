# SaaS Model: Sıfır Kişisel Veri (Zero-PII) Kimlik & Kullanıcı Veritabanı Mimarisi

## 1. Amaç & Felsefe
Chirmo'yu tam teşekküllü bir SaaS (Software-as-a-Service) modeline dönüştürürken, kullanıcıların e-posta, telefon numarası veya gerçek isim gibi kişisel verilerini (PII) **toplamayan**, tamamen gizlilik odaklı (Privacy-First / Zero-PII) bir kimlik ve hesap sistemi kurmak.

Kullanıcı sadece:
- **Kullanıcı Adı**
- **Şifre**
- **Güvenlik Sorusu & Cevabı** (Şifre kurtarma için)
ile kayıt olur.

## 2. Mimari Bileşenler

### A. Kriptografik Kimlik Doğrulama Servisi (`src/renderer/src/services/privacyAuthService.ts`)
- **Web Crypto API (SHA-256 + Salt):** Şifreler ve güvenlik sorusu cevapları asla düz metin olarak saklanmaz; rastgele oluşturulan benzersiz bir tuz (salt) ile SHA-256 özeti alınarak şifrelenir.
- **Kullanıcı Modeli (`UserAccount`):**
  - `id: string`
  - `username: string` (küçük harfe normalize edilmiş)
  - `passwordHash: string`
  - `salt: string`
  - `securityQuestion: string`
  - `securityAnswerHash: string`
  - `plan: 'free' | 'pro' | 'lifetime'`
  - `createdAt: string`
  - `lastLogin: string`
  - `syncedData?: UserCloudData` (Kullanıcının kelime hazinesi, günlük kamp ilerlemesi, XP, lig sıralaması)
- **Fonksiyonlar:**
  - `register(username, password, question, answer)`: Yeni hesap oluşturur, kullanıcı adının benzersizliğini denetler.
  - `login(username, password)`: Şifreyi doğrular ve oturum açar.
  - `getSecurityQuestion(username)`: Şifresini unutan kullanıcıya sorusunu döner.
  - `resetPasswordWithSecurityAnswer(username, answer, newPassword)`: Güvenlik cevabını doğrular ve yeni şifreyi kaydeder.
  - `getCurrentUser()`: Aktif oturumu döner.
  - `logout()`: Oturumu güvenle kapatır.
  - `syncUserData(data)`: Öğrenme verilerini kullanıcı hesabına yedekler.

### B. Hazır Güvenlik Soruları Havuzu
1. "En sevdiğiniz ilkokul veya lise öğretmeninizin adı nedir?"
2. "İlk evcil hayvanınızın adı nedir?"
3. "En sevdiğiniz çocukluk arkadaşınız kimdir?"
4. "Büyüdüğünüz sokağın veya kasabanın adı nedir?"
5. "İlk dinlediğiniz ve unutamadığınız müzik grubu veya sanatçı kimdir?"

### C. Kullanıcı Arayüzü (`src/renderer/src/components/auth/ChirmoAuthModal.tsx`)
- Üçlü Sekme / Akış:
  1. **Giriş Yap**: Kullanıcı adı + Şifre.
  2. **Kayıt Ol (Sıfır Kişisel Veri)**: Güvenlik sorusu seçici ile anında hesap oluşturma.
  3. **Şifre Kurtarma**: Güvenlik sorusunu yanıtlayarak sıfırlama.
- Gizlilik Bildirimi Rozeti: *"E-posta veya telefon gerekmez. Verileriniz üçüncü taraflarla paylaşılmaz."*

### D. Header & Nav Entegrasyonu (`src/renderer/src/App.tsx`)
- Sağ üstte kullanıcı durumu:
  - Giriş yapılmamışsa: `🛡️ Giriş / Kayıt Ol` butonu.
  - Giriş yapılmışsa: Kullanıcı adı + Avatar + Profil açılır menüsü + `Çıkış Yap`.

## 3. Test Stratejisi (`tests/privacy-auth.test.ts`)
- Hesap kaydı ve benzersiz kullanıcı adı doğrulaması.
- Hatalı şifre denemelerinin reddedilmesi.
- Doğru şifre ile başarılı oturum açma ve oturum saklama.
- Güvenlik sorusu ve cevabı ile şifre sıfırlama akışı.
- Hatalı güvenlik cevabında sıfırlamanın engellenmesi.
