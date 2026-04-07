import React, { useEffect, useState, useCallback, useContext, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteOutlined } from '@mui/icons-material'
import GluuViewDetailModal from 'Routes/Apps/Gluu/GluuViewDetailsModal'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuTable } from '@/components/GluuTable'
import type { ColumnDef, PaginationConfig, ActionDef } from '@/components/GluuTable'
import getThemeColor from '@/context/theme/config'
import { ThemeContext } from '@/context/theme/themeContext'
import {
  useGetRegistrationEntriesFido2,
  useDeleteFido2Data,
  usePutUser,
  getGetUserQueryKey,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { formatDate } from '@/utils/dayjsUtils'
import UserDeviceDetailViewPage from './UserDeviceDetailViewPage'
import {
  DeviceData,
  CustomAttribute,
  OTPDevicesData,
  OTPDevice,
  FidoRegistrationEntry,
  CustomUser,
  User2FADevicesModalProps,
} from '../types'
import type { CaughtError } from '../types/ErrorTypes'
import { getErrorMessage, logUserUpdate } from '../helper'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './User2FADevicesModal.style'

const User2FADevicesModal = ({ isOpen, onClose, userDetails, theme }: User2FADevicesModalProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const themeContext = useContext(ThemeContext)
  const selectedTheme = useMemo(
    () => theme || themeContext?.state?.theme || DEFAULT_THEME,
    [theme, themeContext?.state?.theme],
  )
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const [faDetails, setFADetails] = useState<DeviceData[]>([])
  const [otpDevicesList, setOTPDevicesList] = useState<DeviceData[]>([])
  const initializedRef = useRef<string | null>(null)

  const {
    data: fidoRegistrationData,
    refetch: refetchFido2Details,
    isLoading: isFido2Loading,
  } = useGetRegistrationEntriesFido2(userDetails?.userId?.toLowerCase() || '', {
    query: {
      enabled: isOpen && !!userDetails?.userId,
    },
  })

  const fidoDetails = useMemo(() => fidoRegistrationData?.entries || [], [fidoRegistrationData])

  // Delete FIDO2 mutation
  const deleteFido2Mutation = useDeleteFido2Data({
    mutation: {
      onSuccess: async () => {
        dispatch(updateToast(true, 'success', t('messages.device_deleted_successfully')))
        await refetchFido2Details()
      },
      onError: (error: CaughtError) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })

  // Update user mutation (for OTP device removal)
  const updateUserMutation = usePutUser({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.device_deleted_successfully')))
        await logUserUpdate(data, variables.data as CustomUser)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
      },
      onError: (error: CaughtError) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })

  // Process OTP devices from user details
  useEffect(() => {
    const userKey = userDetails?.inum || 'none'
    const otpDevicesKey = JSON.stringify(
      userDetails?.customAttributes?.find((item: CustomAttribute) => item.name === 'jansOTPDevices')
        ?.value || null,
    )

    // Only process if user or OTP devices actually changed
    if (initializedRef.current === `${userKey}-${otpDevicesKey}`) {
      return
    }

    if (!userDetails) {
      setOTPDevicesList([])
      initializedRef.current = 'none-null'
      return
    }

    const getOTPDevices =
      userDetails?.customAttributes?.filter(
        (item: CustomAttribute) => item.name === 'jansOTPDevices',
      ) || []
    const getOTPDevicesValue = getOTPDevices.map((item: CustomAttribute) =>
      JSON.parse(typeof item.value === 'string' ? item.value : JSON.stringify(item.value || {})),
    )
    const getDevices = getOTPDevicesValue?.map((item: OTPDevicesData) => [...(item.devices || [])])
    const getDevicesList = getDevices?.flat()
    const otpDevices: DeviceData[] =
      getDevicesList?.map((item: OTPDevice) => {
        return {
          id: item?.id ?? '-',
          nickName: item?.nickName ?? '-',
          modality: item?.soft
            ? 'Soft token - time based (totp)'
            : 'Hard token - time based (totp)',
          dateAdded: formatDate((item.addedOn || 0) * 1000, 'YYYY-MM-DD HH:mm:ss'),
          type: 'OTP',
        }
      }) || []
    setOTPDevicesList(otpDevices)
    initializedRef.current = `${userKey}-${otpDevicesKey}`
  }, [userDetails?.inum, userDetails?.customAttributes])

  // Memoize processed FIDO2 details to prevent unnecessary re-renders
  const processedFidoDetails = useMemo(() => {
    if (!Array.isArray(fidoDetails) || fidoDetails.length === 0) {
      return []
    }

    const updatedDetails: DeviceData[] = fidoDetails.map((item: FidoRegistrationEntry) => {
      const displayName = item.displayName || item?.deviceData?.name || '-'
      const deviceType = item?.deviceData?.platform ? 'SUPER GLUU' : 'FIDO2'
      const modality = item?.deviceData?.platform || item?.registrationData?.type || '-'

      return {
        id: item.id,
        nickName: displayName,
        modality: modality,
        dateAdded: item.creationDate ? formatDate(item.creationDate, 'YYYY-MM-DD HH:mm:ss') : '-',
        type: deviceType,
        registrationData: item.registrationData,
        deviceData: item.deviceData,
      }
    })
    return updatedDetails.filter((item: DeviceData) => item)
  }, [fidoDetails])

  // Combine FIDO2 and OTP devices - use functional update to avoid dependency issues
  useEffect(() => {
    setFADetails((prev) => {
      const combined = [...processedFidoDetails, ...otpDevicesList]
      // Only update if actually changed (prevent infinite loops)
      if (
        prev.length === combined.length &&
        prev.every((item, index) => item.id === combined[index]?.id)
      ) {
        return prev
      }
      return combined
    })
  }, [processedFidoDetails, otpDevicesList])

  // Reset pagination when user or data changes
  useEffect(() => {
    setPage(0)
  }, [userDetails?.inum, faDetails.length])

  const updateUserData = useCallback(
    (values: string): void => {
      if (!userDetails) return

      const submitableValues = {
        inum: userDetails.inum,
        userId: userDetails.userId || '',
        dn: userDetails.dn,
        jansOTPDevices: values,
      }
      updateUserMutation.mutate({ data: submitableValues })
    },
    [userDetails, updateUserMutation],
  )

  const handleRemove2Fa = useCallback(
    (row: DeviceData): void => {
      if (row.type === 'FIDO2' || row.type === 'SUPER GLUU') {
        deleteFido2Mutation.mutate({ jansId: row.id || '' })
      } else if (row.type === 'OTP') {
        const getOTPDevices =
          userDetails?.customAttributes?.filter(
            (item: CustomAttribute) => item.name === 'jansOTPDevices',
          ) || []
        const getOTPDevicesValue = getOTPDevices.map((item: CustomAttribute) =>
          JSON.parse(
            typeof item.value === 'string' ? item.value : JSON.stringify(item.value || {}),
          ),
        )

        if (getOTPDevicesValue.length > 0) {
          const removedDevice =
            getOTPDevicesValue[0].devices?.filter((item: OTPDevice) => item.id !== row.id) || []
          const jansOTPDevices = { devices: removedDevice }
          updateUserData(JSON.stringify(jansOTPDevices))

          // Update local OTP devices list immediately for better UX
          setOTPDevicesList((prev) => prev.filter((device) => device.id !== row.id))
        }
      }
    },
    [userDetails, deleteFido2Mutation, updateUserData],
  )

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const columns: ColumnDef<DeviceData>[] = useMemo(
    () => [
      { key: 'nickName', label: t('fields.nickName') },
      { key: 'modality', label: t('fields.modality') },
      { key: 'dateAdded', label: t('fields.dateAdded') },
      { key: 'type', label: t('fields.authType') },
    ],
    [t],
  )

  const actions: ActionDef<DeviceData>[] = useMemo(
    () => [
      {
        icon: <DeleteOutlined sx={{ fontSize: 18 }} />,
        tooltip: t('actions.delete'),
        onClick: handleRemove2Fa,
      },
    ],
    [t, handleRemove2Fa],
  )

  const handleRowsPerPageChange = useCallback((newSize: number) => {
    setRowsPerPage(newSize)
    setPage(0)
  }, [])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page,
      rowsPerPage,
      totalItems: faDetails.length,
      rowsPerPageOptions: [5, 10, 25],
      onPageChange: setPage,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [page, rowsPerPage, faDetails.length, handleRowsPerPageChange],
  )

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage
    return faDetails.slice(start, start + rowsPerPage)
  }, [faDetails, page, rowsPerPage])

  const renderExpandedRow = useCallback((row: DeviceData) => {
    return <UserDeviceDetailViewPage row={{ rowData: row }} />
  }, [])

  return (
    <GluuLoader blocking={isFido2Loading}>
      <GluuViewDetailModal
        isOpen={isOpen}
        handleClose={onClose}
        hideFooter
        modalClassName={classes.modal2FA}
        modalStyle={{ minWidth: 700, maxWidth: '80vw' }}
        contentClassName={classes.modalContent}
        contentStyle={{ overflowX: 'visible' }}
        customHeader={
          <div className={`modal-header ${classes.modalHeader}`}>
            <div className={classes.headerTopRow}>
              <button
                type="button"
                className="btn-close"
                aria-label={t('actions.close')}
                onClick={onClose}
              />
            </div>
            <GluuText variant="h5" className={classes.modalTitle}>
              {t('messages.2FA_details')}
            </GluuText>
          </div>
        }
      >
        <div className={classes.tableWrapper}>
          <GluuTable<DeviceData>
            columns={columns}
            data={paginatedData}
            pagination={pagination}
            actions={actions}
            getRowKey={(row, index) => row.id ?? `row-${index}`}
            emptyMessage={t('messages.no_data_available')}
            expandable
            renderExpandedRow={renderExpandedRow}
          />
        </div>
      </GluuViewDetailModal>
    </GluuLoader>
  )
}

export default React.memo(User2FADevicesModal)
