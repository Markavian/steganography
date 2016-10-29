console.log('node canvas test:');

var fs = require('fs');
var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(200, 200)
  , ctx = canvas.getContext('2d');


var testTemplate = fs.readFileSync(__dirname + '/test.template.html', 'utf8');

var sourceImagePath = __dirname + '/images/source/workstation.jpg';
var outputTestPath = __dirname + '/test.html'
fs.readFile(sourceImagePath, function(err, sourceImage) {
  if (err) throw err;
  img = new Image;
  img.src = sourceImage;
  ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);

  ctx.font = '30px Impact';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.rotate(.1);
  ctx.fillText("Awesome!", 50, 100);

  var te = ctx.measureText('Awesome!');
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.lineTo(50, 106);
  ctx.lineTo(50 + te.width, 106);
  ctx.stroke();

  var imgData = canvas.toDataURL();
  var imgTag = '<img src="' + imgData + '" />';
  fs.writeFile(outputTestPath, testTemplate.replace('{{body}}', imgTag), 'utf8');
  console.log('Wrote test image out to', outputTestPath, 'containing', imgData.length, 'bytes');
});
