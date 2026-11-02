### [TR] Türkçe Sürüm Notları (v16.0)
- **📦 Maden Toplayıcı Rezerv ve Yükleme Motoru Güçlendirildi:**
  - Rezerv okuma mimarisi normalize edildi (`parseRezVal` & `parseOgNum`); string, sayı veya nesne formatlarındaki rezerv değerlerinin `NaN` üretmesi ve kargo kutularının boş (0) kalması hatası tamamen giderildi.
  - Step 2 aşamasında canlı ambar kapasitesi doğrudan DOM ve dispatcher üzerinden okunarak dinamik ambar boyutu her adımda hatasız senkronize edildi.
  - HUD banner'ında Metal, Kristal ve Deuterium taşınan miktarları ve korunan rezerv etiketi canlı olarak eksiksiz gösterilecek şekilde güncellendi.
- **🛡️ Konuşlandır Görevi ve Madensiz Gezegen Mantığı İyileştirildi:**
  - Görev "Konuşlandır" (Mission 4) olduğunda veya "Tümü" seçildiğinde, maden olmasa dahi filonun konuşlandırılması hedeflendiğinden `hasNoCargo` kısıtlaması devre dışı bırakıldı; filo gönderme butonu ve Space tetikleyicisi daima aktif tutuldu.
  - Sayfa yüklenirken gemi stoklarının DOM'a geç gelmesinden ötürü filonun "yok" sanılıp adımların atlanması engellendi.
  - Gezegen/ay geçişlerinde kazara peş peşe Space tuşuna basılıp hedeflerin pas geçilmesini önlemek amacıyla 500ms Space cooldown / debounce koruması getirildi.
- **📬 Postacı ve 🛒 Sepet Dağıtım İyileştirmeleri:**
  - **Çift Fonksiyonlu Dağıtım Alanı:** Dağıtım kutucuğu işaretli değilken `⚡ Eşitle` ile tutarlar seçili tüm hedeflere doğrudan atanır; işaretliyken ise hedeflerin kendi özel girilmiş tutarlarının üzerine ek pay (`+Ek Dağıtım`) olarak dinamik eklenir ve sevkiyatta toplam tutar sevk edilir.
  - Her koloninin kendi seçili görevi (Nakliye `3` / Konuşlandır `4`) bir sonraki hedef URL'sine tam olarak aktarıldı.
  - Sonda ve muharip gemilerin akıllı filo hesabında tam desteklenmesi sağlandı.
- **🎨 Tasarım ve Tema Uyumu (Fenerbahçe & Dark Mod):**
  - Fenerbahçe temasında `🔄 Yenile` butonları sarı zemin üzerine lacivert metin/ikon (`#ffd700` / `#001736`) olarak standardize edildi; cırtlak mavi tonlar giderildi.
  - Dark temada ve tüm temalarda `⚡ Eşitle / ➕ Ekle` ile `🔄 Yenile` butonları tema paletine tam uyumlu ve tutarlı hale getirildi.
  - `⚡ Tümü` butonunun aktifleştiğinde sağa taşması giderildi; genişlik ve padding dengelenerek simge ile metin ortalandı.
  - Kaynak sıralaması tüm arayüzde standart **Metal ➔ Kristal ➔ Deuterium** (`M · K · D`) sırasına hizalandı.

---

### [ENG] English Release Notes (v16.0)
- **📦 Resource Collector Reserve & Loading Engine Enhanced:**
  - Standardized reserve parsing logic (`parseRezVal` & `parseOgNum`), eliminating `NaN` calculations and preventing cargo inputs from remaining zero.
  - Added live cargo capacity fallback from DOM and fleet dispatcher in Step 2 for resilient ambar sizing.
  - Live HUD banner transport stats (Metal, Crystal, Deuterium, and Protected Reserve) now accurately reflect realtime values.
- **🛡️ Deploy Mission & Zero-Cargo Logic Fixed:**
  - When Deploy mission (4) or "All Ships" mode is selected, empty cargo no longer locks the dispatch button; fleet deployment proceeds normally even with zero transportable cargo.
  - Resolved timing race conditions where ship quantities were queried before DOM stocks finished rendering.
  - Added 500ms Spacebar cooldown upon step transitions to prevent accidental double-skips.
- **📬 Courier & 🛒 Cart Dispatch Synchronization:**
  - **Dual-Mode Distribution:** When unchecked, `⚡ Equalize` assigns values directly across selected targets; when checked, distribution values are dynamically added on top of target-specific custom values (`+Extra`) and dispatched combined.
  - Ensured each colony's specific mission selection (Transport vs Deploy) persists correctly across subsequent dispatch URLs.
  - Full support for combat ships and probes in automated fleet calculations.
- **🎨 UI & Theme Consistency (Fenerbahçe & Dark Mode):**
  - Standardized `🔄 Refresh` buttons in the Fenerbahçe theme with elegant yellow background and navy text (`#ffd700` / `#001736`), eliminating jarring contrast.
  - Ensured identical styling consistency for action and refresh buttons across all tabs and themes.
  - Fixed `⚡ All` button text clipping by increasing width and centering content.
  - Standardized resource ordering everywhere to **Metal ➔ Crystal ➔ Deuterium** (`M · C · D`).
