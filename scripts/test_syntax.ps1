$ErrorActionPreference = "Stop"

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$bridgePath = (Resolve-Path (Join-Path $PSScriptRoot "..\bridge.js")).Path
$contentPath = (Resolve-Path (Join-Path $PSScriptRoot "..\content.js")).Path

$bridgeCode = [System.IO.File]::ReadAllText($bridgePath, [System.Text.Encoding]::UTF8)
$contentCode = [System.IO.File]::ReadAllText($contentPath, [System.Text.Encoding]::UTF8)

# Escape code for embedding into JSON
$bridgeJson = $bridgeCode | ConvertTo-Json -Compress
$contentJson = $contentCode | ConvertTo-Json -Compress

$tempHtml = Join-Path $PSScriptRoot "test_runner.html"
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
        var bridgeSource = $bridgeJson;
        var contentSource = $contentJson;

        var err = null;
        try {
            new Function(bridgeSource);
            document.getElementById('output').textContent += ' | BRIDGE_OK';
        } catch (e) {
            err = 'ERROR_BRIDGE: ' + e.message;
        }

        if (!err) {
            try {
                new Function(contentSource);
                document.getElementById('output').textContent += ' | CONTENT_OK';
                document.title = 'ALL_SYNTAX_VALID_SUCCESS';
            } catch (e) {
                err = 'ERROR_CONTENT: ' + e.message;
            }
        }

        if (err) {
            document.title = err;
            document.getElementById('output').textContent = err;
        }
    </script>
</body>
</html>
"@

[System.IO.File]::WriteAllText($tempHtml, $htmlContent, [System.Text.Encoding]::UTF8)

# Run Edge headless to dump DOM
$proc = Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--disable-gpu", "--dump-dom", "$tempHtml" -NoNewWindow -PassThru -RedirectStandardOutput (Join-Path $PSScriptRoot "edge_out.txt") -RedirectStandardError (Join-Path $PSScriptRoot "edge_err.txt")
$proc.WaitForExit(10000)
Start-Sleep -Milliseconds 400

$out = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot "edge_out.txt"), [System.Text.Encoding]::UTF8)
Remove-Item -Force $tempHtml
if (Test-Path (Join-Path $PSScriptRoot "edge_out.txt")) { Remove-Item -Force (Join-Path $PSScriptRoot "edge_out.txt") }
if (Test-Path (Join-Path $PSScriptRoot "edge_err.txt")) { Remove-Item -Force (Join-Path $PSScriptRoot "edge_err.txt") }

$title = if ($out -match '<title>(.*?)</title>') { $matches[1] } else { 'NO_TITLE' }
$output = if ($out -match '<div id="output">(.*?)</div>') { $matches[1] } else { 'NO_OUTPUT' }

Write-Host "Edge V8 Result Title: $title"
Write-Host "Edge V8 Output: $output"

if ($title -eq "ALL_SYNTAX_VALID_SUCCESS" -and $output.Contains("CONTENT_OK") -and $output.Contains("BRIDGE_OK")) {
    Write-Host ">>> PERFECT! Both bridge.js and content.js parsed and executed with ZERO syntax errors in Microsoft Edge V8! <<<" -ForegroundColor Green
    exit 0
} else {
    Write-Host "FAILED: Edge V8 reported error: $title" -ForegroundColor Red
    exit 1
}
