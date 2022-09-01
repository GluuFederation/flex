import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Row,
  Badge,
  Col,
  Button,
  FormGroup,
  Accordion,
  Form,
} from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteOutlined } from '@material-ui/icons'
import {
  updateMapping,
  addPermissionsToRole,
  updatePermissionsToServer,
  updatePermissionsServerResponse,
  deleteMapping,
} from 'Plugins/admin/redux/actions/MappingActions'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Formik } from 'formik'
import { ThemeContext } from 'Context/theme/themeContext'
import { t } from 'i18next'

function MappingItem({ candidate, roles }) {
  const dispatch = useDispatch()
  const autocompleteRef = useRef(null)
  const permissions = useSelector((state) => state.apiPermissionReducer.items)
  const [searchablePermissions, setSearchAblePermissions] = useState([])
  const [serverPermissions, setServerPermissions] = useState(null)
  const [isDeleteable, setIsDeleteable] = useState(false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

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
        filteredArr.push(permissions[i].permission)
      }
    }
    setSearchAblePermissions(filteredArr)
  }

  const revertLocalChanges = () => {
    dispatch(updatePermissionsServerResponse(JSON.parse(serverPermissions)))
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
        id,
        role,
      }),
    )
  }

  const initialValues = {}

  const handleAddPermission = (values, { resetForm }) => {
    if (values?.mappingAddPermissions?.length) {
      dispatch(
        addPermissionsToRole({
          data: values?.mappingAddPermissions,
          userRole: candidate.role,
        }),
      )
    }
    resetForm()
    autocompleteRef.current.clear()
  }
  const handleDeleteRole = () => {
    dispatch(
      deleteMapping({
        role: candidate.role,
        permissions: candidate.permissions,
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
              <Accordion.Indicator className="mr-2" />
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
              <Formik
                initialValues={initialValues}
                onSubmit={handleAddPermission}
              >
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
                          ></GluuTypeAhead>
                        </Col>
                        <Col>
                          <Button
                            type="submit"
                            color={`primary-${selectedTheme}`}
                            style={applicationStyle.buttonStyle}
                          >
                            <i className="fa fa-plus mr-2"></i>
                            {t('actions.add')}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </>
                )}
              </Formik>
              {candidate.permissions.map((permission, id) => (
                <Row key={id}>
                  <Col sm={10}>{permission}</Col>
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
                      <i className="fa fa-trash mr-2"></i>
                      {t('actions.remove')}
                    </Button>
                  </Col>
                </Row>
              ))}
              {/* Bottom Buttons  */}
              <FormGroup row />
              <Row>
                <Col sm={6}>
                  <Button
                    type="button"
                    color={`primary-${selectedTheme}`}
                    style={applicationStyle.buttonStyle}
                    onClick={() => revertLocalChanges()}
                  >
                    <i className="fa fa-undo mr-2"></i>
                    {t('actions.revert')}
                  </Button>
                </Col>
                <Col sm={6} className="text-right">
                  <Button
                    type="button"
                    color={`primary-${selectedTheme}`}
                    style={applicationStyle.buttonStyle}
                    onClick={() => {
                      dispatch(updatePermissionsToServer(candidate))
                      setServerPermissionsToLocalState()
                    }}
                  >
                    <i className="fa fa-plus mr-2"></i>
                    {t('actions.save')}
                  </Button>
                </Col>
              </Row>
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
