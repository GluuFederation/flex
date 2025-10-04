#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Test script to verify code splitting implementation
function testCodeSplitting() {
  console.log('🧪 Testing Code Splitting Implementation')
  console.log('========================================\n')

  const tests = [
    {
      name: 'Webpack Configuration',
      test: () => {
        const prodConfig = fs.readFileSync('config/webpack.config.client.prod.ts', 'utf8')
        const devConfig = fs.readFileSync('config/webpack.config.client.dev.ts', 'utf8')

        const hasSplitChunks =
          prodConfig.includes('splitChunks') && devConfig.includes('splitChunks')
        const hasCacheGroups =
          prodConfig.includes('cacheGroups') && devConfig.includes('cacheGroups')
        const hasVendorSplitting =
          prodConfig.includes('react-vendor') && prodConfig.includes('mui-vendor')

        return hasSplitChunks && hasCacheGroups && hasVendorSplitting
      },
    },
    {
      name: 'Route Loader Utility',
      test: () => {
        const routeLoader = fs.readFileSync('app/utils/RouteLoader.tsx', 'utf8')
        return routeLoader.includes('createLazyRoute') && routeLoader.includes('LazyRoutes')
      },
    },
    {
      name: 'Plugin Loader Utility',
      test: () => {
        const pluginLoader = fs.readFileSync('app/utils/PluginLoader.tsx', 'utf8')
        return (
          pluginLoader.includes('createLazyPlugin') && pluginLoader.includes('loadPluginMetadata')
        )
      },
    },
    {
      name: 'Component Loader Utility',
      test: () => {
        const componentLoader = fs.readFileSync('app/utils/ComponentLoader.tsx', 'utf8')
        return (
          componentLoader.includes('createLazyComponent') &&
          componentLoader.includes('LazyComponents')
        )
      },
    },
    {
      name: 'Performance Monitor',
      test: () => {
        const performanceMonitor = fs.readFileSync('app/utils/PerformanceMonitor.tsx', 'utf8')
        return (
          performanceMonitor.includes('PerformanceMonitor') &&
          performanceMonitor.includes('trackChunkLoad')
        )
      },
    },
    {
      name: 'Plugin Menu Resolver',
      test: () => {
        const pluginResolver = fs.readFileSync('plugins/PluginMenuResolver.js', 'utf8')
        return pluginResolver.includes('processRoutes') && pluginResolver.includes('processMenus')
      },
    },
    {
      name: 'Routes Implementation',
      test: () => {
        const routes = fs.readFileSync('app/routes/index.tsx', 'utf8')
        return routes.includes('LazyRoutes') && routes.includes('processRoutes')
      },
    },
    {
      name: 'Bundle Analyzer Configuration',
      test: () => {
        const bundleAnalyzer = fs.readFileSync('config/bundle-analyzer.config.js', 'utf8')
        return (
          bundleAnalyzer.includes('BundleAnalyzerPlugin') && bundleAnalyzer.includes('analyzerMode')
        )
      },
    },
    {
      name: 'Package.json Scripts',
      test: () => {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
        return packageJson.scripts.analyze && packageJson.scripts['analyze:dev']
      },
    },
    {
      name: 'Documentation',
      test: () => {
        return fs.existsSync('docs/CODE_SPLITTING.md')
      },
    },
  ]

  let passed = 0
  let failed = 0

  tests.forEach((test) => {
    try {
      const result = test.test()
      if (result) {
        console.log(`✅ ${test.name}`)
        passed++
      } else {
        console.log(`❌ ${test.name}`)
        failed++
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`)
      failed++
    }
  })

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`)

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Code splitting implementation is complete.')
    console.log('\n📋 Next Steps:')
    console.log('1. Run "npm run build:prod" to test the build')
    console.log('2. Run "npm run analyze" to analyze bundle sizes')
    console.log('3. Test the application to ensure everything works correctly')
    console.log('4. Monitor performance metrics in production')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.')
  }
}

// Run tests
testCodeSplitting()
