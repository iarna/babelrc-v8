'use strict'
var path = require('path')
var fs = require('fs')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var v8version = process.versions.v8

var config = {
  "plugins": generatePlugins()
}

var verstub = v8version.replace(/[.]/g,'-')
var filename = 'babelrc-v8-' + verstub

var babelrcPath = path.join('babelrcs', filename)

rimraf.sync(babelrcPath)
mkdirp.sync('babelrcs')
fs.writeFileSync(babelrcPath, JSON.stringify(config, null, 2))

var supportedVersions = require('./supported-versions.json')
supportedVersions[v8version] = filename
fs.writeFileSync('supported-versions.json', JSON.stringify(supportedVersions, null, 2))

function tryAnd(toTry, andThen) {
  try {
    eval(toTry)
    andThen()
  } catch (e) {}
}

function tryOr(toTry, orElse) {
  try {
    eval(toTry)
  } catch (e) {
    orElse()
  }
}

function generatePlugins () {
  var plugins = ['transform-strict-mode']

  function plugtry(transformer, example) {
    tryOr(example, function () {
      plugins.push(transformer)
    })
  }
  function plugtryWith(transformer, ifMissing, andHas) {
    tryOr(ifMissing, function () {
      tryAnd(andHas, function () {
        optional.push(transformer)
      })
    })
  }

  plugtry('transform-es3-member-expression-literals', 'var foo = { "catch": 13 }; foo.catch')
  plugtry('transform-es3-property-literals', 'var foo = { catch: function () {} }')
  plugtry('transform-es5-property-mutators', 'var foo = { get bar() { return "bar"; } };')

  plugtry('transform-es2015-arrow-functions', '() => 23')
  plugtry('transform-es2015-block-scoping', 'let a = 3')
  plugtry('transform-es2015-block-scoped-functions', 'function a () { return true } ; if (true) { function a () {return false} }; if (!a()) throw "boom"')
  plugtry('transform-es2015-classes', 'class foo { }')
  plugtry('transform-es2015-computed-properties', 'var obj = { [ "prop_" + (function () { return 42 })() ]: 42 }')
  plugtry('transform-es2015-constants', 'const b = 5')
  plugtry('transform-es2015-destructuring', 'var [a, ,b] = [1,2,3]')
  plugtry('transform-es2015-for-of', 'var a = [1,2,3]; for (var n of a) { }')
  plugtry('transform-es2015-function-name', 'var a = function () {}; if (a.name==null) throw "boom"')
  plugtry('transform-es2015-literals', '0b10 + 0o70')
  plugtry('transform-es2015-modules-commonjs', 'export var pi = 3.14; import fs from "fs"')
  plugtry('transform-es2015-object-super', 'class foo { } class bar extends foo { constructor () { super() } }')
  plugtry('transform-es2015-parameters', 'function f(x, y=12) {} ; function f(x, ...y) {}')
  plugtry('transform-es2015-shorthand-properties', 'var a = 23; var obj = { a }')
  plugtry('transform-es2015-spread', 'var a = [...[1,2,3]]')
  plugtry('transform-es2015-sticky-regex', 'RegExp("", "y");')
  plugtry('transform-es2015-template-literals', '`This is an\nexample`')
  plugtry('transform-es2015-typeof-symbol', 'var a = Symbol(); typeof a === "symbol" || throw "boom"')
  plugtry('transform-es2015-unicode-regex', 'assert("𠮷".match(/./u)[0].length == 2); assert("\\u{20BB7}" == "𠮷" == "\\uD842\\uDFB7"); assert("𠮷".codePointAt(0) == 0x20BB7)')

  plugtry('transform-exponentiation-operator', 'assert(2**2 === 4)')
  plugtry('transform-object-rest-spread', 'var { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };')

//  plugtry('transform-regenerator', 'function *foo() {}')

  plugtryWith('transform-async-to-generator', 'async function () {}', 'function* asynctogentest () {}')

  return plugins
}
