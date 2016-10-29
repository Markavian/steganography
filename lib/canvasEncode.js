var pixelBlocks = require('./pixelBlocks');

function encode(context, imageData, dataToEncode, resolution) {
  var data = imageData.data;

  var blocks = pixelBlocks(imageData, resolution);

  blocks.forEach((block, index) => {
    var dataPoint = dataToEncode[index % dataToEncode.length];
    writeBlock(block, imageData, dataPoint);
  });

  context.putImageData(imageData, 0, 0);
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
      r0 = dataPoint; // replace red with data
      g0 = block.pixels[blockPixelOffset + 1];
      b0 = block.pixels[blockPixelOffset + 2];

      imageData.data[imagePixelOffset] = r0;
      imageData.data[imagePixelOffset + 1] = g0;
      imageData.data[imagePixelOffset + 2] = b0;
    }
  }
}

module.exports = encode;
