import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components'
import { GluuModalShell } from '@/components/GluuModalShell'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import {
  isDirectoryPath,
  normalizeArchiveDirectoryPath,
  normalizeArchivePath,
} from '@/utils/cjarArchive'
import { useStyles } from '../styles/ArchivePathDialog.style'
import type { ArchivePathDialogProps } from '../types/CedarlingTypes'

const TITLE_ID = 'archive-path-dialog-title'
const INPUT_ID = 'archive-path-dialog-input'

const TITLE_KEYS = {
  file: 'actions.add_file',
  folder: 'actions.add_folder',
  rename: 'actions.rename',
} as const

const SUBMIT_KEYS = {
  file: 'actions.add',
  folder: 'actions.add',
  rename: 'actions.rename',
} as const

const LABEL_KEYS = {
  file: 'documentation.policyStore.filePathLabel',
  folder: 'documentation.policyStore.folderPathLabel',
  rename: 'documentation.policyStore.filePathLabel',
} as const

const REQUIRED_KEYS = {
  file: 'documentation.policyStore.filePathRequired',
  folder: 'documentation.policyStore.folderPathRequired',
  rename: 'documentation.policyStore.filePathRequired',
} as const

const PLACEHOLDER_KEYS = {
  file: 'documentation.policyStore.filePathPlaceholder',
  folder: 'documentation.policyStore.folderPathPlaceholder',
  rename: 'documentation.policyStore.filePathPlaceholder',
} as const

const ArchivePathDialog = ({
  open,
  mode,
  existingPaths,
  initialPath,
  onSubmit,
  onClose,
}: ArchivePathDialogProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })

  const [path, setPath] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setPath(initialPath ?? '')
    setError('')
  }, [open, initialPath])

  const close = useCallback(() => {
    setPath('')
    setError('')
    onClose()
  }, [onClose])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPath(event.target.value)
    setError('')
  }, [])

  const renamingDirectory = mode === 'rename' && isDirectoryPath(initialPath ?? '')

  const handleSubmit = useCallback(() => {
    const asDirectory = mode === 'folder' || renamingDirectory
    const normalized = asDirectory
      ? normalizeArchiveDirectoryPath(path)
      : normalizeArchivePath(path)
    if (!normalized) {
      setError(t(asDirectory ? REQUIRED_KEYS.folder : REQUIRED_KEYS[mode]))
      return
    }
    if (normalized !== initialPath && existingPaths.includes(normalized)) {
      setError(t('documentation.policyStore.fileAlreadyExists'))
      return
    }
    setPath('')
    setError('')
    onSubmit(normalized)
  }, [mode, renamingDirectory, path, initialPath, existingPaths, onSubmit, t])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  if (!open) {
    return null
  }

  return (
    <GluuModalShell
      onClose={close}
      ariaLabelledBy={TITLE_ID}
      containerClassName={classes.modalContainer}
      contentClassName={classes.contentArea}
    >
      <GluuText variant="h2" className={classes.title} id={TITLE_ID}>
        {t(TITLE_KEYS[mode])}
      </GluuText>
      <div className={classes.field}>
        <label className={classes.label} htmlFor={INPUT_ID}>
          {t(renamingDirectory ? LABEL_KEYS.folder : LABEL_KEYS[mode])}
        </label>
        <div className={classes.inputContainer}>
          <input
            id={INPUT_ID}
            type="text"
            className={classes.input}
            value={path}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t(renamingDirectory ? PLACEHOLDER_KEYS.folder : PLACEHOLDER_KEYS[mode])}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${INPUT_ID}-error` : undefined}
            autoFocus
          />
        </div>
      </div>
      <GluuText
        variant="p"
        disableThemeColor
        className={classes.errorMessage}
        id={`${INPUT_ID}-error`}
        role="alert"
      >
        {error || ' '}
      </GluuText>
      <div className={`${commitClasses.buttonRow} ${classes.buttonRow}`}>
        <GluuButton
          onClick={handleSubmit}
          backgroundColor={themeColors.formFooter.back.backgroundColor}
          textColor={themeColors.formFooter.back.textColor}
          borderColor="transparent"
          padding="8px 28px"
          minHeight="40"
          useOpacityOnHover
          className={commitClasses.yesButton}
        >
          {t(SUBMIT_KEYS[mode])}
        </GluuButton>
      </div>
    </GluuModalShell>
  )
}

export default React.memo(ArchivePathDialog)
