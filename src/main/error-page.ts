export function generateErrorPage(
  failedUrl: string,
  errorCode: number,
  errorDescription: string
): string {
  const getFriendlyExplanation = (desc: string) => {
    if (desc.includes('NAME_NOT_RESOLVED')) {
      return 'Sunucu adresi bulunamadı. Lütfen web adresini doğru yazdığınızdan emin olun.';
    }
    if (desc.includes('INTERNET_DISCONNECTED')) {
      return 'İnternet bağlantısı kesildi. Lütfen ağ bağlantınızı kontrol edin.';
    }
    if (desc.includes('CONNECTION_REFUSED')) {
      return 'Hedef sunucu bağlantıyı reddetti. Site geçici olarak kapalı olabilir.';
    }
    if (desc.includes('TIMED_OUT')) {
      return 'Sunucu yanıt vermedi ve işlem zaman aşımına uğradı.';
    }
    if (desc.includes('CERT')) {
      return 'Güvenlik sertifikası geçersiz veya güvenilir bulunamadı.';
    }
    return `Sayfa yüklenirken bir ağ veya sunucu hatası oluştu (${errorDescription}).`;
  };

  const explanation = getFriendlyExplanation(errorDescription);

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Sayfaya Ulaşılamıyor - Chirmo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #F5F6FA;
      color: #252631;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E5E7EF;
      border-radius: 16px;
      padding: 36px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
      text-align: center;
    }
    .icon {
      width: 54px;
      height: 54px;
      background: #FEE2E2;
      color: #EF4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
      font-size: 26px;
    }
    h1 {
      font-size: 18px;
      font-weight: 700;
      color: #252631;
      margin-bottom: 8px;
    }
    p {
      font-size: 13px;
      color: #777987;
      line-height: 1.6;
      margin-bottom: 18px;
    }
    .code {
      font-family: monospace;
      font-size: 11px;
      background: #F5F6FA;
      padding: 6px 12px;
      border-radius: 6px;
      color: #777987;
      display: inline-block;
      margin-bottom: 24px;
      word-break: break-all;
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    button, a {
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      padding: 9px 18px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #6652C9;
      color: #FFFFFF;
      border: none;
    }
    .btn-primary:hover {
      background: #5541B8;
    }
    .btn-secondary {
      background: #F5F6FA;
      color: #252631;
      border: 1px solid #E5E7EF;
    }
    .btn-secondary:hover {
      background: #E5E7EF;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⚠️</div>
    <h1>Bu Sayfaya Ulaşılamıyor</h1>
    <p>${explanation}</p>
    <div class="code">Hata Kodu: ${errorDescription} (${errorCode})<br>URL: ${failedUrl}</div>
    <div class="actions">
      <button class="btn-primary" onclick="window.location.href='${failedUrl}'">Yeniden Dene</button>
      <a class="btn-secondary" href="https://www.google.com/search?q=${encodeURIComponent(failedUrl)}">Google'da Ara</a>
    </div>
  </div>
</body>
</html>`;

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}
