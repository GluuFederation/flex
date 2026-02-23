import { takeEvery as sagaTakeEvery, takeLatest as sagaTakeLatest } from 'redux-saga/effects'
import type { ActionPattern, ForkEffect } from 'redux-saga/effects'

/** Base Redux action shape – workers receive the matched action */
type BaseAction = { type: string; payload?: unknown }

export function takeEvery<A extends BaseAction = BaseAction>(
  pattern: string,
  worker: (action: A) => Generator | void,
): ForkEffect<never> {
  return sagaTakeEvery(pattern as ActionPattern, worker as (action: BaseAction) => void)
}

export function takeLatest<A extends BaseAction = BaseAction>(
  pattern: string,
  worker: (action: A) => Generator | void,
): ForkEffect<never> {
  return sagaTakeLatest(pattern as ActionPattern, worker as (action: BaseAction) => void)
}
