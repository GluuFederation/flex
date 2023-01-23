data "aws_availability_zones" "available" {}

data "aws_partition" "current" {}

data "aws_region" "current" {}

data "aws_billing_service_account" "main" {}