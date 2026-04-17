import anime from 'animejs'
import type { SlimSidebarAnimateInstance, SlimSidebarAnimateOptions } from './types'

const DEFAULT_CONFIG: Required<SlimSidebarAnimateOptions> = {
  sidebarWidth: 250,
  sidebarSlimWidth: 60,
  animationDuration: 400,
  animationStaggerDelay: 10,
  animationEasing: 'easeInQuad',
}

const noop = (): void => {}

const removeStyle = (el: HTMLElement): void => {
  el.removeAttribute('style')
}

const createSlimSidebarAnimate = (
  options?: SlimSidebarAnimateOptions,
): SlimSidebarAnimateInstance => {
  const config: Required<SlimSidebarAnimateOptions> = { ...DEFAULT_CONFIG, ...options }

  let timelineStage1: anime.AnimeTimelineInstance | null = null
  let timelineStage2: anime.AnimeTimelineInstance | null = null
  let isAnimating = false

  const buildTimeline = (beginCallback?: () => void): anime.AnimeTimelineInstance =>
    anime.timeline({
      easing: config.animationEasing,
      duration: config.animationDuration / 2,
      autoplay: false,
      begin: beginCallback ?? noop,
    })

  const handleMutation = (mutations: MutationRecord[]): void => {
    const mutation = mutations[0]
    const animationHalfTime = config.animationDuration / 2
    const sidebarElement = mutation.target as HTMLElement
    const layoutSidebarWrap = sidebarElement.closest('.layout__sidebar') as HTMLElement | null
    const sidebarMenu = sidebarElement.querySelector('.sidebar-menu') as HTMLElement | null
    const sidebarLabels = sidebarElement.querySelectorAll<HTMLElement>(
      '.sidebar-menu__entry__link > span, .sidebar-submenu__entry__link > span',
    )
    const sidebarIcons = sidebarElement.querySelectorAll<HTMLElement>('.sidebar-menu__entry__icon')
    const sidebarHideSlim = sidebarElement.querySelectorAll<HTMLElement>('.sidebar__hide-slim')
    const sidebarShowSlim = sidebarElement.querySelectorAll<HTMLElement>('.sidebar__show-slim')

    const isSidebarSlim = sidebarElement.classList.contains('sidebar--slim')
    const isSidebarCollapsed = sidebarElement.classList.contains('sidebar--collapsed')
    const lastSidebarSlim = (mutation.oldValue ?? '').indexOf('sidebar--slim') >= 0
    const lastSidebarCollapsed = (mutation.oldValue ?? '').indexOf('sidebar--collapsed') >= 0

    if (timelineStage1 && !timelineStage1.paused) {
      timelineStage1.seek(timelineStage1.duration)
    }
    if (timelineStage2 && !timelineStage2.paused) {
      timelineStage2.seek(timelineStage2.duration)
    }

    if (
      (isSidebarSlim || lastSidebarSlim) &&
      isSidebarCollapsed !== lastSidebarCollapsed &&
      !isAnimating
    ) {
      isAnimating = true

      if (isSidebarCollapsed) {
        animateToCollapsed(
          sidebarElement,
          sidebarLabels,
          sidebarIcons,
          sidebarHideSlim,
          sidebarShowSlim,
        )
      } else {
        animateToExpanded(
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

  const animateToCollapsed = (
    sidebarElement: HTMLElement,
    sidebarLabels: NodeListOf<HTMLElement>,
    sidebarIcons: NodeListOf<HTMLElement>,
    sidebarHideSlim: NodeListOf<HTMLElement>,
    sidebarShowSlim: NodeListOf<HTMLElement>,
  ): void => {
    sidebarElement.classList.remove('sidebar--collapsed')

    const onBeginStage1 = (): void => {
      sidebarElement.classList.add('sidebar--animate-slim--progress')
    }

    const onCompleteLabels = (): void => {
      sidebarLabels.forEach(removeStyle)
    }

    const onBeginStage2 = (): void => {
      sidebarElement.classList.add('sidebar--collapsed')
      sidebarElement.classList.remove('sidebar--animate-slim--progress')
      sidebarElement.removeAttribute('style')
      sidebarHideSlim.forEach(removeStyle)
    }

    const onCompleteIcons = (): void => {
      sidebarIcons.forEach(removeStyle)
    }

    const onCompleteShowSlim = (): void => {
      sidebarShowSlim.forEach(removeStyle)
    }

    const onStage1Finished = (): void => {
      timelineStage2?.play()
    }

    const onStage2Finished = (): void => {
      isAnimating = false
      sidebarElement.querySelectorAll<HTMLElement>('.sidebar__section').forEach(removeStyle)
    }

    timelineStage1 = buildTimeline()
      .add({
        targets: sidebarElement,
        translateX: -(config.sidebarWidth - config.sidebarSlimWidth),
        begin: onBeginStage1,
      })
      .add({ targets: sidebarLabels, opacity: 0, complete: onCompleteLabels }, 0)
      .add({ targets: sidebarHideSlim, opacity: 0 }, 0)

    timelineStage2 = buildTimeline()
      .add({
        targets: sidebarIcons,
        opacity: [0, 1],
        translateX: [-config.sidebarSlimWidth, 0],
        delay: anime.stagger(config.animationStaggerDelay),
        begin: onBeginStage2,
        complete: onCompleteIcons,
      })
      .add({ targets: sidebarShowSlim, opacity: [0, 1], complete: onCompleteShowSlim }, 0)

    timelineStage1.finished.then(onStage1Finished)
    timelineStage2.finished.then(onStage2Finished)
    timelineStage1.play()
  }

  const animateToExpanded = (
    sidebarElement: HTMLElement,
    layoutSidebarWrap: HTMLElement | null,
    sidebarMenu: HTMLElement | null,
    sidebarLabels: NodeListOf<HTMLElement>,
    sidebarIcons: NodeListOf<HTMLElement>,
    sidebarHideSlim: NodeListOf<HTMLElement>,
    sidebarShowSlim: NodeListOf<HTMLElement>,
    animationHalfTime: number,
  ): void => {
    sidebarElement.classList.add('sidebar--collapsed')
    sidebarMenu?.classList.add('sidebar-menu--slim')
    layoutSidebarWrap?.classList.add('layout__sidebar--slim')
    sidebarElement.classList.add('sidebar--animate-slim--progress')

    const onCompleteTransitionIn = (): void => {
      sidebarIcons.forEach(removeStyle)
      sidebarShowSlim.forEach(removeStyle)
      sidebarLabels.forEach((label: HTMLElement) => {
        label.style.opacity = '0'
      })
      sidebarElement.classList.remove('sidebar--collapsed')
      sidebarMenu?.classList.remove('sidebar-menu--slim')
      sidebarElement.classList.remove('sidebar--animate-slim--progress')
    }

    const onCompleteSidebarExpand = (): void => {
      sidebarElement.removeAttribute('style')
    }

    const onCompleteLabels = (): void => {
      sidebarLabels.forEach(removeStyle)
    }

    const onCompleteHideSlim = (): void => {
      sidebarHideSlim.forEach(removeStyle)
    }

    const onStage1Finished = (): void => {
      requestAnimationFrame((): void => {
        timelineStage2?.play()
      })
    }

    const onStage2Finished = (): void => {
      isAnimating = false
      sidebarElement.querySelectorAll<HTMLElement>('.sidebar__section').forEach(removeStyle)
      layoutSidebarWrap?.classList.remove('layout__sidebar--slim')
    }

    timelineStage1 = buildTimeline()
      .add({
        targets: sidebarIcons,
        translateX: -config.sidebarSlimWidth,
        duration: animationHalfTime,
        delay: anime.stagger(config.animationStaggerDelay),
        opacity: 0,
      })
      .add({ targets: sidebarShowSlim, duration: animationHalfTime, opacity: [1, 0] }, 0)

    timelineStage2 = buildTimeline()
      .add({
        targets: sidebarElement,
        duration: 1,
        translateX: [0, 0],
        complete: onCompleteTransitionIn,
      })
      .add({
        targets: sidebarElement,
        duration: animationHalfTime,
        translateX: [-(config.sidebarWidth - config.sidebarSlimWidth), 0],
        complete: onCompleteSidebarExpand,
      })
      .add(
        {
          targets: sidebarLabels,
          duration: animationHalfTime,
          opacity: [0, 1],
          complete: onCompleteLabels,
        },
        0,
      )
      .add(
        {
          targets: sidebarHideSlim,
          duration: animationHalfTime,
          opacity: [0, 1],
          complete: onCompleteHideSlim,
        },
        0,
      )

    timelineStage1.finished.then(onStage1Finished)
    timelineStage2.finished.then(onStage2Finished)
    timelineStage1.play()
  }

  const nodesObserver = new MutationObserver(handleMutation)

  const assignParentElement = (parentElement: HTMLElement): void => {
    nodesObserver.disconnect()
    nodesObserver.observe(parentElement, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
      subtree: false,
    })
  }

  const destroy = (): void => {
    timelineStage1?.pause()
    timelineStage2?.pause()
    nodesObserver.disconnect()
  }

  return { assignParentElement, destroy }
}

export default createSlimSidebarAnimate
