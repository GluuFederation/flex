import React from 'react';
import some from 'lodash/some';
import includes from 'lodash/includes';

import {
  InputGroupAddon as BsInputGroupAddon
} from 'reactstrap';

const InputGroupAddon = (props) => {
  const { children, ...otherProps } = props;
  const childArr = React.Children.toArray(children);
  const isFa = some(childArr, (child) =>
    React.isValidElement(child) && child.props.className && includes(child.props.className, 'fa'));
  const isCheckRadio = some(childArr, (child) =>
    React.isValidElement(child) && (child.props.type === 'radio' || child.props.type === 'checkbox'));

  const child = isFa || isCheckRadio ? (
    <div className="input-group-text">
      { children }
    </div>
  ) : children;

  return (
    <BsInputGroupAddon { ...otherProps }>
      { child }
    </BsInputGroupAddon>
  );
};
InputGroupAddon.propTypes = {
  ...BsInputGroupAddon.propTypes
};
InputGroupAddon.defaultProps = BsInputGroupAddon.defaultProps;

export { InputGroupAddon };
