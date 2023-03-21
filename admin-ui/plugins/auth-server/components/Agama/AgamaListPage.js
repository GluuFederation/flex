import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, Badge, Input } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { Paper, TablePagination } from '@material-ui/core'
import { getAgama , postAgama} from '../../redux/actions/AgamaActions'
import {
  hasPermission,
  AGAMA_READ,
  AGAMA_WRITE
} from 'Utils/PermChecker'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'

function AgamaListPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userAction = {}
  const options = {}
  const clientOptions = {}
  const myActions = []
  const [limit, setLimit] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [getProjectName, setGetProjectName] = useState(false)

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
    let file = await convertFileToByteArray(selectedFile);
    let obj = {file, name:projectName}
    dispatch(postAgama(obj))
  }
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0]
    setSelectedFile(file)
    JSZip.loadAsync(file) // 1) read the Blob
      .then(function (zip) {
        let foundProjectName = false
        let foundJson = false
        zip.forEach(function (relativePath, zipEntry) {
          if (zipEntry.name.endsWith('.json')) {
            foundJson = true
            console.log(zipEntry.name)
            if (!foundProjectName) {
              zipEntry.async('string').then(function (jsonStr) {
                const jsonData = JSON.parse(jsonStr) // Parse the JSON data
                console.log(jsonData) // Do something with the JSON data
                if (jsonData?.projectName) {
                  foundProjectName = true
                  setGetProjectName(false)
                  setProjectName(jsonData?.projectName)
                  // projectName
                } else {
                  setGetProjectName(true)
                  setProjectName('')
                }
                // handleFileChange(f)
              })
            } else {
              setGetProjectName(false)
            }
          }
        })
        if (!foundJson) {
          setGetProjectName(true)
        }
      })
    // console.log(acceptedFiles[0]);
  }, [])
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/*': ['.zip'],
    },
  })

  const { totalItems, entriesCount, loading } = useSelector(
    (state) => state.agamaReducer,
  )
  const agamaList = useSelector((state) => state.agamaReducer.agamaList)
  const permissions = useSelector((state) => state.authReducer.permissions)
  SetTitle(t('titles.oidc_clients'))

  let memoLimit = limit
  useEffect(() => {
    console.log('GET AGAMA')
    dispatch(getAgama())
  }, [])

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
    onClick: () => setShowAddModal(true),
  })
  }

  return (
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
              }
            ]}
            data={agamaList}
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
          />
        </GluuViewWrapper>
        <Modal isOpen={showAddModal}>
          <ModalHeader>Add Agama</ModalHeader>
          <ModalBody>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop .zip file here, or click to select file</p>
            </div>
            <div className="mt-2"></div>
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
            >
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
  )
}

export default AgamaListPage
