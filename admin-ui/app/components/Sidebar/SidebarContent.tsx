import React from 'react'
import classNames from 'classnames'
import SidebarEntryAnimate from '../dashboard-style-airframe/sidebar-entry-animate'
import SlimSidebarAnimate from '../dashboard-style-airframe/slim-sidebar-animate'
import SlimMenuAnimate from '../dashboard-style-airframe/slim-menu-animate'

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
  sidebarEntryAnimate: SidebarEntryAnimate | null = null
  slimSidebarAnimate: SlimSidebarAnimate | null = null
  slimMenuAnimate: SlimMenuAnimate | null = null

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

    if (this.sidebarRef.current) {
      this.sidebarEntryAnimate.assignParentElement(this.sidebarRef.current)
      this.slimSidebarAnimate.assignParentElement(this.sidebarRef.current)
      this.slimMenuAnimate.assignSidebarElement(this.sidebarRef.current)
    }

    this.sidebarEntryAnimate.executeAnimation().then(() => {
      this.setState({ entryAnimationFinished: true })
    })
  }

  componentWillUnmount() {
    this.sidebarEntryAnimate?.destroy()
    this.slimSidebarAnimate?.destroy()
    this.slimMenuAnimate?.destroy()
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
      <div className={sidebarClass} ref={this.sidebarRef}>
        {children}
      </div>
    )
  }
}
