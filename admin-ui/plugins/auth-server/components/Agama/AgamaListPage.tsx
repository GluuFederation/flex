import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Input } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import type { Column, Action } from '@material-table/core'
import { AGAMA_READ, AGAMA_WRITE, AGAMA_DELETE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
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
import {
  useGetAgamaPrj,
  useDeleteAgamaPrj,
  getGetAgamaPrjQueryKey,
  type Deployment,
} from 'JansConfigApi'
import axios from 'Redux/api/axios'
import type {
  AgamaProject,
  AgamaRepository,
  AgamaRepositoriesResponse,
  AgamaTableRow,
} from './types'
import { useAgamaActions } from './hooks'

interface JsonConfigState {
  configuration: {
    agamaConfiguration?: {
      enabled?: boolean
    }
  }
  loading: boolean
}

interface CedarPermissionsState {
  permissions: string[]
}

interface RootState {
  jsonConfigReducer: JsonConfigState
  cedarPermissions: CedarPermissionsState
}

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}

function AgamaListPage(): React.ReactElement {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
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
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const { logAgamaCreation, logAgamaDeletion } = useAgamaActions()

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'dark'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  // Fetch projects using React Query
  const {
    data: projectsResponse,
    isLoading: loading,
    refetch: refetchProjects,
  } = useGetAgamaPrj({
    count: limit,
    start: pageNumber * limit,
  })

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

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async (): Promise<void> => {
      const permissions = [AGAMA_READ, AGAMA_WRITE, AGAMA_DELETE]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing Agama permissions:', error)
      }
    }

    authorizePermissions()
    if (isEmpty(configuration)) {
      dispatch(getJsonConfig({} as never))
    }
  }, [dispatch, configuration, authorize])

  function convertFileToByteArray(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer)
        resolve(byteArray)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const convertFileFrombase64 = (base64String: string): Uint8Array => {
    // Decode Base64 string to a Uint8Array
    const byteCharacters = atob(base64String)
    const byteArray = new Uint8Array(byteCharacters.length)

    // Fill the Uint8Array with the byte values
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i)
    }
    return byteArray
  }

  async function fetchRespositoryData(): Promise<void> {
    try {
      setFileLoading(true)
      const response = await axios.get<AgamaRepositoriesResponse>('/api/v1/agama-repo')
      setAgamaRepositoriesList(response.data)
    } catch (error) {
      console.error('Error fetching repository data:', error)
      dispatch(updateToast(true, 'error', 'Failed to fetch repositories'))
    } finally {
      setFileLoading(false)
    }
  }

  useEffect(() => {
    if (isEmpty(configuration)) {
      dispatch(getJsonConfig({} as never))
    }
  }, [dispatch, configuration])

  const submitData = async (): Promise<void> => {
    if (!selectedFile) return

    try {
      setUploadLoading(true)
      const file = await convertFileToByteArray(selectedFile)

      // Upload using custom axios since this needs multipart/zip
      const response = await axios.post<Deployment>(
        `/api/v1/agama-deployment/${projectName}`,
        file,
        {
          headers: {
            'Content-Type': 'application/zip',
          },
        },
      )

      // Log audit action
      await logAgamaCreation(response.data, `Uploaded Agama project: ${projectName}`)

      dispatch(updateToast(true, 'success'))
      await queryClient.invalidateQueries({ queryKey: getGetAgamaPrjQueryKey() })

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setProjectName('')
    const file = acceptedFiles[0]
    if (!file) return

    setSelectedFileName(file.name)
    setSelectedFile(file)

    try {
      const zip = await JSZip.loadAsync(file)

      // Get all .json files
      const jsonFiles = Object.keys(zip.files).filter((filename) => filename.endsWith('.json'))

      // Process first .json file to extract project name
      for (const filename of jsonFiles) {
        const zipEntry = zip.files[filename]
        if (!zipEntry.dir) {
          try {
            const jsonStr = await zipEntry.async('string')
            const jsonData = JSON.parse(jsonStr) as { projectName?: string }
            if (jsonData?.projectName) {
              setProjectName(jsonData.projectName)
              setGetProjectName(true)
              break // Stop after finding first project name
            }
          } catch (parseError) {
            console.error(`Error parsing JSON from ${filename}:`, parseError)
            // Continue to next file if this one fails
          }
        }
      }

      if (!projectName) {
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
  })

  SetTitle(t('titles.authentication'))

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

  // Actions as state that will rebuild when permissions change
  useEffect(() => {
    const newActions: Action<AgamaTableRow>[] = []

    if (hasCedarPermission(AGAMA_WRITE)) {
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
          fetchRespositoryData()
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

    setMyActions(newActions)
  }, [hasCedarPermission, t, isAgamaEnabled, dispatch, cedarPermissions])

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

    // Cleanup: abort file reader if component unmounts
    return () => {
      // FileReader doesn't have an abort method, but we can prevent state updates
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

  //Modal Tabs
  const tabNames = [
    { name: t('menus.upload_agama_project'), path: '' },
    { name: t('menus.add_community_project'), path: '' },
  ]

  const handleDeploy = async (): Promise<void> => {
    try {
      const repo = agamaRepositoriesList.projects.find(
        (item) => item['repository-name'] === repoName,
      )
      if (!repo) {
        toast.error('Repository not found')
        return
      }

      setFileLoading(true)
      const downloadUrl = repo['download-link']
      setProjectName(repo['repository-name'])

      // Fetch repository file
      const response = await axios.get<{ file: string }>(
        `/api/v1/agama-repo/download/?downloadLink=${encodeURIComponent(downloadUrl)}`,
      )

      const byteArray = convertFileFrombase64(response.data.file)

      // Upload the file
      const uploadResponse = await axios.post<Deployment>(
        `/api/v1/agama-deployment/${repo['repository-name']}`,
        byteArray,
        {
          headers: {
            'Content-Type': 'application/zip',
          },
        },
      )

      // Log audit action
      await logAgamaCreation(
        uploadResponse.data,
        `Deployed community project: ${repo['repository-name']}`,
      )

      dispatch(updateToast(true, 'success'))
      await queryClient.invalidateQueries({ queryKey: getGetAgamaPrjQueryKey() })

      setShowConfigModal(false)
      setShowAddModal(false)
      setRepoName(null)
    } catch (error) {
      console.error('Error deploying project:', error)
      toast.error('File not found or deployment failed')
    } finally {
      setFileLoading(false)
    }
  }

  const tabToShow = (tabName: string): React.ReactNode => {
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
  }

  const handleDeleteProject = async (oldData: AgamaTableRow): Promise<void> => {
    const projectName = oldData.details?.projectMetadata?.projectName
    if (!projectName) {
      throw new Error('Project name not found')
    }

    try {
      await deleteProjectMutation.mutateAsync({ name: projectName })
      // Log audit action
      await logAgamaDeletion(oldData, `Deleted Agama project: ${projectName}`)
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

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
      <GluuViewWrapper canShow={hasCedarPermission(AGAMA_READ)}>
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
            rowStyle: (rowData) => ({
              backgroundColor: (rowData as AgamaTableRow & { enabled?: boolean }).enabled
                ? customColors.lightGreen
                : customColors.white,
            }),
            headerStyle: {
              ...(applicationStyle.tableHeaderStyle as React.CSSProperties),
              ...bgThemeColor,
            } as React.CSSProperties,
            actionsColumnIndex: -1,
          }}
          editable={{
            isDeleteHidden: () => !hasCedarPermission(AGAMA_DELETE),
            onRowDelete: handleDeleteProject,
          }}
        />
      </GluuViewWrapper>
      <Modal isOpen={showAddModal} size="lg" style={{ maxWidth: '700px', width: '100%' }}>
        <ModalHeader>{t('titles.add_new_agama_project')}</ModalHeader>
        <Card>
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
        </Card>
      </Modal>
    </>
  )
}

export default AgamaListPage
