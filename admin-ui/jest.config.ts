import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/__tests__/setup-tests.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  },
  testEnvironmentOptions: {
    url: 'https://admin-ui-test.gluu.org/',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^@janssenproject/cedarling_wasm$': '<rootDir>/__mocks__/@janssenproject/cedarling_wasm.ts',
    '^@/(.*)$': '<rootDir>/app/$1',
    '^Components(.*)$': '<rootDir>/app/components$1',
    '^Context(.*)$': '<rootDir>/app/context$1',
    '^context(.*)$': '<rootDir>/app/context$1',
    '^Images(.*)$': '<rootDir>/app/images$1',
    '^Plugins(.*)$': '<rootDir>/plugins$1',
    '^Redux(.*)$': '<rootDir>/app/redux$1',
    '^Routes(.*)$': '<rootDir>/app/routes$1',
    '^Styles(.*)$': '<rootDir>/app/styles$1',
    '^Utils(.*)$': '<rootDir>/app/utils$1',
    '^JansConfigApi$': '<rootDir>/jans_config_api_orval/src/JansConfigApi.ts',
  },
  testPathIgnorePatterns: ['<rootDir>/jans_config_api/'],
  transformIgnorePatterns: [
    'node_modules/(?!(query-string|decode-uri-component|uuid|split-on-first|filter-obj)/)',
  ],
}

export default config
