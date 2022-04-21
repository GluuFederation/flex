import React from 'react';
import { Col, Button, FormGroup, Divider } from './../../../components';
import { useTranslation } from 'react-i18next';
import applicationStyle from '../../Apps/Gluu/styles/applicationstyle';

function GluuCommitFooter({
  extraOnClick,
  saveHandler,
  extraLabel,
  hideButtons,
}) {
  const { t } = useTranslation();
  function goBack() {
    window.history.back();
  }
  return (
    <>
      <Divider></Divider>
      <FormGroup row></FormGroup>
      <FormGroup row>
        &nbsp;
        {!hideButtons || !hideButtons['back'] ? (
          <Col sm={2} md={1}>
            <Button
              color="secondary"
              style={applicationStyle.buttonStyle}
              type="button"
              onClick={goBack}
            >
              <i className="fa fa-arrow-circle-left mr-2"></i>
              {t('actions.cancel')}
            </Button>
          </Col>
        ) : (
          ''
        )}
        <Col sm={0} md={7}>
          {extraLabel && extraOnClick && (
            <Button
              color="primary"
              type="button"
              style={applicationStyle.buttonStyle}
              onClick={extraOnClick}
            >
              {extraLabel}
            </Button>
          )}
          <Button
            type="submit"
            color="primary"
            className="UserActionSubmitButton"
            style={{ visibility: 'hidden' }}
          >
            {t('actions.submit')}
          </Button>
        </Col>
        {!hideButtons || !hideButtons['save'] ? (
          <Button
            type="button"
            color="primary"
            style={applicationStyle.buttonStyle}
            className="ml-auto px-4"
            onClick={saveHandler}
          >
            <i className="fa fa-check-circle mr-2"></i>
            {t('actions.apply')}
          </Button>
        ) : (
          ''
        )}
      </FormGroup>
    </>
  );
}

export default GluuCommitFooter;
