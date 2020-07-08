import React from 'react';

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errorOccurred: false };
  }

  componentDidCatch(error, info) {
    this.setState({ errorOccurred: true })
    console.log('Error occurred in React Component: ', error, info);
  }

  render() {
    return this.state.errorOccurred ? <div margin="8px">Unexpected Error</div> : this.props.children
  }
}

export default ErrorHandler;
