import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSsaConfig, removeSsa, getSsaJwt } from '../../redux/features/SsaSlice'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { SSA_PORTAL, SSA_ADMIN, buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import SetTitle from 'Utils/SetTitle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { DeleteOutlined, DownloadOutlined, VisibilityOutlined } from '@mui/icons-material'
import SsaDetailPage from './SsaDetailPage'
import JsonViewerDialog from '../JsonViewer/JsonViewerDialog'
import customColors from '@/customColors'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const SSAListPage = () => {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const userAction = {}
  const navigate = useNavigate()
  const myActions = []
  const dispatch = useDispatch()
  const [limit] = useState(10)
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const { items, loading } = useSelector((state) => state.ssaReducer)
  const jwtData = useSelector((state) => state.ssaReducer.jwt)
  const [downloadRequested, setDownloadRequested] = useState(false)
  const [viewRequested, setViewRequested] = useState(false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.ssa_management'))
  const [ssaDialogOpen, setSsaDialogOpen] = useState(false)
  const ssaDataRef = useRef()

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async () => {
      const permissions = [SSA_PORTAL, SSA_ADMIN]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing SSA permissions:', error)
      }
    }

    authorizePermissions()
  }, [])

  useEffect(() => {
    dispatch(getSsaConfig())
  }, [])

  useEffect(() => {
    if (downloadRequested && jwtData) {
      setDownloadRequested(false)
      const blob = new Blob([jwtData?.ssa], { type: 'text/plain' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      const dateStr = new Date()
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        // eslint-disable-next-line no-useless-escape -- warn only
        .replace(/[\/:,]/g, '-')
        .replace(/\s/g, '_')
      link.download = `ssa-${ssaDataRef.current?.ssa.software_id}-${dateStr}.jwt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 5000)
      ssaDataRef.current = null
    }
  }, [jwtData, downloadRequested])

  useEffect(() => {
    if (viewRequested && jwtData) {
      ssaDataRef.current = jwtData
      toggleSsaDialog()
    }
  }, [jwtData, viewRequested])

  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const tableColumns = [
    { title: t('fields.software_id'), field: 'ssa.software_id' },
    {
      title: t('fields.organization'),
      field: 'ssa.org_id',
    },
    {
      title: t('fields.status'),
      field: 'status',
    },
    {
      title: t('fields.expiration'),
      field: 'expiration',
      render: (rowData) => {
        const date = new Date(rowData.expiration * 1000).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })
        return date
      },
    },
  ]

  const DeleteIcon = useCallback(
    () => <DeleteOutlined style={{ color: customColors.darkGray }} />,
    [],
  )
  const DownloadIcon = useCallback(
    () => <DownloadOutlined style={{ color: customColors.darkGray }} />,
    [],
  )
  const ViewIcon = useCallback(
    () => <VisibilityOutlined style={{ color: customColors.darkGray }} />,
    [],
  )

  if (hasCedarPermission(SSA_ADMIN)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_ssa')}`,
      iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
      isFreeAction: true,
      onClick: () => handleGoToSsaAddPage(),
      disabled: !hasCedarPermission(SSA_ADMIN),
    })
    myActions.push((rowData) => ({
      icon: DeleteIcon,
      iconProps: {
        sx: { color: customColors.accentRed },
        id: rowData.org_id,
      },
      onClick: (event, rowData) => handleSsaDelete(rowData),
      disabled: false,
    }))
  }

  if (hasCedarPermission(SSA_PORTAL) || hasCedarPermission(SSA_ADMIN)) {
    myActions.push((rowData) => ({
      icon: ViewIcon,
      iconProps: { color: 'primary', id: rowData.org_id, style: { color: customColors.lightBlue } },
      onClick: (event, rowData) => handleViewSsa(rowData),
      disabled: false,
    }))
    myActions.push((rowData) => ({
      icon: DownloadIcon,
      iconProps: { color: 'primary', id: rowData.org_id, style: { color: customColors.lightBlue } },
      onClick: (event, rowData) => handleDownloadSsa(rowData),
      disabled: false,
    }))
  }

  const handleSsaDelete = (row) => {
    setItem(row)
    toggle()
  }
  const toggleSsaDialog = () => setSsaDialogOpen(!ssaDialogOpen)

  const handleGoToSsaAddPage = () => {
    navigate('/auth-server/config/ssa/new')
  }

  const onDeletionConfirmed = (message) => {
    buildPayload(userAction, message, item.ssa.jti)
    dispatch(removeSsa({ action: userAction }))
    toggle()
  }
  const handleViewSsa = async (row) => {
    const userAction = {}
    buildPayload(userAction, 'getSsaJwt', row.ssa.jti)
    dispatch(getSsaJwt({ action: userAction }))
    setViewRequested(true)
    setDownloadRequested(false)
  }

  const handleDownloadSsa = (row) => {
    ssaDataRef.current = row
    const userAction = {}
    buildPayload(userAction, 'getSsaJwt', row.ssa.jti)
    dispatch(getSsaJwt({ action: userAction }))
    setDownloadRequested(true)
    setViewRequested(false)
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(SSA_PORTAL)}>
          <MaterialTable
            key={limit || 0}
            components={{
              Container: PaperContainer,
            }}
            columns={tableColumns}
            data={items || []}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={({ rowData }) => {
              return <SsaDetailPage row={rowData} />
            }}
          />
        </GluuViewWrapper>
        {hasCedarPermission(SSA_ADMIN) && (
          <GluuDialog
            row={item}
            name={item?.ssa?.org_id || ''}
            handler={toggle}
            modal={modal}
            subject="ssa configuration"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.ssa_delete}
          />
        )}
        {ssaDataRef.current && ssaDialogOpen && (
          <JsonViewerDialog
            isOpen={ssaDialogOpen}
            toggle={() => setSsaDialogOpen(!ssaDialogOpen)}
            data={ssaDataRef.current}
            title={`JSON View`}
            theme="light"
            expanded={true}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default SSAListPage
