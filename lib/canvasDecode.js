var pixelBlocks = require('./pixelBlocks');
var supportedAlphabet = require('./supportedAlphabet');
var stats = require('stats-lite')

function decode(context, imageData, resolution) {
  var result = [];

  var blocks = pixelBlocks(imageData, resolution);

  var blockData = blocks.map((block, index) => {
    return readBlock(block, imageData);
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
    return Math.round(stats.percentile(values, 0.55) / 255 * supportedAlphabet.length);
  });

  return result;
}

function readBlock(block, imageData) {
  var result = 0;
  var pixelOffset, px, py, r0, g0, b0, avg;
  var avg, med, mode;
  var rvals = [];
  var gvals = [];
  var bvals = [];
  for (var j = 0; j < block.height; j++) {
    for (var i = 0; i < block.width; i++) {
      px = i;
      py = j;
      blockPixelOffset = (py * block.width + px) * 4;
      imagePixelOffset = ((block.y + py) * imageData.width + (block.x + px)) * 4;

      r0 = block.pixels[blockPixelOffset];
      g0 = block.pixels[blockPixelOffset + 1];
      b0 = block.pixels[blockPixelOffset + 2];

      rvals.push(r0);
      gvals.push(g0);
      bvals.push(b0);
    }
  }

  var rmean = (stats.mean(rvals));
  var rmedian = (stats.median(rvals));
  var rmode = (stats.mode(rvals));
  var rvariance = (stats.variance(rvals));
  var rstdev = (stats.stdev(rvals));
  var rprcth = (stats.percentile(rvals, 0.15));

  /*
    console.log('mean: %s', rmean);
    console.log('median: %s', rmedian);
    console.log('mode: %s', rmode);
    console.log('variance: %s', rvariance);
    console.log('standard deviation: %s', rstdev);
    console.log('85th percentile: %s', r85th);
  */
  result = rmedian;
  return result;
}

module.exports = decode;
