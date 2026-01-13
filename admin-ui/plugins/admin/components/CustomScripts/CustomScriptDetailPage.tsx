import React, { useContext } from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'
import { CustomScriptDetailPageProps } from './types'

const CustomScriptDetailPage: React.FC<CustomScriptDetailPageProps> = ({ row }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || 'light'

  return (
    <>
      <Container style={{ backgroundColor: customColors.whiteSmoke, minWidth: '100%' }}>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.inum"
              doc_entry="inum"
              value={row.inum}
              doc_category={SCRIPT}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.name"
              value={row.name}
              doc_category={SCRIPT}
              doc_entry="name"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.location_type"
              value={row.locationType}
              doc_entry="locationType"
              doc_category={SCRIPT}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.description"
              value={row.description}
              doc_category={SCRIPT}
              doc_entry="description"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.internal"
              doc_category={SCRIPT}
              doc_entry="internal"
              isBadge
              badgeColor={`primary-${selectedTheme}`}
              value={row.internal ? t('options.true') : t('options.false')}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="options.enabled"
              doc_category={SCRIPT}
              doc_entry="enabled"
              isBadge
              badgeColor={`primary-${selectedTheme}`}
              value={row.enabled ? t('options.true') : t('options.false')}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label={t('fields.programming_language')}
              doc_category={SCRIPT}
              doc_entry="programmingLanguage"
              value={row.programmingLanguage}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.script_type"
              value={row.scriptType}
              doc_category={SCRIPT}
              doc_entry="scriptType"
            />
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label="fields.level"
              value={row.level}
              doc_entry="level"
              doc_category={SCRIPT}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.revision"
              value={row.revision}
              doc_entry="revision"
              doc_category={SCRIPT}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default CustomScriptDetailPage
