import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { checkUserLicenceKey } from 'Redux/actions'

const LicenseKeyCards = () => {
  const dispatch = useDispatch()
  const [submitted, setIsSubmitted] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')

  const isLoading = useSelector((state) => state.licenseReducer.isLoading)

  const submitLicenseKey = () => {
    setIsSubmitted(true)
    if (licenseKey != '') {
      dispatch(
        checkUserLicenceKey({
          payload: {
            licenseKey: licenseKey
          }
        })
      )
    }
  }

  return (
    <Card className='license-card'>
      <CardContent>
        <Typography variant='h5' component='div' gutterBottom>
          Have a license key?
        </Typography>
        <Typography>
          Already have the license-key issued by Gluu? Submit the key here to
          reach your digital destination.
        </Typography>
        <div className='row mt-4'>
          <div className='col-md-12'>
            <input
              type='text'
              className={
                submitted && licenseKey == ''
                  ? 'border-danger form-control'
                  : 'form-control'
              }
              placeholder='Enter license key'
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
              className='btn mt-2 license-submit-btn' 
            >
              {isLoading ? 'Submitting please wait...' : 'Submit'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LicenseKeyCards
