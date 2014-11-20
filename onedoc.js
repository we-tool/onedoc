var marked = require('marked')
var _ = require('lodash')

var fs = require('fs')
var pathlib = require('path')
var layout = read('./layout.tpl.html')

exports.render = render

function render(source){

  var marker = new marked.Renderer()
  var parentHashH2
  var anchorsH123 = []
  var title

  // override heading func
  marker.heading = function(text, level, raw){
    var _raw = raw.replace(/\s*`.+/, '')
    var escapedText = _raw.toLowerCase()
      //.replace(/[^\w]+/g, '-')
      .replace(/\s/g, '-') // todo
    var hash = escapedText

    if (level === 1 && !title) { // once
      title = _raw
    }
    if (level === 2) {
      parentHashH2 = hash
    }
    if (level === 3 && parentHashH2) {
      hash = parentHashH2 + '/' + hash
    }
    if (level <= 3) {
      anchorsH123.push({
        level: level,
        text: (level === 3 ? '- ' : '') + _raw,
        hash: hash
      })
    }

    return '<h' + level + '>' +
      (level <= 3 ? ('<a name="' +
      hash +
      '" class="anchor" href="#' +
      hash +
      '">' + text + '</a>' +
      '<span class="ac">¶</span>') : // anchor icon
      text) + 
      '</h' + level + '>'
  }

  var body = marked(source, { renderer: marker })

  var sidebar = _.reduce(anchorsH123, function(memo, anchor){
    return memo + '<h' + anchor.level +
      '><a href="#' + anchor.hash +'">'+
      anchor.text + '</a></h' + anchor.level + '>'
  }, '')

  return _.template(layout, {
    title: title,
    body: body,
    sidebar: sidebar
  })

}


function read(path){
  return fs.readFileSync(
    pathlib.resolve(__dirname, path)
  ).toString()
}
