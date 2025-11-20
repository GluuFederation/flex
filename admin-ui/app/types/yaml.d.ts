interface YamlModuleContent {
  components?: {
    schemas?: Record<string, unknown>
  }
  [key: string]: unknown
}

declare module '*.yaml' {
  const content: YamlModuleContent
  export default content
}

declare module '*.yml' {
  const content: YamlModuleContent
  export default content
}
