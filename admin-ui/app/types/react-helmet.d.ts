declare module 'react-helmet' {
  import { ComponentType, HelmetData } from 'react-helmet'

  interface HelmetProps {
    title?: string
    titleTemplate?: string
    defaultTitle?: string
    meta?: Array<{ name?: string; property?: string; content: string; httpEquiv?: string }>
    link?: Array<{ rel?: string; href?: string; type?: string }>
    script?: Array<{ src?: string; type?: string; innerHTML?: string }>
    style?: Array<{ type?: string; cssText?: string }>
    htmlAttributes?: { [key: string]: any }
    bodyAttributes?: { [key: string]: any }
    children?: React.ReactNode
  }

  const Helmet: ComponentType<HelmetProps>
  export default Helmet
  export { HelmetData }
}
