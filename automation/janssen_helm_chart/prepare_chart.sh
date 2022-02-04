#!/bin/bash
set -e

temp_chart_folder="charts/janssen"
rm ${temp_chart_folder}/openbanking-values.yaml || echo "file doesn't exist"
rm ${temp_chart_folder}/openbanking-helm.md || echo "file doesn't exist"
rm ${temp_chart_folder}/charts/config/templates/upgrade-ldap-101-jans.yaml || echo "file doesn't exist"
rm ${temp_chart_folder}/charts/config/templates/ob-secrets.yaml || echo "file doesn't exist"
rm ${temp_chart_folder}/charts/config/templates/admin-ui-secrets.yaml || echo "file doesn't exist"
services="casa jackrabbit oxpassport oxshibboleth admin-ui cn-istio-ingress"
for service in $services; do
  folder="${temp_chart_folder:?}/""charts/$service"
  echo "${folder}"
  rm -rf "${folder}"
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
  | sed '/CN_DISTRIBUTION/d' \
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

remove_all < $temp_chart_folder/charts/auth-server/templates/deployment.yml > tmpfile && mv tmpfile \
$temp_chart_folder/charts/auth-server/templates/deployment.yml

remove_all < $temp_chart_folder/charts/config/templates/configmaps.yaml > tmpfile && mv tmpfile \
$temp_chart_folder/charts/config/templates/configmaps.yaml

remove_all <  $temp_chart_folder/charts/config/values.yaml > tmpfile && mv tmpfile \
$temp_chart_folder/charts/config/values.yaml

echo "Chart preperation is finished!"