import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { Button, Col, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { PasswordChangeModalProps } from '../types/UserFormTypes'
import { getStringValue, validatePassword } from '../utils/userFormUtils'

const DOC_SECTION = 'user'

const PasswordChangeModal = ({
  isOpen,
  toggle,
  formik,
  passwordError,
  selectedTheme,
  t,
  onPasswordChange,
}: PasswordChangeModalProps) => {
  const passwordValue = getStringValue(formik.values?.userPassword)
  const confirmPasswordValue = getStringValue(formik.values?.userConfirmPassword)

  const isChangePasswordEnabled =
    Boolean(passwordValue) &&
    validatePassword(passwordValue) &&
    passwordValue === confirmPasswordValue

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-outline-primary">
      <ModalHeader>{t('actions.change_password')}</ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Col>
            <GluuInputRow
              doc_category={DOC_SECTION}
              doc_entry="passwordRequirements"
              label="Password"
              name="userPassword"
              type="password"
              value={passwordValue}
              formik={formik}
              lsize={3}
              rsize={9}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              doc_entry="passwordRequirements"
              label="Confirm Password"
              name="userConfirmPassword"
              type="password"
              value={confirmPasswordValue}
              formik={formik}
              lsize={3}
              rsize={9}
            />
            {passwordError && <span className="text-danger">{passwordError}</span>}
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          color={`primary-${selectedTheme}`}
          type="button"
          disabled={!isChangePasswordEnabled}
          onClick={onPasswordChange}
        >
          {t('actions.change_password')}
        </Button>
        &nbsp;
        <Button color={`primary-${selectedTheme}`} onClick={toggle}>
          {t('actions.cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default PasswordChangeModal
