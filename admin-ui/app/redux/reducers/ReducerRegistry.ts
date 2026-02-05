import type { Reducer, UnknownAction } from '@reduxjs/toolkit'

type ReducerMap = Record<string, Reducer<unknown, UnknownAction>>
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
