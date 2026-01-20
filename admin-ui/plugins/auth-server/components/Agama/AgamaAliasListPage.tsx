import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Form, FormGroup, Col } from 'Components'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import MaterialTable from '@material-table/core'
import type { Column, Action } from '@material-table/core'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
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
import type {
  AcrMapping,
  AcrMappingFormValues,
  AcrMappingTableRow,
  JsonConfigRootState,
} from './types'
import { useAgamaActions } from './hooks'
import { DEFAULT_PAGE_SIZE } from './constants'
import {
  getAcrMappingValidationSchema,
  transformAcrMappingsToTableData,
  buildAcrMappingPayload,
  buildAcrMappingDeletePayload,
  prepareMappingsForUpdate,
  prepareMappingsForDelete,
  toActionData,
} from './helper'

function AliasesListPage(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'dark'
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { logAcrMappingUpdate } = useAgamaActions()

  const { loading } = useSelector((state: JsonConfigRootState) => state.jsonConfigReducer)
  const configuration = useSelector(
    (state: JsonConfigRootState) => state.jsonConfigReducer.configuration,
  )

  const [listData, setListData] = useState<AcrMapping[]>([])
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<AcrMapping | null>(null)

  SetTitle(t('titles.authentication'))

  const authResourceId = useMemo(() => ADMIN_UI_RESOURCES.Authentication, [])
  const authScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[authResourceId], [authResourceId])
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

        const modifiedFields: Record<string, string> = {
          mapping: values.mapping,
          source: values.source,
        }

        buildPayload(userAction, 'changes', toActionData(postBody))
        dispatch(patchJsonConfig({ action: userAction }))

        const auditMessage = isEdit
          ? `Updated ACR mapping: ${values.mapping}`
          : `Created ACR mapping: ${values.mapping}`
        await logAcrMappingUpdate(auditMessage, modifiedFields)

        setIsEdit(false)
        setSelectedRow(null)
        setShowAddModal(false)
      } catch (error) {
        console.error('Error submitting ACR mapping:', error)
      }
    },
    [configuration, isEdit, selectedRow, dispatch, logAcrMappingUpdate],
  )

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

  useEffect(() => {
    if (!showAddModal) {
      formik.resetForm({ values: initialFormValues })
      setIsEdit(false)
      setSelectedRow(null)
    } else if (showAddModal && isEdit && selectedRow) {
      formik.setValues({
        source: selectedRow.source,
        mapping: selectedRow.mapping,
      })
    }
  }, [showAddModal, isEdit, selectedRow, initialFormValues, formik])

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialFormValues })
    setIsEdit(false)
    setSelectedRow(null)
    setTimeout(() => {
      setShowAddModal(false)
    }, 0)
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

  const myActions = useMemo(() => {
    const actions: Action<AcrMappingTableRow>[] = []

    if (canWriteAuth) {
      actions.push({
        icon: 'add',
        tooltip: `${t('actions.add_mapping')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: handleAddClick,
      })

      actions.push({
        icon: 'edit',
        iconProps: {
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.edit_acr')}`,
        onClick: (_event: unknown, rowData: AcrMappingTableRow | AcrMappingTableRow[]) => {
          if (!Array.isArray(rowData) && rowData) {
            handleEditClick(rowData)
          }
        },
      } as Action<AcrMappingTableRow>)
    }

    return actions
  }, [canWriteAuth, t, handleAddClick, handleEditClick])

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      formik.handleSubmit(event)
    },
    [formik],
  )

  const handleRowDelete = useCallback(
    async (oldData: AcrMappingTableRow): Promise<void> => {
      if (!oldData?.mapping) {
        return
      }
      const userAction: UserAction = {} as UserAction
      const currentMappings = { ...(configuration?.acrMappings ?? {}) }
      const updatedMappings = prepareMappingsForDelete(currentMappings, oldData.mapping)
      const postBody = buildAcrMappingDeletePayload(updatedMappings, configuration?.acrMappings)

      buildPayload(userAction, 'changes', toActionData(postBody))
      dispatch(patchJsonConfig({ action: userAction }))

      await logAcrMappingUpdate(`Deleted ACR mapping: ${oldData.mapping}`, {
        mapping: oldData.mapping,
        source: oldData.source,
      })
    },
    [configuration, dispatch, logAcrMappingUpdate],
  )

  const shouldDisableApply = useMemo(() => {
    return !formik.isValid || !formik.dirty || loading
  }, [formik.isValid, formik.dirty, loading])

  const isDeleteHidden = useCallback(() => !canWriteAuth, [canWriteAuth])

  const onRowDelete = useCallback(
    (oldData: AcrMappingTableRow) => handleRowDelete(oldData),
    [handleRowDelete],
  )

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
      Pagination: () => (
        <TablePagination
          count={listData?.length || 0}
          page={0}
          onPageChange={() => {}}
          rowsPerPage={DEFAULT_PAGE_SIZE}
          onRowsPerPageChange={() => {}}
        />
      ),
    }),
    [listData?.length],
  )

  return (
    <>
      <GluuViewWrapper canShow={canReadAuth}>
        <MaterialTable
          components={tableComponents}
          columns={tableColumns}
          data={listData}
          isLoading={loading}
          title=""
          actions={myActions}
          options={{
            search: false,
            paging: false,
            rowStyle: () => ({
              backgroundColor: customColors.white,
            }),
            headerStyle: {
              ...(applicationStyle.tableHeaderStyle as React.CSSProperties),
              ...bgThemeColor,
            } as React.CSSProperties,
            actionsColumnIndex: -1,
          }}
          editable={{
            isDeleteHidden,
            onRowDelete,
          }}
        />
      </GluuViewWrapper>

      <Modal isOpen={showAddModal}>
        <Form onSubmit={handleFormSubmit} className="mt-4">
          <ModalHeader>{modalTitle}</ModalHeader>

          <ModalBody>
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

          <ModalBody>
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
    </>
  )
}

export default AliasesListPage
