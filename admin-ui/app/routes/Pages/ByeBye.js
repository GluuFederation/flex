import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uuidv4 } from "Utils/Util";
import { EmptyLayout, Label } from "Components";
import { logoutUser } from "Redux/features/logoutSlice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Navigate } from 'react-router-dom';
import { setAuthState } from "../../redux/features/authSlice";

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config);
  const { userinfo } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("config: " + JSON.stringify(config));
    dispatch(setAuthState(false));
    if (config && Object.keys(config).length > 0) {
      const state = uuidv4();
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`;
      dispatch(logoutUser());
      window.location.href = sessionEndpoint;
    }
  }, []);

  return (
    <div className="fullscreen">
      <EmptyLayout.Section center>
        <Label style={{ fontSize: "2em", fontWeight: "bold" }}>
          {t("Thanks for using the admin ui")}.
        </Label>
      </EmptyLayout.Section>
    </div>
  );
}

export default ByeBye;
