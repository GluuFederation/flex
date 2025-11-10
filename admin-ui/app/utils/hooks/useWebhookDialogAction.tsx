import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import { WEBHOOK_READ } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import customColors from '@/customColors'
import { useGetWebhooksByFeatureId } from 'JansConfigApi'
import { useWebhookDialog } from '@/context/WebhookDialogContext'
import type { WebhookEntry } from 'JansConfigApi'

interface UseWebhookDialogActionProps {
  feature?: string
  modal: boolean
}

interface RootStateOfRedux {
  cedarPermissions: {
    permissions: Record<string, boolean>
  }
}

interface ThemeState {
  state: {
    theme: string
  }
}

const useWebhookDialogAction = ({ feature, modal }: UseWebhookDialogActionProps) => {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeState
  const selectedTheme = theme.state.theme

  // Use webhook dialog context
  const { state, actions } = useWebhookDialog()
  const { featureWebhooks, loadingWebhooks, webhookModal, triggerWebhookInProgress } = state

  // Fetch webhooks by feature using orval hook
  const { data: webhooksData, isLoading: isFetchingWebhooks } = useGetWebhooksByFeatureId(
    feature || '',
    {
      query: {
        enabled: !!feature && modal && hasCedarPermission(WEBHOOK_READ),
      },
    },
  )

  const { permissions: cedarPermissions } = useSelector(
    (state: RootStateOfRedux) => state.cedarPermissions,
  )

  useEffect(() => {
    authorize([WEBHOOK_READ]).catch(console.error)
  }, [authorize])

  // Update context when webhooks data changes
  useEffect(() => {
    if (webhooksData) {
      const webhooks = Array.isArray(webhooksData) ? webhooksData : []
      actions.setFeatureWebhooks(webhooks as WebhookEntry[])
    }
  }, [webhooksData, actions])

  // Update loading state
  useEffect(() => {
    actions.setLoadingWebhooks(isFetchingWebhooks)
  }, [isFetchingWebhooks, actions])

  const enabledFeatureWebhooks = featureWebhooks.filter((item) => item.jansEnabled)
  const hasInitializedModal = useRef(false)

  useEffect(() => {
    if (featureWebhooks.length > 0 && !hasInitializedModal.current) {
      actions.setWebhookModal(enabledFeatureWebhooks.length > 0)
      hasInitializedModal.current = true
    }
  }, [featureWebhooks.length, enabledFeatureWebhooks.length, actions])

  const onCloseModal = useCallback(() => {
    actions.setWebhookModal(false)
    actions.setWebhookTriggerErrors([])
    actions.setTriggerWebhookResponse('')
    actions.setFeatureToTrigger('')
  }, [actions])

  const handleAcceptWebhookTrigger = () => {
    actions.setWebhookModal(false)
    actions.setFeatureToTrigger(feature || '')
  }

  const webhookTriggerModal = ({ closeModal }: { closeModal: () => void }) => {
    const closeWebhookTriggerModal = () => {
      closeModal()
      actions.setFeatureToTrigger('')
    }

    return (
      <Modal
        isOpen={(webhookModal || loadingWebhooks) && hasCedarPermission(WEBHOOK_READ)}
        size={'lg'}
        toggle={() => {
          if (!loadingWebhooks) {
            closeModal()
            actions.setFeatureToTrigger('')
          }
        }}
        className="modal-outline-primary"
      >
        <ModalHeader toggle={closeWebhookTriggerModal}>
          {loadingWebhooks ? (
            <>Loading....</>
          ) : (
            <>
              <i
                onClick={closeWebhookTriggerModal}
                onKeyDown={() => {}}
                style={{ color: customColors.logo }}
                className="fa fa-2x fa-info fa-fw modal-icon mb-3"
                role="img"
                aria-hidden="true"
              ></i>{' '}
              {t('messages.webhook_execution_information')}{' '}
            </>
          )}
        </ModalHeader>
        {!loadingWebhooks ? (
          <>
            <ModalBody>
              <Box display="flex" flexDirection="column" px={2}>
                <p style={{ fontWeight: 600 }}>{t('messages.webhook_dialog_dec')}</p>
              </Box>
              {enabledFeatureWebhooks?.length ? (
                <Table sx={{ minWidth: 650, marginTop: '20px' }} aria-label="webhook table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: 16, fontWeight: 600, width: '50%' }} align="left">
                        <b>{t('fields.webhook_name')}</b>
                      </TableCell>
                      <TableCell sx={{ fontSize: 16, fontWeight: 600, width: '50%' }}>
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
                          'fontSize': 14,
                        }}
                      >
                        <TableCell sx={{ fontSize: 14 }} component="th" scope="row">
                          {item.displayName}
                        </TableCell>
                        <TableCell sx={{ fontSize: 16 }} align="left">
                          {item.inum}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={triggerWebhookInProgress}
                color={`primary-${selectedTheme}`}
                onClick={handleAcceptWebhookTrigger}
                style={applicationStyle.buttonStyle}
              >
                <i className="fa fa-check-circle me-2"></i>
                {t('actions.accept')}
              </Button>
              <Button disabled={triggerWebhookInProgress} onClick={closeWebhookTriggerModal}>
                <i className="fa fa-remove me-2"></i>
                {t('actions.reject')}
              </Button>
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
