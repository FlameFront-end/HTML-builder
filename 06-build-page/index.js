const fs = require("fs");
const path = require("path");

// Создаем папку project-dist
const distPath = path.join(__dirname, "project-dist");
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// Считываем содержимое шаблона и компонентов
const templatePath = path.join(__dirname, "template.html");
const templateContent = fs.readFileSync(templatePath, "utf-8");
const componentsPath = path.join(__dirname, "components");
const componentFiles = fs.readdirSync(componentsPath);

// Заменяем шаблонные теги в файле template.html на содержимое компонентов
let result = templateContent;
for (const file of componentFiles) {
  const componentName = path.parse(file).name;
  const componentPath = path.join(componentsPath, file);
  const componentContent = fs.readFileSync(componentPath, "utf-8");
  result = result.replace(
    new RegExp(`{{${componentName}}}`, "g"),
    componentContent
  );
}

// Сохраняем результат в файл index.html в папке project-dist
const indexPath = path.join(distPath, "index.html");
fs.writeFileSync(indexPath, result);

// Собираем стили из папки styles и помещаем их в файл style.css
const stylesPath = path.join(__dirname, "styles");
const styleFiles = fs.readdirSync(stylesPath);
let styleContent = "";
for (const file of styleFiles) {
  const extname = path.extname(file);
  if (extname === ".css") {
    const stylePath = path.join(stylesPath, file);
    const style = fs.readFileSync(stylePath, "utf-8");
    styleContent += style;
  }
}
const stylePath = path.join(distPath, "style.css");
fs.writeFileSync(stylePath, styleContent);

// Копируем папку assets в project-dist/assets
const assetsPath = path.join(__dirname, "assets");
const distAssetsPath = path.join(distPath, "assets");
const copyFile = (srcPath, destPath) => {
  const readStream = fs.createReadStream(srcPath);
  const writeStream = fs.createWriteStream(destPath);
  readStream.on("error", (err) => console.error(err));
  writeStream.on("error", (err) => console.error(err));
  readStream.pipe(writeStream);
};
if (fs.existsSync(assetsPath)) {
  fs.mkdirSync(distAssetsPath, { recursive: true });
  const assetFiles = fs.readdirSync(assetsPath);
  for (const file of assetFiles) {
    const srcPath = path.join(assetsPath, file);
    const destPath = path.join(distAssetsPath, file);
    const stats = fs.statSync(srcPath);
    if (stats.isFile() && path.extname(srcPath) !== ".html") {
      copyFile(srcPath, destPath);
    }
  }
}
console.log("Успешное выполнение!")
