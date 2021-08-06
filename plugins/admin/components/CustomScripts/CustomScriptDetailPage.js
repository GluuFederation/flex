import React from 'react'
import { Container, Row, Col } from '../../../../app/components'
import GluuFormDetailRow from '../../../../app/routes/Apps/Gluu/GluuFormDetailRow'
import { useTranslation } from 'react-i18next'

const CustomScriptDetailPage = ({ row}) => {
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
          <Col sm={4}>
            <GluuFormDetailRow label="fields.inum" value={row.inum} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="fields.name" value={row.name} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.location_type"
              value={row.locationType}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.description"
              value={row.description}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.internal"
              isBadge
              badgeColor={getBadgeTheme(row.internal)}
              value={row.internal ? t('options.true') : t('options.false')}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="options.enabled"
              isBadge
              badgeColor={getBadgeTheme(row.enabled)}
              value={row.enabled ? t('options.true') : t('options.false')}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label={t('fields.programming_language')}
              value={row.programmingLanguage}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.script_type"
              value={row.scriptType}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <GluuFormDetailRow label="fields.level" value={row.level} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="fields.revision" value={row.revision} />
          </Col>
        </Row>

        <Row>
          <Col sm={4}> {t('tiltes.modules_properties')}: </Col>
          <Col sm={2}>
            {Object.keys(row.moduleProperties).map((key, i) => (
              <GluuFormDetailRow
                key={key}
                label={t('value') + '1'}
                value={String(row.moduleProperties[key].value1)}
              />
            ))}
          </Col>
          <Col sm={2}>
            {Object.keys(row.moduleProperties).map((key, i) => (
              <GluuFormDetailRow
                key={key}
                label={t('value') + '2'}
                value={String(row.moduleProperties[key].value2)}
              />
            ))}
          </Col>
          <Col sm={2}>
            {Object.keys(row.moduleProperties).map((key, i) => (
              <GluuFormDetailRow
                key={key}
                label="fields.description"
                value={String(row.moduleProperties[key].description)}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}
export default CustomScriptDetailPage
