import React, { ReactNode } from 'react'
import { Layout, ThemeProvider } from 'Components'
import { THEME_LIGHT } from '@/context/theme/constants'

import 'Styles/bootstrap.scss'
import 'Styles/main.scss'
import 'Styles/plugins/plugins.scss'
import 'Styles/plugins/plugins.css'

import { RoutedNavbars, RoutedSidebars } from '../routes'

import faviconIco from '../images/favicons/favicon.ico'
import appleTouchIcon from '../images/favicons/apple-touch-icon.png'
import favicon32x32 from '../images/favicons/favicon-32x32.png'
import favicon16x16 from '../images/favicons/favicon-16x16.png'

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
    href: faviconIco,
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: appleTouchIcon,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: favicon32x32,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: favicon16x16,
  },
]

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider initialStyle={THEME_LIGHT} initialColor="primary">
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

export default AppLayout
