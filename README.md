# ⚡ LuckyStrike OGame Helper (v10.5)

[English](#-english-description) | [Türkçe](#-türkçe-açıklama)

---

## 🇹🇷 Türkçe Açıklama

**LuckyStrike OGame Helper**, OGame oyuncuları için günlük imparatorluk yönetimini, hammadde planlamasını, filo nakliye hesaplamalarını ve bilgi takibini kolaylaştırmak üzere tasarlanmış, **Gameforge oyun kurallarına tam uyumlu** bir kullanıcı arayüzü asistanıdır (**Chrome / Edge Extension - Manifest V3**).

### 🛡️ Gameforge & OGame Oyun Kurallarına Uyumluluk
LuckyStrike OGame Helper, **Gameforge Kullanım Şartları ve Oyun Kuralları (Kural 5: Otomasyon ve Bot Politikası)** titizlikle gözetilerek geliştirilmiştir:
- **Sadece Oyuncu Başındayken ve Pasif Çalışır:** Eklenti arka planda kendi kendine sunucuya istek atmaz. Bilgi takibi ve güncellemeler, yalnızca **oyuncu bilgisayar başındayken**, sayfalar arasında gezinirken veya tarayıcı sekmesi güncellendiğinde ekrana gelen verileri okur.
- **Otomasyon / Bot İçermez:** Filoları arka planda sessizce göndermez, bina/araştırma emri vermez. Kaynak doldurma ve filo hazırlama gibi kolaylaştırıcı işlemler yalnızca **oyuncunun bizzat butona tıklamasıyla** form alanlarına yazılır; son onay, gönderme (Space veya butona tıklama) ve karar kontrolü tamamen oyuncuya aittir.
- **Resmi Gameforge API Altyapısı:** Evren analizi ve oyuncu arama modülleri, Gameforge'un eklenti ve araç geliştiricileri için kamuya açık olarak sağladığı resmi XML API altyapısını (`/api/universe.xml`, `/api/players.xml`) kullanır.
- **İstemci Taraflı ve Gizlilik Odaklı:** Hiçbir kullanıcı verisi veya oyun bilgisi harici sunuculara aktarılmaz, tüm tercihler sadece yerel tarayıcı belleğinizde saklanır.

---

### 🌟 Oynanışı Kolaylaştıran Özellikler

#### 1. 🏗️ Maliyet Sepeti & Çoklu Kademe Hesabı

<p align="center">
  <img src="screenshots/tab_cart.png" width="380" alt="LuckyStrike Maliyet Sepeti">
</p>

- Bina veya araştırma detayına tıklandığında `[ − ] [ +N ] [ + ]` seçimi ve tek tıkla sepete ekleme.
- **Resmi Gameforge LFMaster Tablosu:** 4 ırkın (Rock'tal, İnsan, Mecha, Kaelesh) 48 binası ve 72 araştırması dahil tüm binaların çoklu kademe maliyetlerini tam doğrulukla hesaplar.
- **Mevcut Kaynağı Düş:** Gezegendeki kaynakları sepetten düşerek net açığı gösterir.
- **Nakliye Filosu İhtiyacı:** Kalan açık için gereken Küçük Nakliye (KN) ve Büyük Nakliye (BN) sayısını anında hesaplar.
- **Akıllı Filo Gönderimi (Space Desteği):** Sepetteki eksik kaynakları ve hedef koordinatları otomatik yükler, 2. adıma geçer ve tek tuşla (`Space`) yola çıkarır.

---

#### 2. 📦 Maden Toplayıcı Asistanı (Resource Collector)

<p align="center">
  <img src="screenshots/tab_collector.png" width="380" alt="LuckyStrike Maden Toplayıcı">
</p>

- **İmparatorluk Çapında Pratik Toplama:** Seçilen tüm gezegen ve aylardan belirlenen merkez noktaya (gezegen, ay veya manuel koordinat) madenleri sıra sıra toplar.
- **Güvenli Rezerv Koruma:** Her gezegen için harcanmayacak minimum Deuterium rezervi tanımlanabilir.
- **Akıllı Filo & Görev Seçimi:** Büyük Nakliye (BN), Küçük Nakliye (KN) ve Rehber gemi dağılımı otomatik yapılır; **Nakliye** veya **Konuşlandır** görevi belirlenebilir.
- **Yüzen Bilgi Paneli & Tek Tuşla Gönderim:** Ekranın üstünde çıkan bilgi panelinden rota, taşınan madenler izlenebilir; `Space` tuşu ile sıra sıra filolar güvenle gönderilebilir.
- **Hata Toleransı (Tekrarla Butonu):** Bağlantı gecikmesi veya sayfa yükleme aksaklıklarında sırayı bozmadan adımı yeniden deneme imkanı.

---

#### 3. 🛰️ Harabe Alanı Takipçisi (Debris Tracker)

<p align="center">
  <img src="screenshots/tab_debris.png" width="380" alt="LuckyStrike Harabe Takipçisi">
</p>

- **Sadece Galakside Gezinirken Okur:** Oyuncu galaksi sayfasında gezinirken, ekranda o an görüntülenen harabeleri listeye derler ve gözden kaçmasını önler.
- 16. Slot (Sonsuz Uzaklar / Keşif Harabesi) bilgilerini listeye dahil eder.
- Oyuncunun belirlediği eşiğin üzerindeki harabeler için sesli uyarı imkanı sunar.
- Toplam kaynağa göre gereken Geri Dönüşümcü (GD) sayısını ekranda hesaplayarak gösterir.

---

#### 4. 🧭 Keşif Asistanı (Expedition Assistant)

<p align="center">
  <img src="screenshots/tab_expedition.png" width="380" alt="LuckyStrike Keşif Asistanı">
</p>

- **Spiral Keşif Rotası:** Belirlenen başlangıç sisteminden başlayarak yakından uzağa doğru spiral (+1, -1, +2, -2...) olarak 16. slotlara otomatik rota oluşturur.
- **Dinamik Şablon Entegrasyonu:** OGame Filo 1 sayfasındaki "Keşif filosu" şablonlarını otomatik algılar ve doğrudan uygular.
- **Sürat ve Süre Kontrolü:** İstenen filo hızı (%10-%100) ve bekleme süresi (1-5 saat) otomatik ayarlanır.
- **Yüzen Bilgi Paneli & Tek Tuşla Gönderim (Space):** Filoyu 2. adıma hazırlar, `Space` tuşu veya gönder butonu ile sırayla tüm seferleri kesintisiz yola çıkarır.

---

#### 5. 🌌 Galaxy Scanner (Boş Slot & Sistem Arayıcı)

<p align="center">
  <img src="screenshots/tab_scanner.png" width="380" alt="LuckyStrike Galaxy Scanner">
</p>

- Resmi Gameforge evren verisini kullanarak boş slotları ve grupça ışınlanma yapılabilecek uygun güneş sistemlerini listeler.
- Hedef slot filtreleme (Slot 8, 7-8-9, Deut slotları vb.) ile arama kolaylığı sağlar.
- Sonuçların yanındaki buton ile doğrudan galaksi sayfasına pratik yönlendirme sunar.

---

#### 6. 🔍 Player Finder (Oyuncu & Gezegen Arama)

<p align="center">
  <img src="screenshots/tab_finder.png" width="380" alt="LuckyStrike Player Finder">
</p>

- Resmi API üzerinden oyuncuların kolonilerini veya aradığınız gezegen adlarının koordinatlarını listeler.
- İttifak ve oyuncu koordinatlarını harita üzerinde kolayca takip etmeye yardımcı olur.

---

#### 7. 🚨 Saldırı & Sonda Bildirim Desteği (Threat Alert)

<p align="center">
  <img src="screenshots/tab_alarm.png" width="380" alt="LuckyStrike Tehdit Bildirimi">
</p>

- **Yalnızca Oyun Açıkken ve Ekran Güncellendiğinde:** Sayfa yenilendiğinde veya OGame'in kendi üst barındaki etkinlik kutusu güncellendiğinde ekrandaki durumu okur.
- Oyuncunun açık olan sekmesinde gözden kaçırmaması için dahili sesli ve masaüstü bildirim kolaylığı sunar.

---

## 🇬🇧 English Description

**LuckyStrike OGame Helper** is an advanced browser assistant (**Chrome / Edge Extension - Manifest V3**) designed for OGame players to assist with daily empire management, resource planning, cargo calculation, and information tracking while strictly following **Gameforge Fair-Play Rules**.

### 🛡️ Gameforge & OGame Rules Compliance
LuckyStrike OGame Helper is engineered with strict adherence to **Gameforge Terms & Conditions (Rule 5: Automation & Bot Policy)**:
- **Active Player Only & Passive Reading:** The extension never sends automated background requests. It only reads screen data when the player is actively playing, navigating pages, or when browser tabs update.
- **Strictly Non-Automated:** No automated background fleet dispatches or bot cycles. Autofill helpers populate inputs upon **explicit player click**; the final command, confirmation, and launch decisions always remain in the player's hands.
- **Official Gameforge Public APIs:** Galaxy and player analysis modules utilize official public XML APIs (`/api/universe.xml`, `/api/players.xml`) provided for tool developers.
- **Client-Side & Privacy-First:** No personal data or credentials are ever collected or transmitted. All preferences remain strictly in your local browser storage.

---

### 🌟 Gameplay Convenience Features

#### 1. 🏗️ Resource Cost Cart & Multi-Level Calculation
- Multi-level selector directly in technology detail popups.
- Full support for all buildings, researches, and Lifeform structures across all 4 races.
- Deduct currently stored resources to calculate exact deficits.
- Computes Small Cargo (KN) and Large Cargo (BN) requirements dynamically.
- Modernized fleet auto-load with Step 2 navigation and `Space` key dispatch.

#### 2. 📦 Resource Collector Assistant
- Gather resources across empire planets/moons to a designated target (planet, moon, or manual coordinates).
- Reserve deuterium protection for each colony.
- Multi-ship support (Large Cargo, Small Cargo, Pathfinder) and mission selection (Transport / Deploy).
- Floating HUD banner with fleet summary and single-stroke `Space` sending.
- Step retry button for handling slow network or page loads without disrupting queue order.

#### 3. 🛰️ Debris Field Tracker
- **Active Navigation Only:** Organizes and lists debris fields visible on screen as the player browses galaxy pages.
- Includes Slot 16 (Expedition / Endless Expanse) debris info.
- Optional audio notification for debris fields above user-selected thresholds.
- Calculates required Recyclers on screen.

#### 4. 🧭 Expedition Assistant
- **Spiral Expedition Routing:** Automatically distributes expedition missions to slot 16 across systems expanding outward in a spiral pattern (+1, -1, +2, -2...).
- **Dynamic Template Detection:** Detects and applies expedition fleet templates directly from the game's native fleet dispatch.
- **Speed & Holding Time Control:** Automatically applies customized speed percentage and expedition holding duration.
- **Step-by-Step Floating Banner:** Previews route and allows seamless progression with the `Space` key.

#### 5. 🌌 Galaxy Scanner (Empty Slot Locator)
- Analyzes official universe data to find empty slots or suitable systems for colonization/relocation.
- Target slot filters (Slot 8, 7-8-9, etc.) for streamlined search.

#### 6. 🔍 Player Finder (Colony Locator)
- Displays player colony lists and coordinates via official public APIs.

#### 7. 🚨 In-Game Threat Alert Assistant
- **Active Screen Updates Only:** Reads threat status when pages are loaded or when the game's native event header updates.
- Provides optional audio and desktop notifications to prevent missing incoming activity while playing.

---

## 🚀 Kurulum / Installation

### Chrome & Microsoft Edge
1. İndirin / Download: [`luckystrike-ogame-helper-v10.4.zip`](https://github.com/kadirersoy/luckystrike-ogame-helper/releases/latest)
2. Tarayıcıda eklentiler sayfasına gidin / Open extensions page:
   - **Chrome:** `chrome://extensions`
   - **Edge:** `edge://extensions`
3. **"Geliştirici Modu" (Developer Mode)** seçeneğini açın.
4. ZIP'ten çıkardığınız klasörü **"Paketlenmemiş öğe yükle" (Load unpacked)** butonuyla seçin.

---

## 📝 Sürüm Geçmişi / Changelog

### v10.5
- **🌌 Galaxy Scanner Akıllı Önbellek (Cache) & Sıfır Sunucu Yükü:**
  - `universe.xml` dosyasının her taramada tekrar indirilmesi engellendi; 24 saat geçerli istemci taraflı önbellek mimarisi entegre edildi. Taramalar artık sunucuya 0 ağ isteği atarak ~50 ms içinde yerel hafızadan anında sonuç verir.
  - **İkili Buton Mimarisi:** `🔍 Taramayı Başlat` (Önbellekten hızlı tarama) ve `🔄 Güncelle` (Sunucudan zorla taze veri çekme).
  - **60 Saniye Güvenlik Kilidi (Cooldown):** `🔄 Güncelle` butonuna 60 saniyelik geri sayım sayacı (`⏳ 59s` ... `⏳ 1s`) ve kilit mekanizması eklendi; Gameforge API'sinin yanlışlıkla spamlanması teknik olarak engellendi.
  - **Önbellek Yaşı Göstergesi:** Son güncelleme saati ve toplam kayıtlı gezegen sayısı durum çubuğunda canlı olarak gösterilir.
- **🛡️ Ses Motoru (AudioContext) & Autoplay Koruma Güvencesi:**
  - Chrome Autoplay politikası nedeniyle `AudioContext.resume()` çağrılarında oluşan konsol promise reddi hataları koruma altına alındı.
- **📋 Güvenli Pano Kopyalama (Clipboard Safe Fallback):**
  - Tarayıcı pencere odağı kaybolduğunda ortaya çıkan `Document is not focused` hatalarına karşı görünmez textarea geri çekilme mekanizması (`copyTextSafe`) eklendi.

### v10.4
- **🧭 Keşif Asistanı Sadeleştirmesi & Doğal Şablon Desteği:**
  - Keşif arayüzündeki manuel Keşif Saati ve Sürat (Hız) kontrolleri kaldırıldı.
  - OGame filo şablonlarının kayıtlı hız ve keşif süresi ayarlarını doğal (native) olarak koruması sağlandı.
  - Sayfadaki gemi kartlarına veya hız çubuklarına hatalı metin ("1 s") yazılmasına neden olan DOM müdahaleleri tamamen temizlendi.
  - Step 2 hazırlık ve kontrol akışı optimize edilerek bekleme süresi minimuma indirildi.
- **🔄 Keşif Adım Tekrarlama İyileştirmesi:**
  - Keşif Asistanı yüzen banner'ındaki `🔄 Tekrarla` butonu, takılma durumlarında mevcut adımı sıfırdan ve pürüzsüzce yeniden başlatacak şekilde güçlendirildi.

### v10.3
- **🧭 Keşif Şablon Algılama & Boşluk Yönetimi:**
  - Filo 1 sayfasındaki şablon isimlerinin boş veya tanımsız görünmesi engellendi.
  - Şablon algılama ve kayıt mekanizması iyileştirildi.

### v10.2
- **🎛️ 3 Satırlı Gelişmiş Multi-Filtre (AND Mantığı):**
  - **1. Satır (Akış):** `Tümü`, `🐞 Debug Logs`, `🎯 Trace Logs`
  - **2. Satır (Kapsam):** `Tümü`, `📤 Giden İstekler`, `📥 Gelen Yanıtlar` (AJAX istekleri ile gelen yanıtlar bağımsız olarak filtrelenebilir).
  - **3. Satır (Seviye):** `Tümü`, `ℹ️ Info`, `⚠️ Warning`, `❌ Error`
- **💾 Logları Çıkar (.txt Dışa Aktarma):** Ekranda filtrelenmiş logları doğrudan `LuckyStrike_logs_YYYY-MM-DD_HH-mm-ss.txt` olarak masaüstüne kaydeden dosya kaydetme diyaloğu eklendi.
- **🧹 Filtreye Duyarlı Kopyalama ve Temizleme:**
  - `📋 Logları Kopyala`: Yalnızca seçili filtrelere uyan logları panoya kopyalar.
  - `🗑️ Logları Temizle`: Filtrelenen logları seçici olarak temizler (Tümü seçiliyse tüm hafızayı sıfırlar).
- **✨ Temiz Trace Formatı:** Trace loglarındaki çift `[TRACE]` tekrarı kaldırıldı (`[TRACE] [HH:mm:ss.ms] [ACTION] [KLİK] ...`).
- **📱 Optimize Edilmiş Kart Başlıkları:** Üst kart açıklamaları buton altına taşmayacak şekilde `Uygulama logları` ve `İzleme kayıtları` olarak sadeleştirildi.

### v10.1
- **🎯 Trace Logs (Kullanıcı Eylem & Oyun Yanıt Takibi):** Kullanıcının nereye geçtiğini, neye tıkladığını (gemi, buton, menü, gezegen), basılan tuşları (Space, Enter), form değişikliklerini ve OGame'den dönen tüm bildirim ve sunucu yanıtlarını anbean kaydeden kullanıcı akış takipçisi eklendi.
- **🐞 Debug Logs & Trace Logs Ayrımı:**
  - Sadece **Debug Logs** açıkken: Yalnızca uyarı ve hata kayıtları listelenir (sessiz mod).
  - Sadece **Trace Logs** açıkken: Yalnızca kullanıcının bastığı tuşlar, tıkladığı öğeler, sayfa geçişleri ve oyun yanıtları listelenir.
  - **İkisi de açıkken:** Tüm sistem logları ve kullanıcı akışı birleşik olarak gösterilir.
- **🏷️ Çoklu Seçim (Multi-Select) Filtreleme:** Filtre butonları çoklu seçime uyarlandı (örneğin `🧭 Keşif` + `⚠️ Hatalar` seçildiğinde yalnızca Keşif modülündeki hatalar listelenir).
- **🔴 Canlı Trace Rozeti:** Trace Logs etkinken ekranın sağ üst köşesinde kaydedilen eylem sayısını gösteren şık bir rozet görüntülenir.
- **📋 Ayrı ve Biçimlendirilmiş Kopyalama:** `📋 Logları Kopyala` ve `🎯 Trace Kopyala` butonlarıyla her iki veri akışı panoya tek tıkla aktarılabilir.

### v10.0
- **🐞 Canlı Debug & Hata Teşhis Sekmesi (Debug Tab):** Tüm sekmelerdeki eylemleri (Keşif, Toplayıcı, Sepet, Harabe, Scanner, Finder, Alarm, Bridge ve OGame sunucu/AJAX isteklerini) anbean kaydeden gelişmiş teşhis modülü eklendi.
- **⚡ Sıfır Performans Etkisi (Default Kapalı):** Varsayılan olarak kapalıdır; açıldığında sistem adımlarını, gönderilen emirleri ve sunucu yanıtlarını milisaniyelik zaman damgasıyla listeler.
- **💾 Sayfalar Arası Oturum Hafızası (`sessionStorage`):** Gezegenler veya sistemler arası geçişlerde sayfa yenilense bile loglar silinmez, oturum boyunca geçmiş adımlar korunur.
- **📋 Tek Tıkla Kopyalama & Filtreleme:** Tek butonla tüm logları panoya biçimlendirilmiş metin olarak kopyalama, kategorilere göre (Keşif, Toplayıcı, Sunucu/Ajax, Bridge, Hatalar) anında filtreleme desteği.

### v9.0
- **🧭 Keşif Asistanı (Expedition Assistant):** Spiral rota algoritması (+1, -1, +2, -2...) ile 16. slotlara otomatik rota dağıtımı, Filo 1 sayfasındaki kayıtlı keşif şablonlarını otomatik algılama ve uygulama, hız (%10-%100) ve bekleme süresi (1-5 saat) kontrolleri, yüzen HUD bilgi banner'ı ve `Space` tuşu ile adım adım güvenli filo gönderimi.
- **🌌 Galaxy Scanner İyileştirmeleri:** Hedef slot hızlı filtreleri güncellendi (`⭐ 7, 9`, `❄️ 13-15 (Deut)`). Minimum eşzamanlı boş slot seçim listesi 1'den 15'e kadar tüm slotları (11, 13, 14 dahil) kapsayacak şekilde tamamlandı.
- **⚡ Performans ve Stabilizasyon:** Filo 2 menüsünde hedef doğrulama, keşif saati kilitlenmesi ve hız ayarlarının stabilizasyonu sağlandı.

### v8.0
- **📦 Maden Toplayıcı Asistanı (Resource Collector):** Tüm imparatorluk kolonilerinden (gezegen veya ay) tek bir hedef noktaya pratik maden toplama asistanı eklendi. Gezegen listesi, rezerv koruma, BN / KN / Rehber gemi dağılımı, Nakliye / Konuşlandır görev seçenekleri ve manuel hedef koordinat desteği.
- **⌨️ Tek Tuşla Filo Gönderimi (Space Tuşu) & Yüzen Bilgi Paneli:** Toplayıcı ve Maliyet sepetinde rota, yüklenen kaynaklar ve filo detaylarını üst yüzen banner'da göstererek Space tuşuyla tek hamlede güvenli filo gönderimi sağlandı.
- **🔄 Adım Tekrarlama (Retry) & Bağlantı Hata Koruması:** Sayfa veya bağlantı gecikmelerinde sırayı bozmadan adımı sıfırdan yeniden deneme butonu eklendi.
- **🏗️ Maliyet Sepeti Filo Entegrasyonu Yenilendi:** Eksik bina/araştırma maliyetleri için gemi seçimi, 2. adıma otomatik geçiş ve ambar doldurma akışı modernize edildi.
- **📑 Optimize Sekme Dizilimi:** Sekmeler kullanım ergonomisine göre yeniden dizildi: *Maliyet, Collector, Harabe, Scanner, Finder, Alarm*.

### v7.1
- **🛡️ Oyun Kurallarına Tam Uyum:** Arka plan ağ istekleri kaldırılarak yalnızca oyuncunun sekme ve sayfa yenileme anlarında çalışan pasif mimariye geçildi.
- **🎨 Yeni Metalik OGame Logosu:** Karanlık uzay teması ve metalik gümüş OGame tipografisi.
- **🌐 Çift Dil (TR/EN) & Oynanış Kolaylığı Rehberi:** Modüller ayrıştırıldı, oynanış kolaylaştırıcı amaçlar netleştirildi.

### v7.0
- **Dinamik Gemi Kapasiteleri:** Hiperuzay Tekniği bonusları otomatik hesaba katıldı.
- **Akıllı 3'lü Filo Yükleme Butonu:** Otomatik, KN ve BN seçimli form doldurma desteği.
- **Net Kaynak Dengeleme:** Pozitif maliyetler ve negatif mevcut kaynaklar ayrı ayrı analiz edildi.
