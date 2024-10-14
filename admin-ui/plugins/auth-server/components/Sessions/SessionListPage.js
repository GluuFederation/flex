import React, { useState, useEffect, useContext, useCallback } from "react";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import MaterialTable from "@material-table/core";
import Autocomplete from "@mui/material/Autocomplete";
import { Paper, TextField, Box } from "@mui/material";
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
      title: `${t("fields.auth_time")}`,
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
      .join(","); // Create a comma-separated string of headers

    const updateData = data.map((row) => {
      return {
        ["Username"]: row.sessionAttributes.auth_user,
        ["IP Address"]: row.sessionAttributes.remote_ip,
        ["Client Id Used"]: moment(
          row.sessionAttributes.authenticationTime
        ).format("YYYY-MM-DD h:mm:ss A"),
        ["Auth Time"]: moment(row.authenticationTime).format(
          "YYYY-MM-DD h:mm:ss A"
        ),
        ["ACR"]: row.sessionAttributes.acr_values,
        ["State"]: row.state,
      };
    });

    const rows = updateData.map((row) => {
      return keys.map((key) => row[key]).join(","); // Create a comma-separated string for each row
    });

    return [header, ...rows].join("\n"); // Combine header and rows, separated by newlines
  };

  // Function to handle file download
  const downloadCSV = () => {
    const csv = convertToCSV(sessions);
    const blob = new Blob([csv], { type: "text/csv" }); // Create a blob with the CSV data
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `client-tokens.csv`); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
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

  const GluuSearch = useCallback(() => {
    return (
      <GluuAdvancedSearch
        limitId={LIMIT_ID}
        patternId={PATTERN_ID}
        limit={limit}
        pattern={pattern}
        handler={handleOptionsChange}
        showLimit={false}
      />
    );
  }, [limit, pattern, handleOptionsChange]);

  myActions.push({
    icon: GluuSearch,
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
      if (memoPattern)
        dispatch(searchSessions({ action: { fieldValuePair: `client_id=${pattern}` } }));
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
                  style={applicationStyle.buttonStyle}
                  onClick={downloadCSV}
                  className="mr-4"
                >
                  {t("Export CSV")}
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
              style={{ marginTop: "20px" }}
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
