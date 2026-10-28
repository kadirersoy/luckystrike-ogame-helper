### [TR] Türkçe Sürüm Notları (v14.7)
- **⏱️ Yeni "KM Hesap" (Dark Matter Cost) Sekmesi:**
  - OGame Karanlık Madde ile süre yarılama ve anında tamamlama maliyetlerini hatasız hesaplayan yeni ergonomik hesaplayıcı aracı eklendi.
  - Oyun motorunun tavan kurallarına göre 2 resmi kategori tanımlandı:
    1. **İnşaat, Filo ve Savunma:** Kaynak binaları, tesisler, ay yapıları, canlı türü binaları, filo ve savunma üretimleri (Maksimum 48 saat / Sabit 72.000 KM yarılama, 144.000 KM tamamlama).
    2. **Araştırmalar:** Laboratuvar araştırmaları ve canlı türü araştırmaları (Maksimum 72 saat / Sabit 108.000 KM yarılama, 216.000 KM tamamlama).
  - Gün, Saat, Dakika, Saniye alanları, serbest metin yapıştırma (Örn: `15g 4s`, `14:30:00`) ve hazır süre butonları entegre edildi.
  - Sade, temiz ve profesyonel arayüz dili; gereksiz parantez ve karmaşık metinler ayıklanarak TR ve ENG sürümlerinde optimize edildi.
- **🛡️ Ses Altyapısı & Autoplay Guard:**
  - `AudioContext` başlatımı `navigator.userActivation.hasBeenActive` korumasıyla güvene alındı; Chrome/Edge eklentiler sayfasındaki gereksiz otomatik oynatma uyarıları giderildi.
- **🛡️ Önbellek & Durum Gösterge Kararlılığı:**
  - Evren ve oyuncu önbellek durum raporlayıcıları sayısal kontrol ve hata yakalama katmanları ile daha kararlı hale getirildi.

---

### [ENG] English Release Notes (v14.7)
- **⏱️ New "DM Cost" (Dark Matter Halving & Completion) Tab:**
  - Integrated an ergonomic Dark Matter calculator to accurately project halving and instant completion costs for all game projects.
  - Fully modeled according to official OGame game mechanics in 2 strict categories:
    1. **Construction, Fleet & Defense:** Resource buildings, facilities, moon structures, lifeform buildings, fleet and defense queues (Max 48h / Flat 72,000 DM halve, 144,000 DM finish).
    2. **Research:** Laboratory research and lifeform tech tree (Max 72h / Flat 108,000 DM halve, 216,000 DM finish).
  - Flexible duration inputs (Day, Hour, Min, Sec), free-form text paste parser (e.g. `15d 4h`, `14:30:00`), and quick-preset duration chips.
  - Minimalist, punchy, professional UI terminology across both English and Turkish without bloated parenthetical text.
- **🛡️ Audio Subsystem & Autoplay Guard:**
  - Hardened `AudioContext` initialization with `navigator.userActivation.hasBeenActive` guard, eliminating Chrome/Edge autoplay policy violation warnings.
- **🛡️ Cache & Status Display Resilience:**
  - Fortified universe and player cache status reporters with safe number parsing and error guards.
