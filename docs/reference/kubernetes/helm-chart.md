# gluu

![Version: 5.9.0](https://img.shields.io/badge/Version-5.9.0-informational?style=flat-square) ![AppVersion: 5.9.0](https://img.shields.io/badge/AppVersion-5.9.0-informational?style=flat-square)

Gluu Access and Identity Management

**Homepage:** <https://www.gluu.org>

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| moabu | <team@gluu.org> |  |

## Source Code

* <https://docs.gluu.org>

## Requirements

Kubernetes: `>=v1.21.0-0`

| Repository | Name | Version |
|------------|------|---------|
|  | admin-ui | 5.9.0 |
|  | auth-server | 1.9.0 |
|  | auth-server-key-rotation | 1.9.0 |
|  | casa | 1.9.0 |
|  | cleanup | 1.9.0 |
|  | cn-istio-ingress | 1.9.0 |
|  | config | 1.9.0 |
|  | config-api | 1.9.0 |
|  | fido2 | 1.9.0 |
|  | kc-scheduler | 1.9.0 |
|  | nginx-ingress | 1.9.0 |
|  | persistence | 1.9.0 |
|  | saml | 1.9.0 |
|  | scim | 1.9.0 |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| admin-ui | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","hpa":{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50},"image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/gluufederation/flex/admin-ui","tag":"5.9.0-1"},"lifecycle":{},"livenessProbe":{"failureThreshold":20,"initialDelaySeconds":60,"periodSeconds":25,"tcpSocket":{"port":8080},"timeoutSeconds":5},"nodeSelector":{},"pdb":{"enabled":true,"maxUnavailable":"90%"},"readinessProbe":{"failureThreshold":20,"initialDelaySeconds":60,"periodSeconds":25,"tcpSocket":{"port":8080},"timeoutSeconds":5},"replicas":1,"resources":{"limits":{"cpu":"2000m","memory":"2000Mi"},"requests":{"cpu":"2000m","memory":"2000Mi"}},"tolerations":[],"topologySpreadConstraints":{},"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Admin GUI for configuration of the auth-server |
| admin-ui.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| admin-ui.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| admin-ui.customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| admin-ui.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| admin-ui.dnsConfig | object | `{}` | Add custom dns config |
| admin-ui.dnsPolicy | string | `""` | Add custom dns policy |
| admin-ui.hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| admin-ui.hpa.behavior | object | `{}` | Scaling Policies |
| admin-ui.hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| admin-ui.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| admin-ui.image.pullSecrets | list | `[]` | Image Pull Secrets |
| admin-ui.image.repository | string | `"ghcr.io/gluufederation/flex/admin-ui"` | Image  to use for deploying. |
| admin-ui.image.tag | string | `"5.9.0-1"` | Image  tag to use for deploying. |
| admin-ui.livenessProbe | object | `{"failureThreshold":20,"initialDelaySeconds":60,"periodSeconds":25,"tcpSocket":{"port":8080},"timeoutSeconds":5}` | Configure the liveness healthcheck for the admin ui if needed. |
| admin-ui.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| admin-ui.pdb | object | `{"enabled":true,"maxUnavailable":"90%"}` | Configure the PodDisruptionBudget |
| admin-ui.readinessProbe | object | `{"failureThreshold":20,"initialDelaySeconds":60,"periodSeconds":25,"tcpSocket":{"port":8080},"timeoutSeconds":5}` | Configure the readiness healthcheck for the admin ui if needed. |
| admin-ui.replicas | int | `1` | Service replica number. |
| admin-ui.resources | object | `{"limits":{"cpu":"2000m","memory":"2000Mi"},"requests":{"cpu":"2000m","memory":"2000Mi"}}` | Resource specs. |
| admin-ui.resources.limits.cpu | string | `"2000m"` | CPU limit. |
| admin-ui.resources.limits.memory | string | `"2000Mi"` | Memory limit. |
| admin-ui.resources.requests.cpu | string | `"2000m"` | CPU request. |
| admin-ui.resources.requests.memory | string | `"2000Mi"` | Memory request. |
| admin-ui.tolerations | list | `[]` | Add tolerations for the pods |
| admin-ui.topologySpreadConstraints | object | `{}` | Configure the topology spread constraints. Notice this is a map NOT a list as in the upstream API https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| admin-ui.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| admin-ui.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| admin-ui.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| admin-ui.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| admin-ui.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| auth-server | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","hpa":{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50},"image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/auth-server","tag":"1.9.0-1"},"lifecycle":{},"livenessProbe":{"exec":{"command":["python3","/app/scripts/healthcheck.py"]},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5},"nodeSelector":{},"pdb":{"enabled":true,"maxUnavailable":"90%"},"readinessProbe":{"exec":{"command":["python3","/app/scripts/healthcheck.py"]},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5},"replicas":1,"resources":{"limits":{"cpu":"2500m","memory":"2500Mi"},"requests":{"cpu":"2500m","memory":"2500Mi"}},"tolerations":[],"topologySpreadConstraints":{},"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | OAuth Authorization Server, the OpenID Connect Provider, the UMA Authorization Server--this is the main Internet facing component of Gluu. It's the service that returns tokens, JWT's and identity assertions. This service must be Internet facing. |
| auth-server-key-rotation | object | `{"additionalAnnotations":{},"additionalLabels":{},"cronJobSchedule":"","customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/cloudtools","tag":"1.9.0-1"},"keysLife":48,"keysPushDelay":0,"keysPushStrategy":"NEWER","keysStrategy":"NEWER","lifecycle":{},"nodeSelector":{},"resources":{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}},"tolerations":[],"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Responsible for regenerating auth-keys per x hours |
| auth-server-key-rotation.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| auth-server-key-rotation.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| auth-server-key-rotation.cronJobSchedule | string | `""` | Auth server key rotation job schedule. It accepts any Cron syntax supported by Kubernetes. If empty, the schedule will run based on keysLife value. |
| auth-server-key-rotation.customCommand | list | `[]` | Add custom job's command. If passed, it will override the default conditional command. |
| auth-server-key-rotation.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| auth-server-key-rotation.dnsConfig | object | `{}` | Add custom dns config |
| auth-server-key-rotation.dnsPolicy | string | `""` | Add custom dns policy |
| auth-server-key-rotation.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| auth-server-key-rotation.image.pullSecrets | list | `[]` | Image Pull Secrets |
| auth-server-key-rotation.image.repository | string | `"ghcr.io/janssenproject/jans/cloudtools"` | Image  to use for deploying. |
| auth-server-key-rotation.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| auth-server-key-rotation.keysLife | int | `48` | Auth server key rotation keys life in hours |
| auth-server-key-rotation.keysPushDelay | int | `0` | Delay (in seconds) before pushing private keys to Auth server |
| auth-server-key-rotation.keysPushStrategy | string | `"NEWER"` | Set key selection strategy after pushing private keys to Auth server (only takes effect when keysPushDelay value is greater than 0) |
| auth-server-key-rotation.keysStrategy | string | `"NEWER"` | Set key selection strategy used by Auth server |
| auth-server-key-rotation.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| auth-server-key-rotation.resources | object | `{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}}` | Resource specs. |
| auth-server-key-rotation.resources.limits.cpu | string | `"300m"` | CPU limit. |
| auth-server-key-rotation.resources.limits.memory | string | `"300Mi"` | Memory limit. |
| auth-server-key-rotation.resources.requests.cpu | string | `"300m"` | CPU request. |
| auth-server-key-rotation.resources.requests.memory | string | `"300Mi"` | Memory request. |
| auth-server-key-rotation.tolerations | list | `[]` | Add tolerations for the pods |
| auth-server-key-rotation.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| auth-server-key-rotation.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| auth-server-key-rotation.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| auth-server-key-rotation.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| auth-server-key-rotation.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| auth-server.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| auth-server.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| auth-server.customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| auth-server.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| auth-server.dnsConfig | object | `{}` | Add custom dns config |
| auth-server.dnsPolicy | string | `""` | Add custom dns policy |
| auth-server.hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| auth-server.hpa.behavior | object | `{}` | Scaling Policies |
| auth-server.hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| auth-server.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| auth-server.image.pullSecrets | list | `[]` | Image Pull Secrets |
| auth-server.image.repository | string | `"ghcr.io/janssenproject/jans/auth-server"` | Image  to use for deploying. |
| auth-server.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| auth-server.livenessProbe | object | `{"exec":{"command":["python3","/app/scripts/healthcheck.py"]},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5}` | Configure the liveness healthcheck for the auth server if needed. |
| auth-server.livenessProbe.exec | object | `{"command":["python3","/app/scripts/healthcheck.py"]}` | Executes the python3 healthcheck. https://github.com/JanssenProject/docker-jans-auth-server/blob/master/scripts/healthcheck.py |
| auth-server.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| auth-server.pdb | object | `{"enabled":true,"maxUnavailable":"90%"}` | Configure the PodDisruptionBudget |
| auth-server.readinessProbe | object | `{"exec":{"command":["python3","/app/scripts/healthcheck.py"]},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5}` | Configure the readiness healthcheck for the auth server if needed. https://github.com/JanssenProject/docker-jans-auth-server/blob/master/scripts/healthcheck.py |
| auth-server.replicas | int | `1` | Service replica number. |
| auth-server.resources | object | `{"limits":{"cpu":"2500m","memory":"2500Mi"},"requests":{"cpu":"2500m","memory":"2500Mi"}}` | Resource specs. |
| auth-server.resources.limits.cpu | string | `"2500m"` | CPU limit. |
| auth-server.resources.limits.memory | string | `"2500Mi"` | Memory limit. This value is used to calculate memory allocation for Java. Currently it only supports `Mi`. Please refrain from using other units. |
| auth-server.resources.requests.cpu | string | `"2500m"` | CPU request. |
| auth-server.resources.requests.memory | string | `"2500Mi"` | Memory request. |
| auth-server.tolerations | list | `[]` | Add tolerations for the pods |
| auth-server.topologySpreadConstraints | object | `{}` | Configure the topology spread constraints. Notice this is a map NOT a list as in the upstream API https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| auth-server.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| auth-server.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| auth-server.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| auth-server.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| auth-server.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| casa | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","hpa":{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50},"image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/casa","tag":"1.9.0-1"},"lifecycle":{},"livenessProbe":{"httpGet":{"path":"/jans-casa/health-check","port":"http-casa"},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5},"nodeSelector":{},"pdb":{"enabled":true,"maxUnavailable":"90%"},"readinessProbe":{"httpGet":{"path":"/jans-casa/health-check","port":"http-casa"},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5},"replicas":1,"resources":{"limits":{"cpu":"500m","memory":"500Mi"},"requests":{"cpu":"500m","memory":"500Mi"}},"tolerations":[],"topologySpreadConstraints":{},"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Janssen Casa ("Casa") is a self-service web portal for end-users to manage authentication and authorization preferences for their account in a Janssen Auth Server. |
| casa.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| casa.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| casa.customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| casa.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| casa.dnsConfig | object | `{}` | Add custom dns config |
| casa.dnsPolicy | string | `""` | Add custom dns policy |
| casa.hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| casa.hpa.behavior | object | `{}` | Scaling Policies |
| casa.hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| casa.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| casa.image.pullSecrets | list | `[]` | Image Pull Secrets |
| casa.image.repository | string | `"ghcr.io/janssenproject/jans/casa"` | Image  to use for deploying. |
| casa.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| casa.livenessProbe | object | `{"httpGet":{"path":"/jans-casa/health-check","port":"http-casa"},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5}` | Configure the liveness healthcheck for casa if needed. |
| casa.livenessProbe.httpGet.path | string | `"/jans-casa/health-check"` | http liveness probe endpoint |
| casa.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| casa.pdb | object | `{"enabled":true,"maxUnavailable":"90%"}` | Configure the PodDisruptionBudget |
| casa.readinessProbe | object | `{"httpGet":{"path":"/jans-casa/health-check","port":"http-casa"},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5}` | Configure the readiness healthcheck for the casa if needed. |
| casa.readinessProbe.httpGet.path | string | `"/jans-casa/health-check"` | http readiness probe endpoint |
| casa.replicas | int | `1` | Service replica number. |
| casa.resources | object | `{"limits":{"cpu":"500m","memory":"500Mi"},"requests":{"cpu":"500m","memory":"500Mi"}}` | Resource specs. |
| casa.resources.limits.cpu | string | `"500m"` | CPU limit. |
| casa.resources.limits.memory | string | `"500Mi"` | Memory limit. This value is used to calculate memory allocation for Java. Currently it only supports `Mi`. Please refrain from using other units. |
| casa.resources.requests.cpu | string | `"500m"` | CPU request. |
| casa.resources.requests.memory | string | `"500Mi"` | Memory request. |
| casa.tolerations | list | `[]` | Add tolerations for the pods |
| casa.topologySpreadConstraints | object | `{}` | Configure the topology spread constraints. Notice this is a map NOT a list as in the upstream API https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| casa.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| casa.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| casa.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| casa.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| casa.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| cleanup | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/cloudtools","tag":"1.9.0-1"},"interval":60,"lifecycle":{},"limit":1000,"nodeSelector":{},"resources":{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}},"tolerations":[],"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Cleanup expired entries in persistence |
| cleanup.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| cleanup.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| cleanup.customCommand | list | `[]` | Add custom job's command. If passed, it will override the default conditional command. |
| cleanup.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| cleanup.dnsConfig | object | `{}` | Add custom dns config |
| cleanup.dnsPolicy | string | `""` | Add custom dns policy |
| cleanup.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| cleanup.image.pullSecrets | list | `[]` | Image Pull Secrets |
| cleanup.image.repository | string | `"ghcr.io/janssenproject/jans/cloudtools"` | Image  to use for deploying. |
| cleanup.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| cleanup.interval | int | `60` | Interval of running the cleanup process (in minutes) |
| cleanup.limit | int | `1000` | Max. numbers of entries to cleanup |
| cleanup.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| cleanup.resources | object | `{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}}` | Resource specs. |
| cleanup.resources.limits.cpu | string | `"300m"` | CPU limit. |
| cleanup.resources.limits.memory | string | `"300Mi"` | Memory limit. |
| cleanup.resources.requests.cpu | string | `"300m"` | CPU request. |
| cleanup.resources.requests.memory | string | `"300Mi"` | Memory request. |
| cleanup.tolerations | list | `[]` | Add tolerations for the pods |
| cleanup.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| cleanup.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| cleanup.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| cleanup.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| cleanup.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| config | object | `{"additionalAnnotations":{},"additionalLabels":{},"adminPassword":"Test1234#","city":"Austin","configmap":{"cnAwsAccessKeyId":"","cnAwsDefaultRegion":"us-west-1","cnAwsProfile":"gluu","cnAwsSecretAccessKey":"","cnAwsSecretsEndpointUrl":"","cnAwsSecretsNamePrefix":"gluu","cnAwsSecretsReplicaRegions":[],"cnCacheType":"NATIVE_PERSISTENCE","cnConfigKubernetesConfigMap":"cn","cnGoogleProjectId":"google-project-to-save-config-and-secrets-to","cnGoogleSecretManagerServiceAccount":"SWFtTm90YVNlcnZpY2VBY2NvdW50Q2hhbmdlTWV0b09uZQo=","cnGoogleSecretNamePrefix":"gluu","cnGoogleSecretVersionId":"latest","cnJettyRequestHeaderSize":8192,"cnMaxRamPercent":"75.0","cnMessageType":"DISABLED","cnPersistenceHybridMapping":"{}","cnRedisSentinelGroup":"","cnRedisSslTruststore":"","cnRedisType":"STANDALONE","cnRedisUrl":"redis.redis.svc.cluster.local:6379","cnRedisUseSsl":false,"cnScimProtectionMode":"OAUTH","cnSecretKubernetesSecret":"cn","cnSqlDbDialect":"mysql","cnSqlDbHost":"my-release-mysql.default.svc.cluster.local","cnSqlDbName":"gluu","cnSqlDbPort":3306,"cnSqlDbSchema":"","cnSqlDbTimezone":"UTC","cnSqlDbUser":"gluu","cnSqldbUserPassword":"Test1234#","cnVaultAddr":"http://localhost:8200","cnVaultAppRolePath":"approle","cnVaultKvPath":"secret","cnVaultNamespace":"","cnVaultPrefix":"jans","cnVaultRoleId":"","cnVaultRoleIdFile":"/etc/certs/vault_role_id","cnVaultSecretId":"","cnVaultSecretIdFile":"/etc/certs/vault_secret_id","cnVaultVerify":false,"kcAdminPassword":"Test1234#","kcAdminUsername":"admin","kcDbPassword":"Test1234#","kcDbSchema":"keycloak","kcDbUrlDatabase":"keycloak","kcDbUrlHost":"mysql.kc.svc.cluster.local","kcDbUrlPort":3306,"kcDbUrlProperties":"?useUnicode=true&characterEncoding=UTF-8&character_set_server=utf8mb4","kcDbUsername":"keycloak","kcDbVendor":"mysql","kcLogLevel":"INFO","lbAddr":"","quarkusTransactionEnableRecovery":true},"countryCode":"US","customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","email":"team@gluu.org","image":{"pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/configurator","tag":"1.9.0-1"},"lifecycle":{},"migration":{"enabled":false,"migrationDataFormat":"ldif","migrationDir":"/ce-migration"},"nodeSelector":{},"orgName":"Gluu","redisPassword":"P@assw0rd","resources":{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}},"salt":"","state":"TX","tolerations":[],"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Configuration parameters for setup and initial configuration secret and config layers used by Gluu services. |
| config-api | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","hpa":{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50},"image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/config-api","tag":"1.9.0-1"},"lifecycle":{},"livenessProbe":{"httpGet":{"path":"/jans-config-api/api/v1/health/live","port":8074},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5},"nodeSelector":{},"pdb":{"enabled":true,"maxUnavailable":"90%"},"readinessProbe":{"httpGet":{"path":"jans-config-api/api/v1/health/ready","port":8074},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5},"replicas":1,"resources":{"limits":{"cpu":"1000m","memory":"1200Mi"},"requests":{"cpu":"1000m","memory":"1200Mi"}},"tolerations":[],"topologySpreadConstraints":{},"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Config Api endpoints can be used to configure the auth-server, which is an open-source OpenID Connect Provider (OP) and UMA Authorization Server (AS). |
| config-api.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| config-api.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| config-api.customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| config-api.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| config-api.dnsConfig | object | `{}` | Add custom dns config |
| config-api.dnsPolicy | string | `""` | Add custom dns policy |
| config-api.hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| config-api.hpa.behavior | object | `{}` | Scaling Policies |
| config-api.hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| config-api.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| config-api.image.pullSecrets | list | `[]` | Image Pull Secrets |
| config-api.image.repository | string | `"ghcr.io/janssenproject/jans/config-api"` | Image  to use for deploying. |
| config-api.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| config-api.livenessProbe | object | `{"httpGet":{"path":"/jans-config-api/api/v1/health/live","port":8074},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5}` | Configure the liveness healthcheck for the auth server if needed. |
| config-api.livenessProbe.httpGet | object | `{"path":"/jans-config-api/api/v1/health/live","port":8074}` | http liveness probe endpoint |
| config-api.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| config-api.pdb | object | `{"enabled":true,"maxUnavailable":"90%"}` | Configure the PodDisruptionBudget |
| config-api.readinessProbe.httpGet | object | `{"path":"jans-config-api/api/v1/health/ready","port":8074}` | http readiness probe endpoint |
| config-api.replicas | int | `1` | Service replica number. |
| config-api.resources | object | `{"limits":{"cpu":"1000m","memory":"1200Mi"},"requests":{"cpu":"1000m","memory":"1200Mi"}}` | Resource specs. |
| config-api.resources.limits.cpu | string | `"1000m"` | CPU limit. |
| config-api.resources.limits.memory | string | `"1200Mi"` | Memory limit. This value is used to calculate memory allocation for Java. Currently it only supports `Mi`. Please refrain from using other units. |
| config-api.resources.requests.cpu | string | `"1000m"` | CPU request. |
| config-api.resources.requests.memory | string | `"1200Mi"` | Memory request. |
| config-api.tolerations | list | `[]` | Add tolerations for the pods |
| config-api.topologySpreadConstraints | object | `{}` | Configure the topology spread constraints. Notice this is a map NOT a list as in the upstream API https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| config-api.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| config-api.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| config-api.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| config-api.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| config-api.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| config.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| config.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| config.adminPassword | string | `"Test1234#"` | Admin password to log in to the UI. |
| config.city | string | `"Austin"` | City. Used for certificate creation. |
| config.configmap.cnCacheType | string | `"NATIVE_PERSISTENCE"` | Cache type. `NATIVE_PERSISTENCE`, `REDIS`. or `IN_MEMORY`. Defaults to `NATIVE_PERSISTENCE` . |
| config.configmap.cnConfigKubernetesConfigMap | string | `"cn"` | The name of the Kubernetes ConfigMap that will hold the configuration layer |
| config.configmap.cnGoogleProjectId | string | `"google-project-to-save-config-and-secrets-to"` | Project id of the Google project the secret manager belongs to. Used only when global.configAdapterName and global.configSecretAdapter is set to google. |
| config.configmap.cnGoogleSecretManagerServiceAccount | string | `"SWFtTm90YVNlcnZpY2VBY2NvdW50Q2hhbmdlTWV0b09uZQo="` | Service account with roles roles/secretmanager.admin base64 encoded string. This is used often inside the services to reach the configuration layer. Used only when global.configAdapterName and global.configSecretAdapter is set to google. |
| config.configmap.cnGoogleSecretNamePrefix | string | `"gluu"` | Prefix for Gluu secret in Google Secret Manager. Defaults to gluu. If left gluu-secret secret will be created. Used only when global.configAdapterName and global.configSecretAdapter is set to google. |
| config.configmap.cnGoogleSecretVersionId | string | `"latest"` | Secret version to be used for secret configuration. Defaults to latest and should normally always stay that way. Used only when global.configAdapterName and global.configSecretAdapter is set to google. |
| config.configmap.cnJettyRequestHeaderSize | int | `8192` | Jetty header size in bytes in the auth server |
| config.configmap.cnMaxRamPercent | string | `"75.0"` | Value passed to Java option -XX:MaxRAMPercentage |
| config.configmap.cnMessageType | string | `"DISABLED"` | Message type (one of POSTGRES, REDIS, or DISABLED) |
| config.configmap.cnPersistenceHybridMapping | string | `"{}"` | Specify data that should be saved in persistence (one of default, user, cache, site, token, or session; default to default). Note this environment only takes effect when `global.cnPersistenceType`  is set to `hybrid`. {  "default": "<sql>",  "user": "<sql>",  "site": "<sql>",  "cache": "<sql>",  "token": "<sql>",  "session": "<sql>", } |
| config.configmap.cnRedisSentinelGroup | string | `""` | Redis Sentinel Group. Often set when `config.configmap.cnRedisType` is set to `SENTINEL`. Can be used when  `config.configmap.cnCacheType` is set to `REDIS`. |
| config.configmap.cnRedisSslTruststore | string | `""` | Redis SSL truststore. Optional. Can be used when  `config.configmap.cnCacheType` is set to `REDIS`. |
| config.configmap.cnRedisType | string | `"STANDALONE"` | Redis service type. `STANDALONE` or `CLUSTER`. Can be used when  `config.configmap.cnCacheType` is set to `REDIS`. |
| config.configmap.cnRedisUrl | string | `"redis.redis.svc.cluster.local:6379"` | Redis URL and port number <url>:<port>. Can be used when  `config.configmap.cnCacheType` is set to `REDIS`. |
| config.configmap.cnRedisUseSsl | bool | `false` | Boolean to use SSL in Redis. Can be used when  `config.configmap.cnCacheType` is set to `REDIS`. |
| config.configmap.cnScimProtectionMode | string | `"OAUTH"` | SCIM protection mode OAUTH|TEST|UMA |
| config.configmap.cnSecretKubernetesSecret | string | `"cn"` | Kubernetes secret name holding configuration keys. Used when global.configSecretAdapter is set to kubernetes which is the default. |
| config.configmap.cnSqlDbDialect | string | `"mysql"` | SQL database dialect. `mysql` or `pgsql` |
| config.configmap.cnSqlDbHost | string | `"my-release-mysql.default.svc.cluster.local"` | SQL database host uri. |
| config.configmap.cnSqlDbName | string | `"gluu"` | SQL database name. |
| config.configmap.cnSqlDbPort | int | `3306` | SQL database port. |
| config.configmap.cnSqlDbSchema | string | `""` | Schema name used by SQL database (default to empty-string; if using MySQL, the schema name will be resolved as the database name, whereas in PostgreSQL the schema name will be resolved as `"public"`). |
| config.configmap.cnSqlDbTimezone | string | `"UTC"` | SQL database timezone. |
| config.configmap.cnSqlDbUser | string | `"gluu"` | SQL database username. |
| config.configmap.cnSqldbUserPassword | string | `"Test1234#"` | SQL password  injected the secrets . |
| config.configmap.cnVaultAddr | string | `"http://localhost:8200"` | Base URL of Vault. |
| config.configmap.cnVaultAppRolePath | string | `"approle"` | Path to Vault AppRole. |
| config.configmap.cnVaultKvPath | string | `"secret"` | Path to Vault KV secrets engine. |
| config.configmap.cnVaultNamespace | string | `""` | Vault namespace used to access the secrets. |
| config.configmap.cnVaultPrefix | string | `"jans"` | Base prefix name used to access secrets. |
| config.configmap.cnVaultRoleId | string | `""` | Vault AppRole RoleID. |
| config.configmap.cnVaultRoleIdFile | string | `"/etc/certs/vault_role_id"` | Path to file contains Vault AppRole role ID. |
| config.configmap.cnVaultSecretId | string | `""` | Vault AppRole SecretID. |
| config.configmap.cnVaultSecretIdFile | string | `"/etc/certs/vault_secret_id"` | Path to file contains Vault AppRole secret ID. |
| config.configmap.cnVaultVerify | bool | `false` | Verify connection to Vault. |
| config.configmap.kcAdminPassword | string | `"Test1234#"` | Keycloak  admin UI password |
| config.configmap.kcAdminUsername | string | `"admin"` | Keycloak admin UI username |
| config.configmap.kcDbPassword | string | `"Test1234#"` | Password for Keycloak database access |
| config.configmap.kcDbSchema | string | `"keycloak"` | Keycloak database schema name (note that PostgreSQL may be using "public" schema). |
| config.configmap.kcDbUrlDatabase | string | `"keycloak"` | Keycloak database name. |
| config.configmap.kcDbUrlHost | string | `"mysql.kc.svc.cluster.local"` | Keycloak database host uri |
| config.configmap.kcDbUrlPort | int | `3306` | Keycloak database port (default to port 3306 for mysql). |
| config.configmap.kcDbUrlProperties | string | `"?useUnicode=true&characterEncoding=UTF-8&character_set_server=utf8mb4"` | Keycloak database connection properties. If using postgresql, the value can be set to empty string. |
| config.configmap.kcDbUsername | string | `"keycloak"` | Keycloak database username |
| config.configmap.kcDbVendor | string | `"mysql"` | Keycloak database vendor name (default to MySQL server). To use PostgreSQL server, change the value to postgres. |
| config.configmap.kcLogLevel | string | `"INFO"` | Keycloak logging level |
| config.configmap.lbAddr | string | `""` | Load balancer address for AWS if the FQDN is not registered. |
| config.configmap.quarkusTransactionEnableRecovery | bool | `true` | Quarkus transaction recovery. When using MySQL, there could be issue regarding XA_RECOVER_ADMIN; refer to https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_xa-recover-admin for details. |
| config.countryCode | string | `"US"` | Country code. Used for certificate creation. |
| config.customCommand | list | `[]` | Add custom job's command. If passed, it will override the default conditional command. |
| config.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| config.dnsConfig | object | `{}` | Add custom dns config |
| config.dnsPolicy | string | `""` | Add custom dns policy |
| config.email | string | `"team@gluu.org"` | Email address of the administrator usually. Used for certificate creation. |
| config.image.pullSecrets | list | `[]` | Image Pull Secrets |
| config.image.repository | string | `"ghcr.io/janssenproject/jans/configurator"` | Image  to use for deploying. |
| config.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| config.migration | object | `{"enabled":false,"migrationDataFormat":"ldif","migrationDir":"/ce-migration"}` | CE to CN Migration section |
| config.migration.enabled | bool | `false` | Boolean flag to enable migration from CE |
| config.migration.migrationDataFormat | string | `"ldif"` | migration data-format depending on persistence backend. Supported data formats are ldif, postgresql+json, and mysql+json. |
| config.migration.migrationDir | string | `"/ce-migration"` | Directory holding all migration files |
| config.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| config.orgName | string | `"Gluu"` | Organization name. Used for certificate creation. |
| config.redisPassword | string | `"P@assw0rd"` | Redis admin password if `config.configmap.cnCacheType` is set to `REDIS`. |
| config.resources | object | `{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}}` | Resource specs. |
| config.resources.limits.cpu | string | `"300m"` | CPU limit. |
| config.resources.limits.memory | string | `"300Mi"` | Memory limit. |
| config.resources.requests.cpu | string | `"300m"` | CPU request. |
| config.resources.requests.memory | string | `"300Mi"` | Memory request. |
| config.salt | string | `""` | Salt. Used for encoding/decoding sensitive data. If omitted or set to empty string, the value will be self-generated. Otherwise, a 24 alphanumeric characters are allowed as its value. |
| config.state | string | `"TX"` | State code. Used for certificate creation. |
| config.tolerations | list | `[]` | Add tolerations for the pods |
| config.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service. |
| config.usrEnvs.normal | object | `{}` | Add custom normal envs to the service. variable1: value1 |
| config.usrEnvs.secret | object | `{}` | Add custom secret envs to the service. variable1: value1 |
| config.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| config.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| fido2 | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","hpa":{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50},"image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/fido2","tag":"1.9.0-1"},"lifecycle":{},"livenessProbe":{"httpGet":{"path":"/jans-fido2/sys/health-check","port":"http-fido2"},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5},"nodeSelector":{},"pdb":{"enabled":true,"maxUnavailable":"90%"},"readinessProbe":{"httpGet":{"path":"/jans-fido2/sys/health-check","port":"http-fido2"},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5},"replicas":1,"resources":{"limits":{"cpu":"500m","memory":"500Mi"},"requests":{"cpu":"500m","memory":"500Mi"}},"service":{"name":"http-fido2","port":8080},"tolerations":[],"topologySpreadConstraints":{},"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | FIDO 2.0 (FIDO2) is an open authentication standard that enables leveraging common devices to authenticate to online services in both mobile and desktop environments. |
| fido2.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| fido2.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| fido2.customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| fido2.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| fido2.dnsConfig | object | `{}` | Add custom dns config |
| fido2.dnsPolicy | string | `""` | Add custom dns policy |
| fido2.hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| fido2.hpa.behavior | object | `{}` | Scaling Policies |
| fido2.hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| fido2.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| fido2.image.pullSecrets | list | `[]` | Image Pull Secrets |
| fido2.image.repository | string | `"ghcr.io/janssenproject/jans/fido2"` | Image  to use for deploying. |
| fido2.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| fido2.livenessProbe | object | `{"httpGet":{"path":"/jans-fido2/sys/health-check","port":"http-fido2"},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5}` | Configure the liveness healthcheck for the fido2 if needed. |
| fido2.livenessProbe.httpGet | object | `{"path":"/jans-fido2/sys/health-check","port":"http-fido2"}` | http liveness probe endpoint |
| fido2.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| fido2.pdb | object | `{"enabled":true,"maxUnavailable":"90%"}` | Configure the PodDisruptionBudget |
| fido2.readinessProbe | object | `{"httpGet":{"path":"/jans-fido2/sys/health-check","port":"http-fido2"},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5}` | Configure the readiness healthcheck for the fido2 if needed. |
| fido2.replicas | int | `1` | Service replica number. |
| fido2.resources | object | `{"limits":{"cpu":"500m","memory":"500Mi"},"requests":{"cpu":"500m","memory":"500Mi"}}` | Resource specs. |
| fido2.resources.limits.cpu | string | `"500m"` | CPU limit. |
| fido2.resources.limits.memory | string | `"500Mi"` | Memory limit. This value is used to calculate memory allocation for Java. Currently it only supports `Mi`. Please refrain from using other units. |
| fido2.resources.requests.cpu | string | `"500m"` | CPU request. |
| fido2.resources.requests.memory | string | `"500Mi"` | Memory request. |
| fido2.service.name | string | `"http-fido2"` | The name of the fido2 port within the fido2 service. Please keep it as default. |
| fido2.service.port | int | `8080` | Port of the fido2 service. Please keep it as default. |
| fido2.tolerations | list | `[]` | Add tolerations for the pods |
| fido2.topologySpreadConstraints | object | `{}` | Configure the topology spread constraints. Notice this is a map NOT a list as in the upstream API https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| fido2.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| fido2.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| fido2.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| fido2.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| fido2.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| global | object | `{"admin-ui":{"adminUiServiceName":"admin-ui","customAnnotations":{"deployment":{},"destinationRule":{},"horizontalPodAutoscaler":{},"pod":{},"podDisruptionBudget":{},"secret":{},"service":{},"virtualService":{}},"enabled":true,"ingress":{"adminUiAdditionalAnnotations":{},"adminUiEnabled":false,"adminUiLabels":{}}},"alb":{"ingress":false},"auth-server":{"appLoggers":{"auditStatsLogLevel":"INFO","auditStatsLogTarget":"FILE","authLogLevel":"INFO","authLogTarget":"STDOUT","enableStdoutLogPrefix":"true","httpLogLevel":"INFO","httpLogTarget":"FILE","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scriptLogLevel":"INFO","scriptLogTarget":"FILE"},"authEncKeys":"RSA1_5 RSA-OAEP","authServerServiceName":"auth-server","authSigKeys":"RS256 RS384 RS512 ES256 ES384 ES512 PS256 PS384 PS512","cnCustomJavaOptions":"","customAnnotations":{"deployment":{},"destinationRule":{},"horizontalPodAutoscaler":{},"pod":{},"podDisruptionBudget":{},"secret":{},"service":{},"virtualService":{}},"enabled":true,"ingress":{"authServerAdditionalAnnotations":{},"authServerEnabled":true,"authServerLabels":{},"authServerProtectedRegister":false,"authServerProtectedRegisterAdditionalAnnotations":{},"authServerProtectedRegisterLabels":{},"authServerProtectedToken":false,"authServerProtectedTokenAdditionalAnnotations":{},"authServerProtectedTokenLabels":{},"authzenAdditionalAnnotations":{},"authzenConfigEnabled":true,"authzenConfigLabels":{},"deviceCodeAdditionalAnnotations":{},"deviceCodeEnabled":true,"deviceCodeLabels":{},"firebaseMessagingAdditionalAnnotations":{},"firebaseMessagingEnabled":true,"firebaseMessagingLabels":{},"lockAdditionalAnnotations":{},"lockConfigAdditionalAnnotations":{},"lockConfigEnabled":false,"lockConfigLabels":{},"lockEnabled":false,"lockLabels":{},"openidAdditionalAnnotations":{},"openidConfigEnabled":true,"openidConfigLabels":{},"u2fAdditionalAnnotations":{},"u2fConfigEnabled":true,"u2fConfigLabels":{},"uma2AdditionalAnnotations":{},"uma2ConfigEnabled":true,"uma2ConfigLabels":{},"webdiscoveryAdditionalAnnotations":{},"webdiscoveryEnabled":true,"webdiscoveryLabels":{},"webfingerAdditionalAnnotations":{},"webfingerEnabled":true,"webfingerLabels":{}},"lockEnabled":false},"auth-server-key-rotation":{"customAnnotations":{"cronjob":{},"secret":{},"service":{}},"enabled":true,"initKeysLife":48},"awsStorageType":"io1","azureStorageAccountType":"Standard_LRS","azureStorageKind":"Managed","casa":{"appLoggers":{"casaLogLevel":"INFO","casaLogTarget":"STDOUT","enableStdoutLogPrefix":"true","timerLogLevel":"INFO","timerLogTarget":"FILE"},"casaServiceName":"casa","cnCustomJavaOptions":"","customAnnotations":{"deployment":{},"destinationRule":{},"horizontalPodAutoscaler":{},"pod":{},"podDisruptionBudget":{},"secret":{},"service":{},"virtualService":{}},"enabled":true,"ingress":{"casaAdditionalAnnotations":{},"casaEnabled":false,"casaLabels":{}}},"cleanup":{"enabled":true},"cloud":{"testEnviroment":false},"cnAwsConfigFile":"/etc/jans/conf/aws_config_file","cnAwsSecretsReplicaRegionsFile":"/etc/jans/conf/aws_secrets_replica_regions","cnAwsSharedCredentialsFile":"/etc/jans/conf/aws_shared_credential_file","cnConfiguratorConfigurationFile":"/etc/jans/conf/configuration.json","cnConfiguratorCustomSchema":{"secretName":""},"cnConfiguratorDumpFile":"/etc/jans/conf/configuration.out.json","cnConfiguratorKey":"","cnConfiguratorKeyFile":"/etc/jans/conf/configuration.key","cnDocumentStoreType":"DB","cnGoogleApplicationCredentials":"/etc/jans/conf/google-credentials.json","cnObExtSigningAlias":"","cnObExtSigningJwksCrt":"","cnObExtSigningJwksKey":"","cnObExtSigningJwksKeyPassPhrase":"","cnObExtSigningJwksUri":"","cnObStaticSigningKeyKid":"","cnObTransportAlias":"","cnObTransportCrt":"","cnObTransportKey":"","cnObTransportKeyPassPhrase":"","cnObTransportTrustStore":"","cnPersistenceType":"sql","cnPrometheusPort":"","cnSqlPasswordFile":"/etc/jans/conf/sql_password","config":{"customAnnotations":{"clusterRoleBinding":{},"configMap":{},"job":{},"role":{},"roleBinding":{},"secret":{},"service":{},"serviceAccount":{}},"enabled":true},"config-api":{"adminUiAppLoggers":{"adminUiAuditLogLevel":"INFO","adminUiAuditLogTarget":"FILE","adminUiLogLevel":"INFO","adminUiLogTarget":"FILE","enableStdoutLogPrefix":"true"},"appLoggers":{"configApiLogLevel":"INFO","configApiLogTarget":"STDOUT","enableStdoutLogPrefix":"true","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scriptLogLevel":"INFO","scriptLogTarget":"FILE"},"cnCustomJavaOptions":"","configApiServerServiceName":"config-api","customAnnotations":{"deployment":{},"destinationRule":{},"horizontalPodAutoscaler":{},"pod":{},"podDisruptionBudget":{},"service":{},"virtualService":{}},"enabled":true,"ingress":{"configApiAdditionalAnnotations":{},"configApiEnabled":true,"configApiLabels":{}},"plugins":"admin-ui,fido2,scim,user-mgt"},"configAdapterName":"kubernetes","configSecretAdapter":"kubernetes","distribution":"default","fido2":{"appLoggers":{"enableStdoutLogPrefix":"true","fido2LogLevel":"INFO","fido2LogTarget":"STDOUT","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scriptLogLevel":"INFO","scriptLogTarget":"FILE"},"cnCustomJavaOptions":"","customAnnotations":{"deployment":{},"destinationRule":{},"horizontalPodAutoscaler":{},"pod":{},"podDisruptionBudget":{},"secret":{},"service":{},"virtualService":{}},"enabled":true,"fido2ServiceName":"fido2","ingress":{"fido2AdditionalAnnotations":{},"fido2ConfigAdditionalAnnotations":{},"fido2ConfigEnabled":false,"fido2ConfigLabels":{},"fido2Enabled":false,"fido2Labels":{},"fido2WebauthnAdditionalAnnotations":{},"fido2WebauthnEnabled":false,"fido2WebauthnLabels":{}}},"fqdn":"demoexample.gluu.org","gcePdStorageType":"pd-standard","isFqdnRegistered":false,"istio":{"additionalAnnotations":{},"additionalLabels":{},"enabled":false,"gateways":[],"ingress":false,"namespace":"istio-system"},"jobTtlSecondsAfterFinished":300,"kc-scheduler":{"enabled":false},"lbIp":"22.22.22.22","nginx-ingress":{"enabled":true},"persistence":{"customAnnotations":{"job":{},"secret":{},"service":{}},"enabled":true},"saml":{"cnCustomJavaOptions":"","customAnnotations":{"deployment":{},"destinationRule":{},"horizontalPodAutoscaler":{},"pod":{},"podDisruptionBudget":{},"secret":{},"service":{},"virtualService":{}},"enabled":false,"ingress":{"samlAdditionalAnnotations":{},"samlEnabled":false,"samlLabels":{}},"samlServiceName":"saml"},"scim":{"appLoggers":{"enableStdoutLogPrefix":"true","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scimLogLevel":"INFO","scimLogTarget":"STDOUT","scriptLogLevel":"INFO","scriptLogTarget":"FILE"},"cnCustomJavaOptions":"","customAnnotations":{"deployment":{},"destinationRule":{},"horizontalPodAutoscaler":{},"pod":{},"podDisruptionBudget":{},"secret":{},"service":{},"virtualService":{}},"enabled":true,"ingress":{"scimAdditionalAnnotations":{},"scimConfigAdditionalAnnotations":{},"scimConfigEnabled":false,"scimConfigLabels":{},"scimEnabled":false,"scimLabels":{}},"scimServiceName":"scim"},"serviceAccountName":"default","storageClass":{"allowVolumeExpansion":true,"allowedTopologies":[],"mountOptions":["debug"],"parameters":{},"provisioner":"microk8s.io/hostpath","reclaimPolicy":"Retain","volumeBindingMode":"WaitForFirstConsumer"},"usrEnvs":{"normal":{},"secret":{}}}` | Parameters used globally across all services helm charts. |
| global.admin-ui.adminUiServiceName | string | `"admin-ui"` | Name of the admin-ui service. Please keep it as default. |
| global.admin-ui.enabled | bool | `true` | Boolean flag to enable/disable the admin-ui chart and admin ui config api plugin. |
| global.admin-ui.ingress.adminUiAdditionalAnnotations | object | `{}` | Admin UI ingress resource additional annotations. |
| global.admin-ui.ingress.adminUiEnabled | bool | `false` | Enable Admin UI endpoints in either istio or nginx ingress depending on users choice |
| global.admin-ui.ingress.adminUiLabels | object | `{}` | Admin UI ingress resource labels. key app is taken. |
| global.alb.ingress | bool | `false` | Activates ALB ingress |
| global.auth-server-key-rotation.enabled | bool | `true` | Boolean flag to enable/disable the auth-server-key rotation cronjob chart. |
| global.auth-server-key-rotation.initKeysLife | int | `48` | The initial auth server key rotation keys life in hours |
| global.auth-server.appLoggers | object | `{"auditStatsLogLevel":"INFO","auditStatsLogTarget":"FILE","authLogLevel":"INFO","authLogTarget":"STDOUT","enableStdoutLogPrefix":"true","httpLogLevel":"INFO","httpLogTarget":"FILE","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scriptLogLevel":"INFO","scriptLogTarget":"FILE"}` | App loggers can be configured to define where the logs will be redirected to and the level of each in which it should be displayed. |
| global.auth-server.appLoggers.auditStatsLogLevel | string | `"INFO"` | jans-auth_audit.log level |
| global.auth-server.appLoggers.auditStatsLogTarget | string | `"FILE"` | jans-auth_script.log target |
| global.auth-server.appLoggers.authLogLevel | string | `"INFO"` | jans-auth.log level |
| global.auth-server.appLoggers.authLogTarget | string | `"STDOUT"` | jans-auth.log target |
| global.auth-server.appLoggers.enableStdoutLogPrefix | string | `"true"` | Enable log prefixing which enables prepending the STDOUT logs with the file name. i.e auth-server-script ===> 2022-12-20 17:49:55,744 INFO |
| global.auth-server.appLoggers.httpLogLevel | string | `"INFO"` | http_request_response.log level |
| global.auth-server.appLoggers.httpLogTarget | string | `"FILE"` | http_request_response.log target |
| global.auth-server.appLoggers.persistenceDurationLogLevel | string | `"INFO"` | jans-auth_persistence_duration.log level |
| global.auth-server.appLoggers.persistenceDurationLogTarget | string | `"FILE"` | jans-auth_persistence_duration.log target |
| global.auth-server.appLoggers.persistenceLogLevel | string | `"INFO"` | jans-auth_persistence.log level |
| global.auth-server.appLoggers.persistenceLogTarget | string | `"FILE"` | jans-auth_persistence.log target |
| global.auth-server.appLoggers.scriptLogLevel | string | `"INFO"` | jans-auth_script.log level |
| global.auth-server.appLoggers.scriptLogTarget | string | `"FILE"` | jans-auth_script.log target |
| global.auth-server.authEncKeys | string | `"RSA1_5 RSA-OAEP"` | space-separated key algorithm for encryption (default to `RSA1_5 RSA-OAEP`) |
| global.auth-server.authServerServiceName | string | `"auth-server"` | Name of the auth-server service. Please keep it as default. |
| global.auth-server.authSigKeys | string | `"RS256 RS384 RS512 ES256 ES384 ES512 PS256 PS384 PS512"` | space-separated key algorithm for signing (default to `RS256 RS384 RS512 ES256 ES384 ES512 PS256 PS384 PS512`) |
| global.auth-server.cnCustomJavaOptions | string | `""` | passing custom java options to auth-server. Notice you do not need to pass in any loggers options as they are introduced below in appLoggers. DO NOT PASS JAVA_OPTIONS in envs. |
| global.auth-server.enabled | bool | `true` | Boolean flag to enable/disable auth-server chart. You should never set this to false. |
| global.auth-server.ingress | object | `{"authServerAdditionalAnnotations":{},"authServerEnabled":true,"authServerLabels":{},"authServerProtectedRegister":false,"authServerProtectedRegisterAdditionalAnnotations":{},"authServerProtectedRegisterLabels":{},"authServerProtectedToken":false,"authServerProtectedTokenAdditionalAnnotations":{},"authServerProtectedTokenLabels":{},"authzenAdditionalAnnotations":{},"authzenConfigEnabled":true,"authzenConfigLabels":{},"deviceCodeAdditionalAnnotations":{},"deviceCodeEnabled":true,"deviceCodeLabels":{},"firebaseMessagingAdditionalAnnotations":{},"firebaseMessagingEnabled":true,"firebaseMessagingLabels":{},"lockAdditionalAnnotations":{},"lockConfigAdditionalAnnotations":{},"lockConfigEnabled":false,"lockConfigLabels":{},"lockEnabled":false,"lockLabels":{},"openidAdditionalAnnotations":{},"openidConfigEnabled":true,"openidConfigLabels":{},"u2fAdditionalAnnotations":{},"u2fConfigEnabled":true,"u2fConfigLabels":{},"uma2AdditionalAnnotations":{},"uma2ConfigEnabled":true,"uma2ConfigLabels":{},"webdiscoveryAdditionalAnnotations":{},"webdiscoveryEnabled":true,"webdiscoveryLabels":{},"webfingerAdditionalAnnotations":{},"webfingerEnabled":true,"webfingerLabels":{}}` | Enable endpoints in either istio or nginx ingress depending on users choice |
| global.auth-server.ingress.authServerAdditionalAnnotations | object | `{}` | Auth server ingress resource additional annotations. |
| global.auth-server.ingress.authServerEnabled | bool | `true` | Enable Auth server endpoints /jans-auth |
| global.auth-server.ingress.authServerLabels | object | `{}` | Auth server ingress resource labels. key app is taken |
| global.auth-server.ingress.authServerProtectedRegister | bool | `false` | Enable mTLS onn Auth server endpoint /jans-auth/restv1/register. Currently not working in Istio. |
| global.auth-server.ingress.authServerProtectedRegisterAdditionalAnnotations | object | `{}` | Auth server protected register ingress resource additional annotations. |
| global.auth-server.ingress.authServerProtectedRegisterLabels | object | `{}` | Auth server protected token ingress resource labels. key app is taken |
| global.auth-server.ingress.authServerProtectedToken | bool | `false` | Enable mTLS on Auth server endpoint /jans-auth/restv1/token. Currently not working in Istio. |
| global.auth-server.ingress.authServerProtectedTokenAdditionalAnnotations | object | `{}` | Auth server protected token ingress resource additional annotations. |
| global.auth-server.ingress.authServerProtectedTokenLabels | object | `{}` | Auth server protected token ingress resource labels. key app is taken |
| global.auth-server.ingress.authzenAdditionalAnnotations | object | `{}` | authzen config ingress resource additional annotations. |
| global.auth-server.ingress.authzenConfigEnabled | bool | `true` | Enable endpoint /.well-known/authzen-configuration |
| global.auth-server.ingress.authzenConfigLabels | object | `{}` | authzen config ingress resource labels. key app is taken |
| global.auth-server.ingress.deviceCodeAdditionalAnnotations | object | `{}` | device-code ingress resource additional annotations. |
| global.auth-server.ingress.deviceCodeEnabled | bool | `true` | Enable endpoint /device-code |
| global.auth-server.ingress.deviceCodeLabels | object | `{}` | device-code ingress resource labels. key app is taken |
| global.auth-server.ingress.firebaseMessagingAdditionalAnnotations | object | `{}` | Firebase Messaging ingress resource additional annotations. |
| global.auth-server.ingress.firebaseMessagingEnabled | bool | `true` | Enable endpoint /firebase-messaging-sw.js |
| global.auth-server.ingress.firebaseMessagingLabels | object | `{}` | Firebase Messaging ingress resource labels. key app is taken |
| global.auth-server.ingress.lockAdditionalAnnotations | object | `{}` | Lock ingress resource additional annotations. |
| global.auth-server.ingress.lockConfigAdditionalAnnotations | object | `{}` | Lock config ingress resource additional annotations. |
| global.auth-server.ingress.lockConfigEnabled | bool | `false` | Enable endpoint /.well-known/lock-server-configuration |
| global.auth-server.ingress.lockConfigLabels | object | `{}` | Lock config ingress resource labels. key app is taken |
| global.auth-server.ingress.lockEnabled | bool | `false` | Enable endpoint /jans-lock |
| global.auth-server.ingress.lockLabels | object | `{}` | Lock ingress resource labels. key app is taken |
| global.auth-server.ingress.openidAdditionalAnnotations | object | `{}` | openid-configuration ingress resource additional annotations. |
| global.auth-server.ingress.openidConfigEnabled | bool | `true` | Enable endpoint /.well-known/openid-configuration |
| global.auth-server.ingress.openidConfigLabels | object | `{}` | openid-configuration ingress resource labels. key app is taken |
| global.auth-server.ingress.u2fAdditionalAnnotations | object | `{}` | u2f config ingress resource additional annotations. |
| global.auth-server.ingress.u2fConfigEnabled | bool | `true` | Enable endpoint /.well-known/fido-configuration |
| global.auth-server.ingress.u2fConfigLabels | object | `{}` | u2f config ingress resource labels. key app is taken |
| global.auth-server.ingress.uma2AdditionalAnnotations | object | `{}` | uma2 config ingress resource additional annotations. |
| global.auth-server.ingress.uma2ConfigEnabled | bool | `true` | Enable endpoint /.well-known/uma2-configuration |
| global.auth-server.ingress.uma2ConfigLabels | object | `{}` | uma2 config ingress resource labels. key app is taken |
| global.auth-server.ingress.webdiscoveryAdditionalAnnotations | object | `{}` | webdiscovery ingress resource additional annotations. |
| global.auth-server.ingress.webdiscoveryEnabled | bool | `true` | Enable endpoint /.well-known/simple-web-discovery |
| global.auth-server.ingress.webdiscoveryLabels | object | `{}` | webdiscovery ingress resource labels. key app is taken |
| global.auth-server.ingress.webfingerAdditionalAnnotations | object | `{}` | webfinger ingress resource additional annotations. |
| global.auth-server.ingress.webfingerEnabled | bool | `true` | Enable endpoint /.well-known/webfinger |
| global.auth-server.ingress.webfingerLabels | object | `{}` | webfinger ingress resource labels. key app is taken |
| global.auth-server.lockEnabled | bool | `false` | Enable jans-lock as service running inside auth-server |
| global.awsStorageType | string | `"io1"` | Volume storage type if using AWS volumes. |
| global.azureStorageAccountType | string | `"Standard_LRS"` | Volume storage type if using Azure disks. |
| global.azureStorageKind | string | `"Managed"` | Azure storage kind if using Azure disks |
| global.casa.appLoggers | object | `{"casaLogLevel":"INFO","casaLogTarget":"STDOUT","enableStdoutLogPrefix":"true","timerLogLevel":"INFO","timerLogTarget":"FILE"}` | App loggers can be configured to define where the logs will be redirected to and the level of each in which it should be displayed. |
| global.casa.appLoggers.casaLogLevel | string | `"INFO"` | casa.log level |
| global.casa.appLoggers.casaLogTarget | string | `"STDOUT"` | casa.log target |
| global.casa.appLoggers.enableStdoutLogPrefix | string | `"true"` | Enable log prefixing which enables prepending the STDOUT logs with the file name. i.e casa ===> 2022-12-20 17:49:55,744 INFO |
| global.casa.appLoggers.timerLogLevel | string | `"INFO"` | casa timer log level |
| global.casa.appLoggers.timerLogTarget | string | `"FILE"` | casa timer log target |
| global.casa.casaServiceName | string | `"casa"` | Name of the casa service. Please keep it as default. |
| global.casa.cnCustomJavaOptions | string | `""` | passing custom java options to casa. Notice you do not need to pass in any loggers options as they are introduced below in appLoggers. DO NOT PASS JAVA_OPTIONS in envs. |
| global.casa.enabled | bool | `true` | Boolean flag to enable/disable the casa chart. |
| global.casa.ingress | object | `{"casaAdditionalAnnotations":{},"casaEnabled":false,"casaLabels":{}}` | Enable endpoints in either istio or nginx ingress depending on users choice |
| global.casa.ingress.casaAdditionalAnnotations | object | `{}` | Casa ingress resource additional annotations. |
| global.casa.ingress.casaEnabled | bool | `false` | Enable casa endpoints /casa |
| global.casa.ingress.casaLabels | object | `{}` | Casa ingress resource labels. key app is taken |
| global.cleanup | object | `{"enabled":true}` | Enable cleanup job |
| global.cleanup.enabled | bool | `true` | Boolean flag to enable/disable the cleanup cronjob chart. |
| global.cloud.testEnviroment | bool | `false` | Boolean flag if enabled will strip resources requests and limits from all services. |
| global.cnConfiguratorConfigurationFile | string | `"/etc/jans/conf/configuration.json"` | Path to configuration schema file |
| global.cnConfiguratorCustomSchema | object | `{"secretName":""}` | Use custom configuration schema in existing secrets. Note, the secrets has to contain the key configuration.json or any basename as specified in cnConfiguratorConfigurationFile. |
| global.cnConfiguratorCustomSchema.secretName | string | `""` | The name of the secrets used for storing custom configuration schema. |
| global.cnConfiguratorDumpFile | string | `"/etc/jans/conf/configuration.out.json"` | Path to dumped configuration schema file |
| global.cnConfiguratorKey | string | `""` | Key to encrypt/decrypt configuration schema file using AES-256 CBC mode. Set the value to empty string to disable encryption/decryption, or 32 alphanumeric characters to enable it. |
| global.cnConfiguratorKeyFile | string | `"/etc/jans/conf/configuration.key"` | Path to the file that contains the key to encrypt/decrypt the configuration schema file. |
| global.cnDocumentStoreType | string | `"DB"` | Document store type to use for shibboleth files DB. |
| global.cnGoogleApplicationCredentials | string | `"/etc/jans/conf/google-credentials.json"` | Base64 encoded service account. The sa must have roles/secretmanager.admin to use Google secrets. Leave as this is a sensible default. |
| global.cnObExtSigningAlias | string | `""` | Open banking external signing AS Alias. This is a kid value.Used in SSA Validation, kid used while encoding a JWT sent to token URL i.e. XkwIzWy44xWSlcWnMiEc8iq9s2G |
| global.cnObExtSigningJwksCrt | string | `""` | Open banking external signing jwks AS certificate authority string. Used in SSA Validation. This must be encoded using base64.. Used when `.global.cnObExtSigningJwksUri` is set. |
| global.cnObExtSigningJwksKey | string | `""` | Open banking external signing jwks AS key string. Used in SSA Validation. This must be encoded using base64. Used when `.global.cnObExtSigningJwksUri` is set. |
| global.cnObExtSigningJwksKeyPassPhrase | string | `""` | Open banking external signing jwks AS key passphrase to unlock provided key. This must be encoded using base64. Used when `.global.cnObExtSigningJwksUri` is set. |
| global.cnObExtSigningJwksUri | string | `""` | Open banking external signing jwks uri. Used in SSA Validation. |
| global.cnObStaticSigningKeyKid | string | `""` | Open banking  signing AS kid to force the AS to use a specific signing key. i.e. Wy44xWSlcWnMiEc8iq9s2G |
| global.cnObTransportAlias | string | `""` | Open banking transport Alias used inside the JVM. |
| global.cnObTransportCrt | string | `""` | Open banking AS transport crt. Used in SSA Validation. This must be encoded using base64. |
| global.cnObTransportKey | string | `""` | Open banking AS transport key. Used in SSA Validation. This must be encoded using base64. |
| global.cnObTransportKeyPassPhrase | string | `""` | Open banking AS transport key passphrase to unlock AS transport key. This must be encoded using base64. |
| global.cnObTransportTrustStore | string | `""` | Open banking AS transport truststore crt. This is normally generated from the OB issuing CA, OB Root CA and Signing CA. Used when .global.cnObExtSigningJwksUri is set. Used in SSA Validation. This must be encoded using base64. |
| global.cnPersistenceType | string | `"sql"` | Persistence backend to run Gluu with hybrid|sql. |
| global.cnPrometheusPort | string | `""` | Port used by Prometheus JMX agent (default to empty string). To enable Prometheus JMX agent, set the value to a number. |
| global.cnSqlPasswordFile | string | `"/etc/jans/conf/sql_password"` | Path to SQL password file |
| global.config-api.adminUiAppLoggers.adminUiAuditLogLevel | string | `"INFO"` | config-api admin-ui plugin audit log level |
| global.config-api.adminUiAppLoggers.adminUiAuditLogTarget | string | `"FILE"` | config-api admin-ui plugin audit log target |
| global.config-api.adminUiAppLoggers.adminUiLogLevel | string | `"INFO"` | config-api admin-ui plugin log target |
| global.config-api.adminUiAppLoggers.adminUiLogTarget | string | `"FILE"` | config-api admin-ui plugin log level |
| global.config-api.adminUiAppLoggers.enableStdoutLogPrefix | string | `"true"` | Enable log prefixing which enables prepending the STDOUT logs with the file name. i.e config-api_persistence ===> 2022-12-20 17:49:55,744 INFO |
| global.config-api.appLoggers | object | `{"configApiLogLevel":"INFO","configApiLogTarget":"STDOUT","enableStdoutLogPrefix":"true","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scriptLogLevel":"INFO","scriptLogTarget":"FILE"}` | App loggers can be configured to define where the logs will be redirected to and the level of each in which it should be displayed. |
| global.config-api.appLoggers.configApiLogLevel | string | `"INFO"` | configapi.log level |
| global.config-api.appLoggers.configApiLogTarget | string | `"STDOUT"` | configapi.log target |
| global.config-api.appLoggers.enableStdoutLogPrefix | string | `"true"` | Enable log prefixing which enables prepending the STDOUT logs with the file name. i.e config-api_persistence ===> 2022-12-20 17:49:55,744 INFO |
| global.config-api.appLoggers.persistenceDurationLogLevel | string | `"INFO"` | config-api_persistence_duration.log level |
| global.config-api.appLoggers.persistenceDurationLogTarget | string | `"FILE"` | config-api_persistence_duration.log target |
| global.config-api.appLoggers.persistenceLogLevel | string | `"INFO"` | config-api_persistence.log level |
| global.config-api.appLoggers.persistenceLogTarget | string | `"FILE"` | config-api_persistence.log target |
| global.config-api.appLoggers.scriptLogLevel | string | `"INFO"` | config-api_script.log level |
| global.config-api.appLoggers.scriptLogTarget | string | `"FILE"` | config-api_script.log target |
| global.config-api.cnCustomJavaOptions | string | `""` | passing custom java options to config-api. Notice you do not need to pass in any loggers options as they are introduced below in appLoggers. DO NOT PASS JAVA_OPTIONS in envs. |
| global.config-api.configApiServerServiceName | string | `"config-api"` | Name of the config-api service. Please keep it as default. |
| global.config-api.enabled | bool | `true` | Boolean flag to enable/disable the config-api chart. |
| global.config-api.ingress | object | `{"configApiAdditionalAnnotations":{},"configApiEnabled":true,"configApiLabels":{}}` | Enable endpoints in either istio or nginx ingress depending on users choice |
| global.config-api.ingress.configApiAdditionalAnnotations | object | `{}` | ConfigAPI ingress resource additional annotations. |
| global.config-api.ingress.configApiLabels | object | `{}` | configAPI ingress resource labels. key app is taken |
| global.config-api.plugins | string | `"admin-ui,fido2,scim,user-mgt"` | Comma-separated values of enabled plugins (supported plugins are "admin-ui","fido2","scim","user-mgt", "kc-saml") |
| global.config.enabled | bool | `true` | Boolean flag to enable/disable the configuration chart. This normally should never be false |
| global.configAdapterName | string | `"kubernetes"` | The config backend adapter that will hold Gluu configuration layer. aws|google|kubernetes |
| global.configSecretAdapter | string | `"kubernetes"` | The config backend adapter that will hold Gluu secret layer. vault|aws|google|kubernetes |
| global.distribution | string | `"default"` | Gluu distributions supported are: default|openbanking. |
| global.fido2.appLoggers | object | `{"enableStdoutLogPrefix":"true","fido2LogLevel":"INFO","fido2LogTarget":"STDOUT","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scriptLogLevel":"INFO","scriptLogTarget":"FILE"}` | App loggers can be configured to define where the logs will be redirected to and the level of each in which it should be displayed. |
| global.fido2.appLoggers.enableStdoutLogPrefix | string | `"true"` | Enable log prefixing which enables prepending the STDOUT logs with the file name. i.e fido2 ===> 2022-12-20 17:49:55,744 INFO |
| global.fido2.appLoggers.fido2LogLevel | string | `"INFO"` | fido2.log level |
| global.fido2.appLoggers.fido2LogTarget | string | `"STDOUT"` | fido2.log target |
| global.fido2.appLoggers.persistenceDurationLogLevel | string | `"INFO"` | fido2_persistence_duration.log level |
| global.fido2.appLoggers.persistenceDurationLogTarget | string | `"FILE"` | fido2_persistence_duration.log target |
| global.fido2.appLoggers.persistenceLogLevel | string | `"INFO"` | fido2_persistence.log level |
| global.fido2.appLoggers.persistenceLogTarget | string | `"FILE"` | fido2_persistence.log target |
| global.fido2.appLoggers.scriptLogLevel | string | `"INFO"` | fido2_script.log level |
| global.fido2.appLoggers.scriptLogTarget | string | `"FILE"` | fido2_script.log target |
| global.fido2.cnCustomJavaOptions | string | `""` | passing custom java options to fido2. Notice you do not need to pass in any loggers options as they are introduced below in appLoggers. DO NOT PASS JAVA_OPTIONS in envs. |
| global.fido2.enabled | bool | `true` | Boolean flag to enable/disable the fido2 chart. |
| global.fido2.fido2ServiceName | string | `"fido2"` | Name of the fido2 service. Please keep it as default. |
| global.fido2.ingress | object | `{"fido2AdditionalAnnotations":{},"fido2ConfigAdditionalAnnotations":{},"fido2ConfigEnabled":false,"fido2ConfigLabels":{},"fido2Enabled":false,"fido2Labels":{},"fido2WebauthnAdditionalAnnotations":{},"fido2WebauthnEnabled":false,"fido2WebauthnLabels":{}}` | Enable endpoints in either istio or nginx ingress depending on users choice |
| global.fido2.ingress.fido2AdditionalAnnotations | object | `{}` | fido2 ingress resource additional annotations. |
| global.fido2.ingress.fido2ConfigAdditionalAnnotations | object | `{}` | fido2 config ingress resource additional annotations. |
| global.fido2.ingress.fido2ConfigEnabled | bool | `false` | Enable endpoint /.well-known/fido2-configuration |
| global.fido2.ingress.fido2ConfigLabels | object | `{}` | fido2 config ingress resource labels. key app is taken |
| global.fido2.ingress.fido2Enabled | bool | `false` | Enable endpoint /jans-fido2 |
| global.fido2.ingress.fido2Labels | object | `{}` | fido2 ingress resource labels. key app is taken |
| global.fido2.ingress.fido2WebauthnAdditionalAnnotations | object | `{}` | fido2 webauthn ingress resource additional annotations. |
| global.fido2.ingress.fido2WebauthnEnabled | bool | `false` | Enable endpoint /.well-known/webauthn |
| global.fido2.ingress.fido2WebauthnLabels | object | `{}` | fido2 webauthn ingress resource labels. key app is taken |
| global.fqdn | string | `"demoexample.gluu.org"` | Fully qualified domain name to be used for Gluu installation. This address will be used to reach Gluu services. |
| global.gcePdStorageType | string | `"pd-standard"` | GCE storage kind if using Google disks |
| global.isFqdnRegistered | bool | `false` | Boolean flag to enable mapping global.lbIp  to global.fqdn inside pods on clouds that provide static ip for load balancers. On cloud that provide only addresses to the LB this flag will enable a script to actively scan config.configmap.lbAddr and update the hosts file inside the pods automatically. |
| global.istio.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| global.istio.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| global.istio.enabled | bool | `false` | Boolean flag that enables using istio side-cars with Gluu services. |
| global.istio.gateways | list | `[]` | Override the gateway that can be created by default. This is used when istio ingress has already been setup and the gateway exists. |
| global.istio.ingress | bool | `false` | Boolean flag that enables using istio gateway for Gluu. This assumes istio ingress is installed and hence the LB is available. |
| global.istio.namespace | string | `"istio-system"` | The namespace istio is deployed in. The is normally istio-system. |
| global.jobTtlSecondsAfterFinished | int | `300` | https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/ |
| global.kc-scheduler.enabled | bool | `false` | Boolean flag to enable/disable the kc-scheduler cronjob chart. |
| global.lbIp | string | `"22.22.22.22"` | The Loadbalancer IP created by nginx or istio on clouds that provide static IPs. This is not needed if `global.fqdn` is globally resolvable. |
| global.nginx-ingress.enabled | bool | `true` | Boolean flag to enable/disable the nginx-ingress definitions chart. |
| global.persistence.enabled | bool | `true` | Boolean flag to enable/disable the persistence chart. |
| global.saml.cnCustomJavaOptions | string | `""` | passing custom java options to saml. DO NOT PASS JAVA_OPTIONS in envs. |
| global.saml.enabled | bool | `false` | Boolean flag to enable/disable the saml chart. |
| global.saml.ingress | object | `{"samlAdditionalAnnotations":{},"samlEnabled":false,"samlLabels":{}}` | Enable endpoints in either istio or nginx ingress depending on users choice |
| global.saml.ingress.samlAdditionalAnnotations | object | `{}` | SAML ingress resource additional annotations. |
| global.saml.ingress.samlLabels | object | `{}` | SAML ingress resource labels. key app is taken |
| global.saml.samlServiceName | string | `"saml"` | Name of the saml service. Please keep it as default. |
| global.scim.appLoggers | object | `{"enableStdoutLogPrefix":"true","persistenceDurationLogLevel":"INFO","persistenceDurationLogTarget":"FILE","persistenceLogLevel":"INFO","persistenceLogTarget":"FILE","scimLogLevel":"INFO","scimLogTarget":"STDOUT","scriptLogLevel":"INFO","scriptLogTarget":"FILE"}` | App loggers can be configured to define where the logs will be redirected to and the level of each in which it should be displayed. |
| global.scim.appLoggers.enableStdoutLogPrefix | string | `"true"` | Enable log prefixing which enables prepending the STDOUT logs with the file name. i.e jans-scim ===> 2022-12-20 17:49:55,744 INFO |
| global.scim.appLoggers.persistenceDurationLogLevel | string | `"INFO"` | jans-scim_persistence_duration.log level |
| global.scim.appLoggers.persistenceDurationLogTarget | string | `"FILE"` | jans-scim_persistence_duration.log target |
| global.scim.appLoggers.persistenceLogLevel | string | `"INFO"` | jans-scim_persistence.log level |
| global.scim.appLoggers.persistenceLogTarget | string | `"FILE"` | jans-scim_persistence.log target |
| global.scim.appLoggers.scimLogLevel | string | `"INFO"` | jans-scim.log level |
| global.scim.appLoggers.scimLogTarget | string | `"STDOUT"` | jans-scim.log target |
| global.scim.appLoggers.scriptLogLevel | string | `"INFO"` | jans-scim_script.log level |
| global.scim.appLoggers.scriptLogTarget | string | `"FILE"` | jans-scim_script.log target |
| global.scim.cnCustomJavaOptions | string | `""` | passing custom java options to scim. Notice you do not need to pass in any loggers options as they are introduced below in appLoggers. DO NOT PASS JAVA_OPTIONS in envs. |
| global.scim.enabled | bool | `true` | Boolean flag to enable/disable the SCIM chart. |
| global.scim.ingress | object | `{"scimAdditionalAnnotations":{},"scimConfigAdditionalAnnotations":{},"scimConfigEnabled":false,"scimConfigLabels":{},"scimEnabled":false,"scimLabels":{}}` | Enable endpoints in either istio or nginx ingress depending on users choice |
| global.scim.ingress.scimAdditionalAnnotations | object | `{}` | SCIM ingress resource additional annotations. |
| global.scim.ingress.scimConfigAdditionalAnnotations | object | `{}` | SCIM config ingress resource additional annotations. |
| global.scim.ingress.scimConfigEnabled | bool | `false` | Enable endpoint /.well-known/scim-configuration |
| global.scim.ingress.scimConfigLabels | object | `{}` | SCIM config ingress resource labels. key app is taken |
| global.scim.ingress.scimEnabled | bool | `false` | Enable SCIM endpoints /jans-scim |
| global.scim.ingress.scimLabels | object | `{}` | SCIM ingress resource labels. key app is taken |
| global.scim.scimServiceName | string | `"scim"` | Name of the scim service. Please keep it as default. |
| global.serviceAccountName | string | `"default"` | service account used by Kubernetes resources |
| global.storageClass | object | `{"allowVolumeExpansion":true,"allowedTopologies":[],"mountOptions":["debug"],"parameters":{},"provisioner":"microk8s.io/hostpath","reclaimPolicy":"Retain","volumeBindingMode":"WaitForFirstConsumer"}` | StorageClass section. This is not currently used by the openbanking distribution. You may specify custom parameters as needed. |
| global.storageClass.parameters | object | `{}` | parameters: fsType: "" kind: "" pool: "" storageAccountType: "" type: "" |
| global.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service. Envs defined in global.userEnvs will be globally available to all services |
| global.usrEnvs.normal | object | `{}` | Add custom normal envs to the service. variable1: value1 |
| global.usrEnvs.secret | object | `{}` | Add custom secret envs to the service. variable1: value1 |
| installer-settings | object | `{"acceptLicense":"","aws":{"arn":{"arnAcmCert":"","enabled":""},"lbType":"","vpcCidr":"0.0.0.0/0"},"confirmSettings":false,"currentVersion":"","google":{"useSecretManager":""},"images":{"edit":""},"namespace":"","nginxIngress":{"namespace":"","releaseName":""},"nodes":{"ips":"","names":"","zones":""},"openbanking":{"cnObTransportTrustStoreP12password":"","hasCnObTransportTrustStore":false},"postgres":{"install":"","namespace":""},"redis":{"install":"","namespace":""},"releaseName":"","sql":{"install":"","namespace":""},"volumeProvisionStrategy":""}` | Only used by the installer. These settings do not affect nor are used by the chart |
| kc-scheduler | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/cloudtools","tag":"1.9.0-1"},"interval":10,"lifecycle":{},"nodeSelector":{},"resources":{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}},"tolerations":[],"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Responsible for synchronizing Keycloak SAML clients |
| kc-scheduler.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| kc-scheduler.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| kc-scheduler.customCommand | list | `[]` | Add custom job's command. If passed, it will override the default conditional command. |
| kc-scheduler.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| kc-scheduler.dnsConfig | object | `{}` | Add custom dns config |
| kc-scheduler.dnsPolicy | string | `""` | Add custom dns policy |
| kc-scheduler.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| kc-scheduler.image.pullSecrets | list | `[]` | Image Pull Secrets |
| kc-scheduler.image.repository | string | `"ghcr.io/janssenproject/jans/cloudtools"` | Image  to use for deploying. |
| kc-scheduler.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| kc-scheduler.interval | int | `10` | Interval of running the scheduler (in minutes) |
| kc-scheduler.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| kc-scheduler.resources | object | `{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}}` | Resource specs. |
| kc-scheduler.resources.limits.cpu | string | `"300m"` | CPU limit. |
| kc-scheduler.resources.limits.memory | string | `"300Mi"` | Memory limit. |
| kc-scheduler.resources.requests.cpu | string | `"300m"` | CPU request. |
| kc-scheduler.resources.requests.memory | string | `"300Mi"` | Memory request. |
| kc-scheduler.tolerations | list | `[]` | Add tolerations for the pods |
| kc-scheduler.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| kc-scheduler.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| kc-scheduler.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| kc-scheduler.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| kc-scheduler.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| nginx-ingress | object | `{"certManager":{"certificate":{"enabled":false,"issuerGroup":"cert-manager.io","issuerKind":"ClusterIssuer","issuerName":""}},"ingress":{"additionalAnnotations":{},"additionalLabels":{},"hosts":["demoexample.gluu.org"],"ingressClassName":"nginx","path":"/","tls":[{"hosts":["demoexample.gluu.org"],"secretName":"tls-certificate"}]}}` | Nginx ingress definitions chart |
| nginx-ingress.ingress.additionalAnnotations | object | `{}` | Additional annotations that will be added across all ingress definitions in the format of {cert-manager.io/issuer: "letsencrypt-prod"} Enable client certificate authentication nginx.ingress.kubernetes.io/auth-tls-verify-client: "optional" Create the secret containing the trusted ca certificates nginx.ingress.kubernetes.io/auth-tls-secret: "gluu/tls-certificate" Specify the verification depth in the client certificates chain nginx.ingress.kubernetes.io/auth-tls-verify-depth: "1" Specify if certificates are passed to upstream server nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "true" |
| nginx-ingress.ingress.additionalLabels | object | `{}` | Additional labels that will be added across all ingress definitions in the format of {mylabel: "myapp"} |
| nginx-ingress.ingress.tls | list | `[{"hosts":["demoexample.gluu.org"],"secretName":"tls-certificate"}]` | Secrets holding HTTPS CA cert and key. |
| persistence | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/persistence-loader","tag":"1.9.0-1"},"lifecycle":{},"nodeSelector":{},"resources":{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}},"tolerations":[],"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | Job to generate data and initial config for Gluu Server persistence layer. |
| persistence.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| persistence.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| persistence.customCommand | list | `[]` | Add custom job's command. If passed, it will override the default conditional command. |
| persistence.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| persistence.dnsConfig | object | `{}` | Add custom dns config |
| persistence.dnsPolicy | string | `""` | Add custom dns policy |
| persistence.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| persistence.image.pullSecrets | list | `[]` | Image Pull Secrets |
| persistence.image.repository | string | `"ghcr.io/janssenproject/jans/persistence-loader"` | Image  to use for deploying. |
| persistence.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| persistence.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| persistence.resources | object | `{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}}` | Resource specs. |
| persistence.resources.limits.cpu | string | `"300m"` | CPU limit |
| persistence.resources.limits.memory | string | `"300Mi"` | Memory limit. |
| persistence.resources.requests.cpu | string | `"300m"` | CPU request. |
| persistence.resources.requests.memory | string | `"300Mi"` | Memory request. |
| persistence.tolerations | list | `[]` | Add tolerations for the pods |
| persistence.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| persistence.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| persistence.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| persistence.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| persistence.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| saml | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","hpa":{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50},"image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/saml","tag":"1.9.0-1"},"lifecycle":{},"livenessProbe":{"exec":{"command":["python3","/app/scripts/healthcheck.py"]},"failureThreshold":10,"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5},"nodeSelector":{},"pdb":{"enabled":true,"maxUnavailable":"90%"},"readinessProbe":{"exec":{"command":["python3","/app/scripts/healthcheck.py"]},"failureThreshold":10,"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5},"replicas":1,"resources":{"limits":{"cpu":"500m","memory":"1200Mi"},"requests":{"cpu":"500m","memory":"1200Mi"}},"tolerations":[],"topologySpreadConstraints":{},"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | SAML. |
| saml.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| saml.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| saml.customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| saml.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| saml.dnsConfig | object | `{}` | Add custom dns config |
| saml.dnsPolicy | string | `""` | Add custom dns policy |
| saml.hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| saml.hpa.behavior | object | `{}` | Scaling Policies |
| saml.hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| saml.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| saml.image.pullSecrets | list | `[]` | Image Pull Secrets |
| saml.image.repository | string | `"ghcr.io/janssenproject/jans/saml"` | Image  to use for deploying. |
| saml.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| saml.livenessProbe | object | `{"exec":{"command":["python3","/app/scripts/healthcheck.py"]},"failureThreshold":10,"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5}` | Configure the liveness healthcheck for the auth server if needed. |
| saml.livenessProbe.exec | object | `{"command":["python3","/app/scripts/healthcheck.py"]}` | http liveness probe endpoint |
| saml.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| saml.pdb | object | `{"enabled":true,"maxUnavailable":"90%"}` | Configure the PodDisruptionBudget |
| saml.readinessProbe.exec | object | `{"command":["python3","/app/scripts/healthcheck.py"]}` | http readiness probe endpoint |
| saml.replicas | int | `1` | Service replica number. |
| saml.resources | object | `{"limits":{"cpu":"500m","memory":"1200Mi"},"requests":{"cpu":"500m","memory":"1200Mi"}}` | Resource specs. |
| saml.resources.limits.cpu | string | `"500m"` | CPU limit. |
| saml.resources.limits.memory | string | `"1200Mi"` | Memory limit. This value is used to calculate memory allocation for Java. Currently it only supports `Mi`. Please refrain from using other units. |
| saml.resources.requests.cpu | string | `"500m"` | CPU request. |
| saml.resources.requests.memory | string | `"1200Mi"` | Memory request. |
| saml.tolerations | list | `[]` | Add tolerations for the pods |
| saml.topologySpreadConstraints | object | `{}` | Configure the topology spread constraints. Notice this is a map NOT a list as in the upstream API https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| saml.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| saml.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| saml.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| saml.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| saml.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
| scim | object | `{"additionalAnnotations":{},"additionalLabels":{},"customCommand":[],"customScripts":[],"dnsConfig":{},"dnsPolicy":"","hpa":{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50},"image":{"pullPolicy":"IfNotPresent","pullSecrets":[],"repository":"ghcr.io/janssenproject/jans/scim","tag":"1.9.0-1"},"lifecycle":{},"livenessProbe":{"httpGet":{"path":"/jans-scim/sys/health-check","port":8080},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5},"nodeSelector":{},"pdb":{"enabled":true,"maxUnavailable":"90%"},"readinessProbe":{"httpGet":{"path":"/jans-scim/sys/health-check","port":8080},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5},"replicas":1,"resources":{"limits":{"cpu":"1000m","memory":"1200Mi"},"requests":{"cpu":"1000m","memory":"1200Mi"}},"service":{"name":"http-scim","port":8080},"tolerations":[],"topologySpreadConstraints":{},"usrEnvs":{"normal":{},"secret":{}},"volumeMounts":[],"volumes":[]}` | System for Cross-domain Identity Management (SCIM) version 2.0 |
| scim.additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| scim.additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| scim.customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| scim.customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| scim.dnsConfig | object | `{}` | Add custom dns config |
| scim.dnsPolicy | string | `""` | Add custom dns policy |
| scim.hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| scim.hpa.behavior | object | `{}` | Scaling Policies |
| scim.hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| scim.image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| scim.image.pullSecrets | list | `[]` | Image Pull Secrets |
| scim.image.repository | string | `"ghcr.io/janssenproject/jans/scim"` | Image  to use for deploying. |
| scim.image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| scim.livenessProbe | object | `{"httpGet":{"path":"/jans-scim/sys/health-check","port":8080},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5}` | Configure the liveness healthcheck for SCIM if needed. |
| scim.livenessProbe.httpGet.path | string | `"/jans-scim/sys/health-check"` | http liveness probe endpoint |
| scim.nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| scim.pdb | object | `{"enabled":true,"maxUnavailable":"90%"}` | Configure the PodDisruptionBudget |
| scim.readinessProbe | object | `{"httpGet":{"path":"/jans-scim/sys/health-check","port":8080},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5}` | Configure the readiness healthcheck for the SCIM if needed. |
| scim.readinessProbe.httpGet.path | string | `"/jans-scim/sys/health-check"` | http readiness probe endpoint |
| scim.replicas | int | `1` | Service replica number. |
| scim.resources.limits.cpu | string | `"1000m"` | CPU limit. |
| scim.resources.limits.memory | string | `"1200Mi"` | Memory limit. This value is used to calculate memory allocation for Java. Currently it only supports `Mi`. Please refrain from using other units. |
| scim.resources.requests.cpu | string | `"1000m"` | CPU request. |
| scim.resources.requests.memory | string | `"1200Mi"` | Memory request. |
| scim.service.name | string | `"http-scim"` | The name of the scim port within the scim service. Please keep it as default. |
| scim.service.port | int | `8080` | Port of the scim service. Please keep it as default. |
| scim.tolerations | list | `[]` | Add tolerations for the pods |
| scim.topologySpreadConstraints | object | `{}` | Configure the topology spread constraints. Notice this is a map NOT a list as in the upstream API https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| scim.usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| scim.usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| scim.usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| scim.volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| scim.volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
