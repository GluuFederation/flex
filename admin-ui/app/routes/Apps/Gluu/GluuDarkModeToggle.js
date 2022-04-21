import React from 'react';
import useDarkMode from 'use-dark-mode';

import Toggle from 'react-toggle';

const GluuDarkModeToggle = () => {
  const darkMode = useDarkMode(false, {
    classNameDark: 'layout--theme--dark--primary',
    classNameLight: 'layout--theme--light--primary',
    element: document.getElementsByClassName('layout')[0],
  });

  return <Toggle checked={darkMode.value} onChange={darkMode.toggle} />;
};

export default GluuDarkModeToggle;
