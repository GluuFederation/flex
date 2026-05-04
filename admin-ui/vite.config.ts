import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import {
  REGEX_BACKSLASH,
  REGEX_FORWARD_SLASH,
  REGEX_NODE_MODULES_SEGMENT,
  REGEX_STYLE_IMPORT_TILDE_PREFIX,
} from './app/utils/regex'
import type { HmrContext } from 'vite'

const timingPlugin = () => {
  return {
    name: 'admin-ui:timing',
    handleHotUpdate(ctx: HmrContext) {
      const willReload = ctx.modules.length === 0
      if (willReload) {
        console.log(`\n🔴 FULL RELOAD  ${ctx.file}`)
      } else {
        console.log(`\n🔄 HMR update   ${ctx.file}`)
      }
    },
  }
}

const normalizeBasePath = (value?: string): string => {
  const basePath = value || '/admin'
  return basePath.endsWith('/') ? basePath : `${basePath}/`
}

const getPolicyStoreConfig = (mode: string): string => {
  const configFile = mode === 'production' ? 'policy-store-prod.json' : 'policy-store-dev.json'
  const configPath = path.resolve(process.cwd(), 'app/cedarling/config', configFile)

  if (!existsSync(configPath)) {
    throw new Error(
      `Missing Cedarling policy store config for mode "${mode}": ${configPath}. Expected file "${configFile}" under app/cedarling/config.`,
    )
  }

  try {
    return readFileSync(configPath, 'utf-8')
  } catch (error) {
    throw new Error(
      `Failed to read Cedarling policy store config for mode "${mode}" at ${configPath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

const getManualChunkName = (id: string): string | undefined => {
  if (!id.includes('node_modules') || id.includes('.css')) {
    return undefined
  }

  const normalizedId = id.replace(REGEX_BACKSLASH, '/')
  const nodeModulesSegment = normalizedId.split(REGEX_NODE_MODULES_SEGMENT).pop()
  if (!nodeModulesSegment) {
    return undefined
  }

  const [firstPart, secondPart] = nodeModulesSegment.split('/')
  const packageName =
    firstPart?.startsWith('@') && secondPart ? `${firstPart}/${secondPart}` : firstPart

  if (!packageName) {
    return undefined
  }

  return `vendor-${packageName.replace('@', '').replace(REGEX_FORWARD_SLASH, '-')}`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBasePath(env.BASE_PATH)
  const nodeEnv = mode === 'production' ? 'production' : 'development'
  const processEnv = {
    NODE_ENV: nodeEnv,
    BASE_PATH: base === '/' ? '/' : base.replace(/\/$/, ''),
    API_BASE_URL: env.API_BASE_URL,
    CONFIG_API_BASE_URL:
      env.CONFIG_API_BASE_URL && !env.CONFIG_API_BASE_URL.includes('%(')
        ? env.CONFIG_API_BASE_URL
        : undefined,
    POLICY_STORE_CONFIG: getPolicyStoreConfig(mode),
  }

  return {
    appType: 'spa',
    base,
    publicDir: 'public',
    plugins: [
      timingPlugin(),
      wasm(),
      react({
        exclude: [/node_modules/, /jans_config_api_orval/],
      }),
    ],
    resolve: {
      alias: [
        { find: REGEX_STYLE_IMPORT_TILDE_PREFIX, replacement: '' },
        { find: '@', replacement: path.resolve(process.cwd(), 'app') },
        { find: 'Components', replacement: path.resolve(process.cwd(), 'app/components') },
        { find: 'Context', replacement: path.resolve(process.cwd(), 'app/context') },
        { find: 'Images', replacement: path.resolve(process.cwd(), 'app/images') },
        {
          find: 'JansConfigApi',
          replacement: path.resolve(process.cwd(), 'jans_config_api_orval/src/JansConfigApi.ts'),
        },
        { find: 'Plugins', replacement: path.resolve(process.cwd(), 'plugins') },
        { find: 'Redux', replacement: path.resolve(process.cwd(), 'app/redux') },
        { find: 'Routes', replacement: path.resolve(process.cwd(), 'app/routes') },
        { find: 'Styles', replacement: path.resolve(process.cwd(), 'app/styles') },
        { find: 'Utils', replacement: path.resolve(process.cwd(), 'app/utils') },
      ],
    },
    define: {
      'process.env': JSON.stringify(processEnv),
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 4100,
    },
    preview: {
      host: '0.0.0.0',
      port: 4100,
    },
    optimizeDeps: {
      exclude: ['@janssenproject/cedarling_wasm'],
      include: ['animejs'],
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      emptyOutDir: true,
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks: getManualChunkName,
        },
      },
    },
  }
})
