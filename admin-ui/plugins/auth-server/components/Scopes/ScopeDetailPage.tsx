import React, { useContext } from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { SCOPE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'
import type { ScopeDetailPageProps } from './types'

const ScopeDetailPage: React.FC<ScopeDetailPageProps> = ({ row }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'

  function getBadgeTheme(status: boolean | undefined): string {
    if (status) {
      return `primary-${selectedTheme}`
    } else {
      return 'dimmed'
    }
  }

  return (
    <React.Fragment>
      <Container style={{ backgroundColor: customColors.whiteSmoke }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.inum"
              value={row.inum}
              doc_category={SCOPE}
              doc_entry="inum"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.id"
              value={row.id}
              doc_category={SCOPE}
              doc_entry="id"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.description"
              value={row.description}
              doc_category={SCOPE}
              doc_entry="description"
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.displayname"
              value={row.displayName}
              doc_category={SCOPE}
              doc_entry="displayName"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.scope_type"
              value={row.scopeType}
              doc_category={SCOPE}
              doc_entry="scopeType"
              isBadge
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="fields.default_scope"
              isBadge
              badgeColor={getBadgeTheme(row.defaultScope)}
              value={row.defaultScope ? t('options.yes') : t('options.no')}
              doc_category={SCOPE}
              doc_entry="defaultScope"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>{t('fields.attributes')}:</Col>
          <Col sm={9}>
            {Object.keys(row.attributes || {}).map((item, key) => {
              return (
                <GluuFormDetailRow
                  key={key}
                  label={item}
                  isBadge={true}
                  value={String(row.attributes?.[item as keyof typeof row.attributes])}
                  doc_category={SCOPE}
                  doc_entry={`attributes.${item}`}
                />
              )
            })}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default ScopeDetailPage
