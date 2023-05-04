serviceAccount:
  create: true

rbac:
  create: true

controller:

  config:
    server-tokens: false
    use-proxy-protocol: false
    compute-full-forwarded-for: true
    use-forwarded-headers: true

  service:
    type: "NodePort"
    externalTrafficPolicy: "Local"
    %{ if use_nlb }
    annotations:
      kubernetes.io/ingress.class: nlb
      service.beta.kubernetes.io/aws-load-balancer-type: "external"
      service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "ip"
      # service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
    %{ endif }
    # ports:
    #   http: 80
    #   https: 443 
    # targetPorts:
    #   http: 8080
    #   https: 8443 

  image:
    allowPrivilegeEscalation: false
  publishService:
    enabled: true
  metrics:
    enabled: true

  autoscaling:
    maxReplicas: 1
    minReplicas: 1
    enabled: true 

  # extraArgs:
  #   http-port: 8080 
  #   https-port: 8443 
  # containerPort:
  #   http: 8080 
  #   https: 8443 

