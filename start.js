console.log('node canvas test:');

var fs = require('fs');
var Canvas = require('canvas'),
  Image = Canvas.Image;

var savePNG = require('./lib/savePng');
var saveJPEG = require('./lib/saveJpeg');

var testTemplate = fs.readFileSync(__dirname + '/test.template.html', 'utf8');

var sourceImagePath = __dirname + '/images/source/workstation.jpg';
var outputTestPath = __dirname + '/test.html'
var outputTestPNG = __dirname + '/images/output/savePNG-test.png';
var outputTestJPEG = __dirname + '/images/output/saveJPEG-test-{{quality}}.jpg';

var messageToEncode = process.argv[2] || 'Team Fate is Awesome! Hack Manchester 2016';
var dataToEncode = createNumberArrayFromString(messageToEncode);
var decodedData = dataToEncode; // TODO: Read from source image
var decodedMessage = createStringFromNumberArray(decodedData);

function createNumberArrayFromString(inputString) {
  var numberArray = [];
  for (var i = 0; i < inputString.length; i++) {
    var charCode = inputString.charCodeAt(i);
    numberArray.push(charCode);
  }
  return numberArray;
}

function createStringFromNumberArray(numberArray) {
  var stringArray = numberArray.map((code) => {
    return String.fromCharCode(code)
  });
  return stringArray.join('');
}

console.log('Message to Encode:', messageToEncode);
console.log('Data to Encode:');
console.log(dataToEncode.join(' '));
console.log('Decoded Data:');
console.log(decodedData.join(' '));
console.log('Decoded Message:');
console.log(decodedMessage.split('').join(' '));

function grayscale(context, imageData) {
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  context.putImageData(imageData, 0, 0);
};

function encode(context, imageData, dataToEncode) {
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    /* var avg = (data[i] + data[i + 1] + data[i + 2]) / 3; */
    var pixel = dataToEncode[i / 4 % dataToEncode.length];
    data[i] = pixel; // red
    data[i + 1] = pixel; // green
    data[i + 2] = pixel; // blue
  }
  context.putImageData(imageData, 0, 0);
}

fs.readFile(sourceImagePath, function (err, sourceImage) {
  if (err) throw err;
  img = new Image;
  img.src = sourceImage;

  canvas = new Canvas(img.width / 4, img.height / 4),
    ctx = canvas.getContext('2d');

  ctx.scale(0.25, 0.25);
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //grayscale(ctx, rawImageData);
  encode(ctx, rawImageData, dataToEncode);

  var imgData = canvas.toDataURL();
  var imgTag = '<img src="' + imgData + '" />';
  fs.writeFile(outputTestPath, testTemplate.replace('{{body}}', imgTag), 'utf8');
  console.log('Wrote test image out to', outputTestPath, 'containing', imgData.length, 'bytes');

  var NL = '\n';
  Promise.all([
    savePNG(outputTestPNG, canvas),
    saveJPEG(outputTestJPEG, canvas, 100),
    saveJPEG(outputTestJPEG, canvas, 75),
    saveJPEG(outputTestJPEG, canvas, 50),
    saveJPEG(outputTestJPEG, canvas, 25),
    saveJPEG(outputTestJPEG, canvas, 10),
    saveJPEG(outputTestJPEG, canvas, 5),
    saveJPEG(outputTestJPEG, canvas, 1),
  ]).then((files) => {
    console.log('Wrote files', NL, files.join(NL));
  });
});
