import React, { useContext, useMemo } from 'react'
import { Container, Badge, Row, Col, FormGroup, Label } from 'Components'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import customColors from '@/customColors'
import { DEFAULT_THEME } from '@/context/theme/constants'
import type {
  AttributeDetailPageProps,
  DetailThemeContextType,
} from '../types/AttributeListPage.types'

const AttributeDetailPage = ({ row }: AttributeDetailPageProps): JSX.Element => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as DetailThemeContextType
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const labelStyle = useMemo(
    () => ({
      fontWeight: 'bold' as const,
      color: customColors.black,
    }),
    [],
  )

  const valueStyle = useMemo(
    () => ({
      color: customColors.black,
    }),
    [],
  )

  const badgeStyle = useMemo(
    () => ({
      backgroundColor: themeColors.background,
      color: customColors.white,
      marginRight: '4px',
      marginBottom: '4px',
    }),
    [themeColors.background],
  )

  return (
    <React.Fragment>
      <Container style={{ backgroundColor: customColors.whiteSmoke }}>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6} style={labelStyle}>
                {t('fields.name')}:
              </Label>
              <Label for="input" sm={6} style={valueStyle}>
                {row.name}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label for="input" sm={6} style={labelStyle}>
                {t('fields.displayname')}:
              </Label>
              <Label for="input" sm={6} style={valueStyle}>
                {row.displayName}
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6} style={labelStyle}>
                {t('fields.description')}:
              </Label>
              <Label sm={6} style={valueStyle}>
                {row.description}
              </Label>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup row>
              <Label sm={6} style={labelStyle}>
                {t('fields.status')}:
              </Label>
              <Label sm={6} style={valueStyle}>
                <Badge style={badgeStyle}>{row.status}</Badge>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <Label sm={12} style={labelStyle}>
              {t('fields.attribute_edit_type')}:
            </Label>
          </Col>
          <Col sm={3}>
            {Array.from(row.editType || []).map((item: string) => (
              <Badge key={item} style={badgeStyle}>
                {item}
              </Badge>
            ))}
          </Col>
          <Col sm={3}>
            <Label sm={12} style={labelStyle}>
              {t('fields.attribute_view_type')}:
            </Label>
          </Col>
          <Col sm={3}>
            {Array.from(row.viewType || []).map((item: string) => (
              <Badge key={item} style={badgeStyle}>
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
