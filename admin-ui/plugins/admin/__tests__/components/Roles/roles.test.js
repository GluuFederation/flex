export const roles = [
  {
    role: 'api-viewer',
    description:
      'Allows a user to view and search all available objects. No permissions to create, edit, or delete.',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
  {
    role: 'api-editor',
    description:
      'Allows a user to view, search, add, and edit all objects except critical configuration objects, which can only be viewed.',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
  {
    role: 'api-manager',
    description:
      'Allows a user to view, search, add, edit, and delete all objects, except that configuration objects can only be viewed, not modified.',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
  {
    role: 'api-admin',
    description:
      'Grants full administrative access, including viewing, creating, editing, and deleting all objects, including configuration objects.',
    scopes: [
      'https://jans.io/oauth/config/attributes.readonly',
      'https://jans.io/oauth/config/acrs.readonly',
    ],
  },
]

export default roles
