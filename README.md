# Film Cehennemi - HD Film Platformu

Hdfilmcehennemi.nl tarzında, modern, hızlı ve tam otomatik film platformu. Next.js, Cloudflare Pages ve Supabase ile ücretsiz çalışır.

## 🚀 Teknolojiler

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes (Edge Runtime)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Cloudflare Pages (Ücretsiz)
- **Scraping**: Cheerio + Fetch

## 🆓 Ücretsiz Kullanım

- **Cloudflare Pages**: $0 (limitsiz bandwidth)
- **Supabase Free Tier**: $0 (500MB veritabanı)
- **Domain**: $0 (Cloudflare subdomain)

## 📋 Sırayla Yapman Gerekenler

### Adım 1: Hesap Aç

1. [GitHub](https://github.com) hesabı oluştur veya mevcut hesabını kullan
2. [Cloudflare](https://dash.cloudflare.com) hesabı oluştur
3. [Supabase](https://supabase.com) hesabı oluştur

### Adım 2: Supabase Projesi Kur

1. Supabase Dashboard → New Project → Proje oluştur
2. Sol menüden **SQL Editor** aç
3. Bu proje içindeki `database/schema.sql` dosyasını aç
4. Tüm SQL kodunu kopyala ve SQL Editor'e yapıştır
5. **Run** butonuna tıkla
6. Sol menüden **Table Editor** aç ve `categories` tablosunda varsayılan türlerin geldiğini kontrol et

### Adım 3: Supabase Anahtarlarını Al

1. Supabase Dashboard → sol menüden **Project Settings** → **API**
2. Şu değerleri kopyala:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (Secrets bölümünde)

### Adım 4: Projeyi Bilgisayarına İndir

```bash
# GitHub'dan klonla (kendi reponu oluşturduktan sonra)
git clone https://github.com/kullaniciadi/film-platform.git
cd film-platform
```

### Adım 5: Bağımlılıkları Kur

```bash
npm install --legacy-peer-deps
```

### Adım 6: Çevre Değişkenlerini Ayarla

1. Proje klasöründe `.env.local.example` dosyasını kopyala
2. Yeni dosyayı `.env.local` olarak adlandır
3. Şu değerleri doldur:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET_KEY=your-admin-secret-key
SCRAPING_DELAY=2000
MAX_CONCURRENT_REQUESTS=5
```

### Adım 7: Film Çekme İşlemini Çalıştır

Tekil film çekmek için:

```bash
npm run scrape:single https://www.hdfilmcehennemi.nl/film-adi/
```

Tüm siteyi çekmek için:

```bash
npm run scrape
```

> **Not**: Bu işlem 15-30 dakika sürebilir. Supabase'e filmler kaydedilecektir.

### Adım 8: Yerel Sunucuyu Başlat ve Kontrol Et

```bash
npm run dev
```

Tarayıcıdan `http://localhost:3000` adresine git. Filmlerin yüklendiğini kontrol et.

### Adım 9: GitHub Repository'sine Yükle

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/kullaniciadi/film-platform.git
git push -u origin main
```

### Adım 10: Cloudflare API Token Al

1. Cloudflare Dashboard → sağ üstten profil simgesi → **My Profile**
2. Sol menüden **API Tokens** → **Create Token**
3. **Custom token** şablonunu kullan
4. İzinler:
   - **Zone:Read** (eğer kendi domainin varsa)
   - **Cloudflare Pages:Edit**
   - **Account:Read**
5. Token oluştur ve kopyala

### Adım 11: GitHub Secrets Ekle

1. GitHub repo'na git → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** ile şunları ekle:

   - `CLOUDFLARE_API_TOKEN` → Adım 10'da aldığın token
   - `CLOUDFLARE_ACCOUNT_ID` → Cloudflare Dashboard sağ alt köşede görünür
   - `CLOUDFLARE_PAGES_PROJECT_NAME` → Oluşturacağın proje adı (örn: `film-platform`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_SECRET_KEY`
   - `SCRAPING_DELAY` → `2000`
   - `MAX_CONCURRENT_REQUESTS` → `5`

### Adım 12: Cloudflare Pages Projesini Oluştur

1. Cloudflare Dashboard → **Pages** → **Create a project**
2. **Connect to Git** seç
3. GitHub hesabını ve reponu seç
4. **Framework preset**: Next.js
5. Deploy ayarları otomatik gelecek. **Save and Deploy** yerine önce **Build settings** kontrol et:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
6. **Environment variables** bölümünde Adım 11'deki değerleri ekle
7. **Save and Deploy** tıkla

### Adım 13: Otomatik GitHub Actions Deploy

Proje zaten `.github/workflows/deploy-cloudflare-pages.yml` içeriyor. Her `main` branch'e push yaptığında otomatik deploy olur. İlk deploy:

1. Cloudflare Dashboard → **Pages** → Proje adı
2. **Deployments** sekmesinden durumu izle
3. Başarılı olduğunda verilen URL'den siteye eriş

## 🤖 Otomatik Film Çekme

### Admin Panel (Yalnızca Yerel)

1. `http://localhost:3000/admin/` adresine git
2. `ADMIN_SECRET_KEY` değerini gir
3. Tekil URL veya tam site çek seçeneklerini kullan

> **Cloudflare Pages ücretsiz planında scraping API sınırlıdır.** Büyük scraping işlemlerini yerel bilgisayarından çalıştır.

### Komut Satırı Kullanımı

```bash
# Tekil film çek ve kaydet
npm run scrape:single https://www.hdfilmcehennemi.nl/film-adi/

# Tüm siteyi tara ve kaydet
npm run scrape
```

## 🗂️ Proje Yapısı

```
film-platform/
├── .github/workflows/    # GitHub Actions deploy pipeline
├── database/
│   └── schema.sql       # Supabase veritabanı şeması
├── public/              # Statik dosyalar
├── scripts/
│   ├── scrape.js        # Tam scraping scripti
│   └── scrape-single.js # Tekil scraping scripti
├── src/
│   ├── app/             # Next.js App Router sayfaları
│   ├── components/      # React bileşenleri
│   ├── lib/             # Supabase, scraper, utils
│   └── types/           # TypeScript tipleri
└── README.md
```

## 🎨 Özellikler

- ✅ Hdfilmcehennemi.nl benzeri karanlık modern tasarım
- ✅ Otomatik film scraping (yerel çalıştırma)
- ✅ Kategori ve yıl bazlı filtreleme
- ✅ Arama fonksiyonu
- ✅ IMDb 7+ film koleksiyonu
- ✅ Türkçe dublaj / altyazı filtreleri
- ✅ Responsive mobil uyumlu
- ✅ Cloudflare Pages edge fonksiyon desteği
- ✅ Admin panel
- ✅ SEO uyumlu metadata

## 🛠️ Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Standart build (yerel test)
npm run build

# Cloudflare Pages build (GitHub Actions'ta çalışır)
npm run pages:build

# TypeScript kontrolü
npx tsc --noEmit

# Lint
npm run lint
```

## 📱 Route Haritası

- `/` - Ana sayfa
- `/films/` - Tüm filmler
- `/latest/` - Yeni eklenenler
- `/imdb/` - IMDb 7+ filmler
- `/tur/[slug]/` - Kategori sayfası
- `/yil/[year]/` - Yıl sayfası
- `/search/?search=...` - Arama
- `/film/[slug]/` - Film detay
- `/admin/` - Admin panel

## 📝 Önemli Notlar

- **Scraping işlemi uzun sürebilir** (15-30 dakika). Cloudflare Pages ücretsiz CPU limiti nedeniyle scraping'i yerel bilgisayarında çalıştır.
- **Supabase 500MB limit** ile yaklaşık 2,500 film kapasitesi olur.
- **Cloudflare Pages limitsiz bandwidth** sağlar.
- **Düzenli scraping** için bilgisayarınızda bir cron job veya Windows Task Scheduler kullanabilirsiniz.

## 🎯 Sonraki Geliştirmeler

1. Film oynatıcı entegrasyonu
2. Kullanıcı yorum sistemi
3. Favoriler listesi
4. Daha gelişmiş arama ve filtreleme
5. Reklam alanları (Google AdSense)
