import React from 'react'
import times from 'lodash/times'
import { randomArray } from './../../../utilities'
import {
  Badge
} from 'Components'
import { useTranslation } from 'react-i18next'

const name = [
  "Action Score",
  "Quality Score",
  "Value Score",
  "Growth Score"
]
const badge = [
  "a",
  "q",
  "v",
  "g"
]
const value = [
  "23",
  "67",
  "12",
  "89",
  "11",
  "10",
  "43",
  "98"
]

const TrTableFavStock = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      {
        times(5, (index) => (
          <tr key={ index }>
            <td className="align-middle">
              {t(randomArray(name))}
            </td>
            <td className="align-middle">
              <Badge pill className="text-uppercase me-1"> { randomArray(badge) } </Badge> <span className="text-inverse">{ randomArray(value) }</span>
            </td>
            <td className="align-middle">
              <Badge pill className="text-uppercase me-1"> { randomArray(badge) } </Badge> <span className="text-inverse">{ randomArray(value) }</span>
            </td>
            <td className="align-middle">
              <Badge pill className="text-uppercase me-1"> { randomArray(badge) } </Badge> <span className="text-inverse">{ randomArray(value) }</span>
            </td>
            <td className="align-middle">
              <Badge pill className="text-uppercase me-1"> { randomArray(badge) } </Badge> <span className="text-inverse">{ randomArray(value) }</span>
            </td>
            <td className="align-middle">
              <Badge pill className="text-uppercase me-1"> { randomArray(badge) } </Badge> <span className="text-inverse">{ randomArray(value) }</span>
            </td>
            <td className="align-middle">
              <Badge pill className="text-uppercase me-1"> { randomArray(badge) } </Badge> <span className="text-inverse">{ randomArray(value) }</span>
            </td>
          </tr>
        ))
      }
    </React.Fragment>)
}

export { TrTableFavStock }
