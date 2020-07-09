import React from 'react';

interface ErrorHandlerProps {
  state: { errorOccurred: boolean }
}

class ErrorHandler extends React.Component {
  constructor(props:ErrorHandlerProps) {
    super(props);
    this.state = { errorOccurred: false };
  }

  componentDidCatch(error:string, info:string) {
    this.setState({ errorOccurred: true })
    console.log('Error occurred in React Component: ', error, info);
  }

  render() {
    return this.state.errorOccurred ? <div margin="8px">Unexpected Error</div> : this.props.children
  }
}

export default ErrorHandler;
