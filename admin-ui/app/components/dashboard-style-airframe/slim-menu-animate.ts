import anime from 'animejs'

const ANIMATION_DURATION = 150
const ANIMATION_STEP_OFFSET = 0.1

export default class SlimMenuAnimate {
  private _sidebarElement: HTMLElement | null = null
  private _triggerElements: HTMLElement[] = []

  private mouseInHandler = (event: Event): void => {
    if (this._animationsEnabled()) {
      const triggerElement = event.currentTarget as HTMLElement
      const subMenuElement = triggerElement.querySelector(
        ':scope > .sidebar-submenu',
      ) as HTMLElement | null

      if (subMenuElement) {
        const timeline = anime
          .timeline({
            targets: subMenuElement,
            duration: ANIMATION_DURATION,
            begin: () => {
              subMenuElement.style.transformOrigin = 'top left'
            },
          })
          .add({
            opacity: [0, 1],
            easing: 'easeOutCubic',
          })
          .add(
            {
              scale: [0.8, 1],
              translateY: [-30, 0],
              translateX: [-30, 0],
              easing: 'easeOutElastic(1.5, 0.8)',
            },
            ANIMATION_DURATION * ANIMATION_STEP_OFFSET,
          )

        // Reset Style on Finish
        timeline.finished.then(() => {
          subMenuElement.style.opacity = ''
          subMenuElement.style.transform = ''
          subMenuElement.style.transformOrigin = ''
        })
      }
    }
  }

  private mouseOutHandler = (): void => {
    // Mouse out animation intentionally disabled
  }

  private _animationsEnabled(): boolean {
    if (!this._sidebarElement) return false

    return (
      this._sidebarElement.classList.contains('sidebar--animations-enabled') &&
      this._sidebarElement.classList.contains('sidebar--slim') &&
      this._sidebarElement.classList.contains('sidebar--collapsed')
    )
  }

  /**
   * Assigns the parent sidebar element, and attaches hover listeners
   */
  assignSidebarElement(sidebarElement: HTMLElement): void {
    this._sidebarElement = sidebarElement
    this._triggerElements = Array.from(
      this._sidebarElement.querySelectorAll(
        '.sidebar-menu .sidebar-menu__entry.sidebar-menu__entry--nested',
      ),
    ) as HTMLElement[]

    this._triggerElements.forEach((triggerElement) => {
      triggerElement.addEventListener('mouseenter', this.mouseInHandler)
      triggerElement.addEventListener('mouseleave', this.mouseOutHandler)
    })
  }

  /**
   * Disconnects the listeners
   */
  destroy(): void {
    this._triggerElements.forEach((triggerElement) => {
      triggerElement.removeEventListener('mouseenter', this.mouseInHandler)
      triggerElement.removeEventListener('mouseleave', this.mouseOutHandler)
    })
  }
}
