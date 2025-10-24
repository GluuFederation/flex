# --------------------------------------------- #
# Network configuration
# --------------------------------------------- #

variable "cidr_block" {
  default     = "10.2.0.0/16"
  description = "The CIDR block for the VPC."
  type        = string
}

variable "lb" {
  default     = "alb"
  description = "The type of load balancer to use. Valid values are 'alb' and 'nlb'."
  type        = string
  validation {
    condition     = anytrue([var.lb == "alb", var.lb == "nlb"])
    error_message = "The 'lb' variable must be either 'alb' or 'nlb'."
  }
}

# --------------------------------------------- #
# Toggles for individual services
# --------------------------------------------- #

variable "enable_auth_server" {
  default     = true
  description = "Enable the auth server service."
  type        = bool
}

variable "enable_config_api" {
  default     = true
  description = "Enable the config API service."
  type        = bool
}

variable "enable_fido2" {
  default     = true
  description = "Enable the FIDO2 server service."
  type        = bool
}

variable "enable_scim" {
  default     = true
  description = "Enable the SCIM server service."
  type        = bool
}

variable "enable_admin_ui" {
  default     = true
  description = "Enable the admin UI service."
  type        = bool
}

variable "enable_casa" {
  default     = true
  description = "Enable the casa service."
  type        = bool
}

# --------------------------------------------- #
# DB configuration
# --------------------------------------------- #

variable "db_type" {
  default     = "aurora-postgresql"
  description = "The type of database to use. Valid values are 'aurora-postgresql', 'aurora-mysql', 'custom-sql', 'couchbase', or 'spanner'."
  type        = string
  validation {
    condition     = anytrue([var.db_type == "aurora-postgresql", var.db_type == "aurora-mysql", var.db_type == "custom-sql", var.db_type == "couchbase", var.db_type == "spanner"])
    error_message = "The 'db_type' variable must be either 'aurora-postgresql', 'aurora-mysql', 'custom-sql', 'couchbase', 'spanner'."
  }
}

variable "db_instance_type" {
  default     = "db.t3.medium"
  description = "The instance type to use for the database. Only used if 'db_type' is set to 'aurora-postgresql' or 'aurora-mysql'."
  type        = string
}

variable "db_custom_host" {
  default     = ""
  description = "The host of an external DB. Only used if 'db_type' is set to 'custom'."
  type        = string
}

variable "db_custom_port" {
  default     = ""
  description = "The port of an external DB. Only used if 'db_type' is set to 'custom'."
  type        = string
}

variable "db_username" {
  default     = ""
  description = "The username to use to connect to the DB. Only used if 'db_type' is set to 'custom'."
  type        = string
}

variable "db_password" {
  default     = ""
  description = "The password to use to connect to the DB. Only used if 'db_type' is set to 'custom'."
  type        = string
  sensitive   = true
}

variable "db_custom_name" {
  default     = ""
  description = "The database name to use. Only used if 'db_type' is set to 'custom'."
  type        = string
}

variable "db_custom_dialect" {
  default     = ""
  description = "The dialect to use. Only used if 'db_type' is set to 'custom'."
  type        = string
}

// Couchbase

variable "db_couchbase_url" {
  default     = ""
  description = "The URL of the Couchbase instance to use. Only used if 'db_type' is set to 'couchbase'."
  type        = string
}

variable "db_couchbase_user" {
  default     = ""
  description = "The username to use to connect to the Couchbase instance. Only used if 'db_type' is set to 'couchbase'."
  type        = string
}

variable "db_couchbase_password" {
  default     = ""
  description = "The password to use to connect to the Couchbase instance. Only used if 'db_type' is set to 'couchbase'."
  type        = string
  sensitive   = true
}

variable "db_couchbase_superuser" {
  default     = ""
  description = "The super user to use to connect to the Couchbase instance. Only used if 'db_type' is set to 'couchbase'."
  type        = string
}

variable "db_couchbase_superuser_password" {
  default     = ""
  description = "The super user password to use to connect to the Couchbase instance. Only used if 'db_type' is set to 'couchbase'."
  type        = string
  sensitive   = true
}

variable "db_couchbase_bucket_prefix" {
  default     = ""
  description = "The bucket prefix to use to connect to the Couchbase instance. Only used if 'db_type' is set to 'couchbase'."
  type        = string
}

variable "db_couchbase_index_num_replica" {
  default     = ""
  description = "The number of replicas to use to connect to the Couchbase instance. Only used if 'db_type' is set to 'couchbase'."
  type        = string
}

variable "db_couchbase_crt" {
  default     = ""
  description = "The crt to use to connect to the Couchbase instance. Only used if 'db_type' is set to 'couchbase'."
  type        = string
}

# --------------------------------------------- #
# Cache configuration
# --------------------------------------------- #

variable "cache_type" {
  default     = "NATIVE_PERSISTENCE"
  description = "The type of cache to use. Valid values are 'NATIVE_PERSISTENCE' or 'REDIS'."
  type        = string
  validation {
    condition     = anytrue([var.cache_type == "NATIVE_PERSISTENCE", var.cache_type == "REDIS", var.cache_type == "IN_MEMORY"])
    error_message = "The 'cache_type' variable must be either 'NATIVE_PERSISTENCE', 'IN_MEMORY', or 'REDIS'."
  }
}

variable "redis_url" {
  default     = ""
  description = "The URL of the Redis instance to use. Only used if 'cache_type' is set to 'REDIS'."
  type        = string
}

variable "redis_use_ssl" {
  default     = false
  description = "Whether to use SSL when connecting to the Redis instance. Only used if 'cache_type' is set to 'REDIS'."
  type        = bool
}

variable "redis_password" {
  default     = ""
  description = "The password of the Redis instance to use. Only used if 'cache_type' is set to 'REDIS'."
  type        = string
  sensitive   = true
}

variable "redis_type" {
  default     = "STANDALONE"
  description = "The type of Redis instance to use. Valid values are 'STANDALONE' or 'CLUSTER'. Only used if 'cache_type' is set to 'REDIS'."
  type        = string
  validation {
    condition     = anytrue([var.redis_type == "STANDALONE", var.redis_type == "CLUSTER"])
    error_message = "The 'redis_type' variable must be either 'STANDALONE' or 'CLUSTER'."
  }
}

variable "redis_sentinel_group" {
  default     = ""
  description = "The name of the Redis Sentinel group to use. Only used if 'cache_type' is set to 'REDIS' and 'redis_type' is set to 'CLUSTER'."
  type        = string
}

# --------------------------------------------- #
# Domain configuration
# --------------------------------------------- #

variable "fqdn" {
  description = "The fully qualified domain name to use for the application."
  type        = string
}

variable "domain_zone_id" {
  default     = ""
  description = "The Route 53 zone ID for the domain. Only used if 'fqdn' is set."
  type        = string
}

# --------------------------------------------- #
# Application configuration
# --------------------------------------------- #

variable "namespace" {
  default     = "default"
  description = "The Kubernetes namespace where all application components will be deployed."
  type        = string
}

variable "jans_city" {
  default = ""
  type    = string
}

variable "jans_state" {
  default = ""
  type    = string
}

variable "jans_country_code" {
  default = ""
  type    = string
}

variable "jans_org_name" {
  default = ""
  type    = string
}

variable "jans_email" {
  default = ""
  type    = string
}

variable "gluu_distribution" {
  default     = "default"
  description = "The distribution to use for the application, being either 'default' or 'ob' for the open banking distribution."
  type        = string
  validation {
    condition     = anytrue([var.gluu_distribution == "default", var.gluu_distribution == "ob"])
    error_message = "The 'gluu_distribution' variable must be either 'default' or 'ob'."
  }
}

variable "auth_ingresses" {
  default = ["openidConfig",
    "deviceCode",
    "firebaseMessaging",
    "uma2Config",
    "webfinger",
    "webdiscovery",
    "webdiscovery",
  "u2fConfig"]
  description = "List of ingresses to enable for the auth server."
  type        = list(string)
}

variable "scim_ingresses" {
  default     = ["scim", "scimConfig"]
  description = "List of ingresses to enable for the scim service."
  type        = list(string)
}

variable "scim_protection_mode" {
  default     = "OAUTH"
  description = "Protection mode for the scim service."
  validation {
    condition     = anytrue([var.scim_protection_mode == "OAUTH", var.scim_protection_mode == "TEST", var.scim_protection_mode == "UMA"])
    error_message = "The 'scim_protection_mode' variable must be either 'OAUTH', 'TEST', or 'UMA'."
  }
  type = string
}

variable "keys_life" {
  default     = 2
  description = "The life of the keys in days."
  type        = number
}

# --------------------------------------------- #
# Deployment configuration
# --------------------------------------------- #

variable "admin_ui_image" {
  default     = "gluufederation/admin-ui"
  description = "The image to use for the the admin UI deployment."
  type        = string
}

variable "admin_ui_version" {
  default     = "1.0.5-1"
  description = "The version of the admin UI to deploy."
  type        = string
}

variable "admin_ui_replicas" {
  default     = 1
  description = "The number of replicas to deploy for the admin UI."
  type        = number
}

variable "auth_keys_image" {
  default     = "ghcr.io/janssenproject/jans/certmanager"
  description = "The image to use for the the admin UI deployment."
  type        = string
}

variable "auth_keys" {
  default     = "1.0.5-1"
  description = "The version of the admin UI to deploy."
  type        = string
}

variable "auth_server_image" {
  default     = "ghcr.io/janssenproject/jans/auth-server"
  description = "The image to use for the the auth server deployment."
  type        = string
}

variable "auth_server_version" {
  default     = "1.0.5-1"
  description = "The version of the auth server to deploy."
  type        = string
}

variable "auth_server_replicas" {
  default     = 1
  description = "The number of replicas to deploy for the auth server."
  type        = number
}

variable "casa_image" {
  default     = "gluufederation/casa"
  description = "The image to use for the the casa deployment."
  type        = string
}

variable "casa_version" {
  default     = "5.0.0-3"
  description = "The version of the casa to deploy."
  type        = string
}

variable "casa_replicas" {
  default     = 1
  description = "The number of replicas to deploy for the casa."
  type        = number
}

variable "config_api_image" {
  default     = "ghcr.io/janssenproject/jans/config-api"
  description = "The image to use for the the config API deployment."
  type        = string
}

variable "config_api_version" {
  default     = "1.0.5-1"
  description = "The version of the config API to deploy."
  type        = string
}

variable "config_api_replicas" {
  default     = 1
  description = "The number of replicas to deploy for the config API."
  type        = number
}

variable "configurator_image" {
  default     = "ghcr.io/janssenproject/jans/configurator"
  description = "The image to use for the the configurator job deployment."
  type        = string
}

variable "configurator_version" {
  default     = "1.0.5-1"
  description = "The version of the configurator job to deploy."
  type        = string
}

variable "fido2_image" {
  default     = "ghcr.io/janssenproject/jans/fido2"
  description = "The image to use for the the FIDO2 server deployment."
  type        = string
}

variable "fido2_version" {
  default     = "1.0.5-1"
  description = "The version of the FIDO2 server to deploy."
  type        = string
}

variable "fido2_replicas" {
  default     = 1
  description = "The number of replicas to deploy for the FIDO2 server."
  type        = number
}

variable "persistence_image" {
  default     = "ghcr.io/janssenproject/jans/persistence-loader"
  description = "The image to use for the the persistence loader job deployment."
  type        = string
}

variable "persistence_version" {
  default     = "1.0.5-1"
  description = "The version of the persistence loader job to deploy."
  type        = string
}

variable "scim_image" {
  default     = "ghcr.io/janssenproject/jans/scim"
  description = "The image to use for the the SCIM server deployment."
  type        = string
}

variable "scim_version" {
  default     = "1.0.5-1"
  description = "The version of the SCIM server to deploy."
  type        = string
}

variable "scim_replicas" {
  default     = 1
  description = "The number of replicas to deploy for the SCIM server."
  type        = number
}

# --------------------------------------------- #
# Open Banking configuration
# --------------------------------------------- #

variable "ob_ext_signing_jwks_uri" {
  type        = string
  default     = ""
  description = "External signing jwks uri, used in SSA validation."
}

variable "ob_ext_signing_jwks_crt" {
  type        = string
  default     = ""
  description = "External signing jwks AS certificate authority string, used in SSA Validation. This must be encoded using base64. Used when `cnObExtSigningJwksUri` is set."
}

variable "ob_ext_signing_jwks_key" {
  type        = string
  default     = ""
  description = "External signing jwks AS key string, used in SSA Validation. This must be encoded using base64. Used when `cnObExtSigningJwksUri` is set."
}

variable "ob_ext_signing_jwks_key_passphrase" {
  type        = string
  default     = ""
  description = "External signing jwks AS key passphrase to unlock provided key. This must be encoded using base64. Used when `.global.cnObExtSigningJwksUri` is set."
}

variable "ob_ext_signing_alias" {
  type        = string
  default     = ""
  description = "External signing AS Alias. This is a kid value.Used in SSA Validation, kid used while encoding a JWT sent to token URL i.e. XkwIzWy44xWSlcWnMiEc8iq9s2G"
}

variable "ob_static_signing_key_kid" {
  type        = string
  default     = ""
  description = "Signing AS kid to force the AS to use a specific signing key. i.e. Wy44xWSlcWnMiEc8iq9s2G"
}

variable "ob_transport_crt" {
  type        = string
  default     = ""
  description = "AS transport crt. Used in SSA Validation. This must be encoded using base64."
}

variable "ob_transport_key" {
  type        = string
  default     = ""
  description = "AS transport key. Used in SSA Validation. This must be encoded using base64."
}

variable "ob_transport_key_passphrase" {
  type        = string
  default     = ""
  description = "AS transport key passphrase to unlock AS transport key. This must be encoded using base64."
}

variable "ob_transport_alias" {
  type        = string
  default     = ""
  description = "AS transport Alias used inside the JVM."
}

variable "ob_transport_truststore" {
  type        = string
  default     = ""
  description = "AS transport truststore crt. This is normally generated from the OB issuing CA, OB Root CA and Signing CA. Used when .global.cnObExtSigningJwksUri is set. Used in SSA Validation. This must be encoded using base64."
}