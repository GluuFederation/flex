import React from 'react'
import logo from 'Images/logos/logo192.png'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import BlockUi from '../../components/BlockUi/BlockUi'
import { useTranslation } from 'react-i18next'
import GenerateLicenseCard from './GenerateLicenseCard'
import { useStyles } from './ApiKey.style'

interface LicenseReducerState {
  error: string
  isLoading: boolean
  generatingTrialKey: boolean
}

interface RootState {
  licenseReducer: LicenseReducerState
}

function ApiKey() {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const serverError = useSelector((state: RootState) => state.licenseReducer.error)
  const isLoading = useSelector((state: RootState) => state.licenseReducer.isLoading)
  const generatingTrialKey = useSelector(
    (state: RootState) => state.licenseReducer.generatingTrialKey,
  )
  const isBlocking = isLoading || generatingTrialKey

  return (
    <BlockUi
      tag="div"
      blocking={isBlocking}
      keepInView={true}
      renderChildren={true}
      message={t('messages.request_waiting_message')}
    >
      <div className="container text-dark">
        <div className="row">
          <div className="col-md-12 text-center my-5">
            <img src={logo} className={`img-fluid ${classes.licenseScreenLogo}`} />
          </div>
        </div>
        <div className="row">
          <div className={`col-md-8 text-center h2 mx-auto mb-3 ${classes.licenseScreenTitle}`}>
            Welcome to Admin UI
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 text-center text-danger mx-auto mb-3">{serverError}</div>
        </div>

        <Box className={`row mt-3 ${classes.licenseCardWrapper}`}>
          <Box className="mx-auto col-md-8">
            <GenerateLicenseCard />
          </Box>
        </Box>
      </div>
    </BlockUi>
  )
}
export default ApiKey
