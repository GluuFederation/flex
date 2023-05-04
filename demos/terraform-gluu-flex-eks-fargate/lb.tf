# Install the AWS ALB Ingress Controller for creating Ingress resources for the ALB
# and services of type LoadBalancer for NLB.
#
# To operate, the controller needs an IAM role with certain permissions. This role
# is created by the module and attached to the service account of the controller.

resource "aws_iam_policy" "alb_policy" {
  name        = "AWSLoadBalancerControllerIAMPolicy"
  path        = "/"
  description = "AWS LoadBalancer Controller IAM Policy"

  policy = file("./templates/alb-iam-policy.json")

}

data "aws_iam_policy_document" "alb_ingress_controller_assume_role_policy" {

  version = "2012-10-17"
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [module.eks.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${module.eks.oidc_provider}:sub"

      values = [
        "system:serviceaccount:kube-system:alb-ingress-controller",
      ]
    }
    condition {
      test     = "StringEquals"
      variable = "${module.eks.oidc_provider}:aud"

      values = [
        "sts.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "alb_ingress_controller" {
  name               = "alb-ingress-controller"
  assume_role_policy = data.aws_iam_policy_document.alb_ingress_controller_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "alb_ingress_controller_role_policy" {
  role       = aws_iam_role.alb_ingress_controller.name
  policy_arn = aws_iam_policy.alb_policy.arn
}

resource "kubernetes_service_account_v1" "alb_ingress_controller" {

  // dependecy to the EKS cluster must be made explicit
  depends_on = [
    module.eks
  ]

  metadata {
    name      = "alb-ingress-controller"
    namespace = "kube-system"

    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.alb_ingress_controller.arn
    }
  }
}

resource "kubernetes_cluster_role_binding" "alb_ingress_controller" {

  // dependecy to the EKS cluster must be made explicit
  depends_on = [
    module.eks
  ]

  metadata {
    name = "alb-ingress-controller"
    labels = {
      "app.kubernetes.io/name" = "alb-ingress-controller"
    }
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "aws-load-balancer-controller-role" # This is the name of the ClusterRole created by the Helm chart
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account_v1.alb_ingress_controller.metadata[0].name
    namespace = kubernetes_service_account_v1.alb_ingress_controller.metadata[0].namespace
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

resource "helm_release" "alb_controller" {
  name       = "aws-load-balancer-controller"
  depends_on = [kubernetes_cluster_role_binding.alb_ingress_controller]

  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"

  values = [
    templatefile("templates/alb-ingress-values.yaml.tpl", {
      cluster_name         = data.aws_eks_cluster.cluster.name
      vpc_id               = module.vpc.vpc_id
      aws_region           = data.aws_region.current.name
      image_repository     = format("602401143452.dkr.ecr.%s.amazonaws.com/amazon/aws-load-balancer-controller", data.aws_region.current.name)
      service_account_name = kubernetes_service_account_v1.alb_ingress_controller.metadata[0].name
    })
  ]
}

resource "kubernetes_namespace" "ingress_nginx" {
  metadata {
    name = "ingress-nginx"
  }
}

resource "helm_release" "nginx_ingress" {
  name = "ingress-nginx"


  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"

  values = [
    templatefile("templates/nginx-values.yaml.tpl", {
      use_nlb = var.lb == "nlb" ? true : false
    })
  ]
}


resource "kubernetes_ingress_v1" "test_alb" {
  count = var.lb == "alb" ? 1 : 0

  metadata {
    name      = "alb-nginx-ingress"
    namespace = "ingress-nginx"

    annotations = {
      "alb.ingress.kubernetes.io/scheme"      = "internet-facing"
      "alb.ingress.kubernetes.io/target-type" = "ip"
      # "alb.ingress.kubernetes.io/subnets" = "<subnets>"
      # "alb.ingress.kubernetes.io/certificate-arn" = "<CERTIFICATE_ARN>"
      "alb.ingress.kubernetes.io/healthcheck-path" = "/healthz"
    }
  }

  spec {

    ingress_class_name = "alb"

    rule {
      http {
        path {
          path = "/*"
          backend {
            service {
              name = "ingress-nginx-controller"
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}