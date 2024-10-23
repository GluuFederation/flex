import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import MaterialTable from "@material-table/core";
import Autocomplete from "@mui/material/Autocomplete";
import { Paper, TextField, Box, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import GluuAdvancedSearch from "Routes/Apps/Gluu/GluuAdvancedSearch";
import { Card, CardBody, Row, Col } from "Components";
import GluuViewWrapper from "Routes/Apps/Gluu/GluuViewWrapper";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import GluuDialog from "Routes/Apps/Gluu/GluuDialog";
import { useTranslation } from "react-i18next";
import {
  getSessions,
  revokeSession,
} from "Plugins/auth-server/redux/features/sessionSlice";
import SetTitle from "Utils/SetTitle";
import { ThemeContext } from "Context/theme/themeContext";
import getThemeColor from "Context/theme/config";
import SessionDetailPage from "../Sessions/SessionDetailPage";
import { hasPermission, SESSION_DELETE } from "Utils/PermChecker";
import { LIMIT_ID, PATTERN_ID } from "../../common/Constants";
import { searchSessions } from "../../redux/features/sessionSlice";
import dayjs from "dayjs";

function SessionListPage() {
  const sessions = useSelector((state) => state.sessionReducer.items);
  const loading = useSelector((state) => state.sessionReducer.loading);
  const permissions = useSelector((state) => state.authReducer.permissions);

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const myActions = [];
  const [item, setItem] = useState({});
  const [modal, setModal] = useState(false);
  const pageSize = localStorage.getItem("paggingSize") || 10;
  const toggle = () => setModal(!modal);
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const themeColors = getThemeColor(selectedTheme);
  const bgThemeColor = { background: themeColors.background };
  const sessionUsername = sessions.map(
    (session) => session.sessionAttributes.auth_user
  );
  const usernames = [...new Set(sessionUsername)];
  const [revokeUsername, setRevokeUsername] = useState();
  const [limit, setLimit] = useState(10);
  const [pattern, setPattern] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [date, setDate] = useState(null);

  SetTitle(t("menus.sessions"));

  const tableColumns = [
    { title: `${t("fields.username")}`, field: "sessionAttributes.auth_user" },
    {
      title: `${t("fields.ip_address")}`,
      field: "sessionAttributes.remote_ip",
    },
    {
      title: `${t("fields.client_id_used")}`,
      field: "sessionAttributes.client_id",
    },
    {
      title: `${t("fields.auth_time")}`,
      field: "authenticationTime",
      render: (rowData) => (
        <span>
          {moment(rowData.authenticationTime).format(
            "ddd, MMM DD, YYYY h:mm:ss A"
          )}
        </span>
      ),
    },
    {
      title: `${t("fields.acr")}`,
      field: "sessionAttributes.acr_values",
    },
    { title: `${t("fields.state")}`, field: "state" },
  ];


  useEffect(() => {
    dispatch(getSessions());
  }, []);

  const handleRevoke = () => {
    const row = !isEmpty(sessions)
      ? sessions.find(
          ({ sessionAttributes }) =>
            sessionAttributes.auth_user === revokeUsername
        )
      : null;
    if (row) {
      setItem(row);
      toggle();
    }
  };

  const onRevokeConfirmed = (message) => {
    const { userDn } = item;
    const params = { userDn, action_message: message };
    dispatch(revokeSession(params));
    toggle();
  };

  //export csv
  const convertToCSV = (data) => {
    const keys = tableColumns.map((item) => item.title); // Get the headers from the first object

    const header = keys
      .map((item) => item.replace(/-/g, " ").toUpperCase())
      .join(",");

    const updateData = data.map((row) => {
      return {
        [t("fields.username")]: row.sessionAttributes.auth_user,
        [t("fields.ip_address")]: row.sessionAttributes.remote_ip,
        [t("fields.client_id_used")]: row.sessionAttributes.client_id,
        [t("fields.auth_time")]: moment(row.authenticationTime).format(
          "YYYY-MM-DD h:mm:ss A"
        ),
        [t("fields.acr")]: row.sessionAttributes.acr_values,
        [t("fields.state")]: row.state,
      };
    });

    const rows = updateData.map((row) => {
      return keys.map((key) => row[key]).join(",");
    });

    return [header, ...rows].join("\n");
  };

  // Function to handle file download
  const downloadCSV = () => {
    const csv = convertToCSV(sessions);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `client-tokens.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let memoLimit = limit;
  let memoPattern = pattern;

  function handleOptionsChange(event) {
    if (event.target.name == "limit") {
      memoLimit = event.target.value;
    } else if (event.target.name == "pattern") {
      memoPattern = event.target.value;
    }
  }

  myActions.push({
    icon: () => (
      <Box display="flex" gap="10px" alignItems="center">
        <TextField
          select
          label="Search Filter"
          value={searchFilter}
          onChange={(e) => {
            setPattern(null);
            setDate(null);
            setSearchFilter(e.target.value);
            dispatch(getSessions());
          }}
          variant="outlined"
          style={{ width: 150, marginTop: -3 }}
        >
          <MenuItem value={null}>None</MenuItem>
          <MenuItem value="client_id">Client Id</MenuItem>
          <MenuItem value="auth_user">User Name</MenuItem>
          <MenuItem value="expirationDate">Expiration Date</MenuItem>
          <MenuItem value="authenticationTime">Authentication Date</MenuItem>
        </TextField>

        {searchFilter === "expirationDate" ||
        searchFilter === "authenticationTime" ? (
          <div style={{ width: "180px", height: "54px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM/DD/YYYY"
                label={t("dashboard.start_date")}
                value={date}
                onChange={(val) => {
                  console.log("val", val);
                  setDate(val);
                }}
                sx={{
                  "& .MuiSvgIcon-root": {
                    marginBottom: "15px",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        ) : (
          <GluuAdvancedSearch
            limitId={LIMIT_ID}
            patternId={PATTERN_ID}
            limit={limit}
            pattern={pattern}
            handler={handleOptionsChange}
            showLimit={false}
          />
        )}
      </Box>
    ),
    tooltip: `${t("messages.advanced_search")}`,
    iconProps: { color: "primary" },
    isFreeAction: true,
    onClick: () => {},
  });

  myActions.push({
    icon: "refresh",
    tooltip: `${t("messages.refresh")}`,
    iconProps: { color: "primary" },
    isFreeAction: true,
    onClick: () => {
      setLimit(memoLimit);
      setPattern(memoPattern);
      console.log("memoPattern",memoPattern)
      if (memoPattern || date)
        dispatch(
          searchSessions({
            action: {
              fieldValuePair: `${searchFilter}=${
                searchFilter !== "expirationDate" &&
                searchFilter !== "authenticationTime"
                  ? memoPattern
                  : dayjs(date).format("YYYY-MM-DD")
              }`,
            },
          })
        );
      else dispatch(getSessions());
    },
  });

  return (
    <>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow>
            {hasPermission(permissions, SESSION_DELETE) && (
              <div className="d-flex justify-content-between align-items-center">
                <Box display="flex" justifyContent="flex-end">
                  <Box
                    display="flex"
                    alignItems="center"
                    fontSize="16px"
                    mr="20px"
                  >
                    {t("fields.selectUserRevoke")}
                  </Box>

                  <Autocomplete
                    id="combo-box-demo"
                    options={usernames}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    onChange={(_, value) => {
                      setRevokeUsername(value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Username"
                        variant="outlined"
                      />
                    )}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        marginBottom: "15px",
                      },
                    }}
                  />
                  {revokeUsername && (
                    <Button
                      color={`danger`}
                      style={{ marginLeft: 20 }}
                      onClick={handleRevoke}
                    >
                      {t("actions.revoke")}
                    </Button>
                  )}
                </Box>

                <Button
                  color={`primary-${selectedTheme}`}
                  style={{
                    ...applicationStyle.buttonStyle,
                    marginRight: "35px",
                  }}
                  onClick={downloadCSV}
                >
                  {t("titles.export_csv")}
                </Button>
              </div>
            )}
            <MaterialTable
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              columns={tableColumns}
              data={sessions}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                idSynonym: "username",
                columnsButton: true,
                search: false,
                searchFieldAlignment: "left",
                selection: false,
                pageSize: pageSize,
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                },
                actionsColumnIndex: -1,
              }}
              detailPanel={(rowData) => {
                return <SessionDetailPage row={rowData.rowData} />;
              }}
              style={{ marginTop: "10px" }}
            />
          </GluuViewWrapper>
          {!isEmpty(item) && (
            <GluuDialog
              row={item}
              name={item.sessionAttributes.auth_user}
              handler={toggle}
              modal={modal}
              subject="user session revoke"
              onAccept={onRevokeConfirmed}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default SessionListPage;
