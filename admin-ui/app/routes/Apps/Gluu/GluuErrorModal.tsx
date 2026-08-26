import { useAppSelector } from '@/redux/hooks'
import logo192 from 'Images/logos/logo192.png'
import { buildSafeNavigationUrl } from '@/utils/urlSecurity'
import type { GluuErrorModalProps } from './types'
import { useStyles } from './styles/GluuErrorModal.style'

const GluuErrorModal = ({
  message = '',
  description = '',
  onRetry,
  retryLabel = 'Try Again',
}: GluuErrorModalProps) => {
  const { authServerHost } = useAppSelector((state) => state.authReducer.config)
  const { classes } = useStyles()

  const handleRefresh = () => {
    if (onRetry) {
      onRetry()
      return
    }

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
      <p className={classes.description} dangerouslySetInnerHTML={{ __html: description }}></p>
      <button className={classes.retryButton} onClick={handleRefresh}>
        {retryLabel}
      </button>
    </div>
  )
}

export default GluuErrorModal
