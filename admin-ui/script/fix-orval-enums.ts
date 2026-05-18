import * as fs from 'node:fs'
import * as path from 'node:path'
import { REGEX_ORVAL_KEYOPS_ENUM } from '../app/utils/regex'

const rootDir = process.cwd()
const orvalDir = path.join(rootDir, 'jans_config_api_orval', 'src')

if (!fs.existsSync(orvalDir)) {
  process.exit(0)
}

const SAML_FORMDATA_FIXES: readonly [string, string][] = [
  [
    'formData.append(`trustRelationship`, JSON.stringify(trustRelationshipForm.trustRelationship))',
    "formData.append(`trustRelationship`, new Blob([JSON.stringify(trustRelationshipForm.trustRelationship)], { type: 'application/json' }))",
  ],
  [
    'formData.append(`identityProvider`, JSON.stringify(brokerIdentityProviderForm.identityProvider))',
    "formData.append(`identityProvider`, new Blob([JSON.stringify(brokerIdentityProviderForm.identityProvider)], { type: 'application/json' }))",
  ],
]

const LOAD_SERVICE_ASSET_FORMDATA_REGEX =
  /formData\.append\(\s*(['"`])data\1\s*,\s*loadServiceAssetBody(?:\s*\?\?\s*''\s*)?\)/g

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.isFile() && entry.name.endsWith('.ts')) out.push(full)
  }
  return out
}

const applyFixes = (content: string): string => {
  let result = content.replace(
    REGEX_ORVAL_KEYOPS_ENUM,
    (_: string, prefix: string, value: string, suffix: string) => `${prefix}${value}\\${suffix}`,
  )
  for (const [from, to] of SAML_FORMDATA_FIXES) {
    result = result.split(from).join(to)
  }
  result = result.replace(
    LOAD_SERVICE_ASSET_FORMDATA_REGEX,
    "formData.append('data', loadServiceAssetBody ?? '')",
  )
  return result
}

for (const filePath of walk(orvalDir)) {
  const content = fs.readFileSync(filePath, 'utf8')
  const fixed = applyFixes(content)
  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed)
  }
}
