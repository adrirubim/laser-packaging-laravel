#!/usr/bin/env bash
# Regenera el parche de @radix-ui/react-select con patch-package (git diff), formato que el parser acepta.
#
# Pasos (en este orden):
#   1. rm -rf node_modules && npm ci --ignore-scripts
#   2. bash scripts/regenerate-radix-patch.sh
#   3. rm -rf node_modules && npm ci   # comprobar que aplica bien
#   4. git add patches/ && git commit -m "fix: regenerate radix patch"

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f "node_modules/@radix-ui/react-select/dist/index.js" ]]; then
  echo "Antes ejecuta: rm -rf node_modules && npm ci --ignore-scripts"
  exit 1
fi

node -e "
const fs = require('fs');
const path = require('path');

const base = path.join(process.cwd(), 'node_modules/@radix-ui/react-select/dist');

const edits = [
  {
    file: path.join(base, 'index.js'),
    from: '(0, import_jsx_runtime.jsx)(\"option\", { value: \"\" }) : null',
    to: '(0, import_jsx_runtime.jsx)(\"option\", { value: \"\" }, \"select-empty-option\") : null'
  },
  {
    file: path.join(base, 'index.js'),
    from: '\"select-empty-option\") : null,\n              Array.from(nativeOptionsSet)\n            ]',
    to: '\"select-empty-option\") : null,\n              ...Array.from(nativeOptionsSet)\n            ]'
  },
  {
    file: path.join(base, 'index.js'),
    from: 'ref: composedRefs }),\\n      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? ReactDOM.createPortal(itemTextProps.children, context.valueNode) : null',
    to: 'ref: composedRefs }, \"select-item-text\"),\\n      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: ReactDOM.createPortal(itemTextProps.children, context.valueNode) }, \"select-item-text-portal\") : null'
  },
  {
    file: path.join(base, 'index.mjs'),
    from: 'jsx(\"option\", { value: \"\" }) : null',
    to: 'jsx(\"option\", { value: \"\" }, \"select-empty-option\") : null'
  },
  {
    file: path.join(base, 'index.mjs'),
    from: '\"select-empty-option\") : null,\n              Array.from(nativeOptionsSet)\n            ]',
    to: '\"select-empty-option\") : null,\n              ...Array.from(nativeOptionsSet)\n            ]'
  },
  {
    file: path.join(base, 'index.mjs'),
    from: 'ref: composedRefs }),\\n      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? ReactDOM.createPortal(itemTextProps.children, context.valueNode) : null',
    to: 'ref: composedRefs }, \"select-item-text\"),\\n      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? /* @__PURE__ */ jsx(Fragment, { children: ReactDOM.createPortal(itemTextProps.children, context.valueNode) }, \"select-item-text-portal\") : null'
  }
];

for (const { file, from, to } of edits) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes(to) && c.includes(from)) {
    c = c.replace(from, to);
    fs.writeFileSync(file, c);
  }
}
"

npx patch-package @radix-ui/react-select

# Normalizar a LF (y quitar BOM) para que patch-package 8 parsee en todos los entornos
node "$ROOT/scripts/normalize-patches.cjs"

echo "Listo. patches/@radix-ui+react-select+2.2.6.patch regenerado (LF)."
echo "Comprueba con: rm -rf node_modules && npm ci"
