var info = require('./package.json');
console.log(info.description);

var NL = '\n';
var fs = require('fs');
var encodeImage = require('./lib/encodeImage');
var decodeImage = require('./lib/decodeImage');

var sourceImagePath = __dirname + '/images/source/workstation.jpg';
var outputPath = __dirname + '/images/output';
var outputName = 'save';

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

fs.readFile(sourceImagePath, function (err, sourceImage) {
  if (err) throw err;

  console.log('');

  encodeImage(sourceImage, dataToEncode, outputPath, outputName)
    .then((files) => {
      console.log('');
      console.log(`Saved output as ${files.length} files:`, NL, files.join(NL));
      return files;
    })
    .then((files) => {
      console.log('');
      console.log('Decoding data', files[0]);
      fs.readFile(files[0], function (err, sourceImage) {
        return decodeImage(sourceImage).then((decodedData) => {
          // console.log('Decoded Data:', decodedData.join(' '));
          console.log('Decoded data', decodedData.length, 'values');
          var decodedMessage = createStringFromNumberArray(decodedData);
          console.log('Decoded Message:', decodedMessage);
        });
      });
    })
    .catch((ex) => {
      console.error('Explosions', ex, ex.stack);
    });
});
