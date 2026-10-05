import logo192 from 'Images/logos/logo192.png'
import { buildAppRootUrl } from '@/helpers/navigation'
import type { GluuErrorModalProps } from './types'
import { useStyles } from './styles/GluuErrorModal.style'

const GluuErrorModal = ({
  message = '',
  description = '',
  onRetry,
  retryLabel = 'Try Again',
}: GluuErrorModalProps) => {
  const { classes } = useStyles()

  const handleRefresh = () => {
    if (onRetry) {
      onRetry()
      return
    }

    window.location.href = buildAppRootUrl()
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
