const configuredBasePath = process.env.BASE_PATH ?? '/admin/'

const BASE_PATH: string = configuredBasePath.endsWith('/')
  ? configuredBasePath
  : `${configuredBasePath}/`

export { BASE_PATH }
