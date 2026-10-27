### 🇹🇷 Türkçe Sürüm Notları (v14.5)
- **🛡️ Pasif Gönder Butonu (`.off` / `.disabled`) Koruması:**
  Keşif, Toplayıcı, Postacı ve Maliyet Sepeti asistanlarında gönderim öncesi `#sendFleet` butonunun durumu `isSendFleetReady()` ile doğrulanır. Filo veya keşif slot limiti aşıldığında oyun butonunun `.off` / `disabled` olması durumunda butonun hazır zannedilip gereksiz gönderim tetiklenmesi ve asistanın donup kalması kesin olarak engellendi.
- **🧭 Keşif Slot Tespiti & Yapısal Fallback Güçlendirmesi:**
  `getExpeditionSlotsInfo` ve `getFleetSlotsInfo` regex'leri esnek (`:?`) hale getirildi ve çoklu dil (İspanyolca, İtalyanca, Lehçe vb.) desteği eklendi. Metin analizi yetersiz kalsa bile `#slots` DOM elemanı altındaki slot çiftlerini doğrudan ayrıştıran yapısal fallback eklendi. OGame AJAX ve DOM hazır olma anlarında (`$(document).ready` ve `ajaxComplete`) slot verisinin anında senkronize edilmesi sağlandı (sunucuya sıfır ek ağ yükü, %100 pasif okuma).
- **⏱️ Fallback Zaman Aşımı ve Güvenli Durum Doğrulaması:**
  Fallback süresi gerçek sunucu gecikmelerine tolerans sağlayacak şekilde 3500ms'ye çıkarıldı. Yanıt geciktiğinde asistan körü körüne başarı varsaymak yerine butonun aktifliğini denetler; buton pasif ise güvenli hata durumuna geçer.
- **⚡ Çift Gönderim Koruması Bildirimi:**
  `bridge.js` çift tıklama korumasını tetiklediğinde `content.js`'e `LS_SEND_FLEET_COMPLETE` hatası ileterek asistanın askıda kalmasını engeller.
- **🧠 Açılır Menü Dinleyici Sızıntısı Temizliği:**
  Toplayıcı, Postacı ve Maliyet Sepeti panellerinde açılır menü dış tıklama dinleyicileri tekilleştirilerek (`hasOutsideClick`) gereksiz bellek birikimi önlendi.
- **📬 Postacı Asistanı 15 Dakika Zaman Aşımı Güvencesi:**
  Postacı asistanına diğer asistanlardaki gibi 15 dakikalık oturum zaman aşımı koruması eklenerek eski oturumların istenmeyen anlarda çalışması engellendi.
- **🌐 Eksiksiz Dil Bütünlüğü & i18n Düzeltmeleri:**
  Manuel koordinat istemleri, asistan tamamlanma ve durdurulma bildirimleri `I18N.tr` ve `I18N.en` sözlüklerine eklenerek çift dilli uyumluluk %100 sağlandı.
- **📜 Oyun Kurallarına Tam Uyum & Hesaplama Asistanı Vurgusu:**
  Eklentinin felsefesi ve teknik dokümantasyonu; hiçbir tam otomasyon veya arka plan bot mekanizması barındırmayan, yalnızca oyuncu başındayken girdi hesaplama (kargo kapasitesi, koordinat, maliyet tablosu) ve tek tuşla insan hızında manuel onay (`Space`) sağlayan bir QoL (Yaşam Kalitesi) hesaplayıcısı ve arayüz asistanı olarak netleştirildi. Şaibeli ifadeler temizlendi.

---

### 🇬🇧 English Release Notes (v14.5)
- **🛡️ Disabled Send Button (`.off` / `.disabled`) Guard:**
  Pre-flight checks now strictly verify `#sendFleet` readiness using `isSendFleetReady()` across Expedition, Collector, Courier, and Cost Cart. When fleet or expedition slot limits are reached and OGame marks the button `.off` / `disabled`, false dispatches and UI freezes are prevented.
- **🧭 Robust Expedition Slot Detection & Structural Fallback:**
  Regex matching for `getExpeditionSlotsInfo` and `getFleetSlotsInfo` has been made flexible (`:?`) with multi-language coverage (Spanish, Italian, Polish, etc.). Added a structural fallback that directly parses numeric pairs inside `#slots` elements. Slot metadata is passively synchronized on DOM ready and OGame `ajaxComplete` events without additional network requests.
- **⏱️ Safe Fallback Timeout Inspection:**
  Increased fallback timeout to 3500ms to tolerate authentic server latency. If the server response is delayed, the helper no longer assumes false success; it inspects button state and gracefully enters a retryable failure state if the button remains disabled.
- **⚡ Double Submit Event Feedback:**
  When `bridge.js` suppresses rapid consecutive submits, it now dispatches `LS_SEND_FLEET_COMPLETE` with error details to keep assistant banners informed instead of hanging.
- **🧠 Dropdown Outside-Click Memory Leak Fix:**
  Outside-click document listeners in Collector, Courier, and Cart dropdown menus are now unified via a single attachment flag (`hasOutsideClick`), preventing listener accumulation across renders.
- **📬 Courier 15-Minute Session Expiry:**
  Added the standard 15-minute `startedAt` session expiration guard to Courier assistant to safely clear orphaned sessions.
- **🌐 Full i18n Symmetry:**
  Added missing prompt labels and notification toasts to `I18N.tr` and `I18N.en` dictionaries for 100% bilingual parity.
- **📜 Fair-Play Rules Compliance & Calculator Refinement:**
  Refined extension messaging and documentation to emphasize its role as a 100% rules-compliant Quality-of-Life calculation assistant and ergonomic interface helper. Clarified that no unattended automation or background bots exist; every dispatch is manually triggered at human speed by the player (`Space`), with the tool solely assisting with capacity, resource, and coordinate calculations.
