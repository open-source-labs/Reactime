import React from 'react';

const AxLegend = () => {
    return (
        <div style={{borderStyle: 'solid'}}>
            Nodes from the accessibility tree have either a role <strong>role</strong> or <strong>internalRole</strong>
            <ul>
                <li>
                    <i><b>Role</b></i> refers to <strong> ARIA </strong> roles, which indicate the purpose of the element to assistive technologies, like screen readers.
                    All of the nodes rendered in this tree have a role of 'role'
                </li>
                <li>
                    <i><b>internalRole</b></i> refers to browser-specific roles <strong> Chrome </strong> for its own accessibility processing
                </li>
            </ul>

            <div className='axLegendInfo' id='roleNodes'>
                <h4>All of the nodes here have the role 'role' </h4>
            </div>
        </div>
    );
}

export default AxLegend;