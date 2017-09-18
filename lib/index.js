'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (validators) {
  return function () {
    return function (next) {
      return function (action) {
        var error = action.error;

        var validator = validators[action.type];

        if (error || !(0, _fluxStandardAction.isFSA)(action) || !validator) return next(action);

        try {
          validator(action.payload);
          next(action);
        } catch (e) {
          next(_extends({}, action, { payload: e, error: true }));
        }
      };
    };
  };
};

var _fluxStandardAction = require('flux-standard-action');