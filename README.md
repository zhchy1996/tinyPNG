# 压缩图片
通过tinypng api压缩图片
## 准备工作
为了使用tinyPNG的api，你需要到[tinyPNG开发者页面](https://tinypng.com/developers)去申请一个api key（免费申请，填写电子邮件即可，没月免费压缩500张）
## 启动
1. 克隆后在`config.js`中配置你的key
2. 将待压缩图片放入`sourceImg`目录下(你可以通过`config.js`文件修改这个目录)
    ```js
    npm i

    npm run start
    ```
3. 压缩后图片会存在`tinyImg`下(你可以通过`config.js`文件修改这个目录)