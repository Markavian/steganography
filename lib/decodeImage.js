var Canvas = require('canvas'),
  Image = Canvas.Image;

var canvasDecode = require('./canvasDecode');

function decodeImage(sourceImage, resolution) {
  var decodedData = [];
  img = new Image;
  img.src = sourceImage;

  canvas = new Canvas(img.width, img.height),
    ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, img.width, img.height);
  var rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  decodedData = canvasDecode(ctx, rawImageData, resolution);

  return Promise.accept(decodedData);
}

module.exports = decodeImage;
