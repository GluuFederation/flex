import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Input } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import useSetTitle from 'Utils/SetTitle'
import { useAgamaActions } from './hooks/useAgamaActions'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import type { Column, Action } from '@material-table/core'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import CircularProgress from '@mui/material/CircularProgress'
import InfoIcon from '@mui/icons-material/Info'
import AgamaProjectConfigModal from './AgamaProjectConfigModal'
import { updateToast } from 'Redux/features/toastSlice'
import { isEmpty } from 'lodash'
import { getJsonConfig } from 'Plugins/auth-server/redux/features/jsonConfigSlice'
import SettingsIcon from '@mui/icons-material/Settings'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { toast } from 'react-toastify'
import customColors from '@/customColors'
import { useQueryClient } from '@tanstack/react-query'
import { AXIOS_INSTANCE } from '../../../../api-client'
import {
  useGetAgamaPrj,
  useDeleteAgamaPrj,
  getGetAgamaPrjQueryKey,
  useGetAgamaRepositories,
  type Deployment,
} from 'JansConfigApi'
import { DEFAULT_THEME } from '@/context/theme/constants'
import type {
  AgamaProject,
  AgamaRepository,
  AgamaRepositoriesResponse,
  AgamaTableRow,
} from './types'

interface RootState {
  jsonConfigReducer: {
    configuration: {
      agamaConfiguration?: {
        enabled?: boolean
      }
    }
    loading: boolean
  }
}

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}

function AgamaListPage(): React.ReactElement {
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { logAgamaCreation, logAgamaDeletion } = useAgamaActions()
  const [myActions, setMyActions] = useState<Action<AgamaTableRow>[]>([])
  const [limit, setLimit] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false)
  const [manageConfig, setManageConfig] = useState<boolean>(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [projectName, setProjectName] = useState<string>('')
  const [getProjectName, setGetProjectName] = useState<boolean>(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [shaFile, setSHAfile] = useState<File | null>(null)
  const [shaStatus, setShaStatus] = useState<boolean>(false)
  const [shaFileName, setShaFileName] = useState<string>('')
  const [listData, setListData] = useState<AgamaProject[]>([])
  const [selectedRow, setSelectedRow] = useState<AgamaProject | null>(null)
  const [repoName, setRepoName] = useState<string | null>(null)
  const [agamaRepositoriesList, setAgamaRepositoriesList] = useState<AgamaRepositoriesResponse>({
    projects: [],
  })
  const [fileLoading, setFileLoading] = useState<boolean>(false)
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)

  const configuration = useSelector((state: RootState) => state.jsonConfigReducer.configuration)
  const isAgamaEnabled = configuration?.agamaConfiguration?.enabled
  const isConfigLoading = useSelector((state: RootState) => state.jsonConfigReducer.loading)

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const authResourceId = useMemo(() => ADMIN_UI_RESOURCES.Authentication, [])
  const authScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[authResourceId] || [], [authResourceId])
  const canReadAuth = useMemo(
    () => hasCedarReadPermission(authResourceId),
    [hasCedarReadPermission, authResourceId],
  )

  const { data: projectsResponse, isLoading: loading } = useGetAgamaPrj(
    {
      count: limit,
      start: pageNumber * limit,
    },
    {
      query: {
        enabled: canReadAuth,
        staleTime: 0,
        gcTime: 0,
      },
    },
  )

  const deleteProjectMutation = useDeleteAgamaPrj({
    mutation: {
      onSuccess: async () => {
        dispatch(updateToast(true, 'success'))
        await queryClient.invalidateQueries({ queryKey: getGetAgamaPrjQueryKey() })
      },
      onError: (error: unknown) => {
        const errorMessage = (error as Error)?.message || 'Failed to delete project'
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const {
    data: agamaRepositoriesData,
    isLoading: repositoriesLoading,
    refetch: refetchRepositories,
  } = useGetAgamaRepositories({
    query: {
      enabled: false, // Only fetch when explicitly triggered
    },
  })

  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(authResourceId),
    [hasCedarWritePermission, authResourceId],
  )
  const canDeleteAuth = useMemo(
    () => hasCedarDeletePermission(authResourceId),
    [hasCedarDeletePermission, authResourceId],
  )

  useEffect(() => {
    if (authScopes && authScopes.length > 0) {
      authorizeHelper(authScopes)
    }
  }, [authorizeHelper, authScopes])

  useEffect(() => {
    if (!canReadAuth) {
      return
    }
    if (isEmpty(configuration)) {
      dispatch(getJsonConfig())
    }
  }, [dispatch, configuration, canReadAuth])

  useEffect(() => {
    if (agamaRepositoriesData) {
      setAgamaRepositoriesList(
        (agamaRepositoriesData as unknown as AgamaRepositoriesResponse) ?? { projects: [] },
      )
      setFileLoading(false)
    }
  }, [agamaRepositoriesData])

  useEffect(() => {
    if (repositoriesLoading) {
      setFileLoading(true)
    }
  }, [repositoriesLoading])

  const submitData = async (): Promise<void> => {
    if (!selectedFile) return

    setUploadLoading(true)
    try {
      await AXIOS_INSTANCE.post(
        `/api/v1/agama-deployment/${encodeURIComponent(projectName)}`,
        selectedFile,
        { headers: { 'Content-Type': 'application/zip' } },
      )
      dispatch(updateToast(true, 'success'))
      await queryClient.invalidateQueries({ queryKey: getGetAgamaPrjQueryKey() })
      await logAgamaCreation({} as Deployment, `Uploaded Agama project: ${projectName}`)
      setProjectName('')
      setShowAddModal(false)
      setSelectedFile(null)
      setSelectedFileName(null)
      setSHAfile(null)
      setShaStatus(false)
    } catch (error) {
      console.error('Error uploading project:', error)
      dispatch(updateToast(true, 'error', 'Failed to upload project'))
    } finally {
      setUploadLoading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]): Promise<void> => {
    setProjectName('')
    const file = acceptedFiles[0]
    if (!file) return

    setSelectedFileName(file.name)
    setSelectedFile(file)
    let foundProjectName = false

    try {
      const zip = await JSZip.loadAsync(file)

      const jsonFiles = Object.keys(zip.files).filter((filename) => filename.endsWith('.json'))

      for (const filename of jsonFiles) {
        const zipEntry = zip.files[filename]
        if (!zipEntry.dir) {
          try {
            const jsonStr = await zipEntry.async('string')
            const jsonData = JSON.parse(jsonStr) as { projectName?: string }
            if (jsonData?.projectName) {
              setProjectName(jsonData.projectName)
              foundProjectName = true
              setGetProjectName(true)
              break // Stop after finding first project name
            }
          } catch (parseError) {
            console.error(`Error parsing JSON from ${filename}:`, parseError)
          }
        }
      }

      if (!foundProjectName) {
        setGetProjectName(true)
      }
    } catch (error) {
      console.error('Error reading zip file:', error)
      toast.error('Failed to read zip file')
    }
  }, [])

  const onSHA256FileDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

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
    maxSize: 50 * 1024 * 1024, // 50MB limit
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]
      if (error?.code === 'file-too-large') {
        toast.error('File size exceeds 50MB limit')
      }
    },
  })

  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
  } = useDropzone({
    onDrop: onSHA256FileDrop,
    accept: {
      'text/plain': ['.sha256sum'],
    },
    maxSize: 1024 * 1024, // 1MB limit for SHA file
    onDropRejected: () => {
      toast.error('SHA256 file size exceeds 1MB limit')
    },
  })

  useSetTitle(t('titles.agama'))

  const formDeploymentDetailsData = useCallback((): void => {
    const data: AgamaProject[] = []
    const agamaList = projectsResponse?.entries || []

    if (agamaList.length) {
      for (const project of agamaList) {
        const deploymentProject = project as Deployment
        const error =
          deploymentProject?.finishedAt && deploymentProject?.details?.error
            ? 'Yes'
            : deploymentProject?.finishedAt
              ? 'No'
              : ''
        const status = deploymentProject?.finishedAt ? 'Processed' : 'Pending'
        const deployed_on = deploymentProject?.finishedAt
          ? new Intl.DateTimeFormat('en-US', dateTimeFormatOptions).format(
              new Date(deploymentProject.createdAt || ''),
            )
          : '-'
        data.push({
          ...deploymentProject,
          deployed_on,
          type: deploymentProject?.details?.projectMetadata?.type ?? '-',
          status,
          error,
        } as AgamaProject)
      }
    }

    setListData(data)
  }, [projectsResponse])

  useEffect(() => {
    formDeploymentDetailsData()
  }, [formDeploymentDetailsData])

  const onPageChangeClick = useCallback((page: number): void => {
    setPageNumber(page)
  }, [])

  const onRowCountChangeClick = useCallback((count: number): void => {
    setPageNumber(0)
    setLimit(count)
  }, [])

  const myActionsComputed = useMemo(() => {
    const newActions: Action<AgamaTableRow>[] = []

    if (canWriteAuth) {
      newActions.push({
        icon: 'add',
        tooltip: `${t('titles.add_new_agama_project')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          setSelectedFile(null)
          setSelectedFileName(null)
          setGetProjectName(false)
          setSHAfile(null)
          refetchRepositories()
          if (isAgamaEnabled) {
            setShowAddModal(true)
          } else {
            dispatch(updateToast(true, 'error', t('messages.agama_is_not_enabled')))
          }
        },
      })
      newActions.push({
        icon: () => <InfoIcon />,
        tooltip: `${t('messages.see_project_details')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: false,
        onClick: (_event: unknown, rowData: AgamaTableRow | AgamaTableRow[]) => {
          if (!Array.isArray(rowData)) {
            setSelectedRow(rowData)
            setShowConfigModal(true)
          }
        },
      })
      newActions.push({
        icon: () => <SettingsIcon />,
        tooltip: `${t('messages.manage_configurations')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: false,
        onClick: (_event: unknown, rowData: AgamaTableRow | AgamaTableRow[]) => {
          if (!Array.isArray(rowData)) {
            setSelectedRow(rowData)
            setShowConfigModal(true)
            setManageConfig(true)
          }
        },
      })
    }

    return newActions
  }, [
    canWriteAuth,
    t,
    isAgamaEnabled,
    dispatch,
    refetchRepositories,
    setShowAddModal,
    setSelectedFile,
    setSelectedFileName,
    setGetProjectName,
    setSHAfile,
    setSelectedRow,
    setShowConfigModal,
    setManageConfig,
  ])

  useEffect(() => {
    setMyActions(myActionsComputed)
  }, [myActionsComputed])

  const getSHA256 = useCallback(
    async (sha256sum: string): Promise<void> => {
      if (!selectedFile) return

      const uint8Array = new Uint8Array(await new Blob([selectedFile]).arrayBuffer())
      const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
      setShaStatus(hashHex === sha256sum)
    },
    [selectedFile],
  )

  const verifySHA256Hash = useCallback((): void => {
    if (!shaFile) return

    const reader = new FileReader()

    reader.onload = () => {
      const sha256sum = reader.result as string
      const sha256sumValue = sha256sum.split(' ', 1)[0]
      if (sha256sumValue) {
        getSHA256(sha256sumValue)
      }
    }

    reader.onerror = (error) => {
      console.error('Error reading SHA256 file:', error)
      toast.error('Failed to read SHA256 file')
    }

    const blob = new Blob([shaFile])
    reader.readAsText(blob)
  }, [shaFile, getSHA256])

  useEffect(() => {
    if (shaFile && selectedFile) {
      verifySHA256Hash()
    }
  }, [shaFile, selectedFile, verifySHA256Hash])

  const handleUpdateRowData = useCallback((updatedData: Deployment): void => {
    setListData((prevListData) => {
      const foundIndex = prevListData.findIndex((item) => item.dn === updatedData.dn)

      if (foundIndex === -1) {
        return prevListData // No change if not found
      }

      const error =
        updatedData?.finishedAt && updatedData?.details?.error
          ? 'Yes'
          : updatedData?.finishedAt
            ? 'No'
            : ''
      const status = updatedData?.finishedAt ? 'Processed' : 'Pending'
      const deployed_on = updatedData?.finishedAt
        ? new Intl.DateTimeFormat('en-US', dateTimeFormatOptions).format(
            new Date(updatedData.createdAt || ''),
          )
        : '-'

      const updatedList = prevListData.map((project, index) => {
        return index === foundIndex
          ? {
              ...project,
              error: error as 'Yes' | 'No' | '',
              status: status as 'Processed' | 'Pending',
              deployed_on: deployed_on,
              details: { ...project.details, ...updatedData.details },
            }
          : project
      })
      return updatedList
    })
  }, [])

  const tabNames = [t('menus.upload_agama_project'), t('menus.add_community_project')]

  const handleDeploy = async (): Promise<void> => {
    if (!repoName) {
      toast.error('No repository selected')
      return
    }

    const repo = agamaRepositoriesList.projects.find((item) => item['repository-name'] === repoName)
    if (!repo) {
      toast.error('Repository not found')
      return
    }

    setFileLoading(true)
    const downloadUrl = repo['download-link']
    const projectNameToUse = repo['repository-name']
    setProjectName(projectNameToUse)

    try {
      const downloadResponse = await AXIOS_INSTANCE.get(`/api/v1/agama-repo/download`, {
        params: { downloadLink: downloadUrl },
      })

      if (!downloadResponse.data) {
        throw new Error('Failed to download project')
      }
      const base64Data = downloadResponse.data as string
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const projectBlob = new Blob([bytes], { type: 'application/zip' })
      const projectFile = new File([projectBlob], `${projectNameToUse}.gama`, {
        type: 'application/zip',
      })
      await AXIOS_INSTANCE.post(
        `/api/v1/agama-deployment/${encodeURIComponent(projectNameToUse)}`,
        projectFile,
        { headers: { 'Content-Type': 'application/zip' } },
      )

      dispatch(updateToast(true, 'success'))
      await queryClient.invalidateQueries({ queryKey: getGetAgamaPrjQueryKey() })
      await logAgamaCreation(
        {} as Deployment,
        `Deployed community Agama project: ${projectNameToUse}`,
      )
      setShowConfigModal(false)
      setShowAddModal(false)
      setRepoName(null)
      setFileLoading(false)
    } catch (error) {
      console.error('Error deploying project:', error)
      toast.error('File not found or deployment failed')
      setFileLoading(false)
    }
  }

  const tabToShow = useCallback(
    (tabName: string): React.ReactNode => {
      switch (tabName) {
        case t('menus.upload_agama_project'):
          return (
            <>
              <ModalBody>
                <div {...getRootProps1()} className={isDragActive1 ? 'active' : 'dropzone'}>
                  <input {...getInputProps1()} />
                  {selectedFileName ? (
                    <strong>Selected File : {selectedFileName}</strong>
                  ) : (
                    <p>{t('messages.drag_agama_file')}</p>
                  )}
                </div>
                <div className="mt-2"></div>
                <div {...getRootProps2()} className={isDragActive2 ? 'active' : 'dropzone'}>
                  <input {...getInputProps2()} />
                  {shaFile ? (
                    <strong>Selected File : {shaFileName}</strong>
                  ) : (
                    <p>{t('messages.drag_sha_file')}</p>
                  )}
                </div>
                <div className="mt-2"></div>
                <div className="text-danger">
                  {shaFile && selectedFileName && !shaStatus && 'SHA256 not verified'}
                </div>
                <div className="text-success">
                  {shaFile && selectedFileName && shaStatus && 'SHA256 verified'}
                </div>
                {getProjectName && (
                  <Input
                    type="text"
                    placeholder="Project name"
                    value={projectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProjectName(e.target.value)
                    }
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color={`primary-${selectedTheme}`}
                  style={applicationStyle.buttonStyle}
                  onClick={() => submitData()}
                  disabled={
                    !(shaFile && selectedFileName && shaStatus && projectName !== '') ||
                    uploadLoading ||
                    isConfigLoading
                  }
                >
                  {uploadLoading || isConfigLoading ? (
                    <>
                      <CircularProgress size={12} /> &nbsp;
                    </>
                  ) : null}
                  {t('actions.add')}
                </Button>
                &nbsp;
                <Button
                  color={`primary-${selectedTheme}`}
                  style={applicationStyle.buttonStyle}
                  onClick={() => {
                    setShowAddModal(false)
                    setRepoName(null)
                  }}
                >
                  {t('actions.cancel')}
                </Button>
              </ModalFooter>
            </>
          )
        case t('menus.add_community_project'):
          return (
            <>
              <ModalBody style={{ maxHeight: '500px', height: 'auto' }}>
                <FormGroup>
                  <FormLabel
                    style={{
                      marginBottom: '16px',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}
                  >
                    {t('titles.select_project_deploy')}
                  </FormLabel>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '0 10px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                    }}
                  >
                    {fileLoading ? (
                      <CircularProgress />
                    ) : agamaRepositoriesList?.projects?.length ? (
                      agamaRepositoriesList?.projects?.map((item: AgamaRepository) => (
                        <FormControlLabel
                          key={item['repository-name']}
                          control={
                            <Checkbox
                              checked={repoName === item['repository-name']}
                              onChange={() =>
                                setRepoName(
                                  repoName === item['repository-name']
                                    ? null
                                    : item['repository-name'],
                                )
                              }
                              sx={{
                                transform: 'scale(1.5)',
                                paddingTop: '6px',
                              }}
                            />
                          }
                          label={
                            <div>
                              <div>{item['repository-name']}</div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: customColors.darkGray,
                                  marginTop: 6,
                                }}
                              >
                                {item.description}
                              </div>
                            </div>
                          }
                          sx={{
                            alignItems: 'flex-start',
                            marginBottom: '16px',
                          }}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          fontSize: '15px',
                          padding: '14px 0 ',
                        }}
                      >
                        {t('messages.no_data_found')}
                      </div>
                    )}
                  </div>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={`primary-${selectedTheme}`}
                  style={applicationStyle.buttonStyle}
                  disabled={repoName === null || fileLoading}
                  onClick={() => handleDeploy()}
                >
                  {fileLoading || isConfigLoading ? (
                    <>
                      <CircularProgress size={12} /> &nbsp;
                    </>
                  ) : null}
                  {t('actions.deploy')}
                </Button>
                &nbsp;
                <Button
                  color={`primary-${selectedTheme}`}
                  style={applicationStyle.buttonStyle}
                  onClick={() => {
                    setShowAddModal(false)
                    setRepoName(null)
                  }}
                >
                  {t('actions.cancel')}
                </Button>
              </ModalFooter>
            </>
          )
      }
    },
    [
      t,
      selectedTheme,
      getRootProps1,
      getInputProps1,
      isDragActive1,
      selectedFileName,
      getRootProps2,
      getInputProps2,
      isDragActive2,
      shaFile,
      shaFileName,
      getProjectName,
      projectName,
      shaStatus,
      uploadLoading,
      isConfigLoading,
      submitData,
      fileLoading,
      agamaRepositoriesList,
      repoName,
      handleDeploy,
    ],
  )

  const handleDeleteProject = useCallback(
    async (oldData: AgamaTableRow): Promise<void> => {
      const projectName = oldData.details?.projectMetadata?.projectName
      if (!projectName) {
        throw new Error('Project name not found')
      }

      try {
        await deleteProjectMutation.mutateAsync({ name: projectName })
        await logAgamaDeletion(oldData as Deployment, `Deleted Agama project: ${projectName}`)
      } catch (error) {
        console.error('Error deleting project:', error)
        throw error
      }
    },
    [deleteProjectMutation, logAgamaDeletion],
  )

  const tableColumns: Column<AgamaTableRow>[] = useMemo(
    () => [
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
        title: `${t('fields.errors')}`,
        field: 'error',
      },
    ],
    [t],
  )

  const totalItems = projectsResponse?.totalEntriesCount || 0

  return (
    <>
      {showConfigModal && selectedRow && (
        <AgamaProjectConfigModal
          isOpen={showConfigModal}
          row={selectedRow}
          handleUpdateRowData={handleUpdateRowData}
          manageConfig={manageConfig}
          handler={() => {
            if (manageConfig) {
              setManageConfig(false)
            }
            setShowConfigModal(false)
          }}
        />
      )}
      <GluuViewWrapper canShow={canReadAuth}>
        <MaterialTable
          key={limit}
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
            Pagination: () => (
              <TablePagination
                count={totalItems}
                page={pageNumber}
                onPageChange={(_prop, page) => {
                  onPageChangeClick(page)
                }}
                rowsPerPage={limit}
                onRowsPerPageChange={(event) =>
                  onRowCountChangeClick(parseInt(event.target.value, 10))
                }
              />
            ),
          }}
          columns={tableColumns}
          data={listData}
          isLoading={loading}
          title=""
          actions={myActions}
          options={{
            search: true,
            idSynonym: 'inum',
            searchFieldAlignment: 'left',
            selection: false,
            pageSize: limit,
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
            isDeleteHidden: () => !canDeleteAuth,
            onRowDelete: handleDeleteProject,
          }}
        />
      </GluuViewWrapper>
      <Modal isOpen={showAddModal} size="lg" style={{ maxWidth: '700px', width: '100%' }}>
        <ModalHeader>{t('titles.add_new_agama_project')}</ModalHeader>
        <Card>
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={false} />
        </Card>
      </Modal>
    </>
  )
}

export default AgamaListPage
