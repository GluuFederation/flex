import React from 'react'
import {
  Form,
  FormGroup,
  Container,
  Card,
  Divider,
  Badge,
  Col,
  Input,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import { NavigateBeforeSharp } from '@material-ui/icons'
function Fido2Page() {
  const fido2 = {
    issuer: 'https://gasmyr.gluu.org',
    baseEndpoint: 'https://gasmyr.gluu.org/fido2/restv1',
    cleanServiceInterval: 60,
    cleanServiceBatchChunkSize: 10000,
    useLocalCache: true,
    disableJdkLogger: true,
    loggingLevel: 'INFO',
    loggingLayout: 'text',
    externalLoggerConfiguration: '',
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    metricReporterEnabled: true,
    personCustomObjectClassList: ['jansCustomPerson', 'jansPerson'],
    fido2Configuration: {
      authenticatorCertsFolder: '/etc/jans/conf/fido2/authenticator_cert',
      mdsCertsFolder: '/etc/jans/conf/fido2/mds/cert',
      mdsTocsFolder: '/etc/jans/conf/fido2/mds/toc',
      serverMetadataFolder: '/etc/jans/conf/fido2/server_metadata',
      requestedCredentialTypes: ['RS256', 'ES256'],
      requestedParties: [
        { name: 'https://gasmyr.gluu.org', domains: ['gasmyr.gluu.org'] },
      ],
      userAutoEnrollment: false,
      unfinishedRequestExpiration: 180,
      authenticationHistoryExpiration: 1296000,
    },
  }
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
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
                    defaultValue={
                      fido2.fido2Configuration.authenticatorCertsFolder
                    }
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Mds Certs Folder" required size={4} />
                <Col sm={8}>
                  <Input
                    id="mdsCertsFolder"
                    name="mdsCertsFolder"
                    defaultValue={fido2.fido2Configuration.mdsCertsFolder}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Mds to Toc Folder" required size={4} />
                <Col sm={8}>
                  <Input
                    id="mdsTocsFolder"
                    name="mdsTocsFolder"
                    defaultValue={fido2.fido2Configuration.mdsTocsFolder}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Server Metadata Folder" required size={4} />
                <Col sm={8}>
                  <Input
                    id="serverMetadataFolder"
                    name="serverMetadataFolder"
                    defaultValue={fido2.fido2Configuration.serverMetadataFolder}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="Auto Enroll User?" size={2} />
                <Col sm={2}>
                  <Input
                    id="userAutoEnrollment"
                    name="userAutoEnrollment"
                    type="checkbox"
                    defaultChecked={fido2.fido2Configuration.userAutoEnrollment}
                  />
                </Col>
                <GluuLabel label="Unfinished Request Expiration" size={2} />
                <Col sm={2}>
                  <Input
                    id="unfinishedRequestExpiration"
                    name="unfinishedRequestExpiration"
                    type="number"
                    defaultValue={
                      fido2.fido2Configuration.unfinishedRequestExpiration
                    }
                  />
                </Col>
                <GluuLabel label="Authentication History Expiration" size={2} />
                <Col sm={2}>
                  <Input
                    id="authenticationHistoryExpiration"
                    name="authenticationHistoryExpiration"
                    type="number"
                    defaultValue={
                      fido2.fido2Configuration.authenticationHistoryExpiration
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
                  {fido2.fido2Configuration.requestedCredentialTypes.map(
                    (item, index) => (
                      <Badge key={index} color="primary">
                        {item}
                      </Badge>
                    ),
                  )}
                </Col>
              </FormGroup>
              <Divider></Divider>
              <FormGroup row>
                <GluuLabel label="Requested Parties" required size={4} />
                <Col sm={8}>
                  {fido2.fido2Configuration.requestedParties.map(
                    (item, index) => (
                      <FormGroup row key={index}>
                        <GluuLabel label="Name" size={2} />
                        <Col sm={4} key={index}>
                          <Input
                            id="Name"
                            key={index}
                            name="name"
                            type="text"
                            defaultValue={item.name}
                          />
                        </Col>
                        <GluuLabel label="Domains" size={3} />
                        <Col sm={3}>
                          {item.domains.map((domain, key) => (
                            <Badge key={key} color="primary">
                              {domain}
                            </Badge>
                          ))}
                        </Col>
                      </FormGroup>
                    ),
                  )}
                </Col>
              </FormGroup>
              <FormGroup row></FormGroup>
              <GluuFooter />
            </Form>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default Fido2Page
