# kc-scheduler

![Version: 1.9.0](https://img.shields.io/badge/Version-1.9.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.9.0](https://img.shields.io/badge/AppVersion-1.9.0-informational?style=flat-square)

Responsible for synchronizing Keycloak SAML clients

**Homepage:** <https://jans.io>

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| Mohammad Abudayyeh | <support@jans.io> | <https://github.com/moabu> |

## Source Code

* <https://github.com/JanssenProject/jans/docker-jans-cloudtools>

## Requirements

Kubernetes: `>=v1.22.0-0`

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| additionalAnnotations | object | `{}` | Additional annotations that will be added across the gateway in the format of {cert-manager.io/issuer: "letsencrypt-prod"} |
| additionalLabels | object | `{}` | Additional labels that will be added across the gateway in the format of {mylabel: "myapp"} |
| customCommand | list | `[]` | Add custom job's command. If passed, it will override the default conditional command. |
| customScripts | list | `[]` | Add custom scripts that have been mounted to run before the entrypoint. - /tmp/custom.sh - /tmp/custom2.sh |
| dnsConfig | object | `{}` | Add custom dns config |
| dnsPolicy | string | `""` | Add custom dns policy |
| image.pullPolicy | string | `"IfNotPresent"` | Image pullPolicy to use for deploying. |
| image.pullSecrets | list | `[]` | Image Pull Secrets |
| image.repository | string | `"ghcr.io/janssenproject/jans/cloudtools"` | Image  to use for deploying. |
| image.tag | string | `"1.9.0-1"` | Image  tag to use for deploying. |
| interval | int | `10` | Interval of running the scheduler (in minutes) |
| lifecycle | object | `{}` |  |
| nodeSelector | object | `{}` | Add nodeSelector (see https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) |
| resources | object | `{"limits":{"cpu":"300m","memory":"300Mi"},"requests":{"cpu":"300m","memory":"300Mi"}}` | Resource specs. |
| resources.limits.cpu | string | `"300m"` | CPU limit. |
| resources.limits.memory | string | `"300Mi"` | Memory limit. |
| resources.requests.cpu | string | `"300m"` | CPU request. |
| resources.requests.memory | string | `"300Mi"` | Memory request. |
| tolerations | list | `[]` | Add tolerations for the pods |
| usrEnvs | object | `{"normal":{},"secret":{}}` | Add custom normal and secret envs to the service |
| usrEnvs.normal | object | `{}` | Add custom normal envs to the service variable1: value1 |
| usrEnvs.secret | object | `{}` | Add custom secret envs to the service variable1: value1 |
| volumeMounts | list | `[]` | Configure any additional volumesMounts that need to be attached to the containers |
| volumes | list | `[]` | Configure any additional volumes that need to be attached to the pod |
