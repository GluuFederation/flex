import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { DeleteOutlined } from '@mui/icons-material'
import FilterListIcon from '@mui/icons-material/FilterList'
import GetAppIcon from '@mui/icons-material/GetApp'
import { GluuBadge } from '@/components/GluuBadge'
import { GluuTable } from '@/components/GluuTable'
import { GluuButton } from '@/components/GluuButton'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { FilterOption } from '@/components/GluuSearchToolbar'
import { GluuFilterPopover } from '@/components/GluuFilterPopover'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { formatDate } from '@/utils/dayjsUtils'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { devLogger } from '@/utils/devLogger'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import {
  REGEX_CSV_FORMULA_INJECTION,
  REGEX_CSV_SPECIAL_CHARS,
  REGEX_DOUBLE_QUOTE,
} from '@/utils/regex'
import { BORDER_RADIUS, ICON_SIZE } from '@/constants'
import { useAppSelector } from '@/redux/hooks'
import { useGetSessions, useSearchSession } from 'JansConfigApi'
import type { SessionId, SearchSessionParams } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/index'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterField } from '@/components/GluuFilterPopover'
import { AUTHENTICATED_SESSION_STATE, type Session, type SessionState } from './types'
import { useStyles } from './styles/SessionListPage.style'
import SessionDetailPage from './SessionDetailPage'
import { useDeleteSessionWithAudit, useRevokeSessionWithAudit } from './hooks/useSessionMutations'
import type { Dayjs } from 'dayjs'

const LIMIT_OPTIONS = getRowsPerPageOptions()
const sessionResourceId = ADMIN_UI_RESOURCES.Session
const SESSION_SCOPES = CEDAR_RESOURCE_SCOPES[sessionResourceId] || []
const SESSION_ATTRIBUTE_FILTER_FIELDS = ['client_id', 'auth_user'] as const
const DATE_FILTER_FIELDS = ['expirationDate', 'authenticationTime'] as const
const FILTER_FIELD_OPTIONS = [
  { value: '', labelKey: 'options.none' },
  { value: 'client_id', labelKey: 'fields.client_id_used' },
  { value: 'auth_user', labelKey: 'fields.username' },
  { value: 'expirationDate', labelKey: 'titles.expiration_date' },
  { value: 'authenticationTime', labelKey: 'titles.authentication_date' },
] as const

const displayOrDash = (value: JsonValue | undefined): string =>
  value === null || value === undefined || value === '' ? '—' : String(value)

const isSessionAttributeFilter = (
  field: string,
): field is (typeof SESSION_ATTRIBUTE_FILTER_FIELDS)[number] =>
  SESSION_ATTRIBUTE_FILTER_FIELDS.includes(
    field as (typeof SESSION_ATTRIBUTE_FILTER_FIELDS)[number],
  )

const isDateFilterField = (field: string): field is (typeof DATE_FILTER_FIELDS)[number] =>
  DATE_FILTER_FIELDS.includes(field as (typeof DATE_FILTER_FIELDS)[number])

const SessionListPage: React.FC = () => {
  const { hasCedarDeletePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()

  const { data: sessionsData, isLoading: sessionsLoading } = useGetSessions()

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const client_id = useAppSelector((state) => state.authReducer?.config?.clientId)
  const auditContext = useMemo(
    () => ({
      userinfo,
      client_id,
    }),
    [userinfo, client_id],
  )

  const { deleteSession, isLoading: isDeleting } = useDeleteSessionWithAudit(auditContext)
  const { revokeSession, isLoading: isRevoking } = useRevokeSessionWithAudit(auditContext)

  const { state: themeState } = useTheme()
  const { themeColors, isDarkTheme } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDarkTheme: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()

  const [searchParams, setSearchParams] = useState<SearchSessionParams | undefined>(undefined)
  const { data: searchData, isLoading: searchLoading } = useSearchSession(searchParams, {
    query: { enabled: !!searchParams },
  })

  const [filterSearchField, setFilterSearchField] = useState('')
  const [filterTextValue, setFilterTextValue] = useState('')
  const [filterDateValue, setFilterDateValue] = useState<Dayjs | null>(null)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [appliedFilterField, setAppliedFilterField] = useState('')
  const [appliedFilterValue, setAppliedFilterValue] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  const [deleteModal, setDeleteModal] = useState(false)
  const [revokeModal, setRevokeModal] = useState(false)
  const [item, setItem] = useState<Session>({} as Session)
  const [revokeUsername, setRevokeUsername] = useState<string | null>(null)

  const canDelete = useMemo(
    () => hasCedarDeletePermission(sessionResourceId),
    [hasCedarDeletePermission],
  )

  useEffect(() => {
    if (SESSION_SCOPES.length > 0) {
      authorizeHelper(SESSION_SCOPES)
    }
  }, [authorizeHelper])

  const adaptSessionIdToSession = useCallback(
    (sessionId: SessionId): Session => ({
      id: sessionId.id,
      userDn: sessionId.userDn,
      authenticationTime: sessionId.authenticationTime || '',
      state: sessionId.state as SessionState,
      sessionState: sessionId.sessionState,
      sessionAttributes: {
        ...sessionId.sessionAttributes,
        auth_user: sessionId.sessionAttributes?.auth_user || '',
        remote_ip: sessionId.sessionAttributes?.remote_ip || '',
        client_id: sessionId.sessionAttributes?.client_id || '',
        acr_values: sessionId.sessionAttributes?.acr_values || '',
        sid: sessionId.sessionAttributes?.sid,
      },
      expirationDate: sessionId.expirationDate,
      permissionGrantedMap: sessionId.permissionGrantedMap?.permissionGranted,
    }),
    [],
  )

  const sessions = useMemo(() => {
    let rawSessions: SessionId[] = []
    if (searchParams && searchData) {
      rawSessions = searchData.entries || []
    } else if (!searchParams && sessionsData?.entries) {
      rawSessions = sessionsData.entries
    }
    return rawSessions.map(adaptSessionIdToSession)
  }, [sessionsData, searchData, searchParams, adaptSessionIdToSession])

  const authenticatedSessions = useMemo(() => {
    let filtered = sessions.filter((session) => session.state === AUTHENTICATED_SESSION_STATE)

    if (isFilterApplied && appliedFilterValue && isSessionAttributeFilter(appliedFilterField)) {
      const searchValue = appliedFilterValue.toLowerCase()
      filtered = filtered.filter((session) => {
        const fieldValue =
          appliedFilterField === 'client_id'
            ? session.sessionAttributes?.client_id
            : session.sessionAttributes?.auth_user
        return fieldValue?.toLowerCase().includes(searchValue)
      })
    }

    return filtered
  }, [sessions, appliedFilterValue, appliedFilterField, isFilterApplied])

  const totalItems = authenticatedSessions.length

  const paginatedSessions = useMemo(() => {
    const start = pageNumber * limit
    return authenticatedSessions.slice(start, start + limit)
  }, [authenticatedSessions, pageNumber, limit])

  const loading = sessionsLoading || searchLoading || isDeleting || isRevoking

  const usernameSelectOptions: FilterOption[] = useMemo(() => {
    const usernames = [
      ...new Set(authenticatedSessions.map((s) => s.sessionAttributes?.auth_user).filter(Boolean)),
    ]
    return usernames.map((u) => ({ value: u as string, label: u as string }))
  }, [authenticatedSessions])

  SetTitle(t('menus.sessions'))

  const handleDeleteClick = useCallback((rowData: Session) => {
    setItem(rowData)
    setDeleteModal(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal(false)
    setItem({} as Session)
  }, [])

  const handleDeleteAccept = useCallback(
    async (message: string) => {
      const sessionId = item.id || item.sessionAttributes?.sid
      if (!sessionId) return
      try {
        await deleteSession(sessionId, message, item.sessionAttributes?.auth_user)
        setDeleteModal(false)
        setItem({} as Session)
      } catch (err) {
        devLogger.error('Failed to delete session', {
          sessionId,
          auth_user: item.sessionAttributes?.auth_user,
          err,
        })
      }
    },
    [item, deleteSession],
  )

  const handleRevoke = useCallback(() => {
    if (isEmpty(authenticatedSessions)) return
    const row = authenticatedSessions.find(
      ({ sessionAttributes }) => sessionAttributes?.auth_user === revokeUsername,
    )
    if (row) {
      setItem(row)
      setRevokeModal(true)
    }
  }, [authenticatedSessions, revokeUsername])

  const handleRevokeAccept = useCallback(
    async (message: string) => {
      const { userDn } = item
      if (!userDn) return
      try {
        await revokeSession(userDn, message, item.sessionAttributes?.auth_user)
        setRevokeModal(false)
      } catch (err) {
        devLogger.error('Failed to revoke session', {
          userDn,
          auth_user: item.sessionAttributes?.auth_user,
          err,
        })
      }
    },
    [item, revokeSession],
  )

  const handleCloseRevokeModal = useCallback(() => {
    setRevokeModal(false)
  }, [])

  const handleUsernameSelectChange = useCallback((value: string) => {
    setRevokeUsername(value || null)
  }, [])

  const handleFilterToggle = useCallback(() => {
    setShowFilter((prev) => !prev)
  }, [])

  const handleFilterSearchFieldChange = useCallback((value: string) => {
    setFilterSearchField(value)
    setFilterTextValue('')
    setFilterDateValue(null)
    setSearchParams(undefined)
    setIsFilterApplied(false)
  }, [])

  const handleFilterTextChange = useCallback((value: string) => {
    setFilterTextValue(value)
  }, [])

  const handleFilterDateChange = useCallback((val: Dayjs | null) => {
    setFilterDateValue(val)
  }, [])

  const handleFilterApply = useCallback(() => {
    if (filterTextValue || filterDateValue) {
      if (isSessionAttributeFilter(filterSearchField)) {
        setSearchParams(undefined)
        setAppliedFilterField(filterSearchField)
        setAppliedFilterValue(filterTextValue)
        setIsFilterApplied(true)
      } else if (isDateFilterField(filterSearchField)) {
        const searchValue = formatDate(filterDateValue, 'YYYY-MM-DD')
        setSearchParams({
          fieldValuePair: `${filterSearchField}=${searchValue}`,
          limit: 100,
        })
        setIsFilterApplied(false)
      }
    } else {
      setSearchParams(undefined)
      setIsFilterApplied(false)
      setAppliedFilterField('')
      setAppliedFilterValue('')
    }
    setPageNumber(0)
    setShowFilter(false)
  }, [filterSearchField, filterTextValue, filterDateValue, setPageNumber])

  const handleFilterCancel = useCallback(() => {
    setShowFilter(false)
    setSearchParams(undefined)
    setIsFilterApplied(false)
    setAppliedFilterField('')
    setAppliedFilterValue('')
    setFilterSearchField('')
    setFilterTextValue('')
    setFilterDateValue(null)
    setPageNumber(0)
  }, [setPageNumber])

  const isDateFilter = isDateFilterField(filterSearchField)

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'searchFilter',
        label: '',
        value: filterSearchField,
        type: 'select' as const,
        options: FILTER_FIELD_OPTIONS.map((option) => ({
          value: option.value,
          label: t(option.labelKey),
        })),
        onChange: handleFilterSearchFieldChange,
      },
      isDateFilter
        ? {
            key: 'value',
            label: '',
            value: '',
            type: 'date' as const,
            dateValue: filterDateValue,
            onDateChange: handleFilterDateChange,
            onChange: () => {},
          }
        : {
            key: 'value',
            label: '',
            value: filterTextValue,
            type: 'text' as const,
            placeholder: t('placeholders.value'),
            onChange: handleFilterTextChange,
          },
    ],
    [
      t,
      filterSearchField,
      filterTextValue,
      filterDateValue,
      isDateFilter,
      handleFilterSearchFieldChange,
      handleFilterTextChange,
      handleFilterDateChange,
    ],
  )

  const sanitizeCsvCell = (value: JsonValue): string => {
    let cell = value == null ? '' : String(value)
    if (REGEX_CSV_FORMULA_INJECTION.test(cell)) {
      cell = "'" + cell
    }
    if (REGEX_CSV_SPECIAL_CHARS.test(cell)) {
      cell = '"' + cell.replace(REGEX_DOUBLE_QUOTE, '""') + '"'
    }
    return cell
  }

  const downloadCSV = useCallback(() => {
    const keys = [
      t('fields.username'),
      t('fields.ip_address'),
      t('fields.client_id_used'),
      t('fields.auth_time'),
      t('fields.acr'),
      t('fields.state'),
    ]
    const header = keys.map((k) => sanitizeCsvCell(k.replaceAll('-', ' ').toUpperCase())).join(',')
    const rows = authenticatedSessions.map((row) =>
      [
        row.sessionAttributes.auth_user,
        row.sessionAttributes.remote_ip,
        row.sessionAttributes.client_id,
        row.authenticationTime ? formatDate(row.authenticationTime, 'YYYY-MM-DD h:mm:ss A') : '',
        row.sessionAttributes.acr_values,
        row.state,
      ]
        .map(sanitizeCsvCell)
        .join(','),
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'sessions.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }, [authenticatedSessions, t])

  const handlePageChange = useCallback((page: number) => setPageNumber(page), [setPageNumber])
  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  const columns: ColumnDef<Session>[] = useMemo(
    () => [
      {
        key: 'sessionAttributes' as const,
        id: 'col_username',
        label: t('fields.username'),
        sortable: false,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellText}>
            {displayOrDash(row.sessionAttributes?.auth_user)}
          </GluuText>
        ),
      },
      {
        key: 'sessionAttributes' as const,
        id: 'col_ip_address',
        label: t('fields.ip_address'),
        sortable: false,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellText}>
            {displayOrDash(row.sessionAttributes?.remote_ip)}
          </GluuText>
        ),
      },
      {
        key: 'sessionAttributes' as const,
        id: 'col_client_id',
        label: t('fields.client_id_used'),
        sortable: false,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellText}>
            {displayOrDash(row.sessionAttributes?.client_id)}
          </GluuText>
        ),
      },
      {
        key: 'authenticationTime',
        label: t('fields.auth_time'),
        sortable: false,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellText}>
            {row.authenticationTime
              ? formatDate(row.authenticationTime, 'ddd, MMM DD, YYYY h:mm:ss A')
              : '—'}
          </GluuText>
        ),
      },
      {
        key: 'sessionAttributes' as const,
        id: 'col_acr_values',
        label: t('fields.acr'),
        sortable: false,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellText}>
            {displayOrDash(row.sessionAttributes?.acr_values)}
          </GluuText>
        ),
      },
      {
        key: 'state',
        label: t('fields.state'),
        sortable: false,
        render: (_value, row) => {
          const isAuth = row.state === AUTHENTICATED_SESSION_STATE
          const style = isAuth ? badgeStyles.authenticatedBadge : badgeStyles.unauthenticatedBadge
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={BORDER_RADIUS.SMALL}
              className={classes.statusBadge}
            >
              {row.state}
            </GluuBadge>
          )
        },
      },
    ],
    [t, classes, badgeStyles],
  )

  const actions = useMemo(() => {
    if (!canDelete) return []
    return [
      {
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('actions.delete'),
        id: 'deleteSession',
        onClick: handleDeleteClick,
      },
    ]
  }, [canDelete, t, handleDeleteClick, classes.deleteIcon])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [pageNumber, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const getRowKey = useCallback(
    (row: Session, index: number) => row.id || row.sessionAttributes?.sid || `session-${index}`,
    [],
  )

  const renderExpandedRow = useCallback((row: Session) => <SessionDetailPage row={row} />, [])

  const deleteDialogLabel = useMemo(
    () =>
      item?.id || item?.sessionAttributes?.sid
        ? `${t('messages.action_deletion_for')} session (${item.sessionAttributes?.auth_user ?? ''}${item.id ? `-${item.id}` : item.sessionAttributes?.sid ? `-${item.sessionAttributes.sid}` : ''})`
        : '',
    [t, item],
  )

  const revokeDialogLabel = useMemo(
    () =>
      item?.sessionAttributes?.auth_user
        ? `${t('messages.action_deletion_for')} user session revoke (${item.sessionAttributes.auth_user})`
        : '',
    [t, item],
  )

  const filterButtonColors = useMemo(
    () => ({
      borderColor: themeColors.fontColor,
      textColor: themeColors.fontColor,
    }),
    [themeColors],
  )

  const exportButtonColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
    }),
    [themeColors],
  )

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <div className={classes.toolbarRow}>
                <div className={classes.searchToolbarWrapper}>
                  <GluuSearchToolbar
                    searchLabel={canDelete ? t('fields.selectUserRevoke') : undefined}
                    searchPlaceholder={t('fields.username')}
                    searchValue={revokeUsername ?? ''}
                    selectOptions={usernameSelectOptions}
                    onSelectChange={handleUsernameSelectChange}
                    selectPlaceholder={t('fields.username')}
                    disabled={loading}
                  />
                </div>

                <div className={classes.actionsGroup}>
                  {canDelete && (
                    <GluuButton
                      type="button"
                      size="md"
                      outlined
                      className={classes.toolbarButton}
                      onClick={handleRevoke}
                      disabled={!revokeUsername}
                      textColor={filterButtonColors.textColor}
                      borderColor={filterButtonColors.borderColor}
                      minHeight={52}
                      useOpacityOnHover
                    >
                      {t('actions.revoke')}
                    </GluuButton>
                  )}

                  <GluuButton
                    type="button"
                    size="md"
                    outlined
                    className={classes.toolbarButton}
                    onClick={handleFilterToggle}
                    textColor={filterButtonColors.textColor}
                    borderColor={filterButtonColors.borderColor}
                    minHeight={52}
                    useOpacityOnHover
                  >
                    <FilterListIcon sx={{ fontSize: ICON_SIZE.SM, mr: 0.5 }} />
                    {t('titles.filters')}
                  </GluuButton>

                  <GluuButton
                    type="button"
                    size="md"
                    className={classes.toolbarButton}
                    onClick={downloadCSV}
                    backgroundColor={exportButtonColors.backgroundColor}
                    textColor={exportButtonColors.textColor}
                    borderColor={exportButtonColors.backgroundColor}
                    minHeight={52}
                    useOpacityOnHover
                  >
                    <GetAppIcon sx={{ fontSize: ICON_SIZE.SM, mr: 0.5 }} />
                    {t('titles.export_csv')}
                  </GluuButton>

                  <GluuFilterPopover
                    open={showFilter}
                    fields={filterFields}
                    onApply={handleFilterApply}
                    onCancel={handleFilterCancel}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<Session>
              columns={columns}
              data={paginatedSessions}
              loading={false}
              expandable
              renderExpandedRow={renderExpandedRow}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={t('messages.no_sessions_found')}
            />
          </div>
        </GluuViewWrapper>

        {canDelete && deleteModal && !isEmpty(item) && (
          <GluuCommitDialog
            handler={handleCloseDeleteModal}
            modal={deleteModal}
            onAccept={handleDeleteAccept}
            label={deleteDialogLabel}
            feature={adminUiFeatures.sessions}
            autoCloseOnAccept
          />
        )}

        {canDelete && revokeModal && !isEmpty(item) && (
          <GluuCommitDialog
            handler={handleCloseRevokeModal}
            modal={revokeModal}
            onAccept={handleRevokeAccept}
            label={revokeDialogLabel}
            feature={adminUiFeatures.sessions}
            autoCloseOnAccept
          />
        )}
      </div>
    </GluuLoader>
  )
}

export default memo(SessionListPage)
