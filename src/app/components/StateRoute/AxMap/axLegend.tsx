import React from 'react';

const AxLegend = () => {
    return (
        <div>
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

            <p> Each node is given a property labeled <strong>ignored</strong>. Nodes read by the screen reader have their ignored property evaluate to <strong>false</strong>. 
            Nodes not read by the screen reader evaluate to <strong>true</strong>.</p>

            <p> Nodes labeled as <strong>no name</strong> are visible to a screen reader, but were not given a name label.</p>
        </div>
    );
}

export default AxLegend;