/**
 * searchFiltersReducer.js
 * Created by Kevin Li 11/1/16
 **/

import { Set, OrderedMap } from 'immutable';

import * as AwardFilterFunctions from './filters/awardFilterFunctions';
import * as LocationFilterFunctions from './filters/locationFilterFunctions';
import * as AgencyFilterFunctions from './filters/agencyFilterFunctions';
import * as RecipientFilterFunctions from './filters/recipientFilterFunctions';
import * as AwardIDFilterFunctions from './filters/awardIDFilterFunctions';
import * as AwardAmountFilterFunctions from './filters/awardAmountFilterFunctions';
import * as BudgetCategoryFilterFunctions from './filters/budgetCategoryFilterFunctions';
import * as OtherFilterFunctions from './filters/OtherFilterFunctions';

// update this version when changes to the reducer structure are made
// frontend will reject inbound hashed search filter sets with different versions because the
// data structures may have changed
export const filterStoreVersion = 1;

export const requiredTypes = {
    timePeriodFY: Set,
    selectedLocations: OrderedMap,
    budgetFunctions: OrderedMap,
    federalAccounts: OrderedMap,
    objectClasses: Set,
    selectedFundingAgencies: OrderedMap,
    selectedAwardingAgencies: OrderedMap,
    selectedRecipients: OrderedMap,
    recipientType: Set,
    selectedRecipientLocations: OrderedMap,
    awardType: Set,
    selectedAwardIDs: OrderedMap,
    awardAmounts: OrderedMap,
    selectedCFDA: OrderedMap,
    selectedNAICS: OrderedMap,
    selectedPSC: OrderedMap
};

export const initialState = {
    keyword: '',
    timePeriodType: 'fy',
    timePeriodFY: new Set(),
    timePeriodStart: null,
    timePeriodEnd: null,
    selectedLocations: new OrderedMap(),
    locationDomesticForeign: 'all',
    budgetFunctions: new OrderedMap(),
    federalAccounts: new OrderedMap(),
    objectClasses: new Set(),
    selectedFundingAgencies: new OrderedMap(),
    selectedAwardingAgencies: new OrderedMap(),
    selectedRecipients: new OrderedMap(),
    recipientDomesticForeign: 'all',
    recipientType: new Set(),
    selectedRecipientLocations: new OrderedMap(),
    awardType: new Set(),
    selectedAwardIDs: new OrderedMap(),
    awardAmounts: new OrderedMap(),
    selectedCFDA: new OrderedMap(),
    selectedNAICS: new OrderedMap(),
    selectedPSC: new OrderedMap()
};

const searchFiltersReducer = (state = initialState, action) => {
    switch (action.type) {
        // Free Text Search
        case 'UPDATE_TEXT_SEARCH': {
            return Object.assign({}, state, {
                keyword: action.textInput
            });
        }

        // Time Period Filter
        case 'UPDATE_SEARCH_FILTER_TIME_PERIOD': {
            // FY time period is stored as an ImmutableJS set
            return Object.assign({}, state, {
                timePeriodType: action.dateType,
                timePeriodStart: action.start,
                timePeriodEnd: action.end,
                timePeriodFY: new Set(action.fy)
            });
        }

        // Place of Performance Filter
        case 'UPDATE_SELECTED_LOCATIONS': {
            return Object.assign({}, state, {
                selectedLocations: LocationFilterFunctions.updateSelectedLocations(
                    state.selectedLocations, action.location)
            });
        }
        case 'UPDATE_DOMESTIC_FOREIGN': {
            return Object.assign({}, state, {
                locationDomesticForeign: action.selection
            });
        }

        // Budget Categories Filter
        case 'UPDATE_SELECTED_BUDGET_FUNCTIONS': {
            return Object.assign({}, state, {
                budgetFunctions: BudgetCategoryFilterFunctions.updateBudgetFunctions(
                    state.budgetFunctions, action.budgetFunction)
            });
        }

        case 'UPDATE_SELECTED_FEDERAL_ACCOUNTS': {
            return Object.assign({}, state, {
                federalAccounts: BudgetCategoryFilterFunctions.updateFederalAccounts(
                    state.federalAccounts, action.federalAccount)
            });
        }

        case 'UPDATE_SELECTED_OBJECT_CLASSES': {
            return Object.assign({}, state, {
                objectClasses: BudgetCategoryFilterFunctions.updateObjectClasses(
                    state.objectClasses, action.objectClass)
            });
        }
        case 'BULK_SEARCH_FILTER_OBJECT_CLASSES': {
            return Object.assign({}, state, {
                objectClasses: BudgetCategoryFilterFunctions.bulkObjectClassesChange(
                    state.objectClasses, action.objectClasses, action.direction)
            });
        }

        // Agency Filter
        case 'UPDATE_SELECTED_AWARDING_AGENCIES': {
            return Object.assign({}, state, {
                selectedAwardingAgencies: AgencyFilterFunctions.updateSelectedAgencies(
                    state.selectedAwardingAgencies, action.agency)
            });
        }
        case 'UPDATE_SELECTED_FUNDING_AGENCIES': {
            return Object.assign({}, state, {
                selectedFundingAgencies: AgencyFilterFunctions.updateSelectedAgencies(
                    state.selectedFundingAgencies, action.agency)
            });
        }

        // Recipient Filter
        case 'UPDATE_SELECTED_RECIPIENTS': {
            return Object.assign({}, state, {
                selectedRecipients: RecipientFilterFunctions.updateSelectedRecipients(
                    state.selectedRecipients, action.recipient)
            });
        }
        case 'UPDATE_RECIPIENT_DOMESTIC_FORIEGN': {
            return Object.assign({}, state, {
                recipientDomesticForeign: action.selection
            });
        }
        case 'UPDATE_RECIPIENT_LOCATIONS': {
            return Object.assign({}, state, {
                selectedRecipientLocations: RecipientFilterFunctions
                    .updateSelectedRecipientLocations(
                        state.selectedRecipientLocations, action.location)
            });
        }
        case 'TOGGLE_SEARCH_FILTER_RECIPIENT_TYPE': {
            // this redux state is stored in an ImmutableJS set, which returns new instances
            // whenever it is modified
            return Object.assign({}, state, {
                recipientType: RecipientFilterFunctions.immutableSetToggle(
                    state.recipientType, action.recipientType)
            });
        }
        case 'BULK_SEARCH_FILTER_RECIPIENT_TYPES': {
            return Object.assign({}, state, {
                recipientType: RecipientFilterFunctions.bulkRecipientTypeChange(
                    state.recipientType, action.recipientTypes, action.direction)
            });
        }

        // Award Type Filter
        case 'TOGGLE_SEARCH_FILTER_AWARD_TYPE': {
            // this redux state is stored in an ImmutableJS set, which returns new instances
            // whenever it is modified
            return Object.assign({}, state, {
                awardType: AwardFilterFunctions.immutableSetToggle(
                    state.awardType, action.awardType)
            });
        }
        case 'BULK_SEARCH_FILTER_AWARD_TYPE': {
            return Object.assign({}, state, {
                awardType: AwardFilterFunctions.bulkAwardTypeChange(
                    state.awardType, action.awardTypes, action.direction)
            });
        }

        // Award ID Filter
        case 'UPDATE_SELECTED_AWARD_IDS': {
            return Object.assign({}, state, {
                selectedAwardIDs: AwardIDFilterFunctions.updateSelectedAwardIDs(
                    state.selectedAwardIDs, action.awardID)
            });
        }

        // Award Amount Filter
        case 'UPDATE_AWARD_AMOUNTS': {
            return Object.assign({}, state, {
                awardAmounts: AwardAmountFilterFunctions.updateAwardAmounts(
                    state.awardAmounts, action.awardAmounts)
            });
        }

        // CFDA Filter
        case 'UPDATE_SELECTED_CFDA': {
            return Object.assign({}, state, {
                selectedCFDA: OtherFilterFunctions.updateSelectedCFDA(
                    state.selectedCFDA, action.cfda)
            });
        }

        // NAICS Filter
        case 'UPDATE_SELECTED_NAICS': {
            return Object.assign({}, state, {
                selectedNAICS: OtherFilterFunctions.updateSelectedNAICS(
                    state.selectedNAICS, action.naics)
            });
        }

        // PSC Filter
        case 'UPDATE_SELECTED_PSC': {
            return Object.assign({}, state, {
                selectedPSC: OtherFilterFunctions.updateSelectedPSC(
                    state.selectedPSC, action.psc)
            });
        }

        // Generic
        case 'UPDATE_SEARCH_FILTER_GENERIC': {
            return Object.assign({}, state, {
                [action.filterType]: action.filterValue
            });
        }
        case 'RESET_SEARCH_TIME_FILTER': {
            return Object.assign({}, state, {
                timePeriodType: initialState.timePeriodType,
                timePeriodFY: initialState.timePeriodFY,
                timePeriodStart: initialState.timePeriodStart,
                timePeriodEnd: initialState.timePeriodEnd
            });
        }
        case 'CLEAR_SEARCH_FILTER_TYPE': {
            return Object.assign({}, state, {
                [action.filterType]: initialState[action.filterType]
            });
        }
        case 'POPULATE_ALL_SEARCH_FILTERS': {
            return Object.assign({}, initialState, action.filters);
        }
        case 'CLEAR_SEARCH_FILTER_ALL': {
            return Object.assign({}, initialState);
        }
        default:
            return state;
    }
};

export default searchFiltersReducer;
