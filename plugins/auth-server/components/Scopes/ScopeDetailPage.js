import React from 'react'
import { Container, Row, Col } from '../../../../app/components'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
import { useTranslation } from 'react-i18next'

function ScopeDetailPage({ row }) {
  const { t } = useTranslation()
  function getBadgeTheme(status) {
    if (status) {
      return 'primary'
    } else {
      return 'info'
    }
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label={t("Inum")} value={row.inum} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label={t("Id")} value={row.id} />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label={t("Description")} value={row.description} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label={t("Display Name")} value={row.displayName} />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label={t("Scope Type")}
              value={row.scopeType}
              isBadge
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label={t("Default Scope")}
              isBadge
              badgeColor={getBadgeTheme(row.defaultScope)}
              value={row.defaultScope ? 'Yes' : 'No'}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>{t("Attributes")}:</Col>
          <Col sm={9}>
            {Object.keys(row.attributes).map((item, key) => (
              <GluuFormDetailRow
                key={key}
                label={item}
                isBadge={true}
                value={String(row.attributes[item])}
              />
            ))}
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  )
}

export default ScopeDetailPage
