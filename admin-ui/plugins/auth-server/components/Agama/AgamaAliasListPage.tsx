import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Form, FormGroup, Col } from 'Components'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import MaterialTable from '@material-table/core'
import type { Column } from '@material-table/core'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { ThemeContext } from 'Context/theme/themeContext'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { buildPayload, type UserAction } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import { getJsonConfig, patchJsonConfig } from 'Plugins/auth-server/redux/features/jsonConfigSlice'
import { updateToast } from 'Redux/features/toastSlice'
import type { AcrMappingFormValues, AcrMappingTableRow, JsonConfigRootState } from './types'
import {
  getAcrMappingValidationSchema,
  transformAcrMappingsToTableData,
  buildAcrMappingPayload,
  buildAcrMappingDeletePayload,
  prepareMappingsForUpdate,
  prepareMappingsForDelete,
  toActionData,
} from './helper'

const authResourceId = ADMIN_UI_RESOURCES.Authentication
const authScopes = CEDAR_RESOURCE_SCOPES[authResourceId]

function AliasesListPage(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'dark'
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()

  const { loading } = useSelector((state: JsonConfigRootState) => state.jsonConfigReducer)
  const configuration = useSelector(
    (state: JsonConfigRootState) => state.jsonConfigReducer.configuration,
  )

  const [listData, setListData] = useState<AcrMappingTableRow[]>([])
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<AcrMappingTableRow | null>(null)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<AcrMappingTableRow | null>(null)

  SetTitle(t('titles.authentication'))

  const bgThemeColor = useMemo(
    () => ({ background: getThemeColor(selectedTheme).background }),
    [selectedTheme],
  )
  const initialFormValues = useMemo<AcrMappingFormValues>(
    () => ({
      source: '',
      mapping: '',
    }),
    [],
  )

  const canReadAuth = useMemo(
    () => hasCedarReadPermission(authResourceId),
    [hasCedarReadPermission, authResourceId],
  )
  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(authResourceId),
    [hasCedarWritePermission, authResourceId],
  )

  const validationSchema = useMemo(() => getAcrMappingValidationSchema(t), [t])

  const handleSubmitCallback = useCallback(
    async (values: AcrMappingFormValues): Promise<void> => {
      try {
        const userAction: UserAction = {} as UserAction
        const currentMappings = { ...(configuration.acrMappings ?? {}) }
        const nextMappings = prepareMappingsForUpdate(
          currentMappings,
          values,
          isEdit,
          selectedRow?.mapping,
        )
        const postBody = buildAcrMappingPayload(nextMappings, configuration?.acrMappings)

        buildPayload(userAction, 'changes', toActionData(postBody))
        dispatch(patchJsonConfig({ action: userAction }))
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error !== null && 'message' in error
              ? String((error as { message: unknown }).message)
              : t('messages.error_processiong_request')
        dispatch(updateToast(true, 'error', `${t('messages.error_in_saving')} ${errorMessage}`))
      }
    },
    [configuration, isEdit, selectedRow, dispatch, t],
  )

  const previousLoadingRef = useRef<boolean>(loading)

  useEffect(() => {
    const wasLoading = previousLoadingRef.current
    const isLoading = loading
    previousLoadingRef.current = loading

    if (wasLoading && !isLoading && configuration?.acrMappings !== undefined) {
      setIsEdit(false)
      setSelectedRow(null)
      setShowAddModal(false)
    } else if (wasLoading && !isLoading && configuration?.acrMappings === undefined) {
      const errorMessage = t('messages.error_processiong_request')
      dispatch(updateToast(true, 'error', `${t('messages.error_in_saving')} ${errorMessage}`))
    }
  }, [loading, configuration, dispatch, t])

  const formik = useFormik<AcrMappingFormValues>({
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: handleSubmitCallback,
    enableReinitialize: true,
  })

  useEffect(() => {
    if (authScopes && authScopes.length > 0) {
      authorizeHelper(authScopes)
    }
  }, [authorizeHelper, authScopes])

  useEffect(() => {
    if (!canReadAuth) {
      return
    }
    dispatch(getJsonConfig())
  }, [dispatch, canReadAuth])

  useEffect(() => {
    const data = transformAcrMappingsToTableData(configuration?.acrMappings)
    setListData(data)
  }, [configuration])

  // Reset form state when modal closes
  useEffect(() => {
    if (!showAddModal) {
      formik.resetForm({ values: initialFormValues })
      setIsEdit(false)
      setSelectedRow(null)
    }
  }, [showAddModal]) // eslint-disable-line

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialFormValues })
    setIsEdit(false)
    setSelectedRow(null)
    setShowAddModal(false)
  }, [formik, initialFormValues])

  const handleApply = useCallback(() => {
    formik.handleSubmit()
  }, [formik])

  const handleAddClick = useCallback(() => {
    setIsEdit(false)
    setSelectedRow(null)
    formik.resetForm({ values: initialFormValues })
    setShowAddModal(true)
  }, [formik, initialFormValues])

  const handleEditClick = useCallback(
    (rowData: AcrMappingTableRow) => {
      if (!rowData) {
        return
      }
      setIsEdit(true)
      setSelectedRow(rowData)
      formik.setValues({
        source: rowData.source,
        mapping: rowData.mapping,
      })
      setShowAddModal(true)
    },
    [formik],
  )

  const handleEditAction = useCallback(
    (_event: unknown, rowData: AcrMappingTableRow | AcrMappingTableRow[]) => {
      if (!Array.isArray(rowData)) {
        handleEditClick(rowData)
      }
    },
    [handleEditClick],
  )

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      formik.handleSubmit(event)
    },
    [formik],
  )

  const handleDeleteAction = useCallback(
    (_event: unknown, rowData: AcrMappingTableRow | AcrMappingTableRow[]) => {
      if (!Array.isArray(rowData)) {
        setItemToDelete(rowData)
        setDeleteModal(true)
      }
    },
    [],
  )

  const handleDeleteConfirm = useCallback(
    async (message: string): Promise<void> => {
      if (!itemToDelete?.mapping) {
        return
      }
      try {
        const userAction: UserAction = {} as UserAction
        const currentMappings = { ...(configuration?.acrMappings ?? {}) }
        const updatedMappings = prepareMappingsForDelete(currentMappings, itemToDelete.mapping)
        const postBody = buildAcrMappingDeletePayload(updatedMappings, configuration?.acrMappings)

        // Add deleted mapping info for audit tracking
        const basePayload = toActionData(postBody) as Record<string, unknown>
        const payloadWithDeleteInfo = {
          ...basePayload,
          deletedMapping: {
            mapping: itemToDelete.mapping,
            source: itemToDelete.source,
          },
        }

        buildPayload(
          userAction,
          message,
          payloadWithDeleteInfo as unknown as ReturnType<typeof toActionData>,
        )
        dispatch(patchJsonConfig({ action: userAction }))
        setDeleteModal(false)
        setItemToDelete(null)
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error !== null && 'message' in error
              ? String((error as { message: unknown }).message)
              : t('messages.error_processiong_request')
        dispatch(updateToast(true, 'error', `${t('messages.error_in_saving')} ${errorMessage}`))
      }
    },
    [itemToDelete, configuration, dispatch, t],
  )

  const shouldDisableApply = useMemo(() => {
    return !formik.isValid || !formik.dirty || loading
  }, [formik.isValid, formik.dirty, loading])

  const tableColumns: Column<AcrMappingTableRow>[] = useMemo(
    () => [
      {
        title: `${t('fields.mapping')}`,
        field: 'mapping',
      },
      {
        title: `${t('fields.source')}`,
        field: 'source',
      },
    ],
    [t],
  )

  const modalTitle = useMemo(
    () => (isEdit ? t('titles.edit_alias') : t('titles.add_alias')),
    [isEdit, t],
  )

  const applyButtonLabel = useMemo(
    () => (isEdit ? t('actions.edit') : t('actions.add')),
    [isEdit, t],
  )

  const tableComponents = useMemo(
    () => ({
      Container: (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    }),
    [],
  )

  const tableActions = useMemo(() => {
    const actions = []

    if (canWriteAuth) {
      actions.push({
        icon: () => <AddIcon />,
        tooltip: t('actions.add_mapping'),
        iconProps: { color: 'primary' as const, style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: handleAddClick,
      })
      actions.push({
        icon: () => <EditIcon />,
        tooltip: t('messages.edit_acr'),
        iconProps: { color: 'primary' as const, style: { color: customColors.darkGray } },
        isFreeAction: false,
        onClick: handleEditAction,
      })
      actions.push({
        icon: () => <DeleteIcon />,
        tooltip: t('actions.delete'),
        iconProps: { color: 'secondary' as const, style: { color: customColors.accentRed } },
        isFreeAction: false,
        onClick: handleDeleteAction,
      })
    }

    return actions
  }, [canWriteAuth, t, handleAddClick, handleEditAction, handleDeleteAction])

  return (
    <>
      <GluuViewWrapper canShow={canReadAuth}>
        <MaterialTable
          components={tableComponents}
          columns={tableColumns}
          data={listData}
          isLoading={loading}
          title=""
          actions={tableActions}
          options={{
            search: false,
            paging: false,
            idSynonym: 'mapping',
            selection: false,
            rowStyle: () => ({
              backgroundColor: customColors.white,
            }),
            headerStyle: {
              ...(applicationStyle.tableHeaderStyle as React.CSSProperties),
              ...bgThemeColor,
            } as React.CSSProperties,
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>

      <Modal isOpen={showAddModal} toggle={handleCancel}>
        <Form onSubmit={handleFormSubmit}>
          <ModalHeader style={{ padding: '1rem' }}>{modalTitle}</ModalHeader>

          <ModalBody style={{ paddingTop: '1rem' }}>
            <GluuInputRow
              label="fields.mapping"
              name="mapping"
              value={formik.values.mapping}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.mapping && formik.touched.mapping}
              errorMessage={formik.errors.mapping}
              required={true}
            />
            <GluuInputRow
              label="fields.source"
              name="source"
              value={formik.values.source}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.source && formik.touched.source}
              errorMessage={formik.errors.source}
              required={true}
            />
          </ModalBody>

          <ModalBody style={{ padding: '0 1rem' }}>
            <FormGroup row>
              <Col sm={3}></Col>
              <Col sm={9}>
                <Box
                  sx={{
                    'display': 'flex',
                    'justifyContent': 'flex-end',
                    'gap': '4px',
                    '& > div': {
                      margin: 0,
                    },
                  }}
                >
                  <GluuFormFooter
                    showCancel={true}
                    onCancel={handleCancel}
                    disableCancel={loading}
                    showApply={true}
                    onApply={handleApply}
                    disableApply={shouldDisableApply}
                    applyButtonType="button"
                    applyButtonLabel={applyButtonLabel}
                    isLoading={loading}
                  />
                </Box>
              </Col>
            </FormGroup>
          </ModalBody>
        </Form>
      </Modal>

      {itemToDelete && (
        <GluuDialog
          row={itemToDelete}
          name={itemToDelete.mapping}
          handler={() => {
            setDeleteModal(false)
            setItemToDelete(null)
          }}
          modal={deleteModal}
          subject="ACR mapping"
          onAccept={handleDeleteConfirm}
        />
      )}
    </>
  )
}

export default AliasesListPage
