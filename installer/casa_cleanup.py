#!/usr/bin/python

# Remove all traces of Casa from LDAP

from ldap3 import Server, Connection, MODIFY_REPLACE, MODIFY_ADD, MODIFY_DELETE, SUBTREE, ALL, BASE, LEVEL, ALL_ATTRIBUTES
from pyDes import triple_des, PAD_PKCS5
from subprocess import call
import shutil
import os
import sys
import base64
import json

def decodeBindPass(encPass, key):

    # Decode the encoded password using the salt

    print('Decoding bindPassword..\n')

    cipher = triple_des(key)
    decodedPass = cipher.decrypt(base64.b64decode(encPass), padmode=PAD_PKCS5)

    return decodedPass

def parseLdapProperties():

    # Function to automatically gather bindDN, bindPassword and LDAP Server hostname from gluu-ldap.properties

    '''
    Sample from gluu-ldap.properties:

    bindDN: cn=directory manager
    bindPassword: QsSS4SreDVo=
    servers: c4.gluu.org:1636,c5.gluu.org:1636
    '''

    print('Gathering LDAP Server Properties..')

    ldapPropertiesFN = '/etc/gluu/conf/gluu-ldap.properties'
    ldapFile = open(ldapPropertiesFN, 'r')
    saltFN = '/etc/gluu/conf/salt'

    # Gather salt for decoding
    f = open(saltFN)
    salt = f.read()
    f.close()
    salt = salt.split("=")[1].strip()

    # The information we're looking for
    props = [
            'bindDN',
            'bindPassword',
            'servers'
            ]
    # Assigning variables

    bindDN = ''
    bindPassword = ''
    host = ''

    # Parse through LDAP properties file for bind information

    for prop in props:
        for line in ldapFile:
            if prop in line:
                propTmp = line
                propTmp = propTmp.split(':', 1)
                propTmp = propTmp[1].split(',')
                propTmp = propTmp[0].strip()
                if props[0] in prop:
                    bindDN = propTmp
                    break
                elif props[1] in prop:
                    encodedPass = propTmp
                    bindPassword = decodeBindPass(encodedPass, salt)
                    break
                elif props[2] in prop:
                    host = propTmp
                    break

    config = {'bindDN':bindDN,'bindPassword':bindPassword,'host':host}

    return config

# LDAP Bind information
ldapProps = parseLdapProperties()

bindDN = ldapProps['bindDN']
bindPassword = ldapProps['bindPassword']
host = ldapProps['host']

def bindLDAP():

    # Bind to LDAP and return the connection

    ldap_uri = "ldaps://{0}".format(host)
    print('Connecting to ' +  host)
    server = Server(ldap_uri, use_ssl=True)
    conn = Connection(server, bindDN, bindPassword)
    try:
        conn.bind()
        print('Connected!\n')
    except:
        print('Could not bind to LDAP.')
    return conn

# Share a single LDAP connection between functions 

conn = bindLDAP()

def delCasaUserAttributes():

    print('\nDeleting Casa User Attributes..\n')

    attrs = [
                'oxPreferredMethod',
                'oxOTPDevices',
                'oxMobileDevices',
                'oxStrongAuthPolicy',
                'oxTrustedDevicesInfo',
                'oxUnlinkedExternalUids'
                ]
    
    # Iteratively use attrs for search filter to minimize returned users
    # I'm not sure if it's more beneficial to do an unindexed search on
    # the attribute, or pull all uid's, which could be quite a large number.

    for attr in attrs:

        conn.search(search_base = 'ou=people,o=gluu',
        search_filter = '({0}=*)'.format(attr),
        search_scope = SUBTREE,
        attributes=attrs)

        for entry in conn.response:
            conn.modify(entry['dn'],{attr: [(MODIFY_DELETE, [])]})

    print('Complete.\n')

def delCustomScripts():

    print('Deleting Casa Custom Scripts..')

    # To be more explicit while searching for the scripts and
    # because the script inums are static, we will search for the
    # actual inum for each item, and delete them accordingly.

    scriptNames = [
            'BABA-CACA',
            'DAA9-F7F8'
            ]

    for script in scriptNames:
        conn.search(search_base = 'inum={0},ou=scripts,o=gluu'.format(script),
        search_filter = '(objectClass=*)',
        search_scope = SUBTREE,
        attributes='displayName')
        for entry in conn.response:
            print('Removing script {0}'.format(entry['attributes']['displayName']))
            conn.delete(entry['dn'])
            break

    print('Complete.\n')

def recurseLDAPTreeDelete(entry):

    conn.search(search_base = entry['dn'],
    search_filter = '(objectClass=*)',
    search_scope = LEVEL,
    attributes='')

    for entry in conn.response:

        conn.delete(entry['dn'])

        # LDAP Code 66 means the entry cannot be deleted as it has subordinates
        # Recurse through the tree to delete all subordinates then try to delete the entry again

        if 66 == conn.result['result']:

            recurseLDAPTreeDelete(entry)

        conn.delete(entry['dn'])

def delCasaClients():

    print('Deleting Casa Clients..')
    try:
        f = open('/install/community-edition-setup/output/hostname')
        detectedHostname = f.read()
        f.close()
        detectedHostname = detectedHostname.strip()

        conn.search(search_base = 'ou=clients,o=gluu',
                    search_filter = '(oxAuthRedirectURI=https://%s/casa)' % detectedHostname,
                    search_scope = LEVEL,
                    attributes='oxAuthRedirectURI')

        for entry in conn.response:
            conn.delete(entry['dn'])
            if conn.result['result'] == 66:
                recurseLDAPTreeDelete(entry)
                conn.delete(entry['dn'])

        print('Complete.\n')
    except:
        print('Error detecting host name. Casa OIDC clients will not be removed.\n')

def delCasaFiles():

    print('Deleting Casa Files..')

    # Remove Casa jetty dir

    if os.path.exists('/opt/gluu/jetty/casa/'):
        shutil.rmtree('/opt/gluu/jetty/casa/')

    # List for iterating through. I need to determine how the init files directories  
    # are structured in CentOS/RHEL and build a check to determine OS.

    casafiles = [
                '/etc/gluu/conf/casa.json',
                '/etc/default/casa',
                '/etc/init.d/casa',
                '/etc/init.d/casa.gluu-3.1.6~',
                '/etc/rc0.d/K01casa',
                '/etc/rc2.d/S01casa',
                '/etc/rc3.d/S01casa',
                '/etc/rc4.d/S01casa',
                '/etc/rc5.d/S01casa',
                '/etc/rc6.d/K01casa',
                '/run/jetty/casa-start.log',
                '/run/jetty/casa.pid'
                ]

    # Check for existence and delete

    for file in casafiles:
        if os.path.exists(file):
            os.remove(file)

    # Delete Casa files from oxauth libs directory.

    libdir = '/opt/gluu/python/libs'
    libs = os.listdir(libdir)
    for lib in libs:
        if lib.startswith('casa'):
            os.remove(os.path.join(libdir,lib))

    print('Complete.\n')

def promptForRemoval():

    print('This script will remove all information pertaining to Casa from the disk and LDAP, including Casa related user attributes.')
    prompt = raw_input('Do you want to continue? [Y/n] ')
    print prompt

    if prompt in ('yes', 'Yes', 'Y', 'y', ''):
        return True
    elif prompt in ('no', 'No', 'N', 'n'):
        sys.exit()
    else:
        print('Please input a valid option.\n')
while True:
    if promptForRemoval() == True:
        break


print('Stopping Casa..')

call(["service", "casa", "stop"])

delCasaUserAttributes()
delCasaClients()
delCustomScripts()
delCasaFiles()

print('Casa clean up complete!\n')

# Unbind LDAP connection
conn.unbind()
