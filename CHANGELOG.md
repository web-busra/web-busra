# Değişiklikler

## 6.0.1 — 2026-11-05

- Kullanılmayan 11 eski ekran görüntüsü, iki geçici önizleme ve PNG'lerden tekrar üretilebilen iki büyük SVG çıktısı kaldırıldı. Güncel kapak/katalog PNG'leri ve 16 şablon fotoğrafı korundu.
- Kapak/katalog üreticilerinin SVG çıktıları Git'e ve dağıtıma alınmayan `tmp/generated/` dizinine taşındı.
- Doküman ve GitHub dosyaları ad bazında izin listesine alındı; bilinmeyen JSON, yedek dosya ve iş akışları kaynak paketine otomatik eklenmez.
- Gizli bilgi taramasına sabit parola/API alanları, JWT, kullanıcı bilgisi içeren URL ve şifreli özel anahtar biçimleri eklendi. Tüm iş akışları değişken sürüm, ayrıcalıklı tetikleyici ve yazma izni açısından kontrol edilir.
- Bozuk sayfa/katman dizileri ve sınırları aşan içe aktarımlar açık hata ile reddedilir. En uzun sayfa kimliklerinin çakışma sonrası sınır dışına çıkması düzeltildi.
- Apache'de yedek/yapılandırma dosyaları engellendi; hata sayfası sunucu imzası kapatıldı. Güvenlik ve dosya geçişi için dört regresyon testi eklendi.

## 6.0.0 — 2026-11-04

- 48 genel, monogram ve soyut şablon galeriden, aramadan ve önerilerden çıkarıldı. Eski proje dosyaları için okuma desteği korundu.
- Otel, turizm, pilates ve kurumsal toplantı/etkinlik için 32 yeni fotoğraflı tasarım eklendi. Kütüphane yalnızca dokuz işletme koleksiyonundaki 72 şablondan oluşur.
- Konaklama teklifi, oda, tur programı, üyelik, ders planı, konferans, toplantı gündemi ve davet için ayrı kompozisyonlar eklendi. Palet sayısı 20 oldu.
- Sekiz yeni yerleşik Imagegen fotoğrafıyla toplam 16 yerel fotoğraf; son istem kayıtları ve SHA-256 manifesti hazırlandı.
- Marka alanları açık örnek işletme adlarına dönüştürüldü. İşletme paneline sektöre özel etiketler, web alanı ve altı satırlı program düzenleme eklendi.
- Statik kaynak/anahtar taraması, güvenli paket dosya listesi, fotoğraf bütünlüğü ve güvenlik regresyonları eklendi. Test sayısı 40 oldu.
- Yerel sunucuda yabancı Host/Origin reddi, CSP/CORP/izin başlıkları ve Apache için `.htaccess` eklendi. GitHub Actions tam SHA'lara sabitlendi.
- Lisans, AI görsel kaynakları ve inceleme sınırları THIRD_PARTY_NOTICES.md içinde belgelendi. Geçmiş ekran görüntüleri yeni dağıtıma dahil edilmez.
- Yeni kapak ve sektör seçkisi gerçek şablon üreticisinden render edilip incelendi; tarayıcı etkileşim testi sınırı QA.md içinde korundu.

## 5.0.0 — 2026-11-04

- Genel bakış, şablon keşfi, projeler ve favoriler için bağımsız çalışma alanı eklendi; editör `editor.html` adresine taşındı.
- Güçlü koleksiyon vitrini, şablon önizlemesi, hazır tuval başlangıçları ve yeni mobil düzen hazırlandı.
- Kalıcı favoriler, Türkçe/aksansız arama, kategori/biçim filtreleri ve alfabetik sıralama eklendi.
- Proje yeniden adlandırma, kopyalama, kaldırmayı geri alma ve önceki taslak yedeği eklendi.
- Açılan projede Kaydet aynı kaydı günceller. Açılış parametreleri tüketilir; yenileme mevcut düzenlemeleri başlangıç şablonuyla değiştirmez.
- Ctrl/⌘ K hızlı erişim penceresi ve klavye gezinmesi eklendi.
- Fotoğraflı İlham ver/sıfırla akışlarının eksik varlık yükleme hatası giderildi.
- Depolama zarfı zaman damgalı hale geldi; IndexedDB arızasından sonra eski verinin yeni localStorage yedeğini gölgelemesi düzeltildi.
- Sözdizimi kontrolleri ve toplam 35 otomatik senaryo; bağımlılıksız ZIP paketleyici, marka kapağı, katkı ve kontrol belgeleri hazırlandı.
- Bu oturumda tarayıcı aracı durduğu için yeni arayüzün görsel/etkileşim denetimi tamamlanamadı; doğrulama sınırı QA.md içinde belirtildi.

## 4.0.0 — 2026-11-04

- Emlak, kuaför, güzellik ve otomotiv için sekizer; reklam/kampanya için sekiz yeni kompozisyon eklendi. Toplam kütüphane 88 şablon oldu.
- Sekiz özgün fotoğraf, yerel varlık manifesti ve kendi fotoğrafını değiştirme akışı eklendi. İndirilen dosyalar fotoğraf baytlarını içerir.
- Hızlı İşletme paneli, kullanım alanı filtresi, sektör fotoğraf alternatifleri ve otomatik yazı sığdırma eklendi.
- 16 palet ve 1080×1080 / 1080×1350 / 1080×1920 / 1920×1080 varsayılan çıktılar hazırlandı.
- Görsel bütçesi 24 varlık, proje sınırı 20 MB oldu. Model/format testleri 29 senaryoya çıktı.
- Kaynaklar portfolyodan ayrıldı; portfolyo kartı GitHub'a doğrudan yönlenir. Dağıtım bağımsız GitHub ZIP'i olarak hazırlanır.

## 3.0.0 — 2026-11-03

- 48 şablon ve sekiz koleksiyon; 12 sayfalı belge modeli, sayfa şeridi ve sunum modu eklendi.
- Çoklu seçim, seçim kutusu, gruplama, hizalama/dağıtma, kopyala/kes/yapıştır, köşeden boyut ve dönüş tutamaçları eklendi.
- Serbest çizim, 24 sembol, sütun/çizgi/halka grafikler ve altı yazı ailesi eklendi.
- Güvenli raster yükleme; kırpma/maske, çevirme, parlaklık/kontrast/doygunluk/bulanıklık eklendi.
- Marka kiti, geçişli zeminler, 10 hazır tuval ölçüsü + özel boyut ve tuval taşıma eklendi.
- JPG/WebP/PDF çıktıları, çok sayfalı ZIP ve görsel içeren taşınabilir FORMA dosyaları eklendi.
- IndexedDB taslak/koleksiyon, sürümlü görsel kasası, V1/V2 geçişi ve 23 model/format testi hazırlandı.
- Repository name alanından başlayan ayrıntılı GitHub/Pages rehberi eklendi.

## 2.0.0 — 2026-11-03

- Altı basit başlangıçtan dört koleksiyonda 24 özgün kompozisyona geçildi.
- Katman modeli, tuvalde sürükleme, klavye konum ayarı, gizleme/kilitleme, çoğaltma, silme ve sıralama eklendi.
- Yazı, motif ve temel şekil araçları; bağımsız tipografi ve renk kontrolleri eklendi.
- 12 palet, dört format, üç doku ve 4096 px uzun kenara kadar oranlı SVG/PNG çıktıları eklendi.
- FORMA JSON proje dosyaları, son taslağı geri yükleme ve v1 veri geçişi eklendi.
- 60 adımlık derin geçmiş, merkez kılavuzları ve tek adımlı sürükleme geçmişi eklendi.
- Tam genişlikli mobil paneller, arama, filtreler, yeni dışa aktarma penceresi ve GitHub belgeleri hazırlandı.
- Model testleri 11 senaryoya çıkarıldı; tüm 1.152 şablon/palet/doku birleşimi denetleniyor.

## 1.0.0 — 2026-11-03

- Altı şablonlu ilk SVG/PNG editörü, yerel koleksiyon, paylaşım ve geçmiş.
