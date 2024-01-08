import React, { useState, useEffect, useContext, Fragment } from 'react'
import {
  FormGroup,
  Col,
  Input,
  Button,
  Modal,
  Badge,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import applicationStyle from './styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  getWebhooksByFeatureId,
  getWebhooksByFeatureIdResponse,
  setWebhookModal,
  triggerWebhook,
} from 'Plugins/admin/redux/features/WebhookSlice'

const USER_MESSAGE = 'user_action_message'

const GluuCommitDialog = ({
  handler,
  modal,
  onAccept,
  formik,
  operations,
  label,
  placeholderLabel,
  inputType,
  isLoading,
  feature,
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(isLoading)
  const [userMessage, setUserMessage] = useState('')
  const {
    featureWebhooks,
    loadingWebhooks,
    webhookModal,
    triggerWebhookMessage,
    webhookTriggerErrors,
    triggerWebhookInProgress
  } = useSelector((state) => state.webhookReducer)
  const enabledFeatureWebhooks = featureWebhooks.filter(
    (item) => item.jansEnabled
  )

  useEffect(() => {
    if (userMessage.length >= 10) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [userMessage])

  function handleAccept() {
    if (formik) {
      formik.setFieldValue('action_message', userMessage)
    }
    setLoading(true)
    onAccept(userMessage)
    setUserMessage('')
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
      <>
        <Modal
          isOpen={loadingWebhooks}
          size={'lg'}
          toggle={() => {}}
          className='modal-outline-primary'
        >
          <ModalHeader toggle={() => {}}>Loading....</ModalHeader>
        </Modal>
      </>
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
            {enabledFeatureWebhooks &&
              enabledFeatureWebhooks.map((item, key) => (
                <Fragment key={key}>
                  <Badge>{item.displayName}</Badge>
                  {key + 1 === enabledFeatureWebhooks.length ? (
                    ''
                  ) : (
                    <span>,</span>
                  )}
                  {/* <span
                    style={{ display: 'block' }}
                    color={`primary-${selectedTheme}`}
                  >
                    {item.displayName}{' '}
                    {key + 1 === featureWebhooks.length ? '' : ','}
                  </span> */}
                </Fragment>
              ))}
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
            <Button disabled={triggerWebhookInProgress} style={applicationStyle.buttonStyle} onClick={closeModal}>
              <i className='fa fa-remove me-2'></i>
              {t('actions.no')}
            </Button>
          </ModalFooter>
        </Modal>
      ) : (
        <Modal
          isOpen={modal}
          size={'lg'}
          toggle={closeModal}
          className='modal-outline-primary'
        >
          <ModalHeader toggle={closeModal}>
            <i
              onClick={closeModal}
              style={{ color: 'green' }}
              className='fa fa-2x fa-info fa-fw modal-icon mb-3'
            ></i>
            {!label || label === ''
              ? t('messages.action_commit_question')
              : label}
          </ModalHeader>
          <ModalBody>
            {operations && <FormGroup row>List of changes</FormGroup>}
            {operations &&
              operations.map((item, key) => (
                <FormGroup row key={key}>
                  <Col sm={1}>Set</Col>
                  <Col sm={5} style={{ overflow: 'auto' }}>
                    <Badge color={`primary-${selectedTheme}`}>
                      {item.path}
                    </Badge>
                  </Col>
                  <Col sm={1}>to</Col>
                  <Col sm={5} style={{ overflow: 'auto' }}>
                    {Array.isArray(item.value) ? (
                      <>
                        {item.value.map((data, index) => (
                          <Badge color={`primary-${selectedTheme}`} key={index}>
                            {String(data)}
                          </Badge>
                        ))}
                      </>
                    ) : (
                      <Badge color={`primary-${selectedTheme}`}>
                        {String(item.value)}
                      </Badge>
                    )}
                  </Col>
                </FormGroup>
              ))}
            <FormGroup row>
              <Col sm={12}>
                <Input
                  id={USER_MESSAGE}
                  type={inputType ? inputType : 'textarea'}
                  name={USER_MESSAGE}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder={
                    !placeholderLabel || placeholderLabel === ''
                      ? t('placeholders.action_commit_message')
                      : placeholderLabel
                  }
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
              <Button color={`primary-${selectedTheme}`} onClick={handleAccept}>
                <i className='fa fa-check-circle me-2'></i>
                {t('actions.accept')}
              </Button>
            )}{' '}
            <Button style={applicationStyle.buttonStyle} onClick={closeModal}>
              <i className='fa fa-remove me-2'></i>
              {t('actions.no')}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

export default GluuCommitDialog
GluuCommitDialog.propTypes = {
  feature: PropTypes.string,
}
