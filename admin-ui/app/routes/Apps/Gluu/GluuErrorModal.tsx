// @ts-nocheck
import React from 'react'
import { useSelector } from 'react-redux'

function GluuErrorModal({ message = '', description = '' }) {
  const { authServerHost } = useSelector((state) => state.authReducer.config)

  const handleRefresh = () => {
    const host = authServerHost ? `${authServerHost}/admin` : null

    if(host) {
      window.location.href = host
    } else {
      window.location.reload()
    }
  };

  return (
    <div style={{ position:"absolute", top:0, bottom:0, right:0, left:0, backgroundColor:"rgba(0,0,0,0.8)", color:"white", justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column" }}>
      <img
        src={require('Images/logos/logo192.png')}
        style={{
          width: '260px',
          height: 'auto',
          marginBottom:50,
        }}
      />
      <h2 style={{ color:"white" }}>{message}</h2>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      <button
        style={{
          border:0,
          backgroundColor:"transparent",
          color:"white",
          textDecoration:"underline"
        }}
        onClick={handleRefresh}
      >
        Try Again
      </button>
    </div>
  )
}

export default GluuErrorModal