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
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label="fields.inum" value={row.inum} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="fields.id" value={row.id} />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.description"
              value={row.description}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.displayname"
              value={row.displayName}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.scope_type"
              value={row.scopeType}
              isBadge
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.default_scope"
              isBadge
              badgeColor={getBadgeTheme(row.defaultScope)}
              value={row.defaultScope ? t('options.yes') : t('options.no')}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>{t('fields.attributes')}:</Col>
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
      </Container>
    </React.Fragment>
  )
}

export default ScopeDetailPage
