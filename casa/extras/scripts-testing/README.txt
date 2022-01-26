NOTE: One of the reasons that the script can fail is because the attribute "mobile" has to be added as an LDAP attribute for entries in ou=people

Steps to run this script

1. Place this script (add_gluu_users.py) and names.json in /install/community-edition-setup
2. Before running the script you might have to install pip and the missing modules (e.g ldap3) that the script will ask for
   pip install <module>
3. Run the script using the command
   python add_gluu_users.py
   NOTE - that we are running python v2 and that is what is supported inside chroot of gluu's container
4. Follow the prompts that should only ask you for the number of users you want to add.

5. A file called gluu_people.txt will be generated holding the usernames created. This file will be used for the login_gluu.py script. Another file called add_user_report.log will be generated that will hold a report summary of the process.

6. You may choose to tail these files during the running the process.