import { isFSA } from 'flux-standard-action'

export default function(validators){
  return () => next => action => {
    const { error } = action
    const validator = validators[action.type]

    if (error || !isFSA(action) || !validator) return next(action)

    try {
      validator(action.payload)
      next(action)
    } catch(e) {
      next({...action, payload: e, error: true})
    }
  }
}
