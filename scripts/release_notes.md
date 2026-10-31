### [TR] Türkçe Sürüm Notları (v15.6)
- **🔊 Ses ve Alarm Çalma Düzeltmesi:**
  - AudioContext başlatılmasını engelleyen kullanıcı aktivasyonu kısıtlaması kaldırıldı. Sayfa yenilemelerinde ve arka plan sekmelerinde saldırı, casusluk ve harabe alarm seslerinin çalmaması giderildi.
- **🌌 Evren ve Oyuncu Verisi Depolama Güvencesi:**
  - Evren koordinatlarının önbelleğe yazılma sırası optimize edildi. Tarayıcı depolama kotasının aşılması durumunda evren koordinatlarının kaybolması önlendi ve eklenti yerel depolama desteği eklendi.
- **🔍 Galaksi Tarayıcı ve Oyuncu Arama Güvenliği:**
  - Giriş elemanlarının okunmasında güvenli referans kontrolleri eklenerek boş değer hataları engellendi.

---

### [ENG] English Release Notes (v15.6)
- **🔊 Sound and Threat Alarm Audio Fix:**
  - Removed user activation restriction blocking AudioContext initialization. Threat alarms now play reliably across page reloads and background tabs.
- **🌌 Universe & Player Data Storage Resilience:**
  - Prioritized universe coordinates cache writes before large player datasets. Prevented storage quota overflows from discarding universe data and added extension local storage support.
- **🔍 Galaxy Scanner & Player Finder Safety:**
  - Added safe optional chaining to input lookups to prevent null reference errors during early initialization.
