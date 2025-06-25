import React, { useEffect, useState, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination, TablePaginationProps } from '@mui/material'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import {
    hasPermission,
    ASSETS_WRITE,
    ASSETS_READ,
    ASSETS_DELETE,
    buildPayload
} from 'Utils/PermChecker'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from 'Plugins/admin/common/Constants'
import SetTitle from 'Utils/SetTitle'
import { useNavigate } from 'react-router'
import { fetchJansAssets, deleteJansAsset, setSelectedAsset, getAssetServices, getAssetTypes } from 'Plugins/admin/redux/features/AssetSlice'
import moment from 'moment'

// Type definitions
interface Asset {
    inum: string
    fileName: string
    description: string
    creationDate: string
    enabled: boolean
}

interface RootState {
    assetReducer: {
        totalItems: number
        assets: Asset[]
        loadingAssets: boolean
    }
    authReducer: {
        permissions: string[]
    }
}

interface Options {
    limit?: number
    pattern?: string | null
    startIndex?: number
    [key: string]: any
}

interface ThemeState {
    state: {
        theme: string
    }
}

interface DeleteData {
    inum: string
    fileName: string
    description: string
    creationDate: string
    enabled: boolean
}

const JansAssetListPage: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    SetTitle(t('titles.assets'))
    const [pageNumber, setPageNumber] = useState<number>(0)
    const { totalItems, assets } = useSelector((state: RootState) => state.assetReducer)
    const permissions = useSelector((state: RootState) => state.authReducer.permissions)
    const loadingAssets = useSelector((state: RootState) => state.assetReducer.loadingAssets)
    const myActions: any[] = []
    const options: Options = {}
    const [limit, setLimit] = useState<number>(10)
    const [pattern, setPattern] = useState<string | null>(null)
    let memoLimit = limit
    let memoPattern = pattern
    const PaperContainer = useCallback(
        (props: any) => <Paper {...props} elevation={0} />,
        []
    )
    const theme = useContext(ThemeContext) as ThemeState
    const themeColors = getThemeColor(theme?.state?.theme || 'default')
    const bgThemeColor = { background: themeColors.background }
    const [modal, setModal] = useState<boolean>(false)
    const [deleteData, setDeleteData] = useState<DeleteData | null>(null)
    const toggle = () => setModal(!modal)

    const submitForm = (userMessage: string) => {
        const userAction: any = {}
        toggle()
        buildPayload(userAction, userMessage, deleteData)
        dispatch(deleteJansAsset({ action: userAction } as any))
    }

    useEffect(() => {
        dispatch(getAssetTypes({ action: options }))
        options.limit = 10
        dispatch(fetchJansAssets({ action: options }))
        dispatch(getAssetServices({ action: options }))
    }, [])

    function handleOptionsChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.name === 'limit') {
            memoLimit = parseInt(event.target.value)
        } else if (event.target.name === 'pattern') {
            memoPattern = event.target.value
        }
    }

    const onPageChangeClick = (page: number) => {
        const startCount = page * limit
        options.startIndex = startCount
        options.limit = limit
        options.pattern = pattern
        setPageNumber(page)
        dispatch(fetchJansAssets({ action: options }))
    }

    const onRowCountChangeClick = (count: number) => {
        options.limit = count
        options.pattern = pattern
        setPageNumber(0)
        setLimit(count)
        dispatch(fetchJansAssets({ action: options }))
    }

    const PaginationWrapper = useCallback(
        (props: TablePaginationProps) => (
            <TablePagination
                {...props}
                count={totalItems}
                page={pageNumber}
                onPageChange={(_, page) => {
                    onPageChangeClick(page)
                }}
                rowsPerPage={limit}
                onRowsPerPageChange={(event) => {
                    const target = event.target as HTMLInputElement
                    onRowCountChangeClick(parseInt(target.value))
                }}
            />
        ),
        [pageNumber, totalItems, limit]
    )

    const navigateToAddPage = useCallback(() => {
        dispatch(setSelectedAsset({}))
        navigate('/adm/asset/add')
    }, [dispatch, navigate])

    const navigateToEditPage = useCallback((data: Asset) => {
        dispatch(setSelectedAsset(data))
        navigate(`/adm/asset/edit/${data.inum}`)
    }, [dispatch, navigate])

    const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])

    const GluuSearch = useCallback(() => {
        return (
            <GluuAdvancedSearch
                limitId={LIMIT_ID}
                patternId={PATTERN_ID}
                limit={limit}
                pattern={pattern}
                handler={handleOptionsChange}
                showLimit={false}
            />
        )
    }, [limit, pattern])

    if (hasPermission(permissions, ASSETS_READ)) {
        myActions.push({
            icon: GluuSearch,
            tooltip: `${t('messages.advanced_search')}`,
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => { },
        })
    }

    if (hasPermission(permissions, ASSETS_READ)) {
        myActions.push({
            icon: 'refresh',
            tooltip: `${t('messages.refresh')}`,
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => {
                setLimit(memoLimit)
                setPattern(memoPattern)
                dispatch(fetchJansAssets({ action: { limit: memoLimit, pattern: memoPattern } }))
            },
        })
    }

    if (hasPermission(permissions, ASSETS_WRITE)) {
        myActions.push({
            icon: 'add',
            tooltip: `${t('messages.add_asset')}`,
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => navigateToAddPage(),
        })
    }

    if (hasPermission(permissions, ASSETS_WRITE)) {
        myActions.push((rowData: Asset) => ({
            icon: 'edit',
            iconProps: {
                id: 'editScope' + rowData.inum,
            },
            onClick: (event: any, rowData: Asset) => navigateToEditPage(rowData),
            disabled: !hasPermission(permissions, ASSETS_WRITE),
        }))
    }

    if (hasPermission(permissions, ASSETS_DELETE)) {
        myActions.push((rowData: Asset) => ({
            icon: DeleteOutlinedIcon,
            iconProps: {
                color: 'secondary',
                id: 'deleteClient' + rowData.inum,
            },
            onClick: (event: any, rowData: Asset) => {
                setDeleteData(rowData)
                toggle()
            },
            disabled: false,
        }))
    }

    return (
        <GluuLoader blocking={loadingAssets}>
            <Card type="border" color={null} className="">
                <CardBody>
                    <GluuViewWrapper canShow={hasPermission(permissions, ASSETS_READ)}>
                        <MaterialTable
                            components={{
                                Container: PaperContainer,
                                Pagination: PaginationWrapper,
                            }}
                            columns={[
                                {
                                    title: `${t('fields.name')}`,
                                    field: 'fileName',
                                },
                                {
                                    title: `${t('fields.description')}`,
                                    field: 'description',
                                    width: '40%',
                                    render: (rowData: Asset) => (
                                        <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>
                                            {rowData.description}
                                        </div>
                                    )
                                },
                                {
                                    title: `${t('fields.creationDate')}`, 
                                    field: 'creationDate',
                                    render: (rowData: Asset) => (
                                        <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>
                                            {moment(rowData.creationDate).format('YYYY-MM-DD')}
                                        </div>
                                    )
                                },
                                { title: `${t('fields.enabled')}`, field: 'enabled' }
                            ]}
                            data={assets || []}
                            isLoading={loadingAssets}
                            title=''
                            actions={myActions}
                            options={{
                                search: false,
                                idSynonym: 'inum',
                                searchFieldAlignment: 'left',
                                selection: false,
                                pageSize: limit,
                                rowStyle: (rowData: Asset) => ({
                                    backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
                                }),
                                headerStyle: {
                                    ...applicationStyle.tableHeaderStyle,
                                    ...bgThemeColor,
                                } as React.CSSProperties,
                                actionsColumnIndex: -1,
                            }}
                        />
                    </GluuViewWrapper>
                </CardBody>
                <GluuCommitDialog
                    handler={toggle}
                    modal={modal}
                    onAccept={submitForm}
                />
            </Card>
        </GluuLoader>
    )
}

export default JansAssetListPage
