import React, { useEffect } from "react";
import SetTitle from "Utils/SetTitle";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import { Card, CardBody } from "Components";
import GluuTabs from "Routes/Apps/Gluu/GluuTabs";
import ConfigurationTab from "../Tabs/ConfigurationTab";
import CustomerBackendKeyTab from "../Tabs/CustomerBackendKeyTab";
import SourceBackendServersTab from "../Tabs/SourceBackendServersTab";
import InumDBServerTab from "../Tabs/InumDBServerTab";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import { useDispatch, useSelector } from "react-redux";
import { getCacheRefreshConfiguration } from "Plugins/jans-link/redux/features/CacheRefreshSlice";
import { useTranslation } from "react-i18next";

const JansLinkPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.cacheRefreshReducer.loading);
  SetTitle(t("titles.jans_ink"));

  useEffect(() => {
    dispatch(getCacheRefreshConfiguration());
  }, []);

  const tabNames = [
    t("menus.configuration"),
    t("menus.customer_backend_key_attributes"),
    t("menus.source_backend_ldap_servers"),
    t("menus.inum_db_server"),
  ];

  const tabToShow = (tabName) => {
    switch (tabName) {
      case t("menus.configuration"):
        return <ConfigurationTab />;
      case t("menus.customer_backend_key_attributes"):
        return <CustomerBackendKeyTab />;
      case t("menus.source_backend_ldap_servers"):
        return <SourceBackendServersTab />;
      case t("menus.inum_db_server"):
        return <InumDBServerTab />;
    }
  };

  return (
    <React.Fragment>
      <GluuLoader blocking={isLoading}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>
            {!isLoading && (
              <GluuTabs tabNames={tabNames} tabToShow={tabToShow} />
            )}
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  );
};

export default JansLinkPage;
