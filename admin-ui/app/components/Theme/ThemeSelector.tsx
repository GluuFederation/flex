import React from 'react'
import map from 'lodash/map'
import classNames from 'classnames'
import { Card, CardBody, Button, FormGroup, Input as CustomInput } from 'reactstrap'

import 'Styles/components/theme-selector.scss'
import { Consumer } from './ThemeContext'
import customColors from '@/customColors'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'

interface ThemeOption {
  name: string
  value: string
}
interface ThemeState {
  style: string
  color: string
}

interface ThemeSelectorProps {
  style: string
  color: string
  styleOptions?: ThemeOption[]
  styleDisabled?: boolean
  colorOptions?: ThemeOption[]
  onChangeTheme?: (theme: Partial<{ color: string; style: string }>) => void
}

interface ThemeSelectorState {
  isActive: boolean
  initialStyle: string
  initialColor: string
}

class ThemeSelector extends React.Component<ThemeSelectorProps, ThemeSelectorState> {
  static defaultProps = {
    styleOptions: [
      { name: THEME_LIGHT.toUpperCase(), value: THEME_LIGHT },
      { name: THEME_DARK.toUpperCase(), value: THEME_DARK },
      { name: 'Color', value: 'color' },
    ],
    colorOptions: [
      { name: 'Primary', value: customColors.logo },
      { name: 'Success', value: 'success' },
      { name: 'Info', value: 'info' },
      { name: 'Danger', value: 'danger' },
      { name: 'Warning', value: 'warning' },
      { name: 'Indigo', value: 'indigo' },
      { name: 'Purple', value: 'purple' },
      { name: 'Pink', value: 'pink' },
      { name: 'Yellow', value: 'yellow' },
    ],
  }

  constructor(props: ThemeSelectorProps) {
    super(props)
    this.state = {
      isActive: false,
      initialStyle: '',
      initialColor: '',
    }
  }

  componentDidMount() {
    this.setState({
      initialColor: this.props.color,
      initialStyle: this.props.style,
    })
  }

  render() {
    const rootClass = classNames('theme-config', {
      'theme-config--active': this.state.isActive,
    })

    return (
      <div className={rootClass}>
        <Button
          color="primary"
          className="theme-config__trigger"
          onClick={() => {
            this.setState({ isActive: !this.state.isActive })
          }}
        >
          <i className="fa fa-paint-brush fa-fw"></i>
        </Button>
        <Card className="theme-config__body">
          <CardBody>
            <h6 className="text-center mb-3">Configurator</h6>

            <FormGroup>
              <span className="h6 small mb-2 d-block">Nav Color</span>
              {map(this.props.colorOptions, (option: ThemeOption, index: number) => (
                <CustomInput
                  key={index}
                  type="radio"
                  name="sidebarColor"
                  id={`sidebarStyle--${option.value}`}
                  value={option.value}
                  checked={this.props.color === option.value}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    if (ev.target.checked && this.props.onChangeTheme) {
                      this.props.onChangeTheme({
                        color: option.value,
                      })
                    }
                  }}
                  label={
                    <span className="d-flex align-items-center">
                      {option.name}
                      <i className={`fa fa-circle ms-auto text-${option.value}`} />
                    </span>
                  }
                />
              ))}
            </FormGroup>
            <FormGroup>
              <span className="h6 small mb-2 d-block">Nav Style</span>
              {map(this.props.styleOptions, (option: ThemeOption, index: number) => (
                <CustomInput
                  key={index}
                  type="radio"
                  name="sidebarStyle"
                  id={`sidebarStyle--${option.value}`}
                  value={option.value}
                  disabled={this.props.styleDisabled}
                  checked={this.props.style === option.value}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    if (ev.target.checked && this.props.onChangeTheme) {
                      this.props.onChangeTheme({
                        style: option.value,
                      })
                    }
                  }}
                  label={option.name}
                />
              ))}
            </FormGroup>
            <FormGroup className="mb-0">
              <Button
                color="secondary"
                outline
                className="d-block w-100"
                onClick={() => {
                  if (this.props.onChangeTheme) {
                    this.props.onChangeTheme({
                      color: this.state.initialColor,
                      style: this.state.initialStyle,
                    })
                  }
                }}
              >
                Reset Options
              </Button>
            </FormGroup>
          </CardBody>
        </Card>
      </div>
    )
  }
}

const ContextThemeSelector: React.FC<Partial<ThemeSelectorProps>> = (props) => (
  <Consumer>{(themeState: ThemeState) => <ThemeSelector {...themeState} {...props} />}</Consumer>
)

export { ContextThemeSelector as ThemeSelector }
