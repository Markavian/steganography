console.log('node canvas test:');

var fs = require('fs');
var Canvas = require('canvas'),
  Image = Canvas.Image;


var testTemplate = fs.readFileSync(__dirname + '/test.template.html', 'utf8');

var sourceImagePath = __dirname + '/images/source/workstation.jpg';
var outputTestPath = __dirname + '/test.html'
var outputTestPNG = __dirname + '/images/output/savePNG-test.png';
var outputTestJPEG = __dirname + '/images/output/saveJPEG-test-{{quality}}.jpg';
fs.readFile(sourceImagePath, function (err, sourceImage) {
  if (err) throw err;
  img = new Image;
  img.src = sourceImage;

  canvas = new Canvas(img.width / 4, img.height / 4),
  ctx = canvas.getContext('2d');

  ctx.scale(0.25, 0.25);
  ctx.drawImage(img, -100, -100, img.width, img.height);

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
  saveJPEG(outputTestJPEG, canvas, 5);
  saveJPEG(outputTestJPEG, canvas, 1);
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
