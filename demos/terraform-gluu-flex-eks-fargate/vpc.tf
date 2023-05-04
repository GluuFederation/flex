# We create two public and three private subnets based on the CIDR block
# provided by the user. The public subnets are used for the load balancer
# and the private subnets are used for the EKS cluster.
locals {

  # ------------------------------------------------------------------------- #
  # We create two public and three private subnets based on the CIDR block
  # provided by the user. The public subnets are used for the load balancer
  # and the private subnets are used for the EKS cluster.
  # ------------------------------------------------------------------------- #
  public_nets = [
    cidrsubnet(var.cidr_block, 8, 0),
    cidrsubnet(var.cidr_block, 8, 1),
  ]

  private_nets = [
    cidrsubnet(var.cidr_block, 8, 2),
    cidrsubnet(var.cidr_block, 8, 3),
    cidrsubnet(var.cidr_block, 8, 4),
  ]

  db_nets = [
    cidrsubnet(var.cidr_block, 8, 5),
    cidrsubnet(var.cidr_block, 8, 6),
  ]

  # ------------------------------------------------------------------------- #
  # Aurora NACL ingress and egress rules
  # ------------------------------------------------------------------------- #
  aurora_nacl_ingress_rules = [
    {
      "cidr_block" : "${var.cidr_block}",
      "from_port" : var.db_type == "aurora-postgresql" ? "5432" : "3306",
      "protocol" : "tcp",
      "rule_action" : "allow",
      "rule_number" : 100,
      "to_port" : var.db_type == "aurora-postgresql" ? "5432" : "3306"
    },
    {
      "cidr_block" : "0.0.0.0/0",
      "from_port" : 32768,
      "protocol" : "tcp",
      "rule_action" : "allow",
      "rule_number" : 110,
      "to_port" : 61000
    },
  ]

  aurora_nacl_egress_rules = [
    {
      "cidr_block" : "0.0.0.0/0",
      "from_port" : 0,
      "protocol" : "-1",
      "rule_action" : "allow",
      "rule_number" : 100,
      "to_port" : 0
    }
  ]

  # ------------------------------------------------------------------------- #
  # EKS NACL ingress and egress rules
  # ------------------------------------------------------------------------- #
  # eks_nacl_ingress_rules = [
  #   {
  #     "cidr_block" : "${var.cidr_block}",
  #     "from_port" : 8080,
  #     "protocol" : "tcp",
  #     "rule_action" : "allow",
  #     "rule_number" : 100,
  #     "to_port" : 8080
  #   },
  #   {
  #     "cidr_block" : "0.0.0.0/0",
  #     "from_port" : 32768,
  #     "protocol" : "tcp",
  #     "rule_action" : "allow",
  #     "rule_number" : 110,
  #     "to_port" : 61000
  #   }
  # ]

  # eks_nacl_egress_rules = [
  #   {
  #     "cidr_block" : "0.0.0.0/0",
  #     "from_port" : 0,
  #     "protocol" : "-1",
  #     "rule_action" : "allow",
  #     "rule_number" : 100,
  #     "to_port" : 0
  #   }
  # ]

  # ------------------------------------------------------------------------- #
  # LB NACL ingress and egress rules
  # ------------------------------------------------------------------------- #
  lb_nacl_ingress_rules = [
    {
      "cidr_block" : "0.0.0.0/0",
      "from_port" : 0,
      "protocol" : "-1",
      "rule_action" : "allow",
      "rule_number" : 100,
      "to_port" : 0
    }
  ]
  # --------------------------------------------- #
  # LB NACL egress rules
  # --------------------------------------------- #
  lb_nacl_egress_rules = [
    {
      "cidr_block" : "0.0.0.0/0",
      "from_port" : 0,
      "protocol" : "-1",
      "rule_action" : "allow",
      "rule_number" : 100,
      "to_port" : 0
    }
  ]

}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.18.1"

  name = "janssen"
  cidr = var.cidr_block
  azs  = data.aws_availability_zones.available.names

  private_subnets  = local.private_nets
  public_subnets   = local.public_nets
  database_subnets = local.provision_db ? local.db_nets : []

  enable_nat_gateway                 = true
  single_nat_gateway                 = true
  enable_dns_hostnames               = true
  enable_dns_support                 = true
  default_vpc_enable_dns_hostnames   = true
  create_database_nat_gateway_route  = local.provision_db ? true : false
  create_database_subnet_route_table = local.provision_db ? true : false

  # --------------------------------------------- #
  # ECS/EKS subnet 
  # --------------------------------------------- #
  private_subnet_names = ["janssen-private-0", "janssen-private-1", "janssen-private-2"]

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/janssen"   = "shared"
  }


  # --------------------------------------------- #
  # LB subnet 
  # --------------------------------------------- #
  public_subnet_names          = ["janssen-public-0", "janssen-public-1"]
  public_dedicated_network_acl = true
  public_inbound_acl_rules     = local.lb_nacl_ingress_rules
  public_outbound_acl_rules    = local.lb_nacl_egress_rules

  public_subnet_tags = {
    "kubernetes.io/role/elb"        = "1"
    "kubernetes.io/cluster/janssen" = "shared"
  }

  # --------------------------------------------- #
  # Aurora subnet 
  # --------------------------------------------- #

  # database_subnet_group_name     = var.aurora-subnet-group-name
  database_subnet_names          = local.provision_db ? ["db-0", "db-1"] : []
  database_dedicated_network_acl = local.provision_db ? true : false
  database_inbound_acl_rules     = local.provision_db ? local.aurora_nacl_ingress_rules : []
  database_outbound_acl_rules    = local.provision_db ? local.aurora_nacl_egress_rules : []

  map_public_ip_on_launch = false
}
