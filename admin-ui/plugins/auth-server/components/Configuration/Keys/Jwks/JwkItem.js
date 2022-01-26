import React from 'react'
import {
  Col,
  FormGroup,
  Input,
  Card,
  CardBody,
} from '../../../../../../app/components'
import GluuLabel from '../../../../../../app/routes/Apps/Gluu/GluuLabel'
function JwkItem({ item, index }) {
  return (
    <Card
      style={{
        marginBottom: '5px',
        backgroundColor: index % 2 === 0 ? 'white' : '#f7f7f7',
      }}
    >
      <CardBody>
        <FormGroup row>
          <GluuLabel label="crv" size={1} />
          <Col sm={2}>
            <Input
              id="crv"
              data-testid="crv"
              name="crv"
              defaultValue={item.crv}
            />
          </Col>
          <GluuLabel label="exp" size={1} />
          <Col sm={3}>
            <Input
              id="exp"
              data-testid="exp"
              name="exp"
              defaultValue={item.exp}
            />
          </Col>
          <GluuLabel label="use" size={1} />
          <Col sm={2}>
            <Input
              id="use"
              data-testid="use"
              name="use"
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
              defaultValue={item.kty}
            />
          </Col>
          <GluuLabel label="alg" size={1} />
          <Col sm={2}>
            <Input
              id="alg"
              data-testid="alg"
              name="alg"
              defaultValue={item.alg}
            />
          </Col>
          <GluuLabel label="e" size={1} />
          <Col sm={2}>
            <Input id="e" data-testid="e" name="e" defaultValue={item.e} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="kid" size={1} />
          <Col sm={6}>
            <Input
              id="kid"
              data-testid="kid"
              name="kid"
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
                defaultValue={item.n}
              />
            </Col>
          </FormGroup>
        )}
      </CardBody>
    </Card>
  )
}

export default JwkItem
