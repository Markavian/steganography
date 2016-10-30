var pixelBlocks = require('./pixelBlocks');
var supportedAlphabet = require('./supportedAlphabet');
var stats = require('stats-lite');


function encode(context, imageData, dataToEncode, resolution) {
  var data = imageData.data;

  var blocks = pixelBlocks(imageData, resolution);

  var iterations = 0;
  var skips = 0;
  var total = 0;
  blocks.forEach((block, index) => {
    var dataPoint = dataToEncode[index % dataToEncode.length];
    var blockValue = Math.round(block.value());
    while(blockValue !== dataPoint) {
      iterations++;
      if(iterations % 10000 === 9999) {
        console.log('Skipped block', block.x, block.y, 'value', blockValue, 'target', dataPoint, 'iterations', iterations);
        blockValue = dataPoint; // skip block
        skips++;
      }
      else {
        block.modifyTowards(dataPoint);
        blockValue = Math.round(block.value());
      }
    }
    if(iterations < 9999) {
      // console.log(block.x, block.y, 'Block matched after', iterations, 'iterations');
    }
    iterations = 0;
    total++;
    writeBlock(block, imageData, dataPoint);
  });

  context.putImageData(imageData, 0, 0);

  console.info('Encoding skipped', skips, 'blocks out of', total);
}

function writeBlock(block, imageData, dataPoint) {
  var pixelOffset, px, py, r0, g0, b0;
  for (var j = 0; j < block.height; j++) {
    for (var i = 0; i < block.width; i++) {
      px = i;
      py = j;
      blockPixelOffset = (py * block.width + px) * 4;
      imagePixelOffset = ((block.y + py) * imageData.width + (block.x + px)) * 4;

      r0 = block.pixels[blockPixelOffset];
      g0 = block.pixels[blockPixelOffset + 1];
      b0 = block.pixels[blockPixelOffset + 2];

      imageData.data[imagePixelOffset] = r0;
      imageData.data[imagePixelOffset + 1] = g0;
      imageData.data[imagePixelOffset + 2] = b0;
    }
  }
}

module.exports = encode;
