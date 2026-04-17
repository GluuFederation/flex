import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useAppDispatch } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import useSetTitle from 'Utils/SetTitle'
import { useAgamaActions } from './hooks/useAgamaActions'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import {
  GluuTable,
  type ColumnDef,
  type ActionDef,
  type PaginationConfig,
} from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import { GluuButton } from '@/components/GluuButton'
import { Add, DeleteOutlined } from '@mui/icons-material'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'
import { Divider } from '@mui/material'
import Radio from '@mui/material/Radio'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import CircularProgress from '@mui/material/CircularProgress'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import AgamaProjectConfigModal from './AgamaProjectConfigModal'
import { updateToast } from 'Redux/features/toastSlice'
import { useAuthServerJsonPropertiesQuery } from 'Plugins/auth-server/hooks/useAuthServerJsonProperties'
import { devLogger } from '@/utils/devLogger'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { AXIOS_INSTANCE } from '../../../../../api-client'
import {
  useGetAgamaPrj,
  useDeleteAgamaPrj,
  getGetAgamaPrjQueryKey,
  useGetAgamaRepositories,
  type Deployment,
} from 'JansConfigApi'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './AgamaFlows.style'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { BUTTON_STYLES } from 'Routes/Apps/Gluu/styles/GluuThemeFormFooter.style'
import type {
  AgamaProject,
  AgamaRepository,
  AgamaRepositoriesResponse,
  AgamaTableRow,
} from './types'
import { DATE_TIME_FORMAT_OPTIONS } from './constants'
import { AUTH_RESOURCE_ID, AUTH_SCOPES } from '../constants'

const agamaButtonStyle = {
  minHeight: BUTTON_STYLES.height,
  padding: `${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`,
  borderRadius: BUTTON_STYLES.borderRadius,
  fontSize: BUTTON_STYLES.fontSize,
  fontWeight: BUTTON_STYLES.fontWeight,
  letterSpacing: BUTTON_STYLES.letterSpacing,
}

const AgamaFlows: React.FC = () => {
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAgamaCreation, logAgamaDeletion } = useAgamaActions()

  const [limit, setLimit] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false)
  const [manageConfig, setManageConfig] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<AgamaTableRow | null>(null)

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
  const [deployLoading, setDeployLoading] = useState<boolean>(false)

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme || DEFAULT_THEME),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const canReadAuth = useMemo(
    () => hasCedarReadPermission(AUTH_RESOURCE_ID),
    [hasCedarReadPermission],
  )

  const { data: configuration = {}, isLoading: isConfigLoading } = useAuthServerJsonPropertiesQuery(
    {
      enabled: canReadAuth,
    },
  )
  const agamaConfig = configuration as {
    agamaConfiguration?: { enabled?: boolean }
  }
  const isAgamaEnabled = agamaConfig.agamaConfiguration?.enabled

  const {
    data: projectsResponse,
    isLoading: loading,
    refetch: refetchProjects,
  } = useGetAgamaPrj(
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
      onError: (error: Error) => {
        const errorMessage = error.message || t('messages.error_in_saving')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const {
    data: agamaRepositoriesData,
    isLoading: repositoriesLoading,
    refetch: refetchRepositories,
  } = useGetAgamaRepositories<AgamaRepositoriesResponse>({
    query: {
      enabled: false,
    },
  })

  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(AUTH_RESOURCE_ID),
    [hasCedarWritePermission],
  )
  const canDeleteAuth = useMemo(
    () => hasCedarDeletePermission(AUTH_RESOURCE_ID),
    [hasCedarDeletePermission],
  )

  useEffect(() => {
    if (AUTH_SCOPES.length > 0) {
      authorizeHelper(AUTH_SCOPES)
    }
  }, [authorizeHelper])

  useEffect(() => {
    if (agamaRepositoriesData) {
      setAgamaRepositoriesList(
        agamaRepositoriesData ?? {
          projects: [],
        },
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
      await logAgamaCreation({}, `Uploaded Agama project: ${projectName}`)
      setProjectName('')
      setShowAddModal(false)
      setSelectedFile(null)
      setSelectedFileName(null)
      setSHAfile(null)
      setShaStatus(false)
    } catch (error) {
      devLogger.error('Error uploading project:', error)
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
              break
            }
          } catch (parseError) {
            devLogger.error(`Error parsing JSON from ${filename}:`, parseError)
          }
        }
      }

      if (!foundProjectName) {
        setGetProjectName(true)
      }
    } catch (error) {
      devLogger.error('Error reading zip file:', error)
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
    maxSize: 50 * 1024 * 1024,
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
    maxSize: 1024 * 1024,
    onDropRejected: () => {
      toast.error('SHA256 file size exceeds 1MB limit')
    },
  })

  useSetTitle(t('titles.authentication'))

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
          ? new Intl.DateTimeFormat('en-US', DATE_TIME_FORMAT_OPTIONS).format(
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
      devLogger.error('Error reading SHA256 file:', error)
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
        return prevListData
      }

      const error =
        updatedData?.finishedAt && updatedData?.details?.error
          ? 'Yes'
          : updatedData?.finishedAt
            ? 'No'
            : ''
      const status = updatedData?.finishedAt ? 'Processed' : 'Pending'
      const deployed_on = updatedData?.finishedAt
        ? new Intl.DateTimeFormat('en-US', DATE_TIME_FORMAT_OPTIONS).format(
            new Date(updatedData.createdAt || ''),
          )
        : '-'

      return prevListData.map((project, index) =>
        index === foundIndex
          ? {
              ...project,
              error: error as 'Yes' | 'No' | '',
              status: status as 'Processed' | 'Pending',
              deployed_on,
              details: { ...project.details, ...updatedData.details },
            }
          : project,
      )
    })
  }, [])

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

    setDeployLoading(true)
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
      await logAgamaCreation({}, `Deployed community Agama project: ${projectNameToUse}`)
      setShowConfigModal(false)
      setShowAddModal(false)
      setRepoName(null)
      setDeployLoading(false)
    } catch (error) {
      devLogger.error('Error deploying project:', error)
      toast.error('File not found or deployment failed')
      setDeployLoading(false)
    }
  }

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false)
    setRepoName(null)
  }, [])

  const handleDeleteClick = useCallback((row: AgamaTableRow) => {
    setProjectToDelete(row)
    setDeleteModal(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal(false)
    setProjectToDelete(null)
  }, [])

  const handleDeleteConfirm = useCallback(
    async (message: string): Promise<void> => {
      const projName = projectToDelete?.details?.projectMetadata?.projectName
      if (!projName) return
      try {
        await deleteProjectMutation.mutateAsync({ name: projName })
        await logAgamaDeletion(projectToDelete as Deployment, message)
        setDeleteModal(false)
        setProjectToDelete(null)
      } catch (error) {
        devLogger.error('Error deleting project:', error)
      }
    },
    [projectToDelete, deleteProjectMutation, logAgamaDeletion],
  )

  const tabNames = [t('menus.upload_agama_project'), t('menus.add_community_project')]

  const tabToShow = useCallback(
    (tabName: string): React.ReactNode => {
      switch (tabName) {
        case t('menus.upload_agama_project'):
          return (
            <>
              <div className={classes.modalBody}>
                <div
                  {...getRootProps1()}
                  className={isDragActive1 ? classes.dropzoneActive : classes.dropzone}
                >
                  <input {...getInputProps1()} />
                  {selectedFileName ? (
                    <p className={classes.dropzoneSelectedText}>
                      {t('messages.selected_file')}: {selectedFileName}
                    </p>
                  ) : (
                    <p className={classes.dropzoneText}>{t('messages.drag_agama_file')}</p>
                  )}
                </div>
                <div
                  {...getRootProps2()}
                  className={isDragActive2 ? classes.dropzoneActive : classes.dropzone}
                >
                  <input {...getInputProps2()} />
                  {shaFile ? (
                    <p className={classes.dropzoneSelectedText}>
                      {t('messages.selected_file')}: {shaFileName}
                    </p>
                  ) : (
                    <p className={classes.dropzoneText}>{t('messages.drag_sha_file')}</p>
                  )}
                </div>
                {shaFile && selectedFileName && (
                  <p className={shaStatus ? classes.shaStatusSuccess : classes.shaStatusError}>
                    {shaStatus ? 'SHA256 verified' : 'SHA256 not verified'}
                  </p>
                )}
                {getProjectName && (
                  <div className={classes.fieldGroup}>
                    <label className={classes.fieldLabel}>{t('fields.project_name')}</label>
                    <input
                      type="text"
                      className={classes.fieldInput}
                      placeholder={t('placeholders.enter_project_name')}
                      value={projectName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProjectName(e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
              <Divider sx={{ mt: 2 }} />
              <div className={classes.modalFooter}>
                <GluuButton
                  type="button"
                  onClick={() => submitData()}
                  disabled={
                    !(shaFile && selectedFileName && shaStatus && projectName !== '') ||
                    uploadLoading ||
                    isConfigLoading
                  }
                  loading={uploadLoading}
                  backgroundColor={themeColors.formFooter.apply.backgroundColor}
                  textColor={themeColors.formFooter.apply.textColor}
                  borderColor={themeColors.formFooter.apply.borderColor}
                  useOpacityOnHover
                  style={agamaButtonStyle}
                >
                  {t('actions.add')}
                </GluuButton>
                <GluuButton
                  type="button"
                  onClick={handleCloseAddModal}
                  backgroundColor={themeColors.formFooter.cancel.backgroundColor}
                  textColor={themeColors.formFooter.cancel.textColor}
                  borderColor={themeColors.formFooter.cancel.borderColor}
                  useOpacityOnHover
                  style={agamaButtonStyle}
                >
                  {t('actions.cancel')}
                </GluuButton>
              </div>
            </>
          )
        case t('menus.add_community_project'):
          return (
            <>
              <div className={`${classes.modalBody} ${classes.communityModalBody}`}>
                <FormGroup>
                  <FormLabel className={classes.communityFormLabel}>
                    {t('titles.select_project_deploy')}
                  </FormLabel>

                  <div className={classes.repoList}>
                    {fileLoading ? (
                      <CircularProgress sx={{ color: themeColors.badges.statusActive }} />
                    ) : agamaRepositoriesList?.projects?.length ? (
                      agamaRepositoriesList?.projects?.map((item: AgamaRepository) => (
                        <FormControlLabel
                          key={item['repository-name']}
                          control={
                            <Radio
                              checked={repoName === item['repository-name']}
                              onChange={() => setRepoName(item['repository-name'])}
                              sx={{
                                'color': isDark ? '#3B638B' : undefined,
                                '&.Mui-checked': {
                                  color: themeColors.badges.statusActive,
                                },
                              }}
                            />
                          }
                          label={
                            <div>
                              <div className={classes.repoItemName}>{item['repository-name']}</div>
                              <div className={classes.repoItemDescription}>{item.description}</div>
                            </div>
                          }
                          sx={{ alignItems: 'flex-start', marginBottom: '16px' }}
                        />
                      ))
                    ) : (
                      <div className={classes.repoEmptyState}>{t('messages.no_data_found')}</div>
                    )}
                  </div>
                </FormGroup>
              </div>
              <Divider sx={{ mt: 2 }} />
              <div className={classes.modalFooter}>
                <GluuButton
                  type="button"
                  disabled={repoName === null || deployLoading}
                  loading={deployLoading || isConfigLoading}
                  onClick={() => handleDeploy()}
                  backgroundColor={themeColors.formFooter.apply.backgroundColor}
                  textColor={themeColors.formFooter.apply.textColor}
                  borderColor={themeColors.formFooter.apply.borderColor}
                  useOpacityOnHover
                  style={agamaButtonStyle}
                >
                  {t('actions.deploy')}
                </GluuButton>
                <GluuButton
                  type="button"
                  onClick={handleCloseAddModal}
                  backgroundColor={themeColors.formFooter.cancel.backgroundColor}
                  textColor={themeColors.formFooter.cancel.textColor}
                  borderColor={themeColors.formFooter.cancel.borderColor}
                  useOpacityOnHover
                  style={agamaButtonStyle}
                >
                  {t('actions.cancel')}
                </GluuButton>
              </div>
            </>
          )
        default:
          return undefined
      }
    },
    [
      t,
      classes,
      themeColors,
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
      deployLoading,
      agamaRepositoriesList,
      repoName,
      handleDeploy,
      handleCloseAddModal,
    ],
  )

  const totalItems = projectsResponse?.totalEntriesCount || 0

  const columns: ColumnDef<AgamaTableRow>[] = useMemo(
    () => [
      {
        key: 'details' as const,
        label: t('fields.name'),
        render: (_value, row) => row.details?.projectMetadata?.projectName ?? '-',
      },
      {
        key: 'type' as const,
        label: t('fields.type'),
      },
      {
        key: 'details' as const,
        id: 'author-col',
        label: t('fields.author'),
        render: (_value, row) => row.details?.projectMetadata?.author ?? '-',
      },
      {
        key: 'status' as const,
        label: t('fields.status'),
      },
      {
        key: 'deployed_on' as const,
        label: t('fields.deployed_on'),
      },
      {
        key: 'error' as const,
        label: t('fields.errors'),
      },
    ],
    [t],
  )

  const actions = useMemo<ActionDef<AgamaTableRow>[]>(() => {
    const list: ActionDef<AgamaTableRow>[] = [
      {
        icon: <InfoIcon className={classes.infoIcon} />,
        tooltip: t('messages.see_project_details'),
        id: 'infoProject',
        onClick: (row: AgamaTableRow) => {
          setSelectedRow(row as AgamaProject)
          setManageConfig(false)
          setShowConfigModal(true)
        },
      },
    ]
    if (canWriteAuth) {
      list.push({
        icon: <SettingsIcon className={classes.settingsIcon} />,
        tooltip: t('messages.manage_configurations'),
        id: 'settingsProject',
        onClick: (row: AgamaTableRow) => {
          setSelectedRow(row as AgamaProject)
          setManageConfig(true)
          setShowConfigModal(true)
        },
      })
    }
    if (canDeleteAuth) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('actions.delete'),
        id: 'deleteProject',
        onClick: handleDeleteClick,
      })
    }
    return list
  }, [canWriteAuth, canDeleteAuth, t, classes, handleDeleteClick])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems,
      onPageChange: onPageChangeClick,
      onRowsPerPageChange: onRowCountChangeClick,
    }),
    [pageNumber, limit, totalItems, onPageChangeClick, onRowCountChangeClick],
  )

  const getRowKey = useCallback(
    (row: AgamaTableRow, index: number) =>
      row.dn ?? row.details?.projectMetadata?.projectName ?? `agama-${index}`,
    [],
  )

  const primaryAction = useMemo(
    () => ({
      label: t('actions.new_project'),
      icon: <Add className={classes.addIcon} />,
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
      disabled: !canWriteAuth,
    }),
    [t, classes, canWriteAuth, isAgamaEnabled, dispatch, refetchRepositories],
  )

  const deleteDialogLabel = useMemo(
    () =>
      projectToDelete
        ? `${t('messages.action_deletion_for')} ${t('titles.agama')} (${projectToDelete.details?.projectMetadata?.projectName ?? ''})`
        : '',
    [t, projectToDelete],
  )

  const handleAddModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCloseAddModal()
      }
      e.stopPropagation()
    },
    [handleCloseAddModal],
  )

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCloseAddModal()
      }
    },
    [handleCloseAddModal],
  )

  const addModalContent = showAddModal ? (
    <GluuLoader blocking={uploadLoading || deployLoading}>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handleCloseAddModal}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        className={`${commitClasses.modalContainer} ${classes.addModalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleAddModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="add-agama-modal-title"
      >
        <button
          type="button"
          onClick={handleCloseAddModal}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <i className="fa fa-times" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText
            variant="h2"
            className={`${commitClasses.title} ${classes.modalTitle}`}
            id="add-agama-modal-title"
          >
            {t('titles.add_new_agama_project')}
          </GluuText>
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={false} />
        </div>
      </div>
    </GluuLoader>
  ) : null

  return (
    <GluuLoader blocking={(loading && !showAddModal) || deleteProjectMutation.isPending}>
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
        <div className={classes.page}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                onRefresh={canReadAuth ? refetchProjects : undefined}
                primaryAction={primaryAction}
                disabled={loading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<AgamaTableRow>
              columns={columns}
              data={listData}
              actions={actions}
              getRowKey={getRowKey}
              pagination={pagination}
              emptyMessage={t('messages.no_data')}
            />
          </div>
        </div>
      </GluuViewWrapper>

      {addModalContent !== null && createPortal(addModalContent, document.body)}

      {projectToDelete && (
        <GluuCommitDialog
          handler={handleCloseDeleteModal}
          modal={deleteModal}
          onAccept={handleDeleteConfirm}
          label={deleteDialogLabel}
          feature=""
          autoCloseOnAccept
        />
      )}
    </GluuLoader>
  )
}

export default AgamaFlows
