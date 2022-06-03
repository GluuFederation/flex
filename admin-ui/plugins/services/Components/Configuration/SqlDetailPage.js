import React from 'react'
import {
  Container,
  Badge,
  Row,
  Col,
  FormGroup,
  Label,
} from 'Components'
import { useTranslation } from 'react-i18next'

const SqlDetailPage = ({ row }) => {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                {t('fields.name')}:
              </Label>
              <Label for="input" sm={6}>
                {row.configId}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                {t('fields.username')}:
              </Label>
              <Label for="input" sm={6}>
                {row.userName}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.connectionUris')}:</Label>
              <Label sm={6}>
                {row.connectionUri &&
                  row.connectionUri.map((ele, index) => (
                    <Badge key={index} color="primary">
                      {ele}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.binaryAttributes')}:</Label>
              <Label sm={6}>
                {row.binaryAttributes &&
                  row.binaryAttributes.map((attr, index) => (
                    <Badge key={index} color="primary">
                      {attr}
                    </Badge>
                  ))}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>{t('fields.schemaName')}:</Label>
              <Label sm={6}>{row.schemaName}</Label>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>{t('fields.passwordEncryptionMethod')}:</Label>
              <Label sm={6}>{row.passwordEncryptionMethod}</Label>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup row>
              <Label sm={6}>{t('fields.serverTimezone')}:</Label>
              <Label sm={6}>{row.serverTimezone}</Label>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}
export default SqlDetailPage
