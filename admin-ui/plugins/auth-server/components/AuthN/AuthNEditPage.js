import React, { useEffect } from "react";
import { CardBody, Card } from "Components";
import AuthNForm from "./AuthNForm";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import GluuAlert from "Routes/Apps/Gluu/GluuAlert";
import { useTranslation } from "react-i18next";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import { useSelector, useDispatch } from "react-redux";

import {
  editLDAPAuthAcr,
  editScriptAuthAcr,
  editSimpleAuthAcr,
} from "../../redux/actions/AuthnActions";
import { useNavigate } from "react-router";

function AuthNEditPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const item = useSelector((state) => state.authNReducer.item);
  const loading = useSelector((state) => state.authNReducer.loading);
  const success = useSelector((state) => state.authNReducer.isSuccess);

  useEffect(() => {
    if(success){
      navigate("/auth-server/authn")
    }
  },[success])



  function handleSubmit(data) {
    const payload = {};
    if (data.acr === "simple_password_auth") {
      if (data.defaultAuthNMethod === "true") {
        payload.authenticationMethod = { defaultArc: "simple_password_auth" };
       dispatch(editSimpleAuthAcr(payload));
      }
     
    } else if (data.acr === "default_ldap_password") {
      delete data.hashAlgorithm;
      delete data.samlACR;
      payload.authenticationMethod = { defaultArc: data.configId };
      dispatch(editSimpleAuthAcr(payload));
      dispatch(editLDAPAuthAcr(data));
    } else {
      const scriptData = {
        description: data.description,
        samlACR: data.samlACR,
        level: data.level,
        dn: data.baseDn,
        inum: data.inum,
      };
      if (data?.configurationProperties?.length > 0) {
        scriptData.configurationProperties = data?.configurationProperties
          .filter((e) => e != null)
          .filter((e) => Object.keys(e).length !== 0)
          .map((e) => ({
            value1: e.key || e.value1,
            value2: e.value || e.value2,
            hide: false,
          }));
      }
       payload.customScript = scriptData;
       payload.authenticationMethod = { defaultArc: data.acrName };
      dispatch(editScriptAuthAcr(payload));
    }
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t("titles.error")}
        message={t("messages.error_in_saving")}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AuthNForm handleSubmit={handleSubmit} item={item} />
        </CardBody>
      </Card>
    </GluuLoader>
  );
}

export default AuthNEditPage;
