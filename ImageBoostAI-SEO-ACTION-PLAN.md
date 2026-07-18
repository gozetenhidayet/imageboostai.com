# ImageBoostAI — SEO / Indexing / Monetization Action Plan

## 1) Ne hazırlandı (bu pakette)

**`/tools/` klasörü — 35 ayrı, bağımsız sayfa**
Her araç için (`Remove Background`, `Image Upscaler`, `Watermark Remover`... hepsi) kendi URL'i, kendi `<title>`, kendi meta description, kendi H1, kendi FAQ + Breadcrumb + SoftwareApplication structured data'sı olan gerçek bir HTML sayfası oluşturuldu. Örnek:
`imageboostai.com/tools/remove-background.html`
`imageboostai.com/tools/image-upscaler.html`
...35 tanesi de aynı mantıkla.

**Neden bu gerekliydi:** Sitenin ana `index.html` dosyasında **tüm URL varyantları için tek bir canonical etiketi var** (`<link rel="canonical" href="https://imageboostai.com/">`). Bu, Google'a "hangi ?tool= parametresiyle açarsan aç, hepsi aynı sayfa, tek onu indexle" demek. Yani `ItemList` structured data'da 35 aracın linki tanımlı olsa da, canonical etiketi hepsini tek sayfaya indirgiyor — bu yüzden 35 araç ayrı ayrı aranınca çıkmıyor. Her aracın **kendi gerçek, kendine ait, canonical'i kendine işaret eden** bir sayfası olması gerekiyordu — o yüzden bu 35 sayfayı oluşturdum. Her sayfadaki "Open [Tool] — Free →" butonu kullanıcıyı doğrudan ana uygulamada o aracı açık şekilde karşılıyor (`?tool=...#workspace`).

**`sitemap.xml`** — Ana sayfa + 35 araç sayfası, toplam 36 URL.

**`robots.txt`** — Geçerli, basit ve doğru format:
```
User-agent: *
Allow: /

Sitemap: https://imageboostai.com/sitemap.xml
```
PageSpeed raporundaki *"robots.txt is not valid / Lighthouse was unable to download a robots.txt file"* hatasının kaynağı muhtemelen dosyanın hiç yayında olmaması ya da yanlış konumda olması. Bu dosyayı **sitenin kök dizinine** (`https://imageboostai.com/robots.txt` şeklinde erişilecek yere) yüklemen gerekiyor — alt klasöre değil.

## 2) Deploy adımları (senin yapman gerekenler)

1. Bu paketteki `robots.txt` ve `sitemap.xml` dosyalarını sitenin **kök dizinine** yükle.
2. `tools/` klasörünü olduğu gibi sitenin kök dizinine yükle (böylece `imageboostai.com/tools/remove-background.html` çalışır).
3. Search Console → **Sitemaps** → `sitemap.xml` gönder.
4. Search Console → **URL Inspection** ile birkaç tool sayfasını test et → "Request Indexing" ile öne çek.
5. Ana `index.html`'deki şu satırı düzelt (şu an placeholder, gerçek doğrulama Search Console'da başka bir yöntemle yapılmış olabilir ama temizlemek lazım):
   ```html
   <meta name="google-site-verification" content="PASTE_YOUR_GSC_CODE_HERE">
   ```
   Search Console → Settings → Ownership verification → HTML tag'den gerçek kodu al, yapıştır ya da satırı tamamen sil.
6. `IBA_CLARITY_ID='PASTE_CLARITY_ID'` satırı da aynı şekilde placeholder — Microsoft Clarity kullanmayacaksan bu satırı silebilirsin, kullanacaksan gerçek ID'yi ekle.

## 3) PageSpeed / Performance (mevcut skor: 88 mobil)

Zaten iyi durumdasın (Accessibility 100, Best Practices 100, SEO 92). Kalan mobil performans için raporda öne çıkan somut maddeler:

- **Reduce unused JavaScript** (≈38 KiB tasarruf) — 5700 satırlık tek dosyada muhtemelen kullanılmayan/geç kullanılan kod var. En büyük kazanım: araç panellerini (`showObjectAddPanel`, `showAIBGGeneratorPanel` gibi 30+ fonksiyon) tek seferde değil, kullanıcı o aracı açtığında `import()` ile **lazy-load** etmek.
- **Forced reflow (32ms)** — bir yerde JS, DOM stilini değiştirdikten hemen sonra `offsetWidth`/`offsetHeight` gibi bir geometri özelliği okuyor. Chrome DevTools → Performance panel → "record a trace" ile tam satırı bulup okuma/yazma işlemlerini ayırman (`requestAnimationFrame` ile batch'lemek) gerekiyor — kod 5700 satır olduğu için kaynağı görmeden kör tahmin yapmak yanlış olur, DevTools trace'i çekip bana gönderirsen tam satırı bulup düzeltebilirim.
- **First Contentful Paint / Largest Contentful Paint: 3.0s** (turuncu) — muhtemelen yukarıdaki JS azaltımıyla birlikte iyileşir. Ayrıca kritik olmayan script'leri (Google Translate, AdSense, Analytics) `defer`/`async` ile geç yükletmeye devam et (şu an consent-mode zaten doğru kurulmuş, bu iyi).

## 4) AdSense uygunluğu

Kodda AdSense client ID zaten tanımlı (`ca-pub-3359266836868361`) ve doğru şekilde sadece kullanıcı onayından sonra yükleniyor (Consent Mode v2) — bu iyi bir pratik. Onay için kontrol listesi:

- [ ] **Privacy Policy sayfası** var mı ve footer'dan linkli mi? (AdSense onayı için zorunlu.)
- [ ] **Terms of Service / Kullanım Şartları** sayfası.
- [ ] **`ads.txt`** dosyası kök dizinde: `google.com, pub-3359266836868361, DIRECT, f08c47fec0942fa0`
- [ ] Her sayfada yeterli **orijinal metin içeriği** var mı (araç sayfası + basit buton yetmez; bu yüzden 35 sayfaya gerçek, benzersiz metin ekledim — "thin content" riskini azaltmak için).
- [ ] Site trafiği ve en az birkaç haftalık organik geçmişi olması genelde onay şansını artırır.

## 5) Mobil uyumluluk

PageSpeed raporunda Accessibility 100 ve mobil skor zaten ölçülüyor — yapısal bir mobil sorun görünmüyor. `viewport` etiketi doğru tanımlı. Gerçek cihazda (özellikle düşük uçlu Android) test etmeni öneririm; "Agentic Browsing 2/2" ve "Best Practices 100" zaten sağlıklı bir temel olduğunu gösteriyor.

## 6) Amazon/Walmart/eBay tarzı "profesyonel" görünüm için

Bu üç site kullanıcıya güven verme ve satın alma huninde şu unsurları öne çıkarır — ImageBoostAI'da karşılığı:
- **Güven rozetleri** (No login / Files never uploaded / 100% free) → her araç sayfasına eklendi.
- **Breadcrumb navigasyon** → her araç sayfasına eklendi (Home / Category / Tool).
- **İlgili ürünler / "More tools in this category"** → her sayfanın altında eklendi (Amazon'daki "related products" mantığı — hem kullanıcıyı sitede tutar hem iç link SEO'suna yardımcı olur).
- **FAQ bölümü** → her sayfada var, hem kullanıcı güveni hem Google'da FAQ rich snippet şansı için.

Sıradaki adım olarak istersen her araç sayfasına gerçek "before/after" örnek görseller ve kullanıcı yorumları/derecelendirme bloğu da ekleyebilirim — bunlar dönüşüm oranını ciddi artırır ama gerçek görsel/yorum verisi gerektirir.
