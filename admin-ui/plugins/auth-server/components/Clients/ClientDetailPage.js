import React from 'react'
import {
  Container,
  Badge,
  Row,
  Col,
  FormGroup,
  Label,
} from '../../../../app/components'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
import GluuSecretDetail from '../../../../app/routes/Apps/Gluu/GluuSecretDetail'
import { useTranslation } from 'react-i18next'
const DOC_CATEGORY = 'openid_client'

function ClientDetailPage({ row, scopes }) {
  const { t } = useTranslation()
  const scopesDns = row.scopes || []
  const clientScopes = scopes
    .filter((item) => scopesDns.includes(item.dn, 0))
    .map((item) => item.id)
  function extractDescription(customAttributes) {
    var result = customAttributes.filter((item) => item.name === 'description')
    if (result && result.length >= 1) {
      return result[0].values
    }
    return ''
  }

  return (
    <React.Fragment>
      <Container style={{ backgroundColor: '#F5F5F5' }}>
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
              value={row.clientSecret ? row.clientSecret : '-'}
              doc_category={DOC_CATEGORY}
              doc_entry="clientSecret"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.name"
              value={row.clientName || row.displayName || '-'}
              doc_category={DOC_CATEGORY}
              doc_entry="clientName"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.description"
              value={extractDescription(row.customAttributes || []) || '-'}
              doc_category={DOC_CATEGORY}
              doc_entry="description"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.subject_type"
              value={row.subjectType ? row.subjectType : '-'}
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
                  <Badge color="primary">{t('options.yes')}</Badge>
                ) : (
                  <Badge color="danger">{t('options.no')}</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.status')}:</Label>
              <Label sm={6}>
                {!row.disabled ? (
                  <Badge color="primary">{t('options.enabled')}</Badge>
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
                    <Badge key={key} color="primary">
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
                    <Badge key={key} color="primary">
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
                    <Badge key={key} color="primary">
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
                    <Badge key={key} color="primary">
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
                    <Badge key={key} color="primary">
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
                  <Badge color="primary">{row.authenticationMethod}</Badge>
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
