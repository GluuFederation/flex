
locals {
  provision_db = var.db_type == "aurora-postgresql" || var.db_type == "aurora-mysql" ? true : false
  db_port      = var.db_type == "aurora-postgresql" ? 5432 : 3306
  db_engine    = var.db_type == "aurora-postgresql" ? "aurora-postgresql" : "aurora-mysql"
  db_version   = var.db_type == "aurora-postgresql" ? "13.7" : "5.7"
}

# --------------------------------------------- #
# Aurora DB cluster
# --------------------------------------------- #

resource "aws_rds_cluster" "aurora_db_cluster" {
  count              = local.provision_db ? 1 : 0
  cluster_identifier = "janssen-aurora-db"
  database_name      = "janssen"
  engine             = local.db_engine
  engine_version     = local.db_version

  master_username = random_string.aurora_user[0].result
  master_password = random_password.aurora_password[0].result

  port                   = local.db_port
  network_type           = "IPV4"
  db_subnet_group_name   = module.vpc.database_subnet_group
  vpc_security_group_ids = [aws_security_group.aurora_sg[0].id]

  allow_major_version_upgrade = false

  # enabled_cloudwatch_logs_exports = ["postgresql"]
  skip_final_snapshot       = true
  final_snapshot_identifier = "janssen-aurora-db-backup"
  preferred_backup_window   = "01:00-02:00"
  apply_immediately         = true
  backup_retention_period   = 7
}

# --------------------------------------------- #
# Aurora DB instance/s
# --------------------------------------------- #

resource "aws_rds_cluster_instance" "aurora-db" {
  count                        = local.provision_db ? 1 : 0
  identifier                   = "aurora-db-${count.index}"
  cluster_identifier           = aws_rds_cluster.aurora_db_cluster[0].id
  instance_class               = var.db_instance_type
  engine                       = aws_rds_cluster.aurora_db_cluster[0].engine
  engine_version               = aws_rds_cluster.aurora_db_cluster[0].engine_version
  auto_minor_version_upgrade   = true
  publicly_accessible          = false
  db_subnet_group_name         = module.vpc.database_subnet_group
  preferred_maintenance_window = "Sun:01:00-Sun:02:00"
}
