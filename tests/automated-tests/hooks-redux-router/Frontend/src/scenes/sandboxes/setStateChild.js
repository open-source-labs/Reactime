/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import './styles.sass';

class SetStateChild extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  render() {
    const { count } = this.state;

    return (
      <div className="mt-2">
        <div className="bg-light">
          Child Component's Counter
          {` ${count}`}
        </div>

        <button
          type="button"
          className="bg-secondary text-white font-weight-bold"
          onClick={() =>
            // eslint-disable-next-line prettier/prettier
            this.setState(prevState => ({ count: prevState.count + 1 }))}
        >
          This component is mounted inside of the component seen above. Click
          Here to Increase the Count of the Child Component (setState)
        </button>
      </div>
    );
  }
}
export default SetStateChild;
