$ErrorActionPreference = "Stop"

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$contentPath = (Resolve-Path (Join-Path $PSScriptRoot "..\content.js")).Path
$contentCode = [System.IO.File]::ReadAllText($contentPath, [System.Text.Encoding]::UTF8)

# Escape code for embedding into JSON
$contentJson = $contentCode | ConvertTo-Json -Compress

$tempHtml = Join-Path $PSScriptRoot "test_km_runner.html"
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PENDING_TEST</title>
</head>
<body>
    <div id="output">STARTING</div>
    <script>
        var contentSource = $contentJson;

        // Extract functions under test from contentSource
        try {
            // Mock minimal environment to allow content.js evaluation or extract functions
            window.localStorage = {
                getItem: function() { return null; },
                setItem: function() {},
                removeItem: function() {}
            };
            window.chrome = { runtime: { id: "test" } };

            var fnCalculate = new Function("totalSeconds", "projectType", 
                contentSource.substring(contentSource.indexOf("function calculateKmCost"), contentSource.indexOf("function formatDurationDetailed"))
                + "\nreturn calculateKmCost(totalSeconds, projectType);"
            );

            var fnParse = new Function("str", 
                contentSource.substring(contentSource.indexOf("function parseDurationText"), contentSource.indexOf("function renderKmCost"))
                + "\nreturn parseDurationText(str);"
            );

            var fnFormat = new Function("sec", "lang", 
                contentSource.substring(contentSource.indexOf("function formatDurationDetailed"), contentSource.indexOf("function parseDurationText"))
                + "\nreturn formatDurationDetailed(sec, lang);"
            );

            // Test calculateKmCost
            var cases = [
                { sec: 0, type: "build", expH: 0, expF: 0, expBadge: "km_badge_zero" },
                { sec: 1, type: "build", expH: 750, expF: 1500, expBadge: "km_badge_base" },
                { sec: 1800, type: "build", expH: 750, expF: 1500, expBadge: "km_badge_base" },
                { sec: 1801, type: "build", expH: 1500, expF: 3000, expBadge: "km_badge_std" },
                { sec: 3600, type: "build", expH: 1500, expF: 3000, expBadge: "km_badge_std" },
                { sec: 86400, type: "build", expH: 36000, expF: 72000, expBadge: "km_badge_std" },
                { sec: 172800, type: "build", expH: 72000, expF: 144000, expBadge: "km_badge_cap_build" }, // 48h build cap
                { sec: 216000, type: "build", expH: 72000, expF: 144000, expBadge: "km_badge_cap_build" }, // 60h build still cap
                { sec: 216000, type: "research", expH: 90000, expF: 180000, expBadge: "km_badge_std" }, // 60h research normal
                { sec: 259200, type: "research", expH: 108000, expF: 216000, expBadge: "km_badge_cap_research" }, // 72h research cap
                { sec: 2592000, type: "research", expH: 108000, expF: 216000, expBadge: "km_badge_cap_research" } // 1 month research cap
            ];

            var failed = [];
            cases.forEach(function(c, i) {
                var res = fnCalculate(c.sec, c.type);
                if (res.halveDm !== c.expH || res.finishDm !== c.expF || res.badgeKey !== c.expBadge) {
                    failed.push("Case #" + i + " (sec:" + c.sec + ", type:" + c.type + ") got halve=" + res.halveDm + " (exp " + c.expH + "), finish=" + res.finishDm + " (exp " + c.expF + "), badge=" + res.badgeKey + " (exp " + c.expBadge + ")");
                }
            });

            // Test parseDurationText
            var parseCases = [
                { text: "14:30", exp: { h: 0, m: 14, s: 30 } },
                { text: "02:15:45", exp: { h: 2, m: 15, s: 45 } },
                { text: "2g 5s 30d", exp: { d: 2, h: 5, m: 30 } },
                { text: "1h 3g 14s", exp: { d: 10, h: 14, m: 0 } },
                { text: "2w 4d 12h 30m 15s", exp: { d: 18, h: 12, m: 30, s: 15 } },
                { text: "1ay 2 hafta 3 gün", exp: { d: 47, h: 0, m: 0 } }
            ];

            parseCases.forEach(function(pc, i) {
                var p = fnParse(pc.text);
                if (!p) {
                    failed.push("ParseCase #" + i + " returned null for " + pc.text);
                } else {
                    for (var k in pc.exp) {
                        if (p[k] !== pc.exp[k]) {
                            failed.push("ParseCase #" + i + " key " + k + " got " + p[k] + " (exp " + pc.exp[k] + ") for " + pc.text);
                        }
                    }
                }
            });

            if (failed.length === 0) {
                document.title = "KM_TESTS_ALL_PASSED";
                document.getElementById('output').textContent = "ALL_KM_TESTS_PASSED_SUCCESSFULLY";
            } else {
                document.title = "KM_TESTS_FAILED";
                document.getElementById('output').textContent = failed.join(" | ");
            }
        } catch (e) {
            document.title = "KM_TEST_EXCEPTION: " + e.message;
            document.getElementById('output').textContent = e.stack || e.message;
        }
    </script>
</body>
</html>
"@

[System.IO.File]::WriteAllText($tempHtml, $htmlContent, [System.Text.Encoding]::UTF8)

$proc = Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--disable-gpu", "--dump-dom", "$tempHtml" -NoNewWindow -PassThru -RedirectStandardOutput (Join-Path $PSScriptRoot "km_out.txt") -RedirectStandardError (Join-Path $PSScriptRoot "km_err.txt")
$proc.WaitForExit(10000)
Start-Sleep -Milliseconds 400

$out = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot "km_out.txt"), [System.Text.Encoding]::UTF8)
Remove-Item -Force $tempHtml
if (Test-Path (Join-Path $PSScriptRoot "km_out.txt")) { Remove-Item -Force (Join-Path $PSScriptRoot "km_out.txt") }
if (Test-Path (Join-Path $PSScriptRoot "km_err.txt")) { Remove-Item -Force (Join-Path $PSScriptRoot "km_err.txt") }

$title = if ($out -match '<title>(.*?)</title>') { $matches[1] } else { 'NO_TITLE' }
$output = if ($out -match '<div id="output">(.*?)</div>') { $matches[1] } else { 'NO_OUTPUT' }

Write-Host "Edge V8 Result Title: $title"
Write-Host "Edge V8 Output: $output"

if ($title -eq "KM_TESTS_ALL_PASSED") {
    Write-Host ">>> PERFECT! All KM calculation & parsing unit tests passed in Microsoft Edge V8! <<<" -ForegroundColor Green
    exit 0
} else {
    Write-Host "FAILED: $output" -ForegroundColor Red
    exit 1
}
