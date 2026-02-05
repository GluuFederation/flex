import type { Reducer, UnknownAction } from '@reduxjs/toolkit'

// Looser type than redux/types ReducerMap: plugin keys are dynamic, not limited to keyof RootState.
type InternalReducerMap = Record<string, Reducer<unknown, UnknownAction>>
type ChangeListener = (reducers: InternalReducerMap) => void

class ReducerRegistry {
  private _emitChange: ChangeListener | null
  private _reducers: InternalReducerMap

  constructor() {
    this._emitChange = null
    this._reducers = {}
  }

  getReducers(): InternalReducerMap {
    return { ...this._reducers }
  }

  register<S>(name: string, reducer: Reducer<S, UnknownAction>): void {
    this._reducers = {
      ...this._reducers,
      [name]: reducer as Reducer<unknown, UnknownAction>,
    }
    if (this._emitChange) {
      this._emitChange(this.getReducers())
    }
  }

  setChangeListener(listener: ChangeListener): void {
    this._emitChange = listener
  }

  hasReducer(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this._reducers, name)
  }

  getReducer(name: string): Reducer<unknown, UnknownAction> | undefined {
    return this._reducers[name]
  }
}

const reducerRegistry = new ReducerRegistry()
export default reducerRegistry
