import chai from 'chai'
import Signal from '../../main/js/signal'

const { expect } = chai

describe('signal', () => {
  it('constructs proper instance', () => {
    const name = 'foo'
    const data = { foo: 'bar' }
    const ttl = 100
    const signal = new Signal({ name, data, ttl })

    expect(signal).to.be.instanceof(Signal)
    expect(signal.name).to.equal(name)
    expect(signal.data).to.equal(data)
    expect(signal.ttl).to.equal(ttl)
    expect(signal.expiresAt).to.be.a('number')
  })
})
