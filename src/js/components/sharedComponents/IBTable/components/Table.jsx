/**
  * Table.jsx
  * Created by Kevin Li 12/6/16
  **/

import React from 'react';
import PropTypes from 'prop-types';

import ScrollInterceptor from './ScrollInterceptor';

import HeaderRow from './HeaderRow';
import TableBody from './TableBody';

const defaultProps = {
    resetHash: '1'
};

const propTypes = {
    resetHash: PropTypes.string,
    maxWidth: PropTypes.number.isRequired
};

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleWidth: 0,
            contentWidth: 0,
            visibleHeight: 0,
            contentHeight: 0,
            fullHeight: 0,
            isScrolling: false,
            scrollPos: {
                x: 0,
                y: 0
            }
        };

        this.startScroll = this.startScroll.bind(this);
        this.scrolledTo = this.scrolledTo.bind(this);
        this.scrollEnded = this.scrollEnded.bind(this);

        this.syncScrollPosition = this.syncScrollPosition.bind(this);
    }

    componentWillMount() {
        this.calculateTableDimensions(this.props);
    }

    componentDidMount() {
        this.addListeners();
    }


    componentWillReceiveProps(nextProps) {
        this.calculateTableDimensions(nextProps);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.resetHash !== this.props.resetHash) {
            this.resetScroll();
        }
    }

    addListeners() {
        this.tableContainer.addEventListener('wheel', this.startScroll);
    }

    calculateTableDimensions(props) {
        const visibleWidth = Math.min(props.maxWidth, props.width);

        const bodyHeight = props.rowHeight * props.rowCount;
        const fullHeight = props.headerHeight + bodyHeight;

        const visibleHeight = Math.min(props.maxHeight, fullHeight);

        this.setState({
            visibleWidth,
            visibleHeight,
            fullHeight,
            contentWidth: props.width,
            contentHeight: props.height
        });
    }


    syncScrollPosition(x, y) {
        // directly modify the DOM CSS element rather than trigger re-renders via prop changes
        this.headerRow.updateScrollPosition(x, y);
    }

    resetScroll() {
        // reset the scroll position to the top left corner
        this.setState({
            scrollPos: {
                x: 0,
                y: 0
            }
        });
    }

    startScroll() {
        if (this.state.isScrolling) {
            return;
        }

        this.setState({
            isScrolling: true
        }, () => {
            this.tableContainer.removeEventListener('wheel', this.startScroll);
        });
    }

    scrolledTo(pos) {
        this.setState({
            scrollPos: pos
        });
    }

    scrollEnded() {
        this.setState({
            isScrolling: false
        }, () => {
            this.addListeners();
        });
    }

    render() {
        const style = {
            width: this.state.visibleWidth,
            height: this.state.visibleHeight
        };

        

/*        <TableBody
            {...this.props}
            syncScrollPosition={this.syncScrollPosition}
            ref={(body) => {
                this.body = body;
            }} />*/

        return (
            <div
                className="ibt-table-container"
                style={style}
                ref={(div) => {
                    this.tableContainer = div;
                }}>
                <ScrollInterceptor
                    isScrolling={this.state.isScrolling}
                    scrollEnded={this.scrollEnded}
                    scrolledTo={this.scrolledTo}
                    visibleWidth={this.state.visibleWidth}
                    visibleHeight={this.state.visibleHeight}
                    contentWidth={this.state.contentWidth}
                    fullHeight={this.state.fullHeight} />
                <HeaderRow
                    scrollPos={this.state.scrollPos}
                    columns={this.props.columns}
                    headerHeight={this.props.headerHeight}
                    visibleWidth={this.state.visibleWidth}
                    contentWidth={this.state.contentWidth} />
                
            </div>
        );
    }
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

