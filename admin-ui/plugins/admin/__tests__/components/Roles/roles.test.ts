interface RoleFixture {
  role: string
  description: string
  scopes: string[]
}

export const roles: RoleFixture[] = [
  {
    role: 'api-admin',
    description:
      'This role allows a user to access all list and search features available. Not possible for this role to perform edition nor deletion',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
  {
    role: 'api-viewer',
    description: 'This role allows a user to perform all possible actions on api objects',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
  {
    role: 'api-editor',
    description:
      'This role allow a user to list, search, add and edit on all available objects excepts the configuration object which is critical for a running server',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
  {
    role: 'api-manager',
    description:
      'This role allows a user to list, search, add, edit and delete all available objects include the configuration object(only in view mode). The user cannot edit nor delete the configuration object.',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
]
