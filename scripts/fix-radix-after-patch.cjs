/**
 * Corrige la aplicación errónea del parche de @radix-ui/react-select:
 * patch-package a veces aplica "..." en la línea nativeSelectKey (línea 77) en lugar del array children.
 * Este script deshace ese error y asegura el spread solo en el array children.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const base = path.join(root, 'node_modules/@radix-ui/react-select/dist');
const files = ['index.js', 'index.mjs'];

for (const name of files) {
  const filePath = path.join(base, name);
  if (!fs.existsSync(filePath)) continue;
  let c = fs.readFileSync(filePath, 'utf8');
  const orig = c;
  // Quitar "..." erróneo en la línea nativeSelectKey (no debe ir antes de Array.from ahí)
  c = c.replace(
    /nativeSelectKey\s*=\s*\.\.\.Array\.from\(nativeOptionsSet\)\.map/g,
    'nativeSelectKey = Array.from(nativeOptionsSet).map'
  );
  // Asegurar "..." en el array children (único contexto: línea seguida de "            ]")
  c = c.replace(
    /Array\.from\(nativeOptionsSet\)(\r?\n\s+\])/g,
    (_, bracket) => '...Array.from(nativeOptionsSet)' + bracket
  );
  if (c !== orig) fs.writeFileSync(filePath, c);
}
