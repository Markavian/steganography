var Canvas = require('canvas'),
  Image = Canvas.Image;

var fs = require('fs');
var savePNG = require('./savePng');
var saveJPEG = require('./saveJpeg');
var grayscale = require('./canvasGrayscale');
var encode = require('./canvasEncode');
var testTemplate = fs.readFileSync(__dirname + '/../test.template.html', 'utf8');

function encodeImage(sourceImage, dataToEncode, outputPath, outputName) {
  img = new Image;
  img.src = sourceImage;

  canvas = new Canvas(img.width / 4, img.height / 4),
    ctx = canvas.getContext('2d');

  ctx.scale(0.25, 0.25);
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  encode(ctx, rawImageData, dataToEncode);

  var outputHTML = outputPath + `/${outputName}.html`
  var outputPNG = outputPath + `/${outputName}PNG-test.png`;
  var outputJPEG = outputPath + `/${outputName}JPEG-test-{{quality}}.jpg`;

  var imgData = canvas.toDataURL();
  var imgTag = '<img src="' + imgData + '" />';
  fs.writeFile(outputHTML, testTemplate.replace('{{body}}', imgTag), 'utf8');
  console.log(`Wrote HTML test template out to`, outputHTML, 'containing', imgData.length, 'bytes');

  var NL = '\n';
  Promise.all([
    savePNG(outputPNG, canvas),
    saveJPEG(outputJPEG, canvas, 100),
    saveJPEG(outputJPEG, canvas, 75),
    saveJPEG(outputJPEG, canvas, 50),
    saveJPEG(outputJPEG, canvas, 25),
    saveJPEG(outputJPEG, canvas, 10),
    saveJPEG(outputJPEG, canvas, 5),
    saveJPEG(outputJPEG, canvas, 1),
  ]).then((files) => {
    console.log('Wrote files', NL, files.join(NL));
  });
}

module.exports = encodeImage;
