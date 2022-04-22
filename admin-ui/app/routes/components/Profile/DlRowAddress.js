import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const DlRowAddress = (props) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <dl className="row">
        <dt className={ `col-sm-3 ${ props.leftSideClassName }` }>{t("Adress")}</dt>
        <dd className={ `col-sm-9 ${ props.rightSideClassName }` }>700 Zemlak Glen</dd>
        <dt className={ `col-sm-3 ${ props.leftSideClassName }` }>{t("City")}</dt>
        <dd className={ `col-sm-9 ${ props.rightSideClassName }` }>Jacobiton</dd>
        <dt className={ `col-sm-3 ${ props.leftSideClassName }` }>{t("State")}</dt>
        <dd className={ `col-sm-9 ${ props.rightSideClassName }` }><a href="#">West Virginia</a></dd>
        <dt className={ `col-sm-3 ${ props.leftSideClassName }` }>{t("ZIP")}</dt>
        <dd className={ `col-sm-9 ${ props.rightSideClassName }` }>87032</dd>
      </dl>
    </React.Fragment>
  );
};
DlRowAddress.propTypes = {
  leftSideClassName: PropTypes.node,
  rightSideClassName: PropTypes.node
};
DlRowAddress.defaultProps = {
  leftSideClassName: "",
  rightSideClassName: ""
};

export { DlRowAddress };
