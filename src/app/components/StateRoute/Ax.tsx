import React from 'react';
import { JSONTree } from 'react-json-tree'; // React JSON Viewer Component

const json = {
    array: [1, 2, 3],
    bool: true,
    object: {
    foo: 'bar',
    },
}
const AxTree = () => {
    return(
        <JSONTree data={json} />
    )
}
export default AxTree;