/**
* PSCListContainer.jsx
* Created by Emily Gullo 07/14/2017
**/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEqual, omit, differenceWith, slice } from 'lodash';
import { isCancel } from 'axios';
import { Search } from 'js-search';

import * as SearchHelper from 'helpers/searchHelper';
import * as autocompleteActions from 'redux/actions/search/autocompleteActions';

import Autocomplete from 'components/sharedComponents/autocomplete/Autocomplete';

const propTypes = {
    selectPSC: React.PropTypes.func,
    setAutocompletePSC: React.PropTypes.func,
    selectedPSC: React.PropTypes.object,
    autocompletePSC: React.PropTypes.array
};

class PSCListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pscSearchString: '',
            autocompletePSC: [],
            noResults: false
        };

        this.handleTextInput = this.handleTextInput.bind(this);
        this.clearAutocompleteSuggestions = this.clearAutocompleteSuggestions.bind(this);
        this.timeout = null;
    }

    componentDidMount() {
        this.parseAutocompletePSC(this.props.autocompletePSC);
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.autocompletePSC, this.props.autocompletePSC)) {
            this.parseAutocompletePSC(nextProps.autocompletePSC);
        }
    }

    parseAutocompletePSC(psc) {
        const values = [];
        if (psc && psc.length > 0) {
            psc.forEach((item) => {
                values.push({
                    title: item.product_or_service_code,
                    subtitle: 'PSC Code',
                    data: item
                });
            });
        }

        this.setState({
            autocompletePSC: values
        });
    }

    queryAutocompletePSC(input) {
        this.setState({
            noResults: false
        });

        // Only search if input is 2 or more characters
        if (input.length >= 2) {
            this.setState({
                pscSearchString: input
            });

            if (this.pscSearchRequest) {
                // A request is currently in-flight, cancel it
                this.pscSearchRequest.cancel();
            }

            const pscSearchParams = {
                search_text: this.state.pscSearchString
            };

            this.pscSearchRequest = SearchHelper.fetchPSC(pscSearchParams);

            this.pscSearchRequest.promise
                .then((res) => {
                    const data = res.data.results;
                    let autocompleteData = [];
                    const search = new Search('id');
                    search.addIndex(['product_or_service_code']);
                    search.addDocuments(data);
                    const results = search.search(this.state.pscSearchString);
                    let improvedResults = slice(results, 0, 10);

                    // Remove 'identifier' from selected PSC to enable comparison
                    improvedResults = this.props.selectedPSC.toArray()
                        .map((psc) => omit(psc, 'product_or_service_code'));

                    // Filter out any selected PSC that may be in the result set
                    if (improvedResults && improvedResults.length > 0) {
                        autocompleteData = differenceWith(data, improvedResults, isEqual);
                    }
                    else {
                        autocompleteData = data;
                    }

                    this.setState({
                        noResults: autocompleteData.length === 0
                    });

                    // Add search results to Redux
                    this.props.setAutocompletePSC(autocompleteData);
                })
                .catch((err) => {
                    if (!isCancel(err)) {
                        this.setState({
                            noResults: true
                        });
                    }
                });
        }
        else if (this.pscSearchRequest) {
            // A request is currently in-flight, cancel it
            this.pscSearchRequest.cancel();
        }
    }

    clearAutocompleteSuggestions() {
        this.props.setAutocompletePSC([]);
    }

    handleTextInput(pscInput) {
        // Clear existing PSC to ensure user can't select an old or existing one
        this.props.setAutocompletePSC([]);

        // Grab input, clear any exiting timeout
        const input = pscInput.target.value;
        window.clearTimeout(this.timeout);

        // Perform search if user doesn't type again for 300ms
        this.timeout = window.setTimeout(() => {
            this.queryAutocompletePSC(input);
        }, 300);
    }

    render() {
        return (
            <Autocomplete
                {...this.props}
                values={this.state.autocompletePSC}
                handleTextInput={this.handleTextInput}
                onSelect={this.props.selectPSC}
                placeholder="eg: 1510 - Aircraft, Fixed Wing"
                errorHeader="Unknown PSC"
                errorMessage="We were unable to find that PSC."
                ref={(input) => {
                    this.pscList = input;
                }}
                clearAutocompleteSuggestions={this.clearAutocompleteSuggestions}
                noResults={this.state.noResults} />
        );
    }

}

export default connect(
    (state) => ({ autocompletePSC: state.autocompletePSC }),
    (dispatch) => bindActionCreators(autocompleteActions, dispatch)
)(PSCListContainer);

PSCListContainer.propTypes = propTypes;