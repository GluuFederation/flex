#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Bundle analysis script
function analyzeBundle() {
  const statsPath = path.join(__dirname, '../dist/bundle-stats.json')

  if (!fs.existsSync(statsPath)) {
    console.log('Bundle stats not found. Run "npm run build:prod" first.')
    return
  }

  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'))

  console.log('\n📊 Bundle Analysis Report')
  console.log('========================\n')

  // Analyze chunks
  const chunks = stats.chunks || []
  const assets = stats.assets || []

  console.log('📦 Chunk Analysis:')
  console.log('------------------')

  chunks.forEach((chunk) => {
    const chunkAssets = assets.filter((asset) => asset.chunks && asset.chunks.includes(chunk.id))
    const totalSize = chunkAssets.reduce((sum, asset) => sum + asset.size, 0)

    console.log(`\nChunk ${chunk.id}: ${chunk.names.join(', ')}`)
    console.log(`  Size: ${(totalSize / 1024).toFixed(2)} KB`)
    console.log(`  Modules: ${chunk.modules ? chunk.modules.length : 0}`)

    if (chunkAssets.length > 0) {
      console.log('  Assets:')
      chunkAssets.forEach((asset) => {
        console.log(`    - ${asset.name}: ${(asset.size / 1024).toFixed(2)} KB`)
      })
    }
  })

  // Analyze vendor chunks
  console.log('\n🏪 Vendor Chunk Analysis:')
  console.log('-------------------------')

  const vendorChunks = chunks.filter((chunk) => chunk.names.some((name) => name.includes('vendor')))

  vendorChunks.forEach((chunk) => {
    const chunkAssets = assets.filter((asset) => asset.chunks && asset.chunks.includes(chunk.id))
    const totalSize = chunkAssets.reduce((sum, asset) => sum + asset.size, 0)

    console.log(`\n${chunk.names.join(', ')}: ${(totalSize / 1024).toFixed(2)} KB`)
  })

  // Analyze plugin chunks
  console.log('\n🔌 Plugin Chunk Analysis:')
  console.log('-------------------------')

  const pluginChunks = chunks.filter((chunk) => chunk.names.some((name) => name.includes('plugin')))

  pluginChunks.forEach((chunk) => {
    const chunkAssets = assets.filter((asset) => asset.chunks && asset.chunks.includes(chunk.id))
    const totalSize = chunkAssets.reduce((sum, asset) => sum + asset.size, 0)

    console.log(`\n${chunk.names.join(', ')}: ${(totalSize / 1024).toFixed(2)} KB`)
  })

  // Total bundle size
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0)
  console.log(`\n📈 Total Bundle Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)

  // Recommendations
  console.log('\n💡 Recommendations:')
  console.log('-------------------')

  const largeChunks = chunks.filter((chunk) => {
    const chunkAssets = assets.filter((asset) => asset.chunks && asset.chunks.includes(chunk.id))
    const totalSize = chunkAssets.reduce((sum, asset) => sum + asset.size, 0)
    return totalSize > 500 * 1024 // 500KB
  })

  if (largeChunks.length > 0) {
    console.log('⚠️  Large chunks detected (>500KB):')
    largeChunks.forEach((chunk) => {
      const chunkAssets = assets.filter((asset) => asset.chunks && asset.chunks.includes(chunk.id))
      const totalSize = chunkAssets.reduce((sum, asset) => sum + asset.size, 0)
      console.log(`   - ${chunk.names.join(', ')}: ${(totalSize / 1024).toFixed(2)} KB`)
    })
    console.log('   Consider further splitting these chunks.')
  } else {
    console.log('✅ All chunks are reasonably sized.')
  }

  console.log('\n🎯 Code Splitting Benefits:')
  console.log('   - Faster initial page load')
  console.log('   - Better caching strategy')
  console.log('   - Reduced memory usage')
  console.log('   - Improved user experience')
}

// Run analysis
analyzeBundle()
