#!/bin/bash
set -e
if [[ ! "$GLUU_FQDN" ]]; then
  read -rp "Enter Hostname [demoexample.gluu.org]:                           " GLUU_FQDN
fi
if ! [[ $GLUU_FQDN == *"."*"."* ]]; then
  echo "[E] Hostname provided is invalid or empty.
    Please enter a FQDN with the format demoexample.gluu.org"
  exit 1
fi
sudo apt-get update
sudo snap install microk8s --classic
sudo microk8s.status --wait-ready
sudo microk8s.enable dns registry ingress helm3
sudo snap alias microk8s.kubectl kubectl
sudo snap alias microk8s.helm3 helm
sudo microk8s kubectl get daemonset.apps/nginx-ingress-microk8s-controller -n ingress -o yaml | sed -s "s@ingress-class=public@ingress-class=nginx@g" | microk8s kubectl apply -f -
sudo apt-get update
sudo microk8s config > config
KUBECONFIG="$PWD"/config
sudo microk8s.kubectl create namespace gluu --kubeconfig="$KUBECONFIG" || echo "namespace exists"
sudo helm repo add bitnami https://charts.bitnami.com/bitnami
sudo microk8s.kubectl get po --kubeconfig="$KUBECONFIG"
sudo helm install my-release --set auth.rootPassword=Test1234#,auth.database=gluu,image.repository=bitnamilegacy/mysql,image.tag=9.4.0-debian-12-r1 -n gluu oci://registry-1.docker.io/bitnamicharts/mysql --kubeconfig="$KUBECONFIG"
EXT_IP=$(curl ipinfo.io/ip)
sudo echo "$EXT_IP $GLUU_FQDN" >> /etc/hosts
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
    additionalAnnotations:
      nginx.ingress.kubernetes.io/auth-tls-verify-client: "optional"
      nginx.ingress.kubernetes.io/auth-tls-secret: "gluu/tls-ob-ca-certificates"
      nginx.ingress.kubernetes.io/auth-tls-verify-depth: "1"
      nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "true"
global:
  cloud:
    testEnviroment: true
  admin-ui:
    enabled: false
  auth-server:
    ingress:
      authServerProtectedToken: true
      authServerProtectedRegister: true
  auth-server-key-rotation:
    enabled: false
  casa:
    enabled: false  
  config-api:
    enabled: true
  fido2:
    enabled: false
  scim:
    enabled: false
  isFqdnRegistered: false
  lbIp: $EXT_IP
  fqdn: $GLUU_FQDN
EOF
sudo helm repo add gluu-flex https://docs.gluu.org/charts
sudo helm repo update
sudo helm install gluu gluu-flex/gluu -n gluu -f override.yaml --kubeconfig="$KUBECONFIG"
echo "Waiting for the configuration job to complete. Please do not cancel out. This can take up to 3 minutes."
sudo microk8s.kubectl -n gluu wait --for=condition=complete --timeout=180s deploy/gluu-config --kubeconfig="$KUBECONFIG"
sudo microk8s.kubectl get secret cn -n gluu --kubeconfig="$KUBECONFIG" --template={{.data.ssl_ca_cert}} | base64 -d > ca.crt
sudo microk8s.kubectl get secret cn -n gluu --kubeconfig="$KUBECONFIG" --template={{.data.ssl_cert}} | base64 -d > server.crt
sudo microk8s.kubectl get secret cn -n gluu --kubeconfig="$KUBECONFIG" --template={{.data.ssl_key}} | base64 -d > server.key
sudo microk8s.kubectl create secret generic tls-ob-ca-certificates -n gluu --kubeconfig="$KUBECONFIG" --from-file=tls.crt=server.crt --from-file=tls.key=server.key --from-file=ca.crt=ca.crt
sudo microk8s.kubectl rollout restart deployment gluu-auth-server -n gluu --kubeconfig="$KUBECONFIG"
sudo microk8s.kubectl rollout restart deployment gluu-config-api -n gluu --kubeconfig="$KUBECONFIG"
echo "Waiting for gluu-flex to come up. Please do not cancel out. This can take up to 5 minutes."
sudo microk8s.kubectl -n gluu wait --for=condition=available --timeout=300s deploy/gluu-auth-server --kubeconfig="$KUBECONFIG"