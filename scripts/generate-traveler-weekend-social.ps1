# Lay-n-Go TRAVELER weekend lifestyle posts - 1080x1350 (brand guide)
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$fontDir = "d:\My Drive\Lay-n-Go\Branding\26-08-12_Lay-n-Go AI Brand Guides"
$srcDir = Join-Path $root "exports\social\_weekend-traveler-src"
$outDir = Join-Path $root "exports\social"
$desktop = [Environment]::GetFolderPath("Desktop")
$logoPath = Join-Path $root "public\layngo-logo-outlined.png"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$W = 1080
$H = 1350
$BRAND = [System.Drawing.Color]::FromArgb(58, 159, 176)
$AQUA  = [System.Drawing.Color]::FromArgb(127, 212, 227)
$SOFT  = [System.Drawing.Color]::FromArgb(245, 245, 242)
$WHITE = [System.Drawing.Color]::White

$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile((Join-Path $fontDir "1.ttf"))
$pfc.AddFontFile((Join-Path $fontDir "2.ttf"))
$pfc.AddFontFile((Join-Path $fontDir "3.ttf"))
$famRegular = $pfc.Families | Where-Object { $_.Name -eq "League Spartan" } | Select-Object -First 1
$famBlack = $pfc.Families | Where-Object { $_.Name -like "*Black*" } | Select-Object -First 1
$famXBold = $pfc.Families | Where-Object { $_.Name -like "*ExtraBold*" } | Select-Object -First 1
if (-not $famBlack) { $famBlack = $famRegular }
if (-not $famXBold) { $famXBold = $famRegular }

function New-PxFont([System.Drawing.FontFamily]$fam, [float]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
  return New-Object System.Drawing.Font($fam, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-CoverImage([System.Drawing.Graphics]$g, [System.Drawing.Image]$img, [int]$cw, [int]$ch, [float]$focusY = 0.45) {
  $scale = [Math]::Max($cw / [double]$img.Width, $ch / [double]$img.Height)
  $dw = [int]($img.Width * $scale)
  $dh = [int]($img.Height * $scale)
  $dx = [int](($cw - $dw) / 2)
  $dy = [int](($ch - $dh) * $focusY)
  $g.DrawImage($img, $dx, $dy, $dw, $dh)
}

function Draw-Scrim([System.Drawing.Graphics]$g, [int]$cw, [int]$ch) {
  $topBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, 0),
    (New-Object System.Drawing.Point 0, 520),
    [System.Drawing.Color]::FromArgb(190, 8, 8, 8),
    [System.Drawing.Color]::FromArgb(0, 8, 8, 8)
  )
  $g.FillRectangle($topBrush, 0, 0, $cw, 520)
  $topBrush.Dispose()

  $botBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, ($ch - 360)),
    (New-Object System.Drawing.Point 0, $ch),
    [System.Drawing.Color]::FromArgb(0, 8, 8, 8),
    [System.Drawing.Color]::FromArgb(170, 8, 8, 8)
  )
  $g.FillRectangle($botBrush, 0, ($ch - 360), $cw, 360)
  $botBrush.Dispose()
}

function Export-Post {
  param(
    [string]$PhotoPath,
    [string]$OutName,
    [string]$Eyebrow,
    [string[]]$HeadlineLines,
    [string]$Subline,
    [float]$FocusY = 0.42
  )

  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear([System.Drawing.Color]::FromArgb(17, 17, 17))

  $photo = [System.Drawing.Image]::FromFile($PhotoPath)
  Draw-CoverImage $g $photo $W $H $FocusY
  Draw-Scrim $g $W $H

  $logo = [System.Drawing.Image]::FromFile($logoPath)
  $logoW = 168
  $logoH = [int]($logo.Height * ($logoW / [double]$logo.Width))
  $logoRect = New-Object System.Drawing.Rectangle 52, 48, $logoW, $logoH
  $g.DrawImage($logo, $logoRect)

  $brushSoft = New-Object System.Drawing.SolidBrush $SOFT
  $brushAqua = New-Object System.Drawing.SolidBrush $AQUA
  $brushBrand = New-Object System.Drawing.SolidBrush $BRAND
  $brushWhite = New-Object System.Drawing.SolidBrush $WHITE

  $fontEyebrow = New-PxFont $famXBold 26 ([System.Drawing.FontStyle]::Bold)
  $fontHead = New-PxFont $famBlack 118 ([System.Drawing.FontStyle]::Bold)
  $fontSub = New-PxFont $famRegular 34
  $fontTag = New-PxFont $famXBold 26 ([System.Drawing.FontStyle]::Bold)
  $fontUrl = New-PxFont $famRegular 18 ([System.Drawing.FontStyle]::Bold)

  $x = 52
  $y = 48 + $logoH + 36

  $g.DrawString($Eyebrow.ToUpper(), $fontEyebrow, $brushAqua, $x, $y)
  $y += 42

  foreach ($line in $HeadlineLines) {
    $g.DrawString($line.ToUpper(), $fontHead, $brushWhite, $x, $y)
    $y += 104
  }

  $y += 8
  $g.DrawString($Subline, $fontSub, $brushSoft, $x, $y)
  $y += 52

  $pen = New-Object System.Drawing.Pen $BRAND, 4
  $g.DrawLine($pen, $x, $y, ($x + 88), $y)
  $pen.Dispose()

  $g.DrawString("LAY-N-GO TRAVELER", $fontTag, $brushWhite, 52, ($H - 96))
  $g.DrawString("LAYNGO.COM", $fontUrl, $brushBrand, 52, ($H - 58))

  $outProject = Join-Path $outDir $OutName
  $outDesktop = Join-Path $desktop $OutName
  $bmp.Save($outProject, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Save($outDesktop, [System.Drawing.Imaging.ImageFormat]::Png)

  $g.Dispose(); $bmp.Dispose(); $photo.Dispose(); $logo.Dispose()
  $brushSoft.Dispose(); $brushAqua.Dispose(); $brushBrand.Dispose(); $brushWhite.Dispose()
  $fontEyebrow.Dispose(); $fontHead.Dispose(); $fontSub.Dispose(); $fontTag.Dispose(); $fontUrl.Dispose()

  Write-Output "Saved: $outDesktop"
  Write-Output "Saved: $outProject"
}

Export-Post `
  -PhotoPath (Join-Path $srcDir "01-traveler-deck-closed.png") `
  -OutName "traveler-weekend-01-cinch-closed-1080x1350.png" `
  -Eyebrow "Traveler" `
  -HeadlineLines @("Cinch", "Closed") `
  -Subline "Pack light. Carry everything." `
  -FocusY 0.48

Export-Post `
  -PhotoPath (Join-Path $srcDir "02-open-flat-sunscreen.png") `
  -OutName "traveler-weekend-02-open-flat-1080x1350.png" `
  -Eyebrow "Traveler" `
  -HeadlineLines @("Open", "Flat") `
  -Subline "No digging. No dumping." `
  -FocusY 0.55

Export-Post `
  -PhotoPath (Join-Path $srcDir "03-beach-boards-traveler.png") `
  -OutName "traveler-weekend-03-beach-days-1080x1350.png" `
  -Eyebrow "Traveler" `
  -HeadlineLines @("Beach", "Days") `
  -Subline "Lays flat. Closes compact." `
  -FocusY 0.38

Export-Post `
  -PhotoPath (Join-Path $srcDir "04-open-balcony-toiletries.png") `
  -OutName "traveler-weekend-04-whole-routine-1080x1350.png" `
  -Eyebrow "Traveler" `
  -HeadlineLines @("Whole", "Routine") `
  -Subline "Spread it out - then cinch it closed." `
  -FocusY 0.50

Write-Output "Done."
