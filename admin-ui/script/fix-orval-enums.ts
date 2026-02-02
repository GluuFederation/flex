import * as fs from 'node:fs'
import * as path from 'node:path'

const rootDir = process.cwd()
const filePath = path.join(rootDir, 'jans_config_api_orval', 'src', 'JansConfigApi.ts')
if (!fs.existsSync(filePath)) {
  process.exit(0)
}

const content = fs.readFileSync(filePath, 'utf8')

const enumFix = content.replace(
  /('KeyOps\{value=\\')([^'\\]+)(')/g,
  (_: string, prefix: string, value: string, suffix: string) => `${prefix}${value}\\${suffix}`,
)

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

let result = enumFix
for (const [from, to] of SAML_FORMDATA_FIXES) {
  result = result.split(from).join(to)
}

if (result !== content) {
  fs.writeFileSync(filePath, result)
}
