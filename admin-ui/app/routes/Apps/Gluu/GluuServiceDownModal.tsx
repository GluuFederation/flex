import customColors from '@/customColors'
import { Box } from '@mui/material'
import { useAppSelector } from '@/redux/hooks'
import logo192 from 'Images/logos/logo192.png'
import backendDown from 'Images/backend-down.png'

interface GluuServiceDownModalProps {
  message?: string
  statusCode?: number | string
}

function GluuServiceDownModal({ message = '', statusCode }: GluuServiceDownModalProps) {
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
    <Box
      sx={{
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
      <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
        <img
          src={logo192}
          style={{
            width: '120px',
            height: 'auto',
            margin: 50,
          }}
        />
      </Box>

      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          color: customColors.white,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          maxWidth: '60%',
          maxHeight: '60%',
          margin: 'auto',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        <img
          src={backendDown}
          style={{
            width: 'auto',
            height: 'auto',
            fill: customColors.white,
          }}
        />
        <Box
          display="flex"
          alignItems="start"
          flexDirection="column"
          gap={2}
          maxWidth={{ sm: '100%', md: '70%' }}
        >
          {statusCode ? (
            <h2 style={{ color: customColors.white, fontWeight: 'bolder' }}>
              Error code: {statusCode}
            </h2>
          ) : null}
          <h3
            style={{
              color: customColors.white,
              fontWeight: 'bolder',
            }}
          >
            {message}
          </h3>
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
        </Box>
      </div>
    </Box>
  )
}

export default GluuServiceDownModal
