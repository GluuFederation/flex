import GluuLabel from './GluuLabel'
import { Col, FormGroup, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuTooltip from './GluuTooltip'
import { Typeahead } from 'react-bootstrap-typeahead'
import applicationstyle from './styles/applicationstyle'
import customColors from '@/customColors'

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
  disabled = false,
  placeholder,
}: any) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize - 1}>
          <InputGroup>
            <Typeahead
              allowNew={allowNew}
              emptyLabel=""
              labelKey={name}
              onChange={(selected: any) => {
                if (formik) {
                  const names = selected
                    .map((item: any) => {
                      if (typeof item === 'string') {
                        return item // String element (from stringArray)
                      } else if (typeof item === 'object' && item.role) {
                        return item.role // Role property from objectArray
                      }
                      return null // Ignore if not matching criteria
                    })
                    .filter(Boolean)

                  setModifiedFields({ ...modifiedFields, [name]: names })
                  formik.setFieldValue(name, selected)
                }
              }}
              id={name}
              data-testid={name}
              multiple={true}
              defaultSelected={value}
              options={options}
              disabled={disabled}
              placeholder={placeholder}
            />
          </InputGroup>
        </Col>
        <div style={applicationstyle.removableInputRow as any} onClick={handler}>
          <i className={'fa fa-fw fa-close'} style={{ color: customColors.accentRed }}></i>
        </div>
      </FormGroup>
    </GluuTooltip>
  )
}
export default GluuRemovableTypeAhead
