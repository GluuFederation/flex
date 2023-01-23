# The following jobs need to be configured
# - persistence (configure which database to use)
# - configuration (store configuration in AWS secrets manager)
# - auth-server-key-rotaion (rotate the auth server key every X hours)
# - cert manager (run on demand by user)

resource "kubernetes_job" "config" {

  metadata {
    name      = "janssen-config-job"
    namespace = var.namespace

    labels = {
      APP_NAME = "configurator"
    }
  }


  spec {
    template {

      metadata {
        name = "janssen-config-job"
        labels = {
          APP_NAME = "configurator"
          app      = "janssen-config-init-load"
        }
      }

      spec {
        restart_policy = "Never"

        volume {
          name = "config-mount-gen-file"
          secret {
            secret_name = "janssen-gen-json-file"
          }
        }

        volume {
          name = "janssen-tls-script"
          config_map {
            name = "janssen-tls-script"
          }
        }

        container {
          name              = "configurator"
          image_pull_policy = "IfNotPresent"
          image             = "${var.configurator_image}:${var.configurator_version}"

          command = [
            "tini",
            "-g",
            "--",
            "/bin/sh",
            "-c",
            "/app/scripts/entrypoint.sh load",
            "/usr/bin/python3 /scripts/tls_generator.py"
          ]

          env_from {
            config_map_ref {
              name = "janssen-config-cm"
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

          security_context {
            run_as_user                = 1000
            run_as_non_root            = true
            allow_privilege_escalation = false
          }

          volume_mount {
            name       = "config-mount-gen-file"
            mount_path = "/app/db/generate.json"
            sub_path   = "generate.json"
          }

          volume_mount {
            name       = "janssen-tls-script"
            mount_path = "/scripts/tls_generator.py"
            sub_path   = "tls_generator.py"
          }

          resources {
            limits = {
              cpu    = "300m"
              memory = "300Mi"
            }
            requests = {
              cpu    = "300m"
              memory = "300Mi"
            }
          }
        }
      }


    }

  }

  wait_for_completion = true
  timeouts {
    create = "10m"
    update = "10m"
  }

  # wait for the EKS cluster to be ready, as well as 
  # the secrets and config maps to be created
  depends_on = [
    time_sleep.wait_for_eks_cluster,
    kubernetes_secret.gen-json,
    kubernetes_config_map.janssen_config,
    kubernetes_config_map.tls_script,
  ]
}


resource "kubernetes_job" "persistence" {

  metadata {
    name      = "janssen-persistence-loader"
    namespace = var.namespace

    labels = {
      APP_NAME = "persistence-loader"
    }
  }


  spec {
    template {

      metadata {
        labels = {
          APP_NAME = "persistence-loader"
          app      = "janssen-persistence-loader"
        }
      }

      spec {
        restart_policy = "Never"

        container {
          name              = "janssen-persistence-loader"
          image_pull_policy = "IfNotPresent"
          image             = "${var.persistence_image}:${var.persistence_version}"

          env {
            name  = "CN_SQL_DB_PASSWORD"
            value = random_password.aurora_password[0].result
          }

          env_from {
            config_map_ref {
              name = "janssen-config-cm"
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

          security_context {
            run_as_user                = 1000
            run_as_non_root            = true
            allow_privilege_escalation = false
          }

          resources {
            limits = {
              cpu    = "300m"
              memory = "300Mi"
            }
            requests = {
              cpu    = "300m"
              memory = "300Mi"
            }
          }
        }
      }


    }

  }

  wait_for_completion = true
  timeouts {
    create = "10m"
    update = "10m"
  }

  # wait for the config job to finish
  depends_on = [kubernetes_job.config]
}

resource "kubernetes_cron_job_v1" "auth_server_key_rotation" {

  metadata {
    name      = "auth-server-key-rotation"
    namespace = var.namespace

    labels = {
      APP_NAME = "auth-server-key-rotation"
      release  = "janssen"

      # {{ include "auth-server-key-rotation.labels" . | indent 4 }}
      # {{- if .Values.additionalLabels }}
      # {{ toYaml .Values.additionalLabels | indent 4 }}
      # {{- end }}
    }

    # {{- if .Values.additionalAnnotations }}
    #   annotations:
    # {{ toYaml .Values.additionalAnnotations | indent 4 }}
    # {{- end }}
  }

  spec {

    schedule           = "0 */${var.keys_life} * * *"
    concurrency_policy = "Forbid"

    job_template {
      metadata {}
      spec {

        template {
          metadata {}
          spec {

            # {{- with .Values.image.pullSecrets }}
            #   imagePullSecrets:
            #     {{- toYaml . | nindent 8 }}
            # {{- end }}
            #   dnsPolicy: {{ .Values.dnsPolicy | quote }}
            # {{- with .Values.dnsConfig }}
            #   dnsConfig:
            #     {{ toYaml . | indent 12 }}
            # {{- end }}

            container {
              name              = "auth-server-key-rotation"
              image_pull_policy = "IfNotPresent"
              image             = "${var.auth_server_image}:${var.auth_server_version}"
              args              = ["patch", "auth", "--opts", "interval:${var.keys_life}"]

              # env:
              #   {{- include "auth-server-key-rotation.usr-envs" . | indent 16 }}
              #   {{- include "auth-server-key-rotation.usr-secret-envs" . | indent 16 }}

              env_from {
                config_map_ref {
                  name = "janssen-config-cm"
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

              security_context {
                run_as_user                = 1000
                run_as_non_root            = true
                allow_privilege_escalation = false
              }

              resources {
                limits = {
                  cpu    = "300m"
                  memory = "300Mi"
                }
                requests = {
                  cpu    = "300m"
                  memory = "300Mi"
                }
              }

              # volumeMounts:

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
              #   {{- end }}
              # {{- with .Values.volumeMounts }}
              #   {{- toYaml . | nindent 16 }}
              # {{- end }}

            }

            # volumes:
            # {{- with .Values.volumes }}
            #   {{- toYaml . | nindent 12 }}
            # {{- end }}

            # {{ if or (eq .Values.global.configSecretAdapter "aws") (eq .Values.global.configAdapterName "aws") }}
            #   - name: aws-shared-credential-file
            #     secret:
            #       secretName: {{ .Release.Name }}-aws-config-creds
            #       items:
            #         - key: aws_shared_credential_file
            #           path: aws_shared_credential_file
            #   - name: aws-config-file
            #     secret:
            #       secretName: {{ .Release.Name }}-aws-config-creds
            #       items:
            #         - key: aws_config_file
            #           path: aws_config_file
            #   - name: aws-secrets-replica-regions
            #     secret:
            #       secretName: {{ .Release.Name }}-aws-config-creds
            #       items:
            #         - key: aws_secrets_replica_regions
            #           path: aws_secrets_replica_regions
            # {{- end }}

            # {{ if or (eq .Values.global.configSecretAdapter "google") (eq .Values.global.cnPersistenceType "spanner") }}
            #   - name: google-sa
            #     secret:
            #       secretName: {{ .Release.Name }}-google-sa
            # {{- end }}

            restart_policy = "Never"
          }
        }
      }
    }
  }
}
