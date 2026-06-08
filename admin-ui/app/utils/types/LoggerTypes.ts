export type LogArg = string | number | boolean | bigint | symbol | object | null | undefined

/** Audience for a log call: development only, production only, or every environment. */
export type LogEnv = 'dev' | 'prod' | 'both'
