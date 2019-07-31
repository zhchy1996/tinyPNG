
const path = require('path')
module.exports = {
  // 压缩次数
  maxNum: 5,
  // 源文件目录
  sourceDir: path.join(__dirname, './sourceImg'),
  // 输出目录
  tinyDir: path.join(__dirname, './tinyImg'),
  // 秘钥
  key: '',
  // 压缩小于多少后停止压缩,单位kb
  minSize: 1000
}