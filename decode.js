var info = require('./package.json');
console.log(info.description, 'decoder');

var NL = '\n';
var fs = require('fs');
var path = require('path');
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

var imageFolder = __dirname + '/images/downloaded';
var resolution = 20;

['test01.jpg', 'test02.jpg'].forEach((imagePath) => {
  decodeImageFile(imageFolder + '/' + imagePath);
});

function decodeImageFile(imagePath) {
  return new Promise((accept, reject) => {
    var pathInfo = path.parse(imagePath);
    fs.readFile(imagePath, function (err, sourceImage) {
      if (err) reject(err);

      decodeImage(sourceImage, resolution).then((decodedData) => {
          var decodedMessage = createStringFromNumberArray(decodedData);
          console.log('Decoded message', pathInfo.base, ':', decodedMessage);
        })
        .then(accept)
        .catch(reject);
    });
  });
}
