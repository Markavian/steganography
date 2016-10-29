var pixelBlocks = require('./pixelBlocks');

function decode(context, imageData, resolution) {
  var result = [];

  var blocks = pixelBlocks(imageData, resolution);

  blocks.forEach((block, index) => {
    var dataPoint = readBlock(block, imageData);
    result.push(dataPoint);
  });

  return result;
}

function readBlock(block, imageData) {
  var result = 0;
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

      result = r0;
    }
  }
  return result;
}

module.exports = decode;
