param(
    [string]$TargetTag = ""
)

$ErrorActionPreference = "Stop"

$token = if ($env:GH_TOKEN) { $env:GH_TOKEN } elseif ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } elseif (Test-Path "$PSScriptRoot\.token.SECRET") { (Get-Content "$PSScriptRoot\.token.SECRET").Trim() } else { "" }
if (-not $token) {
    Write-Error "GitHub token not found! Set GH_TOKEN environment variable or scripts/.token.SECRET file."
}
$repo = "kadirersoy/luckystrike-ogame-helper"
$projectRoot = Resolve-Path "$PSScriptRoot\.."

# 1. Read manifest version
$manifestPath = Join-Path $projectRoot "manifest.json"
if (-not (Test-Path $manifestPath)) {
    Write-Error "manifest.json not found in working directory!"
}
$manifest = [System.IO.File]::ReadAllText($manifestPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$manifestVer = $manifest.version
$expectedTag = if ($TargetTag -ne "") { $TargetTag } else { "v$manifestVer" }
$expectedTitle = "$expectedTag - LuckyStrike OGame Helper"

Write-Host "================================================="
Write-Host "LuckyStrike Release Consistency & Integrity Audit"
Write-Host "Target Tag: $expectedTag | Manifest: $manifestVer"
Write-Host "================================================="

# Fetch latest release data from GitHub to temporary file to preserve UTF-8
$tempOut = Join-Path $env:TEMP "gh_release_verify.json"
& curl.exe -s -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$repo/releases/tags/$expectedTag" -o $tempOut

if (-not (Test-Path $tempOut) -or (Get-Item $tempOut).Length -lt 20) {
    Write-Error "Failed to fetch release '$expectedTag' from GitHub API!"
}

$rel = [System.IO.File]::ReadAllText($tempOut, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
Remove-Item -Force $tempOut

$failures = @()

# Check 1: Release Title Format
Write-Host "[1/6] Checking Release Title..."
$titleRegex = '^v\d+\.\d+.* - LuckyStrike OGame Helper$'
if ($rel.name -notmatch $titleRegex) {
    $failures += "Title mismatch! Expected pattern '$titleRegex', got '$($rel.name)'"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: $($rel.name)" -ForegroundColor Green
}

# Check 2: Character Encoding & Mojibake Check
Write-Host "[2/6] Checking UTF-8 Character Encoding & Mojibake..."
$body = $rel.body
$hasReplChar = $body.Contains([char]0xFFFD)
$mojibakeChars = @([char]0x00C3, [char]0x00C4, [char]0x00C5, [char]0x00C2)
$hasMojibakeChar = $false
foreach ($mc in $mojibakeChars) {
    if ($body.Contains($mc)) { $hasMojibakeChar = $true; break }
}
$hasMojibakeString = $body.Contains("ğŸ") -or ($body -match '\?{3,}')

if ($hasReplChar -or $hasMojibakeChar -or $hasMojibakeString) {
    $failures += "Mojibake/corrupted characters detected in release body!"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: Clean UTF-8, zero mojibake detected." -ForegroundColor Green
}

# Check 3: ZIP Asset Presence & Downloadability
Write-Host "[3/6] Checking ZIP Release Asset..."
$expectedZipName = "luckystrike-ogame-helper-$expectedTag.zip"
$asset = $rel.assets | Where-Object { $_.name -eq $expectedZipName }
if (-not $asset) {
    $failures += "Asset '$expectedZipName' not found on GitHub release!"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} elseif ($asset.size -le 0) {
    $failures += "Asset '$expectedZipName' has invalid size ($($asset.size) bytes)!"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: Asset attached ($($asset.name), $($asset.size) bytes)" -ForegroundColor Green
    Write-Host "          Download URL: $($asset.browser_download_url)"
}

# Check 4: Version Synchronization (Manifest vs Tag vs README)
Write-Host "[4/6] Checking Version Synchronization across files..."
$readme = [System.IO.File]::ReadAllText((Join-Path $projectRoot "README.md"), [System.Text.Encoding]::UTF8)
$readmeHasVersion = $readme.Contains("($expectedTag)") -or $readme.Contains("### $expectedTag")
if (-not $readmeHasVersion) {
    $failures += "README.md does not reference $expectedTag!"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: README.md references $expectedTag" -ForegroundColor Green
}

# Check 5: Screenshot Freshness
Write-Host "[5/6] Checking Screenshot Assets Freshness (TR & EN)..."
$screenshotsDir = Join-Path $projectRoot "screenshots"
$enScreenshotsDir = Join-Path $screenshotsDir "en"
$allSsExist = $true
$requiredScreenshots = @("tab_alarm.png", "tab_cart.png", "tab_collector.png", "tab_courier.png", "tab_debris.png", "tab_expedition.png", "tab_finder.png", "tab_scanner.png", "tab_settings.png")
foreach ($ss in $requiredScreenshots) {
    $pTr = Join-Path $screenshotsDir $ss
    if (-not (Test-Path $pTr) -or (Get-Item $pTr).Length -lt 1000) {
        $allSsExist = $false
        $failures += "Turkish screenshot '$ss' missing or corrupt!"
        Write-Host "  FAILED: Turkish screenshot '$ss' missing or corrupt!" -ForegroundColor Red
    }
    $pEn = Join-Path $enScreenshotsDir $ss
    if (-not (Test-Path $pEn) -or (Get-Item $pEn).Length -lt 1000) {
        $allSsExist = $false
        $failures += "English screenshot 'en/$ss' missing or corrupt!"
        Write-Host "  FAILED: English screenshot 'en/$ss' missing or corrupt!" -ForegroundColor Red
    }
}
if ($allSsExist) {
    Write-Host "  PASSED: All 18 screenshots (9 TR + 9 EN) verified." -ForegroundColor Green
}

# Check 6: Local ZIP Hygiene (only 1 ZIP present in root)
Write-Host "[6/6] Checking Local Directory ZIP Hygiene..."
$localZips = Get-ChildItem -Path $projectRoot -Filter "*.zip"
if ($localZips.Count -gt 1) {
    $failures += "Multiple ZIP files found in project root ($($localZips.Name -join ', '))! Only the active version should remain."
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} elseif ($localZips.Count -eq 0) {
    $failures += "No local ZIP file found in project root!"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} elseif ($localZips[0].Name -ne $expectedZipName) {
    $failures += "Local ZIP file name mismatch! Expected '$expectedZipName', found '$($localZips[0].Name)'"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: Exactly 1 active local ZIP present: $($localZips[0].Name)" -ForegroundColor Green
}

Write-Host "-------------------------------------------------"
if ($failures.Count -eq 0) {
    Write-Host "AUDIT RESULT: 100% PASSED! RELEASE IS FULLY CONSISTENT." -ForegroundColor Green
    exit 0
} else {
    Write-Host "AUDIT RESULT: $($failures.Count) CHECK(S) FAILED!" -ForegroundColor Red
    exit 1
}
