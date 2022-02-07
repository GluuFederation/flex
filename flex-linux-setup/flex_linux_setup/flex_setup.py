#!/usr/bin/python3

import sys
import os
import zipfile
import argparse
from urllib.parse import urljoin

jans_setup_dir = '/opt/jans/jans-setup'
sys.path.append(jans_setup_dir)

if not (os.path.join(jans_setup_dir) and ('/etc/jans/conf/jans.properties')):
    print("Please install Jans server then execute this script.")
    sys.exit()


from setup_app import paths
paths.LOG_FILE = os.path.join(jans_setup_dir, 'logs/flex-setup.log')
paths.LOG_ERROR_FILE = os.path.join(jans_setup_dir, 'logs/flex-setup-error.log')
from setup_app import static
from setup_app.utils import base

from setup_app.utils.package_utils import packageUtils
from setup_app.config import Config
from setup_app.utils.collect_properties import CollectProperties
from setup_app.installers.node import NodeInstaller
from setup_app.installers.httpd import HttpdInstaller
from setup_app.installers.config_api import ConfigApiInstaller

parser = argparse.ArgumentParser(description="This script downloads Gluu Admin UI components and installs")
parser.add_argument('--setup-branch', help="Jannsen setup github branch", default='main')
parser.add_argument('--flex-branch', help="Jannsen setup github branch", default='main')
parser.add_argument('--jans-branch', help="Jannsen setup github branch", default='main')


argsp = parser.parse_args()

# initialize config object
Config.init(paths.INSTALL_DIR)
Config.determine_version()

collectProperties = CollectProperties()
collectProperties.collect()

maven_base_url = 'https://maven.jans.io/maven/io/jans/'
app_versions = {
  "SETUP_BRANCH": argsp.setup_branch,
  "FLEX_BRANCH": argsp.flex_branch,
  "JANS_BRANCH": argsp.jans_branch,
  "JANS_APP_VERSION": "1.0.0",
  "JANS_BUILD": "-SNAPSHOT", 
  "NODE_VERSION": "v14.18.2"
}

node_installer = NodeInstaller()
httpdInstaller = HttpdInstaller()
configApiInstaller = ConfigApiInstaller()

def main():

    if not node_installer.installed():
        node_fn = 'node-{0}-linux-x64.tar.xz'.format(app_versions['NODE_VERSION'])
        node_path = os.path.join(Config.distAppFolder, node_fn)
        if not os.path.exists(node_path):
            print("Downloading", node_fn)
            base.download('https://nodejs.org/dist/{0}/node-{0}-linux-x64.tar.xz'.format(app_versions['NODE_VERSION']), node_path)
        print("Installing node")
        node_installer.install()


    gluu_admin_ui_source_path = os.path.join(Config.distJansFolder, 'gluu-admin-ui.zip')
    log4j2_adminui_path = os.path.join(Config.distJansFolder, 'log4j2-adminui.xml')
    log4j2_path = os.path.join(Config.distJansFolder, 'log4j2.xml')
    admin_ui_plugin_source_path = os.path.join(Config.distJansFolder, 'admin-ui-plugin-distribution.jar')
    flex_path = os.path.join(Config.distJansFolder, 'flex.zip')
    source_dir = os.path.join(Config.outputFolder, 'admin-ui')
    flex_setup_dir = os.path.join(source_dir, 'flex-linux-setup')
    admin_ui_config_properties_path = os.path.join(flex_setup_dir, 'auiConfiguration.properties')

    print("Downloading components")
    base.download(urljoin(maven_base_url, 'admin-ui-plugin/{0}{1}/admin-ui-plugin-{0}{1}-distribution.jar'.format(app_versions['JANS_APP_VERSION'], app_versions['JANS_BUILD'])), admin_ui_plugin_source_path)
    base.download('https://raw.githubusercontent.com/JanssenProject/jans/{}/jans-config-api/server/src/main/resources/log4j2.xml'.format(app_versions['JANS_BRANCH']), log4j2_path)
    base.download('https://raw.githubusercontent.com/JanssenProject/jans/{}/jans-config-api/plugins/admin-ui-plugin/config/log4j2-adminui.xml'.format(app_versions['JANS_BRANCH']), log4j2_adminui_path)
    base.download('https://github.com/GluuFederation/flex/archive/refs/heads/{}.zip'.format(app_versions['FLEX_BRANCH']), flex_path)


    print("Installing Gluu Admin UI Frontend")

    print("Extracting admin-ui from", flex_path)
    base.extract_from_zip(flex_path, 'admin-ui', source_dir)
    base.extract_from_zip(flex_path, 'flex-linux-setup/flex_linux_setup', flex_setup_dir)

    configApiInstaller.renderTemplateInOut(os.path.join(source_dir, '.env.tmp'), source_dir, source_dir)
    configApiInstaller.copyFile(os.path.join(source_dir, '.env.tmp'), os.path.join(source_dir, '.env'))
    configApiInstaller.run([paths.cmd_chown, '-R', 'node:node', source_dir])
    cmd_path = 'PATH=$PATH:{}/bin:{}/bin'.format(Config.jre_home, Config.node_home)

    for cmd in ('npm install @openapitools/openapi-generator-cli', 'npm run api', 'npm install', 'npm run build:prod'):
        print("Executing `{}`".format(cmd))
        run_cmd = '{} {}'.format(cmd_path, cmd)
        configApiInstaller.run(['/bin/su', 'node','-c', run_cmd], source_dir)

    target_dir = os.path.join(httpdInstaller.server_root, 'admin')
    print("Copying files to", target_dir)
    configApiInstaller.copyTree(os.path.join(source_dir, 'dist'), target_dir)

    configApiInstaller.check_clients([('role_based_client_id', '2000.')])

    configApiInstaller.renderTemplateInOut(admin_ui_config_properties_path, flex_setup_dir, configApiInstaller.custom_config_dir)
    admin_ui_plugin_path = os.path.join(configApiInstaller.libDir, os.path.basename(admin_ui_plugin_source_path))
    configApiInstaller.web_app_xml_fn = os.path.join(configApiInstaller.jetty_base, configApiInstaller.service_name, 'webapps/jans-config-api.xml')
    configApiInstaller.copyFile(admin_ui_plugin_source_path, configApiInstaller.libDir)
    configApiInstaller.add_extra_class(admin_ui_plugin_path)

    for logfn in (log4j2_adminui_path, log4j2_path):
        configApiInstaller.copyFile(logfn, configApiInstaller.custom_config_dir)

    print("Restarting Janssen Config Api")
    configApiInstaller.restart()

    print("Installation was completed. Browse https://{}/admin".format(Config.hostname))

if __name__ == "__main__":
    main()
