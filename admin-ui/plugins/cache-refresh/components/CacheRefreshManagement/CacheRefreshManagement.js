import { t } from "i18next";
import React, { useEffect } from "react";
import SetTitle from "Utils/SetTitle";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import { Card, CardBody } from "../../../../app/components";
import GluuTabs from "../../../../app/routes/Apps/Gluu/GluuTabs";
import CacheRefreshTab from "../Tabs/CacheRefreshTab";
import CustomerBackendKey from "../Tabs/CustomerBackendKey";
import SourceBackendServers from "../Tabs/SourceBackendServers";
import InumDBServer from "../Tabs/InumDBServer";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import { useDispatch, useSelector } from "react-redux";
import { getCacheRefreshConfiguration } from "../../redux/actions/CacheRefreshActions";

const CacheRefreshManagement = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.cacheRefreshReducer.loading);
  SetTitle(t("titles.cache_refresh_management"));

  useEffect(() => {
    dispatch(getCacheRefreshConfiguration());
  }, []);

  const tabNames = [
    t("menus.cacherefresh"),
    t("menus.customer_backend_key_attributes"),
    t("menus.source_backend_ldap_servers"),
    t("menus.inum_db_server"),
  ];

  const tabToShow = (tabName) => {
    switch (tabName) {
      case "Cache Refresh":
        return <CacheRefreshTab />;
      case "Customer Backend Key/Attributes":
        return <CustomerBackendKey />;
      case "Source Backend LDAP Servers":
        return <SourceBackendServers />;
      case "Inum DB Server":
        return <InumDBServer />;
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

export default CacheRefreshManagement;
