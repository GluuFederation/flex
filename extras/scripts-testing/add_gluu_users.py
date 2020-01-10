#!/usr/bin/env python
"""
Login script per interval of time
Author : Mohammad Abudayyeh
Email : support@gluu.org

"""
import sys
import string
import uuid
import json
import random
import time
import os
import datetime
from ldap3 import Server, Connection, MODIFY_REPLACE, MODIFY_ADD, MODIFY_DELETE, SUBTREE, ALL, BASE, LEVEL
import crypt
import signal


N = 0
bind_dn = None
ldapPass = None
ldap_host = None

# This is a dictionary that will hold all errors and their counts.
errors = {}
# This variable will hold the count of users through the loop
count = 0
# This variable will hold the failed logins
failedadditions = 0
# start timer for the whole process
totalstarttime = time.time()


def get_credentials():
    bindDN = None
    bindPassword = None
    inumOrg = None
    ldapHost = None
    with open('/etc/gluu/conf/gluu-ldap.properties', 'r+') as f:
        for line in f:
            ls = line.strip()
            if ls.startswith('servers:'):
                lsl = ls.split('servers:')
                ldap_host_port = lsl[1].strip().split(',')[0].strip()
                ldapHost, ldapPort = ldap_host_port.split(':')

            elif ls.startswith('bindDN:'):
                bindDN = ls.split('bindDN:')[1].strip()

            elif ls.startswith('bindPassword:'):

                lsl = ls.split('bindPassword:')
                bindPassword_encoded = lsl[1].strip()
                bindPassword = os.popen('/opt/gluu/bin/encode.py -D {}'.format(bindPassword_encoded)).read().strip()


    return bindDN, bindPassword, ldapHost


# Function that will stop python and print error report
def add_user_report():
    print "\nSending results to add_user_report.log\n"
    totalendtime = time.time()
    add_users_report = open("add_user_report.log", "w+")
    add_users_report.write("Total time for all " + str(count) + " users to be added " + str(
        totalendtime - totalstarttime) + "\n" + "Average add time " + \
                      str(count / (totalendtime - totalstarttime)) + " users per second " + "\n" +
                           "Users added so far:" + str(count) + "\n" + "Users Left not added  before exit:" +
                           str(N - count) + "\n" + "Number of failed additions:" + str(failedadditions) +
                           "\nErrors Report : \n")
    print "done \n"
    for e in errors: add_users_report.write(str(e) + " : " + str(errors[e]) + "\n")
    print "Total time for all " + str(count) + " users to be added was " + str(totalendtime - totalstarttime)
    print "Average add user time " + str(count / (totalendtime - totalstarttime)) + " users per second "
    print "Users added so far:" + str(count) + "\n" + "Users Left not added before exit:" + str(
        N - count) + "\n" + "Number of failed additions:" + str(failedadditions)
    print "\nErrors Report : \n"
    for e in errors: print str(e) + " : " + str(errors[e]) + "\n"
    add_users_report.close()


def signalReciever(sig, frame):
    # Warn user a signal has been recieved
    print 'Received: ' + str(sig)
    add_user_report()
    sys.exit(0)


# Function that will handle progress bar and print out dynamically
def progress(count, total, status=''):
    # Length of bar
    bar_len = 5
    # Calculate length  filled so far
    filled_len = int(round(bar_len * count / float(total)))
    # Calculate the finished percent
    percents = round(100.0 * count / float(total), 1)
    # Fill bar with result
    bar = '=' * filled_len + '-' * (bar_len - filled_len)
    # Write to consol line results
    sys.stdout.write('Progress Bar[%s] %s%s|%s\r' % (bar, percents, '%', status))
    # Flush results
    sys.stdout.flush()


credentials = get_credentials()
if len(credentials) == 3:
    bind_dn, ldapPass, ldap_host = get_credentials()
else:
    print "Credentials could not be found. Please provide them below\n"
    bind_dn = input('Please provide your DN. Usually this would be cn=directory manager.Start with cn=\n')
    ldapPass = input('Please provide your LDAP password. This would be the one you placed at installation\n')
    ldap_host = input('What is your ldap hostname. This is usually localhost\n')

bad_input = False
while not bad_input:
    N = input('How many users are you trying to add?\n')
    bad_input = isinstance(N, int)
    if not bad_input:
        print "A float ?! Really?"

print 'My PID is: ' + str(os.getpid())
# Print descriptions of the progress bar
print "T = Time of addition\nL(s) = Time to add user\nU = Users added so far\nUL = Users left " \
      "to add\nUN = Username\nAB = Added boolean\n  "
# Start loop of usernames with analysis of users
server = Server('ldaps://'+ldap_host+':1636')
conn = Connection(server, bind_dn, ldapPass)
conn_bool = conn.bind()
if conn_bool:
    print "Connected to backend LDAP"
else:
    print "Could not connect to backend LDAP"
first_names = json.load(open('names.json'))
names = json.load(open('names.json'))
domain_list = ('@gluu.org', '@foo.org', '@mail.com', '@google.com', '@egg.org', '@yahoo.com', '@hotmail.com')
w = open('gluu_people.txt', 'a')

while count < N and conn_bool:
    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    uid = str(uuid.uuid4()).upper()
    name = random.choice(first_names)
    sn = random.choice(names)
    dne = uid.split('-')[0]+'.'+uid.split('-')[-1]
    inum = str(uuid.uuid4())
    dn="inum={0},ou=people,o=gluu".format(inum)

    username = name+'.'+sn+ random.choice(domain_list)

    cn = name + ' ' + sn

    try:
        attributes={
             'objectClass': ['top', 'gluuPerson','gluuCustomPerson'],
             'givenname': name,
             "cn": cn,
             'sn': sn,
             'uid': username,
             'gluustatus': 'active',
             'userpassword': '{CRYPT}'+crypt.crypt(sn,'sa'),
             'mail': username,
             'displayname': cn,
             'oxLastLogonTime':'20200103171559.634Z',
             'oxOTPDevices':'{"devices":[{"nickName":"OTP","addedOn":1574171085569,"id":821108642,"soft":true}]}',
	     'oxMobileDevices':'{"phones":[{"nickName":"jose phone","number":"+573108147067","addedOn":1575728473816}]}',
	     'mobile':'+1234567890',
             'oxExternalUid': ['totp:3NEYeBLywelHSJBmFIKwKaxBxgo0c7vpbucKYHJM8UjdYkX_l35YH4L29fbonv92Q0wSD0n0Im-4Vg9_kEQfQA==', 'passport-github:madhu1310'],
             'givenname': name,
			 "inum": inum,
             'oxtrustemail': '{"operation":null,"value":"%s","display":"%s","primary":true,'
                             '"reference":null,"type":"other"}' % (
            username, username),
             'iname': '*person*'+dne,
            }
        r = conn.add(dn, attributes=attributes)

        #fido
        another_dn = 'ou=fido,inum={0},ou=people,o=gluu'.format(inum)
        
        more_attributes = {
            'objectClass': ['top','organizationalUnit'],
            'ou': 'fido'
            }
        fido_r = conn.add(another_dn, attributes=more_attributes)

	#oxId-fido
        oxId_value = time.time()
        oxId_dn = 'oxId={0},ou=fido,inum={1},ou=people,o=gluu'.format(oxId_value,inum)
        
        oxId_attr = {
            'objectClass': ['top','oxDeviceRegistration'],
            'oxCounter': '6595',
            'oxLastAccessTime': '20191104120829.009Z',
            'creationDate': '20191104101053.435Z',
            'oxDeviceHashCode': '-6360',
            'oxId': oxId_value,
            'oxApplication': 'https://test-casa.gluu.org',
            'oxStatus':'active'

            }
        oxId_fido_r =  conn.add(oxId_dn, attributes=oxId_attr)
        
	#fido2_register_fido2
        another_dn_fido2 = 'ou=fido2_register,inum={0},ou=people,o=gluu'.format(inum)
        
        more_attributes_fido2 = {
            'objectClass': ['top','organizationalUnit'],
            'ou': 'fido2_register'
            }
        fido2_register = conn.add(another_dn_fido2, attributes=more_attributes_fido2)

        #oxId-fido2_r
        oxId_value2 = time.time()
        oxId_fido2_dn = 'oxId={0},ou=fido2_register,inum={1},ou=people,o=gluu'.format(oxId_value2,inum)
        
        oxId_fido2_attr = {
            
            'objectClass': ['top','oxFido2RegistrationEntry'],
            'oxRegistrationData': '{"createdDate":1577121402717}',
            'oxPublicKeyId': 'dFXwN9dR-I_ksb3e8-vDyRl7cWMtz4LKKf2uMKw6rfDOgsnZfDA5BKU0-BQLJJAv0LGKZDtqRdCXNZgwZedAi0tuOUlw0-XwnCXxJOiE9kPt54yfGB8S9-42qoSohBJ9',
            'personInum': inum,
            'oxCodeChallengeHash': 79670,
            'creationDate': '20191223171642.717Z',
            'oxId': oxId_value2,
            'oxStatus': 'registered',
            'oxCodeChallenge': 'MCmDJxFGb5Kj-4wVAvwkSWDqmLk6cHZm9vEpSeXxCBQ',
            'displayName': 'madhu-s fido'

            }
        oxId_fido2_r =  conn.add(oxId_fido2_dn, attributes=oxId_fido2_attr)

	# this is for client-authorizations
        #ou=authorizations
        #replace the client id with the client id of oxTrust
        ox_id_authz = time.time()
        oxId_authorizations_dn = 'oxId={0},ou=authorizations,o=gluu'.format(ox_id_authz)
        oxId_authorizations_attr = {
            'objectClass': ['top','oxClientAuthorization'],
            'oxAuthScope': 'openid',
            'oxAuthScope': 'user_name',
            'oxAuthScope': 'profile',
            'oxAuthScope': 'email',
            'del': 'true',
            'oxId': ox_id_authz,
            'oxAuthClientId': '@!6EB4.D624.D3CF.9638!0001!5043.91E8!0008!A026.A128',
            'oxAuthUserId': inum
            }
        oxId_authorizations_r =  conn.add(oxId_authorizations_dn, attributes=oxId_authorizations_attr)    	

        #print r, count+1, username
        w.write(username+'\n')
        end = time.time()
        addtime = end - ts
        count += 1
        rows, columns = os.popen('stty size', 'r').read().split()
        printstatus = "T:" + str(st) + "|L(s):" + str(round(addtime, 3)) + "|U:" + str(
            count) + "|UL:" + str(N - count) + "|UN:" + str(username[:username.find("@")]) + "|AB:" + str(r)
        if len(printstatus) > rows: printstatus = printstatus[:rows]
        if count == N: break
        if not r:
            failedadditions += 1
    except Exception as e:
        # Open file to write errors to
        add_user_errors = open("add_user_error.log", "w+")
        if not errors.get(str(e)):
            errors[str(e)] = 0
        errors[str(e)] += 1
        failedadditions += 1
        add_user_errors.write(str(st) + " : " + str(e) + " : " + str(errors[str(e)]) + "\n")
        printstatus = str(st) + " : " + str(e) + " : " + str(errors[str(e)]) + " | Failed added users : " + str(
            failedadditions)
        # This closes the error log file
        add_user_errors.close()
    progress(count, N, status=printstatus)
    signal.signal(signal.SIGHUP, signalReciever)
    signal.signal(signal.SIGINT, signalReciever)
    signal.signal(signal.SIGQUIT, signalReciever)
    signal.signal(signal.SIGILL, signalReciever)
    signal.signal(signal.SIGTRAP, signalReciever)
    signal.signal(signal.SIGABRT, signalReciever)
    signal.signal(signal.SIGBUS, signalReciever)
    signal.signal(signal.SIGFPE, signalReciever)
    signal.signal(signal.SIGUSR1, signalReciever)
    signal.signal(signal.SIGSEGV, signalReciever)
    signal.signal(signal.SIGUSR2, signalReciever)
    signal.signal(signal.SIGPIPE, signalReciever)
    signal.signal(signal.SIGALRM, signalReciever)
    signal.signal(signal.SIGTERM, signalReciever)
add_user_report()
w.close()
