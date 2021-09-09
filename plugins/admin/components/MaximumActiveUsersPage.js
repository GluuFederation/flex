import React, { useState, useEffect } from 'react'
import GluuLoader from '../../../app/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '../../../app/routes/Apps/Gluu/GluuViewWrapper'
import ActiveUserStatPanel from './ActiveUserStatPanel'

import {
  hasBoth,
  buildPayload,
  STAT_READ,
  STAT_JANS_READ,
} from '../../../app/utils/PermChecker'
import { getMau } from './../redux/actions/MauActions'
import { connect } from 'react-redux'

function MaximumActiveUsersPage({ stat, permissions, loading, dispatch }) {
  console.log("=================== stat is "+JSON.stringify(stat))
  const userAction = {}
  const options = {}
  const currentDate = new Date()
  const currentMonth =
    currentDate.getFullYear() +
    String(currentDate.getMonth() + 1).padStart(2, '0')

  useEffect(() => {
    options['month'] = currentMonth
    buildPayload(userAction, 'GET MAU', options)
    dispatch(getMau(userAction))
  }, [])

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper
        canShow={hasBoth(permissions, STAT_READ, STAT_JANS_READ)}
      ></GluuViewWrapper>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    stat: state.mauReducer.stat,
    loading: state.oidcReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(MaximumActiveUsersPage)
