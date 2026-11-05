# Forma'ya katkıda bulunma

Forma bağımlılıksız bir statik ES modül uygulamasıdır. Node.js 22+ ile `npm start` çalıştır; `http://127.0.0.1:4173/` adresinden başla. XAMPP veya herhangi bir statik HTTP sunucusu da kullanılabilir.

## Geliştirme

- `src/workspace.js`: başlangıç ekranı ve proje/favori etkileşimleri.
- `src/workspace-model.js`: arama, filtreleme ve boş tuval kuralları.
- `src/app.js`: editörün DOM ve Pointer Events entegrasyonu.
- `src/design.js`, `src/document.js`: normalize edilen veri modelleri; dış veriye güvenme.
- `src/storage.js`: IndexedDB ve zaman damgalı localStorage yedeği.
- `workspace.css`, `editor.css`: 6.0 görsel düzenlemeleri. Editör önceki stilleri de kullanır.

Şablon eklerken galeri, editör ve dışa aktarımın aynı modeli kullandığını koru. Görselleri `assets/photos` manifesti üzerinden getir; kullanıcı verisinden uzak URL üretme. Yeni özelliğin gizlilik ve veri sınırlarını belgelemeyi unutma.

## Değişiklik göndermeden önce

```sh
npm run check
npm test
npm run audit
```

Veri modeli, depolama, içe/dışa aktarım veya arama kurallarındaki değişiklikler için anlamlı regresyon testleri ekle. Arayüz değişikliklerinde [QA.md](docs/QA.md) senaryolarını masaüstü ve mobil boyutlarda uygula; otomatik model testlerinin görsel kontrollerin yerini tuttuğunu varsayma.

PR açıklamasında problemi, sonuçta değişen davranışı, doğrulamayı ve kalan sınırlamaları belirt. Gizli anahtarlar, `.env` dosyaları ve kişisel proje dosyalarını depoya ekleme. Güvenlik açıklarını herkese açık issue yerine [SECURITY.md](SECURITY.md) yönergesiyle bildir.

`npm run package`, izin verilen kaynakları içeren yeni ZIP'i üretir. `npm run cover` ve `npm run catalog`, gerçek şablon üreticisinden `tmp/generated/cover.svg` ve `tmp/generated/catalog.svg` dosyalarını oluşturur. Bu geçici çıktılar GitHub paketine alınmaz. Güncel PNG kapaklar `docs/` altında tutulur.
