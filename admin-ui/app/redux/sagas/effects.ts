import { takeEvery as sagaTakeEvery, takeLatest as sagaTakeLatest } from 'redux-saga/effects'
import type { ActionPattern, ForkEffect } from 'redux-saga/effects'

type BaseAction = { type: string; payload?: unknown }

export const takeEvery = <A extends BaseAction = BaseAction>(
  pattern: string,
  worker: (action: A) => Generator | void,
): ForkEffect<never> =>
  sagaTakeEvery(pattern as ActionPattern, worker as (action: BaseAction) => void)

export const takeLatest = <A extends BaseAction = BaseAction>(
  pattern: string,
  worker: (action: A) => Generator | void,
): ForkEffect<never> =>
  sagaTakeLatest(pattern as ActionPattern, worker as (action: BaseAction) => void)
