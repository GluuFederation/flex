import React from 'react'
import TextField from '@material-ui/core/TextField';
import { Container, Row, Col } from './../../../components'
import GluuFormDetailRow from '../Gluu/GluuFormDetailRow'
const CustomScriptDetailPage = ({ row, loading }) => {
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
          <Col sm={4}>
            <GluuFormDetailRow label="Inum" value={row.inum} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="Name" value={row.name} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow label="LocationType" value={row.locationType} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="Description" value={row.description} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="Internal"
              isBadge
              badgeColor={getBadgeTheme(row.internal)}
              value={row.internal ? 'true' : 'false'}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="Enabled"
              isBadge
              badgeColor={getBadgeTheme(row.enabled)}
              value={row.enabled ? 'true' : 'false'}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="Programming Language"
              value={row.programmingLanguage}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="Script Type" value={row.scriptType} />
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <GluuFormDetailRow label="Level" value={row.level} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="revision" value={row.revision} />
          </Col>
        </Row>

        <Row>
          <Col sm={4}> Module Properties: </Col>
          <Col sm={2}>
            {Object.keys(row.moduleProperties).map((key, i) => (
              <GluuFormDetailRow
                key={key}
                label="value1"
                value={String(row.moduleProperties[key].value1)}
              />
            ))}
          </Col>
          <Col sm={2}>
            {Object.keys(row.moduleProperties).map((key, i) => (
              <GluuFormDetailRow
                key={key}
                label="value2"
                value={String(row.moduleProperties[key].value2)}
              />
            ))}
          </Col>
          <Col sm={2}>
            {Object.keys(row.moduleProperties).map((key, i) => (
              <GluuFormDetailRow
                key={key}
                label="description"
                value={String(row.moduleProperties[key].description)}
              />
            ))}
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  )
}
export default CustomScriptDetailPage
