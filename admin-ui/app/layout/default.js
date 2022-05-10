import React from "react"
import PropTypes from "prop-types"
import useDarkMode from 'use-dark-mode'
import { Layout, ThemeProvider } from "Components"

import "Styles/bootstrap.scss"
import "Styles/main.scss"
import "Styles/plugins/plugins.scss"
import "Styles/plugins/plugins.css"

import { RoutedNavbars, RoutedSidebars } from "Routes"

const favIcons = [
  {
    rel: "icon",
    type: "image/x-icon",
    href: require("./../images/favicons/favicon.ico"),
  },

  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: require("./../images/favicons/apple-touch-icon.png"),
  },

  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: require("./../images/favicons/favicon-32x32.png"),
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: require("./../images/favicons/favicon-16x16.png"),
  },
]

const AppLayout = (prop) => {
  const { children } = prop
  const darkMode = useDarkMode(false)
  const initialMode = darkMode.value?"dark":"light"
  return (
    <ThemeProvider initialStyle={initialMode} initialColor="primary">
      <Layout sidebarSlim favIcons={ favIcons }>
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
AppLayout.prop = {
  children: PropTypes.node.isRequired,
}
export default AppLayout
