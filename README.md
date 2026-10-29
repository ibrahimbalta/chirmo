# ⚡ CHIRMO — Yapay Zekâ Destekli Masaüstü Tarayıcısı ve İş Yönetim Platformu

<div align="center">

![Chirmo Banner](https://img.shields.io/badge/Chirmo-Desktop%20AI%20Browser-6652C9?style=for-the-badge&logo=electron&logoColor=white)
[![Tests](https://img.shields.io/badge/Tests-30%2F30%20Passing-10B981?style=for-the-badge&logo=vitest&logoColor=white)](tests/)
[![Electron](https://img.shields.io/badge/Electron-v33.4-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-0078D6?style=for-the-badge&logo=windows&logoColor=white)](release/)

**Browse. Think. Get Things Done.**  
*Gezin. Düşün. İşlerini Tamamla.*

</div>

---

## 📌 Proje Hakkında

**Chirmo**, klasik bir Chromium internet tarayıcısının gücünü; yapay zekâ araştırma ajanları, çevrimdışı yerel zekâ, proje ve görev yönetimi, derin web analiz araçları ve görsel iş akışlarıyla birleştiren modern bir Windows masaüstü platformudur.

Kullanıcı yalnızca web sitelerini ziyaret etmekle kalmaz; yapay zekâya görev verebilir, projelerini yönetebilir, web araştırma sonuçlarını kaydedebilir ve onay verdiği işlemleri kontrollü biçimde otomatikleştirebilir.

---

## 🌟 Temel Yetenekler & Özellikler

### 1. 🔍 Akıllı Arama & Keşif Merkezi (Omnisearch AI Hub)
- **Google Arama Hibrit Mimarisi:** Doğrudan arama sorgularını Google Arama sonuçlarıyla veya dahili sentez motoruyla işleme.
- **⚡ %100 Yerel / Çevrimdışı Zekâ (Offline-First):**
  - **🧮 Hızlı Hesaplayıcı:** Matematiksel işlemleri (`1500 * 1.18`, `sqrt(144)`) internete gitmeden anında çözer.
  - **💵 Birim & Döviz Dönüştürücü:** `100 USD to TRY`, `50 EUR to USD`, `100 KM to Miles` anında yerel hesaplama.
  - **📚 Dahili Ansiklopedi (Knowledge Base):** React, TypeScript, Electron, Python, Docker vb. 40+ teknoloji için anında tanım, kod örneği ve önemli noktalar.
  - **🗄️ Yerel Bellek İndeksi:** Bilgisayarınızdaki tüm projeleri, görevleri ve denetim kayıtlarını tam metin arama.
- **Perplexity Tarzı AI Sentezi:** Önemli çıkarımlar, tavsiye edilen adımlar, güvenilirlik skoru (%98) ve kaynakça.

### 2. 🌐 Güvenli Masaüstü Tarayıcısı (Browser Core)
- **Modern `WebContentsView`:** Electron 33 üzerinde sekmeleri tam izole, güvenli ve donanım hızlandırmalı olarak çalıştıran sekme yöneticisi.
- **Gelişmiş Navigasyon:** Sekmeler (`+` / `✕`), akıllı adres çubuğu, geri / ileri / yenile / durdur kontrolleri.
- **Tarayıcı İçi Görev Paneli:** Gezinilen aktif web sayfasını tek tıkla projelere görev olarak bağlayan yan panel.
- **Özel Türkçe Hata Sayfası:** Ağ kopması veya DNS hatalarında modern marka uyumlu kurtarma ekranı.

### 3. 🤖 Yapay Zekâ Araştırma Ajanı (AI Planner & Researcher)
- **Doğal Dil Planlayıcı:** Kullanıcının verdiği karmaşık hedefleri mantıksal alt adımlara böler.
- **Kullanıcı Onay Kapısı (Approval Gate):** Kritik web kazıma veya veri işlemlerinde kullanıcıdan onay ister.
- **İzole Web Scraper Aracı:** Arka planda sayfaların DOM ağacını temizleyerek metinleri ve başlıkları ayıklar.
- **Çift Sağlayıcı Desteği:** Sıfır maliyetle çevrimdışı çalışan `LocalHeuristicProvider` ve isteğe bağlı Google `GeminiProvider`.

### 4. 🗄️ Projeler ve 7 Durumlu Görev Yönetimi
- **Yerel Atomik Veritabanı:** `better-sqlite3` derleme sorunlarını engelleyen, atomik yazma destekli yerel JSON veritabanı.
- **7 Görev Yaşam Döngüsü:** *Bekliyor, Planlanıyor, Onay bekliyor, Çalışıyor, Tamamlandı, Hata oluştu, İptal edildi*.
- **Denetim Günlüğü (Audit History):** Gerçekleştirilen tüm işlemlerin zaman damgalı tarihçesi.

### 5. 🛠️ Derin Web Araçları ve Görsel İş Akışları
- **SEO & Sayfa Analiz Aracı:** Okunabilirlik skoru, kelime frekansı, başlık hiyerarşisi ve meta etiket denetimi.
- **Görsel İş Akışları (Visual Workflows):** Rakip analizi, pazar araştırması ve sayfa audit şablonları.
- **Toplu Sıralı Tarama Kuyruğu (Batch Queue Scraper):** Birden fazla URL'yi sırayla güvenle tarayıp birleştiren motor.

### 6. 🛡️ Güvenlik İlkeleri (Security Hardening)
- `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`.
- İzin politikaları: Kamera, mikrofon, sensör, USB ve pano okuma varsayılan olarak engellidir.
- **Prompt Injection Filtresi:** `NFKC` Unicode normalizasyonu ve desen eşleme ile web sayfalarından gelebilecek zararlı prompt talimatlarını etkisiz hale getirir.
- **Oturum Kurtarma:** Çökme veya yeniden başlatmada açık sekmeleri otomatik geri yükler.

---

## 🎨 Tasarım ve Marka Kimliği

| Kullanım | Renk Kodu | Önizleme |
|---|---|---|
| **Ana Arka Plan** | `#FFFFFF` | Beyaz |
| **İkincil Arka Plan** | `#F5F6FA` | Açık Gri |
| **Ana Marka Rengi** | `#6652C9` | Elektrik Moru |
| **Metin** | `#252631` | Koyu Grafit |
| **İkincil Metin** | `#777987` | Gri |
| **Kenarlıklar** | `#E5E7EF` | Açık Kenarlık Grisi |
| **Başarı / Güvenlik** | `#10B981` | Yeşil |

---

## 📁 Proje Dizin Yapısı

```text
chirmo/
├── src/
│   ├── main/                       # Electron Ana Süreç (Main Process)
│   │   ├── ai/                     # AI Sağlayıcıları, Ajan Koşucusu, Araçlar, İş Akışları
│   │   │   ├── agent-runner.ts     # Çok adımlı planlama & onay koordinatörü
│   │   │   ├── provider.ts         # LocalHeuristic & Gemini AI adaptörleri
│   │   │   ├── tool-executor.ts    # İzole arka plan web scraper
│   │   │   ├── tools-service.ts    # SEO, frekans & okunabilirlik analizi
│   │   │   └── workflow-engine.ts  # Şablonlar & toplu kazıma kuyruğu
│   │   ├── security/               # Prompt injection dezenfektanı
│   │   ├── browser-manager.ts      # WebContentsView tabanında sekme yönetimi
│   │   ├── database.ts             # Atomik yerel JSON veritabanı
│   │   ├── error-page.ts           # Özel Türkçe hata sayfaları
│   │   ├── ipc-handlers.ts         # Güvenli, tipli IPC yönlendiricileri
│   │   ├── session-recovery.ts     # Oturum kurtarma motoru
│   │   └── url-helper.ts           # Google Arama ve URL çözümleme
│   ├── preload/                    # Context isolation köprüsü
│   └── renderer/                   # React + TypeScript + Tailwind Arayüzü
│       └── src/
│           ├── components/
│           │   ├── home/           # Yüksek Düzey Akıllı Arama & AI Hub (HomeSearchHub)
│           │   ├── browser/        # TabBar, AddressBar, TaskSidebar
│           │   ├── agents/         # AI Ajan Konsolu & Onay Ekranı
│           │   ├── projects/       # Proje & Görev Yönetimi
│           │   ├── tools/          # Canlı Web SEO Analizörü
│           │   ├── workflows/      # Görsel İş Akışları & Toplu Kazıma
│           │   ├── history/        # Denetim Günlüğü
│           │   ├── settings/       # Ayarlar
│           │   └── layout/         # Sidebar
│           └── services/
│               └── searchEngine.ts # Yerel matematik, döviz, ansiklopedi ve arama servisi
├── tests/                          # 30 adet Vitest birim testi
├── electron-builder.yml            # Windows NSIS ve portable paketleme yapılandırması
└── package.json
```

---

## 🛠️ Kurulum ve Geliştirme

### Gereksinimler
- **Node.js:** v18+ (Node.js v24 ile test edildi)
- **npm:** v9+
- **İşletim Sistemi:** Windows 10 / 11 (x64)

### 1. Bağımlılıkları Yükleme
```bash
npm install
```

### 2. Geliştirme Modunda Başlatma
```bash
npm run dev
```

### 3. Birim Testleri Çalıştırma
```bash
npm test
```
*Tüm 8 test dosyasında 30 birim testi çalışır ve doğrulanır.*

### 4. Windows Kurulum Paketi (.exe) Üretme
```bash
# Windows NSIS Kurulum Sihirbazı üretir (release/ klasörüne)
npm run dist:win

# Veya kurulumsuz taşınabilir (portable) sürüm:
npm run dist:portable
```

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
