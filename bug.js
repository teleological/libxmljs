
var libxml = require('./index');

var body = "<?xml version='1.0' encoding='UTF-8'?>\n" +
  "<root><node attr-one-key='attr-one-value' attr-two-key='attr-two-value' attr-three-key='attr-three-value'><abode><toad></toad></abode></node></root>";

function bare() {
  var doc = libxml.parseXml(body);
  var gpar = doc.get('//abode');
  gpar = null;
  doc = null;
  global.gc();
  global.gc();
}

function happyPath() {
  var doc = libxml.parseXml(body);

  var gpar = doc.get('//abode');
  var gkid = gpar.child(0); // parent has javascript wrapper so gets ref'd

  gpar.remove();
  gpar = null;

  global.gc(); // gpar is still ref'd by gkid

  console.log(gkid.toString());
}

function bombsAway() {
  var doc = libxml.parseXml(body);
  var gkid = doc.get('//toad'); // no javascript wrapper on parent
  var gpar = doc.get('//abode');

  gpar.remove();
  gpar = null;

  global.gc(); // gpar has no parent and no refs: xml node is freed
  // with fix, no more to collect

  console.log(gkid.toString());
}

/*
console.log("bare");
bare();
console.log("----");
global.gc(); // gkid
*/

console.log("good");
happyPath();
console.log("----");
global.gc(); // gkid

/*
console.log("bad");
bombsAway();
console.log("----");
*/

/*
function qux(doc) {
  var node = doc.get('node');
  var attr = node.attr('attr-one-key');
  node.remove();
  //return attr;
}
console.log("before");
qux(doc);
//var attr = qux();
//console.log("attr", attr);
//attr.remove();
global.gc();
global.gc();
console.log("after gc");
*/
/*
attr = null;
global.gc();
console.log("after gc2");
*/

