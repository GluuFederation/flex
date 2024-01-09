import React, { Fragment, useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Modal,
  Badge,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import {
  getWebhooksByFeatureId,
  getWebhooksByFeatureIdResponse,
  setWebhookModal,
  triggerWebhook,
  setWebhookTriggerErrors,
} from 'Plugins/admin/redux/features/WebhookSlice'
import PropTypes from 'prop-types'
import { ThemeContext } from 'Context/theme/themeContext'
import { Typography } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'

const useWebhookDialogAction = ({ feature }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
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
  }, [dispatch])

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

  const loadingModalState = (
    <Modal
      isOpen={loadingWebhooks}
      size={'lg'}
      toggle={() => {}}
      className='modal-outline-primary'
    >
      <ModalHeader toggle={() => {}}>Loading....</ModalHeader>
    </Modal>
  )

  const webhookTriggerModal = ({ closeModal }) => {
    return (
      <Modal
        isOpen={webhookModal}
        size={'lg'}
        toggle={closeModal}
        className='modal-outline-primary'
      >
        <ModalHeader toggle={closeModal}>
          <i
            onClick={closeModal}
            onKeyDown={() => {}}
            style={{ color: 'green' }}
            New
            code
            className='fa fa-2x fa-info fa-fw modal-icon mb-3'
            role='img'
            aria-hidden='true'
          ></i>{' '}
          Webhook Trigger
        </ModalHeader>
        <ModalBody>
          <Typography variant='subtitle1' fontWeight={600}>
            Below webhooks will be triggered.
          </Typography>
          <p>{triggerWebhookMessage}</p>
          {webhookTriggerErrors.length ? (
            <ul>
              {webhookTriggerErrors.map((str) => (
                <li key={str} style={{ color: 'red' }}>
                  {str}
                </li>
              ))}
            </ul>
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
    )
  }

  return { onCloseModal, loadingModalState, webhookTriggerModal }
}

export default useWebhookDialogAction
useWebhookDialogAction.propTypes = {
  feature: PropTypes.string,
}
