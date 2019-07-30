#!/usr/bin/python

from setup import *
from pylib import Properties
from pylib.cbm import CBM
import ldap
import ldap.modlist as modlist
ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_ALLOW)

from setup_casa import get_properties, unobscure, cur_dir, SetupCasa



class casaCleanup(object):
    
    def __init__(self, install_dir):
        self.install_dir = install_dir
        self.cbm = None
        self.ldap_conn = None

    def get_storage_location(self, storage):
        p = get_properties(setupObject.gluu_properties_fn)

        if os.path.exists(setupObject.gluu_hybrid_roperties):
             get_properties(setupObject.gluu_hybrid_roperties, p)

        if p["persistence.type"] == 'couchbase' or p.get('storage.' + storage) == 'couchbase':
            if not self.cbm:
                cbp = get_properties(setupObject.gluuCouchebaseProperties)
                cbm_hostname = cbp['servers'].split(',')[0]
                cbm_username = cbp['auth.userName']
                cbm_pass = unobscure(cbp['auth.userPassword'])
                self.cbm = CBM(cbm_hostname, cbm_username, cbm_pass)

            return 'couchbase'

        elif p["persistence.type"] == 'ldap' or p.get('storage.'+ storage) == 'ldap':
            if not self.ldap_conn:
                lp = get_properties(setupObject.ox_ldap_properties)
                ldap_pass = unobscure(lp['bindPassword'])
                ldap_hostname, ldap_port = lp['servers'].split(',')[0].split(':')

                self.ldap_conn = ldap.initialize('ldaps://{0}:{1}'.format(ldap_hostname, ldap_port))
                self.ldap_conn.simple_bind_s('cn=directory manager',ldap_pass)

            return 'ldap'

    def del_casa_custom_scripts(self):
        default_location = self.get_storage_location('default')

        for inum in ('BABA-CACA', 'DAA9-F7F8'):
            dn = 'inum={0},ou=scripts,o=gluu'.format(inum)
            result = self.ldap_conn.search_s(dn, ldap.SCOPE_BASE, attrlist=['dn'])
            if result:
                self.ldap_conn.delete_s(dn)


if __name__ == '__main__':

    setupObject = Setup(cur_dir)
    casaCleanupObject = casaCleanup(cur_dir)
    
    casaCleanupObject.del_casa_custom_scripts()

