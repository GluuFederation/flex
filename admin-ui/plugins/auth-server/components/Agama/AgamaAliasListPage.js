import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, FormGroup, Col } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { hasPermission, SCOPE_READ } from 'Utils/PermChecker'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { SCOPE_WRITE, buildPayload } from 'Utils/PermChecker'
import CircularProgress from '@mui/material/CircularProgress'
import { ThemeContext } from 'Context/theme/themeContext'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import getThemeColor from 'Context/theme/config'
import * as Yup from 'yup'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import { getJsonConfig, patchJsonConfig } from 'Plugins/auth-server/redux/features/jsonConfigSlice'

function AliasesListPage() {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  const bgThemeColor = { background: themeColors.background }
  const { loading } = useSelector((state) => state.jsonConfigReducer)
  const configuration = useSelector((state) => state.jsonConfigReducer.configuration)

  const [initalFormValues, setInitialFormValues] = useState({
    source: '',
    mapping: '',
  })

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [listData, setListData] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const permissions = useSelector((state) => state.authReducer.permissions)
  const myActions = []
  if (hasPermission(permissions, SCOPE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('actions.add_mapping')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        formik.resetForm()
        setIsEdit(false)
        setShowAddModal(true)
      },
    })

    myActions.push((rowData) => {
      return {
        icon: 'edit',
        tooltip: `${t('messages.edit_acr')}`,
        onClick: (event, rowData) => handleEdit(rowData),
      }
    })
  }

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

  const handleSubmit = (values) => {
    const userAction = {}
    const postBody = {}
    let value = configuration.acrMappings

    if (isEdit) {
      delete value[selectedRow.mapping]
    }
    value = { ...value, [values.mapping]: values.source }
    postBody['requestBody'] = [
      {
        path: '/acrMappings',
        value: value,
        op: configuration?.acrMappings ? 'replace' : 'add',
      },
    ]

    buildPayload(userAction, 'changes', postBody)
    dispatch(patchJsonConfig({ action: userAction }))
    setShowAddModal(false)
  }

  const handleEdit = (rowData) => {
    setIsEdit(true)
    formik.setFieldValue('source', rowData.source)
    formik.setFieldValue('mapping', rowData.mapping)
    setSelectedRow(rowData)
    setShowAddModal(true)
  }

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
      <>
        <GluuViewWrapper canShow={hasPermission(permissions, SCOPE_READ)}>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Pagination: (props) => (
                <TablePagination
                  count={listData?.length}
                  page={pageNumber}
                  onPageChange={(prop, page) => {}}
                  rowsPerPage={10}
                  onRowsPerPageChange={(prop, count) => {}}
                />
              ),
            }}
            columns={[
              {
                title: `${t('fields.mapping')}`,
                field: 'mapping',
              },
              {
                title: `${t('fields.source')}`,
                field: 'source',
              },
            ]}
            data={listData}
            isLoading={loading}
            title=""
            actions={myActions}
            paging={false}
            options={{
              search: false,
              pagination: false,

              rowStyle: (rowData) => ({
                backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
              }),
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            editable={{
              isDeleteHidden: () => false,
              onRowDelete: (oldData) => {
                try {
                  return new Promise((resolve, reject) => {
                    const userAction = {}
                    const postBody = {}

                    let value = configuration?.acrMappings
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
                    resolve(true)
                  })
                } catch (error) {}
              },
            }}
          />
        </GluuViewWrapper>
        <Modal isOpen={showAddModal}>
          <Form
            onSubmit={(event) => {
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
                onClick={() => setShowAddModal(false)}
              >
                {t('actions.cancel')}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </>
    </>
  )
}

export default AliasesListPage
