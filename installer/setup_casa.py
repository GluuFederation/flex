#!/usr/bin/python

import sys
import os
import os.path
import json
import traceback
import ssl
import base64
import pyDes
from urlparse import urlparse
from setup import *
from pylib import Properties

cur_dir = os.path.dirname(os.path.realpath(__file__))

#TODO: add command line options with argprase

def get_properties(prop_fn, current_properties=None):
    if not current_properties:
        p = Properties.Properties()
    else:
        p = current_properties

    with open(prop_fn) as file_object:
        p.load(file_object)
    
    for k in p.keys():
        if p[k].lower() == 'true':
            p[k] == True
        elif p[k].lower() == 'false':
            p[k] == False

    return p

class SetupCasa(object):

    def __init__(self, install_dir):
        self.install_dir = install_dir
        self.setup_properties_fn = os.path.join(self.install_dir, 'setup_casa.properties')
        self.savedProperties = os.path.join(self.install_dir, 'setup_casa.properties.last')

        # Change this to final version
        self.casa_war_url = 'https://ox.gluu.org/maven/org/gluu/casa/4.0.0-SNAPSHOT/casa-4.0.0-SNAPSHOT.war'
        self.twilio_jar_url = 'http://central.maven.org/maven2/com/twilio/sdk/twilio/7.17.0/twilio-7.17.0.jar'

        self.application_max_ram = 1024  # in MB


        # Gluu components installation status
        self.install_oxd = False
        self.oxd_server_https = ""
        self.distFolder = '/opt/dist'
        self.casa = '/etc/gluu/conf/casa.json'
        self.jetty_app_configuration = {
            'casa': {'name': 'casa',
                                'jetty': {'modules': 'server,deploy,resources,http,http-forwarded,console-capture,jsp'},
                                'memory': {'ratio': 1, "jvm_heap_ration": 0.7, "max_allowed_mb": 1024},
                                'installed': False
                                }
        }

        self.detectedHostname = setupObject.detect_hostname()
        self.oxd_hostname = None
        self.ldif_scripts_casa = '%s/scripts_casa.ldif' % setupObject.outputFolder
        self.casa_config = '%s/casa.json' % setupObject.outputFolder
    
        with open("/etc/gluu/conf/salt") as f:
            salt_property = f.read()
            self.key = salt_property.split("=")[1].strip()


    def propertiesForOxd(self):

        conf = "\n"
        if self.install_oxd:
            conf += 'oxd https URL'.ljust(30) + self.oxd_server_https.rjust(35)
        print conf

    def unobscure(self,s=""):

        cipher = pyDes.triple_des( self.key )
        decrypted = cipher.decrypt(base64.b64decode(s), padmode=pyDes.PAD_PKCS5)
        return decrypted

    def check_installed(self):

        if setupObject.check_installed():
            return os.path.exists('%s/casa.json' % setupObject.configFolder)
        else:
            print "\nPlease run './setup.py' to configure Gluu Server first!\n"
            sys.exit()

    def download_files(self):
        setupObject.logIt("Downloading files")
        
        # Casa is not part of CE package. We need to download it if needed
        for download_url in (self.casa_war_url, self.twilio_jar_url):
            fname = os.path.basename(download_url)
            if fname.startswith('casa'):
                fname = 'casa.war'
            dest_path = os.path.join(setupObject.distGluuFolder, fname)
            if not os.path.exists(dest_path):
                print "Downloading:", fname
                setupObject.run(['/usr/bin/wget', download_url, '--no-verbose', '--retry-connrefused', '--tries=10', '-O', dest_path])

    def promptForProperties(self):

        promptForCasa = setupObject.getPrompt("Install Gluu Casa? (Y/n)", "Y")[0].lower()

        if promptForCasa == 'y':
            self.application_max_ram = setupObject.getPrompt("Enter maximum RAM for applications in MB", '1024')

            have_oxd = setupObject.getPrompt(
                "Do you have an existing oxd-server-4.0 installation?\nNote: oxd is used to integrate this product with the Gluu Server OP. (Y/n) ?",
                "n")[0].lower()

            if have_oxd == 'y':
                oxd_server_https = 'https://{}:8443'.format(self.detectedHostname)
                self.oxd_server_https = setupObject.getPrompt("Enter the URL + port of your oxd-server", oxd_server_https).lower()
            else:
                install_oxd = setupObject.getPrompt("Install oxd-server on this host now?", "Y")[0].lower()
                if install_oxd == 'n':
                    print "An oxd server instance is required when installing this product via Linux packages"
                    sys.exit(0)
                else:
                    self.install_oxd = True
                    self.oxd_server_https = 'https://localhost:8443'

            promptForLicense = setupObject.getPrompt("\nGluu License Agreement: https://github.com/GluuFederation/casa/blob/master/LICENSE.md\n\nDo you acknowledge that Casa is commercial software, and use of Casa is only permitted\nunder the Gluu License Agreement for Gluu Casa? [Y/n]", "n")[0].lower()
            if promptForLicense == 'n':
                print("You must accept the Gluu License Agreement to continue. Exiting.\n")
                sys.exit()


    def casa_json_config(self):
        data = setupObject.readFile(self.casa_config)
        datastore = json.loads(data)

        o = urlparse(self.oxd_server_https)
        self.oxd_hostname = o.hostname
        self.oxd_port = o.port if o.port else 8443

        datastore['oxd_config']['host'] = self.oxd_hostname
        datastore['oxd_config']['port'] = self.oxd_port

        datastore_str = json.dumps(datastore, indent=2)
        setupObject.writeFile(self.casa, datastore_str)


    def import_ldif(self):
        
        p = get_properties(setupObject.gluu_properties_fn)

        if os.path.exists(setupObject.gluu_hybrid_roperties):
             get_properties(setupObject.gluu_hybrid_roperties, p)

        if p["persistence.type"] == 'couchbase' or p.get('storage.default') == 'couchbase':
            self.import_ldif_couchbase()
        elif p["persistence.type"] == 'ldap' or p.get('storage.default') == 'ldap':
            self.import_ldif_ldap()


    def import_ldif_couchbase(self):
        setupObject.logIt("Importing LDIF files into Couchbase")
        p = get_properties(setupObject.gluuCouchebaseProperties)
        attribDataTypes.startup(setupObject.install_dir)

        setupObject.prepare_multivalued_list()
        setupObject.cbm = CBM(p['servers'].split(',')[0], p['auth.userName'], self.unobscure(p['auth.userPassword']))
        setupObject.import_ldif_couchebase([os.path.join('.','output/scripts_casa.ldif')],'gluu')


    def import_ldif_ldap(self):
        setupObject.logIt("Importing LDIF files into LDAP")
        ldappassword = ""
        
        if not os.path.exists(setupObject.gluu_properties_fn):
            sys.exit("ldap properties file does not exist on this server. Terminating installation.")

        p = get_properties(setupObject.ox_ldap_properties)

        setupObject.ldapPass = self.unobscure(p['bindPassword'])
        setupObject.ldap_hostname = p['servers'].split(',')[0].split(':')[0]

        setupObject.createLdapPw()
        setupObject.ldap_binddn = "cn=directory manager"
        setupObject.import_ldif_template_opendj(self.ldif_scripts_casa)
        setupObject.deleteLdapPw()


    def install_oxd_server(self):

        print "\nInstalling oxd from package..."
        packageRpm = True
        packageExtension = ".rpm"
        if setupObject.os_type in ['debian', 'ubuntu']:
            packageRpm = False
            packageExtension = ".deb"

        oxdDistFolder = "%s/%s" % (self.distFolder, "oxd")

        if not os.path.exists(oxdDistFolder):
            setupObject.logIt(oxdDistFolder+" Directory is not found")
            print oxdDistFolder+" Directory is not found"
            sys.exit(0)

        packageName = None
        for file in os.listdir(oxdDistFolder):
            if file.endswith(packageExtension):
                packageName = "%s/%s" % ( oxdDistFolder, file )

        if packageName == None:
            setupObject.logIt('Failed to find oxd package in folder %s !' % oxdDistFolder)
            sys.exit(0)

        setupObject.logIt("Found package '%s' for install" % packageName)

        if packageRpm:
            setupObject.run([setupObject.cmd_rpm, '--install', '--verbose', '--hash', packageName])
        else:
            setupObject.run([setupObject.cmd_dpkg, '--install', packageName])

        #set trust_all_certs: true in oxd-server.yml 
        oxd_yaml_fn ='/opt/oxd-server/conf/oxd-server.yml'
        oxd_yaml = setupObject.readFile(oxd_yaml_fn).split('\n')
        
        for i, l in enumerate(oxd_yaml[:]):
            if l.strip().startswith('trust_all_certs'):
                oxd_yaml[i] = 'trust_all_certs: true'
        
        setupObject.writeFile(oxd_yaml_fn, '\n'.join(oxd_yaml))

        # Enable service autoload on Gluu-Server startup
        applicationName = 'oxd-server'
        setupObject.enable_service_at_start(applicationName)

        # Start oxd-server
        print "Starting oxd-server..."
        # change start.sh permission
        setupObject.run(['chmod', '+x', '/opt/oxd-server/bin/oxd-start.sh'])
        setupObject.run_service_command(applicationName, 'start')


    def install_casa(self):
        setupObject.logIt("Configuring Casa...")
        
        setupObject.calculate_aplications_memory(self.application_max_ram, 
                                                 self.jetty_app_configuration,
                                                 [self.jetty_app_configuration['casa']],
                                                )

        setupObject.copyFile('%s/casa.json' % setupObject.outputFolder, setupObject.configFolder)
        setupObject.run(['chmod', 'g+w', '/opt/gluu/python/libs'])

        setupObject.logIt("Copying casa.war into jetty webapps folder...")

        jettyServiceName = 'casa'
        setupObject.installJettyService(self.jetty_app_configuration[jettyServiceName])

        jettyServiceWebapps = '%s/%s/webapps' % (setupObject.jetty_base, jettyServiceName)
        setupObject.copyFile('%s/casa.war' % setupObject.distGluuFolder, jettyServiceWebapps)

        jettyServiceOxAuthCustomLibsPath = '%s/%s/%s' % (setupObject.jetty_base, "oxauth", "custom/libs")
        setupObject.copyFile(os.path.join(setupObject.distGluuFolder, os.path.basename(self.twilio_jar_url)), jettyServiceOxAuthCustomLibsPath)
        
        setupObject.run([setupObject.cmd_chown, '-R', 'jetty:jetty', jettyServiceOxAuthCustomLibsPath])

        # Make necessary Directories for Casa
        for path in ('/opt/gluu/jetty/casa/static/', '/opt/gluu/jetty/casa/plugins'):
            if not os.path.exists(path):
                setupObject.run(['mkdir', '-p', path])
                setupObject.run(['chown', '-R', 'jetty:jetty', path])
        
        
        setupObject.run(['chown', '-R', 'jetty:jetty', '%s/casa.json' % setupObject.configFolder])
        setupObject.run(['chmod', 'g+w', '%s/casa.json' % setupObject.configFolder])
        self.casa_json_config()
        

    def start_services(self):

        # Restart oxAuth service to load new custom libs
        print "\nRestarting oxAuth"
        try:
            setupObject.run_service_command('oxauth', 'restart')
            print "oxAuth restarted!\n"
        except:
            print "Error starting oxAuth! Please review setup_casa_error.log."
            setupObject.logIt("Error starting oxAuth", True)
            setupObject.logIt(traceback.format_exc(), True)

        # Start Casa
        print "Starting Casa..."
        try:
            setupObject.run_service_command('casa', 'start')
            print "Casa started!\n"
        except:
            print "Error starting Casa! Please review setup_casa_error.log."
            setupObject.logIt("Error starting Casa", True)
            setupObject.logIt(traceback.format_exc(), True)

    def import_oxd_certificate2javatruststore(self):
        setupObject.logIt("Importing oxd certificate")
        oxd_cert = ssl.get_server_certificate((self.oxd_hostname, self.oxd_port))
        oxd_alias = 'oxd_' + self.oxd_hostname.replace('.','_')
        oxd_cert_tmp_fn = '/tmp/{}.crt'.format(oxd_alias)

        with open(oxd_cert_tmp_fn,'w') as w:
            w.write(oxd_cert)

        setupObject.run(['/opt/jre/jre/bin/keytool', '-import', '-trustcacerts', '-keystore', 
                        '/opt/jre/jre/lib/security/cacerts', '-storepass', 'changeit', 
                        '-noprompt', '-alias', oxd_alias, '-file', oxd_cert_tmp_fn])

    def load_properties(self, fn):
        setupObject.logIt('Loading Properties %s' % fn)
        p = get_properties(fn)

        for k in p.keys():
            setattr(self, k, p[k])

if __name__ == '__main__':


    setupObject = Setup(cur_dir)
    setupObject.log = os.path.join(cur_dir, 'setup_casa.log')
    setupObject.logError = os.path.join(cur_dir, 'setup_casa_error.log')

    installObject = SetupCasa(cur_dir)    

    if installObject.check_installed():
        print "\033[91m\nThis instance has already been configured. If you need to install new one you should reinstall package first.\033[0m"
        sys.exit(2)

    # Get the OS and init type
    (setupObject.os_type, setupObject.os_version) = setupObject.detect_os_type()
    setupObject.os_initdaemon = setupObject.detect_initd()
    
    print "\nInstalling Gluu Casa...\n"
    print "Detected OS  :  %s %s" % (setupObject.os_type, setupObject.os_version)
    print "Detected init:  %s" % setupObject.os_initdaemon

    setupObject.logIt("Installing Gluu Casa")

    if os.path.exists(installObject.setup_properties_fn):
        installObject.load_properties(installObject.setup_properties_fn)
    else:
        installObject.promptForProperties()

    try:
        installObject.download_files()

        if installObject.install_oxd:
            installObject.install_oxd_server()

        installObject.install_casa()
        installObject.import_ldif()
        installObject.import_oxd_certificate2javatruststore()
        installObject.start_services()
        setupObject.save_properties(installObject.savedProperties, installObject)
    except:
        setupObject.logIt("***** Error caught in main loop *****", True)
        setupObject.logIt(traceback.format_exc(), True)


    print "Gluu Casa installation successful!\nPoint your browser to https://%s/casa\n" % installObject.detectedHostname
    print "Recall admin capabilities are disabled by default.\nCheck casa docs to learn how to unlock admin features\n"

