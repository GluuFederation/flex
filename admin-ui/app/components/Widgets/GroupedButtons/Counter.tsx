import React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import customColors from '@/customColors'

interface CounterProps {
  disabled: boolean
  counter?: number
  onCounterChange: (value: number) => void
}

interface CounterState {
  disabled: boolean
  counter: number
}

class Counter extends React.Component<CounterProps, CounterState> {
  state: CounterState = {
    disabled: this.props.disabled,
    counter: this.props.counter ? this.props.counter : 0,
  }

  handleIncrement = async () => {
    await this.setState((state) => ({ counter: state.counter + 1 }))
    await this.props.onCounterChange(this.state.counter)
  }

  handleDecrement = async () => {
    await this.setState((state) => ({ counter: state.counter - 1 }))
    await this.props.onCounterChange(this.state.counter)
  }

  render() {
    const displayCounter = this.state.counter > 0

    return (
      <ButtonGroup
        disabled={this.state.disabled}
        size="small"
        aria-label="small outlined button group"
      >
        <Button
          style={{
            color: customColors.lightBlue,
            border: `1px solid ${customColors.lightBlue}`,
          }}
          onClick={this.handleIncrement}
        >
          +
        </Button>
        {displayCounter && <Button disabled>{this.state.counter}</Button>}
        {displayCounter && (
          <Button
            style={{
              color: customColors.lightBlue,
              border: `1px solid ${customColors.lightBlue}`,
            }}
            onClick={this.handleDecrement}
          >
            -
          </Button>
        )}
      </ButtonGroup>
    )
  }
}

export default Counter
