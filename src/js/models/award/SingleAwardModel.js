/**
 * SingleAwardModel.js
 * Created by Kevin Li 7/7/17
 */

import EnforcedModel from 'models/common/EnforcedModel';

import * as MoneyFormatter from 'helpers/moneyFormatter';

import RecipientModel from './RecipientModel';
import AgencyModel from './AgencyModel';
import LocationModel from './LocationModel';
import TransactionModel from './TransactionModel';


const defaultValues = {
    id: 0,
    type: '',
    type_description: '',
    category: '',
    piid: '',
    fain: '',
    uri: '',
    total_obligation: 0,
    total_outlay: 0,
    date_signed: '',
    description: '',
    period_of_performance_start_date: '',
    period_of_performance_current_end_date: '',
    potential_total_value_of_award: '',
    total_subaward_amount: '',
    subaward_count: 0,
    awarding_agency: new AgencyModel(),
    funding_agency: new AgencyModel(),
    recipient: new RecipientModel(),
    place_of_performance: new LocationModel(),
    latest_transaction: new TransactionModel()
};

const formatFuncs = {
    potential_total_value_of_award: (raw) => MoneyFormatter.formatMoney(raw),
    total_subaward_amount: (raw) => MoneyFormatter.formatMoney(raw),
    awarding_agency: (raw) => new AgencyModel(raw),
    funding_agency: (raw) => new AgencyModel(raw),
    recipient: (raw) => new RecipientModel(raw),
    place_of_performance: (raw) => new LocationModel(raw),
    latest_transaction: (raw) => new TransactionModel(raw)
};

export default class SingleAwardModel extends EnforcedModel {
    constructor(data) {
        // create a Record instance with the prepared values
        // as an Immutable JS Record, the instance will be immutable and it will only have the
        // keys defined by default (but they are guaranteed to exist)
        super(defaultValues, data, formatFuncs);
    }
}

