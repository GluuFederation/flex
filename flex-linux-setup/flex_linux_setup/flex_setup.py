#!/usr/bin/python3

import sys
import os
import zipfile
import argparse
import time
import glob
import code
import configparser
import shlex
import shutil

from pathlib import Path
from urllib import request
from urllib.parse import urljoin


def get_flex_setup_parser():
    parser = argparse.ArgumentParser(description="This script downloads Gluu Admin UI components and installs")
    parser.add_argument('--jans-setup-branch', help="Jannsen setup github branch", default='main')
    parser.add_argument('--flex-branch', help="Jannsen flex setup github branch", default='main')
    parser.add_argument('--jans-branch', help="Jannsen github branch", default='main')
    parser.add_argument('--flex-non-interactive', help="Non interactive mode", action='store_true')
    parser.add_argument('--install-admin-ui', help="Installs admin-ui", action='store_true')
    parser.add_argument('--install-casa', help="Installs casa", action='store_true')
    return parser

__STATIC_SETUP_DIR__ = '/opt/jans/jans-setup/'

installed_components = {'admin_ui': False, 'casa': False}
argsp = None

try:
    import jans_setup
    path_ = list(jans_setup.__path__)
    sys.path.append(path_[0])
except ModuleNotFoundError:
    if os.path.exists(os.path.join(__STATIC_SETUP_DIR__, 'setup_app')):
        sys.path.append(__STATIC_SETUP_DIR__)
    else:
        argsp, nargs = get_flex_setup_parser().parse_known_args()

        print("Unable to locate jans-setup, installing ...")

        setup_branch = argsp.jans_setup_branch or 'main'
        install_url = 'https://raw.githubusercontent.com/JanssenProject/jans/{}/jans-linux-setup/jans_setup/install.py'.format(setup_branch)
        request.urlretrieve(install_url, 'install.py')
        install_cmd = 'python3 install.py --setup-branch={}'.format(setup_branch)
        if nargs:
            install_cmd += ' --args="{}"'.format(shlex.join(nargs))
        print("Executing", install_cmd)
        os.system(install_cmd)
        sys.path.append(__STATIC_SETUP_DIR__)

if not argsp:
    argsp, nargs = get_flex_setup_parser().parse_known_args()

install_components = {
        'admin_ui': argsp.install_admin_ui,
        'casa': argsp.install_casa
    }


logs_dir = os.path.join(__STATIC_SETUP_DIR__, 'logs')

if not os.path.exists(logs_dir):
    os.makedirs(logs_dir)

from setup_app import paths
paths.LOG_FILE = os.path.join(logs_dir, 'flex-setup.log')
paths.LOG_ERROR_FILE = os.path.join(logs_dir, 'flex-setup-error.log')
print()
print("Log Files:")
print('\033[1m')
print(paths.LOG_FILE)
print(paths.LOG_ERROR_FILE)
print('\033[0m')


parser = get_flex_setup_parser()
from setup_app.utils import arg_parser
arg_parser.add_to_me(parser)
installed = False

if not os.path.exists('/etc/jans/conf/jans.properties'):
    installed = True
    try:
        from jans_setup import jans_setup
    except ImportError:
        import jans_setup
    jans_setup.main()

argsp = arg_parser.get_parser()

from setup_app import static
from setup_app.utils import base

profile_fn = os.path.join(base.par_dir, 'profile')
if os.path.exists(profile_fn):
    with open(profile_fn) as f:
        profile = f.read().strip()
else:
    profile = 'jans'

os.environ['JANS_PROFILE'] = profile
base.current_app.profile = profile


if 'SETUP_BRANCH' not in base.current_app.app_info:
    base.current_app.app_info['SETUP_BRANCH'] = argsp.jans_setup_branch

base.current_app.app_info['ox_version'] = base.current_app.app_info['JANS_APP_VERSION'] + base.current_app.app_info['JANS_BUILD']

sys.path.insert(0, base.pylib_dir)
sys.path.insert(0, os.path.join(base.pylib_dir, 'gcs'))

from setup_app.pylib.jproperties import Properties
from setup_app.utils.package_utils import packageUtils
from setup_app.config import Config
from setup_app.utils.collect_properties import CollectProperties
from setup_app.installers.node import NodeInstaller
from setup_app.installers.httpd import HttpdInstaller
from setup_app.installers.config_api import ConfigApiInstaller
from setup_app.installers.jetty import JettyInstaller
from setup_app.installers.jans_auth import JansAuthInstaller
from setup_app.installers.jans_cli import JansCliInstaller
from setup_app.utils.properties_utils import propertiesUtils

Config.outputFolder = os.path.join(__STATIC_SETUP_DIR__, 'output')
if not os.path.join(Config.outputFolder):
    os.makedirs(Config.outputFolder)

if not installed:

    # initialize config object
    Config.init(paths.INSTALL_DIR)

    collectProperties = CollectProperties()
    collectProperties.collect()

maven_base_url = 'https://jenkins.jans.io/maven/io/jans/'
app_versions = {
  "SETUP_BRANCH": argsp.jans_setup_branch,
  "FLEX_BRANCH": argsp.flex_branch,
  "JANS_BRANCH": argsp.jans_branch,
  "JANS_APP_VERSION": "1.0.1",
  "JANS_BUILD": "-SNAPSHOT", 
  "NODE_VERSION": "v14.18.2",
  "CASA_VERSION": "5.0.0-SNAPSHOT",
  "TWILIO_VERSION": "7.17.0",
}

node_installer = NodeInstaller()
httpd_installer = HttpdInstaller()
config_api_installer = ConfigApiInstaller()
jansAuthInstaller = JansAuthInstaller()
jans_cli_installer = JansCliInstaller()
setup_properties = base.read_properties_file(argsp.f) if argsp.f else {}

class flex_installer(JettyInstaller):


    def __init__(self):

        self.jans_auth_dir = os.path.join(Config.jetty_base, jansAuthInstaller.service_name)
        self.jans_auth_custom_lib_dir = os.path.join(self.jans_auth_dir, 'custom/libs')

        self.gluu_admin_ui_source_path = os.path.join(Config.dist_jans_dir, 'gluu-admin-ui.zip')
        self.log4j2_adminui_path = os.path.join(Config.dist_jans_dir, 'log4j2-adminui.xml')
        self.log4j2_path = os.path.join(Config.dist_jans_dir, 'log4j2.xml')
        self.admin_ui_plugin_source_path = os.path.join(Config.dist_jans_dir, 'admin-ui-plugin.jar')
        self.flex_path = os.path.join(Config.dist_jans_dir, 'flex.zip')
        self.source_dir = os.path.join(Config.install_dir, 'flex')
        self.flex_setup_dir = os.path.join(self.source_dir, 'flex-linux-setup')
        self.templates_dir = os.path.join(self.flex_setup_dir, 'templates')
        self.admin_ui_config_properties_path = os.path.join(self.templates_dir, 'auiConfiguration.properties')
        self.casa_dist_dir = os.path.join(Config.dist_jans_dir, 'gluu-casa')
        self.casa_web_resources_fn = os.path.join(self.casa_dist_dir, 'casa_web_resources.xml')
        self.casa_war_fn = os.path.join(self.casa_dist_dir, 'casa.war')
        self.casa_config_fn = os.path.join(self.casa_dist_dir,'casa-config.jar')
        self.casa_script_fn = os.path.join(self.casa_dist_dir,'Casa.py')
        self.twillo_fn = os.path.join(self.casa_dist_dir,'twilio.jar')
        self.py_lib_dir = os.path.join(Config.jansOptPythonFolder, 'libs')
        self.fido2_client_jar_fn = os.path.join(Config.dist_jans_dir, 'jans-fido2-client.jar')
        self.dbUtils.bind(force=True)

        if os.path.exists(self.source_dir):
            os.rename(self.source_dir, self.source_dir+'-'+time.ctime().replace(' ', '_'))



    def download_files(self):
        print("Downloading components")
        base.download('https://github.com/GluuFederation/flex/archive/refs/heads/{}.zip'.format(app_versions['FLEX_BRANCH']), self.flex_path, verbose=True)

        print("Extracting", self.flex_path)
        base.extract_from_zip(self.flex_path, 'flex-linux-setup/flex_linux_setup', self.flex_setup_dir)

        if install_components['admin_ui']:
            base.download(urljoin(maven_base_url, 'jans-config-api/plugins/admin-ui-plugin/{0}{1}/admin-ui-plugin-{0}{1}-distribution.jar'.format(app_versions['JANS_APP_VERSION'], app_versions['JANS_BUILD'])), self.admin_ui_plugin_source_path, verbose=True)
            base.download('https://raw.githubusercontent.com/JanssenProject/jans/{}/jans-config-api/server/src/main/resources/log4j2.xml'.format(app_versions['JANS_BRANCH']), self.log4j2_path, verbose=True)
            base.download('https://raw.githubusercontent.com/JanssenProject/jans/{}/jans-config-api/plugins/admin-ui-plugin/config/log4j2-adminui.xml'.format(app_versions['JANS_BRANCH']), self.log4j2_adminui_path, verbose=True)
        
        if install_components['casa']:
            base.download('https://raw.githubusercontent.com/GluuFederation/flex/main/casa/extras/casa_web_resources.xml', self.casa_web_resources_fn, verbose=True)
            base.download('https://maven.gluu.org/maven/org/gluu/casa/{0}/casa-{0}.war'.format(app_versions['CASA_VERSION']), self.casa_war_fn, verbose=True)
            base.download('https://maven.gluu.org/maven/org/gluu/casa-config/{0}/casa-config-{0}.jar'.format(app_versions['CASA_VERSION']), self.casa_config_fn, verbose=True)
            base.download('https://repo1.maven.org/maven2/com/twilio/sdk/twilio/{0}/twilio-{0}.jar'.format(app_versions['TWILIO_VERSION']), self.twillo_fn, verbose=True)
            base.download('https://raw.githubusercontent.com/GluuFederation/flex/main/casa/extras/Casa.py', self.casa_script_fn, verbose=True)
            base.download('https://raw.githubusercontent.com/GluuFederation/flex/main/casa/extras/casa-external_fido2.py', os.path.join(self.casa_dist_dir, 'pylib/casa-external_fido2.py'), verbose=True)
            base.download('https://raw.githubusercontent.com/GluuFederation/flex/main/casa/extras/casa-external_otp.py', os.path.join(self.casa_dist_dir, 'pylib/casa-external_otp.py'), verbose=True)
            base.download('https://raw.githubusercontent.com/GluuFederation/flex/main/casa/extras/casa-external_super_gluu.py', os.path.join(self.casa_dist_dir, 'pylib/casa-external_super_gluu.py'), verbose=True)
            base.download('https://raw.githubusercontent.com/GluuFederation/flex/main/casa/extras/casa-external_twilio_sms.py', os.path.join(self.casa_dist_dir, 'pylib/casa-external_twilio_sms.py'), verbose=True)
            base.download('https://maven.jans.io/maven/io/jans/jans-fido2-client/{0}{1}/jans-fido2-client-{0}{1}.jar'.format(app_versions['JANS_APP_VERSION'], app_versions['JANS_BUILD']), self.fido2_client_jar_fn, verbose=True)


    def add_apache_directive(self, check_str, template):
        print("Updating apache configuration")
        apache_directive_template_text = self.readFile(os.path.join(self.templates_dir, template))
        apache_directive_text = self.fomatWithDict(apache_directive_template_text, Config.templateRenderingDict)

        https_jans_text = self.readFile(httpd_installer.https_jans_fn)

        if check_str not in https_jans_text:

            https_jans_list = https_jans_text.splitlines()
            n = 0

            for i, l in enumerate(https_jans_list):
                if l.strip() == '</LocationMatch>':
                    n = i

            https_jans_list.insert(n+1, '\n' + apache_directive_text + '\n')
            self.writeFile(httpd_installer.https_jans_fn, '\n'.join(https_jans_list))

        self.enable_apache_mod_dir()

    def enable_apache_mod_dir(self):

        # Enable mod_dir for apache

        cmd_a2enmod = shutil.which('a2enmod')

        if base.clone_type == 'deb':
            httpd_installer.run([cmd_a2enmod, 'dir'])

        elif base.os_type == 'suse':
            httpd_installer.run([cmd_a2enmod, 'dir'])
            cmd_a2enflag = shutil.which('a2enflag')
            httpd_installer.run([cmd_a2enflag, 'SSL'])

        else:
            base_mod_path = Path('/etc/httpd/conf.modules.d/00-base.conf')
            mod_load_content = base_mod_path.read_text().splitlines()
            modified = False

            for i, l in enumerate(mod_load_content[:]):
                ls = l.strip()
                if ls.startswith('#') and ls.endswith('mod_dir.so'):
                    mod_load_content[i] = ls.lstrip('#')
                    modified = True

            if modified:
                base_mod_path.write_text('\n'.join(mod_load_content))


    def install_gluu_admin_ui(self):

        print("Installing Gluu Admin UI Frontend")

        print("Extracting admin-ui from", self.flex_path)

        base.extract_from_zip(self.flex_path, 'admin-ui', self.source_dir)

        print("Source directory:", self.source_dir)
        env_tmp = os.path.join(self.source_dir, '.env.tmp')
        print("env_tmp", env_tmp)
        config_api_installer.renderTemplateInOut(env_tmp, self.source_dir, self.source_dir)
        config_api_installer.copyFile(os.path.join(self.source_dir, '.env.tmp'), os.path.join(self.source_dir, '.env'))
        config_api_installer.run([paths.cmd_chown, '-R', 'node:node', self.source_dir])
        cmd_path = 'PATH=$PATH:{}/bin:{}/bin'.format(Config.jre_home, Config.node_home)

        for cmd in ('npm install @openapitools/openapi-generator-cli', 'npm install openapi-merge-cli', 'npm run api', 'npm install', 'npm run build:prod'):
            print("Executing `{}`".format(cmd))
            run_cmd = '{} {}'.format(cmd_path, cmd)
            config_api_installer.run(['/bin/su', 'node','-c', run_cmd], self.source_dir)

        Config.templateRenderingDict['admin_ui_apache_root'] = os.path.join(httpd_installer.server_root, 'admin')

        self.add_apache_directive(Config.templateRenderingDict['admin_ui_apache_root'], 'admin_ui_apache_directive')

        print("Copying files to",  Config.templateRenderingDict['admin_ui_apache_root'])
        config_api_installer.copy_tree(os.path.join(self.source_dir, 'dist'),  Config.templateRenderingDict['admin_ui_apache_root'])

        config_api_installer.check_clients([('role_based_client_id', '2000.')])
        config_api_installer.renderTemplateInOut(self.admin_ui_config_properties_path, os.path.join(self.flex_setup_dir, 'templates'), config_api_installer.custom_config_dir)
        admin_ui_plugin_path = os.path.join(config_api_installer.libDir, os.path.basename(self.admin_ui_plugin_source_path))
        config_api_installer.copyFile(self.admin_ui_plugin_source_path, config_api_installer.libDir)
        config_api_installer.add_extra_class(admin_ui_plugin_path)

        for logfn in (self.log4j2_adminui_path, self.log4j2_path):
            config_api_installer.copyFile(logfn, config_api_installer.custom_config_dir)

        cli_config = Path(jans_cli_installer.config_ini_fn)

        current_plugins = []

        if cli_config.exists():

            config = configparser.ConfigParser()
            config.read_file(cli_config.open())
            current_plugins = config['DEFAULT'].get('jca_plugins', '').split(',')

        plugins = config_api_installer.get_plugins()

        for plugin in plugins:
            if plugin not in current_plugins:
                current_plugins.append(plugin)

        config['DEFAULT']['jca_plugins'] = ','.join(current_plugins)
        config.write(cli_config.open('w'))
        cli_config.chmod(0o600)

    def install_casa(self):

        print("Adding twillo and casa config to jans-auth")
        self.copyFile(self.casa_config_fn, self.jans_auth_custom_lib_dir)
        self.copyFile(self.twillo_fn, self.jans_auth_custom_lib_dir)
        class_path = '{},{}'.format(
            os.path.join(self.jans_auth_custom_lib_dir, os.path.basename(self.casa_config_fn)),
            os.path.join(self.jans_auth_custom_lib_dir, os.path.basename(self.twillo_fn)),
            )
        jansAuthInstaller.add_extra_class(class_path)


        print("Adding Fido2 Client lib to jans-auth")
        self.copyFile(self.fido2_client_jar_fn, self.jans_auth_custom_lib_dir)
        class_path = os.path.join(self.jans_auth_custom_lib_dir, os.path.basename(self.fido2_client_jar_fn))
        jansAuthInstaller.add_extra_class(class_path)


        simple_auth_scr_inum = 'A51E-76DA'
        print("Enabling script", simple_auth_scr_inum)
        self.dbUtils.enable_script(simple_auth_scr_inum)

        # copy casa scripts
        if not os.path.exists(self.py_lib_dir):
            os.makedirs(self.py_lib_dir)
        for fn in glob.glob(os.path.join(self.casa_dist_dir, 'pylib/*.py')):
            print("Copying", fn, "to", self.py_lib_dir)
            self.copyFile(fn, self.py_lib_dir)

        self.run([paths.cmd_chown, '-R', '{0}:{0}'.format(Config.jetty_user), self.py_lib_dir])

        # prepare casa scipt ldif
        casa_auth_script_fn = os.path.join(self.templates_dir, 'casa_person_authentication_script.ldif')
        base64_script_file = self.generate_base64_file(self.casa_script_fn, 1)
        Config.templateRenderingDict['casa_person_authentication_script'] = base64_script_file
        self.renderTemplateInOut(casa_auth_script_fn, self.templates_dir, self.source_dir)

        Config.templateRenderingDict['casa_redirect_uri'] = 'https://{}/casa'.format(Config.hostname)
        Config.templateRenderingDict['casa_redirect_logout_uri'] = 'https://{}/casa/bye.zul'.format(Config.hostname)
        Config.templateRenderingDict['casa_frontchannel_logout_uri'] = 'https://{}/casa/autologout'.format(Config.hostname)
        Config.templateRenderingDict['casa_web_port'] = '8080'

        self.casa_client_fn = os.path.join(self.source_dir, 'templates/casa_client.ldif')
        self.casa_config_fn = os.path.join(self.source_dir, 'templates/casa_config.ldif')
        self.service_name = 'casa'

        for casa_prop in ('casa_client_id', 'casa_client_pw'):
            if casa_prop in setup_properties:
                setattr(Config, casa_prop, setup_properties[casa_prop])

        self.check_clients([('casa_client_id', '3000.')])

        if not Config.get('casa_client_encoded_pw'):
            Config.casa_client_encoded_pw = jansAuthInstaller.obscure(Config.casa_client_pw)

        print("Casa client id", Config.casa_client_id)
        print("Casa client encoded password", Config.casa_client_encoded_pw)

        print("Importing LDIF Files")

        self.renderTemplateInOut(self.casa_client_fn, self.templates_dir, self.source_dir)
        self.renderTemplateInOut(self.casa_config_fn, self.templates_dir, self.source_dir)
        self.dbUtils.import_ldif([
                os.path.join(self.source_dir, os.path.basename(self.casa_client_fn)),
                os.path.join(self.source_dir, os.path.basename(self.casa_config_fn)),
                os.path.join(self.source_dir, os.path.basename(casa_auth_script_fn)),
                ])


        Config.installCasa = True

        self.copyFile(os.path.join(self.templates_dir, 'casa.default'), os.path.join(Config.templateFolder, 'jetty/casa'))

        self.jetty_app_configuration[self.service_name] = {
                    "memory": {
                        "max_allowed_mb": 1024,
                        "metaspace_mb": 128,
                        "jvm_heap_ration": 0.7,
                        "ratio": 0.1
                        },
                    "jetty": {
                        "modules": "server,deploy,resources,http,http-forwarded,console-capture,jsp,cdi-decorate"
                    },
                    "installed": False,
                    "name": self.service_name
                }


        print("Calculating application memory")

        installedComponents = []

        # Jetty apps
        for config_var, service in [('installOxAuth', 'jans-auth'),
                                    ('installScimServer', 'jans-scim'),
                                    ('installFido2', 'jans-fido2'),
                                    ('installConfigApi', 'jans-config-api'),
                                    ('installEleven', 'jans-eleven'),
                                    ('installCasa', self.service_name),
                                    ]:

            if Config.get(config_var) and service in self.jetty_app_configuration:
                installedComponents.append(self.jetty_app_configuration[service])

        self.calculate_aplications_memory(Config.application_max_ram, self.jetty_app_configuration, installedComponents)

        print("Deploying casa as Jetty application")
        self.installJettyService(self.jetty_app_configuration[self.service_name], True)
        self.copyFile(os.path.join(self.templates_dir, 'casa.service'), '/etc/systemd/system')
        jetty_service_dir = os.path.join(Config.jetty_base, self.service_name)
        jetty_service_webapps_dir = os.path.join(jetty_service_dir, 'webapps')

        self.run([paths.cmd_mkdir, '-p', os.path.join(jetty_service_dir, 'static')])
        self.run([paths.cmd_mkdir, '-p', os.path.join(jetty_service_dir, 'plugins')])
        self.copyFile(self.casa_war_fn, jetty_service_webapps_dir)
        self.copyFile(self.casa_web_resources_fn, jetty_service_webapps_dir)
        jansAuthInstaller.chown(jetty_service_dir, Config.jetty_user, Config.jetty_group, recursive=True)
        jansAuthInstaller.chown(self.jans_auth_custom_lib_dir, Config.jetty_user, Config.jetty_group, recursive=True)

        self.add_apache_directive('<Location /casa>', 'casa_apache_directive')

        self.enable()

    def save_properties(self):
        fn = Config.savedProperties
        print("Saving properties", fn)
        if os.path.exists(fn):
            p = Properties()
            with open(fn, 'rb') as f:
                p.load(f, 'utf-8')
            for prop in ('casa_client_id', 'casa_client_pw', 'casa_client_encoded_pw'):
                if Config.get(prop):
                    p[prop] = Config.get(prop)
            with open(fn, 'wb') as f:
                p.store(f, encoding="utf-8")
        else:
            propertiesUtils.save_properties()


def prompt_for_installation():

    if not os.path.exists(os.path.join(httpd_installer.server_root, 'admin')):
        prompt_admin_ui_install = input("Install Admin UI [Y/n]: ")
        if prompt_admin_ui_install and prompt_admin_ui_install.lower().startswith('y'):
            install_components['admin_ui'] = True
    else:
        print("Admin UI is allready installed on this system")
        install_components['admin_ui'] = False

    if not os.path.exists(os.path.join(Config.jetty_base, 'casa')):
        prompt_casa_install = input("Install Casa [Y/n]: ")
        if prompt_casa_install and prompt_casa_install.lower().startswith('y'):
            install_components['casa'] = True
    else:
        print("Casa is allready installed on this system")
        install_components['casa'] = False

    if not (install_components['casa'] or install_components['admin_ui']):
        print("Nothing to install. Exiting ...")
        sys.exit()



def main():

    if not argsp.flex_non_interactive:
        prompt_for_installation()

    if install_components['admin_ui'] and not node_installer.installed():
        node_fn = 'node-{0}-linux-x64.tar.xz'.format(app_versions['NODE_VERSION'])
        node_path = os.path.join(Config.dist_app_dir, node_fn)
        if not os.path.exists(node_path):
            base.download('https://nodejs.org/dist/{0}/node-{0}-linux-x64.tar.xz'.format(app_versions['NODE_VERSION']), node_path, verbose=True)
        print("Installing node")
        node_installer.install()

    installer_obj = flex_installer()
    installer_obj.download_files()

    if install_components['admin_ui']:
        installer_obj.install_gluu_admin_ui()

    if install_components['casa']:
        installer_obj.install_casa()
        installer_obj.save_properties()

    print("Restarting Apache")
    httpd_installer.restart()

    print("Restarting Jans Auth")
    config_api_installer.restart('jans-auth')

    print("Restarting Janssen Config Api")
    config_api_installer.restart()

    if install_components['casa']:
        print("Starting Casa")
        config_api_installer.start('casa')

    print("Installation was completed.")

    if install_components['admin_ui']:
        print("Browse https://{}/admin".format(Config.hostname))

    if install_components['casa']:
        print("Browse https://{}/casa".format(Config.hostname))

if __name__ == "__main__":
    if argsp.shell:
        code.interact(local=locals())
        sys.exit()
    else:
        main()

