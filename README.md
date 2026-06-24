# 🌐 Me In These Days — Kişisel Portföy & "Now" Sayfası

Bu proje, **Enes Kaya**'nın kişisel portföy ve güncel yaşam snapshot'ını (Now) sunan modern, etkileşimli ve çift temalı bir web sitesidir. Ziyaretçileri karşılayan interaktif bir seçim ekranıyla başlayan site, iki farklı görsel ve işitsel deneyim sunar.

---

## ✨ Öne Çıkan Özellikler

### 🎮 Çift Tema Seçimi (Matrix / Renkli Dünya)
Ziyaretçiler siteye girdiğinde Matrix filmindeki kırmızı ve mavi hap seçiminden ilham alan interaktif bir ekranla karşılanır:
* **🔵 Mavi Hap (Renkli Dünya):** Yumuşak cam tasarımı (Glassmorphism), dinamik arka plan akışkanları (fluid blobs), kaydırdıkça renk değiştiren degradeler ve sevimli chibi sticker süslemeleri.
* **🟢 Kırmızı Hap (Matrix Modu):** Klasik terminal yazı tipi (Courier New), yeşil parlamalar, arka planda akan Matrix kod yağmuru (`canvas`), retro müzik çalar ve özel Matrix tema müziği (`preload` ve `fade-in/out` geçişli).

### 💧 Gelişmiş Su Dalgası (Ripple) Geçişi
Hap seçimi yapıldığında, tıklanan koordinattan başlayarak tüm ekranı kaplayacak şekilde genişleyen, CSS `backdrop-filter` ve `box-shadow` yansımalarıyla donatılmış **optik su dalgalanma kırılması** geçiş efekti uygulanır. Seçilen tema arka planda anında güncellenerek kesintisiz bir animasyon sunar.

### 🍱 Bento Grid Tasarım
Bilgiler ve ilgi alanları modern ve şık bir Bento Grid düzeninde sunulmaktadır:
* **Öğreniyorum / Okuyorum / Son Katılınan Etkinlikler**
* **🎧 Dinliyorum:** Spotify tadında güncel şarkı rotasyonu.
* **📺 Şu An İzliyorum / 🎬 Favori Filmim:** IMDb detay sayfasına giden bağlantılar.
* **🏃 Yaptığım Sporlar (Fitness & Koşu):** Görsellere tıklandığında açılan özel görsel büyütme (Lightbox) aracı.
* **🎓 Eğitim Durumu:** Balıkesir Üniversitesi Bilgisayar Mühendisliği bilgileri.

### ⚡ Performans ve Optimizasyon
* **Sıfır Ağır Kütüphane:** Proje tamamen saf JavaScript (Vanilla JS) ve CSS ile yazılmıştır.
* **Görsel Sıkıştırma:** Tüm sticker ve medya görselleri kaliteleri bozulmadan PNG formatında sıkıştırılmış ve toplam görsel boyutu **%91 oranında azaltılmıştır** (25.5MB'tan 2.4MB'a).
* **Mobil Uyumluluk:** Her iki tema da akıllı telefon ve tablet ekranlarına tam uyumludur.

---

## 🛠️ Teknolojiler

* **HTML5:** Anlamsal (semantic) yapı.
* **CSS3:** Glassmorphism efektleri, animasyonlar, Custom Properties (değişkenler) ve Responsive kurallar.
* **JavaScript (ES6):** Canvas animasyonları, müzik kontrol mekanizmaları, dalgalanma efektleri ve tarayıcı oturum hafıza yönetimi (`sessionStorage`).

---

## 📂 Proje Yapısı

```text
├── assets/
│   ├── kitap.png                         # Okuyorum kartı şeffaf sticker'ı
│   ├── music.png                         # Dinliyorum kartı şeffaf sticker'ı
│   ├── film.png                          # Favori Film kartı şeffaf sticker'ı
│   ├── spor.png                          # Sporlar kartı şeffaf sticker'ı
│   ├── mezun.png                         # Eğitim kartı şeffaf sticker'ı
│   ├── matrix_pills.png                  # Seçim ekranındaki haplar görseli
│   ├── matrix_theme_[cut_262sec].mp3     # Matrix arka plan müzik dosyası
│   └── coder.png                         # Geliştirici görseli
├── index.html                            # Ana HTML dosyası
├── style.css                             # Tüm stil ve tema bildirimleri
├── script.js                             # Tüm animasyon ve etkileşim kodları
├── DESIGN.md                             # Tasarım sistemi detayları
└── README.md                             # Bu dosya
```

---

## 🚀 Yerel Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. Bu depoyu klonlayın veya zip olarak indirin:
   ```bash
   git clone https://github.com/EnesKAYA16/stitch_canl_u_an_portfolyosu.git
   ```
2. Proje klasörünü açın.
3. `index.html` dosyasını herhangi bir web tarayıcısında çift tıklayarak açın veya VS Code **Live Server** eklentisiyle çalıştırın.

---

## 👥 Geliştirici

* **Enes Kaya**
* **E-posta:** [eneskaya16573@gmail.com](mailto:eneskaya16573@gmail.com)
* **GitHub:** [@EnesKAYA16](https://github.com/EnesKAYA16)
* **LinkedIn:** [Enes Kaya](https://www.linkedin.com/in/enes-kaya-436218391/)
