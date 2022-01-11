const program = require('commander');
const mkdirp = require('mkdirp');
const fse = require('fs-extra');
const config = require('./../config');
const pluginsObj = require('../plugins.config');
const path = require('path');

function dirParamToPath(dirParam) {
    switch(dirParam) {
        case 'plugins_repo':
            return config.pluginsRepoDir;
        case 'plugins':
            return config.pluginsDir;
        case 'rootDir':
            return config.rootDir;
    }
    return null;
}

const commands = {
    createPluginRepo: function() {
        const root = dirParamToPath('rootDir');
        const sourcePath = dirParamToPath('plugins');
        const destPath = dirParamToPath('plugins_repo');
        if(!fse.existsSync(destPath)) {
            fse.renameSync(sourcePath, destPath)
            console.info('Created plugin repo directory: %s', destPath);
            mkdirp.sync(sourcePath);

            const fileList = fse.readdirSync(destPath).filter(ele => path.extname(ele) === '.js');
            fileList.forEach(ele => fse.copyFileSync(path.join(destPath, ele), path.join(sourcePath, ele)))
            console.info('Created empty plugins for processing: %s', sourcePath);
        }
    },
    addEnabledPlugins: function() {
      const pluginsPath = dirParamToPath('plugins');
      const pluginsRepoPath = dirParamToPath('plugins_repo');
      fse.emptyDirSync(pluginsPath)
      
      const fileList = fse.readdirSync(pluginsRepoPath).filter(ele => path.extname(ele) === '.js');
      fileList.forEach(ele => fse.copyFileSync(path.join(pluginsRepoPath, ele), path.join(pluginsPath, ele)))
  
      pluginsObj.forEach(ele => {
        if(ele.enabled)
        fse.copySync(path.join(pluginsRepoPath, ele.key), path.join(pluginsPath, ele.key))
      });
      console.info('Enabled/Disabled plugins successfully. The project is ready for built.');
    },
    showEnabledPlugins: function() {
      if(pluginsObj.filter(ele => ele.enabled).length == 0) {
        console.log('- No Plugin enabled.')
        return;
      }
      pluginsObj.forEach(ele => {
        if(ele.enabled)
          console.log('- '+ele.key)
      });
    },
    showDisabledPlugins: function() {
      if(pluginsObj.filter(ele => !ele.enabled).length == 0) {
        console.log('- No disabled Plugin found.')
        return;
      }
      pluginsObj.forEach(ele => {
        if(!ele.enabled)
          console.log('- '+ele.key)
      });
    },
    showAllPlugins: function() {
      if(pluginsObj.length == 0) {
        console.log('- No Plugin in repo.')
        return;
      }
      console.log('Following plugins are present in plugin repository.')
      pluginsObj.forEach(ele => {
      console.log('- '+ele.key)
      });
    },
    enablePlugins: function(value) {
      this.createPluginRepo();
      console.info('Following plugins are enabled.')
      this.showEnabledPlugins();
      var pluginsArr = value.split('_,');
      try {
        pluginsObj.forEach((ele, index) => {
          if (pluginsArr.indexOf(ele.key) >= 0) {
            ele.enabled = true;
          }
          if (index == (pluginsObj.length-1)) {
            fse.writeFileSync(path.join(dirParamToPath('rootDir'), 'plugins.config.json'),JSON.stringify(pluginsObj, null, 2)) 
            this.addEnabledPlugins();
          }
        });
      } catch (e) {
        console.error('Error in enabling plugin. Check the plugin keys entered in args.')
      }
      console.info('Following plugins are enabled now.')
      this.showEnabledPlugins();
    },
    disablePlugins: function(value) {
      this.createPluginRepo();
      console.info('Following plugins are enabled.')
      this.showEnabledPlugins();
      var pluginsArr = value.split('_,');
      try {
        pluginsObj.forEach((ele, index) => {
          if (pluginsArr.indexOf(ele.key) >= 0) {
            ele.enabled = false;
          }
          if (index == (pluginsObj.length-1)) {
              fse.writeFileSync(path.join(dirParamToPath('rootDir'), 'plugins.config.json'),JSON.stringify(pluginsObj, null, 2)) 
              this.addEnabledPlugins();
          }
        });
      } catch (e) {
        console.error('Error in enabling plugin. Check the plugin keys entered in args.')
      }
      console.info('Following plugins are enabled now.')
      this.showEnabledPlugins();
    },
    installPlugin: function(sourcePath) {
      const pluginsRepoPath = dirParamToPath('plugins_repo');

      this.createPluginRepo();
      console.info('Following plugins are enabled.')
      this.showEnabledPlugins();
      if (!fse.existsSync(sourcePath)) {
        return;
      }
      var lastFolder = sourcePath.split('/').filter(function(el) {
        return el.trim().length > 0;
      }).pop();

      fse.copySync(sourcePath, path.join(pluginsRepoPath, lastFolder))

      pluginsObj.push(this.createPluginEntry(lastFolder));
      fse.writeFileSync(path.join(dirParamToPath('rootDir'), 'plugins.config.json'),JSON.stringify(pluginsObj, null, 2)) 

    },
    createPluginEntry: function(pluginKey) {
      const pluginObj = {};
      pluginObj.key = pluginKey;
      pluginObj.metadataFile = './' + path.join(pluginKey, 'plugin-metadata');
      pluginObj.enabled = false;

      return pluginObj;
    }
};

program
    .option('-sep, --showEnabledPlugins')
    .option('-sep, --showDisabledPlugins')
    .option('-sap, --showAllPlugins')
    .option('-ep, --enablePlugins []')
    .option('-dp, --disablePlugins []')
    .option('-ip, --installPlugin []')
    .parse(process.argv);

for (const commandName in commands) {
    if (commands.hasOwnProperty(commandName) && program[commandName]) {
        commands[commandName](program[commandName]);
    }
}
