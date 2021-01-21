const path = require("path");

const root = path.join(__dirname);

const config = {
  rootDir: root,
  // Targets ========================================================
  serveDir: path.join(root, ".serve"),
  distDir: path.join(root, "dist"),
  clientManifestFile: "manifest.webpack.json",
  clientStatsFile: "stats.webpack.json",

  // Source Directory ===============================================
  srcDir: path.join(root, "app"),
  srcServerDir: path.join(root, "server"),

  // HTML Layout ====================================================
  srcHtmlLayout: path.join(root, "app", "index.html"),

  // Site Config ====================================================
  siteTitle: "AdminUI",
  siteDescription: "Jans-server admin Ui",
  siteCannonicalUrl: "http://localhost:4100",
  siteKeywords: "jans-server oauth jans gluu",
  scssIncludes: []
};
module.exports = config;
