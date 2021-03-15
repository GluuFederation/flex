import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { uuidv4 } from '../../utils/Util'
import { EmptyLayout, Label } from '../../../app/components'
import { logoutUser } from '../../redux/actions/LogoutActions'

function ByeBye({config, dispatch}) {
  useEffect(() => {
    if(!!config){
      const state = uuidv4()
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`;
      window.location.href = sessionEndpoint;
    }
      dispatch(logoutUser())
    
  }, [])
  
  return (
    <div className='fullscreen'>
      <EmptyLayout.Section center>
        <Label style={{ fontSize: '2em', fontWeight: 'bold' }}>
          Thanks for using the admin ui.
        </Label>
      </EmptyLayout.Section>
    </div>
  )
}

const mapStateToProps = (state) => {
    const config = state.authReducer.config

    return {
      config,
    }
}
export default connect(mapStateToProps)(ByeBye)
