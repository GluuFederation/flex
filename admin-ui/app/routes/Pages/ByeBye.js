import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uuidv4 } from 'Utils/Util'
import { EmptyLayout, Label } from 'Components'
import { logoutUser } from 'Redux/features/logoutSlice'
import { useTranslation } from 'react-i18next'

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    const handlePageHide = (event) => {
        if (event.persisted) {
            // Force reload if the page is restored from bfcache
            window.location.reload();
        }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
        window.removeEventListener("pagehide", handlePageHide);
    };
}, []);
  useEffect(() => {
  
    console.log("config: "+ JSON.stringify(config))
    if (config) {
      console.log("Config has value"+ JSON.stringify(config));
      const state = uuidv4()
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`
      dispatch(logoutUser())
      window.location.href = sessionEndpoint
    }

    dispatch(logoutUser())
  }, [])

  return (
    <div className="fullscreen">
      <EmptyLayout.Section center>
        <Label style={{ fontSize: '2em', fontWeight: 'bold' }}>
          {t('Thanks for using the admin ui')}.
        </Label>
      </EmptyLayout.Section>
    </div>
  )
}

export default ByeBye
