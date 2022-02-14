import React, { useEffect, useState, useRef } from 'react'
import {
  Row,
  Badge,
  Col,
  Button,
  FormGroup,
  Accordion,
  Form,
} from '../../../../app/components'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateMapping,
  addPermissionsToRole,
} from '../../redux/actions/MappingActions'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'

import { Formik } from 'formik'

function MappingItem({ candidate }) {
  const dispatch = useDispatch()
  const autocompleteRef = useRef(null)
  const permissions = useSelector((state) => state.apiPermissionReducer.items)
  const [searchablePermissions, setSearchAblePermissions] = useState([])

  const getPermissionsForSearch = () => {
    const selectedPermissions = candidate.permissions
    let filteredArr = []
    for (let i in permissions) {
      if (!selectedPermissions.includes(permissions[i].permission)) {
        filteredArr.push(permissions[i].permission)
      }
    }
    setSearchAblePermissions(filteredArr)
  }

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

  const initialValues = {
    searchedPermissions: [],
  }

  const handleAddPermission = (values, { resetForm }) => {
    // values.mappingAddPermissions
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

  return (
    <div>
      <FormGroup row />
      <Row>
        <Col sm={12}>
          <Accordion className="mb-12">
            <Accordion.Header className="text-info">
              <Row>
                <Col sm={2}>
                  <Accordion.Indicator className="mr-2" />
                  {candidate.role}
                </Col>
                <Col sm={9}></Col>
                <Col sm={1}>
                  <Badge
                    color="info"
                    style={{
                      float: 'right',
                    }}
                  >
                    {candidate.permissions.length}
                  </Badge>
                </Col>
              </Row>
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
                            label="Search"
                            formik={formik}
                            options={searchablePermissions}
                            required={false}
                            value={[]}
                            forwardRef={autocompleteRef}
                          ></GluuTypeAhead>
                        </Col>
                        <Col>
                          <Button
                            type="submit"
                            color="primary"
                            style={applicationStyle.buttonStyle}
                          >
                            <i className="fa fa-plus mr-2"></i>
                            Add
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
                      style={{ margin: '1px', float: 'right', padding: '0px' }}
                    >
                      <i className="fa fa-trash mr-2"></i>
                      Remove
                    </Button>
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
