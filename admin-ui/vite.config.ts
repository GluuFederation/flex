import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import { SondaVitePlugin } from 'sonda'
import {
  REGEX_BACKSLASH,
  REGEX_CODE_BUILD_ASSET,
  REGEX_DATE_FNS_BARE_SPECIFIER,
  REGEX_DATE_FNS_SUBPATH_SPECIFIER,
  REGEX_FORWARD_SLASH,
  REGEX_NODE_MODULES_PREFIX,
  REGEX_NODE_MODULES_SEGMENT,
  REGEX_STYLE_IMPORT_TILDE_PREFIX,
  REGEX_VIRTUAL_MODULE_NULL_PREFIX,
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

const DATE_FNS_PACKAGE_DIR = path.resolve(process.cwd(), 'node_modules/date-fns')

const dateFnsEsmResolverPlugin = () => {
  return {
    name: 'admin-ui:date-fns-esm',
    enforce: 'pre' as const,
    resolveId(source: string): string | null {
      let mjsPath: string | null = null
      if (REGEX_DATE_FNS_BARE_SPECIFIER.test(source)) {
        mjsPath = path.join(DATE_FNS_PACKAGE_DIR, 'index.mjs')
      } else {
        const subpath = REGEX_DATE_FNS_SUBPATH_SPECIFIER.exec(source)?.[1]
        if (subpath) {
          mjsPath = path.join(DATE_FNS_PACKAGE_DIR, `${subpath}.mjs`)
        }
      }
      return mjsPath && existsSync(mjsPath) ? mjsPath : null
    },
  }
}

const REGEX_WASM_ASSET = /\.wasm$/

const wasmPreloadPlugin = (base: string) => {
  return {
    name: 'admin-ui:wasm-preload',
    enforce: 'post' as const,
    transformIndexHtml: {
      order: 'post' as const,
      handler(_html: string, ctx: { bundle?: Record<string, { type: string }> }) {
        if (!ctx.bundle) return
        const wasmFiles = Object.keys(ctx.bundle).filter(
          (fileName) => REGEX_WASM_ASSET.test(fileName) && ctx.bundle?.[fileName].type === 'asset',
        )
        if (wasmFiles.length === 0) return
        return wasmFiles.map((fileName) => ({
          tag: 'link',
          attrs: {
            rel: 'prefetch',
            as: 'fetch',
            type: 'application/wasm',
            crossorigin: '',
            href: `${base}${fileName}`,
          },
          injectTo: 'head' as const,
        }))
      },
    },
  }
}

const MUI_ICON_REGISTRY_PATH = path.resolve(process.cwd(), 'app/components/icons/index.ts')
const REGEX_MUI_ICON_EXPORT = /from\s+['"](@mui\/icons-material\/[^'"]+)['"]/g

const getMuiIconOptimizeDeps = (): string[] => {
  if (!existsSync(MUI_ICON_REGISTRY_PATH)) {
    return []
  }

  const registrySource = readFileSync(MUI_ICON_REGISTRY_PATH, 'utf-8')
  const iconImports = new Set<string>()

  for (const match of registrySource.matchAll(REGEX_MUI_ICON_EXPORT)) {
    const iconImport = match[1]
    if (iconImport) {
      iconImports.add(iconImport)
    }
  }

  return [...iconImports].sort()
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

const REACT_RUNTIME_PACKAGES = new Set<string>([
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'react-redux',
  'react-i18next',
  'react-error-boundary',
  'react-responsive',
  'react-idle-timer',
])

const FEATURE_GROUPS: ReadonlyArray<readonly [name: string, packages: readonly string[]]> = [
  [
    'vendor-mui-core',
    [
      '@mui/material',
      '@mui/system',
      '@mui/base',
      '@mui/private-theming',
      '@mui/styled-engine',
      '@mui/utils',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache',
      '@emotion/is-prop-valid',
      'tss-react',
    ],
  ],
  ['vendor-mui-icons', ['@mui/icons-material']],
  ['vendor-mui-pickers', ['@mui/x-date-pickers']],
  ['vendor-state', ['@reduxjs/toolkit', 'redux-saga', 'redux-persist', '@tanstack/react-query']],
  ['vendor-table', ['@material-table/core']],
  ['vendor-dnd', ['@hello-pangea/dnd']],
  ['vendor-editor', ['react-ace', 'ace-builds']],
  [
    'vendor-charts',
    [
      'recharts',
      'victory-vendor',
      'es-toolkit',
      'decimal.js-light',
      'eventemitter3',
      'd3-array',
      'd3-color',
      'd3-format',
      'd3-interpolate',
      'd3-path',
      'd3-scale',
      'd3-shape',
      'd3-time',
      'd3-time-format',
      'internmap',
    ],
  ],
  [
    'vendor-bootstrap',
    [
      'bootstrap',
      'react-toggle',
      'react-bootstrap-typeahead',
      '@restart/hooks',
      '@restart/ui',
      'compute-scroll-into-view',
      'scroll-into-view-if-needed',
      'lodash.debounce',
      'fast-deep-equal',
      'warning',
      'invariant',
    ],
  ],
  [
    'vendor-floating-ui',
    ['@floating-ui/react-dom', '@floating-ui/dom', '@floating-ui/core', '@floating-ui/utils'],
  ],
  ['vendor-data', ['axios', 'dayjs', 'lodash', 'query-string', 'jszip']],
  ['vendor-forms', ['formik', 'yup']],
  ['vendor-date', ['date-fns']],
  ['vendor-feedback', ['react-toastify', 'react-tooltip']],
]

const getVendorPackageName = (id: string): string | null => {
  if (!id.includes('node_modules') || id.includes('.css')) {
    return null
  }
  const normalizedId = id.replace(REGEX_BACKSLASH, '/')
  const nodeModulesSegment = normalizedId.split(REGEX_NODE_MODULES_SEGMENT).pop()
  if (!nodeModulesSegment) {
    return null
  }
  const [firstPart, secondPart] = nodeModulesSegment.split('/')
  const packageName =
    firstPart?.startsWith('@') && secondPart ? `${firstPart}/${secondPart}` : firstPart
  return packageName || null
}

const isVendorPackageIn =
  (packages: ReadonlySet<string>) =>
  (id: string): boolean => {
    const pkg = getVendorPackageName(id)
    return pkg !== null && packages.has(pkg)
  }

const isVendorModule = (id: string): boolean => getVendorPackageName(id) !== null

const getVendorFallbackChunkName = (id: string): string | null => {
  const pkg = getVendorPackageName(id)
  return pkg === null ? null : `vendor-${pkg.replace('@', '').replace(REGEX_FORWARD_SLASH, '-')}`
}

type VendorChunkGroup = {
  name: string | ((id: string) => string | null)
  test: (id: string) => boolean
}

const VENDOR_CHUNK_GROUPS: VendorChunkGroup[] = [
  { name: 'vendor-react', test: isVendorPackageIn(REACT_RUNTIME_PACKAGES) },
  ...FEATURE_GROUPS.map(
    ([name, packages]): VendorChunkGroup => ({
      name,
      test: isVendorPackageIn(new Set(packages)),
    }),
  ),
  {
    name: 'vendor-orval-jans',
    test: (id: string) => id.replace(REGEX_BACKSLASH, '/').includes('/jans_config_api_orval/src/'),
  },
  { name: getVendorFallbackChunkName, test: isVendorModule },
  {
    name: 'app-shared',
    test: (id: string) => {
      const norm = id.replace(REGEX_BACKSLASH, '/')
      return (
        !norm.includes('/node_modules/') &&
        !norm.includes('/jans_config_api_orval/') &&
        (norm.includes('/app/') || norm.includes('/plugins/'))
      )
    },
  },
]

const normalizeReportSourcePath = (sourcePath: string, sourceRoot: string): string => {
  const withoutPrefix = sourcePath.replace(REGEX_VIRTUAL_MODULE_NULL_PREFIX, '')
  const withoutQuery = withoutPrefix.split('?')[0] ?? withoutPrefix
  const absolutePath = path.isAbsolute(withoutQuery)
    ? withoutQuery
    : path.resolve(sourceRoot || process.cwd(), withoutQuery)
  const posixPath = absolutePath.replace(REGEX_BACKSLASH, '/')
  const collapsedDependency = posixPath.replace(REGEX_NODE_MODULES_PREFIX, 'node_modules/')
  if (collapsedDependency !== posixPath) {
    return collapsedDependency
  }
  const cwd = process.cwd().replace(REGEX_BACKSLASH, '/')
  return posixPath.startsWith(`${cwd}/`) ? posixPath.slice(cwd.length + 1) : posixPath
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBasePath(env.BASE_PATH)
  const muiIconOptimizeDeps = getMuiIconOptimizeDeps()
  const nodeEnv = mode === 'production' ? 'production' : 'development'

  if (mode === 'production') {
    process.env.NODE_ENV = 'production'
  }
  const analyze = process.env.ANALYZE === 'true'
  const sondaOptions = {
    outputDir: 'dist',
    filename: 'sonda-report',
    format: ['html', 'json'] as Array<'html' | 'json'>,
    open: false,
    gzip: true,
    brotli: true,
    deep: true,
    sources: true,
    include: [REGEX_CODE_BUILD_ASSET],
    sourcesPathNormalizer: normalizeReportSourcePath,
  }
  const analyzePlugins: PluginOption[] = analyze
    ? [SondaVitePlugin(sondaOptions) as PluginOption]
    : []
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
      dateFnsEsmResolverPlugin(),
      timingPlugin(),
      wasm(),
      wasmPreloadPlugin(base),
      react({
        exclude: [/node_modules/, /jans_config_api_orval/],
      }),
      ...analyzePlugins,
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: [
        { find: REGEX_STYLE_IMPORT_TILDE_PREFIX, replacement: '' },
        { find: '@', replacement: path.resolve(process.cwd(), 'app') },
        { find: 'Components', replacement: path.resolve(process.cwd(), 'app/components') },
        { find: 'Context', replacement: path.resolve(process.cwd(), 'app/context') },
        { find: 'Images', replacement: path.resolve(process.cwd(), 'app/images') },
        {
          find: 'JansConfigApi',
          replacement: path.resolve(process.cwd(), 'jans_config_api_orval/src/index.ts'),
        },
        { find: 'Orval', replacement: path.resolve(process.cwd(), 'orval') },
        { find: 'Plugins', replacement: path.resolve(process.cwd(), 'plugins') },
        { find: 'Redux', replacement: path.resolve(process.cwd(), 'app/redux') },
        { find: 'Routes', replacement: path.resolve(process.cwd(), 'app/routes') },
        { find: 'Styles', replacement: path.resolve(process.cwd(), 'app/styles') },
        { find: 'Utils', replacement: path.resolve(process.cwd(), 'app/utils') },
      ],
    },
    define: {
      'process.env': JSON.stringify(processEnv),
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
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
      watch: {
        ignored: [
          '**/*.md',
          '**/docs/**',
          '**/__tests__/**',
          '**/__mocks__/**',
          '**/*.test.*',
          '**/*.spec.*',
          '**/jest/**',
          '**/script/**',
          '**/coverage/**',
          '**/dist/**',
          '**/.check-all-out/**',
          '**/.husky/**',
          '**/.vscode/**',
          '**/.claude/**',
        ],
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4100,
    },
    optimizeDeps: {
      exclude: ['@janssenproject/cedarling_wasm'],
      include: ['animejs', ...muiIconOptimizeDeps],
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production' || analyze,
      emptyOutDir: true,
      chunkSizeWarningLimit: 900,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: VENDOR_CHUNK_GROUPS,
            minSize: 10 * 1024,
            minShareCount: 3,
          },
        },
      },
    },
  }
})
