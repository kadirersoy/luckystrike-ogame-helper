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

    function selectExpeditionTemplateMain(d) {
        var targetName = d.name ? String(d.name).trim().toLowerCase() : '';
        var targetId = d.id;

        var found = findExpeditionSelect(targetName);
        var sel = found ? found.sel : document.querySelector('select#expeditionfleet, select[name="expeditionfleet"]');
        var val = '';
        if (found) {
            val = sel.options[found.idx].value;
            sel.selectedIndex = found.idx;
        } else if (sel && targetId) {
            val = targetId;
        }

        // 1) OGame özel dropdown listesindeki anchor'a tıkla
        var clicked = false;
        var anchors = Array.prototype.slice.call(document.querySelectorAll('ul a, ul li, .dropdownList a')).filter(function (a) {
            return !isLsNode(a) && (a.textContent || '').trim().toLowerCase() === targetName;
        });
        if (anchors.length > 0) {
            var clickEl = anchors[0].tagName === 'A' ? anchors[0] : (anchors[0].querySelector('a') || anchors[0]);
            realClick(clickEl);
            clicked = true;
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

        if (window.fleetDispatcher && typeof window.fleetDispatcher.standardFleetSelected === 'function') {
            try { window.fleetDispatcher.standardFleetSelected(val || targetId); } catch(e) {}
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
                bridgeLog('ACTION', 'BRIDGE', 'Hedef koordinat ayarlandı: [' + d.g + ':' + d.s + ':' + d.p + '] Tip: ' + targetType);
                var changed = false;
                if (window.$) {
                    var $g = $('#galaxy, input[name="galaxy"]');
                    var $s = $('#system, input[name="system"]');
                    var $p = $('#position, input[name="position"]');
                    var $t = $('#type, input[name="type"]');

                    if (d.g && $g.length && String($g.val()).trim() !== String(d.g).trim()) { $g.val(d.g); changed = true; }
                    if (d.s && $s.length && String($s.val()).trim() !== String(d.s).trim()) { $s.val(d.s); changed = true; }
                    if (d.p && $p.length && String($p.val()).trim() !== String(d.p).trim()) { $p.val(d.p); changed = true; }
                    if ($t.length && String($t.val()).trim() !== String(targetType).trim()) { $t.val('' + targetType); changed = true; }

                    if (targetType === 3) {
                        var $m = $('#mbutton, #fleet2 #mbutton, [data-type="3"], [data-planet-type="3"], a.moon');
                        if ($m.length && !$m.hasClass('selected') && !$m.hasClass('active')) {
                            $m.trigger('click');
                            changed = true;
                        }
                    } else {
                        var $pb = $('#pbutton, #fleet2 #pbutton, [data-type="1"], [data-planet-type="1"], a.planet');
                        if ($pb.length && !$pb.hasClass('selected') && !$pb.hasClass('active')) {
                            $pb.trigger('click');
                            changed = true;
                        }
                    }

                    if (changed) {
                        if (window.fleetDispatcher && typeof window.fleetDispatcher.updateTarget === 'function') {
                            window.fleetDispatcher.updateTarget();
                        } else {
                            if ($p.length) $p.trigger('change');
                        }
                    }
                }
            } else if (d.type === 'SELECT_MISSION') {
                var missionId = parseInt(d.missionId, 10) || 3;
                bridgeLog('ACTION', 'BRIDGE', 'Görev seçildi: ID ' + missionId);
                if (window.fleetDispatcher && typeof window.fleetDispatcher.selectMission === 'function') {
                    window.fleetDispatcher.selectMission(missionId);
                }
                if (window.$) {
                    $('#missionButton' + missionId + ', [data-mission="' + missionId + '"]').trigger('click');
                }
            } else if (d.type === 'SUBMIT_FLEET1') {
                bridgeLog('ACTION', 'BRIDGE', 'SUBMIT_FLEET1 tetiklendi.');
                if (window.fleetDispatcher && typeof window.fleetDispatcher.trySubmitFleet1 === 'function') {
                    window.fleetDispatcher.trySubmitFleet1();
                } else if (window.$) {
                    $('#continueToFleet2, button.continue, a.continue').trigger('click');
                }
            } else if (d.type === 'SUBMIT_FLEET2') {
                bridgeLog('DISPATCH', 'BRIDGE', 'SUBMIT_FLEET2 tetiklendi.');
                if (d.hours) {
                    var finalH = parseInt(d.hours, 10);
                    if (finalH) {
                        var finalHStr = '' + finalH;
                        if (window.fleetDispatcher) {
                            try { window.fleetDispatcher.expeditionTime = finalH; } catch(e) {}
                            try { window.fleetDispatcher.holdingTime = finalH; } catch(e) {}
                            try { window.fleetDispatcher.holdingOrExpTime = finalH; } catch(e) {}
                            if (typeof window.fleetDispatcher.setExpeditionTime === 'function') {
                                try { window.fleetDispatcher.setExpeditionTime(finalH); } catch(e) {}
                            }
                            if (typeof window.fleetDispatcher.setHoldingTime === 'function') {
                                try { window.fleetDispatcher.setHoldingTime(finalH); } catch(e) {}
                            }
                        }
                        var e1 = document.getElementById('expeditiontime');
                        if (e1) e1.value = finalHStr;
                        var e2 = document.getElementById('holdingOrExpTime');
                        if (e2) e2.value = finalHStr;
                        var e3 = document.getElementById('holdingtime');
                        if (e3) e3.value = finalHStr;

                        if (window.$) {
                            try { $('#expeditiontime, select[name="expeditiontime"]').val(finalHStr).trigger('change'); } catch(e) {}
                            try { $('#holdingtime, select[name="holdingtime"]').val(finalHStr).trigger('change'); } catch(e) {}
                            try { $('#holdingOrExpTime, input[name="holdingOrExpTime"]').val(finalHStr).trigger('change'); } catch(e) {}
                        }
                    }
                }
                if (d.speed) {
                    var finalSp = parseInt(d.speed, 10) || 100;
                    if (window.fleetDispatcher) {
                        try { window.fleetDispatcher.speed = finalSp; } catch(e) {}
                        if (typeof window.fleetDispatcher.setSpeed === 'function') {
                            try { window.fleetDispatcher.setSpeed(finalSp); } catch(e) {}
                        }
                    }
                }
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
                if (!submitted && window.$ && $('#sendFleet').length) {
                    bridgeLog('DISPATCH', 'BRIDGE', '$("#sendFleet").trigger("click") çağrıldı.');
                    $('#sendFleet').trigger('click');
                }
            } else if (d.type === 'FILL_RESOURCES') {
                bridgeLog('ACTION', 'BRIDGE', 'Kaynaklar dolduruldu: M:' + (d.m||0) + ' C:' + (d.c||0) + ' D:' + (d.d||0));
                if (window.$) {
                    var mEl = $('#metal, input[name="metal"]');
                    var cEl = $('#crystal, input[name="crystal"]');
                    var dEl = $('#deuterium, input[name="deuterium"]');
                    if (mEl.length) mEl.val(d.m || 0).trigger('input').trigger('change').trigger('keyup');
                    if (cEl.length) cEl.val(d.c || 0).trigger('input').trigger('change').trigger('keyup');
                    if (dEl.length) dEl.val(d.d || 0).trigger('input').trigger('change').trigger('keyup');
                }
                if (window.fleetDispatcher) {
                    if (typeof window.fleetDispatcher.cargoCalculation === 'function') window.fleetDispatcher.cargoCalculation();
                    if (typeof window.fleetDispatcher.refresh === 'function') window.fleetDispatcher.refresh();
                }
            } else if (d.type === 'CARGO_REFRESH') {
                bridgeLog('ACTION', 'BRIDGE', 'Kargo hesaplaması yenilendi.');
                if (window.fleetDispatcher) {
                    if (typeof window.fleetDispatcher.cargoCalculation === 'function') window.fleetDispatcher.cargoCalculation();
                    if (typeof window.fleetDispatcher.refresh === 'function') window.fleetDispatcher.refresh();
                }
            } else if (d.type === 'SELECT_TEMPLATE') {
                bridgeLog('ACTION', 'BRIDGE', 'Şablon seçiliyor: ' + (d.name || d.id));
                selectExpeditionTemplateMain(d);
            } else if (d.type === 'SET_SPEED') {
                var speedVal = parseInt(d.speed, 10) || 100;
                var stepVal = Math.round(speedVal / 10);
                bridgeLog('ACTION', 'BRIDGE', 'Hız ayarlandı: %' + speedVal);
                if (window.fleetDispatcher) {
                    if (typeof window.fleetDispatcher.setSpeed === 'function') {
                        try { window.fleetDispatcher.setSpeed(speedVal); } catch(e) {}
                        if (window.fleetDispatcher.speed === undefined || window.fleetDispatcher.speed !== speedVal) {
                            try { window.fleetDispatcher.setSpeed(stepVal); } catch(e) {}
                        }
                    }
                    try { window.fleetDispatcher.speed = speedVal; } catch(e) {}
                }
                if (window.$) {
                    var $container = $('#speedPercentage, #fleet2 #speedPercentage, #fleet2 .steps, .steps');
                    var $step = $container.find('[data-step="' + speedVal + '"], [data-step="' + stepVal + '"], li[data-step="' + speedVal + '"], li[data-step="' + stepVal + '"]').not('[data-technology], select, form');
                    if (!$step.length && $container.length) {
                        $container.find('*').not('[data-technology], select, form').filter(function() {
                            return $(this).children().length === 0 && ($(this).text().trim() === '' + speedVal || $(this).text().trim() === speedVal + '%');
                        }).each(function() {
                            $step = $(this);
                            return false;
                        });
                    }
                    if ($step.length) {
                        $step.trigger('mouseover').trigger('mousedown').trigger('mouseup').trigger('click');
                    }
                    var $sp = $('#speedPercentage input[name="speed"], input#speed, #fleet2 input[name="speed"]');
                    if ($sp.length) $sp.val(speedVal).trigger('input').trigger('change');
                }
            } else if (d.type === 'SET_HOLDING_TIME') {
                var hTime = parseInt(d.hours, 10) || 1;
                var hTimeStr = '' + hTime;
                bridgeLog('ACTION', 'BRIDGE', 'Bekleme süresi ayarlandı: ' + hTime + ' saat');

                // 1. window.fleetDispatcher durumunu güncelle
                if (window.fleetDispatcher) {
                    try { window.fleetDispatcher.expeditionTime = hTime; } catch(e) {}
                    try { window.fleetDispatcher.holdingTime = hTime; } catch(e) {}
                    try { window.fleetDispatcher.holdingOrExpTime = hTime; } catch(e) {}
                    if (typeof window.fleetDispatcher.setExpeditionTime === 'function') {
                        try { window.fleetDispatcher.setExpeditionTime(hTime); } catch(e) {}
                    }
                    if (typeof window.fleetDispatcher.setHoldingTime === 'function') {
                        try { window.fleetDispatcher.setHoldingTime(hTime); } catch(e) {}
                    }
                }

                // 2. Doğrudan DOM elemanları (Şablon elemanları KESİNLİKLE HARİÇ TUTULUR)
                var expSel = document.getElementById('expeditiontime') || document.querySelector('select[name="expeditiontime"]');
                if (expSel) {
                    expSel.value = hTimeStr;
                    for (var ei = 0; ei < expSel.options.length; ei++) {
                        if (expSel.options[ei].value === hTimeStr) {
                            expSel.selectedIndex = ei;
                            expSel.options[ei].selected = true;
                            break;
                        }
                    }
                    expSel.dispatchEvent(new Event('input', { bubbles: true }));
                    expSel.dispatchEvent(new Event('change', { bubbles: true }));
                }

                var holdSel = document.getElementById('holdingtime') || document.querySelector('select[name="holdingtime"]');
                if (holdSel) {
                    holdSel.value = hTimeStr;
                    for (var hi = 0; hi < holdSel.options.length; hi++) {
                        if (holdSel.options[hi].value === hTimeStr) {
                            holdSel.selectedIndex = hi;
                            holdSel.options[hi].selected = true;
                            break;
                        }
                    }
                    holdSel.dispatchEvent(new Event('input', { bubbles: true }));
                    holdSel.dispatchEvent(new Event('change', { bubbles: true }));
                }

                var hidInp = document.getElementById('holdingOrExpTime') || document.querySelector('input[name="holdingOrExpTime"]');
                if (hidInp) {
                    hidInp.value = hTimeStr;
                    hidInp.dispatchEvent(new Event('input', { bubbles: true }));
                    hidInp.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // 3. jQuery & Özel OGame Dropdown Tıklamaları
                if (window.$) {
                    var $exp = $('#expeditiontime');
                    if ($exp.length) {
                        $exp.val(hTimeStr).trigger('change').trigger('selectmenuchange');
                        try { $exp.selectmenu('refresh'); } catch(e) {}
                    }
                    var $ht = $('#holdingtime');
                    if ($ht.length) {
                        $ht.val(hTimeStr).trigger('change').trigger('selectmenuchange');
                        try { $ht.selectmenu('refresh'); } catch(e) {}
                    }
                    var $hid = $('#holdingOrExpTime');
                    if ($hid.length) $hid.val(hTimeStr).trigger('change');

                    // jQuery UI selectmenu buton metinlerini güncelle
                    $('#expeditiontime-button .ui-selectmenu-text, #holdingtime-button .ui-selectmenu-text').text(hTimeStr);

                    // OGame özel dropdown menü linklerini tıkla (<a> ve <li>)
                    $('#expeditiontime-menu a, #expeditiontime-menu li, #holdingtime-menu a, #holdingtime-menu li, [id*="expedition"][id*="menu"] a, [id*="expedition"][id*="menu"] li, [id*="holding"][id*="menu"] a, [id*="holding"][id*="menu"] li, #briefing [rel="holdingtime"] li').not('[data-technology], #speedPercentage *').filter(function() {
                        var t = $(this).text().trim();
                        var v = $(this).attr('data-value') || $(this).attr('rel') || $(this).data('value');
                        return t === hTimeStr || String(v) === hTimeStr;
                    }).each(function() {
                        realClick(this);
                    });

                    // Briefing alanındaki satırları ve metinleri güncelle
                    $('#briefing tr, #briefing li, #briefing div, #fleet2 tr, #fleet2 li, #fleet2 div').filter(function() {
                        var txt = ($(this).text() || '').toLowerCase();
                        return txt.indexOf('keşif zamanı') !== -1 || txt.indexOf('haltezeit') !== -1 || txt.indexOf('holding time') !== -1;
                    }).each(function() {
                        var $row = $(this);
                        $row.find('select:not([id*="template" i])').val(hTimeStr).trigger('change').trigger('selectmenuchange');
                        $row.find('.value, span, b').filter(function() {
                            var valTxt = $(this).text().trim();
                            return /^\d+\s*(s|h|saat|hour)?$/i.test(valTxt);
                        }).first().text(hTimeStr + ' s');
                    });
                }
            } else if (d.type === 'SET_EXPEDITION_TARGET') {
                var g = d.g ? String(d.g).trim() : '';
                var s = d.s ? String(d.s).trim() : '';
                bridgeLog('ACTION', 'BRIDGE', 'Keşif hedefi ayarlandı: [' + g + ':' + s + ':16]');

                if (window.$) {
                    var $g = $('#galaxy, input[name="galaxy"]');
                    var $s = $('#system, input[name="system"]');
                    var $p = $('#position, input[name="position"]');
                    var $t = $('#type, input[name="type"]');

                    if ($t.length) $t.val('1').trigger('change');

                    var $pb = $('#pbutton, #fleet2 #pbutton, [data-type="1"], [data-planet-type="1"], a.planet');
                    if ($pb.length && !$pb.hasClass('selected') && !$pb.hasClass('active')) {
                        $pb.trigger('click');
                    }

                    if ($g.length && g) $g.val(g).trigger('input').trigger('change').trigger('keyup');
                    if ($p.length) $p.val('16').trigger('input').trigger('change').trigger('keyup');

                    if ($s.length && s) {
                        var tempS = s.length > 1 ? s.slice(0, -1) : '1';
                        $s.val(tempS).trigger('input').trigger('keyup');
                        setTimeout(function() {
                            $s.val(s).trigger('input').trigger('change').trigger('keyup');
                            if (window.fleetDispatcher) {
                                if (g) window.fleetDispatcher.targetGalaxy = parseInt(g, 10);
                                window.fleetDispatcher.targetSystem = parseInt(s, 10);
                                window.fleetDispatcher.targetPosition = 16;
                                window.fleetDispatcher.targetPlanetType = 1;
                                if (d.isStep2 && typeof window.fleetDispatcher.updateTarget === 'function') {
                                    try { window.fleetDispatcher.updateTarget(); } catch(e) {}
                                }
                            }
                        }, 40);
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
            $(document).ajaxSend(function(event, jqXHR, settings) {
                var isTrace = !!window.LS_TRACE_ENABLED;
                var isDebug = !!window.LS_DEBUG_ENABLED;
                if ((isTrace || isDebug) && settings && settings.url) {
                    var u = settings.url;
                    if (u.indexOf('fleetdispatch') !== -1 || u.indexOf('sendFleet') !== -1 || u.indexOf('checkTarget') !== -1 || u.indexOf('galaxy') !== -1 || u.indexOf('ajax') !== -1) {
                        var cleanUrl = u.split('&_st=')[0];
                        if (isDebug) bridgeLog('INFO', 'AJAX-REQ', '📤 [GİDEN İSTEK] ' + cleanUrl);
                        if (isTrace) bridgeLog('ACTION', 'TRACE', '📤 [SUNUCU İSTEĞİ] ' + cleanUrl);
                    }
                }
            });
            $(document).ajaxComplete(function(event, xhr, settings) {
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
