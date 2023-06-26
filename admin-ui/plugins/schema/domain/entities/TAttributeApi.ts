export interface TAttributeApi {
  getAttributes: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  postAttributes: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  putAttributes: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  deleteAttributesByInum: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
  deleteAnAttribute: (
    opts: any,
    callback: (error: any, data: any) => void
  ) => Promise<any>
}
