import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, FormGroup, Col } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { buildPayload, SCOPE_READ, SCOPE_WRITE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
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
import { AGAMA_ALIAS_STRINGS } from './helper/constants'
import { AgamaAliasDetailRow } from './helper/util'
import GluuCommitDialog from '@/routes/Apps/Gluu/GluuCommitDialog'
import SetTitle from '@/utils/SetTitle'

function AliasesListPage() {
  const { hasCedarPermission, authorize } = useCedarling()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  const bgThemeColor = { background: themeColors.background }
  const { loading } = useSelector((state) => state.jsonConfigReducer)
  const configuration = useSelector((state) => state.jsonConfigReducer.configuration)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const [initalFormValues] = useState({
    source: '',
    mapping: '',
  })

  SetTitle('Aliases')

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [limit] = useState(10)
  const [listData, setListData] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCommitDialog, setShowCommitDialog] = useState(false)
  const [pageNumber] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [myActions, setMyActions] = useState([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [rowToDelete, setRowToDelete] = useState(null)

  useEffect(() => {
    const authorizePermissions = async () => {
      const permissions = [SCOPE_READ, SCOPE_WRITE]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing scope permissions:', error)
      }
    }

    authorizePermissions()
    dispatch(getJsonConfig({ action: {} }))
  }, [dispatch])

  useEffect(() => {
    const t = (s) => s
    const actions = []

    if (hasCedarPermission(SCOPE_WRITE)) {
      actions.push({
        icon: 'add',
        tooltip: t(AGAMA_ALIAS_STRINGS.actions.add_mapping),
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          formik.resetForm()
          setIsEdit(false)
          setShowAddModal(true)
        },
      })

      actions.push((_rowData) => ({
        icon: 'edit',
        iconProps: { style: { color: customColors.darkGray } },
        tooltip: t(AGAMA_ALIAS_STRINGS.actions.edit),
        onClick: (event, rowData) => handleEdit(rowData),
      }))

      actions.push((_rowData) => ({
        icon: 'delete_outline',
        iconProps: { style: { color: customColors.red } },
        tooltip: t(AGAMA_ALIAS_STRINGS.actions.delete),
        onClick: (event, rowData) => {
          if (!hasCedarPermission(SCOPE_WRITE)) return
          setRowToDelete({ ...rowData, resolve: () => {}, reject: () => {} })
          setShowDeleteDialog(true)
        },
      }))
    }

    setMyActions(actions)
  }, [
    cedarPermissions,
    hasCedarPermission,
    formik,
    setIsEdit,
    setShowAddModal,
    handleEdit,
    setRowToDelete,
    setShowDeleteDialog,
  ])

  const validationSchema = Yup.object().shape({
    source: Yup.string().required(`${t('fields.source')} is Required!`),
    mapping: Yup.string().required(`${t('fields.mapping')} is Required!`),
  })

  const formik = useFormik({
    initialValues: {
      source: initalFormValues.source,
      mapping: initalFormValues.mapping,
    },
    validationSchema,
    onSubmit: () => {
      handleSubmit(formik.values)
    },
  })

  const handleSubmit = useCallback(() => {
    setShowCommitDialog(true)
  }, [])

  const handleDeleteAccept = (userMessage) => {
    if (!rowToDelete) return
    const userAction = {}
    const postBody = {}
    const value = { ...configuration?.acrMappings }
    delete value[rowToDelete.mapping]
    postBody['requestBody'] = [
      {
        path: '/acrMappings',
        value: value,
        op: configuration?.acrMappings ? 'replace' : 'add',
      },
    ]
    buildPayload(userAction, userMessage, postBody)
    dispatch(patchJsonConfig({ action: userAction }))
    if (rowToDelete.resolve) rowToDelete.resolve(true)
    setShowDeleteDialog(false)
    setRowToDelete(null)
  }

  const handleCommitAccept = useCallback(
    (userMessage) => {
      const userAction = {}
      const postBody = {}
      let value = configuration.acrMappings

      if (isEdit) {
        delete value[selectedRow.mapping]
      }
      value = { ...value, [formik.values.mapping]: formik.values.source }
      postBody['requestBody'] = [
        {
          path: '/acrMappings',
          value: value,
          op: configuration?.acrMappings ? 'replace' : 'add',
        },
      ]

      buildPayload(userAction, userMessage, postBody)
      dispatch(patchJsonConfig({ action: userAction }))
      setShowAddModal(false)
      setShowCommitDialog(false)
    },
    [configuration, isEdit, selectedRow, dispatch, formik.values],
  )

  const handleEdit = useCallback(
    (rowData) => {
      setIsEdit(true)
      formik.setFieldValue('source', rowData.source)
      formik.setFieldValue('mapping', rowData.mapping)
      setSelectedRow(rowData)
      setShowAddModal(true)
    },
    [formik],
  )

  useEffect(() => {
    dispatch(getJsonConfig({ action: {} }))
  }, [])

  useEffect(() => {
    const data = Object.entries(configuration?.acrMappings || {}).map(([key, value]) => {
      return {
        mapping: key,
        source: value,
      }
    })
    setListData(data)
  }, [configuration])

  return (
    <>
      <GluuViewWrapper canShow={hasCedarPermission(SCOPE_READ)}>
        <MaterialTable
          key={limit ? limit : 0}
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
            Pagination: () => (
              <TablePagination
                count={listData?.length}
                page={pageNumber}
                onPageChange={() => {}}
                rowsPerPage={10}
                onRowsPerPageChange={() => {}}
              />
            ),
            DetailPanel: (rowData) => (
              <AgamaAliasDetailRow
                label={[AGAMA_ALIAS_STRINGS.fields.mapping, AGAMA_ALIAS_STRINGS.fields.source]}
                value={[rowData.mapping, rowData.source]}
              />
            ),
          }}
          columns={AGAMA_ALIAS_STRINGS.fields.columns}
          data={listData}
          isLoading={loading}
          title=""
          actions={myActions}
          options={{
            columnsButton: false,
            search: false,
            pageSize: limit,
            rowStyle: (rowData) => ({
              backgroundColor: rowData.enabled ? customColors.lightGreen : customColors.white,
            }),
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              ...bgThemeColor,
            },
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>
      <Modal isOpen={showAddModal}>
        <GluuCommitDialog
          handler={() => setShowCommitDialog(false)}
          modal={showCommitDialog}
          onAccept={handleCommitAccept}
        />
        <Form
          onSubmit={(event) => {
            event.preventDefault()
            formik.handleSubmit(event)
          }}
          className="mt-4"
        >
          <ModalHeader>
            {isEdit
              ? t(AGAMA_ALIAS_STRINGS.titles.edit_alias)
              : t(AGAMA_ALIAS_STRINGS.titles.add_alias)}
          </ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col sm={10}>
                <GluuInputRow
                  label={AGAMA_ALIAS_STRINGS.fields.mapping}
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
                  label={AGAMA_ALIAS_STRINGS.fields.source}
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
              {isEdit ? t(AGAMA_ALIAS_STRINGS.actions.edit) : t(AGAMA_ALIAS_STRINGS.actions.add)}
            </Button>
            &nbsp;
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              onClick={() => setShowAddModal(false)}
            >
              {t(AGAMA_ALIAS_STRINGS.actions.cancel)}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      <GluuDialog
        row={rowToDelete}
        name={rowToDelete?.mapping}
        handler={() => setShowDeleteDialog(false)}
        modal={showDeleteDialog}
        subject="agama-alias"
        onAccept={(userMessage) => {
          handleDeleteAccept(userMessage)
        }}
        feature={'agama_alias_delete'}
      />
    </>
  )
}

export default AliasesListPage
