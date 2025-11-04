import React, { useEffect, useState, useRef, useContext } from 'react'
import { Row, Badge, Col, Button, FormGroup, Accordion, Form } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteOutlined, HelpOutline } from '@mui/icons-material'
import { useCedarling } from '@/cedarling'
import { MAPPING_WRITE, MAPPING_DELETE } from 'Utils/PermChecker'
import {
  updateMapping,
  addPermissionsToRole,
  updatePermissionsToServer,
  updatePermissionsServerResponse,
  deleteMapping,
} from 'Plugins/admin/redux/features/mappingSlice'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import mappingItemStyles from './styles/MappingItem.style'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { Formik } from 'formik'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import getThemeColor from '@/context/theme/config'

function MappingItem({ candidate, roles }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const autocompleteRef = useRef(null)
  const permissions = useSelector((state) => state.apiPermissionReducer.items)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
  const [searchablePermissions, setSearchAblePermissions] = useState([])
  const [essentialPermissions, setEssentialPermissions] = useState([])
  const [serverPermissions, setServerPermissions] = useState(null)
  const [isDeleteable, setIsDeleteable] = useState(false)
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
    setServerPermissionsToLocalState()
  }, [])

  useEffect(() => {
    if (roles) {
      for (const i in roles) {
        if (roles[i].role == candidate.role) {
          if (roles[i].deletable) {
            setIsDeleteable(true)
          } else {
            setIsDeleteable(false)
          }
        }
      }
    }
  }, [roles])

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
    setSearchAblePermissions(filteredArr)
    setEssentialPermissions(essentialArr)
  }

  const revertLocalChanges = () => {
    const data = Object.assign(JSON.parse(serverPermissions))
    dispatch(updatePermissionsServerResponse({ data: data }))
  }

  const setServerPermissionsToLocalState = () => {
    setServerPermissions(JSON.stringify(candidate))
  }

  useEffect(() => {
    getPermissionsForSearch()
  }, [permissions, candidate?.permissions?.length, cedarPermissions])

  const initialValues = { mappingAddPermissions: [] }

  const handleAddPermission = (values, { resetForm }) => {
    if (values?.mappingAddPermissions?.length) {
      dispatch(
        addPermissionsToRole({
          data: {
            data: values?.mappingAddPermissions,
            userRole: candidate.role,
          },
        }),
      )
    }
    resetForm()
    autocompleteRef.current.clear()
  }

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

  const handleRemovePermission = (permissionIndex, role) => {
    dispatch(
      updateMapping({
        data: {
          id: permissionIndex,
          role,
        },
      }),
    )
  }
  const handleDeleteRole = () => {
    dispatch(
      deleteMapping({
        data: {
          role: candidate.role,
          permissions: candidate.permissions,
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

              {isDeleteable && (
                <DeleteOutlined
                  onClick={() => handleDeleteRole()}
                  style={{
                    float: 'right',
                    color: customColors.black,
                  }}
                />
              )}
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
              {hasCedarPermission(MAPPING_WRITE) && (
                <Formik initialValues={initialValues} onSubmit={handleAddPermission}>
                  {(formik) => (
                    <>
                      <Form onSubmit={formik.handleSubmit}>
                        <Row>
                          <Col sm={10}>
                            <GluuTypeAhead
                              name="mappingAddPermissions"
                              label={t('actions.search')}
                              formik={formik}
                              options={searchablePermissions}
                              required={false}
                              forwardRef={autocompleteRef}
                              doc_category={'Mapping'}
                              allowNew={false}
                            ></GluuTypeAhead>
                          </Col>
                          <Col>
                            <Button
                              type="submit"
                              color={`primary-${selectedTheme}`}
                              style={applicationStyle.buttonStyle}
                            >
                              <i className="fa fa-plus me-2"></i>
                              {t('actions.add')}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </>
                  )}
                </Formik>
              )}

              {candidate.permissions.map((permission, id) => (
                <Row key={id} style={mappingItemStyles.permissionRow}>
                  <Col sm={10} style={mappingItemStyles.permissionColumn}>
                    <span style={mappingItemStyles.permissionText}>{permission}</span>
                  </Col>
                  {hasCedarPermission(MAPPING_DELETE) ? (
                    <Col sm={2} style={mappingItemStyles.buttonContainer}>
                      <Button
                        type="button"
                        color="danger"
                        size="sm"
                        onClick={() => handleRemovePermission(id, candidate.role)}
                        style={{
                          ...applicationStyle.buttonStyle,
                          ...mappingItemStyles.removeButton,
                        }}
                      >
                        <i className="fa fa-trash"></i>
                        {t('actions.remove')}
                      </Button>
                    </Col>
                  ) : null}
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

              {/* Bottom Buttons  */}
              <FormGroup row />
              {hasCedarPermission(MAPPING_WRITE) ? (
                <Row>
                  <Col sm={6}>
                    <Button
                      type="button"
                      color={`primary-${selectedTheme}`}
                      style={applicationStyle.buttonStyle}
                      onClick={() => revertLocalChanges()}
                    >
                      <i className="fa fa-undo me-2"></i>
                      {t('actions.revert')}
                    </Button>
                  </Col>

                  <Col sm={6} className="text-end">
                    <Button
                      type="button"
                      color={`primary-${selectedTheme}`}
                      style={applicationStyle.buttonStyle}
                      onClick={() => {
                        dispatch(updatePermissionsToServer({ data: candidate }))
                        setServerPermissionsToLocalState()
                      }}
                    >
                      <i className="fa fa-plus me-2"></i>
                      {t('actions.save')}
                    </Button>
                  </Col>
                </Row>
              ) : null}
              {/* Bottom Buttons  */}
            </Accordion.Body>
          </Accordion>
        </Col>
        <FormGroup row />
      </Row>
    </div>
  )
}

export default MappingItem
