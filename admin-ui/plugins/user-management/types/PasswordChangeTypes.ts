import type { CustomUser } from './UserApiTypes'

export type PasswordChangeFormValues = {
  userPassword: string
  userConfirmPassword: string
}

export type PasswordChangeModalProps = {
  isOpen: boolean
  toggle: () => void
  selectedTheme: string
  userDetails: CustomUser | null
  onSuccess?: () => void
}
