export const findAndFilterScopeClients = (
  scopeInum,
  scopes,
  nonExtensibleClients,
  filterClientsByScope,
  addOrg,
) => {
  const foundScope = scopes.find(({ inum }) => inum === scopeInum)

  if (foundScope?.clients && Array.isArray(foundScope.clients) && foundScope.clients.length > 0) {
    return foundScope.clients
  }

  if (foundScope && nonExtensibleClients.length > 0) {
    const scopeDn = foundScope.dn || foundScope.baseDn
    if (scopeDn) {
      const filteredClients = filterClientsByScope(scopeInum, scopeDn)
      if (filteredClients.length > 0) {
        return filteredClients.map(addOrg)
      }
    }
  }

  return null
}
