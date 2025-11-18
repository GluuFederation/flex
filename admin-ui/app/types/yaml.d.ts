// app/types/yaml.d.ts
declare module '*.yaml' {
  const content: {
    components?: {
      schemas?: Record<string, unknown>
    }
    [key: string]: unknown
  }
  export default content
}

declare module '*.yml' {
  const content: {
    components?: {
      schemas?: Record<string, unknown>
    }
    [key: string]: unknown
  }
  export default content
}
