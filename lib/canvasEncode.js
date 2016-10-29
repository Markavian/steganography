function encode(context, imageData, dataToEncode) {
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    /* var avg = (data[i] + data[i + 1] + data[i + 2]) / 3; */
    var pixel = dataToEncode[i / 4 % dataToEncode.length];
    data[i] = pixel; // red
    data[i + 1] = pixel; // green
    data[i + 2] = pixel; // blue
  }
  context.putImageData(imageData, 0, 0);
}

module.exports = encode;
