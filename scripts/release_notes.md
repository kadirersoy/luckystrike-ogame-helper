### [TR] Türkçe Sürüm Notları (v15.1)
- **🛡️ %100 Pasif Tehdit İzleme & Sıfır Sunucu İsteği (Sıfır Ban Riski):**
  - Eklentinin arka planda otomatik olarak OGame sunucusuna `component=eventList` isteği atması tamamen engellendi.
  - Artık sunucuya hiçbir arka plan sorgusu veya yapay istek gönderilmez; alarm motoru yalnızca OGame'in kendi doğal AJAX olay yanıtlarını (`LS_EVENT_LIST_RECEIVED`) ve sayfa üstündeki `#attack_alert` göstergesini pasif olarak dinler.
  - İhtiyaç halinde manuel tetikleme için korumalı (5 saniye cooldown'lu) `🔄 Yenile` butonu eklendi.
- **🔇 Kalıcı Uçuş İmzası & Kararlı Susturma (Alarm Sıfırlanma Sorunu Giderildi):**
  - OGame olay kutusu kapalıyken veya sayfalar/galaksiler arasında gezinirken anlık DOM boşlukları nedeniyle susturulan saldırıların hafızadan silinmesi ve alarmın yeniden çalması sorunu giderildi.
  - Her saldırı hem benzersiz görev ID'si hem de kalkış, hedef, görev tipi ve varış zaman damgasını barındıran kalıcı uçuş imzası (`origin_target_mission_arrival`) ile çift anahtarlı olarak takip edilir.
  - Susturulan bir saldırı, filolar çarpışana veya varış süresi dolana kadar sayfa yenilense bile ASLA yeniden çalmaz.
- **⚔️ Saldıran Oyuncu ve Kaynak Gezegen Ayrımı:**
  - Saldırı kartlarında **Saldıran Oyuncu Adı** ile **Kaynak Gezegen Adı** birbirinden ayrıldı. Evren önbelleği (`universe.xml`) üzerinden aynı oyuncunun farklı gezegenlerinden gelen saldırıları tespit etmek kolaylaştırıldı.
  - **🎯 Saldıran Butonu:** Saldıranın koordinatını aktif gezegeninizi değiştirmeden Galaksi ekranında açar.
  - **🛡️ Savunan Butonu:** Saldırıya uğrayan gezegeninizin doğrudan Filo Gönderim (`fleetdispatch`) ekranına zıplar.
  - **🔇 Buton Erişilebilirliği:** Susturulan saldırılarda butonlar kilitlenmez, tıklanabilir kalır.

---

### [ENG] English Release Notes (v15.1)
- **🛡️ 100% Passive Threat Telemetry & Zero Server Polling (Zero Ban Risk):**
  - Completely purged automated background network requests (`component=eventList`) to OGame servers.
  - The extension never issues automated background queries; it exclusively and passively listens to OGame's own native AJAX responses (`LS_EVENT_LIST_RECEIVED`) and the in-game `#attack_alert` DOM indicator.
  - Added a safeguarded manual `🔄 Refresh` button with a 5-second cooldown to prevent request spamming.
- **🔇 Persistent Flight Signatures & Reliable Mute (Alarm Reset Bug Resolved):**
  - Fixed an issue where collapsed event tables or DOM reflows during galaxy browsing caused muted attacks to momentarily clear and re-trigger alarm sirens.
  - Attacks are now tracked with a dual-key immutable flight signature (`origin_target_mission_arrival` + flight ID), maintaining muted status across page transitions and reloads.
  - A muted attack remains permanently silenced until arrival time lapses or battle resolution occurs.
- **⚔️ Attacker Player & Origin Planet Separation:**
  - Distinctly separated **Attacker Player Name** from **Origin Planet Name** on every threat card using universe cache (`universe.xml`).
  - **🎯 Attacker Button:** Opens attacker's coordinates in Galaxy view without altering your currently active planet.
  - **🛡️ Defender Button:** Jumps directly to the attacked planet's Fleet dispatch (`fleetdispatch`) screen.
  - **🔇 Persistent Controls:** Muted attack cards keep both action buttons fully interactive.
