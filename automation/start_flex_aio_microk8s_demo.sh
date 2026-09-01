#!/bin/bash
set -eo pipefail

# get script directory
basedir=$(dirname "$(readlink -f -- "$0")")

GLUU_FQDN=$1
GLUU_PERSISTENCE=$2
GLUU_VERSION=$3
EXT_IP=$4
GLUU_CI_CD_RUN=$5

if [[ ! "$GLUU_FQDN" ]]; then
  read -rp "Enter Hostname [demoexample.gluu.org]:                           " GLUU_FQDN
fi
if ! [[ $GLUU_FQDN =~ ^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?){2,}$ ]]; then
  echo "[E] Hostname provided is invalid or empty.
    Please enter a FQDN with the format demoexample.gluu.org"
  exit 1
fi
if [[ ! "$GLUU_PERSISTENCE" ]]; then
  read -rp "Enter persistence type [MYSQL|PGSQL]:                            " GLUU_PERSISTENCE
fi
if [[ $GLUU_PERSISTENCE != "MYSQL" ]] && [[ $GLUU_PERSISTENCE != "PGSQL" ]]; then
  echo "[E] Incorrect entry. Please enter either MYSQL or PGSQL"
  exit 1
fi
if [[ -z $GLUU_VERSION ]]; then
  GLUU_VERSION="0.0.0-nightly"
fi

LOG_TARGET="FILE"
LOG_LEVEL="TRACE"
TEST_ENVIRONMENT="true"
if [[ -z $GLUU_CI_CD_RUN ]]; then
  LOG_TARGET="STDOUT"
  LOG_LEVEL="INFO"
  TEST_ENVIRONMENT="false"
fi

if [[ -z $EXT_IP ]]; then
  EXT_IP=$(curl --silent --max-time 10 ipinfo.io/ip || true)
  if [[ -z "$EXT_IP" ]]; then
    echo "[E] Unable to determine external IP. Please provide it as the 4th argument."
    exit 1
  fi
fi

sudo apt-get update
sudo snap install microk8s --classic
sudo microk8s.status --wait-ready
sudo microk8s.enable dns ingress hostpath-storage helm3
mkdir -p "$HOME/.kube"
chmod 700 "$HOME/.kube"
sudo microk8s config | sudo install -m 0600 /dev/stdin "$HOME/.kube/config"
sudo snap alias microk8s.kubectl kubectl
sudo snap alias microk8s.helm3 helm
KUBECONFIG="$HOME/.kube/config"
sudo microk8s.kubectl create namespace gluu --kubeconfig="$KUBECONFIG" || echo "namespace exists"

if [[ $GLUU_PERSISTENCE == "MYSQL" ]]; then
  DB_MANIFEST="mysql.yaml"
  DB_DIALECT="mysql"
  DB_HOST="mysql.gluu.svc"
  DB_PORT=3306
  DB_USER="root"
else
  DB_MANIFEST="pgsql.yaml"
  DB_DIALECT="pgsql"
  DB_HOST="postgresql.gluu.svc"
  DB_PORT=5432
  DB_USER="postgres"
fi

if [[ ! -f "$basedir/$DB_MANIFEST" ]]; then
  sudo wget "https://raw.githubusercontent.com/GluuFederation/flex/nightly/automation/$DB_MANIFEST" -O "$basedir/$DB_MANIFEST"
fi
sudo microk8s.kubectl apply -f "$basedir/$DB_MANIFEST" --kubeconfig="$KUBECONFIG"

cat << EOF > override.yaml
fqdn: $GLUU_FQDN
lbIp: $EXT_IP
isFqdnRegistered: false
adminPassword: Test1234#
testEnvironment: $TEST_ENVIRONMENT
configmap:
  cnSqlDbName: gluu
  cnSqlDbPort: $DB_PORT
  cnSqlDbDialect: $DB_DIALECT
  cnSqlDbHost: $DB_HOST
  cnSqlDbUser: $DB_USER
  cnSqlDbTimezone: UTC
  cnSqldbUserPassword: Test1234#
image:
  repository: ghcr.io/gluufederation/flex/flex-all-in-one
  tag: $GLUU_VERSION
auth-server:
  appLoggers:
    authLogTarget: "$LOG_TARGET"
    authLogLevel: "$LOG_LEVEL"
config-api:
  appLoggers:
    configApiLogTarget: "$LOG_TARGET"
    configApiLogLevel: "$LOG_LEVEL"
  adminUiAppLoggers:
    adminUiLogTarget: "$LOG_TARGET"
    adminUiLogLevel: "$LOG_LEVEL"
    adminUiAuditLogTarget: "$LOG_TARGET"
    adminUiAuditLogLevel: "$LOG_LEVEL"
fido2:
  appLoggers:
    fido2LogTarget: "$LOG_TARGET"
    fido2LogLevel: "$LOG_LEVEL"
  ingress:
    fido2ConfigEnabled: true
    fido2Enabled: true
scim:
  appLoggers:
    scimLogTarget: "$LOG_TARGET"
    scimLogLevel: "$LOG_LEVEL"
  ingress:
    scimConfigEnabled: true
    scimEnabled: true
casa:
  ingress:
    casaEnabled: true
nginx-ingress:
  ingress:
    ingressClassName: public
EOF
sudo helm repo add gluu-flex https://docs.gluu.org/charts
sudo helm repo update
sudo helm install flex gluu-flex/gluu-all-in-one -n gluu -f override.yaml --kubeconfig="$KUBECONFIG" --version="$GLUU_VERSION"

cat << 'EOF' > testendpoints.sh
#!/bin/bash
set -euo pipefail
FQDN="$1"
KUBECONFIG=$(mktemp)
chmod 600 "$KUBECONFIG"
trap 'rm -f "$KUBECONFIG"' EXIT
sudo microk8s config > "$KUBECONFIG"
export KUBECONFIG
echo -e "Testing openid-configuration endpoint.. \n"
curl --fail --silent --show-error -k "https://$FQDN/.well-known/openid-configuration"
echo -e "Testing scim-configuration endpoint.. \n"
curl --fail --silent --show-error -k "https://$FQDN/.well-known/scim-configuration"
echo -e "Testing fido2-configuration endpoint.. \n"
curl --fail --silent --show-error -k "https://$FQDN/.well-known/fido2-configuration"
echo -e "Testing Admin UI endpoint.. \n"
curl --fail --silent --show-error -k -o /dev/null "https://$FQDN/admin"
EOF
echo "Waiting for Gluu Flex all-in-one to come up. Please do not cancel out. This can take up to 10 minutes."
sudo microk8s.kubectl -n gluu wait --for=condition=available --timeout=600s deploy/flex-gluu-all-in-one --kubeconfig="$KUBECONFIG" || echo "all-in-one deployment is not ready. Running tests anyways..."
sudo bash testendpoints.sh "$GLUU_FQDN"
echo -e "You may re-execute 'sudo bash testendpoints.sh $GLUU_FQDN' to do a quick test to check the openid-configuration endpoint."
echo -e "Add '$EXT_IP $GLUU_FQDN' to your /etc/hosts file if the FQDN is not registered, then browse to https://$GLUU_FQDN/admin"
