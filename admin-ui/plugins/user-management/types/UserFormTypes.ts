import { FormikProps } from 'formik'
import { TFunction } from 'i18next'
import { UserPatchRequest } from 'JansConfigApi'
import { CustomUser } from './UserApiTypes'
import { UserEditFormValues } from './ComponentTypes'
import { PersonAttribute } from './UserApiTypes'

export type ExtendedCustomUser = CustomUser & {
  familyName?: string
  middleName?: string
  jansStatus?: string
}

export type PasswordPatchPayload = UserPatchRequest & {
  inum: string
  performedOn: {
    user_inum: string
    userId?: string | null
  }
  message: string
}

export interface PasswordChangeModalProps {
  isOpen: boolean
  toggle: () => void
  formik: FormikProps<UserEditFormValues>
  passwordError: string
  selectedTheme: string
  t: TFunction
  onPasswordChange: () => void
}

export interface AvailableClaimsPanelProps {
  searchClaims: string
  setSearchClaims: (value: string) => void
  personAttributes: PersonAttribute[]
  selectedClaims: PersonAttribute[]
  setSelectedClaimsToState: (data: PersonAttribute) => void
  setSearchPattern: (pattern: string | undefined) => void
}
