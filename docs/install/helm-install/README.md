---
tags:
  - administration
  - installation
  - helm
---

# Helm Deployment

Gluu Flex enables organizations to build a scalable centralized authentication and authorization service using free open source software.

The components of the project include client and server implementations of the OAuth, OpenID Connect, SCIM and FIDO standards.

All these components are deployed using Gluu [helm chart](https://github.com/GluuFederation/flex/blob/main/charts/gluu).

You can check the [reference](../../reference/kubernetes/helm-chart.md) guide to view the list of the chart components and values.

## Looking for older helm charts?

 If you are looking for older helm charts, you need to build them from the [Gluu Flex](https://github.com/GluuFederation/flex/tree/main/charts/gluu) repository. We only keep the last 5 versions of the chart up. We support auto-upgrade using helm upgrade and hence want everyone to stay up to date with our charts.

 To build older charts manually from the Gluu Flex repository, you can use the following example which assumes we are building for janssen version `v5.0.0`:

 ```bash
 git clone --filter blob:none --no-checkout https://github.com/GluuFederation/flex.git /tmp/flex \
     && cd /tmp/flex \
     && git sparse-checkout init --cone \
     && git checkout v5.0.0 \
     && git sparse-checkout add charts/gluu \
     && cd charts/gluu \
     && helm dependency update \
     && helm package .
 ```
