import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Input,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuInumInput from '../../../../app/routes/Apps/Gluu/GluuInumInput'
import GluuProperties from '../../../../app/routes/Apps/Gluu/GluuProperties'
import Counter from '../../../../app/components/Widgets/GroupedButtons/Counter'
import GluuCommitFooter from '../../../../app/routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import GluuTooltip from '../../../../app/routes/Apps/Gluu/GluuTooltip'
import { SCRIPT, USERS } from '../../../../app/utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { timezones, initialClaims } from './constLists'
function UserForm() {
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

  return (
    <Form>
      <FormGroup row>
        <Col sm={8}>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="User Name" size={12} />
            </Col>
            <Col sm={9}>
              <Input placeholder={'User Name'} id="userName" name="userName" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Full Name" size={12} />
            </Col>
            <Col sm={3}>
              <Input
                placeholder={'Given Name'}
                id="givenName"
                name="givenName"
              />
            </Col>
            <Col sm={3}>
              <Input
                placeholder={'Middle Name'}
                id="middleName"
                name="middleName"
              />
            </Col>
            <Col sm={3}>
              <Input
                placeholder={'Family Name'}
                id="familyName"
                name="familyName"
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
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Nick Name" size={12} />
            </Col>
            <Col sm={9}>
              <Input placeholder={'Nick Name'} id="nickName" name="nickName" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Title" size={12} />
            </Col>
            <Col sm={9}>
              <Input placeholder={'Title'} id="title" name="title" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="User Type" size={12} />
            </Col>
            <Col sm={9}>
              <Input placeholder={'User Type'} id="userType" name="userType" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Preffered Language" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                type="select"
                name="preferredLanguage"
                id="preferredLanguage"
                multiple={false}
              >
                <option value="en">en</option>
                <option value="fr">fr</option>
                <option value="pt">pt</option>
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <GluuLabel label="Timezone" size={12} />
            </Col>
            <Col sm={9}>
              <Input
                type="select"
                name="timezone"
                id="timezone"
                multiple={false}
              >
                {timezones.map((data, key) => (
                  <option value={data} key={key}>
                    {data}
                  </option>
                ))}
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
                id="password"
                name="password"
              />
            </Col>
          </FormGroup>
          {selectedClaims.map((data, key) => {
            return (
              <FormGroup row key={key}>
                <Col sm={3}>
                  <GluuLabel label={data.name} size={12} />
                </Col>
                <Col sm={8}>
                  <Input {...data.attributes} />
                </Col>
                <Col sm={1}>X</Col>
              </FormGroup>
            )
          })}
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
                      <a onClick={() => setSelectedClaimsToState(data)}>
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
