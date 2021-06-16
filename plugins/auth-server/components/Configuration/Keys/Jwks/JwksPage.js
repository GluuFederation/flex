import React, { useEffect } from 'react'
import { Container, Card, CardBody } from '../../../../../../app/components'
import { getJwks } from '../../../../redux/actions/JwksActions'
import BlockUi from 'react-block-ui'
import GluuFooter from '../../../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuLabel from '../../../../../../app/routes/Apps/Gluu/GluuLabel'
import { connect } from 'react-redux'
import JwkItem from './JwkItem'
import { useTranslation } from 'react-i18next'

function JwksPage({ jwks, loading, dispatch }) {
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(getJwks())
  }, [])

  return (
    <React.Fragment>
      <Container>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={t("Performing the request, please wait!")}
        >
          <GluuLabel label={t("JSON Web Keys")} size={3} />
          <Card>
            <CardBody>
              {Object.keys(jwks).length
                ? Array.from(jwks['keys']).map((item, index) => (
                    <JwkItem key={index} item={item} index={index}></JwkItem>
                  ))
                : ''}
            </CardBody>
          </Card>
          <GluuFooter hideButtons={{ save: true }} />
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    jwks: state.jwksReducer.jwks,
    loading: state.jwksReducer.loading,
  }
}
export default connect(mapStateToProps)(JwksPage)
