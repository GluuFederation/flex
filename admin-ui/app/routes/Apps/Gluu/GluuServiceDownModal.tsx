import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

function GluuServiceDownModal({ message = '', statusCode }: any) {
  const { authServerHost } = useSelector((state: any) => state.authReducer.config)

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
        backgroundColor: '#110000',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
        <img
          src={require('Images/logos/logo192.png')}
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
          color: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          maxWidth: '60%',
          maxHeight: '60%',
          margin: 'auto',
          gap: '40px',
          flexWrap: 'wrap'
        }}
      > 
        <img
          src={require('Images/backend-down.png')}
          style={{
            width: 'auto',
            height: 'auto',
            fill: '#fff'
          }}
        />
        <Box display='flex' alignItems='start' flexDirection='column' gap={2} maxWidth={{ sm: '100%', md: '70%' }}>
          {statusCode ? <h2 style={{ color: 'white', fontWeight: 'bolder', }}>Error code: {statusCode}</h2> : null}
          <h3
            style={{
              color: 'white',
              fontWeight: 'bolder',
            }}
          >
            {message}
          </h3>
          <button
            style={{
              border: 0,
              backgroundColor: 'transparent',
              color: 'white',
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
