import { computed, reactive } from '../src'

describe('computed', () => {
  it('should update the computed value even the object property value changes', () => {
    const product = reactive({ price: 100 })
    const computedPrice = computed(() => product.price * 0.23 + product.price)

    expect(computedPrice.value).toBe(123)

    product.price = 200
    expect(computedPrice.value).toBe(246)
  })
})
