import React, { useContext, useMemo } from 'react'
import { Container, Badge, Col, FormGroup, Label } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import GluuSecretDetail from 'Routes/Apps/Gluu/GluuSecretDetail'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import customColors from '@/customColors'
import { DEFAULT_THEME } from '@/context/theme/constants'

const DOC_CATEGORY = 'openid_client'

// Static style objects instantiated once at module scope
const detailContainerStyle = {
  backgroundColor: customColors.whiteSmoke,
  maxHeight: '420px',
  overflowY: 'auto',
  padding: '1rem',
}
const detailGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
  alignItems: 'start',
}
const detailColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
}
const detailValueStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.35rem',
  alignItems: 'center',
}

function ClientDetailPage({ row, scopes }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const detailLabelStyle = useMemo(
    () => ({
      fontWeight: 600,
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      paddingRight: '0.5rem',
      color: customColors.black,
    }),
    [],
  )

  const badgeStyle = useMemo(
    () => ({
      backgroundColor: themeColors.background,
      color: customColors.white,
    }),
    [themeColors.background],
  )

  const scopesDns = row.scopes || []
  const clientScopes = scopes
    .filter((item) => scopesDns.includes(item.dn, 0))
    .map((item) => item.id)
  function extractDescription(customAttributes) {
    const result = customAttributes.filter((item) => item.name === 'description')
    if (result && result.length >= 1) {
      return result[0].values
    }
    return ''
  }

  const dash = '-'
  const description = row.description || extractDescription(row.customAttributes || []) || dash
  const displayName = row.clientName || row.displayName || dash

  const renderBadgeList = (items) => (
    <div style={detailValueStyle}>
      {items?.length
        ? items.map((item, key) => (
            <Badge key={key} style={badgeStyle}>
              {item}
            </Badge>
          ))
        : dash}
    </div>
  )

  return (
    <React.Fragment>
      <Container style={detailContainerStyle}>
        <div style={detailGridStyle}>
          {/* Column 1 */}
          <div style={detailColumnStyle}>
            <GluuFormDetailRow
              label="fields.client_id"
              value={row.inum}
              lsize={4}
              rsize={8}
              labelStyle={detailLabelStyle}
              rowClassName="align-items-start"
              doc_category={DOC_CATEGORY}
              doc_entry="clientId"
            />
            <GluuFormDetailRow
              label="fields.name"
              value={displayName}
              lsize={4}
              rsize={8}
              labelStyle={detailLabelStyle}
              rowClassName="align-items-start"
              doc_category={DOC_CATEGORY}
              doc_entry="displayName"
            />
            <GluuFormDetailRow
              label="fields.subject_type"
              value={row.subjectType ? row.subjectType : dash}
              lsize={4}
              rsize={8}
              labelStyle={detailLabelStyle}
              rowClassName="align-items-start"
              doc_category={DOC_CATEGORY}
              doc_entry="subjectType"
            />
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.is_trusted_client')}:
              </Label>
              <Col sm={8}>
                <div style={detailValueStyle}>
                  {row.trustedClient ? (
                    <Badge style={badgeStyle}>{t('options.yes')}</Badge>
                  ) : (
                    <Badge style={badgeStyle}>{t('options.no')}</Badge>
                  )}
                </div>
              </Col>
            </FormGroup>
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.scopes')}:
              </Label>
              <Col sm={8}>{renderBadgeList(clientScopes)}</Col>
            </FormGroup>
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.response_types')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.responseTypes)}</Col>
            </FormGroup>
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.logout_redirect_uris')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.postLogoutRedirectUris)}</Col>
            </FormGroup>
          </div>

          {/* Column 2 */}
          <div style={detailColumnStyle}>
            <GluuSecretDetail
              label="fields.client_secret"
              value={row.clientSecret ? row.clientSecret : dash}
              lsize={4}
              rsize={8}
              labelStyle={detailLabelStyle}
              rowClassName="align-items-start mb-2"
              doc_category={DOC_CATEGORY}
              doc_entry="clientSecret"
            />
            <GluuFormDetailRow
              label="fields.description"
              value={description}
              lsize={4}
              rsize={8}
              labelStyle={detailLabelStyle}
              rowClassName="align-items-start"
              doc_category={DOC_CATEGORY}
              doc_entry="description"
            />
            <GluuFormDetailRow
              label="fields.application_type"
              value={row.applicationType}
              lsize={4}
              rsize={8}
              labelStyle={detailLabelStyle}
              rowClassName="align-items-start"
              doc_category={DOC_CATEGORY}
              doc_entry="applicationType"
            />
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.status')}:
              </Label>
              <Col sm={8}>
                <div style={detailValueStyle}>
                  {!row.disabled ? (
                    <Badge style={badgeStyle}>{t('options.enabled')}</Badge>
                  ) : (
                    <Badge style={badgeStyle}>{t('options.disabled')}</Badge>
                  )}
                </div>
              </Col>
            </FormGroup>
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.grant_types')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.grantTypes)}</Col>
            </FormGroup>
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.login_uris')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.redirectUris)}</Col>
            </FormGroup>
            <FormGroup row className="align-items-start mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.authentication_method')}:
              </Label>
              <Col sm={8}>
                <div style={detailValueStyle}>
                  {row.authenticationMethod ? (
                    <Badge style={badgeStyle}>{row.authenticationMethod}</Badge>
                  ) : (
                    dash
                  )}
                </div>
              </Col>
            </FormGroup>
          </div>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default ClientDetailPage
