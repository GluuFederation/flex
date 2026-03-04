import React, { memo, useCallback } from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { useStyles } from './styles/Counter.style'

interface CounterProps {
  disabled: boolean
  counter?: number
  onCounterChange: (value: number) => void
}

const Counter: React.FC<CounterProps> = ({ disabled, counter = 0, onCounterChange }) => {
  const { classes } = useStyles()

  const handleDecrement = useCallback(() => {
    onCounterChange(counter - 1)
  }, [counter, onCounterChange])

  const handleIncrement = useCallback(() => {
    onCounterChange(counter + 1)
  }, [counter, onCounterChange])

  return (
    <ButtonGroup size="small" aria-label="counter buttons">
      {counter > 0 && (
        <Button
          className={classes.stepButton}
          onClick={disabled ? undefined : handleDecrement}
          aria-label="decrement"
        >
          -
        </Button>
      )}
      {counter > 0 && (
        <Button disabled className={classes.valueButton}>
          {counter}
        </Button>
      )}
      <Button
        className={classes.stepButton}
        onClick={disabled ? undefined : handleIncrement}
        aria-label="increment"
      >
        +
      </Button>
    </ButtonGroup>
  )
}

export default memo(Counter)
