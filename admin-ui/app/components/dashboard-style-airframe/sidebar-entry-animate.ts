import { createTimeline, stagger } from 'animejs'
import type { Timeline } from 'animejs'

interface SidebarEntryAnimateOptions {
  duration?: number
  easing?: string
}

export default class SidebarEntryAnimate {
  private wasAnimated: boolean = false
  private sidebarElement: HTMLElement | null = null
  private config: Required<SidebarEntryAnimateOptions>

  constructor(options?: SidebarEntryAnimateOptions) {
    this.config = {
      duration: 100,
      easing: 'linear',
      ...options,
    }
  }

  executeAnimation(): Promise<void> {
    const { config, sidebarElement } = this

    if (!this.wasAnimated && sidebarElement) {
      const isSlim =
        sidebarElement.classList.contains('sidebar--slim') &&
        sidebarElement.classList.contains('sidebar--collapsed')
      const sidebarMenu = sidebarElement.querySelector('.sidebar-menu')

      const sidebarSectionsPreMenu: HTMLElement[] = []
      let sidebarMenuSection: HTMLElement | null = null
      let sideMenuEntries: HTMLElement[] = []
      const sidebarSectionsPostMenu: HTMLElement[] = []

      sidebarElement
        .querySelectorAll<HTMLElement>('.sidebar__section')
        .forEach((sectionElement) => {
          if (
            (isSlim && sectionElement.classList.contains('sidebar__hide-slim')) ||
            (!isSlim && sectionElement.classList.contains('sidebar__show-slim'))
          ) {
            return
          }

          if (sidebarMenu && sectionElement.contains(sidebarMenu)) {
            sidebarMenuSection = sectionElement
            const sidebarMenuEntriesNodes = sectionElement.querySelectorAll<HTMLElement>(
              '.sidebar-menu > .sidebar-menu__entry',
            )
            sideMenuEntries = sideMenuEntries.concat(Array.from(sidebarMenuEntriesNodes))
          } else {
            if (sideMenuEntries.length > 0) {
              sidebarSectionsPostMenu.push(sectionElement)
            } else {
              sidebarSectionsPreMenu.push(sectionElement)
            }
          }
        })

      const totalSections = sidebarSectionsPreMenu.length + sidebarSectionsPostMenu.length
      const totalEntries = sideMenuEntries.length
      const staggerDelay =
        totalSections > 0 && totalEntries > 0
          ? config.duration / totalSections / totalEntries
          : config.duration / 10

      const capturedMenuSection = sidebarMenuSection as HTMLElement | null

      const timeline: Timeline = createTimeline({
        defaults: { ease: config.easing },
        duration: config.duration,
        onComplete: () => {
          const allElements: HTMLElement[] = [
            ...sidebarSectionsPreMenu,
            ...sideMenuEntries,
            ...sidebarSectionsPostMenu,
          ]
          if (capturedMenuSection) {
            allElements.push(capturedMenuSection)
          }
          allElements.forEach((element) => {
            element.style.opacity = ''
          })
        },
      })

      timeline
        .add(sidebarSectionsPreMenu, { delay: stagger(staggerDelay), opacity: [0, 1] })
        .add(sideMenuEntries, {
          delay: stagger(staggerDelay),
          onBegin: () => {
            if (capturedMenuSection) {
              capturedMenuSection.style.opacity = '1'
            }
          },
          opacity: [0, 1],
        })
        .add(sidebarSectionsPostMenu, { delay: stagger(staggerDelay), opacity: [0, 1] })

      this.wasAnimated = true

      return new Promise<void>((resolve) => {
        timeline.then(() => resolve())
      })
    }

    return Promise.resolve()
  }

  assignParentElement(parentElement: HTMLElement): void {
    this.sidebarElement = parentElement
  }

  destroy(): void {}
}
