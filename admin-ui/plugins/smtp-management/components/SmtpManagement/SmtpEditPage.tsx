import React, { useCallback, useState } from 'react'
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

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface RootState {
  authReducer: {
    config?: {
      allowSmtpKeystoreEdit?: boolean
    }
  }
}

function SmtpEditPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const [testStatus, setTestStatus] = useState<boolean | null>(null)
  const [showTestModal, setShowTestModal] = useState(false)

  const { data: smtpConfiguration, isLoading } = useGetConfigSmtp()

  const putSmtpMutation = usePutConfigSmtp({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.smtp_config_updated_successfully')))
        queryClient.invalidateQueries({ queryKey: getGetConfigSmtpQueryKey() })
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
      onSuccess: (data) => {
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
    (state: RootState) => state.authReducer?.config?.allowSmtpKeystoreEdit as boolean,
  )

  SetTitle(t('menus.stmp_management'))

  const handleSubmit = useCallback(
    (data: SmtpConfiguration) => {
      putSmtpMutation.mutate({ data })
    },
    [putSmtpMutation],
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
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}
export default SmtpEditPage
