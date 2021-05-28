import React from 'react'
import { Container } from './../components'
import GluuNotification from './../routes/Apps/Gluu/GluuNotification'

function ViewRedirect({ backendIsUp }) {
  return (
    <React.Fragment>
      <Container>
        <div
          style={{
            backgroundColor: 'white',
            margin: 'auto',
            marginTop: '20%',
          }}
        >
          <img
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginTop: 'auto',
              marginRight: 'auto',
              width: '100%',
              height: '100%',
            }}
            src={require('../images/gif/npe-redirecting.gif')}
            alt="loading..."
          />
          {!backendIsUp && (
            <GluuNotification
              type="error"
              message="The UI backend service is down"
              description="Please contact the side administrator or make sure it is up and running."
              show={true}
            />
          )}
        </div>
      </Container>
    </React.Fragment>
  )
}
export default ViewRedirect
