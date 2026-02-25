/**
 * Fix incorrect application of @radix-ui/react-select patch:
 * patch-package sometimes applies "..." on the nativeSelectKey line (line 77) instead of the children array.
 * This script undoes that error and ensures the spread is only on the children array.
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
  // Remove erroneous "..." on nativeSelectKey line (must not go before Array.from there)
  c = c.replace(
    /nativeSelectKey\s*=\s*\.\.\.Array\.from\(nativeOptionsSet\)\.map/g,
    'nativeSelectKey = Array.from(nativeOptionsSet).map'
  );
  // Normalize: never more than one "..." before Array.from(nativeOptionsSet) (avoids ...... from double runs)
  c = c.replace(/\.{3,}Array\.from\(nativeOptionsSet\)/g, '...Array.from(nativeOptionsSet)');
  // Ensure "..." on children array only if not already present (idempotent)
  c = c.replace(
    /(\.\.\.)?Array\.from\(nativeOptionsSet\)(\r?\n\s+\])/g,
    (_, existing, bracket) => (existing ? existing : '...') + 'Array.from(nativeOptionsSet)' + bracket
  );
  if (c !== orig) fs.writeFileSync(filePath, c);
}
