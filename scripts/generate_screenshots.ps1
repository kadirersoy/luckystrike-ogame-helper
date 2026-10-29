param(
    [string]$Tab = "all",
    [string]$Lang = "all"
)

$ErrorActionPreference = "Stop"
$projectRoot = "D:\_Antigravity\OGame"
$screenshotsDir = "$projectRoot\screenshots"
$enScreenshotsDir = "$screenshotsDir\en"
if (-not (Test-Path $enScreenshotsDir)) {
    New-Item -ItemType Directory -Path $enScreenshotsDir -Force | Out-Null
}

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$allTabs = @("cart", "collector", "courier", "debris", "expedition", "scanner", "finder", "alarm", "kmcost", "settings")
$tabs = if ($Tab -eq "all" -or [string]::IsNullOrWhiteSpace($Tab)) { 
    $allTabs 
} else { 
    $cleanTab = $Tab.ToLower().Replace("tab_", "").Trim()
    if ($allTabs -contains $cleanTab) { @($cleanTab) } else { 
        Write-Error "Invalid tab '$Tab'. Allowed: $($allTabs -join ', ')"
    }
}

$targetLangs = switch ($Lang.ToLower()) {
    "tr" { @("tr") }
    "en" { @("en") }
    "all" { @("tr", "en") }
    default { @("tr", "en") }
}

$htmlTemplate = @'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>LuckyStrike Screenshots Renderer</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 30px;
            background: #080c14;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #ls-panel {
            position: relative !important;
            bottom: auto !important;
            right: auto !important;
            display: flex !important;
            width: 440px !important;
            min-height: 520px !important;
            max-height: none !important;
            box-shadow: 0 16px 48px rgba(0,0,0,0.9), 0 0 24px rgba(0, 188, 255, 0.15) !important;
            border: 1px solid #1a2c3f !important;
            border-radius: 8px !important;
        }
        #ls-body {
            overflow: visible !important;
            max-height: none !important;
        }
        .ls-coll-list, #ls-cart-list, #ls-debris-list, #ls-cour-list {
            max-height: 340px !important;
        }
    </style>
</head>
<body>
    __PLANET_LIST_HTML__

    <div id="resources_metal" style="display:none">2.450.000</div>
    <div id="resources_crystal" style="display:none">1.120.000</div>
    <div id="resources_deuterium" style="display:none">890.000</div>
    <div id="attack_alert" class="soon attack" style="display:none"></div>

    <script>
        const TARGET_TAB = "__TARGET_TAB__";
        const TARGET_LANG = "__TARGET_LANG__";

        if (TARGET_TAB !== 'alarm') {
            document.getElementById('attack_alert').className = 'noAttack';
        }

        localStorage.setItem('LS_ACTIVE_TAB', TARGET_TAB);
        localStorage.setItem('LS_LANGUAGE', TARGET_LANG);
        localStorage.setItem('LS_THEME', 'dark');
        localStorage.setItem('LS_PANEL_OPACITY', '100');
        localStorage.setItem('LS_PANEL_OPEN', 'true');
        localStorage.setItem('LS_TECH_CACHE', JSON.stringify({ ts: Date.now(), hyperspace: 12, combustion: 15, impulse: 13 }));

        const cartItems = (TARGET_LANG === 'en') ? [
            { id: '1', name: 'Metal Mine', level: 35, planet: 'Main Planet', coords: '1:20:5', type: 1, metal: 35200000, crystal: 8800000, deuterium: 0, count: 1 },
            { id: '2', name: 'Crystal Mine', level: 30, planet: 'Colony Alpha', coords: '1:20:6', type: 1, metal: 18400000, crystal: 9200000, deuterium: 0, count: 1 },
            { id: '3', name: 'Astrophysics', level: 17, planet: 'Main Planet', coords: '1:20:5', type: 1, metal: 24000000, crystal: 48000000, deuterium: 24000000, count: 1 }
        ] : [
            { id: '1', name: 'Metal Madeni', level: 35, planet: 'Ana Gezegen', coords: '1:20:5', type: 1, metal: 35200000, crystal: 8800000, deuterium: 0, count: 1 },
            { id: '2', name: 'Kristal Madeni', level: 30, planet: 'Koloni Alfa', coords: '1:20:6', type: 1, metal: 18400000, crystal: 9200000, deuterium: 0, count: 1 },
            { id: '3', name: 'Astrofizik', level: 17, planet: 'Ana Gezegen', coords: '1:20:5', type: 1, metal: 24000000, crystal: 48000000, deuterium: 24000000, count: 1 }
        ];
        localStorage.setItem('LS_COST_CART', JSON.stringify(cartItems));

        localStorage.setItem('LS_DEBRIS_SETTINGS', JSON.stringify({ enabled: true, minDebris: 100000, sound: 'sonar_deep' }));
        localStorage.setItem('LS_DEBRIS_LIST', JSON.stringify([
            { id: '1:455:8', g: 1, s: 455, p: 8, metal: 145000, crystal: 86400, deut: 0, total: 231400, recyclers: 12 },
            { id: '1:457:16', g: 1, s: 457, p: 16, metal: 45000, crystal: 120000, deut: 0, total: 165000, recyclers: 9 },
            { id: '2:14:8', g: 2, s: 14, p: 8, metal: 850000, crystal: 420000, deut: 12000, total: 1282000, recyclers: 65 }
        ]));

        localStorage.setItem('LS_PLANET_CACHE', JSON.stringify({
            '101': { metal: 4500000, crystal: 2100000, deuterium: 1800000 },
            '102': { metal: 120000, crystal: 850000, deuterium: 2500000 },
            '103': { metal: 3200000, crystal: 1400000, deuterium: 950000 },
            '104': { metal: 45000, crystal: 310000, deuterium: 1200000 },
            '105': { metal: 1800000, crystal: 920000, deuterium: 610000 },
            '106': { metal: 5100000, crystal: 3200000, deuterium: 2400000 },
            '107': { metal: 80000, crystal: 650000, deuterium: 3100000 }
        }));

        const courierOriginName = (TARGET_LANG === 'en') ? 'Main Planet' : 'Ana Gezegen';
        localStorage.setItem('LS_COURIER_SETTINGS', JSON.stringify({
            originId: '101',
            originCoord: '1:20:5',
            originType: 1,
            originName: courierOriginName,
            mission: 3,
            priorityMode: 'speed',
            selectedShips: { bn: true, kn: true, rehber: false },
            syncEnabled: true,
            syncAmount: { met: 2000000, cri: 1000000, deu: 500000 },
            selectedItems: { '103': true, '104': true, '105': true, '106': true, '107': true },
            targets: {
                '103': { met: 2000000, cri: 1000000, deu: 500000 },
                '104': { met: 1000000, cri: 500000, deu: 250000 },
                '105': { met: 2000000, cri: 1000000, deu: 500000 },
                '106': { met: 3000000, cri: 1500000, deu: 800000 },
                '107': { met: 1500000, cri: 750000, deu: 400000 }
            }
        }));

        const collectorTargetName = (TARGET_LANG === 'en') ? 'Main Planet ( Moon )' : 'Ana Gezegen ( Ay )';
        localStorage.setItem('LS_COLLECTOR_SETTINGS', JSON.stringify({
            targetId: '102',
            targetCoord: '1:20:5',
            targetType: 3,
            targetName: collectorTargetName,
            mission: 3,
            priorityMode: 'speed',
            selectedShips: { bn: true, kn: true, rehber: false },
            selectedRes: { met: true, cri: true, deu: true },
            selectedItems: { '101': true, '103': true, '104': true, '105': true, '106': true, '107': true },
            reserves: { '101': 250000, '103': 250000, '104': 100000, '105': 250000, '106': 250000, '107': 100000 }
        }));

        localStorage.setItem('LS_EXPEDITION_SETTINGS', JSON.stringify({
            startCoord: '1:20:16',
            count: 6,
            template: 'tpl1'
        }));

        const expTemplates = (TARGET_LANG === 'en') ? [
            { id: 'tpl1', name: 'Fast Expedition (300 Pathfinder, 1 Espionage Probe)' },
            { id: 'tpl2', name: 'Heavy Expedition (500 Battleship, 200 Recycler)' }
        ] : [
            { id: 'tpl1', name: 'H\u0131zl\u0131 Ke\u015Fif (300 Rehber, 1 Casus)' },
            { id: 'tpl2', name: 'A\u011F\u0131r Ke\u015Fif (500 Komuta, 200 GD)' }
        ];
        localStorage.setItem('LS_EXPEDITION_TEMPLATES', JSON.stringify(expTemplates));

        if (TARGET_TAB === 'alarm') {
            const mockAttacks = (TARGET_LANG === 'en') ? [
                { id: 'att-1', mission: '1', countdownText: '13h 42m 40s', arrivalTime: '07:01:27', originCoords: '5:261:5', originPlanetName: 'KIRINSHIKATO', originType: 'moon', attackerPlayerName: 'LordVader', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 53112, isEspionage: false },
                { id: 'att-2', mission: '1', countdownText: '14h 56m 48s', arrivalTime: '08:15:35', originCoords: '6:266:5', originPlanetName: 'Colony', originType: 'planet', attackerPlayerName: 'LordVader', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 57553, isEspionage: false },
                { id: 'att-3', mission: '1', countdownText: '1d 14h 5m', arrivalTime: '07:24:35', originCoords: '6:165:6', originPlanetName: 'AIRKOTRY2', originType: 'planet', attackerPlayerName: 'LordVader', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 13201, isEspionage: false }
            ] : [
                { id: 'att-1', mission: '1', countdownText: '13s 42dk 40sn', arrivalTime: '07:01:27', originCoords: '5:261:5', originPlanetName: 'K\u0130R\u0130NSH\u0130KATO', originType: 'moon', attackerPlayerName: 'LordVader', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 53112, isEspionage: false },
                { id: 'att-2', mission: '1', countdownText: '14s 56dk 48sn', arrivalTime: '08:15:35', originCoords: '6:266:5', originPlanetName: 'S\u00F6m\u00FCrge', originType: 'planet', attackerPlayerName: 'LordVader', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 57553, isEspionage: false },
                { id: 'att-3', mission: '1', countdownText: '1g 14s 5dk', arrivalTime: '07:24:35', originCoords: '6:165:6', originPlanetName: 'AIRKOTRY2', originType: 'planet', attackerPlayerName: 'LordVader', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 13201, isEspionage: false }
            ];
            sessionStorage.setItem('LS_ACTIVE_ATTACKS', JSON.stringify(mockAttacks));
            localStorage.setItem('LS_MUTED_ATTACKS', JSON.stringify(['att-3']));
            sessionStorage.setItem('LS_THREAT_STATE', JSON.stringify({
                type: 'attack',
                signature: 'ATT:att-1,att-2,att-3',
                muted: false,
                playedOnce: true,
                lastPlayTime: Date.now()
            }));
        }
    </script>

    <script src="../content.js"></script>

    <script>
        const btn = document.querySelector(`.ls-tab[data-tab="${TARGET_TAB}"]`);
        if (btn) btn.click();

        if (TARGET_TAB === 'expedition') {
            const startInp = document.getElementById('ls-exp-start-coord');
            if (startInp) startInp.value = '1:20:16';
            const countInp = document.getElementById('ls-exp-count');
            if (countInp) countInp.value = '6';
            const tplSelect = document.getElementById('ls-exp-template');
            if (tplSelect) {
                if (TARGET_LANG === 'en') {
                    tplSelect.innerHTML = '<option value="tpl1" selected>\uD83D\uDE80 Fast Expedition (300 Pathfinder, 1 Espionage Probe)</option><option value="tpl2">\uD83D\uDEE1\uFE0F Heavy Expedition (500 Battleship, 200 Recycler)</option>';
                } else {
                    tplSelect.innerHTML = '<option value="tpl1" selected>\uD83D\uDE80 H\u0131zl\u0131 Ke\u015Fif (300 Rehber, 1 Casus)</option><option value="tpl2">\uD83D\uDEE1\uFE0F A\u011F\u0131r Ke\u015Fif (500 Komuta, 200 GD)</option>';
                }
            }
            const previewList = document.getElementById('ls-exp-preview-list');
            const totalSteps = document.getElementById('ls-exp-total-steps');
            if (totalSteps) totalSteps.textContent = (TARGET_LANG === 'en') ? '6 Missions' : '6 Sefer';
            if (previewList) {
                if (TARGET_LANG === 'en') {
                    previewList.innerHTML = 
                        '<div style="margin-bottom:3px">Mission 1: [1:20:16] <span style="color:#00bcff">(Own System)</span></div>' +
                        '<div style="margin-bottom:3px">Mission 2: [1:21:16] <span style="color:#2ecc71">(+1 System)</span></div>' +
                        '<div style="margin-bottom:3px">Mission 3: [1:19:16] <span style="color:#2ecc71">(-1 System)</span></div>' +
                        '<div style="margin-bottom:3px">Mission 4: [1:22:16] <span style="color:#f39c12">(+2 Systems)</span></div>' +
                        '<div style="margin-bottom:3px">Mission 5: [1:18:16] <span style="color:#f39c12">(-2 Systems)</span></div>' +
                        '<div style="margin-bottom:3px">Mission 6: [1:23:16] <span style="color:#f39c12">(+3 Systems)</span></div>';
                } else {
                    previewList.innerHTML = 
                        '<div style="margin-bottom:3px">1. Sefer: [1:20:16] <span style="color:#00bcff">(Kendi Sistemi)</span></div>' +
                        '<div style="margin-bottom:3px">2. Sefer: [1:21:16] <span style="color:#2ecc71">(+1 Sistem)</span></div>' +
                        '<div style="margin-bottom:3px">3. Sefer: [1:19:16] <span style="color:#2ecc71">(-1 Sistem)</span></div>' +
                        '<div style="margin-bottom:3px">4. Sefer: [1:22:16] <span style="color:#f39c12">(+2 Sistem)</span></div>' +
                        '<div style="margin-bottom:3px">5. Sefer: [1:18:16] <span style="color:#f39c12">(-2 Sistem)</span></div>' +
                        '<div style="margin-bottom:3px">6. Sefer: [1:23:16] <span style="color:#f39c12">(+3 Sistem)</span></div>';
                }
            }
        }

        if (TARGET_TAB === 'scanner') {
            const statusBox = document.getElementById('ls-scan-status');
            if (statusBox) {
                if (TARGET_LANG === 'en') {
                    statusBox.innerHTML = 
                        '<span style="color:#2ecc71">\u2714 Universe Data Fresh</span> \u00B7 <span>38,450 Planets Cached</span><br>' +
                        '<span style="color:#8899aa;font-size:9.5px">Last Update: Today 21:00 (Cache: 24h)</span>';
                } else {
                    statusBox.innerHTML = 
                        '<span style="color:#2ecc71">\u2714 Evren Verisi G\u00FCncel</span> \u00B7 <span>38.450 Gezegen Kay\u0131tl\u0131</span><br>' +
                        '<span style="color:#8899aa;font-size:9.5px">Son G\u00FCncelleme: Bug\u00FCn 21:00 (\u00D6nbellek: 24 Saat)</span>';
                }
            }
            const resBox = document.getElementById('ls-scan-results-box');
            if (resBox) resBox.style.display = 'flex';
            const resultsEl = document.getElementById('ls-scan-results');
            const btnText = (TARGET_LANG === 'en') ? 'Go to Galaxy' : 'Galaksiye Git';
            const tag8Text = (TARGET_LANG === 'en') ? 'Slot 8 (Max Metal)' : 'Slot 8 (Maks Metal)';
            const tag15Text = (TARGET_LANG === 'en') ? 'Slot 15 (Max Deut)' : 'Slot 15 (Maks Deuterium)';
            if (resultsEl) {
                resultsEl.innerHTML = 
                    '<div class="ls-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-left:3px solid #00bcff;margin-bottom:4px">' +
                        '<div><b style="color:#00bcff;font-family:monospace">[1:45:8]</b> <span style="font-size:10px;color:#2ecc71;background:rgba(46,204,113,0.12);padding:1px 4px;border-radius:3px">' + tag8Text + '</span></div>' +
                        '<button class="ls-btn-sm" style="background:#1a2c3f;color:#00bcff;border:1px solid #2c3e50;padding:2px 6px">' + btnText + '</button>' +
                    '</div>' +
                    '<div class="ls-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-left:3px solid #00bcff;margin-bottom:4px">' +
                        '<div><b style="color:#00bcff;font-family:monospace">[1:52:8]</b> <span style="font-size:10px;color:#2ecc71;background:rgba(46,204,113,0.12);padding:1px 4px;border-radius:3px">' + tag8Text + '</span></div>' +
                        '<button class="ls-btn-sm" style="background:#1a2c3f;color:#00bcff;border:1px solid #2c3e50;padding:2px 6px">' + btnText + '</button>' +
                    '</div>' +
                    '<div class="ls-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-left:3px solid #2ecc71;margin-bottom:4px">' +
                        '<div><b style="color:#2ecc71;font-family:monospace">[1:64:15]</b> <span style="font-size:10px;color:#ffbe3b;background:rgba(255,190,59,0.12);padding:1px 4px;border-radius:3px">' + tag15Text + '</span></div>' +
                        '<button class="ls-btn-sm" style="background:#1a2c3f;color:#00bcff;border:1px solid #2c3e50;padding:2px 6px">' + btnText + '</button>' +
                    '</div>';
            }
        }

        if (TARGET_TAB === 'finder') {
            const searchInp = document.getElementById('ls-find-q');
            if (searchInp) searchInp.value = 'Imperator';
            const statusBox = document.getElementById('ls-find-cache-info');
            if (statusBox) {
                if (TARGET_LANG === 'en') {
                    statusBox.innerHTML = 
                        '<span style="color:#2ecc71">\u2714 Player Data Ready</span> \u00B7 <span>1,840 Players Cached</span>';
                } else {
                    statusBox.innerHTML = 
                        '<span style="color:#2ecc71">\u2714 Oyuncu Verisi Haz\u0131r</span> \u00B7 <span>1.840 Oyuncu Kay\u0131tl\u0131</span>';
                }
            }
            const resultsEl = document.getElementById('ls-find-results');
            const rankLabel = (TARGET_LANG === 'en') ? 'Rank: #14' : 'S\u0131ralama: #14';
            const mainBaseLabel = (TARGET_LANG === 'en') ? '\uD83E\uDE90 Main Base:' : '\uD83E\uDE90 Ana \u00DCs:';
            const moonLabel = (TARGET_LANG === 'en') ? '\uD83C\uDF15 Moon:' : '\uD83C\uDF15 Ay:';
            const col1Label = (TARGET_LANG === 'en') ? '\uD83E\uDE90 Colony 1:' : '\uD83E\uDE90 Koloni 1:';
            const col2Label = (TARGET_LANG === 'en') ? '\uD83E\uDE90 Colony 2:' : '\uD83E\uDE90 Koloni 2:';
            if (resultsEl) {
                resultsEl.innerHTML = 
                    '<div style="background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:8px 10px;margin-bottom:6px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<b style="color:#00bcff;font-size:12px">Imperator <span style="color:#8899aa;font-weight:normal">[DOMIN]</span></b>' +
                            '<span style="font-size:10px;color:#2ecc71;background:rgba(46,204,113,0.15);padding:2px 6px;border-radius:3px">' + rankLabel + '</span>' +
                        '</div>' +
                        '<div style="font-size:10.5px;color:#8899aa;display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
                            '<div>' + mainBaseLabel + ' <span style="color:#ffbe3b;font-family:monospace">[1:120:4]</span></div>' +
                            '<div>' + moonLabel + ' <span style="color:#ffbe3b;font-family:monospace">[1:120:4]</span></div>' +
                            '<div>' + col1Label + ' <span style="color:#ffbe3b;font-family:monospace">[1:240:8]</span></div>' +
                            '<div>' + col2Label + ' <span style="color:#ffbe3b;font-family:monospace">[2:45:9]</span></div>' +
                        '</div>' +
                    '</div>';
            }
        }

        if (TARGET_TAB === 'alarm') {
            const atkAudio = document.getElementById('ls-alarm-att-sound');
            if (atkAudio) atkAudio.value = 'klaxon';
            const espAudio = document.getElementById('ls-alarm-esp-sound');
            if (espAudio) espAudio.value = 'sonar_hunter';
            const dToggle = document.getElementById('ls-alarm-desktop-toggle');
            if (dToggle) dToggle.checked = true;
            const aToggle = document.getElementById('ls-alarm-att-toggle');
            if (aToggle) aToggle.checked = true;
            const eToggle = document.getElementById('ls-alarm-esp-toggle');
            if (eToggle) eToggle.checked = true;

            const mockAttacks = (TARGET_LANG === 'en') ? [
                { id: 'att-1', mission: '1', countdownText: '14h 24m 35s', arrivalTime: '07:01:27', originCoords: '5:261:5', originName: '', attackerName: 'KIRINSHIKATO', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 53112, isEspionage: false },
                { id: 'att-2', mission: '1', countdownText: '15h 38m 43s', arrivalTime: '08:15:35', originCoords: '6:266:5', originName: '', attackerName: 'Colony', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 57553, isEspionage: false },
                { id: 'att-3', mission: '1', countdownText: '1d 14h 47m', arrivalTime: '07:24:35', originCoords: '6:165:6', originName: '', attackerName: 'AIRKOTRY2', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 13201, isEspionage: false }
            ] : [
                { id: 'att-1', mission: '1', countdownText: '14s 24dk 35sn', arrivalTime: '07:01:27', originCoords: '5:261:5', originName: '', attackerName: 'KİRİNSHİKATO', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 53112, isEspionage: false },
                { id: 'att-2', mission: '1', countdownText: '15s 38dk 43sn', arrivalTime: '08:15:35', originCoords: '6:266:5', originName: '', attackerName: 'Sömürge', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 57553, isEspionage: false },
                { id: 'att-3', mission: '1', countdownText: '1g 14s 47dk', arrivalTime: '07:24:35', originCoords: '6:165:6', originName: '', attackerName: 'AIRKOTRY2', targetCoords: '5:242:9', targetName: 'FB_521', targetType: 'planet', shipsCount: 13201, isEspionage: false }
            ];

            if (typeof mutedAttackIds !== 'undefined' && mutedAttackIds) {
                mutedAttackIds.clear();
                mutedAttackIds.add('att-3'); // 1 günlük oyalama saldırısı susturulmuş durumda
            }
            if (typeof updateActiveAttacks === 'function') {
                updateActiveAttacks(mockAttacks);
            }
            if (typeof handleThreatState === 'function') {
                handleThreatState(true, false, 'ATT:att-1,att-2,att-3');
            }
        }

        if (TARGET_TAB === 'kmcost') {
            const dEl = document.getElementById('ls-km-d');
            if (dEl) dEl.value = 15;
            const hEl = document.getElementById('ls-km-h');
            if (hEl) hEl.value = 4;
            if (typeof renderKmCost === 'function') renderKmCost();
        }

        if (TARGET_TAB === 'settings') {
            const langSelect = document.getElementById('ls-setting-lang');
            if (langSelect) langSelect.value = TARGET_LANG;
            const dbgT = document.getElementById('ls-debug-toggle');
            if (dbgT) dbgT.checked = true;
            const trcT = document.getElementById('ls-trace-toggle');
            if (trcT) trcT.checked = true;
            const hf = document.getElementById('ls-setting-hover-focus');
            if (hf) hf.checked = true;
            const logsEl = document.getElementById('ls-debug-logs');
            if (logsEl) {
                logsEl.innerHTML = 
                    '<div style="color:#2ecc71">[INFO] LuckyStrike Helper v13.2 initialized successfully.</div>' +
                    '<div style="color:#00bcff">[SCAN] Universe cache valid: 38,450 celestial objects loaded.</div>' +
                    '<div style="color:#ffbe3b">[ALARM] Threat watcher running in active tab monitoring.</div>' +
                    '<div style="color:#d1d8e0">[FLEET] 6 expedition routes calculated from [1:20:16].</div>';
            }
        }
    </script>
</body>
</html>
'@

$trPlanetList = @'
    <div id="planetList" style="display:none">
        <div class="smallplanet" id="planet-101">
            <a class="planetlink" href="https://s1-tr.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=101" title="Ana Gezegen [1:20:5]">
                <span class="planet-name">Ana Gezegen</span>
                <span class="planet-koords">[1:20:5]</span>
            </a>
            <a class="moonlink" href="https://s1-tr.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=102" title="Ay [1:20:5]"></a>
        </div>
        <div class="smallplanet" id="planet-103">
            <a class="planetlink" href="https://s1-tr.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=103" title="Koloni Alfa [1:20:6]">
                <span class="planet-name">Koloni Alfa</span>
                <span class="planet-koords">[1:20:6]</span>
            </a>
            <a class="moonlink" href="https://s1-tr.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=104" title="Ay [1:20:6]"></a>
        </div>
        <div class="smallplanet" id="planet-105">
            <a class="planetlink" href="https://s1-tr.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=105" title="Koloni Beta [2:14:8]">
                <span class="planet-name">Koloni Beta</span>
                <span class="planet-koords">[2:14:8]</span>
            </a>
        </div>
        <div class="smallplanet" id="planet-106">
            <a class="planetlink" href="https://s1-tr.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=106" title="Koloni Gama [3:316:9]">
                <span class="planet-name">Koloni Gama</span>
                <span class="planet-koords">[3:316:9]</span>
            </a>
            <a class="moonlink" href="https://s1-tr.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=107" title="Ay [3:316:9]"></a>
        </div>
    </div>
'@

$enPlanetList = @'
    <div id="planetList" style="display:none">
        <div class="smallplanet" id="planet-101">
            <a class="planetlink" href="https://s1-en.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=101" title="Main Planet [1:20:5]">
                <span class="planet-name">Main Planet</span>
                <span class="planet-koords">[1:20:5]</span>
            </a>
            <a class="moonlink" href="https://s1-en.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=102" title="Moon [1:20:5]"></a>
        </div>
        <div class="smallplanet" id="planet-103">
            <a class="planetlink" href="https://s1-en.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=103" title="Colony Alpha [1:20:6]">
                <span class="planet-name">Colony Alpha</span>
                <span class="planet-koords">[1:20:6]</span>
            </a>
            <a class="moonlink" href="https://s1-en.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=104" title="Moon [1:20:6]"></a>
        </div>
        <div class="smallplanet" id="planet-105">
            <a class="planetlink" href="https://s1-en.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=105" title="Colony Beta [2:14:8]">
                <span class="planet-name">Colony Beta</span>
                <span class="planet-koords">[2:14:8]</span>
            </a>
        </div>
        <div class="smallplanet" id="planet-106">
            <a class="planetlink" href="https://s1-en.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=106" title="Colony Gamma [3:316:9]">
                <span class="planet-name">Colony Gamma</span>
                <span class="planet-koords">[3:316:9]</span>
            </a>
            <a class="moonlink" href="https://s1-en.ogame.gameforge.com/game/index.php?page=ingame&component=overview&cp=107" title="Moon [3:316:9]"></a>
        </div>
    </div>
'@

foreach ($curLang in $targetLangs) {
    Write-Host "`n>>> Rendering screenshots for language: $curLang <<<" -ForegroundColor Cyan
    $planetListHtml = if ($curLang -eq "en") { $enPlanetList } else { $trPlanetList }
    $outDir = if ($curLang -eq "en") { $enScreenshotsDir } else { $screenshotsDir }

    foreach ($t in $tabs) {
        $tabHtml = $htmlTemplate.Replace("__TARGET_TAB__", $t).Replace("__TARGET_LANG__", $curLang).Replace("__PLANET_LIST_HTML__", $planetListHtml)
        $tempHtmlPath = "$screenshotsDir\render_${curLang}_active.html"
        [System.IO.File]::WriteAllText($tempHtmlPath, $tabHtml, [System.Text.Encoding]::UTF8)

        $outFile = "$outDir\tab_$t.png"
        Write-Host "Rendering [$curLang] tab_$t -> $outFile"
        Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--virtual-time-budget=2000", "--window-size=500,820", "--screenshot=$outFile", "file:///$tempHtmlPath" -Wait
        Start-Sleep -Milliseconds 400
        Remove-Item -Force $tempHtmlPath -ErrorAction SilentlyContinue
    }
}

Write-Host "`nDone! All requested screenshots rendered successfully." -ForegroundColor Green
Write-Host "Turkish screenshots in ${screenshotsDir}:"
Get-ChildItem -Path "$screenshotsDir\tab_*.png" | Select-Object Name, Length, LastWriteTime
if (Test-Path $enScreenshotsDir) {
    Write-Host "English screenshots in ${enScreenshotsDir}:"
    Get-ChildItem -Path "$enScreenshotsDir\tab_*.png" | Select-Object Name, Length, LastWriteTime
}
