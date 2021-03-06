/**
 * TopFilterBarContainer-test.js
 * Created by Kevin Li 1/9/17
 */

import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { Set, OrderedMap } from 'immutable';

import TopFilterBar from 'components/search/topFilterBar/TopFilterBar';
import { TopFilterBarContainer } from 'containers/search/topFilterBar/TopFilterBarContainer';

import { initialState } from 'redux/reducers/search/searchFiltersReducer';

import { mockAwardingAgency, mockFundingAgency, mockRecipient, mockLocation, mockAwardId } from './mockData';

const defaultProps = {
    reduxFilters: initialState,
    updateFilterCount: jest.fn()
};

const setup = (props) =>
    mount(<TopFilterBarContainer {...props} />);

const prepareFiltersSpy = sinon.spy(TopFilterBarContainer.prototype, 'prepareFilters');

describe('TopFilterBarContainer', () => {
    it('should return a TopFilterBarEmpty child component when no filters are applied', () => {
        const topBarContainer = setup(defaultProps);

        expect(topBarContainer.find(TopFilterBar)).toHaveLength(0);
    });

    it('should return a TopFilterBar child component when there are active filters', () => {
        const filters = Object.assign({}, initialState, {
            timePeriodType: 'fy',
            timePeriodFY: new Set(['2014'])
        });
        const props = {
            reduxFilters: filters,
            updateFilterCount: jest.fn()
        };

        const topBarContainer = setup(props);

        expect(topBarContainer.find(TopFilterBar)).toHaveLength(1);
    });

    describe('filter preparation', () => {
        it('should update when the Redux filters change', () => {
            const initialFilters = Object.assign({}, initialState, {
                timePeriodType: 'fy',
                timePeriodFY: new Set(['2014'])
            });

            const updatedFilters = Object.assign({}, initialState, {
                timePeriodType: 'fy',
                timePeriodFY: new Set(['2014', '2015'])
            });

            const initialProps = {
                reduxFilters: initialFilters,
                updateFilterCount: jest.fn()
            };

            const updatedProps = {
                reduxFilters: updatedFilters,
                updateFilterCount: jest.fn()
            };

            // mount the container
            const topBarContainer = setup(initialProps);

            // change the props
            topBarContainer.setProps(updatedProps);

            // the prepareFilters function should have been called
            expect(prepareFiltersSpy.called).toBeTruthy();
        });

        it('should update component state with Redux keyword filter when available', () => {
            // mount the container with default props
            const topBarContainer = setup({
                reduxFilters: Object.assign({}, initialState),
                updateFilterCount: jest.fn()
            });

            expect(topBarContainer.state().filters).toHaveLength(0);

            const keywordFilter = Object.assign({}, initialState, {
                keyword: 'Education'
            });

            topBarContainer.setProps({
                reduxFilters: keywordFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'keyword',
                name: 'Keyword',
                values: 'Education'
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux time filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const timeFilter = Object.assign({}, initialState, {
                timePeriodType: 'fy',
                timePeriodFY: new Set(['2014', '2015'])
            });

            topBarContainer.setProps({
                reduxFilters: timeFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'timePeriodFY',
                name: 'Time Period',
                values: ['2015', '2014']
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux award type filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const awardFilter = Object.assign({}, initialState, {
                awardType: new Set(['07'])
            });

            topBarContainer.setProps({
                reduxFilters: awardFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'awardType',
                name: 'Award Type',
                values: ['07']
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux location filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const locationFilter = Object.assign({}, initialState, {
                selectedLocations: new OrderedMap({
                    '1,2_LOS ANGELES_CITY': {
                        matched_ids: [1, 2],
                        parent: 'CALIFORNIA',
                        place_type: 'CITY',
                        place: 'LOS ANGELES',
                        identifier: '1,2_LOS ANGELES_CITY'
                    }
                })
            });

            topBarContainer.setProps({
                reduxFilters: locationFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'selectedLocations',
                name: 'Place of Performance Location',
                scope: 'all',
                values: [{
                    matched_ids: [1, 2],
                    parent: 'CALIFORNIA',
                    place_type: 'CITY',
                    place: 'LOS ANGELES',
                    identifier: '1,2_LOS ANGELES_CITY'
                }]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux location scope when it is not "all"', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const locationFilter = Object.assign({}, initialState, {
                locationDomesticForeign: 'foreign'
            });

            topBarContainer.setProps({
                reduxFilters: locationFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'selectedLocations',
                name: 'Place of Performance Location',
                scope: 'foreign',
                values: [{
                    isScope: true
                }]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux budget function filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const locationFilter = Object.assign({}, initialState, {
                budgetFunctions: new OrderedMap({
                    'Income Security': {
                        title: 'Income Security',
                        functionType: 'Function'
                    }
                })
            });

            topBarContainer.setProps({
                reduxFilters: locationFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'budgetFunctions',
                name: 'Budget Functions',
                values: [{
                    title: 'Income Security',
                    functionType: 'Function'
                }]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux federal account filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const locationFilter = Object.assign({}, initialState, {
                federalAccounts: new OrderedMap({
                    392: {
                        id: '392',
                        agency_identifier: '012',
                        main_account_code: '3539',
                        account_title: 'Child Nutrition Programs, Food Nutrition Service, Agriculture'
                    }
                })
            });

            topBarContainer.setProps({
                reduxFilters: locationFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'federalAccounts',
                name: 'Federal Accounts',
                values: [{
                    id: '392',
                    agency_identifier: '012',
                    main_account_code: '3539',
                    account_title: 'Child Nutrition Programs, Food Nutrition Service, Agriculture'
                }]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux object class filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const locationFilter = Object.assign({}, initialState, {
                objectClasses: new OrderedMap({
                    10: "Personnel Compensation and Benefits"
                })
            });

            topBarContainer.setProps({
                reduxFilters: locationFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'objectClasses',
                name: 'Object Classes',
                values: {
                    10: "Personnel Compensation and Benefits"
                }
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux awarding agency filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const awardingAgencyFilter = Object.assign({}, initialState, {
                selectedAwardingAgencies: new OrderedMap({
                    "1788_subtier": mockAwardingAgency
                })
            });

            topBarContainer.setProps({
                reduxFilters: awardingAgencyFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'selectedAwardingAgencies',
                name: 'Awarding Agency',
                values: [mockAwardingAgency]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux funding agency filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const awardingAgencyFilter = Object.assign({}, initialState, {
                selectedFundingAgencies: new OrderedMap({
                    "1788_subtier": mockFundingAgency
                })
            });

            topBarContainer.setProps({
                reduxFilters: awardingAgencyFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'selectedFundingAgencies',
                name: 'Funding Agency',
                values: [mockFundingAgency]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux recipient filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const selectedRecipientsFilter = Object.assign({}, initialState, {
                selectedRecipients: new OrderedMap({
                    "006928857": mockRecipient
                })
            });

            topBarContainer.setProps({
                reduxFilters: selectedRecipientsFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'selectedRecipients',
                name: 'Recipient',
                values: [mockRecipient]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux recipient location filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const recipientLocationFilter = Object.assign({}, initialState, {
                selectedRecipientLocations: new OrderedMap({
                    '22796_McLean_COUNTY': mockLocation
                })
            });

            topBarContainer.setProps({
                reduxFilters: recipientLocationFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'selectedRecipientLocations',
                name: 'Recipient Location',
                scope: 'all',
                values: [mockLocation]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux recipient type filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const awardFilter = Object.assign({}, initialState, {
                recipientType: new Set(['small_business'])
            });

            topBarContainer.setProps({
                reduxFilters: awardFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'recipientType',
                name: 'Recipient Type',
                values: ['small_business']
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux award ID filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const awardIDFilter = Object.assign({}, initialState, {
                selectedAwardIDs: new OrderedMap({
                    601793: mockAwardId
                })
            });

            topBarContainer.setProps({
                reduxFilters: awardIDFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'selectedAwardIDs',
                name: 'Award ID',
                values: [mockAwardId]
            };

            expect(filterItem).toEqual(expectedFilterState);
        });

        it('should update component state with Redux award amount filters when available', () => {
            // mount the container with default props
            const topBarContainer = setup(defaultProps);

            expect(topBarContainer.state().filters).toHaveLength(0);

            const awardAmountFilter = Object.assign({}, initialState, {
                awardAmounts: new OrderedMap({
                    0: [0, 1000000],
                    1: [1000000, 25000000],
                    2: [25000000, 100000000],
                    3: [100000000, 500000000],
                    4: [500000000, 0]
                })
            });

            topBarContainer.setProps({
                reduxFilters: awardAmountFilter
            });

            expect(topBarContainer.state().filters).toHaveLength(1);

            const filterItem = topBarContainer.state().filters[0];
            const expectedFilterState = {
                code: 'awardAmounts',
                name: 'Award Amounts',
                values: {
                    0: [0, 1000000],
                    1: [1000000, 25000000],
                    2: [25000000, 100000000],
                    3: [100000000, 500000000],
                    4: [500000000, 0]
                }
            };

            expect(filterItem).toEqual(expectedFilterState);
        });
    });

    describe('filter removal', () => {
        it('should hide the top filter bar when all filters are cleared', () => {
            const initialFilters = Object.assign({}, initialState, {
                timePeriodType: 'fy', timePeriodFY: new Set(['2014'])
            });

            const topBarContainer = setup({
                reduxFilters: initialFilters,
                updateFilterCount: jest.fn()
            });

            expect(topBarContainer.find(TopFilterBar)).toHaveLength(1);

            // clear the filters
            topBarContainer.setProps({
                reduxFilters: Object.assign({}, initialState)
            });

            expect(topBarContainer.find(TopFilterBar)).toHaveLength(0);
        });
    });
});
