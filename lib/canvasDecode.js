var pixelBlocks = require('./pixelBlocks');
var supportedAlphabet = require('./supportedAlphabet');
var stats = require('stats-lite')

function decode(context, imageData, resolution) {
  var result = [];

  var blocks = pixelBlocks(imageData, resolution);

  var blockData = blocks.map((block, index) => {
    return block.value();
  });

  var dataMap = [];
  var results = [];
  var expectedMessageLength = resolution * 2;
  var mi;
  blockData.forEach((dataPoint, index) => {
    mi = index % expectedMessageLength;
    dataMap[mi] = dataMap[mi] || [];
    dataMap[mi].push(dataPoint);
    results.push(dataPoint);
  });

  result = dataMap.map((values) => {
    return Math.round(stats.percentile(values, 0.5));
  });

  return result;
}

module.exports = decode;
