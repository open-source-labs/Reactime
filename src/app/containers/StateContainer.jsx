import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import * as themes from 'redux-devtools-themes';

const getItemString = (type, data, itemType, itemString) => (
  <span>
    //
    {type}
  </span>
);

class StateContainer extends Component {
  constructor(props) {
    super(props);
    console.log(themes);
  }

  render() {
    const { snapshot } = this.props;
    return (
      <div className="state-container">
        {snapshot && (
          <JSONTree
            data={snapshot}
            theme={{ tree: () => ({ className: 'json-tree' }) }}
            getItemString={getItemString}
          />
        )}
      </div>
    );
  }
}

export default StateContainer;

// const theme = {
//   scheme: 'monokai',
//   author: 'wimer hazenberg (http://www.monokai.nl)',
//   base00: '#272822',
//   base01: '#383830',
//   base02: '#49483e',
//   base03: '#75715e',
//   base04: '#a59f85',
//   base05: '#f8f8f2',
//   base06: '#f5f4f1',
//   base07: '#f9f8f5',
//   base08: '#f92672',
//   base09: '#fd971f',
//   base0A: '#f4bf75',
//   base0B: '#a6e22e',
//   base0C: '#a1efe4',
//   base0D: '#66d9ef',
//   base0E: '#ae81ff',
//   base0F: '#cc6633',
// };

// const theme = {
//   scheme: 'nicinabox',
//   author: 'nicinabox (http://github.com/nicinabox)',
//   base00: '#2A2F3A',
//   base01: '#3C444F',
//   base02: '#4F5A65',
//   base03: '#BEBEBE',
//   base04: '#b0b0b0', // based on ocean theme
//   base05: '#d0d0d0', // based on ocean theme
//   base06: '#FFFFFF',
//   base07: '#f5f5f5', // based on ocean theme
//   base08: '#fb9fb1', // based on ocean theme
//   base09: '#FC6D24',
//   base0A: '#ddb26f', // based on ocean theme
//   base0B: '#A1C659',
//   base0C: '#12cfc0', // based on ocean theme
//   base0D: '#6FB3D2',
//   base0E: '#D381C3',
//   base0F: '#deaf8f', // based on ocean theme
// };
