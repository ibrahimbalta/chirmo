// Chirmo Gemini AI Teacher Service
// Google Gemini API Entegrasyonu & Pedagojik Konuşma Asistanı

export interface ChatMessage {
  id: string;
  sender: 'user' | 'chirmo';
  text: string;
  timestamp: string;
}

export class GeminiAiTeacherService {
  private static STORAGE_KEY = 'chirmo_gemini_api_key';
  private static DEFAULT_KEY =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';

  public static getApiKey(): string {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved && saved.trim() ? saved.trim() : this.DEFAULT_KEY;
  }

  public static setApiKey(key: string): void {
    localStorage.setItem(this.STORAGE_KEY, key.trim());
  }

  /**
   * Gemini API ile canlı konuşma yanıtı üretir.
   * Hata veya kota durumunda kesintisiz akıllı yerel pedagoji motoruna geçer.
   */
  public static async generateTutorResponse(
    userMessage: string,
    history: ChatMessage[] = [],
    scenario: string = 'Günlük Sohbet & Restoran'
  ): Promise<{ text: string; source: 'gemini' | 'pedagogy_fallback'; info?: string }> {
    const apiKey = this.getApiKey();

    const systemPrompt = `Sen "Chirmo", kullanıcıların İngilizce konuşma korkusunu yenmelerini sağlayan, arkadaş canlısı, neşeli ve cesaretlendirici bir yapay zekâ İngilizce öğretmenisin.
Şu anki Senaryo / Odak: "${scenario}".
Kullanıcının Mesajı: "${userMessage}".

Kurallar:
1. Cevabın kısa, samimi ve motive edici olsun (en fazla 2-3 cümle).
2. Kullanıcının seviyesine uygun İngilizce bir cümle kur, hemen ardından parantez içinde veya altında Türkçe açıklamasını yaz.
3. Kullanıcıya konuşmaya devam etmesi için basit bir İngilizce soru yönelt.
4. Asla kullanıcıyı azarlama; hata yaptıysa nazikçe doğrusunu göster ve övgüde bulun.`;

    // 1. Canlı Google Gemini API Çağrısı Denemesi
    if (apiKey) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];

      for (const model of modelsToTry) {
        try {
          const contents = [
            ...history.slice(-4).map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }]
            })),
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nKullanıcı: ${userMessage}` }]
            }
          ];

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents })
            }
          );

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply && reply.trim()) {
              return { text: reply.trim(), source: 'gemini' };
            }
          }
        } catch {
          // Devam et, fallback devreye girsin
        }
      }
    }

    // 2. Akıllı Pedagojik Yanıt Motoru (Kesintisiz Kullanıcı Deneyimi Fallback)
    const lower = userMessage.toLowerCase();
    let fallbackText = '';

    if (lower.includes('sipariş') || lower.includes('order') || lower.includes('restoran') || lower.includes('menu')) {
      fallbackText = `Welcome to our cozy restaurant! 🍽️ What would you like to have today? (Hoş geldiniz! Bugün ne sipariş etmek istersiniz?)\n\nÖrnek cevap: *"I would like to have a coffee, please."*`;
    } else if (lower.includes('merhaba') || lower.includes('hello') || lower.includes('hi')) {
      fallbackText = `Hello my friend! 👋 It is a wonderful day to speak English! How are you feeling today? (Merhaba dostum! Bugün İngilizce konuşmak için harika bir gün! Kendini nasıl hissediyorsun?)`;
    } else if (lower.includes('kahve') || lower.includes('coffee') || lower.includes('su') || lower.includes('water')) {
      fallbackText = `Great choice! *"Here is your fresh coffee, enjoy!"* ☕ (Harika bir seçim! İşte taze kahveniz, afiyet olsun!) Do you like your coffee with milk or sugar?`;
    } else if (lower.includes('yardım') || lower.includes('help') || lower.includes('nasıl')) {
      fallbackText = `I am always here to help you! 🌟 Don't be afraid to make mistakes; practicing is the secret. What word would you like to learn now? (Her zaman yanındayım! Hata yapmaktan asla çekinme; pratik yapmak başarının anahtarıdır.)`;
    } else {
      fallbackText = `That is very interesting! 👏 You expressed yourself clearly. Let's practice one more sentence: Can you tell me what your favorite hobby is? (Çok ilginç! Kendini çok net ifade ettin. Bir cümle daha pratik yapalım: Bana en sevdiğin hobini söyleyebilir misin?)`;
    }

    return {
      text: fallbackText,
      source: 'pedagogy_fallback',
      info: 'Gemini API anahtarı tanımlandı. Google AI Studio projesinde kota/ücretli katman açıldığında doğrudan canlı bulut yanıtı verir.'
    };
  }
}
