import anime from 'animejs'

interface SideMenuAnimateConfig {
  easing?: string
  duration?: number
}

interface ChangedNode {
  target: Element
  wasOpen: boolean
}

export default class SideMenuAnimate {
  private _nodesObserver: MutationObserver
  private config: Required<SideMenuAnimateConfig>
  private activeAnimation: anime.AnimeInstance | null = null

  constructor(config?: SideMenuAnimateConfig) {
    this.config = {
      easing: 'easeInOutCubic',
      duration: 300,
      ...config,
    }

    this._nodesObserver = new MutationObserver((mutations) => {
      const changedNodes: ChangedNode[] = mutations
        .filter((mutation) => {
          const target = mutation.target as Element
          return (
            target.classList.contains('sidebar-menu__entry--nested') ||
            target.classList.contains('sidebar-submenu__entry--nested')
          )
        })
        .map((mutation) => ({
          target: mutation.target as Element,
          wasOpen: (mutation.oldValue || '').indexOf('open') >= 0,
        }))

      changedNodes.forEach((node) => {
        const isOpen = node.target.classList.contains('open')

        if (isOpen !== node.wasOpen) {
          const menu = node.target.querySelector('.sidebar-submenu') as HTMLElement | null

          if (menu) {
            if (this.activeAnimation && !this.activeAnimation.completed) {
              anime.remove(menu)
            }

            this.activeAnimation = anime({
              targets: menu,
              height: isOpen ? [0, menu.scrollHeight] : [menu.scrollHeight, 0],
              duration: this.config.duration,
              easing: this.config.easing,
            })

            this.activeAnimation.finished.then(() => {
              menu.style.height = ''
            })
          }
        }
      })
    })
  }

  assignParentElement(parentElement: HTMLElement): void {
    this._nodesObserver.disconnect()
    this._nodesObserver.observe(parentElement, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
      subtree: true,
    })
  }

  destroy(): void {
    if (this.activeAnimation) {
      this.activeAnimation.pause()
    }
    this._nodesObserver.disconnect()
  }
}
