import React, { Fragment } from 'react'
import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { useSelector } from 'react-redux'
import moment from 'moment'

const UserDetailViewPage = ({ row }) => {
  const { rowData } = row
  const DOC_SECTION = 'user'
  const personAttributes = useSelector(
    (state) => state.attributesReducerRoot.items,
  )

  const getCustomAttributeById = (id) => {
    let claimData = null
    for (let i in personAttributes) {
      if (personAttributes[i].name == id) {
        claimData = personAttributes[i]
      }
    }
    return claimData
  }
  return (
    <React.Fragment>
      <Container style={{ backgroundColor: '#F5F5F5' }}>
        <Row>
          <Col sm={4}>
            <GluuFormDetailRow
              label='fields.name'
              value={rowData.displayName}
              doc_category={DOC_SECTION}
              doc_entry='displayName'
            />
          </Col>
          <Col sm={4}>
            <GluuFormDetailRow
              label='fields.givenName'
              value={rowData.givenName}
              doc_category={DOC_SECTION}
              doc_entry='givenName'
            />
          </Col>
          <Col sm={4}>
            <GluuFormDetailRow
              label='fields.userName'
              value={rowData.userId}
              doc_category={DOC_SECTION}
              doc_entry='userId'
            />
          </Col>
          <Col sm={4}>
            <GluuFormDetailRow
              label='fields.email'
              doc_entry='mail'
              value={rowData?.mail}
              doc_category={DOC_SECTION}
            />
          </Col>
          {rowData.customAttributes?.map((data, key) => {
            let valueToShow = ''
            if (data.name == 'birthdate') {
              valueToShow = moment(data?.values[0]).format('YYYY-MM-DD') || ''
            } else {
              valueToShow = data?.values?.[0] || ''
            }

            return (
              <Fragment key={'customAttributes' + key}>
                {valueToShow !== '' ? (
                  <Col sm={4} key={'customAttributes' + key}>
                    <GluuFormDetailRow
                      label={
                        getCustomAttributeById(data.name)
                          ? getCustomAttributeById(data.name).displayName
                          : ''
                      }
                      doc_category={
                        getCustomAttributeById(data.name)
                          ? getCustomAttributeById(data.name).description
                          : ''
                      }
                      isDirect={true}
                      value={
                        typeof valueToShow === 'boolean'
                          ? JSON.stringify(valueToShow)
                          : valueToShow
                      }
                    />
                  </Col>
                ) : null}
              </Fragment>
            )
          })}
        </Row>
      </Container>
    </React.Fragment>
  )
}
export default UserDetailViewPage
