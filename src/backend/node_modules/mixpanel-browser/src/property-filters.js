/* eslint camelcase: "off" */

import {_} from './utils';

/*
 * This file is a js implementation for a subset in eval_node.c
 */

/*
 * Constants
 */
// Metadata keys
/** @const */   var OPERATOR_KEY                  = 'operator';
/** @const */   var PROPERTY_KEY                  = 'property';
/** @const */   var WINDOW_KEY                    = 'window';
/** @const */   var UNIT_KEY                      = 'unit';
/** @const */   var VALUE_KEY                     = 'value';
/** @const */   var HOUR_KEY                      = 'hour';
/** @const */   var DAY_KEY                       = 'day';
/** @const */   var WEEK_KEY                      = 'week';
/** @const */   var MONTH_KEY                     = 'month';

// Operands
/** @const */   export var EVENT_PROPERTY         = 'event';
/** @const */   export var LITERAL_PROPERTY       = 'literal';

// Binary Operators
/** @const */   export var AND_OPERATOR           = 'and';
/** @const */   export var OR_OPERATOR            = 'or';
/** @const */   export var IN_OPERATOR            = 'in';
/** @const */   export var NOT_IN_OPERATOR        = 'not in';
/** @const */   export var PLUS_OPERATOR          = '+';
/** @const */   export var MINUS_OPERATOR         = '-';
/** @const */   export var MUL_OPERATOR           = '*';
/** @const */   export var DIV_OPERATOR           = '/';
/** @const */   export var MOD_OPERATOR           = '%';
/** @const */   export var EQUALS_OPERATOR        = '==';
/** @const */   export var NOT_EQUALS_OPERATOR    = '!=';
/** @const */   export var GREATER_OPERATOR       = '>';
/** @const */   export var LESS_OPERATOR          = '<';
/** @const */   export var GREATER_EQUAL_OPERATOR = '>=';
/** @const */   export var LESS_EQUAL_OPERATOR    = '<=';

// Typecast Operators
/** @const */   export var BOOLEAN_OPERATOR       = 'boolean';
/** @const */   export var DATETIME_OPERATOR      = 'datetime';
/** @const */   export var LIST_OPERATOR          = 'list';
/** @const */   export var NUMBER_OPERATOR        = 'number';
/** @const */   export var STRING_OPERATOR        = 'string';

// Unary Operators
/** @const */   export var NOT_OPERATOR           = 'not';
/** @const */   export var DEFINED_OPERATOR       = 'defined';
/** @const */   export var NOT_DEFINED_OPERATOR   = 'not defined';

// Special literals
/** @const */   export var NOW_LITERAL            = 'now';

// Type cast functions
function toNumber(value) {
    if (value === null) {
        return null;
    }

    switch (typeof(value)) {
        case 'object':
            if (_.isDate(value) && value.getTime() >= 0) {
                return value.getTime();
            }
            return null;
        case 'boolean':
            return Number(value);
        case 'number':
            return value;
        case 'string':
            value = Number(value);
            if (!isNaN(value)) {
                return value;
            }
            return 0;
    }
    return null;
}

export function evaluateNumber(op, properties) {
    if (!op['operator'] || op['operator'] !== NUMBER_OPERATOR || !op['children'] || op['children'].length !== 1) {
        throw ('Invalid cast operator: number ' + op);
    }

    return toNumber(evaluateSelector(op['children'][0], properties));
}

function toBoolean(value) {
    if (value === null) {
        return false;
    }

    switch (typeof value) {
        case 'boolean':
            return value;
        case 'number':
            return value !== 0.0;
        case 'string':
            return value.length > 0;
        case 'object':
            if (_.isArray(value) && value.length > 0) {
                return true;
            }
            if (_.isDate(value) && value.getTime() > 0) {
                return true;
            }
            if (_.isObject(value) && !_.isEmptyObject(value)) {
                return true;
            }
            return false;
    }
    return false;
}

export function evaluateBoolean(op, properties) {
    if (!op['operator'] || op['operator'] !== BOOLEAN_OPERATOR || !op['children'] || op['children'].length !== 1) {
        throw ('Invalid cast operator: boolean ' + op);
    }

    return toBoolean(evaluateSelector(op['children'][0], properties));
}

export function evaluateDateTime(op, properties) {
    if (!op['operator'] || op['operator'] !== DATETIME_OPERATOR || !op['children'] || op['children'].length !== 1) {
        throw ('Invalid cast operator: datetime ' + op);
    }

    var v = evaluateSelector(op['children'][0], properties);
    if (v === null) {
        return null;
    }

    switch (typeof(v)) {
        case 'number':
        case 'string':
            var d = new Date(v);
            if (isNaN(d.getTime())) {
                return null;
            }
            return d;
        case 'object':
            if (_.isDate(v)) {
                return v;
            }
    }

    return null;
}

export function evaluateList(op, properties) {
    if (!op['operator'] || op['operator'] !== LIST_OPERATOR || !op['children'] || op['children'].length !== 1) {
        throw ('Invalid cast operator: list ' + op);
    }

    var v = evaluateSelector(op['children'][0], properties);
    if (v === null) {
        return null;
    }

    if (_.isArray(v)) {
        return v;
    }

    return null;
}

export function evaluateString(op, properties) {
    if (!op['operator'] || op['operator'] !== STRING_OPERATOR || !op['children'] || op['children'].length !== 1) {
        throw ('Invalid cast operator: string ' + op);
    }

    var v = evaluateSelector(op['children'][0], properties);
    switch (typeof(v)) {
        case 'object':
            if (_.isDate(v)) {
                return v.toJSON();
            }
            return JSON.stringify(v);
    }
    return String(v);
}

// Operators
export function evaluateAnd(op, properties) {
    if (!op['operator'] || op['operator'] !== AND_OPERATOR || !op['children'] || op['children'].length !== 2) {
        throw ('Invalid operator: AND ' + op);
    }

    return toBoolean(evaluateSelector(op['children'][0], properties)) && toBoolean(evaluateSelector(op['children'][1], properties));
}

export function evaluateOr(op, properties) {
    if (!op['operator'] || op['operator'] !== OR_OPERATOR || !op['children'] || op['children'].length !== 2) {
        throw ('Invalid operator: OR ' + op);
    }

    return toBoolean(evaluateSelector(op['children'][0], properties)) || toBoolean(evaluateSelector(op['children'][1], properties));
}

export function evaluateIn(op, properties) {
    if (!op['operator'] || [IN_OPERATOR, NOT_IN_OPERATOR].indexOf(op['operator']) === -1 || !op['children'] || op['children'].length !== 2) {
        throw ('Invalid operator: IN/NOT IN ' + op);
    }
    var leftValue = evaluateSelector(op['children'][0], properties);
    var rightValue = evaluateSelector(op['children'][1], properties);

    if (!_.isArray(rightValue) && !_.isString(rightValue)) {
        throw ('Invalid operand for operator IN: invalid type' + rightValue);
    }

    var v = rightValue.indexOf(leftValue) > -1;
    if (op['operator'] === NOT_IN_OPERATOR) {
        return !v;
    }
    return v;
}

export function evaluatePlus(op, properties) {
    if (!op['operator'] || op['operator'] !== PLUS_OPERATOR || !op['children'] || op['children'].length < 2) {
        throw ('Invalid operator: PLUS ' + op);
    }
    var l = evaluateSelector(op['children'][0], properties);
    var r = evaluateSelector(op['children'][1], properties);

    if (typeof l === 'number' && typeof r === 'number') {
        return l + r;
    }
    if (typeof l === 'string' && typeof r === 'string') {
        return l + r;
    }
    return null;
}

export function evaluateArithmetic(op, properties) {
    if (!op['operator'] || [MINUS_OPERATOR, MUL_OPERATOR, DIV_OPERATOR, MOD_OPERATOR].indexOf(op['operator']) === -1 ||
        !op['children'] || op['children'].length < 2) {
        throw ('Invalid arithmetic operator ' + op);
    }

    var l = evaluateSelector(op['children'][0], properties);
    var r = evaluateSelector(op['children'][1], properties);

    if (typeof l === 'number' && typeof r === 'number') {
        switch (op['operator']) {
            case MINUS_OPERATOR:
                return l - r;
            case MUL_OPERATOR:
                return l * r;
            case DIV_OPERATOR:
                if (r !== 0) {
                    return l / r;
                }
                return null;
            case MOD_OPERATOR:
                if (r === 0) {
                    return null;
                }
                if (l === 0) {
                    return 0;
                }
                if ((l < 0 && r > 0) || (l > 0 && r < 0)) {
                    /* Mimic python modulo - result takes sign of the divisor
                     * if one operand is negative. */
                    return -(Math.floor(l / r) * r - l);
                }
                return l % r;
            default:
                throw('Unknown operator: ' + op['operator']);
        }
    }

    return null;
}

function _isArrayEqual(l, r) {
    if (l === r) return true;
    if (l === null || r === null) return false;
    if (l.length !== r.length) return false;

    for (var i = 0; i < l.length; i++) {
        if (l[i] !== r[i]) {
            return false;
        }
    }

    return true;
}

function _isEqual(l, r) {
    if ( l === null && l === r ) {
        return true;
    }
    if (typeof l === typeof r) {
        switch (typeof l) {
            case 'number':
            case 'string':
            case 'boolean':
                return l === r;
            case 'object':
                if (_.isArray(l) && _.isArray(r)) {
                    return _isArrayEqual(l, r);
                }
                if (_.isDate(l) && _.isDate(r)) {
                    return l.getTime() === r.getTime();
                }
                if (_.isObject(l) && _.isObject(r)) {
                    return JSON.stringify(l) === JSON.stringify(r);
                }
        }
    }
    return false;
}

export function evaluateEquality(op, properties) {
    if (!op['operator'] || [EQUALS_OPERATOR, NOT_EQUALS_OPERATOR].indexOf(op['operator']) === -1 || !op['children'] || op['children'].length !== 2) {
        throw ('Invalid equality operator ' + op);
    }

    var v = _isEqual(evaluateSelector(op['children'][0], properties), evaluateSelector(op['children'][1], properties));

    switch (op['operator']) {
        case EQUALS_OPERATOR:
            return v;
        case NOT_EQUALS_OPERATOR:
            return !v;
    }
}

export function evaluateComparison(op, properties) {
    if (!op['operator'] ||
        [GREATER_OPERATOR, GREATER_EQUAL_OPERATOR, LESS_OPERATOR, LESS_EQUAL_OPERATOR].indexOf(op['operator']) === -1 ||
        !op['children'] || op['children'].length !== 2) {
        throw ('Invalid comparison operator ' + op);
    }
    var l = evaluateSelector(op['children'][0], properties);
    var r = evaluateSelector(op['children'][1], properties);

    if (typeof(l) === typeof(r)) {
        if (typeof(r) === 'number' || _.isDate(r)) {
            l = toNumber(l);
            r = toNumber(r);
            switch (op['operator']) {
                case GREATER_OPERATOR:
                    return l > r;
                case GREATER_EQUAL_OPERATOR:
                    return l >= r;
                case LESS_OPERATOR:
                    return l < r;
                case LESS_EQUAL_OPERATOR:
                    return l <= r;
            }
        } else if (typeof(r) === 'string') {
            var compare = l.localeCompare(r);
            switch (op['operator']) {
                case GREATER_OPERATOR:
                    return compare > 0;
                case GREATER_EQUAL_OPERATOR:
                    return compare >= 0;
                case LESS_OPERATOR:
                    return compare < 0;
                case LESS_EQUAL_OPERATOR:
                    return compare <= 0;
            }
        }
    }

    return null;
}

export function evaluateDefined(op, properties) {
    if (!op['operator'] || [DEFINED_OPERATOR, NOT_DEFINED_OPERATOR].indexOf(op['operator']) === -1 ||
        !op['children'] || op['children'].length !== 1) {
        throw ('Invalid defined/not defined operator: ' + op);
    }

    var b = evaluateSelector(op['children'][0], properties) !== null;
    if (op['operator'] === NOT_DEFINED_OPERATOR) {
        return !b;
    }

    return b;
}

export function evaluateNot(op, properties) {
    if (!op['operator'] || op['operator'] !== NOT_OPERATOR || !op['children'] || op['children'].length !== 1) {
        throw ('Invalid not operator: ' + op);
    }

    var v = evaluateSelector(op['children'][0], properties);
    if (v === null) {
        return true;
    }

    if (typeof(v) === 'boolean') {
        return !v;
    }

    return null;
}

export function evaluateOperator(op, properties) {
    if (!op['operator']) {
        throw ('Invalid operator: operator key missing ' + op);
    }

    switch (op['operator']) {
        case AND_OPERATOR:
            return evaluateAnd(op, properties);
        case OR_OPERATOR:
            return evaluateOr(op, properties);
        case IN_OPERATOR:
        case NOT_IN_OPERATOR:
            return evaluateIn(op, properties);
        case PLUS_OPERATOR:
            return evaluatePlus(op, properties);
        case MINUS_OPERATOR:
        case MUL_OPERATOR:
        case DIV_OPERATOR:
        case MOD_OPERATOR:
            return evaluateArithmetic(op, properties);
        case EQUALS_OPERATOR:
        case NOT_EQUALS_OPERATOR:
            return evaluateEquality(op, properties);
        case GREATER_OPERATOR:
        case LESS_OPERATOR:
        case GREATER_EQUAL_OPERATOR:
        case LESS_EQUAL_OPERATOR:
            return evaluateComparison(op, properties);
        case BOOLEAN_OPERATOR:
            return evaluateBoolean(op, properties);
        case DATETIME_OPERATOR:
            return evaluateDateTime(op, properties);
        case LIST_OPERATOR:
            return evaluateList(op, properties);
        case NUMBER_OPERATOR:
            return evaluateNumber(op, properties);
        case STRING_OPERATOR:
            return evaluateString(op, properties);
        case DEFINED_OPERATOR:
        case NOT_DEFINED_OPERATOR:
            return evaluateDefined(op, properties);
        case NOT_OPERATOR:
            return evaluateNot(op, properties);
    }
}

export function evaluateWindow(value) {
    var win = value[WINDOW_KEY];
    if (!win || !win[UNIT_KEY] || !win[VALUE_KEY]) {
        throw('Invalid window: missing required keys ' + JSON.stringify(value));
    }
    var out = new Date();
    switch (win[UNIT_KEY]) {
        case HOUR_KEY:
            out.setTime(out.getTime() + (win[VALUE_KEY]*-1*60*60*1000));
            break;
        case DAY_KEY:
            out.setTime(out.getTime() + (win[VALUE_KEY]*-1*24*60*60*1000));
            break;
        case WEEK_KEY:
            out.setTime(out.getTime() + (win[VALUE_KEY]*-1*7*24*60*60*1000));
            break;
        case MONTH_KEY:
            out.setTime(out.getTime() + (win[VALUE_KEY]*-1*30*24*60*60*1000));
            break;
        default:
            throw('Invalid unit: ' + win[UNIT_KEY]);
    }

    return out;
}

export function evaluateOperand(op, properties) {
    if (!op['property'] || !op['value']) {
        throw('Invalid operand: missing required keys ' + op);
    }
    switch (op['property']) {
        case EVENT_PROPERTY:
            if (properties[op['value']] !== undefined) {
                return properties[op['value']];
            }
            return null;
        case LITERAL_PROPERTY:
            if (op['value'] === NOW_LITERAL) {
                return new Date();
            }
            if (typeof(op['value']) === 'object') {
                return evaluateWindow(op['value']);
            }
            return op['value'];
        default:
            throw('Invalid operand: Invalid property type ' + op['property']);
    }
}

export function evaluateSelector(filters, properties) {
    if (filters[PROPERTY_KEY]) {
        return evaluateOperand(filters, properties);
    }
    if (filters[OPERATOR_KEY]) {
        return evaluateOperator(filters, properties);
    }
}
