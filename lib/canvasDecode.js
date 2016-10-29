function decode(context, imageData) {
  var result = [];
  var limit = 255;

  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var r0 = data[i]; // red
    var g0 = data[i + 1]; // green
    var b0 = data[i + 2]; // blue
    var avg = (r0 + g0 + b0) / 3;
    var value = r0;
    if (result.length < limit) {
      result.push(value);
    }
  }

  return result;
}

module.exports = decode;
