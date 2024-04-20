import React, { useContext, useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
import axios from 'Redux/api/axios'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import MaterialTable from '@material-table/core'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import { isEmpty } from 'lodash'
import AceEditor from 'react-ace'

const AgamaProjectConfigModal = ({
  isOpen,
  row,
  handler,
  handleUpdateRowData,
  manageConfig = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.authReducer.token.access_token)
  const theme = useContext(ThemeContext)
  const name = row.details.projectMetadata.projectName
  const selectedTheme = theme.state.theme
  const [configDetails, setConfigDetails] = useState({
    isLoading: false,
    data: {},
  })
  const [projectDetails, setProjectDetails] = useState({
    isLoading: true,
    data: {},
  })

  useEffect(() => {
    getAgamaProjectDetails()
  }, [])

  useEffect(() => {
    if (manageConfig) {
      getConfigDetails()
    }
  }, [manageConfig])

  const [isCopied, setIsCopied] = useState(false)
  const projectConfigs = projectDetails?.data?.details?.projectMetadata?.configs
  const copyToClipboard = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(JSON.stringify(projectConfigs, null, 2))
    setTimeout(() => {
      setIsCopied(false)
    }, 6000)
  }

  function getConfigDetails() {
    setConfigDetails((prevState) => ({ ...prevState, isLoading: true }))

    axios
      .get('/api/v1/agama-deployment/configs/' + name, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        setConfigDetails((prevState) => ({
          ...prevState,
          data: response.data,
        }))
      })
      .finally(() => {
        setConfigDetails((prevState) => ({ ...prevState, isLoading: false }))
      })
  }

  function getAgamaProjectDetails() {
    setProjectDetails((prevState) => ({ ...prevState, isLoading: true }))
    axios
      .get('/api/v1/agama-deployment/' + name, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          let tableOptions = []

          if (response.data.details.flowsError) {
            for (const flow in response.data.details.flowsError) {
              const error = response.data.details.flowsError[flow]
              tableOptions.push({ flow: flow, error })
            }
          }

          setProjectDetails((prevState) => ({
            ...prevState,
            data: {
              ...response?.data,
              statusCode: response.status,
              tableOptions: tableOptions,
            },
          }))

          handleUpdateRowData(response.data)
        }

        if (response.status === 204) {
          setProjectDetails((prevState) => ({
            ...prevState,
            data: {
              statusCode: response.status,
            },
          }))
        }
      })
      .catch((error) => {})
      .finally(() => {
        setProjectDetails((prevState) => ({ ...prevState, isLoading: false }))
      })
  }

  function handleImportConfig() {
    let parsedValue = null
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = function (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = function (event) {
        try {
          parsedValue = JSON.parse(event.target.result)
          setConfigDetails((prevState) => ({ ...prevState, isLoading: true }))
          axios
            .put('/api/v1/agama-deployment/configs/' + name, parsedValue, {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            })
            .then((response) => {
              setConfigDetails((prevState) => ({
                ...prevState,
                data: response.data,
              }))
              dispatch(
                updateToast(
                  true,
                  'success',
                  `Configuration for project ${name} imported successfully.`
                )
              )
            })
            .finally(() => {
              setConfigDetails((prevState) => ({
                ...prevState,
                isLoading: false,
              }))
            })
        } catch (error) {
          dispatch(updateToast(true, 'error', `Invalid JSON file`))
        }
      }
      reader.readAsText(file, 'utf-8')
    }
    input.click()
  }

  function save_data(data) {
    try {
      // Convert data to a Blob object
      const blob = new Blob([data], { type: 'application/json' })

      // Create a download link for the Blob object
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'data.json'

      // Trigger a click event on the download link to download the file
      link.dispatchEvent(new MouseEvent('click'))

      // Clean up the download link and URL object
      URL.revokeObjectURL(url)
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }

      // Show a success message to the user
      dispatch(updateToast(true, 'success', 'File saved successfully'))
    } catch (e) {
      // Show an error message to the user
      dispatch(
        updateToast(true, 'success', 'An error occurred while saving the file')
      )
    }
  }

  const handleExportCurrentConfig = () => {
    if (isEmpty(configDetails.data)) {
      dispatch(
        updateToast(true, 'error', `No configurations defined for ${name}`)
      )
      return
    }
    save_data(JSON.stringify(configDetails.data))
  }

  const handleExportSampleConfig = () => {
    if (isEmpty(projectConfigs)) {
      dispatch(
        updateToast(
          true,
          'error',
          `No sample configurations defined for ${name}`
        )
      )
      return
    }
    save_data(JSON.stringify(projectConfigs))
  }

  return (
    <Modal
      centered
      isOpen={isOpen}
      style={{ minWidth: '45vw' }}
      toggle={handler}
      className='modal-outline-primary'
    >
      <ModalHeader
        style={{ padding: '16px', width: '100%' }}
        title={`project ${name}`}
        toggle={handler}
      >
        {manageConfig
          ? `Manage Configuration for Project ${name}`
          : `Details of project ${name}`}
      </ModalHeader>
      <ModalBody style={{ overflowX: 'auto', maxHeight: '60vh' }}>
        {projectDetails?.data?.statusCode === 204 && (
          <p>
            Project <b>{name}</b> is still being deployed. Try again in 1
            minute.
          </p>
        )}

        {projectDetails.isLoading || configDetails.isLoading ? (
          t('messages.fetching_project_details')
        ) : (
          <>
            {projectDetails.data.statusCode === 200 && (
              <>
                {manageConfig ? (
                  <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    sx={{ margin: '8px' }}
                    style={{ gap: '12px' }}
                  >
                    <Button onClick={handleExportSampleConfig}>
                      {t('fields.export_sample_config')}
                    </Button>

                    <Button onClick={handleExportCurrentConfig}>
                      {t('fields.export_current_config')}
                    </Button>

                    <Button onClick={handleImportConfig}>
                      {t('fields.import_configuration')}
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Box>
                      {t('fields.version')}:{' '}
                      {projectDetails.data?.details?.projectMetadata?.version ??
                        '-'}
                    </Box>
                    <Box>
                      {t('fields.description')}:{' '}
                      {projectDetails.data?.details?.projectMetadata
                        ?.description ?? '-'}
                    </Box>
                    <Box>
                      {t('fields.deployed_started_on')}:{' '}
                      {projectDetails.data?.createdAt ?? '-'}
                    </Box>
                    <Box>
                      {t('fields.deployed_finished_on')}:{' '}
                      {projectDetails.data?.finishedAt ?? '-'}
                    </Box>
                    <Box>
                      {t('fields.errors')}:{' '}
                      {projectDetails.data?.details?.error ?? 'No'}
                    </Box>
                    <Box mt={2}>
                      <MaterialTable
                        components={{
                          Toolbar: (props) => undefined,
                        }}
                        columns={[
                          { title: `${t('fields.flow')}`, field: 'flow' },
                          {
                            title: `${t('fields.errors')}`,
                            field: 'error',
                          },
                        ]}
                        data={projectDetails.data?.tableOptions}
                        isLoading={projectDetails.isLoading}
                        title=''
                        options={{
                          search: false,
                          selection: false,
                          paging: false,
                        }}
                      />
                    </Box>
                    {projectConfigs ? (
                      <>
                        <Box mt={2}>
                          <Box fontSize={16} mb={1}>
                            {t('titles.project_configuration')}
                          </Box>
                          <AceEditor
                            mode={'json'}
                            readOnly={true}
                            theme={theme}
                            fontSize={14}
                            width='100%'
                            height='300px'
                            defaultValue={JSON.stringify(
                              projectConfigs,
                              null,
                              2
                            )}
                            editorProps={{ $blockScrolling: true }}
                          />
                        </Box>
                      </>
                    ) : null}
                  </>
                )}
              </>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {!isEmpty(projectConfigs) && (
          <Button onClick={!isCopied && copyToClipboard}>
            {isCopied ? (
              <>{t('actions.configuration_copied')}</>
            ) : (
              <>{t('actions.copy_configuration')}</>
            )}
          </Button>
        )}
        <Button color={`primary-${selectedTheme}`} onClick={handler}>
          {t('actions.close')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default AgamaProjectConfigModal
