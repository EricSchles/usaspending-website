const agenciesTableFields = {
    defaultSortDirection: {
        agency_name: 'desc',
        budget_authority_amount: 'desc',
        percentage_of_total_budget_authority: 'desc'
    },
    defaultSortField: 'agency_name',
    order: [
        'agency_name',
        'budget_authority_amount',
        'percentage_of_total_budget_authority'
    ],
    agency_name: 'Agency Name',
    budget_authority_amount: 'Budget Authority',
    percentage_of_total_budget_authority: 'Percent of Total U.S. Budget'
};

export default agenciesTableFields;