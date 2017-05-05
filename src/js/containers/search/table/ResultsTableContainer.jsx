/**
  * ResultsTableContainer.jsx
  * Created by Kevin Li 11/8/16
  **/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import _ from 'lodash';

import { toggleColumnVisibility } from 'redux/actions/search/searchFilterActions';

import TableSearchFields from 'dataMapping/search/tableSearchFields';

import ResultsTableSection from 'components/search/table/ResultsTableSection';

import SearchActions from 'redux/actions/searchActions';

const actions = {
    toggleColumnVisibility,
    SearchActions
};

const propTypes = {
    rows: React.PropTypes.instanceOf(Immutable.List),
    meta: React.PropTypes.object,
    batch: React.PropTypes.instanceOf(Immutable.Record),
    searchOrder: React.PropTypes.object,
    setSearchTableType: React.PropTypes.func,
    setSearchPageNumber: React.PropTypes.func,
    setSearchOrder: React.PropTypes.func,
    columnVisibility: React.PropTypes.object,
    toggleColumnVisibility: React.PropTypes.func
};

const tableTypes = [
    {
        label: 'Contracts',
        internal: 'contracts',
        enabled: true
    },
    {
        label: 'Grants',
        internal: 'grants',
        enabled: true
    },
    {
        label: 'Direct Payments',
        internal: 'direct_payments',
        enabled: true
    },
    {
        label: 'Loans',
        internal: 'loans',
        enabled: true
    },
    {
        label: 'Insurance',
        internal: 'insurance',
        enabled: true
    }
];

class ResultsTableContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [],
            hiddenColumns: []
        };

        this.switchTab = this.switchTab.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.toggleColumnVisibility = this.toggleColumnVisibility.bind(this);
    }

    componentWillMount() {
        this.setColumns(this.props.meta.tableType);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.meta.tableType !== this.props.meta.tableType) {
            // table type changed, update columns
            this.setColumns(nextProps.meta.tableType);
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.columnVisibility, this.props.columnVisibility)) {
            this.setColumns(this.props.meta.tableType);
        }
    }

    setColumns(tableType) {
         // calculate the column metadata to display in the table
        const columns = [];
        const hiddenColumns = [];
        let sortOrder = TableSearchFields.defaultSortDirection;
        let columnWidths = TableSearchFields.columnWidths;
        const columnVisibility = this.props.columnVisibility;

        if (tableType === 'loans') {
            sortOrder = TableSearchFields.loans.sortDirection;
            columnWidths = TableSearchFields.loans.columnWidths;
        }

        const tableSettings = TableSearchFields[tableType];

        columnVisibility.visibleColumns.forEach((col) => {
            const column = {
                columnName: col,
                displayName: tableSettings[col],
                width: columnWidths[col],
                defaultDirection: sortOrder[col]
            };
            columns.push(column);
        });

        columnVisibility.hiddenColumns.forEach((col) => {
            const column = {
                columnName: col,
                displayName: tableSettings[col]
            };
            hiddenColumns.push(column);
        });

        this.setState({
            columns,
            hiddenColumns
        });
    }

    switchTab(tab) {
        this.props.setSearchTableType(tab);
        const currentSortField = this.props.searchOrder.field;

        // check if the current sort field is available in the table type
        if (!Object.hasOwnProperty.call(TableSearchFields[tab], currentSortField)) {
            // the sort field doesn't exist, use the table type's default field
            const field = TableSearchFields[tab]._defaultSortField;
            let direction = TableSearchFields.defaultSortDirection[field];
            if (tab === 'loans') {
                direction = TableSearchFields.loans.sortDirection[field];
            }

            this.props.setSearchOrder({
                field,
                direction
            });
        }
    }

    loadNextPage() {
        // check if request is already in-flight
        if (this.props.meta.inFlight) {
            // in-flight, ignore this request
            return;
        }
        // check if more pages are available
        if (this.props.meta.page.has_next_page) {
            // more pages are available, load them
            this.props.setSearchPageNumber(this.props.meta.page.page + 1);
        }
    }

    toggleColumnVisibility(column) {
        this.props.toggleColumnVisibility({
            column
        });
    }

    render() {
        return (
            <ResultsTableSection
                batch={this.props.batch}
                inFlight={this.props.meta.inFlight}
                results={this.props.rows.toArray()}
                resultsMeta={this.props.meta}
                columns={this.state.columns}
                hiddenColumns={this.state.hiddenColumns}
                toggleColumnVisibility={this.toggleColumnVisibility}
                tableTypes={tableTypes}
                currentType={this.props.meta.tableType}
                switchTab={this.switchTab}
                loadNextPage={this.loadNextPage} />
        );
    }
}

ResultsTableContainer.propTypes = propTypes;

export default connect(
    (state) => ({
        rows: state.records.awards,
        meta: state.resultsMeta.toJS(),
        batch: state.resultsBatch,
        searchOrder: state.searchOrder.toJS(),
        columnVisibility: state.columnVisibility
    }),
    (dispatch) => bindActionCreators(actions, dispatch)
)(ResultsTableContainer);
