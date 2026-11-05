# Forma 6.0 — mimari

Uygulama bir statik ES modül uygulamasıdır. Çalışma zamanında uzak ağ servisi, framework veya sunucu hesabı kullanmaz. Paketlenmiş fotoğraflar aynı kaynaktan okunur; IndexedDB tarayıcının yerel veritabanıdır.

```text
Şablon / Dosya / Bağlantı / Yerel kayıt
                 ↓
        normalizeDocument
       pages + assets + brand
                 ↓
       aktif sayfanın modeli
          ↙           ↘
   SVG / Canvas    belge geçmişi
      ↓                ↓
 düzenleme/çıktı    geri al / ileri al
```

## Modüller

| Dosya | Sorumluluk |
| --- | --- |
| boot.js | Sayfaya göre çalışma alanı/editör açılışı ve kurtarılabilir hata ekranı |
| workspace.js / workspace-model.js | Çalışma alanı, şablon keşfi, favoriler, proje yönetimi ve başlangıç ölçüleri |
| templates.js / library.js | 72 etkin işletme kompozisyonu ve eski belgeler için 48 emekli kompozisyon, paletler, formatlar, özgün semboller |
| industries.js | Otel, turizm, pilates ve kurumsal etkinlik için 32 yeni kompozisyonun içerik verileri |
| commercial.js | 72 işletme tasarımı, düzenlenebilir alanlar ve kompozisyon yerleşimleri |
| photos.js / stock.js | Sabit yerel fotoğraf manifesti, doğrulama, seçili belgeye gömme |
| art.js | Prosedürel SVG motifleri |
| design.js | Katman doğrulama, SVG üretimi, tek sayfa geriye uyumluluğu |
| document.js | Çok sayfalı belge, marka, dosya/paylaşım sınırları, geçmiş ve hizalama |
| raster.js | PNG/JPEG/WebP başlıkları, boyut ve piksel bütçesi doğrulama |
| media.js | Yerel görsel okuma, küçültme, yeniden kodlama ve çözümleme kontrolü |
| export.js | Raster Canvas, raster PDF ve CRC32/merkez dizinli ZIP üretimi |
| storage.js | IndexedDB, hata durumunda localStorage denemesi |
| icons.js | Yerel çizimlerden arayüz simgeleri |
| app.js | DOM, Pointer Events, seçim, sayfalar, araçlar ve komutlar |

## Belge modeli

Bir belge ad, aktif sayfa kimliği, en fazla 12 sayfa, görsel varlıkları ve marka kiti taşır. Her sayfa bağımsız tuval oranı ve en fazla 40 katman içerir. Diziler arkadan öne çizilir. Temel katmanlar: yazı, motif, şekil, görsel, sembol, grafik ve serbest çizim.

Görseller sayfa katmanlarına tekrar tekrar kopyalanmaz; katmanlar varlık kimliği taşır. Dosya dışa aktarmada varlıklar bir kez JSON belgesine alınır. SVG dışa aktarmada kullanılan raster görseller `data:` kaynağı olarak gömülür.

Tüm dış veri beyaz listeyle yeniden kurulur. Font, şekil, sembol, efekt ve renk rolleri enum'lardır. Metinler XML kaçırılır; kimlikler sınırlı ASCII, renkler altı haneli hex olur. Serbest çizim yalnızca sınırlı sayısal noktalardan oluşur.

## Koordinatlar ve seçim

Konumlar yüzde, geometri ve yazı boyutu tasarım birimidir. Sabit oranlar ve 128–2048 arası özel tuval boyutları desteklenir. Dönüşüm `translate → rotate → scale/flip` sırasındadır.

Pointer koordinatı SVG ekran matrisinin tersiyle belge koordinatına çevrilir. Seçim sınırları dört dönüştürülmüş köşeden hesaplanır; metinler gerçek `getBBox()` ölçüsünü kullanır. Görsel sınırı kaynak resmin taşan bölümünü değil çerçevesini esas alır.

Çoklu seçim köşeden ortak çapa etrafında orantılı ölçeklenir. Dönüş, ortak merkez etrafında hem konumu hem açıyı değiştirir. Gruplar ortak kimlik kullanan katmanlardır; iç içe grup hiyerarşisi yoktur. Seçimde kilitli öğe varsa toplu dönüşüm yapılmaz.

Boşluk/orta fare tuvali CSS konumuyla taşır; belge koordinatlarını değiştirmez. Köşe ve dönüş tutamaçları ekran ölçeğine göre boyutlanır. İndirilen SVG'de tutamaç, seçim veya hit alanı bulunmaz.

## Geçmiş

60 içerik durumu tutulur. Pointer/slider canlı hareketi geçicidir; bitişi tek kayıt ekler. İptal edilen pointer hareketi başlangıç durumunu getirir. Yeni düzenleme, terk edilen ileri alma dalını kaldırır.

Metin ve sayfa metadatası derin kopyalanır. Büyük, değişmeyen görsel dizeleri sürümlü bir varlık kasasında paylaşılır. Aynı varlık kimliğini farklı içerikle getiren bir proje, eski geçmişteki görseli değiştirmez. Artık hiçbir geçmişte kullanılmayan varlık sürümü kasadan çıkarılır. Sayfa gezinmesi kendi başına içerik geri alma adımı oluşturmaz.

## Dosya ve yerel kayıt

Proje zarfı geriye uyumluluk için `{app: "forma-svg-studio", version: 3, document: ...}` şeklinde kalır. Belge en fazla 20 MB ve 24 görsel olabilir. V1/V2 veriler tek sayfalı belgeye çevrilir. Eski localStorage anahtarları silinmez.

IndexedDB `forma-studio-v3 / projects` içinde `draft`, `draft-project`, `recovery`, `collection`, `favorites` ve geçici içe aktarım anahtarları kullanılır. Taslak 600 ms gecikmeyle yazılır. İşlem tamamlanmadan kayıt başarılı gösterilmez. Depolama kapalı/doluysa kullanıcıya dosya indirmesi önerilir.

Görseller yüklenmeden önce MIME, imza, başlık boyutu ve 20 megapiksel sınırı incelenir. Canvas yeniden kodlaması dış metadata'yı kaynak dosyadan taşımadan yeni WebP üretir. Proje açılırken raster başlığı, beyan edilen boyut ve tarayıcı çözümlemesi doğrulanır.

## Çıktılar

SVG aynı üreticiyi kullanır. PNG/JPG/WebP bu SVG'nin `Image → Canvas → Blob` hattından gelir; JPG beyaza birleştirilir. Çok sayfalı görseller depolanmış ZIP girdileri halinde paketlenir; PNG/JPG/WebP zaten sıkıştırılmıştır.

PDF 1.4 belgesi yerel kodla üretilir; her sayfa 2048 px uzun kenarlı JPEG olarak gömülür. Çapraz referans tablosu bayt ofsetleriyle yazılır. A4 sayfa ölçüsü 595.28 × 841.89 punto, diğerleri tuval oranına göredir. Bu bir CMYK veya vektör metin çıktısı değildir.

İndirme başında belge ve seçili sayfalar anlık görüntülenir. Kullanıcı o sırada düzenlese bile indirilen içerik, ad ve ayarlar aynı anlık görüntüden üretilir. Geçici Blob URL'leri sonradan iptal edilir.

## Sektör şablonları

Galeri önizlemesinde fotoğraf yolu yalnızca `PHOTO_CATALOG` içinden gelir. `previewStock` üretici seçeneği, kaydedilmiş kullanıcı belgelerinde açılmaz. Bir şablon seçilince yalnızca gerekli fotoğraflar okunup MIME/imza/boyut kontrolünden geçirilir; veri URL'siyle belgeye katılır. İçe aktarılan URL veya dosya adı fetch hedefi olamaz. Fotoğraf isteği başarısızsa önceki çalışan belge korunur ve hata gösterilir.

Hızlı işletme formu, sabit katman kimlikleri üzerinden normal metin katmanlarını düzenler. Form ayrı bir metin kopyası tutmaz. Undo, dosya içe/dışa aktarma ve katman düzenleyicisi aynı veriyi kullanır. Yazının `maxWidth` alanı, çıktı SVG'sinde kullanılan yazı boyutunu sınırlar; içerik XML kaçırılır. Büyük başlıkların sığması için font küçülebilir; gelişmiş katman panelinde genişlik 0 yapılarak bu davranış kapatılır.
