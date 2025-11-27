import { Fragment } from 'react'
import { Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import moment from 'moment'
import DOMPurify from 'dompurify'
import customColors from '@/customColors'
import { BIRTHDATE_ATTR } from '../common/Constants'
import { RowProps } from 'Plugins/user-management/types/UserApiTypes'
import { CustomObjectAttribute, useGetAttributes } from 'JansConfigApi'

const UserDetailViewPage = ({ row }: RowProps) => {
  const { rowData } = row
  const DOC_SECTION = 'user'
  const { data: attributesData } = useGetAttributes({
    limit: 200,
    status: 'ACTIVE',
  })
  const personAttributes = attributesData?.entries || []

  const getCustomAttributeById = (id: string) => {
    return personAttributes.find((attr) => attr.name === id) || null
  }

  const sanitizeValue = (value: string): string => {
    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  }

  return (
    <div style={{ backgroundColor: customColors.whiteSmoke, padding: '16px', width: '100%' }}>
      <Row>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.name"
            value={sanitizeValue(rowData.displayName || '')}
            doc_category={DOC_SECTION}
            doc_entry="displayName"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.givenName"
            value={sanitizeValue(rowData.givenName || '')}
            doc_category={DOC_SECTION}
            doc_entry="givenName"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.userName"
            value={sanitizeValue(rowData.userId || '')}
            doc_category={DOC_SECTION}
            doc_entry="userId"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.email"
            doc_entry="mail"
            value={sanitizeValue(rowData?.mail || '')}
            doc_category={DOC_SECTION}
          />
        </Col>
        {rowData.customAttributes?.map((data: CustomObjectAttribute, key: number) => {
          let valueToShow = ''
          if (data.name === BIRTHDATE_ATTR) {
            const m = moment(data?.values?.[0], 'YYYY-MM-DD', true)
            valueToShow = m.isValid() ? m.format('YYYY-MM-DD') : ''
          } else {
            valueToShow = data.multiValued
              ? data?.values?.join(', ') || ''
              : (typeof data.value === 'string' ? data.value : JSON.stringify(data.value)) || ''
          }

          return (
            <Fragment key={'customAttributes' + key}>
              {valueToShow !== '' ? (
                <Col sm={6} xl={4} key={'customAttributes' + key}>
                  <GluuFormDetailRow
                    label={sanitizeValue(
                      getCustomAttributeById(data?.name || '')?.displayName || data?.name || '',
                    )}
                    doc_category={sanitizeValue(
                      getCustomAttributeById(data?.name || '')?.description || data?.name || '',
                    )}
                    isDirect={true}
                    value={sanitizeValue(
                      typeof valueToShow === 'boolean' ? JSON.stringify(valueToShow) : valueToShow,
                    )}
                  />
                </Col>
              ) : null}
            </Fragment>
          )
        })}
      </Row>
    </div>
  )
}

export default UserDetailViewPage
