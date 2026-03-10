import React, { useCallback } from 'react'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppSelector } from '@/redux/hooks'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useWebhookDialogAction } from 'Utils/hooks'
import { adminUiFeatures, type AdminUiFeatureKey } from 'Plugins/admin/helper/utils'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import type { FormikProps } from 'formik'
import type { UserEditFormValues } from '../types/ComponentTypes'

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
  const { hasCedarReadPermission } = useCedarling()
  const webhookResourceId = ADMIN_UI_RESOURCES.Webhooks
  const canReadWebhooks = hasCedarReadPermission(webhookResourceId)
  const webhookModal = useAppSelector((state) => state.webhookReducer?.webhookModal ?? false)
  const { webhookTriggerModal, onCloseModal, webhookCheckComplete } = useWebhookDialogAction({
    feature: adminUiFeatures[webhookFeature],
    modal,
  })
  const showWebhookFirst = modal && webhookModal && canReadWebhooks
  const showCommitDialog = modal && webhookCheckComplete && !showWebhookFirst

  const handleClose = useCallback(() => {
    handler()
    onCloseModal()
  }, [handler, onCloseModal])

  if (showWebhookFirst) {
    return <>{webhookTriggerModal({ closeModal: handleClose })}</>
  }

  return (
    <GluuCommitDialog
      handler={handleClose}
      modal={showCommitDialog}
      onAccept={onAccept}
      formik={formik}
      operations={operations}
      autoCloseOnAccept={autoCloseOnAccept}
    />
  )
}

export default React.memo(UserFormCommitDialog)
