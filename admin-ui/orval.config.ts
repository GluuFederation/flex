import { defineConfig } from 'orval'

export default defineConfig({
  jans: {
    input: {
      target: './configApiSpecs.yaml',
      unsafeDisableValidation: true,
    },
    output: {
      mode: 'tags-split',
      target: './jans_config_api_orval/src/JansConfigApi.ts',
      schemas: './jans_config_api_orval/src/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      formatter: 'prettier',
      override: {
        mutator: {
          path: './orval/axiosInstance.ts',
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
