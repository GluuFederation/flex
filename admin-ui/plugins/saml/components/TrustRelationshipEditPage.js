import React from 'react'
import TrustRelationForm from './TrustRelationForm'
import { useLocation } from 'react-router'

const TrustRelationshipEditPage = () => {
  const { state } = useLocation()

  return <TrustRelationForm configs={state?.rowData} viewOnly={state?.viewOnly || false} />
}

export default TrustRelationshipEditPage
