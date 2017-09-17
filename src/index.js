import { isFSA } from 'flux-standard-action'

export default function(validators){
  return ({ dispatch }) => next => action => {
    const { error } = action
    const validator = validators[action.type]

    if (error || !isFSA(action) || !validator) return next(action)

    const { isValid, message } = validator(action.payload)

    return isValid
      ? next(action)
      : dispatch({...action, payload: { message }, error: true })
  }
}
