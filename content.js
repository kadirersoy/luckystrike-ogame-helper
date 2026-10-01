(function() {
    'use strict';

    const LS = '[LS]';
    console.log(LS, 'LuckyStrike OGame Helper v4.1 yükleniyor...');

    // ============================================================
    // STORAGE KEYS & STATE
    // ============================================================
    const KEYS = {
        TAB: 'LS_ACTIVE_TAB',
        CART: 'LS_COST_CART',
        SCAN: 'LS_SCANNER_SETTINGS',
        POS: 'LS_PANEL_POS',
        OPEN: 'LS_PANEL_OPEN',
        API: 'LS_API_CACHE'
    };

    let cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    let activeTab = localStorage.getItem(KEYS.TAB) || 'cart';
    let isPanelOpen = localStorage.getItem(KEYS.OPEN) === 'true';
    let scanSettings = JSON.parse(localStorage.getItem(KEYS.SCAN) || '{}');
    scanSettings = Object.assign({ gStart: 1, gEnd: 9, sStart: 1, sEnd: 499, slots: '8', minEmpty: 1 }, scanSettings);

    // Kaç kademe ekleneceği (+1, +2, +3...)
    let selectedLevelsToAdd = 1;

    // ============================================================
    // HELPERS
    // ============================================================
    function fmt(n) {
        if (n < 0) return '-' + Math.abs(Number(n)).toLocaleString('tr-TR');
        return Number(n).toLocaleString('tr-TR');
    }

    function parseOgNum(str) {
        if (!str) return 0;
        str = String(str).trim();
        if (str === '0' || str === '-') return 0;

        let neg = str.startsWith('-') ? -1 : 1;
        str = str.replace(/^-/, '');

        let mult = 1;
        if (/mrd$/i.test(str)) mult = 1e9;
        else if (/mn$/i.test(str)) mult = 1e6;
        else if (/m$/i.test(str)) mult = 1e6;
        else if (/k$/i.test(str)) mult = 1e3;

        let numStr = str.replace(/[^0-9.,]/g, '');
        if (numStr.includes('.') && numStr.includes(',')) {
            numStr = numStr.replace(/\./g, '').replace(',', '.');
        } else if (numStr.includes(',')) {
            numStr = numStr.replace(',', '.');
        }

        const val = parseFloat(numStr) || 0;
        return Math.round(neg * val * mult);
    }

    function getLiveResources() {
        const m = parseInt(document.getElementById('resources_metal')?.getAttribute('data-raw') || '0', 10);
        const c = parseInt(document.getElementById('resources_crystal')?.getAttribute('data-raw') || '0', 10);
        const d = parseInt(document.getElementById('resources_deuterium')?.getAttribute('data-raw') || '0', 10);
        return { metal: m, crystal: c, deuterium: d };
    }

    function getCurrentPlanetName() {
        const el = document.querySelector('.planet-name') ||
                   document.querySelector('#planetNameHeader') ||
                   document.querySelector('#selectedPlanetName') ||
                   document.querySelector('.planet-header .planet-name') ||
                   document.querySelector('#planetList .smallplanet.selected .planet-name');
        return el ? el.textContent.trim() : 'Gezegen';
    }

    // ============================================================
    // OGAME RESMİ ARTIŞ FAKTÖRLERİ (Resmi Gameforge LFMaster Tablosu)
    // ============================================================
    function getGrowthFactor(name) {
        const n = (name || '').toLowerCase().trim();

        // --- ROCK'TAL BİNALARI ---
        if (n.includes('rün teknoloji')) return 1.30;       // Rün Teknoloji Kurumu
        if (n.includes('rün demirci')) return 1.70;         // Rün Demircisi
        if (n.includes('oriktor')) return 1.65;             // Oriktoryum
        if (n.includes('magma demirci')) return 1.40;       // Magma Demircisi
        if (n.includes('ayrışma odası')) return 1.20;       // Ayrışma Odası
        if (n.includes('megalit')) return 1.50;             // Megalit
        if (n.includes('kristal rafinerisi')) return 1.40;  // Kristal Rafinerisi
        if (n.includes('mineral araştırma')) return 1.80;   // Maden Araştırma Merkezi
        if (n.includes('geri dönüşüm tesisi')) return 1.50; // Gelişmiş Geri Dönüşüm Tesisi

        // --- İNSAN (HUMAN) BİNALARI ---
        if (n.includes('biyosfer')) return 1.23;            // Biyosfer Çiftliği
        if (n.includes('bilim akademisi')) return 1.70;     // Bilim Akademisi
        if (n.includes('nöro-kalibrasyon') || n.includes('noro')) return 1.70; // Nöro-Kalibrasyon Merkezi
        if (n.includes('ergitme')) return 1.50;             // Yüksek Enerjili Ergitme
        if (n.includes('gıda silosu')) return 1.09;         // Gıda Silosu
        if (n.includes('gökdelen')) return 1.09;            // Gökdelen
        if (n.includes('biyoteknoloji')) return 1.12;       // Biyoteknoloji Laboratuvarı
        if (n.includes('metropol')) return 1.50;            // Metropol
        if (n.includes('kalkan') && n.includes('gezegensel')) return 1.15; // Gezegensel Kalkan

        // --- MECHA BİNALARI ---
        if (n.includes('montaj hattı')) return 1.21;
        if (n.includes('füzyon hücresi')) return 1.18;
        if (n.includes('güncelleme ağı')) return 1.80;
        if (n.includes('kuantum bilgisayar')) return 1.80;
        if (n.includes('otomatik montaj')) return 1.30;
        if (n.includes('transformatör')) return 1.50;
        if (n.includes('mikroçip')) return 1.07;
        if (n.includes('montaj holü')) return 1.14;
        if (n.includes('nano onarım')) return 1.40;

        // --- KAELESH BİNALARI ---
        if (n.includes('barınak')) return 1.21;
        if (n.includes('antimadde yoğunlaştırıcı')) return 1.20;
        if (n.includes('vorteks')) return 1.30;
        if (n.includes('farkındalık salonu')) return 1.80;
        if (n.includes('aşkınlık forumu')) return 1.80;
        if (n.includes('antimadde konvektörü')) return 1.25;
        if (n.includes('klonlama')) return 1.20;
        if (n.includes('krizalit')) return 1.05;
        if (n.includes('biyo değiştirici')) return 1.20;
        if (n.includes('psişik modülatör')) return 1.40;
        if (n.includes('yerçekimi odası')) return 1.20;
        if (n.includes('dönüşüm alanı')) return 1.40;

        // --- CANLI TÜRÜ GENEL NÜFUS / ÇİFTLİK / ARAŞTIRMA MERKEZİ ---
        if (n.includes('sığınak') || n.includes('meditasyon') || n.includes('konut') || n.includes('habitat') || n.includes('çiftlik') || n.includes('sektör')) {
            return 1.20;
        }
        if (n.includes('araştırma merkezi') || n.includes('robotik araştırma')) {
            return 1.30;
        }

        // --- CANLI TÜRÜ ARAŞTIRMALARI (LF Technologies) ---
        if (n.includes('süper bilgisayar') || n.includes('sapan otopilot') || n.includes('iyon kristali modülleri')) {
            return 1.20;
        }
        if (n.includes('elçi') || n.includes('yörünge') || n.includes('gizlilik') || n.includes('itici') || n.includes('terraformer') || n.includes('yapay zeka') || n.includes('süperiletken')) {
            return 1.30;
        }
        if (n.includes('obsidyen')) {
            return 1.40;
        }
        if (n.includes('güçlendirmesi') && (n.includes('toplayıcı') || n.includes('general') || n.includes('kaşif'))) {
            return 1.70;
        }

        // --- KLASİK OGAME (Madenler & Standart Yapılar) ---
        if (n.includes('kristal madeni')) return 1.60;
        if (n.includes('metal madeni') || n.includes('deuterium sentezleyicisi') || n.includes('döteryum sentezleyicisi') || n.includes('güneş enerji')) return 1.50;
        if (n.includes('füzyon')) return 1.80;
        if (n.includes('astrofizik')) return 1.75;

        // Canlı türü araştırmaları genel varsayılanı
        if (window.location.href.includes('lfresearch')) {
            return 1.50;
        }

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
            const val = dv ? parseInt(dv, 10) : parseOgNum(li.textContent);
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
    // ÇOKLU KADEME HESAPLAYICI (Formül Tabanlı)
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

        const baseCost = parseNextLevelBaseCost(popup);
        const nLow = result.name.toLowerCase();
        const isLifeform = window.location.href.includes('lfbuildings') || 
                           window.location.href.includes('lfresearch') ||
                           nLow.includes('meditasyon') || nLow.includes('sığınak') ||
                           nLow.includes('rün') || nLow.includes('konut') ||
                           nLow.includes('çiftlik') || nLow.includes('oriktor') ||
                           nLow.includes('magma') || nLow.includes('megalit') ||
                           nLow.includes('rafineri');

        const factor = getGrowthFactor(result.name);

        let totM = 0, totC = 0, totD = 0;
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
                    // Resmi Gameforge formülü: Cost(L) = Cost(L-1) * Factor * (L / (L-1))
                    curM = Math.round(curM * factor * (thisLvl / prevLvl));
                    curC = Math.round(curC * factor * (thisLvl / prevLvl));
                    curD = Math.round(curD * factor * (thisLvl / prevLvl));
                } else {
                    // Klasik OGame formülü: Cost(L) = Cost(L-1) * Factor
                    curM = Math.round(curM * factor);
                    curC = Math.round(curC * factor);
                    curD = Math.round(curD * factor);
                }

                totM += curM;
                totC += curC;
                totD += curD;
            }
        }

        result.metal = totM;
        result.crystal = totC;
        result.deuterium = totD;

        console.log(LS, result.name, result.level, `(IsLF: ${isLifeform}, Faktör: ${factor}) ->`, result);
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
    window.lsCopyNumber = copyNumber;

    function renderCart() {
        const listEl = document.getElementById('ls-cart-list');
        const totalsEl = document.getElementById('ls-cart-totals');
        if (!listEl || !totalsEl) return;

        listEl.innerHTML = '';
        let tM = 0, tC = 0, tD = 0;

        if (cart.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;color:#666;padding:15px;">Sepet boş</div>';
        } else {
            cart.forEach((item, i) => {
                tM += item.metal; tC += item.crystal; tD += item.deuterium;
                const d = document.createElement('div');
                d.className = 'ls-item';
                if (item.isDeduction) d.style.borderLeft = '3px solid #e67e22';

                let label = item.name;
                if (item.level) label += ' Kd ' + item.level;
                if (item.count > 1) label += ' x' + item.count;

                const sign = (n) => n < 0 ? fmt(n) : '+' + fmt(n);
                const color = (n) => n < 0 ? '#e67e22' : '#aaa';

                d.innerHTML =
                    '<div style="flex:1">' +
                        '<div style="color:' + (item.isDeduction ? '#e67e22' : '#00bcff') + ';font-weight:bold;font-size:11px">' +
                            (item.isDeduction ? '📉 ' : '') + label +
                        '</div>' +
                        '<div style="font-size:9px;color:#666">' + (item.planet || '') + '</div>' +
                        '<div style="font-size:10px;margin-top:2px">' +
                            '<span style="color:' + color(item.metal) + '">' + sign(item.metal) + '</span> · ' +
                            '<span style="color:' + (item.crystal < 0 ? '#e67e22' : '#5dade2') + '">' + sign(item.crystal) + '</span> · ' +
                            '<span style="color:' + (item.deuterium < 0 ? '#e67e22' : '#2ecc71') + '">' + sign(item.deuterium) + '</span>' +
                        '</div>' +
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
                d.appendChild(xBtn);

                listEl.appendChild(d);
            });
        }

        const netTotal = tM + tC + tD;

        totalsEl.innerHTML =
            '<div style="margin-bottom:8px">' +
                '<button id="ls-deduct-btn" class="ls-btn-sm" style="width:100%;background:#d35400;color:#fff;padding:5px;">' +
                    '📉 Mevcut Gezegen Kaynağını Sepetten Düş' +
                '</button>' +
            '</div>' +
            '<div class="ls-total-row">' +
                '<span>🟡 Kalan Metal:</span>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#aaa">' + fmt(tM) + '</b>' +
                    '<button id="ls-cp-m" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>' +
            '<div class="ls-total-row">' +
                '<span>🔵 Kalan Kristal:</span>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#5dade2">' + fmt(tC) + '</b>' +
                    '<button id="ls-cp-c" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>' +
            '<div class="ls-total-row">' +
                '<span>🟢 Kalan Deuterium:</span>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#2ecc71">' + fmt(tD) + '</b>' +
                    '<button id="ls-cp-d" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>' +
            '<div class="ls-total-row" style="border-top:1px solid #333;padding-top:4px;margin-top:4px">' +
                '<span>🔴 Net Kalan İhtiyaç:</span>' +
                '<span style="display:flex;align-items:center;gap:4px;">' +
                    '<b style="color:#fff">' + fmt(netTotal) + '</b>' +
                    '<button id="ls-cp-net" class="ls-cp-btn" title="Sayısını kopyala">📋</button>' +
                '</span>' +
            '</div>';

        document.getElementById('ls-deduct-btn')?.addEventListener('click', deductPlanetResources);
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
            if (item.level) label += ' Kd ' + item.level;
            if (item.count > 1) label += ' x' + item.count;
            lines.push('• ' + label + ' [' + item.planet + ']');
            lines.push('  M: ' + fmt(item.metal) + ' | K: ' + fmt(item.crystal) + ' | D: ' + fmt(item.deuterium));
            tM += item.metal; tC += item.crystal; tD += item.deuterium;
        });
        lines.push('');
        lines.push('NET KALAN: M: ' + fmt(tM) + ' | K: ' + fmt(tC) + ' | D: ' + fmt(tD));
        lines.push('Genel Net: ' + fmt(tM + tC + tD));
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
                resBox.style.display = 'block';
                window._lsScanResults = results;

                results.forEach(r => {
                    const div = document.createElement('div');
                    div.className = 'ls-item';
                    const badges = r.slots.map(s => '<span class="ls-badge">' + s + '</span>').join(' ');
                    div.innerHTML =
                        '<div style="flex:1">' +
                            '<strong style="color:#00bcff">[' + r.g + ':' + r.s + ']</strong> ' + badges +
                        '</div>';
                    const navBtn = document.createElement('button');
                    navBtn.className = 'ls-btn-sm';
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

    function copyScanResults() {
        if (!window._lsScanResults) return;
        const lines = ['═══ Galaxy Scanner Sonuçları ═══', ''];
        window._lsScanResults.forEach(r => {
            lines.push('[' + r.g + ':' + r.s + '] → Boş: ' + r.slots.join(', '));
        });
        lines.push('');
        lines.push('Toplam: ' + window._lsScanResults.length + ' sistem');
        navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const btn = document.getElementById('ls-scan-copy');
            if (btn) { btn.textContent = '✓ Kopyalandı!'; setTimeout(() => { btn.textContent = '📋 Panoya Kopyala'; }, 2000); }
        });
    }

    // ============================================================
    // PLAYER FINDER
    // ============================================================
    async function loadApiData() {
        const raw = localStorage.getItem(KEYS.API);
        if (raw) {
            try {
                const cache = JSON.parse(raw);
                if (cache.ts && (Date.now() - cache.ts < 24 * 3600 * 1000) && cache.players && cache.planets) {
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
        try { localStorage.setItem(KEYS.API, JSON.stringify(data)); } catch (e) { /* storage full */ }
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
                        const sts = p.status ? ' <span style="color:#e74c3c">(' + p.status + ')</span>' : ' <span style="color:#2ecc71">(aktif)</span>';

                        html += '<div class="ls-finder-card">';
                        html += '<div style="font-weight:bold;color:#fff;margin-bottom:4px">' + p.name + sts + '</div>';
                        pPlanets.forEach(pl => {
                            const parts = pl.coords.split(':');
                            html += '<div class="ls-finder-planet">' +
                                '<span>' + pl.name + ' <span style="color:#888">[' + pl.coords + ']</span></span>' +
                                '<button class="ls-btn-sm ls-nav-btn" data-g="' + parts[0] + '" data-s="' + parts[1] + '" title="Galaksiye Git">🚀</button>' +
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
                        const parts = pl.coords.split(':');
                        html += '<div class="ls-item" style="border-left:3px solid #2ecc71">' +
                            '<div style="flex:1">' +
                                '<strong style="color:#2ecc71">' + pl.name + '</strong> <span style="color:#888">[' + pl.coords + ']</span><br>' +
                                '<span style="font-size:10px;color:#aaa">Sahip: ' + ownerName + '</span>' +
                            '</div>' +
                            '<button class="ls-btn-sm ls-nav-btn" data-g="' + parts[0] + '" data-s="' + parts[1] + '" title="Galaksiye Git">🚀</button>' +
                        '</div>';
                    }
                }
            }

            statusEl.textContent = count === 0 ? 'Sonuç bulunamadı.' : count + ' sonuç bulundu.';
            resultsEl.innerHTML = html;
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

            '#ls-panel{position:fixed;bottom:120px;right:15px;width:340px;background:rgba(11,16,26,0.97);',
            'border:1px solid #1a2c3f;border-radius:8px;color:#d1d8e0;font-family:sans-serif;font-size:12px;',
            'z-index:999998;box-shadow:0 10px 30px rgba(0,0,0,0.8);display:none;flex-direction:column;max-height:80vh}',

            '#ls-header{padding:8px 12px;background:linear-gradient(90deg,#0d1b2a,#1a2c3f);',
            'border-bottom:2px solid #00bcff;border-radius:8px 8px 0 0;cursor:move;display:flex;',
            'justify-content:space-between;align-items:center;user-select:none}',
            '#ls-header-title{font-weight:bold;color:#00bcff;font-size:13px;display:flex;align-items:center;gap:6px}',
            '#ls-close{cursor:pointer;color:#e74c3c;font-size:16px}',
            '#ls-close:hover{color:#ff6b6b}',

            '#ls-tabs{display:flex;border-bottom:1px solid #1a2c3f}',
            '.ls-tab{flex:1;text-align:center;padding:7px 4px;cursor:pointer;font-size:10px;',
            'background:rgba(26,44,63,0.4);transition:all .2s;color:#8899aa}',
            '.ls-tab:hover{background:rgba(0,188,255,0.15);color:#fff}',
            '.ls-tab.active{background:rgba(0,188,255,0.25);color:#00bcff;font-weight:bold;',
            'border-bottom:2px solid #00bcff}',

            '#ls-body{padding:10px;overflow-y:auto;flex:1}',
            '.ls-tc{display:none}.ls-tc.active{display:block}',

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

            '#ls-body::-webkit-scrollbar{width:5px}',
            '#ls-body::-webkit-scrollbar-track{background:#0a0e17}',
            '#ls-body::-webkit-scrollbar-thumb{background:#00bcff;border-radius:3px}',
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
                '<span id="ls-close">✖</span>' +
            '</div>' +
            '<div id="ls-tabs">' +
                '<div class="ls-tab" data-tab="cart">🏗️ Maliyet</div>' +
                '<div class="ls-tab" data-tab="scanner">🌌 Scanner</div>' +
                '<div class="ls-tab" data-tab="finder">🔍 Finder</div>' +
            '</div>' +
            '<div id="ls-body">' +

                // CART TAB
                '<div id="tc-cart" class="ls-tc">' +
                    '<div style="display:flex;gap:6px;margin-bottom:8px">' +
                        '<button id="ls-cart-copy" class="ls-btn" style="flex:1">📋 Panoya Kopyala</button>' +
                        '<button id="ls-cart-clear" class="ls-btn ls-btn-d" style="flex:1">🗑️ Temizle</button>' +
                    '</div>' +
                    '<div id="ls-cart-list" style="max-height:160px;overflow-y:auto;margin-bottom:8px"></div>' +
                    '<div id="ls-cart-totals"></div>' +
                '</div>' +

                // SCANNER TAB
                '<div id="tc-scanner" class="ls-tc">' +
                    '<div style="font-size:10px;color:#5dade2;margin-bottom:8px">ℹ️ Resmi Gameforge API kullanılır. Ban riski yoktur.</div>' +
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
                    '<div style="margin-bottom:8px">' +
                        '<span class="ls-chip" data-slots="8">🎯 Sadece 8</span>' +
                        '<span class="ls-chip" data-slots="7, 8, 9">⭐ 7, 8, 9</span>' +
                        '<span class="ls-chip" data-slots="12, 13, 14, 15">❄️ 12-15 (Deut)</span>' +
                        '<span class="ls-chip" data-slots="1, 2, 3">☀️ 1-3 (Solar)</span>' +
                    '</div>' +
                    '<div class="ls-row">' +
                        '<div class="ls-col">' +
                            '<span class="ls-label">👥 Min Eşzamanlı Boş Slot</span>' +
                            '<select id="ls-min" class="ls-inp" style="width:100%">' +
                                '<option value="1">1</option><option value="2">2</option>' +
                                '<option value="3">3</option><option value="4">4</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                    '<button id="ls-scan-btn" class="ls-btn" style="width:100%;margin-top:4px">🔍 Taramayı Başlat</button>' +
                    '<div class="ls-prog" id="ls-scan-progress"><div class="ls-prog-bar" id="ls-scan-bar"></div></div>' +
                    '<div id="ls-scan-status" style="font-size:10px;text-align:center;color:#8899aa;margin-top:4px"></div>' +
                    '<div id="ls-scan-results-box" style="display:none;margin-top:8px">' +
                        '<button id="ls-scan-copy" class="ls-btn" style="width:100%;margin-bottom:6px">📋 Koordinatları Kopyala</button>' +
                        '<div id="ls-scan-results" style="max-height:220px;overflow-y:auto"></div>' +
                    '</div>' +
                '</div>' +

                // FINDER TAB
                '<div id="tc-finder" class="ls-tc">' +
                    '<input type="text" id="ls-find-q" class="ls-inp" style="width:100%;margin-bottom:6px" placeholder="Oyuncu veya gezegen adı...">' +
                    '<div style="margin-bottom:6px;font-size:11px">' +
                        '<label style="margin-right:12px;cursor:pointer"><input type="radio" name="ls-find-type" value="player" checked> Oyuncu Adı</label>' +
                        '<label style="cursor:pointer"><input type="radio" name="ls-find-type" value="planet"> Gezegen Adı</label>' +
                    '</div>' +
                    '<button id="ls-find-btn" class="ls-btn" style="width:100%">🔍 Ara</button>' +
                    '<div id="ls-find-status" style="font-size:10px;text-align:center;color:#8899aa;margin-top:6px"></div>' +
                    '<div id="ls-find-results" style="max-height:250px;overflow-y:auto;margin-top:8px"></div>' +
                '</div>' +

            '</div>';
        document.body.appendChild(panel);

        if (isPanelOpen) {
            panel.style.display = 'flex';
        }

        fab.addEventListener('click', () => {
            const willOpen = panel.style.display !== 'flex';
            panel.style.display = willOpen ? 'flex' : 'none';
            isPanelOpen = willOpen;
            localStorage.setItem(KEYS.OPEN, willOpen ? 'true' : 'false');
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

        const header = document.getElementById('ls-header');
        header.addEventListener('mousedown', e => {
            if (e.target.id === 'ls-close') return;
            dragging = true;
            startX = e.clientX - dx;
            startY = e.clientY - dy;
            e.preventDefault();
        });
        window.addEventListener('mousemove', e => {
            if (!dragging) return;
            dx = e.clientX - startX;
            dy = e.clientY - startY;
            panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        });
        window.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
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
            });
        });

        document.getElementById('ls-find-btn').addEventListener('click', startFinder);
        document.getElementById('ls-find-q').addEventListener('keydown', e => {
            if (e.key === 'Enter') startFinder();
        });
        document.getElementById('ls-finder-results')?.addEventListener('click', e => {
            const btn = e.target.closest('.ls-nav-btn');
            if (btn && btn.dataset.g && btn.dataset.s) {
                navigateToGalaxy(parseInt(btn.dataset.g, 10), parseInt(btn.dataset.s, 10));
            }
        });
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
            newText = `📥 Sepete Ekle (Kd ${data.level})`;
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

    function setupObserver() {
        const observer = new MutationObserver(() => {
            checkAndInjectButtons();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        checkAndInjectButtons();
    }

    // ============================================================
    // INIT
    // ============================================================
    buildUI();
    setupObserver();
    console.log(LS, 'LuckyStrike OGame Helper v4.0 hazır!');

})();
