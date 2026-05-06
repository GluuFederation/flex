type HotAcceptCallback<TModule extends object = object> = (module: TModule | undefined) => void

export const hmrAccept = <TModule extends object = object>(
  dep: string,
  callback: HotAcceptCallback<TModule>,
): void => {
  if (import.meta.hot) {
    import.meta.hot.accept(dep, callback)
  }
}
