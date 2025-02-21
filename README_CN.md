# VSCode Ollama Modelfile 扩展

<p align="center">
  <img src="resources/logo.png" alt="VSCode Ollama Modelfile Logo" width="128"/>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=warm3snow.vscode-ollama-modelfile">
    <img src="https://img.shields.io/visual-studio-marketplace/i/warm3snow.vscode-ollama-modelfile?logo=visual-studio-code" alt="下载量"/>
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=warm3snow.vscode-ollama-modelfile">
    <img src="https://img.shields.io/visual-studio-marketplace/r/warm3snow.vscode-ollama-modelfile?logo=visual-studio-code" alt="评分"/>
  </a>
  <a href="https://github.com/warm3snow/vscode-ollama-modelfile">
    <img src="https://img.shields.io/github/stars/warm3snow/vscode-ollama-modelfile?style=social" alt="GitHub 星标"/>
  </a>
  <a href="https://github.com/warm3snow/vscode-ollama-modelfile/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="许可证: MIT"/>
  </a>
</p>

[English](README.md) | [中文](README_CN.md)

一个用于通过 Modelfile 管理 Ollama 模型的 VS Code 扩展。轻松编辑 Modelfile 并生成模型。

## ✨ 特性

- 🤖 本扩展提供以下命令来帮助您管理 Ollama 模型：
    - **设置 Ollama URL**：配置 Ollama 服务器 URL（默认：http://localhost:11434）
    - **创建 Modelfile**：创建新的 Modelfile 模板
    - **创建模型**：从 Modelfile 生成模型
    - **运行模型**：使用当前配置执行模型
    - **删除模型**：移除现有模型

## 🚀 快速开始

## 📺 使用教程

1. **安装 Ollama**
   ```bash
   # macOS
   brew install ollama

   # Linux
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **安装扩展**
   - 在 VS Code 中打开扩展
   - 搜索 "VSCode Ollama Modelfile"
   - 点击安装

3. **配置扩展**
   - 打开命令面板（Ctrl+Shift+P / Cmd+Shift+P）
   - 运行 "Ollama Modelfile: Set Ollama URL"
   - 输入您的 Ollama 服务器 URL

4. **创建 Modelfile**
   - 在工作区或文件夹中打开
   - 打开命令面板（Ctrl+Shift+P / Cmd+Shift+P）
   - 运行 "Ollama Modelfile: Create Modelfile"

5. **创建模型**
   - 打开命令面板（Ctrl+Shift+P / Cmd+Shift+P）
   - 运行 "Ollama Modelfile: Create Model"
   - 选择要使用的 Modelfile

6. **运行模型**
   - 打开命令面板（Ctrl+Shift+P / Cmd+Shift+P）
   - 运行 "Ollama Modelfile: Run Model"
   - 输入提示
   - 选择要运行的模型

7. **删除模型**
   - 打开命令面板（Ctrl+Shift+P / Cmd+Shift+P）
   - 运行 "Ollama Modelfile: Delete Model"
   - 选择要删除的模型

## 📝 使用说明

### 命令
- `Ollama Modelfile: Set Ollama URL` - 设置 Ollama 服务器 URL
- `Ollama Modelfile: Create Modelfile` - 创建新的 Modelfile 模板
- `Ollama Modelfile: Create Model` - 从 Modelfile 生成模型
- `Ollama Modelfile: Run Model` - 使用当前配置执行模型
- `Ollama Modelfile: Delete Model` - 移除现有模型

## ❤️ 支持与捐赠

如果您觉得这个扩展有帮助，可以通过以下方式支持开发者：

<details>
<summary>💰 捐赠方式</summary>

<p align="center">支持开发者</p>

<table>
  <tr>
    <td align="center">
      <img src="resources/wechat.jpg" alt="微信支付" width="240"/>
      <br/>
      微信支付
    </td>
    <td align="center">
      <img src="resources/alipay.jpg" alt="支付宝" width="240"/>
      <br/>
      支付宝
    </td>
  </tr>
</table>

### 🪙 加密货币

<table>
  <tr>
    <td>
      <b>比特币</b>
    </td>
    <td>
      <b>Native Segwit</b><br/>
      <code>bc1qskds324wteq5kfmxh63g624htzwd34gky0f0q5</code>
      <br/><br/>
      <b>Taproot</b><br/>
      <code>bc1pk0zud9csztjrkqew54v2nv7g3kq0xc2n80jatkmz9axkve4trfcqp0aksf</code>
    </td>
  </tr>
  <tr>
    <td>
      <b>以太坊</b>
    </td>
    <td>
      <code>0xB0DA3bbC5e9f8C4b4A12d493A72c33dBDf1A9803</code>
    </td>
  </tr>
  <tr>
    <td>
      <b>索拉纳</b>
    </td>
    <td>
      <code>AMvPLymJm4TZZgvrYU7DCVn4uuzh6gfJiHWNK35gmUzd</code>
    </td>
  </tr>
</table>

</details>

您的支持有助于维护和改进这个扩展！感谢您！❤️
- ⭐ 为 [GitHub 仓库](https://github.com/warm3snow/vscode-ollama-modelfile) 点星
- 📝 提交问题或反馈
- 🚀 为代码库做贡献
- 💬 分享给您的朋友

## 📝 发布说明

查看 [CHANGELOG.md](CHANGELOG.md) 获取发布说明。

## 📝 许可证

本扩展基于 [MIT 许可证](LICENSE) 授权。 