import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Layout, ThemeProvider } from 'Components'

import 'Styles/bootstrap.scss'
import 'Styles/main.scss'
import 'Styles/plugins/plugins.scss'
import 'Styles/plugins/plugins.css'

import { RoutedNavbars, RoutedSidebars } from '../routes'

interface FavIcon {
  rel: string
  type?: string
  sizes?: string
  href: string
}

interface AppLayoutProps {
  children: ReactNode
}

const favIcons: FavIcon[] = [
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: require('Images/favicons/favicon.ico'),
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: require('Images/favicons/apple-touch-icon.png'),
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: require('Images/favicons/favicon-32x32.png'),
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: require('Images/favicons/favicon-16x16.png'),
  },
]

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider initialStyle={'light'} initialColor="primary">
      <Layout sidebarSlim favIcons={favIcons}>
        {/* --------- Navbar ----------- */}
        <Layout.Navbar>
          <RoutedNavbars />
        </Layout.Navbar>
        {/* -------- Sidebar ------------*/}
        <Layout.Sidebar>
          <RoutedSidebars />
        </Layout.Sidebar>

        {/* -------- Content ------------*/}
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </ThemeProvider>
  )
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout
