import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppSelector } from '@/redux/hooks'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useWebhookDialogAction } from 'Utils/hooks'
import { adminUiFeatures, type AdminUiFeatureKey } from 'Plugins/admin/helper/utils'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import type { FormikProps } from 'formik'
import type { UserEditFormValues } from '../types/ComponentTypes'
import { revokeSessionWhenFieldsModifiedInUserForm } from '../helper/constants'

interface UserFormCommitDialogProps {
  handler: () => void
  modal: boolean
  onAccept: (message: string) => void | Promise<void>
  formik: FormikProps<UserEditFormValues>
  operations: GluuCommitDialogOperation[]
  autoCloseOnAccept?: boolean
  webhookFeature: AdminUiFeatureKey
}

const UserFormCommitDialog = ({
  handler,
  modal,
  onAccept,
  formik,
  operations,
  autoCloseOnAccept = false,
  webhookFeature,
}: UserFormCommitDialogProps) => {
  const { t } = useTranslation()
  const { hasCedarReadPermission } = useCedarling()
  const canReadWebhooks = hasCedarReadPermission(ADMIN_UI_RESOURCES.Webhooks)
  const webhookModal = useAppSelector((state) => state.webhookReducer?.webhookModal ?? false)
  const { webhookTriggerModal, onCloseModal, webhookCheckComplete } = useWebhookDialogAction({
    feature: adminUiFeatures[webhookFeature],
    modal,
  })

  const sessionRevokeAlert = useMemo(() => {
    const hasSessionRevokingField = operations.some((op) =>
      revokeSessionWhenFieldsModifiedInUserForm.includes(op.path),
    )
    return hasSessionRevokingField ? t('messages.revokeUserSession') : undefined
  }, [operations, t])

  const handleClose = useCallback(() => {
    handler()
    onCloseModal()
  }, [handler, onCloseModal])

  if (modal && !webhookCheckComplete) {
    return <GluuLoader blocking />
  }

  if (webhookModal && canReadWebhooks) {
    return <>{webhookTriggerModal({ closeModal: handleClose })}</>
  }

  return (
    <GluuCommitDialog
      handler={handleClose}
      modal={modal && webhookCheckComplete}
      onAccept={onAccept}
      formik={formik}
      operations={operations}
      autoCloseOnAccept={autoCloseOnAccept}
      alertMessage={sessionRevokeAlert}
      alertSeverity="warning"
    />
  )
}

export default React.memo(UserFormCommitDialog)
