var fs = require('fs')
var packageInfo = fs.statSync('./package.json')
var supportedVersions = require('.')

var isok = true
Object.keys(supportedVersions).forEach(function (ver) {
  try {
    var babelrcinfo = fs.statSync('babelrcs/' + supportedVersions[ver])
    if (packageInfo.mtime > babelrcinfo.mtime) {
      console.error('module ' + ver + ' is out of date, last touched ' + babelrcinfo.mtime + ' and expected >= ' + packageInfo.mtime)
      isok = false
    }
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error('module ' + ver + ' is missing')
    } else {
      console.error('module ' + ver + ' is broken: ' + e.message)
    }
    isok = false
    return
  }
})

process.exit(isok ? 0: 1)
