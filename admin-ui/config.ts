import path from 'path'

const root = path.join(__dirname)

const config = {
  rootDir: root,
  serveDir: path.join(root, '.serve'),
  distDir: path.join(root, 'dist'),
  clientManifestFile: 'manifest.webpack.json',
  clientStatsFile: 'stats.webpack.json',
  srcDir: path.join(root, 'app'),
  pluginsDir: path.join(root, 'plugins'),
  pluginsRepoDir: path.join(root, 'plugins_repo'),
  srcServerDir: path.join(root, 'server'),
  srcHtmlLayout: path.join(root, 'app', 'index.html'),
  siteTitle: 'AdminUI',
  siteDescription: 'Jans-server admin Ui',
  siteCannonicalUrl: 'http://localhost:4100',
  siteKeywords: 'jans-server oauth jans gluu',
  scssIncludes: [],
}

export default config
