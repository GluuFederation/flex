import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { hasPermission, WEBHOOK_READ } from 'Utils/PermChecker'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import {
  setShowErrorModal,
  setWebhookTriggerErrors,
  setTriggerWebhookResponse,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { Box } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'

const GluuWebhookErrorDialog = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { triggerWebhookMessage, webhookTriggerErrors, triggerWebhookInProgress, showErrorModal } =
    useSelector((state: any) => state.webhookReducer)
  const permissions = useSelector((state: any) => state.authReducer.permissions)
  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  const closeModal = () => {
    dispatch(setShowErrorModal(!showErrorModal))
    dispatch(setWebhookTriggerErrors([]))
    dispatch(setTriggerWebhookResponse('Something went wrong while triggering webhook.'))
  }

  return (
    <Modal
      isOpen={showErrorModal && hasPermission(permissions, WEBHOOK_READ)}
      size={'lg'}
      toggle={closeModal}
      className="modal-outline-primary"
    >
      <ModalHeader toggle={closeModal}>
        <i
          onClick={closeModal}
          onKeyDown={() => {}}
          style={{ color: 'green' }}
          className="fa fa-2x fa-info fa-fw modal-icon mb-3"
          role="img"
          aria-hidden="true"
        ></i>{' '}
        {t('messages.webhook_execution_information')}{' '}
      </ModalHeader>
      <ModalBody>
        <Box px={2} flexDirection="column">
          {triggerWebhookMessage ? (
            <Box component="div" my={2} style={{ color: 'red' }}>
              {triggerWebhookMessage}
            </Box>
          ) : null}
          {webhookTriggerErrors.length ? (
            <ul>
              {webhookTriggerErrors.map((item: any) => (
                <li
                  key={item.responseMessage}
                  style={{
                    color: 'red',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <Box
                    width={'10px'}
                    height={'10px'}
                    sx={{
                      background: 'red',
                      borderRadius: '100%',
                      position: 'absolute',
                      left: '-20px',
                      top: 0,
                      mt: '6px',
                    }}
                  />
                  <span>
                    {t('fields.webhook_id')}: {item.responseObject.webhookId}
                  </span>
                  <span>
                    {t('fields.webhook_name')}: {item.responseObject.webhookName}
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
