import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { toStringArray } from 'Plugins/auth-server/utils'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS, DOC_CATEGORY } from './constants'
import { useStyles } from './components/styles/ClientEncryptionSigningPanel.style'
import type { ClientEncryptionSigningPanelProps } from './types'

const ClientEncryptionSigningPanel = ({
  formik,
  oidcConfiguration,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientEncryptionSigningPanelProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`
  const formErrors = formik.errors as Record<string, string | undefined>
  const formTouched = formik.touched as Record<string, boolean | undefined>
  const getFieldError = useCallback(
    (field: string) => {
      const error = formErrors[field]
      return typeof error === 'string' ? error : ''
    },
    [formErrors],
  )
  const isFieldTouched = useCallback((field: string) => Boolean(formTouched[field]), [formTouched])

  const accessTokenSigningAlg = toStringArray(
    oidcConfiguration?.tokenEndpointAuthSigningAlgValuesSupported,
  )
  const idTokenSignedResponseAlg = toStringArray(
    oidcConfiguration?.idTokenSigningAlgValuesSupported,
  )
  const idTokenEncryptedResponseAlg = toStringArray(
    oidcConfiguration?.idTokenEncryptionAlgValuesSupported,
  )
  const idTokenEncryptedResponseEnc = toStringArray(
    oidcConfiguration?.idTokenEncryptionEncValuesSupported,
  )
  const requestObjectSignedResponseAlg = toStringArray(
    oidcConfiguration?.requestObjectSigningAlgValuesSupported,
  )
  const requestObjectEncryptedResponseAlg = toStringArray(
    oidcConfiguration?.requestObjectEncryptionAlgValuesSupported,
  )
  const requestObjectEncryptedResponseEnc = toStringArray(
    oidcConfiguration?.requestObjectEncryptionEncValuesSupported,
  )
  const userInfoSignedResponseAlg = toStringArray(
    oidcConfiguration?.userInfoSigningAlgValuesSupported,
  )
  const userInfoEncryptedResponseAlg = toStringArray(
    oidcConfiguration?.userInfoEncryptionAlgValuesSupported,
  )
  const userInfoEncryptedResponseEnc = toStringArray(
    oidcConfiguration?.userInfoEncryptionEncValuesSupported,
  )

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.jwks_uri"
            name="jwksUri"
            formik={formik}
            value={formik.values.jwksUri as string | undefined}
            placeholder={getFieldPlaceholder(t, 'fields.jwks_uri')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            showError={isFieldTouched('jwksUri') && Boolean(getFieldError('jwksUri'))}
            errorMessage={getFieldError('jwksUri')}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.JWKS_URI]: e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.jwks"
            name="jwks"
            formik={formik}
            value={formik.values.jwks as string | undefined}
            placeholder={getFieldPlaceholder(t, 'fields.jwks')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            showError={isFieldTouched('jwks') && Boolean(getFieldError('jwks'))}
            errorMessage={getFieldError('jwks')}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.JWKS]: e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.id_token_signed_response_alg"
            formik={formik}
            value={formik.values.idTokenSignedResponseAlg as string | undefined}
            values={idTokenSignedResponseAlg}
            lsize={12}
            rsize={12}
            name="idTokenSignedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.ID_TOKEN_SIGNED_RESPONSE]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.id_token_encrypted_response_alg"
            formik={formik}
            lsize={12}
            rsize={12}
            value={formik.values.idTokenEncryptedResponseAlg as string | undefined}
            values={idTokenEncryptedResponseAlg}
            name="idTokenEncryptedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.ID_TOKEN_ENCRYPTED_RESPONSE_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.id_token_encrypted_response_enc"
            formik={formik}
            value={formik.values.idTokenEncryptedResponseEnc as string | undefined}
            values={idTokenEncryptedResponseEnc}
            lsize={12}
            rsize={12}
            name="idTokenEncryptedResponseEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.ID_TOKEN_ENCRYPTED_RESPONSE_ENC]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.access_token_signing_alg"
            formik={formik}
            value={formik.values.accessTokenSigningAlg as string | undefined}
            values={accessTokenSigningAlg}
            lsize={12}
            rsize={12}
            name="accessTokenSigningAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.ACCESS_TOKEN_SIGNING_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.user_info_signed_response_alg"
            formik={formik}
            value={formik.values.userInfoSignedResponseAlg as string | undefined}
            values={userInfoSignedResponseAlg}
            lsize={12}
            rsize={12}
            name="userInfoSignedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.USER_INFO_SIGNED_RESPONSE_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.user_info_encrypted_response_alg"
            formik={formik}
            value={formik.values.userInfoEncryptedResponseAlg as string | undefined}
            values={userInfoEncryptedResponseAlg}
            lsize={12}
            rsize={12}
            name="userInfoEncryptedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.USER_INFO_ENCRYPTED_RESPONSE_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.user_info_encrypted_response_enc"
            formik={formik}
            value={formik.values.userInfoEncryptedResponseEnc as string | undefined}
            values={userInfoEncryptedResponseEnc}
            lsize={12}
            rsize={12}
            name="userInfoEncryptedResponseEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.USER_INFO_ENCRYPTED_RESPONSE_ENC]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.authorizationSignedResponseAlg"
            formik={formik}
            value={formik.values.attributes?.jansAuthSignedRespAlg as string | undefined}
            values={idTokenSignedResponseAlg}
            lsize={12}
            rsize={12}
            name="attributes.jansAuthSignedRespAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.AUTHORIZATION_SIGNED_RESPONSE_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.authorizationEncryptedResponseAlg"
            formik={formik}
            lsize={12}
            rsize={12}
            value={formik.values.attributes?.jansAuthEncRespAlg as string | undefined}
            values={idTokenEncryptedResponseAlg}
            name="attributes.jansAuthEncRespAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.AUTHORIZATION_ENCRYPTED_RESPONSE_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.authorizationEncryptedResponseEnc"
            formik={formik}
            value={formik.values.attributes?.jansAuthEncRespEnc as string | undefined}
            values={idTokenEncryptedResponseEnc}
            lsize={12}
            rsize={12}
            name="attributes.jansAuthEncRespEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.AUTHORIZATION_ENCRYPTED_RESPONSE_ENC]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.request_object_signing_alg"
            formik={formik}
            value={formik.values.requestObjectSigningAlg as string | undefined}
            values={requestObjectSignedResponseAlg}
            lsize={12}
            rsize={12}
            name="requestObjectSigningAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.REQUEST_OBJECT_SIGNING_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.request_object_encryption_alg"
            formik={formik}
            value={formik.values.requestObjectEncryptionAlg as string | undefined}
            values={requestObjectEncryptedResponseAlg}
            lsize={12}
            rsize={12}
            name="requestObjectEncryptionAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.REQUEST_OBJECT_ENCRYPTION_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.request_object_encryption_enc"
            formik={formik}
            value={formik.values.requestObjectEncryptionEnc as string | undefined}
            values={requestObjectEncryptedResponseEnc}
            lsize={12}
            rsize={12}
            name="requestObjectEncryptionEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.REQUEST_OBJECT_ENCRYPTION_ENC]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.introspection_signed_response_alg"
            formik={formik}
            value={formik.values.attributes?.introspectionSignedResponseAlg as string | undefined}
            values={idTokenSignedResponseAlg}
            lsize={12}
            rsize={12}
            name="attributes.introspectionSignedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.introspection_encrypted_response_alg"
            formik={formik}
            value={
              formik.values.attributes?.introspectionEncryptedResponseAlg as string | undefined
            }
            values={idTokenEncryptedResponseAlg}
            lsize={12}
            rsize={12}
            name="attributes.introspectionEncryptedResponseAlg"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.INTROSPECTION_ENCRYPTED_RESPONSE_ALG]:
                  e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuSelectRow
            label="fields.introspection_encrypted_response_enc"
            formik={formik}
            value={
              formik.values.attributes?.introspectionEncryptedResponseEnc as string | undefined
            }
            values={idTokenEncryptedResponseEnc}
            lsize={12}
            rsize={12}
            name="attributes.introspectionEncryptedResponseEnc"
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_ENCRYPTION_SIGNING_MODIFIED_FIELDS.INTROSPECTION_ENCRYPTED_RESPONSE_ENC]:
                  e.target.value,
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientEncryptionSigningPanel
