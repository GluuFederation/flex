import React, { useEffect } from 'react'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Card, CardBody } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import JansLockConfiguration from './JansLockConfiguration'
import { getJansLockConfiguration } from 'Plugins/jans-lock/redux/features/JansLockSlice'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'

const JansLock = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.jansLockReducer.loading)
  const { t } = useTranslation()

  SetTitle(t('titles.jans_lock'))

  useEffect(() => {
    dispatch(getJansLockConfiguration())
  }, [])

  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>{!loading && <JansLockConfiguration />}</CardBody>
      </Card>
    </GluuLoader>
  )
}

export default JansLock
