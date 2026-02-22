import { useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/redux/hooks'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import {
  setShowErrorModal,
  setWebhookTriggerErrors,
  setTriggerWebhookResponse,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { Box } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTheme } from 'Context/theme/themeContext'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import type { WebhookTriggerResponseItem } from 'Plugins/admin/redux/types/webhook'

const GluuWebhookErrorDialog = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const webhookState = useAppSelector((state) => state.webhookReducer)
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  if (!webhookState) return null

  const { triggerWebhookMessage, webhookTriggerErrors, triggerWebhookInProgress, showErrorModal } =
    webhookState

  const { state: themeState } = useTheme()
  const selectedTheme = themeState.theme

  const webhookResourceId = useMemo(() => ADMIN_UI_RESOURCES.Webhooks, [])
  const webhookScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[webhookResourceId], [webhookResourceId])
  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(webhookResourceId),
    [hasCedarReadPermission, webhookResourceId],
  )

  useEffect(() => {
    if (webhookScopes && webhookScopes.length > 0) {
      authorizeHelper(webhookScopes)
    }
  }, [authorizeHelper, webhookScopes])

  const closeModal = () => {
    dispatch(setShowErrorModal(!showErrorModal))
    dispatch(setWebhookTriggerErrors([]))
    dispatch(setTriggerWebhookResponse('Something went wrong while triggering webhook.'))
  }

  return (
    <Modal
      isOpen={showErrorModal && canReadWebhooks}
      size={'lg'}
      toggle={closeModal}
      className="modal-outline-primary"
    >
      <ModalHeader toggle={closeModal}>
        <i
          onClick={closeModal}
          onKeyDown={() => {}}
          style={{ color: customColors.logo }}
          className="fa fa-2x fa-info fa-fw modal-icon mb-3"
          role="img"
          aria-hidden="true"
        ></i>{' '}
        {t('messages.webhook_execution_information')}{' '}
      </ModalHeader>
      <ModalBody>
        <Box px={2} flexDirection="column">
          {triggerWebhookMessage ? (
            <Box component="div" my={2} style={{ color: customColors.accentRed }}>
              {triggerWebhookMessage}
            </Box>
          ) : null}
          {webhookTriggerErrors.length ? (
            <ul>
              {webhookTriggerErrors.map((item: WebhookTriggerResponseItem) => (
                <li
                  key={item.responseMessage}
                  style={{
                    color: customColors.accentRed,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <Box
                    width={'10px'}
                    height={'10px'}
                    sx={{
                      background: customColors.accentRed,
                      borderRadius: '100%',
                      position: 'absolute',
                      left: '-20px',
                      top: 0,
                      mt: '6px',
                    }}
                  />
                  <span>
                    {t('fields.webhook_id')}: {item.responseObject?.webhookId}
                  </span>
                  <span>
                    {t('fields.webhook_name')}: {item.responseObject?.webhookName}
                  </span>
                  <span>
                    {t('messages.error_message')}: {item.responseMessage}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={triggerWebhookInProgress}
          color={`primary-${selectedTheme}`}
          onClick={closeModal}
          style={applicationStyle.buttonStyle}
        >
          <i className="fa fa-check-circle me-2"></i>
          {t('actions.ok')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuWebhookErrorDialog
