# redux-payload-validator
Redux middleware for fsa payload validation.

**This liblary no supported `redux-thunk`**

[![NPM](https://nodei.co/npm/redux-payload-validator.png)](https://nodei.co/npm/redux-payload-validator/)


### Table of Contents
* [Getting Started](#gettingstarted)
  * [Installation](#installation)
  * [Usage](#usage)

# Getting Started

## Installation

```bash
$ npm install --save redux-payload-validator
```

or

```bash
$ yarn add redux-payload-validator
```

## Usage

```js
// store
/* ...import others ... */

import payloadValidator from 'redux-payload-validator'

export default createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    payloadValidator,
    /* ... */
  )
)
```

Should be use [fsa-meta-extender](https://github.com/tomoyuki-tanaka/fsa-meta-extender)
`fsa-meta-extender` it'll mapping `meta` to same aciton type.

```js
// validator/index.js
import metaExtendCreator from 'fsa-meta-extender'

const validator = {
  INCREMENT: count => {  // It will be mappped same action type.
    if(typeof count === 'number'){
      return { isValid: true }
    } else {
      return {
         isValid: true,
         message: 'Error! Argument must be number.'
      }
    }
  }
}

// Meta name must be 'validator'.
export default metaExtendCreator(validator, 'valitdator')

```

We recommend `redux-actions`, but you can use it even in basic action creator.

```js
// action
// use redux-actions
import {createAction} from 'redux-actions'
import validator from '../validator'

// wrap your action creator
export default validator(createAction('INCREMENT'))

// or basic action creator
const increment = (count) => ({ type: 'INCREMENT', payload: count })
export default validator({increment})
```

If `isValid` is `false` then middleware add '{error: true}' and change payload to '{ payload: message }'.

```js
// reducer

import {handleActions} from 'redux-actions'
export const initialState = {
  result: ''
}

export default handleAction('INCREMENT', {
    next(state, action){
      return { result: 'isValid!' }
    },
    throw(state, action){
      return { result: action.payload.message }
    }
}, initialState)
```
