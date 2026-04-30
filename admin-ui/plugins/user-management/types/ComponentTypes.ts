import { FormikProps } from 'formik'
import { CustomUser, PersonAttribute, CustomAttribute } from './UserApiTypes'
import { UserFormValues } from './CommonTypes'

export type UserEditFormValues = {
  userId?: string
  mail?: string
  displayName?: string
  status?: string
  givenName?: string
  middleName?: string
  sn?: string
  userPassword?: string
  userConfirmPassword?: string
  birthdate?: string | null
  [key: string]: string | string[] | boolean | null | undefined
}

export type ModifiedFieldValue = string | string[] | boolean
export type ModifiedFields = Record<string, ModifiedFieldValue>

export type ValueExtractionRecord = {
  role?: string
  value?: string
  label?: string
  [key: string]: string | undefined
}

export type UserClaimEntryProps = {
  data: PersonAttribute
  entry: string | number
  formik: FormikProps<UserFormValues>
  handler: (name: string) => void
  modifiedFields: ModifiedFields
  setModifiedFields: React.Dispatch<React.SetStateAction<ModifiedFields>>
}

export type UserFormProps = {
  onSubmitData: (
    values: UserEditFormValues,
    modifiedFields: ModifiedFields,
    usermessage: string,
  ) => void | Promise<void>
  userDetails?: CustomUser | null
  personAttributes: PersonAttribute[]
  isSubmitting?: boolean
}

export type FormOperation = {
  path: string
  value: string | string[] | boolean
  op: 'add' | 'remove' | 'replace'
}

export type UserDeviceDetailViewPageProps = {
  row: {
    rowData: DeviceData
  }
}

export type UserTableRowData = {
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
  tableData?: {
    uuid: string
    id: number
  }
  action_message?: string
}

export type DeviceData = {
  id?: string
  nickName?: string
  modality?: string
  dateAdded?: string
  type?: string
  soft?: boolean
  addedOn?: number
  registrationData?: {
    attestationRequest?: string
    domain?: string
    rpId?: string
    type?: string
    status?: string
    createdBy?: string
  }
  deviceData?: {
    platform?: string
    name?: string
    os_name?: string
    osName?: string
    os_version?: string
    osVersion?: string
  }
  creationDate?: string
}

export type OTPDevice = {
  id?: string
  nickName?: string
  soft?: boolean
  addedOn?: number
}

export type OTPDevicesData = {
  devices: OTPDevice[]
}

export type FormValueEntry =
  | string
  | string[]
  | boolean
  | null
  | undefined
  | { value?: string; label?: string; [key: string]: string | undefined }
