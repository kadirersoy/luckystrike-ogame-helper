### [TR] Türkçe Sürüm Notları (v15.3)
- **📡 Casusluk Alarmı Ses Düzeltmesi (Espionage Sound Fix):**
  - OGame'in genel düşman başlığı (`#js_eventHeaderBox.hostile`) casus sondası geldiğinde devreye girdiğinde sistemi hatalı olarak "Saldırı Tehdidi" zannetmesine ve listede saldırı gemisi bulunmadığı için alarmı yanlışlıkla sessize almasına yol açan mantık hatası tamamen giderildi.
  - Gelen casus sondalarında seçili Sonar sesleri (Derin Deniz Sonarı, Aktif Avcı Sonarı, Taktik Yankı) artık milisaniyesinde ve kararlı şekilde çalmaktadır.
- **🛡️ Bağımsız Casusluk & Saldırı Yönetimi (Independent Threat Pipeline):**
  - Saldırı alarmları ile Casusluk alarmları birbirinden bağımsız iki ayrı sinir hattına ayrıldı; bir tehdidin durumu veya susturulması diğerini asla engellemez.
  - Tıpkı saldırılarda olduğu gibi, her casusluk görevi de liste üzerinde bireysel kart olarak görünür ve bağımsız olarak "🔇 Sustur" butonuna basılarak sessize alınabilir.
- **🛰️ Uzun Süreli Casusluklarda Yeni Tehdit Koruması (Anti-Masking):**
  - Casus sondasının yanına Ölüm Yıldızı (RIP) veya yavaş gemi eklenerek saatler/günler sürecek şekilde atılan casusluk görevleri susturulduğunda, aradan gelecek yeni casus sondaları kesinlikle gözden kaçmaz; yeni her casusluk aktivitesi için alarm bağımsız olarak yeniden tetiklenir.
  - Casusluk kartları ve listesi taktik mavi arayüz (`#3498db`) ve `SONDA` rozeti ile gelen saldırılardan görsel olarak ayrıştırıldı.

---

### [ENG] English Release Notes (v15.3)
- **📡 Espionage Alarm Sound Fix:**
  - Resolved an issue where OGame's general hostile header (`#js_eventHeaderBox.hostile`) falsely triggered the attack pipeline for spy probes, inadvertently muting the audio because no attack warships were present.
  - Sonar sounds (Deep Sea Sonar, Active Hunter Sonar, Tactical Echo) now play instantly and reliably whenever espionage probes approach.
- **🛡️ Independent Attack & Espionage Threat Pipeline:**
  - Attack alarms and Espionage alarms now operate as separate, isolated channels; muting or triggering one never suppresses or interferes with the other.
  - Every espionage event is displayed as an individual card with its own coordinates, player info, and "🔇 Silence" toggle.
- **🛰️ Slow/Long Espionage Anti-Masking Protection:**
  - When an espionage mission paired with slow ships (such as Deathstars / RIPs lasting hours or days) is muted, new incoming spy probes are not masked or silenced; any new probe arrival generates a fresh threat signature and triggers the alarm sound independently.
  - Espionage cards and badges are rendered in a distinct tactical blue theme (`#3498db`) with `PROBE` badges to separate them cleanly from real attacks.
