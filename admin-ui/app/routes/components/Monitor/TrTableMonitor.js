import React from 'react'
import times from 'lodash/times'

import { 
  Badge,
  Progress
} from 'Components'
import { useTranslation } from 'react-i18next'

/*eslint-disable */
const status = [
    <td className="text-end">
        Healthly <i className="fa fa-fw fa-check-circle text-success"></i>
    </td>,
    <td className="text-end">
        Degraded <i className="fa fa-fw fa-exclamation-circle text-danger"></i>
    </td>
];
/*eslint-enable */
/*eslint-disable */
const tasksCompleted = [
    "25",
    "50",
    "70",
    "90"
];
/*eslint-enable */

const TrTableMonitor = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      {
        times(14, (index) => (
          <tr key={ index } className="text-nowrap">
            <td className="align-middle">
              <span className="text-inverse">HDD1</span> <span className="small">(ada0)</span>
            </td>
            <td className="align-middle">
              {t("Mirror")} <Badge color="secondary" pill className="ms-2">/mtn/volume1</Badge>
            </td>
            <td className="align-middle">
              <Progress value={ tasksCompleted[index%4] } style={{ height: "5px" }} />
            </td>
            <td>
              <span className="text-inverse">7.3.5 TiB</span> / 9.3.1 TiB
            </td>
            { status[index%2] }
          </tr>
        ))
      }
    </React.Fragment>
  )
}

export { TrTableMonitor }
