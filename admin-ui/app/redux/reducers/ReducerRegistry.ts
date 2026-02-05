// Reducer Registry - manages dynamic reducer registration for plugins

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReducer = (state: any, action: any) => any
type ReducerMap = { [key: string]: AnyReducer }
type ChangeListener = (reducers: ReducerMap) => void

class ReducerRegistry {
  private _emitChange: ChangeListener | null
  private _reducers: ReducerMap

  constructor() {
    this._emitChange = null
    this._reducers = {}
  }

  getReducers(): ReducerMap {
    return { ...this._reducers }
  }

  register(name: string, reducer: AnyReducer): void {
    this._reducers = { ...this._reducers, [name]: reducer }
    if (this._emitChange) {
      this._emitChange(this.getReducers())
    }
  }

  setChangeListener(listener: ChangeListener): void {
    this._emitChange = listener
  }

  hasReducer(name: string): boolean {
    return name in this._reducers
  }

  getReducer(name: string): AnyReducer | undefined {
    return this._reducers[name]
  }
}

const reducerRegistry = new ReducerRegistry()
export default reducerRegistry
