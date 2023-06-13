import React, { useState } from 'react'
import { checkUserLicenceKey } from 'Redux/actions'
import logo from 'Images/logos/logo192.png'
import { useDispatch, useSelector } from 'react-redux'
import './style.css'
import { Box } from '@mui/material'
import { generateTrialLicense } from '../../redux/actions'

function ApiKey() {
  const dispatch = useDispatch()
  const serverError = useSelector((state) => state.licenseReducer.error)
  const isLoading = useSelector((state) => state.licenseReducer.isLoading)
  const generatingTrialKey = useSelector(
    (state) => state.licenseReducer.generatingTrialKey
  )
  const [showLicenseKeyField, setShowLicenseKeyField] = useState(false)

  const [submitted, setIsSubmitted] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')

  const submitLicenseKey = () => {
    setIsSubmitted(true)
    if (licenseKey != '') {
      dispatch(
        checkUserLicenceKey({
          payload: {
            licenseKey: licenseKey
          },
        }),
      )
    }
  }

  const generateLicenseKey = () => {
    setShowLicenseKeyField(false)
    dispatch(generateTrialLicense())
  }

  return (
    <div>
      {isLoading && (
        <div className='loader-outer'>
          <div className='loader'></div>
        </div>
      )}
      <div className='container text-dark'>
        <div className='row'>
          <div className='col-md-12 text-center my-5'>
            <img
              src={logo}
              style={{ maxWidth: '200px' }}
              className='img-fluid'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-8 text-center h2 mx-auto mb-3'>
            Click on the button of your choice
          </div>
        </div>
        <div className='row'>
          <div className='col-md-8 text-center text-danger mx-auto mb-3'>
            {serverError}
          </div>
        </div>

        <Box className='row mt-3'>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'cnter'}
            className='mx-auto col-md-8'
          >
            <button
              type='button'
              disabled={isLoading || generatingTrialKey}
              onClick={() => generateLicenseKey()}
              className='btn'
              style={{ backgroundColor: '#00a361', color: 'white' }}
            >
              {generatingTrialKey
                ? 'Generating please wait...'
                : 'Generate Trial License'}
            </button>
            <button
              type='button'
              disabled={isLoading || generatingTrialKey}
              onClick={() => setShowLicenseKeyField(true)}
              className='btn'
              style={{ backgroundColor: '#00a361', color: 'white' }}
            >
              Already have a license key? Click here to enter.
            </button>
          </Box>
        </Box>

        {showLicenseKeyField && (
          <div className='row mt-4'>
            <div className='col-md-8 mx-auto'>
              <label>License Key*</label>
              <input
                type='text'
                className={
                  submitted && licenseKey == ''
                    ? 'border-danger form-control'
                    : 'form-control'
                }
                value={licenseKey}
                name='apiKey'
                onChange={(e) => setLicenseKey(e.target.value)}
              />
              <div className='text-danger'>
                {submitted && licenseKey == '' && 'This field is required'}
              </div>
              <button
                type='button'
                disabled={isLoading}
                onClick={() => submitLicenseKey()}
                className='btn mt-3'
                style={{ backgroundColor: '#00a361', color: 'white' }}
              >
                {isLoading ? 'Submitting please wait...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ApiKey
