/**
 * ContractDetails.jsx
 * Created by Emily Gullo 02/06/2017
 **/

import React from 'react';
import moment from 'moment';
import DetailRow from '../DetailRow';

const propTypes = {
    selectedAward: React.PropTypes.object,
    seeAdditional: React.PropTypes.func,
    maxChars: React.PropTypes.number
};

export default class ContractDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            desc: "",
            date: "",
            place: "",
            typeDesc: "",
            price: "",
            overflow: false
        };

        // bind functions
        this.setValues = this.setValues.bind(this);
    }

    componentWillReceiveProps() {
        this.setValues(this.props.selectedAward);
    }

    setValues(award) {
        let yearRangeTotal = "";
        let description = null;

        // Date Range
        const startDate = moment(award.period_of_performance_start_date, 'M/D/YYYY');
        const endDate = moment(award.period_of_performance_current_end_date, 'M/D/YYYY');
        const yearRange = endDate.diff(startDate, 'year');
        const monthRange = (endDate.diff(startDate, 'month') - (yearRange * 12));
        if (yearRange !== 0 && !Number.isNaN(yearRange)) {
            if (yearRange === 1) {
                yearRangeTotal = `${yearRange} year`;
            }
            else {
                yearRangeTotal = `${yearRange} years`;
            }
            if (monthRange > 0) {
                yearRangeTotal += ' ';
            }
        }
        if (monthRange >= 1) {
            if (yearRange < 1 && monthRange > 1) {
                yearRangeTotal = `${monthRange} months`;
            }
            else if (monthRange === 1) {
                yearRangeTotal += `${monthRange} month`;
            }
            else {
                yearRangeTotal += `${monthRange} months`;
            }
        }
        if (yearRangeTotal) {
            yearRangeTotal = `(${yearRangeTotal})`;
        }
        const popDate = `${award.period_of_performance_start_date} -
            ${award.period_of_performance_current_end_date} ${yearRangeTotal}`;

        // Location
        let popPlace = "";
        let cityState = null;
        const city = award.place_of_performance.city_name;
        let stateProvince = award.place_of_performance.state_code;
        if (stateProvince === '' && award.place_of_performance.state_name !== '') {
            stateProvince = award.place_of_performance.state_name;
        }

        if (city && stateProvince) {
            cityState = `${city}, ${stateProvince}`;
        }
        else if (city) {
            cityState = city;
        }
        else if (stateProvince) {
            cityState = stateProvince;
        }
        if (award.place_of_performance.location_country_code === 'USA') {
            let zip = award.place_of_performance.zip5;
            if (!zip && award.place_of_performance.zip4) {
                zip = award.place_of_performance.zip4.slice(0, 5);
            }
            popPlace = `${cityState} ${zip}`;
            if (award.place_of_performance.state_code && award.place_of_performance.congressional_code) {
                popPlace +=
            `\nCongressional District: ${award.place_of_performance.state_code}-${award.place_of_performance.congressional_code}`;
            }
        }
        else if (award.place_of_performance.location_country_code !== 'USA') {
            popPlace = `${award.place_of_performance.country_name}`;
        }
        if (award.description) {
            description = award.description;
        }
        else {
            description = "Not Available";
        }

        // Pricing
        let pricing = "Not Available";
        if (award.type_of_contract_pricing_description) {
            pricing = award.type_of_contract_pricing_description;
        }

        // char count
        let seeMore = false;
        if (award.description.length > this.props.maxChars) {
            seeMore = true;
        }

        this.setState({
            desc: description,
            overflow: seeMore,
            date: popDate,
            place: popPlace,
            typeDesc: award.type_description,
            price: pricing
        });
    }

    render() {
        return (
            <div className="contract-wrapper">
                <div className="contract-details">
                    <h3>Contract Details</h3>
                    <hr
                        className="results-divider"
                        ref={(hr) => {
                            this.sectionHr = hr;
                        }} />
                    <table>
                        <tbody>
                            <DetailRow
                                title="Description"
                                value={this.state.desc}
                                overflow={this.state.overflow}
                                maxChars={this.props.maxChars} />
                            <DetailRow
                                title="Period of Performance"
                                value={this.state.date} />
                            <DetailRow
                                title="Primary Place of Performance"
                                value={this.state.place} />
                            <DetailRow
                                title="Contract Award Type"
                                value={this.state.typeDesc} />
                            <DetailRow
                                title="Contract Pricing Type"
                                value={this.state.price} />
                        </tbody>
                    </table>
                </div>
                <button
                    className="see-more"
                    onClick={this.props.seeAdditional}>See Additional Details</button>
            </div>
        );
    }
}
ContractDetails.propTypes = propTypes;
