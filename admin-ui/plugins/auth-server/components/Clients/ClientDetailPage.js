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

  const description = row.description || extractDescription(row.customAttributes || []) || dash
  const displayName = row.clientName || row.displayName || dash
  const dash = '-'
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: customColors.whiteSmoke }}>
        <Row>
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
        <Row>
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
        <Row>
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
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.is_trusted_client')}:</Label>
              <Label sm={6}>
                {row.trustedClient ? (
                  <Badge color={`primary-${selectedTheme}`}>{t('options.yes')}</Badge>
                ) : (
                  <Badge color="secondary">{t('options.no')}</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.status')}:</Label>
              <Label sm={6}>
                {!row.disabled ? (
                  <Badge color={`primary-${selectedTheme}`}>{t('options.enabled')}</Badge>
                ) : (
                  <Badge color="danger">{t('options.disabled')}</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>{t('fields.scopes')}:</Label>
              <Label sm={8}>
                {clientScopes &&
                  clientScopes.map((item, key) => (
                    <Badge key={key} color={`primary-${selectedTheme}`}>
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>{t('fields.grant_types')}:</Label>
              <Label sm={8}>
                {row.grantTypes &&
                  row.grantTypes.map((item, key) => (
                    <Badge key={key} color={`primary-${selectedTheme}`}>
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>{t('fields.response_types')}:</Label>
              <Label sm={8}>
                {row.responseTypes &&
                  row.responseTypes.map((item, key) => (
                    <Badge key={key} color={`primary-${selectedTheme}`}>
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>{t('fields.login_uris')}:</Label>
              <Label sm={8}>
                {row.redirectUris &&
                  row.redirectUris.map((item, key) => (
                    <Badge key={key} color={`primary-${selectedTheme}`}>
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>{t('fields.logout_redirect_uris')}: </Label>
              <Label sm={8}>
                {row.postLogoutRedirectUris &&
                  row.postLogoutRedirectUris.map((item, key) => (
                    <Badge key={key} color={`primary-${selectedTheme}`}>
                      {item}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.authentication_method')}:</Label>
              <Label sm={6}>
                {row.authenticationMethod && (
                  <Badge color={`primary-${selectedTheme}`}>{row.authenticationMethod}</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default ClientDetailPage
