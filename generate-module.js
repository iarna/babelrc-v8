'use strict'
var path = require('path')
var fs = require('fs')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var clone = require('lodash.clonedeep')
var v8version = process.versions.v8
var packageJson = require('./package.json')
var templatePackageJson = require('./template-package.json')
var readme = fs.readFileSync('module-README.md')

var config = {
  "blacklist": generateBlacklist(),
  "optional": generateOptional()
}

var modulestub = v8version.replace(/[.]/g,'-')
var modulename = 'babelrc-v8-' + modulestub
var modulejson = clone(templatePackageJson)
modulejson.name = modulename
modulejson.version = packageJson.version
modulejson.description = 'A babelrc tuned for use with v8 ' + v8version
modulejson.engines = {node: process.version.replace(/v/,'^')}

var modulePath = path.join('modules', modulename)

rimraf.sync(modulePath)
mkdirp.sync(modulePath)
fs.writeFileSync(path.join(modulePath, 'package.json'), JSON.stringify(modulejson, null, 2))
fs.writeFileSync(path.join(modulePath, modulejson.main), JSON.stringify(config, null, 2))
fs.writeFileSync(path.join(modulePath, 'README.md'), readme)

var supportedVersions = require('./supported-versions.json')
supportedVersions[v8version] = modulename
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

function generateBlacklist () {
  var blacklist = []

  function bltry(transformer, example) {
    tryAnd(example, function () {
      blacklist.push(transformer)
    })
  }

  bltry('es3.memberExpressionLiterals', 'var foo = { "catch": 13 }; foo.catch')
  bltry('es3.propertyLiterals', 'var foo = { catch: function () {} }')
  bltry('es5.properties.mutators', 'var foo = { get bar() { return "bar"; } };')
  bltry('es6.arrowFunctions', '() => 23')
  bltry('es6.blockScoping', 'let a = 3')
  bltry('es6.classes', 'class foo { }')
  bltry('es6.constants', 'const b = 5')
  bltry('es6.destructuring', 'var [a, ,b] = [1,2,3]')
  bltry('es6.forOf', 'var a = [1,2,3]; for (var n of a) { }')
  bltry('es6.literals', '0b10 + 0o70')
  bltry('es6.modules', 'export var pi = 3.14; import fs from "fs"')
  bltry('es6.objectSuper', 'class foo { } class bar extends foo { constructor () { super() } }')
  bltry('es6.parameters', 'function f(x, y=12) {} ; function f(x, ...y) {}')
  bltry('es6.properties.computed', 'var obj = { [ "prop_" + (function () { return 42 })() ]: 42 }')
  bltry('es6.properties.shorthand', 'var a = 23; var obj = { a }')
  bltry('es6.spread', 'var a = [...[1,2,3]]')
  bltry('es6.tailCall',
    'function factorial(n, acc) {' +
    '  "use strict";' +
    '  if (acc == null) acc = 1;' +
    '  if (n <= 1) return acc;' +
    '  return factorial(n - 1, n * acc);' +
    '}' +
    'factorial(100000)')
  bltry('es6.templateLiterals', '`This is an\nexample`')
  bltry('es6.regex.unicode', 'assert("𠮷".match(/./u)[0].length == 2); assert("\\u{20BB7}" == "𠮷" == "\\uD842\\uDFB7"); assert("𠮷".codePointAt(0) == 0x20BB7)')
  bltry('es6.regex.sticky', 'RegExp("", "y");')
  bltry('es7.asyncFunctions', 'async function () {}')
  bltry('es7.exponentiationOperator', 'assert(2**2 === 4)')
  bltry('es7.objectRestSpread', 'var { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };')

  return blacklist
}

function generateOptional() {
  var optional = []
  function opttry(transformer, ifMissing, andHas) {
    tryOr(ifMissing, function () {
      tryAnd(andHas, function () {
        optional.push(transformer)
      })
    })
  }
  opttry('asyncToGenerator', 'async function () {}', 'function* asynctogentest () {}')
  return optional
}
