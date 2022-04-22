import React from 'react';
import BlockUi from 'react-block-ui';
import { useTranslation } from 'react-i18next';

function GluuLoader(props) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={props.blocking}
        keepInView={true}
        renderChildren={true}
        message={t('messages.request_waiting_message')}
      >
        {props.children}
      </BlockUi>
    </React.Fragment>
  );
}

export default GluuLoader;
