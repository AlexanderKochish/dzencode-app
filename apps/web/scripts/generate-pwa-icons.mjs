/**
 * PWA icon generator script.
 *
 * Usage:
 *   npm i -D sharp          (one-time dev dep)
 *   node scripts/generate-pwa-icons.mjs
 *
 * Generates all required PNG icons for the PWA manifest.
 */

import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ICONS_DIR = join(__dirname, '..', 'public', 'icons')

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const MASKABLE_SIZES = [192, 512]

const BG_COLOR = '#1a1a2e'
const TEXT_COLOR = '#ffffff'

function createSvg(size, maskable = false) {
  const fontSize = Math.round(size * (maskable ? 0.32 : 0.4))
  const rx = maskable ? 0 : Math.round(size * 0.1)

  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${BG_COLOR}" rx="${rx}"/>
      <text x="50%" y="54%" font-family="Arial,Helvetica,sans-serif"
            font-size="${fontSize}" font-weight="bold" fill="${TEXT_COLOR}"
            text-anchor="middle" dominant-baseline="middle">IN</text>
    </svg>
  `)
}

async function generate() {
  mkdirSync(ICONS_DIR, { recursive: true })

  for (const size of SIZES) {
    const file = join(ICONS_DIR, `icon-${size}x${size}.png`)
    await sharp(createSvg(size)).resize(size, size).png().toFile(file)
    console.log(`  ✓ icon-${size}x${size}.png`)
  }

  for (const size of MASKABLE_SIZES) {
    const file = join(ICONS_DIR, `icon-maskable-${size}x${size}.png`)
    await sharp(createSvg(size, true)).resize(size, size).png().toFile(file)
    console.log(`  ✓ icon-maskable-${size}x${size}.png`)
  }

  console.log('\n✅ All PWA icons generated!')
}

generate().catch(console.error)
