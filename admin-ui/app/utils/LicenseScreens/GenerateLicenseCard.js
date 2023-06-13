import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { generateTrialLicense } from '../../redux/actions'
import { useMediaQuery } from '@mui/material'

const GenerateLicenseCard = () => {
  const dispatch = useDispatch()
  const isMobileDevice = useMediaQuery('(max-width:680px)')
  const isLoading = useSelector((state) => state.licenseReducer.isLoading)
  const generatingTrialKey = useSelector(
    (state) => state.licenseReducer.generatingTrialKey
  )

  const generateLicenseKey = () => {
    dispatch(generateTrialLicense())
  }

  return (
    <Card sx={{ minWidth: 275, width: isMobileDevice ? '100%' : '50%', border: '1px solid #00a361', padding: '8px' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Free Trial
        </Typography>
        <Typography>
          Start your free trial to manage and configure your Auth Server using simplified web interface.
        </Typography>
      </CardContent>
      <CardActions style={{ padding: '0 16px 16px 16px' }}>
        <button
          type='button'
          disabled={generatingTrialKey}
          onClick={() => generateLicenseKey()}
          className='btn'
          style={{ color: '#00a361', border: '2px solid #00a361' }}
        >
          {generatingTrialKey
            ? 'Generating please wait...'
            : 'Start 30 days trial'}
        </button>
      </CardActions>
    </Card>
  )
}

export default GenerateLicenseCard
