export function generateLabel(name: string): string {
  const result = name.replace(/([A-Z])/g, ' $1')
  return result.toLowerCase()
}

export function isRenamedKey(propKey: string): boolean {
  return propKey === 'OpenID Configuration Response OP Metadata Suppression List'
}

export function renamedFieldFromObject(obj: Record<string, unknown>): Record<string, unknown> {
  const { discoveryDenyKeys, ...rest } = obj

  return {
    ...rest,
    'OpenID Configuration Response OP Metadata Suppression List': discoveryDenyKeys ?? [],
  }
}

export function getMissingProperties(properties: string[], apiConfigurations: string[]): string[] {
  return properties.filter(
    (property) => !apiConfigurations.some((configuration) => configuration === property),
  )
}
