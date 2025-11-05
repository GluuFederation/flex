import { useEffect, useContext } from 'react'
import { Row, Badge, Col, FormGroup, Accordion } from 'Components'
import { useSelector } from 'react-redux'
import mappingItemStyles from './styles/MappingItem.style'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'

function MappingItem({ candidate }) {
  const permissions = useSelector((state) => state.apiPermissionReducer.items)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  const getPermissionsForSearch = () => {
    const selectedPermissions = candidate.permissions
    const filteredArr = []
    const essentialArr = []

    for (const i in permissions) {
      if (!selectedPermissions.includes(permissions[i].permission)) {
        if (permissions[i].permission) {
          // Check if it's an essential permission
          if (permissions[i].essentialPermissionInAdminUI === true) {
            essentialArr.push(permissions[i].permission)
          } else {
            filteredArr.push(permissions[i].permission)
          }
        }
      }
    }
  }

  useEffect(() => {
    getPermissionsForSearch()
  }, [permissions, candidate?.permissions?.length, cedarPermissions])

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
