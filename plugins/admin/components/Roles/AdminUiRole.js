import React from 'react'
import MaterialTable from 'material-table'
import UiRoleDetailPage from './UiRoleDetailPage'
import { Badge } from 'reactstrap'
import { useTranslation } from 'react-i18next'

function AdminUiRole({ roles, loading }) {
  const { t } = useTranslation()
  roles = roles || []
  const data = [
    {
      name: 'api-admin',
      description:
        'This role allows a user to access all list and search features available. Not possible for this role to perform edition nor deletion',
      scopes: [
        'https://jans.io/oauth/config/attributes.readonly',
        'https://jans.io/oauth/config/acrs.readonly',
      ],
    },
    {
      name: 'api-viewer',
      description:
        'This role allows a user to perform all possible actions on api objects',
      scopes: [
        'https://jans.io/oauth/config/attributes.readonly',
        'https://jans.io/oauth/config/acrs.readonly',
      ],
    },
    {
      name: 'api-editor',
      description:
        'This role allow a user to list, search, add and edit on all available objects excepts the configuration object which is critical for a running server',
      scopes: [
        'https://jans.io/oauth/config/attributes.readonly',
        'https://jans.io/oauth/config/acrs.readonly',
      ],
    },
    {
      name: 'api-manager',
      description:
        'This role allows a user to list, search, add, edit and delete all available objects include the configuration object(only in view mode). The user cannot edit nor delete the configuration object.',
      scopes: [
        'https://jans.io/oauth/config/attributes.readonly',
        'https://jans.io/oauth/config/acrs.readonly',
      ],
    },
  ]
  return (
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
      data={data}
      isLoading={loading || false}
      title={t('titles.roles')}
      actions={[]}
      options={{
        search: false,
        searchFieldAlignment: 'left',
        selection: false,
        pageSize: 10,
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
  )
}

export default AdminUiRole
