import React from 'react'
import AppLayout from '../../layout/default'
import { RoutedContent } from '../../routes'
import ByeBye from '../../routes/Pages/ByeBye'
import AppAuthProvider from '../../utils/AppAuthProvider'

export default function AuthenticatedRouteSelector() {
    const selectedComponents =  (window.location.href.indexOf("logout") > -1) ? <ByeBye/> :
    <AppAuthProvider>
      <AppLayout>
        <RoutedContent />
      </AppLayout>
    </AppAuthProvider>;

    return (
      <div>
        {selectedComponents}
      </div>
    );
  }