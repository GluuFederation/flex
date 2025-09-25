import { defineConfig } from 'orval'

export default defineConfig({
  jans: {
    input: {
      target: './configApiSpecs.yaml',
    },
    output: {
      mode: 'split',
      target: './jans_config_api_orval/src/index.ts',
      schemas: './jans_config_api_orval/src/model',
      client: 'axios',
      httpClient: 'axios',
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: './jans_config_api_orval/src/api-client.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
