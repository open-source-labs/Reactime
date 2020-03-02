import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
// import { connect } from 'react-redux';
import './styles.sass';
import UseState from './sandboxes/useState';
import UseEffect from './sandboxes/useEffect';
import UseContext from './sandboxes/useContext';
import UseMemo from './sandboxes/useMemo';
import Redux from './sandboxes/redux';
import Router from './sandboxes/router';
import SetState from './sandboxes/setState';
import ComponentDidMount from './sandboxes/componentDidMount';
import AppContextProvider from '../context/appContextProvider';
import LastSnapshot from './lastSnapshot';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const Scenes = () => {
  const [activeSandbox, setActiveSandbox] = useState('UseState');

  function changeSandbox(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const { innerText } = event.target as HTMLElement;
    setActiveSandbox(innerText);
  }

  function sandboxButtons() {
    const buttonsArray = [
      'UseState',
      'UseEffect',
      'UseContext',
      'UseMemo',
      '|',
      'Redux',
      'Router',
      '|',
      'SetState',
      'ComponentDidMount'
    ];

    const buttons = buttonsArray.map((buttonName, index) => {
      if (buttonName === '|') {
        return <div key={buttonName + index}>{buttonName}</div>;
      }

      return (
        <button
          key={buttonName + index}
          id={buttonName}
          type="button"
          onClick={changeSandbox}
          style={
            activeSandbox === buttonName
              ? { outline: 'none', backgroundColor: 'cornflowerblue' }
              : null
          }
        >
          {buttonName}
        </button>
      );
    });

    return <>{buttons}</>;
  }

  function displaySandbox() {
    switch (activeSandbox) {
      // case 'UseState':
      //   return <UseState />;

      case 'UseEffect':
        return <UseEffect />;

      case 'UseContext':
        return (
          <AppContextProvider>
            <UseContext />
          </AppContextProvider>
        );

      case 'UseMemo':
        return <UseMemo />;

      case 'Redux':
        return (
          <Provider store={store}>
            <Redux />
          </Provider>
        );

      case 'Router':
        return <Router />;

      case 'SetState':
        return <SetState />;

      case 'ComponentDidMount':
        return <ComponentDidMount />;

      default:
        return <UseState />;
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col d-flex justify-content-around m-3">
          {sandboxButtons()}
        </div>
      </div>

      <div className="row">
        <div className="col text-white bg-secondary text-center font-weight-bold p-1">
          Typescript Sandbox Below
        </div>
      </div>

      <div className="row">
        <div className="col m-5 justify-content-center">{displaySandbox()}</div>
      </div>

      <div className="row">
        <div className="col text-white bg-secondary text-center font-weight-bold p-1">
          The Most Recent Snapshot is Below
        </div>
      </div>

      <div className="row">
        <LastSnapshot />
      </div>
    </div>
  );
};

export default Scenes;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
