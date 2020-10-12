import React from "react";
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";
import FuzzySearch from "fuzzy-search";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  FormSelect,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Card,
  CardHeader,
  CardBody
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import FileDropzone from "../components/file-manager-list/FileDropzone";
import getTableData from "../data/file-manager-list-data";


class FileManagerList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSizeOptions: [5, 10, 15, 20, 25, 30],
      pageSize: 10,
      tableData: []
    };

    this.searcher = null;

    this.handleItemEdit = this.handleItemEdit.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleFilterSearch = this.handleFilterSearch.bind(this);
  }

  componentDidMount() {
    const tableData = getTableData();

    this.setState({
      ...this.state,
      tableData
    });

    // Initialize the fuzzy searcher.
    this.searcher = new FuzzySearch(
      tableData,
      ["name", "size", "type", "lastOpened"],
      { caseSensitive: false }
    );
  }

  /**
   * Mock method for editing items.
   */
  handleItemEdit(row) {
    alert(`Editing "${row.original.name}"!`);
  }

  /**
   * Mock method for deleting items.
   */
  handleItemDelete(row) {
    alert(`Deleting "${row.original.name}"!`);
  }

  /**
   * Changes the page size.
   */
  handlePageSizeChange(e) {
    this.setState({
      ...this.state,
      pageSize: e.target.value
    });
  }

  /**
   * Handles the global search.
   */
  handleFilterSearch(e) {
    this.setState({
      ...this.state,
      tableData: this.searcher.search(e.target.value)
    });
  }

  render() {
    const { tableData, pageSize, pageSizeOptions } = this.state;
    const tableColumns = [
      {
        Header: "",
        accessor: "icon",
        maxWidth: 60,
        sortable: false,
        Cell: row => (
          <div className="file-manager__item-icon" tabIndex="0">
            <div>
              {row.original.type === "File" ? (
                <i className="material-icons">&#xE24D;</i>
              ) : (
                <i className="material-icons">&#xE2C7;</i>
              )}
            </div>
          </div>
        )
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: row => (
          <div>
            <h5 className="file-manager__item-title">{row.original.name}</h5>
            <span className="file-manager__item-meta">
              Last opened {row.original.lastOpened} ago
            </span>
          </div>
        )
      },
      {
        Header: "Size",
        accessor: "size",
        maxWidth: 100,
        className: "text-center d-flex align-items-center"
      },
      {
        Header: "Type",
        accessor: "type",
        maxWidth: 180,
        className: "text-center d-flex align-items-center"
      },
      {
        Header: "Actions",
        accessor: "actions",
        maxWidth: 300,
        sortable: false,
        Cell: row => (
          <ButtonGroup size="sm" className="d-table ml-auto">
            <Button theme="white" onClick={() => this.handleItemEdit(row)}>
              <i className="material-icons">&#xE254;</i>
            </Button>
            <Button theme="danger" onClick={() => this.handleItemDelete(row)}>
              <i className="material-icons">&#xE872;</i>
            </Button>
          </ButtonGroup>
        )
      }
    ];

    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="File Manager" subtitle="Dashboards" className="text-sm-left mb-3" />
          <Col className="d-flex">
            <ButtonGroup size="sm" className="d-inline-flex my-auto ml-auto mr-auto mr-sm-0">
              <Button theme="white" tag={NavLink} to="/file-manager-list">
                <i className="material-icons">&#xE8EF;</i>
              </Button>
              <Button theme="white" tag={NavLink} to="/file-manager-cards">
                <i className="material-icons">&#xE8F0;</i>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>

        <Card className="file-manager file-manager-list p-0">
          <CardHeader className="text-center p-0">
            {/* Filters */}
            <Container fluid className="file-manager__filters border-bottom">
              <Row>
                {/* Filters :: Page Size */}
                <Col className="file-manager__filters__rows d-flex">
                  <span>Show</span>
                  <FormSelect
                    size="sm"
                    onChange={this.handlePageSizeChange}
                    value={this.state.pageSize}
                  >
                    {pageSizeOptions.map((size, idx) => (
                      <option key={idx} value={size}>
                        {size} rows
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Filters :: Search */}
                <Col className="file-manager__filters__search d-flex">
                  <InputGroup seamless size="sm" className="ml-auto">
                    <InputGroupAddon type="prepend">
                      <InputGroupText>
                        <i className="material-icons">search</i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <FormInput onChange={this.handleFilterSearch} />
                  </InputGroup>
                </Col>
              </Row>
            </Container>

            {/* Dropzone */}
            <FileDropzone />
          </CardHeader>

          {/* Data Table */}
          <CardBody className="p-0">
            <ReactTable
              columns={tableColumns}
              data={tableData}
              pageSize={pageSize}
              showPageSizeOptions={false}
              resizable={false}
            />
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default FileManagerList;
