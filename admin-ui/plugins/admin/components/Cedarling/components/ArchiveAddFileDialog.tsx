import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components'
import { GluuModalShell } from '@/components/GluuModalShell'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { normalizeArchivePath } from '@/utils/cjarArchive'
import { useStyles } from '../styles/ArchiveAddFileDialog.style'
import type { ArchiveAddFileDialogProps } from '../types/CedarlingTypes'

const TITLE_ID = 'archive-add-file-title'
const INPUT_ID = 'archive-add-file-path'

const ArchiveAddFileDialog = ({
  open,
  existingPaths,
  onAdd,
  onClose,
}: ArchiveAddFileDialogProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })

  const [path, setPath] = useState('')
  const [error, setError] = useState('')

  const close = useCallback(() => {
    setPath('')
    setError('')
    onClose()
  }, [onClose])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPath(event.target.value)
    setError('')
  }, [])

  const handleAdd = useCallback(() => {
    const normalized = normalizeArchivePath(path)
    if (!normalized) {
      setError(t('documentation.policyStore.filePathRequired'))
      return
    }
    if (existingPaths.includes(normalized)) {
      setError(t('documentation.policyStore.fileAlreadyExists'))
      return
    }
    setPath('')
    setError('')
    onAdd(normalized)
  }, [path, existingPaths, onAdd, t])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleAdd()
      }
    },
    [handleAdd],
  )

  if (!open) {
    return null
  }

  return (
    <GluuModalShell
      onClose={close}
      ariaLabelledBy={TITLE_ID}
      containerClassName={classes.modalContainer}
    >
      <GluuText variant="h2" className={classes.title} id={TITLE_ID}>
        {t('actions.add_file')}
      </GluuText>
      <div className={classes.inputContainer}>
        <input
          id={INPUT_ID}
          type="text"
          className={classes.input}
          value={path}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('documentation.policyStore.filePathPlaceholder')}
          aria-label={t('documentation.policyStore.filePathLabel')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${INPUT_ID}-error` : undefined}
        />
      </div>
      <GluuText variant="p" className={classes.errorMessage} id={`${INPUT_ID}-error`} role="alert">
        {error || ' '}
      </GluuText>
      <div className={`${commitClasses.buttonRow} ${classes.buttonRow}`}>
        <GluuButton
          onClick={handleAdd}
          backgroundColor={themeColors.formFooter.back.backgroundColor}
          textColor={themeColors.formFooter.back.textColor}
          borderColor="transparent"
          padding="8px 28px"
          minHeight="40"
          useOpacityOnHover
          className={commitClasses.yesButton}
        >
          {t('actions.add')}
        </GluuButton>
      </div>
    </GluuModalShell>
  )
}

export default React.memo(ArchiveAddFileDialog)
