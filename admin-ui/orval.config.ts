import { defineConfig } from 'orval'

export default defineConfig({
  jans: {
    input: {
      target: './configApiSpecs.yaml',
    },
    output: {
      mode: 'single',
      target: './jans_config_api_orval/src/JansConfigApi.ts',
      client: 'axios',
      httpClient: 'axios',
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: './api-client.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
