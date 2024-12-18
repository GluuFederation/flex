import React from "react";
import GluuLabel from "./GluuLabel";
import { Col, FormGroup, InputGroup } from "Components";
import { useTranslation } from "react-i18next";
import GluuTooltip from "./GluuTooltip";
import { Typeahead } from "react-bootstrap-typeahead";
import applicationstyle from "./styles/applicationstyle";
import PropTypes from 'prop-types';
function GluuRemovableTypeAhead({
  label,
  name,
  value,
  formik,
  lsize = 3,
  rsize = 9,
  handler,
  doc_category,
  options = [],
  isDirect,
  allowNew = true,
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
            <Typeahead
              allowNew={allowNew}
              emptyLabel=""
              labelKey={name}
              onChange={(selected) => {
                if (formik) {
                  const names = selected.map(item => {
                    if (typeof item === 'string') {
                      return item; // String element (from stringArray)
                    } else if (typeof item === 'object' && item.role) {
                      return item.role; // Role property from objectArray
                    }
                    return null; // Ignore if not matching criteria
                  }).filter(Boolean);

                  setModifiedFields({ ...modifiedFields, [name]: names });
                  formik.setFieldValue(name, selected);
                }
              }}
              id={name}
              data-testid={name}
              name={name}
              multiple={true}
              defaultSelected={value}
              options={options}
            />
          </InputGroup>
        </Col>
        <div style={applicationstyle.removableInputRow} onClick={handler}>
          <i className={"fa fa-fw fa-close"} style={{ color: "red" }}></i>
        </div>
      </FormGroup>
    </GluuTooltip>
  );
}

GluuRemovableTypeAhead.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  formik: PropTypes.any,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  handler: PropTypes.func,
  doc_category: PropTypes.string,
  options: PropTypes.array,
  isDirect: PropTypes.bool,
  allowNew: PropTypes,
  modifiedFields: PropTypes.any,
  setModifiedFields: PropTypes.func,
};
export default GluuRemovableTypeAhead;
