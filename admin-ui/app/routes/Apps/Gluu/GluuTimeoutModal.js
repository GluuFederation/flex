import React from 'react'

const GluuTimeoutModal = ({ message = '', description = '' }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999
      }}
    >
      <img
        src={require('Images/logos/logo192.png')}
        style={{
          width: '260px',
          height: 'auto',
          marginBottom: 50,
        }}
      />
      <h2 style={{ color: 'white' }}>{message}</h2>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      <button
        style={{
          border: 0,
          backgroundColor: 'transparent',
          color: 'white',
          textDecoration: 'underline',
        }}
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  )
}

export default GluuTimeoutModal
