import React from 'react'
import { FormGroup, Card, CardBody } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

function ConfigPage({ loading, dispatch }) {
  const { t } = useTranslation()

  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody style={{ minHeight: 500 }}></CardBody>
      </Card>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.authReducer.permissions,
    loading: state.testReducer.loading,
  }
}

export default connect(mapStateToProps)(ConfigPage)
