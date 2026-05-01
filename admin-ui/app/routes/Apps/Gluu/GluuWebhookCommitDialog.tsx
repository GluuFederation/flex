import React, { useCallback } from 'react'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppSelector } from '@/redux/hooks'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useWebhookDialogAction } from 'Utils/hooks'
import { GluuWebhookCommitDialogProps } from './types'

const GluuWebhookCommitDialog: React.FC<GluuWebhookCommitDialogProps> = ({
  handler,
  modal,
  onAccept,
  formik,
  operations,
  webhookFeature,
  autoCloseOnAccept = false,
  alertMessage,
  alertSeverity,
}) => {
  const { hasCedarReadPermission } = useCedarling()
  const canReadWebhooks = hasCedarReadPermission(ADMIN_UI_RESOURCES.Webhooks)
  const webhookModal = useAppSelector((state) => state.webhookReducer?.webhookModal ?? false)
  const { webhookTriggerModal, onCloseModal, webhookCheckComplete } = useWebhookDialogAction({
    feature: webhookFeature,
    modal,
  })

  const handleClose = useCallback(() => {
    handler()
    onCloseModal()
  }, [handler, onCloseModal])

  if (!modal) {
    return null
  }

  if (!webhookCheckComplete) {
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
      alertMessage={alertMessage}
      alertSeverity={alertSeverity}
    />
  )
}

export default React.memo(GluuWebhookCommitDialog)
