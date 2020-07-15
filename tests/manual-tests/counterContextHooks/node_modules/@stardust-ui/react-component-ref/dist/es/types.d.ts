import * as PropTypes from 'prop-types';
import * as React from 'react';
export interface RefProps {
    children: React.ReactElement<any>;
    /**
     * Called when a child component will be mounted or updated.
     *
     * @param {HTMLElement} node - Referred node.
     */
    innerRef: React.Ref<any>;
}
/** A checker that matches the React.Ref type. */
export declare const refPropType: PropTypes.Requireable<React.Ref<any>>;
