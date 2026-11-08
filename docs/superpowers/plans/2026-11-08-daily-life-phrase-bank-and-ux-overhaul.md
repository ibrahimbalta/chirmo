# Daily Life Phrase Bank and Zero-Confusion UX Overhaul Implementation Plan

Bu plan, Türkiye'deki kullanıcıların yabancı dil konuşamama engellerini (gramer ezberi, zihinde kelime çevirisi, karmaşık arayüzler) ortadan kaldırmak için devasa günlük yaşam kelime/cümle deposunu ve sıfır kafa karışıklığı sunan akıcı kullanıcı deneyimini hayata geçirir.

## User Review Required

> [!IMPORTANT]
> - Hem İngilizce (🇬🇧) hem Almanca (🇩🇪) için 12 hayati yaşam kategorisinde zengin günlük yaşam konuşma kalıbı ve kelimesi sisteme entegre edilecek.
> - Her kalıpta sesli dinleme, Türkçe mantık/kültür tüyosu ve mikrofondan konuşarak deneme imkanı sağlanacak.
> - Navigasyon 4 kristal netliğindeki ana sütun üzerine optimize edilerek sayfalar arasındaki karmaşa sonlandırılacak.

---

## Proposed Changes

### 1. Yeni Servis: `lifePhraseBankService.ts`
- **Konum:** `src/renderer/src/services/lifePhraseBankService.ts`
- 12 Hayati Kategori:
  1. `cafe_dining`: Kafe & Restoran (Sipariş, Hesap, Alerji, Paket isteme)
  2. `travel_transit`: Taksi, Ulaşım, Metro, Havalimanı, Yol Sorma
  3. `shopping_bargain`: Alışveriş, Mağaza, Fiyat Sorma, Beden, İade
  4. `hotel_stay`: Otel, Check-in, Oda Sorunları, Rezervasyon
  5. `health_emergency`: Eczane, Hastane, Ağrı/Sancı Tarifi, Acil Yardım
  6. `social_making_friends`: Tanışma, Sohbet Başlatma, İltifat, Vedalaşma
  7. `work_professional`: Ofis, Günlük İş Yaşamı, E-posta Kalıpları, Toplantı
  8. `feelings_reactions`: Duygular, Katılma/Katılmama, Şaşırma, Tepkiler
  9. `quick_fillers`: Doğal Konuşma Dolguları (Actually, Well, Anyway, Genau...)
  10. `home_daily_routines`: Ev İçi Yaşam, Market, Yemek Pişirme
  11. `bank_official`: Banka, Para Çekme/Bozdurma, Fatura, Bürokrasi
  12. `slang_idioms`: Yerli Gibi Konuşma Deyimleri ve Sokak Dili
- Fonksiyonlar:
  - `getPhrases(filter)`: Kategoriye, dile (EN/DE), zorluğa ve arama terimine göre listeleme.
  - `getCategories()`: 12 ana kategori listesi ve ikonları.
  - `toggleMasteredPhrase(id)`: Öğrenildi işaretleme ve ilerleme takibi.
  - `getMasteredCount()`: 30 günlük hedef için ustalaşılan kalıp sayısı.

### 2. Yeni Arayüz Bileşeni: `LifePhraseBankView.tsx`
- **Konum:** `src/renderer/src/components/learning/LifePhraseBankView.tsx`
- Arama ve anında filtreleme.
- Kategori hapları (Chips) ile tek tıkla geçiş.
- Dil geçişi (🇬🇧 İngilizce / 🇩🇪 Almanca).
- Fonetik telaffuz ipucu ("Nasıl okunur?").
- "Neden Böyle Söylenir? (Türkçe Mantık Tuzağı)" açıklama kartı.
- Sesli telaffuz düğmesi (Web Speech API).
- Mikrofondan sesli tekrar düğmesi (SpeechRecognition) ve anında eşleşme geri bildirimi.
- "Ezberledim / Refleks Oldu" butonu ile XP kazanma.

### 3. Ana Navigasyonun Sadeleştirilmesi: `App.tsx`
- Üst kapsüldeki karmaşık butonları 4 ana sütuna indirgeme:
  1. 🎯 **30 Günlük Kamp** (`learn`): Günün 10 dakikalık konuşma görevi.
  2. 📚 **Konuşma Deposu** (`phrases`): Hayat kurtaran devasa kalıp ve kelime bankası.
  3. 🎭 **Simülatör** (`speak`): Korkusuzca rol yapma stüdyosu.
  4. 🎬 **Film & Video** (`video`): Shadowing stüdyosu.
- Diğer modülleri (Kids, Oyunlar, Stüdyo, Hedefler) temiz bir "Daha Fazlası" açılır menüsüne bağlayarak ekranı ferahlatma.

### 4. Testler: `tests/life-phrase-bank.test.ts`
- Kategori filtreleme testleri.
- İngilizce ve Almanca veri bütünlüğü testleri.
- Arama motoru testleri (Türkçe veya yabancı kelimeyle arama).
- İlerleme kaydetme/okuma testleri.

---

## Verification Plan

### Automated Tests
- `npm test` ile tüm vitest testlerini çalıştırma (201+ testin tamamının geçmesi).
- `tests/life-phrase-bank.test.ts` test dosyasının doğrulanması.

### Manual / Browser Verification
- `npm run build` ile projenin hatasız derlenmesi.
- `npm run deploy` ile Firebase Hosting'e (`https://chirmo-f95a0.web.app`) yüklenmesi ve canlı ortamda incelenmesi.
