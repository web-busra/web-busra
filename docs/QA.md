# Forma 6.0.1 — kontrol kapsamı

Son güvenlik/temizlik kontrolü: **5 Kasım 2026**.

## Otomatik doğrulama

`npm run check` modüllerin sözdizimini kontrol eder. `npm test` 44 senaryo çalıştırır:

- 72 şablon × 20 palet × 4 doku; taşınabilir SVG ve metin kaçırma.
- Belge/layer sınırları, Unicode, sürüm geçişi ve 60 adımlık geçmiş.
- Görsel imzaları, piksel bütçeleri, PDF ofsetleri ve ZIP CRC/merkez dizini.
- Türkçe/aksansız arama, birlikte uygulanan kategori/biçim/favori filtreleri ve sıralama.
- Boş tuvallerin ilan edilen çıktı ölçüleri ve özel boyutların doğrulanması.
- Her giriş sayfasının DOM bağları, tekil kimlikleri ve yerel dosya referansları.
- IndexedDB yazım/okuma hatası sonrası yeni localStorage verisinin korunması, veritabanı kurtarma ve iki depolamanın da yazılamaması.
- Çalışma alanı/editör, stil ve modül grafiğinin HTTP üzerinden sunulması; HEAD, 404, 405 ve özel dosyalara erişimin kapatılması.

## Bu oturumun sınırı

4 Kasım arayüz çalışmasında tarayıcı aracı mevcut adresi güvenilir biçimde doğrulayamadığı için durdu. 5 Kasım temizlik ve güvenlik incelemesi kaynak kod, otomatik testler, yerel HTTP erişimi ve kaynak arşivi üzerinde yürütüldü. Yeni bir tam tarayıcı etkileşim denetimi yapılmadı; tıklama, sürükleme, klavye ve gerçek dosya indirme uçtan uca doğrulanmış sayılmaz.

Bu testler gerçek tarayıcı testleri veya erişilebilirlik uygunluk sertifikası değildir. GitHub Actions henüz bu yerel çalışmada çalıştırılmış değildir. Güncel `docs/cover.png` ve `docs/catalog.png`, 4 Kasım çalışmasında gerçek şablon modelinden render edilip incelendi. Tekrar üretilebilen SVG kopyaları 5 Kasım temizliğinde kaldırıldı; üretim araçları bunları `tmp/generated/` altında yeniden oluşturur. Sekiz şablon örneğinde fotoğraf, metin yerleşimi ve renkler incelendi. Bu işlem uygulamanın tarayıcı etkileşim testi değildir. Eski editör ekran görüntüleri yeni GitHub paketine alınmaz.

## Tarayıcıda elle uygulanacak senaryolar

1. `npm start` sonrası çalışma alanını 1440, 1024, 768, 390 ve 320 px genişlikte aç. Yatay taşma, kesilen metin ve erişilemeyen düğme olmadığını kontrol et.
2. Şablonu önizle; favoriye ekle. Favorilerim'e geç, yenile, favorinin korunduğunu doğrula. Filtreleri değiştir, sonuç bulunamayan aramayı temizle.
3. `Ctrl / ⌘ K` ile arama aç; ↑/↓ ve Enter kullan. Escape ile kapat. Dialog odağını ve Tab sırasını kontrol et.
4. Kare, hikâye, sunum ve özel boyutlu boş tasarımlar aç. Boş tuvalde beklenmedik şablon öğesi bulunmadığını doğrula. Geçersiz özel boyutları dene.
5. Fotoğraflı şablon aç, İşletme panelinden başlığı düzenle. Fotoğrafı değiştir; İlham ver, sıfırla ve geri al işlemlerinde fotoğrafların korunduğunu kontrol et.
6. Metni sürükle, boyutlandır ve döndür. Çoklu seçim, gruplama, kilit, görünürlük, hizalama ve sayfa sıralamasını dene. Mobilde kitaplık/özellik/tuval geçişlerini kontrol et.
7. Projeyi kaydet, bir metni değiştir ve yeniden kaydet. Yeni bir kayıt yerine aynı projenin güncellendiğini doğrula. Çalışma alanına dön ve projeyi aç.
8. Projeyi yeniden adlandır, kopyala, kaldır ve 12 saniye içinde Geri al'a bas. Sonra yeni şablon açıp önceki taslağın Projelerim altında erişilebilir olduğunu kontrol et.
9. SVG, PNG, JPG, WebP, PDF ve FORMA indir. Çok sayfalı belge için ZIP/PDF oluştur. İndirilen FORMA'yı içe aktar; sayfa, görsel ve metinleri karşılaştır.
10. İşletim sisteminde depolama iznini değiştirmeden, yalnızca test tarayıcısının geliştirici araçlarıyla depolama arızasını simüle et. Başarısız yazımda başarı mesajı gösterilmediğini ve FORMA yedeğinin alınabildiğini doğrula.

Önemli kişisel belgelerle arıza/silme senaryosu çalıştırma; geçici bir test belgesi kullan.
