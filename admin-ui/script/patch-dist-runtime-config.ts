import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import dotenv from 'dotenv'

const ENV_NAME = process.argv[2] || 'production'
const envFileName = ENV_NAME === 'production' ? '.env.production' : `.env.${ENV_NAME}`
const envFilePath = path.resolve(process.cwd(), envFileName)
const distIndexPath = path.resolve(process.cwd(), 'dist/index.html')

if (existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath })
}

if (!existsSync(distIndexPath)) {
  throw new Error(`Missing dist index file: ${distIndexPath}. Run a build before patching.`)
}

const configApiBaseUrl = process.env.CONFIG_API_BASE_URL
const apiBaseUrl = process.env.API_BASE_URL

if (!configApiBaseUrl || !apiBaseUrl) {
  throw new Error(
    `Missing CONFIG_API_BASE_URL or API_BASE_URL in ${envFileName}. Cannot patch dist/index.html.`,
  )
}

const originalHtml = readFileSync(distIndexPath, 'utf-8')
const patchedHtml = originalHtml
  .replace(/%\((configApiBaseUrl)\)s/g, configApiBaseUrl)
  .replace(/%\((apiBaseUrl)\)s/g, apiBaseUrl)

writeFileSync(distIndexPath, patchedHtml, 'utf-8')

console.log(`Patched dist/index.html using ${envFileName}`)
