#!/bin/bash
set -e

mkdir -p /home/runner/work/test
git clone --recursive --depth 1 --branch master https://github.com/GluuFederation/flex.git /home/runner/work/test/
temp_chart_folder="/home/runner/work/test/flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/charts"
rm /home/runner/work/test/flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/openbanking-values.yaml
rm /home/runner/work/test/flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/openbanking-helm.md
rm /home/runner/work/test/flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/charts/config/templates/upgrade-ldap-101-jans.yaml
rm /home/runner/work/test/flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/charts/config/ob-secrets.yaml
rm /home/runner/work/test/flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/charts/config/admin-ui-secrets.yaml
services="casa jackrabbit oxpassport oxshibboleth admin-ui cn-istio-ingress"
for service in $services; do
  rm -rf "${temp_chart_folder:?}/""$service"
done

remove_all() {
  sed '/{{ if .Values.global.jackrabbit.enabled/,/{{- end }}/d' \
  | sed '/{{- if .Values.global.jackrabbit.enabled/,/{{- end }}/d' \
  | sed '/{{- if .Values.configmap.cnJackrabbitUrl/,/{{- end }}/d' \
  | sed '/{{ if .Values.global.cnJackrabbitCluster/,/{{- end }}/d' \
  | sed '/{{- if .Values.global.oxshibboleth.enabled/,/{{- end }}/d' \
  | sed '/{{- if index .Values "global" "admin-ui" "enabled" }}/,/{{- end }}/d' \
  | sed '/{{ if .Values.global.cnObExtSigningJwksUri/,/{{- end }}/d' \
  | sed '/{{ if .Values.ingress.adminUiEnabled/,/---/d' \
  | sed '/CN_CASA_ENABLED/d' \
  | sed '/CN_OB_EXT_SIGNING_JWKS_URI/d' \
  | sed '/CN_OB_AS_TRANSPORT_ALIAS/d' \
  | sed '/CN_OB_EXT_SIGNING_ALIAS/d' \
  | sed '/CN_OB_STATIC_KID/d' \
  | sed '/CN_JACKRABBIT_SYNC_INTERVAL/d' \
  | sed '/CN_PASSPORT_ENABLED/d' \
  | sed '/cnJackrabbitCluster/d' \
  | sed '/JACKRABBIT/d' \
  | sed '/Casa/d' \
  | sed '/Passport/d' \
  | sed '/Shib/d' \
  | sed '/oxshibboleth/d'
}

remove_all < $temp_chart_folder/auth-server/templates/deployment.yml > tmpfile && mv tmpfile \
$temp_chart_folder/auth-server/templates/deployment.yml

remove_all < $temp_chart_folder/admin-ui/templates/deployment.yml > tmpfile && mv tmpfile \
$temp_chart_folder/admin-ui/templates/deployment.yml

remove_all < $temp_chart_folder/config/templates/configmaps.yaml > tmpfile && mv tmpfile \
$temp_chart_folder/config/templates/configmaps.yaml

remove_all <  $temp_chart_folder/config/values.yaml > tmpfile && mv tmpfile \
$temp_chart_folder/config/values.yaml

