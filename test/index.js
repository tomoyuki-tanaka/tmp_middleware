import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import validateMiddleWare from '../src'

chai.use(sinonChai)

describe('payload validate middleware', () => {
  const validator = {
    VALID: (payload) => { payload },
    INVALID : () => { throw new Error('invalid') }
  }

  const middleware = validateMiddleWare(validator)

  it('must return a function to middleware.', () => {
    expect(middleware).to.be.a('function')
    expect(middleware.length).to.deep.equal(0)
  })

  const nextHandler = middleware()

  it('must return a function to handle next.', () => {
    expect(nextHandler).to.be.a('function')
    expect(nextHandler.length).to.deep.equal(1)
  })

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler()

      expect(actionHandler).to.be.a('function')
      expect(actionHandler.length).to.deep.equal(1)
    })

    describe('handle action', () => {
      const validValidator = sinon.spy(validator, 'VALID')
      const invalidValidator = sinon.spy(validator, 'INVALID')

      it('must pass action to next if action is valid', done => {
        const actionObj = { type: 'VALID', payload: 'payload' }
        const actionHandler  = nextHandler(action => {
          expect(validValidator).to.have.been.calledOnce
          expect(validValidator).to.have.been.calledWith('payload')
          expect(action).to.deep.equal(actionObj)
          done()
        })

        actionHandler(actionObj)
      })

      it('must pass action to next if have { error: true }', done => {
        validValidator.reset()
        const actionObj = { type: 'VALID', error: true }
        const actionHandler = nextHandler(action => {
          expect(validValidator).to.have.not.been.called
          expect(action).to.deep.equal(actionObj)
          done()
        })

        actionHandler(actionObj)
      })

      it('must pass aciton to next if acion is not FSA', done => {
        validValidator.reset()
        const actionObj = { type: 'VALID', foo: 'bar' }
        const actionHandler = nextHandler(action => {
          expect(validValidator).to.have.not.been.called
          expect(action).to.deep.equal(actionObj)
          done()
        })

        actionHandler(actionObj)
      })

      it('must pass action to next if not match validator', done => {
        const actionObj = { type: 'ACTION' }
        validValidator.reset()
        const actionHandler = nextHandler(action => {
          expect(validValidator).to.have.not.been.called
          expect(action).to.deep.equal(actionObj)
          done()
        })

        actionHandler(actionObj)
      })

      it('must cange paylod to an error object, if action invalid', done => {
        const actionObj = { type: 'INVALID' }
        const actionHandler = nextHandler(action => {
          expect(invalidValidator).to.have.been.calledOnce
          expect(action.error).to.deep.equal(true)
          expect(action.payload.message).to.deep.equal('invalid')
          done()
        })

        actionHandler(actionObj)
      })
    })
  })
})
