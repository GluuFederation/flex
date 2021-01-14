import React from "react";
import { FormGroup, Label, Badge } from "../../../components";
function GluuFormDetailRow({ label, value, isBagde }) {
  return (
    <FormGroup row>
      <Label for="input" sm={6}>
        {label}:
      </Label>
      <Label for="input" sm={6}>
        {!isBagde ? value : <Badge color="primary">{value}</Badge>}
      </Label>
    </FormGroup>
  );
}
export default GluuFormDetailRow;
