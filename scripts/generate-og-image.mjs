/* global Buffer, console */
/**
 * Generate OG default image (1200×630) for social sharing.
 * Uses sharp + SVG overlay. Run: node scripts/generate-og-image.mjs
 */
import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../public/images/og-default.png');

// Brand colors from the portfolio
const BG_COLOR = '#0f172a'; // Dark navy (slate-900)
const ACCENT_BLUE = '#3b82f6'; // Primary blue
const ACCENT_TEAL = '#2563eb'; // Darker blue
const TEXT_WHITE = '#f1f5f9'; // slate-100
const TEXT_GRAY = '#94a3b8'; // slate-400
const ACCENT_PURPLE = '#a855f7'; // Purple for code brackets

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BG_COLOR}" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <!-- Accent gradient for decorative elements -->
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${ACCENT_BLUE}" />
      <stop offset="100%" stop-color="${ACCENT_PURPLE}" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />

  <!-- Subtle grid pattern -->
  <g opacity="0.04">
    ${Array.from({ length: 30 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${HEIGHT}" stroke="${TEXT_WHITE}" stroke-width="1" />`).join('\n    ')}
    ${Array.from({ length: 16 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="${WIDTH}" y2="${i * 40}" stroke="${TEXT_WHITE}" stroke-width="1" />`).join('\n    ')}
  </g>

  <!-- Decorative circles -->
  <circle cx="100" cy="530" r="180" fill="${ACCENT_BLUE}" opacity="0.06" />
  <circle cx="1100" cy="100" r="200" fill="${ACCENT_PURPLE}" opacity="0.06" />

  <!-- Top accent line -->
  <rect x="0" y="0" width="${WIDTH}" height="4" fill="url(#accent)" />

  <!-- Code brackets decorative element -->
  <g transform="translate(460, 180)" opacity="0.15">
    <text font-family="monospace" font-size="120" fill="${ACCENT_PURPLE}" font-weight="bold">&lt;/&gt;</text>
  </g>

  <!-- Main title: ChrisBP -->
  <text x="600" y="300" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="96" font-weight="800" fill="${TEXT_WHITE}" letter-spacing="-2">
    Chris<tspan fill="${ACCENT_BLUE}">B</tspan><tspan fill="${ACCENT_TEAL}">P</tspan>
  </text>

  <!-- Subtitle -->
  <text x="600" y="370" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="32" fill="${TEXT_GRAY}" letter-spacing="6" font-weight="300">
    FULL-STACK DEVELOPER
  </text>

  <!-- Bottom accent line -->
  <line x1="450" y1="410" x2="750" y2="410" stroke="url(#accent)" stroke-width="3" stroke-linecap="round" />

  <!-- Portfolio tagline -->
  <text x="600" y="460" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="20" fill="${TEXT_GRAY}" opacity="0.7">
    Portfolio &amp; Projects
  </text>

  <!-- Bottom border accent -->
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="url(#accent)" />
</svg>`;

const image = await sharp(Buffer.from(svg))
  .resize(WIDTH, HEIGHT)
  .png({ compressionLevel: 9, quality: 85 })
  .toFile(OUTPUT);

console.log(`✅ OG image generated: ${OUTPUT}`);
console.log(`   Size: ${WIDTH}×${HEIGHT}`);
console.log(`   File size: ${(image.size / 1024).toFixed(1)} KB`);
