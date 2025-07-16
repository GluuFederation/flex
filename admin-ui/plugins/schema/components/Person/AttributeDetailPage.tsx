import React, { useContext } from 'react'
import { Container, Badge, Row, Col, FormGroup, Label } from 'Components'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'

// Import the AttributeItem interface from the form component
interface AttributeItem {
  inum?: string
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  jansHideOnDiscovery: boolean
  oxMultiValuedAttribute: boolean
  attributeValidation: {
    regexp?: string | null
    minLength?: number | null
    maxLength?: number | null
  }
  scimCustomAttr: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
}

interface AttributeDetailPageProps {
  row: AttributeItem
}

const AttributeDetailPage: React.FC<AttributeDetailPageProps> = ({ row }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'darkBlack'

  return (
    <React.Fragment>
      <Container style={{ backgroundColor: customColors.whiteSmoke }}>
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
                <Badge color={`primary-${selectedTheme}`}>{row.status}</Badge>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <Label sm={12}>{t('fields.attribute_edit_type')}:</Label>
          </Col>
          <Col sm={3}>
            {row.editType.map((item: string, index: number) => (
              <Badge key={`edit-${index}`} color={`primary-${selectedTheme}`}>
                {item}
              </Badge>
            ))}
          </Col>
          <Col sm={3}>
            <Label sm={12}>{t('fields.attribute_view_type')}:</Label>
          </Col>
          <Col sm={3}>
            {row.viewType.map((item: string, index: number) => (
              <Badge key={`view-${index}`} color={`primary-${selectedTheme}`}>
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
