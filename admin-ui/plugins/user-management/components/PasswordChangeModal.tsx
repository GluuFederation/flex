import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { GluuButton } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import customColors from '@/customColors'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { passwordChangeValidationSchema } from '../helper/validations'
import {
  usePatchUserByInum,
  getGetUserQueryKey,
  UserPatchRequest,
  useRevokeUserSession,
} from 'JansConfigApi'
import type { CaughtError } from '../types/ErrorTypes'
import { logPasswordChange, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { CustomUser } from '../types/UserApiTypes'
import { AXIOS_INSTANCE } from '../../../api-client'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { usePasswordModalStyles } from './PasswordChangeModal.style'

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
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes: formClasses } = usePasswordModalStyles({ isDark, themeColors })

  const [passwordModal, setPasswordModal] = useState(false)
  const [password, setPassword] = useState<string>('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
        await triggerUserWebhook(data)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
        setPasswordModal(false)
        toggle()
        setPassword('')
        onSuccess?.()
      },
      onError: (error: CaughtError) => {
        const errorMessage = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const revokeSessionMutation = useRevokeUserSession()

  const submitChangePassword = useCallback(
    async (userMessage: string) => {
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

      const auditPayload: Record<string, string | string[] | boolean | object | object[]> = {
        ...patchOperations,
        inum: userDetails.inum,
        customAttributes: [{ name: 'userPassword', multiValued: false }],
        performedOn: {
          user_inum: userDetails.inum,
          userId: userDetails.userId || userDetails.displayName,
        },
        message: userMessage,
      }

      await changePasswordMutation.mutateAsync({
        inum: userDetails.inum,
        data: patchOperations,
      })

      const userDn = userDetails?.dn
      if (!userDn) {
        console.error('Failed to revoke user session: missing user DN')
      } else {
        try {
          await revokeSessionMutation.mutateAsync({ userDn })
          await AXIOS_INSTANCE.delete(`/app/admin-ui/oauth2/session/${encodeURIComponent(userDn)}`)
        } catch (error) {
          console.error('Failed to revoke user session:', error)
        }
      }

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

  const resetFormRef = useRef(passwordFormik.resetForm)
  resetFormRef.current = passwordFormik.resetForm

  useEffect(() => {
    if (!isOpen) {
      resetFormRef.current()
      setPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)
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

  const handleCommitDialogCancel = useCallback(() => {
    setPasswordModal(false)
    setPassword('')
  }, [])

  const isApplyDisabled = useMemo(
    () => !passwordFormik.isValid || !passwordFormik.dirty,
    [passwordFormik.isValid, passwordFormik.dirty],
  )

  const isLoading = changePasswordMutation.isPending

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    },
    [handleCancel],
  )

  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
      e.stopPropagation()
    },
    [handleCancel],
  )

  if (!isOpen) return null

  const modalContent = (
    <>
      <GluuCommitDialog
        handler={handleCommitDialogCancel}
        modal={passwordModal}
        onAccept={submitChangePassword}
      />
      <button
        type="button"
        className={commitClasses.overlay}
        onClick={handleCancel}
        onKeyDown={handleOverlayKeyDown}
        aria-label={t('actions.close')}
      />
      <div
        className={commitClasses.modalContainer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        role="dialog"
        tabIndex={-1}
        aria-labelledby="password-modal-title"
      >
        <button
          type="button"
          onClick={handleCancel}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <i className="fa fa-times" aria-hidden />
        </button>
        <div className={commitClasses.contentArea}>
          <GluuText variant="h2" className={commitClasses.title} id="password-modal-title">
            {t('actions.change_password')}
          </GluuText>

          <form onSubmit={handleFormSubmit}>
            <div className={formClasses.fieldsRow}>
              <div className={formClasses.fieldGroup}>
                <label className={formClasses.fieldLabel} htmlFor="userPassword">
                  {t('fields.password')}:<span className={formClasses.fieldRequired}> *</span>
                </label>
                <div className={formClasses.inputWrapper}>
                  <input
                    id="userPassword"
                    name="userPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={formClasses.fieldInput}
                    value={passwordFormik.values.userPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    placeholder={t('placeholders.enter_here', { defaultValue: 'Enter Here' })}
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    className={formClasses.toggleButton}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
                  </button>
                </div>
                <div className={formClasses.errorText}>
                  {passwordFormik.touched.userPassword && passwordFormik.errors.userPassword
                    ? passwordFormik.errors.userPassword
                    : '\u00A0'}
                </div>
              </div>

              <div className={formClasses.fieldGroup}>
                <label className={formClasses.fieldLabel} htmlFor="userConfirmPassword">
                  {t('fields.confirm_password')}:
                  <span className={formClasses.fieldRequired}> *</span>
                </label>
                <div className={formClasses.inputWrapper}>
                  <input
                    id="userConfirmPassword"
                    name="userConfirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={formClasses.fieldInput}
                    value={passwordFormik.values.userConfirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    placeholder={t('placeholders.enter_here', { defaultValue: 'Enter Here' })}
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    className={formClasses.toggleButton}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    <i className={showConfirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
                  </button>
                </div>
                <div className={formClasses.errorText}>
                  {passwordFormik.touched.userConfirmPassword &&
                  passwordFormik.errors.userConfirmPassword
                    ? passwordFormik.errors.userConfirmPassword
                    : '\u00A0'}
                </div>
              </div>
            </div>

            <div className={commitClasses.buttonRow}>
              <GluuButton
                type="submit"
                disabled={isApplyDisabled || isLoading}
                backgroundColor={customColors.statusActive}
                textColor={customColors.white}
                borderColor="transparent"
                padding="8px 28px"
                minHeight="40"
                useOpacityOnHover
                loading={isLoading}
                className={commitClasses.yesButton}
              >
                {t('actions.change_password')}
              </GluuButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export default React.memo(PasswordChangeModal)
