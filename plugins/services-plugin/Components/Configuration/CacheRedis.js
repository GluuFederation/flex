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
        <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>redisConfiguration:</Col>
          <GluuLabel label={t("Redis Provider Type")} size={4} />
          <Col sm={8}>
            <InputGroup>
              <CustomInput
                type="select"
                id="redisProviderType"
                name="redisProviderType"
                defaultValue={config.redisProviderType}
                onChange={formik.handleChange}
              >
                <option>{t("STANDALONE")}</option>
                <option>{t("CLUSTER")}</option>
                <option>{t("SHARDED")}</option>
                <option>{t("SENTINEL")}</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label={t("Servers")} size={2} />
          <Col sm={7}>
            <Badge color="primary">{config.servers}</Badge>
          </Col>
          <GluuLabel label={t("Use SSL")} size={2} />
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
          <GluuLabel label={t("Password")} size={2}/>
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
          <GluuLabel label={t("sentinelMasterGroupName")} size={4}/>
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
          <GluuLabel label={t("sslTrustStoreFilePath")} size={3}/>
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
          <GluuLabel label={t("Default Put Expiration")} size={2} />
          <Col sm={2}>
            <Input
              id="redisDefaultPutExpiration"
              name="redisDefaultPutExpiration"
              type="number"
              defaultValue={config.defaultPutExpiration}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Max Retry Attempts")} size={2} />
          <Col sm={2}>
            <Input
              id="maxRetryAttempts"
              name="maxRetryAttempts"
              type="number"
              defaultValue={config.maxRetryAttempts}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("So Timeout")} size={2} />
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
          <GluuLabel label={t("Max Idle Connections")} size={2} />
          <Col sm={2}>
            <Input
              id="maxIdleConnections"
              name="maxIdleConnections"
              type="number"
              defaultValue={config.maxIdleConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Max Total Connections")} size={2} />
          <Col sm={2}>
            <Input
              id="maxTotalConnections"
              name="maxTotalConnections"
              type="number"
              defaultValue={config.maxTotalConnections}
              onChange={formik.handleChange}
            />
          </Col>
          <GluuLabel label={t("Connection Timeout")} size={2} />
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
