import { UserPatchRequest } from 'JansConfigApi'
import { CustomUser } from './UserApiTypes'
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

export type AvailableClaimsPanelProps = {
  searchClaims: string
  setSearchClaims: (value: string) => void
  personAttributes: PersonAttribute[]
  selectedClaims: PersonAttribute[]
  setSelectedClaimsToState: (data: PersonAttribute) => void
}
