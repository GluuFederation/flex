import React from 'react'
import SamlIdpForm from './SamlIdpForm'
import { useLocation } from 'react-router'

const SamlIdpEditPage = () => {
  const { state } = useLocation()

  return <SamlIdpForm configs={state?.rowData} viewOnly={state?.viewOnly || false} />
}

export default SamlIdpEditPage
