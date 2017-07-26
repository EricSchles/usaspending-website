/**
 * ShownPSC.jsx
 * Created by Emily Gullo 07/10/2017
 **/

import React from 'react';
import * as Icons from 'components/sharedComponents/icons/Icons';

const propTypes = {
    removePSC: React.PropTypes.func,
    label: React.PropTypes.string
};

export default class ShownPSC extends React.Component {

    render() {
        return (
            <button
                className="shown-filter-button"
                value={this.props.label}
                onClick={this.props.removePSC}>
                <span className="close">
                    <Icons.Close className="usa-da-icon-close" />
                </span> {this.props.label}
            </button>
        );
    }
}
ShownPSC.propTypes = propTypes;