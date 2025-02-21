// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-ollama-modelfile" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let createModelfile = vscode.commands.registerCommand('ollama-modelfile.createModelfile', async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('Please open a workspace first');
			return;
		}

		// 让用户输入文件名
		const fileName = await vscode.window.showInputBox({
			prompt: 'Enter Modelfile name',
			placeHolder: 'e.g., chatbot, coder, assistant',
			validateInput: (value) => {
				if (!value) {
					return 'File name cannot be empty';
				}
				if (value.includes('/') || value.includes('\\')) {
					return 'File name cannot contain path separators';
				}
				return null;
			}
		});

		if (!fileName) {
			return;
		}

		// 让用户选择模板类型
		const templateType = await vscode.window.showQuickPick([
			{ label: 'Basic Model', description: 'Basic model with essential settings' },
			{ label: 'Chat Assistant', description: 'Model configured for chat interactions' },
			{ label: 'Custom Parameters', description: 'Model with advanced parameter settings' },
			{ label: 'With Message History', description: 'Model with predefined conversation history' }
		], {
			placeHolder: 'Select a Modelfile template'
		});

		if (!templateType) {
			return;
		}

		// 根据选择生成不同的模板内容
		let templateContent = '';
		switch (templateType.label) {
			case 'Basic Model':
				templateContent = `# Basic Modelfile
FROM llama2

# Set your model name
MODEL mymodel

# Set system message
SYSTEM """You are a helpful AI assistant."""

# Set basic parameters
PARAMETER temperature 0.7
PARAMETER num_ctx 4096`;
				break;

			case 'Chat Assistant':
				templateContent = `# Chat Assistant Modelfile
FROM mistral

# Set your model name
MODEL mychatbot

# Configure the chat behavior
SYSTEM """You are a friendly and helpful AI assistant. You provide clear, 
accurate, and concise responses while maintaining a conversational tone."""

# Set chat-optimized parameters
PARAMETER temperature 0.8
PARAMETER top_p 0.9
PARAMETER top_k 50

# Define chat template
TEMPLATE """{{ if .System }}
<|im_start|>system
{{ .System }}
<|im_end|>
{{ end }}
{{ if .Prompt }}
<|im_start|>user
{{ .Prompt }}
<|im_end|>
{{ end }}
<|im_start|>assistant
{{ .Response }}
<|im_end|>"""`;
				break;

			case 'Custom Parameters':
				templateContent = `# Advanced Parameters Modelfile
FROM llama2

# Set your model name
MODEL myadvanced

# Comprehensive parameter configuration
PARAMETER temperature 0.7    # Controls creativity (0.1-2.0)
PARAMETER top_k 40          # Limits vocabulary diversity
PARAMETER top_p 0.9         # Nucleus sampling threshold
PARAMETER num_ctx 4096      # Context window size
PARAMETER repeat_penalty 1.1 # Repetition penalty
PARAMETER mirostat 1        # Sampling control (0,1,2)
PARAMETER mirostat_tau 5.0  # Target entropy
PARAMETER mirostat_eta 0.1  # Learning rate

# System configuration
SYSTEM """You are an AI assistant with advanced capabilities."""`;
				break;

			case 'With Message History':
				templateContent = `# Modelfile with Message History
FROM llama2

# Set your model name
MODEL myconversational

# Configure base behavior
SYSTEM """You are a helpful AI assistant with consistent response patterns."""

# Example conversation history
MESSAGE user "What's the weather like?"
MESSAGE assistant "I apologize, but I don't have access to real-time weather data. You would need to check a weather service or look outside for current weather conditions."
MESSAGE user "Can you help me with coding?"
MESSAGE assistant "Of course! I'd be happy to help you with programming. Please share your specific coding question or the problem you're trying to solve."

# Parameters for conversation
PARAMETER temperature 0.7
PARAMETER num_ctx 4096
PARAMETER repeat_penalty 1.1`;
				break;
		}

		// 构建文件名（自动添加.modelfile后缀）
		const fullFileName = fileName.toLowerCase().endsWith('.modelfile') 
			? fileName 
			: `${fileName}.modelfile`;

		// 构建完整的文件路径
		const uri = vscode.Uri.file(
			path.join(workspaceFolders[0].uri.fsPath, fullFileName)
		);

		// 检查文件是否已存在
		try {
			await vscode.workspace.fs.stat(uri);
			const overwrite = await vscode.window.showWarningMessage(
				`File ${fullFileName} already exists. Do you want to overwrite it?`,
				'Yes',
				'No'
			);
			if (overwrite !== 'Yes') {
				return;
			}
		} catch (err) {
			// 文件不存在，可以继续创建
		}

		// 写入文件
		try {
			await vscode.workspace.fs.writeFile(uri, Buffer.from(templateContent));
			const doc = await vscode.workspace.openTextDocument(uri);
			await vscode.window.showTextDocument(doc);
			vscode.window.showInformationMessage(`Modelfile '${fullFileName}' created successfully!`);
		} catch (err) {
			vscode.window.showErrorMessage(`Failed to create Modelfile: ${err}`);
		}
	});

	// 从 Modelfile 创建模型的命令
	let createModel = vscode.commands.registerCommand('ollama-modelfile.createModel', async () => {
		// 获取当前文件
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('Please open a Modelfile first');
			return;
		}

		const filePath = editor.document.uri.fsPath;
		const fileName = path.basename(filePath);
		
		// 检查是否是 Modelfile
		if (fileName.toLowerCase() !== 'modelfile') {
			vscode.window.showErrorMessage('Please open a Modelfile');
			return;
		}

		// 获取模型名称
		const modelName = await vscode.window.showInputBox({
			prompt: 'Enter model name',
			placeHolder: 'e.g., mychatbot'
		});

		if (!modelName) {
			return;
		}

		// 创建输出通道
		const outputChannel = vscode.window.createOutputChannel('Ollama Model Creation');
		outputChannel.show();

		try {
			outputChannel.appendLine(`Creating model ${modelName}...`);
			const { stdout, stderr } = await execAsync(`ollama create ${modelName} -f "${filePath}"`);
			outputChannel.appendLine(stdout);
			if (stderr) {
				outputChannel.appendLine(`Warnings: ${stderr}`);
			}
			vscode.window.showInformationMessage(`Model ${modelName} created successfully!`);
		} catch (error: any) {
			outputChannel.appendLine(`Error: ${error.message}`);
			vscode.window.showErrorMessage(`Failed to create model: ${error.message}`);
		}
	});

	// 运行模型的命令
	let runModel = vscode.commands.registerCommand('ollama-modelfile.runModel', async () => {
		// 获取可用的模型列表
		try {
			const { stdout } = await execAsync('ollama list');
			const models = stdout.split('\n')
				.filter(line => line.trim())
				.map(line => line.split(' ')[0])
				.filter(model => model && model !== 'NAME');

			// 让用户选择模型
			const selectedModel = await vscode.window.showQuickPick(models, {
				placeHolder: 'Select a model to run'
			});

			if (!selectedModel) {
				return;
			}

			// 获取用户输入
			const prompt = await vscode.window.showInputBox({
				prompt: 'Enter your prompt',
				placeHolder: 'e.g., What is the meaning of life?'
			});

			if (!prompt) {
				return;
			}

			// 创建输出通道
			const outputChannel = vscode.window.createOutputChannel('Ollama Model Run');
			outputChannel.show();

			// 运行模型
			const child = exec(`ollama run ${selectedModel} "${prompt}"`);
			
			child.stdout?.on('data', (data) => {
				outputChannel.append(data.toString());
			});

			child.stderr?.on('data', (data) => {
				outputChannel.append(`Error: ${data}`);
			});

		} catch (error: any) {
			vscode.window.showErrorMessage(`Failed to run model: ${error.message}`);
		}
	});

	// 运行模型（详细模式）的命令
	let runModelVerbose = vscode.commands.registerCommand('ollama-modelfile.runModelVerbose', async () => {
		try {
			const { stdout } = await execAsync('ollama list');
			const models = stdout.split('\n')
				.filter(line => line.trim())
				.map(line => line.split(' ')[0])
				.filter(model => model && model !== 'NAME');

			const selectedModel = await vscode.window.showQuickPick(models, {
				placeHolder: 'Select a model to run'
			});

			if (!selectedModel) {
				return;
			}

			const prompt = await vscode.window.showInputBox({
				prompt: 'Enter your prompt',
				placeHolder: 'e.g., What is the meaning of life?'
			});

			if (!prompt) {
				return;
			}

			const outputChannel = vscode.window.createOutputChannel('Ollama Model Run (Verbose)');
			outputChannel.show();

			const child = exec(`ollama run ${selectedModel} "${prompt}" --verbose`);
			
			child.stdout?.on('data', (data) => {
				outputChannel.append(data.toString());
			});

			child.stderr?.on('data', (data) => {
				outputChannel.append(`Debug: ${data}`);
			});

		} catch (error: any) {
			vscode.window.showErrorMessage(`Failed to run model: ${error.message}`);
		}
	});

	context.subscriptions.push(createModelfile, createModel, runModel, runModelVerbose);
}

// This method is called when your extension is deactivated
export function deactivate() {}
