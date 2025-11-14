# PowerShell скрипт для копирования и переименования изображений устройств
# Сопоставление файлов из источника с slug моделей в БД

$sourceDir = "C:\Users\prose\Downloads\imgscp"
$targetDir = "C:\Users\prose\Automation\projects\mojservice\public\images\devices"

# Создание целевых директорий
New-Item -ItemType Directory -Force -Path "$targetDir\iphone" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\ipad" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\apple-watch" | Out-Null

Write-Host "🔄 Копирование изображений iPhone..." -ForegroundColor Cyan

# iPhone маппинг (source_file => target_slug)
$iphoneMapping = @{
    # iPhone 17 series
    "xiphone-17-pro-max.png.pagespeed.ic.918A1VA9cg.png" = "iphone-17-pro-max.png"
    "xiphone-17-pro.png.pagespeed.ic.Myo7FLNf5C.png" = "iphone-17-pro.png"
    "xiphone-17air.png.pagespeed.ic.eHT2Syko0B.png" = "iphone-air.png"
    "xiphone-17-storage-select-202509-sage_2-1-1.png.pagespeed.ic.mEcTd6-4ec.png" = "iphone-17.png"

    # iPhone 16 series
    "x16pm-1.png.pagespeed.ic.uKplh2cC15.png" = "iphone-16-pro-max.png"
    "x16pro.png.pagespeed.ic.KWKnooiMxy.png" = "iphone-16-pro.png"
    "x16plus.png.pagespeed.ic.eoBJYPTc3j.png" = "iphone-16-plus.png"
    "x16.png.pagespeed.ic.B200TTXVeE.png" = "iphone-16.png"

    # iPhone 15 series
    "xapple-iphone-15-pro-max-300x300.jpg.pagespeed.ic.pQfWTWawIh.webp" = "iphone-15-pro-max.webp"
    "xiphone-15-300x300.png.pagespeed.ic.4qJcjy_nYn.png" = "iphone-15.png"

    # iPhone 14 series
    "iphone-14-pro-max-300x300.png" = "iphone-14-pro-max.png"
    "iphone-14-pro-300x300.png" = "iphone-14-pro.png"
    "iphone-14-plus-300x300.png" = "iphone-14-plus.png"
    "iphone-14-2-300x300.png" = "iphone-14.png"

    # iPhone 13 series
    "xiphone-13-pro-max.jpg.pagespeed.ic.uS2vWTHq_x.webp" = "iphone-13-pro-max.webp"
    "xiphone-13-pro.jpg.pagespeed.ic.8xHIU9PXDE.webp" = "iphone-13-pro.webp"
    "iphone-13-300x300.png" = "iphone-13.png"
    "xiphone-13-mini.jpg.pagespeed.ic.UGnurqDpE_.webp" = "iphone-13-mini.webp"

    # iPhone 12 series
    "xiphone-12-pro-max.jpg.pagespeed.ic.f-SWUigUqR.webp" = "iphone-12-pro-max.webp"
    "xiphone-12-pro.jpg.pagespeed.ic.0Dbo_YEaHW.webp" = "iphone-12-pro.webp"
    "xiphone-12.jpg.pagespeed.ic.-9UlJ-ZI0c.webp" = "iphone-12.webp"
    "xiphone-12-mini.jpg.pagespeed.ic.OAJiTsYWXt.webp" = "iphone-12-mini.webp"

    # iPhone 11 series
    "x11-pro-max.jpg.pagespeed.ic.BH4hQh29ka.webp" = "iphone-11-pro-max.webp"
    "xiphone-11-pro.jpg.pagespeed.ic.nqStKUjpuw.webp" = "iphone-11-pro.webp"
    "xiphone-11.jpg.pagespeed.ic.3pm0lD0EWQ.webp" = "iphone-11.webp"

    # iPhone X series
    "iphone-xr-1-300x300.png" = "iphone-xr.png"
    "xxsmax.jpg.pagespeed.ic.Z-OpbseUnF.webp" = "iphone-xs-max.webp"
    "xiphone-xs.jpg.pagespeed.ic.jP15Z4Nm8F.webp" = "iphone-xs.webp"
    "xiphone-x.jpg.pagespeed.ic.-pPcnewsIB.webp" = "iphone-x.webp"

    # iPhone 8 series
    "xiphone-8-plus.jpg.pagespeed.ic.HFIlvDzDMG.webp" = "iphone-8-plus.webp"
    "xiphone-8.jpg.pagespeed.ic.Pt6T7QFExE.webp" = "iphone-8.webp"

    # iPhone SE series
    "iphone-se-2-2022-300x300.png" = "iphone-se-2022.png"
    "xremont-iphone-se-2020.jpg.pagespeed.ic.ixaWidNuhN.webp" = "iphone-se-2020.webp"
}

foreach ($source in $iphoneMapping.Keys) {
    $target = $iphoneMapping[$source]
    $sourcePath = "$sourceDir\iphone\$source"
    $targetPath = "$targetDir\iphone\$target"

    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-Host "✅ $source → $target" -ForegroundColor Green
    } else {
        Write-Host "❌ Не найден: $source" -ForegroundColor Red
    }
}

Write-Host "`n🔄 Копирование изображений iPad..." -ForegroundColor Cyan

# iPad маппинг
$ipadMapping = @{
    # iPad Pro 13" (2024)
    "xipad-pro-13-2024.png.pagespeed.ic.AL7X8RJsZr.png" = "ipad-pro-13-2024.png"

    # iPad Pro 12.9" series
    "ipad-pro-12.9.-6-2022-300x300.png" = "ipad-pro-12-9-2022.png"
    "xapple-ipad-pro-12-9-2021.jpg.pagespeed.ic.mp9K7PYVXM.webp" = "ipad-pro-12-9-2021.webp"
    "xipad-pro-12-9-2020.jpg.pagespeed.ic.xkMSXsoIzC.webp" = "ipad-pro-12-9-2020.webp"
    "ipad-pro-12.9-2018-300x300.png" = "ipad-pro-12-9-2018.png"
    "ipad-pro-12.9-2017-300x300.png" = "ipad-pro-12-9-2017.png"
    "ipad-pro-12.9-2015-300x300.png" = "ipad-pro-12-9-2015.png"

    # iPad Pro 11" series
    "xipad-pro-11-5-2024.png.pagespeed.ic.6jxvgoxUw3.png" = "ipad-pro-11-2024.png"
    "ipad-pro-11.-4-2022-300x300.png" = "ipad-pro-11-2022.png"
    "xapple-ipad-pro-10-5-2021.jpg.pagespeed.ic.z7crY5yUNp.webp" = "ipad-pro-11-2021.webp"
    "xipad-pro-11-2020.jpg.pagespeed.ic.0rAIvrHfs9.webp" = "ipad-pro-11-2020.webp"
    "xipad-pro-11.jpg.pagespeed.ic.Z7fWfu_p2p.webp" = "ipad-pro-11-2018.webp"

    # iPad Pro 10.5" and 9.7"
    "xipad-pro-10-5.jpg.pagespeed.ic.RQolFYVBoc.webp" = "ipad-pro-10-5.webp"
    "ipad-pro-9.7-300x300.png" = "ipad-pro-9-7.png"

    # iPad mini series
    "xipad-mini-7-2024.png.pagespeed.ic.I7RFaLmwG7.png" = "ipad-mini-7.png"
    "xipad-6-mini.jpg.pagespeed.ic.jZPOL0FSvn.webp" = "ipad-mini-6.webp"
    "ipad-mini-5-300x300.png" = "ipad-mini-5.png"
    "xipad-mini_4.jpg.pagespeed.ic.KClnASTTpZ.webp" = "ipad-mini-4.webp"

    # iPad Air series
    "xipad-air-13-2024.png.pagespeed.ic.HwC7_wGkMG.png" = "ipad-air-13-2024.png"
    "xipad-air-11-2024.png.pagespeed.ic.UiVLMZrfWa.png" = "ipad-air-11-2024.png"
    "ipad-air-5-2022-300x300.png" = "ipad-air-5.png"
    "xipad-air-10.9.jpg.pagespeed.ic.h4rkUwIdIY.webp" = "ipad-air-4.webp"
    "xipad-air_3.jpg.pagespeed.ic.rnNtI4VrhV.webp" = "ipad-air-3.webp"
    "xipad-air_2.jpg.pagespeed.ic.5L8a1xBeKm.webp" = "ipad-air-2.webp"
    "xipad-air.jpg.pagespeed.ic.WgEMha2mxd.webp" = "ipad-air.webp"

    # Standard iPad series
    "ipad-10-2022-300x300.png" = "ipad-10-2022.png"
    "xipad-10-2.jpg.pagespeed.ic.2509MV1Y6C.webp" = "ipad-9-2021.webp"
    "xipad-8-2020.jpg.pagespeed.ic.nqdRExz-jd.webp" = "ipad-8-2020.webp"
    "xipad-4.jpg.pagespeed.ic.GSEWC0C2sJ.webp" = "ipad-7-2019.webp"
    "ipad-6-2018.png" = "ipad-6-2018.png"
    "xipad-3.jpg.pagespeed.ic.aoetSzzOx0.webp" = "ipad-5-2017.webp"
}

foreach ($source in $ipadMapping.Keys) {
    $target = $ipadMapping[$source]
    $sourcePath = "$sourceDir\ipad\$source"
    $targetPath = "$targetDir\ipad\$target"

    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-Host "✅ $source → $target" -ForegroundColor Green
    } else {
        Write-Host "❌ Не найден: $source" -ForegroundColor Red
    }
}

Write-Host "`n✨ Копирование завершено!" -ForegroundColor Green
Write-Host "📁 Изображения сохранены в: $targetDir" -ForegroundColor Cyan
