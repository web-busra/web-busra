# Forma 6.0 — GitHub'a yükleme

Önerilen depo adı: **`forma-design-studio`**.

## 1. Güncel paketi oluşturun

```sh
npm run check
npm test
npm run audit
npm run package
```

Windows PowerShell engeli varsa `npm` yerine `npm.cmd` kullanın. `forma-design-studio-github.zip` dosyasını çıkarın. **ZIP'in içeriğini** yükleyin; ZIP dosyasının kendisini veya bütün çalışma klasörünü yüklemeyin. Yeni paketteki izin listesi eski ekran görüntülerini, ortam dosyalarını ve yerel test çıktılarını dışarıda bırakır.

## 2. Depoyu oluşturun veya açın

GitHub hesabınızda `forma-design-studio` deposunu açın. Yeni depo oluşturuyorsanız paket README, lisans ve `.gitignore` içerdiği için boş bir depo yeterlidir. Açıklama önerisi:

```text
A business design studio with 72 editable hospitality, travel, Pilates, corporate event, real estate, salon and automotive templates.
```

Kaynakları herkese açık sunmak ve uygun ücretsiz planda Pages kullanmak istiyorsanız deponun görünürlüğünü ona göre seçin. MIT lisansı kaynakların yeniden kullanımına izin verir; kapsam [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) içindedir.

## 3. Dosyaları yükleyin

Depoda **Add file → Upload files** seçin. Çıkarılan paketin içindeki dosya ve klasörleri, yapılarını koruyarak sürükleyin. `src/app.js` görünmeli; fazladan `forma-design-studio/src/app.js` üst klasörü oluşmamalı.

Önemli kök dosyaları:

```text
index.html
editor.html
workspace.css
editor.css
styles.css
studio.css
business.css
src/
assets/photos/
docs/
scripts/
tests/
.github/workflows/checks.yml
.github/dependabot.yml
.nojekyll
.htaccess
.gitignore
README.md
LICENSE.txt
THIRD_PARTY_NOTICES.md
```

Gizli dosya/klasörler sürükleme sırasında atlanırsa `.github`, `.nojekyll`, `.gitignore` ve `.htaccess` dosyalarını ayrıca yükleyin veya GitHub Desktop kullanın. `index.html` ile `editor.html` kökte kalmalıdır. Web yüklemesinin dosya/adet sınırına ulaşırsanız birden fazla yükleme veya GitHub Desktop kullanın. [Resmî dosya yükleme açıklaması](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

Commit mesajı önerisi:

```text
Release Forma Business Studio 6.0
```

Güncellemeyi yeni dal/PR üzerinden gönderiyorsanız yayın dalınıza birleştirin. Bu paket hesabınıza otomatik commit veya push yapmaz.

## 4. GitHub Pages

Depoda **Settings → Pages** bölümünü açın. **Build and deployment → Source → Deploy from a branch**, dal **main**, klasör **/(root)** seçip kaydedin. Kendi deponuzun yayın dalı farklıysa onu seçin. `.nojekyll` kökte kalmalıdır. [Resmî yayın kaynağı açıklaması](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Yayın sonucu oluştuğunda Pages ekranındaki adresi açın. Beklenen biçim:

```text
https://KULLANICI-ADIN.github.io/forma-design-studio/
```

Paket içindeki portfolyo bağlantısı `web-busra/forma-design-studio` hedefini kullanır. Bu, yayının gerçekleştiğini göstermez. GitHub Actions kontrolleri ve Pages dağıtımı uzaktaki **Actions** ekranında ayrıca doğrulanmalıdır.

GitHub Pages statik kaynakları halka açık sunar ve `.htaccess` uygulamaz. Gizli API anahtarı, özel proje veya kullanıcı yüklemesi depoya eklemeyin. Projenin çalışması için böyle bir dosya gerekmez.

## 5. Yayın kontrolü

Otel, turizm, pilates ve toplantı kategorilerinden birer şablon açın. Bir işletme alanını değiştirin; favori/kayıt, ikinci sayfa ve SVG/PNG/FORMA indirmeyi deneyin. Altı satırlı ders ve toplantı programlarının korunduğunu kontrol edin. Ayrıntılı senaryolar [QA.md](QA.md) içindedir.

Yerel kaynak denetimi ve fotoğraf hash'leri pakete dahildir. Gerçek tarayıcı doğrulaması, GitHub'daki CI sonucu ve hukuki hak temizliği aynı kontrol değildir; kapsam belgelerde ayrı belirtilmiştir.
