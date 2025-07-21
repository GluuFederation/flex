import React, { useState, useEffect, useContext } from 'react'
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
  Collapse,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import PropTypes from 'prop-types'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useSelector } from 'react-redux'
import useWebhookDialogAction from 'Utils/hooks/useWebhookDialogAction'
import { WEBHOOK_READ } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import customColors from '@/customColors'

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
  feature,
  isLicenseLabel = false,
}: any) => {
  const { t } = useTranslation()
  const { hasCedarPermission } = useCedarling()

  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [active, setActive] = useState(false)
  const [isOpen, setIsOpen] = useState(null)
  const [userMessage, setUserMessage] = useState('')
  const { loadingWebhooks, webhookModal } = useSelector((state: any) => state.webhookReducer)
  const { webhookTriggerModal, onCloseModal } = useWebhookDialogAction({
    feature,
    modal,
  })

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
    onAccept(userMessage)
    setUserMessage('')
  }
  const closeModal = () => {
    handler()
    setUserMessage('')
    onCloseModal()
  }

  if (!modal) {
    return <></>
  }
  const renderBadges = (values: any) => {
    return (
      <div className="d-flex flex-column gap-1 align-items-start">
        {values.map((data: any, index: any) => (
          <Badge
            color={`primary-${selectedTheme}  `}
            style={{ width: 'fit-content' }}
            key={String(data)}
          >
            {JSON.stringify(data)}
          </Badge>
        ))}
      </div>
    )
  }
  return (
    <>
      {(webhookModal || loadingWebhooks) && hasCedarPermission(WEBHOOK_READ) ? (
        <>{webhookTriggerModal({ closeModal })}</>
      ) : (
        <Modal isOpen={modal} size={'lg'} toggle={closeModal} className="modal-outline-primary">
          <ModalHeader toggle={closeModal}>
            <i
              onClick={closeModal}
              onKeyDown={() => {}}
              style={{ color: customColors.logo }}
              className="fa fa-2x fa-info fa-fw modal-icon mb-3"
              role="img"
              aria-hidden="true"
            ></i>
            {isLicenseLabel
              ? t('messages.licenseAuditLog')
              : !label || label === ''
                ? t('messages.action_commit_question')
                : label}
          </ModalHeader>
          <ModalBody>
            <div
              style={{
                overflow: 'auto',
                maxHeight: '300px',
                height: 'auto',
                marginBottom: '10px',
                overflowX: 'hidden',
              }}
            >
              {operations?.length ? (
                <FormGroup row>
                  <h1
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      margin: 0,
                      color: `${customColors.black} !important`,
                    }}
                  >
                    List of changes
                  </h1>
                </FormGroup>
              ) : null}
              {operations &&
                operations.map((item: any, key: any) => (
                  <FormGroup row key={key}>
                    <Col sm={1} style={{ fontWeight: 'bold' }}>
                      Set
                    </Col>
                    <Col
                      sm={5}
                      style={{
                        overflow: 'auto',
                        width: 300,
                        paddingBottom: 10,
                      }}
                    >
                      <Badge color={`primary-${selectedTheme}`}>{item.path}</Badge>
                    </Col>
                    <Col sm={1} style={{ fontWeight: 'bold' }}>
                      to
                    </Col>
                    <Col sm={5} style={{ overflow: 'auto' }}>
                      {Array.isArray(item.value) ? (
                        <div className="d-flex flex-column gap-1 align-items-start">
                          {isOpen === key ? (
                            <Collapse isOpen={isOpen === key}>{renderBadges(item.value)}</Collapse>
                          ) : (
                            renderBadges(item.value.slice(0, 2))
                          )}
                          {item.value.length > 2 && (
                            <Button
                              color="link"
                              onClick={() => setIsOpen(isOpen !== key ? key : null)}
                              size="sm"
                            >
                              {isOpen === key ? 'Show Less' : 'Show More'}
                              {isOpen === key ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Badge color={`primary-${selectedTheme}`}>{String(item.value)}</Badge>
                      )}
                    </Col>
                  </FormGroup>
                ))}
            </div>
            <div>
              <FormGroup row>
                <Col sm={12}>
                  <Input
                    id={USER_MESSAGE}
                    type={inputType || 'textarea'}
                    name={USER_MESSAGE}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder={
                      !placeholderLabel || placeholderLabel === ''
                        ? t('placeholders.action_commit_message')
                        : placeholderLabel
                    }
                    rows="4"
                    value={userMessage}
                  />
                  {userMessage.length < 10 && (
                    <span
                      style={{
                        color: customColors.accentRed,
                      }}
                    >
                      {10 - userMessage.length} {userMessage.length ? ' more' : ''} characters
                      required
                    </span>
                  )}
                </Col>
              </FormGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            {active && (
              <Button color={`primary-${selectedTheme}`} onClick={handleAccept}>
                <i className="fa fa-check-circle me-2"></i>
                {t('actions.accept')}
              </Button>
            )}{' '}
            <Button onClick={closeModal}>
              <i className="fa fa-remove me-2"></i>
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
  operations: PropTypes.any,
  handler: PropTypes.func,
  modal: PropTypes.bool.isRequired,
  onAccept: PropTypes.func,
  placeholderLabel: PropTypes.string,
  inputType: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.object,
  isLicenseLabel: PropTypes.bool,
}
