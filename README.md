# ⚡ LuckyStrike OGame Helper (v14.4)

[English](#-english-description) | [Türkçe](#-türkçe-açıklama)

---

## 🇹🇷 Türkçe Açıklama

**LuckyStrike OGame Helper**, OGame oyuncuları için günlük imparatorluk yönetimini, hammadde planlamasını, filo nakliye hesaplamalarını ve bilgi takibini kolaylaştırmak üzere tasarlanmış, **Gameforge oyun kurallarına tam uyumlu** bir kullanıcı arayüzü asistanıdır (**Chrome / Edge Extension - Manifest V3**).

### 🛡️ Gameforge & OGame Oyun Kurallarına Uyumluluk
LuckyStrike OGame Helper, **Gameforge Kullanım Şartları ve Oyun Kuralları (Kural 5: Otomasyon ve Bot Politikası)** titizlikle gözetilerek geliştirilmiştir:
- **Sadece Oyuncu Başındayken ve Pasif Çalışır:** Eklenti kendi kendine sunucuya arka planda otomatik istek atmaz. Bilgi takibi ve güncellemeler, yalnızca **oyuncu bilgisayar başındayken**, sayfalar arasında gezinirken veya tarayıcı sekmesi güncellendiğinde ekrana gelen verileri okur.
- **Otomasyon / Bot İçermez:** Filoları arka planda gizlice göndermez, bina veya araştırma emri vermez. Kaynak doldurma ve filo hazırlama gibi kolaylaştırıcı işlemler yalnızca **oyuncunun bizzat butona tıklamasıyla** form alanlarına yazılır; son onay, gönderme (`Space` veya butona tıklama) ve karar kontrolü tamamen oyuncuya aittir.
- **Resmi Gameforge API Altyapısı:** Evren analizi ve oyuncu arama modülleri, Gameforge'un eklenti ve araç geliştiricileri için kamuya açık olarak sağladığı resmi XML API altyapısını (`/api/universe.xml`, `/api/players.xml`) 24 saatlik istemci önbelleği ve spam koruma kilidiyle kullanır.
- **İstemci Taraflı ve Gizlilik Odaklı:** Hiçbir kullanıcı verisi, şifresi veya oyun bilgisi harici sunuculara aktarılmaz; tüm tercihler yalnızca yerel tarayıcı belleğinizde saklanır.

---

### 🌟 Oynanışı Kolaylaştıran Modüller & 9 Sekme

#### 1. 🏗️ Maliyet Sepeti & Çoklu Kademe Hesabı

<p align="center">
  <img src="screenshots/tab_cart.png" width="380" alt="LuckyStrike Maliyet Sepeti">
</p>

- **Çoklu Kademe Seçimi:** Bina veya araştırma detayına tıklandığında `[ − ] [ +N ] [ + ]` seçimi ve tek tıkla sepete ekleme.
- **Resmi Gameforge LFMaster Tablosu:** 4 ırkın (Rock'tal, İnsan, Mecha, Kaelesh) 48 binası ve 72 araştırması dahil tüm kademelerin hammadde maliyetlerini eksiksiz doğrulukla hesaplar.
- **Mevcut Kaynağı Düş:** Gezegende bulunan anlık hammadde stoklarını sepetten düşerek net açığı gösterir.
- **Nakliye Filosu İhtiyacı:** Kalan açık için gereken Küçük Nakliye (KN) ve Büyük Nakliye (BN) sayısını anında hesaplar.
- **Çoklu Gezegen Gruplama & Tek Tuşla Dağıtım (`Space`):** Farklı gezegenlerdeki bina ve araştırmaları tek listede toplar; eksik kaynakları ve hedef koordinatları otomatik yükleyerek `Space` tuşu ile sıra sıra güvenle yola çıkarır.

---

#### 2. 📦 Maden Toplayıcı Asistanı (Resource Collector)

<p align="center">
  <img src="screenshots/tab_collector.png" width="380" alt="LuckyStrike Maden Toplayıcı">
</p>

- **İmparatorluk Çapında Pratik Toplama:** Seçilen tüm gezegen ve aylardan belirlenen merkez noktaya (gezegen, ay veya manuel koordinat) madenleri sıra sıra toplar.
- **Hızlı Üs Seçimi & "Burası" Butonu:** Toplama hedefi açılır listesinden (combobox) istenen üs seçilebilir veya `Burası` butonuna tıklanarak bulunulan gezegen/ay tek tıkla hedef atanabilir.
- **Güvenli Deuterium Rezervi:** Her gezegen için harcanmayacak minimum Deuterium koruma rezervi tanımlanabilir.
- **Akıllı Filo & Görev Seçimi:** Büyük Nakliye (BN), Küçük Nakliye (KN) ve Rehber gemi dağılımı otomatik yapılır; **Nakliye** veya **Konuşlandır** görevi seçilebilir.
- **Yüzen Bilgi Paneli & Space Desteği:** Ekranın üstünde çıkan bilgi panelinden rota ve taşınan madenler anlık izlenir; `Space` tuşu ile sıra sıra filolar güvenle gönderilir. Bağlantı gecikmelerinde `🔄 Tekrarla` butonuyla adımı sırayı bozmadan yeniden deneme imkanı sunar.

---

#### 3. 📬 Postacı Asistanı (Resource Courier)

<p align="center">
  <img src="screenshots/tab_courier.png" width="380" alt="LuckyStrike Postacı Asistanı">
</p>

- **Merkezi Dağıtım Modeli:** Maden Toplayıcı'nın ters yönlü simetriği olarak çalışır; tek bir çıkış üssünden (Dağıtım Üssü) seçilen hedef gezegen ve aylara maden sevkiyatı yapar.
- **Açılır Liste (Combobox) & "Burası" Desteği:** Dağıtım üssü kutusuna tıklanarak imparatorluktaki herhangi bir Gezegen veya Ay listeden seçilebilir ya da `Burası` butonuyla bulunulan üs anında merkez yapılabilir.
- **Genel Dağıtım Senkronizasyonu (`⚡ Eşitle`):** Üst alanda girilen Metal, Kristal ve Deuterium tutarlarını tek tıkla tüm seçili hedeflere otomatik uygular.
- **Hedefe Özel Bağımsız Giriş:** Her koloninin yanındaki 3 kutudan (M / K / D) bağımsız tutarlar girilebilir; `1m`, `500k`, `2.5m` gibi sayı kısaltmaları desteklenir.
- **Canlı Stok & Kargo Doğrulaması:** Dağıtım üssündeki hammadde varlığı ve seçilen kargo gemilerinin kapasitesi anlık taranarak stok yetersizliğinde uyarı verir.
- **Otomatik Uncheck & Sıralı Space Gönderimi:** Filosu yola çıkan her hedef otomatik olarak listeden kaldırılır (`uncheck`); mükerrer gönderim riski olmadan `Space` tuşuyla sıralı dağıtım yapılır.

---

#### 4. 🛰️ Harabe Alanı Takipçisi (Debris Tracker)

<p align="center">
  <img src="screenshots/tab_debris.png" width="380" alt="LuckyStrike Harabe Takipçisi">
</p>

- **Galakside Gezinirken Pasif Okuma:** Oyuncu galaksi sayfasında gezinirken, ekranda o an görüntülenen harabeleri listeye derler ve gözden kaçmasını önler.
- **16. Slot Harabeleri:** Keşif harabelerini (Sonsuz Uzaklar) listeye otomatik dahil eder.
- **Sesli Bildirim ve Eşik Ayarı:** Belirlenen kaynak eşiğinin (örn: 100K, 250K, 1M, 5M) üzerindeki harabeler için sesli uyarı imkanı sunar.
- **Geri Dönüşümcü (GD) Hesabı:** Toplam hammaddeye göre gereken GD sayısını ekranda hesaplayarak roket simgeli butonla galaksiye pratik yönlendirme sağlar.

---

#### 5. 🧭 Keşif Asistanı (Expedition Assistant)

<p align="center">
  <img src="screenshots/tab_expedition.png" width="380" alt="LuckyStrike Keşif Asistanı">
</p>

- **Spiral Keşif Algoritması:** Belirlenen başlangıç sisteminden başlayarak yakından uzağa doğru spiral (+1, -1, +2, -2...) olarak 16. slotlara rota oluşturur.
- **Doğal Şablon Entegrasyonu:** OGame Filo 1 sayfasındaki "Keşif filosu" şablonlarını otomatik algılar; kayıtlı gemi bileşimi ve filo hızlarını koruyarak doğrudan uygular.
- **Rota Dağılım Önizlemesi:** Kaçıncı seferin hangi sisteme gideceğini renkli rota haritasıyla panelde gösterir.
- **Yüzen Bilgi Paneli & Adım Adım Space Desteği:** Filoyu hazırlar, `Space` tuşu ile sırayla tüm seferleri kesintisiz yola çıkarır; takılmalarda `🔄 Tekrarla` ile adımı yeniler.

---

#### 6. 🌌 Galaxy Scanner (Boş Slot & Sistem Arayıcı)

<p align="center">
  <img src="screenshots/tab_scanner.png" width="380" alt="LuckyStrike Galaxy Scanner">
</p>

- **Resmi Gameforge API Verisi:** Kamuya açık `universe.xml` verisini kullanarak boş slotları ve grupça ışınlanmaya uygun sistemleri listeler.
- **Sıfır Sunucu Yükü & Akıllı Önbellek:** 24 saat geçerli istemci önbelleği sayesinde taramalar ~50 ms içinde yerel hafızadan tamamlanır.
- **60 Saniye Güvenlik Kilidi:** API spamını önlemek için `🔄 Güncelle` butonunda senkronize geri sayım sayacı çalışır.
- **Hedef Slot Filtreleri:** Sadece 8 (Maksimum Metal), 7-9, 13-15 (Deuterium), 1-3 (Güneş) veya Tamamen Boş (1-15) gibi hızlı çipler sunar.

---

#### 7. 🔍 Player Finder (Oyuncu & Gezegen Arama)

<p align="center">
  <img src="screenshots/tab_finder.png" width="380" alt="LuckyStrike Player Finder">
</p>

- **Oyuncu ve Koloni Konumları:** Resmi `players.xml` ve `universe.xml` API'si üzerinden oyuncu adı veya gezegen adına göre anında arama yapar.
- **İttifak ve Sıralama Bilgisi:** Oyuncunun ittifak etiketini, sıralamasını ve tüm gezegen/ay koordinatlarını düzenli bir kart halinde listeler.
- **Ortak Önbellek Senkronizasyonu:** Galaxy Scanner ile ortak önbellek altyapısını kullanır; tek bir güncelleme ile tüm evren verisi güncel kalır.

---

#### 8. 🚨 Tehdit Bildirimi & Alarm (Active Threat Alert)

<p align="center">
  <img src="screenshots/tab_alarm.png" width="380" alt="LuckyStrike Tehdit Bildirimi">
</p>

- **Aktif Oyun Oturumunda Ekrana Duyarlı:** Oyuncu oyunu oynarken, sayfa yenilendiğinde veya OGame'in üst etkinlik çubuğu güncellendiğinde ekrandaki kırmızı/mavi tehdit durumunu okur.
- **Özelleştirilebilir Saldırı Sesleri:** Taktiksel Klakson, Kırmızı Alarm Sireni veya Acil Durum Nabzı arasından ses seçimi.
- **Casusluk / Sonda Sesleri:** Derin Deniz Sonarı (Klasik Ping), Aktif Avcı Sonarı (Yüksek Ping) veya Taktik Yankı Sonarı.
- **Ses Seviyesi & Tekrar Sıklığı:** %0-%100 ses kaydırıcısı ve tek seferlik, 5s, 10s, 15s, 30s, 60s periyot seçenekleri.
- **Tek Tıkla Sustur Butonu:** Başlık çubuğunda ve sekme içinde çalan alarmı anında susturma butonu (`⏹️ Sustur`).

---

#### 9. ⚙️ Ayarlar, Özelleştirme & Sistem Teşhis Günlükleri

<p align="center">
  <img src="screenshots/tab_settings.png" width="380" alt="LuckyStrike Ayarlar ve Teşhis">
</p>

- **🌐 Dil Seçimi (Language):** TR (Türkçe) ve ENG (English) seçenekleri.
- **🎨 Görünüm / Tema:** Uzay Karanlığı (Dark Space) karanlık tema tasarımı.
- **👁️ Ayarlanabilir Saydamlık (Opacity Slider):** %20 ile %100 arasında panel şeffaflığı belirleme imkanı.
- **🎯 Fare Focus Özelliği (Hover to Focus):** Panel saydamken fare üzerine geldiğinde otomatik %100 görünürlük, fare çekildiğinde eski şeffaflığa yumuşak dönüş.
- **🛠️ Gelişmiş Sistem & Teşhis Günlükleri (Debug & Trace Logs):**
  - **3 Satırlı Gelişmiş Multi-Filtre (AND Mantığı):** Akış (Tümü, Debug, Trace), Kapsam (Giden İstekler, Gelen Yanıtlar), Seviye (Info, Warning, Error).
  - **Logları Çıkar (.txt):** Zaman damgalı metin dosyası olarak masaüstüne indirme diyaloğu.
  - **Filtreye Duyarlı Kopyalama ve Temizleme:** Sadece seçili kriterlere uyan kayıtları panoya kopyalama veya temizleme.

---

### ⏱️ Sekmeler İçin 3 Saniye Kullanım Rehberi (Hover Tooltips)
Panel üzerindeki 9 sekmenin (`Maliyet`, `Toplayıcı`, `Postacı`, `Harabe`, `Keşif`, `Tarayıcı`, `Arama`, `Alarm`, `Ayarlar`) üzerine fare ile gelinip **3 saniye** beklendiğinde, o sekmenin ne işe yaradığını ve nasıl kullanılacağını anlatan Türkçe/İngilizce ipucu kutusu (tooltip) belirir; fare çekildiğinde otomatik kaybolur.

---

### ⌨️ Tek Tuşla Filo Gönderimi (`Space` Tuşu Akışı)
LuckyStrike, filo hazırlığı gerektiren tüm ana modüllerde (**Maliyet Sepeti**, **Maden Toplayıcı**, **Postacı Asistanı** ve **Keşif Asistanı**) standartlaştırılmış bir yüzen HUD banner'ı kullanır:
1. Gerekli kargo gemilerini, hammadde tutarlarını ve hedef koordinatları otomatik olarak forma yazar.
2. Formu Filo 2 (onay) ekranına taşır.
3. Ekranın üstünde çıkan parlak bilgi panelinde rota ve maden bilgisi özetlenir.
4. Oyuncu yalnızca klavyedeki **`Space` (Boşluk)** tuşuna basarak (veya butona tıklayarak) filoyu güvenle yola çıkarır.

---

## 🇬🇧 English Description

**LuckyStrike OGame Helper** is an advanced browser assistant (**Chrome / Edge Extension - Manifest V3**) designed for OGame players to assist with daily empire management, resource planning, cargo calculation, and information tracking while strictly complying with **Gameforge Fair-Play Rules**.

### 🛡️ Gameforge & OGame Rules Compliance
LuckyStrike OGame Helper is engineered with strict adherence to **Gameforge Terms & Conditions (Rule 5: Automation & Bot Policy)**:
- **Active Player Only & Passive Reading:** The extension never sends automated background requests. It only reads screen data when the player is actively playing, navigating pages, or when browser tabs update.
- **Strictly Non-Automated:** No automated background fleet dispatches, building orders, or bot cycles. Autofill helpers populate inputs upon **explicit player click**; the final command, confirmation, and launch decisions (`Space` key or button click) always remain entirely in the player's hands.
- **Official Gameforge Public APIs:** Galaxy and player analysis modules utilize official public XML APIs (`/api/universe.xml`, `/api/players.xml`) provided for tool developers, equipped with a 24-hour client cache and cooldown lock.
- **Client-Side & Privacy-First:** No personal data, passwords, or game credentials are ever collected or transmitted. All preferences remain strictly in your local browser storage.

---

### 🌟 Gameplay Convenience Features & 9 Tabs

#### 1. 🏗️ Resource Cost Cart & Multi-Level Calculation

<p align="center">
  <img src="screenshots/en/tab_cart.png" width="380" alt="LuckyStrike Cost Cart">
</p>

- **Multi-Level Selection:** Quick level adjustments (`[ − ] [ +N ] [ + ]`) directly within building and research detail popups.
- **Official Gameforge LFMaster Table:** Accurately calculates resource costs for all structures, researches, and Lifeform buildings (48 buildings, 72 researches across all 4 races).
- **Deduct Live Resources:** Subtracts live resources stored on the current planet/moon to display the exact deficit.
- **Cargo Ship Requirements:** Instantly calculates required Small Cargo (KN) and Large Cargo (BN) counts.
- **Multi-Planet Grouping & Spacebar Dispatch:** Combines items across different colonies in a single view; autofills ships, resources, and coordinates with seamless `Space` key dispatch.

---

#### 2. 📦 Resource Collector Assistant

<p align="center">
  <img src="screenshots/en/tab_collector.png" width="380" alt="LuckyStrike Resource Collector">
</p>

- **Empire-Wide Collection:** Sequentially gathers resources from all selected planets and moons to a designated central base (planet, moon, or manual coordinate).
- **Quick Target Selection & "Here" Button:** Choose target base from the combobox dropdown or click `Here` to instantly set the active colony as target.
- **Protected Deuterium Reserves:** Configure custom minimum deuterium reserves per colony to preserve fleet flight fuel.
- **Smart Ship & Mission Selection:** Distributes Large Cargo, Small Cargo, and Pathfinders automatically; supports both **Transport** and **Deploy** missions.
- **Floating HUD & Spacebar Dispatch:** Real-time route and cargo status displayed on a top banner; send fleets step-by-step with `Space`. Includes a `🔄 Retry` button to reattempt steps during connection hiccups without breaking queue order.

---

#### 3. 📬 Resource Courier Assistant

<p align="center">
  <img src="screenshots/en/tab_courier.png" width="380" alt="LuckyStrike Resource Courier">
</p>

- **Central Distribution Model:** Operates as the reverse of the Collector; dispatches resources from a single origin base (Distribution Hub) outward to selected colonies.
- **Combobox Dropdown & "Here" Support:** Set the origin base via the interactive dropdown or click `Here` to assign the current planet or moon.
- **Global Amount Sync (`⚡ Sync`):** Input Metal, Crystal, and Deuterium amounts once and apply them across all selected targets with a single click.
- **Colony Overrides & Shorthand Formats:** Enter distinct custom amounts for any colony using compact abbreviations like `1m`, `500k`, `2.5m`.
- **Live Stock & Capacity Verification:** Inspects origin storage and selected cargo fleet capacity on the fly; warns if origin inventory is insufficient.
- **Automatic Uncheck & Sequential Spacebar Dispatch:** Each successfully dispatched destination is automatically unchecked from the list; progress seamlessly through the queue using `Space`.

---

#### 4. 🛰️ Debris Field Tracker

<p align="center">
  <img src="screenshots/en/tab_debris.png" width="380" alt="LuckyStrike Debris Tracker">
</p>

- **Passive Galaxy View Tracking:** Compiles and organizes debris fields displayed on screen as you navigate galaxy systems.
- **Slot 16 Support:** Captures expedition debris (Endless Expanse) into the active list.
- **Audio Alerts & Threshold Filter:** Set custom resource thresholds (50K, 100K, 250K, 500K, 1M, 5M) with audible alerts when valuable debris is spotted.
- **Recycler Counter:** Displays required Recycler count and provides a quick rocket button to jump to the galaxy system.

---

#### 5. 🧭 Expedition Assistant

<p align="center">
  <img src="screenshots/en/tab_expedition.png" width="380" alt="LuckyStrike Expedition Assistant">
</p>

- **Spiral Routing Algorithm:** Distributes expedition missions to slot 16 systems radiating outward (+1, -1, +2, -2...) from your chosen origin.
- **Native Template Detection:** Automatically reads native OGame Fleet 1 expedition templates, preserving your saved ship compositions and speeds.
- **Visual Route Preview:** Displays an indexed, color-coded breakdown of upcoming expedition targets.
- **Floating HUD & Spacebar Dispatch:** Prepares Fleet 2 and advances through missions sequentially with `Space`; retry stuck steps with `🔄 Retry`.

---

#### 6. 🌌 Galaxy Scanner (Empty Slot Locator)

<p align="center">
  <img src="screenshots/en/tab_scanner.png" width="380" alt="LuckyStrike Galaxy Scanner">
</p>

- **Official Gameforge API:** Leverages public `universe.xml` data to locate vacant slots and clusters of systems suitable for colonization or relocation.
- **Zero Server Overhead & 24h Cache:** Queries complete in ~50 ms from local client storage without generating repeated network requests.
- **60-Second Cooldown Lock:** Prevents accidental API flooding with synchronized countdown timers on refresh actions.
- **Target Slot Chips:** Quick filters for Slot 8 (Max Metal), 7-9, 13-15 (Deuterium), 1-3 (Solar), or Fully Vacant Systems (1-15).

---

#### 7. 🔍 Player Finder (Colony Locator)

<p align="center">
  <img src="screenshots/en/tab_finder.png" width="380" alt="LuckyStrike Player Finder">
</p>

- **Player & Planet Coordinate Search:** Searches player names and colony names via official `players.xml` and `universe.xml` APIs.
- **Alliance & Ranking Overview:** Displays player alliance tags, rank positions, and complete coordinate lists in a clean card layout.
- **Shared Cache Synchronization:** Seamlessly shares cache data with the Galaxy Scanner, keeping data fresh without redundant downloads.

---

#### 8. 🚨 Threat Alert Assistant (Active In-Game Alarm)

<p align="center">
  <img src="screenshots/en/tab_alarm.png" width="380" alt="LuckyStrike Threat Alert">
</p>

- **Active Session Threat Detection:** Monitors incoming attacks and espionage missions when the active page refreshes or the game's native event header updates.
- **Customizable Attack Sounds:** Tactical Klaxon, Red Alert Siren, or Emergency Pulse.
- **Espionage Sonar Sounds:** Deep Sea Sonar (Classic Ping), Hunter Sonar (High Ping), or Tactical Echo Sonar.
- **Volume & Repeat Controls:** 0-100% volume slider and repeat frequencies (Once, 5s, 10s, 15s, 30s, 60s).
- **One-Click Mute:** Immediate silence button (`⏹️ Stop`) located both on the header bar and inside the tab.

---

#### 9. ⚙️ Settings, Customization & System Diagnostics

<p align="center">
  <img src="screenshots/en/tab_settings.png" width="380" alt="LuckyStrike Settings and Diagnostics">
</p>

- **🌐 Language Selector:** Switch between TR (Türkçe) and ENG (English) instantly.
- **🎨 Skin & Theme:** Space Darkness (Dark Space) optimized theme.
- **👁️ Opacity Slider:** Fine-tune panel transparency between 20% and 100%.
- **🎯 Hover to Focus:** Automatically restores 100% opacity when hovering over the panel, smoothly returning to your transparent setting on mouse leave.
- **🛠️ Advanced System & Diagnostic Logs (Debug & Trace):**
  - **3-Row Multi-Filter (AND Logic):** Stream (All, Debug, Trace), Scope (Outbound Requests, Inbound Responses), Level (Info, Warning, Error).
  - **Export Logs (.txt):** Download timestamped diagnostic logs directly to your desktop.
  - **Filter-Aware Copy & Clear:** Copy or purge only the entries that match your currently applied filters.

---

### ⏱️ 3-Second Guidance Tooltips (Hover Tooltips)
Hovering your mouse over any of the 9 tabs (`Cart`, `Collector`, `Courier`, `Debris`, `Expedition`, `Scanner`, `Finder`, `Alarm`, `Settings`) for **3 seconds** reveals an educational tooltip explaining the purpose and usage of that module; it automatically dismisses when moving the mouse away.

---

### ⌨️ Single-Key Fleet Dispatch (`Space` Key Workflow)
LuckyStrike unifies all fleet preparation modules (**Cost Cart**, **Resource Collector**, **Resource Courier**, and **Expedition Assistant**) under a standardized floating HUD:
1. Automatically populates required cargo ships, resource quantities, and destination coordinates.
2. Advances the page to Fleet Step 2 (dispatch confirmation).
3. Displays a glowing top HUD banner summarizing the flight path and cargo payload.
4. The player confirms and dispatches the fleet simply by pressing **`Space`** on the keyboard (or clicking the button).

---

## 🚀 Kurulum / Installation

### Chrome & Microsoft Edge
1. İndirin / Download: [`luckystrike-ogame-helper-v14.4.zip`](https://github.com/kadirersoy/luckystrike-ogame-helper/releases/latest)
2. Tarayıcıda eklentiler sayfasına gidin / Open extensions page:
   - **Chrome:** `chrome://extensions`
   - **Edge:** `edge://extensions`
3. **"Geliştirici Modu" (Developer Mode)** seçeneğini açın.
4. ZIP'ten çıkardığınız klasörü **"Paketlenmemiş öğe yükle" (Load unpacked)** butonuyla seçin.

---

## 📝 Sürüm Geçmişi / Changelog

### v14.5
- **ğŸ›¡ï¸ Pasif GÃ¶nder Butonu (.off / .disabled) KorumasÄ± / Disabled Send Fleet Guard:**
  - KeÅŸif, ToplayÄ±cÄ±, PostacÄ± ve Maliyet Sepeti asistanlarÄ±nda gÃ¶nderim Ã¶ncesi #sendFleet butonunun durumu isSendFleetReady() ile doÄŸrulanÄ±r. Filo veya keÅŸif slot limiti aÅŸÄ±ldÄ±ÄŸÄ±nda oyun butonunun .off / disabled olmasÄ± durumunda butonun hazÄ±r zannedilip gereksiz gÃ¶nderim tetiklenmesi ve asistanÄ±n donup kalmasÄ± kesin olarak engellendi.
- **ğŸ§­ KeÅŸif Slot Tespiti & YapÄ±sal Fallback GÃ¼Ã§lendirmesi / Robust Expedition Slot Detection:**
  - getExpeditionSlotsInfo ve getFleetSlotsInfo regex'leri esnek (:?) hale getirildi ve Ã§oklu dil (Ä°spanyolca, Ä°talyanca, LehÃ§e vb.) desteÄŸi eklendi.
  - Metin analizi yetersiz kalsa bile #slots DOM elemanÄ± altÄ±ndaki slot Ã§iftlerini doÄŸrudan ayrÄ±ÅŸtÄ±ran yapÄ±sal fallback eklendi.
  - OGame AJAX ve DOM hazÄ±r olma anlarÄ±nda ($(document).ready ve jaxComplete) slot verisinin anÄ±nda senkronize edilmesi saÄŸlandÄ± (sunucuya sÄ±fÄ±r aÄŸ yÃ¼kÃ¼, %100 pasif okuma).
- **â±ï¸ Fallback Zaman AÅŸÄ±mÄ± ve GÃ¼venli Durum DoÄŸrulamasÄ± / Safe Fallback Timeout Inspection:**
  - Fallback sÃ¼resi gerÃ§ek sunucu gecikmelerine tolerans saÄŸlayacak ÅŸekilde 3500ms'ye Ã§Ä±karÄ±ldÄ±. YanÄ±t geciktiÄŸinde asistan kÃ¶rÃ¼ kÃ¶rÃ¼ne baÅŸarÄ± varsaymak yerine butonun aktifliÄŸini denetler; buton pasif ise gÃ¼venli hata durumuna geÃ§er.
- **âš¡ Ã‡ift GÃ¶nderim KorumasÄ± Bildirimi / Double Submit Event Feedback:**
  - ridge.js Ã§ift tÄ±klama korumasÄ±nÄ± tetiklediÄŸinde content.js'e LS_SEND_FLEET_COMPLETE hatasÄ± ileterek asistanÄ±n askÄ±da kalmasÄ±nÄ± engeller.
- **ğŸ§  AÃ§Ä±lÄ±r MenÃ¼ Dinleyici SÄ±zÄ±ntÄ±sÄ± TemizliÄŸi / Dropdown Outside-Click Memory Leak Fix:**
  - ToplayÄ±cÄ±, PostacÄ± ve Maliyet Sepeti panellerinde aÃ§Ä±lÄ±r menÃ¼ dÄ±ÅŸ tÄ±klama dinleyicileri tekilleÅŸtirilerek (hasOutsideClick) gereksiz bellek birikimi Ã¶nlendi.
- **ğŸ“¬ PostacÄ± AsistanÄ± 15 Dakika Zaman AÅŸÄ±mÄ± GÃ¼vencesi / Courier 15-Minute Session Expiry:**
  - PostacÄ± asistanÄ±na diÄŸer asistanlardaki gibi 15 dakikalÄ±k oturum zaman aÅŸÄ±mÄ± korumasÄ± eklenerek eski oturumlarÄ±n istenmeyen anlarda Ã§alÄ±ÅŸmasÄ± engellendi.
- **ğŸŒ Eksiksiz Dil BÃ¼tÃ¼nlÃ¼ÄŸÃ¼ & i18n DÃ¼zeltmeleri / Full i18n Symmetry:**
  - Manuel koordinat istemleri, asistan tamamlanma ve durdurulma bildirimleri I18N.tr ve I18N.en sÃ¶zlÃ¼klerine eklenerek Ã§ift dilli uyumluluk %100 saÄŸlandÄ±.

### v14.4
- **🚨 Sunucu Hata Yönetimi & Güvenli Yönlendirme / Server Error Handling & Safe Dispatch Redirect:**
  - sendFleet isteğine OGame sunucusundan gelen yanıtlar JSON formatında tam olarak denetlenir. Sunucu hatası oluştuğunda (success: false veya errors), asistanların sonraki gezegene veya sisteme kontrolsüzce yönlenmesi kesin olarak engellendi.
  - Hata oluştuğunda kuyruk indeksi korunur, gönderilmeyen gezegen/hedef işaretli kalır ve HUD bannerında gerçek hata detayı kırmızı renkle gösterilir (Tekrar Dene / Atla / İptal butonları sunulur).
- **💡 Uçuş Yakıtı (Deu) Ön Kontrolü / Pre-Flight Fuel Sufficiency Guard:**
  - Filo 2. adımında (leet2) gemilerin tüketeceği döteryum motor yakıtı canlı olarak hesaplanır ve gezegendeki mevcut döteryumla kıyaslanır.
  - Gezegendeki döteryum filonun uçuş yakıtına dahi yetmiyorsa Gönder butonu kilitlenerek kullanıcıya ⚠️ Uçuş Yakıtı Yetersiz (Gereken Deu: X) uyarısı gösterilir; sunucudan ret cevabı alınması önlenir.
- **🐛 Çoklu Dil Görev Hata Tespiti / Multi-Language Mission Error Detection:**
  - hasVisibleMissionError() fonksiyonu dilden bağımsız hale getirildi. Türkçe dışındaki (İngilizce, Almanca vb.) sunucularda görev bildirim hatalarının algılanamayıp takılmaya yol açması engellendi.
- **⌨️ Space Tuşu Giriş Alanı Koruması / Unified Input Guard for Space Key:**
  - Toplayıcı ve Postacı HUD'larında kullanıcı form kutularına (INPUT, TEXTAREA, SELECT) değer yazarken Space tuşuna basması durumunda kazara filo fırlatılması engellendi; davranış tüm asistanlarda standardize edildi.
- **🧹 Kod Tabanı İyileştirmeleri & Eksik Çeviriler / Code Cleanup & i18n Completeness:**
  - Kullanılmayan ölü kod dvanceFleetStep temizlendi.
  - Toplayıcı ve Postacı HUD'larında yer alan hardcoded bildirim metinleri I18N sözlüğüne entegre edildi.

### v14.3
- **🧭 Keşif Asistanında Slot Takibi, Canlı Bekleme Durumu ve Başlangıç Uyarısı / Expedition Slot Awareness & Live Waiting Status:**
  - Keşif asistanında (`Expedition`), keşif slotları dolduğunda (`expSlots.isFull`) asistanın belirsiz bir şekilde `⏳ Hazırlanıyor...` durumunda donup kalması sorunu düzeltildi.
  - Keşif asistanı butonu artık slotlar dolduğunda doğrudan kırmızıya dönerek net bir şekilde `⏳ Keşif Slotu Bekleniyor (X/Y)` gösterir ve altında filoların dönüşünü beklediğini açıklayan durum mesajı (`#ls-exp-hud-status`) sunar.
  - Keşif HUD başlığına canlı keşif slot bilgisi (`🧭 Slot: X/Y`) eklendi.
  - Başlatma öncesinde (`Sefer Sayısı`), boş keşif slotundan daha fazla sefer girildiğinde kullanıcıyı bilgilendiren ve onay alan koruyucu uyarı eklendi.
  - OGame köprü katmanında (`bridge.js`) ve DOM tarayıcısında keşif slotlarının okunması (`maxExpeditionFleets`, tekil/çoğul regex) güçlendirildi.

### v14.2
- **🛡️ Toplayıcıda Döteryum Rezerv ve Kargo Döngüsü (Yazıp-Silme) Hatası Düzeltildi / Fixed Deuterium Reserve & Cargo Loop in Collector:**
  - `bridge.js` içerisindeki `SELECT_ALL_RESOURCES` bloğunda yer alan ve gemi ambarına yüklenen döteryum miktarından gezegen rezervini hatalı bir şekilde düşerek döteryum kutusunu sürekli sıfırlayan (`currentVal - deuReserve`) hatalı mekanizma tamamen kaldırıldı.
  - Toplayıcı (`Collector`) artık tüm kaynaklar seçili olsa dahi `#allresources` butonuna sentetik tıklamalar yapmak yerine, gezegen rezervini ve ambar kapasitesini önceden net olarak hesaplayan deterministik `fillFleetResources(metLoad, criLoad, deuLoad)` fonksiyonunu doğrudan kullanır. Bu sayede gezegendeki döteryum rezerve eşit veya az olduğunda döteryumun saniyede bir yazılıp silinmesi ve sonsuz kargo doğrulama döngüsüne girilmesi kalıcı olarak engellendi.
- **✨ HUD Asistan Bannerlarına Detaylı Durum ve Hata Açıklamaları Eklendi / Informative Status Descriptions on HUD Banners:**
  - Toplayıcı, Postacı ve Maliyet Sepeti asistan bannerlarında herhangi bir bekleme veya onaylanamama durumu oluştuğunda (sunucu hedef kontrolü, görev seçimi, kaynak yükleme doğrulaması, filo slot doluluğu vb.), kullanıcının neden bekletildiğini net olarak açıklayan canlı durum mesajları (`#ls-coll-hud-status`, `#ls-cour-hud-status`, `#ls-cart-hud-status`) eklendi. Detaysız belirsiz uyarılar sonlandırıldı.

### v14.1
- **🔄 Keşif Şablonları İçin Arka Planda Otomatik Çekme (Self-Fetch) & Kesin Seçici Desteği / Automatic Background Template Fetching:**
  - OGame'in gerçek şablon seçici kimliği olan `#expeditionFleetTemplateSelect` (`select[name="expeditionFleetTemplateSelect"]`) ve ilgili selectmenu yapıları tam olarak entegre edildi.
  - Kullanıcının şablonları yenilemek için elle "Filo 1 sayfasına geçme" zorunluluğu tamamen ortadan kaldırıldı: Hangi sayfada olunursa olunsun `🔄` butonuna tıklandığında, eklenti arka planda filo sayfasını (`component=fleetdispatch`) çekip (`fetch` & `DOMParser`) keşif şablonlarını otomatik ayrıştırır ve açılır kutuyu günceller.
- **✨ Şablon Yenileme Butonu Büyütüldü ve Konumu İyileştirildi / Prominent Centered Refresh Button:**
  - Keşif Şablonu başlığındaki küçük ve anlaşılması zor ikon kaldırıldı.
  - Sefer Sayısı ile Keşif Şablonu arasına, form girişleriyle tam hizada (`height: 27px; font-size: 13px`) modern ve şık bir `🔄` butonu yerleştirildi.

### v14.0
- **🛡️ Keşif Şablon Seçiminde `triggerFullClick` ve DOM Tıklamaları Tamamen Kaldırıldı / Eliminated CSP Triggers:**
  - `content.js` içerisindeki `triggerFullClick` mekanizması ve OGame açılır menü öğelerine yapılan tüm manuel sentetik DOM tıklamaları tamamen kaldırıldı.
  - Keşif şablonunun seçimi ve uygulanması (gemi adetlerinin doldurulması, kargo hesaplaması ve selectmenu güncellemesi) `SELECT_TEMPLATE` olayı ile doğrudan sayfa bağlamındaki (`bridge.js` - MAIN world) yerel `window.fleetDispatcher.standardFleetSelected / expeditionFleetSelected` API'sine devredildi. Bu sayede izole dünyadan `javascript:void(0)` bağlantılarına tıklama riski ve Manifest V3 CSP ihlali kalıcı olarak sıfırlandı.
- **🚀 Standart Filo Şablonları Keşif Listesinden Ayrıştırıldı / Strict Isolation of Expedition Templates:**
  - Keşif Şablonu açılır kutusuna Standart Filo şablonlarının (örn: `Pompalamasyon`, `Standart Filo`) sızması engellendi.
  - Hem `content.js` hem de `bridge.js` üzerindeki tarama algoritmaları yalnızca `#expeditionfleet` ve `#expeditionfleet-menu` öğelerini hedefleyecek şekilde daraltıldı. `#standardfleet` ve genel sayfa menülerinden yapılan kontrolsüz tarama sonlandırıldı.
  - `isValidTemplateName` filtresine ve başlangıç temizleyicisine `standart`, `standard`, `pompalamasyon` ve `şablon seç` korumaları eklenerek daha önce önbelleğe girmiş yabancı şablonlar kalıcı olarak temizlendi.

### v13.9
- **🛡️ Keşif Şablon Seçimi ve Tüm Oyun İçi Tıklamalardan Native `.click()` Kaldırıldı / Completely Eliminated Native `.click()` on Game Elements:**
  - `triggerFullClick` fonksiyonunda yer alan yerel `.click()` çağrıları tamamen kaldırıldı. Keşif şablonu (1xKeşif vb.) seçilirken dropdown ve option etiketleri içindeki `<span>` ve `<li>` gibi alt düğümlere yapılan tıklamaların OGame'in `javascript:void(0)` bağlantılarına sıçrayarak Chrome Manifest V3 CSP ihlaline yol açması kalıcı olarak engellendi.
  - `clickDevamButton`, `triggerAllResourcesNative`, `advanceFleetStep` ve `navigateToGalaxy` fonksiyonları tamamen sentetik `PointerEvent` ve `MouseEvent` (`pointerdown`, `mousedown`, `pointerup`, `mouseup`, `click`) modellerine geçirilerek native `.click()` kaynaklı tüm tarayıcı navigasyon ve inline script tetiklemeleri sıfırlandı.
  - Purged all native `.click()` calls across `content.js` interaction helpers, transitioning strictly to synthetic pointer/mouse event dispatching and permanently eliminating CSP inline script violations during expedition template selection.

### v13.8
- **🛡️ Chrome Manifest V3 CSP İhlali ve `javascript:void(0)` Tıklama Hatası Giderildi / Fixed CSP Violation on `javascript:` Links:**
  - `chrome://extensions` hata panelinde raporlanan `Running the JavaScript URL violates the following Content Security Policy directive: script-src 'self' 'wasm-unsafe-eval'...` uyarısı giderildi.
  - OGame'in yerel şablon ve açılır menü öğelerinde (`<a>` etiketlerinde `href="javascript:void(0)"` bulunan linkler) programatik `.click()` çağrısı yapıldığında Manifest V3 CSP kuralı devreye girip inline script çalıştırılmasını engelliyordu.
  - `triggerFullClick`, `clickDevamButton`, `triggerAllResourcesNative`, `advanceFleetStep` ve `navigateToGalaxy` fonksiyonları `isJsHref` filtresiyle korunarak, `javascript:` bağlantılarına doğrudan native `.click()` yerine sentetik Mouse/Pointer olayları (`pointerdown`, `mousedown`, `pointerup`, `mouseup`, `click`) dispatch edilerek OGame'in DOM event listener'larının CSP ihlaline takılmadan çalışması sağlandı.
  - Neutralized Chrome Manifest V3 Content Security Policy (CSP) inline script violations when triggering programmatic clicks on OGame template links containing `javascript:void(0)` hrefs by dispatching synthetic mouse events instead of invoking raw `.click()`.
- **🛡️ Asistan Arayüzlerinde Null/Undefined Güvenlik Kalkanı / Defensive Parameter Guards in Assistant Handlers:**
  - `executeFleetDispatchStep`, `renderCollectorAssistantBanner`, `renderCourierAssistantBanner`, `executeExpeditionStep` ve `renderExpeditionBanner` fonksiyonlarına parametre koruma kalkanları eklenerek sekme veya sayfa geçişlerindeki olası render hataları önlendi.
  - Hardened assistant lifecycle and HUD render pipelines against transient null or undefined session states during rapid page navigation.
- **🧹 Ayarlar Sekmesi Sadeleştirildi & İşlevsiz Güncelleme Butonu Kaldırıldı / Clean Settings Header (Removed Redundant Update Button):**
  - Paketlenmemiş (unpacked) eklentiler tarayıcı içinden dosya sistemini güncelleyemediği için Ayarlar sekmesindeki gereksiz "Güncelleme Kontrolü" butonu ve durum satırı kaldırıldı.
  - Üst kart sadece eklenti başlığı, `v13.8` versiyon rozeti ve GitHub bağlantısı kalacak şekilde sadeleştirildi.
  - Removed the non-functional in-page update check button and status text from the Settings tab, leaving only the version badge and project link.

### v13.7
- **🌕 Ay İsimleri Filtresi & Çap/Menü Metinleri Temizliği / Clean Moon Names Without Diameter or Menu Texts:**
  - Ay isimleri taranırken OGame tooltip ve başlıklarında yer alan çap (`8.717km`, `ø 8.717km`), alan sayısı (`(38/39)`) ve hızlı menü metinleri (`Sıçrama Geçidi`, `Genel Bakış`, `Kaynaklar`, `Tesisler`, `Savunma`, `Filo`, `Galaksi`) filtrelendi.
  - Açılır menülerde (combobox) ve Asistan HUD başlıklarında yalnızca ayın gerçek adı (örn: `520`, `FB_520`) gösterilecek şekilde `cleanMoonName` sterilizasyonu sağlandı ve eski kirlenmiş önbellek değerleri otomatik temizlendi.
  - Purged diameter metrics, field capacities, and sub-menu links from moon name tooltips, displaying only the authentic custom moon identifier across all assistants.
- **🚀 Keşif Asistanı (Expedition) Gönder Butonu Kilitlenmesi & Space Sorunu Çözüldü / Fixed Expedition Send Button Block & Space Trigger:**
  - Keşif Asistanı'nda filo gönder butonu sayfada görünür ve hazır durumdayken, sunucu görev senkronizasyon gecikmelerinin filo gönderimini engellemesi ve kullanıcıyı kısır `prepareStep2` döngüsüne sokması engellendi.
  - Kullanıcı `Space` tuşuna bastığında veya `🚀 Keşif Gönder` butonuna tıkladığında ekranda gönder butonu mevcutsa doğrudan `dispatchSendExpeditionFleet` çalıştırılarak filo yola çıkarılır.
  - `isMissionSelected(missionId)` kontrolüne `bridge.js` üzerinden `window.fleetDispatcher.mission` (`document.body.dataset.lsSelectedMission`) ve OGame'in `li#button`, `.on`, `.selected`, `.active` sınıfları entegre edildi.
  - `prepareStep2` içerisindeki görev tıklamaları 1200ms zaman aşımı kısıtlamasına alınarak sunucuya gereksiz tıklama flood'u gitmesi engellendi.
  - Allowed direct expedition dispatch when the fleet send button is visible on Step 2, synchronized authoritative mission state via `bridge.js`, and throttled mission clicks to prevent target inquiry lockouts.

### v13.6
- **🌕 Ayların Kendi Gerçek İsimleri Algılanıp Tanımlandı / Real Moon Names Parsing & Persistent Caching:**
  - Eskiden aylar doğrudan bağlı oldukları ana gezegenin adını devralıp `GezegenAdı ( Ay )` şeklinde listeleniyordu (örn: `FB_521 ( Ay )`).
  - OGame DOM yapısındaki `a.moonlink` tooltip başlıkları (`title`, `data-tooltip-title`, `<b>FB_520</b>`) ve `meta[name="ogame-planet-name"]` meta etiketleri taranarak ayın kendi özel ismi (örn: `FB_520`) tespit edildi ve `LS_KNOWN_MOON_NAMES` kalıcı önbelleğine alındı.
  - Toplayıcı (Collector), Maliyet Sepeti (Cart), Kurye (Courier) ve Asistan HUD başlıklarındaki tüm ay gösterimleri ayın kendi gerçek ismiyle güncellendi.
  - Extracted authentic moon names from OGame's DOM tooltip attributes and server meta tags, persistently caching them in `LS_KNOWN_MOON_NAMES` across all dispatch and collection interfaces.
- **🛡️ Toplayıcı (Collector) `LOCA_ERROR_INQUIRY_NOT_WORKED_TRYAGAIN` & Görev 3 Flood Koruması / Fixed Collector Inquiry Rate-Limit & Mission 3 Spam:**
  - `content.js` içerisindeki `setFleetTargetCoords` fonksiyonundan çift DOM tıklamaları kaldırıldı; hedef seçimi ve tip ataması yalnızca `bridge.js` üzerinden tekil ve kontrollü olarak tetiklenecek şekilde optimize edildi.
  - `setFleetMission` fonksiyonuna `isMissionSelected(missionId)`, `isTargetCheckPending()` ve `!isMissionClickable(missionId)` kilitleri eklendi. Görev zaten seçiliyse veya sunucuda `checkTarget` devam ediyorsa saniyede 40 kez Nakliye görevine tıklama döngüsü tamamen sonlandırıldı.
  - `isMissionClickable` kontrolü OGame'in `li.off` ve `li.disabled` sınıflarını denetleyecek şekilde güçlendirildi; sunucu doğrulaması tamamlanmadan butona tıklanması engellendi.
  - Eliminated redundant target clicks between `content.js` and `bridge.js`, added pre-conditions to `setFleetMission` preventing rapid 40 clicks/sec spam, and respected parent `li.off` disabled flags during active `checkTarget` inquiries.

### v13.5
- **🧭 Keşif Asistanı (Expedition) `LOCA_ERROR_INQUIRY_NOT_WORKED_TRYAGAIN` Hatası Giderildi / Fixed Expedition Target Check Spam:**
  - `bridge.js` içerisindeki yapay çift sistem girdisi (`tempS` yazıp 40ms sonra asıl sistemi yazma) tamamen kaldırıldı. Bu durum GameForge sunucularına 40ms arayla iki `checkTarget` sorgusu gönderip `LOCA_ERROR_INQUIRY_NOT_WORKED_TRYAGAIN` hatasına sebep oluyordu.
  - Hedef Gezegen/16. slot seçim kontrolü `.planet_selected` ve `.selected` sınıflarını tanıyacak şekilde tekilleştirildi; gereksiz tıklama tekrarları önlendi.
  - Eliminated the artificial `tempS` double-input delay in `bridge.js` that triggered concurrent `checkTarget` AJAX inquiries and caused GameForge error 60000.
- **🚀 Keşifler Arasında Doğrudan Geçiş & Çift Yenilenme / Ara Sekme Sorunu Çözüldü / Seamless Expedition Next-System Transition:**
  - Keşif filosu gönderilirken `SUBMIT_FLEET2` aksiyonuna sıradaki sistemin URL'si (`nextUrl`) entegre edildi.
  - OGame'in `sendFleet` yanıtındaki `redirectUrl` doğrudan sıradaki keşif koordinatına yönlendirilir; böylece eski sistemin yeniden yüklenmesi ve "arada bir sekme fazladan gelip orayı tekrar geçmesi" sorunu tamamen ortadan kalktı.
  - Connected `nextUrl` to `SUBMIT_FLEET2` in Expedition Assistant, enabling OGame's native redirect to jump directly to the next system without redundant intermediate reloads.
- **🛡️ Keşif Görevi (Mission 15) ve Slot Senkronizasyonu Güçlendirildi / Robust Mission 15 & Expedition Slots Guard:**
  - `prepareStep2` döngüsünde Görev 15 zaten seçiliyse veya sunucuda `checkTarget` isteği askıdaysa gereksiz tıklama ve flood engellendi; `isMissionSelected(15)` ve `isTargetCheckPending()` ile tam senkronizasyon sağlandı.
  - `getExpeditionSlotsInfo()` eklenerek keşif slotlarının dolu olup olmadığı hem panelden başlatırken hem de HUD üzerinden filo gönderirken kontrol altına alındı.
  - Throttled mission selection with `isMissionSelected(15)` and `isTargetCheckPending()`, and introduced `getExpeditionSlotsInfo()` to respect maximum expedition capacity.

### v13.4
- **🛡️ `LOCA_ERROR_INQUIRY_NOT_WORKED_TRYAGAIN` & Hedef Sorgu Kilitlenmesi Giderildi / Target Query Rate-Limit Fix:**
  - OGame'in yerel hedef seçim sınıfları (`.moon_selected`, `.planet_selected`, `.debris_selected`) tam uyumlu hale getirildi.
  - Hedef koordinat ve Ay/Gezegen türü ataması tekil ve kontrollü yapıya kavuşturuldu; aynı anda 8 DOM elementine birden tıklama döngüsü ve 80ms aralıklı flood çağrıları kaldırıldı.
  - `checkTarget` isteği sunucuda askıdayken (`lsTargetCheckPending`) yeni sorguların gitmesini engelleyen eşzamanlı istek kilidi eklendi.
  - Resolved GameForge server rate-limiting and localization query errors by introducing deterministic single-element target clicking, proper CSS class recognition, and an active inquiry mutex.
- **🚀 Akıcı Doğrudan Gezegen Geçişi & Çift Sayfa Yüklenmesinin Önlenmesi / Direct Planet Transition:**
  - Filo gönderildikten sonra OGame'in native scripti tarafından eski/mevcut gezegenin yeniden yüklenmesi (`redirectUrl`) `$.ajaxPrefilter` kancasıyla doğrudan sıradaki hedef gezegenin adresine bağlandı.
  - "Arada bir sekme fazladan geliyor ve orayı tekrar geçip çalışıyor" şeklindeki ara sayfa yüklenme ve çift yönlendirme davranışı tamamen ortadan kaldırıldı; filolar gezegenler arasında doğrudan ve kesintisiz akar.
  - Intercepted OGame's native post-dispatch redirect to transition straight into the next queue target URL, eliminating intermediate reloads on the previous planet.

### v13.3
- **🛡️ Saf OGame Deterministik & Olay Tabanlı (Event-Driven) Filo Mimarisi / Pure OGame Event-Driven Architecture:**
  - **Milisaniyelik Yapay Beklemelere Son:** Tüm filo hazırlık ve sekme geçişlerindeki yapay gecikmeler tamamen kaldırıldı. Kodlar doğrudan OGame'in DOM durumlarına (`.on`, `.selected`) ve sunucu yaşam döngüsüne bağlandı.
  - **Zero Blind Delays:** Removed artificial timeout delays across fleet dispatch and step transitions. Automation is now directly synchronized with OGame's reactive DOM state flags and server lifecycle.
- **🛰️ Sunucu `checkTarget` AJAX Kancası & Asenkron Senkronizasyon / `checkTarget` Server Hook:**
  - Koordinat veya hedef türü (Ay/Gezegen) seçildiğinde OGame'in sunucuya attığı `checkTarget` AJAX yanıtı `bridge.js` üzerinden anlık olarak dinlenir. Sunucu yanıtı dönmeden görev seçimi veya kaynak doldurma yapılmaz; böylece *"Bu görevi başlatamazsın"* hatası ve yarış durumları (race condition) tamamen engellendi.
  - Synchronized mission and resource operations with OGame's native `checkTarget` asynchronous response. Eliminates premature mission submission and "You cannot start this mission" errors.
- **💎 Maden Toplayıcı'da Saf OGame `<a id="allresources">` Entegrasyonu / Native Resource Loading:**
  - Maden Toplayıcı modülünde kutulara elle ham veri enjekte etmek yerine saf OGame'in yerel "Tüm Kaynaklar" (`#allresources`) butonu entegre edildi. Varsa döteryum rezervi tek tıkla korunarak tüm kargo kapasitesi hatasız ve yerel sayı formatıyla (`.checkThousandSeparator`) doldurulur.
  - Integrated native OGame `#allresources` button for Collector deliveries, properly respecting deuterium reserves and native thousand-separator formatting.
- **🛸 Filo Hareketi Slot Limiti Takibi & Koruması / Fleet Slot Awareness & Waiting Mode:**
  - Maliyet Sepeti, Maden Toplayıcı ve Postacı modüllerinde filo slotu limitleri canlı olarak takip edilir. Slotlar tükendiğinde (`27/27` vb.) operasyon kilitlenmeden akıllı bekleme moduna geçer ve HUD üzerinde anlık slot rozeti (`🛸 Slot: X/Y`) görüntülenir.
  - Live tracking of fleet slot capacities across all dispatch modules. Automatically pauses queue execution when slots are exhausted instead of failing.

### v13.2
- **⚡ Zamansız Başlık Tasarımı (Timeless Header):**
  - Panel üst başlığındaki sabit versiyon rozeti kaldırıldı (`⚡ LuckyStrike Helper`). Böylece her versiyon geçişinde ekran görüntüleri eskimeden geçerliliğini koruyor.
- **⚙️ Ayarlar Sekmesinde Sürüm & GitHub Kartı (About & Updates):**
  - Ayarlar sekmesinin en üstüne şık ve modern "Sürüm & Güncelleme" kartı eklendi.
  - Aktif sürüm numarası (`v13.2`) ve doğrudan GitHub proje sayfası bağlantısı (`🔗 GitHub`) entegre edildi.
- **🔄 Otomatik Güncelleme Kontrolü (Check for Updates):**
  - Ayarlar sekmesine tek tıkla çalışan `🔄 Güncelleme Kontrolü` butonu eklendi.
  - Doğrudan GitHub Releases API'sini sorgulayarak yeni sürüm olup olmadığını anında denetler; yeni sürüm varsa doğrudan indirme bağlantısını ekrana getirir.
- **📸 GitHub-Fix Görsel Kuralına Zorunlu Ön Değerlendirme:**
  - Salt versiyon numarası artışları için ekran görüntülerinin gereksiz yere tekrar render edilmesi kalıcı olarak yasaklandı; sadece arayüzde tasarımsal bir değişiklik olduğunda ve yalnızca ilgili sekme için render kuralı getirildi.

### v13.1
- **⛽ Yakıt ve ⚡ Hız Öncelik Sıralaması İnce Ayarı (Mathematical Fleet Optimization):**
  - **Yakıt Önceliği (Fuel Mode) Kusursuzlaştırıldı:**
    1. Full BN *(En az yakıt tüketen)*
    2. BN + KN *(Eldeki tüm BN'leri tüketir, kalan açığı minimum KN ile tamamlar)*
    3. Full KN *(Yalnızca BN hiç yoksa devreye girer)*
    4. BN + KN + Rehber *(BN ve KN yetmiyorsa; kalan açığı minimum Rehber ile kapatır)*
    5. BN + Rehber *(KN hiç yoksa; BN + kalan Rehber)*
    6. KN + Rehber *(BN hiç yoksa; KN + kalan Rehber)*
    7. Full Rehber *(Yalnızca BN ve KN hiç yoksa son çare)*
  - **Hız Önceliği (Speed Mode) Kusursuzlaştırıldı:**
    1. Full Rehber *(Hiperuzay hızı)*
    2. Full KN *(İmpuls hızı)*
    3. KN + Rehber *(Tüm KN'leri doldurur, kalanı Rehber ile tamamlar)*
    4. Full BN *(BN hızında)*
    5. BN + KN *(BN hızında; BN'leri doldurur, kalanı KN ile tamamlar)*
    6. BN + KN + Rehber *(BN hızında; KN'leri sonuna kadar harcar, kalan açığa minimum Rehber koyar)*
    7. BN + Rehber *(KN hiç yoksa)*
  - Gereksiz yere obur Rehber gemisine yakıt ödenmesi engellendi; tasarruflu gemiler her iki modda da önceliklendirildi.

### v13.0
- **⚡ Hız / ⛽ Yakıt Öncelik Anahtarı (Smart Fleet Speed/Fuel Priority Switch):**
  - Maliyet Sepeti, Maden Toplayıcı ve Postacı sekmelerindeki Nakliye / Konuşlandır butonlarının yanına dinamik Hız ve Yakıt odaklı öncelik değiştirme butonu (`⚡ Hız` / `⛽ Yakıt`) eklendi.
  - Her sekme kendi mod tercihini tarayıcı oturumunda ve yerel depolamasında bağımsız olarak saklar.
  - **Hız Önceliği:** 1- Full Rehber > 2- Full KN > 3- KN + Rehber > 4- Full BN > 5- BN + KN > 6- BN + Rehber > 7- BN + KN + Rehber (Hızlı kargo filoları öncelikli doldurulur).
  - **Yakıt Önceliği:** 1- Full BN > 2- Full KN > 3- BN + KN > 4- Full Rehber > 5- BN + Rehber > 6- KN + Rehber > 7- BN + KN + Rehber (En az yakıt yakan ağır kargolar öncelikli tutulur).
  - Yetersiz kapasite veya eksik gemi kombinasyonlarında kademeli tamamlama algoritması ve 0 gemili kombinasyon koruması optimize edildi.
- **📍 "Merkez" (Hub) Terminoloji Sadeleştirmesi:**
  - Maliyet, Toplama ve Postacı sekmelerindeki "Dağıtım üssü", "Toplama hedefi" ve parantez içi kafa karıştırıcı ibareler sadeleştirilerek ortak **"📍 Merkez" (TR) / "📍 Hub" (ENG)** standardına dönüştürüldü.
  - Bildirim ve sistem işlem logları ("Merkeze geçiliyor") terminolojiye tam uyumlu hale getirildi.
- **⚙️ Ayarlar Sekmesinde Tek Dil Temizliği:**
  - Ayarlar sekmesindeki tüm `/ Language`, `/ Skin`, `/ Opacity`, `(Focus)` gibi çift dilli slaşlı ifadeler kaldırıldı; eklenti aktif dilinde (Türkçe veya İngilizce) temiz ve sade bir görünüm sunuyor.
- **🌐 Çift Dil ve Tema Uyumluluk Güvencesi (Rule 8):**
  - Tüm yeni butonlar, durum rozetleri ve başlıklar hem Türkçe hem İngilizce dil seçeneklerinde ve hem Uzay Karanlığı hem Fenerbahçe skinlerinde piksel taşması olmaksızın test edildi ve doğrulandı.

### v12.3
- **🔭 Harabe Avcısı (16. Slot Sonsuz Uzaklar / Expedition) Tam Düzeltmesi:**
  - 16. slot harabelerinin listeden kendi kendine silinmesine yol açan gizli başlangıç filtresi (1M sınırı ve kristal şartı) kökten kaldırıldı.
  - OGame'in gezegen adı hücresindeki `title="Sonsuz Uzaklıklar"` niteliği ile enkaz hücresi arasındaki seçici çakışması giderildi; yalnızca `.cellDebris` izole edilerek güvenli çok katmanlı okuma sağlandı.
  - OGame'in kullandığı tüm tooltip varyasyonları (`#debrisExpedition`, `#expeditionDebris`, `#debris16`) ve DOM öznitelikleri eksiksiz desteklendi.
  - Tablo koordinat doğrulama (`getRenderedGalaxyCoords`) ve hücre doluluk teyidine dayalı **Güvenli Temizlik (Safe Deletion)** eklendi; enkaz ikonu ekranda olduğu sürece harabe listeden asla silinmez.
- **⚡ Hızlı Galaksi Geçişlerinde Kesintisiz Tarama (Bridge Entegrasyonu):**
  - `bridge.js` üzerinden OGame'in jQuery `ajaxComplete` döngüsü `LS_GALAXY_AJAX_COMPLETE` olayı ile `content.js`'e bağlandı.
  - Ok tuşlarına hızlıca basıldığında zamanlayıcıların birbirini iptal etmesi engellendi; kademeli kuyruk yapısıyla hiçbir sistem atlanmadan taranıyor.
- **🛡️ Chrome Eklenti Hata Temizliği (Zero Extension Errors):**
  - `forceRefreshAllUniverseData()` fonksiyonundaki yakalanmayan `throw err;` istisnası ve `console.error` çağrıları temizlendi.
  - `ensureAudioContext()` Web Audio API Autoplay kurallarına uygun hale getirildi; Chrome Extensions panelinde kırmızı hata uyarıları tamamen sıfırlandı.

### v12.2
- **📬 Postacı Asistanı Ekranda Takılma Düzeltmesi:**
  - OGame filo gönderim adımında (Step 2) OGame'in hedef koordinatları ve Ay seçimini varsayılana sıfırlaması sonucu ortaya çıkan *"Bu görevi başlatamazsın"* hatası ve buton pasifliği kökten çözüldü.
  - `bridge.js` üzerinden `fleetDispatcher` dahili hedef özellikleri (`targetGalaxy`, `targetSystem`, `targetPosition`, `targetPlanetType`) doğrudan eşitlendi.
  - Step 2 hazırlık döngüsüne kesintisiz koordinat & Ay doğrulaması eklendi; OGame koordinatları sıfırlamaya çalışsa dahi doğru hedef anında geri yükleniyor.
  - Çıkış üssü Ay olduğunda hedef koordinat URL'sine yanlışlıkla basılan `type` parametresi düzeltilerek hedefin kendi gerçek tipi (`&type=${item.type}`) sağlandı.
  - Pasif buton kontrolü ve *"Tekrarla (🔄)"* butonunda temiz sayfa yenilemesi entegre edildi.
- **📏 Postacı Maden ve Kargo Özeti Düzeni:**
  - Dağıtım listesinin altındaki toplam maden tutarları ile kargo ihtiyacı yazısının birbirine yapışması engellendi; alan şık ve ferah 2 satırlı düzen ve kesikli ayırıcı çizgi ile ayrıldı.

### v12.1
- **📐 CSS Ölçekleme ve Dar Panel Sözdizimi Düzeltmesi:**
  - Panelin minimum boyuta (350px ve 310px) küçültüldüğünde tüm buton, başlık, kart ve girdi kutularının eksiksiz ölçeklenmesini engelleyen geçersiz CSS seçici sözdizimi temizlendi.
- **🟡🔵 Fenerbahçe Skin İyileştirmeleri:**
  - Dar ekranda büyük işlem butonlarının iki satıra taşmasını engelleyen dinamik emoji optimizasyonu eklendi.
  - Galaksi Tarayıcısı sonuç satırları ve Oyuncu Arama sonuç kartları Fenerbahçe temasına uygun lacivert/sarı renk şemasına dahil edildi.
  - Arama sonuçlarındaki yönlendirme butonları temaya uygun futbol topu (`⚽`) simgesiyle güncellendi.
- **🔍 Oyuncu/Gezegen Arama Geliştirmesi:**
  - 50 sonuç sınırına ulaşıldığında kullanıcıya net bir şekilde `50+ sonuç bulundu (İlk 50 listeleniyor)` bilgisi gösterilmesi sağlandı.

### v12.0
- **🟡🔵 Yeni Görünüm / Skin - Fenerbahçe (Koyu & Kanarya):**
  - Ayarlar sekmesine yeni `🟡🔵 Fenerbahçe (Koyu & Kanarya)` teması eklendi.
  - Gece mavisi & lacivert zemin, sarı kanarya vurguları, kale ağı desenli dağıt butonları, futbol topu zıplama ikonları (`⚽`), stadyum (`🏟️`) ve kanarya (`🦅`) detaylarıyla zenginleştirilmiş koyu temalı yeni skin.
  - Varsayılan `🌌 Uzay Karanlığı (Dark)` teması bozulmadan korundu.
- **🛡️ Evren & Oyuncu Tarayıcısı Hata Düzeltmeleri:**
  - 60 saniyelik güncelleme beklemesinde (cooldown) sayfa yenilendiğinde önbelleğin boş (`null`) dönmesi ve koordinat/oyuncu verilerini okurken oluşan istisnalar giderildi.
  - Önbellek durum göstergelerindeki koordinat ve oyuncu sayısı kontrolleri `null-safe` hale getirildi.
  - Arama modülünde adı boş gelen oyuncu ve gezegen kayıtları için küçük harfe çevirme (`toLowerCase`) hata koruması sağlandı.

### v11.2
- **🏗️ Maliyet Sepetine Ek Maliyet Desteği:**
  - Gönderim yapılacak her bir gezegen sepetine otomatik eklenecek sabit maden tutarları (Metal, Kristal, Deu) tanımlama özelliği eklendi.
- **☑️ Sepet Kolay Seçim Çubuğu:**
  - Sepetteki gezegenleri tek hamlede yönetmek için `☑️ Tümünü Seç` ve `◻️ Seçimi Temizle` butonları eklendi.
- **📐 Ölçekleme & Panel Hover İyileştirmeleri:**
  - Panel boyutu küçültüldüğünde butonların taşmasını ve yatay kaydırma çubuğunun oluşmasını engelleyen dinamik ölçekleme yapıldı.
- **📬 Postacı & Alarm Hizalamaları:**
  - Postacı sekmesindeki maden kutucukları ve ikon hizalamaları düzeltildi, minimum panel boyutu optimize edildi.

### v11.1
- **📬 Postacı Asistanı İyileştirmeleri & Dağıtım Üssü Seçimi:**
  - Dağıtım üssü kutusuna tıklandığında açılan açılır liste (combobox) optimize edildi; imparatorluktaki herhangi bir Gezegen veya Ay tek tıkla çıkış noktası olarak atanabilir.
  - Filo gönderme ekranındaki gemi adet kontrolü ve otomatik form doldurma kararlılığı artırıldı.
- **⏱️ Sekmeler İçin 3 Saniye Gecikmeli Kullanım Rehberi (Hover Tooltips):**
  - Paneldeki 9 sekmenin üzerine fare ile 3 saniye gelindiğinde, sekmenin işlevini ve kullanımını özetleyen bilgilendirme kutusu (tooltip) eklendi (TR / ENG).
- **🌐 Dil ve Arayüz Düzenlemeleri:**
  - Dil seçeneği kısaltması `ENG` olarak sadeleştirildi; işletim sistemi yazı tipi uyumluluğu artırıldı.
  - Harabe takipçisindeki galaksiye yönlendirme butonu arayüzü tekil roket simgesiyle netleştirildi.

### v11.0
- **📬 Yeni Modül: Postacı Asistanı (Resource Courier):**
  - Maden Toplayıcı'nın (Collector) tam simetrik tersi olarak çalışan, tek bir çıkış üssünden (Dağıtım Üssü) imparatorluk genelindeki tüm hedef gezegen ve aylara maden sevkiyatı yapan yepyeni asistan sekmesi eklendi.
  - **Genel Dağıtım Senkronizasyonu (Global Fill):** Metal, Kristal ve Deuterium için genel tutar kutuları ve `⚡ Eşitle` butonu entegre edildi. Belirlenen tutarlar tek hamlede tüm seçili kolonilere aktarılabilir.
  - **Hedefe Özel Bağımsız Girişler:** Her gezegen ve ay için ayrı ayrı Metal, Kristal, Deuterium girdi alanları sunuldu (`1m`, `500k`, `2.5m` gibi sayı kısaltmaları desteklenir).
  - **Çıkış Üssü Koruma Rozeti:** Dağıtım üssü olarak seçilen merkez otomatik algılanarak `📍 Dağıtım Merkezi` rozetiyle işaretlenir, onay kutusu kilitlenir ve yanlışlıkla kendine gönderim yapılması engellenir.
  - **Canlı Stok & Kapasite Doğrulaması:** Dağıtım üssündeki canlı hammadde miktarları ve seçilen kargo gemilerinin (Büyük Nakliye, Küçük Nakliye, Rehber) toplam kapasitesi kontrol edilerek özet çubuğunda yeterlilik durumu raporlanır.
  - **Yüzen Bilgi Paneli & Otomatik Uncheck:** Gönderimi tamamlanan hedefler otomatik olarak listeden düşürülür (uncheck edilir); `Space` tuşu desteğiyle kesintisiz, sıra sıra konforlu filo dağıtımı sağlanır.

### v10.6
- **🔄 Birleşik Evren & Oyuncu Önbellek Senkronizasyonu (Unified Universe & Player Cache):**
  - **Arama (Player Finder) Sekmesine Akıllı Önbellek & Güncelleme Butonu:** Oyuncu ve gezegen arama modülü, her aramada sunucuya gitmek yerine 24 saatlik akıllı yerel önbellek üzerinden çalışacak şekilde optimize edildi.
  - **Tek Hamlede Çift Veri İndirme:** Hem Tarayıcı hem de Arama sekmesindeki `🔄 Güncelle` butonları birleştirildi. Herhangi birinden güncellendiğinde `universe.xml` ve `players.xml` tek seferde paralel olarak indirilip kaydedilir; sunucuya mükerrer istek gönderilmesi önlenir.
  - **Senkronize 60 Saniye Kilidi (Shared Cooldown):** Güncelleme tetiklendiğinde iki sekmedeki güncelleme butonları da aynı anda kilitlenir ve 60 saniyelik geri sayım sayacı (`⏳ 59s` ... `⏳ 1s`) iki sekmede de ortak çalışır.
  - **Gelişmiş Önbellek Durum Bilgisi:** Arama ve Tarayıcı sekmelerinde son güncelleme zamanı ile toplam kayıtlı gezegen ve oyuncu sayıları anlık olarak görüntülenir.
- **👁️ Ayarlanabilir Panel Saydamlığı (Opacity Slider):**
  - Ayarlar sekmesine %20 ile %100 arasında 5'lik adımlarla çalışan saydamlık kaydırıcısı eklendi. Panel yarı saydam yapılarak arkasında kalan oyun ekranının rahatça okunabilmesi sağlandı.
- **🎯 Fare Focus Özelliği (Hover to Focus - %100 Görünürlük):**
  - Saydamlık ayarının yanına eklenen "Fare Üzerindeyken %100 Yap" seçeneğiyle, panel saydam olsa bile fare üzerine geldiğinde akıcı bir geçişle tam görünür (%100) olur; fare çekildiğinde eski saydamlık seviyesine geri döner.

### v10.5
- **🌌 Galaxy Scanner Akıllı Önbellek (Cache) & Sıfır Sunucu Yükü:**
  - `universe.xml` dosyasının her taramada tekrar indirilmesi engellendi; 24 saat geçerli istemci taraflı önbellek mimarisi entegre edildi. Taramalar artık sunucuya 0 ağ isteği atarak ~50 ms içinde yerel hafızadan anında sonuç verir.
  - **İkili Buton Mimarisi:** `🔍 Taramayı Başlat` (Önbellekten hızlı tarama) ve `🔄 Güncelle` (Sunucudan zorla taze veri çekme).
  - **60 Saniye Güvenlik Kilidi (Cooldown):** `🔄 Güncelle` butonuna 60 saniyelik geri sayım sayacı (`⏳ 59s` ... `⏳ 1s`) ve kilit mekanizması eklendi; Gameforge API'sinin yanlışlıkla spamlanması teknik olarak engellendi.
- **🛡️ Ses Motoru (AudioContext) & Autoplay Koruma Güvencesi:**
  - Chrome Autoplay politikası nedeniyle `AudioContext.resume()` çağrılarında oluşan konsol promise reddi hataları koruma altına alındı.
- **📋 Güvenli Pano Kopyalama (Clipboard Safe Fallback):**
  - Tarayıcı pencere odağı kaybolduğunda ortaya çıkan `Document is not focused` hatalarına karşı görünmez textarea geri çekilme mekanizması (`copyTextSafe`) eklendi.

### v10.4
- **🧭 Keşif Asistanı Sadeleştirmesi & Doğal Şablon Desteği:**
  - OGame filo şablonlarının kayıtlı hız ve keşif süresi ayarlarını doğal (native) olarak koruması sağlandı.
  - Step 2 hazırlık ve kontrol akışı optimize edilerek bekleme süresi minimuma indirildi.

### v10.2
- **🎛️ 3 Satırlı Gelişmiş Multi-Filtre (AND Mantığı):**
  - **1. Satır (Akış):** `Tümü`, `🐞 Debug Logs`, `🎯 Trace Logs`
  - **2. Satır (Kapsam):** `Tümü`, `📤 Giden İstekler`, `📥 Gelen Yanıtlar` (AJAX istekleri ile gelen yanıtlar bağımsız olarak filtrelenebilir).
  - **3. Satır (Seviye):** `Tümü`, `ℹ️ Info`, `⚠️ Warning`, `❌ Error`
- **💾 Logları Çıkar (.txt Dışa Aktarma):** Ekranda filtrelenmiş logları doğrudan `LuckyStrike_logs_YYYY-MM-DD_HH-mm-ss.txt` olarak masaüstüne kaydeden dosya kaydetme diyaloğu eklendi.
- **🧹 Filtreye Duyarlı Kopyalama ve Temizleme:**
  - `📋 Logları Kopyala`: Yalnızca seçili filtrelere uyan logları panoya kopyalar.
  - `🗑️ Logları Temizle`: Filtrelenen logları seçici olarak temizler.

### v10.1
- **🎯 Trace Logs (Kullanıcı Eylem & Oyun Yanıt Takibi):** Kullanıcının nereye geçtiğini, neye tıkladığını (gemi, buton, menü, gezegen), basılan tuşları (Space, Enter), form değişikliklerini ve OGame'den dönen tüm bildirim ve sunucu yanıtlarını anbean kaydeden kullanıcı akış takipçisi eklendi.
- **🐞 Debug Logs & Trace Logs Ayrımı:**
  - Sadece **Debug Logs** açıkken: Yalnızca uyarı ve hata kayıtları listelenir (sessiz mod).
  - Sadece **Trace Logs** açıkken: Yalnızca kullanıcının bastığı tuşlar, tıkladığı öğeler, sayfa geçişleri ve oyun yanıtları listelenir.
  - **İkisi de açıkken:** Tüm sistem logları ve kullanıcı akışı birleşik olarak gösterilir.

### v10.0
- **🐞 Canlı Debug & Hata Teşhis Sekmesi (Debug Tab):** Tüm sekmelerdeki eylemleri anbean kaydeden gelişmiş teşhis modülü eklendi.
- **💾 Sayfalar Arası Oturum Hafızası (`sessionStorage`):** Gezegenler veya sistemler arası geçişlerde sayfa yenilense bile oturum boyunca geçmiş adımlar korunur.

### v9.0
- **🧭 Keşif Asistanı (Expedition Assistant):** Spiral rota algoritması (+1, -1, +2, -2...) ile 16. slotlara rota dağıtımı, filo şablonlarını otomatik algılama ve uygulama, yüzen HUD banner'ı ve `Space` tuşu ile adım adım filo gönderimi.

### v8.0
- **📦 Maden Toplayıcı Asistanı (Resource Collector):** Tüm imparatorluk kolonilerinden tek bir hedef noktaya maden toplama, rezerv koruma, BN / KN / Rehber gemi dağılımı ve `Space` tuşu entegrasyonu.

### v7.1
- **🛡️ Oyun Kurallarına Tam Uyum:** Arka plan istekleri olmaksızın yalnızca oyuncunun aktif sayfa yenileme anlarında çalışan pasif mimari.
- **🌐 Çift Dil (TR/ENG) Desteği:** Türkçe ve İngilizce tam arayüz entegrasyonu.
