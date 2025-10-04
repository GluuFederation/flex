declare module 'react-grid-layout' {
  import { ComponentType } from 'react'

  interface GridLayoutProps {
    className?: string
    style?: React.CSSProperties
    width?: number
    autoSize?: boolean
    cols?: number
    draggableCancel?: string
    draggableHandle?: string
    verticalCompact?: boolean
    compactType?: 'vertical' | 'horizontal' | null
    layout?: any[]
    margin?: [number, number]
    containerPadding?: [number, number]
    rowHeight?: number
    maxRows?: number
    isDraggable?: boolean
    isResizable?: boolean
    isBounded?: boolean
    useCSSTransforms?: boolean
    transformScale?: number
    allowOverlap?: boolean
    preventCollision?: boolean
    isDroppable?: boolean
    resizeHandles?: string[]
    resizeHandle?: React.ComponentType<any> | React.ReactElement | null
    onLayoutChange?: (layout: any[]) => void
    onDragStart?: (
      layout: any[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: MouseEvent,
      element: HTMLElement,
    ) => void
    onDrag?: (
      layout: any[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: MouseEvent,
      element: HTMLElement,
    ) => void
    onDragStop?: (
      layout: any[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: MouseEvent,
      element: HTMLElement,
    ) => void
    onResizeStart?: (
      layout: any[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: MouseEvent,
      element: HTMLElement,
    ) => void
    onResize?: (
      layout: any[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: MouseEvent,
      element: HTMLElement,
    ) => void
    onResizeStop?: (
      layout: any[],
      oldItem: any,
      newItem: any,
      placeholder: any,
      e: MouseEvent,
      element: HTMLElement,
    ) => void
    onDrop?: (layout: any[], layoutItem: any, e: Event) => void
    children?: React.ReactNode
  }

  const Responsive: ComponentType<GridLayoutProps & { breakpoints?: any; responsiveCols?: any }>
  const ResponsiveGridLayout: ComponentType<
    GridLayoutProps & { breakpoints?: any; responsiveCols?: any }
  >
  const GridLayout: ComponentType<GridLayoutProps>

  export default GridLayout
  export { Responsive, ResponsiveGridLayout, GridLayout }
}
