/**
  * HeaderRow.jsx
  * Created by Kevin Li 12/6/16
  **/

import React from 'react';
import PropTypes from 'prop-types';
import { min } from 'lodash';

import HeaderCell from './HeaderCell';

const propTypes = {
    headerHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    width: PropTypes.number,
    columns: PropTypes.array
};

export default class HeaderRow extends React.PureComponent {
    updateScrollPosition(scroll) {
        // by directly modifying the DOM, we can skip the render process
        // this avoids having to iterate through the columns again
        return `translate(${-1 * scroll.x}px, 0px)`;
    }

    render() {
        const style = {
            height: this.props.headerHeight,
            width: this.props.visibleWidth
        };

        const rowStyle = {
            height: this.props.headerHeight,
            width: this.props.contentWidth,
            transform: this.updateScrollPosition(this.props.scrollPos)
        };

        const headers = this.props.columns.map((column) => (
            <HeaderCell height={this.props.headerHeight} {...column} key={column.columnId} />
        ));

        return (
            <div className="ibt-header" style={style}>
                <div
                    className="ibt-header-row"
                    style={rowStyle}>
                    {headers}
                </div>
            </div>
        );
    }
}

HeaderRow.propTypes = propTypes;
