# Gluu Flex Open Banking VM Installation Guide [ NOT FOR PRODUCTION ] 

**Audience:** Administrators installing a single-node Gluu Flex Open Banking environment for development, QA, interoperability testing, or demonstrations  
**Validated:** 10 September 2026  
**Reference platform:** Ubuntu Server 24.04 LTS, x86-64, MySQL, Apache HTTP Server, Jans Auth, Jans Config API, and Gluu Flex Admin UI

> This guide intentionally uses placeholders and contains no real passwords, client secrets, private keys, SSAs, or access tokens.

## 1. What this guide installs

The finished VM exposes one HTTPS hostname and runs the application services only on loopback interfaces:

![Screenshot 2026-09-11 at 2.19.47 AM.png](https://help.gluu.org/kb/agent/attachment/article/146/inline?token=eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ0MSIsIm9yZ2lkIjoiMTI1MDQiLCJpc3MiOiJoZWxwLmdsdXUub3JnIn0.RnzppSwz61yB8uEiv7P9kU5JSDhMCiz4piyB1O4Chsk)

The reference installation contained:

- Ubuntu 24.04 LTS
- Apache 2.4
- MySQL 8
- Amazon Corretto Java 17
- Jetty 12
- Jans Auth
- Jans Config API
- Jans CLI/TUI
- Jans FIDO2
- Open Banking scripts and profiles
- Gluu Flex Admin UI and its Config API plugin
- A local 2 GB swap file

The working reference VM had 2 or more vCPUs, 8 GB RAM, a 50 GB root disk, and 2 GB swap. The upstream minimum is 2 CPU units, 4 GB RAM, 2 GB swap, and 50 GB storage. Use at least 8 GB RAM for a smoother installation.

## 2. Choose the correct deployment model

Use this VM procedure for development, QA, or a small demonstration. Gluu recommends its cloud-native distribution for production Open Banking deployments.

For production:

- Use the stable release, never a nightly build.
- Use official Open Banking ecosystem certificates and trust anchors.
- Use a publicly trusted server certificate for the web hostname.
- Use a separate trust store for Open Banking client-certificate issuers.
- Place MySQL on protected storage and implement tested backups.
- Put secrets in a secrets manager, not shell history or documentation.
- Review HA, disaster recovery, monitoring, audit retention, and key rotation requirements.

Official references:

- [Open Banking VM installation](https://docs.gluu.org/stable/openbanking/install-vm/)
- [Gluu Flex Ubuntu installation](https://docs.gluu.org/head/install/vm-install/ubuntu/)
- [Janssen Ubuntu installation](https://docs.jans.io/head/janssen-server/install/vm-install/ubuntu/)
- [Gluu Flex releases](https://github.com/GluuFederation/flex/releases)
- [Janssen releases](https://github.com/JanssenProject/jans/releases)

### Installation at a glance

1. Create an Ubuntu 24.04 VM and static DNS record.
2. Open 443 and restrict SSH.
3. Obtain the Flex SSA and production certificates, or create test certificates.
4. Run the version-pinned Jans installer with the Open Banking profile.
5. Confirm Jans Auth, Config API, Apache, and MySQL are healthy.
6. Install the matching Flex package and Admin UI.
7. Install the SAN-enabled HTTPS certificate and mTLS CA in Apache.
8. Import the issuing CA into Java's trust store.
9. Validate OIDC discovery and the Admin UI backend introspection route.
10. Import the test client certificate into the browser.
11. Activate Flex with the SSA and sign in to `/admin/`.
12. Complete the acceptance checklist and take an off-host backup.

## 3. Prerequisites

### 3.1 Infrastructure

Prepare a fresh Ubuntu 24.04 LTS x86-64 VM with:

- 2 vCPUs minimum; 4 recommended
- 4 GB RAM minimum; 8 GB recommended
- 50 GB storage minimum
- 2 GB swap
- One stable public IP address
- Working outbound HTTPS access
- Inbound TCP 443 from intended clients
- Inbound TCP 22 restricted to administrator IP addresses
- TCP 80 only if needed for certificate issuance or redirecting to HTTPS

Do not expose ports 8074, 8081, or 3306 publicly.

### 3.2 DNS

Create an `A` record before installation:

```text
id.example.org  ->  203.0.113.10
```

Confirm it from a machine outside the VM:

```bash
dig +short id.example.org A
```

The result must be the VM's stable public IP. The hostname must not change after installation.

### 3.3 Flex license and SSA

Obtain a Software Statement Assertion (SSA) for the Flex license and save it as a text file in a protected location. The Admin UI will request it during initial activation. Treat the SSA as sensitive.

### 3.4 Open Banking keys and certificates

For production, obtain the certificates required by the applicable Open Banking trust framework. For a private QA environment, this guide shows how to create a private test CA, server certificate, and client certificate.

Never use the same subject or Common Name for the CA, server, and client certificates. A safe pattern is:

| Certificate | Example Common Name | Purpose |
|---|---|---|
| Test root CA | `Flex OB Test Root CA` | Signs test certificates |
| HTTPS server | `id.example.org` | Apache server identity |
| Test client | `ob-test-client-01` | Browser or TPP mTLS identity |

## 4. Prepare Ubuntu

Log in using an administrative account and define values for this deployment:

```bash
FQDN=id.example.org
PUBLIC_IP=203.0.113.10
JANS_VERSION=2.3.0
FLEX_VERSION=6.3.0
CERT_DIR=/etc/certs/ob
```

Update the host and install basic tools:

```bash
sudo apt update
sudo apt -y full-upgrade
sudo apt install -y curl wget jq unzip ca-certificates openssl chrony
sudo systemctl enable --now chrony
```

If the upgrade installs a new kernel, reboot now and reconnect before continuing.

Set the hostname:

```bash
sudo hostnamectl set-hostname "$FQDN"
hostnamectl
```

Make sure `/etc/hosts` contains the private interface address and FQDN. Do not map the FQDN only to `127.0.0.1`.

If the VM has less than 2 GB swap, create a swap file:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

Configure the firewall:

```bash
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
sudo ufw allow from YOUR_ADMIN_IP to any port 22 proto tcp
sudo ufw enable
sudo ufw status verbose
```

Replace `YOUR_ADMIN_IP` before enabling UFW. Keep the current SSH session open until a second SSH login succeeds.

## 5. Install Janssen with the Open Banking profile

Flex 6.3.0 corresponds to Janssen 2.3.0. Always confirm the compatible versions on the release pages before using newer versions.

The official Open Banking VM workflow runs the Jans installer with `--profile openbanking`. For reproducibility, download the installer from the release tag instead of the moving `main` branch:

```bash
curl -fsSL \
  "https://raw.githubusercontent.com/JanssenProject/jans/v${JANS_VERSION}/jans-linux-setup/jans_setup/install.py" \
  -o /tmp/jans-openbanking-install.py

python3 -m py_compile /tmp/jans-openbanking-install.py
sha256sum /tmp/jans-openbanking-install.py \
  | sudo tee /var/backups/jans-openbanking-install.sha256 >/dev/null

sudo python3 /tmp/jans-openbanking-install.py --profile openbanking
```

Archiving the checksum makes it possible to prove which installer was used. For formal supply-chain assurance, follow the signed-package verification process in the [Janssen Ubuntu guide](https://docs.jans.io/head/janssen-server/install/vm-install/ubuntu/) and maintain an approved, versioned Open Banking configuration overlay.

The profile asks for:

- VM IP and FQDN
- Certificate subject information
- Maximum application memory
- MySQL persistence
- An Open Banking static `kid`
- Whether an external Open Banking signing key will be used
- Confirmation before it writes the configuration

If you supply an external private key, copy it to a root-only directory and set mode `600` before setup. Never paste the private key or its password into a ticket, chat, or shared log.

Choose values equivalent to the following:

| Prompt | Recommended value |
|---|---|
| IP address | The VM interface address requested by the installer |
| Hostname | `id.example.org` |
| Organization details | Your real organization details |
| Application memory | `4096` MB on an 8 GB VM |
| Persistence | MySQL |
| Remote database | No for this single-node guide |
| Open Banking static `kid` | A unique identifier matching the signing-key plan |
| External Open Banking key | Yes only when a protected key has already been prepared |
| Jans Auth | Yes |
| Config API | Yes |
| Jans CLI/TUI | Yes |
| FIDO2 | Yes if required |
| SCIM, Casa, Link, Lock | Only when required |
| Admin password | A unique password from a password manager |

Let setup finish completely. Do not interrupt Java service starts; first startup may take several minutes.

The base setup log is:

```text
/opt/jans/jans-setup/logs/setup.log
```

## 6. Verify the base Open Banking installation

Before adding Flex Admin UI, confirm that the base services are healthy:

```bash
sudo systemctl is-active apache2 mysql jans-auth jans-config-api
curl -fsS "https://${FQDN}/.well-known/openid-configuration" \
  --cacert /path/to/current/issuing-ca.crt | jq '.issuer, .token_endpoint, .jwks_uri'
```

If the generated HTTPS certificate is only temporary, complete Section 8 before expecting browser validation to succeed. Do not continue to Admin UI while Jans Auth or Config API is inactive.

## 7. Install Gluu Flex and Admin UI

Download and verify the stable Flex package:

```bash
cd /tmp
wget "https://github.com/GluuFederation/flex/releases/download/v${FLEX_VERSION}/flex_${FLEX_VERSION}-stable.ubuntu24.04_amd64.deb"
wget "https://github.com/GluuFederation/flex/releases/download/v${FLEX_VERSION}/flex-ubuntu24-${FLEX_VERSION}-stable.bundle"

cosign verify-blob \
  --bundle "flex-ubuntu24-${FLEX_VERSION}-stable.bundle" \
  --certificate-identity-regexp 'https://github.com/GluuFederation/flex' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  "flex_${FLEX_VERSION}-stable.ubuntu24.04_amd64.deb"

sudo apt install -y "/tmp/flex_${FLEX_VERSION}-stable.ubuntu24.04_amd64.deb"
```

Run Flex setup:

```bash
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py
```

Answer `y` to `Install Admin UI`. Install Casa only if it is part of the design.

The Flex setup log is:

```text
/opt/jans/jans-setup/logs/flex-setup.log
```

Flex setup installs the Admin UI static application, Admin UI Config API plugin, OIDC clients, scopes and role mappings, the default Cedarling policy store, and the Agama password flow used by the UI.

## 8. Configure certificates correctly

Skip test-certificate generation if you have real production certificates.

### 8.1 Create a private test CA

```bash
sudo install -d -m 750 "$CERT_DIR"
cd /tmp

openssl req -x509 -newkey rsa:3072 -sha256 -nodes -days 3650 \
  -keyout ob-test-ca.key \
  -out ob-test-ca.crt \
  -subj '/C=US/O=Example Test/CN=Flex OB Test Root CA'

sudo install -o root -g root -m 600 ob-test-ca.key "$CERT_DIR/ca.key"
sudo install -o root -g root -m 644 ob-test-ca.crt "$CERT_DIR/ca.crt"
```

Keep the CA private key offline if possible. It is needed only to issue or revoke test certificates.

### 8.2 Create the HTTPS server certificate with SAN

The Subject Alternative Name is mandatory for modern browsers. A correct Common Name alone is insufficient.

```bash
cd /tmp
openssl genrsa -out server.key 3072
openssl req -new -key server.key -out server.csr \
  -subj "/C=US/O=Example Test/OU=Server/CN=${FQDN}"

tee server.ext >/dev/null <<EOF
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
subjectAltName=DNS:${FQDN},IP:${PUBLIC_IP}
EOF

sudo openssl x509 -req -in server.csr \
  -CA "$CERT_DIR/ca.crt" -CAkey "$CERT_DIR/ca.key" -CAcreateserial \
  -out server.crt -days 825 -sha256 -extfile server.ext

sudo install -o root -g root -m 600 server.key "$CERT_DIR/server.key"
sudo install -o root -g root -m 644 server.crt "$CERT_DIR/server.crt"
```

Validate it before touching Apache:

```bash
openssl verify -CAfile "$CERT_DIR/ca.crt" "$CERT_DIR/server.crt"
openssl x509 -in "$CERT_DIR/server.crt" -noout -subject -issuer -dates -ext subjectAltName
openssl verify -CAfile "$CERT_DIR/ca.crt" -verify_hostname "$FQDN" "$CERT_DIR/server.crt"
```

All three commands must succeed, and the SAN must contain the FQDN.

### 8.3 Create a test mTLS client certificate

```bash
cd /tmp
openssl genrsa -out client.key 3072
openssl req -new -key client.key -out client.csr \
  -subj '/C=US/O=Example Test/OU=Open Banking Client/CN=ob-test-client-01'

tee client.ext >/dev/null <<'EOF'
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=clientAuth
EOF

sudo openssl x509 -req -in client.csr \
  -CA "$CERT_DIR/ca.crt" -CAkey "$CERT_DIR/ca.key" -CAcreateserial \
  -out client.crt -days 365 -sha256 -extfile client.ext

openssl verify -CAfile "$CERT_DIR/ca.crt" client.crt
openssl pkcs12 -export \
  -inkey client.key -in client.crt -certfile "$CERT_DIR/ca.crt" \
  -name 'Flex OB test client' -out client.p12
```

Give `client.p12` a strong export password. Import it into the test browser or operating-system certificate store. Delete unprotected temporary private-key copies after securely transferring the bundle.

### 8.4 Configure Apache mTLS

Back up the vhost:

```bash
sudo cp -a /etc/apache2/sites-enabled/https_jans.conf \
  "/etc/apache2/sites-enabled/https_jans.conf.before-ob-mtls"
```

Ensure the HTTPS virtual host contains:

```apache
SSLEngine on
SSLProtocol -all +TLSv1.2
SSLCertificateFile /etc/certs/ob/server.crt
SSLCertificateKeyFile /etc/certs/ob/server.key
SSLCACertificateFile /etc/certs/ob/ca.crt

# Ask for a client certificate at the TLS layer, but allow ordinary UI pages.
SSLVerifyClient optional
SSLVerifyDepth 10

<Location /jans-auth/restv1/register>
    SSLVerifyClient require
    ProxyPass http://127.0.0.1:8081/jans-auth/restv1/register
    ProxyPassReverse http://127.0.0.1:8081/jans-auth/restv1/register
</Location>

<Location /jans-auth/restv1/token>
    SSLVerifyClient require
    ProxyPass http://127.0.0.1:8081/jans-auth/restv1/token
    ProxyPassReverse http://127.0.0.1:8081/jans-auth/restv1/token
</Location>
```

Keep the proxy routes generated by the installer; do not replace the whole file with this fragment.

The repaired reference profile explicitly allowed TLS 1.2. Enable TLS 1.3 only when the selected Open Banking profile, Flex/Jans release, and interoperability test suite support it.

Validate and reload:

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
sudo systemctl is-active apache2
```

If the Admin UI performs its token exchange directly from the browser against an mTLS-required token endpoint, that browser must present a valid client certificate. A production design may instead use a dedicated mTLS alias or backend-mediated exchange; align this with the relevant Open Banking profile.

## 9. Trust the issuing CA in Java

Jans Auth and Config API use the Java trust store when calling HTTPS endpoints. Import the issuing CA, not the server leaf certificate. Importing a leaf certificate creates a fragile pin that breaks whenever the server certificate is renewed.

Back up the trust store:

```bash
sudo cp -a /opt/jre/lib/security/cacerts \
  "/opt/jre/lib/security/cacerts.before-ob-ca"
```

Replace any stale alias and import the CA:

```bash
sudo /opt/jre/bin/keytool -delete \
  -alias flex_ob_test_ca \
  -keystore /opt/jre/lib/security/cacerts \
  -storepass changeit 2>/dev/null || true

sudo /opt/jre/bin/keytool -importcert -noprompt -trustcacerts \
  -alias flex_ob_test_ca \
  -file "$CERT_DIR/ca.crt" \
  -keystore /opt/jre/lib/security/cacerts \
  -storepass changeit

sudo /opt/jre/bin/keytool -list \
  -alias flex_ob_test_ca \
  -keystore /opt/jre/lib/security/cacerts \
  -storepass changeit
```

Compare the listed SHA-256 fingerprint with:

```bash
openssl x509 -in "$CERT_DIR/ca.crt" -noout -fingerprint -sha256
```

Restart the Java services:

```bash
sudo systemctl restart jans-auth jans-config-api
```

## 10. Admin UI configuration checks

### 10.1 Use loopback for the backend's own introspection call

On a single-node VM, the Admin UI backend can introspect its token through the local Jans Auth listener. This avoids sending an internal call back through public Apache mTLS and prevents a certificate trust loop.

First inspect the current Admin UI configuration. Do not print the entire record because it contains client secrets.

```bash
sudo mysql -N jansdb -e "
SELECT JSON_UNQUOTE(JSON_EXTRACT(jansConfApp,
'$.oidcConfig.auiBackendApiClient.introspectionEndpoint'))
FROM jansAppConf WHERE doc_id='admin-ui';"
```

For the single-node topology, the expected value is:

```text
http://127.0.0.1:8081/jans-auth/restv1/introspection
```

If it is still the public HTTPS URL and `adminui.log` reports a PKIX error, back up and update only this field:

```bash
sudo mysqldump jansdb jansAppConf --where="doc_id='admin-ui'" \
  | sudo tee /root/admin-ui-config-before-introspection.sql >/dev/null

sudo mysql jansdb <<'SQL'
UPDATE jansAppConf
SET jansConfApp = JSON_SET(
  jansConfApp,
  '$.oidcConfig.auiBackendApiClient.introspectionEndpoint',
  'http://127.0.0.1:8081/jans-auth/restv1/introspection'
)
WHERE doc_id = 'admin-ui';
SQL

sudo systemctl restart jans-config-api
```

If `/opt/jans/jans-setup/flex/auiConfiguration.json` exists, make the same targeted change there so rerunning setup does not restore the old value. Back up that file first and keep it mode `600`, because it contains secrets.

### 10.2 Ensure discovery advertises `userinfo_endpoint`

Check discovery without displaying sensitive data:

```bash
curl -fsS "https://${FQDN}/.well-known/openid-configuration" \
  --cacert "$CERT_DIR/ca.crt" \
  | jq '{issuer,authorization_endpoint,token_endpoint,userinfo_endpoint,introspection_endpoint,jwks_uri}'
```

Every displayed field must be a non-null URL. If `userinfo_endpoint` is absent, the Admin UI may finish the authorization callback and then request `/jans-config-api/`, which returns 404.

For affected nightly builds only, back up and add the discovery key:

```bash
sudo mysqldump jansdb jansAppConf --where="doc_id='jans-auth'" \
  | sudo tee /root/jans-auth-config-before-userinfo.sql >/dev/null

sudo mysql jansdb <<'SQL'
UPDATE jansAppConf
SET jansConfDyn = JSON_SET(
  jansConfDyn,
  '$.discoveryAllowedKeys',
  JSON_ARRAY_APPEND(
    JSON_EXTRACT(jansConfDyn, '$.discoveryAllowedKeys'),
    '$',
    'userinfo_endpoint'
  )
)
WHERE doc_id = 'jans-auth'
  AND NOT JSON_CONTAINS(
    JSON_EXTRACT(jansConfDyn, '$.discoveryAllowedKeys'),
    JSON_QUOTE('userinfo_endpoint')
  );
SQL

sudo systemctl restart jans-auth
```

Also update the installer-generated source configuration under `/opt/jans/jans-setup/output/jans-auth/` if it is present, after backing it up. This workaround should not be applied blindly to a newer stable release.

## 11. Start and verify the system

Enable and restart the core services:

```bash
sudo systemctl enable apache2 mysql jans-auth jans-config-api
sudo systemctl restart mysql jans-auth jans-config-api apache2
sudo systemctl is-active apache2 mysql jans-auth jans-config-api
```

Every result must be `active`.

Confirm private listeners:

```bash
sudo ss -lntp | grep -E ':(443|8074|8081|3306)\b'
```

Expected topology:

- Apache listens publicly on 443.
- Jans Config API listens on `127.0.0.1:8074`.
- Jans Auth listens on `127.0.0.1:8081`.
- MySQL listens on `127.0.0.1:3306`.

Check the public endpoints:

```bash
curl -fsSI "https://${FQDN}/admin/" --cacert "$CERT_DIR/ca.crt"
curl -fsS "https://${FQDN}/.well-known/openid-configuration" \
  --cacert "$CERT_DIR/ca.crt" | jq -e '.issuer and .token_endpoint and .userinfo_endpoint'
curl -fsS "https://${FQDN}/jans-auth/restv1/jwks" \
  --cacert "$CERT_DIR/ca.crt" | jq -e '.keys | length > 0'
```

Check that the token endpoint requires mTLS. A request without a client certificate should fail at TLS or return an authorization error; it must not issue a token.

Then test with the client certificate:

```bash
curl -v "https://${FQDN}/jans-auth/restv1/token" \
  --cacert "$CERT_DIR/ca.crt" \
  --cert /path/to/client.crt \
  --key /path/to/client.key
```

An OAuth error such as a missing grant is acceptable for this connectivity test. The important result is that TLS accepts the client certificate and the request reaches Jans Auth.

## 12. Activate and access Admin UI

1. Import the test CA into the browser's trust store if the HTTPS certificate is privately issued.
2. Import `client.p12` into the browser or operating-system client certificate store.
3. Open `https://id.example.org/admin/`.
4. Select the mTLS certificate when the browser asks.
5. Upload or paste the SSA only in the Flex activation screen.
6. Sign in as `admin` with the administrator password set during Jans setup.
7. Confirm that the page displays the dashboard and the administrator identity.

The installer creates a default policy store with an `admin` role and assigns that role to the default administrator.

## 13. Troubleshooting Admin UI

### 13.1 Fast diagnostic commands

```bash
sudo systemctl --no-pager --full status apache2 jans-auth jans-config-api mysql
sudo journalctl -u jans-auth -u jans-config-api --since '15 minutes ago' --no-pager
sudo tail -n 200 /var/log/apache2/error.log
sudo tail -n 200 /var/log/apache2/access.log
sudo tail -n 200 /var/log/adminui/adminui.log
```

Do not post raw logs publicly until access tokens, client secrets, authorization codes, cookies, SSAs, email addresses, and certificate subjects have been redacted.

### 13.2 Symptom matrix

| Symptom | Likely cause | Check | Correction |
|---|---|---|---|
| Browser stays on **Redirecting…** | TLS or client-certificate failure | Apache error log and browser certificate selection | Confirm server SAN, client certificate chain, clientAuth EKU, and trusted CA |
| Apache logs `certificate unknown` | Browser rejected the server chain or Apache rejected the client chain | `openssl verify` for both leaf certificates | Install the correct CA; never give CA, server, and client the same subject |
| Admin UI API returns HTTP 500 and `adminui.log` shows `PKIX path validation failed` | Java trust store contains an old server leaf or lacks the issuing CA | `keytool -list` and CA SHA-256 fingerprint | Delete stale leaf alias, import the issuing CA, restart Config API |
| OAuth callback succeeds, then browser requests `/jans-config-api/` and receives 404 | Discovery omitted `userinfo_endpoint` | Inspect `.well-known/openid-configuration` | Add `userinfo_endpoint` to allowed discovery keys on affected builds, restart Jans Auth |
| Token request fails before OAuth validation | Browser did not send a client certificate | Apache SSL debug log | Import the PKCS#12 bundle and select it when prompted |
| Admin UI asks for activation or rejects access | SSA or license missing/invalid | Admin UI license page and Admin UI log | Obtain a valid SSA for this installation; verify clock and outbound HTTPS |
| `/admin/` is 200 but dashboard API calls fail | Config API or Admin UI plugin problem | `jans-config-api` status and `adminui.log` | Verify plugin installation, database configuration, and Config API listener |
| Works with `curl -k` only | Server certificate is untrusted or invalid | `openssl s_client` and SAN output | Install a valid chain; do not use `-k` as a permanent fix |

### 13.3 Certificate diagnostics

```bash
openssl s_client -connect "${FQDN}:443" -servername "$FQDN" \
  -CAfile "$CERT_DIR/ca.crt" -verify_return_error </dev/null

openssl x509 -in "$CERT_DIR/server.crt" -noout \
  -subject -issuer -dates -fingerprint -sha256 -ext subjectAltName

openssl verify -CAfile "$CERT_DIR/ca.crt" -verify_hostname "$FQDN" \
  "$CERT_DIR/server.crt"
```

### 13.4 Important log locations

| Component | Location |
|---|---|
| Base installer | `/opt/jans/jans-setup/logs/setup.log` |
| Flex installer | `/opt/jans/jans-setup/logs/flex-setup.log` |
| Admin UI backend | `/var/log/adminui/adminui.log` |
| Apache access/error | `/var/log/apache2/` |
| Jans Auth | `/opt/jans/jetty/jans-auth/logs/` |
| Jans Config API | `/opt/jans/jetty/jans-config-api/logs/` |
| Systemd services | `journalctl -u SERVICE` |

## 14. Backup before changes

At minimum, protect:

- MySQL database `jansdb`
- `/etc/jans/`
- `/etc/certs/` excluding any CA private key that is stored offline
- `/etc/apache2/sites-available/` and `/etc/apache2/sites-enabled/`
- `/opt/jans/jans-setup/setup.properties.last`
- `/opt/jans/jans-setup/flex/auiConfiguration.json`
- `/opt/jre/lib/security/cacerts`
- Admin UI policy store and licensing records

Example database backup:

```bash
sudo install -d -m 700 /var/backups/flex
sudo mysqldump --single-transaction --routines --triggers jansdb \
  | gzip -c | sudo tee /var/backups/flex/jansdb.sql.gz >/dev/null
sudo chmod 600 /var/backups/flex/jansdb.sql.gz
```

Store backups outside the VM and test restoration in a separate environment.

## 15. Routine operations

Service health:

```bash
sudo systemctl is-active apache2 mysql jans-auth jans-config-api
```

Admin UI update:

```bash
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --update-admin-ui
```

Before updating:

1. Read both Janssen and Flex release notes.
2. Confirm that the Flex and Janssen versions are compatible.
3. Back up the database, configuration, certificates, and Java trust store.
4. Test the update on a clone.
5. Re-run discovery, mTLS, token, userinfo, and Admin UI checks.

Certificate renewal checklist:

1. Issue a new leaf certificate with the same FQDN in SAN.
2. Keep the CA unchanged unless performing a planned CA rotation.
3. Validate the chain and hostname before installation.
4. Replace the Apache leaf and key atomically.
5. Run `apache2ctl configtest` and reload Apache.
6. If the issuing CA changed, import the new CA into Java and restart Jans services.
7. Never pin a renewable leaf certificate in Java's CA trust store.

## 16. Uninstallation warning

Uninstallation is destructive and removes application data. Take and verify backups first.

Remove Flex components:

```bash
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```

Remove Janssen:

```bash
sudo python3 /opt/jans/jans-setup/install.py -uninstall
```

Do not run either command merely to repair an unhealthy service.

## 17. Exact reference-deployment notes

The repaired QA deployment differed from the recommended stable path:

- It used the Jans `main` installer with `--profile openbanking`.
- It downloaded `0.0.0-nightly` Jans and Flex artifacts.
- Base installation completed first; Admin UI was installed later using `flex_setup.py`.
- MySQL was local and all backend listeners were bound to loopback.
- Apache required mTLS for token and dynamic registration endpoints.
- The generated server certificate lacked SAN and was replaced with a SAN-enabled leaf signed by the existing private test CA.
- Admin UI backend introspection was changed to `http://127.0.0.1:8081/.../introspection`.
- A stale server-leaf entry in Java `cacerts` was replaced with the issuing CA.
- `userinfo_endpoint` was added to the public OIDC discovery response.

After those corrections, the authorization code exchange, userinfo request, Admin UI configuration calls, license checks, and dashboard load all completed successfully.

For a new installation, the goal is to get these certificate and discovery details right during initial setup so the repair steps are unnecessary.

## 18. Final acceptance checklist

- [ ] Stable public IP and FQDN are correct.
- [ ] Host time is synchronized.
- [ ] Only 22, 80 when needed, and 443 are publicly reachable.
- [ ] MySQL, Jans Auth, and Config API listen only on protected interfaces.
- [ ] Server certificate validates for the FQDN and contains SAN.
- [ ] CA, server, and client certificate subjects are distinct.
- [ ] Client certificate contains the `clientAuth` EKU.
- [ ] Apache configuration test passes.
- [ ] Required services report `active`.
- [ ] Discovery contains issuer, authorization, token, userinfo, introspection, and JWKS endpoints.
- [ ] JWKS contains at least one key.
- [ ] Token and registration endpoints enforce mTLS as intended.
- [ ] Java trusts the issuing CA, not a renewable leaf.
- [ ] Admin UI loads, license/SSA is active, and the administrator can sign in.
- [ ] Backups are encrypted, stored off-host, and restoration has been tested.
- [ ] No secrets have been left in shell history, world-readable files, logs, or documentation.

## 19. Source references

This runbook combines direct verification of the repaired system with the following primary project documentation:

- Gluu, [Install Gluu Flex on Ubuntu Linux](https://docs.gluu.org/head/install/vm-install/ubuntu/)
- Gluu, [Admin UI](https://docs.gluu.org/stable/admin/admin-ui/home/)
- Gluu Federation, [Flex releases](https://github.com/GluuFederation/flex/releases)
- Janssen Project, [Ubuntu Janssen installation](https://docs.jans.io/head/janssen-server/install/vm-install/ubuntu/)
- Janssen Project, [Janssen releases](https://github.com/JanssenProject/jans/releases)
