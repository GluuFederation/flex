import React, { useState } from 'react';
import { FormGroup, Col, Row, Button, Input } from '../../../components';
import { Typeahead } from 'react-bootstrap-typeahead';
import GluuLabel from '../Gluu/GluuLabel';
import GluuTooltip from './GluuTooltip';
import applicationStyle from './styles/applicationstyle';
import { useTranslation } from 'react-i18next';

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
}) {
  const [items, setItems] = useState(value);
  const [opts, setOpts] = useState(options);
  const { t } = useTranslation();

  const addItem = () => {
    const newItem = document.getElementById(inputId).value;
    document.getElementById(inputId).value = '';
    if (validator(newItem)) {
      items.push(newItem);
      opts.push(newItem);
      setItems(items);
      formik.setFieldValue(name, items);
    }
  };

  const handleChange = (aName, selected) => {
    setOpts(selected);
    setItems(selected);
    formik.setFieldValue(aName, selected);
  };

  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={4} />
        <Col
          sm={8}
          style={{
            borderStyle: 'solid',
            borderRadius: '5px',
            borderColor: '#03a96d',
          }}
        >
          &nbsp;
          <Row>
            <Col sm={10}>
              <Input
                placeholder={placeholder}
                id={inputId}
                data-testid="new_entry"
                aria-label="new_entry"
              />
            </Col>
            <Button
              color="primary"
              type="button"
              style={applicationStyle.buttonStyle}
              onClick={addItem}
            >
              <i className="fa fa-plus-circle mr-2"></i>
              {t('actions.add')}
            </Button>
          </Row>
          &nbsp;
          <Typeahead
            emptyLabel=""
            labelKey={name}
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
    </GluuTooltip>
  );
}

export default GluuTypeAheadWithAdd;
