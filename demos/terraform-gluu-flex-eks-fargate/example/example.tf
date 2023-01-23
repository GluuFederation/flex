module "gluu" {
  source = "../."

  db_type = "aurora-postgresql"
  fqdn    = "exampleidp.gluu.org"
  lb      = "alb"

  enable_admin_ui    = true
  enable_auth_server = true
  enable_casa        = true
  enable_config_api  = true
  enable_fido2       = true
  enable_scim        = true


  jans_city         = "Austin"
  jans_state        = "TX"
  jans_country_code = "US"
  jans_email        = "support@gluu.org"
  jans_org_name     = "Gluu"
}