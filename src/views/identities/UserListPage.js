import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactTable from "react-table";
import { connect } from "react-redux";
import { store } from "../../redux/store/store";
import PageTitle from "../../components/common/PageTitle";
import DialogBox from "../../components/common/DialogBox";
import { deleteUserAction } from "../../redux/actions/UiActions";
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

const UserListPage = ({ users, pageSizeOptions = [10] }) => {
  const { t } = useTranslation();
  let history = useHistory();
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [modalStatus, setModalStatus] = useState(false);
  const [rowTobeDeleted, setRowTobeDeleted] = useState(null);
  const tableColumns = [
    {
      Header: "#",
      accessor: "id",
      maxWidth: 60,
      className: "text-center"
    },
    {
      Header: "UID",
      accessor: "uid",
      className: "text-center",
      minWidth: 100
    },
    {
      Header: t("user.displayName"),
      accessor: "displayName",
      className: "text-center",
      minWidth: 100
    },
    {
      Header: t("user.firstName"),
      accessor: "firstName",
      className: "text-center",
      minWidth: 100
    },
    {
      Header: t("user.email"),
      accessor: "email",
      className: "text-center",
      minWidth: 200
    },
    {
      Header: t("user.size"),
      accessor: "size",
      maxWidth: 50,
      className: "text-center"
    },
    {
      Header: t("user.status"),
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
      Header: t("user.actions"),
      accessor: "actions",
      maxWidth: 150,
      minWidth: 100,
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
          <Button theme="white" onClick={() => showDialogBox(row)}>
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
      return "warning";
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
  function handleGoToUserAddPage() {
    return history.push("/user_add");
  }
  function handleItemEdit(row) {
    alert(`Editing group "${row.original.id}"!`);
  }
  function toggle() {
    setModalStatus(!modalStatus);
  }
  function showDialogBox(row) {
    setRowTobeDeleted(row);
    setModalStatus(true);
  }
  function handleItemDelete(row) {
    if (row != null && row.original != null) {
      store.dispatch(deleteUserAction(row.original));
      setModalStatus(false);
    }
  }
  function handleItemViewDetails(row) {
    alert(`Viewing details for "${row.original.id}"!`);
  }
  return (
    <Container fluid className="main-content-container px-2 pb-4">
      <DialogBox
        status={modalStatus}
        handleAccept={() => handleItemDelete(rowTobeDeleted)}
        toggle={toggle}
      ></DialogBox>
      <Row noGutters className="page-header py-1">
        <PageTitle
          title={t("users.title")}
          subtitle="IDENTITIES"
          className="text-sm-left mb-3"
        />
        <Col sm="1" className="d-flex ml-auto my-auto">
          <ButtonGroup size="sm" className="d-table mx-auto">
            <Button
              theme="primary"
              className="btn-lg"
              onClick={() => handleGoToUserAddPage()}
            >
              <i className="material-icons">add</i>
              {t("button.add")}
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
              data={users}
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
    users: state.users.data,
    pageSizeOptions: state.application.pageSizeOptions
  };
}
export default connect(mapStateToProps)(UserListPage);
