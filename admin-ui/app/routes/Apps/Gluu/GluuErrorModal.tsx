import { useAppSelector } from '@/redux/hooks'
import logo192 from 'Images/logos/logo192.png'
import { buildSafeNavigationUrl } from '@/utils/urlSecurity'
import { useStyles } from './styles/GluuErrorModal.style'

const GluuErrorModal = ({ message = '', description = '' }) => {
  const { authServerHost } = useAppSelector((state) => state.authReducer.config)
  const { classes } = useStyles()

  const handleRefresh = () => {
    const host = buildSafeNavigationUrl('/admin', {
      baseUrl: typeof authServerHost === 'string' ? authServerHost : undefined,
    })

    if (host) {
      window.location.href = host
    } else {
      window.location.reload()
    }
  }

  return (
    <div className={classes.overlay}>
      <img src={logo192} className={classes.logo} />
      <h2 className={classes.message}>{message}</h2>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      <button className={classes.retryButton} onClick={handleRefresh}>
        Try Again
      </button>
    </div>
  )
}

export default GluuErrorModal
