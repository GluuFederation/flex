import { useEffect, useState } from 'react'
import { FormikProps } from 'formik'
import { UserEditFormValues } from '../types/ComponentTypes'
import { getStringValue, validatePassword } from '../utils/userFormUtils'

const usePasswordValidation = (
  formik: FormikProps<UserEditFormValues>,
  passwordRequirementsMessage: string,
): { passwordError: string; isPasswordReady: boolean } => {
  const [passwordError, setPasswordError] = useState('')
  const [isPasswordReady, setIsPasswordReady] = useState(false)

  useEffect(() => {
    const password = getStringValue(formik.values.userPassword)
    const confirmPassword = getStringValue(formik.values.userConfirmPassword)

    if (!password && !confirmPassword) {
      setPasswordError('')
      setIsPasswordReady(false)
      return
    }

    if (password && !validatePassword(password)) {
      setPasswordError(passwordRequirementsMessage)
      setIsPasswordReady(false)
      return
    }

    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('Confirm password should be same as password entered.')
      setIsPasswordReady(false)
      return
    }

    if (password && confirmPassword && password === confirmPassword) {
      setPasswordError('')
      setIsPasswordReady(true)
    } else {
      setIsPasswordReady(false)
    }
  }, [formik.values.userConfirmPassword, formik.values.userPassword, passwordRequirementsMessage])

  return { passwordError, isPasswordReady }
}

export default usePasswordValidation
