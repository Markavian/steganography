function saveJPEG(path, canvas, quality) {
  return new Promise((accept, reject) => {
    quality = quality || 75;
    path = path.replace('{{quality}}', quality);
    var fs = require('fs'),
      out = fs.createWriteStream(path),
      stream = canvas.jpegStream({
        bufsize: 4096, // output buffer size in bytes, default: 4096
        quality: quality, // JPEG quality (0-100) default: 75
        progressive: false // true for progressive compression, default: false
      }),
      timeout = 0;

    stream.on('data', function (chunk) {
      out.write(chunk);
    });

    stream.on('end', function () {
      console.log('Saved jpg', path);
      clearTimeout(timeout);
      accept(path);
    });

    timeout = setTimeout(() => {
      reject(`Timed out trying to Save jpg: ${path}, Quality: ${quality}`);
    }, 5000);
  });
}

module.exports = saveJPEG;
