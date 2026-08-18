import { Box } from '@mui/material'
import { useAppSelector } from '@/redux/hooks'
import logo192 from 'Images/logos/logo192.png'
import backendDown from 'Images/backend-down.png'
import { useStyles } from './styles/GluuServiceDownModal.style'

interface GluuServiceDownModalProps {
  message?: string
  statusCode?: number | string
}

const GluuServiceDownModal = ({ message = '', statusCode }: GluuServiceDownModalProps) => {
  const { authServerHost } = useAppSelector((state) => state.authReducer.config)
  const { classes } = useStyles()

  const handleRefresh = () => {
    const host = authServerHost ? `${authServerHost}/admin` : null

    if (host) {
      window.location.href = host
    } else {
      window.location.reload()
    }
  }

  return (
    <Box className={classes.overlay}>
      <Box className={classes.logoCorner}>
        <img src={logo192} className={classes.logo} />
      </Box>
      <div className={classes.content}>
        <img src={backendDown} className={classes.illustration} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column',
            gap: 2,
            maxWidth: { sm: '100%', md: '70%' },
          }}
        >
          {statusCode ? <h2 className={classes.heading}>Error code: {statusCode}</h2> : null}
          <h3 className={classes.heading}>{message}</h3>
          <button className={classes.retryButton} onClick={handleRefresh}>
            Try Again
          </button>
        </Box>
      </div>
    </Box>
  )
}

export default GluuServiceDownModal
