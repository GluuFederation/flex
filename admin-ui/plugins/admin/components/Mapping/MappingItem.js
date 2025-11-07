import { useContext } from 'react'
import { Row, Badge, Col, FormGroup, Accordion } from 'Components'
import mappingItemStyles from './styles/MappingItem.style'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'

function MappingItem({ candidate }) {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  return (
    <div>
      <FormGroup row />
      <Row>
        <Col sm={12}>
          <Accordion className="mb-12">
            <Accordion.Header className="text-info" style={{ color: themeColors?.background }}>
              <span
                style={{
                  color: themeColors?.background,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Accordion.Indicator className="me-2" />
                {candidate.role}
              </span>

              <Badge
                color={`primary-${selectedTheme}`}
                style={{
                  float: 'right',
                }}
              >
                {candidate.permissions.length}
              </Badge>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ marginTop: 10 }}></div>

              {candidate.permissions.map((permission, id) => (
                <Row key={id} style={mappingItemStyles.permissionRow}>
                  <Col sm={10} style={mappingItemStyles.permissionColumn}>
                    <span style={mappingItemStyles.permissionText}>{permission}</span>
                  </Col>
                </Row>
              ))}
            </Accordion.Body>
          </Accordion>
        </Col>
        <FormGroup row />
      </Row>
    </div>
  )
}

export default MappingItem
