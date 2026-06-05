import { useMemo, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setShowWebhookExecutionDialog,
  setWebhookTriggerResults,
} from 'Plugins/admin/redux/features/WebhookSlice'
import { Check, Close, InfoOutlined } from '@/components/icons'
import { ModalLayer } from '@/components/ModalLayer'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import { useStyles } from './styles/GluuWebhookExecutionDialog.style'
import { useStyles as useCommitDialogStyles } from './styles/GluuCommitDialog.style'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import type { WebhookTriggerResponseItem } from 'Plugins/admin/redux/types'
import GluuLoader from './GluuLoader'

const isWebhookSuccess = (item: WebhookTriggerResponseItem): boolean =>
  item.success === true || String(item.success).toLowerCase() === 'true'

const getWebhookName = (item: WebhookTriggerResponseItem): string =>
  item.responseObject?.webhookName ??
  item.responseObject?.webhookId ??
  item.responseObject?.inum ??
  ''

const GluuWebhookExecutionDialog = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const webhookState = useAppSelector((state) => state.webhookReducer)
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes, cx } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

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

  const {
    triggerWebhookInProgress = false,
    webhookTriggerResults,
    showWebhookExecutionDialog,
  } = webhookState ?? {}
  const hasWebhookResults = (webhookTriggerResults?.length ?? 0) > 0
  const showWebhookLoader =
    triggerWebhookInProgress || (showWebhookExecutionDialog && !hasWebhookResults)

  const closeModal = useCallback(() => {
    dispatch(setShowWebhookExecutionDialog(false))
    dispatch(setWebhookTriggerResults([]))
  }, [dispatch])

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
      }
      e.stopPropagation()
    },
    [closeModal],
  )

  if (!webhookState || !canReadWebhooks) return null

  if (!showWebhookExecutionDialog || !hasWebhookResults) {
    return showWebhookLoader ? createPortal(<GluuLoader blocking />, document.body) : null
  }

  const modalContent = (
    <ModalLayer onClose={closeModal}>
      <div
        className={cx(commitClasses.modalContainer, classes.modalContainer)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="webhook-execution-dialog-title"
      >
        <button
          type="button"
          onClick={closeModal}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <div className={`${commitClasses.contentArea} ${classes.contentArea}`}>
          <div className={classes.titleWithDescription}>
            <GluuText variant="h2" className={classes.title} id="webhook-execution-dialog-title">
              <InfoOutlined
                style={{ color: customColors.logo }}
                className={classes.titleIcon}
                aria-hidden
              />
              {t('messages.webhook_execution_information')}
            </GluuText>
            <GluuText variant="p" className={classes.description}>
              {t('messages.webhook_execution_dialog_dec')}
            </GluuText>
          </div>
          {(webhookTriggerResults?.length ?? 0) > 0 && (
            <div className={classes.tableScrollContainer}>
              <Table
                className={classes.tableWrapper}
                aria-label="webhook execution table"
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
                    <TableCell align="left">{t('fields.webhook_name')}</TableCell>
                    <TableCell align="left">{t('fields.webhook_id')}</TableCell>
                    <TableCell align="left">{t('fields.status')}</TableCell>
                    <TableCell align="left">{t('fields.response_code')}</TableCell>
                    <TableCell align="left">{t('messages.error_message')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(webhookTriggerResults ?? []).map((item: WebhookTriggerResponseItem, index) => {
                    const isSuccess = isWebhookSuccess(item)
                    return (
                      <TableRow
                        key={`${item.responseObject?.webhookId ?? ''}-${getWebhookName(item)}-${index}`}
                      >
                        <TableCell component="th" scope="row" align="left">
                          {getWebhookName(item)}
                        </TableCell>
                        <TableCell align="left">{item.responseObject?.webhookId ?? '-'}</TableCell>
                        <TableCell align="left">
                          <span className={isSuccess ? classes.successValue : classes.failedValue}>
                            {isSuccess ? t('messages.success') : t('messages.error')}
                          </span>
                        </TableCell>
                        <TableCell align="left">
                          {isSuccess ? '-' : (item.responseCode ?? '-')}
                        </TableCell>
                        <TableCell align="left">
                          {isSuccess ? '-' : (item.responseMessage ?? '-')}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          <div className={classes.buttonRow}>
            <GluuButton
              onClick={closeModal}
              backgroundColor={themeColors.formFooter.back.backgroundColor}
              textColor={themeColors.formFooter.back.textColor}
              borderColor="transparent"
              padding="8px 28px"
              minHeight="40"
              useOpacityOnHover
              className={commitClasses.yesButton}
            >
              <Check fontSize="small" className={classes.actionIcon} aria-hidden />
              {t('actions.ok')}
            </GluuButton>
          </div>
        </div>
      </div>
    </ModalLayer>
  )

  return createPortal(modalContent, document.body)
}

export default GluuWebhookExecutionDialog
