import React, { useState } from "react";
import MaterialTable from "material-table";
import { attributes } from "../Attibutes/attributes";
import AttributeDetailPage from "../Attibutes/AttributeDetailPage";
import { useHistory } from "react-router-dom";
import { Badge } from "reactstrap";
import GluuDialog from "../Gluu/GluuDialog";
const AttributeListPage = () => {
  const history = useHistory();
  const [item, setItem] = useState(attributes[0]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  function getBadgeTheme(status) {
    if (status === "ACTIVE") {
      return "primary";
    } else {
      return "warning";
    }
  }
  function handleGoToAttributeAddPage() {
    return history.push("/attribute/new");
  }
  function handleGoToAttributeEditPage(row) {
    return history.push(`/attribute/edit:` + row.inum);
  }
  function handleAttribueDelete(row) {
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
          { title: "Inum", field: "inum" },
          { title: "Name", field: "name" },
          { title: "Display Name", field: "displayName" },
          { title: "Data Type", field: "dataType" },
          {
            title: "Status",
            field: "status",
            type: "boolean",
            render: rowData => (
              <Badge color={getBadgeTheme(rowData.status)}>
                {rowData.status}
              </Badge>
            )
          }
        ]}
        data={attributes}
        isLoading={false}
        title="Attributes"
        actions={[
          rowData => ({
            icon: "edit",
            iconProps: {
              color: "primary",
              id: "editAttribute" + rowData.inum
            },
            tooltip: "Edit Attribute",
            onClick: (event, rowData) => handleGoToAttributeEditPage(rowData),
            disabled: false
          }),
          {
            icon: "add",
            tooltip: "Add Attribute",
            iconProps: { color: "primary" },
            isFreeAction: true,
            onClick: () => handleGoToAttributeAddPage()
          },
          rowData => ({
            icon: "delete",
            iconProps: {
              color: "secondary",
              id: "deleteAttribute" + rowData.inum
            },
            tooltip: "Delete Attribute",
            onClick: (event, rowData) => handleAttribueDelete(rowData),
            disabled: false
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
          return <AttributeDetailPage row={rowData} />;
        }}
      />
      {/* END Content */}
      <GluuDialog
        row={item}
        handler={toggle}
        modal={modal}
        onAccept={onDeletionConfirmed}
      />
    </React.Fragment>
  );
};
export default AttributeListPage;
