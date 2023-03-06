import React from 'react';

class ErrorHandler extends React.Component {
  constructor(props: unknown) {
    super(props);
    this.state = { errorOccurred: false };
  }

  componentDidCatch(error: string, info: string): void {
    this.setState({ errorOccurred: true });
  }

  render(): JSX.Element {
    const { errorOccurred } = this.state;
    // eslint-disable-next-line react/prop-types
    const { children } = this.props;
    return errorOccurred ? <div>Unexpected Error</div> : children;
  }
}

export default ErrorHandler;
