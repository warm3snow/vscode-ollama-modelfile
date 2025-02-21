# VSCode Ollama Modelfile Extension

<p align="center">
  <img src="resources/logo.png" alt="VSCode Ollama Modelfile Logo" width="128"/>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=warm3snow.vscode-ollama-modelfile">
    <img src="https://img.shields.io/visual-studio-marketplace/i/warm3snow.vscode-ollama-modelfile?logo=visual-studio-code" alt="Downloads"/>
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=warm3snow.vscode-ollama-modelfile">
    <img src="https://img.shields.io/visual-studio-marketplace/r/warm3snow.vscode-ollama-modelfile?logo=visual-studio-code" alt="Rating"/>
  </a>
  <a href="https://github.com/warm3snow/vscode-ollama-modelfile">
    <img src="https://img.shields.io/github/stars/warm3snow/vscode-ollama-modelfile?style=social" alt="GitHub stars"/>
  </a>
  <a href="https://github.com/warm3snow/vscode-ollama-modelfile/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"/>
  </a>
</p>

[English](README.md) | [中文](README_CN.md)

A VS Code extension for managing Ollama models through Modelfile. Easily to edit Modelfile and generate models.

## ✨ Features

- 🤖 This extension provides commands to help you manage Ollama models:
    - **Set Ollama URL**: Configure Ollama server URL (default: http://localhost:11434)
    - **Create Modelfile**: Create a new Modelfile template
    - **Create Model**: Generate model from Modelfile
    - **Run Model**: Execute model with current configuration
    - **Delete Model**: Remove existing model


## 🚀 Quick Start

## 📺 Tutorial

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama

   # Linux
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Install Extension**
   - Open Extensions in VS Code
   - Search for "VSCode Ollama Modelfile"
   - Click Install

3. **Configure Extension**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Run "Ollama Modelfile: Set Ollama URL"
   - Enter your Ollama server URL

4. **Create Modelfile**
   - Open in a workspace or folder
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Run "Ollama Modelfile: Create Modelfile"

5. **Create Model**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Run "Ollama Modelfile: Create Model"
   - Select the Modelfile to use

6. **Run Model**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Run "Ollama Modelfile: Run Model"
   - Input the prompt
   - Select the model to run

7. **Delete Model**
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Run "Ollama Modelfile: Delete Model"
   - Select the model to delete

## 📝 Usage

### Commands
- `Ollama Modelfile: Set Ollama URL` - Set the Ollama server URL
- `Ollama Modelfile: Create Modelfile` - Create a new Modelfile template
- `Ollama Modelfile: Create Model` - Generate model from Modelfile
- `Ollama Modelfile: Run Model` - Execute model with current configuration
- `Ollama Modelfile: Delete Model` - Remove existing model

## ❤️ Support & Donation

If you find this extension helpful, you can support the developer by:

<details>
<summary>💰 Donation Methods</summary>

<p align="center">Support the developer</p>

<table>
  <tr>
    <td align="center">
      <img src="resources/wechat.jpg" alt="WeChat Pay" width="240"/>
      <br/>
      WeChat Pay
    </td>
    <td align="center">
      <img src="resources/alipay.jpg" alt="Alipay" width="240"/>
      <br/>
      Alipay
    </td>
  </tr>
</table>

### 🪙 Cryptocurrency

<table>
  <tr>
    <td>
      <b>Bitcoin</b>
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
      <b>Ethereum</b>
    </td>
    <td>
      <code>0xB0DA3bbC5e9f8C4b4A12d493A72c33dBDf1A9803</code>
    </td>
  </tr>
  <tr>
    <td>
      <b>Solana</b>
    </td>
    <td>
      <code>AMvPLymJm4TZZgvrYU7DCVn4uuzh6gfJiHWNK35gmUzd</code>
    </td>
  </tr>
</table>

</details>

Your support helps maintain and improve this extension! Thank you! ❤️
- ⭐ Star the [GitHub repository](https://github.com/warm3snow/vscode-ollama-modelfile)
- 📝 Submit issues or feedback
- 🚀 Contribute to the codebase
- 💬 Share with your friends

## 📝 Release Notes

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## 📝 License

This extension is licensed under the [MIT License](LICENSE).