locals {

  auth_server_volume_mounts = [
    for m in [
      var.ob_ext_signing_jwks_key_passphrase == "" ? null : {
        name       = "ob-ext-signing-jwks-key-passphrase"
        mount_path = "/etc/certs/ob-ext-signing.pin"
        sub_path   = "ob-ext-signing.pin"
      },
      var.ob_ext_signing_jwks_key == "" ? null : {
        name       = "ob-ext-signing-jwks-key"
        mount_path = "/etc/certs/ob-ext-signing.key"
        sub_path   = "ob-ext-signing.key"
      },
      var.ob_ext_signing_jwks_crt == "" ? null : {
        name       = "ob-ext-signing-jwks-crt"
        mount_path = "/etc/certs/ob-ext-signing.crt"
        sub_path   = "ob-ext-signing.crt"
      },
      var.ob_transport_key_passphrase == "" ? null : {
        name       = "ob-transport-key-passphrase"
        mount_path = "/etc/certs/ob-transport.pin"
        sub_path   = "ob-transport.pin"
      },
      var.ob_transport_key == "" ? null : {
        name       = "ob-transport-key"
        mount_path = "/etc/certs/ob-transport.key"
        sub_path   = "ob-transport.key"
      },
      var.ob_transport_crt == "" ? null : {
        name       = "ob-transport-crt"
        mount_path = "/etc/certs/ob-transport.crt"
        sub_path   = "ob-transport.crt"
      },
      var.ob_transport_truststore == "" ? null : {
        name       = "ob-transport-truststore"
        mount_path = "/etc/certs/ob-transport-truststore.p12"
        sub_path   = "ob-transport-truststore.p12"
      },

      # {{- with .Values.volumeMounts }}
      #   {{- toYaml . | nindent 10 }}
      # {{- end }}

      # {{ if or (eq .Values.global.configSecretAdapter "aws") (eq .Values.global.configAdapterName "aws") }}
      #   - mountPath: {{ .Values.global.cnAwsSharedCredentialsFile }}
      #     name: aws-shared-credential-file
      #     subPath: aws_shared_credential_file
      #   - mountPath: {{ .Values.global.cnAwsConfigFile }}
      #     name: aws-config-file
      #     subPath: aws_config_file
      #   - mountPath: {{ .Values.global.cnAwsSecretsReplicaRegionsFile }}
      #     name: aws-secrets-replica-regions
      #     subPath: aws_secrets_replica_regions
      # {{- end }}


      # {{ if or (eq .Values.global.configSecretAdapter "google") (eq .Values.global.cnPersistenceType "spanner") }}
      #   - mountPath: {{ .Values.global.cnGoogleApplicationCredentials }}
      #     name: google-sa
      #     subPath: google-credentials.json
      # {{- end }}

      # {{- if or (eq .Values.global.cnPersistenceType "couchbase") (eq .Values.global.cnPersistenceType "hybrid") }}
      #   {{- if not .Values.global.istio.enabled }}
      #   - name: cb-crt 
      #     mountPath: "/etc/certs/couchbase.crt"
      #     subPath: couchbase.crt
      #   {{- end }}
      # {{- end }}
    ] :
    m
  if m != null]

  auth_server_volumes = [
    for m in [

      var.ob_ext_signing_jwks_key_passphrase == "" ? null : {
        name   = "ob-ext-signing-jwks-key-passphrase"
        secret = "janssen-ob-ext-signing-jwks-crt-key-pin"
        items  = ["ob-ext-signing.pin"]
      },

      var.ob_ext_signing_jwks_key == "" ? null : {
        name   = "ob-ext-signing-jwks-key"
        secret = "janssen-ob-ext-signing-jwks-crt-key-pin"
        items  = ["ob-ext-signing.key"]
      },

      var.ob_ext_signing_jwks_crt == "" ? null : {
        name   = "ob-ext-signing-jwks-crt"
        secret = "janssen-ob-ext-signing-jwks-crt-key-pin"
        items  = ["ob-ext-signing.crt"]
      },

      var.ob_transport_key_passphrase == "" ? null : {
        name   = "ob-transport-key-passphrase"
        secret = "janssen-ob-transport-crt-key-pin"
        items  = ["ob-transport.pin"]
      },

      var.ob_transport_key == "" ? null : {
        name   = "ob-transport-key"
        secret = "janssen-ob-transport-crt-key-pin"
        items  = ["ob-transport.key"]
      },

      var.ob_transport_crt == "" ? null : {
        name   = "ob-transport-crt"
        secret = "janssen-ob-transport-crt-key-pin"
        items  = ["ob-transport.crt"]
      },

      var.ob_transport_truststore == "" ? null : {
        name   = "ob-transport-truststore"
        secret = "janssen-ob-transport-truststore"
        items  = []
      },

      # volume {
      # {{{- with .Values.volumes }}
      #   {{- toYaml . | nindent 8 }}
      # {{- end }}

      # {{ if or (eq .Values.global.configSecretAdapter "aws") (eq .Values.global.configAdapterName "aws") }}
      #   - name: aws-shared-credential-file
      #     secret:
      #       secretName: janssen-aws-config-creds
      #       items:
      #         - key: aws_shared_credential_file
      #           path: aws_shared_credential_file
      #   - name: aws-config-file
      #     secret:
      #       secretName: janssen-aws-config-creds
      #       items:
      #         - key: aws_config_file
      #           path: aws_config_file
      #   - name: aws-secrets-replica-regions
      #     secret:
      #       secretName: janssen-aws-config-creds
      #       items:
      #         - key: aws_secrets_replica_regions
      #           path: aws_secrets_replica_regions
      # {{- end }}


      # {{ if or (eq .Values.global.configSecretAdapter "google") (eq .Values.global.cnPersistenceType "spanner") }}
      #   - name: google-sa
      #     secret:
      #       secretName: janssen-google-sa
      # {{- end }}

    ] :
    m
  if m != null]

}


resource "kubernetes_deployment" "auth_server" {

  count = var.enable_auth_server ? 1 : 0

  // wait for both config jobs to finish
  depends_on = [kubernetes_job.persistence]

  metadata {
    name      = "janssen-auth-server"
    namespace = var.namespace
    labels = {
      app      = "auth-server"
      APP_NAME = "janssen-auth-server"

      # {{ include "auth-server.labels" . | indent 4 }}
      # {{- if .Values.additionalLabels }}
      # {{ toYaml .Values.additionalLabels | indent 4 }}
      # {{- end }}
    }

    #{{- if .Values.additionalAnnotations }}
    # annotations {
    #{{ toYaml .Values.additionalAnnotations | indent 4 }}
    # }
    #{{- end }}

  }

  spec {

    replicas = var.auth_server_replicas

    selector {
      match_labels = {
        app = "auth-server"
      }
    }

    template {

      metadata {
        labels = {
          app      = "auth-server"
          APP_NAME = "janssen-auth-server"
        }

      }

      spec {

        # dns_policy = "${dns_policy}"
        # {{- with .Values.dnsConfig }}
        # dns_config {
        #   {{ toYaml . | indent 8 }}
        # }
        # {{- end }}

        container {
          name              = "auth-server"
          image_pull_policy = "IfNotPresent"
          image             = "${var.auth_server_image}:${var.auth_server_version}"

          security_context {
            run_as_user                = 1000
            run_as_non_root            = true
            allow_privilege_escalation = false
          }

          port {
            name           = "http-auth"
            container_port = 8080
          }

          #  {{ if .Values.global.cnPrometheusPort }}
          # port {
          #   name          = "prometheus-port"
          #   containerPort = var.cn_prometheus_port
          # }
          # {{- end }}

          # env {
          # {{- include "auth-server.usr-envs" . | indent 12 }}
          # {{- include "auth-server.usr-secret-envs" . | indent 12 }}
          # }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.janssen_config.metadata[0].name
            }

            #{{ if .Values.global.usrEnvs.secret }}
            # secret_ref {
            #   name = "janssen-global-user-custom-envs"
            # }
            #{{ end }} 

            #{{ if .Values.global.usrEnvs.normal }}
            # config_map_ref {
            #   name = "janssen-global-user-custom-envs"
            # }
            #{{ end }}
          }

          dynamic "volume_mount" {
            for_each = local.auth_server_volume_mounts
            content {
              name       = volume_mount.value.name
              mount_path = volume_mount.value.mount_path
              sub_path   = volume_mount.value.sub_path
            }
          }

          resources {
            limits = {
              cpu    = "2500m"
              memory = "2500Mi"
            }
            requests = {
              cpu    = "2500m"
              memory = "2500Mi"
            }
          }

          liveness_probe {
            exec {
              command = [
                "python3",
                "/app/scripts/healthcheck.py",
              ]
            }
            initial_delay_seconds = 30
            timeout_seconds       = 5
            period_seconds        = 30
          }

          readiness_probe {
            exec {
              command = [
                "python3",
                "/app/scripts/healthcheck.py",
              ]
            }
            initial_delay_seconds = 30
            timeout_seconds       = 5
            period_seconds        = 30
          }
        }

        dynamic "volume" {
          for_each = local.auth_server_volumes
          content {
            name = volume.value.name
            secret {
              secret_name = volume.value.secret

              dynamic "items" {
                for_each = volume.value.items
                content {
                  key  = items.value
                  path = items.value
                }
              }
            }
          }
        }

        # host_aliases {
        #   ip = "${ Values.global.lbIp }"
        #   hostnames = [
        #     "${ Values.global.fqdn }"
        #   ]
        # }

      }


    }

  }
}

resource "kubernetes_service_v1" "auth_server" {

  count = var.enable_auth_server ? 1 : 0

  depends_on = [
    kubernetes_deployment.auth_server
  ]

  metadata {
    name      = "auth-server-svc"
    namespace = var.namespace
  }

  spec {

    selector = {
      app = "auth-server"
    }

    port {
      port        = 80
      name        = "http"
      target_port = "http-auth"
    }

  }
}

# Default ingress
resource "kubernetes_ingress_v1" "auth_server_default" {
  count = var.enable_auth_server ? 1 : 0

  metadata {
    name      = "auth-server-default-ing"
    namespace = var.namespace
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path = "/jans-auth"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}

# OpenID Connect ingress
resource "kubernetes_ingress_v1" "auth_server_openid" {
  count = var.enable_auth_server && contains(var.auth_ingresses, "openidConfig") ? 1 : 0 # TODO

  metadata {
    name      = "auth-server-openid-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-auth/.well-known/openid-configuration"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path      = "/.well-known/openid-configuration"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}

# Device code ingress
resource "kubernetes_ingress_v1" "auth_server_device_code" {
  count = var.enable_auth_server && contains(var.auth_ingresses, "deviceCode") ? 1 : 0 # TODO

  metadata {
    name      = "auth-server-device-code-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-auth/device_authorization.htm"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path      = "/device-code"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}

# Firebase messaging ingress
resource "kubernetes_ingress_v1" "auth_server_firebase_messaging" {
  count = var.enable_auth_server && contains(var.auth_ingresses, "firebaseMessaging") ? 1 : 0 # TODO

  metadata {
    name      = "auth-server-firebase-messaging-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-auth/firebase-messaging-sw.js"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path      = "/firebase-messaging-sw.js"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}

# UMA2 config ingress
resource "kubernetes_ingress_v1" "auth_server_uma2_config" {
  count = var.enable_auth_server && contains(var.auth_ingresses, "uma2Config") ? 1 : 0

  metadata {
    name      = "auth-server-uma2-config-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-auth/restv1/uma2-configuration"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path      = "/.well-known/uma2-configuration"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}

# Webfinger ingress
resource "kubernetes_ingress_v1" "auth_server_webfinger" {
  count = var.enable_auth_server && contains(var.auth_ingresses, "webfinger") ? 1 : 0

  metadata {
    name      = "auth-server-webfinger-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-auth/.well-known/webfinger"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path      = "/.well-known/webfinger"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}

# Webdiscover ingress
resource "kubernetes_ingress_v1" "auth_server_webdiscovery" {
  count = var.enable_auth_server && contains(var.auth_ingresses, "webdiscovery") ? 1 : 0

  metadata {
    name      = "auth-server-webdiscovery-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-auth/.well-known/simple-web-discovery"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path      = "/.well-known/simple-web-discovery"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}

# U2F ingress
resource "kubernetes_ingress_v1" "auth_server_u2f" {
  count = var.enable_auth_server && contains(var.auth_ingresses, "u2fConfig") ? 1 : 0

  metadata {
    name      = "auth-server-u2f-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-auth/restv1/fido-configuration"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path      = "/.well-known/fido-configuration"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.auth_server[0].metadata[0].name
              port {
                number = kubernetes_service_v1.auth_server[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}
