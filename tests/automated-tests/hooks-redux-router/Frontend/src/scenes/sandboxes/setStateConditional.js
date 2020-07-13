import React, { Component } from 'react';

class SetStateConditional extends Component {
  constructor() {
    super();
    
    this.state = {
      count: 0,
      threshold: '',
      threshold2: ''
    };
  }

  handleClick = () => {
    this.setState(
      prevState => ({
        count: prevState.count + 1
      }),
      () => {
        const { count } = this.state;

        if (count === 5) {
          this.setState({ threshold: 'You have reached 5 clicks!' });
        }

        if (count === 10) {
          this.setState({ threshold2: 'You have reached 10 clicks!' });
        }
      }
    );
  }

  render() {
    const { count, threshold, threshold2 } = this.state;

    return (
      <div>
        <button type="button" onClick={this.handleClick}>
          Click Here to Increase the Count
        </button>
        <div>{count}</div>
        <div>{threshold}</div>
        <div>{threshold2}</div>
      </div>
    );
  }
}

export default SetStateConditional