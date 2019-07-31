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
  return new Promise(async (resolve, reject) => {
    const num = config.maxNum || 2;
    let sourcePath = file.path;
    for(let i = 0; i < num; i++) {
      const beforeSize = fs.lstatSync(sourcePath).size;
      let outPath = path.join(config.tinyDir, `${file.name}-${i + 1}.png`);
      let source = tinify.fromFile(sourcePath);
      console.log(`压缩第${i+1}次`)
      await source.toFile(outPath);
      const tinySize = fs.lstatSync(outPath).size;
      console.log(`压缩前大小${beforeSize / 1000}KB`, `压缩后大小${tinySize / 1000}KB`, `压缩率${((beforeSize - tinySize) / beforeSize).toFixed(4) * 100}%`)
      if (tinySize - beforeSize < config.minSize) {
        break;
      }
      sourcePath = outPath;
    }
    console.log('压缩结束');
    resolve();
  })
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