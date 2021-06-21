import React from 'react'
import {
  Container,
  Badge,
  Row,
  Col,
  FormGroup,
  Label,
} from '../../../../app/components'
import { useTranslation } from 'react-i18next'

const AttributeDetailPage = ({ row }) => {
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
                {row.name}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6}>
                {t('fields.displayname')}:
              </Label>
              <Label for="input" sm={6}>
                {row.displayName}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.description')}:</Label>
              <Label sm={6}>{row.description}</Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6}>{t('fields.status')}:</Label>

              <Label sm={6}>
                <Badge color="primary">{row.status}</Badge>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <Label sm={12}>{t('fields.attribute_edit_type')}:</Label>
          </Col>
          <Col sm={3}>
            {Array.from(row.editType).map((item, index) => (
              <Badge key={index} color="primary">
                {item}
              </Badge>
            ))}
          </Col>
          <Col sm={3}>
            <Label sm={12}>{t('fields.attribute_view_type')}:</Label>
          </Col>
          <Col sm={3}>
            {Array.from(row.viewType).map((item, index) => (
              <Badge key={index} color="primary">
                {item}
              </Badge>
            ))}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}
export default AttributeDetailPage
