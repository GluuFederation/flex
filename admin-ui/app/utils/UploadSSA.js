import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Container } from 'Components'
import { useDropzone } from 'react-dropzone'
import logo from 'Images/logos/logo192.png'
import { Button } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { uploadNewSsaToken } from '../redux/actions'
import './LicenseScreens/style.css'
function UploadSSA() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const isLoading = useSelector((state) => state.licenseReducer.isLoading)
  const error = useSelector((state) => state.licenseReducer.errorSSA)

  const [selectedFileName, setSelectedFileName] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
    const [jwt, setJWT] = useState(null)


  const readJWTFile = () => {
    const reader = new FileReader()

    reader.onload = () => {
      const token = reader.result
      setJWT(token)
    }

    const blob = new Blob([selectedFile])
    reader.readAsText(blob)
  }

  useEffect(() => {
    if(selectedFile){
        readJWTFile();
    }
  },[selectedFile])


  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    setSelectedFileName(file.name)
    setSelectedFile(file)
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
    if(selectedFile){
        dispatch(uploadNewSsaToken({ssa:jwt}))
    }
  }

  return (
    <React.Fragment>
      <Container>
      {isLoading && (
        <div className="loader-outer">
          <div className="loader"></div>
        </div>
      )}
        <div className="row">
          <div className="col-md-12 text-center mt-5 mb-5">
            <img
              src={logo}
              style={{ maxWidth: '200px' }}
              className="img-fluid"
            />
          </div>
          <div className="col-md-12">
            <div>Please upload ssa here :</div>
            <div
              {...getRootProps1()}
              className={isDragActive1 ? 'active' : 'dropzone'}
            >
              <input {...getInputProps1()} />
              {selectedFileName ? (
                <strong>Selected File : {selectedFileName}</strong>
              ) : (
                <p>Drag 'n' drop .jwt file here, or click to select file</p>
              )}
            </div>
            <div className='text-sm text-danger'>
                {error}
            </div>
            <div className="mt-4">
              <Button
                disabled={isLoading}
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                onClick={() => submitData()}
              >
                {t('actions.submit')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </React.Fragment>
  )
}
export default UploadSSA
