#!/usr/bin/python

from setup import *
from pylib import Properties
from pylib.cbm import CBM
import ldap
import ldap.modlist as modlist
ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_ALLOW)

from setup_casa import get_properties, unobscure, cur_dir, SetupCasa


COUCHBASE = 1
LDAP = 2

storage_types = {'ldap': LDAP, 'couchbase': COUCHBASE}

class casaCleanup(object):
    
    def __init__(self, install_dir):

        self.install_dir = install_dir
        self.cbm = None
        self.ldap_conn = None
        self.conf_prop = get_properties(setupObject.gluu_properties_fn)
        self.detectedHostname = setupObject.detect_hostname()
        
        if os.path.exists(setupObject.gluu_hybrid_roperties):
             get_properties(setupObject.gluu_hybrid_roperties, self.conf_prop)


    def get_storage_location(self, storage):
        
        retval = LDAP
        couchbase_mappings = [ s.strip() for s in self.conf_prop['storage.couchbase.mapping'].split(',') ]

        if self.conf_prop["persistence.type"] in storage_types:
            retval = storage_types[self.conf_prop["persistence.type"]]
    
        elif storage == 'default':
            retval = storage_types[self.conf_prop['storage.default']]
        
        else:
            if storage in couchbase_mappings:
                retval = COUCHBASE

        if (retval == COUCHBASE) and (not self.cbm):
            cbp = get_properties(setupObject.gluuCouchebaseProperties)
            cbm_hostname = cbp['servers'].split(',')[0]
            cbm_username = cbp['auth.userName']
            cbm_pass = unobscure(cbp['auth.userPassword'])
            self.cbm = CBM(cbm_hostname, cbm_username, cbm_pass)

        elif (retval == LDAP) and (not self.ldap_conn):
            lp = get_properties(setupObject.ox_ldap_properties)
            ldap_pass = unobscure(lp['bindPassword'])
            ldap_hostname, ldap_port = lp['servers'].split(',')[0].split(':')

            self.ldap_conn = ldap.initialize('ldaps://{0}:{1}'.format(ldap_hostname, ldap_port))
            self.ldap_conn.simple_bind_s('cn=directory manager',ldap_pass)

        return retval

    def del_casa_custom_scripts(self):

        default_location = self.get_storage_location('default')

        if default_location == LDAP:
            for inum in ('BABA-CACA', 'DAA9-F7F8'):
                dn = 'inum={0},ou=scripts,o=gluu'.format(inum)
                try:
                    self.ldap_conn.delete_s(dn)
                except:
                    pass

        elif default_location == COUCHBASE:
            for inum in ('BABA-CACA', 'DAA9-F7F8'):
                self.cbm.exec_query('DELETE FROM `gluu` USE KEYS "scripts_{}"'.format(inum))


    def del_casa_clients(self):
        clients_location = self.get_storage_location('clients')
        
        if clients_location == LDAP:
            result = self.ldap_conn.search_s('ou=clients,o=gluu',
                                            ldap.SCOPE_SUBTREE,
                                            '(oxAuthDefaultAcrValues=casa)',
                                            attrlist=['inum'],
                                            )
            if result:
                for client in result:
                    self.ldap_conn.delete_s(client[0])
                    
        elif clients_location == COUCHBASE:
             self.cbm.exec_query('DELETE  FROM `gluu_clients` WHERE objectClass="oxAuthClient" AND oxAuthDefaultAcrValues="casa"')


    def del_casa_user_attributes(self):

        attrlist = [
                    'oxPreferredMethod',
                    'oxOTPDevices',
                    'oxMobileDevices',
                    'oxStrongAuthPolicy',
                    'oxTrustedDevicesInfo',
                    'oxUnlinkedExternalUids'
                    ]
        
        people_location = self.get_storage_location('people')

        if people_location == LDAP:
            result = self.ldap_conn.search_s('ou=people,o=gluu', ldap.SCOPE_SUBTREE, attrlist=attrlist)

            for people in result:
                mod_list = []

                for attr in attrlist:
                    if attr in people[1]:
                        mod_list.append((ldap.MOD_REPLACE, attr, []))

                if mod_list:
                    print "Cleaning", people[0], mod_list
                    self.ldap_conn.modify_s(people[0], mod_list)

        elif people_location == COUCHBASE:
            self.cbm.exec_query('UPDATE gluu_user UNSET {}'.format(', '.join(attrlist)))

if __name__ == '__main__':

    setupObject = Setup(cur_dir)
    casaCleanupObject = casaCleanup(cur_dir)
    casaCleanupObject.del_casa_custom_scripts()
    casaCleanupObject.del_casa_clients()
    casaCleanupObject.del_casa_user_attributes()
