var Canvas = require('canvas'),
  Image = Canvas.Image;

function canvasDecode(context, imageData) {
  var result = [];
  var limit = 255;

  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var r0 = data[i]; // red
    var g0 = data[i + 1]; // green
    var b0 = data[i + 2]; // blue
    var avg = (r0 + g0 + b0) / 3;
    var value = avg;
    if(result.length < limit) {
      result.push(value);
    }
  }

  return result;
}

function decodeImage(sourceImage) {
  var decodedData = [];
  img = new Image;
  img.src = sourceImage;

  canvas = new Canvas(img.width, img.height),
    ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, img.width, img.height);
  var rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  decodedData = canvasDecode(ctx, rawImageData);

  return Promise.accept(decodedData);
}

module.exports = decodeImage;
