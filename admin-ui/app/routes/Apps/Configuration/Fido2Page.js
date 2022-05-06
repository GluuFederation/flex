import React, { useEffect, useState } from 'react'
import { hasPermission, FIDO_WRITE } from '../../../utils/PermChecker'
import {
  Form,
  FormGroup,
  Container,
  CustomInput,
  Card,
  Divider,
  Col,
  Input,
  InputGroup,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import GluuLoader from '../Gluu/GluuLoader'
import GluuTypeAhead from '../Gluu/GluuTypeAhead'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import {
  getFidoConfig,
  editFidoConfig,
} from '../../../redux/actions/FidoActions'
import GluuNameValuesProperty from '../Gluu/GluuNameValuesProperty'

function Fido2Page({ fido, permissions, dispatch }) {
  useEffect(() => {
    dispatch(getFidoConfig())
  }, [])
  const [init, setInit] = useState(false)
  const requested_parties = 'requested_parties'
  const requestedPartiesList = []

  function requestedPartiesValidator() {
    return true
  }

  const initialValues = {
    issuer: fido.issuer,
    baseEndpoint: fido.baseEndpoint,
    cleanServiceInterval: fido.cleanServiceInterval,
    cleanServiceBatchChunkSize: fido.cleanServiceBatchChunkSize,
    useLocalCache: fido.useLocalCache,
    disableJdkLogger: fido.disableJdkLogger,
    loggingLevel: fido.loggingLevel,
    loggingLayout: fido.loggingLayout,
    externalLoggerConfiguration: fido.externalLoggerConfiguration,
    metricReporterInterval: fido.metricReporterInterval,
    metricReporterKeepDataDays: fido.metricReporterKeepDataDays,
    metricReporterEnabled: fido.metricReporterEnabled,
    personCustomObjectClassList: fido.personCustomObjectClassList,
    fido2Configuration: fido.fido2Configuration,
  }

  function toogle() {
    if (!init) {
      setInit(true)
    }
  }

  return (
    <GluuLoader blocking={true}>
      <Container>
        <Card>
          <CardBody>
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                const result = Object.assign(fido, values)
                const opts = {}
                opts['jansFido2DynConfiguration'] = result
                dispatch(editFidoConfig(opts))
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <GluuLabel label="Issuer" required size={4} />
                    <Col sm={8}>
                      <Input
                        id="issuer"
                        name="issuer"
                        onChange={formik.handleChange}
                        defaultValue={fido.issuer}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel
                      label="Base URL of the Endpoints"
                      required
                      size={4}
                    />
                    <Col sm={8}>
                      <Input
                        id="baseEndpoint"
                        name="baseEndpoint"
                        onChange={formik.handleChange}
                        defaultValue={fido.baseEndpoint}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <GluuLabel label="Use Local Cache?" size={2} />
                    <Col sm={2}>
                      <Input
                        id="useLocalCache"
                        name="useLocalCache"
                        onChange={formik.handleChange}
                        type="checkbox"
                        defaultChecked={fido.useLocalCache}
                      />
                    </Col>
                    <GluuLabel label="Clean Service Interval" size={2} />
                    <Col sm={2}>
                      <Input
                        id="cleanServiceInterval"
                        name="cleanServiceInterval"
                        type="number"
                        onChange={formik.handleChange}
                        defaultValue={fido.cleanServiceInterval}
                      />
                    </Col>
                    <GluuLabel
                      label="Clean Service Batch Chunk Size"
                      size={2}
                    />
                    <Col sm={2}>
                      <Input
                        id="cleanServiceBatchChunkSize"
                        name="cleanServiceBatchChunkSize"
                        type="number"
                        onChange={formik.handleChange}
                        defaultValue={fido.cleanServiceBatchChunkSize}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <GluuLabel label="Disable Jdk Logger?" size={2} />
                    <Col sm={2}>
                      <Input
                        id="disableJdkLogger"
                        name="disableJdkLogger"
                        onChange={formik.handleChange}
                        type="checkbox"
                        defaultChecked={fido.disableJdkLogger}
                      />
                    </Col>
                    <GluuLabel label="loggingLevel" size={2} />
                    <Col sm={2}>
                      <InputGroup>
                        <CustomInput
                          type="select"
                          multiple
                          id="loggingLevel"
                          name="loggingLevel"
                          defaultValue={fido.loggingLevel}
                          onChange={formik.handleChange}
                        >
                          <option value="TRACE">TRACE</option>
                          <option value="DEBUG">DEBUG</option>
                          <option value="INFO">INFO</option>
                          <option value="WARN">WARN</option>
                          <option value="ERROR">ERROR</option>
                          <option value="FATAL">FATAL</option>
                          <option value="OFF">OFF</option>
                        </CustomInput>
                      </InputGroup>
                    </Col>

                    <GluuLabel label="loggingLayout" size={2} />
                    <Col sm={2}>
                      <InputGroup>
                        <CustomInput
                          type="select"
                          multiple
                          id="loggingLayout"
                          name="loggingLayout"
                          defaultValue={fido.loggingLayout}
                          onChange={formik.handleChange}
                        >
                          <option value="text">text</option>
                          <option value="json">json</option>
                        </CustomInput>
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel label="External Logger Configuration" size={4} />
                    <Col sm={8}>
                      <Input
                        id="externalLoggerConfiguration"
                        name="externalLoggerConfiguration"
                        onChange={formik.handleChange}
                        defaultValue={fido.externalLoggerConfiguration}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel label="Metric Reporter Enabled?" size={2} />
                    <Col sm={2}>
                      <Input
                        id="metricReporterEnabled"
                        name="metricReporterEnabled"
                        onChange={formik.handleChange}
                        type="checkbox"
                        defaultChecked={fido.metricReporterEnabled}
                      />
                    </Col>
                    <GluuLabel label="Metric Reporter Interval" size={2} />
                    <Col sm={2}>
                      <Input
                        id="metricReporterInterval"
                        name="metricReporterInterval"
                        type="number"
                        onChange={formik.handleChange}
                        defaultValue={fido.metricReporterInterval}
                      />
                    </Col>
                    <GluuLabel
                      label="Metric Reporter Keep Data In Days"
                      size={2}
                    />
                    <Col sm={2}>
                      <Input
                        id="metricReporterKeepDataDays"
                        name="metricReporterKeepDataDays"
                        type="number"
                        onChange={formik.handleChange}
                        defaultValue={fido.metricReporterKeepDataDays}
                      />
                    </Col>
                    <FormGroup row>
                      <Col sm={9}>
                        <GluuTypeAhead
                          name="personCustomObjectClassList"
                          label="LDAP custom object class list for dynamic person enrollment"
                          formik={formik}
                          options={[]}
                          required={true}
                          onKeyUp={toogle}
                          value={fido.personCustomObjectClassList}
                        ></GluuTypeAhead>
                      </Col>
                    </FormGroup>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel
                      label="Authenticator Certs Folder"
                      required
                      size={4}
                    />
                    <Col sm={8}>
                      <Input
                        id="authenticatorCertsFolder"
                        name="authenticatorCertsFolder"
                        onChange={formik.handleChange}
                        defaultValue={
                          fido.fido2Configuration.authenticatorCertsFolder
                        }
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel label="Mds Access Token" size={4} />
                    <Col sm={8}>
                      <Input
                        id="mdsAccessToken"
                        name="mdsAccessToken"
                        onChange={formik.handleChange}
                        defaultValue={fido.fido2Configuration.mdsAccessToken}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel label="Mds Certs Folder" required size={4} />
                    <Col sm={8}>
                      <Input
                        id="mdsCertsFolder"
                        name="mdsCertsFolder"
                        onChange={formik.handleChange}
                        defaultValue={fido.fido2Configuration.mdsCertsFolder}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel label="Mds Toc Folder" required size={4} />
                    <Col sm={8}>
                      <Input
                        id="mdsTocsFolder"
                        name="mdsTocsFolder"
                        onChange={formik.handleChange}
                        defaultValue={fido.fido2Configuration.mdsTocsFolder}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel label="Check U2f Attestations" size={3} />
                    <Col sm={3}>
                      <InputGroup>
                        <CustomInput
                          type="select"
                          id="checkU2fAttestations"
                          name="checkU2fAttestations"
                          defaultValue={
                            fido.fido2Configuration.checkU2fAttestationss
                          }
                          onChange={formik.handleChange}
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </CustomInput>
                      </InputGroup>
                    </Col>

                    <GluuLabel label="User Auto Enrollment" size={3} />
                    <Col sm={3}>
                      <InputGroup>
                        <CustomInput
                          type="select"
                          id="userAutoEnrollment"
                          name="userAutoEnrollment"
                          defaultValue={
                            fido.fido2Configuration.userAutoEnrollment
                          }
                          onChange={formik.handleChange}
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </CustomInput>
                      </InputGroup>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <GluuLabel
                      label="Server Metadata Folder"
                      required
                      size={4}
                    />
                    <Col sm={8}>
                      <Input
                        id="serverMetadataFolder"
                        name="serverMetadataFolder"
                        onChange={formik.handleChange}
                        defaultValue={
                          fido.fido2Configuration.serverMetadataFolder
                        }
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <GluuLabel label="Unfinished Request Expiration" size={2} />
                    <Col sm={2}>
                      <Input
                        id="unfinishedRequestExpiration"
                        name="unfinishedRequestExpiration"
                        type="number"
                        onChange={formik.handleChange}
                        defaultValue={
                          fido.fido2Configuration.unfinishedRequestExpiration
                        }
                      />
                    </Col>
                    <GluuLabel
                      label="Authentication History Expiration"
                      size={2}
                    />
                    <Col sm={2}>
                      <Input
                        id="authenticationHistoryExpiration"
                        name="authenticationHistoryExpiration"
                        type="number"
                        onChange={formik.handleChange}
                        defaultValue={
                          fido.fido2Configuration
                            .authenticationHistoryExpiration
                        }
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <GluuLabel
                      label="Requested Credential Types"
                      required
                      size={4}
                    />
                    <Col sm={8}>
                      <InputGroup>
                        <CustomInput
                          type="select"
                          multiple
                          id="requestedCredentialTypes"
                          name="requestedCredentialTypes"
                          defaultValue={
                            fido.fido2Configuration.requestedCredentialTypes
                          }
                          onChange={formik.handleChange}
                        >
                          <option value="ES256">ES256</option>
                          <option value="ES384">ES384</option>
                          <option value="ES512">ES512</option>
                          <option value="ED256">ED256</option>
                          <option value="ED512">ED512</option>
                          <option value="ECDH_ES_HKDF_256">
                            ECDH_ES_HKDF_256
                          </option>
                          <option value="RS256">RS256</option>
                          <option value="RS384">RS384</option>
                          <option value="RS512">RS512</option>
                          <option value="RS65535">RS65535</option>
                          <option value="PS256">PS256</option>
                          <option value="PS384">PS384</option>
                          <option value="PS512">PS512</option>
                          <option value="RS1">RS1</option>
                        </CustomInput>
                      </InputGroup>
                    </Col>
                  </FormGroup>

                  <GluuNameValuesProperty
                    formik={formik}
                    name="requestedParties"
                    label1="Name"
                    name1="name"
                    placeholder1="Enter requested party name"
                    label2="Domains"
                    name2="domains"
                    placeholder2="Enter requested party domains"
                    value={fido.fido2Configuration.requestedParties || []}
                    inputId={requested_parties}
                    options={requestedPartiesList}
                    validator={requestedPartiesValidator}
                  ></GluuNameValuesProperty>
                  <Divider></Divider>
                  <FormGroup row></FormGroup>
                  {hasPermission(permissions, FIDO_WRITE) && <GluuFooter />}
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </Container>
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    fido: state.fidoReducer.fido,
    loading: state.fidoReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(Fido2Page)
