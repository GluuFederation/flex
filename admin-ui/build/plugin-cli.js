const program = require('commander')
const mkdirp = require('mkdirp')
const fse = require('fs-extra')
const config = require('./../config')
const pluginsObj = require('../plugins.config')
const path = require('path')
const unzipper = require('unzipper')
const rimraf = require('rimraf')

function dirParamToPath(dirParam) {
  switch(dirParam) {
  case 'plugins_repo':
    return config.pluginsRepoDir
  case 'plugins':
    return config.pluginsDir
  case 'rootDir':
    return config.rootDir
  }
  return null
}

const commands = {
  cleanExceptDefault: function(args) {
    let plugins = []
    try {
      plugins = args.split(',')
    } catch(e) {
      console.error('The args passed is invalid or undefined. All plugins will be removed.')
    }

    const pluginsDir = dirParamToPath('plugins')  

    fse.readdirSync(pluginsDir)
      .map(file => path.join(pluginsDir, file))
      .filter(path => fse.statSync(path).isDirectory())
      .filter(path => !plugins.includes(this.getLastFolderName(path)))
      //.filter(path =>     fse.readdirSync(path).length === 0)
      .map(path => rimraf.sync(path))
  },
  resetPluginConfig: function() {
    const pluginsDir = dirParamToPath('plugins')
    const configJson = []

    fse.readdirSync(pluginsDir)
      .map(file => path.join(pluginsDir, file))
      .filter(path => fse.statSync(path).isDirectory())
      .filter(path => fse.readdirSync(path).length > 0)
      .map(path => configJson.push(this.createPluginEntry(this.getLastFolderName(path))))
    fse.writeFileSync(path.join(dirParamToPath('rootDir'), 'plugins.config.json'), JSON.stringify(configJson, null, 2))
  },
  addPlugin: function(sourcePath) {
    const pluginsPath = dirParamToPath('plugins')

    if (!fse.existsSync(sourcePath)) {
      console.error('Plugin zip not found at %s', sourcePath)
      return
    }
    const lastFolderName = this.getLastFolderName(sourcePath).split('.').slice(0, -1).join('.')

    const pluginPathInRepo = path.join(pluginsPath, lastFolderName)
    if (fse.existsSync(pluginPathInRepo)) {
      console.error('Plugin with %s name already present in plugin repo.', lastFolderName)
      return
    }

    mkdirp.sync(pluginPathInRepo)
    fse.createReadStream(sourcePath).pipe(unzipper.Extract({ path: pluginPathInRepo }))

    pluginsObj.push(this.createPluginEntry(lastFolderName))
    fse.writeFileSync(path.join(dirParamToPath('rootDir'), 'plugins.config.json'), JSON.stringify(pluginsObj, null, 2))

  },
  removePlugin: function(pluginName) {
    try {
      const pluginsPath = dirParamToPath('plugins')
      const pluginPathInRepo = path.join(pluginsPath, pluginName)

      if (fse.existsSync(pluginPathInRepo)) {
        rimraf.sync(pluginPathInRepo)
        fse.writeFileSync(
          path.join(dirParamToPath('rootDir'), 'plugins.config.json'),
          JSON.stringify(pluginsObj.filter(ele => ele.key !== pluginName)), null, 2
        )
      }
    } catch (e) {
      console.error('Error in enabling plugin. Check the plugin keys entered in args.')
    }
  },
  createPluginEntry: function(pluginKey) {
    const pluginObj = {}
    pluginObj.key = pluginKey
    pluginObj.metadataFile = './' + pluginKey+ '/plugin-metadata'
    return pluginObj
  },
  showAllPlugins: function() {
    if(pluginsObj.length == 0) {
      console.log('- No Plugin in repo.')
      return
    }
    console.log('Following plugins are present.')
    pluginsObj.forEach(ele => {
      console.log('- '+ele.key)
    })
  },
  getLastFolderName: function(path) {
    return path.replace(/\\/g, '/').split('/').filter(function(el) {
      return el.trim().length > 0
    }).pop()
  }
}

program
  .option('-cpd, --cleanExceptDefault []')
  .option('-rpc, --resetPluginConfig')
  .option('-sap, --showAllPlugins')
  .option('-ap, --addPlugin []')
  .option('-rp, --removePlugin []')
  .parse(process.argv)

for (const commandName in commands) {
  // eslint-disable-next-line no-prototype-builtins
  if (commands.hasOwnProperty(commandName) && program[commandName]) {
    commands[commandName](program[commandName])
  }
}