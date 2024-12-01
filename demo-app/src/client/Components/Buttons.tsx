import React, { Component, useState } from 'react';

// Type for IncrementClass state
type IncrementClassState = {
  count: number;
};

// Class-based Increment Component
class IncrementClass extends Component<{}, IncrementClassState> {
  state = {
    count: 0,
  };

  handleClick = (): void => {
    this.setState((prevState: IncrementClassState) => ({
      count: prevState.count + 1,
    }));
  };

  render(): JSX.Element {
    return (
      <div>
        <button className='increment' onClick={this.handleClick}>
          You clicked me {this.state.count} times.
        </button>
      </div>
    );
  }
}

// Function-based Increment Component
const IncrementFunction = (): JSX.Element => {
  const [count, setCount] = useState(0);

  const handleClick = (): void => {
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <button className='increment' onClick={handleClick}>
        You clicked me {count} times.
      </button>
    </div>
  );
};

// Main Buttons Component
class Buttons extends Component {
  render(): JSX.Element {
    return (
      <div className='buttons'>
        <h1>Mixed State Counter</h1>
        <h4>First two buttons use class components, last two use function components.</h4>
        <IncrementClass />
        <IncrementClass />
        <IncrementFunction />
        <IncrementFunction />
      </div>
    );
  }
}

export default Buttons;
