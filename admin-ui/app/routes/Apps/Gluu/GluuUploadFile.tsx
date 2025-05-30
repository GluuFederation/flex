// @ts-nocheck
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { Button } from 'reactstrap'

const GluuUploadFile = ({
  accept = {
    'application/jwt': ['.jwt'],
  },
  onDrop,
  placeholder,
  onClearFiles,
  disabled,
  fileName,
}) => {
  const [preDefinedFileName, setPreDefinedFileName] = useState(fileName || null)
  const [selectedFile, setSelectedFile] = useState(null)
  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    setSelectedFile(file)
    onDrop(acceptedFiles)
  }, [])

  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({
    onDrop: handleDrop,
    accept,
    disabled,
  })

  const clearFiles = useCallback((event) => {
    event.stopPropagation()
    setSelectedFile(null)
    onClearFiles()
    setPreDefinedFileName(null)
  }, [])

  return (
    <div className='col-md-12'>
      <div
        {...getRootProps1()}
        className={isDragActive1 ? 'active' : 'dropzone'}
      >
        <input {...getInputProps1()} />
        {(selectedFile || preDefinedFileName) ? (
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Box
              display='flex'
              justifyContent='flex-start'
              alignItems='center'
              gap={1}
            >
              <strong>{preDefinedFileName || selectedFile?.name}</strong>
              {selectedFile ? (
                <p className='m-0'>
                  ({((selectedFile?.size || 0) / 1000).toFixed(0)}K)
                </p>
              ) : null}
            </Box>
            <Button onClick={clearFiles}>
              <i className='fa fa-remove me-2'></i>
              Clear
            </Button>
          </Box>
        ) : (
          <p className='m-0'>{placeholder}</p>
        )}
      </div>
    </div>
  )
}

export default GluuUploadFile

GluuUploadFile.propTypes = {
  accept: PropTypes.any,
  placeholder: PropTypes.string,
  onDrop: PropTypes.func,
  onClearFiles: PropTypes.func,
  disabled: PropTypes.bool,
  fileName: PropTypes.string,
}
