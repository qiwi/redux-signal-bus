/* eslint no-unused-expressions: 0 */
import chai from 'chai'
import Filter from '../../main/js/filter'

const { expect } = chai

describe('filter', () => {
  describe('constructs proper instance', () => {
    it('from string', () => {
      const value = 'foo'
      const filter = new Filter(value)

      expect(filter.value).to.equal(value)
      expect(filter.fn({ name: value })).to.be.true
    })

    it('from regex', () => {
      const value = /^foo.*/i
      const filter = new Filter(value)

      expect(filter.value).to.equal(value)
      expect(filter.fn({ name: 'FOOBAR' })).to.be.true
    })

    it('from predicate', () => {
      const value = ({ name }) => name.length === 3
      const filter = new Filter(value)

      expect(filter.value).to.equal(value)
      expect(filter.fn({ name: 'FOO' })).to.be.true
      expect(filter.fn({ name: 'FOObar' })).to.be.false
    })

    it('from any other', () => {
      const value = null
      const filter = new Filter(value)

      expect(filter.value).to.equal(value)
      expect(filter.fn()).to.be.false
      expect(filter.fn({ name: 'FOObar' })).to.be.false
    })
  })
})
