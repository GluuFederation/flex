// Component-specific type definitions
import { FormikProps } from 'formik'
import { CustomUser, PersonAttribute, UserState, CustomAttribute } from './UserApiTypes'
import { UserFormValues } from './CommonTypes'

export interface UserClaimEntryProps {
  data: PersonAttribute
  entry: string | number
  formik: FormikProps<UserFormValues>
  handler: (name: string) => void
  modifiedFields: Record<string, string | string[]>
  setModifiedFields: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>
}

export interface UserFormProps {
  onSubmitData: (
    values: UserEditFormValues,
    modifiedFields: Record<string, string | string[]>,
    usermessage: string,
  ) => void
  userDetails?: CustomUser | null
}

export interface UserEditPageState {
  userReducer: {
    selectedUserData: CustomUser | null
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
    selectedUserData: CustomUser | null
    loading: boolean
  }
  attributesReducerRoot: {
    items: PersonAttribute[]
  }
}

export interface FormOperation {
  path: string
  value: string | string[]
  op: 'add' | 'remove' | 'replace'
}

export interface UserDeviceDetailViewPageProps {
  row: {
    rowData: DeviceData
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

export interface UserTableRowData {
  // Include all CustomUser properties explicitly
  inum?: string
  userId?: string
  displayName?: string
  givenName?: string
  familyName?: string
  mail?: string
  jansStatus?: string
  status?: string
  userPassword?: string
  customAttributes?: CustomAttribute[]
  customObjectClasses?: string[]
  dn?: string
  createdAt?: string
  updatedAt?: string
  baseDn?: string
  // Additional properties specific to table data
  tableData?: {
    uuid: string
    id: number
  }
  action_message?: string
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
    attenstationRequest?: string
    domain?: string
    rpId?: string // Alternative property name for domain
    type?: string
    status?: string
    createdBy?: string
  }
  deviceData?: {
    platform?: string
    name?: string
    os_name?: string
    osName?: string // Alternative property name for os_name
    os_version?: string
    osVersion?: string // Alternative property name for os_version
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
