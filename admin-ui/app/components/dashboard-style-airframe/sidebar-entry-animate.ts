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
        if (
          (isSlim && sectionElement.classList.contains('sidebar__hide-slim')) ||
          (!isSlim && sectionElement.classList.contains('sidebar__show-slim'))
        ) {
          return
        }

        if (sidebarMenu && sectionElement.contains(sidebarMenu)) {
          sidebarMenuSection = sectionElement
          const sidebarMenuEntriesNodes = sectionElement.querySelectorAll(
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

      const timeline = anime.timeline({
        easing: config.easing,
        duration: config.duration,
        complete: () => {
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

      const totalSections = sidebarSectionsPreMenu.length + sidebarSectionsPostMenu.length
      const totalEntries = sideMenuEntries.length
      const staggerDelay =
        totalSections > 0 && totalEntries > 0
          ? config.duration / totalSections / totalEntries
          : config.duration / 10

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

  assignParentElement(parentElement: HTMLElement): void {
    this.sidebarElement = parentElement
  }

  destroy(): void {}
}
