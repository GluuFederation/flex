module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 18.0"

  #
  # Cluster parameters
  #
  cluster_name    = "janssen"
  cluster_version = "1.24"

  #
  # Networking
  #
  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.private_subnets

  # Fargate Profile(s)
  fargate_profiles = {
    default = {
      name = "default"
      selectors = [
        {
          namespace = var.namespace
        },
        {
          namespace = "kube-system"
        },
        {
          namespace = "ingress-nginx"
        }
      ]
    }
  }
}

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

resource "local_file" "kubeconfig" {
  content = templatefile("templates/kubeconfig.tpl", {
    region_code      = data.aws_region.current.name
    account_id       = data.aws_billing_service_account.main.id
    cluster_endpoint = data.aws_eks_cluster.cluster.endpoint
    certificate_data = data.aws_eks_cluster.cluster.certificate_authority[0].data
    cluster_name     = data.aws_eks_cluster.cluster.name
  })
  filename = "kubeconfig_${data.aws_eks_cluster.cluster.name}"
}


# --------------------------------------------- #
# Logging configuration
# --------------------------------------------- #

resource "kubernetes_namespace" "aws_observability" {
  metadata {
    name = "aws-observability"
  }
}

resource "kubernetes_config_map" "aws_observability" {
  metadata {
    name      = "aws-logging"
    namespace = kubernetes_namespace.aws_observability.metadata[0].name
  }

  data = {
    "flb_log_cw"   = "true"
    "filters.conf" = <<EOT
      [FILTER]
          Name parser
          Match *
          Key_name log
          Parser crio
      [FILTER]
          Name kubernetes
          Match kube.*
          Merge_Log On
          Keep_Log Off
          Buffer_Size 0
          Kube_Meta_Cache_TTL 300s
      EOT
    "output.conf"  = <<EOT
      [OUTPUT]
          Name cloudwatch_logs
          Match   kube.*
          region region-code
          log_group_name my-logs
          log_stream_prefix from-fluent-bit-
          log_retention_days 60
          auto_create_group true
        EOT
    "parsers.conf" = <<EOT
      [PARSER]
          Name crio
          Format Regex
          Regex ^(?<time>[^ ]+) (?<stream>stdout|stderr) (?<logtag>P|F) (?<log>.*)$
          Time_Key    time
          Time_Format %Y-%m-%dT%H:%M:%S.%L%z
      EOT
  }

}

resource "time_sleep" "wait_for_eks_cluster" {
  depends_on = [
    module.eks,
    kubernetes_config_map.aws_observability,
  ]

  create_duration = "90s"
}

# If the cluster is created with the coredns addon enabled, the pods
# will be created before the fargate provisioner is ready. Hence we 
# create it separately and add some delay to ensure the pods are only
# created after the provisioner is ready.
#
# To manually fix new deployments, run the following commands:
# kubectl patch deployment coredns -n kube-system --type=json -p='[{"op": "remove", "path": "/spec/template/metadata/annotations", "value": "eks.amazonaws.com/compute-type"}]'
# kubectl rollout restart -n kube-system deployment coredns
resource "aws_eks_addon" "coredns" {
  cluster_name = data.aws_eks_cluster.cluster.name
  addon_name   = "coredns"
  depends_on   = [time_sleep.wait_for_eks_cluster]
}
