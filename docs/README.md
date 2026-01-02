# Gluu Flex Documentation

## Introduction

Designed from the ground up to support cloud-native deployments, Gluu Flex is a self-hosted software stack to enable your organization to build a world-class digital identity platform to authenticate both people and software.

With Helm charts available out of the box, Gluu Flex can handle the most demanding requirements for concurrency. Thanks to cloud-native auto-scaling and zero downtime updates, you can build a robust, multi-datacenter topology. You can take advantage of new cloud databases like Amazon Aurora and Google Spanner.

Common use cases include:

- Single sign-on (SSO)   
- Mobile authentication    
- API access management  
- Two-factor authentication (2FA)
- Customer identity and access management (CIAM)   
- Identity federation      

## Built on Janssen

Gluu Flex is a downstream product of the Linux Foundation [Janssen Project](https://jans.io). It was created for enterprise customers who want a commercially supported distribution, plus some additional tools to ease administration.

## Harness Low Code Authentication Flows with Agama

Gluu Flex uses Agama to offer an alternative way to build web-based authentication flows. Traditionally, person authentication flows are defined in the server with jython scripts that adhere to a predefined API. With Agama, flows are coded using a DSL (domain specific language) designed for the sole purpose of writing web flows. Agama flows are simpler, more intuitive, and quicker to build.

## Support

The Gluu Flex contract includes guaranteed response times and consultative support via our [support portal](https://support.gluu.org).

## Looking for older documentation versions?

 The Janssen Project posts the last five versions of the documentation. If you are looking for older versions, you can find them unprocessed in the [docs](https://github.com/JanssenProject/jans/tree/main/docs) folder. Select the version of choice from the tag dropdown in GitHub. If you want to process them you may do so by following the steps below :

### Testing Documentation Changes Locally

While contributing documentation to official Gluu [documentation](https://docs.gluu.org/) it is important to make sure that documents meet [style guidelines](../CONTRIBUTING.md#documentation-style-guide) and have been proofread to remove any typographical or grammatical errors.
Gluu uses [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) to create the documentation site. Before new content is pushed to the repository on GitHub, it should be tested locally by the author. Author can do this by deploying Material for MkDocs locally.

High-level steps involve:

1. [Install Material for MkDocs](https://squidfunk.github.io/mkdocs-material/getting-started/#installation)
2. Install required plugins
3. [Preview as you write](https://squidfunk.github.io/mkdocs-material/creating-your-site/#previewing-as-you-write)
