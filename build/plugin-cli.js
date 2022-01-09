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
      console.info('Added enabled plugins successfully. The project is ready for built.');
    },
    showEnabledPlugins: function() {
      pluginsObj.forEach(ele => {
        if(ele.enabled)
          console.log('- '+ele.key)
      });
    },
    showAllPlugins: function() {
      console.log('Following plugins are present in plugin repository.')
      pluginsObj.forEach(ele => {
      console.log('- '+ele.key)
      });
    },
    enablePlugins: function(value) {
      this.createPluginRepo();
      console.log('Following plugins are enabled.')
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
      console.log('Following plugins are enabled now.')
      this.showEnabledPlugins();
    },
    disablePlugins: function(value) {
      this.createPluginRepo();
      console.log('Following plugins are enabled.')
      this.showEnabledPlugins();
      var pluginsArr = value.split('_,');
      try {
        pluginsObj.forEach((ele, index) => {
          if (pluginsArr.indexOf(ele.key) >= 0) {
            ele.enabled = false;
          }
    
          if (index == (pluginsObj.length-1)) {
            fse.writeFileSync(path.join(dirParamToPath('rootDir'), 'plugins.config.json'),JSON.stringify(pluginsObj, null, 2)) 
            console.log('Following plugins are enabled now.')
            this.addEnabledPlugins();
          }
        });
      } catch (e) {
        console.error('Error in enabling plugin. Check the plugin keys entered in args.')
      }
      this.showEnabledPlugins();
    },

};

program
    .option('-sep, --showEnabledPlugins')
    .option('-sap, --showAllPlugins')
    .option('-sap, --enablePlugins []')
    .option('-sap, --disablePlugins []')
    .parse(process.argv);

for (const commandName in commands) {
    if (commands.hasOwnProperty(commandName) && program[commandName]) {
        commands[commandName](program[commandName]);
    }
}
