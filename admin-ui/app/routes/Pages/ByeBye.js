import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uuidv4 } from "Utils/Util";
import { EmptyLayout, Label } from "Components";
import { logoutUser } from "Redux/features/logoutSlice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ByeBye() {
  const config = useSelector((state) => state.authReducer.config);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate(); // Use react-router-dom for navigation

  useEffect(() => {
    const handlePopState = () => {
      console.log("User navigated back to the React app");
      navigate("/", { replace: true });
    };

      // Clear session data
      dispatch(logoutUser());
      localStorage.clear(); // Clear tokens or user-related data
      sessionStorage.clear(); // Clear session-related data

    if (config && Object.keys(config).length > 0) {
      const state = uuidv4();
      const sessionEndpoint = `${config.endSessionEndpoint}?state=${state}&post_logout_redirect_uri=${config.postLogoutRedirectUri}`;
      window.addEventListener("popstate", handlePopState);

      // Redirect to the logout endpoint
      window.location.href = sessionEndpoint;
    } else {
      // Redirect to a public page
      navigate("/", { replace: true });
    }

    return () => {
      window.removeEventListener("popstate", handlePopState); // Cleanup event listener
    };
  }, [config, dispatch, navigate]);

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
