# Burn Lay-n-Go branding onto Wells Maine Traveler videos (real MP4 output)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$ffmpeg = Get-ChildItem (Join-Path $root "tools\ffmpeg") -Recurse -Filter "ffmpeg.exe" | Select-Object -First 1 -ExpandProperty FullName
if (-not $ffmpeg) { throw "ffmpeg.exe not found under tools/ffmpeg" }

$fontDir = "d:\My Drive\Lay-n-Go\Branding\26-08-12_Lay-n-Go AI Brand Guides"
$logoPath = Join-Path $root "public\layngo-logo-outlined.png"
$shoot = "c:\Users\adam\Downloads\26-08-12_Lay-n-Go Maine Photo Shoot - Wells Maine"
$workDir = Join-Path $root "exports\social\_weekend-traveler-src"
$outDir = Join-Path $root "exports\social"
$desktop = [Environment]::GetFolderPath("Desktop")
New-Item -ItemType Directory -Force -Path $workDir, $outDir | Out-Null

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

function New-OverlayPng {
  param([string]$OutPath, [string]$Eyebrow, [string[]]$HeadlineLines, [string]$Subline, [int]$HeadSize = 110)
  $W = 1080; $H = 1920
  $BRAND = [System.Drawing.Color]::FromArgb(58, 159, 176)
  $AQUA = [System.Drawing.Color]::FromArgb(127, 212, 227)
  $SOFT = [System.Drawing.Color]::FromArgb(245, 245, 242)
  $WHITE = [System.Drawing.Color]::White
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.SmoothingMode = "HighQuality"
  $g.TextRenderingHint = "AntiAliasGridFit"
  $tb = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, 0), (New-Object System.Drawing.Point 0, 560),
    [System.Drawing.Color]::FromArgb(170, 8, 8, 8), [System.Drawing.Color]::FromArgb(0, 8, 8, 8))
  $g.FillRectangle($tb, 0, 0, $W, 560); $tb.Dispose()
  $bb = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, ($H - 320)), (New-Object System.Drawing.Point 0, $H),
    [System.Drawing.Color]::FromArgb(0, 8, 8, 8), [System.Drawing.Color]::FromArgb(160, 8, 8, 8))
  $g.FillRectangle($bb, 0, ($H - 320), $W, 320); $bb.Dispose()
  $logo = [System.Drawing.Image]::FromFile($logoPath)
  $logoW = 180; $logoH = [int]($logo.Height * ($logoW / [double]$logo.Width))
  $g.DrawImage($logo, (New-Object System.Drawing.Rectangle 52, 56, $logoW, $logoH))
  $brushAqua = New-Object System.Drawing.SolidBrush $AQUA
  $brushWhite = New-Object System.Drawing.SolidBrush $WHITE
  $brushSoft = New-Object System.Drawing.SolidBrush $SOFT
  $brushBrand = New-Object System.Drawing.SolidBrush $BRAND
  $fontEyebrow = New-PxFont $famXBold 26 ([System.Drawing.FontStyle]::Bold)
  $fontHead = New-PxFont $famBlack $HeadSize ([System.Drawing.FontStyle]::Bold)
  $fontSub = New-PxFont $famRegular 34
  $fontTag = New-PxFont $famXBold 24 ([System.Drawing.FontStyle]::Bold)
  $fontUrl = New-PxFont $famRegular 18 ([System.Drawing.FontStyle]::Bold)
  $x = 52; $y = 56 + $logoH + 40
  $g.DrawString($Eyebrow.ToUpper(), $fontEyebrow, $brushAqua, $x, $y); $y += 44
  foreach ($line in $HeadlineLines) {
    $g.DrawString($line.ToUpper(), $fontHead, $brushWhite, $x, $y)
    $y += [int]($HeadSize * 0.90)
  }
  $y += 8
  $g.DrawString($Subline, $fontSub, $brushSoft, $x, $y); $y += 54
  $pen = New-Object System.Drawing.Pen $BRAND, 4
  $g.DrawLine($pen, $x, $y, ($x + 88), $y); $pen.Dispose()
  $g.DrawString("LAY-N-GO TRAVELER", $fontTag, $brushWhite, 52, ($H - 110))
  $g.DrawString("WELLS, MAINE  |  LAYNGO.COM", $fontUrl, $brushBrand, 52, ($H - 70))
  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $logo.Dispose()
}

function Brand-Video {
  param([string]$VideoPath, [string]$OutBase, [string]$Eyebrow, [string[]]$HeadlineLines, [string]$Subline, [int]$HeadSize = 110)
  if (-not (Test-Path $VideoPath)) { Write-Output "SKIP missing $VideoPath"; return }
  $overlay = Join-Path $workDir ("overlay-video-" + $OutBase + ".png")
  New-OverlayPng -OutPath $overlay -Eyebrow $Eyebrow -HeadlineLines $HeadlineLines -Subline $Subline -HeadSize $HeadSize
  $deskOut = Join-Path $desktop ($OutBase + ".mp4")
  $projOut = Join-Path $outDir ($OutBase + ".mp4")
  $filter = "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[bg];[bg][1:v]overlay=0:0:format=auto,format=yuv420p"
  $log = Join-Path $workDir ("ffmpeg-" + $OutBase + ".log")
  $argLine = "-y -i `"$VideoPath`" -i `"$overlay`" -filter_complex `"$filter`" -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 128k -movflags +faststart -shortest `"$deskOut`""
  $p = Start-Process -FilePath $ffmpeg -ArgumentList $argLine -Wait -PassThru -NoNewWindow -RedirectStandardError $log
  if ($p.ExitCode -ne 0 -or -not (Test-Path $deskOut)) {
    Write-Output "FFMPEG FAILED ($($p.ExitCode)) for $OutBase"
    Get-Content $log -Tail 25
    return
  }
  Copy-Item $deskOut $projOut -Force
  Write-Output "BRANDED: $deskOut"
}

# Process all Wells clips we have been working through
Brand-Video (Join-Path $shoot "PXL_20260810_115133124.TS.mp4") "Lay-n-Go-Traveler-Wells-Beach-Days-BRANDED-01" "Traveler" @("Beach","Days") "Lays flat. Closes compact." 128
Brand-Video (Join-Path $shoot "PXL_20260810_115209581.TS.mp4") "Lay-n-Go-Traveler-Wells-Pack-Light-BRANDED-02" "Traveler" @("Pack","Light") "Carry everything you need." 128
Brand-Video (Join-Path $shoot "PXL_20260810_224805154.TS.mp4") "Lay-n-Go-Traveler-Wells-Maine-Nights-BRANDED-03" "Traveler" @("Maine","Nights") "Dinner with a view." 128
Brand-Video (Join-Path $shoot "PXL_20260811_130113502.TS.mp4") "Lay-n-Go-Traveler-Wells-Cinch-Closed-BRANDED-04" "Traveler" @("Cinch","Closed") "Pack light. Carry everything." 128
Brand-Video (Join-Path $shoot "PXL_20260811_130130372.TS.mp4") "Lay-n-Go-Traveler-Wells-Always-Ready-BRANDED-05" "Traveler" @("Always","Ready") "Lays flat. Closes compact." 118
Brand-Video (Join-Path $shoot "PXL_20260811_130457529.TS.mp4") "Lay-n-Go-Traveler-Wells-Go-Anywhere-BRANDED-06" "Traveler" @("Go","Anywhere") "Pack light. Carry everything." 110
Brand-Video (Join-Path $shoot "PXL_20260811_133841667.TS.mp4") "Lay-n-Go-Traveler-Wells-Open-Flat-BRANDED-07" "Traveler" @("Open","Flat") "No digging. No dumping." 128
Brand-Video (Join-Path $shoot "PXL_20260811_134020737.TS.mp4") "Lay-n-Go-Traveler-Wells-See-Everything-BRANDED-08" "Traveler" @("See","Everything") "No digging. No dumping." 100

Write-Output "ALL DONE"
explorer /select,(Join-Path $desktop "Lay-n-Go-Traveler-Wells-See-Everything-BRANDED-08.mp4")
