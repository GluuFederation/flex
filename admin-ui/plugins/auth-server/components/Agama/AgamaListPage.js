import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, Input } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { getAgama, deleteAgama, addAgama } from '../../redux/actions/AgamaActions'
import { hasPermission, AGAMA_READ, AGAMA_WRITE } from 'Utils/PermChecker'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import { AGAMA_DELETE } from '../../../../app/utils/PermChecker'
import CircularProgress from '@mui/material/CircularProgress';
import InfoIcon from '@mui/icons-material/Info';
import AgamaProjectConfigModal from './AgamaProjectConfigModal'
import EditIcon from '@mui/icons-material/Edit';

const dateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
};

function AgamaListPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const options = {}
  const myActions = []
  const [limit, setLimit] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [manageConfig, setManageConfig] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [getProjectName, setGetProjectName] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [shaFile, setSHAfile] = useState(null)
  const [shaStatus, setShaStatus] = useState(false)
  const [shaFileName, setShaFileName] = useState('')
  const [listData, setListData] = useState([])
  const [selectedRow, setSelectedRow] = useState({})

  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  function convertFileToByteArray(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        const byteArray = new Uint8Array(reader.result)
        resolve(byteArray)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const submitData = async () => {
    let file = await convertFileToByteArray(selectedFile)
    let object = {
      name: projectName,
      file: file
    }

    dispatch(addAgama(object))

    setProjectName('')
    setShowAddModal(false)
  }
  const onDrop = useCallback((acceptedFiles) => {
    setProjectName('')
    // Do something with the files
    const file = acceptedFiles[0]
    setSelectedFileName(file.name)
    setSelectedFile(file)
    JSZip.loadAsync(file) // 1) read the Blob
      .then(function (zip) {
        let foundProjectName = false
        let foundJson = false
        zip.forEach(function (relativePath, zipEntry) {
          if (zipEntry.name.endsWith('.json')) {
            foundJson = true
            if (!foundProjectName) {
              zipEntry.async('string').then(function (jsonStr) {
                const jsonData = JSON.parse(jsonStr) // Parse the JSON data
                if (jsonData?.projectName) {
                  setProjectName(jsonData?.projectName)
                  foundProjectName = true
                }
              })
            }
          }
        })
        setGetProjectName(true)
      })
  }, [])
  const onDrop2 = useCallback((acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0]
    setShaFileName(file.name)
    setSHAfile(file)
  }, [])
  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({
    onDrop: onDrop,
    accept: {
      'application/octet-stream': ['.gama'],
      'application/x-zip-compressed': ['.zip'],
    },
  })
  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
  } = useDropzone({
    onDrop: onDrop2,

    accept: {
      'text/plain': ['.sha256sum'],
    },
  })

  const { totalItems, entriesCount, loading } = useSelector(
    (state) => state.agamaReducer,
  )
  const agamaList = useSelector((state) => state.agamaReducer.agamaList)
  const permissions = useSelector((state) => state.authReducer.permissions)
  SetTitle(t('titles.agama'))

  let memoLimit = limit
  useEffect(() => {
    dispatch(getAgama())
  }, [])

  useEffect(() => {
    formDeploymentDetailsData()
  }, [agamaList])

  const formDeploymentDetailsData = () => {
    let data = []
    if (agamaList.length) {
      for (const project of agamaList) {
        const error = project?.finishedAt && project?.details?.error ? 'Yes' : project?.finishedAt ? 'No' : ''
        const status = project?.finishedAt ? 'Processed' : 'Pending'
        const deployed_on = project?.finishedAt ? new Intl.DateTimeFormat('en-US', dateTimeFormatOptions).format(new Date(project.createdAt)) : '-'
        data.push({ ...project, deployed_on, type: project?.details?.projectMetadata?.type ?? '-', status, error })
      }
    }

    setListData(data)
  }

  const onPageChangeClick = (page) => {
    let startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limit
    options['pattern'] = pattern
    setPageNumber(page)
    dispatch(getAgama(options))
  }

  const onRowCountChangeClick = (count) => {
    options['limit'] = count
    options['pattern'] = pattern
    setPageNumber(0)
    setLimit(count)
    dispatch(getAgama(options))
  }

  if (hasPermission(permissions, AGAMA_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_role')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        setSelectedFile(null)
        setSelectedFileName(null)
        setGetProjectName(false)
        setSHAfile(null)
        setShowAddModal(true)
      },
    })
    myActions.push({
      icon: () => <InfoIcon />,
      tooltip: `${t('messages.see_configurations')}`,
      iconProps: { color: 'primary' },
      isFreeAction: false,
      onClick: (event, rowData) => {
        setSelectedRow(rowData)
        setShowConfigModal(true)
      },
    })
    myActions.push({
      icon: () => <EditIcon />,
      tooltip: `${t('messages.manage_configurations')}`,
      iconProps: { color: 'primary' },
      isFreeAction: false,
      onClick: (event, rowData) => {
        setSelectedRow(rowData)
        setShowConfigModal(true)
        setManageConfig(true)
      },
    })
  }

  const getSHA256 = async (sha256sum) => {
    const uint8Array = new Uint8Array(
      await new Blob([selectedFile]).arrayBuffer(),
    )
    const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    setShaStatus(hashHex === sha256sum)
  }

  const checkSHA1 = () => {
    const reader = new FileReader()

    reader.onload = () => {
      const sha256sum = reader.result
      // setSha256sum(...sha256sum.split(" ", 1))
      getSHA256(...sha256sum.split(' ', 1))
    }

    const blob = new Blob([shaFile])
    reader.readAsText(blob)
  }

  useEffect(() => {
    if (shaFile && selectedFile) {
      checkSHA1()
    }
  }, [shaFile, selectedFile])

  const handleUpdateRowData = (updatedData) => {
    const foundIndex = listData.findIndex(item => item.dn == updatedData.dn)

    if (foundIndex) {

      const error = updatedData?.finishedAt && updatedData?.details?.error ? 'Yes' : updatedData?.finishedAt ? 'No' : ''
      const status = updatedData?.finishedAt ? 'Processed' : 'Pending'
      const deployed_on = updatedData?.finishedAt ? new Intl.DateTimeFormat('en-US', dateTimeFormatOptions).format(new Date(updatedData.createdAt)) : '-'

      const updatedList = foundIndex >= 0 ? listData.map((project, index) => {
        return index === foundIndex ? { ...project, error: error, status: status, deployed_on: deployed_on, details: { ...project.details, ...updatedData } } : project
      }) : [...listData]
      setListData(updatedList)
    }
  }

  return (
    <>
      {showConfigModal && (
        <AgamaProjectConfigModal
          isOpen={showConfigModal}
          row={selectedRow}
          handleUpdateRowData={handleUpdateRowData}
          manageConfig={manageConfig}
          handler={() => {
            if(manageConfig) {
              setManageConfig(false)
            }
            setShowConfigModal(false)
          }}
        />
      )}
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasPermission(permissions, AGAMA_READ)}>
            <MaterialTable
              key={limit}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
                Pagination: (props) => (
                  <TablePagination
                    component="div"
                    count={totalItems}
                    page={pageNumber}
                    onPageChange={(prop, page) => {
                      onPageChangeClick(page)
                    }}
                    rowsPerPage={limit}
                    onRowsPerPageChange={(prop, count) =>
                      onRowCountChangeClick(count.props.value)
                    }
                  />
                ),
              }}
              columns={[
                {
                  title: `${t('fields.name')}`,
                  field: 'details.projectMetadata.projectName',
                },
                {
                  title: `${t('fields.type')}`,
                  field: 'type',
                },
                {
                  title: `${t('fields.author')}`,
                  field: 'details.projectMetadata.author',
                },
                {
                  title: `${t('fields.status')}`,
                  field: 'status',
                },
                {
                  title: `${t('fields.deployed_on')}`,
                  field: 'deployed_on',
                },
                {
                  title: `${t('fields.error')}`,
                  field: 'error',
                },
              ]}
              data={listData}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                search: true,
                searchFieldAlignment: 'left',
                selection: false,
                pageSize: limit,
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
                isDeleteHidden: () => !hasPermission(permissions, AGAMA_DELETE),
                onRowDelete: (oldData) => {
                  return new Promise((resolve, reject) => {
                    dispatch(deleteAgama({ name: oldData.details.projectMetadata.projectName }))
                    resolve()
                  })
                }
              }}
            />
          </GluuViewWrapper>
          <Modal isOpen={showAddModal}>
            <ModalHeader>Add Agama</ModalHeader>
            <ModalBody>
              <div
                {...getRootProps1()}
                className={isDragActive1 ? 'active' : 'dropzone'}
              >
                <input {...getInputProps1()} />
                {selectedFileName ? (
                  <strong>Selected File : {selectedFileName}</strong>
                ) : (
                  <p>Drag 'n' drop .gama file here, or click to select file</p>
                )}
              </div>
              <div className="mt-2"></div>
              <div
                {...getRootProps2()}
                className={isDragActive2 ? 'active' : 'dropzone'}
              >
                <input {...getInputProps2()} />
                {shaFile ? (
                  <strong>Selected File : {shaFileName}</strong>
                ) : (
                  <p>
                    Drag 'n' drop .sha256sum file here, or click to select file
                  </p>
                )}
              </div>
              <div className="mt-2"></div>
              <div className="text-danger">
                {shaFile &&
                  selectedFileName &&
                  !shaStatus &&
                  'SHA256 not verified'}
              </div>
              <div className="text-success">
                {shaFile && selectedFileName && shaStatus && 'SHA256 verified'}
              </div>
              {getProjectName && (
                <Input
                  type="text"
                  placeholder="Project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                onClick={() => submitData()}
                disabled={(shaFile && selectedFileName && shaStatus && projectName != '') ? loading ? true : false : true}
              >

                {loading ? <>
                  <CircularProgress size={12} /> &nbsp;
                </> : null}
                {t('actions.add')}
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
          </Modal>
        </CardBody>
      </Card>
    </>
  )
}

export default AgamaListPage
