import React from "react";
import GluuLabel from "./GluuLabel";
import { Col, FormGroup, CustomInput, InputGroup } from "Components";
import { useTranslation } from "react-i18next";
import GluuTooltip from "./GluuTooltip";
import applicationstyle from "./styles/applicationstyle";
import PropTypes from "prop-types";
function GluuRemovableSelectRow({
  label,
  name,
  value,
  formik,
  values = [],
  lsize = 3,
  rsize = 9,
  handler,
  doc_category,
  isDirect,
  modifiedFields,
  setModifiedFields,
}) {
  const { t } = useTranslation();
  return (
    <GluuTooltip
      doc_category={doc_category}
      isDirect={isDirect}
      doc_entry={name}
    >
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize - 1}>
          <InputGroup>
            <CustomInput
              type="select"
              id={name}
              data-testid={name}
              name={name}
              defaultValue={value}
              onChange={() => {
                setModifiedFields({
                  ...modifiedFields,
                  [name]: formik.values[name],
                });
                formik.handleChange;
              }}
            >
              <option value="">{t("actions.choose")}...</option>
              {values.map((item, key) => (
                <option value={item.cca2} key={key}>
                  {item.name}
                </option>
              ))}
            </CustomInput>
          </InputGroup>
        </Col>
        <div style={applicationstyle.removableInputRow} onClick={handler}>
          <i className={"fa fa-fw fa-close"} style={{ color: "red" }}></i>
        </div>
      </FormGroup>
    </GluuTooltip>
  );
}

GluuRemovableSelectRow.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  formik: PropTypes.any,
  values: PropTypes.array,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  handler: PropTypes.func,
  doc_category: PropTypes.string,
  isDirect: PropTypes.bool,
  modifiedFields: PropTypes.any,
  setModifiedFields: PropTypes.func,
};
export default GluuRemovableSelectRow;
