import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { AUTHN } from 'Utils/ApiResources'

import customColors from '@/customColors'

function AuthNDetailPage({ row }) {
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: customColors.smokeWhite }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.acr"
              value={row.acrName}
              doc_category={AUTHN}
              doc_entry="acr"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.level"
              value={row.level}
              doc_category={AUTHN}
              doc_entry="level"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.password_attribute"
              value={row.passwordAttribute}
              doc_category={AUTHN}
              doc_entry="password_attribute"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.hash_algorithm"
              value={row.hashAlgorithm}
              doc_category={AUTHN}
              doc_entry="hash_algorithm"
              isBadge
            />
          </Col>
        </Row>
        <Row>
          {' '}
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.primary_key"
              value={row.primaryKey}
              doc_category={AUTHN}
              doc_entry="primary_key"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.saml_acr"
              value={row.samlACR}
              doc_category={AUTHN}
              doc_entry="saml_acr"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.description"
              value={row.description}
              doc_category={AUTHN}
              doc_entry="description"
            />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default AuthNDetailPage
