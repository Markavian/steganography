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

  return block;
}

module.exports = createPixelBlocks;
