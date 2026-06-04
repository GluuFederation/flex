import { useEffect, useMemo, useRef } from 'react'
import { useGetUserByInum } from 'JansConfigApi'
import { FETCH, API_USERS } from '@/audit'
import { logAuditUserAction } from '@/utils/AuditLogger'
import { devLogger } from '@/utils/devLogger'
import { useAppSelector } from '@/redux/hooks'
import { JANS_ADMIN_UI_ROLE_ATTR } from '@/constants'
import type { CustomAttribute, ProfileDetails, UseProfileDetailsResult } from '../types'

export const useProfileDetails = (
  userInum: string | undefined,
  enabled: boolean,
): UseProfileDetailsResult => {
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const clientId = useAppSelector((state) => state.authReducer?.config?.clientId)

  const { data: profileDetails, isLoading: loading } = useGetUserByInum(userInum ?? '', {
    query: {
      enabled: enabled && !!userInum,
      select: (user): ProfileDetails => ({
        displayName: user.displayName,
        givenName: user.givenName,
        mail: user.mail,
        status: user.status,
        inum: user.inum,
        customAttributes: user.customAttributes?.map((attribute) => ({
          name: attribute.name ?? '',
          values: (attribute.values ?? []).map((value) => String(value)),
        })),
      }),
    },
  })

  const surname = useMemo(
    () =>
      profileDetails?.customAttributes?.find(
        (attribute: CustomAttribute) => attribute?.name === 'sn',
      )?.values?.[0],
    [profileDetails?.customAttributes],
  )

  const roles = useMemo(() => {
    const values = profileDetails?.customAttributes?.find(
      (attribute: CustomAttribute) => attribute?.name === JANS_ADMIN_UI_ROLE_ATTR,
    )?.values
    if (!Array.isArray(values) || values.length === 0) return '-'
    return values.map((role) => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')
  }, [profileDetails?.customAttributes])

  const auditedInumRef = useRef<string | null>(null)
  useEffect(() => {
    if (!profileDetails || !userInum || auditedInumRef.current === userInum) {
      return
    }
    auditedInumRef.current = userInum
    void logAuditUserAction({
      userinfo,
      client_id: clientId,
      action: FETCH,
      resource: API_USERS,
      message: '',
      payload: { pattern: userInum },
    }).catch((error) =>
      devLogger.error('[Profile audit] failed', error instanceof Error ? error : String(error)),
    )
  }, [profileDetails, userInum, userinfo, clientId])

  return { profileDetails, loading, surname, roles }
}
