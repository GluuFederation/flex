import * as type from "./ActionType";

export const changeLanguageAction = lang => ({
  type: type.CHANGE_LANGUAGE,
  lang
});

export const addUserAction = user => ({
  type: type.ADD_USER,
  user
});
export const editUserAction = user => ({
  type: type.EDIT_USER,
  user
});
export const deleteUserAction = user => ({
  type: type.DELETE_USER,
  user
});
export const showUsersAction = () => ({
  type: type.SHOW_USERS
});
export const searchUsersAction = pattern => ({
  type: type.SEARCH_USERS,
  pattern
});

export const addGroupAction = group => ({
  type: type.ADD_GROUP,
  group
});
export const editGroupAction = group => ({
  type: type.EDIT_GROUP,
  group
});
export const deleteGroupAction = group => ({
  type: type.DELETE_GROUP,
  group
});
export const showGroupsAction = () => ({
  type: type.SHOW_GROUPS
});
export const searchGroupsAction = pattern => ({
  type: type.SEARCH_GROUPS,
  pattern
});

export const addAttributeAction = attribute => ({
  type: type.ADD_ATTRIBUTE,
  attribute
});
export const editAttributeAction = attribute => ({
  type: type.EDIT_ATTRIBUTE,
  attribute
});
export const deleteAttributeAction = attribute => ({
  type: type.DELETE_ATTRIBUTE,
  attribute
});
export const deleteProviderAction = provider => ({
  type: type.DELETE_PROVIDER,
  provider
});
export const deleteClientAction = client => ({
  type: type.DELETE_CLIENT,
  client
});

export const showAttributesAction = () => ({
  type: type.SHOW_ATTRIBUTES
});
export const searchAttributesAction = pattern => ({
  type: type.SEARCH_ATTRIBUTES,
  pattern
});
