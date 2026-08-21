import * as fs from 'node:fs'
import * as path from 'node:path'
import { LEGACY_POLICY_STORE_PATH, POLICY_STORE_PATH_SUFFIX } from '../app/constants/policyStore'

/**
 * Temporary shim for the Cedarling policy-store work (GluuFederation/flex#2985).
 *
 * The jans-config-api feature branch registers the new policy-store resource under
 * `/admin-ui/security1` so it can run side by side with the legacy `/admin-ui/security`
 * resource while both are supported. Upstream will drop the `1` once development lands, at
 * which point clearing POLICY_STORE_PATH_SUFFIX turns this step into a no-op.
 *
 * Only the policyStore paths move; `/admin-ui/security/syncRoleScopesMapping` is unchanged
 * on the feature branch and still answers on the legacy path.
 */
const PATH_SUFFIX = POLICY_STORE_PATH_SUFFIX

const POLICY_STORE_PATH = LEGACY_POLICY_STORE_PATH
const LEGACY_PREFIX = POLICY_STORE_PATH.replace(/\/policyStore$/, '')

const specPath = path.join(process.cwd(), 'configApiSpecs.yaml')

if (PATH_SUFFIX === '' || !fs.existsSync(specPath)) {
  process.exit(0)
}

const patchedPrefix = `${LEGACY_PREFIX}${PATH_SUFFIX}/policyStore`
const pathKey = /^(\s{2})(['"]?)(\/admin-ui\/security\/policyStore[^'"\s:]*)\2:$/

const lines = fs.readFileSync(specPath, 'utf8').split('\n')
let patched = 0

const result = lines.map((line) => {
  const match = pathKey.exec(line)
  if (!match) return line
  patched += 1
  const [, indent, quote, pathValue] = match
  return `${indent}${quote}${pathValue.replace(POLICY_STORE_PATH, patchedPrefix)}${quote}:`
})

if (patched === 0) {
  console.error(
    `patch-adminui-policystore-path: no "${POLICY_STORE_PATH}" paths found in configApiSpecs.yaml. ` +
      'Is openapi-merge.json still pointing at the feature-branch admin-ui spec?',
  )
  process.exit(1)
}

fs.writeFileSync(specPath, result.join('\n'))
console.log(
  `patch-adminui-policystore-path: rewrote ${patched} path(s) to "${LEGACY_PREFIX}${PATH_SUFFIX}".`,
)
