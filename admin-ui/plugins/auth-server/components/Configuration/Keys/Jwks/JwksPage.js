import React, { useEffect } from 'react'
import { Card, CardBody } from 'Components'
import { getJwks } from 'Plugins/auth-server/redux/features/jwksSlice'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import JwkItem from './JwkItem'

function JwksPage() {
  const jwks = useSelector((state) => state.jwksReducer.jwks)
  const loading = useSelector((state) => state.jwksReducer.loading)

  const dispatch = useDispatch()

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
                <JwkItem key={index} item={item} index={index} />
              ))
            : ''}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default JwksPage
