/**
 * AwardIDListContainer-test.jsx
 * Created by michaelbray on 3/7/17.
 */

import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { OrderedMap } from 'immutable';

import { AwardIDListContainer } from 'containers/search/filters/awardID/AwardIDListContainer';
import * as awardIDActions from 'redux/actions/search/awardIDActions';

jest.mock('helpers/searchHelper', () => require('../searchHelper'));
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const setup = (props) => mount(<AwardIDListContainer {...props} />);

const initialFilters = {
    piid: [],
    fain: [],
    uri: [],
    parent_award__piid: []
};

describe('AwardIDListContainer', () => {
    describe('Handling text input', () => {
        it('should handle text input after 300ms', () => {
            // setup the award ID list container and call the function to type a single letter
            const awardIDListContainer = setup({
                reduxFilters: initialFilters,
                setAutocompleteAwardIDs: awardIDActions.setAutocompleteAwardIDs,
                toggleAwardID: jest.fn()
            });

            const searchQuery = {
                target: {
                    value: '100'
                }
            };

            const handleTextInputSpy = sinon.spy(awardIDListContainer.instance(),
                'handleTextInput');

            // Call handleTextInput function
            awardIDListContainer.instance().handleTextInput(searchQuery);

            // Run fake timer for input delay
            jest.useFakeTimers().runTimersToTime(1000);

            // the mocked SearchHelper waits 1 tick to resolve the promise, so wait for the tick
            jest.runAllTicks();

            // everything should be updated now
            expect(handleTextInputSpy.callCount).toEqual(1);

            // reset the spies
            handleTextInputSpy.reset();
        });

        it('should call the queryAutocompleteAwardIDs method 300ms after text input', () => {
            // setup the award ID list container and call the function to type a single letter
            const awardIDListContainer = setup({
                reduxFilters: initialFilters,
                setAutocompleteAwardIDs: awardIDActions.setAutocompleteAwardIDs,
                toggleAwardID: jest.fn()
            });

            const searchQuery = {
                target: {
                    value: '100'
                }
            };

            const handleTextInputSpy = sinon.spy(awardIDListContainer.instance(),
                'handleTextInput');
            const queryAutocompleteAwardIDsSpy = sinon.spy(awardIDListContainer.instance(),
                'queryAutocompleteAwardIDs');

            // Call handleTextInput function
            awardIDListContainer.instance().handleTextInput(searchQuery);

            // Run fake timer for input delay
            jest.useFakeTimers().runTimersToTime(1000);

            // the mocked SearchHelper waits 1 tick to resolve the promise, so wait for the tick
            jest.runAllTicks();

            // everything should be updated now
            expect(handleTextInputSpy.callCount).toEqual(1);
            expect(queryAutocompleteAwardIDsSpy.callCount).toEqual(1);

            // reset the spies
            handleTextInputSpy.reset();
            queryAutocompleteAwardIDsSpy.reset();
        });

        it('should not search when only one character has been input', () => {
            // setup mock redux actions for handling search results
            const mockReduxAction = jest.fn();

            // setup the award ID list container and call the function to type a single letter
            const awardIDListContainer = setup({
                reduxFilters: initialFilters,
                setAutocompleteAwardIDs: mockReduxAction,
                toggleAwardID: jest.fn()
            });

            const queryAutocompleteAwardIDsSpy = sinon.spy(awardIDListContainer.instance(),
                'queryAutocompleteAwardIDs');
            const handleTextInputSpy = sinon.spy(awardIDListContainer.instance(),
                'handleTextInput');

            const searchQuery = {
                target: {
                    value: '100'
                }
            };
            awardIDListContainer.instance().handleTextInput(searchQuery);

            // Run fake timer for input delay
            jest.useFakeTimers().runTimersToTime(1000);

            // everything should be updated now
            expect(handleTextInputSpy.callCount).toEqual(1);
            expect(queryAutocompleteAwardIDsSpy.callCount).toEqual(1);
            expect(mockReduxAction).toHaveBeenCalledTimes(1);

            // reset the mocks and spies
            handleTextInputSpy.reset();
            queryAutocompleteAwardIDsSpy.reset();
        });

        it('should search Award IDs when more than one character has ' +
            'been input in the Award ID field', () => {
            // setup mock redux actions for handling search results
            const mockReduxActionFunding = jest.fn();

            // setup the award ID list container and call the function to type a single letter
            const awardIDListContainer = setup({
                reduxFilters: initialFilters,
                setAutocompleteAwardIDs: mockReduxActionFunding,
                selectedAwardIDs: new OrderedMap(),
                toggleAwardID: jest.fn()
            });

            // set up spies
            const handleTextInputSpy = sinon.spy(awardIDListContainer.instance(),
                'handleTextInput');
            const queryAutocompleteAwardIDsSpy = sinon.spy(awardIDListContainer.instance(),
                'queryAutocompleteAwardIDs');

            const searchQuery = {
                target: {
                    value: '100'
                }
            };
            awardIDListContainer.instance().handleTextInput(searchQuery);

            // Run fake timer for input delay
            jest.useFakeTimers().runTimersToTime(300);

            // Run fake timer for input delay
            jest.runAllTicks();

            // everything should be updated now
            expect(handleTextInputSpy.callCount).toEqual(1);
            expect(queryAutocompleteAwardIDsSpy.calledWith(handleTextInputSpy));

            // Reset spies
            handleTextInputSpy.reset();
            queryAutocompleteAwardIDsSpy.reset();
        });

        it('should populate Award IDs after performing the search', async () => {
            // Setup redux state
            const reduxState = [
                {
                    id: "601793",
                    date_signed__fy: null,
                    data_source: null,
                    type: "U",
                    type_description: "Unknown Type",
                    piid: "AG3142B100012",
                    fain: null,
                    uri: null,
                    total_obligation: null,
                    total_outlay: null,
                    date_signed: null,
                    description: null,
                    period_of_performance_start_date: null,
                    period_of_performance_current_end_date: null,
                    potential_total_value_of_award: null,
                    last_modified_date: null,
                    certified_date: null,
                    create_date: "2017-02-28T18:01:59.717954Z",
                    update_date: "2017-02-28T18:01:59.717969Z",
                    parent_award: null,
                    awarding_agency: {
                        id: 999,
                        create_date: "2017-01-12T19:56:26.723000Z",
                        update_date: "2017-01-12T19:56:26.723000Z",
                        toptier_agency: {
                            toptier_agency_id: 155,
                            create_date: null,
                            update_date: null,
                            cgac_code: "012",
                            fpds_code: "1200",
                            name: "AGRICULTURE, DEPARTMENT OF"
                        },
                        subtier_agency: {
                            subtier_agency_id: 865,
                            create_date: null,
                            update_date: null,
                            subtier_code: "1205",
                            name: "USDA, OFFICE OF THE CHIEF FINANCIAL OFFICER"
                        },
                        office_agency: null
                    },
                    funding_agency: null,
                    recipient: null,
                    place_of_performance: null,
                    latest_submission: null
                }];

            // setup mock redux actions for handling search results
            const mockReduxAction = jest.fn((args) => {
                expect(args).toEqual(reduxState);
            });

            // setup the award ID list container and call the function to type a single letter
            const awardIDListContainer = setup({
                reduxFilters: initialFilters,
                setAutocompleteAwardIDs: mockReduxAction,
                piid: reduxState,
                selectedAwardIDs: new OrderedMap(),
                toggleAwardID: jest.fn()
            });

            // Set up spies
            const queryAutocompleteAwardIDsSpy = sinon.spy(awardIDListContainer.instance(),
                'queryAutocompleteAwardIDs');
            const parseAutocompleteAwardIDsSpy = sinon.spy(awardIDListContainer.instance(),
                'parseAutocompleteAwardIDs');

            awardIDListContainer.instance().queryAutocompleteAwardIDs('The Navy');

            await awardIDListContainer.instance().awardIDSearchRequest.promise;

            expect(queryAutocompleteAwardIDsSpy.callCount).toEqual(1);
            expect(parseAutocompleteAwardIDsSpy.calledWith(queryAutocompleteAwardIDsSpy));
            expect(mockReduxAction).toHaveBeenCalled();

            // Reset spies
            queryAutocompleteAwardIDsSpy.reset();
            parseAutocompleteAwardIDsSpy.reset();
        });

        it('should clear Award IDs when the Autocomplete tells it to', () => {
            const reduxState = [];

            // setup mock redux actions for handling search results
            const mockReduxAction = jest.fn((args) => {
                expect(args).toEqual(reduxState);
            });

            const awardIDListContainer = setup({
                reduxFilters: initialFilters,
                setAutocompleteAwardIDs: mockReduxAction,
                piid: [{
                    id: "601793",
                    date_signed__fy: null,
                    data_source: null,
                    type: "U",
                    type_description: "Unknown Type",
                    piid: "AG3142B100012",
                    fain: null,
                    uri: null,
                    total_obligation: null,
                    total_outlay: null,
                    date_signed: null,
                    description: null,
                    period_of_performance_start_date: null,
                    period_of_performance_current_end_date: null,
                    potential_total_value_of_award: null,
                    last_modified_date: null,
                    certified_date: null,
                    create_date: "2017-02-28T18:01:59.717954Z",
                    update_date: "2017-02-28T18:01:59.717969Z",
                    parent_award: null,
                    awarding_agency: {
                        id: 999,
                        create_date: "2017-01-12T19:56:26.723000Z",
                        update_date: "2017-01-12T19:56:26.723000Z",
                        toptier_agency: {
                            toptier_agency_id: 155,
                            create_date: null,
                            update_date: null,
                            cgac_code: "012",
                            fpds_code: "1200",
                            name: "AGRICULTURE, DEPARTMENT OF"
                        },
                        subtier_agency: {
                            subtier_agency_id: 865,
                            create_date: null,
                            update_date: null,
                            subtier_code: "1205",
                            name: "USDA, OFFICE OF THE CHIEF FINANCIAL OFFICER"
                        },
                        office_agency: null
                    },
                    funding_agency: null,
                    recipient: null,
                    place_of_performance: null,
                    latest_submission: null
                }],
                fain: [{
                    id: 7662,
                    date_signed__fy: 2016,
                    data_source: "USA",
                    type: "04",
                    type_description: "Project Grant",
                    piid: null,
                    fain: "EMW2011FO10044",
                    uri: null,
                    total_obligation: "-144.00",
                    total_outlay: null,
                    date_signed: "2015-10-23",
                    description: "ASSISTANCE TO FIREFIGHTERS GRANT",
                    period_of_performance_start_date: "2012-02-24",
                    period_of_performance_current_end_date: "2013-04-04",
                    potential_total_value_of_award: null,
                    last_modified_date: "2015-11-12",
                    certified_date: null,
                    create_date: "2017-02-28T01:11:39.376297Z",
                    update_date: "2017-02-28T01:11:39.376310Z",
                    parent_award: null,
                    awarding_agency: {
                        id: 1476,
                        create_date: "2017-01-12T19:56:28.960000Z",
                        update_date: "2017-01-12T19:56:28.960000Z",
                        toptier_agency: {
                            toptier_agency_id: 204,
                            create_date: null,
                            update_date: null,
                            cgac_code: "070",
                            fpds_code: "7000",
                            name: "HOMELAND SECURITY, DEPARTMENT OF"
                        },
                        subtier_agency: {
                            subtier_agency_id: 1342,
                            create_date: null,
                            update_date: null,
                            subtier_code: "7022",
                            name: "FEDERAL EMERGENCY MANAGEMENT AGENCY"
                        },
                        office_agency: null
                    },
                    funding_agency: null,
                    recipient: {
                        legal_entity_id: 3702,
                        data_source: null,
                        parent_recipient_unique_id: null,
                        recipient_name: "SALEM FIRE & EMS DEPARTMENT",
                        vendor_doing_as_business_name: null,
                        vendor_phone_number: null,
                        vendor_fax_number: null,
                        business_types: "UN",
                        business_types_description: "Unknown Business Type",
                        recipient_unique_id: "931542034",
                        limited_liability_corporation: null,
                        sole_proprietorship: null,
                        partnership_or_limited_liability_partnership: null,
                        subchapter_scorporation: null,
                        foundation: null,
                        for_profit_organization: null,
                        nonprofit_organization: null,
                        corporate_entity_tax_exempt: null,
                        corporate_entity_not_tax_exempt: null,
                        other_not_for_profit_organization: null,
                        sam_exception: null,
                        city_local_government: null,
                        county_local_government: null,
                        inter_municipal_local_government: null,
                        local_government_owned: null,
                        municipality_local_government: null,
                        school_district_local_government: null,
                        township_local_government: null,
                        us_state_government: null,
                        us_federal_government: null,
                        federal_agency: null,
                        federally_funded_research_and_development_corp: null,
                        us_tribal_government: null,
                        foreign_government: null,
                        community_developed_corporation_owned_firm: null,
                        labor_surplus_area_firm: null,
                        small_agricultural_cooperative: null,
                        international_organization: null,
                        us_government_entity: null,
                        emerging_small_business: null,
                        c8a_program_participant: null,
                        sba_certified_8a_joint_venture: null,
                        dot_certified_disadvantage: null,
                        self_certified_small_disadvantaged_business: null,
                        historically_underutilized_business_zone: null,
                        small_disadvantaged_business: null,
                        the_ability_one_program: null,
                        historically_black_college: null,
                        c1862_land_grant_college: null,
                        c1890_land_grant_college: null,
                        c1994_land_grant_college: null,
                        minority_institution: null,
                        private_university_or_college: null,
                        school_of_forestry: null,
                        state_controlled_institution_of_higher_learning: null,
                        tribal_college: null,
                        veterinary_college: null,
                        educational_institution: null,
                        alaskan_native_servicing_institution: null,
                        community_development_corporation: null,
                        native_hawaiian_servicing_institution: null,
                        domestic_shelter: null,
                        manufacturer_of_goods: null,
                        hospital_flag: null,
                        veterinary_hospital: null,
                        hispanic_servicing_institution: null,
                        woman_owned_business: null,
                        minority_owned_business: null,
                        women_owned_small_business: null,
                        economically_disadvantaged_women_owned_small_business: null,
                        joint_venture_women_owned_small_business: null,
                        joint_venture_economic_disadvantaged_women_owned_small_bus: null,
                        veteran_owned_business: null,
                        service_disabled_veteran_owned_business: null,
                        contracts: null,
                        grants: null,
                        receives_contracts_and_grants: null,
                        airport_authority: null,
                        council_of_governments: null,
                        housing_authorities_public_tribal: null,
                        interstate_entity: null,
                        planning_commission: null,
                        port_authority: null,
                        transit_authority: null,
                        foreign_owned_and_located: null,
                        american_indian_owned_business: null,
                        alaskan_native_owned_corporation_or_firm: null,
                        indian_tribe_federally_recognized: null,
                        native_hawaiian_owned_business: null,
                        tribally_owned_business: null,
                        asian_pacific_american_owned_business: null,
                        black_american_owned_business: null,
                        hispanic_american_owned_business: null,
                        native_american_owned_business: null,
                        subcontinent_asian_asian_indian_american_owned_business: null,
                        other_minority_owned_business: null,
                        us_local_government: null,
                        undefinitized_action: null,
                        domestic_or_foreign_entity: null,
                        division_name: null,
                        division_number: null,
                        last_modified_date: null,
                        certified_date: null,
                        reporting_period_start: null,
                        reporting_period_end: null,
                        create_date: "2017-02-28T01:09:55.820873Z",
                        update_date: "2017-02-28T01:09:55.820887Z",
                        city_township_government: "Y",
                        special_district_government: null,
                        small_business: null,
                        individual: null,
                        location: {
                            location_id: 8106,
                            data_source: null,
                            country_name: "UNITED STATES",
                            state_code: "VA",
                            state_name: null,
                            state_description: null,
                            city_name: "SALEM",
                            city_code: "95547",
                            county_name: "SALEM (CITY)",
                            county_code: "775",
                            address_line1: "216 SOUTH BROAD STREET",
                            address_line2: "",
                            address_line3: "",
                            foreign_location_description: null,
                            zip4: null,
                            zip_4a: null,
                            congressional_code: null,
                            performance_code: null,
                            zip_last4: "3808",
                            zip5: "24153",
                            foreign_postal_code: null,
                            foreign_province: null,
                            foreign_city_name: null,
                            reporting_period_start: null,
                            reporting_period_end: null,
                            last_modified_date: null,
                            certified_date: null,
                            create_date: "2017-02-28T01:09:55.816777Z",
                            update_date: "2017-02-28T01:09:55.816792Z",
                            place_of_performance_flag: false,
                            recipient_flag: false,
                            location_country_code: "USA"
                        }
                    },
                    place_of_performance: {
                        location_id: 8105,
                        data_source: null,
                        country_name: "UNITED STATES",
                        state_code: "VA",
                        state_name: "VIRGINIA",
                        state_description: null,
                        city_name: null,
                        city_code: null,
                        county_name: "SALEM",
                        county_code: null,
                        address_line1: null,
                        address_line2: null,
                        address_line3: null,
                        foreign_location_description: null,
                        zip4: null,
                        zip_4a: null,
                        congressional_code: null,
                        performance_code: null,
                        zip_last4: "3808",
                        zip5: "24153",
                        foreign_postal_code: null,
                        foreign_province: null,
                        foreign_city_name: null,
                        reporting_period_start: null,
                        reporting_period_end: null,
                        last_modified_date: null,
                        certified_date: null,
                        create_date: "2017-02-28T01:09:55.809970Z",
                        update_date: "2017-02-28T01:09:55.809986Z",
                        place_of_performance_flag: false,
                        recipient_flag: false,
                        location_country_code: "USA"
                    },
                    latest_submission: 2
                }],
                uri: [{
                    id: 614186,
                    date_signed__fy: null,
                    data_source: null,
                    type: "U",
                    type_description: "Unknown Type",
                    piid: null,
                    fain: null,
                    uri: "8810075010:1",
                    total_obligation: null,
                    total_outlay: null,
                    date_signed: null,
                    description: null,
                    period_of_performance_start_date: null,
                    period_of_performance_current_end_date: null,
                    potential_total_value_of_award: null,
                    last_modified_date: null,
                    certified_date: null,
                    create_date: "2017-03-03T20:55:46.622610Z",
                    update_date: "2017-03-03T20:55:46.905588Z",
                    parent_award: null,
                    awarding_agency: null,
                    funding_agency: null,
                    recipient: null,
                    place_of_performance: null,
                    latest_submission: 58
                }],
                parent_award__piid: [{
                    id: 423365,
                    date_signed__fy: 2016,
                    data_source: "USA",
                    type: "C",
                    type_description: "Delivery Order",
                    piid: "HHSF22301011T",
                    fain: null,
                    uri: null,
                    total_obligation: "-3662.72",
                    total_outlay: null,
                    date_signed: "2016-07-26",
                    description: "CENTER FOR TOBACCO (CTP) SHRED SERVICES",
                    period_of_performance_start_date: "2016-07-26",
                    period_of_performance_current_end_date: "2013-01-13",
                    potential_total_value_of_award: "-3662.72",
                    last_modified_date: "2016-07-28",
                    certified_date: null,
                    create_date: "2017-02-28T12:34:56.041258Z",
                    update_date: "2017-02-28T12:34:56.041272Z",
                    parent_award: 394555,
                    awarding_agency: {
                        id: 1508,
                        create_date: "2017-01-12T19:56:29.111000Z",
                        update_date: "2017-01-12T19:56:29.111000Z",
                        toptier_agency: {
                            toptier_agency_id: 209,
                            create_date: null,
                            update_date: null,
                            cgac_code: "075",
                            fpds_code: "7500",
                            name: "HEALTH AND HUMAN SERVICES, DEPARTMENT OF"
                        },
                        subtier_agency: {
                            subtier_agency_id: 1374,
                            create_date: null,
                            update_date: null,
                            subtier_code: "7524",
                            name: "FOOD AND DRUG ADMINISTRATION"
                        },
                        office_agency: null
                    },
                    funding_agency: {
                        id: 1508,
                        create_date: "2017-01-12T19:56:29.111000Z",
                        update_date: "2017-01-12T19:56:29.111000Z",
                        toptier_agency: {
                            toptier_agency_id: 209,
                            create_date: null,
                            update_date: null,
                            cgac_code: "075",
                            fpds_code: "7500",
                            name: "HEALTH AND HUMAN SERVICES, DEPARTMENT OF"
                        },
                        subtier_agency: {
                            subtier_agency_id: 1374,
                            create_date: null,
                            update_date: null,
                            subtier_code: "7524",
                            name: "FOOD AND DRUG ADMINISTRATION"
                        },
                        office_agency: null
                    },
                    recipient: {
                        legal_entity_id: 61210,
                        data_source: null,
                        parent_recipient_unique_id: "192398134",
                        recipient_name: "TRUSTED TECHNOLOGIES, LLC",
                        vendor_doing_as_business_name: null,
                        vendor_phone_number: "4103279221",
                        vendor_fax_number: "4436390055",
                        business_types: "UN",
                        business_types_description: "Unknown Business Type",
                        recipient_unique_id: "192398134",
                        limited_liability_corporation: "t",
                        sole_proprietorship: "f",
                        partnership_or_limited_liability_partnership: "f",
                        subchapter_scorporation: "f",
                        foundation: "f",
                        for_profit_organization: "t",
                        nonprofit_organization: "f",
                        corporate_entity_tax_exempt: "f",
                        corporate_entity_not_tax_exempt: "f",
                        other_not_for_profit_organization: "f",
                        sam_exception: null,
                        city_local_government: "f",
                        county_local_government: "f",
                        inter_municipal_local_government: "f",
                        local_government_owned: "f",
                        municipality_local_government: "f",
                        school_district_local_government: "f",
                        township_local_government: "f",
                        us_state_government: null,
                        us_federal_government: "f",
                        federal_agency: "f",
                        federally_funded_research_and_development_corp: "f",
                        us_tribal_government: "f",
                        foreign_government: "f",
                        community_developed_corporation_owned_firm: "f",
                        labor_surplus_area_firm: "f",
                        small_agricultural_cooperative: "f",
                        international_organization: "f",
                        us_government_entity: null,
                        emerging_small_business: null,
                        c8a_program_participant: "t",
                        sba_certified_8a_joint_venture: null,
                        dot_certified_disadvantage: "f",
                        self_certified_small_disadvantaged_business: null,
                        historically_underutilized_business_zone: "f",
                        small_disadvantaged_business: null,
                        the_ability_one_program: null,
                        historically_black_college: "f",
                        c1862_land_grant_college: "f",
                        c1890_land_grant_college: "f",
                        c1994_land_grant_college: "f",
                        minority_institution: "f",
                        private_university_or_college: "f",
                        school_of_forestry: "f",
                        state_controlled_institution_of_higher_learning: "f",
                        tribal_college: "f",
                        veterinary_college: "f",
                        educational_institution: "f",
                        alaskan_native_servicing_institution: "f",
                        community_development_corporation: "f",
                        native_hawaiian_servicing_institution: "f",
                        domestic_shelter: "f",
                        manufacturer_of_goods: "f",
                        hospital_flag: "f",
                        veterinary_hospital: "f",
                        hispanic_servicing_institution: "f",
                        woman_owned_business: "f",
                        minority_owned_business: "t",
                        women_owned_small_business: null,
                        economically_disadvantaged_women_owned_small_business: null,
                        joint_venture_women_owned_small_business: null,
                        joint_venture_economic_disadvantaged_women_owned_small_bus: null,
                        veteran_owned_business: "f",
                        service_disabled_veteran_owned_business: null,
                        contracts: null,
                        grants: null,
                        receives_contracts_and_grants: null,
                        airport_authority: "f",
                        council_of_governments: "f",
                        housing_authorities_public_tribal: "f",
                        interstate_entity: "f",
                        planning_commission: "f",
                        port_authority: "f",
                        transit_authority: "f",
                        foreign_owned_and_located: "f",
                        american_indian_owned_business: "f",
                        alaskan_native_owned_corporation_or_firm: "f",
                        indian_tribe_federally_recognized: "f",
                        native_hawaiian_owned_business: "f",
                        tribally_owned_business: "f",
                        asian_pacific_american_owned_business: "f",
                        black_american_owned_business: "t",
                        hispanic_american_owned_business: "f",
                        native_american_owned_business: "f",
                        subcontinent_asian_asian_indian_american_owned_business: "f",
                        other_minority_owned_business: "f",
                        us_local_government: "f",
                        undefinitized_action: null,
                        domestic_or_foreign_entity: null,
                        division_name: null,
                        division_number: null,
                        last_modified_date: null,
                        certified_date: null,
                        reporting_period_start: null,
                        reporting_period_end: null,
                        create_date: "2017-02-28T11:42:49.850471Z",
                        update_date: "2017-02-28T11:42:49.850483Z",
                        city_township_government: null,
                        special_district_government: null,
                        small_business: null,
                        individual: null,
                        location: {
                            location_id: 167302,
                            data_source: null,
                            country_name: "UNITED STATES",
                            state_code: "MD",
                            state_name: null,
                            state_description: null,
                            city_name: "BALTIMORE",
                            city_code: null,
                            county_name: null,
                            county_code: null,
                            address_line1: "2400 BOSTON ST STE 344",
                            address_line2: "",
                            address_line3: "",
                            foreign_location_description: null,
                            zip4: null,
                            zip_4a: null,
                            congressional_code: "03",
                            performance_code: null,
                            zip_last4: "4723",
                            zip5: "21224",
                            foreign_postal_code: null,
                            foreign_province: null,
                            foreign_city_name: null,
                            reporting_period_start: null,
                            reporting_period_end: null,
                            last_modified_date: null,
                            certified_date: null,
                            create_date: "2017-02-28T11:42:49.846874Z",
                            update_date: "2017-02-28T11:42:49.846888Z",
                            place_of_performance_flag: false,
                            recipient_flag: false,
                            location_country_code: "USA"
                        }
                    },
                    place_of_performance: {
                        location_id: 152383,
                        data_source: null,
                        country_name: "UNITED STATES",
                        state_code: "MD",
                        state_name: null,
                        state_description: null,
                        city_name: "ROCKVILLE",
                        city_code: null,
                        county_name: null,
                        county_code: null,
                        address_line1: null,
                        address_line2: null,
                        address_line3: null,
                        foreign_location_description: null,
                        zip4: null,
                        zip_4a: null,
                        congressional_code: "08",
                        performance_code: null,
                        zip_last4: "0003",
                        zip5: "20857",
                        foreign_postal_code: null,
                        foreign_province: null,
                        foreign_city_name: null,
                        reporting_period_start: null,
                        reporting_period_end: null,
                        last_modified_date: null,
                        certified_date: null,
                        create_date: "2017-02-28T10:14:49.253099Z",
                        update_date: "2017-02-28T10:14:49.253112Z",
                        place_of_performance_flag: false,
                        recipient_flag: false,
                        location_country_code: "USA"
                    },
                    latest_submission: 46
                }],
                selectedAwardIDs: new OrderedMap(),
                toggleAwardID: jest.fn()
            });

            // Set up spies
            const clearAutocompleteSuggestionsSpy = sinon.spy(awardIDListContainer.instance(),
                'clearAutocompleteSuggestions');

            awardIDListContainer.instance().clearAutocompleteSuggestions();

            // Run all ticks
            jest.runAllTicks();

            // Everything should be updated
            expect(clearAutocompleteSuggestionsSpy.callCount).toEqual(1);
            expect(mockReduxAction).toHaveBeenCalled();

            // Reset spies
            clearAutocompleteSuggestionsSpy.reset();
        });
    });
});
