# 6.0.1 — GitHub hazırlık ve güvenlik incelemesi

İnceleme tarihi: **5 Kasım 2026**.

## Temizlik

- Önceki sürümden kalan, mevcut README veya uygulama tarafından kullanılmayan 11 PNG ekran görüntüsü kaldırıldı: `abstract`, `automotive`, `beauty`, `campaign`, `charts`, `editor`, `hair`, `media`, `mobile-business`, `mobile`, `preview`.
- İki geçici QA önizlemesi ve toplam yaklaşık 5,5 MB tutan `docs/cover.svg` / `docs/catalog.svg` tekrar çıktıları kaldırıldı. Bu dosyalar `npm run cover` / `npm run catalog` ile `tmp/generated/` altında yeniden üretilebilir.
- Toplam 15 çıktı dosyası, **9.406.351 bayt** temizlendi. Geçici klasörler yalnızca boş kaldıklarında kaldırıldı.
- Uygulamanın kullandığı 16 JPEG, güncel `cover.png` / `catalog.png`, lisans/üretim kayıtları, testler ve eski projeleri açan uyumluluk kodu korundu.

## Güvenlikte değişenler

- Kaynak paketi için dokümanlar ve GitHub dosyaları ad bazında incelenmiş izin listesine alındı. `credentials.json`, `secrets.json`, rastgele doküman JSON'ları, yedekler ve bilinmeyen iş akışları kendiliğinden dağıtıma girmez.
- Fotoğraflardan yalnızca sabit katalogdaki 16 dosya pakete alınır; klasöre sonradan bırakılan kişisel JPEG'ler dağıtılmaz.
- Tüm iş akışları tam SHA, ayrıcalıklı tetikleyici ve yazma izinleri için denetlenir. İncelenmemiş yeni iş akışı denetimi durdurur. Şu anki iş akışı salt okunurdur.
- Belirli token biçimlerine ek olarak açık parola/API alanları, JWT, kullanıcı adı/parola içeren URL ve şifreli özel anahtar başlıkları aranır. Bulgular eşleşen değeri içermez.
- CSP denetimi gerçek meta içeriğini kontrol eder; yeni sekme bağlantıları öznitelik sırasından bağımsız incelenir.
- Bozuk FORMA sayfa/katman/görsel listeleri ve sayfa/katman sınırı aşımı sessizce kesilmek yerine reddedilir. En uzun sayfa kimliklerinin çakışma sonrası kararlılığı düzeltildi.
- Apache `.htaccess` yedek, veritabanı ve yapılandırma uzantılarını engeller. `ServerSignature Off` hata sayfası imzasını kapatır. Node sunucusunun izinli dosya, yöntem, Host/Origin ve CSP kontrolleri korunur.

## Doğrulama ve kapsam

```sh
npm run check
npm test
npm run audit
npm run package
```

Yeni sürümde 44 otomatik senaryo vardır. Kaynak denetiminin makinece üretilen sonucu [AUDIT-REPORT.json](AUDIT-REPORT.json) içinde bulunur. Dağıtım ZIP'indeki her dosyanın güncel kaynakla aynı olduğu teslim öncesi ayrıca karşılaştırılır.

Yerel XAMPP HTTP kontrolünde ana sayfa, editör, başlangıç modülü ve şablon fotoğrafı 200; yapılandırma, test dosyası, varlık manifesti ve oluşturulup kontrol sonrası kaldırılan `.bak` / `.ini` deneme dosyaları 403 yanıtı verdi. CSP ve `nosniff` başlıkları doğrulandı.

Bu inceleme GitHub hesabına yükleme, uzaktaki CI sonucu, profesyonel sızma testi veya bütün tarayıcı davranışlarının güvenli olduğuna dair garanti değildir. Buradaki klasörün Git geçmişi bulunmadığından eski uzak commitler taranmış sayılmaz. Yerel depolama ve paylaşımın gizlilik sınırları [SECURITY.md](../SECURITY.md) içinde belirtilir.

GitHub'a **güncel ZIP'in çıkarılmış içeriğini** yükleyin. Çalışma klasörünü bütünüyle sürüklemek, daha sonra oluşabilecek yerel dosyaların da yüklenmesine neden olabilir. Yeniden üretim araçları ve önizleme çıktı yolu [CONTRIBUTING.md](../CONTRIBUTING.md) içinde açıklanır.
