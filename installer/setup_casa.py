#!/usr/bin/python

import sys
import os
import os.path
import json
import traceback
import socket
import getopt
import base64
import pyDes
from setup import *
from pylib import Properties

class SetupCasa(object):

    def __init__(self):
        
        self.install_dir = setupObject.install_dir

        self.log = '%s/setup_casa.log' % self.install_dir
        self.logError = '%s/setup_casa_error.log' % self.install_dir

        self.setup_properties_fn = '%s/setup_casa.properties' % self.install_dir
        self.savedProperties = '%s/setup_casa.properties.last' % self.install_dir
        
        # Change this to final version
        self.casa_war = 'https://ox.gluu.org/maven/org/gluu/casa/4.0.0-SNAPSHOT/casa-4.0.0-SNAPSHOT.war'

        self.twilio_jar = 'twilio-7.17.0.jar'
        self.twilio_url = 'http://central.maven.org/maven2/com/twilio/sdk/twilio/7.17.0/%s' % self.twilio_jar

        self.application_max_ram = None  # in MB

        # Gluu components installation status
        self.installCasa = False
        self.install_oxd = "n"
        self.oxd_server_https = ""
        self.distFolder = '/opt/dist'
        self.casa = '/etc/gluu/conf/casa.json'
        self.detectedHostname = self.detectHostName()
        self.jetty_app_configuration = {
            'casa': {'name': 'casa',
                                'jetty': {'modules': 'server,deploy,resources,http,http-forwarded,console-capture,jsp'},
                                'memory': {'ratio': 1, "jvm_heap_ration": 0.7, "max_allowed_mb": 1024},
                                'installed': False
                                }
        }

        self.oxd_hostname = None

        self.ldif_scripts_casa = '%s/scripts_casa.ldif' % setupObject.outputFolder

        self.casa_config = '%s/casa.json' % setupObject.outputFolder
    
        with open("/etc/gluu/conf/salt") as f:
            salt_property = f.read()
            self.key = salt_property.split("=")[1].strip()

    def __repr__(self):

        try:
            return 'Install Gluu Casa '.ljust(30) + repr(self.installCasa).rjust(35) + "\n"
        except:
            s = ""
            for key in self.__dict__.keys():
                val = self.__dict__[key]
                s = s + "%s\n%s\n%s\n\n" % (key, "-" * len(key), val)
            return s

    def check_properties(self):

        setupObject.logIt('Checking properties')
        if not setupObject.application_max_ram:
            setupObject.application_max_ram = 1024

    def propertiesForOxd(self):

        conf = "\n"
        if self.install_oxd == "y":
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
        if self.installCasa:
            # Casa is not part of CE package. We need to download it if needed
            distCasaPath = '%s/%s' % (setupObject.distGluuFolder, "casa.war")
            if not os.path.exists(distCasaPath):
                print "\nDownloading Casa war file...\n"
                setupObject.run(
                    ['/usr/bin/wget', self.casa_war, '--no-verbose', '--retry-connrefused', '--tries=10', '-O', distCasaPath])

            # Download Twilio
            twilioJarPath = '%s/%s' % (setupObject.distGluuFolder, self.twilio_jar)
            if not os.path.exists(twilioJarPath):
                print "Downloading Twilio jar file..."
                setupObject.run(
                    ['/usr/bin/wget', self.twilio_url, '--no-verbose', '--retry-connrefused', '--tries=10', '-O', twilioJarPath])

    def detectHostName(self):

        detectedHostname = None
        
        if os.path.exists('output/hostname'):
            detectedHostname = setupObject.readFile('output/hostname').strip()
        
        if not detectedHostname:
            try:
                detectedHostname = socket.gethostbyaddr(self.ip)[0]
            except:
                try:
                    detectedHostname = os.popen("/bin/hostname").read().strip()
                except:
                    pass

        return detectedHostname

    def makeDirs(self):

        casa_static_dir = '/opt/gluu/jetty/casa/static/'
        casa_plugins_dir = '/opt/gluu/jetty/casa/plugins'
        directory_paths = [casa_static_dir,casa_plugins_dir]

        for path in directory_paths:
            if not os.path.exists(path):
                setupObject.run(['mkdir', '-p', path])
                setupObject.run(['chown', '-R', 'jetty:jetty', path])

    def promptForProperties(self):

        promptForCasa = setupObject.getPrompt("Install Gluu Casa? (Y/n)", "Y")[0].lower()

        if promptForCasa in ('yes', 'Yes', 'Y', 'y', ''):
            self.installCasa = True

            self.application_max_ram = setupObject.getPrompt("Enter maximum RAM for applications in MB", '1024')

            install_oxd = setupObject.getPrompt(
                "Do you have an existing oxd-server-4.0 installation?\nNote: oxd is used to integrate this product with the Gluu Server OP. (Y/n) ?",
                "n")[0].lower()

            if install_oxd == "y":
                oxd_server_https = 'https://{}:8443'.format(self.detectHostName())
                self.oxd_server_https = setupObject.getPrompt("Enter the URL + port of your oxd-server", oxd_server_https).lower()
            else:
                self.install_oxd = setupObject.getPrompt("Install oxd-server on this host now?", "Y")[
                    0].lower()
                if self.install_oxd == "n":
                    print "An oxd server instance is required when installing this product via Linux packages"
                    sys.exit(0)
                else:
                    self.oxd_server_https = "https://localhost:8443"

            promptForLicense = setupObject.getPrompt("\nGluu License Agreement: https://github.com/GluuFederation/casa/blob/master/LICENSE.md\n\nDo you acknowledge that Casa is commercial software, and use of Casa is only permitted\nunder the Gluu License Agreement for Gluu Casa? [Y/n]", "n")[0].lower()
        elif promptForCasa in ('no', 'No', 'N', 'n'):
            self.installCasa = False
            print('Exiting.')
            sys.exit()
        else:
            print('Please input a valid option.\n')
            self.promptForProperties()
        
        if self.installCasa:
            if promptForLicense in ('yes', 'Yes', 'Y', 'y'):
                pass
            else:
                print('You must accept the Gluu License Agreement to continue. Exiting.\n')
                sys.exit()

    def casa_json_config(self):
        data = ""
        try:
            with open(self.casa) as f:
                for line in f:
                    data += line
        except:
            setupObject.logIt("Error reading casa Template", True)
            setupObject.logIt(traceback.format_exc(), True)

        datastore = json.loads(data)
            
        try:
            url=self.oxd_server_https.replace("https://", "", 1)
            url=url.split(":")

            datastore['oxd_config']['host'] = url[0]
            if len(url)==1:
                setupObject.logIt("No port in https url (default 443 assumed)", True)
                datastore['oxd_config']['port'] = 443
            else:
                datastore['oxd_config']['port'] = int(url[1])

        except:
            setupObject.logIt("Problem parsing https url", True)
            setupObject.logIt(traceback.format_exc(), True)

        
        try:
            with open(self.casa, 'w') as outfile:
                json.dump(datastore, outfile,indent=4)
        except:
            setupObject.logIt("Error writing Casa Template", True)
            setupObject.logIt(traceback.format_exc(), True)

    def import_ldif(self):
        p = Properties.Properties()
        p.load(open('/etc/gluu/conf/gluu.properties'))
        if p["persistence.type"] == 'couchbase':
            self.import_ldif_couchbase()
        elif p["persistence.type"] == 'opendj':
            self.import_ldif_ldap()


    def import_ldif_couchbase(self):
        p = Properties.Properties()
        p.load(open('/etc/gluu/conf/gluu-couchbase.properties'))
        attribDataTypes.startup(setupOptions['install_dir'])
        
        setupObject.prepare_multivalued_list()
        setupObject.cbm = CBM(p['servers'].split(',')[0], p['auth.userName'], self.unobscure(p['auth.userPassword']))
        setupObject.import_ldif_couchebase([os.path.join('.','output/scripts_casa.ldif')],'gluu')


    def import_ldif_ldap(self):
        setupObject.logIt("Importing LDIF files into LDAP")
        if self.installCasa:
            ldaptype_openldap = True
            ldappassword = ""
            
            for fn in ('/etc/gluu/conf/ox-ldap.properties', '/etc/gluu/conf/gluu-ldap.properties'):
                if os.path.exists(fn):
                    ldap_properties_fn = fn
                    break
            else:
                sys.exit("ldap properties file does not exist on this server. Terminating installation.")
            
            try:
                with open(ldap_properties_fn) as f:
                    for line in f:
                        if line.startswith("bindDN:"):
                            if "o=gluu" not in line:
                                ldaptype_openldap = False

                        if not ldaptype_openldap:
                            if line.startswith("bindPassword:"):
                                ldappassword = line.split(":")[1].split("\n")[0].strip()
            except:
                setupObject.logIt("Error reading ox-ldap.properties Template", True)
                setupObject.logIt(traceback.format_exc(), True)

            ldif = self.ldif_scripts_casa
            if not ldaptype_openldap:
                #Importing LDIF files into OpenDJ
                saltFn = "/etc/gluu/conf/salt"
                try:
                    f = open(saltFn)
                    salt_property = f.read()
                    f.close()
                    self.key = salt_property.split("=")[1].strip()
                    setupObject.ldapPass = self.unobscure(ldappassword)
                except Exception as e:
                    setupObject.logIt("Error reading salt template", True)
                    setupObject.logIt(e)
                    setupObject.logIt(traceback.format_exc(), True)

                createPwFile = not os.path.exists(setupObject.ldapPassFn)
                if createPwFile:
                    setupObject.createLdapPw()
                try:
                    #opendj bindn Add here
                    setupObject.ldap_binddn = "cn=directory manager"
                    setupObject.import_ldif_template_opendj(ldif)
                except Exception as e:
                    setupObject.logIt("Error importing LDIF into OpenDj")
                    setupObject.logIt(e)
                    setupObject.logIt(traceback.format_exc(), True)
                finally:
                    setupObject.deleteLdapPw()
            else:
                setupObject.import_ldif_template_openldap(ldif)

    def calculate_applications_memory(self):
        installedComponents = []

        # Jetty apps
        if self.installCasa:
            installedComponents.append(self.jetty_app_configuration['casa'])

        setupObject.calculate_aplications_memory(self.application_max_ram, self.jetty_app_configuration,
                                                installedComponents)

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

        #print packageName

        if packageName == None:
            setupObject.logIt('Failed to find oxd package in folder %s !' % oxdDistFolder)
            sys.exit(0)

        setupObject.logIt("Found package '%s' for install" % packageName)

        if packageRpm:
            setupObject.run([setupObject.cmd_rpm, '--install', '--verbose', '--hash', packageName])
        else:
            setupObject.run([setupObject.cmd_dpkg, '--install', packageName])

        # Enable service autoload on Gluu-Server startup
        applicationName = 'oxd-server'
        if setupObject.os_type in ['centos', 'fedora', 'red']:
            if setupObject.os_initdaemon == 'systemd':
                setupObject.run(["/usr/bin/systemctl", 'enable', applicationName])
            else:
                setupObject.run(["/sbin/chkconfig", applicationName, "on"])
        elif setupObject.os_type in ['ubuntu', 'debian']:
            setupObject.run(["/usr/sbin/update-rc.d", applicationName, 'defaults', '50', '25'])

        # Start oxd-server
        print "Starting oxd-server..."
        # change start.sh permission
        setupObject.run(['chmod', '+x', '/opt/oxd-server/bin/oxd-start.sh'])
        setupObject.run_service_command(applicationName, 'start')
        
        #Add oxd dummy cert to java trust store
        tmpCertPath = "/tmp/oxd_sample.cer"
        if not os.path.exists(tmpCertPath):
            keytoolPath = "/opt/jre/jre/bin/keytool"
            keystorePath = "/opt/oxd-server/conf/oxd-server.keystore"
            keystorePass = "example"
            entryAlias = "localhost"
            truststorePath="/opt/jre/jre/lib/security/cacerts"
            
            #Extract cert from keystore
            setupObject.run([keytoolPath, '-exportcert', '-alias', entryAlias, '-file', tmpCertPath, '-keystore', keystorePath, '-storepass', keystorePass, '-rfc'], None, None, True)
            #Import into cacerts
            print "Adding oxd certificate..."
            setupObject.run([keytoolPath, '-import', '-trustcacerts', '-keystore', truststorePath, '-storepass', 'changeit', '-noprompt', '-alias', 'oxd_sample', '-file', tmpCertPath], None, None, True)
            
        
    def checkCryptoLevel(self):

        setupObject.logIt("Modifying java.security File for Unlimited Crypto..")

        javaSecurityFN = '/opt/jre/jre/lib/security/java.security'
        javaSecurity = open(javaSecurityFN).read()
        javaSecurity = javaSecurity.replace('#crypto.policy=unlimited', 'crypto.policy=unlimited')
        javaSecurityFile = open(javaSecurityFN, 'w')
        javaSecurityFile.write(javaSecurity)
        javaSecurityFile.close

        setupObject.logIt('java.security crypto level configured.')

    def install_casa(self):
        setupObject.logIt("Configuring Casa...")
        
        self.checkCryptoLevel()
        
        setupObject.copyFile('%s/casa.json' % setupObject.outputFolder, setupObject.configFolder)
        setupObject.run(['chmod', 'g+w', '/opt/gluu/python/libs'])

        setupObject.logIt("Copying casa.war into jetty webapps folder...")

        jettyServiceName = 'casa'
        setupObject.installJettyService(self.jetty_app_configuration[jettyServiceName])

        jettyServiceWebapps = '%s/%s/webapps' % (setupObject.jetty_base, jettyServiceName)
        setupObject.copyFile('%s/casa.war' % setupObject.distGluuFolder, jettyServiceWebapps)

        jettyServiceOxAuthCustomLibsPath = '%s/%s/%s' % (setupObject.jetty_base, "oxauth", "custom/libs")
        setupObject.copyFile('%s/%s' % (setupObject.distGluuFolder, self.twilio_jar), jettyServiceOxAuthCustomLibsPath)
        setupObject.run([setupObject.cmd_chown, '-R', 'jetty:jetty', jettyServiceOxAuthCustomLibsPath])

        # Make necessary Directories for Casa
        self.makeDirs()

    def install_gluu_components(self):
        if self.installCasa:
            self.install_casa()

        if self.install_oxd == "y":
            self.install_oxd_server()
        
    def set_ownership(self):

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

    def save_properties(self):
        setupObject.logIt('Saving properties to %s' % setupObject.savedProperties)

        def getString(value):
            if isinstance(value, str):
                return value.strip()
            elif isinstance(value, bool):
                return str(value)
            else:
                return ""
        try:
            p = Properties.Properties()
            keys = self.__dict__.keys()
            keys.sort()
            for key in keys:
                value = getString(self.__dict__[key])
                if value != '':
                    p[key] = value
            p.store(open(self.savedProperties, 'w'))
        except:
            setupObject.logIt("Error saving properties", True)
            setupObject.logIt(traceback.format_exc(), True)
    
    def load_properties(self, fn):
        setupObject.logIt('Loading Properties %s' % fn)
        p = Properties.Properties()
        try:
            p.load(open(fn))
            properties_list = p.keys()
            for prop in properties_list:
                try:
                    self.__dict__[prop] = p[prop]
                    if p[prop] == 'True':
                        self.__dict__[prop] = True
                    elif p[prop] == 'False':
                        self.__dict__[prop] = False
                except:
                    setupObject.logIt("Error loading property %s" % prop)
                    setupObject.logIt(traceback.format_exc(), True)
        except:
            setupObject.logIt("Error loading properties", True)
            setupObject.logIt(traceback.format_exc(), True)

def print_help():
    print "\nUse setup_casa.py to configure Gluu Casa and to add initial data required for"
    print "start. If setup_casa.properties is found in this folder, these"
    print "properties will automatically be used instead of the interactive setup"
    print "Options:"
    print ""
    print "    -c   Install Gluu Casa"


def getOpts(argv, setupOptions):
    try:
        opts, args = getopt.getopt(argv, "c", [])
    except getopt.GetoptError:
        print_help()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-c':
            setupOptions['installCasa'] = True
    return setupOptions

if __name__ == '__main__':
    setupOptions = {
        'install_dir': '.',
        'setup_properties': None,
        'noPrompt': True,
        'installCasa': False
    }
    if len(sys.argv) > 1:
        setupOptions = getOpts(sys.argv[1:], setupOptions)

    setupObject = Setup(setupOptions['install_dir'])
    installObject = SetupCasa()

    # Configure log redirect
    setupObject.logError = installObject.logError
    setupObject.log = installObject.log

    if installObject.check_installed():
        print "\033[91m\nThis instance has already been configured. If you need to install new one you should reinstall package first.\033[0m"
        sys.exit(2)

    installObject.installCasa = setupOptions['installCasa']

    # Get the OS and init type
    (setupObject.os_type, setupObject.os_version) = setupObject.detect_os_type()
    setupObject.os_initdaemon = setupObject.detect_initd()

    print "\nInstalling Gluu Casa...\n"
    print "Detected OS  :  %s %s" % (setupObject.os_type, setupObject.os_version)
    print "Detected init:  %s" % setupObject.os_initdaemon

    print "\nFor more info see:\n  %s  \n  %s\n" % (installObject.log, installObject.logError)
    print "\n** All clear text passwords contained in %s.\n" % installObject.savedProperties
    try:
        os.remove(installObject.log)
        setupObject.logIt('Removed %s' % installObject.log)
    except:
        pass
    try:
        os.remove(installObject.logError)
        setupObject.logIt('Removed %s' % installObject.logError)
    except:
        pass

    setupObject.logIt("Installing Gluu Casa", True)

    if setupOptions['setup_properties']:
        setupObject.logIt('%s Properties found!\n' % setupOptions['setup_properties'])
        installObject.load_properties(setupOptions['setup_properties'])
    elif os.path.isfile(installObject.setup_properties_fn):
        setupObject.logIt('%s Properties found!\n' % installObject.setup_properties_fn)
        installObject.load_properties(installObject.setup_properties_fn)
    else:
        setupObject.logIt(
            "%s Properties not found. Interactive setup commencing..." % installObject.setup_properties_fn)
        installObject.promptForProperties()

    # Validate Properties
    installObject.check_properties()

    # Show to properties for approval
    if installObject.installCasa:
        installObject.propertiesForOxd()

    proceed = "NO"
    if not setupOptions['noPrompt']:
        proceed = raw_input('Proceed with these values [Y/n]? ').lower().strip()

    if (setupOptions['noPrompt'] or not len(proceed) or (len(proceed) and (proceed[0] == 'y'))):
        try:
            installObject.download_files()
            installObject.calculate_applications_memory()
            installObject.install_gluu_components()
            installObject.set_ownership()
            installObject.import_ldif()
            installObject.start_services()
            installObject.save_properties()
        except:
            setupObject.logIt("***** Error caught in main loop *****", True)
            setupObject.logIt(traceback.format_exc(), True)

        print "Gluu Casa installation successful!\nPoint your browser to https://%s/casa\n" % installObject.detectedHostname
        print "Recall admin capabilities are disabled by default.\nCheck casa docs to learn how to unlock admin features\n"

    else:
        installObject.save_properties()
        print "\nProperties saved to %s. Change filename to %s and \nrun './setup_casa.py' if you want to re-use the same configuration." % \
              (installObject.savedProperties, installObject.setup_properties_fn)
