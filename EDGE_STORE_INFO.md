# Microsoft Edge Add-ons Store Bilgileri

Bu dosya, eklentinin Microsoft Edge Add-ons mağazasındaki kimlik ve yönetim bilgilerini içerir.

- **Partner Center Dashboard:**  
  https://partner.microsoft.com/en-us/dashboard/microsoftedge/e7589bd9-862f-4579-9dee-44bfcb520e9b/packages/dashboard

- **Product ID:**  
  `e7589bd9-862f-4579-9dee-44bfcb520e9b`

- **Store ID:**  
  `0RDCK9BGN0CR`

- **CRX ID:**  
  `omhgkgibbcgfcfdbdnlidoofkidagdad`

- **Olası Mağaza URL Formatı:**  
  `https://microsoftedge.microsoft.com/addons/detail/luckystrike-ogame-helper/omhgkgibbcgfcfdbdnlidoofkidagdad`  
  *(veya `.../detail/0RDCK9BGN0CR`)*

---

### Onay Sonrası Yapılacaklar Listesi (TODO):
1. [ ] **GitHub Actions Otomasyonu:**
   - Partner Center -> Publish API üzerinden Client ID ve Client Secret (API Key) alınacak.
   - GitHub Secrets alanına eklenecek.
   - `.github/workflows/publish-edge.yml` oluşturulup release anında otomatik Edge Store güncellemesi sağlanacak.
2. [ ] **README.md Güncellemesi:**
   - Edge Add-ons mağaza linki ve rozeti ("Get it from Microsoft Edge Store") README'ye eklenecek.
3. [ ] **GitHub Release Notları:**
   - Sonraki tüm release'lerde doğrudan Edge Store yükleme linki verilecek.
