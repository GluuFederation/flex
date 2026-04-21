import type { Reducer, UnknownAction } from '@reduxjs/toolkit'
import type { ReducerMap, ReducerChangeListener } from '../types'

class ReducerRegistry {
  private _emitChange: ReducerChangeListener | null
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
      [name]: reducer as ReducerMap[keyof ReducerMap],
    }
    if (this._emitChange) {
      this._emitChange(this.getReducers())
    }
  }

  setChangeListener(listener: ReducerChangeListener): void {
    this._emitChange = listener
  }

  hasReducer(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this._reducers, name)
  }

  getReducer<K extends keyof ReducerMap>(name: K): ReducerMap[K] {
    return this._reducers[name]
  }
}

const reducerRegistry = new ReducerRegistry()
export default reducerRegistry
