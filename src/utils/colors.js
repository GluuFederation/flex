// Shards Dashboards Colors

import camelize from 'camelize';

// Base color class
class Color {
  constructor(value) {
    this.value = value;
  }

  toHex() {
    return this.value;
  }

  toRGBA(opacity = 1) {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(this.value)) {
        c = this.value.substring(1).split('');
        if (c.length === 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c>>16)&255, (c>>8)&255, c&255].join(',') + ',' + opacity + ')';
    }
	}
}

const grays = {
  'white'  : new Color('#ffffff'),
  'gray100': new Color('#f8f9fa'),
  'gray200': new Color('#e9ecef'),
  'gray300': new Color('#dee2e6'),
  'gray400': new Color('#ced4da'),
  'gray500': new Color('#adb5bd'),
  'gray600': new Color('#868e96'),
  'gray700': new Color('#495057'),
  'gray800': new Color('#343a40'),
  'gray900': new Color('#212529'),
  'black'  : new Color('#000'),
};

const colors = {
  'blueishGrey': new Color('#5A6169'),
  'blue'       : new Color('#007bff'),
  'indigo'     : new Color('#674eec'),
  'purple'     : new Color('#8445f7'),
  'pink'       : new Color('#ff4169'),
  'red'        : new Color('#c4183c'),
  'orange'     : new Color('#fb7906'),
  'yellow'     : new Color('#ffb400'),
  'green'      : new Color('#17c671'),
  'teal'       : new Color('#1adba2'),
  'cyan'       : new Color('#00b8d8'),
  'gray'       : grays['gray600'],
  'grayDark'   : grays['gray800']
};

// Custom colors specific to Shards Dashboards, includes the new "grays".
const newColors = {
  'fiordBlue'  : new Color('#3D5170'),
  'reagentGray': new Color('#818EA3'),
  'shuttleGray': new Color('#5A6169'),
  'mischka'    : new Color('#CACEDB'),
  'athensGray' : new Color('#E9ECEF'),
  'salmon'     : new Color('#FF4169'),
  'royalBlue'  : new Color('#674EEC'),
  'java'       : new Color('#1ADBA2'),
}

const themeColors = {
  'accent'   : colors['blue'],
  'primary'  : colors['blue'],
  'secondary': colors['blueishGrey'],
  'success'  : colors['green'],
  'info'     : colors['cyan'],
  'warning'  : colors['yellow'],
  'danger'   : colors['red'],
  'light'    : grays['gray200'],
  'dark'     : grays['gray800'],
};

// Allow users to override any color
let overrides = (window.ShardsDashboards && window.ShardsDashboards.colors) ?
                        window.ShardsDashboards.colors : {};

// Parse overriden colors
if (Object.keys(overrides).length !== 0 && overrides.constructor === Object) {
  for (var colorName in overrides) {
    if (overrides.hasOwnProperty(colorName)) {
      if (!/^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(overrides[colorName]))
        throw new Error('Please provide a hexadecimal color value if you are trying to override the Shards Dashboards colors.');
      overrides[camelize(colorName)] = new Color(overrides[colorName]);
    }
  }
}

export default Object.assign(
  {},
  grays,
  colors,
  newColors,
  themeColors,
  overrides
);

