param(
    [string]$TargetTag = ""
)

$ErrorActionPreference = "Stop"

$token = if ($env:GH_TOKEN) { $env:GH_TOKEN } elseif ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } elseif (Test-Path "$PSScriptRoot/.token.SECRET") { (Get-Content "$PSScriptRoot/.token.SECRET").Trim() } else { "" }
if (-not $token) {
    Write-Error "GitHub token not found! Set GH_TOKEN environment variable or scripts/.token.SECRET file."
}
$repo = "kadirersoy/luckystrike-ogame-helper"

# 1. Read manifest version
$manifestPath = "manifest.json"
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

# Fetch latest release data from GitHub
$tempOut = Join-Path $env:TEMP "gh_release_verify.json"
& curl.exe -s -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$repo/releases/tags/$expectedTag" -o $tempOut

if (-not (Test-Path $tempOut) -or (Get-Item $tempOut).Length -lt 20) {
    Write-Error "Failed to fetch release '$expectedTag' from GitHub API!"
}

$rel = [System.IO.File]::ReadAllText($tempOut, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
Remove-Item -Force $tempOut

$failures = @()

# Check 1: Release Title Format
Write-Host "[1/5] Checking Release Title..."
if ($rel.name -ne $expectedTitle) {
    $failures += "Title mismatch! Expected '$expectedTitle', got '$($rel.name)'"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: $($rel.name)" -ForegroundColor Green
}

# Check 2: Character Encoding & Mojibake Check
Write-Host "[2/5] Checking UTF-8 Character Encoding & Mojibake..."
$body = $rel.body
$hasReplChar = $body.Contains([char]0xFFFD)
$hasMojibake = ($body -match 'Ã|Ä|Å|ğŸ|\?\?\?')
if ($hasReplChar -or $hasMojibake) {
    $failures += "Mojibake/corrupted characters detected in release body!"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: Clean UTF-8, no mojibake detected." -ForegroundColor Green
}

# Check 3: ZIP Asset Presence & Downloadability
Write-Host "[3/5] Checking ZIP Release Asset..."
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
Write-Host "[4/5] Checking Version Synchronization across files..."
$readme = [System.IO.File]::ReadAllText("README.md", [System.Text.Encoding]::UTF8)
$readmeHasVersion = $readme.Contains("($expectedTag)") -or $readme.Contains("### $expectedTag")
if (-not $readmeHasVersion) {
    $failures += "README.md does not reference $expectedTag!"
    Write-Host "  FAILED: $($failures[-1])" -ForegroundColor Red
} else {
    Write-Host "  PASSED: README.md references $expectedTag" -ForegroundColor Green
}

# Check 5: Local ZIP Hygiene (only 1 ZIP present in root)
Write-Host "[5/5] Checking Local Directory ZIP Hygiene..."
$localZips = Get-ChildItem -Path "." -Filter "*.zip"
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
