const fs = require('fs');
const path = require('path');

const STYLES_DIR = './styles';
const bundlePath = './project-dist/bundle.css';

fs.readdir(STYLES_DIR, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  const cssFiles = files.filter(file => path.extname(file) === '.css');

  // Чтение и объединение содержимого всех файлов
  const cssContent = cssFiles.map(file => {
    const filePath = path.join(STYLES_DIR, file);
    return fs.readFileSync(filePath, 'utf-8');
  }).join('\n');

  // Запись объединенного содержимого в файл bundle.css
  fs.writeFile(bundlePath, cssContent, err => {
    if (err) {
      console.error(`Error writing bundle file: ${err}`);
      return;
    }
    console.log(`Bundle file written to ${bundlePath}`);
  });
});
