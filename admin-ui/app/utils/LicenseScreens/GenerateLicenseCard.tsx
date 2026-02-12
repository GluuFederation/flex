import React, { useContext, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import type { RootState } from '@/redux/types'
import useStyles from '../styles/GenerateLicenseCard.style'
import { generateTrialLicense } from '../../redux/actions'

function GenerateLicenseCard() {
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })
  const generatingTrialKey = useSelector(
    (state: RootState) => state.licenseReducer.generatingTrialKey,
  )

  const handleGenerate = () => {
    dispatch(generateTrialLicense())
  }

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography className={classes.title} component="div" gutterBottom>
          Free Trial
        </Typography>
        <Typography className={classes.description}>
          Start your free trial to manage and configure your Auth Server using simplified web
          interface.
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <button
          type="button"
          disabled={generatingTrialKey}
          onClick={handleGenerate}
          className={classes.button}
        >
          {generatingTrialKey ? 'Generating please wait...' : 'Start 30 days trial'}
        </button>
      </CardActions>
    </Card>
  )
}

export default GenerateLicenseCard
