var packageJson = require('./package.json')
var supportedVersions = require('.')

var isok = true
Object.keys(supportedVersions).forEach(function (ver) {
  try {
    var verjson = require('./modules/' + supportedVersions[ver] + '/package.json')
    var testload = require('./modules/' + supportedVersions[ver])
    if (verjson.version !== packageJson.version) {
      console.error('module ' + ver + ' is out of date, found ' + verjson.version + ' and expected ' + packageJson.version)
      isok = false
    }
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error('module ' + ver + ' is missing')
    } else {
      console.error('module ' + ver + ' is broken: ' + e.stack)
    }
    isok = false
    return
  }
})

process.exit(isok ? 0: 1)
