/**
 * BudgetCategorySearch.jsx
 * Created by michaelbray on 3/17/17.
 */

import React from 'react';
import PropTypes from 'prop-types';

import BudgetCategoryFunctionContainer
    from 'containers/search/filters/budgetCategory/BudgetCategoryFunctionContainer';
import BudgetCategoryAccountContainer
    from 'containers/search/filters/budgetCategory/BudgetCategoryAccountContainer';
import BudgetCategoryOCContainer
    from 'containers/search/filters/budgetCategory/BudgetCategoryOCContainer';

import SelectedBudgetFunctions from './SelectedBudgetFunctions';
import SelectedFederalAccounts from './SelectedFederalAccounts';

const propTypes = {
    updateSelectedBudgetFunctions: PropTypes.func,
    updateSelectedFederalAccounts: PropTypes.func,
    budgetFunctions: PropTypes.object,
    federalAccounts: PropTypes.object
};

export default class BudgetCategorySearch extends React.Component {
    render() {
        let budgetFunctions = null;
        let federalAccounts = null;

        if (this.props.budgetFunctions.size > 0) {
            budgetFunctions = (<SelectedBudgetFunctions
                budgetFunctions={this.props.budgetFunctions}
                updateSelectedBudgetFunctions={this.props.updateSelectedBudgetFunctions} />);
        }

        if (this.props.federalAccounts.size > 0) {
            federalAccounts = (<SelectedFederalAccounts
                federalAccounts={this.props.federalAccounts}
                updateSelectedFederalAccounts={this.props.updateSelectedFederalAccounts} />);
        }

        return (
            <div className="budget-category-filter">
                <div className="filter-item-wrap">
                    <BudgetCategoryFunctionContainer
                        {...this.props} />
                    {budgetFunctions}
                </div>
                <div className="filter-item-wrap">
                    <BudgetCategoryAccountContainer
                        {...this.props} />
                    {federalAccounts}
                </div>
                <div className="filter-item-wrap">
                    <BudgetCategoryOCContainer
                        {...this.props} />
                </div>
            </div>
        );
    }
}

BudgetCategorySearch.propTypes = propTypes;
