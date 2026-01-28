import { Fragment } from 'react'
import { Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { formatDate, isValidDate } from '@/utils/dayjsUtils'
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
            const raw = data?.values?.[0]
            const birthdatePattern = /^\d{4}-\d{2}-\d{2}$/
            if (typeof raw === 'string' && birthdatePattern.test(raw)) {
              valueToShow = isValidDate(raw) ? formatDate(raw, 'YYYY-MM-DD') : ''
            } else {
              valueToShow = ''
            }
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
                      String(
                        getCustomAttributeById(data?.name || '')?.displayName || data?.name || '',
                      ),
                    )}
                    doc_category={sanitizeValue(
                      String(
                        getCustomAttributeById(data?.name || '')?.description || data?.name || '',
                      ),
                    )}
                    isDirect={true}
                    value={sanitizeValue(String(valueToShow))}
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
