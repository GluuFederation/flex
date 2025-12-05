import { FormikProps } from 'formik'
import { CustomUser, PersonAttribute, CustomAttribute } from './UserApiTypes'
import { UserFormValues } from './CommonTypes'

export interface UserEditFormValues {
  userId?: string
  mail?: string
  displayName?: string
  status?: string
  givenName?: string
  birthdate?: string | null
  [key: string]: string | string[] | boolean | null | undefined
}

export type ModifiedFieldValue = string | string[] | boolean
export type ModifiedFields = Record<string, ModifiedFieldValue>

export interface UserClaimEntryProps {
  data: PersonAttribute
  entry: string | number
  formik: FormikProps<UserFormValues>
  handler: (name: string) => void
  modifiedFields: ModifiedFields
  setModifiedFields: React.Dispatch<React.SetStateAction<ModifiedFields>>
}

export interface UserFormProps {
  onSubmitData: (
    values: UserEditFormValues,
    modifiedFields: ModifiedFields,
    usermessage: string,
  ) => void
  userDetails?: CustomUser | null
  isSubmitting?: boolean
}

export interface UserEditPageState {
  persistenceTypeReducer: {
    type: string
  }
}

export interface FormOperation {
  path: string
  value: string | string[] | boolean
  op: 'add' | 'remove' | 'replace'
}

export interface UserDeviceDetailViewPageProps {
  row: {
    rowData: DeviceData
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

export type FormValueEntry =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { value?: string; label?: string; [key: string]: string | undefined }
