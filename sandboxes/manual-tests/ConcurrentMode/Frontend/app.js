import React from 'react';
import './index.scss';
// import { Provider } from 'react-redux';
// import store from './src/redux/store';
import Scenes from './src/scenes/index';

const App = () => {
  return (
    <>
      {/* <Provider store={store}> */}
      <Scenes />
      {/* </Provider> */}
    </>
  );
};

export default App;
