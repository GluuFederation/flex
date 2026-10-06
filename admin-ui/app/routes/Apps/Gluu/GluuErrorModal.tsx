import logo192 from 'Images/logos/logo192.png'
import { buildAppRootUrl } from '@/helpers/navigation'
import type { GluuErrorModalProps } from './types'
import { useStyles } from './styles/GluuErrorModal.style'

const GluuErrorModal = ({
  message = '',
  description = '',
  image,
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
      <img src={logo192} alt="Gluu" className={classes.logo} />
      {image && <img src={image} alt="" className={classes.illustration} />}
      {message && <h2 className={classes.message}>{message}</h2>}
      {description && <p className={classes.description}>{description}</p>}
      <button type="button" className={classes.retryButton} onClick={handleRefresh}>
        {retryLabel}
      </button>
    </div>
  )
}

export default GluuErrorModal
