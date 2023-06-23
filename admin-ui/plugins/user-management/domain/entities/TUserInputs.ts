export interface TDefaultUserInputs {
  userId: string;
  mail: string;
  displayName: string;
  jansStatus: string;
  givenName: string;
  userPassword?: string;
  customAttributes?: Array<TCustomAttributes>;
  sn?: string;
  middleName?: string;
  userConfirmPassword?: string;
}

export interface TCustomAttributes {
  name: string;
  multiValued: boolean;
  values: Array<string>;
}
