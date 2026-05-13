import type { MouseEvent } from 'react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone, type Accept } from 'react-dropzone'
import { Box } from '@mui/material'
import { DeleteOutline } from '@/components/icons'
import { Button } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import { DEFAULT_THEME } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useStyles } from './styles/GluuUploadFile.style'
import type { GluuUploadFileProps } from './types'

const DEFAULT_ACCEPT: Accept = {
  'application/jwt': ['.jwt'],
}

const GluuUploadFile: React.FC<GluuUploadFileProps> = ({
  accept = DEFAULT_ACCEPT,
  onDrop,
  placeholder,
  onClearFiles,
  disabled = false,
  fileName = null,
  showClearButton = true,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => {
    return theme?.state?.theme || DEFAULT_THEME
  }, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [preDefinedFileName, setPreDefinedFileName] = useState<string | null>(fileName || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { classes } = useStyles({
    fontColor: themeColors.fontColor,
    removeColor: themeColors.errorColor,
    removeDisabled: disabled,
  })

  useEffect(() => {
    setPreDefinedFileName(fileName || null)
    if (!fileName) {
      setSelectedFile(null)
    }
  }, [fileName])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const [file] = acceptedFiles
      if (!file) return
      setSelectedFile(file)
      onDrop([file])
    },
    [onDrop],
  )

  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({
    onDrop: handleDrop,
    accept,
    disabled,
  })

  const clearFiles = useCallback(() => {
    setSelectedFile(null)
    setPreDefinedFileName(null)
    onClearFiles()
  }, [onClearFiles])

  const hasFile = Boolean(selectedFile || preDefinedFileName)
  const dropzoneClassName = [
    isDragActive1 ? 'active' : 'dropzone',
    hasFile ? classes.dropzoneWithFile : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes.root}>
      <div {...getRootProps1({ className: dropzoneClassName })}>
        <input {...getInputProps1()} />
        {hasFile ? (
          <Box className={classes.fileRow}>
            <Box className={classes.fileInfo}>
              <strong className={classes.fileName}>
                {selectedFile?.name || preDefinedFileName}
              </strong>
              {selectedFile && (
                <Box component="span" className={classes.fileSize}>
                  (
                  {(selectedFile.size || 0) < 1024
                    ? `${selectedFile.size} Bytes`
                    : `${(selectedFile.size / 1024).toFixed(0)} KiB`}
                  )
                </Box>
              )}
            </Box>
            {showClearButton && (
              <Box className={classes.removeWrap}>
                <Button
                  type="button"
                  size="sm"
                  className={`${classes.removeButton} gluu-upload-remove`}
                  disabled={disabled}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    clearFiles()
                  }}
                >
                  <DeleteOutline fontSize="small" className={classes.removeIcon} />
                  {t('actions.remove')}
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <p className={classes.placeholder}>{placeholder}</p>
        )}
      </div>
    </div>
  )
}

export default GluuUploadFile
