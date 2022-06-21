import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup } from '../../../../app/components'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import { useTranslation } from 'react-i18next'
import UserClaimEntry from './UserClaimEntry'
import { useSelector, useDispatch } from 'react-redux'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import applicationstyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { updateUserPassword } from '../../redux/actions/UserActions'
function UserForm({ formik }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const DOC_SECTION = 'user'
  const [searchClaims, setSearchClaims] = useState('')
  const [selectedClaims, setSelectedClaims] = useState([])
  const [passwordError, setPasswordError] = useState('')
  const [showButtons, setShowButtons] = useState(false)
  const [modal, setModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)

  const toggle = () => {
    setModal(!modal)
  }

  const submitChangePassword = () => {
    let submitableValue = {
      userPassword: formik.values.userPassword,
      inum: userDetails.inum,
    }
    dispatch(updateUserPassword(submitableValue))
    toggleChangePasswordModal()
  }

  const submitForm = () => {
    toggle()
    formik.handleSubmit()
  }

  const userDetails = useSelector((state) => state.userReducer.selectedUserData)
  const personAttributes = useSelector((state) => state.attributeReducer.items)
  const loading = useSelector((state) => state.userReducer.loading)
  const setSelectedClaimsToState = (data) => {
    let tempList = [...selectedClaims]
    tempList.push(data)
    setSelectedClaims(tempList)
  }

  useEffect(() => {
    if (formik.values.userConfirmPassword && formik.values.userPassword) {
      if (formik.values.userConfirmPassword != formik.values.userPassword) {
        setPasswordError('Confirm password should be same as password entered.')
        setShowButtons(false)
      } else {
        setPasswordError('')
        setShowButtons(true)
      }
    } else {
      setPasswordError('')
    }
  }, [formik.values.userConfirmPassword, formik.values.userPassword])

  const usedClaimes = [
    'userId',
    'displayName',
    'mail',
    'jansStatus',
    'userPassword',
    'givenName',
    'middleName',
    'sn',
  ]
  const getCustomAttributeById = (id) => {
    let claimData = null
    for (let i in personAttributes) {
      if (personAttributes[i].name == id) {
        claimData = personAttributes[i]
      }
    }
    return claimData
  }

  const setAttributes = () => {
    let tempList = [...selectedClaims]
    for (let i in userDetails.customAttributes) {
      console.log('This is it', userDetails.customAttributes[i])
      let data = getCustomAttributeById(userDetails.customAttributes[i].name)
      if (data && !usedClaimes.includes(userDetails.customAttributes[i].name)) {
        console.log('JMS', data)
        data.options = userDetails.customAttributes[i].values
        tempList.push(data)
      }
    }
    setSelectedClaims(tempList)
  }

  useEffect(() => {
    if (userDetails) {
      setAttributes()
      setShowButtons(true)
    } else {
      setSelectedClaims([])
    }
  }, [userDetails])

  const removeSelectedClaimsFromState = (id) => {
    let tempList = [...selectedClaims]
    formik.setFieldValue(id)
    let newList = tempList.filter((data, index) => data.name !== id)
    setSelectedClaims(newList)
  }

  function goBack() {
    window.history.back()
  }

  const toggleChangePasswordModal = () => {
    setChangePasswordModal(!changePasswordModal)
    formik.setFieldValue('userPassword')
    formik.setFieldValue('userConfirmPassword')
    setShowButtons(true)
  }

  return (
    <GluuLoader blocking={loading}>
      <Modal
        isOpen={changePasswordModal}
        toggle={toggleChangePasswordModal}
        className="modal-outline-primary"
      >
        <ModalHeader>Change Password</ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Col>
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Password"
                name="userPassword"
                type="password"
                value={formik.values.userPassword || ''}
                formik={formik}
                lsize={3}
                rsize={9}
              />
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Confirm Password"
                name="userConfirmPassword"
                type="password"
                value={formik.values.userConfirmPassword || ''}
                formik={formik}
                lsize={3}
                rsize={9}
              />

              {passwordError != '' && (
                <span className="text-danger">{passwordError}</span>
              )}
            </Col>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {formik.values?.userPassword?.length > 3 &&
            formik.values?.userPassword ==
              formik.values.userConfirmPassword && (
              <Button
                color="primary"
                style={applicationstyle.buttonStyle}
                type="button"
                onClick={() => submitChangePassword()}
              >
                {t('actions.change_password')}
              </Button>
            )}
          &nbsp;
          <Button
            color="primary"
            style={applicationstyle.buttonStyle}
            onClick={toggleChangePasswordModal}
          >
            {t('actions.cancel')}
          </Button>
        </ModalFooter>
      </Modal>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          toggle()
        }}
      >
        <FormGroup row>
          <Col sm={8}>
            {userDetails && (
              <GluuInputRow
                label="INUM"
                name="INUM"
                value={userDetails.inum || ''}
                lsize={3}
                rsize={9}
                formik={formik}
                disabled={true}
              />
            )}
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="First Name"
              name="givenName"
              value={formik.values.givenName || ''}
              formik={formik}
              lsize={3}
              rsize={9}
            />

            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Middle Name"
              name="middleName"
              value={formik.values.middleName || ''}
              formik={formik}
              lsize={3}
              rsize={9}
            />

            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Last Name"
              name="sn"
              value={formik.values.sn || ''}
              formik={formik}
              lsize={3}
              rsize={9}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="User Name"
              name="userId"
              value={formik.values.userId || ''}
              formik={formik}
              required
              lsize={3}
              rsize={9}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Display Name"
              name="displayName"
              value={formik.values.displayName || ''}
              formik={formik}
              lsize={3}
              rsize={9}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Email"
              name="mail"
              type="email"
              value={formik.values.mail || ''}
              formik={formik}
              lsize={3}
              rsize={9}
            />

            <GluuSelectRow
              doc_category={DOC_SECTION}
              label="Status"
              name="jansStatus"
              value={formik.values.jansStatus || ''}
              values={['active', 'inactive']}
              formik={formik}
              lsize={3}
              rsize={9}
            />

            {!userDetails && (
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Password"
                name="userPassword"
                type="password"
                value={formik.values.userPassword || ''}
                formik={formik}
                lsize={3}
                rsize={9}
              />
            )}
            {!userDetails && (
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Confirm Password"
                name="userConfirmPassword"
                type="password"
                value={formik.values.userConfirmPassword || ''}
                formik={formik}
                lsize={3}
                rsize={9}
              />
            )}
            {passwordError != '' && !changePasswordModal && (
              <span className="text-danger">{passwordError}</span>
            )}
            {selectedClaims.map((data, key) => (
              <UserClaimEntry
                entry={key}
                data={data}
                formik={formik}
                handler={removeSelectedClaimsFromState}
                type="input"
              />
            ))}
            {showButtons && (
              <FormGroup row>
                <Col md={4}>
                  {userDetails && (
                    <Button
                      color="secondary"
                      onClick={() => setChangePasswordModal(true)}
                      style={applicationstyle.buttonStyle}
                    >
                      <i className="fa fa-key mr-2"></i>
                      {t('actions.change_password')}
                    </Button>
                  )}
                </Col>
                <Col md={8} className="text-right">
                  <Button
                    color="secondary"
                    type="button"
                    onClick={goBack}
                    style={applicationstyle.buttonStyle}
                  >
                    <i className="fa fa-arrow-circle-left mr-2"></i>
                    {t('actions.cancel')}
                  </Button>
                  {/* For Space in buttons */}
                  &nbsp; &nbsp; &nbsp;
                  {/* For Space in buttons */}
                  <Button
                    color="primary"
                    type="submit"
                    style={applicationstyle.buttonStyle}
                  >
                    <i className="fa fa-check-circle mr-2"></i>
                    {t('actions.save')}
                  </Button>
                </Col>
              </FormGroup>
            )}
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
                {personAttributes.map((data, key) => {
                  let name = data.name.toLowerCase()
                  const alreadyAddedClaim = selectedClaims.some(
                    (el) => el.name === data.name,
                  )
                  if (
                    data.status == 'ACTIVE' &&
                    !usedClaimes.includes(data.name)
                  ) {
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
                            {data.displayName}
                          </a>
                        </li>
                      )
                    }
                  }
                })}
              </ul>
            </div>
          </Col>
        </FormGroup>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={formik}
        />
      </Form>
    </GluuLoader>
  )
}

export default UserForm
