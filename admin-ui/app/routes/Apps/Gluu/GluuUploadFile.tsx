import type { MouseEvent } from 'react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDropzone, type Accept } from 'react-dropzone'
import { Box } from '@mui/material'
import { Button } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'

interface GluuUploadFileProps {
  accept?: Accept
  onDrop: (files: File[]) => void
  placeholder: string
  onClearFiles: () => void
  disabled?: boolean
  fileName?: string | null
  showClearButton?: boolean
}

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
  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => {
    return theme?.state?.theme || 'light'
  }, [theme?.state?.theme])

  const [preDefinedFileName, setPreDefinedFileName] = useState<string | null>(fileName || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    setPreDefinedFileName(fileName || null)
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

  const clearFiles = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setSelectedFile(null)
      setPreDefinedFileName(null)
      onClearFiles()
    },
    [onClearFiles],
  )

  return (
    <div className="col-md-12">
      <div {...getRootProps1()} className={isDragActive1 ? 'active' : 'dropzone'}>
        <input {...getInputProps1()} />
        {selectedFile || preDefinedFileName ? (
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
              <strong>{selectedFile?.name || preDefinedFileName}</strong>
              {selectedFile ? (
                <p className="m-0">({((selectedFile?.size || 0) / 1000).toFixed(0)}K)</p>
              ) : null}
            </Box>
            {showClearButton && (
              <Button color={`primary-${selectedTheme}`} onClick={clearFiles}>
                <i className="fa fa-remove me-2"></i>
                Clear
              </Button>
            )}
          </Box>
        ) : (
          <p className="m-0">{placeholder}</p>
        )}
      </div>
    </div>
  )
}

export default GluuUploadFile
