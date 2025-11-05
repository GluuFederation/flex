import { useEffect, useState, useContext } from 'react'
import { Row, Badge, Col, Button, FormGroup, Accordion } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { HelpOutline } from '@mui/icons-material'
import { useCedarling } from '@/cedarling'
import { MAPPING_WRITE, MAPPING_DELETE } from 'Utils/PermChecker'
import { addPermissionsToRole } from 'Plugins/admin/redux/features/mappingSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import mappingItemStyles from './styles/MappingItem.style'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import getThemeColor from '@/context/theme/config'

function MappingItem({ candidate }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const permissions = useSelector((state) => state.apiPermissionReducer.items)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  const [essentialPermissions, setEssentialPermissions] = useState([])
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  const authorizePermissions = async () => {
    const permissions = [MAPPING_WRITE, MAPPING_DELETE]
    try {
      for (const permission of permissions) {
        await authorize([permission])
      }
    } catch (error) {
      console.error('Error authorizing mapping permissions:', error)
    }
  }

  useEffect(() => {
    authorizePermissions()
  }, [])

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
    setEssentialPermissions(essentialArr)
  }

  useEffect(() => {
    getPermissionsForSearch()
  }, [permissions, candidate?.permissions?.length, cedarPermissions])

  const handleAddEssentialPermission = (permission) => {
    dispatch(
      addPermissionsToRole({
        data: {
          data: [permission],
          userRole: candidate.role,
        },
      }),
    )
  }

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

              {hasCedarPermission(MAPPING_WRITE) && essentialPermissions.length > 0 && (
                <div style={mappingItemStyles.essentialSection}>
                  <div style={mappingItemStyles.essentialSectionHeader}>
                    <h6 style={mappingItemStyles.essentialTitle}>
                      {t('titles.followingPermissionRequiredToBeAdded')}
                      <GluuTooltip
                        doc_category={t('tooltips.followingPermissionRequiredToBeAdded')}
                        doc_entry="essential-permissions-help"
                        isDirect={true}
                      >
                        <HelpOutline style={mappingItemStyles.tooltipIcon} />
                      </GluuTooltip>
                    </h6>
                  </div>
                  {essentialPermissions.map((permission, id) => (
                    <Row key={`essential-${id}`} style={mappingItemStyles.essentialPermissionRow}>
                      <Col sm={10} style={mappingItemStyles.permissionColumn}>
                        <span style={mappingItemStyles.essentialPermissionText}>{permission}</span>
                      </Col>
                      <Col sm={2} style={mappingItemStyles.buttonContainer}>
                        <Button
                          type="button"
                          color="success"
                          size="sm"
                          onClick={() => handleAddEssentialPermission(permission)}
                          style={{
                            ...applicationStyle.buttonStyle,
                            ...mappingItemStyles.addButton,
                          }}
                        >
                          <i className="fa fa-plus"></i>
                          {t('actions.add')}
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </Accordion.Body>
          </Accordion>
        </Col>
        <FormGroup row />
      </Row>
    </div>
  )
}

export default MappingItem
