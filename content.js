(function() {
    'use strict';

    const LS = '[LS]';
    console.log(LS, 'LuckyStrike OGame Helper v13.1 yükleniyor...');

    // ============================================================
    // STORAGE KEYS & STATE
    // ============================================================
    const KEYS = {
        TAB: 'LS_ACTIVE_TAB',
        CART: 'LS_COST_CART',
        SCAN: 'LS_SCANNER_SETTINGS',
        POS: 'LS_PANEL_POS',
        SIZE: 'LS_PANEL_SIZE',
        OPEN: 'LS_PANEL_OPEN',
        API: 'LS_API_CACHE',
        ALARM: 'LS_ALARM_SETTINGS',
        DEBRIS_LIST: 'LS_DEBRIS_LIST',
        DEBRIS_SETTINGS: 'LS_DEBRIS_SETTINGS',
        TECH: 'LS_TECH_CACHE',
        AUTOLOAD: 'LS_FLEET_AUTOLOAD',
        COLLECTOR: 'LS_COLLECTOR_SETTINGS',
        COLLECTOR_RUN: 'LS_COLLECTOR_RUN',
        COURIER: 'LS_COURIER_SETTINGS',
        COURIER_RUN: 'LS_COURIER_RUN',
        PLANET_CACHE: 'LS_PLANET_CACHE',
        EXPEDITION: 'LS_EXPEDITION_SETTINGS',
        EXPEDITION_RUN: 'LS_EXPEDITION_RUN',
        EXPEDITION_TEMPLATES: 'LS_EXPEDITION_TEMPLATES',
        DEBUG_ENABLED: 'LS_DEBUG_ENABLED',
        DEBUG_LOGS: 'LS_DEBUG_LOGS',
        TRACE_ENABLED: 'LS_TRACE_ENABLED',
        TRACE_LOGS: 'LS_TRACE_LOGS',
        CART_SHIPS: 'LS_CART_SHIPS',
        CART_PLANET_PREFS: 'LS_CART_PLANET_PREFS',
        CART_ORIGIN: 'LS_CART_ORIGIN',
        CART_EXTRA_COST: 'LS_CART_EXTRA_COST',
        CART_QUEUE: 'LS_CART_QUEUE',
        UNIVERSE_CACHE: 'LS_UNIVERSE_CACHE',
        UNIVERSE_LAST_REFRESH: 'LS_UNIVERSE_LAST_REFRESH',
        LANG: 'LS_LANGUAGE',
        THEME: 'LS_THEME',
        OPACITY: 'LS_PANEL_OPACITY',
        HOVER_FOCUS: 'LS_HOVER_FOCUS'
    };

    // ============================================================
    // I18N / DİL YÖNETİMİ (TR & EN)
    // ============================================================
    let currentLang = localStorage.getItem('LS_LANGUAGE') || 'tr';

    const I18N = {
        tr: {
            // Tabs
            tab_cart: 'Maliyet',
            tab_collector: 'Toplayıcı',
            tab_courier: 'Postacı',
            tab_debris: 'Harabe',
            tab_expedition: 'Keşif',
            tab_scanner: 'Tarayıcı',
            tab_finder: 'Arama',
            tab_alarm: 'Alarm',
            tab_settings: 'Ayarlar',

            // Tab Tooltips (Hover 3s)
            tab_tip_title_cart: '🏗️ Maliyet Sepeti',
            tab_tip_desc_cart: 'Bina ve araştırma kademelerinin hammadde maliyetlerini sepete ekler, gezegendeki mevcut stoğu düşerek net açığı hesaplar ve gereken nakliye filosunu tek tuşla (Space) yola çıkarır.',
            tab_tip_title_collector: '📦 Maden Toplayıcı',
            tab_tip_desc_collector: 'İmparatorluğunuzdaki tüm gezegen ve aylarda biriken madenleri (deuterium rezervini koruyarak) tek bir merkeze otomatik kargo hesabı ve Space tuşu ile sıra sıra toplar.',
            tab_tip_title_courier: '📬 Postacı Asistanı',
            tab_tip_desc_courier: 'Seçilen merkezden diğer tüm kolonilerinize genel veya özel maden tutarlarını (Metal, Kristal, Deuterium) hızlıca paylaştırır ve tek tuşla sıra sıra sevk eder.',
            tab_tip_title_debris: '🛰️ Harabe Takipçisi',
            tab_tip_desc_debris: 'Galaksi sayfasında gezinirken ekrandaki ve 16. keşif slotundaki harabeleri otomatik listeler, gereken Geri Dönüşümcü (GD) sayısını hesaplar ve eşik üstü harabelerde sesle uyarır.',
            tab_tip_title_expedition: '🧭 Keşif Asistanı',
            tab_tip_desc_expedition: 'Başlangıç sisteminden spiral rota oluşturarak 16. slotlara keşif filoları hazırlar; kayıtlı filo şablonlarını otomatik yükleyip Space tuşu ile ardışık seferler düzenler.',
            tab_tip_title_scanner: '🌌 Galaxy Scanner',
            tab_tip_desc_scanner: 'Evren verilerini tarayarak belirlediğiniz slot kriterlerine (örn. Slot 8, Deut yuvaları) uyan boş sistem ve gezegen yerlerini tek tıkla listeler ve haritaya yönlendirir.',
            tab_tip_title_finder: '🔍 Player Finder',
            tab_tip_desc_finder: 'Oyuncu veya gezegen adına göre arama yaparak oyuncuların tüm kolonilerini, koordinatlarını ve ittifak bilgilerini tek ekranda haritalandırır.',
            tab_tip_title_alarm: '🚨 Tehdit Bildirimi',
            tab_tip_desc_alarm: 'Gezegenlerinize yönelik saldırı veya casus sondası tehditlerini ekran güncellendiğinde anında algılar; yüksek sesli alarm ve masaüstü bildirimiyle sizi uyarır.',
            tab_tip_title_settings: '⚙️ Ayarlar',
            tab_tip_desc_settings: 'Dil (TR / ENG), panel teması, saydamlık kaydırıcısı ve fare üzerine gelince tam görünürlük (Hover to Focus) gibi genel eklenti tercihlerini yönetir.',

            // Header
            header_title: 'LuckyStrike Helper',
            stop_alarm: '⏹️ Sustur',
            stop_alarm_title: 'Tekrarlayan bu alarmı sustur',

            // Cart Tab
            cart_sel_all: '☑️ Tümünü Seç',
            cart_sel_none: '◻️ Seçimi Temizle',
            cart_copy: '📋 Panoya Kopyala',
            cart_clear: '🗑️ Temizle',
            cart_empty: 'Sepet boş.<br><span style="font-size:10px;color:#555">Bina veya teknoloji detayından "Sepete Ekle" diyerek ekleyebilirsiniz.</span>',
            cart_copied: '✓ Kopyalandı!',
            cart_deploy: '🚀 Konuşlandır',
            cart_deploy_title: 'Konuşlandır: Hedefte kalır',
            cart_transport: '🚚 Nakliye',
            cart_transport_title: 'Nakliye: Boş geri döner',
            cart_net_deficit: 'Net İhtiyaç:',
            cart_cargo_needed: '🔴 Toplam Kargo:',
            cart_total: 'Toplam:',
            cart_deduct_planet: '📉 Bu Gezegenin Canlı Kaynağını Düş',
            cart_deduct_title: 'Şu an bu gezegendeyseniz eldeki kaynakları sepetten mahsup eder',
            cart_ships_sc: 'KN',
            cart_ships_lc: 'BN',
            cart_ships_pathfinder: 'Rehber',
            cart_ships_auto: 'Otomatik',
            cart_include_calc: 'Bu kalemi hesaplamaya dahil et',
            cart_include_batch: 'Toplu dağıtıma dahil et',
            cart_remove_item: 'Sepetten Kaldır',
            cart_remove_planet: 'Bu gezegenin tüm sepetini kaldır',
            cart_single_send: '⚡ Gönder',
            cart_single_send_title: 'Sadece bu gezegene filo gönder',
            cart_enough_res: 'Yeterli Kaynak Var ✓',
            cart_no_ships: 'Gemi seçilmedi',
            cart_grand_total: '📊 Seçili Gezegenler Genel Toplamı:',
            cart_metal: '🟡 Metal:',
            cart_crystal: '🔵 Kristal:',
            cart_deuterium: '🟢 Deuterium:',
            cart_ship_pref_hint: 'Gemi Tercihi (Öncelik: Rehber > KN > BN):',
            cart_extra_title: 'Ek Maliyet',
            cart_extra_hint: 'Aktif olduğunda girilen tutarlar gönderim yapılacak her bir seçili gezegen sepetine eklenir',
            cart_metal_ph: 'Metal',
            cart_crys_ph: 'Kristal',
            cart_deut_ph: 'Deu',
            cart_bulk_distribute: '⚡ SEÇİLİ GEZEGENLERE SIRAYLA DAĞIT',
            cart_copy_hint: 'Kopyala',
            cart_btn_add: 'Sepete Ekle',
            cart_stepper_down_title: 'Kademe azalt',
            cart_stepper_up_title: 'Kademe artır',

            // Collector Tab
            coll_target_head: '📍 Merkez',
            coll_here: 'Burası',
            coll_here_title: 'Hedefi şu an bulunduğunuz gezegen/ay yapar',
            coll_transport: 'Nakliye',
            coll_deploy: 'Konuşlandır',
            coll_ships: '🚀 Gemi',
            coll_bn: 'BN',
            coll_kn: 'KN',
            coll_rehber: 'Rehber',
            coll_resources: '💎 Kaynak',
            coll_deut: 'Deuterium',
            coll_crys: 'Kristal',
            coll_met: 'Metal',
            coll_sel_all: 'Tümü',
            coll_sel_planets: '🪐 Gezegenler',
            coll_sel_moons: '🌕 Aylar',
            coll_sel_none: '✖ Kaldır',
            coll_planets_moons: '🪐 Gezegenler & Aylar',
            coll_reserve_col: 'Deu Rezerv',
            coll_start_btn: '🚀 Toplamayı Başlat',
            coll_collecting: 'Toplama Başlatılıyor...',
            coll_loading: 'Yükleniyor...',
            coll_target_point: 'Toplama noktası',
            coll_no_selection: 'Toplanacak gezegen veya ay seçilmedi!',
            coll_planet_name: 'Gezegen',
            coll_moon_name: 'Ay',
            coll_manual_planet: 'Manuel Gezegen...',
            coll_manual_moon: 'Manuel Ay...',
            coll_reserve_hint: 'Deu Rezerv (Korumalı miktar)',
            coll_jump_hint: 'Gezegene geç',
            coll_jump_moon_hint: 'Aya geç',
            coll_planets_count: 'gezegen',
            coll_moons_count: 'ay',

            // Collector Floating HUD
            coll_hud_title: 'Maden Toplayıcı',
            coll_hud_send: 'Filoyu Gönder',
            coll_hud_retry: 'Tekrarla',
            coll_hud_skip: 'Atla',
            coll_hud_cancel: 'İptal',
            coll_hud_no_ships: 'Nakliye gemisi yok!',
            coll_hud_shortage_title: '⚠️ Yetersiz Gemi Kapasitesi!',
            coll_hud_stop_btn: '⏹️ Toplamayı Durdur',
            coll_hud_proceed_btn: '⏩ Olduğu Kadar Gönder (Devam Et)',
            coll_hud_selected_fleet: 'Seçilen Filo:',
            coll_hud_transported: 'Taşınan:',
            coll_hud_cap_shortage: 'Kargo Kapasitesi Yetersiz',

            // Courier Tab (Postacı)
            target_center_head: '📍 Merkez',
            cour_origin_head: '📍 Merkez',
            cour_here: 'Burası',
            cour_here_title: 'Çıkış noktasını şu an bulunduğunuz gezegen/ay yapar',
            cour_transport: 'Nakliye',
            cour_deploy: 'Konuşlandır',
            cour_ships: '🚀 Gemi',
            cour_bn: 'BN',
            cour_kn: 'KN',
            cour_rehber: 'Rehber',
            cour_sync_title: 'Genel Dağıtım',
            cour_sync_apply: '⚡ Eşitle',
            cour_sync_apply_title: 'Bu tutarları tüm seçili hedeflere yaz',
            cour_sel_all: 'Tümü',
            cour_sel_planets: '🪐 Gezegenler',
            cour_sel_moons: '🌕 Aylar',
            cour_sel_none: '✖ Kaldır',
            cour_planets_moons: '🪐 Hedef Gezegenler & Aylar',
            cour_res_cols: 'M / K / D Dağıtımı',
            cour_origin_badge: '📍 Merkez',
            cour_start_btn: '📬 Dağıtımı Başlat',
            cour_loading: 'Yükleniyor...',
            cour_no_selection: 'Dağıtım yapılacak gezegen veya ay seçilmedi!',
            cour_no_resources: 'Lütfen gönderilecek maden miktarlarını girin!',
            cour_planets_count: 'hedef seçili',
            cour_hud_title: 'Postacı Asistanı',
            cour_hud_dest: 'Hedef:',
            cour_hud_cargo: 'Taşınan:',
            cart_hud_shortage_title: '⚠️ Yetersiz Kaynak veya Gemi Kapasitesi!',
            cart_hud_stop_btn: '⏹️ Dağıtımı Durdur',
            cart_hud_proceed_btn: '⏩ Olduğu Kadar Gönder (Devam Et)',

            // Taşıma Öncelik Modu (Hız / Yakıt)
            mode_speed: '⚡ Hız',
            mode_fuel: '⛽ Yakıt',
            mode_speed_title: 'Taşıma Önceliği: Hız (Rehber > KN > BN). Tıkla: Yakıt Moduna Geç',
            mode_fuel_title: 'Taşıma Önceliği: Yakıt Tasarrufu (BN > KN > Rehber). Tıkla: Hız Moduna Geç',
            mode_speed_toast: '⚡ Hız Öncelikli Taşıma Modu Aktif (Rehber > KN > BN)',
            mode_fuel_toast: '⛽ Yakıt Tasarruflu Taşıma Modu Aktif (BN > KN > Rehber)',
            cart_hud_title: 'Maliyet Dağıtımı',
            exp_own_system: 'Kendi Sistemi',
            exp_system_offset: 'Sistem',
            exp_deep_space: 'Sonsuz Uzaklar',
            exp_hud_retrying: 'Keşif adımı yeniden deneniyor...',
            find_min_chars: 'En az 2 karakter giriniz.',
            find_active: 'aktif',
            find_owner: 'Sahip',
            find_no_results: 'Sonuç bulunamadı.',

            // Debris Tab
            deb_status_active: 'Harabe Avcısı Aktif · Galaksi İzleniyor',
            deb_status_inactive: 'Harabe Avcısı Kapalı',
            deb_toggle_title: 'Harabe izlemeyi aç/kapat',
            deb_threshold_label: '⚡ Min. Harabe Eşiği (Toplam Kaynak):',
            deb_sound_label: '🎵 Uyarı Sesi:',
            deb_test_sound: '🔊 Harabe Sesini Test Et',
            deb_found_title: '🛰️ Bulunan Harabeler',
            deb_clear_btn: '🗑️ Listeyi Temizle',
            deb_clear_title: 'Tüm harabeleri listeden temizle',
            deb_no_debris: '🪐 Henüz harabe tespit edilmedi.<br><span style="font-size:10px;color:#5c7080;margin-top:4px;display:inline-block">Galakside gezdikçe belirlediğiniz eşiğin üzerindeki harabeler otomatik listelenir.</span>',
            deb_jump: '🚀 Git',

            // Expedition Tab
            exp_start_slot16: '🎯 Başlangıç Keşif Noktası (Slot 16)',
            exp_here: 'Burası',
            exp_here_title: 'Şu anki gezegenin :16 slotunu yaz',
            exp_desc: 'Keşifler bu sistemden başlayarak yakından uzağa doğru spiral (+1, -1, +2, -2...) dağıtılır.',
            exp_count: '🔢 Sefer Sayısı',
            exp_template: '📋 Keşif Şablonu',
            exp_refresh_tpls_title: 'Şablonları yenile',
            exp_loading_tpl: '-- Şablon Yükleniyor... --',
            exp_preview_title: '🧭 Rota Dağılımı Önizlemesi:',
            exp_preview_placeholder: '(Başlangıç koordinatı ve sefer sayısını girin)',
            exp_start_btn: '🚀 Keşifleri Başlat (Adım Adım)',
            exp_missions_count: 'Sefer',
            exp_hud_title: '🧭 Keşif Asistanı',
            exp_hud_route: 'Hedef Rota:',
            exp_hud_template: 'Şablon:',
            exp_hud_send: 'Keşif Gönder',
            exp_hud_retry: 'Tekrarla',
            exp_hud_skip: 'Atla',
            exp_hud_cancel: 'İptal',
            exp_hud_preparing: '⏳ Hazırlanıyor...',

            // Scanner Tab
            scan_g_start: 'Galaksi Başlangıç',
            scan_g_end: 'Galaksi Bitiş',
            scan_s_start: 'Sistem Başlangıç',
            scan_s_end: 'Sistem Bitiş',
            scan_slots_label: 'Hedef Slotlar (virgülle ayırın)',
            scan_slots_ph: '8 veya 7, 9',
            scan_chip_8: '🎯 Sadece 8',
            scan_chip_7_9: '⭐ 7, 9',
            scan_chip_13_15: '❄️ 13-15 (Deut)',
            scan_chip_1_3: '☀️ 1-3 (Solar)',
            scan_chip_empty: '🪐 Tamamen Boş (1-15)',
            scan_min_empty: '👥 Min. Eşzamanlı Boş Slot:',
            scan_start_btn: '🔍 Taramayı Başlat',
            scan_refresh_btn: '🔄 Güncelle',
            scan_refresh_title: 'Evren verisini (universe.xml) sunucudan zorla yenile',
            scan_copy_coords: '📋 Koordinatları Kopyala',
            scan_scanning: '⏳ Taranıyor...',
            scan_cached: 'Önbellek',
            scan_no_data: 'Henüz evren verisi indirilmedi',
            scan_found: 'sonuç bulundu.',
            scan_planets: 'gezegen',

            // Finder Tab
            find_desc: 'Evrendeki tüm oyuncuları ve gezegenlerini bulun.',
            find_ph: 'Oyuncu veya gezegen adı...',
            find_player: 'Oyuncu Adı',
            find_planet: 'Gezegen Adı',
            find_btn: '🔍 Ara',
            find_searching: 'Aranıyor...',

            // Alarm Tab
            alarm_status_active_safe: 'Gözcü Aktif · Tehdit Yok',
            alarm_status_silenced: '⏹️ Sustur',
            alarm_att_title: '🚨 Saldırı Alarmı',
            alarm_sound_type: '🎵 Ses Tipi:',
            alarm_att_test: '🔊 Saldırı Sesini Test Et',
            alarm_esp_title: '📡 Sonda / Casusluk Uyarısı',
            alarm_esp_test: '🔊 Sonda Sesini Test Et',
            alarm_desktop_title: '🖥️ Masaüstü Bildirimi',
            alarm_desktop_desc: 'Sekme arka plandayken bildirim gönder',
            alarm_volume_label: '🔊 Ses Seviyesi:',
            alarm_repeat_label: '⏱️ Tekrar Sıklığı:',
            alarm_repeat_once: 'Sadece 1 kez çal',
            alarm_repeat_5s: 'Her 5 saniyede bir',
            alarm_repeat_10s: 'Her 10 saniyede bir',
            alarm_repeat_15s: 'Her 15 saniyede bir',
            alarm_repeat_30s: 'Her 30 saniyede bir',
            alarm_repeat_60s: 'Her 60 saniyede bir',
            alarm_sound_klaxon: 'Taktiksel Klakson (Varsayılan)',
            alarm_sound_siren: 'Kırmızı Alarm Sireni',
            alarm_sound_pulse: 'Acil Durum Nabzı',
            alarm_sound_sonar_deep: 'Derin Deniz Sonarı (Klasik Ping)',
            alarm_sound_sonar_hunter: 'Aktif Avcı Sonarı (Yüksek Ping)',
            alarm_sound_sonar_echo: 'Taktik Yankı Sonarı (Çift Eko)',

            // Settings Tab (Ayarlar)
            settings_general: 'Genel Tercihler',
            settings_lang: '🌐 Dil:',
            settings_theme: '🎨 Görünüm:',
            settings_theme_dark: '🌌 Uzay Karanlığı (Varsayılan)',
            settings_theme_fb: '🟡🔵 Fenerbahçe (Koyu & Kanarya)',
            settings_theme_light: '☀️ Aydınlık (Çok Yakında)',
            settings_theme_aero: '💎 Aero Glass (Çok Yakında)',
            settings_diag_divider: '🛠️ Sistem & Teşhis Günlükleri',
            settings_debug_title: '🐞 Debug Logs',
            settings_debug_toggle_title: 'Debug Logs aç/kapat (Uyarı ve Hatalar)',
            settings_debug_desc: 'Uygulama logları',
            settings_trace_title: '🎯 Trace Logs',
            settings_trace_toggle_title: 'Trace Logs aç/kapat (Tıklama, sayfa, tuş & yanıtlar)',
            settings_trace_desc: 'İzleme kayıtları',
            settings_copy_logs: '📋 Logları Kopyala',
            settings_copy_logs_title: 'Filtrelenmiş logları panoya kopyalar',
            settings_clear_logs: '🗑️ Logları Temizle',
            settings_clear_logs_title: 'Filtrelenmiş logları temizler',
            settings_export_logs: '💾 Logları Çıkar',
            settings_export_logs_title: 'Filtrelenmiş logları .txt dosyası olarak masaüstüne çıkarır',
            settings_stream: 'Akış:',
            settings_scope: 'Kapsam:',
            settings_level: 'Seviye:',
            settings_all: 'Tümü',
            settings_req: '📤 Giden İstekler',
            settings_resp: '📥 Gelen Yanıtlar',
            settings_records: 'kayıt',
            settings_debug_off: '○ Debug: Kapalı',
            settings_debug_on: '● Debug: Açık',
            settings_trace_off: '○ Trace: Kapalı',
            settings_trace_on: '● Trace: Açık',
            settings_opacity: '👁️ Saydamlık:',
            settings_hover_focus: '🎯 Fare Üzerindeyken %100 Yap',
            settings_hover_focus_title: 'Fare panelin üzerine geldiğinde otomatik olarak %100 görünür yapar',
            find_refresh_title: 'Evren ve oyuncu verisini sunucudan zorla yenile',
            find_cached: 'Önbellek',
            find_no_cache: 'Henüz evren/oyuncu verisi indirilmedi'
        },
        en: {
            // Tabs
            tab_cart: 'Cost Cart',
            tab_collector: 'Collector',
            tab_courier: 'Courier',
            tab_debris: 'Debris',
            tab_expedition: 'Expedition',
            tab_scanner: 'Scanner',
            tab_finder: 'Finder',
            tab_alarm: 'Alarm',
            tab_settings: 'Settings',

            // Tab Tooltips (Hover 3s)
            tab_tip_title_cart: '🏗️ Cost Cart',
            tab_tip_desc_cart: 'Calculates multi-level resource costs for buildings and researches, deducts current planet stock to find deficits, and prepares cargo fleets for dispatch with Space.',
            tab_tip_title_collector: '📦 Resource Collector',
            tab_tip_desc_collector: 'Collects accumulated resources across all empire colonies (respecting protected deuterium reserves) to a single hub with automatic cargo sizing and Spacebar dispatch.',
            tab_tip_title_courier: '📬 Resource Courier',
            tab_tip_desc_courier: 'Distributes resources (Metal, Crystal, Deuterium) from a central hub to selected colonies using global fill or custom amounts with sequential Spacebar dispatch.',
            tab_tip_title_debris: '🛰️ Debris Tracker',
            tab_tip_desc_debris: 'Tracks debris fields and slot 16 expedition debris while browsing the galaxy view, calculates required Recyclers, and alerts on debris exceeding your threshold.',
            tab_tip_title_expedition: '🧭 Expedition Assistant',
            tab_tip_desc_expedition: 'Routes expedition fleets to slot 16 in an outward spiral from a starting system, applies your saved fleet templates, and dispatches missions sequentially with Space.',
            tab_tip_title_scanner: '🌌 Galaxy Scanner',
            tab_tip_desc_scanner: 'Scans universe data to find empty slots matching your criteria (e.g. slot 8, deuterium slots) for colonization or relocation with direct galaxy shortcuts.',
            tab_tip_title_finder: '🔍 Player Finder',
            tab_tip_desc_finder: 'Searches players or planet names to map out all colonies, coordinates, and alliance affiliations on a single screen using official public data.',
            tab_tip_title_alarm: '🚨 Threat Alert',
            tab_tip_desc_alarm: 'Detects incoming attacks and espionage probes whenever the screen updates, alerting you with distinct audio klaxons and desktop notifications.',
            tab_tip_title_settings: '⚙️ Settings',
            tab_tip_desc_settings: 'Configures language (TR / ENG), panel theme, opacity slider, and hover-to-focus visibility preferences.',

            // Header
            header_title: 'LuckyStrike Helper',
            stop_alarm: '⏹️ Silence',
            stop_alarm_title: 'Silence this recurring alarm',

            // Cart Tab
            cart_sel_all: '☑️ Select All',
            cart_sel_none: '◻️ Clear Selection',
            cart_copy: '📋 Copy to Clipboard',
            cart_clear: '🗑️ Clear',
            cart_empty: 'Cart is empty.<br><span style="font-size:10px;color:#555">You can add items by clicking "Add to Cart" in building or tech details.</span>',
            cart_copied: '✓ Copied!',
            cart_deploy: '🚀 Deploy',
            cart_deploy_title: 'Deploy: Remains at destination',
            cart_transport: '🚚 Transport',
            cart_transport_title: 'Transport: Returns empty',
            cart_net_deficit: 'Net Deficit:',
            cart_cargo_needed: '🔴 Cargo Needed:',
            cart_total: 'Total:',
            cart_deduct_planet: '📉 Deduct Live Planet Resources',
            cart_deduct_title: 'If currently on this planet, deducts available resources from cart',
            cart_ships_sc: 'SC',
            cart_ships_lc: 'LC',
            cart_ships_pathfinder: 'Pathfinder',
            cart_ships_auto: 'Auto',
            cart_include_calc: 'Include this item in calculation',
            cart_include_batch: 'Include in batch delivery',
            cart_remove_item: 'Remove from cart',
            cart_remove_planet: 'Remove all items for this planet',
            cart_single_send: '⚡ Send',
            cart_single_send_title: 'Send fleet to this planet only',
            cart_enough_res: 'Sufficient Resources ✓',
            cart_no_ships: 'No ships selected',
            cart_grand_total: '📊 Selected Planets Grand Total:',
            cart_metal: '🟡 Metal:',
            cart_crystal: '🔵 Crystal:',
            cart_deuterium: '🟢 Deuterium:',
            cart_ship_pref_hint: 'Ship Preference (Priority: Pathfinder > SC > LC):',
            cart_extra_title: 'Extra Cost',
            cart_extra_hint: 'When active, entered amounts are added on top of each selected planet cart for delivery',
            cart_metal_ph: 'Metal',
            cart_crys_ph: 'Crystal',
            cart_deut_ph: 'Deut',
            cart_bulk_distribute: '⚡ DISTRIBUTE TO SELECTED PLANETS',
            cart_copy_hint: 'Copy',
            cart_btn_add: 'Add to Cart',
            cart_stepper_down_title: 'Decrease level',
            cart_stepper_up_title: 'Increase level',

            // Collector Tab
            coll_target_head: '📍 Hub',
            coll_here: 'Current',
            coll_here_title: 'Sets destination to your current planet/moon',
            coll_transport: 'Transport',
            coll_deploy: 'Deploy',
            coll_ships: '🚀 Ships',
            coll_bn: 'LC',
            coll_kn: 'SC',
            coll_rehber: 'Pathfinder',
            coll_resources: '💎 Resources',
            coll_deut: 'Deuterium',
            coll_crys: 'Crystal',
            coll_met: 'Metal',
            coll_sel_all: 'All',
            coll_sel_planets: '🪐 Planets',
            coll_sel_moons: '🌕 Moons',
            coll_sel_none: '✖ Clear',
            coll_planets_moons: '🪐 Planets & Moons',
            coll_reserve_col: 'Deut Reserve',
            coll_start_btn: '🚀 Start Collecting',
            coll_collecting: 'Starting Collection...',
            coll_loading: 'Loading...',
            coll_target_point: 'Target destination',
            coll_no_selection: 'No planet or moon selected!',
            coll_planet_name: 'Planet',
            coll_moon_name: 'Moon',
            coll_manual_planet: 'Manual Planet...',
            coll_manual_moon: 'Manual Moon...',
            coll_reserve_hint: 'Deut Reserve (Protected amount)',
            coll_jump_hint: 'Switch to planet',
            coll_jump_moon_hint: 'Switch to moon',
            coll_planets_count: 'planets',
            coll_moons_count: 'moons',

            // Collector Floating HUD
            coll_hud_title: 'Resource Collector',
            coll_hud_send: 'Send Fleet',
            coll_hud_retry: 'Retry',
            coll_hud_skip: 'Skip',
            coll_hud_cancel: 'Cancel',
            coll_hud_no_ships: 'No cargo ships available!',
            coll_hud_shortage_title: '⚠️ Insufficient Cargo Capacity!',
            coll_hud_stop_btn: '⏹️ Stop Collection',
            coll_hud_proceed_btn: '⏩ Send Partial Cargo (Continue)',
            coll_hud_selected_fleet: 'Selected Fleet:',
            coll_hud_transported: 'Carrying:',
            coll_hud_cap_shortage: 'Insufficient Cargo Capacity',

            // Courier Tab (Postacı)
            target_center_head: '📍 Hub',
            cour_origin_head: '📍 Hub',
            cour_here: 'Here',
            cour_here_title: 'Sets distribution base to current planet/moon',
            cour_transport: 'Transport',
            cour_deploy: 'Deploy',
            cour_ships: '🚀 Ships',
            cour_bn: 'LC',
            cour_kn: 'SC',
            cour_rehber: 'Pathfinder',
            cour_sync_title: 'Global Fill',
            cour_sync_apply: '⚡ Sync All',
            cour_sync_apply_title: 'Apply these amounts to all selected targets',
            cour_sel_all: 'All',
            cour_sel_planets: '🪐 Planets',
            cour_sel_moons: '🌕 Moons',
            cour_sel_none: '✖ Clear',
            cour_planets_moons: '🪐 Target Planets & Moons',
            cour_res_cols: 'M / C / D Distribution',
            cour_origin_badge: '📍 Hub',
            cour_start_btn: '📬 Start Distribution',
            cour_loading: 'Loading...',
            cour_no_selection: 'No destination planet or moon selected!',
            cour_no_resources: 'Please enter resource amounts to send!',
            cour_planets_count: 'targets selected',
            cour_hud_title: 'Courier Assistant',
            cour_hud_dest: 'Target:',
            cour_hud_cargo: 'Distributing:',
            cart_hud_shortage_title: '⚠️ Insufficient Resources or Cargo Capacity!',
            cart_hud_stop_btn: '⏹️ Stop Distribution',
            cart_hud_proceed_btn: '⏩ Send Partial Fleet (Proceed)',
            cart_hud_title: 'Cost Distribution',

            // Cargo Priority Mode (Speed / Fuel)
            mode_speed: '⚡ Speed',
            mode_fuel: '⛽ Fuel',
            mode_speed_title: 'Cargo Priority: Speed (Pathfinder > LC > SC). Click to switch to Fuel Mode',
            mode_fuel_title: 'Cargo Priority: Fuel-Saving (LC > SC > Pathfinder). Click to switch to Speed Mode',
            mode_speed_toast: '⚡ Speed-Optimized Cargo Mode Active (Pathfinder > LC > SC)',
            mode_fuel_toast: '⛽ Fuel-Saving Cargo Mode Active (LC > SC > Pathfinder)',
            exp_own_system: 'Own System',
            exp_system_offset: 'System',
            exp_deep_space: 'Deep Space',
            exp_hud_retrying: 'Retrying expedition step...',
            find_min_chars: 'Enter at least 2 characters.',
            find_active: 'active',
            find_owner: 'Owner',
            find_no_results: 'No results found.',

            // Debris Tab
            deb_status_active: 'Debris Hunter Active · Monitoring Galaxy',
            deb_status_inactive: 'Debris Hunter Inactive',
            deb_toggle_title: 'Toggle debris monitoring',
            deb_threshold_label: '⚡ Min. Debris Threshold (Total):',
            deb_sound_label: '🎵 Alert Sound:',
            deb_test_sound: '🔊 Test Debris Sound',
            deb_found_title: '🛰️ Detected Debris',
            deb_clear_btn: '🗑️ Clear List',
            deb_clear_title: 'Clear all debris from list',
            deb_no_debris: '🪐 No debris detected yet.<br><span style="font-size:10px;color:#5c7080;margin-top:4px;display:inline-block">Debris above your threshold will appear automatically as you browse galaxy view.</span>',
            deb_jump: '🚀 Go',

            // Expedition Tab
            exp_start_slot16: '🎯 Starting Expedition Point (Slot 16)',
            exp_here: 'Current',
            exp_here_title: 'Fill with current planet :16 slot',
            exp_desc: 'Expeditions are dispatched spiraling outward from this system (+1, -1, +2, -2...).',
            exp_count: '🔢 Expedition Count',
            exp_template: '📋 Expedition Template',
            exp_refresh_tpls_title: 'Refresh templates',
            exp_loading_tpl: '-- Loading Templates... --',
            exp_preview_title: '🧭 Route Distribution Preview:',
            exp_preview_placeholder: '(Enter starting coordinates and mission count)',
            exp_start_btn: '🚀 Start Expeditions (Step by Step)',
            exp_missions_count: 'Missions',
            exp_hud_title: '🧭 Expedition Assistant',
            exp_hud_route: 'Target Route:',
            exp_hud_template: 'Template:',
            exp_hud_send: 'Send Expedition',
            exp_hud_retry: 'Retry',
            exp_hud_skip: 'Skip',
            exp_hud_cancel: 'Cancel',
            exp_hud_preparing: '⏳ Preparing...',

            // Scanner Tab
            scan_g_start: 'Galaxy Start',
            scan_g_end: 'Galaxy End',
            scan_s_start: 'System Start',
            scan_s_end: 'System End',
            scan_slots_label: 'Target Slots (comma separated)',
            scan_slots_ph: '8 or 7, 9',
            scan_chip_8: '🎯 Slot 8 only',
            scan_chip_7_9: '⭐ 7, 9',
            scan_chip_13_15: '❄️ 13-15 (Deut)',
            scan_chip_1_3: '☀️ 1-3 (Solar)',
            scan_chip_empty: '🪐 Completely Empty (1-15)',
            scan_min_empty: '👥 Min. Concurrent Empty Slots:',
            scan_start_btn: '🔍 Start Scan',
            scan_refresh_btn: '🔄 Update',
            scan_refresh_title: 'Force refresh universe data (universe.xml) from server',
            scan_copy_coords: '📋 Copy Coordinates',
            scan_scanning: '⏳ Scanning...',
            scan_cached: 'Cache',
            scan_no_data: 'Universe data not yet downloaded',
            scan_found: 'results found.',
            scan_planets: 'planets',

            // Finder Tab
            find_desc: 'Find all players and planets across the universe.',
            find_ph: 'Player or planet name...',
            find_player: 'Player Name',
            find_planet: 'Planet Name',
            find_btn: '🔍 Search',
            find_searching: 'Searching...',

            // Alarm Tab
            alarm_status_active_safe: 'Watcher Active · No Threat',
            alarm_status_silenced: '⏹️ Silence',
            alarm_att_title: '🚨 Attack Alarm',
            alarm_sound_type: '🎵 Sound Type:',
            alarm_att_test: '🔊 Test Attack Sound',
            alarm_esp_title: '📡 Probe / Espionage Alert',
            alarm_esp_test: '🔊 Test Espionage Sound',
            alarm_desktop_title: '🖥️ Desktop Notification',
            alarm_desktop_desc: 'Send notifications when tab is in background',
            alarm_volume_label: '🔊 Volume:',
            alarm_repeat_label: '⏱️ Repeat Interval:',
            alarm_repeat_once: 'Play once only',
            alarm_repeat_5s: 'Every 5 seconds',
            alarm_repeat_10s: 'Every 10 seconds',
            alarm_repeat_15s: 'Every 15 seconds',
            alarm_repeat_30s: 'Every 30 seconds',
            alarm_repeat_60s: 'Every 60 seconds',
            alarm_sound_klaxon: 'Tactical Klaxon (Default)',
            alarm_sound_siren: 'Red Alert Siren',
            alarm_sound_pulse: 'Emergency Pulse',
            alarm_sound_sonar_deep: 'Deep Sea Sonar (Classic Ping)',
            alarm_sound_sonar_hunter: 'Active Hunter Sonar (High Ping)',
            alarm_sound_sonar_echo: 'Tactical Echo Sonar (Double Echo)',

            // Settings Tab (Ayarlar)
            settings_general: 'General Preferences',
            settings_lang: '🌐 Language:',
            settings_theme: '🎨 Theme:',
            settings_theme_dark: '🌌 Deep Space (Default)',
            settings_theme_fb: '🟡🔵 Fenerbahçe (Dark Canary)',
            settings_theme_light: '☀️ Light (Coming Soon)',
            settings_theme_aero: '💎 Aero Glass (Coming Soon)',
            settings_diag_divider: '🛠️ System & Diagnostic Logs',
            settings_debug_title: '🐞 Debug Logs',
            settings_debug_toggle_title: 'Toggle Debug Logs (Warnings & Errors)',
            settings_debug_desc: 'Application logs',
            settings_trace_title: '🎯 Trace Logs',
            settings_trace_toggle_title: 'Toggle Trace Logs (Clicks, page events, keys & responses)',
            settings_trace_desc: 'Activity trace records',
            settings_copy_logs: '📋 Copy Logs',
            settings_copy_logs_title: 'Copies filtered logs to clipboard',
            settings_clear_logs: '🗑️ Clear Logs',
            settings_clear_logs_title: 'Clears filtered logs',
            settings_export_logs: '💾 Export Logs',
            settings_export_logs_title: 'Exports filtered logs as a .txt file',
            settings_stream: 'Stream:',
            settings_scope: 'Scope:',
            settings_level: 'Level:',
            settings_all: 'All',
            settings_req: '📤 Outgoing Requests',
            settings_resp: '📥 Incoming Responses',
            settings_records: 'records',
            settings_debug_off: '○ Debug: Off',
            settings_debug_on: '● Debug: On',
            settings_trace_off: '○ Trace: Off',
            settings_trace_on: '● Trace: On',
            settings_opacity: '👁️ Opacity:',
            settings_hover_focus: '🎯 Hover to Focus',
            settings_hover_focus_title: 'Automatically restore 100% opacity when mouse hovers over panel',
            find_refresh_title: 'Force refresh universe and player data from server',
            find_cached: 'Cache',
            find_no_cache: 'Universe/player data not downloaded yet'
        }
    };

    function t(key, fallback) {
        const lang = currentLang || 'tr';
        if (I18N[lang] && I18N[lang][key] !== undefined) return I18N[lang][key];
        if (I18N['tr'] && I18N['tr'][key] !== undefined) return I18N['tr'][key];
        return fallback !== undefined ? fallback : key;
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            if (k) el.textContent = t(k);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const k = el.getAttribute('data-i18n-title');
            if (k) el.title = t(k);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const k = el.getAttribute('data-i18n-placeholder');
            if (k) el.placeholder = t(k);
        });

        // Tab etiketleri
        const tabMap = {
            cart: 'tab_cart',
            collector: 'tab_collector',
            courier: 'tab_courier',
            debris: 'tab_debris',
            expedition: 'tab_expedition',
            scanner: 'tab_scanner',
            finder: 'tab_finder',
            alarm: 'tab_alarm',
            settings: 'tab_settings',
            debug: 'tab_settings'
        };
        document.querySelectorAll('.ls-tab').forEach(tab => {
            const tKey = tab.getAttribute('data-tab');
            const lblEl = tab.querySelector('.ls-tab-label');
            if (lblEl && tabMap[tKey]) {
                lblEl.textContent = t(tabMap[tKey]);
            }
        });

        // Dinamik alt bileşenleri tazele
        try { if (typeof renderCart === 'function') renderCart(); } catch (e) {}
        try { if (typeof renderCollector === 'function') renderCollector(); } catch (e) {}
        try { if (typeof renderCourier === 'function') renderCourier(); } catch (e) {}
        try { if (typeof renderDebrisList === 'function') renderDebrisList(); } catch (e) {}
        try { if (typeof renderExpedition === 'function') renderExpedition(); } catch (e) {}
        try { if (typeof updateScanStatusInfo === 'function') updateScanStatusInfo(); } catch (e) {}
        try { if (typeof updateFinderStatusInfo === 'function') updateFinderStatusInfo(); } catch (e) {}
        try { if (typeof updateRefreshButtonCooldown === 'function') updateRefreshButtonCooldown(); } catch (e) {}
        try { if (typeof renderDebugLogs === 'function') renderDebugLogs(); } catch (e) {}
        try { if (typeof applyPanelOpacity === 'function') applyPanelOpacity(); } catch (e) {}
        try {
            if (typeof updateModeBtnUI === 'function') {
                const cPrefs = typeof getCartShipPrefs === 'function' ? getCartShipPrefs() : {};
                updateModeBtnUI(document.getElementById('ls-cart-mode-btn'), cPrefs.priorityMode || 'speed');
                if (typeof collectorSettings !== 'undefined') {
                    updateModeBtnUI(document.getElementById('ls-coll-mode-btn'), collectorSettings.priorityMode || 'speed');
                }
                if (typeof courierSettings !== 'undefined') {
                    updateModeBtnUI(document.getElementById('ls-cour-mode-btn'), courierSettings.priorityMode || 'speed');
                }
            }
        } catch (e) {}

        const langBtnText = document.querySelector('#ls-setting-lang-button .ui-selectmenu-status, #ls-setting-lang-button .ui-selectmenu-text');
        if (langBtnText) {
            langBtnText.textContent = (currentLang === 'en') ? 'ENG (English)' : 'TR (Türkçe)';
        }
        const themeBtnText = document.querySelector('#ls-setting-theme-button .ui-selectmenu-status, #ls-setting-theme-button .ui-selectmenu-text');
        if (themeBtnText) {
            const curTheme = localStorage.getItem(KEYS.THEME) || 'dark';
            themeBtnText.textContent = (curTheme === 'fb') ? t('settings_theme_fb') : ((curTheme === 'dark') ? t('settings_theme_dark') : (curTheme === 'light' ? t('settings_theme_light') : t('settings_theme_aero')));
        }
    }

    // ============================================================
    // CENTRAL LOGGER & TRACER
    // ============================================================
    let debugFilterState = {
        row1: new Set(['ALL']), // 'ALL', 'DEBUG', 'TRACE'
        row2: new Set(['ALL']), // 'ALL', 'REQ', 'RESP'
        row3: new Set(['ALL'])  // 'ALL', 'INFO', 'WARN', 'ERROR'
    };
    let onDebugLiveUpdate = null;

    const LS_LOGGER = {
        isDebugEnabled: function() {
            try {
                return localStorage.getItem(KEYS.DEBUG_ENABLED) === 'true';
            } catch (e) {
                return false;
            }
        },
        isTraceEnabled: function() {
            try {
                return localStorage.getItem(KEYS.TRACE_ENABLED) === 'true';
            } catch (e) {
                return false;
            }
        },
        setDebugEnabled: function(val) {
            try {
                localStorage.setItem(KEYS.DEBUG_ENABLED, val ? 'true' : 'false');
                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                    detail: { type: 'SET_DEBUG_MODE', enabled: !!val }
                }));
            } catch (e) {}
            this.log('ACTION', 'SYSTEM', `Debug Logs ${val ? 'AÇILDI' : 'KAPATILDI'}.`);
        },
        setTraceEnabled: function(val) {
            try {
                localStorage.setItem(KEYS.TRACE_ENABLED, val ? 'true' : 'false');
                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                    detail: { type: 'SET_TRACE_MODE', enabled: !!val }
                }));
            } catch (e) {}
            LS_TRACER.updateIndicator();
            if (val) {
                LS_TRACER.record('TRACE_DURUMU', 'Trace Logs AÇILDI. Kullanıcı eylem ve yanıt takibi başladı.', {
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
                LS_TRACER.snapshotPage('SAYFA_DURUMU', 'Trace Logs başlangıcında aktif sayfa kaydedildi.');
            } else {
                LS_TRACER.record('TRACE_DURUMU', 'Trace Logs KAPATILDI.');
            }
        },
        getLogs: function() {
            try {
                return JSON.parse(sessionStorage.getItem(KEYS.DEBUG_LOGS) || '[]');
            } catch (e) {
                return [];
            }
        },
        clearLogs: function() {
            try {
                sessionStorage.removeItem(KEYS.DEBUG_LOGS);
            } catch (e) {}
        },
        removeFilteredLogs: function(predicate) {
            try {
                const logs = this.getLogs();
                const remaining = logs.filter(entry => !predicate(entry));
                sessionStorage.setItem(KEYS.DEBUG_LOGS, JSON.stringify(remaining));
            } catch (e) {}
        },
        log: function(level, cat, msg, data, stream) {
            const debugOn = this.isDebugEnabled();
            const traceOn = this.isTraceEnabled();

            // Hiçbiri açık değilse hiçbir şey kaydetme (Sıfır yük)
            if (!debugOn && !traceOn) return;

            const entryStream = stream || (cat === 'TRACE' ? 'TRACE' : 'DEBUG');

            // Kullanıcı kuralları:
            // 1. Sadece Debug Logs açıkken: Bizim uygulamanın attığı istekler, OGame sunucu yanıtları, köprü olayları ve hatalar (DEBUG)
            // 2. Sadece Trace Logs açıkken: Kullanıcının manual browser hareketleri, tıklamaları, tuşları ve bildirimleri (TRACE)
            // 3. İkisi de açıkken: Her iki akış birleşik kaydedilir ve başına [DEBUG] / [TRACE] eklenir.
            if (!debugOn && entryStream === 'DEBUG') return;
            if (!traceOn && entryStream === 'TRACE') return;

            try {
                const logs = this.getLogs();
                const now = new Date();
                const timeStr = [
                    String(now.getHours()).padStart(2, '0'),
                    String(now.getMinutes()).padStart(2, '0'),
                    String(now.getSeconds()).padStart(2, '0')
                ].join(':') + '.' + String(now.getMilliseconds()).padStart(3, '0');

                const entry = {
                    id: Date.now() + Math.random().toString(36).substring(2, 6),
                    stream: entryStream,
                    time: timeStr,
                    level: level || 'INFO',
                    cat: (cat || 'GENERAL').toUpperCase(),
                    msg: typeof msg === 'string' ? msg : JSON.stringify(msg),
                    data: data ? (typeof data === 'object' ? JSON.stringify(data) : String(data)) : null
                };

                logs.push(entry);
                if (logs.length > 500) {
                    logs.splice(0, logs.length - 500);
                }
                sessionStorage.setItem(KEYS.DEBUG_LOGS, JSON.stringify(logs));

                try {
                    const tagStyle = entry.stream === 'TRACE' ? 'color:#ff7043;font-weight:bold' : 'color:#00bcff;font-weight:bold';
                    const catLabel = (entry.cat && entry.cat !== 'TRACE' && entry.cat !== 'DEBUG') ? ` [${entry.cat}]` : '';
                    console.log(`%c[${entry.stream}] [${timeStr}]${catLabel} [${entry.level}]`, tagStyle, entry.msg, entry.data || '');
                } catch(e) {}

                if (typeof onDebugLiveUpdate === 'function') {
                    onDebugLiveUpdate(entry);
                }
            } catch (e) {}
        },
        info: function(cat, msg, data) { this.log('INFO', cat, msg, data, 'DEBUG'); },
        action: function(cat, msg, data) { this.log('ACTION', cat, msg, data, 'DEBUG'); },
        dispatch: function(cat, msg, data) { this.log('DISPATCH', cat, msg, data, 'DEBUG'); },
        warn: function(cat, msg, data) { this.log('WARN', cat, msg, data, 'DEBUG'); },
        error: function(cat, msg, data) { this.log('ERROR', cat, msg, data, 'DEBUG'); }
    };

    // ============================================================
    // USER ACTION TRACER (TRACE LOGS MODÜLÜ)
    // ============================================================
    const LS_TRACER = {
        isEnabled: function() {
            try {
                return localStorage.getItem(KEYS.TRACE_ENABLED) === 'true';
            } catch (e) {
                return false;
            }
        },
        getTraces: function() {
            try {
                return JSON.parse(sessionStorage.getItem(KEYS.TRACE_LOGS) || '[]');
            } catch (e) {
                return [];
            }
        },
        clearTraces: function() {
            try {
                sessionStorage.removeItem(KEYS.TRACE_LOGS);
            } catch (e) {}
            this.updateIndicator();
        },
        removeFilteredTraces: function(predicate) {
            try {
                const traces = this.getTraces();
                const remaining = traces.filter(entry => !predicate(entry));
                sessionStorage.setItem(KEYS.TRACE_LOGS, JSON.stringify(remaining));
            } catch (e) {}
            this.updateIndicator();
        },
        record: function(type, summary, details) {
            if (!this.isEnabled() && type !== 'TRACE_DURUMU') return;
            try {
                const traces = this.getTraces();
                const now = new Date();
                const timeStr = [
                    String(now.getHours()).padStart(2, '0'),
                    String(now.getMinutes()).padStart(2, '0'),
                    String(now.getSeconds()).padStart(2, '0')
                ].join(':') + '.' + String(now.getMilliseconds()).padStart(3, '0');

                const entry = {
                    id: Date.now() + Math.random().toString(36).substring(2, 6),
                    time: timeStr,
                    type: type || 'EYLEM',
                    summary: summary || '',
                    details: details || null,
                    url: window.location.href
                };

                traces.push(entry);
                if (traces.length > 500) {
                    traces.splice(0, traces.length - 500);
                }
                sessionStorage.setItem(KEYS.TRACE_LOGS, JSON.stringify(traces));

                // Merkezi LS_LOGGER'a TRACE kategorisiyle gönder
                const detailStr = details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null;
                LS_LOGGER.log('ACTION', 'TRACE', `[${type}] ${summary}`, detailStr, 'TRACE');

                this.updateIndicator();
            } catch (e) {}
        },
        updateIndicator: function() {
            try {
                let badge = document.getElementById('ls-trace-badge');
                const enabled = this.isEnabled();
                if (!enabled) {
                    if (badge) badge.remove();
                    return;
                }
                const traces = this.getTraces();
                if (!badge) {
                    badge = document.createElement('div');
                    badge.id = 'ls-trace-badge';
                    badge.style.cssText = 'position:fixed;top:8px;right:75px;z-index:999999;background:rgba(20,24,35,0.94);border:1px solid #ff5722;color:#fff;padding:4px 10px;border-radius:14px;font-size:11px;font-weight:bold;display:flex;align-items:center;gap:6px;box-shadow:0 2px 10px rgba(255,87,34,0.4);cursor:pointer;user-select:none;font-family:sans-serif;transition:all .2s';
                    badge.title = 'Trace Logs Aktif! Tıklayarak Debug sekmesine gidebilirsiniz.';
                    badge.addEventListener('click', () => {
                        const panelEl = document.getElementById('ls-panel');
                        if (panelEl) {
                            panelEl.style.display = 'flex';
                            const dbgTab = document.querySelector('.ls-tab[data-tab="settings"]') || document.querySelector('.ls-tab[data-tab="debug"]');
                            if (dbgTab) dbgTab.click();
                        }
                    });
                    document.body.appendChild(badge);
                }
                badge.innerHTML = '<span style="display:inline-block;width:8px;height:8px;background:#ff3d00;border-radius:50%;animation:ls-pulse 1.2s infinite"></span>' +
                                  '<span style="color:#ff7043">🔴 TRACE LOGS</span>' +
                                  '<span style="background:rgba(255,255,255,0.12);padding:1px 6px;border-radius:8px;font-size:10px;color:#fff">' + traces.length + '</span>';
            } catch (e) {}
        },
        snapshotPage: function(tag, note) {
            try {
                const u = new URL(window.location.href);
                const component = u.searchParams.get('component') || u.searchParams.get('page') || 'genel';
                const activePlanetEl = document.querySelector('#planetList .selected, .smallplanet.selected, .planetlink.active');
                let planetName = '';
                let planetCoord = '';
                if (activePlanetEl) {
                    const nameEl = activePlanetEl.querySelector('.planet-name, .titlePlanet');
                    const coordEl = activePlanetEl.querySelector('.planet-koords, .coordinates');
                    planetName = nameEl ? nameEl.textContent.trim() : '';
                    planetCoord = coordEl ? coordEl.textContent.trim() : '';
                }
                const resM = (document.getElementById('resources_metal') || {}).textContent || '';
                const resC = (document.getElementById('resources_crystal') || {}).textContent || '';
                const resD = (document.getElementById('resources_deuterium') || {}).textContent || '';

                this.record(tag || 'SAYFA_DURUMU', `${note || 'Sayfa'} [${component}] ${planetName} ${planetCoord}`.trim(), {
                    url: window.location.href,
                    component: component,
                    planet: `${planetName} ${planetCoord}`.trim(),
                    resources: `M: ${resM.trim()} | C: ${resC.trim()} | D: ${resD.trim()}`
                });
            } catch (e) {}
        }
    };

    function describeElement(rawEl) {
        let el = rawEl;
        if (!el) return { summary: 'Bilinmeyen Öğe', details: {} };
        if (el.nodeType === 3) el = el.parentElement;
        if (!el || !el.tagName) return { summary: 'Bilinmeyen Öğe', details: {} };

        // LuckyStrike paneli içi tıklamalar
        if (el.closest && el.closest('#ls-panel')) {
            const panelBtn = el.closest('button, .ls-tab, a, input, select') || el;
            const pText = (panelBtn.innerText || panelBtn.value || panelBtn.title || panelBtn.id || '').trim().replace(/\s+/g, ' ').substring(0, 40);
            return {
                summary: `[LuckyStrike UI] <${(panelBtn.tagName||'').toLowerCase()}#${panelBtn.id||''}> "${pText}"`,
                details: { target: 'LuckyStrike', id: panelBtn.id, tag: panelBtn.tagName, text: pText }
            };
        }

        // Tıklanan öğenin en yakın etkileşimli ata elemanı
        const interactive = el.closest ? el.closest('button, a, input, select, textarea, li.shipImage, [data-mission], [data-technology], .planetlink, .smallplanet, .menubutton') : null;
        if (interactive) {
            el = interactive;
        }

        const tag = (el.tagName || '').toLowerCase();
        const id = el.id ? '#' + el.id : '';
        const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
        const text = (el.innerText || el.value || el.getAttribute('title') || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').substring(0, 45);

        // OGame'e özel öğeler
        if (id === '#sendFleet') {
            return {
                summary: `🚀 Filo Gönder Butonu (#sendFleet)`,
                details: { tag, id, class: cls, text }
            };
        }
        if (id === '#continueToFleet2' || id === '#continueToFleet3' || (cls && cls.includes('continue'))) {
            return {
                summary: `➡️ Devam Butonu (${id || cls})`,
                details: { tag, id, class: cls, text }
            };
        }
        if (el.getAttribute('data-mission')) {
            const mId = el.getAttribute('data-mission');
            const mMappings = { '1':'Saldırı', '3':'Nakliye', '4':'Konuşlandır', '6':'Casusluk', '7':'Sömürgeleştir', '8':'Geri Dönüşüm', '15':'Keşif' };
            const mName = mMappings[mId] || text || `Görev ${mId}`;
            return {
                summary: `🎯 Görev Seçimi: ${mName} (ID: ${mId})`,
                details: { missionId: mId, id, class: cls, text }
            };
        }
        if (el.getAttribute('data-technology')) {
            const techId = el.getAttribute('data-technology');
            return {
                summary: `🛸 Gemi/Teknoloji Seçimi: ${text || ('Tech ID ' + techId)}`,
                details: { techId: techId, id, class: cls, text }
            };
        }
        if (el.closest && el.closest('#planetList, .smallplanet, .planetlink')) {
            const planetEl = el.closest('#planetList li, .smallplanet, .planetlink');
            const nameEl = planetEl ? planetEl.querySelector('.planet-name, .titlePlanet') : null;
            const coordEl = planetEl ? planetEl.querySelector('.planet-koords, .coordinates') : null;
            const pName = nameEl ? nameEl.textContent.trim() : '';
            const pCoord = coordEl ? coordEl.textContent.trim() : '';
            return {
                summary: `🪐 Gezegen Listesinden Seçim: ${pName} ${pCoord}`,
                details: { planetName: pName, coordinates: pCoord, id, class: cls }
            };
        }

        return {
            summary: `<${tag}${id}${cls ? ' ' + cls : ''}> "${text}"`,
            details: { tag, id, class: cls, text }
        };
    }

    function initOgameNotificationObserver() {
        try {
            const observer = new MutationObserver(function(mutations) {
                const debugOn = LS_LOGGER.isDebugEnabled();
                const traceOn = LS_TRACER.isEnabled();
                if (!debugOn && !traceOn) return;
                for (let i = 0; i < mutations.length; i++) {
                    const m = mutations[i];
                    for (let j = 0; j < m.addedNodes.length; j++) {
                        const node = m.addedNodes[j];
                        if (node && node.nodeType === 1) {
                            const el = node;
                            const cls = (el.className || '').toString();
                            const id = el.id || '';
                            if (cls.includes('notify') || cls.includes('toast') || cls.includes('fadeBox') || id === 'message_box' || cls.includes('alert') || cls.includes('error') || cls.includes('success')) {
                                const txt = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
                                if (txt && txt.length > 3 && txt.length < 300) {
                                    const isError = cls.includes('error') || txt.toLowerCase().includes('hata') || txt.toLowerCase().includes('ne yazık ki');
                                    const isSuccess = cls.includes('success') || txt.toLowerCase().includes('başarıyla');
                                    const icon = isError ? '❌' : (isSuccess ? '✔' : '🔔');
                                    if (traceOn) {
                                        LS_TRACER.record('OGAME_YANIT', `${icon} OGame Bildirimi: "${txt}"`, {
                                            id: id,
                                            class: cls,
                                            text: txt
                                        });
                                    }
                                    if (debugOn) {
                                        LS_LOGGER.log(isError ? 'ERROR' : 'INFO', 'OGAME-YANIT', `OGame Bildirimi: "${txt}"`, { id: id, class: cls, text: txt }, 'DEBUG');
                                    }
                                }
                            }
                        }
                    }
                }
            });
            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        } catch (e) {}
    }

    // Helper to describe clicks on LuckyStrike UI elements
    function describeLsUiElement(rawEl) {
        let el = rawEl;
        if (!el) return null;
        if (el.nodeType === 3) el = el.parentElement;
        if (!el || !el.tagName) return null;

        // Interactive element inside LuckyStrike
        const interactive = el.closest ? el.closest('button, .ls-tab, a, input, select, .ls-chip, .ls-x, .ls-cp-btn, [data-action], .ls-col-row, .ls-exp-colony-item') : null;
        if (interactive) {
            el = interactive;
        }

        const tag = (el.tagName || '').toLowerCase();
        const id = el.id ? '#' + el.id : '';
        const cls = el.className && typeof el.className === 'string' ? el.className : '';

        // Tab click
        if (el.classList && el.classList.contains('ls-tab')) {
            const tabName = el.getAttribute('data-tab') || (el.innerText || '').trim();
            return {
                summary: `Sekmeye Tıklandı: "${tabName}"`,
                details: { type: 'TAB', tab: tabName, id: el.id }
            };
        }

        // Chip click (e.g. scanner filters)
        if (el.classList && el.classList.contains('ls-chip')) {
            const chipText = (el.innerText || '').trim();
            return {
                summary: `Filtre / Seçim Çipi Tıklandı: "${chipText}"`,
                details: { type: 'CHIP', text: chipText }
            };
        }

        // Cart delete button (.ls-x)
        if (el.classList && el.classList.contains('ls-x')) {
            const itemRow = el.closest('.ls-item');
            const itemName = itemRow ? (itemRow.innerText || '').split('\n')[0].trim() : 'Öğe';
            return {
                summary: `Sepetten Çıkar Butonuna Tıklandı: "${itemName}"`,
                details: { type: 'CART_REMOVE', item: itemName }
            };
        }

        // Button clicks
        if (tag === 'button' || (el.classList && (el.classList.contains('ls-btn') || el.classList.contains('ls-cp-btn')))) {
            const text = (el.innerText || el.value || el.title || el.id || 'Buton').trim().replace(/\s+/g, ' ');
            return {
                summary: `Butona Tıklandı: "${text}" (${id || tag})`,
                details: { type: 'BUTTON', text: text, id: el.id, class: cls }
            };
        }

        // Checkbox or radio click
        if (tag === 'input' && (el.type === 'checkbox' || el.type === 'radio')) {
            const labelEl = el.closest('label');
            const labelText = labelEl ? labelEl.innerText.trim().replace(/\s+/g, ' ') : (el.title || el.name || el.id);
            return {
                summary: `Seçim Kutusu Tıklandı: "${labelText}" (${el.checked ? 'SEÇİLİ' : 'SEÇİLİ DEĞİL'})`,
                details: { type: el.type, checked: el.checked, id: el.id, name: el.name }
            };
        }

        const fallbackText = (el.innerText || el.value || el.title || el.id || '').trim().replace(/\s+/g, ' ').substring(0, 40);
        if (fallbackText) {
            return {
                summary: `UI Öğesine Tıklandı: <${tag}${id}> "${fallbackText}"`,
                details: { tag: tag, id: el.id, text: fallbackText }
            };
        }

        return null;
    }

    function getLsInputLabel(el) {
        if (!el) return 'Bilinmeyen Alan';
        const labelEl = el.closest('label');
        if (labelEl) {
            return labelEl.innerText.trim().replace(/\s+/g, ' ');
        }
        const parentRow = el.closest('.ls-row, .ls-col, div');
        if (parentRow) {
            const lbl = parentRow.querySelector('.ls-label, span, b');
            if (lbl && lbl !== el) {
                return lbl.innerText.trim().replace(/\s+/g, ' ');
            }
        }
        return el.title || el.placeholder || el.name || el.id || el.tagName;
    }

    // Global Click Listener for both DEBUG and TRACE
    document.addEventListener('click', function(e) {
        const debugOn = LS_LOGGER.isDebugEnabled();
        const traceOn = LS_TRACER.isEnabled();
        if (!debugOn && !traceOn) return;

        try {
            const target = e.target;
            if (!target) return;
            // Ignore clicks inside debug/settings console and controls to avoid feedback loops
            if (target.closest && (target.closest('#tc-settings') || target.closest('#tc-debug') || target.closest('#ls-trace-badge') || target.closest('[id^="ls-setting-"]'))) return;

            const isInsideLs = !!(target.closest && (target.closest('#ls-panel') || target.closest('[id^="ls-"]') || target.closest('#ls-fab')));

            if (isInsideLs) {
                const desc = describeLsUiElement(target);
                if (desc) {
                    if (debugOn) {
                        LS_LOGGER.log('ACTION', 'UI', desc.summary, desc.details, 'DEBUG');
                    }
                    if (traceOn) {
                        LS_TRACER.record('UI_KLİK', desc.summary, desc.details);
                    }
                }
            } else {
                const desc = describeElement(target);
                if (desc) {
                    if (debugOn) {
                        LS_LOGGER.log('ACTION', 'GAME-UI', `Oyunda Tıklama: ${desc.summary}`, desc.details, 'DEBUG');
                    }
                    if (traceOn) {
                        LS_TRACER.record('KLİK', desc.summary, desc.details);
                    }
                }
            }
        } catch (err) {}
    }, true);

    // Global Keydown Listener for both DEBUG and TRACE
    document.addEventListener('keydown', function(e) {
        const debugOn = LS_LOGGER.isDebugEnabled();
        const traceOn = LS_TRACER.isEnabled();
        if (!debugOn && !traceOn) return;

        try {
            const code = e.code;
            const key = e.key;
            const isSpecialKey = ['Space', 'Enter', 'Escape', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(code);
            const isCombo = e.ctrlKey || e.altKey || e.metaKey;

            if (!isSpecialKey && !isCombo) return;

            const target = e.target;
            const targetDesc = target ? (target.id ? '#' + target.id : (target.tagName || '')) : '';
            const keyLabel = (e.ctrlKey ? 'Ctrl+' : '') + (e.altKey ? 'Alt+' : '') + (e.shiftKey ? 'Shift+' : '') + (code || key);
            const summary = `Tuş Basıldı: [${keyLabel}] (Hedef: ${targetDesc})`;
            const details = { code: code, key: key, target: targetDesc };

            if (debugOn) {
                LS_LOGGER.log('ACTION', 'KEYBOARD', summary, details, 'DEBUG');
            }
            if (traceOn) {
                LS_TRACER.record('TUŞ', summary, details);
            }
        } catch (err) {}
    }, true);

    // Global Change Listener for both DEBUG and TRACE
    document.addEventListener('change', function(e) {
        const debugOn = LS_LOGGER.isDebugEnabled();
        const traceOn = LS_TRACER.isEnabled();
        if (!debugOn && !traceOn) return;

        try {
            const target = e.target;
            if (!target) return;
            if (target.closest && (target.closest('#tc-settings') || target.closest('#tc-debug') || target.closest('#ls-trace-badge') || target.closest('[id^="ls-setting-"]'))) return;

            const isInsideLs = !!(target.closest && target.closest('#ls-panel'));
            const name = target.name || target.id || target.className || target.tagName;
            let val = target.value;
            if (target.type === 'checkbox' || target.type === 'radio') {
                val = target.checked ? 'SEÇİLİ' : 'SEÇİLİ DEĞİL';
            }

            if (isInsideLs) {
                const label = getLsInputLabel(target);
                const summary = `UI Ayar Değişti: [${label}] = "${val}"`;
                const details = { id: target.id, name: target.name, value: val, type: target.type };
                if (debugOn) {
                    LS_LOGGER.log('ACTION', 'UI', summary, details, 'DEBUG');
                }
                if (traceOn) {
                    LS_TRACER.record('UI_AYAR', summary, details);
                }
            } else {
                const summary = `Oyun Alanı Değişti: [${name}] = "${val}"`;
                const details = { id: target.id, name: target.name, value: val, type: target.type };
                if (debugOn) {
                    LS_LOGGER.log('ACTION', 'GAME-UI', summary, details, 'DEBUG');
                }
                if (traceOn) {
                    LS_TRACER.record('GİRDİ_DEĞİŞİMİ', summary, details);
                }
            }
        } catch (err) {}
    }, true);

    window.addEventListener('LS_BRIDGE_LOG', function(e) {
        if (e && e.detail) {
            LS_LOGGER.log(e.detail.level, e.detail.cat, e.detail.msg, e.detail.data);
        }
    });

    window.addEventListener('error', function(e) {
        if (LS_LOGGER.isDebugEnabled()) {
            LS_LOGGER.error('WINDOW', e.message || 'Window Error', (e.filename || '') + ':' + (e.lineno || ''));
        }
    });

    window.addEventListener('unhandledrejection', function(e) {
        if (LS_LOGGER.isDebugEnabled()) {
            LS_LOGGER.error('PROMISE', e.reason ? (e.reason.message || String(e.reason)) : 'Unhandled Promise Rejection');
        }
    });

    if (LS_TRACER.isEnabled()) {
        LS_TRACER.updateIndicator();
        LS_TRACER.snapshotPage('SAYFA_YÜKLENDİ', 'Yeni sayfa açıldı / yönlendirildi.');
    }
    initOgameNotificationObserver();

    let cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    let activeTab = localStorage.getItem(KEYS.TAB) || 'cart';
    if (activeTab === 'debug') activeTab = 'settings';
    let isPanelOpen = localStorage.getItem(KEYS.OPEN) === 'true';

    let generalSettings = {
        lang: localStorage.getItem(KEYS.LANG) || 'tr',
        theme: localStorage.getItem(KEYS.THEME) || 'dark',
        opacity: parseInt(localStorage.getItem(KEYS.OPACITY) || '100', 10),
        hoverFocus: localStorage.getItem(KEYS.HOVER_FOCUS) === 'true'
    };
    if (isNaN(generalSettings.opacity) || generalSettings.opacity < 20 || generalSettings.opacity > 100) {
        generalSettings.opacity = 100;
    }

    let isPanelHovered = false;

    function applyPanelOpacity() {
        const panel = document.getElementById('ls-panel');
        if (!panel) return;
        const targetOpacity = (generalSettings.opacity ?? 100) / 100;
        if (generalSettings.hoverFocus && isPanelHovered) {
            panel.style.opacity = '1';
        } else {
            panel.style.opacity = String(targetOpacity);
        }
    }

    function applyTheme(themeName) {
        generalSettings.theme = themeName || 'dark';
        localStorage.setItem(KEYS.THEME, generalSettings.theme);
        const panel = document.getElementById('ls-panel');
        const fab = document.getElementById('ls-fab');
        if (panel) {
            if (generalSettings.theme === 'fb') {
                panel.classList.add('ls-theme-fb');
            } else {
                panel.classList.remove('ls-theme-fb');
            }
        }
        if (fab) {
            if (generalSettings.theme === 'fb') {
                fab.classList.add('ls-theme-fb');
            } else {
                fab.classList.remove('ls-theme-fb');
            }
        }
        const themeSelect = document.getElementById('ls-setting-theme');
        if (themeSelect && themeSelect.value !== generalSettings.theme) {
            themeSelect.value = generalSettings.theme;
        }
        const themeBtnText = document.querySelector('#ls-setting-theme-button .ui-selectmenu-status, #ls-setting-theme-button .ui-selectmenu-text');
        if (themeBtnText) {
            themeBtnText.textContent = (generalSettings.theme === 'fb') ? t('settings_theme_fb') : t('settings_theme_dark');
        }
    }
    let scanSettings = JSON.parse(localStorage.getItem(KEYS.SCAN) || '{}');
    scanSettings = Object.assign({ gStart: 1, gEnd: 9, sStart: 1, sEnd: 499, slots: '8', minEmpty: 1 }, scanSettings);

    let collectorSettings = Object.assign({
        targetId: null,
        targetCoord: '',
        targetType: 1,
        targetName: '',
        manualTarget: false,
        mission: 3,
        priorityMode: 'speed',
        selectedShips: { bn: true, kn: true, rehber: false },
        selectedRes: { deu: true, cri: true, met: true },
        reserves: {},
        selectedItems: {}
    }, JSON.parse(localStorage.getItem(KEYS.COLLECTOR) || '{}'));
    if (!collectorSettings.priorityMode) collectorSettings.priorityMode = 'speed';

    function saveCollectorSettings() {
        localStorage.setItem(KEYS.COLLECTOR, JSON.stringify(collectorSettings));
    }

    let courierSettings = Object.assign({
        originId: null,
        originCoord: '',
        originType: 1,
        originName: '',
        mission: 3,
        priorityMode: 'speed',
        selectedShips: { bn: true, kn: true, rehber: false },
        syncEnabled: false,
        syncAmount: { met: 0, cri: 0, deu: 0 },
        targets: {},
        selectedItems: {}
    }, JSON.parse(localStorage.getItem(KEYS.COURIER) || '{}'));
    if (!courierSettings.priorityMode) courierSettings.priorityMode = 'speed';

    function saveCourierSettings() {
        localStorage.setItem(KEYS.COURIER, JSON.stringify(courierSettings));
    }

    let expeditionSettings = Object.assign({
        startCoord: '',
        count: 1,
        templateId: '',
        templateName: ''
    }, JSON.parse(localStorage.getItem('LS_EXPEDITION_SETTINGS') || '{}'));

    function saveExpeditionSettings() {
        localStorage.setItem('LS_EXPEDITION_SETTINGS', JSON.stringify(expeditionSettings));
    }

    let alarmSettings = Object.assign({
        attackEnabled: true,
        espionageEnabled: true,
        attackSound: 'klaxon',
        espionageSound: 'sonar_deep',
        volume: 70,
        repeatInterval: 30
    }, JSON.parse(localStorage.getItem(KEYS.ALARM) || '{}'));

    if (alarmSettings.espionageSound === 'sonar' || alarmSettings.espionageSound === 'radar' || alarmSettings.espionageSound === 'bass') {
        if (alarmSettings.espionageSound === 'radar') alarmSettings.espionageSound = 'sonar_hunter';
        else if (alarmSettings.espionageSound === 'bass') alarmSettings.espionageSound = 'sonar_echo';
        else alarmSettings.espionageSound = 'sonar_deep';
    }

    function saveAlarmSettings() {
        localStorage.setItem(KEYS.ALARM, JSON.stringify(alarmSettings));
    }

    let debrisSettings = Object.assign({
        enabled: true,
        minThreshold: 100000,
        sound: 'sonar_deep'
    }, JSON.parse(localStorage.getItem(KEYS.DEBRIS_SETTINGS) || '{}'));

    let debrisList = JSON.parse(localStorage.getItem(KEYS.DEBRIS_LIST) || '[]');
    if (Array.isArray(debrisList)) {
        const initialCount = debrisList.length;
        debrisList = debrisList.filter(item => {
            return item && item.id && item.total > 0 && typeof item.g === 'number' && typeof item.s === 'number' && typeof item.p === 'number';
        });
        if (debrisList.length !== initialCount) {
            localStorage.setItem(KEYS.DEBRIS_LIST, JSON.stringify(debrisList));
        }
    }

    // Kaç kademe ekleneceği (+1, +2, +3...)
    let selectedLevelsToAdd = 1;

    // ============================================================
    // HELPERS
    // ============================================================
    function fmt(n) {
        if (n < 0) return '-' + Math.abs(Number(n)).toLocaleString('tr-TR');
        return Number(n).toLocaleString('tr-TR');
    }

    function formatShort(n) {
        if (n === null || n === undefined || isNaN(n)) return '-';
        n = Number(n);
        if (n === 0) return '0';
        const abs = Math.abs(n);
        const sign = n < 0 ? '-' : '';
        if (abs >= 1e9) {
            let v = (abs / 1e9).toFixed(1);
            if (v.endsWith('.0')) v = v.slice(0, -2);
            return sign + v + 'Mrd';
        }
        if (abs >= 1e6) {
            let v = (abs / 1e6).toFixed(1);
            if (v.endsWith('.0')) v = v.slice(0, -2);
            return sign + v + 'M';
        }
        if (abs >= 1e3) {
            let v = (abs / 1e3).toFixed(1);
            if (v.endsWith('.0')) v = v.slice(0, -2);
            return sign + v + 'K';
        }
        return sign + String(abs);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function parseOgNum(str) {
        if (!str) return 0;
        str = String(str).trim();
        if (str === '0' || str === '-') return 0;

        let neg = str.startsWith('-') ? -1 : 1;
        str = str.replace(/^-/, '');

        // Güvenlik önlemi: Eğer kazara yapışık iki token (örn: 21,6K21,8K0) geldiyse, sadece ilkini al
        const gluedMatch = str.match(/^([0-9]+(?:[.,][0-9]+)*[ \t]*(?:mrd|mn|[kKmMbBrd])?)/i);
        if (gluedMatch && gluedMatch[1].length < str.length && /[0-9]/.test(str.substring(gluedMatch[1].length))) {
            str = gluedMatch[1];
        }

        let mult = 1;
        if (/mrd$/i.test(str)) mult = 1e9;
        else if (/mn$/i.test(str)) mult = 1e6;
        else if (/m$/i.test(str)) mult = 1e6;
        else if (/k$/i.test(str)) mult = 1e3;

        let numStr = str.replace(/[^0-9.,]/g, '');
        if (mult > 1) {
            // Sonek varsa (k, m, mrd), nokta veya virgül ondalık basamaktır (örn: 36,4K veya 1.5M)
            if (numStr.includes(',') && numStr.includes('.')) {
                numStr = numStr.replace(/\./g, '').replace(',', '.');
            } else if (numStr.includes(',')) {
                numStr = numStr.replace(',', '.');
            }
        } else {
            // Sonek yoksa (tam sayı), nokta ve virgül OGame'de binlik ayracıdır (örn: 36.423 veya 1.250.000)
            numStr = numStr.replace(/[.,]/g, '');
        }

        const val = parseFloat(numStr) || 0;
        return Math.round(neg * val * mult);
    }

    function getLiveResources() {
        const readRes = (id) => {
            const el = document.getElementById(id);
            if (!el) return 0;
            const raw = el.getAttribute('data-raw') || el.getAttribute('data-value');
            if (raw) {
                const parsed = parseInt(raw, 10);
                if (!isNaN(parsed) && parsed >= 0) return parsed;
            }
            return parseOgNum(el.textContent);
        };
        return {
            metal: readRes('resources_metal'),
            crystal: readRes('resources_crystal'),
            deuterium: readRes('resources_deuterium')
        };
    }

    function getCurrentPlanetName() {
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const isMoon = (metaType === 'moon');

        // 1. Sidebar'daki aktif gezegen linki
        const activeEl = document.querySelector('#planetList .smallplanet a.active .planet-name') ||
                         document.querySelector('#planetList .smallplanet.hightlightStaff .planet-name') ||
                         document.querySelector('#planetList .smallplanet.active .planet-name') ||
                         document.querySelector('#myPlanets .smallplanet.hightlightStaff .planet-name') ||
                         document.querySelector('#myPlanets .smallplanet a.active .planet-name') ||
                         document.querySelector('.smallplanet.hightlightStaff .planet-name') ||
                         document.querySelector('.smallplanet a.active .planet-name') ||
                         document.querySelector('#planetList a.active .planet-name') ||
                         document.querySelector('#planetList .smallplanet.selected .planet-name');

        // 2. Aktif Ay seçimi varsa
        const activeMoon = document.querySelector('#planetList .moonlink.active') ||
                           document.querySelector('.smallplanet .moonlink.active');
        if (activeMoon || isMoon) {
            let parentName = '';
            if (activeEl && activeEl.textContent.trim()) {
                parentName = activeEl.textContent.trim();
            } else if (activeMoon) {
                const parentP = activeMoon.closest('.smallplanet');
                const pNameEl = parentP ? parentP.querySelector('.planet-name') : null;
                if (pNameEl && pNameEl.textContent.trim()) parentName = pNameEl.textContent.trim();
            }
            if (parentName) return `${parentName} ( Ay )`;

            const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content');
            if (metaCoords) {
                const emp = getEmpirePlanetsAndMoons();
                const matched = emp.find(p => p.coords === metaCoords);
                if (matched && matched.name) return `${matched.name} ( Ay )`;
            }

            if (activeMoon) {
                const moonTitle = activeMoon.getAttribute('title') || activeMoon.textContent;
                if (moonTitle && moonTitle.trim()) {
                    const raw = moonTitle.split('[')[0].trim();
                    if (raw && raw !== 'Ay') return `${raw} ( Ay )`;
                }
            }
            return 'Gezegen ( Ay )';
        }

        if (activeEl && activeEl.textContent.trim()) {
            return activeEl.textContent.trim();
        }

        // 3. OGame resmi meta etiketi (Sunucu tarafından aktif gezegene göre üretilir)
        const metaName = document.querySelector('meta[name="ogame-planet-name"]')?.getAttribute('content');
        if (metaName && metaName.trim()) {
            return isMoon ? `${metaName.trim()} ( Ay )` : metaName.trim();
        }

        // 4. Üst başlık veya seçili gezegen başlığı
        const headerEl = document.querySelector('#planetNameHeader') ||
                         document.querySelector('#selectedPlanetName') ||
                         document.querySelector('.planet-header .planet-name');
        if (headerEl && headerEl.textContent.trim()) {
            return isMoon ? `${headerEl.textContent.trim()} ( Ay )` : headerEl.textContent.trim();
        }

        return isMoon ? 'Gezegen ( Ay )' : 'Gezegen';
    }

    // ============================================================
    // OGAME RESMİ ARTIŞ FAKTÖRLERİ & BİNA VERİLERİ (Gameforge & Infinity BUIDLING_INFO)
    // ============================================================
    const LF_BUILDING_DATA = {
        // İnsan (Human: 11101 - 11112)
        11101: { name: 'Residential Sector', factor: 1.20, base: [7, 2, 0] },
        11102: { name: 'Biosphere Farm', factor: 1.23, base: [5, 2, 0] },
        11103: { name: 'Research Centre', factor: 1.30, base: [20000, 25000, 10000] },
        11104: { name: 'Academy of Sciences', factor: 1.70, base: [5000, 3200, 1500] },
        11105: { name: 'Neuro-Calibration Centre', factor: 1.70, base: [50000, 40000, 50000] },
        11106: { name: 'High Energy Smelting', factor: 1.50, base: [9000, 6000, 3000] },
        11107: { name: 'Food Silo', factor: 1.09, base: [25000, 13000, 7000] },
        11108: { name: 'Fusion-Powered Production', factor: 1.50, base: [50000, 25000, 15000] },
        11109: { name: 'Skyscraper', factor: 1.09, base: [75000, 20000, 25000] },
        11110: { name: 'Biotech Lab', factor: 1.12, base: [150000, 30000, 15000] },
        11111: { name: 'Metropolis', factor: 1.50, base: [80000, 35000, 60000] },
        11112: { name: 'Planetary Shield', factor: 1.15, base: [250000, 125000, 125000] },

        // Rock'tal (12101 - 12112)
        12101: { name: 'Meditation Enclave', factor: 1.20, base: [9, 3, 0] },
        12102: { name: 'Crystal Farm', factor: 1.20, base: [7, 2, 0] },
        12103: { name: 'Rune Technologium', factor: 1.30, base: [40000, 10000, 15000] },
        12104: { name: 'Rune Forge', factor: 1.70, base: [5000, 3800, 1000] },
        12105: { name: 'Oriktorium', factor: 1.65, base: [50000, 40000, 50000] },
        12106: { name: 'Magma Forge', factor: 1.40, base: [10000, 8000, 1000] },
        12107: { name: 'Disruption Chamber', factor: 1.20, base: [20000, 15000, 10000] },
        12108: { name: 'Megalith', factor: 1.50, base: [50000, 35000, 15000] },
        12109: { name: 'Crystal Refinery', factor: 1.40, base: [85000, 44000, 25000] },
        12110: { name: 'Deuterium Synthesiser', factor: 1.40, base: [120000, 50000, 20000] },
        12111: { name: 'Mineral Research Centre', factor: 1.80, base: [250000, 150000, 100000] },
        12112: { name: 'Advanced Recycling Plant', factor: 1.50, base: [250000, 125000, 125000] },

        // Mecha (13101 - 13112)
        13101: { name: 'Assembly Line', factor: 1.21, base: [6, 2, 0] },
        13102: { name: 'Fusion Cell Factory', factor: 1.18, base: [5, 2, 0] },
        13103: { name: 'Robotics Research Centre', factor: 1.30, base: [30000, 20000, 10000] },
        13104: { name: 'Update Network', factor: 1.80, base: [5000, 3800, 1000] },
        13105: { name: 'Quantum Computer Centre', factor: 1.80, base: [50000, 40000, 50000] },
        13106: { name: 'Automatised Assembly Centre', factor: 1.30, base: [7500, 7000, 1000] },
        13107: { name: 'High-Performance Transformer', factor: 1.50, base: [35000, 15000, 10000] },
        13108: { name: 'Microchip Assembly Line', factor: 1.07, base: [50000, 20000, 30000] },
        13109: { name: 'Production Assembly Hall', factor: 1.14, base: [100000, 10000, 3000] },
        13110: { name: 'High-Performance Synthesiser', factor: 1.50, base: [100000, 40000, 20000] },
        13111: { name: 'Chip Mass Production', factor: 1.50, base: [55000, 50000, 30000] },
        13112: { name: 'Nano Repair Bots', factor: 1.40, base: [250000, 125000, 125000] },

        // Kaelesh (14101 - 14112)
        14101: { name: 'Sanctuary', factor: 1.21, base: [4, 3, 0] },
        14102: { name: 'Antimatter Condenser', factor: 1.20, base: [6, 3, 0] },
        14103: { name: 'Vortex Chamber', factor: 1.30, base: [20000, 15000, 15000] },
        14104: { name: 'Halls of Realisation', factor: 1.80, base: [7500, 5000, 800] },
        14105: { name: 'Forum of Transcendence', factor: 1.80, base: [60000, 30000, 50000] },
        14106: { name: 'Antimatter Convector', factor: 1.25, base: [8500, 5000, 3000] },
        14107: { name: 'Cloning Laboratory', factor: 1.20, base: [15000, 15000, 5000] },
        14108: { name: 'Chrysalis Accelerator', factor: 1.05, base: [75000, 25000, 30000] },
        14109: { name: 'Bio Modifier', factor: 1.20, base: [87500, 25000, 30000] },
        14110: { name: 'Psionic Modulator', factor: 1.40, base: [150000, 30000, 30000] },
        14111: { name: 'Ship Manufacturing Hall', factor: 1.20, base: [75000, 50000, 55000] },
        14112: { name: 'Supra Refractor', factor: 1.40, base: [500000, 250000, 250000] }
    };

    function getTechnologyId(popup) {
        try {
            if (!popup) popup = document.getElementById('technologydetails');
            if (!popup) return null;

            let tid = popup.getAttribute('data-technology-id') || popup.getAttribute('data-technology');
            if (tid && parseInt(tid, 10) > 0) return parseInt(tid, 10);

            const elWithTech = popup.querySelector('[data-technology-id], [data-technology], .upgrade[data-technology], .action a[data-technology]');
            if (elWithTech) {
                tid = elWithTech.getAttribute('data-technology-id') || elWithTech.getAttribute('data-technology');
                if (tid && parseInt(tid, 10) > 0) return parseInt(tid, 10);
            }

            const activeTech = document.querySelector('.technology.showsDetails, .technology.active, .hasDetails.showsDetails');
            if (activeTech) {
                tid = activeTech.getAttribute('data-technology') || activeTech.getAttribute('data-technology-id');
                if (tid && parseInt(tid, 10) > 0) return parseInt(tid, 10);
            }

            const rawClass = String(popup.className || '') + ' ' + String(popup.querySelector('.lifeformsprite, .sprite')?.className || '');
            const classMatch = rawClass.match(/(?:tech|technologydetails_|technology-)(\d+)/i);
            if (classMatch && parseInt(classMatch[1], 10) > 0) {
                return parseInt(classMatch[1], 10);
            }
        } catch (e) {}

        return null;
    }

    function checkIsLifeform(name, techId) {
        if (techId && techId >= 11101 && techId <= 19999) return true;
        const n = (name || '').toLowerCase();
        if (window.location.href.includes('lfbuildings') || 
            window.location.href.includes('lfresearch') || 
            window.location.href.includes('lifeform')) return true;

        if (document.querySelector('.lfbuildings, .lfresearch, #technologies.lifeform, #lifeformresearch')) return true;

        const lfKeywords = [
            'üretim hattı', 'montaj hattı', 'füzyon hücresi', 'robotik araştırma', 'güncelleme ağı',
            'kuantum bilgisayar', 'otomatik montaj', 'otomatize montaj', 'transformatör', 'mikroçip',
            'montaj salonu', 'montaj holü', 'üretim montaj', 'sentezleyici', 'çip seri', 'nano onarım',
            'yaşam alanı', 'konut alanı', 'yerleşim', 'biyosfer', 'bilim akademisi', 'nöro-kalibrasyon', 'noro-kalibrasyon',
            'ergitme', 'gıda silosu', 'gökdelen', 'biyoteknoloji', 'metropol', 'gezegensel kalkan',
            'meditasyon', 'kristal çiftliği', 'kristal rafinerisi', 'rün teknoloji', 'rün demirci',
            'oriktor', 'magma demirci', 'ayrışma odası', 'megalit', 'kaya anıtı', 'mineral rafinerisi',
            'volkanik batarya', 'maden araştırma', 'mineral araştırma', 'geri dönüşüm tesisi',
            'barınak', 'antimadde yoğunlaştırıcı', 'vorteks', 'farkındalık salonu', 'aşkınlık forumu',
            'antimadde konvektörü', 'klonlama', 'krizalit', 'biyo değiştirici', 'psişik modülatör',
            'yerçekimi odası', 'dönüşüm alanı'
        ];
        return lfKeywords.some(kw => n.includes(kw));
    }

    function getGrowthFactor(name, techId) {
        if (techId && LF_BUILDING_DATA[techId]) {
            return LF_BUILDING_DATA[techId].factor;
        }

        const n = (name || '').toLowerCase().trim();

        // --- İNSAN (HUMAN) BİNALARI (11101 - 11112) ---
        if (n.includes('yerleşim') || n.includes('yaşam alanı') || n.includes('konut alanı') || n.includes('residential sector') || (n.includes('konut') && !n.includes('çiftlik'))) return 1.20;
        if (n.includes('biyosfer') || n.includes('biosphere')) return 1.23;
        if ((n.includes('araştırma merkezi') || n.includes('research centre')) && !n.includes('robotik') && !n.includes('mineral') && !n.includes('maden')) return 1.30;
        if (n.includes('bilim akademisi') || n.includes('academy of sciences')) return 1.70;
        if (n.includes('nöro-kalibrasyon') || n.includes('noro') || n.includes('neuro-calibration')) return 1.70;
        if (n.includes('ergitme') || n.includes('high energy smelting')) return 1.50;
        if (n.includes('gıda silosu') || n.includes('food silo')) return 1.09;
        if (n.includes('füzyon enerji santrali') || n.includes('fusion-powered') || (n.includes('füzyon') && n.includes('üretim'))) return 1.50;
        if (n.includes('gökdelen') || n.includes('skyscraper')) return 1.09;
        if (n.includes('biyoteknoloji') || n.includes('biotech')) return 1.12;
        if (n.includes('metropol') || n.includes('metropolis')) return 1.50;
        if ((n.includes('kalkan') || n.includes('shield')) && (n.includes('gezegensel') || n.includes('planetary'))) return 1.15;

        // --- ROCK'TAL BİNALARI (12101 - 12112) ---
        if (n.includes('meditasyon') || n.includes('meditation')) return 1.20;
        if (n.includes('kristal rafinerisi') || n.includes('crystal refinery')) return 1.40;
        if (n.includes('kristal çiftliği') || (n.includes('kristal') && (n.includes('çiftlik') || n.includes('farm')))) return 1.20;
        if (n.includes('rün teknoloji') || n.includes('rune technol')) return 1.30;
        if (n.includes('rün demirci') || n.includes('rune forge')) return 1.70;
        if (n.includes('oriktor')) return 1.65;
        if (n.includes('magma demirci') || n.includes('magma forge')) return 1.40;
        if (n.includes('ayrışma odası') || n.includes('disruption chamber')) return 1.20;
        if (n.includes('kaya anıtı') || n.includes('megalit') || n.includes('megalith')) return 1.50;
        if (n.includes('mineral rafinerisi') || n.includes('mineral refinery')) return 1.40;
        if (n.includes('volkanik batarya') || n.includes('volcanic batter')) return 1.40;
        if (n.includes('mineral araştırma') || n.includes('maden araştırma') || n.includes('mineral research')) return 1.80;
        if (n.includes('geri dönüşüm tesisi') || n.includes('advanced recycling')) return 1.50;

        // --- MECHA BİNALARI (13101 - 13112) ---
        if (n.includes('üretim hattı') || n.includes('montaj hattı') || n.includes('assembly line')) return 1.21;
        if (n.includes('füzyon hücresi') || n.includes('fusion cell')) return 1.18;
        if (n.includes('robotik araştırma') || n.includes('robotics research')) return 1.30;
        if (n.includes('güncelleme ağı') || n.includes('update network')) return 1.80;
        if (n.includes('kuantum bilgisayar') || n.includes('quantum computer')) return 1.80;
        if (n.includes('otomatik montaj') || n.includes('otomatize montaj') || n.includes('automatised assembly')) return 1.30;
        if (n.includes('transformatör') || n.includes('transformer')) return 1.50;
        if (n.includes('mikroçip') || n.includes('microchip')) return 1.07;
        if (n.includes('montaj holü') || n.includes('montaj salonu') || n.includes('üretim montaj') || n.includes('assembly hall')) return 1.14;
        if (n.includes('sentezleyici') || n.includes('synthesiser') || n.includes('synthesizer')) return 1.50;
        if (n.includes('çip seri') || n.includes('chip mass')) return 1.50;
        if (n.includes('nano onarım') || n.includes('nano repair')) return 1.40;

        // --- KAELESH BİNALARI (14101 - 14112) ---
        if (n.includes('barınak') || n.includes('sanctuary') || (n.includes('sığınak') && !n.includes('meditasyon'))) return 1.21;
        if (n.includes('antimadde yoğunlaştırıcı') || n.includes('antimatter condenser')) return 1.20;
        if (n.includes('vorteks') || n.includes('vortex')) return 1.30;
        if (n.includes('farkındalık salonu') || n.includes('hall of realisation') || n.includes('hall of realization')) return 1.80;
        if (n.includes('aşkınlık forumu') || n.includes('forum of transcendence')) return 1.80;
        if (n.includes('antimadde konvektörü') || n.includes('antimatter convector')) return 1.25;
        if (n.includes('klonlama') || n.includes('cloning')) return 1.20;
        if (n.includes('krizalit') || n.includes('chrysalite') || n.includes('chrysalis')) return 1.05;
        if (n.includes('biyo değiştirici') || n.includes('bio modifier')) return 1.20;
        if (n.includes('psişik modülatör') || n.includes('psionic modulator')) return 1.40;
        if (n.includes('yerçekimi odası') || n.includes('gravity well') || n.includes('ship manufacturing')) return 1.20;
        if (n.includes('dönüşüm alanı') || n.includes('distortion field') || n.includes('supra refractor')) return 1.40;

        // --- CANLI TÜRÜ GENEL NÜFUS / ÇİFTLİK / ARAŞTIRMA MERKEZİ ---
        if (n.includes('sığınak') || n.includes('habitat') || n.includes('çiftlik') || n.includes('sektör')) return 1.20;
        if (n.includes('araştırma merkezi')) return 1.30;

        // --- CANLI TÜRÜ ARAŞTIRMALARI (LF Technologies) ---
        if (n.includes('süper bilgisayar') || n.includes('sapan otopilot') || n.includes('iyon kristali modülleri') || n.includes('psionic network') || n.includes('telekinetik')) return 1.20;
        if (n.includes('elçi') || n.includes('yörünge') || n.includes('gizlilik') || n.includes('itici') || n.includes('terraformer') || n.includes('yapay zeka') || n.includes('süperiletken')) return 1.30;
        if (n.includes('obsidyen') || n.includes('plazma tahrik') || n.includes('verimli tozlaştırma')) return 1.40;
        if (n.includes('güçlendirmesi') && (n.includes('toplayıcı') || n.includes('general') || n.includes('kaşif'))) return 1.70;
        if (window.location.href.includes('lfresearch')) return 1.50;
        if (window.location.href.includes('lfbuildings')) return 1.30;

        // --- KLASİK OGAME (Madenler & Standart Yapılar) ---
        if (n.includes('kristal madeni')) return 1.60;
        if (n.includes('metal madeni') || n.includes('deuterium sentezleyicisi') || n.includes('döteryum sentezleyicisi') || n.includes('güneş enerji')) return 1.50;
        if (n.includes('füzyon')) return 1.80;
        if (n.includes('astrofizik')) return 1.75;

        // Klasik OGame araştırmaları ve tesisler
        return 2.00;
    }

    // ============================================================
    // TEK KADEME TABAN MALİYETİNİ OKUMA (OGame DOM)
    // ============================================================
    function parseNextLevelBaseCost(popup) {
        let m = 0, c = 0, d = 0;

        const costLis = popup.querySelectorAll('li.metal, li.crystal, li.deuterium');
        costLis.forEach(li => {
            const cls = li.className.toLowerCase();
            const dv = li.getAttribute('data-value') || li.getAttribute('data-total');
            // Infinity'nin enjekte ettiği alt elemanları (.ogk-sum, .overmark vs.) çıkararak temiz text al
            let cleanLi = li.cloneNode(true);
            cleanLi.querySelectorAll('.ogk-sum, .overmark, .undermark').forEach(el => el.remove());
            const val = dv ? parseInt(dv, 10) : parseOgNum(cleanLi.textContent);
            if (val > 0) {
                if (cls.includes('metal')) m = val;
                else if (cls.includes('crystal')) c = val;
                else if (cls.includes('deuterium')) d = val;
            }
        });

        if (m === 0 && c === 0) {
            const txt = popup.textContent || '';
            const mMatch = txt.match(/Metal[:\s]+([0-9.,]+\s*[kKmMnNrRdD]*)/);
            const cMatch = txt.match(/Kristal[:\s]+([0-9.,]+\s*[kKmMnNrRdD]*)/);
            const dMatch = txt.match(/Deuter[iy]um[:\s]+([0-9.,]+\s*[kKmMnNrRdD]*)/);
            if (mMatch) m = parseOgNum(mMatch[1]);
            if (cMatch) c = parseOgNum(cMatch[1]);
            if (dMatch) d = parseOgNum(dMatch[1]);
        }

        return { metal: m, crystal: c, deuterium: d };
    }

    // ============================================================
    // ÇOKLU KADEME HESAPLAYICI (Infinity Uyumu & Formül Tabanlı)
    // ============================================================
    function parseCostsFromPopup() {
        const popup = document.getElementById('technologydetails');
        if (!popup) return null;

        const result = {
            name: 'Bilinmeyen',
            level: null,
            planet: getCurrentPlanetName(),
            metal: 0,
            crystal: 0,
            deuterium: 0,
            count: 1
        };

        const h3 = popup.querySelector('h3');
        if (h3) result.name = h3.textContent.replace(/\s+/g, ' ').trim();

        const txt = popup.textContent || '';
        const lvlMatch = txt.match(/(?:[Kk]ademe|[Ss]eviye|[Ll]evel)\s+(\d+)/);
        let currentLevel = 0;
        if (lvlMatch) {
            currentLevel = parseInt(lvlMatch[1], 10);
        }

        // Tersane / Savunma adet kontrolü
        const qtyInput = popup.querySelector('#build_amount') ||
                         popup.querySelector('input[name="amount"]') ||
                         popup.querySelector('input#amount');
        if (qtyInput) {
            const rawVal = qtyInput.value ? qtyInput.value.replace(/\./g, '').replace(/,/g, '').trim() : '';
            const q = parseInt(rawVal, 10);
            if (!isNaN(q) && q > 0) result.count = q;
            const base = parseNextLevelBaseCost(popup);
            result.metal = base.metal * result.count;
            result.crystal = base.crystal * result.count;
            result.deuterium = base.deuterium * result.count;
            result.level = 'x' + fmt(result.count);
            return result;
        }

        const nextLvl = currentLevel + 1;
        const targetLvl = currentLevel + selectedLevelsToAdd;

        if (selectedLevelsToAdd === 1) {
            result.level = String(nextLvl);
        } else {
            result.level = `${nextLvl} → ${targetLvl}`;
        }

        const techId = getTechnologyId(popup);
        const baseCost = parseNextLevelBaseCost(popup);
        const isLifeform = checkIsLifeform(result.name, techId);
        const factor = getGrowthFactor(result.name, techId);

        let totM = 0, totC = 0, totD = 0;
        let directParsed = false;

        // 1. ÖNCELİK: Infinity Eklentisinin DOM değerlerini okuma
        // Infinity açık ve hedef seviyeye getirilmişse eklediği .ogk-sum değerlerini %100 birebir al
        if (selectedLevelsToAdd > 1) {
            const infLvlEl = popup.querySelector('.ogk-lvl') || document.querySelector('.ogk-lvl');
            const infTargetLvl = infLvlEl ? parseInt(infLvlEl.textContent.replace(/\D/g, ''), 10) : null;

            const metalSumEl = popup.querySelector('.costs .metal .ogk-sum') || document.querySelector('.costs .metal .ogk-sum');
            const crystalSumEl = popup.querySelector('.costs .crystal .ogk-sum') || document.querySelector('.costs .crystal .ogk-sum');
            const deutSumEl = popup.querySelector('.costs .deuterium .ogk-sum') || document.querySelector('.costs .deuterium .ogk-sum');

            if (metalSumEl || crystalSumEl || deutSumEl) {
                if (infTargetLvl === targetLvl || !infTargetLvl) {
                    const readVal = (el) => {
                        if (!el) return 0;
                        const dt = el.getAttribute('data-title');
                        if (dt) {
                            const parsed = parseOgNum(dt);
                            if (parsed > 0) return parsed;
                        }
                        return parseOgNum(el.textContent);
                    };

                    const infM = readVal(metalSumEl);
                    const infC = readVal(crystalSumEl);
                    const infD = readVal(deutSumEl);

                    if (infM > 0 || infC > 0 || infD > 0) {
                        totM = infM;
                        totC = infC;
                        totD = infD;
                        directParsed = true;
                    }
                }
            }

            // 2. ÖNCELİK: Metin içi aralık eşleşmesi
            if (!directParsed) {
                const popupText = popup.innerText || popup.textContent || '';
                const rangePattern = new RegExp(`(?:^|\\s)${nextLvl}\\s*-\\s*${targetLvl}\\s+([0-9.,]+[kKmMnNrRdD]?)(?:\\s+([0-9.,]+[kKmMnNrRdD]?))?(?:\\s+([0-9.,]+[kKmMnNrRdD]?))?`, 'im');
                const rangeMatch = popupText.match(rangePattern);
                if (rangeMatch) {
                    const parsedM = parseOgNum(rangeMatch[1]);
                    const parsedC = rangeMatch[2] ? parseOgNum(rangeMatch[2]) : 0;
                    const parsedD = rangeMatch[3] ? parseOgNum(rangeMatch[3]) : 0;
                    if (parsedM > 0 || parsedC > 0) {
                        totM = parsedM;
                        totC = parsedC;
                        totD = parsedD;
                        directParsed = true;
                    }
                }
            }
        }

        // 3. YÖNTEM: Matematiksel formül ile hesaplama (Resmi GF formülü + Math.floor)
        if (!directParsed) {
            let curM = baseCost.metal, curC = baseCost.crystal, curD = baseCost.deuterium;

            for (let step = 0; step < selectedLevelsToAdd; step++) {
                if (step === 0) {
                    totM += curM;
                    totC += curC;
                    totD += curD;
                } else {
                    const thisLvl = nextLvl + step;
                    const prevLvl = thisLvl - 1;

                    if (isLifeform && prevLvl > 0) {
                        // Gameforge / Infinity resmi formülü:
                        // Cost(L) = Math.floor(Cost(L-1) * Factor * (L / (L-1)))
                        curM = Math.floor(curM * factor * (thisLvl / prevLvl));
                        curC = Math.floor(curC * factor * (thisLvl / prevLvl));
                        curD = Math.floor(curD * factor * (thisLvl / prevLvl));
                    } else {
                        // Klasik OGame formülü: Cost(L) = Math.floor(Cost(L-1) * Factor)
                        curM = Math.floor(curM * factor);
                        curC = Math.floor(curC * factor);
                        curD = Math.floor(curD * factor);
                    }

                    totM += curM;
                    totC += curC;
                    totD += curD;
                }
            }
        }

        result.metal = totM;
        result.crystal = totC;
        result.deuterium = totD;

        console.log(LS, result.name, result.level, `(TechID: ${techId}, IsLF: ${isLifeform}, Faktör: ${factor}, Direct: ${directParsed}) ->`, result);
        return result;
    }

    // ============================================================
    // CART LOGIC
    // ============================================================
    function saveCart() { localStorage.setItem(KEYS.CART, JSON.stringify(cart)); }

    function addToCart() {
        const data = parseCostsFromPopup();
        if (!data) return;
        if (data.metal === 0 && data.crystal === 0 && data.deuterium === 0) return;

        const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const isMoon = (metaType === 'moon');

        cart.push({
            id: Date.now() + Math.random().toString(36).substring(2, 6),
            name: data.name,
            level: data.level,
            planet: data.planet,
            coords: metaCoords,
            type: isMoon ? 3 : 1,
            metal: data.metal,
            crystal: data.crystal,
            deuterium: data.deuterium,
            count: data.count,
            isDeduction: false,
            checked: true
        });
        const cartKey = metaCoords + '_' + (isMoon ? 3 : 1);
        const pPrefs = getCartPlanetPrefs();
        if (!pPrefs[cartKey]) pPrefs[cartKey] = {};
        if (!pPrefs[cartKey].mission) {
            pPrefs[cartKey].mission = getCartOrigin().mission || 3;
            saveCartPlanetPrefs(pPrefs);
        }
        saveCart();
        renderCart();
        LS_LOGGER.action('CART', `Sepete eklendi: ${data.name} (${data.level || 'x' + data.count})`, { metal: data.metal, crystal: data.crystal, deuterium: data.deuterium, coords: metaCoords });

        const btn = document.getElementById('ls-add-cart-btn');
        if (btn) {
            btn.textContent = '✓ Eklendi!';
            btn.style.background = '#2ecc71';
            btn.style.borderColor = '#27ae60';
            setTimeout(() => {
                btn.style.background = '';
                btn.style.borderColor = '';
                updateButtonLabel();
            }, 1200);
        }
    }

    function deductPlanetResources(targetCoords, targetType, targetName) {
        const live = getLiveResources();
        const pName = getCurrentPlanetName();
        const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const isMoon = (metaType === 'moon');
        const curType = isMoon ? 3 : 1;

        if (targetCoords && (metaCoords !== targetCoords || curType !== (targetType || 1))) {
            alert(currentLang === 'tr'
                ? `⚠️ Bu gezegenin canlı kaynaklarını düşmek için önce ${targetName || 'Hedef'} [${targetCoords}] gezegenine/ayına geçmelisiniz!`
                : `⚠️ To deduct live resources, first switch to ${targetName || 'Target'} [${targetCoords}] planet/moon!`);
            return;
        }

        if (live.metal === 0 && live.crystal === 0 && live.deuterium === 0) {
            alert(currentLang === 'tr' ? 'Bu gezegende kaynak bulunamadı veya okunamadı.' : 'No resources found or readable on this planet/moon.');
            return;
        }

        cart.push({
            id: Date.now() + Math.random().toString(36).substring(2, 6),
            name: (currentLang === 'tr' ? 'Mevcut Kaynak' : 'Available Resources'),
            level: null,
            planet: pName || (isMoon ? t('coll_moon_name') : t('coll_planet_name')),
            coords: metaCoords,
            type: curType,
            metal: -live.metal,
            crystal: -live.crystal,
            deuterium: -live.deuterium,
            count: 1,
            isDeduction: true,
            checked: true
        });
        const cartKey = metaCoords + '_' + (isMoon ? 3 : 1);
        const pPrefs = getCartPlanetPrefs();
        if (!pPrefs[cartKey]) pPrefs[cartKey] = {};
        if (!pPrefs[cartKey].mission) {
            pPrefs[cartKey].mission = getCartOrigin().mission || 3;
            saveCartPlanetPrefs(pPrefs);
        }
        saveCart();
        renderCart();
        showCollectorToast(`✓ ${pName || metaCoords} mevcut kaynakları sepetten düşüldü.`);
    }

    function removeCartItem(idx) {
        cart.splice(idx, 1);
        saveCart();
        renderCart();
    }
    window.lsRemoveCartItem = removeCartItem;

    function removePlanetCart(key) {
        cart = cart.filter(item => {
            const itemKey = `${item.coords}_${item.type || 1}`;
            return itemKey !== key;
        });
        const pPrefs = getCartPlanetPrefs();
        delete pPrefs[key];
        saveCartPlanetPrefs(pPrefs);
        saveCart();
        renderCart();
        showCollectorToast('Gezegen sepeti kaldırıldı.');
    }

    function copyTextSafe(text, onSuccess, onError) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    if (typeof onSuccess === 'function') onSuccess();
                })
                .catch(() => {
                    fallback(text);
                });
        } else {
            fallback(text);
        }

        function fallback(t) {
            try {
                const ta = document.createElement('textarea');
                ta.value = t;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                const success = document.execCommand('copy');
                document.body.removeChild(ta);
                if (success) {
                    if (typeof onSuccess === 'function') onSuccess();
                } else {
                    if (typeof onError === 'function') onError();
                }
            } catch (e) {
                if (typeof onError === 'function') onError(e);
            }
        }
    }

    function copyNumber(val, elemId) {
        const absVal = Math.abs(val);
        copyTextSafe(String(absVal), () => {
            const el = document.getElementById(elemId);
            if (el) {
                const orig = el.textContent;
                el.textContent = '✓';
                el.style.color = '#2ecc71';
                setTimeout(() => { el.textContent = orig; el.style.color = ''; }, 1200);
            }
        });
    }



    // ============================================================
    // DİNAMİK GEMİ KAPASİTELERİ & FİLO SEÇİMİ
    // ============================================================
    let techCache = JSON.parse(localStorage.getItem(KEYS.TECH) || '{}');

    async function fetchResearchLevels() {
        if (techCache.ts && (Date.now() - techCache.ts < 24 * 3600 * 1000) && techCache.hyperspace !== undefined) {
            return techCache;
        }

        try {
            const resp = await fetch('/game/index.php?page=ingame&component=research');
            if (!resp.ok) return techCache;
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const readLvl = (techId) => {
                const el = doc.querySelector(`[data-technology="${techId}"], .technology[data-technology-id="${techId}"], li.technology${techId}`);
                if (!el) return 0;
                const lvlEl = el.querySelector('.level') || el.querySelector('.amount');
                if (lvlEl) {
                    const parsed = parseInt(lvlEl.textContent.replace(/\D/g, ''), 10);
                    if (!isNaN(parsed)) return parsed;
                }
                const attr = el.getAttribute('data-value') || el.getAttribute('data-total');
                if (attr) return parseInt(attr, 10) || 0;
                return 0;
            };

            const hyperspaceLvl = readLvl(114); // Hiperuzay Teknolojisi (Teknoloji ID 114)
            techCache = {
                ts: Date.now(),
                hyperspace: hyperspaceLvl
            };
            localStorage.setItem(KEYS.TECH, JSON.stringify(techCache));
            LS_LOGGER.info('CART', `Araştırma seviyeleri güncellendi: Hiperuzay=${techCache.hyperspace}`);
        } catch (e) {
            console.warn(LS, 'Araştırma seviyeleri çekilemedi:', e.message);
            LS_LOGGER.warn('CART', `Araştırma seviyeleri çekilemedi: ${e.message}`);
        }
        return techCache;
    }

    function execPageContext(fnOrCode) {
        // Main world actions are dispatched via bridge.js without CSP violations.
        try {
            if (typeof fnOrCode === 'function') fnOrCode();
        } catch (e) {}
    }

    function findSendFleetButton() {
        const el = document.getElementById('sendFleet') ||
                   document.querySelector('#sendFleet, a#sendFleet, button#sendFleet, .send_fleet');
        if (el && !el.getAttribute('data-mission')) return el;

        const allCandidates = document.querySelectorAll('button, a.btn_blue, a, div[role="button"]');
        for (const b of allCandidates) {
            const txt = (b.textContent || '').trim().toLowerCase();
            if (txt.includes('filo gönder') || txt === 'send fleet' || txt.includes('flotte versenden')) {
                return b;
            }
        }
        return el;
    }

    function calculateShipCapacities() {
        // OGame Formülü: Taban Kapasite * (1 + 0.05 * Hiperuzay Tekniği Seviyesi)
        const hyperLvl = techCache.hyperspace || 0;
        const bonus = 1 + (0.05 * hyperLvl);

        // Canlı türü veya sınıf bonusları varsa DOM'dan okunan gerçek tooltip kapasitesi önceliklidir
        const readFromTooltip = (shipId) => {
            const el = document.querySelector(`li.technology${shipId}, [data-technology="${shipId}"]`);
            if (el) {
                const title = el.getAttribute('title') || el.getAttribute('data-tooltip-title') || el.getAttribute('data-tooltip-content') || '';
                const m = title.match(/(?:Kapasite|Capacity|Ladekapazität)[^\d]*([0-9.,]+)/i);
                if (m) return parseOgNum(m[1]);
            }
            return 0;
        };

        const liveKN = readFromTooltip(202);
        const liveBN = readFromTooltip(203);
        const liveRehber = readFromTooltip(219);

        const knCap = liveKN > 0 ? liveKN : Math.floor(5000 * bonus);
        const bnCap = liveBN > 0 ? liveBN : Math.floor(25000 * bonus);
        const rehberCap = liveRehber > 0 ? liveRehber : Math.floor(10000 * bonus);

        return {
            kn: Math.max(5000, knCap),
            bn: Math.max(25000, bnCap),
            rehber: Math.max(10000, rehberCap)
        };
    }

    const getShipTechName = (shipId) => {
        if (shipId === 202) return 'transporterSmall';
        if (shipId === 203) return 'transporterLarge';
        if (shipId === 219) return 'explorer';
        if (shipId === 209) return 'recycler';
        return '';
    };

    const getShipEl = (shipId) => {
        const techName = getShipTechName(shipId);
        return document.querySelector(`[data-technology="${shipId}"] input`) ||
               document.querySelector(`li.technology${shipId} input`) ||
               document.querySelector(`input[name="am${shipId}"]`) ||
               (techName ? document.querySelector(`input[name="${techName}"]`) : null) ||
               document.querySelector(`#ship_${shipId}`) ||
               document.querySelector(`input[name="ship_${shipId}"]`);
    };

    const getAvailableCount = (shipId) => {
        const shipContainer = document.querySelector(`[data-technology="${shipId}"], li.technology${shipId}`);
        if (shipContainer) {
            const stockEl = shipContainer.querySelector('.stock, .amount, .amount_current');
            if (stockEl) {
                const parsed = parseOgNum(stockEl.textContent);
                if (parsed >= 0) return parsed;
            }
        }
        const input = getShipEl(shipId);
        if (input) {
            const maxAttr = input.getAttribute('data-max') || input.getAttribute('max');
            if (maxAttr) return parseInt(maxAttr, 10) || 0;
            const parent = input.closest('li') || input.parentElement;
            if (parent) {
                const amountEl = parent.querySelector('.amount, .amount_current, .stock');
                if (amountEl) {
                    const parsed = parseOgNum(amountEl.textContent);
                    if (parsed >= 0) return parsed;
                }
            }
        }
        return 0;
    };
    const getAvailableShipCount = getAvailableCount;

    const isLuckyElement = (el) => {
        if (!el) return true;
        return !!el.closest?.('#ls-panel, [id^="ls-"], .ls-custom, #ls-coll-floating-banner, #ls-cour-floating-banner, #ls-exp-floating-banner');
    };

    const setShipAmount = (shipId, amount) => {
        const targetVal = String(Math.max(0, parseInt(amount, 10) || 0));
        const inp = getShipEl(shipId);
        if (inp) {
            try {
                const proto = window.HTMLInputElement.prototype;
                const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (nativeSetter) {
                    nativeSetter.call(inp, targetVal);
                } else {
                    inp.value = targetVal;
                }
            } catch (e) {
                inp.value = targetVal;
            }

            ['focus', 'input', 'change', 'keydown', 'keyup', 'blur'].forEach(evt => {
                inp.dispatchEvent(new Event(evt, { bubbles: true, cancelable: true }));
            });
        }

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SELECT_SHIP', shipId: shipId, amount: parseInt(targetVal, 10) }
        }));
        return true;
    };

    function clickDevamButton() {
        const btn = document.getElementById('continueToFleet2') ||
                    document.querySelector('button.continue.toFleet2') ||
                    document.querySelector('button#continueToFleet2') ||
                    document.querySelector('a#continueToFleet2') ||
                    document.querySelector('#continueToFleet2') ||
                    document.querySelector('button.continue') ||
                    document.querySelector('a.continue') ||
                    document.querySelector('#fleet1 .continue') ||
                    document.querySelector('#fleet1 .btn_blue') ||
                    document.querySelector('#fleetdispatchcomponent button.continue') ||
                    document.querySelector('#fleetdispatchcomponent .continue');
        if (btn) {
            btn.click();
            return true;
        }
        return false;
    }

    function setFleetTargetCoords(g, s, p, type) {
        const galInp = document.getElementById('galaxy') || document.querySelector('input[name="galaxy"]');
        const sysInp = document.getElementById('system') || document.querySelector('input[name="system"]');
        const posInp = document.getElementById('position') || document.querySelector('input[name="position"]');
        const typeInp = document.getElementById('type') || document.querySelector('input[name="type"]');

        const targetType = parseInt(type, 10) || 1;

        const setVal = (el, val) => {
            if (!el) return;
            const targetVal = String(val);
            try {
                const proto = window.HTMLInputElement.prototype;
                const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (nativeSetter) {
                    nativeSetter.call(el, targetVal);
                } else {
                    el.value = targetVal;
                }
            } catch (e) {
                el.value = targetVal;
            }
            try {
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
            } catch (e) {}
        };

        if (galInp && g) setVal(galInp, g);
        if (sysInp && s) setVal(sysInp, s);
        if (posInp && p) setVal(posInp, p);
        if (typeInp) setVal(typeInp, targetType);

        if (targetType === 3) {
            const moonBtn = document.querySelector('#mbutton, [data-type="3"], [data-planet-type="3"], #fleet2 .moon, #fleet2 .planetType .moon');
            if (moonBtn && !moonBtn.classList.contains('selected') && !moonBtn.classList.contains('active')) {
                try { moonBtn.click(); } catch (e) {}
            }
        } else if (targetType === 2) {
            const debrisBtn = document.querySelector('#dbutton, [data-type="2"], [data-planet-type="2"], #fleet2 .debris');
            if (debrisBtn && !debrisBtn.classList.contains('selected') && !debrisBtn.classList.contains('active')) {
                try { debrisBtn.click(); } catch (e) {}
            }
        } else {
            const planetBtn = document.querySelector('#pbutton, [data-type="1"], [data-planet-type="1"], #fleet2 .planet, #fleet2 .planetType .planet');
            if (planetBtn && !planetBtn.classList.contains('selected') && !planetBtn.classList.contains('active')) {
                try { planetBtn.click(); } catch (e) {}
            }
        }

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SET_TARGET', targetType: targetType, g: g, s: s, p: p }
        }));
    }

    function setFleetMission(missionId) {
        const btn = document.getElementById('missionButton' + missionId) ||
                    document.querySelector(`[data-mission="${missionId}"]`) ||
                    document.querySelector(`li#missionButton${missionId} a`) ||
                    document.querySelector(`li#missionButton${missionId}`) ||
                    document.querySelector(`input[name="mission"][value="${missionId}"]`);
        if (btn) btn.click();

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SELECT_MISSION', missionId: missionId }
        }));
    }

    function advanceFleetStep(stepNum) {
        if (stepNum === 2) {
            const btn = document.getElementById('continueToFleet2') ||
                        document.querySelector('button.continue.toFleet2') ||
                        document.querySelector('#fleet1 button.continue');
            if (btn) btn.click();
        } else if (stepNum === 3) {
            const btn = document.getElementById('continueToFleet3') ||
                        document.querySelector('button.continue.toFleet3') ||
                        document.querySelector('#fleet2 button.continue');
            if (btn) btn.click();
        }
    }

    function selectFleetShips(mode, totalCargoNeeded) {
        const caps = calculateShipCapacities();
        const knAvail = getAvailableCount(202);
        const bnAvail = getAvailableCount(203);

        let knNeeded = 0;
        let bnNeeded = 0;

        if (mode === 'kn') {
            knNeeded = Math.ceil(totalCargoNeeded / caps.kn);
            setShipAmount(202, knNeeded);
        } else if (mode === 'bn') {
            bnNeeded = Math.ceil(totalCargoNeeded / caps.bn);
            setShipAmount(203, bnNeeded);
        } else {
            // mode === 'auto': Önce KN yetiyorsa KN, yoksa BN
            const neededIfKN = Math.ceil(totalCargoNeeded / caps.kn);
            if (knAvail >= neededIfKN && knAvail > 0) {
                knNeeded = neededIfKN;
                setShipAmount(202, knNeeded);
            } else if (bnAvail > 0) {
                bnNeeded = Math.ceil(totalCargoNeeded / caps.bn);
                setShipAmount(203, bnNeeded);
            } else {
                knNeeded = Math.min(knAvail, neededIfKN);
                setShipAmount(202, knNeeded);
                const remCargo = Math.max(0, totalCargoNeeded - (knNeeded * caps.kn));
                bnNeeded = Math.ceil(remCargo / caps.bn);
                setShipAmount(203, bnNeeded);
            }
        }

        try {
            if (typeof window.calculateCargo === 'function') window.calculateCargo();
            if (typeof window.checkCargo === 'function') window.checkCargo();
        } catch (e) {}

        return { kn: knNeeded, bn: bnNeeded };
    }

    function fillFleetResources(m, c, d) {
        const findInput = (name) => {
            return document.getElementById(name) ||
                   document.querySelector(`input#${name}`) ||
                   document.querySelector(`input[name="${name}"]`) ||
                   document.querySelector(`input[data-resource="${name}"]`) ||
                   document.querySelector(`input[id*="${name}"]`) ||
                   document.querySelector(`input[name*="${name}"]`) ||
                   document.querySelector(`#fleet3 input[name="${name}"]`) ||
                   document.querySelector(`.resource_${name} input`) ||
                   document.querySelector(`.res_${name} input`);
        };

        const setVal = (el, val) => {
            if (!el) return false;
            const targetVal = String(Math.max(0, parseInt(val, 10) || 0));

            try {
                const proto = window.HTMLInputElement.prototype;
                const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (nativeSetter) {
                    nativeSetter.call(el, targetVal);
                } else {
                    el.value = targetVal;
                }
            } catch (e) {
                el.value = targetVal;
            }

            ['focus', 'input', 'change', 'keydown', 'keyup', 'blur'].forEach(evt => {
                el.dispatchEvent(new Event(evt, { bubbles: true, cancelable: true }));
            });
            return true;
        };

        let mInp = findInput('metal');
        let cInp = findInput('crystal');
        let dInp = findInput('deuterium');

        if (!mInp || !cInp) {
            const candidates = Array.from(document.querySelectorAll('input[type="text"], input[type="number"], input:not([type])')).filter(el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden' && !el.disabled;
            });
            const resCandidates = candidates.filter(el => {
                const idName = (el.id + ' ' + el.name + ' ' + el.className).toLowerCase();
                return idName.includes('metal') || idName.includes('crystal') || idName.includes('deuter') || idName.includes('cargo') || idName.includes('resource');
            });
            if (resCandidates.length >= 3) {
                mInp = mInp || resCandidates[0];
                cInp = cInp || resCandidates[1];
                dInp = dInp || resCandidates[2];
            }
        }

        let filled = false;
        if (mInp && setVal(mInp, m)) filled = true;
        if (cInp && setVal(cInp, c)) filled = true;
        if (dInp && setVal(dInp, d)) filled = true;

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: {
                type: 'FILL_RESOURCES',
                m: Math.max(0, parseInt(m, 10) || 0),
                c: Math.max(0, parseInt(c, 10) || 0),
                d: Math.max(0, parseInt(d, 10) || 0)
            }
        }));

        return filled;
    }

    // ============================================================
    // CART PREFERENCES & MULTI-PLANET GROUPING
    // ============================================================
    function getCartShipPrefs() {
        let prefs = { rehber: false, kn: true, bn: true, priorityMode: 'speed' };
        try {
            const raw = localStorage.getItem(KEYS.CART_SHIPS);
            if (raw) prefs = Object.assign(prefs, JSON.parse(raw));
        } catch (e) {}
        if (!prefs.priorityMode) prefs.priorityMode = 'speed';
        return prefs;
    }

    function saveCartShipPrefs(prefs) {
        localStorage.setItem(KEYS.CART_SHIPS, JSON.stringify(prefs));
    }

    function getCartPlanetPrefs() {
        let prefs = {};
        try {
            const raw = localStorage.getItem(KEYS.CART_PLANET_PREFS);
            if (raw) prefs = JSON.parse(raw);
        } catch (e) {}
        return prefs;
    }

    function saveCartPlanetPrefs(prefs) {
        localStorage.setItem(KEYS.CART_PLANET_PREFS, JSON.stringify(prefs));
    }

    function getCartOrigin() {
        let origin = { originId: null, originCoord: null, originType: 1, originName: null, mission: 3 };
        try {
            const raw = localStorage.getItem(KEYS.CART_ORIGIN);
            if (raw) origin = Object.assign(origin, JSON.parse(raw));
        } catch (e) {}
        if (!origin.mission) origin.mission = 3;
        return origin;
    }

    function saveCartOrigin(origin) {
        localStorage.setItem(KEYS.CART_ORIGIN, JSON.stringify(origin));
    }

    function getCartExtraCost() {
        let extra = { enabled: false, met: 0, cri: 0, deu: 0 };
        try {
            const raw = localStorage.getItem(KEYS.CART_EXTRA_COST);
            if (raw) extra = Object.assign(extra, JSON.parse(raw));
        } catch (e) {}
        return extra;
    }

    function saveCartExtraCost(extra) {
        localStorage.setItem(KEYS.CART_EXTRA_COST, JSON.stringify(extra));
    }

    function getCartGroups() {
        const prefs = getCartPlanetPrefs();
        const groupsMap = new Map();

        cart.forEach((item, originalIndex) => {
            const coords = item.coords || '0:0:0';
            const type = parseInt(item.type, 10) || 1;
            const key = coords + '_' + type;

            if (!groupsMap.has(key)) {
                const planetPref = prefs[key] || {};
                let pName = item.planet;
                if (type === 3) {
                    const empire = getEmpirePlanetsAndMoons();
                    const parentP = empire.find(p => p.coords === coords);
                    if (parentP) {
                        pName = `${parentP.name} ( Ay )`;
                    } else if (!pName || pName === 'Ay') {
                        pName = 'Ay ( Ay )';
                    } else if (!pName.includes('( Ay )')) {
                        pName = `${pName} ( Ay )`;
                    }
                } else if (!pName) {
                    pName = 'Gezegen';
                }

                groupsMap.set(key, {
                    key: key,
                    coords: coords,
                    type: type,
                    planetName: pName,
                    selected: planetPref.selected !== undefined ? planetPref.selected : true, // Level 1 Checkbox
                    mission: planetPref.mission || (getCartOrigin().mission || 3), // 3: Nakliye, 4: Konuşlandır
                    items: []
                });
            }

            const grp = groupsMap.get(key);
            if (item.checked === undefined) item.checked = true;
            grp.items.push({ item, originalIndex });
        });

        const groups = Array.from(groupsMap.values());

        // Calculate group totals
        groups.forEach(grp => {
            let buildM = 0, buildC = 0, buildD = 0;
            let deductM = 0, deductC = 0, deductD = 0;
            let extraM = 0, extraC = 0, extraD = 0;
            let hasDeduction = false;

            grp.items.forEach(({ item }) => {
                if (item.checked !== false) {
                    if (item.isDeduction) {
                        hasDeduction = true;
                        deductM += Math.abs(item.metal || 0);
                        deductC += Math.abs(item.crystal || 0);
                        deductD += Math.abs(item.deuterium || 0);
                    } else if (item.isExtraCost) {
                        extraM += Math.max(0, item.metal || 0);
                        extraC += Math.max(0, item.crystal || 0);
                        extraD += Math.max(0, item.deuterium || 0);
                    } else {
                        buildM += Math.max(0, item.metal || 0);
                        buildC += Math.max(0, item.crystal || 0);
                        buildD += Math.max(0, item.deuterium || 0);
                    }
                }
            });

            grp.hasDeduction = hasDeduction;
            grp.buildM = buildM;
            grp.buildC = buildC;
            grp.buildD = buildD;
            grp.deductM = deductM;
            grp.deductC = deductC;
            grp.deductD = deductD;
            grp.extraM = extraM;
            grp.extraC = extraC;
            grp.extraD = extraD;
            grp.rawM = buildM - deductM + extraM;
            grp.rawC = buildC - deductC + extraC;
            grp.rawD = buildD - deductD + extraD;

            // Net ihtiyaç: İnşaat ihtiyacı (eksiye düşmez) + Ek Maliyet (her zaman eksiksiz eklenir)
            grp.netDeficitM = Math.max(0, buildM - deductM) + extraM;
            grp.netDeficitC = Math.max(0, buildC - deductC) + extraC;
            grp.netDeficitD = Math.max(0, buildD - deductD) + extraD;
            grp.totalCargoNeeded = grp.netDeficitM + grp.netDeficitC + grp.netDeficitD;
        });

        return groups;
    }

    // ============================================================
    // SMART CARGO FLEET CALCULATION (Hız & Yakıt Hibrit Optimizasyonu)
    // Hız Modu (⚡): Full Rehber > Full KN > KN+Rehber > Full BN > BN+KN > BN+Rehber > Cascade
    // Yakıt Modu (⛽): Full BN > BN+KN > Full KN > BN+Rehber > KN+Rehber > Full Rehber > Cascade
    // ============================================================
    function calculateSmartCargoFleet(totalCargoNeeded, shipPrefs, customAvailable) {
        const caps = calculateShipCapacities();
        const prefs = shipPrefs || { bn: true, kn: true, rehber: false, priorityMode: 'speed' };
        const mode = prefs.priorityMode || prefs.mode || 'speed';

        const avail = {
            bn: customAvailable && customAvailable.bn !== undefined ? customAvailable.bn : getAvailableCount(203),
            kn: customAvailable && customAvailable.kn !== undefined ? customAvailable.kn : getAvailableCount(202),
            rehber: customAvailable && customAvailable.rehber !== undefined ? customAvailable.rehber : getAvailableCount(219)
        };

        let bnCount = 0;
        let knCount = 0;
        let rehberCount = 0;

        const needed = Math.max(0, Math.round(totalCargoNeeded || 0));

        if (needed > 0) {
            const useRehber = !!prefs.rehber;
            const useKN = !!prefs.kn;
            const useBN = !!prefs.bn;

            const availRehber = useRehber ? Math.max(0, avail.rehber || 0) : 0;
            const availKN = useKN ? Math.max(0, avail.kn || 0) : 0;
            const availBN = useBN ? Math.max(0, avail.bn || 0) : 0;

            const capRehber = caps.rehber || 10000;
            const capKN = caps.kn || 5000;
            const capBN = caps.bn || 25000;

            const reqRehber = capRehber > 0 ? Math.ceil(needed / capRehber) : 0;
            const reqKN = capKN > 0 ? Math.ceil(needed / capKN) : 0;
            const reqBN = capBN > 0 ? Math.ceil(needed / capBN) : 0;

            const totalCapRehber = availRehber * capRehber;
            const totalCapKN = availKN * capKN;
            const totalCapBN = availBN * capBN;

            if (mode === 'fuel') {
                // ==========================================
                // YAKIT ÖNCELİKLİ (Fuel-Saving Mode)
                // 1. Full BN (Minimum Yakıt)
                // 2. BN + KN (Eldeki BN'leri doldurur, kalanı KN ile kapatır)
                // 3. Full KN (BN hiç yoksa veya kapalıysa)
                // 4. BN + KN + Rehber (BN ve KN yetmiyorsa; kalanı minimum Rehber ile kapatır)
                // 5. BN + Rehber (KN hiç yoksa; BN + kalan Rehber)
                // 6. KN + Rehber (BN hiç yoksa; KN + kalan Rehber)
                // 7. Full Rehber (Yalnızca Rehber)
                // 8. Cascade (Kapasite yetersizse)
                // ==========================================
                if (useBN && availBN >= reqBN) {
                    bnCount = reqBN;
                } else if (useBN && useKN && availBN > 0 && availKN > 0 && (totalCapBN + totalCapKN >= needed)) {
                    bnCount = availBN;
                    const rem = Math.max(0, needed - (bnCount * capBN));
                    knCount = Math.min(availKN, Math.ceil(rem / capKN));
                } else if (useKN && availKN >= reqKN) {
                    knCount = reqKN;
                } else if (useBN && useKN && useRehber && availBN > 0 && availKN > 0 && availRehber > 0 && (totalCapBN + totalCapKN + totalCapRehber >= needed)) {
                    bnCount = availBN;
                    let rem = Math.max(0, needed - (bnCount * capBN));
                    knCount = Math.min(availKN, Math.ceil(rem / capKN));
                    rem = Math.max(0, rem - (knCount * capKN));
                    rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                } else if (useBN && useRehber && availBN > 0 && availRehber > 0 && (totalCapBN + totalCapRehber >= needed)) {
                    bnCount = availBN;
                    const rem = Math.max(0, needed - (bnCount * capBN));
                    rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                } else if (useKN && useRehber && availKN > 0 && availRehber > 0 && (totalCapKN + totalCapRehber >= needed)) {
                    knCount = availKN;
                    const rem = Math.max(0, needed - (knCount * capKN));
                    rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                } else if (useRehber && availRehber >= reqRehber) {
                    rehberCount = reqRehber;
                } else {
                    let rem = needed;
                    if (useBN && availBN > 0) {
                        bnCount = Math.min(availBN, Math.ceil(rem / capBN));
                        rem = Math.max(0, rem - (bnCount * capBN));
                    }
                    if (rem > 0 && useKN && availKN > 0) {
                        knCount = Math.min(availKN, Math.ceil(rem / capKN));
                        rem = Math.max(0, rem - (knCount * capKN));
                    }
                    if (rem > 0 && useRehber && availRehber > 0) {
                        rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                        rem = Math.max(0, rem - (rehberCount * capRehber));
                    }
                }
            } else {
                // ==========================================
                // HIZ ÖNCELİKLİ (Speed Mode)
                // 1. Full Rehber (Maksimum Hız)
                // 2. Full KN (Hızlı & Çok Düşük Yakıt)
                // 3. KN + Rehber (Hızı BN'ye düşürmeden; tüm KN'leri alır, kalanı Rehber ile kapatır)
                // 4. Full BN (Hız zaten BN'ye düşecekse)
                // 5. BN + KN (BN hızındayız; BN'leri doldurur, kalanı KN ile kapatır)
                // 6. BN + KN + Rehber (BN ve KN yetmiyorsa; kalanı minimum Rehber ile tamamlar)
                // 7. BN + Rehber (KN hiç yoksa; BN + kalan Rehber)
                // 8. Cascade (Kapasite yetersizse)
                // ==========================================
                if (useRehber && availRehber >= reqRehber) {
                    rehberCount = reqRehber;
                } else if (useKN && availKN >= reqKN) {
                    knCount = reqKN;
                } else if (useKN && useRehber && availKN > 0 && availRehber > 0 && (totalCapKN + totalCapRehber >= needed)) {
                    knCount = availKN;
                    const rem = Math.max(0, needed - (knCount * capKN));
                    rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                } else if (useBN && availBN >= reqBN) {
                    bnCount = reqBN;
                } else if (useBN && useKN && availBN > 0 && availKN > 0 && (totalCapBN + totalCapKN >= needed)) {
                    bnCount = availBN;
                    const rem = Math.max(0, needed - (bnCount * capBN));
                    knCount = Math.min(availKN, Math.ceil(rem / capKN));
                } else if (useBN && useKN && useRehber && availBN > 0 && availKN > 0 && availRehber > 0 && (totalCapBN + totalCapKN + totalCapRehber >= needed)) {
                    bnCount = availBN;
                    let rem = Math.max(0, needed - (bnCount * capBN));
                    knCount = Math.min(availKN, Math.ceil(rem / capKN));
                    rem = Math.max(0, rem - (knCount * capKN));
                    rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                } else if (useBN && useRehber && availBN > 0 && availRehber > 0 && (totalCapBN + totalCapRehber >= needed)) {
                    bnCount = availBN;
                    const rem = Math.max(0, needed - (bnCount * capBN));
                    rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                } else {
                    let rem = needed;
                    if (useBN && availBN > 0) {
                        bnCount = Math.min(availBN, Math.ceil(rem / capBN));
                        rem = Math.max(0, rem - (bnCount * capBN));
                    }
                    if (rem > 0 && useKN && availKN > 0) {
                        knCount = Math.min(availKN, Math.ceil(rem / capKN));
                        rem = Math.max(0, rem - (knCount * capKN));
                    }
                    if (rem > 0 && useRehber && availRehber > 0) {
                        rehberCount = Math.min(availRehber, Math.ceil(rem / capRehber));
                        rem = Math.max(0, rem - (rehberCount * capRehber));
                    }
                }
            }
        }

        const totalCap = (bnCount * caps.bn) + (knCount * caps.kn) + (rehberCount * caps.rehber);
        const missingCargo = Math.max(0, needed - totalCap);

        return {
            bn: bnCount,
            kn: knCount,
            rehber: rehberCount,
            totalCap: totalCap,
            missingCargo: missingCargo,
            insufficientShips: missingCargo > 0,
            caps: caps
        };
    }

    function updateModeBtnUI(btnEl, mode) {
        if (!btnEl) return;
        const isFuel = (mode === 'fuel');
        btnEl.classList.toggle('fuel', isFuel);
        if (isFuel) {
            btnEl.textContent = t('mode_fuel', '⛽ Yakıt');
            btnEl.title = t('mode_fuel_title', 'Taşıma Önceliği: Yakıt Tasarrufu (BN > KN > Rehber). Tıkla: Hız Moduna Geç');
        } else {
            btnEl.textContent = t('mode_speed', '⚡ Hız');
            btnEl.title = t('mode_speed_title', 'Taşıma Önceliği: Hız (Rehber > KN > BN). Tıkla: Yakıt Moduna Geç');
        }
    }

    function calculateCartShips(totalCargoNeeded, shipPrefs) {
        const prefs = shipPrefs || getCartShipPrefs();
        return calculateSmartCargoFleet(totalCargoNeeded, prefs);
    }
    window.lsCalculateSmartCargoFleet = calculateSmartCargoFleet;

    function selectAllCartPlanets(mode) {
        const groups = getCartGroups();
        const prefs = getCartPlanetPrefs();
        const isSelected = (mode === 'all');
        groups.forEach(grp => {
            if (!prefs[grp.key]) prefs[grp.key] = {};
            prefs[grp.key].selected = isSelected;
        });
        saveCartPlanetPrefs(prefs);
        renderCart();
    }

    function startCartDelivery(mode, targetKey) {
        const groups = getCartGroups();
        let queue = [];

        if (mode === 'single') {
            const target = groups.find(g => g.key === targetKey);
            if (!target) {
                alert(currentLang === 'tr' ? 'Hedef gezegen sepeti bulunamadı.' : 'Target planet cart not found.');
                return;
            }
            if (target.totalCargoNeeded <= 0) {
                alert(currentLang === 'tr' ? 'Bu gezegen için taşınacak kaynak ihtiyacı bulunmuyor!' : 'No transport resources needed for this planet!');
                return;
            }
            queue = [target];
        } else {
            // mode === 'bulk'
            queue = groups.filter(g => g.selected && (g.totalCargoNeeded > 0));
            if (queue.length === 0) {
                alert(currentLang === 'tr' ? 'Lütfen gönderim yapılacak en az bir gezegen seçin!' : 'Please select at least one planet to distribute to!');
                return;
            }
        }

        const shipPrefs = getCartShipPrefs();
        if (!shipPrefs.rehber && !shipPrefs.kn && !shipPrefs.bn) {
            alert(currentLang === 'tr' ? 'Lütfen en az bir gemi türünü (Rehber, KN veya BN) aktif yapın!' : 'Please activate at least one ship type (Pathfinder, SC or LC)!');
            return;
        }

        let cartOrigin = getCartOrigin();
        if (!cartOrigin.originCoord || !cartOrigin.originId) {
            const cur = getCurrentActiveTarget(getEmpirePlanetsAndMoons());
            if (cur) {
                cartOrigin = { originId: cur.id, originCoord: cur.coords, originType: cur.type, originName: cur.name };
                saveCartOrigin(cartOrigin);
            }
        }

        const session = {
            active: true,
            originId: cartOrigin.originId,
            originCoord: cartOrigin.originCoord,
            originType: cartOrigin.originType || 1,
            originName: cartOrigin.originName,
            queue: queue.map(g => {
                return {
                    key: g.key,
                    coords: g.coords,
                    type: g.type,
                    name: g.planetName,
                    mission: g.mission || 3,
                    m: g.netDeficitM,
                    c: g.netDeficitC,
                    d: g.netDeficitD,
                    totalCargoNeeded: g.totalCargoNeeded
                };
            }),
            currentIndex: 0,
            startedAt: Date.now()
        };

        sessionStorage.setItem(KEYS.CART_QUEUE, JSON.stringify(session));

        const first = session.queue[0];
        const [g, s, p] = first.coords.split(':');
        const originParam = (session.originId && session.originId !== 'manual') ? `&cp=${session.originId}` : '';
        const url = `/game/index.php?page=ingame&component=fleetdispatch${originParam}&galaxy=${g}&system=${s}&position=${p}&type=${first.type}&mission=${first.mission}`;

        // Her zaman ilgili hedefin temiz filo sayfasına yönlendir
        // Bu sayede formdaki eski/hatalı koordinatlar ve takılı kalmış Fleet2 durumları tamamen sıfırlanır
        window.location.href = url;
    }

    function checkAndApplyCartDelivery() {
        const raw = sessionStorage.getItem(KEYS.CART_QUEUE);
        if (!raw) return false;

        let session;
        try {
            session = JSON.parse(raw);
        } catch (e) {
            sessionStorage.removeItem(KEYS.CART_QUEUE);
            return false;
        }

        if (!session || !session.active || !Array.isArray(session.queue)) {
            sessionStorage.removeItem(KEYS.CART_QUEUE);
            return false;
        }

        if (session.startedAt && (Date.now() - session.startedAt > 15 * 60 * 1000)) {
            sessionStorage.removeItem(KEYS.CART_QUEUE);
            return false;
        }

        if (session.currentIndex >= session.queue.length) {
            sessionStorage.removeItem(KEYS.CART_QUEUE);
            showCollectorToast('🎉 Sepetteki tüm seçili gezegenlere nakliye başarıyla tamamlandı!', 6000);
            return false;
        }

        const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                            document.getElementById('fleetdispatchcomponent') ||
                            document.getElementById('fleet1');
        if (!isFleetPage) return false;

        // Çıkış üssünde miyiz kontrol et (cp kontrolü)
        if (session.originId && session.originId !== 'manual') {
            const currentCp = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
            if (currentCp && String(currentCp) !== String(session.originId)) {
                LS_LOGGER.dispatch('CART', `Merkeze geçiliyor (cp: ${session.originId})...`);
                const currentItem = session.queue[session.currentIndex];
                const [g, s, p] = currentItem.coords.split(':');
                const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${session.originId}&galaxy=${g}&system=${s}&position=${p}&type=${currentItem.type}&mission=${currentItem.mission}`;
                window.location.href = url;
                return true;
            }
        }

        const currentItem = session.queue[session.currentIndex];

        let tries = 0;
        const pollInterval = setInterval(() => {
            tries++;
            const hasShipInput = document.querySelector('[data-technology="203"], [data-technology="202"]') ||
                                 document.querySelector('input[name="transporterLarge"], input[name="am203"], input[name="am202"]') ||
                                 document.getElementById('fleet1');
            const hasCoords = document.getElementById('galaxy') || document.querySelector('input[name="galaxy"]');
            const hasRes = document.getElementById('resources_metal') || document.getElementById('resources_crystal');
            const domReady = document.readyState === 'complete' || document.readyState === 'interactive';

            if ((domReady && hasShipInput && hasCoords && hasRes) || tries > 40) {
                clearInterval(pollInterval);
                setTimeout(() => {
                    executeCartDeliveryStep(session, currentItem);
                }, 400);
            }
        }, 150);

        return true;
    }

    function executeCartDeliveryStep(session, currentItem) {
        const shipPrefs = getCartShipPrefs();
        const shipCounts = calculateCartShips(currentItem.totalCargoNeeded, shipPrefs);

        const liveRes = getLiveResources();
        const missingM = Math.max(0, currentItem.m - liveRes.metal);
        const missingC = Math.max(0, currentItem.c - liveRes.crystal);
        const missingD = Math.max(0, currentItem.d - liveRes.deuterium);

        const hasResourceShortage = (missingM > 0 || missingC > 0 || missingD > 0);
        const hasShipShortage = shipCounts.insufficientShips;

        // Eldeki canlı kaynağa göre yükleme:
        let deuAvail = Math.min(liveRes.deuterium, currentItem.d);
        let criAvail = Math.min(liveRes.crystal, currentItem.c);
        let metAvail = Math.min(liveRes.metal, currentItem.m);

        // Kargo kapasitesine göre yükleme:
        let remCap = shipCounts.totalCap;
        let deuLoad = Math.min(remCap, deuAvail);
        remCap -= deuLoad;
        let criLoad = Math.min(remCap, criAvail);
        remCap -= criLoad;
        let metLoad = Math.min(remCap, metAvail);
        remCap -= metLoad;

        // Gemileri seç
        setShipAmount(219, shipCounts.rehber);
        setShipAmount(202, shipCounts.kn);
        setShipAmount(203, shipCounts.bn);

        let g = '', s = '', p = '';
        if (currentItem.coords && /^\d+:\d+:\d+$/.test(currentItem.coords)) {
            [g, s, p] = currentItem.coords.split(':');
        }

        const missionId = currentItem.mission || 3;

        let isStepCancelled = false;
        let ensureShipsTimer = null;
        let step2Interval = null;
        let step2CheckTimer = null;

        const updateCartBannerReady = () => {
            const btn = document.getElementById('ls-cart-banner-send-btn');
            if (btn) {
                btn.disabled = false;
                btn.style.background = '#27ae60';
                btn.style.color = '#fff';
                btn.style.cursor = 'pointer';
                btn.innerText = '🚀 ' + t('coll_hud_send') + ' (Space)';
            }
        };

        const prepareStep2 = () => {
            if (isStepCancelled) return;
            if (g && s && p) {
                setFleetTargetCoords(g, s, p, currentItem.type || 1);
            }
            setFleetMission(missionId);
            fillFleetResources(metLoad, criLoad, deuLoad);
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SELECT_MISSION', missionId: missionId }
            }));
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'CARGO_REFRESH' }
            }));

            let checkCount = 0;
            step2CheckTimer = setInterval(() => {
                if (isStepCancelled) {
                    clearInterval(step2CheckTimer);
                    return;
                }
                checkCount++;
                const mBtn = document.querySelector('#missionButton' + missionId + ', [data-mission="' + missionId + '"]');
                const isMissionActive = mBtn && (mBtn.classList.contains('selected') || mBtn.classList.contains('active'));
                if (!isMissionActive) setFleetMission(missionId);
                fillFleetResources(metLoad, criLoad, deuLoad);

                const sendBtn = findSendFleetButton();
                const isSendBtnReady = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');

                if ((isMissionActive && isSendBtnReady && checkCount >= 2) || checkCount > 15) {
                    clearInterval(step2CheckTimer);
                    updateCartBannerReady();
                }
            }, 100);
        };

        const targetShipTotal = (shipCounts.bn || 0) + (shipCounts.kn || 0) + (shipCounts.rehber || 0);
        if (targetShipTotal > 0) {
            let shipTries = 0;
            ensureShipsTimer = setInterval(() => {
                if (isStepCancelled) {
                    clearInterval(ensureShipsTimer);
                    return;
                }
                shipTries++;
                const { total } = getSelectedShipsSummary();
                if (total > 0 || shipTries > 6) {
                    clearInterval(ensureShipsTimer);
                    setTimeout(() => {
                        if (isStepCancelled) return;
                        clickDevamButton();
                        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                            detail: { type: 'SUBMIT_FLEET1' }
                        }));

                        let step2Tries = 0;
                        step2Interval = setInterval(() => {
                            if (isStepCancelled) {
                                clearInterval(step2Interval);
                                return;
                            }
                            step2Tries++;
                            const devamBtn = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
                            const isStep1StillActive = devamBtn && (devamBtn.offsetWidth > 0 || window.getComputedStyle(devamBtn).display !== 'none');
                            const sendBtn = findSendFleetButton();
                            const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                            const isStep2Active = !isStep1StillActive && isSendBtnVisible;

                            if (isStep2Active) {
                                clearInterval(step2Interval);
                                setTimeout(prepareStep2, 100);
                            } else {
                                if (step2Tries % 5 === 0) {
                                    clickDevamButton();
                                    window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                                        detail: { type: 'SUBMIT_FLEET1' }
                                    }));
                                }
                                if (step2Tries > 30) {
                                    clearInterval(step2Interval);
                                    setTimeout(prepareStep2, 100);
                                }
                            }
                        }, 100);
                    }, 200);
                } else {
                    setShipAmount(219, shipCounts.rehber);
                    setShipAmount(202, shipCounts.kn);
                    setShipAmount(203, shipCounts.bn);
                }
            }, 150);
        } else {
            setTimeout(() => {
                if (isStepCancelled) return;
                clickDevamButton();
                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                    detail: { type: 'SUBMIT_FLEET1' }
                }));

                let step2Tries = 0;
                step2Interval = setInterval(() => {
                    if (isStepCancelled) {
                        clearInterval(step2Interval);
                        return;
                    }
                    step2Tries++;
                    const devamBtn = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
                    const isStep1StillActive = devamBtn && (devamBtn.offsetWidth > 0 || window.getComputedStyle(devamBtn).display !== 'none');
                    const sendBtn = findSendFleetButton();
                    const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                    const isStep2Active = !isStep1StillActive && isSendBtnVisible;

                    if (isStep2Active) {
                        clearInterval(step2Interval);
                        setTimeout(prepareStep2, 100);
                    } else {
                        if (step2Tries % 5 === 0) {
                            clickDevamButton();
                            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                                detail: { type: 'SUBMIT_FLEET1' }
                            }));
                        }
                        if (step2Tries > 30) {
                            clearInterval(step2Interval);
                            setTimeout(prepareStep2, 100);
                        }
                    }
                }, 100);
            }, 200);
        }

        renderCartHUD(session, currentItem, {
            shipCounts,
            deuLoad, criLoad, metLoad,
            missingM, missingC, missingD,
            hasResourceShortage, hasShipShortage,
            prepareStep2,
            cancel: () => {
                isStepCancelled = true;
                if (ensureShipsTimer) clearInterval(ensureShipsTimer);
                if (step2Interval) clearInterval(step2Interval);
                if (step2CheckTimer) clearInterval(step2CheckTimer);
            }
        });
    }

    function renderCartHUD(session, currentItem, details) {
        let banner = document.getElementById('ls-coll-floating-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'ls-coll-floating-banner';
            document.body.appendChild(banner);
        }

        const totalItems = session.queue.length;
        const currentStep = session.currentIndex + 1;
        const originIcon = (session.originType === 3) ? '🌕' : '🪐';
        const originName = session.originName || getCurrentPlanetName() || t('exp_here');
        const originCoordText = session.originCoord ? ' <span style="color:#00bcff;font-family:monospace">[' + session.originCoord + ']</span>' : '';

        const targetIcon = (currentItem.type === 3) ? '🌕' : '🪐';
        const cleanTName = (currentItem.name || '').replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        let displayTargetTitle = cleanTName;
        if (!displayTargetTitle) {
            if (currentItem.type === 3) {
                const emp = getEmpirePlanetsAndMoons();
                const matched = emp.find(x => x.coords === currentItem.coords);
                displayTargetTitle = matched ? `${matched.name} ( ${t('coll_moon_name')} )` : `${t('coll_moon_name')} ( ${t('coll_moon_name')} )`;
            } else {
                displayTargetTitle = (currentLang === 'tr' ? 'Hedef' : 'Target');
            }
        }

        let shipDesc = [];
        if (details.shipCounts.bn > 0) shipDesc.push(details.shipCounts.bn + ' ' + t('cart_ships_lc'));
        if (details.shipCounts.kn > 0) shipDesc.push(details.shipCounts.kn + ' ' + t('cart_ships_sc'));
        if (details.shipCounts.rehber > 0) shipDesc.push(details.shipCounts.rehber + ' ' + t('cart_ships_pathfinder'));
        const shipText = shipDesc.length > 0 ? shipDesc.join(', ') : '<span style="color:#e74c3c">' + t('coll_hud_no_ships') + '</span>';

        const missionName = (currentItem.mission === 4 ? '🚀 ' + t('cart_deploy') : '🚚 ' + t('cart_transport'));
        const missionColor = (currentItem.mission === 4 ? '#2980b9' : '#2ecc71');

        banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(13,27,42,0.96);border:2px solid #2ecc71;box-shadow:0 10px 32px rgba(0,0,0,0.85);border-radius:8px;padding:12px 18px;min-width:420px;max-width:90vw;z-index:9999999;font-family:sans-serif;color:#d1d8e0;text-align:center;box-sizing:border-box';

        const coordText = currentItem.coords ? ' <span style="color:#ffbe3b;font-family:monospace">[' + currentItem.coords + ']</span>' : '';

        // Uyarı mesajları (Kaynak veya Gemi Yetersizliği)
        let warningHtml = '';
        const hasAnyShortage = details.hasResourceShortage || details.hasShipShortage;
        if (hasAnyShortage) {
            let reasons = [];
            if (details.hasShipShortage) {
                reasons.push(`${t('coll_hud_cap_shortage')} (${formatShort(details.shipCounts.missingCargo)})`);
            }
            if (details.missingM > 0) reasons.push(`${t('coll_met')} ${formatShort(details.missingM)}`);
            if (details.missingC > 0) reasons.push(`${t('coll_crys')} ${formatShort(details.missingC)}`);
            if (details.missingD > 0) reasons.push(`${t('coll_deut')} ${formatShort(details.missingD)}`);

            warningHtml =
                '<div id="ls-cart-warning-box" style="background:rgba(231,76,60,0.22);border:1px solid #e74c3c;border-radius:4px;padding:6px 8px;margin-bottom:8px;font-size:11px;color:#ff6b6b;text-align:left">' +
                    '<div style="font-weight:bold;margin-bottom:2px">' + t('cart_hud_shortage_title') + '</div>' +
                    '<div style="font-size:10.5px;color:#f5b7b1;margin-bottom:6px">' + reasons.join(' · ') + '</div>' +
                    '<div style="display:flex;gap:6px;justify-content:center">' +
                        '<button id="ls-cart-stop-btn" style="background:#e74c3c;color:#fff;border:none;padding:4px 9px;border-radius:3px;font-weight:bold;font-size:10.5px;cursor:pointer">' + t('cart_hud_stop_btn') + '</button>' +
                        '<button id="ls-cart-proceed-btn" style="background:#f39c12;color:#000;border:none;padding:4px 9px;border-radius:3px;font-weight:bold;font-size:10.5px;cursor:pointer">' + t('cart_hud_proceed_btn') + '</button>' +
                    '</div>' +
                '</div>';
        }

        const hasShips = (details.shipCounts.totalCap > 0) || (details.shipCounts.bn > 0 || details.shipCounts.kn > 0 || details.shipCounts.rehber > 0);

        banner.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a2c3f;padding-bottom:6px;margin-bottom:8px">' +
                '<span style="font-size:12px;font-weight:bold;color:#2ecc71">🛒 ' + t('cart_hud_title') + ' [' + currentStep + ' / ' + totalItems + ']</span>' +
                '<span style="font-size:11px;color:#fff">' + originIcon + ' ' + escapeHtml(originName) + originCoordText + ' ➔ ' + targetIcon + ' ' + escapeHtml(displayTargetTitle) + coordText + '</span>' +
            '</div>' +
            warningHtml +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">' +
                '<div><b style="color:#8899aa">' + t('coll_hud_selected_fleet') + '</b> <span style="font-weight:bold">' + shipText + '</span></div>' +
                '<div style="font-size:10.5px;color:' + missionColor + ';font-weight:bold">' + missionName + '</div>' +
            '</div>' +
            '<div style="font-size:11.5px;font-family:monospace;margin-bottom:10px">' +
                '<b style="color:#8899aa">' + t('coll_hud_transported') + '</b> ' +
                '<span style="color:#ffbe3b">' + formatShort(details.metLoad) + ' ' + t('coll_met') + '</span> · ' +
                '<span style="color:#5dade2">' + formatShort(details.criLoad) + ' ' + t('coll_crys') + '</span> · ' +
                '<span style="color:#2ecc71">' + formatShort(details.deuLoad) + ' ' + t('coll_deut') + '</span>' +
            '</div>' +
            '<div id="ls-cart-hud-controls" style="display:flex;gap:6px;justify-content:center;align-items:center;' + (hasAnyShortage ? 'display:none;' : '') + '">' +
                (hasShips ?
                    '<button id="ls-cart-banner-send-btn" disabled style="background:#445566;color:#8899aa;border:none;padding:5px 12px;border-radius:4px;font-weight:bold;font-size:11px;cursor:not-allowed;box-shadow:0 2px 6px rgba(0,0,0,0.5)">' + t('exp_hud_preparing') + '</button>'
                    : '<button class="ls-cart-banner-skip-btn" style="background:#f39c12;color:#000;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ ' + t('coll_hud_skip') + ' (Space)</button>') +
                '<button id="ls-cart-banner-retry-btn" style="background:#e67e22;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer" title="' + t('coll_hud_retry') + '">🔄 ' + t('coll_hud_retry') + '</button>' +
                (hasShips ? '<button class="ls-cart-banner-skip-btn" style="background:#34495e;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ ' + t('coll_hud_skip') + '</button>' : '') +
                '<button id="ls-cart-banner-cancel-btn" style="background:#7f8c8d;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏹️ ' + t('coll_hud_cancel') + '</button>' +
            '</div>';

        let isSending = false;

        const sendFleet = () => {
            const sendBtnEl = document.getElementById('ls-cart-banner-send-btn');
            if (sendBtnEl && sendBtnEl.disabled) return;
            if (isSending) return;
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }

            const sendBtn = findSendFleetButton();
            const isSendBtnReady = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');

            if (isSendBtnReady) {
                dispatchSendCartFleet();
            } else {
                clickDevamButton();
                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                    detail: { type: 'SUBMIT_FLEET1' }
                }));
                if (typeof details.prepareStep2 === 'function') {
                    details.prepareStep2();
                }
            }
        };

        const dispatchSendCartFleet = () => {
            if (isSending) return;
            isSending = true;
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();

            // 1. Gönderilen gezegenin Level 1 Checkbox'ını uncheck yap
            const pPrefs = getCartPlanetPrefs();
            if (!pPrefs[currentItem.key]) pPrefs[currentItem.key] = {};
            pPrefs[currentItem.key].selected = false;
            saveCartPlanetPrefs(pPrefs);

            // 2. Gezegen sepeti altındaki tüm kalemleri de uncheck yap (gözle takip için)
            cart.forEach(item => {
                const itemKey = `${item.coords}_${item.type || 1}`;
                if (itemKey === currentItem.key) {
                    item.checked = false;
                }
            });
            saveCart();
            renderCart();

            // 3. Kuyruk indeksini ilerlet
            session.currentIndex++;
            sessionStorage.setItem(KEYS.CART_QUEUE, JSON.stringify(session));

            LS_LOGGER.dispatch('CART', `Maliyet filosu gönderiliyor: ${currentItem.name} [${currentItem.coords}] (Adım ${session.currentIndex}/${session.queue.length})`);

            if (banner) {
                banner.innerHTML =
                    '<div style="font-size:12px;color:#2ecc71;padding:8px;font-weight:bold">' +
                        '🚀 Filo gönderildi! Sıradaki gezegene geçiliyor...' +
                    '</div>';
            }

            // Sayfa bağlamında tekil submit tetikle (bridge.js tekil submit mekanizmasıyla çalışır)
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SUBMIT_FLEET2' }
            }));

            // Sıradaki adıma geçiş (AJAX isteğinin tamamlanması için güvenli bekleme)
            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const [nextG, nextS, nextP] = nextItem.coords.split(':');
                    const originParam = (session.originId && session.originId !== 'manual') ? `&cp=${session.originId}` : '';
                    const url = `/game/index.php?page=ingame&component=fleetdispatch${originParam}&galaxy=${nextG}&system=${nextS}&position=${nextP}&type=${nextItem.type}&mission=${nextItem.mission}`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.CART_QUEUE);
                    if (banner) banner.remove();
                    showCollectorToast('🎉 Sepetteki tüm seçili gezegenlere nakliye başarıyla tamamlandı!', 6000);
                }
            }, 1100);
        };

        const retryDispatch = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#e67e22;padding:6px;font-weight:bold">🔄 ' + (currentLang === 'tr' ? 'Bu adım baştan yükleniyor...' : 'Reloading step from scratch...') + '</div>';
            }
            // Hata veya takılma durumunda bu adımı temiz URL ile baştan yükle
            const [g, s, p] = currentItem.coords.split(':');
            const originParam = (session.originId && session.originId !== 'manual') ? `&cp=${session.originId}` : '';
            const url = `/game/index.php?page=ingame&component=fleetdispatch${originParam}&galaxy=${g}&system=${s}&position=${p}&type=${currentItem.type}&mission=${currentItem.mission}`;
            setTimeout(() => {
                window.location.href = url;
            }, 150);
        };

        const skipStep = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            // 1. Atlanan gezegenin Level 1 Checkbox'ını uncheck yap
            const pPrefs = getCartPlanetPrefs();
            if (!pPrefs[currentItem.key]) pPrefs[currentItem.key] = {};
            pPrefs[currentItem.key].selected = false;
            saveCartPlanetPrefs(pPrefs);

            // 2. Gezegen sepeti altındaki tüm kalemleri de uncheck yap
            cart.forEach(item => {
                const itemKey = `${item.coords}_${item.type || 1}`;
                if (itemKey === currentItem.key) {
                    item.checked = false;
                }
            });
            saveCart();
            renderCart();

            session.currentIndex++;
            sessionStorage.setItem(KEYS.CART_QUEUE, JSON.stringify(session));

            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#f39c12;padding:6px">⏭️ Gezegen atlandı, sıradakine geçiliyor...</div>';
            }

            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const [nextG, nextS, nextP] = nextItem.coords.split(':');
                    const originParam = (session.originId && session.originId !== 'manual') ? `&cp=${session.originId}` : '';
                    const url = `/game/index.php?page=ingame&component=fleetdispatch${originParam}&galaxy=${nextG}&system=${nextS}&position=${nextP}&type=${nextItem.type}&mission=${nextItem.mission}`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.CART_QUEUE);
                    if (banner) banner.remove();
                    showCollectorToast('Maliyet dağıtımı tamamlandı.', 4000);
                }
            }, 500);
        };

        const closeBanner = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            sessionStorage.removeItem(KEYS.CART_QUEUE);
            if (banner) banner.remove();
        };

        const keyListener = (e) => {
            if (e.repeat) return;
            if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                const tag = (document.activeElement && document.activeElement.tagName) || '';
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
                e.preventDefault();
                e.stopPropagation();

                const warningBox = document.getElementById('ls-cart-warning-box');
                if (warningBox && warningBox.style.display !== 'none') {
                    // Uyarı açıkken Space doğrudan gönderemez, kullanıcı onay vermelidir
                    return;
                }
                if (!hasShips) {
                    skipStep();
                } else {
                    sendFleet();
                }
            }
        };

        window.addEventListener('keydown', keyListener);

        document.getElementById('ls-cart-banner-send-btn')?.addEventListener('click', sendFleet);
        document.getElementById('ls-cart-banner-retry-btn')?.addEventListener('click', retryDispatch);
        document.querySelectorAll('.ls-cart-banner-skip-btn, #ls-cart-banner-skip-btn').forEach(btn => {
            btn.addEventListener('click', skipStep);
        });
        document.getElementById('ls-cart-banner-cancel-btn')?.addEventListener('click', closeBanner);

        document.getElementById('ls-cart-stop-btn')?.addEventListener('click', () => {
            closeBanner();
            showCollectorToast('⏹️ Maliyet dağıtımı durduruldu.');
        });

        document.getElementById('ls-cart-proceed-btn')?.addEventListener('click', () => {
            const warningBox = document.getElementById('ls-cart-warning-box');
            if (warningBox) warningBox.style.display = 'none';
            const controls = document.getElementById('ls-cart-hud-controls');
            if (controls) controls.style.display = 'flex';
        });
    }

    function renderCartOrigin() {
        let cartOrigin = getCartOrigin();
        const originLabelEl = document.getElementById('ls-cart-origin-label');
        const ddEl = document.getElementById('ls-cart-origin-dd');
        const m3 = document.getElementById('ls-cart-mission-3');
        const m4 = document.getElementById('ls-cart-mission-4');
        const cartModeBtn = document.getElementById('ls-cart-mode-btn');

        if (m3 && m4) {
            const activeMission = cartOrigin.mission || 3;
            m3.classList.toggle('active', activeMission === 3);
            m4.classList.toggle('active', activeMission === 4);
        }

        const cartPrefs = getCartShipPrefs();
        if (cartModeBtn) {
            updateModeBtnUI(cartModeBtn, cartPrefs.priorityMode || 'speed');
        }

        if (!originLabelEl || !ddEl) return;

        const empire = getEmpirePlanetsAndMoons();

        const hasValidOrigin = cartOrigin.originCoord && /^\d+:\d+:\d+$/.test(cartOrigin.originCoord);
        const isSessionRunning = !!sessionStorage.getItem(KEYS.CART_QUEUE);
        if (empire.length > 0 && !hasValidOrigin && !isSessionRunning) {
            const cur = getCurrentActiveTarget(empire);
            if (cur) {
                cartOrigin.originId = cur.id;
                cartOrigin.originCoord = cur.coords;
                cartOrigin.originType = cur.type;
                cartOrigin.originName = cur.name;
                saveCartOrigin(cartOrigin);
            }
        }

        let originIcon = '🪐';
        if (cartOrigin.originType === 3) originIcon = '🌕';
        let rawOriginTitle = cartOrigin.originName || 'Merkez';
        let cleanOriginTitle = rawOriginTitle.replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        if (!cleanOriginTitle || cleanOriginTitle === 'Ay') {
            if (cartOrigin.originType === 3) {
                const parentP = empire.find(p => p.coords === cartOrigin.originCoord);
                cleanOriginTitle = parentP ? `${parentP.name} ( Ay )` : 'Ay ( Ay )';
            } else {
                cleanOriginTitle = 'Gezegen';
            }
        }
        if (cartOrigin.originId === 'manual') {
            cleanOriginTitle = (cartOrigin.originType === 3 ? 'Manuel Ay' : 'Manuel Gezegen');
        }

        originLabelEl.innerHTML = `<span><b>${originIcon} ${escapeHtml(cleanOriginTitle)}</b><span class="crd">${cartOrigin.originCoord || ''}</span></span>`;

        let ddHtml = '';
        empire.forEach(p => {
            const isPActive = (cartOrigin.originCoord === p.coords && cartOrigin.originType === 1);
            ddHtml += `<div class="ls-coll-dd-item ${isPActive ? 'active' : ''}" data-id="${p.id}" data-coord="${p.coords}" data-type="1" data-name="${escapeHtml(p.name)}">` +
                `<span>🪐 ${escapeHtml(p.name)}</span><span class="crd">${p.coords}</span></div>`;
            if (p.moon) {
                const isMActive = (cartOrigin.originCoord === p.coords && cartOrigin.originType === 3);
                const mTitle = p.moon.name || `${p.name} ( Ay )`;
                ddHtml += `<div class="ls-coll-dd-item moon ${isMActive ? 'active' : ''}" data-id="${p.moon.id}" data-coord="${p.coords}" data-type="3" data-name="${escapeHtml(mTitle)}">` +
                    `<span>🌕 ${escapeHtml(mTitle)}</span><span class="crd">${p.coords}</span></div>`;
            }
        });
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="1"><span>🪐 ${t('coll_manual_planet', 'Manuel Gezegen...')}</span><span></span></div>`;
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="3"><span>🌕 ${t('coll_manual_moon', 'Manuel Ay...')}</span><span></span></div>`;
        ddEl.innerHTML = ddHtml;
    }

    let cartOriginEventsInitialized = false;
    function initCartOriginEvents() {
        if (cartOriginEventsInitialized) return;
        cartOriginEventsInitialized = true;

        const ddEl = document.getElementById('ls-cart-origin-dd');
        const originBtn = document.getElementById('ls-cart-origin-btn');
        const cartCurBtn = document.getElementById('ls-cart-cur-btn');
        const m3 = document.getElementById('ls-cart-mission-3');
        const m4 = document.getElementById('ls-cart-mission-4');
        const cartModeBtn = document.getElementById('ls-cart-mode-btn');

        if (cartModeBtn && !cartModeBtn.dataset.bound) {
            cartModeBtn.dataset.bound = '1';
            cartModeBtn.addEventListener('click', () => {
                let prefs = getCartShipPrefs();
                prefs.priorityMode = (prefs.priorityMode === 'fuel') ? 'speed' : 'fuel';
                saveCartShipPrefs(prefs);
                updateModeBtnUI(cartModeBtn, prefs.priorityMode);
                renderCart();
                showCollectorToast(prefs.priorityMode === 'fuel' ? t('mode_fuel_toast') : t('mode_speed_toast'));
            });
        }

        if (m3 && m4) {
            m3.addEventListener('click', () => {
                let cartOrigin = getCartOrigin();
                cartOrigin.mission = 3;
                saveCartOrigin(cartOrigin);
                m3.classList.add('active');
                m4.classList.remove('active');

                const prefs = getCartPlanetPrefs();
                const groups = getCartGroups();
                groups.forEach(g => {
                    if (!prefs[g.key]) prefs[g.key] = {};
                    prefs[g.key].mission = 3;
                });
                saveCartPlanetPrefs(prefs);
                renderCart();
            });

            m4.addEventListener('click', () => {
                let cartOrigin = getCartOrigin();
                cartOrigin.mission = 4;
                saveCartOrigin(cartOrigin);
                m4.classList.add('active');
                m3.classList.remove('active');

                const prefs = getCartPlanetPrefs();
                const groups = getCartGroups();
                groups.forEach(g => {
                    if (!prefs[g.key]) prefs[g.key] = {};
                    prefs[g.key].mission = 4;
                });
                saveCartPlanetPrefs(prefs);
                renderCart();
            });
        }

        if (cartCurBtn) {
            cartCurBtn.addEventListener('click', () => {
                const cur = getCurrentActiveTarget(getEmpirePlanetsAndMoons());
                if (cur) {
                    const cartOrigin = {
                        originId: cur.id,
                        originCoord: cur.coords,
                        originType: cur.type,
                        originName: cur.name
                    };
                    saveCartOrigin(cartOrigin);
                    renderCartOrigin();
                    showCollectorToast('📍 Merkez güncellendi: ' + (cur.type === 3 ? '🌕 ' : '🪐 ') + cur.name);
                }
            });
        }

        if (originBtn && ddEl) {
            originBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShown = ddEl.style.display === 'block' || ddEl.classList.contains('show');
                ddEl.style.display = isShown ? 'none' : 'block';
                ddEl.classList.toggle('show', !isShown);
            });

            document.addEventListener('click', (e) => {
                if (ddEl && !ddEl.contains(e.target) && !originBtn.contains(e.target)) {
                    ddEl.style.display = 'none';
                    ddEl.classList.remove('show');
                }
            });

            ddEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = e.target.closest('.ls-coll-dd-item');
                if (!item) return;

                let cartOrigin = getCartOrigin();

                if (item.classList.contains('ls-coll-dd-manual')) {
                    const reqType = parseInt(item.getAttribute('data-type'), 10) || 1;
                    const promptMsg = (reqType === 3)
                        ? 'Merkez olacak Ay koordinatını girin (Örn: 1:20:5):'
                        : 'Merkez olacak Gezegen koordinatını girin (Örn: 1:20:5):';
                    const manualCoord = window.prompt(promptMsg, cartOrigin.originCoord || '');
                    if (manualCoord && /^\d+:\d+:\d+$/.test(manualCoord.trim())) {
                        cartOrigin.originCoord = manualCoord.trim();
                        cartOrigin.originType = reqType;
                        cartOrigin.originId = 'manual';
                        cartOrigin.originName = (reqType === 3 ? 'Manuel Ay' : 'Manuel Gezegen');
                        saveCartOrigin(cartOrigin);
                        renderCartOrigin();
                    }
                    ddEl.style.display = 'none';
                    ddEl.classList.remove('show');
                    return;
                }

                cartOrigin.originId = item.getAttribute('data-id');
                cartOrigin.originCoord = item.getAttribute('data-coord');
                cartOrigin.originType = parseInt(item.getAttribute('data-type'), 10) || 1;
                cartOrigin.originName = item.getAttribute('data-name');
                saveCartOrigin(cartOrigin);
                renderCartOrigin();
                ddEl.style.display = 'none';
                ddEl.classList.remove('show');
            });
        }
    }

    function renderCart() {
        const listEl = document.getElementById('ls-cart-list');
        const totalsEl = document.getElementById('ls-cart-totals');
        if (!listEl || !totalsEl) return;

        renderCartOrigin();
        initCartOriginEvents();

        listEl.innerHTML = '';
        totalsEl.innerHTML = '';

        const groups = getCartGroups();
        const shipPrefs = getCartShipPrefs();
        const caps = calculateShipCapacities();

        // Üst panel kontrollerini senkronize et
        const bnChk = document.getElementById('ls-cart-ship-bn');
        const knChk = document.getElementById('ls-cart-ship-kn');
        const rehberChk = document.getElementById('ls-cart-ship-rehber');
        if (bnChk) bnChk.checked = !!shipPrefs.bn;
        if (knChk) knChk.checked = !!shipPrefs.kn;
        if (rehberChk) rehberChk.checked = !!shipPrefs.rehber;

        if (cart.length === 0 || groups.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;color:#666;padding:25px;font-size:11px">' + t('cart_empty') + '</div>';
            return;
        }

        let grandM = 0, grandC = 0, grandD = 0;
        let grandTotalCargo = 0;

        groups.forEach(grp => {
            const targetCargo = grp.totalCargoNeeded;

            if (grp.selected) {
                grandM += grp.netDeficitM;
                grandC += grp.netDeficitC;
                grandD += grp.netDeficitD;
                grandTotalCargo += targetCargo;
            }

            const card = document.createElement('div');
            card.className = 'ls-cart-card';

            const isMoon = (grp.type === 3);
            const icon = isMoon ? '🌕' : '🪐';
            const safePlanetName = escapeHtml(grp.planetName);
            const safeCoords = escapeHtml(grp.coords);

            // Gemi tahmini hesapla
            let shipEstimateText = '';
            if (targetCargo > 0) {
                let parts = [];
                if (shipPrefs.rehber) parts.push(fmt(Math.ceil(targetCargo / caps.rehber)) + ' ' + t('cart_ships_pathfinder', 'Rehber'));
                if (shipPrefs.kn) parts.push(fmt(Math.ceil(targetCargo / caps.kn)) + ' ' + t('cart_ships_sc', 'KN'));
                if (shipPrefs.bn) parts.push(fmt(Math.ceil(targetCargo / caps.bn)) + ' ' + t('cart_ships_lc', 'BN'));
                shipEstimateText = parts.length > 0 ? parts.join(' | ') : t('cart_no_ships', 'Gemi seçilmedi');
            } else {
                shipEstimateText = '<span style="color:#2ecc71">' + t('cart_enough_res', 'Yeterli Kaynak Var ✓') + '</span>';
            }

            card.innerHTML =
                '<div class="ls-cart-card-head">' +
                    '<div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1">' +
                        '<input type="checkbox" class="ls-grp-chk" data-key="' + grp.key + '" ' + (grp.selected ? 'checked' : '') + ' style="accent-color:#00bcff;cursor:pointer;margin:0;width:13px;height:13px" title="' + t('cart_include_batch', 'Toplu dağıtıma dahil et') + '">' +
                        '<span style="font-size:11.5px;font-weight:bold;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
                            icon + ' ' + safePlanetName +
                        '</span>' +
                        '<span style="color:#ffbe3b;font-family:monospace;font-size:10px;white-space:nowrap">[' + safeCoords + ']</span>' +
                    '</div>' +
                    '<div style="display:flex;align-items:center;gap:4px;flex-shrink:0">' +
                        '<button class="ls-cart-mbtn ' + (grp.mission === 3 ? 'active' : '') + '" data-action="mission" data-key="' + grp.key + '" data-val="3" title="' + t('cart_transport_title', 'Nakliye: Boş geri döner') + '">' + t('cart_transport', '🚚 Nakliye') + '</button>' +
                        '<button class="ls-cart-mbtn deploy ' + (grp.mission === 4 ? 'active' : '') + '" data-action="mission" data-key="' + grp.key + '" data-val="4" title="' + t('cart_deploy_title', 'Konuşlandır: Hedefte kalır') + '">' + t('cart_deploy', '🚀 Konuşlandır') + '</button>' +
                        '<button class="ls-btn-sm" data-action="single-send" data-key="' + grp.key + '" style="background:#e67e22;color:#fff;padding:2px 7px;border:none;border-radius:3px;cursor:pointer;font-weight:bold" title="' + t('cart_single_send_title', 'Sadece bu gezegene filo gönder') + '">' +
                            t('cart_single_send', '⚡ Gönder') +
                        '</button>' +
                        '<button class="ls-btn-sm" data-action="delete-planet" data-key="' + grp.key + '" style="background:#e74c3c;color:#fff;padding:2px 6px;font-weight:bold" title="' + t('cart_remove_planet', 'Bu gezegenin tüm sepetini kaldır') + '">' +
                            '✖' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="ls-cart-items-box" style="margin:4px 0 6px 14px;display:flex;flex-direction:column;gap:3px"></div>' +
                '<div style="border-top:1px dashed #233446;padding-top:4px;margin-top:4px">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;font-size:10px">' +
                        '<span style="color:#8899aa;font-weight:bold">' + t('cart_net_deficit', 'Net İhtiyaç:') + '</span>' +
                        '<span style="font-family:monospace">' +
                            '<span style="color:#ffbe3b">' + formatShort(grp.netDeficitM) + ' Met</span> · ' +
                            '<span style="color:#5dade2">' + formatShort(grp.netDeficitC) + ' Kri</span> · ' +
                            '<span style="color:#2ecc71">' + formatShort(grp.netDeficitD) + ' Deu</span>' +
                        '</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;font-size:9.5px;color:#8899aa;margin-top:2px">' +
                        '<span>' + t('cart_total', 'Toplam:') + ' <b style="color:#fff">' + formatShort(targetCargo) + '</b></span>' +
                        '<span>' + shipEstimateText + '</span>' +
                    '</div>' +
                '</div>';

            const itemsBox = card.querySelector('.ls-cart-items-box');

            grp.items.forEach(({ item, originalIndex }) => {
                const itemRow = document.createElement('div');
                itemRow.className = 'ls-item';
                itemRow.style.cssText = 'padding:3px 6px;margin-bottom:2px;font-size:10.5px;' + (item.checked === false ? 'opacity:0.4;text-decoration:line-through;' : '');
                
                const isExtra = !!item.isExtraCost;
                let itemColor = '#ffffff';
                let itemPrefix = '➕ ';
                if (item.isDeduction) {
                    itemColor = '#e67e22';
                    itemPrefix = '📉 ';
                    itemRow.style.borderLeft = '3px solid #e67e22';
                } else if (isExtra) {
                    itemColor = '#00bcff';
                    itemPrefix = '⚡ ';
                    itemRow.style.borderLeft = '3px solid #00bcff';
                }

                const sign = (n) => n < 0 ? fmt(n) : '+' + fmt(n);
                const mColor = (n) => n < 0 ? '#e67e22' : '#ffbe3b';
                const cColor = (n) => n < 0 ? '#e67e22' : '#5dade2';
                const dColor = (n) => n < 0 ? '#e67e22' : '#2ecc71';

                const safeName = escapeHtml(item.name);
                const safeLevel = item.level ? escapeHtml(item.level) : null;
                let titleHtml = '<span style="color:' + itemColor + ';font-weight:bold">' +
                    itemPrefix + safeName +
                '</span>';
                if (safeLevel) titleHtml += '<span style="color:#b0bec5;margin-left:4px">(' + safeLevel + ')</span>';

                itemRow.innerHTML =
                    '<div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1">' +
                        '<input type="checkbox" class="ls-item-chk" data-idx="' + originalIndex + '" ' + (item.checked !== false ? 'checked' : '') + ' style="accent-color:#2ecc71;cursor:pointer;margin:0;width:12px;height:12px" title="' + t('cart_include_calc', 'Bu kalemi hesaplamaya dahil et') + '">' +
                        '<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + titleHtml + '</div>' +
                    '</div>' +
                    '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:auto">' +
                        '<div style="font-size:9.5px;font-family:monospace">' +
                            '<span style="color:' + mColor(item.metal) + '">' + sign(item.metal) + '</span> · ' +
                            '<span style="color:' + cColor(item.crystal) + '">' + sign(item.crystal) + '</span> · ' +
                            '<span style="color:' + dColor(item.deuterium) + '">' + sign(item.deuterium) + '</span>' +
                        '</div>' +
                        '<button class="ls-x" data-action="delete-item" data-idx="' + originalIndex + '" title="' + t('cart_remove_item', 'Sepetten Kaldır') + '">✖</button>' +
                    '</div>';

                itemsBox.appendChild(itemRow);
            });

            // Gezegen Kaynağını Düş Butonu
            const deductBtn = document.createElement('button');
            deductBtn.className = 'ls-btn-sm';
            deductBtn.style.cssText = 'width:fit-content;background:rgba(211,84,0,0.2);border:1px solid #d35400;color:#e67e22;padding:2px 8px;margin-top:2px;font-size:9.5px;border-radius:3px;cursor:pointer';
            deductBtn.textContent = t('cart_deduct_planet', '📉 Bu Gezegenin Canlı Kaynağını Düş');
            deductBtn.title = t('cart_deduct_title', 'Şu an bu gezegendeyseniz eldeki kaynakları sepetten mahsup eder');
            deductBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                deductPlanetResources(grp.coords, grp.type, grp.planetName);
            });
            itemsBox.appendChild(deductBtn);

            listEl.appendChild(card);
        });

        // Event delegation for cards:
        listEl.querySelectorAll('.ls-grp-chk').forEach(chk => {
            chk.addEventListener('change', () => {
                const key = chk.getAttribute('data-key');
                const prefs = getCartPlanetPrefs();
                if (!prefs[key]) prefs[key] = {};
                prefs[key].selected = chk.checked;
                saveCartPlanetPrefs(prefs);
                renderCart();
            });
        });

        listEl.querySelectorAll('.ls-item-chk').forEach(chk => {
            chk.addEventListener('change', () => {
                const idx = parseInt(chk.getAttribute('data-idx'), 10);
                if (cart[idx]) {
                    cart[idx].checked = chk.checked;
                    saveCart();
                    renderCart();
                }
            });
        });

        listEl.querySelectorAll('[data-action="mission"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const key = btn.getAttribute('data-key');
                const val = parseInt(btn.getAttribute('data-val'), 10) || 3;
                const prefs = getCartPlanetPrefs();
                if (!prefs[key]) prefs[key] = {};
                prefs[key].mission = val;
                saveCartPlanetPrefs(prefs);
                renderCart();
            });
        });

        listEl.querySelectorAll('[data-action="single-send"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const key = btn.getAttribute('data-key');
                startCartDelivery('single', key);
            });
        });

        listEl.querySelectorAll('[data-action="delete-planet"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const key = btn.getAttribute('data-key');
                removePlanetCart(key);
            });
        });

        listEl.querySelectorAll('[data-action="delete-item"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                removeCartItem(idx);
            });
        });

        // RENDER TOTALS & BOTTOM BAR
        totalsEl.innerHTML =
            '<div style="background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:8px 10px;margin-bottom:6px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:bold;color:#00bcff;margin-bottom:4px">' +
                    '<span>' + t('cart_grand_total', '📊 Seçili Gezegenler Genel Toplamı:') + '</span>' +
                '</div>' +
                '<div class="ls-total-row" style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;font-size:11px">' +
                    '<span>' + t('cart_metal', '🟡 Metal:') + '</span>' +
                    '<span style="display:flex;align-items:center;gap:4px">' +
                        '<b style="color:#ffbe3b;font-family:monospace">' + fmt(grandM) + '</b>' +
                        '<button id="ls-cp-m" class="ls-cp-btn" title="' + t('cart_copy_hint', 'Kopyala') + '">📋</button>' +
                    '</span>' +
                '</div>' +
                '<div class="ls-total-row" style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;font-size:11px">' +
                    '<span>' + t('cart_crystal', '🔵 Kristal:') + '</span>' +
                    '<span style="display:flex;align-items:center;gap:4px">' +
                        '<b style="color:#5dade2;font-family:monospace">' + fmt(grandC) + '</b>' +
                        '<button id="ls-cp-c" class="ls-cp-btn" title="' + t('cart_copy_hint', 'Kopyala') + '">📋</button>' +
                    '</span>' +
                '</div>' +
                '<div class="ls-total-row" style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;font-size:11px">' +
                    '<span>' + t('cart_deuterium', '🟢 Deuterium:') + '</span>' +
                    '<span style="display:flex;align-items:center;gap:4px">' +
                        '<b style="color:#2ecc71;font-family:monospace">' + fmt(grandD) + '</b>' +
                        '<button id="ls-cp-d" class="ls-cp-btn" title="' + t('cart_copy_hint', 'Kopyala') + '">📋</button>' +
                    '</span>' +
                '</div>' +
                '<div class="ls-total-row" style="border-top:1px solid #233446;padding-top:4px;margin-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:11px">' +
                    '<span style="color:#ff6b6b;font-weight:bold">' + t('cart_cargo_needed', '🔴 Toplam Kargo:') + '</span>' +
                    '<span style="display:flex;align-items:center;gap:4px">' +
                        '<b style="color:#fff;font-family:monospace;font-weight:bold">' + fmt(grandTotalCargo) + '</b>' +
                        '<button id="ls-cp-net" class="ls-cp-btn" title="' + t('cart_copy_hint', 'Kopyala') + '">📋</button>' +
                    '</span>' +
                '</div>' +
            '</div>' +

            // Sırayla Dağıtım Butonu
            '<button id="ls-cart-bulk-send-btn" class="ls-btn" style="width:100%;background:linear-gradient(135deg,#00bcff,#0077b6);color:#fff;padding:8px;font-size:11px;font-weight:bold;box-shadow:0 2px 8px rgba(0,188,255,0.4)">' +
                t('cart_bulk_distribute', '⚡ SEÇİLİ GEZEGENLERE SIRAYLA DAĞIT') +
            '</button>';

        document.getElementById('ls-cart-bulk-send-btn')?.addEventListener('click', () => {
            startCartDelivery('bulk');
        });

        document.getElementById('ls-cp-m')?.addEventListener('click', () => copyNumber(grandM, 'ls-cp-m'));
        document.getElementById('ls-cp-c')?.addEventListener('click', () => copyNumber(grandC, 'ls-cp-c'));
        document.getElementById('ls-cp-d')?.addEventListener('click', () => copyNumber(grandD, 'ls-cp-d'));
        document.getElementById('ls-cp-net')?.addEventListener('click', () => copyNumber(grandTotalCargo, 'ls-cp-net'));
    }

    function copyCart() {
        const groups = getCartGroups();
        let lines = ['═══ LuckyStrike Maliyet Sepeti ═══', ''];
        let tM = 0, tC = 0, tD = 0;

        groups.forEach(grp => {
            lines.push(`🪐 ${grp.planetName} [${grp.coords}] (Görev: ${grp.mission === 4 ? 'Konuşlandır' : 'Nakliye'})`);
            grp.items.forEach(({ item }) => {
                let label = item.name;
                if (item.level) label += ' (' + item.level + ')';
                const signStr = item.isDeduction ? '📉 ' : (item.isExtraCost ? '⚡ ' : '➕ ');
                lines.push(`  ${signStr}${label}: M: ${fmt(item.metal)} | K: ${fmt(item.crystal)} | D: ${fmt(item.deuterium)}`);
            });
            const pM = grp.netDeficitM;
            const pC = grp.netDeficitC;
            const pD = grp.netDeficitD;
            const pTotal = grp.totalCargoNeeded;
            lines.push(`  Net İhtiyaç: M: ${fmt(pM)} | K: ${fmt(pC)} | D: ${fmt(pD)}`);
            lines.push(`  Toplam Kargo: ${fmt(pTotal)}`);
            lines.push('');
            if (grp.selected) {
                tM += pM;
                tC += pC;
                tD += pD;
            }
        });

        lines.push('GENEL SEÇİLİ TOPLAM:');
        lines.push(`Metal: ${fmt(tM)} | Kristal: ${fmt(tC)} | Deuterium: ${fmt(tD)}`);
        lines.push(`Toplam Kargo İhtiyacı: ${fmt(tM + tC + tD)}`);

        copyTextSafe(lines.join('\n'), () => {
            const btn = document.getElementById('ls-cart-copy');
            if (btn) { btn.textContent = '✓ Kopyalandı!'; setTimeout(() => { btn.textContent = '📋 Panoya Kopyala'; }, 2000); }
        });
    }

    // ============================================================
    // GALAXY SCANNER (CACHED & THROTTLED)
    // ============================================================
    let universeCacheInMemory = null;
    let universeCooldownTimer = null;

    function getUniverseCache() {
        if (universeCacheInMemory && (Date.now() - universeCacheInMemory.ts < 24 * 3600 * 1000) && Array.isArray(universeCacheInMemory.coords)) {
            return universeCacheInMemory;
        }

        const raw = sessionStorage.getItem(KEYS.UNIVERSE_CACHE) || localStorage.getItem(KEYS.UNIVERSE_CACHE);
        if (raw) {
            try {
                const cache = JSON.parse(raw);
                if (cache && cache.ts && (Date.now() - cache.ts < 24 * 3600 * 1000) && Array.isArray(cache.coords)) {
                    universeCacheInMemory = cache;
                    return cache;
                }
            } catch (e) { /* ignore parse error */ }
        }

        const apiRaw = sessionStorage.getItem(KEYS.API) || localStorage.getItem(KEYS.API);
        if (apiRaw) {
            try {
                const apiData = JSON.parse(apiRaw);
                if (apiData && apiData.ts && (Date.now() - apiData.ts < 24 * 3600 * 1000) && Array.isArray(apiData.planets)) {
                    const coords = apiData.planets.map(p => p.coords).filter(Boolean);
                    if (coords.length > 0) {
                        const fallbackCache = { ts: apiData.ts, coords };
                        universeCacheInMemory = fallbackCache;
                        return fallbackCache;
                    }
                }
            } catch (e) { /* ignore */ }
        }

        return null;
    }

    function formatTimeAgo(ts) {
        if (!ts) return '';
        const diffMs = Date.now() - ts;
        const isTr = (currentLang !== 'en');
        if (diffMs < 60 * 1000) return isTr ? 'Az önce' : 'Just now';
        const diffMins = Math.floor(diffMs / (60 * 1000));
        if (diffMins < 60) return diffMins + (isTr ? ' dk önce' : ' min ago');
        const diffHours = Math.floor(diffMs / (3600 * 1000));
        if (diffHours < 24) return diffHours + (isTr ? ' sa önce' : ' hr ago');
        return new Date(ts).toLocaleDateString();
    }

    function updateScanStatusInfo() {
        const statusEl = document.getElementById('ls-scan-status');
        if (!statusEl || statusEl.getAttribute('data-busy')) return;
        const cache = getUniverseCache();
        if (cache && cache.ts && Array.isArray(cache.coords)) {
            const timeStr = new Date(cache.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const pLbl = (currentLang !== 'en') ? 'gezegen' : 'planets';
            const cLbl = t('scan_cached', 'Önbellek');
            statusEl.innerHTML = '<span style="color:#607d8b">' + cLbl + ': ' + timeStr + ' (' + formatTimeAgo(cache.ts) + ') · ' + (cache.coords.length || 0).toLocaleString() + ' ' + pLbl + '</span>';
        } else {
            statusEl.innerHTML = '<span style="color:#8899aa">' + t('scan_no_data', 'Henüz evren verisi indirilmedi') + '</span>';
        }
    }

    function updateFinderStatusInfo() {
        const infoEl = document.getElementById('ls-find-cache-info');
        if (!infoEl || infoEl.getAttribute('data-busy')) return;

        let apiData = loadApiDataSync();

        if (apiData && apiData.ts) {
            const timeStr = new Date(apiData.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const pCount = (Array.isArray(apiData.planets) ? apiData.planets.length : 0);
            const uCount = (apiData.players && typeof apiData.players === 'object' ? Object.keys(apiData.players).length : 0);
            const pLbl = (currentLang !== 'en') ? 'Gezegen' : 'Planets';
            const uLbl = (currentLang !== 'en') ? 'Oyuncu' : 'Players';
            const cLbl = t('find_cached', 'Önbellek');
            infoEl.innerHTML = '<span style="color:#607d8b">' + cLbl + ': ' + timeStr + ' (' + formatTimeAgo(apiData.ts) + ') · ' + pCount.toLocaleString() + ' ' + pLbl + ' · ' + uCount.toLocaleString() + ' ' + uLbl + '</span>';
        } else {
            infoEl.innerHTML = '<span style="color:#8899aa">' + t('find_no_cache', 'Henüz evren/oyuncu verisi indirilmedi') + '</span>';
        }
    }

    function updateRefreshButtonCooldown() {
        const scanBtn = document.getElementById('ls-scan-refresh-btn');
        const findBtn = document.getElementById('ls-find-refresh-btn');
        if (!scanBtn && !findBtn) return;

        const lastRefresh = parseInt(localStorage.getItem(KEYS.UNIVERSE_LAST_REFRESH) || '0', 10);
        const elapsed = Math.floor((Date.now() - lastRefresh) / 1000);
        const remaining = 60 - elapsed;

        const setCooldownUI = (btn, rem) => {
            if (!btn) return;
            if (rem > 0) {
                btn.disabled = true;
                btn.textContent = '⏳ ' + rem + 's';
                btn.title = (currentLang === 'tr' ? ('Yeni güncelleme için ' + rem + ' saniye bekleyin') : ('Wait ' + rem + 's for next refresh'));
            } else {
                btn.disabled = false;
                btn.textContent = t('scan_refresh_btn', '🔄 Güncelle');
                btn.title = (btn.id === 'ls-find-refresh-btn' ? t('find_refresh_title') : t('scan_refresh_title'));
            }
        };

        if (remaining > 0) {
            setCooldownUI(scanBtn, remaining);
            setCooldownUI(findBtn, remaining);
            if (!universeCooldownTimer) {
                universeCooldownTimer = setInterval(() => {
                    const nowElapsed = Math.floor((Date.now() - parseInt(localStorage.getItem(KEYS.UNIVERSE_LAST_REFRESH) || '0', 10)) / 1000);
                    const rem = 60 - nowElapsed;
                    const sb = document.getElementById('ls-scan-refresh-btn');
                    const fb = document.getElementById('ls-find-refresh-btn');
                    if (rem <= 0) {
                        clearInterval(universeCooldownTimer);
                        universeCooldownTimer = null;
                        setCooldownUI(sb, 0);
                        setCooldownUI(fb, 0);
                    } else {
                        setCooldownUI(sb, rem);
                        setCooldownUI(fb, rem);
                    }
                }, 1000);
            }
        } else {
            if (universeCooldownTimer) {
                clearInterval(universeCooldownTimer);
                universeCooldownTimer = null;
            }
            setCooldownUI(scanBtn, 0);
            setCooldownUI(findBtn, 0);
        }
    }

    async function forceRefreshAllUniverseData() {
        const lastRefresh = parseInt(localStorage.getItem(KEYS.UNIVERSE_LAST_REFRESH) || '0', 10);
        const validApi = loadApiDataSync();
        const validUniverse = getUniverseCache();

        if (Date.now() - lastRefresh < 60000 && validApi && validUniverse) {
            updateRefreshButtonCooldown();
            return {
                apiData: validApi,
                universeData: validUniverse
            };
        }

        localStorage.setItem(KEYS.UNIVERSE_LAST_REFRESH, Date.now().toString());
        updateRefreshButtonCooldown();

        const scanBtn = document.getElementById('ls-scan-btn');
        const findBtn = document.getElementById('ls-find-btn');
        const scanStatusEl = document.getElementById('ls-scan-status');
        const scanProgEl = document.getElementById('ls-scan-progress');
        const scanBarEl = document.getElementById('ls-scan-bar');
        const findCacheInfoEl = document.getElementById('ls-find-cache-info');
        const findProgEl = document.getElementById('ls-find-progress');
        const findBarEl = document.getElementById('ls-find-bar');

        if (scanBtn) scanBtn.disabled = true;
        if (findBtn) findBtn.disabled = true;

        const loadingMsg = (currentLang === 'tr' ? 'Sunucudan taze evren ve oyuncu verisi çekiliyor...' : 'Fetching fresh universe and player data...');
        if (scanStatusEl) {
            scanStatusEl.setAttribute('data-busy', '1');
            scanStatusEl.textContent = loadingMsg;
        }
        if (findCacheInfoEl) {
            findCacheInfoEl.setAttribute('data-busy', '1');
            findCacheInfoEl.textContent = loadingMsg;
        }
        if (scanProgEl) scanProgEl.style.display = 'block';
        if (scanBarEl) scanBarEl.style.width = '20%';
        if (findProgEl) findProgEl.style.display = 'block';
        if (findBarEl) findBarEl.style.width = '20%';

        try {
            const [pResp, uResp] = await Promise.all([
                fetch('/api/players.xml'),
                fetch('/api/universe.xml')
            ]);
            if (!pResp.ok || !uResp.ok) throw new Error('API erişim hatası (' + pResp.status + ' / ' + uResp.status + ')');

            if (scanBarEl) scanBarEl.style.width = '60%';
            if (findBarEl) findBarEl.style.width = '60%';

            const [pText, uText] = await Promise.all([pResp.text(), uResp.text()]);

            const pDoc = new DOMParser().parseFromString(pText, 'text/xml');
            const uDoc = new DOMParser().parseFromString(uText, 'text/xml');

            const players = {};
            const pEls = pDoc.getElementsByTagName('player');
            for (let i = 0; i < pEls.length; i++) {
                players[pEls[i].getAttribute('id')] = {
                    name: pEls[i].getAttribute('name') || '',
                    status: pEls[i].getAttribute('status') || ''
                };
            }

            const planets = [];
            const coords = [];
            const plEls = uDoc.getElementsByTagName('planet');
            for (let i = 0; i < plEls.length; i++) {
                const c = plEls[i].getAttribute('coords') || '';
                if (c) coords.push(c);
                planets.push({
                    player: plEls[i].getAttribute('player'),
                    name: plEls[i].getAttribute('name') || '',
                    coords: c
                });
            }

            const now = Date.now();
            const apiData = { ts: now, players, planets };
            const universeData = { ts: now, coords };

            apiCacheInMemory = apiData;
            universeCacheInMemory = universeData;

            try {
                sessionStorage.setItem(KEYS.API, JSON.stringify(apiData));
                sessionStorage.setItem(KEYS.UNIVERSE_CACHE, JSON.stringify(universeData));
            } catch (e) {
                try {
                    localStorage.setItem(KEYS.API, JSON.stringify(apiData));
                    localStorage.setItem(KEYS.UNIVERSE_CACHE, JSON.stringify(universeData));
                } catch (e2) {}
            }

            if (scanBarEl) scanBarEl.style.width = '100%';
            if (findBarEl) findBarEl.style.width = '100%';

            const uLbl = (currentLang === 'tr' ? 'Güncellendi!' : 'Updated!');
            const pLbl = (currentLang === 'tr' ? 'gezegen' : 'planets');
            const plyrLbl = (currentLang === 'tr' ? 'oyuncu kaydedildi.' : 'players saved.');

            if (scanStatusEl) {
                scanStatusEl.removeAttribute('data-busy');
                scanStatusEl.innerHTML = '<span style="color:#2ecc71">✓ ' + uLbl + ' ' + coords.length.toLocaleString() + ' ' + pLbl + '</span>';
            }
            if (findCacheInfoEl) {
                findCacheInfoEl.removeAttribute('data-busy');
                findCacheInfoEl.innerHTML = '<span style="color:#2ecc71">✓ ' + uLbl + ' ' + coords.length.toLocaleString() + ' ' + pLbl + ', ' + Object.keys(players).length.toLocaleString() + ' ' + plyrLbl + '</span>';
            }

            LS_LOGGER.info('UNIVERSE', `Evren ve oyuncu verisi senkronize edildi: ${coords.length} gezegen, ${Object.keys(players).length} oyuncu.`);

            setTimeout(() => {
                updateScanStatusInfo();
                updateFinderStatusInfo();
                if (scanProgEl) scanProgEl.style.display = 'none';
                if (findProgEl) findProgEl.style.display = 'none';
            }, 2500);

            return { apiData, universeData };
        } catch (err) {
            console.warn(LS, 'Evren/oyuncu verisi güncellenemedi:', err.message);
            const errMsg = '<span style="color:#e74c3c">Hata: ' + escapeHtml(err.message) + '</span>';
            if (scanStatusEl) {
                scanStatusEl.removeAttribute('data-busy');
                scanStatusEl.innerHTML = errMsg;
            }
            if (findCacheInfoEl) {
                findCacheInfoEl.removeAttribute('data-busy');
                findCacheInfoEl.innerHTML = errMsg;
            }
            if (scanProgEl) scanProgEl.style.display = 'none';
            if (findProgEl) findProgEl.style.display = 'none';
            return { apiData: loadApiDataSync(), universeData: getUniverseCache(), error: err.message };
        } finally {
            if (scanBtn) scanBtn.disabled = false;
            if (findBtn) findBtn.disabled = false;
        }
    }

    async function fetchUniverseData(force = false) {
        if (!force) {
            const cached = getUniverseCache();
            if (cached && Array.isArray(cached.coords) && cached.coords.length > 0) {
                return cached;
            }
        }
        const res = await forceRefreshAllUniverseData();
        return res?.universeData || getUniverseCache() || { coords: [] };
    }

    async function startScan() {
        const btn = document.getElementById('ls-scan-btn');
        const refreshBtn = document.getElementById('ls-scan-refresh-btn');
        const statusEl = document.getElementById('ls-scan-status');
        const progEl = document.getElementById('ls-scan-progress');
        const barEl = document.getElementById('ls-scan-bar');
        const resBox = document.getElementById('ls-scan-results-box');
        const resList = document.getElementById('ls-scan-results');

        const gStart = parseInt(document.getElementById('ls-sg1').value, 10) || 1;
        const gEnd = parseInt(document.getElementById('ls-sg2').value, 10) || 9;
        const sStart = parseInt(document.getElementById('ls-ss1').value, 10) || 1;
        const sEnd = parseInt(document.getElementById('ls-ss2').value, 10) || 499;
        const slotsStr = document.getElementById('ls-slots').value || '8';
        const minEmpty = parseInt(document.getElementById('ls-min').value, 10) || 1;

        const targetSlots = slotsStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 15);
        if (targetSlots.length === 0) { statusEl.textContent = (currentLang === 'tr' ? 'Geçerli slot girilmedi!' : 'No valid slots entered!'); return; }

        scanSettings = { gStart, gEnd, sStart, sEnd, slots: slotsStr, minEmpty };
        localStorage.setItem(KEYS.SCAN, JSON.stringify(scanSettings));
        LS_LOGGER.action('SCANNER', `Galaksi taraması başlatıldı: G[${gStart}-${gEnd}], S[${sStart}-${sEnd}], Slotlar: ${slotsStr}, Min Boş: ${minEmpty}`);

        btn.disabled = true;
        btn.textContent = t('scan_scanning', '⏳ Taranıyor...');
        if (refreshBtn) refreshBtn.disabled = true;
        if (statusEl) statusEl.setAttribute('data-busy', '1');
        progEl.style.display = 'block';
        barEl.style.width = '0%';
        resBox.style.display = 'none';
        resList.innerHTML = '';
        statusEl.textContent = (currentLang === 'tr' ? 'Evren verisi hazırlanıyor...' : 'Preparing universe data...');

        try {
            const data = await fetchUniverseData(false);
            if (!data || !Array.isArray(data.coords) || data.coords.length === 0) {
                statusEl.textContent = (currentLang === 'tr' ? 'Evren koordinat verisi alınamadı (Önce güncellemeyi deneyin)' : 'Universe coordinate data not available (Try refreshing)');
                if (statusEl) statusEl.removeAttribute('data-busy');
                btn.disabled = false;
                btn.textContent = t('scan_start_btn', '🔍 Taramayı Başlat');
                updateRefreshButtonCooldown();
                setTimeout(() => { progEl.style.display = 'none'; }, 2000);
                return;
            }
            statusEl.textContent = (currentLang === 'tr' ? 'Boş slotlar hesaplanıyor...' : 'Calculating empty slots...');
            barEl.style.width = '60%';

            const occupied = new Set(data.coords);
            const results = [];
            for (let g = gStart; g <= gEnd; g++) {
                for (let s = sStart; s <= sEnd; s++) {
                    const empty = [];
                    for (const slot of targetSlots) {
                        if (!occupied.has(g + ':' + s + ':' + slot)) empty.push(slot);
                    }
                    if (empty.length >= minEmpty) results.push({ g, s, slots: empty });
                }
            }

            barEl.style.width = '100%';
            const ageStr = formatTimeAgo(data.ts);
            statusEl.innerHTML = results.length + ' ' + t('scan_found', 'sonuç bulundu.') + ' <span style="color:#607d8b">(' + ageStr + ')</span>';

            if (results.length > 0) {
                resBox.style.display = 'flex';
                lastScanResults = results;

                results.forEach(r => {
                    const div = document.createElement('div');
                    div.className = 'ls-item';
                    div.style.boxSizing = 'border-box';
                    div.style.width = '100%';
                    const badges = r.slots.map(s => '<span class="ls-badge">' + parseInt(s, 10) + '</span>').join(' ');
                    div.innerHTML =
                        '<div style="flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:center;gap:3px">' +
                            '<strong style="color:#00bcff;margin-right:4px">[' + parseInt(r.g, 10) + ':' + parseInt(r.s, 10) + ']</strong> ' + badges +
                        '</div>';
                    const navBtn = document.createElement('button');
                    navBtn.className = 'ls-btn-sm';
                    navBtn.style.flexShrink = '0';
                    navBtn.textContent = '🚀';
                    navBtn.title = (currentLang === 'tr' ? 'Galaksiye Git' : 'Go to Galaxy');
                    navBtn.addEventListener('click', () => navigateToGalaxy(r.g, r.s));
                    div.appendChild(navBtn);
                    resList.appendChild(div);
                });
            }
        } catch (e) {
            console.warn(LS, 'Tarama hatası:', e);
            statusEl.textContent = 'Hata: ' + e.message;
        } finally {
            if (statusEl) statusEl.removeAttribute('data-busy');
            btn.disabled = false;
            btn.textContent = t('scan_start_btn', '🔍 Taramayı Başlat');
            updateRefreshButtonCooldown();
            setTimeout(() => { progEl.style.display = 'none'; }, 2000);
        }
    }

    let lastScanResults = null;

    function copyScanResults() {
        if (!lastScanResults) return;
        const lines = ['═══ ' + t('tab_scanner') + ' ' + (currentLang === 'tr' ? 'Sonuçları' : 'Results') + ' ═══', ''];
        lastScanResults.forEach(r => {
            lines.push('[' + r.g + ':' + r.s + '] → ' + (currentLang === 'tr' ? 'Boş: ' : 'Empty: ') + r.slots.join(', '));
        });
        lines.push('');
        lines.push((currentLang === 'tr' ? 'Toplam: ' : 'Total: ') + lastScanResults.length + ' ' + (currentLang === 'tr' ? 'sistem' : 'systems'));
        copyTextSafe(lines.join('\n'), () => {
            const btn = document.getElementById('ls-scan-copy');
            if (btn) { btn.textContent = t('cart_copied'); setTimeout(() => { btn.textContent = t('scan_copy_coords'); }, 2000); }
        });
    }

    // ============================================================
    // PLAYER FINDER
    // ============================================================
    let apiCacheInMemory = null;

    function loadApiDataSync() {
        if (apiCacheInMemory && (Date.now() - apiCacheInMemory.ts < 24 * 3600 * 1000) && apiCacheInMemory.players && apiCacheInMemory.planets) {
            return apiCacheInMemory;
        }

        const raw = sessionStorage.getItem(KEYS.API) || localStorage.getItem(KEYS.API);
        if (raw) {
            try {
                const cache = JSON.parse(raw);
                if (cache && cache.ts && (Date.now() - cache.ts < 24 * 3600 * 1000) && cache.players && cache.planets) {
                    apiCacheInMemory = cache;
                    return cache;
                }
            } catch (e) { /* ignore */ }
        }
        return null;
    }

    async function loadApiData(force = false) {
        if (!force) {
            const cached = loadApiDataSync();
            if (cached) return cached;
        }

        const res = await forceRefreshAllUniverseData();
        return res?.apiData || loadApiDataSync() || { players: {}, planets: [] };
    }

    async function startFinder() {
        const query = document.getElementById('ls-find-q').value.trim().toLowerCase();
        const type = document.querySelector('input[name="ls-find-type"]:checked')?.value || 'player';
        const statusEl = document.getElementById('ls-find-status');
        const resultsEl = document.getElementById('ls-find-results');
        const btn = document.getElementById('ls-find-btn');

        if (query.length < 2) { statusEl.textContent = t('find_min_chars'); return; }

        btn.disabled = true;
        statusEl.textContent = t('find_searching');
        resultsEl.innerHTML = '';
        LS_LOGGER.action('FINDER', `Arama yapılıyor: "${query}" (Tip: ${type})`);

        try {
            const data = await loadApiData();
            if (!data || !data.players || !Array.isArray(data.planets) || data.planets.length === 0) {
                statusEl.textContent = (currentLang === 'tr' ? 'Oyuncu verisi henüz indirilmedi (Önce güncelleyin)' : 'Player data not downloaded yet (Try refreshing)');
                btn.disabled = false;
                return;
            }
            let html = '';
            let count = 0;
            let hitLimit = false;

            if (type === 'player') {
                for (const pid in data.players) {
                    const p = data.players[pid];
                    if (p && p.name && p.name.toLowerCase().includes(query)) {
                        if (count >= 50) { hitLimit = true; break; }
                        count++;
                        const pPlanets = data.planets.filter(pl => pl && pl.player === pid);
                        const safePName = escapeHtml(p.name);
                        const sts = p.status ? ' <span style="color:#e74c3c">(' + escapeHtml(p.status) + ')</span>' : ' <span style="color:#2ecc71">(' + t('find_active') + ')</span>';

                        html += '<div class="ls-finder-card">';
                        html += '<div style="font-weight:bold;color:#fff;margin-bottom:4px">' + safePName + sts + '</div>';
                        pPlanets.forEach(pl => {
                            const parts = (pl.coords || '1:1:1').split(':');
                            const safePlName = escapeHtml(pl.name || 'Gezegen');
                            const safeCoords = escapeHtml(pl.coords || '');
                            html += '<div class="ls-finder-planet">' +
                                '<span>' + safePlName + ' <span style="color:#888">[' + safeCoords + ']</span></span>' +
                                '<button class="ls-btn-sm ls-nav-btn" data-g="' + parseInt(parts[0], 10) + '" data-s="' + parseInt(parts[1], 10) + '" title="' + (currentLang === 'tr' ? 'Galaksiye Git' : 'Go to Galaxy') + '">🚀</button>' +
                            '</div>';
                        });
                        html += '</div>';
                    }
                }
            } else {
                for (const pl of data.planets) {
                    if (pl && pl.name && pl.name.toLowerCase().includes(query)) {
                        if (count >= 50) { hitLimit = true; break; }
                        count++;
                        const owner = data.players ? data.players[pl.player] : null;
                        const ownerName = owner ? owner.name : '?';
                        const parts = (pl.coords || '1:1:1').split(':');
                        const safePlName = escapeHtml(pl.name || 'Gezegen');
                        const safeCoords = escapeHtml(pl.coords || '');
                        const safeOwner = escapeHtml(ownerName);
                        html += '<div class="ls-item" style="border-left:3px solid #2ecc71">' +
                            '<div style="flex:1">' +
                                '<strong style="color:#2ecc71">' + safePlName + '</strong> <span style="color:#888">[' + safeCoords + ']</span><br>' +
                                '<span style="font-size:10px;color:#aaa">' + t('find_owner') + ': ' + safeOwner + '</span>' +
                            '</div>' +
                            '<button class="ls-btn-sm ls-nav-btn" data-g="' + parseInt(parts[0], 10) + '" data-s="' + parseInt(parts[1], 10) + '" title="' + (currentLang === 'tr' ? 'Galaksiye Git' : 'Go to Galaxy') + '">🚀</button>' +
                        '</div>';
                    }
                }
            }

            if (count === 0) {
                statusEl.textContent = t('find_no_results', 'Sonuç bulunamadı.');
            } else if (hitLimit) {
                statusEl.textContent = (currentLang === 'tr' ? '50+ sonuç bulundu (İlk 50 listeleniyor)' : '50+ results found (First 50 listed)');
            } else {
                statusEl.textContent = count + ' ' + t('scan_found', 'sonuç bulundu.');
            }
            resultsEl.innerHTML = html;

            resultsEl.querySelectorAll('.ls-nav-btn').forEach(b => {
                b.addEventListener('click', (e) => {
                    e.preventDefault();
                    const g = parseInt(b.getAttribute('data-g'), 10);
                    const s = parseInt(b.getAttribute('data-s'), 10);
                    if (g && s) navigateToGalaxy(g, s);
                });
            });
        } catch (e) {
            console.warn(LS, 'Oyuncu arama hatası:', e);
            statusEl.textContent = 'Hata: ' + e.message;
        } finally {
            btn.disabled = false;
        }
    }

    // ============================================================
    // NAVIGATION
    // ============================================================
    function navigateToGalaxy(g, s) {
        const gInp = document.getElementById('galaxy_input');
        const sInp = document.getElementById('system_input');
        if (gInp && sInp) {
            gInp.value = g;
            sInp.value = s;
            ['change', 'keyup', 'input'].forEach(evt => {
                gInp.dispatchEvent(new Event(evt, { bubbles: true }));
                sInp.dispatchEvent(new Event(evt, { bubbles: true }));
            });
            const submit = document.querySelector('#galaxyHeader .btn_blue') ||
                           document.querySelector('#galaxy_form .btn_blue') ||
                           document.querySelector('button[type="submit"]');
            if (submit) { submit.click(); return; }
        }
        window.location.href = '?page=ingame&component=galaxy&galaxy=' + g + '&system=' + s;
    }
    window.lsNav = navigateToGalaxy;

    // ============================================================
    // THREAT ALARM & AUDIO SYNTHESIS
    // ============================================================
    let audioCtx = null;

    async function ensureAudioContext() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            if (!audioCtx || audioCtx.state === 'closed') {
                audioCtx = new AudioContextClass();
            }
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume().catch(() => {});
            }
            return audioCtx;
        } catch (e) {
            return audioCtx;
        }
    }

    function getAudioContext() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            if (!audioCtx || audioCtx.state === 'closed') {
                audioCtx = new AudioContextClass();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
            return audioCtx;
        } catch (e) {
            return null;
        }
    }

    async function unlockAudio() {
        try {
            return await ensureAudioContext();
        } catch (e) {
            return null;
        }
    }
    ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { passive: true });
    });

    async function playAttackAlertSound(soundType) {
        try {
            const ctx = await ensureAudioContext();
            if (!ctx) {
                console.warn('[LS] Ses çalınamadı: AudioContext bulunamadı.');
                return;
            }
            const volume = Math.max(0.01, Math.min(1.0, (alarmSettings.volume ?? 70) / 100));
            // Donanım zaman sapmasını ve JS gecikmesini önlemek için 50ms güvenli başlangıç payı
            const now = (ctx.currentTime || 0) + 0.05;
            const type = soundType || alarmSettings.attackSound || 'klaxon';

            if (type === 'siren') {
                // 2. Kırmızı Alarm Sireni (Klasik Sci-Fi Siren) - 2 KEZ PEŞ PEŞE ÇALMA
                [0, 1.05].forEach(cycleOffset => {
                    const cycleStart = now + cycleOffset;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(440, cycleStart);
                    osc.frequency.linearRampToValueAtTime(880, cycleStart + 0.45);
                    osc.frequency.linearRampToValueAtTime(480, cycleStart + 0.90);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(1400, cycleStart);

                    gain.gain.setValueAtTime(0.001, cycleStart);
                    gain.gain.linearRampToValueAtTime(volume * 0.70, cycleStart + 0.08);
                    gain.gain.setValueAtTime(volume * 0.70, cycleStart + 0.75);
                    gain.gain.exponentialRampToValueAtTime(0.001, cycleStart + 0.95);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(cycleStart);
                    osc.stop(cycleStart + 0.98);
                });
            } else if (type === 'pulse') {
                // 3. Acil Durum Nabzı (Staccato Klaxon) - 2 KEZ PEŞ PEŞE ÇALMA
                [0, 0.75].forEach(cycleOffset => {
                    const cycleStart = now + cycleOffset;
                    const pulses = [
                        { t: cycleStart + 0.00, dur: 0.09, freq: 880 },
                        { t: cycleStart + 0.13, dur: 0.09, freq: 880 },
                        { t: cycleStart + 0.26, dur: 0.15, freq: 1100 }
                    ];

                    pulses.forEach(p => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();

                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(p.freq, p.t);

                        gain.gain.setValueAtTime(0.001, p.t);
                        gain.gain.linearRampToValueAtTime(volume * 0.85, p.t + 0.02);
                        gain.gain.exponentialRampToValueAtTime(0.001, p.t + p.dur);

                        osc.connect(gain);
                        gain.connect(ctx.destination);

                        osc.start(p.t);
                        osc.stop(p.t + p.dur + 0.02);
                    });
                });
            } else {
                // 1. Taktiksel Klakson (Varsayılan) - 2 KEZ PEŞ PEŞE ÇALMA
                [0, 0.70].forEach(cycleOffset => {
                    const cycleStart = now + cycleOffset;
                    const tones = [
                        { start: cycleStart, f1: 587, f2: 740, dur: 0.28 },
                        { start: cycleStart + 0.25, f1: 587, f2: 880, dur: 0.34 }
                    ];

                    tones.forEach(t => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();

                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(t.f1, t.start);
                        osc.frequency.exponentialRampToValueAtTime(t.f2, t.start + (t.dur * 0.4));

                        gain.gain.setValueAtTime(0.001, t.start);
                        gain.gain.linearRampToValueAtTime(volume * 0.75, t.start + 0.02);
                        gain.gain.setValueAtTime(volume * 0.75, t.start + (t.dur * 0.6));
                        gain.gain.exponentialRampToValueAtTime(0.001, t.start + t.dur);

                        osc.connect(gain);
                        gain.connect(ctx.destination);

                        osc.start(t.start);
                        osc.stop(t.start + t.dur + 0.05);
                    });
                });
            }
        } catch (e) {
            console.warn('[LS] Saldırı alarm sesi çalınamadı:', e.message || e);
            if (typeof LS_LOGGER !== 'undefined') {
                LS_LOGGER.log('WARN', 'AUDIO', 'Saldırı sesi çalınamadı: ' + (e.message || e));
            }
        }
    }

    async function playEspionageAlertSound(soundType) {
        try {
            const ctx = await ensureAudioContext();
            if (!ctx) {
                console.warn('[LS] Ses çalınamadı: AudioContext bulunamadı.');
                return;
            }
            const volume = Math.max(0.01, Math.min(1.0, (alarmSettings.volume ?? 70) / 100));
            // Donanım zaman sapmasını ve JS gecikmesini önlemek için 50ms güvenli başlangıç payı
            const now = (ctx.currentTime || 0) + 0.05;
            const type = soundType || alarmSettings.espionageSound || 'sonar_deep';

            if (type === 'sonar_hunter' || type === 'hunter') {
                // 2. Aktif Avcı Sonarı (Yüksek Frekanslı Taktik Ping) - 2 KEZ PEŞ PEŞE ÇALMA
                [0, 1.10].forEach(pingOffset => {
                    const pingTime = now + pingOffset;

                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(1650, pingTime);
                    osc1.frequency.exponentialRampToValueAtTime(1630, pingTime + 1.0);

                    gain1.gain.setValueAtTime(0.0001, pingTime);
                    gain1.gain.linearRampToValueAtTime(volume * 0.75, pingTime + 0.015);
                    gain1.gain.exponentialRampToValueAtTime(volume * 0.20, pingTime + 0.25);
                    gain1.gain.exponentialRampToValueAtTime(0.0001, pingTime + 1.05);

                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(3300, pingTime);
                    osc2.frequency.exponentialRampToValueAtTime(3100, pingTime + 0.06);

                    gain2.gain.setValueAtTime(0.0001, pingTime);
                    gain2.gain.linearRampToValueAtTime(volume * 0.30, pingTime + 0.015);
                    gain2.gain.exponentialRampToValueAtTime(0.0001, pingTime + 0.06);

                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);

                    osc1.start(pingTime);
                    osc1.stop(pingTime + 1.10);
                    osc2.start(pingTime);
                    osc2.stop(pingTime + 0.07);
                });
            } else if (type === 'sonar_echo' || type === 'echo') {
                // 3. Taktik Yankı Sonarı (Çift Vuruşlu Eko Sonar) - 2 KEZ PEŞ PEŞE ÇALMA
                [0, 1.35].forEach(cycleOffset => {
                    const cycleStart = now + cycleOffset;

                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(880, cycleStart);
                    osc1.frequency.exponentialRampToValueAtTime(865, cycleStart + 0.8);

                    gain1.gain.setValueAtTime(0.0001, cycleStart);
                    gain1.gain.linearRampToValueAtTime(volume * 0.75, cycleStart + 0.015);
                    gain1.gain.exponentialRampToValueAtTime(0.0001, cycleStart + 0.8);

                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(700, cycleStart + 0.32);
                    osc2.frequency.exponentialRampToValueAtTime(690, cycleStart + 1.05);

                    gain2.gain.setValueAtTime(0.0001, cycleStart + 0.32);
                    gain2.gain.linearRampToValueAtTime(volume * 0.40, cycleStart + 0.34);
                    gain2.gain.exponentialRampToValueAtTime(0.0001, cycleStart + 1.05);

                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);

                    osc1.start(cycleStart);
                    osc1.stop(cycleStart + 0.85);
                    osc2.start(cycleStart + 0.32);
                    osc2.stop(cycleStart + 1.10);
                });
            } else {
                // 1. Derin Deniz Sonarı (Klasik Ping - Varsayılan) - 2 KEZ PEŞ PEŞE ÇALMA
                [0, 1.25].forEach(pingOffset => {
                    const pingTime = now + pingOffset;

                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(1020, pingTime);
                    osc1.frequency.exponentialRampToValueAtTime(1005, pingTime + 1.2);

                    gain1.gain.setValueAtTime(0.0001, pingTime);
                    gain1.gain.linearRampToValueAtTime(volume * 0.8, pingTime + 0.015);
                    gain1.gain.exponentialRampToValueAtTime(volume * 0.25, pingTime + 0.30);
                    gain1.gain.exponentialRampToValueAtTime(0.0001, pingTime + 1.2);

                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(2040, pingTime);
                    osc2.frequency.exponentialRampToValueAtTime(1950, pingTime + 0.08);

                    gain2.gain.setValueAtTime(0.0001, pingTime);
                    gain2.gain.linearRampToValueAtTime(volume * 0.35, pingTime + 0.015);
                    gain2.gain.exponentialRampToValueAtTime(0.0001, pingTime + 0.08);

                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);

                    osc1.start(pingTime);
                    osc1.stop(pingTime + 1.25);
                    osc2.start(pingTime);
                    osc2.stop(pingTime + 0.09);
                });
            }
        } catch (e) {
            console.warn('[LS] Sonar / Harabe alarm sesi çalınamadı:', e.message || e);
            if (typeof LS_LOGGER !== 'undefined') {
                LS_LOGGER.log('WARN', 'AUDIO', 'Sonar sesi çalınamadı: ' + (e.message || e));
            }
        }
    }

    // ============================================================
    // THREAT MONITORING, PERSISTENCE & ALARM DISPATCH
    // ============================================================
    const THREAT_STORAGE_KEY = 'LS_THREAT_STATE';

    function getStoredThreatState() {
        try {
            return JSON.parse(sessionStorage.getItem(THREAT_STORAGE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function setStoredThreatState(state) {
        try {
            sessionStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(state));
        } catch (e) {}
    }

    function clearStoredThreatState() {
        try {
            sessionStorage.removeItem(THREAT_STORAGE_KEY);
        } catch (e) {}
    }

    let origDocTitle = document.title || 'OGame';
    let titleFlashTimer = null;

    function startTitleFlash(text) {
        if (titleFlashTimer) return;
        if (!origDocTitle || origDocTitle.includes('SALDIRI')) origDocTitle = 'OGame';
        let flip = false;
        titleFlashTimer = setInterval(() => {
            document.title = flip ? ('🚨 ' + text) : ('⚔️ ' + text);
            flip = !flip;
        }, 900);
    }

    function stopTitleFlash() {
        if (titleFlashTimer) {
            clearInterval(titleFlashTimer);
            titleFlashTimer = null;
            if (origDocTitle) document.title = origDocTitle;
        }
    }

    function muteCurrentThreat() {
        const stored = getStoredThreatState();
        stored.muted = true;
        setStoredThreatState(stored);
        stopTitleFlash();

        const stopBtn = document.getElementById('ls-alarm-stop-btn');
        const headerStopBtn = document.getElementById('ls-header-stop-btn');
        if (stopBtn) stopBtn.style.display = 'none';
        if (headerStopBtn) headerStopBtn.style.display = 'none';

        const text = document.getElementById('ls-alarm-status-text');
        if (text) {
            if (stored.type === 'attack') text.textContent = '🚨 Saldırı Var (Alarm Susturuldu)';
            else if (stored.type === 'espionage') text.textContent = '📡 Sonda Geliyor (Alarm Susturuldu)';
        }
    }

    let lastKnownEspionage = false;
    let lastKnownEspionageSig = '';
    let lastKnownEspionageTime = 0;

    function handleThreatState(hasAttack, hasEspionage, threatSignature) {
        const now = Date.now();
        const repeatSec = parseInt(alarmSettings.repeatInterval, 10);
        const repeatMs = (isNaN(repeatSec) ? 30 : repeatSec) * 1000;

        const banner = document.getElementById('ls-alarm-status-banner');
        const dot = document.getElementById('ls-alarm-dot');
        const text = document.getElementById('ls-alarm-status-text');
        const stopBtn = document.getElementById('ls-alarm-stop-btn');
        const headerStopBtn = document.getElementById('ls-header-stop-btn');

        // 1. İkisi de ayarlardan kapalıysa gözcüyü pasife al
        if (!alarmSettings.attackEnabled && !alarmSettings.espionageEnabled) {
            stopTitleFlash();
            if (banner) { banner.style.background = '#121820'; banner.style.borderColor = '#233446'; }
            if (dot) { dot.style.background = '#7f8c8d'; dot.style.boxShadow = 'none'; }
            if (text) { text.style.color = '#7f8c8d'; text.textContent = currentLang === 'tr' ? 'Gözcü Pasif (Alarmlar Kapalı)' : 'Watcher Inactive (Alarms Disabled)'; }
            if (stopBtn) stopBtn.style.display = 'none';
            if (headerStopBtn) headerStopBtn.style.display = 'none';
            clearStoredThreatState();
            return;
        }

        const isAttackThreat = hasAttack && alarmSettings.attackEnabled;
        const isEspionageThreat = hasEspionage && alarmSettings.espionageEnabled;
        const isThreat = isAttackThreat || isEspionageThreat;

        // 2. Tehdit bittiğinde susturma ve kayıt durumunu sıfırla
        if (!isThreat) {
            clearStoredThreatState();
            stopTitleFlash();
            if (stopBtn) stopBtn.style.display = 'none';
            if (headerStopBtn) headerStopBtn.style.display = 'none';
            if (banner) { banner.style.background = '#162436'; banner.style.borderColor = '#1a3a5c'; }
            if (dot) { dot.style.background = '#2ecc71'; dot.style.boxShadow = '0 0 6px #2ecc71'; }
            if (text) { text.style.color = '#2ecc71'; text.textContent = 'Gözcü Aktif · Tehdit Yok'; }
            return;
        }

        // 3. Aktif tehdit var: sessionStorage'daki durumu oku
        const currentType = isAttackThreat ? 'attack' : 'espionage';
        const currentSig = threatSignature || currentType;
        const stored = getStoredThreatState();

        const isSameThreat = (stored.signature && stored.signature === currentSig) ||
                             (stored.type === currentType && stored.lastPlayTime && (now - stored.lastPlayTime) < 45000);

        const isMuted = isSameThreat && !!stored.muted;
        const playedOnce = isSameThreat && !!stored.playedOnce;
        const lastPlayTime = (isSameThreat && stored.lastPlayTime) ? stored.lastPlayTime : 0;

        // Tekrar sıklığı 1'den farklıysa (repeatMs > 0) ve susturulmadıysa Stop butonu göster
        const canShowStop = repeatMs > 0 && !isMuted;
        if (stopBtn) stopBtn.style.display = canShowStop ? 'inline-flex' : 'none';
        if (headerStopBtn) headerStopBtn.style.display = canShowStop ? 'inline-flex' : 'none';

        // Banner güncelle & Sekme Başlığı Yanıp Sönmesi
        if (isAttackThreat) {
            startTitleFlash(isMuted ? 'SALDIRI VAR (SUSTURULDU)' : 'GELEN DÜŞMAN SALDIRISI VAR!');
            if (banner) { banner.style.background = '#301416'; banner.style.borderColor = '#e74c3c'; }
            if (dot) { dot.style.background = '#e74c3c'; dot.style.boxShadow = '0 0 8px #e74c3c'; }
            if (text) {
                text.style.color = '#e74c3c';
                text.textContent = isMuted ? '🚨 Saldırı Var (Alarm Susturuldu)' : '🚨 DİKKAT: GELEN SALDIRI VAR!';
            }
        } else if (isEspionageThreat) {
            stopTitleFlash();
            if (banner) { banner.style.background = '#0e2338'; banner.style.borderColor = '#3498db'; }
            if (dot) { dot.style.background = '#3498db'; dot.style.boxShadow = '0 0 8px #3498db'; }
            if (text) {
                text.style.color = '#3498db';
                text.textContent = isMuted ? '📡 Sonda Geliyor (Alarm Susturuldu)' : '📡 BİLGİ: Casus Sondası Geliyor';
            }
        }

        // 4. Ses çalma kararı (Tek seferlik ve tekrarlı kontroller)
        if (!isMuted) {
            let shouldPlay = false;

            if (repeatMs === 0) {
                // Sadece 1 kez çal seçiliyse: BU TEHDİT İÇİN DAHA ÖNCE HİÇ ÇALINMADIYSA ÇAL
                if (!playedOnce) {
                    shouldPlay = true;
                }
            } else {
                // Tekrarlama seçiliyse: İlk kez ise veya aralık süresi dolduysa çal
                if (!playedOnce || (now - lastPlayTime) >= repeatMs) {
                    shouldPlay = true;
                }
            }

            if (shouldPlay) {
                if (isAttackThreat) {
                    LS_LOGGER.warn('ALARM', 'Saldırı alarmı çalındı: ' + alarmSettings.attackSound, currentSig);
                    playAttackAlertSound(alarmSettings.attackSound);
                } else if (isEspionageThreat) {
                    LS_LOGGER.warn('ALARM', 'Casusluk uyarısı çalındı: ' + alarmSettings.espionageSound, currentSig);
                    playEspionageAlertSound(alarmSettings.espionageSound);
                }

                setStoredThreatState({
                    signature: currentSig,
                    type: currentType,
                    muted: false,
                    playedOnce: true,
                    lastPlayTime: now
                });
            }
        }
    }

    function isDOMAttackAlert() {
        const attAlert = document.getElementById('attack_alert');
        if (attAlert) {
            const isAlert = attAlert.classList.contains('soon') ||
                            attAlert.classList.contains('attack') ||
                            attAlert.classList.contains('alert');
            const isNoAttack = attAlert.classList.contains('noAttack') || attAlert.classList.contains('hide');
            if (isAlert && !isNoAttack) {
                return true;
            }
        }
        const hostileHdr = document.querySelector('#eventHeader.hostile, #js_eventHeaderBox.hostile, .event_cdr.hostile');
        if (hostileHdr) return true;
        return false;
    }

    function parseHostileFleets(doc) {
        let hasAttack = false;
        let hasEspionage = false;
        const hostileIds = [];

        // Hem .eventFleet hem de alternatif tablo satırlarını kapsa
        let fleets = doc.querySelectorAll('.eventFleet');
        if (fleets.length === 0) {
            fleets = doc.querySelectorAll('tr[id^="eventRow-"], [data-mission-type]');
        }

        fleets.forEach(fl => {
            // SADECE düşman filoları tehdittir! Oyuncunun kendi filoları 'friendly' class'ına sahiptir
            const isHostile = (fl.classList.contains('hostile') || !!fl.querySelector('.hostile, .icon_attack, .icon_espionage')) &&
                              !fl.classList.contains('friendly') && !fl.querySelector('.friendly');
            const isReturn = fl.getAttribute('data-return-flight') === 'true';

            if (isHostile && !isReturn) {
                const mission = fl.getAttribute('data-mission-type');
                const arrival = fl.getAttribute('data-arrival-time') || '';
                const id = fl.id || (mission + '_' + arrival);
                hostileIds.push(id);

                if (mission === '6' || fl.classList.contains('espionage') || !!fl.querySelector('.espionage, .icon_espionage')) {
                    hasEspionage = true;
                } else {
                    hasAttack = true;
                }
            }
        });

        return { hasAttack, hasEspionage, hostileIds, count: fleets.length };
    }

    function checkThreatsInDOM() {
        if (!alarmSettings.attackEnabled && !alarmSettings.espionageEnabled) {
            handleThreatState(false, false, '');
            return;
        }

        const domFleets = document.querySelectorAll('.eventFleet');
        if (domFleets.length > 0) {
            const parsed = parseHostileFleets(document);
            let hasAttack = parsed.hasAttack || isDOMAttackAlert();
            let hasEspionage = parsed.hasEspionage;
            let sig = '';
            if (hasAttack) sig = 'ATT:' + parsed.hostileIds.join(',');
            else if (hasEspionage) sig = 'ESP:' + parsed.hostileIds.join(',');

            lastKnownEspionage = hasEspionage;
            lastKnownEspionageSig = sig;
            if (hasEspionage) lastKnownEspionageTime = Date.now();
            handleThreatState(hasAttack, hasEspionage, sig);
        } else {
            const hasAttack = isDOMAttackAlert();
            if (hasAttack) {
                handleThreatState(true, false, 'DOM_ATTACK');
            } else if (lastKnownEspionage && (Date.now() - lastKnownEspionageTime) < 15000) {
                handleThreatState(false, true, lastKnownEspionageSig);
            } else {
                lastKnownEspionage = false;
                handleThreatState(false, false, '');
            }
        }
    }

    // Pasif Etkinlik Dinleyicisi (Sıfır Sunucu İsteği, Sıfır Ban Riski):
    // OGame'in kendi yaptığı eventList veya mini-etkinlik çağrılarının yanıtlarını havada yakalar
    function parseThreatsFromHTML(html) {
        if (!alarmSettings.attackEnabled && !alarmSettings.espionageEnabled) return;
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const parsed = parseHostileFleets(doc);
            let hasAttack = parsed.hasAttack;
            let hasEspionage = parsed.hasEspionage;

            // Yanıt HTML içinde attack_alert veya hostile başlık var mı denetle
            const attackAlert = doc.querySelector('#attack_alert, .attack_alert');
            if (attackAlert) {
                const isSoon = attackAlert.classList.contains('soon') || attackAlert.classList.contains('attack') || attackAlert.classList.contains('alert');
                const isNoAttack = attackAlert.classList.contains('noAttack') || attackAlert.classList.contains('hide');
                if (isSoon && !isNoAttack) hasAttack = true;
            }
            if (doc.querySelector('#eventHeader.hostile, #js_eventHeaderBox.hostile, .event_cdr.hostile')) {
                hasAttack = true;
            }

            // Ham metin yedek taraması (DOMParser'ın izole tr öğelerini düşürmesi ihtimaline karşı)
            if (!hasAttack && !hasEspionage && typeof html === 'string') {
                if (/id=["']attack_alert["'][^>]*class=["'][^"']*(soon|attack|alert)/i.test(html) && !/noAttack/i.test(html)) {
                    hasAttack = true;
                } else if (/class=["'][^"']*hostile[^"']*["']/i.test(html) && !/class=["'][^"']*friendly[^"']*["']/i.test(html)) {
                    if (/data-mission-type=["']6["']/i.test(html) || /class=["'][^"']*espionage[^"']*["']/i.test(html)) {
                        hasEspionage = true;
                    } else {
                        hasAttack = true;
                    }
                }
            }

            let sig = '';
            if (hasAttack) sig = 'ATT:' + (parsed.hostileIds.length > 0 ? parsed.hostileIds.join(',') : 'BG_ATTACK');
            else if (hasEspionage) sig = 'ESP:' + (parsed.hostileIds.length > 0 ? parsed.hostileIds.join(',') : 'BG_ESP');

            lastKnownEspionage = hasEspionage;
            lastKnownEspionageSig = sig;
            if (hasEspionage) lastKnownEspionageTime = Date.now();

            handleThreatState(hasAttack, hasEspionage, sig);
        } catch (e) {}
    }

    // MAIN world'deki bridge.js üzerinden yakalanan doğal OGame etkinliklerini dinle
    window.addEventListener('LS_EVENT_LIST_RECEIVED', (e) => {
        if (e.detail && e.detail.html) {
            parseThreatsFromHTML(e.detail.html);
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            stopTitleFlash();
            checkThreatsInDOM();
        }
    });

    // ============================================================
    // DEBRIS HUNTER (HARABE AVCISI)
    // ============================================================
    let debrisScanTimers = [];

    function scheduleDebrisScan(delay) {
        if (!debrisSettings.enabled) return;
        const timer = setTimeout(() => {
            debrisScanTimers = debrisScanTimers.filter(t => t !== timer);
            scanCurrentGalaxyPageForDebris();
        }, delay);
        debrisScanTimers.push(timer);
        if (debrisScanTimers.length > 30) {
            const old = debrisScanTimers.shift();
            clearTimeout(old);
        }
    }

    function clearDebrisScanTimers() {
        debrisScanTimers.forEach(t => clearTimeout(t));
        debrisScanTimers = [];
    }

    function triggerGalaxyScanSequence() {
        if (!debrisSettings.enabled) return;
        // Kademeli tarama: hızlı geçişlerde hiçbir anı kaçırmamak için
        [20, 80, 180, 350, 600, 1000].forEach(d => {
            scheduleDebrisScan(d);
        });
    }

    function saveDebrisSettings() {
        localStorage.setItem(KEYS.DEBRIS_SETTINGS, JSON.stringify(debrisSettings));
    }

    function saveDebrisList() {
        localStorage.setItem(KEYS.DEBRIS_LIST, JSON.stringify(debrisList));
    }

    function extractCleanText(raw) {
        if (!raw || typeof raw !== 'string') return '';
        if (raw.indexOf('<') !== -1 && raw.indexOf('>') !== -1) {
            try {
                const doc = new DOMParser().parseFromString(raw, 'text/html');
                return doc.body.textContent || raw;
            } catch (e) {
                return raw.replace(/<[^>]+>/g, ' ');
            }
        }
        return raw;
    }

    function getRenderedGalaxyCoords() {
        const content = document.getElementById('galaxyContent');
        if (!content) return null;

        // 1. Tooltips inside page (debris or planet tooltips containing [G:S:P])
        const allDebTips = document.querySelectorAll('[id^="debris"], [id*="expeditionDebris"], [id*="debrisExpedition"]');
        for (let i = 0; i < allDebTips.length; i++) {
            const tm = allDebTips[i].textContent.match(/\[(\d+)\s*[:/]\s*(\d+)\s*[:/]\s*(\d+)\]/);
            if (tm) {
                const g = parseInt(tm[1], 10);
                const s = parseInt(tm[2], 10);
                if (g && s) return { g, s };
            }
        }

        // 2. Links inside table (espionage, fleetdispatch, galaxy links)
        const link = content.querySelector('a[href*="galaxy="][href*="system="], a[href*="galaxy%3D"][href*="system%3D"], [data-galaxy][data-system]');
        if (link) {
            if (link.hasAttribute('data-galaxy') && link.hasAttribute('data-system')) {
                const g = parseInt(link.getAttribute('data-galaxy'), 10);
                const s = parseInt(link.getAttribute('data-system'), 10);
                if (g && s) return { g, s };
            }
            const href = link.getAttribute('href') || '';
            const mG = href.match(/[?&]galaxy=(\d+)/i) || href.match(/galaxy%3D(\d+)/i);
            const mS = href.match(/[?&]system=(\d+)/i) || href.match(/system%3D(\d+)/i);
            if (mG && mS) {
                const g = parseInt(mG[1], 10);
                const s = parseInt(mS[1], 10);
                if (g && s) return { g, s };
            }
        }

        // 3. Document-wide galaxy head / header
        const headEl = document.querySelector('#galaxyhead, .galaxy_head, #galaxyHeader h1, #galaxyHeader');
        if (headEl) {
            const m = headEl.textContent.match(/(\d+)\s*[:/]\s*(\d+)/);
            if (m) {
                const g = parseInt(m[1], 10);
                const s = parseInt(m[2], 10);
                if (g && s) return { g, s };
            }
        }

        return null;
    }

    function getCurrentGalaxyCoords() {
        let g = 0, s = 0;
        const gInput = document.getElementById('galaxy_input') || document.querySelector('input[name="galaxy"]');
        const sInput = document.getElementById('system_input') || document.querySelector('input[name="system"]');
        if (gInput && gInput.value) g = parseInt(gInput.value, 10);
        if (sInput && sInput.value) s = parseInt(sInput.value, 10);

        if (!g || !s) {
            const galaxyHead = document.getElementById('galaxyhead') || document.querySelector('.galaxy_head');
            if (galaxyHead) {
                const m = galaxyHead.textContent.match(/(\d+)\s*[:/]\s*(\d+)/);
                if (m) {
                    if (!g) g = parseInt(m[1], 10);
                    if (!s) s = parseInt(m[2], 10);
                }
            }
        }

        if (!g || !s) {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('galaxy')) g = parseInt(urlParams.get('galaxy'), 10);
                if (urlParams.has('system')) s = parseInt(urlParams.get('system'), 10);
            } catch (e) {}
        }

        return { g: g || 0, s: s || 0 };
    }

    function parseDebrisText(text) {
        if (!text) return null;
        const clean = extractCleanText(text);
        let m = 0, c = 0, d = 0, rec = 0;

        // Metal (Standart: "Metal: 16.200", "Metall: 16,2K", alternatif: "16,2K Metal")
        let mMatch = clean.match(/(?:Metal|Metall)\s*:\s*([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)/i);
        if (!mMatch) mMatch = clean.match(/([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)\s*(?:Metal|Metall)/i);
        if (mMatch) m = parseOgNum(mMatch[1]);

        // Kristal (Standart: "Kristal: 21.600", "Kristall: ...", "Crystal: 21,6K", alternatif: "21,6K Kristal")
        let cMatch = clean.match(/(?:Kristal|Kristall|Crystal)\s*:\s*([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)/i);
        if (!cMatch) cMatch = clean.match(/([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)\s*(?:Kristal|Kristall|Crystal)/i);
        if (cMatch) c = parseOgNum(cMatch[1]);

        // Deuterium
        let dMatch = clean.match(/(?:Deuterium|Deut)\s*:\s*([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)/i);
        if (!dMatch) dMatch = clean.match(/([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)\s*(?:Deuterium|Deut)/i);
        if (dMatch) d = parseOgNum(dMatch[1]);

        // Geri Dönüşümcüler
        const rMatch = clean.match(/(?:Gereken geri d[öo]n[üu][şs][üu]mc[üu]ler|Recyclers needed|Recycler[s]?|Benötigte Recycler|Gerekli [Rr]ehberler)\s*:\s*([0-9.,kKmMbBrd]+)/i);
        if (rMatch) rec = parseOgNum(rMatch[1]);

        const total = m + c + d;
        if (total <= 0) return null;
        if (rec <= 0) rec = Math.ceil(total / 20000);

        return { metal: m, crystal: c, deut: d, total: total, recyclers: rec };
    }

    function parseDebrisFromCell(cell) {
        if (!cell) return null;

        // 1. Tooltip hedefi kontrolü (data-tooltip-content="#id")
        const contentTargets = cell.querySelectorAll('[data-tooltip-content]');
        for (let i = 0; i < contentTargets.length; i++) {
            const tipVal = contentTargets[i].getAttribute('data-tooltip-content') || '';
            if (tipVal.startsWith('#')) {
                const target = document.querySelector(tipVal);
                if (target) {
                    const parsed = parseDebrisText(target.textContent);
                    if (parsed && parsed.total > 0) return parsed;
                }
            } else if (tipVal) {
                const parsed = parseDebrisText(tipVal);
                if (parsed && parsed.total > 0) return parsed;
            }
        }

        // 2. data-tooltip-title veya title niteliğinde enkaz metni kontrolü
        const titleTargets = cell.querySelectorAll('[data-tooltip-title], [title]');
        for (let i = 0; i < titleTargets.length; i++) {
            const val = titleTargets[i].getAttribute('data-tooltip-title') || titleTargets[i].getAttribute('title') || '';
            if (val && /metal|kristal|crystal/i.test(val)) {
                const parsed = parseDebrisText(val);
                if (parsed && parsed.total > 0) return parsed;
            }
        }

        // 3. Hücre içi doğrudan metin kontrolü (eklenti veya doğrudan render)
        const cellText = cell.textContent || '';
        if (/metal|kristal|crystal/i.test(cellText)) {
            const parsedText = parseDebrisText(cellText);
            if (parsedText && parsedText.total > 0) return parsedText;
        }

        return null;
    }

    function processFoundDebris(g, s, p, data) {
        const id = `${g}:${s}:${p}`;
        const existingIndex = debrisList.findIndex(item => item.id === id);

        if (existingIndex >= 0) {
            const item = debrisList[existingIndex];
            const changed = item.metal !== data.metal || item.crystal !== data.crystal || item.total !== data.total;
            if (changed) {
                item.metal = data.metal;
                item.crystal = data.crystal;
                item.deut = data.deut;
                item.total = data.total;
                item.recyclers = data.recyclers;
                item.timestamp = Date.now();
                return { isNew: false, changed: true };
            }
            return { isNew: false, changed: false };
        } else {
            debrisList.unshift({
                id: id,
                g: g,
                s: s,
                p: p,
                metal: data.metal,
                crystal: data.crystal,
                deut: data.deut,
                total: data.total,
                recyclers: data.recyclers,
                timestamp: Date.now()
            });
            return { isNew: true, changed: true };
        }
    }

    function updateDebrisStatusBanner() {
        const banner = document.getElementById('ls-debris-status-banner');
        const dot = document.getElementById('ls-debris-dot');
        const text = document.getElementById('ls-debris-status-text');
        if (!banner || !dot || !text) return;

        if (debrisSettings.enabled) {
            banner.style.background = '#162436';
            banner.style.borderColor = '#1a3a5c';
            dot.style.background = '#2ecc71';
            dot.style.boxShadow = '0 0 6px #2ecc71';
            text.style.color = '#2ecc71';
            text.textContent = t('deb_status_active');
        } else {
            banner.style.background = '#121820';
            banner.style.borderColor = '#233446';
            dot.style.background = '#7f8c8d';
            dot.style.boxShadow = 'none';
            text.style.color = '#7f8c8d';
            text.textContent = t('deb_status_inactive');
        }
    }

    function renderDebrisList() {
        const listEl = document.getElementById('ls-debris-list');
        const countTitle = document.getElementById('ls-debris-count-title');
        if (countTitle) countTitle.textContent = `${t('deb_found_title')} (${debrisList.length})`;
        if (!listEl) return;

        listEl.innerHTML = '';
        if (debrisList.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;color:#8899aa;font-size:11px;padding:16px 8px;background:rgba(255,255,255,0.02);border-radius:4px">' +
                t('deb_no_debris') +
            '</div>';
            return;
        }

        debrisList.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'ls-item';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'stretch';
            card.style.gap = '4px';
            card.style.padding = '7px 8px';
            card.style.borderLeft = '3px solid #00bcff';

            const coordStr = `[${item.g}:${item.s}:${item.p}]`;

            card.innerHTML =
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<div style="display:flex;align-items:center;gap:6px">' +
                        '<b style="color:#00bcff;font-family:monospace;font-size:12px;cursor:pointer" class="ls-debris-coord" data-g="' + item.g + '" data-s="' + item.s + '" title="Galakside bu sisteme git">' + coordStr + '</b>' +
                        '<span style="color:#2ecc71;font-size:10px;background:rgba(46,204,113,0.12);padding:1px 5px;border-radius:3px;border:1px solid rgba(46,204,113,0.25)">' +
                            '🚛 ' + fmt(item.recyclers) + ' GD' +
                        '</span>' +
                    '</div>' +
                    '<div style="display:flex;align-items:center;gap:4px">' +
                        '<button class="ls-btn-sm ls-debris-nav-btn" data-g="' + item.g + '" data-s="' + item.s + '" style="padding:2px 6px;cursor:pointer;display:inline-flex;align-items:center;gap:2px" title="Galakside [' + item.g + ':' + item.s + '] sistemine git">' +
                            t('deb_jump', '🚀 Git') +
                        '</button>' +
                        '<button class="ls-x ls-debris-del" data-idx="' + index + '" title="Bu harabeyi listeden kaldır">✖</button>' +
                    '</div>' +
                '</div>' +
                '<div style="font-size:10.5px;font-family:monospace;display:flex;gap:6px;align-items:center;margin-top:2px">' +
                    '<span style="color:#ffbe3b">M: ' + fmt(item.metal) + '</span> · ' +
                    '<span style="color:#5dade2">K: ' + fmt(item.crystal) + '</span>' +
                    (item.deut > 0 ? (' · <span style="color:#2ecc71">D: ' + fmt(item.deut) + '</span>') : '') +
                    ' · <span style="color:#ffffff;font-weight:bold">T: ' + fmt(item.total) + '</span>' +
                '</div>';

            listEl.appendChild(card);
        });

        listEl.querySelectorAll('.ls-debris-nav-btn, .ls-debris-coord').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const g = parseInt(el.getAttribute('data-g'), 10);
                const s = parseInt(el.getAttribute('data-s'), 10);
                if (g && s) navigateToGalaxy(g, s);
            });
        });

        listEl.querySelectorAll('.ls-debris-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                if (!isNaN(idx)) {
                    debrisList.splice(idx, 1);
                    saveDebrisList();
                    renderDebrisList();
                }
            });
        });
    }

    function scanCurrentGalaxyPageForDebris() {
        if (!debrisSettings.enabled) return;

        const content = document.getElementById('galaxyContent');
        if (!content) return;

        // 1. AJAX yüklenme anında tam opaktaysa bekle
        const loader = document.getElementById('galaxyLoading') || content.querySelector('.galaxyLoading, .loading');
        if (loader) {
            const lStyle = window.getComputedStyle(loader);
            if (lStyle.display !== 'none' && lStyle.visibility !== 'hidden' && parseFloat(lStyle.opacity || '1') > 0.6) {
                return;
            }
        }

        // 2. Tablonun ekrandaki gerçek koordinatlarını belirle
        const rendered = getRenderedGalaxyCoords();
        const inputCoords = getCurrentGalaxyCoords();

        const actualG = (rendered && rendered.g) ? rendered.g : inputCoords.g;
        const actualS = (rendered && rendered.s) ? rendered.s : inputCoords.s;
        if (!actualG || !actualS) return;

        let hasBrandNewDebris = false;
        let listChanged = false;
        const scannedPositions = new Map(); // pos (1..16) -> data

        // 3. DOM'daki tüm enkaz ipucu elementlerini tara
        const candidateIds = [];
        for (let p = 1; p <= 15; p++) {
            candidateIds.push(`debris${p}`, `debris_${p}`);
        }
        candidateIds.push(
            'debrisExpedition', 'debris_expedition', 'expeditionDebris', 'expedition_debris',
            'debris-expedition', 'expedition-debris', 'debris16', 'debris_16'
        );

        candidateIds.forEach(id => {
            const debEl = document.getElementById(id) || content.querySelector(`#${id}`);
            if (debEl) {
                let itemP = 0;
                if (/expedition|16/i.test(id)) itemP = 16;
                else {
                    const numM = id.match(/\d+/);
                    if (numM) itemP = parseInt(numM[0], 10);
                }

                const tipCoord = debEl.textContent.match(/\[(\d+)\s*[:/]\s*(\d+)\s*[:/]\s*(\d+)\]/);
                if (tipCoord) {
                    const tipG = parseInt(tipCoord[1], 10);
                    const tipS = parseInt(tipCoord[2], 10);
                    const tipP = parseInt(tipCoord[3], 10);
                    if (tipG !== actualG || tipS !== actualS) return;
                    itemP = tipP;
                }

                const data = parseDebrisText(debEl.textContent);
                if (data && data.total > 0 && itemP >= 1 && itemP <= 16) {
                    scannedPositions.set(itemP, data);
                }
            }
        });

        // Belgedeki koordinat eşleşen veya expedition içeren tüm debris tooltip'lerini tara
        document.querySelectorAll('[id^="debris"], [id*="expeditionDebris"], [id*="debrisExpedition"]').forEach(debEl => {
            const rawText = debEl.textContent || '';
            if (!/metal|kristal|crystal/i.test(rawText)) return;

            const tipCoord = rawText.match(/\[(\d+)\s*[:/]\s*(\d+)\s*[:/]\s*(\d+)\]/);
            if (tipCoord) {
                const tipG = parseInt(tipCoord[1], 10);
                const tipS = parseInt(tipCoord[2], 10);
                const tipP = parseInt(tipCoord[3], 10);
                if (tipG === actualG && tipS === actualS && tipP >= 1 && tipP <= 16) {
                    const data = parseDebrisText(rawText);
                    if (data && data.total > 0) scannedPositions.set(tipP, data);
                }
            } else if (/expedition/i.test(debEl.id) && !scannedPositions.has(16)) {
                const data = parseDebrisText(rawText);
                if (data && data.total > 0) scannedPositions.set(16, data);
            }
        });

        // 4. Galaksi tablosundaki normal satırları tara (1..15)
        const galaxyRows = content.querySelectorAll('#galaxytable tr, .ct_row, .galaxyRow, tr[data-position]');
        galaxyRows.forEach(row => {
            let pos = parseInt(row.getAttribute('data-position'), 10);
            if (isNaN(pos) || pos < 1 || pos > 15) {
                const firstCell = row.querySelector('td:first-child, .cellPosition, .position');
                if (firstCell) {
                    const pNum = parseInt(firstCell.textContent.trim(), 10);
                    if (!isNaN(pNum) && pNum >= 1 && pNum <= 15) pos = pNum;
                }
            }
            if (!pos || pos === 16) return;

            const debCell = row.querySelector('.cellDebris, .debris, .ha') || row.querySelectorAll('td')[4];
            if (debCell) {
                const data = parseDebrisFromCell(debCell);
                if (data && data.total > 0) {
                    scannedPositions.set(pos, data);
                }
            }
        });

        // 5. 16. Slot (Sonsuz Uzaklar / Expedition) için çok katmanlı ve garantili yakalama
        if (!scannedPositions.has(16)) {
            const expRow = content.querySelector('tr[data-position="16"], #expedition, tr.expedition, .expedition, #galaxytable tr.row:last-child');
            if (expRow) {
                // A. Expedition tooltip elementlerini doğrudan kontrol et
                const expTooltipSelectors = [
                    '#debrisExpedition', '#debris_expedition', '#expeditionDebris', '#expedition_debris',
                    '#debris-expedition', '#expedition-debris', '#debris16', '#debris_16'
                ];
                for (const sel of expTooltipSelectors) {
                    const tipElem = document.querySelector(sel);
                    if (tipElem) {
                        const parsed = parseDebrisText(tipElem.textContent);
                        if (parsed && parsed.total > 0) {
                            scannedPositions.set(16, parsed);
                            break;
                        }
                    }
                }

                // B. Satır içindeki DEBRIS hücresini izole ederek tara (Gezegen adı veya sıra numarası hücrelerini atla!)
                let debCell = expRow.querySelector('.cellDebris, .debris, .ha');
                if (!debCell) {
                    const cells = expRow.querySelectorAll('td');
                    if (cells.length >= 5) debCell = cells[4];
                    else if (cells.length >= 4) debCell = cells[3];
                }

                if (!scannedPositions.has(16) && debCell) {
                    const parsed = parseDebrisFromCell(debCell);
                    if (parsed && parsed.total > 0) {
                        scannedPositions.set(16, parsed);
                    }
                }

                // C. Katman 3: Eğer satırda enkaz ikonu varsa ve harici eklentiler (OGLight/Infinity) sayıları span içinde göstermişse
                if (!scannedPositions.has(16) && debCell) {
                    const hasIcon = debCell.querySelector('.icon_debris, .debris, [class*="debris_icon"], [data-tooltip-content*="debris"], img[src*="debris"], svg');
                    if (hasIcon) {
                        const numSpans = Array.from(debCell.querySelectorAll('span, div')).filter(el => {
                            const t = el.textContent.trim();
                            return /^[0-9.,]+[kKmMbBrd]?$/i.test(t);
                        });
                        if (numSpans.length >= 2) {
                            const mVal = parseOgNum(numSpans[0].textContent);
                            const cVal = parseOgNum(numSpans[1].textContent);
                            const dVal = numSpans.length >= 3 ? parseOgNum(numSpans[2].textContent) : 0;
                            const tot = mVal + cVal + dVal;
                            if (tot > 0) {
                                scannedPositions.set(16, {
                                    metal: mVal,
                                    crystal: cVal,
                                    deut: dVal,
                                    total: tot,
                                    recyclers: Math.ceil(tot / 20000)
                                });
                            }
                        }
                    }
                }
            }
        }

        // 6. Mevcut sistemdeki kayıtları güncelle
        const minThresh = debrisSettings.minThreshold || 100000;

        scannedPositions.forEach((data, pos) => {
            if (data && data.total >= minThresh) {
                const res = processFoundDebris(actualG, actualS, pos, data);
                if (res.isNew) hasBrandNewDebris = true;
                if (res.changed) listChanged = true;
            } else {
                const existingIdx = debrisList.findIndex(item => item.g === actualG && item.s === actualS && item.p === pos);
                if (existingIdx >= 0) {
                    debrisList.splice(existingIdx, 1);
                    listChanged = true;
                }
            }
        });

        // 7. GÜVENLİ VE KESİN TEMİZLİK:
        // Sadece ve sadece:
        // 1) Tablonun ekrandaki koordinatları taranan sistemle (actualG:actualS) %100 uyuşuyorsa,
        // 2) Tablo tam olarak render edilmişse (en az 15 satır),
        // 3) İlgili satır DOM'da mevcut ve enkaz hücresinde KESİNLİKLE hiçbir enkaz ikonu/linki kalmamışsa sil!
        const totalRenderedRows = content.querySelectorAll('#galaxytable tr, .ct_row, .galaxyRow').length;
        const renderedCoords = getRenderedGalaxyCoords();
        const coordsMatch = renderedCoords && (renderedCoords.g === actualG && renderedCoords.s === actualS);

        if (totalRenderedRows >= 15 && coordsMatch) {
            const currentSystemItems = debrisList.filter(item => item.g === actualG && item.s === actualS);
            currentSystemItems.forEach(item => {
                if (!scannedPositions.has(item.p)) {
                    // Pozisyon 16 için doğrulama:
                    if (item.p === 16) {
                        const expRow = content.querySelector('tr[data-position="16"], #expedition, tr.expedition, .expedition, #galaxytable tr.row:last-child');
                        if (!expRow) return;

                        const debCell = expRow.querySelector('.cellDebris, .debris, .ha') || expRow.querySelectorAll('td')[4];
                        if (debCell) {
                            const hasDebrisElement = debCell.querySelector('.icon_debris, .icon, img[src*="debris"], svg, [data-tooltip-content], a.tooltipHTML');
                            if (hasDebrisElement) {
                                return; // Enkaz ikonu veya tooltip bağlantısı halen mevcut, ASLA silme!
                            }
                        }
                    } else if (item.p >= 1 && item.p <= 15) {
                        // Pozisyon 1..15 için doğrulama:
                        const pRow = content.querySelector(`tr[data-position="${item.p}"], #galaxytable tr:nth-child(${item.p})`);
                        if (!pRow) return;

                        const debCell = pRow.querySelector('.cellDebris, .debris, .ha') || pRow.querySelectorAll('td')[4];
                        if (debCell) {
                            const hasDebrisElement = debCell.querySelector('.icon_debris, .icon, img[src*="debris"], svg, [data-tooltip-content], a.tooltipHTML');
                            if (hasDebrisElement) {
                                return; // Enkaz ikonu halen mevcut, silme!
                            }
                        }
                    }

                    // Hücre tamamen boşsa ve enkaz gerçekten yoksa listeden kaldır
                    const idx = debrisList.findIndex(x => x.id === item.id);
                    if (idx >= 0) {
                        debrisList.splice(idx, 1);
                        listChanged = true;
                    }
                }
            });
        }

        if (listChanged) {
            saveDebrisList();
            renderDebrisList();
        }

        // SADECE ve SADECE daha önce listede olmayan YENİ bir harabe keşfedildiğinde ses çal!
        if (hasBrandNewDebris) {
            unlockAudio();
            playEspionageAlertSound(debrisSettings.sound || 'sonar_deep');
        }
    }
    window.lsDebris = {
        scan: scanCurrentGalaxyPageForDebris,
        getList: () => debrisList
    };

    function setupDebrisObserver() {
        // 1. MutationObserver: Galaksi tablosu ve içerik değişikliklerini izle
        const obs = new MutationObserver((mutations) => {
            if (!debrisSettings.enabled) return;
            let relevant = false;
            for (const m of mutations) {
                if (m.target && (
                    m.target.id === 'galaxyContent' ||
                    m.target.id === 'galaxytable' ||
                    m.target.id === 'galaxyLoading' ||
                    (m.target.classList && (m.target.classList.contains('galaxyRow') || m.target.classList.contains('ct_row') || m.target.classList.contains('cellDebris'))) ||
                    m.target.closest?.('#galaxyContent')
                )) {
                    relevant = true;
                    break;
                }
            }
            if (relevant) {
                triggerGalaxyScanSequence();
            }
        });

        obs.observe(document.body, { childList: true, subtree: true });

        // 2. Klavye ile galaksi geçişleri (Sol/Sağ ok tuşları)
        document.addEventListener('keydown', (e) => {
            if (!debrisSettings.enabled) return;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                triggerGalaxyScanSequence();
            }
        });

        // 3. Tıklama ile galaksi geçişleri (Ok butonları, Haydi butonu, sekmeler)
        document.addEventListener('click', (e) => {
            if (!debrisSettings.enabled) return;
            if (e.target.closest('#galaxyContent, .btn_blue, #showGalaxy, .galaxy_navigation, .btn_left, .btn_right, #galaxyHeader, #galaxy_form, [data-dir], .icon_galaxy')) {
                triggerGalaxyScanSequence();
            }
        });

        // 4. Koordinat input değişiklikleri
        ['galaxy_input', 'system_input'].forEach(id => {
            const inp = document.getElementById(id);
            if (inp) {
                inp.addEventListener('input', triggerGalaxyScanSequence);
                inp.addEventListener('change', triggerGalaxyScanSequence);
            }
        });

        // 5. MAIN world bridge.js'den gelen doğal OGame galaksi AJAX tamamlanma olayını yakala
        window.addEventListener('LS_GALAXY_AJAX_COMPLETE', () => {
            if (!debrisSettings.enabled) return;
            triggerGalaxyScanSequence();
        });

        // 6. Sayfa ilk açılışında galaksi sayfasıysa hemen tara
        if (window.location.href.includes('component=galaxy') || document.getElementById('galaxyContent')) {
            triggerGalaxyScanSequence();
        }
    }

    // ============================================================
    // MADEN TOPLAYICI (COLLECTOR)
    // ============================================================
    function getEmpirePlanetsAndMoons() {
        let list = [];
        const planetEls = document.querySelectorAll('#planetList .smallplanet, #myPlanets .smallplanet');

        if (planetEls && planetEls.length > 0) {
            planetEls.forEach((pEl, idx) => {
                const pLink = pEl.querySelector('a.planetlink') || pEl.querySelector('a:not(.moonlink)');
                if (!pLink) return;

                let pId = '';
                const hrefMatch = (pLink.getAttribute('href') || '').match(/cp=(\d+)/);
                if (hrefMatch) pId = hrefMatch[1];
                if (!pId && pEl.id) {
                    const m = pEl.id.match(/\d+/);
                    if (m) pId = m[0];
                }
                if (!pId) pId = 'p-' + idx;

                const nameEl = pLink.querySelector('.planet-name');
                let name = nameEl ? nameEl.textContent.trim() : (pLink.getAttribute('title') || 'Gezegen').split('[')[0].trim();
                if (!name) name = 'Gezegen';

                const coordEl = pLink.querySelector('.planet-koords');
                let coords = '';
                if (coordEl) {
                    coords = coordEl.textContent.replace(/[\[\]]/g, '').trim();
                } else {
                    const m = (pLink.getAttribute('title') || pLink.textContent || '').match(/\[?(\d+:\d+:\d+)\]?/);
                    if (m) coords = m[1];
                }

                const mLink = pEl.querySelector('a.moonlink');
                let moonObj = null;
                if (mLink) {
                    let mId = '';
                    const mHrefMatch = (mLink.getAttribute('href') || '').match(/cp=(\d+)/);
                    if (mHrefMatch) mId = mHrefMatch[1];
                    if (!mId) {
                        const dataId = mLink.getAttribute('data-moon-id') || mLink.getAttribute('data-cp');
                        if (dataId) mId = dataId;
                    }
                    if (!mId) mId = 'm-' + pId;

                    moonObj = {
                        id: mId,
                        name: `${name} ( Ay )`,
                        coords: coords,
                        isMoon: true,
                        type: 3,
                        parentPlanetId: pId
                    };
                }

                list.push({
                    id: pId,
                    name: name,
                    coords: coords,
                    isMoon: false,
                    type: 1,
                    moon: moonObj
                });
            });

            if (list.length > 0) {
                localStorage.setItem('LS_EMPIRE_PLANETS', JSON.stringify(list));
            }
        } else {
            const cached = localStorage.getItem('LS_EMPIRE_PLANETS');
            if (cached) {
                try {
                    list = JSON.parse(cached);
                    list.forEach(p => {
                        if (p.moon && (!p.moon.name || p.moon.name === 'Ay')) {
                            p.moon.name = `${p.name} ( Ay )`;
                        }
                    });
                } catch (e) {}
            }
        }

        return list;
    }

    function updateActivePlanetCache() {
        try {
            const liveRes = getLiveResources();
            if (!liveRes || (liveRes.metal === 0 && liveRes.crystal === 0 && liveRes.deuterium === 0)) return;

            let activeId = null;
            let activeCoords = null;
            let isMoon = false;

            const metaId = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
            const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content');
            const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
            if (metaId) {
                activeId = metaId;
                activeCoords = metaCoords;
                isMoon = (metaType === 'moon');
            }

            if (!activeId) {
                const activeMoon = document.querySelector('#planetList .moonlink.active, .smallplanet .moonlink.active');
                if (activeMoon) {
                    isMoon = true;
                    const m = (activeMoon.getAttribute('href') || '').match(/cp=(\d+)/);
                    if (m) activeId = m[1];
                } else {
                    const activePlanet = document.querySelector('#planetList .smallplanet a.active, #planetList .smallplanet.active a.planetlink, #planetList .smallplanet.hightlightStaff a.planetlink');
                    if (activePlanet) {
                        const m = (activePlanet.getAttribute('href') || '').match(/cp=(\d+)/);
                        if (m) activeId = m[1];
                    }
                }
            }

            if (activeId) {
                let pCache = JSON.parse(localStorage.getItem(KEYS.PLANET_CACHE) || '{}');
                pCache[activeId] = {
                    metal: liveRes.metal,
                    crystal: liveRes.crystal,
                    deuterium: liveRes.deuterium,
                    coords: activeCoords || '',
                    isMoon: isMoon,
                    ts: Date.now()
                };
                localStorage.setItem(KEYS.PLANET_CACHE, JSON.stringify(pCache));
            }
        } catch (e) {
            console.warn(LS, 'Planet cache güncellenemedi:', e.message || e);
        }
    }

    function getPlanetCachedResources(id) {
        // Eğer şu an aktif gezegen/ay ise canlı oku
        const metaId = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
        if (metaId === String(id)) {
            return getLiveResources();
        }
        let pCache = JSON.parse(localStorage.getItem(KEYS.PLANET_CACHE) || '{}');
        return pCache[id] || { metal: 0, crystal: 0, deuterium: 0 };
    }

    function showCollectorToast(msg, duration = 4000) {
        let toast = document.getElementById('ls-coll-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ls-coll-toast';
            toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1b2838;color:#00bcff;border:1px solid #00bcff;padding:10px 18px;border-radius:6px;font-size:12px;font-weight:bold;z-index:9999999;box-shadow:0 6px 20px rgba(0,0,0,0.8);font-family:sans-serif';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => { if (toast) toast.style.display = 'none'; }, duration);
    }

    function getCurrentActiveTarget(empire) {
        if (!empire || empire.length === 0) return null;
        const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content');
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content'); // 'moon' or 'planet'
        const metaId = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
        const isMoon = (metaType === 'moon');

        if (metaCoords) {
            const found = empire.find(p => p.coords === metaCoords);
            if (found) {
                if (isMoon && found.moon) {
                    return {
                        id: found.moon.id,
                        coords: found.coords,
                        type: 3,
                        name: found.moon.name || `${found.name} ( Ay )`
                    };
                }
                return {
                    id: found.id,
                    coords: found.coords,
                    type: 1,
                    name: found.name
                };
            }
        }
        if (metaId) {
            for (const p of empire) {
                if (p.id === metaId) {
                    return { id: p.id, coords: p.coords, type: 1, name: p.name };
                }
                if (p.moon && p.moon.id === metaId) {
                    return { id: p.moon.id, coords: p.coords, type: 3, name: p.moon.name || `${p.name} ( Ay )` };
                }
            }
        }
        return {
            id: empire[0].id,
            coords: empire[0].coords,
            type: 1,
            name: empire[0].name
        };
    }

    function renderCollector() {
        const empire = getEmpirePlanetsAndMoons();
        const listEl = document.getElementById('ls-coll-list');
        const targetLabelEl = document.getElementById('ls-coll-target-label');
        const ddEl = document.getElementById('ls-coll-dd');
        const collModeBtn = document.getElementById('ls-coll-mode-btn');
        if (!listEl || !targetLabelEl || !ddEl) return;

        if (collModeBtn) {
            updateModeBtnUI(collModeBtn, collectorSettings.priorityMode || 'speed');
        }

        // Varsayılan hedef seçimi: SADECE hedef henüz hiç belirlenmemişse veya geçersizse VE aktif toplama oturumu yoksa bulunulan aktif gezegen/ayı seç
        const hasValidTarget = collectorSettings.targetCoord && /^\d+:\d+:\d+$/.test(collectorSettings.targetCoord);
        const isSessionRunning = !!sessionStorage.getItem(KEYS.COLLECTOR_RUN);
        if (empire.length > 0 && !hasValidTarget && !isSessionRunning) {
            const cur = getCurrentActiveTarget(empire);
            if (cur) {
                collectorSettings.targetId = cur.id;
                collectorSettings.targetCoord = cur.coords;
                collectorSettings.targetType = cur.type;
                collectorSettings.targetName = cur.name;
                saveCollectorSettings();
            }
        }

        // 1. Hedef Buton Başlığı
        let targetIcon = '🪐';
        if (collectorSettings.targetType === 3) targetIcon = '🌕';
        let rawTargetTitle = collectorSettings.targetName || 'Merkez';
        let cleanTargetTitle = rawTargetTitle.replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        if (!cleanTargetTitle || cleanTargetTitle === 'Ay') {
            if (collectorSettings.targetType === 3) {
                const parentP = empire.find(p => p.coords === collectorSettings.targetCoord);
                cleanTargetTitle = parentP ? `${parentP.name} ( Ay )` : 'Ay ( Ay )';
            } else {
                cleanTargetTitle = 'Gezegen';
            }
        }
        if (collectorSettings.targetId === 'manual') {
            cleanTargetTitle = (collectorSettings.targetType === 3 ? 'Manuel Ay' : 'Manuel Gezegen');
        }

        targetLabelEl.innerHTML = `<span><b>${targetIcon} ${escapeHtml(cleanTargetTitle)}</b><span class="crd">${collectorSettings.targetCoord || ''}</span></span>`;

        // 2. Dropdown Listesi Doldur
        let ddHtml = '';
        empire.forEach(p => {
            const isPActive = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 1);
            ddHtml += `<div class="ls-coll-dd-item ${isPActive ? 'active' : ''}" data-id="${p.id}" data-coord="${p.coords}" data-type="1" data-name="${escapeHtml(p.name)}">` +
                `<span>🪐 ${escapeHtml(p.name)}</span><span class="crd">${p.coords}</span></div>`;
            if (p.moon) {
                const isMActive = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 3);
                const mTitle = p.moon.name || `${p.name} ( Ay )`;
                ddHtml += `<div class="ls-coll-dd-item moon ${isMActive ? 'active' : ''}" data-id="${p.moon.id}" data-coord="${p.coords}" data-type="3" data-name="${escapeHtml(mTitle)}">` +
                    `<span>🌕 ${escapeHtml(mTitle)}</span><span class="crd">${p.coords}</span></div>`;
            }
        });
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="1"><span>🪐 ${t('coll_manual_planet', 'Manuel Gezegen...')}</span><span></span></div>`;
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="3"><span>🌕 ${t('coll_manual_moon', 'Manuel Ay...')}</span><span></span></div>`;
        ddEl.innerHTML = ddHtml;

        // 3. Gemi & Kaynak Checkbox'ları Eşitle
        const bnChk = document.getElementById('ls-coll-ship-bn');
        const knChk = document.getElementById('ls-coll-ship-kn');
        const rehberChk = document.getElementById('ls-coll-ship-rehber');
        const deuChk = document.getElementById('ls-coll-res-deu');
        const criChk = document.getElementById('ls-coll-res-cri');
        const metChk = document.getElementById('ls-coll-res-met');

        if (bnChk) bnChk.checked = !!collectorSettings.selectedShips.bn;
        if (knChk) knChk.checked = !!collectorSettings.selectedShips.kn;
        if (rehberChk) rehberChk.checked = !!collectorSettings.selectedShips.rehber;
        if (deuChk) deuChk.checked = !!collectorSettings.selectedRes.deu;
        if (criChk) criChk.checked = !!collectorSettings.selectedRes.cri;
        if (metChk) metChk.checked = !!collectorSettings.selectedRes.met;

        // 4. Gezegen & Ay Listesini Çiz
        let listHtml = '';
        if (empire.length === 0) {
            listHtml = '<div style="text-align:center;color:#8899aa;padding:20px;font-size:11px">Gezegen listesi okunuyor...<br>Lütfen OGame menüsünde gezinin.</div>';
        } else {
            empire.forEach(p => {
                const isTargetPlanet = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 1);
                const pRes = getPlanetCachedResources(p.id);
                const pReserve = collectorSettings.reserves[p.id] !== undefined ? collectorSettings.reserves[p.id] : 250000;
                const pChecked = collectorSettings.selectedItems[p.id] !== false;

                listHtml += '<div class="ls-coll-grp">';

                if (isTargetPlanet) {
                    listHtml += `<div class="ls-coll-prow ls-coll-dest">` +
                        `<input type="checkbox" disabled>` +
                        `<div class="ls-coll-info">` +
                            `<div class="ls-coll-name"><b>${escapeHtml(p.name)}</b><span class="crd">${p.coords}</span></div>` +
                            `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(pRes.metal)}</span><span class="ls-coll-k">${formatShort(pRes.crystal)}</span><span class="ls-coll-d">${formatShort(pRes.deuterium)}</span></div>` +
                        `</div>` +
                        `<span class="note">📥 ${t('coll_target_point', 'Toplama noktası')}</span>` +
                        `<button class="ls-coll-jump" data-cp="${p.id}" title="${t('coll_jump_hint', 'Gezegene geç')}">🚀</button>` +
                    `</div>`;
                } else {
                    listHtml += `<div class="ls-coll-prow">` +
                        `<input type="checkbox" class="ls-coll-item-chk" data-id="${p.id}" ${pChecked ? 'checked' : ''}>` +
                        `<div class="ls-coll-info">` +
                            `<div class="ls-coll-name"><b>${escapeHtml(p.name)}</b><span class="crd">${p.coords}</span></div>` +
                            `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(pRes.metal)}</span><span class="ls-coll-k">${formatShort(pRes.crystal)}</span><span class="ls-coll-d">${formatShort(pRes.deuterium)}</span></div>` +
                        `</div>` +
                        `<input class="ls-inp ls-coll-rez" data-id="${p.id}" value="${fmt(pReserve)}" title="${t('coll_reserve_hint', 'Deu Rezerv (Korumalı miktar)')}">` +
                        `<button class="ls-coll-jump" data-cp="${p.id}" title="${t('coll_jump_hint', 'Gezegene geç')}">🚀</button>` +
                    `</div>`;
                }

                if (p.moon) {
                    const isTargetMoon = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 3);
                    const mRes = getPlanetCachedResources(p.moon.id);
                    const mReserve = collectorSettings.reserves[p.moon.id] !== undefined ? collectorSettings.reserves[p.moon.id] : 250000;
                    const mChecked = collectorSettings.selectedItems[p.moon.id] === true;
                    const mTitle = p.moon.name || `${p.name} ( Ay )`;

                    if (isTargetMoon) {
                        listHtml += `<div class="ls-coll-mrow ls-coll-dest">` +
                            `<input type="checkbox" disabled>` +
                            `<div class="ls-coll-info">` +
                                `<div class="ls-coll-name"><b>🌕 ${escapeHtml(mTitle)}</b></div>` +
                                `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(mRes.metal)}</span><span class="ls-coll-k">${formatShort(mRes.crystal)}</span><span class="ls-coll-d">${formatShort(mRes.deuterium)}</span></div>` +
                            `</div>` +
                            `<span class="note">📥 ${t('coll_target_point', 'Toplama noktası')}</span>` +
                            `<button class="ls-coll-jump" data-cp="${p.moon.id}" title="${t('coll_jump_moon_hint', 'Aya geç')}">🚀</button>` +
                        `</div>`;
                    } else {
                        listHtml += `<div class="ls-coll-mrow">` +
                            `<input type="checkbox" class="ls-coll-item-chk" data-id="${p.moon.id}" ${mChecked ? 'checked' : ''}>` +
                            `<div class="ls-coll-info">` +
                                `<div class="ls-coll-name"><b>🌕 ${escapeHtml(mTitle)}</b></div>` +
                                `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(mRes.metal)}</span><span class="ls-coll-k">${formatShort(mRes.crystal)}</span><span class="ls-coll-d">${formatShort(mRes.deuterium)}</span></div>` +
                            `</div>` +
                            `<input class="ls-inp ls-coll-rez" data-id="${p.moon.id}" value="${fmt(mReserve)}" title="${t('coll_reserve_hint', 'Deu Rezerv (Korumalı miktar)')}">` +
                            `<button class="ls-coll-jump" data-cp="${p.moon.id}" title="${t('coll_jump_moon_hint', 'Aya geç')}">🚀</button>` +
                        `</div>`;
                    }
                }

                listHtml += '</div>';
            });
        }
        listEl.innerHTML = listHtml;

        // 5. Özet Bilgisini Hesapla ve Göster
        updateCollectorSummary();
    }

    function updateCollectorSummary() {
        const empire = getEmpirePlanetsAndMoons();
        const summaryEl = document.getElementById('ls-coll-summary');
        if (!summaryEl) return;

        let totalM = 0, totalC = 0, totalD = 0;
        let checkedPCount = 0, checkedMCount = 0;

        empire.forEach(p => {
            const isTargetP = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 1);
            if (!isTargetP && collectorSettings.selectedItems[p.id] !== false) {
                checkedPCount++;
                const res = getPlanetCachedResources(p.id);
                const rez = collectorSettings.reserves[p.id] !== undefined ? collectorSettings.reserves[p.id] : 250000;
                if (collectorSettings.selectedRes.met) totalM += (res.metal || 0);
                if (collectorSettings.selectedRes.cri) totalC += (res.crystal || 0);
                if (collectorSettings.selectedRes.deu) totalD += Math.max(0, (res.deuterium || 0) - rez);
            }

            if (p.moon) {
                const isTargetM = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 3);
                if (!isTargetM && collectorSettings.selectedItems[p.moon.id] === true) {
                    checkedMCount++;
                    const res = getPlanetCachedResources(p.moon.id);
                    const rez = collectorSettings.reserves[p.moon.id] !== undefined ? collectorSettings.reserves[p.moon.id] : 250000;
                    if (collectorSettings.selectedRes.met) totalM += (res.metal || 0);
                    if (collectorSettings.selectedRes.cri) totalC += (res.crystal || 0);
                    if (collectorSettings.selectedRes.deu) totalD += Math.max(0, (res.deuterium || 0) - rez);
                }
            }
        });

        summaryEl.innerHTML =
            `<span style="color:#8899aa">${checkedPCount} ${t('coll_planets_count', 'gezegen')} · ${checkedMCount} ${t('coll_moons_count', 'ay')}</span>` +
            `<span style="font-family:monospace"><span class="ls-coll-m">${formatShort(totalM)}</span> · <span class="ls-coll-k">${formatShort(totalC)}</span> · <span class="ls-coll-d">${formatShort(totalD)}</span></span>`;
    }

    let collectorEventsInitialized = false;
    function initCollectorEvents() {
        if (collectorEventsInitialized) return;
        collectorEventsInitialized = true;

        const ddEl = document.getElementById('ls-coll-dd');
        const targetBtn = document.getElementById('ls-coll-target-btn');

        const collCurBtn = document.getElementById('ls-coll-cur-btn');
        if (collCurBtn) {
            collCurBtn.addEventListener('click', () => {
                const cur = getCurrentActiveTarget(getEmpirePlanetsAndMoons());
                if (cur) {
                    collectorSettings.targetId = cur.id;
                    collectorSettings.targetCoord = cur.coords;
                    collectorSettings.targetType = cur.type;
                    collectorSettings.targetName = cur.name;
                    saveCollectorSettings();
                    renderCollector();
                    showCollectorToast('📍 Merkez güncellendi: ' + (cur.type === 3 ? '🌕 ' : '🪐 ') + cur.name);
                }
            });
        }

        if (targetBtn && ddEl) {
            targetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShown = ddEl.style.display === 'block';
                ddEl.style.display = isShown ? 'none' : 'block';
            });

            document.addEventListener('click', (e) => {
                if (ddEl && !ddEl.contains(e.target) && !targetBtn.contains(e.target)) {
                    ddEl.style.display = 'none';
                }
            });

            ddEl.addEventListener('click', (e) => {
                const item = e.target.closest('.ls-coll-dd-item');
                if (!item) return;

                if (item.getAttribute('data-manual') === '1') {
                    const mType = parseInt(item.getAttribute('data-type'), 10) || 1;
                    const typeLabel = mType === 3 ? 'Manuel Ay' : 'Manuel Gezegen';
                    const entered = prompt(`${typeLabel} koordinatı girin (örn: 1:234:8):`, collectorSettings.targetCoord || '1:1:1');
                    if (entered && /^\d+:\d+:\d+$/.test(entered.trim())) {
                        collectorSettings.manualTarget = true;
                        collectorSettings.targetId = 'manual';
                        collectorSettings.targetCoord = entered.trim();
                        collectorSettings.targetType = mType;
                        collectorSettings.targetName = typeLabel;
                        saveCollectorSettings();
                        renderCollector();
                    }
                } else {
                    collectorSettings.manualTarget = true;
                    collectorSettings.targetId = item.getAttribute('data-id');
                    collectorSettings.targetCoord = item.getAttribute('data-coord');
                    collectorSettings.targetType = parseInt(item.getAttribute('data-type'), 10) || 1;
                    collectorSettings.targetName = item.getAttribute('data-name');
                    saveCollectorSettings();
                    renderCollector();
                }
                ddEl.style.display = 'none';
            });
        }

        // Görev Butonları (Nakliye / Konuşlandır)
        const updateMissionUi = () => {
            const m3 = document.getElementById('ls-coll-mission-3');
            const m4 = document.getElementById('ls-coll-mission-4');
            if (m3) m3.classList.toggle('active', collectorSettings.mission === 3);
            if (m4) m4.classList.toggle('active', collectorSettings.mission === 4);
        };

        document.getElementById('ls-coll-mission-3')?.addEventListener('click', () => {
            collectorSettings.mission = 3;
            saveCollectorSettings();
            updateMissionUi();
        });

        document.getElementById('ls-coll-mission-4')?.addEventListener('click', () => {
            collectorSettings.mission = 4;
            saveCollectorSettings();
            updateMissionUi();
        });

        // Öncelik Modu Butonu (Hız / Yakıt)
        const collModeBtn = document.getElementById('ls-coll-mode-btn');
        const updateCollModeUi = () => {
            updateModeBtnUI(collModeBtn, collectorSettings.priorityMode || 'speed');
        };
        updateCollModeUi();
        if (collModeBtn && !collModeBtn.dataset.bound) {
            collModeBtn.dataset.bound = '1';
            collModeBtn.addEventListener('click', () => {
                collectorSettings.priorityMode = (collectorSettings.priorityMode === 'fuel') ? 'speed' : 'fuel';
                saveCollectorSettings();
                updateCollModeUi();
                showCollectorToast(collectorSettings.priorityMode === 'fuel' ? t('mode_fuel_toast') : t('mode_speed_toast'));
            });
        }

        // Gemi Seçimleri
        const bindShip = (id, key) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    collectorSettings.selectedShips[key] = el.checked;
                    saveCollectorSettings();
                });
            }
        };
        bindShip('ls-coll-ship-bn', 'bn');
        bindShip('ls-coll-ship-kn', 'kn');
        bindShip('ls-coll-ship-rehber', 'rehber');

        // Kaynak Seçimleri
        const bindRes = (id, key) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    collectorSettings.selectedRes[key] = el.checked;
                    saveCollectorSettings();
                    updateCollectorSummary();
                });
            }
        };
        bindRes('ls-coll-res-deu', 'deu');
        bindRes('ls-coll-res-cri', 'cri');
        bindRes('ls-coll-res-met', 'met');

        // Üst Hızlı Seçim Butonları
        const empire = () => getEmpirePlanetsAndMoons();

        document.getElementById('ls-coll-sel-all')?.addEventListener('click', () => {
            empire().forEach(p => {
                const isTargetP = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 1);
                if (!isTargetP) collectorSettings.selectedItems[p.id] = true;
                const isTargetM = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 3);
                if (p.moon && !isTargetM) collectorSettings.selectedItems[p.moon.id] = true;
            });
            saveCollectorSettings();
            renderCollector();
        });

        document.getElementById('ls-coll-sel-planets')?.addEventListener('click', () => {
            empire().forEach(p => {
                const isTargetP = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 1);
                if (!isTargetP) collectorSettings.selectedItems[p.id] = true;
                if (p.moon) collectorSettings.selectedItems[p.moon.id] = false;
            });
            saveCollectorSettings();
            renderCollector();
        });

        document.getElementById('ls-coll-sel-moons')?.addEventListener('click', () => {
            empire().forEach(p => {
                collectorSettings.selectedItems[p.id] = false;
                const isTargetM = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 3);
                if (p.moon && !isTargetM) collectorSettings.selectedItems[p.moon.id] = true;
            });
            saveCollectorSettings();
            renderCollector();
        });

        document.getElementById('ls-coll-sel-none')?.addEventListener('click', () => {
            empire().forEach(p => {
                collectorSettings.selectedItems[p.id] = false;
                if (p.moon) collectorSettings.selectedItems[p.moon.id] = false;
            });
            saveCollectorSettings();
            renderCollector();
        });

        // Liste İçi Etkileşimler (Checkbox, Rezerv, Jump)
        const listEl = document.getElementById('ls-coll-list');
        if (listEl) {
            listEl.addEventListener('change', (e) => {
                const chk = e.target.closest('.ls-coll-item-chk');
                if (chk) {
                    const id = chk.getAttribute('data-id');
                    collectorSettings.selectedItems[id] = chk.checked;
                    saveCollectorSettings();
                    updateCollectorSummary();
                    return;
                }

                const rezInp = e.target.closest('.ls-coll-rez');
                if (rezInp) {
                    const id = rezInp.getAttribute('data-id');
                    const parsed = parseOgNum(rezInp.value);
                    const clean = Math.max(0, parsed || 0);
                    collectorSettings.reserves[id] = clean;
                    rezInp.value = fmt(clean);
                    saveCollectorSettings();
                    updateCollectorSummary();
                }
            });

            listEl.addEventListener('blur', (e) => {
                const rezInp = e.target.closest('.ls-coll-rez');
                if (rezInp) {
                    const id = rezInp.getAttribute('data-id');
                    const parsed = parseOgNum(rezInp.value);
                    const clean = Math.max(0, parsed || 0);
                    collectorSettings.reserves[id] = clean;
                    rezInp.value = fmt(clean);
                    saveCollectorSettings();
                    updateCollectorSummary();
                }
            }, true);

            listEl.addEventListener('click', (e) => {
                const jumpBtn = e.target.closest('.ls-coll-jump');
                if (jumpBtn) {
                    const cp = jumpBtn.getAttribute('data-cp');
                    if (cp) {
                        window.location.href = `/game/index.php?page=ingame&component=fleetdispatch&cp=${cp}`;
                    }
                }
            });
        }

        // Toplamayı Başlat Butonu
        document.getElementById('ls-coll-start-btn')?.addEventListener('click', () => {
            startCollectorSession();
        });
    }

    function startCollectorSession() {
        if (!collectorSettings.targetCoord || !/^\d+:\d+:\d+$/.test(collectorSettings.targetCoord)) {
            alert(currentLang === 'tr' ? 'Lütfen geçerli bir toplama noktası (hedef) belirleyin!' : 'Please specify a valid collection target coordinate!');
            return;
        }

        const ships = collectorSettings.selectedShips;
        if (!ships.bn && !ships.kn && !ships.rehber) {
            alert(currentLang === 'tr' ? 'Lütfen taşımada kullanılacak en az bir gemi türü (BN, KN veya Rehber) seçin!' : 'Please select at least one cargo ship type (LC, SC or Pathfinder)!');
            return;
        }

        const res = collectorSettings.selectedRes;
        if (!res.deu && !res.cri && !res.met) {
            alert(currentLang === 'tr' ? 'Lütfen taşınacak en az bir kaynak (Deuterium, Kristal veya Metal) seçin!' : 'Please select at least one resource to collect (Deuterium, Crystal or Metal)!');
            return;
        }

        const empire = getEmpirePlanetsAndMoons();
        const queue = [];

        empire.forEach(p => {
            const isTargetPlanet = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 1);
            if (!isTargetPlanet && collectorSettings.selectedItems[p.id] !== false) {
                queue.push({ id: p.id, name: p.name, coords: p.coords, isMoon: false });
            }
            if (p.moon) {
                const isTargetMoon = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 3);
                if (!isTargetMoon && collectorSettings.selectedItems[p.moon.id] === true) {
                    queue.push({ id: p.moon.id, name: p.moon.name || `${p.name} ( ${t('coll_moon_name')} )`, coords: p.coords, isMoon: true });
                }
            }
        });

        if (queue.length === 0) {
            alert(currentLang === 'tr' ? 'Toplama yapılacak en az bir gezegen veya ay seçmelisiniz!' : 'Please select at least one planet or moon to collect from!');
            return;
        }

        const session = {
            active: true,
            targetCoord: collectorSettings.targetCoord,
            targetType: collectorSettings.targetType || 1,
            targetName: collectorSettings.targetName || 'Hedef',
            mission: collectorSettings.mission || 3,
            priorityMode: collectorSettings.priorityMode || 'speed',
            ships: { ...collectorSettings.selectedShips, priorityMode: collectorSettings.priorityMode || 'speed' },
            resources: collectorSettings.selectedRes,
            queue: queue,
            currentIndex: 0,
            startedAt: Date.now()
        };

        sessionStorage.setItem(KEYS.COLLECTOR_RUN, JSON.stringify(session));

        const firstItem = queue[0];
        const [g, s, p] = session.targetCoord.split(':');
        const firstType = firstItem.isMoon ? 3 : 1;
        const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${firstItem.id}&type=${firstType}&galaxy=${g}&system=${s}&position=${p}&mission=${session.mission || 3}`;

        const metaId = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const isCurrentOnMoon = (metaType === 'moon');
        const shouldBeOnMoon = !!firstItem.isMoon;
        const typeMismatch = (isCurrentOnMoon !== shouldBeOnMoon);

        if (metaId === String(firstItem.id) && !typeMismatch && window.location.href.includes('component=fleetdispatch')) {
            checkAndRunCollectorAssistant();
        } else {
            window.location.href = url;
        }
    }

    function checkAndRunCollectorAssistant() {
        const raw = sessionStorage.getItem(KEYS.COLLECTOR_RUN);
        if (!raw) return;

        let session;
        try {
            session = JSON.parse(raw);
        } catch (e) {
            sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
            return;
        }

        if (!session || !session.active || !Array.isArray(session.queue)) {
            sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
            return;
        }

        if (session.startedAt && Date.now() - session.startedAt > 15 * 60 * 1000) {
            sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
            return;
        }

        if (session.currentIndex >= session.queue.length) {
            sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
            showCollectorToast('🎉 Tebrikler! Tüm gezegenlerden toplama filoları gönderildi.', 6000);
            return;
        }

        const currentItem = session.queue[session.currentIndex];
        const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                            document.getElementById('fleetdispatchcomponent') ||
                            document.getElementById('fleet1');

        const metaId = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const isCurrentOnMoon = (metaType === 'moon');
        const shouldBeOnMoon = !!currentItem.isMoon;
        const typeMismatch = (isCurrentOnMoon !== shouldBeOnMoon);

        // Filo sayfasında değilsek veya sayfa sıradaki gezegenle eşleşmiyorsa yönlendir
        if (!isFleetPage || (metaId && metaId !== String(currentItem.id)) || typeMismatch) {
            const [g, s, p] = session.targetCoord.split(':');
            const itemType = currentItem.isMoon ? 3 : 1;
            const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${currentItem.id}&type=${itemType}&galaxy=${g}&system=${s}&position=${p}&mission=${session.mission || 3}`;
            window.location.href = url;
            return;
        }

        let tries = 0;
        const pollInterval = setInterval(() => {
            tries++;

            const currentMeta = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
            const currentType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
            const isPollOnMoon = (currentType === 'moon');
            const pollMismatch = (isPollOnMoon !== !!currentItem.isMoon);

            if ((currentMeta && currentMeta !== String(currentItem.id)) || pollMismatch) {
                // Eğer sayfa eski gezegende kaldıysa doğru gezegene yönlendir
                clearInterval(pollInterval);
                const [g, s, p] = session.targetCoord.split(':');
                const itemType = currentItem.isMoon ? 3 : 1;
                const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${currentItem.id}&type=${itemType}&galaxy=${g}&system=${s}&position=${p}&mission=${session.mission || 3}`;
                window.location.href = url;
                return;
            }

            const hasShipInput = document.querySelector('[data-technology="203"], [data-technology="202"]') ||
                                 document.querySelector('input[name="transporterLarge"], input[name="am203"], input[name="am202"]') ||
                                 document.getElementById('fleet1');
            const hasCoords = document.getElementById('galaxy') || document.querySelector('input[name="galaxy"]');
            const hasRes = document.getElementById('resources_metal') || document.getElementById('resources_crystal');

            // Hem sayfa DOM hazır olsun hem de gemi/koordinat/kaynak elementleri DOM'da oluşmuş olsun
            const domReady = document.readyState === 'complete' || document.readyState === 'interactive';
            const fleetReady = domReady && hasShipInput && hasCoords && hasRes;

            if (fleetReady || tries > 40) {
                clearInterval(pollInterval);
                // OGame motorunun ve scriptlerinin tam init olması için 500ms tampon bekle
                setTimeout(() => {
                    executeFleetDispatchStep(session, currentItem);
                }, 500);
            }
        }, 150);
    }

    function executeFleetDispatchStep(session, currentItem) {
        LS_LOGGER.info('COLLECTOR', `Toplama adımı: ${currentItem.name} [${currentItem.g}:${currentItem.s}:${currentItem.p}] (${session.currentIndex + 1}/${session.queue.length}) -> Hedef: [${session.targetCoord}]`);
        const liveRes = getLiveResources();
        updateActivePlanetCache();

        const reserve = collectorSettings.reserves[currentItem.id] !== undefined ? collectorSettings.reserves[currentItem.id] : 250000;
        const deuAvail = session.resources.deu ? Math.max(0, liveRes.deuterium - reserve) : 0;
        const criAvail = session.resources.cri ? Math.max(0, liveRes.crystal) : 0;
        const metAvail = session.resources.met ? Math.max(0, liveRes.metal) : 0;
        const totalCargoNeeded = deuAvail + criAvail + metAvail;

        const caps = calculateShipCapacities();
        const shipCounts = calculateSmartCargoFleet(totalCargoNeeded, session.ships);
        const bnCount = shipCounts.bn;
        const knCount = shipCounts.kn;
        const rehberCount = shipCounts.rehber;
        const totalCap = shipCounts.totalCap;

        // Değer Önceliği: Deuterium > Kristal > Metal
        let remCap = totalCap;
        let deuLoad = Math.min(remCap, deuAvail);
        remCap -= deuLoad;
        let criLoad = Math.min(remCap, criAvail);
        remCap -= criLoad;
        let metLoad = Math.min(remCap, metAvail);
        remCap -= metLoad;

        const missingCargo = Math.max(0, totalCargoNeeded - totalCap);
        const missingMet = metAvail - metLoad;
        const missingCri = criAvail - criLoad;
        const missingDeu = deuAvail - deuLoad;
        const hasAnyShortage = totalCargoNeeded > 0 && (missingCargo > 0 || totalCap === 0);

        // Gemileri doldur
        setShipAmount(203, bnCount);
        setShipAmount(202, knCount);
        setShipAmount(219, rehberCount);

        // Hedef koordinatları
        const [g, s, p] = session.targetCoord.split(':');
        setFleetTargetCoords(g, s, p, session.targetType);

        let isStepCancelled = false;

        const updateCollectorBannerReady = () => {
            const btn = document.getElementById('ls-banner-send-btn');
            if (btn) {
                btn.disabled = false;
                btn.style.background = '#27ae60';
                btn.style.color = '#fff';
                btn.style.cursor = 'pointer';
                btn.innerText = '🚀 ' + t('coll_hud_send') + ' (Space)';
            }
        };

        // Step 2 (Görev ve Kaynaklar) Hazırlık Fonksiyonu
        const prepareStep2 = () => {
            if (isStepCancelled) return;
            const missionId = session.mission || 3;
            setFleetTargetCoords(g, s, p, session.targetType);
            setFleetMission(missionId);
            fillFleetResources(metLoad, criLoad, deuLoad);
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SELECT_MISSION', missionId: missionId }
            }));
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'CARGO_REFRESH' }
            }));

            let checkCount = 0;
            const step2CheckTimer = setInterval(() => {
                if (isStepCancelled) {
                    clearInterval(step2CheckTimer);
                    return;
                }
                checkCount++;
                const mBtn = document.querySelector('#missionButton' + missionId + ', [data-mission="' + missionId + '"]');
                const isMissionActive = mBtn && (mBtn.classList.contains('selected') || mBtn.classList.contains('active'));
                if (!isMissionActive) setFleetMission(missionId);
                fillFleetResources(metLoad, criLoad, deuLoad);

                const sendBtn = findSendFleetButton();
                const isSendBtnReady = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');

                if ((isMissionActive && isSendBtnReady && checkCount >= 2) || checkCount > 15) {
                    clearInterval(step2CheckTimer);
                    updateCollectorBannerReady();
                }
            }, 100);
        };

        let ensureShipsTimer = null;
        const targetShipTotal = bnCount + knCount + rehberCount;
        if (targetShipTotal > 0) {
            let shipTries = 0;
            ensureShipsTimer = setInterval(() => {
                if (isStepCancelled) {
                    clearInterval(ensureShipsTimer);
                    return;
                }
                shipTries++;
                const { total } = getSelectedShipsSummary();
                if (total > 0 || shipTries > 6) {
                    clearInterval(ensureShipsTimer);
                    setTimeout(() => {
                        if (isStepCancelled) return;
                        clickDevamButton();
                        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                            detail: { type: 'SUBMIT_FLEET1' }
                        }));

                        let step2Tries = 0;
                        const step2Interval = setInterval(() => {
                            if (isStepCancelled) {
                                clearInterval(step2Interval);
                                return;
                            }
                            step2Tries++;
                            const devamBtn = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
                            const isStep1StillActive = devamBtn && (devamBtn.offsetWidth > 0 || window.getComputedStyle(devamBtn).display !== 'none');
                            const sendBtn = findSendFleetButton();
                            const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                            const isStep2Active = !isStep1StillActive && isSendBtnVisible;

                            if (isStep2Active) {
                                clearInterval(step2Interval);
                                setTimeout(prepareStep2, 100);
                            } else {
                                if (step2Tries % 5 === 0) {
                                    clickDevamButton();
                                    window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                                        detail: { type: 'SUBMIT_FLEET1' }
                                    }));
                                }
                                if (step2Tries > 30) {
                                    clearInterval(step2Interval);
                                    setTimeout(prepareStep2, 100);
                                }
                            }
                        }, 100);
                    }, 200);
                } else {
                    setShipAmount(203, bnCount);
                    setShipAmount(202, knCount);
                    setShipAmount(219, rehberCount);
                }
            }, 150);
        }

        // Asistan Banner'ını Çiz
        renderCollectorAssistantBanner(session, currentItem, {
            bn: bnCount, kn: knCount, rehber: rehberCount,
            deu: deuLoad, cri: criLoad, met: metLoad,
            totalCap: totalCap,
            totalCargoNeeded: totalCargoNeeded,
            missingCargo: missingCargo,
            missingMet: missingMet,
            missingCri: missingCri,
            missingDeu: missingDeu,
            hasAnyShortage: hasAnyShortage,
            g: g, s: s, p: p,
            prepareStep2: prepareStep2,
            cancel: () => {
                isStepCancelled = true;
                if (ensureShipsTimer) clearInterval(ensureShipsTimer);
            }
        });
    }

    function renderCollectorAssistantBanner(session, currentItem, details) {
        let banner = document.getElementById('ls-coll-floating-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'ls-coll-floating-banner';
            document.body.appendChild(banner);
        }

        const totalItems = session.queue.length;
        const currentStep = session.currentIndex + 1;
        const hasShips = details.totalCap > 0;
        const missionName = (session.mission === 4 ? '🛡️ ' + t('coll_deploy') : '🚚 ' + t('coll_transport'));

        let shipDesc = [];
        if (details.bn > 0) shipDesc.push(details.bn + ' ' + t('coll_bn'));
        if (details.kn > 0) shipDesc.push(details.kn + ' ' + t('coll_kn'));
        if (details.rehber > 0) shipDesc.push(details.rehber + ' ' + t('coll_rehber'));
        const shipText = shipDesc.length > 0 ? shipDesc.join(', ') : '<span style="color:#e74c3c">' + t('coll_hud_no_ships') + '</span>';

        const cleanTName = (session.targetName || '').replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        let displayTargetTitle = cleanTName;
        if (!displayTargetTitle || displayTargetTitle === 'Ay' || displayTargetTitle === 'Moon') {
            if (session.targetType === 3) {
                const emp = getEmpirePlanetsAndMoons();
                const matched = emp.find(x => x.coords === session.targetCoord);
                displayTargetTitle = matched ? `${matched.name} ( ${t('coll_moon_name')} )` : `${t('coll_moon_name')} ( ${t('coll_moon_name')} )`;
            } else {
                displayTargetTitle = (currentLang === 'tr' ? 'Hedef' : 'Target');
            }
        }
        const displayTargetIcon = session.targetType === 3 ? '🌕' : '🪐';

        banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(13,27,42,0.96);border:2px solid #00bcff;box-shadow:0 10px 32px rgba(0,0,0,0.85);border-radius:8px;padding:12px 18px;min-width:400px;max-width:90vw;z-index:9999999;font-family:sans-serif;color:#d1d8e0;text-align:center;box-sizing:border-box';

        // Yetersiz Gemi Kapasitesi Uyarısı
        let warningHtml = '';
        const hasShortage = !!details.hasAnyShortage;
        if (hasShortage) {
            let reasons = [];
            if (details.totalCap === 0) {
                reasons.push(t('coll_hud_no_ships'));
            } else {
                reasons.push(`${t('coll_hud_cap_shortage')} (${formatShort(details.missingCargo)})`);
            }
            if (details.missingMet > 0) reasons.push(`${t('coll_met')} ${formatShort(details.missingMet)}`);
            if (details.missingCri > 0) reasons.push(`${t('coll_crys')} ${formatShort(details.missingCri)}`);
            if (details.missingDeu > 0) reasons.push(`${t('coll_deut')} ${formatShort(details.missingDeu)}`);

            warningHtml =
                '<div id="ls-coll-warning-box" style="background:rgba(231,76,60,0.22);border:1px solid #e74c3c;border-radius:4px;padding:6px 8px;margin-bottom:8px;font-size:11px;color:#ff6b6b;text-align:left">' +
                    '<div style="font-weight:bold;margin-bottom:2px">' + t('coll_hud_shortage_title') + '</div>' +
                    '<div style="font-size:10.5px;color:#f5b7b1;margin-bottom:6px">' + reasons.join(' · ') + '</div>' +
                    '<div style="display:flex;gap:6px;justify-content:center">' +
                        '<button id="ls-coll-stop-btn" style="background:#e74c3c;color:#fff;border:none;padding:4px 9px;border-radius:3px;font-weight:bold;font-size:10.5px;cursor:pointer">' + t('coll_hud_stop_btn') + '</button>' +
                        '<button id="ls-coll-proceed-btn" style="background:#f39c12;color:#000;border:none;padding:4px 9px;border-radius:3px;font-weight:bold;font-size:10.5px;cursor:pointer">' + t('coll_hud_proceed_btn') + '</button>' +
                    '</div>' +
                '</div>';
        }

        banner.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a2c3f;padding-bottom:6px;margin-bottom:8px">' +
                '<span style="font-size:12px;font-weight:bold;color:#00bcff">📦 ' + t('tab_collector') + ' [' + currentStep + ' / ' + totalItems + ']</span>' +
                '<span style="font-size:11px;color:#fff">' + (currentItem.isMoon ? '🌕' : '🪐') + ' ' + escapeHtml(currentItem.name) + ' ➔ ' + displayTargetIcon + ' ' + escapeHtml(displayTargetTitle) + ' <span style="color:#ffbe3b;font-family:monospace">[' + session.targetCoord + ']</span></span>' +
            '</div>' +
            warningHtml +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">' +
                '<div><b style="color:#8899aa">' + t('coll_hud_selected_fleet') + '</b> <span style="font-weight:bold">' + shipText + '</span></div>' +
                '<div style="font-size:10.5px;color:#00bcff;font-weight:bold">' + missionName + '</div>' +
            '</div>' +
            '<div style="font-size:11.5px;font-family:monospace;margin-bottom:10px">' +
                '<b style="color:#8899aa">' + t('coll_hud_transported') + '</b> ' +
                '<span style="color:#ffbe3b">' + formatShort(details.met) + ' ' + t('coll_met') + '</span> · ' +
                '<span style="color:#5dade2">' + formatShort(details.cri) + ' ' + t('coll_crys') + '</span> · ' +
                '<span style="color:#2ecc71">' + formatShort(details.deu) + ' ' + t('coll_deut') + '</span>' +
            '</div>' +
            '<div id="ls-coll-hud-controls" style="display:flex;gap:6px;justify-content:center;align-items:center;' + (hasShortage ? 'display:none;' : '') + '">' +
                (hasShips ?
                    '<button id="ls-banner-send-btn" disabled style="background:#445566;color:#8899aa;border:none;padding:5px 12px;border-radius:4px;font-weight:bold;font-size:11px;cursor:not-allowed">' + t('exp_hud_preparing') + '</button>'
                    : '<button class="ls-banner-skip-btn" style="background:#f39c12;color:#000;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ ' + t('coll_hud_skip') + ' (Space)</button>') +
                '<button id="ls-banner-retry-btn" style="background:#e67e22;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer" title="' + t('coll_hud_retry') + '">🔄 ' + t('coll_hud_retry') + '</button>' +
                (hasShips ? '<button class="ls-banner-skip-btn" style="background:#34495e;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ ' + t('coll_hud_skip') + '</button>' : '') +
                '<button id="ls-banner-cancel-btn" style="background:#e74c3c;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏹️ ' + t('coll_hud_cancel') + '</button>' +
            '</div>';

        const sendFleet = () => {
            const sendBtnEl = document.getElementById('ls-banner-send-btn');
            if (sendBtnEl && sendBtnEl.disabled) return;

            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }

            const sendBtn = findSendFleetButton();
            const isSendBtnReady = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');

            if (isSendBtnReady) {
                dispatchSendFleetButton();
            } else {
                clickDevamButton();
                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                    detail: { type: 'SUBMIT_FLEET1' }
                }));
                if (typeof details.prepareStep2 === 'function') {
                    details.prepareStep2();
                }
            }
        };

        const retryCurrentStep = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#e67e22;padding:6px;font-weight:bold">🔄 Adım yeniden deneniyor...</div>';
            }
            setTimeout(() => {
                executeFleetDispatchStep(session, currentItem);
            }, 150);
        };

        const dispatchSendFleetButton = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();

            // 1. Gönderilen gezegeni/ayı Collector ayarlarında uncheck yap
            if (!collectorSettings.selectedItems) collectorSettings.selectedItems = {};
            collectorSettings.selectedItems[currentItem.id] = false;
            saveCollectorSettings();
            renderCollector();

            // 2. Önce kuyruğu derhal bir sonraki adıma geçir ve kaydet!
            session.currentIndex++;
            sessionStorage.setItem(KEYS.COLLECTOR_RUN, JSON.stringify(session));

            LS_LOGGER.dispatch('COLLECTOR', `Collector filosu gönderiliyor: ${currentItem.name} -> Hedef: [${session.targetCoord}] (Adım ${session.currentIndex}/${session.queue.length})`);

            if (banner) {
                banner.innerHTML =
                    '<div style="font-size:12px;color:#2ecc71;padding:8px;font-weight:bold">' +
                        '🚀 Filo gönderildi! Sıradaki gezegene geçiliyor...' +
                    '</div>';
            }

            // Sayfa bağlamında (Main World) OGame'in native submit fonksiyonunu çalıştır
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SUBMIT_FLEET2' }
            }));

            // Bir sonraki gezegene yönlendir
            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const [g, s, p] = session.targetCoord.split(':');
                    const nextType = nextItem.isMoon ? 3 : 1;
                    const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${nextItem.id}&type=${nextType}&galaxy=${g}&system=${s}&position=${p}&mission=${session.mission || 3}`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
                    if (banner) banner.remove();
                    showCollectorToast('🎉 Tebrikler! Tüm filolar başarıyla gönderildi.', 6000);
                }
            }, 800);
        };

        const proceedToNext = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();

            // 1. Atlanan gezegeni/ayı Collector ayarlarında uncheck yap
            if (!collectorSettings.selectedItems) collectorSettings.selectedItems = {};
            collectorSettings.selectedItems[currentItem.id] = false;
            saveCollectorSettings();
            renderCollector();

            session.currentIndex++;
            sessionStorage.setItem(KEYS.COLLECTOR_RUN, JSON.stringify(session));

            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#f39c12;padding:6px">⏭️ Gezegen atlandı, sıradakine geçiliyor...</div>';
            }

            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const [g, s, p] = session.targetCoord.split(':');
                    const nextType = nextItem.isMoon ? 3 : 1;
                    const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${nextItem.id}&type=${nextType}&galaxy=${g}&system=${s}&position=${p}&mission=${session.mission || 3}`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
                    if (banner) banner.remove();
                    showCollectorToast('🎉 Toplama asistanı tamamlandı.', 5000);
                }
            }, 400);
        };

        const cancel = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            LS_LOGGER.warn('COLLECTOR', 'Toplama işlemi iptal edildi.');
            sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
            if (banner) banner.remove();
            showCollectorToast('Toplama işlemi iptal edildi.', 3000);
        };

        const keyListener = (e) => {
            if (e.repeat) return;
            if (e.code === 'Space' || e.key === ' ') {
                const tag = document.activeElement ? document.activeElement.tagName : '';
                if (tag === 'TEXTAREA' || tag === 'SELECT') return;
                if (tag === 'INPUT') {
                    if (document.activeElement.id && document.activeElement.id.includes('search')) return;
                    document.activeElement.blur();
                }
                const wBox = document.getElementById('ls-coll-warning-box');
                if (wBox && wBox.style.display !== 'none') return;

                const sendBtnEl = document.getElementById('ls-banner-send-btn');
                if (hasShips && sendBtnEl && sendBtnEl.disabled) return;

                e.preventDefault();
                if (hasShips) {
                    sendFleet();
                } else {
                    proceedToNext();
                }
            }
        };

        window.addEventListener('keydown', keyListener);

        document.getElementById('ls-banner-send-btn')?.addEventListener('click', sendFleet);
        document.getElementById('ls-banner-retry-btn')?.addEventListener('click', retryCurrentStep);
        banner.querySelectorAll('.ls-banner-skip-btn').forEach(btn => btn.addEventListener('click', proceedToNext));
        document.getElementById('ls-banner-cancel-btn')?.addEventListener('click', cancel);

        document.getElementById('ls-coll-stop-btn')?.addEventListener('click', cancel);
        document.getElementById('ls-coll-proceed-btn')?.addEventListener('click', () => {
            const warningBox = document.getElementById('ls-coll-warning-box');
            if (warningBox) warningBox.style.display = 'none';
            const controls = document.getElementById('ls-coll-hud-controls');
            if (controls) controls.style.display = 'flex';
        });
    }

    // ============================================================
    // POSTACI ASİSTANI (RESOURCE COURIER)
    // ============================================================
    function renderCourier() {
        const empire = getEmpirePlanetsAndMoons();
        const listEl = document.getElementById('ls-cour-list');
        const originLabelEl = document.getElementById('ls-cour-origin-label');
        const ddEl = document.getElementById('ls-cour-origin-dd');
        const courModeBtn = document.getElementById('ls-cour-mode-btn');
        if (!listEl || !originLabelEl || !ddEl) return;

        if (courModeBtn) {
            updateModeBtnUI(courModeBtn, courierSettings.priorityMode || 'speed');
        }

        // Varsayılan çıkış noktası (Merkez): Sadece henüz hiç belirlenmemişse veya geçersizse VE aktif oturum yoksa bulunulan aktif gezegen/ayı seç
        const hasValidOrigin = courierSettings.originCoord && /^\d+:\d+:\d+$/.test(courierSettings.originCoord);
        const isSessionRunning = !!sessionStorage.getItem(KEYS.COURIER_RUN);
        if (empire.length > 0 && !hasValidOrigin && !isSessionRunning) {
            const cur = getCurrentActiveTarget(empire);
            if (cur) {
                courierSettings.originId = cur.id;
                courierSettings.originCoord = cur.coords;
                courierSettings.originType = cur.type;
                courierSettings.originName = cur.name;
                saveCourierSettings();
            }
        }

        // 1. Çıkış Buton Başlığı
        let originIcon = '🪐';
        if (courierSettings.originType === 3) originIcon = '🌕';
        let rawOriginTitle = courierSettings.originName || 'Merkez';
        let cleanOriginTitle = rawOriginTitle.replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        if (!cleanOriginTitle || cleanOriginTitle === 'Ay') {
            if (courierSettings.originType === 3) {
                const parentP = empire.find(p => p.coords === courierSettings.originCoord);
                cleanOriginTitle = parentP ? `${parentP.name} ( Ay )` : 'Ay ( Ay )';
            } else {
                cleanOriginTitle = 'Gezegen';
            }
        }
        if (courierSettings.originId === 'manual') {
            cleanOriginTitle = (courierSettings.originType === 3 ? 'Manuel Ay' : 'Manuel Gezegen');
        }

        originLabelEl.innerHTML = `<span><b>${originIcon} ${escapeHtml(cleanOriginTitle)}</b><span class="crd">${courierSettings.originCoord || ''}</span></span>`;

        // 2. Dropdown Listesi Doldur
        let ddHtml = '';
        empire.forEach(p => {
            const isPActive = (courierSettings.originCoord === p.coords && courierSettings.originType === 1);
            ddHtml += `<div class="ls-coll-dd-item ${isPActive ? 'active' : ''}" data-id="${p.id}" data-coord="${p.coords}" data-type="1" data-name="${escapeHtml(p.name)}">` +
                `<span>🪐 ${escapeHtml(p.name)}</span><span class="crd">${p.coords}</span></div>`;
            if (p.moon) {
                const isMActive = (courierSettings.originCoord === p.coords && courierSettings.originType === 3);
                const mTitle = p.moon.name || `${p.name} ( Ay )`;
                ddHtml += `<div class="ls-coll-dd-item moon ${isMActive ? 'active' : ''}" data-id="${p.moon.id}" data-coord="${p.coords}" data-type="3" data-name="${escapeHtml(mTitle)}">` +
                    `<span>🌕 ${escapeHtml(mTitle)}</span><span class="crd">${p.coords}</span></div>`;
            }
        });
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="1"><span>🪐 ${t('coll_manual_planet', 'Manuel Gezegen...')}</span><span></span></div>`;
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="3"><span>🌕 ${t('coll_manual_moon', 'Manuel Ay...')}</span><span></span></div>`;
        ddEl.innerHTML = ddHtml;

        // 3. Gemi & Genel Senkronizasyon Ayarlarını Eşitle
        const bnChk = document.getElementById('ls-cour-ship-bn');
        const knChk = document.getElementById('ls-cour-ship-kn');
        const rehberChk = document.getElementById('ls-cour-ship-rehber');
        const syncChk = document.getElementById('ls-cour-sync-chk');
        const syncM = document.getElementById('ls-cour-sync-m');
        const syncC = document.getElementById('ls-cour-sync-c');
        const syncD = document.getElementById('ls-cour-sync-d');

        if (bnChk) bnChk.checked = !!courierSettings.selectedShips.bn;
        if (knChk) knChk.checked = !!courierSettings.selectedShips.kn;
        if (rehberChk) rehberChk.checked = !!courierSettings.selectedShips.rehber;
        if (syncChk) syncChk.checked = !!courierSettings.syncEnabled;

        const syncAmt = courierSettings.syncAmount || { met: 0, cri: 0, deu: 0 };
        if (syncM && document.activeElement !== syncM) syncM.value = syncAmt.met > 0 ? fmt(syncAmt.met) : '';
        if (syncC && document.activeElement !== syncC) syncC.value = syncAmt.cri > 0 ? fmt(syncAmt.cri) : '';
        if (syncD && document.activeElement !== syncD) syncD.value = syncAmt.deu > 0 ? fmt(syncAmt.deu) : '';

        // 4. Gezegen & Ay Listesini Çiz
        let listHtml = '';
        if (empire.length === 0) {
            listHtml = '<div style="text-align:center;color:#8899aa;padding:20px;font-size:11px">Gezegen listesi okunuyor...<br>Lütfen OGame menüsünde gezinin.</div>';
        } else {
            empire.forEach(p => {
                const isOriginPlanet = (courierSettings.originCoord === p.coords && courierSettings.originType === 1);
                const pRes = getPlanetCachedResources(p.id);
                const pChecked = courierSettings.selectedItems[p.id] !== false;
                const pTarget = (courierSettings.targets && courierSettings.targets[p.id]) ? courierSettings.targets[p.id] : { met: 0, cri: 0, deu: 0 };

                listHtml += '<div class="ls-coll-grp">';

                if (isOriginPlanet) {
                    listHtml += `<div class="ls-coll-prow ls-coll-dest">` +
                        `<input type="checkbox" disabled>` +
                        `<div class="ls-coll-info">` +
                            `<div class="ls-coll-name"><b>${escapeHtml(p.name)}</b><span class="crd">${p.coords}</span></div>` +
                            `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(pRes.metal)}</span><span class="ls-coll-k">${formatShort(pRes.crystal)}</span><span class="ls-coll-d">${formatShort(pRes.deuterium)}</span></div>` +
                        `</div>` +
                        `<span class="ls-cour-origin-badge note">${t('cour_origin_badge', '📍 Dağıtım Merkezi')}</span>` +
                        `<button class="ls-coll-jump" data-cp="${p.id}" title="${t('coll_jump_hint', 'Gezegene geç')}">🚀</button>` +
                    `</div>`;
                } else {
                    listHtml += `<div class="ls-coll-prow">` +
                        `<input type="checkbox" class="ls-cour-item-chk" data-id="${p.id}" ${pChecked ? 'checked' : ''}>` +
                        `<div class="ls-coll-info">` +
                            `<div class="ls-coll-name"><b>${escapeHtml(p.name)}</b><span class="crd">${p.coords}</span></div>` +
                            `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(pRes.metal)}</span><span class="ls-coll-k">${formatShort(pRes.crystal)}</span><span class="ls-coll-d">${formatShort(pRes.deuterium)}</span></div>` +
                        `</div>` +
                        `<div class="ls-cour-inputs-wrap ls-cour-row-inputs">` +
                            `<input type="text" class="ls-cour-inp ls-cour-inp-m" data-id="${p.id}" data-res="met" value="${pTarget.met > 0 ? fmt(pTarget.met) : ''}" placeholder="M" title="Metal">` +
                            `<input type="text" class="ls-cour-inp ls-cour-inp-c" data-id="${p.id}" data-res="cri" value="${pTarget.cri > 0 ? fmt(pTarget.cri) : ''}" placeholder="K" title="Kristal">` +
                            `<input type="text" class="ls-cour-inp ls-cour-inp-d" data-id="${p.id}" data-res="deu" value="${pTarget.deu > 0 ? fmt(pTarget.deu) : ''}" placeholder="D" title="Deuterium">` +
                        `</div>` +
                        `<button class="ls-coll-jump" data-cp="${p.id}" title="${t('coll_jump_hint', 'Gezegene geç')}">🚀</button>` +
                    `</div>`;
                }

                if (p.moon) {
                    const isOriginMoon = (courierSettings.originCoord === p.coords && courierSettings.originType === 3);
                    const mRes = getPlanetCachedResources(p.moon.id);
                    const mChecked = courierSettings.selectedItems[p.moon.id] === true;
                    const mTarget = (courierSettings.targets && courierSettings.targets[p.moon.id]) ? courierSettings.targets[p.moon.id] : { met: 0, cri: 0, deu: 0 };
                    const mTitle = p.moon.name || `${p.name} ( Ay )`;

                    if (isOriginMoon) {
                        listHtml += `<div class="ls-coll-mrow ls-coll-dest">` +
                            `<input type="checkbox" disabled>` +
                            `<div class="ls-coll-info">` +
                                `<div class="ls-coll-name"><b>🌕 ${escapeHtml(mTitle)}</b></div>` +
                                `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(mRes.metal)}</span><span class="ls-coll-k">${formatShort(mRes.crystal)}</span><span class="ls-coll-d">${formatShort(mRes.deuterium)}</span></div>` +
                            `</div>` +
                            `<span class="ls-cour-origin-badge note">${t('cour_origin_badge', '📍 Dağıtım Merkezi')}</span>` +
                            `<button class="ls-coll-jump" data-cp="${p.moon.id}" title="${t('coll_jump_moon_hint', 'Aya geç')}">🚀</button>` +
                        `</div>`;
                    } else {
                        listHtml += `<div class="ls-coll-mrow">` +
                            `<input type="checkbox" class="ls-cour-item-chk" data-id="${p.moon.id}" ${mChecked ? 'checked' : ''}>` +
                            `<div class="ls-coll-info">` +
                                `<div class="ls-coll-name"><b>🌕 ${escapeHtml(mTitle)}</b></div>` +
                                `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(mRes.metal)}</span><span class="ls-coll-k">${formatShort(mRes.crystal)}</span><span class="ls-coll-d">${formatShort(mRes.deuterium)}</span></div>` +
                            `</div>` +
                            `<div class="ls-cour-inputs-wrap ls-cour-row-inputs">` +
                                `<input type="text" class="ls-cour-inp ls-cour-inp-m" data-id="${p.moon.id}" data-res="met" value="${mTarget.met > 0 ? fmt(mTarget.met) : ''}" placeholder="M" title="Metal">` +
                                `<input type="text" class="ls-cour-inp ls-cour-inp-c" data-id="${p.moon.id}" data-res="cri" value="${mTarget.cri > 0 ? fmt(mTarget.cri) : ''}" placeholder="K" title="Kristal">` +
                                `<input type="text" class="ls-cour-inp ls-cour-inp-d" data-id="${p.moon.id}" data-res="deu" value="${mTarget.deu > 0 ? fmt(mTarget.deu) : ''}" placeholder="D" title="Deuterium">` +
                            `</div>` +
                            `<button class="ls-coll-jump" data-cp="${p.moon.id}" title="${t('coll_jump_moon_hint', 'Aya geç')}">🚀</button>` +
                        `</div>`;
                    }
                }

                listHtml += '</div>';
            });
        }
        listEl.innerHTML = listHtml;

        // 5. Özet Bilgisini Hesapla ve Göster
        updateCourierSummary();
    }

    function updateCourierSummary() {
        const empire = getEmpirePlanetsAndMoons();
        const summaryEl = document.getElementById('ls-cour-summary');
        if (!summaryEl) return;

        let totalM = 0, totalC = 0, totalD = 0;
        let checkedCount = 0;

        empire.forEach(p => {
            const isOriginP = (courierSettings.originCoord === p.coords && courierSettings.originType === 1);
            if (!isOriginP && courierSettings.selectedItems[p.id] !== false) {
                const tData = (courierSettings.targets && courierSettings.targets[p.id]) || { met: 0, cri: 0, deu: 0 };
                const subM = tData.met || 0;
                const subC = tData.cri || 0;
                const subD = tData.deu || 0;
                if ((subM + subC + subD) > 0) checkedCount++;
                totalM += subM;
                totalC += subC;
                totalD += subD;
            }

            if (p.moon) {
                const isOriginM = (courierSettings.originCoord === p.coords && courierSettings.originType === 3);
                if (!isOriginM && courierSettings.selectedItems[p.moon.id] === true) {
                    const tData = (courierSettings.targets && courierSettings.targets[p.moon.id]) || { met: 0, cri: 0, deu: 0 };
                    const subM = tData.met || 0;
                    const subC = tData.cri || 0;
                    const subD = tData.deu || 0;
                    if ((subM + subC + subD) > 0) checkedCount++;
                    totalM += subM;
                    totalC += subC;
                    totalD += subD;
                }
            }
        });

        const totalCargo = totalM + totalC + totalD;

        // Çıkış üssünün kaynak yeterlilik kontrolü
        let originRes = { metal: 0, crystal: 0, deuterium: 0 };
        if (courierSettings.originId) {
            originRes = getPlanetCachedResources(courierSettings.originId);
        }
        const hasEnoughMet = (originRes.metal || 0) >= totalM;
        const hasEnoughCri = (originRes.crystal || 0) >= totalC;
        const hasEnoughDeu = (originRes.deuterium || 0) >= totalD;
        const isResourceSuff = (hasEnoughMet && hasEnoughCri && hasEnoughDeu);

        let statusText = '';
        if (totalCargo === 0) {
            statusText = `<span style="color:#8899aa">Tutar bekleniyor</span>`;
        } else if (isResourceSuff) {
            statusText = `<span style="color:#2ecc71">✔ Üs Kaynağı Yeterli</span>`;
        } else {
            statusText = `<span style="color:#f39c12" title="Metal: ${formatShort(originRes.metal)}/${formatShort(totalM)}, Kri: ${formatShort(originRes.crystal)}/${formatShort(totalC)}, Deu: ${formatShort(originRes.deuterium)}/${formatShort(totalD)}">⚠ Üs Stoğu Eksik</span>`;
        }

        summaryEl.innerHTML =
            '<div class="ls-cour-sum-row" style="font-size:11px">' +
                `<span style="color:#8899aa">${checkedCount} ${t('cour_planets_count', 'hedef seçili')}</span>` +
                `<span style="font-family:monospace;font-weight:bold"><span class="ls-coll-m">${formatShort(totalM)}</span> · <span class="ls-coll-k">${formatShort(totalC)}</span> · <span class="ls-coll-d">${formatShort(totalD)}</span></span>` +
            '</div>' +
            '<div class="ls-cour-sum-row ls-cour-sum-sub">' +
                `<span style="color:#8899aa">Kargo İhtiyacı: <b style="color:#00bcff;font-family:monospace">${formatShort(totalCargo)}</b></span>` +
                statusText +
            '</div>';
    }

    function applyCourierSyncToTargets() {
        const syncAmt = courierSettings.syncAmount || { met: 0, cri: 0, deu: 0 };
        const empire = getEmpirePlanetsAndMoons();
        if (!courierSettings.targets) courierSettings.targets = {};

        empire.forEach(p => {
            const isOriginP = (courierSettings.originCoord === p.coords && courierSettings.originType === 1);
            if (!isOriginP && courierSettings.selectedItems[p.id] !== false) {
                courierSettings.targets[p.id] = { met: syncAmt.met || 0, cri: syncAmt.cri || 0, deu: syncAmt.deu || 0 };
            }
            if (p.moon) {
                const isOriginM = (courierSettings.originCoord === p.coords && courierSettings.originType === 3);
                if (!isOriginM && courierSettings.selectedItems[p.moon.id] === true) {
                    courierSettings.targets[p.moon.id] = { met: syncAmt.met || 0, cri: syncAmt.cri || 0, deu: syncAmt.deu || 0 };
                }
            }
        });

        // DOM'daki girdi kutularını tazele
        const listEl = document.getElementById('ls-cour-list');
        if (listEl) {
            listEl.querySelectorAll('.ls-cour-inp').forEach(inp => {
                const id = inp.getAttribute('data-id');
                const res = inp.getAttribute('data-res');
                if (id && res && courierSettings.targets[id]) {
                    const val = courierSettings.targets[id][res];
                    inp.value = val > 0 ? fmt(val) : '';
                }
            });
        }
        saveCourierSettings();
        updateCourierSummary();
    }

    let courierEventsInitialized = false;
    function initCourierEvents() {
        if (courierEventsInitialized) return;
        courierEventsInitialized = true;

        const ddEl = document.getElementById('ls-cour-origin-dd');
        const originBtn = document.getElementById('ls-cour-origin-btn');

        const courCurBtn = document.getElementById('ls-cour-cur-btn');
        if (courCurBtn) {
            courCurBtn.addEventListener('click', () => {
                const cur = getCurrentActiveTarget(getEmpirePlanetsAndMoons());
                if (cur) {
                    courierSettings.originId = cur.id;
                    courierSettings.originCoord = cur.coords;
                    courierSettings.originType = cur.type;
                    courierSettings.originName = cur.name;
                    saveCourierSettings();
                    renderCourier();
                    showCollectorToast('📍 Merkez güncellendi: ' + (cur.type === 3 ? '🌕 ' : '🪐 ') + cur.name);
                }
            });
        }

        if (originBtn && ddEl) {
            originBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShown = ddEl.style.display === 'block' || ddEl.classList.contains('show');
                ddEl.style.display = isShown ? 'none' : 'block';
                ddEl.classList.toggle('show', !isShown);
            });

            document.addEventListener('click', (e) => {
                if (ddEl && !ddEl.contains(e.target) && !originBtn.contains(e.target)) {
                    ddEl.style.display = 'none';
                    ddEl.classList.remove('show');
                }
            });

            ddEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = e.target.closest('.ls-coll-dd-item');
                if (!item) return;

                if (item.classList.contains('ls-coll-dd-manual')) {
                    const reqType = parseInt(item.getAttribute('data-type'), 10) || 1;
                    const promptMsg = (reqType === 3)
                        ? 'Merkez olacak Ay koordinatını girin (Örn: 1:20:5):'
                        : 'Merkez olacak Gezegen koordinatını girin (Örn: 1:20:5):';
                    const manualCoord = window.prompt(promptMsg, courierSettings.originCoord || '');
                    if (manualCoord && /^\d+:\d+:\d+$/.test(manualCoord.trim())) {
                        courierSettings.originCoord = manualCoord.trim();
                        courierSettings.originType = reqType;
                        courierSettings.originId = 'manual';
                        courierSettings.originName = (reqType === 3 ? 'Manuel Ay' : 'Manuel Gezegen');
                        saveCourierSettings();
                        renderCourier();
                    }
                    ddEl.style.display = 'none';
                    ddEl.classList.remove('show');
                    return;
                }

                courierSettings.originId = item.getAttribute('data-id');
                courierSettings.originCoord = item.getAttribute('data-coord');
                courierSettings.originType = parseInt(item.getAttribute('data-type'), 10) || 1;
                courierSettings.originName = item.getAttribute('data-name');
                saveCourierSettings();
                ddEl.style.display = 'none';
                ddEl.classList.remove('show');
                renderCourier();
            });
        }

        // Görev Seçimi (Nakliye / Konuşlandır)
        const m3Btn = document.getElementById('ls-cour-mission-3');
        const m4Btn = document.getElementById('ls-cour-mission-4');
        if (m3Btn && m4Btn) {
            m3Btn.addEventListener('click', () => {
                courierSettings.mission = 3;
                m3Btn.classList.add('active');
                m4Btn.classList.remove('active');
                saveCourierSettings();
            });
            m4Btn.addEventListener('click', () => {
                courierSettings.mission = 4;
                m4Btn.classList.add('active');
                m3Btn.classList.remove('active');
                saveCourierSettings();
            });
        }

        // Öncelik Modu Butonu (Hız / Yakıt)
        const courModeBtn = document.getElementById('ls-cour-mode-btn');
        const updateCourModeUi = () => {
            updateModeBtnUI(courModeBtn, courierSettings.priorityMode || 'speed');
        };
        updateCourModeUi();
        if (courModeBtn && !courModeBtn.dataset.bound) {
            courModeBtn.dataset.bound = '1';
            courModeBtn.addEventListener('click', () => {
                courierSettings.priorityMode = (courierSettings.priorityMode === 'fuel') ? 'speed' : 'fuel';
                saveCourierSettings();
                updateCourModeUi();
                showCollectorToast(courierSettings.priorityMode === 'fuel' ? t('mode_fuel_toast') : t('mode_speed_toast'));
            });
        }

        // Gemi Seçimi Checkbox'ları
        ['bn', 'kn', 'rehber'].forEach(st => {
            const el = document.getElementById('ls-cour-ship-' + st);
            if (el) {
                el.addEventListener('change', () => {
                    if (!courierSettings.selectedShips) courierSettings.selectedShips = {};
                    courierSettings.selectedShips[st] = el.checked;
                    saveCourierSettings();
                    updateCourierSummary();
                });
            }
        });

        // Genel Dağıtım Senkronizasyonu Kontrolleri
        const syncChk = document.getElementById('ls-cour-sync-chk');
        if (syncChk) {
            syncChk.addEventListener('change', () => {
                courierSettings.syncEnabled = syncChk.checked;
                saveCourierSettings();
                if (syncChk.checked) {
                    applyCourierSyncToTargets();
                }
            });
        }

        const handleSyncInput = (resKey, inputEl) => {
            if (!inputEl) return;
            const updateVal = () => {
                const val = parseOgNum(inputEl.value);
                if (!courierSettings.syncAmount) courierSettings.syncAmount = { met: 0, cri: 0, deu: 0 };
                courierSettings.syncAmount[resKey] = val;
                saveCourierSettings();
                if (courierSettings.syncEnabled) {
                    applyCourierSyncToTargets();
                }
            };
            inputEl.addEventListener('input', updateVal);
            inputEl.addEventListener('blur', () => {
                const val = parseOgNum(inputEl.value);
                inputEl.value = val > 0 ? fmt(val) : '';
                updateVal();
            });
        };

        handleSyncInput('met', document.getElementById('ls-cour-sync-m'));
        handleSyncInput('cri', document.getElementById('ls-cour-sync-c'));
        handleSyncInput('deu', document.getElementById('ls-cour-sync-d'));

        const syncApplyBtn = document.getElementById('ls-cour-sync-apply');
        if (syncApplyBtn) {
            syncApplyBtn.addEventListener('click', () => {
                const mInp = document.getElementById('ls-cour-sync-m');
                const cInp = document.getElementById('ls-cour-sync-c');
                const dInp = document.getElementById('ls-cour-sync-d');
                if (!courierSettings.syncAmount) courierSettings.syncAmount = { met: 0, cri: 0, deu: 0 };
                if (mInp) courierSettings.syncAmount.met = parseOgNum(mInp.value);
                if (cInp) courierSettings.syncAmount.cri = parseOgNum(cInp.value);
                if (dInp) courierSettings.syncAmount.deu = parseOgNum(dInp.value);
                saveCourierSettings();
                applyCourierSyncToTargets();
                showCollectorToast('⚡ Tutarlar tüm seçili hedeflere uygulandı.');
            });
        }

        // Hızlı Seçim Butonları
        const empire = () => getEmpirePlanetsAndMoons();
        const setAllChecked = (fn) => {
            const emp = empire();
            if (!courierSettings.selectedItems) courierSettings.selectedItems = {};
            emp.forEach(p => {
                const isOriginP = (courierSettings.originCoord === p.coords && courierSettings.originType === 1);
                if (!isOriginP) courierSettings.selectedItems[p.id] = fn(p, false);
                if (p.moon) {
                    const isOriginM = (courierSettings.originCoord === p.coords && courierSettings.originType === 3);
                    if (!isOriginM) courierSettings.selectedItems[p.moon.id] = fn(p.moon, true);
                }
            });
            saveCourierSettings();
            renderCourier();
        };

        document.getElementById('ls-cour-sel-all')?.addEventListener('click', () => setAllChecked(() => true));
        document.getElementById('ls-cour-sel-planets')?.addEventListener('click', () => setAllChecked((item, isMoon) => !isMoon));
        document.getElementById('ls-cour-sel-moons')?.addEventListener('click', () => setAllChecked((item, isMoon) => isMoon));
        document.getElementById('ls-cour-sel-none')?.addEventListener('click', () => setAllChecked(() => false));

        // Liste İçi Dinamik Etkinlikler (Event Delegation)
        const listEl = document.getElementById('ls-cour-list');
        if (listEl) {
            listEl.addEventListener('change', (e) => {
                const chk = e.target.closest('.ls-cour-item-chk');
                if (chk) {
                    const id = chk.getAttribute('data-id');
                    if (!courierSettings.selectedItems) courierSettings.selectedItems = {};
                    courierSettings.selectedItems[id] = chk.checked;

                    // Eğer genel dağıtım aktifse ve yeni seçildiyse otomatik doldur
                    if (chk.checked && courierSettings.syncEnabled) {
                        const syncAmt = courierSettings.syncAmount || { met: 0, cri: 0, deu: 0 };
                        if (!courierSettings.targets) courierSettings.targets = {};
                        courierSettings.targets[id] = { met: syncAmt.met || 0, cri: syncAmt.cri || 0, deu: syncAmt.deu || 0 };
                        const row = chk.closest('.ls-coll-prow, .ls-coll-mrow');
                        if (row) {
                            const mInp = row.querySelector('.ls-cour-inp-m');
                            const cInp = row.querySelector('.ls-cour-inp-c');
                            const dInp = row.querySelector('.ls-cour-inp-d');
                            if (mInp) mInp.value = syncAmt.met > 0 ? fmt(syncAmt.met) : '';
                            if (cInp) cInp.value = syncAmt.cri > 0 ? fmt(syncAmt.cri) : '';
                            if (dInp) dInp.value = syncAmt.deu > 0 ? fmt(syncAmt.deu) : '';
                        }
                    }

                    saveCourierSettings();
                    updateCourierSummary();
                    return;
                }
            });

            listEl.addEventListener('input', (e) => {
                const inp = e.target.closest('.ls-cour-inp');
                if (inp) {
                    const id = inp.getAttribute('data-id');
                    const res = inp.getAttribute('data-res');
                    if (id && res) {
                        const val = parseOgNum(inp.value);
                        if (!courierSettings.targets) courierSettings.targets = {};
                        if (!courierSettings.targets[id]) courierSettings.targets[id] = { met: 0, cri: 0, deu: 0 };
                        courierSettings.targets[id][res] = val;
                        saveCourierSettings();
                        updateCourierSummary();
                    }
                }
            });

            listEl.addEventListener('blur', (e) => {
                const inp = e.target.closest('.ls-cour-inp');
                if (inp) {
                    const val = parseOgNum(inp.value);
                    inp.value = val > 0 ? fmt(val) : '';
                }
            }, true);

            listEl.addEventListener('click', (e) => {
                const jumpBtn = e.target.closest('.ls-coll-jump');
                if (jumpBtn) {
                    const cp = jumpBtn.getAttribute('data-cp');
                    if (cp) {
                        const comp = new URLSearchParams(window.location.search).get('component') || 'overview';
                        window.location.href = `/game/index.php?page=ingame&component=${comp}&cp=${cp}`;
                    }
                }
            });
        }

        // Dağıtımı Başlat Butonu
        const startBtn = document.getElementById('ls-cour-start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                startCourierSession();
            });
        }
    }

    function startCourierSession() {
        if (!courierSettings.originCoord || !courierSettings.originId) {
            showCollectorToast(t('cour_origin_head', 'Lütfen merkezi belirleyin!'));
            return;
        }

        const { bn, kn, rehber } = courierSettings.selectedShips || {};
        if (!bn && !kn && !rehber) {
            showCollectorToast(t('coll_ships', 'Lütfen en az bir gemi tipi seçin!'));
            return;
        }

        const empire = getEmpirePlanetsAndMoons();
        const queue = [];

        empire.forEach(p => {
            const isOriginP = (courierSettings.originCoord === p.coords && courierSettings.originType === 1);
            if (!isOriginP && courierSettings.selectedItems[p.id] !== false) {
                const tData = (courierSettings.targets && courierSettings.targets[p.id]) || { met: 0, cri: 0, deu: 0 };
                const subM = tData.met || 0;
                const subC = tData.cri || 0;
                const subD = tData.deu || 0;
                if ((subM + subC + subD) > 0) {
                    queue.push({
                        id: p.id,
                        name: p.name,
                        coords: p.coords,
                        type: 1,
                        isMoon: false,
                        met: subM,
                        cri: subC,
                        deu: subD
                    });
                }
            }

            if (p.moon) {
                const isOriginM = (courierSettings.originCoord === p.coords && courierSettings.originType === 3);
                if (!isOriginM && courierSettings.selectedItems[p.moon.id] === true) {
                    const tData = (courierSettings.targets && courierSettings.targets[p.moon.id]) || { met: 0, cri: 0, deu: 0 };
                    const subM = tData.met || 0;
                    const subC = tData.cri || 0;
                    const subD = tData.deu || 0;
                    if ((subM + subC + subD) > 0) {
                        queue.push({
                            id: p.moon.id,
                            name: p.moon.name || `${p.name} ( Ay )`,
                            coords: p.coords,
                            type: 3,
                            isMoon: true,
                            met: subM,
                            cri: subC,
                            deu: subD
                        });
                    }
                }
            }
        });

        if (queue.length === 0) {
            showCollectorToast(t('cour_no_resources', 'Lütfen gönderilecek maden miktarlarını girin ve hedefleri seçin!'));
            return;
        }

        const session = {
            originId: courierSettings.originId,
            originCoord: courierSettings.originCoord,
            originType: courierSettings.originType,
            originName: courierSettings.originName,
            mission: courierSettings.mission || 3,
            priorityMode: courierSettings.priorityMode || 'speed',
            selectedShips: { ...courierSettings.selectedShips, priorityMode: courierSettings.priorityMode || 'speed' },
            currentIndex: 0,
            queue: queue
        };

        sessionStorage.setItem(KEYS.COURIER_RUN, JSON.stringify(session));
        LS_LOGGER.action('COURIER', `Dağıtım oturumu başlatıldı: ${queue.length} hedef kuyruğa alındı. Merkez: [${session.originCoord}] ${session.originName}`);

        const firstItem = queue[0];
        const [g, s, p] = firstItem.coords.split(':');
        const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${session.originId}&galaxy=${g}&system=${s}&position=${p}&type=${firstItem.type}&mission=${session.mission || 3}`;
        window.location.href = url;
    }

    function checkAndRunCourierAssistant() {
        const rawSession = sessionStorage.getItem(KEYS.COURIER_RUN);
        if (!rawSession) return;

        let session;
        try {
            session = JSON.parse(rawSession);
        } catch (e) {
            sessionStorage.removeItem(KEYS.COURIER_RUN);
            return;
        }

        if (!session || !session.queue || session.currentIndex >= session.queue.length) {
            sessionStorage.removeItem(KEYS.COURIER_RUN);
            return;
        }

        const comp = new URLSearchParams(window.location.search).get('component');
        if (comp !== 'fleetdispatch') return;

        // Çıkış üssünde miyiz kontrol et (cp ve ay/gezegen tip kontrolü)
        if (session.originId && session.originId !== 'manual') {
            const currentCp = document.querySelector('meta[name="ogame-planet-id"]')?.getAttribute('content');
            const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
            const isCurrentOnMoon = (metaType === 'moon');
            const shouldBeOnMoon = (session.originType === 3);
            const typeMismatch = (isCurrentOnMoon !== shouldBeOnMoon);

            if ((currentCp && String(currentCp) !== String(session.originId)) || typeMismatch) {
                LS_LOGGER.dispatch('COURIER', `Merkeze geçiliyor (cp: ${session.originId}, tip: ${session.originType})...`);
                const currentItem = session.queue[session.currentIndex];
                const [g, s, p] = currentItem.coords.split(':');
                const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${session.originId}&galaxy=${g}&system=${s}&position=${p}&type=${currentItem.type}&mission=${session.mission || 3}`;
                window.location.href = url;
                return;
            }
        }

        // Filo formu veya Step 2 hazır olana kadar bekle
        let pollCount = 0;
        const pollTimer = setInterval(() => {
            pollCount++;
            const fleetForm = document.getElementById('fleet1') || document.querySelector('form[name="shipsAlternative"]') || document.querySelector('#shipsAlternative');
            const hasInputs = Array.from(document.querySelectorAll('input.military, input.civil, input[name^="am"]')).length > 0;
            const sendBtn = findSendFleetButton();
            const isStep2Direct = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');

            if ((fleetForm && hasInputs) || isStep2Direct || pollCount > 30) {
                clearInterval(pollTimer);
                setTimeout(() => {
                    const currentItem = session.queue[session.currentIndex];
                    executeCourierDispatchStep(session, currentItem);
                }, 350);
            }
        }, 150);
    }

    function executeCourierDispatchStep(session, currentItem) {
        if (!session || !currentItem) return;

        const shipCaps = calculateShipCapacities();
        const totalCargoNeeded = (currentItem.met || 0) + (currentItem.cri || 0) + (currentItem.deu || 0);

        const liveRes = getLiveResources();
        const availMet = liveRes.metal || 0;
        const availCri = liveRes.crystal || 0;
        const availDeu = liveRes.deuterium || 0;

        const selectedShips = session.selectedShips || { bn: true, kn: true, rehber: false };
        const shipCounts = calculateSmartCargoFleet(totalCargoNeeded, selectedShips);
        const bnCount = shipCounts.bn;
        const knCount = shipCounts.kn;
        const rehberCount = shipCounts.rehber;
        const totalCap = shipCounts.totalCap;

        let metLoad = Math.min(currentItem.met || 0, availMet);
        let criLoad = Math.min(currentItem.cri || 0, availCri);
        let deuLoad = Math.min(currentItem.deu || 0, availDeu);

        // Eğer toplam yük kapasiteyi aşıyorsa kapasiteye sığdır
        let totalLoad = metLoad + criLoad + deuLoad;
        if (totalLoad > totalCap && totalCap > 0) {
            if (metLoad > totalCap) {
                metLoad = totalCap;
                criLoad = 0;
                deuLoad = 0;
            } else if (metLoad + criLoad > totalCap) {
                criLoad = totalCap - metLoad;
                deuLoad = 0;
            } else {
                deuLoad = totalCap - metLoad - criLoad;
            }
        }

        const missingCargo = Math.max(0, totalCargoNeeded - totalCap);
        const missingMet = Math.max(0, (currentItem.met || 0) - availMet);
        const missingCri = Math.max(0, (currentItem.cri || 0) - availCri);
        const missingDeu = Math.max(0, (currentItem.deu || 0) - availDeu);
        const hasAnyShortage = (missingCargo > 0 || missingMet > 0 || missingCri > 0 || missingDeu > 0 || totalCap === 0);

        // Gemi miktarlarını yaz
        setShipAmount(203, bnCount);
        setShipAmount(202, knCount);
        setShipAmount(219, rehberCount);

        // Hedef koordinatları
        const [g, s, p] = currentItem.coords.split(':');
        setFleetTargetCoords(g, s, p, currentItem.type);

        let isStepCancelled = false;

        const updateCourierBannerReady = () => {
            const btn = document.getElementById('ls-banner-send-btn');
            if (btn) {
                const sendBtn = findSendFleetButton();
                const isSendBtnDisabled = sendBtn && (sendBtn.classList.contains('off') || sendBtn.classList.contains('disabled') || sendBtn.hasAttribute('disabled'));
                const hasError = Array.from(document.querySelectorAll('#fleet2 p, #fleet2 span, #fleet2 div')).some(el => (el.textContent || '').includes('Bu görevi başlatamazsın'));

                if (isSendBtnDisabled || hasError) {
                    btn.disabled = false;
                    btn.style.background = '#e67e22';
                    btn.style.color = '#fff';
                    btn.style.cursor = 'pointer';
                    btn.innerText = '⚠️ Hedefi Tekrar Dene';
                } else {
                    btn.disabled = false;
                    btn.style.background = '#27ae60';
                    btn.style.color = '#fff';
                    btn.style.cursor = 'pointer';
                    btn.innerText = '🚀 ' + t('coll_hud_send') + ' (Space)';
                }
            }
        };

        const prepareStep2 = () => {
            if (isStepCancelled) return;
            const missionId = session.mission || 3;

            setFleetTargetCoords(g, s, p, currentItem.type);
            setFleetMission(missionId);
            fillFleetResources(metLoad, criLoad, deuLoad);

            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SELECT_MISSION', missionId: missionId }
            }));
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'CARGO_REFRESH' }
            }));

            let checkCount = 0;
            let readyStreak = 0;
            const step2CheckTimer = setInterval(() => {
                if (isStepCancelled) {
                    clearInterval(step2CheckTimer);
                    return;
                }
                checkCount++;

                // Hedef koordinatların ve tipin doğruluğunu kontrol et
                const galInp = document.getElementById('galaxy') || document.querySelector('input[name="galaxy"]');
                const sysInp = document.getElementById('system') || document.querySelector('input[name="system"]');
                const posInp = document.getElementById('position') || document.querySelector('input[name="position"]');
                const typeInp = document.getElementById('type') || document.querySelector('input[name="type"]');

                const targetType = parseInt(currentItem.type, 10) || 1;
                const coordsMatch = galInp && sysInp && posInp &&
                                    String(galInp.value).trim() === String(g).trim() &&
                                    String(sysInp.value).trim() === String(s).trim() &&
                                    String(posInp.value).trim() === String(p).trim();

                let typeMatch = true;
                if (typeInp && String(typeInp.value).trim() !== String(targetType).trim()) {
                    typeMatch = false;
                }
                if (targetType === 3) {
                    const moonBtn = document.querySelector('#mbutton, [data-type="3"], [data-planet-type="3"], #fleet2 .moon, #fleet2 .planetType .moon');
                    if (moonBtn && !moonBtn.classList.contains('selected') && !moonBtn.classList.contains('active')) {
                        typeMatch = false;
                    }
                } else if (targetType === 1) {
                    const planetBtn = document.querySelector('#pbutton, [data-type="1"], [data-planet-type="1"], #fleet2 .planet, #fleet2 .planetType .planet');
                    if (planetBtn && !planetBtn.classList.contains('selected') && !planetBtn.classList.contains('active')) {
                        typeMatch = false;
                    }
                }

                if (!coordsMatch || !typeMatch || checkCount <= 3) {
                    setFleetTargetCoords(g, s, p, currentItem.type);
                }

                const mBtn = document.querySelector('#missionButton' + missionId + ', [data-mission="' + missionId + '"]');
                const isMissionActive = mBtn && (mBtn.classList.contains('selected') || mBtn.classList.contains('active'));
                if (!isMissionActive) setFleetMission(missionId);
                fillFleetResources(metLoad, criLoad, deuLoad);

                const sendBtn = findSendFleetButton();
                const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                const isSendBtnDisabled = sendBtn && (sendBtn.classList.contains('off') || sendBtn.classList.contains('disabled') || sendBtn.hasAttribute('disabled'));

                const missionError = document.querySelector('.fleet_dispatch_error, .dispatchError, #missionError, #fleet2 .error') ||
                                     Array.from(document.querySelectorAll('#fleet2 p, #fleet2 span, #fleet2 div')).find(el => (el.textContent || '').includes('Bu görevi başlatamazsın'));

                const isActuallyReady = coordsMatch && typeMatch && isMissionActive && isSendBtnVisible && !isSendBtnDisabled && !missionError;

                if (isActuallyReady) {
                    readyStreak++;
                } else {
                    readyStreak = 0;
                }

                if (readyStreak >= 2 || checkCount > 30) {
                    clearInterval(step2CheckTimer);
                    updateCourierBannerReady();
                }
            }, 100);
        };

        // Eğer sayfa zaten Step 2'deyse doğrudan Step 2 hazırlığına geç
        const devamBtnInit = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
        const isStep1ActiveInit = devamBtnInit && (devamBtnInit.offsetWidth > 0 || window.getComputedStyle(devamBtnInit).display !== 'none');
        const sendBtnInit = findSendFleetButton();
        const isSendBtnVisibleInit = sendBtnInit && (sendBtnInit.offsetWidth > 0 || window.getComputedStyle(sendBtnInit).display !== 'none');
        const isAlreadyOnStep2 = !isStep1ActiveInit && isSendBtnVisibleInit;

        let ensureShipsTimer = null;
        if (isAlreadyOnStep2) {
            setTimeout(prepareStep2, 100);
        } else {
            const targetShipTotal = bnCount + knCount + rehberCount;
            if (targetShipTotal > 0) {
                let shipTries = 0;
                ensureShipsTimer = setInterval(() => {
                    if (isStepCancelled) {
                        clearInterval(ensureShipsTimer);
                        return;
                    }
                    shipTries++;
                    const { total } = getSelectedShipsSummary();
                    if (total > 0 || shipTries > 6) {
                        clearInterval(ensureShipsTimer);
                        setTimeout(() => {
                            if (isStepCancelled) return;
                            clickDevamButton();
                            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                                detail: { type: 'SUBMIT_FLEET1' }
                            }));

                            let step2Tries = 0;
                            const step2Interval = setInterval(() => {
                                if (isStepCancelled) {
                                    clearInterval(step2Interval);
                                    return;
                                }
                                step2Tries++;
                                const devamBtn = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
                                const isStep1StillActive = devamBtn && (devamBtn.offsetWidth > 0 || window.getComputedStyle(devamBtn).display !== 'none');
                                const sendBtn = findSendFleetButton();
                                const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                                const isStep2Active = !isStep1StillActive && isSendBtnVisible;

                                if (isStep2Active) {
                                    clearInterval(step2Interval);
                                    setTimeout(prepareStep2, 100);
                                } else {
                                    if (step2Tries % 5 === 0) {
                                        clickDevamButton();
                                        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                                            detail: { type: 'SUBMIT_FLEET1' }
                                        }));
                                    }
                                    if (step2Tries > 30) {
                                        clearInterval(step2Interval);
                                        setTimeout(prepareStep2, 100);
                                    }
                                }
                            }, 100);
                        }, 200);
                    } else {
                        setShipAmount(203, bnCount);
                        setShipAmount(202, knCount);
                        setShipAmount(219, rehberCount);
                    }
                }, 150);
            }
        }

        // Asistan Banner'ını Çiz
        renderCourierAssistantBanner(session, currentItem, {
            bn: bnCount, kn: knCount, rehber: rehberCount,
            deu: deuLoad, cri: criLoad, met: metLoad,
            totalCap: totalCap,
            totalCargoNeeded: totalCargoNeeded,
            missingCargo: missingCargo,
            missingMet: missingMet,
            missingCri: missingCri,
            missingDeu: missingDeu,
            hasAnyShortage: hasAnyShortage,
            g: g, s: s, p: p,
            prepareStep2: prepareStep2,
            cancel: () => {
                isStepCancelled = true;
                if (ensureShipsTimer) clearInterval(ensureShipsTimer);
            }
        });
    }

    function renderCourierAssistantBanner(session, currentItem, details) {
        let banner = document.getElementById('ls-cour-floating-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'ls-cour-floating-banner';
            document.body.appendChild(banner);
        }

        const totalItems = session.queue.length;
        const currentStep = session.currentIndex + 1;
        const hasShips = details.totalCap > 0;
        const missionName = (session.mission === 4 ? '🛡️ ' + t('cour_deploy') : '🚚 ' + t('cour_transport'));

        let shipDesc = [];
        if (details.bn > 0) shipDesc.push(details.bn + ' ' + t('cour_bn'));
        if (details.kn > 0) shipDesc.push(details.kn + ' ' + t('cour_kn'));
        if (details.rehber > 0) shipDesc.push(details.rehber + ' ' + t('cour_rehber'));
        const shipText = shipDesc.length > 0 ? shipDesc.join(', ') : '<span style="color:#e74c3c">' + t('coll_hud_no_ships') + '</span>';

        const cleanTName = (currentItem.name || '').replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        const displayTargetIcon = currentItem.isMoon ? '🌕' : '🪐';
        const displayOriginIcon = session.originType === 3 ? '🌕' : '🪐';

        banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(13,27,42,0.96);border:2px solid #2980b9;box-shadow:0 10px 32px rgba(0,0,0,0.85);border-radius:8px;padding:12px 18px;min-width:400px;max-width:90vw;z-index:9999999;font-family:sans-serif;color:#d1d8e0;text-align:center;box-sizing:border-box';

        // Yetersiz Kapasite veya Kaynak Uyarısı
        let warningHtml = '';
        const hasShortage = !!details.hasAnyShortage;
        if (hasShortage) {
            let reasons = [];
            if (details.totalCap === 0) {
                reasons.push(t('coll_hud_no_ships'));
            } else if (details.missingCargo > 0) {
                reasons.push(`${t('coll_hud_cap_shortage')} (${formatShort(details.missingCargo)})`);
            }
            if (details.missingMet > 0) reasons.push(`${t('coll_met')} ${formatShort(details.missingMet)} eksik`);
            if (details.missingCri > 0) reasons.push(`${t('coll_crys')} ${formatShort(details.missingCri)} eksik`);
            if (details.missingDeu > 0) reasons.push(`${t('coll_deut')} ${formatShort(details.missingDeu)} eksik`);

            warningHtml =
                '<div id="ls-cour-warning-box" style="background:rgba(231,76,60,0.22);border:1px solid #e74c3c;border-radius:4px;padding:6px 8px;margin-bottom:8px;font-size:11px;color:#ff6b6b;text-align:left">' +
                    '<div style="font-weight:bold;margin-bottom:2px">' + t('cart_hud_shortage_title', '⚠️ Yetersiz Kaynak veya Gemi Kapasitesi!') + '</div>' +
                    '<div style="font-size:10.5px;color:#f5b7b1;margin-bottom:6px">' + reasons.join(' · ') + '</div>' +
                    '<div style="display:flex;gap:6px;justify-content:center">' +
                        '<button id="ls-cour-stop-btn" style="background:#e74c3c;color:#fff;border:none;padding:4px 9px;border-radius:3px;font-weight:bold;font-size:10.5px;cursor:pointer">' + t('cart_hud_stop_btn', '⏹️ Dağıtımı Durdur') + '</button>' +
                        '<button id="ls-cour-proceed-btn" style="background:#f39c12;color:#000;border:none;padding:4px 9px;border-radius:3px;font-weight:bold;font-size:10.5px;cursor:pointer">' + t('cart_hud_proceed_btn', '⏩ Olduğu Kadar Gönder (Devam Et)') + '</button>' +
                    '</div>' +
                '</div>';
        }

        banner.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a2c3f;padding-bottom:6px;margin-bottom:8px">' +
                '<span style="font-size:12px;font-weight:bold;color:#2980b9">📬 ' + t('cour_hud_title', 'Postacı Asistanı') + ' [' + currentStep + ' / ' + totalItems + ']</span>' +
                '<span style="font-size:11px;color:#fff">' + displayOriginIcon + ' ' + escapeHtml(session.originName || 'Üs') + ' ➔ ' + displayTargetIcon + ' ' + escapeHtml(cleanTName) + ' <span style="color:#ffbe3b;font-family:monospace">[' + currentItem.coords + ']</span></span>' +
            '</div>' +
            warningHtml +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">' +
                '<div><b style="color:#8899aa">' + t('coll_hud_selected_fleet') + '</b> <span style="font-weight:bold">' + shipText + '</span></div>' +
                '<div style="font-size:10.5px;color:#00bcff;font-weight:bold">' + missionName + '</div>' +
            '</div>' +
            '<div style="font-size:11.5px;font-family:monospace;margin-bottom:10px">' +
                '<b style="color:#8899aa">' + t('cour_hud_cargo', 'Taşınan:') + '</b> ' +
                '<span style="color:#ffbe3b">' + formatShort(details.met) + ' ' + t('coll_met') + '</span> · ' +
                '<span style="color:#5dade2">' + formatShort(details.cri) + ' ' + t('coll_crys') + '</span> · ' +
                '<span style="color:#2ecc71">' + formatShort(details.deu) + ' ' + t('coll_deut') + '</span>' +
            '</div>' +
            '<div id="ls-cour-hud-controls" style="display:flex;gap:6px;justify-content:center;align-items:center;' + (hasShortage ? 'display:none;' : '') + '">' +
                (hasShips ?
                    '<button id="ls-banner-send-btn" disabled style="background:#445566;color:#8899aa;border:none;padding:5px 12px;border-radius:4px;font-weight:bold;font-size:11px;cursor:not-allowed">' + t('exp_hud_preparing') + '</button>'
                    : '<button class="ls-banner-skip-btn" style="background:#f39c12;color:#000;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ ' + t('coll_hud_skip') + ' (Space)</button>') +
                '<button id="ls-banner-retry-btn" style="background:#e67e22;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer" title="' + t('coll_hud_retry') + '">🔄 ' + t('coll_hud_retry') + '</button>' +
                (hasShips ? '<button class="ls-banner-skip-btn" style="background:#34495e;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ ' + t('coll_hud_skip') + '</button>' : '') +
                '<button id="ls-banner-cancel-btn" style="background:#e74c3c;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏹️ ' + t('coll_hud_cancel') + '</button>' +
            '</div>';

        const sendFleet = () => {
            const sendBtnEl = document.getElementById('ls-banner-send-btn');
            if (sendBtnEl && sendBtnEl.disabled) return;

            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }

            const sendBtn = findSendFleetButton();
            const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
            const isSendBtnDisabled = sendBtn && (sendBtn.classList.contains('off') || sendBtn.classList.contains('disabled') || sendBtn.hasAttribute('disabled'));
            const hasMissionError = Array.from(document.querySelectorAll('#fleet2 p, #fleet2 span, #fleet2 div')).some(el => (el.textContent || '').includes('Bu görevi başlatamazsın'));

            if (isSendBtnVisible && !isSendBtnDisabled && !hasMissionError) {
                dispatchSendFleetButton();
            } else if (isSendBtnVisible) {
                if (sendBtnEl) {
                    sendBtnEl.disabled = true;
                    sendBtnEl.style.background = '#e67e22';
                    sendBtnEl.innerText = '⏳ Hedef Doğrulanıyor...';
                }
                const [g, s, p] = currentItem.coords.split(':');
                setFleetTargetCoords(g, s, p, currentItem.type);
                setFleetMission(session.mission || 3);
                fillFleetResources(details.met, details.cri, details.deu);
                if (typeof details.prepareStep2 === 'function') {
                    setTimeout(details.prepareStep2, 200);
                }
            } else {
                clickDevamButton();
                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                    detail: { type: 'SUBMIT_FLEET1' }
                }));
                if (typeof details.prepareStep2 === 'function') {
                    details.prepareStep2();
                }
            }
        };

        const retryCurrentStep = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#e67e22;padding:6px;font-weight:bold">🔄 Adım yeniden deneniyor...</div>';
            }
            const [g, s, p] = currentItem.coords.split(':');
            const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${session.originId}&galaxy=${g}&system=${s}&position=${p}&type=${currentItem.type}&mission=${session.mission || 3}`;
            window.location.href = url;
        };

        const dispatchSendFleetButton = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();

            // 1. Gönderilen hedefi Postacı ayarlarında uncheck yap
            if (!courierSettings.selectedItems) courierSettings.selectedItems = {};
            courierSettings.selectedItems[currentItem.id] = false;
            saveCourierSettings();
            renderCourier();

            // 2. Oturum kuyruğunu bir sonraki adıma geçir ve kaydet
            session.currentIndex++;
            sessionStorage.setItem(KEYS.COURIER_RUN, JSON.stringify(session));

            LS_LOGGER.dispatch('COURIER', `Postacı filosu gönderiliyor: Üs [${session.originCoord}] -> Hedef: ${currentItem.name} [${currentItem.coords}] (Adım ${session.currentIndex}/${session.queue.length})`);

            if (banner) {
                banner.innerHTML =
                    '<div style="font-size:12px;color:#2ecc71;padding:8px;font-weight:bold">' +
                        '🚀 Filo gönderildi! Sıradaki hedefe geçiliyor...' +
                    '</div>';
            }

            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SUBMIT_FLEET2' }
            }));

            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const [ng, ns, np] = nextItem.coords.split(':');
                    const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${session.originId}&galaxy=${ng}&system=${ns}&position=${np}&type=${nextItem.type}&mission=${session.mission || 3}`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.COURIER_RUN);
                    if (banner) banner.remove();
                    showCollectorToast('🎉 Tebrikler! Tüm dağıtım filoları başarıyla gönderildi.', 6000);
                }
            }, 800);
        };

        const proceedToNext = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();

            // Atlanan hedefi uncheck yap
            if (!courierSettings.selectedItems) courierSettings.selectedItems = {};
            courierSettings.selectedItems[currentItem.id] = false;
            saveCourierSettings();
            renderCourier();

            session.currentIndex++;
            sessionStorage.setItem(KEYS.COURIER_RUN, JSON.stringify(session));

            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#f39c12;padding:6px">⏭️ Hedef atlandı, sıradakine geçiliyor...</div>';
            }

            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const [ng, ns, np] = nextItem.coords.split(':');
                    const url = `/game/index.php?page=ingame&component=fleetdispatch&cp=${session.originId}&galaxy=${ng}&system=${ns}&position=${np}&type=${nextItem.type}&mission=${session.mission || 3}`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.COURIER_RUN);
                    if (banner) banner.remove();
                    showCollectorToast('🎉 Postacı asistanı tamamlandı.', 5000);
                }
            }, 400);
        };

        const cancel = () => {
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            LS_LOGGER.warn('COURIER', 'Dağıtım işlemi iptal edildi.');
            sessionStorage.removeItem(KEYS.COURIER_RUN);
            if (banner) banner.remove();
            showCollectorToast('Dağıtım işlemi iptal edildi.', 3000);
        };

        const keyListener = (e) => {
            if (e.repeat) return;
            if (e.code === 'Space' || e.key === ' ') {
                const tag = document.activeElement ? document.activeElement.tagName : '';
                if (tag === 'TEXTAREA' || tag === 'SELECT') return;
                if (tag === 'INPUT') {
                    if (document.activeElement.id && document.activeElement.id.includes('search')) return;
                    document.activeElement.blur();
                }
                const wBox = document.getElementById('ls-cour-warning-box');
                if (wBox && wBox.style.display !== 'none') return;

                const sendBtnEl = document.getElementById('ls-banner-send-btn');
                if (hasShips && sendBtnEl && sendBtnEl.disabled) return;

                e.preventDefault();
                if (hasShips) {
                    sendFleet();
                } else {
                    proceedToNext();
                }
            }
        };

        window.addEventListener('keydown', keyListener);

        document.getElementById('ls-banner-send-btn')?.addEventListener('click', sendFleet);
        document.getElementById('ls-banner-retry-btn')?.addEventListener('click', retryCurrentStep);
        banner.querySelectorAll('.ls-banner-skip-btn').forEach(btn => btn.addEventListener('click', proceedToNext));
        document.getElementById('ls-banner-cancel-btn')?.addEventListener('click', cancel);

        document.getElementById('ls-cour-stop-btn')?.addEventListener('click', cancel);
        document.getElementById('ls-cour-proceed-btn')?.addEventListener('click', () => {
            const warningBox = document.getElementById('ls-cour-warning-box');
            if (warningBox) warningBox.style.display = 'none';
            const controls = document.getElementById('ls-cour-hud-controls');
            if (controls) controls.style.display = 'flex';
        });
    }

    // ============================================================
    // KEŞİF ASİSTANI (EXPEDITION ASSISTANT)
    // ============================================================
    function getGameSelects() {
        return Array.from(document.querySelectorAll('select')).filter(s => !s.closest('#ls-panel'));
    }

    function isValidTemplateName(txt) {
        if (!txt) return false;
        const t = txt.trim();
        if (t.length === 0 || t.length > 30) return false;
        if (t === '-' || t === '--' || t === '---') return false;
        if (/^[-—_\s]+$/.test(t)) return false;
        if (/^\d+$/.test(t)) return false; // Sadece rakam olan indeksler
        if (/^\d+[\.\,]\d+$/.test(t)) return false; // Gemi sayısı (örn: 4.050, 42.922)
        if (t.includes(':') || t.includes('[') || t.includes(']')) return false; // Koordinat veya etiketler (Görev:, FB_121[1:457:9])

        const lower = t.toLowerCase();
        const bannedExact = [
            'keşif', 'kesif', 'keşif filosu', 'kesif filosu',
            'standart filo', 'standard fleet', 'standart', 'standard',
            'sonsuz uzaklar', 'görev', 'hedef', 'oyuncu adı', 'oyuncu',
            'yeni şablon oluştur', 'yeni şablon', 'create new template',
            'actions', 'aksiyonlar', 'isim', 'name', 'api', 'düzenle', 'sil',
            'nakliye', 'saldırı', 'casusluk', 'koloni', 'harabe', 'filo',
            'görev yok', 'asistan', 'luckystrike', 'sefer', 'saat', 'hız'
        ];
        if (bannedExact.includes(lower)) return false;
        if (lower.includes('serbest')) return false; // "--- serbest ---"
        if (lower.includes('lucky') || lower.includes('asistan')) return false;
        return true;
    }

    function scanAndSaveExpeditionTemplates() {
        const templates = [];
        const seenNames = new Set();

        function addTpl(id, name) {
            if (!isValidTemplateName(name)) return;
            const clean = name.trim();
            const lower = clean.toLowerCase();
            if (!seenNames.has(lower)) {
                seenNames.add(lower);
                templates.push({ id: String(id || templates.length + 1), name: clean, group: 'Keşif' });
            }
        }

        // 1. "Keşif filosu" etiketini ve satırını bul
        const allLeafs = Array.from(document.querySelectorAll('#fleet1 *, #fleetdispatchcomponent *, body *')).filter(el => {
            if (el.closest('#ls-panel, #menuTable, #links, #header, #siteHeader, #bar, #chatBar')) return false;
            return el.children.length === 0 && (el.textContent || '').trim().length > 0;
        });

        let expRow = null;
        for (const el of allLeafs) {
            const txt = el.textContent.trim().toLowerCase();
            if (txt === 'keşif filosu' || txt === 'kesif filosu') {
                expRow = el.closest('tr, li, div') || el.parentElement;
                break;
            }
        }

        if (expRow) {
            // A. expRow içindeki tüm <select> etiketlerinin <option>'larını tara
            const selects = expRow.querySelectorAll('select');
            for (const sel of selects) {
                for (let i = 0; i < sel.options.length; i++) {
                    const opt = sel.options[i];
                    addTpl(opt.value || i, opt.textContent);
                }
            }

            // B. expRow içindeki dropdown ve data öğelerini tara
            const items = expRow.querySelectorAll('li, a, span, div, [data-value], [data-name]');
            for (const item of items) {
                if (item.children.length > 0) continue;
                const val = item.getAttribute('data-value') || item.getAttribute('data-id') || item.getAttribute('data-technology');
                addTpl(val, item.textContent);
            }
        }

        // 2. Yalnızca ilk öğesi '-' olan dropdown menüleri tara
        const menus = Array.from(document.querySelectorAll('.dropdown, [class*="dropdown"], [class*="selectmenu"], [class*="popup"], .modal')).filter(c => !c.closest('#ls-panel'));
        for (const m of menus) {
            const leaves = Array.from(m.querySelectorAll('li, a, span, td, option')).filter(l => l.children.length === 0);
            const hasDash = leaves.some(l => l.textContent.trim() === '-');
            if (hasDash) {
                for (const leaf of leaves) {
                    const val = leaf.getAttribute('data-value') || leaf.getAttribute('data-id');
                    addTpl(val, leaf.textContent);
                }
            }
        }

        if (templates.length > 0) {
            localStorage.setItem(KEYS.EXPEDITION_TEMPLATES, JSON.stringify(templates));
        }

        // MAIN World köprüsünden de tarama iste
        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SCAN_TEMPLATES' }
        }));

        return templates;
    }

    function getSavedExpeditionTemplates() {
        const live = scanAndSaveExpeditionTemplates();
        if (live.length > 0) return live;
        const saved = JSON.parse(localStorage.getItem(KEYS.EXPEDITION_TEMPLATES) || '[]');
        return saved.filter(t => isValidTemplateName(t.name));
    }

    function findExpeditionDropdownTrigger() {
        const all = Array.from(document.querySelectorAll('#fleet1 *, #fleetdispatchcomponent *')).filter(el => !el.closest('#ls-panel'));
        for (const el of all) {
            if (el.children.length === 0) {
                const txt = (el.textContent || '').trim().toLowerCase();
                if (txt === 'keşif filosu' || txt === 'kesif filosu') {
                    const row = el.closest('tr, li, div') || el.parentElement;
                    if (row) {
                        const trigger = Array.from(row.querySelectorAll('.dropdown, [class*="select"], [class*="dropdown"], [class*="combobox"], a, span, div')).find(item => {
                            if (item.classList.contains('icon') || item.querySelector('.icon')) return false;
                            const t = (item.textContent || '').trim().toLowerCase();
                            return t.indexOf('keşif filosu') === -1;
                        });
                        if (trigger && trigger.offsetHeight > 0) return trigger;
                    }
                    if (el.nextElementSibling && el.nextElementSibling.offsetHeight > 0) return el.nextElementSibling;
                }
            }
        }
        return null;
    }

    function findAndSelectExpeditionTemplate(targetIdOrIndex, targetName) {
        const idNum = parseInt(targetIdOrIndex, 10) || 1;
        const nameLower = (targetName || '').trim().toLowerCase();
        let success = false;

        // Seçim tamamen MAIN world (bridge.js) tarafında yapılır:
        // gerçek <select> option metninden bulunur, OGame dropdown anchor'ı tıklanır ve doğrulanır.
        if (!nameLower) {
            const savedTpls = JSON.parse(localStorage.getItem(KEYS.EXPEDITION_TEMPLATES) || '[]');
            const m = savedTpls.find(t => String(t.id) === String(targetIdOrIndex)) || savedTpls[idNum - 1];
            if (m && m.name) targetName = m.name;
        }

        const expSel = document.querySelector('select#expeditionfleet, select[name="expeditionfleet"]') ||
                       Array.from(document.querySelectorAll('select')).find(s => {
                           const txt = (s.parentElement?.innerText || '').toLowerCase();
                           return txt.includes('keşif filosu') || txt.includes('kesif filosu');
                       });
        if (expSel) {
            for (let i = 0; i < expSel.options.length; i++) {
                const optText = (expSel.options[i].text || '').trim().toLowerCase();
                if (optText === (targetName || '').trim().toLowerCase() || expSel.options[i].value === String(idNum)) {
                    expSel.selectedIndex = i;
                    expSel.value = expSel.options[i].value;
                    expSel.dispatchEvent(new Event('input', { bubbles: true }));
                    expSel.dispatchEvent(new Event('change', { bubbles: true }));
                    break;
                }
            }
        }

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SELECT_TEMPLATE', id: idNum, name: targetName }
        }));
        if (targetName) return true;

        const triggerFullClick = (el) => {
            if (!el) return;
            const opts = { bubbles: true, cancelable: true, view: window };
            try { el.dispatchEvent(new PointerEvent('pointerdown', opts)); } catch(e) {}
            try { el.dispatchEvent(new MouseEvent('mousedown', opts)); } catch(e) {}
            try { el.dispatchEvent(new PointerEvent('pointerup', opts)); } catch(e) {}
            try { el.dispatchEvent(new MouseEvent('mouseup', opts)); } catch(e) {}
            try { el.click(); } catch(e) {}

            const parent = el.closest('li, a, [data-value]') || el.parentElement;
            if (parent && parent !== el && !isLuckyElement(parent)) {
                try { parent.dispatchEvent(new PointerEvent('pointerdown', opts)); } catch(e) {}
                try { parent.dispatchEvent(new MouseEvent('mousedown', opts)); } catch(e) {}
                try { parent.dispatchEvent(new PointerEvent('pointerup', opts)); } catch(e) {}
                try { parent.dispatchEvent(new MouseEvent('mouseup', opts)); } catch(e) {}
                try { parent.click(); } catch(e) {}
            }
        };

        // 1. Sayfada halihazırda açık olan menüde hedef şablonu ara
        if (nameLower) {
            const openOptions = Array.from(document.querySelectorAll('.dropdown *, [class*="dropdown"] *, [class*="select"] *, #fleet1 *')).filter(el => {
                if (isLuckyElement(el)) return false;
                return el.children.length === 0 && el.textContent.trim().toLowerCase() === nameLower;
            });
            if (openOptions.length > 0) {
                triggerFullClick(openOptions[0]);
                success = true;
            }
        }

        // 2. "Keşif filosu" alanını bul
        const allLeafs = Array.from(document.querySelectorAll('#fleet1 *, #fleetdispatchcomponent *, body *')).filter(el => !isLuckyElement(el));
        let expRow = null;

        for (const el of allLeafs) {
            if (el.children.length === 0) {
                const txt = el.textContent.trim().toLowerCase();
                if (txt === 'keşif filosu' || txt === 'kesif filosu') {
                    expRow = el.closest('tr, li, div') || el.parentElement;
                    break;
                }
            }
        }

        if (expRow) {
            // A. Select varsa doğrudan güncelle
            const sel = expRow.querySelector('select');
            if (sel) {
                let foundIndex = -1;
                for (let i = 0; i < sel.options.length; i++) {
                    const optText = (sel.options[i].textContent || '').trim().toLowerCase();
                    if ((nameLower && optText === nameLower) || (!nameLower && i === idNum)) {
                        foundIndex = i;
                        break;
                    }
                }
                if (foundIndex !== -1) {
                    sel.selectedIndex = foundIndex;
                    sel.value = sel.options[foundIndex].value;
                } else if (sel.options && sel.options.length > idNum) {
                    sel.selectedIndex = idNum;
                    sel.value = sel.options[idNum].value;
                }
                sel.dispatchEvent(new Event('input', { bubbles: true }));
                sel.dispatchEvent(new Event('change', { bubbles: true }));
                success = true;
            }

            // B. Custom dropdown tetikleyicisini aç
            const trigger = Array.from(expRow.querySelectorAll('.dropdown, [class*="select"], [class*="dropdown"], [class*="combobox"], a, span, div')).find(el => {
                if (isLuckyElement(el) || el.classList.contains('icon') || el.querySelector('.icon')) return false;
                const t = (el.textContent || '').trim().toLowerCase();
                return t.indexOf('keşif filosu') === -1;
            });

            if (trigger && trigger.offsetHeight > 0) {
                triggerFullClick(trigger);

                // Menü seçeneklerini bul ve hedef şablonu tıkla
                setTimeout(() => {
                    const menuItems = Array.from(document.querySelectorAll('.dropdown *, [class*="dropdown"] *, #fleet1 *')).filter(el => {
                        if (isLuckyElement(el)) return false;
                        if (el.children.length > 0) return false;
                        const t = (el.textContent || '').trim();
                        return isValidTemplateName(t);
                    });

                    let targetEl = null;
                    if (nameLower) {
                        targetEl = menuItems.find(el => el.textContent.trim().toLowerCase() === nameLower);
                    }
                    if (!targetEl && menuItems.length >= idNum) {
                        targetEl = menuItems[idNum - 1];
                    }

                    if (targetEl) {
                        triggerFullClick(targetEl);
                        success = true;
                    }
                }, 80);
            }
        }

        // 3. MAIN World (bridge.js) üzerinden tetikle
        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SELECT_TEMPLATE', id: idNum, name: targetName }
        }));

        return success;
    }

    function applyExpeditionTemplate(templateId, templateName) {
        return findAndSelectExpeditionTemplate(templateId, templateName);
    }

    function getSelectedShipsSummary() {
        const ships = {};
        let total = 0;
        const inputs = Array.from(document.querySelectorAll('#technologies input, input[name^="am"], #fleet1 input.military, #fleet1 input.civil')).filter(inp => !inp.closest('#ls-panel'));

        for (const inp of inputs) {
            const val = parseInt(inp.value, 10);
            if (!isNaN(val) && val > 0) {
                let shipId = (inp.name || '').replace(/^am/, '') || inp.getAttribute('data-technology') || inp.closest('[data-technology]')?.getAttribute('data-technology');
                if (shipId) {
                    ships[shipId] = val;
                    total += val;
                }
            }
        }
        return { ships, total };
    }


    function generateExpeditionQueue(galaxy, startSystem, count) {
        const queue = [];
        count = Math.max(1, parseInt(count, 10) || 1);
        const s0 = Math.max(1, Math.min(499, parseInt(startSystem, 10) || 1));
        const g = Math.max(1, Math.min(9, parseInt(galaxy, 10) || 1));

        const offsets = [0];
        let step = 1;
        while (offsets.length < count) {
            offsets.push(step);
            if (offsets.length < count) {
                offsets.push(-step);
            }
            step++;
        }

        const usedSystems = new Set();
        for (const offset of offsets) {
            let targetSys = ((s0 - 1 + offset) % 499 + 499) % 499 + 1;
            while (usedSystems.has(targetSys) && usedSystems.size < 499) {
                targetSys = (targetSys % 499) + 1;
            }
            usedSystems.add(targetSys);
            queue.push({
                g: g,
                s: targetSys,
                p: 16,
                coord: `${g}:${targetSys}:16`,
                offset: offset
            });
        }

        return queue;
    }

    function renderExpedition() {
        const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
        let defStart = '';
        if (metaCoords && /^\d+:\d+:\d+$/.test(metaCoords)) {
            const [g, s] = metaCoords.split(':');
            defStart = `${g}:${s}:16`;
        }
        if (!expeditionSettings.startCoord || !/^\d+:\d+:16$/.test(expeditionSettings.startCoord)) {
            if (defStart) {
                expeditionSettings.startCoord = defStart;
                saveExpeditionSettings();
            }
        }

        const coordInp = document.getElementById('ls-exp-start-coord');
        if (coordInp) coordInp.value = expeditionSettings.startCoord || defStart || '1:1:16';

        const countInp = document.getElementById('ls-exp-count');
        if (countInp) countInp.value = expeditionSettings.count || 1;

        const tplSel = document.getElementById('ls-exp-template');
        if (tplSel) {
            scanAndSaveExpeditionTemplates();
            const tpls = getSavedExpeditionTemplates();
            tplSel.innerHTML = '';
            if (tpls.length > 0) {
                tplSel.innerHTML = '<option value="">-- Şablon Seçin --</option>';
                tpls.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.id;
                    opt.textContent = t.name;
                    opt.setAttribute('data-name', t.name);
                    if (String(t.id) === String(expeditionSettings.templateId) || (t.name && t.name === expeditionSettings.templateName)) {
                        opt.selected = true;
                    }
                    tplSel.appendChild(opt);
                });
                if (!expeditionSettings.templateId && tpls.length > 0) {
                    expeditionSettings.templateId = tpls[0].id;
                    expeditionSettings.templateName = tpls[0].name;
                    tplSel.value = tpls[0].id;
                    saveExpeditionSettings();
                }
            } else {
                tplSel.innerHTML = '<option value="">(Filo sayfasından şablon taranacak)</option>';
            }
        }

        updateExpeditionPreview();
    }

    function updateExpeditionPreview() {
        const previewList = document.getElementById('ls-exp-preview-list');
        const countTitle = document.getElementById('ls-exp-total-steps');
        if (!previewList) return;

        const coordVal = (expeditionSettings.startCoord || '').trim();
        if (!/^\d+:\d+:\d+$/.test(coordVal)) {
            previewList.innerHTML = '<span style="color:#e74c3c">Geçersiz koordinat biçimi (örn: 5:242:16)</span>';
            if (countTitle) countTitle.textContent = '0 Sefer';
            return;
        }

        const [gStr, sStr] = coordVal.split(':');
        const count = Math.max(1, parseInt(expeditionSettings.count, 10) || 1);
        const queue = generateExpeditionQueue(gStr, sStr, count);

        if (countTitle) countTitle.textContent = `${queue.length} Sefer`;

        const itemsHtml = queue.map((item, idx) => {
            const offsetDesc = item.offset === 0 ? 'Kendi Sistemi' : (item.offset > 0 ? `+${item.offset} Sistem` : `${item.offset} Sistem`);
            return `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.04)">` +
                `<span><b>${idx + 1}.</b> <span style="color:#00bcff">[${item.coord}]</span></span>` +
                `<span style="color:#8899aa">${offsetDesc}</span>` +
            `</div>`;
        }).join('');

        previewList.innerHTML = itemsHtml;
    }

    function setupExpeditionEvents() {
        const coordInp = document.getElementById('ls-exp-start-coord');
        if (coordInp) {
            coordInp.addEventListener('change', () => {
                expeditionSettings.startCoord = coordInp.value.trim();
                saveExpeditionSettings();
                updateExpeditionPreview();
            });
            coordInp.addEventListener('input', () => {
                expeditionSettings.startCoord = coordInp.value.trim();
                updateExpeditionPreview();
            });
        }

        const curBtn = document.getElementById('ls-exp-cur-btn');
        if (curBtn) {
            curBtn.addEventListener('click', () => {
                const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
                if (metaCoords && /^\d+:\d+:\d+$/.test(metaCoords)) {
                    const [g, s] = metaCoords.split(':');
                    const c = `${g}:${s}:16`;
                    if (coordInp) coordInp.value = c;
                    expeditionSettings.startCoord = c;
                    saveExpeditionSettings();
                    updateExpeditionPreview();
                }
            });
        }

        const countInp = document.getElementById('ls-exp-count');
        if (countInp) {
            countInp.addEventListener('change', () => {
                expeditionSettings.count = Math.max(1, parseInt(countInp.value, 10) || 1);
                saveExpeditionSettings();
                updateExpeditionPreview();
            });
            countInp.addEventListener('input', () => {
                expeditionSettings.count = Math.max(1, parseInt(countInp.value, 10) || 1);
                updateExpeditionPreview();
            });
        }

        const tplSel = document.getElementById('ls-exp-template');
        if (tplSel) {
            tplSel.addEventListener('change', () => {
                expeditionSettings.templateId = tplSel.value;
                expeditionSettings.templateName = tplSel.options[tplSel.selectedIndex]?.getAttribute('data-name') || tplSel.options[tplSel.selectedIndex]?.text || '';
                saveExpeditionSettings();
            });
        }

        const refreshBtn = document.getElementById('ls-exp-refresh-tpls');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const foundTpls = scanAndSaveExpeditionTemplates();
                renderExpedition();
                if (foundTpls.length > 0) {
                    showCollectorToast(`✅ ${foundTpls.length} şablon bulundu: ` + foundTpls.map(t => t.name).join(', '), 3500);
                } else {
                    showCollectorToast('ℹ️ Filo sayfasında kayıtlı şablon bulunamadı. Lütfen Filo 1 sayfasına geçin.', 4000);
                }
            });
        }


        const startBtn = document.getElementById('ls-exp-start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                startExpeditionSession();
            });
        }

        window.addEventListener('LS_TEMPLATES_SCANNED', (e) => {
            if (e.detail && Array.isArray(e.detail.templates) && e.detail.templates.length > 0) {
                const validScanned = e.detail.templates.filter(t => isValidTemplateName(t.name));
                const rawSaved = JSON.parse(localStorage.getItem(KEYS.EXPEDITION_TEMPLATES) || '[]');
                const saved = rawSaved.filter(t => isValidTemplateName(t.name));
                let changed = (saved.length !== rawSaved.length);
                for (const t of validScanned) {
                    if (!saved.some(s => s.name.toLowerCase() === t.name.toLowerCase())) {
                        saved.push(t);
                        changed = true;
                    }
                }
                if (changed) {
                    localStorage.setItem(KEYS.EXPEDITION_TEMPLATES, JSON.stringify(saved));
                    renderExpedition();
                }
            }
        });
    }

    try {
        const existingRaw = localStorage.getItem(KEYS.EXPEDITION_TEMPLATES);
        if (existingRaw) {
            const parsed = JSON.parse(existingRaw);
            const cleaned = parsed.filter(t => isValidTemplateName(t.name));
            localStorage.setItem(KEYS.EXPEDITION_TEMPLATES, JSON.stringify(cleaned));
        }
    } catch (e) {}

    if (window.location.href.includes('component=fleetdispatch')) {
        setTimeout(scanAndSaveExpeditionTemplates, 500);
        setTimeout(scanAndSaveExpeditionTemplates, 1500);
    }

    function startExpeditionSession() {
        const coordInput = (expeditionSettings.startCoord || '').trim();
        if (!/^\d+:\d+:\d+$/.test(coordInput)) {
            alert(currentLang === 'tr' ? 'Lütfen geçerli bir başlangıç keşif koordinatı girin (örn: 5:242:16)!' : 'Please enter a valid starting expedition coordinate (e.g. 5:242:16)!');
            return;
        }

        const [gStr, sStr, pStr] = coordInput.split(':');
        const count = Math.max(1, parseInt(expeditionSettings.count, 10) || 1);
        const queue = generateExpeditionQueue(gStr, sStr, count);

        if (queue.length === 0) {
            alert(currentLang === 'tr' ? 'Keşif için sistem listesi oluşturulamadı!' : 'Could not generate system list for expeditions!');
            return;
        }

        const tplInp = document.getElementById('ls-exp-template');
        if (tplInp && tplInp.value) {
            expeditionSettings.templateId = tplInp.value;
            const selOpt = tplInp.options[tplInp.selectedIndex];
            if (selOpt) expeditionSettings.templateName = selOpt.getAttribute('data-name') || selOpt.text;
        }
        saveExpeditionSettings();

        const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
        const currentPlanetName = getCurrentPlanetName() || 'Mevcut';

        const session = {
            active: true,
            queue: queue,
            currentIndex: 0,
            startCoord: coordInput,
            departureCoord: metaCoords,
            departureName: currentPlanetName,
            templateId: expeditionSettings.templateId,
            templateName: expeditionSettings.templateName,
            startedAt: Date.now()
        };

        sessionStorage.setItem(KEYS.EXPEDITION_RUN, JSON.stringify(session));

        const firstItem = queue[0];
        const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                            document.getElementById('fleetdispatchcomponent') ||
                            document.getElementById('fleet1');

        const currentSysVal = document.getElementById('system')?.value || '';
        const currentGalVal = document.getElementById('galaxy')?.value || '';
        const currentPosVal = document.getElementById('position')?.value || '';

        // Eğer halihazırda filo sayfasındaysak VE koordinatlar hedefle birebir aynıysa doğrudan başlat
        if (isFleetPage && currentSysVal && String(currentSysVal).trim() === String(firstItem.s).trim() && String(currentGalVal).trim() === String(firstItem.g).trim() && String(currentPosVal).trim() === '16') {
            executeExpeditionStep(session, firstItem);
        } else {
            const url = `/game/index.php?page=ingame&component=fleetdispatch&galaxy=${firstItem.g}&system=${firstItem.s}&position=16&type=1&mission=15`;
            window.location.href = url;
        }
    }

    function checkAndRunExpeditionAssistant() {
        const raw = sessionStorage.getItem(KEYS.EXPEDITION_RUN);
        if (!raw) return;

        let session;
        try {
            session = JSON.parse(raw);
        } catch (e) {
            sessionStorage.removeItem(KEYS.EXPEDITION_RUN);
            return;
        }

        if (!session || !session.active || !Array.isArray(session.queue)) {
            sessionStorage.removeItem(KEYS.EXPEDITION_RUN);
            return;
        }

        if (session.startedAt && Date.now() - session.startedAt > 15 * 60 * 1000) {
            sessionStorage.removeItem(KEYS.EXPEDITION_RUN);
            return;
        }

        if (session.currentIndex >= session.queue.length) {
            sessionStorage.removeItem(KEYS.EXPEDITION_RUN);
            showCollectorToast('🎉 Tebrikler! Tüm keşif filoları başarıyla gönderildi.', 6000);
            return;
        }

        const currentItem = session.queue[session.currentIndex];
        const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                            document.getElementById('fleetdispatchcomponent') ||
                            document.getElementById('fleet1');

        if (!isFleetPage) {
            const url = `/game/index.php?page=ingame&component=fleetdispatch&galaxy=${currentItem.g}&system=${currentItem.s}&position=16&type=1&mission=15`;
            window.location.href = url;
            return;
        }

        let tries = 0;
        const pollInterval = setInterval(() => {
            tries++;
            const hasShipInput = document.querySelector('[data-technology="203"], [data-technology="202"]') ||
                                 document.querySelector('input[name="transporterLarge"], input[name="am203"], input[name="am202"]') ||
                                 document.getElementById('fleet1');
            const hasCoords = document.getElementById('galaxy') || document.querySelector('input[name="galaxy"]');
            const domReady = document.readyState === 'complete' || document.readyState === 'interactive';

            if ((domReady && hasShipInput && hasCoords) || tries > 40) {
                clearInterval(pollInterval);
                setTimeout(() => {
                    executeExpeditionStep(session, currentItem);
                }, 300);
            }
        }, 150);
    }

    function setExpeditionTarget(g, s, isStep2) {
        const galInp = document.getElementById('galaxy') || document.querySelector('input[name="galaxy"]');
        const sysInp = document.getElementById('system') || document.querySelector('input[name="system"]');
        const posInp = document.getElementById('position') || document.querySelector('input[name="position"]');
        const typeInp = document.getElementById('type') || document.querySelector('input[name="type"]');

        const setNative = (inp, val) => {
            if (!inp) return;
            const strVal = String(val);
            if (String(inp.value).trim() === strVal) return;
            try {
                const proto = window.HTMLInputElement.prototype;
                const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (setter) setter.call(inp, strVal);
                else inp.value = strVal;
            } catch (e) {
                inp.value = strVal;
            }
        };

        if (galInp) setNative(galInp, g);
        if (posInp) setNative(posInp, '16');
        if (typeInp) setNative(typeInp, '1');

        if (sysInp && String(sysInp.value).trim() !== String(s).trim()) {
            setNative(sysInp, s);
            try { sysInp.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
            try { sysInp.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        }

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SET_EXPEDITION_TARGET', g: g, s: s, isStep2: !!isStep2 }
        }));
    }

    function executeExpeditionStep(session, currentItem) {
        let isStepCancelled = false;
        LS_LOGGER.info('EXPEDITION', `Keşif adımı: [${currentItem.g}:${currentItem.s}:16] (${session.currentIndex + 1}/${session.queue.length})`);

        const updateBannerReady = () => {
            const btn = document.getElementById('ls-exp-banner-send-btn');
            if (btn) {
                btn.disabled = false;
                btn.style.background = '#27ae60';
                btn.style.color = '#fff';
                btn.style.cursor = 'pointer';
                btn.innerText = '🚀 ' + t('exp_hud_send') + ' (Space)';
            }
        };

        const prepareStep2 = () => {
            if (isStepCancelled) return;

            // 1. Hedef koordinatı (g:s:16) Step 2 olarak ata
            setExpeditionTarget(currentItem.g, currentItem.s, true);

            LS_LOGGER.info('EXPEDITION', `Step 2 parametreleri hazırlanıyor: Hedef [${currentItem.g}:${currentItem.s}:16]`);

            const ensureMission15 = () => {
                if (isStepCancelled) return;
                const missionBtn = document.querySelector('#missionButton15, [data-mission="15"]');
                const isMission15Active = missionBtn && (missionBtn.classList.contains('selected') || missionBtn.classList.contains('active'));
                if (!isMission15Active) {
                    setFleetMission(15);
                }
            };

            ensureMission15();

            // 2. Mission 15 ve gönder butonunun hazır olmasını bekle
            let step2Checks = 0;
            const step2Timer = setInterval(() => {
                if (isStepCancelled) {
                    clearInterval(step2Timer);
                    return;
                }
                step2Checks++;

                const missionBtn = document.querySelector('#missionButton15, [data-mission="15"]');
                const isMission15Active = missionBtn && (missionBtn.classList.contains('selected') || missionBtn.classList.contains('active'));
                if (!isMission15Active) {
                    ensureMission15();
                }

                const sendBtn = findSendFleetButton();
                const isSendBtnReady = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');

                if ((isMission15Active && isSendBtnReady && step2Checks >= 2) || step2Checks > 10) {
                    clearInterval(step2Timer);
                    updateBannerReady();
                }
            }, 60);
        };

        // 1. Şablonu seç (Gemileri doldur)
        if (session.templateId || session.templateName) {
            LS_LOGGER.action('EXPEDITION', `Şablon uygulanıyor: ${session.templateName || session.templateId}`);
            applyExpeditionTemplate(session.templateId, session.templateName);
        }

        // 2. Step 1 koordinatlarını doğrula
        setExpeditionTarget(currentItem.g, currentItem.s, false);

        // 3. Gemilerin dolmasını izle ve Devam'a bas
        let checkTries = 0;
        const ensureShipsInterval = setInterval(() => {
            if (isStepCancelled) {
                clearInterval(ensureShipsInterval);
                return;
            }
            checkTries++;
            const { ships, total } = getSelectedShipsSummary();

            if (total > 0) {
                clearInterval(ensureShipsInterval);

                setTimeout(() => {
                    if (isStepCancelled) return;
                    setExpeditionTarget(currentItem.g, currentItem.s, false);
                    LS_LOGGER.action('EXPEDITION', 'Step 1 Devam butonu tıklandı, Step 2 bekleniyor.');
                    clickDevamButton();
                    window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                        detail: { type: 'SUBMIT_FLEET1' }
                    }));

                    let step2Tries = 0;
                    const step2Interval = setInterval(() => {
                        if (isStepCancelled) {
                            clearInterval(step2Interval);
                            return;
                        }
                        step2Tries++;
                        const devamBtn = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
                        const isStep1StillActive = devamBtn && (devamBtn.offsetWidth > 0 || window.getComputedStyle(devamBtn).display !== 'none');
                        const sendBtn = findSendFleetButton();
                        const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                        const isStep2Active = !isStep1StillActive && isSendBtnVisible;

                        if (isStep2Active) {
                            clearInterval(step2Interval);
                            setTimeout(prepareStep2, 100);
                        } else {
                            if (step2Tries % 5 === 0) {
                                clickDevamButton();
                                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                                    detail: { type: 'SUBMIT_FLEET1' }
                                }));
                            }
                            if (step2Tries > 30) {
                                clearInterval(step2Interval);
                                setTimeout(prepareStep2, 100);
                            }
                        }
                    }, 100);
                }, 150);
            } else if (checkTries === 2 || checkTries === 5) {
                if (session.templateId || session.templateName) {
                    applyExpeditionTemplate(session.templateId, session.templateName);
                }
            } else if (checkTries > 15) {
                clearInterval(ensureShipsInterval);
                clickDevamButton();
                window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                    detail: { type: 'SUBMIT_FLEET1' }
                }));
                setTimeout(prepareStep2, 200);
            }
        }, 150);

        renderExpeditionBanner(session, currentItem, {
            prepareStep2: prepareStep2,
            retry: () => {
                isStepCancelled = true;
                clearInterval(ensureShipsInterval);
                setTimeout(() => {
                    executeExpeditionStep(session, currentItem);
                }, 100);
            },
            cancel: () => {
                isStepCancelled = true;
                clearInterval(ensureShipsInterval);
            }
        });
    }

    function renderExpeditionBanner(session, currentItem, details) {
        let banner = document.getElementById('ls-coll-floating-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'ls-coll-floating-banner';
            document.body.appendChild(banner);
        }

        const totalItems = session.queue.length;
        const currentStep = session.currentIndex + 1;
        const departure = session.departureName ? `${session.departureName} [${session.departureCoord}]` : (session.departureCoord || t('exp_here'));
        const offsetText = currentItem.offset === 0 ? t('exp_own_system') : (currentItem.offset > 0 ? `+${currentItem.offset} ${t('exp_system_offset')}` : `${currentItem.offset} ${t('exp_system_offset')}`);
        const templateName = session.templateName || (session.templateId ? `${t('exp_hud_template')} #${session.templateId}` : (currentLang === 'tr' ? 'Varsayılan' : 'Default'));

        banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(13,27,42,0.96);border:2px solid #9b59b6;box-shadow:0 10px 32px rgba(0,0,0,0.85);border-radius:8px;padding:12px 18px;min-width:420px;max-width:90vw;z-index:9999999;font-family:sans-serif;color:#d1d8e0;text-align:center;box-sizing:border-box';

        banner.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a2c3f;padding-bottom:6px;margin-bottom:8px">' +
                '<span style="font-size:12px;font-weight:bold;color:#bb86fc">🧭 ' + t('exp_hud_title') + ' [' + currentStep + ' / ' + totalItems + ']</span>' +
                '<span style="font-size:11px;color:#fff">🪐 ' + escapeHtml(departure) + ' ➔ 🌌 ' + t('exp_deep_space') + ' <span style="color:#ffbe3b;font-family:monospace">[' + currentItem.coord + ']</span></span>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;margin-bottom:8px">' +
                '<div><b style="color:#8899aa">' + t('exp_hud_route') + '</b> <span style="color:#00bcff;font-weight:bold">' + offsetText + '</span></div>' +
                '<div><b style="color:#8899aa">' + t('exp_hud_template') + '</b> <span style="color:#2ecc71;font-weight:bold">' + escapeHtml(templateName) + '</span></div>' +
            '</div>' +
            '<div style="display:flex;gap:6px;justify-content:center;align-items:center">' +
                '<button id="ls-exp-banner-send-btn" disabled style="background:#445566;color:#8899aa;border:none;padding:5px 12px;border-radius:4px;font-weight:bold;font-size:11px;cursor:not-allowed">' + t('exp_hud_preparing') + '</button>' +
                '<button id="ls-exp-banner-retry-btn" style="background:#e67e22;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer" title="' + t('exp_hud_retry') + '">🔄 ' + t('exp_hud_retry') + '</button>' +
                '<button id="ls-exp-banner-skip-btn" style="background:#34495e;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ ' + t('exp_hud_skip') + '</button>' +
                '<button id="ls-exp-banner-cancel-btn" style="background:#e74c3c;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏹️ ' + t('exp_hud_cancel') + '</button>' +
            '</div>';

        let isDispatching = false;

        const sendExpedition = () => {
            if (isDispatching) return;
            const sendBtn = findSendFleetButton();
            const isSendBtnReady = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');

            // Sadece Step 2 aktif ve filo gönder butonu hazır olduğunda gönder
            if (!isSendBtnReady) {
                return;
            }

            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }

            isDispatching = true;
            const bannerSendBtn = document.getElementById('ls-exp-banner-send-btn');
            if (bannerSendBtn) {
                bannerSendBtn.disabled = true;
                bannerSendBtn.style.opacity = '0.5';
            }
            LS_LOGGER.action('EXPEDITION', `Keşif gönder emri verildi (Space/Tık). [${currentItem.g}:${currentItem.s}:16]`);
            dispatchSendExpeditionFleet();
        };

        const retryCurrentStep = () => {
            isDispatching = false;
            window.removeEventListener('keydown', keyListener);
            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#e67e22;padding:6px;font-weight:bold">🔄 ' + t('exp_hud_retrying') + '</div>';
            }
            if (typeof details.retry === 'function') {
                details.retry();
            } else {
                setTimeout(() => {
                    executeExpeditionStep(session, currentItem);
                }, 100);
            }
        };

        const dispatchSendExpeditionFleet = () => {
            window.removeEventListener('keydown', keyListener);

            session.currentIndex++;
            sessionStorage.setItem(KEYS.EXPEDITION_RUN, JSON.stringify(session));

            LS_LOGGER.dispatch('EXPEDITION', `Keşif filosu gönderiliyor: [${currentItem.g}:${currentItem.s}:16] (Adım: ${session.currentIndex}/${session.queue.length})`);

            if (banner) {
                banner.innerHTML =
                    '<div style="font-size:12px;color:#2ecc71;padding:8px;font-weight:bold">' +
                        '🚀 Keşif filosu gönderildi! Sıradaki sisteme geçiliyor...' +
                    '</div>';
            }

            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: {
                    type: 'SUBMIT_FLEET2'
                }
            }));

            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const url = `/game/index.php?page=ingame&component=fleetdispatch&galaxy=${nextItem.g}&system=${nextItem.s}&position=16&type=1&mission=15`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.EXPEDITION_RUN);
                    if (banner) banner.remove();
                    showCollectorToast('🎉 Tebrikler! Tüm keşif filoları başarıyla gönderildi.', 6000);
                }
            }, 800);
        };

        const skipCurrentStep = () => {
            isDispatching = false;
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            session.currentIndex++;
            sessionStorage.setItem(KEYS.EXPEDITION_RUN, JSON.stringify(session));

            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#f39c12;padding:6px">⏭️ Sistem atlandı, sıradakine geçiliyor...</div>';
            }

            setTimeout(() => {
                if (session.currentIndex < session.queue.length) {
                    const nextItem = session.queue[session.currentIndex];
                    const url = `/game/index.php?page=ingame&component=fleetdispatch&galaxy=${nextItem.g}&system=${nextItem.s}&position=16&type=1&mission=15`;
                    window.location.href = url;
                } else {
                    sessionStorage.removeItem(KEYS.EXPEDITION_RUN);
                    if (banner) banner.remove();
                    showCollectorToast('🎉 Keşif asistanı tamamlandı.', 5000);
                }
            }, 400);
        };

        const cancelSession = () => {
            isDispatching = false;
            window.removeEventListener('keydown', keyListener);
            LS_LOGGER.warn('EXPEDITION', 'Keşif işlemi iptal edildi / durduruldu.');
            if (typeof details.cancel === 'function') details.cancel();
            sessionStorage.removeItem(KEYS.EXPEDITION_RUN);
            if (banner) banner.remove();
        };

        const keyListener = (e) => {
            if (e.repeat) return;
            if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                const tag = (document.activeElement && document.activeElement.tagName) || '';
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
                e.preventDefault();
                e.stopPropagation();
                sendExpedition();
            }
        };

        window.addEventListener('keydown', keyListener);

        document.getElementById('ls-exp-banner-send-btn')?.addEventListener('click', sendExpedition);
        document.getElementById('ls-exp-banner-retry-btn')?.addEventListener('click', retryCurrentStep);
        document.getElementById('ls-exp-banner-skip-btn')?.addEventListener('click', skipCurrentStep);
        document.getElementById('ls-exp-banner-cancel-btn')?.addEventListener('click', cancelSession);
    }

    // ============================================================
    // INJECT UI
    // ============================================================
    function buildUI() {
        const style = document.createElement('style');
        style.textContent = [
            '#ls-fab{position:fixed;bottom:65px;right:15px;width:44px;height:44px;border-radius:50%;',
            'background:linear-gradient(135deg,#00bcff,#005fbc);color:#fff;display:flex;align-items:center;',
            'justify-content:center;cursor:pointer;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,0.6);',
            'border:2px solid rgba(0,188,255,0.5);transition:transform .2s;user-select:none}',
            '#ls-fab:hover{transform:scale(1.12)}',
            '#ls-fab svg{filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))}',

            '#ls-panel, #ls-panel *{box-sizing:border-box}',
            '#ls-panel{position:fixed;bottom:120px;right:15px;width:340px;min-width:320px;max-width:calc(100vw - 30px);',
            'min-height:500px;max-height:calc(100vh - 30px);background:rgba(11,16,26,0.97);',
            'border:1px solid #1a2c3f;border-radius:8px;color:#d1d8e0;font-family:sans-serif;font-size:12px;',
            'z-index:999998;box-shadow:0 10px 30px rgba(0,0,0,0.8);display:none;flex-direction:column;transition:opacity .2s ease;container-type:inline-size;container-name:lspanel}',

            '.ls-resize-h{position:absolute;z-index:999999}',
            '.ls-rh-se{right:0;bottom:0;width:14px;height:14px;cursor:nwse-resize}',
            '.ls-rh-sw{left:0;bottom:0;width:14px;height:14px;cursor:nesw-resize}',
            '.ls-rh-ne{right:0;top:0;width:14px;height:14px;cursor:nesw-resize}',
            '.ls-rh-nw{left:0;top:0;width:14px;height:14px;cursor:nwse-resize}',
            '.ls-rh-e{right:0;top:14px;bottom:14px;width:6px;cursor:ew-resize}',
            '.ls-rh-w{left:0;top:14px;bottom:14px;width:6px;cursor:ew-resize}',
            '.ls-rh-s{bottom:0;left:14px;right:14px;height:6px;cursor:ns-resize}',

            '#ls-header{padding:8px 12px;background:linear-gradient(90deg,#0d1b2a,#1a2c3f);',
            'border-bottom:2px solid #00bcff;border-radius:8px 8px 0 0;cursor:move;display:flex;',
            'justify-content:space-between;align-items:center;user-select:none}',
            '#ls-header-title{font-weight:bold;color:#00bcff;font-size:13px;display:flex;align-items:center;gap:6px}',
            '#ls-close{cursor:pointer;color:#e74c3c;font-size:16px}',
            '#ls-close:hover{color:#ff6b6b}',

            '#ls-tabs{display:flex;border-bottom:1px solid #1a2c3f;container-type:inline-size;container-name:lstabs}',
            '.ls-tab{flex:1;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:3px;',
            'text-align:center;padding:7px 2px;cursor:pointer;font-size:10px;',
            'background:rgba(26,44,63,0.4);transition:all .2s;color:#8899aa;user-select:none;white-space:nowrap}',
            '.ls-tab *{pointer-events:none}',
            '.ls-tab:hover{background:rgba(0,188,255,0.15);color:#fff}',
            '.ls-tab.active{background:rgba(0,188,255,0.25);color:#00bcff;font-weight:bold;',
            'border-bottom:2px solid #00bcff}',
            '.ls-tab-icon{font-size:12px;line-height:1;display:inline-flex;align-items:center;justify-content:center}',
            '.ls-tab-label{font-size:9.5px;line-height:1;white-space:nowrap}',
            '@container lstabs (max-width: 480px){',
            '  .ls-tab{flex-direction:column;gap:2px;padding:5px 1px}',
            '  .ls-tab-icon{font-size:12px}',
            '  .ls-tab-label{font-size:8.5px}',
            '}',
            '.ls-tabs-stacked .ls-tab{flex-direction:column;gap:2px;padding:5px 1px}',
            '.ls-tabs-stacked .ls-tab-icon{font-size:12px}',
            '.ls-tabs-stacked .ls-tab-label{font-size:8.5px}',

            '.ls-debug-slider{position:relative;display:inline-block;width:28px;height:16px;background-color:#2c3e50;border-radius:16px;transition:.3s;border:1px solid #34495e}',
            '.ls-debug-slider:before{position:absolute;content:"";height:10px;width:10px;left:2px;bottom:2px;background-color:#fff;border-radius:50%;transition:.3s}',
            '#ls-debug-toggle:checked + .ls-debug-slider{background-color:#2ecc71;border-color:#27ae60}',
            '#ls-debug-toggle:checked + .ls-debug-slider:before{transform:translateX(12px)}',
            '#ls-trace-toggle:checked + .ls-debug-slider{background-color:#ff5722;border-color:#e64a19}',
            '#ls-trace-toggle:checked + .ls-debug-slider:before{transform:translateX(12px)}',
            '.ls-debug-filter{background:rgba(255,255,255,0.05);border:1px solid #1a2c3f;color:#8899aa;font-size:9px;padding:2px 5px;border-radius:3px;cursor:pointer;user-select:none;transition:all .15s;line-height:1.2}',
            '.ls-debug-filter:hover{background:rgba(0,188,255,0.15);color:#fff}',
            '.ls-debug-filter.active{background:#00bcff;color:#000;font-weight:bold;border-color:#00bcff}',
            '.ls-debug-filter[data-val="TRACE"].active{background:#ff5722;color:#fff;border-color:#ff5722}',
            '.ls-debug-filter[data-val="ERROR"].active{background:#e74c3c;color:#fff;border-color:#e74c3c}',
            '.ls-debug-filter[data-val="WARN"].active{background:#f39c12;color:#fff;border-color:#f39c12}',
            '.ls-debug-filter[data-val="REQ"].active{background:#3498db;color:#fff;border-color:#3498db}',
            '.ls-debug-filter[data-val="RESP"].active{background:#2ecc71;color:#fff;border-color:#2ecc71}',

            '#ls-body{padding:10px;overflow-y:auto;overflow-x:hidden !important;flex:1;min-height:0;display:flex;flex-direction:column}',
            '.ls-tc{display:none;width:100%;overflow-x:hidden}.ls-tc.active{display:flex;flex-direction:column;flex:1;min-height:0;width:100%}',

            '.ls-item{background:rgba(255,255,255,0.04);padding:6px 8px;margin-bottom:4px;border-radius:4px;',
            'display:flex;justify-content:space-between;align-items:center;gap:6px}',
            '.ls-x{background:#e74c3c;color:#fff;border:none;border-radius:3px;cursor:pointer;',
            'padding:2px 5px;font-size:10px;line-height:1}',
            '.ls-x:hover{background:#c0392b}',

            '.ls-total-row{display:flex;justify-content:space-between;align-items:center;padding:2px 0;font-size:11px}',

            '.ls-btn{background:#00bcff;color:#000;border:none;padding:5px 10px;border-radius:3px;',
            'cursor:pointer;font-weight:bold;font-size:11px}',
            '.ls-btn:hover{background:#33cfff}',
            '.ls-btn:disabled{opacity:0.5;cursor:not-allowed}',
            '.ls-btn-d{background:#e74c3c;color:#fff}',
            '.ls-btn-d:hover{background:#c0392b}',
            '.ls-btn-warn{background:linear-gradient(135deg,#e67e22,#d35400);color:#fff;border:none;padding:5px 9px;border-radius:3px;cursor:pointer;font-weight:bold;font-size:11px;transition:all .2s;white-space:nowrap}',
            '.ls-btn-warn:hover{background:linear-gradient(135deg,#f39c12,#e67e22)}',
            '.ls-btn-warn:disabled{background:#5c3516 !important;color:#998877 !important;opacity:0.65;cursor:not-allowed;border:1px solid #7a441c}',
            '.ls-btn-sm{background:#00bcff;color:#000;border:none;padding:2px 6px;border-radius:3px;',
            'cursor:pointer;font-size:10px;font-weight:bold;white-space:nowrap}',
            '.ls-btn-sm:hover{background:#33cfff}',

            '.ls-cp-btn{background:#1a2c3f;color:#00bcff;border:1px solid #2c3e50;border-radius:3px;',
            'cursor:pointer;padding:1px 5px;font-size:10px;line-height:14px;user-select:none}',
            '.ls-cp-btn:hover{background:#00bcff;color:#000}',

            '.ls-inp{background:#0a0e17;border:1px solid #2c3e50;color:#fff;padding:4px 6px;',
            'font-size:11px;border-radius:3px;box-sizing:border-box}',
            '.ls-inp:focus{border-color:#00bcff;outline:none}',

            '.ls-row{display:flex;gap:6px;margin-bottom:6px;align-items:center}',
            '.ls-col{flex:1;display:flex;flex-direction:column;gap:2px}',
            '.ls-label{font-size:10px;color:#8899aa}',

            '.ls-chip{display:inline-block;background:#2c3e50;border:1px solid #34495e;',
            'padding:2px 8px;border-radius:12px;font-size:10px;cursor:pointer;margin:2px}',
            '.ls-chip:hover{background:#34495e;border-color:#00bcff}',

            '.ls-badge{display:inline-block;background:#27ae60;color:#fff;padding:1px 6px;',
            'border-radius:10px;font-size:10px;font-weight:bold;margin-left:3px}',

            '.ls-prog{width:100%;height:8px;background:#111;border-radius:4px;overflow:hidden;margin:6px 0;display:none}',
            '.ls-prog-bar{height:100%;width:0%;background:linear-gradient(90deg,#00bcff,#27ae60);transition:width .3s}',

            '.ls-finder-card{background:rgba(255,255,255,0.04);padding:8px;margin-bottom:6px;',
            'border-radius:4px;border-left:3px solid #00bcff}',
            '.ls-finder-planet{display:flex;justify-content:space-between;align-items:center;',
            'font-size:10px;padding:2px 0}',

            /* Resmin sol alt köşesinde Dikey Hizalanmış Kompakt Grup */
            '#ls-btn-group{position:absolute;top:150px;left:14px;z-index:99999;display:flex;flex-direction:column;align-items:flex-start;gap:3px;',
            'background:transparent;padding:0}',

            '#ls-stepper-box{display:inline-flex;align-items:center;gap:2px;background:rgba(10,14,23,0.9);',
            'padding:1px 4px;border-radius:3px;border:1px solid #f1c40f;box-shadow:0 2px 6px rgba(0,0,0,0.8);width:fit-content}',

            '.ls-lvl-btn{background:#2c3e50;color:#fff;border:1px solid #4a627a;border-radius:2px;',
            'cursor:pointer;font-weight:bold;font-size:11px;line-height:14px;width:15px;height:15px;text-align:center;padding:0}',
            '.ls-lvl-btn:hover{background:#34495e;border-color:#00bcff}',

            '#ls-lvl-display{font-size:10px;font-weight:bold;color:#f1c40f;min-width:18px;text-align:center;user-select:none}',

            '#ls-add-cart-btn{font-size:11px;padding:3px 8px;background:linear-gradient(135deg, #d39e00, #b77900);color:#000;',
            'border-radius:3px;border:1px solid #f1c40f;cursor:pointer;font-weight:bold;white-space:nowrap;transition:all .2s;',
            'box-shadow:0 3px 8px rgba(0,0,0,0.85);max-width:170px;overflow:hidden;text-overflow:ellipsis}',
            '#ls-add-cart-btn:hover{background:linear-gradient(135deg, #f1c40f, #d39e00);transform:scale(1.02)}',

            '.ls-toggle-switch{position:relative;display:inline-block;width:34px;height:18px;cursor:pointer}',
            '.ls-toggle-switch input{opacity:0;width:0;height:0;position:absolute}',
            '.ls-toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#334455;transition:.2s;border-radius:18px}',
            '.ls-toggle-slider:before{position:absolute;content:"";height:12px;width:12px;left:3px;bottom:3px;background-color:white;transition:.2s;border-radius:50%}',
            '.ls-toggle-switch input:checked + .ls-toggle-slider{background-color:#2ecc71}',
            '.ls-toggle-switch input:checked + .ls-toggle-slider:before{transform:translateX(16px)}',

            '#ls-body::-webkit-scrollbar, #ls-cart-list::-webkit-scrollbar, #ls-debris-list::-webkit-scrollbar, #ls-scan-results::-webkit-scrollbar, #ls-find-results::-webkit-scrollbar, #ls-coll-list::-webkit-scrollbar, #ls-coll-dd::-webkit-scrollbar, #ls-cour-list::-webkit-scrollbar, #ls-cour-origin-dd::-webkit-scrollbar{width:5px}',
            '#ls-body::-webkit-scrollbar-track, #ls-cart-list::-webkit-scrollbar-track, #ls-debris-list::-webkit-scrollbar-track, #ls-scan-results::-webkit-scrollbar-track, #ls-find-results::-webkit-scrollbar-track, #ls-coll-list::-webkit-scrollbar-track, #ls-coll-dd::-webkit-scrollbar-track, #ls-cour-list::-webkit-scrollbar-track, #ls-cour-origin-dd::-webkit-scrollbar-track{background:#0a0e17}',
            '#ls-body::-webkit-scrollbar-thumb, #ls-cart-list::-webkit-scrollbar-thumb, #ls-debris-list::-webkit-scrollbar-thumb, #ls-scan-results::-webkit-scrollbar-thumb, #ls-find-results::-webkit-scrollbar-thumb, #ls-coll-list::-webkit-scrollbar-thumb, #ls-coll-dd::-webkit-scrollbar-thumb, #ls-cour-list::-webkit-scrollbar-thumb, #ls-cour-origin-dd::-webkit-scrollbar-thumb{background:#00bcff;border-radius:3px}',

            /* Collector Tab Styles */
            '#ls-coll-card-target{position:relative !important;z-index:1000 !important;overflow:visible !important}',
            '.ls-coll-card{background:#131d2a;border:1px solid #233446;border-radius:6px;padding:8px 10px;margin-bottom:8px;flex-shrink:0;position:relative;z-index:1}',
            '.ls-coll-row{display:flex;align-items:center;gap:8px}',
            '.ls-coll-chk{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#d1d8e0;cursor:pointer}',
            '.ls-coll-chk input{accent-color:#00bcff;margin:0;width:12px;height:12px;cursor:pointer}',
            '.ls-coll-combo{position:relative;flex:1;z-index:1001}',
            '.ls-coll-sel{display:flex;align-items:center;justify-content:space-between;background:#0a0e17;border:1px solid #00bcff;border-radius:3px;padding:5px 7px;font-size:11px;cursor:pointer;user-select:none}',
            '.ls-coll-sel b{color:#fff}',
            '.ls-coll-sel .crd{color:#ffbe3b;font-family:monospace;margin-left:6px}',
            '.ls-coll-dd{position:absolute;left:0;right:0;top:30px;background:#0d1520 !important;border:1px solid #00bcff !important;border-radius:4px;z-index:1002 !important;box-shadow:0 10px 30px rgba(0,0,0,0.95) !important;max-height:220px;overflow-y:auto;display:none}',
            '.ls-coll-dd.show{display:block !important}',
            '#ls-tab-tooltip{position:absolute;top:66px;left:8px;right:8px;background:rgba(10,16,26,0.98);border:1px solid #00bcff;border-radius:6px;padding:8px 10px;box-shadow:0 8px 24px rgba(0,0,0,0.9),0 0 12px rgba(0,188,255,0.25);z-index:999999;pointer-events:none;display:none;animation:lsFadeIn .18s ease}',
            '#ls-tab-tooltip-title{font-size:11.5px;font-weight:bold;color:#00bcff;margin-bottom:4px;display:flex;align-items:center;gap:5px}',
            '#ls-tab-tooltip-desc{font-size:10.5px;color:#c9d6e3;line-height:1.45}',
            '@keyframes lsFadeIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}',
            '.ls-coll-dd-item{padding:6px 8px;font-size:11px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #16222f;cursor:pointer;transition:background .15s;background:#0d1520}',
            '.ls-coll-dd-item:hover{background:rgba(0,188,255,0.22) !important}',
            '.ls-coll-dd-item.active{background:rgba(0,188,255,0.32) !important}',
            '.ls-coll-dd-item .crd{font-family:monospace;color:#00bcff;font-size:10px}',
            '.ls-coll-dd-item.moon{padding-left:18px;color:#c9d6e3}',
            '.ls-coll-dd-manual{color:#8899aa;font-style:italic;border-bottom:none}',
            '.ls-coll-mbtn{background:#1a2c3f;color:#8899aa;border:1px solid #2c3e50;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;transition:all .15s}',
            '.ls-coll-mbtn.active, #ls-coll-mission-3.active, #ls-cour-mission-3.active, #ls-cart-mission-3.active{background:#27ae60 !important;color:#fff !important;border-color:#2ecc71 !important}',
            '.ls-coll-mbtn.deploy.active, #ls-coll-mission-4.active, #ls-cour-mission-4.active, #ls-cart-mission-4.active{background:#2980b9 !important;color:#fff !important;border-color:#3498db !important}',
            '.ls-coll-mbtn:hover:not(.active){background:#243a52;color:#fff}',
            '.ls-mode-btn{background:#00344d;color:#00bcff;border:1px solid #00bcff;padding:2px 7px;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;transition:all .15s;white-space:nowrap}',
            '.ls-mode-btn:hover{filter:brightness(1.2)}',
            '.ls-mode-btn.fuel{background:#123a24;color:#2ecc71;border-color:#2ecc71}',
            '.ls-btn-here, #ls-cart-cur-btn, #ls-coll-cur-btn, #ls-cour-cur-btn{background:#8e44ad !important;color:#fff !important;border:1px solid #9b59b6 !important;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;padding:2px 7px;transition:all .15s}',
            '.ls-btn-here:hover, #ls-cart-cur-btn:hover, #ls-coll-cur-btn:hover, #ls-cour-cur-btn:hover{background:#9b59b6 !important;border-color:#bb86fc !important}',

            /* Origin Card Responsive Header Row */
            '.ls-origin-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;flex-wrap:nowrap;gap:4px}',
            '#ls-panel.ls-compact .ls-origin-head-row{flex-wrap:wrap;gap:3px}',
            '#ls-panel.ls-compact .ls-origin-head-row .ls-label{flex:1 1 100%;font-size:10.5px;margin-bottom:2px}',
            '#ls-panel.ls-compact .ls-origin-head-row .ls-btn-here{margin-left:0;margin-right:auto}',

            /* Extra Cost & Generic Distribution Rows */
            '.ls-extra-row{display:flex;align-items:center;gap:4px;width:100%}',
            '#ls-panel.ls-compact .ls-extra-row{flex-wrap:wrap;gap:3px}',
            '#ls-panel.ls-compact .ls-extra-row > span, #ls-panel.ls-compact .ls-extra-row > label{font-size:10px}',
            '#ls-panel.ls-compact .ls-extra-row .ls-btn-sm{padding:2px 5px;font-size:9px}',

            /* Selection Bar */
            '.ls-coll-selbar{display:flex;gap:4px;margin-bottom:6px;flex-shrink:0;width:100%}',
            '.ls-coll-selbar .ls-btn-sm{flex:1 1 0;text-align:center;padding:3px 2px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:10px}',
            '#ls-panel.ls-compact .ls-coll-selbar .ls-btn-sm{font-size:9px;padding:3px 1px}',
            '#ls-panel.ls-narrow .ls-coll-selbar{flex-wrap:wrap;gap:3px}',
            '#ls-panel.ls-narrow .ls-coll-selbar .ls-btn-sm{flex:1 1 calc(50% - 2px);max-width:calc(50% - 2px);font-size:9.5px;padding:4px 2px}',

            '.ls-coll-head{display:flex;justify-content:space-between;align-items:center;padding:0 2px 4px 2px;border-bottom:1px solid #1a2c3f;margin-bottom:6px;flex-shrink:0}',
            '#ls-panel.ls-compact .ls-coll-head span{font-size:9.5px !important;margin-right:20px !important}',
            '#ls-panel.ls-narrow .ls-coll-head span{font-size:9px !important;margin-right:14px !important}',

            '.ls-coll-list{flex:1;min-height:40px;overflow-y:auto;overflow-x:hidden !important;padding-right:2px}',
            '.ls-coll-grp{margin-bottom:5px}',
            '.ls-coll-prow{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border-radius:4px;padding:5px 6px;transition:background .15s}',
            '.ls-coll-prow:hover{background:rgba(255,255,255,0.07)}',
            '.ls-coll-mrow{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.025);border-radius:4px;padding:4px 6px;margin:3px 0 0 16px;position:relative;transition:background .15s}',
            '.ls-coll-mrow:hover{background:rgba(255,255,255,0.05)}',
            '.ls-coll-mrow:before{content:"";position:absolute;left:-10px;top:-6px;width:8px;height:18px;border-left:1px solid #2f5f86;border-bottom:1px solid #2f5f86}',
            '.ls-coll-prow input[type=checkbox],.ls-coll-mrow input[type=checkbox]{accent-color:#00bcff;margin:0;width:13px;height:13px;flex-shrink:0;cursor:pointer}',
            '.ls-coll-info{flex:1 1 auto;min-width:0}',
            '.ls-coll-name{display:flex;align-items:baseline;gap:5px;white-space:nowrap;overflow:hidden}',
            '.ls-coll-name b{color:#fff;font-size:11.5px;overflow:hidden;text-overflow:ellipsis}',
            '.ls-coll-name .crd{color:#00bcff;font-size:10px;font-family:monospace}',
            '.ls-coll-mrow .ls-coll-name b{color:#c9d6e3;font-weight:normal;font-size:11px}',
            '.ls-coll-res{display:flex;gap:7px;font-family:monospace;font-size:10.5px;margin-top:2px;white-space:nowrap;overflow:hidden}',
            '.ls-coll-m{color:#ffbe3b}.ls-coll-k{color:#5dade2}.ls-coll-d{color:#2ecc71}',
            '.ls-coll-rez{width:68px;text-align:right;color:#2ecc71;font-family:monospace;font-weight:bold;flex-shrink:0;padding:2px 4px;font-size:10.5px}',
            '.ls-coll-jump{background:#00bcff;color:#000;border:none;padding:2px 5px;border-radius:3px;font-size:10px;line-height:16px;flex-shrink:0;cursor:pointer;font-weight:bold;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center}',
            '.ls-coll-jump:hover{background:#33cfff}',
            '.ls-coll-dest{opacity:0.6}',
            '.ls-coll-dest .note{font-size:9.5px;color:#8899aa;width:68px;text-align:center;flex-shrink:0}',
            '.ls-coll-sum{display:flex;justify-content:space-between;align-items:center;font-size:11px;margin:8px 0 6px 0;flex-shrink:0}',
            '#ls-cour-summary{display:flex;flex-direction:column;gap:5px;margin:8px 0 6px 0;flex-shrink:0;width:100%;box-sizing:border-box}',
            '#ls-cour-summary .ls-cour-sum-row{display:flex;justify-content:space-between;align-items:center;width:100%}',
            '#ls-cour-summary .ls-cour-sum-sub{border-top:1px dashed rgba(255,255,255,0.12);padding-top:4px;font-size:10.5px}',
            '#ls-panel.theme-fb #ls-cour-summary .ls-cour-sum-sub{border-top-color:rgba(255,230,0,0.2)}',

            /* Collector & Courier Rows Scaling */
            '#ls-panel.ls-compact .ls-coll-prow, #ls-panel.ls-compact .ls-coll-mrow{gap:4px;padding:3px 4px}',
            '#ls-panel.ls-compact .ls-coll-mrow{margin-left:10px}',
            '#ls-panel.ls-compact .ls-coll-name b{font-size:10.5px}',
            '#ls-panel.ls-compact .ls-coll-name .crd{font-size:9px}',
            '#ls-panel.ls-compact .ls-coll-res{font-size:8px;gap:3px}',
            '#ls-panel.ls-compact .ls-coll-jump{width:18px;height:18px;font-size:9px}',
            '#ls-panel.ls-compact .ls-coll-rez{width:50px;font-size:9px;padding:1px 2px}',
            '#ls-panel.ls-compact .ls-coll-dest .note{width:50px;font-size:8.5px}',
            '#ls-panel.ls-narrow .ls-coll-name b{max-width:75px}',
            '#ls-panel.ls-narrow .ls-coll-res{display:none}',

            /* Action Buttons (Collector, Expedition, Courier, Cart) - ZERO TRANSFORM SCALE */
            '.ls-coll-go{flex-shrink:0;width:100%;background:linear-gradient(180deg,#ff8c00,#f57c00);color:#fff;border:none;border-radius:3px;padding:8px;font-weight:bold;font-size:12px;cursor:pointer;transition:background .15s, filter .15s, box-shadow .15s}',
            '.ls-coll-go:hover{background:linear-gradient(180deg,#ffa024,#f57c00);filter:brightness(1.15);box-shadow:0 0 10px rgba(255,140,0,0.4)}',
            '.ls-coll-go:active{filter:brightness(0.9)}',
            '.ls-coll-go:disabled{opacity:0.5;cursor:not-allowed}',

            '.ls-exp-go{flex-shrink:0;width:100%;background:linear-gradient(180deg,#8e44ad,#6c3483);color:#fff;border:none;border-radius:4px;padding:9px;font-weight:bold;font-size:12px;cursor:pointer;transition:background .15s, filter .15s, box-shadow .15s;box-shadow:0 2px 8px rgba(142,68,173,0.4)}',
            '.ls-exp-go:hover{background:linear-gradient(180deg,#9b59b6,#7d3c98);filter:brightness(1.15);box-shadow:0 0 10px rgba(142,68,173,0.6)}',
            '.ls-exp-go:active{filter:brightness(0.9)}',
            '.ls-exp-go:disabled{opacity:0.5;cursor:not-allowed}',

            '.ls-cour-go{flex-shrink:0;width:100%;background:linear-gradient(180deg,#2980b9,#1f618d);color:#fff;border:none;border-radius:3px;padding:8px;font-weight:bold;font-size:12px;cursor:pointer;transition:background .15s, filter .15s, box-shadow .15s}',
            '.ls-cour-go:hover{background:linear-gradient(180deg,#3498db,#2980b9);filter:brightness(1.15);box-shadow:0 0 10px rgba(41,128,185,0.4)}',
            '.ls-cour-go:active{filter:brightness(0.9)}',
            '.ls-cour-go:disabled{opacity:0.5;cursor:not-allowed}',

            '#ls-cart-bulk-send-btn{transition:background .15s, filter .15s, box-shadow .15s}',
            '#ls-cart-bulk-send-btn:hover{filter:brightness(1.15);box-shadow:0 0 10px rgba(0,188,255,0.5)}',
            '#ls-cart-bulk-send-btn:active{filter:brightness(0.9)}',

            /* Cart Card Styles */
            '.ls-cart-card{background:#131d2a;border:1px solid #233446;border-radius:6px;padding:8px;margin-bottom:8px;flex-shrink:0}',
            '.ls-cart-card-head{display:flex;align-items:center;justify-content:space-between;gap:6px;border-bottom:1px solid #1a2c3f;padding-bottom:5px;margin-bottom:6px}',
            '.ls-cart-mbtn{background:#1a2c3f;color:#8899aa;border:1px solid #2c3e50;padding:2px 6px;border-radius:3px;cursor:pointer;font-size:9.5px;font-weight:bold;transition:all .15s;line-height:1.2}',
            '.ls-cart-mbtn.active{background:#27ae60;color:#fff;border-color:#2ecc71}',
            '.ls-cart-mbtn.deploy.active{background:#2980b9;color:#fff;border-color:#3498db}',
            '.ls-cart-mbtn:hover:not(.active){background:#243a52;color:#fff}',
            '#ls-panel.ls-compact .ls-cart-card{padding:6px;margin-bottom:6px}',
            '#ls-panel.ls-compact .ls-cart-card-head{flex-wrap:wrap;gap:3px}',
            '#ls-panel.ls-compact .ls-cart-card-head > div:first-child{flex:1 1 100%;margin-bottom:2px}',
            '#ls-panel.ls-compact .ls-cart-card-head > div:last-child{margin-left:auto;gap:2px}',
            '#ls-panel.ls-compact .ls-cart-mbtn{padding:1px 4px;font-size:8.5px}',

            '.ls-ship-pill{background:#1a2c3f;color:#8899aa;border:1px solid #2c3e50;padding:2px 8px;border-radius:12px;cursor:pointer;font-size:10px;font-weight:bold;transition:all .15s;user-select:none;line-height:1.3}',
            '.ls-ship-pill.active{background:#00bcff;color:#000;border-color:#00bcff;box-shadow:0 0 6px rgba(0,188,255,0.4)}',
            '.ls-ship-pill:hover{border-color:#00bcff}',

            /* Origin Card Styles & Courier Inputs */
            '#ls-cart-card-origin, #ls-cour-card-origin{position:relative !important;z-index:1005 !important;overflow:visible !important}',
            '.ls-cour-inputs-wrap{display:flex;gap:3px;align-items:center}',
            '.ls-extra-row .ls-cour-inputs-wrap{flex:1 1 auto;min-width:0}',
            '.ls-extra-row .ls-cour-inp{flex:1 1 0;width:40px;min-width:24px;max-width:48px}',
            '.ls-cour-row-inputs{display:inline-flex;gap:3px;align-items:center;flex-shrink:0;margin-left:auto}',
            '.ls-cour-row-inputs .ls-cour-inp{width:44px;flex-shrink:0;padding:2px 3px;font-size:10px;text-align:right}',
            '.ls-cour-origin-badge{margin-left:auto;flex-shrink:0;text-align:right;font-size:9.5px;color:#00bcff;font-weight:bold;white-space:nowrap}',
            '.ls-cour-inp{font-family:monospace;border-radius:3px;box-sizing:border-box;padding:2px 3px;font-size:10px;text-align:right}',
            '.ls-cour-inp-m{color:#ffbe3b;border:1px solid #4a3b1a;background:#0a0e17}',
            '.ls-cour-inp-m:focus{border-color:#ffbe3b;outline:none}',
            '.ls-cour-inp-c{color:#5dade2;border:1px solid #1c3952;background:#0a0e17}',
            '.ls-cour-inp-c:focus{border-color:#5dade2;outline:none}',
            '.ls-cour-inp-d{color:#2ecc71;border:1px solid #174229;background:#0a0e17}',
            '.ls-cour-inp-d:focus{border-color:#2ecc71;outline:none}',
            '#ls-panel.ls-compact .ls-cour-row-inputs .ls-cour-inp{width:36px;padding:1px 2px;font-size:9px}',
            '#ls-panel.ls-narrow .ls-cour-row-inputs .ls-cour-inp{width:28px;padding:1px 1px;font-size:8.5px}',
            '#ls-panel.ls-compact .ls-extra-row .ls-cour-inp{width:32px;max-width:38px;min-width:22px;padding:1px 1px;font-size:9px}',
            '#ls-panel.ls-narrow .ls-extra-row .ls-cour-inp{width:26px;max-width:32px;min-width:20px;padding:1px 1px;font-size:8.5px}',

            /* Global Panel Scaling Rules */
            '#ls-panel.ls-compact #ls-body{padding:6px 8px}',
            '#ls-panel.ls-compact .ls-coll-card{padding:6px 8px;margin-bottom:6px}',
            '#ls-panel.ls-compact #ls-header{padding:6px 8px}',
            '#ls-panel.ls-compact #ls-header-title{font-size:11.5px}',
            '#ls-panel.ls-compact .ls-coll-go, #ls-panel.ls-compact .ls-cour-go, #ls-panel.ls-compact .ls-exp-go, #ls-panel.ls-compact #ls-cart-bulk-send-btn{padding:6px 4px;font-size:11px}',
            '#ls-panel.ls-narrow .ls-coll-go, #ls-panel.ls-narrow .ls-cour-go, #ls-panel.ls-narrow .ls-exp-go, #ls-panel.ls-narrow #ls-cart-bulk-send-btn{padding:5px 2px;font-size:10px}',
            '#ls-panel.ls-compact #ls-footer-drag{padding:3px 6px}',
            '#ls-panel.ls-compact #ls-footer-drag-handle span:nth-child(2){font-size:9.5px;letter-spacing:3px}',
            '#ls-panel.ls-compact #ls-alarm-att-sound, #ls-panel.ls-compact #ls-alarm-esp-sound, #ls-panel.ls-compact #ls-setting-lang, #ls-panel.ls-compact #ls-setting-theme{width:auto !important;max-width:140px;flex:1}',

            /* ==================== FENERBAHÇE SKIN (DARK & NAVY-YELLOW) ==================== */
            '#ls-panel.ls-theme-fb{background:rgba(4,14,28,0.98) !important;border:2px solid #ffd700 !important;box-shadow:0 12px 36px rgba(0,15,40,0.95), 0 0 16px rgba(255,215,0,0.3) !important;color:#e6edf5 !important}',
            '#ls-panel.ls-theme-fb #ls-header{background:linear-gradient(90deg,#00122e 0%,#002d62 50%,#00122e 100%) !important;border-bottom:2px solid #ffd700 !important}',
            '#ls-panel.ls-theme-fb #ls-header-title{color:#ffd700 !important;text-shadow:0 0 8px rgba(255,215,0,0.5) !important}',
            '#ls-fab.ls-theme-fb{background:linear-gradient(135deg,#001736 0%,#002d62 100%) !important;border:2px solid #ffd700 !important;box-shadow:0 4px 16px rgba(0,20,60,0.8), 0 0 12px rgba(255,215,0,0.5) !important}',

            /* Fenerbahçe Tabs & Custom Tab Icons */
            '#ls-panel.ls-theme-fb #ls-tabs{background:#020914 !important;border-bottom:1px solid #132a4a !important}',
            '#ls-panel.ls-theme-fb .ls-tab{color:#8da4c4 !important}',
            '#ls-panel.ls-theme-fb .ls-tab:hover{color:#ffd700 !important;background:rgba(255,215,0,0.08) !important}',
            '#ls-panel.ls-theme-fb .ls-tab.active{background:#00224d !important;color:#ffd700 !important;border-bottom:2px solid #ffd700 !important;box-shadow:inset 0 -2px 6px rgba(255,215,0,0.25) !important}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="cart"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="cart"] .ls-tab-icon::after{content:"🏟️";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="collector"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="collector"] .ls-tab-icon::after{content:"⚽";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="courier"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="courier"] .ls-tab-icon::after{content:"👟";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="debris"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="debris"] .ls-tab-icon::after{content:"🧤";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="expedition"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="expedition"] .ls-tab-icon::after{content:"🏆";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="scanner"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="scanner"] .ls-tab-icon::after{content:"🦅";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="finder"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="finder"] .ls-tab-icon::after{content:"⭐";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="alarm"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="alarm"] .ls-tab-icon::after{content:"📢";visibility:visible;position:absolute;left:0;top:0}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="settings"] .ls-tab-icon{visibility:hidden;position:relative}',
            '#ls-panel.ls-theme-fb .ls-tab[data-tab="settings"] .ls-tab-icon::after{content:"⚙️";visibility:visible;position:absolute;left:0;top:0}',

            /* Fenerbahçe Küçük Butonlar (Futbol Topu ⚽) */
            '#ls-panel.ls-theme-fb .ls-coll-jump, #ls-panel.ls-theme-fb .ls-nav-btn{visibility:hidden;position:relative;background:#ffd700 !important;color:#001736 !important;border:1px solid #ffe600 !important;border-radius:4px !important;box-shadow:0 0 6px rgba(255,215,0,0.4) !important}',
            '#ls-panel.ls-theme-fb .ls-coll-jump::after, #ls-panel.ls-theme-fb .ls-nav-btn::after{content:"⚽";visibility:visible;position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:11px}',
            '#ls-panel.ls-theme-fb .ls-coll-jump:hover, #ls-panel.ls-theme-fb .ls-nav-btn:hover{background:#ffffff !important;box-shadow:0 0 10px rgba(255,255,255,0.8) !important;transform:rotate(45deg);transition:transform .2s ease, background .15s !important}',
            '#ls-panel.ls-theme-fb .ls-coll-selbar .ls-btn-sm{background:#091a33 !important;border:1px solid #1a3a66 !important;color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-coll-selbar .ls-btn-sm:hover{background:#002d62 !important;border-color:#ffd700 !important;color:#ffffff !important;box-shadow:0 0 6px rgba(255,215,0,0.3) !important}',
            '#ls-panel.ls-theme-fb #ls-cour-sync-apply, #ls-panel.ls-theme-fb #ls-cart-add-extra-btn, #ls-panel.ls-theme-fb #ls-scan-btn, #ls-panel.ls-theme-fb #ls-find-btn{background:linear-gradient(180deg,#002d62,#001736) !important;border:1px solid #ffd700 !important;color:#ffd700 !important;font-weight:bold !important}',
            '#ls-panel.ls-theme-fb #ls-cour-sync-apply:hover, #ls-panel.ls-theme-fb #ls-cart-add-extra-btn:hover, #ls-panel.ls-theme-fb #ls-scan-btn:hover, #ls-panel.ls-theme-fb #ls-find-btn:hover{background:linear-gradient(180deg,#003e87,#00224d) !important;color:#ffffff !important;box-shadow:0 0 8px rgba(255,215,0,0.4) !important}',
            '#ls-panel.ls-theme-fb .ls-ship-pill{background:#091a33 !important;border-color:#1a3a66 !important;color:#9cb2cd !important}',
            '#ls-panel.ls-theme-fb .ls-ship-pill.active{background:#ffd700 !important;color:#001736 !important;border-color:#ffe600 !important;box-shadow:0 0 8px rgba(255,215,0,0.5) !important}',
            '#ls-panel.ls-theme-fb .ls-cart-mbtn{background:#091a33 !important;border-color:#1a3a66 !important;color:#9cb2cd !important}',
            '#ls-panel.ls-theme-fb .ls-cart-mbtn.active{background:#ffd700 !important;color:#001736 !important;border-color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-cart-mbtn.deploy.active{background:#00387a !important;color:#ffd700 !important;border-color:#ffd700 !important}',

            /* Fenerbahçe En Alttaki Büyük Butonlar (Kale Ağları Deseni 🥅) */
            '#ls-panel.ls-theme-fb .ls-coll-go, #ls-panel.ls-theme-fb .ls-cour-go, #ls-panel.ls-theme-fb .ls-exp-go, #ls-panel.ls-theme-fb #ls-cart-bulk-send-btn{background-color:#041024 !important;background-image:repeating-linear-gradient(45deg,rgba(255,215,0,0.22) 0,rgba(255,215,0,0.22) 1.5px,transparent 0,transparent 9px),repeating-linear-gradient(-45deg,rgba(255,215,0,0.22) 0,rgba(255,215,0,0.22) 1.5px,transparent 0,transparent 9px),linear-gradient(180deg,#002654 0%,#00122e 100%) !important;border:2px solid #ffd700 !important;color:#ffffff !important;text-shadow:0 1px 3px #000, 0 0 6px rgba(0,0,0,0.9) !important;box-shadow:0 0 14px rgba(255,215,0,0.35), inset 0 0 10px rgba(0,0,0,0.6) !important;letter-spacing:0.5px !important}',
            '#ls-panel.ls-theme-fb .ls-coll-go::before, #ls-panel.ls-theme-fb .ls-cour-go::before, #ls-panel.ls-theme-fb .ls-exp-go::before, #ls-panel.ls-theme-fb #ls-cart-bulk-send-btn::before{content:"🥅 ⚽ "}',
            '#ls-panel.ls-theme-fb .ls-coll-go::after, #ls-panel.ls-theme-fb .ls-cour-go::after, #ls-panel.ls-theme-fb .ls-exp-go::after, #ls-panel.ls-theme-fb #ls-cart-bulk-send-btn::after{content:" ⚽ 🥅"}',
            '#ls-panel.ls-theme-fb.ls-compact .ls-coll-go::before, #ls-panel.ls-theme-fb.ls-compact .ls-cour-go::before, #ls-panel.ls-theme-fb.ls-compact .ls-exp-go::before, #ls-panel.ls-theme-fb.ls-compact #ls-cart-bulk-send-btn::before{content:"⚽ " !important}',
            '#ls-panel.ls-theme-fb.ls-compact .ls-coll-go::after, #ls-panel.ls-theme-fb.ls-compact .ls-cour-go::after, #ls-panel.ls-theme-fb.ls-compact .ls-exp-go::after, #ls-panel.ls-theme-fb.ls-compact #ls-cart-bulk-send-btn::after{content:"" !important;display:none !important}',
            '#ls-panel.ls-theme-fb .ls-coll-go:hover, #ls-panel.ls-theme-fb .ls-cour-go:hover, #ls-panel.ls-theme-fb .ls-exp-go:hover, #ls-panel.ls-theme-fb #ls-cart-bulk-send-btn:hover{background-color:#002d62 !important;background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 1.5px,transparent 0,transparent 9px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 1.5px,transparent 0,transparent 9px),linear-gradient(180deg,#003b80 0%,#001736 100%) !important;border-color:#ffffff !important;color:#ffd700 !important;box-shadow:0 0 20px rgba(255,215,0,0.65), inset 0 0 12px rgba(255,215,0,0.35) !important;filter:brightness(1.15) !important}',

            /* Fenerbahçe Kartlar, Satırlar, Kaydırma Çubuğu & Arayüz */
            '#ls-panel.ls-theme-fb .ls-coll-card, #ls-panel.ls-theme-fb .ls-cart-card, #ls-panel.ls-theme-fb .ls-finder-card, #ls-panel.ls-theme-fb #tc-alarm > div, #ls-panel.ls-theme-fb #tc-debris > div, #ls-panel.ls-theme-fb #tc-settings > div{background:#06152b !important;border-color:#132a4a !important}',
            '#ls-panel.ls-theme-fb #ls-scan-results .ls-scan-item{background:rgba(0,45,98,0.25) !important;border-left:3px solid #ffd700 !important;color:#e6edf5 !important}',
            '#ls-panel.ls-theme-fb .ls-coll-prow, #ls-panel.ls-theme-fb .ls-coll-mrow{background:rgba(0,45,98,0.18) !important;border:1px solid rgba(255,215,0,0.08) !important}',
            '#ls-panel.ls-theme-fb .ls-coll-prow:hover, #ls-panel.ls-theme-fb .ls-coll-mrow:hover{background:rgba(255,215,0,0.09) !important;border-color:rgba(255,215,0,0.25) !important}',
            '#ls-panel.ls-theme-fb .ls-coll-prow input[type=checkbox], #ls-panel.ls-theme-fb .ls-coll-mrow input[type=checkbox]{accent-color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-coll-name .crd{color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-coll-head span:first-child{color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-cour-origin-badge, #ls-panel.ls-theme-fb .ls-coll-dest .note{color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb #ls-footer-drag{background:linear-gradient(90deg,#00122e,#002d62) !important;border-top:1px solid #ffd700 !important;color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb #ls-footer-drag-handle span:nth-child(2){color:#ffd700 !important;text-shadow:0 0 6px rgba(255,215,0,0.5) !important}',
            '#ls-panel.ls-theme-fb #ls-body::-webkit-scrollbar-track, #ls-panel.ls-theme-fb .ls-coll-list::-webkit-scrollbar-track, #ls-panel.ls-theme-fb #ls-cart-list::-webkit-scrollbar-track, #ls-panel.ls-theme-fb #ls-find-results::-webkit-scrollbar-track, #ls-panel.ls-theme-fb #ls-scan-results::-webkit-scrollbar-track{background:#020914 !important}',
            '#ls-panel.ls-theme-fb #ls-body::-webkit-scrollbar-thumb, #ls-panel.ls-theme-fb .ls-coll-list::-webkit-scrollbar-thumb, #ls-panel.ls-theme-fb #ls-cart-list::-webkit-scrollbar-thumb, #ls-panel.ls-theme-fb #ls-find-results::-webkit-scrollbar-thumb, #ls-panel.ls-theme-fb #ls-scan-results::-webkit-scrollbar-thumb{background:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-toggle-switch input:checked + .ls-toggle-slider{background-color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-mode-btn{background:#00224d !important;color:#ffd700 !important;border-color:#ffd700 !important}',
            '#ls-panel.ls-theme-fb .ls-mode-btn.fuel{background:#123a24 !important;color:#2ecc71 !important;border-color:#2ecc71 !important}',
        ].join('\n');
        document.head.appendChild(style);

        // SVG Lightning Logo
        const boltSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="vertical-align:middle"><path d="M13 2L3 14h8l-1 8 11-12h-8l1-8z" fill="#ffeb3b" stroke="#000" stroke-width="0.75"/></svg>';

        // FAB
        const fab = document.createElement('div');
        fab.id = 'ls-fab';
        fab.innerHTML = boltSvg;
        fab.title = 'LuckyStrike OGame Helper';
        document.body.appendChild(fab);

        // PANEL
        const panel = document.createElement('div');
        panel.id = 'ls-panel';
        panel.innerHTML =
            '<div id="ls-header">' +
                '<span id="ls-header-title">' + boltSvg + ' LuckyStrike Helper <span style="font-size:10px;color:#8899aa;font-weight:normal;opacity:0.8">v13.1</span></span>' +
                '<div style="display:flex;align-items:center;gap:6px">' +
                    '<button id="ls-header-stop-btn" class="ls-btn-d ls-btn-sm" style="display:none;padding:2px 7px;font-size:10px;align-items:center;gap:3px;cursor:pointer" title="Tekrarlayan bu alarmı sustur">⏹️ Sustur</button>' +
                    '<span id="ls-close">✖</span>' +
                '</div>' +
            '</div>' +
            '<div id="ls-tabs">' +
                '<div class="ls-tab" data-tab="cart"><span class="ls-tab-icon">🏗️</span><span class="ls-tab-label" data-i18n="tab_cart">Maliyet</span></div>' +
                '<div class="ls-tab" data-tab="collector"><span class="ls-tab-icon">📦</span><span class="ls-tab-label" data-i18n="tab_collector">Toplayıcı</span></div>' +
                '<div class="ls-tab" data-tab="courier"><span class="ls-tab-icon">📬</span><span class="ls-tab-label" data-i18n="tab_courier">Postacı</span></div>' +
                '<div class="ls-tab" data-tab="debris"><span class="ls-tab-icon">🛰️</span><span class="ls-tab-label" data-i18n="tab_debris">Harabe</span></div>' +
                '<div class="ls-tab" data-tab="expedition"><span class="ls-tab-icon">🧭</span><span class="ls-tab-label" data-i18n="tab_expedition">Keşif</span></div>' +
                '<div class="ls-tab" data-tab="scanner"><span class="ls-tab-icon">🌌</span><span class="ls-tab-label" data-i18n="tab_scanner">Tarayıcı</span></div>' +
                '<div class="ls-tab" data-tab="finder"><span class="ls-tab-icon">🔍</span><span class="ls-tab-label" data-i18n="tab_finder">Arama</span></div>' +
                '<div class="ls-tab" data-tab="alarm"><span class="ls-tab-icon">🚨</span><span class="ls-tab-label" data-i18n="tab_alarm">Alarm</span></div>' +
                '<div class="ls-tab" data-tab="settings"><span class="ls-tab-icon">⚙️</span><span class="ls-tab-label" data-i18n="tab_settings">Ayarlar</span></div>' +
            '</div>' +
            '<div id="ls-tab-tooltip"><div id="ls-tab-tooltip-title"></div><div id="ls-tab-tooltip-desc"></div></div>' +
            '<div id="ls-body">' +

                // CART TAB
                '<div id="tc-cart" class="ls-tc">' +
                    '<div id="ls-cart-card-origin" class="ls-coll-card" style="margin-bottom:8px;flex-shrink:0">' +
                        '<div class="ls-origin-head-row">' +
                            '<span class="ls-label" data-i18n="target_center_head">📍 Merkez</span>' +
                            '<button type="button" id="ls-cart-cur-btn" class="ls-btn-sm ls-btn-here" style="background:#8e44ad;color:#fff;padding:2px 7px;font-size:10px;margin-left:auto;margin-right:6px;border:1px solid #9b59b6;border-radius:3px;cursor:pointer;font-weight:bold" title="Çıkış noktasını şu an bulunduğunuz gezegen/ay yapar" data-i18n-title="cour_here_title" data-i18n="cour_here">Burası</button>' +
                            '<div style="display:flex;gap:4px">' +
                                '<button type="button" id="ls-cart-mission-3" class="ls-coll-mbtn active" data-i18n="coll_transport">Nakliye</button>' +
                                '<button type="button" id="ls-cart-mission-4" class="ls-coll-mbtn deploy" data-i18n="coll_deploy">Konuşlandır</button>' +
                                '<button type="button" id="ls-cart-mode-btn" class="ls-mode-btn" title="Taşıma Önceliği: Hız (Rehber > KN > BN). Tıkla: Yakıt Moduna Geç" data-i18n-title="mode_speed_title" data-i18n="mode_speed">⚡ Hız</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ls-coll-row">' +
                            '<div class="ls-coll-combo">' +
                                '<div id="ls-cart-origin-btn" class="ls-coll-sel">' +
                                    '<span id="ls-cart-origin-label"><b data-i18n="cour_loading">🪐 Yükleniyor...</b></span>' +
                                    '<span style="color:#00bcff;font-size:9px">▼</span>' +
                                '</div>' +
                                '<div id="ls-cart-origin-dd" class="ls-coll-dd"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ls-coll-card" style="margin-bottom:8px;flex-shrink:0">' +
                        '<div class="ls-coll-row" style="margin-bottom:5px">' +
                            '<span class="ls-label" style="width:52px" data-i18n="cour_ships">🚀 Gemi</span>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-cart-ship-bn"> <span data-i18n="cour_bn">BN</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-cart-ship-kn"> <span data-i18n="cour_kn">KN</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-cart-ship-rehber"> <span data-i18n="cour_rehber">Rehber</span></label>' +
                        '</div>' +
                        '<div class="ls-extra-row">' +
                            '<span style="color:#00bcff;font-weight:bold;font-size:11px;white-space:nowrap" data-i18n="cart_extra_title">⚡ Ek Maliyet</span>' +
                            '<div class="ls-cour-inputs-wrap" style="flex:1">' +
                                '<input type="text" id="ls-cart-extra-m" class="ls-cour-inp ls-cour-inp-m" placeholder="Metal" data-i18n-placeholder="cart_metal_ph" title="Her hedefe eklenecek Metal miktarı (örn: 1m, 500k)">' +
                                '<input type="text" id="ls-cart-extra-c" class="ls-cour-inp ls-cour-inp-c" placeholder="Kristal" data-i18n-placeholder="cart_crys_ph" title="Her hedefe eklenecek Kristal miktarı (örn: 2m, 250k)">' +
                                '<input type="text" id="ls-cart-extra-d" class="ls-cour-inp ls-cour-inp-d" placeholder="Deu" data-i18n-placeholder="cart_deut_ph" title="Her hedefe eklenecek Deuterium miktarı (örn: 3m, 100k)">' +
                            '</div>' +
                            '<button type="button" id="ls-cart-add-extra-btn" class="ls-btn-sm" style="background:#27ae60;color:#fff;border:none;padding:3px 7px;font-size:10px;font-weight:bold;border-radius:3px;cursor:pointer;white-space:nowrap" title="Girilen ek maliyeti seçili gezegen sepetlerine kalem olarak ekler">📥 Sepete Ekle</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ls-coll-selbar">' +
                        '<button id="ls-cart-sel-all" class="ls-btn-sm" title="Tüm gezegen sepetlerini seç" data-i18n="cart_sel_all">☑️ Tümünü Seç</button>' +
                        '<button id="ls-cart-sel-none" class="ls-btn-sm" title="Tüm gezegen sepetlerinin seçimini kaldır" data-i18n="cart_sel_none">◻️ Seçimi Temizle</button>' +
                        '<button id="ls-cart-copy" class="ls-btn-sm" title="Sepeti panoya kopyala" data-i18n="cart_copy">📋 Panoya Kopyala</button>' +
                        '<button id="ls-cart-clear" class="ls-btn-sm" style="color:#e74c3c" title="Tüm sepeti temizle" data-i18n="cart_clear">🗑️ Temizle</button>' +
                    '</div>' +
                    '<div id="ls-cart-list" style="flex:1;min-height:40px;overflow-y:auto;overflow-x:hidden;margin-bottom:8px"></div>' +
                    '<div id="ls-cart-totals" style="flex-shrink:0;margin-top:auto"></div>' +
                '</div>' +

                // SCANNER TAB
                '<div id="tc-scanner" class="ls-tc">' +
                    '<div class="ls-row">' +
                        '<div class="ls-col"><span class="ls-label" data-i18n="scan_g_start">Galaksi Başlangıç</span><input type="number" id="ls-sg1" class="ls-inp" min="1" max="9" style="width:100%"></div>' +
                        '<div class="ls-col"><span class="ls-label" data-i18n="scan_g_end">Galaksi Bitiş</span><input type="number" id="ls-sg2" class="ls-inp" min="1" max="9" style="width:100%"></div>' +
                    '</div>' +
                    '<div class="ls-row">' +
                        '<div class="ls-col"><span class="ls-label" data-i18n="scan_s_start">Sistem Başlangıç</span><input type="number" id="ls-ss1" class="ls-inp" min="1" max="499" style="width:100%"></div>' +
                        '<div class="ls-col"><span class="ls-label" data-i18n="scan_s_end">Sistem Bitiş</span><input type="number" id="ls-ss2" class="ls-inp" min="1" max="499" style="width:100%"></div>' +
                    '</div>' +
                    '<div style="margin-bottom:6px">' +
                        '<span class="ls-label" data-i18n="scan_slots_label">Hedef Slotlar (virgülle ayırın)</span>' +
                        '<input type="text" id="ls-slots" class="ls-inp" style="width:100%" placeholder="8 veya 7, 9" data-i18n-placeholder="scan_slots_ph">' +
                    '</div>' +
                    '<div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:2px">' +
                        '<span class="ls-chip" data-slots="8" data-min="1" data-i18n="scan_chip_8">🎯 Sadece 8</span>' +
                        '<span class="ls-chip" data-slots="7, 9" data-min="1" data-i18n="scan_chip_7_9">⭐ 7, 9</span>' +
                        '<span class="ls-chip" data-slots="13, 14, 15" data-min="1" data-i18n="scan_chip_13_15">❄️ 13-15 (Deut)</span>' +
                        '<span class="ls-chip" data-slots="1, 2, 3" data-min="1" data-i18n="scan_chip_1_3">☀️ 1-3 (Solar)</span>' +
                        '<span class="ls-chip" data-slots="1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15" data-min="15">🪐 Tamamen Boş (1-15)</span>' +
                    '</div>' +
                    '<div style="display:justify;justify-content:space-between;align-items:center;margin-bottom:8px;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:4px;border:1px solid #1a2c3f;display:flex">' +
                        '<span class="ls-label" style="font-size:11px;color:#d1d8e0" data-i18n="scan_min_empty">👥 Min. Eşzamanlı Boş Slot:</span>' +
                        '<select id="ls-min" class="ls-inp" style="width:80px;padding:3px 6px;text-align:center">' +
                            '<option value="1">1 slot</option>' +
                            '<option value="2">2 slot</option>' +
                            '<option value="3">3 slot</option>' +
                            '<option value="4">4 slot</option>' +
                            '<option value="5">5 slot</option>' +
                            '<option value="6">6 slot</option>' +
                            '<option value="7">7 slot</option>' +
                            '<option value="8">8 slot</option>' +
                            '<option value="9">9 slot</option>' +
                            '<option value="10">10 slot</option>' +
                            '<option value="11">11 slot</option>' +
                            '<option value="12">12 slot</option>' +
                            '<option value="13">13 slot</option>' +
                            '<option value="14">14 slot</option>' +
                            '<option value="15">15 slot</option>' +
                        '</select>' +
                    '</div>' +
                    '<div style="display:flex;gap:6px;margin-top:4px">' +
                        '<button id="ls-scan-btn" class="ls-btn" style="flex:1" data-i18n="scan_start_btn">🔍 Taramayı Başlat</button>' +
                        '<button id="ls-scan-refresh-btn" class="ls-btn-warn" style="flex-shrink:0" title="Evren verisini (universe.xml) sunucudan zorla yenile" data-i18n-title="scan_refresh_title" data-i18n="scan_refresh_btn">🔄 Güncelle</button>' +
                    '</div>' +
                    '<div class="ls-prog" id="ls-scan-progress"><div class="ls-prog-bar" id="ls-scan-bar"></div></div>' +
                    '<div id="ls-scan-status" style="font-size:10px;text-align:center;color:#8899aa;margin-top:4px"></div>' +
                    '<div id="ls-scan-results-box" style="display:none;margin-top:8px;flex:1;min-height:60px;flex-direction:column;overflow:hidden">' +
                        '<button id="ls-scan-copy" class="ls-btn" style="width:100%;margin-bottom:6px;flex-shrink:0" data-i18n="scan_copy_coords">📋 Koordinatları Kopyala</button>' +
                        '<div id="ls-scan-results" style="flex:1;min-height:60px;overflow-y:auto;overflow-x:hidden;width:100%;box-sizing:border-box"></div>' +
                    '</div>' +
                '</div>' +

                // FINDER TAB
                '<div id="tc-finder" class="ls-tc">' +
                    '<div style="width:100%;max-width:320px;margin:0 auto;text-align:center">' +
                        '<div style="font-size:10px;color:#8899aa;margin-bottom:8px" data-i18n="find_desc">Evrendeki tüm oyuncuları ve gezegenlerini bulun.</div>' +
                        '<input type="text" id="ls-find-q" class="ls-inp" style="width:100%;margin-bottom:8px;padding:6px 10px;font-size:11px;text-align:center;border-radius:4px" placeholder="Oyuncu veya gezegen adı..." data-i18n-placeholder="find_ph">' +
                        '<div style="display:flex;justify-content:center;gap:14px;margin-bottom:8px;font-size:11px">' +
                            '<label style="cursor:pointer;display:inline-flex;align-items:center;gap:4px"><input type="radio" name="ls-find-type" value="player" checked> <span data-i18n="find_player">Oyuncu Adı</span></label>' +
                            '<label style="cursor:pointer;display:inline-flex;align-items:center;gap:4px"><input type="radio" name="ls-find-type" value="planet"> <span data-i18n="find_planet">Gezegen Adı</span></label>' +
                        '</div>' +
                        '<div style="display:flex;gap:6px;margin-bottom:4px">' +
                            '<button id="ls-find-btn" class="ls-btn" style="flex:1;padding:6px 12px;font-size:11px" data-i18n="find_btn">🔍 Ara</button>' +
                            '<button id="ls-find-refresh-btn" class="ls-btn-warn" style="flex-shrink:0" title="Evren ve oyuncu verisini sunucudan zorla yenile" data-i18n-title="find_refresh_title" data-i18n="scan_refresh_btn">🔄 Güncelle</button>' +
                        '</div>' +
                        '<div class="ls-prog" id="ls-find-progress"><div class="ls-prog-bar" id="ls-find-bar"></div></div>' +
                        '<div id="ls-find-cache-info" style="font-size:10px;text-align:center;color:#607d8b;margin-top:4px"></div>' +
                        '<div id="ls-find-status" style="font-size:10px;text-align:center;color:#8899aa;margin-top:4px"></div>' +
                    '</div>' +
                    '<div id="ls-find-results" style="flex:1;min-height:60px;overflow-y:auto;overflow-x:hidden;margin-top:8px"></div>' +
                '</div>' +

                // ALARM TAB
                '<div id="tc-alarm" class="ls-tc">' +
                    '<div id="ls-alarm-status-banner" style="background:#162436;border:1px solid #1a3a5c;border-radius:6px;padding:8px 10px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">' +
                        '<div style="display:flex;align-items:center;gap:8px">' +
                            '<span id="ls-alarm-dot" style="width:10px;height:10px;border-radius:50%;background:#2ecc71;display:inline-block;box-shadow:0 0 6px #2ecc71"></span>' +
                            '<span id="ls-alarm-status-text" style="font-size:11px;font-weight:bold;color:#2ecc71" data-i18n="alarm_status_active_safe">Gözcü Aktif · Tehdit Yok</span>' +
                        '</div>' +
                        '<button id="ls-alarm-stop-btn" class="ls-btn-d ls-btn-sm" style="display:none;padding:3px 8px;font-size:10px;align-items:center;gap:3px;cursor:pointer" title="Tekrarlayan bu alarmı sustur" data-i18n-title="stop_alarm_title" data-i18n="stop_alarm">⏹️ Sustur</button>' +
                    '</div>' +

                    // Attack alert card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<span style="font-weight:bold;color:#e74c3c;font-size:12px" data-i18n="alarm_att_title">🚨 Saldırı Alarmı</span>' +
                            '<label class="ls-toggle-switch">' +
                                '<input type="checkbox" id="ls-alarm-att-toggle">' +
                                '<span class="ls-toggle-slider"></span>' +
                            '</label>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                            '<span style="font-size:11px;color:#d1d8e0" data-i18n="alarm_sound_type">🎵 Ses Tipi:</span>' +
                            '<select id="ls-alarm-att-sound" class="ls-inp" style="width:180px;padding:2px 4px;font-size:10px">' +
                                '<option value="klaxon" data-i18n="alarm_sound_klaxon">Taktiksel Klakson (Varsayılan)</option>' +
                                '<option value="siren" data-i18n="alarm_sound_siren">Kırmızı Alarm Sireni</option>' +
                                '<option value="pulse" data-i18n="alarm_sound_pulse">Acil Durum Nabzı</option>' +
                            '</select>' +
                        '</div>' +
                        '<button id="ls-alarm-att-test" class="ls-btn-sm" style="background:#c0392b;color:#fff;border:none;padding:5px 10px;width:100%" data-i18n="alarm_att_test">🔊 Saldırı Sesini Test Et</button>' +
                    '</div>' +

                    // Espionage alert card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<span style="font-weight:bold;color:#3498db;font-size:12px" data-i18n="alarm_esp_title">📡 Sonda / Casusluk Uyarısı</span>' +
                            '<label class="ls-toggle-switch">' +
                                '<input type="checkbox" id="ls-alarm-esp-toggle">' +
                                '<span class="ls-toggle-slider"></span>' +
                            '</label>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                            '<span style="font-size:11px;color:#d1d8e0" data-i18n="alarm_sound_type">🎵 Ses Tipi:</span>' +
                            '<select id="ls-alarm-esp-sound" class="ls-inp" style="width:180px;padding:2px 4px;font-size:10px">' +
                                '<option value="sonar_deep" data-i18n="alarm_sound_sonar_deep">Derin Deniz Sonarı (Klasik Ping)</option>' +
                                '<option value="sonar_hunter" data-i18n="alarm_sound_sonar_hunter">Aktif Avcı Sonarı (Yüksek Ping)</option>' +
                                '<option value="sonar_echo" data-i18n="alarm_sound_sonar_echo">Taktik Yankı Sonarı (Çift Eko)</option>' +
                            '</select>' +
                        '</div>' +
                        '<button id="ls-alarm-esp-test" class="ls-btn-sm" style="background:#2980b9;color:#fff;border:none;padding:5px 10px;width:100%" data-i18n="alarm_esp_test">🔊 Sonda Sesini Test Et</button>' +
                    '</div>' +

                    // Volume slider card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<span style="color:#d1d8e0;font-size:11px" data-i18n="alarm_volume_label">🔊 Ses Seviyesi:</span>' +
                            '<span id="ls-volume-val" style="font-weight:bold;color:#00bcff;font-size:11px">70%</span>' +
                        '</div>' +
                        '<input type="range" id="ls-volume-slider" min="0" max="100" value="70" style="width:100%;accent-color:#00bcff;cursor:pointer">' +
                    '</div>' +

                    // Repeat interval card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<span style="color:#d1d8e0;font-size:11px" data-i18n="alarm_repeat_label">⏱️ Tekrar Sıklığı:</span>' +
                            '<select id="ls-alarm-repeat" class="ls-select" style="width:145px;font-size:11px;padding:3px;background:#0a0e17;color:#fff;border:1px solid #2c3e50;border-radius:3px">' +
                                '<option value="0" data-i18n="alarm_repeat_once">Sadece 1 kez çal</option>' +
                                '<option value="5" data-i18n="alarm_repeat_5s">Her 5 saniyede bir</option>' +
                                '<option value="10" data-i18n="alarm_repeat_10s">Her 10 saniyede bir</option>' +
                                '<option value="15" data-i18n="alarm_repeat_15s">Her 15 saniyede bir</option>' +
                                '<option value="30" data-i18n="alarm_repeat_30s">Her 30 saniyede bir</option>' +
                                '<option value="60" data-i18n="alarm_repeat_60s">Her 60 saniyede bir</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                // DEBRIS TAB (HARABE AVCISI)
                '<div id="tc-debris" class="ls-tc">' +
                    '<div id="ls-debris-status-banner" style="flex-shrink:0;background:#162436;border:1px solid #1a3a5c;border-radius:6px;padding:8px 10px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">' +
                        '<div style="display:flex;align-items:center;gap:8px">' +
                            '<span id="ls-debris-dot" style="width:10px;height:10px;border-radius:50%;background:#2ecc71;display:inline-block;box-shadow:0 0 6px #2ecc71"></span>' +
                            '<span id="ls-debris-status-text" style="font-size:11px;font-weight:bold;color:#2ecc71" data-i18n="deb_status_active">Harabe Avcısı Aktif · Galaksi İzleniyor</span>' +
                        '</div>' +
                        '<label class="ls-toggle-switch" title="Harabe izlemeyi aç/kapat" data-i18n-title="deb_toggle_title">' +
                            '<input type="checkbox" id="ls-debris-toggle">' +
                            '<span class="ls-toggle-slider"></span>' +
                        '</label>' +
                    '</div>' +

                    // Debris settings card
                    '<div style="flex-shrink:0;background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="margin-bottom:6px">' +
                            '<span class="ls-label" style="color:#d1d8e0" data-i18n="deb_threshold_label">⚡ Min. Harabe Eşiği (Toplam Kaynak):</span>' +
                            '<input type="text" id="ls-debris-min" class="ls-inp" style="width:100%;font-weight:bold;color:#00bcff;font-family:monospace;margin-top:2px" placeholder="100.000">' +
                        '</div>' +
                        '<div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:8px">' +
                            '<span class="ls-chip ls-debris-chip" data-min="50000">50K</span>' +
                            '<span class="ls-chip ls-debris-chip" data-min="100000">100K</span>' +
                            '<span class="ls-chip ls-debris-chip" data-min="250000">250K</span>' +
                            '<span class="ls-chip ls-debris-chip" data-min="500000">500K</span>' +
                            '<span class="ls-chip ls-debris-chip" data-min="1000000">1M</span>' +
                            '<span class="ls-chip ls-debris-chip" data-min="5000000">5M</span>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                            '<span style="font-size:11px;color:#d1d8e0" data-i18n="deb_sound_label">🎵 Uyarı Sesi:</span>' +
                            '<select id="ls-debris-sound" class="ls-inp" style="width:180px;padding:2px 4px;font-size:10px">' +
                                '<option value="sonar_deep" data-i18n="alarm_sound_sonar_deep">Derin Deniz Sonarı (Klasik Ping)</option>' +
                                '<option value="sonar_hunter" data-i18n="alarm_sound_sonar_hunter">Aktif Avcı Sonarı (Yüksek Ping)</option>' +
                                '<option value="sonar_echo" data-i18n="alarm_sound_sonar_echo">Taktik Yankı Sonarı (Çift Eko)</option>' +
                            '</select>' +
                        '</div>' +
                        '<button id="ls-debris-test-sound" class="ls-btn-sm" style="background:#2980b9;color:#fff;border:none;padding:5px 10px;width:100%" data-i18n="deb_test_sound">🔊 Harabe Sesini Test Et</button>' +
                    '</div>' +

                    // Debris list header with clear button
                    '<div style="flex-shrink:0;display:flex;justify-content:space-between;align-items:center;margin:10px 0 6px 0;padding-bottom:4px;border-bottom:1px solid #1a2c3f">' +
                        '<span style="font-size:11px;font-weight:bold;color:#00bcff" id="ls-debris-count-title">🛰️ Bulunan Harabeler (0)</span>' +
                        '<button id="ls-debris-clear-all" class="ls-btn ls-btn-d ls-btn-sm" style="padding:2px 7px;font-size:10px" title="Tüm harabeleri listeden temizle" data-i18n-title="deb_clear_title" data-i18n="deb_clear_btn">🗑️ Listeyi Temizle</button>' +
                    '</div>' +

                    // Debris items list
                    '<div id="ls-debris-list" style="flex:1;min-height:60px;overflow-y:auto;overflow-x:hidden;width:100%;box-sizing:border-box"></div>' +
                '</div>' +

                // COLLECTOR TAB
                '<div id="tc-collector" class="ls-tc">' +
                    '<div id="ls-coll-card-target" class="ls-coll-card">' +
                        '<div class="ls-origin-head-row">' +
                            '<span class="ls-label" data-i18n="target_center_head">📍 Merkez</span>' +
                            '<button type="button" id="ls-coll-cur-btn" class="ls-btn-sm ls-btn-here" style="background:#8e44ad;color:#fff;padding:2px 7px;font-size:10px;margin-left:auto;margin-right:6px;border:1px solid #9b59b6;border-radius:3px;cursor:pointer;font-weight:bold" title="Hedefi şu an bulunduğunuz gezegen/ay yapar" data-i18n-title="coll_here_title" data-i18n="coll_here">Burası</button>' +
                            '<div style="display:flex;gap:4px">' +
                                '<button type="button" id="ls-coll-mission-3" class="ls-coll-mbtn ' + (collectorSettings.mission === 3 ? 'active' : '') + '" data-i18n="coll_transport">Nakliye</button>' +
                                '<button type="button" id="ls-coll-mission-4" class="ls-coll-mbtn deploy ' + (collectorSettings.mission === 4 ? 'active' : '') + '" data-i18n="coll_deploy">Konuşlandır</button>' +
                                '<button type="button" id="ls-coll-mode-btn" class="ls-mode-btn" title="Taşıma Önceliği: Hız (Rehber > KN > BN). Tıkla: Yakıt Moduna Geç" data-i18n-title="mode_speed_title" data-i18n="mode_speed">⚡ Hız</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ls-coll-row">' +
                            '<div class="ls-coll-combo">' +
                                '<div id="ls-coll-target-btn" class="ls-coll-sel">' +
                                    '<span id="ls-coll-target-label"><b data-i18n="coll_loading">🪐 Yükleniyor...</b></span>' +
                                    '<span style="color:#00bcff;font-size:9px">▼</span>' +
                                '</div>' +
                                '<div id="ls-coll-dd" class="ls-coll-dd"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-card">' +
                        '<div class="ls-coll-row" style="margin-bottom:5px">' +
                            '<span class="ls-label" style="width:52px" data-i18n="coll_ships">🚀 Gemi</span>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-ship-bn"> <span data-i18n="coll_bn">BN</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-ship-kn"> <span data-i18n="coll_kn">KN</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-ship-rehber"> <span data-i18n="coll_rehber">Rehber</span></label>' +
                        '</div>' +
                        '<div class="ls-coll-row">' +
                            '<span class="ls-label" style="width:52px" data-i18n="coll_resources">💎 Kaynak</span>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-res-deu"> <span class="ls-coll-d" data-i18n="coll_deut">Deuterium</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-res-cri"> <span class="ls-coll-k" data-i18n="coll_crys">Kristal</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-res-met"> <span class="ls-coll-m" data-i18n="coll_met">Metal</span></label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-selbar">' +
                        '<button id="ls-coll-sel-all" class="ls-btn-sm" data-i18n="coll_sel_all">Tümü</button>' +
                        '<button id="ls-coll-sel-planets" class="ls-btn-sm" data-i18n="coll_sel_planets">🪐 Gezegenler</button>' +
                        '<button id="ls-coll-sel-moons" class="ls-btn-sm" data-i18n="coll_sel_moons">🌕 Aylar</button>' +
                        '<button id="ls-coll-sel-none" class="ls-btn-sm" style="color:#e74c3c" data-i18n="coll_sel_none">✖ Kaldır</button>' +
                    '</div>' +

                    '<div class="ls-coll-head">' +
                        '<span style="font-size:11px;font-weight:bold;color:#00bcff" data-i18n="coll_planets_moons">🪐 Gezegenler & Aylar</span>' +
                        '<span style="font-size:10px;color:#2ecc71;font-weight:bold;width:68px;text-align:center;margin-right:32px" data-i18n="coll_reserve_col">Deu Rezerv</span>' +
                    '</div>' +

                    '<div id="ls-coll-list" class="ls-coll-list"></div>' +

                    '<div id="ls-coll-summary" class="ls-coll-sum">' +
                        '<span style="color:#8899aa">0 gezegen · 0 ay</span>' +
                        '<span style="font-family:monospace"><span class="ls-coll-m">0</span> · <span class="ls-coll-k">0</span> · <span class="ls-coll-d">0</span></span>' +
                    '</div>' +

                    '<button id="ls-coll-start-btn" class="ls-coll-go" data-i18n="coll_start_btn">🚀 Toplamayı Başlat</button>' +
                '</div>' +

                // COURIER TAB (POSTACI)
                '<div id="tc-courier" class="ls-tc">' +
                    '<div id="ls-cour-card-origin" class="ls-coll-card">' +
                        '<div class="ls-origin-head-row">' +
                            '<span class="ls-label" data-i18n="target_center_head">📍 Merkez</span>' +
                            '<button type="button" id="ls-cour-cur-btn" class="ls-btn-sm ls-btn-here" style="background:#8e44ad;color:#fff;padding:2px 7px;font-size:10px;margin-left:auto;margin-right:6px;border:1px solid #9b59b6;border-radius:3px;cursor:pointer;font-weight:bold" title="Çıkış noktasını şu an bulunduğunuz gezegen/ay yapar" data-i18n-title="cour_here_title" data-i18n="cour_here">Burası</button>' +
                            '<div style="display:flex;gap:4px">' +
                                '<button type="button" id="ls-cour-mission-3" class="ls-coll-mbtn ' + (courierSettings.mission === 3 ? 'active' : '') + '" data-i18n="cour_transport">Nakliye</button>' +
                                '<button type="button" id="ls-cour-mission-4" class="ls-coll-mbtn deploy ' + (courierSettings.mission === 4 ? 'active' : '') + '" data-i18n="cour_deploy">Konuşlandır</button>' +
                                '<button type="button" id="ls-cour-mode-btn" class="ls-mode-btn" title="Taşıma Önceliği: Hız (Rehber > KN > BN). Tıkla: Yakıt Moduna Geç" data-i18n-title="mode_speed_title" data-i18n="mode_speed">⚡ Hız</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ls-coll-row">' +
                            '<div class="ls-coll-combo">' +
                                '<div id="ls-cour-origin-btn" class="ls-coll-sel">' +
                                    '<span id="ls-cour-origin-label"><b data-i18n="cour_loading">🪐 Yükleniyor...</b></span>' +
                                    '<span style="color:#00bcff;font-size:9px">▼</span>' +
                                '</div>' +
                                '<div id="ls-cour-origin-dd" class="ls-coll-dd"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-card">' +
                        '<div class="ls-coll-row" style="margin-bottom:5px">' +
                            '<span class="ls-label" style="width:52px" data-i18n="cour_ships">🚀 Gemi</span>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-cour-ship-bn"> <span data-i18n="cour_bn">BN</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-cour-ship-kn"> <span data-i18n="cour_kn">KN</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-cour-ship-rehber"> <span data-i18n="cour_rehber">Rehber</span></label>' +
                        '</div>' +
                        '<div class="ls-extra-row">' +
                            '<label class="ls-coll-chk" style="width:96px;flex-shrink:0" title="Aktif olduğunda girilen tutarlar tüm seçili hedeflere otomatik uygulanır">' +
                                '<input type="checkbox" id="ls-cour-sync-chk">' +
                                '<span style="color:#00bcff;font-weight:bold" data-i18n="cour_sync_title">Genel Dağıtım</span>' +
                            '</label>' +
                            '<div class="ls-cour-inputs-wrap" style="flex:1">' +
                                '<input type="text" id="ls-cour-sync-m" class="ls-cour-inp ls-cour-inp-m" placeholder="Metal" title="Tüm hedeflere dağıtılacak Metal miktarı (örn: 1m, 500k)">' +
                                '<input type="text" id="ls-cour-sync-c" class="ls-cour-inp ls-cour-inp-c" placeholder="Kristal" title="Tüm hedeflere dağıtılacak Kristal miktarı (örn: 2m, 250k)">' +
                                '<input type="text" id="ls-cour-sync-d" class="ls-cour-inp ls-cour-inp-d" placeholder="Deu" title="Tüm hedeflere dağıtılacak Deuterium miktarı (örn: 3m, 100k)">' +
                            '</div>' +
                            '<button type="button" id="ls-cour-sync-apply" class="ls-btn-sm" style="background:#2980b9;color:#fff;border:none;border-radius:3px;padding:3px 7px;font-size:10px;cursor:pointer;flex-shrink:0" title="Bu tutarları tüm seçili hedeflere yaz" data-i18n-title="cour_sync_apply_title" data-i18n="cour_sync_apply">⚡ Eşitle</button>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-selbar">' +
                        '<button id="ls-cour-sel-all" class="ls-btn-sm" data-i18n="cour_sel_all">Tümü</button>' +
                        '<button id="ls-cour-sel-planets" class="ls-btn-sm" data-i18n="cour_sel_planets">🪐 Gezegenler</button>' +
                        '<button id="ls-cour-sel-moons" class="ls-btn-sm" data-i18n="cour_sel_moons">🌕 Aylar</button>' +
                        '<button id="ls-cour-sel-none" class="ls-btn-sm" style="color:#e74c3c" data-i18n="cour_sel_none">✖ Kaldır</button>' +
                    '</div>' +

                    '<div class="ls-coll-head">' +
                        '<span style="font-size:11px;font-weight:bold;color:#00bcff" data-i18n="cour_planets_moons">🪐 Hedef Gezegenler & Aylar</span>' +
                        '<span style="font-size:10px;color:#ffbe3b;font-weight:bold;margin-right:32px" data-i18n="cour_res_cols">M / K / D Dağıtımı</span>' +
                    '</div>' +

                    '<div id="ls-cour-list" class="ls-coll-list"></div>' +

                    '<div id="ls-cour-summary" class="ls-coll-sum">' +
                        '<div class="ls-cour-sum-row" style="font-size:11px">' +
                            '<span style="color:#8899aa">0 hedef seçili</span>' +
                            '<span style="font-family:monospace;font-weight:bold"><span class="ls-coll-m">0</span> · <span class="ls-coll-k">0</span> · <span class="ls-coll-d">0</span></span>' +
                        '</div>' +
                        '<div class="ls-cour-sum-row ls-cour-sum-sub">' +
                            '<span style="color:#8899aa">Kargo İhtiyacı: <b style="color:#00bcff;font-family:monospace">0</b></span>' +
                            '<span style="color:#8899aa">Tutar bekleniyor</span>' +
                        '</div>' +
                    '</div>' +

                    '<button id="ls-cour-start-btn" class="ls-cour-go" data-i18n="cour_start_btn">📬 Dağıtımı Başlat</button>' +
                '</div>' +

                // EXPEDITION TAB (KEŞİF ASİSTANI)
                '<div id="tc-expedition" class="ls-tc">' +
                    '<div class="ls-coll-card">' +
                        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
                            '<span class="ls-label" style="color:#bb86fc" data-i18n="exp_start_slot16">🎯 Başlangıç Keşif Noktası (Slot 16)</span>' +
                            '<button id="ls-exp-cur-btn" class="ls-btn-sm" style="background:#2c3e50;color:#00bcff;padding:2px 6px;font-size:10px" title="Şu anki gezegenin :16 slotunu yaz" data-i18n-title="exp_here_title" data-i18n="exp_here">Burası</button>' +
                        '</div>' +
                        '<div style="display:flex;gap:6px">' +
                            '<input type="text" id="ls-exp-start-coord" class="ls-inp" style="flex:1;font-family:monospace;font-weight:bold;color:#ffbe3b;text-align:center" placeholder="5:242:16">' +
                        '</div>' +
                        '<div style="font-size:10px;color:#8899aa;margin-top:4px" data-i18n="exp_desc">' +
                            'Keşifler bu sistemden başlayarak yakından uzağa doğru spiral (+1, -1, +2, -2...) dağıtılır.' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-card">' +
                        '<div style="display:flex;gap:8px">' +
                            '<div style="flex:1">' +
                                '<span class="ls-label" data-i18n="exp_count">🔢 Sefer Sayısı</span>' +
                                '<input type="number" id="ls-exp-count" class="ls-inp" min="1" max="50" style="width:100%;font-weight:bold;color:#00bcff;text-align:center" value="1">' +
                            '</div>' +
                            '<div style="flex:2">' +
                                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                                    '<span class="ls-label" data-i18n="exp_template">📋 Keşif Şablonu</span>' +
                                    '<span id="ls-exp-refresh-tpls" style="font-size:10px;color:#00bcff;cursor:pointer" title="Şablonları yenile" data-i18n-title="exp_refresh_tpls_title">🔄</span>' +
                                '</div>' +
                                '<select id="ls-exp-template" class="ls-inp" style="width:100%;font-size:11px">' +
                                    '<option value="" data-i18n="exp_loading_tpl">-- Şablon Yükleniyor... --</option>' +
                                '</select>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-card" style="background:#101b2b;border:1px dashed #2c3e50;flex:1;min-height:40px;display:flex;flex-direction:column">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
                            '<span style="font-size:11px;font-weight:bold;color:#d1d8e0" data-i18n="exp_preview_title">🧭 Rota Dağılımı Önizlemesi:</span>' +
                            '<span id="ls-exp-total-steps" style="font-size:10.5px;color:#bb86fc;font-weight:bold">0 Sefer</span>' +
                        '</div>' +
                        '<div id="ls-exp-preview-list" style="font-size:10.5px;color:#8899aa;font-family:monospace;line-height:1.4;flex:1;overflow-y:auto;padding-right:4px" data-i18n="exp_preview_placeholder">' +
                            '(Başlangıç koordinatı ve sefer sayısını girin)' +
                        '</div>' +
                    '</div>' +

                    '<button id="ls-exp-start-btn" class="ls-exp-go" data-i18n="exp_start_btn">🚀 Keşifleri Başlat (Adım Adım)</button>' +
                '</div>' +

                // SETTINGS TAB (AYARLAR)
                '<div id="tc-settings" class="ls-tc">' +
                    // GENEL AYARLAR KARTI (DİL & GÖRÜNÜM)
                    '<div style="background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:8px 10px;margin-bottom:8px;flex-shrink:0">' +
                        '<div style="font-size:11px;font-weight:bold;color:#00bcff;margin-bottom:8px;display:flex;align-items:center;gap:4px">' +
                            '<span>⚙️</span> <span data-i18n="settings_general">Genel Tercihler</span>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<span style="font-size:11px;color:#d1d8e0" data-i18n="settings_lang">🌐 Dil:</span>' +
                            '<select id="ls-setting-lang" class="ls-inp" style="width:160px;padding:3px 6px;font-size:11px">' +
                                '<option value="tr">TR (Türkçe)</option>' +
                                '<option value="en">ENG (English)</option>' +
                            '</select>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<span style="font-size:11px;color:#d1d8e0" data-i18n="settings_theme">🎨 Görünüm:</span>' +
                            '<select id="ls-setting-theme" class="ls-inp" style="width:160px;padding:3px 6px;font-size:11px">' +
                                '<option value="dark" data-i18n="settings_theme_dark">🌌 Uzay Karanlığı (Varsayılan)</option>' +
                                '<option value="fb" data-i18n="settings_theme_fb">🟡🔵 Fenerbahçe (Koyu & Kanarya)</option>' +
                                '<option value="light" disabled data-i18n="settings_theme_light">☀️ Aydınlık (Çok Yakında)</option>' +
                                '<option value="aero" disabled data-i18n="settings_theme_aero">💎 Aero Glass (Çok Yakında)</option>' +
                            '</select>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">' +
                            '<span style="font-size:11px;color:#d1d8e0" data-i18n="settings_opacity">👁️ Saydamlık:</span>' +
                            '<div style="display:flex;align-items:center;gap:8px;width:160px">' +
                                '<input type="range" id="ls-setting-opacity" min="20" max="100" step="5" value="100" style="flex:1;cursor:pointer;accent-color:#00bcff">' +
                                '<span id="ls-setting-opacity-val" style="font-size:11px;font-weight:bold;color:#00bcff;min-width:32px;text-align:right">100%</span>' +
                            '</div>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">' +
                            '<label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:#d1d8e0" title="Fare panelin üzerine geldiğinde otomatik olarak %100 görünür yapar" data-i18n-title="settings_hover_focus_title">' +
                                '<input type="checkbox" id="ls-setting-hover-focus" style="accent-color:#00bcff;cursor:pointer">' +
                                '<span data-i18n="settings_hover_focus">🎯 Fare Üzerindeyken %100 Yap</span>' +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                    // AYIRAÇ: SİSTEM & TEŞHİS GÜNLÜKLERİ
                    '<div style="display:flex;align-items:center;margin:6px 0 8px 0;flex-shrink:0">' +
                        '<div style="flex:1;height:1px;background:#1a2c3f"></div>' +
                        '<span style="padding:0 8px;font-size:10px;color:#8899aa;font-weight:bold;display:flex;align-items:center;gap:4px" data-i18n="settings_diag_divider">🛠️ Sistem & Teşhis Günlükleri</span>' +
                        '<div style="flex:1;height:1px;background:#1a2c3f"></div>' +
                    '</div>' +

                    // 2-COLUMN HEADER: DEBUG LOGS (LEFT) & TRACE LOGS (RIGHT)
                    '<div style="display:flex;gap:6px;margin-bottom:6px;flex-shrink:0">' +
                        // SOL KART: DEBUG LOGS
                        '<div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:6px 8px">' +
                            '<div style="display:flex;justify-content:space-between;align-items:center">' +
                                '<span style="font-weight:bold;color:#00bcff;font-size:11px;display:flex;align-items:center;gap:4px" data-i18n="settings_debug_title">' +
                                    '🐞 Debug Logs' +
                                '</span>' +
                                '<label style="position:relative;display:inline-block;width:28px;height:16px;margin:0;cursor:pointer" title="Debug Logs aç/kapat (Uyarı ve Hatalar)" data-i18n-title="settings_debug_toggle_title">' +
                                    '<input type="checkbox" id="ls-debug-toggle" style="opacity:0;width:0;height:0">' +
                                    '<span class="ls-debug-slider"></span>' +
                                '</label>' +
                            '</div>' +
                            '<div style="font-size:9px;color:#8899aa;margin-top:3px;line-height:1.2" data-i18n="settings_debug_desc">' +
                                'Uygulama logları' +
                            '</div>' +
                        '</div>' +

                        // SAĞ KART: TRACE LOGS
                        '<div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:6px 8px">' +
                            '<div style="display:flex;justify-content:space-between;align-items:center">' +
                                '<span style="font-weight:bold;color:#ff7043;font-size:11px;display:flex;align-items:center;gap:4px" data-i18n="settings_trace_title">' +
                                    '🎯 Trace Logs' +
                                '</span>' +
                                '<label style="position:relative;display:inline-block;width:28px;height:16px;margin:0;cursor:pointer" title="Trace Logs aç/kapat (Tıklama, sayfa, tuş & yanıtlar)" data-i18n-title="settings_trace_toggle_title">' +
                                    '<input type="checkbox" id="ls-trace-toggle" style="opacity:0;width:0;height:0">' +
                                    '<span class="ls-debug-slider"></span>' +
                                '</label>' +
                            '</div>' +
                            '<div style="font-size:9px;color:#8899aa;margin-top:3px;line-height:1.2" data-i18n="settings_trace_desc">' +
                                'İzleme kayıtları' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    // BUTONLAR: LOGLARI KOPYALA | LOGLARI TEMİZLE | LOGLARI ÇIKAR (3 SEÇENEK)
                    '<div style="display:flex;gap:4px;margin-bottom:6px;flex-shrink:0">' +
                        '<button id="ls-debug-copy" class="ls-btn" style="flex:1;display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;padding:5px 2px" title="Filtrelenmiş logları panoya kopyalar" data-i18n-title="settings_copy_logs_title" data-i18n="settings_copy_logs">📋 Logları Kopyala</button>' +
                        '<button id="ls-debug-clear" class="ls-btn ls-btn-d" style="flex:1;display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;padding:5px 2px" title="Filtrelenmiş logları temizler" data-i18n-title="settings_clear_logs_title" data-i18n="settings_clear_logs">🗑️ Logları Temizle</button>' +
                        '<button id="ls-debug-export" class="ls-btn" style="flex:1;background:#2ecc71;color:#fff;display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;padding:5px 2px" title="Filtrelenmiş logları .txt dosyası olarak masaüstüne çıkarır" data-i18n-title="settings_export_logs_title" data-i18n="settings_export_logs">💾 Logları Çıkar</button>' +
                    '</div>' +

                    // 3 SATIRLI GELİŞMİŞ MULTI FİLTRE
                    '<div style="display:flex;flex-direction:column;gap:3px;margin-bottom:6px;flex-shrink:0" id="ls-debug-filters-container">' +
                        // 1. Satır: Akış
                        '<div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap">' +
                            '<span style="font-size:9px;color:#8899aa;font-weight:bold;min-width:44px" data-i18n="settings_stream">Akış:</span>' +
                            '<span class="ls-debug-filter active" data-row="1" data-val="ALL" data-i18n="settings_all">Tümü</span>' +
                            '<span class="ls-debug-filter" data-row="1" data-val="DEBUG">🐞 Debug Logs</span>' +
                            '<span class="ls-debug-filter" data-row="1" data-val="TRACE">🎯 Trace Logs</span>' +
                        '</div>' +
                        // 2. Satır: Kapsam / Sunucu & Ajax
                        '<div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap">' +
                            '<span style="font-size:9px;color:#8899aa;font-weight:bold;min-width:44px" data-i18n="settings_scope">Kapsam:</span>' +
                            '<span class="ls-debug-filter active" data-row="2" data-val="ALL" data-i18n="settings_all">Tümü</span>' +
                            '<span class="ls-debug-filter" data-row="2" data-val="REQ" title="Sunucuya gönderilen AJAX ve istekler" data-i18n="settings_req">📤 Giden İstekler</span>' +
                            '<span class="ls-debug-filter" data-row="2" data-val="RESP" title="Sunucudan ve OGame\'den dönen yanıtlar" data-i18n="settings_resp">📥 Gelen Yanıtlar</span>' +
                        '</div>' +
                        // 3. Satır: Seviye
                        '<div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap">' +
                            '<span style="font-size:9px;color:#8899aa;font-weight:bold;min-width:44px" data-i18n="settings_level">Seviye:</span>' +
                            '<span class="ls-debug-filter active" data-row="3" data-val="ALL" data-i18n="settings_all">Tümü</span>' +
                            '<span class="ls-debug-filter" data-row="3" data-val="INFO">ℹ️ Info</span>' +
                            '<span class="ls-debug-filter" data-row="3" data-val="WARN">⚠️ Warning</span>' +
                            '<span class="ls-debug-filter" data-row="3" data-val="ERROR">❌ Error</span>' +
                        '</div>' +
                    '</div>' +

                    // DURUM & SAYAÇ
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:9.5px;color:#8899aa">' +
                        '<span id="ls-debug-count">0 kayıt</span>' +
                        '<div style="display:flex;gap:6px;align-items:center">' +
                            '<span id="ls-debug-status">○ Debug: Kapalı</span>' +
                            '<span style="color:#334455">|</span>' +
                            '<span id="ls-trace-status">○ Trace: Kapalı</span>' +
                        '</div>' +
                    '</div>' +

                    '<div id="ls-debug-console" style="background:#0a0e17;border:1px solid #1a2c3f;border-radius:6px;padding:8px;flex:1;min-height:160px;max-height:300px;overflow-y:auto;overflow-x:hidden;font-family:\'Consolas\',\'Courier New\',monospace;font-size:10px;line-height:1.45;color:#c9d1d9;white-space:pre-wrap;word-break:break-word">' +
                    '</div>' +
                '</div>' +

            '</div>' +
            '<div id="ls-footer-drag" style="padding:4px 8px;background:linear-gradient(90deg,#0d1b2a,#1a2c3f);border-top:1px solid #1a2c3f;border-radius:0 0 8px 8px;display:flex;justify-content:space-between;align-items:center;user-select:none;font-size:10px;color:#4a627a;position:relative" title="Pencereyi taşımak için sürükleyin">' +
                '<span class="ls-corner-grip" data-dir="sw" style="cursor:nesw-resize;padding:0 6px;font-size:12px;color:#6b8aa8;line-height:1" title="Sol alt köşeden boyutlandır">⤡</span>' +
                '<div id="ls-footer-drag-handle" style="flex:1;text-align:center;cursor:move;letter-spacing:6px;font-weight:bold;display:flex;align-items:center;justify-content:center;gap:10px">' +
                    '<span style="color:#2f465e;font-size:9px;opacity:0.6;letter-spacing:0">⠿</span>' +
                    '<span style="color:#9ec2e6;font-size:11px;letter-spacing:6px">O G A M E</span>' +
                    '<span style="color:#2f465e;font-size:9px;opacity:0.6;letter-spacing:0">⠿</span>' +
                '</div>' +
                '<span class="ls-corner-grip" data-dir="se" style="cursor:nwse-resize;padding:0 6px;font-size:12px;color:#6b8aa8;line-height:1" title="Sağ alt köşeden boyutlandır">⤢</span>' +
            '</div>' +
            '<div class="ls-resize-h ls-rh-se" data-dir="se"></div>' +
            '<div class="ls-resize-h ls-rh-sw" data-dir="sw"></div>' +
            '<div class="ls-resize-h ls-rh-ne" data-dir="ne"></div>' +
            '<div class="ls-resize-h ls-rh-nw" data-dir="nw"></div>' +
            '<div class="ls-resize-h ls-rh-e" data-dir="e"></div>' +
            '<div class="ls-resize-h ls-rh-w" data-dir="w"></div>' +
            '<div class="ls-resize-h ls-rh-s" data-dir="s"></div>';
        document.body.appendChild(panel);

        const savedSize = localStorage.getItem(KEYS.SIZE);
        if (savedSize) {
            try {
                const s = JSON.parse(savedSize);
                if (s.w) panel.style.width = Math.max(320, Math.min(window.innerWidth - 30, s.w)) + 'px';
                if (s.h) panel.style.height = Math.max(500, Math.min(window.innerHeight - 30, s.h)) + 'px';
            } catch (e) {}
        }

        if (isPanelOpen) {
            panel.style.display = 'flex';
        }
        applyPanelOpacity();
        applyTheme(generalSettings.theme);

        panel.addEventListener('mouseenter', () => {
            isPanelHovered = true;
            if (generalSettings.hoverFocus) {
                panel.style.opacity = '1';
            }
        });

        panel.addEventListener('mouseleave', () => {
            isPanelHovered = false;
            applyPanelOpacity();
        });

        fab.addEventListener('click', () => {
            const willOpen = panel.style.display !== 'flex';
            panel.style.display = willOpen ? 'flex' : 'none';
            isPanelOpen = willOpen;
            localStorage.setItem(KEYS.OPEN, willOpen ? 'true' : 'false');
            LS_LOGGER.action('UI', willOpen ? 'Panel açıldı.' : 'Panel kapatıldı.');
            if (willOpen) setTimeout(ensurePanelInView, 20);
        });

        document.getElementById('ls-close').addEventListener('click', () => {
            panel.style.display = 'none';
            isPanelOpen = false;
            localStorage.setItem(KEYS.OPEN, 'false');
            LS_LOGGER.action('UI', 'Panel kapatıldı (X tıklandı).');
        });

        let dragging = false, dx = 0, dy = 0, startX, startY;
        const savedPos = localStorage.getItem(KEYS.POS);
        if (savedPos) {
            try {
                const p = JSON.parse(savedPos);
                dx = p.x || 0; dy = p.y || 0;
                panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            } catch (e) {}
        }

        function updatePanelLayout() {
            if (!panel) return;
            const w = panel.offsetWidth;
            const tabsEl = document.getElementById('ls-tabs');
            if (tabsEl) {
                if (w > 0 && w < 440) {
                    tabsEl.classList.add('ls-tabs-stacked');
                } else if (w >= 440) {
                    tabsEl.classList.remove('ls-tabs-stacked');
                }
            }
            if (w > 0 && w < 350) {
                panel.classList.add('ls-compact');
            } else {
                panel.classList.remove('ls-compact');
            }
            if (w > 0 && w < 320) {
                panel.classList.add('ls-narrow');
            } else {
                panel.classList.remove('ls-narrow');
            }
        }
        updatePanelLayout();

        function ensurePanelInView() {
            if (panel.style.display === 'none') return;
            const rect = panel.getBoundingClientRect();
            if (rect.top < 10) {
                dy += (10 - rect.top);
                panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
                localStorage.setItem(KEYS.POS, JSON.stringify({ x: dx, y: dy }));
            }
        }

        function startDrag(e) {
            if (e.target.id === 'ls-close' || e.target.closest('.ls-corner-grip') || e.target.closest('.ls-resize-h')) return;
            dragging = true;
            startX = e.clientX - dx;
            startY = e.clientY - dy;
            e.preventDefault();
        }

        const header = document.getElementById('ls-header');
        if (header) header.addEventListener('mousedown', startDrag);
        const footerDrag = document.getElementById('ls-footer-drag-handle') || document.getElementById('ls-footer-drag');
        if (footerDrag) footerDrag.addEventListener('mousedown', startDrag);

        let resizing = null;
        let startW = 0, startH = 0, startMouseX = 0, startMouseY = 0, startDx = 0, startDy = 0;

        function startResize(e, dir) {
            e.preventDefault();
            e.stopPropagation();
            resizing = dir;
            startW = panel.offsetWidth;
            startH = panel.offsetHeight;
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            startDx = dx;
            startDy = dy;
        }

        panel.querySelectorAll('.ls-resize-h, .ls-corner-grip').forEach(el => {
            el.addEventListener('mousedown', e => {
                const dir = el.getAttribute('data-dir');
                if (dir) startResize(e, dir);
            });
        });

        window.addEventListener('mousemove', e => {
            if (resizing) {
                const deltaX = e.clientX - startMouseX;
                const deltaY = e.clientY - startMouseY;
                let newW = startW;
                let newH = startH;
                let newDx = startDx;
                let newDy = startDy;

                const minW = 320, maxW = Math.max(minW, window.innerWidth - 30);
                const minH = 500, maxH = Math.max(minH, window.innerHeight - 30);

                if (resizing.includes('e')) {
                    const candidateW = Math.min(maxW, Math.max(minW, startW + deltaX));
                    newW = candidateW;
                    newDx = startDx + (candidateW - startW);
                }
                if (resizing.includes('w')) {
                    const candidateW = Math.min(maxW, Math.max(minW, startW - deltaX));
                    newW = candidateW;
                }
                if (resizing.includes('s')) {
                    const candidateH = Math.min(maxH, Math.max(minH, startH + deltaY));
                    newH = candidateH;
                    newDy = startDy + (candidateH - startH);
                }
                if (resizing.includes('n')) {
                    const candidateH = Math.min(maxH, Math.max(minH, startH - deltaY));
                    newH = candidateH;
                }

                dx = newDx;
                dy = newDy;
                panel.style.width = newW + 'px';
                panel.style.height = newH + 'px';
                panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
                updatePanelLayout();
                return;
            }

            if (dragging) {
                dx = e.clientX - startX;
                dy = e.clientY - startY;
                panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            }
        });

        window.addEventListener('mouseup', () => {
            if (resizing) {
                resizing = null;
                ensurePanelInView();
                updatePanelLayout();
                localStorage.setItem(KEYS.POS, JSON.stringify({ x: dx, y: dy }));
                localStorage.setItem(KEYS.SIZE, JSON.stringify({ w: panel.offsetWidth, h: panel.offsetHeight }));
            }
            if (dragging) {
                dragging = false;
                ensurePanelInView();
                localStorage.setItem(KEYS.POS, JSON.stringify({ x: dx, y: dy }));
            }
        });

        let tabHoverTimer = null;
        const tabTooltip = document.getElementById('ls-tab-tooltip');
        const tabTooltipTitle = document.getElementById('ls-tab-tooltip-title');
        const tabTooltipDesc = document.getElementById('ls-tab-tooltip-desc');

        function hideTabTooltip() {
            if (tabHoverTimer) {
                clearTimeout(tabHoverTimer);
                tabHoverTimer = null;
            }
            if (tabTooltip) tabTooltip.style.display = 'none';
        }

        const tabsContainer = document.getElementById('ls-tabs');
        if (tabsContainer) {
            tabsContainer.addEventListener('mouseleave', hideTabTooltip);
        }

        document.querySelectorAll('.ls-tab').forEach(tab => {
            const tabKey = tab.getAttribute('data-tab');

            tab.addEventListener('mouseenter', () => {
                hideTabTooltip();
                tabHoverTimer = setTimeout(() => {
                    if (tabTooltip && tabTooltipTitle && tabTooltipDesc) {
                        const titleText = t('tab_tip_title_' + tabKey, '');
                        const descText = t('tab_tip_desc_' + tabKey, '');
                        if (titleText && descText) {
                            tabTooltipTitle.textContent = titleText;
                            tabTooltipDesc.textContent = descText;
                            tabTooltip.style.display = 'block';
                        }
                    }
                }, 3000);
            });

            tab.addEventListener('mouseleave', hideTabTooltip);

            tab.addEventListener('click', () => {
                hideTabTooltip();
                const t = tab.getAttribute('data-tab');
                document.querySelectorAll('.ls-tab').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.ls-tc').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                const content = document.getElementById('tc-' + t);
                if (content) content.classList.add('active');
                activeTab = t;
                localStorage.setItem(KEYS.TAB, t);
                if (t === 'cart') {
                    fetchResearchLevels().then(() => renderCart());
                }
                if (t === 'debris') renderDebrisList();
                if (t === 'collector') renderCollector();
                if (t === 'courier') renderCourier();
                if (t === 'expedition') renderExpedition();
                if (t === 'scanner') { updateScanStatusInfo(); updateRefreshButtonCooldown(); }
                if (t === 'finder') { updateFinderStatusInfo(); updateRefreshButtonCooldown(); }
                if (t === 'settings' || t === 'debug') renderDebugLogs();
                LS_LOGGER.action('UI', 'Sekme değiştirildi: ' + t);
                setTimeout(ensurePanelInView, 20);
            });
        });

        const savedTabEl = document.querySelector('.ls-tab[data-tab="' + activeTab + '"]');
        const savedContentEl = document.getElementById('tc-' + activeTab);
        if (savedTabEl) savedTabEl.classList.add('active');
        if (savedContentEl) savedContentEl.classList.add('active');
        if (activeTab === 'expedition') renderExpedition();
        if (activeTab === 'scanner') { updateScanStatusInfo(); updateRefreshButtonCooldown(); }
        if (activeTab === 'finder') { updateFinderStatusInfo(); updateRefreshButtonCooldown(); }
        if (activeTab === 'settings' || activeTab === 'debug') renderDebugLogs();
        if (!savedTabEl) {
            const first = document.querySelector('.ls-tab');
            if (first) { first.classList.add('active'); document.getElementById('tc-cart').classList.add('active'); }
        }

        if (typeof ResizeObserver !== 'undefined' && panel) {
            new ResizeObserver(updatePanelLayout).observe(panel);
        }
        updatePanelLayout();

        document.getElementById('ls-cart-sel-all')?.addEventListener('click', () => selectAllCartPlanets('all'));
        document.getElementById('ls-cart-sel-none')?.addEventListener('click', () => selectAllCartPlanets('none'));
        document.getElementById('ls-cart-copy')?.addEventListener('click', copyCart);
        document.getElementById('ls-cart-clear')?.addEventListener('click', () => { cart = []; saveCart(); renderCart(); });

        // Cart Ship Checkbox'ları (BN, KN, Rehber)
        ['bn', 'kn', 'rehber'].forEach(st => {
            const el = document.getElementById('ls-cart-ship-' + st);
            if (el) {
                el.addEventListener('change', () => {
                    const prefs = getCartShipPrefs();
                    prefs[st] = el.checked;
                    saveCartShipPrefs(prefs);
                    renderCart();
                });
            }
        });

        // Ek Maliyet Sepete Ekle Butonu
        const addExtraBtn = document.getElementById('ls-cart-add-extra-btn');
        if (addExtraBtn) {
            addExtraBtn.addEventListener('click', () => {
                const mInput = document.getElementById('ls-cart-extra-m');
                const cInput = document.getElementById('ls-cart-extra-c');
                const dInput = document.getElementById('ls-cart-extra-d');

                const m = mInput ? parseOgNum(mInput.value) : 0;
                const c = cInput ? parseOgNum(cInput.value) : 0;
                const d = dInput ? parseOgNum(dInput.value) : 0;

                if (m <= 0 && c <= 0 && d <= 0) {
                    alert(currentLang === 'tr' ? 'Lütfen eklenecek en az bir kaynak miktarı (Metal, Kristal veya Deuterium) girin!' : 'Please enter at least one resource amount (Metal, Crystal or Deuterium)!');
                    return;
                }

                const groups = getCartGroups();
                const selectedGroups = groups.filter(g => g.selected);

                if (selectedGroups.length === 0) {
                    alert(currentLang === 'tr' ? 'Lütfen ek maliyet eklenecek en az bir gezegen seçin (kutucukları işaretleyin)!' : 'Please select at least one planet to add extra cost to!');
                    return;
                }

                selectedGroups.forEach(grp => {
                    cart.push({
                        id: Date.now() + Math.random().toString(36).substring(2, 6),
                        name: t('cart_extra_title', 'Ek Maliyet'),
                        level: null,
                        planet: grp.planetName,
                        coords: grp.coords,
                        type: grp.type,
                        metal: m,
                        crystal: c,
                        deuterium: d,
                        count: 1,
                        isDeduction: false,
                        isExtraCost: true,
                        checked: true
                    });
                });

                saveCart();
                renderCart();

                if (mInput) mInput.value = '';
                if (cInput) cInput.value = '';
                if (dInput) dInput.value = '';

                showCollectorToast(currentLang === 'tr' ? `⚡ Ek maliyet ${selectedGroups.length} gezegen sepetine eklendi!` : `⚡ Extra cost added to ${selectedGroups.length} planet carts!`);
            });
        }

        // Ek maliyet girdi kutularında blur olduğunda sayı formatlama
        ['m', 'c', 'd'].forEach(k => {
            const inp = document.getElementById('ls-cart-extra-' + k);
            if (inp) {
                inp.addEventListener('blur', () => {
                    const val = parseOgNum(inp.value);
                    if (val > 0) inp.value = fmt(val);
                });
            }
        });

        renderCart();

        document.getElementById('ls-sg1').value = scanSettings.gStart;
        document.getElementById('ls-sg2').value = scanSettings.gEnd;
        document.getElementById('ls-ss1').value = scanSettings.sStart;
        document.getElementById('ls-ss2').value = scanSettings.sEnd;
        document.getElementById('ls-slots').value = scanSettings.slots;
        document.getElementById('ls-min').value = scanSettings.minEmpty;

        document.getElementById('ls-scan-btn').addEventListener('click', startScan);
        document.getElementById('ls-scan-refresh-btn')?.addEventListener('click', forceRefreshAllUniverseData);
        document.getElementById('ls-scan-copy').addEventListener('click', copyScanResults);
        updateScanStatusInfo();
        updateRefreshButtonCooldown();

        document.querySelectorAll('.ls-chip[data-slots]').forEach(chip => {
            chip.addEventListener('click', () => {
                document.getElementById('ls-slots').value = chip.getAttribute('data-slots');
                const minVal = chip.getAttribute('data-min');
                if (minVal) {
                    const minSelect = document.getElementById('ls-min');
                    if (minSelect) minSelect.value = minVal;
                }
            });
        });

        document.getElementById('ls-find-btn').addEventListener('click', startFinder);
        document.getElementById('ls-find-refresh-btn')?.addEventListener('click', forceRefreshAllUniverseData);
        updateFinderStatusInfo();
        document.getElementById('ls-find-q').addEventListener('keydown', e => {
            if (e.key === 'Enter') startFinder();
        });
        document.getElementById('ls-find-results')?.addEventListener('click', e => {
            const btn = e.target.closest('.ls-nav-btn');
            if (btn && btn.dataset.g && btn.dataset.s) {
                navigateToGalaxy(parseInt(btn.dataset.g, 10), parseInt(btn.dataset.s, 10));
            }
        });

        // Alarm Tab Controls
        const attToggle = document.getElementById('ls-alarm-att-toggle');
        const espToggle = document.getElementById('ls-alarm-esp-toggle');
        const volSlider = document.getElementById('ls-volume-slider');
        const volVal = document.getElementById('ls-volume-val');
        const repSelect = document.getElementById('ls-alarm-repeat');

        if (attToggle) {
            attToggle.checked = !!alarmSettings.attackEnabled;
            attToggle.addEventListener('change', () => {
                alarmSettings.attackEnabled = attToggle.checked;
                saveAlarmSettings();
                checkThreatsInDOM();
            });
        }

        if (espToggle) {
            espToggle.checked = !!alarmSettings.espionageEnabled;
            espToggle.addEventListener('change', () => {
                alarmSettings.espionageEnabled = espToggle.checked;
                saveAlarmSettings();
                checkThreatsInDOM();
            });
        }

        if (volSlider && volVal) {
            volSlider.value = alarmSettings.volume ?? 70;
            volVal.textContent = (alarmSettings.volume ?? 70) + '%';
            volSlider.addEventListener('input', () => {
                alarmSettings.volume = parseInt(volSlider.value, 10);
                volVal.textContent = alarmSettings.volume + '%';
                saveAlarmSettings();
            });
        }

        if (repSelect) {
            repSelect.value = String(alarmSettings.repeatInterval ?? 30);
            repSelect.addEventListener('change', () => {
                alarmSettings.repeatInterval = parseInt(repSelect.value, 10);
                saveAlarmSettings();
            });
        }

        const attSoundSelect = document.getElementById('ls-alarm-att-sound');
        if (attSoundSelect) {
            attSoundSelect.value = alarmSettings.attackSound || 'klaxon';
            attSoundSelect.addEventListener('change', () => {
                alarmSettings.attackSound = attSoundSelect.value;
                saveAlarmSettings();
            });
        }

        const espSoundSelect = document.getElementById('ls-alarm-esp-sound');
        if (espSoundSelect) {
            espSoundSelect.value = alarmSettings.espionageSound || 'sonar_deep';
            espSoundSelect.addEventListener('change', () => {
                alarmSettings.espionageSound = espSoundSelect.value;
                saveAlarmSettings();
            });
        }

        document.getElementById('ls-alarm-stop-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            muteCurrentThreat();
        });

        document.getElementById('ls-header-stop-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            muteCurrentThreat();
        });

        document.getElementById('ls-alarm-att-test')?.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                const sel = document.getElementById('ls-alarm-att-sound');
                const sound = sel ? sel.value : (alarmSettings.attackSound || 'klaxon');
                playAttackAlertSound(sound);
            } catch (err) {
                console.warn('[LS] Saldırı testi hatası:', err.message || err);
            }
        });

        document.getElementById('ls-alarm-esp-test')?.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                const sel = document.getElementById('ls-alarm-esp-sound');
                const sound = sel ? sel.value : (alarmSettings.espionageSound || 'sonar_deep');
                playEspionageAlertSound(sound);
            } catch (err) {
                console.warn('[LS] Sonda testi hatası:', err.message || err);
            }
        });

        // Debris Tab Controls (Harabe Avcısı)
        const debToggle = document.getElementById('ls-debris-toggle');
        const debMinInp = document.getElementById('ls-debris-min');
        const debSoundSelect = document.getElementById('ls-debris-sound');

        if (debToggle) {
            debToggle.checked = !!debrisSettings.enabled;
            debToggle.addEventListener('change', () => {
                debrisSettings.enabled = debToggle.checked;
                saveDebrisSettings();
                updateDebrisStatusBanner();
                if (debrisSettings.enabled) {
                    triggerGalaxyScanSequence();
                }
            });
        }

        if (debMinInp) {
            debMinInp.value = fmt(debrisSettings.minThreshold || 100000);
            debMinInp.addEventListener('change', () => {
                const val = parseOgNum(debMinInp.value) || 100000;
                debrisSettings.minThreshold = val;
                debMinInp.value = fmt(val);
                saveDebrisSettings();
            });
        }

        document.querySelectorAll('.ls-debris-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const minVal = parseInt(chip.getAttribute('data-min'), 10) || 100000;
                debrisSettings.minThreshold = minVal;
                if (debMinInp) debMinInp.value = fmt(minVal);
                saveDebrisSettings();
            });
        });

        if (debSoundSelect) {
            debSoundSelect.value = debrisSettings.sound || 'sonar_deep';
            debSoundSelect.addEventListener('change', () => {
                debrisSettings.sound = debSoundSelect.value;
                saveDebrisSettings();
            });
        }

        document.getElementById('ls-debris-test-sound')?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const sel = document.getElementById('ls-debris-sound');
                await playEspionageAlertSound(sel ? sel.value : null);
            } catch (err) {
                console.warn('[LS] Harabe ses testi hatası:', err.message || err);
            }
        });

        document.getElementById('ls-debris-clear-all')?.addEventListener('click', () => {
            debrisList = [];
            saveDebrisList();
            renderDebrisList();
        });

        updateDebrisStatusBanner();
        renderDebrisList();

        initCollectorEvents();
        renderCollector();

        initCourierEvents();
        renderCourier();

        setupExpeditionEvents();
        renderExpedition();

        // 100% Pasif Tehdit İzleme (Sıfır Sunucu Yükü, Sıfır Ban Riski)
        // OGame'in kendi DOM değişiklikleri ve kendi dahili eventList AJAX çağrıları dinlenir
        const attEl = document.getElementById('attack_alert');
        if (attEl) {
            const obs = new MutationObserver(() => checkThreatsInDOM());
            obs.observe(attEl, { attributes: true, attributeFilter: ['class', 'style'] });
        }
        const eventHdr = document.getElementById('eventHeader') || document.getElementById('js_eventHeaderBox');
        if (eventHdr) {
            const obsHdr = new MutationObserver(() => checkThreatsInDOM());
            obsHdr.observe(eventHdr, { attributes: true, childList: true, subtree: true });
        }

        // Oyuncunun açık olan sekmesinde DOM'daki tehdit durumunu hafifçe tara (sadece yerel DOM)
        setInterval(checkThreatsInDOM, 2500);

        // OGame'in kendi yaptığı AJAX çağrılarından eventList içeriği bridge.js (MAIN world) üzerinden LS_EVENT_LIST_RECEIVED ile yakalanır

        // ============================================================
        // DEBUG & TRACE LOGS LOGIC & CONTROLS
        // ============================================================
        function matchesFilters(entry) {
            // 1. Satır: Akış (Stream: Tümü, Debug Logs, Trace Logs)
            if (!debugFilterState.row1.has('ALL')) {
                const stream = entry.stream || (entry.cat === 'TRACE' ? 'TRACE' : 'DEBUG');
                if (!debugFilterState.row1.has(stream)) {
                    return false;
                }
            }

            // 2. Satır: Kapsam / Sunucu & Ajax (Tümü, Giden İstekler, Gelen Yanıtlar)
            if (!debugFilterState.row2.has('ALL')) {
                let matchRow2 = false;
                const cat = (entry.cat || '').toUpperCase();
                const msg = (entry.msg || '');

                const isReq = (cat === 'AJAX-REQ' || cat === 'OGAME-AJAX-REQ' || msg.includes('GİDEN İSTEK') || msg.includes('SUNUCU İSTEĞİ') || msg.includes('İstek yapılıyor'));
                const isResp = (cat === 'AJAX-RESP' || cat === 'OGAME-AJAX-RESP' || cat === 'OGAME-YANIT' || msg.includes('GELEN YANIT') || msg.includes('SUNUCU YANITI') || msg.includes('OGame Bildirimi') || msg.includes('İstek yanıtı') || msg.includes('SUNUCU HATASI'));

                if (debugFilterState.row2.has('REQ') && isReq) matchRow2 = true;
                if (debugFilterState.row2.has('RESP') && isResp) matchRow2 = true;

                if (!matchRow2) return false;
            }

            // 3. Satır: Seviye (Tümü, Info, Warning, Error)
            if (!debugFilterState.row3.has('ALL')) {
                let matchRow3 = false;
                const lvl = (entry.level || '').toUpperCase();

                if (debugFilterState.row3.has('INFO') && (lvl === 'INFO' || lvl === 'ACTION' || lvl === 'DISPATCH')) matchRow3 = true;
                if (debugFilterState.row3.has('WARN') && (lvl === 'WARN' || lvl === 'WARNING')) matchRow3 = true;
                if (debugFilterState.row3.has('ERROR') && lvl === 'ERROR') matchRow3 = true;

                if (!matchRow3) return false;
            }

            return true;
        }

        function copyTextToClipboard(text, onSuccess, onError) {
            copyTextSafe(text, onSuccess, onError);
        }

        function formatLogsForExport(logs) {
            const now = new Date();
            const nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');

            const r1 = Array.from(debugFilterState.row1).join(', ');
            const r2 = Array.from(debugFilterState.row2).join(', ');
            const r3 = Array.from(debugFilterState.row3).join(', ');

            let out = '==================================================\n' +
                      '  LuckyStrike OGame Helper v13.1 - Log Kayıtları\n' +
                      '  Tarih: ' + nowStr + '\n' +
                      '  URL: ' + window.location.href + '\n' +
                      '  Filtreler: [Akış: ' + r1 + '] [Kapsam: ' + r2 + '] [Seviye: ' + r3 + ']\n' +
                      '  Toplam Kayıt: ' + logs.length + '\n' +
                      '==================================================\n\n';

            logs.forEach(l => {
                const sTag = l.stream || (l.cat === 'TRACE' ? 'TRACE' : 'DEBUG');
                const catPart = (l.cat && l.cat !== 'TRACE' && l.cat !== 'DEBUG') ? `[${l.cat}] ` : '';
                out += `[${sTag}] [${l.time}] ${catPart}[${l.level}] ${l.msg}\n`;
                if (l.data) {
                    out += `    Data: ${l.data}\n`;
                }
            });

            out += '\n==================================================\n' +
                   '  Log Sonu\n' +
                   '==================================================\n';
            return out;
        }

        async function saveLogsToFile(filename, content) {
            if (window.showSaveFilePicker) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: filename,
                        startIn: 'desktop',
                        types: [{
                            description: 'Metin Dosyası (*.txt)',
                            accept: { 'text/plain': ['.txt'] }
                        }]
                    });
                    const writable = await handle.createWritable();
                    await writable.write(content);
                    await writable.close();
                    return true;
                } catch (err) {
                    if (err && err.name === 'AbortError') {
                        return false;
                    }
                }
            }

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 500);
            return true;
        }

        function renderDebugLogs(isLiveUpdate) {
            const consoleEl = document.getElementById('ls-debug-console');
            const countEl = document.getElementById('ls-debug-count');
            const debugStatusEl = document.getElementById('ls-debug-status');
            const traceStatusEl = document.getElementById('ls-trace-status');
            const debugToggleEl = document.getElementById('ls-debug-toggle');
            const traceToggleEl = document.getElementById('ls-trace-toggle');
            if (!consoleEl) return;

            const debugOn = LS_LOGGER.isDebugEnabled();
            const traceOn = LS_LOGGER.isTraceEnabled();

            if (!isLiveUpdate) {
                if (debugToggleEl) debugToggleEl.checked = debugOn;
                if (traceToggleEl) traceToggleEl.checked = traceOn;
            }

            if (debugStatusEl) {
                debugStatusEl.textContent = debugOn ? t('settings_debug_on', '● Debug: Açık') : t('settings_debug_off', '○ Debug: Kapalı');
                debugStatusEl.style.color = debugOn ? '#2ecc71' : '#8899aa';
            }
            if (traceStatusEl) {
                traceStatusEl.textContent = traceOn ? t('settings_trace_on', '● Trace: Açık') : t('settings_trace_off', '○ Trace: Kapalı');
                traceStatusEl.style.color = traceOn ? '#ff7043' : '#8899aa';
            }

            const allLogs = LS_LOGGER.getLogs();
            const filteredLogs = allLogs.filter(matchesFilters);

            if (countEl) {
                countEl.textContent = `${filteredLogs.length} / ${allLogs.length} ` + t('settings_records', 'kayıt');
            }

            if (allLogs.length === 0) {
                const isEn = (currentLang === 'en');
                let emptyMsg = isEn 
                    ? 'Debug and Trace modes are off.<br>Turn on the switches above to record actions, clicks, and errors in real time.'
                    : 'Debug ve Trace modları kapalı.<br>Yukarıdaki switch\'leri açarak hareketleri, tıklamaları ve hataları anbean kaydetmeye başlayabilirsiniz.';
                if (debugOn && traceOn) {
                    emptyMsg = isEn 
                        ? 'Debug and Trace are active. Activity will be listed here as you use the extension or game.'
                        : 'Debug ve Trace açık. Eklentiyi veya oyunu kullanırken tüm hareketler burada listelenecektir.';
                } else if (debugOn) {
                    emptyMsg = isEn 
                        ? 'Only Debug Logs is active. Only errors and warning records will be listed.'
                        : 'Sadece Debug Logs açık. Yalnızca hata ve uyarı kayıtları listelenecektir.';
                } else if (traceOn) {
                    emptyMsg = isEn 
                        ? 'Only Trace Logs is active. Clicks, keypresses, page navigation, and server responses will be listed.'
                        : 'Sadece Trace Logs açık. Tıklama, tuş, sayfa geçişleri ve oyun yanıtları listelenecektir.';
                }
                consoleEl.innerHTML = `<div style="color:#6e7681;padding:15px;text-align:center;font-style:italic">${emptyMsg}</div>`;
                return;
            }

            const catColors = {
                'TRACE': '#ff7043',
                'EXPEDITION': '#bb86fc',
                'COLLECTOR': '#00bcff',
                'AJAX-REQ': '#3498db',
                'AJAX-RESP': '#2ecc71',
                'OGAME-AJAX': '#2ecc71',
                'OGAME-YANIT': '#f39c12',
                'MOTOR': '#1abc9c',
                'BRIDGE': '#f39c12',
                'SCANNER': '#3498db',
                'CART': '#9b59b6',
                'DEBRIS': '#1abc9c',
                'FINDER': '#f1c40f',
                'ALARM': '#e74c3c',
                'SYSTEM': '#95a5a6',
                'UI': '#7f8c8d'
            };

            const levelColors = {
                'INFO': '#58a6ff',
                'ACTION': '#7ee787',
                'DISPATCH': '#d2a8ff',
                'WARN': '#d29922',
                'ERROR': '#ff7b72'
            };

            const html = filteredLogs.map(entry => {
                const streamTag = entry.stream || (entry.cat === 'TRACE' ? 'TRACE' : 'DEBUG');
                const streamColor = streamTag === 'TRACE' ? '#ff7043' : '#00bcff';
                const catColor = catColors[entry.cat] || '#8899aa';
                const lvlColor = levelColors[entry.level] || '#c9d1d9';
                const escapedMsg = escapeHtml(entry.msg);
                const dataPart = entry.data ? `<div style="color:#8b949e;margin-left:14px;font-size:9.5px;white-space:pre-wrap;word-break:break-all">${escapeHtml(entry.data)}</div>` : '';

                // Trace kayıtlarında ikinci bir [TRACE] tekrarı gösterilmez; doğrudan [ACTION] / [INFO] gelir
                const catPartHtml = (entry.cat && entry.cat !== 'TRACE' && entry.cat !== 'DEBUG') 
                    ? `<span style="color:${catColor};font-weight:bold">[${entry.cat}]</span> ` 
                    : '';

                return `<div style="margin-bottom:3px;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.03)"><span style="color:${streamColor};font-weight:bold">[${streamTag}]</span> <span style="color:#6e7681">[${entry.time}]</span> ${catPartHtml}<span style="color:${lvlColor};font-weight:bold">[${entry.level}]</span> <span style="color:#e6edf3">${escapedMsg}</span>${dataPart}</div>`;
            }).join('');

            consoleEl.innerHTML = html;
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }

        function updateFilterVisuals() {
            document.querySelectorAll('#ls-debug-filters-container .ls-debug-filter').forEach(el => {
                const rowKey = 'row' + el.getAttribute('data-row');
                const val = el.getAttribute('data-val');
                if (debugFilterState[rowKey] && debugFilterState[rowKey].has(val)) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
        }

        onDebugLiveUpdate = function(entry) {
            if (activeTab === 'settings' || activeTab === 'debug') {
                renderDebugLogs(true);
            }
        };

        const debugToggleEl = document.getElementById('ls-debug-toggle');
        if (debugToggleEl) {
            debugToggleEl.checked = LS_LOGGER.isDebugEnabled();
            debugToggleEl.addEventListener('change', () => {
                LS_LOGGER.setDebugEnabled(debugToggleEl.checked);
                renderDebugLogs();
            });
        }

        const traceToggleEl = document.getElementById('ls-trace-toggle');
        if (traceToggleEl) {
            traceToggleEl.checked = LS_LOGGER.isTraceEnabled();
            traceToggleEl.addEventListener('change', () => {
                LS_LOGGER.setTraceEnabled(traceToggleEl.checked);
                renderDebugLogs();
            });
        }

        // 2.1. Logları Kopyala (Seçili filtrelere göre panoya kopyalar)
        const debugCopyBtn = document.getElementById('ls-debug-copy');
        if (debugCopyBtn) {
            debugCopyBtn.addEventListener('click', () => {
                const logs = LS_LOGGER.getLogs().filter(matchesFilters);
                if (!logs || logs.length === 0) {
                    debugCopyBtn.textContent = '⚠️ Log Yok';
                    setTimeout(() => { debugCopyBtn.textContent = '📋 Logları Kopyala'; }, 1500);
                    return;
                }

                const out = formatLogsForExport(logs);
                copyTextToClipboard(out, () => {
                    debugCopyBtn.textContent = '✅ Kopyalandı!';
                    setTimeout(() => { debugCopyBtn.textContent = '📋 Logları Kopyala'; }, 2000);
                }, () => {
                    debugCopyBtn.textContent = '❌ Başarısız';
                    setTimeout(() => { debugCopyBtn.textContent = '📋 Logları Kopyala'; }, 2000);
                });
            });
        }

        // 2.2. Logları Temizle (Seçili filtrelere göre siler, tümü seçiliyse hepsini)
        const debugClearBtn = document.getElementById('ls-debug-clear');
        if (debugClearBtn) {
            debugClearBtn.addEventListener('click', () => {
                const allLogs = LS_LOGGER.getLogs();
                const filteredLogs = allLogs.filter(matchesFilters);
                if (!filteredLogs || filteredLogs.length === 0) {
                    debugClearBtn.textContent = '⚠️ Log Yok';
                    setTimeout(() => { debugClearBtn.textContent = '🗑️ Logları Temizle'; }, 1500);
                    return;
                }

                const isAllSelected = debugFilterState.row1.has('ALL') && debugFilterState.row2.has('ALL') && debugFilterState.row3.has('ALL');
                if (isAllSelected) {
                    LS_LOGGER.clearLogs();
                    LS_TRACER.clearTraces();
                } else {
                    LS_LOGGER.removeFilteredLogs(matchesFilters);
                    if (debugFilterState.row1.has('ALL') || debugFilterState.row1.has('TRACE')) {
                        LS_TRACER.removeFilteredTraces(t => {
                            return matchesFilters({
                                stream: 'TRACE',
                                cat: 'TRACE',
                                level: 'ACTION',
                                msg: t.summary || '',
                                data: t.details
                            });
                        });
                    }
                }

                renderDebugLogs();
                debugClearBtn.textContent = '✅ Temizlendi!';
                setTimeout(() => { debugClearBtn.textContent = '🗑️ Logları Temizle'; }, 1500);
            });
        }

        // 2.3. Logları Çıkar (Seçili filtrelere göre .txt olarak masaüstüne kaydeder)
        const debugExportBtn = document.getElementById('ls-debug-export');
        if (debugExportBtn) {
            debugExportBtn.addEventListener('click', async () => {
                const logs = LS_LOGGER.getLogs().filter(matchesFilters);
                if (!logs || logs.length === 0) {
                    debugExportBtn.textContent = '⚠️ Log Yok';
                    setTimeout(() => { debugExportBtn.textContent = '💾 Logları Çıkar'; }, 1500);
                    return;
                }

                const now = new Date();
                const timeStr = now.getFullYear() + '-' +
                    String(now.getMonth() + 1).padStart(2, '0') + '-' +
                    String(now.getDate()).padStart(2, '0') + '_' +
                    String(now.getHours()).padStart(2, '0') + '-' +
                    String(now.getMinutes()).padStart(2, '0') + '-' +
                    String(now.getSeconds()).padStart(2, '0');
                const filename = `LuckyStrike_logs_${timeStr}.txt`;
                const content = formatLogsForExport(logs);

                try {
                    debugExportBtn.textContent = '⏳ Kaydediliyor...';
                    const saved = await saveLogsToFile(filename, content);
                    if (saved) {
                        debugExportBtn.textContent = '✅ Kaydedildi!';
                    } else {
                        debugExportBtn.textContent = '💾 Logları Çıkar';
                    }
                } catch (e) {
                    debugExportBtn.textContent = '❌ Hata';
                }
                setTimeout(() => { debugExportBtn.textContent = '💾 Logları Çıkar'; }, 2000);
            });
        }

        // 3. 3 Satırlı Multi-Select Filtre Dinleyicileri
        document.querySelectorAll('#ls-debug-filters-container .ls-debug-filter').forEach(f => {
            f.addEventListener('click', () => {
                const rowKey = 'row' + f.getAttribute('data-row');
                const val = f.getAttribute('data-val') || 'ALL';
                if (!debugFilterState[rowKey]) return;

                if (val === 'ALL') {
                    debugFilterState[rowKey].clear();
                    debugFilterState[rowKey].add('ALL');
                } else {
                    debugFilterState[rowKey].delete('ALL');
                    if (debugFilterState[rowKey].has(val)) {
                        debugFilterState[rowKey].delete(val);
                    } else {
                        debugFilterState[rowKey].add(val);
                    }
                    if (debugFilterState[rowKey].size === 0) {
                        debugFilterState[rowKey].add('ALL');
                    }
                }

                updateFilterVisuals();
                renderDebugLogs();
            });
        });

        updateFilterVisuals();

        const langSelect = document.getElementById('ls-setting-lang');
        if (langSelect) {
            langSelect.value = currentLang || 'tr';
            langSelect.addEventListener('change', () => {
                currentLang = langSelect.value;
                localStorage.setItem(KEYS.LANG, currentLang);
                LS_LOGGER.action('SETTINGS', 'Language changed: ' + currentLang);
                applyTranslations();
                updateButtonLabel();
            });
        }
        const themeSelect = document.getElementById('ls-setting-theme');
        if (themeSelect) {
            themeSelect.value = localStorage.getItem(KEYS.THEME) || 'dark';
            themeSelect.addEventListener('change', () => {
                applyTheme(themeSelect.value);
                LS_LOGGER.action('SETTINGS', 'Theme changed: ' + themeSelect.value);
            });
        }

        const opacitySlider = document.getElementById('ls-setting-opacity');
        const opacityVal = document.getElementById('ls-setting-opacity-val');
        if (opacitySlider) {
            opacitySlider.value = String(generalSettings.opacity);
            if (opacityVal) opacityVal.textContent = generalSettings.opacity + '%';
            opacitySlider.addEventListener('input', () => {
                const val = parseInt(opacitySlider.value, 10) || 100;
                generalSettings.opacity = Math.max(20, Math.min(100, val));
                if (opacityVal) opacityVal.textContent = generalSettings.opacity + '%';
                localStorage.setItem(KEYS.OPACITY, String(generalSettings.opacity));
                applyPanelOpacity();
            });
        }

        const hoverFocusToggle = document.getElementById('ls-setting-hover-focus');
        if (hoverFocusToggle) {
            hoverFocusToggle.checked = !!generalSettings.hoverFocus;
            hoverFocusToggle.addEventListener('change', () => {
                generalSettings.hoverFocus = hoverFocusToggle.checked;
                localStorage.setItem(KEYS.HOVER_FOCUS, hoverFocusToggle.checked ? 'true' : 'false');
                applyPanelOpacity();
                LS_LOGGER.action('SETTINGS', 'Hover focus changed: ' + generalSettings.hoverFocus);
            });
        }

        // Intercept clicks on OGame jQuery UI selectmenu popup items (which reside outside #ls-panel in document.body)
        document.addEventListener('click', (e) => {
            const item = e.target && e.target.closest && e.target.closest('.ui-menu-item, .ui-selectmenu-menu li, .ui-selectmenu-menu a');
            if (!item) return;

            const txt = (item.textContent || '').trim();
            const langSelect = document.getElementById('ls-setting-lang');
            if (langSelect) {
                let targetLang = null;
                if (txt.includes('English') || txt.includes('ENG')) targetLang = 'en';
                else if (txt.includes('Türkçe') || txt.includes('TR')) targetLang = 'tr';
                if (targetLang && targetLang !== currentLang) {
                    currentLang = targetLang;
                    langSelect.value = targetLang;
                    localStorage.setItem(KEYS.LANG, currentLang);
                    LS_LOGGER.action('SETTINGS', 'Language changed: ' + currentLang);
                    applyTranslations();
                    updateButtonLabel();
                }
            }

            const themeSelect = document.getElementById('ls-setting-theme');
            if (themeSelect) {
                let targetTheme = null;
                if (txt.includes('Fenerbahçe') || txt.includes('Kanarya') || txt.includes('Yellow & Navy') || txt.includes('Dark Canary')) targetTheme = 'fb';
                else if (txt.includes('Uzay Karanlığı') || txt.includes('Deep Space') || txt.includes('Varsayılan') || txt.includes('Default')) targetTheme = 'dark';
                if (targetTheme && targetTheme !== generalSettings.theme) {
                    applyTheme(targetTheme);
                    LS_LOGGER.action('SETTINGS', 'Theme changed via selectmenu: ' + targetTheme);
                }
            }
        }, true);

        applyTranslations();

        setTimeout(() => {
            checkThreatsInDOM();
        }, 1000);
    }

    // ============================================================
    // SAFE OBSERVER & POPUP MANAGEMENT
    // ============================================================
    function updateButtonLabel() {
        const btn = document.getElementById('ls-add-cart-btn');
        const countSpan = document.getElementById('ls-lvl-display');
        if (!btn) return;

        const data = parseCostsFromPopup();
        if (countSpan) countSpan.textContent = `+${selectedLevelsToAdd}`;

        const baseText = t('cart_btn_add', 'Sepete Ekle');
        let newText = `📥 ${baseText}`;
        if (data && data.level) {
            newText = `📥 ${baseText} (${data.level})`;
        } else if (data && data.count > 0) {
            newText = `📥 ${baseText} (x${fmt(data.count)})`;
        }

        if (btn.textContent !== newText) {
            btn.textContent = newText;
        }
    }

    function checkAndInjectButtons() {
        const popup = document.getElementById('technologydetails');
        if (!popup) return;

        const currentTitle = popup.querySelector('h3')?.textContent?.trim() || '';
        if (!currentTitle) return;

        const existingGroup = document.getElementById('ls-btn-group');
        if (existingGroup) {
            if (existingGroup.getAttribute('data-title') !== currentTitle) {
                existingGroup.remove();
                selectedLevelsToAdd = 1;
            } else {
                return;
            }
        }

        const isShipOrDefense = !!(popup.querySelector('#build_amount') || popup.querySelector('input[name="amount"]') || popup.querySelector('input#amount'));

        const group = document.createElement('div');
        group.id = 'ls-btn-group';
        group.setAttribute('data-title', currentTitle);

        if (!isShipOrDefense) {
            const stepperBox = document.createElement('div');
            stepperBox.id = 'ls-stepper-box';

            const downBtn = document.createElement('button');
            downBtn.className = 'ls-lvl-btn';
            downBtn.textContent = '−';
            downBtn.title = t('cart_stepper_down_title', 'Kademe azalt');
            downBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                if (selectedLevelsToAdd > 1) {
                    selectedLevelsToAdd--;
                    updateButtonLabel();
                }
            });

            const display = document.createElement('span');
            display.id = 'ls-lvl-display';
            display.textContent = `+${selectedLevelsToAdd}`;

            const upBtn = document.createElement('button');
            upBtn.className = 'ls-lvl-btn';
            upBtn.textContent = '+';
            upBtn.title = t('cart_stepper_up_title', 'Kademe artır');
            upBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                selectedLevelsToAdd++;
                updateButtonLabel();
            });

            stepperBox.appendChild(downBtn);
            stepperBox.appendChild(display);
            stepperBox.appendChild(upBtn);
            group.appendChild(stepperBox);
        } else {
            const qtyInput = popup.querySelector('#build_amount') ||
                             popup.querySelector('input[name="amount"]') ||
                             popup.querySelector('input#amount');
            if (qtyInput) {
                qtyInput.addEventListener('input', updateButtonLabel);
                qtyInput.addEventListener('change', updateButtonLabel);
                qtyInput.addEventListener('keyup', updateButtonLabel);
            }
            popup.addEventListener('click', (e) => {
                if (e.target.closest('.allnone, .btn_fill, [data-action="max"], #allnone, .icon_max, .all, button')) {
                    setTimeout(updateButtonLabel, 50);
                    setTimeout(updateButtonLabel, 150);
                }
            });
        }

        const newBtn = document.createElement('button');
        newBtn.id = 'ls-add-cart-btn';
        newBtn.textContent = '📥 ' + t('cart_btn_add', 'Sepete Ekle');
        newBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            addToCart();
        });
        group.appendChild(newBtn);

        popup.style.position = 'relative';
        popup.appendChild(group);

        setTimeout(updateButtonLabel, 50);
    }

    let injectObserverTimer = null;
    function setupObserver() {
        const observer = new MutationObserver(() => {
            if (injectObserverTimer) return;
            injectObserverTimer = setTimeout(() => {
                injectObserverTimer = null;
                checkAndInjectButtons();
            }, 60);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        checkAndInjectButtons();
    }

    // ============================================================
    // INIT
    // ============================================================
    buildUI();
    setupObserver();
    setupDebrisObserver();
    checkAndApplyCartDelivery();
    updateActivePlanetCache();
    checkAndRunCollectorAssistant();
    checkAndRunCourierAssistant();
    checkAndRunExpeditionAssistant();
    scanAndSaveExpeditionTemplates();
    console.log(LS, 'LuckyStrike OGame Helper v13.1 hazır!');

})();
