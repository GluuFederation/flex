module "gluu" {
  source = "../."

  db_type = "aurora-postgresql"
  fqdn    = "exampleidp.gluu.org"
  lb      = "alb"

  enable_admin_ui    = false
  enable_auth_server = true
  enable_casa        = false
  enable_config_api  = true
  enable_fido2       = false
  enable_scim        = false

  gluu_distribution = "ob"
  jans_city         = "Austin"
  jans_state        = "TX"
  jans_country_code = "US"
  jans_email        = "support@gluu.org"
  jans_org_name     = "Gluu"


  ob_ext_signing_jwks_uri            = ""
  ob_ext_signing_jwks_crt            = ""
  ob_ext_signing_jwks_key            = ""
  ob_ext_signing_jwks_key_passphrase = ""
  ob_ext_signing_alias               = ""
  ob_static_signing_key_kid          = ""
  ob_transport_crt                   = ""
  ob_transport_key                   = ""
  ob_transport_key_passphrase        = ""
  ob_transport_alias                 = ""
  ob_transport_truststore            = ""
}