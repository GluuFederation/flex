import React from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import customColors from '@/customColors'
import type { SessionDetailPageProps } from './types'
import { DOC_CATEGORY } from './types'

const SessionDetailPage: React.FC<SessionDetailPageProps> = ({ row }) => {
  // Helper function to safely format date
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-'

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return dateObj.toDateString()
    } catch (error) {
      console.warn('Error formatting date:', error)
      return '-'
    }
  }

  // Helper function to extract Jans ID from userDn
  const extractJansId = (userDn: string | undefined): string => {
    if (!userDn) return '-'

    try {
      const parts = userDn.split(',')
      if (parts.length > 0) {
        const firstPart = parts[0]
        const equalIndex = firstPart.indexOf('=')
        if (equalIndex !== -1) {
          return firstPart.substring(equalIndex + 1)
        }
      }
      return '-'
    } catch (error) {
      console.warn('Error extracting Jans ID:', error)
      return '-'
    }
  }

  // Helper function to safely stringify objects
  const safeStringify = (
    obj:
      | SessionDetailPageProps['row']['permissionGrantedMap']
      | SessionDetailPageProps['row']['sessionAttributes']
      | null,
  ): string => {
    if (!obj) return '-'

    try {
      return JSON.stringify(obj, null, 2)
    } catch (error) {
      console.warn('Error stringifying object:', error)
      return '-'
    }
  }

  return (
    <Container style={{ backgroundColor: customColors.whiteSmoke, minWidth: '100%' }}>
      <Row>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.expiration"
            value={formatDate(row.expirationDate)}
            doc_category={DOC_CATEGORY}
            doc_entry="expirationDate"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_id"
            value={extractJansId(row.userDn)}
            doc_category={DOC_CATEGORY}
            doc_entry="jansId"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_state"
            value={row.state ?? '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansState"
          />
        </Col>
      </Row>

      <Row>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_sess_state"
            value={row.sessionState ?? '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansSessState"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_user_dn"
            value={row.userDn ?? '-'}
            doc_category={DOC_CATEGORY}
            doc_entry="jansUsrDN"
          />
        </Col>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.permission_granted_map"
            value={safeStringify(row.permissionGrantedMap)}
            doc_category={DOC_CATEGORY}
            doc_entry="permissionGrantedMap"
          />
        </Col>
      </Row>

      <Row>
        <Col sm={4}>
          <GluuFormDetailRow
            label="fields.jans_sess_attr"
            value={safeStringify(row.sessionAttributes)}
            doc_category={DOC_CATEGORY}
            doc_entry="jansSessAttr"
          />
        </Col>
      </Row>
    </Container>
  )
}

export default SessionDetailPage
