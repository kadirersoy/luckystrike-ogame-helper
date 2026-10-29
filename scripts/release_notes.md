### [TR] Türkçe Sürüm Notları (v15.2)
- **🪐 Toplayıcı: Gezegen & Aya Özel Görev Butonları (Maliyet Formatı):**
  - Maliyet sekmesindeki ergonomi Toplayıcı'ya uyarlandı; her gezegen ve ay satırının yanına bireysel **[ Nakliye ]** ve **[ Konuşlandır ]** butonları eklendi.
  - **Paralel & Bağımsız Seçim**: Üst paneldeki ana görev butonları değiştirildiğinde tüm liste paralel güncellenir; istenirse satırlardaki butonlarla belirli gezegen veya aya özel görev seçilebilir.
- **⚡ Toplayıcı: Genel Deu Rezerv Girişi ve Eşitleme Butonu:**
  - Tıpkı Postacı modülünde olduğu gibi, Toplayıcı sekmesine üst genel **"🛡️ Deu Rezerv"** giriş kutusu ve **"⚡ Eşitle"** butonu eklendi.
  - Eşitle butonu (veya Enter tuşu), girilen rezerv miktarını **yalnızca seçili olan gezegen ve aylara** tek tıkla uygular; seçili olmayan kolonilerin özel rezervlerine dokunmaz.
  - `250k`, `500k`, `1m` gibi metin kısaltmaları desteklenir ve girilen genel rezerv ayarı oturumlar arasında hatırlanır.
- **🛡️ Yakıt Korumalı Net Deuterium Rezervi (Rezervin Erimesi Engellendi):**
  - Filonun uçuş sırasında yakacağı gidiş yakıtı korunacak rezerve dahil edildi:
    $$\text{Taşınacak Deu} = \max(0, \text{Mevcut Deu} - (\text{Rezerv} + \text{Uçuş Yakıtı}))$$
  - Filo 2 adımında OGame'in hesapladığı canlı yakıt tüketimi (`consumption`) anında okunarak kargo ambarı milimetrik olarak doldurulur.
  - Filo havalandığında OGame yakıtı çektiğinde, gezegende **kuruşu kuruşuna tam olarak belirlediğiniz rezerv (örn: 250.000)** kalır; rezervin 249.8K veya 242K gibi değerlere düşmesi tamamen önlendi.
- **⏭️ Madensiz / Rezerv Altı Kolonileri Otomatik Atlama (Smart Skip):**
  - Seçilen kaynaklar açısından taşınacak hiçbir madeni olmayan (Metal: 0, Kristal: 0 ve Deu <= Rezerv + Yakıt) gezegen ve aylar otomatik algılanır; boşuna filo kaldırılıp yakıt yakarak rezerv eritilmez, adım doğrudan bir sonraki hedefe atlatılır.

---

### [ENG] English Release Notes (v15.2)
- **🪐 Collector: Per-Colony Mission Toggles (Cart/Cost Style):**
  - Added individual **[ Transport ]** and **[ Deploy ]** buttons to every planet and moon row in the Collector tab, matching the Cart workflow.
  - **Parallel & Independent Control**: Toggling the top mission buttons updates all colonies simultaneously; individual row buttons allow overriding the mission per planet or moon.
- **⚡ Collector: Global Deut Reserve Input & Equalize Button:**
  - Added a global **"🛡️ Deut Reserve"** input box and **"⚡ Equalize"** button to the Resource Collector tab, mirroring Courier ergonomics.
  - Clicking Equalize (or pressing Enter) applies the specified reserve amount **exclusively to currently selected planets and moons**, preserving custom values on unselected colonies.
  - Supports numeric shortcuts like `250k`, `500k`, `1m` and persists the global reserve setting across sessions.
- **🛡️ Fuel-Aware Net Deuterium Reserve Protection:**
  - Flight fuel consumption is now factored into the protected reserve formula:
    $$\text{Collectible Deut} = \max(0, \text{Live Deut} - (\text{Reserve} + \text{Flight Fuel}))$$
  - Reads OGame's real-time calculated flight consumption during Fleet Step 2 to dynamically adjust cargo payload.
  - Once the fleet launches and consumes fuel, **exactly your desired reserve (e.g. 250,000)** remains on the colony—preventing reserve erosion to 249.8K or lower.
- **⏭️ Zero-Cargo Smart Skip:**
  - Colonies with zero collectible resources (Metal: 0, Crystal: 0, and Deut <= Reserve + Fuel) are automatically skipped, avoiding pointless fleet launches and fuel waste.
