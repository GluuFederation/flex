import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react'
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
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { buildPayload, type UserAction } from 'Utils/PermChecker'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import customColors from '@/customColors'
import {
  useAuthServerJsonPropertiesQuery,
  usePatchAuthServerJsonPropertiesMutation,
} from 'Plugins/auth-server/hooks/useAuthServerJsonProperties'
import type { AcrMappingFormValues, AcrMappingTableRow } from './types'
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
  const theme = useContext(ThemeContext)
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()

  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<AcrMappingTableRow | null>(null)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<AcrMappingTableRow | null>(null)

  SetTitle(t('titles.authentication'))

  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const bgThemeColor = useMemo(
    () => ({ background: getThemeColor(selectedTheme).background }),
    [selectedTheme],
  )

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
  } = useAuthServerJsonPropertiesQuery({
    enabled: canReadAuth,
  })
  const acrConfig = configuration as { acrMappings?: Record<string, string> }
  const patchJsonMutation = usePatchAuthServerJsonPropertiesMutation()
  const loading = configLoading || configFetching || patchJsonMutation.isPending

  const initialFormValues = useMemo<AcrMappingFormValues>(
    () => ({
      source: '',
      mapping: '',
    }),
    [],
  )
  const validationSchema = useMemo(() => getAcrMappingValidationSchema(t), [t])

  const listData = useMemo(
    () => transformAcrMappingsToTableData(acrConfig.acrMappings),
    [acrConfig.acrMappings],
  )

  const handleSubmitCallback = useCallback(
    async (values: AcrMappingFormValues): Promise<void> => {
      try {
        const userAction: UserAction = {} as UserAction
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
        console.error(error)
      }
    },
    [acrConfig.acrMappings, isEdit, selectedRow, patchJsonMutation],
  )

  const formik = useFormik<AcrMappingFormValues>({
    initialValues: initialFormValues,
    validationSchema,
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
  }, [authorizeHelper, authScopes])

  useEffect(() => {
    if (!showAddModal) {
      formikRef.current.resetForm({ values: initialFormValuesRef.current })
      setIsEdit(false)
      setSelectedRow(null)
    }
  }, [showAddModal])

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
        const currentMappings = { ...(acrConfig.acrMappings ?? {}) }
        const updatedMappings = prepareMappingsForDelete(currentMappings, itemToDelete.mapping)
        const postBody = buildAcrMappingDeletePayload(updatedMappings, acrConfig.acrMappings)

        const basePayload = toActionData(postBody) as Record<string, JsonValue>
        const payloadWithDeleteInfo: Record<string, JsonValue> = {
          ...basePayload,
          deletedMapping: {
            mapping: itemToDelete.mapping,
            source: itemToDelete.source,
          },
        }

        buildPayload(userAction, message, payloadWithDeleteInfo)
        await patchJsonMutation.mutateAsync(userAction)
        setDeleteModal(false)
        setItemToDelete(null)
      } catch (error) {
        console.error(error)
      }
    },
    [itemToDelete, acrConfig.acrMappings, patchJsonMutation],
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
              color: getThemeColor(selectedTheme).fontColor,
            } as React.CSSProperties,
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>

      <Modal isOpen={showAddModal} toggle={handleCancel}>
        <Form onSubmit={handleFormSubmit}>
          <style>{`
            .edit-mapping-labels-black label,
            .edit-mapping-labels-black label h5,
            .edit-mapping-labels-black label span,
            .edit-mapping-labels-black h5,
            .edit-mapping-labels-black .MuiSvgIcon-root { color: ${customColors.black} !important; }
          `}</style>
          <ModalHeader style={{ padding: '1rem' }}>{modalTitle}</ModalHeader>

          <ModalBody style={{ paddingTop: '1rem' }} className="edit-mapping-labels-black">
            <GluuInputRow
              label="fields.mapping"
              name="mapping"
              value={formik.values.mapping}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={Boolean(formik.errors.mapping && formik.touched.mapping)}
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
              showError={Boolean(formik.errors.source && formik.touched.source)}
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
          row={{ name: itemToDelete.mapping, id: itemToDelete.source }}
          name={itemToDelete.mapping}
          handler={() => {
            setDeleteModal(false)
            setItemToDelete(null)
          }}
          modal={deleteModal}
          subject="ACR mapping"
          onAccept={handleDeleteConfirm}
          feature=""
        />
      )}
    </>
  )
}

export default AliasesListPage
