#!/bin/bash
set -eo pipefail
GLUU_FQDN=$1
GLUU_PERSISTENCE=$2
GLUU_VERSION=$3
EXT_IP=$4
GLUU_CI_CD_RUN=$5
INSTALL_ISTIO=$6
if [[ ! "$GLUU_FQDN" ]]; then
  read -rp "Enter Hostname [demoexample.gluu.org]:                           " GLUU_FQDN
fi
if ! [[ $GLUU_FQDN == *"."*"."* ]]; then
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
  GLUU_VERSION="5.13.0"
fi
LOG_TARGET="FILE"
LOG_LEVEL="TRACE"
if [[ -z $GLUU_CI_CD_RUN ]]; then
  LOG_TARGET="STDOUT"
  LOG_LEVEL="INFO"
fi

if [[ -z $EXT_IP ]]; then
  EXT_IP=$(curl ipinfo.io/ip)
fi

sudo apt-get update
sudo snap install microk8s --classic
sudo microk8s.status --wait-ready
sudo microk8s.enable dns registry ingress hostpath-storage helm3
sudo microk8s kubectl get daemonset.apps/nginx-ingress-microk8s-controller -n ingress -o yaml | sed -s "s@ingress-class=public@ingress-class=nginx@g" | microk8s kubectl apply -f -
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install net-tools
sudo apt-get install docker-ce docker-ce-cli containerd.io -y
sudo microk8s config | sudo tee ~/.kube/config > /dev/null
sudo snap alias microk8s.kubectl kubectl
sudo snap alias microk8s.helm3 helm
KUBECONFIG=~/.kube/config
sudo microk8s.kubectl create namespace gluu --kubeconfig="$KUBECONFIG" || echo "namespace exists"

if [[ $INSTALL_ISTIO == "true" ]]; then
  sudo microk8s.kubectl label ns gluu istio-injection=enabled
  sudo curl -L https://istio.io/downloadIstio | sh -
  cd istio-*
  export PATH=$PWD/bin:$PATH
  sudo ./bin/istioctl install --set profile=demo -y
  cd ..
fi

PERSISTENCE_TYPE="sql"
if [[ $GLUU_PERSISTENCE == "MYSQL" ]]; then
  sudo microk8s.kubectl get po --kubeconfig="$KUBECONFIG"
  sudo helm install my-release --set auth.rootPassword=Test1234#,auth.database=gluu -n gluu oci://registry-1.docker.io/bitnamicharts/mysql --kubeconfig="$KUBECONFIG"
  cat << EOF > override.yaml
config:
  countryCode: US
  email: team@gluu.org
  orgName: Gluu
  city: Austin
  configmap:
    cnSqlDbName: gluu
    cnSqlDbPort: 3306
    cnSqlDbDialect: mysql
    cnSqlDbHost: my-release-mysql.gluu.svc
    cnSqlDbUser: root
    cnSqlDbTimezone: UTC
    cnSqldbUserPassword: Test1234#
EOF
fi
if [[ $GLUU_PERSISTENCE == "PGSQL" ]]; then
  sudo microk8s.kubectl get po --kubeconfig="$KUBECONFIG"
  sudo helm install my-release --set auth.postgresPassword=Test1234#,auth.database=gluu -n gluu oci://registry-1.docker.io/bitnamicharts/postgresql --kubeconfig="$KUBECONFIG"
  cat << EOF > override.yaml
config:
  countryCode: US
  email: team@gluu.org
  orgName: Gluu
  city: Austin
  configmap:
    cnSqlDbName: gluu
    cnSqlDbPort: 5432
    cnSqlDbDialect: pgsql
    cnSqlDbHost: my-release-postgresql.gluu.svc
    cnSqlDbUser: postgres
    cnSqlDbTimezone: UTC
    cnSqldbUserPassword: Test1234#
EOF
fi
echo "$EXT_IP $GLUU_FQDN" | sudo tee -a /etc/hosts > /dev/null
cat << EOF >> override.yaml
global:
  cloud:
    testEnviroment: true
  istio:
    enable: $INSTALL_ISTIO
  cnPersistenceType: $PERSISTENCE_TYPE
  admin-ui:
    ingress:
      adminUiEnabled: true
  auth-server-key-rotation:
    enabled: true
  auth-server:
    appLoggers:
      authLogTarget: "$LOG_TARGET"
      authLogLevel: "$LOG_LEVEL"
      httpLogTarget: "$LOG_TARGET"
      httpLogLevel: "$LOG_LEVEL"
      persistenceLogTarget: "$LOG_TARGET"
      persistenceLogLevel: "$LOG_LEVEL"
      persistenceDurationLogTarget: "$LOG_TARGET"
      persistenceDurationLogLevel: "$LOG_LEVEL"
      scriptLogTarget: "$LOG_TARGET"
      scriptLogLevel: "$LOG_LEVEL"
      auditStatsLogTarget: "$LOG_TARGET"
      auditStatsLogLevel: "$LOG_LEVEL"
  casa:
    # -- App loggers can be configured to define where the logs will be redirected to and the level of each in which it should be displayed.
    appLoggers:
      casaLogTarget: "$LOG_TARGET"
      casaLogLevel: "$LOG_LEVEL"
      timerLogTarget: "$LOG_TARGET"
      timerLogLevel: "$LOG_LEVEL"
    ingress:
      casaEnabled: true
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
    ingress:
      fido2ConfigEnabled: true
    appLoggers:
      fido2LogTarget: "$LOG_TARGET"
      fido2LogLevel: "$LOG_LEVEL"
      persistenceLogTarget: "$LOG_TARGET"
      persistenceLogLevel: "$LOG_LEVEL"
  scim:
    ingress:
      scimConfigEnabled: true
      scimEnabled: true
    appLoggers:
      scimLogTarget: "$LOG_TARGET"
      scimLogLevel: "$LOG_LEVEL"
      persistenceLogTarget: "$LOG_TARGET"
      persistenceLogLevel: "$LOG_LEVEL"
      persistenceDurationLogTarget: "$LOG_TARGET"
      persistenceDurationLogLevel: "$LOG_LEVEL"
      scriptLogTarget: "$LOG_TARGET"
      scriptLogLevel: "$LOG_LEVEL"
  fqdn: $GLUU_FQDN
  lbIp: $EXT_IP
# -- Nginx ingress definitions chart
nginx-ingress:
  ingress:
    path: /
    hosts:
    - $GLUU_FQDN
    # -- Secrets holding HTTPS CA cert and key.
    tls:
    - secretName: tls-certificate
      hosts:
      - $GLUU_FQDN
EOF
sudo helm repo add gluu-flex https://docs.gluu.org/charts
sudo helm repo update
sudo helm install gluu gluu-flex/gluu -n gluu -f override.yaml --kubeconfig="$KUBECONFIG" --version="$GLUU_VERSION"
cat << EOF > testendpoints.sh
sudo microk8s config > config
KUBECONFIG="$PWD"/config
echo -e "Testing openid-configuration endpoint.. \n"
curl -k https://$GLUU_FQDN/.well-known/openid-configuration
echo -e "Testing scim-configuration endpoint.. \n"
curl -k https://$GLUU_FQDN/.well-known/scim-configuration
echo -e "Testing fido2-configuration endpoint.. \n"
curl -k https://$GLUU_FQDN/.well-known/fido2-configuration
cd ..
EOF
echo "Waiting for Gluu-Flex to come up. Please do not cancel out. This can take up to 5 minutes."
sudo microk8s.kubectl -n gluu wait --for=condition=available --timeout=300s deploy/gluu-auth-server --kubeconfig="$KUBECONFIG" || echo "auth-server deployment is not ready. Running tests anyways..."
sudo bash testendpoints.sh
echo -e "You may re-execute 'bash testendpoints.sh' to do a quick test to check the openid-configuration endpoint."
