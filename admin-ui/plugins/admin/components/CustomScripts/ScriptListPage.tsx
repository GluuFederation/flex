import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Paper, Skeleton, TablePagination } from '@mui/material'
import { Badge } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { Card, CardBody } from 'Components'
import CustomScriptDetailPage from './CustomScriptDetailPage'
import GluuCustomScriptSearch from 'Routes/Apps/Gluu/GluuCustomScriptSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  deleteCustomScript,
  getCustomScriptByType,
  setCurrentItem,
  viewOnly,
  getScriptTypes,
} from 'Plugins/admin/redux/features/customScriptSlice'
import {
  hasPermission,
  buildPayload,
  SCRIPT_READ,
  SCRIPT_WRITE,
  SCRIPT_DELETE,
} from 'Utils/PermChecker'
import { LIMIT_ID, LIMIT, PATTERN, PATTERN_ID, TYPE, TYPE_ID } from '../../common/Constants'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

// Type definitions
interface ModuleProperty {
  value1: string
  value2: string
  description?: string
}

interface ConfigurationProperty {
  value1: string
  value2: string
  hide?: boolean
}

interface ScriptType {
  value: string
  name: string
}

interface CustomScript {
  inum?: string
  name: string
  description?: string
  scriptType: string
  programmingLanguage: string
  level: number
  script?: string
  aliases?: string[]
  moduleProperties?: ModuleProperty[]
  configurationProperties?: ConfigurationProperty[]
  enabled: boolean
  locationType?: string
  locationPath?: string
  scriptError?: {
    stackTrace: string
  }
  revision?: number
  internal?: boolean
}

interface CustomScriptState {
  items: CustomScript[]
  loading: boolean
  view: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  scriptTypes: ScriptType[]
  hasFetchedScriptTypes: boolean
  loadingScriptTypes: boolean
  item?: CustomScript
}

interface RootState {
  customScriptReducer: CustomScriptState
  authReducer: {
    permissions: string[]
  }
}

interface ThemeState {
  theme: string
}

interface ThemeContextType {
  state: ThemeState
}

interface OptionsType {
  [key: string]: string | number
}

interface UserActionType {
  [key: string]: any
}

interface SearchEvent {
  target: {
    name: string
    value: string
    keyCode?: number
  }
}

interface TableAction {
  icon: string | (() => React.ReactElement)
  iconProps?: {
    id?: string
    color?:
      | 'primary'
      | 'secondary'
      | 'action'
      | 'inherit'
      | 'disabled'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
  }
  tooltip: string
  onClick: (event: any, data: CustomScript | CustomScript[]) => void
  disabled?: boolean
  isFreeAction?: boolean
}

function ScriptListTable(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userAction: UserActionType = {}
  const options: OptionsType = {}
  const myActions: (TableAction | ((rowData: CustomScript) => TableAction))[] = []
  const [item, setItem] = useState<CustomScript>({} as CustomScript)
  const [modal, setModal] = useState<boolean>(false)
  const pageSize = localStorage.getItem('paggingSize') || '10'
  const [limit, setLimit] = useState<number>(parseInt(pageSize))
  const [pattern, setPattern] = useState<string | null>(null)
  const [type, setType] = useState<string>('person_authentication')
  const toggle = (): void => setModal(!modal)
  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const scripts = useSelector((state: RootState) => state.customScriptReducer.items)
  const loading = useSelector((state: RootState) => state.customScriptReducer.loading)
  const hasFetchedScriptTypes = useSelector(
    (state: RootState) => state.customScriptReducer.hasFetchedScriptTypes,
  )
  const permissions = useSelector((state: RootState) => state.authReducer.permissions)
  const { totalItems, scriptTypes, loadingScriptTypes } = useSelector(
    (state: RootState) => state.customScriptReducer,
  )
  const [pageNumber, setPageNumber] = useState<number>(0)
  let memoPattern = pattern
  let memoType = type
  SetTitle(t('titles.scripts'))

  function makeOptions(): void {
    setPattern(memoPattern)
    setType(memoType)
    options[LIMIT] = limit
    if (memoPattern) {
      options[PATTERN] = memoPattern
    }
    if (memoType !== '') {
      options[TYPE] = memoType
    }
  }

  useEffect(() => {
    makeOptions()
    dispatch(getCustomScriptByType({ action: options } as any))
  }, [])

  useEffect(() => {
    if (!hasFetchedScriptTypes) {
      dispatch(getScriptTypes())
    }
  }, [hasFetchedScriptTypes])

  if (hasPermission(permissions, SCRIPT_WRITE)) {
    myActions.push(
      (rowData: CustomScript): TableAction => ({
        icon: 'edit',
        iconProps: {
          id: 'editCustomScript' + rowData.inum,
        },
        tooltip: `${t('messages.edit_script')}`,
        onClick: (event, entry) => {
          handleGoToCustomScriptEditPage(entry as CustomScript, false)
        },
        disabled: false,
      }),
    )
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push(
      (rowData: CustomScript): TableAction => ({
        icon: 'visibility',
        iconProps: {
          id: 'viewCustomScript' + rowData.inum,
        },
        tooltip: `${t('messages.view_script_details')}`,
        onClick: (event, rowData) => handleGoToCustomScriptEditPage(rowData as CustomScript, true),
        disabled: false,
      }),
    )
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push({
      icon: () => (
        <>
          {loadingScriptTypes ? (
            <>
              <Skeleton variant="text" width="10rem" sx={{ fontSize: '3rem' }} />
            </>
          ) : (
            <GluuCustomScriptSearch
              limitId={LIMIT_ID}
              limit={limit}
              typeId={TYPE_ID}
              patternId={PATTERN_ID}
              scriptType={type}
              pattern={pattern}
              handler={handleOptionsChange}
              options={scriptTypes}
            />
          )}
        </>
      ),
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        dispatch(getCustomScriptByType({ action: options } as any))
      },
    })
  }
  if (hasPermission(permissions, SCRIPT_DELETE)) {
    myActions.push(
      (rowData: CustomScript): TableAction => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          id: 'deleteCustomScript' + rowData.inum,
        },
        tooltip: `${t('messages.delete_script')}`,
        onClick: (event, row) => handleCustomScriptDelete(row as CustomScript),
        disabled: false,
      }),
    )
  }
  if (hasPermission(permissions, SCRIPT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_script')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToCustomScriptAddPage(),
    })
  }

  function handleOptionsChange(event: SearchEvent): void {
    const name = event.target.name
    if (name === 'pattern') {
      memoPattern = event.target.value
      if (event.target.keyCode === 13) {
        makeOptions()
        dispatch(getCustomScriptByType({ action: options } as any))
      }
    } else if (name === 'type') {
      memoType = event.target.value
      makeOptions()
      dispatch(getCustomScriptByType({ action: options } as any))
    }
  }

  function handleGoToCustomScriptAddPage(): void {
    return navigate('/adm/script/new')
  }

  function handleGoToCustomScriptEditPage(row: CustomScript, edition?: boolean): void {
    dispatch(viewOnly({ view: edition }))
    dispatch(setCurrentItem({ item: row }))
    return navigate(`/adm/script/edit/:` + row.inum)
  }

  function handleCustomScriptDelete(row: CustomScript): void {
    setItem(row)
    toggle()
  }

  function onDeletionConfirmed(message: string): void {
    buildPayload(userAction, message, item.inum)
    dispatch(deleteCustomScript({ action: userAction } as any))
    navigate('/adm/scripts')
    toggle()
  }

  const onPageChangeClick = (page: number): void => {
    makeOptions()
    const startCount = page * limit
    options['startIndex'] = startCount
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getCustomScriptByType({ action: options } as any))
  }

  const onRowCountChangeClick = (count: number): void => {
    makeOptions()
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getCustomScriptByType({ action: options } as any))
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, SCRIPT_READ)}>
          <MaterialTable
            key={limit}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Pagination: (props) => (
                <TablePagination
                  count={totalItems}
                  page={pageNumber}
                  onPageChange={(prop, page) => {
                    onPageChangeClick(page)
                  }}
                  rowsPerPage={limit}
                  onRowsPerPageChange={(event) =>
                    onRowCountChangeClick(parseInt(event.target.value))
                  }
                />
              ),
            }}
            columns={[
              { title: `${t('fields.name')}`, field: 'name' },
              { title: `${t('fields.description')}`, field: 'description' },
              {
                title: `${t('options.enabled')}`,
                field: 'enabled',
                type: 'boolean',
                render: (rowData: CustomScript) => (
                  <Badge color={rowData.enabled === true ? `primary-${selectedTheme}` : 'dimmed'}>
                    {rowData.enabled ? 'true' : 'false'}
                  </Badge>
                ),
                defaultSort: 'desc',
              },
            ]}
            data={scripts}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: false,
              idSynonym: 'inum',
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: limit,
              rowStyle: (rowData: CustomScript) => ({
                backgroundColor:
                  rowData.enabled && rowData?.scriptError?.stackTrace
                    ? '#FF5858'
                    : rowData.enabled
                      ? themeColors.lightBackground
                      : '#FFF',
              }),
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              } as React.CSSProperties,
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <CustomScriptDetailPage row={rowData.rowData} />
            }}
          />
        </GluuViewWrapper>
        {hasPermission(permissions, SCRIPT_DELETE) && (
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="script"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.custom_script_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default ScriptListTable
