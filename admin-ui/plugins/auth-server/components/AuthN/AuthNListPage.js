import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "@material-table/core";
import { Paper } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody } from "Components";
import GluuViewWrapper from "Routes/Apps/Gluu/GluuViewWrapper";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import { useTranslation } from "react-i18next";

import { hasPermission, SCOPE_READ, SCOPE_WRITE } from "Utils/PermChecker";
import SetTitle from "Utils/SetTitle";
import { ThemeContext } from "Context/theme/themeContext";
import getThemeColor from "Context/theme/config";
import AuthNDetailPage from "./AuthNDetailPage";
import { getLdapConfig } from "Plugins/services/redux/actions/LdapActions";
import { getCustomScriptByType } from "Plugins/admin/redux/actions/CustomScriptActions";
import { setCurrentItem } from "../../redux/actions/AuthnActions";
import { getAcrsConfig } from "Plugins/auth-server/redux/actions/AcrsActions";

function AuthNListPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const myActions = [];
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [modal, setModal] = useState(false);
  const pageSize = localStorage.getItem("paggingSize") || 10;
  const [limit, setLimit] = useState(10);
  const [pattern, setPattern] = useState(null);
  const toggle = () => setModal(!modal);
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const themeColors = getThemeColor(selectedTheme);
  const bgThemeColor = { background: themeColors.background };
  const [authNList, setAuthNList] = useState([]);

  const permissions = useSelector((state) => state.authReducer.permissions);
  const authN = useSelector((state) => state.authNReducer.acrs);
  const ldap = useSelector((state) => state.ldapReducer.ldap);
  const scripts = useSelector((state) => state.customScriptReducer.items);
  const loading = useSelector((state) => state.ldapReducer.loading);
  const acrs = useSelector((state) => state.acrReducer.acrReponse);
  const success = useSelector((state) => state.authNReducer.isSuccess);
  console.log("isSucess",success)
  const customScriptloading = useSelector(
    (state) => state.customScriptReducer.loading
  );
  SetTitle(t("titles.authn"));

  useEffect(() => {
    dispatch(getLdapConfig());
    dispatch(getCustomScriptByType({ type: "person_authentication" }));
    dispatch(getAcrsConfig());
  }, []);

  useEffect(() => {
    const checkItems = [...authNList];
    const checkItemsAlreadyExists = checkItems.filter(
      (item) => item.name === "default_ldap_password"
    );
    if (ldap.length > 0 && checkItemsAlreadyExists.length === 0) {
      const getEnabledldap = ldap.filter((item) => item.enabled === true);
      if (getEnabledldap?.length > 0) {
        const updateLDAPItems = ldap.map((item) => ({
          ...item,
          name: "default_ldap_password",
          acrName: item.configId,
        }));
        const temp = [...authNList, ...updateLDAPItems];
        setAuthNList(temp);
      }
    }
  }, [ldap]);

  useEffect(() => {
    const checkItems = [...authNList];
    const checkItemsAlreadyExists = checkItems.filter(
      (item) => item.name === "myAuthnScript"
    );
    if (scripts.length > 0 && checkItemsAlreadyExists.length === 0) {
      const getEnabledscripts = scripts.filter((item) => item.enabled === true);
      if (getEnabledscripts?.length > 0) {
        const updateScriptsItems = getEnabledscripts.map((item) => ({
          ...item,
          name: "myAuthnScript",
          acrName: item.name,
        }));
        const temp = [...authNList, ...updateScriptsItems];
        setAuthNList(temp);
      }
    }
  }, [scripts]);

  function handleGoToAuthNEditPage(row) {
    dispatch(setCurrentItem(row));
    return navigate(`/auth-server/authn/edit/:` + row.inum);
  }

  if (hasPermission(permissions, SCOPE_WRITE)) {
    myActions.push((rowData) => {
      return {
        icon: "edit",
        iconProps: {
          id: "editAutN" + rowData.inum,
        },
        tooltip: `${t("messages.edit_authn")}`,
        onClick: (event, rowData) => handleGoToAuthNEditPage(rowData),
        disabled: !hasPermission(permissions, SCOPE_WRITE),
      };
    });
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, SCOPE_READ)}>
          <MaterialTable
            key={limit ? limit : 0}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={[
              { title: `${t("fields.acr")}`, field: "acrName" },
              { title: `${t("fields.saml_acr")}`, field: "samlACR" },
              { title: `${t("fields.level")}`, field: "level" },
              {
                title: `${t("options.default")}`,
                field: "",
                render: (rowData) => {
                  return rowData.acrName === acrs.defaultAcr ? (
                    <i
                      className="fa fa-check"
                      style={{ color: "green", fontSize: "24px" }}
                    ></i>
                  ) : (
                    <i
                      className="fa fa-close"
                      style={{ color: "red", fontSize: "24px" }}
                    ></i>
                  );
                },
              },
            ]}
            data={
              loading || customScriptloading
                ? []
                : [...authN, ...authNList].sort(
                    (item1, item2) => item1.level - item2.level
                  )
            }
            isLoading={loading || customScriptloading}
            title=""
            actions={myActions}
            options={{
              columnsButton: true,
              search: false,
              selection: false,
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <AuthNDetailPage row={rowData.rowData} />;
            }}
          />
        </GluuViewWrapper>
      </CardBody>
    </Card>
  );
}

export default AuthNListPage;
