import React, { useState } from "react";
import MaterialTable from "material-table";
import { useHistory } from "react-router-dom";
import { Badge } from "reactstrap";
import { clients } from "../Clients/clients";
import GluuDialog from "../Gluu/GluuDialog";
import ClientDetailPage from "../Clients/ClientDetailPage";
const ClientListPage = () => {
  const history = useHistory();
  const [item, setItem] = useState(clients[0]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  function getBadgeTheme(status) {
    if (!status) {
      return "primary";
    } else {
      return "warning";
    }
  }

  function getTrustedTheme(status) {
    if (status) {
      return "success";
    } else {
      return "info";
    }
  }
  function getClientStatus(status) {
    if (!status) {
      return "Enabled";
    } else {
      return "Disabled";
    }
  }
  function handleGoToClientAddPage() {
    return history.push("/client/new");
  }
  function handleGoToClientEditPage(row) {
    return history.push(`/client/edit:` + row.inum);
  }
  function handleClientDelete(row) {
    setItem(row);
    toggle();
  }
  function onDeletionConfirmed() {
    // perform delete request
    toggle();
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <MaterialTable
        columns={[
          { title: "Client Name", field: "clientName" },
          { title: "App Type", field: "applicationType" },
          { title: "Subject Type", field: "subjectType" },
          {
            title: "Status",
            field: "disabled",
            type: "boolean",
            render: rowData => (
              <Badge color={getBadgeTheme(rowData.disabled)}>
                {getClientStatus(rowData.disabled)}
              </Badge>
            )
          },
          {
            title: "Trusted",
            field: "trustedClient",
            type: "boolean",
            render: rowData => (
              <Badge color={getTrustedTheme(rowData.trustedClient)}>
                {rowData.trustedClient ? "Yes" : "No"}
              </Badge>
            )
          }
        ]}
        data={clients}
        isLoading={false}
        title="OpenId Connect Clients"
        actions={[
          rowData => ({
            icon: "edit",
            iconProps: {
              color: "primary",
              id: "editClient" + rowData.inum
            },
            tooltip: "Edit Client",
            onClick: (event, rowData) => handleGoToClientEditPage(rowData),
            disabled: false
          }),
          {
            icon: "add",
            tooltip: "Add Client",
            iconProps: { color: "primary" },
            isFreeAction: true,
            onClick: () => handleGoToClientAddPage()
          },
          rowData => ({
            icon: "delete",
            iconProps: {
              color: "secondary",
              id: "deleteClient" + rowData.inum
            },
            tooltip: rowData.deletable
              ? "Delete Client"
              : "This Client can't be detele",
            onClick: (event, rowData) => handleClientDelete(rowData),
            disabled: !rowData.deletable
          })
        ]}
        options={{
          search: true,
          selection: false,
          headerStyle: {
            backgroundColor: "#01579b",
            color: "#FFF",
            padding: "2px",
            textTransform: "uppercase",
            fontSize: "18px"
          },
          actionsColumnIndex: -1
        }}
        detailPanel={rowData => {
          return <ClientDetailPage row={rowData} />;
        }}
      />
      {/* END Content */}
      <GluuDialog
        row={item}
        handler={toggle}
        modal={modal}
        subject="openid connect client"
        onAccept={onDeletionConfirmed}
      />
    </React.Fragment>
  );
};

export default ClientListPage;
