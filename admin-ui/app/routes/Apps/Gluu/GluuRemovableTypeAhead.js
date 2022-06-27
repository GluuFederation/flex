import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuTooltip from './GluuTooltip'
import { Typeahead } from 'react-bootstrap-typeahead'

function GluuRemovableTypeAhead({
  label,
  name,
  value,
  formik,
  values,
  lsize,
  rsize,
  handler,
  doc_category,
  options,
  isDirect,
}) {
  const { t } = useTranslation()
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
              allowNew
              emptyLabel=""
              labelKey={name}
              onChange={(selected) => {
                console.log('SELECTED', selected)
                if (formik) {
                  formik.setFieldValue(name, selected)
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
        <div
          style={{
            float: 'right',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '5px',
            width: '25px',
            height: '25px',
            marginTop: '0px',
            marginRight: '-10px',
          }}
          onClick={handler}
        >
          <i className={'fa fa-fw fa-close'} style={{ color: 'red' }}></i>
        </div>
      </FormGroup>
    </GluuTooltip>
  )
}

GluuRemovableTypeAhead.defaultProps = {
  values: [],
  lsize: 3,
  rsize: 9,
}

export default GluuRemovableTypeAhead
