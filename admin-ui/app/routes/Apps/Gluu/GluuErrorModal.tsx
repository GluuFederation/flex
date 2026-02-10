import customColors from '@/customColors'
import { useAppSelector } from '@/redux/hooks'
import logo192 from 'Images/logos/logo192.png'

function GluuErrorModal({ message = '', description = '' }) {
  const { authServerHost } = useAppSelector((state) => state.authReducer.config)

  const handleRefresh = () => {
    const host = authServerHost ? `${authServerHost}/admin` : null

    if (host) {
      window.location.href = host
    } else {
      window.location.reload()
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: customColors.black,
        color: customColors.white,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <img
        src={logo192}
        style={{
          width: '260px',
          height: 'auto',
          marginBottom: 50,
        }}
      />
      <h2 style={{ color: customColors.white }}>{message}</h2>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      <button
        style={{
          border: 0,
          backgroundColor: 'transparent',
          color: customColors.white,
          textDecoration: 'underline',
        }}
        onClick={handleRefresh}
      >
        Try Again
      </button>
    </div>
  )
}

export default GluuErrorModal
