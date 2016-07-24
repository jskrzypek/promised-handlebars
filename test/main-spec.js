/*!
 * promised-handlebars <https://github.com/nknapp/promised-handlebars>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
// /* global xdescribe */
// /* global xit */

'use strict'

// Chai Setup
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect

describe('promised-handlebars:', function () {
  if (parseInt(process.version[1]) === 0) {
    describe('with no global.Promise', function () {
      it('should throw', function () {
        return expect(require('../')).to.throw()
      })
    })
  } else {
    describe('with global.promise', function () {
      var Handlebars = require('./handlebars-setup-global')()

      it('should return a promise for the ouput with helpers resolved', function (done) {
        var template = Handlebars.compile(fixture('simple-helper.hbs'))
        return expect(template({a: 'abc', b: 'xyz'}))
          .to.eventually.equal('123 h(abc) 456 h(xyz)')
          .notify(done)
      })

      it('should work with block helpers that call `fn` while resolving a promise', function (done) {
        var template = Handlebars.compile(fixture('block-helper.hbs'))
        return expect(template({a: 'abc', b: 'xyz'}))
          .to.eventually.equal('123 b(abc) 456\n123 bi(cba) 456')
          .notify(done)
      })

      it('should work with a helper being called from within a block helpers', function (done) {
        var template = Handlebars.compile(fixture('nested-helpers.hbs'))
        return expect(template({a: 'abc', b: 'xyz'}))
          .to.eventually.equal('block b( h(abc) ) 45\ninverse bi( h(cba) ) 456')
          .notify(done)
      })

      it('should handle {{expr}} and {{{expr}}} like Handlebars does', function (done) {
        var template = Handlebars.compile(fixture('escaping.hbs'))
        return expect(template({a: '<a>', b: '<b>'}))
          .to.eventually.equal('raw: <a> h(<a>)\nesc: &lt;a&gt; h(&lt;a&gt;)')
          .notify(done)
      })

      it('should work correctly when partials are called', function (done) {
        var template = Handlebars.compile(fixture('partials.hbs'))
        return expect(template({a: 'aa', b: 'bb'}))
          .to.eventually.equal('h(partialA) 123 h(aa) h(partialB) 456 h(bb)')
          .notify(done)
      })

      it('the options.fn()-method should not return a promise for synchronous block helpers', function (done) {
        var template = Handlebars.compile(fixture('synchronous-block-helper.hbs'))
        return expect(template({}))
          .to.eventually.equal('abc,abc')
          .notify(done)
      })

      it('simple helpers should also be able to return real values', function (done) {
        var template = Handlebars.compile(fixture('synchronous-simple-helper.hbs'))
        return expect(template({}))
          .to.eventually.equal('27')
          .notify(done)
      })

      it('helpers passed in as parameters like {{#helper (otherhelper 123)}} should be resolved within the helper call', function (done) {
        var template = Handlebars.compile(fixture('helper-as-parameter.hbs'))
        return expect(template({}))
          .to.eventually.equal('index.js (1)\nondex.js (0)')
          .notify(done)
      })

      it('partials calls should maintain the correct `root`-variable when a parameter is passed', function (done) {
        var template = Handlebars.compile('{{>call a}}')
        return expect(template({
          a: 3
        }))
          .to.eventually.equal('{"a":3}')
          .notify(done)
      })

      it('helpers passed into partials as parameters like {{>partial (helper 123)}} should be resolved within the helper call', function (done) {
        var template = Handlebars.compile(fixture('helper-as-parameter-for-partial.hbs'))
        return expect(template({}))
          .to.eventually.equal('id(h(abc))')
          .notify(done)
      })

      it('helpers passed in via as hash-parameter like {{#helper param=(otherhelper 123)}} should be resolved within the helper call', function (done) {
        var template = Handlebars.compile(fixture('helper-as-hash.hbs'))
        return expect(template({}))
          .to.eventually.equal('hash(false=h(false),true=h(true))')
          .notify(done)
      })

      it('async helpers nested in synchronous block-helpers should work', function (done) {
        var template = Handlebars.compile(fixture('synchronous-block-helper-nests-async.hbs'))
        return expect(template({a: 'aa'}))
          .to.eventually.equal('h(aa),h(aa)')
          .notify(done)
      })
      it('async helpers nested in synchronous builtin block-helpers should work', function (done) {
        var template = Handlebars.compile(fixture('builtin-block-helper-nests-async.hbs'))
        return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
          .to.eventually.equal('h(aa)-h(bb)-')
          .notify(done)
      })

      it('a completely synchronous block helper (with synchronous resolvable content) not have to deal with placeholders', function (done) {
        var template = Handlebars.compile(fixture('block-helper-manipulate.hbs'))
        return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
          .to.eventually.equal('abc')
          .notify(done)
      })
      it('async helpers should work inside an async block-helper that passes (this) to the block-function', function (done) {
        var template = Handlebars.compile(fixture('async-block-helper-with-nested-async-helper.hbs'))
        return expect(template({a: 'b'}))
          .to.eventually.equal('h(a)')
          .notify(done)
      })
    })
  }
  describe('with Q', function () {
    var Handlebars = require('./handlebars-setup-Q')()

    it('should return a promise for the ouput with helpers resolved', function (done) {
      var template = Handlebars.compile(fixture('simple-helper.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('123 h(abc) 456 h(xyz)')
        .notify(done)
    })

    it('should work with block helpers that call `fn` while resolving a promise', function (done) {
      var template = Handlebars.compile(fixture('block-helper.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('123 b(abc) 456\n123 bi(cba) 456')
        .notify(done)
    })

    it('should work with a helper being called from within a block helpers', function (done) {
      var template = Handlebars.compile(fixture('nested-helpers.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('block b( h(abc) ) 45\ninverse bi( h(cba) ) 456')
        .notify(done)
    })

    it('should handle {{expr}} and {{{expr}}} like Handlebars does', function (done) {
      var template = Handlebars.compile(fixture('escaping.hbs'))
      return expect(template({a: '<a>', b: '<b>'}))
        .to.eventually.equal('raw: <a> h(<a>)\nesc: &lt;a&gt; h(&lt;a&gt;)')
        .notify(done)
    })

    it('should work correctly when partials are called', function (done) {
      var template = Handlebars.compile(fixture('partials.hbs'))
      return expect(template({a: 'aa', b: 'bb'}))
        .to.eventually.equal('h(partialA) 123 h(aa) h(partialB) 456 h(bb)')
        .notify(done)
    })

    it('the options.fn()-method should not return a promise for synchronous block helpers', function (done) {
      var template = Handlebars.compile(fixture('synchronous-block-helper.hbs'))
      return expect(template({}))
        .to.eventually.equal('abc,abc')
        .notify(done)
    })

    it('simple helpers should also be able to return real values', function (done) {
      var template = Handlebars.compile(fixture('synchronous-simple-helper.hbs'))
      return expect(template({}))
        .to.eventually.equal('27')
        .notify(done)
    })

    it('helpers passed in as parameters like {{#helper (otherhelper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-parameter.hbs'))
      return expect(template({}))
        .to.eventually.equal('index.js (1)\nondex.js (0)')
        .notify(done)
    })

    it('partials calls should maintain the correct `root`-variable when a parameter is passed', function (done) {
      var template = Handlebars.compile('{{>call a}}')
      return expect(template({
        a: 3
      }))
        .to.eventually.equal('{"a":3}')
        .notify(done)
    })

    it('helpers passed into partials as parameters like {{>partial (helper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-parameter-for-partial.hbs'))
      return expect(template({}))
        .to.eventually.equal('id(h(abc))')
        .notify(done)
    })

    it('helpers passed in via as hash-parameter like {{#helper param=(otherhelper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-hash.hbs'))
      return expect(template({}))
        .to.eventually.equal('hash(false=h(false),true=h(true))')
        .notify(done)
    })
    it('async helpers nested in synchronous block-helpers should work', function (done) {
      var template = Handlebars.compile(fixture('synchronous-block-helper-nests-async.hbs'))
      return expect(template({a: 'aa'}))
        .to.eventually.equal('h(aa),h(aa)')
        .notify(done)
    })
    it('async helpers nested in synchronous builtin block-helpers should work', function (done) {
      var template = Handlebars.compile(fixture('builtin-block-helper-nests-async.hbs'))
      return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
        .to.eventually.equal('h(aa)-h(bb)-')
        .notify(done)
    })

    it('a completely synchronous block helper (with synchronous resolvable content) not have to deal with placeholders', function (done) {
      var template = Handlebars.compile(fixture('block-helper-manipulate.hbs'))
      return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
        .to.eventually.equal('abc')
        .notify(done)
    })
    it('async helpers should work inside an async block-helper that passes (this) to the block-function', function (done) {
      var template = Handlebars.compile(fixture('async-block-helper-with-nested-async-helper.hbs'))
      return expect(template({a: 'b'}))
        .to.eventually.equal('h(a)')
        .notify(done)
    })
  })
  describe('with bluebird', function () {
    var Handlebars = require('./handlebars-setup-bluebird')()

    it('should return a promise for the ouput with helpers resolved', function (done) {
      var template = Handlebars.compile(fixture('simple-helper.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('123 h(abc) 456 h(xyz)')
        .notify(done)
    })

    it('should work with block helpers that call `fn` while resolving a promise', function (done) {
      var template = Handlebars.compile(fixture('block-helper.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('123 b(abc) 456\n123 bi(cba) 456')
        .notify(done)
    })

    it('should work with a helper being called from within a block helpers', function (done) {
      var template = Handlebars.compile(fixture('nested-helpers.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('block b( h(abc) ) 45\ninverse bi( h(cba) ) 456')
        .notify(done)
    })

    it('should handle {{expr}} and {{{expr}}} like Handlebars does', function (done) {
      var template = Handlebars.compile(fixture('escaping.hbs'))
      return expect(template({a: '<a>', b: '<b>'}))
        .to.eventually.equal('raw: <a> h(<a>)\nesc: &lt;a&gt; h(&lt;a&gt;)')
        .notify(done)
    })

    it('should work correctly when partials are called', function (done) {
      var template = Handlebars.compile(fixture('partials.hbs'))
      return expect(template({a: 'aa', b: 'bb'}))
        .to.eventually.equal('h(partialA) 123 h(aa) h(partialB) 456 h(bb)')
        .notify(done)
    })

    it('the options.fn()-method should not return a promise for synchronous block helpers', function (done) {
      var template = Handlebars.compile(fixture('synchronous-block-helper.hbs'))
      return expect(template({}))
        .to.eventually.equal('abc,abc')
        .notify(done)
    })

    it('simple helpers should also be able to return real values', function (done) {
      var template = Handlebars.compile(fixture('synchronous-simple-helper.hbs'))
      return expect(template({}))
        .to.eventually.equal('27')
        .notify(done)
    })

    it('helpers passed in as parameters like {{#helper (otherhelper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-parameter.hbs'))
      return expect(template({}))
        .to.eventually.equal('index.js (1)\nondex.js (0)')
        .notify(done)
    })

    it('partials calls should maintain the correct `root`-variable when a parameter is passed', function (done) {
      var template = Handlebars.compile('{{>call a}}')
      return expect(template({
        a: 3
      }))
        .to.eventually.equal('{"a":3}')
        .notify(done)
    })

    it('helpers passed into partials as parameters like {{>partial (helper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-parameter-for-partial.hbs'))
      return expect(template({}))
        .to.eventually.equal('id(h(abc))')
        .notify(done)
    })

    it('helpers passed in via as hash-parameter like {{#helper param=(otherhelper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-hash.hbs'))
      return expect(template({}))
        .to.eventually.equal('hash(false=h(false),true=h(true))')
        .notify(done)
    })
    it('async helpers nested in synchronous block-helpers should work', function (done) {
      var template = Handlebars.compile(fixture('synchronous-block-helper-nests-async.hbs'))
      return expect(template({a: 'aa'}))
        .to.eventually.equal('h(aa),h(aa)')
        .notify(done)
    })
    it('async helpers nested in synchronous builtin block-helpers should work', function (done) {
      var template = Handlebars.compile(fixture('builtin-block-helper-nests-async.hbs'))
      return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
        .to.eventually.equal('h(aa)-h(bb)-')
        .notify(done)
    })

    it('a completely synchronous block helper (with synchronous resolvable content) not have to deal with placeholders', function (done) {
      var template = Handlebars.compile(fixture('block-helper-manipulate.hbs'))
      return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
        .to.eventually.equal('abc')
        .notify(done)
    })
    it('async helpers should work inside an async block-helper that passes (this) to the block-function', function (done) {
      var template = Handlebars.compile(fixture('async-block-helper-with-nested-async-helper.hbs'))
      return expect(template({a: 'b'}))
        .to.eventually.equal('h(a)')
        .notify(done)
    })
  })

  describe('with es6', function () {
    var Handlebars = require('./handlebars-setup-es6')()

    it('should return a promise for the ouput with helpers resolved', function (done) {
      var template = Handlebars.compile(fixture('simple-helper.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('123 h(abc) 456 h(xyz)')
        .notify(done)
    })

    it('should work with block helpers that call `fn` while resolving a promise', function (done) {
      var template = Handlebars.compile(fixture('block-helper.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('123 b(abc) 456\n123 bi(cba) 456')
        .notify(done)
    })

    it('should work with a helper being called from within a block helpers', function (done) {
      var template = Handlebars.compile(fixture('nested-helpers.hbs'))
      return expect(template({a: 'abc', b: 'xyz'}))
        .to.eventually.equal('block b( h(abc) ) 45\ninverse bi( h(cba) ) 456')
        .notify(done)
    })

    it('should handle {{expr}} and {{{expr}}} like Handlebars does', function (done) {
      var template = Handlebars.compile(fixture('escaping.hbs'))
      return expect(template({a: '<a>', b: '<b>'}))
        .to.eventually.equal('raw: <a> h(<a>)\nesc: &lt;a&gt; h(&lt;a&gt;)')
        .notify(done)
    })

    it('should work correctly when partials are called', function (done) {
      var template = Handlebars.compile(fixture('partials.hbs'))
      return expect(template({a: 'aa', b: 'bb'}))
        .to.eventually.equal('h(partialA) 123 h(aa) h(partialB) 456 h(bb)')
        .notify(done)
    })

    it('the options.fn()-method should not return a promise for synchronous block helpers', function (done) {
      var template = Handlebars.compile(fixture('synchronous-block-helper.hbs'))
      return expect(template({}))
        .to.eventually.equal('abc,abc')
        .notify(done)
    })

    it('simple helpers should also be able to return real values', function (done) {
      var template = Handlebars.compile(fixture('synchronous-simple-helper.hbs'))
      return expect(template({}))
        .to.eventually.equal('27')
        .notify(done)
    })

    it('helpers passed in as parameters like {{#helper (otherhelper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-parameter.hbs'))
      return expect(template({}))
        .to.eventually.equal('index.js (1)\nondex.js (0)')
        .notify(done)
    })

    it('partials calls should maintain the correct `root`-variable when a parameter is passed', function (done) {
      var template = Handlebars.compile('{{>call a}}')
      return expect(template({
        a: 3
      }))
        .to.eventually.equal('{"a":3}')
        .notify(done)
    })

    it('helpers passed into partials as parameters like {{>partial (helper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-parameter-for-partial.hbs'))
      return expect(template({}))
        .to.eventually.equal('id(h(abc))')
        .notify(done)
    })

    it('helpers passed in via as hash-parameter like {{#helper param=(otherhelper 123)}} should be resolved within the helper call', function (done) {
      var template = Handlebars.compile(fixture('helper-as-hash.hbs'))
      return expect(template({}))
        .to.eventually.equal('hash(false=h(false),true=h(true))')
        .notify(done)
    })
    it('async helpers nested in synchronous block-helpers should work', function (done) {
      var template = Handlebars.compile(fixture('synchronous-block-helper-nests-async.hbs'))
      return expect(template({a: 'aa'}))
        .to.eventually.equal('h(aa),h(aa)')
        .notify(done)
    })
    it('async helpers nested in synchronous builtin block-helpers should work', function (done) {
      var template = Handlebars.compile(fixture('builtin-block-helper-nests-async.hbs'))
      return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
        .to.eventually.equal('h(aa)-h(bb)-')
        .notify(done)
    })

    it('a completely synchronous block helper (with synchronous resolvable content) not have to deal with placeholders', function (done) {
      var template = Handlebars.compile(fixture('block-helper-manipulate.hbs'))
      return expect(template({arr: [{a: 'aa'}, {a: 'bb'}]}))
        .to.eventually.equal('abc')
        .notify(done)
    })

    it('async helpers should work inside an async block-helper that passes (this) to the block-function', function (done) {
      var template = Handlebars.compile(fixture('async-block-helper-with-nested-async-helper.hbs'))
      return expect(template({a: 'b'}))
        .to.eventually.equal('h(a)')
        .notify(done)
    })
  })
})

function fixture (file) {
  var fs = require('fs')
  return fs.readFileSync(require.resolve('./fixtures/' + file), {encoding: 'utf-8'}).trim()
}
