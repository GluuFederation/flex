import { createTimeline } from 'animejs'

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
        const timeline = createTimeline({
          duration: ANIMATION_DURATION,
          onBegin: () => {
            subMenuElement.style.transformOrigin = 'top left'
          },
        })
          .add(subMenuElement, {
            opacity: [0, 1],
            ease: 'easeOutCubic',
          })
          .add(
            subMenuElement,
            {
              scale: [0.8, 1],
              translateY: [-30, 0],
              translateX: [-30, 0],
              ease: 'easeOutElastic(1.5, 0.8)',
            },
            ANIMATION_DURATION * ANIMATION_STEP_OFFSET,
          )

        timeline.then(() => {
          subMenuElement.style.opacity = ''
          subMenuElement.style.transform = ''
          subMenuElement.style.transformOrigin = ''
        })
      }
    }
  }

  private mouseOutHandler = (): void => {}

  private _animationsEnabled(): boolean {
    if (!this._sidebarElement) return false

    return (
      this._sidebarElement.classList.contains('sidebar--animations-enabled') &&
      this._sidebarElement.classList.contains('sidebar--slim') &&
      this._sidebarElement.classList.contains('sidebar--collapsed')
    )
  }

  assignSidebarElement(sidebarElement: HTMLElement): void {
    this._triggerElements.forEach((triggerElement) => {
      triggerElement.removeEventListener('mouseenter', this.mouseInHandler)
      triggerElement.removeEventListener('mouseleave', this.mouseOutHandler)
    })

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

  destroy(): void {
    this._triggerElements.forEach((triggerElement) => {
      triggerElement.removeEventListener('mouseenter', this.mouseInHandler)
      triggerElement.removeEventListener('mouseleave', this.mouseOutHandler)
    })
    this._triggerElements = []
    this._sidebarElement = null
  }
}
