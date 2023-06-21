export interface TFidoApi {
  getPropertiesFido2: Function
  putPropertiesFido2: (opts: any, callback: (error: any, data: any) => void) => Promise<any>
  testConfigSmtp: Function
}