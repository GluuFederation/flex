import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uuidv4 } from "Utils/Util";
import { EmptyLayout, Label } from "Components";
import { logoutUser } from "Redux/features/logoutSlice";
import { useTranslation } from "react-i18next";

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config);
  const { userinfo } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("config: " + JSON.stringify(config));
    if (config && Object.keys(config).length > 0) {
      console.log("localConfig: 1 ", config);
      localStorage.setItem("localConfig", JSON.stringify(config));
      const state = uuidv4();
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`;
      dispatch(logoutUser());
      window.location.href = sessionEndpoint;
    } else {
      const state = uuidv4();
      const localConfig =  JSON.parse(localStorage.getItem('localConfig'))
      console.log("localConfig: ", localConfig);
       navigate("/")
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
