import React from 'react'
import MaterialTable from 'material-table'
import UiRoleDetailPage from './UiRoleDetailPage'
import { Badge } from 'reactstrap'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import {
  hasPermission,
  buildPayload,
  SCRIPT_READ,
} from '../../../../app/utils/PermChecker'

function UiRoleListPage({ apiRoles, permissions, loading }) {
  const { t } = useTranslation()
  const pageSize = localStorage.getItem('paggingSize') || 10

  return (
    <React.Fragment>
      <GluuViewWrapper canShow={hasPermission(permissions, SCRIPT_READ)}>
        <MaterialTable
          columns={[
            {
              title: `${t('fields.name')}`,
              field: 'name',
              width: '20%',
              render: (rowData) => <Badge color="info">{rowData.name}</Badge>,
            },
            { title: `${t('fields.description')}`, field: 'description' },
          ]}
          data={apiRoles}
          isLoading={loading || false}
          title={t('titles.roles')}
          actions={[]}
          options={{
            search: false,
            searchFieldAlignment: 'left',
            selection: false,
            pageSize: pageSize,
            rowStyle: (rowData) => ({
              backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
            }),
            headerStyle: {
              backgroundColor: '#03a96d',
              color: '#FFF',
              padding: '2px',
              textTransform: 'uppercase',
              fontSize: '18px',
            },
            actionsColumnIndex: -1,
          }}
          detailPanel={(rowData) => {
            return <UiRoleDetailPage row={rowData} />
          }}
        />
      </GluuViewWrapper>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    apiRoles: state.apiRoleReducer.items,
    loading: state.apiRoleReducer.loading,
    permissions: state.authReducer.permissions,
  }
}

export default connect(mapStateToProps)(UiRoleListPage)
