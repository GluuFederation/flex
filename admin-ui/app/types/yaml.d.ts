type YamlValue = string | number | boolean | null | { [key: string]: YamlValue } | YamlValue[]

type YamlModuleContent = {
  components?: {
    schemas?: Record<string, YamlValue>
  }
  [key: string]: YamlValue
}

declare module '*.yaml' {
  const content: YamlModuleContent
  export default content
}

declare module '*.yml' {
  const content: YamlModuleContent
  export default content
}
