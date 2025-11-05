import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
import axios from 'Redux/api/axios'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import MaterialTable from '@material-table/core'
import type { Column } from '@material-table/core'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import { isEmpty } from 'lodash'
import AceEditor from 'react-ace'
import type { Deployment } from 'JansConfigApi'
import type {
  AgamaProjectConfigModalProps,
  FlowError,
  ProjectDetailsState,
  ConfigDetailsState,
  ModifiedFields,
} from './types'
import { useAgamaActions } from './hooks'

interface AuthState {
  token: {
    access_token: string
  }
}

interface RootState {
  authReducer: AuthState
}

const AgamaProjectConfigModal: React.FC<AgamaProjectConfigModalProps> = ({
  isOpen,
  row,
  handler,
  handleUpdateRowData,
  manageConfig = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.authReducer.token.access_token)
  const theme = useContext(ThemeContext)
  const name = row.details?.projectMetadata?.projectName || ''
  const selectedTheme = theme?.state?.theme || 'dark'
  const [configDetails, setConfigDetails] = useState<ConfigDetailsState>({
    isLoading: false,
    data: {},
  })
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsState>({
    isLoading: true,
    data: {
      statusCode: undefined,
      tableOptions: [],
    },
  })

  const { logAgamaUpdate } = useAgamaActions()

  const getConfigDetails = useCallback((): void => {
    setConfigDetails((prevState) => ({ ...prevState, isLoading: true }))

    axios
      .get<Record<string, unknown>>('/api/v1/agama-deployment/configs/' + name, {
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
      .catch((error) => {
        console.error('Error fetching config details:', error)
        dispatch(updateToast(true, 'error', 'Failed to fetch configuration details'))
      })
      .finally(() => {
        setConfigDetails((prevState) => ({ ...prevState, isLoading: false }))
      })
  }, [name, token, dispatch])

  const getAgamaProjectDetails = useCallback((): void => {
    setProjectDetails((prevState) => ({ ...prevState, isLoading: true }))
    axios
      .get<Deployment>('/api/v1/agama-deployment/' + name, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const tableOptions: FlowError[] = []

          if (response.data.details?.flowsError) {
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
              tableOptions: [],
            },
          }))
        }
      })
      .catch((error) => {
        console.error('Error fetching project details:', error)
        dispatch(updateToast(true, 'error', 'Failed to fetch project details'))
      })
      .finally(() => {
        setProjectDetails((prevState) => ({ ...prevState, isLoading: false }))
      })
  }, [name, token, handleUpdateRowData, dispatch])

  useEffect(() => {
    getAgamaProjectDetails()
  }, [getAgamaProjectDetails])

  useEffect(() => {
    if (manageConfig) {
      getConfigDetails()
    }
  }, [manageConfig, getConfigDetails])

  const [isCopied, setIsCopied] = useState<boolean>(false)
  const projectConfigs = projectDetails?.data?.details?.projectMetadata?.configs

  const copyToClipboard = (): void => {
    setIsCopied(true)
    navigator.clipboard.writeText(JSON.stringify(projectConfigs, null, 2))
    setTimeout(() => {
      setIsCopied(false)
    }, 6000)
  }

  async function handleImportConfig(): Promise<void> {
    let parsedValue: Record<string, unknown> | null = null
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = function (event: Event) {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async function (event: ProgressEvent<FileReader>) {
        try {
          const result = event.target?.result
          if (typeof result !== 'string') return

          parsedValue = JSON.parse(result) as Record<string, unknown>
          setConfigDetails((prevState) => ({ ...prevState, isLoading: true }))

          const response = await axios.put<Record<string, unknown>>(
            '/api/v1/agama-deployment/configs/' + name,
            parsedValue,
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          )

          setConfigDetails((prevState) => ({
            ...prevState,
            data: response.data,
          }))

          dispatch(
            updateToast(
              true,
              'success',
              `Configuration for project ${name} imported successfully.`,
            ),
          )

          // Log audit action for config update
          const modifiedFields: ModifiedFields = {
            configurationImported: true,
          }
          await logAgamaUpdate(
            { ...row, details: response.data } as Deployment,
            `Imported configuration for project: ${name}`,
            modifiedFields,
          )
        } catch (error) {
          console.error('Error importing config:', error)
          dispatch(updateToast(true, 'error', `Invalid JSON file`))
        } finally {
          setConfigDetails((prevState) => ({
            ...prevState,
            isLoading: false,
          }))
        }
      }
      reader.onerror = function () {
        console.error('Error reading file')
        dispatch(updateToast(true, 'error', 'Failed to read file'))
      }
      reader.readAsText(file, 'utf-8')
    }
    input.click()
    // Cleanup: Remove reference after use
    setTimeout(() => {
      input.remove()
    }, 100)
  }

  function save_data(data: string): void {
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
      console.error('Error saving file:', e)
      dispatch(updateToast(true, 'error', 'An error occurred while saving the file'))
    }
  }

  const handleExportCurrentConfig = (): void => {
    if (isEmpty(configDetails.data)) {
      dispatch(updateToast(true, 'error', `No configurations defined for ${name}`))
      return
    }
    save_data(JSON.stringify(configDetails.data))
  }

  const handleExportSampleConfig = (): void => {
    if (isEmpty(projectConfigs)) {
      dispatch(updateToast(true, 'error', `No sample configurations defined for ${name}`))
      return
    }
    save_data(JSON.stringify(projectConfigs))
  }

  const tableColumns: Column<FlowError>[] = useMemo(
    () => [
      { title: `${t('fields.flow')}`, field: 'flow' },
      {
        title: `${t('fields.errors')}`,
        field: 'error',
      },
    ],
    [t],
  )

  return (
    <Modal
      centered
      isOpen={isOpen}
      style={{ minWidth: '45vw' }}
      toggle={handler}
      className="modal-outline-primary"
    >
      <ModalHeader
        style={{ padding: '16px', width: '100%' }}
        title={`project ${name}`}
        toggle={handler}
      >
        {manageConfig ? `Manage Configuration for Project ${name}` : `Details of project ${name}`}
      </ModalHeader>
      <ModalBody style={{ overflowX: 'auto', maxHeight: '60vh' }}>
        {projectDetails?.data?.statusCode === 204 && (
          <p>
            Project <b>{name}</b> is still being deployed. Try again in 1 minute.
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
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    sx={{ margin: '8px' }}
                    style={{ gap: '12px' }}
                  >
                    <Button onClick={handleExportSampleConfig}>
                      {t('fields.export_sample_config')}
                    </Button>

                    <Button onClick={handleExportCurrentConfig}>
                      {t('fields.export_current_config')}
                    </Button>

                    <Button onClick={handleImportConfig}>{t('fields.import_configuration')}</Button>
                  </Box>
                ) : (
                  <>
                    <Box>
                      {t('fields.version')}:{' '}
                      {projectDetails.data?.details?.projectMetadata?.version ?? '-'}
                    </Box>
                    <Box>
                      {t('fields.description')}:{' '}
                      {projectDetails.data?.details?.projectMetadata?.description ?? '-'}
                    </Box>
                    <Box>
                      {t('fields.deployed_started_on')}: {projectDetails.data?.createdAt ?? '-'}
                    </Box>
                    <Box>
                      {t('fields.deployed_finished_on')}: {projectDetails.data?.finishedAt ?? '-'}
                    </Box>
                    <Box>
                      {t('fields.errors')}: {projectDetails.data?.details?.error ?? 'No'}
                    </Box>
                    <Box mt={2}>
                      <MaterialTable
                        components={{
                          Toolbar: () => undefined,
                        }}
                        columns={tableColumns}
                        data={projectDetails.data?.tableOptions || []}
                        isLoading={projectDetails.isLoading}
                        title=""
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
                            theme={selectedTheme}
                            fontSize={14}
                            width="100%"
                            height="300px"
                            defaultValue={JSON.stringify(projectConfigs, null, 2)}
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
          <Button onClick={() => !isCopied && copyToClipboard()}>
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
