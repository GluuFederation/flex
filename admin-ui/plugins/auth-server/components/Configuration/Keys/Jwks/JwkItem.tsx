import React from 'react'
import { Col, FormGroup, Input, Card, CardBody, Accordion } from 'Components'
import { formatDate } from '@/utils/dayjsUtils'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import customColors from '@/customColors'
import type { JwkItemProps } from '../types'
import type { AccordionComponent } from '@/components/Accordion/Accordion.d'
import { DATE_FORMAT } from '../constants'

const AccordionTyped = Accordion as unknown as AccordionComponent

const JwkItem = React.memo(function JwkItem({ item, index }: JwkItemProps): React.ReactElement {
  return (
    <div style={{ marginBottom: '5px' }}>
      <AccordionTyped>
        <AccordionTyped.Header className="text-info">
          <AccordionTyped.Indicator className="me-2" />
          {item.name ?? 'Unnamed Key'}
        </AccordionTyped.Header>
        <AccordionTyped.Body>
          <Card
            style={{
              marginBottom: '5px',
              backgroundColor: index % 2 === 0 ? customColors.white : customColors.whiteSmoke,
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
                    readOnly
                    defaultValue={item.descr ?? ''}
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
                    readOnly
                    defaultValue={item.crv ?? ''}
                  />
                </Col>
                <GluuLabel label="exp" size={1} />
                <Col sm={3}>
                  <Input
                    id="exp"
                    data-testid="exp"
                    name="exp"
                    readOnly
                    defaultValue={item.exp != null ? formatDate(item.exp, DATE_FORMAT) : ''}
                  />
                </Col>
                <GluuLabel label="use" size={1} />
                <Col sm={2}>
                  <Input
                    id="use"
                    data-testid="use"
                    name="use"
                    readOnly
                    defaultValue={item.use ?? ''}
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
                    readOnly
                    defaultValue={item.kty ?? ''}
                  />
                </Col>
                <GluuLabel label="alg" size={1} />
                <Col sm={2}>
                  <Input
                    id="alg"
                    data-testid="alg"
                    name="alg"
                    readOnly
                    defaultValue={item.alg ?? ''}
                  />
                </Col>
                <GluuLabel label="e" size={1} />
                <Col sm={2}>
                  <Input id="e" data-testid="e" name="e" readOnly defaultValue={item.e ?? ''} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label="kid" size={1} />
                <Col sm={6}>
                  <Input
                    id="kid"
                    data-testid="kid"
                    name="kid"
                    readOnly
                    defaultValue={item.kid ?? ''}
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
                    readOnly
                    defaultValue={item.x5c?.[0] ?? ''}
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
                      readOnly
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
                      readOnly
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
                      readOnly
                      defaultValue={item.n}
                    />
                  </Col>
                </FormGroup>
              )}
            </CardBody>
          </Card>
        </AccordionTyped.Body>
      </AccordionTyped>
    </div>
  )
})

JwkItem.displayName = 'JwkItem'

export default JwkItem
