import React, { useContext } from 'react'
import { Container, Badge, Row, Col, FormGroup, Label } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import GluuSecretDetail from 'Routes/Apps/Gluu/GluuSecretDetail'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'

const DOC_CATEGORY = 'openid_client'

function ClientDetailPage({ row, scopes }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

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
  const detailContainerStyle = {
    backgroundColor: customColors.whiteSmoke,
    maxHeight: '420px',
    overflowY: 'auto',
    padding: '1rem',
  }
  const detailRowStyle = { marginBottom: '0.75rem' }
  const detailLabelStyle = { fontWeight: 600 }
  const detailValueStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    alignItems: 'center',
  }

  const renderBadgeList = (items) =>
    items?.length ? (
      <div style={detailValueStyle}>
        {items.map((item, key) => (
          <Badge key={key} color={`primary-${selectedTheme}`}>
            {item}
          </Badge>
        ))}
      </div>
    ) : (
      dash
    )

  return (
    <React.Fragment>
      <Container style={detailContainerStyle}>
        <Row style={detailRowStyle}>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.client_id"
              value={row.inum}
              doc_category={DOC_CATEGORY}
              doc_entry="clientId"
            />
          </Col>
          <Col sm={6}>
            <GluuSecretDetail
              label="fields.client_secret"
              value={row.clientSecret ? row.clientSecret : dash}
              doc_category={DOC_CATEGORY}
              doc_entry="clientSecret"
            />
          </Col>
        </Row>
        <Row style={detailRowStyle}>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.name"
              value={displayName}
              doc_category={DOC_CATEGORY}
              doc_entry="displayName"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.description"
              value={description}
              doc_category={DOC_CATEGORY}
              doc_entry="description"
            />
          </Col>
        </Row>
        <Row style={detailRowStyle}>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.subject_type"
              value={row.subjectType ? row.subjectType : dash}
              doc_category={DOC_CATEGORY}
              doc_entry="subjectType"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.application_type"
              value={row.applicationType}
              doc_category={DOC_CATEGORY}
              doc_entry="applicationType"
            />
          </Col>
        </Row>
        <Row style={detailRowStyle}>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={6} style={detailLabelStyle}>
                {t('fields.is_trusted_client')}:
              </Label>
              <Col sm={6}>
                <div style={detailValueStyle}>
                  {row.trustedClient ? (
                    <Badge color={`primary-${selectedTheme}`}>{t('options.yes')}</Badge>
                  ) : (
                    <Badge color="secondary">{t('options.no')}</Badge>
                  )}
                </div>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={6} style={detailLabelStyle}>
                {t('fields.status')}:
              </Label>
              <Col sm={6}>
                <div style={detailValueStyle}>
                  {!row.disabled ? (
                    <Badge color={`primary-${selectedTheme}`}>{t('options.enabled')}</Badge>
                  ) : (
                    <Badge color="danger">{t('options.disabled')}</Badge>
                  )}
                </div>
              </Col>
            </FormGroup>
          </Col>
        </Row>

        <Row style={detailRowStyle}>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.scopes')}:
              </Label>
              <Col sm={8}>{renderBadgeList(clientScopes)}</Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.grant_types')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.grantTypes)}</Col>
            </FormGroup>
          </Col>
        </Row>
        <Row style={detailRowStyle}>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.response_types')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.responseTypes)}</Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.login_uris')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.redirectUris)}</Col>
            </FormGroup>
          </Col>
        </Row>
        <Row style={detailRowStyle}>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={4} style={detailLabelStyle}>
                {t('fields.logout_redirect_uris')}:
              </Label>
              <Col sm={8}>{renderBadgeList(row.postLogoutRedirectUris)}</Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row className="align-items-center mb-2">
              <Label sm={6} style={detailLabelStyle}>
                {t('fields.authentication_method')}:
              </Label>
              <Col sm={6}>
                <div style={detailValueStyle}>
                  {row.authenticationMethod ? (
                    <Badge color={`primary-${selectedTheme}`}>{row.authenticationMethod}</Badge>
                  ) : (
                    dash
                  )}
                </div>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default ClientDetailPage
