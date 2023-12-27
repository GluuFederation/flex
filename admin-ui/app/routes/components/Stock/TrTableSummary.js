import React from 'react'
import times from 'lodash/times'
import { randomArray } from './../../../utilities'

const name = [
  "PE",
  "CROIC",
  "Magic Y",
  "EV/EBITDA",
  "P/FCF",
  "ROA"
]

const tr2013 = [
  "33*4%",
  "10*4",
  "2*5"
]

const ttm = [
  "28*3%",
  "16*5"
]

const TrTableSummary = () => (
  <React.Fragment>
    {
      times(9, (index) => (
        <tr key={ index }>
          <td className="align-middle text-inverse">
            { randomArray(name) }
          </td>
          <td className="align-middle text-end">
            { randomArray(tr2013) }
          </td>
          <td className="align-middle text-end">
            { randomArray(tr2013) }
          </td>
          <td className="align-middle text-end">
            { randomArray(ttm) }
          </td>
        </tr>
      ))
    }
  </React.Fragment>
)

export { TrTableSummary }
