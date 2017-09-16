'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = validateMiddleware;
exports.createActionDecorator = createActionDecorator;

var _fluxStandardAction = require('flux-standard-action');

function validateMiddleware(_ref) {
  var dispatch = _ref.dispatch;

  return function (next) {
    return function (action) {
      var validator = action.meta.validator;


      if (!(0, _fluxStandardAction.isFSA)(action) || !validator) return next(action);

      var _validator = validator(action.payload),
          isValid = _validator.isValid,
          message = _validator.message;

      return isValid ? next(action) : dispatch(_extends({}, action, { payload: { message: message }, error: true }));
    };
  };
}

function createActionDecorator(_ref2) {
  var validator = _ref2.validator;

  return function (action) {
    return _extends({}, action, { meta: _extends({}, action.meta, { validator: validator }) });
  };
}