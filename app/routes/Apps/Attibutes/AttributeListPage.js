import React from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";

import { Container } from "./../../../components";
const AttributeListPage = ({ attributes }) => {
  return (
    <React.Fragment>
      <Container>
        {/* START Content */}
        <MaterialTable
          columns={[
            { title: "Name", field: "name" },
            { title: "Soyadı", field: "surname" },
            { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
            {
              title: "Doğum Yeri",
              field: "birthCity",
              lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
            }
          ]}
          data={attributes}
          title="Attributes"
          actions={[
            {
              icon: 'Edit',
              tooltip: 'Edit Attribute',
              onClick: (event, rowData) => alert("You saved " + rowData.name)
            },
            rowData => ({
              icon: 'delete',
              tooltip: 'Delete Attribute',
              onClick: (event, rowData) => confirm("You want to delete " + rowData.name),
              disabled: rowData.birthYear < 2000
            })
          ]}
        />
        {/* END Content */}
      </Container>
    </React.Fragment>
  );
};
function mapStateToProps(state) {
  return {
    attributes: state.attributes
  };
}
export default connect(mapStateToProps)(AttributeListPage);
