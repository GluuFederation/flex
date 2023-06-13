import React from 'react'
import logo from 'Images/logos/logo192.png'
import { useSelector } from 'react-redux'
import './style.css'
import { Box, useMediaQuery } from '@mui/material'
import GenerateLicenseCard from './GenerateLicenseCard'
import LicenseKeyCards from './LicenseKeyCards'

function ApiKey() {
  const isMobileDevice = useMediaQuery('(max-width:680px)')
  const serverError = useSelector((state) => state.licenseReducer.error)
  const isLoading = useSelector((state) => state.licenseReducer.isLoading)
  const generatingTrialKey = useSelector(
    (state) => state.licenseReducer.generatingTrialKey
  )

  return (
    <div>
      {(isLoading || generatingTrialKey) && (
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
          <div style={{color: '#00a361'  }} className='col-md-8 text-center h2 mx-auto mb-3'>
            Welcome to Admin UI
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
            gap={4}
            flexWrap={isMobileDevice && 'wrap'}
            className='mx-auto col-md-8'
          >
            <GenerateLicenseCard />
            <LicenseKeyCards />
          </Box>
        </Box>
      </div>
    </div>
  )
}
export default ApiKey
