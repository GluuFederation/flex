import { Container } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import { DOC_CATEGORY } from './constants'
import { getClientAttributeValue } from './helper/utils'
import type { ClientPanelProps } from './types'

const POST_URI_ID = 'post_uri_id'
const BACKCHANNEL_URI_ID = 'backchannel_uri_id'
const EMPTY_OPTIONS: string[] = []

const acceptAnyUriValidator = (_value: string): boolean => true

const ClientLogoutPanel = ({
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientPanelProps): JSX.Element => {
  const { t } = useTranslation()

  const backchannelLogoutUri = getClientAttributeValue<string[]>(
    formik.values,
    'backchannelLogoutUri',
    [],
  )
  const backchannelLogoutSessionRequired = getClientAttributeValue<boolean>(
    formik.values,
    'backchannelLogoutSessionRequired',
  )

  return (
    <Container>
      <GluuInputRow
        label="fields.frontChannelLogoutUri"
        name="frontChannelLogoutUri"
        formik={formik}
        value={(formik.values.frontChannelLogoutUri as string) ?? ''}
        doc_category={DOC_CATEGORY}
        lsize={4}
        rsize={8}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Front Channel Logout Uri': e.target.value,
          })
        }}
      />
      <GluuTypeAheadWithAdd
        name="postLogoutRedirectUris"
        label="fields.post_logout_redirect_uris"
        formik={formik}
        placeholder={t('placeholders.post_logout_redirect_uris')}
        value={(formik.values.postLogoutRedirectUris as string[]) || []}
        options={EMPTY_OPTIONS}
        validator={acceptAnyUriValidator}
        inputId={POST_URI_ID}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handler={(_name, items) => {
          setModifiedFields({
            ...modifiedFields,
            'Post Logout Redirect Uris': items,
          })
        }}
      />

      <GluuTypeAheadWithAdd
        name="attributes.backchannelLogoutUri"
        label="fields.backchannelLogoutUri"
        formik={formik}
        placeholder={`${t('Enter a valid uri with pattern')} https://`}
        value={backchannelLogoutUri ?? []}
        options={EMPTY_OPTIONS}
        validator={acceptAnyUriValidator}
        inputId={BACKCHANNEL_URI_ID}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handler={(_name, items) => {
          setModifiedFields({
            ...modifiedFields,
            'Backchannel Logout Uri': items,
          })
        }}
      />
      <GluuBooleanSelectBox
        name="attributes.backchannelLogoutSessionRequired"
        label="fields.backchannelLogoutSessionRequired"
        value={backchannelLogoutSessionRequired}
        formik={formik}
        lsize={4}
        rsize={8}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handler={() => {
          setModifiedFields({
            ...modifiedFields,
            'Logout Session Required': !backchannelLogoutSessionRequired,
          })
        }}
      />

      <GluuToogleRow
        name="frontChannelLogoutSessionRequired"
        lsize={4}
        rsize={8}
        formik={formik}
        label="fields.frontChannelLogoutSessionRequired"
        value={Boolean(formik.values.frontChannelLogoutSessionRequired)}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handler={(e) => {
          setModifiedFields({
            ...modifiedFields,
            'Front Channel Logout Session Required': e.target.value,
          })
        }}
      />
    </Container>
  )
}

export default ClientLogoutPanel
