const fs = require('fs/promises');
const path = require('path');

// функция для чтения файла и возврата его содержимого
async function readFile(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

// функция для замены тегов на содержимое компонентов
async function replaceTagsWithComponents(template, componentsDir) {
  const tags = template.match(/{{.+?}}/g);
  for (const tag of tags) {
    const componentName = tag.slice(2, -2); // удаляем фигурные скобки
    const componentFilePath = path.join(componentsDir, `${componentName}.html`);
    const componentContent = await readFile(componentFilePath);
    template = template.replace(tag, componentContent);
  }
  return template;
}

// функция для сборки стилей в единый файл
async function combineStyles(stylesDir, outputFile) {
  const files = await fs.readdir(stylesDir);
  const cssFiles = files.filter(file => path.extname(file) === '.css');
  const content = await Promise.all(
      cssFiles.map(file => readFile(path.join(stylesDir, file)))
  );
  await fs.writeFile(outputFile, content.join('\n'));
}

// основная функция для выполнения задачи
async function buildPage() {
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');
  const templateFilePath = path.join(__dirname, 'template.html');
  const outputDir = path.join(__dirname, 'project-dist');
  const outputFilePath = path.join(outputDir, 'index.html');
  const stylesOutputFile = path.join(outputDir, 'style.css');

  // создаем выходную папку
  await fs.mkdir(outputDir);

  // читаем и заменяем содержимое тегов в шаблоне
  let template = await readFile(templateFilePath);
  template = await replaceTagsWithComponents(template, componentsDir);

  // сохраняем результат в выходной файл
  await fs.writeFile(outputFilePath, template);

  // собираем стили в единый файл
  await combineStyles(stylesDir, stylesOutputFile);

  // копируем папку assets
  const assetsOutputDir = path.join(outputDir, 'assets');
  await fs.mkdir(assetsOutputDir);
  const files = await fs.readdir(assetsDir);
  for (const file of files) {
    const srcPath = path.join(assetsDir, file);
    const destPath = path.join(assetsOutputDir, file);
    const srcStats = await fs.stat(srcPath);
    if (srcStats.isDirectory()) {
      await fs.mkdir(destPath);
      const subFiles = await fs.readdir(srcPath);
      for (const subFile of subFiles) {
        const subSrcPath = path.join(srcPath, subFile);
        const subDestPath = path.join(destPath, subFile);
        await fs.copyFile(subSrcPath, subDestPath);
      }
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildPage();
