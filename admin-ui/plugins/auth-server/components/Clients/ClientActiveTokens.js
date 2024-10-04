import React, { useState, useEffect, useContext, useCallback } from "react";
import MaterialTable from "@material-table/core";
import { Card, CardBody } from "../../../../app/components";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import GluuViewWrapper from "Routes/Apps/Gluu/GluuViewWrapper";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import { ThemeContext } from "Context/theme/themeContext";
import { Paper, TablePagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeleteOutlined } from "@mui/icons-material";
import getThemeColor from "Context/theme/config";
import GluuAdvancedSearch from "Routes/Apps/Gluu/GluuAdvancedSearch";
import { LIMIT_ID, PATTERN_ID } from "../../common/Constants";
import { getTokenByClient } from "../../redux/features/oidcSlice";

function ClientActiveTokens({ client }) {
  console.log("client", client);
  const myActions = [];
  const options = {};
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const themeColors = getThemeColor(selectedTheme);
  const bgThemeColor = { background: themeColors.background };

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, []);

  const [pageNumber, setPageNumber] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pattern, setPattern] = useState(null);

  const loading = false; //useSelector((state) => state.oidcReducer.isTokenLoading);
  const tokens = [
    { id: 1, token_type: "access token", expiration_date: "1234" },
    { id: 1, token_type: "access token", expiration_date: "1234" },
    { id: 1, token_type: "access token", expiration_date: "1234" },
  ]; //useSelector((state) => state.oidcReducer.tokens);

  const { totalItems } = useSelector((state) => state.userReducer);

  const onPageChangeClick = (page) => {
    let startCount = page * limit;
    options["startIndex"] = parseInt(startCount);
    options["limit"] = limit;
    options["pattern"] = pattern;
    setPageNumber(page);
    //dispatch(getUsers({ action: options }))
  };

  const onRowCountChangeClick = (count) => {
    options["limit"] = count;
    options["pattern"] = pattern;
    setPageNumber(0);
    setLimit(count);
    // dispatch(getUsers({ action: options }))
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
    return <></>;
  }, []);

  myActions.push((rowData) => ({
    icon: DeleteOutlinedIcon,
    iconProps: {
      color: "secondary",
      id: "deleteClient" + rowData.inum,
    },
    onClick: (event, rowData) => {},
    disabled: false,
  }));

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
      //dispatch(getUsers({ action: { limit: memoLimit, pattern: memoPattern } }))
    },
  });

  useEffect(() => {
    dispatch(getTokenByClient({ inum: client.inum }));
  }, []);

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={true}>
            <MaterialTable
              key={limit}
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={[
                {
                  title: `${t("fields.expiration_date")}`,
                  field: "expiration_date",
                },
                { title: `${t("fields.token_type")}`, field: "token_type" },
              ]}
              data={tokens}
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
              detailPanel={DetailPanel}
            />
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  );
}

export default ClientActiveTokens;
