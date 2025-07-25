# config-api

![Version: 1.9.0](https://img.shields.io/badge/Version-1.9.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.9.0](https://img.shields.io/badge/AppVersion-1.9.0-informational?style=flat-square)

Jans Config Api endpoints can be used to configure jans-auth-server, which is an open-source OpenID Connect Provider (OP) and UMA Authorization Server (AS)

**Homepage:** <https://docs.gluu.org>

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| Mohammad Abudayyeh | <team@gluu.org> | <https://github.com/moabu> |

## Source Code

* <https://github.com/JanssenProject/jans/jans-config-api>
* <https://github.com/JanssenProject/jans/docker-jans-config-api>
* <https://github.com/GluuFederation/flex/tree/main/charts/gluu/charts/config-api>

## Requirements

Kubernetes: `>=v1.21.0-0`

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| additionalLabels | object | `{}` | Additional labels that will be added across all resources definitions in the format of {mylabel: "myapp"} |
| affinity | object | `{}` |  |
| customCommand | list | `[]` | Add custom pod's command. If passed, it will override the default conditional command. |
| customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| dnsConfig | object | `{}` | Add custom dns config |
| dnsPolicy | string | `""` | Add custom dns policy |
| fullnameOverride | string | `""` |  |
| hpa | object | `{"behavior":{},"enabled":true,"maxReplicas":10,"metrics":[],"minReplicas":1,"targetCPUUtilizationPercentage":50}` | Configure the HorizontalPodAutoscaler |
| hpa.behavior | object | `{}` | Scaling Policies |
| hpa.metrics | list | `[]` | metrics if targetCPUUtilizationPercentage is not set |
| image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| image.pullSecrets | list | `[]` | Image Pull Secrets |
| image.repository | string | `"janssenproject/config-api"` | Image  to use for deploying. |
| image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| lifecycle | object | `{}` |  |
| livenessProbe | object | `{"httpGet":{"path":"/jans-config-api/api/v1/health/live","port":8074},"initialDelaySeconds":30,"periodSeconds":30,"timeoutSeconds":5}` | Configure the liveness healthcheck for the auth server if needed. |
| livenessProbe.httpGet | object | `{"path":"/jans-config-api/api/v1/health/live","port":8074}` | Executes the python3 healthcheck. |
| nameOverride | string | `""` |  |
| nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| nodeSelector | object | `{}` |  |
| readinessProbe | object | `{"httpGet":{"path":"/jans-config-api/api/v1/health/ready","port":8074},"initialDelaySeconds":25,"periodSeconds":25,"timeoutSeconds":5}` | Configure the readiness healthcheck for the auth server if needed. |
| replicas | int | `1` | Service replica number. |
| resources | object | `{"limits":{"cpu":"2500m","memory":"2500Mi"},"requests":{"cpu":"2500m","memory":"2500Mi"}}` | Resource specs. |
| resources.limits.cpu | string | `"2500m"` | CPU limit. |
| resources.limits.memory | string | `"2500Mi"` | Memory limit. |
| resources.requests.cpu | string | `"2500m"` | CPU request. |
| resources.requests.memory | string | `"2500Mi"` | Memory request. |
| service.name | string | `"http-config-api"` | The name of the config-api port within the config-api service. Please keep it as default. |
| service.sessionAffinity | string | `"None"` | Default set to None If you want to make sure that connections from a particular client are passed to the same Pod each time, you can select the session affinity based on the client's IP addresses by setting this to ClientIP |
| service.sessionAffinityConfig | object | `{"clientIP":{"timeoutSeconds":10800}}` | the maximum session sticky time if sessionAffinity is ClientIP |
| tolerations | list | `[]` |  |
| usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
