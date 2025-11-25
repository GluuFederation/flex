import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Col, FormGroup, Form, Row } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { passwordChangeValidationSchema } from '../helper/validations'
import { usePatchUserByInum, getGetUserQueryKey, UserPatchRequest } from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { logPasswordChange, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { CustomUser } from '../types/UserApiTypes'

interface PasswordChangeFormValues {
  userPassword: string
  userConfirmPassword: string
}

interface PasswordChangeModalProps {
  isOpen: boolean
  toggle: () => void
  selectedTheme: string
  userDetails: CustomUser | null
  onSuccess?: () => void
}

const PasswordChangeModal = ({
  isOpen,
  toggle,
  selectedTheme: _selectedTheme,
  userDetails,
  onSuccess,
}: PasswordChangeModalProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const DOC_SECTION = 'user'

  const [passwordModal, setPasswordModal] = useState(false)
  const [password, setPassword] = useState<string>('')

  const initialValues = useMemo<PasswordChangeFormValues>(
    () => ({
      userPassword: '',
      userConfirmPassword: '',
    }),
    [],
  )

  const changePasswordMutation = usePatchUserByInum({
    mutation: {
      onSuccess: async (data: CustomUser) => {
        dispatch(updateToast(true, 'success', t('messages.password_changed_successfully')))
        await triggerUserWebhook(data as Record<string, unknown>)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
        setPasswordModal(false)
        toggle()
        setPassword('')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const submitChangePassword = useCallback(
    (userMessage: string) => {
      if (!userDetails?.inum || !password) return

      const passwordAttrIndex = userDetails?.customAttributes?.findIndex(
        (attr) => attr.name === 'userPassword',
      )

      const patchOperations: UserPatchRequest =
        passwordAttrIndex !== undefined && passwordAttrIndex >= 0
          ? {
              jsonPatchString: JSON.stringify([
                {
                  op: 'replace',
                  path: `/customAttributes/${passwordAttrIndex}/values/0`,
                  value: password,
                },
              ]),
            }
          : {
              jsonPatchString: JSON.stringify([
                {
                  op: 'add',
                  path: '/customAttributes/-',
                  value: {
                    name: 'userPassword',
                    multiValued: false,
                    values: [password],
                  },
                },
              ]),
            }

      // Create audit payload for logging
      const auditPayload: Record<string, unknown> = {
        ...patchOperations,
        inum: userDetails.inum,
        customAttributes: [
          {
            name: 'userPassword',
            multiValued: false,
          },
        ],
        performedOn: {
          user_inum: userDetails.inum,
          userId: userDetails.userId || userDetails.displayName,
        },
        message: userMessage,
      }

      changePasswordMutation.mutate({
        inum: userDetails.inum,
        data: patchOperations,
      })

      // Log audit separately with full payload
      logPasswordChange(userDetails.inum, auditPayload).catch((error) => {
        console.error('Failed to log password change:', error)
      })
    },
    [userDetails, password, changePasswordMutation],
  )

  const handlePasswordSubmit = useCallback((values: PasswordChangeFormValues) => {
    setPassword(values.userPassword)
    setPasswordModal(true)
  }, [])

  const passwordFormik = useFormik<PasswordChangeFormValues>({
    initialValues,
    validationSchema: passwordChangeValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: handlePasswordSubmit,
  })

  // Store resetForm in a ref to avoid dependency issues
  const resetFormRef = useRef(passwordFormik.resetForm)
  resetFormRef.current = passwordFormik.resetForm

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetFormRef.current()
      setPassword('')
    }
  }, [isOpen])

  const handleCancel = useCallback(() => {
    passwordFormik.resetForm()
    setPassword('')
    toggle()
  }, [passwordFormik, toggle])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      passwordFormik.handleSubmit()
    },
    [passwordFormik],
  )

  const handleApply = useCallback(() => {
    passwordFormik.handleSubmit()
  }, [passwordFormik])

  const handleCommitDialogCancel = useCallback(() => {
    setPasswordModal(false)
    setPassword('')
  }, [])

  const modalStyle = useMemo(
    () => ({
      maxWidth: '700px',
      width: '100%',
    }),
    [],
  )

  const isApplyDisabled = useMemo(
    () => !passwordFormik.isValid || !passwordFormik.dirty,
    [passwordFormik.isValid, passwordFormik.dirty],
  )

  const isLoading = changePasswordMutation.isPending

  return (
    <>
      <GluuCommitDialog
        handler={handleCommitDialogCancel}
        modal={passwordModal}
        onAccept={submitChangePassword}
        isLoading={isLoading}
      />
      <Modal
        isOpen={isOpen}
        toggle={handleCancel}
        size="lg"
        className="modal-outline-primary"
        style={modalStyle}
      >
        <ModalHeader>{t('actions.change_password')}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleFormSubmit}>
            <FormGroup row>
              <Col>
                <GluuInputRow
                  doc_category={DOC_SECTION}
                  doc_entry="passwordRequirements"
                  label={t('fields.password')}
                  name="userPassword"
                  type="password"
                  value={passwordFormik.values.userPassword || ''}
                  formik={passwordFormik}
                  lsize={4}
                  rsize={8}
                  showError={
                    !!passwordFormik.errors.userPassword &&
                    (passwordFormik.touched.userPassword || !!passwordFormik.values.userPassword)
                  }
                  errorMessage={passwordFormik.errors.userPassword}
                />
                <GluuInputRow
                  doc_category={DOC_SECTION}
                  doc_entry="passwordRequirements"
                  label={t('fields.confirm_password')}
                  name="userConfirmPassword"
                  type="password"
                  value={passwordFormik.values.userConfirmPassword || ''}
                  formik={passwordFormik}
                  lsize={4}
                  rsize={8}
                  showError={
                    !!passwordFormik.errors.userConfirmPassword &&
                    (passwordFormik.touched.userConfirmPassword ||
                      !!passwordFormik.values.userConfirmPassword)
                  }
                  errorMessage={passwordFormik.errors.userConfirmPassword}
                />
              </Col>
            </FormGroup>

            <Row>
              <Col>
                <GluuFormFooter
                  showBack={false}
                  showCancel={true}
                  showApply={true}
                  onCancel={handleCancel}
                  onApply={handleApply}
                  disableCancel={false}
                  disableApply={isApplyDisabled}
                  applyButtonType="button"
                  applyButtonLabel={t('actions.change_password')}
                  isLoading={isLoading}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default React.memo(PasswordChangeModal)
