import React from "react";
import MaterialTable from "material-table";
import { attributes } from "../Attibutes/attributes";
import AttributeDetailPage from "../Attibutes/AttributeDetailPage";
import { Badge } from "reactstrap";
const AttributeListPage = () => {
  function getBadgeTheme(status) {
    if (status === "ACTIVE") {
      return "primary";
    } else {
      return "warning";
    }
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
        title="Attributes"
        actions={[
          {
            icon: "add",
            tooltip: "Add Attribute",
            isFreeAction: true,
            onClick: event => alert("You want to add a new attribute")
          },
          {
            icon: "edit",
            iconProps: { color: "primary" },
            tooltip: "Edit Attribute",
            onClick: (event, rowData) =>
              alert("You Want to edit " + rowData.inum)
          },
          rowData => ({
            icon: "delete",
            iconProps: { color: "secondary" },
            tooltip: "Delete Attribute",
            onClick: (event, rowData) =>
              confirm("You want to delete " + rowData.inum),
            disabled: false
          })
        ]}
        options={{
          search: true,
          selection: false,
          headerStyle: {
            backgroundColor: "#01579b",
            color: "#FFF",
            fontSize: "18px"
          },
          actionsColumnIndex: -1
        }}
        detailPanel={rowData => {
          return <AttributeDetailPage row={rowData} />;
        }}
      />
      {/* END Content */}
    </React.Fragment>
  );
};
export default AttributeListPage;
