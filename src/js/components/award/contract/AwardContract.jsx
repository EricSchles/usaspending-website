/**
 * AwardContract.jsx
 * Created by Emily Gullo 02/06/2017
 **/

import React from 'react';
import * as SummaryPageHelper from 'helpers/summaryPageHelper';

import AwardAmounts from '../AwardAmounts';
import ContractDetails from './ContractDetails';

const propTypes = {
    selectedAward: React.PropTypes.object,
    seeAdditional: React.PropTypes.func
};

export default class AwardContract extends React.Component {

    render() {
        return (
            <div className="award-contract-wrapper">
                <AwardAmounts
                    selectedAward={this.props.selectedAward}
                    typeString={this.props.selectedAward.category} />
                <ContractDetails
                    selectedAward={this.props.selectedAward}
                    seeAdditional={this.props.seeAdditional}
                    maxChars={SummaryPageHelper.maxDescriptionCharacters} />
            </div>
        );
    }
}
AwardContract.propTypes = propTypes;
