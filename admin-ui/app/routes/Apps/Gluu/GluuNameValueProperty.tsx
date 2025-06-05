import React, { useState, useContext } from "react";
import { FormGroup, Col, Input, Button, Accordion, AccordionHeader, AccordionBody } from "Components";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "Context/theme/themeContext";

function GluuNameValueProperty({
  nameValueLabel,
  componentName,
  formik = null,
  keyId,
  keyName,
  keyPlaceholder,
  valueId,
  valueName,
  valuePlaceholder,
  dataArr = [],
}: any) {
  const [dataArray, setDataArray] = useState(dataArr);
  const { t } = useTranslation();
  const theme: any = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const addClick = () => {
    setDataArray((prevDataArray: any) => [
      ...prevDataArray,
      { key: "", value: "" },
    ]);
  };

  const handleChange = (i: any) => (e: any) => {
    const { name, value } = e.target;
    const newDataArr = [...dataArray];
    newDataArr[i] = { ...newDataArr[i], [name]: value };
    setDataArray(newDataArr);
    formik.setFieldValue(componentName, newDataArr);
  };

  const removeClick = (i: any) => {
    const newDataArray = [...dataArray];
    newDataArray.splice(i, 1);
    setDataArray(newDataArray);
    formik.setFieldValue(componentName, newDataArray);
  };

  return (
    <Accordion className="mb-2 b-primary" initialOpen>
      <AccordionHeader>{t(nameValueLabel).toUpperCase()}</AccordionHeader>
      <AccordionBody>
        <Button
          style={{ float: "right", marginTop: -30 }}
          type="button"
          color={`primary-${selectedTheme}`}
          onClick={addClick}
        >
          <i className="fa fa-fw fa-plus me-2"></i>
          {t("actions.add_property")}
        </Button>
        <FormGroup row>
          <Col sm={12}>
            {dataArray.map((element: any, index: any) => (
              <FormGroup key={index} row>
                <Col sm={4}>
                  <Input
                    placeholder={
                      keyPlaceholder
                        ? t(keyPlaceholder)
                        : t("placeholders.enter_property_key")
                    }
                    id={keyId}
                    name={keyName}
                    defaultValue={element.key}
                    onChange={handleChange(index)}
                  />
                </Col>
                <Col sm={6}>
                  <Input
                    placeholder={
                      valuePlaceholder
                        ? t(valuePlaceholder)
                        : t("placeholders.enter_property_value")
                    }
                    id={valueId}
                    name={valueName}
                    defaultValue={element.value}
                    onChange={handleChange(index)}
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => removeClick(index)}
                  >
                    <i className="fa fa-fw fa-trash me-2"></i>
                    {t("actions.remove")}
                  </Button>
                </Col>
              </FormGroup>
            ))}
          </Col>
        </FormGroup>
      </AccordionBody>
    </Accordion>
  );
}

export default GluuNameValueProperty;
