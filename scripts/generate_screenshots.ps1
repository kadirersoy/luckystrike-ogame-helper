$projectRoot = "D:\_Antigravity\OGame"
$screenshotsDir = "$projectRoot\screenshots"
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

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
    <div id="resources_metal" style="display:none">2.450.000</div>
    <div id="resources_crystal" style="display:none">1.120.000</div>
    <div id="resources_deuterium" style="display:none">890.000</div>

    <script>
        const TARGET_TAB = "__TARGET_TAB__";

        localStorage.setItem('LS_ACTIVE_TAB', TARGET_TAB);
        localStorage.setItem('LS_LANGUAGE', 'tr');
        localStorage.setItem('LS_THEME', 'dark');
        localStorage.setItem('LS_PANEL_OPACITY', '100');
        localStorage.setItem('LS_PANEL_OPEN', 'true');
        localStorage.setItem('LS_TECH_CACHE', JSON.stringify({ ts: Date.now(), hyperspace: 12, combustion: 15, impulse: 13 }));

        localStorage.setItem('LS_COST_CART', JSON.stringify([
            { id: '1', name: 'Metal Madeni', level: 35, planet: 'Ana Gezegen', coords: '1:20:5', type: 1, metal: 35200000, crystal: 8800000, deuterium: 0, count: 1 },
            { id: '2', name: 'Kristal Madeni', level: 30, planet: 'Koloni Alfa', coords: '1:20:6', type: 1, metal: 18400000, crystal: 9200000, deuterium: 0, count: 1 },
            { id: '3', name: 'Astrofizik', level: 17, planet: 'Ana Gezegen', coords: '1:20:5', type: 1, metal: 24000000, crystal: 48000000, deuterium: 24000000, count: 1 }
        ]));

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

        localStorage.setItem('LS_COURIER_SETTINGS', JSON.stringify({
            originId: '101',
            originCoord: '1:20:5',
            originType: 1,
            originName: 'Ana Gezegen',
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

        localStorage.setItem('LS_COLLECTOR_SETTINGS', JSON.stringify({
            targetId: '102',
            targetCoord: '1:20:5',
            targetType: 3,
            targetName: 'Ana Gezegen ( Ay )',
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

        localStorage.setItem('LS_EXPEDITION_TEMPLATES', JSON.stringify([
            { id: 'tpl1', name: 'Hızlı Keşif (300 Rehber, 1 Casus)' },
            { id: 'tpl2', name: 'Ağır Keşif (500 Komuta, 200 GD)' }
        ]));
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
                tplSelect.innerHTML = '<option value="tpl1" selected>🚀 Hızlı Keşif (300 Rehber, 1 Casus)</option><option value="tpl2">🛡️ Ağır Keşif (500 Komuta, 200 GD)</option>';
            }
            const previewList = document.getElementById('ls-exp-preview-list');
            const totalSteps = document.getElementById('ls-exp-total-steps');
            if (totalSteps) totalSteps.textContent = '6 Sefer';
            if (previewList) {
                previewList.innerHTML = 
                    '<div style="margin-bottom:3px">1. Sefer: [1:20:16] <span style="color:#00bcff">(Kendi Sistemi)</span></div>' +
                    '<div style="margin-bottom:3px">2. Sefer: [1:21:16] <span style="color:#2ecc71">(+1 Sistem)</span></div>' +
                    '<div style="margin-bottom:3px">3. Sefer: [1:19:16] <span style="color:#2ecc71">(-1 Sistem)</span></div>' +
                    '<div style="margin-bottom:3px">4. Sefer: [1:22:16] <span style="color:#f39c12">(+2 Sistem)</span></div>' +
                    '<div style="margin-bottom:3px">5. Sefer: [1:18:16] <span style="color:#f39c12">(-2 Sistem)</span></div>' +
                    '<div style="margin-bottom:3px">6. Sefer: [1:23:16] <span style="color:#f39c12">(+3 Sistem)</span></div>';
            }
        }

        if (TARGET_TAB === 'scanner') {
            const statusBox = document.getElementById('ls-scan-status-info');
            if (statusBox) {
                statusBox.innerHTML = 
                    '<span style="color:#2ecc71">✔ Evren Verisi Güncel</span> · <span>38.450 Gezegen Kayıtlı</span><br>' +
                    '<span style="color:#8899aa;font-size:9.5px">Son Güncelleme: Bugün 21:00 (Önbellek: 24 Saat)</span>';
            }
            const resBox = document.getElementById('ls-scan-results-box');
            if (resBox) resBox.style.display = 'flex';
            const resultsEl = document.getElementById('ls-scan-results');
            if (resultsEl) {
                resultsEl.innerHTML = 
                    '<div class="ls-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-left:3px solid #00bcff;margin-bottom:4px">' +
                        '<div><b style="color:#00bcff;font-family:monospace">[1:45:8]</b> <span style="font-size:10px;color:#2ecc71;background:rgba(46,204,113,0.12);padding:1px 4px;border-radius:3px">Slot 8 (Maks Metal)</span></div>' +
                        '<button class="ls-btn-sm" style="background:#1a2c3f;color:#00bcff;border:1px solid #2c3e50;padding:2px 6px">Galaksiye Git</button>' +
                    '</div>' +
                    '<div class="ls-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-left:3px solid #00bcff;margin-bottom:4px">' +
                        '<div><b style="color:#00bcff;font-family:monospace">[1:52:8]</b> <span style="font-size:10px;color:#2ecc71;background:rgba(46,204,113,0.12);padding:1px 4px;border-radius:3px">Slot 8 (Maks Metal)</span></div>' +
                        '<button class="ls-btn-sm" style="background:#1a2c3f;color:#00bcff;border:1px solid #2c3e50;padding:2px 6px">Galaksiye Git</button>' +
                    '</div>' +
                    '<div class="ls-item" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-left:3px solid #2ecc71;margin-bottom:4px">' +
                        '<div><b style="color:#2ecc71;font-family:monospace">[1:64:15]</b> <span style="font-size:10px;color:#ffbe3b;background:rgba(255,190,59,0.12);padding:1px 4px;border-radius:3px">Slot 15 (Maks Deuterium)</span></div>' +
                        '<button class="ls-btn-sm" style="background:#1a2c3f;color:#00bcff;border:1px solid #2c3e50;padding:2px 6px">Galaksiye Git</button>' +
                    '</div>';
            }
        }

        if (TARGET_TAB === 'finder') {
            const searchInp = document.getElementById('ls-find-q');
            if (searchInp) searchInp.value = 'Imperator';
            const statusBox = document.getElementById('ls-find-cache-info');
            if (statusBox) {
                statusBox.innerHTML = 
                    '<span style="color:#2ecc71">✔ Oyuncu Verisi Hazır</span> · <span>1.840 Oyuncu Kayıtlı</span>';
            }
            const resultsEl = document.getElementById('ls-find-results');
            if (resultsEl) {
                resultsEl.innerHTML = 
                    '<div style="background:rgba(255,255,255,0.03);border:1px solid #1a2c3f;border-radius:6px;padding:8px 10px;margin-bottom:6px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                            '<b style="color:#00bcff;font-size:12px">Imperator <span style="color:#8899aa;font-weight:normal">[DOMIN]</span></b>' +
                            '<span style="font-size:10px;color:#2ecc71;background:rgba(46,204,113,0.15);padding:2px 6px;border-radius:3px">Sıralama: #14</span>' +
                        '</div>' +
                        '<div style="font-size:10.5px;color:#8899aa;display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
                            '<div>🪐 Ana Üs: <span style="color:#ffbe3b;font-family:monospace">[1:120:4]</span></div>' +
                            '<div>🌕 Ay: <span style="color:#ffbe3b;font-family:monospace">[1:120:4]</span></div>' +
                            '<div>🪐 Koloni 1: <span style="color:#ffbe3b;font-family:monospace">[1:240:8]</span></div>' +
                            '<div>🪐 Koloni 2: <span style="color:#ffbe3b;font-family:monospace">[2:45:9]</span></div>' +
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
        }

        if (TARGET_TAB === 'settings') {
            const dbgT = document.getElementById('ls-debug-toggle');
            if (dbgT) dbgT.checked = true;
            const trcT = document.getElementById('ls-trace-toggle');
            if (trcT) trcT.checked = true;
            const hf = document.getElementById('ls-setting-hover-focus');
            if (hf) hf.checked = true;
            const logsEl = document.getElementById('ls-debug-logs');
            if (logsEl) {
                logsEl.innerHTML = 
                    '<div style="color:#2ecc71">[INFO] LuckyStrike Helper v13.1 initialized successfully.</div>' +
                    '<div style="color:#00bcff">[SCAN] Universe cache valid: 38,450 celestial objects loaded.</div>' +
                    '<div style="color:#ffbe3b">[ALARM] Threat watcher running in active tab monitoring.</div>' +
                    '<div style="color:#d1d8e0">[FLEET] 6 expedition routes calculated from [1:20:16].</div>';
            }
        }
    </script>
</body>
</html>
'@

$tabs = @("cart", "collector", "courier", "debris", "expedition", "scanner", "finder", "alarm", "settings")

foreach ($t in $tabs) {
    $tabHtml = $htmlTemplate.Replace("__TARGET_TAB__", $t)
    $tempHtmlPath = "$screenshotsDir\render_active.html"
    [System.IO.File]::WriteAllText($tempHtmlPath, $tabHtml, [System.Text.Encoding]::UTF8)

    $outFile = "$screenshotsDir\tab_$t.png"
    Write-Host "Rendering tab_$t -> $outFile"
    Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--virtual-time-budget=2000", "--window-size=500,820", "--screenshot=$outFile", "file:///$tempHtmlPath" -Wait
    Start-Sleep -Milliseconds 400
}

Remove-Item -Force "$screenshotsDir\render_active.html" -ErrorAction SilentlyContinue

Write-Host "Done! Screenshot files updated:"
Get-ChildItem -Path "$screenshotsDir\tab_*.png" | Select-Object Name, Length, LastWriteTime
