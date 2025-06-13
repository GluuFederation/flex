function GluuViewWrapper(props: any) {
  return props.canShow ? (
    <div data-testid="WRAPPER">{props.children}</div>
  ) : (
    <div data-testid="MISSING">Missing required permission</div>
  )
}

export default GluuViewWrapper
