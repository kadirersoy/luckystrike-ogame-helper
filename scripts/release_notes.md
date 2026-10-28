### [TR] Türkçe Sürüm Notları (v14.6)
- **🚀 Kararlı Filo Gönderim Mimarisi (v14.3) Yeniden Sağlandı:**
  Keşif, Maliyet Sepeti, Toplayıcı ve Postacı asistanlarında ilk filodan sonraki filolara geçişi engelleyen ve filonun ilk adımda dönüp durmasına yol açan mantıksal gerilemeler tamamen giderildi.
- **🛡️ AJAX Prefilter & Tip Güvenliği:**
  `bridge.js` içerisindeki `$.ajaxPrefilter` kancasında yanıt verisinin türü (`typeof data === 'object'`) doğrulanarak, string tipindeki sunucu yanıtlarında oluşan ve OGame'in native yönlendirmesini kilitleyen `TypeError: Cannot use 'in' operator to search for 'redirectUrl'` hatası çözüldü.
- **⚡ Deterministik Kuyruk İlerlemesi & Döngü Önleme:**
  Filo gönderim tetiklendiğinde kuyruk indeksi (`session.currentIndex++`) gecikmeksizin ilerletilerek kaydedilir. OGame'in `#sendFleet` butonuna basıldıktan sonra butonu doğal olarak `.off` / `disabled` yapması durumunun asistan tarafından asılsız hata olarak algılanması ve ilk adımı sonsuz döngüye sokması engellendi.
- **🧭 Hata Tespiti Hassasiyeti (`hasVisibleMissionError`):**
  Görev hata tespit mekanizması, DOM'da var olan pasif `.error` sınıflarından etkilenmeyecek şekilde kararlı hale getirilerek yalnızca ekranda görünür ve gerçek hata metinlerine (`Bu görevi başlatamazsın`) tepki verecek şekilde düzenlendi.
- **⏱️ 1200ms Güvenlik Yedeği Fallback:**
  Filo gönderiminin ardından OGame'in native yönlendirmesi herhangi bir ağ gecikmesi sebebiyle devreye girmezse, 1200ms'lik güvenlik yedeği devreye girerek bir sonraki hedef sayfaya geçişi kusursuz biçimde tamamlar.
- **📜 Oyun Kurallarına Tam Uyum & Hesaplama Asistanı:**
  Gameforge kurallarına %100 uyumlu ergonomik hesaplayıcı ve arayüz yardımcısı mimarisi korunmaktadır. Tüm işlemler oyuncu denetiminde ve insan hızında (`Space` tuşu veya buton) yürütülür; hiçbir arka plan otomasyonu veya bot mekanizması barındırmaz.

---

### [ENG] English Release Notes (v14.6)
- **🚀 Restoration of the Stable Fleet Dispatch Architecture (v14.3):**
  Resolved the regression where expeditions and fleet assistants would hang or loop on the first fleet without advancing to subsequent targets.
- **🛡️ AJAX Prefilter & Type-Safe Callback Handling:**
  In `bridge.js`, hardened `$.ajaxPrefilter` to verify `typeof data === 'object'` before inspecting response properties, preventing unhandled `TypeError` exceptions on string payloads that previously blocked OGame's native redirect execution.
- **⚡ Deterministic Queue Advancement & Loop Prevention:**
  Restored immediate queue progression (`session.currentIndex++`) at the moment of dispatch. Fixed the issue where OGame naturally disabling `#sendFleet` post-click was incorrectly interpreted as a dispatch failure, causing endless step 1 retries.
- **🧭 Mission Error Detection Refinement (`hasVisibleMissionError`):**
  Eliminated false-positive error triggers caused by idle `.error` classes in the DOM; now strictly verifies visible and actionable game error notices (`Bu görevi başlatamazsın`).
- **⏱️ 1200ms Safety Fallback Navigation:**
  Maintained the deterministic 1200ms fallback redirect timer to ensure smooth transition to the next destination if OGame's AJAX redirect experiences network delays.
- **📜 100% Fair-Play & Rules Compliance:**
  Strictly preserves the player-driven ergonomics and calculation model. Zero background automation, zero unattended bots — all actions remain strictly supervised by the player at human speed (`Space` key or click).
