# CHIRMO — Masaüstü Tarayıcısı ve AI Çalışma Alanı

**Slogan:** *Gezin. Düşün. İşlerini Tamamla.* (Browse. Think. Get Things Done.)

Chirmo, gerçek bir internet tarayıcısının özelliklerini yapay zekâ çalışma alanıyla buluşturan profesyonel bir Windows masaüstü platformudur.

---

## 🎨 Tasarım ve Renk Paleti

- **Ana Arka Plan:** Beyaz (`#FFFFFF`)
- **İkincil Arka Plan:** Açık Gri (`#F5F6FA`)
- **Ana Marka Rengi:** Elektrik Moru (`#6652C9`)
- **Metin Rengi:** Koyu Grafit (`#252631`)
- **Kenarlıklar:** Açık Gri (`#E5E7EF`)

---

## 🚀 Aşama 1 — Tamamlanan Özellikler

1. **Güvenli Masaüstü Mimarisi (Electron):**
   - `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`.
   - İzin politikaları ve pop-up filtreleme aktif.
   - Hassas IPC kanalları `contextBridge` ile koruma altında.

2. **Gerçek Web Sayfası Görüntüleme:**
   - Modern `WebContentsView` mimarisi kullanılarak sekmeler ve web siteleri bağımsız izole görünümde yüklenir.

3. **Sekme ve Navigasyon Yönetimi:**
   - Sekme açma (`+`), sekme kapatma (`✕`), sekmeler arası geçiş.
   - Başlık, yükleme durumu ve favicon desteği.
   - Geri, İleri, Yenile, Durdur ve Ana Sayfa butonları.

4. **Akıllı Adres Çubuğu & Google Arama Entegrasyonu:**
   - Geçerli bir URL girildiğinde doğrudan sayfayı açar (`https://...`).
   - Arama terimi girildiğinde arka planda Google Arama motoruna (`https://www.google.com/search?q=...`) yönlendirir.
   - Güvenli bağlantı durumunu (HTTPS kilidi / HTTP uyarısı) gösterir.

5. **Sol Navigasyon Menüsü:**
   - Ana Sayfa, Tarayıcı, Projeler, AI Ajanları, Araçlar, İş Akışları, Görev Geçmişi ve Ayarlar.

6. **Temel Ayarlar Ekranı:**
   - Arama motoru tercihi (Google, Bing, DuckDuckGo).
   - Özel ana sayfa adresi tanımlama.
   - Çerezleri çıkışta temizleme seçeneği.
   - Önbellek temizleme aracı.
   - Sistem ve mimari bilgileri.

---

## 🛠️ Kurulum ve Geliştirme Talimatları

### Gereksinimler
- Node.js 18+ (Node 24 test edildi)
- npm 9+

### Geliştirme Modunda Çalıştırma
```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirici modunu başlatın (Vite + Electron)
npm run dev
```

### Derleme ve Testler
```bash
# Otomatik birim testlerini çalıştırın
npm test

# Uygulama kodlarını derleyin
npm run build
```

### Windows Kurulum Paketi Üretme
```bash
# Windows unpacked klasör üretme
npm run pack:win

# Windows NSIS Kurulum Sihirbazı (.exe) üretme
npm run dist:win

# Windows Taşınabilir (.exe portable) üretme
npm run dist:portable
```
Üretilen kurulum dosyaları `release/` klasörüne aktarılır.
