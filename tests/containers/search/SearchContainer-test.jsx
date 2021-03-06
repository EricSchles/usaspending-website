/**
 * SearchContainer-test.jsx
 * Created by Kevin Li 6/2/17
 */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Set } from 'immutable';

import { SearchContainer } from 'containers/search/SearchContainer';
import * as SearchHelper from 'helpers/searchHelper';
import { initialState } from 'redux/reducers/search/searchFiltersReducer';
import Router from 'containers/router/Router';

import { mockHash, mockFilters, mockRedux, mockActions } from './mockSearchHashes';

// force Jest to use native Node promises
// see: https://facebook.github.io/jest/docs/troubleshooting.html#unresolved-promises
global.Promise = require.requireActual('promise');

// spy on specific functions inside the component
const routerReplaceSpy = sinon.spy(Router.history, 'replace');

// mock the child component by replacing it with a function that returns a null element
jest.mock('components/search/SearchPage', () =>
    jest.fn(() => null));

jest.mock('helpers/searchHelper', () => require('./filters/searchHelper'));
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;


describe('SearchContainer', () => {
    it('should try to resolve the current URL hash on mount', () => {
        const container = shallow(<SearchContainer
            {...mockActions}
            {...mockRedux} />);

        const handleInitialUrl = jest.fn();
        container.instance().handleInitialUrl = handleInitialUrl;

        container.instance().componentWillMount();

        expect(handleInitialUrl).toHaveBeenCalledTimes(1);
    });

    it('should try to resolve the URL hash when new inbound hashes are passed in the URL', () => {
        const container = shallow(<SearchContainer
            {...mockActions}
            {...mockRedux} />);

        container.setState({
            hash: '22222'
        });

        const receiveHash = jest.fn();
        container.instance().receiveHash = receiveHash;

        container.instance().componentWillReceiveProps({
            params: {
                hash: '11111'
            }
        });

        expect(receiveHash).toHaveBeenCalledTimes(1);
    });

    it('should not try to resolve the URL hash again when the URL changes programmatically', () => {
        const container = shallow(<SearchContainer
            {...mockActions}
            {...mockRedux} />);

        container.setState({
            hash: '11111'
        });

        const receiveHash = jest.fn();
        container.instance().receiveHash = receiveHash;

        container.instance().componentWillReceiveProps({
            params: {
                hash: '11111'
            }
        });

        expect(receiveHash).toHaveBeenCalledTimes(0);
    });

    it('should try to generate a new URL hash when the Redux filters change', () => {
        const container = shallow(<SearchContainer
            {...mockActions}
            {...mockRedux} />);

        container.setState({
            hash: '',
            hashState: 'ready'
        });

        const nextFilters = Object.assign({}, initialState, {
            keyword: 'blerg'
        });

        const nextProps = Object.assign({}, mockRedux, mockActions, {
            filters: nextFilters
        });

        const generateHash = jest.fn();
        container.instance().generateHash = generateHash;

        container.instance().componentWillReceiveProps(nextProps);

        expect(generateHash).toHaveBeenCalledTimes(1);
    });

    describe('handleInitialUrl', () => {
        it('should attempt to generate a hash from the existing Redux filters if no URL hash is found', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const generateInitialHash = jest.fn();
            container.instance().generateInitialHash = generateInitialHash;

            container.instance().handleInitialUrl('');

            expect(generateInitialHash).toHaveBeenCalledTimes(1);
        });
        it('should attempt to restore the filter set based on the current URL hash', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const requestFilters = jest.fn();
            container.instance().requestFilters = requestFilters;

            container.instance().handleInitialUrl('2222');

            expect(requestFilters).toHaveBeenCalledTimes(1);
        });
    });

    describe('generateInitialHash', () => {
        it('should use a hashless search URL if no filters are applied', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const generateHash = jest.fn();
            container.instance().generateHash = generateHash;

            routerReplaceSpy.reset();
            container.instance().generateInitialHash();
            expect(routerReplaceSpy.callCount).toEqual(1);
            expect(routerReplaceSpy.calledWith('/search')).toBeTruthy();
            routerReplaceSpy.reset();

            expect(generateHash).toHaveBeenCalledTimes(0);
        });

        it('should generate a hash if there are filters applied', () => {
            const filters = Object.assign({}, initialState, {
                keyword: 'blerg'
            });

            const redux = Object.assign({}, mockRedux, {
                filters
            });

            const container = shallow(<SearchContainer
                {...mockActions}
                {...redux} />);

            const generateHash = jest.fn();
            container.instance().generateHash = generateHash;

            container.instance().generateInitialHash();

            expect(generateHash).toHaveBeenCalledTimes(1);
        });
    });

    describe('receiveHash', () => {
        it('should request filters for the given hash', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const requestFilters = jest.fn();
            container.instance().requestFilters = requestFilters;

            container.instance().receiveHash('222');

            expect(requestFilters).toHaveBeenCalledTimes(1);
        });

        it('should do nothing if no hash is provided', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const requestFilters = jest.fn();
            container.instance().requestFilters = requestFilters;

            container.instance().receiveHash('');

            expect(requestFilters).toHaveBeenCalledTimes(0);
        });
    });

    describe('provideHash', () => {
        it('should update the URL to the given hash', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            routerReplaceSpy.reset();
            container.instance().provideHash('12345');
            expect(routerReplaceSpy.callCount).toEqual(1);
            expect(routerReplaceSpy.calledWith('/search/12345')).toBeTruthy();
            routerReplaceSpy.reset();

            expect(container.state().hash).toEqual('12345');
        });
    });

    describe('applyFilters', () => {
        it('should stop if the versions do not match', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const mockResponse = Object.assign({}, mockFilters, {
                filter: {
                    version: -1000
                }
            });

            container.setState({
                hashState: 'inbound'
            });
            container.instance().applyFilters(mockResponse.filter);

            expect(container.state().hashState).toEqual('inbound');
        });

        it('should trigger a Redux action to apply the filters', () => {
            const populateAction = jest.fn();

            const actions = {
                populateAllSearchFilters: populateAction
            };

            const container = shallow(<SearchContainer
                {...actions}
                {...mockRedux} />);

            container.setState({
                hashState: 'inbound'
            });
            container.instance().applyFilters(mockFilters.filter);

            const expectedFilters = Object.assign({}, initialState, {
                timePeriodFY: new Set(['2017'])
            });

            expect(populateAction).toHaveBeenCalledTimes(1);
            expect(populateAction).toHaveBeenCalledWith(expectedFilters);
            expect(container.state().hashState).toEqual('ready');
        });
    });

    describe('determineIfUnfiltered', () => {
        it('should return true if no filters are applied', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const unfiltered = container.instance().determineIfUnfiltered(initialState);
            expect(unfiltered).toBeTruthy();
        });
        it('should return false if filters have been applied', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            const modifiedState = Object.assign({}, initialState, {
                keyword: 'blerg'
            });

            const unfiltered = container.instance().determineIfUnfiltered(modifiedState);
            expect(unfiltered).toBeFalsy();
        });
    });

    describe('parseUpdateDate', () => {
        it('should format the API response correctly and set the state', () => {
            const container = shallow(<SearchContainer
                {...mockActions}
                {...mockRedux} />);

            container.instance().parseUpdateDate('01/01/1984');
            expect(container.state().lastUpdate).toEqual('January 1, 1984');
        });
    });
});
