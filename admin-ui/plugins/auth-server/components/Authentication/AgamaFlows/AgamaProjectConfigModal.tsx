import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Box, Divider } from '@mui/material'
import MaterialTable from '@material-table/core'
import type { Column } from '@material-table/core'
import { useDispatch } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import { isEmpty } from 'lodash'
import AceEditor from 'react-ace'
import { useGetAgamaPrjByName, useGetAgamaPrjConfigs, usePutAgamaPrj } from 'JansConfigApi'
import { DEFAULT_THEME, THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import { devLogger } from '@/utils/devLogger'
import { GluuButton } from '@/components/GluuButton'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useStyles } from './AgamaProjectConfigModal.style'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { BUTTON_STYLES } from 'Routes/Apps/Gluu/styles/GluuThemeFormFooter.style'
import type {
  AgamaProjectConfigModalProps,
  FlowError,
  ProjectDetailsState,
  ConfigDetailsState,
  JsonObject,
  ApiError,
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

  const { state: themeState } = useTheme()
  const { themeColors, isDark, selectedTheme } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme || DEFAULT_THEME),
      isDark: themeState.theme === THEME_DARK,
      selectedTheme: themeState.theme || DEFAULT_THEME,
    }),
    [themeState.theme],
  )

  const { classes } = useStyles({ isDark, themeColors })
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })

  const name = row.details?.projectMetadata?.projectName || ''

  const aceTheme = useMemo(() => {
    const themeMap: Record<string, string> = {
      [THEME_LIGHT]: 'xcode',
      [THEME_DARK]: 'monokai',
    }
    return themeMap[selectedTheme] || 'xcode'
  }, [selectedTheme])

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
      onSuccess: (data: string | JsonObject) => {
        let normalizedData: JsonObject = {}

        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data) as JsonObject
            normalizedData = parsed
          } catch (e) {
            const parseError: Error = e instanceof Error ? e : new Error(String(e))
            devLogger.error('Failed to parse config data JSON on success:', parseError)
          }
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          normalizedData = structuredClone(data) as JsonObject
        }

        setConfigDetails((prevState) => ({
          ...prevState,
          data: normalizedData,
        }))
        dispatch(
          updateToast(true, 'success', `Configuration for project ${name} imported successfully.`),
        )
      },
      onError: (error: ApiError) => {
        const errorMessage = getErrorMessage(error, 'Invalid JSON file')
        devLogger.error('Error importing config:', error)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const getErrorMessage = (error: ApiError, fallback = 'An error occurred'): string =>
    error instanceof Error ? error.message : error?.message || fallback

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
        const parseError: Error = error instanceof Error ? error : new Error(String(error))
        devLogger.error('Error parsing config data:', parseError)
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

  const handleImportConfig = async (): Promise<void> => {
    let parsedValue: JsonObject | null = null
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result
          if (typeof result !== 'string') return

          parsedValue = JSON.parse(result) as JsonObject
          setConfigDetails((prevState) => ({ ...prevState, isLoading: true }))

          await updateConfigMutation.mutateAsync({
            name,
            data: JSON.stringify(parsedValue),
          })

          await refetchConfig()
        } catch (error) {
          const importError: ApiError = error instanceof Error ? error : { message: String(error) }
          devLogger.error('Error importing config:', importError)
          const errorMessage = getErrorMessage(importError, 'Invalid JSON file')
          dispatch(updateToast(true, 'error', errorMessage))
        } finally {
          setConfigDetails((prevState) => ({
            ...prevState,
            isLoading: false,
          }))
        }
      }
      reader.onerror = () => {
        devLogger.error('Error reading file')
        dispatch(updateToast(true, 'error', 'Failed to read file'))
        setConfigDetails((prevState) => ({
          ...prevState,
          isLoading: false,
        }))
      }
      reader.readAsText(file, 'utf-8')
    }
    input.click()
    setTimeout(() => {
      input.remove()
    }, 100)
  }

  const save_data = (data: string): void => {
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
      devLogger.error('Error saving file:', e)
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

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handler()
      }
      e.stopPropagation()
    },
    [handler],
  )

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handler()
      }
    },
    [handler],
  )

  const buttonStyle = {
    minHeight: BUTTON_STYLES.height,
    padding: `${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`,
    borderRadius: BUTTON_STYLES.borderRadius,
    fontSize: BUTTON_STYLES.fontSize,
    fontWeight: BUTTON_STYLES.fontWeight,
    letterSpacing: BUTTON_STYLES.letterSpacing,
  }

  if (!isOpen) return null

  return createPortal(
    <GluuLoader blocking={projectDetails.isLoading || configDetails.isLoading}>
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handler}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        className={`${commitClasses.modalContainer} ${classes.configModalContainer}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="agama-config-modal-title"
      >
        <button
          type="button"
          onClick={handler}
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
            id="agama-config-modal-title"
          >
            {manageConfig
              ? `Manage Configuration for Project ${name}`
              : `Details of project ${name}`}
          </GluuText>

          <div className={classes.modalBody}>
            {projectDetails?.data?.statusCode === 204 && (
              <p>
                Project <b>{name}</b> is still being deployed. Try again in 1 minute.
              </p>
            )}

            {projectDetails.data.statusCode === 200 && (
              <>
                {manageConfig ? (
                  <div className={classes.buttonGroup}>
                    <GluuButton
                      type="button"
                      backgroundColor={themeColors.formFooter.apply.backgroundColor}
                      textColor={themeColors.formFooter.apply.textColor}
                      borderColor={themeColors.formFooter.apply.borderColor}
                      useOpacityOnHover
                      style={buttonStyle}
                      onClick={handleExportSampleConfig}
                    >
                      {t('fields.export_sample_config')}
                    </GluuButton>
                    <GluuButton
                      type="button"
                      backgroundColor={themeColors.formFooter.apply.backgroundColor}
                      textColor={themeColors.formFooter.apply.textColor}
                      borderColor={themeColors.formFooter.apply.borderColor}
                      useOpacityOnHover
                      style={buttonStyle}
                      onClick={handleExportCurrentConfig}
                    >
                      {t('fields.export_current_config')}
                    </GluuButton>
                    <GluuButton
                      type="button"
                      backgroundColor={themeColors.formFooter.apply.backgroundColor}
                      textColor={themeColors.formFooter.apply.textColor}
                      borderColor={themeColors.formFooter.apply.borderColor}
                      useOpacityOnHover
                      style={buttonStyle}
                      onClick={handleImportConfig}
                    >
                      {t('fields.import_configuration')}
                    </GluuButton>
                  </div>
                ) : (
                  <>
                    <Box className={classes.detailText}>
                      {t('fields.version')}:{' '}
                      {projectDetails.data?.details?.projectMetadata?.version ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.description')}:{' '}
                      {projectDetails.data?.details?.projectMetadata?.description ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.deployed_started_on')}: {projectDetails.data?.createdAt ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.deployed_finished_on')}: {projectDetails.data?.finishedAt ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.errors')}: {projectDetails.data?.details?.error ?? 'No'}
                    </Box>
                    <Box mt={2} className={classes.tableWrapper}>
                      <MaterialTable
                        components={{
                          Toolbar: () => null,
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
                      <Box mt={2}>
                        <Box fontSize={16} mb={1} className={classes.detailText}>
                          {t('titles.project_configuration')}
                        </Box>
                        <AceEditor
                          mode={'json'}
                          readOnly={true}
                          theme={aceTheme}
                          fontSize={14}
                          width="100%"
                          height="300px"
                          defaultValue={JSON.stringify(projectConfigs, null, 2)}
                          editorProps={{ $blockScrolling: true }}
                        />
                      </Box>
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>

          <Divider sx={{ mt: 2 }} />

          <div className={classes.modalFooter}>
            {!isEmpty(projectConfigs) && (
              <GluuButton
                type="button"
                backgroundColor={themeColors.formFooter.apply.backgroundColor}
                textColor={themeColors.formFooter.apply.textColor}
                borderColor={themeColors.formFooter.apply.borderColor}
                useOpacityOnHover
                style={buttonStyle}
                onClick={() => !isCopied && copyToClipboard()}
              >
                {isCopied ? t('actions.configuration_copied') : t('actions.copy_configuration')}
              </GluuButton>
            )}
            <GluuButton
              type="button"
              backgroundColor={themeColors.formFooter.cancel.backgroundColor}
              textColor={themeColors.formFooter.cancel.textColor}
              borderColor={themeColors.formFooter.cancel.borderColor}
              useOpacityOnHover
              style={buttonStyle}
              onClick={handler}
            >
              {t('actions.close')}
            </GluuButton>
          </div>
        </div>
      </div>
    </GluuLoader>,
    document.body,
  )
}

export default AgamaProjectConfigModal
