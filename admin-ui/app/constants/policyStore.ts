/**
 * Cedarling policy-store API paths (GluuFederation/flex#2985).
 *
 * The jans-config-api feature branch registers the new policy-store resource under
 * `/admin-ui/security1` so it can run alongside the legacy `/admin-ui/security` resource while
 * both are supported. Upstream will drop the `1` once development lands; set
 * POLICY_STORE_PATH_SUFFIX to '' at that point and everything — including the orval codegen
 * step in `script/patch-adminui-policystore-path.ts`, which reads this constant — follows.
 */
export const POLICY_STORE_PATH_SUFFIX: string = '1'

/** Legacy single-store endpoint: GET returns `responseBytes`, PUT takes a multipart upload. */
export const LEGACY_POLICY_STORE_PATH = '/admin-ui/security/policyStore'

export const POLICY_STORE_PATH = `/admin-ui/security${POLICY_STORE_PATH_SUFFIX}/policyStore`

/** Extension of a Cedarling policy-store archive, used for uploads, accept filters and downloads. */
export const CJAR_EXTENSION = '.cjar'

export const POLICY_STORE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

/**
 * `fieldValuePair` filter narrowing the list to the active store.
 *
 * Every entry in the list response carries its full base64 `.cjar` archive, and the server's
 * default `limit` is 50 — so an unfiltered read at sign-in would pull up to fifty archives to use
 * one. Callers must still confirm the status client-side: whether the backend honours
 * `fieldValuePair` is unconfirmed (flex#2985), and a silently ignored filter would otherwise look
 * identical to a successful one.
 */
export const POLICY_STORE_ACTIVE_FILTER = `jansStatus=${POLICY_STORE_STATUS.ACTIVE}`
