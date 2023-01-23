locals {
  persistence_type = var.db_type == "couchbase" ? "couchbase" : var.db_type == "spanner" ? "spanner" : "sql"
}

# --------------------------------------------- #
# K8s RBAC setup
# --------------------------------------------- #

resource "kubernetes_role" "default" {
  metadata {
    name      = "janssen-${var.namespace}-cn-role"
    namespace = var.namespace
    labels = {
      APP_NAME = "configurator"
    }
  }

  rule {
    api_groups = [""]
    resources  = ["configmaps", "secrets"]
    verbs      = ["get", "list", "watch", "create", "update", "patch", "delete"]
  }
}

resource "kubernetes_role_binding" "default" {
  metadata {
    name      = "janssen-${var.namespace}-rolebinding"
    namespace = var.namespace
    labels = {
      APP_NAME = "configurator"
    }
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = kubernetes_role.default.metadata[0].name
  }

  subject {
    kind      = "User"
    name      = "system:serviceaccount:${var.namespace}:default"
    api_group = "rbac.authorization.k8s.io"
  }
}

resource "kubernetes_cluster_role_binding" "default" {
  metadata {
    name = "janssen-${var.namespace}-rolebinding"
    labels = {
      app = "configurator-load"
    }
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "edit"
  }

  subject {
    kind      = "ServiceAccount"
    name      = "default"
    namespace = var.namespace
  }

}

resource "kubernetes_cluster_role_binding" "admin" {
  metadata {
    name = "janssen-${var.namespace}-cluster-admin-binding"
    labels = {
      APP_NAME = "configurator"
    }
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "cluster-admin"
  }

  subject {
    kind      = "User"
    name      = "ACCOUNT"
    api_group = "rbac.authorization.k8s.io"
  }

}

# --------------------------------------------- #
# ConfigMaps
# --------------------------------------------- #

resource "kubernetes_config_map" "janssen_config" {
  metadata {
    name      = "janssen-config-cm"
    namespace = var.namespace
    labels = {
      APP_NAME = "configurator"
      # {{ include "config.labels" . | indent 4 }}
      # {{- if .Values.additionalLabels }}
      # {{ toYaml .Values.additionalLabels | indent 4 }}
      # {{- end }}
      # {{- if .Values.additionalAnnotations }}
    }

    # {{- if .Values.additionalAnnotations }}
    #   annotations {
    # {{ toYaml .Values.additionalAnnotations | indent 4 }}
    #   }
    # {{- end }}
  }

  data = {
    # Jetty header size in bytes in the auth server
    CN_JETTY_REQUEST_HEADER_SIZE = 8192
    # Port used by Prometheus JMX agent
    CN_PROMETHEUS_PORT = ""
    CN_DISTRIBUTION    = var.gluu_distribution

    # %{ if cn_ob_ext_signing_jwks_uri }
    CN_OB_EXT_SIGNING_JWKS_URI : var.ob_ext_signing_jwks_uri
    CN_OB_AS_TRANSPORT_ALIAS : var.ob_transport_alias
    CN_OB_EXT_SIGNING_ALIAS : var.ob_ext_signing_alias
    # force the AS to use a specific signing key
    CN_OB_STATIC_KID : var.ob_static_signing_key_kid
    # %{ endif }

    CN_SQL_DB_SCHEMA   = ""
    CN_SQL_DB_DIALECT  = var.db_type == "aurora-mysql" ? "mysql" : (var.db_type == "aurora-postgresql" ? "pgsql" : var.db_custom_dialect)
    CN_SQL_DB_HOST     = local.provision_db ? aws_rds_cluster.aurora_db_cluster[0].endpoint : var.db_custom_host
    CN_SQL_DB_PORT     = local.provision_db ? aws_rds_cluster.aurora_db_cluster[0].port : var.db_custom_port
    CN_SQL_DB_NAME     = local.provision_db ? aws_rds_cluster.aurora_db_cluster[0].database_name : var.db_custom_name
    CN_SQL_DB_USER     = local.provision_db ? random_string.aurora_user[0].result : var.db_username
    CN_SQL_DB_TIMEZONE = "UTC"

    #  used only if db_type is "couchbase "
    CN_COUCHBASE_URL               = var.db_couchbase_url
    CN_COUCHBASE_BUCKET_PREFIX     = var.db_couchbase_bucket_prefix
    CN_COUCHBASE_INDEX_NUM_REPLICA = var.db_couchbase_index_num_replica
    CN_COUCHBASE_USER              = var.db_couchbase_user
    CN_COUCHBASE_SUPERUSER         = var.db_couchbase_superuser


    CN_CONFIG_ADAPTER              = "kubernetes"
    CN_SECRET_ADAPTER              = "kubernetes"
    CN_CONFIG_KUBERNETES_NAMESPACE = var.namespace
    CN_SECRET_KUBERNETES_NAMESPACE = var.namespace
    CN_CONFIG_KUBERNETES_CONFIGMAP = "cn"
    CN_SECRET_KUBERNETES_SECRET    = "cn"
    CN_CONTAINER_METADATA          = "kubernetes"
    CN_MAX_RAM_PERCENTAGE          = 75.0
    CN_CACHE_TYPE                  = var.cache_type
    CN_DOCUMENT_STORE_TYPE         = "LOCAL"
    DOMAIN                         = var.fqdn
    CN_AUTH_SERVER_BACKEND         = "janssen-auth-server:8080"
    CN_AUTH_APP_LOGGERS            = <<EOT
    {
      "enable_stdout_log_prefix": "true"
      "auth_log_target": "STDOUT",
      "auth_log_level": "INFO",
      "http_log_target": "FILE",
      "http_log_level": "INFO",
      "persistence_log_target": "FILE",
      "persistence_log_level": "INFO",
      "persistence_duration_log_target": "FILE",
      "persistence_duration_log_level": "INFO",
      "ldap_stats_log_target": "FILE",
      "ldap_stats_log_level": "INFO",
      "script_log_target": "FILE",
      "script_log_level": "INFO",
      "audit_stats_log_target": "FILE",
      "audit_stats_log_level": "INFO"
    }
    EOT

    CN_CONFIG_API_APP_LOGGERS = <<EOT
    {
      "config_api_log_target": "STDOUT",
      "config_api_log_level": "INFO",
      "persistence_log_target": "FILE",
      "persistence_log_level": "INFO",
      "persistence_duration_log_target": "FILE",
      "persistence_duration_log_level": "INFO",
      "ldap_stats_log_target": "FILE",
      "ldap_stats_log_level": "INFO",
      "script_log_target": "FILE",
      "script_log_level": "INFO",
    }
    EOT

    # %{ if !is_fqdn_registered  }
    # LB_ADDR: {{ .Values.configmap.lbAddr }}
    # %{ endif }

    CN_PERSISTENCE_TYPE = local.persistence_type

    CN_KEY_ROTATION_FORCE    = false
    CN_KEY_ROTATION_CHECK    = 3600
    CN_KEY_ROTATION_INTERVAL = 48

    # %{ if is_fqdn_registered }}
    CN_SSL_CERT_FROM_SECRETS = false
    # %{ else }}
    # CN_SSL_CERT_FROM_SECRETS: "true"
    # %{ endif }

    CN_CONTAINER_MAIN_NAME = "janssen-auth-server"

    # # Auto enable installation of some services
    CN_PASSPORT_ENABLED = "false"

    # %{ if .Values.global.oxshibboleth.enabled }}
    # CN_SAML_ENABLED: %{ .Values.global.oxshibboleth.enabled }
    # %{ endif }

    # %{ if .Values.configmap.cnCacheType == "REDIS" }
    CN_REDIS_URL     = var.redis_url
    CN_REDIS_TYPE    = var.redis_type
    CN_REDIS_USE_SSL = var.redis_use_ssl
    # CN_REDIS_SSL_TRUSTSTORE: "%{ .Values.configmap.cnRedisSslTruststore }"
    CN_REDIS_SENTINEL_GROUP = var.redis_sentinel_group


    # %{ if .Values.global.scim.enabled }}
    CN_SCIM_ENABLED         = var.enable_scim
    CN_SCIM_PROTECTION_MODE = var.scim_protection_mode

    CN_SCIM_APP_LOGGERS = <<EOT
    {
      "scim_log_target": "STDOUT",
      "scim_log_level": "INFO",
      "persistence_log_target": "FILE",
      "persistence_log_level": "INFO",
      "persistence_duration_log_target": "FILE",
      "persistence_duration_log_level": "INFO",
      "ldap_stats_log_target": "FILE",
      "ldap_stats_log_level": "INFO",
      "script_log_target": "FILE",
      "script_log_level": "INFO",
    }
    EOT

    # # TODO
    # # %{ if .Values.global.fido2.enabled }}
    CN_FIDO2_APP_LOGGERS = <<EOT
    {
      "fido2_log_target": "FILE",
      "fido2_log_level": "INFO",
      "persistence_log_target": "FILE",
      "persistence_log_level": "INFO",
    }
    EOT

    # ADMIN-UI
    ADMIN_UI_JWKS : "http://janssen-auth-server:8080/jans-auth/restv1/jwks"
    CN_CONFIG_API_PLUGINS : "admin-ui,scim,fido2,user-mgt"
    CN_ADMIN_UI_PLUGIN_LOGGERS = <<EOT
    {
      "admin_ui_log_target": "FILE",
      "admin_ui_log_level": "INFO",
      "admin_ui_audit_log_target": "FILE",
      "admin_ui_audit_log_level": "INFO",
    }
    EOT

  }
}

resource "kubernetes_config_map" "tls_script" {
  metadata {
    name      = "janssen-tls-script"
    namespace = var.namespace
  }

  data = {
    "tls_generator.py" = templatefile("${path.module}/templates/tls_generator.py", {
      namespace   = var.namespace
      secret_name = "janssen-gen-json-file"
    })
  }
}
