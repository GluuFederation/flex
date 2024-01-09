import React, { useState, useEffect, useContext, Fragment } from 'react'
import {
  FormGroup,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  getWebhooksByFeatureId,
  getWebhooksByFeatureIdResponse,
  setWebhookModal,
  triggerWebhook,
  setWebhookTriggerErrors
} from 'Plugins/admin/redux/features/WebhookSlice'

const GluuDialog = ({ row, handler, modal, onAccept, subject, name, feature }) => {
  const dispatch = useDispatch()
  const [active, setActive] = useState(false)
  const { t } = useTranslation()
  const [userMessage, setUserMessage] = useState('')
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
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  useEffect(() => {
    if (userMessage.length >= 10) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [userMessage])

  function handleAccept() {
    onAccept(userMessage)
  }
  const closeModal = () => {
    handler()
    setUserMessage('')
    dispatch(setWebhookModal(enabledFeatureWebhooks?.length > 0))
    dispatch(setWebhookTriggerErrors([]))
  }

  useEffect(() => {
    if (feature) {
      dispatch(getWebhooksByFeatureId(feature))
    } else {
      dispatch(getWebhooksByFeatureIdResponse([]))
    }
  }, [])

  useEffect(() => {
    dispatch(setWebhookModal(enabledFeatureWebhooks?.length > 0))
  }, [enabledFeatureWebhooks?.length])

  const handleAcceptWebhookTrigger = () => {
    dispatch(triggerWebhook(feature))
  }

  if (!modal) {
    return <></>
  }

  if (loadingWebhooks && modal) {
    return (
      <Modal
        isOpen={loadingWebhooks}
        size={'lg'}
        toggle={() => {}}
        className='modal-outline-primary'
      >
        <ModalHeader toggle={() => {}}>Loading....</ModalHeader>
      </Modal>
    )
  }

  return (
    <>
      {webhookModal ? (
        <Modal
          isOpen={webhookModal}
          size={'lg'}
          toggle={closeModal}
          className='modal-outline-primary'
        >
          <ModalHeader toggle={closeModal}>
            <i
              onClick={closeModal}
              style={{ color: 'green' }}
              className='fa fa-2x fa-info fa-fw modal-icon mb-3'
            ></i>{' '}
            Webhook Trigger
          </ModalHeader>
          <ModalBody>
            <Typography variant='subtitle1' fontWeight={600}>
              Below webhooks will be triggered.
            </Typography>
            <p>{triggerWebhookMessage}</p>
            {webhookTriggerErrors.length ? (
              <>
                <ul>
                  {webhookTriggerErrors.map((str) => (
                    <li key={str} style={{ color: 'red' }}>
                      {str}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {enabledFeatureWebhooks?.length
              ? enabledFeatureWebhooks.map((item, key) => (
                <Fragment key={item.displayName}>
                  <Badge>{item.displayName}</Badge>
                  {key + 1 === enabledFeatureWebhooks.length ? (
                    ''
                  ) : (
                    <span>,</span>
                  )}
                </Fragment>
              ))
              : null}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={triggerWebhookInProgress}
              color={`primary-${selectedTheme}`}
              onClick={handleAcceptWebhookTrigger}
            >
              <i className='fa fa-check-circle me-2'></i>
              {t('actions.accept')}
            </Button>
            <Button
              disabled={triggerWebhookInProgress}
              style={applicationStyle.buttonStyle}
              onClick={closeModal}
            >
              <i className='fa fa-remove me-2'></i>
              {t('actions.no')}
            </Button>
          </ModalFooter>
        </Modal>
      ) : (
        <Modal
          isOpen={modal}
          toggle={closeModal}
          className='modal-outline-primary'
        >
          <ModalHeader toggle={closeModal}>
            <i
              style={{ color: 'red' }}
              className='fa fa-2x fa-warning fa-fw modal-icon mb-3'
            ></i>
            {t('messages.action_deletion_for')} {subject} ({name}-
            {row.inum ? row.inum : row.id})
          </ModalHeader>
          <ModalBody>{t('messages.action_deletion_question')}</ModalBody>
          <ModalBody>
            <FormGroup row>
              <Col sm={12}>
                <Input
                  id='user_action_message'
                  type='textarea'
                  name='user_action_message'
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder={t('placeholders.action_commit_message')}
                  defaultValue=''
                  value={userMessage}
                />
                {userMessage.length < 10 && (
                  <span className='text-danger'>
                    {10 - userMessage.length}{' '}
                    {userMessage.length ? ' more' : ''} characters required
                  </span>
                )}
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {active && (
              <Button
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                onClick={handleAccept}
              >
                {t('actions.yes')}
              </Button>
            )}{' '}
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              onClick={closeModal}
            >
              {t('actions.no')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

export default GluuDialog
GluuDialog.propTypes = {
  feature: PropTypes.string,
  row: PropTypes.any,
  handler: PropTypes.func,
  modal: PropTypes.bool.isRequired,
  onAccept: PropTypes.func,
  subject: PropTypes.any,
  name: PropTypes.string,
}
