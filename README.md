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
// validator/index.js

const validator = {
  INCREMENT: count => {  // It will be mappped same action type.
    if(typeof count !== 'number'){
      throw new Error('Error! Argument must be number.') // throw some Error.
    }
  }
}

export default validator

```

```js
// store
/* ...import others ... */

import payloadValidator from 'redux-payload-validator'
import validator from './validator'

export default createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    payloadValidator(validator)
    /* ... */
  )
)
```

If `valid` is `false` then middleware add '{error: true}' and change payload to '{ payload: errorObject }'.

```js
// reducer

import {handleActions} from 'redux-actions'
export const initialState = {
  result: ''
}

export default handleAction('INCREMENT', {
    next(state, action){
      return { result: 'valid!' }
    },
    throw(state, action){
      return { result: action.payload.message }
    }
}, initialState)
```
