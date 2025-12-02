import { useState, useCallback, useMemo } from 'react'
import type { ExtendedClient, ClientFormValues, ClientTab, ModifiedFields } from '../types'
import { buildClientInitialValues, hasFormChanges } from '../helper/utils'

export function useClientForm(client: Partial<ExtendedClient>) {
  const [activeTab, setActiveTab] = useState<ClientTab>('basic')
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commitModalOpen, setCommitModalOpen] = useState(false)

  const initialValues = useMemo(() => buildClientInitialValues(client), [client])

  const handleTabChange = useCallback((tab: ClientTab) => {
    setActiveTab(tab)
  }, [])

  const trackFieldChange = useCallback((fieldLabel: string, value: unknown) => {
    setModifiedFields((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }))
  }, [])

  const resetModifiedFields = useCallback(() => {
    setModifiedFields({})
  }, [])

  const resetForm = useCallback(() => {
    setModifiedFields({})
    setActiveTab('basic')
    setIsSubmitting(false)
  }, [])

  const checkHasChanges = useCallback(
    (currentValues: ClientFormValues) => hasFormChanges(currentValues, initialValues),
    [initialValues],
  )

  const openCommitModal = useCallback(() => {
    setCommitModalOpen(true)
  }, [])

  const closeCommitModal = useCallback(() => {
    setCommitModalOpen(false)
  }, [])

  return {
    activeTab,
    setActiveTab: handleTabChange,
    modifiedFields,
    setModifiedFields,
    trackFieldChange,
    resetModifiedFields,
    resetForm,
    checkHasChanges,
    initialValues,
    isSubmitting,
    setIsSubmitting,
    commitModalOpen,
    openCommitModal,
    closeCommitModal,
  }
}

export function useFieldTracking(
  setModifiedFields: React.Dispatch<React.SetStateAction<ModifiedFields>>,
) {
  return useCallback(
    (fieldLabel: string, value: unknown) => {
      setModifiedFields((prev) => ({
        ...prev,
        [fieldLabel]: value,
      }))
    },
    [setModifiedFields],
  )
}
