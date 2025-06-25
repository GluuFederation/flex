import React from 'react'
import fetch from 'node-fetch'
import classNames from 'classnames'
import { filter, find, isEmpty, map } from 'lodash'
import moment from 'moment'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'Components'

const SERVICE_URL = 'https://dashboards.webkom.co:8000'

// Define the type for a version object
interface Version {
  dashboardName: string
  version: string
  label: string
  date: string
  demoUrl: string
}

// Define the props for the component
interface VersionSelectorProps {
  dashboard?: string
  down?: boolean
  compact?: boolean
  render?: (currentVersion: Version) => React.ReactNode
  className?: string
  sidebar?: boolean
}

// Define the state for the component
interface VersionSelectorState {
  versions: Version[]
  isError: boolean
}

export class VersionSelector extends React.Component<VersionSelectorProps, VersionSelectorState> {
  constructor(props: VersionSelectorProps) {
    super(props)
    this.state = {
      versions: [],
      isError: false,
    }
  }

  async fetchVersions() {
    const { dashboard } = this.props
    let versions: Version[] = []
    try {
      const response = await fetch(`${SERVICE_URL}/dashboards/versions`)
      const data = await response.json()
      versions = data as Version[]
    } catch (exc) {
      console.error('Error fetching versions', exc)
      this.setState({ isError: true })
    }
    const targetVersions = filter(versions, { dashboardName: dashboard })
    this.setState({ versions: targetVersions })
  }

  componentDidMount() {
    this.fetchVersions()
  }

  componentDidUpdate(prevProps: VersionSelectorProps) {
    if (prevProps.dashboard !== this.props.dashboard) {
      this.fetchVersions()
    }
  }

  render() {
    const { down, render, className, sidebar } = this.props
    const { versions } = this.state
    const currentVersion = find(versions, { label: 'React' })

    return (
      <UncontrolledButtonDropdown direction={down ? 'down' : 'up'} className={className}>
        <DropdownToggle
          disabled={isEmpty(versions)}
          tag="button"
          type="button"
          className={classNames('btn-switch-version', {
            sidebar__link: sidebar,
          })}
        >
          {currentVersion ? (
            render ? (
              render(currentVersion)
            ) : (
              <React.Fragment>
                React {currentVersion.version}{' '}
                <i className={`fa ${down ? 'fa-angle-down' : 'fa-angle-up'} ms-2`}></i>
                <br />
                <span className={classNames('small', { 'sidebar__link--muted': sidebar })}>
                  {moment(currentVersion.date).format('ddd, MMM DD, YYYY h:mm:ss A')}
                </span>
              </React.Fragment>
            )
          ) : (
            <span>Loading...</span>
          )}
        </DropdownToggle>
        {!isEmpty(versions) && (
          <DropdownMenu>
            <DropdownItem header>Bootstrap 4 Versions:</DropdownItem>
            {map(versions, (version, index) => (
              <DropdownItem
                key={index}
                href={version.demoUrl}
                className="d-flex"
                active={version === currentVersion}
              >
                <span>
                  {version.label} {version.version}
                  <br />
                  <span className="small">
                    {moment(version.date).format('ddd, MMM DD, YYYY h:mm:ss A')}
                  </span>
                </span>
                {version === currentVersion && (
                  <i className="fa fa-fw fa-check text-success ms-auto align-self-center ps-3" />
                )}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </UncontrolledButtonDropdown>
    )
  }
}
