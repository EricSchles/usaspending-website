/**
 * RankVisualizationSectionContainer-test.jsx
 * Created by Kevin Li 2/12/17
 */

import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { Set } from 'immutable';

import { RankVisualizationSectionContainer } from
    'containers/search/visualizations/rank/RankVisualizationSectionContainer';
import RankVisualizationSection from
    'components/search/visualizations/rank/RankVisualizationSection';
import * as SearchHelper from 'helpers/searchHelper';

import { defaultFilters } from '../../../../testResources/defaultReduxFilters';
import { mockComponent, unmockComponent } from '../../../../testResources/mockComponent';

// force Jest to use native Node promises
// see: https://facebook.github.io/jest/docs/troubleshooting.html#unresolved-promises
global.Promise = require.requireActual('promise');

// spy on specific functions inside the component
const fetchDataSpy = sinon.spy(RankVisualizationSectionContainer.prototype, 'fetchData');

// we don't want to actually hit the API because tests should be fully controlled, so we will mock
// the SearchHelper functions
const mockSearchHelper = (functionName, event, expectedResponse) => {
    jest.useFakeTimers();
    // override the specified function
    SearchHelper[functionName] = jest.fn(() => {
        // Axios normally returns a promise, replicate this, but return the expected result
        const networkCall = new Promise((resolve, reject) => {
            process.nextTick(() => {
                if (event === 'resolve') {
                    resolve({
                        data: expectedResponse
                    });
                }
                else {
                    reject({
                        data: expectedResponse
                    });
                }
            });
        });

        return {
            promise: networkCall,
            cancel: jest.fn()
        };
    });
};

const unmockSearchHelper = () => {
    jest.useRealTimers();
    jest.unmock('helpers/searchHelper');
};

describe('RankVisualizationSectionContainer', () => {
    beforeAll(() => {
        // we need to use mount() on the container to get the lifecycle logic, but enzyme doesn't
        // support the child component's SVG manipulation methods. This replaces all the child
        // component's lifecycle methods with mocked functions to avoid traversal into the SVG
        // components.
        mockComponent(RankVisualizationSection);
    });

    it('should make an API request on mount', () => {
        // create a mock API response
        const apiResponse = {
            page_metadata: {
                num_pages: 1,
                page_number: 1,
                count: 2
            },
            results: [{
                item: 'First Agency',
                aggregate: '456'
            },
            {
                item: 'Second Agency',
                aggregate: '123'
            }],
            total_metadata: {
                count: 2
            }
        };

        // mock the search helper to resolve with the mocked response
        mockSearchHelper('performTransactionsTotalSearch', 'resolve', apiResponse);

        // mount the container
        const container =
            mount(<RankVisualizationSectionContainer reduxFilters={defaultFilters} />);

        // the mocked SearchHelper waits 1 tick to resolve the promise, so wait for the tick
        jest.runAllTicks();

        // everything should be updated now
        expect(fetchDataSpy.callCount).toEqual(1);

        // the page number should be equal to 1
        expect(container.state().page).toEqual(1);

        // reset the mocks and spies
        unmockSearchHelper();
        fetchDataSpy.reset();
    });

    it('should make an API request when the Redux filters change', () => {
        // create a mock API response
        const apiResponse = {
            page_metadata: {
                num_pages: 1,
                page_number: 1,
                count: 2
            },
            results: [{
                item: 'First Agency',
                aggregate: '456'
            },
            {
                item: 'Second Agency',
                aggregate: '123'
            }],
            total_metadata: {
                count: 2
            }
        };

        // mock the search helper to resolve with the mocked response
        mockSearchHelper('performTransactionsTotalSearch', 'resolve', apiResponse);

        const initialFilters = Object.assign({}, defaultFilters);
        const secondFilters = Object.assign({}, defaultFilters, {
            timePeriodType: 'fy',
            timePeriodFY: new Set(['2014', '2015'])
        });

        // mount the container
        const container =
            mount(<RankVisualizationSectionContainer reduxFilters={initialFilters} />);

        // wait for the first SearchHelper call to finish
        jest.runAllTicks();

        // the first API call should have been called
        expect(fetchDataSpy.callCount).toEqual(1);

        // the page number should be equal to 1
        expect(container.state().page).toEqual(1);

        // now update the props
        container.setProps({
            reduxFilters: secondFilters
        });

        // wait for the second SearchHelper call to finish
        jest.runAllTicks();
        // the first API call should have been called
        expect(fetchDataSpy.callCount).toEqual(2);

        // the page number should still be equal to 1
        expect(container.state().page).toEqual(1);

        // reset the mocks and spies
        unmockSearchHelper();
        fetchDataSpy.reset();
    });

    describe('parseData', () => {
        it('should properly restructure the API data for the rank visualization', () => {
            // create a mock API response
            const apiResponse = {
                page_metadata: {
                    num_pages: 1,
                    page_number: 1,
                    count: 2
                },
                results: [{
                    item: 'First Agency',
                    aggregate: '456',
                },
                {
                    item: 'Second Agency',
                    aggregate: '123'
                }],
                total_metadata: {
                    count: 2
                }
            };

            // mock the search helper to resolve with the mocked response
            mockSearchHelper('performTransactionsTotalSearch', 'resolve', apiResponse);
            // mount the container
            const container =
                mount(<RankVisualizationSectionContainer reduxFilters={defaultFilters} />);

            // wait for the SearchHelper promises to resolve
            jest.runAllTicks();
            // validate the state contains the correctly parsed values
            const expectedState = {
                loading: false,
                labelSeries: ['First Agency', 'Second Agency'],
                dataSeries: [456, 123],
                page: 1,
                total: 1,
                agencyScope: 'toptier'
            };

            expect(container.state()).toEqual(expectedState);
        });
    });

    describe('nextPage', () => {
        it('should trigger a new API call with an incremented page number', () => {
            // create a mock API response
            const apiResponse = {
                page_metadata: {
                    num_pages: 2,
                    page_number: 1,
                    count: 200
                },
                results: [{
                    item: 'First Agency',
                    aggregate: '456',
                },
                {
                    item: 'Second Agency',
                    aggregate: '123'
                }],
                total_metadata: {
                    count: 200
                }
            };

            // mock the search helper to resolve with the mocked response
            mockSearchHelper('performTransactionsTotalSearch', 'resolve', apiResponse);
            // mount the container
            const container =
                mount(<RankVisualizationSectionContainer reduxFilters={defaultFilters} />);
            // initial state should be page 1
            expect(container.state().page).toEqual(1);

            container.instance().nextPage();
            // updated state should be page 2
            expect(container.state().page).toEqual(2);
        });
    });

    describe('previousPage', () => {
        it('should trigger a new API call with a decremented page number', () => {
            // create a mock API response
            const apiResponse = {
                page_metadata: {
                    num_pages: 2,
                    page_number: 1,
                    count: 200
                },
                results: [{
                    item: 'First Agency',
                    aggregate: '456',
                },
                {
                    item: 'Second Agency',
                    aggregate: '123'
                }],
                total_metadata: {
                    count: 200
                }
            };

            // mock the search helper to resolve with the mocked response
            mockSearchHelper('performTransactionsTotalSearch', 'resolve', apiResponse);
            // mount the container
            const container =
                mount(<RankVisualizationSectionContainer reduxFilters={defaultFilters} />);
            container.setState({
                page: 5
            });

            // wait for the SearchHelper promises to resolve
            
            // we have simulated a starting state of page 5
            expect(container.state().page).toEqual(5);

            container.instance().previousPage();
            // updated state should be one less page
            expect(container.state().page).toEqual(4);
        });

        it('should never use a page number less than 1', () => {
            // create a mock API response
            const apiResponse = {
                page_metadata: {
                    num_pages: 2,
                    page_number: 1,
                    count: 200
                },
                results: [{
                    item: 'First Agency',
                    aggregate: '456',
                },
                {
                    item: 'Second Agency',
                    aggregate: '123'
                }],
                total_metadata: {
                    count: 200
                }
            };

            // mock the search helper to resolve with the mocked response
            mockSearchHelper('performTransactionsTotalSearch', 'resolve', apiResponse);
            // mount the container
            const container =
                mount(<RankVisualizationSectionContainer reduxFilters={defaultFilters} />);
            container.setState({
                page: 1
            });

            // wait for the SearchHelper promises to resolve
            
            // we have simulated a starting state of page 5
            expect(container.state().page).toEqual(1);

            container.instance().previousPage();
            // updated state should be 1
            expect(container.state().page).toEqual(1);
        });
    });

    describe('newSearch', () => {
        it('when Redux filters change, the page number should reset to 1', () => {
            // create a mock API response
            const apiResponse = {
                page_metadata: {
                    num_pages: 10,
                    page_number: 1,
                    count: 200
                },
                results: [{
                    item: 'First Agency',
                    aggregate: '456',
                },
                {
                    item: 'Second Agency',
                    aggregate: '123'
                }],
                total_metadata: {
                    count: 200
                }
            };

            const initialFilters = Object.assign({}, defaultFilters);
            const secondFilters = Object.assign({}, defaultFilters, {
                timePeriodType: 'fy',
                timePeriodFY: new Set(['2014', '2015'])
            });

            // mount the container
            const container =
                mount(<RankVisualizationSectionContainer reduxFilters={initialFilters} />);
            container.setState({
                page: 5
            });

            // assume we are starting on page 5
            expect(container.state().page).toEqual(5);

            // now update the props
            container.setProps({
                reduxFilters: secondFilters
            });

            // the page number should be reset to 1
            expect(container.state().page).toEqual(1);
            
        });
    });

    describe('changeScope', () => {
        it('should change the agency scope to the provided value', () => {
            const container =
                mount(<RankVisualizationSectionContainer reduxFilters={defaultFilters} />);

            // the default scope should be toptier
            expect(container.state().agencyScope).toEqual('toptier');

            // change the scope to subtier
            container.instance().changeScope('subtier');
            expect(container.state().agencyScope).toEqual('subtier');
        });

        it('should reset the page number to 1 when the agency scope changes', () => {
            const container =
                mount(<RankVisualizationSectionContainer reduxFilters={defaultFilters} />);
            container.setState({
                page: 5
            });

            // the default scope should be toptier
            expect(container.state().agencyScope).toEqual('toptier');
            expect(container.state().page).toEqual(5);

            // change the scope to subtier
            container.instance().changeScope('subtier');
            expect(container.state().agencyScope).toEqual('subtier');
            expect(container.state().page).toEqual(1);
        });
    });

    afterAll(() => {
        // restore the mocked component's lifecycle functions
        unmockComponent(RankVisualizationSection);
    });
});
