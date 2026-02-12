import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Container } from 'Components'
import { useDropzone } from 'react-dropzone'
import logo from 'Images/logos/logo192.png'
import { Button } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { uploadNewSsaToken } from '../redux/actions'
import type { RootState } from '@/redux/types'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import useStyles from './styles/UploadSSA.style'

function UploadSSA() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })
  const pageStyle: React.CSSProperties = useMemo(
    () => ({
      minHeight: '100vh',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      backgroundColor: themeColors.background,
    }),
    [themeColors.background],
  )
  const isLoading = useSelector((state: RootState) => state.licenseReducer.isLoading)
  const error = useSelector((state: RootState) => state.licenseReducer.errorSSA)

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jwt, setJWT] = useState<string | null>(null)

  const readJWTFile = useCallback(() => {
    if (!selectedFile) return
    const reader = new FileReader()

    reader.onload = () => {
      const token = reader.result
      setJWT(typeof token === 'string' ? token : null)
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
  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({
    onDrop: onDrop,
    accept: {
      'application/jwt': ['.jwt'],
    },
  })

  const submitData = () => {
    if (selectedFile) {
      dispatch(uploadNewSsaToken({ payload: { ssa: jwt } }))
    }
  }

  return (
    <div style={pageStyle}>
      <Container>
        {isLoading && (
          <div className={classes.loaderOuter}>
            <div className={classes.loader} />
          </div>
        )}
        <div className="row">
          <div className="col-md-12 text-center mt-5 mb-5">
            <img src={logo} className={`img-fluid ${classes.logo}`} alt="Logo" />
          </div>
          <div className="col-md-12">
            <div className={classes.label}>Please upload ssa here :</div>
            <div
              {...getRootProps1()}
              className={`${isDragActive1 ? 'active' : 'dropzone'} ${classes.dropzone}`}
            >
              <input {...getInputProps1()} />
              {selectedFileName ? (
                <strong className={classes.dropzoneText}>Selected File : {selectedFileName}</strong>
              ) : (
                <p className={classes.dropzoneText}>
                  Drag &apos;n&apos; drop .jwt file here, or click to select file
                </p>
              )}
            </div>
            {error && <div className={classes.error}>{error}</div>}
            <div className="mt-4">
              <Button disabled={isLoading} className={classes.button} onClick={() => submitData()}>
                {t('actions.submit')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
export default UploadSSA
