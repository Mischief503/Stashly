// Generates Android launcher icons from resources/*.png into the native project.
const sharp = require('sharp');
const fs = require('fs'), path = require('path');
const res = path.join('android','app','src','main','res');
const dens = { mdpi:1, hdpi:1.5, xhdpi:2, xxhdpi:3, xxxhdpi:4 };
(async () => {
  for (const [d, m] of Object.entries(dens)) {
    const dir = path.join(res, 'mipmap-' + d);
    const legacy = Math.round(48*m), fg = Math.round(108*m);
    await sharp('resources/icon-512.png').resize(legacy, legacy).toFile(path.join(dir,'ic_launcher.png'));
    const mask = Buffer.from(`<svg width="${legacy}" height="${legacy}"><circle cx="${legacy/2}" cy="${legacy/2}" r="${legacy/2}"/></svg>`);
    await sharp('resources/icon-512.png').resize(legacy, legacy).composite([{input:mask, blend:'dest-in'}]).png().toFile(path.join(dir,'ic_launcher_round.png'));
    await sharp('resources/icon-maskable-512.png').resize(fg, fg).toFile(path.join(dir,'ic_launcher_foreground.png'));
  }
  fs.writeFileSync(path.join(res,'values','ic_launcher_background.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#5A8FD6</color>\n</resources>\n');
  // Adaptive icon: use the PNG foreground
  for (const n of ['ic_launcher','ic_launcher_round'])
    fs.writeFileSync(path.join(res,'mipmap-anydpi-v26',n+'.xml'),
`<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`);
  console.log('icons done');
})();
