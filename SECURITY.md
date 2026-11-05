# Forma 6.0.1 — güvenlik notları

Forma tarayıcıda çalışan statik bir editördür. Hesap, ödeme, sunucuya yükleme, analitik, harici AI API çağrısı veya bulut eşitleme içermez. İncelenen girişler FORMA JSON, paylaşım bağlantısı, yerel depolama ve raster görsel dosyalarıdır.

## Uygulanan kontroller

- Belge/katmanlar yalnızca izin verilen alanlardan yeniden kurulur. Metinler XML kaçırılır; renk, font, efekt, kimlik, şekil, sembol ve sayısal değerler sınırlandırılır.
- Belge başına 12 sayfa, sayfa başına 40 katman, proje başına 20 MB ve 24 görsel sınırı vardır. Koleksiyon yazımına, okuma sınırıyla aynı toplam boyut sınırı uygulanır.
- SVG veya HTML görsel yüklenmez. PNG/JPEG/WebP MIME, imza, piksel ölçüsü ve 20 megapiksel sınırıyla doğrulanır; tarayıcıda çözümlenip yeniden kodlanır. Dosya başına giriş sınırı 8 MB'dir.
- Paket fotoğrafları sabit yerel manifestten yüklenir. Kullanıcıdan gelen URL fetch hedefi olmaz; seçilen fotoğraf projeye gömülür. Dışa aktarılan SVG betik, `foreignObject` veya uzak görsel kaynağı içermez.
- DOM'da kullanıcıya ait etiketler `textContent` ile kurulur. SVG alanlarına yalnızca normalize edilen model ve XML kaçırılan metinler girer.
- CSP uzaktan/inline betik ve nesne kaynaklarını kapatır. Dış sekme bağlantıları `noopener noreferrer` kullanır.
- Node geliştirme sunucusu yalnızca izin verilen dosyaları ve GET/HEAD yöntemlerini sunar; yabancı Host/Origin isteklerini reddeder. `nosniff`, CSP, `frame-ancestors`, CORP ve cihaz izin başlıkları gönderilir.
- Apache 2.4/XAMPP için `.htaccess`; dizin listelemeyi, dot dosyalarını, betik/test klasörlerini ve özel dosya türlerini sınırlar, uygun modüllerle güvenlik başlıkları gönderir. GitHub Pages bu dosyayı uygulamaz; oradaki yanıt başlıkları sağlayıcıya bağlıdır.
- GitHub Actions adımları tam commit SHA'sına sabitlenmiştir. İş akışı salt okunur depo izni kullanır, checkout kimlik bilgilerini kalıcı tutmaz. Dependabot eylem güncellemeleri için yapılandırılmıştır.
- Paketleyici dosya/yol izin listesi kullanır; dokümanlar ve GitHub dosyaları ad bazında incelenir, sembolik bağlantıları reddeder. Ortam dosyaları, anahtarlar, tarayıcı verileri, kişisel FORMA belgeleri ve eski ekran görüntüleri dağıtılmaz.

## Otomatik kaynak denetimi

```sh
npm run check
npm test
npm run audit
```

`audit`, belirli API anahtarı/token, açık parola/API alanı, JWT, kimlik bilgisi içeren URL ve özel anahtar biçimlerini, dinamik kod çalıştırmayı, inline olayları, uzak betikleri, CSP eksikliğini, dış sekme korumasını, tüm iş akışlarında sabitleme, ayrıcalıklı tetikleyici ve yazma izinlerini ve 16 fotoğrafın SHA-256 bütünlüğünü kontrol eder. Bulgu çıktısı eşleşen gizli değeri yazdırmaz. Sonuç `docs/AUDIT-REPORT.json` dosyasına kaydedilir; bulgu varsa kaynak ZIP'i oluşturulmaz.

Bu tarama bütün gizli bilgi türlerini bulmayı garanti etmez; bağımsız sızma testi, zararlı yazılım taraması veya sıfır açık garantisi değildir. Yeni bağımlılık eklendiğinde denetim ayrıca bağımlılık incelemesi ister. Fotoğraf hash'i lisans veya telif kanıtı değildir.

## Veri gizliliği ve sınırlar

IndexedDB/localStorage şifreli kasa değildir. Aynı origin altındaki diğer uygulamalar, tarayıcı profiline erişebilen kullanıcılar veya bir XSS açığı bu verilere erişebilir. Tasarım metinlerine parola, API anahtarı veya gizli kişisel bilgi eklemeyin. Paylaşım URL'leri ve FORMA dosyaları şifrelenmez. Tarayıcı verilerini silmek taslak ve kayıtları siler; önemli projeleri dosyaya indirin.

Yerel depolamadan okunan veri yeniden doğrulanır. Zaman damgalı yedekler IndexedDB arızası sonrası daha yeni verinin korunmasını sağlar; depolama yazılamadığında başarı mesajı gösterilmez. Aynı origin üzerinde güvenilmeyen başka uygulamalar barındırmayın. Bu sınırlar [OWASP HTML5 depolama açıklamalarıyla](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#storage-apis) uyumludur.

Tarayıcı etkileşim doğrulamasının kapsamı [QA.md](docs/QA.md) içinde ayrıca belirtilmiştir. Lisans/telif için [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) esas alınır.

Bir güvenlik sorunu bulursanız depo sahibinin GitHub profilindeki doğrulanmış özel iletişim kanalını kullanın; herkese açık issue içinde gizli bilgi veya çalışır anahtar paylaşmayın. Burada doğrulanmamış bir e-posta adresi üretilmez.

5 Kasım 2026 temizlik ve inceleme kaydı: [RELEASE-REVIEW.md](docs/RELEASE-REVIEW.md). Yeniden üretilebilen SVG çıktıları `tmp/generated/` içinde tutulur; arşive alınmaz.
