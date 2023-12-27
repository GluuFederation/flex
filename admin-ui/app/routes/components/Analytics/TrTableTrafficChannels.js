import React from 'react'
import times from 'lodash/times'

import { randomArray } from './../../../utilities'

import {
  TinyAreaChart
} from "./TinyAreaChart"

const channel = [
  "Organic Search",
  "Display",
  "Direct",
  "Paid Search"
]

const change = [
  "75,0% ",
  "34,4% ",
  "12,9%",
  "23,0%"
]

const TrTableTrafficChannels = () => (
  <React.Fragment>
    {
      times(5, (index) => (
        <tr key={ index }>
          <td className="align-middle text-inverse">
            { randomArray(channel) }
          </td>
          <td className="text-inverse align-middle">
            { 'faker.finance.amount()' }
          </td>
          <td className="align-middle">
            { 'faker.finance.amount()' }
          </td>
          <td className="align-middle text-end">
            { randomArray(change) } <i className="fa fa-caret-down text-danger ms-1"></i>
          </td>
          <td className="text-end align-middle">
            <TinyAreaChart />
          </td>
        </tr>
      ))
    }
  </React.Fragment>
)

export { TrTableTrafficChannels }
