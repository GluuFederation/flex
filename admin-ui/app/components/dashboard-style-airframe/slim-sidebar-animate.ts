import anime from 'animejs'

interface SlimSidebarAnimateOptions {
  sidebarWidth?: number
  sidebarSlimWidth?: number
  animationDuration?: number
  animationStaggerDelay?: number
  animationEasing?: string
}

export default class SlimSidebarAnimate {
  private _nodesObserver: MutationObserver
  private config: Required<SlimSidebarAnimateOptions>
  private timelineStage1: anime.AnimeTimelineInstance | null = null
  private timelineStage2: anime.AnimeTimelineInstance | null = null
  private isAnimating: boolean = false

  constructor(options?: SlimSidebarAnimateOptions) {
    this.config = {
      sidebarWidth: 250,
      sidebarSlimWidth: 60,
      animationDuration: 400,
      animationStaggerDelay: 10,
      animationEasing: 'easeInQuad',
      ...options,
    }

    this._nodesObserver = new MutationObserver((mutations) => {
      this.handleMutation(mutations)
    })
  }

  private buildTimeline(beginCallback?: () => void): anime.AnimeTimelineInstance {
    return anime.timeline({
      easing: this.config.animationEasing,
      duration: this.config.animationDuration / 2,
      autoplay: false,
      begin: beginCallback || (() => {}),
    })
  }

  private handleMutation(mutations: MutationRecord[]): void {
    const { config } = this
    const mutation = mutations[0]
    const animationHalfTime = config.animationDuration / 2
    const sidebarElement = mutation.target as HTMLElement
    const layoutSidebarWrap = sidebarElement.closest('.layout__sidebar') as HTMLElement | null
    const sidebarMenu = sidebarElement.querySelector('.sidebar-menu') as HTMLElement | null
    const sidebarLabels = document.querySelectorAll(
      '.sidebar-menu__entry__link > span, .sidebar-submenu__entry__link > span',
    )
    const sidebarIcons = document.querySelectorAll('.sidebar-menu__entry__icon')
    const sidebarHideSlim = document.querySelectorAll('.sidebar__hide-slim')
    const sidebarShowSlim = document.querySelectorAll('.sidebar__show-slim')

    const isSidebarSlim = sidebarElement.classList.contains('sidebar--slim')
    const isSidebarCollapsed = sidebarElement.classList.contains('sidebar--collapsed')
    const lastSidebarSlim = (mutation.oldValue || '').indexOf('sidebar--slim') >= 0
    const lastSidebarCollapsed = (mutation.oldValue || '').indexOf('sidebar--collapsed') >= 0

    // Finish previous animations if they exist
    if (this.timelineStage1 && (this.timelineStage1 as any).isAnimating) {
      ;(this.timelineStage1 as any).complete()
    }
    if (this.timelineStage2 && (this.timelineStage2 as any).isAnimating) {
      ;(this.timelineStage2 as any).complete()
    }

    if (
      (isSidebarSlim || lastSidebarSlim) &&
      isSidebarCollapsed !== lastSidebarCollapsed &&
      !this.isAnimating
    ) {
      this.isAnimating = true

      if (isSidebarCollapsed) {
        this.animateToCollapsed(
          sidebarElement,
          sidebarMenu,
          sidebarLabels,
          sidebarIcons,
          sidebarHideSlim,
          sidebarShowSlim,
        )
      } else {
        this.animateToExpanded(
          sidebarElement,
          layoutSidebarWrap,
          sidebarMenu,
          sidebarLabels,
          sidebarIcons,
          sidebarHideSlim,
          sidebarShowSlim,
          animationHalfTime,
        )
      }
    }
  }

  private animateToCollapsed(
    sidebarElement: HTMLElement,
    sidebarMenu: HTMLElement | null,
    sidebarLabels: NodeListOf<Element>,
    sidebarIcons: NodeListOf<Element>,
    sidebarHideSlim: NodeListOf<Element>,
    sidebarShowSlim: NodeListOf<Element>,
  ): void {
    const { config } = this

    // Recover the changed class so the animation can be played smoothly
    sidebarElement.classList.remove('sidebar--collapsed')

    // STAGE 1: Hide Default
    this.timelineStage1 = this.buildTimeline()
      .add({
        targets: sidebarElement,
        translateX: -(config.sidebarWidth - config.sidebarSlimWidth),
        begin: () => {
          sidebarElement.classList.add('sidebar--animate-slim--progress')
        },
      })
      .add(
        {
          targets: sidebarLabels,
          opacity: 0,
          complete: () => {
            sidebarLabels.forEach((label) => {
              ;(label as HTMLElement).removeAttribute('style')
            })
          },
        },
        0,
      )
      .add(
        {
          targets: sidebarHideSlim,
          opacity: 0,
        },
        0,
      )

    // STAGE 2: Show Slim
    this.timelineStage2 = this.buildTimeline()
      .add({
        targets: sidebarIcons,
        opacity: [0, 1],
        translateX: [-config.sidebarSlimWidth, 0],
        delay: anime.stagger(config.animationStaggerDelay),
        begin: () => {
          sidebarElement.classList.add('sidebar--collapsed')
          sidebarElement.classList.remove('sidebar--animate-slim--progress')
          sidebarElement.removeAttribute('style')
          sidebarHideSlim.forEach((element) => {
            ;(element as HTMLElement).removeAttribute('style')
          })
        },
        complete: () => {
          sidebarIcons.forEach((icon) => {
            ;(icon as HTMLElement).removeAttribute('style')
          })
        },
      })
      .add(
        {
          targets: sidebarShowSlim,
          opacity: [0, 1],
          complete: () => {
            sidebarShowSlim.forEach((element) => {
              ;(element as HTMLElement).removeAttribute('style')
            })
          },
        },
        0,
      )

    // START: Chain both timelines
    this.timelineStage1.finished.then(() => {
      this.timelineStage2?.play()
    })
    this.timelineStage2.finished.then(() => {
      this.isAnimating = false
      sidebarElement.querySelectorAll('.sidebar__section').forEach((section) => {
        ;(section as HTMLElement).removeAttribute('style')
      })
      sidebarElement.classList.remove()
    })
    this.timelineStage1.play()
  }

  private animateToExpanded(
    sidebarElement: HTMLElement,
    layoutSidebarWrap: HTMLElement | null,
    sidebarMenu: HTMLElement | null,
    sidebarLabels: NodeListOf<Element>,
    sidebarIcons: NodeListOf<Element>,
    sidebarHideSlim: NodeListOf<Element>,
    sidebarShowSlim: NodeListOf<Element>,
    animationHalfTime: number,
  ): void {
    const { config } = this

    // Recover the slim classes so the animation can make the smooth transition
    sidebarElement.classList.add('sidebar--collapsed')
    sidebarMenu?.classList.add('sidebar-menu--slim')
    layoutSidebarWrap?.classList.add('layout__sidebar--slim')
    sidebarElement.classList.add('sidebar--animate-slim--progress')

    // STAGE 1: Hide Slim
    this.timelineStage1 = this.buildTimeline()
      .add({
        targets: sidebarIcons,
        translateX: -config.sidebarSlimWidth,
        duration: animationHalfTime,
        delay: anime.stagger(config.animationStaggerDelay),
        opacity: 0,
      })
      .add(
        {
          targets: sidebarShowSlim,
          duration: animationHalfTime,
          opacity: [1, 0],
        },
        0,
      )

    // STAGE 2: Show Default
    this.timelineStage2 = this.buildTimeline()
      .add({
        targets: sidebarElement,
        duration: 1,
        translateX: [0, 0],
        complete: () => {
          sidebarIcons.forEach((icon) => {
            ;(icon as HTMLElement).removeAttribute('style')
          })
          sidebarShowSlim.forEach((icon) => {
            ;(icon as HTMLElement).removeAttribute('style')
          })
          sidebarLabels.forEach((label) => {
            ;(label as HTMLElement).style.opacity = '0'
          })
          sidebarElement.classList.remove('sidebar--collapsed')
          sidebarMenu?.classList.remove('sidebar-menu--slim')
          sidebarElement.classList.remove('sidebar--animate-slim--progress')
        },
      })
      .add({
        targets: sidebarElement,
        duration: animationHalfTime,
        complete: () => {
          sidebarElement.removeAttribute('style')
        },
        translateX: [-(config.sidebarWidth - config.sidebarSlimWidth), 0],
      })
      .add(
        {
          targets: sidebarLabels,
          duration: animationHalfTime,
          opacity: [0, 1],
          complete: () => {
            sidebarLabels.forEach((label) => {
              ;(label as HTMLElement).removeAttribute('style')
            })
          },
        },
        0,
      )
      .add(
        {
          targets: sidebarHideSlim,
          duration: animationHalfTime,
          opacity: [0, 1],
          complete: () => {
            sidebarHideSlim.forEach((label) => {
              ;(label as HTMLElement).removeAttribute('style')
            })
          },
        },
        0,
      )

    // START: Chain both timelines
    this.timelineStage1.finished.then(() => {
      requestAnimationFrame(() => {
        this.timelineStage2?.play()
      })
    })
    this.timelineStage2.finished.then(() => {
      this.isAnimating = false
      sidebarElement.querySelectorAll('.sidebar__section').forEach((section) => {
        ;(section as HTMLElement).removeAttribute('style')
      })
      layoutSidebarWrap?.classList.remove('layout__sidebar--slim')
    })
    this.timelineStage1.play()
  }

  /**
   * Assigns the parent sidebar element, and attaches a Mutation Observer
   * which watches the collapsable nodes inside of the sidebar menu
   * and animates them on changes
   */
  assignParentElement(parentElement: HTMLElement): void {
    this._nodesObserver.disconnect()
    this._nodesObserver.observe(parentElement, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
      subtree: false,
    })
  }

  /**
   * Disconnects the observer
   */
  destroy(): void {
    this._nodesObserver.disconnect()
  }
}
