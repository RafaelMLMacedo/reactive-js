import { extend } from '../../src/shared'

describe('shared', () => {
  describe('extend', () => {
    it('should extend one object', () => {
      // arrange
      const a = { a: 'object a' }
      const b = { b: { c: 'nested property' } }
      const merged = { a: 'object a', b: { c: 'nested property' } }

      // act
      const extended = extend(a, b)

      // assert
      expect(extended).toStrictEqual(merged)
    })

    it('should throw an error when extend array', () => {
      // arrange
      const a = [1]
      const b = [2, [3, 4]]

      // act
      const extended = () => extend(a, b)

      // assert
      expect(extended).toThrowError(`'a' and 'b' must be of type Object. Array given.`)
    })
  })
})
