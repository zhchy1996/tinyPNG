const tinify = require('tinify');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

tinify.key = config.key;

init();
function init() {
  compressAll(readSourceImg());
}

async function compressAll(imgList) {
  const len = imgList.length;
  for (let i = 0; i < len; i++) {
    const file = imgList[i];
    console.log(`压缩-->${file.name}`, `任务${i + 1}/${len}`);
    await compress(file);
  }
}

// 压缩单个图片
// compress();
async function compress(file) {
  const num = config.maxNum || 2;
  let sourcePath = file.path;
  const sourceSize = fs.lstatSync(sourcePath).size;
  let finalSize = 0;
  for(let i = 0; i < num; i++) {
    const beforeSize = fs.lstatSync(sourcePath).size;
    // let outPath = path.join(config.tinyDir, `${file.name}-${i + 1}.png`);
    let outPath = path.join(config.tinyDir, `${file.name}.png`);
    let source = tinify.fromFile(sourcePath);
    console.log(`压缩第${i+1}次`)
    await source.toFile(outPath);
    const tinySize = fs.lstatSync(outPath).size;
    finalSize = tinySize;
    console.log(`压缩前大小${beforeSize / 1000}KB`, `压缩后大小${tinySize / 1000}KB`, `压缩率${((beforeSize - tinySize) / beforeSize).toFixed(4) * 100}%`)
    if (beforeSize - tinySize < config.minSize) {
      console.log('压缩量不足1k，停止压缩')
      break;
    }
    sourcePath = outPath;
  }
  console.log(`${file.name}图片压缩完毕------->`, `压缩前大小${sourceSize / 1000}KB`, `压缩后大小${finalSize / 1000}KB`, `压缩率${((sourceSize - finalSize) / sourceSize).toFixed(4) * 100}%`);
}

// 读取源文件
// readSourceImg();
function readSourceImg() {
  const files = fs.readdirSync(config.sourceDir)
  const list = [];

  files.forEach(file => {
    let obj = {
      path: path.join(config.sourceDir, file),
    }
    let arr = file.split('.');
    arr.pop();
    obj.name = arr.join('.');
    list.push(obj);
  });
  return list;
}