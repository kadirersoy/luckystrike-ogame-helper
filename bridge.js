// LuckyStrike OGame Helper - Main World Bridge
// Runs in page context (MAIN world) to interact directly with OGame engine without CSP violations.
(function() {
    'use strict';

    function isLsNode(el) {
        return !!(el && el.closest && el.closest('#ls-panel, [id^="ls-"]'));
    }

    function bridgeLog(level, cat, msg, data) {
        try {
            window.dispatchEvent(new CustomEvent('LS_BRIDGE_LOG', {
                detail: {
                    level: level || 'INFO',
                    cat: cat || 'BRIDGE',
                    msg: msg,
                    data: data ? (typeof data === 'object' ? JSON.stringify(data) : String(data)) : null
                }
            }));
        } catch (e) {}
    }

    var isDebugEnabled = false;
    var isTraceEnabled = false;
    var lastFleetSubmitTime = 0;
    var pendingNextUrl = null;
    try {
        isDebugEnabled = (localStorage.getItem('LS_DEBUG_ENABLED') === 'true');
        isTraceEnabled = (localStorage.getItem('LS_TRACE_ENABLED') === 'true');
    } catch (e) {}
    window.LS_DEBUG_ENABLED = isDebugEnabled;
    window.LS_TRACE_ENABLED = isTraceEnabled;

    function findExpeditionSelect(targetName) {
        var all = Array.prototype.slice.call(document.querySelectorAll('select')).filter(function (s) { return !isLsNode(s); });
        var candidates = [];
        all.forEach(function (s) {
            for (var i = 0; i < s.options.length; i++) {
                if ((s.options[i].text || '').trim().toLowerCase() === targetName) {
                    candidates.push({ sel: s, idx: i });
                    break;
                }
            }
        });
        if (candidates.length <= 1) return candidates[0] || null;
        for (var c = 0; c < candidates.length; c++) {
            var p = candidates[c].sel.parentElement;
            for (var depth = 0; p && depth < 5; depth++, p = p.parentElement) {
                var txt = (p.textContent || '').toLowerCase();
                if (txt.indexOf('keşif filosu') !== -1 || txt.indexOf('kesif filosu') !== -1) {
                    if (txt.indexOf('standart filo') === -1) return candidates[c];
                }
            }
        }
        return candidates[candidates.length - 1];
    }

    function realClick(el) {
        if (!el) return;
        var o = { bubbles: true, cancelable: true, view: window };
        try { el.dispatchEvent(new MouseEvent('mouseover', o)); } catch (e) {}
        try { el.dispatchEvent(new MouseEvent('mousedown', o)); } catch (e) {}
        try { el.dispatchEvent(new MouseEvent('mouseup', o)); } catch (e) {}
        try { el.dispatchEvent(new MouseEvent('click', o)); } catch (e) {}
    }

    function syncFleetDispatcherState() {
        try {
            if (window.fleetDispatcher) {
                var cur = (window.fleetDispatcher.busyFleets !== undefined && window.fleetDispatcher.busyFleets !== null)
                    ? window.fleetDispatcher.busyFleets
                    : (window.fleetDispatcher.currentFleets || 0);
                var max = window.fleetDispatcher.maxFleets || 0;
                if (max > 0) {
                    document.body.dataset.lsCurrentFleets = String(cur);
                    document.body.dataset.lsMaxFleets = String(max);
                }
                var expCur = (window.fleetDispatcher.busyExpeditions !== undefined && window.fleetDispatcher.busyExpeditions !== null)
                    ? window.fleetDispatcher.busyExpeditions
                    : (window.fleetDispatcher.currentExpeditions || 0);
                var expMax = window.fleetDispatcher.maxExpeditions || 0;
                if (expMax > 0) {
                    document.body.dataset.lsCurrentExpeditions = String(expCur);
                    document.body.dataset.lsMaxExpeditions = String(expMax);
                }
                if (window.fleetDispatcher.targetPlanetType !== undefined && window.fleetDispatcher.targetPlanetType !== null) {
                    document.body.dataset.lsTargetPlanetType = String(window.fleetDispatcher.targetPlanetType);
                }
                if (window.fleetDispatcher.mission !== undefined && window.fleetDispatcher.mission !== null) {
                    document.body.dataset.lsSelectedMission = String(window.fleetDispatcher.mission);
                }
            }
        } catch (e) {}
    }

    try {
        syncFleetDispatcherState();
        setInterval(syncFleetDispatcherState, 1500);
    } catch (e) {}

    function selectExpeditionTemplateMain(d) {
        var targetName = d.name ? String(d.name).trim().toLowerCase() : '';
        var targetId = d.id;

        var found = findExpeditionSelect(targetName);
        var sel = found ? found.sel : document.querySelector('select#expeditionFleetTemplateSelect, select#expeditionfleet, select[name="expeditionFleetTemplateSelect"], select[name="expeditionfleet"]');
        var val = '';
        if (found) {
            val = sel.options[found.idx].value;
            sel.selectedIndex = found.idx;
        } else if (sel && targetId) {
            val = targetId;
        }

        // 1) OGame expedition fleet dropdown listesindeki anchor'a tıkla
        var expMenu = document.getElementById('expeditionFleetTemplateSelect-menu') || document.getElementById('expeditionfleet-menu') || document.querySelector('[aria-labelledby*="expedition" i]');
        var anchors = [];
        if (expMenu) {
            anchors = Array.prototype.slice.call(expMenu.querySelectorAll('a, li')).filter(function (a) {
                return !isLsNode(a) && (a.textContent || '').trim().toLowerCase() === targetName;
            });
        }
        if (anchors.length === 0) {
            anchors = Array.prototype.slice.call(document.querySelectorAll('.changeExpeditionFleet')).filter(function (a) {
                return !isLsNode(a) && (a.textContent || '').trim().toLowerCase() === targetName;
            });
        }
        if (anchors.length > 0) {
            var clickEl = anchors[0].tagName === 'A' ? anchors[0] : (anchors[0].querySelector('a') || anchors[0]);
            realClick(clickEl);
        }

        if (sel && val) {
            sel.value = val;
            if (window.$) {
                try { window.$(sel).val(val).trigger('change'); } catch (e) {}
                try { window.$(sel).selectmenu('refresh'); } catch (e) {}
            } else {
                sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        if (window.fleetDispatcher) {
            if (typeof window.fleetDispatcher.standardFleetSelected === 'function') {
                try { window.fleetDispatcher.standardFleetSelected(val || targetId); } catch(e) {}
            }
            if (typeof window.fleetDispatcher.expeditionFleetSelected === 'function') {
                try { window.fleetDispatcher.expeditionFleetSelected(val || targetId); } catch(e) {}
            }
            if (typeof window.fleetDispatcher.updateFleet === 'function') {
                try { window.fleetDispatcher.updateFleet(); } catch(e) {}
            }
            if (typeof window.fleetDispatcher.refresh === 'function') {
                try { window.fleetDispatcher.refresh(); } catch(e) {}
            }
        }
    }

    window.addEventListener('LS_PAGE_ACTION', function(e) {
        try {
            var d = e.detail;
            if (!d || !d.type) return;

            if (d.type === 'SET_DEBUG_MODE') {
                window.LS_DEBUG_ENABLED = !!d.enabled;
                bridgeLog('ACTION', 'BRIDGE', 'Debug Logs modu: ' + (window.LS_DEBUG_ENABLED ? 'AÇIK' : 'KAPALI'));
                return;
            }
            if (d.type === 'SET_TRACE_MODE') {
                window.LS_TRACE_ENABLED = !!d.enabled;
                bridgeLog('ACTION', 'BRIDGE', 'Trace Logs modu: ' + (window.LS_TRACE_ENABLED ? 'AÇIK' : 'KAPALI'));
                return;
            }

            if (d.type === 'SELECT_SHIP') {
                bridgeLog('ACTION', 'BRIDGE', 'Gemi seçimi: ' + d.shipId + ', Adet: ' + d.amount);
                if (window.fleetDispatcher && typeof window.fleetDispatcher.selectShip === 'function') {
                    window.fleetDispatcher.selectShip(d.shipId, d.amount);
                    if (typeof window.fleetDispatcher.refresh === 'function') window.fleetDispatcher.refresh();
                }
                if (window.$) {
                    var $el = $('[data-technology="' + d.shipId + '"] input, input[name="am' + d.shipId + '"]');
                    if ($el.length) {
                        $el.val('' + d.amount).trigger('input').trigger('change').trigger('keyup');
                    }
                }
            } else if (d.type === 'SET_TARGET') {
                var targetType = parseInt(d.targetType, 10) || 1;
                bridgeLog('ACTION', 'BRIDGE', 'Hedef koordinat ayarlanıyor: [' + d.g + ':' + d.s + ':' + d.p + '] Tip: ' + targetType);
                if (window.$) {
                    var $g = $('#galaxy, input[name="galaxy"], #galaxyInput');
                    var $s = $('#system, input[name="system"], #systemInput');
                    var $p = $('#position, input[name="position"], #positionInput');
                    var $t = $('#type, input[name="type"]');

                    if ($g.length && d.g && String($g.val()).trim() !== String(d.g).trim()) $g.val(d.g).trigger('input').trigger('change').trigger('keyup');
                    if ($s.length && d.s && String($s.val()).trim() !== String(d.s).trim()) $s.val(d.s).trigger('input').trigger('change').trigger('keyup');
                    if ($p.length && d.p && String($p.val()).trim() !== String(d.p).trim()) $p.val(d.p).trigger('input').trigger('change').trigger('keyup');
                    if ($t.length && String($t.val()).trim() !== String(targetType).trim()) $t.val('' + targetType).trigger('input').trigger('change');

                    var isCheckPending = (document.body.dataset.lsTargetCheckPending === 'true');

                    if (targetType === 3) {
                        var $m = $('#mbutton');
                        if (!$m.length) $m = $('#fleet2 #mbutton, [data-type="3"], [data-planet-type="3"]').first();
                        if ($m.length && !$m.hasClass('moon_selected') && !$m.hasClass('selected') && !$m.parent().hasClass('moon_selected')) {
                            if (!isCheckPending) {
                                realClick($m[0]);
                            }
                        }
                    } else if (targetType === 2) {
                        var $d = $('#dbutton');
                        if (!$d.length) $d = $('#fleet2 #dbutton, [data-type="2"], [data-planet-type="2"]').first();
                        if ($d.length && !$d.hasClass('debris_selected') && !$d.hasClass('selected') && !$d.parent().hasClass('debris_selected')) {
                            if (!isCheckPending) {
                                realClick($d[0]);
                            }
                        }
                    } else {
                        var $pb = $('#pbutton');
                        if (!$pb.length) $pb = $('#fleet2 #pbutton, [data-type="1"], [data-planet-type="1"]').first();
                        if ($pb.length && !$pb.hasClass('planet_selected') && !$pb.hasClass('selected') && !$pb.parent().hasClass('planet_selected')) {
                            if (!isCheckPending) {
                                realClick($pb[0]);
                            }
                        }
                    }

                    if (window.fleetDispatcher) {
                        if (d.g) window.fleetDispatcher.targetGalaxy = parseInt(d.g, 10);
                        if (d.s) window.fleetDispatcher.targetSystem = parseInt(d.s, 10);
                        if (d.p) window.fleetDispatcher.targetPosition = parseInt(d.p, 10);
                        window.fleetDispatcher.targetPlanetType = targetType;
                        try {
                            if (typeof window.fleetDispatcher.selectPlanetType === 'function') {
                                window.fleetDispatcher.selectPlanetType(targetType);
                            }
                            if (typeof window.fleetDispatcher.setTargetPlanetType === 'function') {
                                window.fleetDispatcher.setTargetPlanetType(targetType);
                            }
                            if (typeof window.fleetDispatcher.updateTarget === 'function') {
                                window.fleetDispatcher.updateTarget();
                            }
                            // Concurrent checkTarget önleme: Sunucu kontrolü zaten devredeyse tekrar sorma
                            if (document.body.dataset.lsTargetCheckPending !== 'true' && typeof window.fleetDispatcher.checkTarget === 'function') {
                                window.fleetDispatcher.checkTarget();
                            }
                        } catch (err) {}
                    }
                    syncFleetDispatcherState();
                }
            } else if (d.type === 'SELECT_ALL_RESOURCES') {
                var deuReserve = Math.max(0, parseInt(d.deuReserve, 10) || 0);
                bridgeLog('ACTION', 'BRIDGE', 'Tüm kaynaklar yerel olarak seçiliyor (#allresources), Deu Rezerv: ' + deuReserve);
                if (window.fleetDispatcher && typeof window.fleetDispatcher.selectAllResources === 'function') {
                    try { window.fleetDispatcher.selectAllResources(); } catch(e) {}
                }
                var allBtn = document.getElementById('allresources') || document.querySelector('a#allresources, .sendall, .allresources, [data-action="allresources"], .ogl-resources-all, .ogl-all-resources');
                if (allBtn) {
                    realClick(allBtn);
                }
                if (deuReserve > 0) {
                    setTimeout(function() {
                        var $d = $('#deuterium, input[name="deuterium"]');
                        if ($d.length) {
                            var currentVal = parseInt(String($d.val()).replace(/[^0-9]/g, ''), 10) || 0;
                            var targetVal = Math.max(0, currentVal - deuReserve);
                            $d.val(targetVal).trigger('input').trigger('change').trigger('keyup').trigger('blur');
                            if (window.fleetDispatcher) {
                                try { window.fleetDispatcher.cargoDeuterium = targetVal; } catch(e) {}
                                if (typeof window.fleetDispatcher.cargoCalculation === 'function') {
                                    try { window.fleetDispatcher.cargoCalculation(); } catch(e) {}
                                }
                            }
                        }
                    }, 50);
                }
            } else if (d.type === 'SELECT_MISSION') {
                var missionId = parseInt(d.missionId, 10) || 3;
                if (document.body.dataset.lsTargetCheckPending === 'true') {
                    bridgeLog('WARN', 'BRIDGE', 'SELECT_MISSION ertelendi (checkTarget devam ediyor).');
                    return;
                }
                var $mBtn = $('#missionButton' + missionId + ', [data-mission="' + missionId + '"]');
                var $li = $mBtn.closest('li');
                if ($li.hasClass('off') || $li.hasClass('disabled') || $mBtn.hasClass('off') || $mBtn.hasClass('disabled')) {
                    return;
                }
                if ($mBtn.hasClass('selected') || $mBtn.hasClass('active') || $li.hasClass('selected') || $li.hasClass('active')) {
                    return;
                }
                bridgeLog('ACTION', 'BRIDGE', 'Görev seçildi: ID ' + missionId);
                if (window.fleetDispatcher && typeof window.fleetDispatcher.selectMission === 'function') {
                    window.fleetDispatcher.selectMission(missionId);
                }
                if (window.$ && $mBtn.length) {
                    realClick($mBtn[0]);
                }
                syncFleetDispatcherState();
            } else if (d.type === 'SUBMIT_FLEET1') {
                bridgeLog('ACTION', 'BRIDGE', 'SUBMIT_FLEET1 tetiklendi.');
                if (window.fleetDispatcher && typeof window.fleetDispatcher.trySubmitFleet1 === 'function') {
                    window.fleetDispatcher.trySubmitFleet1();
                } else if (window.$) {
                    $('#continueToFleet2, button.continue, a.continue').trigger('click');
                }
            } else if (d.type === 'SUBMIT_FLEET2') {
                var now = Date.now();
                if (now - lastFleetSubmitTime < 1500) {
                    bridgeLog('WARN', 'BRIDGE', 'SUBMIT_FLEET2 engellendi (çift gönderim koruması).');
                    return;
                }
                lastFleetSubmitTime = now;
                pendingNextUrl = d.nextUrl || null;
                bridgeLog('DISPATCH', 'BRIDGE', 'SUBMIT_FLEET2 tetiklendi. Sonraki URL: ' + (pendingNextUrl || 'Yok'));
                var submitted = false;
                if (window.fleetDispatcher) {
                    if (typeof window.fleetDispatcher.trySubmitFleet2 === 'function') {
                        bridgeLog('DISPATCH', 'BRIDGE', 'fleetDispatcher.trySubmitFleet2() çağrıldı.');
                        window.fleetDispatcher.trySubmitFleet2();
                        submitted = true;
                    } else if (typeof window.fleetDispatcher.submitFleet2 === 'function') {
                        bridgeLog('DISPATCH', 'BRIDGE', 'fleetDispatcher.submitFleet2() çağrıldı.');
                        window.fleetDispatcher.submitFleet2();
                        submitted = true;
                    } else if (typeof window.fleetDispatcher.sendFleet === 'function') {
                        bridgeLog('DISPATCH', 'BRIDGE', 'fleetDispatcher.sendFleet() çağrıldı.');
                        window.fleetDispatcher.sendFleet();
                        submitted = true;
                    }
                }
                var $sf = $('#sendFleet, a#sendFleet, .btn_blue#sendFleet, button#sendFleet, .ogl-send-fleet');
                if (!submitted && $sf.length) {
                    bridgeLog('DISPATCH', 'BRIDGE', '$("#sendFleet").trigger("click") çağrıldı.');
                    realClick($sf[0]);
                    try { $sf.trigger('click'); } catch(e) {}
                    submitted = true;
                }
                setTimeout(syncFleetDispatcherState, 300);
            } else if (d.type === 'FILL_RESOURCES') {
                var mVal = Math.max(0, parseInt(d.m, 10) || 0);
                var cVal = Math.max(0, parseInt(d.c, 10) || 0);
                var dVal = Math.max(0, parseInt(d.d, 10) || 0);
                bridgeLog('ACTION', 'BRIDGE', 'Kaynaklar dolduruldu: M:' + mVal + ' C:' + cVal + ' D:' + dVal);
                if (window.$) {
                    var mEl = $('#metal, input[name="metal"]');
                    var cEl = $('#crystal, input[name="crystal"]');
                    var dEl = $('#deuterium, input[name="deuterium"]');
                    if (mEl.length) mEl.val(mVal).trigger('input').trigger('change').trigger('keyup').trigger('blur');
                    if (cEl.length) cEl.val(cVal).trigger('input').trigger('change').trigger('keyup').trigger('blur');
                    if (dEl.length) dEl.val(dVal).trigger('input').trigger('change').trigger('keyup').trigger('blur');
                }
                if (window.fleetDispatcher) {
                    try {
                        window.fleetDispatcher.cargoMetal = mVal;
                        window.fleetDispatcher.cargoCrystal = cVal;
                        window.fleetDispatcher.cargoDeuterium = dVal;
                    } catch(e) {}
                    if (typeof window.fleetDispatcher.cargoCalculation === 'function') {
                        try { window.fleetDispatcher.cargoCalculation(); } catch(e) {}
                    }
                }
            } else if (d.type === 'CARGO_REFRESH') {
                bridgeLog('ACTION', 'BRIDGE', 'Kargo hesaplaması yenilendi.');
                if (window.fleetDispatcher) {
                    if (typeof window.fleetDispatcher.cargoCalculation === 'function') window.fleetDispatcher.cargoCalculation();
                }
            } else if (d.type === 'SCAN_TEMPLATES') {
                var templates = [];
                try {
                    // SADECE ve SADECE Keşif filosu select'ini tara (Asla #standardfleet veya genel select'leri tarama!)
                    var selects = Array.prototype.slice.call(document.querySelectorAll('select#expeditionFleetTemplateSelect, select[name="expeditionFleetTemplateSelect"], select#expeditionfleet, select[name="expeditionfleet"]')).filter(function(s) { return !isLsNode(s); });
                    if (selects.length === 0) {
                        var allSel = Array.prototype.slice.call(document.querySelectorAll('select')).filter(function(s) { return !isLsNode(s); });
                        selects = allSel.filter(function(s) {
                            var p = s.parentElement;
                            for (var d = 0; p && d < 4; d++, p = p.parentElement) {
                                var txt = (p.textContent || '').toLowerCase();
                                if ((txt.indexOf('keşif filosu') !== -1 || txt.indexOf('kesif filosu') !== -1) && txt.indexOf('standart') === -1) {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }
                    selects.forEach(function(sel) {
                        for (var i = 0; i < sel.options.length; i++) {
                            var opt = sel.options[i];
                            var txt = (opt.text || opt.textContent || '').trim();
                            var val = opt.value || i;
                            var lower = txt.toLowerCase();
                            if (txt && txt !== '-' && txt !== '0' && txt !== '--' && lower !== 'seçiniz' && lower !== 'şablon seçin' && lower !== '-- şablon seçin --') {
                                if (lower.indexOf('standart') === -1 && lower.indexOf('standard') === -1 && lower.indexOf('keşif filosu') === -1 && lower.indexOf('kesif filosu') === -1 && lower.indexOf('pompalamasyon') === -1) {
                                    if (!templates.some(function(t) { return t.name.toLowerCase() === lower; })) {
                                        templates.push({ id: val, name: txt });
                                    }
                                }
                            }
                        }
                    });
                    if (window.$) {
                        // Sadece expedition fleet menüsünü tara, asla genel menüleri veya standardfleet menüsünü tarama!
                        $('#expeditionFleetTemplateSelect-menu li, #expeditionfleet-menu li, [aria-labelledby*="expedition" i] li, .changeExpeditionFleet').each(function() {
                            var txt = $(this).text().trim();
                            var val = $(this).data('value') || $(this).attr('data-id') || $(this).attr('id');
                            var lower = txt.toLowerCase();
                            if (txt && txt !== '-' && txt !== '0' && txt.length > 1 && txt.indexOf('(') === -1) {
                                if (lower.indexOf('standart') === -1 && lower.indexOf('standard') === -1 && lower.indexOf('keşif filosu') === -1 && lower.indexOf('kesif filosu') === -1 && lower !== 'seçiniz' && lower !== 'şablon seçin' && lower !== '-- şablon seçin --' && lower.indexOf('pompalamasyon') === -1) {
                                    if (!templates.some(function(t) { return t.name.toLowerCase() === lower; })) {
                                        templates.push({ id: val || txt, name: txt });
                                    }
                                }
                            }
                        });
                    }
                } catch (e) {}
                if (templates.length > 0) {
                    bridgeLog('INFO', 'BRIDGE', 'Şablonlar MAIN world köprüsünden tarandı (' + templates.length + ' adet).');
                    window.dispatchEvent(new CustomEvent('LS_TEMPLATES_SCANNED', {
                        detail: { templates: templates }
                    }));
                }
            } else if (d.type === 'SELECT_TEMPLATE') {
                bridgeLog('ACTION', 'BRIDGE', 'Şablon seçiliyor: ' + (d.name || d.id));
                selectExpeditionTemplateMain(d);

            } else if (d.type === 'SET_EXPEDITION_TARGET') {
                var g = d.g ? String(d.g).trim() : '';
                var s = d.s ? String(d.s).trim() : '';
                bridgeLog('ACTION', 'BRIDGE', 'Keşif hedefi ayarlandı: [' + g + ':' + s + ':16]');

                if (window.$) {
                    var $g = $('#galaxy, input[name="galaxy"]');
                    var $s = $('#system, input[name="system"]');
                    var $p = $('#position, input[name="position"]');
                    var $t = $('#type, input[name="type"]');

                    if ($t.length && $t.val() !== '1') $t.val('1').trigger('change');

                    var $pb = $('#pbutton, #fleet2 #pbutton, [data-type="1"], [data-planet-type="1"], a.planet');
                    if ($pb.length && !$pb.hasClass('selected') && !$pb.hasClass('active') && !$pb.hasClass('planet_selected')) {
                        $pb.trigger('click');
                    }

                    if ($g.length && g && $g.val() !== g) $g.val(g).trigger('input').trigger('change').trigger('keyup');
                    if ($p.length && $p.val() !== '16') $p.val('16').trigger('input').trigger('change').trigger('keyup');

                    if ($s.length && s) {
                        var curS = $s.val();
                        if (curS !== s) {
                            $s.val(s).trigger('input').trigger('change').trigger('keyup');
                        }
                        if (window.fleetDispatcher) {
                            if (g) window.fleetDispatcher.targetGalaxy = parseInt(g, 10);
                            window.fleetDispatcher.targetSystem = parseInt(s, 10);
                            window.fleetDispatcher.targetPosition = 16;
                            window.fleetDispatcher.targetPlanetType = 1;
                            if (d.isStep2 && typeof window.fleetDispatcher.updateTarget === 'function') {
                                try { window.fleetDispatcher.updateTarget(); } catch(e) {}
                            }
                            if (d.isStep2 && document.body.dataset.lsTargetCheckPending !== 'true' && typeof window.fleetDispatcher.checkTarget === 'function') {
                                try { window.fleetDispatcher.checkTarget(); } catch(e) {}
                            }
                        }
                    }
                }
            }
        } catch (e) {}
    });

    // Intercept OGame AJAX when debug or trace is enabled
    function attachAjaxListeners() {
        if (!window.$ && !window.jQuery) {
            setTimeout(attachAjaxListeners, 200);
            return;
        }
        var $ = window.$ || window.jQuery;
        try {
            // OGame jQuery UI selectmenu değişikliklerini yerel DOM eventine ilet
            $(document).on('selectmenuchange selectmenuselect', 'select', function(e) {
                if (isLsNode(this)) {
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            var targetCheckTimer = null;

            // sendFleet yönlendirme kancası: OGame'in native redirectUrl'sini sonraki hedefe bağla
            if (typeof $.ajaxPrefilter === 'function') {
                $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                    if (options.url && options.url.indexOf('sendFleet') !== -1) {
                        var origSuccess = options.success;
                        options.success = function(data, textStatus, xhr) {
                            if (pendingNextUrl && data && typeof data === 'object') {
                                bridgeLog('ACTION', 'BRIDGE', 'sendFleet başarılı. OGame redirectUrl sonraki hedefe uyarlandı: ' + pendingNextUrl);
                                if ('redirectUrl' in data) {
                                    data.redirectUrl = pendingNextUrl;
                                }
                            }
                            if (typeof origSuccess === 'function') {
                                origSuccess.apply(this, arguments);
                            }
                        };
                    }
                });
            }

            $(document).ajaxSend(function(event, jqXHR, settings) {
                var isTrace = !!window.LS_TRACE_ENABLED;
                var isDebug = !!window.LS_DEBUG_ENABLED;
                if (settings && settings.url) {
                    var u = settings.url;
                    if (u.indexOf('checkTarget') !== -1) {
                        document.body.dataset.lsTargetCheckPending = 'true';
                        if (targetCheckTimer) clearTimeout(targetCheckTimer);
                        targetCheckTimer = setTimeout(function() {
                            document.body.dataset.lsTargetCheckPending = 'false';
                        }, 1500);
                    }
                    if (u.indexOf('sendFleet') !== -1) {
                        document.body.dataset.lsSendFleetPending = 'true';
                    }
                    if ((isTrace || isDebug) && (u.indexOf('fleetdispatch') !== -1 || u.indexOf('sendFleet') !== -1 || u.indexOf('checkTarget') !== -1 || u.indexOf('galaxy') !== -1 || u.indexOf('ajax') !== -1)) {
                        var cleanUrl = u.split('&_st=')[0];
                        if (isDebug) bridgeLog('INFO', 'AJAX-REQ', '📤 [GİDEN İSTEK] ' + cleanUrl);
                        if (isTrace) bridgeLog('ACTION', 'TRACE', '📤 [SUNUCU İSTEĞİ] ' + cleanUrl);
                    }
                }
            });
            $(document).ajaxComplete(function(event, xhr, settings) {
                if (settings && settings.url) {
                    var u = settings.url;
                    if (u.indexOf('checkTarget') !== -1) {
                        if (targetCheckTimer) clearTimeout(targetCheckTimer);
                        document.body.dataset.lsTargetCheckPending = 'false';
                        document.body.dataset.lsTargetCheckSuccess = (xhr && xhr.status === 200) ? 'true' : 'false';
                        document.body.dataset.lsTargetCheckTimestamp = String(Date.now());
                        try {
                            window.dispatchEvent(new CustomEvent('LS_TARGET_CHECK_COMPLETE', {
                                detail: {
                                    status: xhr ? xhr.status : 0,
                                    responseText: xhr ? xhr.responseText : ''
                                }
                            }));
                        } catch (e) {}
                    }
                    if (u.indexOf('sendFleet') !== -1) {
                        document.body.dataset.lsSendFleetPending = 'false';
                        document.body.dataset.lsSendFleetSuccess = (xhr && xhr.status === 200) ? 'true' : 'false';
                        document.body.dataset.lsSendFleetTimestamp = String(Date.now());
                        try {
                            window.dispatchEvent(new CustomEvent('LS_SEND_FLEET_COMPLETE', {
                                detail: {
                                    status: xhr ? xhr.status : 0,
                                    responseText: xhr ? xhr.responseText : '',
                                    nextUrl: pendingNextUrl
                                }
                            }));
                        } catch (e) {}

                        // Sonraki hedefe doğrudan geçiş garantisi (eski gezegenin ara sekme gibi yüklenmesini önler)
                        if (pendingNextUrl && xhr && xhr.status === 200) {
                            var dest = pendingNextUrl;
                            pendingNextUrl = null;
                            setTimeout(function() {
                                if (window.location.href.indexOf(dest) === -1) {
                                    bridgeLog('ACTION', 'BRIDGE', 'ajaxComplete: Sonraki hedefe yönlendiriliyor -> ' + dest);
                                    window.location.href = dest;
                                }
                            }, 50);
                        }
                    }
                }
                if (settings && settings.url && (settings.url.indexOf('eventList') !== -1 || settings.url.indexOf('component=eventList') !== -1)) {
                    if (xhr && xhr.responseText) {
                        try {
                            window.dispatchEvent(new CustomEvent('LS_EVENT_LIST_RECEIVED', {
                                detail: { html: xhr.responseText }
                            }));
                        } catch (e) {}
                    }
                }
                if (settings && settings.url && (
                    settings.url.indexOf('galaxyContent') !== -1 ||
                    settings.url.indexOf('component=galaxy') !== -1 ||
                    settings.url.indexOf('page=galaxy') !== -1
                )) {
                    try {
                        window.dispatchEvent(new CustomEvent('LS_GALAXY_AJAX_COMPLETE', {
                            detail: {
                                url: settings.url,
                                data: settings.data || '',
                                responseText: xhr ? xhr.responseText : ''
                            }
                        }));
                    } catch (e) {}
                }
                var isTrace = !!window.LS_TRACE_ENABLED;
                var isDebug = !!window.LS_DEBUG_ENABLED;
                if ((isTrace || isDebug) && settings && settings.url) {
                    var u = settings.url;
                    if (u.indexOf('fleetdispatch') !== -1 || u.indexOf('sendFleet') !== -1 || u.indexOf('checkTarget') !== -1 || u.indexOf('galaxy') !== -1 || u.indexOf('ajax') !== -1) {
                        var cleanUrl = u.split('&_st=')[0];
                        var snippet = '';
                        try {
                            snippet = (xhr.responseText || '').substring(0, 160);
                        } catch (e) {}
                        if (isDebug) bridgeLog(xhr.status === 200 ? 'INFO' : 'WARN', 'AJAX-RESP', '📥 [GELEN YANIT (' + xhr.status + ')] ' + cleanUrl, snippet);
                        if (isTrace) bridgeLog('INFO', 'TRACE', '📥 [SUNUCU YANITI (' + xhr.status + ')] ' + cleanUrl, snippet);
                    }
                }
            });
            $(document).ajaxError(function(event, xhr, settings, thrownError) {
                var isTrace = !!window.LS_TRACE_ENABLED;
                var isDebug = !!window.LS_DEBUG_ENABLED;
                if (isTrace || isDebug) {
                    var cleanUrl = (settings && settings.url) ? settings.url.split('&_st=')[0] : 'URL bilinmiyor';
                    if (isDebug) bridgeLog('ERROR', 'AJAX-RESP', '❌ [SUNUCU HATASI] ' + cleanUrl + ' | ' + thrownError);
                    if (isTrace) bridgeLog('ERROR', 'TRACE', '❌ [SUNUCU HATASI] ' + cleanUrl + ' | ' + thrownError);
                }
            });
        } catch (e) {}
    }
    attachAjaxListeners();
})();
