// ==UserScript==
// @name         LuckyStrike OGame Helper
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  LuckyStrike OGame Helper: Maliyet Sepeti, Galaxy Scanner, Player Finder, Sesli Alarm, Harabe TakipÃ§isi
// @author       LuckyStrike
// @match        *://*.ogame.gameforge.com/game/index.php*
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function() {
    'use strict';

    const LS = '[LS]';
    console.log(LS, 'LuckyStrike OGame Helper v7.1 yükleniyor...');

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
        AUTOLOAD: 'LS_FLEET_AUTOLOAD'
    };

    let cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    let activeTab = localStorage.getItem(KEYS.TAB) || 'cart';
    let isPanelOpen = localStorage.getItem(KEYS.OPEN) === 'true';
    let scanSettings = JSON.parse(localStorage.getItem(KEYS.SCAN) || '{}');
    scanSettings = Object.assign({ gStart: 1, gEnd: 9, sStart: 1, sEnd: 499, slots: '8', minEmpty: 1 }, scanSettings);

    let alarmSettings = Object.assign({
        attackEnabled: true,
        espionageEnabled: true,
        desktopNotification: false,
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
    // Otomatik temizlik: Eski hatalı yapışık okumaları (örn: 2.162.180) temizle
    if (Array.isArray(debrisList)) {
        const initialCount = debrisList.length;
        debrisList = debrisList.filter(item => {
            if (!item || !item.id) return false;
            if (item.p === 16 && (item.crystal === 0 || item.metal > 1000000 || item.total > 1000000)) {
                return false;
            }
            return true;
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
        if (activeEl && activeEl.textContent.trim()) {
            return activeEl.textContent.trim();
        }

        // 2. Aktif Ay seçimi varsa
        const activeMoon = document.querySelector('#planetList .moonlink.active') ||
                           document.querySelector('.smallplanet .moonlink.active');
        if (activeMoon) {
            const moonTitle = activeMoon.getAttribute('title') || activeMoon.textContent;
            if (moonTitle && moonTitle.trim()) return moonTitle.split('[')[0].trim() || 'Ay';
        }

        // 3. OGame resmi meta etiketi (Sunucu tarafından aktif gezegene göre üretilir)
        const metaName = document.querySelector('meta[name="ogame-planet-name"]')?.getAttribute('content');
        if (metaName && metaName.trim()) {
            return metaName.trim();
        }

        // 4. Üst başlık veya seçili gezegen başlığı
        const headerEl = document.querySelector('#planetNameHeader') ||
                         document.querySelector('#selectedPlanetName') ||
                         document.querySelector('.planet-header .planet-name');
        if (headerEl && headerEl.textContent.trim()) {
            return headerEl.textContent.trim();
        }

        return 'Gezegen';
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

        const classMatch = (popup.className + ' ' + (popup.querySelector('.lifeformsprite, .sprite')?.className || '')).match(/(?:tech|technologydetails_|technology-)(\d+)/i);
        if (classMatch && parseInt(classMatch[1], 10) > 0) {
            return parseInt(classMatch[1], 10);
        }

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
            const q = parseInt(qtyInput.value, 10);
            if (q > 0) result.count = q;
            const base = parseNextLevelBaseCost(popup);
            result.metal = base.metal * result.count;
            result.crystal = base.crystal * result.count;
            result.deuterium = base.deuterium * result.count;
            result.level = null;
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

        cart.push({
            id: Date.now(),
            name: data.name,
            level: data.level,
            planet: data.planet,
            metal: data.metal,
            crystal: data.crystal,
            deuterium: data.deuterium,
            count: data.count,
            isDeduction: false
        });
        saveCart();
        renderCart();

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

    function deductPlanetResources() {
        const live = getLiveResources();
        const pName = getCurrentPlanetName();

        if (live.metal === 0 && live.crystal === 0 && live.deuterium === 0) {
            alert('Bu gezegende kaynak bulunamadı veya okunamadı.');
            return;
        }

        cart.push({
            id: Date.now(),
            name: `Mevcut Kaynak`,
            level: null,
            planet: pName,
            metal: -live.metal,
            crystal: -live.crystal,
            deuterium: -live.deuterium,
            count: 1,
            isDeduction: true
        });
        saveCart();
        renderCart();
    }

    function removeCartItem(idx) {
        cart.splice(idx, 1);
        saveCart();
        renderCart();
    }
    window.lsRemoveCartItem = removeCartItem;

    function copyNumber(val, elemId) {
        const absVal = Math.abs(val);
        navigator.clipboard.writeText(String(absVal)).then(() => {
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
        } catch (e) {
            console.error(LS, 'Araştırma seviyeleri çekilemedi:', e);
        }
        return techCache;
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

        const knCap = liveKN > 0 ? liveKN : Math.floor(5000 * bonus);
        const bnCap = liveBN > 0 ? liveBN : Math.floor(25000 * bonus);

        return {
            kn: Math.max(5000, knCap),
            bn: Math.max(25000, bnCap)
        };
    }

    function selectFleetShips(mode, totalCargoNeeded) {
        const caps = calculateShipCapacities();
        const getShipEl = (shipId) => {
            return document.querySelector(`input[name="am${shipId}"]`) ||
                   document.querySelector(`#ship_${shipId}`) ||
                   document.querySelector(`input[name="ship_${shipId}"]`) ||
                   document.querySelector(`li.technology${shipId} input`) ||
                   document.querySelector(`[data-technology="${shipId}"] input`);
        };

        const getAvailableCount = (shipId) => {
            const input = getShipEl(shipId);
            if (!input) return 0;
            const parent = input.closest('li') || input.parentElement;
            if (parent) {
                const amountEl = parent.querySelector('.amount') || parent.querySelector('.amount_current') || parent.querySelector('.stock');
                if (amountEl) {
                    const parsed = parseOgNum(amountEl.textContent);
                    if (parsed > 0) return parsed;
                }
            }
            const maxAttr = input.getAttribute('data-max') || input.getAttribute('max');
            if (maxAttr) return parseInt(maxAttr, 10) || 0;
            return 999999;
        };

        const setShipAmount = (shipId, amount) => {
            const inp = getShipEl(shipId);
            if (!inp) return false;
            const targetVal = String(Math.max(0, parseInt(amount, 10) || 0));
            inp.value = targetVal;
            ['focus', 'input', 'change', 'keydown', 'keyup', 'blur'].forEach(evt => {
                inp.dispatchEvent(new Event(evt, { bubbles: true }));
            });
            try {
                if (window.$) window.$(inp).val(targetVal).trigger('input').trigger('change').trigger('keyup');
            } catch (e) {}
            return true;
        };

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

            try {
                if (window.$) {
                    window.$(el).val(targetVal).trigger('input').trigger('change').trigger('keyup');
                }
            } catch (e) {}
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

        try {
            if (typeof window.calculateCargo === 'function') window.calculateCargo();
            if (typeof window.checkCargo === 'function') window.checkCargo();
            if (window.$ && typeof window.$.fn.cargoCalculation === 'function') {
                window.$('#fleet3').cargoCalculation();
            }
        } catch (e) {}

        return filled;
    }

    function getCartRequiredResources() {
        let netM = 0, netC = 0, netD = 0;
        let posM = 0, posC = 0, posD = 0;

        cart.forEach(item => {
            netM += item.metal;
            netC += item.crystal;
            netD += item.deuterium;
            if (!item.isDeduction) {
                posM += Math.max(0, item.metal);
                posC += Math.max(0, item.crystal);
                posD += Math.max(0, item.deuterium);
            }
        });

        const hasDeduction = cart.some(item => item.isDeduction);

        let reqM = 0, reqC = 0, reqD = 0;
        if (hasDeduction) {
            // Gezegenden düşüldüyse, SADECE açığı olan (pozitif kalan) kaynakları taşı
            reqM = Math.max(0, netM);
            reqC = Math.max(0, netC);
            reqD = Math.max(0, netD);
        } else {
            // Düşülmediyse sepetin tam pozitif maliyetini taşı
            reqM = Math.max(0, posM);
            reqC = Math.max(0, posC);
            reqD = Math.max(0, posD);
        }

        return { m: reqM, c: reqC, d: reqD, hasDeduction };
    }

    let fleetAutoLoadInterval = null;

    function loadIntoFleet(mode) {
        mode = mode || 'auto'; // 'auto' | 'kn' | 'bn'
        const req = getCartRequiredResources();
        const totalReq = req.m + req.c + req.d;

        if (totalReq === 0) {
            if (req.hasDeduction) {
                alert('Bu gezegende tüm kaynaklar fazlasıyla mevcut, dışarıdan kaynak taşımaya gerek yok!');
            } else {
                alert('Sepette yüklenecek kaynak bulunamadı.');
            }
            return;
        }

        const btnAuto = document.getElementById('ls-load-btn-auto');
        const btnKN = document.getElementById('ls-load-btn-kn');
        const btnBN = document.getElementById('ls-load-btn-bn');

        sessionStorage.setItem(KEYS.AUTOLOAD, JSON.stringify({ m: req.m, c: req.c, d: req.d, mode: mode, ts: Date.now() }));

        const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                            document.getElementById('fleetdispatchcomponent') ||
                            document.getElementById('fleet1') ||
                            document.getElementById('fleet2') ||
                            document.getElementById('fleet3');

        if (isFleetPage) {
            // 1. Önce gemileri seç, kapasite açılsın
            selectFleetShips(mode, totalReq);

            // 2. Ardından kaynakları doldur
            setTimeout(() => {
                const success = fillFleetResources(req.m, req.c, req.d);
                const activeBtn = mode === 'kn' ? btnKN : (mode === 'bn' ? btnBN : btnAuto);
                if (success) {
                    if (activeBtn) {
                        const orig = activeBtn.innerHTML;
                        activeBtn.innerHTML = '✓ Yüklendi!';
                        activeBtn.style.background = '#27ae60';
                        setTimeout(() => { activeBtn.innerHTML = orig; activeBtn.style.background = ''; }, 2000);
                    }
                }
            }, 100);

            startFleetAutoLoadPolling();
        } else {
            const activeBtn = mode === 'kn' ? btnKN : (mode === 'bn' ? btnBN : btnAuto);
            if (activeBtn) activeBtn.innerHTML = '⏳ Filoya Gidiliyor...';
            const fleetLink = document.querySelector('a[href*="component=fleetdispatch"]') ||
                              document.querySelector('#menuTable a.menubutton[href*="fleetdispatch"]') ||
                              document.querySelector('#menuTableTools a[href*="fleetdispatch"]');
            if (fleetLink) {
                fleetLink.click();
            } else {
                window.location.href = '/game/index.php?page=ingame&component=fleetdispatch';
            }
        }
    }

    function checkAndApplyFleetAutoLoad() {
        const raw = sessionStorage.getItem(KEYS.AUTOLOAD);
        if (!raw) return false;
        try {
            const data = JSON.parse(raw);
            if (!data || !data.ts || (Date.now() - data.ts > 180000)) {
                sessionStorage.removeItem(KEYS.AUTOLOAD);
                return false;
            }

            const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                                document.getElementById('fleetdispatchcomponent') ||
                                document.getElementById('fleet1') ||
                                document.getElementById('fleet2') ||
                                document.getElementById('fleet3');
            if (!isFleetPage) return false;

            const totalReq = (data.m || 0) + (data.c || 0) + (data.d || 0);
            selectFleetShips(data.mode || 'auto', totalReq);

            const success = fillFleetResources(data.m, data.c, data.d);
            if (success) {
                const btnAuto = document.getElementById('ls-load-btn-auto');
                if (btnAuto && !btnAuto.textContent.includes('✓')) {
                    btnAuto.textContent = '✓ Gemiye Yüklendi!';
                    btnAuto.style.background = '#27ae60';
                    setTimeout(() => { btnAuto.textContent = '⚡ Otomatik Yükle'; btnAuto.style.background = ''; }, 2500);
                }
                return true;
            }
        } catch (e) {
            sessionStorage.removeItem(KEYS.AUTOLOAD);
        }
        return false;
    }

    function startFleetAutoLoadPolling() {
        if (fleetAutoLoadInterval) clearInterval(fleetAutoLoadInterval);
        let tries = 0;
        fleetAutoLoadInterval = setInterval(() => {
            tries++;
            const done = checkAndApplyFleetAutoLoad();
            if (done || tries > 40) {
                clearInterval(fleetAutoLoadInterval);
                fleetAutoLoadInterval = null;
                if (done) {
                    setTimeout(() => sessionStorage.removeItem(KEYS.AUTOLOAD), 4000);
                }
            }
        }, 500);
    }

    function renderCart() {
        const listEl = document.getElementById('ls-cart-list');
        const totalsEl = document.getElementById('ls-cart-totals');
        if (!listEl || !totalsEl) return;

        listEl.innerHTML = '';
        let tM = 0, tC = 0, tD = 0;
        let posTotal = 0;
        let negTotal = 0;

        if (cart.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;color:#666;padding:15px;">Sepet boş</div>';
        } else {
            cart.forEach((item, i) => {
                tM += item.metal; tC += item.crystal; tD += item.deuterium;
                const itemSum = item.metal + item.crystal + item.deuterium;
                if (item.isDeduction || itemSum < 0) {
                    negTotal += Math.abs(itemSum);
                } else {
                    posTotal += itemSum;
                }

                const d = document.createElement('div');
                d.className = 'ls-item';
                if (item.isDeduction) d.style.borderLeft = '3px solid #e67e22';

                const safeName = escapeHtml(item.name);
                const safeLevel = item.level ? escapeHtml(item.level) : null;
                const safePlanet = item.planet ? escapeHtml(item.planet) : null;

                const sign = (n) => n < 0 ? fmt(n) : '+' + fmt(n);
                const mColor = (n) => n < 0 ? '#e67e22' : '#ffbe3b';
                const cColor = (n) => n < 0 ? '#e67e22' : '#5dade2';
                const dColor = (n) => n < 0 ? '#e67e22' : '#2ecc71';

                let titleHtml = '<span style="color:' + (item.isDeduction ? '#e67e22' : '#ffffff') + ';font-weight:bold">' +
                    (item.isDeduction ? '📉 ' : '') + safeName +
                '</span>';

                if (safeLevel) {
                    titleHtml += '<span style="color:#b0bec5;font-weight:bold;margin-left:6px">' + safeLevel + '</span>';
                } else if (item.count > 1) {
                    titleHtml += '<span style="color:#b0bec5;font-weight:bold;margin-left:6px">x' + parseInt(item.count, 10) + '</span>';
                }

                const planetBadge = safePlanet ?
                    '<span style="color:#d29bfe;font-size:10px;font-weight:bold;background:rgba(179,136,255,0.12);border:1px solid rgba(179,136,255,0.28);padding:1px 6px;border-radius:4px;white-space:nowrap;user-select:none" title="Gezegen: ' + safePlanet + '">' +
                        safePlanet +
                    '</span>' : '';

                d.innerHTML =
                    '<div style="flex:1;min-width:0;margin-right:8px">' +
                        '<div style="font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
                            titleHtml +
                        '</div>' +
                        '<div style="font-size:10px;margin-top:2px;font-family:monospace">' +
                            '<span style="color:' + mColor(item.metal) + '">' + sign(item.metal) + '</span> · ' +
                            '<span style="color:' + cColor(item.crystal) + '">' + sign(item.crystal) + '</span> · ' +
                            '<span style="color:' + dColor(item.deuterium) + '">' + sign(item.deuterium) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ls-item-right" style="display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:auto">' +
                        planetBadge +
                    '</div>';

                const xBtn = document.createElement('button');
                xBtn.className = 'ls-x';
                xBtn.textContent = '✖';
                xBtn.title = 'Sepetten Çıkar';
                xBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeCartItem(i);
                });
                d.querySelector('.ls-item-right').appendChild(xBtn);

                listEl.appendChild(d);
            });
        }

        const netTotal = tM + tC + tD;
        const caps = calculateShipCapacities();

        // 1. Maliyet (+ Kaynak) İhtiyacı
        const posBN = posTotal > 0 ? Math.ceil(posTotal / caps.bn) : 0;
        const posKN = posTotal > 0 ? Math.ceil(posTotal / caps.kn) : 0;

        // 2. Mevcut Gezegen (- Kaynak) Kapasitesi
        const negBN = negTotal > 0 ? Math.ceil(negTotal / caps.bn) : 0;
        const negKN = negTotal > 0 ? Math.ceil(negTotal / caps.kn) : 0;

        // 3. Net Kalan Açık (Sadece pozitif kalan açıklar toplanır)
        const hasDeduction = cart.some(item => item.isDeduction);
        const netDeficitTotal = Math.max(0, tM) + Math.max(0, tC) + Math.max(0, tD);
        const netBN = netDeficitTotal > 0 ? Math.ceil(netDeficitTotal / caps.bn) : 0;
        const netKN = netDeficitTotal > 0 ? Math.ceil(netDeficitTotal / caps.kn) : 0;

        // Butonlar için hedeflenen nakliye ihtiyacı:
        // Eğer gezegenden düşme yapıldıysa ve açık varsa -> netDeficitTotal
        // Eğer gezegenden düşme yapılmadıysa -> posTotal
        // Eğer tüm kaynaklar yetiyorsa (açık yoksa) -> 0
        const targetShipTotal = hasDeduction ? netDeficitTotal : posTotal;
        const targetBN = targetShipTotal > 0 ? Math.ceil(targetShipTotal / caps.bn) : 0;
        const targetKN = targetShipTotal > 0 ? Math.ceil(targetShipTotal / caps.kn) : 0;

        let cargoHtml = '';
        if (posTotal > 0 || negTotal > 0) {
            cargoHtml = '<div style="margin-top:6px;padding:6px 8px;background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:4px;font-size:10.5px;display:flex;flex-direction:column;gap:3px">';

            if (posTotal > 0) {
                cargoHtml +=
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#2ecc71">➕ Maliyet İhtiyacı:</span>' +
                        '<span style="color:#d1d8e0">' +
                            '<b style="color:#00bcff">' + fmt(posBN) + '</b> <span style="font-size:9.5px;color:#8899aa">BN</span> ' +
                            '<span style="color:#34495e">|</span> ' +
                            '<b style="color:#2ecc71">' + fmt(posKN) + '</b> <span style="font-size:9.5px;color:#8899aa">KN</span>' +
                        '</span>' +
                    '</div>';
            }

            if (negTotal > 0) {
                cargoHtml +=
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#e67e22">➖ Mevcut Gezegen:</span>' +
                        '<span style="color:#d1d8e0">' +
                            '<b style="color:#00bcff">' + fmt(negBN) + '</b> <span style="font-size:9.5px;color:#8899aa">BN</span> ' +
                            '<span style="color:#34495e">|</span> ' +
                            '<b style="color:#2ecc71">' + fmt(negKN) + '</b> <span style="font-size:9.5px;color:#8899aa">KN</span>' +
                        '</span>' +
                    '</div>';
            }

            if (posTotal > 0 && negTotal > 0) {
                cargoHtml +=
                    '<div style="border-top:1px dashed #233446;margin-top:2px;padding-top:3px;display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#00bcff;font-weight:bold">📊 Net Kalan:</span>' +
                        '<span style="color:#d1d8e0">' +
                            (netDeficitTotal > 0 ? (
                                '<b style="color:#00bcff">' + fmt(netBN) + '</b> <span style="font-size:9.5px;color:#8899aa">BN</span> ' +
                                '<span style="color:#34495e">|</span> ' +
                                '<b style="color:#2ecc71">' + fmt(netKN) + '</b> <span style="font-size:9.5px;color:#8899aa">KN</span>'
                            ) : '<span style="color:#2ecc71;font-size:10px">Yeterli Kaynak Var ✓</span>') +
                        '</span>' +
                    '</div>';
            }

            // Gemiye Yükleme Butonları (3'lü: Otomatik, KN, BN)
            cargoHtml +=
                '<div style="margin-top:6px;display:flex;flex-direction:column;gap:4px">' +
                    '<button id="ls-load-btn-auto" class="ls-btn" style="width:100%;background:linear-gradient(135deg,#00bcff,#0077b6);color:#fff;padding:6px 8px;font-size:11px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 6px rgba(0,0,0,0.4)" title="Önce KN yetiyorsa KN, yoksa BN seçip kaynakları doldurur">' +
                        '⚡ Gemiye Yükle (Otomatik)' +
                    '</button>' +
                    '<div style="display:flex;gap:4px">' +
                        '<button id="ls-load-btn-kn" class="ls-btn" style="flex:1;background:#1a3a5c;color:#5dade2;border:1px solid #234d7a;padding:5px 4px;font-size:10px;display:flex;align-items:center;justify-content:center;gap:3px" title="Sadece Küçük Nakliye seçip kaynakları doldurur">' +
                            '📦 ' + fmt(targetKN) + ' KN' +
                        '</button>' +
                        '<button id="ls-load-btn-bn" class="ls-btn" style="flex:1;background:#1a3a5c;color:#00bcff;border:1px solid #234d7a;padding:5px 4px;font-size:10px;display:flex;align-items:center;justify-content:center;gap:3px" title="Sadece Büyük Nakliye seçip kaynakları doldurur">' +
                            '🚛 ' + fmt(targetBN) + ' BN' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }

        totalsEl.innerHTML =
            '<div style="margin-bottom:8px">' +
                '<button id="ls-deduct-btn" class="ls-btn-sm" style="width:100%;background:#d35400;color:#fff;padding:5px;">' +
                    '📉 Mevcut Gezegen Kaynağını Sepetten Düş' +
                '</button>' +
            '</div>' +
            '<div class="ls-total-row" style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:11px">' +
                '<div style="display:flex;align-items:center;width:110px;justify-content:space-between">' +
                    '<span>🟡 Metal</span><span style="color:#7f8c8d;margin-right:2px">:</span>' +
                '</div>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#ffbe3b;font-family:monospace;font-size:11.5px">' + fmt(tM) + '</b>' +
                    '<button id="ls-cp-m" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>' +
            '<div class="ls-total-row" style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:11px">' +
                '<div style="display:flex;align-items:center;width:110px;justify-content:space-between">' +
                    '<span>🔵 Kristal</span><span style="color:#7f8c8d;margin-right:2px">:</span>' +
                '</div>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#5dade2;font-family:monospace;font-size:11.5px">' + fmt(tC) + '</b>' +
                    '<button id="ls-cp-c" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>' +
            '<div class="ls-total-row" style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:11px">' +
                '<div style="display:flex;align-items:center;width:110px;justify-content:space-between">' +
                    '<span>🟢 Deuterium</span><span style="color:#7f8c8d;margin-right:2px">:</span>' +
                '</div>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#2ecc71;font-family:monospace;font-size:11.5px">' + fmt(tD) + '</b>' +
                    '<button id="ls-cp-d" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>' +
            '<div class="ls-total-row" style="border-top:1px solid #233446;padding-top:4px;margin-top:4px;display:flex;justify-content:space-between;align-items:center;font-size:11px">' +
                '<div style="display:flex;align-items:center;width:110px;justify-content:space-between">' +
                    '<span style="color:#ff6b6b;font-weight:bold">🔴 Total</span><span style="color:#7f8c8d;margin-right:2px">:</span>' +
                '</div>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#fff;font-family:monospace;font-size:12px;font-weight:bold">' + fmt(netTotal) + '</b>' +
                    '<button id="ls-cp-net" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>' +
            cargoHtml;

        document.getElementById('ls-deduct-btn')?.addEventListener('click', deductPlanetResources);
        document.getElementById('ls-load-btn-auto')?.addEventListener('click', () => loadIntoFleet('auto'));
        document.getElementById('ls-load-btn-kn')?.addEventListener('click', () => loadIntoFleet('kn'));
        document.getElementById('ls-load-btn-bn')?.addEventListener('click', () => loadIntoFleet('bn'));
        document.getElementById('ls-cp-m')?.addEventListener('click', () => copyNumber(tM, 'ls-cp-m'));
        document.getElementById('ls-cp-c')?.addEventListener('click', () => copyNumber(tC, 'ls-cp-c'));
        document.getElementById('ls-cp-d')?.addEventListener('click', () => copyNumber(tD, 'ls-cp-d'));
        document.getElementById('ls-cp-net')?.addEventListener('click', () => copyNumber(netTotal, 'ls-cp-net'));
    }

    function copyCart() {
        let lines = ['═══ LuckyStrike Maliyet Sepeti ═══', ''];
        let tM = 0, tC = 0, tD = 0;
        cart.forEach(item => {
            let label = item.name;
            if (item.level) label += ' (' + item.level + ')';
            if (item.count > 1) label += ' x' + item.count;
            lines.push('• ' + label + ' [' + item.planet + ']');
            lines.push('  M: ' + fmt(item.metal) + ' | K: ' + fmt(item.crystal) + ' | D: ' + fmt(item.deuterium));
            tM += item.metal; tC += item.crystal; tD += item.deuterium;
        });
        lines.push('');
        lines.push('NET: M: ' + fmt(tM) + ' | K: ' + fmt(tC) + ' | D: ' + fmt(tD));
        lines.push('Total: ' + fmt(tM + tC + tD));
        navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const btn = document.getElementById('ls-cart-copy');
            if (btn) { btn.textContent = '✓ Kopyalandı!'; setTimeout(() => { btn.textContent = '📋 Panoya Kopyala'; }, 2000); }
        });
    }

    // ============================================================
    // GALAXY SCANNER
    // ============================================================
    async function startScan() {
        const btn = document.getElementById('ls-scan-btn');
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
        if (targetSlots.length === 0) { statusEl.textContent = 'Geçerli slot girilmedi!'; return; }

        scanSettings = { gStart, gEnd, sStart, sEnd, slots: slotsStr, minEmpty };
        localStorage.setItem(KEYS.SCAN, JSON.stringify(scanSettings));

        btn.disabled = true;
        btn.textContent = '⏳ Taranıyor...';
        progEl.style.display = 'block';
        barEl.style.width = '0%';
        resBox.style.display = 'none';
        resList.innerHTML = '';
        statusEl.textContent = 'Universe API çekiliyor...';

        try {
            const resp = await fetch('/api/universe.xml');
            if (!resp.ok) throw new Error('API yanıt vermedi (' + resp.status + ')');
            const xml = await resp.text();

            statusEl.textContent = 'Veri işleniyor...';
            barEl.style.width = '40%';

            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const planets = doc.getElementsByTagName('planet');
            const occupied = new Set();
            for (let i = 0; i < planets.length; i++) {
                const c = planets[i].getAttribute('coords');
                if (c) occupied.add(c);
            }

            barEl.style.width = '60%';
            statusEl.textContent = 'Boş slotlar hesaplanıyor...';

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
            statusEl.textContent = results.length + ' sonuç bulundu.';

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
                    navBtn.title = 'Galaksiye Git';
                    navBtn.addEventListener('click', () => navigateToGalaxy(r.g, r.s));
                    div.appendChild(navBtn);
                    resList.appendChild(div);
                });
            }
        } catch (e) {
            console.error(LS, e);
            statusEl.textContent = 'Hata: ' + e.message;
        } finally {
            btn.disabled = false;
            btn.textContent = '🔍 Taramayı Başlat';
            setTimeout(() => { progEl.style.display = 'none'; }, 2000);
        }
    }

    let lastScanResults = null;

    function copyScanResults() {
        if (!lastScanResults) return;
        const lines = ['═══ Galaxy Scanner Sonuçları ═══', ''];
        lastScanResults.forEach(r => {
            lines.push('[' + r.g + ':' + r.s + '] → Boş: ' + r.slots.join(', '));
        });
        lines.push('');
        lines.push('Toplam: ' + lastScanResults.length + ' sistem');
        navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const btn = document.getElementById('ls-scan-copy');
            if (btn) { btn.textContent = '✓ Kopyalandı!'; setTimeout(() => { btn.textContent = '📋 Panoya Kopyala'; }, 2000); }
        });
    }

    // ============================================================
    // PLAYER FINDER
    // ============================================================
    let apiCacheInMemory = null;

    async function loadApiData() {
        if (apiCacheInMemory && (Date.now() - apiCacheInMemory.ts < 24 * 3600 * 1000)) {
            return apiCacheInMemory;
        }

        const raw = sessionStorage.getItem(KEYS.API) || localStorage.getItem(KEYS.API);
        if (raw) {
            try {
                const cache = JSON.parse(raw);
                if (cache.ts && (Date.now() - cache.ts < 24 * 3600 * 1000) && cache.players && cache.planets) {
                    apiCacheInMemory = cache;
                    return cache;
                }
            } catch (e) { /* ignore */ }
        }

        const [pResp, uResp] = await Promise.all([
            fetch('/api/players.xml'),
            fetch('/api/universe.xml')
        ]);
        if (!pResp.ok || !uResp.ok) throw new Error('API erişim hatası');

        const pDoc = new DOMParser().parseFromString(await pResp.text(), 'text/xml');
        const uDoc = new DOMParser().parseFromString(await uResp.text(), 'text/xml');

        const players = {};
        const pEls = pDoc.getElementsByTagName('player');
        for (let i = 0; i < pEls.length; i++) {
            players[pEls[i].getAttribute('id')] = {
                name: pEls[i].getAttribute('name') || '',
                status: pEls[i].getAttribute('status') || ''
            };
        }

        const planets = [];
        const plEls = uDoc.getElementsByTagName('planet');
        for (let i = 0; i < plEls.length; i++) {
            planets.push({
                player: plEls[i].getAttribute('player'),
                name: plEls[i].getAttribute('name') || '',
                coords: plEls[i].getAttribute('coords') || ''
            });
        }

        const data = { ts: Date.now(), players, planets };
        apiCacheInMemory = data;
        try {
            sessionStorage.setItem(KEYS.API, JSON.stringify(data));
        } catch (e) {
            try { localStorage.setItem(KEYS.API, JSON.stringify(data)); } catch (e2) { /* storage full, in-memory cache active */ }
        }
        return data;
    }

    async function startFinder() {
        const query = document.getElementById('ls-find-q').value.trim().toLowerCase();
        const type = document.querySelector('input[name="ls-find-type"]:checked')?.value || 'player';
        const statusEl = document.getElementById('ls-find-status');
        const resultsEl = document.getElementById('ls-find-results');
        const btn = document.getElementById('ls-find-btn');

        if (query.length < 2) { statusEl.textContent = 'En az 2 karakter giriniz.'; return; }

        btn.disabled = true;
        statusEl.textContent = 'Aranıyor...';
        resultsEl.innerHTML = '';

        try {
            const data = await loadApiData();
            let html = '';
            let count = 0;

            if (type === 'player') {
                for (const pid in data.players) {
                    const p = data.players[pid];
                    if (p.name.toLowerCase().includes(query)) {
                        count++;
                        if (count > 50) break;
                        const pPlanets = data.planets.filter(pl => pl.player === pid);
                        const safePName = escapeHtml(p.name);
                        const sts = p.status ? ' <span style="color:#e74c3c">(' + escapeHtml(p.status) + ')</span>' : ' <span style="color:#2ecc71">(aktif)</span>';

                        html += '<div class="ls-finder-card">';
                        html += '<div style="font-weight:bold;color:#fff;margin-bottom:4px">' + safePName + sts + '</div>';
                        pPlanets.forEach(pl => {
                            const parts = (pl.coords || '1:1:1').split(':');
                            const safePlName = escapeHtml(pl.name);
                            const safeCoords = escapeHtml(pl.coords);
                            html += '<div class="ls-finder-planet">' +
                                '<span>' + safePlName + ' <span style="color:#888">[' + safeCoords + ']</span></span>' +
                                '<button class="ls-btn-sm ls-nav-btn" data-g="' + parseInt(parts[0], 10) + '" data-s="' + parseInt(parts[1], 10) + '" title="Galaksiye Git">🚀</button>' +
                            '</div>';
                        });
                        html += '</div>';
                    }
                }
            } else {
                for (const pl of data.planets) {
                    if (pl.name.toLowerCase().includes(query)) {
                        count++;
                        if (count > 50) break;
                        const owner = data.players[pl.player];
                        const ownerName = owner ? owner.name : '?';
                        const parts = (pl.coords || '1:1:1').split(':');
                        const safePlName = escapeHtml(pl.name);
                        const safeCoords = escapeHtml(pl.coords);
                        const safeOwner = escapeHtml(ownerName);
                        html += '<div class="ls-item" style="border-left:3px solid #2ecc71">' +
                            '<div style="flex:1">' +
                                '<strong style="color:#2ecc71">' + safePlName + '</strong> <span style="color:#888">[' + safeCoords + ']</span><br>' +
                                '<span style="font-size:10px;color:#aaa">Sahip: ' + safeOwner + '</span>' +
                            '</div>' +
                            '<button class="ls-btn-sm ls-nav-btn" data-g="' + parseInt(parts[0], 10) + '" data-s="' + parseInt(parts[1], 10) + '" title="Galaksiye Git">🚀</button>' +
                        '</div>';
                    }
                }
            }

            statusEl.textContent = count === 0 ? 'Sonuç bulunamadı.' : count + ' sonuç bulundu.';
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
            console.error(LS, e);
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
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function unlockAudio() {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });

    function playAttackAlertSound(soundType) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const volume = Math.max(0.01, Math.min(1.0, (alarmSettings.volume || 70) / 100));
            const now = ctx.currentTime;
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
                        gain.gain.linearRampToValueAtTime(volume * 0.85, p.t + 0.015);
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
            console.error(LS, 'Saldırı sesi çalınamadı:', e);
        }
    }

    function playEspionageAlertSound(soundType) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const volume = Math.max(0.01, Math.min(1.0, (alarmSettings.volume || 70) / 100));
            const now = ctx.currentTime;
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
                    gain1.gain.linearRampToValueAtTime(volume * 0.75, pingTime + 0.007);
                    gain1.gain.exponentialRampToValueAtTime(volume * 0.20, pingTime + 0.25);
                    gain1.gain.exponentialRampToValueAtTime(0.0001, pingTime + 1.05);

                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(3300, pingTime);
                    osc2.frequency.exponentialRampToValueAtTime(3100, pingTime + 0.06);

                    gain2.gain.setValueAtTime(0.0001, pingTime);
                    gain2.gain.linearRampToValueAtTime(volume * 0.30, pingTime + 0.004);
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
                    gain1.gain.linearRampToValueAtTime(volume * 0.75, cycleStart + 0.008);
                    gain1.gain.exponentialRampToValueAtTime(0.0001, cycleStart + 0.8);

                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(700, cycleStart + 0.32);
                    osc2.frequency.exponentialRampToValueAtTime(690, cycleStart + 1.05);

                    gain2.gain.setValueAtTime(0.0001, cycleStart + 0.32);
                    gain2.gain.linearRampToValueAtTime(volume * 0.40, cycleStart + 0.33);
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
                    gain1.gain.linearRampToValueAtTime(volume * 0.8, pingTime + 0.008);
                    gain1.gain.exponentialRampToValueAtTime(volume * 0.25, pingTime + 0.30);
                    gain1.gain.exponentialRampToValueAtTime(0.0001, pingTime + 1.2);

                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(2040, pingTime);
                    osc2.frequency.exponentialRampToValueAtTime(1950, pingTime + 0.08);

                    gain2.gain.setValueAtTime(0.0001, pingTime);
                    gain2.gain.linearRampToValueAtTime(volume * 0.35, pingTime + 0.005);
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
            console.error(LS, 'Sonar sesi çalınamadı:', e);
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

    function muteCurrentThreat() {
        const stored = getStoredThreatState();
        stored.muted = true;
        setStoredThreatState(stored);

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

    function triggerDesktopNotification(title, body) {
        if (!alarmSettings.desktopNotification) return;
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            try {
                new Notification(title, { body: body, icon: 'icons/icon48.png' });
            } catch (e) {}
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    try {
                        new Notification(title, { body: body, icon: 'icons/icon48.png' });
                    } catch (e) {}
                }
            });
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
            if (banner) { banner.style.background = '#121820'; banner.style.borderColor = '#233446'; }
            if (dot) { dot.style.background = '#7f8c8d'; dot.style.boxShadow = 'none'; }
            if (text) { text.style.color = '#7f8c8d'; text.textContent = 'Gözcü Pasif (Alarmlar Kapalı)'; }
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

        // Banner güncelle
        if (isAttackThreat) {
            if (banner) { banner.style.background = '#301416'; banner.style.borderColor = '#e74c3c'; }
            if (dot) { dot.style.background = '#e74c3c'; dot.style.boxShadow = '0 0 8px #e74c3c'; }
            if (text) {
                text.style.color = '#e74c3c';
                text.textContent = isMuted ? '🚨 Saldırı Var (Alarm Susturuldu)' : '🚨 DİKKAT: GELEN SALDIRI VAR!';
            }
        } else if (isEspionageThreat) {
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
                    playAttackAlertSound(alarmSettings.attackSound);
                    triggerDesktopNotification('🚨 OGame Saldırı Alarmı!', 'Gezegeninize düşman saldırı filosu yaklaşıyor!');
                } else if (isEspionageThreat) {
                    playEspionageAlertSound(alarmSettings.espionageSound);
                    triggerDesktopNotification('📡 OGame Casusluk Uyarısı', 'Gezegeninize casus sondası yaklaşıyor!');
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

        const fleets = doc.querySelectorAll('.eventFleet');
        fleets.forEach(fl => {
            // SADECE düşman filoları tehdittir! Oyuncunun kendi filoları 'friendly' class'ına sahiptir
            const isHostile = fl.classList.contains('hostile') && !fl.classList.contains('friendly');
            const isReturn = fl.getAttribute('data-return-flight') === 'true';

            if (isHostile && !isReturn) {
                const mission = fl.getAttribute('data-mission-type');
                const arrival = fl.getAttribute('data-arrival-time') || '';
                const id = fl.id || (mission + '_' + arrival);
                hostileIds.push(id);

                if (mission === '6' || fl.classList.contains('espionage')) {
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
            let hasAttack = parsed.hasAttack || isDOMAttackAlert();
            let hasEspionage = parsed.hasEspionage;
            let sig = '';
            if (hasAttack) sig = 'ATT:' + parsed.hostileIds.join(',');
            else if (hasEspionage) sig = 'ESP:' + parsed.hostileIds.join(',');

            lastKnownEspionage = hasEspionage;
            lastKnownEspionageSig = sig;
            if (hasEspionage) lastKnownEspionageTime = Date.now();

            handleThreatState(hasAttack, hasEspionage, sig);
        } catch (e) {}
    }

    // ============================================================
    // DEBRIS HUNTER (HARABE AVCISI)
    // ============================================================
    let debrisScanTimers = [];

    function clearDebrisScanTimers() {
        debrisScanTimers.forEach(t => clearTimeout(t));
        debrisScanTimers = [];
    }

    function triggerGalaxyScanSequence() {
        if (!debrisSettings.enabled) return;
        clearDebrisScanTimers();
        // Hızlı geçişlerde ve sayfa yüklenirken hiçbir anı kaçırmamak için kademeli çoklu tarama:
        const delays = [30, 100, 220, 400, 650, 1000];
        delays.forEach(d => {
            const timer = setTimeout(() => {
                scanCurrentGalaxyPageForDebris();
            }, d);
            debrisScanTimers.push(timer);
        });
    }

    function saveDebrisSettings() {
        localStorage.setItem(KEYS.DEBRIS_SETTINGS, JSON.stringify(debrisSettings));
    }

    function saveDebrisList() {
        localStorage.setItem(KEYS.DEBRIS_LIST, JSON.stringify(debrisList));
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
        let m = 0, c = 0, d = 0, rec = 0;

        // Metal (Standart: "Metal: 16.200" veya "Metal: 16,2K", alternatif: "16,2K Metal")
        let mMatch = text.match(/Metal\s*:\s*([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)/i);
        if (!mMatch) mMatch = text.match(/([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)\s*Metal/i);
        if (mMatch) m = parseOgNum(mMatch[1]);

        // Kristal (Standart: "Kristal: 21.600" veya "Crystal: 21,6K", alternatif: "21,6K Kristal")
        let cMatch = text.match(/(?:Kristal|Crystal)\s*:\s*([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)/i);
        if (!cMatch) cMatch = text.match(/([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)\s*(?:Kristal|Crystal)/i);
        if (cMatch) c = parseOgNum(cMatch[1]);

        // Deuterium
        let dMatch = text.match(/(?:Deuterium|Deut)\s*:\s*([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)/i);
        if (!dMatch) dMatch = text.match(/([0-9.,]+[ \t]*(?:mrd|mn|[kKmMbBrd])?)\s*(?:Deuterium|Deut)/i);
        if (dMatch) d = parseOgNum(dMatch[1]);

        // Geri Dönüşümcüler
        const rMatch = text.match(/(?:Gereken geri d[öo]n[üu][şs][üu]mc[üu]ler|Recyclers needed|Recycler[s]?|Gerekli [Rr]ehberler)\s*:\s*([0-9.,kKmMbBrd]+)/i);
        if (rMatch) rec = parseOgNum(rMatch[1]);

        const total = m + c + d;
        if (total <= 0) return null;
        if (rec <= 0) rec = Math.ceil(total / 20000);

        return { metal: m, crystal: c, deut: d, total: total, recyclers: rec };
    }

    function parseDebrisFromCell(cell) {
        if (!cell) return null;

        // 1. Tooltip içeriği kontrolü
        const tipEl = cell.querySelector('[data-tooltip-content], [title], [data-tooltip-title], .tooltip') || cell;
        const tipAttr = tipEl.getAttribute('data-tooltip-content') || tipEl.getAttribute('title') || tipEl.getAttribute('data-tooltip-title') || '';
        if (tipAttr.startsWith('#')) {
            const target = document.querySelector(tipAttr);
            if (target) {
                const parsed = parseDebrisText(target.textContent);
                if (parsed && parsed.total > 0) return parsed;
            }
        }
        if (tipAttr) {
            const parsedTip = parseDebrisText(tipAttr);
            if (parsedTip && parsedTip.total > 0) return parsedTip;
        }

        // 2. Hücre içi doğrudan metin kontrolü
        const parsedText = parseDebrisText(cell.textContent);
        if (parsedText && parsedText.total > 0) return parsedText;

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
            text.textContent = 'Harabe Avcısı Aktif · Galaksi İzleniyor';
        } else {
            banner.style.background = '#121820';
            banner.style.borderColor = '#233446';
            dot.style.background = '#7f8c8d';
            dot.style.boxShadow = 'none';
            text.style.color = '#7f8c8d';
            text.textContent = 'Harabe Avcısı Pasif (İzleme Kapalı)';
        }
    }

    function renderDebrisList() {
        const listEl = document.getElementById('ls-debris-list');
        const countTitle = document.getElementById('ls-debris-count-title');
        if (countTitle) countTitle.textContent = `🛰️ Bulunan Harabeler (${debrisList.length})`;
        if (!listEl) return;

        listEl.innerHTML = '';
        if (debrisList.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;color:#8899aa;font-size:11px;padding:16px 8px;background:rgba(255,255,255,0.02);border-radius:4px">' +
                '🪐 Henüz harabe tespit edilmedi.<br><span style="font-size:10px;color:#5c7080;margin-top:4px;display:inline-block">Galakside gezdikçe belirlediğiniz eşiğin üzerindeki harabeler otomatik listelenir.</span>' +
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
                            '🚀 Git' +
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

        // 1. AJAX yüklenme anında tam opaktaysa bekle (jQuery fadeOut sırasında yarı şeffafsa DOM hazırdır)
        const loader = document.getElementById('galaxyLoading') || content.querySelector('.galaxyLoading, .loading');
        if (loader) {
            const lStyle = window.getComputedStyle(loader);
            if (lStyle.display !== 'none' && lStyle.visibility !== 'hidden' && parseFloat(lStyle.opacity || '1') > 0.6) {
                return;
            }
        }

        const inputCoords = getCurrentGalaxyCoords();
        if (!inputCoords.g || !inputCoords.s) return;

        let actualG = inputCoords.g;
        let actualS = inputCoords.s;

        // 2. Tablodaki gerçek başlık koordinatlarını doğrula
        const coordHeadEl = content.querySelector('#galaxyhead, .galaxy_head, .cellCoordinate, .coordinate');
        let renderedG = null;
        let renderedS = null;
        if (coordHeadEl) {
            const m = coordHeadEl.textContent.match(/(\d+)\s*[:/]\s*(\d+)/);
            if (m) {
                renderedG = parseInt(m[1], 10);
                renderedS = parseInt(m[2], 10);
            }
        }
        // Eğer tablodaki koordinat başlığı henüz yeni input ile eşleşmiyorsa, eski sayfa kalıntısıdır; bu adımı atla
        if (renderedG && renderedS && (renderedG !== actualG || renderedS !== actualS)) {
            return;
        }

        let hasBrandNewDebris = false;
        let listChanged = false;
        const scannedPositions = new Map(); // pos (1..16) -> data

        // 3. DOM'daki #debris1 .. #debris16 ipucu elementlerini tara
        for (let pos = 1; pos <= 16; pos++) {
            const debEl = document.getElementById(`debris${pos}`) ||
                          document.getElementById(`debris_${pos}`) ||
                          content.querySelector(`#debris${pos}`) ||
                          document.querySelector(`[id="debris${pos}"]`);
            if (debEl) {
                let itemCoord = { g: actualG, s: actualS, p: pos };
                const tipCoord = debEl.textContent.match(/\[(\d+):(\d+):(\d+)\]/);
                if (tipCoord) {
                    itemCoord.g = parseInt(tipCoord[1], 10);
                    itemCoord.s = parseInt(tipCoord[2], 10);
                    itemCoord.p = parseInt(tipCoord[3], 10);
                    // Başka sistemin kalıntısıysa geç
                    if (itemCoord.g !== actualG || itemCoord.s !== actualS) continue;
                }

                const debText = debEl.textContent;
                const data = parseDebrisText(debText);
                if (data && data.total > 0) {
                    scannedPositions.set(itemCoord.p, data);
                }
            }
        }

        // 4. Galaksi tablosundaki normal hücreleri tara (SADECE 1..15, 16 ASLA SATIRDAN DÜZ METİN OLARAK OKUNMAZ)
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

            const debCell = row.querySelector('.cellDebris, .debris, .ha');
            if (debCell) {
                const data = parseDebrisFromCell(debCell);
                if (data && data.total > 0) {
                    scannedPositions.set(pos, data);
                }
            }
        });

        // 5. 16. Slot (Sonsuz Uzaklar / Expedition) için çok katmanlı yakalama
        if (!scannedPositions.has(16)) {
            const expRow = content.querySelector('tr[data-position="16"], #expedition, tr.expedition, .expedition');
            if (expRow) {
                // Katman 1: Satırdaki enkaz ikonunun tooltip özniteliğini kontrol et
                const debTarget = expRow.querySelector('[data-tooltip-content], [data-tooltip-title], [title], .debris, .ha, .icon_debris') || expRow;
                const tipAttr = debTarget.getAttribute('data-tooltip-content') ||
                                debTarget.getAttribute('data-tooltip-title') ||
                                debTarget.getAttribute('title') || '';

                if (tipAttr.startsWith('#')) {
                    const target = document.querySelector(tipAttr);
                    if (target) {
                        const data = parseDebrisText(target.textContent);
                        if (data && data.total > 0) scannedPositions.set(16, data);
                    }
                } else if (tipAttr) {
                    const data = parseDebrisText(tipAttr);
                    if (data && data.total > 0) scannedPositions.set(16, data);
                }

                // Katman 2: Eğer tooltip elementi henüz hazır değilse ama satırda enkaz ikonu varsa ve Infinity sayıları görünüyorsa
                if (!scannedPositions.has(16)) {
                    const hasDebrisIcon = expRow.querySelector('.debris, [class*="debris"], [data-tooltip-content*="debris"], img[src*="debris"], svg');
                    if (hasDebrisIcon) {
                        const numSpans = Array.from(expRow.querySelectorAll('span, div')).filter(el => {
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

        // 7. Güvenli Temizlik: SADECE tablo eksiksiz ve stabil şekilde oturmuşsa harabeleri sil
        // Hızlı geçiş anlarında yanlışlıkla silinmesini kesin olarak önler!
        const totalRenderedRows = content.querySelectorAll('#galaxytable tr, .ct_row, .galaxyRow').length;
        if (totalRenderedRows >= 10) {
            const currentSystemItems = debrisList.filter(item => item.g === actualG && item.s === actualS);
            currentSystemItems.forEach(item => {
                if (!scannedPositions.has(item.p)) {
                    // Pozisyon 16 için ek güvenlik: Enkaz ikonu varsa henüz tooltip bağlanmamış olabilir, silme!
                    if (item.p === 16) {
                        const expRow = content.querySelector('tr[data-position="16"], #expedition, tr.expedition, .expedition');
                        if (expRow && expRow.querySelector('.debris, [class*="debris"], [data-tooltip-content*="debris"]')) {
                            return;
                        }
                    }
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

        // 5. OGame jQuery AJAX tamamlanma olayını yakala
        try {
            if (window.$ && typeof window.$.fn === 'object') {
                window.$(document).ajaxComplete((event, xhr, settings) => {
                    if (settings && settings.url && (settings.url.includes('component=galaxy') || settings.url.includes('page=galaxy'))) {
                        triggerGalaxyScanSequence();
                    }
                });
            }
        } catch (e) {}

        // 6. Native XMLHttpRequest dinle (AJAX arka planda tamamlandığı milisaniyede yakalar)
        try {
            const origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url && typeof url === 'string' && (url.includes('component=galaxy') || url.includes('page=galaxy'))) {
                    this.addEventListener('load', () => {
                        triggerGalaxyScanSequence();
                    });
                }
                return origOpen.apply(this, arguments);
            };
        } catch (e) {}

        // 7. Sayfa ilk açılışında galaksi sayfasıysa hemen tara
        if (window.location.href.includes('component=galaxy') || document.getElementById('galaxyContent')) {
            triggerGalaxyScanSequence();
        }
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
            '#ls-panel{position:fixed;bottom:120px;right:15px;width:340px;min-width:280px;max-width:calc(100vw - 30px);',
            'min-height:260px;max-height:calc(100vh - 30px);background:rgba(11,16,26,0.97);',
            'border:1px solid #1a2c3f;border-radius:8px;color:#d1d8e0;font-family:sans-serif;font-size:12px;',
            'z-index:999998;box-shadow:0 10px 30px rgba(0,0,0,0.8);display:none;flex-direction:column}',

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
            '.ls-tab{flex:1;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:4px;',
            'text-align:center;padding:7px 3px;cursor:pointer;font-size:10px;',
            'background:rgba(26,44,63,0.4);transition:all .2s;color:#8899aa;user-select:none;white-space:nowrap}',
            '.ls-tab *{pointer-events:none}',
            '.ls-tab:hover{background:rgba(0,188,255,0.15);color:#fff}',
            '.ls-tab.active{background:rgba(0,188,255,0.25);color:#00bcff;font-weight:bold;',
            'border-bottom:2px solid #00bcff}',
            '.ls-tab-icon{font-size:12px;line-height:1;display:inline-flex;align-items:center;justify-content:center}',
            '.ls-tab-label{font-size:10px;line-height:1;white-space:nowrap}',
            '@container lstabs (max-width: 365px){',
            '  .ls-tab{flex-direction:column;gap:2px;padding:5px 2px}',
            '  .ls-tab-icon{font-size:13px}',
            '  .ls-tab-label{font-size:9.5px}',
            '}',
            '.ls-tabs-stacked .ls-tab{flex-direction:column;gap:2px;padding:5px 2px}',
            '.ls-tabs-stacked .ls-tab-icon{font-size:13px}',
            '.ls-tabs-stacked .ls-tab-label{font-size:9.5px}',

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

            '#ls-body::-webkit-scrollbar, #ls-cart-list::-webkit-scrollbar, #ls-debris-list::-webkit-scrollbar, #ls-scan-results::-webkit-scrollbar, #ls-find-results::-webkit-scrollbar{width:5px}',
            '#ls-body::-webkit-scrollbar-track, #ls-cart-list::-webkit-scrollbar-track, #ls-debris-list::-webkit-scrollbar-track, #ls-scan-results::-webkit-scrollbar-track, #ls-find-results::-webkit-scrollbar-track{background:#0a0e17}',
            '#ls-body::-webkit-scrollbar-thumb, #ls-cart-list::-webkit-scrollbar-thumb, #ls-debris-list::-webkit-scrollbar-thumb, #ls-scan-results::-webkit-scrollbar-thumb, #ls-find-results::-webkit-scrollbar-thumb{background:#00bcff;border-radius:3px}',
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
                '<span id="ls-header-title">' + boltSvg + ' LuckyStrike Helper</span>' +
                '<div style="display:flex;align-items:center;gap:6px">' +
                    '<button id="ls-header-stop-btn" class="ls-btn-d ls-btn-sm" style="display:none;padding:2px 7px;font-size:10px;align-items:center;gap:3px;cursor:pointer" title="Tekrarlayan bu alarmı sustur">⏹️ Sustur</button>' +
                    '<span id="ls-close">✖</span>' +
                '</div>' +
            '</div>' +
            '<div id="ls-tabs">' +
                '<div class="ls-tab" data-tab="cart"><span class="ls-tab-icon">🏗️</span><span class="ls-tab-label">Maliyet</span></div>' +
                '<div class="ls-tab" data-tab="scanner"><span class="ls-tab-icon">🌌</span><span class="ls-tab-label">Scanner</span></div>' +
                '<div class="ls-tab" data-tab="finder"><span class="ls-tab-icon">🔍</span><span class="ls-tab-label">Finder</span></div>' +
                '<div class="ls-tab" data-tab="alarm"><span class="ls-tab-icon">🚨</span><span class="ls-tab-label">Alarm</span></div>' +
                '<div class="ls-tab" data-tab="debris"><span class="ls-tab-icon">🛰️</span><span class="ls-tab-label">Harabe</span></div>' +
            '</div>' +
            '<div id="ls-body">' +

                // CART TAB
                '<div id="tc-cart" class="ls-tc">' +
                    '<div style="display:flex;gap:6px;margin-bottom:8px;flex-shrink:0">' +
                        '<button id="ls-cart-copy" class="ls-btn" style="flex:1">📋 Panoya Kopyala</button>' +
                        '<button id="ls-cart-clear" class="ls-btn ls-btn-d" style="flex:1">🗑️ Temizle</button>' +
                    '</div>' +
                    '<div id="ls-cart-list" style="flex:1;min-height:60px;overflow-y:auto;overflow-x:hidden;margin-bottom:8px"></div>' +
                    '<div id="ls-cart-totals" style="flex-shrink:0;margin-top:auto"></div>' +
                '</div>' +

                // SCANNER TAB
                '<div id="tc-scanner" class="ls-tc">' +
                    '<div class="ls-row">' +
                        '<div class="ls-col"><span class="ls-label">Galaksi Başlangıç</span><input type="number" id="ls-sg1" class="ls-inp" min="1" max="9" style="width:100%"></div>' +
                        '<div class="ls-col"><span class="ls-label">Galaksi Bitiş</span><input type="number" id="ls-sg2" class="ls-inp" min="1" max="9" style="width:100%"></div>' +
                    '</div>' +
                    '<div class="ls-row">' +
                        '<div class="ls-col"><span class="ls-label">Sistem Başlangıç</span><input type="number" id="ls-ss1" class="ls-inp" min="1" max="499" style="width:100%"></div>' +
                        '<div class="ls-col"><span class="ls-label">Sistem Bitiş</span><input type="number" id="ls-ss2" class="ls-inp" min="1" max="499" style="width:100%"></div>' +
                    '</div>' +
                    '<div style="margin-bottom:6px">' +
                        '<span class="ls-label">Hedef Slotlar (virgülle ayırın)</span>' +
                        '<input type="text" id="ls-slots" class="ls-inp" style="width:100%" placeholder="8 veya 7, 8, 9">' +
                    '</div>' +
                    '<div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:2px">' +
                        '<span class="ls-chip" data-slots="8" data-min="1">🎯 Sadece 8</span>' +
                        '<span class="ls-chip" data-slots="7, 8, 9" data-min="1">⭐ 7, 8, 9</span>' +
                        '<span class="ls-chip" data-slots="12, 13, 14, 15" data-min="1">❄️ 12-15 (Deut)</span>' +
                        '<span class="ls-chip" data-slots="1, 2, 3" data-min="1">☀️ 1-3 (Solar)</span>' +
                        '<span class="ls-chip" data-slots="1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15" data-min="15">🪐 Tamamen Boş (1-15)</span>' +
                    '</div>' +
                    '<div style="display:justify;justify-content:space-between;align-items:center;margin-bottom:8px;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:4px;border:1px solid #1a2c3f;display:flex">' +
                        '<span class="ls-label" style="font-size:11px;color:#d1d8e0">👥 Min. Eşzamanlı Boş Slot:</span>' +
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
                            '<option value="12">12 slot</option>' +
                            '<option value="15">15 slot</option>' +
                        '</select>' +
                    '</div>' +
                    '<button id="ls-scan-btn" class="ls-btn" style="width:100%;margin-top:4px">🔍 Taramayı Başlat</button>' +
                    '<div class="ls-prog" id="ls-scan-progress"><div class="ls-prog-bar" id="ls-scan-bar"></div></div>' +
                    '<div id="ls-scan-status" style="font-size:10px;text-align:center;color:#8899aa;margin-top:4px"></div>' +
                    '<div id="ls-scan-results-box" style="display:none;margin-top:8px;flex:1;min-height:60px;flex-direction:column;overflow:hidden">' +
                        '<button id="ls-scan-copy" class="ls-btn" style="width:100%;margin-bottom:6px;flex-shrink:0">📋 Koordinatları Kopyala</button>' +
                        '<div id="ls-scan-results" style="flex:1;min-height:60px;overflow-y:auto;overflow-x:hidden;width:100%;box-sizing:border-box"></div>' +
                    '</div>' +
                '</div>' +

                // FINDER TAB
                '<div id="tc-finder" class="ls-tc">' +
                    '<div style="max-width:270px;margin:0 auto;text-align:center">' +
                        '<div style="font-size:10px;color:#8899aa;margin-bottom:8px">Evrendeki tüm oyuncuları ve gezegenlerini bulun.</div>' +
                        '<input type="text" id="ls-find-q" class="ls-inp" style="width:100%;margin-bottom:8px;padding:6px 10px;font-size:11px;text-align:center;border-radius:4px" placeholder="Oyuncu veya gezegen adı...">' +
                        '<div style="display:flex;justify-content:center;gap:14px;margin-bottom:8px;font-size:11px">' +
                            '<label style="cursor:pointer;display:inline-flex;align-items:center;gap:4px"><input type="radio" name="ls-find-type" value="player" checked> Oyuncu Adı</label>' +
                            '<label style="cursor:pointer;display:inline-flex;align-items:center;gap:4px"><input type="radio" name="ls-find-type" value="planet"> Gezegen Adı</label>' +
                        '</div>' +
                        '<button id="ls-find-btn" class="ls-btn" style="width:100%;padding:6px 12px;font-size:11px">🔍 Ara</button>' +
                        '<div id="ls-find-status" style="font-size:10px;text-align:center;color:#8899aa;margin-top:6px"></div>' +
                    '</div>' +
                    '<div id="ls-find-results" style="flex:1;min-height:60px;overflow-y:auto;overflow-x:hidden;margin-top:8px"></div>' +
                '</div>' +

                // ALARM TAB
                '<div id="tc-alarm" class="ls-tc">' +
                    '<div id="ls-alarm-status-banner" style="background:#162436;border:1px solid #1a3a5c;border-radius:6px;padding:8px 10px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">' +
                        '<div style="display:flex;align-items:center;gap:8px">' +
                            '<span id="ls-alarm-dot" style="width:10px;height:10px;border-radius:50%;background:#2ecc71;display:inline-block;box-shadow:0 0 6px #2ecc71"></span>' +
                            '<span id="ls-alarm-status-text" style="font-size:11px;font-weight:bold;color:#2ecc71">Gözcü Aktif · Tehdit Yok</span>' +
                        '</div>' +
                        '<button id="ls-alarm-stop-btn" class="ls-btn-d ls-btn-sm" style="display:none;padding:3px 8px;font-size:10px;align-items:center;gap:3px;cursor:pointer" title="Tekrarlayan bu alarmı sustur">⏹️ Sustur</button>' +
                    '</div>' +

                    // Attack alert card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<span style="font-weight:bold;color:#e74c3c;font-size:12px">🚨 Saldırı Alarmı</span>' +
                            '<label class="ls-toggle-switch">' +
                                '<input type="checkbox" id="ls-alarm-att-toggle">' +
                                '<span class="ls-toggle-slider"></span>' +
                            '</label>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                            '<span style="font-size:11px;color:#d1d8e0">🎵 Ses Tipi:</span>' +
                            '<select id="ls-alarm-att-sound" class="ls-inp" style="width:180px;padding:2px 4px;font-size:10px">' +
                                '<option value="klaxon">Taktiksel Klakson (Varsayılan)</option>' +
                                '<option value="siren">Kırmızı Alarm Sireni</option>' +
                                '<option value="pulse">Acil Durum Nabzı</option>' +
                            '</select>' +
                        '</div>' +
                        '<button id="ls-alarm-att-test" class="ls-btn-sm" style="background:#c0392b;color:#fff;border:none;padding:5px 10px;width:100%">🔊 Saldırı Sesini Test Et</button>' +
                    '</div>' +

                    // Espionage alert card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<span style="font-weight:bold;color:#3498db;font-size:12px">📡 Sonda / Casusluk Uyarısı</span>' +
                            '<label class="ls-toggle-switch">' +
                                '<input type="checkbox" id="ls-alarm-esp-toggle">' +
                                '<span class="ls-toggle-slider"></span>' +
                            '</label>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                            '<span style="font-size:11px;color:#d1d8e0">🎵 Ses Tipi:</span>' +
                            '<select id="ls-alarm-esp-sound" class="ls-inp" style="width:180px;padding:2px 4px;font-size:10px">' +
                                '<option value="sonar_deep">Derin Deniz Sonarı (Klasik Ping)</option>' +
                                '<option value="sonar_hunter">Aktif Avcı Sonarı (Yüksek Ping)</option>' +
                                '<option value="sonar_echo">Taktik Yankı Sonarı (Çift Eko)</option>' +
                            '</select>' +
                        '</div>' +
                        '<button id="ls-alarm-esp-test" class="ls-btn-sm" style="background:#2980b9;color:#fff;border:none;padding:5px 10px;width:100%">🔊 Sonda Sesini Test Et</button>' +
                    '</div>' +

                    // Desktop notification card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<div>' +
                                '<div style="font-weight:bold;color:#f39c12;font-size:12px">🖥️ Masaüstü Bildirimi</div>' +
                                '<div style="font-size:10px;color:#8899aa;margin-top:2px">Sekme arka plandayken bildirim gönder</div>' +
                            '</div>' +
                            '<label class="ls-toggle-switch">' +
                                '<input type="checkbox" id="ls-alarm-desktop-toggle">' +
                                '<span class="ls-toggle-slider"></span>' +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                    // Volume slider card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<span style="color:#d1d8e0;font-size:11px">🔊 Ses Seviyesi:</span>' +
                            '<span id="ls-volume-val" style="font-weight:bold;color:#00bcff;font-size:11px">70%</span>' +
                        '</div>' +
                        '<input type="range" id="ls-volume-slider" min="0" max="100" value="70" style="width:100%;accent-color:#00bcff;cursor:pointer">' +
                    '</div>' +

                    // Repeat interval card
                    '<div style="background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<span style="color:#d1d8e0;font-size:11px">⏱️ Tekrar Sıklığı:</span>' +
                            '<select id="ls-alarm-repeat" class="ls-select" style="width:145px;font-size:11px;padding:3px;background:#0a0e17;color:#fff;border:1px solid #2c3e50;border-radius:3px">' +
                                '<option value="0">Sadece 1 kez çal</option>' +
                                '<option value="5">Her 5 saniyede bir</option>' +
                                '<option value="10">Her 10 saniyede bir</option>' +
                                '<option value="15">Her 15 saniyede bir</option>' +
                                '<option value="30">Her 30 saniyede bir</option>' +
                                '<option value="60">Her 60 saniyede bir</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                // DEBRIS TAB (HARABE AVCISI)
                '<div id="tc-debris" class="ls-tc">' +
                    '<div id="ls-debris-status-banner" style="flex-shrink:0;background:#162436;border:1px solid #1a3a5c;border-radius:6px;padding:8px 10px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">' +
                        '<div style="display:flex;align-items:center;gap:8px">' +
                            '<span id="ls-debris-dot" style="width:10px;height:10px;border-radius:50%;background:#2ecc71;display:inline-block;box-shadow:0 0 6px #2ecc71"></span>' +
                            '<span id="ls-debris-status-text" style="font-size:11px;font-weight:bold;color:#2ecc71">Harabe Avcısı Aktif · Galaksi İzleniyor</span>' +
                        '</div>' +
                        '<label class="ls-toggle-switch" title="Harabe izlemeyi aç/kapat">' +
                            '<input type="checkbox" id="ls-debris-toggle">' +
                            '<span class="ls-toggle-slider"></span>' +
                        '</label>' +
                    '</div>' +

                    // Debris settings card
                    '<div style="flex-shrink:0;background:#131d2a;border:1px solid #233446;border-radius:6px;padding:10px;margin-bottom:8px">' +
                        '<div style="margin-bottom:6px">' +
                            '<span class="ls-label" style="color:#d1d8e0">⚡ Min. Harabe Eşiği (Toplam Kaynak):</span>' +
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
                            '<span style="font-size:11px;color:#d1d8e0">🎵 Uyarı Sesi:</span>' +
                            '<select id="ls-debris-sound" class="ls-inp" style="width:180px;padding:2px 4px;font-size:10px">' +
                                '<option value="sonar_deep">Derin Deniz Sonarı (Klasik Ping)</option>' +
                                '<option value="sonar_hunter">Aktif Avcı Sonarı (Yüksek Ping)</option>' +
                                '<option value="sonar_echo">Taktik Yankı Sonarı (Çift Eko)</option>' +
                            '</select>' +
                        '</div>' +
                        '<button id="ls-debris-test-sound" class="ls-btn-sm" style="background:#2980b9;color:#fff;border:none;padding:5px 10px;width:100%">🔊 Harabe Sesini Test Et</button>' +
                    '</div>' +

                    // Debris list header with clear button
                    '<div style="flex-shrink:0;display:flex;justify-content:space-between;align-items:center;margin:10px 0 6px 0;padding-bottom:4px;border-bottom:1px solid #1a2c3f">' +
                        '<span style="font-size:11px;font-weight:bold;color:#00bcff" id="ls-debris-count-title">🛰️ Bulunan Harabeler (0)</span>' +
                        '<button id="ls-debris-clear-all" class="ls-btn ls-btn-d ls-btn-sm" style="padding:2px 7px;font-size:10px" title="Tüm harabeleri listeden temizle">🗑️ Listeyi Temizle</button>' +
                    '</div>' +

                    // Debris items list
                    '<div id="ls-debris-list" style="flex:1;min-height:60px;overflow-y:auto;overflow-x:hidden;width:100%;box-sizing:border-box"></div>' +
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
                if (s.w) panel.style.width = Math.max(280, Math.min(window.innerWidth - 30, s.w)) + 'px';
                if (s.h) panel.style.height = Math.max(260, Math.min(window.innerHeight - 30, s.h)) + 'px';
            } catch (e) {}
        }

        if (isPanelOpen) {
            panel.style.display = 'flex';
        }

        fab.addEventListener('click', () => {
            const willOpen = panel.style.display !== 'flex';
            panel.style.display = willOpen ? 'flex' : 'none';
            isPanelOpen = willOpen;
            localStorage.setItem(KEYS.OPEN, willOpen ? 'true' : 'false');
            if (willOpen) setTimeout(ensurePanelInView, 20);
        });

        document.getElementById('ls-close').addEventListener('click', () => {
            panel.style.display = 'none';
            isPanelOpen = false;
            localStorage.setItem(KEYS.OPEN, 'false');
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

                const minW = 280, maxW = Math.max(minW, window.innerWidth - 30);
                const minH = 260, maxH = Math.max(minH, window.innerHeight - 30);

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
                localStorage.setItem(KEYS.POS, JSON.stringify({ x: dx, y: dy }));
                localStorage.setItem(KEYS.SIZE, JSON.stringify({ w: panel.offsetWidth, h: panel.offsetHeight }));
            }
            if (dragging) {
                dragging = false;
                ensurePanelInView();
                localStorage.setItem(KEYS.POS, JSON.stringify({ x: dx, y: dy }));
            }
        });

        document.querySelectorAll('.ls-tab').forEach(tab => {
            tab.addEventListener('click', () => {
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
                setTimeout(ensurePanelInView, 20);
            });
        });

        const savedTabEl = document.querySelector('.ls-tab[data-tab="' + activeTab + '"]');
        const savedContentEl = document.getElementById('tc-' + activeTab);
        if (savedTabEl) savedTabEl.classList.add('active');
        if (savedContentEl) savedContentEl.classList.add('active');
        if (!savedTabEl) {
            const first = document.querySelector('.ls-tab');
            if (first) { first.classList.add('active'); document.getElementById('tc-cart').classList.add('active'); }
        }

        const tabsEl = document.getElementById('ls-tabs');
        if (tabsEl) {
            const updateTabsLayout = () => {
                const w = tabsEl.offsetWidth;
                if (w > 0 && w < 365) {
                    tabsEl.classList.add('ls-tabs-stacked');
                } else if (w >= 365) {
                    tabsEl.classList.remove('ls-tabs-stacked');
                }
            };
            if (typeof ResizeObserver !== 'undefined') {
                new ResizeObserver(updateTabsLayout).observe(tabsEl);
            }
            updateTabsLayout();
        }

        document.getElementById('ls-cart-clear').addEventListener('click', () => { cart = []; saveCart(); renderCart(); });
        document.getElementById('ls-cart-copy').addEventListener('click', copyCart);
        renderCart();

        document.getElementById('ls-sg1').value = scanSettings.gStart;
        document.getElementById('ls-sg2').value = scanSettings.gEnd;
        document.getElementById('ls-ss1').value = scanSettings.sStart;
        document.getElementById('ls-ss2').value = scanSettings.sEnd;
        document.getElementById('ls-slots').value = scanSettings.slots;
        document.getElementById('ls-min').value = scanSettings.minEmpty;

        document.getElementById('ls-scan-btn').addEventListener('click', startScan);
        document.getElementById('ls-scan-copy').addEventListener('click', copyScanResults);

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

        const desktopToggle = document.getElementById('ls-alarm-desktop-toggle');
        if (desktopToggle) {
            desktopToggle.checked = !!alarmSettings.desktopNotification;
            desktopToggle.addEventListener('change', async () => {
                if (desktopToggle.checked) {
                    if ('Notification' in window) {
                        try {
                            const perm = await Notification.requestPermission();
                            if (perm === 'granted') {
                                alarmSettings.desktopNotification = true;
                            } else {
                                alarmSettings.desktopNotification = false;
                                desktopToggle.checked = false;
                                alert('Masaüstü bildirimlerine tarayıcınızda izin verilmedi.');
                            }
                        } catch (err) {
                            alarmSettings.desktopNotification = false;
                            desktopToggle.checked = false;
                        }
                    } else {
                        alarmSettings.desktopNotification = false;
                        desktopToggle.checked = false;
                        alert('Tarayıcınız Web Bildirimlerini desteklemiyor.');
                    }
                } else {
                    alarmSettings.desktopNotification = false;
                }
                saveAlarmSettings();
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
            unlockAudio();
            playAttackAlertSound(attSoundSelect?.value);
        });

        document.getElementById('ls-alarm-esp-test')?.addEventListener('click', (e) => {
            e.preventDefault();
            unlockAudio();
            playEspionageAlertSound(espSoundSelect?.value);
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

        document.getElementById('ls-debris-test-sound')?.addEventListener('click', (e) => {
            e.preventDefault();
            unlockAudio();
            playEspionageAlertSound(debSoundSelect?.value);
        });

        document.getElementById('ls-debris-clear-all')?.addEventListener('click', () => {
            debrisList = [];
            saveDebrisList();
            renderDebrisList();
        });

        updateDebrisStatusBanner();
        renderDebrisList();

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

        // OGame'in kendi yaptığı AJAX çağrılarından eventList içeriğini pasif olarak yakala
        try {
            if (window.$ && typeof window.$.fn === 'object') {
                window.$(document).ajaxComplete((event, xhr, settings) => {
                    if (settings && settings.url && (settings.url.includes('eventList') || settings.url.includes('component=eventList'))) {
                        if (xhr && xhr.responseText) parseThreatsFromHTML(xhr.responseText);
                    }
                });
            }
        } catch (e) {}

        try {
            const origXhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url && typeof url === 'string' && (url.includes('eventList') || url.includes('component=eventList'))) {
                    this.addEventListener('load', () => {
                        if (this.responseText) parseThreatsFromHTML(this.responseText);
                    });
                }
                return origXhrOpen.apply(this, arguments);
            };
        } catch (e) {}

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

        let newText = '📥 Sepete Ekle';
        if (data && data.level) {
            newText = `📥 Sepete Ekle (${data.level})`;
        } else if (data && data.count > 1) {
            newText = `📥 Sepete Ekle (x${data.count})`;
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
            downBtn.title = 'Kademe azalt';
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
            upBtn.title = 'Kademe artır';
            upBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                selectedLevelsToAdd++;
                updateButtonLabel();
            });

            stepperBox.appendChild(downBtn);
            stepperBox.appendChild(display);
            stepperBox.appendChild(upBtn);
            group.appendChild(stepperBox);
        }

        const newBtn = document.createElement('button');
        newBtn.id = 'ls-add-cart-btn';
        newBtn.textContent = '📥 Sepete Ekle';
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
    checkAndApplyFleetAutoLoad();
    console.log(LS, 'LuckyStrike OGame Helper v7.1 hazır!');

})();
