const sharp = require('sharp');
const path = require('path');

async function convertIcon() {
  try {
    await sharp('assets/amethyst_launcher.svg')
      .png()
      .resize(256, 256, { fit: 'contain', background: { r: 10, g: 10, b: 15, alpha: 0 } })
      .toFile('assets/amethyst_launcher.png');
    
    console.log('✅ Icon converted: amethyst_launcher.svg → amethyst_launcher.png');
  } catch (err) {
    console.error('❌ Conversion error:', err);
  }
}

convertIcon();
