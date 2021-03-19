import React, { useEffect } from 'react'
import {
  Container,
  Card,
  CardBody,
} from './../../../components'
import {
  getJwks,
} from '../../../redux/actions/JwksActions'
import GluuLabel from '../Gluu/GluuLabel'
import { connect } from 'react-redux'
import JwkItem from './JwkItem'
function JwksPage({jwks, loading, dispatch}) {
  useEffect(() => {
    dispatch(getJwks())
  }, [])

  return (
    <React.Fragment>
      <Container>
      <GluuLabel label="JSON Web Keys" size={3} />
        <Card>
          <CardBody>
            
              {Array.from(jwks['keys']).map((item, index) => (
                <JwkItem key={index} item={item} index={index}></JwkItem>
              ))}
              
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {

  return {
    jwks: state.jwksReducer.jwks,
    loading: state.attributeReducer.loading,
  }
}
export default connect(mapStateToProps)(JwksPage)
