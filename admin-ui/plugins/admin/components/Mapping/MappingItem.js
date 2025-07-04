import React, { useEffect, useState, useRef, useContext } from 'react'
import { Row, Badge, Col, Button, FormGroup, Accordion, Form } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteOutlined } from '@mui/icons-material'
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
import { Formik } from 'formik'
import { ThemeContext } from 'Context/theme/themeContext'
import { useTranslation } from 'react-i18next'

function MappingItem({ candidate, roles }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const autocompleteRef = useRef(null)
  const permissions = useSelector((state) => state.apiPermissionReducer.items)
  const [searchablePermissions, setSearchAblePermissions] = useState([])
  const [serverPermissions, setServerPermissions] = useState(null)
  const [isDeleteable, setIsDeleteable] = useState(false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

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
    for (const i in permissions) {
      if (!selectedPermissions.includes(permissions[i].permission)) {
        if (permissions[i].permission) {
          filteredArr.push(permissions[i].permission)
        }
      }
    }
    setSearchAblePermissions(filteredArr)
  }

  const revertLocalChanges = () => {
    const data = Object.assign(JSON.parse(serverPermissions))
    dispatch(updatePermissionsServerResponse({ data: data }))
  }

  const setServerPermissionsToLocalState = () => {
    setServerPermissions(JSON.stringify(candidate))
  }

  useEffect(() => {
    setServerPermissionsToLocalState()
  }, [false])

  useEffect(() => {
    getPermissionsForSearch()
  }, [permissions, candidate?.permissions?.length])

  const doRemove = (id, role) => {
    dispatch(
      updateMapping({
        data: {
          id,
          role,
        },
      }),
    )
  }

  const initialValues = {}

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
            <Accordion.Header className="text-info">
              <Accordion.Indicator className="me-2" />
              {candidate.role}

              {isDeleteable && (
                <DeleteOutlined
                  onClick={() => handleDeleteRole()}
                  style={{
                    float: 'right',
                    color: '#000',
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
                              value={[]}
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
                <Row key={id}>
                  <Col sm={10}>{permission}</Col>
                  {hasCedarPermission(MAPPING_DELETE) ? (
                    <Col sm={2}>
                      <Button
                        type="button"
                        color="danger"
                        onClick={() => doRemove(id, candidate.role)}
                        style={{
                          margin: '1px',
                          float: 'right',
                          padding: '0px',
                        }}
                      >
                        <i className="fa fa-trash me-2"></i>
                        {t('actions.remove')}
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              ))}
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
