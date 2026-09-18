---
title: "Install Gluu Flex Openbanking in VM"
tags: [gluu, flex, openbanking, vm, rhel9, ubuntu24, janssen, deployment]
status: active
---

# Install Gluu Flex Openbanking in VM

<div role="alert" style="border: 3px solid #c62828; background-color: #fff0f0; padding: 20px; margin: 20px 0; border-radius: 6px;">
<h2 style="color: #c62828; font-size: 28px; font-weight: 800; line-height: 1.4; margin: 0;">🔴 WARNING: VIRTUAL MACHINE INSTALLATION IS ONLY FOR DEVELOPMENT WORK, NOT FOR PRODUCTION OPERATION</h2>
</div>

This page combines the installation guides for RHEL 9 and Ubuntu 24.04 LTS. Select your operating system below and follow its section.

<a id="contents"></a>

**Contents**

1. [RHEL 9](#rhel-9)
2. [Ubuntu 24.04](#ubuntu-2404)

---

<a id="rhel-9"></a>

## 1. RHEL 9

### Purpose and support boundary

This runbook installs a single-node Gluu Open Banking/Janssen environment on a clean RHEL 9 x86_64 VM. It combines the official VM workflow with fixes proven during a complete RHEL 9.8 installation, Admin UI integration, browser test, mTLS regression test, and reboot test.

Run privileged command blocks from a root shell, or prefix individual commands with `sudo`. Read-only client validation commands can run as an unprivileged user that can read the designated test CA and client credentials.

The Open Banking VM distribution is intended for development and testing. Prefer the cloud-native distribution and production-grade PKI, DNS, backup, monitoring, and change control for production.

Authoritative references:

- [Official Gluu Open Banking VM guide](https://docs.gluu.org/stable/openbanking/install-vm/)
- [Official Gluu Flex RHEL guide](https://docs.gluu.org/stable/install/vm-install/rhel/)
- [Current Janssen installer wrapper](https://github.com/JanssenProject/jans/blob/main/jans-linux-setup/jans_setup/install.py)
- RHEL 9 execution plan (internal verification record)
- Verified RHEL 9.8 installation work log (internal verification record)

> Important: the current public installer and private Open Banking overlay can move independently. Pin both sources, hash every input, and validate their compatibility before changing the server. Do not copy the example deployment's commits or hashes blindly into a new installation.

### 1. Collect deployment values

Record these values before connecting to the VM. Keep passwords, SSA JWTs, private keys, client assertions, and bearer tokens out of chat, shell arguments, and shared logs.

| Variable | Meaning | Example from the verified test only |
|---|---|---|
| `FQDN` | Server hostname | `testobrhel9.gluu.info` |
| `INTERFACE_IP` | Static address assigned to a VM interface | `172.31.45.215` |
| `PUBLIC_OR_REACHABLE_IP` | NAT/public destination used by test clients | `54.213.215.176` |
| `JANS_REF` | Pinned Jans branch, tag, or commit | Record the full immutable value |
| `OB_REF` | Pinned private Open Banking commit | Record from the supplied archive |
| `APP_RAM_MB` | Jans application memory | `4096` |
| `EVIDENCE_DIR` | Root-only audit directory | `/root/openbanking-evidence-<UTC>` |

Set the real values in the root shell before running examples; do not paste angle-bracket placeholders literally.

Also decide:

- public DNS or a documented client-side hosts entry;
- local MySQL or an approved remote MySQL topology (the tested profile used local MySQL);
- generated Jans signing keys or approved external keys/JWKS;
- certificate subject and server trust policy;
- whether Admin UI is required and licensed;
- whether full SSA dynamic client registration is in scope;
- how the administrator password, SSA, Directory keys, transport PKCS#12, and truststore will be delivered securely.

### 2. Preflight the clean VM

Minimum resources are 2 CPUs, 4 GB RAM, 2 GB persistent swap, and 50 GB disk. A more comfortable tested allocation is 4 CPUs, 8 GB or more RAM, and `4096` MB application memory.

Run the read-only checks first:

```bash
cat /etc/redhat-release
cat /etc/os-release
uname -m
hostnamectl
nproc
free -h
swapon --show
lsblk
df -hT /
ip -brief address
timedatectl
ss -lntup
getenforce
firewall-cmd --state || true
dnf repolist --enabled
dnf list --available mysql-server mod_auth_openidc
rpm -qa | grep -Ei 'jans|gluu|flex|httpd|apache|mysql|mariadb|postgres|java|jetty' || true
find /opt/jans /etc/jans /etc/certs -maxdepth 2 -print 2>/dev/null
systemctl --failed
```

Continue only when all of these are true:

- RHEL 9 x86_64 is installed and package repositories are reachable.
- The minimum resources are available.
- Time synchronization is active.
- The chosen hostname resolves to the VM's interface address locally.
- TCP 80 and 443 are free, or existing listeners have an approved disposition.
- The cloud firewall/security group allows SSH from the operator and HTTPS from test clients.
- No Jans, Gluu, Flex, database, certificate, or configuration data needs preservation.
- Outbound HTTPS works with normal certificate verification.

Stop if an existing installation is found. This guide is not an in-place upgrade procedure.

#### Add persistent swap when required

First confirm `/swapfile` does not exist and no conflicting swap policy is present. Then:

```bash
cp -a /etc/fstab /etc/fstab.pre-openbanking
fallocate -l 2G /swapfile
chmod 0600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
systemctl daemon-reload
findmnt --verify --verbose
swapon --show
free -h
```

### 3. Establish hostname and client routing

Set the intended FQDN and confirm it resolves to the address assigned to the VM interface:

```bash
hostnamectl set-hostname FQDN.example.org
hostname -f
getent hosts FQDN.example.org
ip -brief address
```

When public DNS intentionally does not point at the test VM, add a hosts entry on every test client:

```text
PUBLIC_OR_REACHABLE_IP FQDN.example.org
```

Record this limitation. External tests must reach the intended VM, not whichever host public DNS currently identifies.

### 4. Prepare RHEL 9

#### SELinux

The tested official RHEL path uses permissive mode. Back up the configuration, set permissive mode, and verify it. Do not disable SELinux.

```bash
cp -a /etc/selinux/config /etc/selinux/config.pre-openbanking
setenforce 0
sed -ri 's/^SELINUX=.*/SELINUX=permissive/' /etc/selinux/config
getenforce
grep '^SELINUX=' /etc/selinux/config
```

#### Firewall and RPM dependencies

Preserve remote access by configuring SSH and HTTPS before relying on the new firewall state:

```bash
dnf install -y firewalld httpd mod_ssl mod_auth_openidc
firewall-offline-cmd --zone=public --add-service=ssh
firewall-offline-cmd --zone=public --add-service=https
systemctl enable --now firewalld
firewall-cmd --zone=public --list-services
```

Open a second SSH session before closing the first one. Confirm the correct interface is assigned to the intended firewalld zone. Install EPEL only if the enabled RHEL repositories cannot supply `mod_auth_openidc`.

Use a normal installer umask, normally `022`:

```bash
umask
umask 022
```

A restrictive inherited umask can make runtime files unreadable to the `jetty` or web-server accounts.

### 5. Freeze and validate installer inputs

#### Where to obtain the software

The VM installer is public, but the Open Banking profile overlay is not a public standalone RPM or anonymous download. Obtain each input as follows:

| Input | Source |
|---|---|
| Jans installer wrapper, `install.py` | Public [`JanssenProject/jans`](https://github.com/JanssenProject/jans) repository |
| Jans setup source, `jans.zip` | A release tag or reviewed commit from the same public Jans repository |
| Open Banking profile, `openbanking.zip` | Private [`GluuFederation/openbanking`](https://github.com/GluuFederation/openbanking) repository; the deploying GitHub account must be granted access by the Gluu delivery/support owner, or must receive an approved release archive through the organization's secure delivery channel |
| Optional Flex/Admin UI RPM and signature bundle | [Gluu Flex GitHub releases](https://github.com/GluuFederation/flex/releases); an SSA obtained through the Gluu trial or subscription process is also required for licensing |

The [official Open Banking VM guide](https://docs.gluu.org/stable/openbanking/install-vm/) documents the convenience entry point:

```bash
curl --fail --location --output install.py \
  https://raw.githubusercontent.com/JanssenProject/jans/main/jans-linux-setup/jans_setup/install.py
sudo python3 install.py --profile openbanking
```

That wrapper downloads Jans setup and its selected component artifacts. For the Open Banking profile it also requests a GitHub access token so it can retrieve the private overlay. Do not put a token in the URL, shell history, a logged command-line argument, or this guide. The tested wrapper reads its interactive token prompt visibly, so use it only from a private console; the reproducible staged method below is preferred.

For a pinned deployment, obtain the public files at the approved Jans tag or commit:

```bash
JANS_REF='<approved-jans-tag-or-full-commit>'

curl --fail --location --output /secure/source/install.py \
  "https://raw.githubusercontent.com/JanssenProject/jans/${JANS_REF}/jans-linux-setup/jans_setup/install.py"
curl --fail --location --output /secure/source/jans.zip \
  "https://github.com/JanssenProject/jans/archive/${JANS_REF}.zip"
```

After access to the private Open Banking repository has been approved, use an authenticated Git credential helper to create the overlay archive without placing credentials in the command:

```bash
OB_REF='<approved-openbanking-tag-or-full-commit>'

git clone https://github.com/GluuFederation/openbanking.git /secure/source/openbanking
git -C /secure/source/openbanking checkout --detach "$OB_REF"
git -C /secure/source/openbanking archive \
  --format=zip --output=/secure/source/openbanking.zip "$OB_REF"
```

If repository access is not available, stop and request the approved `openbanking.zip` plus its tag/commit, checksum, and provenance from the Gluu delivery/support owner. Do not substitute an arbitrary attachment or an unverified archive.

Obtain and freeze these inputs before continuing:

- the official `install.py` wrapper;
- a Jans source archive pinned to `JANS_REF`;
- the private Open Banking archive pinned to `OB_REF`;
- every RPM/WAR/JAR or other component artifact selected by the underlying Jans setup;
- a compatible, reviewed overlay if the pinned sources need the corrections described below.
- the pinned Flex/Admin UI source and binary bundle when Admin UI is in scope;
- the Flex SSA in a separate root-owned `0600` file.

Create protected staging and evidence directories:

```bash
install -d -m 0700 /opt/dist/jans
install -d -m 0700 /root/openbanking-evidence-YYYYMMDDTHHMMSSZ/inputs
install -m 0700 /secure/source/install.py /opt/dist/jans/install.py
install -m 0600 /secure/source/jans.zip /opt/dist/jans/jans.zip
install -m 0600 /secure/source/openbanking.zip /opt/dist/jans/openbanking.zip
sha256sum /opt/dist/jans/install.py /opt/dist/jans/jans.zip /opt/dist/jans/openbanking.zip
unzip -t /opt/dist/jans/jans.zip
unzip -t /opt/dist/jans/openbanking.zip
```

Copy the checksum output into the protected evidence directory. `unzip -t` checks integrity only; it does not prove extraction is safe. Explicitly scan ZIP members and reject absolute paths, `..` traversal, symlink entries, and embedded private keys. Legitimate setup archives may contain executable scripts. The Open Banking ZIP must contain the expected `jans-linux-setup/openbanking` subtree.

The three files shown above are only the wrapper and source/profile inputs. They are not a complete offline installation bundle. `-use-downloaded` is valid only after a pinned download-only stage or an approved artifact bundle has populated every component selected by the underlying setup and every file has been hash-verified.

#### Mandatory compatibility review

Before installation, extract copies into a temporary staging directory and confirm:

1. RHEL 9 maps to the installer's RPM path (`red 9`).
2. The Open Banking HTTPD template is named `templates/apache/https_jans.conf.mako`; the current setup renders the Mako template, not the legacy `https_jans.conf` file.
3. The template renders without an undefined `jans_fido2_port` when FIDO2 is not selected.
4. Public discovery and JWKS are proxied, while `/jans-auth/restv1/token`, `/jans-auth/restv1/register`, and `/jans-auth/restv1/revoke` retain `SSLVerifyClient require`.
5. The RFC 7009 revocation path is present externally, not only on the Jans Auth loopback listener.
6. `Registration.py` uses the available `HttpService2` API, for example through an intentionally reviewed compatibility import, rather than the removed `HttpService` class.
7. No unused test private key is shipped into the live setup tree.
8. Every referenced class exists in the pinned Jans artifacts.

Render-test the template and run `httpd -t` against generated configuration before accepting a compatibility overlay. Build one final corrected overlay containing the complete reviewed change set; preserve the immutable original and intermediate archives instead of overwriting them. Install the core platform with that final hashed overlay before proceeding to Admin UI. In the verified build, that was `openbanking.v5.zip`; its hash is version-specific.

### 6. Prepare installation answers safely

The setup properties collect the interface IP, FQDN, certificate subject, support email, application memory, persistence choice, signing-key choice, and administrator password. Keep the root-owned `0600` properties file outside `/opt/jans/jans-setup`, because the wrapper replaces that setup tree.

- Use the static address shown by `ip -brief address`, not a public NAT address absent from the VM.
- Select MySQL for the tested Open Banking profile.
- Use only an approved `staticKid`. If Jans generates signing keys, verify the chosen key exists; leaving `staticKid` empty is safer than referencing a nonexistent key.
- Keep the password in a root-owned `0600` file or enter it at a non-echoing prompt. Do not put it in command arguments or shell history.
- Keep SSA and private-key material root-owned and `0600`. Do not decode or print the SSA into logs.
- Print and retain only a sanitized, non-secret answer summary.

Create `/root/openbanking-setup.properties` under `umask 077`, then confirm `root:root` ownership and mode `0600`. Keep the administrator password out of the visible command line and append it only from a protected input or non-echoing prompt.

### 7. Install the Open Banking profile

The official online entry point is:

```bash
sudo python3 install.py --profile openbanking
```

For a controlled deployment, prefer a frozen or targeted bundle containing only the selected components. A pinned download-only workflow may be used if that installer version supports targeted selection, but avoid an unfiltered nightly download-all run: it may fetch unselected components and fail on unrelated missing artifacts. Preserve its logs, inventory every selected artifact, hash them, and resolve any relevant failure before installation.

Only after the complete selected bundle is present should the downloaded-input path be used:

```bash
cd /opt/dist/jans
sudo python3 ./install.py -use-downloaded -yes --profile openbanking \
  --args="-f /root/openbanking-setup.properties --no-progress"
```

The wrapper extracts Jans setup, applies the Open Banking overlay, passes `--use-downloaded` to the underlying setup, and invokes it. Keep the full wrapper and underlying setup logs root-only.

In the verified RHEL 9.8 run, the download-only phase stopped on an unselected Shibboleth nightly artifact. The selected Auth and Config API artifacts were independently verified, and the underlying setup was then run directly. Treat that as a documented incident recovery, not as the normal installation path.

Do not trust the wrapper's exit code by itself: its child invocation can fail without making the wrapper fail. Installation passes only when the underlying setup log contains:

```text
Janssen Server installation successful!
```

and the expected files, services, and endpoints pass the next section. On the first real exception, stop. Do not blindly rerun after a partial database import.

### 8. Validate the core installation

Start with service, listener, and permission checks:

```bash
systemctl --failed
systemctl status httpd mysqld jans-auth jans-config-api firewalld --no-pager
systemctl is-enabled httpd mysqld jans-auth jans-config-api firewalld
httpd -t
ss -lntup
```

Verify that `jetty` can traverse parent directories and read its environment files, startup files, WAR/JAR/XML files, database configuration, and keystores. Fix only the narrow ownership or mode error; never make the entire tree world-readable or writable.

Then test, through the external hostname:

| Check | Expected result |
|---|---|
| OIDC discovery | HTTP 200; valid JSON; issuer equals `https://FQDN` |
| Public JWKS | HTTP 200; valid JWK set; no private `d` members |
| Config API liveness/readiness | HTTP 200 and `UP` |
| Token without client certificate | TLS/client-auth rejection |
| Registration without client certificate | TLS/client-auth rejection |
| Revocation without client certificate | TLS/client-auth rejection |
| Token with approved mTLS client | HTTP 200 |
| Scoped Config API read | HTTP 200 |
| Revoke token | HTTP 200 |
| Reuse revoked token | HTTP 401 |

The following examples reproduce the public, non-secret checks. Set `ROUTE_IP` to the address reached by the client and use the trusted local or public CA file; do not expose client keys in command history.

```bash
FQDN=FQDN.example.org
ROUTE_IP=192.0.2.10
CA_CERT=/secure/path/test-ca.crt

curl --fail --silent --show-error \
  --resolve "${FQDN}:443:${ROUTE_IP}" --cacert "${CA_CERT}" \
  "https://${FQDN}/.well-known/openid-configuration"

curl --fail --silent --show-error \
  --resolve "${FQDN}:443:${ROUTE_IP}" --cacert "${CA_CERT}" \
  "https://${FQDN}/jans-auth/restv1/jwks"

curl --fail --silent --show-error \
  --resolve "${FQDN}:443:${ROUTE_IP}" --cacert "${CA_CERT}" \
  "https://${FQDN}/jans-config-api/api/v1/health"

# Expected to fail at the TLS/client-certificate boundary.
curl --verbose --resolve "${FQDN}:443:${ROUTE_IP}" --cacert "${CA_CERT}" \
  -X POST "https://${FQDN}/jans-auth/restv1/token"
curl --verbose --resolve "${FQDN}:443:${ROUTE_IP}" --cacert "${CA_CERT}" \
  -X POST "https://${FQDN}/jans-auth/restv1/register"
curl --verbose --resolve "${FQDN}:443:${ROUTE_IP}" --cacert "${CA_CERT}" \
  -X POST "https://${FQDN}/jans-auth/restv1/revoke"
```

Use approved, secret-safe validators for the credential-bearing sequence. On the verified server they are staged in the protected evidence area as `validate_platform_state.py`, `validate_core_openbanking.py`, and `validate_adminui_browser_no_client_cert.py`. Review and parameterize them before use.

Trust the test CA explicitly where possible. If a test temporarily uses `curl -k`, record that server-certificate verification was bypassed; this does not test server identity and must never be confused with client mTLS enforcement.

A public-CA certificate is not required for this test topology. Regenerate a locally issued server certificate containing the FQDN in `subjectAltName`, distribute the local test CA through a secure channel, and configure clients to trust it. The defect in the verified host is the CN-only certificate, not the absence of a public CA.

### 9. Install Admin UI as a separate licensed phase

The Open Banking profile does not install Admin UI. If it is required:

Keep the order exact: install core with the final hashed Open Banking overlay, validate core, install the pinned Flex/Admin UI build, then run the build-specific Admin UI compatibility helper and repeat all validation.

1. Select a Flex/Admin UI build compatible with the pinned Jans commit.
2. Record its version, source commit, signature/checksum, and dependencies.
3. Back up the live Jans setup, database configuration, `/etc/httpd/conf.d/https_jans.conf`, and generated frontend files.
4. Store the Flex SSA as a root-owned `0600` file. Do not pass it to `flex_setup.py`; that installer has no SSA/license argument.
5. Run the compatible Flex installer from its staged directory. The tested command was:

   ```bash
   install -d -m 0700 "$EVIDENCE_DIR/admin-ui/logs"
   cd /opt/jans/jans-setup/flex/flex-linux-setup
   python3 ./flex_setup.py --install-admin-ui --flex-non-interactive \
     --adminui_authentication_mode simple_password_auth \
     > "$EVIDENCE_DIR/admin-ui/logs/flex-admin-ui-install-console.log" 2>&1
   adminui_setup_status=$?
   printf '%s\n' "$adminui_setup_status" \
     > "$EVIDENCE_DIR/admin-ui/logs/flex-admin-ui-install-exit-status"
   ```

6. Inspect both `/opt/jans/jans-setup/logs/flex-setup.log` and `/opt/jans/jans-setup/logs/flex-setup-error.log`; do not trust the exit status alone.
7. Retrieve and activate the license afterward through the Admin UI license API, reading the SSA from its protected file. Keep request/response bodies root-only because they contain license material.
8. Confirm the `/admin/` route, web and backend clients, scopes, role/permission mappings, update-token script, and Config API plugin.
9. Only after the Admin UI asset exists, run the reviewed `apply-adminui-openbanking-compat-v1.py` helper. It must assert the expected old/new frontend patterns and exact build hash or stop. The final overlay does not by itself preserve every runtime mutation.

#### Required Open Banking/Admin UI integration checks

- Verify `staticKid` names an existing RS256 signing key. When generated keys are used, clear a stale value in the live `jansAppConf` JSON, saved `/opt/jans/jans-setup/output/jans-auth/jans-auth-config.json`, and retained setup-properties copies; then restart only `jans-auth`.
- Admin UI backend JWT Authorization headers can exceed 8 KiB. Back up `/etc/httpd/conf.d/https_jans.conf`, its setup template, and `/opt/jans/jetty/jans-config-api/start.d/server.ini`. Place `LimitRequestFieldSize 16384` inside the HTTPS virtual host and set `jetty.httpConfig.requestHeaderSize=16384` in `server.ini`. Run `httpd -t`, reload HTTPD, restart only `jans-config-api`, and verify an authorized request larger than 8 KiB reaches Config API.
- Preserve the Admin UI-facing `/jans-config-api/api/v1/stat` API. Externally proxy `/jans-auth/restv1/internal/stat` to `http://localhost:8081/jans-auth/restv1/internal/stat`; Jans Auth still enforces bearer authorization.
- Ensure the installed `/admin/env-config.js` is web-readable (`0644` in the tested deployment); it contains public endpoint configuration, not secrets. Patch the staged Flex installer so reinstall preserves this mode.
- Preserve discovery metadata needed by the frontend: `userinfo_endpoint`, `end_session_endpoint`, `revocation_endpoint`, and `introspection_endpoint`. Update both live database configuration and saved setup output, then restart `jans-auth`.
- If the role-based update-token script must be installed or enabled, back up its `jansCustomScr` row first.

#### Prevent the post-login `Redirecting...` loop

A browser public client performing authorization-code + PKCE has no client TLS certificate. It will receive HTTP 403 if its code exchange uses an HTTPD location with unconditional `SSLVerifyClient require`.

Use a narrowly scoped, reviewed adapter design:

- Keep the original Open Banking `/jans-auth/restv1/token`, `/jans-auth/restv1/register`, and `/jans-auth/restv1/revoke` routes mTLS-only.
- Add dedicated Admin UI adapter paths without Apache client-certificate enforcement: `/jans-auth/restv1/admin-ui-token` proxies only to `http://localhost:8081/jans-auth/restv1/token`, and `/jans-auth/restv1/admin-ui-revoke` proxies only to `http://localhost:8081/jans-auth/restv1/revoke`.
- Configure only the Admin UI OIDC frontend to use those adapter paths for PKCE exchange and logout.
- Prefer a reviewed source build. If an installed minified asset must be patched, require a timestamped backup plus exact file hash and unique occurrence checks; the generated asset filename is build-specific, so never edit it blindly.
- Do not remove or relax `SSLVerifyClient require` on the original Open Banking routes.

Because this changes a security boundary, require explicit approval, back up every affected file, validate `httpd -t`, and rerun both the browser and Open Banking mTLS test suites. Both adapter URLs are publicly reachable without a client certificate; Jans authorization-code, PKCE, client-credential, token, and grant validation becomes the security boundary there. Compromised credentials for another client could potentially use an adapter to bypass Apache's original mTLS boundary. The original Open Banking URLs remain protected by Apache mTLS.

### 10. Full acceptance test

The installation is complete only after all of the following pass before and after a reboot:

- zero failed systemd units;
- `httpd`, `mysqld`, `jans-auth`, `jans-config-api`, and `firewalld` active and enabled;
- persistent 2 GiB swap and SELinux permissive state;
- valid HTTPD syntax and expected listeners;
- discovery, public JWKS, and Config API health;
- real browser `/admin/` load, login, dashboard, harmless authorized backend read, logout, and session deletion;
- fresh-cookie, no-client-certificate Admin UI PKCE exchange, ID-token validation, UserInfo, backend token, and revocation;
- original Open Banking token/register/revoke rejection without a client certificate;
- mTLS sequence: token `200` -> scoped Config API read `200` -> revoke `200` -> token reuse `401`;
- no private keys, passwords, full tokens, client assertions, or SSA content in shared evidence.

Reboot gate:

```bash
reboot
```

After reconnecting, repeat the service, discovery, JWKS, health, browser, no-certificate, and complete mTLS checks. A pre-reboot pass alone is insufficient.

Run the protected server-side validators after core installation, after Admin UI integration, and again after reboot:

```bash
cd "$EVIDENCE_DIR/admin-ui/stage"
python3 validate_platform_state.py
python3 validate_core_openbanking.py
python3 validate_adminui_browser_no_client_cert.py
```

The core validator must explicitly report token/read/revoke/reuse as `200/200/200/401` and confirm that all three original token/register/revoke endpoints reject clients without a certificate.

### 11. Known issue: SSA dynamic client registration

Do not claim end-to-end Open Banking registration is complete merely because the registration script initializes.

The verified RHEL 9.8 deployment remains blocked for SSA DCR until all of these are available and corrected:

- the matching Open Banking Directory signing key;
- transport PKCS#12 and its securely delivered password;
- the matching truststore;
- an approved TPP mTLS certificate;
- the missing `ScopeService` import in `Registration.py`;
- removal of logging that exposes token responses or complete client-assertion POST data.

After those items are supplied securely, rerun script-load checks and exercise the complete registration path while monitoring sanitized Jans Auth logs.

### 12. Troubleshooting map

| Symptom | Likely cause | Corrective action |
|---|---|---|
| Setup fails rendering HTTPD config | Legacy template selected or undefined FIDO2 variable | Use a reviewed `https_jans.conf.mako` overlay and render-test it before install |
| Wrapper exits `0`, services absent | Child setup failed | Inspect underlying setup logs and require the exact success terminus |
| Public JWKS returns `404` | Open Banking HTTPD overlay omitted the proxy | Add the public JWKS location without changing protected mTLS routes |
| Public revoke returns `404` | RFC 7009 proxy missing | Add the revoke proxy with `SSLVerifyClient require` |
| Registration script import error | Removed `HttpService` class | Review and use the compatible `HttpService2` API/import |
| Signing/token failure | `staticKid` references no generated key | Select an existing RS256 key or clear the stale static value |
| Admin UI request fails with a large header | HTTPD or Jetty header limit is too small | Apply the approved `16384`-byte limit at both boundaries |
| Dashboard statistics fail | Jans Auth statistics proxy absent | Preserve the Config API request path and add its authenticated `/jans-auth/restv1/internal/stat` backend proxy |
| `env-config.js` returns `403` | Root-only generated mode | Make only that public file web-readable; keep secret files protected |
| Admin UI stays on `Redirecting...` | Browser PKCE posts to the mTLS-only token path | Use dedicated Admin UI adapters; retain mTLS on original OB routes |
| Strict client rejects HTTPS | Server certificate has no SAN or CA is untrusted | Install a SAN-bearing certificate and distribute/trust the correct CA |

### 13. Evidence, handoff, and rollback

Keep a root-only evidence directory containing:

- OS and preflight output;
- source commits, download URLs, signatures, and SHA-256 values;
- sanitized installation answers;
- original and corrected overlay manifests;
- configuration backups and a change log;
- setup logs, service states, endpoint summaries, and test result codes;
- pre- and post-reboot validation;
- remaining limitations and untested flows.

Take a VM/provider snapshot immediately before the first mutation. Before each correction, back up the live file, its template or saved-output copy, and affected database rows. On `httpd -t` failure, restore both the live and template copies before any reload. After a partial database import, preserve logs and state; do not rerun or uninstall until the first causal error is understood.

The Jans uninstall operation removes product data and is destructive:

```bash
python3 /opt/jans/jans-setup/install.py -uninstall
```

Run it only with explicit approval and after preserving required evidence and data. Restore backed-up firewall, SELinux, hosts, and HTTPD configuration only when doing so will not strand the operator.

### Appendix A: verified test-host artifacts

These values document one successful RHEL 9.8 nightly installation. They are audit references, not automatically approved inputs for another server.

| Reference | Value |
|---|---|
| Pinned Jans source commit | `e8f0f0b69f8a4f70c01590dce14ea23cdff31ab3` |
| Pinned Flex source commit | `9da594e183f59f92f50cc8feda8845d0d5081c9a` |
| Pinned Jans archive | `fdf6a3a3a4200ee2cb882e840b28d322291d3294ccc2302530d7d5439493e890` |
| `install.py` | `51e2c4c6ca2ea376a68d4417541644293affff4d59a47b9d783ad3542ed6cc5f` |
| Final Open Banking/Admin UI overlay, `/opt/dist/jans/openbanking.v5.zip` | `0b332d22bbbd7a7fbf15461bd2f5b42e81ef83b9ace2e7057955eeb4b6ca4380` |
| Admin UI compatibility helper, `/opt/dist/jans/apply-adminui-openbanking-compat-v1.py` | `3f5c49858346feb42f1da2f932014970d264836090c70771ac55332f2e69a29f` |
| Admin UI nightly build | `c2929a9886956b663d4c2883c88bb64da139f4f1c3661bd93e84305b68ff96b9` |
| Flex setup used for Admin UI | `45433eaabb115dd131645d994121c88bef87f550898552b2e02bc6198dd0064b` |

The verified host used a client hosts entry for `54.213.215.176 testobrhel9.gluu.info`; public DNS did not point at it. Its generated server certificate was CN-only without a SAN. Rotate the administrator password during handoff because it appeared in collaboration history; the password itself is intentionally absent from this guide.

[Back to contents](#contents)

---

<a id="ubuntu-2404"></a>

## 2. Ubuntu 24.04

This guide installs Gluu Flex Open Banking on Ubuntu 24.04 LTS using
the command-line installer that ships with the distribution.
The process requires no prior configuration outside of standard VM,
networking, and DNS preparation.
It covers certificates, software installation, Admin UI integration,
and a comprehensive post-installation acceptance checklist.

!!! warning "Not recommended for production deployments"

    VM installation is suitable only for
    development, QA, interoperability testing, or demonstrations. For
    production deployments please use the [cloud-native distribution](./install-cn.md)

### Installation at a glance

Steps in this guide installs the following software components.

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

At a high-level, following steps are involved in installation of Gluu Flex Open Banking on Ubuntu VM.

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

### Prerequisites

#### Hardware recommendation

Prepare a fresh Ubuntu 24.04 LTS x86-64 VM with following hardware configuration:

| Category    | CPU units | RAM  | Disk size | Swap size |
| ----------- | --------- | ---- | --------- | --------- |
| Minimum     | 2 vCPUs   | 4 GB | 50 GB     | 2 GB      |
| Recommended | 4 vCPUs   | 8 GB | 100 GB    | 2 GB      |

#### Networking recommendations

Followig are the recommendations for network connectivity from the VM:

- One stable public IP address
- Working outbound HTTPS access
- Inbound TCP 443 from intended clients
- Inbound TCP 22 restricted to administrator IP addresses
- TCP 80 only if needed for certificate issuance or redirecting to HTTPS
- Do not expose ports 8074, 8081, or 3306 publicly.

### DNS Setup

Create an `A` record before installation:

``` text
id.example.org  ->  203.0.113.10
```

Confirm it from a machine outside the VM:

``` bash
dig +short id.example.org A
```

The result must be the VM's stable public IP. The hostname must not change after installation.

### Flex license and SSA

Obtain a Software Statement Assertion (SSA) for the Flex license and save it as a text file in a protected location. The Admin UI will request it during initial activation. Treat the SSA as sensitive.

### Open Banking keys and certificates

For production, obtain the certificates required by the applicable Open Banking trust framework. For a private QA environment, this guide shows how to create a private test CA, server certificate, and client certificate.

Never use the same subject or Common Name for the CA, server, and client certificates. A safe pattern is:

| Certificate  | Example Common Name    | Purpose                      |
| ------------ | ---------------------- | ---------------------------- |
| Test root CA | `Flex OB Test Root CA` | Signs test certificates      |
| HTTPS server | `id.example.org`       | Apache server identity       |
| Test client  | `ob-test-client-01`    | Browser or TPP mTLS identity |

### Prepare Ubuntu

Log in using an administrative account and define values for this deployment:

``` bash
FQDN=id.example.org
PUBLIC_IP=203.0.113.10
JANS_VERSION=2.3.0
FLEX_VERSION=6.3.0
OPENBANKING_PROFILE_VERSION=6.3.0-1
COSIGN_VERSION=3.1.2
COSIGN_DEB_SHA256=f458f6bd2f3d11ac803ec0dba31c836a82364bcd3a5a09e2aa6adef57a0f7d1b
CERT_DIR=/etc/certs/ob
```

Update the host and install basic tools:

``` bash
sudo apt update
sudo apt -y full-upgrade
sudo apt install -y curl wget jq unzip ca-certificates openssl chrony
sudo systemctl enable --now chrony
```

If the upgrade installs a new kernel, reboot now and reconnect before continuing.

Set the hostname:

``` bash
sudo hostnamectl set-hostname "$FQDN"
hostnamectl
```

Make sure `/etc/hosts` contains the private interface address and FQDN. Do not map the FQDN only to `127.0.0.1`.

If the VM has less than 2 GB swap, create a swap file:

``` bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

Configure the firewall:

``` bash
sudo ufw allow 443/tcp
sudo ufw allow from YOUR_ADMIN_IP to any port 22 proto tcp
sudo ufw enable
sudo ufw status verbose
```

Replace `YOUR_ADMIN_IP` before enabling UFW. Keep the current SSH session open until a second SSH login succeeds.

Open TCP port 80 only if the selected certificate issuer needs an HTTP challenge or Apache will redirect HTTP to HTTPS:

``` bash
sudo ufw allow 80/tcp
```

Otherwise, omit that rule and leave TCP port 80 closed.

### Install Sigstore

The Jans and Flex release packages are signed with Sigstore. Install the pinned `cosign` package before downloading either product package:

``` bash
cd /tmp
wget "https://github.com/sigstore/cosign/releases/download/v${COSIGN_VERSION}/cosign_${COSIGN_VERSION}_amd64.deb"

echo "${COSIGN_DEB_SHA256}  cosign_${COSIGN_VERSION}_amd64.deb" \
  | sha256sum --check

sudo apt install -y "/tmp/cosign_${COSIGN_VERSION}_amd64.deb"
cosign version
```

The checksum is the SHA-256 digest published for the `v3.1.2` GitHub release asset. Do not continue unless `sha256sum` reports `OK` and `cosign version` reports `v3.1.2`. When updating `COSIGN_VERSION`, obtain the new digest independently from the official Sigstore release page and update both values together.

### Install Janssen Open Banking

Flex 6.3.0 corresponds to Janssen 2.3.0. Always confirm the compatible versions on the release pages before using newer versions.

The official Open Banking VM workflow runs Jans setup with `--profile openbanking`. Install the versioned, signed release package instead of downloading a Python installer from a mutable source branch:

``` bash
cd /tmp
wget "https://github.com/JanssenProject/jans/releases/download/v${JANS_VERSION}/jans_${JANS_VERSION}-stable.ubuntu24.04_amd64.deb"
wget "https://github.com/JanssenProject/jans/releases/download/v${JANS_VERSION}/jans-ubuntu24-${JANS_VERSION}-stable.bundle"

cosign verify-blob \
  --bundle "jans-ubuntu24-${JANS_VERSION}-stable.bundle" \
  --certificate-identity-regexp 'https://github.com/JanssenProject/jans' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  "jans_${JANS_VERSION}-stable.ubuntu24.04_amd64.deb"

sudo apt install -y "/tmp/jans_${JANS_VERSION}-stable.ubuntu24.04_amd64.deb"
sudo python3 /opt/jans/jans-setup/install.py \
  --profile openbanking \
  --setup-branch "v${JANS_VERSION}" \
  --openbanking-setup-branch "v${OPENBANKING_PROFILE_VERSION}"
```

Do not install the package unless `cosign` reports `Verified OK`. This verification binds the installer to the Janssen release workflow rather than merely calculating a checksum for an untrusted download. The setup command also pins both source overlays to release tags that match Flex 6.3.0. The Open Banking profile is in a private Gluu repository, so the installer prompts for an authorized GitHub token; enter it only at the prompt, never as a command-line argument or shell-history entry.

The profile asks for:

- VM IP and FQDN
- Certificate subject information
- Maximum application memory
- MySQL persistence
- An Open Banking static `kid`
- Whether an external Open Banking signing key will be used
- Confirmation before it writes the configuration

If you supply an external private key, copy it to a root-only directory and set mode `600` before setup. Never paste the private key or its password into a ticket, chat, or shared log.

Enter values appropriate to your environment for the following inputs:

| Prompt                    | Recommended value                                       |
| ------------------------- | ------------------------------------------------------- |
| IP address                | The VM interface address requested by the installer     |
| Hostname                  | `id.example.org`                                        |
| Organization details      | Your real organization details                          |
| Application memory        | `4096` MB on an 8 GB VM                                 |
| Persistence               | MySQL                                                   |
| Remote database           | No for this single-node guide                           |
| Open Banking static `kid` | A unique identifier matching the signing-key plan       |
| External Open Banking key | Yes only when a protected key has already been prepared |
| Jans Auth                 | Yes                                                     |
| Config API                | Yes                                                     |
| Jans CLI/TUI              | Yes                                                     |
| FIDO2                     | Yes if required                                         |
| SCIM, Casa, Link, Lock    | Only when required                                      |
| Admin password            | A unique password from a password manager               |

Let setup finish completely and the Java service start. First startup may take several minutes.

Logs can be monitored at:

``` text
/opt/jans/jans-setup/logs/setup.log
```

### Verify the base installation

Before adding Flex Admin UI, confirm that the base services are healthy:

``` bash
sudo systemctl is-active apache2 mysql jans-auth jans-config-api
curl -fsS "https://${FQDN}/.well-known/openid-configuration" \
  --cacert /path/to/current/issuing-ca.crt | jq '.issuer, .token_endpoint, .jwks_uri'
```

If the generated HTTPS certificate is only temporary, complete Section 8 before expecting browser validation to succeed. Do not continue to Admin UI while Jans Auth or Config API is inactive.

### Install Gluu Flex and Admin UI

Download and verify the stable Flex package:

``` bash
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

``` bash
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py
```

Answer `y` to `Install Admin UI`. Install Casa only if it is part of the design.

The Flex setup log is:

``` text
/opt/jans/jans-setup/logs/flex-setup.log
```

Flex setup installs the Admin UI static application, Admin UI Config API plugin, OIDC clients, scopes and role mappings, the default Cedarling policy store, and the Agama password flow used by the UI.

### Configure certificates

Skip test-certificate generation if you have real certificates.

#### Create a private test CA

``` bash
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

#### Create the HTTPS server certificate with SAN

The Subject Alternative Name is mandatory for modern browsers. A correct Common Name alone is insufficient.

``` bash
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

``` bash
openssl verify -CAfile "$CERT_DIR/ca.crt" "$CERT_DIR/server.crt"
openssl x509 -in "$CERT_DIR/server.crt" -noout -subject -issuer -dates -ext subjectAltName
openssl verify -CAfile "$CERT_DIR/ca.crt" -verify_hostname "$FQDN" "$CERT_DIR/server.crt"
```

All three commands must succeed, and the SAN must contain the FQDN.

#### Create a test mTLS client certificate

``` bash
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

#### Configure Apache mTLS

Back up the vhost:

``` bash
sudo a2enmod ssl headers proxy proxy_http
sudo cp -a /etc/apache2/sites-enabled/https_jans.conf \
  "/etc/apache2/sites-enabled/https_jans.conf.before-ob-mtls"
```

Ensure the HTTPS virtual host contains:

``` apache
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
    SSLOptions -StdEnvVars +ExportCertData
    RequestHeader set X-ClientCert "%{SSL_CLIENT_CERT}s"
    ProxyPass http://127.0.0.1:8081/jans-auth/restv1/register
    ProxyPassReverse http://127.0.0.1:8081/jans-auth/restv1/register
</Location>

<Location /jans-auth/restv1/token>
    SSLVerifyClient require
    SSLOptions -StdEnvVars +ExportCertData
    RequestHeader set X-ClientCert "%{SSL_CLIENT_CERT}s"
    ProxyPass http://127.0.0.1:8081/jans-auth/restv1/token
    ProxyPassReverse http://127.0.0.1:8081/jans-auth/restv1/token
</Location>
```

Keep the proxy routes generated by the installer; do not replace the whole file with this fragment. Ensure Apache's `ssl`, `headers`, `proxy`, and `proxy_http` modules are enabled. `RequestHeader set` overwrites any client-supplied `X-ClientCert` value with the certificate that Apache validated during the TLS handshake.

The repaired reference profile explicitly allowed TLS 1.2. Enable TLS 1.3 only when the selected Open Banking profile, Flex/Jans release, and interoperability test suite support it.

Validate and reload:

``` bash
sudo apache2ctl configtest
sudo systemctl reload apache2
sudo systemctl is-active apache2
```

If the Admin UI performs its token exchange directly from the browser against an mTLS-required token endpoint, that browser must present a valid client certificate. A production design may instead use a dedicated mTLS alias or backend-mediated exchange; align this with the relevant Open Banking profile.

### Trust the issuing CA in Java

Jans Auth and Config API use the Java trust store when calling HTTPS endpoints. Import the issuing CA, not the server leaf certificate. Importing a leaf certificate creates a fragile pin that breaks whenever the server certificate is renewed.

Back up the trust store:

``` bash
sudo cp -a /opt/jre/lib/security/cacerts \
  "/opt/jre/lib/security/cacerts.before-ob-ca"
```

Replace any stale alias and import the CA:

``` bash
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

``` bash
openssl x509 -in "$CERT_DIR/ca.crt" -noout -fingerprint -sha256
```

Restart the Java services:

``` bash
sudo systemctl restart jans-auth jans-config-api
```

### Admin UI configuration checks

#### Use loopback for the backend's own introspection call

On a single-node VM, the Admin UI backend can introspect its token through the local Jans Auth listener. This avoids sending an internal call back through public Apache mTLS and prevents a certificate trust loop.

First inspect the current Admin UI configuration. Do not print the entire record because it contains client secrets.

``` bash
sudo mysql -N jansdb -e "
SELECT JSON_UNQUOTE(JSON_EXTRACT(jansConfApp,
'$.oidcConfig.auiBackendApiClient.introspectionEndpoint'))
FROM jansAppConf WHERE doc_id='admin-ui';"
```

For the single-node topology, the expected value is:

``` text
http://127.0.0.1:8081/jans-auth/restv1/introspection
```

If it is still the public HTTPS URL and `adminui.log` reports a PKIX error, back up and update only this field:

``` bash
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

#### Ensure discovery advertises `userinfo_endpoint`

Check discovery without displaying sensitive data:

``` bash
curl -fsS "https://${FQDN}/.well-known/openid-configuration" \
  --cacert "$CERT_DIR/ca.crt" \
  | jq '{issuer,authorization_endpoint,token_endpoint,userinfo_endpoint,introspection_endpoint,jwks_uri}'
```

Every displayed field must be a non-null URL. If `userinfo_endpoint` is absent, the Admin UI may finish the authorization callback and then request `/jans-config-api/`, which returns 404.

For affected nightly builds only, back up and add the discovery key:

``` bash
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

### Start and verify the system

Enable and restart the core services:

``` bash
sudo systemctl enable apache2 mysql jans-auth jans-config-api
sudo systemctl restart mysql jans-auth jans-config-api apache2
sudo systemctl is-active apache2 mysql jans-auth jans-config-api
```

Every result must be `active`.

Confirm private listeners:

``` bash
sudo ss -lntp | grep -E ':(443|8074|8081|3306)\b'
```

Expected topology:

- Apache listens publicly on 443.
- Jans Config API listens on `127.0.0.1:8074`.
- Jans Auth listens on `127.0.0.1:8081`.
- MySQL listens on `127.0.0.1:3306`.

Check the public endpoints:

``` bash
curl -fsSI "https://${FQDN}/admin/" --cacert "$CERT_DIR/ca.crt"
curl -fsS "https://${FQDN}/.well-known/openid-configuration" \
  --cacert "$CERT_DIR/ca.crt" | jq -e '.issuer and .token_endpoint and .userinfo_endpoint'
curl -fsS "https://${FQDN}/jans-auth/restv1/jwks" \
  --cacert "$CERT_DIR/ca.crt" | jq -e '.keys | length > 0'
```

Check that both protected endpoints require mTLS. Requests without a client certificate should fail at TLS or return an authorization error; they must not reach a successful registration or token response:

``` bash
curl -v "https://${FQDN}/jans-auth/restv1/register" \
  --cacert "$CERT_DIR/ca.crt"
curl -v "https://${FQDN}/jans-auth/restv1/token" \
  --cacert "$CERT_DIR/ca.crt"
```

Then test both routes with the client certificate:

``` bash
curl -v "https://${FQDN}/jans-auth/restv1/register" \
  --cacert "$CERT_DIR/ca.crt" \
  --cert /path/to/client.crt \
  --key /path/to/client.key
curl -v "https://${FQDN}/jans-auth/restv1/token" \
  --cacert "$CERT_DIR/ca.crt" \
  --cert /path/to/client.crt \
  --key /path/to/client.key
```

An OAuth or registration error caused by the deliberately incomplete request is acceptable for this connectivity test. The important result is that TLS accepts the client certificate and both requests reach Jans Auth. Confirm in the Jans Auth log that the forwarded certificate was parsed; do not log or publish the certificate itself.

### Activate and access Admin UI

1. Import the test CA into the browser's trust store if the HTTPS certificate is privately issued.
2. Import `client.p12` into the browser or operating-system client certificate store.
3. Open `https://id.example.org/admin/`.
4. Select the mTLS certificate when the browser asks.
5. Upload or paste the SSA only in the Flex activation screen.
6. Sign in as `admin` with the administrator password set during Jans setup.
7. Confirm that the page displays the dashboard and the administrator identity.

The installer creates a default policy store with an `admin` role and assigns that role to the default administrator.

### Troubleshooting Admin UI

#### Fast diagnostic commands

``` bash
sudo systemctl --no-pager --full status apache2 jans-auth jans-config-api mysql
sudo journalctl -u jans-auth -u jans-config-api --since '15 minutes ago' --no-pager
sudo tail -n 200 /var/log/apache2/error.log
sudo tail -n 200 /var/log/apache2/access.log
sudo tail -n 200 /var/log/adminui/adminui.log
```

Do not post raw logs publicly until access tokens, client secrets, authorization codes, cookies, SSAs, email addresses, and certificate subjects have been redacted.

#### Symptom matrix

| Symptom                                                                             | Likely cause                                                          | Check                                              | Correction                                                                              |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Browser stays on **Redirecting…**                                                   | TLS or client-certificate failure                                     | Apache error log and browser certificate selection | Confirm server SAN, client certificate chain, clientAuth EKU, and trusted CA            |
| Apache logs `certificate unknown`                                                   | Browser rejected the server chain or Apache rejected the client chain | `openssl verify` for both leaf certificates        | Install the correct CA; never give CA, server, and client the same subject              |
| Admin UI API returns HTTP 500 and `adminui.log` shows `PKIX path validation failed` | Java trust store contains an old server leaf or lacks the issuing CA  | `keytool -list` and CA SHA-256 fingerprint         | Delete stale leaf alias, import the issuing CA, restart Config API                      |
| OAuth callback succeeds, then browser requests `/jans-config-api/` and receives 404 | Discovery omitted `userinfo_endpoint`                                 | Inspect `.well-known/openid-configuration`         | Add `userinfo_endpoint` to allowed discovery keys on affected builds, restart Jans Auth |
| Token request fails before OAuth validation                                         | Browser did not send a client certificate                             | Apache SSL debug log                               | Import the PKCS#12 bundle and select it when prompted                                   |
| Admin UI asks for activation or rejects access                                      | SSA or license missing/invalid                                        | Admin UI license page and Admin UI log             | Obtain a valid SSA for this installation; verify clock and outbound HTTPS               |
| `/admin/` is 200 but dashboard API calls fail                                       | Config API or Admin UI plugin problem                                 | `jans-config-api` status and `adminui.log`         | Verify plugin installation, database configuration, and Config API listener             |
| Works with `curl -k` only                                                           | Server certificate is untrusted or invalid                            | `openssl s_client` and SAN output                  | Install a valid chain; do not use `-k` as a permanent fix                               |

#### Certificate diagnostics

``` bash
openssl s_client -connect "${FQDN}:443" -servername "$FQDN" \
  -CAfile "$CERT_DIR/ca.crt" -verify_return_error </dev/null

openssl x509 -in "$CERT_DIR/server.crt" -noout \
  -subject -issuer -dates -fingerprint -sha256 -ext subjectAltName

openssl verify -CAfile "$CERT_DIR/ca.crt" -verify_hostname "$FQDN" \
  "$CERT_DIR/server.crt"
```

#### Important log locations

| Component           | Location                                   |
| ------------------- | ------------------------------------------ |
| Base installer      | `/opt/jans/jans-setup/logs/setup.log`      |
| Flex installer      | `/opt/jans/jans-setup/logs/flex-setup.log` |
| Admin UI backend    | `/var/log/adminui/adminui.log`             |
| Apache access/error | `/var/log/apache2/`                        |
| Jans Auth           | `/opt/jans/jetty/jans-auth/logs/`          |
| Jans Config API     | `/opt/jans/jetty/jans-config-api/logs/`    |
| Systemd services    | `journalctl -u SERVICE`                    |

### Backup before changes

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

``` bash
sudo apt install -y age

sudo bash -Eeuo pipefail <<'BACKUP'
BACKUP_DIR=/var/backups/flex
BACKUP_RECIPIENT='age1REPLACE_WITH_OFFLINE_RECOVERY_PUBLIC_KEY'
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
PLAIN_ARCHIVE="${BACKUP_DIR}/.jansdb-${STAMP}.sql.gz"
ENCRYPTED_ARCHIVE="${BACKUP_DIR}/jansdb-${STAMP}.sql.gz.age"

install -d -m 700 "$BACKUP_DIR"
trap 'rm -f "$PLAIN_ARCHIVE"' EXIT

mysqldump --single-transaction --routines --triggers jansdb \
  | gzip -c >"$PLAIN_ARCHIVE"
gzip --test "$PLAIN_ARCHIVE"
age --recipient "$BACKUP_RECIPIENT" \
  --output "$ENCRYPTED_ARCHIVE" "$PLAIN_ARCHIVE"
chmod 600 "$ENCRYPTED_ARCHIVE"
BACKUP
```

Generate the age recovery key on a separate, protected administrator system with `age-keygen`; store the secret key in an offline secrets manager or encrypted recovery vault. Put only its `age1...` public recipient in the VM script. Never copy the recovery secret key to the production VM.

Before considering a backup complete or deleting an older known-good backup, transfer the encrypted archive to the isolated recovery environment and test both decryption and restoration into an empty test database:

``` bash
age --decrypt --identity /secure/offline/flex-backup-key.txt \
  jansdb-YYYYMMDDTHHMMSSZ.sql.gz.age \
  | gzip --decompress --stdout \
  | mysql jansdb_restore_test

mysql --database=jansdb_restore_test --execute='SHOW TABLES;'
```

The `pipefail` option makes a failure in `mysqldump`, `gzip`, `age`, or the restore pipeline fail the operation. Keep encrypted backups outside the VM according to the applicable retention policy, and record each successful restore test without recording database contents or key material.

### Routine operations

Service health:

``` bash
sudo systemctl is-active apache2 mysql jans-auth jans-config-api
```

Admin UI update:

``` bash
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

### Uninstallation

Uninstallation is destructive and removes application data. Take and verify backups first.

Remove Flex components:

``` bash
sudo python3 /opt/jans/jans-setup/flex/flex-linux-setup/flex_setup.py --remove-flex
```

Remove Janssen:

``` bash
sudo python3 /opt/jans/jans-setup/install.py -uninstall
```

### Final acceptance checklist

After the complete installation, we recommend checking the following aspects to ensure smooth operation:

- :white_check_mark: Stable public IP and FQDN are correct.
- :white_check_mark: Host time is synchronized.
- :white_check_mark: Only 22, 80 when needed, and 443 are publicly reachable.
- :white_check_mark: MySQL, Jans Auth, and Config API listen only on protected interfaces.
- :white_check_mark: Server certificate validates for the FQDN and contains SAN.
- :white_check_mark: CA, server, and client certificate subjects are distinct.
- :white_check_mark: Client certificate contains the `clientAuth` EKU.
- :white_check_mark: Apache configuration test passes.
- :white_check_mark: Required services report `active`.
- :white_check_mark: Discovery contains issuer, authorization, token, userinfo, introspection, and JWKS endpoints.
- :white_check_mark: JWKS contains at least one key.
- :white_check_mark: Token and registration endpoints enforce mTLS as intended.
- :white_check_mark: Java trusts the issuing CA, not a renewable leaf.
- :white_check_mark: Admin UI loads, license/SSA is active, and the administrator can sign in.
- :white_check_mark: Backups are encrypted, stored off-host, and restoration has been tested.


### Reference documentation

- [Install Gluu Flex on Ubuntu Linux](https://docs.gluu.org/head/install/vm-install/ubuntu/)
- [Admin UI](https://docs.gluu.org/stable/admin/admin-ui/home/)
- [Flex releases](https://github.com/GluuFederation/flex/releases)
- [Ubuntu Janssen installation](https://docs.jans.io/head/janssen-server/install/vm-install/ubuntu/)
- [mTLS configuration](https://docs.jans.io/head/janssen-server/auth-server/oauth-features/mtls/)
- [Janssen releases](https://github.com/JanssenProject/jans/releases)

[Back to contents](#contents)
