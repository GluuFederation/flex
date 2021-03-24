import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

class Counter extends React.Component {
  state = { counter: !!this.props.counter ?  this.props.counter : 0 };

  handleIncrement = async () => {
    await this.setState(state => ({ counter: state.counter + 1 }));
    await this.props.onCounterChange(this.state.counter);
  };

  handleDecrement = async () => {
    await this.setState(state => ({ counter: state.counter - 1 }));
    await this.props.onCounterChange(this.state.counter);
  };
  render() {
    const displayCounter = this.state.counter > 0;

    return (
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button onClick={this.handleIncrement}>+</Button>
        {displayCounter && <Button disabled>{this.state.counter}</Button>}
        {displayCounter && <Button onClick={this.handleDecrement}>-</Button>}
      </ButtonGroup>
    );
  }
}

export default Counter;