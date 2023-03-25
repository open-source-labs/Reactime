import React from 'react';

export default class IncrementClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <button className='increment' onClick={this.handleClick}>
          You clicked me {this.state.count} times.
        </button>
      </div>
    );
  }
}
