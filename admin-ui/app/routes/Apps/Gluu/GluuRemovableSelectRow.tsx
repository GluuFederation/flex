import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuTooltip from './GluuTooltip'
import applicationstyle from './styles/applicationstyle'
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
}: any) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
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
              onChange={(e: any) => {
                setModifiedFields({
                  ...modifiedFields,
                  [name]: e.target.value,
                })
                formik.handleChange(e)
              }}
            >
              <option value="">{t('actions.choose')}...</option>
              {values.map((item: any, key: any) => (
                <option value={item.cca2} key={key}>
                  {item.name}
                </option>
              ))}
            </CustomInput>
          </InputGroup>
        </Col>
        <div style={applicationstyle.removableInputRow as any} onClick={handler}>
          <i className={'fa fa-fw fa-close'} style={{ color: 'red' }}></i>
        </div>
      </FormGroup>
    </GluuTooltip>
  )
}
export default GluuRemovableSelectRow
