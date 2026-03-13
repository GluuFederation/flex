import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  getWebhooksByFeatureIdResponse,
  setWebhookModal,
  setWebhookTriggerErrors,
  setTriggerWebhookResponse,
  setFeatureToTrigger,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { useGetWebhooksByFeatureId, type WebhookEntry } from 'JansConfigApi'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components'
import { useStyles as useCommitDialogStyles } from '@/routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { useWebhookTriggerModalStyles } from '@/utils/styles/WebhookTriggerModal.style'

interface UseWebhookDialogActionProps {
  feature?: string
  modal: boolean
}

interface WebhookTriggerModalProps {
  closeModal: () => void
}

const WEBHOOK_RESOURCE_ID = ADMIN_UI_RESOURCES.Webhooks
const WEBHOOK_SCOPES = CEDAR_RESOURCE_SCOPES[WEBHOOK_RESOURCE_ID]

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null,
  )

const useWebhookDialogAction = ({ feature, modal }: UseWebhookDialogActionProps) => {
  const dispatch = useAppDispatch()
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  const { t } = useTranslation()

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes: webhookClasses } = useWebhookTriggerModalStyles({ isDark, themeColors })

  const webhookState = useAppSelector((state) => state.webhookReducer)
  const webhookModal = webhookState?.webhookModal ?? false
  const triggerWebhookInProgress = webhookState?.triggerWebhookInProgress ?? false

  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(WEBHOOK_RESOURCE_ID),
    [hasCedarReadPermission],
  )

  const queryEnabled = canReadWebhooks && modal && !!feature
  const {
    data: rawWebhookData,
    isFetching: loadingWebhooks,
    isFetched,
  } = useGetWebhooksByFeatureId(feature ?? '', {
    query: {
      enabled: queryEnabled,
    },
  })

  const featureWebhooks = useMemo(
    () => (Array.isArray(rawWebhookData) ? (rawWebhookData as WebhookEntry[]) : []),
    [rawWebhookData],
  )

  const enabledFeatureWebhooks = useMemo(
    () => featureWebhooks.filter((item) => Boolean(item.jansEnabled)),
    [featureWebhooks],
  )

  // Sync to Redux so the trigger saga can read featureWebhooks from state
  useEffect(() => {
    if (isFetched) {
      dispatch(getWebhooksByFeatureIdResponse(featureWebhooks))
    }
  }, [featureWebhooks, isFetched, dispatch])

  useEffect(() => {
    authorizeHelper(WEBHOOK_SCOPES)
  }, [authorizeHelper])

  const onCloseModal = useCallback(() => {
    dispatch(setWebhookModal(false))
    dispatch(setWebhookTriggerErrors([]))
    dispatch(setTriggerWebhookResponse(''))
    dispatch(setFeatureToTrigger(''))
  }, [dispatch])

  useEffect(() => {
    if (!modal) {
      dispatch(setWebhookModal(false))
    } else if (feature && canReadWebhooks) {
      const showWebhookFlow = !loadingWebhooks && (enabledFeatureWebhooks?.length ?? 0) > 0
      dispatch(setWebhookModal(showWebhookFlow))
    }
  }, [modal, feature, canReadWebhooks, loadingWebhooks, enabledFeatureWebhooks, dispatch])

  const webhookCheckComplete = useMemo(() => {
    if (!queryEnabled) return true
    return isFetched && !loadingWebhooks
  }, [queryEnabled, isFetched, loadingWebhooks])

  const modalRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<Element | null>(null)

  useEffect(() => {
    if (webhookModal && canReadWebhooks) {
      previouslyFocusedRef.current = document.activeElement as Element | null
      const frame = requestAnimationFrame(() => {
        modalRef.current?.focus()
      })
      return () => {
        cancelAnimationFrame(frame)
        const prevEl = previouslyFocusedRef.current as HTMLElement | null
        if (prevEl && typeof prevEl.focus === 'function') {
          prevEl.focus()
        }
      }
    }
  }, [webhookModal, canReadWebhooks])

  const handleAcceptWebhookTrigger = () => {
    dispatch(setWebhookModal(false))
    if (feature) {
      dispatch(setFeatureToTrigger(feature))
    }
  }

  const webhookTriggerModal = ({ closeModal }: WebhookTriggerModalProps) => {
    const closeWebhookTriggerModal = () => {
      closeModal()
      dispatch(setFeatureToTrigger(''))
    }

    const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') && !loadingWebhooks) {
        e.preventDefault()
        closeWebhookTriggerModal()
      }
    }

    const handleModalKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeWebhookTriggerModal()
        e.stopPropagation()
        return
      }
      if (e.key === 'Tab') {
        const container = e.currentTarget as HTMLElement
        const focusable = getFocusableElements(container)
        if (focusable.length === 0) return
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)
        const nextIndex = e.shiftKey
          ? currentIndex <= 0
            ? focusable.length - 1
            : currentIndex - 1
          : currentIndex >= focusable.length - 1
            ? 0
            : currentIndex + 1
        e.preventDefault()
        focusable[nextIndex]?.focus()
        e.stopPropagation()
        return
      }
      e.stopPropagation()
    }

    if (!webhookModal || !canReadWebhooks) return null

    const modalContent = (
      <>
        <button
          type="button"
          className={`${commitClasses.overlay} ${webhookClasses.overlay}`}
          onClick={() => !loadingWebhooks && closeWebhookTriggerModal()}
          onKeyDown={handleOverlayKeyDown}
          aria-label={t('actions.close')}
        />
        <div
          ref={modalRef}
          className={`${commitClasses.modalContainer} ${webhookClasses.modalContainer}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          aria-labelledby="webhook-modal-title"
        >
          <button
            type="button"
            onClick={closeWebhookTriggerModal}
            className={commitClasses.closeButton}
            aria-label={t('actions.close')}
            title={t('actions.close')}
          >
            <i className="fa fa-times" aria-hidden />
          </button>
          <div className={`${commitClasses.contentArea} ${webhookClasses.contentArea}`}>
            <div className={webhookClasses.titleWithDescription}>
              <GluuText variant="h2" className={webhookClasses.title} id="webhook-modal-title">
                {t('messages.webhook_execution_information')}
              </GluuText>
              <GluuText variant="p" className={webhookClasses.description}>
                {t('messages.webhook_dialog_dec')}
              </GluuText>
            </div>

            {enabledFeatureWebhooks?.length ? (
              <Table
                className={webhookClasses.tableWrapper}
                aria-label="webhook table"
                sx={{
                  '& .MuiTableCell-root': {
                    color: themeColors.fontColor,
                    borderColor: themeColors.borderColor,
                  },
                  '& .MuiTableHead-root .MuiTableCell-root': {
                    fontWeight: 600,
                    fontSize: 16,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ width: '50%' }}>
                      {t('fields.webhook_name')}
                    </TableCell>
                    <TableCell sx={{ width: '50%' }}>{t('fields.webhook_id')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enabledFeatureWebhooks.map((item) => (
                    <TableRow key={item.inum}>
                      <TableCell component="th" scope="row">
                        {item.displayName}
                      </TableCell>
                      <TableCell align="left">{item.inum}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
            <div className={webhookClasses.buttonRow}>
              <GluuButton
                disabled={triggerWebhookInProgress}
                backgroundColor={themeColors.badges.statusActive}
                textColor={themeColors.badges.filledBadgeText}
                borderColor="transparent"
                padding="8px 28px"
                minHeight="40"
                useOpacityOnHover
                className={commitClasses.yesButton}
                onClick={handleAcceptWebhookTrigger}
              >
                {t('actions.accept')}
              </GluuButton>
            </div>
          </div>
        </div>
      </>
    )

    return createPortal(modalContent, document.body)
  }

  return {
    onCloseModal,
    webhookTriggerModal,
    webhookCheckComplete,
    isLoadingWebhooks: loadingWebhooks,
  }
}

export default useWebhookDialogAction
