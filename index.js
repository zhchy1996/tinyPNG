const tinify = require('tinify');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

tinify.key = config.key;

init();
function init() {
  compressAll(readSourceImg(config.sourceDir));
}

async function compressAll(imgList) {
  const len = imgList.length;
  for (let i = 0; i < len; i++) {
    const file = imgList[i];
    console.log(`压缩-->${file.name}`, `任务${i + 1}/${len}`);
    compress(file);
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
    // let outPath = path.join(config.tinyDir, `${file.name}.png`);
    let outPath = file.path.replace(new RegExp(config.sourceDir), config.tinyDir)
    let source = tinify.fromFile(sourcePath);
    console.log(`压缩第${i+1}次`)
    dirExists(path.join(outPath, '..'))
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
// console.log(readSourceImg(config.sourceDir));
function readSourceImg(imgPath) {
  const files = fs.readdirSync(imgPath)
  let list = [];

  files.forEach(file => {
    const oPath = path.join(imgPath, file);
    if (fs.lstatSync(oPath).isDirectory()) {
      list = list.concat(readSourceImg(oPath));
    } else {
      let obj = {
        path: oPath,
      }
      let arr = file.split('.');
      if (/png|jpg|jpeg/i.test(arr.pop())) {
        obj.name = arr.join('.');
        list.push(obj);
      } else {
        copyImg(oPath);
      }
    }
  });
  return list;
}

async function copyImg(src) {
  const dist = src.replace(new RegExp(config.sourceDir), config.tinyDir)
  await dirExists(path.join(dist, '..'));
  fs.writeFileSync(dist, fs.readFileSync(src));
}


async function dirExists(dir) {
  let isExists = await getStat(dir);
  //如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {     //如果该路径存在但是文件，返回false
    return false;
  }
  //如果该路径不存在
  let tempDir = path.parse(dir).dir;      //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await dirExists(tempDir);
  let mkdirStatus;
  if (status) {
    mkdirStatus = await mkdir(dir);
  }
  return mkdirStatus;
}


/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    })
  })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(false);
        console.log('创建文件夹失败', err)
      } else {
        console.log('创建文件夹成功', dir)
        resolve(true);
      }
    })
  })
}