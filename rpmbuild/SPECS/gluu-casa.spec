%define _unpackaged_files_terminate_build 0
Name:           gluu-casa
Version:        %VERSION%
Release:        %DIST%
Summary:        Gluu Server Extension
Group:          System Environment/Daemons
License:        Gluu License Agreement for Gluu Casa
URL:            http://www.gluu.org
Source0:        %{name}.tar.gz
BuildArch:      noarch
Requires:       gluu-server >= 4.0, gluu-server < 5.0

%description
User-facing dashboard for people to manage authentication and authorization data in the Gluu Server

%prep
%setup -qn %{name}

%build
#mvn clean package -U -Dmaven.test.skip=true

%install
rm -rf $RPM_BUILD_ROOT
install -d %{buildroot}/opt/gluu-server/opt/dist/gluu
install -d %{buildroot}/opt/gluu-server/opt/dist/oxd
install -d %{buildroot}/opt/gluu-server/opt/gluu/python/libs
install -d %{buildroot}/opt/gluu-server/install/community-edition-setup
install -d %{buildroot}/opt/gluu-server/etc/certs
install -m 644 casa.war %{buildroot}/opt/gluu-server/opt/dist/gluu
install -m 644 twilio-7.17.0.jar %{buildroot}/opt/gluu-server/opt/dist/gluu
install -m 644 %OXD_SERVER% %{buildroot}/opt/gluu-server/opt/dist/oxd
install -m 755 casa-external_otp.py %{buildroot}/opt/gluu-server/opt/gluu/python/libs
install -m 755 casa-external_super_gluu.py %{buildroot}/opt/gluu-server/opt/gluu/python/libs
install -m 755 casa-external_twilio_sms.py %{buildroot}/opt/gluu-server/opt/gluu/python/libs
install -m 755 casa-external_u2f.py %{buildroot}/opt/gluu-server/opt/gluu/python/libs
install -m 755 setup_casa.py %{buildroot}/opt/gluu-server/install/community-edition-setup/
install -m 755 casa_cleanup.py %{buildroot}/opt/gluu-server/install/community-edition-setup/
install -m 644 casa.pub %{buildroot}/opt/gluu-server/etc/certs/

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,root,root,-)
/opt/gluu-server/opt/dist/gluu/casa.war
/opt/gluu-server/opt/dist/gluu/twilio-7.17.0.jar
/opt/gluu-server/opt/dist/oxd/%OXD_SERVER%
/opt/gluu-server/opt/gluu/python/libs/casa-external_otp.py
/opt/gluu-server/opt/gluu/python/libs/casa-external_super_gluu.py
/opt/gluu-server/opt/gluu/python/libs/casa-external_twilio_sms.py
/opt/gluu-server/opt/gluu/python/libs/casa-external_u2f.py
/opt/gluu-server/install/community-edition-setup/setup_casa.py
/opt/gluu-server/install/community-edition-setup/casa_cleanup.py
/opt/gluu-server/etc/certs/casa.pub

%changelog
* Fri Nov 30 2018 Davit Nikoghosyan <davit@gluu.org> - gluu-casa 4.0
- Release 4.0
