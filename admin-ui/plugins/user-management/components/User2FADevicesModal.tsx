import React, { useEffect, useState, useCallback, useContext, useRef, useMemo } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import GluuViewDetailModal from 'Routes/Apps/Gluu/GluuViewDetailsModal'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import getThemeColor from '@/context/theme/config'
import { ThemeContext } from '@/context/theme/themeContext'
import {
  useGetRegistrationEntriesFido2,
  useDeleteFido2Data,
  usePutUser,
  getGetUserQueryKey,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import moment from 'moment'
import customColors from '@/customColors'
import UserDeviceDetailViewPage from './UserDeviceDetailViewPage'
import {
  DeviceData,
  UserTableRowData,
  CustomAttribute,
  OTPDevicesData,
  OTPDevice,
  FidoRegistrationEntry,
  CustomUser,
} from '../types'
import { getErrorMessage, logUserUpdate } from '../helper/userAuditHelpers'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface User2FADevicesModalProps {
  isOpen: boolean
  onClose: () => void
  userDetails: UserTableRowData | null
  theme: string
}

const User2FADevicesModal = ({ isOpen, onClose, userDetails, theme }: User2FADevicesModalProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const themeContext = useContext(ThemeContext)
  const selectedTheme = theme || themeContext?.state?.theme || DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const [faDetails, setFADetails] = useState<DeviceData[]>([])
  const [otpDevicesList, setOTPDevicesList] = useState<DeviceData[]>([])
  const initializedRef = useRef<string | null>(null)

  // Fetch FIDO2 registration entries
  const { data: fidoRegistrationData, refetch: refetchFido2Details } =
    useGetRegistrationEntriesFido2(userDetails?.userId?.toLowerCase() || '', {
      query: {
        enabled: isOpen && !!userDetails?.userId,
      },
    })

  // Memoize fidoDetails to prevent unnecessary re-renders
  const fidoDetails = useMemo(
    () => fidoRegistrationData?.entries || [],
    [fidoRegistrationData?.entries],
  )

  // Delete FIDO2 mutation
  const deleteFido2Mutation = useDeleteFido2Data({
    mutation: {
      onSuccess: async () => {
        dispatch(updateToast(true, 'success', t('messages.device_deleted_successfully')))
        await refetchFido2Details()
      },
      onError: (error: unknown) => {
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
      onError: (error: unknown) => {
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
          dateAdded: moment(new Date((item.addedOn || 0) * 1000).toString()).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
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
        dateAdded: item.creationDate
          ? moment(item.creationDate).format('YYYY-MM-DD HH:mm:ss')
          : '-',
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
    [userDetails, deleteFido2Mutation, updateUserData, otpDevicesList],
  )

  const DetailPanelForDevices = useCallback((rowData: { rowData: DeviceData }) => {
    return <UserDeviceDetailViewPage row={rowData} />
  }, [])

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  return (
    <GluuViewDetailModal isOpen={isOpen} handleClose={onClose}>
      <MaterialTable<DeviceData>
        components={{
          Container: PaperContainer,
        }}
        columns={[
          { title: `${t('fields.nickName')}`, field: 'nickName' },
          { title: `${t('fields.modality')}`, field: 'modality' },
          { title: `${t('fields.dateAdded')}`, field: 'dateAdded' },
          { title: `${t('fields.authType')}`, field: 'type' },
        ]}
        data={faDetails}
        isLoading={false}
        title=""
        options={{
          search: false,
          paging: false,
          toolbar: false,
          idSynonym: 'id',
          selection: false,
          rowStyle: () => ({
            backgroundColor: customColors.white,
          }),
          headerStyle: {
            ...applicationStyle.tableHeaderStyle,
            ...bgThemeColor,
          } as React.CSSProperties,
          actionsColumnIndex: -1,
        }}
        editable={{
          isDeleteHidden: () => false,
          onRowDelete: (oldData: DeviceData) => {
            return new Promise<void>((resolve) => {
              handleRemove2Fa(oldData)
              resolve()
            })
          },
        }}
        detailPanel={DetailPanelForDevices}
      />
    </GluuViewDetailModal>
  )
}

export default React.memo(User2FADevicesModal)
