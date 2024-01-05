import React, { useEffect } from 'react'
import SamlConfigurationForm from './SamlConfigurationForm'
import { useDispatch, useSelector } from 'react-redux'
import { getSamlConfiguration } from 'Plugins/saml/redux/features/SamlSlice'

const IdpConfigTab = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.idpSamlReducer.loading)

  useEffect(() => {
    dispatch(getSamlConfiguration())
  }, [])

  return <>{!loading && <SamlConfigurationForm />}</>
}

export default IdpConfigTab
