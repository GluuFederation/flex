import React, { useContext, useMemo } from 'react'
import { Row, Badge, Col, Accordion } from 'Components'
import mappingItemStyles from './styles/MappingItem.style'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'

const MappingItem = React.memo(function MappingItem({ candidate }) {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  const headerStyle = useMemo(
    () => ({
      color: themeColors?.background,
      display: 'inline-flex',
      alignItems: 'center',
    }),
    [themeColors?.background],
  )

  const badgeStyle = useMemo(() => ({ float: 'right' }), [])

  const permissionsList = useMemo(
    () =>
      candidate?.permissions?.map((permission, id) => (
        <Row key={`${permission}-${id}`} style={mappingItemStyles.permissionRow}>
          <Col sm={10} style={mappingItemStyles.permissionColumn}>
            <span style={mappingItemStyles.permissionText}>{permission}</span>
          </Col>
        </Row>
      )),
    [candidate?.permissions],
  )

  const permissionsCount = useMemo(
    () => candidate?.permissions?.length || 0,
    [candidate?.permissions?.length],
  )

  return (
    <Row className="mb-3">
      <Col sm={12}>
        <Accordion>
          <Accordion.Header className="text-info" style={{ color: themeColors?.background }}>
            <span style={headerStyle}>
              <Accordion.Indicator className="me-2" />
              {candidate?.role}
            </span>

            <Badge color={`primary-${selectedTheme}`} style={badgeStyle}>
              {permissionsCount}
            </Badge>
          </Accordion.Header>
          <Accordion.Body>
            <div style={{ marginTop: 10 }}></div>
            {permissionsList}
          </Accordion.Body>
        </Accordion>
      </Col>
    </Row>
  )
})

export default MappingItem
