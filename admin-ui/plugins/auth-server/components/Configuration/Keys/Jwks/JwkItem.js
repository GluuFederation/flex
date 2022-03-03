import React from 'react'
import {
  Col,
  FormGroup,
  Input,
  Card,
  CardBody,
  Accordion,
} from '../../../../../../app/components'
import moment from 'moment'
import GluuLabel from '../../../../../../app/routes/Apps/Gluu/GluuLabel'
function JwkItem({ item, index }) {

  return (
    <div>
      <FormGroup row />
      <Accordion className="mb-12">
        <Accordion.Header className="text-info">
          <Accordion.Indicator className="mr-2" />
          {item.name}
        </Accordion.Header>
        <Accordion.Body>
          <Card
            style={{
              marginBottom: '5px',
              backgroundColor: index % 2 === 0 ? 'white' : '#f7f7f7',
            }}
          >
            <CardBody>
              <FormGroup row>
                <GluuLabel label="description" size={2} />
                <Col sm={10}>
                  <Input
                    id="description"
                    type="textarea"
                    data-testid="description"
                    name="description"
                    disabled={true}
                    defaultValue={item.descr}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="crv" size={1} />
                <Col sm={2}>
                  <Input
                    id="crv"
                    data-testid="crv"
                    name="crv"
                    disabled={true}
                    defaultValue={item.crv}
                  />
                </Col>
                <GluuLabel label="exp" size={1} />
                <Col sm={3}>
                  <Input
                    id="exp"
                    data-testid="exp"
                    name="exp"
                    disabled={true}
                    defaultValue={moment(item.exp).format("YYYY-MMM-DD")}
                  />
                </Col>
                <GluuLabel label="use" size={1} />
                <Col sm={2}>
                  <Input
                    id="use"
                    data-testid="use"
                    name="use"
                    disabled={true}
                    defaultValue={item.use}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="kty" size={1} />
                <Col sm={2}>
                  <Input
                    id="kty"
                    data-testid="kty"
                    name="kty"
                    disabled={true}
                    defaultValue={item.kty}
                  />
                </Col>
                <GluuLabel label="alg" size={1} />
                <Col sm={2}>
                  <Input
                    id="alg"
                    data-testid="alg"
                    name="alg"
                    disabled={true}
                    defaultValue={item.alg}
                  />
                </Col>
                <GluuLabel label="e" size={1} />
                <Col sm={2}>
                  <Input id="e" data-testid="e" name="e" disabled={true} defaultValue={item.e} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="kid" size={1} />
                <Col sm={6}>
                  <Input
                    id="kid"
                    data-testid="kid"
                    name="kid"
                    disabled={true}
                    defaultValue={item.kid}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="x5c" size={1} />
                <Col sm={11}>
                  <Input
                    id="x5c"
                    type="textarea"
                    data-testid="x5c"
                    name="x5c"
                    disabled={true}
                    defaultValue={item.x5c}
                  />
                </Col>
              </FormGroup>
              {item.x && item.y && (
                <FormGroup row>
                  <GluuLabel label="x" size={1} />
                  <Col sm={5}>
                    <Input
                      id="x"
                      data-testid="x"
                      type="textarea"
                      name="x"
                      disabled={true}
                      defaultValue={item.x}
                    />
                  </Col>
                  <GluuLabel label="y" size={1} />
                  <Col sm={5}>
                    <Input
                      id="y"
                      data-testid="y"
                      type="textarea"
                      name="y"
                      disabled={true}
                      defaultValue={item.y}
                    />
                  </Col>
                </FormGroup>
              )}
              {item.n && (
                <FormGroup row>
                  <GluuLabel label="n" size={1} />
                  <Col sm={11}>
                    <Input
                      id="n"
                      data-testid="n"
                      type="textarea"
                      name="n"
                      disabled={true}
                      defaultValue={item.n}
                    />
                  </Col>
                </FormGroup>
              )}
            </CardBody>
          </Card>
        </Accordion.Body>
      </Accordion>
    </div>
  )
}

export default JwkItem