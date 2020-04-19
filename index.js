'use strict'

// TODO
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/reactive-js.cjs.prod.js')
} else {
  module.exports = require('./dist/reactivity.cjs.js')
}
