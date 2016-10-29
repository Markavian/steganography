var info = require('./package.json');
console.log(info.description);

var NL = '\n';
var fs = require('fs');
var path = require('path');
var encodeImage = require('./lib/encodeImage');
var decodeImage = require('./lib/decodeImage');

var supportedAlphabet = require('./lib/supportedAlphabet');
var alphabetMap = {};
var alphabetIndex = [];
supportedAlphabet.split('').forEach((char, index) => {
  alphabetMap[char] = index;
  alphabetIndex[index] = char;
});

function createNumberArrayFromString(inputString) {
  return inputString.split('').map((char) => {
    return alphabetMap[char.toLowerCase()] || 0;
  });
}

function createStringFromNumberArray(numberArray) {
  var stringArray = numberArray.map((code) => {
    return alphabetIndex[code];
  });
  return stringArray.join('');
}

var sourceImagePath = __dirname + '/images/source/workstation.jpg';
var outputPath = __dirname + '/images/output';
var outputName = 'save';
var resolution = 20;

var messageToEncode = process.argv[2] || 'Team Fate is Awesome! #hackmcr 2016';

if (messageToEncode.length > resolution * 2) {
  console.log('WARNING: Message is too long for specified resolution - it will be cropped', Math.pow(resolution, 2), resolution, messageToEncode.length);
  messageToEncode = messageToEncode.slice(0, resolution * 2);
}

while (messageToEncode.length < resolution * 2) {
  messageToEncode = messageToEncode.toLowerCase() + ' ';
}

var dataToEncode = createNumberArrayFromString(messageToEncode);
var decodedData = dataToEncode; // TODO: Read from source image
var decodedMessage = createStringFromNumberArray(decodedData);

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

var passes = [],
  fails = [];

function decodeImageFile(imagePath) {
  return new Promise((accept, reject) => {
    var pathInfo = path.parse(imagePath);
    fs.readFile(imagePath, function (err, sourceImage) {
      if (err) reject(err);

      decodeImage(sourceImage, resolution).then((decodedData) => {
          var decodedMessage = createStringFromNumberArray(decodedData);
          if (decodedMessage === messageToEncode) {
            passes.push(['[P] Pass', `"${decodedMessage}"`, pathInfo.name]);
            process.stdout.write(' o');
          } else {
            fails.push(['[F] Fail', `"${decodedMessage}"`, pathInfo.name]);
            process.stdout.write(' x');
          }
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
      .then(() => {
        console.log('Passes', passes.length, [''].concat(passes).join(NL));
        console.log('');
        console.log('Fails', fails.length, [''].concat(fails).join(NL));
      })
      .catch((ex) => {
        console.error('Explosions', ex, ex.stack);
      })
  });
