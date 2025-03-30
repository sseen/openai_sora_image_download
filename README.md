# OpenAI Sora 资源下载工具

这是一个 Tampermonkey 用户脚本，用于下载 OpenAI Sora 页面上的图片和视频资源。

## 功能特点

- 自动检测页面中的 OpenAI 图片和视频资源
- 一键下载所有找到的资源
- 友好的用户界面，包含两个功能按钮
- 实时显示找到的资源数量

## 安装步骤

1. 首先安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击 Tampermonkey 的"添加新脚本"
3. 将 `tampermonkey_use.js` 中的代码复制粘贴进去
4. 保存脚本

## 使用方法

1. 访问包含 OpenAI Sora 资源的网页
2. 页面右下角会出现两个按钮：
   - "查找 OpenAI 图片/视频"：点击扫描页面资源
   - "下载全部"：点击下载所有找到的资源

## 注意事项

- 脚本会自动检测以 `https://videos.openai.com/vg-assets/assets` 开头的资源
- 下载的文件会保存在浏览器默认的下载目录中
- 如果文件名无法获取，将使用默认命名格式：`openai_asset_[序号].webp`

## 许可证

MIT

## 作者

Solo