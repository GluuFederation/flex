import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSsaConfig, removeSsa } from '../../redux/features/SsaSlice'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  hasPermission,
  SSA_PORTAL,
  SSA_ADMIN,
  buildPayload,
} from 'Utils/PermChecker'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import SetTitle from 'Utils/SetTitle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { DeleteOutlined, DownloadOutlined, VisibilityOutlined } from '@mui/icons-material'
import SsaDetailPage from './SsaDetailPage'
import JsonViewerDialog from '../JsonViewer/JsonViewerDialog'
const SSAListPage = () => {
  const { t } = useTranslation()
  const userAction = {}
  const navigate = useNavigate()
  const myActions = []
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(10)
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const { items, loading } = useSelector((state) => state.ssaReducer)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.ssa_management'))
  const [ssaDialogOpen, setSsaDialogOpen] = useState(false);
  const [ssaData, setSsaData] = useState();
  useEffect(() => {
    dispatch(getSsaConfig())
  }, [])

  const PaperContainer = useCallback(
    (props) => <Paper {...props} elevation={0} />,
    []
  )

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

  if (hasPermission(permissions, SSA_ADMIN)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_ssa')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToSsaAddPage(),
      disabled: !hasPermission(permissions, SSA_ADMIN),
    })
  }
  const DeleteIcon = useCallback(() => <DeleteOutlined style={{ color: 'red' }}/>, [])
  const DownloadIcon = useCallback(() => <DownloadOutlined style={{ color: 'primary' }}/>, [])
  const ViewIcon = useCallback(() => <VisibilityOutlined style={{ color: 'primary' }}/>, [])

  if (hasPermission(permissions, SSA_PORTAL) || hasPermission(permissions, SSA_ADMIN)) {
    myActions.push((rowData) => ({
      icon: ViewIcon,
      iconProps: {
        color: 'primary',
        id: rowData.org_id,
      },
      onClick: (event, rowData) => handleViewSsa(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SSA_PORTAL) || hasPermission(permissions, SSA_ADMIN)) {
    myActions.push((rowData) => ({
      icon: DownloadIcon,
      iconProps: {
        color: 'primary',
        id: rowData.org_id,
      },
      onClick: (event, rowData) => handleDownloadSsa(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SSA_ADMIN)) {
    myActions.push((rowData) => ({
      icon: DeleteIcon,
      iconProps: {
        sx: { color: 'red' },
        id: rowData.org_id,
      },
      onClick: (event, rowData) => handleSsaDelete(rowData),
      disabled: false,
    }))
  }


  const handleSsaDelete = (row) => {
    setItem(row)
    toggle()
  }
  const toggleSsaDialog = () => setSsaDialogOpen(!ssaDialogOpen);

  const handleGoToSsaAddPage = () => {
    navigate('/auth-server/config/ssa/new')
  }

  const onDeletionConfirmed = (message) => {
    buildPayload(userAction, message, item.ssa.jti)
    dispatch(removeSsa({ action: userAction }))
    toggle()
  }
  const handleViewSsa = (row) => {
    setSsaData(row)
    toggleSsaDialog()
  }

  const handleDownloadSsa = (row) => {
    const jsonData = JSON.stringify(row.ssa, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const dateStr = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/[\/:,]/g, '-').replace(/\s/g, '_')
    link.download = `ssa-${row.ssa.software_id}-${dateStr}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, SSA_PORTAL)}>
          <MaterialTable
            key={limit || 0}
            components={{
              Container: PaperContainer,
            }}
            columns={tableColumns}
            data={items || []}
            isLoading={loading}
            title=''
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
        {hasPermission(permissions, SSA_ADMIN) && (
          <GluuDialog
            row={item}
            name={item?.ssa?.org_id || ''}
            handler={toggle}
            modal={modal}
            subject='ssa configuration'
            onAccept={onDeletionConfirmed}
          />
        )}
        {ssaData && <JsonViewerDialog
          isOpen={ssaDialogOpen}
          toggle={() => setSsaDialogOpen(!ssaDialogOpen)}
          data={ssaData}
          title={`JSON View of ${ssaData?.ssa?.software_id}`}
          theme="light"
          expanded={true}
        />}
      </CardBody>
    </Card>
  )
}

export default SSAListPage
