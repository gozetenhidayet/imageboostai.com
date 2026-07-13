# ImageBoostAI — Yapılan Düzeltmeler (13 Temmuz 2026)

## ✅ Tamamlanan 5 madde

### 1. Contact Form + Newsletter — artık gerçekten gönderiyor
- Önceden: "Message sent" / "Subscribed" yazıyordu ama hiçbir yere gitmiyordu.
- Şimdi: FormSubmit.co üzerinden `contact@imageboostai.com` adresine gerçek e-posta gidiyor.
- **YAPMAN GEREKEN:** İlk gönderimde FormSubmit sana bir onay maili atacak, o maildeki linke bir kez tıklaman gerekiyor (aktivasyon). E-posta adresi farklıysa `index.html` içinde `IBA_CONTACT_EMAIL` değişkenini değiştir.
- Not: Bu geçici/no-backend bir çözüm. Gerçek liste yönetimi (abonelikten çıkma linki, double opt-in vs.) için Mailchimp/Brevo gibi bir ESP'ye geçmen önerilir — kod hazır, sadece fetch URL'i değişecek.

### 2. Cookie Consent — artık yasal olarak anlamlı
- Önceden: GA4/Clarity/AdSense "Accept"ten ÖNCE yükleniyordu, "Decline" hiçbir şeyi durdurmuyordu.
- Şimdi: Google Consent Mode v2 kullanılıyor. Hiçbir analiz/reklam scripti kullanıcı onay vermeden çalışmıyor.
  - **Accept all** → Analytics + Advertising açılır
  - **Reject non-essential** → hiçbiri çalışmaz
  - **Manage preferences** → Analytics ve Advertising ayrı ayrı açılıp kapanabilir
  - Seçim `localStorage`'da saklanıyor, sayfa yenilenince tekrar uygulanıyor.
- Bu, GDPR açısından çok daha savunulabilir bir yapı ama ben avukat değilim — AB trafiğin ciddiyse bir hukuk danışmanına gösterip onaylatman iyi olur.

### 3. HEIC / GIF / Dosya Boyutu — artık gerçek, iddialar doğru
- HEIC dosyaları artık `heic2any` kütüphanesiyle gerçekten JPEG'e çevriliyor (önceden hiç converter yoktu).
- GIF yüklenince kullanıcıya "sadece ilk kare düzenlenecek, animasyon korunmayacak" uyarısı çıkıyor.
- **25MB dosya boyutu / 40 megapiksel** sınırı artık gerçekten kontrol ediliyor ve aşılırsa kullanıcı net bir hata mesajı görüyor (önceden "her boyutta" deniyordu, hiç kontrol yoktu).
- Tüm ilgili metinler (üst kısım, FAQ, EN+TR) doğru bilgiyi yansıtacak şekilde güncellendi.

### 4. GSC / Clarity / AdSense placeholder'ları — işaretlendi, senin bilgin gerekiyor
Bunlar hesabına özel değerler, ben üretemem:
| Alan | Nerede | Nereden alınır |
|---|---|---|
| GSC doğrulama kodu | `<meta name="google-site-verification">` | search.google.com/search-console → Add property → HTML tag |
| Clarity Project ID | `IBA_CLARITY_ID` değişkeni | clarity.microsoft.com → Settings → Setup |
| AdSense slot ID'leri | Yorum satırına alındı (`<!-- ... -->`) | AdSense → Ads → By ad unit → Create |

Sahte slot ID'ler (`1234567890`, `2345678901`) kaldırıldı — bunlar geçersiz reklam birimi olarak işaretlenip hesabına zarar verebilirdi. Şu an Auto Ads (slot ID gerektirmez) devrede; gerçek slot ID'leri oluşturunca yorumdaki blokları açabilirsin.

### 5. SEO — 35 ayrı gerçek sayfa + sitemap.xml + robots.txt
Her araç artık kendi URL'sinde gerçek bir sayfa:
```
/remove-background/
/image-upscaler/
/photo-restorer/  → /ai-photo-restore/
...  (35 sayfa toplam)
```
Her sayfada:
- Benzersiz `<title>`, `<meta description>`, `canonical`
- `BreadcrumbList`, `SoftwareApplication`, `FAQPage` structured data (JSON-LD, doğrulandı)
- Kısa açıklama + "nasıl çalışır" adımları + FAQ
- Gerçek editöre giden buton (`/?tool=...`)

`sitemap.xml` tüm 36 URL'i (ana sayfa + 35 araç) listeliyor. `robots.txt` sitemap'e işaret ediyor.

**YAPMAN GEREKEN:** Bu sayfaları sunucuna `imageboostai.com` kök dizinine yükle (her klasör = bir URL yolu). Yükleyince Search Console'da sitemap'i submit et.

---

## ⚠️ Henüz dokunmadığım, ama bilmen gereken büyük konu

**35 aracın çoğu gerçek AI değil.** Kodda şu satır var:
> `// Simulate AI result (same image for demo - real AI API needed for actual transformation)`

Yani "Remove Background", "AI Photo Restore", "Object Remover" gibi araçlar şu an görseli olduğu gibi geri veriyor (bazen bir CSS filtresiyle), gerçek bir AI modeli çağırmıyor. Gerçekten çalışan (client-side, gerçek algoritma) olanlar: **Crop, Resize, Compress, Convert, Add Text, Watermark Maker, Brightness/Contrast**.

Bunu düzeltmek için gerçek bir AI API'ye (ör. remove.bg, Replicate, Stability AI) bağlanman ve muhtemelen bir backend/proxy kurman gerekiyor — bu maliyetli ve kapsamı bu düzenlemenin çok üstünde. Sayfa metinlerinde bu artık gizlenmiyor: her araç sayfasında (bkz. madde 5) gerçek olmayan araçlar için dürüst bir not var. ---

## 🔗 GÜNCELLEME — "HEPSINI BAGLA" (13 Temmuz 2026, devam)

Dosyayı yeniden inceledim ve aslında önceki bir çalışmada (bu dosyanın içinde "ROUND 7/10" gibi yorumlarla işaretli) zaten çoğu araç gerçek algoritmalara bağlanmıştı — arka plan kaldırma gerçek bir AI modeli (TensorFlow.js DeepLab + imgly, tarayıcıda, key gerekmeden) kullanıyordu, OCR gerçek Tesseract.js kullanıyordu, keskinleştirme/gürültü giderme/renk düzeltme/obje silme gerçek algoritmalarla çalışıyordu.

**Gerçekten hâlâ sahte olan 8 aracı** buldum ve gerçek işlem zincirlerine bağladım:

| Araç | Önce | Şimdi |
|---|---|---|
| Photo Enhancer | Sabit CSS filtresi | Gerçek histogram auto-levels (per-kanal) |
| AI Photo Restore | Sabit sepia filtresi | Gerçek zincir: denoise → auto-levels → sararma düzeltme → keskinleştirme |
| Remove Blur | Sabit filtre | Gerçek güçlü unsharp-mask |
| Portrait Enhancer | Sabit filtre | Gerçek ten-tonu-farkında yumuşatma + oto renk düzeltme |
| Watermark Remover | Sabit filtre | Object Remover ile aynı gerçek fırça-seç + blur-fill motoru |
| AI Background Generator | Sabit degrade | Gerçek AI kesim (aynı model) + 6 küratörlü stüdyo arka planı |
| AI Headshot | Sabit degrade | Gerçek AI kesim + stüdyo arka planı + oto renk düzeltme |
| Object Add | Sabit sticker konumu | Gerçek, interaktif: sticker seç + X/Y/boyut kaydırıcılarıyla yerleştir |

**Sonuç: 35 aracın hepsi artık gerçek, deterministik bir işlem yapıyor** — kimi gerçek bir AI modeli (arka plan kaldırma, OCR), kimi gerçek klasik algoritma (histogram, unsharp mask, fırça-seçim). Hiçbiri artık "aynı görseli geri döndürüyor" değil.

### Bunun ötesi: gerçek generative AI (opsiyonel, ücretli)
Bazı araçlar (obje silme, upscale, restore, colorize, headshot) generative AI ile *daha da* iyi sonuç verebilir (bağlamsal doldurma, gerçek süper-çözünürlük, otomatik tam renklendirme). Bunun için `server/` klasöründe hazır bir Node/Express backend şablonu var — Clipdrop ve Replicate API'lerine bağlanıyor. Kurulumu `server/README.md`'de. **Kendi API key'lerini eklemen gerekiyor** (Clipdrop/Replicate hesapları ücretli, ben senin adına açamam) — key'leri sağlarsan frontend bağlantısını da tamamlayabilirim.

