import { takeEvery as sagaTakeEvery, takeLatest as sagaTakeLatest } from 'redux-saga/effects'
import type { ActionPattern, ForkEffect } from 'redux-saga/effects'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

type BaseAction = { type: string; payload?: JsonValue | Record<string, JsonValue | undefined> }

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
