console.log('node canvas test:');

var fs = require('fs');
var Canvas = require('canvas'),
  Image = Canvas.Image,
  canvas = new Canvas(200, 200),
  ctx = canvas.getContext('2d');


var testTemplate = fs.readFileSync(__dirname + '/test.template.html', 'utf8');

var sourceImagePath = __dirname + '/images/source/awesome.png';
var outputTestPath = __dirname + '/test.html'
var outputTestPNG = __dirname + '/images/output/savePNG-test.png';
var outputTestJPEG = __dirname + '/images/output/saveJPEG-test-{{quality}}.jpg';
fs.readFile(sourceImagePath, function (err, sourceImage) {
  if (err) throw err;
  img = new Image;
  img.src = sourceImage;
  ctx.rotate(0.5);
  ctx.drawImage(img, -100, -100, img.width, img.height);

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

  savePNG(outputTestPNG, canvas);
  saveJPEG(outputTestJPEG, canvas, 100);
  saveJPEG(outputTestJPEG, canvas, 75);
  saveJPEG(outputTestJPEG, canvas, 50);
  saveJPEG(outputTestJPEG, canvas, 25);
  saveJPEG(outputTestJPEG, canvas, 10);
  saveJPEG(outputTestJPEG, canvas, 0);
});

function savePNG(path, canvas) {
  var fs = require('fs'),
    out = fs.createWriteStream(path),
    stream = canvas.pngStream();

  stream.on('data', function (chunk) {
    out.write(chunk);
  });

  stream.on('end', function () {
    console.log('Saved png', path);
  });
}

function saveJPEG(path, canvas, quality) {
  quality = quality || 75;
  path = path.replace('{{quality}}', quality);
  var fs = require('fs'),
    out = fs.createWriteStream(path),
    stream = canvas.jpegStream({
      bufsize: 4096, // output buffer size in bytes, default: 4096
      quality: quality, // JPEG quality (0-100) default: 75
      progressive: false // true for progressive compression, default: false
    });

  stream.on('data', function (chunk) {
    out.write(chunk);
  });

  stream.on('end', function () {
    console.log('Saved jpg', path);
  });
}
