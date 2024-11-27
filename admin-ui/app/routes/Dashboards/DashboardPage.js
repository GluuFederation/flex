import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useMediaQuery } from "react-responsive";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import GluuViewWrapper from "Routes/Apps/Gluu/GluuViewWrapper";
import { getClients } from "Redux/features/initSlice";
import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from "Utils/PermChecker";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLicenseDetails } from "Redux/features/licenseDetailsSlice";
import { getHealthStatus } from "Redux/features/healthSlice";
import DashboardChart from "./Chart/DashboardChart";
import DateRange from "./DateRange";
import CheckIcon from "../../images/svg/check.svg";
import CrossIcon from "../../images/svg/cross.svg";
import SetTitle from "Utils/SetTitle";
import styles from "./styles";
import { formatDate } from "Utils/Util";
import UsersIcon from "Components/SVG/menu/Users";
import Administrator from "Components/SVG/menu/Administrator";
import OAuthIcon from "Components/SVG/menu/OAuth";
import { getHealthServerStatus } from "../../redux/features/healthSlice";

function DashboardPage() {
  const { t } = useTranslation();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const breakDashboardCard = useMediaQuery({ query: "(max-width: 1424px)" });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const userAction = {};
  const options = {};
  const { classes } = styles();
  const FETCHING_LICENSE_DETAILS = "Fetch license details";
  const [mauCount, setMauCount] = useState(null);
  const [tokenCount, setTokenCount] = useState(null);

  const statData = useSelector((state) => state.mauReducer.stat);
  const loading = useSelector((state) => state.mauReducer.loading);
  const clients = useSelector((state) => state.initReducer.clients);
  const totalClientsEntries = useSelector(
    (state) => state.initReducer.totalClientsEntries
  );
  const license = useSelector((state) => state.licenseDetailsReducer.item);
  const serverStatus = useSelector((state) => state.healthReducer.serverStatus);
  const serverHealth = useSelector((state) => state.healthReducer.health);
  const dbStatus = useSelector((state) => state.healthReducer.dbStatus);
  const access_token = useSelector(
    (state) => state.authReducer.token?.access_token
  );
  const permissions = useSelector((state) => state.authReducer.permissions);
  const dispatch = useDispatch();

  SetTitle(t("menus.dashboard"));

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const formattedMonth = currentMonth > 9 ? currentMonth : `0${currentMonth}`;
    const yearMonth = `${currentYear}${formattedMonth}`;
    const currentMonthData = statData.find(
      ({ month }) => month.toString() === yearMonth
    );

    const mau = currentMonthData?.mau;
    const token =
      currentMonthData?.authz_code_access_token_count +
      currentMonthData?.client_credentials_access_token_count;
    if (mau) {
      setMauCount(mau);
    }
    if (token) {
      setTokenCount(token);
    }
  }, [statData]);

  useEffect(() => {
    if (Object.keys(license).length === 0 && access_token) {
      getLicense();
    }
  }, [access_token, license]);

  useEffect(() => {
    if (clients.length === 0 && access_token) {
      buildPayload(userAction, "Fetch openid connect clients", {});
      dispatch(getClients({ action: userAction }));
    }
  }, [access_token, clients]);

  useEffect(() => {
    if (access_token) {
      getServerStatus();
      buildPayload(userAction, "GET Health Status", { service: "all" });
      dispatch(getHealthServerStatus({ action: userAction }));
    }
  }, [access_token]);

  function getLicense() {
    buildPayload(userAction, FETCHING_LICENSE_DETAILS, options);
    dispatch(getLicenseDetails({}));
  }

  function isUp(status) {
    if (status) {
      return (
        status.toUpperCase() === "ONLINE".toUpperCase() ||
        status.toUpperCase() === "RUNNING".toUpperCase()
      );
    }
    return false;
  }

  function getServerStatus() {
    buildPayload(userAction, "GET Health Status", options);
    dispatch(getHealthStatus({ action: userAction }));
  }

  const summaryData = [
    {
      text: t("dashboard.oidc_clients_count"),
      value: totalClientsEntries,
      icon: (
        <Administrator className={classes.summaryIcon} style={{ top: "8px" }} />
      ),
    },
    {
      text: t("dashboard.active_users_count"),
      value: mauCount,
      icon: (
        <UsersIcon className={classes.summaryIcon} style={{ top: "4px" }} />
      ),
    },
    {
      text: t("dashboard.token_issued_count"),
      value: tokenCount,
      icon: (
        <OAuthIcon className={classes.summaryIcon} style={{ top: "8px" }} />
      ),
    },
  ];

  const userInfo = [
    {
      text: t("dashboard.product_name"),
      value: license?.productName,
    },
    {
      text: t("dashboard.license_type"),
      value: license?.licenseType,
    },
    {
      text: t("dashboard.customer_email"),
      value: license?.customerEmail,
    },
    {
      text: t("dashboard.customer_name"),
      value: `${license?.customerFirstName || ""} ${
        license?.customerLastName || ""
      }`,
    },
    {
      text: t("fields.validityPeriod"),
      value: formatDate(license.validityPeriod),
      key: "License Validity Period",
    },
    {
      text: t("dashboard.license_status"),
      value: license?.licenseActive ? "active" : "inactive",
      key: "License Status",
    },
  ];

  const statusDetails = [
    { label: "dashboard.database_status", status: dbStatus, key: "db_status" },
    {
      label: "dashboard.server_status",
      status: serverStatus,
      key: "status",
    },

    {
      label: "dashboard.oauth_server_status",
      status: serverStatus,
      key: "jans-auth",
    },

    {
      label: "dashboard.config_api",
      status: serverStatus,
      key: "jans-config-api",
    },
    { label: "FIDO", status: serverStatus, key: "jans-fido2" },
    { label: "CASA", status: serverStatus, key: "jans-casa" },
    { label: "dashboard.key_cloak", status: serverStatus, key: "keycloak" },
    { label: "SCIM", status: false, key: "jans-scim" },
    { label: "dashboard.jans_lock", status: serverStatus, key: "jans-lock" },
    { label: "dashboard.jans_link", status: false, key: "jans-link" },
  ];

  // Helper function to get the status value
  const getStatusValue = (key) => {
    if (key !== "db_status" && key !== "status") {
      return serverHealth[key];
    } else if (key === "db_status") {
      return dbStatus;
    } else {
      return serverStatus;
    }
  };

  // Helper function to determine the class name
  const getClassName = (key) => {
    const value = getStatusValue(key);
    return isUp(value) ? classes.checkText : classes.crossText;
  };

  // Helper function to get the status text
  const getStatusText = (key) => {
    const value = getStatusValue(key);
    return isUp(value) ? "Running" : "Down";
  };

  // Helper function to get the icon
  const getStatusIcon = (key) => {
    const value = getStatusValue(key);
    return isUp(value) ? CheckIcon : CrossIcon;
  };

  // Refactored StatusCard component
  const StatusCard = useMemo(() => {
    return (
      <Grid item xs={12}>
        <div className={`${classes.statusContainer}`}>
          <div
            className={classes.userInfoTitle}
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: 400,
              marginBottom: "10px",
            }}
          >
            {t("dashboard.system_status")}
          </div>

          <div
            className={classes.userInfoText}
            style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
          >
            {statusDetails.map(({ label, key }) => (
              <div className={classes.statusText} key={label}>
                <div
                  className="d-flex justify-content-between"
                  style={{
                    width: "100%",
                    borderLeft: "4px solid #FFA500",
                    paddingLeft: "10px",
                  }}
                >
                  <div>
                    <span style={{ display: "block", marginBottom: "-4px" }}>
                      {t(label)}
                    </span>
                    <span
                      className={getClassName(key)}
                      style={{ fontSize: "16px" }}
                    >
                      {getStatusText(key)}
                    </span>
                  </div>
                  <span style={{ width: "18%", marginTop: "10px" }}>
                    <img
                      src={getStatusIcon(key)}
                      className={getClassName(key)}
                      alt={label}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Grid>
    );
  }, [serverStatus, serverHealth, dbStatus, t, statusDetails, classes]);

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      >
        <div className={classes.root}>
          <Grid
            spacing={{ sm: "20px", md: "40px" }}
            container
            className="px-40"
            style={{ height: "500px" }}
          >
            <Grid item lg={breakDashboardCard ? 6 : 4} md={4} height="auto">
              <div
                className={classes.userInfoTitle}
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: 400,
                  marginBottom: "10px",
                }}
              >
                {t("dashboard.summary_title")}
              </div>
              <div
                className="d-flex flex-column"
                style={{ gap: "10px", marginTop: "11px" }}
              >
                {summaryData.map((data, key) => (
                  <Paper key={key} className={classes.summary}>
                    <div className={classes.summaryDetails}>
                      <div>
                        <div className={classes.summaryText}>{data.text}</div>
                        <div className={classes.summaryValue}>{data.value}</div>
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "30%", height: "100%" }}
                      >
                        {data.icon}
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>
            </Grid>

            <Grid
              item
              lg={breakDashboardCard ? 6 : 4}
              md={4}
              xs={4}
              style={{ width: "100%", padding: "40px 0 0 0" }}
            >
              {StatusCard}
            </Grid>

            <Grid
              item
              lg={breakDashboardCard ? 6 : 4}
              md={4}
              xs={4}
              style={{ width: "100%", padding: "40px 0 0 0" }}
            >
              <Paper
                className={`${classes.dashboardCard} top-minus-40 d-flex justify-content-center`}
                elevation={0}
                spacing={2}
              >
                <Grid
                  className={classes.flex}
                  container
                  style={{ maxWidth: "450px" }}
                >
                  <Grid item xs={12} className={isMobile ? "mt-20" : ""}>
                    <div className={classes.userInfo}>
                      <div
                        className={classes.userInfoTitle}
                        style={{
                          color: "white",
                          fontSize: 24,
                          fontWeight: 400,
                          marginBottom: "10px",
                        }}
                      >
                        {t("dashboard.user_info")}
                      </div>
                      <div
                        className="d-flex flex-column justify-content-between"
                        style={{
                          backgroundColor: "white",
                          padding: "20px",
                          height: "320px",
                          borderRadius: "5px",
                        }}
                      >
                        {userInfo.map((info, key) => (
                          <div className={classes.userInfoText} key={key}>
                            <span style={{ fontWeight: 600 }}>
                              {info.text}:{" "}
                            </span>
                            {info?.key === "License Status" ? (
                              <span
                                className={
                                  info.value === "active"
                                    ? classes.greenBlock
                                    : classes.redBlock
                                }
                              >
                                {info.value}
                              </span>
                            ) : (
                              <React.Fragment>{info.value}</React.Fragment>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Grid container className={`px-40`}>
            <Grid lg={12} xs={12} item>
              <h3 className="text-white">
                {t("dashboard.access_tokens_graph")}
              </h3>
              {isTabletOrMobile ? (
                <Grid container className={`${classes.whiteBg}`}>
                  <Grid
                    xs={12}
                    item
                    style={
                      isTabletOrMobile
                        ? { marginLeft: 40 }
                        : { marginLeft: 40, marginBottom: 40 }
                    }
                  >
                    <div>{t("dashboard.select_date_range")}</div>
                    <DateRange />
                  </Grid>
                  <Grid xs={11} item className={classes.desktopChartStyle}>
                    <DashboardChart />
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  className={`${classes.whiteBg} ${classes.flex}`}
                >
                  <Grid
                    md={9}
                    xs={12}
                    item
                    className={classes.desktopChartStyle}
                  >
                    <DashboardChart />
                  </Grid>
                  <Grid md={3} xs={6} item>
                    <div style={{ fontSize: "large" }}>
                      {t("dashboard.select_date_range")}
                    </div>
                    <DateRange />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container className={`${classes.flex} px-40`}>
            <Grid xs={12} item>
              <Grid
                xs={12}
                item
                className={`${isMobile ? classes.block : classes.flex} mt-20`}
              >
                <ul className="me-40">
                  <li className={classes.orange}>
                    {t("dashboard.client_credentials_access_token")}
                  </li>
                </ul>
                <ul className="me-40">
                  <li className={classes.lightBlue}>
                    {t("dashboard.authorization_code_access_token")}
                  </li>
                </ul>
                <ul>
                  <li className={classes.lightGreen}>
                    {t("dashboard.authorization_code_id_token")}
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </GluuViewWrapper>
    </GluuLoader>
  );
}

export default DashboardPage;
