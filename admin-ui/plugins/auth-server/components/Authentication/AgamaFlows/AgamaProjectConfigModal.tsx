import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Box, Divider } from '@mui/material'
import MaterialTable from '@material-table/core'
import type { Column } from '@material-table/core'
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
  JsonObject,
  ApiError,
} from './types'
import { useAppDispatch } from '@/redux/hooks'
import { getErrorMessage } from './helper'

const buttonStyle = {
  minHeight: BUTTON_STYLES.height,
  padding: `${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`,
  borderRadius: BUTTON_STYLES.borderRadius,
  fontSize: BUTTON_STYLES.fontSize,
  fontWeight: BUTTON_STYLES.fontWeight,
  letterSpacing: BUTTON_STYLES.letterSpacing,
}

const AgamaProjectConfigModal: React.FC<AgamaProjectConfigModalProps> = ({
  isOpen,
  row,
  handler,
  handleUpdateRowData,
  manageConfig = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

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

  const [isCopied, setIsCopied] = useState<boolean>(false)

  const { data: projectDetailsData, isFetching: projectDetailsFetching } = useGetAgamaPrjByName(
    name,
    {
      query: {
        enabled: !!name && isOpen,
      },
    },
  )

  const {
    data: configDetailsData,
    isFetching: configDetailsFetching,
    refetch: refetchConfig,
  } = useGetAgamaPrjConfigs(name, {
    query: {
      enabled: manageConfig && !!name && isOpen,
    },
  })

  const configData = useMemo<JsonObject>(() => {
    if (!configDetailsData) return {}
    try {
      return typeof configDetailsData === 'string'
        ? (JSON.parse(configDetailsData) as JsonObject)
        : (configDetailsData as JsonObject)
    } catch {
      return {}
    }
  }, [configDetailsData])

  const flowErrors = useMemo<FlowError[]>(() => {
    if (!projectDetailsData?.details?.flowsError) return []
    return Object.entries(projectDetailsData.details.flowsError).map(([flow, error]) => ({
      flow,
      error,
    }))
  }, [projectDetailsData])

  const updateConfigMutation = usePutAgamaPrj({
    mutation: {
      onSuccess: () => {
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

  useEffect(() => {
    if (projectDetailsData) {
      handleUpdateRowData(projectDetailsData)
    }
  }, [projectDetailsData, handleUpdateRowData])

  const projectConfigs = projectDetailsData?.details?.projectMetadata?.configs

  useEffect(() => {
    if (!isCopied) return
    const timer = setTimeout(() => setIsCopied(false), 6000)
    return () => clearTimeout(timer)
  }, [isCopied])

  const copyToClipboard = (): void => {
    setIsCopied(true)
    navigator.clipboard.writeText(JSON.stringify(projectConfigs, null, 2))
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
        }
      }
      reader.onerror = () => {
        devLogger.error('Error reading file')
        dispatch(updateToast(true, 'error', 'Failed to read file'))
      }
      reader.readAsText(file, 'utf-8')
    }
    document.body.appendChild(input)
    input.click()
    setTimeout(() => {
      document.body.removeChild(input)
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
    if (isEmpty(configData)) {
      dispatch(updateToast(true, 'error', `No configurations defined for ${name}`))
      return
    }
    save_data(JSON.stringify(configData))
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

  const tableComponents = useMemo(() => ({ Toolbar: () => null }), [])
  const tableOptions = useMemo(() => ({ search: false, selection: false, paging: false }), [])

  if (!isOpen) return null

  return createPortal(
    <GluuLoader blocking={projectDetailsFetching || configDetailsFetching || updateConfigMutation.isPending}>
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
              ? t('titles.agama_manage_config_title', { name })
              : t('titles.agama_project_details_title', { name })}
          </GluuText>

          <div className={classes.modalBody}>
            {!projectDetailsFetching && !projectDetailsData && isOpen && (
              <p>{t('messages.agama_project_deploying', { name })}</p>
            )}

            {!!projectDetailsData && (
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
                      {projectDetailsData?.details?.projectMetadata?.version ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.description')}:{' '}
                      {projectDetailsData?.details?.projectMetadata?.description ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.deployed_started_on')}: {projectDetailsData?.createdAt ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.deployed_finished_on')}: {projectDetailsData?.finishedAt ?? '-'}
                    </Box>
                    <Box className={classes.detailText}>
                      {t('fields.errors')}: {projectDetailsData?.details?.error ?? 'No'}
                    </Box>
                    <Box mt={2} className={classes.tableWrapper}>
                      <MaterialTable
                        components={tableComponents}
                        columns={tableColumns}
                        data={flowErrors}
                        isLoading={projectDetailsFetching}
                        title=""
                        options={tableOptions}
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
