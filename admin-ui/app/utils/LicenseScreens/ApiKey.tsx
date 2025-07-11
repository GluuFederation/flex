// @ts-nocheck
import React from 'react'
import logo from 'Images/logos/logo192.png'
import { useSelector } from 'react-redux'
import './style.css'
import { Box } from '@mui/material'
import GenerateLicenseCard from './GenerateLicenseCard'

function ApiKey() {
  const serverError = useSelector((state) => state.licenseReducer.error)
  const isLoading = useSelector((state) => state.licenseReducer.isLoading)
  const generatingTrialKey = useSelector((state) => state.licenseReducer.generatingTrialKey)

  return (
    <div>
      {(isLoading || generatingTrialKey) && (
        <div className="loader-outer">
          <div className="loader"></div>
        </div>
      )}
      <div className="container text-dark">
        <div className="row">
          <div className="col-md-12 text-center my-5">
            <img src={logo} className="img-fluid license-screen-logo" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 text-center h2 mx-auto mb-3 license-screen-title">
            Welcome to Admin UI
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 text-center text-danger mx-auto mb-3">{serverError}</div>
        </div>

        <Box className="row mt-3">
          <Box className="mx-auto col-md-8 license-card-wrapper">
            <GenerateLicenseCard />
          </Box>
        </Box>
      </div>
    </div>
  )
}
export default ApiKey
