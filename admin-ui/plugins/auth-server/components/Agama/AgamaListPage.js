import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, Badge } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

function AgamaListPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  SetTitle(t('titles.oidc_clients'))

  return (
    <Card style={applicationStyle.mainCard}>
    </Card>
  )
}

export default AgamaListPage
