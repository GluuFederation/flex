import React from 'react'
import classNames from 'classnames'

const SidebarEntryAnimate = require('./../../components/dashboard-style-airframe/sidebar-entry-animate')
const SlimSidebarAnimate = require('./../../components/dashboard-style-airframe/slim-sidebar-animate')
const SlimMenuAnimate = require('./../../components/dashboard-style-airframe/slim-menu-animate')

interface SidebarContentProps {
  children?: React.ReactNode
  slim?: boolean
  collapsed?: boolean
  animationsDisabled?: boolean
  pageConfig: {
    sidebarSlim?: boolean
    sidebarCollapsed?: boolean
    animationsDisabled?: boolean
  }
}

interface SidebarContentState {
  entryAnimationFinished: boolean
}

export class SidebarContent extends React.Component<SidebarContentProps, SidebarContentState> {
  sidebarRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()
  sidebarEntryAnimate: any
  slimSidebarAnimate: any
  slimMenuAnimate: any

  constructor(props: SidebarContentProps) {
    super(props)

    this.state = {
      entryAnimationFinished: false,
    }
  }

  componentDidMount() {
    this.sidebarEntryAnimate = new SidebarEntryAnimate()
    this.slimSidebarAnimate = new SlimSidebarAnimate()
    this.slimMenuAnimate = new SlimMenuAnimate()

    this.sidebarEntryAnimate.assignParentElement(this.sidebarRef.current)
    this.slimSidebarAnimate.assignParentElement(this.sidebarRef.current)
    this.slimMenuAnimate.assignSidebarElement(this.sidebarRef.current)

    this.sidebarEntryAnimate.executeAnimation().then(() => {
      this.setState({ entryAnimationFinished: true })
    })
  }

  componentWillUnmount() {
    this.sidebarEntryAnimate.destroy()
    this.slimSidebarAnimate.destroy()
    this.slimMenuAnimate.destroy()
  }

  render() {
    const {
      animationsDisabled = false,
      collapsed = false,
      pageConfig,
      slim = false,
      children,
    } = this.props

    const sidebarClass = classNames(
      'sidebar custom-sidebar-container',
      'sidebar--animations-enabled',
      {
        'sidebar--slim': slim || pageConfig.sidebarSlim,
        'sidebar--collapsed': collapsed || pageConfig.sidebarCollapsed,
        'sidebar--animations-disabled': animationsDisabled || pageConfig.animationsDisabled,
        'sidebar--animate-entry-complete': this.state.entryAnimationFinished,
      },
    )

    return (
      <div
        className={sidebarClass}
        style={{
          boxShadow:
            '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        }}
        ref={this.sidebarRef}
      >
        {children}
      </div>
    )
  }
}
