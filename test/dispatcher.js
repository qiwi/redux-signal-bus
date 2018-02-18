import chai from 'chai'
import chaiSpies from 'chai-spies'
import Dispatcher from '../src/dispatcher'
import Signal from '../src/signal'
import Filter from '../src/filter'

const {expect} = chai
chai.use(chaiSpies)

const dispatch = chai.spy(value => value)

describe('dispatcher', () => {
  describe('constructor', () => {
    const dispatcher = new Dispatcher(dispatch)

    expect(dispatcher.dispatch).to.equal(dispatch)
    expect(dispatcher.handlers).to.be.an('object')
  })

  describe('proto', () => {
    it('`emit` dispatches event', () => {
      const event = 'foo';
      const signal = new Signal(event)
      const filter = new Filter(() => {})
      const dispatcher = new Dispatcher(dispatch)

      expect(dispatcher.emit(event, signal, filter)).to.deep.include({
        type: event,
        signal,
        filter
      })

      expect(dispatch).to.be.called()
    })

    it('`on` creates subscription', () => {
      const dispatcher = new Dispatcher(dispatch)
      const handler = () => {}

      dispatcher.on('TEST', handler)
      expect(dispatcher.handlers['TEST']).to.equal(handler)
    })

    it('`remove` destructs subscription', () => {
      const dispatcher = new Dispatcher(dispatch)
      const handler = () => {}

      dispatcher.on('TEST', handler)
      dispatcher.remove('TEST')
      expect(dispatcher.handlers['TEST']).to.be.undefined
    })

    describe('`reducer`', () => {
      it('applies target handler', () => {
        const type = 'TEST'
        const result = 'foo'
        const handler = chai.spy(() => result)
        const dispatcher = new Dispatcher(dispatch)
        const signal = new Signal('qux')
        const filter = new Filter(() => {})
        const state = []
        const action = {type, signal, filter}

        dispatcher.on(type, handler)
        expect(dispatcher.reducer(state, action)).to.equal(result)
        expect(handler).to.have.been.called.with({state, event: type, signal, filter})
      })

      it('does nothing otherwise', () => {
        const type = 'TEST'
        const result = 'foo'
        const handler = chai.spy(() => result)
        const dispatcher = new Dispatcher(dispatch)
        const signal = new Signal('qux')
        const filter = new Filter(() => {})
        const state = []
        const action = {type: 'FOOBAR', signal, filter}

        dispatcher.on(type, handler)
        expect(dispatcher.reducer(state, action)).to.equal(state)
        expect(handler).to.not.have.been.called()
      })
    })
  })
})