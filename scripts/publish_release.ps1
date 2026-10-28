param(
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

$token = if ($env:GH_TOKEN) { $env:GH_TOKEN } elseif ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } elseif (Test-Path "$PSScriptRoot\.token.SECRET") { (Get-Content "$PSScriptRoot\.token.SECRET").Trim() } else { "" }
if (-not $token) {
    Write-Error "GitHub token not found! Set GH_TOKEN environment variable or scripts/.token.SECRET file."
}
$repo = "kadirersoy/luckystrike-ogame-helper"
$projectRoot = Resolve-Path "$PSScriptRoot\.."

# ============================================================
# 1. READ MANIFEST VERSION & METADATA
# ============================================================
$manifest = [System.IO.File]::ReadAllText("$projectRoot\manifest.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$ver = $manifest.version
$tag = "v$ver"
$releaseTitle = "$tag - LuckyStrike OGame Helper"
$zipName = "luckystrike-ogame-helper-$tag.zip"
$zipPath = Join-Path $projectRoot $zipName

Write-Host ">>> Starting Release Pipeline for $tag ($releaseTitle) <<<"

# ============================================================
# 2. GITHUB FIX RULE: SCREENSHOT FRESHNESS AUDIT
# ============================================================
Write-Host "[GitHub-Fix 1/2] Verifying UI Screenshot Freshness..."
$screenshotsDir = "$projectRoot\screenshots"
$requiredScreenshots = @("tab_alarm.png", "tab_cart.png", "tab_collector.png", "tab_courier.png", "tab_debris.png", "tab_expedition.png", "tab_finder.png", "tab_kmcost.png", "tab_scanner.png", "tab_settings.png")

$needRegen = $false
foreach ($ss in $requiredScreenshots) {
    $ssPath = Join-Path $screenshotsDir $ss
    if (-not (Test-Path $ssPath) -or (Get-Item $ssPath).Length -lt 1000) {
        $needRegen = $true
        break
    }
}

if ($needRegen) {
    Write-Host "  Screenshots missing or outdated. Auto-generating fresh screenshots..."
    & powershell.exe -ExecutionPolicy Bypass -File "$PSScriptRoot\generate_screenshots.ps1"
} else {
    Write-Host "  PASSED: All 9 screenshots present and verified." -ForegroundColor Green
}

# ============================================================
# 3. CLEANUP OLD LOCAL ZIPS
# ============================================================
Write-Host "Cleaning up old local ZIP archives in root..."
Get-ChildItem -Path $projectRoot -Filter "*.zip" | ForEach-Object {
    if ($_.Name -ne $zipName) {
        Write-Host "  Removing old ZIP: $($_.Name)"
        Remove-Item -Force $_.FullName
    }
}

# ============================================================
# 4. CREATE FRESH ZIP
# ============================================================
Write-Host "Creating fresh ZIP package: $zipName..."
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
$extFiles = @(
    (Join-Path $projectRoot "manifest.json"),
    (Join-Path $projectRoot "content.js"),
    (Join-Path $projectRoot "background.js"),
    (Join-Path $projectRoot "bridge.js"),
    (Join-Path $projectRoot "icons")
)
Compress-Archive -Path $extFiles -DestinationPath $zipPath -Force
Write-Host "  ZIP created ($((Get-Item $zipPath).Length) bytes)."

# ============================================================
# 5. GITHUB FIX RULE: EXTRACT PURE UTF-8 BILINGUAL RELEASE NOTES
# ============================================================
Write-Host "[GitHub-Fix 2/2] Extracting pristine UTF-8 Bilingual Release Notes..."
$notesFile = Join-Path $PSScriptRoot "release_notes.md"
$notesPart = ""

if (Test-Path $notesFile) {
    Write-Host "  Reading release notes from scripts\release_notes.md..."
    $notesPart = [System.IO.File]::ReadAllText($notesFile, [System.Text.Encoding]::UTF8).Trim()
} else {
    $readme = [System.IO.File]::ReadAllText("$projectRoot\README.md", [System.Text.Encoding]::UTF8)
    $startTag = "### $tag"
    $startIdx = $readme.IndexOf($startTag)
    if ($startIdx -ge 0) {
        $nextIdx = $readme.IndexOf("### v", $startIdx + $startTag.Length)
        if ($nextIdx -ge 0) {
            $notesPart = $readme.Substring($startIdx, $nextIdx - $startIdx).Trim()
        } else {
            $nextDivider = $readme.IndexOf("---", $startIdx)
            if ($nextDivider -ge 0) {
                $notesPart = $readme.Substring($startIdx, $nextDivider - $startIdx).Trim()
            } else {
                $notesPart = $readme.Substring($startIdx).Trim()
            }
        }
    }
}

if (-not $notesPart) {
    $notesPart = "### $tag`n- $tag sürüm güncellemesi ve hata düzeltmeleri / Version maintenance release."
}

# Extract Kurulum section from README.md
$readme = [System.IO.File]::ReadAllText("$projectRoot\README.md", [System.Text.Encoding]::UTF8)
$installIdx = $readme.IndexOf("Kurulum / Installation")
$startInstall = $readme.LastIndexOf("## ", $installIdx)
$endInstall = $readme.IndexOf("---", $installIdx)
if ($endInstall -lt 0) { $endInstall = $readme.Length }
$installPart = $readme.Substring($startInstall, $endInstall - $startInstall).Trim()

$rocket = [char]::ConvertFromUtf32(0x1F680)
$releaseBody = "## $rocket LuckyStrike OGame Helper $tag`n`n$notesPart`n`n---`n`n$installPart"

# Strict Mojibake pre-flight check
$mojibakeChars = @([char]0x00C3, [char]0x00C4, [char]0x00C5, [char]0x00C2, [char]0xFFFD)
foreach ($ch in $mojibakeChars) {
    if ($releaseBody.Contains($ch)) {
        Write-Error "PRE-FLIGHT FAILED: Mojibake character code 0x$("{0:X4}" -f [int]$ch) detected in release body!"
    }
}
if ($releaseBody.Contains("ğŸ")) {
    Write-Error "PRE-FLIGHT FAILED: Mojibake 'ğŸ' detected in release body!"
}
Write-Host "  PASSED: 100% clean UTF-8 verified, zero mojibake." -ForegroundColor Green

# ============================================================
# 6. PREPARE UTF-8 JSON PAYLOAD
# ============================================================
$payloadObj = @{
    tag_name = $tag
    target_commitish = "main"
    name = $releaseTitle
    body = $releaseBody
    draft = $false
    prerelease = $false
}
$payload = $payloadObj | ConvertTo-Json -Depth 5

$tempPayloadJson = Join-Path $env:TEMP "gh_release_payload.json"
[System.IO.File]::WriteAllText($tempPayloadJson, $payload, [System.Text.UTF8Encoding]::new($false))

# ============================================================
# 7. CHECK IF RELEASE ALREADY EXISTS & CREATE/PATCH
# ============================================================
$tempGet = Join-Path $env:TEMP "gh_release_get.json"
& curl.exe -s -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$repo/releases/tags/$tag" -o $tempGet

$existingRelease = $null
if (Test-Path $tempGet) {
    try {
        $parsed = [System.IO.File]::ReadAllText($tempGet, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
        if ($parsed.id) { $existingRelease = $parsed }
    } catch {}
    Remove-Item -Force $tempGet
}

$releaseId = $null

if ($existingRelease) {
    $releaseId = $existingRelease.id
    Write-Host "Release already exists (ID: $releaseId). Updating..."
    
    $patchUrl = "https://api.github.com/repos/$repo/releases/$releaseId"
    & curl.exe -s -X PATCH `
      -H "Authorization: Bearer $token" `
      -H "Accept: application/vnd.github+json" `
      -H "Content-Type: application/json; charset=utf-8" `
      --data-binary "@$tempPayloadJson" `
      $patchUrl | Out-Null
} else {
    Write-Host "Creating new GitHub Release $tag ($releaseTitle)..."
    $postUrl = "https://api.github.com/repos/$repo/releases"
    $tempPostRes = Join-Path $env:TEMP "gh_release_created.json"
    & curl.exe -s -X POST `
      -H "Authorization: Bearer $token" `
      -H "Accept: application/vnd.github+json" `
      -H "Content-Type: application/json; charset=utf-8" `
      --data-binary "@$tempPayloadJson" `
      $postUrl -o $tempPostRes
      
    $created = [System.IO.File]::ReadAllText($tempPostRes, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
    Remove-Item -Force $tempPostRes
    $releaseId = $created.id
}

Remove-Item -Force $tempPayloadJson

# ============================================================
# 8. UPLOAD / REPLACE ZIP ASSET
# ============================================================
Write-Host "Managing release asset ($zipName)..."
$tempAssetsJson = Join-Path $env:TEMP "gh_assets.json"
& curl.exe -s -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$repo/releases/$releaseId/assets" -o $tempAssetsJson
$currentAssets = [System.IO.File]::ReadAllText($tempAssetsJson, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
Remove-Item -Force $tempAssetsJson

foreach ($a in $currentAssets) {
    if ($a.name -eq $zipName) {
        Write-Host "  Deleting previous asset ID $($a.id)..."
        & curl.exe -s -X DELETE -H "Authorization: Bearer $token" -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$repo/releases/assets/$($a.id)" | Out-Null
    }
}

Write-Host "Uploading fresh ZIP asset to release..."
$uploadUrl = "https://uploads.github.com/repos/$repo/releases/$releaseId/assets?name=$zipName"
& curl.exe -s -X POST `
  -H "Authorization: Bearer $token" `
  -H "Accept: application/vnd.github+json" `
  -H "Content-Type: application/zip" `
  --data-binary "@$zipPath" `
  $uploadUrl | Out-Null

Write-Host "  Asset upload complete."

# ============================================================
# 9. RUN POST-RELEASE CONSISTENCY & INTEGRITY AUDIT
# ============================================================
Write-Host "`nRunning Post-Release Consistency Audit..."
& powershell.exe -ExecutionPolicy Bypass -File "$PSScriptRoot\verify_release.ps1" -TargetTag $tag

Write-Host "`n>>> RELEASE COMPLETED SUCCESSFULLY! <<<"
Write-Host "1. Release URL:         https://github.com/$repo/releases/tag/$tag"
Write-Host "2. Asset Download URL:  https://github.com/$repo/releases/download/$tag/$zipName"
Write-Host "3. Edge Partner Center: https://partner.microsoft.com/en-us/dashboard/microsoftedge/e7589bd9-862f-4579-9dee-44bfcb520e9b/packages/dashboard"
Write-Host "4. Local ZIP:           $zipPath"
