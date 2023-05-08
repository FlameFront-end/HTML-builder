const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.access(destDir);
  } catch (error) {
    await fs.mkdir(destDir, { recursive: true });
  }

  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourceFile = path.join(sourceDir, file);
    const destFile = path.join(destDir, file);
    const fileStat = await fs.stat(sourceFile);
    if (fileStat.isDirectory()) {
      await copyDir(sourceFile, destFile);
    } else {
      await fs.copyFile(sourceFile, destFile);
    }
  }
}

copyDir()
    .then(() => console.log('Copy completed'))
    .catch((err) => console.error(err));
