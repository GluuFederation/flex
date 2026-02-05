import React, { useCallback, useContext, useEffect, useState, useMemo, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Button, Typography } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { uploadNewSsaToken } from '../redux/actions'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import customColors from '@/customColors'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'

interface RootState {
  licenseReducer: {
    isLoading: boolean
    errorSSA: string | null
  }
}

interface ThemeColors {
  background: string
  labelColor: string
  dropzoneBg: string
  dropzoneBorder: string
  dropzoneText: string
}

const LIGHT_THEME: ThemeColors = {
  background: customColors.white,
  labelColor: customColors.primaryDark,
  dropzoneBg: customColors.cedarInfoBgLight,
  dropzoneBorder: customColors.cedarInfoBorderLight,
  dropzoneText: customColors.cedarInfoTextLight,
}

const DARK_THEME: ThemeColors = {
  background: customColors.darkBackground,
  labelColor: customColors.white,
  dropzoneBg: customColors.cedarCardBgDark,
  dropzoneBorder: customColors.cedarCardBorderDark,
  dropzoneText: customColors.cedarTextTertiaryDark,
}

const CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  paddingTop: 45,
}

const LOGO_WRAPPER_STYLE: React.CSSProperties = {
  marginBottom: 45,
}

const CONTENT_STYLE: React.CSSProperties = {
  width: '100%',
  maxWidth: 1170,
  padding: '0 40px',
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily,
  fontSize: fontSizes.base,
  fontWeight: fontWeights.semiBold,
  letterSpacing: '0.3px',
  marginBottom: 12,
}

const DROPZONE_STYLE: React.CSSProperties = {
  height: 100,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
}

const DROPZONE_TEXT_STYLE: React.CSSProperties = {
  fontFamily,
  fontSize: fontSizes.sm,
  fontWeight: fontWeights.medium,
  lineHeight: '22px',
}

const BUTTON_STYLE: React.CSSProperties = {
  marginTop: 20,
  height: 40,
  minWidth: 100,
  borderRadius: 6,
  backgroundColor: customColors.statusActive,
  color: customColors.white,
  fontFamily,
  fontSize: fontSizes.sm,
  fontWeight: fontWeights.bold,
  letterSpacing: '0.28px',
  textTransform: 'none',
  boxShadow: 'none',
}

const ERROR_STYLE: React.CSSProperties = {
  fontFamily,
  fontSize: fontSizes.sm,
  color: customColors.statusInactive,
  marginTop: 8,
}

const UploadSSA: React.FC = memo(function UploadSSA() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK

  const themeColors = useMemo(() => (isDark ? DARK_THEME : LIGHT_THEME), [isDark])

  const isLoading = useSelector((state: RootState) => state.licenseReducer.isLoading)
  const error = useSelector((state: RootState) => state.licenseReducer.errorSSA)

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jwt, setJWT] = useState<string | null>(null)

  const readJWTFile = useCallback(() => {
    if (!selectedFile) return

    const reader = new FileReader()
    reader.onload = () => {
      const token = reader.result as string
      setJWT(token)
    }
    const blob = new Blob([selectedFile])
    reader.readAsText(blob)
  }, [selectedFile])

  useEffect(() => {
    if (selectedFile) {
      readJWTFile()
    }
  }, [selectedFile, readJWTFile])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFileName(file.name)
      setSelectedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/jwt': ['.jwt'],
    },
    multiple: false,
  })

  const submitData = useCallback(() => {
    if (selectedFile && jwt) {
      dispatch(uploadNewSsaToken({ payload: { ssa: jwt } }))
    }
  }, [selectedFile, jwt, dispatch])

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      ...CONTAINER_STYLE,
      backgroundColor: themeColors.background,
    }),
    [themeColors.background],
  )

  const labelStyle = useMemo<React.CSSProperties>(
    () => ({
      ...LABEL_STYLE,
      color: themeColors.labelColor,
    }),
    [themeColors.labelColor],
  )

  const dropzoneStyle = useMemo<React.CSSProperties>(
    () => ({
      ...DROPZONE_STYLE,
      backgroundColor: themeColors.dropzoneBg,
      border: `1px solid ${themeColors.dropzoneBorder}`,
      borderColor: isDragActive ? customColors.statusActive : themeColors.dropzoneBorder,
    }),
    [themeColors.dropzoneBg, themeColors.dropzoneBorder, isDragActive],
  )

  const dropzoneTextStyle = useMemo<React.CSSProperties>(
    () => ({
      ...DROPZONE_TEXT_STYLE,
      color: themeColors.dropzoneText,
    }),
    [themeColors.dropzoneText],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <Box style={containerStyle}>
        <Box style={LOGO_WRAPPER_STYLE}>
          <LogoThemed checkTheme />
        </Box>

        <Box style={CONTENT_STYLE}>
          <Typography style={labelStyle}>{t('messages.please_upload_ssa')}</Typography>

          <Box {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} />
            <Typography style={dropzoneTextStyle}>
              {selectedFileName ? (
                <strong>
                  {t('messages.selected_file')}: {selectedFileName}
                </strong>
              ) : (
                t('messages.drag_drop_jwt')
              )}
            </Typography>
          </Box>

          {error && <Typography style={ERROR_STYLE}>{error}</Typography>}

          <Button
            variant="contained"
            style={BUTTON_STYLE}
            onClick={submitData}
            disabled={isLoading || !selectedFile}
          >
            {t('actions.submit')}
          </Button>
        </Box>
      </Box>
    </GluuLoader>
  )
})

export default UploadSSA
