import React, { useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import {
  getWebhooksByFeatureId,
  getWebhooksByFeatureIdResponse,
  setWebhookModal,
  triggerWebhook,
  setWebhookTriggerErrors,
  setTriggerWebhookResponse,
} from 'Plugins/admin/redux/features/WebhookSlice'
import PropTypes from 'prop-types'
import { ThemeContext } from 'Context/theme/themeContext'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import { hasPermission, WEBHOOK_READ } from 'Utils/PermChecker'

const useWebhookDialogAction = ({ feature, modal }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const permissions = useSelector((state) => state.authReducer.permissions)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const {
    featureWebhooks,
    loadingWebhooks,
    webhookModal,
    triggerWebhookMessage,
    webhookTriggerErrors,
    triggerWebhookInProgress,
  } = useSelector((state) => state.webhookReducer)
  const enabledFeatureWebhooks = featureWebhooks.filter(
    (item) => item.jansEnabled
  )

  const onCloseModal = useCallback(() => {
    dispatch(setWebhookModal(enabledFeatureWebhooks?.length > 0))
    dispatch(setWebhookTriggerErrors([]))
    dispatch(setTriggerWebhookResponse(''))

  }, [dispatch, enabledFeatureWebhooks])

  useEffect(() => {
    if (hasPermission(permissions, WEBHOOK_READ))
      if (modal) {
        if (feature) {
          dispatch(getWebhooksByFeatureId(feature))
        } else {
          dispatch(getWebhooksByFeatureIdResponse([]))
        }
      }
  }, [modal])

  useEffect(() => {
    dispatch(setWebhookModal(enabledFeatureWebhooks?.length > 0))
  }, [featureWebhooks?.length])

  const handleAcceptWebhookTrigger = () => {
    dispatch(triggerWebhook(feature))
  }
  
  const webhookTriggerModal = ({ closeModal }) => {
    return (
      <Modal
        isOpen={(webhookModal || loadingWebhooks) && hasPermission(permissions, WEBHOOK_READ)}
        size={'lg'}
        toggle={() => {
          if (!loadingWebhooks) {
            closeModal()
          }
        }}
        className='modal-outline-primary'
      >
        <ModalHeader toggle={closeModal}>
          {loadingWebhooks ? (
            <>Loading....</>
          ) : (
            <>
              <i
                onClick={closeModal}
                onKeyDown={() => {}}
                style={{ color: 'green' }}
                code
                className='fa fa-2x fa-info fa-fw modal-icon mb-3'
                role='img'
                aria-hidden='true'
              ></i>{' '}
              {t('messages.webhook_execution_information')}{' '}
            </>
          )}
        </ModalHeader>
        {!loadingWebhooks ? (
          <>
            <ModalBody>
              <Box flex flexDirection='column' px={2}>
                <p style={{ fontWeight: 600 }}>
                  {t('messages.webhook_dialog_dec')}
                </p>
              </Box>
              {enabledFeatureWebhooks?.length ? (
                <Table
                  sx={{ minWidth: 650, marginTop: '20px' }}
                  aria-label='webhook table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ fontSize: 16, fontWeight: 600, width: '50%' }}
                        align='left'
                      >
                        <b>{t('fields.webhook_name')}</b>
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: 16, fontWeight: 600, width: '50%' }}
                      >
                        <b>{t('fields.webhook_id')}</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enabledFeatureWebhooks.map((item) => (
                      <TableRow
                        key={item.displayName + item.url}
                        sx={{
                          '&:last-child td, &:last-child th': {
                            border: 0,
                          },
                          fontSize: 14,
                        }}
                      >
                        <TableCell
                          sx={{ fontSize: 14 }}
                          component='th'
                          scope='row'
                        >
                          {item.displayName}
                        </TableCell>
                        <TableCell sx={{ fontSize: 16 }} align='left'>
                          {item.webhookId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
              <Box px={2} flex flexDirection='column'>
                {triggerWebhookMessage ? (
                  <Box component='div' my={2} style={{ color: 'red' }}>
                    {triggerWebhookMessage}
                  </Box>
                ) : null}
                {webhookTriggerErrors.length ? (
                  <ul>
                    {webhookTriggerErrors.map((item) => (
                      <li
                        key={item.responseMessage}
                        style={{
                          color: 'red',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative'
                        }}
                      >
                        <Box width={'10px'} height={'10px'} sx={{ background: 'red', borderRadius: '100%', position: 'absolute', left: '-20px', top: 0, mt: '6px' }} />
                        <span>{t('fields.webhook_id')}: {item.responseObject.webhookId}</span>
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
                {webhookTriggerErrors.length ? (
                  <p>
                    {t('messages.webhook_dialog_note')}
                  </p>
                ) : null}
              </Box>
            </ModalBody>
            <ModalFooter>
              {webhookTriggerErrors.length ? (
                <Button
                  disabled={triggerWebhookInProgress}
                  color={`primary-${selectedTheme}`}
                  onClick={closeModal}
                  style={applicationStyle.buttonStyle}
                >
                  <i className='fa fa-check-circle me-2'></i>
                  {t('actions.ok')}
                </Button>
              ) : (
                <>
                  <Button
                    disabled={triggerWebhookInProgress}
                    color={`primary-${selectedTheme}`}
                    onClick={handleAcceptWebhookTrigger}
                    style={applicationStyle.buttonStyle}
                  >
                    <i className='fa fa-check-circle me-2'></i>
                    {t('actions.accept')}
                  </Button>
                  <Button
                    disabled={triggerWebhookInProgress}
                    onClick={closeModal}
                  >
                    <i className='fa fa-remove me-2'></i>
                    {t('actions.reject')}
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        ) : (
          <></>
        )}
      </Modal>
    )
  }

  return { onCloseModal, webhookTriggerModal }
}

export default useWebhookDialogAction
useWebhookDialogAction.propTypes = {
  feature: PropTypes.string,
  modal: PropTypes.bool,
}
