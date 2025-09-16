import React, { useEffect } from 'react'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Card, CardBody } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import JansLockConfiguration from './JansLockConfiguration'
import { getJansLockConfiguration } from 'Plugins/jans-lock/redux/features/JansLockSlice'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { RootState } from '../types/JansLockApiTypes'
import { Dispatch } from '@reduxjs/toolkit'

const JansLock: React.FC = () => {
  const dispatch = useDispatch<Dispatch>()
  const loading = useSelector((state: RootState) => state.jansLockReducer.loading)
  const { t } = useTranslation()

  SetTitle(t('titles.jans_lock'))

  useEffect(() => {
    dispatch(getJansLockConfiguration())
  }, [dispatch])

  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>{!loading && <JansLockConfiguration />}</CardBody>
      </Card>
    </GluuLoader>
  )
}

export default JansLock
