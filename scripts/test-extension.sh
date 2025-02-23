#!/bin/bash

extension_name="vscode-ollama-modelfile-1.0.0.vsix"

# 打包扩展
echo "Packaging extension..."
vsce package

# 卸载现有扩展
echo "Uninstalling existing extension..."
code --uninstall-extension $extension_name

# 安装新扩展
echo "Installing new extension..."
code --install-extension $extension_name

echo "Extension test process completed!" 