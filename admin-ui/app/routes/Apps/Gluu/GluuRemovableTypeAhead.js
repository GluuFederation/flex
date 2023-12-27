import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuTooltip from './GluuTooltip'
import { Typeahead } from 'react-bootstrap-typeahead'
import applicationstyle from './styles/applicationstyle'

function GluuRemovableTypeAhead({
  label,
  name,
  value,
  formik,
  lsize,
  rsize,
  handler,
  doc_category,
  options,
  isDirect,
  allowNew = true,
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
              allowNew={allowNew}
              emptyLabel=""
              labelKey={name}
              onChange={(selected) => {
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
          style={applicationstyle.removableInputRow}
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
