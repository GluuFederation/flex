import React from 'react'
import {
  Badge,
  FormGroup,
  Card,
  Col,
  Input,
  CardBody,
  InputGroup,
  CustomInput,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'

function CacheRedis({ config, formik }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardBody>
        <FormGroup row>
        <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>{t("fields.redis_configuration")}:</Col>
          <GluuLabel label="fields.redis_provider_type" size={4} />
          <Col sm={8}>
            <InputGroup>
              <CustomInput
                type="select"
                id="redisProviderType"
                name="redisProviderType"
                defaultValue={config.redisProviderType}
                onChange={formik.handleChange}
              >
                <option value="STANDALONE">{t("options.standalone")}</option>
                <option value="CLUSTER">{t("options.cluster")}</option>
                <option value="SHARDED">{t("options.sharded")}</option>
                <option value="SENTINEL">{t("options.sentinel")}</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.servers" size={2} />
          <Col sm={7}>
            <Badge color="primary">{config.servers}</Badge>
          </Col>
          <GluuLabel label="fields.use_ssl" size={2} />
          <Col sm={1}>
            <Input
              type="checkbox"
              name="useSSL"
              id="useSSL"
              defaultChecked={config.useSSL}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.password" size={2}/>
          <Col sm={3}>
            <Input
              name="password"
              id="password"
              defaultValue={config.password}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.sentinel_master_group_name" size={4}/>
          <Col sm={3}>
            <Input
              name="sentinelMasterGroupName"
              id="sentinelMasterGroupName"
              defaultValue={config.sentinelMasterGroupName}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.ssl_trust_store_file_path" size={3}/>
          <Col sm={3}>
            <Input
              name="sslTrustStoreFilePath"
              id="sslTrustStoreFilePath"
              defaultValue={config.sslTrustStoreFilePath}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.default_put_expiration" size={2} />
          <Col sm={2}>
            <Input
              id="redisDefaultPutExpiration"
              name="redisDefaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.max_retry_attempts" size={2} />
          <Col sm={2}>
            <Input
              id="maxRetryAttempts"
              name="maxRetryAttempts"
              type="number"
              defaultValue={config.maxRetryAttempts}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.so_timeout" size={2} />
          <Col sm={2}>
            <Input
              id="soTimeout"
              name="soTimeout"
              type="number"
              defaultValue={config.soTimeout}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.max_idle_connections" size={2} />
          <Col sm={2}>
            <Input
              id="maxIdleConnections"
              name="maxIdleConnections"
              type="number"
              defaultValue={config.maxIdleConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.max_total_connections" size={2} />
          <Col sm={2}>
            <Input
              id="maxTotalConnections"
              name="maxTotalConnections"
              type="number"
              defaultValue={config.maxTotalConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label="fields.connection_timeout" size={2} />
          <Col sm={2}>
            <Input
              id="connectionTimeout"
              name="connectionTimeout"
              type="number"
              defaultValue={config.connectionTimeout}
              onChange={formik.handleChange}
            />
          </Col>
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CacheRedis
