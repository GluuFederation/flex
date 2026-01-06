import React, { useContext, ReactElement } from 'react'
import { Col, FormGroup, Input, Card, CardBody, Badge } from 'Components'
import { COUCHBASE } from 'Utils/ApiResources'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'
import type { CouchbaseConfiguration } from 'JansConfigApi'
import type { FormikProps } from 'formik'

interface CouchbaseItemProps {
  couchbase: CouchbaseConfiguration
  index: number
  formik: FormikProps<CouchbaseConfiguration[]>
}

function CouchbaseItem({ couchbase, index, formik }: CouchbaseItemProps): ReactElement {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'

  return (
    <Card
      style={{
        marginBottom: '5px',
        backgroundColor: index % 2 === 0 ? customColors.white : customColors.whiteSmoke,
      }}
    >
      <CardBody>
        {(!couchbase.buckets || !couchbase.defaultBucket) && (
          <FormGroup row>
            <Col style={{ marginBottom: 15 }}>
              <div className="alert alert-warning" role="alert">
                {t('messages.alert_couchbase')}
              </div>
            </Col>
          </FormGroup>
        )}
        {couchbase.configId && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="configId">
            <FormGroup row>
              <GluuLabel label="fields.configuration_id" size={4} />
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
          </GluuTooltip>
        )}
        {couchbase.servers && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="servers">
            <FormGroup row>
              <GluuLabel label="fields.servers" size={4} />
              <Col sm={8}>
                {couchbase.servers.length &&
                  couchbase.servers.map((server, idx) => (
                    <Badge key={idx} color={`primary-${selectedTheme}`} className="ms-1">
                      {server}
                    </Badge>
                  ))}
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.buckets && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="buckets">
            <FormGroup row>
              <GluuLabel label="fields.buckets" size={4} />
              <Col sm={8}>
                {couchbase.buckets.length &&
                  couchbase.buckets.map((bucket, idx) => (
                    <Badge key={idx} color={`primary-${selectedTheme}`} className="ms-1">
                      {bucket}
                    </Badge>
                  ))}
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.defaultBucket && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="defaultBucket">
            <FormGroup row>
              <GluuLabel label="fields.default_bucket" size={4} />
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
          </GluuTooltip>
        )}

        {couchbase.connectTimeout !== 0 && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="connectTimeout">
            <FormGroup row>
              <GluuLabel label="fields.connection_timeout" size={4} />
              <Col sm={8}>
                <Input
                  id="connectTimeout"
                  name="connectTimeout"
                  disabled
                  defaultValue={couchbase.connectTimeout}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.computationPoolSize !== 0 && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="computationPoolSize">
            <FormGroup row>
              <GluuLabel label="fields.computation_pool_size" size={4} />
              <Col sm={8}>
                <Input
                  id="computationPoolSize"
                  name="computationPoolSize"
                  disabled
                  defaultValue={couchbase.computationPoolSize}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.useSSL && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="useSSL">
            <FormGroup row>
              <GluuLabel label="fields.use_ssl" size={4} />
              <Col sm={8}>
                <Input
                  id="useSSL"
                  name="useSSL"
                  type="checkbox"
                  disabled
                  defaultChecked={couchbase.useSSL}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.sslTrustStoreFile && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="sslTrustStoreFile">
            <FormGroup row>
              <GluuLabel label="fields.ssl_trust_store_file" size={4} />
              <Col sm={8}>
                <Input
                  id="sslTrustStoreFile"
                  name="sslTrustStoreFile"
                  disabled
                  defaultValue={couchbase.sslTrustStoreFile}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.sslTrustStoreFormat && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="sslTrustStoreFormat">
            <FormGroup row>
              <GluuLabel label="fields.ssl_trust_store_format" size={4} />
              <Col sm={8}>
                <Input
                  id="sslTrustStoreFormat"
                  name="sslTrustStoreFormat"
                  disabled
                  defaultValue={couchbase.sslTrustStoreFormat}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.sslTrustStorePin && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="sslTrustStorePin">
            <FormGroup row>
              <GluuLabel label="fields.ssl_trust_store_pin" size={4} />
              <Col sm={8}>
                <Input
                  id="sslTrustStorePin"
                  name="sslTrustStorePin"
                  disabled
                  defaultValue={couchbase.sslTrustStorePin}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.userName && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="userName">
            <FormGroup row>
              <GluuLabel label="fields.user_name" size={4} />
              <Col sm={8}>
                <Input
                  id="userName"
                  name="userName"
                  disabled
                  defaultValue={couchbase.userName}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
        {couchbase.userPassword && (
          <GluuTooltip doc_category={COUCHBASE} doc_entry="userPassword">
            <FormGroup row>
              <GluuLabel label="fields.user_password" size={4} />
              <Col sm={8}>
                <Input
                  id="userPassword"
                  name="userPassword"
                  disabled
                  type="password"
                  defaultValue={couchbase.userPassword}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          </GluuTooltip>
        )}
      </CardBody>
    </Card>
  )
}

export default CouchbaseItem
