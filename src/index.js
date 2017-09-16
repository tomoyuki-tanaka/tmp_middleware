import { isFSA } from 'flux-standard-action'

export default function validateMiddleware({ dispatch }){
  return next => action => {
    const { validator } = action.meta

    if (!isFSA(action) || !validator) return next(action)

    const { isValid, message } = validator(action.payload)

    return isValid
      ? next(action)
      : dispatch({ ...action, payload: { message }, error: true })
  }
}
