import { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { FormikProps } from 'formik'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { GluuPageContent } from '@/components'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector, getRootState } from '@/redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import SmtpForm from './SmtpForm'
import GluuInfo from 'Routes/Apps/Gluu/GluuInfo'
import {
  useGetConfigSmtp,
  usePutConfigSmtp,
  useTestConfigSmtp,
  getGetConfigSmtpQueryKey,
  SmtpConfiguration,
  SmtpTest,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import { UPDATE } from '@/audit/UserActionType'
import { logAuditUserAction } from '@/utils/AuditLogger'
import { devLogger } from '@/utils/devLogger'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { SmtpFormValues, ApiError, PatchOp } from 'Plugins/smtp/types'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useStyles } from './styles/SmtpFormPage.style'

const API_SMTP = 'api-smtp-configuration'

const smtpResourceId = ADMIN_UI_RESOURCES.SMTP
const smtpScopes = CEDAR_RESOURCE_SCOPES[smtpResourceId]

const buildPatches = (
  originalConfig: Partial<SmtpConfiguration> | undefined,
  updated: SmtpConfiguration,
): PatchOp[] => {
  const patches: PatchOp[] = []
  const original = originalConfig || {}
  const keys = new Set<string>([...Object.keys(original), ...Object.keys(updated)])
  keys.forEach((key) => {
    const origVal = (original as Record<string, JsonValue>)[key]
    const newVal = (updated as Record<string, JsonValue>)[key]
    if (JSON.stringify(origVal) !== JSON.stringify(newVal)) {
      if (newVal === undefined) {
        patches.push({ op: 'remove', path: `/${key}` })
      } else if (origVal === undefined) {
        patches.push({ op: 'add', path: `/${key}`, value: newVal })
      } else {
        patches.push({ op: 'replace', path: `/${key}`, value: newVal })
      }
    }
  })
  return patches
}

const SmtpEditPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [testStatus, setTestStatus] = useState<boolean | null>(null)
  const [showTestModal, setShowTestModal] = useState(false)
  const formikRef = useRef<FormikProps<SmtpFormValues> | null>(null)
  const {
    data: smtpConfiguration,
    isLoading,
    isError: isSmtpError,
    error: smtpError,
  } = useGetConfigSmtp()
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const canReadSmtp = useMemo(
    () => hasCedarReadPermission(smtpResourceId),
    [hasCedarReadPermission],
  )
  const canWriteSmtp = useMemo(
    () => hasCedarWritePermission(smtpResourceId),
    [hasCedarWritePermission],
  )

  useEffect(() => {
    if (smtpScopes.length > 0) {
      authorizeHelper(smtpScopes)
    }
  }, [authorizeHelper])

  useEffect(() => {
    if (!isSmtpError) return
    const errorMsg = getQueryErrorMessage(smtpError, t('messages.error_in_loading'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [isSmtpError, smtpError, dispatch, t])

  const testButtonEnabled = !!smtpConfiguration

  const putSmtpMutation = usePutConfigSmtp({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.smtp_config_updated_successfully')))
        queryClient.invalidateQueries({ queryKey: getGetConfigSmtpQueryKey() })
        if (formikRef.current) {
          formikRef.current.resetForm({ values: formikRef.current.values })
        }
      },
      onError: (error: Error) => {
        const err = error as ApiError
        const errorMessage = err?.response?.data?.message || t('messages.smtp_config_update_failed')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const testSmtpMutation = useTestConfigSmtp({
    mutation: {
      onSuccess: (data: boolean) => {
        setTestStatus(data)
        setShowTestModal(true)
        const message = data ? t('messages.smtp_test_success') : t('messages.smtp_test_failed')
        dispatch(updateToast(true, data ? 'success' : 'error', message))
      },
      onError: (error: Error) => {
        const err = error as ApiError
        const errorMessage = err?.response?.data?.message || t('messages.smtp_test_failed')
        dispatch(updateToast(true, 'error', errorMessage))
        setTestStatus(false)
        setShowTestModal(true)
      },
    },
  })

  const allowSmtpKeystoreEdit = useAppSelector(
    (state) => state.authReducer?.config?.allowSmtpKeystoreEdit as boolean,
  )

  SetTitle(t('menus.stmp_management'))

  const handleSubmit = useCallback(
    async (data: SmtpConfiguration, userMessage: string) => {
      if (!canWriteSmtp) return
      const state = getRootState()
      putSmtpMutation.mutate(
        { data },
        {
          onSuccess: () => {
            const userinfo = state.authReducer?.userinfo
            const clientId = state.authReducer?.config?.clientId
            const ipAddress = state.authReducer?.location?.IPv4
            const patches = buildPatches(smtpConfiguration, data)
            logAuditUserAction({
              userinfo: userinfo ?? undefined,
              action: UPDATE,
              resource: API_SMTP,
              message: userMessage,
              extra: ipAddress ? { ip_address: ipAddress } : {},
              client_id: clientId,
              payload: patches,
            }).catch((error) => {
              devLogger.error('Failed to log audit action:', error)
            })
          },
        },
      )
    },
    [putSmtpMutation, smtpConfiguration, canWriteSmtp],
  )

  const handleTestSmtp = useCallback(
    (testData: SmtpTest) => {
      if (!canWriteSmtp) return
      testSmtpMutation.mutate({ data: testData })
    },
    [testSmtpMutation, canWriteSmtp],
  )

  const handleCloseTestModal = useCallback(() => {
    setShowTestModal(false)
    setTestStatus(null)
  }, [])

  const isBlocking = useMemo(
    () => isLoading || putSmtpMutation.isPending || testSmtpMutation.isPending,
    [isLoading, putSmtpMutation.isPending, testSmtpMutation.isPending],
  )

  return (
    <GluuPageContent>
      {showTestModal && testStatus !== null && (
        <GluuInfo item={{ testStatus, openModal: showTestModal }} handler={handleCloseTestModal} />
      )}
      <GluuViewWrapper canShow={canReadSmtp}>
        <GluuLoader blocking={isBlocking}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <SmtpForm
                item={smtpConfiguration}
                allowSmtpKeystoreEdit={allowSmtpKeystoreEdit}
                handleSubmit={handleSubmit}
                onTestSmtp={handleTestSmtp}
                formikRef={formikRef}
                readOnly={!canWriteSmtp}
                testButtonEnabled={testButtonEnabled}
              />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default SmtpEditPage
