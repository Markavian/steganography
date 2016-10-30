var stats = require('stats-lite');
var supportedAlphabet = require('./supportedAlphabet');

function createPixelBlocks(imageData, resolution) {
  var blockSize = {
    width: imageData.width / resolution,
    height: imageData.height / resolution,
    resolution: resolution
  };

  var blocks = [];

  var block;
  for (var j = 0; j < resolution; j++) {
    for (var i = 0; i < resolution; i++) {
      block = createPixelBlock(i, j, blockSize, imageData)
      blocks.push(block);
    }
  }

  //console.log('Blocks', blocks);

  return blocks;
}

function createPixelBlock(x, y, blockSize, imageData) {
  var block = {
    x: Math.floor(x * blockSize.width),
    y: Math.floor(y * blockSize.height),
    width: Math.floor(blockSize.width),
    height: Math.floor(blockSize.height),
    pixels: []
  };

  var px, py;
  for (var j = 0; j < block.height; j++) {
    for (var i = 0; i < block.width; i++) {
      px = i;
      py = j;
      var imagePixelOffset = ((block.y + py) * imageData.width + (block.x + px)) * 4;
      var r0 = imageData.data[imagePixelOffset];
      var g0 = imageData.data[imagePixelOffset + 1];
      var b0 = imageData.data[imagePixelOffset + 2];

      block.pixels[(py * block.width + px) * 4] = r0;
      block.pixels[(py * block.width + px) * 4 + 1] = g0;
      block.pixels[(py * block.width + px) * 4 + 2] = b0;
    }
  }

  block.value = () => {
    return valuePerBlock(block);
  };

  block.modifyTowards = (value) => {
    return modifyBlockTowards(block, value);
  }

  return block;
}

function modifyBlockTowards(block, target) {
  var pixelOffset, px, py, r0, g0, b0;
  var value = block.value();
  var diff = Math.abs(value - target);
  var distance = Math.abs(value - diff);

  var blueNeeded = 0;
  var greenNeeded = 0;
  var pixelsInBlock = block.width * block.height;

  for (var j = 0; j < block.height; j++) {
    for (var i = 0; i < block.width; i++) {
      px = i;
      py = j;
      blockPixelOffset = (py * block.width + px) * 4;

      r0 = block.pixels[blockPixelOffset];
      g0 = block.pixels[blockPixelOffset + 1];
      b0 = block.pixels[blockPixelOffset + 2];

      block.pixels[blockPixelOffset] = r0;
      if (Math.random() > 0.2) {
        // skip
      } else {
        block.pixels[blockPixelOffset] = Math.round(Math.max(0, Math.min(255, r0 + Math.random() * 2 - 1)));
        block.pixels[blockPixelOffset + 1] = Math.round(Math.max(0, Math.min(255, g0 + Math.random() * 2 - 1)));
        block.pixels[blockPixelOffset + 2] = Math.round(Math.max(0, Math.min(255, b0 + Math.random() * 2 - 1)));
      }
    }
  }
  // console.log('Modify', block.x, block.y, 'target', target, 'value', value, 'new value', block.value(), greenNeeded, blueNeeded);
}

function valuePerBlock(block) {
  var pixelOffset, px, py, r0, g0, b0;
  var totalg = 0, totalb = 0, totalr = 0;
  for (var j = 0; j < block.height; j++) {
    for (var i = 0; i < block.width; i++) {
      px = i;
      py = j;
      blockPixelOffset = (py * block.width + px) * 4;

      r0 = block.pixels[blockPixelOffset];
      g0 = block.pixels[blockPixelOffset + 1];
      b0 = block.pixels[blockPixelOffset + 2];

      totalr += r0;
      totalg += g0;
      totalb += b0;
    }
  }
  // console.log('Total g', totalg, 'Total b', totalb);
  block.totalr = totalr;
  block.totalg = totalg;
  block.totalb = totalb;
  var sensitivity = 1;
  var diff = Math.round(Math.abs(totalg / sensitivity - totalb / sensitivity));
  var value = Math.round(diff % supportedAlphabet.length);
  return value;
}

module.exports = createPixelBlocks;
