export interface IAttributeApi {
  getAttributes: (opts: any, callback: (error: any, data: any) => void) => void
}

export interface AttributeOptions {
  [key: string]: any
}
