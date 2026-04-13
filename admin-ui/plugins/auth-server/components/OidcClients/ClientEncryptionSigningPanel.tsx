import { useMemo } from 'react'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { DOC_CATEGORY } from './constants'
import { useStyles } from './styles/ClientEncryptionSigningPanel.style'
import type { ClientEncryptionSigningPanelProps } from './types'

function toStringArray(val: string[] | undefined): string[] {
  return Array.isArray(val) ? val : []
}

function ClientEncryptionSigningPanel({
  formik,
  oidcConfiguration,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientEncryptionSigningPanelProps) {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`

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
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'JWTs URI': e.target.value })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.jwks"
            name="jwks"
            formik={formik}
            value={formik.values.jwks as string | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, JWTs: e.target.value })
            }}
          />
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.id_token')}</h2>
        <div className={gridClass}>
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
                setModifiedFields({ ...modifiedFields, 'Id Token Signed Response': e.target.value })
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
                  'Id Token Encrypted Response Alg': e.target.value,
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
                  'Id Token Encrypted Response Enc': e.target.value,
                })
              }}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.access_token')}</h2>
        <div className={gridClass}>
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
                setModifiedFields({ ...modifiedFields, 'Access Token Signing Alg': e.target.value })
              }}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.userinfo')}</h2>
        <div className={gridClass}>
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
                  'User Info Signed Response Alg': e.target.value,
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
                  'User Info Encrypted Response Alg': e.target.value,
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
                  'User Info Encrypted Response Enc': e.target.value,
                })
              }}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.JARM')}</h2>
        <div className={gridClass}>
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
                  'Authorization Signed Response Alg': e.target.value,
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
                  'Authorization Encrypted Response Alg': e.target.value,
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
                  'Authorization Encrypted Response Enc': e.target.value,
                })
              }}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.request_object')}</h2>
        <div className={gridClass}>
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
                  'Request Object Signing Alg': e.target.value,
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
                  'Request Object Encryption Alg': e.target.value,
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
                  'Request Object Encryption Enc': e.target.value,
                })
              }}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>{t('titles.introspection_object')}</h2>
        <div className={gridClass}>
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
                  'Introspection Encrypted Response Alg': e.target.value,
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
                  'Introspection Encrypted Response Enc': e.target.value,
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientEncryptionSigningPanel
