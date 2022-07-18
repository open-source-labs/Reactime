import React, { useEffect } from 'react';
import JSONTree from 'react-json-tree';

import { setCurrentTabInApp } from '../actions/actions';
import { useStoreContext } from '../store';

const colors = {
  scheme: 'paraiso',
  author: 'jan t. sott',
  base00: '#2f1e2e',
  base01: '#41323f',
  base02: '#4f424c',
  base03: '#776e71',
  base04: '#8d8687',
  base05: '#a39e9b',
  base06: '#b9b6b0',
  base07: '#e7e9db',
  base08: '#ef6155',
  base09: '#f99b15',
  base0A: '#fec418',
  base0B: '#48b685',
  base0C: '#5bc4bf',
  base0D: '#06b6ef',
  base0E: '#815ba4',
  base0F: '#e96ba8',
};

const getItemString = (
  type,
  data: { state?: object | string; name: string; children: [] }
) => {
  if (data && data.name) {
    return <span>{data.name}</span>;
  }
  return <span />;
};

interface TreeProps {
  snapshot: {
    name?: string;
    componentData?: object;
    state?: string | object;
    stateSnaphot?: object;
    children?: any[];
  };
}

const Tree = (props: TreeProps) => {
  const { snapshot } = props;
  const [ store, dispatch] = useStoreContext();

  useEffect(() => {
    dispatch(setCurrentTabInApp('history'));
  }, []);

  return (
    <>
      {snapshot && (
        <JSONTree
          data={snapshot}
          theme={{ extend: colors, tree: () => ({ className: 'json-tree' }) }}
          shouldExpandNode={() => true}
          getItemString={getItemString}
          labelRenderer={(raw: any[]) => {
            return typeof raw[0] !== 'number' ? <span>{raw[0]}</span> : null;
          }}
        />
      )}
    </>
  );
};

export default Tree;
