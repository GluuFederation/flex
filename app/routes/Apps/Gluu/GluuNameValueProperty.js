import React, { useState, useEffect } from "react";
import { FormGroup, Col, Row, Button, Input } from "../../../components";
import GluuLabel from "../Gluu/GluuLabel";

function GluuNameValueProperty({
  nameValueLabel,
  name,
  formik = null,
  keyId,
  keyName,
  keyLabel = "Key",
  keyPlaceholder = "Enter key",
  valueId,
  valueName,
  valueLabel = "Value",
  valuePlaceholder = "Enter value",
  dataArr = [],
}) {
  const [dataArray, setDataArray] = useState(dataArr);

  const addClick = () => {
    setDataArray((prevDataArray) => [...prevDataArray, { key: "", value: "" }]);
  };

  const handleChange = (i) => (e) => {
    const { name, value } = e.target;

    const newDataArr = [...dataArray];
    newDataArr[i] = { ...newDataArr[i], [name]: value };

    setDataArray(newDataArr);

    formik.setFieldValue(name, newDataArr);
  };

  const removeClick = (i) => {
    const newDataArray = [...dataArray];
    newDataArray.splice(i, 1);
    setDataArray(newDataArray);
    formik.setFieldValue(name, newDataArray);
  };

  return (
    <Row>
      <GluuLabel label={nameValueLabel} size={9} />

      <input type="button" value="Add more" onClick={addClick} />

      {dataArray.map((element, index) => (
        <div key={index}>
          <FormGroup row>
            <GluuLabel label={keyLabel} />
            <Col sm={9}>
              <Input
                placeholder={keyPlaceholder}
                id={keyId}
                name={keyName}
                defaultValue={element.key}
                onChange={handleChange(index)}
              />
            </Col>

            <GluuLabel label={valueLabel} />
            <Col sm={9}>
              <Input
                placeholder={valuePlaceholder}
                id={valueId}
                name={valueName}
                defaultValue={element.value}
                onChange={handleChange(index)}
              />
            </Col>
            <Col sm={3}>
              <input
                type="button"
                value="remove"
                onClick={() => removeClick(index)}
              />
            </Col>
          </FormGroup>
        </div>
      ))}
    </Row>
  );
}

export default GluuNameValueProperty;
