console.log('node canvas test:');

var fs = require('fs');
var encodeImage = require('./lib/encodeImage');

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
  encodeImage(sourceImage, dataToEncode, outputPath, outputName);
});
