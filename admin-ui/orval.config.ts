import { defineConfig } from 'orval'

export default defineConfig({
  jans: {
    input: {
      target: './configApiSpecs.yaml',
      unsafeDisableValidation: true,
    },
    output: {
      mode: 'single',
      target: './jans_config_api_orval/src/JansConfigApi.ts',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: './orval/orvalMutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: true,
          version: 5,
        },
      },
    },
  },
})
