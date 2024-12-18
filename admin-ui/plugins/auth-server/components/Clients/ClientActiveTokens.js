import React, { useState, useEffect, useContext, useCallback } from "react";
import MaterialTable from "@material-table/core";
import { Card, CardBody } from "../../../../app/components";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import GluuViewWrapper from "Routes/Apps/Gluu/GluuViewWrapper";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import { ThemeContext } from "Context/theme/themeContext";
import { Paper, TablePagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import getThemeColor from "Context/theme/config";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import {
  deleteClientToken,
  getTokenByClient,
} from "../../redux/features/oidcSlice";
import ClientActiveTokenDetailPage from "./ClientActiveTokenDetailPage";
import { Button } from "Components";
import dayjs from "dayjs";
import PropTypes from "prop-types";

function ClientActiveTokens({ client }) {
  const myActions = [];
  const options = {};
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const themeColors = getThemeColor(selectedTheme);
  const bgThemeColor = { background: themeColors.background };
  const [data, setData] = useState([]);

  const [pageNumber, setPageNumber] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pattern, setPattern] = useState({
    expirationDateAfter: null,
    expirationDateBefore: null,
  });

  const loading = useSelector((state) => state.oidcReducer.isTokenLoading);
  const updatedToken = useSelector((state) => state.oidcReducer.tokens);

  const { totalItems } = useSelector((state) => state.oidcReducer.tokens);

  const onPageChangeClick = (page) => {
    let startCount = page * limit;
    setPageNumber(page);
    getTokens(parseInt(startCount), limit, `clnId=${client.inum}`);
  };

  const onRowCountChangeClick = (count) => {
    setPageNumber(0);
    setLimit(count);
    getTokens(0, limit, `clnId=${client.inum}`);
  };

  const PaperContainer = useCallback(
    (props) => <Paper {...props} elevation={0} />,
    []
  );

  const PaginationWrapper = useCallback(
    (props) => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(prop, page) => {
          onPageChangeClick(page);
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(prop, count) =>
          onRowCountChangeClick(count.props.value)
        }
      />
    ),
    [pageNumber, totalItems, onPageChangeClick, limit, onRowCountChangeClick]
  );

  const DetailPanel = useCallback((rowData) => {
    return <ClientActiveTokenDetailPage row={rowData} />;
  }, []);

  const handleSearch = () => {
    let startCount = pageNumber * limit;
    let conditionquery = `clnId=${client.inum}`;
    if (pattern.expirationDateAfter && pattern.expirationDateBefore) {
      conditionquery += `,expirationDate>${dayjs(pattern.expirationDateAfter).format('YYYY-MM-DD')}`;
      conditionquery += `,expirationDate<${dayjs(pattern.expirationDateBefore).format('YYYY-MM-DD')}`;
    }
    getTokens(startCount, limit, conditionquery);
  };

  const handleClear = () => {
    setPattern({ referenceId: "", scope: "", tokenCode: "" });
    let startCount = pageNumber * limit;
    let conditionquery = `clnId=${client.inum}`;
    getTokens(startCount, limit, conditionquery);
  };

  const handleRevokeToken = async (oldData) => {
    await dispatch(deleteClientToken({ tknCode: oldData.tokenCode }));
    let startCount = pageNumber * limit;
    getTokens(startCount, limit, `clnId=${client.inum}`);
  };

  const getTokens = async (page, limit, fieldValuePair) => {
    options["startIndex"] = parseInt(page);
    options["limit"] = limit;
    options["fieldValuePair"] = fieldValuePair;
    await dispatch(getTokenByClient({ action: options }));
  };

  // Convert data array into CSV string
  const convertToCSV = (data) => {
    const keys = Object.keys(data[0]).filter((item) => item !== "attributes"); // Get the headers from the first object
    const header = keys
      .filter((item) => item !== "attributes")
      .map((item) => item.replace(/-/g, " ").toUpperCase())
      .join(","); // Create a comma-separated string of headers

    const updateData = data.map((row) => {
      return {
        scope: row.scope,
        deletable: row.deletable,
        grantType: row.grantType,
        expirationDate: row.expirationDate,
        creationDate: row.creationDate,
        tokenType: row.tokenType,
      };
    });

    const rows = updateData.map((row) => {
      return keys.map((key) => row[key]).join(","); // Create a comma-separated string for each row
    });

    return [header, ...rows].join("\n"); // Combine header and rows, separated by newlines
  };

  // Function to handle file download
  const downloadCSV = () => {
    const csv = convertToCSV(data);
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

  useEffect(() => {
    getTokens(0, limit, `clnId=${client.inum}`);
  }, []);

  useEffect(() => {
    if (updatedToken && Object.keys(updatedToken).length > 0) {
      const result = updatedToken?.items?.length
        ? updatedToken?.items.map((item) => {
            return {
              tokenType: item.tokenType,
              scope: item.scope,
              deletable: item.deletable,
              attributes: item.attributes,
              grantType: item.grantType,
              expirationDate: moment(item.expirationDate).format(
                "YYYY/DD/MM HH:mm:ss"
              ),
              creationDate: moment(item.creationDate).format(
                "YYYY/DD/MM HH:mm:ss"
              )
            };
          })
        : [];
      setData(result);
    }
  }, [updatedToken]);

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={true}>
            <div style={applicationStyle.globalSearch}>
              <div>
                <div>
                  <p>{t("placeholders.expires_after")}</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      id="expirationDate"
                      name="expirationDate"
                      value={pattern.expirationDateAfter}
                      onChange={(date) => {                        
                        setPattern({ ...pattern, expirationDateAfter: date });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            "& .MuiInputBase-input": {
                              height: "36px", // Adjust the height of the input
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div style={{ marginLeft: "20px" }}>
                <div>
                  <p>{t("placeholders.expires_before")}</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      id="expirationDate"
                      name="expirationDate"
                      value={pattern.expirationDateBefore}
                      onChange={(date) => {                        
                        setPattern({ ...pattern, expirationDateBefore: date });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            "& .MuiInputBase-input": {
                              height: "36px", // Adjust the height of the input
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div style={applicationStyle.globalSearchPattern}>
                <Button
                  color={`primary-${selectedTheme}`}
                  style={applicationStyle.buttonStyle}
                  onClick={handleSearch}
                  disabled={pattern.expirationDateAfter && pattern.expirationDateBefore ? false : true}
                >
                  {t("actions.search")}
                </Button>
              </div>
              <div style={applicationStyle.globalSearchPattern}>
                <Button
                  color={`primary-${selectedTheme}`}
                  style={applicationStyle.buttonStyle}
                  onClick={handleClear}
                  disabled={pattern.expirationDateAfter && pattern.expirationDateBefore ? false : true}
                >
                  {t("actions.clear")}
                </Button>
              </div>
              <div style={applicationStyle.globalSearchPattern}>
                <Button
                  color={`primary-${selectedTheme}`}
                  style={applicationStyle.buttonStyle}
                  onClick={downloadCSV}
                  disabled={data?.length ? false : true}
                >
                  {t("actions.export_csv")}
                </Button>
              </div>
            </div>

            <MaterialTable
              key={limit}
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={[
                { title: `${t("fields.token_type")}`, field: "tokenType" },
                { title: `${t("fields.grant_type")}`, field: "grantType" },
                {
                  title: `${t("fields.creationDate")}`,
                  field: "creationDate",
                },
                {
                  title: `${t("fields.expiration_date")}`,
                  field: "expirationDate",
                },
              ]}
              data={data}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                search: false,
                idSynonym: "inum",
                searchFieldAlignment: "left",
                selection: false,
                pageSize: limit,
                rowStyle: (rowData) => ({
                  backgroundColor: rowData.enabled ? "#33AE9A" : "#FFF",
                }),
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                },
                actionsColumnIndex: -1,
              }}
              editable={{
                isDeleteHidden: () => false,
                onRowDelete: (oldData) => {
                  return new Promise((resolve, reject) => {
                    handleRevokeToken(oldData);
                    resolve();
                  });
                },
              }}
              detailPanel={DetailPanel}
            />
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  );
}

ClientActiveTokens.propTypes = {
  client: PropTypes.any,
};
export default ClientActiveTokens;
