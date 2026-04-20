export type SlimSidebarAnimateOptions = {
  sidebarWidth?: number
  sidebarSlimWidth?: number
  animationDuration?: number
  animationStaggerDelay?: number
  animationEasing?: string
}

export type SlimSidebarAnimateInstance = {
  assignParentElement(parentElement: HTMLElement): void
  destroy(): void
}
