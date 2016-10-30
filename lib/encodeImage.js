var Canvas = require('canvas'),
  Image = Canvas.Image;

var fs = require('fs');
var savePNG = require('./savePng');
var saveJPEG = require('./saveJpeg');
var grayscale = require('./canvasGrayscale');
var encode = require('./canvasEncode');
var testTemplate = fs.readFileSync(__dirname + '/../test.template.html', 'utf8');

function encodeImage(sourceImage, resolution, dataToEncode, outputPath, outputName) {
  img = new Image;
  img.src = sourceImage;

  var scales = [0.5, 0.25, 0.15]; // [0.05, 0.15, 0.25];
  var results = [];
  scales.forEach((scale) => {
    canvas = new Canvas(img.width * scale, img.height * scale),
      ctx = canvas.getContext('2d');

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    encode(ctx, rawImageData, dataToEncode, resolution);

    var outputHTML = outputPath + `/${outputName}-${scale*100}.html`
    var outputPNG = outputPath + `/${outputName}PNG-${scale*100}.png`;
    var outputJPEG = outputPath + `/${outputName}JPEG-${scale*100}-{{quality}}.jpg`;

    var imgData = canvas.toDataURL();
    var imgTag = '<img src="' + imgData + '" />';
    fs.writeFile(outputHTML, testTemplate.replace('{{body}}', imgTag), 'utf8');
    console.log(`Wrote HTML test template out to`, outputHTML, 'containing', imgData.length, 'bytes');

    results.push(
      savePNG(outputPNG, canvas),
      saveJPEG(outputJPEG, canvas, 100),
      saveJPEG(outputJPEG, canvas, 90),
      saveJPEG(outputJPEG, canvas, 75),
      saveJPEG(outputJPEG, canvas, 60)
      /*
      saveJPEG(outputJPEG, canvas, 50),
      saveJPEG(outputJPEG, canvas, 25),
      saveJPEG(outputJPEG, canvas, 10),
      saveJPEG(outputJPEG, canvas, 5),
      saveJPEG(outputJPEG, canvas, 1)
      */
    );
  });

  return Promise.all(results);
}

module.exports = encodeImage;
