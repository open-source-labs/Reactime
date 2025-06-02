import React, { Component, useState } from 'react';

type ButtonProps = {
  id: string;
  label: string;
  color?: string;
  initialCount?: number;
};

type IncrementClassState = {
  count: number;
};

class IncrementClass extends Component<ButtonProps, IncrementClassState> {
  state = {
    count: this.props.initialCount || 0,
  };

  handleClick = (): void => {
    this.setState((prevState: IncrementClassState) => ({
      count: prevState.count + 1,
    }));
  };

  render(): JSX.Element {
    return (
      <div>
        <button
          id={this.props.id}
          className='increment'
          onClick={this.handleClick}
          style={{ backgroundColor: this.props.color }}
        >
          {this.props.label} {this.state.count} times.
        </button>
      </div>
    );
  }
}

const IncrementFunction = (props: ButtonProps): JSX.Element => {
  const [count, setCount] = useState(props.initialCount || 0);

  const handleClick = (): void => {
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <button
        id={props.id}
        className='increment'
        onClick={handleClick}
        style={{ backgroundColor: props.color }}
      >
        {props.label} {count} times.
      </button>
    </div>
  );
};

class Buttons extends Component {
  render(): JSX.Element {
    return (
      <div className='buttons'>
        <h1>Mixed State Counter</h1>
        <h4>First two buttons use class components, last two use function components.</h4>
        <IncrementClass id='class1' label='Class Button 1:' color='#f00008' initialCount={5} />
        <IncrementClass id='class2' label='Class Button 2:' color='#62d6fb' />
        <IncrementFunction
          id='func1'
          label='Function Button 1:'
          color='#6288fb'
          initialCount={10}
        />
        <IncrementFunction id='func2' label='Function Button 2:' color='#ff6569' />
      </div>
    );
  }
}

export default Buttons;
