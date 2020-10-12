import React, { useState } from "react";
import ReactTable from "react-table";
import PageTitle from "../../components/common/PageTitle";
import { connect } from "react-redux";
import { store } from "../../redux/store/store";
import { deleteProviderAction } from "../../redux/actions/UiActions";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormSelect,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Badge
} from "shards-react";

const PassportListPage = ({ providers, pageSizeOptions = [10] }) => {
  let history = useHistory();
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const tableColumns = [
    {
      Header: "#",
      accessor: "id",
      maxWidth: 60,
      className: "text-center"
    },
    {
      Header: "ProviderID",
      accessor: "providerId",
      className: "text-center",
      minWidth: 100
    },
    {
      Header: "DisplayName",
      accessor: "displayName",
      className: "text-center"
    },
    {
      Header: "Type",
      accessor: "type",
      className: "text-center"
    },
    {
      Header: "Strategy",
      accessor: "strategy",
      minWidth: 100,
      className: "text-center"
    },
    {
      Header: "Status",
      accessor: "status",
      maxWidth: 100,
      Cell: row => (
        <Badge theme={getBadgeTheme(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
      className: "text-center"
    },
    {
      Header: "Actions",
      accessor: "actions",
      maxWidth: 300,
      minWidth: 80,
      sortable: false,
      Cell: row => (
        <ButtonGroup size="sm" className="d-table mx-auto">
          <Button theme="white" onClick={() => handleItemViewDetails(row)}>
            <i className="material-icons">&#xE870;</i>
          </Button>
          <Button theme="white" onClick={() => handleItemEdit(row)}>
            <i className="material-icons" style={{ color: "green" }}>
              &#xE254;
            </i>
          </Button>
          <Button theme="white" onClick={() => handleItemDelete(row)}>
            <i className="material-icons" style={{ color: "red" }}>
              &#xE872;
            </i>
          </Button>
        </ButtonGroup>
      )
    }
  ];

  function getBadgeTheme(status) {
    if (status === "Active") {
      return "primary";
    } else {
      return "danger";
    }
  }
  function handlePageSizeChange(e) {
    setPageSize(e.target.value);
  }
  function handleFilterSearch(e) {
    this.setState({
      ...this.state,
      tableData: this.searcher.search(e.target.value)
    });
  }
  function handleGoToGroupAddPage() {
    return history.push("/passport_provider_add");
  }
  function handleItemEdit(row) {
    alert(`Editing provider "${row.original.id}"!`);
  }
  function handleItemDelete(row) {
    store.dispatch(deleteProviderAction(row.original));
  }
  function handleItemViewDetails(row) {
    alert(`Viewing details for "${row.original.id}"!`);
  }
  return (
    <Container fluid className="main-content-container px-2 pb-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="Passports providers"
          subtitle="SSO"
          className="text-sm-left mb-3"
        />
        <Col sm="1" className="d-flex ml-auto my-auto">
          <ButtonGroup size="sm" className="d-table mx-auto">
            <Button
              theme="primary"
              className="btn-lg"
              onClick={() => handleGoToGroupAddPage()}
            >
              <i class="material-icons">add</i> {t("button.add")}
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Card className="p-0">
        <CardHeader className="p-0">
          <Container fluid className="file-manager__filters border-bottom">
            <Row>
              <Col className="file-manager__filters__rows d-flex" md="6">
                <span>{t("button.show")}</span>
                <FormSelect
                  size="sm"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {pageSizeOptions.map((size, idx) => (
                    <option key={idx} value={size}>
                      {size} {t("button.rows")}
                    </option>
                  ))}
                </FormSelect>
              </Col>
              <Col className="file-manager__filters__search d-flex" md="6">
                <InputGroup seamless size="sm" className="ml-auto">
                  <InputGroupAddon type="prepend">
                    <InputGroupText>
                      <i className="material-icons">search</i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <FormInput onChange={handleFilterSearch} />
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </CardHeader>
        <CardBody className="p-0">
          <div className="">
            <ReactTable
              columns={tableColumns}
              data={providers}
              pageSize={pageSize}
              showPageSizeOptions={false}
              resizable={false}
            />
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    providers: state.providers.data,
    pageSizeOptions: state.application.pageSizeOptions
  };
}

export default connect(mapStateToProps)(PassportListPage);
