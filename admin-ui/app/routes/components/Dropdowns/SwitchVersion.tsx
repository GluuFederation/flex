import { DropdownMenu, DropdownItem } from 'Components'
import { useTranslation } from 'react-i18next'

const SwitchVersion = () => {
  const { t } = useTranslation()
  return (
    <DropdownMenu>
      <DropdownItem header>Bootstrap 4 Versions:</DropdownItem>
      <DropdownItem href="https://jquery.bs4.webkom.co" className="d-flex">
        <span>
          Jquery 2.0
          <br />
          <span className="small">Sun, Jun 12, 2018 4:43:12 PM</span>
        </span>
        <i className="fa fa-fw ms-auto align-self-center ps-2" />
      </DropdownItem>
      <DropdownItem href="https://react.bs4.webkom.co" active className="d-flex">
        <span>
          React 2.0
          <br />
          <span className="small">Sun, Jun 12, 2018 4:43:12 PM</span>
        </span>
        <i className="fa fa-fw fa-check ms-auto align-self-center ps-4" />
      </DropdownItem>
      <DropdownItem href="https://angular.bs4.webkom.co" className="d-flex">
        <span>
          Angular 1.0
          <br />
          <span className="small">Sun, Jun 12, 2018 4:43:12 PM</span>
        </span>
        <i className="fa fa-fw ms-auto align-self-center ps-2" />
      </DropdownItem>
      <DropdownItem href="https://vue.bs4.webkom.co" className="d-flex">
        <span>
          Vue 1.0.0
          <br />
          <span className="small">Sun, Jun 12, 2018 4:43:12 PM</span>
        </span>
        <i className="fa fa-fw ms-auto align-self-center ps-2" />
      </DropdownItem>
    </DropdownMenu>
  )
}

export { SwitchVersion }
