import React from 'react'

const { Consumer, Provider } = React.createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {}
})

export {
  Consumer,
  Provider
}
