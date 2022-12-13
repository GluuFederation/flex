import React from 'react'
import AppLayout from '../../layout/default'
import { RoutedContent } from 'Routes'
import ByeBye from 'Routes/Pages/ByeBye'
import AppAuthProvider from 'Utils/AppAuthProvider'
import GluuToast from 'Routes/Apps/Gluu/GluuToast'
export default function AuthenticatedRouteSelector() {
  const selectedComponents =
    window.location.href.indexOf('logout') > -1 ? (
      <ByeBye />
    ) : (
      <AppAuthProvider>
        <AppLayout>
          <RoutedContent />
          <GluuToast />
        </AppLayout>
      </AppAuthProvider>
    )

  return <div>{selectedComponents}</div>
}
