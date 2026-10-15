(function() {
    'use strict';

    const LS = '[LS]';
    console.log(LS, 'LuckyStrike OGame Helper v10.1 yükleniyor...');

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
        PLANET_CACHE: 'LS_PLANET_CACHE',
        EXPEDITION: 'LS_EXPEDITION_SETTINGS',
        EXPEDITION_RUN: 'LS_EXPEDITION_RUN',
        EXPEDITION_TEMPLATES: 'LS_EXPEDITION_TEMPLATES',
        DEBUG_ENABLED: 'LS_DEBUG_ENABLED',
        DEBUG_LOGS: 'LS_DEBUG_LOGS',
        TRACE_ENABLED: 'LS_TRACE_ENABLED',
        TRACE_LOGS: 'LS_TRACE_LOGS'
    };

    // ============================================================
    // CENTRAL LOGGER & TRACER
    // ============================================================
    let activeDebugFilters = new Set(['ALL']);
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
                    console.log(`%c[${entry.stream}] [${timeStr}] [${entry.cat}] [${entry.level}]`, tagStyle, entry.msg, entry.data || '');
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
                            const dbgTab = document.querySelector('.ls-tab[data-tab="debug"]');
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

    // Capture User Actions (Click, Keydown, Change) for Trace Logs
    document.addEventListener('click', function(e) {
        if (!LS_TRACER.isEnabled()) return;
        try {
            const target = e.target;
            if (!target) return;
            if (target.closest && (target.closest('#tc-debug') || target.closest('#ls-trace-badge'))) return;

            const desc = describeElement(target);
            LS_TRACER.record('KLİK', desc.summary, desc.details);
        } catch (err) {}
    }, true);

    document.addEventListener('keydown', function(e) {
        if (!LS_TRACER.isEnabled()) return;
        try {
            const code = e.code;
            const key = e.key;
            const isSpecialKey = ['Space', 'Enter', 'Escape', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(code);
            const isCombo = e.ctrlKey || e.altKey || e.metaKey;

            if (!isSpecialKey && !isCombo) return;

            const target = e.target;
            const targetDesc = target ? (target.id ? '#' + target.id : (target.tagName || '')) : '';
            const keyLabel = (e.ctrlKey ? 'Ctrl+' : '') + (e.altKey ? 'Alt+' : '') + (e.shiftKey ? 'Shift+' : '') + (code || key);

            LS_TRACER.record('TUŞ', `Tuş Basıldı: [${keyLabel}] (Hedef: ${targetDesc})`, {
                code: code,
                key: key,
                target: targetDesc
            });
        } catch (err) {}
    }, true);

    document.addEventListener('change', function(e) {
        if (!LS_TRACER.isEnabled()) return;
        try {
            const target = e.target;
            if (!target) return;
            if (target.closest && (target.closest('#tc-debug') || target.closest('#ls-panel'))) return;

            const name = target.name || target.id || target.className || target.tagName;
            let val = target.value;
            if (target.type === 'checkbox' || target.type === 'radio') {
                val = target.checked ? 'SEÇİLİ' : 'SEÇİLİ DEĞİL';
            }
            LS_TRACER.record('GİRDİ_DEĞİŞİMİ', `Alan Değişti: [${name}] = "${val}"`, {
                id: target.id,
                name: target.name,
                value: val,
                type: target.type
            });
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
    let isPanelOpen = localStorage.getItem(KEYS.OPEN) === 'true';
    let scanSettings = JSON.parse(localStorage.getItem(KEYS.SCAN) || '{}');
    scanSettings = Object.assign({ gStart: 1, gEnd: 9, sStart: 1, sEnd: 499, slots: '8', minEmpty: 1 }, scanSettings);

    let collectorSettings = Object.assign({
        targetId: null,
        targetCoord: '',
        targetType: 1,
        targetName: '',
        mission: 3,
        selectedShips: { bn: true, kn: true, rehber: false },
        selectedRes: { deu: true, cri: true, met: true },
        reserves: {},
        selectedItems: {}
    }, JSON.parse(localStorage.getItem(KEYS.COLLECTOR) || '{}'));

    function saveCollectorSettings() {
        localStorage.setItem(KEYS.COLLECTOR, JSON.stringify(collectorSettings));
    }

    let expeditionSettings = Object.assign({
        startCoord: '',
        count: 1,
        templateId: '',
        templateName: '',
        holdingTime: 1,
        speed: 100
    }, JSON.parse(localStorage.getItem('LS_EXPEDITION_SETTINGS') || '{}'));

    function saveExpeditionSettings() {
        localStorage.setItem('LS_EXPEDITION_SETTINGS', JSON.stringify(expeditionSettings));
    }

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

        const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const isMoon = (metaType === 'moon');

        cart.push({
            id: Date.now(),
            name: data.name,
            level: data.level,
            planet: data.planet,
            coords: metaCoords,
            type: isMoon ? 3 : 1,
            metal: data.metal,
            crystal: data.crystal,
            deuterium: data.deuterium,
            count: data.count,
            isDeduction: false
        });
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

    function deductPlanetResources() {
        const live = getLiveResources();
        const pName = getCurrentPlanetName();
        const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
        const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const isMoon = (metaType === 'moon');

        if (live.metal === 0 && live.crystal === 0 && live.deuterium === 0) {
            alert('Bu gezegende kaynak bulunamadı veya okunamadı.');
            return;
        }

        cart.push({
            id: Date.now(),
            name: `Mevcut Kaynak`,
            level: null,
            planet: pName,
            coords: metaCoords,
            type: isMoon ? 3 : 1,
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
            LS_LOGGER.info('CART', `Araştırma seviyeleri güncellendi: Hiperuzay=${techCache.hyperspace}`);
        } catch (e) {
            console.error(LS, 'Araştırma seviyeleri çekilemedi:', e);
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

        let needsChange = false;
        if (galInp && String(galInp.value).trim() !== String(g).trim()) needsChange = true;
        if (sysInp && String(sysInp.value).trim() !== String(s).trim()) needsChange = true;
        if (posInp && String(posInp.value).trim() !== String(p).trim()) needsChange = true;
        if (typeInp && String(typeInp.value).trim() !== String(targetType).trim()) needsChange = true;

        if (targetType === 3) {
            const moonBtn = document.querySelector('#mbutton, [data-type="3"], [data-planet-type="3"], #fleet2 .moon');
            if (moonBtn && !moonBtn.classList.contains('selected') && !moonBtn.classList.contains('active')) {
                needsChange = true;
            }
        } else {
            const planetBtn = document.querySelector('#pbutton, [data-type="1"], [data-planet-type="1"], #fleet2 .planet');
            if (planetBtn && !planetBtn.classList.contains('selected') && !planetBtn.classList.contains('active')) {
                needsChange = true;
            }
        }

        // Eğer zaten tüm koordinatlar ve tip doğruysa hiçbir şey yapma!
        if (!needsChange) {
            return;
        }

        const setVal = (el, val) => {
            if (!el) return;
            const targetVal = String(val);
            if (el.value === targetVal) return;
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
        };

        setVal(galInp, g);
        setVal(sysInp, s);
        setVal(posInp, p);
        if (typeInp) setVal(typeInp, targetType);

        if (targetType === 3) {
            const moonBtn = document.querySelector('#mbutton, [data-type="3"], [data-planet-type="3"], #fleet2 .moon');
            if (moonBtn && !moonBtn.classList.contains('selected') && !moonBtn.classList.contains('active')) {
                try { moonBtn.click(); } catch (e) {}
            }
        } else {
            const planetBtn = document.querySelector('#pbutton, [data-type="1"], [data-planet-type="1"], #fleet2 .planet');
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

    function getCartRequiredResources() {
        let netM = 0, netC = 0, netD = 0;
        let posM = 0, posC = 0, posD = 0;

        let targetCoord = '';
        let targetType = 1;
        let targetName = '';

        // Düşüm (deduction) yapılmış bir gezegen varsa, orası doğrudan hedeftir
        const deductionItem = cart.find(item => item.isDeduction && item.coords);
        if (deductionItem) {
            targetCoord = deductionItem.coords;
            targetType = deductionItem.type || 1;
            targetName = deductionItem.planet || '';
        } else {
            // Aksi halde sepete eklenen ilk elemanın koordinatını al
            const itemWithCoord = cart.find(item => item.coords);
            if (itemWithCoord) {
                targetCoord = itemWithCoord.coords;
                targetType = itemWithCoord.type || 1;
                targetName = itemWithCoord.planet || '';
            } else if (cart.length > 0 && cart[0].planet) {
                // Koordinat yoksa imparatorluk listesinden gezegen adından bul
                const empire = getEmpirePlanetsAndMoons();
                const matched = empire.find(p => p.name === cart[0].planet);
                if (matched) {
                    targetCoord = matched.coords;
                    targetType = 1;
                    targetName = matched.name;
                }
            }
        }

        // Eğer hala bulunamadıysa mevcut gezegenin koordinatını al
        if (!targetCoord) {
            const metaCoords = document.querySelector('meta[name="ogame-planet-coordinates"]')?.getAttribute('content') || '';
            const metaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
            targetCoord = metaCoords;
            targetType = (metaType === 'moon') ? 3 : 1;
            targetName = getCurrentPlanetName() || '';
        }

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

        return {
            m: reqM,
            c: reqC,
            d: reqD,
            hasDeduction,
            targetCoord,
            targetType,
            targetName
        };
    }

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
        const data = {
            active: true,
            m: req.m,
            c: req.c,
            d: req.d,
            mode: mode,
            targetCoord: req.targetCoord,
            targetType: req.targetType || 1,
            targetName: req.targetName || 'Hedef',
            ts: Date.now()
        };

        sessionStorage.setItem(KEYS.AUTOLOAD, JSON.stringify(data));

        const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                            document.getElementById('fleetdispatchcomponent') ||
                            document.getElementById('fleet1') ||
                            document.getElementById('fleet2') ||
                            document.getElementById('fleet3');

        if (isFleetPage) {
            executeCartFleetDispatch(data);
        } else {
            const btnAuto = document.getElementById('ls-load-btn-auto');
            const btnKN = document.getElementById('ls-load-btn-kn');
            const btnBN = document.getElementById('ls-load-btn-bn');
            const activeBtn = mode === 'kn' ? btnKN : (mode === 'bn' ? btnBN : btnAuto);
            if (activeBtn) activeBtn.innerHTML = '⏳ Filoya Gidiliyor...';

            let url = '/game/index.php?page=ingame&component=fleetdispatch';
            if (req.targetCoord && /^\d+:\d+:\d+$/.test(req.targetCoord)) {
                const [g, s, p] = req.targetCoord.split(':');
                url += `&galaxy=${g}&system=${s}&position=${p}&type=${req.targetType || 1}&mission=3`;
            }
            window.location.href = url;
        }
    }

    function checkAndApplyFleetAutoLoad() {
        const raw = sessionStorage.getItem(KEYS.AUTOLOAD);
        if (!raw) return false;
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            sessionStorage.removeItem(KEYS.AUTOLOAD);
            return false;
        }

        if (!data || !data.active || !data.ts || (Date.now() - data.ts > 180000)) {
            sessionStorage.removeItem(KEYS.AUTOLOAD);
            return false;
        }

        const isFleetPage = window.location.href.includes('component=fleetdispatch') ||
                            document.getElementById('fleetdispatchcomponent') ||
                            document.getElementById('fleet1');
        if (!isFleetPage) return false;

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
                    executeCartFleetDispatch(data);
                }, 350);
            }
        }, 150);

        return true;
    }

    function executeCartFleetDispatch(data) {
        const totalReq = (data.m || 0) + (data.c || 0) + (data.d || 0);
        const shipCounts = selectFleetShips(data.mode || 'auto', totalReq);

        const caps = calculateShipCapacities();
        const totalCap = (shipCounts.kn * caps.kn) + (shipCounts.bn * caps.bn);
        LS_LOGGER.action('CART', `Sepet filosu hazırlanıyor: Hedef [${data.targetCoord}], Gemi: BN=${shipCounts.bn}, KN=${shipCounts.kn}, Toplam Kapasite=${totalCap}`);

        const liveRes = getLiveResources();
        let deuAvail = data.d;
        let criAvail = data.c;
        let metAvail = data.m;

        if (liveRes.metal > 0 || liveRes.crystal > 0 || liveRes.deuterium > 0) {
            deuAvail = Math.min(liveRes.deuterium, data.d);
            criAvail = Math.min(liveRes.crystal, data.c);
            metAvail = Math.min(liveRes.metal, data.m);
        }

        let remCap = totalCap;
        let deuLoad = Math.min(remCap, deuAvail);
        remCap -= deuLoad;
        let criLoad = Math.min(remCap, criAvail);
        remCap -= criLoad;
        let metLoad = Math.min(remCap, metAvail);
        remCap -= metLoad;

        let g = '', s = '', p = '';
        if (data.targetCoord && /^\d+:\d+:\d+$/.test(data.targetCoord)) {
            [g, s, p] = data.targetCoord.split(':');
        }

        const prepareStep2 = () => {
            const missionId = 3; // Nakliye
            if (g && s && p) {
                setFleetTargetCoords(g, s, p, data.targetType || 1);
            }
            setFleetMission(missionId);
            fillFleetResources(metLoad, criLoad, deuLoad);
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SELECT_MISSION', missionId: missionId }
            }));
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'CARGO_REFRESH' }
            }));
            setTimeout(() => {
                setFleetMission(missionId);
            }, 100);
        };

        // Devam butonuna tıklayıp Step 2'ye geç
        setTimeout(() => {
            clickDevamButton();
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SUBMIT_FLEET1' }
            }));

            let step2Tries = 0;
            const step2Interval = setInterval(() => {
                step2Tries++;
                const devamBtn = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
                const isStep1StillActive = devamBtn && (devamBtn.offsetWidth > 0 || window.getComputedStyle(devamBtn).display !== 'none');
                const sendBtn = findSendFleetButton();
                const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                const isStep2Active = (!isStep1StillActive && isSendBtnVisible) || document.getElementById('fleet2');

                if (isStep2Active) {
                    const briefingText = document.querySelector('#briefing, #fleet2, #fleetdispatchcomponent')?.innerText || '';
                    const isInquiryPending = briefingText.includes('sonsuz uzaklar') || briefingText.includes('Bu görevi başlatamazsın');
                    const durationEl = document.getElementById('duration') || document.querySelector('.duration');
                    const hasDuration = durationEl && durationEl.innerText && durationEl.innerText.trim() !== '-' && durationEl.innerText.trim() !== '';

                    if ((!isInquiryPending && hasDuration) || step2Tries > 20) {
                        clearInterval(step2Interval);
                        setTimeout(prepareStep2, 100);
                    }
                } else if (step2Tries > 35) {
                    clearInterval(step2Interval);
                    setTimeout(prepareStep2, 100);
                }
            }, 100);
        }, 350);

        renderCartFleetBanner(data, {
            kn: shipCounts.kn,
            bn: shipCounts.bn,
            totalCap: totalCap,
            deu: deuLoad,
            cri: criLoad,
            met: metLoad,
            prepareStep2: prepareStep2
        });
    }

    function renderCartFleetBanner(data, details) {
        let banner = document.getElementById('ls-coll-floating-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'ls-coll-floating-banner';
            document.body.appendChild(banner);
        }

        const hasShips = details.totalCap > 0;
        const currentMetaType = document.querySelector('meta[name="ogame-planet-type"]')?.getAttribute('content');
        const currentIcon = (currentMetaType === 'moon') ? '🌕' : '🪐';
        const currentName = getCurrentPlanetName() || 'Mevcut';

        const targetIcon = (data.targetType === 3) ? '🌕' : '🪐';
        const cleanTName = (data.targetName || '').replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        const displayTargetTitle = cleanTName || (data.targetType === 3 ? 'Ay' : 'Hedef');

        let shipDesc = [];
        if (details.bn > 0) shipDesc.push(details.bn + ' BN');
        if (details.kn > 0) shipDesc.push(details.kn + ' KN');
        const shipText = shipDesc.length > 0 ? shipDesc.join(', ') : '<span style="color:#e74c3c">Nakliye gemisi seçilemedi!</span>';

        banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(13,27,42,0.96);border:2px solid #2ecc71;box-shadow:0 10px 32px rgba(0,0,0,0.85);border-radius:8px;padding:12px 18px;min-width:400px;max-width:90vw;z-index:9999999;font-family:sans-serif;color:#d1d8e0;text-align:center;box-sizing:border-box';

        const coordText = data.targetCoord ? ' <span style="color:#ffbe3b;font-family:monospace">[' + data.targetCoord + ']</span>' : '';

        banner.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a2c3f;padding-bottom:6px;margin-bottom:8px">' +
                '<span style="font-size:12px;font-weight:bold;color:#2ecc71">🛒 Maliyet Sepeti Gönderimi</span>' +
                '<span style="font-size:11px;color:#fff">' + currentIcon + ' ' + escapeHtml(currentName) + ' ➔ ' + targetIcon + ' ' + escapeHtml(displayTargetTitle) + coordText + '</span>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">' +
                '<div><b style="color:#8899aa">Seçilen Filo:</b> <span style="font-weight:bold">' + shipText + '</span></div>' +
                '<div style="font-size:10.5px;color:#2ecc71;font-weight:bold">🚚 Nakliye</div>' +
            '</div>' +
            '<div style="font-size:11.5px;font-family:monospace;margin-bottom:10px">' +
                '<b style="color:#8899aa">Yüklenen:</b> ' +
                '<span style="color:#2ecc71">' + formatShort(details.deu) + ' Deu</span> · ' +
                '<span style="color:#5dade2">' + formatShort(details.cri) + ' Kristal</span> · ' +
                '<span style="color:#ffbe3b">' + formatShort(details.met) + ' Metal</span>' +
            '</div>' +
            '<div style="display:flex;gap:6px;justify-content:center;align-items:center">' +
                (hasShips ?
                    '<button id="ls-cart-banner-send-btn" style="background:#27ae60;color:#fff;border:none;padding:5px 12px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.5)">🚀 Gönder (Space)</button>'
                    : '<button id="ls-cart-banner-close-btn" style="background:#e74c3c;color:#fff;border:none;padding:5px 12px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">Yetersiz Gemi - Kapat</button>') +
                '<button id="ls-cart-banner-retry-btn" style="background:#e67e22;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer" title="Hedef koordinat ve yüklemeyi tekrar dene">🔄 Tekrarla</button>' +
                '<button id="ls-cart-banner-cancel-btn" style="background:#7f8c8d;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏹️ Kapat</button>' +
            '</div>';

        const sendFleet = () => {
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
                setTimeout(() => {
                    dispatchSendCartFleet();
                }, 350);
            }
        };

        const retryDispatch = () => {
            window.removeEventListener('keydown', keyListener);
            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#e67e22;padding:6px;font-weight:bold">🔄 Yeniden hazırlanıyor...</div>';
            }
            setTimeout(() => {
                executeCartFleetDispatch(data);
            }, 150);
        };

        const dispatchSendCartFleet = () => {
            window.removeEventListener('keydown', keyListener);
            sessionStorage.removeItem(KEYS.AUTOLOAD);

            const sendBtn = findSendFleetButton();

            if (banner) {
                banner.innerHTML =
                    '<div style="font-size:12px;color:#2ecc71;padding:8px;font-weight:bold">' +
                        '🚀 Filo gönderildi! Sepet kaynakları yola çıktı.' +
                    '</div>';
            }

            LS_LOGGER.dispatch('CART', `Sepet filosu gönderiliyor: SUBMIT_FLEET2 tetiklendi.`);
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SUBMIT_FLEET2' }
            }));

            if (sendBtn) {
                try {
                    sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    sendBtn.click();
                } catch (e) {}
            }

            setTimeout(() => {
                if (banner) banner.remove();
                showCollectorToast('🛒 Sepet filosu başarıyla yola çıkarıldı.', 4000);
            }, 1200);
        };

        const closeBanner = () => {
            window.removeEventListener('keydown', keyListener);
            sessionStorage.removeItem(KEYS.AUTOLOAD);
            if (banner) banner.remove();
        };

        const keyListener = (e) => {
            if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                const tag = (document.activeElement && document.activeElement.tagName) || '';
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
                e.preventDefault();
                e.stopPropagation();
                if (hasShips) {
                    sendFleet();
                } else {
                    closeBanner();
                }
            }
        };

        window.addEventListener('keydown', keyListener);

        document.getElementById('ls-cart-banner-send-btn')?.addEventListener('click', sendFleet);
        document.getElementById('ls-cart-banner-retry-btn')?.addEventListener('click', retryDispatch);
        document.getElementById('ls-cart-banner-cancel-btn')?.addEventListener('click', closeBanner);
        document.getElementById('ls-cart-banner-close-btn')?.addEventListener('click', closeBanner);
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
        LS_LOGGER.action('SCANNER', `Galaksi taraması başlatıldı: G[${gStart}-${gEnd}], S[${sStart}-${sEnd}], Slotlar: ${slotsStr}, Min Boş: ${minEmpty}`);

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
        LS_LOGGER.action('FINDER', `Arama yapılıyor: "${query}" (Tip: ${type})`);

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
                    LS_LOGGER.warn('ALARM', 'Saldırı alarmı çalındı: ' + alarmSettings.attackSound, currentSig);
                    playAttackAlertSound(alarmSettings.attackSound);
                    triggerDesktopNotification('🚨 OGame Saldırı Alarmı!', 'Gezegeninize düşman saldırı filosu yaklaşıyor!');
                } else if (isEspionageThreat) {
                    LS_LOGGER.warn('ALARM', 'Casusluk uyarısı çalındı: ' + alarmSettings.espionageSound, currentSig);
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
                        name: 'Ay',
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
                try { list = JSON.parse(cached); } catch (e) {}
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
            console.error(LS, 'Planet cache güncellenemedi:', e);
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

    function renderCollector() {
        const empire = getEmpirePlanetsAndMoons();
        const listEl = document.getElementById('ls-coll-list');
        const targetLabelEl = document.getElementById('ls-coll-target-label');
        const ddEl = document.getElementById('ls-coll-dd');
        if (!listEl || !targetLabelEl || !ddEl) return;

        // Varsayılan hedef seçimi (sadece hiç hedef seçilmemişse ilk gezegeni ata, ASLA kullanıcının hedefini ezme)
        if (empire.length > 0 && (!collectorSettings.targetCoord || !/^\d+:\d+:\d+$/.test(collectorSettings.targetCoord))) {
            collectorSettings.targetId = empire[0].id;
            collectorSettings.targetCoord = empire[0].coords;
            collectorSettings.targetType = 1;
            collectorSettings.targetName = empire[0].name;
            saveCollectorSettings();
        }

        // 1. Hedef Buton Başlığı
        let targetIcon = '🪐';
        if (collectorSettings.targetType === 3) targetIcon = '🌕';
        let rawTargetTitle = collectorSettings.targetName || 'Hedef Gezegen';
        let cleanTargetTitle = rawTargetTitle.replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        if (!cleanTargetTitle) {
            cleanTargetTitle = collectorSettings.targetType === 3 ? 'Ay' : 'Gezegen';
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
                ddHtml += `<div class="ls-coll-dd-item moon ${isMActive ? 'active' : ''}" data-id="${p.moon.id}" data-coord="${p.coords}" data-type="3" data-name="Ay">` +
                    `<span>🌕 Ay</span><span class="crd">${p.coords}</span></div>`;
            }
        });
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="1"><span>🪐 Manuel Gezegen...</span><span></span></div>`;
        ddHtml += `<div class="ls-coll-dd-item ls-coll-dd-manual" data-manual="1" data-type="3"><span>🌕 Manuel Ay...</span><span></span></div>`;
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
                        `<span class="note">📥 Toplama noktası</span>` +
                        `<button class="ls-coll-jump" data-cp="${p.id}" title="Gezegene geç">🚀</button>` +
                    `</div>`;
                } else {
                    listHtml += `<div class="ls-coll-prow">` +
                        `<input type="checkbox" class="ls-coll-item-chk" data-id="${p.id}" ${pChecked ? 'checked' : ''}>` +
                        `<div class="ls-coll-info">` +
                            `<div class="ls-coll-name"><b>${escapeHtml(p.name)}</b><span class="crd">${p.coords}</span></div>` +
                            `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(pRes.metal)}</span><span class="ls-coll-k">${formatShort(pRes.crystal)}</span><span class="ls-coll-d">${formatShort(pRes.deuterium)}</span></div>` +
                        `</div>` +
                        `<input class="ls-inp ls-coll-rez" data-id="${p.id}" value="${fmt(pReserve)}" title="Deu Rezerv (Korumalı miktar)">` +
                        `<button class="ls-coll-jump" data-cp="${p.id}" title="Gezegene geç">🚀</button>` +
                    `</div>`;
                }

                if (p.moon) {
                    const isTargetMoon = (collectorSettings.targetCoord === p.coords && collectorSettings.targetType === 3);
                    const mRes = getPlanetCachedResources(p.moon.id);
                    const mReserve = collectorSettings.reserves[p.moon.id] !== undefined ? collectorSettings.reserves[p.moon.id] : 250000;
                    const mChecked = collectorSettings.selectedItems[p.moon.id] === true;

                    if (isTargetMoon) {
                        listHtml += `<div class="ls-coll-mrow ls-coll-dest">` +
                            `<input type="checkbox" disabled>` +
                            `<div class="ls-coll-info">` +
                                `<div class="ls-coll-name"><b>🌕 Ay</b></div>` +
                                `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(mRes.metal)}</span><span class="ls-coll-k">${formatShort(mRes.crystal)}</span><span class="ls-coll-d">${formatShort(mRes.deuterium)}</span></div>` +
                            `</div>` +
                            `<span class="note">📥 Toplama noktası</span>` +
                            `<button class="ls-coll-jump" data-cp="${p.moon.id}" title="Aya geç">🚀</button>` +
                        `</div>`;
                    } else {
                        listHtml += `<div class="ls-coll-mrow">` +
                            `<input type="checkbox" class="ls-coll-item-chk" data-id="${p.moon.id}" ${mChecked ? 'checked' : ''}>` +
                            `<div class="ls-coll-info">` +
                                `<div class="ls-coll-name"><b>🌕 Ay</b></div>` +
                                `<div class="ls-coll-res"><span class="ls-coll-m">${formatShort(mRes.metal)}</span><span class="ls-coll-k">${formatShort(mRes.crystal)}</span><span class="ls-coll-d">${formatShort(mRes.deuterium)}</span></div>` +
                            `</div>` +
                            `<input class="ls-inp ls-coll-rez" data-id="${p.moon.id}" value="${fmt(mReserve)}" title="Deu Rezerv (Korumalı miktar)">` +
                            `<button class="ls-coll-jump" data-cp="${p.moon.id}" title="Aya geç">🚀</button>` +
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
            `<span style="color:#8899aa">${checkedPCount} gezegen · ${checkedMCount} ay</span>` +
            `<span style="font-family:monospace"><span class="ls-coll-m">${formatShort(totalM)}</span> · <span class="ls-coll-k">${formatShort(totalC)}</span> · <span class="ls-coll-d">${formatShort(totalD)}</span></span>`;
    }

    let collectorEventsInitialized = false;
    function initCollectorEvents() {
        if (collectorEventsInitialized) return;
        collectorEventsInitialized = true;

        const ddEl = document.getElementById('ls-coll-dd');
        const targetBtn = document.getElementById('ls-coll-target-btn');

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
                        collectorSettings.targetId = 'manual';
                        collectorSettings.targetCoord = entered.trim();
                        collectorSettings.targetType = mType;
                        collectorSettings.targetName = typeLabel;
                        saveCollectorSettings();
                        renderCollector();
                    }
                } else {
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
            alert('Lütfen geçerli bir toplama noktası (hedef) belirleyin!');
            return;
        }

        const ships = collectorSettings.selectedShips;
        if (!ships.bn && !ships.kn && !ships.rehber) {
            alert('Lütfen taşımada kullanılacak en az bir gemi türü (BN, KN veya Rehber) seçin!');
            return;
        }

        const res = collectorSettings.selectedRes;
        if (!res.deu && !res.cri && !res.met) {
            alert('Lütfen taşınacak en az bir kaynak (Deuterium, Kristal veya Metal) seçin!');
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
                    queue.push({ id: p.moon.id, name: 'Ay', coords: p.coords, isMoon: true });
                }
            }
        });

        if (queue.length === 0) {
            alert('Toplama yapılacak en az bir gezegen veya ay seçmelisiniz!');
            return;
        }

        const session = {
            active: true,
            targetCoord: collectorSettings.targetCoord,
            targetType: collectorSettings.targetType || 1,
            targetName: collectorSettings.targetName || 'Hedef',
            mission: collectorSettings.mission || 3,
            ships: collectorSettings.selectedShips,
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
        const bnAvail = getAvailableCount(203);
        const knAvail = getAvailableCount(202);
        const rehberAvail = getAvailableCount(219);

        let bnCount = 0;
        let knCount = 0;
        let rehberCount = 0;

        const checkedShips = [];
        if (session.ships.bn) checkedShips.push('bn');
        if (session.ships.kn) checkedShips.push('kn');
        if (session.ships.rehber) checkedShips.push('rehber');

        if (checkedShips.length === 1) {
            const only = checkedShips[0];
            if (only === 'bn') {
                bnCount = Math.min(bnAvail, Math.ceil(totalCargoNeeded / caps.bn));
            } else if (only === 'kn') {
                knCount = Math.min(knAvail, Math.ceil(totalCargoNeeded / caps.kn));
            } else if (only === 'rehber') {
                rehberCount = Math.min(rehberAvail, Math.ceil(totalCargoNeeded / caps.rehber));
            }
        } else if (checkedShips.length > 1) {
            // Öncelik: BN > KN > Rehber
            let rem = totalCargoNeeded;
            if (session.ships.bn && bnAvail > 0) {
                bnCount = Math.min(bnAvail, Math.ceil(rem / caps.bn));
                rem = Math.max(0, rem - (bnCount * caps.bn));
            }
            if (rem > 0 && session.ships.kn && knAvail > 0) {
                knCount = Math.min(knAvail, Math.ceil(rem / caps.kn));
                rem = Math.max(0, rem - (knCount * caps.kn));
            }
            if (rem > 0 && session.ships.rehber && rehberAvail > 0) {
                rehberCount = Math.min(rehberAvail, Math.ceil(rem / caps.rehber));
                rem = Math.max(0, rem - (rehberCount * caps.rehber));
            }
        }

        const totalCap = (bnCount * caps.bn) + (knCount * caps.kn) + (rehberCount * caps.rehber);

        // Değer Önceliği: Deuterium > Kristal > Metal
        let remCap = totalCap;
        let deuLoad = Math.min(remCap, deuAvail);
        remCap -= deuLoad;
        let criLoad = Math.min(remCap, criAvail);
        remCap -= criLoad;
        let metLoad = Math.min(remCap, metAvail);
        remCap -= metLoad;

        // Gemileri doldur
        setShipAmount(203, bnCount);
        setShipAmount(202, knCount);
        setShipAmount(219, rehberCount);

        // Hedef koordinatları
        const [g, s, p] = session.targetCoord.split(':');

        // Step 2 (Görev ve Kaynaklar) Hazırlık Fonksiyonu
        const prepareStep2 = () => {
            const missionId = session.mission || 3;
            // Sadece eksik veya yanlışsa hedefi düzelt (doğruysa change tetiklemez)
            setFleetTargetCoords(g, s, p, session.targetType);
            setFleetMission(missionId);
            fillFleetResources(metLoad, criLoad, deuLoad);
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SELECT_MISSION', missionId: missionId }
            }));
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'CARGO_REFRESH' }
            }));
            setTimeout(() => {
                setFleetMission(missionId);
            }, 100);
        };

        // Devam butonuna tıklayıp Step 2'ye geç (Gemilerin girilmesi için 350ms ver)
        setTimeout(() => {
            clickDevamButton();
            window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
                detail: { type: 'SUBMIT_FLEET1' }
            }));

            // Step 2'nin açılmasını ve OGame hedef doğrulamasının (inquiry) bitmesini izle
            let step2Tries = 0;
            const step2Interval = setInterval(() => {
                step2Tries++;
                const devamBtn = document.getElementById('continueToFleet2') || document.querySelector('button.continue') || document.querySelector('a.continue');
                const isStep1StillActive = devamBtn && (devamBtn.offsetWidth > 0 || window.getComputedStyle(devamBtn).display !== 'none');
                const sendBtn = findSendFleetButton();
                const isSendBtnVisible = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                const isStep2Active = (!isStep1StillActive && isSendBtnVisible) || document.getElementById('fleet2');

                if (isStep2Active) {
                    const briefingText = document.querySelector('#briefing, #fleet2, #fleetdispatchcomponent')?.innerText || '';
                    const isInquiryPending = briefingText.includes('sonsuz uzaklar') || briefingText.includes('Bu görevi başlatamazsın');
                    const durationEl = document.getElementById('duration') || document.querySelector('.duration');
                    const hasDuration = durationEl && durationEl.innerText && durationEl.innerText.trim() !== '-' && durationEl.innerText.trim() !== '';

                    // Eğer hedef doğrulaması (inquiry) bittiyse veya 20 deneme (2 sn) dolduysa Step 2'yi hazırla
                    if ((!isInquiryPending && hasDuration) || step2Tries > 20) {
                        clearInterval(step2Interval);
                        setTimeout(prepareStep2, 100);
                    }
                } else if (step2Tries > 35) {
                    clearInterval(step2Interval);
                    setTimeout(prepareStep2, 100);
                }
            }, 100);
        }, 350);

        // Asistan Banner'ını Çiz
        renderCollectorAssistantBanner(session, currentItem, {
            bn: bnCount, kn: knCount, rehber: rehberCount,
            deu: deuLoad, cri: criLoad, met: metLoad,
            totalCap: totalCap,
            g: g, s: s, p: p,
            prepareStep2: prepareStep2
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
        const missionName = (session.mission === 4 ? '🛡️ Konuşlandır' : '🚚 Nakliye');

        let shipDesc = [];
        if (details.bn > 0) shipDesc.push(details.bn + ' BN');
        if (details.kn > 0) shipDesc.push(details.kn + ' KN');
        if (details.rehber > 0) shipDesc.push(details.rehber + ' Rehber');
        const shipText = shipDesc.length > 0 ? shipDesc.join(', ') : '<span style="color:#e74c3c">Nakliye gemisi yok!</span>';

        const cleanTName = (session.targetName || '').replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
        const displayTargetTitle = cleanTName || (session.targetType === 3 ? 'Ay' : 'Hedef');
        const displayTargetIcon = session.targetType === 3 ? '🌕' : '🪐';

        banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(13,27,42,0.96);border:2px solid #00bcff;box-shadow:0 10px 32px rgba(0,0,0,0.85);border-radius:8px;padding:12px 18px;min-width:400px;max-width:90vw;z-index:9999999;font-family:sans-serif;color:#d1d8e0;text-align:center;box-sizing:border-box';

        banner.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a2c3f;padding-bottom:6px;margin-bottom:8px">' +
                '<span style="font-size:12px;font-weight:bold;color:#00bcff">📦 Toplayıcı Asistanı [' + currentStep + ' / ' + totalItems + ']</span>' +
                '<span style="font-size:11px;color:#fff">' + (currentItem.isMoon ? '🌕' : '🪐') + ' ' + escapeHtml(currentItem.name) + ' ➔ ' + displayTargetIcon + ' ' + escapeHtml(displayTargetTitle) + ' <span style="color:#ffbe3b;font-family:monospace">[' + session.targetCoord + ']</span></span>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">' +
                '<div><b style="color:#8899aa">Seçilen Filo:</b> <span style="font-weight:bold">' + shipText + '</span></div>' +
                '<div style="font-size:10.5px;color:#00bcff;font-weight:bold">' + missionName + '</div>' +
            '</div>' +
            '<div style="font-size:11.5px;font-family:monospace;margin-bottom:10px">' +
                '<b style="color:#8899aa">Taşınan:</b> ' +
                '<span style="color:#2ecc71">' + formatShort(details.deu) + ' Deu</span> · ' +
                '<span style="color:#5dade2">' + formatShort(details.cri) + ' Kristal</span> · ' +
                '<span style="color:#ffbe3b">' + formatShort(details.met) + ' Metal</span>' +
            '</div>' +
            '<div style="display:flex;gap:6px;justify-content:center;align-items:center">' +
                (hasShips ?
                    '<button id="ls-banner-send-btn" style="background:#27ae60;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.5)">🚀 Gönder (Space)</button>'
                    : '<button class="ls-banner-skip-btn" style="background:#f39c12;color:#000;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ Atla (Space)</button>') +
                '<button id="ls-banner-retry-btn" style="background:#e67e22;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer" title="Bu adımı ve hedef ayarlarını sıfırdan tekrarla">🔄 Tekrarla</button>' +
                (hasShips ? '<button class="ls-banner-skip-btn" style="background:#34495e;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ Atla</button>' : '') +
                '<button id="ls-banner-cancel-btn" style="background:#e74c3c;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏹️ İptal</button>' +
            '</div>';

        const sendFleet = () => {
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
                setTimeout(() => {
                    dispatchSendFleetButton();
                }, 350);
            }
        };

        const retryCurrentStep = () => {
            window.removeEventListener('keydown', keyListener);
            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#e67e22;padding:6px;font-weight:bold">🔄 Adım yeniden deneniyor...</div>';
            }
            setTimeout(() => {
                executeFleetDispatchStep(session, currentItem);
            }, 150);
        };

        const dispatchSendFleetButton = () => {
            window.removeEventListener('keydown', keyListener);
            const sendBtn = findSendFleetButton();

            // Önce kuyruğu derhal bir sonraki adıma geçir ve kaydet!
            // Böylece OGame AJAX ile sayfayı yenilese bile aynı gezegen tekrar etmez.
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

            // DOM butonuna da tıkla
            if (sendBtn) {
                try {
                    sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    sendBtn.click();
                } catch (e) {}
            }

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
            LS_LOGGER.warn('COLLECTOR', 'Toplama işlemi iptal edildi.');
            sessionStorage.removeItem(KEYS.COLLECTOR_RUN);
            if (banner) banner.remove();
            showCollectorToast('Toplama işlemi iptal edildi.', 3000);
        };

        const keyListener = (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                const tag = document.activeElement ? document.activeElement.tagName : '';
                if (tag === 'TEXTAREA' || tag === 'SELECT') return;
                if (tag === 'INPUT') {
                    if (document.activeElement.id && document.activeElement.id.includes('search')) return;
                    document.activeElement.blur();
                }
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

        const isLuckyElement = (el) => {
            if (!el) return true;
            return !!el.closest('#ls-panel, [id^="ls-"], .ls-custom, #ls-coll-floating-banner');
        };

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

    function setFleetSpeed(speedPercent) {
        speedPercent = parseInt(speedPercent, 10) || 100;
        const stepVal = Math.round(speedPercent / 10);
        const selectors = `[data-step="${speedPercent}"], [data-step="${stepVal}"], [data-value="${speedPercent}"], [data-value="${stepVal}"], ul.steps li[data-step="${speedPercent}"], ul.steps li[data-step="${stepVal}"], #speedPercentage [data-step="${speedPercent}"], #speedPercentage [data-step="${stepVal}"], #fleet1 [data-step="${speedPercent}"], #fleet1 [data-step="${stepVal}"], .steps li[data-step="${speedPercent}"], .steps li[data-step="${stepVal}"]`;
        let stepEls = Array.from(document.querySelectorAll(selectors));
        if (stepEls.length === 0) {
            const container = document.querySelector('#speedPercentage, .steps, #fleet2');
            if (container) {
                const candidates = container.querySelectorAll('li, a, span, button, div');
                for (const c of candidates) {
                    if (c.children.length === 0 && (c.textContent.trim() === String(speedPercent) || c.textContent.trim() === `${speedPercent}%`)) {
                        stepEls.push(c);
                        break;
                    }
                }
            }
        }
        stepEls.forEach(el => {
            try {
                el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
                el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
                el.click();
            } catch (e) {}
        });

        const speedInps = document.querySelectorAll('input[name="speed"], #speed');
        speedInps.forEach(inp => {
            inp.value = speedPercent;
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.dispatchEvent(new Event('change', { bubbles: true }));
        });

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SET_SPEED', speed: speedPercent }
        }));
    }

    function setFleetHoldingTime(hours) {
        hours = parseInt(hours, 10) || 1;
        const hoursStr = String(hours);
        let holdEls = Array.from(document.querySelectorAll('#holdingtime, select[name="holdingtime"], input[name="holdingtime"], select#holdingtime, [name*="holding" i], [id*="holding" i], select[name*="expedition" i], select[id*="expedition" i]'));
        if (holdEls.length === 0) {
            const selects = Array.from(document.querySelectorAll('#fleet2 select, #briefing select, #fleetdispatchcomponent select, form select')).filter(s => !isLuckyElement(s));
            for (const s of selects) {
                const vals = Array.from(s.options).map(o => o.value);
                if (vals.includes('1') && (vals.includes('2') || vals.includes(hoursStr))) {
                    holdEls.push(s);
                    break;
                }
            }
        }
        holdEls.forEach(el => {
            if (el.tagName === 'SELECT') {
                for (let i = 0; i < el.options.length; i++) {
                    if (String(el.options[i].value) === hoursStr || el.options[i].text.trim().startsWith(hoursStr)) {
                        el.selectedIndex = i;
                        el.value = el.options[i].value;
                        el.options[i].selected = true;
                        break;
                    }
                }
            } else {
                el.value = hours;
            }
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));

            // Update companion jQuery UI widget text if present
            if (el.id) {
                const btn = document.getElementById(el.id + '-button');
                if (btn) {
                    const txt = btn.querySelector('.ui-selectmenu-text') || btn;
                    txt.textContent = hoursStr;
                }
            }
        });

        const dropOptions = document.querySelectorAll(`[id*="holding"][id*="menu"] li, ul.dropdownList li[data-value="${hours}"], [rel="holdingtime"] li[data-value="${hours}"], .ui-selectmenu-menu li`);
        dropOptions.forEach(opt => {
            if (opt.textContent.trim() === hoursStr || opt.getAttribute('data-value') === hoursStr) {
                try {
                    opt.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
                    opt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                    opt.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
                    opt.click();
                } catch (e) {}
            }
        });

        window.dispatchEvent(new CustomEvent('LS_PAGE_ACTION', {
            detail: { type: 'SET_HOLDING_TIME', hours: hours }
        }));
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

        const holdingSel = document.getElementById('ls-exp-holding');
        if (holdingSel) holdingSel.value = String(expeditionSettings.holdingTime || 1);

        const speedSel = document.getElementById('ls-exp-speed');
        if (speedSel) speedSel.value = String(expeditionSettings.speed || 100);

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

        const holdingSel = document.getElementById('ls-exp-holding');
        if (holdingSel) {
            holdingSel.addEventListener('change', () => {
                expeditionSettings.holdingTime = parseInt(holdingSel.value, 10) || 1;
                saveExpeditionSettings();
            });
        }

        const speedSel = document.getElementById('ls-exp-speed');
        if (speedSel) {
            speedSel.addEventListener('change', () => {
                expeditionSettings.speed = parseInt(speedSel.value, 10) || 100;
                saveExpeditionSettings();
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
            alert('Lütfen geçerli bir başlangıç keşif koordinatı girin (örn: 5:242:16)!');
            return;
        }

        const [gStr, sStr, pStr] = coordInput.split(':');
        const count = Math.max(1, parseInt(expeditionSettings.count, 10) || 1);
        const queue = generateExpeditionQueue(gStr, sStr, count);

        if (queue.length === 0) {
            alert('Keşif için sistem listesi oluşturulamadı!');
            return;
        }

        const holdingInp = document.getElementById('ls-exp-holding');
        if (holdingInp) expeditionSettings.holdingTime = parseInt(holdingInp.value, 10) || 1;
        const speedInp = document.getElementById('ls-exp-speed');
        if (speedInp) expeditionSettings.speed = parseInt(speedInp.value, 10) || 100;
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
            holdingTime: expeditionSettings.holdingTime || 1,
            speed: expeditionSettings.speed || 100,
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

        if (sysInp) {
            const strS = String(s);
            const tempS = strS.length > 1 ? strS.slice(0, -1) : '1';

            // Simüle et: 1 rakam eksik yazıp input ve keyup tetikle
            setNative(sysInp, tempS);
            try { sysInp.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
            try { sysInp.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: tempS.slice(-1) })); } catch (e) {}

            // Ardından tam değeri yaz ve change/input/keyup tetikle
            setTimeout(() => {
                setNative(sysInp, strS);
                try { sysInp.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
                try { sysInp.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
                try { sysInp.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: strS.slice(-1) })); } catch (e) {}
            }, 40);
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
                btn.innerText = '🚀 Gönder (Space)';
            }
        };

        const prepareStep2 = () => {
            if (isStepCancelled) return;

            // 1. Hedef koordinatı (g:s:16) Step 2 olarak ata (bu updateTarget() AJAX sorgusunu tetikler)
            setExpeditionTarget(currentItem.g, currentItem.s, true);

            const targetHolding = parseInt(session.holdingTime, 10) || 1;
            const targetSpeed = parseInt(session.speed, 10) || 100;

            LS_LOGGER.info('EXPEDITION', `Step 2 parametreleri hazırlanıyor: Hız=%${targetSpeed}, Süre=${targetHolding}s, Hedef [${currentItem.g}:${currentItem.s}:16]`);

            const applyStep2Settings = () => {
                if (isStepCancelled) return;
                setFleetMission(15);
                setFleetHoldingTime(targetHolding);
                setFleetSpeed(targetSpeed);
            };

            applyStep2Settings();

            // 2. OGame'in target AJAX sorgusu dönüp briefing'i ve dropdown'ları render edene/oturtana kadar aktif takip
            let step2Checks = 0;
            const step2Timer = setInterval(() => {
                if (isStepCancelled) {
                    clearInterval(step2Timer);
                    return;
                }
                step2Checks++;

                applyStep2Settings();

                // Kontroller:
                const missionBtn = document.querySelector('#missionButton15, [data-mission="15"]');
                const isMission15Active = missionBtn && (missionBtn.classList.contains('selected') || missionBtn.classList.contains('active'));

                const holdEl = document.querySelector('#holdingtime, select[name="holdingtime"], select#holdingtime, [name*="holding" i], [id*="holding" i]');
                const holdVal = holdEl ? parseInt(holdEl.value, 10) : null;
                const isHoldReady = (holdVal === targetHolding);

                const speedInp = document.querySelector('input[name="speed"], #speed');
                const speedVal = speedInp ? parseInt(speedInp.value, 10) : null;
                const speedStep = Math.round(targetSpeed / 10);
                const speedBtn = document.querySelector(`[data-step="${targetSpeed}"], [data-step="${speedStep}"]`);
                const isSpeedActive = (speedVal === targetSpeed) || (speedBtn && (speedBtn.classList.contains('selected') || speedBtn.classList.contains('active')));

                if ((isMission15Active && isHoldReady && isSpeedActive && step2Checks >= 4) || step2Checks > 22) {
                    clearInterval(step2Timer);
                    applyStep2Settings();
                    setTimeout(() => {
                        if (isStepCancelled) return;
                        applyStep2Settings();
                        updateBannerReady();
                    }, 80);
                }
            }, 80);
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
                }, 200);
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
                setTimeout(prepareStep2, 300);
            }
        }, 150);

        renderExpeditionBanner(session, currentItem, {
            prepareStep2: prepareStep2,
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
        const departure = session.departureName ? `${session.departureName} [${session.departureCoord}]` : (session.departureCoord || 'Mevcut');
        const offsetText = currentItem.offset === 0 ? 'Kendi Sistemi' : (currentItem.offset > 0 ? `+${currentItem.offset} Sistem` : `${currentItem.offset} Sistem`);
        const templateName = session.templateName || (session.templateId ? `Şablon #${session.templateId}` : 'Varsayılan');

        banner.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(13,27,42,0.96);border:2px solid #9b59b6;box-shadow:0 10px 32px rgba(0,0,0,0.85);border-radius:8px;padding:12px 18px;min-width:420px;max-width:90vw;z-index:9999999;font-family:sans-serif;color:#d1d8e0;text-align:center;box-sizing:border-box';

        banner.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a2c3f;padding-bottom:6px;margin-bottom:8px">' +
                '<span style="font-size:12px;font-weight:bold;color:#bb86fc">🧭 Keşif Asistanı [' + currentStep + ' / ' + totalItems + ']</span>' +
                '<span style="font-size:11px;color:#fff">🪐 ' + escapeHtml(departure) + ' ➔ 🌌 Sonsuz Uzaklar <span style="color:#ffbe3b;font-family:monospace">[' + currentItem.coord + ']</span></span>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;margin-bottom:8px">' +
                '<div><b style="color:#8899aa">Hedef Rota:</b> <span style="color:#00bcff;font-weight:bold">' + offsetText + '</span></div>' +
                '<div><b style="color:#8899aa">Şablon:</b> <span style="color:#2ecc71;font-weight:bold">' + escapeHtml(templateName) + '</span></div>' +
                '<div><b style="color:#8899aa">Hız:</b> <span style="color:#ffbe3b;font-weight:bold">%' + session.speed + '</span> · <b style="color:#8899aa">Süre:</b> <span style="color:#ffbe3b;font-weight:bold">' + session.holdingTime + 's</span></div>' +
            '</div>' +
            '<div style="display:flex;gap:6px;justify-content:center;align-items:center">' +
                '<button id="ls-exp-banner-send-btn" disabled style="background:#445566;color:#8899aa;border:none;padding:5px 12px;border-radius:4px;font-weight:bold;font-size:11px;cursor:not-allowed">⏳ Hazırlanıyor...</button>' +
                '<button id="ls-exp-banner-retry-btn" style="background:#e67e22;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer" title="Bu adımı ve hedef ayarlarını sıfırdan tekrarla">🔄 Tekrarla</button>' +
                '<button id="ls-exp-banner-skip-btn" style="background:#34495e;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏭️ Atla</button>' +
                '<button id="ls-exp-banner-cancel-btn" style="background:#e74c3c;color:#fff;border:none;padding:5px 9px;border-radius:4px;font-weight:bold;font-size:11px;cursor:pointer">⏹️ İptal</button>' +
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
            LS_LOGGER.action('EXPEDITION', `Keşif gönder emri verildi (Space/Tık). [${currentItem.g}:${currentItem.s}:16]`);
            dispatchSendExpeditionFleet();
        };

        const retryCurrentStep = () => {
            isDispatching = false;
            window.removeEventListener('keydown', keyListener);
            if (typeof details.cancel === 'function') details.cancel();
            if (banner) {
                banner.innerHTML = '<div style="font-size:12px;color:#e67e22;padding:6px;font-weight:bold">🔄 Keşif adımı yeniden hazırlanıyor...</div>';
            }
            setTimeout(() => {
                const sendBtn = findSendFleetButton();
                const isStep2 = sendBtn && (sendBtn.offsetWidth > 0 || window.getComputedStyle(sendBtn).display !== 'none');
                if (isStep2 && typeof details.prepareStep2 === 'function') {
                    renderExpeditionBanner(session, currentItem, details);
                    details.prepareStep2();
                } else {
                    executeExpeditionStep(session, currentItem);
                }
            }, 150);
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
                detail: { type: 'SUBMIT_FLEET2' }
            }));

            const sendBtn = findSendFleetButton();
            if (sendBtn) {
                try {
                    sendBtn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
                    sendBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                    sendBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
                    sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    sendBtn.click();
                } catch (e) {}
            }

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
            '@keyframes ls-pulse{0%{opacity:0.6;transform:scale(0.9)}50%{opacity:1;transform:scale(1.15)}100%{opacity:0.6;transform:scale(0.9)}}',
            '.ls-debug-filter{background:rgba(255,255,255,0.05);border:1px solid #1a2c3f;color:#8899aa;font-size:9.5px;padding:2px 6px;border-radius:3px;cursor:pointer;user-select:none;transition:all .15s}',
            '.ls-debug-filter:hover{background:rgba(0,188,255,0.15);color:#fff}',
            '.ls-debug-filter.active{background:#00bcff;color:#000;font-weight:bold;border-color:#00bcff}',
            '.ls-debug-filter[data-filter="TRACE"].active{background:#ff5722;color:#fff;border-color:#ff5722}',
            '.ls-debug-filter[data-filter="ERROR"].active{background:#e74c3c;color:#fff;border-color:#e74c3c}',

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

            '#ls-body::-webkit-scrollbar, #ls-cart-list::-webkit-scrollbar, #ls-debris-list::-webkit-scrollbar, #ls-scan-results::-webkit-scrollbar, #ls-find-results::-webkit-scrollbar, #ls-coll-list::-webkit-scrollbar, #ls-coll-dd::-webkit-scrollbar{width:5px}',
            '#ls-body::-webkit-scrollbar-track, #ls-cart-list::-webkit-scrollbar-track, #ls-debris-list::-webkit-scrollbar-track, #ls-scan-results::-webkit-scrollbar-track, #ls-find-results::-webkit-scrollbar-track, #ls-coll-list::-webkit-scrollbar-track, #ls-coll-dd::-webkit-scrollbar-track{background:#0a0e17}',
            '#ls-body::-webkit-scrollbar-thumb, #ls-cart-list::-webkit-scrollbar-thumb, #ls-debris-list::-webkit-scrollbar-thumb, #ls-scan-results::-webkit-scrollbar-thumb, #ls-find-results::-webkit-scrollbar-thumb, #ls-coll-list::-webkit-scrollbar-thumb, #ls-coll-dd::-webkit-scrollbar-thumb{background:#00bcff;border-radius:3px}',

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
            '.ls-coll-dd-item{padding:6px 8px;font-size:11px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #16222f;cursor:pointer;transition:background .15s;background:#0d1520}',
            '.ls-coll-dd-item:hover{background:rgba(0,188,255,0.22) !important}',
            '.ls-coll-dd-item.active{background:rgba(0,188,255,0.32) !important}',
            '.ls-coll-dd-item .crd{font-family:monospace;color:#00bcff;font-size:10px}',
            '.ls-coll-dd-item.moon{padding-left:18px;color:#c9d6e3}',
            '.ls-coll-dd-manual{color:#8899aa;font-style:italic;border-bottom:none}',
            '.ls-coll-mbtn{background:#1a2c3f;color:#8899aa;border:1px solid #2c3e50;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;transition:all .15s}',
            '.ls-coll-mbtn.active{background:#00bcff;color:#000;border-color:#00bcff}',
            '.ls-coll-mbtn:hover:not(.active){background:#243a52;color:#fff}',
            '.ls-coll-selbar{display:flex;gap:4px;margin-bottom:6px;flex-shrink:0}',
            '.ls-coll-selbar .ls-btn-sm{flex:1;text-align:center;padding:3px 2px}',
            '.ls-coll-head{display:flex;justify-content:space-between;align-items:center;padding:0 2px 4px 2px;border-bottom:1px solid #1a2c3f;margin-bottom:6px;flex-shrink:0}',
            '.ls-coll-list{flex:1;min-height:80px;overflow-y:auto;padding-right:2px}',
            '.ls-coll-grp{margin-bottom:5px}',
            '.ls-coll-prow{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border-radius:4px;padding:5px 6px;transition:background .15s}',
            '.ls-coll-prow:hover{background:rgba(255,255,255,0.07)}',
            '.ls-coll-mrow{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.025);border-radius:4px;padding:4px 6px;margin:3px 0 0 16px;position:relative;transition:background .15s}',
            '.ls-coll-mrow:hover{background:rgba(255,255,255,0.05)}',
            '.ls-coll-mrow:before{content:"";position:absolute;left:-10px;top:-6px;width:8px;height:18px;border-left:1px solid #2f5f86;border-bottom:1px solid #2f5f86}',
            '.ls-coll-prow input[type=checkbox],.ls-coll-mrow input[type=checkbox]{accent-color:#00bcff;margin:0;width:13px;height:13px;flex-shrink:0;cursor:pointer}',
            '.ls-coll-info{flex:1;min-width:0}',
            '.ls-coll-name{display:flex;align-items:baseline;gap:5px;white-space:nowrap;overflow:hidden}',
            '.ls-coll-name b{color:#fff;font-size:11.5px;overflow:hidden;text-overflow:ellipsis}',
            '.ls-coll-name .crd{color:#00bcff;font-size:10px;font-family:monospace}',
            '.ls-coll-mrow .ls-coll-name b{color:#c9d6e3;font-weight:normal;font-size:11px}',
            '.ls-coll-res{display:flex;gap:7px;font-family:monospace;font-size:10.5px;margin-top:2px}',
            '.ls-coll-m{color:#ffbe3b}.ls-coll-k{color:#5dade2}.ls-coll-d{color:#2ecc71}',
            '.ls-coll-rez{width:68px;text-align:right;color:#2ecc71;font-family:monospace;font-weight:bold;flex-shrink:0;padding:2px 4px;font-size:10.5px}',
            '.ls-coll-jump{background:#00bcff;color:#000;border:none;padding:3px 6px;border-radius:3px;font-size:11px;line-height:14px;flex-shrink:0;cursor:pointer;font-weight:bold}',
            '.ls-coll-jump:hover{background:#33cfff}',
            '.ls-coll-dest{opacity:0.6}',
            '.ls-coll-dest .note{font-size:9.5px;color:#8899aa;width:68px;text-align:center;flex-shrink:0}',
            '.ls-coll-sum{display:flex;justify-content:space-between;align-items:center;font-size:11px;margin:8px 0 6px 0;flex-shrink:0}',
            '.ls-coll-go{flex-shrink:0;width:100%;background:linear-gradient(180deg,#ff8c00,#f57c00);color:#fff;border:none;border-radius:3px;padding:8px;font-weight:bold;font-size:12px;cursor:pointer;transition:transform .15s, background .15s}',
            '.ls-coll-go:hover{background:linear-gradient(180deg,#ffa024,#f57c00);transform:scale(1.01)}',
            '.ls-coll-go:active{transform:scale(0.99)}',
            '.ls-coll-go:disabled{opacity:0.5;cursor:not-allowed}',
            '.ls-exp-go{flex-shrink:0;width:100%;background:linear-gradient(180deg,#8e44ad,#6c3483);color:#fff;border:none;border-radius:4px;padding:9px;font-weight:bold;font-size:12px;cursor:pointer;transition:transform .15s, background .15s;box-shadow:0 2px 8px rgba(142,68,173,0.4)}',
            '.ls-exp-go:hover{background:linear-gradient(180deg,#9b59b6,#7d3c98);transform:scale(1.01)}',
            '.ls-exp-go:active{transform:scale(0.99)}',
            '.ls-exp-go:disabled{opacity:0.5;cursor:not-allowed}',
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
                '<span id="ls-header-title">' + boltSvg + ' LuckyStrike Helper <span style="font-size:10px;color:#8899aa;font-weight:normal;opacity:0.8">v10.0</span></span>' +
                '<div style="display:flex;align-items:center;gap:6px">' +
                    '<button id="ls-header-stop-btn" class="ls-btn-d ls-btn-sm" style="display:none;padding:2px 7px;font-size:10px;align-items:center;gap:3px;cursor:pointer" title="Tekrarlayan bu alarmı sustur">⏹️ Sustur</button>' +
                    '<span id="ls-close">✖</span>' +
                '</div>' +
            '</div>' +
            '<div id="ls-tabs">' +
                '<div class="ls-tab" data-tab="cart"><span class="ls-tab-icon">🏗️</span><span class="ls-tab-label">Maliyet</span></div>' +
                '<div class="ls-tab" data-tab="collector"><span class="ls-tab-icon">📦</span><span class="ls-tab-label">Collector</span></div>' +
                '<div class="ls-tab" data-tab="debris"><span class="ls-tab-icon">🛰️</span><span class="ls-tab-label">Harabe</span></div>' +
                '<div class="ls-tab" data-tab="expedition"><span class="ls-tab-icon">🧭</span><span class="ls-tab-label">Keşif</span></div>' +
                '<div class="ls-tab" data-tab="scanner"><span class="ls-tab-icon">🌌</span><span class="ls-tab-label">Scanner</span></div>' +
                '<div class="ls-tab" data-tab="finder"><span class="ls-tab-icon">🔍</span><span class="ls-tab-label">Finder</span></div>' +
                '<div class="ls-tab" data-tab="alarm"><span class="ls-tab-icon">🚨</span><span class="ls-tab-label">Alarm</span></div>' +
                '<div class="ls-tab" data-tab="debug"><span class="ls-tab-icon">🐞</span><span class="ls-tab-label">Debug</span></div>' +
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
                        '<input type="text" id="ls-slots" class="ls-inp" style="width:100%" placeholder="8 veya 7, 9">' +
                    '</div>' +
                    '<div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:2px">' +
                        '<span class="ls-chip" data-slots="8" data-min="1">🎯 Sadece 8</span>' +
                        '<span class="ls-chip" data-slots="7, 9" data-min="1">⭐ 7, 9</span>' +
                        '<span class="ls-chip" data-slots="13, 14, 15" data-min="1">❄️ 13-15 (Deut)</span>' +
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
                            '<option value="11">11 slot</option>' +
                            '<option value="12">12 slot</option>' +
                            '<option value="13">13 slot</option>' +
                            '<option value="14">14 slot</option>' +
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

                // COLLECTOR TAB
                '<div id="tc-collector" class="ls-tc">' +
                    '<div id="ls-coll-card-target" class="ls-coll-card">' +
                        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">' +
                            '<span class="ls-label">🎯 Collect To</span>' +
                            '<div style="display:flex;gap:4px">' +
                                '<button type="button" id="ls-coll-mission-3" class="ls-coll-mbtn ' + (collectorSettings.mission === 3 ? 'active' : '') + '">Nakliye</button>' +
                                '<button type="button" id="ls-coll-mission-4" class="ls-coll-mbtn ' + (collectorSettings.mission === 4 ? 'active' : '') + '">Konuşlandır</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ls-coll-row">' +
                            '<div class="ls-coll-combo">' +
                                '<div id="ls-coll-target-btn" class="ls-coll-sel">' +
                                    '<span id="ls-coll-target-label"><b>🪐 Yükleniyor...</b></span>' +
                                    '<span style="color:#00bcff;font-size:9px">▼</span>' +
                                '</div>' +
                                '<div id="ls-coll-dd" class="ls-coll-dd"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-card">' +
                        '<div class="ls-coll-row" style="margin-bottom:5px">' +
                            '<span class="ls-label" style="width:52px">🚀 Gemi</span>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-ship-bn"> BN</label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-ship-kn"> KN</label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-ship-rehber"> Rehber</label>' +
                        '</div>' +
                        '<div class="ls-coll-row">' +
                            '<span class="ls-label" style="width:52px">💎 Kaynak</span>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-res-deu"> <span class="ls-coll-d">Deuterium</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-res-cri"> <span class="ls-coll-k">Kristal</span></label>' +
                            '<label class="ls-coll-chk"><input type="checkbox" id="ls-coll-res-met"> <span class="ls-coll-m">Metal</span></label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-selbar">' +
                        '<button id="ls-coll-sel-all" class="ls-btn-sm">Tümü</button>' +
                        '<button id="ls-coll-sel-planets" class="ls-btn-sm">🪐 Gezegenler</button>' +
                        '<button id="ls-coll-sel-moons" class="ls-btn-sm">🌕 Aylar</button>' +
                        '<button id="ls-coll-sel-none" class="ls-btn-sm" style="color:#e74c3c">✖ Kaldır</button>' +
                    '</div>' +

                    '<div class="ls-coll-head">' +
                        '<span style="font-size:11px;font-weight:bold;color:#00bcff">🪐 Gezegenler & Aylar</span>' +
                        '<span style="font-size:10px;color:#2ecc71;font-weight:bold;width:68px;text-align:center;margin-right:32px">Deu Rezerv</span>' +
                    '</div>' +

                    '<div id="ls-coll-list" class="ls-coll-list"></div>' +

                    '<div id="ls-coll-summary" class="ls-coll-sum">' +
                        '<span style="color:#8899aa">0 gezegen · 0 ay</span>' +
                        '<span style="font-family:monospace"><span class="ls-coll-m">0</span> · <span class="ls-coll-k">0</span> · <span class="ls-coll-d">0</span></span>' +
                    '</div>' +

                    '<button id="ls-coll-start-btn" class="ls-coll-go">🚀 Toplamayı Başlat</button>' +
                '</div>' +

                // EXPEDITION TAB (KEŞİF ASİSTANI)
                '<div id="tc-expedition" class="ls-tc">' +
                    '<div class="ls-coll-card">' +
                        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
                            '<span class="ls-label" style="color:#bb86fc">🎯 Başlangıç Keşif Noktası (Slot 16)</span>' +
                            '<button id="ls-exp-cur-btn" class="ls-btn-sm" style="background:#2c3e50;color:#00bcff;padding:2px 6px;font-size:10px" title="Şu anki gezegenin :16 slotunu yaz">📍 Mevcut Gezegen</button>' +
                        '</div>' +
                        '<div style="display:flex;gap:6px">' +
                            '<input type="text" id="ls-exp-start-coord" class="ls-inp" style="flex:1;font-family:monospace;font-weight:bold;color:#ffbe3b;text-align:center" placeholder="5:242:16">' +
                        '</div>' +
                        '<div style="font-size:10px;color:#8899aa;margin-top:4px">' +
                            'Keşifler bu sistemden başlayarak yakından uzağa doğru spiral (+1, -1, +2, -2...) dağıtılır.' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-card">' +
                        '<div style="display:flex;gap:8px;margin-bottom:8px">' +
                            '<div style="flex:1">' +
                                '<span class="ls-label">🔢 Sefer Sayısı</span>' +
                                '<input type="number" id="ls-exp-count" class="ls-inp" min="1" max="50" style="width:100%;font-weight:bold;color:#00bcff;text-align:center" value="1">' +
                            '</div>' +
                            '<div style="flex:2">' +
                                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                                    '<span class="ls-label">📋 Keşif Şablonu</span>' +
                                    '<span id="ls-exp-refresh-tpls" style="font-size:10px;color:#00bcff;cursor:pointer" title="Şablonları yenile">🔄</span>' +
                                '</div>' +
                                '<select id="ls-exp-template" class="ls-inp" style="width:100%;font-size:11px">' +
                                    '<option value="">-- Şablon Yükleniyor... --</option>' +
                                '</select>' +
                            '</div>' +
                        '</div>' +

                        '<div style="display:flex;gap:8px">' +
                            '<div style="flex:1">' +
                                '<span class="ls-label">⏱️ Keşif Saati</span>' +
                                '<select id="ls-exp-holding" class="ls-inp" style="width:100%">' +
                                    '<option value="1">1 Saat</option>' +
                                    '<option value="2">2 Saat</option>' +
                                    '<option value="3">3 Saat</option>' +
                                    '<option value="4">4 Saat</option>' +
                                    '<option value="5">5 Saat</option>' +
                                '</select>' +
                            '</div>' +
                            '<div style="flex:1">' +
                                '<span class="ls-label">⚡ Sürat (Hız)</span>' +
                                '<select id="ls-exp-speed" class="ls-inp" style="width:100%">' +
                                    '<option value="100">%100</option>' +
                                    '<option value="90">%90</option>' +
                                    '<option value="80">%80</option>' +
                                    '<option value="70">%70</option>' +
                                    '<option value="60">%60</option>' +
                                    '<option value="50">%50</option>' +
                                '</select>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ls-coll-card" style="background:#101b2b;border:1px dashed #2c3e50;flex:1;min-height:60px;display:flex;flex-direction:column">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
                            '<span style="font-size:11px;font-weight:bold;color:#d1d8e0">🧭 Rota Dağılımı Önizlemesi:</span>' +
                            '<span id="ls-exp-total-steps" style="font-size:10.5px;color:#bb86fc;font-weight:bold">0 Sefer</span>' +
                        '</div>' +
                        '<div id="ls-exp-preview-list" style="font-size:10.5px;color:#8899aa;font-family:monospace;line-height:1.4;flex:1;overflow-y:auto;padding-right:4px">' +
                            '(Başlangıç koordinatı ve sefer sayısını girin)' +
                        '</div>' +
                    '</div>' +

                    '<button id="ls-exp-start-btn" class="ls-exp-go">🚀 Keşifleri Başlat (Adım Adım)</button>' +
                '</div>' +

                // DEBUG TAB
                '<div id="tc-debug" class="ls-tc">' +
                    // 2-COLUMN HEADER: DEBUG LOGS (LEFT) & TRACE LOGS (RIGHT)
                    '<div style="display:flex;gap:6px;margin-bottom:6px;flex-shrink:0">' +
                        // SOL KART: DEBUG LOGS
                        '<div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:6px 8px">' +
                            '<div style="display:flex;justify-content:space-between;align-items:center">' +
                                '<span style="font-weight:bold;color:#00bcff;font-size:11px;display:flex;align-items:center;gap:4px">' +
                                    '🐞 Debug Logs' +
                                '</span>' +
                                '<label style="position:relative;display:inline-block;width:28px;height:16px;margin:0;cursor:pointer" title="Debug Logs aç/kapat (Uyarı ve Hatalar)">' +
                                    '<input type="checkbox" id="ls-debug-toggle" style="opacity:0;width:0;height:0">' +
                                    '<span class="ls-debug-slider"></span>' +
                                '</label>' +
                            '</div>' +
                            '<div style="font-size:9px;color:#8899aa;margin-top:3px;line-height:1.2">' +
                                'Sistem uyarı & hata kayıtları' +
                            '</div>' +
                        '</div>' +

                        // SAĞ KART: TRACE LOGS
                        '<div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:6px 8px">' +
                            '<div style="display:flex;justify-content:space-between;align-items:center">' +
                                '<span style="font-weight:bold;color:#ff7043;font-size:11px;display:flex;align-items:center;gap:4px">' +
                                    '🎯 Trace Logs' +
                                '</span>' +
                                '<label style="position:relative;display:inline-block;width:28px;height:16px;margin:0;cursor:pointer" title="Trace Logs aç/kapat (Tıklama, sayfa, tuş & yanıtlar)">' +
                                    '<input type="checkbox" id="ls-trace-toggle" style="opacity:0;width:0;height:0">' +
                                    '<span class="ls-debug-slider"></span>' +
                                '</label>' +
                            '</div>' +
                            '<div style="font-size:9px;color:#8899aa;margin-top:3px;line-height:1.2">' +
                                'Tıklama, tuş & yanıt takibi' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    // BUTONLAR: LOGLARI KOPYALA | TRACE KOPYALA | TEMİZLE | YENİLE
                    '<div style="display:flex;gap:4px;margin-bottom:6px;flex-shrink:0">' +
                        '<button id="ls-debug-copy" class="ls-btn" style="flex:1.1;display:flex;align-items:center;justify-content:center;gap:2px;font-size:10px;padding:4px 4px" title="Filtrelenmiş debug loglarını panoya kopyalar">📋 Logları Kopyala</button>' +
                        '<button id="ls-trace-copy" class="ls-btn" style="flex:1.1;background:#ff5722;color:#fff;display:flex;align-items:center;justify-content:center;gap:2px;font-size:10px;padding:4px 4px" title="Kullanıcı eylem akışını (Trace Logs) panoya kopyalar">🎯 Trace Kopyala</button>' +
                        '<button id="ls-debug-clear" class="ls-btn ls-btn-d" style="width:30px;display:flex;align-items:center;justify-content:center;font-size:10px;padding:4px 0" title="Tüm log ve trace kayıtlarını temizler">🗑️</button>' +
                        '<button id="ls-debug-refresh" class="ls-btn" style="width:26px;display:flex;align-items:center;justify-content:center;font-size:10px;padding:4px 0" title="Yenile">🔄</button>' +
                    '</div>' +

                    // MULTI-SELECT FİLTRELER
                    '<div style="display:flex;gap:3px;margin-bottom:6px;flex-wrap:wrap;flex-shrink:0" id="ls-debug-filters">' +
                        '<span class="ls-debug-filter active" data-filter="ALL" title="Tüm kayıtları göster">Tümü</span>' +
                        '<span class="ls-debug-filter" data-filter="TRACE" title="Kullanıcı eylem ve yanıt takibi">🎯 Trace</span>' +
                        '<span class="ls-debug-filter" data-filter="EXPEDITION" title="Keşif modülü kayıtları">🧭 Keşif</span>' +
                        '<span class="ls-debug-filter" data-filter="COLLECTOR" title="Maden toplayıcı modülü kayıtları">📦 Toplayıcı</span>' +
                        '<span class="ls-debug-filter" data-filter="OGAME-AJAX" title="OGame sunucu & AJAX istekleri">🌐 Sunucu/Ajax</span>' +
                        '<span class="ls-debug-filter" data-filter="BRIDGE" title="Oyun içi bridge olayları">⚡ Bridge</span>' +
                        '<span class="ls-debug-filter" data-filter="ERROR" title="Hatalar ve uyarılar">⚠️ Hatalar</span>' +
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
                if (t === 'collector') renderCollector();
                if (t === 'expedition') renderExpedition();
                if (t === 'debug') renderDebugLogs();
                LS_LOGGER.action('UI', 'Sekme değiştirildi: ' + t);
                setTimeout(ensurePanelInView, 20);
            });
        });

        const savedTabEl = document.querySelector('.ls-tab[data-tab="' + activeTab + '"]');
        const savedContentEl = document.getElementById('tc-' + activeTab);
        if (savedTabEl) savedTabEl.classList.add('active');
        if (savedContentEl) savedContentEl.classList.add('active');
        if (activeTab === 'expedition') renderExpedition();
        if (activeTab === 'debug') renderDebugLogs();
        if (!savedTabEl) {
            const first = document.querySelector('.ls-tab');
            if (first) { first.classList.add('active'); document.getElementById('tc-cart').classList.add('active'); }
        }

        const tabsEl = document.getElementById('ls-tabs');
        if (tabsEl) {
            const updateTabsLayout = () => {
                const w = tabsEl.offsetWidth;
                if (w > 0 && w < 440) {
                    tabsEl.classList.add('ls-tabs-stacked');
                } else if (w >= 440) {
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

        initCollectorEvents();
        renderCollector();

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

        // ============================================================
        // DEBUG & TRACE LOGS LOGIC & CONTROLS
        // ============================================================
        function matchesFilters(entry) {
            if (!activeDebugFilters || activeDebugFilters.size === 0 || activeDebugFilters.has('ALL')) {
                return true;
            }

            const hasErrorFilter = activeDebugFilters.has('ERROR');
            const categoryFilters = [];
            activeDebugFilters.forEach(f => {
                if (f !== 'ERROR' && f !== 'ALL') {
                    categoryFilters.push(f);
                }
            });

            const isErrorOrWarn = (entry.level === 'ERROR' || entry.level === 'WARN');

            if (categoryFilters.length > 0 && hasErrorFilter) {
                // Örn: Keşif + Hata -> Kategorisi Keşif olan VE seviyesi Hata/Uyarı olan kayıtlar
                return categoryFilters.includes(entry.cat) && isErrorOrWarn;
            } else if (categoryFilters.length > 0) {
                // Seçilen kategorilerden birine uyan kayıtlar
                return categoryFilters.includes(entry.cat);
            } else if (hasErrorFilter) {
                // Yalnızca hata veya uyarı olan tüm kayıtlar
                return isErrorOrWarn;
            }

            return true;
        }

        function copyTextToClipboard(text, onSuccess, onError) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallback(text));
            } else {
                fallback(text);
            }

            function fallback(t) {
                const ta = document.createElement('textarea');
                ta.value = t;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    if (typeof onSuccess === 'function') onSuccess();
                } catch (e) {
                    if (typeof onError === 'function') onError();
                }
                document.body.removeChild(ta);
            }
        }

        function renderDebugLogs() {
            const consoleEl = document.getElementById('ls-debug-console');
            const countEl = document.getElementById('ls-debug-count');
            const debugStatusEl = document.getElementById('ls-debug-status');
            const traceStatusEl = document.getElementById('ls-trace-status');
            const debugToggleEl = document.getElementById('ls-debug-toggle');
            const traceToggleEl = document.getElementById('ls-trace-toggle');
            if (!consoleEl) return;

            const debugOn = LS_LOGGER.isDebugEnabled();
            const traceOn = LS_LOGGER.isTraceEnabled();

            if (debugToggleEl) debugToggleEl.checked = debugOn;
            if (traceToggleEl) traceToggleEl.checked = traceOn;

            if (debugStatusEl) {
                debugStatusEl.textContent = debugOn ? '● Debug: Açık' : '○ Debug: Kapalı';
                debugStatusEl.style.color = debugOn ? '#2ecc71' : '#8899aa';
            }
            if (traceStatusEl) {
                traceStatusEl.textContent = traceOn ? '● Trace: Açık' : '○ Trace: Kapalı';
                traceStatusEl.style.color = traceOn ? '#ff7043' : '#8899aa';
            }

            const allLogs = LS_LOGGER.getLogs();
            const filteredLogs = allLogs.filter(matchesFilters);

            if (countEl) {
                countEl.textContent = `${filteredLogs.length} / ${allLogs.length} kayıt`;
            }

            if (allLogs.length === 0) {
                let emptyMsg = 'Debug ve Trace modları kapalı.<br>Yukarıdaki switch\'leri açarak hareketleri, tıklamaları ve hataları anbean kaydetmeye başlayabilirsiniz.';
                if (debugOn && traceOn) {
                    emptyMsg = 'Debug ve Trace açık. Eklentiyi veya oyunu kullanırken tüm hareketler burada listelenecektir.';
                } else if (debugOn) {
                    emptyMsg = 'Sadece Debug Logs açık. Yalnızca hata ve uyarı kayıtları listelenecektir.';
                } else if (traceOn) {
                    emptyMsg = 'Sadece Trace Logs açık. Tıklama, tuş, sayfa geçişleri ve oyun yanıtları listelenecektir.';
                }
                consoleEl.innerHTML = `<div style="color:#6e7681;padding:15px;text-align:center;font-style:italic">${emptyMsg}</div>`;
                return;
            }

            const catColors = {
                'TRACE': '#ff7043',
                'EXPEDITION': '#bb86fc',
                'COLLECTOR': '#00bcff',
                'OGAME-AJAX': '#2ecc71',
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
                return `<div style="margin-bottom:3px;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.03)"><span style="color:${streamColor};font-weight:bold">[${streamTag}]</span> <span style="color:#6e7681">[${entry.time}]</span> <span style="color:${catColor};font-weight:bold">[${entry.cat}]</span> <span style="color:${lvlColor};font-weight:bold">[${entry.level}]</span> <span style="color:#e6edf3">${escapedMsg}</span>${dataPart}</div>`;
            }).join('');

            consoleEl.innerHTML = html;
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }

        onDebugLiveUpdate = function(entry) {
            if (activeTab === 'debug') {
                renderDebugLogs();
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

        const debugClearBtn = document.getElementById('ls-debug-clear');
        if (debugClearBtn) {
            debugClearBtn.addEventListener('click', () => {
                LS_LOGGER.clearLogs();
                LS_TRACER.clearTraces();
                renderDebugLogs();
            });
        }

        const debugRefreshBtn = document.getElementById('ls-debug-refresh');
        if (debugRefreshBtn) {
            debugRefreshBtn.addEventListener('click', () => {
                renderDebugLogs();
            });
        }

        const debugCopyBtn = document.getElementById('ls-debug-copy');
        if (debugCopyBtn) {
            debugCopyBtn.addEventListener('click', () => {
                const logs = LS_LOGGER.getLogs().filter(matchesFilters);
                if (!logs || logs.length === 0) {
                    debugCopyBtn.textContent = '⚠️ Log Yok';
                    setTimeout(() => { debugCopyBtn.textContent = '📋 Logları Kopyala'; }, 1500);
                    return;
                }
                const now = new Date();
                const nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
                let out = '==================================================\n' +
                          '  LuckyStrike OGame Helper v10.1 - Sistem & Eylem Logları\n' +
                          '  Tarih: ' + nowStr + '\n' +
                          '  URL: ' + window.location.href + '\n' +
                          '  Filtre: ' + Array.from(activeDebugFilters).join(', ') + '\n' +
                          '  Toplam Kayıt: ' + logs.length + '\n' +
                          '==================================================\n\n';
                logs.forEach(l => {
                    const sTag = l.stream || (l.cat === 'TRACE' ? 'TRACE' : 'DEBUG');
                    out += `[${sTag}] [${l.time}] [${l.cat}] [${l.level}] ${l.msg}\n`;
                    if (l.data) out += `    Data: ${l.data}\n`;
                });
                out += '\n==================================================\n' +
                       '  Log Sonu\n' +
                       '==================================================\n';

                copyTextToClipboard(out, () => {
                    debugCopyBtn.textContent = '✅ Kopyalandı!';
                    setTimeout(() => { debugCopyBtn.textContent = '📋 Logları Kopyala'; }, 2000);
                }, () => {
                    debugCopyBtn.textContent = '❌ Başarısız';
                    setTimeout(() => { debugCopyBtn.textContent = '📋 Logları Kopyala'; }, 2000);
                });
            });
        }

        const traceCopyBtn = document.getElementById('ls-trace-copy');
        if (traceCopyBtn) {
            traceCopyBtn.addEventListener('click', () => {
                const traces = LS_TRACER.getTraces();
                if (!traces || traces.length === 0) {
                    traceCopyBtn.textContent = '⚠️ Trace Yok';
                    setTimeout(() => { traceCopyBtn.textContent = '🎯 Trace Kopyala'; }, 1500);
                    return;
                }
                const now = new Date();
                const nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
                let out = '==================================================\n' +
                          '  🎯 LuckyStrike OGame Helper v10.1 - Trace Logs\n' +
                          '  (Kullanıcı Eylem & Oyun Yanıt Akışı)\n' +
                          '  Tarih: ' + nowStr + '\n' +
                          '  URL: ' + window.location.href + '\n' +
                          '  Toplam Eylem: ' + traces.length + '\n' +
                          '==================================================\n\n';
                traces.forEach(t => {
                    out += `[TRACE] [${t.time}] [${t.type}] ${t.summary}\n`;
                    if (t.details) {
                        const dStr = typeof t.details === 'object' ? JSON.stringify(t.details, null, 2) : String(t.details);
                        out += `  Detay: ${dStr.split('\n').join('\n  ')}\n`;
                    }
                    out += '\n';
                });
                out += '==================================================\n' +
                       '  Trace Sonu\n' +
                       '==================================================\n';

                copyTextToClipboard(out, () => {
                    traceCopyBtn.textContent = '✅ Kopyalandı!';
                    setTimeout(() => { traceCopyBtn.textContent = '🎯 Trace Kopyala'; }, 2000);
                }, () => {
                    traceCopyBtn.textContent = '❌ Başarısız';
                    setTimeout(() => { traceCopyBtn.textContent = '🎯 Trace Kopyala'; }, 2000);
                });
            });
        }

        // Multi-Select Filter Listeners
        document.querySelectorAll('#ls-debug-filters .ls-debug-filter').forEach(f => {
            f.addEventListener('click', () => {
                const filterTag = f.getAttribute('data-filter') || 'ALL';

                if (filterTag === 'ALL') {
                    activeDebugFilters.clear();
                    activeDebugFilters.add('ALL');
                } else {
                    activeDebugFilters.delete('ALL');
                    if (activeDebugFilters.has(filterTag)) {
                        activeDebugFilters.delete(filterTag);
                    } else {
                        activeDebugFilters.add(filterTag);
                    }
                    if (activeDebugFilters.size === 0) {
                        activeDebugFilters.add('ALL');
                    }
                }

                // Butonların görsel aktiflik durumunu güncelle
                document.querySelectorAll('#ls-debug-filters .ls-debug-filter').forEach(el => {
                    const tag = el.getAttribute('data-filter') || 'ALL';
                    if (activeDebugFilters.has(tag)) {
                        el.classList.add('active');
                    } else {
                        el.classList.remove('active');
                    }
                });

                renderDebugLogs();
            });
        });

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
    updateActivePlanetCache();
    checkAndRunCollectorAssistant();
    checkAndRunExpeditionAssistant();
    scanAndSaveExpeditionTemplates();
    console.log(LS, 'LuckyStrike OGame Helper v10.0 hazır!');

})();
