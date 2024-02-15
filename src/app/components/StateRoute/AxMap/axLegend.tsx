import React from 'react';

const AxLegend = () => {
    return (
        <div>
            Nodes from the accessibility tree have either a role <strong>role</strong> or <strong>internalRole</strong>
            <ul>
                <li>
                    Role refers to <strong> ARIA </strong> roles, which indicate the purpose of the element to assistive technologies, like screen readers
                </li>
                <li>
                    internalRole refers to browser-specific roles <strong> Chrome </strong> for its accessibility processing
                </li>
            </ul>

            <div className='axLegendInfo' id='roleNodes'>
                <h4>All of the nodes here have the role 'role' </h4>
            </div>
        </div>
    );
}

export default AxLegend;