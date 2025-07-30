// Component-specific type definitions
import { FormikProps } from 'formik'
import { CustomUser, GetUserOptions, PersonAttribute, UserState } from './UserApiTypes'
import { UserFormValues } from './CommonTypes'

export interface UserClaimEntryProps {
  data: PersonAttribute
  entry: string | number
  formik: FormikProps<UserFormValues>
  handler: (name: string) => void
  modifiedFields: Record<string, unknown>
  setModifiedFields: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}

export interface UserFormProps {
  onSubmitData: (values: any, modifiedFields: any, usermessage: any) => void
}

export interface UserEditPageState {
  userReducer: {
    selectedUserData: any
    redirectToUserListPage: boolean
    loading: boolean
  }
  attributesReducerRoot: {
    items: PersonAttribute[]
    initLoading: boolean
  }
  persistenceTypeReducer: {
    type: string
  }
}

// Define a more specific type for user form values
export interface UserEditFormValues {
  userId?: string
  mail?: string
  displayName?: string
  status?: string
  givenName?: string
  birthdate?: string | null
  [key: string]: string | string[] | null | undefined
}

export interface UserFormState {
  userReducer: {
    selectedUserData: any
    loading: boolean
  }
  attributesReducerRoot: {
    items: PersonAttribute[]
  }
}

export interface FormOperation {
  path: string
  value: any
  op: string
}

export interface SubmitableUserValues {
  inum?: string
  userId?: string
  mail?: string
  displayName?: string
  status?: string
  givenName?: string
  customAttributes?: any[]
  dn?: string
  customObjectClasses?: string[]
  modifiedFields?: Array<Record<string, any>>
  performedOn?: {
    user_inum?: string
    useId?: string
  }
  action_message?: string
}

export interface UserDeviceDetailViewPageProps {
  row: {
    rowData: any
  }
}

// Extended interfaces for this component
export interface UserListRootState {
  userReducer: UserState
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  attributesReducerRoot: {
    items: PersonAttribute[]
    loading: boolean
    initLoading: boolean
  }
}

export interface UserTableData extends CustomUser {
  tableData?: {
    uuid: string
    id: number
  }
  enabled?: boolean
  mail?: string
}

export interface DeviceData {
  id?: string
  nickName?: string
  modality?: string
  dateAdded?: string
  type?: string
  soft?: boolean
  addedOn?: number
  registrationData?: {
    attenstationRequest: string
  }
  deviceData?: {
    platform?: string
  }
  creationDate?: string
}

export interface OTPDevice {
  id?: string
  nickName?: string
  soft?: boolean
  addedOn?: number
}

export interface OTPDevicesData {
  devices: OTPDevice[]
}

export interface UserActionData extends CustomUser {
  action_message?: string
}

export interface SearchOptions extends GetUserOptions {
  startIndex?: number
}
