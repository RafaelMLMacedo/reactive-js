import { Ref, UnwrapRef } from './ref'
import { isFunction } from './shared/index'
import { effect, ReactiveEffect, activeEffect } from './effect'

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: UnwrapRef<T>
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = () => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(options: WritableComputedOptions<T>): WritableComputedRef<T>
export function computed<T>(getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => {
      console.warn('Write operation failed: computed value is readonly')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  let dirty = true
  let value: T

  const runner = effect(getter, {
    lazy: true,
    // mark effect as computed so that it gets priority during trigger
    computed: true,
    scheduler: () => {
      dirty = true
    }
  })
  return {
    _isRef: true,
    // expose effect so computed can be stopped
    effect: runner,
    get value() {
      if (dirty) {
        value = runner()
        dirty = false
      }
      // When computed effects are accessed in a parent effect, the parent
      // should track all the dependencies the computed property has tracked.
      // This should also apply for chained computed properties.
      trackChildRun(runner)
      return value
    },
    set value(newValue: T) {
      setter(newValue)
    }
  } as any
}

function trackChildRun(childRunner: ReactiveEffect) {
  if (activeEffect === undefined) {
    return
  }
  for (let i = 0; i < childRunner.deps.length; i++) {
    const dep = childRunner.deps[i]
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect)
      activeEffect.deps.push(dep)
    }
  }
}
