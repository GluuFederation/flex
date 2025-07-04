// @ts-nocheck
import React from 'react'

import { Badge, UncontrolledTooltip } from 'Components'

const TrBorderless = () => {
  return (
    <React.Fragment>
      {/* START TR */}
      <tr>
        <td className="align-middle">
          <i className="fa fa-fw fa-check text-success"></i>
        </td>
        <td className="align-middle">
          <samp>{'faker.random.number()'}</samp>
        </td>
        <td className="align-middle">
          {'faker.date.weekday()'}, 12 {'faker.date.month()'}, 2018
        </td>
        <td className="align-middle text-inverse">$ {'faker.finance.amount()'}</td>
        <td className="align-middle">
          <Badge color="primary">{'Premium'}</Badge>
        </td>
        <td className="align-middle">
          <i className="fa fa-fw fa-paypal text-primary me-2"></i>
          {'faker.internet.email()'}
        </td>
        <td className="align-middle text-end">
          <a href="#" id="UncontrolledTooltipDownload">
            <i className="fa fa-fw fa-download text-primary"></i>
          </a>
          <UncontrolledTooltip placement="left" target="UncontrolledTooltipDownload">
            Download
          </UncontrolledTooltip>
        </td>
      </tr>
      {/* END TR */}
    </React.Fragment>
  )
}

export { TrBorderless }
