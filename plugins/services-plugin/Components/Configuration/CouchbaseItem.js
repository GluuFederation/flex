import React from 'react'
import {
  Col,
  FormGroup,
  Input,
  Card,
  CardBody,
  Badge,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'

function CouchbaseItem({ couchbase, index, formik }) {
  const { t } = useTranslation()
  return (
    <Card
      style={{
        marginBottom: '5px',
        backgroundColor: index % 2 === 0 ? 'white' : '#f7f7f7',
      }}
    >
      <CardBody>
        {
          (!couchbase.buckets || !couchbase.defaultBucket) && (
            <FormGroup row>
              <Col style={{ marginBottom: 15}}>
                <div className="alert alert-warning" role="alert">
                  {t("Backing data source is not Couchbase !")}
                </div>
              </Col>
            </FormGroup>
          )
        }
        {
          couchbase.configId && (
            <FormGroup row>
              <GluuLabel label={t("Configuration Id")} size={4} />
              <Col sm={8}>
                <Input
                  id="configId"
                  name="configId"
                  disabled
                  defaultValue={couchbase.configId}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          )
        }
        {
          couchbase.servers && (
            <FormGroup row>
              <GluuLabel label={t("Servers")} size={4} />
              <Col sm={8}>
                {couchbase.servers.length && couchbase.servers.map((server, index) => (
                  <Badge key={index} color="primary" className="ml-1">
                    {server}
                  </Badge>
                ))}
              </Col>
            </FormGroup> 
          )
        }
        {
          couchbase.buckets && (
            <FormGroup row>
              <GluuLabel label={t("Buckets")} size={4} />
              <Col sm={8}>
                { couchbase.buckets.length && couchbase.buckets.map((bucket, index) => (
                  <Badge key={index} color="primary" className="ml-1">
                    {bucket}
                  </Badge>
                ))}
              </Col>
            </FormGroup>
          )
        }
        {
          couchbase.defaultBucket && (
            <FormGroup row>
              <GluuLabel label={("Default Bucket")} size={4} />
              <Col sm={8}>
                <Input
                  id="defaultBucket"
                  name="defaultBucket"
                  disabled
                  defaultValue={couchbase.defaultBucket}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          )
        }
        <FormGroup row>
          { couchbase.connectTimeout !== 0 && <GluuLabel label={t("Connection Timeout")} size={2} />}
          {
            couchbase.connectTimeout !== 0 && (
              <Col sm={2}>
                <Input
                  id="connectTimeout"
                  name="connectTimeout"
                  disabled
                  defaultValue={couchbase.connectTimeout}
                  onChange={formik.handleChange}
                />
              </Col>
            )
          }
          { couchbase.computationPoolSize !== 0 && <GluuLabel label={t("Computation Pool Size")} size={2} />}
          {
            couchbase.computationPoolSize !== 0 && (
              <Col sm={2}>
                <Input
                  id="computationPoolSize"
                  name="computationPoolSize"
                  disabled
                  defaultValue={couchbase.computationPoolSize}
                  onChange={formik.handleChange}
                />
              </Col>
            )
          }
          { couchbase.useSSL && <GluuLabel label={t("Use SSL")} size={3} />}
          {
            couchbase.useSSL && (
              <Col sm={1}>
                <Input
                  id="useSSL"
                  name="useSSL"
                  type="checkbox"
                  disabled
                  defaultChecked={couchbase.useSSL}
                  onChange={formik.handleChange}
                />
              </Col>
            )
          }
        </FormGroup>
        <FormGroup row>
          { couchbase.sslTrustStoreFile && <GluuLabel label={t("SSL Trust Store File")} size={2} /> }
          {
            couchbase.sslTrustStoreFile && (
              <Col sm={2}>
                <Input
                  id="sslTrustStoreFile"
                  name="sslTrustStoreFile"
                  disabled
                  defaultValue={couchbase.sslTrustStoreFile}
                  onChange={formik.handleChange}
                />
              </Col>
            )
          }
          { couchbase.sslTrustStoreFormat && <GluuLabel label={t("SSL Trust Store Format")} size={2} /> }
          {couchbase.sslTrustStoreFormat && (
            <Col sm={2}>
              <Input
                id="sslTrustStoreFormat"
                name="sslTrustStoreFormat"
                disabled
                defaultValue={couchbase.sslTrustStoreFormat}
                onChange={formik.handleChange}
              />
            </Col>
          )}
          { couchbase.sslTrustStorePin && <GluuLabel label={t("SSL Trust Store Pin")} size={2} />}
          {
            couchbase.sslTrustStorePin && (
              <Col sm={2}>
                <Input
                  id="sslTrustStorePin"
                  name="sslTrustStorePin"
                  disabled
                  defaultChecked={couchbase.sslTrustStorePin}
                  onChange={formik.handleChange}
                />
              </Col>
            )
          }
        </FormGroup>
        <FormGroup row>
          {couchbase.userName && <GluuLabel label={t("User Name")} size={2} />}
          {
            couchbase.userName && (
              <Col sm={3}>
                <Input
                  id="userName"
                  name="userName"
                  disabled
                  defaultChecked={couchbase.userName}
                  onChange={formik.handleChange}
                />
              </Col>
            )
          }
          { couchbase.userPassword && <GluuLabel label="User Password" size={2} />}
          {
            couchbase.userPassword && (
              <Col sm={4}>
                <Input
                  id="userPassword"
                  name="userPassword"
                  disabled
                  defaultChecked={couchbase.userPassword}
                  onChange={formik.handleChange}
                />
              </Col>
            )
          }
        </FormGroup>
      </CardBody>
    </Card>
  )
}

export default CouchbaseItem
