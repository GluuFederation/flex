import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
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
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import type { RootState } from '@/redux/sagas/types/audit'
import type { GluuCommitDialogOperation, GluuCommitDialogProps, JsonValue } from './types'

const USER_MESSAGE = 'user_action_message'

const isJsonValueArray = (value: JsonValue): value is JsonValue[] => {
  return Array.isArray(value)
}

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
}: GluuCommitDialogProps) => {
  const { t } = useTranslation()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'light'
  const [active, setActive] = useState(false)
  const [isOpen, setIsOpen] = useState<number | null>(null)
  const [userMessage, setUserMessage] = useState('')
  const { loadingWebhooks, webhookModal } = useSelector((state: RootState) => state.webhookReducer)

  const webhookResourceId = useMemo(() => ADMIN_UI_RESOURCES.Webhooks, [])
  const webhookScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[webhookResourceId] || [],
    [webhookResourceId],
  )
  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(webhookResourceId),
    [hasCedarReadPermission, webhookResourceId],
  )

  useEffect(() => {
    if (webhookScopes && webhookScopes.length > 0) {
      authorizeHelper(webhookScopes)
    }
  }, [authorizeHelper, webhookScopes])

  const { webhookTriggerModal, onCloseModal } = useWebhookDialogAction({
    feature,
    modal,
  })

  const prevModalRef = useRef<boolean>(false)
  useEffect(() => {
    setActive(userMessage.length >= 10 && userMessage.length <= 512)

    if (modal && !prevModalRef.current) {
      setUserMessage('')
    }
    prevModalRef.current = modal
  }, [userMessage, modal])

  function handleAccept() {
    if (formik) {
      formik.setFieldValue('action_message', userMessage)
    }
    onAccept(userMessage)
  }
  const closeModal = () => {
    handler()
    onCloseModal()
    setUserMessage('')
  }

  const renderBadges = (values: JsonValue[]) => {
    return (
      <div className="d-flex flex-column gap-1 align-items-start">
        {values.map((data) => (
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

  const renderArrayValue = (values: JsonValue[], key: number) => {
    if (!values.length) {
      return <Badge color={`primary-${selectedTheme}`}>&quot;&quot;</Badge>
    }

    return (
      <div className="d-flex flex-column gap-1 align-items-start">
        {isOpen === key ? (
          <Collapse isOpen={isOpen === key}>{renderBadges(values)}</Collapse>
        ) : (
          renderBadges(values.slice(0, 2))
        )}
        {values.length > 2 && (
          <Button color="link" onClick={() => setIsOpen(isOpen !== key ? key : null)} size="sm">
            {isOpen === key ? 'Show Less' : 'Show More'}
            {isOpen === key ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Button>
        )}
      </div>
    )
  }

  if (!modal) {
    return <></>
  }
  return (
    <>
      {(webhookModal || loadingWebhooks) && canReadWebhooks ? (
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
                operations.map((item: GluuCommitDialogOperation, key: number) => (
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
                      {isJsonValueArray(item.value) ? (
                        renderArrayValue(item.value, key)
                      ) : typeof item.value === 'boolean' ? (
                        <Badge color={`primary-${selectedTheme}`}>{String(item.value)}</Badge>
                      ) : item.value === '' || item.value === null || item.value === undefined ? (
                        <Badge color={`primary-${selectedTheme}`}>&quot;&quot;</Badge>
                      ) : typeof item.value === 'object' ? (
                        <Badge color={`primary-${selectedTheme}`}>
                          {JSON.stringify(item.value)}
                        </Badge>
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
                  {(userMessage.length < 10 || userMessage.length > 512) && (
                    <span
                      style={{
                        color: customColors.accentRed,
                      }}
                    >
                      {userMessage.length < 10
                        ? `${10 - userMessage.length}${userMessage.length ? ` ${t('placeholders.more')}` : ''} ${t('placeholders.charLessThan10')}`
                        : `${userMessage.length - 512} ${t('placeholders.charMoreThan512')}`}
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
            )}
            <Button color={`primary-${selectedTheme}`} onClick={closeModal}>
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
