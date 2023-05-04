
resource "kubernetes_deployment" "config_api" {

  count = var.enable_config_api ? 1 : 0

  // wait for both config jobs to finish
  depends_on = [kubernetes_job.persistence]

  metadata {
    name      = "janssen-config-api"
    namespace = var.namespace
    labels = {
      APP_NAME = "config-api"

      # {{ include "config-api.labels" . | indent 4 }}
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

    replicas = var.config_api_replicas

    selector {
      match_labels = {
        APP_NAME = "janssen-config-api"
        app      = "config-api"
      }
    }

    template {

      metadata {
        labels = {
          APP_NAME = "janssen-config-api"
          app      = "config-api"
          release  = "janssen"
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
          name              = "janssen-config-api"
          image_pull_policy = "IfNotPresent"
          image             = "${var.config_api_image}:${var.config_api_version}"

          security_context {
            run_as_user                = 1000
            run_as_non_root            = true
            allow_privilege_escalation = false
          }

          port {
            name           = "https-config"
            container_port = 9444
          }

          port {
            name           = "http-config"
            container_port = 8074
          }

          #  {{ if .Values.global.cnPrometheusPort }}
          # port {
          #   name          = "prometheus-port"
          #   containerPort = var.cn_prometheus_port
          # }
          # {{- end }}

          # env {
          # {{- include "config-api.usr-envs" . | indent 12 }}
          # {{- include "config-api.usr-secret-envs" . | indent 12 }}
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

          # volume_mount {
          # {{- with .Values.volumeMounts }}
          #   {{- toYaml . | nindent 12 }}
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
          # }

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
            http_get {
              path = "/jans-config-api/api/v1/health/live"
              port = 8074
            }
            initial_delay_seconds = 30
            period_seconds        = 30
            timeout_seconds       = 5
          }

          readiness_probe {
            http_get {
              path = "/jans-config-api/api/v1/health/ready"
              port = 8074
            }
            initial_delay_seconds = 25
            period_seconds        = 25
            timeout_seconds       = 5
          }
        }

        # volume {
        # {{- with .Values.volumes }}
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

        # {{- if or (eq .Values.global.cnPersistenceType "couchbase") (eq .Values.global.cnPersistenceType "hybrid") }}

        #   {{- if not .Values.global.istio.enabled }}
        #   - name: cb-crt
        #     secret:
        #       secretName: janssen-cb-crt
        #   {{- end }}
        # {{- end }}

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


resource "kubernetes_service_v1" "config_api" {

  count = var.enable_config_api ? 1 : 0

  depends_on = [
    kubernetes_deployment.config_api
  ]

  metadata {
    name      = "config-api-svc"
    namespace = var.namespace
  }

  spec {
    type = "NodePort"
    selector = {
      app = "config-api"
    }

    port {
      port        = 80
      name        = "http"
      target_port = "http-config"
    }

    port {
      port        = 443
      name        = "https"
      target_port = "https-config"
    }
  }

}

resource "kubernetes_ingress_v1" "config_api" {

  count = var.enable_config_api ? 1 : 0

  metadata {
    name      = "config-api-ing"
    namespace = var.namespace
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path = "/jans-config-api"
          backend {
            service {
              name = kubernetes_service_v1.config_api[0].metadata[0].name
              port {
                number = kubernetes_service_v1.config_api[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}