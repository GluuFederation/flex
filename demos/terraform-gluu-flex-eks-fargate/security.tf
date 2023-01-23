# --------------------------------------------- #
# Public SG
# --------------------------------------------- #

resource "aws_security_group" "public_sg" {
  name   = "public-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    description     = null
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = null
    cidr_blocks     = ["0.0.0.0/0"]
  }

  ingress {
    description     = null
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = null
    cidr_blocks     = ["0.0.0.0/0"]
  }

  egress {
    description     = "Allow all egress traffic"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = null
    cidr_blocks     = ["0.0.0.0/0"]
  }

}

# --------------------------------------------- #
# Private SG
# --------------------------------------------- #

resource "aws_security_group" "private_sg" {
  name   = "private-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    description     = null
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.public_sg.id]
    cidr_blocks     = null
  }

  ingress {
    description     = null
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.public_sg.id]
    cidr_blocks     = null
  }

  egress {
    description     = "Allow all egress traffic"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = null
    cidr_blocks     = ["0.0.0.0/0"]
  }

}

# --------------------------------------------- #
# LB SG
# --------------------------------------------- #

resource "aws_security_group" "lb_sg" {
  name   = "lb-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    description     = "Allow HTTP traffic from everywhere"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = null
    cidr_blocks     = ["0.0.0.0/0"]
  }

  ingress {
    description     = "Allow HTTPS traffic from everywhere"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = null
    cidr_blocks     = ["0.0.0.0/0"]
  }

  egress {
    description     = "Allow all outbound traffic"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = null
    cidr_blocks     = ["0.0.0.0/0"]
  }

}


# --------------------------------------------- #
# Aurora SG
# --------------------------------------------- #

resource "aws_security_group" "aurora_sg" {
  count  = local.provision_db ? 1 : 0
  name   = "rds-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    description = "Allow inbound traffic from the private subnet"
    from_port   = local.db_port
    to_port     = local.db_port
    protocol    = "tcp"
    cidr_blocks = [var.cidr_block]
  }

}


# --------------------------------------------- #
# Password used for logging into the admin console
# --------------------------------------------- #

resource "random_password" "admin_pw" {
  length  = 12
  numeric = true
  lower   = true
  upper   = true
  special = true

  min_lower   = 1
  min_upper   = 1
  min_numeric = 1
  min_special = 1
}


# --------------------------------------------- #
# Aurora username
# --------------------------------------------- #

# Permission errors may occur when using uppercase characters in db name
# If username starts with number, creation of RDS will break
resource "random_string" "aurora_user" {
  count   = local.provision_db ? 1 : 0
  length  = 12
  lower   = true
  upper   = false
  numeric = false
  special = false
}

# --------------------------------------------- #
# Aurora password
# --------------------------------------------- #

# Only printable ascii characters are allowed as passwords for Aurora DB
resource "random_password" "aurora_password" {
  count   = local.provision_db ? 1 : 0
  length  = 32
  numeric = true
  lower   = true
  upper   = true
  special = false
  # override_special = "!#$%-_=+<>:?"
}