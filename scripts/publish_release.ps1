param(
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

$token = if ($env:GH_TOKEN) { $env:GH_TOKEN } elseif ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } elseif (Test-Path "$PSScriptRoot/.token.SECRET") { (Get-Content "$PSScriptRoot/.token.SECRET").Trim() } else { "" }
if (-not $token) {
    Write-Error "GitHub token not found! Set GH_TOKEN environment variable or scripts/.token.SECRET file."
}
$repo = "kadirersoy/luckystrike-ogame-helper"

# 1. Read manifest version
$manifest = [System.IO.File]::ReadAllText("manifest.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$ver = $manifest.version
$tag = "v$ver"
$releaseTitle = "$tag - LuckyStrike OGame Helper"
$zipName = "luckystrike-ogame-helper-$tag.zip"
$zipPath = Join-Path (Get-Location) $zipName

Write-Host ">>> Starting Release Pipeline for $tag ($releaseTitle) <<<"

# 2. Cleanup old local ZIPs
Write-Host "Cleaning up old local ZIP archives..."
Get-ChildItem -Filter "*.zip" | ForEach-Object {
    if ($_.Name -ne $zipName) {
        Write-Host "  Removing old ZIP: $($_.Name)"
        Remove-Item -Force $_.FullName
    }
}

# 3. Create fresh ZIP
Write-Host "Creating fresh ZIP package: $zipName..."
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
$extFiles = @("manifest.json", "content.js", "background.js", "bridge.js", "icons")
Compress-Archive -Path $extFiles -DestinationPath $zipPath -Force
Write-Host "ZIP created ($((Get-Item $zipPath).Length) bytes)."

# 4. Extract release notes from README.md
Write-Host "Extracting release notes from README.md..."
$readme = [System.IO.File]::ReadAllText("README.md", [System.Text.Encoding]::UTF8)
$startTag = "### $tag"
$startIdx = $readme.IndexOf($startTag)

$releaseBody = ""
if ($startIdx -ge 0) {
    # Find next section starting with "### v"
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
    
    $releaseBody = @"
## 🚀 LuckyStrike OGame Helper $tag

$notesPart

---
### 📦 Kurulum / Installation
1. Ekteki **``$zipName``** dosyasını indirin ve bir klasöre çıkartın.
2. Tarayıcınızda (Chrome/Edge/Brave) ``chrome://extensions`` adresine gidin.
3. Sağ üstten **Geliştirici Modu (Developer Mode)** seçeneğini açın.
4. **Paketlenmemiş öğe yükle (Load unpacked)** butonuyla ayıkladığınız klasörü seçin (veya mevcut eklentiyi yenileyin).
"@
} else {
    Write-Warning "Could not find $startTag in README.md. Using fallback release notes."
    $releaseBody = @"
## 🚀 LuckyStrike OGame Helper $tag

LuckyStrike OGame Helper $tag sürümü yayınlandı.

---
### 📦 Kurulum / Installation
1. Ekteki **``$zipName``** dosyasını indirin ve bir klasöre çıkartın.
2. Tarayıcınızda (Chrome/Edge/Brave) ``chrome://extensions`` adresine gidin.
3. Sağ üstten **Geliştirici Modu (Developer Mode)** seçeneğini açın.
4. **Paketlenmemiş öğe yükle (Load unpacked)** butonuyla ayıkladığınız klasörü seçin (veya mevcut eklentiyi yenileyin).
"@
}

# 5. Prepare UTF-8 JSON Payload
$payload = @{
    tag_name = $tag
    target_commitish = "main"
    name = $releaseTitle
    body = $releaseBody
    draft = $false
    prerelease = $false
} | ConvertTo-Json -Depth 5

$tempPayloadJson = Join-Path $env:TEMP "gh_release_payload.json"
[System.IO.File]::WriteAllText($tempPayloadJson, $payload, [System.Text.UTF8Encoding]::new($false))

# 6. Check if release already exists
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
$uploadUrlRaw = $null

if ($existingRelease) {
    $releaseId = $existingRelease.id
    $uploadUrlRaw = $existingRelease.upload_url
    Write-Host "Release already exists (ID: $releaseId). Updating..."
    
    $patchUrl = "https://api.github.com/repos/$repo/releases/$releaseId"
    & curl.exe -s -X PATCH `
      -H "Authorization: Bearer $token" `
      -H "Accept: application/vnd.github+json" `
      -H "Content-Type: application/json; charset=utf-8" `
      --data-binary "@$tempPayloadJson" `
      $patchUrl | Out-Null
} else {
    Write-Host "Creating new GitHub Release $tag..."
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
    $uploadUrlRaw = $created.upload_url
}

Remove-Item -Force $tempPayloadJson

# 7. Upload / Replace ZIP Asset
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

Write-Host "Asset upload complete."

# 8. Run Verification Check
Write-Host "`nRunning Post-Release Consistency Audit..."
& powershell -File (Join-Path (Get-Location) "scripts\verify_release.ps1") -TargetTag $tag

Write-Host "`n>>> RELEASE COMPLETED SUCCESSFULLY! <<<"
Write-Host "1. Release URL: https://github.com/$repo/releases/tag/$tag"
Write-Host "2. Asset URL:   https://github.com/$repo/releases/download/$tag/$zipName"
Write-Host "3. Local ZIP:   $zipPath"
