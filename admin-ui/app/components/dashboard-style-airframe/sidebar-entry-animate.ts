import anime from 'animejs'

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

      const sidebarSectionsPreMenu: Element[] = []
      let sidebarMenuSection: Element | null = null
      let sideMenuEntries: Element[] = []
      const sidebarSectionsPostMenu: Element[] = []

      sidebarElement.querySelectorAll('.sidebar__section').forEach((sectionElement) => {
        // Omit sections which aren't visible
        if (
          (isSlim && sectionElement.classList.contains('sidebar__hide-slim')) ||
          (!isSlim && sectionElement.classList.contains('sidebar__show-slim'))
        ) {
          return
        }

        if (sidebarMenu && sectionElement.contains(sidebarMenu)) {
          sidebarMenuSection = sectionElement
          // Add sidemenu entries
          const sidebarMenuEntriesNodes = sectionElement.querySelectorAll(
            '.sidebar-menu > .sidebar-menu__entry',
          )
          sideMenuEntries = sideMenuEntries.concat(Array.from(sidebarMenuEntriesNodes))
        } else {
          if (sideMenuEntries.length > 0) {
            // Add post menu sections
            sidebarSectionsPostMenu.push(sectionElement)
          } else {
            // Add pre menu sections
            sidebarSectionsPreMenu.push(sectionElement)
          }
        }
      })

      const timeline = anime.timeline({
        easing: config.easing,
        duration: config.duration,
        complete: () => {
          // Clear section styles
          const allElements = [
            ...sidebarSectionsPreMenu,
            ...sideMenuEntries,
            ...sidebarSectionsPostMenu,
          ]
          allElements.forEach((element) => {
            ;(element as HTMLElement).style.opacity = ''
          })
        },
      })

      const staggerDelay =
        config.duration /
        (sidebarSectionsPreMenu.length + sidebarSectionsPostMenu.length) /
        sideMenuEntries.length

      timeline
        .add({
          targets: sidebarSectionsPreMenu,
          delay: anime.stagger(staggerDelay),
          opacity: [0, 1],
        })
        .add({
          targets: sideMenuEntries,
          delay: anime.stagger(staggerDelay),
          begin: () => {
            if (sidebarMenuSection) {
              ;(sidebarMenuSection as HTMLElement).style.opacity = '1'
            }
          },
          opacity: [0, 1],
        })
        .add({
          targets: sidebarSectionsPostMenu,
          delay: anime.stagger(staggerDelay),
          opacity: [0, 1],
        })

      this.wasAnimated = true

      return timeline.finished
    }

    return Promise.resolve()
  }

  /**
   * Assigns the parent sidebar element
   */
  assignParentElement(parentElement: HTMLElement): void {
    this.sidebarElement = parentElement
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    // No cleanup needed for this class
  }
}
