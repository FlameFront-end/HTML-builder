const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fileStream = fs.createWriteStream('input.txt', { flags: 'a' });

console.log('Введите текст, который хотите, чтобы записался в input.txt (нажмите Ctrl+C или введите "exit" для выхода):');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('До свидания!');
    fileStream.end();
    rl.close();
  } else {
    fileStream.write(`${input}\n`);
  }
});

rl.on('close', () => {
  console.log('До свидания!');
  fileStream.end();
});
