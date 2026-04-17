import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Edit, DeleteOutlined } from '@mui/icons-material'
import { Divider } from '@mui/material'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuButton } from '@/components/GluuButton'
import { GluuTable, type ColumnDef, type ActionDef } from '@/components/GluuTable'
import SetTitle from 'Utils/SetTitle'
import { buildPayload, type UserAction } from 'Utils/PermChecker'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { devLogger } from '@/utils/devLogger'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import type { ThemeConfig } from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { ICON_SIZE, SPACING } from '@/constants'
import { makeStyles } from 'tss-react/mui'
import { fontFamily, lineHeights, fontWeights, fontSizes } from '@/styles/fonts'
import {
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputAutofillStyles,
  createFormInputPlaceholderStyles,
} from '@/styles/formStyles'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { BUTTON_STYLES } from 'Routes/Apps/Gluu/styles/GluuThemeFormFooter.style'
import {
  useAuthServerJsonPropertiesQuery,
  usePatchAuthServerJsonPropertiesMutation,
} from 'Plugins/auth-server/hooks/useAuthServerJsonProperties'
import type { AcrMappingFormValues, AcrMappingTableRow } from '../AgamaFlows/types'
import {
  transformAcrMappingsToTableData,
  buildAcrMappingPayload,
  buildAcrMappingDeletePayload,
  prepareMappingsForUpdate,
  prepareMappingsForDelete,
  toActionData,
} from '../AgamaFlows/helper'

const authResourceId = ADMIN_UI_RESOURCES.Authentication
const authScopes = CEDAR_RESOURCE_SCOPES[authResourceId]

const TABLE_LINE_HEIGHT = lineHeights.relaxed

const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const inputBg = themeColors.inputBackground
  const cardBorderStyle = getCardBorderStyle({ isDark })

  const inputColors = {
    inputBg,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  return {
    page: {
      'fontFamily': fontFamily,
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'boxSizing': 'border-box' as const,
      'paddingTop': SPACING.CARD_CONTENT_GAP,
      '& table td': {
        verticalAlign: 'middle',
        minWidth: 0,
        lineHeight: TABLE_LINE_HEIGHT,
        wordBreak: 'break-all',
        overflowWrap: 'anywhere',
      },
      '& table th': {
        verticalAlign: 'middle',
        lineHeight: TABLE_LINE_HEIGHT,
      },
    },
    editIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
    modalContainer: {
      ...cardBorderStyle,
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: cardBg,
      width: 'min(540px, 90vw)',
      maxWidth: '540px',
    },
    fieldsColumn: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 20,
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
    },
    fieldLabel: {
      fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.base,
      lineHeight: 'normal',
      color: themeColors.fontColor,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    fieldInput: {
      'width': '100%',
      'boxSizing': 'border-box' as const,
      fontFamily,
      'fontSize': fontSizes.base,
      'outline': 'none',
      ...createFormInputStyles(inputColors),
      '&::placeholder': createFormInputPlaceholderStyles(themeColors.textMuted),
      '&:focus, &:focus-visible': createFormInputFocusStyles(inputColors),
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        createFormInputAutofillStyles(inputColors),
    },
    inputWrapper: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },
  }
})

interface AliasesProps {
  onRegisterAddHandler?: (fn: () => void) => void
}

const PAGE_SIZE = 10

const Aliases = ({ onRegisterAddHandler }: AliasesProps): React.ReactElement => {
  const { t } = useTranslation()
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()

  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState.theme || DEFAULT_THEME),
    [themeState.theme],
  )
  const isDark = useMemo(() => themeState.theme === THEME_DARK, [themeState.theme])
  const { classes } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<AcrMappingTableRow | null>(null)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<AcrMappingTableRow | null>(null)

  SetTitle(t('titles.authentication'))

  const canReadAuth = useMemo(
    () => hasCedarReadPermission(authResourceId),
    [hasCedarReadPermission],
  )
  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(authResourceId),
    [hasCedarWritePermission],
  )

  const {
    data: configuration = {},
    isLoading: configLoading,
    isFetching: configFetching,
  } = useAuthServerJsonPropertiesQuery({ enabled: canReadAuth })

  const acrConfig = configuration as { acrMappings?: Record<string, string> }
  const patchJsonMutation = usePatchAuthServerJsonPropertiesMutation()
  const loading = configLoading || configFetching || patchJsonMutation.isPending

  const initialFormValues = useMemo<AcrMappingFormValues>(() => ({ source: '', mapping: '' }), [])

  const listData = useMemo(
    () => transformAcrMappingsToTableData(acrConfig.acrMappings),
    [acrConfig.acrMappings],
  )

  const handleSubmitCallback = useCallback(
    async (values: AcrMappingFormValues): Promise<void> => {
      try {
        const userAction: UserAction = { action_message: '', action_data: null }
        const currentMappings = { ...(acrConfig.acrMappings ?? {}) }
        const nextMappings = prepareMappingsForUpdate(
          currentMappings,
          values,
          isEdit,
          selectedRow?.mapping,
        )
        const postBody = buildAcrMappingPayload(nextMappings, acrConfig.acrMappings)
        buildPayload(userAction, 'changes', toActionData(postBody))
        await patchJsonMutation.mutateAsync(userAction)
        setIsEdit(false)
        setSelectedRow(null)
        setShowAddModal(false)
      } catch (error) {
        devLogger.error(error)
      }
    },
    [acrConfig.acrMappings, isEdit, selectedRow, patchJsonMutation],
  )

  const formik = useFormik<AcrMappingFormValues>({
    initialValues: initialFormValues,
    onSubmit: handleSubmitCallback,
    enableReinitialize: true,
  })

  const formikRef = useRef(formik)
  const initialFormValuesRef = useRef(initialFormValues)
  formikRef.current = formik
  initialFormValuesRef.current = initialFormValues

  useEffect(() => {
    if (authScopes && authScopes.length > 0) {
      authorizeHelper(authScopes)
    }
  }, [authorizeHelper])

  useEffect(() => {
    if (!showAddModal) {
      formikRef.current.resetForm({ values: initialFormValuesRef.current })
      setIsEdit(false)
      setSelectedRow(null)
    }
  }, [showAddModal])

  const handleAddClick = useCallback(() => {
    if (!canWriteAuth) return
    setIsEdit(false)
    setSelectedRow(null)
    formik.resetForm({ values: initialFormValues })
    setShowAddModal(true)
  }, [canWriteAuth, formik, initialFormValues])

  useEffect(() => {
    onRegisterAddHandler?.(handleAddClick)
  }, [onRegisterAddHandler, handleAddClick])

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialFormValues })
    setIsEdit(false)
    setSelectedRow(null)
    setShowAddModal(false)
  }, [formik, initialFormValues])

  const handleEditClick = useCallback(
    (row: AcrMappingTableRow) => {
      setIsEdit(true)
      setSelectedRow(row)
      formik.setValues({ source: row.source, mapping: row.mapping })
      setShowAddModal(true)
    },
    [formik],
  )

  const handleDeleteClick = useCallback((row: AcrMappingTableRow) => {
    setItemToDelete(row)
    setDeleteModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(
    async (message: string): Promise<void> => {
      if (!itemToDelete?.mapping) return
      try {
        const userAction: UserAction = { action_message: '', action_data: null }
        const currentMappings = { ...(acrConfig.acrMappings ?? {}) }
        const updatedMappings = prepareMappingsForDelete(currentMappings, itemToDelete.mapping)
        const postBody = buildAcrMappingDeletePayload(updatedMappings, acrConfig.acrMappings)
        const basePayload = toActionData(postBody) as Record<string, JsonValue>
        const payloadWithDeleteInfo: Record<string, JsonValue> = {
          ...basePayload,
          deletedMapping: { mapping: itemToDelete.mapping, source: itemToDelete.source },
        }
        buildPayload(userAction, message, payloadWithDeleteInfo)
        await patchJsonMutation.mutateAsync(userAction)
        setDeleteModal(false)
        setItemToDelete(null)
      } catch (error) {
        devLogger.error(error)
      }
    },
    [itemToDelete, acrConfig.acrMappings, patchJsonMutation],
  )

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal(false)
    setItemToDelete(null)
  }, [])

  const deleteDialogLabel = useMemo(
    () =>
      itemToDelete
        ? `${t('messages.action_deletion_for')} ACR mapping (${itemToDelete.mapping})`
        : '',
    [t, itemToDelete],
  )

  const columns: ColumnDef<AcrMappingTableRow>[] = useMemo(
    () => [
      { key: 'mapping', label: t('fields.mapping') },
      { key: 'source', label: t('fields.source') },
    ],
    [t],
  )

  const actions = useMemo<ActionDef<AcrMappingTableRow>[]>(() => {
    if (!canWriteAuth) return []
    return [
      {
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('messages.edit_acr'),
        id: 'editAlias',
        onClick: handleEditClick,
      },
      {
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('actions.delete'),
        id: 'deleteAlias',
        onClick: handleDeleteClick,
      },
    ]
  }, [canWriteAuth, t, handleEditClick, handleDeleteClick, classes.editIcon, classes.deleteIcon])

  const getRowKey = useCallback(
    (row: AcrMappingTableRow, index: number) => row.mapping ?? `alias-${index}`,
    [],
  )

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      formik.handleSubmit(event)
    },
    [formik],
  )

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    },
    [handleCancel],
  )

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
      e.stopPropagation()
    },
    [handleCancel],
  )

  const modalTitle = isEdit ? t('titles.edit_alias') : t('titles.add_alias')
  const applyButtonLabel = isEdit ? t('actions.edit') : t('actions.add')
  const isApplyDisabled = !formik.values.mapping.trim() || !formik.values.source.trim() || loading

  const modalContent = showAddModal ? (
    <GluuLoader blocking={loading}>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handleCancel}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        className={`${commitClasses.modalContainer} ${classes.modalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="add-mapping-modal-title"
      >
        <button
          type="button"
          onClick={handleCancel}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <i className="fa fa-times" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="add-mapping-modal-title">
            {modalTitle}
          </GluuText>

          <form onSubmit={handleFormSubmit}>
            <div className={classes.fieldsColumn}>
              <div className={classes.fieldGroup}>
                <label className={classes.fieldLabel} htmlFor="mapping-input">
                  {t('fields.mapping')}:
                </label>
                <div className={classes.inputWrapper}>
                  <input
                    id="mapping-input"
                    name="mapping"
                    type="text"
                    className={classes.fieldInput}
                    value={formik.values.mapping}
                    onChange={formik.handleChange}
                    placeholder={getFieldPlaceholder(t, 'fields.mapping')}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={classes.fieldGroup}>
                <label className={classes.fieldLabel} htmlFor="source-input">
                  {t('fields.source')}:
                </label>
                <div className={classes.inputWrapper}>
                  <input
                    id="source-input"
                    name="source"
                    type="text"
                    className={classes.fieldInput}
                    value={formik.values.source}
                    onChange={formik.handleChange}
                    placeholder={getFieldPlaceholder(t, 'fields.source')}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <Divider sx={{ mt: 2 }} />
            <div style={{ paddingTop: 16, paddingBottom: 8 }}>
              <GluuButton
                type="submit"
                disabled={isApplyDisabled}
                loading={loading}
                backgroundColor={themeColors.formFooter.back.backgroundColor}
                textColor={themeColors.formFooter.back.textColor}
                borderColor={themeColors.formFooter.back.borderColor}
                useOpacityOnHover
                hoverOpacity={0.85}
                style={{
                  minHeight: BUTTON_STYLES.height,
                  padding: `${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`,
                  borderRadius: BUTTON_STYLES.borderRadius,
                  fontSize: BUTTON_STYLES.fontSize,
                  fontWeight: BUTTON_STYLES.fontWeight,
                  letterSpacing: BUTTON_STYLES.letterSpacing,
                }}
              >
                {applyButtonLabel}
              </GluuButton>
            </div>
          </form>
        </div>
      </div>
    </GluuLoader>
  ) : null

  return (
    <GluuLoader blocking={loading && !showAddModal}>
      <GluuViewWrapper canShow={canReadAuth}>
        <div className={classes.page}>
          <GluuTable<AcrMappingTableRow>
            columns={columns}
            data={listData}
            actions={actions}
            getRowKey={getRowKey}
            pagination={{
              page: 0,
              rowsPerPage: PAGE_SIZE,
              totalItems: listData.length,
              onPageChange: () => {},
              onRowsPerPageChange: () => {},
            }}
            emptyMessage={t('messages.no_data')}
          />
        </div>
      </GluuViewWrapper>

      {modalContent !== null && createPortal(modalContent, document.body)}

      {itemToDelete && (
        <GluuCommitDialog
          handler={handleCloseDeleteModal}
          modal={deleteModal}
          onAccept={handleDeleteConfirm}
          label={deleteDialogLabel}
          feature=""
          autoCloseOnAccept
        />
      )}
    </GluuLoader>
  )
}

export default Aliases
