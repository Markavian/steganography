function savePNG(path, canvas) {
  return new Promise((accept, reject) => {
    var fs = require('fs'),
      out = fs.createWriteStream(path),
      stream = canvas.pngStream()
      timeout = 0;

    stream.on('data', function (chunk) {
      out.write(chunk);
    });

    stream.on('end', function () {
      console.log('Saved png', path);
      clearTimeout(timeout);
      accept(path);
    });

    timeout = setTimeout(() => {
      reject(`Timed out trying to Save png: ${path}`);
    }, 5000);
  });
}

module.exports = savePNG;
