// @ts-nocheck
import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { generateTrialLicense } from '../../redux/actions'
import { useStyles } from './GenerateLicenseCard.style'

const GenerateLicenseCard = () => {
  const { classes } = useStyles()
  const dispatch = useDispatch()
  const generatingTrialKey = useSelector((state) => state.licenseReducer.generatingTrialKey)

  const generateLicenseKey = () => {
    dispatch(generateTrialLicense())
  }

  return (
    <Card className={classes.licenseCard}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Free Trial
        </Typography>
        <Typography>
          Start your free trial to manage and configure your Auth Server using simplified web
          interface.
        </Typography>
      </CardContent>
      <CardActions className={classes.licenseCardActions}>
        <button
          type="button"
          disabled={generatingTrialKey}
          onClick={() => generateLicenseKey()}
          className={`btn ${classes.licenseGenerateBtn}`}
        >
          {generatingTrialKey ? 'Generating please wait...' : 'Start 30 days trial'}
        </button>
      </CardActions>
    </Card>
  )
}

export default GenerateLicenseCard
