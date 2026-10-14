# Brand a Wells Maine Traveler clip: burn Lay-n-Go type onto the REAL video via WinRT MediaComposition
param(
  [Parameter(Mandatory = $true)][string]$VideoPath,
  [Parameter(Mandatory = $true)][string]$OutName,
  [Parameter(Mandatory = $true)][string]$Eyebrow,
  [Parameter(Mandatory = $true)][string[]]$HeadlineLines,
  [Parameter(Mandatory = $true)][string]$Subline,
  [string]$Footer = "WELLS, MAINE  |  LAYNGO.COM"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$root = Split-Path -Parent $PSScriptRoot
$fontDir = "d:\My Drive\Lay-n-Go\Branding\26-08-12_Lay-n-Go AI Brand Guides"
$logoPath = Join-Path $root "public\layngo-logo-outlined.png"
$outDir = Join-Path $root "exports\social"
$desktop = [Environment]::GetFolderPath("Desktop")
$workDir = Join-Path $root "exports\social\_weekend-traveler-src"
New-Item -ItemType Directory -Force -Path $outDir, $workDir | Out-Null

if (-not (Test-Path $VideoPath)) { throw "Missing video: $VideoPath" }

# --- WinRT await helper ---
$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() |
  Where-Object { $_.Name -eq "AsTask" -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod } |
  Select-Object -First 1
function Await-WinRT($WinRtTask, [Type]$ResultType) {
  $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
  $netTask = $asTask.Invoke($null, @($WinRtTask))
  $netTask.Wait(-1) | Out-Null
  if ($netTask.IsFaulted) { throw $netTask.Exception }
  return $netTask.Result
}
function Await-WinRTAction($WinRtTask) {
  $asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object { $_.Name -eq "AsTask" -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } |
    Select-Object -First 1
  $netTask = $asTask.Invoke($null, @($WinRtTask))
  $netTask.Wait(-1) | Out-Null
  if ($netTask.IsFaulted) { throw $netTask.Exception }
}

$null = [Windows.Media.Editing.MediaComposition,Windows.Media.Editing,ContentType=WindowsRuntime]
$null = [Windows.Media.Editing.MediaClip,Windows.Media.Editing,ContentType=WindowsRuntime]
$null = [Windows.Media.Editing.MediaOverlay,Windows.Media.Editing,ContentType=WindowsRuntime]
$null = [Windows.Media.Editing.MediaOverlayLayer,Windows.Media.Editing,ContentType=WindowsRuntime]
$null = [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Storage.StorageFolder,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Media.MediaProperties.MediaEncodingProfile,Windows.Media.MediaProperties,ContentType=WindowsRuntime]
$null = [Windows.Media.Transcoding.TranscodeFailureReason,Windows.Media.Transcoding,ContentType=WindowsRuntime]

# Probe source
$srcFile = Await-WinRT ([Windows.Storage.StorageFile]::GetFileFromPathAsync($VideoPath)) ([Windows.Storage.StorageFile])
$srcClip = Await-WinRT ([Windows.Media.Editing.MediaClip]::CreateFromFileAsync($srcFile)) ([Windows.Media.Editing.MediaClip])
$props = $srcClip.GetVideoEncodingProperties()
$srcW = [int]$props.Width
$srcH = [int]$props.Height
$duration = $srcClip.OriginalDuration
Write-Output "Source ${srcW}x${srcH} duration=$duration"

# Target reel canvas
$W = 1080
$H = 1920

# --- Build transparent overlay PNG ---
$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile((Join-Path $fontDir "1.ttf"))
$pfc.AddFontFile((Join-Path $fontDir "2.ttf"))
$pfc.AddFontFile((Join-Path $fontDir "3.ttf"))
$famRegular = $pfc.Families | Where-Object { $_.Name -eq "League Spartan" } | Select-Object -First 1
$famBlack = $pfc.Families | Where-Object { $_.Name -like "*Black*" } | Select-Object -First 1
$famXBold = $pfc.Families | Where-Object { $_.Name -like "*ExtraBold*" } | Select-Object -First 1
if (-not $famBlack) { $famBlack = $famRegular }
if (-not $famXBold) { $famXBold = $famRegular }
function New-PxFont($fam, $size, $style = [System.Drawing.FontStyle]::Regular) {
  New-Object System.Drawing.Font($fam, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

$overlayPath = Join-Path $workDir ("overlay-" + [IO.Path]::GetFileNameWithoutExtension($OutName) + ".png")
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.SmoothingMode = "HighQuality"
$g.TextRenderingHint = "AntiAliasGridFit"

# Soft top scrim so type stays readable over moving video
$topBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
  (New-Object System.Drawing.Point 0, 0),
  (New-Object System.Drawing.Point 0, 560),
  [System.Drawing.Color]::FromArgb(170, 8, 8, 8),
  [System.Drawing.Color]::FromArgb(0, 8, 8, 8)
)
$g.FillRectangle($topBrush, 0, 0, $W, 560)
$topBrush.Dispose()
$botBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
  (New-Object System.Drawing.Point 0, ($H - 320)),
  (New-Object System.Drawing.Point 0, $H),
  [System.Drawing.Color]::FromArgb(0, 8, 8, 8),
  [System.Drawing.Color]::FromArgb(160, 8, 8, 8)
)
$g.FillRectangle($botBrush, 0, ($H - 320), $W, 320)
$botBrush.Dispose()

$BRAND = [System.Drawing.Color]::FromArgb(58, 159, 176)
$AQUA = [System.Drawing.Color]::FromArgb(127, 212, 227)
$SOFT = [System.Drawing.Color]::FromArgb(245, 245, 242)
$WHITE = [System.Drawing.Color]::White
$brushAqua = New-Object System.Drawing.SolidBrush $AQUA
$brushWhite = New-Object System.Drawing.SolidBrush $WHITE
$brushSoft = New-Object System.Drawing.SolidBrush $SOFT
$brushBrand = New-Object System.Drawing.SolidBrush $BRAND

$logo = [System.Drawing.Image]::FromFile($logoPath)
$logoW = 180
$logoH = [int]($logo.Height * ($logoW / [double]$logo.Width))
$g.DrawImage($logo, (New-Object System.Drawing.Rectangle 52, 56, $logoW, $logoH))

$fontEyebrow = New-PxFont $famXBold 26 ([System.Drawing.FontStyle]::Bold)
$fontHead = New-PxFont $famBlack 110 ([System.Drawing.FontStyle]::Bold)
$fontSub = New-PxFont $famRegular 34
$fontTag = New-PxFont $famXBold 24 ([System.Drawing.FontStyle]::Bold)
$fontUrl = New-PxFont $famRegular 18 ([System.Drawing.FontStyle]::Bold)

$x = 52
$y = 56 + $logoH + 40
$g.DrawString($Eyebrow.ToUpper(), $fontEyebrow, $brushAqua, $x, $y)
$y += 44
foreach ($line in $HeadlineLines) {
  $g.DrawString($line.ToUpper(), $fontHead, $brushWhite, $x, $y)
  $y += 100
}
$y += 8
$g.DrawString($Subline, $fontSub, $brushSoft, $x, $y)
$y += 54
$pen = New-Object System.Drawing.Pen $BRAND, 4
$g.DrawLine($pen, $x, $y, ($x + 88), $y)
$pen.Dispose()

$g.DrawString("LAY-N-GO TRAVELER", $fontTag, $brushWhite, 52, ($H - 110))
$g.DrawString($Footer, $fontUrl, $brushBrand, 52, ($H - 70))

$bmp.Save($overlayPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $logo.Dispose()
Write-Output "Overlay: $overlayPath"

# --- Compose video: cover-crop source into 1080x1920 + overlay ---
$composition = New-Object Windows.Media.Editing.MediaComposition
# Fresh clip instance for composition
$baseClip = Await-WinRT ([Windows.Media.Editing.MediaClip]::CreateFromFileAsync($srcFile)) ([Windows.Media.Editing.MediaClip])
$composition.Clips.Add($baseClip)

# Image overlay for full duration
$overlayFile = Await-WinRT ([Windows.Storage.StorageFile]::GetFileFromPathAsync($overlayPath)) ([Windows.Storage.StorageFile])
$overlayClip = Await-WinRT ([Windows.Media.Editing.MediaClip]::CreateFromImageFileAsync($overlayFile, $duration)) ([Windows.Media.Editing.MediaClip])
$overlay = New-Object Windows.Media.Editing.MediaOverlay ($overlayClip)
$overlay.Position = [Windows.Foundation.Rect]::new(0, 0, $W, $H)
$overlay.Opacity = 1.0
$layer = New-Object Windows.Media.Editing.MediaOverlayLayer
$layer.Overlays.Add($overlay)
$composition.OverlayLayers.Add($layer)

# Background color (letterbox gaps if any)
try {
  $composition.BackgroundColor = [Windows.UI.Color]::FromArgb(255, 17, 17, 17)
} catch {}

# Output files
$deskPath = Join-Path $desktop $OutName
$projPath = Join-Path $outDir $OutName
foreach ($p in @($deskPath, $projPath)) {
  if (Test-Path $p) { Remove-Item $p -Force }
}

$deskFolder = Await-WinRT ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync($desktop)) ([Windows.Storage.StorageFolder])
$projFolder = Await-WinRT ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync($outDir)) ([Windows.Storage.StorageFolder])

$profile = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateMp4(
  [Windows.Media.MediaProperties.VideoEncodingQuality]::HD1080p
)
# Force 1080x1920 if possible
try {
  $profile.Video.Width = [uint32]$W
  $profile.Video.Height = [uint32]$H
} catch {}

Write-Output "Rendering branded reel (this can take a bit)..."
$deskOut = Await-WinRT ($deskFolder.CreateFileAsync($OutName, [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])
$result = Await-WinRT ($composition.RenderToFileAsync($deskOut, [Windows.Media.Editing.MediaTrimmingPreference]::Precise, $profile)) ([Windows.Media.Transcoding.TranscodeFailureReason])
Write-Output "Desktop render result: $result"

# Copy to project exports
Copy-Item $deskPath $projPath -Force
Write-Output "Saved: $deskPath"
Write-Output "Saved: $projPath"
