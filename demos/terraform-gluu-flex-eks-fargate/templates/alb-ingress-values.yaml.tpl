
vpcId: ${vpc_id}
region: ${aws_region}
image:
  tag: v2.4.2
  repository: ${image_repository}
clusterName: ${cluster_name}
serviceAccount:
  create: false
  name: ${service_account_name}