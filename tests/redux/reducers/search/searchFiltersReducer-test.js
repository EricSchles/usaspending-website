/**
 * searchFiltersReducer-test.js
 * Created by Kevin Li 1/17/17
 */

import { Set, OrderedMap } from 'immutable';

import searchFiltersReducer, { initialState } from 'redux/reducers/search/searchFiltersReducer';
import { awardRanges } from 'dataMapping/search/awardAmount';
import { objectClassDefinitions } from 'dataMapping/search/budgetCategory';

import { mockRecipient, mockAgency } from './mock/mockFilters';

describe('searchFiltersReducer', () => {
    it('should return the initial state by default', () => {
        expect(
            searchFiltersReducer(undefined, {})
        ).toEqual(initialState);
    });

    describe('TOGGLE_SEARCH_FILTER_AWARD_TYPE', () => {
        const action = {
            type: 'TOGGLE_SEARCH_FILTER_AWARD_TYPE',
            awardType: '09'
        };

        it('should add a value if it does not currently exist in the set', () => {
            const startingState = Object.assign({}, initialState);

            expect(
                searchFiltersReducer(startingState, action).awardType
            ).toEqual(new Set([
                '09'
            ]));
        });

        it('should remove a value if currently exists in the set', () => {
            const startingState = Object.assign({}, initialState, {
                awardType: new Set(['09'])
            });

            expect(
                searchFiltersReducer(startingState, action).awardType
            ).toEqual(new Set([]));
        });
    });

    describe('BULK_SEACH_FILTER_AWARD_TYPE', () => {
        it('should add the provided values when the direction is "add"', () => {
            const action = {
                type: 'BULK_SEARCH_FILTER_AWARD_TYPE',
                awardTypes: [
                    '10',
                    '06'
                ],
                direction: 'add'
            };

            const startingState = Object.assign({}, initialState);

            expect(
                searchFiltersReducer(startingState, action).awardType
            ).toEqual(new Set([
                '10',
                '06'
            ]));
        });

        it('should remove the provided values when the direction is "remove"', () => {
            const action = {
                type: 'BULK_SEARCH_FILTER_AWARD_TYPE',
                awardTypes: [
                    '10',
                    '06'
                ],
                direction: 'remove'
            };

            const startingState = Object.assign({}, initialState, {
                awardType: new Set(['09', '10', '06'])
            });

            expect(
                searchFiltersReducer(startingState, action).awardType
            ).toEqual(new Set([
                '09'
            ]));
        });
    });

    describe('UPDATE_SEARCH_FILTER_TIME_PERIOD', () => {
        it('should set the time period value to the provided action data', () => {
            const action = {
                type: 'UPDATE_SEARCH_FILTER_TIME_PERIOD',
                dateType: 'fy',
                fy: [
                    '2017',
                    '2015',
                    '2013'
                ],
                start: null,
                end: null
            };

            const expected = {
                timePeriodType: 'fy',
                timePeriodFY: new Set([
                    '2017',
                    '2015',
                    '2013'
                ]),
                timePeriodStart: null,
                timePeriodEnd: null
            };

            const updatedState = searchFiltersReducer(undefined, action);

            Object.keys(expected).forEach((key) => {
                expect(updatedState[key]).toEqual(expected[key]);
            });
        });
    });

    describe('UPDATE_TEXT_SEARCH', () => {
        it('should set the keyword filter option to the input string', () => {
            const action = {
                type: 'UPDATE_TEXT_SEARCH',
                textInput: 'business'
            };

            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.keyword).toEqual('business');
        });
    });

    describe('UPDATE_SELECTED_LOCATIONS', () => {
        const action = {
            type: 'UPDATE_SELECTED_LOCATIONS',
            location: {
                matched_ids: [2, 3],
                place_type: 'CITY',
                parent: 'INDIANA',
                place: 'PAWNEE'
            }
        };

        const cityId = `2,3_PAWNEE_CITY`;

        const expectedCity = {
            matched_ids: [2, 3],
            place_type: 'CITY',
            parent: 'INDIANA',
            place: 'PAWNEE',
            identifier: cityId
        };

        it('should add the provided location if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.selectedLocations).toEqual(new OrderedMap({
                [cityId]: expectedCity
            }));
        });

        it('should remove the provided location if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedLocations: new OrderedMap({
                    [cityId]: expectedCity
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedLocations).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_DOMESTIC_FOREIGN', () => {
        it('should set the domestic/foreign filter scope to the input string', () => {
            const action = {
                type: 'UPDATE_DOMESTIC_FOREIGN',
                selection: 'domestic'
            };

            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.locationDomesticForeign).toEqual('domestic');
        });
    });

    describe('UPDATE_SELECTED_BUDGET_FUNCTIONS', () => {
        const action = {
            type: 'UPDATE_SELECTED_BUDGET_FUNCTIONS',
            budgetFunction: {
                title: 'Income Security',
                functionType: 'Function'
            }
        };

        const identifier = 'Income Security';

        const expectedValue = {
            title: 'Income Security',
            functionType: 'Function'
        };

        it('should add the provided budget function if it does not currently exist in the filter',
            () => {
                const updatedState = searchFiltersReducer(undefined, action);
                expect(updatedState.budgetFunctions).toEqual(new OrderedMap({
                    [identifier]: expectedValue
                }));
            });

        it('should remove the provided budget function if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                budgetFunctions: new OrderedMap({
                    [identifier]: expectedValue
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.budgetFunctions).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_SELECTED_FEDERAL_ACCOUNTS', () => {
        const action = {
            type: 'UPDATE_SELECTED_FEDERAL_ACCOUNTS',
            federalAccount: {
                id: '392',
                agency_identifier: '012',
                main_account_code: '3539',
                account_title: 'Child Nutrition Programs, Food Nutrition Service, Agriculture'
            }
        };

        const identifier = '392';

        const expectedValue = {
            id: '392',
            agency_identifier: '012',
            main_account_code: '3539',
            account_title: 'Child Nutrition Programs, Food Nutrition Service, Agriculture'
        };

        it('should add the provided federal account if it does not currently exist in the filter',
            () => {
                const updatedState = searchFiltersReducer(undefined, action);
                expect(updatedState.federalAccounts).toEqual(new OrderedMap({
                    [identifier]: expectedValue
                }));
            });

        it('should remove the provided federal account if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                federalAccounts: new OrderedMap({
                    [identifier]: expectedValue
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.federalAccounts).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_SELECTED_OBJECT_CLASSES', () => {
        const action = {
            type: 'UPDATE_SELECTED_OBJECT_CLASSES',
            objectClass: '110'
        };

        const identifier = '110';

        it('should add the provided federal account if it does not currently exist in the filter',
            () => {
                const updatedState = searchFiltersReducer(undefined, action);
                expect(updatedState.objectClasses).toEqual(new Set(
                    [identifier]
                ));
            });

        it('should remove the provided federal account if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                objectClasses: new Set(
                    [identifier]
                )
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.objectClasses).toEqual(new Set());
        });
    });

    describe('UPDATE_SELECTED_AWARDING_AGENCIES', () => {
        const action = {
            type: 'UPDATE_SELECTED_AWARDING_AGENCIES',
            agency: mockAgency
        };

        const agency = "1788_subtier";

        const expectedAgency = mockAgency;

        it('should add the provided agency if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);

            expect(updatedState.selectedAwardingAgencies).toEqual(
                new OrderedMap([[agency, expectedAgency]])
            );
        });

        it('should remove the provided agency if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedAwardingAgencies: new OrderedMap([[agency, expectedAgency]])
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedAwardingAgencies).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_SELECTED_FUNDING_AGENCIES', () => {
        const action = {
            type: 'UPDATE_SELECTED_FUNDING_AGENCIES',
            agency: mockAgency
        };

        const agency = "1788_subtier";

        const expectedAgency = mockAgency;

        it('should add the provided agency if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);

            expect(updatedState.selectedFundingAgencies).toEqual(
                new OrderedMap([[agency, expectedAgency]])
            );
        });

        it('should remove the provided agency if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedFundingAgencies: new OrderedMap([[agency, expectedAgency]])
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedFundingAgencies).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_SELECTED_RECIPIENTS', () => {
        const action = {
            type: 'UPDATE_SELECTED_RECIPIENTS',
            recipient: mockRecipient
        };

        const recipient = '2222';

        const expectedRecipient = mockRecipient;

        it('should add the Recipient if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);

            expect(updatedState.selectedRecipients).toEqual(
                new OrderedMap([[recipient, expectedRecipient]])
            );
        });

        it('should remove the Recipient if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedRecipients: new OrderedMap([[recipient, expectedRecipient]])
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedRecipients).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_RECIPIENT_DOMESTIC_FORIEGN', () => {
        it('should set the Recipient domestic/foreign filter ' +
            'scope to the input string', () => {
            const action = {
                type: 'UPDATE_RECIPIENT_DOMESTIC_FORIEGN',
                selection: 'domestic'
            };

            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.recipientDomesticForeign).toEqual('domestic');
        });
    });

    describe('UPDATE_RECIPIENT_LOCATIONS', () => {
        const action = {
            type: 'UPDATE_RECIPIENT_LOCATIONS',
            location: {
                place_type: "COUNTY",
                matched_ids: [22796],
                place: "McLean",
                parent: "KENTUCKY"
            }
        };

        const recipientCityId = `22796_McLean_COUNTY`;

        const expectedRecipientCity = {
            place_type: "COUNTY",
            matched_ids: [22796],
            place: "McLean",
            parent: "KENTUCKY",
            identifier: recipientCityId
        };

        it('should add the provided location if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.selectedRecipientLocations).toEqual(new OrderedMap({
                [recipientCityId]: expectedRecipientCity
            }));
        });

        it('should remove the provided location if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedRecipientLocations: new OrderedMap({
                    [recipientCityId]: expectedRecipientCity
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedRecipientLocations).toEqual(new OrderedMap());
        });
    });

    describe('TOGGLE_SEARCH_FILTER_RECIPIENT_TYPE', () => {
        const action = {
            type: 'TOGGLE_SEARCH_FILTER_RECIPIENT_TYPE',
            recipientType: 'small_business'
        };

        it('should add a value if it does not currently exist in the set', () => {
            const startingState = Object.assign({}, initialState);

            expect(
                searchFiltersReducer(startingState, action).recipientType
            ).toEqual(new Set([
                'small_business'
            ]));
        });

        it('should remove a value if currently exists in the set', () => {
            const startingState = Object.assign({}, initialState, {
                recipientType: new Set(['small_business'])
            });

            expect(
                searchFiltersReducer(startingState, action).recipientType
            ).toEqual(new Set([]));
        });
    });

    describe('BULK_SEARCH_FILTER_RECIPIENT_TYPES', () => {
        it('should add the provided values when the direction is "add"', () => {
            const action = {
                type: 'BULK_SEARCH_FILTER_RECIPIENT_TYPES',
                recipientTypes: [
                    'small_business',
                    'other_than_small_business'
                ],
                direction: 'add'
            };

            const startingState = Object.assign({}, initialState);

            expect(
                searchFiltersReducer(startingState, action).recipientType
            ).toEqual(new Set([
                'small_business',
                'other_than_small_business'
            ]));
        });

        it('should remove the provided values when the direction is "remove"', () => {
            const action = {
                type: 'BULK_SEARCH_FILTER_RECIPIENT_TYPES',
                recipientTypes: [
                    'small_business',
                    'other_than_small_business'
                ],
                direction: 'remove'
            };

            const startingState = Object.assign({}, initialState, {
                recipientType: new Set([
                    'small_business',
                    'other_than_small_business',
                    'alaskan_native_owned_business'
                ])
            });

            expect(
                searchFiltersReducer(startingState, action).recipientType
            ).toEqual(new Set([
                'alaskan_native_owned_business'
            ]));
        });
    });

    describe('UPDATE_SELECTED_AWARD_IDS', () => {
        const action = {
            type: 'UPDATE_SELECTED_AWARD_IDS',
            awardID: {
                id: "601793",
                piid: "AG3142B100012",
                fain: null,
                uri: null
            }
        };

        const awardIDID = "601793";

        const expectedAwardID = {
            id: "601793",
            piid: "AG3142B100012",
            fain: null,
            uri: null
        };

        it('should add the provided award ID if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.selectedAwardIDs).toEqual(new OrderedMap({
                [awardIDID]: expectedAwardID
            }));
        });

        it('should remove the provided award ID if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedAwardIDs: new OrderedMap({
                    [awardIDID]: expectedAwardID
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedAwardIDs).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_AWARD_AMOUNTS', () => {
        const predefinedRangeAction = {
            type: 'UPDATE_AWARD_AMOUNTS',
            awardAmounts: {
                amount: "range-1",
                searchType: 'range'
            }
        };

        const specificRangeAction = {
            type: 'UPDATE_AWARD_AMOUNTS',
            awardAmounts: {
                amount: [10000, 20000],
                searchType: 'specific'
            }
        };

        const predefinedAwardAmount = "range-1";
        const expectedpredefinedAwardAmount = awardRanges[predefinedAwardAmount];

        const specificAwardAmount = [10000, 20000];

        it('should add the predefined Award Amount ' +
            'if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, predefinedRangeAction);
            expect(updatedState.awardAmounts).toEqual(new OrderedMap({
                [predefinedAwardAmount]: expectedpredefinedAwardAmount
            }));
        });

        it('should remove the predefined Award Amount ' +
            'if it already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                awardAmounts: new OrderedMap({
                    [predefinedAwardAmount]: expectedpredefinedAwardAmount
                })
            });

            const updatedState = searchFiltersReducer(startingState, predefinedRangeAction);
            expect(updatedState.selectedAwardIDs).toEqual(new OrderedMap());
        });

        it('should add the specific Award Amount ' +
            'if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, specificRangeAction);
            expect(updatedState.awardAmounts).toEqual(new OrderedMap({
                specific: specificAwardAmount
            }));
        });

        it('should remove the specific Award Amount ' +
            'if it already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                awardAmounts: new OrderedMap({
                    specific: specificAwardAmount
                })
            });

            const updatedState = searchFiltersReducer(startingState, specificRangeAction);
            expect(updatedState.selectedAwardIDs).toEqual(new OrderedMap());
        });

        it('should remove a specific Award Amount ' +
            'if a predefined Award Amount is specified', () => {
            const startingState = Object.assign({}, initialState, {
                awardAmounts: new OrderedMap({
                    specific: specificAwardAmount
                })
            });

            const updatedState = searchFiltersReducer(startingState, predefinedRangeAction);
            expect(updatedState.awardAmounts).toEqual(new OrderedMap({
                [predefinedAwardAmount]: expectedpredefinedAwardAmount
            }));
        });

        it('should remove a predefined Award Amount ' +
            'if a specific Award Amount is specified', () => {
            const startingState = Object.assign({}, initialState, {
                awardAmounts: new OrderedMap({
                    [predefinedAwardAmount]: expectedpredefinedAwardAmount
                })
            });

            const updatedState = searchFiltersReducer(startingState, specificRangeAction);
            expect(updatedState.awardAmounts).toEqual(new OrderedMap({
                specific: specificAwardAmount
            }));
        });
    });

    describe('UPDATE_SELECTED_CFDA', () => {
        const action = {
            type: 'UPDATE_SELECTED_CFDA',
            cfda: {
                identifier: "10.101",
                program_number: "10.101",
                popular_name: "",
                program_title: "Hawaii Sugar Disaster Program"
            }
        };

        const cfdaNum = "10.101";

        const expectedCFDA = {
            identifier: "10.101",
            program_number: "10.101",
            popular_name: "",
            program_title: "Hawaii Sugar Disaster Program"
        };

        it('should add the provided cfda if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.selectedCFDA).toEqual(new OrderedMap({
                [cfdaNum]: expectedCFDA
            }));
        });

        it('should remove the provided cfda if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedCFDA: new OrderedMap({
                    [cfdaNum]: expectedCFDA
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedCFDA).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_SELECTED_NAICS', () => {
        const action = {
            type: 'UPDATE_SELECTED_NAICS',
            naics: {
                identifier: "333318",
                naics: "333318",
                naics_description: "OTHER COMMERCIAL AND SERVICE INDUSTRY MACHINERY MANUFACTURING"
            }
        };

        const naicsNum = "333318";

        const expectedNAICS = {
            identifier: "333318",
            naics: "333318",
            naics_description: "OTHER COMMERCIAL AND SERVICE INDUSTRY MACHINERY MANUFACTURING"
        };

        it('should add the provided naics if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.selectedNAICS).toEqual(new OrderedMap({
                [naicsNum]: expectedNAICS
            }));
        });

        it('should remove the provided naics if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedNAICS: new OrderedMap({
                    [naicsNum]: expectedNAICS
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedNAICS).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_SELECTED_PSC', () => {
        const action = {
            type: 'UPDATE_SELECTED_PSC',
            psc: {
                product_or_service_code: "1375"
            }
        };

        const pscNum = "1375";

        const expectedPSC = {
            identifier: "1375",
            product_or_service_code: "1375"
        };

        it('should add the provided psc if it does not currently exist in the filter', () => {
            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.selectedPSC).toEqual(new OrderedMap({
                [pscNum]: expectedPSC
            }));
        });

        it('should remove the provided psc if already exists in the filter', () => {
            const startingState = Object.assign({}, initialState, {
                selectedPSC: new OrderedMap({
                    [pscNum]: expectedPSC
                })
            });

            const updatedState = searchFiltersReducer(startingState, action);
            expect(updatedState.selectedPSC).toEqual(new OrderedMap());
        });
    });

    describe('UPDATE_SEARCH_FILTER_GENERIC', () => {
        it('should set an arbitrary child filter key with the given filter value', () => {
            const action = {
                type: 'UPDATE_SEARCH_FILTER_GENERIC',
                filterType: 'timePeriodType',
                filterValue: 'dr'
            };

            const updatedState = searchFiltersReducer(undefined, action);
            expect(updatedState.timePeriodType).toEqual('dr');
        });
    });

    describe('RESET_SEARCH_TIME_FILTER', () => {
        it('should reset the fields relevant to time period filtering to their initial state'
        + ' values after fiscal years change', () => {
            const firstAction = {
                type: 'UPDATE_SEARCH_FILTER_TIME_PERIOD',
                dateType: 'fy',
                fy: [
                    '2017',
                    '2015',
                    '2013'
                ],
                start: null,
                end: null
            };

            const resetAction = {
                type: 'RESET_SEARCH_TIME_FILTER'
            };

            const expectedFirst = {
                timePeriodType: 'fy',
                timePeriodFY: new Set([
                    '2017',
                    '2015',
                    '2013'
                ]),
                timePeriodStart: null,
                timePeriodEnd: null
            };

            const expectedSecond = {
                timePeriodType: 'fy',
                timePeriodFY: new Set(),
                timePeriodStart: null,
                timePeriodEnd: null
            };

            // perform the first action to change the time period filter values
            let updatedState = searchFiltersReducer(undefined, firstAction);
            // validate that the search filters changed
            Object.keys(expectedFirst).forEach((key) => {
                expect(updatedState[key]).toEqual(expectedFirst[key]);
            });


            // reset the time period filters
            updatedState = searchFiltersReducer(updatedState, resetAction);
            // validate that the search filters reset
            Object.keys(expectedSecond).forEach((key) => {
                expect(updatedState[key]).toEqual(expectedSecond[key]);
            });
        });

        it('should reset the fields relevant to time period filtering to their initial state'
        + ' values after a date range changes', () => {
            const firstAction = {
                type: 'UPDATE_SEARCH_FILTER_TIME_PERIOD',
                dateType: 'dr',
                fy: [],
                start: '2016-01-01',
                end: '2016-12-31'
            };

            const resetAction = {
                type: 'RESET_SEARCH_TIME_FILTER'
            };

            const expectedFirst = {
                timePeriodType: 'dr',
                timePeriodFY: new Set(),
                timePeriodStart: '2016-01-01',
                timePeriodEnd: '2016-12-31'
            };

            const expectedSecond = {
                timePeriodType: 'fy',
                timePeriodFY: new Set(),
                timePeriodStart: null,
                timePeriodEnd: null
            };

            // perform the first action to change the time period filter values
            let updatedState = searchFiltersReducer(undefined, firstAction);
            // validate that the search filters changed
            Object.keys(expectedFirst).forEach((key) => {
                expect(updatedState[key]).toEqual(expectedFirst[key]);
            });


            // reset the time period filters
            updatedState = searchFiltersReducer(updatedState, resetAction);
            // validate that the search filters reset
            Object.keys(expectedSecond).forEach((key) => {
                expect(updatedState[key]).toEqual(expectedSecond[key]);
            });
        });
    });

    describe('CLEAR_SEARCH_FILTER_TYPE', () => {
        it('should reset a single search filter to its initial state value', () => {
            const firstAction = {
                type: 'UPDATE_SEARCH_FILTER_GENERIC',
                filterType: 'awardType',
                filterValue: new Set(['03', '04'])
            };

            const clearAction = {
                type: 'CLEAR_SEARCH_FILTER_TYPE',
                filterType: 'awardType'
            };

            const firstExpected = new Set(['03', '04']);
            const secondExpected = new Set();

            // perform the first action that updates the award type filter
            let updatedState = searchFiltersReducer(undefined, firstAction);
            expect(updatedState.awardType).toEqual(firstExpected);

            // perform the clear action to reset the award type filter value
            updatedState = searchFiltersReducer(updatedState, clearAction);
            expect(updatedState.awardType).toEqual(secondExpected);
        });
    });

    describe('CLEAR_SEARCH_FILTER_ALL', () => {
        it('should reset the search filters to the initial state after multiple actions have been'
            + ' performed', () => {
            const firstAction = {
                type: 'UPDATE_DOMESTIC_FOREIGN',
                selection: 'domestic'
            };

            const secondAction = {
                type: 'UPDATE_SEARCH_FILTER_TIME_PERIOD',
                dateType: 'fy',
                fy: [
                    '2017',
                    '2015',
                    '2013'
                ],
                start: null,
                end: null
            };

            const firstExpected = 'domestic';
            const secondExpected = {
                timePeriodType: 'fy',
                timePeriodFY: new Set([
                    '2017',
                    '2015',
                    '2013'
                ]),
                timePeriodStart: null,
                timePeriodEnd: null
            };

            // perform the first action that updates the domestic/foreign scope
            let updatedState = searchFiltersReducer(undefined, firstAction);
            expect(updatedState.locationDomesticForeign).toEqual(firstExpected);

            // perform the second action to modify the time period
            updatedState = searchFiltersReducer(updatedState, secondAction);
            Object.keys(secondExpected).forEach((key) => {
                expect(updatedState[key]).toEqual(secondExpected[key]);
            });

            // validate that the changes from the first action remained
            expect(updatedState.locationDomesticForeign).toEqual(firstExpected);

            // reset the state to its initial value
            const finalAction = {
                type: 'CLEAR_SEARCH_FILTER_ALL'
            };
            updatedState = searchFiltersReducer(updatedState, finalAction);
            expect(updatedState).toEqual(initialState);
        });
    });

    describe('POPULATE_ALL_SEARCH_FILTERS', () => {
        it('should create a brand new state based on the initial state with the provided inputs', () => {
            const originalState = Object.assign({}, initialState);
            originalState.keyword = 'hello';
            originalState.recipientDomesticForeign = 'foreign';
            originalState.awardType = new Set(['A', 'B']);

            let state = searchFiltersReducer(originalState, {});
            expect(state.keyword).toEqual('hello');
            expect(state.recipientDomesticForeign).toEqual('foreign');
            expect(state.awardType).toEqual(new Set(['A', 'B']));

            const action = {
                type: 'POPULATE_ALL_SEARCH_FILTERS',
                filters: {
                    keyword: 'bye',
                    recipientDomesticForeign: 'domestic'
                }
            };
            state = searchFiltersReducer(state, action);
            expect(state.keyword).toEqual('bye');
            expect(state.recipientDomesticForeign).toEqual('domestic');
            expect(state.awardType).toEqual(new Set([]));
        });
    });
});
