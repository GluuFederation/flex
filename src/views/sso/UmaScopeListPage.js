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
  FormInput
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import getScopeData from "../../data/uma-scopes-data";

const UmaScopeListPage = () => {
  let history = useHistory();
  const [data, setData] = useState(getScopeData());
  const [pageSize, setPageSize] = useState(5);
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
      maxWidth: 50,
      className: "text-center"
    },
    {
      Header: "Name",
      accessor: "name",
      className: "text-center",
      maxWidth: 150
    },
    {
      Header: "Link",
      accessor: "action",
      minWidth: 80,
      className: "text-center"
    },
    {
      Header: "Actions",
      accessor: "actions",
      minWidth: 70,
      maxWidth: 200,
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
  function handleGoToUmaScopeAddPage() {
    return history.push("/uma_scope_add");
  }
  function handleItemEdit(row) {
    alert(`Editing uma scope "${row.original.id}"!`);
  }
  function handleItemDelete(row) {
    alert(`Deleting uma scope "${row.original.id}"!`);
  }
  function handleItemViewDetails(row) {
    alert(`Viewing details for "${row.original.id}"!`);
  }
  return (
    <Container fluid className="main-content-container px-2 pb-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          title="UMA SCOPES"
          subtitle="SINGLE SIGN ON"
          className="text-sm-left mb-3"
        />
        <Col sm="1" className="d-flex ml-auto my-auto">
          <ButtonGroup size="sm" className="d-table mx-auto">
            <Button
              theme="primary"
              className="btn-lg"
              onClick={() => handleGoToUmaScopeAddPage()}
            >
              <i class="material-icons">add</i> Add
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Card className="p-0">
        <CardHeader className="p-0">
          <Container fluid className="file-manager__filters border-bottom">
            <Row>
              <Col className="file-manager__filters__rows d-flex" md="6">
                <span>Show</span>
                <FormSelect
                  size="sm"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {pageSizeOptions.map((size, idx) => (
                    <option key={idx} value={size}>
                      {size} rows
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
export default UmaScopeListPage;
