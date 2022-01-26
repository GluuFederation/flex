import React, { useEffect } from 'react'
import { Card, CardBody } from '../../../../../../app/components'
import { getJwks } from '../../../../redux/actions/JwksActions'
import GluuLabel from '../../../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuLoader from '../../../../../../app/routes/Apps/Gluu/GluuLoader'
import { connect } from 'react-redux'
import JwkItem from './JwkItem'

function JwksPage({ jwks, loading, dispatch }) {
  useEffect(() => {
    dispatch(getJwks())
  }, [])

  return (
    <GluuLoader blocking={loading}>
      <GluuLabel label="fields.json_web_keys" size={3} />
      <Card>
        <CardBody>
          {Object.keys(jwks).length
            ? Array.from(jwks['keys']).map((item, index) => (
                <JwkItem key={index} item={item} index={index}></JwkItem>
              ))
            : ''}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    jwks: state.jwksReducer.jwks,
    loading: state.jwksReducer.loading,
  }
}
export default connect(mapStateToProps)(JwksPage)
