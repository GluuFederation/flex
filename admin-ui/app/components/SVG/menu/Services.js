import React from 'react'

const Services = ({ fill, className }) => {
  return (
    <div className={className}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill={fill}
        viewBox='0 0 23 23.11'
      >
        <g>
          <g>
            <path d='M18.4 23.11H4.55s0-.03-.02-.04c-.21-.13-.31-.31-.23-.55.07-.22.24-.31.54-.31h1.35c.16 0 .2-.05.2-.2-.01-.22 0-.44 0-.65.01-.89.63-1.5 1.53-1.51h1.13c.14 0 .19-.05.23-.18.15-.57.31-1.14.48-1.71.06-.2.04-.25-.18-.25H2.12C.84 17.71 0 16.86 0 15.6V5.25C0 4 .85 3.16 2.1 3.16h2.44c.11 0 .19-.03.27-.12.23-.26.48-.5.73-.74.63-.59 1.53-.59 2.16 0 .21.2.41.4.61.61.07.07.13.1.23.05.27-.15.56-.26.85-.35.12-.04.15-.09.15-.21v-.86C9.56.81 10.07.2 10.78.06c.39-.08.79-.04 1.19-.03.85 0 1.52.68 1.54 1.54v.83c0 .11.02.17.14.21.29.09.58.21.85.35.1.05.16.04.23-.04.2-.21.41-.42.62-.62.61-.57 1.51-.57 2.12 0 .25.23.49.47.71.72.11.12.21.16.36.16h2.41c1.2 0 2.05.86 2.05 2.06v10.42c0 .2-.02.39-.07.58-.25.92-1.01 1.49-2 1.49h-7.51c-.19 0-.23.03-.17.22.17.57.33 1.14.47 1.71.04.17.12.21.28.2.41 0 .83-.02 1.24 0 .75.04 1.33.64 1.37 1.39.01.26.02.51 0 .77-.01.18.05.21.22.21.47-.01.95 0 1.42 0 .32 0 .53.26.47.55-.04.17-.17.26-.31.35zm-6.91-9.37h5.79c.12 0 .29.08.34-.05.05-.13-.09-.24-.18-.34-.07-.08-.15-.15-.22-.22-.22-.22-.44-.43-.65-.65-.2-.21-.22-.38-.08-.63.26-.45.45-.93.59-1.43.08-.28.21-.38.5-.38h1.17c.48 0 .75-.27.75-.76v-.65c0-.51-.25-.76-.76-.77h-1.15c-.3 0-.43-.11-.52-.4-.14-.49-.33-.96-.58-1.41-.16-.28-.13-.44.09-.66.29-.29.58-.57.86-.86.28-.29.28-.66 0-.95-.18-.19-.37-.38-.56-.56-.32-.32-.69-.32-1.01 0-.28.28-.56.56-.85.84-.22.21-.38.24-.65.09-.44-.25-.91-.45-1.41-.58-.3-.08-.4-.23-.4-.54V1.61c0-.39-.27-.66-.67-.67h-.81c-.42 0-.69.27-.69.69v1.19c0 .31-.11.46-.4.54-.49.13-.95.32-1.39.57-.3.17-.45.15-.7-.1-.28-.28-.56-.57-.85-.84-.29-.27-.66-.27-.95 0-.19.18-.37.37-.56.56-.31.32-.31.69 0 1.01.27.28.55.55.83.83.22.23.25.39.09.67-.25.44-.44.9-.58 1.39-.09.32-.21.42-.55.42H4.14c-.43 0-.68.27-.69.69v.74c0 .47.28.73.75.73h1.19c.23 0 .4.1.46.32.15.55.37 1.06.64 1.55.11.2.07.39-.09.55l-.83.83c-.05.05-.11.11-.15.17-.05.08-.14.17-.09.26.04.08.15.03.23.03h5.88zm.01.9H1.15c-.22 0-.27.06-.25.26.02.22.02.44 0 .65-.06.69.43 1.27 1.26 1.26 6.22-.02 12.45 0 18.67 0h.18c.62-.02 1.07-.48 1.08-1.1 0-.27-.01-.54 0-.81.01-.2-.04-.26-.25-.26H11.49zM.9 9.33v4.22c0 .1-.03.2.15.2H4.3c.11 0 .15-.04.17-.15.04-.35.2-.64.45-.89.19-.19.38-.39.58-.57.08-.07.08-.14.03-.23-.14-.27-.26-.54-.34-.83-.04-.12-.1-.16-.22-.16-.27.01-.54 0-.81 0-.82-.02-1.46-.59-1.54-1.41-.03-.31-.02-.63-.02-.95.01-.95.66-1.61 1.62-1.62h.77c.12 0 .18-.04.21-.15.09-.29.21-.58.35-.85.05-.09.04-.15-.04-.21-.2-.19-.38-.38-.57-.57-.26-.26-.43-.56-.46-.93-.01-.13-.06-.17-.2-.17H2.12c-.75 0-1.19.44-1.19 1.19v4.08zm21.19.01V5.19c0-.67-.46-1.13-1.13-1.13h-2.21c-.12 0-.2 0-.21.15-.03.38-.21.7-.48.97-.18.18-.35.36-.53.52-.09.08-.11.15-.05.27.14.26.25.53.33.81.04.14.11.17.24.16.31 0 .62-.01.92 0 .72.05 1.31.61 1.4 1.33.05.42.05.84 0 1.26-.09.79-.73 1.36-1.53 1.38h-.81c-.13 0-.2.03-.24.16-.08.27-.19.54-.32.79-.07.13-.04.21.06.3.2.18.39.38.57.57.22.23.37.5.4.81.02.16.08.19.23.19h3.13c.17 0 .21-.03.21-.21V9.33zM11.47 22.2h3.54c.22 0 .53.08.65-.04.14-.13.04-.44.04-.67 0-.58-.17-.76-.75-.76H7.83c-.32.02-.53.23-.54.55-.01.24 0 .48 0 .72-.01.16.05.19.2.19h3.99zm.02-2.37h1.17c.15 0 .18-.04.14-.18-.17-.6-.34-1.2-.5-1.8-.03-.1-.06-.16-.19-.16-.41.01-.81 0-1.22 0-.11 0-.15.04-.18.14-.17.61-.33 1.21-.51 1.82-.04.15 0 .18.15.17h1.15z'></path>
            <path d='M11.79 13.01c-2.36 0-4.16-1.62-4.36-3.62-.21-2.14 1.22-4.12 3.39-4.5.14-.02.28-.04.43-.05.28-.01.49.17.5.44.01.25-.17.44-.45.46-1.05.09-1.89.56-2.47 1.45a3.15 3.15 0 00.06 3.56c.74 1.06 2.07 1.58 3.3 1.28 1.29-.3 2.26-1.32 2.45-2.61.13-.85-.05-1.64-.56-2.35v-.02c-.25-.33-.25-.59 0-.77.24-.16.5-.09.72.23.92 1.36 1.07 2.8.32 4.26-.74 1.45-1.99 2.17-3.34 2.23z'></path>
            <path d='M13.43 5.6c0 .25-.22.46-.46.45-.24 0-.44-.21-.43-.45 0-.25.21-.46.46-.45.24 0 .44.22.44.45z'></path>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Services
