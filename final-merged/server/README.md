# ImageBoostAI — Opsiyonel Backend (gerçek generative AI yükseltmesi)

Bu klasör **opsiyonel**. Ana site (`/index.html` ve 35 araç sayfası) bu backend olmadan da tamamen çalışır — hepsi ya gerçek, tarayıcı-içi AI modeli (arka plan kaldırma, OCR) ya da gerçek klasik algoritmalarla (keskinleştirme, gürültü giderme, obje silme/fırça seçimi, restore, vs.) çalışıyor.

Bu backend'i sadece şu araçları **gerçek generative AI** kalitesine çıkarmak istersen kur:

| Araç | Şu an | Backend ile |
|---|---|---|
| Object Remover / Magic Eraser / AI Inpainting | Fırça-seçim + blur-fill | Clipdrop Cleanup — bağlamsal, gerçekten "dolduran" AI |
| AI Outpainting | Ayna-yansıma ile kenar uzatma | Clipdrop Uncrop — gerçek üretici genişletme |
| Image Upscaler | Yumuşak büyütme + keskinleştirme | Clipdrop Upscaling — gerçek süper-çözünürlük |
| AI Photo Restore | Klasik denoise+leveling zinciri | Replicate (GFPGAN vb.) — eğitilmiş restorasyon modeli |
| Colorize Old Photo | Manuel ton seçimi | Replicate (DeOldify vb.) — otomatik, nesne-bazlı renklendirme |
| AI Headshot / AI Background Generator | Gerçek kesim + hazır stüdyo arka planı | Replicate/Stability — gerçek metin-den-görsele üretim |

## Kurulum

```bash
cd server
npm install
cp .env.example .env
# .env içine kendi Clipdrop / Replicate API key'lerini yapıştır
npm start
```

- Clipdrop key: https://clipdrop.co/apis (ücretli, ücretsiz kotası var)
- Replicate token: https://replicate.com/account/api-tokens (kullanım başına ücretli)

Backend `http://localhost:3001` üzerinde çalışır. Gerçek kullanımda bunu Vercel/Render/Fly.io gibi bir yere veya kendi sunucuna deploy edip HTTPS ile yayınlaman gerekir — **API key'leri asla frontend'e (index.html) koyma**, sayfa kaynağından anında çalınır.

## Frontend'i bağlama

`index.html` içinde ilgili aracın `apply...()` fonksiyonunu bul, canvas işlemi yerine backend'e `fetch()` çağrısı yaptır. Örnek (Object Remover'ı gerçek Clipdrop Cleanup'a bağlamak):

```js
async function applyObjectRemover(){
  const maskCanvas = _getActiveSelectionMask(im.width, im.height);
  const res = await fetch('https://senin-backend-adresin.com/api/cleanup', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      image_base64: imageData,
      mask_base64: maskCanvas.toDataURL('image/png')
    })
  });
  const {image_base64} = await res.json();
  // image_base64'ü _downloadReady(image_base64,'png') ile göster
}
```

Her endpoint için tam kod `server/index.js` içinde hazır — sadece kendi API key'lerini eklemen ve frontend'teki ilgili fonksiyonu bu fetch çağrısıyla değiştirmen yeterli. İstersen bir sonraki adımda bu bağlamayı senin için de yapabilirim, key'leri sağladıktan sonra.
