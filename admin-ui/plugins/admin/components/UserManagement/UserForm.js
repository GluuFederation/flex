import React, { useState } from 'react'
import * as Yup from 'yup'
import { Col, Form, FormGroup, Input } from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'
import { initialClaims } from './constLists'

function UserForm({ formik }) {
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)
  const [searchClaims, setSearchClaims] = useState('')
  const [selectedClaims, setSelectedClaims] = useState([])
  const [claims, setClaims] = useState(initialClaims)

  const setSelectedClaimsToState = (data) => {
    let tempList = [...selectedClaims]
    tempList.push(data)
    setSelectedClaims(tempList)
  }

  const removeSelectedClaimsFromState = (id) => {
    let tempList = [...selectedClaims]
    let newList = tempList.filter((drink, index) => index !== id)
    setSelectedClaims(newList)
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup row>
        <Col sm={8}>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="User Id" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                placeholder={'User Id'}
                id="userId"
                name="userId"
                onChange={formik.handleChange}
                value={formik.values.userId || ''}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Given Name" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                placeholder={'Given Name'}
                id="givenName"
                name="givenName"
                onChange={formik.handleChange}
                value={formik.values.givenName || ''}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Display Name" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                placeholder={'Display Name'}
                id="displayName"
                name="displayName"
                onChange={formik.handleChange}
                value={formik.values.displayName || ''}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Email" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                type="email"
                placeholder={'Enter your email'}
                id="mail"
                name="mail"
                onChange={formik.handleChange}
                value={formik.values.mail || ''}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Status" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                type="select"
                name="jansStatus"
                id="jansStatus"
                multiple={false}
                onChange={formik.handleChange}
                value={formik.values.jansStatus || ''}
              >
                <option value="en">active</option>
                <option value="fr">inactive</option>
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Password" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                type="password"
                placeholder={'Password'}
                id="userPassword"
                name="userPassword"
                onChange={formik.handleChange}
                value={formik.values.userPassword || ''}
              />
            </Col>
          </FormGroup>
          {selectedClaims.map((data, key) => {
            if (data.type == 'input') {
              return (
                <FormGroup row key={key}>
                  <Col sm={3}>
                    <GluuLabel label={data.name} size={12} />
                  </Col>
                  <Col sm={8}>
                    <Input
                      {...data.attributes}
                      name={data.id}
                      id={data.id}
                      onChange={formik.handleChange}
                      value={formik.values[data.id] || ''}
                    />
                  </Col>
                  <Col
                    sm={1}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeSelectedClaimsFromState(key)}
                  >
                    <i className={'fa fa-fw fa-close'}></i>
                  </Col>
                </FormGroup>
              )
            } else if (data.type == 'select') {
              return (
                <FormGroup row key={key}>
                  <Col sm={3}>
                    <GluuLabel label={data.name} size={12} />
                  </Col>
                  <Col sm={8}>
                    <Input
                      {...data.attributes}
                      name={data.id}
                      id={data.id}
                      onChange={formik.handleChange}
                      value={formik.values[data.id] || ''}
                    >
                      {data.attributes.values.map((val, key) => (
                        <option value={val} key={'option' + key}>
                          {val}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col
                    sm={1}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeSelectedClaimsFromState(key)}
                  >
                    <i className={'fa fa-fw fa-close'}></i>
                  </Col>
                </FormGroup>
              )
            }
          })}
          <FormGroup>
            <Col sm={12}>
              <button type="submit">Submit</button>
            </Col>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <div className="border border-light ">
            <div className="bg-light text-bold p-2">Available Claims</div>
            <input
              type="search"
              className="form-control mb-2"
              placeholder="Search Claims Here "
              onChange={(e) => setSearchClaims(e.target.value)}
              value={searchClaims}
            />
            <ul className="list-group">
              {claims.map((data, key) => {
                let name = data.name.toLowerCase()
                const alreadyAddedClaim = selectedClaims.some(
                  (el) => el.name === data.name,
                )
                if (
                  (name.includes(searchClaims.toLowerCase()) ||
                    searchClaims == '') &&
                  !alreadyAddedClaim
                ) {
                  return (
                    <li
                      className="list-group-item"
                      key={'list' + key}
                      title="Click to add to the form"
                    >
                      <a
                        onClick={() => setSelectedClaimsToState(data)}
                        style={{ cursor: 'pointer' }}
                      >
                        {data.name}
                      </a>
                    </li>
                  )
                }
              })}
            </ul>
          </div>
        </Col>
      </FormGroup>
    </Form>
  )
}

export default UserForm
