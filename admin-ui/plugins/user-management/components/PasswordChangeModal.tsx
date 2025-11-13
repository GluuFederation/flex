import React from 'react'
import { useFormik } from 'formik'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Col, FormGroup, Button } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { TFunction } from 'i18next'
import { passwordChangeValidationSchema } from '../helper/validations'

interface PasswordChangeFormValues {
  userPassword: string
  userConfirmPassword: string
}

interface PasswordChangeModalProps {
  isOpen: boolean
  toggle: () => void
  selectedTheme: string
  t: TFunction
  onPasswordChange: (password: string) => void
}

const PasswordChangeModal = ({
  isOpen,
  toggle,
  selectedTheme,
  t,
  onPasswordChange,
}: PasswordChangeModalProps) => {
  const DOC_SECTION = 'user'
  const passwordFormik = useFormik<PasswordChangeFormValues>({
    initialValues: {
      userPassword: '',
      userConfirmPassword: '',
    },
    validationSchema: passwordChangeValidationSchema,
    onSubmit: (values) => {
      onPasswordChange(values.userPassword)
      passwordFormik.resetForm()
    },
  })

  const handleCancel = () => {
    passwordFormik.resetForm()
    toggle()
  }

  return (
    <Modal isOpen={isOpen} toggle={handleCancel} className="modal-outline-primary">
      <ModalHeader>Change Password</ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Col>
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Password"
              name="userPassword"
              type="password"
              value={passwordFormik.values.userPassword || ''}
              formik={passwordFormik}
              lsize={3}
              rsize={9}
              showError={
                !!passwordFormik.errors.userPassword && passwordFormik.touched.userPassword
              }
              errorMessage={passwordFormik.errors.userPassword}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Confirm Password"
              name="userConfirmPassword"
              type="password"
              value={passwordFormik.values.userConfirmPassword || ''}
              formik={passwordFormik}
              lsize={3}
              rsize={9}
              showError={
                !!passwordFormik.errors.userConfirmPassword &&
                passwordFormik.touched.userConfirmPassword
              }
              errorMessage={passwordFormik.errors.userConfirmPassword}
            />
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          color={`primary-${selectedTheme}`}
          type="button"
          onClick={() => passwordFormik.handleSubmit()}
          disabled={!passwordFormik.isValid || !passwordFormik.dirty}
        >
          {t('actions.change_password')}
        </Button>
        &nbsp;
        <Button color={`primary-${selectedTheme}`} onClick={handleCancel}>
          {t('actions.cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default PasswordChangeModal
