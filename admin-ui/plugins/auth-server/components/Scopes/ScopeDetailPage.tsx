import React, { useMemo, useCallback } from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { SCOPE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import type { ScopeDetailPageProps } from './types'

const CONTAINER_STYLES = { backgroundColor: customColors.whiteSmoke } as const

const ScopeDetailPage: React.FC<ScopeDetailPageProps> = ({ row }) => {
  const { t } = useTranslation()

  const defaultScopeValue = useMemo(
    () => (row.defaultScope ? t('options.yes') : t('options.no')),
    [row.defaultScope, t],
  )

  const attributeKeys = useMemo(() => Object.keys(row.attributes || {}), [row.attributes])

  const labelStyle = useMemo(() => ({ fontWeight: 'bold' as const, color: customColors.black }), [])

  const renderAttributeRow = useCallback(
    (item: string, key: number) => (
      <GluuFormDetailRow
        key={key}
        label={item}
        isBadge={true}
        value={String(row.attributes?.[item as keyof typeof row.attributes])}
        doc_category={SCOPE}
        doc_entry={`attributes.${item}`}
      />
    ),
    [row.attributes],
  )

  return (
    <Container style={CONTAINER_STYLES}>
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
          <GluuFormDetailRow label="fields.id" value={row.id} doc_category={SCOPE} doc_entry="id" />
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
            value={defaultScopeValue}
            doc_category={SCOPE}
            doc_entry="defaultScope"
          />
        </Col>
      </Row>
      <Row>
        <Col sm={3} style={labelStyle}>
          {t('fields.attributes')}:
        </Col>
        <Col sm={9}>{attributeKeys.map(renderAttributeRow)}</Col>
      </Row>
    </Container>
  )
}

export default ScopeDetailPage
