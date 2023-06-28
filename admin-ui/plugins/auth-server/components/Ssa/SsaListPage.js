import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSsaConfig, removeSsa } from '../../redux/features/SsaSlice'
import { Card, CardBody, Badge } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  hasPermission,
  SSA_READ,
  SSA_WRITE,
  SSA_DELETE,
  buildPayload,
} from 'Utils/PermChecker'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import SetTitle from 'Utils/SetTitle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { DeleteOutlined } from '@mui/icons-material'
import TablePagination from '@mui/material/TablePagination'

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
  const [pageNumber, setPageNumber] = useState(0)
  const { items, loading } = useSelector((state) => state.ssaReducer)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.ssa_management'))

  useEffect(() => {
    dispatch(getSsaConfig())
  }, [])

  const PaperContainer = useCallback(
    (props) => <Paper {...props} elevation={0} />,
    []
  )

  const tableColumns = [
    { title: `Software ID`, field: 'ssa.software_id' },
    {
      title: `Organization`,
      field: 'ssa.org_id',
    },
    {
      title: `Software Roles`,
      field: 'ssa.software_roels',
      render: (rowData) => {
        return rowData?.ssa?.software_roles?.map((data) => {
          return (
            <div style={{ maxWidth: 140, overflow: 'auto' }} key={data}>
              <Badge color={`primary-${selectedTheme}`}>{data}</Badge>
            </div>
          )
        })
      },
    },
    {
      title: `Status`,
      field: 'status',
    },
    { title: `Expiration`, field: 'expiration' },
  ]

  if (hasPermission(permissions, SSA_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_ssa')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToSsaAddPage(),
      disabled: !hasPermission(permissions, SSA_WRITE),
    })
  }

  const DeleteIcon = useCallback(() => <DeleteOutlined />, [])

  if (hasPermission(permissions, SSA_DELETE)) {
    myActions.push((rowData) => ({
      icon: DeleteIcon,
      iconProps: {
        color: 'secondary',
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

  const handleGoToSsaAddPage = () => {
    navigate('/auth-server/config/ssa/new')
  }

  const onDeletionConfirmed = (message) => {
    buildPayload(userAction, message, item.ssa.jti)
    dispatch(removeSsa({ action: userAction }))
    toggle()
  }

  const onRowCountChangeClick = (count) => {
    setLimit(count)
    setPageNumber(0)
  }

  const onPageChangeClick = (page) => {
    setPageNumber(page)
  }

  return (
    <>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasPermission(permissions, SSA_READ)}>
            <MaterialTable
              key={limit ? limit : 0}
              components={{
                Container: PaperContainer,
                Pagination: (props) => (
                  <TablePagination
                    component='div'
                    count={items?.length || 0}
                    page={pageNumber}
                    onPageChange={(prop, page) => {
                      onPageChangeClick(page)
                    }}
                    rowsPerPage={limit}
                    onRowsPerPageChange={(prop, count) =>
                      onRowCountChangeClick(count.props.value)
                    }
                  />
                ),
              }}
              columns={tableColumns}
              data={items}
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
            />
          </GluuViewWrapper>
          {hasPermission(permissions, SSA_DELETE) && (
            <GluuDialog
              row={item}
              name={item?.ssa?.org_id || ''}
              handler={toggle}
              modal={modal}
              subject='ssa configuration'
              onAccept={onDeletionConfirmed}
            />
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default SSAListPage
