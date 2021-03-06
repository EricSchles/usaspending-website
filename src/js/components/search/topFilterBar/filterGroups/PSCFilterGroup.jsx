/**
 * PSCFilterGroup.jsx
 * Created by Emily Gullo 07/21/2017
 */

import React from 'react';
import PropTypes from 'prop-types';

import BaseTopFilterGroup from './BaseTopFilterGroup';

const propTypes = {
    filter: PropTypes.object,
    redux: PropTypes.object
};

export default class PSCFilterGroup extends React.Component {
    constructor(props) {
        super(props);

        this.removeFilter = this.removeFilter.bind(this);
        this.clearGroup = this.clearGroup.bind(this);
    }

    removeFilter(value) {
        // remove a single filter item
        const newValue = this.props.redux.reduxFilters.selectedPSC.delete(value);
        this.props.redux.updateGenericFilter({
            type: 'selectedPSC',
            value: newValue
        });
    }

    clearGroup() {
        this.props.redux.clearFilterType('selectedPSC');
    }

    generateTags() {
        const tags = [];

        // check to see if a PSC code is provided
        const PSC = this.props.filter.values;

        PSC.forEach((value) => {
            const tag = {
                value: `${value.identifier}`,
                title: `${value.product_or_service_code}`,
                isSpecial: false,
                removeFilter: this.removeFilter
            };

            tags.push(tag);
        });

        return tags;
    }

    render() {
        const tags = this.generateTags();

        return (<BaseTopFilterGroup
            tags={tags}
            filter={this.props.filter}
            clearFilterGroup={this.clearGroup} />);
    }
}

PSCFilterGroup.propTypes = propTypes;
