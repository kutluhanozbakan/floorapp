# FloorApp Tasarım, Görsel Deneyim ve İşlevsellik Rehberi

> Bu belge ürünleştirme, ödeme, üyelik veya pazaryeri yol haritası değildir. Amaç, mevcut planlama deneyimini **daha anlaşılır, daha akıcı, daha estetik ve daha güçlü bir tasarım aracına** dönüştürmektir.

## 1. Deneyim Vizyonu

FloorApp açıldığında bir yönetim paneli gibi değil, modern bir yaratıcı çalışma alanı gibi hissettirmelidir. Kullanıcının oda tasarlarken ana hissi şu olmalıdır:

- **Sakin:** Arayüz çizimin önüne geçmez.
- **Kontrollü:** Her hareketin sonucu anlaşılır, geri alınabilir ve hassastır.
- **Canlı:** Seçim, sürükleme, hizalama ve görünüm değişimleri anlık görsel karşılık verir.
- **Yardımcı:** Arayüz kullanıcıya ne yapabileceğini bağlama göre gösterir.
- **Tatmin edici:** Küçük animasyonlar, kaliteli ışıklar ve temiz tipografi yapılan işi değerli hissettirir.

Ana tasarım ilkesi:

> **Canvas başrolde; araçlar gerektiğinde görünür, gerekmediğinde geri çekilir.**

---

## 2. Mevcut Arayüzün Tasarımsal Değerlendirmesi

Mevcut yapı iyi bir editör iskeletine sahip: üst araç çubuğu, sol katalog, merkezde 2D/3D canvas ve sağ özellik paneli. Ancak bu yapı şu anda klasik bir yönetim paneli görünümüne yakın duruyor.

### Güçlü taraflar

- 2D ve 3D arasında açık bir görünüm geçişi var.
- Sol katalog ile sahneye nesne eklemek kolay.
- Sağ panel, seçili oda veya nesnenin sayısal özelliklerini düzenleyebiliyor.
- Mobilde sol ve sağ paneller drawer olarak açılabiliyor.
- Nesneler gerçek zamanlı olarak taşınabiliyor, döndürülebiliyor ve ölçeklenebiliyor.

### İleri taşınması gereken taraflar

- Arayüzün büyük bölümü benzer beyaz yüzeyler, gri sınırlar ve mavi vurgu kullanıyor; görsel hiyerarşi zayıf kalıyor.
- Üst çubukta dosya işlemleri, görünüm değişimi ve cihaz bağlantısı aynı önemde gösteriliyor.
- Katalog düz ve uzun bir nesne listesi; arama, kategori, favori veya son kullanılanlar bulunmuyor.
- Sağ panel yoğun form alanlarından oluşuyor; sık kullanılan işlemler ile ileri seviye ayarlar ayrılmıyor.
- Canvas üzerinde bağlamsal araçlar, ölçüler, hizalama rehberleri, mini harita veya durum geri bildirimi yok.
- Kullanıcı ilk açılışta ne yapacağını arayüzün içinden doğal olarak öğrenemiyor.
- Tasarım dili parçalı: arayüzde hem Türkçe hem İngilizce metinler bulunuyor.

---

## 3. Yeni Görsel Yön: “Calm Spatial Studio”

FloorApp için önerilen görsel yön, profesyonel CAD uygulamalarının gücünü modern yaratıcı araçların sadeliğiyle birleştiren **Calm Spatial Studio** yaklaşımıdır.

### 3.1 Renk sistemi

Saf beyaz ve düz `slate` yüzeyler yerine katmanlı, sıcak ve sakin bir sistem kullanılmalı.

| Rol | Öneri | Kullanım |
|---|---|---|
| Canvas zemini | `#F4F2ED` | 2D çalışma alanı, sıcak kâğıt hissi |
| Ana yüzey | `#FCFCFA` | Paneller ve toolbar |
| Yükseltilmiş yüzey | `#FFFFFF` | Popover, menü, bağlamsal araçlar |
| Ana metin | `#1E2421` | Başlıklar ve kritik değerler |
| İkincil metin | `#68716C` | Açıklamalar ve yardımcı bilgiler |
| Marka/vurgu | `#526D5D` | Ana aksiyonlar ve seçim durumu |
| Etkileşim vurgusu | `#D97745` | Ölçüm, uyarı ve aktif düzenleme |
| Başarı | `#3D8063` | Geçerli yerleşim ve kayıt durumu |
| Hata | `#C75B56` | Çakışma ve geçersiz işlem |

Kurallar:

- Marka rengi her yerde kullanılmamalı; yalnızca seçim, ana aksiyon ve aktif durumlarda görünmeli.
- Sınırlar yerine yüzey tonu, boşluk ve hafif gölge ile katman ayrımı yapılmalı.
- 2D canvas ile uygulama kabuğu aynı renkte olmamalı; çalışma alanı ilk bakışta ayrışmalı.
- Koyu tema sonradan eklenebilir ancak renk tokenları baştan semantik tanımlanmalı.

### 3.2 Tipografi

- Arayüz fontu tek ve tutarlı olmalı; mevcut font altyapısındaki Geist kullanılmalı.
- Sayısal ölçülerde hizalamayı kolaylaştırmak için tabular numbers kullanılmalı.
- Başlıklar bağıran uppercase yerine kısa ve doğal cümle biçiminde olmalı.
- Hiyerarşi font boyutundan çok ağırlık, renk ve boşlukla kurulmalı.

Önerilen ölçek:

- Sayfa/araç başlığı: 16–18 px, semibold
- Panel bölüm başlığı: 13–14 px, semibold
- Ana gövde: 13–14 px, regular
- Yardımcı metin: 11–12 px, regular
- Ölçüm etiketi: 12 px, medium, tabular numbers

### 3.3 Yüzey, radius ve gölge

- Ana paneller: 12–16 px radius
- Butonlar ve inputlar: 8–10 px radius
- Canvas üstü floating araçlar: 12 px radius, yumuşak gölge ve hafif blur
- Her kutuya border vermek yerine yalnızca gereken yerlerde ince ayraç kullanmak
- Gölgeyi dekorasyon için değil, katman ilişkisini anlatmak için kullanmak

### 3.4 İkonografi

- Lucide ikonları korunabilir ancak boyut ve stroke kalınlığı standartlaştırılmalı.
- İkon tek başına kullanılıyorsa tooltip zorunlu olmalı.
- Bir işlem için uygulamanın her yerinde aynı ikon kullanılmalı.
- Dosya işlemleri ile tasarım işlemleri görsel olarak ayrılmalı.

---

## 4. Yeni Editör Yerleşimi

## 4.1 Üst çubuğu sadeleştir

Mevcut üst çubuk üç farklı işi aynı seviyede yapıyor. Yeni düzende:

### Sol alan

- FloorApp sembolü
- Düzenlenebilir proje adı
- Kayıt durumu: `Kaydedildi`, `Kaydediliyor…`, `Kaydedilemedi`
- Geri al / yinele

### Orta alan

- 2D / 3D görünüm değiştirici
- Görünüm adı veya aktif araç

### Sağ alan

- Önizleme
- Telefona bağlan
- Paylaş/dışa aktar menüsü
- Daha fazla menüsü

`Kaydet`, `JSON içe aktar`, `JSON dışa aktar` ve `Sıfırla` gibi düşük frekanslı işlemler “Daha fazla” menüsüne alınmalı. Böylece toolbar, dosya yöneticisi gibi değil tasarım aracı gibi görünür.

## 4.2 Sol paneli “Nesne Kitaplığı”na dönüştür

Sol panel yalnızca uzun bir katalog olmamalı.

Önerilen yapı:

1. Üstte arama alanı: “Koltuk, pencere, masa ara…”
2. Yatay kategori filtreleri: `Tümü`, `Oturma`, `Yatak`, `Mutfak`, `Banyo`, `Yapısal`
3. Hızlı alan: `Son kullanılanlar` ve `Favoriler`
4. Nesne kartlarında küçük izometrik önizleme, isim ve varsayılan ölçü
5. Tıklayarak ekleme yanında canvas’a sürükleyip bırakma
6. Panel genişliğini kullanıcı tarafından değiştirme

Katalog kartları tek tip kutular yerine görsel karakter taşımalı. Yapısal öğeler ile mobilyalar renk veya bölüm farkıyla ayrılmalı.

## 4.3 Sağ paneli bağlamsal inspector yap

Sağ panel her durumda tüm inputları göstermemeli. Üç katmana ayrılmalı:

- **Hızlı işlemler:** Kilitle, çoğalt, sil, 45° döndür
- **Temel özellikler:** İsim, konum, ölçü, yön
- **Gelişmiş:** Hassas koordinatlar ve teknik ayarlar; varsayılan olarak kapalı

İyileştirmeler:

- X/Y/Z inputları anlamlı ikonlar ve birimlerle gösterilmeli.
- Ölçülerin birbirine oranını korumak için zincir/kilit kontrolü eklenmeli.
- Sayısal inputlarda drag-to-adjust davranışı kullanılmalı.
- Değişiklik sırasında sonuç canvas üzerinde canlı görünmeli.
- Silme işlemi büyük kırmızı buton yerine menüde veya panel altında daha sakin gösterilmeli.
- Hiçbir şey seçili değilken panel boş kalmamalı; proje özeti ve yardım göstermeli.

## 4.4 Canvas üstü araç katmanı ekle

Canvas, sadece çizimin göründüğü alan değil, düzenlemenin gerçekleştiği aktif yüzey olmalı.

### Sol üst floating araç grubu

- Seçim
- El/pan
- Oda ekle
- Duvar çiz
- Ölçüm aracı
- Açıklama/not

### Sağ üst görünüm grubu

- Izgara aç/kapat
- Snap aç/kapat
- Ölçüleri göster/gizle
- Duvarları göster/gizle
- Görünümü merkeze al

### Sağ alt navigasyon

- Zoom + / −
- Görünümü sığdır
- 3D’de yön küpü
- Mini harita veya kat özeti

### Alt orta bağlamsal bar

Bir nesne seçildiğinde canvas üzerinde küçük bir aksiyon barı belirmeli:

- Döndür
- Çoğalt
- Kilitle
- Öne/arkaya al
- Sil

Bu bar yalnızca seçime bağlı görünür; inspector açmadan sık işlemler yapılabilir.

---

## 5. İşlevsel Tasarım İyileştirmeleri

Bunlar ürünleştirme özelliği değil, doğrudan editör kullanım kalitesini artıran işlevlerdir.

## P0 — Editörün temel hissini düzelt

### Undo / redo

- Toolbar butonları ve `Cmd/Ctrl + Z`, `Cmd/Ctrl + Shift + Z`
- Sürükleme işlemi tek geçmiş adımı olmalı
- Silme sonrası kısa süreli “Geri al” toast'ı gösterilmeli

### Akıllı snap ve hizalama rehberleri

- Izgaraya, duvara, nesne merkezine ve nesne kenarına snap
- Snap gerçekleştiğinde renkli kılavuz çizgisi ve ölçü etiketi
- `Alt/Option` ile geçici snap kapatma
- Geçersiz yerleşimde kırmızı footprint, geçerli yerleşimde marka rengi

### Çoklu seçim

- Shift ile seçim ekleme/çıkarma
- Sürükleyerek seçim alanı
- Toplu taşıma, döndürme, kilitleme ve silme
- Seçim sayısının bağlamsal barda gösterilmesi

### Kopyalama ve çoğaltma

- `Cmd/Ctrl + C`, `Cmd/Ctrl + V`, `Cmd/Ctrl + D`
- `Alt/Option + sürükle` ile hızlı çoğaltma
- Yeni kopyanın küçük bir offset ile yerleşmesi

### Ölçülendirme

- Oda en/boy ölçülerini canvas üzerinde göster
- Nesne seçildiğinde nesne ölçülerini ve duvarlara uzaklığını göster
- Ölçü etiketine tıklayarak sayısal değer düzenleme

## P1 — Düzenleme akışını profesyonelleştir

### Bağlamsal komut paleti

`Cmd/Ctrl + K` ile açılan komut paleti:

- “Koltuk ekle”
- “3D görünüme geç”
- “Tümünü seç”
- “Görünümü sığdır”
- “Projeyi dışa aktar”

Bu özellik hem güçlü kullanıcılara hız kazandırır hem menülerde kaybolmayı azaltır.

### Katmanlar / sahne ağacı

- Odalar ve nesneler hiyerarşik listede gösterilmeli
- Listeden seçim, görünürlük ve kilit kontrolü yapılmalı
- Nesne adları yeniden düzenlenebilmeli
- Büyük planlarda canvas üzerinde kaybolan öğeler kolay bulunmalı

### Odak ve izolasyon modu

- Seçili odayı izole et
- Diğer odaları düşük opaklıkta göster
- `F` ile seçili nesneye odaklan
- Seçili nesne dışındakileri geçici gizle

### Klavye ve fare davranış standardı

- Space + drag: pan
- Mouse wheel / pinch: zoom
- Delete/Backspace: seçili öğeyi sil
- Escape: işlemi iptal et veya seçimi temizle
- Ok tuşları: küçük adımlarla taşı
- Shift + ok: büyük adımlarla taşı

## P2 — Görsel kalite ve keyif

### 2D görünümü zenginleştir

- İnce noktalı grid ve ana eksen çizgileri
- Duvarlara yumuşak iç gölge
- Mobilyalarda sade üstten görünüş siluetleri
- Seçimde güçlü ama zarif outline
- Kapı açılım yayı ve pencere göstergeleri
- Oda adını ve alanını canvas üzerinde göstermek

### 3D görünümü iyileştir

- Daha doğal çevresel ışık ve yumuşak gölgeler
- Zemin ile duvarı malzeme tonu üzerinden ayırmak
- Kamera hareketlerine easing eklemek
- Seçili nesne için yumuşak outline veya glow
- 2D’den 3D’ye geçerken aynı oda odağını korumak
- Duvarları kamera açısına göre fade etmek veya kesit görünümü sunmak

### Mikro etkileşimler

- Panel açılış/kapanışlarında 180–240 ms doğal geçiş
- Hover durumlarında 120–160 ms geçiş
- Nesne eklenirken kısa scale/fade animasyonu
- Geçerli snap anında küçük görsel vurgu
- Kayıt tamamlandığında sessiz durum değişimi; gereksiz toast göstermemek
- Hata ve başarı animasyonlarında hareket azaltma tercihine saygı göstermek

---

## 6. Mobil Deneyimi Masaüstünün Küçük Hali Olmaktan Çıkar

Mobilde üç kolonlu masaüstü düzenini drawer'lara sıkıştırmak yerine dokunmaya özel bir deneyim tasarlanmalı.

### Mobil yerleşim

- Üstte sade proje başlığı ve geri al/yinele
- Altta sürekli görünen araç çubuğu: `Ekle`, `Seç`, `Görünüm`, `Özellikler`
- Nesne seçildiğinde bottom sheet inspector
- Katalog tam ekran veya yüksek bottom sheet
- En az 44×44 px dokunma alanları

### Mobil etkileşimler

- Tek dokunma: seç
- Uzun basma: bağlamsal menü
- İki parmak: pan/zoom
- Döndürme tutamacı büyük ve erişilebilir olmalı
- Seçili nesne parmağın altında kaybolmamalı; gerekli durumda offset gösterilmeli
- Sayısal input açıldığında uygun mobil klavye kullanılmalı

---

## 7. İlk Kullanım ve Boş Durumlar

İlk kullanım deneyimi ayrı bir eğitim turu gibi değil, arayüzün doğal bir parçası olmalı.

### İlk açılış

Canvas ortasında üç seçenek göster:

1. `Boş oda oluştur`
2. `Telefondan ölçü gönder`
3. `Örnek planı keşfet`

### Bağlamsal yönlendirme

- İlk nesne eklendiğinde taşıma ve döndürme tutamaçlarını bir kez açıkla.
- İlk 3D geçişinde kamera kontrolünü kısa bir ipucuyla göster.
- Boş inspector içinde “Bir oda veya nesne seç” demek yerine seçimin ardından nelerin yapılabileceğini küçük görselle anlat.
- Yardım ipuçları kapatılabilir ve tekrar açılabilir olmalı.

---

## 8. Erişilebilirlik ve Tutarlılık Kuralları

- Arayüz dili tek olmalı; bu proje için varsayılan dil Türkçe önerilir.
- Sadece renk ile durum anlatılmamalı; ikon, metin veya desen ile desteklenmeli.
- Tüm ikon butonlarında erişilebilir ad ve tooltip bulunmalı.
- Focus halkaları görünür ve tutarlı olmalı.
- Klavye ile temel editör akışları tamamlanabilmeli.
- Kontrast oranları WCAG AA seviyesini karşılamalı.
- `prefers-reduced-motion` tercihinde büyük animasyonlar azaltılmalı.
- Destructive aksiyonlarda geri alma öncelikli olmalı; modal onay yalnızca geri dönüşü olmayan işlemlerde kullanılmalı.

---

## 9. Uygulama Yol Haritası

## Faz 1 — Tasarım sistemi ve editör kabuğu

1. Semantik renk, spacing, radius, shadow ve motion tokenlarını tanımla.
2. Geist fontunu gerçekten uygula; body üzerindeki Arial kullanımını kaldır.
3. Ortak `Button`, `IconButton`, `Tooltip`, `Panel`, `Input`, `SegmentedControl` bileşenlerini oluştur.
4. Toolbar'ı yeni hiyerarşiye göre sadeleştir.
5. Sol ve sağ paneli yeni yüzey sistemiyle yeniden tasarla.
6. Arayüz dilini Türkçede birleştir.

**Tamamlanma ölçütü:** Uygulama tek bir görsel dile sahip olmalı ve canvas açıkça başrolü almalı.

## Faz 2 — Canvas etkileşim kalitesi

1. Canvas üstü floating araçları ekle.
2. Undo/redo ekle.
3. Snap, hizalama rehberleri ve ölçü etiketlerini ekle.
4. Bağlamsal seçim barını ekle.
5. Kopyalama, çoğaltma ve klavye kısayollarını ekle.
6. Seçim ve sürükleme geri bildirimlerini iyileştir.

**Tamamlanma ölçütü:** Kullanıcı inspector'a sürekli gitmeden hızlı ve güvenli düzenleme yapabilmeli.

## Faz 3 — Katalog ve inspector deneyimi

1. Katalog araması, kategoriler, favoriler ve son kullanılanları ekle.
2. Drag-and-drop ile nesne eklemeyi destekle.
3. Inspector'ı hızlı/temel/gelişmiş katmanlara ayır.
4. Ölçü inputlarını daha anlaşılır ve canlı düzenlenebilir yap.
5. Katmanlar/sahne ağacını ekle.

**Tamamlanma ölçütü:** Kullanıcı büyük bir planda aradığı nesneyi ve ayarı saniyeler içinde bulabilmeli.

## Faz 4 — Görsel kalite ve mobil

1. 2D çizim stilini iyileştir.
2. 3D ışık, gölge, kamera ve seçimi iyileştir.
3. Geçiş ve mikro etkileşimleri ekle.
4. Mobil bottom toolbar ve bottom sheet deneyimini oluştur.
5. İlk kullanım ve boş durumları tasarla.
6. Erişilebilirlik denetimini tamamla.

**Tamamlanma ölçütü:** Uygulama hem ekran görüntüsünde kaliteli görünmeli hem uzun kullanımda hızlı ve sakin hissettirmeli.

---

## 10. Claude İçin Uygulama Rehberi

Aşağıdaki kurallar, bu tasarım yol haritasını uygularken kullanılmalıdır.

### Her görevden önce

1. Kök `AGENTS.md` dosyasını oku.
2. Next.js kodu değişecekse `node_modules/next/dist/docs/` altındaki ilgili rehberi oku.
3. İlgili mevcut bileşenleri, store'u ve etkileşimleri incele.
4. Değişikliğin masaüstü, tablet ve mobil etkisini birlikte değerlendir.
5. Büyük görsel dönüşümleri tek seferde değil, küçük ve doğrulanabilir parçalar halinde uygula.

### Tasarım uygulama kuralları

- Yeni renkleri doğrudan bileşenlere dağınık biçimde yazma; semantik token kullan.
- Aynı görevi yapan kontroller için ortak bileşen kullan.
- Canvas alanını gereksiz kalıcı panellerle daraltma.
- İkon tek başına kullanıldığında tooltip ve erişilebilir ad ekle.
- Hover yanında focus, active, disabled ve loading durumlarını da tasarla.
- Animasyonları kısa ve işlevsel tut; `prefers-reduced-motion` desteğini unutma.
- Dokunma hedeflerini mobilde en az 44×44 px yap.
- Arayüzde Türkçe ve İngilizce metni karıştırma.
- Yeni etkileşimlerde klavye karşılığını düşün.
- Yıkıcı işlemlerde mümkünse onay modalı yerine geri alma sun.

### Görsel değişiklik tamamlanma kontrolü

- Masaüstü ekran görüntüsü al ve incele.
- Mobil ekran görüntüsü al ve incele.
- Panel açık/kapalı durumlarını kontrol et.
- Seçim yok, oda seçili ve nesne seçili durumlarını kontrol et.
- 2D ve 3D görünümü kontrol et.
- Focus, hover, active ve disabled durumlarını kontrol et.
- Taşma, metin kırılması ve düşük kontrast sorunlarını kontrol et.
- Lint ve build çalıştır.

### Claude'a verilecek görev şablonu

```md
FloorApp tasarım yol haritasındaki şu görevi uygula:

[GÖREV]

Kullanıcı deneyimi hedefi:
[Bu değişiklik kullanıcıya nasıl hissettirmeli ve hangi sürtünmeyi azaltmalı?]

Kabul kriterleri:
- [Görsel kriter]
- [Etkileşim kriteri]
- [Mobil kriter]
- [Erişilebilirlik kriteri]

Kapsam dışı:
- [Bu görevde yapılmayacaklar]

Önce mevcut davranışı ve ilgili dosyaları incele. Next.js kodu değişecekse
ilgili yerel Next.js dokümanını oku. Tasarım tokenlarını ve ortak bileşenleri
tercih et; geçici ve dağınık stil çözümleri üretme. Değişikliği küçük adımlarla
uygula, lint/build çalıştır ve masaüstü ile mobil ekran görüntülerini incele.
Görev sonunda değişen dosyaları, tasarım kararlarını ve doğrulama sonuçlarını özetle.
```

---

## 11. İlk Uygulanması Önerilen Beş Görev

En yüksek görsel ve işlevsel etki için sıralama:

1. **Tasarım tokenları + ortak arayüz bileşenleri + Geist fontu**
2. **Yeni sade toolbar + canvas üstü floating görünüm kontrolleri**
3. **Katalog araması, kategorileri ve iyileştirilmiş nesne kartları**
4. **Bağlamsal inspector + seçili nesne aksiyon barı**
5. **Snap rehberleri, ölçüler ve undo/redo**

Bu beş görev tamamlandığında FloorApp yeni özelliklerle şişmeden çok daha modern, güven veren ve profesyonel bir tasarım aracı gibi hissedecektir.
