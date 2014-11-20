var onedoc = require('../').render
var fs = require('fs')
var pathlib = require('path')

var out = onedoc(read('../demo/index.md'))
write('../demo/index.html', out)

function read(path){
  return fs.readFileSync(
    pathlib.resolve(__dirname, path)
  ).toString()
}
function write(path, data){
  return fs.writeFileSync(
    pathlib.resolve(__dirname, path),
    data
  )
}
