#!/usr/bin/env node

/**
 * Script to download and optimize images for local hosting
 * Downloads boss and character images, converts to WebP at 192x192px @ 85% quality
 */

import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT_DIR, 'public');

// Boss images mapping
const bossImages = [
  {
    url: 'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_MandragoraElite.png',
    output: 'hexadecatonic-mandragora',
  },
  {
    url: 'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_Gastrobot01.png',
    output: 'knuckle-duckle',
  },
  {
    url: 'https://api.lunaris.moe/data/assets/leyline/UI_Img_LeyLineChallenge_DragonCollar.png',
    output: 'secret-source-automaton',
  },
];

// Character icons mapping - extracted from src/data/characters.ts
// Format: { id: character-id, icon: UI_AvatarIcon_XXX }
const characterImages = [
  { id: 'albedo', icon: 'UI_AvatarIcon_Albedo' },
  { id: 'alhaitham', icon: 'UI_AvatarIcon_Alhatham' },
  { id: 'aloy', icon: 'UI_AvatarIcon_Aloy' },
  { id: 'amber', icon: 'UI_AvatarIcon_Ambor' },
  { id: 'itto', icon: 'UI_AvatarIcon_Itto' },
  { id: 'arlecchino', icon: 'UI_AvatarIcon_Arlecchino' },
  { id: 'baizhu', icon: 'UI_AvatarIcon_Baizhuer' },
  { id: 'barbara', icon: 'UI_AvatarIcon_Barbara' },
  { id: 'beidou', icon: 'UI_AvatarIcon_Beidou' },
  { id: 'bennett', icon: 'UI_AvatarIcon_Bennett' },
  { id: 'candace', icon: 'UI_AvatarIcon_Candace' },
  { id: 'charlotte', icon: 'UI_AvatarIcon_Charlotte' },
  { id: 'chasca', icon: 'UI_AvatarIcon_Chasca' },
  { id: 'chevreuse', icon: 'UI_AvatarIcon_Chevreuse' },
  { id: 'chiori', icon: 'UI_AvatarIcon_Chiori' },
  { id: 'chongyun', icon: 'UI_AvatarIcon_Chongyun' },
  { id: 'citlali', icon: 'UI_AvatarIcon_Citlali' },
  { id: 'clorinde', icon: 'UI_AvatarIcon_Clorinde' },
  { id: 'collei', icon: 'UI_AvatarIcon_Collei' },
  { id: 'cyno', icon: 'UI_AvatarIcon_Cyno' },
  { id: 'dahlia', icon: 'UI_AvatarIcon_Dahlia' },
  { id: 'dehya', icon: 'UI_AvatarIcon_Dehya' },
  { id: 'diluc', icon: 'UI_AvatarIcon_Diluc' },
  { id: 'diona', icon: 'UI_AvatarIcon_Diona' },
  { id: 'dori', icon: 'UI_AvatarIcon_Dori' },
  { id: 'emilie', icon: 'UI_AvatarIcon_Emilie' },
  { id: 'escoffier', icon: 'UI_AvatarIcon_Escoffier' },
  { id: 'eula', icon: 'UI_AvatarIcon_Eula' },
  { id: 'faruzan', icon: 'UI_AvatarIcon_Faruzan' },
  { id: 'fischl', icon: 'UI_AvatarIcon_Fischl' },
  { id: 'freminet', icon: 'UI_AvatarIcon_Freminet' },
  { id: 'furina', icon: 'UI_AvatarIcon_Furina' },
  { id: 'gaming', icon: 'UI_AvatarIcon_Gaming' },
  { id: 'ganyu', icon: 'UI_AvatarIcon_Ganyu' },
  { id: 'gorou', icon: 'UI_AvatarIcon_Gorou' },
  { id: 'hu-tao', icon: 'UI_AvatarIcon_Hutao' },
  { id: 'iansan', icon: 'UI_AvatarIcon_Iansan' },
  { id: 'ifa', icon: 'UI_AvatarIcon_Ifa' },
  { id: 'illuga', icon: 'UI_AvatarIcon_Illuga' },
  { id: 'jean', icon: 'UI_AvatarIcon_Qin' },
  { id: 'kachina', icon: 'UI_AvatarIcon_Kachina' },
  { id: 'kazuha', icon: 'UI_AvatarIcon_Kazuha' },
  { id: 'kaeya', icon: 'UI_AvatarIcon_Kaeya' },
  { id: 'kamisato-ayaka', icon: 'UI_AvatarIcon_Ayaka' },
  { id: 'ayato', icon: 'UI_AvatarIcon_Ayato' },
  { id: 'kaveh', icon: 'UI_AvatarIcon_Kaveh' },
  { id: 'keqing', icon: 'UI_AvatarIcon_Keqing' },
  { id: 'kinich', icon: 'UI_AvatarIcon_Kinich' },
  { id: 'kirara', icon: 'UI_AvatarIcon_Momoka' },
  { id: 'klee', icon: 'UI_AvatarIcon_Klee' },
  { id: 'sara', icon: 'UI_AvatarIcon_Sara' },
  { id: 'kuki-shinobu', icon: 'UI_AvatarIcon_Shinobu' },
  { id: 'lan-yan', icon: 'UI_AvatarIcon_Lanyan' },
  { id: 'layla', icon: 'UI_AvatarIcon_Layla' },
  { id: 'lisa', icon: 'UI_AvatarIcon_Lisa' },
  { id: 'lynette', icon: 'UI_AvatarIcon_Linette' },
  { id: 'lyney', icon: 'UI_AvatarIcon_Liney' },
  { id: 'mavuika', icon: 'UI_AvatarIcon_Mavuika' },
  { id: 'mika', icon: 'UI_AvatarIcon_Mika' },
  { id: 'mona', icon: 'UI_AvatarIcon_Mona' },
  { id: 'mualani', icon: 'UI_AvatarIcon_Mualani' },
  { id: 'nahida', icon: 'UI_AvatarIcon_Nahida' },
  { id: 'navia', icon: 'UI_AvatarIcon_Navia' },
  { id: 'neuvillette', icon: 'UI_AvatarIcon_Neuvillette' },
  { id: 'nilou', icon: 'UI_AvatarIcon_Nilou' },
  { id: 'ningguang', icon: 'UI_AvatarIcon_Ningguang' },
  { id: 'noelle', icon: 'UI_AvatarIcon_Noel' },
  { id: 'ororon', icon: 'UI_AvatarIcon_Olorun' },
  { id: 'qiqi', icon: 'UI_AvatarIcon_Qiqi' },
  { id: 'raiden-shogun', icon: 'UI_AvatarIcon_Shougun' },
  { id: 'razor', icon: 'UI_AvatarIcon_Razor' },
  { id: 'rosaria', icon: 'UI_AvatarIcon_Rosaria' },
  { id: 'kokomi', icon: 'UI_AvatarIcon_Kokomi' },
  { id: 'sayu', icon: 'UI_AvatarIcon_Sayu' },
  { id: 'sethos', icon: 'UI_AvatarIcon_Sethos' },
  { id: 'shenhe', icon: 'UI_AvatarIcon_Shenhe' },
  { id: 'heizou', icon: 'UI_AvatarIcon_Heizo' },
  { id: 'sigewinne', icon: 'UI_AvatarIcon_Sigewinne' },
  { id: 'skirk', icon: 'UI_AvatarIcon_SkirkNew' },
  { id: 'sucrose', icon: 'UI_AvatarIcon_Sucrose' },
  { id: 'tartaglia', icon: 'UI_AvatarIcon_Tartaglia' },
  { id: 'thoma', icon: 'UI_AvatarIcon_Tohma' },
  { id: 'tighnari', icon: 'UI_AvatarIcon_Tighnari' },
  { id: 'traveler', icon: 'UI_AvatarIcon_PlayerBoy' },
  { id: 'varesa', icon: 'UI_AvatarIcon_Varesa' },
  { id: 'venti', icon: 'UI_AvatarIcon_Venti' },
  { id: 'wanderer', icon: 'UI_AvatarIcon_Wanderer' },
  { id: 'wriothesley', icon: 'UI_AvatarIcon_Wriothesley' },
  { id: 'xiangling', icon: 'UI_AvatarIcon_Xiangling' },
  { id: 'xianyun', icon: 'UI_AvatarIcon_Liuyun' },
  { id: 'xiao', icon: 'UI_AvatarIcon_Xiao' },
  { id: 'xilonen', icon: 'UI_AvatarIcon_Xilonen' },
  { id: 'xingqiu', icon: 'UI_AvatarIcon_Xingqiu' },
  { id: 'xinyan', icon: 'UI_AvatarIcon_Xinyan' },
  { id: 'yae-miko', icon: 'UI_AvatarIcon_Yae' },
  { id: 'yanfei', icon: 'UI_AvatarIcon_Feiyan' },
  { id: 'yaoyao', icon: 'UI_AvatarIcon_Yaoyao' },
  { id: 'yelan', icon: 'UI_AvatarIcon_Yelan' },
  { id: 'yoimiya', icon: 'UI_AvatarIcon_Yoimiya' },
  { id: 'yumemizuki-mizuki', icon: 'UI_AvatarIcon_Mizuki' },
  { id: 'yun-jin', icon: 'UI_AvatarIcon_Yunjin' },
  { id: 'zhongli', icon: 'UI_AvatarIcon_Zhongli' },
  { id: 'zibai', icon: 'UI_AvatarIcon_Zibai' },
];

// Image processing settings
const IMAGE_SIZE = 192; // 2x 96px for retina
const WEBP_QUALITY = 85;

// Enka CDN base URL
const ENKA_CDN_BASE = 'https://enka.network/ui';

/**
 * Ensure a directory exists
 */
async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Download an image from a URL
 */
async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Process an image: resize and convert to WebP
 */
async function processImage(buffer, outputPath) {
  await sharp(buffer)
    .resize(IMAGE_SIZE, IMAGE_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);
}

/**
 * Get file size in a human-readable format
 */
async function getFileSize(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Main function to download and process all images
 */
async function main() {
  console.log('🖼️  Image Download and Optimization Script\n');
  console.log(`Settings: ${IMAGE_SIZE}x${IMAGE_SIZE}px, WebP @ ${WEBP_QUALITY}%\n`);

  const results = {
    success: [],
    failed: [],
  };

  // Ensure directories exist
  const bossesDir = join(PUBLIC_DIR, 'bosses');
  const charactersDir = join(PUBLIC_DIR, 'characters');

  await ensureDir(bossesDir);
  await ensureDir(charactersDir);

  // Process boss images
  console.log('📥 Downloading boss images...');
  for (const boss of bossImages) {
    const outputPath = join(bossesDir, `${boss.output}.webp`);
    try {
      process.stdout.write(`  - ${boss.output}... `);
      const buffer = await downloadImage(boss.url);
      await processImage(buffer, outputPath);
      const fileSize = await getFileSize(outputPath);
      results.success.push({ name: boss.output, path: outputPath, size: fileSize });
      console.log(`✅ (${formatBytes(fileSize)})`);
    } catch (error) {
      results.failed.push({ name: boss.output, error: error.message });
      console.log(`❌ ${error.message}`);
    }
  }

  // Process character images
  console.log('\n📥 Downloading character images...');
  for (const char of characterImages) {
    const url = `${ENKA_CDN_BASE}/${char.icon}.png`;
    const outputPath = join(charactersDir, `${char.id}.webp`);
    try {
      process.stdout.write(`  - ${char.id}... `);
      const buffer = await downloadImage(url);
      await processImage(buffer, outputPath);
      const fileSize = await getFileSize(outputPath);
      results.success.push({ name: char.id, path: outputPath, size: fileSize });
      console.log(`✅ (${formatBytes(fileSize)})`);
    } catch (error) {
      results.failed.push({ name: char.id, error: error.message });
      console.log(`❌ ${error.message}`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    for (const item of results.failed) {
      console.log(`  - ${item.name}: ${item.error}`);
    }
  }

  const totalSize = results.success.reduce((sum, item) => sum + item.size, 0);
  console.log(`\n📦 Total size: ${formatBytes(totalSize)}`);
  console.log(`📁 Output directories:`);
  console.log(`   - ${bossesDir}`);
  console.log(`   - ${charactersDir}`);

  // Return exit code based on failures
  process.exit(results.failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
