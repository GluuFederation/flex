import React, { useCallback, useState, useRef } from 'react'
import { FormikProps } from 'formik'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { CardBody, Card } from 'Components'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SmtpForm from './SmtpForm'
import GluuInfo from '../../../../app/routes/Apps/Gluu/GluuInfo'
import {
  useGetConfigSmtp,
  usePutConfigSmtp,
  useTestConfigSmtp,
  getGetConfigSmtpQueryKey,
  SmtpConfiguration,
  SmtpTest,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { UPDATE } from '@/audit/UserActionType'
import { logAuditUserAction } from '@/utils/AuditLogger'
import store from 'Redux/store'
import { SmtpRootState } from 'Plugins/smtp-management/redux/types/SmtpApi.type'
import { SmtpFormValues } from 'Plugins/smtp-management/types'

const API_SMTP = 'api-smtp-configuration'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

// Extended state interface for SmtpEditPage with additional audit fields
interface SmtpEditPageRootState extends SmtpRootState {
  authReducer: SmtpRootState['authReducer'] & {
    config?: {
      allowSmtpKeystoreEdit?: boolean
      clientId?: string
    }
    token?: {
      access_token?: string
    }
    userinfo?: {
      name?: string
      inum?: string
    }
    location?: {
      IPv4?: string
    }
  }
}

type PatchOp = { op: 'add' | 'remove' | 'replace'; path: string; value?: unknown }

function buildPatches(
  originalConfig: Partial<SmtpConfiguration> | undefined,
  updated: SmtpConfiguration,
): PatchOp[] {
  const patches: PatchOp[] = []
  const original = originalConfig || {}
  const keys = new Set<string>([...Object.keys(original), ...Object.keys(updated)])
  keys.forEach((key) => {
    const origVal = (original as Record<string, unknown>)[key]
    const newVal = (updated as Record<string, unknown>)[key]
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

function SmtpEditPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const [testStatus, setTestStatus] = useState<boolean | null>(null)
  const [showTestModal, setShowTestModal] = useState(false)
  const formikRef = useRef<FormikProps<SmtpFormValues> | null>(null)
  const { data: smtpConfiguration, isLoading } = useGetConfigSmtp()
  const putSmtpMutation = usePutConfigSmtp({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.smtp_config_updated_successfully')))
        queryClient.invalidateQueries({ queryKey: getGetConfigSmtpQueryKey() })
        if (formikRef.current) {
          formikRef.current.resetForm({ values: formikRef.current.values })
        }
      },
      onError: (error: unknown) => {
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
      onError: (error: unknown) => {
        const err = error as ApiError
        const errorMessage = err?.response?.data?.message || t('messages.smtp_test_failed')
        dispatch(updateToast(true, 'error', errorMessage))
        setTestStatus(false)
        setShowTestModal(true)
      },
    },
  })

  const allowSmtpKeystoreEdit = useSelector(
    (state: SmtpEditPageRootState) => state.authReducer?.config?.allowSmtpKeystoreEdit as boolean,
  )
  SetTitle(t('menus.stmp_management'))

  const handleSubmit = useCallback(
    async (data: SmtpConfiguration, userMessage: string) => {
      const state = store.getState() as unknown as SmtpEditPageRootState
      putSmtpMutation.mutate(
        { data },
        {
          onSuccess: () => {
            const token = state.authReducer?.token?.access_token
            const userinfo = state.authReducer?.userinfo
            const clientId = state.authReducer?.config?.clientId
            const ipAddress = state.authReducer?.location?.IPv4
            const patches = buildPatches(smtpConfiguration, data)
            logAuditUserAction({
              token: token ?? undefined,
              userinfo: userinfo ?? undefined,
              action: UPDATE,
              resource: API_SMTP,
              message: userMessage,
              extra: ipAddress ? { ip_address: ipAddress } : {},
              client_id: clientId,
              payload: patches,
            }).catch((error) => {
              console.error('Failed to log audit action:', error)
            })
          },
        },
      )
    },
    [putSmtpMutation, smtpConfiguration],
  )

  const handleTestSmtp = useCallback(
    (testData: SmtpTest) => {
      testSmtpMutation.mutate({ data: testData })
    },
    [testSmtpMutation],
  )

  const handleCloseTestModal = useCallback(() => {
    setShowTestModal(false)
    setTestStatus(null)
  }, [])

  return (
    <GluuLoader blocking={isLoading || putSmtpMutation.isPending || testSmtpMutation.isPending}>
      {showTestModal && (
        <GluuInfo item={{ testStatus, openModal: showTestModal }} handler={handleCloseTestModal} />
      )}
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {!isLoading && smtpConfiguration && (
            <SmtpForm
              item={smtpConfiguration}
              allowSmtpKeystoreEdit={allowSmtpKeystoreEdit}
              handleSubmit={handleSubmit}
              onTestSmtp={handleTestSmtp}
              formikRef={formikRef}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}
export default SmtpEditPage
