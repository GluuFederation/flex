export interface TUserApi {
  getUser: (
    action: any,
    callback: (error: any, data: any) => any
  ) => Promise<any>
  postUser: (
    opts: any,
    callback: (error: any, data: any) => any
  ) => Promise<any>
  putUser: (
    opts: any,
    callback: (error: any, data: any) => any
  ) => Promise<any>
  patchUserByInum: (
    inum: string,
    opts: any,
    callback: (error: any, data: any) => any
  ) => Promise<any>
  deleteUser: (
    inum: string,
    callback: (error: any, data: any) => any
  ) => Promise<any>
}
