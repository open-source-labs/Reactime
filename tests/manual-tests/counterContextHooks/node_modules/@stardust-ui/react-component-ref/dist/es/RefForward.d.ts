import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RefProps } from './types';
export default class RefForward extends React.Component<RefProps> {
    static displayName: string;
    static propTypes: {
        children: PropTypes.Validator<PropTypes.ReactElementLike>;
        innerRef: PropTypes.Validator<React.Ref<any>>;
    } | {
        children?: undefined;
        innerRef?: undefined;
    };
    handleRefOverride: (node: HTMLElement) => void;
    render(): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
}
