import React from 'react';
import { Col, Button, FormGroup, Divider } from './../../../components';
import { useTranslation } from 'react-i18next';
import applicationStyle from '../../Apps/Gluu/styles/applicationstyle';

function GluuFooter({ extraOnClick, extraLabel, hideButtons }) {
  const { t } = useTranslation();

  function goBack() {
    window.history.back();
  }
  return (
    <>
      <Divider></Divider>
      <FormGroup row></FormGroup>
      <FormGroup row>
        <Col sm={4} md={2}>
          {extraLabel && extraOnClick && (
            <Button
              color="primary"
              onClick={extraOnClick}
              style={applicationStyle.buttonStyle}
            >
              {t(extraLabel)}
            </Button>
          )}
        </Col>
        {!hideButtons || !hideButtons['back'] ? (
          <Col sm={4} md={2}>
            <Button
              color="secondary"
              onClick={goBack}
              style={applicationStyle.buttonStyle}
            >
              <i className="fa fa-arrow-circle-left mr-2"></i>
              {t('actions.cancel')}
            </Button>
          </Col>
        ) : (
          ''
        )}
        &nbsp;
        {!hideButtons || !hideButtons['save'] ? (
          <Col sm={4} md={2}>
            <Button
              color="primary"
              type="submit"
              style={applicationStyle.buttonStyle}
            >
              <i className="fa fa-check-circle mr-2"></i>
              {t('actions.save')}
            </Button>
          </Col>
        ) : (
          ''
        )}
      </FormGroup>
    </>
  );
}

export default GluuFooter;
