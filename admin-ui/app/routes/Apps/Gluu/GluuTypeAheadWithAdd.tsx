// @ts-nocheck
import React, { useState, useContext } from "react";
import { FormGroup, Col, Row, Button, Input } from "Components";
import { Typeahead } from "react-bootstrap-typeahead";
import GluuLabel from "../Gluu/GluuLabel";
import applicationStyle from "./styles/applicationstyle";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "Context/theme/themeContext";
import PropTypes from "prop-types";

function GluuTypeAheadWithAdd({
  label,
  name,
  value,
  placeholder,
  options,
  formik,
  validator,
  inputId,
  doc_category,
  lsize = 4,
  rsize = 8,
  disabled = false,
  handler = null,
}) {
  const [items, setItems] = useState(value);
  const [opts, setOpts] = useState(options);
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;

  const addItem = () => {
    const newItem = document.getElementById(inputId).value;
    document.getElementById(inputId).value = "";
    if (validator(newItem)) {
      const updatedItems = items ? [...items] : [];
      updatedItems.push(newItem);

      const temp = opts ? [...opts] : [];
      temp.push(...updatedItems);
    
      setOpts(temp);
      setItems(updatedItems);
      formik.setFieldValue(name, updatedItems);

      if (handler) {
        handler(name, updatedItems);
      }
    }
  };

  const handleChange = (aName, selected) => {
    setOpts(selected);
    setItems(selected);
    formik.setFieldValue(aName, selected);
  };

  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        doc_entry={name}
      />
      <Col
        sm={rsize}
        style={{
          borderStyle: "solid",
          borderRadius: "5px",
          borderColor: "#03a96d",
        }}
      >
        &nbsp;
        <Row>
          <Col sm={10}>
            <Input
              placeholder={placeholder}
              id={inputId}
              disabled={disabled}
              data-testid="new_entry"
              aria-label="new_entry"
            />
          </Col>
          <Col>
            <Button
              color={`primary-${selectedTheme}`}
              type="button"
              disabled={disabled}
              style={applicationStyle.buttonStyle}
              onClick={addItem}
              data-testid={t("actions.add")}
            >
              <i className="fa fa-plus-circle me-2"></i>
              {t("actions.add")}
            </Button>
          </Col>
        </Row>
        &nbsp;
        <Typeahead
          emptyLabel=""
          labelKey={name}
          disabled={disabled}
          onChange={(selected) => {
            handleChange(name, selected);
          }}
          id={name}
          name={name}
          data-testid={name}
          multiple={true}
          selected={items}
          options={opts}
        />
        &nbsp;
      </Col>
    </FormGroup>
  );
}

GluuTypeAheadWithAdd.protoTypes ={
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  formik: PropTypes.object,
  validator: PropTypes.func,
  inputId: PropTypes.string,
  doc_category: PropTypes.string,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  disabled: PropTypes.bool,
  handler: PropTypes.func,
}
export default GluuTypeAheadWithAdd;
