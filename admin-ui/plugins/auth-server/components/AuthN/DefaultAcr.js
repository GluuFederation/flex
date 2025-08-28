import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useTranslation } from 'react-i18next'
import { ACR_READ, ACR_WRITE } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/features/acrSlice'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import { Form } from 'Components'
import { useFormik } from 'formik'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'

function DefaultAcr({ acrData, isLoading }) {
  const { hasCedarPermission } = useCedarling()
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const [modal, setModal] = useState(false)
  const userAction = {}

  SetTitle(t('titles.acr_management'))

  const acrOptions = [
    { value: 'basic', label: 'Basic Authentication' },
    { value: 'simple_password_auth', label: 'Simple Password Authentication' },
    // { value: 'agama_io.jans.casa.authn.main', label: 'Agama Authentication' },
  ]

  const safeAcrData = acrData || {}

  const displayedOptions = useMemo(() => {
    const selected = safeAcrData.defaultAcr
    if (!selected) return acrOptions
    const exists = acrOptions.some((opt) => opt.value === selected)
    return exists ? acrOptions : [...acrOptions, { value: selected, label: selected }]
  }, [acrOptions, safeAcrData.defaultAcr, t])

  const initialValues = useMemo(
    () => ({ defaultAcr: safeAcrData.defaultAcr ?? '' }),
    [safeAcrData.defaultAcr],
  )

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: () => {
      setModal(true)
    },
  })

  const toggle = () => {
    setModal(!modal)
  }

  const handleAcrChange = (e) => {
    formik.handleChange(e)
  }

  const handleSubmit = () => {
    formik.handleSubmit()
  }

  const submitForm = (userMessage) => {
    toggle()
    const value = formik.values.defaultAcr
    if (!value) return

    const payload = {
      authenticationMethod: {
        defaultAcr: value,
      },
    }

    buildPayload(userAction, userMessage, payload)
    dispatch(editAcrs({ data: payload }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
      <div style={{ paddingBottom: '7vh', paddingTop: '3vh' }}>
        <GluuViewWrapper canShow={hasCedarPermission(ACR_READ)}>
          <GluuSelectRow
            name="defaultAcr"
            label="fields.default_acr"
            formik={formik}
            value={formik.values.defaultAcr}
            values={displayedOptions}
            lsize={4}
            rsize={8}
            required
            isLoading={isLoading}
            handleChange={handleAcrChange}
          />
        </GluuViewWrapper>
      </div>

      {hasCedarPermission(ACR_WRITE) && <GluuCommitFooter saveHandler={handleSubmit} />}
    </Form>
  )
}

const DefaultAcrComponent = () => {
  const { authorize } = useCedarling()
  const dispatch = useDispatch()
  const { acrReponse, loading } = useSelector((state) => state.acrReducer)

  useEffect(() => {
    const initializeAcr = async () => {
      try {
        await authorize([ACR_WRITE, ACR_READ])
      } catch (error) {
        console.error('Error initializing ACR configuration:', error)
      }
    }
    initializeAcr()
    dispatch(getAcrsConfig())
  }, [authorize, dispatch])

  return (
    <GluuLoader blocking={loading}>
      <DefaultAcr acrData={acrReponse} isLoading={loading} />
    </GluuLoader>
  )
}

export default DefaultAcrComponent
