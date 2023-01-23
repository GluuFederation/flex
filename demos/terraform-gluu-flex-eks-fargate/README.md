# terraform-gluu-flex-eks-fargate

A terraform setup for gluu flex on EKS Fargate

## Setup

The setup consists of two major parts:

- Infrastructure setup, provisioned from AWS
- Gluu Flex setup, provisioned within the Kubernetes cluster

### Infrastructure setup

The infrastructure has the following components:

- **VPC**: A VPC with 2 public, 3 private, and 1 database subnet (the database subnet is only created, if the setup should use an RDS database). The setup is provisioned using the [terraform-aws-vpc](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/3.18.1) module. NACL are defined for the subnets. A NAT gateway is also automatically created for the private subnets. The VPC is configured to use DNS hostnames and DNS resolution, which is a requirement for EKS.
- **EKS with Fargate**: The EKS cluster is provisioned using the [terraform-aws-eks](https://registry.terraform.io/modules/terraform-aws-modules/eks/aws/17.24.0) module. The module creates the EKS cluster and the necessary IAM roles. The cluster is configured to use Fargate, for which a default provisioner is created that operates in the namespaces `kube-system`, `ingress-nginx`, and the namespace in which the application will be deployed (by default this is the `default` namespace). The module also creates the necessary security groups for the cluster. The cluster is configured to use the VPC created in the previous step. The cluster is configured to use Kubernetes version 1.24. The CoreDNS extension is not provisioned via the module, but is instead created separately in the `kube-system` namespace, as the deployment of the application is setup as a dependency for the deployment of the CoreDNS extension. The module also creates a local `kubeconfig` file, which can be used to interact with the Kubernetes API.
- **Security groups**: a set of security groups is created for all the subnets created by the VPC module, only allowing the traffic that is anticipated in the setup.
- **RDS**: an RDS DB cluster will only be created, if the setup requires the provisioning of a database cluster, instead of providing the connection details for an external DB server. The module can provision either a Postgres or a MySQL DB.
- **IAM resources**: the module creates a set of IAM resources required for the ALB ingress controller.

All resources will be created in the AWS region that is currently active in the session.

### Gluu Flex setup

The Gluu Flex setup consists of the following components:

- **Observability setup**: For EKS to work properly with Fragate, some observability components need to be deployed. These components are deployed inside the `aws-observability` namespace.
- **ALB ingress controller**: the ALB ingress controller is deployed using the [aws-alb-ingress-controller](https://github.com/kubernetes-sigs/aws-load-balancer-controller) Helm chart and is configured to use the `kube-system` namespace. For the ALB ingress controller to work, the IAM resources created by the infrastructure setup need to be configured correctly. This controller is used to provision an ALB or NLB for routing Internet traffic inside the cluster. Since the ALB ingress controller doesn't support URL rewrites, which is required for the Gluu Flex setup, an additional nginx based ingress is deployed that routes the traffic from the ALB/NLB to the respective Gluu Flex service.
- **Ingress-nginx controller**: the ingress controller is deployed using the [ingress-nginx](https://kubernetes.github.io/ingress-nginx/) Helm chart and is configured to use the `ingress-nginx` namespace.
- **Config maps and secrets**: the setup creates a set of config maps and secrets that are required for the deployment of the Gluu Flex application. Additionally, an RBAC setup is created that allows the Gluu Flex application to access the config maps and secrets.
- **Configuration jobs**: once the config maps and secrets are created, the setup creates a set of jobs that are used to configure the Gluu Flex application.
- **Application deployments**: once all jobs are successfully completed, the setup creates the deployments for the Gluu Flex application. Each application can be individually enabled or disabled. Once enabled, the setup will create a deployment, service, and respective ingresses for the application. The ingresses will be annotated to use the nginx ingress controller.

### EKS Fargate provisioner issue

The module currently has an issue with the Fargate provisioner. The provisioner is created once the EKS cluster is up and running, however, the first deployment, which is CoreDNS will still try to use the default provisioner, which will always fail. In the module, there is an artificially delay, which unfortunately doesn't work. The `terrafrom apply` command will eventually fail, because the CoreDNS pods remain in the `PENDING` state. A subsequent `terraform apply` will succeed, as the CoreDNS pods will be created by the Fargate provisioner. To speed things up, you can manually patch the CoreDNS deployment to use the Fargate provisioner. This can be done by running the following command:

```bash
kubectl patch deployment coredns -n kube-system --type=json -p='[{"op": "remove", "path": "/spec/template/metadata/annotations", "value": "eks.amazonaws.com/compute-type"}]'
kubectl rollout restart -n kube-system deployment coredns
```
