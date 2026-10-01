# ⚡ LuckyStrike OGame Helper (v4.0)

OGame için özel olarak geliştirilmiş; **Maliyet Sepeti (Resmi Formüllerle Çoklu Kademe Hesabı)**, **Galaxy Scanner (Slot 8 & Çoklu Işınlanma Arayıcı)** ve **Player Finder (Oyuncu & Gezegen Bulucu)** modüllerini içeren gelişmiş tarayıcı eklentisidir (**Chrome / Edge Extension - Manifest V3** ve **Tampermonkey Userscript**).

Ban riski taşımayan resmi Gameforge XML API altyapısını kullanır, oyun içi arayüzle kusursuz entegre olur.

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
* **Kompakt Entegrasyon:** Herhangi bir bina, araştırma veya canlı türü detayına tıkladığınızda sol alttaki görselin üzerinde `[ − ] [ +N ] [ + ]` kademe ayarı ve `[📥 Sepete Ekle]` butonu belirir.
* **Resmi Formül & Katsayılarla Çoklu Kademe Hesabı:**
  * **Klasik Binalar & Madenler:** Metal (`1.50`), Kristal (`1.60`), Deut (`1.50`), Füzyon (`1.80`), Astrofizik (`1.75`), Araştırmalar (`2.00`).
  * **Canlı Türleri (Resmi Gameforge LFMaster Tablosu):** Canlı türü binaları ve araştırmalarının exponansiyel formülü ($\text{Cost}(L) = \text{Cost}(L-1) \times \text{Katsayı} \times \frac{L}{L-1}$) birebir işletilir. Rün Teknoloji Kurumu (`1.30`), Meditasyon Sığınağı (`1.20`), Oriktoryum (`1.65`), Megalit (`1.50`) ve tüm 4 ırkın (Rock'tal, İnsan, Mecha, Kaelesh) 48 binası ile 72 teknolojisi kuruşu kuruşuna doğru hesaplanır.
* **Tersane & Savunma Adet Desteği:** Girilen gemi/savunma üretim adediyle maliyeti otomatik çarpar.
* **📉 Mevcut Gezegen Kaynağını Sepetten Düş:** Tek tıkla o anki gezegeninizdeki Metal, Kristal ve Deuterium'u sepetten negatif kalem olarak düşer, net kalan hammadde açığını gösterir.
* **📋 Tek Tıkla Sayı Kopyalama:** Kalan Metal, Kristal, Deuterium ve Net İhtiyaç tutarlarının yanındaki `📋` butonuna basarak sadece ilgili sayıyı panoya kopyalayabilirsiniz (nakliye/filo gönderirken çok pratiktir).
* **Panoya Kopyala & Temizle:** İttifak arkadaşlarınıza göndermek için sepetin tam dökümünü tek tıkla kopyalayabilir veya sepeti sıfırlayabilirsiniz.

---

### 2. 🌌 Galaxy Scanner (Boş Slot & Işınlanma Arayıcı)
* **Saniyeler İçinde Tüm Evren Analizi:** Resmi `/api/universe.xml` verisini çekerek 9 galaksi ve 499 güneş sistemindeki tüm dolu gezegenleri anında eler.
* **Hedef Slot Filtreleme:**
  * En büyük gezegenlerin çıktığı **8. slot** veya `7, 8, 9` kombinasyonları.
  * Hızlı seçim çipleri: `[🎯 Sadece 8]`, `[⭐ 7, 8, 9]`, `[❄️ 12-15 (Deut)]`, `[☀️ 1-3 (Solar)]`.
* **👥 Min Eşzamanlı Boş Slot (Grupça Işınlanma):**
  * Seçtiğiniz slotlardan aynı güneş sisteminde aynı anda en az 2, 3 veya 4 tanesinin boş olduğu sistemleri listeler. Arkadaşlarınızla aynı sisteme yan yana ışınlanmak (relocate) için idealdir.
* **🚀 Tek Tıkla Galaksiye Git:** Çıkan her sonucun yanındaki `🚀` butonu oyunda doğrudan o galaksi ve sisteme yönlendirir.
* **ℹ️ Önemli Not (Yok Edilmiş / İskan Slotları):** Terk edilmiş ("Yok edilmiş gezegen") veya başka bir oyuncunun 24 saatliğine kilitlediği ("İskan için rezerve edilmiş") slotlar, Gameforge'un resmi API'sinde henüz fiziksel bir gezegen olmadığı için boş olarak listelenir. Listelenen adayların yanındaki `🚀` butonuna tıklayarak slotun durumunu oyun içinden canlı olarak 1 saniyede doğrulayabilirsiniz.

---

### 3. 🔍 Player Finder (Oyuncu & Gezegen Arama)
* **Resmi API Tabanlı:** `/api/players.xml` ve `/api/universe.xml` verilerini 24 saatlik önbellekle kullanarak ban riski olmadan çalışır.
* **Esnek Arama Modları:**
  * **Oyuncu Adıyla:** Oyuncunun aktiflik durumunu (`aktif`, `(i)`, `(v)`, vb.) ve sahip olduğu tüm gezegenlerin koordinatlarını listeler.
  * **Gezegen Adıyla:** Belirtilen addaki gezegenlerin koordinatlarını ve kime ait olduğunu bulur.
* **🚀 Hızlı Seyahat:** Bulunan her gezegen koordinatının yanındaki `🚀` butonuyla ilgili sisteme tek tıkla gidebilirsiniz.

---

### 4. 🎨 Modern & Kullanıcı Dostu UI
* **⚡ Kayan Eylem Butonu (FAB):** Ekranın sağ alt köşesinde (sohbet baloncuğunun üstünde) şık, kompakt `⚡` butonu.
* **Sürüklenebilir Panel:** Paneli başlığından tutup ekranın istediğiniz yerine taşıyabilirsiniz; konumu hafızada (`localStorage`) saklanır.
* **Sekme & Durum Hafızası:** Sayfayı yenilediğinizde veya gezegenler arası geçiş yaptığınızda açık olan sekmeniz ve panel durumu kaybolmaz.
* **Karanlık Tema:** OGame'in modern karanlık temasıyla %100 uyumlu renk paleti.
