import React, { Component } from 'react';
import './styles.sass';
import { increaseCount } from '../../redux/actions/actions';

interface StateInterface {
  count: number;
}

class ComponentDidMount extends Component<{}, StateInterface> {
  private countInterval: NodeJS.Timer;

  constructor({}) {
    super({});

    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    this.countInterval = setInterval(this.increaseCount, 100);
  }

  componentWillUnmount() {
    clearInterval(this.countInterval);
  }

  increaseCount = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }));
  };

  render() {
    const { count } = this.state;

    return (
      <div>
        <div>
          Count will automatically increase as setState is called at an interval
          {` ${count}`}
        </div>
      </div>
    );
  }
}
export default ComponentDidMount;
