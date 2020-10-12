import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReactTable from "react-table";
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
import PageTitle from "../../components/common/PageTitle";
import getGroupsData from "../../data/trusts-data";
import { useTranslation } from "react-i18next";
const TrustListPage = () => {
  const { t } = useTranslation();
  let history = useHistory();
  const [data, setData] = useState(getGroupsData());
  const [pageSize, setPageSize] = useState(7);
  const [pageSizeOptions, setPageSizeOptions] = useState([
    5,
    10,
    15,
    20,
    25,
    30
  ]);
  const tableColumns = [
    {
      Header: "#",
      accessor: "id",
      maxWidth: 60,
      className: "text-center"
    },
    {
      Header: "Display Name",
      accessor: "displayName",
      className: "text-center",
      minWidth: 100
    },
    {
      Header: "Description",
      accessor: "description",
      className: "text-center"
    },
    {
      Header: "Type",
      accessor: "type",
      maxWidth: 150,
      className: "text-center"
    },
    {
      Header: "Validation Status",
      accessor: "validationStatus",
      maxWidth: 105,
      Cell: row => (
        <Badge theme={getBadgeTheme(row.original.validationStatus)}>
          {row.original.validationStatus}
        </Badge>
      ),
      className: "text-center"
    },
    {
      Header: "Status",
      accessor: "status",
      maxWidth: 80,
      Cell: row => (
        <Badge theme={getStatusBadgeTheme(row.original.status)}>
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
    if (status === "Success") {
      return "primary";
    } else if (status === "Failed") {
      return "danger";
    } else {
      return "secondary";
    }
  }

  function getStatusBadgeTheme(status) {
    if (status === "Active") {
      return "primary";
    } else {
      return "warning";
    }
  }
  function handlePageSizeChange(e) {
    this.setState({
      ...this.state,
      pageSize: e.target.value
    });
  }
  function handleFilterSearch(e) {
    this.setState({
      ...this.state,
      tableData: this.searcher.search(e.target.value)
    });
  }
  function handleGoToGroupAddPage() {
    return history.push("/saml_trust_add");
  }
  function handleItemEdit(row) {
    alert(`Editing trust "${row.original.id}"!`);
  }
  function handleItemDelete(row) {
    alert(`Deleting trust "${row.original.id}"!`);
  }
  function handleItemViewDetails(row) {
    alert(`Viewing details for "${row.original.id}"!`);
  }
  return (
    <Container fluid className="main-content-container px-2 pb-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="TRUSTS RELATIONSHIPS"
          subtitle="SINGLE SIGN ON"
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
              data={data}
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
export default TrustListPage;
