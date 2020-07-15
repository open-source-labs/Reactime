import React, { Component } from 'react';
import './styles.sass';
import SetStateChild from './setStateChild';

class SetState extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  render() {
    const { count } = this.state;

    return (
      <div>
        <div className="font-weight-bold">
          Count
          {` ${count}`}
        </div>

        <button
          type="button"
          onClick={() =>
            // eslint-disable-next-line prettier/prettier
            this.setState(prevState => ({ count: prevState.count + 1 }))
          }
        >
          Click Here to Increase the Count (setState)
        </button>

        <div className="bg-primary p-1 my-3 mx-5 vh-5 text-white text-center">
          Child Component Below
        </div>

        <SetStateChild />
      </div>
    );
  }
}
export default SetState;
