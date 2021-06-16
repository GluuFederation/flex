import React from 'react'
import BlockUi from 'react-block-ui'
import { useTranslation } from 'react-i18next'
const { t } = useTranslation()
function GluuLoader(props) {
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={props.loading}
        keepInView={true}
        renderChildren={true}
        message={t('messages.request_waiting_message')}
      >
        {props.children}
      </BlockUi>
    </React.Fragment>
  )
}

export default GluuLoader
