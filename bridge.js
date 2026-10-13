// LuckyStrike OGame Helper - Main World Bridge
// Runs in page context (MAIN world) to interact directly with OGame engine without CSP violations.
(function() {
    'use strict';

    window.addEventListener('LS_PAGE_ACTION', function(e) {
        try {
            var d = e.detail;
            if (!d || !d.type) return;

            if (d.type === 'SELECT_SHIP') {
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
                if (window.fleetDispatcher && typeof window.fleetDispatcher.selectMission === 'function') {
                    window.fleetDispatcher.selectMission(missionId);
                }
                if (window.$) {
                    $('#missionButton' + missionId + ', [data-mission="' + missionId + '"]').trigger('click');
                }
            } else if (d.type === 'SUBMIT_FLEET1') {
                if (window.fleetDispatcher && typeof window.fleetDispatcher.trySubmitFleet1 === 'function') {
                    window.fleetDispatcher.trySubmitFleet1();
                } else if (window.$) {
                    $('#continueToFleet2, button.continue, a.continue').trigger('click');
                }
            } else if (d.type === 'SUBMIT_FLEET2') {
                if (window.fleetDispatcher) {
                    if (typeof window.fleetDispatcher.trySubmitFleet2 === 'function') {
                        window.fleetDispatcher.trySubmitFleet2();
                    } else if (typeof window.fleetDispatcher.submitFleet2 === 'function') {
                        window.fleetDispatcher.submitFleet2();
                    } else if (typeof window.fleetDispatcher.sendFleet === 'function') {
                        window.fleetDispatcher.sendFleet();
                    }
                }
                if (window.$ && $('#sendFleet').length) {
                    $('#sendFleet').trigger('click');
                }
            } else if (d.type === 'FILL_RESOURCES') {
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
                if (window.fleetDispatcher) {
                    if (typeof window.fleetDispatcher.cargoCalculation === 'function') window.fleetDispatcher.cargoCalculation();
                    if (typeof window.fleetDispatcher.refresh === 'function') window.fleetDispatcher.refresh();
                }
            }
        } catch (e) {}
    });
})();
