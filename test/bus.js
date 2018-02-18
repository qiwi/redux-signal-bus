import chai from 'chai'
import Bus from '../src/bus'
import {createStore, combineReducers} from 'redux'

const {expect} = chai

describe('Bus', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const bus = new Bus()

      expect(bus).to.be.instanceof(Bus)
    })
  })
  describe('proto', () => {
    let bus
    let scope
    let store

    beforeEach(() => {
      bus = new Bus()
      scope = bus.getScope()
      store = createStore(combineReducers({[scope]: bus.getReducer()}), {})
      bus.configure({store: store})
    })

    describe('`emit`', () => {
      it('requires store', () => {
        bus.store = null

        expect(() => {bus.emit('foo')}).to.throw()
      })

      it('injects signal to store', () => {
        bus.emit('foo', {bar: 'baz'})

        expect(store.getState()[scope][0]).to.deep.include({name: 'foo', ttl: 5000, data: {bar: 'baz'}})
      })
    })

    describe('`listen`', () => {
      it('requires store', () => {
        bus.store = null
        expect(() => {bus.listen('foo')}).to.throw()
      })

      it('fetches by name', () => {
        const name = 'foobar'
        bus.emit(name, {bar: 'baz'})
        bus.emit(name, {baz: 'qux'})

        const signals = bus.listen('foobar')

        expect(signals.length).to.equal(2)
        expect(signals[0]).to.deep.include({name,  data: {bar: 'baz'}})
      })

      it('fetches by regex', () => {
        const name = 'foobar'
        bus.emit(name, {baz: 'qux'})

        const signals = bus.listen(/^foob/)

        expect(signals[0]).to.deep.include({name,  data: {baz: 'qux'}})
      })

      it('fetches by predicate fn', () => {
        const name = 'foobar'
        bus.emit(name, {baz: 'qux'})

        const signals = bus.listen(({name}) => !name.indexOf('foo'))

        expect(signals[0]).to.deep.include({name,  data: {baz: 'qux'}})
      })

      it('returns empty array if no match found', () => {
        const signals = bus.listen()

        expect(signals.length).to.equal(0)
      })
    })

    describe('`capture`', () => {
      it('requires store', () => {
        bus.store = null
        expect(() => {bus.capture('foo')}).to.throw()
      })

      it('returns signals and then removes them from store', () => {
        const name = 'foobar'
        bus.emit(name, {bar: 'baz'})
        bus.emit(name, {baz: 'qux'})

        expect(bus.capture('foobar').length).to.equal(2)
        expect(bus.listen('foobar').length).to.equal(0)
      })
    })

    describe('`erase`', () => {
      it('requires store', () => {
        bus.store = null
        expect(() => {bus.erase('foo')}).to.throw()
      })

      it('removes signals from store', () => {
        const name = 'foobar'
        bus.emit(name, {bar: 'baz'})
        bus.emit(name, {baz: 'qux'})

        bus.erase('foobar')

        expect(bus.listen('foobar').length).to.equal(0)
      })
    })

    describe('`compact`', () => {
      it('removes expired signals', () => {
        const name = 'foobar'

        bus.emit(name, {bar: 'baz'}, 0)
        bus.emit(name, {baz: 'qux'}, 100000)

        bus.compact()

        expect(store.getState()[scope].length).to.equal(1)
      })
    })
  })
})
