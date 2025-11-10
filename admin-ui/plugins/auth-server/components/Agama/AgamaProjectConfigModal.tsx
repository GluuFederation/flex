import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
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
import { useGetAgamaPrjByName, useGetAgamaPrjConfigs, usePutAgamaPrj } from 'JansConfigApi'
import type {
  AgamaProjectConfigModalProps,
  FlowError,
  ProjectDetailsState,
  ConfigDetailsState,
} from './types'

const AgamaProjectConfigModal: React.FC<AgamaProjectConfigModalProps> = ({
  isOpen,
  row,
  handler,
  handleUpdateRowData,
  manageConfig = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
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

  const { data: projectDetailsData, isLoading: projectDetailsLoading } = useGetAgamaPrjByName(
    name,
    {
      query: {
        enabled: !!name && isOpen,
      },
    },
  )

  const {
    data: configDetailsData,
    isLoading: configDetailsLoading,
    refetch: refetchConfig,
  } = useGetAgamaPrjConfigs(name, {
    query: {
      enabled: manageConfig && !!name && isOpen,
    },
  })

  const updateConfigMutation = usePutAgamaPrj({
    mutation: {
      onSuccess: async (data) => {
        setConfigDetails((prevState) => ({
          ...prevState,
          data: JSON.parse(data as string),
        }))
        dispatch(
          updateToast(true, 'success', `Configuration for project ${name} imported successfully.`),
        )
      },
      onError: (error: unknown) => {
        console.error('Error importing config:', error)
        dispatch(updateToast(true, 'error', `Invalid JSON file`))
      },
    },
  })

  useEffect(() => {
    if (projectDetailsData) {
      const tableOptions: FlowError[] = []

      if (projectDetailsData.details?.flowsError) {
        for (const flow in projectDetailsData.details.flowsError) {
          const error = projectDetailsData.details.flowsError[flow]
          tableOptions.push({ flow: flow, error })
        }
      }

      setProjectDetails({
        isLoading: false,
        data: {
          ...projectDetailsData,
          statusCode: 200,
          tableOptions: tableOptions,
        },
      })

      handleUpdateRowData(projectDetailsData)
    } else if (!projectDetailsLoading && isOpen) {
      setProjectDetails({
        isLoading: false,
        data: {
          statusCode: 204,
          tableOptions: [],
        },
      })
    }
  }, [projectDetailsData, projectDetailsLoading, handleUpdateRowData, isOpen])

  useEffect(() => {
    if (configDetailsData) {
      try {
        const parsedData =
          typeof configDetailsData === 'string' ? JSON.parse(configDetailsData) : configDetailsData
        setConfigDetails({
          isLoading: false,
          data: parsedData,
        })
      } catch (error) {
        console.error('Error parsing config data:', error)
        setConfigDetails({
          isLoading: false,
          data: {},
        })
      }
    }
  }, [configDetailsData])

  useEffect(() => {
    setProjectDetails((prevState) => ({
      ...prevState,
      isLoading: projectDetailsLoading,
    }))
  }, [projectDetailsLoading])

  useEffect(() => {
    setConfigDetails((prevState) => ({
      ...prevState,
      isLoading: configDetailsLoading,
    }))
  }, [configDetailsLoading])

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

          await updateConfigMutation.mutateAsync({
            name,
            data: JSON.stringify(parsedValue),
          })

          await refetchConfig()
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
    setTimeout(() => {
      input.remove()
    }, 100)
  }

  function save_data(data: string): void {
    try {
      const blob = new Blob([data], { type: 'application/json' })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'data.json'

      link.dispatchEvent(new MouseEvent('click'))

      URL.revokeObjectURL(url)
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }

      dispatch(updateToast(true, 'success', 'File saved successfully'))
    } catch (e) {
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
