import { Fragment } from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { useSelector } from 'react-redux'
import moment from 'moment'
import customColors from '@/customColors'
import { RowProps, UserDetailState } from 'Plugins/user-management/types/UserApiTypes'
import { CustomObjectAttribute } from 'JansConfigApi'

const UserDetailViewPage = ({ row }: RowProps) => {
  const { rowData } = row
  const DOC_SECTION = 'user'
  const personAttributes = useSelector(
    (state: UserDetailState) => state.attributesReducerRoot.items,
  )

  const getCustomAttributeById = (id: string) => {
    let claimData = null
    for (const i in personAttributes) {
      if (personAttributes[i].name === id) {
        claimData = personAttributes[i]
      }
    }
    return claimData
  }

  return (
    <Container style={{ backgroundColor: customColors.whiteSmoke, minWidth: '100%' }}>
      <Row>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.name"
            value={rowData.displayName}
            doc_category={DOC_SECTION}
            doc_entry="displayName"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.givenName"
            value={rowData.givenName}
            doc_category={DOC_SECTION}
            doc_entry="givenName"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.userName"
            value={rowData.userId}
            doc_category={DOC_SECTION}
            doc_entry="userId"
          />
        </Col>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.email"
            doc_entry="mail"
            value={rowData?.mail}
            doc_category={DOC_SECTION}
          />
        </Col>
        {rowData.customAttributes?.map((data: CustomObjectAttribute, key: number) => {
          let valueToShow = ''
          if (data.name === 'birthdate') {
            valueToShow = moment(data?.values?.[0]).format('YYYY-MM-DD') || ''
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
                    label={
                      getCustomAttributeById(data?.name || '')?.displayName || data?.name || ''
                    }
                    doc_category={
                      getCustomAttributeById(data?.name || '')?.description || data?.name || ''
                    }
                    isDirect={true}
                    value={
                      typeof valueToShow === 'boolean' ? JSON.stringify(valueToShow) : valueToShow
                    }
                  />
                </Col>
              ) : null}
            </Fragment>
          )
        })}
      </Row>
    </Container>
  )
}

export default UserDetailViewPage
