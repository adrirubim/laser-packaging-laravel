/**
 * Normaliza todos los *.patch en patches/ a LF y sin BOM.
 * patch-package 8 falla con "could not be parsed" si hay CRLF o BOM.
 * Ejecutar antes de patch-package en postinstall.
 */
const fs = require('fs');
const path = require('path');

const PATCHES_DIR = path.join(__dirname, '..', 'patches');
const LF = '\n';
const CR = '\r';
const CRLF = '\r\n';

function normalize(content) {
  if (typeof content !== 'string') return '';
  let c = content;
  if (c.length > 0 && c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
  c = c.split(CRLF).join(LF).split(CR).join(LF);
  if (c.length > 0 && c.charCodeAt(c.length - 1) !== 10) c += LF;
  return c;
}

try {
  if (!fs.existsSync(PATCHES_DIR)) process.exit(0);
  const files = fs.readdirSync(PATCHES_DIR).filter((f) => f.endsWith('.patch'));
  for (const file of files) {
    const filePath = path.join(PATCHES_DIR, file);
    const raw = fs.readFileSync(filePath);
    const content = raw.toString('utf8');
    const normalized = normalize(content);
    fs.writeFileSync(filePath, Buffer.from(normalized, 'utf8'));
  }
} catch (err) {
  console.error('normalize-patches:', err.message);
  process.exit(1);
}
