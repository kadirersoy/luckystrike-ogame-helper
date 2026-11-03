### [TR] Türkçe Sürüm Notları (v16.2)
- **⛽ Gezegen Döteryum Yetersizliği & Dinamik Hız Ayarı Desteği:**
  - Filo gönderiminde gereken uçuş yakıtı ve kargo döteryumu toplamının gezegendeki mevcut döteryumu aştığı durumlar (`consumption + cargoDeu > liveDeuterium`) tespit edildiğinde ekranın `⚠️ Hedefi Tekrar Dene` uyarısında takılı kalması sorunu kökten çözüldü.
  - HUD banner'ı anında turuncu `⚠️ Hızı Ayarla & Gönder (Space)` butonuna geçer ve tam döteryum farkını gösteren açıklama metnini yayınlar:
    `⚠️ Uçuş yakıtı yetersiz! (Gereken: {fuel} Deu, Mevcut: {avail} Deu). Lütfen sayfadan uçuş hızını (%10-%90) düşürün, hedefi atlayın ya da görevi iptal edin.`
  - Kullanıcı OGame sayfasından uçuş hızını düşürdüğünde (%10 - %90), gereken yakıt gezegendeki döteryum miktarına indiği anda buton otomatik olarak tekrar yeşil `🚀 Filoyu Gönder (Space)` hazır durumuna döner ve açıklama metni gizlenir.
  - Yetersiz yakıt durumundayken butona tıklanması veya `Space` tuşuna basılması güvenle engellenerek kullanıcıya detaylı toast uyarısı sunulur.
  - Toplayıcı (Collector), Postacı (Courier) ve Maliyet Sepeti (Cart) akışlarının tamamında hazırlık ve gönderim kontrolleri eşitlendi.
- **⚡ Anlık Tüketim & Dispatcher Reaktivitesi:**
  - Sayfadaki hız yüzdesi tıklamalarında `#consumption` elementi doğrudan ve öncelikli okunarak 0 gecikmeyle arayüze yansıtılması sağlandı.
  - `bridge.js` periyodik senkronizasyon aralığı 800ms'den 300ms'ye indirildi ve hız yüzdesi tıklamalarına 30ms, 100ms ve 250ms tetikleyicileri eklendi.

---

### [ENG] English Release Notes (v16.2)
- **⛽ Planet Deuterium Shortage & Dynamic Speed Adjustment Support:**
  - Resolved an issue where insufficient flight deuterium fuel on the planet (`consumption + cargoDeu > liveDeuterium`) caused the HUD to get stuck on `⚠️ Retry Target` with an empty reason text.
  - The HUD banner now immediately switches to `⚠️ Adjust Speed & Send (Space)` and displays an informative explanation with exact amounts:
    `⚠️ Insufficient flight fuel! (Required: {fuel} Deu, Available: {avail} Deu). Please lower flight speed (10%-90%) below, skip target, or cancel.`
  - When the user lowers flight speed on the OGame page (10% - 90%) and required fuel falls within available deuterium, the button automatically turns green and ready (`🚀 Send Fleet (Space)`).
  - Clicking or pressing Space while fuel is insufficient is safely prevented with an informative toast warning.
  - Readiness and dispatch guards unified across Collector, Courier, and Cost Cart.
- **⚡ Instant Fuel Consumption & Dispatcher Reactivity:**
  - DOM `#consumption` element is now read with priority, enabling instant reactivity upon speed percentage clicks.
  - `bridge.js` dispatcher state sync reduced from 800ms to 300ms, with 30ms, 100ms, and 250ms click triggers.

---

### [TR] Türkçe Sürüm Notları (v16.1)
- **⛽ Yakıt Tüketim Ambar Aşımı (Fuel Overload) Koruması & Yönetimi:**
  - Özellikle uzun menzilli uçuşlarda Casus Sondası gibi düşük kargo kapasiteli filoların yakıt gereksinimi toplam ambarı aştığında (`consumption > cargoSpace`, örn: `%103`) gönderim kilitlenerek hatalı filo çıkışı engellendi.
  - Asistan HUD banner'ı bu durumlarda turuncu `⚠️ Hızı Ayarla & Gönder (Space)` butonuna ve bilgilendirici açıklama metnine geçer.
  - Kullanıcı OGame sayfasından uçuş hızını düşürüp (`%10` - `%90`) yakıt tüketimi ambar kapasitesine uygun hale geldiğinde, buton otomatik olarak tekrar yeşil `🚀 Filoyu Gönder (Space)` hazır durumuna döner.
  - Tüketim aşımı durumunda butona basılması veya Space tuşuna basılması engellenerek kullanıcıya toast uyarı bildirimi gösterilir; hedefi atlama (`⏭️ Atla`) veya görevi durdurma (`⏹️ İptal`) seçenekleri sunulur.
  - Hız yüzdesi tıklamalarında `bridge.js` üzerinden anlık 50ms ve 200ms dispatcher senkronizasyonu sağlandı.
- **🎯 Seçili Gemi Tipine Göre Dinamik "Gemi Yok" Uyarısı:**
  - Uyarı mesajı kullanıcının seçtiği gemi tipine duyarlı hale getirildi:
    - Yalnızca Casus Sondası seçiliyse: `⚠️ Sonda yok!`
    - Yalnızca Rehber seçiliyse: `⚠️ Rehber yok!`
    - Yalnızca Muharip Gemiler seçiliyse: `⚠️ Muharip gemi yok!`
    - Büyük/Küçük Nakliye seçiliyse: `⚠️ Nakliye gemisi yok!`
    - Hiçbiri seçili değilse: `⚠️ Seçili gemi yok!`
  - Çok düşük kargo kapasitesine sahip gemiler (Casus Sondası vb.) seçildiğinde kargo kapasitesi 0 olsa bile gemilerin varlığı doğru algılanacak şekilde `hasShips` mantığı Toplayıcı, Postacı ve Maliyet Sepeti genelinde eşitlendi.
- **🛒 Maliyet Sepeti (Cart) Sevkiyat İyileştirmeleri:**
  - Sepet dağıtımında `sonda` ve diğer muharip gemilerin kargo özet metnine (`shipDesc`) dahil edilmesi sağlandı.
  - `isAllShips` modu aktifken oluşabilecek değişken kapsamı referans hatası giderildi.
  - Sepette gemi bulunmadığında doğrudan atlama (`⏭️ Atla (Space)`) akışı ve yetersiz kaynak/gemi uyarıları normalize edildi.

---

### [ENG] English Release Notes (v16.1)
- **⛽ Fuel Consumption Overload Protection & Speed Management:**
  - Prevented dispatch errors when high-distance probe flights require more deuterium fuel than available cargo capacity (`consumption > cargoSpace`, e.g. `103%`).
  - The assistant HUD banner automatically updates to `⚠️ Adjust Speed & Send (Space)` along with clear guidance to lower flight speed.
  - When the player manually lowers flight speed on the OGame page (`10%` - `90%`) and fuel consumption drops to `<= 100%`, the button automatically turns green and ready (`🚀 Send Fleet (Space)`).
  - Clicking or pressing Space while overloaded is blocked with a helpful toast message; skipping (`⏭️ Skip`) or canceling (`⏹️ Cancel`) remains readily available.
  - Added instant 50ms and 200ms dispatcher state sync upon speed percentage clicks via `bridge.js`.
- **🎯 Contextual "No Ships" Warning Based on Ship Selection:**
  - Contextualized warning alerts matching the active ship preferences:
    - Only Spy Probes selected: `⚠️ No probes available!`
    - Only Pathfinders selected: `⚠️ No pathfinders available!`
    - Only Combat ships selected: `⚠️ No combat ships available!`
    - Transports selected: `⚠️ No cargo ships available!`
    - No ships selected: `⚠️ No selected ships available!`
  - Probes with minimal cargo capacity are correctly recognized as valid ships (`hasShips`), preventing false "No cargo ships" states across Collector, Courier, and Cart.
- **🛒 Cost Cart Delivery Enhancements:**
  - Added Spy Probes and combat ships to the Cart HUD fleet summary (`shipDesc`).
  - Fixed block-scoped variable resolution under `isAllShips` mode.
  - Normalized warning banners and Spacebar skip flow when no ships match criteria.
