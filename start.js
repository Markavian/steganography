var info = require('./package.json');
console.log(info.description);

var NL = '\n';
var fs = require('fs');
var encodeImage = require('./lib/encodeImage');
var decodeImage = require('./lib/decodeImage');

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

var sourceImagePath = __dirname + '/images/source/workstation.jpg';
var outputPath = __dirname + '/images/output';
var outputName = 'save';
var resolution = 20;

var messageToEncode = process.argv[2] || 'Team Fate is Awesome! Hack Manchester 2016';
var dataToEncode = createNumberArrayFromString(messageToEncode);
var decodedData = dataToEncode; // TODO: Read from source image
var decodedMessage = createStringFromNumberArray(decodedData);

if(messageToEncode.length > Math.pow(resolution, 2)) {
  console.log('WARNING: Message is too long for specified resolution - it will be cropped', Math.pow(resolution, 2), resolution, messageToEncode.length);
}

console.log('Message to Encode:', messageToEncode);
console.log('Data to Encode:');
console.log(dataToEncode.join(' '));
console.log('Sample Decoded Data:');
console.log(decodedData.join(' '));
console.log('Sample Decoded Message:');
console.log(decodedMessage.split('').join(' '));

function encodeImageFile(imagePath) {
  console.log('');
  return new Promise((accept, reject) => {
    fs.readFile(imagePath, function (err, sourceImage) {
      if (err) reject(err);

      encodeImage(sourceImage, resolution, dataToEncode, outputPath, outputName)
        .then((files) => {
          console.log('');
          console.log(`Saved output as ${files.length} files:`, NL, files.join(NL));
          return files;
        })
        .then(accept)
        .catch(reject);
    });
  });
}

function decodeImageFile(imagePath) {
  return new Promise((accept, reject) => {
    fs.readFile(imagePath, function (err, sourceImage) {
      if (err) reject(err);

      decodeImage(sourceImage, resolution).then((decodedData) => {
          console.log('');
          console.log('Decoded data', decodedData.length, 'values', 'from', imagePath);
          var decodedMessage = createStringFromNumberArray(decodedData);
          console.log('Decoded Message:', decodedMessage);
          console.log('');
        })
        .then(accept)
        .catch(reject);
    });
  });
}

encodeImageFile(sourceImagePath)
  .then((files) => {
    console.log('Starting to decode', files.length, 'files...');
    return Promise.all(files.map((file) => {
        return decodeImageFile(file);
      }))
      .catch((ex) => {
        console.error('Explosions', ex, ex.stack);
      })
  });
