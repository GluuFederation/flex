import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, FormGroup, Col } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import type { Column, Action } from '@material-table/core'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CircularProgress from '@mui/material/CircularProgress'
import { ThemeContext } from 'Context/theme/themeContext'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import getThemeColor from 'Context/theme/config'
import * as Yup from 'yup'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import { getJsonConfig, patchJsonConfig } from 'Plugins/auth-server/redux/features/jsonConfigSlice'
import customColors from '@/customColors'
import SetTitle from 'Utils/SetTitle'
import type { AcrMapping, AcrMappingFormValues } from './types'
import { useAgamaActions } from './hooks'
import { DEFAULT_PAGE_SIZE } from './constants'

interface RootState {
  jsonConfigReducer: {
    configuration: {
      acrMappings?: Record<string, string>
    }
    loading: boolean
  }
}

interface AcrMappingTableRow extends AcrMapping {
  tableData?: {
    id: number
  }
}

function AliasesListPage(): React.ReactElement {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'dark'
  const themeColors = getThemeColor(selectedTheme)

  const bgThemeColor = { background: themeColors.background }
  const { loading } = useSelector((state: RootState) => state.jsonConfigReducer)
  const configuration = useSelector((state: RootState) => state.jsonConfigReducer.configuration)

  const initialFormValues: AcrMappingFormValues = {
    source: '',
    mapping: '',
  }

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [listData, setListData] = useState<AcrMapping[]>([])
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [pageNumber] = useState<number>(0)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<AcrMapping | null>(null)
  const [myActions, setMyActions] = useState<Action<AcrMappingTableRow>[]>([])

  const { logAcrMappingUpdate } = useAgamaActions()

  SetTitle(t('titles.authentication'))

  const authResourceId = useMemo(() => ADMIN_UI_RESOURCES.Authentication, [])
  const authScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[authResourceId], [authResourceId])
  const canReadAuth = useMemo(
    () => hasCedarReadPermission(authResourceId),
    [hasCedarReadPermission, authResourceId],
  )
  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(authResourceId),
    [hasCedarWritePermission, authResourceId],
  )

  // Permission initialization and data fetching
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

  const validationSchema = Yup.object().shape({
    source: Yup.string().required(`${t('fields.source')} is Required!`),
    mapping: Yup.string().required(`${t('fields.mapping')} is Required!`),
  })

  const formik = useFormik<AcrMappingFormValues>({
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: () => {
      handleSubmit(formik.values)
    },
  })

  // Build actions based on permissions
  useEffect(() => {
    const actions: Action<AcrMappingTableRow>[] = []

    if (canWriteAuth) {
      actions.push({
        icon: 'add',
        tooltip: `${t('actions.add_mapping')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          formik.resetForm()
          setIsEdit(false)
          setShowAddModal(true)
        },
      })

      actions.push({
        icon: 'edit',
        iconProps: {
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.edit_acr')}`,
        onClick: (_event: unknown, rowData: AcrMappingTableRow | AcrMappingTableRow[]) => {
          if (!Array.isArray(rowData)) {
            handleEdit(rowData)
          }
        },
      } as Action<AcrMappingTableRow>)
    }

    setMyActions(actions)
  }, [canWriteAuth, t, formik])

  const handleSubmit = useCallback(
    async (values: AcrMappingFormValues): Promise<void> => {
      try {
        const userAction: Record<string, unknown> = {}
        const postBody: Record<string, unknown> = {}
        const currentMappings = { ...(configuration.acrMappings ?? {}) }

        const modifiedFields: Record<string, string> = {
          mapping: values.mapping,
          source: values.source,
        }

        if (isEdit && selectedRow) {
          delete currentMappings[selectedRow.mapping]
        }
        const nextMappings = { ...currentMappings, [values.mapping]: values.source }
        postBody['requestBody'] = [
          {
            path: '/acrMappings',
            value: nextMappings,
            op: configuration?.acrMappings ? 'replace' : 'add',
          },
        ]

        buildPayload(userAction, 'changes', postBody)
        dispatch(patchJsonConfig({ action: userAction }))

        // Log audit action
        const auditMessage = isEdit
          ? `Updated ACR mapping: ${values.mapping}`
          : `Created ACR mapping: ${values.mapping}`
        await logAcrMappingUpdate(auditMessage, modifiedFields)

        formik.resetForm()
        setShowAddModal(false)
      } catch (error) {
        console.error('Error submitting ACR mapping:', error)
      }
    },
    [configuration, isEdit, selectedRow, dispatch, logAcrMappingUpdate, formik],
  )

  const handleEdit = useCallback(
    (rowData: AcrMapping): void => {
      setIsEdit(true)
      formik.setFieldValue('source', rowData.source)
      formik.setFieldValue('mapping', rowData.mapping)
      setSelectedRow(rowData)
      setShowAddModal(true)
    },
    [formik],
  )

  useEffect(() => {
    const data = Object.entries(configuration?.acrMappings || {}).map(([key, value]) => {
      return {
        mapping: key,
        source: value as string,
      }
    })
    setListData(data)
  }, [configuration])

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

  return (
    <>
      <GluuViewWrapper canShow={canReadAuth}>
        <MaterialTable
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
            Pagination: () => (
              <TablePagination
                count={listData?.length || 0}
                page={pageNumber}
                onPageChange={() => {}}
                rowsPerPage={DEFAULT_PAGE_SIZE}
                onRowsPerPageChange={() => {}}
              />
            ),
          }}
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
            isDeleteHidden: () => !canWriteAuth,
            onRowDelete: async (oldData: AcrMappingTableRow): Promise<void> => {
              try {
                const userAction: Record<string, unknown> = {}
                const postBody: Record<string, unknown> = {}

                const value = { ...configuration?.acrMappings }
                delete value[oldData.mapping]

                postBody['requestBody'] = [
                  {
                    path: '/acrMappings',
                    value: value,
                    op: configuration?.acrMappings ? 'replace' : 'add',
                  },
                ]

                buildPayload(userAction, 'changes', postBody)
                dispatch(patchJsonConfig({ action: userAction }))

                // Log audit action for deletion
                await logAcrMappingUpdate(`Deleted ACR mapping: ${oldData.mapping}`, {
                  mapping: oldData.mapping,
                  source: oldData.source,
                })
              } catch (error) {
                console.error('Error deleting row:', error)
                throw error
              }
            },
          }}
        />
      </GluuViewWrapper>
      <Modal isOpen={showAddModal}>
        <Form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            formik.handleSubmit(event)
          }}
          className="mt-4"
        >
          <ModalHeader>{isEdit ? t('titles.edit_alias') : t('titles.add_alias')}</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.mapping"
                  name="mapping"
                  value={formik.values.mapping}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={formik.errors.mapping && formik.touched.mapping}
                  errorMessage={formik.errors.mapping}
                  required={true}
                />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.source"
                  name="source"
                  value={formik.values.source}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={formik.errors.source && formik.touched.source}
                  errorMessage={formik.errors.source}
                  required={true}
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              type="submit"
            >
              {loading ? (
                <>
                  <CircularProgress size={12} /> &nbsp;
                </>
              ) : null}
              {isEdit ? t('actions.edit') : t('actions.add')}
            </Button>
            &nbsp;
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              onClick={() => {
                formik.resetForm()
                setShowAddModal(false)
              }}
            >
              {t('actions.cancel')}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}

export default AliasesListPage
