const fs = require('fs');
const readStream = fs.createReadStream('./text.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log(chunk);
});
