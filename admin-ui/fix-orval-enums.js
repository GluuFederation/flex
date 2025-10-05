#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'jans_config_api_orval', 'src', 'JansConfigApi.ts')

if (!fs.existsSync(filePath)) {
  console.log('JansConfigApi.ts not found, skipping enum fixes')
  process.exit(0)
}

let content = fs.readFileSync(filePath, 'utf8')

// Fix malformed enum keys with unescaped single quotes
// Pattern: 'KeyOps{value=\'text'} -> 'KeyOps{value=\'text\'}
const finalContent = content.replace(
  /('KeyOps\{value=\\')([^'\\]+)(')/g,
  (match, prefix, value, suffix) => {
    return `${prefix}${value}\\${suffix}`
  },
)

if (finalContent !== content) {
  fs.writeFileSync(filePath, finalContent)
  console.log('✅ Fixed malformed enum keys in JansConfigApi.ts')
} else {
  console.log('✅ No enum fixes needed in JansConfigApi.ts')
}
