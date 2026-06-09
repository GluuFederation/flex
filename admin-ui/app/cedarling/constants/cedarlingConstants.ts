export const CEDARLING_CONSTANTS = {
  ACTION_TYPE: 'GluuFlexAdminUI::Action::',
  RESOURCE_TYPE: 'GluuFlexAdminUIResources::Features',
  TOKEN_MAPPINGS: {
    ACCESS_TOKEN: 'GluuFlexAdminUI::Access_token',
    ID_TOKEN: 'GluuFlexAdminUI::id_token',
    USERINFO_TOKEN: 'GluuFlexAdminUI::Userinfo_token',
  },
} as const

export const CEDARLING_LOG_TYPE = {
  OFF: 'off',
  STD_OUT: 'std_out',
} as const
