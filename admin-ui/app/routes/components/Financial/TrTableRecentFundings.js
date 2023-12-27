import React from 'react'
import times from 'lodash/times'
import { useTranslation } from 'react-i18next'

const TrTableRecentFundings = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      {
        times(6, (index) => (
          <tr key={ index }>
            <td className="align-middle">
              <span className="text-inverse">{ 'faker.company.companyName()' }</span>
            </td>
            <td className="align-middle">
              ${ 'faker.commerce.price()' }
            </td>
            <td className="align-middle text-nowrap">
              20-02-2015
            </td>
            <td className="align-middle text-end text-nowrap">
              <a href="#" className="text-decoration-none">{t("View")} <i className="fa fa-angle-right"></i></a>
            </td>
          </tr>
        ))
      }
    </React.Fragment>
  )
}

export { TrTableRecentFundings }
