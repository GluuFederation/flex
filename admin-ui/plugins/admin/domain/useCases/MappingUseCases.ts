export const getSearchAblePermissions = (permissions, selectedPermissions) => {
  const filteredArr = []
  for (const i in permissions) {
    if (!selectedPermissions.includes(permissions[i].permission)) {
      filteredArr.push(permissions[i].permission)
    }
  }

  return filteredArr
}
