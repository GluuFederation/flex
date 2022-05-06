import { chain, pick } from 'lodash';

import colors from './colors.scss';

const colorKeys = chain(colors)
  .keys()
  .filter((colorKey) => (
    colorKey.indexOf('bg-') === -1 &&
        colorKey.indexOf('fg-') === -1
  ))
  .value();

export default pick(colors, colorKeys);