function encode(context, imageData, dataToEncode) {
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var r0 = data[i]; // red
    var g0 = data[i + 1]; // green
    var b0 = data[i + 2]; // blue
    /* var avg = (r0 + g0 + b0) / 3; */
    var pixel = dataToEncode[i / 4 % dataToEncode.length];
    data[i] = pixel; // red
    data[i + 1] = g0; // green
    data[i + 2] = b0; // blue
  }
  context.putImageData(imageData, 0, 0);
}

module.exports = encode;
