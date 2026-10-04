# ⚡ LuckyStrike OGame Helper (v7.0)

OGame için özel olarak geliştirilmiş; **Maliyet Sepeti (Resmi Formüllerle Çoklu Kademe & Nakliye Hesabı)**, **Galaxy Scanner (Slot 8 & Çoklu Işınlanma Arayıcı)**, **Player Finder (Oyuncu & Gezegen Bulucu)**, **Sesli & Masaüstü Tehdit Alarmı** ve **Gerçek Zamanlı Harabe Avcısı (Debris Hunter - Sonsuz Uzaklar & Hızlı Geçiş Desteği)** modüllerini içeren gelişmiş tarayıcı eklentisidir (**Chrome / Edge Extension - Manifest V3** ve **Tampermonkey Userscript**).

Ban riski taşımayan resmi Gameforge XML API altyapısını ve yerel ses sentezleme (Web Audio API) teknolojisini kullanır, oyun içi arayüzle kusursuz entegre olur.

---

## 🚀 Kurulum (2 Farklı Yöntem)

### Yöntem 1: Doğrudan Chrome / Edge Eklentisi Olarak (Önerilen 🌟)
*Tampermonkey'e hiç ihtiyaç duymadan, tarayıcınızın kendi eklentisi olarak çalışır.*

1. Bu depoyu indirin (`Code -> Download ZIP` veya bilgisayarınızdaki klasör).
2. Tarayıcınızda eklentiler sayfasını açın:
   * **Google Chrome için:** `chrome://extensions`
   * **Microsoft Edge için:** `edge://extensions`
3. Sağ üst köşedeki (veya sol menüdeki) **"Geliştirici Modu"** (Developer Mode) anahtarını açın.
4. Sol üstte beliren **"Paketlenmemiş öğe yükle"** (Load unpacked) butonuna tıklayın.
5. Deponun bulunduğu klasörü seçin (`luckystrike-ogame-helper`).
6. Eklenti anında kurulacaktır! OGame sekmenizi açıp sayfayı yenilemeniz yeterlidir.

---

### Yöntem 2: Tampermonkey Kullanıcı Betiği Olarak
1. Tarayıcınızdaki Tampermonkey eklenti panelini açın.
2. Yeni script oluşturup [`luckystrike_ogame_helper.js`](luckystrike_ogame_helper.js) dosyasının içeriğini yapıştırın.
3. `Ctrl + S` ile kaydedin.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🏗️ Maliyet Sepeti (Cost Cart)

<p align="center">
  <img src="screenshots/tab_cart.png" width="380" alt="LuckyStrike Maliyet Sepeti">
</p>

* **Kompakt Entegrasyon:** Herhangi bir bina, araştırma veya canlı türü detayına tıkladığınızda sol alttaki görselin üzerinde `[ − ] [ +N ] [ + ]` kademe ayarı ve `[📥 Sepete Ekle]` butonu belirir.
* **Resmi Formül & Katsayılarla Çoklu Kademe Hesabı:**
  * **Klasik Binalar & Madenler:** Metal (`1.50`), Kristal (`1.60`), Deut (`1.50`), Füzyon (`1.80`), Astrofizik (`1.75`), Araştırmalar (`2.00`).
  * **Canlı Türleri (Resmi Gameforge LFMaster Tablosu):** Canlı türü binaları ve araştırmalarının exponansiyel formülü ($\text{Cost}(L) = \text{Cost}(L-1) \times \text{Katsayı} \times \frac{L}{L-1}$) birebir işletilir. Rün Teknoloji Kurumu (`1.30`), Meditasyon Sığınağı (`1.20`), Oriktoryum (`1.65`), Megalit (`1.50`) ve tüm 4 ırkın (Rock'tal, İnsan, Mecha, Kaelesh) 48 binası ile 72 teknolojisi kuruşu kuruşuna doğru hesaplanır.
* **Tersane & Savunma Adet Desteği:** Girilen gemi/savunma üretim adediyle maliyeti otomatik çarpar.
* **🚛 Otomatik Nakliye İhtiyacı:** Sepetteki net hammadde açığını karşılamak için kaç adet **Büyük Nakliye (BN - 25K)** ve **Küçük Nakliye (KN - 5K)** gerektiği toplamların hemen altında otomatik hesaplanır.
* **📉 Mevcut Gezegen Kaynağını Sepetten Düş:** Tek tıkla o anki gezegeninizdeki Metal, Kristal ve Deuterium'u sepetten negatif kalem olarak düşer, net kalan hammadde açığını gösterir.
* **📋 Tek Tıkla Sayı Kopyalama:** Kalan Metal, Kristal, Deuterium ve Net İhtiyaç tutarlarının yanındaki `📋` butonuna basarak sadece ilgili sayıyı panoya kopyalayabilirsiniz (nakliye/filo gönderirken çok pratiktir).
* **Panoya Kopyala & Temizle:** İttifak arkadaşlarınıza göndermek için sepetin tam dökümünü tek tıkla kopyalayabilir veya sepeti sıfırlayabilirsiniz.

---

### 2. 🌌 Galaxy Scanner (Boş Slot & Işınlanma Arayıcı)

<p align="center">
  <img src="screenshots/tab_scanner.png" width="380" alt="LuckyStrike Galaxy Scanner">
</p>

* **Saniyeler İçinde Tüm Evren Analizi:** Resmi `/api/universe.xml` verisini çekerek 9 galaksi ve 499 güneş sistemindeki tüm dolu gezegenleri anında eler.
* **Hedef Slot Filtreleme:**
  * En büyük gezegenlerin çıktığı **8. slot** veya `7, 8, 9` kombinasyonları.
  * Hızlı seçim çipleri: `[🎯 Sadece 8]`, `[⭐ 7, 8, 9]`, `[❄️ 12-15 (Deut)]`, `[☀️ 1-3 (Solar)]`, `[🪐 Tamamen Boş (1-15)]`.
* **👥 Min Eşzamanlı Boş Slot (Grupça Işınlanma):**
  * Seçtiğiniz slotlardan aynı güneş sisteminde aynı anda en az 2, 3, 4 veya 5 tanesinin boş olduğu sistemleri listeler. Arkadaşlarınızla aynı sisteme yan yana ışınlanmak (relocate) için idealdir.
* **🚀 Tek Tıkla Galaksiye Git:** Çıkan her sonucun yanındaki `🚀` butonu oyunda doğrudan o galaksi ve sisteme yönlendirir.

---

### 3. 🔍 Player Finder (Oyuncu & Gezegen Arama)

<p align="center">
  <img src="screenshots/tab_finder.png" width="380" alt="LuckyStrike Player Finder">
</p>

* **Resmi API Tabanlı:** `/api/players.xml` ve `/api/universe.xml` verilerini oturum önbelleğiyle kullanarak kota aşımı veya ban riski olmadan çalışır.
* **XSS Korumalı & Güvenli:** Evrendeki tüm oyuncu ve gezegen isimleri tam sanitizasyondan geçirilerek güvenle listelenir.
* **Esnek Arama Modları:**
  * **Oyuncu Adıyla:** Oyuncunun aktiflik durumunu (`aktif`, `(i)`, `(v)`, vb.) ve sahip olduğu tüm gezegenlerin koordinatlarını listeler.
  * **Gezegen Adıyla:** Belirtilen addaki gezegenlerin koordinatlarını ve kime ait olduğunu bulur.
* **🚀 Hızlı Seyahat:** Bulunan her gezegen koordinatının yanındaki `🚀` butonuyla ilgili sisteme tek tıkla gidebilirsiniz.

---

### 4. 🚨 Saldırı & Sonda Sesli Alarmı (Threat Alarm)

<p align="center">
  <img src="screenshots/tab_alarm.png" width="380" alt="LuckyStrike Sesli Alarm">
</p>

* **İki Ayrı Tehdit Algılama:** Gelen gerçek filo saldırıları ile casus sondası taramaları bağımsız olarak izlenir.
* **🖥️ Masaüstü Bildirimleri (Web Notifications API):** Sekmeniz arka plandayken veya simge durumundayken sistem anında masaüstü bildirimi göndererek uyarır.
* **Özel Ses Sentezleme (Web Audio API):**
  * **🚨 Saldırı Sesleri:** Taktiksel Klakson, Kırmızı Alarm Sireni, Acil Durum Nabzı (Kaçırılmaması için 2 kez peş peşe çalar).
  * **📡 Sonda Sesleri:** Gerçekçi denizaltı sonar akustiği (Derin Deniz Sonarı, Aktif Avcı Sonarı, Taktik Yankı Sonarı).
* **Ses Seviyesi & Tekrar Sıklığı Ayarı:** 1 kez veya her 5 - 10 - 15 - 30 - 60 saniyede bir tekrarlama seçeneği.
* **⏹️ Akıllı Susturma (Stop):** Devam eden tehditler için panodaki ve başlıktaki `[ ⏹️ Sustur ]` butonuna basıldığında alarm sessize alınır. Tehdit bittiğinde sistem kendini otomatik olarak sıfırlayıp bir sonraki tehdide yeniden hazır hale gelir.

---

### 5. 🛰️ Harabe Avcısı (Debris Hunter)

<p align="center">
  <img src="screenshots/tab_debris.png" width="380" alt="LuckyStrike Harabe Avcısı">
</p>

* **🪐 Gezinirken Arka Planda Otomatik Tespit:** Galaksi sayfasında gezerken arka planda ekrana gelen harabeleri kural ihlali veya bot riski olmadan anında okur.
* **⚡ Kademeli Çoklu Tarama (Multi-Stage):** Hızlı ok geçişlerinde veya AJAX sayfa yüklemelerinde hiçbir veriyi kaçırmamak için (30ms, 100ms, 220ms, 400ms, 650ms, 1000ms) kademeli arka plan taraması çalışır.
* **🌌 16. Pozisyon (Sonsuz Uzaklar / Keşif Harabesi):** 16. slottaki harabeler resmi `#debris16` tooltip ayrıştırıcısı ve çok katmanlı DOM okumasıyla hatasız tespit edilir.
* **⚡ Eşik Belirleme & Hızlı Seçim:** İster minimum kaynak eşiğini kendiniz yazın, ister hızlı çiplerden (`50K`, `100K`, `250K`, `500K`, `1M`, `5M`) tek tıkla belirleyin.
* **🎵 Akıllı Sesli Uyarı & Sonar Seçenekleri:**
  * Sadece belirlediğiniz eşiğin üzerindeki ve **listeye yeni eklenen** harabelerde ses çalar.
  * Zaten listede olan harabelerde veya sayfa geçişlerindeki yenilenmelerde tekrar tekrar ötmez.
  * 3 farklı denizaltı sonar sesi (Derin Deniz Sonarı, Aktif Avcı Sonarı, Taktik Yankı Sonarı) ve anında test butonu.
* **🚛 İhtiyaç Duyulan Geri Dönüşümcü (GD) Hesabı:** Her harabenin toplam kaynağına göre kaç adet Geri Dönüşümcü gemisi gerektiği anında hesaplanır.
* **📊 Detaylı Hammadde Dağılımı:** Metal, Kristal ve Deuterium miktarları renk kodlu olarak net şekilde listelenir.
* **🚀 Tek Tıkla Koordinata Git:** Listelenen harabenin koordinatına veya `🚀 Git` butonuna basarak doğrudan galakside o sisteme sıçrayabilirsiniz.
* **🗑️ Kolay Yönetim:** İstemediğiniz harabeyi tek tek `✖` butonuyla kaldırabilir veya `🗑️ Listeyi Temizle` ile tüm listeyi sıfırlayabilirsiniz.
* **🟢 Aktif / Pasif İzleme Anahtarı:** Dilediğiniz zaman harabe izlemesini tek tuşla pasife alabilirsiniz.

---

### 6. 🎨 Modern & Kullanıcı Dostu UI
* **⚡ Kayan Eylem Butonu (FAB):** Ekranın sağ alt köşesinde şık, kompakt `⚡` butonu.
* **📱 Responsive Üst Menü (`@container`):** Panel daraltıldığında tüm sekmeler (Maliyet, Scanner, Finder, Alarm, Harabe) aynı anda senkronize olarak kompakt ikon-üstte yazı-altta moduna geçer.
* **Sürüklenebilir & Boyutlandırılabilir:** Paneli hem üst başlığından hem de alt `⠿ O G A M E ⠿` çubuğundan taşıyabilir; köşelerinden tutarak dilediğiniz gibi büyütüp küçültebilirsiniz.
* **Dinamik Esneyen Listeler (Flex):** Paneli aşağı doğru büyüttüğünüzde sonuç listeleri (Maliyet, Scanner, Finder, Harabe) otomatik olarak dikeyde esner ve tüm alanı verimli kullanır.
* **Sekme & Durum Hafızası:** Sayfayı yenilediğinizde açık olan sekmeniz, boyutlar ve panel konumu korunur.
* **Karanlık Tema:** OGame'in modern karanlık temasıyla %100 uyumlu renk paleti.

---

## 📝 Sürüm Geçmişi

### v7.0
* **Dinamik Gemi Kapasiteleri & Teknoloji Senkronizasyonu:** Hiperuzay Teknolojisi (Teknoloji ID 114) ve canlı türü bonusları arka planda otomatik çekilerek Küçük Nakliye (KN) ve Büyük Nakliye (BN) gerçek kargo kapasiteleri tam doğrulukla hesaplandı.
* **Akıllı 3'lü Filo Yükleme Butonu:** Filo gönderiminde kargo kapasitesi kilidini aşmak için önce gemi sayısını otomatik seçen ardından kaynakları dolduran buton grubu eklendi:
  * `⚡ Gemiye Yükle (Otomatik)`: Önce eldeki KN yetiyorsa KN'yi, yetmiyorsa BN'yi seçer.
  * `📦 [X] KN`: Sadece Küçük Nakliye seçip kaynakları doldurur.
  * `🚛 [X] BN`: Sadece Büyük Nakliye seçip kaynakları doldurur.
* **Ayrılmış Pozitif (+) ve Negatif (-) Nakliye Analizi:** Sepetteki toplam maliyet gereksinimi (➕), mevcut gezegen kaynağı (➖) ve net kalan açık (📊) ayrı ayrı listelenerek her durum için gereken BN ve KN adetleri netleştirildi.
* **Akıllı Net Açık Dengeleme:** Gezegendeki kaynak düşüldüğünde fazlası olan kaynaklar için filoya gereksiz sıfır/tam yükleme yapılması önlendi; yalnızca açığı bulunan kaynaklar filoya yüklenecek şekilde optimize edildi.
* **Hata Düzeltmeleri & Kararlılık:** Harabe avcısı açma/kapama fonksiyonundaki `ReferenceError` ve oyuncu arama panelindeki event listener ID uyumsuzlukları giderildi.

### v6.0
* **Harabe Avcısı Güçlendirmesi:** Kademeli çok aşamalı tarama motoru (`triggerGalaxyScanSequence`), klavye ve ok butonları geçiş kancaları entegre edildi. Hızlı geçişlerde harabe kaçırma sorunu giderildi.
* **Sonsuz Uzaklar (16. Slot):** Expedition harabesi hesaplaması resmi `#debris16` altyapısıyla güçlendirildi, yanlış satır okumaları ve yapışık sayı çakışmaları tamamen çözüldü.
* **Responsive Menü:** Üst menü sekmeleri için `@container` sorguları eklenerek dar panel genişliklerinde senkronize ikon-yazı yerleşimi sağlandı.
* **Temizlik:** Kararsız filo gönderme işlevleri tamamen kaldırılarak doğrudan galaksi koordinat yönlendirmesi sağlandı. Proje kodları ve userscript 1:1 UTF-8 BOM'suz eşitlendi.


