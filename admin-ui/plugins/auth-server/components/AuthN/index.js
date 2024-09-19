import React, { useState, useEffect, useContext } from "react";
import AuthNListPage from "./AuthNListPage";
import { useTranslation } from "react-i18next";
import GluuTabs from "Routes/Apps/Gluu/GluuTabs";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import { Card, CardBody } from "Components";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";

import { useSelector } from "react-redux";
import AgamaListPage from "../Agama/AgamaListPage";
import AliasesListPage from "../Agama/AgamaAliasListPage";

function AuthNPage() {
  const { t } = useTranslation();
  const isLoading = useSelector((state) => state.cacheRefreshReducer.loading);

  const tabNames = [
    {
      name: t("menus.builtIn"),
      path: "",
    },
    { name: t("menus.acrs"), path: "" },
    {
      name: t("menus.aliases"),
      path: "",
    },
    {
      name: t("menus.agama_flows"),
      path: "",
    },
 
  ];

  const tabToShow = (tabName) => {
    switch (tabName) {
      case t("menus.builtIn"):
        return <AuthNListPage isBuiltIn={true}/>;
      case t("menus.acrs"):
        return <AuthNListPage />;
      case t("menus.agama_flows"):
        return <AgamaListPage />;
      case t("menus.aliases"):
        return <AliasesListPage />;
    }
  };

  return (
    <Card className="mb-3" style={applicationStyle.mainCard}>
      <GluuTabs
        tabNames={tabNames}
        tabToShow={tabToShow}
        withNavigation={true}
      />
    </Card>
  );
}

export default AuthNPage;
