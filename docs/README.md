# Gluu Flex Documentation

## Introduction

Designed from the ground up to support cloud-native deployments, Gluu Flex is a self-hosted software stack to enable your organization to build a world-class digital identity platform to authenticate both people and software.

With Helm charts available out of the box, Gluu Flex can handle the most demanding requirements for concurrency. Thanks to cloud-native auto-scaling and zero downtime updates, you can build a robust, multi-datacenter topology.

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


### Contributing documentation

This directory is the source for the Flex documentation at
[gluu.org/docs/flex](https://gluu.org/docs/flex). Nothing here builds a site: the websites
repository imports `docs/` from each release tag, so an edit lands on the next release.

- Add every new page to `nav:` in `mkdocs.yml`. That tree is the only place the sidebar's group
  labels exist, so a page left out of it is published with no sidebar entry.
- Meet the Janssen
  [documentation style guidelines](https://docs.jans.io/stable/CONTRIBUTING/#documentation-style-guide)
  and proofread for typographical and grammatical errors before opening a pull request.
