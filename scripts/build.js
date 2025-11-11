const fs = require('fs').promises;
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');
const OUT = path.resolve(__dirname, '..', 'dist');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyRecursive(src, dest) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await ensureDir(dest);
    const items = await fs.readdir(src);
    await Promise.all(items.map(i => copyRecursive(path.join(src, i), path.join(dest, i))));
  } else {
    await ensureDir(path.dirname(dest));
    await fs.copyFile(src, dest);
  }
}

async function readFileSafe(file) {
  try { return await fs.readFile(file, 'utf8'); }
  catch (e) { return ''; }
}

async function inlineIncludes(html) {
  // 1) handle comment includes: <!-- include: components/header.html -->
  html = html.replace(/<!--\s*include:\s*([^\s]+)\s*-->/gi, (m, rel) => {
    const file = path.join(SRC, rel);
    try { return require('fs').readFileSync(file, 'utf8'); } catch (e) { console.warn('Missing include', rel); return ''; }
  });

  // 2) handle <tag ... data-include="path"></tag> (empty inner)
  html = html.replace(/<([a-z0-9-]+)([^>]*)\sdata-include\s*=\s*"([^"]+)"([^>]*)>\s*<\/\1>/gis, (m, tag, before, rel, after) => {
    const file = path.join(SRC, rel);
    try { return require('fs').readFileSync(file, 'utf8'); } catch (e) { console.warn('Missing include', rel); return ''; }
  });

  return html;
}

async function build() {
  await fs.rm(OUT, { recursive: true, force: true });
  await ensureDir(OUT);

  // Read template index.html
  const indexPath = path.join(SRC, 'index.html');
  let html = await readFileSafe(indexPath);
  html = await inlineIncludes(html);

  // write processed index.html
  await fs.writeFile(path.join(OUT, 'index.html'), html, 'utf8');

  // copy static assets (styles, scripts, assets, components if needed)
  const toCopy = ['styles', 'scripts', 'assets', 'components'];
  for (const name of toCopy) {
    const srcPath = path.join(SRC, name);
    try {
      const destPath = path.join(OUT, name);
      await copyRecursive(srcPath, destPath);
    } catch (e) {
      // ignore missing dirs
    }
  }

  console.log('Build complete →', OUT);
}

build().catch(err => { console.error(err); process.exit(1); });