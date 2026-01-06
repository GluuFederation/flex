---
tags:
  - administration
  - kubernetes
  - operations
  - gluu4
  - migration
---

This guide shows how to migrate from `Gluu 4.x` to  `Gluu Flex`.


# Migration steps

1. Create a fresh flex K8s [setup](https://docs.gluu.org/head/install/helm-install/) based on your preferred environment.

1. Write all your existing configurations as code using the Janssen terraform [provider](https://registry.terraform.io/providers/JanssenProject/jans/latest/docs).
   You can check this [doc](https://docs.jans.io/head/janssen-server/terraform/) to know the benefits of this approach and how to implement it. 


1. Test applying the configuration through Terraform. Ensure no delta between the old Gluu 4.x and Gluu flex, and verify the changes using the admin-ui/TUI.

1. Move the sensitive data from the old setup to the new one, honoring any changes such as custom attributes and users.

# Terraform configuration example

Firstly, you have to initialize and configure the Janssen terraform provider. You can follow this [doc](https://docs.jans.io/head/janssen-server/terraform/) to complete this.

Once completed, let's showcase how to move existing gluu4 [clients](#clients-migration) and [interception scripts](#interception-scripts-migration) using Terraform.

!!! Note
    The examples are meant for demonstration purposes. You should adjust them as needed.

## Clients Migration

We will use the [jans_oidc_client](https://registry.terraform.io/providers/JanssenProject/jans/latest/docs/resources/oidc_client) resource.

Add the following to `clients.tf`:

```
resource "jans_oidc_client" "gluu4_migrated_client" {
  display_name                  = "Gluu4 migrated client"
  description                   = "Client migrated from Gluu4 to Flex"
  redirect_uris                 = ["https://demoexample.gluu.org/admin"]
  token_endpoint_auth_method    = "none"
  subject_type                  = "pairwise"
  grant_types                   = ["authorization_code"]
  response_types                = ["code"]
  disabled                      = false
  trusted_client                = true
  application_type              = "web"
  scopes                        = ["inum=F0C4,ou=scopes,o=jans"]
  persist_client_authorizations = true
  access_token_as_jwt           = false
}
```
## Interception scripts Migration

We will use the [jans_script](https://registry.terraform.io/providers/JanssenProject/jans/latest/docs/resources/oidc_client) resource.

Add the following to `scripts.tf`:


```
resource "jans_script" "gluu_migrated_script" {
  dn                   = "inum=CACD-5901,ou=scripts,o=jans"
  inum                 = "CACD-5901"
  name                 = "scan_client_registration"
  description          = "Scan Client Registration Script"
  script               = file("script.py")
  script_type          = "client_registration"
  programming_language = "python"
  level                = 100
  revision             = 1
  enabled              = true
  modified             = false
  internal             = false
  location_type        = "db"
  base_dn              = "inum=CACD-5901,ou=scripts,o=jans"

  module_properties {
    value1      = "v1"
    value2      = "v2"
    description = null
  }
}
```


You can run `terraform apply` and review the created resources in the Admin-UI/TUI.
