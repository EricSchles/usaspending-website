/**
 * GlossarySearchResults.jsx
 * Created by Kevin Li 5/1/17
 */

import React from 'react';
import _ from 'lodash';

import ResultGroup from './ResultGroup';

const propTypes = {
    glossary: React.PropTypes.object,
    searchLoading: React.PropTypes.bool,
    setGlossaryTerm: React.PropTypes.func
};

export default class GlossarySearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            results: []
        };

        this.selectTerm = this.selectTerm.bind(this);
    }

    componentWillMount() {
        this.groupResults(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.glossary.search.results !== this.props.glossary.search.results) {
            this.groupResults(nextProps);
        }
    }

    selectTerm(term) {
        this.props.setGlossaryTerm(term);
    }

    groupResults(props) {
        // we need to group the results by their starting letter
        const groups = {};

        props.glossary.search.results.forEach((result) => {
            const startingLetter = result.term.charAt(0).toUpperCase();
            // check if we already have the character
            if (Object.hasOwnProperty.call(groups, startingLetter)) {
                // we do, add it to to the list
                const groupValues = _.concat([], groups[startingLetter].terms, result);
                groups[startingLetter].terms = _.sortBy(groupValues, ['term']);
            }
            else {
                // the character doesn't exist as a group item yet
                const group = {
                    letter: startingLetter,
                    terms: [result]
                };
                groups[startingLetter] = group;
            }
        });

        // sort the groups by starting letter
        const orderedGroups = _.sortBy(groups, ['letter']);

        const results = orderedGroups.map((group) => (
            <ResultGroup
                key={group.letter}
                title={group.letter}
                items={group.terms}
                search={this.props.glossary.search.input}
                selectTerm={this.selectTerm} />
        ));

        this.setState({
            results
        });
    }

    render() {
        let searchLoading = '';
        if (this.props.searchLoading) {
            searchLoading = ' loading';
        }

        return (
            <div className={`glossary-search-results ${searchLoading}`}>
                {this.state.results}
            </div>
        );
    }
}

GlossarySearchResults.propTypes = propTypes;