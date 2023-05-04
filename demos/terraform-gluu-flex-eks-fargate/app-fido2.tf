resource "kubernetes_deployment" "fido2" {

  count = var.enable_fido2 ? 1 : 0

  // wait for both config jobs to finish
  depends_on = [kubernetes_job.persistence]

  metadata {
    name      = "janssen-fido2"
    namespace = var.namespace
    labels = {
      app      = "fido2"
      APP_NAME = "janssen-fido2"

      # {{ include "fido2.labels" . | indent 4 }}
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

    replicas = var.fido2_replicas

    selector {
      match_labels = {
        app = "fido2"
      }
    }

    template {

      metadata {
        labels = {
          app      = "fido2"
          APP_NAME = "janssen-fido2"
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
          name              = "janssen-fido2"
          image_pull_policy = "IfNotPresent"
          image             = "${var.fido2_image}:${var.fido2_version}"

          security_context {
            run_as_user                = 1000
            run_as_non_root            = true
            allow_privilege_escalation = false
          }

          port {
            name           = "http-fido2"
            container_port = 8080
          }

          #  {{ if .Values.global.cnPrometheusPort }}
          # port {
          #   name          = "prometheus-port"
          #   containerPort = var.cn_prometheus_port
          # }
          # {{- end }}

          # env {
          # {{- include "fido2.usr-envs" . | indent 12 }}
          # {{- include "fido2.usr-secret-envs" . | indent 12 }}
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
          # }

          resources {
            limits = {
              cpu    = "500m"
              memory = "500Mi"
            }
            requests = {
              cpu    = "500m"
              memory = "500Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/jans-fido2/sys/health-check"
              port = 8080
            }
            initial_delay_seconds = 25
            period_seconds        = 25
            timeout_seconds       = 5
          }

          readiness_probe {
            http_get {
              path = "/jans-fido2/sys/health-check"
              port = 8080
            }
            initial_delay_seconds = 30
            period_seconds        = 30
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
        # }

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


resource "kubernetes_service_v1" "fido2" {

  count = var.enable_fido2 ? 1 : 0

  depends_on = [
    kubernetes_deployment.fido2
  ]

  metadata {
    name      = "fido2-svc"
    namespace = var.namespace
  }

  spec {
    type = "NodePort"
    selector = {
      app = "fido2"
    }

    port {
      port        = 80
      name        = "http"
      target_port = "http-fido2"
    }
  }

}

resource "kubernetes_ingress_v1" "fido2" {

  count = var.enable_fido2 ? 1 : 0

  metadata {
    name      = "fido2-ing"
    namespace = var.namespace

    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/jans-fido2/restv1/fido2/configuration"
    }
  }

  spec {

    ingress_class_name = "nginx"

    rule {
      # host = var.fqdn
      http {
        path {
          path = "/.well-known/fido2-configuration"
          backend {
            service {
              name = kubernetes_service_v1.fido2[0].metadata[0].name
              port {
                number = kubernetes_service_v1.fido2[0].spec[0].port[0].port
              }
            }
          }
        }
      }
    }
  }

}