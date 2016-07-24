/*!
 * promised-handlebars <https://github.com/nknapp/promised-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var Q = require('q')

module.exports = setupHandlebars

function setupHandlebars () {
  // Handlebars-Setup
  var promisedHandlebars = require('../')
  var Handlebars = promisedHandlebars(require('handlebars'), {Promise: Q.Promise})

  Handlebars.registerHelper({
    'helper': function (delay, value) {
      return Q.delay(delay).then(function () {
        return 'h(' + value + ')'
      })
    },
    'stringifyRoot': function (options) {
      return JSON.stringify(options.data.root)
    },
    'helper-hash': function (options) {
      var hashString = Object.keys(options.hash).sort().map(function (key) {
        return key + '=' + options.hash[key]
      }).join(',')
      return new Handlebars.SafeString('hash(' + hashString + ')')
    },
    'block': function (delay, value, options) {
      return Q.delay(delay)
        .then(function () {
          return options.fn(value)
        })
        .then(function (result) {
          return 'b(' + result + ')'
        })
    },
    'block-inverse': function (delay, value, options) {
      return Q.delay(delay)
        .then(function () {
          return options.inverse(value)
        })
        .then(function (result) {
          return 'bi(' + result + ')'
        })
    },
    'block-context': function (options) {
      return Q(options.fn(this))
    },
    'insert-twice': function (options) {
      return options.fn(this) + ',' + options.fn(this)
    },
    'times-three': function (number) {
      return 3 * number
    },
    'exists': function (file) {
      return require('q-io/fs').exists(file)
    },
    'toNumber': function (obj) {
      return '(' + Number(obj) + ')'
    },
    'spaces': function (count) {
      return '                                              '.substr(0, count)
    }
  })

  // Call "registerHelper(name, helper) for code coverage
  // Trim block contents
  Handlebars.registerHelper('trim', function (options) {
    return String(options.fn(this)).trim()
  })

  Handlebars.registerPartial('a', "{{helper '10' 'partialA'}}")
  Handlebars.registerPartial('b', "{{helper '10' 'partialB'}}")
  Handlebars.registerPartial('identity', 'id({{.}})')
  Handlebars.registerPartial('call', '{{{stringifyRoot}}}')

  return Handlebars
}
