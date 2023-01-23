locals {
  optional_scopes = compact([
    var.cache_type == "redis" ? "redis" : null,
    var.enable_casa ? "casa" : null,
    var.enable_fido2 ? "fido2" : null,
    var.enable_scim ? "scim" : null,
    local.persistence_type
  ])
}


resource "kubernetes_secret" "gen-json" {
  metadata {
    name      = "janssen-gen-json-file"
    namespace = var.namespace

    labels = {
      APP_NAME = "configurator"
    }
  }

  type = "Opaque"

  data = {
    "generate.json" = jsonencode({
      "hostname" : var.fqdn,
      "city" : var.jans_city,
      "state" : var.jans_state,
      "country_code" : var.jans_country_code,
      "email" : var.jans_email,
      "org_name" : var.jans_org_name,
      "admin_pw" : random_password.admin_pw.result,
      "redis_pw" : var.redis_password,
      "sql_pw" : local.provision_db ? random_password.aurora_password[0].result : var.db_password
      "couchbase_pw" : var.db_couchbase_password,
      "couchbase_superuser_pw" : var.db_couchbase_superuser_password,
      "auth_sig_keys" : "RS256 RS384 RS512 ES256 ES384 ES512 PS256 PS384 PS512",
      "auth_enc_keys" : "RSA1_5 RSA-OAEP",
      "optional_scopes" : local.optional_scopes
    })
  }
}

resource "kubernetes_secret" "ob_ext_signing_jwks_crt_key_pin" {

  count = var.ob_ext_signing_jwks_crt == "" ? 0 : 1

  metadata {
    name      = "janssen-ob-ext-signing-jwks-crt-key-pin"
    namespace = var.namespace

    # {{ include "config.labels" . | indent 4 }}
    # {{- if .Values.additionalLabels }}
    # {{ toYaml .Values.additionalLabels | indent 4 }}
    # {{- end }}
    # {{- if .Values.additionalAnnotations }}
    #   annotations:
    # {{ toYaml .Values.additionalAnnotations | indent 4 }}
    # {{- end }}
  }

  type = "Opaque"

  data = {
    "ob-ext-signing.crt" = var.ob_ext_signing_jwks_crt

    "ob-ext-signing.key" = var.ob_ext_signing_jwks_key

    "ob-ext-signing.pin" = var.ob_ext_signing_jwks_key_passphrase
  }
}


resource "kubernetes_secret" "ob_transport_crt" {

  count = var.ob_transport_crt == "" ? 0 : 1

  metadata {
    name      = "janssen-ob-transport-crt-key-pin"
    namespace = var.namespace

    # {{ include "config.labels" . | indent 4 }}
    # {{- if .Values.additionalLabels }}
    # {{ toYaml .Values.additionalLabels | indent 4 }}
    # {{- end }}
    # {{- if .Values.additionalAnnotations }}
    #   annotations:
    # {{ toYaml .Values.additionalAnnotations | indent 4 }}
    # {{- end }}
  }

  type = "Opaque"

  data = {
    "ob-transport.crt" = var.ob_transport_crt

    "ob-transport.key" = var.ob_transport_key

    "ob-transport.pin" = var.ob_transport_key_passphrase
  }
}


resource "kubernetes_secret" "ob_transport_truststore" {

  count = var.ob_transport_truststore == "" ? 0 : 1

  metadata {
    name      = "janssen-ob-transport-truststore"
    namespace = var.namespace

    # {{ include "config.labels" . | indent 4 }}
    # {{- if .Values.additionalLabels }}
    # {{ toYaml .Values.additionalLabels | indent 4 }}
    # {{- end }}
    # {{- if .Values.additionalAnnotations }}
    #   annotations:
    # {{ toYaml .Values.additionalAnnotations | indent 4 }}
    # {{- end }}
  }

  type = "Opaque"

  data = {
    "ob-transport-truststore.p12" = var.ob_transport_truststore
  }
}