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
      {/* START Content */}
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label={t("Client Id")} value={row.inum} />
          </Col>
          <Col sm={6}>
            <GluuSecretDetail
              label={t("Client Secret")}
              value={row.clientSecret ? row.clientSecret : '-'}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label={t("Name")}
              value={row.clientName || row.displayName|| '-'}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label={t("Description")}
              value={extractDescription(row.customAttributes || []) || '-'}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label={t("Subject Type")}
              value={row.subjectType ? row.subjectType : '-'}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label={t("Application Type")}
              value={row.applicationType}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t("Trusted Client")}:</Label>
              <Label sm={6}>
                {row.trustedClient ? (
                  <Badge color="primary">{t("Yes")}</Badge>
                ) : (
                  <Badge color="danger">{t("No")}</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t("Status")}:</Label>
              <Label sm={6}>
                {!row.disabled ? (
                  <Badge color="primary">{t("Enabled")}</Badge>
                ) : (
                  <Badge color="danger">{t("Disabled")}</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={4}>{t("Scopes")}:</Label>
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
              <Label sm={4}>{t("Grant types")}:</Label>
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
              <Label sm={4}>{t("Response types")}:</Label>
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
              <Label sm={4}>{t("Login uris")}:</Label>
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
              <Label sm={4}>{t("Logout Redirect Uris")}: </Label>
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
              <Label sm={6}>
                {t("Authentication method for the Token Endpoint")}:
              </Label>
              <Label sm={6}>
                {row.authenticationMethod && (
                  <Badge color="primary">{row.authenticationMethod}</Badge>
                )}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  )
}

export default ClientDetailPage
