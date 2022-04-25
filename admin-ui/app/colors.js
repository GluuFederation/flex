import chain from 'lodash/chain';
import pick from 'lodash/pick';

import colors from './colors.scss';

const colorKeys = chain(colors)
  .keys()
  .filter((colorKey) => (
    colorKey.indexOf('bg-') === -1 &&
        colorKey.indexOf('fg-') === -1
  ))
  .value();

export default pick(colors, colorKeys);